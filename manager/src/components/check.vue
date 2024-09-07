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
  <el-divider content-position="center">报名人员</el-divider>
  <el-table :data="filteredTableData" border style="width: 100%">
    <el-table-column prop="name" label="Name" width="130" />
    <el-table-column prop="college" label="College" width="130" />
    <el-table-column prop="className" label="ClassName" width="130" />
    <el-table-column prop="studentId" label="StudentId" width="180" />
    <el-table-column prop="direction" label="Direction" width="130" />
    <el-table-column prop="stageName" label="StageName" width="130" />
    <el-table-column prop="phone" label="Phone" width="180" />
    <el-table-column prop="introduction" label="Introduction" />
    <el-table-column prop="out" label="Out" width="130" />
  </el-table>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { request} from '../untils/request';
interface TableDataItem {
[x: string]: any;
  college: string
  className: string
  out: string
  direction: string
  stageName:string
}
const selectedFilter = ref('')
const secondaryFilter = ref('')
const showAllFilter = ref(false)
const filterOptions = ref([
  { value: '学院', label: '学院' },
  { value: '专业', label: '专业' },
  { value: '方向', label: '方向' },
  { value: '进度', label: '进度' },
  { value: '淘汰情况', label: '淘汰情况' },
])
const secondaryOptions = ref<any[]>([])
const tableData = ref<any[]>([])
const fetchTableData = async () => {
  try {
    const response = await request<TableDataItem>({
      method: 'POST',
      url: '/user/select',
      data: {
        "college": null,
        "major": null,
        "stageId": null,
        "isOut": null
      }
    })
    response.forEach((item: any) => {
      tableData.value.push(item);
    })
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}
const filtertype = (filter: string) => {
  const uniqueValues = new Set<string>()
  tableData.value.forEach(item => {
    if (filter === '学院') {
      uniqueValues.add(item.college)
    } else if (filter === '专业') {
      uniqueValues.add(item.className)
    } else if (filter === '进度') {
      uniqueValues.add(item.stageName)
    } else if (filter === '淘汰情况') {
      uniqueValues.add(item.out);
    } else if (filter === '方向') {
      uniqueValues.add(item.direction)
    }
  });
  return Array.from(uniqueValues).map(value => ({ value, label: value }));
}

const updateSecondaryOptions = () => {
  if (selectedFilter.value) {
    secondaryOptions.value = filtertype(selectedFilter.value);
    showAllFilter.value = false // 更新筛选条件时关闭“展示全部”状态
  } else {
    secondaryOptions.value = []
    showAllFilter.value = false// 选择的筛选条件为空时，关闭“展示全部”状态
  }
}

const showAll = () => {
  selectedFilter.value = ''
  secondaryFilter.value = ''
  showAllFilter.value = true
}

const filteredTableData = computed(() => {
  if (showAllFilter.value) {
    return tableData.value;
  }
  
  let data = tableData.value;
  if (selectedFilter.value && secondaryFilter.value) {
    switch (selectedFilter.value) {
      case '学院':
        data = data.filter(item => item.college === secondaryFilter.value);
        break
      case '专业':
        data = data.filter(item => item.className === secondaryFilter.value);
        break
      case '进度':
        data = data.filter(item => item.stageName === secondaryFilter.value);
        break
      case '淘汰情况':
        data = data.filter(item => item.out === secondaryFilter.value);
        break
      case '方向':
        data = data.filter(item => item.direction === secondaryFilter.value);
        break
      default:
        break
    }
  }
  return data
})

// 获取数据
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped></style>
