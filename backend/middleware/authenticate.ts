import prisma from "../config/prisma";

const authenticate = async (req: any, res: any, next: any) => {
    const { uid } = req.user;

    if (!uid) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
        where: { id: uid },
    });
    
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
}

export default authenticate;