import { createUser, findUser } from "../services/user";

const loginUser = async (req: any, res: any) => {
  if (!req.user || req.user == null) {
    return res.status(404).json('Login First');
  }

  try {
    const name = req.user.displayName;
    const email = req.user.emails[0].value;

    // * Step 1: Search for the user by email
    let user = await findUser(email);

    // * Step 2: If user doesn't exist, create it
    if (user == null) {
      user = await createUser(name, email);
    }

    // * Step 3: Return the user
    return user;

  } catch (error) {
    console.error("Error logging in user:", error);
    
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default loginUser;