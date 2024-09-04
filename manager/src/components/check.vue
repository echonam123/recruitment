<template>
  <!-- <el-select
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
  </el-select> -->
  <!-- <el-button @click="showAll">Show All</el-button> -->
  <div>
    <el-input
      v-model="nameFilter"
      placeholder="输入姓名（可选）"
      clearable
      style="width: 160px; margin-right: 10px;"
    />
    <el-input
      v-model="nameFilter"
      placeholder="输入学号（可选）"
      clearable
      style="width: 160px; margin-right: 10px;"
    />
    <el-select
      v-model="collegeFilter"
      placeholder="选择学院"
      clearable
      style="width: 180px; margin-right: 10px;"
    >
      <el-option
        v-for="item in colleges"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="majorFilter"
      placeholder="选择专业"
      clearable
      style="width: 180px; margin-right: 10px;"
    >
      <el-option
        v-for="item in majors"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="statusFilter"
      placeholder="选择状态"
      clearable
      style="width: 180px; margin-right: 10px;"
    >
      <el-option
        v-for="item in statuses"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button @click="search">搜索</el-button>
    <el-button @click="resetFilters">重置</el-button>
  </div>
  <el-divider content-position="center">查看报名人员</el-divider>
  <el-table :data="filteredTableData" border style="width: 100%">
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="college" label="学院" width="180" />
    <el-table-column prop="className" label="班级" width="180" />
    <el-table-column prop="studentId" label="序号" width="180" />
    <el-table-column prop="direction" label="方向" width="180" />
    <el-table-column prop="phone" label="邮箱" width="180" />
    <el-table-column prop="introduction" label="简介" width="180" />
    <el-table-column prop="stageName" label="进度" width="100" />
    <el-table-column prop="out" label="是否淘汰" width="85" />


  </el-table>
</template>
<script lang="ts" setup>
// import { ElMessageBox,ElDialog } from 'element-plus';
import { ref, computed } from 'vue';
import { Applicant } from '../api/base';
import { onMounted } from 'vue';
import 'element-plus/dist/index.css';
import store from '../store';

const selectedFilter = ref('');
const secondaryFilter = ref('');
const showAllFilter = ref(false);

const rawData = computed(() => {
  return store.state.rawData; // 引用 Vuex 状态
});

const tableData = computed(() =>
  rawData.value.map(item => ({
    ...item,
    direction: getDirectionText(item.direction),
    out: item.out ? '是' : '否',
  }))
);

const options = [
  { value: '学院', label: '学院' },
  { value: '专业', label: '专业' },
  { value: '方向', label: '方向' },
  { value: '进度', label: '进度' },
  { value: '淘汰情况', label: '淘汰情况' },
];
const filterOptions = computed(() => options);//一次选择
const secondaryOptions = ref<any[]>([]);//二次筛选容器
//过滤去重
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
//更新二次筛选重的选项
const updateSecondaryOptions = () => {
  if (selectedFilter.value) {
    secondaryOptions.value = filtertype(selectedFilter.value);
    showAllFilter.value = false; // 更新筛选条件时关闭“展示全部”状态
  } else {
    secondaryOptions.value = [];
    showAllFilter.value = false; // 选择的筛选条件为空时，关闭“展示全部”状态
  }
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
//展示所有报名学生
const showAll = () => {
  selectedFilter.value = '';
  secondaryFilter.value = '';
  showAllFilter.value = true;
};
//渲染表格内容
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
</script>

<style>

</style>
