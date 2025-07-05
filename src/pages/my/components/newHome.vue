<template>
  <view class="newHome">
    <view class="background" @click="selectImage">
      <view>
        <u-image width="100%" height="450rpx" :src="imageData">
          <template v-slot:error>
            <view style="font-size: 24rpx">选择图片</view>
          </template>
        </u-image>
      </view>
    </view>
    <view style="padding: 20rpx">
      <u-form :model="form">
        <u-form-item label="时间" prop="time">
          <u-input v-model="form.time" />
          <u-button size="mini" type="success" @click="selectTime">选择</u-button>
        </u-form-item>
        <view class="tagData" v-for="(item, index) in form.tagData" :key="index" style="">
          <u-form-item label="标签">
            <u-input v-model="item.text" placeholder="请输入标签" />
            <u-button size="mini" type="success" v-if="index === form.tagData.length - 1" @click="addText" style="margin-left: 10rpx">添加</u-button>
            <u-button size="mini" type="error" v-if="form.tagData.length > 1" @click="delText(index)" style="margin-left: 10rpx">删除</u-button>
          </u-form-item>
        </view>
      </u-form>
    </view>
    <view class="btn">
      <u-button type="primary" @click="keep">保存</u-button>
    </view>
    <u-picker mode="time" v-model="show" :params="params" @confirm="getTime"></u-picker>
    <u-toast ref="uToast1" />
  </view>
</template>

<script setup>
import { ref } from "vue";
const show = ref(false);
const uToast1 = ref(null);
const form = ref({
  time: "",
  tagData: [
    {
      text: "",
    },
  ],
});
const imageData = ref("");
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
              imageData.value = base64Data;
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
function selectImage() {
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
function addText() {
  form.value.tagData.push({ text: "" });
}
function delText(index) {
  if (form.value.tagData.length === 1) {
    uToast1.value.show({
      title: "最少留一条标签",
      type: "warning",
    });
    return;
  }
  form.value.tagData.splice(index, 1);
}
const params = {
  year: true,
  month: true,
  day: true,
  hour: false,
  minute: false,
  second: false,
};
function getTime(value) {
  form.value.time = `${value.year}-${value.month}-${value.day}`;
}
function selectTime() {
  show.value = true;
}
function keep() {}
</script>

<style lang="scss" scoped>
.newHome {
  width: 100%;
  height: 100%;
  .background {
    height: 30%;
    background-color: rgb(242, 239, 239);
  }
  .time {
    height: 10%;
    padding: 20rpx;
  }
  .tag {
    padding: 20rpx;
    height: 50%;
    overflow: auto;
    .tagData {
    }
  }
  .btn {
    height: 10%;
  }
}
</style>
