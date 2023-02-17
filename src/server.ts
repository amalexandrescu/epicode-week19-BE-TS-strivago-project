import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./apis/users/index";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHAndler,
  unauthorizedHandler,
  notFoundHandler,
} from "./errorHandlers";
import listEndpoints from "express-list-endpoints";
import accomodationsRouter from "./apis/accomodations/index";

const server = express();

const port = process.env.PORT || 3001;

//MIDDLEWARES

server.use(cors());
server.use(express.json());

//ENDPOINTS

server.use("/users", usersRouter);
server.use("/accomodations", accomodationsRouter);

//ERROR HANDLERS
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHAndler);

mongoose.connect(process.env.MONGO_URL!);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port: ${port}`);
  });
});
