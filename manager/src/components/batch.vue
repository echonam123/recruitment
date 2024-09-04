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
    <!-- <el-button type="primary" @click="batchPass">批量通过</el-button> -->
    <el-button type="danger" @click="batchReject">批量淘汰</el-button>
  </div>
  <el-dialog v-model="dialogVisible" title="评价">
    <div>
      <el-input type="number" v-model="currentRating" placeholder="输入分数"></el-input>
      <el-input
        type="textarea"
        v-model="currentComment"
        placeholder="请输入评价内容"
        rows="4"
      ></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitRating">提交</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus';
import { ref, computed } from 'vue';
import { Applicant } from '../api/base';
import { BatchOut } from '../api/modules/user';
import { Rate } from '../api/modules/score';
import {useStore} from 'vuex';
const store = useStore();

const selectedFilter = ref('');
const secondaryFilter = ref('');
const showAllFilter = ref(false);

const dialogVisible = ref(false);
const currentRating = ref(0);
const currentComment = ref('');
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
tableData.value.forEach(item => {
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
rawData.value.map(item => ({
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
      data = data.filter(item => item.college === secondaryFilter.value);
      break;
  case '方向':
      data = data.filter(item => item.direction === secondaryFilter.value);
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

const batchReject = async() => {
  if (multipleSelection.value.length === 0) {
    ElMessageBox.alert('请先选择要通过的用户');
    return;
  }
  try{
    const passedStudentIds = multipleSelection.value.map(item => item.studentId);
    const response = await BatchOut(store.state.token,passedStudentIds)
    ElMessageBox.alert(`通过的用户ID有: ${passedStudentIds.join(', ')}`);
  }catch{
    ElMessageBox.alert('操作失败，请重试')
  }
};

const openDialog = (user: Applicant) => {
  currentUser.value = user;
  currentRating.value = 0;
  currentComment.value = '';
  dialogVisible.value = true;
};

const submitRating = async() => {
  // if (currentUser.value) {
  //   ElMessageBox.alert(`评价已提交: ${currentRating.value} 分，内容: ${currentComment.value}`);
  //   dialogVisible.value = false;
  // }
  try{
    const response = await Rate(token.value,currentUser.value.userId,currentUser.value.stageId,currentRating.value,currentComment.value)
    ElMessageBox.alert(`评价已提交: ${currentRating.value} 分，内容: ${currentComment.value}`);
    dialogVisible.value = false;
  }catch{
    ElMessageBox.alert('提交评价失败，请重试');
  }
};

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