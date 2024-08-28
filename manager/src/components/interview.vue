<template>
  <div>
    <el-divider content-position="center">预约管理</el-divider>

    <!-- 添加预约时间按钮 -->
    <el-button type="primary" @click="showDialog = true"
      >添加预约时间</el-button
    >
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
        <el-form-item label="预约总人数">
          <el-input
            v-model.number="form.totalPeople"
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
    <el-table :data="appointments" style="width: 100%">
      <el-table-column prop="startTime" label="预约开始时间"></el-table-column>
      <el-table-column prop="endTime" label="预约结束时间"></el-table-column>
      <el-table-column prop="totalPeople" label="预约总人数"></el-table-column>
      <el-table-column prop="name" label="预约用户姓名"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";

interface Appointment {
  startTime: string;
  endTime: string;
  totalPeople: number;
  name: string;
}

const form = ref({
  startTime: "",
  endTime: "",
  totalPeople: 0,
});

const appointments = ref<Appointment[]>([]);
const showDialog = ref(false);

async function fetchUserName(
  startTime: string,
  endTime: string
): Promise<string> {
  try {
    const response = await axios.get("/api/getUserName", {
      params: { startTime, endTime },
    });
    console.log(111);
    return response.data.name;
  } catch (error) {
    console.error("获取用户姓名失败:", error);
    return "未知用户";
  }
}

async function addAppointment() {
  if (
    form.value.startTime &&
    form.value.endTime &&
    form.value.totalPeople > 0 &&
    new Date(form.value.startTime) < new Date(form.value.endTime)
  ) {
    const userName = await fetchUserName(
      form.value.startTime,
      form.value.endTime
    );

    appointments.value.push({
      startTime: form.value.startTime,
      endTime: form.value.endTime,
      totalPeople: form.value.totalPeople,
      name: userName,
    });

    // 清空表单
    form.value.startTime = "";
    form.value.endTime = "";
    form.value.totalPeople = 0;
    showDialog.value = false;
  } else {
    alert("请填写所有字段，并确保开始时间早于结束时间");
  }
}
</script>

<style scoped></style>
