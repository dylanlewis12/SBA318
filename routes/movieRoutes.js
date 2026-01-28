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
        myRating: null,
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

    let updatedMovie = db.find((movie) => movie.movieId == id);

    if(!updatedMovie) {
      return res.status(404).json({error: "Could not find movie!"});
    }

    try {
      //Check if the correct fields are being updated (watched or myRating)
      if(req.body.watched !== undefined) {
          updatedMovie.watched = req.body.watched;
      }

      if(req.body.myRating !== undefined) {
          updatedMovie.myRating = req.body.myRating;
      }


      res.json({ message: "Movie updated", updatedMovie });
    } catch(error) {
      res.status(500).json({ error: error.message }); 
    }

  })
  .delete((req, res) => {
    let movieId = req.params.id;

    let movieIndex = db.findIndex((movie) => movie.movieId == movieId);

    // -1 means movie does not exist in the watch list
    if (movieIndex == -1) {
      return res.status(404).json({error: "Movie not found!"});
    }

    let deletedMovie = db.splice(movieIndex, 1)[0];

    res.json({ message: "Movie deleted", deletedMovie });
  });

// Filter Route /api/watchlist/filter/:genre
router.route("/filter/:genre").get((req, res) => {
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
