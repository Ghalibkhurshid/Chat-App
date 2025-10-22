<template>
  <div id="app">
    <AuthForm v-if="!user && !loading" @authenticated="handleAuthenticated" />
    <!-- Incoming Call Modal -->
    <div v-if="incomingCall" class="incoming-call-overlay">
      <div class="call-modal">
        <div class="call-status">
          <div class="pulse-animation"></div>
          <h2>Incoming Call</h2>
          <p>{{ getCallerName(incomingCall.callerId) }}</p>
        </div>

        <div class="call-actions">
          <button @click="handleAcceptCall" class="accept-btn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            <span>Accept</span>
          </button>

          <button @click="handleRejectCall" class="end-call-btn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="isInCall" class="active-call-overlay">
      <div class="active-call-modal">
        <audio ref="remoteAudioApp" autoplay></audio>

        <div class="call-info">
          <div class="call-animation"></div>
          <h2>🎵 In Call</h2>
          <p>{{ getCallerName(callPartnerId) }}</p>
          <small>Call connected</small>
        </div>

        <button @click="endActiveCall" class="end-call-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
          </svg>
          End Call
        </button>
      </div>
    </div>
    <div v-else-if="user" class="chat-app">
      <ChatSidebar
          :chats="chats"
          :users="allUsers"
          :current-user="user"
          :selected-chat-id="selectedChat?.id"
          @select-chat="selectChat"
          :unread-counts="unreadCounts"
          @new-chat="showNewChatModal = true"
          @logout="handleLogout"
          :class="{ 'mobile-hidden': selectedChat && isMobile }"
      />

      <div class="chat-main" :class="{ 'mobile-hidden': !selectedChat && isMobile }">
        <div v-if="!selectedChat" class="welcome-screen">
          <div class="welcome-content">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h1>Welcome to Chat</h1>
            <p>Select a chat or start a new conversation</p>
          </div>
        </div>

        <ChatWindow
            v-else
            :key="selectedChat?.id"
        :chat="selectedChat"
        :current-user-id="user.uid"
        :users="allUsers"
        @close="handleCloseChat"
        />
      </div>

      <NewChatModal
          v-if="showNewChatModal"
          :users="allUsers"
          :current-user-id="user.uid"
          @create="handleCreateChat"
          @close="showNewChatModal = false"
      />
    </div>

    <div v-else class="loading-screen">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,watch  } from 'vue';
import AuthForm from './components/AuthForm.vue';
import ChatSidebar from './components/ChatSidebar.vue';
import ChatWindow from './components/ChatWindow.vue';
import NewChatModal from './components/NewChatModal.vue';
import { useAuth } from './composables/useAuth';
import { useChat } from './composables/useChat';

const { user, loading, logout } = useAuth();
const {
  createDirectChat,
  createGroupChat,
  subscribeToChats,
  subscribeToUsers,
  updateUserStatus,
  subscribeToUnreadCounts,
  markChatAsRead,
  subscribeToIncomingCalls,
  answerCall,
  rejectCall,
  endCall // ✅ add this
} = useChat();
const chats = ref([]);
const allUsers = ref([]);
const selectedChat = ref(null);
const showNewChatModal = ref(false);
const isMobile = ref(window.innerWidth <= 768);

let unsubscribeChats = null;
let unsubscribeUsers = null;
let unsubscribeUnreadCounts = null;
let unsubscribeIncomingCalls = null;
let peerConnection = null;
let localStream = null;
let remoteStreamApp = null;
const unreadCounts = ref({});
// Call states
const incomingCall = ref(null);
const isInCall = ref(false);
const callPartnerId = ref(null);
const remoteAudioApp = ref(null);
const getCallerName = (userId) => {
  const foundUser = allUsers.value.find(u => u.id === userId);
  return foundUser?.displayName || 'Unknown User';
};

const handleAcceptCall = async () => {
  if (!incomingCall.value) return;

  try {
    console.log('✅ Accepting call from:', incomingCall.value.callerId);

    // Create peer connection
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    peerConnection = new RTCPeerConnection(configuration);

    // Get local audio
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Setup remote stream
    remoteStreamApp = new MediaStream();
    peerConnection.ontrack = (event) => {
      console.log('🎵 Received remote track in App.vue');
      event.streams[0].getTracks().forEach(track => {
        remoteStreamApp.addTrack(track);
      });

      // Attach to audio element
      if (remoteAudioApp.value) {
        remoteAudioApp.value.srcObject = remoteStreamApp;
        console.log('🔊 Audio element connected');
      }
    };

    // Set remote description (offer)
    await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.value.offer));

    // Create answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send answer to Firebase
    await answerCall(incomingCall.value.id, answer);

    // Update UI
    callPartnerId.value = incomingCall.value.callerId;
    isInCall.value = true;
    incomingCall.value = null;

    console.log('✅ Call accepted successfully');

  } catch (error) {
    console.error('❌ Error accepting call:', error);
    alert('Failed to accept call: ' + error.message);
    handleRejectCall();
  }
};

const handleRejectCall = async () => {
  if (!incomingCall.value) return;

  console.log('❌ Rejecting call from:', incomingCall.value.callerId);
  await rejectCall(incomingCall.value.id);
  incomingCall.value = null;
};

