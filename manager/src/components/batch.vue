<template>
  <el-select
    v-model="selectedFilter"
    filterable
    placeholder="Select Filter"
    style="width: 240px"
    @change="updateSecondaryOptions"
  >
    <el-option
      v-for="item in filterOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <el-select
    v-model="secondaryFilter"
    filterable
    placeholder="Select Detail"
    style="width: 240px"
    :disabled="!secondaryOptions.length"
  >
    <el-option
      v-for="item in secondaryOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-button @click="showAll">Show All</el-button>
  <el-divider content-position="center">查看报名人员</el-divider>
  <div>
      <el-table
        :data="currentPageData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="college" label="学院" width="180" />
        <el-table-column prop="studentId" label="序号" width="180" />
        <el-table-column prop="direction" label="方向" width="180" />
        <el-table-column prop="stageName" label="面试阶段" width="180" />
        <el-table-column prop="out" label="淘汰情况" width="180" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="openDialog(scope.row)">评价</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination
        v-if="totalItems > pageSize"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalItems"
        @current-change="handlePageChange"
        style="margin-top: 20px; text-align: right;">
      </el-pagination>
    </div>
  
  <div style="margin: 20px;">
    <el-button type="danger" @click="openNoticeDialog" style="background-color: skyblue;border:1px solid skyblue">批量通知</el-button>
    <el-button type="danger" @click="openBatchRateDialog" style="background-color: skyblue;border:1px solid skyblue">批量评价</el-button>
    <el-button type="danger" @click="batchReject">批量淘汰</el-button>
  </div>
  <el-dialog v-model="dialogVisible" title="评价">
    <div>
      <el-input type="number" v-model="currentRating" placeholder="输入分数"></el-input>
      <el-input
        type="textarea"
        v-model="currentMessage"
        placeholder="请输入评价内容"
        rows="4"
      ></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitRating">提交</el-button>
    </span>
  </el-dialog>

  <el-dialog v-model="noticedialogVisible" title="通知">
    <div>
      <el-input
        type="textarea"
        v-model="currentComment"
        placeholder="请输入通知内容"
        rows="4"
      ></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="noticedialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitNotice">提交</el-button>
    </span>
  </el-dialog>

  <el-dialog v-model="batchRatedialogVisible" title="評價">
    <div>
      <el-input
      type="number"
      v-model="batchScore"
      placeholder="请输入分数"
      >

      </el-input>
      <el-input
        type="textarea"
        v-model="batchComment"
        placeholder="请输入評價内容"
        rows="4"
      ></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="batchRatedialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitBatchRate">提交</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus';
import { ref, computed,onMounted } from 'vue';
import { Applicant } from '../api/base';
import { BatchOut } from '../api/modules/user';
import {SendNotice} from '../api/modules/notice';
import { Rate,GetRate } from '../api/modules/score';
import {useStore} from 'vuex';
const store = useStore();

onMounted(() => {
  fetchData();
});

const selectedFilter = ref('');
const secondaryFilter = ref('');
const showAllFilter = ref(false);

const noticedialogVisible = ref(false);
const dialogVisible = ref(false);
const batchRatedialogVisible = ref(false);
const currentRating = ref(0);
const batchScore = ref(0);
const currentComment = ref('');
const batchComment = ref('');
const currentMessage = ref('');
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

const multipleSelection = ref<Applicant[]>([]);  
const options = [
  { value: '学院', label: '学院' },
  { value: '专业', label: '专业' },
  { value: '方向', label: '方向' },
  { value: '进度', label: '进度' },
  { value: '淘汰情况', label: '淘汰情况' },
];
const filterOptions = computed(() => options);
const secondaryOptions = ref<any[]>([]);

const filtertype = (filter: string) => {
const uniqueValues = new Set<string>();
tableData.value.forEach((item:any) => {
  if (filter === '学院') {
    uniqueValues.add(item.college);
  } else if (filter === '专业') {
    uniqueValues.add(item.major);
  } else if (filter === '进度') {
    uniqueValues.add(item.stageName);
  } else if (filter === '淘汰情况') {
    uniqueValues.add(item.out ? '淘汰' : '未淘汰');
  } else if (filter === '方向') {
    uniqueValues.add(item.direction);
  }
});
return Array.from(uniqueValues).map(value => ({ value, label: value }));
};

const updateSecondaryOptions = () => {
if (selectedFilter.value) {
  secondaryOptions.value = filtertype(selectedFilter.value);
  showAllFilter.value = false;
} else {
  secondaryOptions.value = [];
  showAllFilter.value = false;
}
};

const showAll = () => {
selectedFilter.value = '';
secondaryFilter.value = '';
showAllFilter.value = true;
};
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
}))
);

const filteredTableData = computed(() => {
  if (showAllFilter.value) {
    return tableData.value;
}

let data = tableData.value;
if (selectedFilter.value && secondaryFilter.value) {
  switch (selectedFilter.value) {
  case '学院':
      data = data.filter((item:any) => item.college === secondaryFilter.value);
      break;
  case '方向':
      data = data.filter((item:any) => item.direction === secondaryFilter.value);
      break;
  default:
      break;
  }
}
return data;
});

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};

