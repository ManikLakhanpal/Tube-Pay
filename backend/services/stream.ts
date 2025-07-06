import prisma from "../config/prisma";
import { RedisService } from "./redis";

/*
 *    Creates a new stream for a user, returns stream object or null on error
 */
export const createStream = async (title: string, description: string | null, streamLink: string | null, streamerId: string) => {
  try {
    // * 1. Create the stream
    const stream = await prisma.stream.create({
      data: {
        title,
        description,
        streamLink,
        streamerId,
        isLive: true,
      },
      include: {
        streamer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // * 2. Invalidate the live streams cache
    await RedisService.invalidateLiveStreamsCache();

    // * 3. Cache the result
    if (stream) {
      await RedisService.cacheStreamDetails(stream.id, stream);
    }

    return stream;
  } catch (error) {
    console.error("Error creating stream:", error);
    return null;
  }
};

/*
 *    Updates a stream by id, returns updated stream object or null on error
 */
export const updateStream = async (streamId: string, updates: { title?: string; description?: string; streamLink?: string; isLive?: boolean }) => {
  try {
    // * 1. Update the stream
    const stream = await prisma.stream.update({
      where: { id: streamId },
      data: updates,
      include: {
        streamer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // * 2. Invalidate the stream cache
    await RedisService.invalidateStreamCache(streamId);

    // * 3. Cache the result
    if (stream) {
      await RedisService.cacheStreamDetails(stream.id, stream);
    }

    return stream;
  } catch (error) {
    console.error("Error updating stream:", error);
    return null;
  }
};

/*
 *    Deletes a stream by id, returns true on success or false on error
 */
export const deleteStream = async (streamId: string) => {
  try {
    // * 1. Delete the stream from the database
    await prisma.stream.delete({
      where: { id: streamId },
    });

    // * 2. Invalidate the stream cache
    await RedisService.invalidateStreamCache(streamId);

    return true;
  } catch (error) {
    console.error("Error deleting stream:", error);
    return false;
  }
};

/*
 *    Gets a stream by id, returns stream object or null if not found
 */
export const getStreamById = async (streamId: string) => {
  try {
    // * 1. Check if stream is cached
    const cachedStream = await RedisService.getCachedStreamDetails(streamId);

    if (cachedStream) {
      console.log(`✅ Stream ${streamId} data retrieved from cache`);
      return cachedStream;
    }

    // * 2. If not cached, get from database
    const stream = await prisma.stream.findUnique({
      where: { id: streamId },
      include: {
        streamer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        payments: {
          where: {
            status: "SUCCESS",
          },
          select: {
            id: true,
            amount: true,
            message: true,
            status: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          }
        },
      },
    });

    // * 3. Cache the result
    await RedisService.cacheStreamDetails(streamId, stream);

    return stream;
  } catch (error) {
    console.error("Error finding stream:", error);
    return null;
  }
};

/*
 *    Gets all streams for a specific streamer, returns array of streams or null on error
 */
export const getStreamsByStreamer = async (streamerId: string) => {
  try {
    const streams = await prisma.stream.findMany({
      where: { streamerId },
      include: {
        streamer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return streams;
  } catch (error) {
    console.error("Error finding streams by streamer:", error);
    return null;
  }
};

/*
 *    Gets all live streams, returns array of streams or null on error
 */
export const getLiveStreams = async () => {
  try {
    // * 1. Check is live streams are cached
    const cachedStreams = await RedisService.getCachedLiveStreams();

    if (cachedStreams) {
      console.log(`✅ Live streams data retrieved from cache`);
      return cachedStreams;
    }
    
    // * 2. If not cached, get from database
    const streams = await prisma.stream.findMany({
      where: { isLive: true },
      include: {
        streamer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // * 3. Cache the result
    await RedisService.cacheLiveStreams(streams);

    return streams;
  } catch (error) {
    console.error("Error finding live streams:", error);
    return null;
  }
}; 