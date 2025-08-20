/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import * as React from "react";
import styles from "./ContactCard.scss";
import Initials from "../Initials";

const ContactCard = ({ contact, employeeButton, hexColor }) => {
  const userFields = contact.userFields || [];
  const data = contact.data || {};

  console.log(contact);

  // Determine heading name
  const headingName = data.fullname || data.givenName || data.sn || contact.name;

  // Build excludedKeys dynamically to exclude keys that are in headingName
  const excludedKeys = [
    "profileImage",
    "externalID",
    "goodToUse",
    "id",
    "manager",
    "directReports",
    "fullname",
  ];

  if (headingName === data.givenName) excludedKeys.push("givenName");
  if (headingName === data.sn) excludedKeys.push("sn");

  const renderField = ({ label, key }) => {
    if (excludedKeys.includes(key)) return null;

    const value = data[key];
    const lowerKey = key.toLowerCase();

    if (lowerKey === "mail") {
      return (
        <p key={key} class="env-ui-text-caption">
          <strong>Mail: </strong>{" "}
          {value ? (
            <a href={`mailto:${value}`} class="env-link env-link-secondary">
              {value}
            </a>
          ) : (
            ""
          )}
        </p>
      );
    }

    if (
      lowerKey === "telephonenumber" ||
      lowerKey === "phone" ||
      lowerKey === "mobile"
    ) {
      return (
        <p key={key} class="env-ui-text-caption">
          <strong>{label}:</strong>{" "}
          {value ? (
            <a href={`tel:${value}`} class="env-link env-link-secondary">
              {value}
            </a>
          ) : (
            ""
          )}
        </p>
      );
    }

    return (
      <p key={key} class="env-ui-text-caption">
        <strong>{label}:</strong> {value || ""}
      </p>
    );
  };

  return (
    <article key={contact.id} class="example-card env-card env-ui-section">
      <div class={styles.cmCard}>
        <div class="env-card__body">
          <header class="env-card__footer example-flex example-flex--align env-flex env-flex--justify-content-between">
            {contact.profileImage ? (
              <img
                class="env-card__image env-profile-image env-profile-image--small"
                src={contact.profileImage}
                alt="Profile image"
              />
            ) : (
              <Initials
                name={contact.name}
                hexColor={hexColor}
                contact={contact}
              />
            )}
            {employeeButton && (
              <p class="env-ui-text-caption env-flex__item">
                {employeeButton}
              </p>
            )}
          </header>

          <footer class="env-header">
            <h3 class="env-ui-text-subheading sv-font-vit-text">
              {headingName}
            </h3>

            {!contact.data && (
              <>
                <p class="env-ui-text-caption">
                  <strong>Phone: </strong>
                  <a
                    href={`tel:${contact.phone}`}
                    class="env-link env-link-secondary"
                  >
                    {contact.phone}
                  </a>
                </p>
                <p class="env-ui-text-caption">
                  <strong>Mail: </strong>
                  <a
                    href={`mailto:${contact.mail}`}
                    class="env-link env-link-secondary"
                  >
                    {contact.mail}
                  </a>
                </p>
              </>
            )}

            {userFields.map(renderField)}
          </footer>
        </div>
        <div className={styles.directReportsBox}>
          {contact.directReports ? contact.directReports.length : 0}
        </div>
      </div>
    </article>
  );
};


export default ContactCard;
