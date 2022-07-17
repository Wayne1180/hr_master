<template>
  <div>
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    ></svg-icon>
  </div>
</template>

<script>
import ScreenFull from "screenfull";
export default {
  methods: {
    changeScreen() {
      //原生方式
      // document.documentElement.requestFullscreen();
      if (!ScreenFull.isEnabled) {
        this.$message.warning("当前全屏功能不可用");
        return;
      }
      ScreenFull.toggle(); //全屏方法 既包含全屏又包含退出全屏
    },
  },
};
</script>

<style>
</style>