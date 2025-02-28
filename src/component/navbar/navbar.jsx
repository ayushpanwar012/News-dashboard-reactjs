import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [openDropDown, setOpenDropDown] = useState(null);

  const handleNavigation = (path, category) => {
    setTimeout(() => {
      navigate(path + `?category=${encodeURIComponent(category)}`);
    }, 0);
  };

  const livestream = JSON.parse(localStorage.getItem("live"))|| [];
  const VOD = JSON.parse(localStorage.getItem("vood"))|| [];
  const trending = JSON.parse(localStorage.getItem("tren"))|| [];

  const handleMouseEnter = (e) => {
    setOpenDropDown(e);
  };
  const handleMouseLeave = () => {
    setOpenDropDown(null);
  };
  return (
    <div className="nav-links">
      <div
        className="nav-item"
        onMouseEnter={() => handleMouseEnter("livestream")}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-button"> LiveStream </button>
        {openDropDown === "livestream" && (
          <div className="dropdown">
            {livestream.map((category, key) => (
              <button
                key={key}
                onClick={()=>handleNavigation("/livestream", category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="nav-item"
        onMouseEnter={() => handleMouseEnter("recent")}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-button">Recent posted</button>

        {openDropDown === "recent" && (
          <div className="dropdown">
            {VOD.map((category,key)=>(
              <button
              key = {key}
              onClick={()=>handleNavigation('/recentlyPosted',category)}>
                {category}
              </button>
            ))}

            
          </div>
        )}
      </div>


      <div
        className="nav-item"
        onMouseEnter={() => handleMouseEnter("trending")}
        onMouseLeave={handleMouseLeave}
      >
        <button className="nav-button">trending</button>

        {openDropDown === "trending" && (
          <div className="dropdown">
            {trending.map((category,key)=>(
              <button
              key = {key}
              onClick={()=>handleNavigation('/trendingvideos',category)}>
                {category}
              </button>
            ))}

            
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
