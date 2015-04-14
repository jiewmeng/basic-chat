var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

/*********************************
 * User
 ********************************/
var UserSchema = new Schema({
	name: String,

	facebookId: {
		type: String,
		index: {
			unique: true,
			dropDups: true
		}
	},

	facebookAccessToken: String
});

var User = mongoose.model('User', UserSchema);


/*********************************
 * Chatroom
 ********************************/
var ChatroomSchema = new Schema({
	users: [{type: ObjectId, ref: 'User'}]
});

var Chatroom = mongoose.model('Chatroom', ChatroomSchema);


/*********************************
 * Exports
 ********************************/
module.exports = {
	User: User,
	Chatroom: Chatroom
}
