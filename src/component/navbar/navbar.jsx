import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="main-navbar">
      <div className="nav-brand" onClick={() => handleNavigation("/")}>
        
      </div>
      
      <div className="nav-links">
        <button className="nav-link" onClick={() => handleNavigation("/")}>
          LiveStream
        </button>
        <button 
          className="nav-link" 
          onClick={() => handleNavigation("/RecentPostedVideos")}
        >
          Recent Posted
        </button>
        <button 
          className="nav-link" 
          onClick={() => handleNavigation("/trendingVideos")}
        >
          Trending
        </button>
      </div>
    </div>
  );
};

export default Navbar;