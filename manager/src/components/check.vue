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
  <el-table :data="filteredTableData" border style="width: 100%">
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="college" label="College" width="180" />
    <el-table-column prop="class" label="Class" width="180" />
    <el-table-column prop="studentId" label="StudentId" width="180" />
    <el-table-column prop="direction" label="Direction" width="180" />
    <el-table-column prop="phone" label="Phone" width="180" />
    <el-table-column prop="introduction" label="Introduction" />
  </el-table>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
const selectedFilter = ref('');
const secondaryFilter = ref('');
const showAllFilter = ref(false);
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
      uniqueValues.add(item.class);
    } else if (filter === '进度') {
      uniqueValues.add(item.progress);
    } else if (filter === '淘汰情况') {
      uniqueValues.add(item.eliminationStatus);
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
  } else {
    secondaryOptions.value = [];
  }
};
//展示所有报名学生
const showAll = () => {
  selectedFilter.value = '';
  secondaryFilter.value = '';
  showAllFilter.value = true;
};
const tableData = ref([
    {
      name: '张三',
      college: '计算机学院',
      class: '软件工程',
      studentId: '2021001',
      direction: '前端开发',
      phone: '12345678901',
      introduction: '对前端开发非常感兴趣，参与过多个项目。',
      progress: '已完成',
      eliminationStatus: '未淘汰'
    },
    {
      name: '李四',
      college: '计算机学院',
      class: '人工智能',
      studentId: '2021002',
      direction: '机器学习',
      phone: '12345678902',
      introduction: '专注于机器学习领域，拥有一定的项目经验。',
      progress: '进行中',
      eliminationStatus: '未淘汰'
    },
    {
      name: '王五',
      college: '经济管理学院',
      class: '金融学',
      studentId: '2021003',
      direction: '金融分析',
      phone: '12345678903',
      introduction: '金融分析领域有较强的背景知识。',
      progress: '已完成',
      eliminationStatus: '已淘汰'
    },
    {
      name: '赵六',
      college: '经济管理学院',
      class: '市场营销',
      studentId: '2021004',
      direction: '市场策略',
      phone: '12345678904',
      introduction: '对市场策略有深入研究。',
      progress: '进行中',
      eliminationStatus: '未淘汰'
    }
  ]);
//渲染表格内容
const filteredTableData = computed(() => {
    //初始数据渲染
  if (showAllFilter.value) {
    return tableData.value; 
  }
  //根据一，二次筛选的关键词，将数据改为对应数据
  let data = tableData.value;
  switch (selectedFilter.value) {
    case '学院':
      data = data.filter(item => item.college === secondaryFilter.value);
      break;
    case '专业':
      data = data.filter(item => item.class === secondaryFilter.value);
      break;
    case '进度':
      data = data.filter(item => item.progress === secondaryFilter.value);
      break;
    case '淘汰情况':
      data = data.filter(item => item.eliminationStatus === secondaryFilter.value);
      break;
    case '方向':
      data = data.filter(item => item.direction === secondaryFilter.value);
      break;
    default:
      break;
  }
  return data;
});
</script>