const fetchData = async () => {
  await store.dispatch('fetchApplicantsData');
};
const batchReject = async() => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请先选择要淘汰的用户');
    return;
  }
  try{
    const passedStudentIds = multipleSelection.value.map(item => item.userId);
    await BatchOut(store.state.token,passedStudentIds)
    fetchData();
    ElMessageBox.alert(`淘汰的用户ID有: ${passedStudentIds.join(', ')}`);
  }catch(error){
    if (error instanceof Error) {
      // 处理拦截器中抛出的错误
      ElMessageBox.alert(`提交通知失败。错误信息: ${error.message}`);
    } else {
      // 处理其他未知错误
      ElMessageBox.alert('提交通知失败，请检查网络或稍后重试');
    }
  }
};
const openDialog = (user: Applicant) => {
  currentUser.value = user;
  currentRating.value = 0;
  currentComment.value = '';
  dialogVisible.value = true;
};
const submitRating = async() => {
  try{
    await Rate(token.value,currentUser.value.userId,currentUser.value.stageId,currentRating.value,currentMessage.value)
    ElMessageBox.alert(`评价已提交: ${currentRating.value} 分，内容: ${currentComment.value}`);
    dialogVisible.value = false;

    //empty box
    currentRating.value = 0;
    currentMessage.value = '';
  }catch(error){
    //empty box
    currentRating.value = 0;
    currentMessage.value = '';
    if (error instanceof Error) {
      // 处理拦截器中抛出的错误
      ElMessageBox.alert(`提交通知失败。错误信息: ${error.message}`);
    } else {
      // 处理其他未知错误
      ElMessageBox.alert('提交通知失败，请检查网络或稍后重试');
    }
  }
};
const openNoticeDialog = () => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请先选择要通知的用户');
    return;
  }
  noticedialogVisible.value = true;
}
const submitNotice = async() => {
  try{
    const passedStudentIds = multipleSelection.value.map(item => item.phone);
    await SendNotice(passedStudentIds,currentComment.value,token.value)
    ElMessageBox.alert(`通知已提交: ${currentComment.value}`);
    noticedialogVisible.value = false;
    currentMessage.value = '';
  }catch(error){
    currentMessage.value = '';
    if (error instanceof Error) {
      // 处理拦截器中抛出的错误
      ElMessageBox.alert(`提交通知失败。错误信息: ${error.message}`);
    } else {
      // 处理其他未知错误
      ElMessageBox.alert('提交通知失败，请检查网络或稍后重试');
    }
  }
};
const openBatchRateDialog = () => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请先选择要评价的用户');
    return;
  }
  batchRatedialogVisible.value = true;
};
const submitBatchRate = async() => {
  //step1 初始化批量Rate请求
  const promises = multipleSelection.value.map(async (selection) => {
    try{
    await Rate(token.value,selection.userId,selection.stageId,batchScore.value,batchComment.value)
    return {
        userId: selection.userId,
        success: true,
      };
    }catch(error){
      if (error instanceof Error) {
        ElMessageBox.alert(`UserId ${selection.userId} 评价失败`, error);
      }
      return null;
    }
  });
  //执行所有Rate请求
  try {
    // 并发执行所有的请求
    const results = await Promise.all(promises);
    
    // 过滤掉失败的请求（返回 null 的请求）
    const validResults = results.filter(result => result !== null);
    console.log('成功处理的评价数量:', validResults.length);

    //empty box
    batchComment.value = '';
    batchScore.value = 0;
    const GetRatePromise = validResults.map(async(result) => {
      try {
        const rateResponse = await GetRate(token.value, result.userId);
        const rateData = rateResponse.data.data.scoreVoList[0];

        // 同步到 Vuex 中
        store.commit('setRate', {
          userId: result.userId,
          score: rateData.score,
          comment: rateData.comment,
        });

        return rateData;
      } catch (error) {
        if (error instanceof Error) {
          // 处理拦截器中抛出的错误
          ElMessageBox.alert(`提交通知失败。错误信息: ${error.message}`);
        }else{
          console.warn(`UserId ${result.userId} 的 Rate 数据获取失败`, error);
        }
        
        return null;
      }
    });
    // 批量获取最新 Rate 信息的请求
    const getRateResults = await Promise.all(GetRatePromise);

    // 过滤掉失败的获取请求
    const validGetRateResults = getRateResults.filter(result => result !== null);

    console.log('成功获取并同步的 Rate 数据数量:', validGetRateResults.length);
  } catch (error) {
    // 处理 Promise.all 本身的错误（如网络问题）
    console.error('批量请求过程中出现错误', error);
  }

  fetchData();
}

// 分页参数
const currentPage = ref(1);
const pageSize = ref(15);
const totalItems = computed(() => filteredTableData.value.length);

// 当前页的数据
const currentPageData = computed(() => {
const start = (currentPage.value - 1) * pageSize.value;
const end = start + pageSize.value;
return filteredTableData.value.slice(start, end);
});

function handlePageChange(page: number) {
currentPage.value = page;
}
</script>

<style>
</style>