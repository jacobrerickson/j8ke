import 'dotenv/config';
import "./index"

import UserModel from "../models/user";
import readline from 'readline';
export async function seedDB(rl: readline.Interface) {

    const askQuestion = (query: string): Promise<string> => {
        return new Promise(resolve => rl.question(query, resolve));
    };

    console.log("Creating an admin user. Enter a name, email and password for the admin user.");

    const name = await askQuestion("Enter name: ");
    const email = await askQuestion("Enter email: ");
    const password = await askQuestion("Enter password: ");

    rl.close();
    UserModel.create({
        email,
        name,
        password,
        roles: ['0', '1'],
        stripeId: "123456",
        verified: true,
    }).then(() => {
        console.log("User created successfully");
        console.log(`Credentials:
        Name: ${name}
        Email: ${email}
        Password: ${password}`);
    })
        .catch((error) => {
            console.error("Error creating user:", error);
        }).finally(() => {
            process.exit();
        });
}