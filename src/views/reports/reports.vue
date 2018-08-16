<template>
  <el-card>
    <my-breadcrumb level1="数据统计" level2="数据报表"></my-breadcrumb>
    <div ref="box" style="width: 700px; height: 500px;margin-top:20px"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts';
export default {
  mounted() {
    this.init();
  },
  methods: {
    // 初始化echarts实例
    async init() {
      const response = await this.$http.get('reports/type/1');
      // console.log(response);
      const myChart = echarts.init(this.$refs.box);
      var options = response.data.data;
      // console.log(options);
      options.xAxis[0].boundaryGap = false;
      const data = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      };
      // 合并对象
      options = {...options, ...data};
      console.log(options);
      myChart.setOption(options);
    }
  }
};
</script>

<style>

</style>
