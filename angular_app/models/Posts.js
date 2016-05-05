var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ upvotes: Number }]
});

// PostSchema.methods.upvote = function(cb) {
//   this.upvotes += 1;
//   this.save(cb);
// };

// mongoose.model('Post', PostSchema);
module.exports = mongoose.model('Post', PostSchema);