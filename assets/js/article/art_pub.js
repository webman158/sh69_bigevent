$(function () {
  let layer = layui.layer;
  let form = layui.form;

  // 初始化下拉框
  getLateOption();
  function getLateOption() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取失败");
        }

        let str = ``;
        res.data.forEach((item) => {
          str += `
            <option value="${item.Id}">${item.name}</option>
          `;
        });
        $("[name=cate_id]").append(str);
        // 动态添加的option到下拉框中，需要动态渲染form表单
        form.render();
      },
    });
  }

  // 初始化富文本编辑器
  initEditor();

  // 1. 初始化图片裁剪器
  let $image = $("#image");

  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 选择封面
  $("#chooseAvatar").click(function () {
    // 模拟点击文件域
    $("#file").click();
  });

  $("#file").on("change", function () {
    let file = this.files[0];
    let newImgURL = URL.createObjectURL(file);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  // 上传form数据
  let state = "已发布";

  // 点击草稿按钮
  $("#saveBtn").click(function () {
    state = "草稿";
  });

  $("#form").on("submit", function (e) {
    e.preventDefault();

    // 往data数据中，追加裁切的图片
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob((blob) => {
        // 通过FormData收集到表单数据
        let data = new FormData(this);
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        data.append("cover_img", blob);
        data.append("state", state);

        data.forEach((item) => console.log(item));

        $.ajax({
          url: "/my/article/add",
          type: "POST",
          data,
          // 发送FormData数据的时候，需要设置两个配置
          contentType: false,
          processData: false,
          success: function (res) {
            console.log(res);

            if (res.status !== 0) {
              return layer.msg("发布文章失败！");
            }

            layer.msg("发布文章成功！");
            // 跳转到文章列表
            location.href = "/article/art_list.html";
          },
        });
      });
  });
});
