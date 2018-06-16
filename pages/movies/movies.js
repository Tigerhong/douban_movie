// pages/movie/movie.js
let util = require("../../utils/util");//导入utils包中的util文件，用于转换星级level
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerShow: true,
    searchPanelShow: false,
    closeImgShow: false,
    inputText: '',
    showOrHide: "hidden"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载中...',
    })
    let inTheaters = app.globalData.BASEPATH + "v2/movie/in_theaters?count=3",
      comeingSoon = app.globalData.BASEPATH + "v2/movie/coming_soon?count=3",
      top250 = app.globalData.BASEPATH + "v2/movie/top250?count=3";

    // 调用三次不同的接口请求不同的数据
    this.getData(inTheaters, "inTheaters", "正在热映");
    this.getData(comeingSoon, "comeingSoon", "即将上映");
    this.getData(top250, "top250", "TOP250");
  },
  getData: function (url, setKey, slogan) {
    let that = this;
    wx.request({
      url: url,
      // data: { count: 3 }, // 页面中目前我们只需要3条数据
      header: { "Content-Type": "json" },
      success: function (res) {
        // 调用专门处理数据的函数
        // 参数： [ 数据， 接收结果的对象 ]
        that.processDoubanData(res.data.subjects, setKey, slogan);
      }
    })
  },
  onMoreTap(e) {
    let categroy = e.currentTarget.dataset.categroy;
    wx.navigateTo({
      url: 'more_movies/more_movies?categroy=' + categroy,
    })
  },
  processDoubanData: function (data, setKey, slogan) {
    var movie = [];
    for (let subject of data) {
      let temp = {}
      temp.title = subject.title;//标题
      temp.average = subject.rating.average.toFixed(1);//评分值
      temp.converageUrl = subject.images.large;//封面图
      // 唯一改变的地方：新增了一个关于星星控件的数组属性
      temp.stars = util.converToStarsArray(subject.rating.stars);
      temp.movieId = subject.id;//电影id
      movie.push(temp);
    }
    wx.hideLoading();
    wx.hideNavigationBarLoading();
    //往data中动态创建变量来保存数据
    this.setData({
      // 因为这里不能直接写setKey，所以用[]来包裹住变量key，相当于占位符
      [setKey]: {
        // 这里额外创建了一个对象，赋予movies属性我们的数据
        // 因为在后面，我们的模板是循环写的，所以在这里，
        // 我们需要让他们三个都有一个共同的属性值，方便模板循环遍历
        movies: movie,
        slogan: slogan
      },
      showOrHide: "visible"
    })
  },
  onBindFocus: function () {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      closeImgShow: true
    })
  },
  onSearch: function (e) {
    //获取输入框的值
    let val = e.detail.value;
    //拼接搜索的url
    let searchUrl = app.globalData.BASEPATH + "v2/movie/search??count=50&q=" + val;
    wx.showNavigationBarLoading()
    this.getData(searchUrl, 'searchMovies', '');
  },
  recover: function () {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      closeImgShow: false,
      inputText: ""
    })
  },
  onMovieTap(e) {
    let mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?mid=' + mid,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})