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
    <view class="time">
      <u-field v-model="time" label="时间" placeholder="请选择在一起时间">
        <template v-slot:right>
          <u-button size="mini" type="success" @click="selectTime">选择</u-button>
        </template>
      </u-field>
    </view>
    <view class="tag">
      <view class="tagData" v-for="(item, index) in tagData" :key="index">
        <u-field v-model="item.text" label="标签" placeholder="请输入标签">
          <template v-slot:right>
            <u-button size="mini" v-if="index === tagData.length - 1" type="success" @click="addText">添加</u-button>
            <u-button style="margin-left: 10rpx" v-if="item.text" size="mini" type="error" @click="delText(index)">删除</u-button>
          </template>
        </u-field>
      </view>
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
const time = ref("");
const show = ref(false);
const uToast1 = ref(null);
const tagData = ref([
  {
    text: "",
  },
]);
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
  tagData.value.push({ text: "" });
}
function delText(index) {
  if (tagData.value.length === 1) {
    uToast1.value.show({
      title: "最少留一条标签",
      type: "warning",
    });
    return;
  }
  tagData.value.splice(index, 1);
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
  time.value = `${value.year}-${value.month}-${value.day}`;
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
