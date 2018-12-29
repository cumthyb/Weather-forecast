import formatLocation from "./format-location.js";
import { http } from "../../util/util.js";

let app = getApp();
let config = app.globalData.config;
let cities = ["beijing", "shanghai", "wuhan", "tianjin", "shenzhen"];

const commonParam = {
  key: config.weatherKey,
  location: "beijing",
  language: "zh-Hans",
  unit: "c"
};

Page({
  data: {
    nowTime: new Date(),
    bgUrl: config.BG_IMG_BASE_URL,
    cloudImgUrl: config.CLOUD_IMG_URL,
    locationUrl: config.LOCATION_IMG_URL,
    weather: {},
    position:"",
    indicatorDots: true,
    autoplay: false,
    vertical: false,
    interval: 1000,
  },
  onLoad(query) {
    // 页面加载
    // console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.getLocation();
    this.imgTap()
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: "My App",
      desc: "My App description",
      path: "pages/index/index"
    };
  },
  getLocation() {
    var that = this;
    dd.getLocation({
      type:1,
      success(res) {
        that.setData({
          location: formatLocation(res.longitude, res.latitude),
          position:`${res.country} ${res.province} ${res.city}`
        });
        commonParam.location=res.city
        console.log('commonParam.location=res.city',res.city)
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            const element = res[key];
            console.log(`${key}`,element)
          }
        }
        console.log("位置：",res.longitude)
      },
      fail() {
        dd.alert({ title: "定位失败" });
      }
    });
  },
  imgTap(e) {
    let index = Math.trunc(Math.random() * 4 + 1);
    // commonParam.location = cities[index];
    // commonParam.location = cities[index];
    this.getLocation();
    this.getWeatherNow();
    this.getWeatherHour();
    // //this.getWeatherDay();
    this.getLifeSuggestion();
    this.getAirQuality()
  },
  getAirQuality(){
    let _this = this;
    let url = config.airQualityUrl;
    dd.http
      .get(url, commonParam)
      .then(function(r) {
        debugger
        let air = r.data.results[0].air.city;
        _this.setData({
          "weather.air": air,
        });
      })
      .catch(function(e) {
        console.log(e);
        dd.alert({ title: e });
      });
  },
  getWeatherNow() {
    let _this = this;
    let url = config.nowWeatherUrl;
    http
      .get(url, commonParam)
      .then(function(r) {
        let now = r.data.results[0].now;
        now.cloudImgURL = `${_this.data.cloudImgUrl}/${now.code}.png`;
        _this.setData({
          "weather.now": now,
          "weather.update": _this.formatDateTime(r.data.results[0].last_update)
        });
      })
      .catch(function(e) {
        console.log(e);
        dd.alert({ title: e });
      });
  },
  getWeatherHour() {
    let _this = this;
    let url = config.hourlyWeatherUrl;
    http
      .get(url, commonParam)
      .then(function(r) {
        _this.setData({
          "weather.hourly": _this.formatWeatherHour(r.data.results[0].hourly)
        });
        console.log("weather.hourly", _this.data.weather.hourly);
      })
      .catch(function(e) {
        console.log(e);
        dd.alert({ title: e });
      });
  },
  getWeatherDay() {
    let _this = this;
    let url = config.dailyWeatherUrl;
    http
      .get(url, commonParam)
      .then(function(r) {
        _this.setData({
          "weather.daily": r.data.results[0].daily
        });
        console.log("weather.daily", _this.data.weather.daily);
      })
      .catch(function(e) {
        console.log(e);
        dd.alert({ title: e });
      });
  },
  getLifeSuggestion() {
    let _this = this;
    let url = config.lifestyleUrl;
    http
      .get(url, commonParam)
      .then(function(r) {
        let arr = [];
        arr.push(r.data.results[0].suggestion.ac);
        arr.push(r.data.results[0].suggestion.air_pollution);
        arr.push(r.data.results[0].suggestion.dating);
        arr.push(r.data.results[0].suggestion.hair_dressing);
        arr.push(r.data.results[0].suggestion.sport);
        _this.setData({
          "weather.life": arr
        });
        console.log("weather.life", _this.data.weather.life);
      })
      .catch(function(e) {
        console.log(e);
        dd.alert({ title: e });
      });
  },
  formatDateTime(dateTime) {
    // 2015-09-25T22:45:00-07:00
    return dateTime.replace(
      /(\d+?)-(\d+?)-(\d+?)[a-zA-Z]+?(\d+?):(\d+)(?:[^]+)/,
      "$1-$2-$3 $4:$5"
    );
  },
  formatWeatherHour(weathers) {
    let arr=[];
    weathers.map((weather,index) => {
      let cloudImgURL = `${this.data.cloudImgUrl}/${weather.code}.png`;
      weather.cloudImgURL = cloudImgURL;
      if ((index)%3===0) {
        arr.push([weather])
      }
      else{
        let length=arr.length
        arr[length-1].push(weather)
      }
    });
    return arr
  }
});
