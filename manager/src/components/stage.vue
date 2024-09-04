<template>
  <el-button link type="primary"  size="large" @click.prevent="refresh"  > 刷新 </el-button>
  <el-table v-loading="loading" :data="tableData" style="width: 100%">
    <!-- 阶段名称 -->
    <el-table-column fixed label="阶段名称" width="150" >
      <template #default="scope">
        <el-input v-if="scope.row.isEditing" v-model.lazy="scope.row.stageName" placeholder="input stageName" clearable />
        <span v-else>{{ scope.row.stageName }}</span>
      </template>
    </el-table-column>
    <!-- 阶段时间 -->
    <el-table-column label="开始时间" width="250" >
      <template #default="scope">
        <el-date-picker
        v-if="scope.row.isEditing"
        v-model.lazy="scope.row.startTime"
        type="datetime"
        placeholder="Select startTime"
      />
      <span v-else>{{ scope.row.startTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结束时间" width="250" >
      <template #default="scope">
        <el-date-picker
        v-if="scope.row.isEditing"
        v-model.lazy="scope.row.endTime"
        type="datetime"
        placeholder="Select endTime"
      />
      <span v-else>{{ scope.row.endTime }}</span>
      </template>
    </el-table-column>
    <!-- 阶段状态 -->
    <el-table-column label="状态" width="180">
      <template #default="scope">
          <el-tag :type="scope.row.status ==='启动中'?'primary':'info'">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <!-- 操作 -->
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <div v-if="scope.row.isEditing">
          <el-button link  type="primary" size="small" @click.prevent="confirmEdit(scope.row)">确定</el-button>
          <el-button link type="primary"size="small"@click.prevent="cancelEdit(scope.row)"> 取消 </el-button>
        </div>
        <!-- 展示时按钮 -->
        <div v-else>
        <!-- 编辑 -->
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="scope.row.isEditing = true"
        >
          Edit
        </el-button>
        <!-- 删除 -->
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(scope.row.stageId)"
        >
          Remove
        </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- 新增阶段按钮 -->
  <el-button class="mt-4" style="width: 100%" plain @click="dialogVisible = true">
    Add Item
  </el-button>
  <!-- 阶段新增对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="新增阶段信息"
    width="500"
  >
    <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="阶段名称">
      <el-input v-model="form.stageName" />
    </el-form-item>
  <el-form-item label="阶段时间">
    <el-date-picker
      v-model="form.time"
      type="datetimerange"
      range-separator="To"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      value-format="YYYY-MM-DD HH:mm:ss"
    />
    </el-form-item>
  </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="addItem">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
    
<script lang='ts' setup name='stage'>
import { ref } from 'vue'
import { request } from '../untils/request';
import dayjs from 'dayjs'
//loading加载
let loading = ref(true)
let isFresh = ref(false)
//刷新重新发送请求
async function refresh() {
  if (!isFresh.value) {
    isFresh.value = true
    await getAllStage()
    isFresh.value = false
  }
}
//获取阶段信息
let tableData:any = ref([])
getAllStage()
interface myStage{
  stageId: number,
  stageName: string,
  startTime:string,
  endTime:string
}
//判断如今所处阶段
function checkStatus(startTime:any,endTime:any) {
  let nowTemp = new Date()
  startTime = new Date(startTime).getTime()
  endTime = new Date(endTime).getTime()
  if (nowTemp >= startTime && nowTemp < endTime) {
    console.log('启动中');
    return '启动中'
  } else {
    return '未启动'
  }
}
async function getAllStage() {
  loading.value=true
  tableData.value = []
  try {
    let res = await request<myStage[]>({
      url: 'stage/listStage',
      method: 'GET'
    })
    res.forEach(ele => {
      tableData.value.push({
        stageId: ele.stageId,
        stageName: ele.stageName,
        startTime:ele.startTime.split('T')[0],
        endTime: ele.endTime.split('T')[0],
        status: checkStatus(ele.startTime, ele.endTime),
        isEditing:false
      })
    })
    loading.value = false
  } catch (err) {
    ElMessage({
      showClose: true,
      message: `${err}`,
      type: 'error',
      duration:2000
    })
  }
}

//新增阶段信息对话框
let dialogVisible = ref(false)
let form = ref({
  stageName: '',
  startTime: '',
  endTime: '',
  time:''
})
async function addItem() {
  form.value.startTime = dayjs(form.value.time[0]).format('YYYY-MM-DD HH:mm:ss')
  form.value.endTime = dayjs(form.value.time[1]).format('YYYY-MM-DD HH:mm:ss')
  if (form.value.stageName == '' || form.value.startTime == '' || form.value.endTime == '') {
    ElMessage({
      showClose: true,
      message: '阶段信息不全',
      type: 'error',
    })
    return
  }
  //发送新增阶段信息请求
  try {
     await request({
    url: 'stage/new',
    method: 'POST',
    data: {
      stageName:form.value.stageName,
      startTime:form.value.startTime,
      endTime:form.value.endTime
    }
  })
  clearForm()
  getAllStage()
  dialogVisible.value = false
  } catch (err) {
    ElMessage({
      showClose: true,
      message: `${err}`,
      type: 'error',
    })
  }
}
function clearForm() {
  form.value = {
    stageName: '',
    startTime: '',
    endTime: '',
    time:''
  }
}

//删除阶段
async function deleteRow(id:number){
  try {
    await request({
    url: `stage/${id}`,
    method:'DELETE'
    })
    getAllStage()
  } catch (err) {
     ElMessage({
      showClose: true,
      message: `${err}`,
      type: 'error',
    })
  }
}

//修改阶段
interface rowData{
  stageId: number,
  stageName: string,
  startTime:string,
  endTime: string,
  status: string,
  isEditing:boolean
}
async function confirmEdit(row: rowData) {
  //确定修改
  row.startTime = dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss')
  row.endTime = dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')
 if (row.stageName == '' || row.startTime == '' || row.endTime == '') {
    ElMessage({
      showClose: true,
      message: '阶段信息不全',
      type: 'error',
    })
    return
  }
  try {
    await request({
    url: 'stage/updateStage',
    method: 'POST',
    data: {
      stageId: row.stageId,
      startTime: row.startTime,
      endTime: row.endTime,
      stageName:row.stageName
    }
  })
  getAllStage()
  row.isEditing = false
  } catch (err) {
    ElMessage({
      showClose: true,
      message: `${err}`,
      type: 'error',
    })
  }
}
function cancelEdit(row: rowData) {
  //取消修改
  getAllStage()
  row.isEditing = false
}

    
</script>
    
<style scoped>
    
</style>