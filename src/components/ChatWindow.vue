<template>
  <div class="chat-window">
    <audio ref="remoteAudio" autoplay></audio>

    <!-- Call Modal -->
    <div v-if="isCallActive" class="call-modal-overlay">
      <div class="call-modal">
        <div class="call-status">
          <div class="pulse-animation"></div>
          <h3>{{ callStatus }}</h3>
          <p>{{ getSenderName(otherUserId) }}</p>
        </div>

        <div class="call-actions">
          <button @click="endCall" class="end-call-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
            End Call
          </button>
        </div>
      </div>
    </div>

    <div class="chat-header">
      <div class="chat-header-info">
        <h3>{{ chatName }}</h3>
      </div>

      <div class="chat-header-actio">
        <div class="action-buttons">
          <!-- Voice Call Button -->
          <button @click="startCall" title="Voice Call" :disabled="isCallActive">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z"
                    stroke="#000000" stroke-width="1.5" stroke-miterlimit="10"/>
            </svg>
          </button>

          <!-- Divider Line -->
          <div class="divider"></div>

          <!-- Video Call Button -->
          <button @click="$emit('video-call')" title="Video Call">
            <svg width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M28.186 9.069l-6.855 4.122v-4.655c0-0.883-0.716-1.599-1.599-1.599h-17.060c-0.884 0-1.599 0.716-1.599 1.599v14.928c0 0.883 0.715 1.599 1.599 1.599h17.060c0.883 0 1.599-0.716 1.599-1.599v-4.744l7.006 4.211h2.591v-13.861h-2.742zM20.265 23.464c0 0.294-0.24 0.533-0.533 0.533h-17.060c-0.295 0-0.533-0.239-0.533-0.533v-14.928c0-0.294 0.238-0.533 0.533-0.533h17.060c0.294 0 0.533 0.239 0.533 0.533v14.928zM29.861 21.864h-1.229l-7.301-4.389v-3.039l7.15-4.3h1.38v11.729z"
                    fill="#000000"/>
            </svg>
          </button>
        </div>

        <!-- Close Button -->
        <button @click="$emit('close')" class="btn-close" title="Close Chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <p>No messages yet. Start the conversation!</p>
      </div>
      <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :current-user-id="currentUserId"
          :sender-name="getSenderName(message.senderId)"
      />
    </div>

    <!-- message input -->
    <div class="message-input">
      <!-- Emoji Button -->
      <div class="emoji-container">
        <button class="emoji-btn" @click="toggleEmojiPicker" type="button">
          <svg width="24px" height="24px" viewBox="0 0 24 24">
            <path d='M12,1.73A10.27,10.27,0,1,0,22.24,12,10.25,10.25,0,0,0,12,1.73ZM21,12a9,9,0,1,1-9-9A9,9,0,0,1,21,12Z' />
            <path d='M8.8,11.05a1.55,1.55,0,1,0-1.51-1.5A1.56,1.56,0,0,0,8.8,11.05Z' />
            <path d='M15.44,11.05a1.55,1.55,0,1,0,0-3.09,1.53,1.53,0,0,0-1.51,1.59A1.51,1.51,0,0,0,15.44,11.05Z' />
            <path d='M12.19,16.35A6.58,6.58,0,0,1,6.9,13.5a5.71,5.71,0,0,0,5.3,4,5.54,5.54,0,0,0,5.31-4A6.27,6.27,0,0,1,12.19,16.35Z' />
          </svg>
        </button>

        <div v-if="showEmojiPicker" class="emoji-picker">
          <EmojiPicker @select="onEmojiSelect" />
        </div>
      </div>

      <!-- 📎 File Picker -->
      <div class="pick-files">
        <button class="emoji-btn" @click="toggleFileDropdown" type="button">
          <svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>clip</title>
            <path d="M5.469 16.688l8.75-8.75c0.094-0.094 0.844-0.844 2.031-1.25 1.656-0.531 3.344-0.094 4.688 1.25 1.375 1.344 1.781 3 1.25 4.656-0.375 1.188-1.156 2-1.25 2.094l-9.406 9.406c-1.625 1.625-5.688 3.719-9.438 0-3.719-3.719-1.594-7.813 0-9.406l10.094-10.125c0.375-0.375 0.969-0.375 1.344 0s0.375 0.969 0 1.344l-10.063 10.125c-0.156 0.125-3.313 3.406 0 6.719 3.219 3.219 6.375 0.344 6.719 0l9.406-9.438s0.531-0.531 0.781-1.281c0.313-1 0.094-1.875-0.781-2.75-1.875-1.875-3.688-0.313-4.031 0l-8.75 8.719c-0.313 0.313-0.531 0.844 0 1.375s1.031 0.281 1.344 0l6.063-6.063c0.375-0.344 1-0.344 1.344 0 0.375 0.375 0.375 1 0 1.375l-6.063 6.031c-0.844 0.813-2.563 1.469-4.031 0-1.5-1.469-0.844-3.219 0-4.031z"></path>
          </svg>
        </button>

        <!-- Dropdown -->
        <div v-if="showFileDropdown" class="file-dropdown">
          <ul>
            <li @click="openCamera">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.293 4.293A1 1 0 0 1 9 4h6a1 1 0 0 1 .707.293L17.414 6H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.586l1.707-1.707zM9.414 6L7.707 7.707A1 1 0 0 1 7 8H4v10h16V8h-3a1 1 0 0 1-.707-.293L14.586 6H9.414zM12 10.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-4 2a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" fill="#0D0D0D"/></svg>
              Camera
            </li>
            <li @click="openGallery">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 21L16 10L21 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Photos & Videos
            </li>
            <li @click="openDocument">
              <svg fill="#000000" width="24px" height="24px" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>document-line</title>
                <path class="clr-i-outline clr-i-outline-path-1" d="M21.89,4H7.83A1.88,1.88,0,0,0,6,5.91V30.09A1.88,1.88,0,0,0,7.83,32H28.17A1.88,1.88,0,0,0,30,30.09V11.92Zm-.3,2.49,6,5.9h-6ZM8,30V6H20v8h8V30Z"></path>
                <rect x="0" y="0" width="24" height="24" fill-opacity="0"/>
              </svg>
              Document
            </li>
          </ul>
        </div>

        <div v-if="showCameraModal" class="camera-modal-overlay">
          <div class="camera-modal">
            <video ref="video" autoplay playsinline class="camera-preview"></video>

            <div class="camera-controls">
              <button @click="capturePhoto" class="capture-btn">📸 Capture</button>
              <button @click="closeCamera" class="cancel-btn">✖ Cancel</button>
            </div>
          </div>
        </div>
        <input ref="galleryInput" type="file" accept="image/*,video/*" multiple style="display: none" @change="handleFileSelect">
        <input ref="documentInput" type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" multiple style="display: none" @change="handleFileSelect">
      </div>

      <!-- Text Input -->
      <input
          ref="inputRef"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type a message..."
          :disabled="isSending"
      />

      <button
          @click="sendMessage"
          :disabled="!newMessage.trim() || isSending"
          class="btn-send"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import ChatMessage from './ChatMessage.vue';
