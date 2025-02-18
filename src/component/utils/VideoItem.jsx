import React from "react";


const VideoItem = ({video,component }) => {
  
    // Function to calculate the percentage change
    const calculatePercentageChange = (oldValue, newValue) => {
      if (oldValue === 0) {
        // Return null when oldValue is 0 to indicate calculation should not be displayed
        return null;
      }
      const difference = newValue - oldValue;
      const percentageChange = (difference / oldValue) * 100;
      return percentageChange.toFixed(2); // Rounds to two decimal places
    };
  
    // Determine if there was a title change and calculate percentage change if applicable
    
   let  viewsInfo ;
   let titleChangeInfo;
    if(component === 'Livestream'){
       viewsInfo = (
        <span style={{ float: "right" }}>
          <span role="img" aria-label="eyes">
            👁
          </span>
          {video.concurrent_view_count.toLocaleString()}
        </span>
      );
  
    if (video.title_changed !== 0) {
      const percentageChange = calculatePercentageChange(
        video.avg_view_count_before_change,
        video.avg_view_count_after_change
      );
      if (percentageChange !== null) {
        // Only proceed if percentageChange is not null
        const changeDirection = percentageChange < 0 ? "🔻" : "🔺";
        const changeColor = percentageChange < 0 ? "red" : "green";
        titleChangeInfo = (
          <span>
            Title Changed:{" "}
            <span style={{ color: changeColor }}>
              {changeDirection}
              {Math.abs(percentageChange)}%
            </span>
          </span>
        );
      }
      
      }
    }
  
    return (
       
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          margin: "10px",
          width: "300px",
          fontFamily: "Arial",
          fontSize: "16px",
          
        }}
      >
        <iframe
          title={video.title}
          width="100%"
          height="169px"
          src={"https://www.youtube.com/embed/${video.youtube_video_id}"}
          frameBorder="12"
          allowFullScreen
        ></iframe>
        <p>
          <b>{video.channel_name}</b>
        </p>
        <p>{video.title}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {(component==='Livestream')&&(viewsInfo)}
          {(component === 'Livestream') && (titleChangeInfo)}
        </div>
      </div>
      
    );
  };
  export default VideoItem