import mongoose from 'mongoose';
import { User } from '@/models/User'; // Adjust the import path as needed
import getSession from './getSession'; // Adjust the import path as needed

const getCurrentUser = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const session = await getSession();

        if (!session?.user?.email) {
            return null; 
        }

        const currentUser = await User.findOne({ email: session.user.email }).exec();
        console.log("Current User:", currentUser);
        return currentUser;

    } catch (error) {
        console.error("Error fetching current user:", error);
        throw new Error("Failed to fetch current user");
    }
};

export default getCurrentUser;
