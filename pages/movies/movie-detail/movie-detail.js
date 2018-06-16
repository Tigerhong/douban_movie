// pages/movies/movie-detail/movie-detail.js
let utils = require("../../../utils/util")
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    showOrHide: "hidden"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let movieIdTemp = options.mid;
    let requestUrl = app.globalData.BASEPATH + "v2/movie/subject/" + movieIdTemp;
    utils.http(requestUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData(data) {
    if (!data) return false;

    let director = {
      avater: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avaters != null) {
        director.avater = data.directors[0].avaters.large;
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: utils.converToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: utils.convertToCastString(data.casts),
      castsInfo: utils.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie,
      showOrHide: "visible"
    })
    wx.setNavigationBarTitle({
      title: this.data.movie.title
    })
    wx.hideNavigationBarLoading();
  },
  viewMoviePostImg: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  showPreviewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    var imgs = e.currentTarget.dataset.imgs;
    var imgLis=[];
    for(var index in imgs){
      imgLis.push(imgs[index].img)
    }
    wx.previewImage({
      current: src,
      urls: imgLis
    })
  },
  onShareAppMessage: function () {

  }
})