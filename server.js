import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
console.log(">>> SERVER LOADED");
console.log("Current file:", import.meta.url);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug middleware – loggar ALLA requests
app.use((req, res, next) => {
  console.log("MOTTAGEN:", req.method, req.url);
  next();
});

// TEST-route
app.get("/", (req, res) => {
  res.json({ message: "Servern är igång!" });
});

// USERS
app.post("/users", async (req, res) => {
  console.log("POST /users KÖRS!");
  console.log("Body:", req.body);
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  console.log("GET /users KÖRS!");
  const all = await User.find();
  res.json(all);
});

// CONNECT MONGO
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Ansluten till databasen"))
  .catch((err) => console.error(err));

// LISTEN LAST
app.listen(3000, () => {
  console.log("Server på http://localhost:3000");
});
