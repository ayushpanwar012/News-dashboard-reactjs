import React,{useState} from 'react'
// import CurrentLiveStream from './component/LiveStream/CurrentLiveStream'
import  "./App.css"

import Navbar from './component/navbar/navbar';
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CurrentLiveStream from './component/LiveStream/CurrentLiveStream';
import MainRecentlyPosted from './component/RecentlyPosted/MainRecentlyPosted';
import MainTrending from './component/trending/MainTrending';


function App() {
  
  return (
    <>
     {/* <CurrentLiveStream/> */}
     {/* <MainRecentlyPosted /> */}
     {/* <MainTrending/> */}
     
      <Router>
      <Navbar  />
      <div className='main-content'>
      
      <Routes>
          <Route path="/" element={<CurrentLiveStream />} />
          <Route path="/RecentPostedVideos" element={<MainRecentlyPosted />} />
          <Route path="/trendingVideos" element={<MainTrending />} />
          
        </Routes>
        </div>
      </Router>
      
   
   </>
  )
}

export default App
