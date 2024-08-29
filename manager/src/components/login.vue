<template>
  <div class="app-container">
    <!-- 只有在 isLoggedIn 为 false 时显示登录组件 -->
    <div v-if="!isLoggedIn" class="login-container">
      <h2>登录</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">账号：</label>
          <input type="text" v-model="username" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">密码：</label>
          <input type="password" v-model="password" id="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
    </div>
    <!-- 只有在 isLoggedIn 为 true 时显示 index 组件 -->
    <Index v-if="isLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Index from './index.vue';

const username = ref('');
const password = ref('');
const isLoggedIn = ref(false); // 控制登录状态，初始值为 false

const handleSubmit = () => {
  console.log(`登录信息: 账号=${username.value}, 密码=${password.value}`);
  
  // 模拟成功登录
  isLoggedIn.value = true;
  
  // 重置输入框
  username.value = '';
  password.value = '';
};
</script>

<style scoped>
.app-container {
  /* 包含整个应用的容器，确保在切换视图时保持布局 */
}

.login-container {
  width: 500px;
  height: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  margin-bottom: 45px;
}

label {
  margin-right: 10px; /* 标签和输入框之间的间距 */
  font-size: 16px;
}

input {
  width: 400px;
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 4px;
  height: 30px;
}

button {
  width: 85%;
  padding: 10px;
  background-color: #c3dff8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 50px;
}

button:hover {
  background-color: #0056b3;
}
</style>
