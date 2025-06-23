import { Router } from "express";
import { authenticate, streamerAuth } from "../middleware/authenticate";
import {
  createStreamHandler,
  updateStreamHandler,
  deleteStreamHandler,
  stopStreamHandler,
  getStreamByIdHandler,
  getMyStreamsHandler,
  getLiveStreamsHandler,
} from "../controller/stream";

const router = Router();

/*
 *    Creates a new stream
 *    POST /api/streams
 *    Body: { title: string, description?: string, streamLink?: string }
 */
router.post("/", streamerAuth, createStreamHandler);

/*
 *    Gets all live streams (public)
 *    GET /api/streams/live
 */
router.get("/live", getLiveStreamsHandler);

/*
 *    Gets all streams for the authenticated user
 *    GET /api/streams/my-streams
 */
router.get("/my-streams", authenticate, getMyStreamsHandler);

/*
 *    Gets a specific stream by id (public)
 *    GET /api/streams/:id
 */
router.get("/:id", getStreamByIdHandler);

/*
 *    Updates a stream (title, description, streamLink)
 *    PATCH /api/streams/:id
 *    Body: { title?: string, description?: string, streamLink?: string }
 */
router.patch("/:id", streamerAuth, updateStreamHandler);

/*
 *    Stops a stream (sets isLive to false)
 *    PATCH /api/streams/:id/stop
 */
router.patch("/:id/stop", streamerAuth, stopStreamHandler);

/*
 *    Deletes a stream
 *    DELETE /api/streams/:id
 */
router.delete("/:id", streamerAuth, deleteStreamHandler);

export default router;
