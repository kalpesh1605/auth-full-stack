import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'

dotenv.config() 
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected"); 
    app.listen(5000, () => console.log("Server running on port 5000"))})
  .catch(err => console.log(err));
