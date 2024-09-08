<template>
  <div>
    <el-input
      v-model="username"
      placeholder="输入姓名（可选）"
      clearable
      style="width: 160px; margin-right: 10px;"
    />
    <el-input
      v-model="studentId"
      placeholder="输入学号（可选）"
      clearable
      style="width: 160px; margin-right: 10px;"
    />
    <el-button @click="search">搜索</el-button>
    <el-button @click="reset">重置</el-button>
  </div>
  <el-divider content-position="center">查看报名人员</el-divider>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="college" label="学院" width="180" />
    <el-table-column prop="className" label="班级" width="180" />
    <el-table-column prop="studentId" label="序号" width="180" />
    <el-table-column prop="direction" label="方向" width="180" />
    <el-table-column prop="phone" label="邮箱" width="180" />
    <el-table-column prop="introduction" label="简介" width="180" />
    <el-table-column prop="stageName" label="进度" width="100" />
    <el-table-column prop="out" label="是否淘汰" width="85" />
    <el-table-column prop="score" label="分数" width="85" />
    <el-table-column prop="comment" label="评价" width="180" />



  </el-table>
</template>

<script lang="ts" setup>
// import { ElMessageBox, ElDialog, ElMessage } from 'element-plus';
import { ref, computed,onMounted } from 'vue';
import { SelectUser } from '../api/modules/user';
import 'element-plus/dist/index.css';
import store from '../store';
import { ElMessageBox,ElMessage } from 'element-plus';

onMounted(() => {
  fetchData();
});

const username = ref('');
const studentId = ref('');

/*
*rawData是vuex中用于接收存储报名人的数据，并在check和batch之间共享
*从vuex中引出rawData变量
*/
const rawData = computed(() => {
  return store.state.rawData; // 引用 Vuex 状态
});
const token = computed(() => {
  return store.state.token; // 引用 Vuex 状态
});

// const rawData = ref([
//   {
//     userId: 0,
//     college: '计算机学院',
//     major: '软件工程',
//     className: '软件工程1班',
//     direction: 1,
//     name: '章三',
//     studentId: '112231',
//     phone: '12321312',
//     introduction: '撒打算大',
//     avatar: 'sdfada',
//     stageId: 0,
//     stageName: '1',
//     out: false,
//   }]);
const tableData = computed(() =>
  rawData.value.map((item:any) => ({
    ...item,
    direction: getDirectionText(item.direction),
    out: item.out ? '是' : '否',
    score : item.score ? item.score : '未评分',
    comment : item.comment ? item.comment : '未评价'
  }))
);
const fetchData = async () => {
  await store.dispatch('fetchApplicantsData');
};

const search = async() => {
  try{
    const response = await SelectUser(token.value,username.value,studentId.value);
    store.commit('setApplicantsData',response.data.data)
    if(response.data.data.length > 0)
    {
      ElMessage('查询成功');
    }else{
      ElMessage('没有此用户');
    }
    
  }catch(error){
    if (error instanceof Error) {
      // 处理拦截器中抛出的错误
      ElMessageBox.alert(`查询失败。错误信息: ${error.message}`);
    } else {
      // 处理其他未知错误
      ElMessageBox.alert('查询失败，请检查网络或稍后重试');
    }
  }
}
const reset = () => {
    username.value = '';
    studentId.value = '';
    fetchData();
}

// 计算属性，将 direction 数字转换为对应的文字
const getDirectionText = (direction: number): string => {
  switch (direction) {
    case 1:
      return '前端开发';
    case 2:
      return '后端开发';
    default:
      return '未知方向';
  }
};
</script>

<style>

</style>
