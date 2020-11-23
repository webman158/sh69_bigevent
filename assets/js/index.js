$(function () {
  // 调用接口，获取用户头像昵称信息
  getUserInfo();

  // 退出功能
  $("#logout").on("click", function () {
    // 处理事情：
    // 1. 弹框询问
    // 2. 确认之后，清除本地存储的token信息
    // 3. 跳转页面到登录页面 login.html

    // 1.
    layer.confirm("确认退出?", { icon: 3, title: "提示" }, function (index) {
      // 2.
      localStorage.removeItem("token");

      // 3.
      location.href = "/home/login.html";

      layer.close(index);
    });
  });
});

let layer = layui.layer;

// 获取用户头像昵称信息
function getUserInfo() {
  $.ajax({
    url: "/my/userinfo",
    /* headers: {
      // 处理请求头
      Authorization: localStorage.getItem("token"),
    }, */
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layer.msg(res.message);
      }

      // 弹框提示
      layer.msg(res.message);

      //   渲染展示头像和昵称
      renderUserInfo(res.data);
    },
  });
}

// 渲染展示头像和昵称
let $welcome = $("#welcome");
let $avatar = $(".layui-nav-img");
let $textAvatar = $(".text-avatar");
function renderUserInfo(data) {
  // 处理昵称
  // 优先展示昵称，没有昵称才展示用户名
  let name = data.nickname || data.username;
  $welcome.text("欢迎 " + name);

  // 处理头像 看用户是否有上传头像，没有的话展示文字头像（.text-avatar）
  if (data.user_pic) {
    //   有头像 ==> 显示头像，隐藏文字头像
    $avatar.attr("src", data.user_pic).show();
    $textAvatar.hide();
  } else {
    //   没有头像 ==> 显示文字头像，隐藏头像
    let first = name[0].toUpperCase();
    $textAvatar.text(first).show();
    $avatar.hide();
  }
}
