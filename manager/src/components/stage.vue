<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column fixed prop="stageName" label="阶段名称" width="150" />
    <el-table-column prop="startTime" label="开始时间" width="120" />
    <el-table-column prop="endTime" label="结束时间" width="120" />
    <el-table-column label="状态" width="180">
      <template #default="scope">
          <el-tag>{{ scope.row.stageName }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(scope.$index)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button class="mt-4" style="width: 100%" @click="onAddItem">
    Add Item
  </el-button>
</template>
    
<script lang='ts' setup name='stage'>
import { ref } from 'vue'
import { request } from '../untils/request';
  function onAddItem() {
    console.log(111)
    console.log('添加阶段');
  }

  function deleteRow(e:any){
    console.log('删除阶段');
    console.log(e)
}
getAllStage()
async function getAllStage() {
  let res = await request({
    url: 'stage/listStage',
    method: 'GET'
  })
  console.log(res)
}

let tableData = ref([
        {
            "stageId": 1,
            "startTime": "2024-08-14T17:45:36",
            "endTime": "2024-07-30T17:45:32",
            "stageName": "报名"
        },
        {
            "stageId": 3,
            "startTime": "2030-10-01T11:00:00",
            "endTime": "2040-10-01T11:00:00",
            "stageName": "面试"
        },
        {
            "stageId": 4,
            "startTime": "2050-10-01T10:00:00",
            "endTime": "2060-10-01T10:00:00",
            "stageName": "哈哈哈哈哈哈哈哈哈哈哈哈"
        },
        {
            "stageId": 5,
            "startTime": "2025-12-16T12:00:00",
            "endTime": "2026-12-16T12:00:00",
            "stageName": "二轮答辩"
        }
    ])
    
</script>
    
<style scoped>
    
</style>