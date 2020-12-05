$(function () {
  let form = layui.form;

  // 表单校验
  form.verify({
    nickname: function (value, item) {
      if (value.length > 6) {
        return "昵称需要在1-6字符间";
      }
    },
  });

  getUserInfo();
  // 发送ajax获取用户的基本信息，用于放到表单中展示出来
  function getUserInfo() {
    $.ajax({
      url: "/my/userinfo",
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg("获取用户基本信息失败！");
        }

        //   快速将数据填充到form表单中
        //给表单赋值
        // userForm 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
        form.val("userForm", res.data);
      },
    });
  }
  //   表单提交-发送ajax
  $("#form").on("submit", function (e) {
    e.preventDefault();

    let data = $(this).serialize();
    $.ajax({
      url: "/my/userinfo",
      type: "POST",
      data,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg("修改信息失败！");
        }

        layer.msg("修改信息成功！");
        // 需要更新页面中的昵称（导航上的和侧边栏的）
        window.parent.getUserInfo();
      },
    });
  });

  //   表单重置功能
  $("#resetBtn").on("click", function (e) {
    e.preventDefault();

    // 重新发送请求获取数据填充到表单中
    getUserInfo();
  });
});
