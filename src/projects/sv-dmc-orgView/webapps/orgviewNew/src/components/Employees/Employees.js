/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import * as React from "react";
import { useEffect, useState } from "react";
import requester from "@sitevision/api/client/requester";
import router from "@sitevision/api/common/router";
import ContactCard from "../ContactCard";

const Employees = ({ noManager, hexColor }) => {
  const initialContact = noManager[0];
  const [isSelected, setIsSelected] = useState({ [initialContact.id]: true });
  const [directReports, setDirectReports] = useState({});


  const getDirectReports = (contact) => {
    requester
      .doGet({
        url: router.getStandaloneUrl("/directReports"),
        data: { id: contact.id },
      })
      .then((response) => {
        const responseDirectReports = response.directReportsNodes;
        if (responseDirectReports) {
          setDirectReports((prevReports) => ({
            ...prevReports,
            [contact.id]: responseDirectReports,
          }));

          responseDirectReports.forEach((child) => {
            if (child.directReports && child.directReports.length > 0) {
              getDirectReports(child);
            }
          });
        }
      })
      .catch((error) => {
        console.error(`Error getting direct reports:`, error);
      });
  };

  useEffect(() => {
    getDirectReports(initialContact);
  }, [initialContact]);

  const handleToggleDirectReports = (contactId) => {

    setIsSelected((prevState) => ({
      ...prevState,
      [contactId]: !prevState[contactId], // öppna/stäng
    }));
  };

  const renderHierarchy = (contact) => {
    const children = directReports[contact.id];

    return (
      <div class="example-flex env-flex env-flex--direction-column">
        <ContactCard
          contact={contact}
          hexColor={hexColor}
          employeeButton={
            children ? (
              <button
                class="env-button env-button--link"
                aria-label={`Toggle children of ${contact.name}`}
                onClick={() => handleToggleDirectReports(contact.id)}
              >
                <svg class="env-icon">
                  <use
                    href={
                      isSelected[contact.id]
                        ? "/sitevision/envision-icons.svg#icon-arrow-up"
                        : "/sitevision/envision-icons.svg#icon-arrow-down"
                    }
                  />
                </svg>
              </button>
            ) : null
          }
        />
        {children && isSelected[contact.id] && (
          <div class="example-flex env-flex env-flex--wrap env-flex--justify-content-center">
            {children.map((child) => {
              const anySiblingOpen = children.some(
                (sibling) => sibling.id !== child.id && isSelected[sibling.id]
              );

              const displayChild = !anySiblingOpen || isSelected[child.id];

              return (
                <div
                  class="env-flex__item env-m-around--medium"
                  key={child.id}
                  style={{display: displayChild ? "block" : "none"}}
                >
                  {renderHierarchy(child)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return <div class="example-demo-dark">{renderHierarchy(initialContact)}</div>;
};

export default Employees;
