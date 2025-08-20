import router from "@sitevision/api/common/router";
import restApi from "@sitevision/api/server/RestApi";
import resourceLocatorUtil from "@sitevision/api/server/ResourceLocatorUtil";
import properties from "@sitevision/api/server/Properties";
import appData from "@sitevision/api/server/appData";
import trashcanUtil from "@sitevision/api/server/TrashcanUtil";
import privileged from '@sitevision/api/server/privileged';

const selectedFolder = appData.get("folder");
const folderNode = resourceLocatorUtil.getNodeByIdentifier(properties.get(selectedFolder, "jcr:uuid"));

router.get("/getDataFromRepository", (req, res) => {
  if (!privileged.isConfigured()) {
    return res.status(500).json({ error: "Privileged mode is not configured." });
  }

  privileged.doPrivilegedAction(() => {
    try {
      let folderId = req.params.id;

      if (!folderId && !folderNode) {
        return res.status(404).json({ error: "No selected folder found" });
      }

      if (!folderId) {
        folderId = properties.get(folderNode, "jcr:uuid");
      }

      if (!folderId.startsWith('19')) {
        return res.status(400).json({ error: "You have to select a folder or provide a valid ID for a folder" });
      }

      const pageNode = resourceLocatorUtil.getNodeByIdentifier(folderId);
      if (!pageNode) {
        return res.status(404).json({ error: "Invalid folder ID" });
      }

      const pages = restApi.get(pageNode, "nodes").body || [];

      const pagesWithFiles = pages.map((page) => {
        const pageNode = resourceLocatorUtil.getNodeByIdentifier(page.id);
        const fileRepo = resourceLocatorUtil.getLocalFileRepository(pageNode);
        const files = restApi.get(fileRepo, "nodes").body || [];

        files.forEach(file => {
          const fileNode = resourceLocatorUtil.getNodeByIdentifier(file.id);
          file.url = encodeURI(properties.get(fileNode, 'URL'));
        });

        return { ...page, files };
      });

      const result = {
        uuid: properties.get(pageNode, "jcr:uuid"),
        name: properties.get(pageNode, "displayName"),
        uri: encodeURI(properties.get(pageNode, 'URI')), 
        url: encodeURI(properties.get(pageNode, 'URL')), 
        children: pagesWithFiles,
      };

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

router.get("/downloadFiles", (req, res) => {
  if (!privileged.isConfigured()) {
    return res.status(500).json({ error: "Privileged mode is not configured." });
  }

  privileged.doPrivilegedAction(() => {
    try {
      const pageId = req.params.id;

      if (!pageId) {
        return res.status(400).json({ error: "Missing 'id' parameter" });
      }

      if (!pageId.startsWith("4")) {
        return res.status(404).json({ error: "The provided ID must belong to a page" });
      }

      const pageNode = resourceLocatorUtil.getNodeByIdentifier(pageId);
      if (!pageNode) {
        return res.status(404).json({ error: "Page not found" });
      }

      const fileRepo = resourceLocatorUtil.getLocalFileRepository(pageNode);
      const files = restApi.get(fileRepo, "nodes").body || [];

      if (files.length === 0) {
        return res.status(404).json({ message: "No files found in this folder" });
      }

      const fileList = files.map(file => {
        const fileNode = resourceLocatorUtil.getNodeByIdentifier(file.id);
        return {
          name: file.name,
          id: file.id,
          uri: encodeURI(properties.get(fileNode, 'URI')),
          url: encodeURI(properties.get(fileNode, 'URL'))
        };
      });

      res.status(200).json(fileList);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

router.delete("/deleteDownloadedFile", (req, res) => {
  if (!privileged.isConfigured()) {
    return res.status(500).json({ error: "Privileged mode is not configured." });
  }

  privileged.doPrivilegedAction(() => {
    try {
      const fileId = req.params.id;

      if (!fileId ) {
        return res.status(400).json({ error: "Missing 'id' parameter" });
      }

      if (!fileId.startsWith("18")) {
        return res.status(404).json({ error: "The provided ID must belong to a file" });
      }

      const fileNode = resourceLocatorUtil.getNodeByIdentifier(fileId);
      if (!fileNode) {
        return res.status(404).json({ error: `File with ID ${fileId} not found` });
      }

      const isInTrash = trashcanUtil.isInTrashcan(fileNode);
      if (isInTrash) {
        return res.status(400).json({ error: "This item has already been moved to the trash" });
      }

      trashcanUtil.moveNodeToTrashcan(fileNode);

      return res.status(200).json({ message: `File with ID ${fileId} has been successfully moved to trash.` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
});
