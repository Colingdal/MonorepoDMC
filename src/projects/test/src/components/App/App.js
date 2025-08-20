import * as React from "react";
import PropTypes from "prop-types";
import styles from "./App.scss";
import logo from '../../../../../resources/images/profile.jpg';

const App = ({ message, name }) => {
  console.log('logo, ' + logo);
  return (
    <div className={styles.container}>
      {/* 👇 Show the picture here */}
      <img src={logo} alt="Profile" className={styles.image} />

      <p className={styles.text}>
        {message} {name}
      </p>
    </div>
  );
};

App.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string,
};

export default App;
