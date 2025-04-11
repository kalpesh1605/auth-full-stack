import express from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../models/User.js'


const userRouter = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.sendStatus(403);
  }
};

userRouter.get("/", authMiddleware, async (req, res) => {
  const users = await userModel.find({}, { password: 0 });
  res.json(users);
});

export default userRouter;