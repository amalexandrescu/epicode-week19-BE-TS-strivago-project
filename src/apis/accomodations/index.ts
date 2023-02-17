import express from "express";
import createHttpError from "http-errors";
import hostOnlyMiddleware from "../../library/authentication/hostOnly";
import {
  JWTAuthMiddleware,
  UserRequest,
} from "../../library/authentication/jwtAuth";
import AccomodationsModel from "./model";
const accomodationsRouter = express.Router();

//just hosts can create a new accommodation
//you don't provide the host id in the body, but it will be created with the info from the token
//in the req.user we will find the data of the current user of the token
//the data is coming from performing the JWTAuthMiddleware
//the order of the middlewares matters!!! first the JWTAuthMiddleware to verify if you
//are authorized to do a certain action and then the hostOnlyMiddleware (which checks if you are a host)
accomodationsRouter.post(
  "/",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const newAccomodation = new AccomodationsModel({
        ...req.body,
        host: req.user!._id,
      });
      const { _id } = await newAccomodation.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

//gets all the accommodations if you provide a valid token in the authorization headers
//hosts and guests endpoint
accomodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accomodations = await AccomodationsModel.find().populate({
      path: "host",
    });
    res.send(accomodations);
  } catch (error) {
    next(error);
  }
});

//gets a certain accommodation if you provide a valid token in the authorization headers
//hosts and guests endpoint
accomodationsRouter.get(
  "/:accomodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(
        req.params.accomodationId
      ).populate({
        path: "host",
      });
      if (accomodation) {
        res.send(accomodation);
      } else {
        next(
          createHttpError(404, "No accomodations with the provided id found")
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//hosts only endpoint
//edits an accommodation
//JWTAuthMiddleware is checking if you are authorized to edit the accommodation (if you are the owner of it)
accomodationsRouter.put(
  "/:accomodationId",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(
        req.params.accomodationId
      );
      if (accomodation) {
        //the req.user is updated by the JWTAuthMiddleware
        //we use the verifyAccessToken function which resolves the promise
        //(and returns the payload: with _id and the role)
        //and if it rejects the promise, it return an error
        if (accomodation.host.toString() === req.user!._id.toString()) {
          const updatedAccomodation =
            await AccomodationsModel.findByIdAndUpdate(
              req.params.accomodationId,
              req.body,
              { new: true, runValidators: true }
            );
          res.status(204).send(updatedAccomodation);
        } else {
          next(createHttpError(403, "The accomodation is not yours to update"));
        }
      } else {
        next(
          createHttpError(404, `Accomodation with the provided id not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//deletes an accommodation
//host only endpoint
//you have to be the owner of the accommodation in order to delete it
accomodationsRouter.delete(
  "/:accomodationId",
  JWTAuthMiddleware,
  hostOnlyMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const accomodation = await AccomodationsModel.findById(
        req.params.accomodationId
      );
      if (accomodation) {
        //the req.user is updated by the JWTAuthMiddleware
        //we use the verifyAccessToken function which resolves the promise
        //(and returns the payload: with _id and the role)
        //and if it rejects the promise, it return an error
        if (accomodation.host.toString() === req.user!._id.toString()) {
          const deletedAccomodation =
            await AccomodationsModel.findByIdAndDelete(
              req.params.accomodationId
            );
          res.status(204).send();
        } else {
          next(createHttpError(403, "The accomodation is not yours to delete"));
        }
      } else {
        next(
          createHttpError(
            404,
            `Accomodation with id ${req.params.accomodationId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default accomodationsRouter;
