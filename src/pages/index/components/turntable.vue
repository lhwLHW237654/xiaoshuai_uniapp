<template>
  <view style="display: flex; align-items: center; justify-content: center; padding-top: 100rpx">
    <view class="zhuanpan">
      <view class="point" v-for="item in 9" :key="item"></view>
      <view
        class="content"
        :style="{ 'background-image': groupbg, transform: 'rotateZ(' + rotate + 'deg)', transition: 'transform ' + second + 's' }">
        <view class="item" v-for="(item, index) in list" :key="index" :style="{ transform: 'rotateZ(' + index * (360 / list.length) + 'deg)' }">
          <view class="img">
            <image :src="item.img" mode="aspectFit"></image>
          </view>
          <view class="name">{{ item.name }}</view>
        </view>
      </view>
      <view class="arrow" @click="start">GO</view>
    </view>
  </view>
  <view class="takeNotes ac c">
    <view class="button" @click="takeNotesBtn">
      <text class="buttonText">中奖记录</text>
    </view>
  </view>
  <u-popup v-model="show" mode="center" width="90%" height="50%" border-radius="20">
    <view class="popupContent">
      <view class="header">中奖记录</view>
      <view class="message" v-for="(item, index) in history" :key="index">
        {{ item }}
      </view>
    </view>
  </u-popup>
  <u-popup v-model="bearFruit" mode="center" width="90%" height="50%" border-radius="40">
    <view class="popupContents">
      <view class="envelope">
        <view class="message">
          <p class="congrats">恭喜您获得</p>
          <p class="reward">以下奖励</p>
          <p class="amount">{{ bearFruitData }}</p>
        </view>
      </view>
      <div class="buttons">
        <button class="button" @click="takeNotesBtn">查看中将记录</button>
        <button class="button" @click="start">继续抽奖</button>
      </div>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, onLoad, onMounted } from "vue";
const list = ref([
  { name: "谢谢参与", desc: "加油哦~", img: "../../../static/face.png" },
  { name: "神秘大奖", desc: "20000元现金", img: "../../../static/icon0.png" },
  { name: "一等奖", desc: "iMac电脑", img: "../../../static/icon1.png" },
  { name: "二等奖", desc: "ps5游戏主机", img: "../../../static/icon2.png" },
  { name: "三等奖", desc: "大牌行李箱", img: "../../../static/icon3.png" },
  { name: "四等奖", desc: "华为智能手表", img: "../../../static/icon4.png" },
  { name: "五等奖", desc: "头戴式蓝牙耳机", img: "../../../static/icon5.png" },
  { name: "六等奖", desc: "品牌热水壶", img: "../../../static/icon6.png" },
]);
const show = ref(false);

const groupbg = ref("");
const color1 = ref("");
const color2 = ref("");
const rotate = ref(0);
const second = ref(4);
const isactive = ref(false);
const bearFruit = ref(false);
const bearFruitData = ref("");
const activeIndex = ref(0);
const history = ref([]);
// 声明音效
let spinAudio = null;
let endAudio = null;
 

onMounted(() => {
  init();
  spinAudio = uni.createInnerAudioContext();
  spinAudio.src = '/static/audio/spin.mp3'; // 你需要把音频放在static下
  spinAudio.loop = true;
  endAudio = uni.createInnerAudioContext();
  endAudio.src = '/static/audio/end.mp3';
  endAudio.loop = false;
});
//中奖记录
function takeNotesBtn() {
  bearFruit.value = false;
  show.value = true;
}
function start() {
  bearFruit.value = false;
  if (isactive.value) return;
  // 随机一个中奖
  const n = Math.floor(Math.random() * list.value.length);
  isactive.value = true;
  rotate.value += 1800 + ((activeIndex.value - n) * 360) / list.value.length;
  // 开始时播放旋转音效（如在H5端，spinAudio可能为null要处理下）
  if (spinAudio) {
    spinAudio.play();
  }
  setTimeout(() => {
    activeIndex.value = n;
    bearFruitData.value = list.value[n].name + "：" + list.value[n].desc;
    history.value.push(list.value[n].name + "：" + list.value[n].desc);
    isactive.value = false;
    bearFruit.value = true;
    // 停止旋转音效
    if (spinAudio) spinAudio.stop();
    // 播放中奖音效
    if (endAudio) {
		console.log("播放结束y音频");
		endAudio.play();}
  }, second.value * 1000);
}
function init() {
  //绘制转盘奖项背景颜色
  let str = "";
  let num = list.value.length;
  let deg = 360 / num;
  let colors = [];
  str += `conic-gradient(from ${-deg / 2}deg at 50% 50%,`;
  for (var i = 0; i < num; i++) {
    if (i % 2 == 0) {
      colors.push(`${color1.value} ${i * deg}deg,${color1.value} ${(i + 1) * deg}deg,${color2.value} ${(i + 1) * deg}deg`);
    } else {
      colors.push(`${color2.value} ${i * deg}deg,${color2.value} ${(i + 1) * deg}deg,${color1.value} ${(i + 1) * deg}deg`);
    }
  }
  str += colors.join(",");
  str += ")";
  groupbg.value = str;
}
</script>

