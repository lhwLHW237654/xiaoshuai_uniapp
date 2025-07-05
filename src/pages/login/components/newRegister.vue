<template>
  <view class="newRegister">
    <view class="newRegisterBox">
      <view class="header">
        <view class="welcome">Welcome</view>
        <view class="title">新用户注册</view>
      </view>
      <view class="data">
        <view class="avatar" @click="uploadPhoto">
          <view v-if="form.photo" class="cameraImage"><u-avatar size="200" :src="form.photo"></u-avatar></view>
          <view class="cameraIcon" v-else>
            <view>📷</view>
          </view>
        </view>
        <view class="inputBox">
          <u-input class="input ac" v-model="form.name" type="text" :border="true" placeholder="设置用户名" />
          <u-input class="input ac" v-model="form.uname" type="text" :border="true" placeholder="设置账号" />
          <u-input class="input ac" v-model="form.password" type="password" :border="true" placeholder="设置密码" />
        </view>
        <button class="registerButton" @click="keep">确 认 注 册</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import request from "@/utils/request.js";

const form = ref({
  name: "",
  uname: "",
  password: "",
  photo: "",
});
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
              form.value.photo = base64Data;
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
function keep() {
  if (!form.value.name) {
    uni.showToast({
      title: "请输入用户名",
      icon: "none",
    });
    return;
  } else if (!form.value.uname) {
    uni.showToast({
      title: "请输入账号",
      icon: "none",
    });
    return;
  } else if (!form.value.password) {
    uni.showToast({
      title: "请输入密码",
      icon: "none",
    });
    return;
  } else if (!form.value.photo) {
    uni.showToast({
      title: "请上传头像",
      icon: "none",
    });
    return;
  } else {
    request
      .post("/register", form.value)
      .then((response) => {
        uni.navigateTo({
          url: "../index", // 修改这里的路径
        });
        uni.showToast({
          title: "注册成功",
          icon: "success",
        });
      })
      .catch((error) => {
        uni.showToast({
          title: error.msg,
          icon: "none",
        });
      });
  }
}
</script>

<style lang="scss" scoped>
.newRegister {
  height: 100vh;
  background-color: #f8f8f8;
  .newRegisterBox {
    width: 90%;
    .header {
      display: flex;
      padding: 20rpx;
      margin-left: 20rpx;
      flex-direction: column;
      align-items: flex-start;
      .backIcon {
        font-size: 24rpx;
        cursor: pointer;
      }

      .welcome {
        font-size: 40rpx;
      }

      .title {
        font-size: 40rpx;
        font-weight: bold;
        margin-top: 20rpx;
      }
    }
    .data {
      width: 100vw;
      .avatar {
        display: flex;
        padding: 20rpx;
        justify-content: center;
        align-items: center;
        margin: 20rpx 0;
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

      .inputBox {
        padding: 20rpx;
        width: 85%;
        margin: auto;
        .input {
          padding: 10rpx;
          margin-top: 30rpx;
        }
      }

      .registerButton {
        width: 77%;
        padding: 15rpx;
        background-color: #ff6b81;
        color: #fff;
        border: none;
        border-radius: 5rpx;
        font-size: 25rpx;
        cursor: pointer;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
