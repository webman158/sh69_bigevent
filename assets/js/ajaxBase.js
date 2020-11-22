$.ajaxPrefilter(function (options) {
  // 每次通过jQ发送ajax请求前就会执行该函数
  // 通过该函数的形参options就可以获取到每次的请求的配置项
  // 可以动态修改配置项

  // 在url地址的前面加上根路径
  options.url = "http://ajax.frontend.itheima.net" + options.url;
  //   console.log(options.url);

  // 处理headers的请求头（token）
  if (options.url.indexOf("/my/") !== -1) {
    //   有/my/
    //   必须在/my的接口中才需要有token
    options.headers = {
      Authorization: localStorage.getItem("token"),
    };
  }
});
