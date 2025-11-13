import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { spawnSync, spawn } from 'child_process';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {

  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "connect-src 'self' http://localhost:3000; " +
    "img-src 'self' data: blob:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline';"
  );

  next();
});

const mongoURI = process.env.MONGOOSE_CONNECTION;
await mongoose.connect(mongoURI);

const ProjectModel = mongoose.model('TopRedditor', new mongoose.Schema({
  timestamp: Date,
  username: String,
  upvotes: Number,
  posts: Number,
  comments: Number
}), "top_redditor");


app.get('/top-redditor', async (req, res) => {
  const latestCache = await ProjectModel.findOne().sort({ timestamp: -1 }).lean();
  const now = new Date();

  if (latestCache) {
    res.json(latestCache); 
  }

  const py = spawn("python3", ["scripts/get_latest_post.py"]);
  let output = "";

  py.stdout.on("data", data => {
    output += data.toString();
  });

  py.stderr.on("data", err => {
    console.error("Python error:", err.toString());
  });

  py.on("close", async () => {
    try {
      const latestPostJSON = JSON.parse(output);
      const latestPostTime = new Date(latestPostJSON.latest * 1000);

      if (!latestCache || latestPostTime > latestCache.timestamp) {
        const pyTop = spawn("python3", ["scripts/top_redditor.py"]);
        let topOutput = "";

        pyTop.stdout.on("data", data => {
          topOutput += data.toString();
        });

        pyTop.on("close", async () => {
          const newJSONTop = JSON.parse(topOutput);
          if (
            newJSONTop.username &&
            typeof newJSONTop.upvotes === "number" &&
            typeof newJSONTop.posts === "number" &&
            typeof newJSONTop.comments === "number"
          ) {
            const hasChanged =
              !latestCache ||
              latestCache.upvotes !== newJSONTop.upvotes ||
              latestCache.posts !== newJSONTop.posts ||
              latestCache.comments !== newJSONTop.comments;

            if (hasChanged) {
              await ProjectModel.create({
                timestamp: now,
                username: newJSONTop.username,
                upvotes: newJSONTop.upvotes,
                posts: newJSONTop.posts,
                comments: newJSONTop.comments
              });
            }
        }
      })
      }
    } catch (err) {
      console.error("Background refresh failed:", err);
    }
  });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});