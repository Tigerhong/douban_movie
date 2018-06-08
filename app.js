//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 区别1：一般页面以Page({})声明，而我们app.js中则以App({})来声明
// 区别2：一般页面变量区域以data声明，在app.js中则以globalData声明
  globalData: {
    userInfo: null,
    ISPLAYING: false, // 播放状态的全局变量
     MUSICID: null, // 文章ID字段，初始化为null
     // 豆瓣本身的地址请求会发生403错误，所以在这里我们使用大佬提供的服务器地址
     BASEPATH: "https://douban.uieee.com/" 
  }
})