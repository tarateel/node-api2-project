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

// fetch all posts
router.get('/', (req, res) => {
  // request an array of all posts in the db
  posts.find()
  .then(posts => {
    // respond with an array of posts
    res.json(posts)
  })
  // if there is an error in fetching
  .catch(err => {
    // cancel, respond with 'server error' status code and a JSON message
    return res.status(500).json({
      error: "The posts information could not be retrieved."
    })
  });
});

// fetch a specified post findById()
router.get('/:id', (req, res) => {
  // request a post by id parameter
  const { id } = req.params;
  // if post id is not found
  if (!id) { 
    // cancel, respond with 'not found' status code and a JSON message
    return res.status(404).json({
      message: "The post with the specified ID does not exist."
    })    
      // otherwise
    } else {
      posts.findById(id)
      .then(post => {
        // respond with 'OK' status code and a JSON message
        res.status(200).json(post)
      })
      // if there is an error fetching the post
      .catch(err => {
        // respond with 'server error' status code and a JSON message
        return res.status(500).json({
          error: "The post information could not be retrieved."
        })
      });
    };
});

// add a post
router.post('/', (req, res) => {
  const { title, contents } = req.body;

  if (!title || !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    })
  } else {
    posts.insert(req.body)
    .then(post => {
      res.status(201).json(req.body)
    })
    .catch(err => {
      return res.status(500).json({
        error: "There was an error while saving the post to the database"
      })
    })
  };
});

router.delete('/:id', (req, res) => {
  const id = req.params.id
  
  posts.remove(id)
  .then(postToDelete => {
    if (postToDelete) {
      res.json(postToDelete)
    } else {
      return res.status(404).json({
        message: "The post with the specified ID does not exist."
      })
    }
  })
  .catch(err => {
    return res.status(500).json({
      error: "The post could not be removed"
    })
  });
});




module.exports = router;