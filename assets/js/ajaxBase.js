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

  // 每次ajax请求成功之后，查看是否身份认证失败
  options.complete = function (res) {
    // 当这个ajax请求完成之后
    // 在complete函数中进行校验身份认证是否成功，如果失败，则需要重新登录
    console.log(res); // res是jQ封装的ajax对象， 通过responseJSON可以获取到服务器响应回来的数据
    let data = res.responseJSON; // 服务器响应回来的json数据
    if (data.status === 1 && data.message === "身份认证失败！") {
      // token 身份认证失败！需要重新登录获取最新的token ==> 回到登录页面，重新登录
      // 既然这个token是无效的，就没有必要存在了， 就可以删除了。
      localStorage.removeItem("token");
      location.href = "/home/login.html";
    }
  };
});
