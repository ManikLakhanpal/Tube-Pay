import prisma from "../config/prisma";

/* 
 *    Takes email or id and returns user if exists, null if not found
 *    Uses findUnique for id, findUnique for email
*/
export const findUser = async (email?: string, id?: string) => {
    try {
        if (id) {
            return await prisma.user.findUnique({
                where: { id },
            });
        }
        if (email) {
            return await prisma.user.findUnique({
                where: { email },
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
        });
        return user;
    } catch (error) {
        console.error(`Error creating user`);
        return null;
    }
};
