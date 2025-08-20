/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import requester from "@sitevision/api/client/requester";

const LoginComponent = ({ username, password, onLogin }) => {
  useEffect(() => {
    const login = () => {
      requester
        .doPost({
          url: "https://iot.deermeadow.se:443/api/auth/login",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          data: JSON.stringify({ username, password }),
        })
        .then((response) => {
          if (response && response.token) {
            onLogin(response.token);
          } else {
            console.warn("Login failed or no token in response.", response);
          }
        })
        .catch((error) => {
          console.error("Login error:", error);
        });
    };

    login();
  }, [username, password]);

  return null; 
};

LoginComponent.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default LoginComponent;
