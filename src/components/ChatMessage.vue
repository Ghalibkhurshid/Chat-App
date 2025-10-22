<template>
  <div :class="['message', { 'message-own': isOwnMessage }]">
    <div class="message-content">
      <div class="message-bubble">
        <span class="message-text">{{ message.text }}</span>
        <span class="message-meta">
          {{ formattedTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: Object, required: true },
  currentUserId: { type: String, required: true }
})

const isOwnMessage = computed(() => props.message.senderId === props.currentUserId)

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase()
})

</script>

<style scoped>
.message {
  display: flex;
  margin-bottom: 6px;
}

.message-own {
  justify-content: flex-end;
}

.message-content {
  max-width: 75%;
}

.message-bubble {
  background: #dcf8c6;
  padding: 8px 10px;
  border-radius: 10px;
  border-top-left-radius: 0;
  color: #111;
  position: relative;
  display: inline-flex;
  align-items: flex-end;
  gap: 6px;
  font-size: 0.95rem;
  line-height: 1.3;
}

.message-own .message-bubble {
  border-top-right-radius: 10px;
  border-top-left-radius: 0;
}


.message-text {
  display: inline;
  word-break: break-word;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.5);
  margin-left: 6px;
}

.message-ticks {
  width: 14px;
  height: 14px;
}
</style>
