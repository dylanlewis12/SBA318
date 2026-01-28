import express from "express";
import db from "../database/database.js";

const router = express.Router();

router
  .route("/")
  // Create
  .post((req, res) => {
    let { category, todo } = req.body;

    // Error handling
    if (category && todo) {
      let id;

      if (db.length == 0) {
        // If db is empty
        id = 1;
      } else {
        id = db[db.length - 1].id + 1;
      }

      let newTodo = {
        id: id,
        category,
        todo,
      };

      db.push(newTodo);
      res.redirect("/home");
    } else {
      res.status(400).json({ error: "Insufficient Data" });
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

    let updatedTodo = db.find((todo) => {
      if (todo.id == id) {
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

export default router;
