import React, { useState } from 'react';
import axios from 'axios';
import buttonImage from "../images/follow-button-icon.svg";
import '../CSS/SuggestedConnectionUserProfile.css'; 

function SuggestedConnectionUserProfile ({ profileImage, name, major, userId }) {
  const [followRequested, setFollowRequested] = useState(false);

  const handleFollowClick = async () => {
    try {
      const response = await axios.post('/api/follow', { userId });
      if (response.status === 200) {
        setFollowRequested(true); // Update button state to "Requested"
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={profileImage} /*alt={}*/ className="profile-image" />
      </div>
      <div className="profile-details">
        <h3>{name}</h3>
        <p> <strong> Major: </strong> </p>
        <p>{major}</p>
        
        <button onClick={handleFollowClick} className="follow-button" disabled={followRequested}>
          <img src={buttonImage} className="button-icon" />
          {followRequested ? 'Requested' : 'Follow'}
        </button>

      </div>
    </div>
  );
};

export default SuggestedConnectionUserProfile;