/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import * as React from "react";
import { useEffect, useState } from "react";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import ContactCard from "../ContactCard";
import i18n from "@sitevision/api/common/i18n";

const Mycollegues = ({ hexColor, allContacts, responsible }) => {
  const [showManager, setShowManager] = useState(false);
  const [showCollegues, setShowCollegues] = useState(false);
  const [manager, setManager] = useState(null);
  const [sharedManagers, setSharedManagers] = useState([]);

  console.log(responsible);
  const initialContact = allContacts.find((contact) =>
    contact.mail === responsible
  );  

  useEffect(() => {
    const getManager = (contact) => {
      requester
        .doGet({
          url: router.getStandaloneUrl("/manager"),
          data: { id: contact.id },
        })
        .then((response) => {
          if (response.message === 'No manager') {
            setManager(null);  
          } else {
            setManager(response.managerNode); 
          }
        })
        .catch((error) => {
          console.error(`Error fetching manager for ${contact.name}:`, error);
        });
    };

    const getSharedManagers = (contact) => {
      requester
        .doGet({
          url: router.getStandaloneUrl("/sharedManagers"),
          data: { id: contact.id },
        })
        .then((response) => {
          if (response.message === 'No shared managers') {
            setSharedManagers(null); 
          } else {
            setSharedManagers(response.sharedManagers);
          }
        })
        .catch((error) => {
          console.error(`Error fetching shared managers for ${contact.name}:`, error);
        });
    };

    getManager(initialContact);
    getSharedManagers(initialContact);
  }, [initialContact]);

  return (
    <div>
      {showManager && manager && (
        <div class="env-flex env-flex--justify-content-center env-m-around--medium">
          <div class="env-flex__item">
            <ContactCard contact={manager} hexColor={hexColor} />
          </div>
        </div>
      )}
  
      <div style={{ textAlign: "center"}}>
        <button
          type="button"
          class="env-button env-button--link"
          onClick={() => setShowManager(!showManager)}
          disabled={!manager}
        >
          {showManager ? (
            <svg class="env-icon">
              <use href="/sitevision/envision-icons.svg#icon-arrow-down" />
            </svg>
          ) : (
            <>
              <strong>{i18n.get('manager')}
              </strong>
              <svg class="env-icon" style={{ marginLeft: "0.5rem" }}>
                <use href="/sitevision/envision-icons.svg#icon-arrow-up" />
              </svg>
            </>
          )}
        </button>
      </div>
  
      <div class="env-flex env-flex--justify-content-center env-m-around--medium">
        <div class="env-flex__item">
          <ContactCard contact={initialContact} hexColor={hexColor} />
        </div>
      </div>
  
      <div style={{ textAlign: "center"}}>
        <button
          type="button"
          class="env-button env-button--link"
          onClick={() => setShowCollegues(!showCollegues)}
          disabled={!sharedManagers}
        >
          {showCollegues ? (
            <svg class="env-icon">
              <use href="/sitevision/envision-icons.svg#icon-arrow-up" />
            </svg>
          ) : (
            <>
              <strong>{i18n.get('mycollegues')}</strong>
              <svg class="env-icon" style={{ marginLeft: "0.5rem" }}>
                <use href="/sitevision/envision-icons.svg#icon-arrow-down" />
              </svg>
            </>
          )}
        </button>
      </div>
  
      {showCollegues && sharedManagers && (
        <div class="example-flex env-flex env-flex--wrap env-flex--justify-content-center">
          {sharedManagers.map((sharedManager, index) => (
            <div key={index} class="env-flex__item env-m-around--medium">
              <ContactCard contact={sharedManager} hexColor={hexColor} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mycollegues;
