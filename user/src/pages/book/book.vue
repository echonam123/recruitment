<template>
  <h2 class="example-info">面试预约</h2>
  <view class="calendar-content" v-if="showCalendar">
    <!-- 插入模式 -->
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
            v-for="(slot, index) in timeSlots"
            :key="index"
            class="time-slot"
            :class="{ selected: selectedSlotIndex === index }"
            @click="reserveSlot(index)"
          >
            <text>{{ slot.time }}</text>
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
    
    this.fetchdetails()
      .then(details => {
      console.log(details)
        const { direction, stageid } = details;
        this.fetchAppointmentData(direction, stageid);
      })
      .catch(error => {
        console.error('获取阶段和方向失败:', error);
      });
    
    this.info.date = getDate(new Date(), -30).fullDate;
    this.info.startDate = getDate(new Date(), -60).fullDate;
    this.info.endDate = getDate(new Date(), 30).fullDate;
    this.info.selected = [
      {
        date: getDate(new Date(), 0).fullDate,
        info: "预约",
      },
      {
        date: getDate(new Date(), 2).fullDate,
        info: "预约",
      },
    ];
  },
  methods: {
    //获取阶段和方向id
    fetchdetails() {
      return http({
        url: '/user/user',
        method: 'GET'
      })
      .then(response => {
        return {
          direction: response.data.direction,
          stageid: response.data.stageid
        };
      })
      .catch(error => {
        console.log(error);
        throw error; // 继续抛出错误以便调用者处理
      });
    },
    //获取预约时间
    fetchAppointmentData(direction, stageid) {
      return http({
        url: '/interview/get',
        data: {
          stageid: stageid,
          direction: direction
        },
        method: 'GET'
      })
      .then(response => {
        console.log(response)
        const slots = response.data; // 获取的时间段数据
        const timeSlots = [];
        const availableDates = new Set(); // 使用 Set 以避免重复日期
        
        // 处理时间段数据
        slots.forEach(slot => {
          const startDate = new Date(slot.startTime);
          const formattedDate = getDate(startDate).fullDate;
          
          // 添加到 availableDates
          availableDates.add(formattedDate);

          // 添加到 timeSlots
          timeSlots.push({
            timeId: slot.timeId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            time: `${getTimeFormatted(startDate)} - ${getTimeFormatted(new Date(slot.endTime))}`,
            capacity: slot.capacity,
            remaining: slot.remaining,
          });
        });
        
        // 更新组件数据
        this.timeSlots = timeSlots;
        this.availableDates = Array.from(availableDates);

        console.log('Available Dates:', this.availableDates);
        console.log('Time Slots:', this.timeSlots);
      })
      .catch(error => {
        console.error('获取预约数据失败:', error);
      });
    },
    handleDateChange(e) {
      const selectedDate = e.fulldate;
      if (this.availableDates.includes(selectedDate)) {
        this.selectedDate = selectedDate;
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
      const slot = this.timeSlots[index];
      if (!slot) {
        console.error("Invalid slot index:", index);
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
        const previousSlot = this.timeSlots[existingSlotIndex];
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
      const slot = this.timeSlots[index];
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

function getTimeFormatted(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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
