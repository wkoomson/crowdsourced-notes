var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	id: String,
	name: String,
	token: String,
	email: String,
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
	classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classes'}],
	created_at: Date
});

mongoose.model('User', UserSchema);