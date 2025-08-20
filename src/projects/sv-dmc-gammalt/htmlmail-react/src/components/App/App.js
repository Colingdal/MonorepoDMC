import React, { useState } from "react";
import PropTypes from "prop-types";
import router from "@sitevision/api/common/router";
import toasts from "@sitevision/api/client/toasts";
import requester from "@sitevision/api/client/requester";

const App = ({ email, headline }) => {
  const handleChange = (event) => {
    console.log(event.target.value);
  };

  const moreInfo = () => {
    requester
      .doPost({
        url: router.getStandaloneUrl("/sendMailInfo"),
        data: email, 
        tada: headline,
      })
      .then(function (response) {
        console.log("send", response);
        toasts.publish({
          heading: "Mail",
          message: "Skickat! :)",
          type: "primary",
        });
      })
      .catch(function (response) {
        console.log("Fail", response);
        toasts.publish({
          heading: "Mail",
          message: "Kunde inte skicka, Försök igen! :(",
          type: "danger",
        });
      });
  };

  return (
    <>
    <input class="form-control" data-component="user-selector" name="user" />

      <div className="env-modal-dialog__dialog env-modal-dialog__dialog--large">
        <section className="env-modal-dialog__content">
          <header className="env-modal-dialog__header">
            <h5
              className="env-text-h5 env-modal-dialog__header__title"
              id="modalDialogHeader-2"
            >
              Nytt Html-mail
            </h5>
          </header>
          <form className="form-example">
            <label htmlFor="text-1" className="env-form-element__label">
              Ämne
            </label>
            <div className="env-form-element__control">
              <input
                type="text"
                name="headline"
                className="env-form-input"
                placeholder="Input ämne"
                id="text-1"
                value={headline} 
                onChange={handleChange}
              />
            </div>
            <label htmlFor="email">Mottagare: </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email} 
              onChange={handleChange}
              required
            />
            <h2>Message: {email}</h2>
            <footer className="env-modal-dialog__footer env-modal-dialog__footer--right">
              <button
                onClick={moreInfo}
                className="env-button env-button--primary env-button--large"
              >
                Skicka
              </button>
            </footer>
          </form>
        </section>
      </div>
    </>
  );
};

App.propTypes = {
  email: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
};

export default App;




// import * as React from "react";
// import PropTypes from "prop-types";
// import router from "@sitevision/api/common/router";

// import { useState } from 'react';
// import toasts from "@sitevision/api/client/toasts";
// import requester from "@sitevision/api/client/requester";
// import events from "@sitevision/api/common/events";
// //import logUtil from "@sitevision/api/server/LogUtil";
// //import appData from "@sitevision/api/server/appData";


// const App = ({  }) => {
//   // function to trigger on button click

//   const [email, setMessage] = useState('');
//   const handleChange = (event) => {
//     setMessage(event.target.value);
//     console.log(event.target.value);
//   };

//   const moreInfo = () => {
//     // send request to the /published route

//     requester.doPost({
//         url: router.getStandaloneUrl("/sendMailInfo"),
//         data: event.target.value

//       })
//       .then(function(response) {
//         console.log('send', response);
//         toasts.publish({ 
//           heading: 'Mail',
//           message: 'Skickat! :)', 
//           type: 'primary'
//         })
//       }).catch(function(response) {
//         console.log('Fail', response);
//         toasts.publish({ 
//           heading: 'Mail',
//           message: 'Kunde inte skicka, Försök igen! :(', 
//           type: 'danger'
//         });
//      });  
//   };

//   // If no client side functionallity included onClick would never trigger
//   return (
//     <>
//     <div class="env-modal-dialog__dialog env-modal-dialog__dialog--large">
//    <section class="env-modal-dialog__content">
//       <header class="env-modal-dialog__header">
//          <h5 class="env-text-h5 env-modal-dialog__header__title" id="modalDialogHeader-2">
//             Nytt Html-mail
//          </h5>
//       </header>        
//       <form class="form-example">
//          <label for="text-1" class="env-form-element__label">Ämne</label>
//          <div class="env-form-element__control">
//             <input
//                type="text"
//                name="headline"
//                class="env-form-input"
//                placeholder="Input ämne"
//                id="text-1"
//             />
//          </div>
//          <label for="email">Mottagare: </label>
//          <input type="email" name="email" id="email" onChange={handleChange} required
//          />
//         <h2>Message: {email}</h2>
//          <footer class="env-modal-dialog__footer env-modal-dialog__footer--right"> 
//          <button
//         onClick={moreInfo}
//         className="env-button env-button--primary env-button--large"
//       >
//         Skicka
//       </button>
//          </footer>     
//       </form>   
//    </section>
// </div>      
//     </>
//   )
// }

// App.propTypes = {
//   name: PropTypes.string,
// };

// export default App;



