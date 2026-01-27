// Imports
import express from "express";
import todoRoutes from "./routes/todoRoutes.js";
import { logReq, globalErr } from "./middleware/middlewares.js";
import db from "./database/database.js";
import fs from "fs";

// Setups
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parses the req body so we can use it
app.use(logReq);

// Customer View Engine
app.engine("html", function (filePath, options, cb) {
  fs.readFile(filePath, (err, content) => {
    if (err) return cb(err);

    let list = "";

    for (let todo of db) {
      list += `<li>${todo.todo}</li>`;
    }

    let rendered = content.toString().replace("#list#", list);

    return cb(null, rendered);
  });
});

// Set it into express
app.set("views", "./views");
app.set("view engine", "html");
app.use(express.static("./styles"));

// Routes
app.get("/home", (req, res) => {
  res.render("index");
});

app.use("/api/todos", todoRoutes);

// Global Err handling middleware
app.use(globalErr);

// Listener
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
