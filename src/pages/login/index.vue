<template>
  <view class="container">
    <view class="login">
      <view class="welcome">Welcome</view>
      <view class="subtitle">登录我们的小世界</view>
      <form>
        <view class="inputGroup">
          <u-input v-model="form.uname" required placeholder="输入账号"></u-input>
          <hr />
        </view>
        <view class="inputGroup passwordGroup">
          <u-input v-model="form.password" required type="password" placeholder="输入密码"></u-input>
          <hr />
        </view>
        <button type="submit" class="loginButton" @click="entry">登录</button>
      </form>
      <view class="links">
        <view url="#" class="link" @click="forgetPassword"></view>
        <view url="#" class="link" @click="register">新用户注册</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, storeToRefs  } from "vue";
import request from "@/utils/request.js";
import user from "@/store/modules/userInfo.js";

const form = ref({
  uname: "",
  password: "",
});

//注册
function register() {
  uni.navigateTo({
    url: "./components/newRegister", // 修改这里的路径
  });
}
//忘记密码
function forgetPassword() {}

function entry() {
  if (form.value.uname === "") {
    uni.showToast({
      title: "请先输入账号",
      icon: "none",
    });
  } else if (form.value.password === "") {
    uni.showToast({
      title: "请先输入密码",
      icon: "none",
    });
    return;
  } else {
    request
      .post("/login", form.value)
      .then((response) => {
        uni.setStorageSync("token", response.data.token);
        user.userInfo = response.data;
        uni.switchTab({
          url: "../index/index", // 修改这里的路径
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
.container {
  position: relative;
  background-color: #f8d7da;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  box-sizing: border-box;

  .login {
    background-color: #fff;
    padding: 40rpx;
    border-radius: 60rpx 40rpx 0 60rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    width: 95vw;
    height: 80vh;

    .welcome {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .subtitle {
      font-weight: bold;
      margin-top: 20rpx;
      font-size: 50rpx;
      margin-bottom: 20rpx;
    }

    .inputGroup {
      padding: 20rpx;
      margin-bottom: 15rpx;
      font-weight: 900;
      label {
        display: block;
        margin-bottom: 5rpx;
      }

      input {
        width: 100%;
        padding: 8rpx;
        border: none;
        border-bottom: 1rpx solid #ccc;
        border-radius: 0;
      }
    }

    .passwordGroup {
      position: relative;

      .togglePassword {
        margin-right: 60rpx;
        position: absolute;
        right: 10rpx;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 30rpx;
      }
    }

    .loginButton {
      width: 90%;
      height: 90rpx;
      margin-top: 50rpx;
      background-color: #f06292;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background-color: #e91e63;
      }
    }

    .links {
      display: flex;
      font-weight: 900;
      justify-content: space-between;
      margin-top: 10px;

      .link {
        color: #666;
        text-decoration: none;
      }
    }
  }
}
</style>
