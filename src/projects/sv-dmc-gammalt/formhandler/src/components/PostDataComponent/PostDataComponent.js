import React from 'react';

const PostDataComponent = ({ formData, handleInputChange, handleSendFormSubmit, testJSON, updateTestJSON }) => {
  const handleDetailChange = (customerIndex, detailIndex, event) => {
    const { value } = event.target;
    const updatedJSON = { ...testJSON };
    const currentDetails = updatedJSON.customers[customerIndex].persondetaljer;
    currentDetails[detailIndex].värde = value;
    updateTestJSON(updatedJSON);
  };

  return (
    <form onSubmit={handleSendFormSubmit}>
      <div className="env-form-field">
        <label>E-post</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="env-form-input"
        />
      </div>
      <div className="env-form-field">
        <label>Status</label>
        <select
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="env-form-input"
        >
          <option value="I början av insatsen">I början av insatsen</option>
          <option value="Vid uppföljning">Vid uppföljning</option>
          <option value="Vid avslut">Vid avslut</option>
        </select>
      </div>
      <button className="env-button env-button--primary env-m-top--medium" type="submit">Submit</button>
    </form>
  );
};

export default PostDataComponent;
