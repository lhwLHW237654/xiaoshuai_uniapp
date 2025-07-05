<template>
  <view class="my">
    <view class="myBox">
      <view class="datum ac">
        <view class="head">
          <u-avatar size="150" :src="user.userInfo?.photo" />
        </view>
        <view class="name">{{ user.userInfo?.name ? user.userInfo?.name : "未登录" }}</view>
      </view>
      <view class="function">
        <view class="functionBox">
          <u-cell-group>
            <u-cell-item icon="setting-fill" title="个人设置" @click="settings"></u-cell-item>
            <u-cell-item icon="grid-fill" title="设置首页" @click="edition"></u-cell-item>
            <u-cell-item icon="clock-fill" title="转盘事件" @click="turntable"></u-cell-item>
            <u-cell-item icon="close-circle-fill" title="退出登录" @click="quit"></u-cell-item>
          </u-cell-group>
        </view>
      </view>
    </view>
    <u-popup v-model="show" mode="center" border-radius="14" length="80%">
      <view class="turntable">
        <u-grid :col="4">
          <u-grid-item v-for="(item, index) in turntableData" :key="index" @click="replace(item)">
            <u-avatar size="100" :src="item.img" mode="square"></u-avatar>
            <view class="grid-text">{{ item.name }}</view>
          </u-grid-item>
        </u-grid>
        <view class="ja" style="margin-top: 20rpx">
          <view>
            <u-button @click="show = false">取消</u-button>
          </view>
          <view>
            <u-button type="primary" @click="show = false">确认</u-button>
          </view>
        </view>
      </view>
    </u-popup>
    <view class="turntableBox">
      <u-popup v-model="turntableBoxShow" mode="center" border-radius="14" length="80%">
        <view style="padding: 20rpx">
          <u-form :model="form">
            <u-form-item label="图案" prop="img">
              <u-image width="120" height="120" :src="form.img" mode="img" @click="uploadImage"></u-image>
            </u-form-item>
            <u-form-item label="名称" prop="name">
              <u-input v-model="form.name" maxlength="5" />
            </u-form-item>
            <u-form-item label="描述" prop="desc">
              <u-input v-model="form.desc" maxlength="5" />
            </u-form-item>
          </u-form>
          <u-button @click="keep">确定</u-button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup>
import { ref, storeToRefs } from "vue";
import user from "@/store/modules/userInfo.js";

const show = ref(false);

function settings() {
  uni.navigateTo({
    url: "./components/settings",
  });
}

function edition() {
  uni.navigateTo({
    url: "./components/newHome",
  });
}
const turntableData = ref([
  { id: 1, name: "谢谢参与", desc: "加油哦~", img: "../../../static/face.png" },
  { id: 2, name: "神秘大奖", desc: "20000元现金", img: "../../../static/icon0.png" },
  { id: 3, name: "一等奖", desc: "iMac电脑", img: "../../../static/icon1.png" },
  { id: 4, name: "二等奖", desc: "ps5游戏主机", img: "../../../static/icon2.png" },
  { id: 5, name: "三等奖", desc: "大牌行李箱", img: "../../../static/icon3.png" },
  { id: 6, name: "四等奖", desc: "华为智能手表", img: "../../../static/icon4.png" },
  { id: 7, name: "五等奖", desc: "头戴式蓝牙耳机", img: "../../../static/icon5.png" },
  { id: 8, name: "六等奖", desc: "品牌热水壶", img: "../../../static/icon6.png" },
]);
function turntable() {
  show.value = true;
}
const turntableBoxShow = ref(false);
const form = ref({});
function replace(item) {
  form.value = {
    name: item.name,
    desc: item.desc,
    img: item.img,
  };
  turntableBoxShow.value = true;
}
function quit() {
  uni.clearStorageSync(); // 清空缓存
  uni.reLaunch({
    url: "../login/index", // 确保路径正确
  });
}
function uploadUrlApi(filePaths) {
  const files = Array.isArray(filePaths) ? filePaths : [filePaths];
  const uploadPromises = files.map((filePath) => {
    return new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
        entry.file((file) => {
          const fileReader = new plus.io.FileReader();
          fileReader.onload = (r) => {
            try {
              const base64Data = r.target.result;
              form.value.img = base64Data;
            } catch (error) {
              reject({ filePath, error: error });
            }
          };
          fileReader.onerror = (error) => reject({ filePath, error: error });
          fileReader.readAsDataURL(file);
        });
      });
    });
  });
  return Promise.all(uploadPromises);
}
function uploadImage() {
  uni.chooseImage({
    count: 1, //最多可以选择的图片张数，默认9
    sizeType: ["compressed"],
    sourceType: ["album"],
    success: (res) => {
      uni.getImageInfo({
        src: res.tempFilePaths[0],
        success: (image) => {
          uploadUrlApi(image.path);
        },
      });
    },
    fail: (err) => {
      console.log("chooseImage fail", err);
    },
  });
}
function keep() {
  turntableData.value.forEach((item) => {
    if (item.img === form.value.img) {
      item.name = form.value.name;
      item.desc = form.value.desc;
      item.img = form.value.img;
    }
  });
  turntableBoxShow.value = false;
}
</script>

<style lang="scss" scoped>
.my {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("@/static/img/tavern-7411977_1280.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    z-index: -1;
  }
  .text {
    padding: 30rpx;
  }
  .myBox {
    position: absolute;
    top: 15%;
    bottom: 0;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    .datum {
      .head {
        padding: 20rpx;
      }
      .name {
        color: black;
        font-size: 40rpx;
        letter-spacing: 5rpx;
        font-weight: 900;
      }
    }
    .function {
      flex-grow: 1;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      background-color: #fff;
      opacity: 0.7;
      color: black;
      padding: 20rpx;
    }
  }
  .turntable {
    padding: 20rpx;
  }
  .turntableBox {
    padding: 20rpx;
  }
}
</style>
