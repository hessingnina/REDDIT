import './Home.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Home() {
  const [topRedditor, setTopRedditor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/top-redditor')
    .then(res => {
      setTopRedditor(res.data);
      setLoading(false);
    }, 5000)
    .catch(err => {
      console.error('Error fetching top redditor:', err);
      setLoading(false);
    })
  }, []);

  return (
    <div id="home">
      <div id="description">
        <h2 id="big-header">Berkeley Reddit Analytics</h2>
        <h3 id="small-header">Real-Time Reddit Trends, Local Berkeley Insights.</h3>
      </div>
      <div id="top-redditor-box">
        {loading ? (
          <p>Loading...</p>
        ) : topRedditor ? (
          <>
            <h2 id="berkeley-title">Weekly Berkeley Redditor</h2>
            <div id="berkeley-card">
              <h3 id="berkeley-username">u/{topRedditor.username}</h3>
              <p id="berkeley-score">🔥 Upvotes: {topRedditor.upvotes}</p>
              <p id="berkeley-score">🔥 Posts: {topRedditor.posts}</p>
              <p id="berkeley-score">🔥 Comments: {topRedditor.comments}</p>
            </div>
          </>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;