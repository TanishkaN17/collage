import React, { useState, useEffect, startTransition, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import CharlieProfileImage from '../images/Charlie.svg';
const NetworkBox = lazy(() => import('./NetworkBox'));
import FollowerTabIcon from '../images/follower-tab-icon.svg';
import axios from 'axios';
import '../CSS/NavBarFollowers.css';

const NavBarFollowers = ({ currentUser, handleViewProfile }) => {
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        axios.get(`/api/followers/${currentUser.id}`)
            .then((response) => setFollowers(response.data))
            .catch((err) => console.error(err));

    }, [currentUser.id]);

    const handleRemoveFollower = async (followerId) => {
        const payload = {
            user_id: currentUser.id,
            follow_id: followerId.username
        };

        axios.delete(`/api/remove_user`, payload)
            .then((response) => console.log(response.data.message))
            .catch((err) => console.error(err));

    };

    return (
        <>
            <NetworkBox 
                userList={followers} 
                search={true} 
                buttonText1="View Profile" 
                handleButton1={handleViewProfile} 
                buttonText2="Remove" 
                handleButton2={handleRemoveFollower} 
                headerText="My followers" 
                subText="View followers part of your collage network" 
                searchText="Search my followers"
            />
        </>
    );


};

export default NavBarFollowers;
