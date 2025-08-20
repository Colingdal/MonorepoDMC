/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React from "react";

const Initials = ({name, hexColor}) => {
    let initials = '';
    if (name)
    { 
    const fullname = name;
    const firstLetter = fullname.substring(0, 1);
    let secondLetter = fullname.split(' ');
    secondLetter = secondLetter[secondLetter.length - 1];
    secondLetter = secondLetter.substring(0, 1);
    initials = firstLetter + ' ' + secondLetter;
    }
    else 
    {
        initials = "";
    }

    const textColor = hexColor === "#000000" ? "#ffffff" : "#000000";
 
    return (
        <svg
        class="env-card__image env-profile-image env-profile-image--small"
        style={{ height: '64px', width: '64px' }}
        >
        <circle r="30" cx="32" cy="32" fill={hexColor || "#5cceee"}  />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill={textColor} fontSize="20px">
            {initials}
        </text>
        </svg>
    );
};

export default Initials;
