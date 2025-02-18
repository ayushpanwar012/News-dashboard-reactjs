import axios from 'axios'
import React, { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import VideoItem from '../utils/VideoItem'
import WordCloudRender from '../utils/WordCloud'
import TagAnalysis from '../utils/TagAnalysis'


const CurrentLiveStream = () =>{
    const [videos,setVideos] = useState([])
    const [channel,setChannel]= useState([])
    const[selectedChannel,setSelectedChannel]= useState("Top 50 streams");
    const [filtervideos,setFilterVideos]=useState([]);
    const [activetab,setActiveTab] = useState("topLivestream")
    const [getCategory,setCategory] = useState("")
    const [progress,setProgress] = useState(0)


    const handleChannelName = (e) => {
      setSelectedChannel(e);
  
    };

  const handleTabChange = (tabName) =>{
    setActiveTab(tabName)

  }



 
  

const Fetch = useCallback(async()=>{
  setProgress(10)
  const queryParams = new URLSearchParams(window.location.search);
    setCategory(queryParams.get("category"));


    try { const api_link= `/api/fetch-concurrent-views?${queryParams.toString()}`;
    const response = await axios.get(api_link);
    setProgress(50)
    const videoData = response.data.latest_concurrent_views;
    const sortedvideos = videoData.sort( (a,b)=>
      b.concurrent_view_count - a.concurrent_view_count
    )

    setVideos(sortedvideos)

    const channelName = ["Top 50 streams", "All channel top",...new Set(sortedvideos.map((e)=>e.channel_name))]

    setChannel(channelName)
    setProgress(100)
  }
  catch (error) {
  console.error("error")
  }

  finally{
  setTimeout(()=>setProgress(0),500)
  }



},[])

useEffect(() => {
  Fetch()

}, []);


useEffect(()=>{
  const fetchOnSchedule = () =>{
    const now = new Date();
    const minutes = now.getMinutes();
    const strminutes = minutes.toString();

    if(
      strminutes.charAt(strminutes.length - 1) ==="1"
                    ||
      strminutes.charAt(strminutes.length - 1) ==="6"              
    ){
      Fetch();
    }
  }

    const intervalId = setInterval((fetchOnSchedule),60000);
    return ()=>clearInterval(intervalId)  
},[])

useEffect(() => {
  // Re-apply filter when videos or selectedChannel changes
 
  if (selectedChannel === 'Top 50 streams') {
    const newFilterVideos = videos.slice(0, 50);
    setFilterVideos(newFilterVideos);
  } 
  else if (selectedChannel === 'All channel top') {

    
    const differentstreams = {}

    videos.forEach((e)=>{
      if(! differentstreams[e.channel_name]){
        differentstreams[e.channel_name] = e
      }
    })
    const newchannel =  Object.values(differentstreams)
  
  
    setFilterVideos(newchannel);
  }
   else {
    const newFilterVideos = videos.filter(video => video.channel_name === selectedChannel);
    setFilterVideos(newFilterVideos);
     }
},[videos,selectedChannel])


return (
    <>
    <div className={`progress-bar ${progress === 0 ?"hidden" : ""}`}
        style={{ width: `${progress}%`}}
        ></div>
    <div >
    <h2 style={{textAlign:'center'}}>{getCategory} Current LiveStreams</h2>
    <div style={{ textAlign: "center", margin: "20px", fontFamily: "Ariel" }}>
        <label htmlFor="channel-select">Filter: </label>
        <select
          id="channel-select"
          onChange={(e) => handleChannelName(e.target.value)}
          value={selectedChannel}
        >
          {[...channel].map(
            (channels, idx) => (
              <option key={idx} value={channels}>
                {channels || "Unknown"}
              </option>
            )
          )}
        </select>
        
        
    </div>
        <div className ="tab-container">
          <div style={{display:'flex',justifyContent:'center',gap:"20px",marginBottom:'10px'}} className = "tab-header" >
            
            <button 
            className ="Top"
            onClick={()=>handleTabChange("topLivestream")}>Top LiveStream</button>
            <button 
            className ="word"
            onClick={()=>handleTabChange("wordcloud")}> Word cloud</button>
            <button 
            className='Hash'
            onClick={()=>handleTabChange("tagranking")}>Hash tag Ranking</button>
          </div>
        </div>
        <div className='tab-contents'>
         
          {  ( activetab==="topLivestream") &&
           (<div style={{ gap:'10px' ,marginBottom:'10px',flexWrap:"wrap", border:'1px solid #ddd',borderRadius:"5px",padding:'20px',justifyContent:"center",display:"flex",width:"100%"}}>
           {filtervideos.map((video,index)=> 
               (<VideoItem  component = {'Livestream'} video={video} key={index}/>))}</div>)
               }

          {(activetab === "wordcloud") &&
           (
           <div className='wordcloud'>
            <WordCloudRender component ={'stream_word'}  Videodata ={filtervideos}/>
          </div>)}
          {(activetab === "tagranking") && (
            
            <div>
              <TagAnalysis component ={'stream-tags'} videos ={filtervideos}/>
              
                    </div>)}
       
       
       
   </div>



        </div>


         
    
</>
)

}
export default CurrentLiveStream