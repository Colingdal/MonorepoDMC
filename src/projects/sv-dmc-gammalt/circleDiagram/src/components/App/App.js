/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import PumpComponent from "../PumpComponent";
// import TankComponent from "../TankComponent";

const App = (data) => {
  const [view, setView] = useState("pump");

  const renderView = () => {
    switch (view) {
      case "pump":
        return <PumpComponent username={data.username} password={data.password} />;
      case "tank":
        return '<TankComponent />';
      default:
        return <div>Choose a view from the menu</div>;
    }
  };

  return (
    <div class="example-flex env-flex env-flex--direction-column">
      <div class="example-flex example-flex--align env-flex env-flex--justify-content-end">
        <button
          onClick={() => setView("pump")}
          type="button"
          class={`env-button env-m-around--small ${
            view === "pump" ? "env-button--primary" : "env-button--secondary"
          }`}
        >
          Min pump
        </button>

        <button
          onClick={() => setView("tank")}
          type="button"
          class={`env-button env-m-around--small ${
            view === "tank" ? "env-button--primary" : "env-button--secondary"
          }`}
        >
          Min tank
        </button>
      </div>
      {renderView()}
    </div>
  );
};

export default App;
