<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>New Chat</h3>
        <button @click="$emit('close')" class="btn-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal-tabs">
        <button
            :class="['tab-button', { active: chatType === 'direct' }]"
            @click="chatType = 'direct'"
        >
          Direct Chat
        </button>
        <button
            :class="['tab-button', { active: chatType === 'group' }]"
            @click="chatType = 'group'"
        >
          Group Chat
        </button>
      </div>

      <div class="modal-body">
        <div v-if="chatType === 'group'" class="form-group">
          <label for="groupName">Group Name</label>
          <input
              id="groupName"
              v-model="groupName"
              type="text"
              placeholder="Enter group name"
          />
        </div>

        <div class="form-group">
          <label>{{ chatType === 'direct' ? 'Select User' : 'Select Members' }}</label>
          <div class="users-list">
            <div v-if="availableUsers.length === 0" class="empty-users">
              No users available
            </div>
            <div
                v-for="user in availableUsers"
                :key="user.id"
                :class="['user-item', { selected: isUserSelected(user.id) }]"
                @click="toggleUser(user.id)"
            >
              <div class="user-avatar">
                {{ user.displayName?.charAt(0).toUpperCase() }}
              </div>
              <div class="user-info">
                <p class="user-name">{{ user.displayName }}</p>
                <p class="user-email">{{ user.email }}</p>
              </div>
              <div v-if="isUserSelected(user.id)" class="check-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Cancel</button>
        <button @click="createChat" :disabled="!canCreate" class="btn-primary">
          Create Chat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRaw } from 'vue';

// ✅ define props first
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  currentUserId: {
    type: String,
    required: true,
  },
});

const availableUsers = computed(() => {
  return props.users.filter(u => u.id !== props.currentUserId);
});

watch(
    () => props.users,
    (newVal) => {
      console.log('Users updated:', toRaw(newVal));
    },
    { deep: true, immediate: true }
);

console.log('users value:', toRaw(props.users));
const emit = defineEmits(['close', 'create']);

const chatType = ref('direct');
const groupName = ref('');
const selectedUserIds = ref([]);



console.log(props.users);


const isUserSelected = (userId) => {
  return selectedUserIds.value.includes(userId);
};

const toggleUser = (userId) => {
  if (chatType.value === 'direct') {
    selectedUserIds.value = [userId];
  } else {
    const index = selectedUserIds.value.indexOf(userId);
    if (index > -1) {
      selectedUserIds.value.splice(index, 1);
    } else {
      selectedUserIds.value.push(userId);
    }
  }
};

const canCreate = computed(() => {
  if (chatType.value === 'direct') {
    return selectedUserIds.value.length === 1;
  } else {
    return groupName.value.trim() && selectedUserIds.value.length >= 1;
  }
});

const createChat = () => {
  if (!canCreate.value) return;

  emit('create', {
    type: chatType.value,
    userIds: selectedUserIds.value,
    groupName: chatType.value === 'group' ? groupName.value.trim() : null
  })

  emit('close');
};
watch(() => props.users, (val) => console.log('Modal users:', val));
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
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

.btn-close:hover {
  background: #f7fafc;
  color: #1a1a1a;
}

.modal-tabs {
  display: flex;
  padding: 0 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 0;
  cursor: pointer;
  color: #718096;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tab-button:hover {
  color: #4a5568;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
}

input[type="text"] {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

input[type="text"]:focus {
  outline: none;
  border-color: #667eea;
}

.users-list {
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  max-height: 250px;
  overflow-y: auto;
}

.empty-users {
  padding: 2rem;
  text-align: center;
  color: #a0aec0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f7fafc;
}

.user-item:last-child {
  border-bottom: none;
}

.user-item:hover {
  background: #f7fafc;
}

.user-item.selected {
  background: #edf2f7;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 0.25rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a;
}

.user-email {
  margin: 0;
  font-size: 0.8125rem;
  color: #718096;
}

.check-icon {
  color: #667eea;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #edf2f7;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .modal-content {
    max-width: 100%;
    max-height: 90vh;
  }
}
</style>
