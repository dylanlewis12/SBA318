import express from "express";
import db from "../database/database.js";

const router = express.Router();

// Array to store watchlist
//let watchlist = [];

router
  .route("/")
  // Create
  .post((req, res) => {
    const { movieId, movieName, rating, genres, image } = req.body;

    //Error handling - checking if movie is already on watch list
    const isAdded = db.find(m => m.movieId => movieId);

    if(isAdded) {
      res.status(400).json({error: "Movie already added to watchlist"});
    }

    // Error handling

    try {

      let newMovie = {
        movieId,
        movieName,
        rating,
        genres,
        image,
        watched: false,
        addedDate: new Date(),
      }

      db.push(newMovie);
      res.redirect("/home");
    } catch(error) {
      
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
    let id = req.params.id;

    let deletedTodo = db.find((todo, i) => {
      if (todo.id == id) {
        return db.splice(i, 1);
      }
    });

    if (deletedTodo) {
      res.json({ deletedTodo });
    } else {
      res.status(400).json({ error: "Could not find todo!" });
    }
  });

// Filter Route /api/todos/:cat/category
router.route("/:cat/category").get((req, res) => {
  let category = req.params.cat;

  // Returns an array of all elements that match a condition
  let filteredData = db.filter((todo) => todo.category == category);

  res.json({ filteredData });
});

router.rout

export default router;
