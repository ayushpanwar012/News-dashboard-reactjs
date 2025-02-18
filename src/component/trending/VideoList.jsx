import React, { useState, useEffect } from "react";

const VideoList = ({ videos }) => {
  const [sortvideos, setSortedVideo] = useState([]);
  const [title, setTitle] = useState([]);
  const [ChannelNames, setChannelNames] = useState([]);
  const [ViewsGained, setViewsGained] = useState([]);

  // Create a copy of the videos array and sort it

  useEffect(() => {
    const sortedVideos = [...videos]
      .sort((a, b) => b.views_gained - a.views_gained)
      .slice(0, 100);
    const channelName = sortedVideos.map((e) => e.channel_name);
    const titlename = sortedVideos.map((e) => e.title);
    const viewsGained = sortedVideos.map((e) => e.views_gained);
    setSortedVideo(sortedVideos);
    setTitle(titlename);
    setChannelNames(channelName);
    setViewsGained(viewsGained);

    console.log(channelName.slice(0, 5));
  }, [videos]);

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "20px 0",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#009879",
              color: "#ffffff",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "12px 15px" }}>S.no</th>
            <th style={{ padding: "12px 15px" }}>Channels</th>
            <th style={{ padding: "12px 15px" }}>Titles</th>
            <th style={{ padding: "12px 15px" }}>Views Gained</th>
          </tr>
        </thead>
        <tbody>
          {sortvideos.map((video, index) => (
            <tr
              style={{
                borderBottom: "1px solid #dddddd",
                transition: "background-color 0.3s",
              }}
              key={index}
            >
              <td style={{ padding: "12px 15px" }}>{index + 1}</td>
              <td style={{ padding: "12px 15px" }}>{video.channel_name}</td>
              <td style={{ padding: "12px 15px" }}>
                <a
               href={`https://www.youtube.com/watch?v=${video.youtube_video_id}`}
               target ="_blank"
               rel="noopener noreferrer"
               >
                {video.title}
               </a>
               </td>
              <td style={{ padding: "12px 15px" }}>{video.views_gained}</td>
            </tr>
          ))}
          {}
        </tbody>
      </table>
    </div>
  );
};

export default VideoList;
