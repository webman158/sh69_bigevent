$(function () {
  let layer = layui.layer;
  let form = layui.form;

  // form表单结构
  let fromStr = `
    <form class="layui-form" id="cateForm">
        <div class="layui-form-item">
            <label class="layui-form-label">分类名称</label>
            <div class="layui-input-block">
            <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">分类别名</label>
            <div class="layui-input-block">
            <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
            <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
            </div>
        </div>
    </form>
  `;

  getList();
  // 获取所有文章类别
  function getList() {
    $.ajax({
      url: "/my/article/cates",
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg("获取文章分类列表失败！");
        }

        layer.msg("获取文章分类列表成功！");

        let htmlStr = template("tpl_tr", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  //   添加分类的按钮功能;
  let addIndex; // 存储对应的弹出框的id，便于后期关闭弹出框
  $("#addBtn").on("click", function () {
    addIndex = layer.open({
      title: "添加文章分类",
      type: 1,
      area: "500px",
      content: $("#tpl_form").html(),
    });
  });

  // 新增分类功能
  $("body").on("submit", "#cateForm", function (e) {
    e.preventDefault();

    let data = $(this).serialize();

    $.ajax({
      url: "/my/article/addcates",
      type: "POST",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("添加分类失败!");
        }
        layer.msg("添加分类成功!");
        // 关闭弹出框
        layer.close(addIndex);

        // 重新获取最新的所有的数据
        getList();
      },
    });
  });

  // 编辑按钮点击功能
  let editIndex;
  $("tbody").on("click", ".editBtn", function () {
    // 弹出框
    editIndex = layer.open({
      title: "修改文章分类",
      type: 1,
      area: "500px",
      content: $("#tpl_edit_form").html(),
    });

    // 发送数据，在把获取到数据渲染到表单中
    $.ajax({
      url: "/my/article/cates/" + $(this).attr("data-id"),
      success: function (res) {
        // console.log(res);

        if (res.status !== 0) {
          return layer.msg("获取文章分类数据失败！");
        }

        // 添加数据到form中
        form.val("editForm", res.data);
      },
    });

    // 获取到数据 ==> 编辑按钮上的属性
    /* let obj = {
      name: $(this).attr("data-name"),
      alias: $(this).attr("data-alias"),
    };
    
    // 把数据填充到form表单中 ==> 需要注意：如果是DOM节点获取到数据，需要等到弹出框的form出现才可以设置以下代码，否则没有效果
    form.val("editForm", obj);
    */
  });

  // 编辑修改
  $("body").on("submit", "#editForm", function (e) {
    e.preventDefault();

    let data = $(this).serialize();
    $.ajax({
      url: "/my/article/updatecate",
      type: "POST",
      data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新分类信息成失败!");
        }
        layer.msg("更新分类信息成功!");
        // 关闭弹出框
        layer.close(editIndex);
        // 重新获取最新的所有的数据
        getList();
      },
    });
  });

  // 删除功能
  $("tbody").on("click", ".removeBtn", function () {
    let id = $(this).attr("data-id");
    layer.confirm("确认删除吗?", { icon: 3, title: "提示" }, function (index) {
      //do something

      $.ajax({
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除失败");
          }

          layer.msg("删除成功");
          // 重新获取
          getList();
          // 关闭弹出框
          layer.close(index);
        },
      });
    });
  });
});
