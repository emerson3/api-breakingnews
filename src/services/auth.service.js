import User from "../models/user.js";
import jwt from "jsonwebtoken";
const loginService = (username) => User.findOne({ username: username }).select("+password");

const generateToken = (id) => jwt.sign({ id: id }, process.env.SECRET_JWT, { expiresIn: 86400 })

export { loginService, generateToken };