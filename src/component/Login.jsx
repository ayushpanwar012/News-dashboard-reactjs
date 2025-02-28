import React,{useState} from 'react'
// import CurrentLiveStream from './component/LiveStream/CurrentLiveStream'
// import Navbar from './component/navbar/navbar';
import { Navigate, BrowserRouter as Router, useNavigate } from "react-router-dom";
// import { Route, Routes } from "react-router-dom";
// import CurrentLiveStream from './component/LiveStream/CurrentLiveStream';
// import MainRecentlyPosted from './component/RecentlyPosted/MainRecentlyPosted';
// import MainTrending from './component/trending/MainTrending';
// import {doc,getDoc} from "firebase/firestore";
// import {auth, firestore} from "./firebase-config"
import {doc,getDoc} from "firebase/firestore"
import{auth,firestore} from "../firebase-config"
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

 
function Login() {
  const navigate = useNavigate()

  const [email,setemail] = useState('')
  const [password,setPassword] = useState('')
 
  const handleSubmit = (e) =>{
    e.preventDefault();
    
    signInWithEmailAndPassword(auth,email,password)
    .then(async (usercredential)=>{
      const uid = usercredential.user.uid;
      localStorage.setItem("uid",uid);
      localStorage.setItem("loginTimeStamp",Date.now().toString());
      // Reference to the user's document in Firestore using the UID
      const userDocRef = doc(firestore,"AllUsers",uid);
     // Retrieve the document from Firestore
     const userDocSnap = await getDoc(userDocRef) 
     
     if(userDocSnap.exists() && userDocSnap.data().Access){
        //get the Access array from the document 
      const access =  userDocSnap.data().Access;
      const category = Object.keys(access);

      let livestream = [];
      let vod = [];
      let trendingVideos= []
      category.forEach((e)=>{
        if(access[e].includes('Livestream')) livestream.push(e);
        if(access[e].includes('VOD')) vod.push(e);
        if(access[e].includes('trendingVideos')) trendingVideos.push(e);
      })

      localStorage.setItem("live",JSON.stringify(livestream))
      localStorage.setItem("vood",JSON.stringify(vod))
      localStorage.setItem("tren",JSON.stringify(trendingVideos))
      if(livestream.length>0){
        navigate(`/livestream?category=${encodeURIComponent(livestream[0])}`);
      }
        else if(vod.length>0){
        navigate(`/recentlyPosted?category=${encodeURIComponent(vod[0])}`)
      }
      else if(trendingVideos.length>0){
        navigate(`/trendingvideos?category=${encodeURIComponent(trendingVideos[0])}`)
      }

        
      
     }
     
    })
    .catch((error)=>{
      alert(error.message)
    })
    
  }


  return (
    <>
    

      <div className='login-body'>
        <div className='login-container'>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div>
              <label>Email</label>
              <input
              type='email'
              value={email}
              onChange={(e)=>setemail(e.target.value)}
              />
            </div>
            <div>
              <label>Password</label>
              <input
              type='password'
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <button type='submit'>Submit</button>
          </form>
        </div>
        </div>
    
    {/* <Navbar  /> */}
    {/* <div className='main-content'> */}
    


     {/* <CurrentLiveStream/> */}
     {/* <MainRecentlyPosted /> */}
     {/* <MainTrending/> */}
     
      
      
      
      
          {/*  />
          
          
           */}
        </>
  )
}   
 export default Login