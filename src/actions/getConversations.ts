
import Conversation from '@/models/Conversation'; 
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
    try {
        const currentUser =await getCurrentUser();


        if (!currentUser) {
            return []; // Handle no current user scenario as needed
        }

        const conversations = await Conversation.find({
            userIds: currentUser._id 
        })
        .sort({ lastMessageAt: 'desc' })
        .populate({
            path: 'users',
            model: 'User'
        })
        .populate({
            path: 'messages',
            model: 'Message',
            populate: {
                path: 'sender seen',
                model: 'User'
            }
        });

        return conversations;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return []; // Handle error gracefully
    }
};

export default getConversations;
