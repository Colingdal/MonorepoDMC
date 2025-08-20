import router from "@sitevision/api/common/router";
import { renderToString } from "react-dom/server";
import React from "react";
import App from "./components/App";
import logUtil from "@sitevision/api/server/LogUtil";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import appData from "@sitevision/api/server/appData";
import fileUtil from "@sitevision/api/server/FileUtil";
import articleUtil from "@sitevision/api/server/ArticleUtil";

const fil = appData.get("file");
logUtil.info(fil);

const filNode = resourceLocatorUtil.getNodeByIdentifier(fil);
const filString = fileUtil.getContentAsString(filNode);

logUtil.info(filString);

let jsonData; 
const websiteData = {
  metadata: {},
  pages: [],
};

try {
  jsonData = JSON.parse(filString); 
  logUtil.info(`Parsed JSON data: ${JSON.stringify(jsonData)}`);

  if (jsonData.metadata) {
    websiteData.metadata = {
      title: jsonData.metadata.title || "",
      content: jsonData.metadata.content || "",
      // lastModified: jsonData.metadata.lastModified || "",
    };
    logUtil.info(`Extracted metadata: ${JSON.stringify(websiteData.metadata)}`);
  }

  if (jsonData.pages && Array.isArray(jsonData.pages)) {
    websiteData.pages = jsonData.pages.map((page) => ({
      title: page.title || "",
      content: page.content || "",
      // lastModified: jsonData.metadata.lastModified || "",
    }));
    logUtil.info(`Extracted pages: ${JSON.stringify(websiteData.pages)}`);
  }
} catch (error) {
  logUtil.error(`Error parsing JSON: ${error.message}`);
}

const imageUrls = [
  "http://dmc-utv.deermeadow.se/images/18.2ad4bdd1193e2a8938b16/1734705637864/nedladdning%20(1).jpeg",
  "http://dmc-utv.deermeadow.se/images/18.2ad4bdd1193e2a8938b13/1734705631226/images%20(2).jpeg",
  "http://dmc-utv.deermeadow.se/images/18.2ad4bdd1193e2a8938b10/1734705626786/images%20(1).jpeg",
  "http://dmc-utv.deermeadow.se/images/18.2ad4bdd1193e2a8938bd/1734705620639/images.jpeg",
  "http://dmc-utv.deermeadow.se/images/18.2ad4bdd1193e2a8938ba/1734705613744/nedladdning%20(2).jpeg",
  "http://dmc-utv.deermeadow.se/images/18.2ad4bdd1193e2a8938b7/1734705606063/nedladdning.jpeg",
  "http://dmc-utv.deermeadow.se/images/18.4ec82a6f187fee2f71815/1683634975495/skog.jpeg",
  "http://dmc-utv.deermeadow.se/images/18.1397b1af18ad806845c93/1695904454715/hav_0.jpg",
];

function getRandomImageUrl() {
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

websiteData.pages.forEach((page) => {
  const parent = appData.get("page");
  const template = appData.get("template");

  const parentNode = resourceLocatorUtil.getNodeByIdentifier(parent);
  const templateNode = resourceLocatorUtil.getNodeByIdentifier(template);
  const articleName = page.title;

  const properties = {
    // lastModified: jsonData.metadata.lastModified || "", 
  };

  const randomImage = getRandomImageUrl();


  const content = {
    "Vänsterspalt": `
      <h2>${page.title}</h2>
      <p>${page.content}</p>
    `,
    "Högerspalt": `
      <img src="${randomImage}" alt="${page.title}"/>`,
  };

  // articleUtil.createArticle(parentNode, templateNode, articleName, properties, content);

  logUtil.info(`Prepared article for page: ${page.title}`);
});

router.get("/", (req, res) => {
  const data = {
    websiteData,
  };

  res.agnosticRender(renderToString(<App {...data} />), data);
});
