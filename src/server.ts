import express from "express";
import cors from "cors";

import usersRouter from "./apis/users/index";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHAndler,
  unauthorizedHandler,
  notFoundHandler,
} from "./errorHandlers";
import accomodationsRouter from "./apis/accomodations/index";

export const server = express();

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
