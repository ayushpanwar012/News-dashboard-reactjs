# 📊 React Dashboard: Live Stream Analytics

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A **React-based web application** that works as a dashboard to analyze live streams, recently posted videos, and trending videos. The app provides insights into live stream views, word clouds, hashtags, and video rankings.

---

## 🌟 Features

### 1. **Live Stream Component**
- Displays current live streams with their views.
- Dropdown filter to select a specific channel (e.g., Hindi, English, Marathi).
- **Tabs:**
  1. **All Live Streams:** Lists all live streams.
  2. **Word Cloud:** Displays a word cloud of the most popular words in live stream titles.
  3. **Tags & Hashtags:** Shows the most occurring tags and hashtags in the selected channel's live streams.

### 2. **Recently Posted Videos Component**
- **Tabs:**
  1. **Word Cloud:** Displays a word cloud of titles from recently posted videos.
  2. **Hashtags & Tags Rankings:** Ranks the most used hashtags and tags.
  3. **Recent Videos Table:** A table with 100 rows showing:
     - Channel Name
     - Video Title (clickable to open the video)
     - Time since the video was posted (from recent to 1 hour ago).

### 3. **Trending Videos Component**
- **Tabs:**
  1. **Word Cloud:** Displays a word cloud of titles from trending videos.
  2. **Hashtags & Tags Rankings:** Ranks the most used hashtags and tags.
  3. **Trending Videos Table:** A table showing:
     - Channel Name
     - Video Title (clickable to open the video)
     - Views gained in the last 1 hour.

---

## 🗂️ Folder Structure
```

├── .gitignore
├── directory_structure.txt
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
└── src
├── App.css
├── App.jsx
├── index.css
├── main.jsx
└── component
├── LiveStream
│ ├── current-livestreams.js
│ └── CurrentLiveStream.jsx
├── navbar
│ └── navbar.jsx
├── RecentlyPosted
│ └── MainRecentlyPosted.jsx
├── trending
│ ├── MainTrending.jsx
│ └── VideoList.jsx
└── utils
├── TagAnalysis.jsx
├── VideoItem.jsx
└── WordCloud.jsx
```

## 🚀 How to Run the Project Locally

Follow these steps to set up and run the project on your local machine:

### Prerequisites
- **Node.js** (v16 or higher) installed on your system.
- **npm** (Node Package Manager) or **yarn**.

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/ayushpanwar012/News-dashboard-reactjs
   cd News-dashboard-reactjs

2. **Install Dependencies:**


    ```
    npm install
    ```

    or

    ```
    yarn install
    ```

3. **Start the Development Server:**

    ```
    npm run dev
    ```

    or

    ```
    yarn dev
    ```

4. **Open the App:**

    ```
    The app will be running at http://localhost:5173 (or another port if specified).

    Open your browser and navigate to the URL to view the dashboard.
    ```

## 🛠️ Technologies Used
1. **Frontend:**
    React.js

    Vite (for fast development builds)

    CSS for styling

2. **Utilities:**

    Word Cloud generation for visualizing popular words.

    Table components for displaying video data.

## 📝 Notes
1. **Dropdown Filters:** The dropdown filters in the Live Stream component allow users to filter live streams by channel categories (e.g., Hindi, English, Marathi).

2. **Clickable Titles:** Video titles in the tables are clickable and redirect users to the respective video.

3. **Dynamic Data:** The app is designed to handle dynamic data, making it easy to integrate with APIs for real-time updates.

