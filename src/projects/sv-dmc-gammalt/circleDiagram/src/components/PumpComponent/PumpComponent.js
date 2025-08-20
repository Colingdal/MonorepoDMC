/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import requester from "@sitevision/api/client/requester";
import toasts from "@sitevision/api/client/toasts";
import LoginComponent from "../LoginComponent";
import DoughnutChart from "../DoughnutChart";  

const PumpComponent = ({ username, password }) => {
  const [telemetryData, setTelemetryData] = useState([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(null);
  const [token, setToken] = useState(null);
  const [view, setView] = useState("table");  

  useEffect(() => {
    if (!token) return;
    getCustomers(token);
  }, [token]);

  const getCustomers = (token) => {
    requester
      .doGet({
        url: "https://iot.deermeadow.se:443/api/customers?pageSize=10&page=0",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((responseData) => {
        if (!responseData || !Array.isArray(responseData.data)) return;
        const customerIds = responseData.data.map((item) => item.id.id);
        customerIds.forEach((id) => getDevicesForCustomer(id, token));
      });
  };

  const getDevicesForCustomer = (customerId, token) => {
    requester
      .doGet({
        url: `https://iot.deermeadow.se:443/api/customer/${customerId}/devices?pageSize=10&page=0`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((deviceResponse) => {
        if (!deviceResponse || !Array.isArray(deviceResponse.data)) return;
        deviceResponse.data.forEach((device) => getTelemetryForDevice(device, token));
      });
  };

  const getTelemetryForDevice = (device, token) => {
    const deviceId = device.id.id;

    requester
      .doGet({
        url: `https://iot.deermeadow.se:443/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=alarmA_breddning,alarmB_hogniva,alarmPumpFailure,alarms,application,brunnDiameterMm,flowRateLpm,gps,operationMode,pumpType,runtimeControlBoardMin,runtimePercent,runtimePump1Min,runtimePump2Min,startLevelMm,stopLevelMm,temperatureC,totalRuntimePump1,totalRuntimePump2,waterColumnMm`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((telemetryResponse) => {
        const cleanedTelemetry = Object.fromEntries(
          Object.entries(telemetryResponse || {}).map(([key, value]) => [
            key,
            value?.[0]?.value || "No data",
          ])
        );
        getDeviceCredentials(device, cleanedTelemetry, token);
      });
  };

  const getDeviceCredentials = (device, telemetry, token) => {
    requester
      .doGet({
        url: `https://iot.deermeadow.se:443/api/device/${device.id.id}/credentials`,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((credRes) => {
        if (!credRes || !credRes.credentialsId) return;

        setTelemetryData((prev) => [
          ...prev,
          {
            name: device.name,
            accessToken: credRes.credentialsId,
            telemetry,
          },
        ]);
      });
  };

  const postFullTelemetry = (accessToken, telemetry) => {
    requester
      .doPost({
        url: `https://iot.deermeadow.se:443/api/v1/${accessToken}/telemetry`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(telemetry),
      })
      .then(() => {
        toasts.publish({
          heading: "Snyggt!",
          type: 'primary',
          message: "Du har uppdaterat din data!",
        });
      })
      .catch((error) => {
        if (error.status === 200) {
          toasts.publish({
            heading: "Snyggt!",
            type: 'primary',
            message: "Du har uppdaterat din data!",
          });
        } else {
          console.error("Error sending telemetry data:", error);
        }
      });
  };

  const renderTable = (device) => {
    const { telemetry, accessToken } = device;

    return (
      <div>
        <table class="env-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(telemetry).map(([key, value]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  {["pumpType", "application", "operationMode"].includes(key) ? (
                    <div class="env-dropdown">
                      <button
                        id={`${key}-${accessToken}-button`}
                        class="env-button env-button--primary env-button--icon env-button--icon-small env-button--icon-after"
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="menu"
                        aria-controls={`${key}-${accessToken}-menu`}
                        data-dropdown
                      >
                        {value}
                        <svg class="env-icon">
                          <use href="/sitevision/envision-icons.svg#icon-angle-down"></use>
                        </svg>
                      </button>
                      <ul
                        id={`${key}-${accessToken}-menu`}
                        role="menu"
                        aria-labelledby={`${key}-${accessToken}-button`}
                        class="env-dropdown__menu"
                      >
                        {(
                          {
                            pumpType: ["enkelpump", "dubbelpump"],
                            application: ["dagvattenpump", "avloppspump"],
                            operationMode: ["växelvis", "parallell"],
                          }[key] || []
                        ).map((item) => (
                          <li role="presentation" key={item}>
                            <a
                              href="#"
                              role="menuitem"
                              class="env-dropdown__item"
                              onClick={(e) => {
                                e.preventDefault();
                                setTelemetryData((prev) =>
                                  prev.map((device) =>
                                    device.accessToken === accessToken
                                      ? {
                                          ...device,
                                          telemetry: {
                                            ...device.telemetry,
                                            [key]: item,
                                          },
                                        }
                                      : device
                                  )
                                );
                              }}
                            >
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : typeof value === "object" ? JSON.stringify(value) : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          class="env-button env-button--primary"
          onClick={() => postFullTelemetry(accessToken, telemetry)}
        >
          Uppdatera all data
        </button>
      </div>
    );
  };

  return (
    <div>
      {!token && (
        <LoginComponent
          username={username}
          password={password}
          onLogin={(receivedToken) => setToken(receivedToken)}
        />
      )}

      {token && (
        <>
          <ul class="env-list">
            {telemetryData.map((device, index) => (
              <li
                key={index}
                class="env-list__item env-list-item-divider--bottom"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedDeviceIndex(index)}
              >
                {device.name}
              </li>
            ))}
          </ul>

          {selectedDeviceIndex !== null && (
            <>
              <div class="example-flex example-flex--align">
                <button
                  onClick={() => setView("table")}
                  type="button"
                  class={`env-button env-m-around--small ${
                    view === "table" ? "env-button--primary" : "env-button--secondary"
                  }`}
                >
                  Tabell
                </button>

                <button
                  onClick={() => setView("graph")}
                  type="button"
                  class={`env-button env-m-around--small ${
                    view === "graph" ? "env-button--primary" : "env-button--secondary"
                  }`}
                >
                  Graf
                </button>
              </div>

              <div>
                <h3>{telemetryData[selectedDeviceIndex].name}</h3>
                {view === "table" ? (
                  renderTable(telemetryData[selectedDeviceIndex])
                ) : (
                  <DoughnutChart telemetryData={telemetryData[selectedDeviceIndex].telemetry} />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

PumpComponent.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default PumpComponent;
