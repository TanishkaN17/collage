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
        const payload = {
            profile: profile,
            schedule: schedule
        };
        
        axios.post(`/api/update-schedule`, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookies.get('access_token')}`,
                },
        })
        .then((response) => {
            
        })
        .catch((err) => console.error(err));
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
        <div className="Schedule">
            {/* Schedule picture */}
            <img src={schedule.schedule_img_url} alt="Profile" className="profile-picture" />

            {/* camera button */}
            {isUser && (
                <Popover width={300} opened={opened} closeOnClickOutside={false} closeOnEscape={false} onClose={() => setOpened(false)} trapFocus position="bottom" withArrow shadow="md">
                  <Popover.Target>
                    <button onClick={() => setOpened(true)} className="camera-button"> 
                      <img src={camera} alt="Camera" className="camera"/>
                    </button>
                  </Popover.Target>
                <Popover.Dropdown  styles={{dropdown: {color: "black", backgroundColor: "white"}}} radius="md">
                <Dropzone
                  multiple={false}
                  style={{ height: "100%", color: '#5d5d5d' }}
                  onDrop={handleImageUpload}
                  // onReject={(files) => console.log('rejected files', files)}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  className="resume-drop"
                >
                  <Group position="center" spacing="xl" mih={60} style={{ pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                      <IconUpload
                        style={{ width: "100%", height: "100%", color: 'var(--mantine-color-blue-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX
                        style={{ width: "100%", height: "100%", color: 'var(--mantine-color-red-6)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconUpload
                        style={{ width: rem(30), height: rem(30), color: 'var(--mantine-color-dimmed)' }}
                        stroke={1.5}
                      />
                    </Dropzone.Idle>
                    <Text size="md">
                      {'Click or drag file here to upload photo'}
                    </Text>
                  </Group>
                </Dropzone>
                  <div className='filters-footer'>
                    <div className='confirm-button'>
                      <Button 
                              styles={{root: {color: "black"}}} autoContrast="false" variant="filled" color="#D9D9D9" 
                              radius="xl" onClick={() => { setOpened(false);}} size="xs">
                                  Confirm
                      </Button>
                    </div>
                    <div className='cancel-button'>
                      <Button 
                              styles={{root: {color: "black"}}} autoContrast="false" variant="filled" color="#D9D9D9" 
                              radius="xl" onClick={() => { setOpened(false);}} size="xs">
                                  Cancel
                      </Button>
                    </div>
                  </div>
                </Popover.Dropdown>
                </Popover>
                
              )}
        </div>
    )
}

export default Schedule;