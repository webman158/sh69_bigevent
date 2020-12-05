$(function () {
  let form = layui.form;
  let layer = layui.layer;

  // 添加表单的校验规则
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    // 新密码不能和原密码相同
    newPew: function (value, item) {
      if (value === $("[name=oldPwd]").val()) {
        return "新密码不能和原密码相同";
      }
    },

    // 确认密码必须和新密码相同
    rePwd: function (value, item) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次输入的密码不一致";
      }
    },
  });

  //   实现重置密码
  let $form = $("#pwdForm");
  $form.submit(function (e) {
    e.preventDefault();

    let data = $(this).serialize();
    $.ajax({
      url: "/my/updatepwd",
      type: "POST",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新密码失败" + res.message);
        }

        layer.msg("更新密码成功");

        // 重置密码
        $form.get(0).reset();
      },
    });
  });
});
