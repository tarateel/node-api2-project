// library
const express = require('express');

// router
const PostsRouter = require('./routers/PostsRouter');
const CommentsRouter = require('./routers/CommentsRouter');

// global object
const server = express();

// middleware / routing system
server.use(express.json());
server.use('/api/posts', PostsRouter);
server.use('api/posts/:id/comments', CommentsRouter)

// define the route for all posts
server.get('/api/posts', (req, res) => {
  res.send(`
  <h2>LOTR Quotes</h2>`)
});

module.exports = server;
