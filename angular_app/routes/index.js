var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var mongoose = require('mongoose');


//var Post = mongoose.model('Post');
//var Comment = mongoose.model('Comment');
var Post = require('./../models/Posts');
var Comment = require('./../models/Comments');

router.get('/posts', function(req, res, next) {
	// var posts = [
	//   {title: 'post 1', upvotes: 5},
	//   {title: 'post 2', upvotes: 2},
	//   {title: 'post 3', upvotes: 15},
	//   {title: 'post 4', upvotes: 9},
	//   {title: 'post 5', upvotes: 4}
	// ];
	// res.json(posts);
  Post.find(function(err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});


router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});


//getting the sible post from db and attaching to req object with following middleware
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

//getting single post
//Use the populate() function to retrieve comments along with posts:
router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});


router.post('/posts/:post/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});






module.exports = router;
