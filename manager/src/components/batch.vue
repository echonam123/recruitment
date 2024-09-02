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
  
    <div style="margin: 20px;">
        <el-button type="primary" @click="batchPass">批量通过</el-button>
        <el-button type="danger" @click="batchReject">批量淘汰</el-button>
    </div>

    <el-table
      :data="filteredTableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="college" label="College" width="180" />
      <el-table-column prop="studentId" label="StudentId" width="180" />
      <el-table-column prop="direction" label="Direction" width="180" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button type="primary" @click="openDialog(scope.row)">评价</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <el-dialog v-model="dialogVisible" title="评价">
      <div>
        <el-rate v-model="currentRating"></el-rate>
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
  
  const selectedFilter = ref('');
  const secondaryFilter = ref('');
  const showAllFilter = ref(false);
  
  const dialogVisible = ref(false);
  const currentRating = ref(0);
  const currentComment = ref('');
  const currentUser = ref<any>(null);
  
  const multipleSelection = ref([]);
  
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
  
  const tableData = ref([
    {
      name: '张三',
      college: '计算机学院',
      studentId: '2021001',
      direction: '前端开发',
    },
    {
      name: '李四',
      college: '计算机学院',
      studentId: '2021002',
      direction: '机器学习',
    },
    {
      name: '王五',
      college: '经济管理学院',
      studentId: '2021003',
      direction: '金融分析',
    },
    {
      name: '赵六',
      college: '经济管理学院',
      studentId: '2021004',
      direction: '市场策略',
    },
  ]);
  
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
  
  const batchPass = () => {
    ElMessageBox.alert(`通过的用户有: ${multipleSelection.value.map(item => item.name).join(', ')}`);
  };
  
  const batchReject = () => {
    ElMessageBox.alert(`淘汰的用户有: ${multipleSelection.value.map(item => item.name).join(', ')}`);
  };
  
  const openDialog = (user: any) => {
    currentUser.value = user;
    currentRating.value = 0;
    currentComment.value = '';
    dialogVisible.value = true;
  };
  
  const submitRating = () => {
    if (currentUser.value) {
      ElMessageBox.alert(`评价已提交: ${currentRating.value} 星，内容: ${currentComment.value}`);
      dialogVisible.value = false;
    }
  };
  </script>
  
  <style>
  </style>