// pages/main/talk_details/talk_details.js
let details = require("../data/posts-data.js");
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: {},
    isPlaying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let aidTemp = options.aid
    --aidTemp
    console.log("hh" + aidTemp)
    console.log(details.postsList.articleList[aidTemp])
    console.log(details.postsList.articleList[aidTemp].thumbnail)
    this.setData({
      articles: details.postsList.articleList[aidTemp],
    })
    //从本地收藏状态列表中获取id文章的状态
    let colBool = wx.getStorageSync(`colList[${aidTemp}]`);
    if (!colBool) {
      wx.setStorageSync(`colList[${aidTemp}]`, false);
    }
    this.setData({
      col: wx.getStorageSync(`colList[${aidTemp}]`)
    })
    //音乐播放的监听
    // 由于是监听，所以我们在这里就把监听事件放在onload函数里。
    // 监听播放： wx.onBackgroundAudioPlay（callback）
    // 监听暂停： wx.onBackgroundAudioPause（callback）
    // callback：回调函数中可以做自己想写的代码块
    let that = this;
    // 检验播放的文章ID是否一致，避免点击其余文章，也出现正在播放状态
    if (app.globalData.MUSICID === that.data.articles.id) {
      that.setData({
        isPlaying: app.globalData.ISPLAYING
      })
    }
    //监听音乐启动
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        isPlaying: true
      })
    })
    //监听音乐暂停
    wx.onBackgroundAudioPause(function(){
      that.setData({
        isPlaying: false
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  openMusic: function () {
    //点击了打开音乐按钮
   let that=this;
   //得到播放状态的值
   let isPlaying = this.data.isPlaying;
    // 根据状态值来控制是何操作
   if (!isPlaying){
     // 未播放状态下，点击按钮执行播放状态
     // 知识点1：播放音频 wx.playBackgroundAudio({音频路径，音频标题，音频封面路径})
     // 知识点2：小程序大小限制为2M，所以不可能让我们把视频和音频等大文件放在本地，
     // 所以这里的路径统一为网络路径，切记，否则配置不生效！
     // 知识点3：暂停播放 wx.pauseBackgroundAudio();
     // 修改播放状态
     this.setData({
       isPlaying: true
     })

     wx.playBackgroundAudio(that.data.articles.music)
     app.globalData.ISPLAYING = true;
     // 将当前文章ID记录在app.js中的全局变量MUSICID中。【唯一改变的地方】
     app.globalData.MUSICID = that.data.articles.id;

   }else{
       // 播放状态下，点击按钮执行暂停状态
    wx.stopBackgroundAudio();
    // 修改播放状态
    this.setData({
      isPlaying: false
    })
    app.globalData.ISPLAYING = false;
    // 将当前文章ID记录在app.js中的全局变量MUSICID中。【唯一改变的地方】
    app.globalData.MUSICID = that.data.articles.id;
   }
  },
  clickCollection: function (e) {
    //点击了收藏事件
    let id = e.currentTarget.dataset.id;
    if(this.data.col){
      this.setData({
        col:false
      })
      //将id收藏状态设置为false
      wx.setStorageSync(`colList[${--id}]`, false);
      wx.showToast({
        title: "取消收藏成功~",
        icon: "none"
      })
    }else{
      this.setData({
        col: true
      })
      //将id收藏状态设置为true
      wx.setStorageSync(`colList[${--id}]`, true);
      wx.showToast({
        title: "收藏文章成功~",
        icon: "none"
      })
    }
  },
  clickShare: function () {
    //显示操作菜单
    wx.showActionSheet({
      itemList: ["分享到QQ",
        "分享到微信好友",
        "分享到朋友圈",
        "分享到新浪微博"],
      itemColor: "#000",
      success(res) {
        var toast = [
          "你确定要分享到QQ吗？",
          "你确定要分享给微信好友吗？",
          "你确定要分享到朋友圈吗？",
          "你确定要分享到新浪微博吗？"
        ]
        //显示模态弹窗
        wx.showModal({
          title: toast[res.tapIndex],
          content: '咱们今天讲的是交互反馈，这个很常用！',
          showCancel: true,
          success(res) {
            if (res.confirm) {
              wx.showToast({
                title: "分享成功！",
                icon: "none"
              })
            } else if (res.cancel) {
              wx.showToast({
                title: "取消分享！",
                icon: "none"
              })
            } else {
              wx.showToast({
                title: "分享失败！",
                icon: "none"
              })
            }
          }
        })
      }, fail(err) {
        wx.showToast({
          title: "取消分享！",
          icon: "none"
        })
        console.log(err)
      }
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})