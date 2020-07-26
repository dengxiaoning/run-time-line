# run-time-line

## Project setup
```
npm install run-time-line --save
```

## Use 

### Configure components
<template>
      <time-axis-auto
      :options="options"
      :dateTimes="dateTimeList"
      @getDateFun="getDateFun"
      :interval="interval"
    ></time-axis-auto>
</template>
### Configure params
```
<script>
export default {
  data() {
    return {
      date: '',
      options: {
        speed: 1, // 速度
        speedMax: 10 // 速度最大值
      },
      interval: 50, // 日期间的间隔
     dateTimeList:[]
    }
  },
  created(){
    this.initTimeLine()
  },
  methods: {
        // 时间轴数据初始化
    initTimeLine() {
      let count = 0
      while (count < 24) {
        const timeRes = count < 10 ? `0${count}:00` : `${count}:00`
        this.dateTimeList.push(timeRes)
        count++
      }
    },
    getDateFun(time) {
      console.log(time)
    }
  }
}
</script>
```

#### The case reference https://www.jianshu.com/p/fb51fe44ff47