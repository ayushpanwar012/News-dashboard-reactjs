import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import "./tabs.css";
import { scaleLog } from "@visx/scale";
// import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
// import { Text } from '@visx/text';
import { removeStopwords, eng, hin, ben, guj} from 'stopword';
import isEqual from "lodash/isEqual";
import TagsAnalysis from "./TagsAnalysis2";
import WordCloudRender from "./wordCloudRender";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";

function useDeepCompareEffect(callback, dependencies) {
  const currentDependenciesRef = useRef();
  const callbackRef = useRef(callback);

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = dependencies;
  }

  // Update callback ref on each render
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
  }, [currentDependenciesRef.current]); // Now only `currentDependenciesRef.current` is in the dependency array
}

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

const allStopwords = [
  ...eng,
  ...hin,
  ...ben,
  ...guj,
  ...customStopwords,
];
const convertDataToExcelFormat = (videos, wordData) => {
  const workbook = XLSX.utils.book_new();

  // Word Cloud Sheet
  const wordCloudData = wordData.map(word => ({
    Word: word.text,
    Weight: Math.round((word.value / Math.max(...wordData.map(w => w.value))) * 100),
  })).sort((a, b) => b.Weight - a.Weight); // Sorted by Weight in descending order, rounded to nearest whole number
  const wordCloudSheet = XLSX.utils.json_to_sheet(wordCloudData);
  XLSX.utils.book_append_sheet(workbook, wordCloudSheet, 'Word Cloud');

  // Hashtag Sheet
  const allHashtags = videos.flatMap(video =>
    video.hashtag?.split(' ').map(tag => tag.replace(/,/g, ''))
  );
  const hashtagCounts = allHashtags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const hashtagData = Object.entries(hashtagCounts).map(([tag, count]) => ({
    Hashtag: tag,
    Weight: Math.round((count / Math.max(...Object.values(hashtagCounts))) * 100),
  })).sort((a, b) => b.Weight - a.Weight); // Sorted by Weight in descending order, rounded to nearest whole number
  const hashtagSheet = XLSX.utils.json_to_sheet(hashtagData);
  XLSX.utils.book_append_sheet(workbook, hashtagSheet, 'Hashtags');

  // Tags Sheet
  const allTags = videos.flatMap(video =>
    video.tags?.split(',').map(tag => tag.trim())
  );
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const tagsData = Object.entries(tagCounts).map(([tag, count]) => ({
    Tag: tag,
    Weight: Math.round((count / Math.max(...Object.values(tagCounts))) * 100),
  })).sort((a, b) => b.Weight - a.Weight); // Sorted by Weight in descending order, rounded to nearest whole number
  const tagsSheet = XLSX.utils.json_to_sheet(tagsData);
  XLSX.utils.book_append_sheet(workbook, tagsSheet, 'Tags');
  // Videos Sheet (Unchanged)
  const videosData = videos.map(({ channel_name, title, concurrent_view_count }) => ({
    channelName: channel_name,
    Title: title,
    'Concurrent Viewers': concurrent_view_count,
  }));
  const videosSheet = XLSX.utils.json_to_sheet(videosData);
  XLSX.utils.book_append_sheet(workbook, videosSheet, 'Videos');

  return workbook;
};

const VideoItem = ({ video }) => {
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
  let titleChangeInfo;
  const viewsInfo = (
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
        height="169"
        src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
        frameBorder="0"
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
        {viewsInfo}
        {titleChangeInfo}
      </div>
    </div>
  );
};

const colors = ["#143059", "#2F6B9A", "#82a6c2"]; // Define your color scheme

