import { ref, computed } from 'vue';
import {
    ref as dbRef,
    push,
    set,
    onValue,
    query,
    orderByChild,
    update,
    get,
    child
} from 'firebase/database';
import { database } from '../firebase';

const messages = ref({});
const chats = ref({});
const users = ref({});
const unreadCounts = ref({});

export function useChat(currentUserId) {
    const sendMessage = async (chatId, senderId, text, chatType = 'direct') => {
        try {
            const messageRef = push(dbRef(database, `messages/${chatId}`));
            await set(messageRef, {
                text,
                senderId,
                timestamp: Date.now(),
                read: false
            });

            await update(dbRef(database, `chats/${chatId}`), {
                lastMessage: text,
                lastMessageTime: Date.now(),
                updatedAt: Date.now()
            });

            // Update unread count for all participants except sender
            const chatSnapshot = await get(dbRef(database, `chats/${chatId}`));
            const chatData = chatSnapshot.val();
            if (chatData && chatData.participants) {
                const participants = Object.keys(chatData.participants);
                for (const participantId of participants) {
                    if (participantId !== senderId) {
                        const unreadRef = dbRef(database, `unreadCounts/${participantId}/${chatId}`);
                        const currentUnread = await get(unreadRef);
                        const currentCount = currentUnread.val() || 0;
                        await set(unreadRef, currentCount + 1);
                    }
                }
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const createDirectChat = async (userId1, userId2) => {
        const chatId = [userId1, userId2].sort().join('_');
        const chatRef = dbRef(database, `chats/${chatId}`);

        const snapshot = await get(chatRef);
        if (!snapshot.exists()) {
            await set(chatRef, {
                type: 'direct',
                participants: { [userId1]: true, [userId2]: true },
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }

        return chatId;
    };

    const createGroupChat = async (creatorId, participantIds, groupName) => {
        const chatRef = push(dbRef(database, 'chats'));
        const participants = { [creatorId]: true };
        participantIds.forEach(id => participants[id] = true);

        await set(chatRef, {
            type: 'group',
            name: groupName,
            participants,
            createdBy: creatorId,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        return chatRef.key;
    };

    const subscribeToMessages = (chatId, callback) => {
        const messagesRef = query(
            dbRef(database, `messages/${chatId}`),
            orderByChild('timestamp')
        );

        return onValue(messagesRef, (snapshot) => {
            const messagesData = [];
            snapshot.forEach((childSnapshot) => {
                messagesData.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            callback(messagesData);
        });
    };

    const subscribeToChats = (userId, callback) => {
        const chatsRef = dbRef(database, 'chats');

        return onValue(chatsRef, (snapshot) => {
            const chatsData = [];
            snapshot.forEach((childSnapshot) => {
                const chat = childSnapshot.val();
                if (chat.participants && chat.participants[userId]) {
                    chatsData.push({
                        id: childSnapshot.key,
                        ...chat
                    });
                }
            });
            callback(chatsData.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)));
        });
    };

    const subscribeToUsers = (callback) => {
        const usersRef = dbRef(database, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val() || {};
            const users = Object.entries(data).map(([id, user]) => ({
                id,
                ...user,
            }));
            callback(users);
        });
        return () => unsubscribe();
    };

    const updateUserStatus = async (userId, userData) => {
        const userRef = dbRef(database, `users/${userId}`);
        await update(userRef, {
            ...userData,
            lastSeen: Date.now()
        });
    };

    const subscribeToUnreadCounts = (userId, callback) => {
        const unreadRef = dbRef(database, `unreadCounts/${userId}`);
        return onValue(unreadRef, (snapshot) => {
            const counts = snapshot.val() || {};
            callback(counts);
        });
    };

    const markChatAsRead = async (userId, chatId) => {
        try {
            const unreadRef = dbRef(database, `unreadCounts/${userId}/${chatId}`);
            await set(unreadRef, 0);
        } catch (error) {
            console.error('Error marking chat as read:', error);
        }
    };
    const createCall = async (callerId, receiverId, offer) => {
        const callRef = push(dbRef(database, 'calls'));
        await set(callRef, {
            callerId,
            receiverId,
            status: 'ringing',
            offer,
            createdAt: Date.now()
        });
        return callRef.key;
    };

    const answerCall = async (callId, answer) => {
        await update(dbRef(database, `calls/${callId}`), {
            status: 'accepted',
            answer
        });
    };

    const rejectCall = async (callId) => {
        await update(dbRef(database, `calls/${callId}`), {
            status: 'rejected'
        });
    };

    const endCall = async (callId) => {
        await update(dbRef(database, `calls/${callId}`), {
            status: 'ended'
        });
    };

    const subscribeToIncomingCalls = (userId, callback) => {
        const callsRef = dbRef(database, 'calls');
        return onValue(callsRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const call = { id: childSnapshot.key, ...childSnapshot.val() };
                if (call.receiverId === userId && call.status === 'ringing') {
                    callback(call);
                }
            });
        });
    };
    return {
        messages,
        chats,
        users,
        unreadCounts,
        sendMessage,
        createDirectChat,
        createGroupChat,
        subscribeToMessages,
        subscribeToChats,
        subscribeToUsers,
        updateUserStatus,
        subscribeToUnreadCounts,
        markChatAsRead,
        createCall,
        answerCall,
        rejectCall,
        endCall,
        subscribeToIncomingCalls
    };
}