import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import http from "http";

// --------- Imoprt Routes ---------
import userRoutes from './routes/userRoute.js';
import busRoutes from './routes/busRoute.js';
import ticketRoutes from './routes/ticketRoute.js';
import paymentRoutes from './routes/paymentRoute.js';
import webhookRoutes from './routes/webhookRoute.js';
import { buildAdminJS } from "./config/setupAdmin.js";
import { initSocket } from "./utils/socket.js";



const app = express();
const server = http.createServer(app);

// Use AdminJS setup
await buildAdminJS(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders:['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

//Razorpay web hooks:-
app.use("/api/webhooks", webhookRoutes);

// Middleware to parse JSON request bodies
app.use(express.json());


/* <---------------------------------- All routes -------------------------------------> */
// app.use("/api", routes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/payment", paymentRoutes);



// init socket.io and make it available
initSocket(server);
// <--- global error handler middleware --->
app.use(errorHandler);

export default app;

