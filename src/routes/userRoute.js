import express from 'express';
import { loginOrSignup, generateNewAccessTokenByRefreshToken } from '../controllers/userController.js';

const router = express.Router();

router.post("/login", loginOrSignup);
router.post("/refresh-accesstoken", generateNewAccessTokenByRefreshToken);

export default router;