import * as React from "react";
import { renderToString } from "react-dom/server";
import router from "@sitevision/api/common/router";
// import appData from "@sitevision/api/server/appData";
import requester from "@sitevision/api/server/Requester";
import logUtil from "@sitevision/api/server/LogUtil";
import App from "./components/App";
import appData from "@sitevision/api/server/appData";

const suggestion = appData.get("checkboxsuggestion");
// const path = appData.get("checkboxpath");
const timeandauthor = appData.get("checkboxtimeauthor");
const numberofhits = appData.get("numberofhits");
const totalhits = appData.get("checkboxtotalhits");  
const splitpages = appData.get("checkboxpages");
const hitsperpage = appData.get("hitsperpage");
const checkboxerror = appData.get("checkboxerror");
const checkboxstar = appData.get("checkboxstar");
const hitcount = appData.get("hitcount");

// const structure = appData.get("structure"); 
// const images = appData.get("images"); id 18. 
// const files = appData.get("files"); id 18
// const articles = appData.get("articles"); id.5
// const pages = appData.get("pages"); id 4.



logUtil.info(suggestion);

router.get('/Search', (req, res) => {
  logUtil.info(JSON.stringify(req));
  const searchQuery = req.params.searchQuery;
  const totalItems = req.params.totalItems;
  const page = req.params.page;
  logUtil.info(searchQuery);
  const start = page;
  logUtil.info('start, ' + start);
  const rows = splitpages ? hitsperpage : totalItems;

  let encodedSearchQuery = encodeURIComponent(searchQuery).replace(/%20/g, '+');

  if (checkboxstar === true) {
    encodedSearchQuery = encodedSearchQuery + '*';
  }
  const searchUrl = `http://172.31.61.194:8080/dashboard-1/search?q=${encodedSearchQuery}&start=${start}&rows=${rows}`;
  logUtil.info(searchUrl);

  requester.get(searchUrl)
    .done((response) => {
      logUtil.info('Search response: ' + JSON.stringify(response));
      res.json({
        response,
      });
    })
    .fail((error) => {
      logUtil.error('Error fetching search results: ' + JSON.stringify(error));
      res.status(500).json({ error: 'Failed to fetch search results' });
    });
});

    router.get("/", (req, res) => {
      const data = {
        suggestion,
        numberofhits,
        timeandauthor,
        totalhits,
        splitpages,
        hitsperpage,
        checkboxerror,
        checkboxstar,
        hitcount
      };
      res.agnosticRender(renderToString(<App {...data} />), data);
    });
    