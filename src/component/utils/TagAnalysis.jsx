import React from 'react'



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
];

 const TagAnalysis = ({ component,videos}) => {
let key1;
let key2;
  if(component === 'trending-tag'){
    key1="latest_hashtag"
    key2="latest_tags"
  }
  else{
    key1="hashtag"
    key2="tags"
  }
  console.log(videos[0].key1)
  
  const stopwordsLower = customStopwords.map((word)=>word.toLowerCase());
  //helper function to count occurrences
  const countOccurrences = (arr) =>{
    return arr.reduce((prev,curr)=>{
      prev[curr] = (prev[curr] || 0)+ 1;
      return prev;
    },{});
  }
  // Helper function to remove tags containing any stopwords
  const removeTagWithStopWords = (tagsArray,stopwords)=>{
    return tagsArray.filter((tag)=>{
      //split the tag into words and convert to lowercase
      const words = tag.toLowerCase().split(/\s+/);
      // check each word to see if it is a stopword
       return !words.some((word)=>stopwords.includes(word));
    });
  };

//Extract and process hashtags and tags,removing those that contains stopwords
    const allHashtags = removeTagWithStopWords(videos.flatMap((video)=>(video[key1] ?video[key1].split(" "):[])),stopwordsLower)
    const allTags = removeTagWithStopWords(videos.flatMap((video)=>(video[key2]? video[key2].split(" "):[])),stopwordsLower)
 
 //counts occurrences with or without wiew count weightage
 const hashTagsCount = countOccurrences(allHashtags);
 const tagsCount = countOccurrences(allTags);
 
 
 const sortedhashtags = Object.entries(hashTagsCount)
 .sort((a,b)=> b[1] - a[1] )
 .slice(0,50)

 const sortedtags = Object.entries(tagsCount)
 .sort((a,b)=>b[1] - a[1])
 .slice(0,50)


  return (
      
      
        <div className='tags-analysis-container'>
          <div className='ranking-table'>
            <h2>Top 50 Hashtags</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hashtag</th>
                </tr>
              </thead>
              <tbody>
                {sortedhashtags.map(([hashtag,count],index)=>(
                  <tr key = {index}>
                    <td>{index+1}</td>
                    <td>{hashtag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='ranking-table'>
                <h2>Top 50 tags</h2>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedtags.map(([tag,count],index)=>(
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{tag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
        </div>
      
     
  )
}

export default TagAnalysis