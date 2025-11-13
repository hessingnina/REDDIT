const express = require('express');
const app = express();

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGOOSE_CONNECTION)

const ProjectModel = mongoose.model('TopRedditor', new mongoose.Schema({
  timeStamp: Date,
  username: String,
  score: Number
}), "top_redditors");

app.get('/top-redditor', async (req, res) => {
  const latestCache = await TopRedditor.findOne().sort({ timestamp : -1 })

  const pythonCheck = spawnSync("python3", ["get_latest_post.py"])
    try {
        const projects = await ProjectModel.find({});
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});