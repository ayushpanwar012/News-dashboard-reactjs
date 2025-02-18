import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from "moment-timezone"
import VideoItem from '../utils/VideoItem';
import WordCloudRender from '../utils/WordCloud'
import TagAnalysis from '../utils/TagAnalysis';


 const MainRecentlyPosted = () => {
  const [videos,setVideos] = useState([]);
  const [channel,setChannel] = useState([]);
  const [selectedChannel,setSelectedChannel] = useState('All channels')
  const [filtervideos,setFilterVideos] = useState([])
  const [Activetab,setActiveTab] = useState("recently_posted_videos")
  const [progress,setProgress] = useState(0)

  const handlechannelName = (e)=>{
    setSelectedChannel(e);
    
  }
const handleTabChange = (tabName)=>{
   setActiveTab(tabName)

     }
  useEffect(() => {
   if(selectedChannel === 'All channels'){
    const differentchannel ={}
    videos.forEach((e)=>{
      if(!differentchannel[e.channel_name]){
        differentchannel[e.channel_name] = e
      }
    })
    const onechannel = Object.values(differentchannel)
    
    setFilterVideos(onechannel);
   }
   
   else {
    const newfiltervideos = videos.filter((video)=>video.channel_name === selectedChannel)
    setFilterVideos(newfiltervideos)

   }
  },[videos,selectedChannel])
  



  

    const fetechData = async() =>{
      setProgress(10)
      try{
       const currentTime = moment().tz("Asia/Kolkata");
      const endTime = currentTime.format("YYYY-MM-DD HH:mm:ss")
      let startTime ;
      startTime = currentTime.subtract("1","hours").format("YYYY-MM-DD HH:mm:ss")
        
      const category = new URLSearchParams(window.location.search).get("category")

    const queryString = `?start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}&category=${category}`
      
        const api_Link = `/api/get-recently-posted-videos${queryString}`
        const response = await axios.get(api_Link)
        const videoData = response.data.latest_vod_views;
        
        setVideos(videoData);
        setProgress(50)
        const channelName = ["All channels", ...new Set(videoData.map((e)=>e.channel_name))]
          setChannel(channelName)
    
          setProgress(100)
      }
    catch(error){
      console.error("Error fetching data: ", error);
    }
    finally{
      setTimeout(()=>setProgress(0),500)
    }
  }

    useEffect(()=>{
      const fetchOnSchedule = () =>{
      const now = new Date();
      const minutes = now.getMinutes();
      const strMinutes = minutes.toString();
      
      if(
        strMinutes.charAt(strMinutes.length -1) ==='1'
                      ||
        strMinutes.charAt(strMinutes.length -1) ==='6'
      ){
        fetechData();
      }

      }
      const intervalId = setTimeout((fetchOnSchedule),6000);
      return ()=>clearTimeout(intervalId)
    },[])


    useEffect(() => {
    fetechData()
    }, [])
    
  return (
    <>
    <div className={`progress-bar ${progress === 0 ?"hidden" : ""}`}
        style={{ width: `${progress}%`}}
        >
    </div>
    <div>
    <div style={{textAlign:'center', margin:'20px',fontFamily:'Ariel'}}>
    <h2> Recently Posted Videos</h2>
    <label htmlFor="channel-select">Filter:</label>
    <select
    id='channel-select'
    value={selectedChannel}
    onChange={(e)=>handlechannelName(e.target.value)}
    >
      {[...channel].map(
        (channels,index)=>(
          <option
          key={index} value={channels}>
            {channels|| "unknown"}
          </option>
        ))}  
    </select>
    </div>
    <div className='tab-container'>
    <div style={{display:'flex',justifyContent:'center',gap:'20px',marginBottom:'10px'}} className='tab-headeer'>
      <button
      className="recently_posted"
      onClick={()=>handleTabChange("recently_posted_videos")}
      >Recently Posted videos</button>
      <button
      className ="word"
      onClick={()=>handleTabChange("wordcloud")}>Word cloud</button>
      <button 
            className='Hash'
            onClick={()=>handleTabChange("tagranking")}>Hash tag Ranking</button>
    </div>
    </div>
    <div className='tab-content'>
      {(Activetab ==="recently_posted_videos")&&(
        <div style={{ gap:'10px' ,marginBottom:'10px',flexWrap:"wrap", border:'1px solid #ddd',borderRadius:"5px",padding:'20px',justifyContent:"center",display:"flex",width:"100%"}}>
          {filtervideos.map((video,index)=>
          (<VideoItem component = {'recently_posted'} video = {video} key={index} /> ))}
      </div>)
      }
      {(Activetab ==='wordcloud')
      &&(
        <div className='wordcloud'>
          
          <WordCloudRender component = {'recent_word_cloud'} Videodata ={filtervideos}/>
          </div>
      )}

      {
        (Activetab ==="tagranking") &&
        (
          <div>
         <TagAnalysis component = {'recent_tags'} videos={filtervideos}/>
         </div>
        )
      }

    </div>
    </div>
    
    </>
  )
}

export default MainRecentlyPosted;