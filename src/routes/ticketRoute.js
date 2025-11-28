import express from 'express';
import { bookTicket, getUserTickets } from '../controllers/ticketController.js';
import { isAuthenticate } from '../middlewares/isAuthenticate.js';

const router = express.Router();

router.post("/bookticket", isAuthenticate, bookTicket);
router.get("/my-tickets", isAuthenticate, getUserTickets);

export default router;