const endActiveCall = async () => {
  console.log('📴 Ending active call');

  // Stop local audio
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  // Close connection
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // 🔥 Notify other user that call ended
  if (callPartnerId.value) {
    const currentCall = incomingCall.value || { id: `${user.value.uid}_${callPartnerId.value}` };
    await endCall(currentCall.id);
  }

  // Reset UI
  isInCall.value = false;
  callPartnerId.value = null;
  remoteStreamApp = null;
};
watch(user, (newUser) => {
  if (newUser) {
    console.log("👤 User logged in:", newUser.uid);

    // Subscribe to chats
    unsubscribeChats = subscribeToChats(newUser.uid, (newChats) => {
      chats.value = newChats;
    });

    // Subscribe to users
    unsubscribeUsers = subscribeToUsers((newUsers) => {
      console.log("🔥 Users fetched from Firebase:", newUsers);
      allUsers.value = newUsers;
    });
    // Subscribe to unread counts
    unsubscribeUnreadCounts = subscribeToUnreadCounts(newUser.uid, (counts) => {
      console.log("📊 Unread counts updated:", counts);
      unreadCounts.value = counts;
    });
    // 🔥 CRITICAL: Subscribe to incoming calls
    console.log("📞 Setting up incoming call listener for:", newUser.uid);
    unsubscribeIncomingCalls = subscribeToIncomingCalls(newUser.uid, (call) => {
      console.log('🔔 INCOMING CALL RECEIVED:', call);
      incomingCall.value = call;
    });
  } else {
    console.log("🚪 User logged out, cleaning up subscriptions");

    // Cleanup on logout
    if (unsubscribeChats) unsubscribeChats();
    if (unsubscribeUsers) unsubscribeUsers();
    if(unsubscribeIncomingCalls) unsubscribeIncomingCalls();
    chats.value = [];
    allUsers.value = [];
    selectedChat.value = null;
    unreadCounts.value = {};

  }
})
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (unsubscribeChats) unsubscribeChats();
  if (unsubscribeUsers) unsubscribeUsers();
  if (unsubscribeIncomingCalls) unsubscribeIncomingCalls();
  endActiveCall();
});
const handleAuthenticated = (authenticatedUser) => {
  unsubscribeChats = subscribeToChats(authenticatedUser.uid, (newChats) => {
    chats.value = newChats;
  });
  unsubscribeUsers = subscribeToUsers((newUsers) => {
    console.log("🔥 Users fetched from Firebase:", newUsers);
    allUsers.value = newUsers;

  });
  unsubscribeUnreadCounts = subscribeToUnreadCounts(authenticatedUser.uid, (counts) => {
    console.log("📊 Unread counts updated:", counts);
    unreadCounts.value = counts;
  });
};

const selectChat = async (chat) => {
  selectedChat.value = chat;

  // Mark chat as read when selected
  if (user.value && chat.id) {
    await markChatAsRead(user.value.uid, chat.id);
  }
};

const handleCloseChat = () => {
  if (isMobile.value) {
    selectedChat.value = null;
  }
};

const handleCreateChat = async (chatData) => {
  if (chatData.type === 'direct') {
    const chatId = await createDirectChat(user.value.uid, chatData.userIds[0]);
    const chat = chats.value.find(c => c.id === chatId);
    if (chat) {
      selectedChat.value = chat;
    }
  } else {
    const chatId = await createGroupChat(user.value.uid, chatData.userIds, chatData.groupName);
    const chat = chats.value.find(c => c.id === chatId);
    if (chat) {
      selectedChat.value = chat;
    }
  }
};


const handleLogout = async () => {
  if (user.value) {
    await updateUserStatus(user.value.uid, { online: false });
  }

  if (unsubscribeChats) unsubscribeChats();
  if (unsubscribeUsers) unsubscribeUsers();

  await logout();
  selectedChat.value = null;
  chats.value = [];
  allUsers.value = [];
  unreadCounts.value = {};

};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.incoming-call-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
}
.call-modal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  min-width: 320px;
}
.call-status {
   text-align: center;
   color: white;
   margin-bottom: 30px;
 }
.pulse-animation {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: pulse 2s ease-in-out infinite;
}
.call-actions {
  display: flex;
  gap: 15px;
}
.end-call-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.end-call-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}
.accept-btn {
  background: green;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.accept-btn:hover {
  background: green;
  transform: scale(1.05);
}
#app {
  height: 100vh;
  overflow: hidden;
}

.chat-app {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 100vh;
}

.chat-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fafbfc;
}

.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: white;
}

.welcome-content {
  text-align: center;
  color: #718096;
}

.welcome-content svg {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.welcome-content h1 {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.welcome-content p {
  font-size: 1.125rem;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-screen p {
  font-size: 1.125rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .chat-app {
    grid-template-columns: 1fr;
    position: relative;
  }

  .chat-main,
  .chat-sidebar {
    grid-column: 1;
    grid-row: 1;
  }

  .mobile-hidden {
    display: none;
  }

  .welcome-content h1 {
    font-size: 1.5rem;
  }

  .welcome-content p {
    font-size: 1rem;
  }
}

@media (max-width: 1024px) and (min-width: 769px) {
  .chat-app {
    grid-template-columns: 280px 1fr;
  }
}
</style>
