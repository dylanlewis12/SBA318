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

// Custom View Engine for watchlist.html
// Custom View Engine
app.engine("html", function (filePath, options, cb) {
    fs.readFile(filePath, (err, content) => {
        if (err) return cb(err);
        let rendered = content.toString();
        
        // Genre colors
        const genreColors = {
            'Drama': '#E74C3C',
            'Action': '#C0392B',
            'Comedy': '#F39C12',
            'Thriller': '#2C3E50',
            'Horror': '#8B008B',
            'Romance': '#E91E63',
            'Sci-Fi': '#3498DB',
            'Fantasy': '#9B59B6',
            'Adventure': '#27AE60',
            'Mystery': '#34495E',
            'Crime': '#95A5A6',
            'Animation': '#1ABC9C',
            'Documentary': '#7F8C8D',
            'Family': '#F1C40F',
            'History': '#D35400'
        };
        
        // Replace watchlist data
        if (options.watchlist) {
            let watchlistHTML = "";
            for (let movie of options.watchlist) {
                // Create genre HTML
                const genreHTML = (movie.genres || []).map(genre => {
                    const color = genreColors[genre] || '#95A5A6';
                    return `<span class="genre-tag" style="background-color: ${color};">${genre}</span>`;
                }).join('');
                
                watchlistHTML += `
                  <div class="card">
                      <div class="card-image">
                          <img src="${movie.image}" alt="${movie.movieName}">
                      </div>
                      <div class="card-body">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                              <p id="movieName"><strong>${movie.movieName}</strong></p>
                              <label>
                                  <input type="checkbox" ${movie.watched ? 'checked' : ''} 
                                  data-movie-id="${movie.movieId}" class="watched-checkbox">
                                  Watched
                              </label>
                          </div>
                          <div id="movieGenre" class="genres-container">${genreHTML}</div>
                      </div>
                      <div class="card-summary">
                          <p>My Rating:</p>
                          <div class="star-rating" data-movie-id="${movie.movieId}">
                              <span class="star" data-value="1">★</span>
                              <span class="star" data-value="2">★</span>
                              <span class="star" data-value="3">★</span>
                              <span class="star" data-value="4">★</span>
                              <span class="star" data-value="5">★</span>
                              <span class="star" data-value="6">★</span>
                              <span class="star" data-value="7">★</span>
                              <span class="star" data-value="8">★</span>
                              <span class="star" data-value="9">★</span>
                              <span class="star" data-value="10">★</span>
                          </div>
                          <span class="rating-display">${movie.myRating || 'Not rated'}</span>
                      </div>
                      <button class="delete-btn" data-movie-id="${movie.movieId}">Remove</button>
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