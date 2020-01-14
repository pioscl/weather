// pages/weather/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cityList: [],
    weather: '',
    weatherDetailType: "weather_desc_type_hourly",
    cityname:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var cityList = wx.getStorageSync("cityList") || [];
    // this.setData({
    //   cityList: cityList,
    //   weather: cityList/*测试*/
    // })
    // console.info("城市列表");
    // console.info(cityList);

    // this.queryWeather();
    console.info(app.globalData.userInfo);

    this.getUserLocation();
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'cityname',
      success: function (res) {
        that.setData({
          cityname: res.data
        });
      },
    })
    this.getUserLocation();
  },
  
  getUserLocation:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        if(that.data.cityname==''){
          that.queryWeatherwithxy(res);
        }else{
          that.queryWeather(res);
        }
        
      },
    })
  },
  queryWeather: function (res) {
    var that = this;
    wx.request({
      url: 'https://jisutqybmf.market.alicloudapi.com/weather/query',
      header: {
        "Authorization": "APPCODE 1592700e361f49e8985afe13e7508813"
      },
      data: {
        'city': that.data.cityname
      },
      method: "GET",
      success: function (resRequest) {

        console.info("HTTP - GET")
        console.info(resRequest)

        if (resRequest.statusCode === 200 && resRequest.data.status == 0) {
          var result = resRequest.data.result;
          that.setData({
            weather: result
          });
          wx.setStorageSync("weather", result);
        }
      }
    })
  },


  queryWeatherwithxy: function (res) {
    var that = this;
    wx.request({
      url: 'https://jisutqybmf.market.alicloudapi.com/weather/query',
      header: {
        "Authorization": "APPCODE 1592700e361f49e8985afe13e7508813"
      },
      data: {
        'location': res.latitude + "," + res.longitude
      },
      method: "GET",
      success: function (resRequest) {

        console.info("HTTP - GET")
        console.info(resRequest)

        if (resRequest.statusCode === 200 && resRequest.data.status == 0) {
          var result = resRequest.data.result;
          that.setData({
            weather: result
          });
          wx.setStorageSync("weather", result);
        }
      }
    })
  },


  onPullDownRefresh:function() {
    var that = this
    wx.showNavigationBarLoading()//在标题栏中显示加载
    that.onShow()
    setTimeout(function () {
      wx.hideNavigationBarLoading()//完成停止加载
      wx.stopPullDownRefresh()//停止下拉刷新
    },1500);
  },

  getCityList: function () {
    var that = this;
    wx.request({
      url: 'https://jisutqybmf.market.alicloudapi.com/weather/city',
      header: {
        "Authorization": "APPCODE 8ec0a561bc7b483c88e312de788c2319"
      },
      method: "GET",
      success: function (resRequest) {

        console.info("HTTP - GET")
        console.info(resRequest)

        if (resRequest.statusCode === 200 && resRequest.data.status == 0) {
          var result = resRequest.data.result;
          that.setData({
            cityList: result
          });
          wx.setStorageSync("cityList", result);
        }
      }
    })
  },

  //切换小时/天
  weatherDetailTypeClick: function (e) {
    console.info(e.currentTarget.id);
    const index = e.currentTarget.id;
    this.setData({
      weatherDetailType: index
    });
  },

})