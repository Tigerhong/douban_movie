const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 将数组转换为数组
function converToStarsArray(stars) {
  let num = parseInt(stars.toString().substr(0, 1));
  let arr = [], temp = 0;
  for (let i = 0; i < 5; i++) {
    temp = i >= num ? 0 : 1;
    arr.push(temp);
  }
  return arr;
}
function http(url, callBack) {
  let that = this;
  wx.request({
    url: url,
    header: { "Content-Type": "json" },
    success(res) {
      // 切记把值传给一个回调函数
      callBack(res.data);
    },
    fail(err) {
      console.log(err)
    }
  });
}

module.exports = {
  formatTime: formatTime,
   converToStarsArray: converToStarsArray,
   http: http
}
