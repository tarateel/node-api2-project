// library
const express = require('express');

// database file
const commentsRouter = require('./CommentsRouter');
const posts = require('../data/db.js');


// router handler
const router = express.Router();

// nested router
router.use('/:id/comments', commentsRouter)

// add a new post
router.post('/', (req, res) => {
  // define title and contents as request body
  const { title, contents } = req.body;
  // if either title or contents are missing
  if (!title || !contents) {
    // cancel, respond with 'bad request' status code and JSON message
    return res.status(400).json({
      errorMessage: "Please provide both title and contents for the post."
    })
    // otherwise
  } else {
    // add the new post to the db
    posts.insert(req.body)
    .then(post => {
      // and respond with 'created' status code and the newly-created post
      res.status(201).json(post)
    })
    // if there is an error
    .catch(err => {
      // cancel, respond with 'server error' status code and a JSON message
      return res.status(500).json({
        error: "There was an error while saving the post to the database"
      })
    })
  }
});



module.exports = router;