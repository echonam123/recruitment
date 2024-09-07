<template>
  <h2 class="example-info">{{ stageTitle }}</h2>
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
            :key="slot.timeId"
            class="time-slot"
            :class="{ selected: currentReservationTimeSolt === slot.timeId}"
            @click="reserveSlot(index)"
          >
            <text>{{ slot.startTime }} - {{ slot.endTime }}</text>
            <text>{{ slot.capacity - slot.remaining }}/{{ slot.capacity }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { http } from '@/utils/http';

export default {
  data() {
    return {
      timeSlots: [], // 请求的时间段
      filteredTimeSlots: [], // 过滤后的时间段
      showCalendar: false,
      stageTitle: '',
      info: {
        lunar: true,
        range: true,
        insert: false,
        selected: [],
      },
      availableDates: [], // 可预约日期
      selectedDate: "",
      currentReservationId:uni.getStorageSync('reservation') ,
      currentReservationTimeSolt:uni.getStorageSync('currentReservationTimeSolt')
    }
  },
  onReady() {
    this.$nextTick(() => {
      this.showCalendar = true;
    })
    this.fetchDetails()
      .then(details => {
        const { direction, stageId } = details;
        this.fetchAppointmentData(direction, stageId);
      })
      .catch(error => {
        console.error('获取阶段和方向失败:', error)
      })
    this.info.selected = []
  },
  methods: {
    fetchDetails() {
      return http({
        url: '/user/user',
        method: 'GET'
      })
      .then(response => {
        let stageTitle = '';
      switch (response.stageId) {
        case 1:
          stageTitle = '面试预约'
          break;
        case 2:
          stageTitle = '一轮预约'
          break;
        case 3:
          stageTitle = '二轮预约'
          break;
      }
      this.stageTitle = stageTitle;
        return {
          direction: response.direction,
          stageId: response.stageId
        }
      })
      .catch(error => {
        console.error('获取阶段和方向失败:', error);
      })
    },
    fetchAppointmentData(direction, stageId) {
      uni.showLoading({ title: '正在获取信息...' });
      return http({
        url: '/interview/get',
        data: {
          stageId: stageId,
          direction: direction
        },
        method: 'GET'
      })
      .then(response => {
        this.timeSlots = response.map(slot => ({
          ...slot,
          startTime: slot.startTime.replace('T', ' '),
          endTime: slot.endTime.replace('T', ' ')
        }))
        const uniqueDates = [...new Set(this.timeSlots.map(slot => slot.startTime.split(' ')[0]))]
        this.availableDates = uniqueDates;
        this.info.selected = uniqueDates.map(date => ({
          date: date,
          info: '可预约'
        }))
      })
      .catch(error => {
        console.error('获取预约数据失败:', error);
      })
      .finally(() => {
    uni.hideLoading()
  })
    },
    handleDateChange(e) {
      const selectedDate = e.fulldate;
      if (this.availableDates.includes(selectedDate)) {
        this.selectedDate = selectedDate;
        this.filteredTimeSlots = this.timeSlots
          .filter(slot => slot.startTime.split(' ')[0] === selectedDate);
        this.info.selected = this.availableDates.map(date => ({
          date: date,
          info: date === selectedDate ? '可预约' : '不可预约'
        }))
        this.$refs.popup.open("bottom")
      } else {
        uni.showToast({
          title: "此日期不可预约",
          icon: "none",
        })
      }
    },
    cancelReservation(reservationId) {
      uni.showLoading({ title: '正在取消预约中...' })
      return http({
        url: `/interview/cancel/${reservationId}`,
        method: 'PUT'
      })
      .then(response => {
        this.currentReservationTimeSolt=null
        this.filteredTimeSlots = this.filteredTimeSlots.map(slot => {
      if (slot.timeId === this.currentReservationTimeSolt) { 
        return { ...slot, remaining: slot.remaining +1 }
      }
      return slot
    
    })
        uni.showToast({
          title: "预约已取消",
          icon: "success",
        })
        
        this.currentReservationId = null
        this.currentReservationTimeSlot = null
        uni.removeStorageSync('reservation')
        uni.removeStorageSync('currentReservationTimeSolt')
      })
      .catch(error => {
        console.error('取消预约失败:', error);
        uni.showToast({
          title: "取消预约失败",
          icon: "none",
        })
      })
      .finally(() => {
    uni.hideLoading()
  });
    },
    submitReservation(timeId) {
      uni.showLoading({ title: '正在预约中...' });
      return http({
        url: `/interview/${timeId}`,
        method: 'POST'
      })
      .then(response => {
        uni.setStorageSync('reservation', response.reservationId)
        uni.setStorageSync('currentReservationTimeSolt', timeId)
        this.currentReservationId = response.reservationId
        this.currentReservationTimeSlot= uni.getStorageSync(' currentReservationTimeSolt')
        this.filteredTimeSlots = this.filteredTimeSlots.map(slot => {
      if (slot.timeId === timeId) {
        return { ...slot, remaining: slot.remaining - 1 }
      }
      return slot
    })
    const reservation = uni.getStorageSync('reservation')
console.log(reservation)
        uni.showToast({
          title: "预约成功",
          icon: "success",
        })
      })
      .catch(error => {
        console.log(error)
        uni.showToast({
          title:error.data.message+'请先取消预约',
          icon: "none",
        })
      })
      .finally(() => {
    uni.hideLoading()
  })
    },
    reserveSlot(index) {
    const slot = this.filteredTimeSlots[index];
    if (this.currentReservationId && this.currentReservationTimeSolt === slot.timeId) {
      // 当前时间段已被预约，进行取消操作
      this.cancelReservation(this.currentReservationId);
    } else {
      // 没有预约，直接进行新的预约
      if (slot.remaining > 0) {
        this.submitReservation(slot.timeId)
          .then(() => {
            // 设置当前预约的时间段索引
            this.currentReservationTimeSolt = slot.timeId;
          });
      } else {
        uni.showToast({
          title: "此时间段已满",
          icon: "none",
        })
      }
    }
  }
  }
}

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
  background-color: #f5f1f1;
  border-radius: 5px;
  cursor: pointer;
}

.time-slot:hover {
  background-color: #eaeaea;
}

.time-slot.selected {
  background-color: #a0e0a0; /* 预约成功的样式，例如绿色背景 */
  color: #fff;
}

</style>
