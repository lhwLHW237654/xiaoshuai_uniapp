<template>
  <view class="remember">
    <view class="data">
      <view class="dataBox">
        <u-input v-model="value" type="textarea" :maxlength="500" placeholder="这一刻的想法..." />
        <view class="upload">
          <view v-for="(item, index) in imageData" :key="index" class="imageContainer">
            <u-image width="100%" height="100%" :src="item.url" @click="delImage(index)"></u-image>
          </view>
          <view v-if="imageData.length < 9" class="uploadBox c">
            <u-icon name="plus" size="60" color="#82848a" @click="uploadBtn"></u-icon>
          </view>
        </view>
      </view>
      <view class="dataBtn">
        <u-cell-group>
          <u-cell-item icon="map" title="所在位置" @click="mapBtn" :value="mapData"></u-cell-item>
          <u-cell-item icon="heart" title="此刻心情" @click="heartBtn" :value="moodData"></u-cell-item>
        </u-cell-group>
      </view>
    </view>
    <view class="operate"></view>
    <view class="btn">
      <u-button type="primary" @click="publishs">发 布</u-button>
    </view>
    <view>
      <u-popup v-model="show" mode="center" width="90%" height="30%" border-radius="20">
        <view style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%">
          <view style="display: flex; justify-content: space-around; width: 100%; margin-bottom: 10px">
            <button
              @click="selectMood('😊 开心')"
              style="padding: 10px; font-size: 16px; border-radius: 8px; background-color: #ffeb3b; flex: 1; margin: 5px">
              😊 开心
            </button>
            <button
              @click="selectMood(' 😢 难过')"
              style="padding: 10px; font-size: 16px; border-radius: 8px; background-color: #90caf9; flex: 1; margin: 5px">
              😢 难过
            </button>
          </view>
          <view style="display: flex; justify-content: space-around; width: 100%">
            <button
              @click="selectMood('😆 激动')"
              style="padding: 10px; font-size: 16px; border-radius: 8px; background-color: #ff7043; flex: 1; margin: 5px">
              😆 激动
            </button>
            <button
              @click="selectMood('😌 平静')"
              style="padding: 10px; font-size: 16px; border-radius: 8px; background-color: #a5d6a7; flex: 1; margin: 5px">
              😌 平静
            </button>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { onShow, onUnload } from "@dcloudio/uni-app";
const value = ref("");
const show = ref(false);
const moodData = ref("");
const mapData = ref("");
//当前默认为科创中心
const mapLatLotVal = ref({
  latitude: 33.953023,
  longitude: 116.886558,
});

function selectMood(mood) {
  moodData.value = mood;
  show.value = false;
}

const imageData = ref([]); // 图片

// 转base64
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
              imageData.value.push({
                url: base64Data,
              });
              console.log("Image uploaded:", base64Data); // Debugging log
            } catch (error) {
              reject({
                filePath,
                error: error,
              });
            }
          };
          fileReader.onerror = (error) =>
            reject({
              filePath,
              error: error,
            });
          fileReader.readAsDataURL(file);
        });
      });
    });
  });
  return Promise.all(uploadPromises);
}
onUnload(() => {
  imageData.value = []; //图片
  moodData.value = ""; //心情
  mapData.value = ""; //位置
});
onShow(() => {
  getLocationData();
});
//删除图片
function delImage(index) {
  imageData.value.splice(index, 1);
}

// 上传
function uploadBtn() {
  uni.chooseImage({
    count: 9 - imageData.value.length,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: function (res) {
      const tempFilePaths = res.tempFilePaths;
      uploadUrlApi(tempFilePaths);
    },
  });
}

// 地图
function mapBtn() {
  uni.chooseLocation({
    latitude: mapLatLotVal.value.latitude,
    longitude: mapLatLotVal.value.longitude,
    useSecureNetwork: true,
    success: (res) => {
      if (!res || !res.name) {
        uni.showToast({
          title: "地址无效，请重试",
          icon: "none",
        });
        return;
      }
      mapData.value = res.name;
      mapLatLotVal.value.latitude = res.latitude;
      mapLatLotVal.value.longitude = res.longitude;
      console.log(res);
      // locationName.value = res.name || res.address
      // latitude.value = res.latitude
      // longitude.value = res.longitude
      uni.showToast({
        title: "定位成功",
        icon: "success",
      });
    },
    fail: (err) => {
      console.warn("选择失败：", err);
      uni.showToast({
        title: "无法获取位置",
        icon: "none",
      });
    },
    complete: () => {},
  });
}

function getLocationData() {
  uni.getLocation({
    type: "gcj02",
    geocode: true,
    success: function (res) {
      console.log(res);
      mapLatLotVal.value.latitude = res.latitude;
      mapLatLotVal.value.longitude = res.longitude;
      console.log("当前位置的经度：" + res.longitude);
      console.log("当前位置的纬度：" + res.latitude);
    },
    fail: function (err) {
      console.log(err);
      uni.showToast({
        duration: 2000,
        title: "获取位置信息失败",
        icon: "none",
      });
    },
  });
}
// 心情
function heartBtn() {
  show.value = true;
}

// 发布
function publishs() {
  console.log("Publishing with images:", imageData.value);
}
</script>

<style lang="scss" scoped>
.remember {
  width: 100%;
  height: 100%;

  .data {
    padding: 30rpx;

    .dataBox {
      height: 60vh;
      overflow-y: auto;

      .upload {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

        .imageContainer,
        .uploadBox {
          width: 30%;
          height: 100px;
          background-color: rgb(239, 237, 237);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .dataBtn {
      height: 25vh;
    }
  }

  .operate {
  }

  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    text-align: center;
  }
}
</style>
