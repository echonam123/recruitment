
<template>
  <el-container class="layout-container-demo" style="height: 90%">
    <!-- 左侧导航栏 -->
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '2']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>报名人员
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="showCheck">查看报名人员</el-menu-item>
              <el-menu-item index="1-2" @click="showBatch">批量操作</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>设置
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="showInterview">前端预约</el-menu-item>
              <el-menu-item index="2-2" @click="showInterview">后端预约</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 中心内容区域 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="layout-header">
        <el-row type="flex" justify="space-between" align="middle">
          <div class="header-title">管理端</div>
          <el-button @click="logout" type="text" class="logout-button">退出登录</el-button>
        </el-row>
      </el-header>

      <!-- 主要内容 -->
      <el-main>
        <check v-if="isCheckVisible" @show="fetchData"></check>
        <interview v-if="isInterview"></interview>
        <batch v-if="isBatch"></batch>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'; 
import check from './check.vue';
import interview from './interview.vue';
import batch from './batch.vue';
// import {CheckApplicants} from '../api/modules/user'
import {useStore} from 'vuex'
import {watchEffect} from 'vue'

const isCheckVisible = ref(false);
const isInterview = ref(false);
const isBatch = ref(false);

const store = useStore();

function showCheck() {
  isCheckVisible.value = true;
  isInterview.value = false;
  isBatch.value = false;
}

function showBatch(){
  isCheckVisible.value = false;
  isInterview.value = false;
  isBatch.value = true;
}

function showInterview() {
  isInterview.value = true;
  isCheckVisible.value = false;
  isBatch.value = false;
}

function logout() {
  // 退出登录逻辑
  console.log("管理员已退出登录");
}

const fetchData = async () => {
  await store.dispatch('fetchApplicantsData');
};

// 使用 watchEffect 监听 isCheckVisible 的变化
watchEffect(() => {
  if (isCheckVisible.value) {
    fetchData();
  }
});
watchEffect(() => {
  if (isBatch.value) {
    fetchData();
  }
});

</script>

<style scoped>
.layout-container-demo .el-header {
  background-color: #1f2d3d; /* 深色背景 */
  color: #ffffff; /* 白色文字 */
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.layout-container-demo .header-title {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.layout-container-demo .logout-button {
  color: #ffffff;
  font-weight: 500;
  background-color: #409eff; /* 设置背景颜色 */
  border-radius: 20px; /* 圆角按钮 */
  padding: 5px 15px;
  transition: background-color 0.3s;
}

.layout-container-demo .logout-button:hover {
  background-color: #66b1ff; /* 悬停时改变背景颜色 */
}

.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-menu {
  border-right: none;
}

.layout-container-demo .el-main {
  padding: 20px;
}

.layout-header .el-row {
  height: 100%;
}
</style>