/* eslint-disable react/no-unknown-property */
import * as React from "react";
import PropTypes from "prop-types";
import Employees from "../Employees";
import Mycollegues from "../Mycollegues";
import OrgChartComponent from "../OrgChartComponent";

const App = ({view,  ...data}) => {

  if (view === 'employeetree')
  { 
    return (
      <Employees {...data} />
    );
  }
  else if (view === 'mycollegues')
  { 
    return (
      <Mycollegues {...data} />
    );
  }
  else {
    return (
      <OrgChartComponent {...data} />
    );
  }
};

App.propTypes = {
 view: PropTypes.string,
};

export default App;