<style lang="scss">
page {
  background: linear-gradient(to bottom, white, rgb(242, 165, 215), white);
}
.zhuanpan {
  width: 670rpx;
  height: 670rpx;
  position: relative;
  background-image: radial-gradient(circle, #3b00a8 297rpx, #6932e3 299rpx);
  border-radius: 50%;
  box-shadow: inset 0 0 20rpx rgba(#fff, 0.15);
  box-sizing: border-box;
  padding: 44rpx;
  .point {
    position: absolute;
    top: 12rpx;
    bottom: 12rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &::before,
    &::after {
      content: "";
      width: 12rpx;
      height: 12rpx;
      background-color: #fffa65;
      box-shadow: 0 0 10rpx #fffa65;
      border-radius: 50%;
      display: block;
    }
  }
  @for $i from 1 through 8 {
    .point:nth-child(#{$i}) {
      transform: translateX(-50%) rotate($i * 20deg);
    }
  }
  .content {
    z-index: 2;
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fcecb2;
    border-radius: 50%;
    overflow: hidden;
    .item {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 50%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform-origin: 50% 100%;
      .img {
        margin-top: 24rpx;
        line-height: 1;
        image {
          width: 70rpx;
          height: 70rpx;
        }
      }
      .name {
        text-align: center;
        font-size: 24rpx;
        margin-top: 12rpx;
        color: #914401;
      }
    }
  }
  .arrow {
    width: 120rpx;
    height: 120rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffea00;
    font-weight: bold;
    font-size: 40rpx;
    background: linear-gradient(to top, #7438ff, #a869ff);
    border: 8rpx solid #6932e3;
    border-radius: 50%;
    box-shadow: inset 0 0 20rpx rgba(#fff, 0.3);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 3;
    &::after {
      content: "";
      border-bottom: 48rpx solid #6932e3;
      border-left: 20rpx solid transparent;
      border-right: 20rpx solid transparent;
      position: absolute;
      left: 50%;
      top: -48rpx;
      transform: translateX(-50%);
      margin: auto;
    }
  }
}
.takeNotes {
  width: 100%;
  height: 20vh;
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 50px;
    background: linear-gradient(90deg, #f56c6c, #f5c6c6);
    border-radius: 25px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    .buttonText {
      color: #a33a3a;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
.popupContent {
  width: 100%;
  height: 100%;
  background-color: #fff8e1;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  .header {
    background: linear-gradient(to right, #fbbc05, #f2994a);
    border-radius: 10px;
    padding: 10px;
    font-size: 18px;
    color: #8a4b08;
    margin-bottom: 20px;
  }
  .message {
    background: linear-gradient(to right, #fce4ec, #f8bbd0);
    border-radius: 5px;
    margin-top: 20rpx;
    padding: 10px;
    font-size: 16px;
    color: #d32f2f;
  }
}
.popupContents {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(to bottom, #f9d423, #ff4e50);
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  .envelope {
    background-color: #ff4e50;
    width: 100%;
    max-width: 300px;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    position: relative;
    box-sizing: border-box;
    .message {
      background-color: #fff0d6;
      border-radius: 10px;
      padding: 10px;
      margin-top: -30px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      .congrats {
        font-size: 16px;
        margin: 5px 0;
      }

      .reward {
        font-size: 18px;
        font-weight: bold;
        margin: 5px 0;
      }

      .amount {
        font-size: 32rpx;
        color: #ff4e50;
        font-weight: bold;
        margin: 10px 0;
      }
    }
  }
}

.buttons {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
  .button {
    background-color: #ff4e50;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  .button:hover {
    background-color: #e64545;
  }
}
</style>
