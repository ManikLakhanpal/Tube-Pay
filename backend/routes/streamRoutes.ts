import { Router } from "express";
import { authenticate, streamerAuth } from "../middleware/authenticate";
import {
  createStreamHandler,
  updateStreamHandler,
  deleteStreamHandler,
  getStreamByIdHandler,
  getLiveStreamsHandler,
} from "../controller/stream";

const router = Router();

/*
 *    Creates a new stream
 *    POST /api/streams
 *    Body: { title: string, description?: string, streamLink?: string }
 *    Returns: stream object or null on error
 */

// TODO: When I create a stream I want to create a QR Code
router.post("/", streamerAuth, createStreamHandler);

/*
 *    Gets all live streams (public)
 *    GET /api/streams/live
 *    Returns: array of stream objects or null on error
 */
router.get("/live", getLiveStreamsHandler);

/*
 *    Gets all streams for the authenticated user
 *    GET /api/streams/my-streams
 *    Returns: array of stream objects or null on error
 */
// router.get("/my-streams", authenticate, getMyStreamsHandler);

/*
 *    Gets a specific stream by id (public)
 *    GET /api/streams/:id
 *    Params: id - stream id
 *    Returns: stream object or null on error
 */
router.get("/:id", getStreamByIdHandler);

/*
 *    Updates a stream (title, description, streamLink)
 *    PATCH /api/streams/:id
 *    Body: { title?: string, description?: string, streamLink?: string, isLive: 'true' | 'false' }
 *    Returns: stream object or null on error
 */
router.patch("/:id", streamerAuth, updateStreamHandler);

/*
 *    Deletes a stream
 *    DELETE /api/streams/:id
 *    Params: id - stream id
 *    Returns: stream object or null on error
 */
router.delete("/:id", streamerAuth, deleteStreamHandler);

export default router;