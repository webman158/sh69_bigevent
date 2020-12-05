$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");

  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1 / 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 选择文件
  $("#chooseBtn").on("click", function () {
    $("#file").click();
  });

  //   当选择完图片之后，需要将选择的图片展示到裁切区域
  $("#file").on("change", function (e) {
    // console.log("改变了", e.target);
    let file = e.target.files[0];
    console.log(file);
    var newImgURL = URL.createObjectURL(file);
    console.log(newImgURL);

    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //   上传ajax
  $("#uploadBtn").on("click", function () {
    // 转化为 base64 格式的字符串
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 发送ajax请求
    $.ajax({
      url: "/my/update/avatar",
      type: "POST",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        // console.log(res);

        if (res.status !== 0) {
          return layer.msg("更新图片失败");
        }

        layer.msg("更新图片成功");
        // 更新渲染首页的头像和昵称
        window.parent.getUserInfo();
      },
    });
  });
});
