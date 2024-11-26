import React, {useState, useEffect} from "react";
import '../CSS/Schedule.css';
import { Popover, Group, Button, Text, rem, Select} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE} from '@mantine/dropzone';
import { IconUpload, IconX} from '@tabler/icons-react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, getMetadata, uploadBytesResumable } from "firebase/storage";
import Cookies from 'js-cookie';
import axios from 'axios';

const firebaseConfig = {
    apiKey: 'AIzaSyDc5B7m__Z77iTyQYmb9cXxrn7Bo3a9C18',
    authDomain: "collage-849c3.firebaseapp.com",
    projectId: "collage-849c3",
    storageBucket: "collage-849c3.appspot.com",
    messagingSenderId: "302505148937",
    appId: "1:302505148937:web:05f9caf3eb3bf860ac2ed8",
    measurementId: "G-FZFTH0MVNY"
  }
  
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

const Schedule = ({isUser, userId}) => {
    const [imageFileName, setImageFileName] = useState('');
    const [imageFile, setImageFile] = useState();
    const [opened, setOpened] = useState(false);
    const [imageUrl, setImgURL] = useState('');
    useEffect(() => {
        axios.get(`/api/schedule/${userId}`, { 
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${Cookies.get('access_token')}`,
          },
        })
        .then(response => {
          const Schedule = response.data['Schedule'];
        })
        .catch(err => {console.error(err)});
      }, []);

      const handleChange = (e) => {
        const { Schedule } = e.target;
        setProfile((prevSchedule) => ({
          ...prevSchedule,
          [Schedule]: value,
        }));
      };
    
      const handleSubmit = () => {
        // Make POST request here
        // const payload = {
        //     profile: profile,
        //     schedule: schedule
        // };
        
        // axios.post(`/api/update-schedule`, payload, {
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${Cookies.get('access_token')}`,
        //         },
        // })
        // .then((response) => {
            
        // })
        // .catch((err) => console.error(err));
      }
    
      const handleImageUpload = (files) => {
        if (files && files[0]) {
          setImageFile(files[0]);
          setImageFileName(files[0].name);
    
          const storageRef = ref(storage, `photos/${parseEmail(profile.email)}/${files[0].name}`);
          const uploadTask = uploadBytesResumable(storageRef, files[0]);
    
          uploadTask.on("state_changed", 
            (schedule) => {
              //can track progress here
              const prog = Math.round(
                (schedule.bytesTransferred / schedule.totalBytes) * 100
                );
            },
            (error) => {
              console.error('Photo upload failed:', error);
            },
            () => {
              getDownloadURL(uploadTask.schedule.ref).then((url) => {
                
                fetch("/api/update-schdeule", {
                  method: "POST",
                  credentials: "include",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get('access_token')}`,
                  }, 
                  body: JSON.stringify({schedule_img_url: url 
                  }),
                },)
              });
            }
          );
        }
        setOpened(false);
      };

    return (
        <div className="temp">
            <img src={schedule} alt="Schedule under construction" style={{width: "50vw", borderRadius: "15px"}}/>
        </div>
    )
}

export default Schedule;