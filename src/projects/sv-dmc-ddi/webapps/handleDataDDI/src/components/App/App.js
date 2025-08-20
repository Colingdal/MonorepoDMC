/* eslint-disable no-undef */
import * as React from "react";
// import PropTypes from "prop-types";
import styles from "./App.scss";

const App = (data) => {
  const names = data.names;

  return (
    <div className={styles.container}>
      <h3><b>Name</b></h3>
      {names.map((name, index) => (
        <p key={index} className={styles.text}>
          {name}
        </p>
      ))}
    </div>
  );
};

export default App;
