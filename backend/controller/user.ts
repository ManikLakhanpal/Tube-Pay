import { createUser, findUser, updateUserProfile } from "../services/user";
import { reqUser } from "../types";

/*
 *    Logs in user, returns user object or null on error
 */
export const loginUser = async (req: reqUser, res: any) => {
  if (!req.user || req.user == null) {
    return res.status(404).json('Login First');
  }

  try {
    const name = req.user.displayName;
    const email = req.user.emails[0].value;

    // * Step 1: Search for the user by email
    console.log("Finding the user");
    let user = await findUser(email, undefined);

    // * Step 2: If user doesn't exist, create it
    if (user == null) {
      user = await createUser(name, email);
    }

    // * Step 3: Return the user
    return res.status(200).json(user);

  } catch (error) {
    console.error("Error logging in user:", error);
    
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*
 *    Gets user profile by id, returns user object or null on error
 */
export const getUserById = async (req: reqUser, res: any) => {
  try {
    const { id } = req.params;

    const user = await findUser(undefined, id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/*
 *    Updates user profile with name, returns user object or null on error
 */
export const updateUser = async (req: reqUser, res: any) => {
  try {
      const { uid } = req.user;
      const { name } = req.body;

      const user = await updateUserProfile(name, uid);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.status(200).json(user);
  } catch (error) {
      console.error("Error updating user profile:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
}