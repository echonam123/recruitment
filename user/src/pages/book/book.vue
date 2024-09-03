<template>
  <h2 class="example-info">面试预约</h2>
  <view class="calendar-content" v-if="showCalendar">
    <uni-calendar
      :selected="info.selected"
      :showMonth="false"
      @change="handleDateChange"
      @monthSwitch="handleMonthSwitch"
      :availableDates="availableDates"
    />
  </view>
  <view>
    <uni-popup ref="popup" type="bottom" :animation="false">
      <view class="button-text">
        <view class="time-slots">
          <view
            v-for="(slot, index) in filteredTimeSlots"
            :key="index"
            class="time-slot"
            :class="{ selected: selectedSlotIndex === index }"
            @click="reserveSlot(index)"
          >
            <text>{{ slot.startTime }} - {{ slot.endTime }}</text>
            <text>{{ slot.remaining }}/{{ slot.capacity }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>
<script>
import { http } from '@/utils/http'; // 导入封装的 http 方法

export default {
  data() {
    return {
      timeSlots: [], // 动态请求的时间段
      filteredTimeSlots: [], // 过滤后的时间段
      showCalendar: false,
      info: {
        lunar: true,
        range: true,
        insert: false,
        selected: [],
      },
      availableDates: [], // 动态请求的可预约日期
      selectedDate: "",
      selectedSlotIndex: null, // 当前选中的时间段索引
      bookedSlots: {}, // 用于跟踪每一天的已预约时间段
      previousSlotIndex: null, // 上一次点击的时间段索引
    };
  },
  onReady() {
    this.$nextTick(() => {
      this.showCalendar = true;
    });

    this.fetchDetails()
      .then(details => {
        const { direction, stageId } = details;
        this.fetchAppointmentData(direction, stageId);
      })
      .catch(error => {
        console.error('获取阶段和方向失败:', error);
      });

    this.info.date = getDate(new Date(), -30).fullDate;
    this.info.startDate = getDate(new Date(), -60).fullDate;
    this.info.endDate = getDate(new Date(), 30).fullDate;
    this.info.selected = [];
  },
  methods: {
    // 获取阶段和方向id
    fetchDetails() {
      return http({
        url: '/user/user',
        method: 'GET'
      })
      .then(response => {
        return {
          direction: response.direction,
          stageId: response.stageId
        };
      })
      .catch(error => {
        console.error('获取阶段和方向失败:', error);
        throw error;
      });
    },
    // 获取预约时间,预约容量和剩余预约席位
    fetchAppointmentData(direction, stageId) {
      return http({
        url: '/interview/get',
        data: {
          stageId: stageId,
          direction: direction
        },
        method: 'GET'
      })
      .then(response => {
        console.log(response)// 假设服务器返回的数据包含 timeSlots
        this.timeSlots = response;
console.log(this.timeSlots)
const uniqueDates = [...new Set(this.timeSlots.map(slot => slot.startTime.split('T')[0]))];
console.log(uniqueDates)
this.availableDates = uniqueDates;
this.info.selected = uniqueDates.map(date => ({
      date: date,
      info: '可预约'
    }))
console.log('更新后的 info.selected:', this.info.selected);
      })
      .catch(error => {
        console.error('获取预约数据失败:', error);
      });
    },
    handleDateChange(e) {
  const selectedDate = e.fulldate;
  if (this.availableDates.includes(selectedDate)) {
    this.selectedDate = selectedDate;

    // 过滤出选中日期的时间段
    this.filteredTimeSlots = this.timeSlots.filter(slot => slot.startTime.split('T')[0] === selectedDate);

    // 更新 this.info.selected，确保只更新当前选择的日期
    this.info.selected = this.availableDates.map(date => ({
      date: date,
      info: date === selectedDate ? '可预约' : '不可预约'
    }));

    // 打开弹出层展示时间段
    this.$refs.popup.open("bottom");
  } else {
    uni.showToast({
      title: "此日期不可预约",
      icon: "none",
    });
  }
},
    handleMonthSwitch(e) {
      console.log("monthSwitch 返回:", e);
    },
    reserveSlot(index) {
      const slot = this.filteredTimeSlots[index];
      if (!slot) {
        console.error("无效的时间段索引:", index);
        return;
      }

      const existingSlotIndex = this.bookedSlots[this.selectedDate];

      if (this.previousSlotIndex !== null && this.previousSlotIndex === index) {
        // 如果是同一个时间段，则取消预约
        this.cancelReservation(index);
        this.previousSlotIndex = null; // 重置之前的时间段索引
        return;
      }

      // 取消之前的预约
      if (existingSlotIndex !== undefined && existingSlotIndex !== null) {
        const previousSlot = this.filteredTimeSlots[existingSlotIndex];
        if (previousSlot) {
          previousSlot.remaining++;
        }
        this.bookedSlots[this.selectedDate] = null;
      }

      // 更新预约
      if (slot.remaining > 0) {
        slot.remaining--;
        this.bookedSlots[this.selectedDate] = index;
        uni.showToast({
          title: "时间段已选择",
          icon: "success",
        });
        this.previousSlotIndex = index; // 记录当前时间段索引
      } else {
        uni.showToast({
          title: "此时间段已满",
          icon: "none",
        });
      }
    },
    cancelReservation(index) {
      const slot = this.filteredTimeSlots[index];
      slot.remaining++;
      this.bookedSlots[this.selectedDate] = null;
      uni.showToast({
        title: "预约已取消",
        icon: "success",
      });
    }
  },
};

function getDate(date, AddDayCount = 0) {
  if (!date) {
    date = new Date();
  }
  if (typeof date !== "object") {
    date = date.replace(/-/g, "/");
  }
  const dd = new Date(date);

  dd.setDate(dd.getDate() + AddDayCount); // 获取 AddDayCount 天后的日期

  const y = dd.getFullYear();
  const m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足 10 补 0
  const d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); // 获取当前几号，不足 10 补 0
  return {
    fullDate: y + "-" + m + "-" + d,
    year: y,
    month: m,
    date: d,
    day: dd.getDay(),
  };
}
</script>

<style>
.example-info {
  text-align: center;
  background: linear-gradient(90deg, #f67252, #92fa7d);
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 26px;
  margin-top: 20px;
}

.button-text {
  background-color: #fff;
  color: #100f0f;
  font-size: 12px;
  height: 350px;
  width: 100%;
  margin-bottom: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.time-slots {
  margin-top: 10px; 
}

.time-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background-color: #f7f7f7;
  border-radius: 5px;
  cursor: pointer;
}

.time-slot:hover {
  background-color: #eaeaea;
}
</style>