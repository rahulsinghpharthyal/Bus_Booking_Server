import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";

// --------- Imoprt Routes ---------
import userRoutes from './routes/userRoute.js';
import busRoutes from './routes/busRoute.js';
import ticketRoutes from './routes/ticketRoute.js';
import { buildAdminJS } from "./config/setupAdmin.js";



const app = express();

// Use AdminJS setup
await buildAdminJS(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders:['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());


/* <---------------------------------- All routes -------------------------------------> */
// app.use("/api", routes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/bus", busRoutes);
app.use("/api/v1/ticket", ticketRoutes);


// <--- global error handler middleware --->
app.use(errorHandler);

export default app;

