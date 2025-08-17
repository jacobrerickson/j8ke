import UserModel from "../models/user";
import { AppRoles } from "../models/user";
import { hash } from "bcrypt";

const users = [
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
        verified: true,
        roles: ["Admin"],
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Carol Williams",
        email: "carol@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "David Brown",
        email: "david@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Eve Davis",
        email: "eve@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Frank Miller",
        email: "frank@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Grace Wilson",
        email: "grace@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Henry Taylor",
        email: "henry@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Ivy Anderson",
        email: "ivy@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
    {
        name: "Jack Thomas",
        email: "jack@example.com",
        password: "password123",
        verified: true,
        roles: ["Standard"],
    },
];

export async function seedUsers() {
    try {
        let createdCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            // Check if user already exists
            const existingUser = await UserModel.findOne({ email: user.email });

            if (!existingUser) {
                const hashedPassword = await hash(user.password, 10);
                await UserModel.create({
                    ...user,
                    password: hashedPassword,
                    roles: [AppRoles.STANDARD]
                });
                createdCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`Seeding completed: ${createdCount} users created, ${skippedCount} skipped (already exist)`);
    } catch (error) {
        console.error("Error seeding users:", error);
    }
} 