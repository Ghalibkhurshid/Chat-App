<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="form-group">
          <label for="displayName">Display Name</label>
          <input
              id="displayName"
              v-model="displayName"
              type="text"
              placeholder="Enter your name"
              required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Register' }}
        </button>
      </form>

      <div class="auth-switch">
        <p>
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <button @click="isLogin = !isLogin" class="link-button">
            {{ isLogin ? 'Register' : 'Login' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useChat } from '../composables/useChat';

const emit = defineEmits(['authenticated']);

const { login, register } = useAuth();
const { updateUserStatus } = useChat();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const displayName = ref('');
const error = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  error.value = '';
  isLoading.value = true;

  let result;
  if (isLogin.value) {
    result = await login(email.value, password.value);
  } else {
    result = await register(email.value, password.value, displayName.value);
  }

  isLoading.value = false;

  if (result.success) {
    await updateUserStatus(result.user.uid, {
      email: result.user.email,
      displayName: result.user.displayName,
      online: true
    });
    emit('authenticated', result.user);
  } else {
    error.value = result.error;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
}

h2 {
  margin: 0 0 2rem 0;
  color: #1a1a1a;
  font-size: 1.75rem;
  text-align: center;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-switch {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-switch p {
  color: #718096;
  font-size: 0.875rem;
}

.link-button {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  margin-left: 0.25rem;
}

.link-button:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}
</style>
