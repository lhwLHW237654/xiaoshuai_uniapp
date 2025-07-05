const process = "";
let baseUrl = "http://192.168.79.85:8080"; // 默认开发环境地址
// if (process.env.NODE_ENV !== "development") baseUrl = "https://serve.swznkj.top/print";
export default {
  request(options) {
    const userToken = uni.getStorageSync("userToken");
    options.header = {
      ...options.header,
      Authorization: userToken,
    };
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: (res) => {
          if (options.native) {
            resolve(res);
          }
          if (res.statusCode === 200) {
            if (res.data.code == 200) {
              resolve(res.data);
            }
            if (res.data.code == 400) {
              reject(res.data);
            }
            if (res.data.code == 403) {
              reject(res.data);
            }
            if (res.data.code == 401) {
              uni.redirectTo({
                url: "/pages/login/index", // 修改这里的路径
              });
            }
          } else {
            reject(res);
          }
        },
      });
    });
  },
  get(url, data = {}, options = {}) {
    const defaultOptions = {
      url: baseUrl + url,
      data: data,
      method: "get",
      ...options,
    };
    return this.request(defaultOptions);
  },
  post(url, data = {}, options = {}) {
    const defaultOptions = {
      url: baseUrl + url,
      data: data,
      method: "post",
      ...options,
    };
    return this.request(defaultOptions);
  },
};
