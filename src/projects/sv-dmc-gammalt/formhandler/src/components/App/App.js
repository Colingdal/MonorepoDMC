import React from "react";
import JsonHandler from "../JsonHandler";  
import styles from "./App.scss";        

const App = () => {
  return (
    <div className={styles.container}>
     
        <JsonHandler />
       
    </div>
  );
};

export default App;
