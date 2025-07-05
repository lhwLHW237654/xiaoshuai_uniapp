<template>
  <view class="settings">
    <view class="settingsBox">
      <view class="avatar" @click="uploadPhoto">
        <view v-if="photo" class="cameraImage"><u-avatar size="200" :src="photo"></u-avatar></view>
        <view class="cameraIcon" v-else>
          <view>📷</view>
        </view>
      </view>
      <u-form ref="form">
        <u-form-item label="名称" required label-width="120rpx">
          <u-input v-model="name" placeholder="请输入名称" />
        </u-form-item>
        <u-form-item label="新密码" required label-width="120rpx">
          <u-input v-model="newPassword" placeholder="请输入新密码" />
        </u-form-item>
        <u-form-item label="确认密码" required label-width="130rpx">
          <u-input v-model="password" placeholder="请在次输入新密码" />
        </u-form-item>
        <u-button type="primary" @click="submit">提 交</u-button>
      </u-form>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script setup>
import { ref } from "vue";

const newPassword = ref("");
const password = ref("");
const photo = ref("");
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
              photo.value = base64Data;
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
function uploadPhoto() {
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
function submit() {
  const containsChinese = (str) => /[\u4E00-\u9FA5]/.test(str);
  const isLengthValid = (str) => str.length >= 5 && str.length <= 15;
  //如果需要修改密码
  if (newPassword.value) {
    if (containsChinese(newPassword.value) || !isLengthValid(newPassword.value)) {
      uni.showModal({
        title: "提示",
        content: "新密码不能包含中文字符且长度必须在5到15位之间",
        showCancel: false,
      });
      return;
    }
    if (!password.value) {
      uni.showModal({
        title: "提示",
        content: "请再次输入新密码",
        showCancel: false,
      });
      return;
    }
    if (newPassword.value !== password.value) {
      uni.showModal({
        title: "提示",
        content: "确认密码和新密码不一致",
        showCancel: false,
      });
      return;
    }
  }
  console.log("%c Line:96 🥖 password.value", "background:#fca650", password.value);
}
</script>

<style lang="scss" scoped>
.settings {
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
  .settingsBox {
    position: absolute;
    height: 50vh;
    padding: 50rpx;
    top: 10%;
    left: 5%;
    opacity: 0.8;
    bottom: 0;
    width: 90%;
    display: flex;
    border-radius: 30rpx;
    flex-direction: column;
    background-color: #fff;
    .avatar {
      display: flex;
      padding: 20rpx;
      justify-content: center;
      align-items: center;
      .cameraImage {
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cameraIcon {
        font-size: 50rpx;
        background-color: #e0e0e0;
        border-radius: 50%;
        width: 200rpx;
        height: 200rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
