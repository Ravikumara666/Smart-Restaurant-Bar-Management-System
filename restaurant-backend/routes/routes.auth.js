import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';



const AuthRouter = express.Router();

// Sample route for user registration
AuthRouter.post('/register', registerUser);
// Sample route for user login
AuthRouter.post('/login', loginUser);

export default AuthRouter;