/* eslint-disable no-prototype-builtins */
import * as React from "react";
import { renderToString } from "react-dom/server";
import router from "@sitevision/api/common/router";
import appData from "@sitevision/api/server/appData";
import App from "./components/App";
import properties from "@sitevision/api/server/Properties";
import logUtil from "@sitevision/api/server/LogUtil";
import restApi from "@sitevision/api/server/RestApi";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import userFactory from "@sitevision/api/server/UserFactory";
import metadataDefinitionUtil from "@sitevision/api/server/MetadataDefinitionUtil";
import i18n from "@sitevision/api/common/i18n";

// App config
const view = appData.get("view");
const socialAllowed = appData.get("checkboxBooleanSocialCollaboration");
const button = appData.get("button");
const color = resourceLocatorUtil.getNodeByIdentifier(appData.get("color"));
const hexColor = properties.get(color, 'htmlHexValue');
const currentUserResponsible = appData.get("checkboxBooleanCurrentUser");
const pageMetadata = appData.get('metadata');
const choosendirectReportsText = appData.get('directReportsText');
const choosenManagerText = appData.get('managerText');
const sitePage = properties.get(resourceLocatorUtil.getSitePage(), "jcr:uuid");
const userf = appData.get('userfields');

// Metadata lookup
const currentPage = portletContextUtil.getCurrentPage();
const metadataDef = metadataDefinitionUtil.getDefinitions(currentPage);
let metadataName = '';
metadataDef.forEach(element => {
  const elementObj = properties.get(element, 'jcr:uuid', 'name');
  if (elementObj['jcr:uuid'] === pageMetadata) metadataName = elementObj.name;
});

// Determine responsible
let metadata = undefined;
let responsible = '';
if (!currentUserResponsible && view === 'mycollegues') {
  try {
    metadata = properties.get(currentPage, metadataName)[0];
    responsible = properties.get(metadata, 'mail');
  } catch {
    router.get('/', (req, res) => {
      res.send(i18n.get('errorText'));
    });
    logUtil.info('There is a problem with the metadata');
  }
} else {
  responsible = properties.get(portletContextUtil.getCurrentUser(), 'mail');
}

// Fetch all contacts
const eRepository = sitePage.replace("sitePage", "externalPrincipalRepository");
const externalRepositoryObjekt = resourceLocatorUtil.getNodeByIdentifier(eRepository);
const response = restApi.get(externalRepositoryObjekt, "nodes");
const allNodes = response.body;

const allContacts = allNodes
  .map((child) => {
    const node = resourceLocatorUtil.getNodeByIdentifier(child.id);
    const manager = properties.get(node, choosenManagerText);
    const directReports = properties.get(node, choosendirectReportsText);

    let profileImageURL = "";
    let userFields = [];
    let phone = null;
    let data = {};

    // Build ordered userFields list
    if (userf && Array.isArray(userf)) {
      userFields = userf
        .map((field) => {
          const label = properties.get(field, "displayName");
          const key = properties.get(field, "identifier");
          return label && key ? { label, key } : null;
        })
        .filter(Boolean);
    }

    if (socialAllowed) {
      const socialUser = restApi.get(node, "nodes");
      if (socialUser.body && socialUser.body.length > 0) {
        const socialUserID = socialUser.body[0].id;
        const socailUserNode = resourceLocatorUtil.getNodeByIdentifier(socialUserID);
        const userfields = restApi.get(socailUserNode, "userfields");

        const fields = userfields.body || [];

        // Extract user data in order
        fields.forEach(({ identifier, value }) => {
          const match = userFields.find(field => field.key === identifier);
          if (match) {
            data[identifier] = value;
          }
        });

        // Always include fallback identifiers if available
        // if (!data.fullname) data.fullname = properties.get(node, "displayName");
        // if (!data.mail) data.mail = properties.get(node, "mail");
        // if (!data.telephoneNumber) data.telephoneNumber = properties.get(node, "mobil");

        const wrappedUser = userFactory.getUserIdentityWrapper(socailUserNode);
        const profileImage = wrappedUser.getProfileImage();
        profileImageURL = properties.get(profileImage, "URL");
      } 
      // else {
      //   data.fullname = properties.get(node, "displayName");
      //   data.mail = properties.get(node, "mail");
      //   data.telephoneNumber = properties.get(node, "mobil");
      // }
    } else {
      phone = properties.get(node, "mobil");
    }

    if (manager || directReports) {
      const baseContact = {
        id: child.id,
        externalID: properties.get(node, "externalId"),
        manager,
        name: properties.get(node, "displayName"),
        mail: properties.get(node, "mail"),
        directReports
      };

      return socialAllowed
        ? {
            ...baseContact,
            profileImage: profileImageURL,
            userFields,
            data
          }
        : {
            ...baseContact,
            phone
          };
    }

    return null;
  })
  .filter(Boolean);

const noManager = allContacts.filter((contact) => !contact.manager);

// ROUTES
router.get("/manager", (req, res) => {
  const userID = req.params.id;
  const user = resourceLocatorUtil.getNodeByIdentifier(userID);
  const manager = properties.get(user, choosenManagerText);
  const managerNode = allContacts.find((contact) => contact.externalID === manager);

  if (!manager) {
    return res.status(200).json({ message: "No manager" });
  }
  res.json({ managerNode });
});

router.get("/directReports", (req, res) => {
  const userID = req.params.id;
  const user = resourceLocatorUtil.getNodeByIdentifier(userID);
  const directReports = properties.get(user, choosendirectReportsText);

  if (!directReports || directReports.length === 0) {
    return res.status(200).json({ message: "No direct reports" });
  }

  const directReportsNodes = allContacts.filter((contact) =>
    directReports.includes(contact.externalID)
  );

  res.json({ directReportsNodes });
});

router.get("/sharedManagers", (req, res) => {
  const userID = req.params.id;
  const user = resourceLocatorUtil.getNodeByIdentifier(userID);
  const userManager = properties.get(user, choosenManagerText);

  if (!userManager) {
    return res.status(200).json({ message: "No shared managers" });
  }

  const sharedManagers = allContacts.filter(
    (colleague) => colleague.manager === userManager && colleague.id !== userID
  );

  if (sharedManagers.length === 0) {
    return res.status(200).json({ message: "No shared managers" });
  }

  res.json({ sharedManagers });
});

router.get("/", (req, res) => {
  const responsibleInContacts = allContacts.some(contact =>
    contact.mail === responsible
  );

  if (!responsibleInContacts && view === 'mycollegues') {
    logUtil.error(`Responsible user (${responsible}) not found in allContacts`);
    return res.send(i18n.get('errorText2'));
  }

  const data = {
    view,
    allContacts,
    noManager,
    hexColor,
    responsible,
    socialAllowed,
    button
  };

  res.agnosticRender(renderToString(<App {...data} />), data);
});
