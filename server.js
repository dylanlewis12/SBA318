import express from "express";
import movieRoutes from "./routes/movieRoutes.js";
import { logReq, globalErr } from "./middleware/middlewares.js";
import fs from "fs";
import db from "./database/database.js";  

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logReq);

// Custom View Engine
app.engine("html", function (filePath, options, cb) {
    fs.readFile(filePath, (err, content) => {
        if (err) return cb(err);
        let rendered = content.toString();
        
        // Replace watchlist data
        if (options.watchlist) {
            let watchlistHTML = "";
            for (let movie of options.watchlist) {
                watchlistHTML += `
                    <div class="watchlist-item">
                        <img src="${movie.image}" alt="${movie.movieName}">
                        <div class="item-details">
                            <h3>${movie.movieName}</h3>
                            <p>Rating: ${movie.rating}/10</p>
                            <p>My Rating: <input type="number" min="0" max="10" value="${movie.myRating || ''}" 
                               data-movie-id="${movie.movieId}" class="rating-input"></p>
                            <label>
                                <input type="checkbox" ${movie.watched ? 'checked' : ''} 
                                data-movie-id="${movie.movieId}" class="watched-checkbox">
                                Watched
                            </label>
                            <button class="delete-btn" data-movie-id="${movie.movieId}">Remove</button>
                        </div>
                    </div>
                `;
            }
            rendered = rendered.replace("#watchlist#", watchlistHTML);
        }
        return cb(null, rendered);
    });
});

// Set view engine
app.set("views", "./public/views");
app.set("view engine", "html");

// Serve static files
app.use(express.static("./public"));

// ===== ROUTES =====

// GET / - Serve the home/index page
app.get("/", (req, res) => {
    res.sendFile(new URL("./public/views/index.html", import.meta.url).pathname);
});

// GET /catalog - Serve the catalog/movies page
app.get("/catalog", (req, res) => {
    res.sendFile(new URL("./public/views/catalog.html", import.meta.url).pathname);
});

// GET /watchlist - Render the watchlist page with server-side template engine
// Passes the database array to the view engine to display movies
app.get("/watchlist", (req, res) => {
    res.render("watchlist", { watchlist: db });
});

// GET /about - Render the about page
app.get("/about", (req, res) => {
    res.render("about");
});

// ===== API ROUTES =====

// Use the watchlist API routes with /api/watchlist prefix
app.use("/api/watchlist", movieRoutes);

// Global error handling middleware
app.use(globalErr);

// Start the server and listen on the specified PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
});