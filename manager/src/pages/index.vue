
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
              <el-menu-item index="1-1">查看报名人员</el-menu-item>
              <el-menu-item index="1-2" @click="showCheck">筛选报名人员</el-menu-item>
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
      <el-main>
        <RouterView></RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { RouterView ,useRouter} from 'vue-router'
const router = useRouter()

function showCheck() {
  router.push('/check') 
}
function showInterview() {
  router.push('interview') 
}
function showStage() {
  router.push('stage')
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

