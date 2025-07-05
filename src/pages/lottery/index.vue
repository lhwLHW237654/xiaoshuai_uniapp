<template>
  <view class="wrap">
    <u-waterfall v-model="list" ref="uWaterfall1">
      <template #left="{ leftList }">
        <view class="demo-warter" v-for="(item, index) in leftList" :key="item.id">
          <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
          <view class="demo-title">{{ item.title }}</view>
          <view class="demo-shop">{{ item.shop }}</view>
        </view>
      </template>
      <template #right="{ rightList }">
        <view class="demo-warter" v-for="(item, index) in rightList" :key="item.id">
          <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load>
          <view class="demo-title">{{ item.title }}</view>
          <view class="demo-shop">{{ item.shop }}</view>
        </view>
      </template>
    </u-waterfall>
    <u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";


const loadStatus = ref("loadmore");
const uWaterfall1 = ref(null);

const list = [
  {
    price: 35,
    title: "北国风光，千里冰封，万里雪飘",
    shop: "李白杜甫白居易旗舰店",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg",
  },
  {
    price: 75,
    title: "望长城内外，惟余莽莽",
    shop: "李白杜甫白居易旗舰店",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
  },
  {
    price: 385,
    title: "大河上下，顿失滔滔",
    shop: "李白杜甫白居易旗舰店",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
  },
  {
    price: 784,
    title: "欲与天公试比高",
    shop: "李白杜甫白居易旗舰店",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
  },
  {
    price: 7891,
    title: "须晴日，看红装素裹，分外妖娆",
    shop: "李白杜甫白居易旗舰店",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
  },
  {
    price: 2341,
    shop: "李白杜甫白居易旗舰店",
    title: "江山如此多娇，引无数英雄竞折腰",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
  },
  {
    price: 661,
    shop: "李白杜甫白居易旗舰店",
    title: "惜秦皇汉武，略输文采",
    image: "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
  },
];

onReachBottom(() => {
  loadStatus.value = "loading";
  setTimeout(() => {
    addRandomData();
    loadStatus.value = "loadmore";
  }, 1000);
});

</script>

<style>
page {
  background-color: rgb(240, 240, 240);
}
</style>
<style lang="scss" scoped>
.demo-warter {
  border-radius: 8px;
  margin: 5px;
  background-color: #ffffff;
  padding: 8px;
  position: relative;
}

.u-close {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
}

.demo-image {
  width: 100%;
  border-radius: 4px;
}

.demo-title {
  font-size: 30rpx;
  margin-top: 5px;
  color: $u-main-color;
}

.demo-tag {
  display: flex;
  margin-top: 5px;
}

.demo-tag-owner {
  background-color: $u-type-error;
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 4rpx 14rpx;
  border-radius: 50rpx;
  font-size: 20rpx;
  line-height: 1;
}

.demo-tag-text {
  border: 1px solid $u-type-primary;
  color: $u-type-primary;
  margin-left: 10px;
  border-radius: 50rpx;
  line-height: 1;
  padding: 4rpx 14rpx;
  display: flex;
  align-items: center;
  border-radius: 50rpx;
  font-size: 20rpx;
}

.demo-price {
  font-size: 30rpx;
  color: $u-type-error;
  margin-top: 5px;
}

.demo-shop {
  font-size: 22rpx;
  color: $u-tips-color;
  margin-top: 5px;
}
</style>
