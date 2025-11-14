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
console.log("Mongo connected!");

const ProjectModel = mongoose.model('TopRedditor', new mongoose.Schema({
  timestamp: Date,
  username: String,
  upvotes: Number,
  posts: Number,
  comments: Number,
  weekly_posts: Number,
}), "top_redditor");


app.get('/top-redditor', async (req, res) => {
  const latestCache = await ProjectModel.findOne().sort({ timestamp: -1 }).lean();
  const now = new Date();

  const py = spawn("python3", ["scripts/get_latest_post.py"]);
  let output = "";

  py.stdout.on("data", data => output += data.toString());
  py.stderr.on("data", err => console.error("Python error:", err.toString()));

  py.on("close", async () => {
    try {
      const latestPostJSON = JSON.parse(output);
      const latestPostTime = new Date(latestPostJSON.latest * 1000);

      const shouldRefreshWeekly =
        !latestCache ||
        latestPostTime > latestCache.timestamp;

      if (!shouldRefreshWeekly) {
        console.log("Serving from cache");
        return res.json(latestCache);
      }

      const pyTop = spawn("python3", ["scripts/top_redditor.py"]);
      let topOutput = "";

      pyTop.stdout.on("data", data => (topOutput += data.toString()));
      pyTop.stderr.on("data", err => console.error(err.toString()));

      pyTop.on("close", async () => {
        try {
          const newJSONTop = JSON.parse(topOutput);

          const hasChanged =
            !latestCache ||
            latestCache.upvotes !== newJSONTop.upvotes ||
            latestCache.posts !== newJSONTop.posts ||
            latestCache.comments !== newJSONTop.comments ||
            latestCache.weekly_posts !== newJSONTop.weekly_posts;

          if (hasChanged) {
            await ProjectModel.create({
              timestamp: now,
              ...newJSONTop
            });
          }

          return res.json(newJSONTop);

        } catch (err) {
          console.error("Error parsing top_redditor output:", err);
          return res.status(500).json({ error: "Failed to parse weekly post data" });
        }
      });

    } catch (err) {
      console.error("Background refresh failed:", err);
      return res.status(500).json({ error: "Refresh failed" });
    }
  });
});

app.get('/stats', async (req, res) => {
  const py = spawn("python3", ["scripts/get_stats.py"]);
  let output = "";

  py.stdout.on("data", data => output += data.toString());
  py.stderr.on("data", err => console.error("Python error:", err.toString()));

  py.on("close", () => {
    try {
      const json = JSON.parse(output);
      return res.json(json);
    } catch (err) {
      console.error("Bad Python output:", output, err);
      return res.status(500).json({ error: "Invalid Python response" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});