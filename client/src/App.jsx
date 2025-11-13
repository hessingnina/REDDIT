import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import WeeklyDigest from './pages/WeeklyDigest/WeeklyDigest'
import FoodSpots from './pages/FoodSpots/FoodSpots'
import Trends from './pages/Trends/Trends'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/weekly-digest" element={<WeeklyDigest />} />
        <Route path="/food-spots" element={<FoodSpots />} />
        <Route path="/trends" element={<Trends/>} />
      </Routes>
    </>
  )
}

export default App
