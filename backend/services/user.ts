import prisma from "../config/prisma";
import { RedisService } from "./redis";

// TODO: Add payment selection to true if
// TODO: the user is getting data for theirself
const userSelectFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  avatarUrl: true,
  streams: {
    orderBy: {
      createdAt: "desc" as const,
    },
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
      // * 1. Check if user is cached
      const cachedUser = await RedisService.getCachedUserProfile(id);

      if (cachedUser) {
        console.log(`✅ User ${id} data retrieved from cache`);
        return cachedUser;
      }

      // * 2. If not cached, get from database
      const user = await prisma.user.findUnique({
        where: { id },
        select: userSelectFields,
      });

      // * 3. Cache the result
      if (user) {
        await RedisService.cacheUserProfile(user.id, user);
        console.log(`✅ User ${user.id} cached`);
      }

      return user;
    }
    if (email) {
      // * 1. Check if user is cached
      const cachedUser = await RedisService.getCachedUserProfile(email);

      if (cachedUser) {
        console.log(`✅ User ${email} data retrieved from cache`);
        return cachedUser;
      }

      // * 2. If not cached, get from database
      const user = await prisma.user.findUnique({
        where: { email },
        select: userSelectFields,
      });

      // * 3. Cache the result
      if (user) {
        await RedisService.cacheUserProfile(user.id, user);
        console.log(`✅ User ${user.id} cached`);
      }

      return user;
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
    // * 1. Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
      select: userSelectFields,
    });

    // * 2. Cache the result
    if (user) {
      await RedisService.cacheUserProfile(user.id, user);
    }

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
type Role = (typeof ALLOWED_ROLES)[number];

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

    // * 1. Update the user
    const user = await prisma.user.update({
      where: { id: uid },
      data,
    });

    // * 2. Invalidate user profile cache
    await RedisService.invalidateUserProfileCache(uid);
    await RedisService.invalidateUserProfileCache(user.email);

    // * 3. Cache the result
    if (user) {
      await RedisService.cacheUserProfile(user.id, user);
    }

    return user;
  } catch (error: any) {
    console.error(`Error updating user profile: ${error.message}`, error);
    throw error; // rethrow for upstream handling
  }
};
