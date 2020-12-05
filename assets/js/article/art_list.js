$(function () {
  let form = layui.form;
  let laypage = layui.laypage;

  // 查询对象
  let query = {
    pagenum: 1, // 页码值
    pagesize: 2, // 每页显示多少条数据
    cate_id: "", //	文章分类的 Id
    state: "", //	文章的状态，可选值有：已发布、草稿
  };

  // 获取列表
  getList();
  function getList() {
    $.ajax({
      url: "/my/article/list",
      data: query,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layer.msg("获取失败");
        }

        layer.msg("获取成功");
        $("tbody").html(template("tpl", res));

        // 渲染分页
        renderPage(res.total);
      },
    });
  }

  // 渲染分页函数
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", // 注意，这里的 test1 是 ID，不用加 # 号
      count: total, // 数据总数，从服务端得到
      limit: query.pagesize, // 每页几条数据
      curr: query.pagenum, // 当前页码值
      // 分页布局
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [1, 2, 3, 5, 10],
      jump: function (obj, first) {
        // 切换分页的时候调用该函数
        // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）、first（是否首次，一般用于初始加载的判断）
        // console.log(obj.curr, first); // 1 true

        // 说明：该函数的执行时机
        // 1. 在点击切换分页的时候会执行  first的值为undefined
        // 2. 在分页初始化的时候（既render）也会执行  first的值为true

        // 修改query的参数，在发送请求
        query.pagenum = obj.curr;

        // 当点击limits的时候，也会触发jump函数，只需要修改query的参数发请求
        query.pagesize = obj.limit; // 得到每页显示的条数

        // 这边有个坑：
        // 当初始化渲染的时候不执行该加载，防止出现不停的发送请求的bug
        if (!first) {
          // 只有点击的时候触发，render分页的时候不会触发
          getList();
        }
      },
    });
  }

  // 格式化时间
  let paddZero = (n) => (n < 10 ? "0" + n : n);
  template.defaults.imports.formatTime = function (time) {
    let d = new Date(time);
    let y = d.getFullYear();
    let m = paddZero(d.getMonth() + 1);
    let day = paddZero(d.getDate());
    let h = paddZero(d.getHours());
    let mm = paddZero(d.getMinutes());
    let s = paddZero(d.getSeconds());

    return `${y}-${m}-${day} ${h}:${mm}:${s}`;
  };

  // 获取分类列表下拉选项
  $.ajax({
    url: "/my/article/cates",
    success: function (res) {
      console.log(res);
      if (res.status !== 0) {
        return layer.msg("获取文章分类列表失败!");
      }

      // 将数据渲染到模板中
      $("#cate").html(template("tplOption", res));
      // 渲染模板之后重新渲染下layui的form
      form.render();
    },
  });

  // 实现筛选功能
  $("#form").on("submit", function (e) {
    e.preventDefault();

    // 修改文章分类id和状态
    query.cate_id = $("#cate").val();
    query.state = $("#state").val();

    console.log(query);
    // 发送ajax获取列表数据，但是需要修改query对应的参数
    getList();
  });

  // 删除文章
  $("tbody").on("click", ".removeBtn", function () {
    let id = $(this).attr("data-id");

    // 弹出询问框
    layer.confirm("确定删除?", { icon: 3, title: "提示" }, function (index) {
      // 当确定的时候，判断页面中有多少了删除按钮，如果只还有一个
      // 经过这个删除操作之后，页面中就没有了删除按钮，就没有了数据了
      if ($(".removeBtn").length === 1) {
        // 这一页没有了数据，就将当前页码 - 1 （加载上一页数据）
        // 页面最小值为1
        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1;
      }

      $.ajax({
        url: "/my/article/delete/" + id,
        success: function (res) {
          console.log(res);
          if (res.status !== 0) {
            return layer.msg("删除失败");
          }

          layer.msg("删除成功");

          // 重新加载
          getList();

          layer.close(index);
        },
      });
    });
  });

  // 编辑文章内容
  $("tbody").on("click", ".editBtn", function () {
    let id = $(this).attr("data-id");
    // console.log("🚀 ~ file: art_list.js ~ line 149 ~ id", id);

    location.href = "/article/art_edit.html?id=" + id;
  });
});
