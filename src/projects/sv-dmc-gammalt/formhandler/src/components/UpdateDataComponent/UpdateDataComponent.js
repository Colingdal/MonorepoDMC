import React, { useState, useEffect } from 'react';

const UpdateDataComponent = ({ formData, handleInputChange, handleUpdateRequest, handleDeleteRequest, testJSON, updateTestJSON }) => {
  const [localTestJSON, setLocalTestJSON] = useState(testJSON);

  useEffect(() => {
    setLocalTestJSON(testJSON);
  }, [testJSON]);

  const handleDetailChange = (customerIndex, detailIndex, event) => {
    const { value } = event.target;
    const updatedJSON = { ...localTestJSON };
    updatedJSON.customers[customerIndex].persondetaljer[detailIndex].värde = value;
    setLocalTestJSON(updatedJSON);
  };

  return (
    <form>
      <div class="env-form-field">
        <label>E-post</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          class="env-form-input"
        />
      </div>
      <div class="env-form-field">
        <label>Status</label>
        <select
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          class="env-form-input"
        >
          <option value="">Välj en status</option>
          <option value="I början av insatsen">I början av insatsen</option>
          <option value="Vid uppföljning">Vid uppföljning</option>
          <option value="Vid avslut">Vid avslut</option>
        </select>
      </div>
      <div class="env-form-field">
        <label>ID</label>
        <input
          type="id"
          name="id"
          value={formData.id}
          class="env-form-input"
          disabled
        />
      </div>
      {localTestJSON.customers.map((customer, customerIndex) => (
        <div key={customer.uId}>
          <button class="env-button env-button--primary env-m-top--medium" type="button" onClick={() => handleUpdateRequest(customerIndex)}>Update</button>
          <button class="env-button env-button--primary env-m-top--medium" type="button" onClick={() => handleDeleteRequest(customerIndex)}>Delete</button>
        </div>
      ))}
    </form>
  );
};

export default UpdateDataComponent;
