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
  <el-table :data="paginatedData" border style="width: 100%">
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="college" label="学院" width="180" />
    <el-table-column prop="className" label="班级" width="180" />
    <el-table-column prop="studentId" label="序号" width="180" />
    <el-table-column prop="direction" label="方向" width="180" />
    <el-table-column prop="phone" label="邮箱" width="180" />
    <el-table-column prop="introduction" label="简介" width="180" />
    <el-table-column prop="stageName" label="进度" width="100" />
    <el-table-column prop="out" label="是否淘汰" width="85" />
    <el-table-column label="操作" width="120">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="openScoreDialog(scope.row)"
        >
          获取评价信息
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <el-pagination
    v-model:current-page="currentPage"
    :page-size="pageSize"
    :total="totalItems"
    layout="total, prev, pager, next, jumper"
    @current-change="handlePageChange"
    style="margin-top: 20px; text-align: right;"
  />

  <!-- 弹窗内容 -->
  <el-dialog title="评分评价" v-model="ScoreDialogVisible" width="600px">
    <div>
      <!-- 第一部分：面试阶段 -->
      <h3>面试阶段</h3>
      <el-table :data="stageOneData" border>
        <el-table-column prop="score" label="评分" width="150"></el-table-column>
        <el-table-column prop="comment" label="评价" width="300"></el-table-column>
        <el-table-column prop="adminName" label="评价者" width="150"></el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 20px;">
      <!-- 第二部分：一轮 -->
      <h3>一轮</h3>
      <el-table :data="roundOneData" border>
        <el-table-column prop="score" label="评分" width="150"></el-table-column>
        <el-table-column prop="comment" label="评价" width="300"></el-table-column>
        <el-table-column prop="adminName" label="评价者" width="150"></el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 20px;">
      <!-- 第三部分：二轮 -->
      <h3>二轮</h3>
      <el-table :data="roundTwoData" border>
        <el-table-column prop="score" label="评分" width="150"></el-table-column>
        <el-table-column prop="comment" label="评价" width="300"></el-table-column>
        <el-table-column prop="adminName" label="评价者" width="150"></el-table-column>
      </el-table>
    </div>

    <!-- 弹窗底部按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="ScoreDialogVisible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
// import { ElMessageBox, ElDialog, ElMessage } from 'element-plus';
import { ref, computed,onMounted } from 'vue';
import { SelectUser } from '../api/modules/user';
import 'element-plus/dist/index.css';
import store from '../store';
import { ElMessageBox,ElMessage } from 'element-plus';
import { Applicant } from '../api/base';
import { GetRate } from '../api/modules/score';
interface RateBack{
  scoreVoList: RateItem[];
};
interface RateItem{
  stageName: string,
  adminName: string,
  score: number,
  comment: string
}
onMounted(() => {
  fetchData();
});

const username = ref('');
const studentId = ref('');
const stageOneData = ref<RateItem[]>([]);
const roundOneData = ref<RateItem[]>([]);
const roundTwoData = ref<RateItem[]>([]);



const ScoreDialogVisible = ref(false);
const emptyApplicant: Applicant = {
  userId: 0,
  college: '',
  major: '',
  className: '',
  direction: 0,
  name: '',
  studentId: '',
  phone: '',
  introduction: '',
  avatar: '',
  stageId: 0,
  stageName: '',
  out: false,
};
const currentUser = ref<Applicant>(emptyApplicant);

const filterDataBystagename = (data:RateBack) => {
  // Clear previous data
  stageOneData.value = [];
  roundOneData.value = [];
  roundTwoData.value = [];
  data.scoreVoList.forEach(item => {
  switch (item.stageName) {
    case "面试":
      stageOneData.value.push(item);
      break;
    case "一轮考核":
      roundOneData.value.push(item);
      break;
    case "二轮考核":
      roundTwoData.value.push(item);
      break;
  }
});
}
const openScoreDialog = async(row: Applicant) => {
  ScoreDialogVisible.value = true;
  currentUser.value = row;
  try{
    const response = await GetRate(token.value,row.userId);
    if (response.data.data && response.data.data.scoreVoList) {
      store.commit("setRate", { userId: row.userId, score: response.data.data });
      filterDataBystagename(response.data.data);
    } else {
      ElMessageBox.alert('暂无评价信息');
    }
  }catch(error){
    if (error instanceof Error) {
      // 处理拦截器中抛出的错误
      ElMessageBox.alert(`Rate获取失败。错误信息: ${error.message}`);
    }else{
      console.warn(`UserId ${currentUser.value.userId} 的 Rate 数据获取失败`, error);
    }
  };
}
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

const tableData = computed(() =>
  rawData.value.map((item:any) => ({
    ...item,
    direction: getDirectionText(item.direction),
    out: item.out ? '是' : '否',
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
// 响应式分页数据
const currentPage = ref(1);  // 当前页码
const pageSize = ref(15);    // 每页显示的数据条数
const totalItems = computed(() => tableData.value.length); // 总的数据条数

// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// 页面更改时处理逻辑
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
</script>

<style>

</style>
