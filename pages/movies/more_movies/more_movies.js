// pages/movies/more_movie/more_movies.js
let utils = require("../../../utils/util");//导入utils包中的util文件，用于转换星级level
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    totalCount: 0,
    isShowLoadMore:false,
    loadMoreText: "正在加载更多..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取点击更多传过来的我们绑定的标题slogan值
    let [that, categroy] = [this, options.categroy];
    this.data.barTitle = categroy;

    // 定义一个接口路径的变量
    let interfaceUrl = null;
    //显示标题旁边的loading
    wx.showNavigationBarLoading();
    //显示中间loading
    wx.showLoading({
      title: '正在加载',
    })
    // 根据标题判断请求路径
    switch (categroy) {
      case "正在热映":
        interfaceUrl = app.globalData.BASEPATH + "v2/movie/in_theaters";
        utils.http(interfaceUrl, that.precessDoubanData);
        break;
      case "即将上映":
        interfaceUrl = app.globalData.BASEPATH + "v2/movie/coming_soon";
        utils.http(interfaceUrl, that.precessDoubanData);
        break;
      default:
        interfaceUrl = app.globalData.BASEPATH + "v2/movie/top250";
        utils.http(interfaceUrl, that.precessDoubanData);
    }
    // 保存当前页面的数据请求地址，方便其他函数使用
    this.data.requestUrl = interfaceUrl;
  },
  precessDoubanData(data) {
    let movie = [];
    for (let subject of data.subjects) {
      let temp = {}
      temp.title = subject.title;
      temp.average = subject.rating.average.toFixed(1);
      temp.converageUrl = subject.images.large;
      temp.movieId = subject.id;
      temp.stars = utils.converToStarsArray(subject.rating.stars);
      movie.push(temp);
    }
    let moviesList = this.data.movies.concat(movie);
    // 保存当前电影总共条数，方便下拉加载使用
    this.data.totalCount += movie.length;
    this.setData({
      movies: moviesList
    })
    if(movie.length==0){
      this.setData({
        isShowLoadMore: true,
        loadMoreText: "--人家也是有底线的--"
      })
    }else{
      this.setData({
        isShowLoadMore: false,
      })
    }
    //去除loading
    wx.hideLoading();
    //去除标题旁边的loading
    wx.hideNavigationBarLoading();
    // 去除下拉Loding
    wx.stopPullDownRefresh();
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(e) {
    wx.showNavigationBarLoading();
    this.data.movies = [];
    // 因为请求数据，就会自增20，所以我们在这里减去这20就可以达到我们想要的数据条数了
    this.data.totalCount = 0;
    let requestUrl = this.data.requestUrl + "?count=20";
    utils.http(requestUrl, this.precessDoubanData);
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(e) {
    wx.showNavigationBarLoading();
    // 开启下拉加载时页面顶部的加载动效
    let requestUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    this.setData({
      isShowLoadMore:true,
      loadMoreText: "正在加载更多..."
    })
    utils.http(requestUrl, this.precessDoubanData);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    // 设置导航标题
    wx.setNavigationBarTitle({
      title: that.data.barTitle
    })
  },
  onMovieTap(e) {
    let mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?mid=' + mid
    })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})