// import * as React from "react";
// import ReactDOM from "react-dom";
// import App from "./components/App";

// export default (initialState, el) => {
//   ReactDOM.hydrate(
//     <App message={initialState.message} name={initialState.name} />,
//     el
//   );
// };

import * as React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

export default (initialState, el) => {
   /* Update the rendered App component to
      include client side functionallity.
      
      E.g. to trigger a request on button click
      and display the fetched value.
   */
  ReactDOM.hydrate(<App email={initialState.email} />, el);
};
