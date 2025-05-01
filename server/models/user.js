import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  country: {
    type: String,
    required: true,
  }
},
{
  timestamps: true
});

export const UserDb = mongoose.model('User', userSchema);
export default UserDb;