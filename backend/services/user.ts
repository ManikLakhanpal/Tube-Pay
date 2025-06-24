import prisma from "../config/prisma";

const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  avatarUrl: true,
  streams: {
    select: {
      id: true,
      title: true,
      description: true,
      isLive: true,
      streamLink: true,
      streamerId: true,
      createdAt: true,
    },
  },
};

/*
 *    Takes email or id and returns user if exists, null if not found
 *    Uses findUnique for id, findUnique for email
 */
export const findUser = async (email?: string, id?: string) => {
  try {
    if (id) {
      return await prisma.user.findUnique({
        where: { id },
        select: userSelectFields,
      });
    }
    if (email) {
      return await prisma.user.findUnique({
        where: { email },
        select: userSelectFields,
      });
    }
    return null;
  } catch (error) {
    console.error(`Error finding user`);
    return null;
  }
};

/*
 *    Creates new user with name and email, returns user object or null on error
 *    Uses Prisma create operation with default USER role
 */
export const createUser = async (name: string, email: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
      select: userSelectFields,
    });
    
    return user;
  } catch (error) {
    console.error(`Error creating user`);
    return null;
  }
};

/*
 *    Updates user profile with name, returns user object or null on error
 *    Updates user profile with name, returns user object or null on error
 */
const ALLOWED_ROLES = ["USER", "STREAMER"] as const;
type Role = typeof ALLOWED_ROLES[number];

export const updateUserProfile = async (
  name: string | undefined,
  uid: string,
  avatarUrl?: string,
  role?: Role
) => {
  try {
    const data: Partial<{
      name: string;
      avatarUrl: string;
      role: Role;
    }> = {};

    if (name !== undefined) data.name = name;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

    if (role !== undefined) {
      if (!ALLOWED_ROLES.includes(role)) {
        throw new Error(`Role '${role}' is not allowed`);
      }
      data.role = role;
    }

    const user = await prisma.user.update({
      where: { id: uid },
      data,
    });

    return user;
  } catch (error: any) {
    console.error(`Error updating user profile: ${error.message}`, error);
    throw error; // rethrow for upstream handling
  }
};

