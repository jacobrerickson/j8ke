import mongoose from "mongoose";
import { seedUsers } from "../lib/seed";

async function seed() {
    try {
        await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/saint-seeing");
        await seedUsers();
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seed(); 