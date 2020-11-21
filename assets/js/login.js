$(function () {
  // 去注册账号
  $("#goToReg").on("click", function () {
    // 显示注册，隐藏登录
    $(".register").show();
    $(".login").hide();
  });

  // 去登录
  $("#goToLogin").on("click", function () {
    $(".register").hide();
    $(".login").show();
  });

  // 从全局的layui中导入form模块和弹出层模块
  let form = layui.form;
  let layer = layui.layer;

  // 表单校验
  form.verify({
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    // 自己添加的校验规则(两次输入的密码确保一致)
    repass: function (value, item) {
      // value 是当前校验的输入框的内容，item是当前校验输入框
      let pwd = $(".register input[name=password]").val();
      if (value !== pwd) {
        return "两次输入的密码不一致";
      }
    },
  });

  // 注册表单提交功能
  $("#regForm").on("submit", function (e) {
    // 阻止表单的默认行为
    e.preventDefault();

    // 步骤：
    // 1. 获取到表单内容
    // 2. 发送ajax请求
    // 3. 之后，清空表单内容
    // 4. 给出提示信息

    let data = $(this).serialize();

    $.ajax({
      url: "http://ajax.frontend.itheima.net/api/reguser",
      type: "POST",
      /* data: {
        username: xxx,
        password: yyyy
      }, */
      data,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          // return console.log("注册失败" + res.message);
          return layer.msg("注册失败" + res.message);
        }

        // console.log("注册成功！");
        // layer.msg("注册成功，请登录", () => {
        //   $("#goToLogin").click();
        // });

        layer.msg("注册成功，请登录");
        // 提示出来就切换了，可以等关闭之后在切换
        $("#goToLogin").click();
      },
    });
  });

  // 登录表单提交功能
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();

    let data = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "/api/login",
      data,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("登录失败");
        }

        // 1. 提示
        // layer.msg("登录成功！，即将跳转！");
        // 2. 将token信息存储到本地缓存中
        localStorage.setItem("token", res.token);
        // 3. 跳转到后台主页
        // location.href = "index.html";

        layer.msg("登录成功！，即将跳转！", () => {
          location.href = "index.html";
        });
      },
    });
  });
});
