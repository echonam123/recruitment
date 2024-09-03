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
  import { ref, onMounted } from "vue";
  import Index from "./index.vue";
  import axiosInstance from "../untils/request";
  // 使用 ref 使变量具备响应性
  const username = ref("");
  const password = ref("");
  const isLoggedIn = ref(false);

  // 读取 token 和检查登录状态
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      isLoggedIn.value = true; // 如果 token 存在，则认为已经登录
    } else {
      isLoggedIn.value = false; // 否则未登录
    }
  };

  // 处理表单提交
  const handleSubmit = () => {
    if (!username.value || !password.value) {
      console.error("请填写所有字段");
      return;
    }

    // 登录请求
    axiosInstance
      .post("admin/login", {
        username: username.value,
        password: password.value,
      })
      .then(
        (response: {
          data: { code: number; data: { token: string }; message: any };
        }) => {
          console.log(response);
          if (response.data.code === 200) {
            // 登录成功
            isLoggedIn.value = true;
            // 重置输入框
            username.value = "";
            password.value = "";
            console.log(response.data.data.token)
            localStorage.setItem("token", response.data.data.token);
            console.log(response.data.data.token);
          } else {
            // 登录失败处理
            console.error("登录失败:", response.data.message);
          }
        }
      )
      .catch((error: any) => {
        console.error("请求失败:", error);
      });
  };

  // 页面加载时检查登录状态
  onMounted(() => {
    checkLoginStatus();
  });
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
