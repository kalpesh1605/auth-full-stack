import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  authType: { type: String, enum: ["email", "google"], default:"email" }
});

const userModel = mongoose.model("User", userSchema);

export default userModel