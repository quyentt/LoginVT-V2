<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="Apis.LoginVT.Index" ResponseEncoding="utf-8" ContentType="text/html" %>
<% Response.Charset = "utf-8"; Response.ContentEncoding = System.Text.Encoding.UTF8; %>
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Force light color scheme — chan browser tu dong invert / doi mau khi user OS o
         dark mode (gay ra vien do/hong la tren sidebar submenu, form controls...). -->
    <meta name="color-scheme" content="light only">
    <title>Education management</title>
    <link rel="stylesheet" href="assets/css/styles.css?v=601">
    <link href="assets/select2/css/select2.min.css" rel="stylesheet" />
    <link href="assets/pagination/simplePagination.min.css" rel="stylesheet" />
    <link href="App_Themes/Plugins/jstree/dist/themes/default/style.min.css" rel="stylesheet" /><!-- editor -->
    <link rel="shortcut icon" type="image/x-icon" href="assets/images/logo.ico" />

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
         Chrome dark theme adjustments tu do bien viet ve tren border/outline. */
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

      /* Sidebar: bulletproof — chan MOI kha nang browser inject vien do (High Contrast
         Mode, Chrome dark focus outline, extensions, autofill highlight...). Force outline
         va box-shadow ve 0/tone chinh, khong cho browser tu quyet dinh mau focus. */
      .left-sidebar,
      .left-sidebar *,
      .sidebar-menu,
      .sidebar-menu *,
      .sidebar-menu-sub,
      .sidebar-menu-sub * {
        forced-color-adjust: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      .left-sidebar *:focus,
      .left-sidebar *:focus-visible,
      .left-sidebar *:active,
      .sidebar-menu *:focus,
      .sidebar-menu *:focus-visible,
      .sidebar-menu *:active,
      .sidebar-menu-sub a:focus,
      .sidebar-menu-sub a:focus-visible,
      .sidebar-menu-sub a:active {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
        box-shadow: none !important;
        border-color: transparent !important;
      }

      /* Focus visible: khong dung outline vien cam (xau) — chi doi mau chu */
      .sidebar-menu-sub a:focus-visible {
        outline: none !important;
        color: #f8843d !important;
      }

      /* FCM header notifications: layout only (no new colors) */
      #fcm-noti-button {
        position: relative;
      }

      #fcm-noti-badge {
        position: absolute;
        top: -6px;
        right: -10px;
        line-height: 1;
      }

      #fcm-noti-menu {
        min-width: 340px;
        max-width: 420px;
        max-height: 420px;
        overflow: auto;
      }

      .fcm-noti-item-title {
        font-weight: 600;
      }

      .head-search-box {
        position: relative;
      }

      .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #e3e6ef;
        border-radius: 6px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, .12);
        margin-top: 4px;
        max-height: 360px;
        overflow-y: auto;
        z-index: 2050;
        display: none;
        padding: 4px 0;
        list-style: none;
      }

      .search-suggestions.show {
        display: block;
      }

      .search-suggestions li {
        padding: 8px 14px;
        cursor: pointer;
        color: #333;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .search-suggestions li:hover,
      .search-suggestions li.active {
        background: #f1f5ff;
        color: #1967d2;
      }

      .search-suggestions li i {
        color: #1967d2;
        width: 16px;
        text-align: center;
      }

      .search-suggestions li .parent {
        margin-left: auto;
        font-size: 12px;
        color: #8a8f99;
      }

      .search-suggestions .empty {
        padding: 10px 14px;
        color: #8a8f99;
        font-style: italic;
        cursor: default;
      }

      /* ─── Role picker (giao diện chọn vai trò kiểu mới) ─── */
      /* Reset background image + màu chữ của .quick-action cho gọn */
      .dashboard-content .quick-action {
        background: transparent !important;
        margin-top: 0 !important;
        padding: 20px 25px 25px;
      }

      .dashboard-content .quick-action .welcome {
        color: #64748b;
        font-style: italic;
        font-size: 14px;
        padding-top: 0;
      }

      .dashboard-content .quick-action .welcome strong {
        font-weight: 700;
        font-style: normal;
        color: #223771;
      }

      .dashboard-content .quick-action .quick-acction-title {
        color: #0f172a !important;
        font-size: 22px;
        font-weight: 700;
        margin: 6px 0 18px;
      }

      .role-picker-toolbar {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
      }

      .role-picker-search {
        position: relative;
        flex: 1;
        height: 42px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 999px;
        display: flex;
        align-items: center;
        transition: border-color .2s ease, box-shadow .2s ease;
      }

      .role-picker-search:focus-within {
        border-color: #cbd5e1;
      }

      /* Ghi đè global input:focus trong all.css/bootstrap để không vẽ viền màu quanh input */
      .role-picker-search input,
      .role-picker-search input:focus,
      .role-picker-search input:focus-visible,
      .role-picker-search input:active {
        border: 0 !important;
        outline: none !important;
        box-shadow: none !important;
        border-color: transparent !important;
      }

      .role-picker-search>.fa-search {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
        font-size: 14px;
        pointer-events: none;
      }

      .role-picker-search input {
        flex: 1;
        height: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        padding: 0 40px 0 42px;
        font-size: 14px;
        color: #0f172a;
      }

      .role-picker-search input::placeholder {
        color: #94a3b8;
      }

      .role-picker-clear {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 0;
        background: #f1f5f9;
        color: #64748b;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .role-picker-clear.show {
        display: flex;
      }

      .role-picker-clear:hover {
        background: #e2e8f0;
        color: #0f172a;
      }

      .role-picker-counter {
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        white-space: nowrap;
      }

      .role-picker-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
      }

      .role-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 12px 5px 12px;
        border: 1px solid #e2e8f0;
        background: #fff;
        color: #0f172a;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all .15s ease;
      }

      .role-chip:hover {
        border-color: var(--color-blue);
        color: var(--color-blue);
      }

      .role-chip.active {
        background: var(--color-blue);
        border-color: var(--color-blue);
        color: #fff;
      }

      .role-chip-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 20px;
        padding: 0 6px;
        height: 18px;
        border-radius: 999px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 10px;
        font-weight: 600;
        line-height: 1;
      }

      .role-chip.active .role-chip-count {
        background: rgba(255, 255, 255, .2);
        color: #fff;
      }

      /* Ghi đè .action-group flex mặc định để dùng grouped layout */
      #zonedashbroad.role-picker-grid {
        display: block !important;
        margin: 0 !important;
        gap: 0;
      }

      /* Ẩn cho tới khi role picker render xong (tránh flash tile cũ) */
      #zonedashbroad:not(.role-picker-ready) {
        visibility: hidden;
      }

      /* Gọn chiều cao để thấy hết các nhóm trong 1 màn hình (sếp: chữ to + không bị che nhóm cuối) */
      .role-group+.role-group {
        margin-top: 14px;
      }

      .role-group-title {
        font-family: Arial, Helvetica, sans-serif !important;
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 8px;
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
      }

      /* Vạch màu theo tone nhóm trước tiêu đề — thay điểm nhấn màu của badge đã ẩn */
      .role-group-title::before {
        content: '';
        width: 4px;
        height: 16px;
        border-radius: 2px;
        background: var(--g, #94a3b8);
        margin-right: 2px;
      }

      .role-group-count {
        font-weight: 600;
        color: #64748b;
        font-size: 14px;
      }

      /* ─── Role grid: auto-fill min 200px → tự co số cột theo màn hình ─── */
      .role-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 10px;
      }

      /* ─── Role card: layout ngang chuyên nghiệp ─── */
      .role-card {
        display: flex !important;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        border: 1px solid #e8edf5;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 1px 4px rgba(15, 23, 42, .06), 0 0 0 0 transparent;
        transition: transform .22s cubic-bezier(.4,0,.2,1),
                    box-shadow .22s ease,
                    border-color .18s ease;
        min-height: 60px;
        width: auto !important;
        height: auto !important;
        cursor: pointer;
      }

      .role-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(34, 55, 113, .13), 0 2px 6px rgba(15, 23, 42, .05);
        border-color: #c7d2fe;
      }

      .role-card-head {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
      }

      .role-card-icon {
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        min-width: 42px;
        border-radius: 11px;
        font-size: 20px;
        flex-shrink: 0;
      }

      .role-card-icon i {
        font-size: 20px;
      }

      /* Vùng text bên phải icon */
      .role-card-right {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .role-card-badge {
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 10.5px;
        font-weight: 600;
        white-space: nowrap;
        display: inline-block;
        width: fit-content;
      }

      .role-card-name {
        font-size: 15px;
        font-weight: 600;
        color: #1e293b;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
      }

      .role-empty {
        padding: 40px 20px;
        text-align: center;
        color: #64748b;
        font-size: 14px;
        font-style: italic;
        border: 1px dashed #e2e8f0;
        border-radius: 12px;
        background: #fff;
      }

      /* ─── Reskin header + sidebar theo tone NewUI (dask-blue #223771 + orange #f8843d) ─── */
      /* Header top nav dùng --color-link (#2563EB) mặc định → đổi sang dask-blue */
      .top-nav {
        background: #223771 !important;
      }

      /* Sidebar: nền dask-blue, chữ light-blue, active/hover accent orange */
      .left-sidebar {
        background: #223771 !important;
        box-shadow: none !important;
      }

      .left-sidebar a:hover {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }

      .left-sidebar a:hover .item-icon {
        color: #ffffff !important;
      }

      .sidebar-menu-header {
        color: #ffffff !important;
        background: transparent !important;
        font-weight: 500 !important;
      }

      .sidebar-menu-header .item-icon,
      .sidebar-menu-item.sidebar-menu-home .sidebar-menu-header i {
        color: #ffffff !important;
      }

      .sidebar-menu-item.sidebar-menu-home .sidebar-menu-header {
        color: #ffffff !important;
      }

      .sidebar-menu-header:not(.collapsed):hover,
      .sidebar-menu-item.sidebar-menu-home .sidebar-menu-header:hover {
        color: #ffffff !important;
        /* background: rgba(255, 255, 255, 0.1) !important; */
        background-color: var(--color-blue);
      }

      .sidebar-menu-header:not(.collapsed):hover i,
      .sidebar-menu-header:not(.collapsed):hover .item-icon {
        color: #ffffff !important;
      }

      .sidebar-menu-item.active .sidebar-menu-header {
        background-color: var(--color-blue);
        color: #fff !important;
        font-weight: 700 !important;
      }

      .sidebar-menu-item.active .sidebar-menu-header .item-icon,
      .sidebar-menu-item.active .sidebar-menu-header i {
        color: #fff !important;
      }

      /* Submenu (cấp con) — bullet + border-left theo tone dask-blue */
      /* Container submenu: ep TRANSPARENT background de blend voi sidebar toi.
         THU PHAM: App_Themes/Cms/Custom_V1/styles.css:2896 co rule
         `.sidebar-menu-item .sidebar-menu-sub.collapse { background:#f4f4f4 !important }`
         voi specificity cao hon. Can beat bang ID selector (#sidebar-menu) + full chain.
         Ngoai ra Windows High Contrast / Chrome dark theme cung co the dao mau -> them
         color-scheme + forced-color-adjust de khoa mau. */
      html body #sidebar-menu,
      html body #sidebar-menu * {
        color-scheme: light only !important;
        forced-color-adjust: none !important;
      }

      html body #sidebar-menu .sidebar-menu-item .sidebar-menu-sub,
      html body #sidebar-menu .sidebar-menu-item .sidebar-menu-sub.collapse,
      html body #sidebar-menu .sidebar-menu-item .sidebar-menu-sub.show,
      html body #sidebar-menu .sidebar-menu-item .sidebar-menu-sub.collapsing,
      #sidebar-menu .sidebar-menu-item .sidebar-menu-sub,
      #sidebar-menu .sidebar-menu-item .sidebar-menu-sub.collapse,
      #sidebar-menu .sidebar-menu-item .sidebar-menu-sub.show,
      .sidebar-menu .sidebar-menu-item .sidebar-menu-sub,
      .sidebar-menu .sidebar-menu-item .sidebar-menu-sub.collapse,
      .sidebar-menu .sidebar-menu-item .sidebar-menu-sub.show,
      html body .sidebar-menu-item .sidebar-menu-sub.collapse {
        background: #1a2b5c !important;
        background-color: #1a2b5c !important;
        background-image: none !important;
        border-radius: 0 0 12px 0 !important;
        padding: 4px 0 8px 0 !important;
        margin-top: 5px !important;
        box-shadow: none !important;
      }

      html body #sidebar-menu .sidebar-menu-sub a,
      html body #sidebar-menu .sidebar-menu-sub a:link,
      html body #sidebar-menu .sidebar-menu-sub a:visited,
      html body #sidebar-menu .sidebar-menu-sub a span,
      .sidebar-menu-sub a {
        color: #ffffff;
        font-weight: 500 !important;
        background: transparent !important;
        background-color: transparent !important;
        border-left-color: #5a7adb !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .sidebar-menu-sub a:hover,
      .sidebar-menu-sub a.active {
        color: #f8843d !important;
        background: transparent !important;
        border-color: transparent;
        outline: none !important;
        box-shadow: none !important;
      }

      .sidebar-menu-sub a::before,
      .sidebar-menu-sub a::after {
        background-color: #5a7adb !important;
      }

      .sidebar-menu-sub a:hover::before,
      .sidebar-menu-sub a:hover::after,
      .sidebar-menu-sub a.active::before,
      .sidebar-menu-sub a.active::after {
        background-color: #f8843d !important;
      }

      /* Nền wrap = dask-blue để lộ được góc bo top-left của main-content
         (nếu không sẽ trùng màu với main-content nên không thấy round) */
      .main-wrap {
        background-color: #223771 !important;
      }

      /* Main content: nền light-gray + bo góc trái trên tiếp giáp sidebar.
         overflow-y auto để scroll dọc được (main-wrap = 100vh, content dài hơn thì scroll).
         overflow-x hidden để nội dung không tràn ra ngoài góc bo top-left 16px. */
      .main-content {
        background: #f0f3fd;
        border-top-left-radius: 16px;
        overflow-x: hidden;
        overflow-y: auto;
      }

      /* Header controls: chữ menu + bell trắng, tránh bị var(--color-*) đè */
      .top-nav .sidebar-bars,
      .top-nav .sidebar-bars span {
        color: #ffffff !important;
      }

      /* ─── [SPA-MODULE-TONE] Đồng bộ tone module SPA-native (load trong index.aspx)
         với reskin dask-blue + orange. Không đụng assets/css-new (file share). ─── */

      /* Card wrapper: border-#f5f5f5 gần như vô hình (css-new/main.css:304) → làm
         cho card trắng tinh trơ trên nền. Bump border rõ hơn + shadow rõ hơn. */
      #main-content-wrapper .card.today-card,
      #main-content-wrapper .today-card {
        border: 1px solid #e2e8f0 !important;
        border-radius: 10px !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06) !important;
        background: #ffffff !important;
      }

      /* Bỏ hiệu ứng "double layer" ::before của .today-card (nhìn dơ trên UI mới) */
      #main-content-wrapper .card.today-card::before,
      #main-content-wrapper .today-card::before {
        display: none !important;
      }

      /* Card body có padding rõ + tách khối với header */
      #main-content-wrapper .card.today-card>.card-body,
      #main-content-wrapper .today-card>.card-body {
        padding: 16px 18px !important;
        background: #ffffff !important;
        border-bottom-right-radius: 12px;
        border-bottom-left-radius: 12px;
      }

      /* Card header: css-new/main.css:329 set background: var(--color-link) = #2563EB xanh
         Bootstrap. Override về dask-blue để khớp header shell + reskin indexi. */
      #main-content-wrapper .card.today-card>.card-header,
      #main-content-wrapper .today-card-1>.card-header,
      #main-content-wrapper .today-card-2>.card-header,
      #main-content-wrapper .today-card-3>.card-header {
        background: #223771;
        border: 0 !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 0 18px !important;
        margin-bottom: -1px;
      }

      /* Card title (không phải tab) → trắng */
      #main-content-wrapper .today-card>.card-header .title .feature-name {
        color: #ffffff !important;
      }

      /* Tab inactive (chưa chọn): text trắng mờ trên nền dask-blue */
      #main-content-wrapper .today-card>.card-header .myTab-header-link,
      #main-content-wrapper .today-card>.card-header .myTab-header-link i {
        color: rgba(255, 255, 255, 0.85);
      }

      #main-content-wrapper .today-card>.card-header .myTab-header-link:hover,
      #main-content-wrapper .today-card>.card-header .myTab-header-link:hover i {
        color: #ffffff;
      }

      /* Tab active: pill trắng bg (giữ design gốc css-new/main.css:1650) + text
         dask-blue + icon cam accent */
      #main-content-wrapper .today-card>.card-header .myTab-header-link.active {
        background: #ffffff !important;
        color: #223771;
        font-weight: 700 !important;
      }

      #main-content-wrapper .today-card>.card-header .myTab-header-link.active i {
        color: #223771;
        font-weight: 700;
      }

      /* Icon frame trong card header (today-card-1 gradient xanh) → tone dask-blue */
      #main-content-wrapper .today-card-1>.card-header .icon,
      #main-content-wrapper .today-card>.card-header .title .icon {
        background: rgba(255, 255, 255, 0.18) !important;
        background-image: none !important;
        color: #ffffff !important;
      }

      /* Section title .color-blue (dùng cho "Danh sách học phần dự kiến..." v.v.) */
      #main-content-wrapper .color-blue,
      #main-content-wrapper .text-blue {
        color: var(--color-blue) !important;
      }

      /* Buttons SPA-native: .btn-view / .btn-link / .btn-save → dask-blue solid */
      #main-content-wrapper .btn.btn-view,
      #main-content-wrapper .btn.btn-link,
      #main-content-wrapper .btn.btn-save,
      #main-content-wrapper #btnSearch.btn.btn-view {
        background: #223771 !important;
        background-image: none !important;
        border: 1px solid #223771 !important;
        color: #ffffff !important;
        font-weight: 500 !important;
      }

      #main-content-wrapper .btn.btn-view:hover,
      #main-content-wrapper .btn.btn-link:hover,
      #main-content-wrapper .btn.btn-save:hover,
      #main-content-wrapper #btnSearch.btn.btn-view:hover {
        background: #1c2e5f !important;
        border-color: #1c2e5f !important;
        color: #ffffff !important;
      }

      /* Outline buttons — giữ semantic màu (success/danger/warning) nhưng đồng bộ
         .btn-outline-primary về dask-blue thay vì bright blue */
      #main-content-wrapper .btn.btn-outline-primary {
        color: #223771 !important;
        border-color: #223771 !important;
        background: transparent !important;
      }

      #main-content-wrapper .btn.btn-outline-primary:hover {
        background: #223771 !important;
        color: #ffffff !important;
        border-color: #223771 !important;
      }

      /* Table header .bg-th trong SPA-native → nền tím nhạt khớp indexi reskin */
      #main-content-wrapper .table>thead>tr>th.bg-th,
      #main-content-wrapper .table .bg-th {
        background: #f0f3fd !important;
        color: #222 !important;
        font-weight: 700 !important;
      }

      /* Breadcrumb SPA (.content-tab .nav-content-left .link) → tone xám khớp */
      #main-content-wrapper .content-tab .nav-content-left .link,
      #main-content-wrapper .content-tab .nav-content-left .link a {
        color: #64748b !important;
      }

      #main-content-wrapper .content-tab .nav-content-left .link i {
        color: #94a3b8 !important;
        margin: 5px 0px;
        font-size: 12px !important;
      }

      /* ═══ Select2 SPA — center dọc chuẩn + look xịn (border-radius + focus ring) ═══ */
      #main-content-wrapper .select2-container .select2-selection--single {
        height: 38px !important;
        min-height: 38px !important;
        border: 1px solid #c1c1c1 !important;
        border-radius: 8px !important;
        background: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 !important;
        transition: border-color .15s ease, box-shadow .15s ease !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
      }

      /* Focus state: viền dask-blue + shadow ring xanh nhạt */
      #main-content-wrapper .select2-container--focus .select2-selection--single,
      #main-content-wrapper .select2-container--open .select2-selection--single {
        border-color: #d1d1d1 !important;
        box-shadow: 0 0 0 3px rgba(34, 55, 113, 0.12) !important;
      }

      /* Hover state: viền đậm hơn 1 chút */
      #main-content-wrapper .select2-container .select2-selection--single:hover {
        border-color: #94a3b8 !important;
      }

      /* Text render — center dọc bằng flex, KHÔNG dùng line-height (gây lệch) */
      #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__rendered {
        line-height: 1 !important;
        padding: 2px 32px 1px 12px !important;
        color: #0f172a !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        height: 100% !important;
        margin: 0 !important;
      }

      /* Placeholder select2 — đậm hơn cho dễ nhìn (user global request) */
      #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__placeholder {
        color: #64748b !important;
        font-weight: 500 !important;
        font-style: normal !important;
        opacity: 1 !important;
      }

      /* Placeholder input/textarea — global đậm hơn */
      #main-content-wrapper input.form-control::placeholder,
      #main-content-wrapper input::placeholder,
      #main-content-wrapper textarea::placeholder,
      #main-content-wrapper textarea.form-control::placeholder {
        color: #64748b !important;
        opacity: 1 !important;
      }

      /* Text đã nhập trong input/select đậm hơn */
      #main-content-wrapper input.form-control,
      #main-content-wrapper select.form-control,
      #main-content-wrapper textarea.form-control {
        color: #0f172a !important;
        font-weight: 500 !important;
      }

      /* Mũi tên: căn giữa dọc, cách viền phải 8px */
      #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__arrow {
        height: 100% !important;
        top: 0px;
        right: 8px !important;
        width: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      #main-content-wrapper .select2-container--default .select2-selection--single .select2-selection__arrow b {
        border-color: #d1d1d1 transparent transparent transparent !important;
        border-width: 5px 5px 0 5px !important;
        position: static !important;
        margin: 0 !important;
      }

      #main-content-wrapper .select2-container--open .select2-selection__arrow b {
        border-color: transparent transparent #d1d1d1 transparent !important;
        border-width: 0 5px 6px 5px !important;
      }

      /* Dropdown khi mở — max spec + shadow to + border đậm để dropdown "nhảy ra"
         hoàn toàn khỏi container. Bố cục shadow 3 lớp cho depth chuẩn. */
      html body .select2-container,
      html body>.select2-container,
      html body .select2-container--default .select2-dropdown {
        z-index: 99999 !important;
      }

      html body .select2-container--default .select2-dropdown {
        border: 2px solid #223771 !important;
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

      .select2-container--default .select2-search--dropdown {
        padding: 6px 8px !important;
      }

      .select2-container--default .select2-search--dropdown .select2-search__field {
        border: 1px solid #cbd5e1 !important;
        border-radius: 6px !important;
        padding: 6px 10px !important;
        font-size: 13px !important;
        outline: none !important;
      }

      .select2-container--default .select2-search--dropdown .select2-search__field:focus {
        border-color: #223771 !important;
        box-shadow: 0 0 0 2px rgba(34, 55, 113, 0.1) !important;
      }

      .select2-container--default .select2-results__options {
        max-height: 250px !important;
      }

      .select2-container--default .select2-results__option {
        padding: 8px 14px !important;
        font-size: 14px !important;
        color: #0f172a !important;
        transition: background .1s ease;
      }

      .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background: #223771 !important;
        color: #ffffff !important;
      }

      .select2-container--default .select2-results__option[aria-selected="true"] {
        background: #f0f3fd !important;
        color: #223771 !important;
        font-weight: 600 !important;
      }

      /* Floating label trong .box-search-hocphan (css-new/main.css:4010): mặc định
         12px + #888 → hơi bé + mờ. Bump lên 13px + color đậm hơn cho dễ đọc. */
      #main-content-wrapper .box-search-hocphan .input-label-left label,
      #main-content-wrapper .filter-4-item .input-label-left label {
        font-size: 14px !important;
        color: #888 !important;
        font-weight: 400 !important;
        padding: 0 8px !important;
        line-height: 38px !important;
        margin-top: 0 !important;
      }

      /* Filter row: button "Xem danh sách" / "Tìm kiếm" phải align cuối dòng với
         input row (tránh nằm lệch trên khi input wrap 2 dòng) */
      #main-content-wrapper .filter-4-item {
        align-items: flex-end !important;
      }

      #main-content-wrapper .filter-4-item .flex-shrink-0 {
        display: flex;
        align-items: flex-end;
        padding-bottom: 10px;
      }

      #main-content-wrapper .filter-4-item .flex-shrink-0 .btn {
        height: 38px !important;
        display: inline-flex !important;
        align-items: center !important;
        margin-top: 0 !important;
      }

      /* ─── [SPA-ALT] Pattern module SPA-native KHÔNG dùng .card.today-card
         (vd phieu.html khảo sát) — dùng .box-shadow.zone-bus / .register-wish /
         .group-title. Add card-like border + section title + button để đồng bộ. ─── */

      /* Wrapper container thay .card.today-card — LOẠI TRỪ .modal (nếu áp vào modal
         wrapper sẽ vỡ layout modal vì modal cần transparent frame ngoài) */
      #main-content-wrapper .box-shadow.zone-bus:not(.modal),
      #main-content-wrapper .register-wish:not(.modal),
      #main-content-wrapper .zone-bus.box-shadow:not(.modal) {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 10px !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06) !important;
        padding: 0 !important;
        margin-bottom: 16px !important;
      }

      /* Modal riêng — dùng cho .modal.register-wish, .modal.modaldangky, v.v...
         Ép proper Bootstrap 5 modal style + backdrop */
      #main-content-wrapper .modal,
      body>.modal {
        /* background: transparent !important; */
        border: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      #main-content-wrapper .modal .modal-content,
      body>.modal .modal-content {
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 10px !important;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2) !important;
      }

      #main-content-wrapper .modal .modal-header,
      body>.modal .modal-header {
        background: #223771 !important;
        color: #ffffff !important;
        border-bottom: 0 !important;
        border-top-left-radius: 10px !important;
        border-top-right-radius: 10px !important;
        padding: 12px 18px !important;
      }

      #main-content-wrapper .modal .modal-header .modal-title,
      #main-content-wrapper .modal .modal-header p,
      #main-content-wrapper .modal .modal-header i,
      body>.modal .modal-header .modal-title,
      body>.modal .modal-header p,
      body>.modal .modal-header i {
        color: #ffffff !important;
        font-weight: 500 !important;
      }

      #main-content-wrapper .modal .modal-header .btn-close,
      body>.modal .modal-header .btn-close {
        filter: invert(1) brightness(2) !important;
        opacity: 0.8 !important;
      }

      #main-content-wrapper .modal .modal-header .btn-close:hover,
      body>.modal .modal-header .btn-close:hover {
        opacity: 1 !important;
      }

      #main-content-wrapper .modal .modal-body,
      body>.modal .modal-body {
        padding: 16px 18px;
        background: #ffffff !important;
      }

      #main-content-wrapper .modal .modal-footer,
      body>.modal .modal-footer {
        padding: 15px 18px !important;
        border-top: 1px solid #e2e8f0 !important;
      }

      /* Form top (filter row đầu module) — spacing */
      #main-content-wrapper .form-top {
        margin-bottom: 15px;
      }

      #main-content-wrapper .form-top .form-item .form-control,
      #main-content-wrapper .form-top .input-group input.form-control {
        height: 38px !important;
        border: 1px solid #d1d1d1 !important;
        border-radius: 8px !important;
        font-size: 14px !important;
      }

      #main-content-wrapper .form-top .form-control:focus {
        border-color: #cbd5e1 !important;
        box-shadow: none !important;
      }

      /* Section title dùng .group-title (thay .color-blue) */
      #main-content-wrapper .group-title,
      #main-content-wrapper .group-title.pl0 {
        margin-bottom: 8px;
      }

      #main-content-wrapper .group-title p,
      #main-content-wrapper .group-title.pl0 p {
        color: var(--color-blue) !important;
        font-weight: 700 !important;
        font-size: 15px !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        margin: 0 !important;
      }

      #main-content-wrapper .group-title p i,
      #main-content-wrapper .group-title.pl0 p i {
        color: var(--color-blue-dark) !important;
        font-size: 15px;
        margin-right: 5px !important;
      }

      /* Button search combo — .btn-search + .btn-default → dask-blue solid */
      #main-content-wrapper .btn.btn-search,
      #main-content-wrapper .btn.btn-search.btn-default,
      #main-content-wrapper div.btn.btn-search,
      #main-content-wrapper div.btn.btn-search.btn-default {
        background: #223771 !important;
        background-image: none !important;
        color: #ffffff !important;
        border: 1px solid #223771 !important;
        border-radius: 6px !important;
        height: 38px !important;
        display: inline-flex !important;
        align-items: center !important;
        padding: 0 14px !important;
        cursor: pointer !important;
        font-weight: 500 !important;
      }

      #main-content-wrapper .btn.btn-search:hover,
      #main-content-wrapper .btn.btn-search.btn-default:hover {
        background: #1c2e5f !important;
        border-color: #1c2e5f !important;
      }

      #main-content-wrapper .btn.btn-search i,
      #main-content-wrapper .btn.btn-search span,
      #main-content-wrapper .btn.btn-search .lang,
      #main-content-wrapper .btn.btn-search * {
        color: #ffffff !important;
      }

      /* Table plain trong SPA-alt module (không có .table-responsive wrapper) */
      #main-content-wrapper .table.tblPhieu,
      #main-content-wrapper .table.transcrip-table {
        /* margin-top: 4px !important; */
        /* border: 1px solid #e2e8f0 !important; */
        /* border-radius: 6px !important; */
      }

      /* Bump toàn bộ table header trong SPA scope — cover cả các bảng không có
         class .bg-th (vd tblPhieu). Nền tím nhạt + chữ đậm + border dày dưới. */
      #main-content-wrapper .table>thead>tr>th,
      #main-content-wrapper table.table>thead>tr>th {
        background: #f0f3fd !important;
        color: #0f172a !important;
        font-weight: 700 !important;
        font-size: 13px !important;
        padding: 10px 12px !important;
        border-bottom: 1px solid #d1d1d1 !important;
        vertical-align: middle !important;
      }

      /* Body row có border + hover nhẹ để tách khối */
      #main-content-wrapper .table>tbody>tr>td {
        padding: 10px !important;
        color: #0f172a;
        vertical-align: middle !important;
      }

      #main-content-wrapper .table-hover>tbody>tr:hover,
      #main-content-wrapper .table-hover>tbody>tr:hover>td {
        background: #f8fafc !important;
        color: #0f172a !important;
      }

      /* Bảng có class .table-noborder — bo góc + shadow nhẹ để thấy khối */
      #main-content-wrapper .table.table-noborder {
        border-collapse: separate !important;
        border-spacing: 0 !important;
        overflow: hidden !important;
        margin-bottom: 10px;
      }

      /* ─── [SPA-ADMINLTE-COMPAT] Cover module cu dung .box, .box-body, .box-header
         nhung load trong SPA shell (vd phancongphamvi.html cua Dang ky hoc).
         Add card-like style tuong tu compat trong indexi.aspx. ─── */
      #main-content-wrapper .box {
        position: relative;
        background: #ffffff !important;
        border: 1px solid #e2e8f0 !important;
        border-top: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        margin-bottom: 14px !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
      }

      #main-content-wrapper .box.box-solid {
        border-top: 1px solid #e2e8f0 !important;
      }

      #main-content-wrapper .box.box-shadow {
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06) !important;
      }

      #main-content-wrapper .box-header {
        padding: 10px 15px 5px 15px;
        /* border-bottom: 1px solid #e2e8f0 !important; */
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: wrap !important;
      }

      #main-content-wrapper .box-body {
        padding: 15px 0 !important;
        overflow: visible !important;
        max-height: none !important;
      }

      #main-content-wrapper .box-footer {
        padding: 12px 16px !important;
        border-top: 1px solid #e2e8f0 !important;
      }

      #main-content-wrapper .box-title {
        font-weight: 700 !important;
        /* font-size: 15px !important; */
        color: var(--color-blue) !important;
        margin: 0 !important;
      }

      #main-content-wrapper .box-title.color-blue {
        color: #223771 !important;
      }

      /* Badge dem so luong khi chua co du lieu -> an han, tranh "cuc xanh" trong
         nam canh tieu de box (vd "Danh sach [ ]"). */
      #main-content-wrapper .box-title .badge:empty {
        display: none !important;
      }

      /* Badge boc 1 span con rong (<span class="badge"><span id="..."></span></span>):
         badge khong match :empty vi con text node xuong dong -> dung :has().
         Tach rule rieng de browser khong ho tro :has() van giu duoc rule :empty o tren. */
      #main-content-wrapper .box-title .badge:has(> span:only-child:empty) {
        display: none !important;
      }

      /* Padding/margin helpers module AdminLTE */
      #main-content-wrapper .pd0 {
        padding: 0 !important;
      }

      #main-content-wrapper .pd10 {
        padding: 10px !important;
      }

      #main-content-wrapper .pd15 {
        padding: 15px !important;
      }

      #main-content-wrapper .pd20 {
        padding: 20px;
      }

      #main-content-wrapper .pt10 {
        padding-top: 10px !important;
      }

      #main-content-wrapper .pt15 {
        padding-top: 15px !important;
      }

      #main-content-wrapper .pt20 {
        padding-top: 20px !important;
      }

      #main-content-wrapper .pb10 {
        padding-bottom: 10px !important;
      }

      #main-content-wrapper .pb15 {
        padding-bottom: 15px !important;
      }

      #main-content-wrapper .pl0 {
        padding-left: 0 !important;
      }

      #main-content-wrapper .pl15 {
        padding-left: 15px !important;
      }

      #main-content-wrapper .pl20 {
        padding-left: 20px !important;
      }

      #main-content-wrapper .pr10 {
        padding-right: 10px !important;
      }

      #main-content-wrapper .pr20 {
        padding-right: 20px !important;
      }

      #main-content-wrapper .mt-10 {
        margin-top: 10px !important;
      }

      #main-content-wrapper .mt-20 {
        margin-top: 20px !important;
      }

      #main-content-wrapper .ml-10 {
        margin-left: 10px !important;
      }

      #main-content-wrapper .ml-20 {
        margin-left: 20px !important;
      }

      #main-content-wrapper .mb-10 {
        margin-bottom: 10px !important;
      }

      #main-content-wrapper .mb-20 {
        margin-bottom: 20px !important;
      }

      #main-content-wrapper .item-search {
        padding: 6px 10px;
      }

      #main-content-wrapper .table-noborder {
        border: 0 !important;
      }

      #main-content-wrapper .pull-right {
        float: right !important;
      }

      #main-content-wrapper .pull-left {
        float: left !important;
      }

      /* Multi-table float layout (vd phancongphamvi.html: 6 table float:left width:300px)
         → khi row counts khác nhau, table thấp/cao lệch. Align top + gap giữa các table. */
      #main-content-wrapper .scroll-table-x {
        display: flex !important;
        flex-wrap: wrap !important;
        /* gap: 12px !important; */
        align-items: flex-start !important;
        overflow-x: auto;
      }

      #main-content-wrapper .scroll-table-x>table {
        float: none !important;
        margin: 0 !important;
        vertical-align: top !important;
      }

      #main-content-wrapper .scroll-table-x>table td,
      #main-content-wrapper .scroll-table-x>table th {
        vertical-align: middle !important;
      }

      /* Button trong table cell (vd "Chi tiết", "Xem" của module Khảo sát render
         qua kehoach.js:1009 dùng .btn.btn-default) — .btn-default trong SPA shell
         không có bg/color → hover row làm chữ trắng invisible. Ép dask-blue solid +
         chữ trắng, kích thước nhỏ gọn khớp cell. */
      #main-content-wrapper .table td .btn.btn-default,
      #main-content-wrapper .table td a.btn.btn-default,
      #main-content-wrapper .table td span>a.btn.btn-default,
      #main-content-wrapper .table-hover>tbody>tr:hover>td .btn.btn-default,
      #main-content-wrapper .table-hover>tbody>tr:hover>td a.btn.btn-default {
        background: rgba(13, 110, 253, 0.1) !important;
        background-image: none !important;
        color: var(--color-blue) !important;
        border: 1px solid rgba(13, 110, 253, 0.3) !important;
        border-radius: 4px !important;
        padding: 6px 10px !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        display: inline-block !important;
        min-width: auto !important;
        cursor: pointer !important;
        text-decoration: none !important;
        line-height: 18px !important;
      }

      #main-content-wrapper .table td .btn.btn-default:hover,
      #main-content-wrapper .table td a.btn.btn-default:hover {
        background: var(--color-blue) !important;
        border-color: var(--color-blue) !important;
        color: #ffffff !important;
      }

      /* Đảm bảo text/icon bên trong button trong cell luôn trắng — không bị inherit
         từ row hover color rule */
      #main-content-wrapper .table td .btn.btn-default *,
      #main-content-wrapper .table-hover>tbody>tr:hover>td .btn.btn-default * {
        color: var(--color-blue) !important;
        font-weight: 700;
      }

      /* ═══ [DISABLED 2026-08-12] FIX MODAL BLEED-THROUGH — khi modal mo, an TOAN BO
         #main-content-wrapper de khong container nao xuyen qua backdrop. ═══
         User feedback: an het main-content khien khong biet modal thong bao xuat hien
         tu form nao -> comment lai, giu backdrop opacity thap de van thay form phia sau. */
      /*
      body.modal-open #main-content-wrapper,
      body:has(.modal.show) #main-content-wrapper,
      body:has(.modal.in) #main-content-wrapper {
        visibility: hidden !important;
      }
      */
      /* Modal (o bat ky dau — body level via #alert hoac inline trong module) va backdrop
         luon hien khi mo. Child visibility:visible override parent's visibility:hidden. */
      body.modal-open .modal.show,
      body.modal-open .modal.in,
      body.modal-open .modal-backdrop,
      body:has(.modal.show) .modal.show,
      body:has(.modal.in) .modal.in,
      body:has(.modal.show) .modal-backdrop,
      body:has(.modal.in) .modal-backdrop {
        visibility: visible !important;
      }

      /* Select2 dropdown khi open (append vao body) — z-index cao hon modal (BS default 1055) */
      .select2-container--open {
        z-index: 20000 !important;
      }

      /* Modal & backdrop z-index cao de dam bao che het */
      .modal.show,
      .modal.in {
        z-index: 10055 !important;
      }

      .modal-backdrop.show,
      .modal-backdrop.in {
        z-index: 10050 !important;
        opacity: 0.5 !important;
        background-color: #0f172a !important;
      }

      /* ═══ [FIX 2026-08-12] Khi modal open, select2-container base (line 680) o
         z-index 99999 cao hon backdrop (10050) -> user van chon duoc dropdown xuyen
         qua modal. Reset ve auto khi modal open de backdrop chan pointer events. ═══ */
      body.modal-open .select2-container,
      body.modal-open>.select2-container,
      body:has(.modal.show) .select2-container,
      body:has(.modal.show)>.select2-container,
      body:has(.modal.in) .select2-container,
      body:has(.modal.in)>.select2-container,
      body:has(.cke_dialog_container) .select2-container,
      body:has(.cke_dialog_container)>.select2-container,
      body:has(.cke_dialog_background_cover) .select2-container,
      body:has(.cke_dialog_background_cover)>.select2-container {
        z-index: auto !important;
      }
    </style>
  </head>

  <body>
    <div id="overlay"
      style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:2051; display:none; background:#fff; padding:30px 55px; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.15); text-align:center; min-width:220px;">
      <i class="fas fa-spinner fa-spin fa-3x text-primary" style="color:#223771;"></i>
      <h5 style="margin:18px 0 0; color:#223771; font-weight:600; font-size:15px;">Đang tải dữ liệu...</h5>
    </div>
    <div class="header fixed-top">
      <div class="top-nav">
        <div class="sidebar-bars" style="display:flex;align-items:center;gap:8px;cursor:pointer">
          <i class="fa-light fa-bars-sort"></i>
          <span style="color:#fff;font-weight:600;font-size:14px">Menu</span>
        </div>
        <div class="head-logo refeshlogo">
          <a href="#">
            <img class="logo-icon" src="logo.png" title="QTDH" />
          </a>
        </div>
        <div class="head-search-form">
          <div class="head-search-toggle">
            <i class="fal fa-search"></i>
          </div>
          <div class="head-search-box">
            <div class="form">
              <input type="text" id="global-search-input" class="search-imput" placeholder="Tìm kiếm thông tin"
                autocomplete="off" />
              <button class="search-btn">
                <i class="fal fa-search"></i>
              </button>
            </div>
            <ul id="global-search-suggestions" class="search-suggestions"></ul>
          </div>
        </div>
        <div class="main-menu">
          <ul class="list-unstyled">
            <%--<li class="item active">
              <a class="menu-link" href="index.html">
                <i class="fal fa-home"></i>
                <span>Trang chủ</span>
              </a>
              </li>
              <li class="item">
                <a class="menu-link" href="dashboard.html">
                  <span>Dashboard</span>
                </a>
              </li>
              <li class="item">
                <a class="menu-link" href="modul.html">
                  <span>Modul</span>
                </a>
              </li>
              <li class="item">
                <a class="menu-link" href="chucnang-cuaban.html">
                  <span>Chức năng của bạn</span>
                </a>
              </li>
              <li class="item">
                <a class="menu-link" href="tintuc.html">
                  <span>Tin tức</span>
                </a>
              </li>--%>
          </ul>
          <div class="menu-toggle">
            <i class="fal fa-bars"></i>
          </div>
        </div>
        <div class="account-group">
          <%--<div class="dropdown">
            <div class="item" data-bs-toggle="dropdown">
              <i class="fal fa-circle-check"></i>
              <span>3</span>
            </div>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
        </div>
        <div class="dropdown">
          <div class="item message" data-bs-toggle="dropdown">
            <i class="fal fa-messages"></i>
            <span>3</span>
          </div>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </div>
        --%>

        <div class="dropdown box-notify">
          <div class="item noti" id="fcm-noti-button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fal fa-bell"></i>
            <span id="fcm-noti-badge" class="badge rounded-pill bg-danger" style="display:none">0</span>
          </div>
          <ul class="dropdown-menu dropdown-menu-end p-0" id="fcm-noti-menu">
            <li class="dropdown-header py-2 px-3">Thông báo</li>
            <li>
              <hr class="dropdown-divider my-0">
            </li>
            <li><a class="dropdown-item py-3 text-center" href="javascript:void(0)" id="fcm-noti-empty">Chưa có thông
                báo</a></li>
          </ul>
        </div>
        <div class="dropdown box-acc-user">
          <div class="item" data-bs-toggle="dropdown">
            <img src="assets/images/avata-user.png" class="avatar" />
            <span class="hidden-xs">
              <%=fullname %>
            </span>
            <span class="hidden-xs">
              <%=fullname %>
            </span>
          </div>
          <ul class="dropdown-menu user-action">
            <li>
              <a class="dropdown-item" href="#">
                <i class="fa-light fa-user"></i>
                <span>Thông tin cá nhân</span>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <i class="fa-light fa-gear text-green"></i>
                <span>Cài đặt</span>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <i class="fa-light fa-browser text-red"></i>
                <span>Theme Option</span>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="Logout.aspx">
                <i class="fa-light fa-right-from-bracket"></i>
                <span>Đăng xuất</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>

    <div class="main-wrap">
      <div class="left-sidebar">
        <div class="sidebar-menu">
          <div class="accordion" id="sidebar-menu">
            <div class="sidebar-menu-item active">
              <a class="sidebar-menu-header" href="">
                <i class="fa-light fa-house-window item-icon"></i>
                <span>Dashboads</span>
              </a>
            </div>
            <!-- siderbar menu  item -->

            <!-- end siderbar menu  item -->
          </div>
        </div>
      </div>
      <div class="main-content" id="main-content-wrapper">
        <div class="dashboard-content">
          <div class="quick-action">
            <div class="welcome"><span id="welcome-greeting">Chào mừng</span>, <strong id="welcome-name">
                <%=fullname %>
              </strong>!</div>
            <div class="quick-acction-title">Danh sách vai trò</div>
            <div class="role-picker-toolbar">
              <div class="role-picker-search">
                <i class="fal fa-search"></i>
                <input type="text" id="role-search-input" placeholder="Tìm vai trò theo tên hoặc mã..."
                  autocomplete="off" />
                <button type="button" class="role-picker-clear" id="role-search-clear" aria-label="Xoá tìm kiếm">
                  <i class="fal fa-times"></i>
                </button>
              </div>
              <div class="role-picker-counter" id="role-picker-counter">0 / 0 vai trò</div>
            </div>
            <div class="role-picker-chips" id="role-picker-chips"></div>
            <div class="action-group role-picker-grid" id="zonedashbroad">
            </div>
          </div>
          <div class="for-u-today" style="display: none">
            <div class="title-main">Thông tin chung</div>
            <div class="today-group">
              <div class="item">
                <div class="card today-card today-card-1">
                  <div class="card-header">
                    <div class="title">
                      <div class="icon">
                        <i class="fa-solid fa-newspaper"></i>
                      </div>
                      <div class="feature-name text-uppercase">
                        Bản tin nội bộ trường
                      </div>
                    </div>
                    <div class="dropdown">
                      <div class="dropdow-label" data-bs-toggle="dropdown">
                        <i class="fal fa-ellipsis"></i>
                      </div>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li>
                          <a class="dropdown-item" href="#">Another action</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">Something else here</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="dashboard-tinnoibo">
                      <div class="item">
                        <a href="#" class="label label-sukien">Sự kiện</a>
                        <a href="#" class="title">
                          Ngày hội việc làm 2025 sẽ tổ chức tại sàn A-15/06
                        </a>
                      </div>
                      <div class="item">
                        <a href="#" class="label label-thongbao">Thông báo</a>
                        <a href="#" class="title">
                          Thay đổi thời khóa biểu học kỳ hè ( Khóa CNTT)
                        </a>
                      </div>
                      <div class="item">
                        <a href="#" class="label label-tingiangvien">Tin giảng viên</a>
                        <a href="#" class="title">
                          PGS,TS nguyễn Văn B nhận giải thưởng KHCN cấp bộ
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="line-1 bg-f1"></div>
                    <a href="#" class="view-all">Xem tất cả</a>
                  </div>
                </div>
              </div>
              <div class="item">
                <div class="card today-card today-card-2">
                  <div class="card-header">
                    <div class="title">
                      <div class="icon">
                        <i class="fas fa-users-gear"></i>
                      </div>
                      <div class="feature-name">NHÂN SỰ QUẢN LÝ</div>
                    </div>
                    <div class="dropdown">
                      <div class="dropdow-label" data-bs-toggle="dropdown">
                        <i class="fal fa-ellipsis"></i>
                      </div>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li>
                          <a class="dropdown-item" href="#">Another action</a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">Something else here</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="dashboard-nhansuquanly">
                      <div class="item">
                        <div class="left">
                          <div class="avatar">
                            <img src="assets/images/avatar.jpg" />
                          </div>
                          <div class="meta">
                            <a href="#" class="name" title="Nguyễn Thị Bích">Nguyễn Thị Bích</a>
                            <a href="#" class="link" title="b,nguyen@uviv.edu"><i class="fa-light fa-envelope-open"></i>
                              <span>b.nguyen@univ.edu</span>
                            </a>
                            <a href="tel:0123456789" class="link" title="0123456789"><i class="fa-light fa-phone"></i>
                              <span>0123456789</span>
                            </a>
                          </div>
                        </div>
                        <div class="right">
                          <div>
                            <div class="link" title="Khoa CNTT">
                              <i class="fa-light fa-chalkboard-user"></i>
                              <span>Khoa CNTT</span>
                            </div>
                            <div class="link" title="Ten VT">
                              <i class="fa-light fa-screen-users"></i>
                              <span>Tên VT</span>
                            </div>
                            <a href="#" class="link" title="Giao việc">
                              <i class="fa-light fa-briefcase"></i>
                              <span>Giao việc</span>
                            </a>
                          </div>
                          <button class="btn-detail">
                            <i class="fa-light fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                      <div class="item">
                        <div class="left">
                          <div class="avatar">
                            <img src="assets/images/avatar.jpg" />
                          </div>
                          <div class="meta">
                            <a href="#" class="name" title="Nguyễn Thị Bích">Nguyễn Thị Bích</a>
                            <a href="#" class="link" title="b,nguyen@uviv.edu"><i class="fa-light fa-envelope-open"></i>
                              <span>b.nguyen@univ.edu</span>
                            </a>
                            <a href="tel:0123456789" class="link" title="0123456789"><i class="fa-light fa-phone"></i>
                              <span>0123456789</span>
                            </a>
                          </div>
                        </div>
                        <div class="right">
                          <div>
                            <div class="link" title="Khoa CNTT">
                              <i class="fa-light fa-chalkboard-user"></i>
                              <span>Khoa CNTT</span>
                            </div>
                            <div class="link" title="Ten VT">
                              <i class="fa-light fa-screen-users"></i>
                              <span>Tên VT</span>
                            </div>
                            <a href="#" class="link" title="Giao việc">
                              <i class="fa-light fa-briefcase"></i>
                              <span>Giao việc</span>
                            </a>
                          </div>
                          <button class="btn-detail">
                            <i class="fa-light fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                      <div class="item">
                        <div class="left">
                          <div class="avatar">
                            <img src="assets/images/avatar.jpg" />
                          </div>
                          <div class="meta">
                            <a href="#" class="name" title="Nguyễn Thị Bích">Nguyễn Thị Bích</a>
                            <a href="#" class="link" title="b,nguyen@uviv.edu"><i class="fa-light fa-envelope-open"></i>
                              <span>b.nguyen@univ.edu</span>
                            </a>
                            <a href="tel:0123456789" class="link" title="0123456789"><i class="fa-light fa-phone"></i>
                              <span>0123456789</span>
                            </a>
                          </div>
                        </div>
                        <div class="right">
                          <div>
                            <div class="link" title="Khoa CNTT">
                              <i class="fa-light fa-chalkboard-user"></i>
                              <span>Khoa CNTT</span>
                            </div>
                            <div class="link" title="Ten VT">
                              <i class="fa-light fa-screen-users"></i>
                              <span>Tên VT</span>
                            </div>
                            <a href="#" class="link" title="Giao việc">
                              <i class="fa-light fa-briefcase"></i>
                              <span>Giao việc</span>
                            </a>
                          </div>
                          <button class="btn-detail">
                            <i class="fa-light fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer">
                    <div class="line-1 bg-f1"></div>
                    <a href="#" class="view-all">Xem tất cả</a>
                  </div>
                </div>
              </div>
              <!--  -->
            </div>
          </div>
        </div>
      </div>

      <script type="text/javascript">AXYZCLRVN = () => "<%= lblXYZCLRVN %>"</script>

      <div id="alert"></div>
    </div>
  </body>


  <script src="assets/js/bootstrap.bundle.min.js "></script>
  <script src="assets/js/jquery-2.2.0.min.js" type="text/javascript"></script>
  <script src="assets/js/jquery-ui.min.js" type="text/javascript"></script>
  <script src="assets/js/select2.min.js"></script>
  <script type="text/javascript">
      // [SELECT2-DROPDOWN-PARENT] Force mọi Select2 append dropdown vào <body>,
      // tránh bị clip bởi container cha có overflow hoặc positioning issues.
      // Set default NGAY khi library load, trước khi module JS gọi .select2().
      (function () {
        if (typeof $ !== 'undefined' && $.fn && $.fn.select2 && $.fn.select2.defaults) {
          try { $.fn.select2.defaults.set('dropdownParent', $(document.body)); } catch (e) { }
        }
      })();
  </script>
  <script src="assets/js/swiper-bundle.min.js"></script>
  <script src="assets/js/slick.js"></script>
  <script src="assets/js/tab.js"></script>
  <script src="assets/js/crypto-js.js?v=32"></script>
  <script src="assets/pagination/jquery.simplePagination.min.js?v=<%= Guid.NewGuid().ToString() %>"></script>
  <script src="assets/js/masonry.pkgd.min.js"></script>
  <script src="assets/js/custom.js"></script>
  <!-- <script src="assets/js/customs.js"></script> -->
  <script src="assets/js/cleave.min.js"></script>

  <!-- Firebase Web Push (FCM) -->
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"></script>
  <script
    type="text/javascript">window.FCM_VAPID_KEY = "BAaMGqYzL8EbC8cBXgEPwzgTwtF-4fTJ2x7XyusAxZuEyrCGKpIuij6VanSwjLQWRetpgpM32y98zlUZo-ZVuEE";</script>
  <script src="assets/js/fcm-notify.js?v=<%= Guid.NewGuid().ToString() %>"></script>
  <script type="text/javascript" src="App_Themes/Plugins/jstree/dist/jstree.min.js"></script><!--Plugin jstree-->

  <script type="text/javascript" src="Core/constant.js?v=<%= Guid.NewGuid().ToString() %>"></script> <!--CORE JS-->
  <script type="text/javascript" src="Core/systemroot.js?v=<%= Guid.NewGuid().ToString() %>"></script> <!--CORE JS-->
  <script type="text/javascript" src="Core/util.js?v=<%= Guid.NewGuid().ToString() %>"></script> <!--CORE JS-->
  <script type="text/javascript" src="Core/systemextend.js?v=<%= Guid.NewGuid().ToString() %>"></script><!--CORE JS-->
  <script type="text/javascript" src="Config.js?v=<%= Guid.NewGuid().ToString() %>"></script>
  <script src="<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload")%>/Core/uploadfile.js?v=1.0.0.12"></script><!--CORE JS-->
  <script src="<%= Apis.CommonV1.Base.AppSetting.GetString("RootPathUpload")%>/Core/uploadavatar.js?v=1.0.0.12"></script><!--CORE JS-->
  <%--<script async type="text/javascript" src="https://api-apis.com/socket.io/socket.io.js"></script><!--CORE JS-->--%>
    <%--<script src="Scripts/MathJax/es5/tex-mml-chtml.js"></script>--%>

      <script type="text/javascript">

        var edu = window.edu || {};
        window.edu = edu;
        edu['system'] = new systemroot();
        edu['extend'] = new systemextend();
        edu['constant'] = new constant();
        edu['util'] = new util();
        $(document).ready(function () {
          edu.system.startApp();
          edu.extend.init();
          edu.constant.init();

          try {

            if (edu.fcm && typeof edu.fcm.init === 'function') {
              edu.fcm.init();
            }
          } catch (e) {
          }

          initHashDeepLink();
          initGlobalSearch();
          initRolePicker();
          initTimeGreeting();
        });

        // Chào theo giờ VN (UTC+7): sáng / trưa / chiều / tối / khuya
        function initTimeGreeting() {
          var $g = $('#welcome-greeting');
          if (!$g.length) return;
          var h = (new Date().getUTCHours() + 7) % 24;
          var text;
          if (h >= 5 && h < 11) text = 'Chào buổi sáng';
          else if (h >= 11 && h < 13) text = 'Chào buổi trưa';
          else if (h >= 13 && h < 18) text = 'Chào buổi chiều';
          else if (h >= 18 && h < 22) text = 'Chào buổi tối';
          else text = 'Chào buổi khuya';
          $g.text(text);
        }

        // Hash deep-link: mở URL dạng index.aspx#<duongdanhienthi> đúng màn hình khi đã đăng nhập.
        // 2 giai đoạn: (1) nếu đang ở trang chọn vai trò, tra hash -> ứng dụng (role) -> auto
        // setUngDung; (2) sau khi dtChucNang load xong, override strChucNang_Id để mở đúng màn.
        // Không đụng Core/systemroot.js.
        function initHashDeepLink() {
          var sys = edu.system;
          if (!sys) return;

          function normalizeHash() {
            var raw = (window.location.hash || '').replace(/^#/, '');
            try { raw = decodeURIComponent(raw); } catch (e) { }
            return raw;
          }
          function matchByHash(list, key) {
            if (!key || !list || !list.length) return null;
            return list.find(function (e) {
              if (!e) return false;
              var d = (e.DUONGDANHIENTHI || '').replace(/^#/, '');
              return d === key;
            }) || null;
          }

          // (2) Patch menu render: hash thắng sessionStorage khi chọn màn mặc định.
          if (!sys.__hashDeepLinkPatched) {
            sys.__hashDeepLinkPatched = true;
            var _origGenMenu = sys.genHTML_MenuVertical;
            if (typeof _origGenMenu === 'function') {
              sys.genHTML_MenuVertical = function (data) {
                var key = normalizeHash();
                var obj = matchByHash(data, key);
                if (obj) {
                  sys.strChucNang_Id = obj.ID;
                  try { sessionStorage.setItem('strChucNang_Id', obj.ID); } catch (e) { }
                }
                return _origGenMenu.call(this, data);
              };
            }
          }

          // (1) Nếu đang ở role picker: tra hash -> ứng dụng -> setUngDung.
          var hashKey = normalizeHash();
          if (hashKey && !sys.appId) {
            edu.system.makeRequest({
              type: 'GET',
              action: 'CMS_ChucNang/LayDanhSach',
              contentType: true,
              data: {
                action: 'CMS_ChucNang/LayDanhSach',
                versionAPI: 'v1.0',
                strTuKhoa: '', strChung_UngDung_Id: '', strCHUCNANGCHA_Id: '',
                pageIndex: 1, pageSize: 5000,
                strNGUONTRUYCAP_Id: '', dTrangThai: 1
              },
              success: function (data) {
                if (!(data && data.Success && data.Data)) return;
                var obj = matchByHash(data.Data, hashKey);
                if (!obj) return;
                var appId = obj.CHUNG_UNGDUNG_ID || obj.UNGDUNG_ID;
                if (!appId) return;

                var tries = 0;
                var timer = setInterval(function () {
                  tries++;
                  var apps = sys.dtUngDung || [];
                  if (apps.length) {
                    var app = apps.find(function (a) { return a.ID === appId; });
                    if (app && !sys.appId) {
                      clearInterval(timer);
                      try { sessionStorage.setItem('strChucNang_Id', obj.ID); } catch (e) { }
                      sys.strChucNang_Id = obj.ID;
                      sys.setUngDung(app);
                    } else if (!app || sys.appId) {
                      clearInterval(timer);
                    }
                  }
                  if (tries > 100) clearInterval(timer);
                }, 150);
              },
              error: function () { },
              fakedb: []
            }, false, false, false, null);
          }

          // Nút/link dạng a[href="#"] trong các module (vd "Xem thông tin" ở Đăng ký công nhận
          // điểm) khi click sẽ đổi URL hash về rỗng -> listener hashchange bên dưới hiểu nhầm là
          // "back về state không hash" -> reset dashboard / location.reload() -> văng về trang chủ
          // (đang thủ vai thì mất luôn vai). Chặn default ở capture phase để hash không đổi;
          // handler click của module vẫn chạy bình thường.
          document.addEventListener('click', function (e) {
            var t = e.target;
            var a = t && t.closest ? t.closest('a') : null;
            if (!a) return;
            var href = a.getAttribute('href');
            if (href === '#' || href === '') e.preventDefault();
          }, true);

          // (3) Đổi hash khi đã trong app -> mở màn tương ứng.
          window.addEventListener('hashchange', function () {
            var key = normalizeHash();
            if (!key) {
              // Back về state không hash (vd browser back từ deep-link) -> reset về dashboard
              // của app đang chọn. Clear strChucNang_Id để triggerChucNang_Id fallback #dashboard.
              if (sys.strChucNang_Id) {
                try { sessionStorage.removeItem('strChucNang_Id'); } catch (e) { }
                sys.strChucNang_Id = '';
                var dash = (sys.dtChucNang || []).find(function (e) {
                  return e && e.DUONGDANHIENTHI === '#dashboard';
                });
                if (dash) {
                  try {
                    sys.initMain(dash.DUONGDANHIENTHI, dash.DUONGDANFILE, dash.ID);
                  } catch (e) { location.reload(); }
                } else {
                  location.reload();
                }
              }
              return;
            }
            var obj = matchByHash(sys.dtChucNang, key);
            if (!obj) return;
            if (sys.strChucNang_Id === obj.ID) return;
            try {
              sys.initMain(obj.DUONGDANHIENTHI, obj.DUONGDANFILE, obj.ID);
            } catch (e) { console.error('[deep-link] initMain error:', e); }
          });
        }

        function initGlobalSearch() {
          var $input = $('#global-search-input');
          var $box = $('#global-search-suggestions');
          if (!$input.length) return;

          var _allScreens = [];
          var _allScreensRaw = [];
          var _allApps = [];
          var _loading = false;

          function removeDiacritics(s) {
            return (s || '').toString().toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'd');
          }

          function loadAllApps() {
            if (_allApps.length) return;
            edu.system.makeRequest({
              type: 'GET',
              action: 'CMS_UngDung/LayDanhSach',
              contentType: true,
              data: { strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1 },
              success: function (data) {
                if (data && data.Success && data.Data) {
                  _allApps = data.Data;
                  console.log('[global-search] loaded', _allApps.length, 'apps. Sample:', _allApps[0]);
                }
              },
              error: function () { },
              fakedb: []
            }, false, false, false, null);
          }

          function loadAllScreens(cb) {
            if (_loading) return;
            if (_allScreens.length) { cb && cb(); return; }
            _loading = true;
            edu.system.makeRequest({
              type: 'GET',
              action: 'CMS_ChucNang/LayDanhSach',
              contentType: true,
              data: {
                action: 'CMS_ChucNang/LayDanhSach',
                versionAPI: 'v1.0',
                strTuKhoa: '',
                strChung_UngDung_Id: '',
                strCHUCNANGCHA_Id: '',
                pageIndex: 1,
                pageSize: 5000,
                strNGUONTRUYCAP_Id: '',
                dTrangThai: 1
              },
              success: function (data) {
                _loading = false;
                if (data && data.Success && data.Data) {
                  _allScreensRaw = data.Data;
                  _allScreens = data.Data.filter(function (e) { return e && e.DUONGDANFILE; });
                  console.log('[global-search] loaded', _allScreens.length, 'screens. Sample:', _allScreens[0]);
                  cb && cb();
                }
              },
              error: function () { _loading = false; },
              fakedb: []
            }, false, false, false, null);
          }

          function resolveAppCode(obj) {
            if (obj.MAUNGDUNG) return obj.MAUNGDUNG;
            if (obj.MA_UNGDUNG) return obj.MA_UNGDUNG;
            var appId = obj.CHUNG_UNGDUNG_ID || obj.UNGDUNG_ID;
            if (appId && _allApps.length) {
              var app = _allApps.find(function (a) { return a.ID === appId; });
              if (app) return app.MAUNGDUNG || app.MA_UNGDUNG || app.MA || app.TENUNGDUNG;
            }
            var sysMatch = ((edu.system.dtChucNang) || []).find(function (e) { return e.ID === obj.ID; });
            if (sysMatch && sysMatch.MAUNGDUNG) return sysMatch.MAUNGDUNG;
            return null;
          }

          function getRaw() {
            if (_allScreens.length) return _allScreens;
            return ((edu && edu.system && edu.system.dtChucNang) || [])
              .filter(function (e) { return e && e.DUONGDANFILE; });
          }
          function getList() { return getRaw(); }

          function render(items, keyword) {
            if (!getRaw().length) {
              $box.html('<li class="empty">Đang tải danh sách màn hình, vui lòng thử lại sau giây lát...</li>').addClass('show');
              return;
            }
            if (!items.length) {
              $box.html('<li class="empty">Không tìm thấy màn hình phù hợp với "' + (keyword || '') + '"</li>').addClass('show');
              return;
            }
            var all = getList();
            var html = items.map(function (it) {
              var parent = all.find(function (x) { return x.ID === it.CHUCNANGCHA_ID; });
              var icon = it.TENANH && it.TENANH.indexOf('fa') === 0 ? it.TENANH : 'fal fa-file';
              return '<li data-id="' + it.ID + '" data-href="' + (it.DUONGDANHIENTHI || '#') + '" data-file="' + (it.DUONGDANFILE || '') + '">' +
                '<i class="' + icon + '"></i>' +
                '<span>' + highlight(it.TENCHUCNANG, keyword) + '</span>' +
                (parent ? '<span class="parent">' + parent.TENCHUCNANG + '</span>' : '') +
                '</li>';
            }).join('');
            $box.html(html).addClass('show');
          }

          function highlight(text, kw) {
            if (!kw) return text;
            var t = text || '';
            var normT = removeDiacritics(t);
            var normKw = removeDiacritics(kw);
            var idx = normT.indexOf(normKw);
            if (idx < 0) return t;
            return t.substring(0, idx) + '<mark>' + t.substring(idx, idx + kw.length) + '</mark>' + t.substring(idx + kw.length);
          }

          function search(kw) {
            var list = getList();
            var nKw = removeDiacritics(kw);
            if (!nKw) { $box.removeClass('show').empty(); return; }
            if (!list.length) {
              render([], kw);
              loadAllScreens(function () {
                if ($input.val().trim() === kw) search(kw);
              });
              return;
            }
            var matches = list.filter(function (e) {
              return removeDiacritics(e.TENCHUCNANG).indexOf(nKw) >= 0
                || removeDiacritics(e.MACHUCNANG).indexOf(nKw) >= 0;
            }).slice(0, 15);
            render(matches, kw);
          }

          loadAllScreens();
          loadAllApps();

          $input.on('input', function () { search($(this).val().trim()); });
          $input.on('focus', function () {
            loadAllScreens();
            var v = $(this).val().trim();
            if (v) search(v);
          });

          $input.on('keydown', function (ev) {
            var $items = $box.find('li[data-id]');
            if (!$items.length) return;
            var idx = $items.index($items.filter('.active'));
            if (ev.key === 'ArrowDown') {
              ev.preventDefault();
              idx = (idx + 1) % $items.length;
              $items.removeClass('active').eq(idx).addClass('active')[0].scrollIntoView({ block: 'nearest' });
            } else if (ev.key === 'ArrowUp') {
              ev.preventDefault();
              idx = idx <= 0 ? $items.length - 1 : idx - 1;
              $items.removeClass('active').eq(idx).addClass('active')[0].scrollIntoView({ block: 'nearest' });
            } else if (ev.key === 'Enter') {
              ev.preventDefault();
              var $chosen = idx >= 0 ? $items.eq(idx) : $items.first();
              $chosen.trigger('click');
            } else if (ev.key === 'Escape') {
              $box.removeClass('show');
            }
          });

          $box.on('click', 'li[data-id]', function () {
            var id = $(this).data('id');
            $box.removeClass('show');
            $input.val('');
            var obj = _allScreens.find(function (e) { return e.ID === id; });
            if (!obj) return;
            console.log('[global-search] click obj:', obj);
            try {
              var sys = edu.system;
              var appCode = resolveAppCode(obj);
              if (!appCode) {
                console.warn('[global-search] cannot resolve appCode for obj', obj, 'apps:', _allApps);
                edu.system.alert && edu.system.alert('Không xác định được ứng dụng cho chức năng này.', 'w');
                return;
              }
              var objFull = Object.assign({}, obj, { MAUNGDUNG: appCode });
              sys.dtChucNang = sys.dtChucNang || [];

              function upsert(item) {
                if (!item) return;
                var i = sys.dtChucNang.findIndex(function (e) { return e.ID === item.ID; });
                if (i < 0) sys.dtChucNang.push(item); else sys.dtChucNang[i] = item;
              }

              var parent = obj.CHUCNANGCHA_ID
                ? _allScreensRaw.find(function (e) { return e.ID === obj.CHUCNANGCHA_ID; })
                : null;
              var grandparent = parent && parent.CHUCNANGCHA_ID
                ? _allScreensRaw.find(function (e) { return e.ID === parent.CHUCNANGCHA_ID; })
                : null;
              upsert(grandparent);
              upsert(parent);
              upsert(objFull);

              sys.strChucNang_Id = obj.ID;
              sys.appCode = appCode;
              if (obj.TENFILEDINHKEM) sys.rootPathReport = obj.TENFILEDINHKEM;
              sessionStorage.setItem('strChucNang_Id', obj.ID);

              var _origInitMain = sys.initMain;
              sys.initMain = function () { };
              try {
                if (typeof sys.genHTML_MenuVertical === 'function') {
                  sys.genHTML_MenuVertical(sys.dtChucNang);
                }
              } finally {
                sys.initMain = _origInitMain;
              }

              $('#sidebar-menu .active').removeClass('active');
              var $menuItem = $('#chucnang' + obj.ID);
              if ($menuItem.length) {
                if (objFull.CHUCNANGCHA_ID) {
                  $menuItem.addClass('active');
                  var $parent = $('#chucnang' + objFull.CHUCNANGCHA_ID);
                  $parent.removeClass('collapsed').parent().addClass('active');
                  $('#collapse' + objFull.CHUCNANGCHA_ID).addClass('show');
                } else {
                  $menuItem.parent().addClass('active');
                }
              }

              if (obj.DUONGDANHIENTHI) {
                try { window.location.hash = obj.DUONGDANHIENTHI.replace(/^#/, ''); } catch (e) { }
              }
              if (typeof sys.loadFunctionPath === 'function') {
                sys.loadFunctionPath(obj.DUONGDANFILE);
              }
            } catch (e) { console.error('[global-search] click error:', e); }
          });

          $(document).on('click', function (ev) {
            if (!$(ev.target).closest('.head-search-box').length) {
              $box.removeClass('show');
            }
          });

          $('.search-btn').on('click', function (ev) {
            ev.preventDefault();
            search($input.val().trim());
            $input.focus();
          });
        }

        // ─── Role picker: render tile chọn vai trò theo tone nhóm + search + filter chip.
        // Nguồn dữ liệu: edu.system.dtUngDung (systemroot.js:checkChucNang nạp async).
        // Giữ class .ungdung + id=ROLE_ID để delegate click trong systemroot.js:190 vẫn chạy.
        function initRolePicker() {
          var $grid = $('#zonedashbroad');
          if (!$grid.length) return;
          var $counter = $('#role-picker-counter');
          var $chips = $('#role-picker-chips');
          var $input = $('#role-search-input');
          var $clear = $('#role-search-clear');

          var GROUPS = {
            cong: { label: 'Cổng người dùng', bg: '#dbeafe', fg: '#1d4ed8', chipBg: '#eff6ff', chipFg: '#1d4ed8' },
            hocvu: { label: 'Học vụ', bg: '#d1fae5', fg: '#047857', chipBg: '#ecfdf5', chipFg: '#047857' },
            daotao: { label: 'Đào tạo', bg: '#ede9fe', fg: '#6d28d9', chipBg: '#f5f3ff', chipFg: '#6d28d9' },
            taichinh: { label: 'Tài chính', bg: '#fef3c7', fg: '#b45309', chipBg: '#fffbeb', chipFg: '#b45309' },
            nhansu: { label: 'Nhân sự', bg: '#ffe4e6', fg: '#be123c', chipBg: '#fff1f2', chipFg: '#be123c' },
            quantri: { label: 'Quản trị', bg: '#f1f5f9', fg: '#475569', chipBg: '#f8fafc', chipFg: '#475569' },
            khac: { label: 'Khác', bg: '#f3f4f6', fg: '#6b7280', chipBg: '#f9fafb', chipFg: '#6b7280' }
          };
          var GROUP_ORDER = ['cong', 'hocvu', 'daotao', 'taichinh', 'nhansu', 'quantri', 'khac'];

          function stripDiacritics(s) {
            return (s || '').toString().toLowerCase()
              .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'd');
          }

          // Rule phân loại theo TÊN vai trò (đã bỏ dấu). MAUNGDUNG hay đổi format
          // nên khớp theo tên là chắc ăn nhất. Rule cụ thể đặt trước rule chung
          // (vd 'cong can bo(admin)' trước 'cong can bo', 'chuong trinh dao tao'
          // trước 'chuong trinh'). Duyệt tuần tự, hit đầu tiên thắng.
          var RULES = [
            // Ưu tiên đặc biệt (tránh bị rule chung bên dưới nuốt mất)
            { kw: 'phan quyen', group: 'quantri', icon: 'fa-shield-halved' },
            { kw: 'tra cuu ket qua dang ky', group: 'taichinh', icon: 'fa-receipt' },
            { kw: 'tra cuu chuong trinh', group: 'daotao', icon: 'fa-magnifying-glass' },

            // Cổng người dùng
            { kw: 'cong can bo(admin)', group: 'cong', icon: 'fa-user-shield' },
            { kw: 'cong can bo', group: 'cong', icon: 'fa-briefcase' },
            { kw: 'cong sinh vien', group: 'cong', icon: 'fa-circle-user' },
            { kw: 'cong thong tin', group: 'cong', icon: 'fa-globe' },
            { kw: 'app sinh vien', group: 'cong', icon: 'fa-mobile-screen' },
            { kw: 'dashboard', group: 'cong', icon: 'fa-gauge-high' },

            // Học vụ
            { kw: 'chuyen can', group: 'hocvu', icon: 'fa-calendar-check' },
            { kw: 'hoc lai', group: 'hocvu', icon: 'fa-rotate-right' },
            { kw: 'thi lai', group: 'hocvu', icon: 'fa-rotate-right' },
            { kw: 'thi trac nghiem', group: 'hocvu', icon: 'fa-list-check' },
            { kw: 'thi phach', group: 'hocvu', icon: 'fa-hashtag' },
            { kw: 'quyet dinh nguoi hoc', group: 'hocvu', icon: 'fa-file-signature' },
            { kw: 'quan ly diem', group: 'hocvu', icon: 'fa-pen-to-square' },
            { kw: 'tien do nhap diem', group: 'hocvu', icon: 'fa-chart-line' },
            { kw: 'nhap diem', group: 'hocvu', icon: 'fa-pen-to-square' },
            { kw: 'xu ly hoc vu', group: 'hocvu', icon: 'fa-triangle-exclamation' },
            { kw: 'ren luyen', group: 'hocvu', icon: 'fa-star' },
            { kw: 'dang ky hoc', group: 'hocvu', icon: 'fa-pen-line' },
            { kw: 'dang ky thi', group: 'hocvu', icon: 'fa-clipboard-list' },
            { kw: 'tot nghiep', group: 'hocvu', icon: 'fa-circle-check' },
            { kw: 'vbc', group: 'hocvu', icon: 'fa-certificate' },
            { kw: 'chung chi', group: 'hocvu', icon: 'fa-certificate' },
            { kw: 'bang cap', group: 'hocvu', icon: 'fa-certificate' },
            { kw: 'chot so luong', group: 'hocvu', icon: 'fa-clipboard-check' },

            // Đào tạo
            { kw: 'ke hoach nhap hoc', group: 'daotao', icon: 'fa-calendar-plus' },
            { kw: 'ke hoach tuyen sinh', group: 'daotao', icon: 'fa-calendar-days' },
            { kw: 'ke hoach chuong trinh', group: 'daotao', icon: 'fa-calendar' },
            { kw: 'chuong trinh dao tao', group: 'daotao', icon: 'fa-book-open' },
            { kw: 'chuong trinh', group: 'daotao', icon: 'fa-book-open' },
            { kw: 'luan van', group: 'daotao', icon: 'fa-scroll' },
            { kw: 'luan an', group: 'daotao', icon: 'fa-scroll' },
            { kw: 'nghien cuu khoa hoc', group: 'daotao', icon: 'fa-flask' },
            { kw: 'nckh', group: 'daotao', icon: 'fa-flask' },
            { kw: 'tuyen sinh', group: 'daotao', icon: 'fa-graduation-cap' },
            { kw: 'nhap hoc', group: 'daotao', icon: 'fa-user-plus' },

            // Tài chính
            { kw: 'ky tuc xa', group: 'taichinh', icon: 'fa-building' },
            { kw: 'hoc bong', group: 'taichinh', icon: 'fa-award' },
            { kw: 'hoc phi', group: 'taichinh', icon: 'fa-wallet' },
            { kw: 'tai chinh', group: 'taichinh', icon: 'fa-wallet' },
            { kw: 'muc phi', group: 'taichinh', icon: 'fa-money-bill' },

            // Nhân sự
            { kw: 'nhan su', group: 'nhansu', icon: 'fa-users' },
            { kw: 'gio giang', group: 'nhansu', icon: 'fa-clock' },
            { kw: 'thong ke gio', group: 'nhansu', icon: 'fa-clock' },
            { kw: 'sinh vien', group: 'nhansu', icon: 'fa-graduation-cap' },

            // Quản trị
            { kw: 'khao sat', group: 'quantri', icon: 'fa-clipboard-list' },
            { kw: 'he thong thong tin', group: 'quantri', icon: 'fa-server' },
            { kw: 'he thong', group: 'quantri', icon: 'fa-server' },
            { kw: 'khoa quan ly', group: 'quantri', icon: 'fa-network-wired' },
            { kw: 'tin tuc', group: 'quantri', icon: 'fa-newspaper' },
            { kw: 'sms', group: 'quantri', icon: 'fa-comment-dots' },
            { kw: 'cms', group: 'quantri', icon: 'fa-gear' },
            { kw: 'chinh sach', group: 'quantri', icon: 'fa-scale-balanced' },
            { kw: 'mien giam', group: 'quantri', icon: 'fa-percent' },
            { kw: 'doi tuong', group: 'quantri', icon: 'fa-user-tag' },
            { kw: 'tra cuu', group: 'quantri', icon: 'fa-magnifying-glass' }
          ];
          var FALLBACK = { group: 'khac', icon: 'fa-cube' };

          function classify(role) {
            var hay = stripDiacritics((role && (role.TENVAITRO || role.TENUNGDUNG)) || '');
            for (var i = 0; i < RULES.length; i++) {
              if (hay.indexOf(RULES[i].kw) >= 0) {
                return { group: RULES[i].group, icon: RULES[i].icon };
              }
            }
            return FALLBACK;
          }

          function escapeHtml(s) {
            return (s || '').replace(/[&<>"']/g, function (c) {
              return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
          }

          function enrich(list) {
            var unmatched = [];
            var out = (list || []).map(function (r) {
              var meta = classify(r);
              var iconClass = (r.TENANH && /^fa[-\s]/.test(r.TENANH))
                ? r.TENANH
                : ('fa-light ' + meta.icon);
              if (meta === FALLBACK) unmatched.push(r.TENVAITRO || r.MAUNGDUNG);
              return {
                id: r.ID,
                name: r.TENVAITRO || r.TENUNGDUNG || 'Vai trò',
                code: r.MAUNGDUNG || '',
                group: meta.group,
                icon: iconClass
              };
            });
            if (unmatched.length) console.warn('[role-picker] Chưa phân nhóm được:', unmatched);
            return out;
          }

          var state = { roles: [], query: '', filter: 'all', rendered: false };

          function countByGroup(items) {
            var counts = {};
            GROUP_ORDER.forEach(function (g) { counts[g] = 0; });
            items.forEach(function (it) { counts[it.group] = (counts[it.group] || 0) + 1; });
            return counts;
          }

          function chipHtml(key, label, count) {
            var active = state.filter === key;
            return '<button type="button" class="role-chip' + (active ? ' active' : '') + '" data-key="' + key + '">' +
              '<span>' + label + '</span>' +
              '<span class="role-chip-count">' + count + '</span>' +
              '</button>';
          }

          function renderChips() {
            var counts = countByGroup(state.roles);
            var html = chipHtml('all', 'Tất cả', state.roles.length);
            GROUP_ORDER.forEach(function (g) {
              if (counts[g] > 0) html += chipHtml(g, GROUPS[g].label, counts[g]);
            });
            $chips.html(html);
          }

          function cardHtml(it) {
            var meta = GROUPS[it.group];
            return '<div class="role-card ungdung" id="' + it.id + '">' +
              '<div class="role-card-head">' +
              '<span class="role-card-icon" style="background:' + meta.bg + ';color:' + meta.fg + '">' +
              '<i class="' + it.icon + '"></i>' +
              '</span>' +
              '<div class="role-card-right">' +
              '<div class="role-card-name" title="' + escapeHtml(it.name) + '">' + escapeHtml(it.name) + '</div>' +
              // Ẩn badge nhóm (trùng với tiêu đề nhóm, tốn chiều cao card) — mở lại nếu cần
              // '<span class="role-card-badge" style="background:' + meta.chipBg + ';color:' + meta.chipFg + '">' + meta.label + '</span>' +
              '</div>' +
              '</div>' +

              '</div>';
          }

          function renderGrid(items) {
            if (!items.length) {
              $grid.html('<div class="role-empty">Không tìm thấy vai trò phù hợp.</div>').addClass('role-picker-ready');
              return;
            }
            var html;
            if (!state.query.trim()) {
              var byGroup = {};
              items.forEach(function (it) { (byGroup[it.group] = byGroup[it.group] || []).push(it); });
              html = '';
              GROUP_ORDER.forEach(function (g) {
                var arr = byGroup[g];
                if (!arr || !arr.length) return;
                html += '<section class="role-group">' +
                  '<h3 class="role-group-title" style="--g:' + GROUPS[g].fg + '"><span>' + GROUPS[g].label + '</span>' +
                  '<span class="role-group-count">(' + arr.length + ')</span></h3>' +
                  '<div class="role-grid">' + arr.map(cardHtml).join('') + '</div>' +
                  '</section>';
              });
            } else {
              html = '<div class="role-grid">' + items.map(cardHtml).join('') + '</div>';
            }
            $grid.html(html).addClass('role-picker-ready');
          }

          function apply() {
            var q = stripDiacritics(state.query.trim());
            var filtered = state.roles.filter(function (it) {
              if (state.filter !== 'all' && it.group !== state.filter) return false;
              if (!q) return true;
              return stripDiacritics(it.name + ' ' + it.code).indexOf(q) >= 0;
            });
            $counter.text(filtered.length + ' / ' + state.roles.length + ' vai trò');
            renderChips();
            renderGrid(filtered);
          }

          // Poll cho tới khi systemroot nạp xong dtUngDung, rồi render đè.
          // Vì systemroot có thể render tile cũ trước → dùng MutationObserver để render lại
          // mỗi khi #zonedashbroad bị systemroot ghi đè (vd: back về, đổi vai trò).
          function tryRender(force) {
            var raw = (window.edu && edu.system && edu.system.dtUngDung) || null;
            if (!raw || !raw.length) return false;
            var same = state.rendered && state.roles.length === raw.length;
            if (same && !force) return true;
            state.rendered = true;
            state.roles = enrich(raw);
            apply();
            return true;
          }

          var tries = 0;
          var timer = setInterval(function () {
            tries++;
            if (tryRender(false) || tries > 200) clearInterval(timer);
          }, 100);

          if (window.MutationObserver) {
            var mo = new MutationObserver(function () {
              // Nếu bị systemroot ghi đè bằng tile cũ (.item.pointer.ungdung) → render lại
              if ($grid.find('.item.pointer.ungdung').length) tryRender(true);
            });
            mo.observe($grid[0], { childList: true });
          }

          $input.on('input', function () {
            state.query = $(this).val();
            $clear.toggleClass('show', !!state.query);
            apply();
          });
          $clear.on('click', function () {
            state.query = '';
            $input.val('').focus();
            $clear.removeClass('show');
            apply();
          });
          $chips.on('click', '.role-chip', function () {
            state.filter = $(this).data('key');
            apply();
          });
        }
      </script>

  </html>