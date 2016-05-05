var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  post: { type: Number}
});

//mongoose.model('Comment', CommentSchema);
module.exports = mongoose.model('Comment', CommentSchema);