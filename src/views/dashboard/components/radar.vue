<template>
  <!-- 雷达图 图表必须给高和宽-->
  <div ref="myDiv" class="radar-echart"></div>
</template>

<script>
// var echarts = require("echarts");
//引入echarts主模块
var echarts = require("echarts/lib/echarts");
//引入雷达图
require("echarts/lib/chart/radar");
//引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv); //得到图表实例
    myChart.setOption({
      title: {
        text: "Basic Radar Chart",
      },
      legend: {
        data: ["Allocated Budget", "Actual Spending"],
      },
      radar: {
        // shape: 'circle',
        //每个区域的最高值
        indicator: [
          { name: "工作效率", max: 100 },
          { name: "考勤", max: 100 },
          { name: "积极性", max: 100 },
          { name: "帮助同事", max: 100 },
          { name: "自主学习", max: 100 },
          { name: "正确率", max: 100 },
        ],
      },
      series: [
        {
          name: "Budget vs spending",
          type: "radar",
          data: [
            {
              value: [70, 66, 85, 40, 50, 89],
              name: "张三",
            },
            {
              value: [56, 15, 40, 80, 60, 90],
              name: "李四",
            },
          ],
        },
      ],
    });
  },
};
</script>

<style scoped>
.radar-echart {
  width: 600px;
  height: 400px;
}
</style>