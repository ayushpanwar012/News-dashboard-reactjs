import React, { useMemo,useEffect,useState } from 'react'
 import { removeStopwords, eng, hin, ben, guj} from 'stopword';
 import WordCloud from 'react-d3-cloud';
 import { scaleOrdinal } from 'd3-scale';
 import { schemeCategory10 } from 'd3-scale-chromatic';

const colors = ['#143059', '#2F6B9A', '#82a6c2'];
 
 const customStopwords = [
  "latest",
  "live",
  "।",
  "updates",
  "top",
  "update",
  "best",
  "ep",
  "pradesh/chhattisgarh",
  "dd",
  "sudarshan",
  "news24",
  "nation",
  "samachar",
  "abp",
  "ch",
  "aaj",
  "aaj tak",
  "et",
  "cnbc",
  "profit",
  "tv",
  "business",
  "today",
  "mp",
  "wion",
  "zee",
  "bharat",
  "good",
  "times",
  "now",
  "world",
  "tv18",
  "up",
  "news18",
  "jk",
  "24x7",
  "ndtv",
  "swadesh",
  "cnn",
  "ananda",
  "lallantop",
  "madhya",
  "tak",
  "bharatvarsh",
  "india",
  "ganga",
  "state",
  "patrika",
  "navbharat",
  "mpcg",
  "firstpost",
  "tv9",
  "24",
  "newsx",
  "ani",
  "republic",
  "bihar",
  "rajasthan",
  "news",
  "ibc24",
  "bansal",
  "uk",
  "awaaz",
  "fatafat",
  "breaking",
  "gujarat",
  "gujarati"
];

const wordFreq = (wordArray, basedOnViews = false) =>{
     
  const wordFrequnecy = {};
   wordArray.forEach((word)=>{
    if(!wordFrequnecy[word]){
      wordFrequnecy[word] = basedOnViews ? 0 : 1;
    }
    else if (!basedOnViews){
      wordFrequnecy[word]+=1;
    }
   });
    
   
  const wordFreqArray = Object.keys(wordFrequnecy).map((word)=>({
    text:word,
    value:wordFrequnecy[word]

   }))
   return wordFreqArray;
  }

   function normalizeWordValues(wordFreqArray){

      const values = wordFreqArray.map((obj)=>obj.value)
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);
      

      const total_words = wordFreqArray.map((word)=>({
        text: word.text,
        value:1+(99*(word.value-minValue)/(maxValue-minValue)),


      }))
      return   total_words.sort((a,b)=>b.value - a.value).slice(0,200)
   }


const WordCloudRender = ({ component, Videodata}) => {

  

  const [wordData,setWordData] = useState([]);
  const [wordCloudDimensions, setWordCloudDimensions] = useState({
    width: 500, // default base width
    height: 400, // default base height
  });
  const [basedOnViews, setBasedOnViews] = useState(false);
  const [spiralType, setSpiralType] = useState("archimedean"); // 'archimedean' or 'rectangular'

 let multiplyer ;
 if(component === 'recent_word_cloud'||'trendingWords'){
  multiplyer = 10;
 }else if (component === 'stream_word'){
  multiplyer = 8
 };



  

  const wordDataMemo = ()=>{
    const word = Videodata.flatMap((video)=>(video.title.toLowerCase().match(/[\p{L}\p{N}\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF]+/gu) || []
   )
      .filter((word)=> !/\d/.test(word))
      )
   

    const cleanedWords = removeStopwords(word,[
      eng,
      hin,
      ben,
      guj,
      customStopwords
    ])

     let wordDataProcessed = wordFreq(cleanedWords,basedOnViews);
     
     
      wordDataProcessed = normalizeWordValues(wordDataProcessed)
      
     return wordDataProcessed
    

  }
   useEffect(() => {
   const words= wordDataMemo()
   setWordData(words)
   console.log(wordData)
   }, [Videodata])

   
     
     
     const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);
   
     
  
  return (
    <>
    <div className='word-cloud-container'>
    <div style ={{height:"100%",width:'100%'}}>
   <WordCloud
   className="word-cloud"
    data={wordData}
    width={wordCloudDimensions.width}
    height={wordCloudDimensions.height}
    fontSize={(word) => Math.log2(word.value) * multiplyer}
    font="Arial"
    padding={2}
    spiral={spiralType}
    random = {Math.random}
    rotate={0}
    fill={(d, i) => schemeCategory10ScaleOrdinal(i)}
    onWordClick={(event, d) => {
      console.log(`onWordClick: ${d.text}`);
    }}
    onWordMouseOver={(event, d) => {
      console.log(`onWordMouseOver: ${d.text}`);
    }}
    onWordMouseOut={(event, d) => {
      console.log(`onWordMouseOut: ${d.text}`);
    }}
   />
</div>
   
   </div>
    </>
  )
}


export default WordCloudRender
