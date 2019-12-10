// library
const express = require('express');

// database file
const posts = require('../data/db.js');

// router handler
const router = express.Router({
  // pull in the post ID from the parent router's parameters
  mergeParams: true
});

// fetch all comments on a specific post
router.get('/', (req, res) => {
  posts.findPostComments(req.params.id)
  .then(comments => {
    if (comments) {
      res.status(200).json(comments)
    } else {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      error: "The post information could not be retrieved."
    })
  })
});

// fetch a specific comment
router.get('/:commentId', (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      message: "The post with the specified ID does not exist."
    })
  } else {
    posts.findCommentById(req.params.id, req.params.commentId)
    .then(comment => {
      res.status(200).json(comment)
    })
    .catch(err => {
      return res.status(500).json({
        error: "The comments information could not be retrieved."
      })
    })
  }
});

// add a comment to a specific post
router.post('', (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({
      message: "The post with the specified ID does not exist."
    })
  } else if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment."
    })
  } else {
    const payload = {
      text: req.body.text
    }
    posts.insertComment(req.params.id, payload)
    .then(comment => {
      res.status(201).json(comment)
    })
    .catch(err => {
      // cancel, return 'server error' status code and a JSON message
      return res.status(500).json({
        error: "There was an error while saving the comment to the database"
      })
    });
  }
});

module.exports = router;