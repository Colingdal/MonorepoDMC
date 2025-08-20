// import React from "react";
// import PropTypes from "prop-types";

// const TestJSON = ({ testJSON }) => {
//     const { customers } = testJSON;

//     return (
//         <div>
//             {customers.map((customer) => (
//                 <div key={customer.uId} className="customer">
//                     <h2>{customer.namn}</h2>
//                     {customer.persondetaljer.map((detail) => {
//                         switch (detail.typ) {
//                             case "text":
//                                 return (
//                                     <div className="env-form-field" key={detail.uId}>
//                                         <label htmlFor={`text-${detail.uId}`} className="env-form-label">
//                                             {detail.titel}
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="env-form-input"
//                                             placeholder="Placeholder text"
//                                             id={`text-${detail.uId}`}
//                                             defaultValue={detail.värde}
//                                         />
//                                     </div>
//                                 );
//                             case "select-1":
//                                 return (
//                                     <div className="env-form-field" key={detail.uId}>
//                                         <label htmlFor={`select-${detail.uId}`} className="env-form-label">
//                                             {detail.titel}
//                                         </label>
//                                         <select className="env-form-input" id={`select-${detail.uId}`} defaultValue={detail.värde}>
//                                             {detail.alternativ.map((option, index) => (
//                                                 <option key={index} value={option}>
//                                                     {option}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 );
//                             case "checkbox":
//                                 return (
//                                     <div className="env-form-control" key={detail.uId}>
//                                         <input
//                                             className="env-checkbox"
//                                             type="checkbox"
//                                             id={`checkbox-${detail.uId}`}
//                                             defaultChecked={detail.värde}
//                                         />
//                                         <label className="env-form-label" htmlFor={`checkbox-${detail.uId}`}>
//                                             {detail.titel}
//                                         </label>
//                                     </div>
//                                 );
//                             case "button":
//                                 return (
//                                     <div className="env-form-control" key={detail.uId}>
//                                         <button type="button" className="env-button env-button--primary">
//                                             {detail.titel}
//                                         </button>
//                                     </div>
//                                 );
//                             case "tag-select":
//                                 return (
//                                     <div className="env-form-field" key={detail.uId}>
//                                         <label htmlFor={`tag-select-${detail.uId}`} className="env-form-label">
//                                             {detail.titel}
//                                         </label>
//                                         <select
//                                             className="env-form-input example-tag-select"
//                                             id={`tag-select-${detail.uId}`}
//                                             aria-label="Tag select"
//                                             multiple
//                                         >
//                                             <option value="">Select an item...</option>
//                                             {detail.alternativ.map((option, index) => (
//                                                 <option
//                                                     key={index}
//                                                     value={option}
//                                                     selected={detail.värde.includes(option)}
//                                                 >
//                                                     {option}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                 );
//                             default:
//                                 return null;
//                         }
//                     })}
//                 </div>
//             ))}
//         </div>
//     );
// };


// TestJSON.propTypes = {
//     testJSON: PropTypes.shape({
//         customers: PropTypes.arrayOf(
//             PropTypes.shape({
//                 uId: PropTypes.string.isRequired,
//                 namn: PropTypes.string.isRequired,
//                 persondetaljer: PropTypes.arrayOf(
//                     PropTypes.shape({
//                         uId: PropTypes.string.isRequired,
//                         titel: PropTypes.string.isRequired,
//                         typ: PropTypes.string.isRequired,
//                         värde: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
//                         alternativ: PropTypes.arrayOf(PropTypes.string)
//                     })
//                 ).isRequired
//             })
//         ).isRequired
//     }).isRequired
// };

// export default TestJSON;