function wordFreq(wordsArray, videos = [], basedOnViews = false) {
  const freqMap = {};

  // Updated regex pattern to include all major Indic scripts
  const indicRegex = /[\p{L}\p{N}\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF]+/gu;

  wordsArray.forEach((word) => {
    if (!/\d/.test(word)) {
      const normalizedWord = word.toLowerCase();
      if (!freqMap[normalizedWord]) {
        freqMap[normalizedWord] = basedOnViews ? 0 : 1;
      } else if (!basedOnViews) {
        freqMap[normalizedWord] += 1;
      }
    }
  });

  if (basedOnViews) {
    videos.forEach((video) => {
      const titleWords =
        video.title.toLowerCase().match(indicRegex) || [];
      const cleanedWords = removeStopwords(titleWords, [
        ...eng,
        ...hin,
        // Include other stopwords lists as needed
        ...customStopwords,
      ]).filter((word) => !/\d/.test(word));
      cleanedWords.forEach((word) => {
        const normalizedWord = word.toLowerCase();
        if (freqMap[normalizedWord] !== undefined) {
          freqMap[normalizedWord] += video.concurrent_view_count;
        }
      });
    });
  }

  const wordFreqArray = Object.keys(freqMap).map((word) => ({
    text: word,
    value: freqMap[word],
  }));

  return wordFreqArray;
}


