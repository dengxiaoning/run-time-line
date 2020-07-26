<template>
  <div class="timeline_main">
    <div class="timeline_control">
      <div class="menu_play">
        <i
          class="menu_icon"
          :class="{'icon_play':!playing, 'icon_pause':playing}"
          @click="togglePlay"
          @mouseleave="hoverIndex = -1"
        />
      </div>
    </div>
    <div ref="progressBar" class="progress-bar" />
    <div class="timeline_axis">

      <div
        v-for="(time, index) in dateTimes"
        :key="index"
        class="axis_item"
      >
        <div
          class="axis_item_tick"
          :class="{ 'axis_item_tick_active':index === highlightIndex ,'is_hover':index === hoverIndex}"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="tickClick(time, index)"
        />
        <div
          v-if="dateTimeIndexes.indexOf(index) >=0 "
          class="axis_item_label"
          @mouseenter="hoverIndex = index"
          @mouseleave="hoverIndex = -1"
          @click="tickClick(time, index)"
        >
          {{ time }}</div>
        <div
          v-if="index === highlightIndex || index === hoverIndex"
          class="axis_item_tip"
        >
          {{ currYearNum +' '+ time }}</div>
        <div v-if="index === highlightIndex" class="progress-btn" />
      </div>
    </div>
  </div>
</template>
<script>
import {parseTime} from './util'
export default {
  name: 'TimeAxisAuto',
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    dateTimes: {
      type: Array,
      default() {
        return []
      }
    },
    interval: {
      type: Number,
      default() {
        return 100
      }
    }
  },
  data() {
    return {
      intervalTimer: null, // 定时器
      dateTimeIndexes: [], // 日期列表
      playing: false, // 播放
      activeIndex: 0, // 当前的时间位置
      hoverIndex: 0 // 鼠标移入的时间位置
    }
  },
  computed: {
    highlightIndex() {
      return (
        (this.activeIndex === -1 && this.dateTimes.length - 1) ||
        this.activeIndex
      )
    }
  },
  watch: {
    options: {
      handler() {
        this.renderTimeline()
      },
      deep: true
    },
    playing() {
      if (this.playing) {
        this.intervalTimer = setInterval(() => {
          this.activeIndex = (this.activeIndex + 1) % this.dateTimes.length
        }, this.options.speed * 1000)
      } else {
        if (this.intervalTimer) {
          clearInterval(this.intervalTimer)
          this.intervalTimer = null
        }
      }
    },
    activeIndex() {
      this.calcuationOffset()
      const time = this.dateTimes[this.activeIndex].split(' ')[0]
      this.$emit('getDateFun', time)
    }
  },
  mounted() {
    this.currYearNum = parseTime(new Date(), '{y}年{m}月{d}日')
    this.renderTimeline()
    const that = this
    window.onresize = function() {
      that.renderTimeline()
    }
  },
  beforeDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
  },
  methods: {
    // 计算偏移量
    calcuationOffset() {
      this.$nextTick(() => {
        const activeEl = document.getElementsByClassName('axis_item_tick_active')
        if (activeEl) {
          const offsetNum = activeEl[0].parentElement.offsetLeft
          this._setOffset(offsetNum)
        }
      })
    },
    // 设置偏移
    _setOffset(offsetWidth) {
      // 设置进度长度随着百分比变化
      this.$refs.progressBar.style.width = `${offsetWidth}px`
    },
    // 初始化时间轴
    renderTimeline() {
      this.calcuationOffset()
      // 时间轴的宽度
      const timelineWidth = this.$el.offsetWidth - 40
      // 日期个数
      const dateTimesSize = this.dateTimes.length
      // 如果时间全部显示，时间轴的理想宽度
      const dateTimesWidth = dateTimesSize * this.interval
      // 如果时间轴的宽度小于理想宽度
      if (timelineWidth >= dateTimesWidth) {
        this.dateTimeIndexes = this.dateTimes.map((dateTime, index) => {
          return index
        })
        return
      }
      // 当前时间轴的宽度最大能容纳多少日期刻度
      const maxTicks = Math.floor(timelineWidth / this.interval)
      // 间隔刻度数
      const gapTicks = Math.floor(dateTimesSize / maxTicks)
      // 记录需要显示的日期索引
      this.dateTimeIndexes = []
      for (let t = 0; t <= maxTicks; t++) {
        this.dateTimeIndexes.push(t * gapTicks)
      }
      const len = this.dateTimeIndexes.length
      // 最后一项需要特殊处理
      if (len > 0) {
        const lastIndex = this.dateTimeIndexes[len - 1]
        if (lastIndex + gapTicks > dateTimesSize - 1) {
          this.dateTimeIndexes[len - 1] = dateTimesSize - 1
        } else {
          this.dateTimeIndexes.push(dateTimesSize - 1)
        }
      }
    },
    // 点击刻度
    tickClick(time, index) {
      if (this.playing) {
        return
      }
      this.activeIndex = index
    },
    // 播放和暂停
    togglePlay() {
      this.playing = !this.playing
    }
  }
}
</script>
<style scoped lang="scss">
.timeline_main {
  position: relative;
  padding: 10px;
  box-sizing: border-box;
  .timeline_control {
    overflow: hidden;
    display:inline;
    i {
      cursor: pointer;
      display: inline-block;
      font-style: normal;
    }
    .menu_icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .menu_play {
      margin-right: 8px;
      float: left;
      padding: 4px 4px;
      border-radius: 50%;
      color: #00fffa;
      background: rgba(0, 0, 0, 0.2);

    }
    .menu_icon_disabled {
      cursor: no-drop;
      opacity: 0.5;
    }
  }
  .progress-bar{
      display: inline-block;
      position: absolute;
      top: 20px;
      height: 4px;
      background: #3986F6;
      transition: background 0.4s;
    }
  .timeline_axis {
    position: relative;
    display: flex;
    justify-content: space-around;
    padding: 8px 0;

    &::before {
      content: '';
      width: 100%;
      height: 8px;
      position: absolute;
      left: 0;
      bottom: 8px;
      display: inline-block;
      background: rgba(0,0,0,0.1);
    }
  }
  .axis_item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .axis_item_tick {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(0,0,0,0.1);
      -webkit-transition: background 0.3s;
      transition: background 0.3s;
      cursor: pointer;
      &:hover {
        background: #00fffa;
      }
    }
    .is_hover{
      background: #00fffa;
    }
    .progress-btn {
      position: absolute;
      top: -2px;
      left: -1px;
      box-sizing: border-box;
      width: 10px;
      height: 12px;
      border: 1px solid #3986F6;
      border-top-left-radius: 2px;
      border-top-right-radius: 2px;
      background: #3784F7;
    }
    .progress-btn:after{
        content: '';
        width: 0px;
        position: absolute;
        height: 0px;
        top: 10px;
        left: -1px;
        border-top: 5px solid #3986F6;
        border-right: 5px solid transparent;
        border-bottom: 2px solid transparent;
        border-left: 5px solid transparent;
    }

    .axis_item_label {
      position: absolute;
      bottom: -30px;
      white-space: nowrap;
      border-radius: 11px;
      color: #fff;
      padding: 2px 6px;
      font-size: 14px;
      background: rgba(0, 0, 0, 0.4);
      cursor: pointer;
    }
    .axis_item_tip {
      position: absolute;
      top: -35px;
      padding: 4px 6px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
      white-space: nowrap;
      color: #fff;
      font-size: 12px;
    }
  }
}

.icon_play {
  background-image: url(data:image/png;base64,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);
}

.icon_pause {
  background-image: url(data:image/png;base64,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);
}
</style>
