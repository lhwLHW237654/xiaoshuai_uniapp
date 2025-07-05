<template>
  <view class="index">
    <view class="top ac">
      <view class="text c">❤️在一起已经</view>
      <br />
      <view class="time">{{ timeString }}</view>
    </view>
    <view class="center">
      <u-swiper :list="imageData" style="height: 200rpx;"></u-swiper>
      <u-notice-bar mode="vertical" type="warning" :list="list" style="margin-top: 20rpx;"></u-notice-bar>
      <u-row gutter="16">
        <u-col span="4">
          <view class="commemorate">
            <view>
              <image style="width: 110rpx; height: 110rpx; margin-top: 25rpx" :src="'../../static/home/memorandum.svg'" mode="aspectFit"></image>
            </view>
            <view style="margin-top: 20rpx; font-size: 32rpx">备忘录</view>
          </view>
        </u-col>
        <u-col span="4">
          <view class="image">
            <view>
              <image style="width: 110rpx; height: 110rpx; margin-top: 25rpx" :src="'../../static/home/memoirs.svg'" mode="aspectFit"></image>
            </view>
            <view style="margin-top: 20rpx; font-size: 32rpx">回忆站</view>
          </view>
        </u-col>
        <u-col span="4">
          <view class="memorandum">
            <view>
              <image style="width: 110rpx; height: 110rpx; margin-top: 25rpx" :src="'../../static/home/commemorate.svg'" mode="aspectFit"></image>
            </view>
            <view style="margin-top: 20rpx; font-size: 32rpx">纪念日</view>
          </view>
        </u-col>
        <u-col span="4">
          <view class="mustDo">
            <view>
              <image style="width: 110rpx; height: 110rpx; margin-top: 25rpx" :src="'../../static/home/affair.svg'" mode="aspectFit"></image>
            </view>
            <view style="margin-top: 20rpx; font-size: 32rpx">100件事</view>
          </view>
        </u-col>
        <u-col span="4">
          <view class="turntable" @click="turntable">
            <view>
              <image style="width: 110rpx; height: 110rpx; margin-top: 25rpx" :src="'../../static/home/turntable.svg'" mode="aspectFit"></image>
            </view>
            <view style="margin-top: 20rpx; font-size: 32rpx">转盘</view>
          </view>
        </u-col>
        <u-col span="4">
          <view class="turntable">
            <view>
              <image style="width: 110rpx; height: 110rpx; margin-top: 25rpx" :src="'../../static/home/hobby.svg'" mode="aspectFit"></image>
            </view>
            <view style="margin-top: 20rpx; font-size: 32rpx">爱好</view>
          </view>
        </u-col>
      </u-row>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const startTime = ref("2021-09-14");
const timeString = ref("");
const calculateTime = () => {
  const nowTime = new Date().getTime();
  const start = new Date(startTime.value).getTime();
  const timeDiff = nowTime - start;

  const days = Math.floor(timeDiff / (24 * 3600 * 1000));
  const hours = Math.floor((timeDiff / (3600 * 1000)) % 24);
  const minutes = Math.floor((timeDiff / (60 * 1000)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);
  timeString.value = `${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;
};
let timer;

const imageData = ref([
  {
    image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    title: "昨夜星辰昨夜风，画楼西畔桂堂东",
  },
  {
    image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    title: "身无彩凤双飞翼，心有灵犀一点通",
  },
  {
    image: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
  },
]);

// 在组件挂载时启动计时器
onMounted(() => {
  calculateTime();
  timer = setInterval(calculateTime, 1000);
});

// 在组件卸载时清除计时器
onUnmounted(() => {
  clearInterval(timer);
});

const list = ref(["寒雨连江夜入吴", "平明送客楚山孤", "洛阳亲友如相问", "一片冰心在玉壶"]);

function turntable() {
  uni.navigateTo({
    url: "./components/turntable",
  });
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  .top {
    height: 30%;
    background-image: url("@/static/img/tavern-7411977_1280.jpg");
    background-repeat: no-repeat;
    background-position: right top;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .text {
      font-size: 30rpx;
      color: #f8626e;
      font-weight: bold;
    }
    .time {
      font-size: 50rpx;
      color: #f8626e;
      font-weight: bold;
    }
  }
  .center {
    height: 70%;
    padding: 20rpx;
    background-image: url("@/static/home/background.svg");
    .turntable,
    .image,
    .mustDo,
    .memorandum,
    .commemorate {
      margin-top: 30rpx;
      font-weight: bold;
      border-radius: 20rpx;
      height: 270rpx;
      text-align: center;
    }
  }
}
</style>