import { useChat } from '../composables/useChat';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { ref as dbRef, onValue, off } from "firebase/database";
import { database } from "../firebase";

const showFileDropdown = ref(false);
const inputRef = ref(null);
const { createCall, answerCall, rejectCall, subscribeToIncomingCalls, sendMessage: sendChatMessage, subscribeToMessages } = useChat();

const toggleFileDropdown = () => {
  showFileDropdown.value = !showFileDropdown.value;
};

const cameraInput = ref(null);
const galleryInput = ref(null);
const documentInput = ref(null);
const remoteAudio = ref(null);

// Call states
const isCallActive = ref(false);
const callStatus = ref('Calling...');
const currentCallId = ref(null);

const showCameraModal = ref(false);
const video = ref(null);
let cameraStream = null;
const remoteStream = ref(null);
let peerConnection = null;
let localStream = null;
let callUnsubscribe = null;

const props = defineProps({
  chat: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: String,
    required: true
  },
  users: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close']);

const messages = ref([]);
const newMessage = ref('');
const isSending = ref(false);
const messagesContainer = ref(null);
let unsubscribe = null;

const chatName = computed(() => {
  if (props.chat.type === 'group') {
    return props.chat.name || 'Group Chat';
  }

  const otherUserId = Object.keys(props.chat.participants).find(
      id => id !== props.currentUserId
  );
  const otherUser = props.users.find(u => u.id === otherUserId);
  return otherUser?.displayName || 'Direct Chat';
});

const otherUserId = computed(() => {
  return Object.keys(props.chat.participants).find(id => id !== props.currentUserId);
});

const getSenderName = (senderId) => {
  const sender = props.users.find(u => u.id === senderId);
  return sender?.displayName || 'Unknown';
};

const startCall = async () => {
  try {
    console.log('🔵 Starting call to:', otherUserId.value);
    isCallActive.value = true;
    callStatus.value = 'Calling...';

    // Create peer connection
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    peerConnection = new RTCPeerConnection(configuration);

    // Get local audio stream
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Handle remote stream
    remoteStream.value = new MediaStream();
    peerConnection.ontrack = (event) => {
      console.log('🎵 Received remote track');
      event.streams[0].getTracks().forEach(track => {
        remoteStream.value.addTrack(track);
      });
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('📡 ICE candidate generated');
      }
    };

    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Create call in Firebase
    const callId = await createCall(props.currentUserId, otherUserId.value, offer);
    currentCallId.value = callId;
    console.log('✅ Call created with ID:', callId);

    // Listen for answer
    const callRef = dbRef(database, `calls/${callId}`);
    callUnsubscribe = onValue(callRef, async (snapshot) => {
      const callData = snapshot.val();
      console.log('📞 Call status update:', callData?.status);

      if (callData?.status === 'accepted' && callData.answer) {
        console.log('✅ Call accepted, setting remote description');
        callStatus.value = 'Connected';
        await peerConnection.setRemoteDescription(new RTCSessionDescription(callData.answer));
      } else if (callData?.status === 'rejected') {
        console.log('❌ Call rejected');
        callStatus.value = 'Call rejected';
        setTimeout(() => endCall(), 2000);
      } else if (callData?.status === 'ended') {
        console.log('📴 Call ended by other user');
        endCall();
      }
    });

  } catch (error) {
    console.error('❌ Error starting call:', error);
    alert('Failed to start call: ' + error.message);
    endCall();
  }
};

