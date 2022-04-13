const mongoose = require('mongoose')

const FeedingSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  ounces: {
    type: String,
    required: true
  },
  // totalFeeding: {
  //   type: String,
  //   required: true
  // },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Feeding', FeedingSchema)
