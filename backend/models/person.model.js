const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
  },
  nickName: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    minlength: 3,
  },
  age: {
    type: Number,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  friends: [{ type: String }],
  friendRequests: [{ type: String }],
}, {
  timestamps: true,
});

const Person = mongoose.model('persons', personSchema);
module.exports = Person;

