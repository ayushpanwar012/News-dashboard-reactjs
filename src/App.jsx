import React,{useEffect, useState} from 'react'
// import CurrentLiveStream from './component/LiveStream/CurrentLiveStream'
import  "./App.css"

import Navbar from './component/navbar/navbar';
import { Navigate, BrowserRouter as Router, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CurrentLiveStream from './component/LiveStream/CurrentLiveStream';
import MainRecentlyPosted from './component/RecentlyPosted/MainRecentlyPosted';
import MainTrending from './component/trending/MainTrending';
import {doc,getDoc} from "firebase/firestore";
import {auth, firestore} from "./firebase-config"
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import Login from './component/Login';

 
function App() {
 const [isAuthenticated,setIsAuthenticated] =useState(false)
 const [isAuthChecking,setIsAuthChecking] =  useState(true)


 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth ,(user)=>{
    setIsAuthenticated(!!user)
    setIsAuthChecking(false);
   
   })
   return ()=>unsubscribe();
 }, [])
 

 const handleSignout = () =>{
  signOut(auth)
  .then(()=>{
    localStorage.removeItem("live");
    localStorage.removeItem("vood");
    localStorage.removeItem("tren");
    setIsAuthenticated(false)
  })
  .catch((error)=>{
    console.log("sign out error",error)
  });

 }


  return (
    <>
    <Router>
      <div>
    {(isAuthenticated) &&
      (<nav className='navbar'>
    <Navbar/>
    <button
    onClick={handleSignout}
   className='nav-link'>Sign-out</button>
    </nav>
      )}

    <div className='main-content'>
    <Routes>
    
      
    <Route 
    path="/login"
    element={
      isAuthenticated ?
      (<Navigate to="/livestream"/>):
      (<Login/>)
    }
    />
    <Route 
    path="*"
    element={
      (<Navigate to="/login"/>)
    }
    />
    <Route path="/livestream" 
    element={
    isAuthenticated ? <CurrentLiveStream />:<Login/>}/>
    <Route path="/recentlyPosted" element={
      isAuthenticated ?<MainRecentlyPosted />:<Login/>} />
    <Route path="/trendingvideos" element={
      isAuthenticated ?<MainTrending />:<Login/>} />
    

    
    
        </Routes>
        </div>
      </div>
      
      </Router> 
      
   
   </>
  )
}

export default App
