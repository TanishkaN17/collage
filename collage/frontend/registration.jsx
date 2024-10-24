import React, { Suspense, useState, lazy } from "react";
// import PropTypes from "prop-types";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Title, Button, Group } from '@mantine/core';
const LandingNew = lazy(() => import('./Landing/Landing-new'));
const About = lazy(() => import('./About'));
const ForStudents = lazy(() => import('./ForStudents'));
const Support = lazy(() => import('./Support'));
const Signup = lazy(() => import('./Signup/Wrapper'));
const Login = lazy(() => import('./Login/Wrapper'));
const Search = lazy(() => import('./Search/SearchWrapper'));
const Catalog = lazy(() => import('./Search/Catalog'));
const Classpreview = lazy(() => import('./Class/Preview'));
const Savedcourses = lazy(() => import('./UserProfile/Savedcourses'));
const Personal = lazy(() => import('./UserProfile/Personal'));
const FileUpload = lazy(() => import('./UserProfile/FileUpload'));
const Classpreview = lazy(() => import('./Class/Preview'));
const Savedcourses = lazy(() => import('./UserProfile/Savedcourses'));
// const Activityglimpse = lazy(() => import('./UserProfile/Activityglimpse'));
const UserProfile = lazy(() => import('./UserProfile/UserProfile'));

export default function Registration() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  return (
    <>
    <Suspense fallback={<h1>loading...</h1>}>
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<LandingNew />} />
              <Route path="/about" element={<About />} />
              <Route path="/forstudents" element={<ForStudents />} />
              <Route path="/support" element={<Support />} />
              <Route path="/search" element={<Catalog />} />
              <Route path="/login" element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} registered={registered} setRegistered={setRegistered}/>} />
              <Route path="/signup" element={<Signup setLoggedIn={setLoggedIn} setRegistered={setRegistered}/>} />
              <Route path="/Classpreview" element={<Classpreview />} />
              <Route path="/Savedcourses" element={<Savedcourses />} />
              <Route path="/profile" element={<Personal isUser={true} userName="hello"/>}/>
              <Route path="/file" element={<FileUpload />}/>
              <Route path="/Classpreview" element={<Classpreview />} />
              <Route path="/Savedcourses" element={<Savedcourses />} />
              {/* <Route path="/Activityglimpse" element={<Activityglimpse />} /> */}
              <Route path="/UserProfile" element={<UserProfile />} />
            </Routes>
          </div>
        </Router>
      </Suspense>
    </>
  );
};
