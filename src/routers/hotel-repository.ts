import { getHotel, getHotelRooms } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter.all("/*", authenticateToken).get("", getHotel).get("/:hotelId", getHotelRooms);

export { hotelsRouter };
