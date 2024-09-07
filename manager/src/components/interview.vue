<template>
  <div>
    <el-divider content-position="center">预约管理</el-divider>
    <el-row>
      <el-col :span="3">
        <el-form-item label="预约方向" style="margin-bottom: 0;">
          <el-select v-model="form.direction" placeholder="选择预约方向" style="width: 100px;">
            <el-option label="前端" value="1"></el-option>
            <el-option label="后端" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="预约阶段" style="margin-bottom: 0;">
          <el-select v-model="form.stageid" placeholder="选择预约阶段" style="width: 100px;">
            <el-option label="面试" value="1"></el-option>
            <el-option label="一轮" value="2"></el-option>
            <el-option label="二轮" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="text-align:center;">
        <el-button type="primary" @click="showDialog = true">添加预约时间</el-button>
      </el-col>
      <el-col :span="3" style="text-align:left;">
        <el-button type="primary" @click="getInterview()">展示对应预约情况</el-button>
      </el-col>
    </el-row>

    <!-- 表单部分 -->
    <el-dialog
      :append-to-body="true"
      title="添加预约时间"
      width="30%"
      v-model="showDialog"
      style="height: 300px"
    >
      <el-form>
        <el-form-item label="预约开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择预约开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预约结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择预约结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预约人数">
          <el-input
            v-model.number="form.capacity"
            type="number"
            placeholder="输入预约人数"
            style="width: 220px; margin-left: 12px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="addAppointment">确定</el-button>
      </div>
    </el-dialog>
   <!-- 表格部分 -->
<el-table :data="appointments" v-loading="loading"  style="width: 100%">
  <el-table-column prop="startTime" label="预约开始时间"></el-table-column>
  <el-table-column prop="endTime" label="预约结束时间"></el-table-column>
  <el-table-column label="预约人数情况">
    <template v-slot="scope">
      {{ scope.row.capacity - scope.row.remaining }}/{{ scope.row.capacity }}
    </template>
  </el-table-column>
  <el-table-column label="预约用户信息">
  <template v-slot="scope">
    <el-button @click="showUserDetails(scope.row.timeId)">
     点击查看详情
    </el-button>
  </template>
</el-table-column>
  <el-table-column label="操作" width="100">
    <template v-slot="scope">
      <el-button
        type="danger"
        size="small"
        @click="deleteAppointment(scope.row.timeId)"
      >
        删除
      </el-button>
    </template>
  </el-table-column>
</el-table>
</div>
<el-dialog
  :append-to-body="true"
  title="用户详细信息"
  width="50%"
  v-model="userDetailsDialog"
>
  <el-table :data="userDetails" style="width: 100%">
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="college" label="学院"></el-table-column>
    <el-table-column prop="major" label="专业"></el-table-column>
    <el-table-column prop="className" label="班级"></el-table-column>
    <el-table-column prop="phone" label="邮箱"></el-table-column>
    <el-table-column prop="introduction" label="介绍" width="220"></el-table-column>
  </el-table>
  <div slot="footer">
    <el-button @click="userDetailsDialog = false">关闭</el-button>
  </div>
</el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { request } from '../untils/request';
const loading = ref(false);
interface InterviewResponse {
  [x: string]: any
  startTime: string
  endTime: string;
  capacity: number;
  name: string;
  timeId: string; 
}

interface Appointment {
  timeId: string; 
  startTime: string;
  endTime: string;
  capacity: number;
  remaining: number;
  name: string;
}
interface usersInfo{
[x: string]: any;
  college: string,
  major:string,
   className: string,
      name: string,
      studentId: string,
      phone: string,
      introduction: string
}
const form = ref({
  startTime: '',
  endTime: '',
  capacity: 0,
  stageid: -1,
  direction: -1
});
const appointments = ref<Appointment[]>([]);
const showDialog = ref(false)
const userDetails = ref<any[]>([])
const userDetailsDialog = ref(false)

async function showUserDetails(timeId: string) {
  const users = await getUserDetails(timeId)
  userDetails.value = users.map((item: any) => ({
      college: item.college,
      major: item.major,
      className: item.className,
      name: item.name,
      phone: item.phone,
      introduction: item.introduction
    }))
  userDetailsDialog.value = true
}
//将预约时间格式化
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//添加预约时间
async function addAppointment() {
  if (
    form.value.startTime &&
    form.value.endTime &&
    form.value.capacity > 0 &&
    form.value.stageid >= 0 &&
    new Date(form.value.startTime) < new Date(form.value.endTime)
  ) {
    const startTimeDate = new Date(form.value.startTime);
    const endTimeDate = new Date(form.value.endTime);

    const formattedStartTime = formatDate(startTimeDate);
    const formattedEndTime = formatDate(endTimeDate);
    const requestData = {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      capacity: form.value.capacity,
      stageId: form.value.stageid,
      direction: form.value.direction
    }

    try {
      await request({
        method: 'POST',
        url: '/interview/set',
        data: requestData,
      })
        form.value.startTime = ''
        form.value.endTime = ''
        form.value.capacity = 0
        showDialog.value = false
        await getInterview();
        alert('添加预约时间成功！')
    } catch (error) {
      console.error('添加预约失败:', error)
    }
  } else {
    alert('请填写所有字段，并确保开始时间早于结束时间')
  }
}
//获取预约时间段和人数
async function getInterview() {
  loading.value = true; 
  const requestData = {
    stageId: form.value.stageid,
    direction: form.value.direction
  }
  try {
    const response = await request({
      method: 'GET',
      url: '/interview/get',
      params: requestData
    }) as {
[x: string]: any; data: InterviewResponse[] 
};
    if (response) {
      appointments.value = response.map((item: { timeId: any; startTime: string; endTime: string; capacity: any; remaining: any; name: any; }) => ({
        timeId: item.timeId,
        startTime: item.startTime.replace('T', ' '),
          endTime: item.endTime.replace('T', ' '),
        capacity: item.capacity,
        remaining: item.remaining,
        name: item.name
      }))
    loading.value = false
    } else {
      appointments.value = []
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}
//删除预约时间
async function deleteAppointment(timeId: string) {
  console.log(timeId)
  try {
    const response = await request({
      method: 'DELETE',
      url: `/interview/${timeId}`,
    })
    if (response) {
      await getInterview()
      alert('删除成功')
    } else {
      alert('删除失败，请稍后再试')
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}
//获取预约了改时间的所有用户信息
async function getUserDetails(timeId: string) {
  try {
    const response = await request({
      method: 'GET',
      url: `/interview/${timeId}`,
    })as usersInfo
    if (response) {
      userDetails.value=[]
      return response;
    } else {
      console.error('获取用户信息失败')
      return []
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return []
  }
}

</script>


<style scoped></style>
