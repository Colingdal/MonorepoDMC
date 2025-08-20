import router from "@sitevision/api/common/router";
import logUtil from "@sitevision/api/server/LogUtil";
import storage from "@sitevision/api/server/storage";

const collectionDataStore = storage.getCollectionDataStore('dataRetrieverDDI');

router.post("/myroute", (req, res) => {

  const {name, mail, number} = req.params;
  try {
    const post = collectionDataStore.add({
      name,
      mail,
      number
    });
    collectionDataStore.instantIndex(post.dsid);
    logUtil.info(JSON.stringify(post));

    res.json({ message: "Hello from POST" });  } catch (e) {
    logUtil.error("Error storing data: " + JSON.stringify(e));
    res.status(500).json({ error: "Failed to store entry", details: e.message });
  }
});

router.get("/myroute", (req, res) => {
  res.json({ message: "Hello from GET" });
});

router.put("/myroute", (req, res) => {
  res.json({ message: "Hello from PUT" });
});

router["delete"]("/myroute", (req, res) => {
  res.json({ message: "Hello from DELETE" });
});
