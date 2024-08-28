<template>
  <div class="login-container">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

const handleSubmit = () => {
  // 在这里处理登录逻辑，例如调用 API
  console.log(`登录信息: 账号=${username.value}, 密码=${password.value}`);
  // 重置输入框
  username.value = '';
  password.value = '';
};
</script>

<style scoped>
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
  height: 30px;;
}

button {
  width: 90%;
  padding: 10px;
  background-color: #c3dff8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