const endCall = () => {
  console.log('📴 Ending call');

  // Stop local stream
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  // Close peer connection
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // Unsubscribe from call updates
  if (callUnsubscribe) {
    callUnsubscribe();
    callUnsubscribe = null;
  }

  // Reset states
  isCallActive.value = false;
  callStatus.value = 'Calling...';
  currentCallId.value = null;
  remoteStream.value = null;
};

// Watch remote stream and attach to audio element
watch(remoteStream, (newStream) => {
  if (remoteAudio.value && newStream) {
    console.log('🔊 Attaching remote stream to audio element');
    remoteAudio.value.srcObject = newStream;
  }
});

// Camera functions
const openCamera = async () => {
  showFileDropdown.value = false;
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    showCameraModal.value = true;
    await nextTick();
    if (video.value) {
      video.value.srcObject = cameraStream;
    }
  } catch (err) {
    console.error("Camera access denied:", err);
    alert("Unable to access camera. Please check permissions.");
  }
};

const closeCamera = () => {
  showCameraModal.value = false;
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
  }
};

const capturePhoto = async () => {
  if (!video.value) return;

  const canvas = document.createElement('canvas');
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL('image/png');

  await sendChatMessage(
      props.chat.id,
      props.currentUserId,
      imageData,
      props.chat.type
  );

  closeCamera();
};

const openGallery = () => {
  showFileDropdown.value = false;
  galleryInput.value.click();
};

const openDocument = () => {
  showFileDropdown.value = false;
  documentInput.value.click();
};

const handleFileSelect = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  for (const file of files) {
    await sendFileMessage(file);
  }

  event.target.value = '';
};

const sendFileMessage = async (file) => {
  try {
    const fileUrl = URL.createObjectURL(file);
    await sendChatMessage(
        props.chat.id,
        props.currentUserId,
        fileUrl,
        props.chat.type
    );
  } catch (err) {
    console.error('Error sending file:', err);
  }
};

const showEmojiPicker = ref(false);

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const onEmojiSelect = (emoji) => {
  newMessage.value += emoji.i;
  showEmojiPicker.value = false;
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return;

  isSending.value = true;
  const messageText = newMessage.value.trim();
  newMessage.value = '';

  const result = await sendChatMessage(
      props.chat.id,
      props.currentUserId,
      messageText,
      props.chat.type
  );

  isSending.value = false;

  if (!result.success) {
    console.error('Failed to send message:', result.error);
    newMessage.value = messageText;
  }

  await nextTick();
  inputRef.value?.focus();
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

onMounted(() => {
  unsubscribe = subscribeToMessages(props.chat.id, (newMessages) => {
    messages.value = newMessages;
  });
  scrollToBottom();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
  endCall();
});
</script>

<style scoped>
/* Call Modal Styles */
.call-modal-overlay {
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.call-status h3 {
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.call-status p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
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

/* Camera Modal Styles */
.camera-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.camera-modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  width: 400px;
}

.camera-preview {
  width: 100%;
  border-radius: 12px;
  background: black;
  max-height: 300px;
  object-fit: cover;
}

.camera-controls {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

.capture-btn,
.cancel-btn {
  flex: 1;
  padding: 10px 15px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.capture-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  margin-right: 10px;
}

.capture-btn:hover {
  transform: scale(1.05);
}

.cancel-btn {
  background: #e2e8f0;
  color: #333;
}

.cancel-btn:hover {
  background: #cbd5e0;
}

.pick-files {
  position: relative;
  display: flex;
  align-items: center;
}

.file-dropdown {
  position: absolute;
  bottom: 120%;
  left: 0;
  z-index: 50;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 180px;
}

.file-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0.5rem 0;
}

.file-dropdown li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.95rem;
}

.file-dropdown li:hover {
  background: #f3f4f6;
}

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: #1a1a1a;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #e5ddd5;
  background-image: url('../assets/alessio-soggetti-IOhH65el-no-unsplash.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  text-align: center;
}

.message-input {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.message-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  font-size: 0.9375rem;
  transition: border-color 0.2s;
}

.message-input input:focus {
  outline: none;
  border-color: gray;
}

.btn-send {
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-header-actio {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

.action-buttons {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  gap: 10px;
}

.action-buttons button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
}

.action-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #ccc;
}

@media (max-width: 768px) {
  .chat-header {
    padding: 1rem;
  }

  .messages-container {
    padding: 1rem;
  }

  .message-input {
    padding: 1rem;
  }
}

.emoji-container {
  position: relative;
  display: flex;
  align-items: center;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: transform 0.2s;
}

.emoji-btn:hover {
  transform: scale(1.1);
}

.emoji-picker {
  position: absolute;
  bottom: 120%;
  left: 0;
  z-index: 50;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>