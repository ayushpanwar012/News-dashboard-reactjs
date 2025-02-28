import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-timezone";
import WordCloudRender from "../utils/WordCloud";
import TagAnalysis from "../utils/TagAnalysis";
import VideoList from "./VideoList";

const MainTrending = () => {
  const [video, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("All channels");
  const [filtervideos, setFilterVideos] = useState([]);
  const [activetab, setActiveTab] = useState("trendingWordcloud");

  const handleTabChange = (e) => {
    setActiveTab(e);
  }
  const handlechannelchange = (e) => {
    setSelectedChannel(e);
  };

 

  const FetchData = async () => {

    try {
      const currentTime = moment().tz("Asia/kolkata");
      const endTime = currentTime.format("YYYY-MM-DD HH:mm:ss");
      let startTime = currentTime
        .subtract("1", "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      const category = new URLSearchParams(window.location.search).get(
        "category"
      );
      const queryString = `?start_time=${encodeURIComponent(
        startTime
      )}&end_time=${encodeURIComponent(endTime)}&category=${category}`;
      const api_link = `/api/get-vod-views${queryString}`;
      const response = await axios.get(api_link);
      const Data = response.data.latest_vod_views;
      setVideos(Data);
      const channelNames = [
        "All channels",
        ...new Set(Data.map((item) => item.channel_name)),
      ];
      setChannels(channelNames);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    FetchData();
  },[]);

  useEffect(() => {
    if (selectedChannel === "All channels") {
      video.sort((a,b)=>b.views_gained - a.views_gained).slice(0,100)
       setFilterVideos(video)   
     
    } else {
      const differentchannelvideos = video.filter(
        (v) => v.channel_name === selectedChannel
      );
      setFilterVideos(differentchannelvideos);
    }
  }, [video, selectedChannel]);

  return (
    <>
      <h2
        style={{
          textAlign: "center",
          fontFamily: "Ariel",
          marginBottom: "20px",
        }}
      >
        Trending videos
      </h2>
      <div style={{ textAlign: "center", margin: "20px", fontFamily: "Ariel" }}>
        <div className="dropdown-container">
          <label htmlFor="channel-filter">filter channel:</label>
          <select
            id="channel-Select"
            value={selectedChannel}
            onChange={(e) => handlechannelchange(e.target.value)}
          >
            {[...channels].map((channel, index) => (
              <option key={index} value={channel}>
                {channel || "Unknown"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="tab-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "10px",
          }}
          className="tab-headeer"
        >
          <button
            className="trending"
            onClick={() => handleTabChange("trendingWordcloud")}
          >
            Word cloud
          </button>
          <button
            className="trending"
            onClick={() => handleTabChange("trendingTags")}
          >
            tag Ranking
          </button>
          <button
            className="trending"
            onClick={() => handleTabChange("VideoList")}
          >
            trending videoList
          </button>
        </div>
      </div>
      <div className="tab-content">
        {activetab === "trendingWordcloud" && (
          <div className="wordcloud">
            <WordCloudRender
              component={"trendingWords"}
              Videodata={filtervideos}
            />
          </div>
        )}

        {activetab === "trendingTags" && (
          <div>
            <TagAnalysis component={"trending-tag"} videos={filtervideos} />
          </div>
        )}
        {activetab === "VideoList" && (
          <div>
            <VideoList videos={filtervideos} />
            
          </div>
        )}
      </div>
    </>
  );
};
export default MainTrending;
