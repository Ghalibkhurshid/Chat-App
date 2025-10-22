<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3>Chats</h3>
      <div class="header-actions">
        <button @click="$emit('new-chat')" class="btn-new-chat" title="New Chat">
          <svg width="24px" height="24px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.6375 9.04176L13.3875 14.2418C13.3075 14.3218 13.1876 14.3718 13.0676 14.3718H10.1075V11.3118C10.1075 11.1918 10.1575 11.0818 10.2375 11.0018L15.4376 5.84176" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.7076 11.9818V21.6618C18.7076 21.9018 18.5176 22.0918 18.2776 22.0918H2.84756C2.60756 22.0918 2.41754 21.9018 2.41754 21.6618V6.23176C2.41754 5.99176 2.60756 5.80176 2.84756 5.80176H12.4875" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.3863 2.90824L16.859 4.43558L20.0551 7.63167L21.5824 6.10433L18.3863 2.90824Z" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button @click="$emit('logout')" class="btn-logout" title="Logout">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
        </button>
      </div>
    </div>
    <!-- 🔍 SEARCH BAR -->
    <div class="search-bar">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search or start a new chat"
          class="search-input"
      />
    </div>

    <div class="chats-list">
      <div v-if="filteredChats.length === 0" class="empty-chats">
        <p>No chats found</p>
        <p class="empty-subtitle">Try a different name or start a new chat</p>
      </div>

      <div
          v-for="chat in filteredChats"
          :key="chat.id"
          :class="['chat-item', { active: selectedChatId === chat.id }]"
          @click="$emit('select-chat', chat)"
      >
        <div class="chat-avatar">{{ getChatInitial(chat) }}</div>
        <div class="chat-info">
          <div class="chat-name-row">
            <h4>{{ getChatName(chat) }}</h4>
            <span v-if="chat.type === 'group'" class="group-badge">Group</span>
          </div>
          <p class="last-message">{{ chat.lastMessage || 'No messages yet' }}</p>
        </div>
        <div v-if="getUnreadCount(chat.id) > 0" class="unread-badge">
          {{ getUnreadCount(chat.id) }}
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="user-info" @click="toggleMenu">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-details">
          <p class="user-name">{{ userName }}</p>
          <p class="user-status">Online</p>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  chats: Array,
  users: Array,
  currentUser: Object,
  selectedChatId: String,
  unreadCounts: Object
})

defineEmits(['select-chat', 'new-chat', 'logout'])

const userName = computed(() => props.currentUser.displayName || 'User')
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
const menuVisible = ref(false)
const searchQuery = ref('')

const toggleMenu = () => (menuVisible.value = !menuVisible.value)

const getChatName = (chat) => {
  if (chat.type === 'group') return chat.name || 'Group Chat'
  const otherUserId = Object.keys(chat.participants).find(id => id !== props.currentUser.uid)
  const otherUser = props.users.find(u => u.id === otherUserId)
  return otherUser?.displayName || 'Direct Chat'
}

const getChatInitial = (chat) => getChatName(chat).charAt(0).toUpperCase()
// ✅ Add this missing function
const getUnreadCount = (chatId) => {
  if (!props.unreadCounts) return 0
  return props.unreadCounts[chatId] || 0
}
// ✅ Filter chats dynamically by search input
const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) return props.chats
  const q = searchQuery.value.toLowerCase()
  return props.chats.filter(chat => getChatName(chat).toLowerCase().includes(q))
})
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-right: 1px solid #e2e8f0;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-new-chat,
.btn-logout {
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-new-chat:hover,
.btn-logout:hover {
  background: #f7fafc;
  color: #667eea;
}
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  margin: 0.75rem 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.9rem;
  color: #2d3748;
}

.search-input::placeholder {
  color: #a0aec0;
}
.unread-badge {
  background-color: #25d366; /* WhatsApp green */
  color: white; /* text color */
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 9999px; /* full rounded */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
}

.chats-list {
  flex: 1;
  overflow-y: auto;
}

.empty-chats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  color: #a0aec0;
  text-align: center;
}

.empty-chats p {
  margin: 0.25rem 0;
}

.empty-subtitle {
  font-size: 0.875rem;
}

.chat-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f7fafc;
}

.chat-item:hover {
  background: #f7fafc;
}

.chat-item.active {
  background: #edf2f7;
  border-left: 3px solid #667eea;
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.chat-info h4 {
  margin: 0;
  font-size: 1rem;
  color: #1a1a1a;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
}

.last-message {
  margin: 0;
  font-size: 0.875rem;
  color: #718096;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #fafbfc;
}

.user-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  margin: 0;
  font-size: 0.75rem;
  color: #48bb78;
}

@media (max-width: 768px) {
  .sidebar-header {
    padding: 1rem;
  }

  .chat-item {
    padding: 1rem;
  }
}
</style>
