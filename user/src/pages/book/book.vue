<template>
  <h2 class="example-info">{{ stageTitle }}预约</h2>
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
            @click="reserveSlot(index)"
          >
              <image
                src="../../static/预约1.png"
                class="icon"/>
            <view class="time-info">
              <text>预约时间：{{ formatTime(slot.startTime) }} - {{ formatTime(slot.endTime) }}</text>
            <text class="capacity-info">预约人数：{{ slot.capacity - slot.remaining }}/{{ slot.capacity }}</text>
            <text v-if="currentReservationTimeSolt === slot.timeId" class="reserved-text">已预约</text>
            </view>
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
      stageTitle: uni.getStorageSync('currentStageName'),
      info: {
        lunar: true,
        range: true,
        insert: false,
        selected: [],
      },
      availableDates: [], // 可预约日期
      selectedDate: "",
      currentReservationId: uni.getStorageSync('currentReservationId'),
      currentReservationTimeSolt: uni.getStorageSync('currentReservationTimeSolt')
    }
  },
  onReady() {
    this.$nextTick(() => {
      this.showCalendar = true
    })
    this.fetchDetails()
      .then(details => {
        const { direction } = details
        const stageId = uni.getStorageSync('currentStageId')
        console.log(direction, stageId)
        this.fetchAppointmentData(direction, stageId)
      })
      .catch(error => {
        console.error('获取方向失败:', error)
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
          if (!response) {
            uni.showModal({
              title: '提示',
              content: '您尚未报名，请先报名',
              success: function (res) {
                if (res.confirm) {
                  uni.switchTab({
                    url: '/pages/myth/myth',
                  })
                }
              }
            });
          }
          return {
            direction: response.direction,
          }
        })
        .catch(error => {
          console.error('获取方向失败:', error);
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
    formatTime(datetime) {
      return datetime.split(' ')[1].substring(0, 5)
    },
    handleDateChange(e) {
      const selectedDate = e.fulldate;
      if (this.availableDates.includes(selectedDate)) {
        this.selectedDate = selectedDate;
        this.filteredTimeSlots = this.timeSlots
          .filter(slot => slot.startTime.split(' ')[0] === selectedDate)
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
        .then(() => {
          this.filteredTimeSlots = this.filteredTimeSlots.map(slot => {
            if (slot.timeId === this.currentReservationTimeSolt) {
              return { ...slot, remaining: slot.remaining + 1 }
            }
            return slot
          })
          this.currentReservationId = null
          this.currentReservationTimeSolt = null
          uni.removeStorageSync('currentReservationId')
          uni.removeStorageSync('currentReservationTimeSolt')
          uni.showToast({
            title: "预约已取消",
            icon: "success",
          })
        })
        .catch((error) => {
          console.log(error)
          uni.showToast({
            title:error,
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
          uni.setStorageSync('currentReservationId', response.reservationId)
          uni.setStorageSync('currentReservationTimeSolt', timeId)
          this.currentReservationId = response.reservationId
          this.currentReservationTimeSolt = response.currentReservationId
          this.filteredTimeSlots = this.filteredTimeSlots.map(slot => {
            if (slot.timeId === timeId) {
              return { ...slot, remaining: slot.remaining - 1 }
            }
            return slot
          })
          uni.showToast({
            title: "预约成功",
            icon: "success",
          })
        })
        .catch(error => {
          uni.showToast({
              title:error,
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
        if (slot.remaining > 0 &&this.currentReservationId===null) {
          this.submitReservation(slot.timeId)
            .then(() => {
              // 设置当前预约的时间段索引
              this.currentReservationTimeSolt = slot.timeId;
            });
        } else if(slot.remaining<0&&!this.currentReservationId) {
          uni.showToast({
            title: "此时间段已满，请选其他时间段",
            icon: "none",
          })
        }
        else if(this.currentReservationId){
          uni.showToast({
            title: "该阶段已有预约，请先取消预约",
            icon: "none",
          })
        }
      }
    }
  }
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
  color: #323232;
  font-size: 10px;
  height: 360px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.time-slots {
  margin: 10px auto;
  width: 80%
}

.time-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  background-color: #d4f8f8;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
height: 70px;
}

.time-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  margin-right: 90px;
}

.icon {
  width: 35px;
  height: 35px;
  margin-left: 10px;
}
.capacity-info {
  font-size: 12px;
}

.time-slot:hover {
  background-color: #abdfee;
}

.reserved-text {
  color: #ff0000;
  font-size: 12px;
  margin-left: 10px;
}
</style>
