const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: { type: String, required: true },
  confirmationCode: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    default: 'Pending Confirmation',
    enum: ['Pending Confirmation','Active']
  },
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;