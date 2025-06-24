import prisma from "../config/prisma";

/*
 *    Creates a new stream for a user, returns stream object or null on error
 */
export const createStream = async (title: string, description: string | null, streamLink: string | null, streamerId: string) => {
  try {
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
    return stream;
  } catch (error) {
    console.error("Error creating stream:", error);
    return null;
  }
};

/*
 *    Updates a stream by id, returns updated stream object or null on error
 */
export const updateStream = async (streamId: string, updates: { title?: string; description?: string; streamLink?: string }) => {
  try {
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
    await prisma.stream.delete({
      where: { id: streamId },
    });
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
          select: {
            id: true,
            amount: true,
            createdAt: true,
            message: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
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
    return streams;
  } catch (error) {
    console.error("Error finding live streams:", error);
    return null;
  }
}; 