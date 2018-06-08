// pages/main/main.js
var postsData = require("/data/posts-data.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    articles: [],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      banners: postsData.postsList.bannerList,
      articles: postsData.postsList.articleList
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this;
    let shareObj = {
      title: "影视大爆炸社区爆文",
      path: '/pages/talk/talk',
      success: function (res) {
        // 转发成功之后的回调
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中  为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
    return shareObj;
  }, 
  //点赞点击事件
  likeThis: function (e) {
    let [that, index] = [
      this,
      --e.target.dataset.id
    ];
    let status = that.data.articles[index].canLike;
    if (status) {
      let likeCount = that.data.articles[index].likes;
      that.setData({
        ["articles[" + index + "].likes"]: ++likeCount,
        ["articles[" + index + "].canLike"]: false
      })
    } else {
      wx.showToast({
        title: '您已经点过赞啦~',
        icon: "none",
        duration: 2000
      })
    }
  },
  goToDetails:function(e){
    // console.log(e)
    let aid=e.currentTarget.dataset.aid
   wx.navigateTo({
     url: 'talk_details/talk_details?aid='+aid,
   })
  }
})