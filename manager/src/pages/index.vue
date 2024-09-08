
<template>
  <el-container class="layout-container-demo" style="height:90%">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']">
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
              <el-menu-item index="2-1"@click="showInterview">预约管理</el-menu-item>
              <el-menu-item index="2-2" @click="showStage">报名阶段管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="layout-header">
        <el-row type="flex" justify="space-between" align="middle">
          <div class="header-title">管理端</div>
          <div>
            <span style="margin-right: 20px">{{currentAdmin}}</span>
            <el-button @click="logout" type="text" class="logout-button">退出登录</el-button>
          </div>
        </el-row>
      </el-header>
      <el-main>
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { RouterView ,useRouter} from 'vue-router'
import { computed } from 'vue'; 
import {useStore} from 'vuex'
import { ElMessage } from 'element-plus';

const store = useStore();

const currentAdmin = computed(() => {
  return store.state.currentAdmin; // 引用 Vuex 状态
});

function logout() {
  // 退出登录逻辑
  // 清除登录状态
  localStorage.removeItem('token');
  // 路由跳转 待配置
  // window.location.href = '/login';
  store.commit("setLoginStatus",false)
  ElMessage.success('退出登录成功');

}
/*************/
const router = useRouter()

function showCheck() {
  router.push('/check') 
}
function showBatch(){
  router.push('/batch')
}
function showInterview() {
  router.push('/interview') 
}
function showStage() {
  router.push('/stage')
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>