function normalizeWordValues(wordFreqArray) {
  // console.log("Normalizing word values");
  const values = wordFreqArray.map((word) => word.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  return wordFreqArray.map((word) => ({
    text: word.text,
    value: 1 + (99 * (word.value - minValue)) / (maxValue - minValue), // Normalize to [1, 100]
  }));
}

const VideosGrid = ({userCategories}) => 
{
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const location = useLocation()
  const [selectedChannel, setSelectedChannel] = useState(
    "Top 50 Streams",
  );
  const [progress, setProgress] = useState(0);
  const isComponentMounted = useRef(true); // Ref to track component mount status
  const [activeTab, setActiveTab] = useState("streams"); // 'streams' or 'wordcloud'
  const [wordData, setWordData] = useState([]);
  const [spiralType, setSpiralType] = useState("archimedean"); // 'archimedean' or 'rectangular'
  const [withRotation, setWithRotation] = useState(false);
  const [wordCloudDimensions, setWordCloudDimensions] = useState({
    width: 500, // default base width
    height: 400, // default base height
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [basedOnViews, setBasedOnViews] = useState(true);
  const sortVideosByViewCount = (videos) => {
    return [...videos].sort(
      (a, b) => b.concurrent_view_count - a.concurrent_view_count
    );
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  // Simplify category extraction logic to prevent unnecessary state updates
  const getCategoryFromUrl = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("category") || "All Channels Top Streams"; // Default to 'All Channels Top Streams'
  };
  const filterVideosByChannel = (videos, channel) => {
    if (channel === "Top 50 Streams") {
      return sortVideosByViewCount(videos).slice(0, 50);
    } else if (channel === "All Channels Top Streams") {
      const videosByChannel = {};
      videos.forEach((video) => {
        if (
          !videosByChannel[video.channel_name] ||
          video.concurrent_view_count >
            videosByChannel[video.channel_name].concurrent_view_count
        ) {
          videosByChannel[video.channel_name] = video;
        }
      });

      return Object.values(videosByChannel).sort(
        (a, b) => b.concurrent_view_count - a.concurrent_view_count
      );
    } else {
      return videos.filter((video) => video.channel_name === channel);
    }
  };
  const handleDownload = (videos, wordData) => {
    const workbook = convertDataToExcelFormat(videos, wordData);
    XLSX.writeFile(workbook, "livestream_data.xlsx");
  };
  // const location = useLocation();
  // const navigate = useNavigate();

  // Function to check and return valid category from URL or first category from userCategories
  const validateCategory = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = queryParams.get("category");
    const storedCategories = JSON.parse(localStorage.getItem('LivestreamAccess') || '[]');
    // Update userCategories state in case it's not in sync with localStorage
    if (storedCategories.length > 0 && (userCategories.length === 0 || userCategories.length < storedCategories.length)) {
      userCategories = storedCategories;
    }
    console.log(userCategories)
    console.log(storedCategories)
    console.log(categoryFromUrl)
    if (userCategories.includes(categoryFromUrl)) {
      console.log("Category from URL matched Access Array. Extracted Category from the URL is: ", categoryFromUrl)
      return categoryFromUrl;
    }
    
    // Fallback to the first category from userCategories array
    const firstCategory = userCategories[0] || "null";
    // alert("Access Denied! Returning Back!")
    console.log("Category didn't match access array. So sending first category: ", firstCategory)
    return firstCategory;
  };

  const fetchData = async (category) => {
    // console.log("Fetching data...");
    if (!isComponentMounted.current) return;
    setProgress(20);
    // console.log("fetchData called");
    try {
      const queryParams = new URLSearchParams();
      if (category && category !== "All Channels Top Streams") {
        queryParams.append("category", category);
      }
      // Retrieve 'specific_channel' from localStorage
      const specific_channel = JSON.parse(localStorage.getItem("specific_channel"));
      if (specific_channel) {
        queryParams.append("specific_channel", specific_channel);
      }
      // console.log("About To send Request to the API");
      const api_link = `https://asia-south1-looker-dashboard-407713.cloudfunctions.net/fetch-concurrent-views?${queryParams.toString()}`;
      const response = await axios.get(api_link);
      console.log(response);
      setProgress(50);
      const data = response.data.latest_concurrent_views;
      if (Array.isArray(data)) {
        setVideos(data);
        const channelNames = [
          "Top 50 Streams",
          "All Channels Top Streams",
          ...new Set(data.map((video) => video.channel_name)),
        ];
        setChannels(channelNames);
        setProgress(100);
      } else {
        console.error("Data fetched is not an array:", data);
        setVideos([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => setProgress(0), 500); // Reset progress bar after a short delay
    }
  };

  useEffect(() => {
    // const category = getCategoryFromUrl(); // This now runs every time the URL search params change
    fetchData(validateCategory()); // validateCategory now correctly uses the current URL query params
    setSelectedChannel("Top 50 Streams"); // This might need further adjustment based on your needs

    // You probably don't need the handleUrlChange function and the event listener anymore,
    // as the useEffect hook itself takes care of responding to URL changes.
  }, [location.search]); /// Only run on mount and unmount

  
  useEffect(() => {
    function handleResize() {
      // console.log("Handling resize...");
      const isNowMobile = window.innerWidth < 600;
      setIsMobile(isNowMobile);

      // Adjust the word cloud dimensions and font size range based on the device width
      const scaleFactor = isNowMobile ? 0.9 : 0.7; // Smaller scale factor for mobile
      const width = Math.max(window.innerWidth * scaleFactor, 300); // Ensuring a minimum width
      const height = Math.max(window.innerHeight * scaleFactor, 300); // Ensuring a minimum height
      setWordCloudDimensions({ width, height });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call the resize function to set the initial dimensions

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoized value for the font size scale
  const fontSizeScale = useMemo(() => {
    // Adjust the font size range based on the viewport width
    const minFontSize = 12;
    const maxFontSize = isMobile ? 40 : 80; // Smaller maximum for mobile

    return scaleLog({
      domain: [
        Math.min(...wordData.map((d) => d.value)),
        Math.max(...wordData.map((d) => d.value)),
      ],
      range: [minFontSize, maxFontSize],
    });
  }, [wordData, isMobile]);

  useEffect(() => {
    // New useEffect for periodic data fetching
    const fetchOnSchedule = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      // console.log(minutes);
      const strminutes = minutes.toString();
      console.log(strminutes.charAt(strminutes.length - 1));
      if (
        strminutes.charAt(strminutes.length - 1) === "1" ||
        strminutes.charAt(strminutes.length - 1) === "6"
      ) {
        const category = getCategoryFromUrl();
        // console.log("Inside useEffect For Fetching data at intervals");
        fetchData(category);
      }
    };

    // Set interval to check every minute
    const intervalId = setInterval(fetchOnSchedule, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useDeepCompareEffect(() => {
    const newFilteredVideos = sortVideosByViewCount(
      filterVideosByChannel(videos, selectedChannel)
    );
    setFilteredVideos(newFilteredVideos);
  }, [videos, selectedChannel]);

  const wordDataMemo = useMemo(() => {
    const filteredVideos = filterVideosByChannel(videos, selectedChannel);
    const words = filteredVideos.flatMap((video) =>
      // Extended Unicode range to include all major Indic scripts
      (video.title.toLowerCase().match(/[\p{L}\p{N}\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF]+/gu) || []).filter(
        (word) => !/\d/.test(word)
      )
    );
  
    const cleanedWords = removeStopwords(words, [
      ...eng,
      ...hin,
      ...customStopwords,
      // Add more stopwords lists for other languages if needed
    ]);
  
    let wordDataProcessed = wordFreq(
      cleanedWords,
      filteredVideos,
      basedOnViews
    );
    if (basedOnViews) {
      wordDataProcessed = normalizeWordValues(wordDataProcessed);
    }
    return wordDataProcessed;
  }, [selectedChannel, videos, basedOnViews]);

  useDeepCompareEffect(() => {
    setWordData(wordDataMemo);
  }, [wordDataMemo]);

  // Handle dropdown selection change
  const handleChannelChange = (channel) => {
    setSelectedChannel(channel);
    let newFilteredVideos = videos;
  
    if (channel === "All Channels Top Streams") {
      const videosByChannel = {};
      videos.forEach((video) => {
        if (
          !videosByChannel[video.channel_name] ||
          video.concurrent_view_count >
            videosByChannel[video.channel_name].concurrent_view_count
        ) {
          videosByChannel[video.channel_name] = video;
        }
      });
      newFilteredVideos = Object.values(videosByChannel);
    } else if (channel === "Top 50 Streams") {
      // Only considering "Top 50 Streams" option
      newFilteredVideos = [...videos]
        .sort((a, b) => b.concurrent_view_count - a.concurrent_view_count)
        .slice(0, 50); // Limit to top 50 videos by concurrent view count
    } else {
      // If a specific channel is selected, filter videos by that channel
      newFilteredVideos = videos.filter(
        (video) => video.channel_name === channel
      );
    }

    // Sort the filtered videos by view count
    newFilteredVideos = sortVideosByViewCount(newFilteredVideos);
  
    // Update state with the sorted and filtered videos
    setFilteredVideos(newFilteredVideos);
  };
  

  return (
    <div>
      <button className="download-button"
        onClick={() =>  handleDownload(filteredVideos, wordData)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1}}
      >
        Download Data ⬇️
      </button>
      <div
        className={`progress-bar ${progress === 0 ? "hidden" : ""}`}
        style={{ width: `${progress}%` }}
      ></div>
      <h2 style={{ textAlign: 'center' , fontFamily: 'Ariel'}}>Current Livestreams</h2>
      <div style={{ textAlign: "center", margin: "20px", fontFamily: "Ariel" }}>
        <label htmlFor="channel-select">Filter: </label>
        <select
          id="channel-select"
          onChange={(e) => handleChannelChange(e.target.value)}
          value={selectedChannel}
        >
          {[...channels].map(
            (channel, idx) => (
              <option key={idx} value={channel}>
                {channel || "Unknown"}
              </option>
            )
          )}
        </select>
      </div>
      <div className="tabs-container3">
        <div className="tabs-header3" style={{ fontFamily: "Ariel" }}>
          <button
            onClick={() => handleTabChange("streams")}
            className={`tab-button3 ${activeTab === "streams" ? "active" : ""}`}
          >
            Top Livestreams
          </button>
          <button
            onClick={() => handleTabChange("wordcloud")}
            className={`tab-button3 ${
              activeTab === "wordcloud" ? "active" : ""
            }`}
          >
            Livestream Title Word Cloud
          </button>
          <button
            onClick={() => handleTabChange("Ranking")}
            className={`tab-button3 ${activeTab === "Ranking" ? "active" : ""}`}
          >
            Hashtags/Tags Ranking
          </button>
        </div>
      </div>
      <div className="tabs-content3">
        {activeTab === "streams" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {filteredVideos.map((video) => (
              <VideoItem key={video.youtube_video_id} video={video} />
            ))}
          </div>
        )}
        {activeTab === "wordcloud" && (
          <WordCloudRender
            wordData={wordData}
            wordCloudDimensions={wordCloudDimensions}
            fontSizeScale={fontSizeScale}
            colors={colors}
            spiralType={spiralType}
            setSpiralType={setSpiralType}
            withRotation={withRotation}
            setWithRotation={setWithRotation}
            basedOnViews={basedOnViews}
            setBasedOnViews={setBasedOnViews}
            isMobile={isMobile}
          />
        )}
        {activeTab === "Ranking" && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {activeTab === "Ranking" && (
              <TagsAnalysis
                videos={filteredVideos}
                customStopword={customStopwords}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosGrid;
