import { 
  createStream, 
  updateStream, 
  deleteStream, 
  stopStream, 
  getStreamById, 
  getStreamsByStreamer, 
  getLiveStreams 
} from "../services/stream";
import { reqUser } from "../types";

/*
 *    Creates a new stream, returns stream object or error
 */
export const createStreamHandler = async (req: reqUser, res: any) => {
  try {
    const { title, description, streamLink } = req.body;
    const streamerId = req.user.uid;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const stream = await createStream(title, description || null, streamLink || null, streamerId);

    if (!stream) {
      return res.status(500).json({ error: "Failed to create stream" });
    }

    return res.status(201).json(stream);
  } catch (error) {
    console.error("Error in createStreamHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Updates a stream by id, returns updated stream object or error
 */
export const updateStreamHandler = async (req: reqUser, res: any) => {
  try {
    const { id } = req.params;
    const { title, description, streamLink } = req.body;
    const streamerId = req.user.uid;

    // First check if stream exists and belongs to the user
    const existingStream = await getStreamById(id);
    if (!existingStream) {
      return res.status(404).json({ error: "Stream not found" });
    }

    if (existingStream.streamerId !== streamerId) {
      return res.status(403).json({ error: "You can only update your own streams" });
    }

    const updates: { title?: string; description?: string; streamLink?: string } = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (streamLink !== undefined) updates.streamLink = streamLink;

    const stream = await updateStream(id, updates);

    if (!stream) {
      return res.status(500).json({ error: "Failed to update stream" });
    }

    return res.status(200).json(stream);
  } catch (error) {
    console.error("Error in updateStreamHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Deletes a stream by id, returns success message or error
 */
export const deleteStreamHandler = async (req: reqUser, res: any) => {
  try {
    const { id } = req.params;
    const streamerId = req.user.uid;

    // First check if stream exists and belongs to the user
    const existingStream = await getStreamById(id);
    if (!existingStream) {
      return res.status(404).json({ error: "Stream not found" });
    }

    if (existingStream.streamerId !== streamerId) {
      return res.status(403).json({ error: "You can only delete your own streams" });
    }

    const success = await deleteStream(id);

    if (!success) {
      return res.status(500).json({ error: "Failed to delete stream" });
    }

    return res.status(200).json({ message: "Stream deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStreamHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Stops a stream by setting isLive to false, returns updated stream or error
 */
export const stopStreamHandler = async (req: reqUser, res: any) => {
  try {
    const { id } = req.params;
    const streamerId = req.user.uid;

    // First check if stream exists and belongs to the user
    const existingStream = await getStreamById(id);
    if (!existingStream) {
      return res.status(404).json({ error: "Stream not found" });
    }

    if (existingStream.streamerId !== streamerId) {
      return res.status(403).json({ error: "You can only stop your own streams" });
    }

    const stream = await stopStream(id);

    if (!stream) {
      return res.status(500).json({ error: "Failed to stop stream" });
    }

    return res.status(200).json(stream);
  } catch (error) {
    console.error("Error in stopStreamHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Gets a stream by id, returns stream object or error
 */
export const getStreamByIdHandler = async (req: reqUser, res: any) => {
  try {
    const { id } = req.params;

    const stream = await getStreamById(id);

    if (!stream) {
      return res.status(404).json({ error: "Stream not found" });
    }

    return res.status(200).json(stream);
  } catch (error) {
    console.error("Error in getStreamByIdHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Gets all streams for the authenticated user, returns array of streams or error
 */
export const getMyStreamsHandler = async (req: reqUser, res: any) => {
  try {
    const streamerId = req.user.uid;

    const streams = await getStreamsByStreamer(streamerId);

    if (streams === null) {
      return res.status(500).json({ error: "Failed to fetch streams" });
    }

    return res.status(200).json(streams);
  } catch (error) {
    console.error("Error in getMyStreamsHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Gets all live streams, returns array of streams or error
 */
export const getLiveStreamsHandler = async (req: reqUser, res: any) => {
  try {
    const streams = await getLiveStreams();

    if (streams === null) {
      return res.status(500).json({ error: "Failed to fetch live streams" });
    }

    return res.status(200).json(streams);
  } catch (error) {
    console.error("Error in getLiveStreamsHandler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}; 