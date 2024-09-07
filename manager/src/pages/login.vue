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
import { computed, ref , onMounted } from 'vue';
import Index from './index.vue';
import { ElMessageBox,ElMessage} from 'element-plus';
import { Login } from '../api/modules/login';
import {useStore} from 'vuex';
const store = useStore();

const username = ref('');
const password = ref('');
const isLoggedIn = computed(() => store.state.isLoggedIn);
const handleSubmit = async() => {
  try{
    const response = await Login(username.value,password.value)
    // 登录成功
    store.commit('setLoginStatus', true);
    // 重置输入框
    store.commit('setCurrentAdmin',username.value)
    username.value = '';
    password.value = '';
    localStorage.setItem("token",response.data.data.tokenHead + ' ' + response.data.data.token)
    console.log(response.data.data.token)
    ElMessageBox.alert('登录成功', '成功', {
      confirmButtonText: '确定',
      callback: () => {
      },  
    });
  }catch(error){
    if (error instanceof Error) {
      // 处理拦截器中抛出的错误
      ElMessageBox.alert(`登录失败。错误信息: ${error.message}`);
    } else {
      // 处理其他未知错误
      ElMessageBox.alert('登录失败，请检查网络或稍后重试');
    }
  }
};

//页面加载时检查登录状态
onMounted(() => {
  checkLoginStatus()
})
const checkLoginStatus = () => {
  const token = localStorage.getItem("token");
  if (token) {
    store.commit('setLoginStatus', true);
  }
}
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
