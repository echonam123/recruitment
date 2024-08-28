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
            <text>{{ slot.currentBookings }}/{{ slot.maxBookings }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      timeSlots: [
        { time: "09:00 - 10:00", currentBookings: 0, maxBookings: 2 },
        { time: "10:00 - 11:00", currentBookings: 0, maxBookings: 2 },
        { time: "11:00 - 12:00", currentBookings: 0, maxBookings: 2 },
        { time: "14:00 - 15:00", currentBookings: 0, maxBookings: 2 },
        { time: "15:00 - 16:00", currentBookings: 0, maxBookings: 2 },
      ],
      showCalendar: false,
      info: {
        lunar: true,
        range: true,
        insert: false,
        selected: [],
      },
      availableDates: [
        getDate(new Date(), 2).fullDate, // 当前日期加2天
        getDate(new Date(), 4).fullDate, // 当前日期加4天
        getDate(new Date(), 6).fullDate, // 当前日期加6天
      ],
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
          previousSlot.currentBookings--;
        }
        this.bookedSlots[this.selectedDate] = null;
      }

      // 更新预约
      if (slot.currentBookings < slot.maxBookings) {
        slot.currentBookings++;
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
      slot.currentBookings--;
      this.bookedSlots[this.selectedDate] = null;
      uni.showToast({
        title: "预约已取消",
        icon: "success",
      });
    },
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

  dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期

  const y = dd.getFullYear();
  const m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
  const d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
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
  margin-top: 10px; /* 顶部增加间距 */
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
