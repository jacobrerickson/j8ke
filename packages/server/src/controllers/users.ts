import UserModel from "../models/user";

export async function getAllUsers() {
    try {
        const users = await UserModel.find({}, {
            password: 0, // Exclude password field
            roles: 0,    // Exclude roles for this endpoint
        });

        return users.map(user => user.toClient());
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
    }
}

export async function getUserById(id: string) {
    try {
        const user = await UserModel.findById(id, {
            password: 0,
            roles: 0,
        });

        if (!user) {
            throw new Error("User not found");
        }

        return user.toClient();
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
    }
} 