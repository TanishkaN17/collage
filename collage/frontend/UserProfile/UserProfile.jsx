import React, {lazy} from "react";
import { Grid, Image } from "@mantine/core";
import '../CSS/userProfile.css';

const Personal = lazy(() => import('./Personal'));
const FileUpload = lazy(() => import('./FileUpload'));
const Saved = lazy(() => import('./Savedcourses'));
const Schedule = lazy(() => import('./Schedule'));
const ActivityGlimpse = lazy(() => import('./ActivityGlimpse'));

import saved from '../images/blurredSaved.png';
import schedule from '../images/blurredSchedule.png';

function UserProfile({loggedIn, following, profileUser, handleExploreMore}) {
    
    // console.log("PROFILE", profileUser);
    
    if (loggedIn) {
        return(
            // personal
            <div className="profile-body">
                <Grid>
                    <Grid.Col span={12}>
                        <div className="saved-title">
                            <h1>Profile</h1>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={8}>
                        <Personal isUser={true} userId={profileUser}/>
                    </Grid.Col>
                    <Grid.Col justify="flex-end" span={4}>
                        <ActivityGlimpse handleExploreMore={handleExploreMore}/>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <h2>Schedule Builder</h2>
                        <div className="builder">
                            <FileUpload userName={profileUser}/>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <div className="schedule">
                            <h2>Schedule</h2>
                            <Schedule/>
                        </div>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <h3>Saved Courses</h3>
                        <Saved loggedIn={loggedIn} userId={profileUser}/>
                    </Grid.Col>
                </Grid>
            </div>
        )
    } else {
        if (following) {
            return (
                // following
                <div className="profile-body">
                    <Grid>
                        <Grid.Col span={12}>
                            <div className="saved-title">
                                <h1>Profile</h1>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Personal isUser={false} userId={profileUser}/>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            {/* <ActivityGlimpse/> */}
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <div className="schedule">
                                <h2>Schedule</h2>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <h3>Saved Courses</h3>
                            <Saved loggedIn={loggedIn} userId={profileUser}/>
                        </Grid.Col>
                    </Grid>
                </div>
            )
        } else {
            
            return (
                // Outside
                <div className="profile-body">
                    <Grid>
                        <Grid.Col span={12}>
                            <div className="saved-title">
                                <h1>Profile</h1>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Personal isUser={false} userId={profileUser}/>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            {/* <ActivityGlimpse/> */}
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <p>You must be following this user to view their schedule and saved courses</p> 
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Image src={ schedule } className="sample"/>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Image src={ saved } className="sample"/>
                        </Grid.Col>
                    </Grid>
                </div>
            )
        }
    }
}

export default UserProfile;