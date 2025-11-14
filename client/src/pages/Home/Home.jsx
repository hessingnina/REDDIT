import './Home.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function Home() {
  const [topRedditor, setTopRedditor] = useState(null);
  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      axios.get('/top-redditor')
        .then(response => {
          setTopRedditor(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching top redditor:', error);
          setLoading(false);
        });
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get('/stats')
      .then(res => setMembers(res.data.members))
      .catch(err => console.error(err));
  }, []);


  return (
    <div id="home">
      <div className="hero">
        <div id="description">
          <h1 id="big-header">Berkeley Reddit Analytics</h1>
          <h3 className="small-header">Real-Time Reddit Trends, Local Berkeley Insights.</h3>
        </div>
        <div className="stat-row">
          <div className="stat-col">
            <span className="stat-number">{members ?? "..."}</span>
            <span className="stat-label">Bears Online</span>
          </div>

          <div className="stat-col">
            <span className="stat-number">{topRedditor?.weekly_posts ?? "..."}</span>
            <span className="stat-label">Posts This Week</span>
          </div>
        </div>
      </div>

      <div className="grid-two">
        <div className="card">
          <h2 className="card-title">Weekly Top Redditor</h2>
          {loading ? (
            <p>Loading...</p>
          ) : topRedditor ? (
            <div className="redditor-card">
              <h3>u/{topRedditor.username}</h3>
              <p><span>Upvotes</span> <strong>{topRedditor.upvotes}</strong></p>
              <p><span>Posts</span> <strong>{topRedditor.posts}</strong></p>
              <p><span>Comments</span> <strong>{topRedditor.comments}</strong></p>
            </div>
          ) : <p>No data available.</p>}
        </div>

        <div className="card">
          <h2 className="card-title">Weekly Top Emoji</h2>
        </div>
      </div>

      <div className="food-container">
        <h2 className="food-title">Top Food Spots</h2>

        <div className="food-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="food-card">
              <div className="food-footer"></div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;