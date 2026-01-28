import express from "express";
import db from "../database/database.js";

const router = express.Router();

router
  .route("/")
  // Create
  .post((req, res) => {
    const { movieId, movieName, rating, genres, image } = req.body;
    
    // Error handling - checking if movie is already on watchlist
    const isAdded = db.find(m => m.movieId === movieId);  
    
    if(isAdded) {
      return res.status(400).json({error: "Movie already added to watchlist"});  
    }
    
   
    try {
      let newMovie = {
        movieId,
        movieName,
        rating,
        genres,
        image,
        watched: false,
        addedDate: new Date(),
      };
      db.push(newMovie);
      res.status(201).json({ message: "Added to watchlist!", movie: newMovie });  
    } catch(error) {
      res.status(500).json({ error: error.message });  
    }
  })
  // Read
  .get((req, res) => {
    res.json(db);
  });

router
  .route("/:id")
  .put((req, res) => {
    let id = req.params.id;

    let watchlist = db.find((item) => {
      if (item.id == id) {
        for (let key in req.body) {
          todo[key] = req.body[key];
        }
        return true;
      }
    });

    if (updatedTodo) {
      res.json({ updatedTodo });
    } else {
      res.status(400).json({ error: "Could not find todo!" });
    }
  })
  .delete((req, res) => {
    let movieId = req.params.movieId;

    let movieIndex = db.findIndex((movie) => movie.movieId == movieId);

    // -1 means movie does not exist in the watch list
    if (movieIndex == -1) {
      res.status(404).json({error: "Movie not found!"});
    }

    let deletedMovie = db.splice(movieIndex, 1)[0];

    res.json({ message: "Movie deleted", deletedMovie });
  });

// Filter Route /api/watchlist/:genre/category

router.route("/:genre").get((req, res) => {
  let genre = req.params.genre;

  if (!genre) {
    return res.status(400).json({ error: "Genre parameter required" });
  }

  // Returns an array of all elements that match a condition
  // Use .includes to check values of genres array
  let filteredData = db.filter((movie) => movie.genres.includes(genre));
  res.json({ filteredData });
});


export default router;
