<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="indexi.aspx.cs" Inherits="Apis.LoginVT.indexi" %>
  <!DOCTYPE html>
  <html>

  <head runat="server">
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Cổng cán bộ</title>
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />
    <!--Tell the browser to be responsive to screen width-->
    <!-- Force light color scheme — chan browser tu dong invert / doi mau khi user OS o
             dark mode (gay ra vien do/hong la tren sidebar submenu, form controls...). -->
    <meta name="color-scheme" content="light only" />
    <!--no cache in browser-->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <!--STYLE CSS load from code_behind, only font-awesome pulgin here-->
    <link href="App_Themes/Plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" /><!--Plugin font awesome -->
    <link href="App_Themes/Plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Plugins/ionicons/css/ionicons.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Cms/adminlte/css/AdminLTE.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Cms/adminlte/css/_all-skins.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Plugins/select2/css/select2.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Plugins/pagination/simplePagination.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Plugins/datepicker/datepicker3.min.css" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Cms/css/index.css?v=3" rel="stylesheet" /><!-- editor -->
    <link href="App_Themes/Cms/css/index.min.css?v=2" rel="stylesheet" /><!-- editor -->
    <!-- custom theme v1- bich -->
    <link href="App_Themes/Cms/Custom_V1/styles.css?v=4" rel="stylesheet" />

    <style>
      /* Force light color scheme — bao hiem tren nhung browser bo qua meta color-scheme.
             Ep form controls (input/select/scrollbar) render theo light theme + tat outline
             mac dinh mau do/hong tren dark OS. */
      html,
      :root {
        color-scheme: light only !important;
        forced-color-adjust: none;
      }

      /* Ap dung forced-color-adjust cho MOI element de chan Windows High Contrast Mode +
             Chrome dark theme adjustments tu bien viet ve tren border/outline. */
      *,
      *::before,
      *::after {
        forced-color-adjust: none !important;
      }

      input,
      select,
      textarea,
      button {
        color-scheme: light !important;
      }

      *:focus,
      *:focus-visible {
        outline-color: #223771 !important;
      }

      /* Sidebar AdminLTE: chan browser inject vien do do High Contrast / focus dark */
      .main-sidebar,
      .main-sidebar *,
      .sidebar-menu,
      .sidebar-menu *,
      .treeview-menu,
      .treeview-menu * {
        forced-color-adjust: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      .main-sidebar *:focus,
      .main-sidebar *:focus-visible,
      .main-sidebar *:active,
      .sidebar-menu *:focus,
      .sidebar-menu *:focus-visible,
      .sidebar-menu *:active,
      .treeview-menu a:focus,
      .treeview-menu a:focus-visible,
      .treeview-menu a:active {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
        box-shadow: none !important;
        border-color: transparent !important;
      }

      /* Focus visible: khong dung outline vien cam (xau) — chi doi mau chu */
      .treeview-menu a:focus-visible {
        outline: none !important;
        color: #f8843d !important;
      }

      /* ─── Reskin AdminLTE shell (indexi.aspx) tone dask-blue #223771 + orange #f8843d
             Mục đích: đồng bộ với index.aspx (SPA shell mới). Không đụng HTML/JS gốc, chỉ
             override class AdminLTE (.skin-blue, .main-header, .main-sidebar, .content-wrapper,
             .sidebar-menu, ...). Nội dung module bên trong #main-content-wrapper vẫn giữ style
             AdminLTE nguyên bản để không vỡ layout hàng loạt màn hình cũ. ─── */

      /* Selector prefix "html body.skin-blue" (spec 22) để đánh bại chắc chắn
             AdminLTE `_all-skins.min.css` (spec 20) và styles.css `.main-sidebar
             { background:#fff !important }` (spec 10). */

      /* [FIX mang navy ben phai] Truoc day body + .wrapper de nen #223771 (navy) chi de
             lo goc bo top-left cua .content-wrapper. Nhung .content-wrapper la block, be ngang
             chi bang viewport - sidebar => bat ky vung nao no khong phu (scroll ngang do bang
             min-width 2000px, mep phai khi layout co dinh be ngang, vung duoi khi content ngan)
             deu lo ra mang navy giua trang. Doi canvas ve light cung tone content-wrapper;
             goc bo duoc ve lai bang pseudo-element ::before nam duoi nen (xem .content-wrapper). */
      html,
      html body.skin-blue,
      html body.skin-blue .wrapper {
        background-color: #f0f3fd !important;
      }

      /* Header top: logo (bên trái, chiếm width sidebar) + navbar (bên phải).
             styles.css:2586 set navbar bằng background: linear-gradient shorthand → phải
             ép cả `background` shorthand + `background-image: none` để dập gradient. */
      html body.skin-blue .main-header {
        background: #223771 !important;
        box-shadow: none !important;
      }

      html body.skin-blue .main-header .navbar,
      html body.skin-blue .main-header .logo {
        background: #223771 !important;
        background-color: #223771 !important;
        background-image: none !important;
        color: #ffffff !important;
        border-bottom-color: rgba(255, 255, 255, 0.06) !important;
        box-shadow: none !important;
      }

      html body.skin-blue .main-header .logo:hover {
        /* background-color: #1c2e5f !important; */
      }

      html body.skin-blue .main-header .logo:hover .logo-mini span,
      html body.skin-blue .main-header .logo:hover span {
        /* background-color: #1c2e5f !important; */
        color: #ffc107 !important;
      }

      html body.skin-blue .main-header .navbar .sidebar-toggle,
      html body.skin-blue .main-header .navbar .nav>li>a {
        color: #ffffff !important;
      }


      html body.skin-blue .main-header .navbar .nav>li>a:hover,
      html body.skin-blue .main-header .navbar .nav>li>a:active,
      html body.skin-blue .main-header .navbar .nav>li>a:focus,
      html body.skin-blue .main-header .navbar .nav .open>a,
      html body.skin-blue .main-header .navbar .nav .open>a:hover,
      html body.skin-blue .main-header .navbar .nav .open>a:focus {
        background-color: rgba(255, 255, 255, 0.08) !important;
        color: #ffc107 !important;
      }

      html body.skin-blue .main-header .navbar .sidebar-toggle:hover {
        color: #ffc107 !important;
      }

      html body.skin-blue .main-header li.user-header {
        background-color: #223771 !important;
      }

      /* Sidebar chính */
      html body.skin-blue .main-sidebar,
      html body.skin-blue .left-side {
        background: #223771 !important;
        background-color: #223771 !important;
        box-shadow: none !important;
        border-top-right-radius: 0 !important;
      }

      html body.skin-blue .sidebar a {
        color: #d2ddfd !important;
      }

      html body.skin-blue .sidebar a:hover {
        color: #ffffff !important;
      }

      /* Menu items — prefix #menu_vertical (ID selector, spec +100) để đánh
             chắc chắn `styles.css` .skin-blue .sidebar-menu>li.active>a { background: #fff
             !important } và các rule khác cùng loại. */
      html body.skin-blue #menu_vertical>li>a,
      html body.skin-blue .sidebar-menu>li>a {
        border-left: 3px solid transparent !important;
        color: #d2ddfd !important;
        background: transparent !important;
        background-image: none !important;
        border-radius: 0 6px 6px 0 !important;
        margin: 2px 6px 2px 0 !important;
        padding: 10px 10px 10px 12px !important;
      }

      html body.skin-blue #menu_vertical>li:hover>a,
      html body.skin-blue .sidebar-menu>li:hover>a {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.06) !important;
        background-image: none !important;
        border-left-color: rgba(248, 132, 61, 0.5) !important;
      }

      html body.skin-blue #menu_vertical>li.active>a,
      html body.skin-blue #menu_vertical>li.menu-open>a,
      html body.skin-blue .sidebar-menu>li.active>a,
      html body.skin-blue .sidebar-menu>li.menu-open>a {
        color: #fff !important;
        background: rgba(248, 132, 61, 0.12) !important;
        background-image: none !important;
        border-left-color: #f8843d !important;
        font-weight: 700 !important;
      }

      html body.skin-blue #menu_vertical>li>.treeview-menu,
      html body.skin-blue .sidebar-menu>li>.treeview-menu {
        background: rgba(0, 0, 0, 0.15) !important;
        background-color: rgba(0, 0, 0, 0.15) !important;
        border-radius: 6px !important;
        margin: 2px 6px !important;
      }

      html body.skin-blue #menu_vertical .treeview-menu>li>a,
      html body.skin-blue .treeview-menu>li>a {
        color: #d2ddfd !important;
        background: transparent !important;
      }

      html body.skin-blue #menu_vertical .treeview-menu>li.active>a,
      html body.skin-blue #menu_vertical .treeview-menu>li.menu-open>a,
      html body.skin-blue #menu_vertical .treeview-menu>li>a:hover,
      html body.skin-blue .treeview-menu>li.active>a,
      html body.skin-blue .treeview-menu>li.menu-open>a,
      html body.skin-blue .treeview-menu>li>a:hover,
      /* Cung ep tren li de tranh bg parent cua a thu hien qua */
      html body.skin-blue #menu_vertical .treeview-menu>li.active,
      html body.skin-blue #menu_vertical .treeview-menu>li.menu-open,
      html body.skin-blue .sidebar-menu .treeview-menu>li.active,
      html body.skin-blue .sidebar-menu .treeview-menu>li.menu-open,
      html body.skin-blue .treeview-menu>li.active,
      html body.skin-blue .treeview-menu>li.menu-open {
        color: #f8843d !important;
        background: transparent !important;
        background-color: transparent !important;
        border-color: transparent !important;
        outline: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      /* Bullet dots ::before/::after — đổi tone light-blue/orange (styles.css:2744-2772
             set #989898 gray + var(--color-link) blue mặc định) */
      html body.skin-blue #menu_vertical .treeview-menu>li>a::before,
      html body.skin-blue #menu_vertical .treeview-menu>li>a::after,
      html body.skin-blue .sidebar-menu .treeview-menu>li>a::before,
      html body.skin-blue .sidebar-menu .treeview-menu>li>a::after {
        background-color: rgba(210, 221, 253, 0.4) !important;
      }

      html body.skin-blue #menu_vertical .treeview-menu>li.active>a::before,
      html body.skin-blue #menu_vertical .treeview-menu>li.active>a::after,
      html body.skin-blue #menu_vertical .treeview-menu>li.menu-open>a::before,
      html body.skin-blue #menu_vertical .treeview-menu>li.menu-open>a::after,
      html body.skin-blue .sidebar-menu .treeview-menu>li.active>a::before,
      html body.skin-blue .sidebar-menu .treeview-menu>li.active>a::after,
      html body.skin-blue .sidebar-menu .treeview-menu>li.menu-open>a::before,
      html body.skin-blue .sidebar-menu .treeview-menu>li.menu-open>a::after {
        background-color: #f8843d !important;
      }

      /* Search box trong sidebar — input va nut Q dinh HAN vao nhau nhu 1 khoi */
      html body.skin-blue .sidebar-form {
        background-color: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
        margin: 10px !important;
        padding: 0 !important;
        overflow: hidden !important;
      }

      html body.skin-blue .sidebar-form .input-group {
        width: 100% !important;
        display: flex !important;
        align-items: stretch !important;
      }

      html body.skin-blue .sidebar-form input.form-control,
      html body.skin-blue .sidebar-form input[type="text"] {
        background-color: transparent !important;
        color: #ffffff !important;
        border: 0 !important;
        box-shadow: none !important;
        height: 38px !important;
        padding: 6px 12px !important;
        flex: 1 1 auto !important;
        border-radius: 0 !important;
      }

      html body.skin-blue .sidebar-form input.form-control::placeholder {
        color: rgba(255, 255, 255, 0.5) !important;
      }

      html body.skin-blue .sidebar-form .input-group-btn {
        display: flex !important;
        width: auto !important;
        flex: 0 0 auto !important;
      }

      html body.skin-blue .sidebar-form .btn,
      html body.skin-blue .sidebar-form .input-group-btn .btn,
      html body.skin-blue .sidebar-form .input-group-btn .btn.btn-flat,
      html body.skin-blue .sidebar-form button.btn {
        color: #ffffff !important;
        background: #2a4a95 !important;
        background-color: #2a4a95 !important;
        background-image: none !important;
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 0 14px !important;
        height: 38px !important;
        min-height: 38px !important;
        line-height: 38px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      html body.skin-blue .sidebar-form .btn:hover,
      html body.skin-blue .sidebar-form .input-group-btn .btn:hover {
        color: #ffffff !important;
        background: #365dbf !important;
      }

      html body.skin-blue .sidebar-form .btn i,
      html body.skin-blue .sidebar-form .input-group-btn .btn i {
        color: #ffffff !important;
        font-size: 14px !important;
        margin: 0 !important;
        line-height: 1 !important;
      }

      /* Content wrapper: nền light-gray, KHONG bo goc + KHONG mieng navy lot duoi nua
             (goc bo cu de lo mot o navy 24x24 o goc trai tren -> user bao "con ti xanh xanh"). */
      html body.skin-blue .content-wrapper {
        background-color: #f0f3fd !important;
        border-top-left-radius: 0 !important;
        /* KHONG duoc dat position:relative o day! AdminLTE.min.css set z-index:800/820/840
               cho .content-wrapper. Khi position:static thi z-index bi bo qua (inert), nhung
               chi can them position:relative la z-index kich hoat => .content-wrapper tao
               STACKING CONTEXT o muc 820. Moi .modal khai bao trong module (nam trong
               #main-content-wrapper) bi nhot trong stacking context do, trong khi
               .modal-backdrop duoc BS3 append thang vao <body> o z-index 1040 => backdrop
               phu LEN modal: man hinh toi den, bam gi cung khong an. Ep z-index:auto de
               khoa vinh vien loi nay ke ca khi rule khac set position. */
        z-index: auto !important;
        /* ROOT CAUSE be ngang thieu 348px: styles.css:3092 .skin-blue .content-wrapper
               { overflow:hidden } -> element tao BFC (block formatting context), ma box tao BFC
               thi TU CO LAI de ne float nam canh no. Do console: div bo rong 2116.67,
               margin-left 300 => dang le width = 1816.67, nhung thuc te 1468.87
               (= 2116.67 - 300 - 347.8 be ngang cua float). Moi rule width/max-width/margin
               deu vo nghia vi day la co che layout chu khong phai thuoc tinh width.
               Fix: bo BFC. Dung `clip` (KHONG tao BFC nhung van cat tran nhu hidden) de giu
               nguyen hanh vi chong tran ngang cua cac module khac; `visible` la fallback cho
               browser khong ho tro overflow:clip. */
        overflow: visible !important;
        overflow: clip !important;
      }

      /* [FULL WIDTH] Ep vung noi dung trai het be ngang con lai cua trang.
             Audit CSS thuc te duoc nap (AdminLTE.min, _all-skins.min, styles.css,
             styles-content.css, styles-responsive.css, index.min.css) KHONG co rule nao
             set width/max-width cho .content-wrapper / #main-content-wrapper / .content /
             .zone-bus / .box => thu bo be ngang nam o container NGOAI hon la .wrapper.
             AdminLTE co .wrapper{max-width:1250px} (bien the layout-boxed) + overflow:hidden,
             neu dinh phai bien the do thi toan bo shell bi bo lai va con lai la mang trong
             ben phai. Dap ca chuoi tu .wrapper tro xuong cho chac. */
      html body.skin-blue .wrapper,
      html body.skin-blue .content-wrapper,
      html body.skin-blue .content-wrapper>.content-header,
      html body.skin-blue #main-content-wrapper,
      html body.skin-blue #main-content-wrapper .content {
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
        margin-right: 0 !important;
        float: none !important;
        box-sizing: border-box !important;
      }

      /* Div bo truc tiep cua .content-wrapper: console xac nhan da rong dung 2117 (= .wrapper),
             nen KHONG phai thu bo be ngang — giu nguyen, khong reset gi them. Nguyen nhan that
             su nam o overflow:hidden cua chinh .content-wrapper (xem rule ben tren). */

      /* .wrapper con co margin:0 auto o bien the boxed -> ep sat trai, khong can giua */
      html body.skin-blue .wrapper {
        margin-left: 0 !important;
        box-shadow: none !important;
      }

      /* Padding ngang gon lai de card sat mep phai, khong bo trong mot mang lon */
      html body.skin-blue #main-content-wrapper .content {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }

      /* Breadcrumb "Bảng điều khiển / …" */
      html body.skin-blue .content-header {
        padding: 14px 18px 6px !important;
      }

      html body.skin-blue .content-header .list-group-item {
        background-color: transparent !important;
        border: 0 !important;
        color: #64748b !important;
        padding: 0 !important;
        font-size: 13px !important;
      }

      /* Footer bar */
      html body.skin-blue .main-footer {
        background-color: #f0f3fd !important;
        border-top-color: #e2e8f0 !important;
        color: #64748b !important;
      }

      /* Pagination (simplePagination + Bootstrap .pagination) — tone dask-blue */
      /* Fix align vertical cho khu "Hien thi [10] du lieu": systemroot.js hardcode
             margin-top:10px + float:left cho .aps-hienthi/.aps-dulieu -> lech baseline.
             Ep flex align-items center, reset margin-top. */
      html body.skin-blue .aps-hienthi,
      html body.skin-blue .aps-hienthi-input,
      html body.skin-blue .aps-dulieu {
        margin-top: 0 !important;
        float: none !important;
        display: inline-flex !important;
        align-items: center !important;
        line-height: 32px !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
      }

      html body.skin-blue .aps-hienthi label,
      html body.skin-blue .aps-dulieu label {
        margin: 0 !important;
        line-height: 32px !important;
        display: inline-block !important;
        white-space: nowrap !important;
      }

      /* FIX 2026-09-05: Wrap "Hien thi ... du lieu" + pagination.
         - Container hep (sidebar SV, khoi ke thua, modal small) → dropdown "Hien thi"
           bi ep sat vao pagination -> lech nhau, khong doc duoc.
         - Fix: flex-wrap:wrap → 2 nhom (change-XXX + filter-XXX) tu dong xuong dong
           khi container hep; moi nhom auto-width, KHONG bi ep col-lg-6 = 50%. */
      html body.skin-blue [id^="change"][class*="pull-left"],
      html body.skin-blue [class*="zone-pag-"] {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px 12px !important;
        row-gap: 8px !important;
        width: 100% !important;
      }

      /* 2 child cua zone-pag-header/footer: auto-width, khong ep col-lg-6 (50%) */
      html body.skin-blue [class*="zone-pag-"]>.col-lg-6,
      html body.skin-blue [class*="zone-pag-"]>[class*="change-"],
      html body.skin-blue [class*="zone-pag-"]>[class*="filter-"],
      html body.skin-blue [class*="zone-pag-"]>[class*="info-"],
      html body.skin-blue [class*="zone-pag-"]>[class*="light-pagination"] {
        width: auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        flex: 0 1 auto !important;
        float: none !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin: 0 !important;
      }

      /* Dropdown "Hien thi" (aps-hienthi-input) — khoang cach voi nhan */
      html body.skin-blue [class*="change-"] .aps-hienthi,
      html body.skin-blue [class*="change-"] .aps-hienthi-input,
      html body.skin-blue [class*="change-"] .aps-dulieu {
        float: none !important;
        display: inline-flex !important;
        align-items: center !important;
        vertical-align: middle !important;
        margin: 0 !important;
      }

      html body.skin-blue [class*="change-"] {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
      }

      /* Badge trong box-title (339): reset mt-10 + can giua vertical voi text title */
      html body.skin-blue .box-title .badge,
      html body.skin-blue .box-title .badge.bg-light-blue {
        vertical-align: middle !important;
        margin-top: 0 !important;
        margin-left: 6px !important;
        display: inline-flex !important;
        align-items: center !important;
        line-height: 1 !important;
        padding: 4px 10px !important;
      }

      /* Badge chua co so lieu -> an han, tranh "cuc xanh" trong nam canh tieu de.
         BS3 co san .badge:empty{display:none} nhung bi display:inline-flex !important
         o tren de len, nen phai khai bao lai. */
      html body.skin-blue .box-title .badge:empty,
      html body.skin-blue .box-title .badge.bg-light-blue:empty {
        display: none !important;
      }

      /* Truong hop badge boc 1 span con rong (<span class="badge"><span id="..."></span></span>):
         badge KHONG match :empty vi con text node xuong dong -> dung :has().
         Tach rule rieng de browser khong ho tro :has() van giu duoc rule :empty o tren. */
      html body.skin-blue .box-title .badge:has(> span:only-child:empty) {
        display: none !important;
      }

      /* Chan wrap: simplePagination render <ul><li> mac dinh display:inline-block ->
             wrap xuong dong khi container hep (bug lech "Hien thi 10 du lieu" | 1 2 3...33 wrap 34).
             Ep ul flex nowrap + white-space nowrap; neu hep qua thi overflow-x auto. */
      html body.skin-blue .simple-pagination,
      html body.skin-blue .simple-pagination ul,
      html body.skin-blue .light-theme,
      html body.skin-blue .light-theme ul,
      html body.skin-blue .compact-theme {
        display: flex !important;
        flex-wrap: nowrap !important;
        white-space: nowrap !important;
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-x: auto !important;
        max-width: 100% !important;
      }

      html body.skin-blue .compact-theme ul {
        display: flex !important;
        flex-wrap: nowrap !important;
        white-space: nowrap !important;
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-x: hidden !important;
        max-width: 100% !important;
        overflow: hidden;
      }

      html body.skin-blue .simple-pagination li,
      html body.skin-blue .light-theme li,
      html body.skin-blue .compact-theme li {
        display: inline-flex !important;
        flex-shrink: 0 !important;
        white-space: nowrap !important;
      }

      html body.skin-blue .simple-pagination a,
      html body.skin-blue .simple-pagination span,
      html body.skin-blue .light-theme a,
      html body.skin-blue .light-theme span,
      html body.skin-blue .compact-theme a,
      html body.skin-blue .compact-theme span {
        background: #fff !important;
        background-image: none !important;
        color: #223771 !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 4px !important;
        box-shadow: none !important;
        font-weight: 600 !important;
        min-width: 32px !important;
        line-height: 30px !important;
        margin: 0 3px 0 0 !important;
        padding: 0 8px !important;
      }

      html body.skin-blue .simple-pagination a:hover,
      html body.skin-blue .light-theme a:hover,
      html body.skin-blue .compact-theme a:hover {
        background: #f0f3fd !important;
        background-image: none !important;
        border-color: #223771 !important;
        color: #223771 !important;
      }

      html body.skin-blue .simple-pagination .current,
      html body.skin-blue .light-theme .current,
      html body.skin-blue .compact-theme .current {
        background: #f1f5f9 !important;
        background-image: none !important;
        color: #222 !important;
        border-color: #f1f5f9 !important;
        cursor: default !important;
        border-radius: 4px ! IMPORTANT;
      }

      html body.skin-blue .simple-pagination .ellipse,
      html body.skin-blue .light-theme .ellipse,
      html body.skin-blue .compact-theme .ellipse {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        color: #64748b !important;
      }

      /* An het prev/next/first/last (ca <a> lan <span>) — chi giu so trang, gon hon,
             khi chi 1 trang cung khong show 2 mui ten ⏴ ⏵ vo nghia duoi so 1. */
      html body.skin-blue .simple-pagination .prev,
      html body.skin-blue .simple-pagination .next,
      html body.skin-blue .simple-pagination .first,
      html body.skin-blue .simple-pagination .last,
      html body.skin-blue .light-theme .prev,
      html body.skin-blue .light-theme .next,
      html body.skin-blue .light-theme .first,
      html body.skin-blue .light-theme .last,
      html body.skin-blue .compact-theme .prev,
      html body.skin-blue .compact-theme .next,
      html body.skin-blue .compact-theme .first,
      html body.skin-blue .compact-theme .last {
        display: none !important;
      }

      /* Bootstrap 3 pagination (nếu module con dùng) */
      html body.skin-blue .pagination>li>a,
      html body.skin-blue .pagination>li>span {
        color: #223771 !important;
        border-color: #e2e8f0 !important;
      }

      html body.skin-blue .pagination>.active>a,
      html body.skin-blue .pagination>.active>span,
      html body.skin-blue .pagination>.active>a:hover,
      html body.skin-blue .pagination>.active>span:hover {
        background-color: #223771 !important;
        border-color: #223771 !important;
        color: #ffffff !important;
      }

      /* ─── [MODULE-RESKIN] Reskin content module cu (AdminLTE .box, .form-control, .btn, .table, ...)
             Scope: #main-content-wrapper de khong lem ra sidebar/header.
             Muc dich: dong bo tone + padding + font voi sidebar reskin, giam cam giac "lech". ─── */
      html body.skin-blue #main-content-wrapper .box {
        /* border: 1px solid #e2e8f0 !important; */
        /* border-top: 1px solid #e2e8f0 !important; */
        border-radius: 12px;
        /* box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important; */
        margin-bottom: 14px !important;
      }

      html body.skin-blue #main-content-wrapper .box-body {
        overflow: visible !important;
        max-height: none !important;
      }

      html body.skin-blue #main-content-wrapper .box-header {
        padding: 10px 12px;
        /* border-bottom: 1px solid #e2e8f0 !important; */
      }

      html body.skin-blue #main-content-wrapper .aps-box-l .box-header {
        padding: 0px 12px !important;
        /* border-bottom: 1px solid #e2e8f0 !important; */
      }

      html body.skin-blue #main-content-wrapper .box-title {
        font-weight: 600 !important;
        font-size: 18px !important;
        color: var(--color-blue);
      }

      html body.skin-blue #main-content-wrapper .box-footer {
        padding: 10px 20px !important;
        border-top: 1px solid #e2e8f0 !important;
      }

      /* Form inputs — vien nhat khop tone, focus dask-blue subtle (khong cam gao) */
      html body.skin-blue #main-content-wrapper .form-control {
        border: 1px solid #d1d1d1 !important;
        border-radius: 6px !important;
        box-shadow: none !important;
        color: #888 !important;
        font-size: 14px !important;
        padding: 6px 12px !important;
        height: 38px !important;
        /* margin-bottom: 10px; */
      }

      html body.skin-blue #main-content-wrapper .form-control:focus {
        border-color: var(--color-blue) !important;
        box-shadow: none !important;
      }

      html body.skin-blue #main-content-wrapper input.form-control::placeholder,
      html body.skin-blue #main-content-wrapper input::placeholder,
      html body.skin-blue #main-content-wrapper textarea.form-control::placeholder,
      html body.skin-blue #main-content-wrapper textarea::placeholder {
        color: #64748b !important;
        opacity: 1 !important;
      }

      /* Text đã nhập trong input/textarea đậm hơn (global user request) */
      html body.skin-blue #main-content-wrapper input.form-control,
      html body.skin-blue #main-content-wrapper select.form-control,
      html body.skin-blue #main-content-wrapper textarea.form-control {
        color: #0f172a !important;
        font-weight: 500 !important;
      }

      /* ═══ Select2 xin: flex center + border-radius + focus ring ═══ */
      .select2-container .select2-selection--single {
        height: 38px;
        min-height: 38px;
        border: 1px solid #c1c1c1;
        border-radius: 8px;
        background: #ffffff;
        display: flex;
        align-items: center;
        padding: 0;
        transition: border-color .15s ease, box-shadow .15s ease;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
      }

      html body.skin-blue #main-content-wrapper .select2-container--focus .select2-selection--single,
      html body.skin-blue #main-content-wrapper .select2-container--open .select2-selection--single {
        border-color: #d1d1d1 !important;
        box-shadow: 0 0 0 3px rgba(34, 55, 113, 0.12) !important;
      }

      html body.skin-blue #main-content-wrapper .select2-container .select2-selection--single:hover {
        border-color: #94a3b8 !important;
      }

      html body.skin-blue #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: 26px !important;
        padding: 8px 15px 8px 6px !important;
        color: #0f172a !important;
        font-size: 14px !important;
        font-weight: 400;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        height: 100% !important;
        margin: 0 !important;
      }

      html body.skin-blue #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__placeholder {
        color: #64748b !important;
        font-weight: 500 !important;
        font-style: normal !important;
        opacity: 1 !important;
      }

      html body.skin-blue #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 100% !important;
        top: 2px !important;
        right: 8px !important;
        width: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      html body.skin-blue #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__arrow b {
        border-color: #d1d1d1 transparent transparent transparent !important;
        border-width: 5px 5px 0 5px !important;
        position: static !important;
        margin: 0 !important;
      }

      html body.skin-blue #main-content-wrapper .select2-container--open .select2-selection__arrow b {
        border-color: transparent transparent #223771 transparent !important;
        border-width: 0 5px 6px 5px !important;
      }

      /* Dropdown khi mo — max spec + shadow to de dropdown "nhay ra" khoi container */
      html body .select2-container,
      html body>.select2-container,
      html body .select2-container--default .select2-dropdown {
        z-index: 99999 !important;
      }

      html body .select2-container--default .select2-dropdown {
        border: 2px solid #d1d1d1 !important;
        border-radius: 10px !important;
        box-shadow:
          0 0 0 1px rgba(34, 55, 113, 0.05),
          0 4px 12px rgba(15, 23, 42, 0.12),
          0 20px 40px rgba(15, 23, 42, 0.25) !important;
        margin-top: 8px !important;
        background: #ffffff !important;
        padding: 6px 0 !important;
        overflow: hidden !important;
      }

      html body .select2-container--default .select2-dropdown--above {
        margin-top: 0 !important;
        margin-bottom: 8px !important;
        box-shadow:
          0 0 0 1px rgba(34, 55, 113, 0.05),
          0 -4px 12px rgba(15, 23, 42, 0.12),
          0 -20px 40px rgba(15, 23, 42, 0.25) !important;
      }

      body .select2-container--default .select2-search--dropdown {
        padding: 6px 8px !important;
      }

      body .select2-container--default .select2-search--dropdown .select2-search__field {
        border: 1px solid #cbd5e1 !important;
        border-radius: 6px !important;
        padding: 6px 10px !important;
        font-size: 13px !important;
        outline: none !important;
      }

      body .select2-container--default .select2-search--dropdown .select2-search__field:focus {
        border-color: #223771 !important;
        box-shadow: 0 0 0 2px rgba(34, 55, 113, 0.1) !important;
      }

      body .select2-container--default .select2-results__options {
        max-height: 250px !important;
      }

      body .select2-container--default .select2-results__option {
        padding: 8px 14px !important;
        font-size: 14px !important;
        color: #0f172a !important;
        transition: background .1s ease;
      }

      body .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background: #223771 !important;
        color: #ffffff !important;
      }

      body .select2-container--default .select2-results__option[aria-selected="true"] {
        background: #f0f3fd !important;
        color: #223771 !important;
        font-weight: 600 !important;
      }

      /* Buttons — dong bo font/padding, tone dask-blue */
      html body.skin-blue #main-content-wrapper .btn {
        font-weight: 500 !important;
        font-size: 14px !important;
        border-radius: 6px !important;
        padding: 8px 12px !important;
        box-shadow: none !important;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      html body.skin-blue #main-content-wrapper .btn.btn-default {
        background: #fff;
        color: #223771;
        border: 1px solid #e2e8f0;
      }

      html body.skin-blue #main-content-wrapper .btn.btn-default:hover {
        background: #f0f3fd;
        border-color: #223771;
        color: #223771;
      }

      html body.skin-blue #main-content-wrapper .btn.btn-primary {
        background: #223771 !important;
        color: #fff !important;
        border: 1px solid #223771 !important;
        gap: 8px;
        display: inline-flex;
      }

      html body.skin-blue #main-content-wrapper .btn.btn-primary:hover {
        background: #121d3b !important;
        border-color: #121d3b !important;
      }

      /* .btn-search / .btnSearch: styles.css:3272 set nen xam #e1e1e1 !important +
             chu ke thua nhat -> kho nhin. Override ve solid dask-blue + chu trang */
      html body.skin-blue #main-content-wrapper .btn.btn-search,
      html body.skin-blue #main-content-wrapper .btn.btn-default.btn-search,
      html body.skin-blue #main-content-wrapper a.btn.btn-search,
      html body.skin-blue #main-content-wrapper .btnSearch {
        background: #223771 !important;
        background-image: none !important;
        color: #ffffff !important;
        border: 1px solid #223771 !important;
        border-radius: 8px !important;
        padding: 12px 12px 10px 12px !important;
        font-weight: 500 !important;
        box-shadow: none !important;
      }

      html body.skin-blue #main-content-wrapper .btn.btn-search:hover,
      html body.skin-blue #main-content-wrapper .btn.btn-default.btn-search:hover,
      html body.skin-blue #main-content-wrapper a.btn.btn-search:hover,
      html body.skin-blue #main-content-wrapper .btnSearch:hover {
        background: #1c2e5f !important;
        border-color: #1c2e5f !important;
        color: #ffffff !important;
      }

      html body.skin-blue #main-content-wrapper .btn.btn-search i,
      html body.skin-blue #main-content-wrapper .btn.btn-search .lang,
      html body.skin-blue #main-content-wrapper .btnSearch i,
      html body.skin-blue #main-content-wrapper .btnSearch .lang {
        color: #ffffff !important;
        /* padding-right: 5px; */
      }

      /* Table headers — khop tone role picker table (nen tim nhat, font dam) */
      html body.skin-blue #main-content-wrapper .table>thead>tr>th,
      html body.skin-blue #main-content-wrapper .table>thead>tr>td {
        background: #f0f3fd !important;
        color: #0f172a !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        border-bottom: 1px solid #e2e8f0 !important;
      }

      html body.skin-blue #main-content-wrapper .table>tbody>tr>td {
        font-size: 14px !important;
        color: #0f172a !important;
        border-color: #f1f5f9 !important;
      }

      /* Row hover: giu chu dam, chi doi nen (default index.min.css:58 set
             color: var(--color-green) -> chu xanh la mo tit tren nen trang). */
      html body.skin-blue #main-content-wrapper .table-hover>tbody>tr:hover,
      html body.skin-blue #main-content-wrapper .table-hover>tbody>tr:hover>td {
        background: #e1e1e1 !important;
        color: #0f172a !important;
      }

      /* Button nho gon khi nam trong table cell, cang giua cell */
      html body.skin-blue #main-content-wrapper .table td .btn,
      html body.skin-blue #main-content-wrapper .table th .btn {
        padding: 4px 12px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        border-radius: 4px !important;
        display: inline-flex !important;
        align-items: center !important;
        /* gap: 5px !important; */
      }

      /* Cell chua button -> can giua theo chieu ngang */
      html body.skin-blue #main-content-wrapper .table td:has(> .btn),
      html body.skin-blue #main-content-wrapper .table td:has(> a.btn) {
        text-align: center !important;
        vertical-align: middle !important;
      }

      /* Fallback cho browser cu (khong ho tro :has): center btn.btn-primary
             trong table cell bang display:block + margin auto */
      html body.skin-blue #main-content-wrapper .table td>.btn.btn-primary {
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* Icon check dau chu "Chon" — dung FA4 unicode \f00c (font-family FontAwesome) */
      html body.skin-blue #main-content-wrapper .table td .btn.btn-primary::before {
        content: "\f00c";
        font-family: "FontAwesome", "Font Awesome 5 Free", "Font Awesome 6 Free";
        font-weight: 900;
        font-size: 12px;
        display: inline-block;
      }

      /* Header xanh cua box/modal: cac nut tool (+ collapse, x close, .btnClose ...)
             mac dinh bi reskin .btn.btn-default ap nen trang + border -> tach ra khoi nen
             xanh nhin xau. Cho ve transparent + chu trang. Bao gom ca .btnClose
             (custom class trong module cu nhu ApisChuyenCan) va cac dang standard. */
      html body.skin-blue #main-content-wrapper .box-header .btn-box-tool,
      html body.skin-blue #main-content-wrapper .box-header .btnClose,
      -header a.btnClose,
      html body.skin-blue #main-content-wrapper .box-header .btn.btnClose,
      html body.skin-blue #main-content-wrapper .box-header .btn.btn-default.btnClose,
      html body.skin-blue #main-content-wrapper .box-header button.close,
      html body.skin-blue #main-content-wrapper .box-header .close,
      html body.skin-blue #main-content-wrapper .box-header .btn-close,
      html body.skin-blue #main-content-wrapper .box-header .pull-right>.btn.btn-default:not(.btn-search):not(.btnSave),
      html body.skin-blue #main-content-wrapper .box-header .pull-right>a.btn.btn-default:not(.btn-search):not(.btnSave),
      html body.skin-blue #main-content-wrapper .modal-header button.close,
      html body.skin-blue #main-content-wrapper .modal-header .close,
      html body.skin-blue #main-content-wrapper .modal-header .btn-close,
      html body.skin-blue #main-content-wrapper .modal-header .btn-box-tool,
      html body.skin-blue #main-content-wrapper .modal-header .btnClose {
        background: transparent !important;
        background-color: transparent !important;
        border: 0 !important;
        border-radius: 4px !important;
        color: #ffffff !important;
        opacity: 0.85 !important;
        box-shadow: none !important;
        padding: 4px 10px;
        font-size: 14px !important;
        line-height: 1 !important;
        font-weight: 400 !important;
        text-shadow: none !important;
        min-width: 0 !important;
        width: auto !important;
        height: auto !important;
      }

      html body.skin-blue #main-content-wrapper .box-header .btn-box-tool:hover,
      html body.skin-blue #main-content-wrapper .box-header .btnClose:hover,
      html body.skin-blue #main-content-wrapper .box-header a.btnClose:hover,
      html body.skin-blue #main-content-wrapper .box-header .btn.btnClose:hover,
      html body.skin-blue #main-content-wrapper .box-header .btn.btn-default.btnClose:hover,
      html body.skin-blue #main-content-wrapper .box-header button.close:hover,
      html body.skin-blue #main-content-wrapper .box-header .close:hover,
      html body.skin-blue #main-content-wrapper .box-header .btn-close:hover,
      html body.skin-blue #main-content-wrapper .box-header .pull-right>.btn.btn-default:not(.btn-search):not(.btnSave):hover,
      html body.skin-blue #main-content-wrapper .box-header .pull-right>a.btn.btn-default:not(.btn-search):not(.btnSave):hover,
      html body.skin-blue #main-content-wrapper .modal-header button.close:hover,
      html body.skin-blue #main-content-wrapper .modal-header .close:hover,
      html body.skin-blue #main-content-wrapper .modal-header .btn-close:hover,
      html body.skin-blue #main-content-wrapper .modal-header .btn-box-tool:hover,
      html body.skin-blue #main-content-wrapper .modal-header .btnClose:hover {
        background: rgba(255, 255, 255, 0.18) !important;
        color: #ffffff !important;
        opacity: 1 !important;
        border: 0 !important;
      }

      html body.skin-blue #main-content-wrapper .box-header .btn-box-tool i,
      html body.skin-blue #main-content-wrapper .box-header .btnClose i,
      html body.skin-blue #main-content-wrapper .box-header .pull-right>.btn i,
      html body.skin-blue #main-content-wrapper .modal-header .btn-box-tool i,
      html body.skin-blue #main-content-wrapper .modal-header .btnClose i {
        color: #ffffff !important;
      }

      /* ═══ Modal reskin — override styles.css:3810 dat modal-header bright blue ═══
             Modal duoc BS3 append vao body (khong nam trong #main-content-wrapper),
             nen dung selector body.skin-blue > .modal + .modal (fallback) voi max spec. */
      /* Backdrop: dam hon de content sau modal khong lo ra (fix bug thay dropdown filter
             xuyen qua modal khi modal ngan). BS default rgba(0,0,0,.5) van thay xuyen qua.
             z-index CAO (10050+) de an select2-container va pagination cua page ben duoi. */
      html body.skin-blue .modal.show,
      html body.skin-blue .modal.in {
        z-index: 10055 !important;
      }

      html body.skin-blue .modal-backdrop.show,
      html body.skin-blue .modal-backdrop.in {
        z-index: 10050 !important;
        opacity: 0.5 !important;
        background-color: #0f172a !important;
      }

      /* ═══ [FIX 2026-08-12] Khi modal open, select2-container base (line 571) o
             z-index 99999 cao hon backdrop (10050) -> user van chon duoc dropdown xuyen
             qua modal. Reset ve auto khi modal open de backdrop chan pointer events. ═══ */
      html body.skin-blue.modal-open .select2-container,
      html body.skin-blue.modal-open>.select2-container,
      html body.skin-blue:has(.modal.show) .select2-container,
      html body.skin-blue:has(.modal.show)>.select2-container,
      html body.skin-blue:has(.modal.in) .select2-container,
      html body.skin-blue:has(.modal.in)>.select2-container,
      html body.skin-blue:has(.cke_dialog_container) .select2-container,
      html body.skin-blue:has(.cke_dialog_container)>.select2-container,
      html body.skin-blue:has(.cke_dialog_background_cover) .select2-container,
      html body.skin-blue:has(.cke_dialog_background_cover)>.select2-container {
        z-index: auto !important;
      }

      /* ═══ modal-fullscreen: ep 100vw x 100vh, override styles.css .modal-1024/1360/etc
             va default BS .modal-dialog max-width. Bo border-radius de sat edge.
             Background TRANG DAC de che tuyet doi background page (select2/pagination). ═══ */
      html body.skin-blue .modal .modal-dialog.modal-fullscreen,
      html body.skin-blue>.modal .modal-dialog.modal-fullscreen {
        max-width: 100vw !important;
        width: 100vw !important;
        height: 100vh !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      html body.skin-blue .modal .modal-dialog.modal-fullscreen .modal-content,
      html body.skin-blue>.modal .modal-dialog.modal-fullscreen .modal-content {
        height: 100vh !important;
        max-height: 100vh !important;
        width: 100vw !important;
        border-radius: 0 !important;
        border: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        background-color: #ffffff !important;
      }

      html body.skin-blue .modal .modal-dialog.modal-fullscreen .modal-header,
      html body.skin-blue>.modal .modal-dialog.modal-fullscreen .modal-header {
        border-radius: 0 !important;
        flex-shrink: 0 !important;
      }

      html body.skin-blue .modal .modal-dialog.modal-fullscreen .modal-body,
      html body.skin-blue>.modal .modal-dialog.modal-fullscreen .modal-body {
        flex: 1 1 auto !important;
        overflow-y: auto !important;
        background-color: #ffffff !important;
        opacity: 1 !important;
      }

      html body.skin-blue .modal .modal-dialog.modal-fullscreen .modal-footer,
      html body.skin-blue>.modal .modal-dialog.modal-fullscreen .modal-footer {
        flex-shrink: 0 !important;
        border-radius: 0 !important;
        background-color: #f8fafc !important;
      }

      /* ═══ [DISABLED 2026-08-12] FIX TRIET DE: khi modal mo, an TOAN BO
             #main-content-wrapper de khong container nao xuyen qua backdrop. ═══
             User feedback: an het main-content khien khong biet modal thong bao xuat hien
             tu form nao -> comment lai, giu backdrop opacity thap de van thay form phia sau. */
      /*
          html body.skin-blue.modal-open #main-content-wrapper,
          html body.skin-blue:has(.modal.show) #main-content-wrapper,
          html body.skin-blue:has(.modal.in) #main-content-wrapper {
            visibility: hidden !important;
          }
          */
      /* Modal (o bat ky dau — body level hoac inline trong module) va backdrop luon hien */
      html body.skin-blue.modal-open .modal.show,
      html body.skin-blue.modal-open .modal.in,
      html body.skin-blue.modal-open .modal-backdrop,
      html body.skin-blue:has(.modal.show) .modal.show,
      html body.skin-blue:has(.modal.in) .modal.in,
      html body.skin-blue:has(.modal.show) .modal-backdrop,
      html body.skin-blue:has(.modal.in) .modal-backdrop {
        visibility: visible !important;
      }

      /* Select2 dropdown (khi mo) append vao body, khong nam trong #main-content-wrapper
             nen 2 rule tren khong bat. Van cho hien binh thuong.
             BUG FIX: z-index 20000 truoc day THAP hon baseline 99999 (line 466) nhung
             specificity cao hon -> override nguoc, dropdown bi row ke tiep che. Bump len
             999999 de dam bao luon noi tren moi noi dung page. */
      html body.skin-blue .select2-container--open,
      html body.skin-blue>.select2-container.select2-container--open,
      html body.skin-blue .select2-container--open .select2-dropdown {
        z-index: 999999 !important;
      }

      html body.skin-blue .modal .modal-content,
      html body.skin-blue>.modal .modal-content {
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 60px rgba(15, 23, 42, 0.3) !important;
        overflow: hidden !important;
        background: #ffffff !important;
      }

      html body.skin-blue .modal .modal-header,
      html body.skin-blue>.modal .modal-header {
        background: #223771 !important;
        color: #ffffff !important;
        border-bottom: 0 !important;
        padding: 15px 20px 10px 20px !important;
        min-height: 52px !important;
        border-top-left-radius: 12px !important;
        border-top-right-radius: 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        position: relative !important;
      }

      /* FIX 2026-08-26: Chu title TRANG DAM ro, khong bi color inherit tu style.css.
         Ep font-weight 600 + text-shadow nhe de tuong phan cao tren nen navy #223771. */
      html body.skin-blue .modal .modal-header .modal-title,
      html body.skin-blue .modal .modal-header .modal-title *,
      html body.skin-blue .modal .modal-header .modal-title span,
      html body.skin-blue .modal .modal-header .modal-title i,
      html body.skin-blue .modal .modal-header h4,
      html body.skin-blue .modal .modal-header h4 *,
      html body.skin-blue .modal .modal-header h5,
      html body.skin-blue .modal .modal-header h5 *,
      html body.skin-blue .modal .modal-header i,
      html body.skin-blue .modal .modal-header .myModalLabel,
      html body.skin-blue .modal .modal-header .myModalLabel *,
      html body.skin-blue .modal .modal-header .myModalLabel1,
      html body.skin-blue .modal .modal-header .myModalLabel1 *,
      html body.skin-blue .modal .modal-header .myModalLabel2,
      html body.skin-blue .modal .modal-header .myModalLabel2 * {
        color: #ffffff !important;
        font-weight: 600 !important;
        margin: 0 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      }

      html body.skin-blue .modal .modal-header .modal-title {
        font-size: 16px !important;
        line-height: 1.4 !important;
        flex: 1 1 auto !important;
        text-align: center !important;
      }

      /* Nut X: LUON o goc phai, canh giua doc, chu trang dam, hover do nhat */
      html body.skin-blue .modal .modal-header .close,
      html body.skin-blue .modal .modal-header .btn-close,
      html body.skin-blue .modal .modal-header button.close {
        position: absolute !important;
        right: 14px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        left: auto !important;
        float: none !important;
        color: #ffffff !important;
        opacity: 0.9 !important;
        background: transparent !important;
        border: 0 !important;
        font-size: 24px !important;
        font-weight: 400 !important;
        line-height: 1 !important;
        margin: 0 !important;
        padding: 4px 10px !important;
        text-shadow: none !important;
        cursor: pointer !important;
      }

      html body.skin-blue .modal .modal-header .close:hover,
      html body.skin-blue .modal .modal-header .btn-close:hover,
      html body.skin-blue .modal .modal-header button.close:hover {
        opacity: 1 !important;
        color: #ffdcdc !important;
      }

      html body.skin-blue .modal .modal-header .close span,
      html body.skin-blue .modal .modal-header .close *,
      html body.skin-blue .modal .modal-header button.close span,
      html body.skin-blue .modal .modal-header button.close * {
        color: inherit !important;
        text-shadow: none !important;
      }

      /* ═══ Alert & Confirm modal (myModalAlert): title CENTERED, × sat phai
             (kieu chuan cho popup thong bao — khac voi modal thong tin/list). ═══ */
      html body.skin-blue .modal.modal-alert .modal-header,
      html body.skin-blue .modal.modal-confirm .modal-header {
        position: relative !important;
        justify-content: center !important;
      }

      html body.skin-blue .modal.modal-alert .modal-header .modal-title,
      html body.skin-blue .modal.modal-confirm .modal-header .modal-title {
        margin: 0 auto !important;
        text-align: center !important;
      }

      html body.skin-blue .modal.modal-alert .modal-header .close,
      html body.skin-blue .modal.modal-alert .modal-header .btn-close,
      html body.skin-blue .modal.modal-confirm .modal-header .close,
      html body.skin-blue .modal.modal-confirm .modal-header .btn-close {
        position: absolute !important;
        right: 15px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        margin: 0 !important;
        text-shadow: none !important;
        padding: 0 8px !important;
      }

      /* Body text CENTERED (nen thong bao ngan gon, doc dep hon khi giua) */
      html body.skin-blue .modal.modal-alert .modal-body,
      html body.skin-blue .modal.modal-confirm .modal-body {
        text-align: center !important;
      }

      /* Footer: nut Dong sat phai (chuan modal action bar), nut Yes/Save neu co
             thi sat trai cua nut Dong (nhom cung nhau ben phai) */
      html body.skin-blue .modal.modal-alert .modal-footer,
      html body.skin-blue .modal.modal-confirm .modal-footer {
        justify-content: flex-end !important;
      }

      html body.skin-blue .modal .modal-header .close:hover,
      html body.skin-blue .modal .modal-header .btn-close:hover {
        opacity: 1 !important;
        color: #ffffff !important;
      }

      html body.skin-blue .modal .modal-body {
        padding: 16px 20px !important;
        background: #ffffff !important;
      }

      html body.skin-blue .modal .modal-footer {
        padding: 12px 20px !important;
        border-top: 1px solid #e2e8f0 !important;
        background: #f8fafc !important;
        display: flex !important;
        align-items: center !important;
        gap: 0px !important;
      }

      /* BS5 bo float .pull-left/.pull-right — modal-footer flex mac dinh dun het sang phai.
             Ep .pull-left (Xoa/destructive) tach trai bang margin-right: auto (chuan convention:
             destructive trai, Dong/Luu phai) */
      html body.skin-blue .modal .modal-footer .pull-left {
        margin-right: auto !important;
        /* float: none !important; */
      }

      html body.skin-blue .modal .modal-footer .pull-right {
        float: right !important;
        gap: 0 !important;
      }

      html body.skin-blue #myModalAlert .modal-footer {
        gap: 0px !important;
      }

      html body.skin-blue #myModalAlert .modal-header {
        padding: 15px 20px 10px 20px !important;
      }

      /* Buttons trong modal-footer: chuan hoa
             .btn-soft-danger (Xoa) → do subtle, .btn-default (Dong) → xam outline */
      html body.skin-blue .modal .modal-footer .btn.btn-soft-danger {
        background: #fee2e2 !important;
        color: #dc2626 !important;
        border: 1px solid #fecaca !important;
      }

      html body.skin-blue .modal .modal-footer .btn.btn-soft-danger:hover {
        background: #dc2626 !important;
        color: #ffffff !important;
        border-color: #dc2626 !important;
      }

      html body.skin-blue .modal .modal-footer .btn.btn-default {
        background: #ffffff !important;
        color: #475569 !important;
        border: 1px solid #cbd5e1 !important;
        display: block;
      }

      html body.skin-blue .modal .modal-footer .btn.btn-default:hover {
        background: #f0f3fd !important;
        border-color: #223771 !important;
        color: #223771 !important;
      }

      html body.skin-blue .modal .modal-footer .btn.btn-primary {
        background: #223771 !important;
        color: #ffffff !important;
        border: 1px solid #223771 !important;
        display: block;
      }

      html body.skin-blue .modal .modal-footer .btn.btn-default i,
      html body.skin-blue .modal .modal-footer .btn.btn-primary {
        padding-right: 3px;
      }

      html body.skin-blue .modal .modal-footer .btn.btn-primary:hover {
        background: #1c2e5f !important;
        border-color: #1c2e5f !important;
      }

      /* Bien nut .btnClose thanh button "x Dong" solid do — luon do, icon x luon hien */
      html body.skin-blue #main-content-wrapper .box-header .btnClose,
      html body.skin-blue #main-content-wrapper .box-header .btn.btnClose,
      html body.skin-blue #main-content-wrapper .box-header .btn.btn-default.btnClose {
        background: #dc2626 !important;
        color: #ffffff !important;
        padding: 6px 14px !important;
        border: 1px solid #dc2626 !important;
        border-radius: 6px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        opacity: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15) !important;
      }

      html body.skin-blue #main-content-wrapper .box-header .btnClose:hover,
      html body.skin-blue #main-content-wrapper .box-header .btn.btnClose:hover,
      html body.skin-blue #main-content-wrapper .box-header .btn.btn-default.btnClose:hover {
        background: #b91c1c !important;
        color: #ffffff !important;
        border-color: #b91c1c !important;
      }

      html body.skin-blue #main-content-wrapper .box-header .btnClose i,
      html body.skin-blue #main-content-wrapper .box-header .btnClose i.fa,
      html body.skin-blue #main-content-wrapper .box-header .btnClose i.fas {
        color: #ffffff !important;
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        font-size: 13px !important;
      }

      html body.skin-blue #main-content-wrapper .box-header .btnClose::after {
        content: "";
        color: #ffffff !important;
        font-size: 13px;
        font-weight: 600;
        line-height: 1;
      }

      /* Section .content padding — align voi header 60px */
      html body.skin-blue #main-content-wrapper section.content,
      html body.skin-blue #main-content-wrapper .content.MainPage {
        padding: 5px 15px !important;
      }

      /* Multi-table float layout (vd phancongphamvi.html: 6 table float:left width:300px).
             Khi row counts khac nhau, tables lech cao thap va noi dung cell can giua doc
             -> cam giac chu lech. Convert scroll-table-x sang flex, tat ca tables align top. */
      html body.skin-blue #main-content-wrapper .scroll-table-x {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        align-items: flex-start !important;
        overflow-x: auto;
      }

      html body.skin-blue #main-content-wrapper .scroll-table-x>table {
        float: none !important;
        margin: 0 !important;
        vertical-align: top !important;
      }

      html body.skin-blue #main-content-wrapper .scroll-table-x>table td,
      html body.skin-blue #main-content-wrapper .scroll-table-x>table th {
        vertical-align: middle !important;
      }
    </style>
  </head>
  <!--sidebar-mini-expand-feature sidebar-collapse colage when pageload ==>hold-transition skin-blue fixed sidebar-mini sidebar-mini-expand-feature sidebar-collapse-->
  <!--sidebar-mini only for display left-menu, tooglle this-->
  <!--onload="edu.system.initMain()" ==> link to dashboad-->

  <body class="hold-transition skin-blue">
    <form id="c_login" runat="server">
      <div class="wrapper">
        <div id="loading"></div>
        <div class="overlay" id="overlay"
          style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:1051; display:none; background:#fff; padding:30px 55px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.15); text-align:center; min-width:220px;">
          <i class="fas fa-spinner fa-spin fa-3x text-primary" style="color:#223771;"></i>
          <h5 style="margin:18px 0 0; color:#223771; font-weight:600; font-size:15px;">Đang tải dữ liệu...</h5>
        </div>
        <!-- Header-horizontal -->
        <header class="main-header">
          <a class="logo refeshlogo poiter"> <!-- Logo -->
            <span class="logo-mini">
              <asp:Label runat="server" ID="lbLogo_mini"></asp:Label>
            </span><!-- mini logo for sidebar mini 50x50 pixels -->
            <span class="logo-lg">
              <asp:Label runat="server" ID="lbLogo_large"></asp:Label>
            </span><!-- logo for regular state and mobile devices -->

          </a>
          <nav class="navbar navbar-static-top"><!-- Header Navbar: style can be found in header.less -->
            <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button"> <!-- Sidebar toggle button-->
              <span class="sr-only">Cổng cán bộ</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </a>
            <div class="navbar-custom-menu">
              <ul class="nav navbar-nav">
                <!-- alert timer -->
                <li class="dropdown">
                  <ul class="dropdown-menu alert_timer" style="margin-top: 50px;">
                  </ul>
                </li>

                <li class="dropdown messages-menu" style="display: none">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" id="zoneAllMessage">
                    <i class="fa fa-comments-o"></i>
                    <!--<span class="label label-success">4</span>-->
                  </a>
                  <ul class="dropdown-menu">
                    <li class="header">
                      <a class="btn btn-default" id="btnAddUserChat">
                        <i class="fa fa-plus cl-active"></i>
                        Thêm mới
                      </a>
                    </li>
                    <li>
                      <!-- inner menu: contains the actual data -->
                      <ul class="menu" id="zoneUserChat">

                      </ul>
                    </li>
                    <li class="footer"><a href="#">See All Messages</a></li>
                  </ul>
                </li>
                <!-- board - notify -->
                <li class="dropdown notifications-menu"><!-- Notifications: style can be found in dropdown.less -->
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i class="fa fa-bell-o"></i>
                    <span class="label label-warning" id="zone_number_notify">0</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li class="header">Không có thông báo mới</li>
                    <li>
                      <ul class="menu"><!-- inner menu: contains the actual data -->

                      </ul>
                    </li>
                    <li class="footer"><a href="#">Xem tất cả</a></li>
                  </ul>
                </li>
                <!-- board - task -->
                <li class="dropdown tasks-menu">
                  <!-- Menu Toggle Button -->
                  <a class="dropdown-toggle" aria-expanded="false" href="#" data-toggle="dropdown">
                    <i class="fa fa-flag-o"></i>
                    <span class="label label-danger" id="sysTask_Notify">0</span>
                  </a>
                  <ul class="dropdown-menu">
                    <li class="header">Tiến trình của bạn</li>
                    <li id="sysTask_Content">
                      <!-- Inner menu: contains the tasks -->
                      <div class="slimScrollDiv"
                        style="width: auto; height: 200px; overflow: hidden; position: relative;">
                        <ul id="sysTask_Name" class="menu" style="width: 100%; height: 200px; overflow: hidden;">
                          <!-- call from js -->

                        </ul>
                        <div class="slimScrollBar"
                          style="background: rgb(0, 0, 0); border-radius: 7px; top: 0px; width: 3px; right: 1px; display: block; position: absolute; z-index: 99; opacity: 0.4;">
                        </div>
                        <div class="slimScrollRail"
                          style="background: rgb(51, 51, 51); border-radius: 7px; top: 0px; width: 3px; height: 100%; right: 1px; display: none; position: absolute; z-index: 90; opacity: 0.2;">
                        </div>
                      </div>
                    </li>
                    <li class="footer">
                      <a href="#">Xem tất cả</a>
                    </li>
                  </ul>
                </li>
                <!-- board - login -->
                <li class="dropdown user user-menu">
                  <!-- Menu Toggle Button -->
                  <a class="dropdown-toggle" aria-expanded="false" href="#" data-toggle="dropdown">
                    <!-- The user image in the navbar-->
                    <img class="user-image" id="imgavatar">
                    <!-- hidden-xs hides the username on small devices so only the image appears. -->
                    <span class="hidden-xs">
                      <%=fullname %>
                    </span>
                  </a>
                  <ul class="dropdown-menu">
                    <!-- The user image in the menu -->
                    <li class="user-header">
                      <img class="img-circle" id="imgavatardrop" />
                      <p id="lblHoTenNguoiDung">
                        <%=fullname %>
                      </p>
                    </li>
                    <!-- Menu Body -->
                    <li class="user-body">
                      <div class="col-xs-12 text-center">
                        <a href="Pages/ChangePass.aspx"><i class="fa fa-exchange"></i> Đổi mật khẩu</a>
                      </div>
                    </li>
                    <!-- Menu Footer-->
                    <li class="user-footer">
                      <div class="pull-left">
                        <a class="btn btn-default btn-flat" id="btnProfile" href="#"><i class="fa fa-user-secret"></i>
                          Hồ sơ cá nhân</a>
                      </div>
                      <div class="pull-right">
                        <a class="btn btn-default btn-flat" href="Logout.aspx"><i class="fa fa-sign-out"></i> Đăng
                          xuất</a>
                      </div>
                    </li>
                  </ul>
                </li>
                <!-- board - list_app -->
                <li>
                  <a href="#" data-toggle="control-sidebar" id="btnSileApp"><i class="fa fa-th"></i></a>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <!--Menu_left_vertical-->
        <aside class="main-sidebar">

          <%--<div class="sidebar-menu">
            <div class="accordion" id="sidebar-menu">
            </div>
      </div>--%>
      <section class="sidebar"><!-- sidebar: style can be found in sidebar.less -->
        <div class="sidebar-form">
          <div class="input-group">
            <input type="text" name="q" id="txtSearch_Fun" class="form-control" placeholder="Tìm kiếm chức năng">
            <span class="input-group-btn"><button name="search" class="btn btn-flat"><i
                  class="fa fa-search"></i></button></span>
          </div>
        </div>
        <ul class="sidebar-menu" data-widget="tree" id="menu_vertical">
          <!--Load js from ../Core/systemextend/getlist_ChucNang()-->
        </ul>
      </section>
      </aside>
      <!-- Content Wrapper. Contains page content -->
      <div>
        <div class="content-wrapper">
          <section class="content-header">
            <div class="row">
              <div class="col-lg-12">
                <ul class="list-group">
                  <li class="list-group-item list-group-title" id="lblPath_ChucNang">
                    <!-- Load path chucnang from systemroot.js -->
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <div id="main-content-wrapper">
            <!--LOAD HTML HERE-->
          </div>

          <div class="modal fade" id="myModalRoomChat" role="dialog" aria-labelledby="myModalRoomChat"
            aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content" style="width: 1000px">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                      class="sr-only">Close</span></button>
                  <h4 class="modal-title"><span class="myModalLabel"><i class="fa fa-plus"></i> Thêm mới - </span> <span
                      class="lang" key="">Tin nhắn</span> </h4>
                </div>
                <div class="modal-body" id="dsUserChat">

                  <div class="nav-tabs-custom">
                    <ul class="nav nav-tabs">
                      <li class="active"><a href="#tab_online" data-toggle="tab" aria-expanded="true"><span class="lang"
                            key=""><i class="fa fa-clipboard"></i> Online</span></a></li>
                      <li class=""><a href="#tab_banbe" data-toggle="tab" aria-expanded="true"><span class="lang"
                            key=""><i class="fa fa-retweet"></i> Bạn bè</span></a></li>
                      <li class=""><a href="#tab_trongtruong" data-toggle="tab" aria-expanded="true"><span class="lang"
                            key=""><i class="fa fa-retweet"></i> Trong trường</span></a></li>
                    </ul>
                    <div class="tab-content">
                      <!-- HO SO LY LICH -->
                      <div class="tab-pane active" id="tab_online">
                        <div class="box-body">
                          <div class="pull-right">
                            <div class="col-sm-12 item-search">
                              <input id="txtUserOnline_TuKhoa" class="form-control"
                                placeholder="Nhập từ khóa tìm kiếm" />
                            </div>
                            <div class="col-sm-12 item-search">
                              <a class="btn btn-default" id="btnReload"><i class="fa fa-refresh"></i> <span class="lang"
                                  key="">Refresh user</span></a>
                            </div>
                          </div>
                          <div class="row">
                            <table id="tblUserOnline" class="table table-hover table-bordered">
                              <thead>
                                <tr>
                                  <th class="td-fixed td-center">Stt</th>
                                  <th class="td-center">Ảnh</th>
                                  <th class="td-center">Họ tên</th>
                                  <th class="td-center">Đơn vị</th>
                                  <th class="td-center">Ứng dụng</th>
                                  <th class="td-center">Chức năng</th>
                                  <th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_Online"></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane " id="tab_banbe">
                        <div class="box-body">
                          <div class="pull-right">
                            <div class="col-sm-12 item-search">
                              <input id="txtUserBanBe_TuKhoa" class="form-control"
                                placeholder="Nhập từ khóa tìm kiếm" />
                            </div>
                          </div>
                          <div class="row">
                            <table id="tblUserBanBe" class="table table-hover table-bordered">
                              <thead>
                                <tr>
                                  <th class="td-fixed td-center">Stt</th>
                                  <th class="td-center">Ảnh</th>
                                  <th class="td-center">Họ tên</th>
                                  <th class="td-center">Đã dùng</th>
                                  <th class="td-center">Đơn vị</th>
                                  <th class="td-center">Truy cập</th>
                                  <th class="td-center td-fixed"></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane" id="tab_trongtruong">
                        <div class="box-body">
                          <div>
                            <div class="col-sm-3 item-search">
                              <select id="dropSearch_DonViChat" class="select-opt">
                                <option value="TRONGTRUONG">Trong trường</option>
                              </select>
                            </div>
                            <div class="col-sm-3 item-search">
                              <select id="dropSearch_PhanLoaiSuDung" class="select-opt">
                                <option value="CANBO">Cán bộ</option>
                                <option value="SINHVIEN">Sinh viên</option>
                                <option value="CUUSINHVIEN">Cựu sinh viên</option>
                                <option value="GIADINH">Gia đình</option>
                                <option value="DOITAC">Đối tác</option>
                              </select>
                            </div>
                            <div class="col-sm-3 item-search">
                              <input id="txtUserKhac_TuKhoa" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />
                            </div>
                            <div class="col-sm-3 item-search">
                              <a class="btn btn-default" id="btnUserKhac_Search"><i class="fa fa-search"></i> <span
                                  class="lang" key="">Tìm kiếm</span></a>
                            </div>
                          </div>
                          <div class="row">
                            <table id="tblUserKhac" class="table table-hover table-bordered">
                              <thead>
                                <tr>
                                  <th class="td-fixed td-center">Stt</th>
                                  <th class="td-center">Ảnh</th>
                                  <th class="td-center">Họ tên</th>
                                  <th class="td-center">Mã số</th>
                                  <th class="td-center">Email</th>
                                  <th class="td-center td-fixed"></th>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--End row-->
                </div>
                <div id="notifyRoomChat"></div>
                <div class="modal-footer">
                  <%--<a class="submit btn btn-primary" id="btnSave_DMTB"><i class="fa fa-toggle-on"></i><span
                      class="lang" key="">Lưu</span></a>--%>
                    <button type="button" class="btn btn-default" data-dismiss="modal"><i
                        class="fa fa-times-circle"></i><span class="lang" key=""> Đóng</span></button>
                </div>
              </div>
            </div>
          </div>
          <div style="position: fixed; bottom: 0; right: 0" id="zoneChat"></div>
        </div>
      </div>
      <!-- Footer -->
      <footer class="main-footer">
        <div class="pull-right hidden-xs"><b>Version</b> 1.0.0</div>
      </footer>
      <!--App_List_rightSide_vertical-->
      <aside class="control-sidebar control-sidebar-light">
        <div class="control-sidebar-app">
          <div class="input-group search-app">
            <input name="q" id="txtSearch_App" class="form-control" placeholder="Tìm kiếm ứng dụng" type="text">
            <span class="input-group-btn"><button name="search" class="btn btn-flat"><i
                  class="fa fa-search"></i></button></span>
          </div>
          <table id="tblApp" class="table table-hover tblApp table-noborder table-bordered">
            <tbody>
            </tbody>
          </table>
        </div>
      </aside><!-- /.control-sidebar -->
      <!-- Add the sidebar's background. This div must be placed immediately after the control sidebar -->
      <div class='control-sidebar-bg'></div>
      <div id="alert"></div>
      <asp:HiddenField ID="myTextBox" runat="server"></asp:HiddenField>
      </div>
    </form>
    <!--SCRIPTS-->
    <script type="text/javascript" src="App_Themes/Plugins/jquery/jquery.min.js"></script><!-- jQuery 3 -->
    <script type="text/javascript" src="App_Themes/Plugins/jquery-iu/jquery-ui.min.js"></script><!-- jQuery-iu 2.1.4 -->
    <script> $.widget.bridge('uibutton', $.ui.button);</script>
    <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
    <script type="text/javascript" src="App_Themes/Plugins/bootstrap/js/bootstrap.min.js"></script>
    <!-- Bootstrap 3.3.7 -->
    <script type="text/javascript" src="App_Themes/Plugins/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    <!--SlimScroll -->
    <script type="text/javascript" src="App_Themes/Plugins/fastclick/lib/fastclick.min.js"></script><!-- FastClick -->
    <script type="text/javascript" src="App_Themes/Cms/adminlte/js/adminlte.min.js"></script>
    <!--Template AdminLTE App -->
    <script type="text/javascript" src="App_Themes/Plugins/select2/js/select2.min.js"></script><!--select_option-->
    <script type="text/javascript">
      /* [SELECT2-DROPDOWN-PARENT] Force moi Select2 append dropdown vao body,
         tranh bi clip boi container cha co overflow. Set default NGAY khi
         library load, truoc khi module JS goi .select2().
         Them bao hiem: retry tren jQuery ready + auto-fix moi container--open
         moi xuat hien (dam bao module reload cung duoc ap dung). */
      (function () {
        function forceBodyParent() {
          if (typeof $ !== 'undefined' && $.fn && $.fn.select2 && $.fn.select2.defaults) {
            try { $.fn.select2.defaults.set('dropdownParent', $(document.body)); } catch (e) { }
          }
        }
        forceBodyParent();
        if (typeof $ !== 'undefined') { $(function () { forceBodyParent(); }); }
        // MutationObserver toan cuc: bat moi .select2-container--open moi xuat hien,
        // di chuyen ra body va ep z-index max, phong khi module init select2 khong
        // ke thua dropdownParent (bi override boi call site khac).
        // FIX 2026-08-24: SKIP move sang body neu container da nam trong modal dang mo
        // (module da init select2 voi dropdownParent = modal). Neu van move, coord bay
        // ra 0,0 screen vi position:absolute + khong co top/left.
        if (typeof MutationObserver !== 'undefined') {
          var obs = new MutationObserver(function (muts) {
            muts.forEach(function (m) {
              m.addedNodes.forEach(function (n) {
                if (n.nodeType !== 1) return;
                var opens = [];
                if (n.classList && n.classList.contains('select2-container--open')) opens.push(n);
                if (n.querySelectorAll) {
                  n.querySelectorAll('.select2-container--open').forEach(function (x) { opens.push(x); });
                }
                opens.forEach(function (node) {
                  // Neu container da nam trong modal dang mo → giu nguyen, chi set z-index max
                  var inModal = node.closest && node.closest('.modal.show, .modal.in, .modal[style*="display: block"], .modal[style*="display:block"]');
                  if (inModal) {
                    node.style.zIndex = '100050';
                    return;
                  }
                  if (node.parentNode !== document.body) document.body.appendChild(node);
                  node.style.zIndex = '999999';
                  node.style.position = 'absolute';
                });
              });
            });
          });
          obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
        }
      })();
    </script>
    <script type="text/javascript" src="App_Themes/Plugins/currency/ax5core.min.js"></script>
    <!--Start script cho currency number-->
    <script type="text/javascript" src="App_Themes/Plugins/currency/ax5formatter.min.js"></script>
    <!--Start script cho currency number-->
    <script type="text/javascript" src="App_Themes/Plugins/chartjs/Chart.min.js"></script><!--ChartJS-->
    <script type="text/javascript" src="App_Themes/Plugins/pagination/jquery.simplePagination.min.js"></script>
    <!--Plugin pagination-->
    <script type="text/javascript" src="App_Themes/Plugins/jstree/dist/jstree.min.js"></script><!--Plugin jstree-->
    <script type="text/javascript" src="App_Themes/Plugins/datepicker/bootstrap-datepicker.min.js"></script>
    <!--Plugin bootstrap-->
    <script type="text/javascript" src="App_Themes/Plugins/cleave.js/dist/cleave.min.js"></script><!--Plugin cleave-->
    <script type="text/javascript" src="App_Themes/Plugins/pagination/crypto-js.js"></script><!-- jQuery 3 -->
    <script type="text/javascript" src="Scripts/ckeditor/ckeditor.js?v=1.0.0.41"></script><!-- editor -->
    <script type="text/javascript" src="Scripts/ckfinder/ckfinder.js?v=1.0.0.31"></script>
    <script type="text/javascript"
      src="Scripts/ckeditor/plugins/ckeditor_wiris/integration/WIRISplugins.js?v=1.0.0.31"></script>
    <!--  src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image" -->

    <script type="text/javascript"
      src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    <!-- <script type="text/javascript" src="Scripts/MathJax/MathJax.js"></script> -->
    <!--  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=MML_HTMLorMML" -->

    <script src="<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload")%>/Core/uploadfile.js?v=1.0.0.12"></script><!--CORE JS-->
    <script src="<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload")%>/Core/uploadavatar.js?v=1.0.0.12"></script><!--CORE JS-->

    <script type="text/javascript" src="Corei/constant.js?v=<%= Guid.NewGuid().ToString() %>"></script> <!--CORE JS-->
    <script type="text/javascript" src="Corei/systemroot.js?v=<%= Guid.NewGuid().ToString() %>"></script> <!--CORE JS-->
    <script type="text/javascript" src="Corei/util.js?v=1.3.1.17"></script> <!--CORE JS-->
    <script type="text/javascript" src="Corei/systemextend.js?v=<%= Guid.NewGuid().ToString() %>"></script>
    <!--CORE JS-->
    <script type="text/javascript" src="Config.js?v=<%= Guid.NewGuid().ToString() %>"></script><!--CORE JS-->
    <script type="text/javascript" src="App_Themes/Cms/Custom_V1/customs.js"></script><!-- custom -->

    <script type="text/javascript">
        /* FIX 2026-09-05: SMART SELECT-ALL cho MOI bang phan trang server-side.
           Van de: ~150 file JS co handler #chkSelectAll_XXX chi tick 10 dong visible;
           voi bang co 24 / 800 / 29K dong (nhieu trang) user phai bam tung trang.
           Giai phap: Bind delegated GLOBAL cho MOI checkbox id^="chkSelectAll_" trong
           <thead> — sau khi handler goc chay xong, phat hien tong > visible thi hoi
           user co muon TAI VA CHON HET, force pageSize=100000, reload, auto-tick het.
           Chay o document level nen chan MOI cai click bat ke bind sau khi trang load. */
        (function () {
          if (typeof jQuery === 'undefined') return;
          var $ = jQuery;
          $(document).off('click.smartSelectAll')
            .on('click.smartSelectAll',
              'thead input[type=checkbox][id^="chkSelectAll_"]', function () {
                var $ck = $(this);
                if (!$ck.is(':checked')) return; // bo tick -> khong lam gi
                var $tbl = $ck.closest('table');
                var tblId = $tbl.attr('id');
                if (!tblId) return;
                // Parse tong dong tu label ".info-{tblId}" render boi systemroot pagination
                var $info = $('.info-' + tblId);
                var infoText = ($info.text() || '').trim();
                var m = infoText.match(/(\d+)\s*d[ữu]\s*li[ệe]u/i);
                var totalRows = m ? parseInt(m[1], 10) : 0;
                var visibleRows = $tbl.find('tbody input:checkbox').length;
                if (!totalRows || totalRows <= visibleRows) return; // ok da du -> skip
                // Delay 10ms de handler goc (checkedAll_BgRow) chay xong roi moi hoi
                setTimeout(function () {
                  var msg = 'Trang hiện chỉ hiển thị ' + visibleRows + '/' + totalRows +
                    ' dòng.\n\nBạn có muốn TẢI VÀ CHỌN HẾT ' + totalRows +
                    ' dòng không? (có thể mất vài giây)';
                  if (!confirm(msg)) return; // user cancel -> giu 10 dong visible
                  // Force pageSize = 100000 va trigger reload qua dropdown change
                  var $ddl = $('[id$=dropPageSizechange' + tblId + ']');
                  if (!$ddl.length) $ddl = $('#dropPageSizechange' + tblId);
                  if ($ddl.length) {
                    if ($ddl.find('option[value="100000"]').length === 0) {
                      $ddl.append('<option value="100000">Tất cả</option>');
                    }
                    if (typeof edu !== 'undefined' && edu.system) {
                      edu.system.pageSize_default = 100000;
                      edu.system.pageIndex_default = 1;
                    }
                    $ddl.val('100000').trigger('change');
                  }
                  // Poll cho toi khi bang co so dong moi (> old + 2 de tranh false trigger)
                  var tries = 0;
                  var oldCount = visibleRows;
                  var timer = setInterval(function () {
                    tries++;
                    var nowCount = $tbl.find('tbody input:checkbox').length;
                    if (nowCount > oldCount + 2 || tries > 120) {
                      clearInterval(timer);
                      setTimeout(function () {
                        $tbl.find('tbody input:checkbox')
                          .prop('checked', true).attr('checked', true);
                        $tbl.find('tbody tr').addClass('active');
                        $ck.prop('checked', true);
                      }, 150);
                    }
                  }, 250);
                }, 10);
              });
        })();
    </script>

    <script type="text/javascript">

      if (typeof Init_API != "function") {
        function Init_API() {
          var oApi = {
            CM: '<%= Apis.CommonV1.Base.AppSetting.GetString("CM") %>',
            SYS: '<%= Apis.CommonV1.Base.AppSetting.GetString("CM") %>',
            CMS: '<%= Apis.CommonV1.Base.AppSetting.GetString("CMS") %>',
            DKH: '<%= Apis.CommonV1.Base.AppSetting.GetString("DKH") %>',
            KHCT: '<%= Apis.CommonV1.Base.AppSetting.GetString("KHCT") %>',
            KS: '<%= Apis.CommonV1.Base.AppSetting.GetString("KS") %>',
            KTX: '<%= Apis.CommonV1.Base.AppSetting.GetString("KTX") %>',
            NCKH: '<%= Apis.CommonV1.Base.AppSetting.GetString("NCKH") %>',
            NS: '<%= Apis.CommonV1.Base.AppSetting.GetString("NS") %>',
            D: '<%= Apis.CommonV1.Base.AppSetting.GetString("D") %>',
            SV: '<%= Apis.CommonV1.Base.AppSetting.GetString("SV") %>',
            SMS: '<%= Apis.CommonV1.Base.AppSetting.GetString("SMS") %>',
            TC: '<%= Apis.CommonV1.Base.AppSetting.GetString("TC") %>',
            TKGG: '<%= Apis.CommonV1.Base.AppSetting.GetString("TKGG") %>',
            L: '<%= Apis.CommonV1.Base.AppSetting.GetString("L") %>',
            CC: '<%= Apis.CommonV1.Base.AppSetting.GetString("CC") %>',
            HLTL: '<%= Apis.CommonV1.Base.AppSetting.GetString("HLTL") %>',
            RL: '<%= Apis.CommonV1.Base.AppSetting.GetString("RL") %>',
            XLHV: '<%= Apis.CommonV1.Base.AppSetting.GetString("XLHV") %>',
            HDDT: '<%= Apis.CommonV1.Base.AppSetting.GetString("HDDT") %>',
            NH: '<%= Apis.CommonV1.Base.AppSetting.GetString("NH") %>',
            TS: '<%= Apis.CommonV1.Base.AppSetting.GetString("TS") %>',
            LVLA: '<%= Apis.CommonV1.Base.AppSetting.GetString("LVLA") %>',
            QLTTN: '<%= Apis.CommonV1.Base.AppSetting.GetString("QLTTN") %>',
            TTN: '<%= Apis.CommonV1.Base.AppSetting.GetString("TTN") %>',
            TN: '<%= Apis.CommonV1.Base.AppSetting.GetString("TN") %>',
            CTT: '<%= Apis.CommonV1.Base.AppSetting.GetString("CTT") %>',
            TP: '<%= Apis.CommonV1.Base.AppSetting.GetString("TP") %>',
            TT: '<%= Apis.CommonV1.Base.AppSetting.GetString("TT") %>',
          };

          return oApi;
        }
      } else {
        console.log("Load config form config.js");
      }

      var edu = {};
      edu['system'] = new systemroot();
      edu['extend'] = new systemextend();
      edu['constant'] = new constant();
      edu['util'] = new util();
      $(document).ready(function () {
        edu.system.startApp();
        edu.extend.init();
        edu.constant.init();
        initSidebarActiveEnforcer();
        // Inject 1 style block cuoi body -> cascade cuoi cung, thang bat cu
        // CSS nao code-behind chen vao head server sau inline style tren.
        injectFinalSidebarStyles();
      });

      function injectFinalSidebarStyles() {
        if (document.getElementById('reskin-final-style')) return;
        var s = document.createElement('style');
        s.id = 'reskin-final-style';
        s.textContent = [
          'html body.skin-blue .main-sidebar, html body.skin-blue .left-side { background: #223771 !important; box-shadow: none !important; }',
          // KEY: styles.css:2987 co .menu-open { background: #fff !important } rat broad
          // - ep transparent trong scope sidebar de khong bi nen trang chen ngang.
          'html body.skin-blue .main-sidebar .menu-open, html body.skin-blue #menu_vertical .menu-open, html body.skin-blue #menu_vertical li { background: transparent !important; background-color: transparent !important; }',
          'html body.skin-blue #menu_vertical .treeview-menu, html body.skin-blue .sidebar-menu .treeview-menu { background:#1a2b5c !important; background-color:#1a2b5c !important; border-radius: 0 !important; margin: 2px 0 4px 0px !important; padding: 2px 0 2px 6px !important; border-left: 1px solid rgba(210,221,253,0.18) !important; box-shadow: none !important; }',
          'html body.skin-blue #menu_vertical .treeview-menu > li > a, html body.skin-blue .sidebar-menu .treeview-menu > li > a { color: #ffffff; font-weight: 500 !important; background: transparent !important; background-image: none !important; border-left: 1px solid rgba(210, 221, 253, 0.4) !important; }',
          'html body.skin-blue #menu_vertical .treeview-menu > li.active > a, html body.skin-blue #menu_vertical .treeview-menu > li.menu-open > a, html body.skin-blue #menu_vertical .treeview-menu > li > a:hover, html body.skin-blue .sidebar-menu .treeview-menu > li.active > a, html body.skin-blue .sidebar-menu .treeview-menu > li.menu-open > a, html body.skin-blue .sidebar-menu .treeview-menu > li > a:hover, html body.skin-blue .sidebar-menu .treeview-menu > li.active, html body.skin-blue .sidebar-menu .treeview-menu > li.menu-open, html body.skin-blue #menu_vertical .treeview-menu > li.active, html body.skin-blue #menu_vertical .treeview-menu > li.menu-open { color: #f8843d !important; background: transparent !important; background-color: transparent !important; border-left: 1px solid rgba(210, 221, 253, 0.4) !important; outline: none !important; box-shadow: none !important; border-radius: 0 !important; }',
          'html body.skin-blue #menu_vertical .treeview-menu > li > a::before, html body.skin-blue #menu_vertical .treeview-menu > li > a::after { background-color: rgba(210,221,253,0.4) !important; }',
          'html body.skin-blue #menu_vertical .treeview-menu > li.active > a::before, html body.skin-blue #menu_vertical .treeview-menu > li.active > a::after, html body.skin-blue #menu_vertical .treeview-menu > li.menu-open > a::before, html body.skin-blue #menu_vertical .treeview-menu > li.menu-open > a::after, html body.skin-blue #menu_vertical .treeview-menu > li > a:hover::before, html body.skin-blue #menu_vertical .treeview-menu > li > a:hover::after { background-color: #f8843d !important; }'
        ].join('\n');
        document.body.appendChild(s);
      }

      // Force inline style trên menu items để win qua mọi CSS !important của
      // AdminLTE + styles.css legacy (đặc biệt .skin-blue .sidebar-menu>li.active>a
      // { background: #fff !important } và .treeview-menu { background: #f4f4f4 !important }).
      // MutationObserver theo dõi class thay đổi trên li, chạy lại mỗi khi systemroot
      // render menu hoặc user click chuyển màn.
      function initSidebarActiveEnforcer() {
        var menu = document.getElementById('menu_vertical');
        if (!menu) return;

        // Style cho top-level (có border-left orange indicator)
        var TOP_ACTIVE = {
          'background': 'rgba(29, 78, 216, 1)',
          'background-image': 'none',
          'color': '#fff',
          'border-left': '0px solid #f8843d',
          'font-weight': '700'
        };
        var TOP_DEFAULT = {
          'background': 'transparent',
          'background-image': 'none',
          'color': '#ffffff',
          'border-left': '3px solid transparent',
          'font-weight': '500'
        };
        // Style cho submenu (không border-left, tương phản cao hơn)
        var SUB_ACTIVE = {
          'background': 'transparent',
          'background-image': 'none',
          'color': '#f8843d',
          'font-weight': '400'
        };
        var SUB_DEFAULT = {
          'background': 'transparent',
          'background-image': 'none',
          // 'color': '#ffffff',
          'font-weight': '500'
        };
        // Container submenu: trong suốt, phân cấp bằng border-left mỏng
        // (khớp NewUI sidebar.tsx style, không tạo "bóng đen")
        var SUB_UL = {
          'background': '#1a2b5c !importantansparent',
          'background-color': '#1a2b5c !important',
          'background-image': 'none',
          'border-radius': '0',
          // 'border-left': '1px solid rgba(210, 221, 253, 0.18)',
          'border-left': '0',
          // 'margin': '2px 0 4px 0px',
          'margin': ' 0px',
          // 'padding': '2px 0 2px 6px',
          'padding': '0',

        };

        function setStyle(el, obj) {
          if (!el) return;
          Object.keys(obj).forEach(function (k) {
            el.style.setProperty(k, obj[k], 'important');
          });
        }
        function apply() {
          // Top-level items: direct child of #menu_vertical
          menu.querySelectorAll('#menu_vertical > li > a').forEach(function (a) {
            var li = a.parentElement;
            var isActive = li.classList.contains('active') || li.classList.contains('menu-open');
            setStyle(a, isActive ? TOP_ACTIVE : TOP_DEFAULT);
          });
          // Sub-items inside .treeview-menu
          menu.querySelectorAll('.treeview-menu > li > a').forEach(function (a) {
            var li = a.parentElement;
            var isActive = li.classList.contains('active') || li.classList.contains('menu-open');
            setStyle(a, isActive ? SUB_ACTIVE : SUB_DEFAULT);
          });
          // Force treeview-menu container bg (thang #f4f4f4 !important cua styles.css)
          menu.querySelectorAll('.treeview-menu').forEach(function (ul) {
            setStyle(ul, SUB_UL);
          });
          // KEY FIX: styles.css:2987 co rule .menu-open { background: #fff !important }
          // rat broad - moi LI co .menu-open bi nen trang. Ep transparent cho tat ca LI.
          menu.querySelectorAll('li').forEach(function (li) {
            li.style.setProperty('background', 'transparent', 'important');
            li.style.setProperty('background-color', 'transparent', 'important');
          });
        }
        // Lần đầu (sau khi menu render)
        setTimeout(apply, 300);
        setTimeout(apply, 1000);
        // Mỗi lần class li thay đổi (AdminLTE tree toggle active) hoặc DOM thay đổi
        var mo = new MutationObserver(function () { setTimeout(apply, 30); });
        mo.observe(menu, {
          childList: true, subtree: true,
          attributes: true, attributeFilter: ['class']
        });
        // Click trên menu link (menu chuyển) → apply lại sau tick
        $(menu).on('click', 'a', function () { setTimeout(apply, 100); });
      }
    </script>
  </body>

  </html>