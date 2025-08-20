import React, { useState, useEffect } from "react";
import PostDataComponent from "../PostDataComponent";
import UpdateDataComponent from "../UpdateDataComponent";
import toasts from "@sitevision/api/client/toasts";     
import styles from "./JsonHandler.scss";        


const JsonHandler = () => {
  const initialTestJSON = {
    customers: [
      {
        uId: "1",
        namn: "Övriga Uppgifter",
        persondetaljer: [
          { uId: "field1", titel: "Ålder", typ: "text", värde: "" },
          { uId: "field2", titel: "Kön", typ: "select-1", alternativ: ["", "Man", "Kvinna", "Annat"], värde: "" },
          { uId: "field3", titel: "Civilstånd", typ: "select-1", alternativ: ["", "Gift", "Ogift", "Skild"], värde: "" },
          { uId: "field4", titel: "Boendeform", typ: "text", värde: "" },
        ]
      }
    ]
  };

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',  
    json: '',
    id: null,
    groupNameList: [],
    loginList: []
  });

  const [testJSON, setTestJSON] = useState(initialTestJSON);
  const [getResponse, setGetResponse] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showButton, setShowButton] = useState(false); 

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDetailChange = (customerIndex, detailIndex, e) => {
    const newValue = e.target.value;
    setTestJSON(prevTestJSON => {
      const newCustomers = [...prevTestJSON.customers];
      newCustomers[customerIndex].persondetaljer[detailIndex].värde = newValue;
      return { customers: newCustomers };
    });
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const person = getResponse.find(p => p.id === parseInt(selectedId));
  
    if (person) {
      try {
        const parsedJSON = person.json ? JSON.parse(decodeURIComponent(person.json)) : { customers: [] };

        setSelectedPerson(person);
        setFormData({
          firstName: person.firstName || '',
          email: person.email || '',
          json: person.json || '',  
          id: person.id || null,
          groupNameList: person.groupNameList || [],
          loginList: person.loginList || []
        });
        setTestJSON(parsedJSON); 
        setShowUpdate(true);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toasts.publish({
          heading: 'Error',
          message: 'Could not parse the selected user\'s JSON data.',
        });
        setFormData(prevFormData => ({
          ...prevFormData,
          json: JSON.stringify({ customers: [] })  
        }));
        setTestJSON({ customers: [] });
      }
    }
  };
  
  const fetchAllUsers = () => {
    fetch("https://storage.deermeadow.se/backend/sus/getallusers", {
      method: 'GET',
      headers: { 'Accept': 'application/json' }  
    })
    .then(response => response.json())
    .then(data => {
      setGetResponse(data.entries);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      toasts.publish({
        heading: 'Error',
        message: 'Could not fetch users. Please try again later.',
      });
      setGetResponse([]);
    });
  };

  const handlePostRequest = () => {
    const encodedJSON = encodeURIComponent(JSON.stringify(testJSON)); 
    fetch('https://storage.deermeadow.se/backend/sus/createuser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, json: encodedJSON })
    })
    .then(response => response.json())
    .then(() => {
      resetForm();
      fetchAllUsers();
      toasts.publish({
        heading: 'Snyggt!',
        message: 'Du har lagt till en ny patient!',
      });
    })
    .catch(error => {
      console.error('Error posting user:', error);
      toasts.publish({
        heading: 'Error',
        message: 'Could not create user. Please try again.',
      });
    });
  };
  
  const handleUpdateRequest = () => {
    const encodedJSON = encodeURIComponent(JSON.stringify(testJSON)); 
    fetch('https://storage.deermeadow.se/backend/sus/updateuser', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...formData, json: encodedJSON })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Update response:', data);
      resetForm();
      fetchAllUsers();
      toasts.publish({
        heading: 'Uppdaterad!',
        message: 'Patientuppgifter har uppdaterats!',
      });
    })
    .catch(error => {
      console.error('Error updating user:', error);
      toasts.publish({
        heading: 'Error',
        message: 'Could not update user. Please try again.',
      });
    });
  };
  
  const deletePost = (id) => {
    fetch(`https://storage.deermeadow.se/backend/sus/deleteuser?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(() => {
      fetchAllUsers();
      setSelectedPerson(null);
      setShowUpdate(false);
      toasts.publish({
        heading: 'Deleted!',
        message: 'Patient has been deleted successfully.',
      });
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      toasts.publish({
        heading: 'Error',
        message: 'Could not delete user. Please try again.',
      });
    });
  };

  const toggleShowPost = () => {
    setShowPost(prev => !prev);
    if (!showPost) {
      resetForm();
    }
  };

  const toggleShowButton = () => {
    setShowButton(prev => !prev); 
    console.log('moa ');
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      email: '',
      json: '',
      id: null,
      groupNameList: [],
      loginList: []
    });
    setTestJSON(initialTestJSON);
    setSelectedPerson(null);
  };

  return (
    <div>
          <div className={styles.jsonHandler}>
        <h2>Barnsamtal</h2>
        <p>Börja med att spara detta dokument med ÄRENDEKOD som dokumentsnamn.</p>
        <p>Följ stegen nedan för att besvara bakgrundfrågor, välja problemområden och frågor samt skriva it frågorna inför samtalet med barnet.</p>
        <p>När du har haft samtalet fyller du i svaren på bladet "Registrering" så kommer resultatet att redovisas på bladet "Resultat".</p>
        </div>
      <div className={styles.choseUser}>
        {showPost ? (
          <>
            <button type="button" class="env-button env-button--primary" onClick={toggleShowPost}>
              Tillbaka
            </button>
            <PostDataComponent
              formData={formData}
              handleInputChange={(e) => {
                const { name, type, checked, value } = e.target;
                setFormData({
                  ...formData,
                  [name]: type === 'checkbox' ? checked : value
                });
              }}
              handleSendFormSubmit={(e) => {
                e.preventDefault();
                handlePostRequest();
              }}
              testJSON={testJSON}   
              updateTestJSON={setTestJSON}
            />
          </>
        ) : showUpdate ? (
          <>
          <button type="button" class="env-button env-button--primary" onClick={() => setShowUpdate(false)}>
              Tillbaka
            </button>
            <UpdateDataComponent
              formData={formData}
              handleInputChange={(e) => {
                const { name, type, checked, value } = e.target;
                setFormData({
                  ...formData,
                  [name]: type === 'checkbox' ? checked : value
                });
              }}
              handleUpdateRequest={handleUpdateRequest}
              handleDeleteRequest={() => deletePost(selectedPerson.id)}
              testJSON={testJSON}
              updateTestJSON={setTestJSON}
            />
          </>
        ) : (
          <>
           <div className="env-form-field">
            <label htmlFor="patient-select" className="env-form-label">Välj en patient</label>
            <select
                id="patient-select"
                className="env-form-input" 
                onChange={handleSelectChange}
                value={selectedPerson ? selectedPerson.id : ''}
            >
                {getResponse.map((person) => (
                <option key={person.id} value={person.id}>
                    {person.id}
                </option>
                ))}
            </select>
            </div>
            <div>
              <button
                type="button" 
                class="env-button env-button--primary"
                onClick={toggleShowPost}
              >
                Lägg till ny patient
              </button>
            </div>
          </>
        )}
         </div>  
        <div className={styles.backgroundCheck}>
        <h3>Bakgrundsfrågor</h3>
        <p>Klicka på knappen nedan för att besvara frågor om...</p>
        <button type="button" class="env-button env-button--primary" onClick={toggleShowButton}>{showButton ? 'Dölj registrera bakgrundsfrågor' : 'Registrera bakgrundsfrågor'}</button>
      </div>
    

        {showButton && (
          <div>

            <div className={styles.backgroundCheck}>
              {testJSON.customers.map((customer, customerIndex) => (
                <div key={customer.uId}>
                  {customer.persondetaljer.map((detail, detailIndex) => (
                    <div key={detail.uId} className="env-form-field">
                      <label>{detail.titel}</label>
                      {detail.typ === "text" ? (
                        <input
                          type="text"
                          value={detail.värde}
                          onChange={(e) => handleDetailChange(customerIndex, detailIndex, e)}
                          className="env-form-input"
                        />
                      ) : detail.typ === "select-1" ? (
                        <select
                          value={detail.värde}
                          onChange={(e) => handleDetailChange(customerIndex, detailIndex, e)}
                          className="env-form-input"
                        >
                          {detail.alternativ.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
          </div>
        )}
       
         
      <div className={styles.startOfTrial}>
        <h3>I början av insatsen</h3>
        <p>Klicka på knappen nedan för att välja och skriva ut vilka problemområden och frågor som ska ingå i barnsamtalet. Frågor i fet stil är obligatoriska frågor i resp. problemområde.</p>
        <button type="button" class="env-button env-button--primary">Välj och skriv ut frågor</button>
      </div>

      <div className={styles.atFollowUp}>
        <h3>Vid uppföljning</h3>
        <p>Klicka på knappen nedan för att skriva ut de frågor som ställdes vid första samtalet igen.</p>
        <button type="button" class="env-button env-button--primary">Skriv ut valda frågor igen</button>
      </div>

      <div className={styles.uponCompletion}>
        <h3>Vid avslut</h3>
        <p>Klicka på knappen nedan för att skriva ut de tidigare valda frågorna samt de två uppföljande frågorna som ska ställas vid avslut.</p>
        <button type="button" class="env-button env-button--primary">Skriv ut valda frågor och avslutsfrågor</button>
      </div>
    </div>
  );
};

export default JsonHandler;
