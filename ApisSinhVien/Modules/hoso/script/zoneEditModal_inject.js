/* Tat log chay nen — doi ve ham rong thay vi xoa, can bat lai thi sua 1 cho */
function zeNoLog() { }

/*----------------------------------------------
-- Log chẩn đoán luồng lưu (gửi Insert hay Update, giá trị gì, máy chủ trả gì,
-- ô Email/Điện thoại đang gắn vào loại liên hệ nào).
-- Đang TẮT. Cần soi lại thì bỏ comment đúng 1 dòng bên dưới, không phải đi sửa
-- từng chỗ gọi. Cảnh báo lỗi thật (console.warn) vẫn giữ nguyên.
----------------------------------------------*/
function zeDebug() { /* console.log.apply(console, arguments); */ }

/*----------------------------------------------
-- zoneEditModal_inject.js (2026-08-21)
-- Tự động inject modal #zoneEdit (Chỉnh sửa - Hồ sơ đề xuất, 3 tabs) + CSS vào page.
-- Idempotent: nếu #zoneEdit đã có trong DOM thì bỏ qua (case: hoso_taomoi.html có sẵn inline).
-- Dùng cho các trang muốn mở modal chỉnh sửa hồ sơ từ dexuathoso.js openEditByPerson().
----------------------------------------------*/
function _zeDoInject(forceOverlay) {
    if (document.getElementById('zoneEdit')) { zeNoLog('[ZE-Inject] skip: #zoneEdit exists'); return; }
    // Inline mode nếu page có `<div id="zeInlineHost">` — render trực tiếp vào đó, không overlay
    var inlineHost = document.getElementById('zeInlineHost');
    zeNoLog('[ZE-Inject] running');
    if (!inlineHost && !forceOverlay) { return; } // Chưa có host, defer retry — không fallback overlay ngay

    var css = ''
        /* Compact centered modal (2026-08-28) — smaller than full-viewport, van co margin quanh de thay backdrop
           :not(.ze-inline) — inline mode van dung .ze-inline rule (position:static, display:block) khong bi de */
        + '#zoneEdit.fake-modal:not(.ze-inline){position:fixed !important;top:3vh !important;left:50% !important;right:auto !important;bottom:auto !important;transform:translateX(-50%) !important;width:88vw !important;max-width:1280px !important;height:auto !important;max-height:94vh !important;overflow:hidden !important;z-index:2147483000 !important;background:#ffffff !important;border-radius:10px !important;box-shadow:0 25px 70px rgba(15,23,42,.45) !important;padding:0 !important;flex-direction:column !important;}'
        + 'body.zoneEdit-open #zoneEdit.fake-modal:not(.ze-inline){display:flex !important;}'
        + 'body.zoneEdit-open::before{content:"";position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:2147482900;pointer-events:auto;}'
        + 'body.zoneEdit-open{overflow:hidden;}'
        /* CHI boost select2 dropdown DANG MO (--open) + popup dropdown (.select2-dropdown, append vao <body>)
           KHONG boost .select2-container tinh (container dong o trang nen) — neu boost tinh se de "xuyen"
           qua modal vi container tinh cua trang nen van nam trong luong DOM binh thuong (2026-08-28 fix) */
        + 'body.zoneEdit-open .select2-container--open,body.zoneEdit-open .select2-dropdown{z-index:2147483100 !important;}'
        /* Modal thông báo/confirm của hệ thống (BS3, z-index mặc định ~1050) bị #zoneEdit (2147483000)
           che mất → user bấm Lưu không thấy báo gì. Đẩy lên trên #zoneEdit khi modal này đang mở. */
        + 'body.zoneEdit-open #myModalAlert,body.zoneEdit-open #myModalConfirm{z-index:2147483200 !important;}'
        + 'body.zoneEdit-open #myModalAlert ~ .modal-backdrop,body.zoneEdit-open .modal-backdrop.in{z-index:2147483150 !important;}'
        /* Dam bao modal luon interactive */
        + '#zoneEdit.fake-modal *{pointer-events:auto;}'
        /* Flex layout: header + tabbar (top, co dinh) — pane active (giua, scroll) — footer (duoi, sticky) */
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;min-height:0 !important;height:100% !important;box-shadow:none !important;border-radius:0 !important;overflow:hidden !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .box-header{flex:0 0 auto !important;border-radius:10px 10px 0 0 !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .zoneEdit-tabbar{flex:0 0 auto !important;position:static !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .zoneEdit-pane{min-height:0;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) .zoneEdit-pane.active{flex:1 1 auto !important;min-height:0 !important;overflow-y:auto !important;overflow-x:hidden !important;}'
        /* Footer container-fluid cuoi cung (chua Dong/Luu) — sticky duoi, luon visible */
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish > .container-fluid:last-child{flex:0 0 auto !important;background:#ffffff !important;border-top:1px solid #e2e8f0 !important;box-shadow:0 -2px 12px rgba(15,23,42,.06) !important;padding:12px 24px !important;margin:0 !important;z-index:5 !important;border-radius:0 0 10px 10px !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish > .container-fluid:last-child > hr{display:none !important;}'
        + '#zoneEdit.fake-modal:not(.ze-inline) > .box-shadow.register-wish > .container-fluid:last-child .d-flex.align-items-center.mt-4{padding:0 !important;margin:0 !important;}'
        + '#zoneEdit .box-shadow.register-wish{box-shadow:none !important;border-radius:12px !important;padding:0 !important;}'
        + '#zoneEdit .box-header{background:linear-gradient(135deg,#2563eb 0%,#1e40af 100%);color:#fff !important;border-radius:12px 12px 0 0;margin:0 !important;padding:14px 24px !important;min-height:56px;display:flex !important;align-items:center;justify-content:center !important;position:relative;}'
        + '#zoneEdit .box-header .nav-content-left{text-align:center;margin:0 auto;}'
        + '#zoneEdit .box-header .nav-content-left p.link{margin:0;padding:0;}'
        + '#zoneEdit .box-header .nav-content-left a,#zoneEdit .box-header .zeIcon,#zoneEdit .box-header .zeIcon i{color:#fff !important;font-size:16px;font-weight:600;text-decoration:none;}'
        + '#zoneEdit #zeHeaderBadge{display:inline-flex;flex-wrap:wrap;gap:6px 10px;margin-top:6px;justify-content:center;}'
        + '#zoneEdit #zeHeaderBadge:empty{display:none;}'
        + '#zoneEdit #zeHeaderBadge .ze-chip{display:inline-flex;align-items:center;padding:3px 10px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);border-radius:20px;color:#fff !important;font-size:12.5px;font-weight:500;line-height:1.4;white-space:nowrap;max-width:340px;overflow:hidden;text-overflow:ellipsis;}'
        + '#zoneEdit #zeHeaderBadge .ze-chip b{margin-right:4px;font-weight:600;opacity:.85;}'
        + '#zoneEdit .box-header .nav-content-right{position:absolute;right:12px;top:50%;transform:translateY(-50%);margin:0 !important;}'
        + 'body #zoneEdit .box-header .nav-content-right a.btnClose,body #zoneEdit .box-header a.btnClose{background:rgba(255,255,255,.18) !important;background-color:rgba(255,255,255,.18) !important;background-image:none !important;color:#fff !important;border:none !important;border-radius:50% !important;width:34px !important;height:34px !important;min-width:34px !important;line-height:34px !important;padding:0 !important;margin:0 !important;display:inline-flex !important;align-items:center;justify-content:center;font-size:15px !important;cursor:pointer;transition:background .15s;text-align:center !important;box-shadow:none !important;}'
        + 'body #zoneEdit .box-header a.btnClose:hover{background:rgba(255,255,255,.32) !important;background-color:rgba(255,255,255,.32) !important;}'
        + 'body #zoneEdit .box-header a.btnClose i{color:#fff !important;font-size:15px !important;}'
        + '#zoneEdit .box-header .btnClose::after,#zoneEdit .box-header .btnClose::before{content:none !important;}'
        + '#zoneEdit .box-header .btnClose > *:not(i){display:none !important;}'
        + '#zoneEdit .form-top{padding:20px 24px 8px 24px !important;margin-bottom:0 !important;border-top:none !important;}'
        + '#zoneEdit .form-item{margin-bottom:12px !important;align-items:center;}'
        + '#zoneEdit .form-item .form-label{width:170px !important;font-weight:500;color:#334155;font-size:14px;margin-bottom:0;}'
        + '#zoneEdit .form-item .input-group{flex:1;}'
        + '#zoneEdit .form-control,#zoneEdit .select-opt + .select2-container .select2-selection{border:1px solid #cbd5e1 !important;border-radius:6px !important;padding:8px 12px !important;font-size:14px !important;min-height:38px !important;color:#0f172a !important;}'
        + '#zoneEdit .form-control:focus{border-color:#2563eb !important;box-shadow:0 0 0 3px rgba(37,99,235,.15) !important;outline:none;}'
        + '#zoneEdit #txtHoVaTen[readonly]{background:#f1f5f9 !important;color:#475569 !important;}'
        + '#zoneEdit .sv-info-profile{display:flex;justify-content:center;align-items:flex-start;padding-top:4px;}'
        + '#zoneEdit .avata-img{position:relative;width:220px;height:220px;border-radius:12px;overflow:hidden;background:#f1f5f9;border:2px solid #e2e8f0;display:flex;align-items:center;justify-content:center;}'
        + '#zoneEdit .avata-img img{width:100%;height:100%;object-fit:cover;border-radius:12px;}'
        + '#zoneEdit .avata-img .upload-avata{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;color:#fff !important;box-shadow:0 4px 12px rgba(37,99,235,.4);text-decoration:none;}'
        + '#zoneEdit .avata-img .upload-avata i{color:#fff !important;}'
        + '#zoneEdit .container-fluid{padding:8px 24px !important;}'
        + '#zoneEdit .text-success{color:#059669 !important;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;}'
        + '#zoneEdit #tblDinhDanh,#zoneEdit #tblLienHe{border:1px solid #e2e8f0 !important;border-radius:6px;overflow:hidden;}'
        + '#zoneEdit #tblDinhDanh thead th,#zoneEdit #tblLienHe thead th{background:#f8fafc !important;color:#334155 !important;font-size:12.5px;font-weight:600;text-transform:uppercase;padding:10px 8px !important;border-bottom:1px solid #e2e8f0 !important;vertical-align:middle;}'
        + '#zoneEdit #tblDinhDanh tbody td,#zoneEdit #tblLienHe tbody td{padding:10px 8px !important;vertical-align:middle;border-bottom:1px solid #f1f5f9 !important;}'
        + '#zoneEdit #tblDinhDanh tbody td input,#zoneEdit #tblLienHe tbody td input{border:1px solid #cbd5e1 !important;border-radius:4px !important;padding:6px 10px !important;font-size:13.5px !important;width:100%;}'
        + '#zoneEdit #tblDinhDanh tbody td input:focus,#zoneEdit #tblLienHe tbody td input:focus{border-color:#2563eb !important;box-shadow:0 0 0 2px rgba(37,99,235,.1) !important;}'
        + '#zoneEdit hr{margin:8px 0 !important;border-color:#e2e8f0;}'
        + '#zoneEdit .d-flex.align-items-center.mt-4{padding:12px 8px 4px 8px;}'
        + '#zoneEdit .btn.btnClose:not(.box-header .btnClose){background:#fff !important;color:#475569 !important;border:1px solid #cbd5e1 !important;padding:8px 20px !important;border-radius:6px !important;font-weight:500;cursor:pointer;}'
        + '#zoneEdit .btn.btnClose:not(.box-header .btnClose):hover{background:#f1f5f9 !important;}'
        + '#zoneEdit #btnSave_DeXuatHoSo{background:#2563eb !important;color:#fff !important;border:1px solid #2563eb !important;padding:8px 28px !important;border-radius:6px !important;font-weight:600;cursor:pointer;box-shadow:0 2px 6px rgba(37,99,235,.25);}'
        + '#zoneEdit #btnSave_DeXuatHoSo:hover{background:#1d4ed8 !important;border-color:#1d4ed8 !important;}'
        + '#zoneEdit .aps-gap-10{display:flex;gap:10px;}'
        + '#zoneEdit .zoneEdit-tabbar{display:flex;gap:4px;padding:0 24px;background:#fff;border-bottom:2px solid #e2e8f0;margin-top:0;position:sticky;top:0;z-index:5;}'
        + '#zoneEdit .zoneEdit-tab{padding:12px 20px;font-size:14px;font-weight:600;color:#64748b;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;transition:all .15s;white-space:nowrap;display:flex;align-items:center;gap:8px;}'
        + '#zoneEdit .zoneEdit-tab i{font-size:15px;}'
        + '#zoneEdit .zoneEdit-tab:hover{color:#2563eb;background:#f8fafc;}'
        + '#zoneEdit .zoneEdit-tab.active{color:#2563eb;border-bottom-color:#2563eb;background:#eff6ff;}'
        + '#zoneEdit .zoneEdit-pane{display:none;animation:zoneEditFadeIn .2s;}'
        + '#zoneEdit .zoneEdit-pane.active{display:block;}'
        + '@keyframes zoneEditFadeIn{from{opacity:0;}to{opacity:1;}}'
        + '#zoneEdit .ze-form{--aps-sv-primary:#2563eb;--aps-sv-primary-soft:#eaf1ff;--aps-sv-border:#e2e8f0;--aps-sv-label:#475569;--aps-sv-text:#0f172a;--aps-sv-radius:5px;padding:24px 28px !important;}'
        + '#zoneEdit .ze-form .aps-sv-section + .aps-sv-section{margin-top:24px;}'
        + '#zoneEdit .ze-form .aps-sv-section-title{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:700;color:var(--aps-sv-primary);text-transform:uppercase;letter-spacing:.3px;margin:6px 0 18px;}'
        + '#zoneEdit .ze-form .aps-sv-section-title::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--aps-sv-border),transparent);}'
        + '#zoneEdit .ze-form .aps-sv-section-title i{color:var(--aps-sv-primary);}'
        + '#zoneEdit .ze-form .aps-sv-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 26px;}'
        + '@media (max-width:900px){#zoneEdit #zoneXHD .aps-sv-grid{grid-template-columns:1fr;}}'
        + '#zoneEdit .ze-form .aps-sv-field.aps-sv-col-full{grid-column:1 / -1;}'
        + '#zoneEdit .ze-form .aps-sv-label{display:block;font-size:13px;font-weight:600;color:var(--aps-sv-label);margin-bottom:7px;}'
        + '#zoneEdit .ze-form .aps-sv-label .aps-sv-req{color:#ef4444;margin-left:2px;}'
        + '#zoneEdit .ze-form .aps-sv-input{width:100%;height:38px;padding:0 14px;font-size:14px;color:var(--aps-sv-text) !important;background:#fff;border:1px solid var(--aps-sv-border) !important;border-radius:var(--aps-sv-radius) !important;transition:border-color .15s,box-shadow .15s;outline:none;box-sizing:border-box;}'
        + '#zoneEdit .ze-form .aps-sv-input::placeholder{color:#94a3b8;}'
        + '#zoneEdit .ze-form .aps-sv-input:focus{border-color:var(--aps-sv-primary) !important;box-shadow:0 0 0 3px rgba(37,99,235,.14) !important;}'
        + '#zoneEdit .ze-form .aps-sv-select{position:relative;}'
        + '#zoneEdit .ze-form .aps-sv-select select.aps-sv-input{appearance:none;-webkit-appearance:none;padding-right:38px;cursor:pointer;}'
        + '#zoneEdit .ze-form .aps-sv-select > i{position:absolute;right:15px;top:50%;transform:translateY(-50%);pointer-events:none;color:#94a3b8;font-size:13px;}'
        + '#zoneEdit .ze-form .aps-sv-input-icon{position:relative;}'
        + '#zoneEdit .ze-form .aps-sv-input-icon > i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:14px;}'
        + '#zoneEdit .ze-form .aps-sv-input-icon .aps-sv-input{padding-left:40px;}'
        + '#zoneEdit .ze-form .aps-sv-input.ze-readonly,#zoneEdit .ze-form .aps-sv-input[readonly]{background:#f1f5f9 !important;color:#475569 !important;}'
        /* Ô gộp ngày sinh — cho nổi hơn 3 ô rời vì đây là ô người dùng copy */
        + '#zoneEdit .ze-form .ze-dob-full .aps-sv-input{font-weight:600 !important;color:#0f172a !important;letter-spacing:.4px;}'
        + '#zoneEdit .ze-form .ze-dob-full .aps-sv-input::selection{background:#bfdbfe;}'
        + '#zoneEdit .ze-canhan-layout{display:grid;grid-template-columns:1fr 220px;gap:24px;align-items:start;}'
        + '@media (max-width:900px){#zoneEdit .ze-canhan-layout{grid-template-columns:1fr;}}'
        + '#zoneEdit .ze-canhan-avatar{align-self:start;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img{margin:0;width:200px;height:200px;overflow:hidden;position:relative;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img fieldset{border:none !important;padding:0 !important;margin:0 !important;width:100%;height:100%;background:transparent;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img fieldset > div{width:100%;height:100%;}'
        + '#zoneEdit .ze-canhan-avatar .avata-img input[type="image"],#zoneEdit .ze-canhan-avatar .avata-img img{width:100% !important;height:100% !important;object-fit:cover;display:block;border-radius:8px;}'
        + '#zoneEdit .ze-canhan-avatar .upload-avata{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;color:#fff !important;box-shadow:0 4px 12px rgba(37,99,235,.4);text-decoration:none;z-index:2;}'
        + '#zoneEdit .ze-canhan-avatar .upload-avata i{color:#fff !important;}'
        + '/* Inline mode overrides — flow theo layout trang, không overlay/backdrop */'
        + '#zoneEdit.ze-inline{position:static !important;width:100% !important;max-width:none !important;max-height:none !important;transform:none !important;top:auto !important;left:auto !important;z-index:auto !important;box-shadow:0 1px 4px rgba(15,23,42,.08) !important;border-radius:8px !important;overflow:visible !important;display:block !important;}'
        + '#zoneEdit.ze-inline .box-header{border-radius:8px 8px 0 0 !important;}'
        + '#zoneEdit.ze-inline .zoneEdit-tabbar{border-radius:0 !important;}'
        + '#zoneEdit.ze-inline .box-header .nav-content-right{display:none !important;}' /* Ẩn nút X trong inline mode */
        + 'body.ze-has-inline::before{content:none !important;}' /* Không backdrop nếu inline */
        + 'body.ze-has-inline{overflow:auto !important;}'
        ;

    var html =
'<div class="fake-modal zone-bus" id="zoneEdit" style="display:none;padding-top:15px">' +
    '<div class="box-shadow register-wish pt-0 position-relative modal-aps-add">' +
        '<div class="d-flex justify-content-between pt-3 px-20 box-header">' +
            '<div class="nav-content-left"><p class="link"><a><span class="zeIcon"><i class="fa-regular fa-file-circle-question fw-bold"></i></span> Chỉnh sửa - Hồ sơ đề xuất</a></p><div id="zeHeaderBadge"></div></div>' +
            '<div class="nav-content-right mt"><a class="d-block text-right fs-16 mt-5 color-fff btnClose"><i class="fal fa-times"></i></a></div>' +
        '</div>' +
        '<div class="zoneEdit-tabbar">' +
            '<div class="zoneEdit-tab active" data-zetab="tabInfo"><i class="fal fa-user"></i> Thông tin cơ bản</div>' +
            '<div class="zoneEdit-tab" data-zetab="tabDinhDanh"><i class="fal fa-id-card"></i> Định danh &amp; Liên hệ</div>' +
            '<div class="zoneEdit-tab" data-zetab="tabXHD"><i class="fal fa-file-invoice-dollar"></i> Xuất hoá đơn</div>' +
        '</div>' +
        '<div class="zoneEdit-pane active" id="tabInfo">' +
            '<div id="zoneCaNhan" class="ze-form">' +
                '<div class="aps-sv-section">' +
                    '<div class="aps-sv-section-title"><i class="fa-light fa-user"></i> Thông tin cá nhân</div>' +
                    '<div class="ze-canhan-layout">' +
                        '<div class="aps-sv-grid ze-canhan-grid">' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Họ</label><input class="aps-sv-input" id="txtHo"></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Tên đệm</label><input class="aps-sv-input" id="txtTenDem"></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Tên</label><input class="aps-sv-input" id="txtTen"></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Tên đầy đủ</label><input class="aps-sv-input ze-readonly" id="txtHoVaTen" readonly="readonly"></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Mức độ ngày sinh</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropMucDoNgaySinh"></select></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Giới tính</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropGioiTinh"></select></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Ngày sinh</label><input class="aps-sv-input" id="txtNgaySinh" placeholder="dd"></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Tháng sinh</label><input class="aps-sv-input" id="txtThangSinh" placeholder="mm"></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Năm sinh</label><input class="aps-sv-input" id="txtNamSinh" placeholder="yyyy"></div>' +
                            '<div class="aps-sv-field ze-dob-full"><label class="aps-sv-label">Ngày sinh (đầy đủ)</label><div class="aps-sv-input-icon"><i class="fa-light fa-calendar-days"></i><input class="aps-sv-input" id="txtNgaySinhDayDu" placeholder="dd/mm/yyyy" title="Gộp Ngày/Tháng/Năm sinh — click là bôi đen sẵn, Ctrl+C để copy; dán ngược vào đây cũng tự tách ra 3 ô."></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Quốc tịch</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropQuocTich"><option value="">-- Chọn quốc tịch --</option></select></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Dân tộc</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropDanToc"><option value="">-- Chọn dân tộc --</option></select></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Tôn giáo</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropTonGiao"><option value="">-- Chọn tôn giáo --</option></select></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Email</label><div class="aps-sv-input-icon"><i class="fa-light fa-envelope"></i><input class="aps-sv-input" id="txtEmailCaNhan" type="email" placeholder="email@..."></div></div>' +
                            '<div class="aps-sv-field"><label class="aps-sv-label">Điện thoại</label><div class="aps-sv-input-icon"><i class="fa-light fa-phone"></i><input class="aps-sv-input" id="txtDienThoai" placeholder="09xx xxx xxx"></div></div>' +
                        '</div>' +
                        '<div class="ze-canhan-avatar"><div class="avata-img"><img src="assets/images/avata-form.jpg" id="uploadPicture_SV"><a href="#" class="upload-avata"><i class="fal fa-camera color-dask-blue"></i></a></div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="aps-sv-section">' +
                    '<div class="aps-sv-section-title"><i class="fa-light fa-location-dot"></i> Nơi sinh</div>' +
                    '<div class="aps-sv-grid">' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Tỉnh / Thành phố</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropNS_Tinh"><option value="">Chọn tỉnh thành</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Quận / Huyện</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropNS_Huyen"><option value="">Vui lòng chọn Tỉnh trước</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Xã / Phường</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropNS_Xa"><option value="">Vui lòng chọn Quận/Huyện trước</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Chi tiết (số nhà / thôn / xóm)</label><input class="aps-sv-input" id="txtNS_ChiTiet" placeholder="Số nhà, tên đường, thôn/xóm..."></div>' +
                    '</div>' +
                '</div>' +
                '<div class="aps-sv-section">' +
                    '<div class="aps-sv-section-title"><i class="fa-light fa-id-card"></i> Số CCCD / Định danh</div>' +
                    '<div class="aps-sv-grid">' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Số CCCD <span style="color:#dc2626">*</span></label><div class="aps-sv-input-icon"><i class="fa-light fa-hashtag"></i><input class="aps-sv-input" id="txtCCCD_So" placeholder="12 chữ số"></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Ngày cấp</label><input class="aps-sv-input" id="txtCCCD_NgayCap" type="date"></div>' +
                        '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Nơi cấp</label><input class="aps-sv-input" id="txtCCCD_NoiCap" placeholder="Ví dụ: Cục Cảnh sát QLHC..."></div>' +
                    '</div>' +
                '</div>' +
                '<div class="aps-sv-section">' +
                    '<div class="aps-sv-section-title"><i class="fa-light fa-house"></i> Hộ khẩu thường trú</div>' +
                    '<div class="aps-sv-grid">' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Tỉnh / Thành phố</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropHK_Tinh"><option value="">Chọn tỉnh thành</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Quận / Huyện</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropHK_Huyen"><option value="">Vui lòng chọn Tỉnh trước</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Xã / Phường</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="dropHK_Xa"><option value="">Vui lòng chọn Quận/Huyện trước</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Số nhà / thôn / xóm</label><input class="aps-sv-input" id="txtHK_SoNha"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="zoneEdit-pane" id="tabDinhDanh">' +
            '<div class="container-fluid px-20 mt-15"><div class="row">' +
                '<div class="col-12 col-lg-6 mt-6 pl0"><div class="d-flex align-items-center w-100 justify-content-between"><span class="fw-bold text-success pull-left">Thông tin định danh</span></div><div class="mt-10 aps-table-select"><table class="table transcrip-table tabs-scores tblDapAn_Mau mt-10 table-bordered table-noborder" id="tblDinhDanh"><thead><tr><th class="text-center w-50px" scope="col">STT</th><th scope="col">Loại định danh </th><th scope="col">Số định danh </th><th scope="col">Ngày cấp</th><th scope="col">Nơi cấp</th><th class="text-center" scope="col">Là thông tin chính</th></tr></thead><tbody></tbody></table></div></div>' +
                '<div class="col-12 col-lg-6 mt-6"><div class="d-flex align-items-center w-100 justify-content-between"><span class="fw-bold text-success pull-left">Thông tin liên hệ</span></div><div class="mt-8 aps-table-select"><table class="table transcrip-table tabs-scores table-bordered table-noborder tblDapAn" id="tblLienHe"><thead><tr><th class="text-center w-50px" scope="col">STT</th><th scope="col">Loại liên hệ</th><th scope="col">Thông tin</th><th class="text-center" scope="col">Là thông tin chính</th></tr></thead><tbody></tbody></table></div></div>' +
            '</div></div>' +
        '</div>' +
        '<div class="zoneEdit-pane" id="tabXHD">' +
            '<div id="zoneXHD" class="ze-form">' +
                '<div class="aps-sv-section">' +
                    '<div class="aps-sv-section-title"><i class="fa-light fa-file-invoice-dollar"></i> Người mua / Xuất hoá đơn</div>' +
                    '<div class="aps-sv-grid">' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Đối tượng xuất hoá đơn</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="ddlKQ_HD_DoiTuong"><option value="">-- Chọn đối tượng --</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Họ tên người mua hàng</label><input class="aps-sv-input" id="txtKQ_HD_NguoiMua" placeholder="Người nộp tiền / người mua"></div>' +
                        '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Tên đơn vị / Công ty <span style="font-weight:500;color:#94a3b8">(nếu xuất cho tổ chức)</span></label><input class="aps-sv-input" id="txtKQ_HD_TenDonVi" placeholder="Tên đơn vị nhận hoá đơn"></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Mã số thuế (MST)</label><div class="aps-sv-input-icon"><i class="fa-light fa-hashtag"></i><input class="aps-sv-input" id="txtKQ_HD_MST" placeholder="10 hoặc 13 chữ số"></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Mã quan hệ ngân sách</label><div class="aps-sv-input-icon"><i class="fa-light fa-landmark"></i><input class="aps-sv-input" id="txtKQ_HD_MaQHNS" placeholder="Mã QHNS (nếu là đơn vị NSNN)"></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Số điện thoại nhận</label><div class="aps-sv-input-icon"><i class="fa-light fa-phone"></i><input class="aps-sv-input" id="txtKQ_HD_SDT" placeholder="09xx xxx xxx"></div></div>' +
                        '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Địa chỉ trên hoá đơn</label><input class="aps-sv-input" id="txtKQ_HD_DiaChi" placeholder="Địa chỉ ghi trên hoá đơn"></div>' +
                        '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Email nhận hoá đơn điện tử</label><div class="aps-sv-input-icon"><i class="fa-light fa-envelope"></i><input type="email" class="aps-sv-input" id="txtKQ_HD_Email" placeholder="email nhận HĐĐT"></div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="aps-sv-section">' +
                    '<div class="aps-sv-section-title"><i class="fa-light fa-money-check-dollar"></i> Thông tin thanh toán</div>' +
                    '<div class="aps-sv-grid">' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Loại tài khoản ngân hàng</label><div class="aps-sv-select"><i class="fa-light fa-chevron-down"></i><select class="aps-sv-input" id="ddlKQ_HD_HinhThucTT"><option value="">-- Chọn loại tài khoản --</option></select></div></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Ngân hàng</label><input class="aps-sv-input" id="txtKQ_HD_NganHang" placeholder="Tên ngân hàng"></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Số tài khoản</label><input class="aps-sv-input" id="txtKQ_HD_SoTK" placeholder="Số tài khoản ngân hàng"></div>' +
                        '<div class="aps-sv-field"><label class="aps-sv-label">Chủ tài khoản</label><input class="aps-sv-input" id="txtKQ_HD_ChuTK" placeholder="Tên chủ tài khoản"></div>' +
                        '<div class="aps-sv-field aps-sv-col-full"><label class="aps-sv-label">Ghi chú</label><input class="aps-sv-input" id="txtKQ_HD_GhiChu" placeholder="Ghi chú thêm cho hoá đơn (nếu có)"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="container-fluid px-20"><hr /><div class="d-flex align-items-center mt-4 flex-wrap mb-4"><div class="ms-auto aps-gap-10"><div class="btn btn-outline-secondary btnClose"><i class="fal fa-times"></i> Đóng</div><div class="btn btn-primary" id="btnSave_DeXuatHoSo"><i class="fal fa-save"></i> Lưu</div></div></div></div>' +
    '</div>' +
'</div>';

    // Inject CSS
    var styleEl = document.createElement('style');
    styleEl.setAttribute('data-zone-edit-inject', '1');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Inject HTML — inline vào host nếu có, else overlay body
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    var modalEl = wrap.firstChild;
    if (inlineHost) {
        modalEl.classList.add('ze-inline');
        modalEl.style.display = 'block';
        inlineHost.appendChild(modalEl);
        document.body.classList.add('ze-has-inline');
        // Ẩn nút Đóng/footer trong inline mode
        var footerClose = modalEl.querySelector('.container-fluid .btn.btnClose');
        if (footerClose) footerClose.style.display = 'none';
        // HIDE (không xoá) các sibling khác của host để trang cũ init không crash
        // — style.setProperty với 'important' để đè CSS !important của theme (2026-08-21)
        var parent = inlineHost.parentNode;
        if (parent) {
            for (var i = 0; i < parent.children.length; i++) {
                var el = parent.children[i];
                if (el !== inlineHost) {
                    el.style.setProperty('display', 'none', 'important');
                    el.setAttribute('data-ze-hidden', '1');
                }
            }
        }
    } else {
        document.body.appendChild(modalEl);
    }

    // Handler tab switch (delegate on document — chạy 1 lần)
    if (!window._zoneEditTabHandlerBound) {
        window._zoneEditTabHandlerBound = true;
        document.addEventListener('click', function (e) {
            var tab = e.target.closest('#zoneEdit .zoneEdit-tab');
            if (!tab) return;
            var target = tab.getAttribute('data-zetab');
            var host = document.getElementById('zoneEdit');
            host.querySelectorAll('.zoneEdit-tab').forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');
            host.querySelectorAll('.zoneEdit-pane').forEach(function (p) { p.classList.remove('active'); });
            var pane = document.getElementById(target);
            if (pane) pane.classList.add('active');
        });
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('#zoneEdit .btnClose');
            if (!btn) return;
            document.body.classList.remove('zoneEdit-open');
        });
    }
}
// Kick off: retry loop tìm #zeInlineHost mỗi 100ms, sau 2s vẫn không có thì fallback overlay (2026-08-21)
(function _zeKickoff() {
    var tries = 0;
    var timer = setInterval(function () {
        tries++;
        if (document.getElementById('zoneEdit')) { clearInterval(timer); return; }
        if (document.getElementById('zeInlineHost')) {
            clearInterval(timer);
            _zeDoInject(false);  // inline mode
        } else if (tries > 20) {  // 20 × 100ms = 2s
            clearInterval(timer);
            zeNoLog('[ZE-Inject] timeout → fallback overlay');
            _zeDoInject(true);   // fallback overlay
        }
    }, 100);
    // Chạy ngay lần đầu để bắt case DOM đã ready
    if (document.getElementById('zeInlineHost')) {
        clearInterval(timer);
        _zeDoInject(false);
    } else if (document.getElementById('zoneEdit')) {
        clearInterval(timer);
    }
})();

/*==============================================================================
== Patch DeXuatHoSo.prototype nếu server còn dexuathoso.js cũ (2026-08-21)
== Cho phép mọi trang chỉ cần include dexuathoso.js + zoneEditModal_inject.js
==============================================================================*/
// Save PersonInvoice (tab XHĐ) — fallback nếu server có dexuathoso.js cũ (2026-08-25)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype.save_PersonInvoice) {
    DeXuatHoSo.prototype.save_PersonInvoice = function () {
        var me = this;
        var val = function (id) { return (($('#' + id).val() || '') + '').trim(); };
        var tenDonVi = val('txtKQ_HD_TenDonVi');
        var mst = val('txtKQ_HD_MST');
        var diaChi = val('txtKQ_HD_DiaChi');
        var email = val('txtKQ_HD_Email');
        var sdt = val('txtKQ_HD_SDT');
        var maQHNS = val('txtKQ_HD_MaQHNS');
        var doiTuong = $('#ddlKQ_HD_DoiTuong').val() || '';
        var hasData = tenDonVi || mst || diaChi || email || sdt || maQHNS || doiTuong;
        var invoiceId = me._currentInvoiceId || '';
        if (!hasData && !invoiceId) return;
        var isUpdate = !!(invoiceId && invoiceId.length === 32);
        var obj_save = {
            action: isUpdate ? 'SV_NGUOIHOC_01_MH/EjQgHhEkMzIuLwgvNy4oIiQILycu' : 'SV_NGUOIHOC_01_MH/FSkkLB4RJDMyLi8ILzcuKCIkCC8nLgPP',
            func: isUpdate ? 'PKG_CORE_NGUOIHOC_01.Sua_PersonInvoiceInfo' : 'PKG_CORE_NGUOIHOC_01.Them_PersonInvoiceInfo',
            iM: edu.system.iM,
            strBuyer_Type_Loai: doiTuong, strBuyer_Ref_Type: '', strBuyer_Ref_Id: '',
            strBuyer_Name: tenDonVi, strBuyer_Addr: diaChi, strBuyer_Tax_Mst: mst,
            strBuyer_Budget_Qhns: maQHNS, strBuyer_Email: email, strBuyer_Phone: sdt,
            strNguoiThucHien_Id: edu.system.userId,
            strVaiTroDangNhap_Id: edu.system.vaiTroDangNhap_Id || '',
            strChucNangHeThong_Id: edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
            strHanhDong_Code: ''
        };
        if (isUpdate) obj_save.strId = invoiceId;
        else {
            var pid = me.strDeXuatHoSo_Id || me._lockedPersonId || '';
            if (!pid) { console.warn('[ZE PersonInvoice] không có strPerson_Id → skip Them'); return; }
            obj_save.strPerson_Id = pid;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { if (!isUpdate && data.Id) me._currentInvoiceId = data.Id; }
                else console.warn('[ZE PersonInvoice] fail:', data.Message);
            },
            error: function (er) { console.warn('[ZE PersonInvoice] err:', er); },
            type: 'POST', contentType: true, action: obj_save.action, data: obj_save, fakedb: []
        }, false, false, false, null);
    };
}

// Monkey-patch save_DeXuatHoSo → chain save_PersonInvoice sau khi CorePerson save (2026-08-25)
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.save_DeXuatHoSo && !DeXuatHoSo.prototype._invoiceChainHooked) {
    DeXuatHoSo.prototype._invoiceChainHooked = true;
    var _origSaveDX = DeXuatHoSo.prototype.save_DeXuatHoSo;
    // dexuathoso.js bản mới đã tự gọi save_PersonInvoice trong success của CorePerson.
    // Nếu vẫn gọi thêm ở đây thì hồ sơ CHƯA có hoá đơn sẽ bị INSERT trùng 2 dòng: lần
    // gọi thứ 2 (mốc 300ms) chạy trước khi lần 1 kịp trả _currentInvoiceId nên cả hai
    // đều tính là "chưa có" → cùng chạy Them_PersonInvoiceInfo. Chỉ chain khi bản gốc
    // chưa gọi (server còn dexuathoso.js cũ).
    var _goc_daChain = _origSaveDX.toString().indexOf('save_PersonInvoice') > -1;
    DeXuatHoSo.prototype.save_DeXuatHoSo = function () {
        var me = this;
        _origSaveDX.call(me);
        if (_goc_daChain) return;
        // Fire PersonInvoice song song sau 300ms (CorePerson save đã fire, strDeXuatHoSo_Id đã có sẵn với UPDATE)
        setTimeout(function () { if (typeof me.save_PersonInvoice === 'function') me.save_PersonInvoice(); }, 300);
    };
}

// Bridge helper: #txtEmailCaNhan/#txtDienThoai → shadow #txtLienHe<typeId> (2026-08-25)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._bridgeLienHeToShadow) {
    DeXuatHoSo.prototype._bridgeOneLienHe = function (typeId, uiFieldId) {
        if (!typeId) return;
        if (!$('#txtLienHe' + typeId).length) $('body').append('<input type="hidden" id="txtLienHe' + typeId + '" />');
        if (!$('#checkX' + typeId).length) $('body').append('<input type="checkbox" id="checkX' + typeId + '" style="display:none" checked />');
        var val = (($('#' + uiFieldId).val() || '') + '').trim();
        $('#txtLienHe' + typeId).val(val);
        var existing = (this.dtLienHe || []).find(function (x) { return x.CONTACT_TYPE_CODE_ID === typeId || x.CONTACT_TYPE_CODE === typeId; });
        if (existing && existing.ID) $('#txtLienHe' + typeId).attr('name', existing.ID);
    };
    DeXuatHoSo.prototype._bridgeLienHeToShadow = function () {
        var me = this;
        var arr = me.dtLoaiLienHe || [];
        var strip = function (s) { return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase(); };
        arr.forEach(function (type) {
            var text = strip(type.MA) + '|' + strip(type.TEN);
            var isEmail = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(text);
            var isPhone = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(text);
            if (!isEmail && !isPhone) {
                var existing = (me.dtLienHe || []).find(function (x) { return (x.CONTACT_TYPE_CODE_ID === type.ID) || (x.CONTACT_TYPE_CODE === type.ID); });
                var v = existing && (existing.CONTACT_VALUE || existing.VALUE) || '';
                if (v.indexOf('@') > -1) isEmail = true;
                else if (/^[\d\s\+\-\(\)\.]+$/.test(v) && v.replace(/\D/g, '').length >= 6) isPhone = true;
            }
            var uiFieldId = isEmail ? 'txtEmailCaNhan' : (isPhone ? 'txtDienThoai' : null);
            if (!uiFieldId) return;
            me._bridgeOneLienHe(type.ID, uiFieldId);
        });
    };
}

// Bridge helper: #txtCCCD_So → shadow #txtSoDinhDinh<cccdTypeId> (2026-08-25)
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._bridgeCccdToShadow) {
    DeXuatHoSo.prototype._findCccdTypeId = function () {
        var arr = this.dtLoaiDinhDanh || [];
        var found = arr.find(function (e) {
            var ma = ((e.MA || '') + '').toUpperCase();
            var ten = ((e.TEN || '') + '').toUpperCase();
            return ma === 'CCCD' || ten.indexOf('CCCD') > -1 || ten.indexOf('CĂN CƯỚC') > -1 || ten.indexOf('CAN CUOC') > -1;
        });
        return found ? found.ID : null;
    };
    DeXuatHoSo.prototype._bridgeCccdToShadow = function () {
        var cid = this._findCccdTypeId();
        if (!cid) { console.warn('[ZE Bridge CCCD] không tìm thấy CCCD type'); return; }
        if (!$('#txtSoDinhDinh' + cid).length) $('body').append('<input type="hidden" id="txtSoDinhDinh' + cid + '" />');
        if (!$('#txtNgayCap' + cid).length) $('body').append('<input type="hidden" id="txtNgayCap' + cid + '" />');
        if (!$('#txtNoiCap' + cid).length) $('body').append('<input type="hidden" id="txtNoiCap' + cid + '" />');
        if (!$('#checkX' + cid).length) $('body').append('<input type="checkbox" id="checkX' + cid + '" style="display:none" checked />');
        $('#txtSoDinhDinh' + cid).val(($('#txtCCCD_So').val() || '').trim());
        $('#txtNgayCap' + cid).val($('#txtCCCD_NgayCap').val() || '');
        $('#txtNoiCap' + cid).val(($('#txtCCCD_NoiCap').val() || '').trim());
        var existing = (this.dtDinhDanh || []).find(function (x) { return x.IDENTIFIER_TYPE_CODE === cid; });
        if (existing && existing.ID) $('#txtSoDinhDinh' + cid).attr('name', existing.ID);
    };
}

// Populate header badge (2026-08-28) — fallback nếu server có dexuathoso.js cũ
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._populateHeaderBadge) {
    DeXuatHoSo.prototype._populateHeaderBadge = function (person) {
        var el = document.getElementById('zeHeaderBadge');
        if (!el) return;
        el.innerHTML = '';
        if (!person) return;
        var pick = function (obj, keys) {
            if (!obj) return '';
            var lookup = {};
            for (var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) lookup[k.toUpperCase()] = obj[k]; }
            for (var i = 0; i < keys.length; i++) {
                var v = lookup[keys[i].toUpperCase()];
                if (v !== null && v !== undefined && v !== '') return v;
            }
            return '';
        };
        var a = person.aData || {};
        var ma = person.ma || pick(a, ['MA', 'MASO', 'MA_NGUOI_HOC', 'MA_SV', 'STUDENT_CODE', 'CURRENT_EMPLOYEE_CODE', 'QLSV_NGUOIHOC_MA', 'MA_HS']);
        var hoTen = person.hoTen || pick(a, ['FULL_NAME', 'FULLNAME', 'HOTEN', 'HO_TEN', 'HOVATEN', 'HO_VA_TEN', 'QLSV_NGUOIHOC_HOTEN', 'QLSV_NGUOIHOC_FULLNAME']);
        if (!hoTen) {
            var _parts = [person.hoDem || pick(a, ['HODEM', 'HO_DEM', 'QLSV_NGUOIHOC_HODEM']), person.ten || pick(a, ['TEN', 'FIRST_NAME', 'QLSV_NGUOIHOC_TEN'])];
            hoTen = _parts.filter(function (x) { return x; }).join(' ').replace(/\s+/g, ' ').trim();
        }
        var lop = person.lop || pick(a, ['DAOTAO_LOPQUANLY_TEN', 'LOP_TEN', 'LOP', 'QLSV_NGUOIHOC_LOPQUANLY_TEN', 'DAOTAO_LOPQUANLY_MA', 'LOP_MA']);
        var nganh = person.nganh || pick(a, ['DAOTAO_NGANH_TEN', 'NGANH_TEN', 'NGANH', 'QLSV_NGUOIHOC_NGANH_TEN', 'DAOTAO_NGANHDAOTAO_TEN']);
        var khoa = person.khoa || pick(a, ['DAOTAO_KHOAQUANLY_TEN', 'KHOA_TEN', 'KHOA', 'QLSV_NGUOIHOC_KHOAQUANLY_TEN', 'DAOTAO_KHOADAOTAO_TEN', 'KHOAHOC']);
        var esc = function (s) { return (s + '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
        var chips = [];
        if (ma) chips.push('<span class="ze-chip"><b>Mã:</b>' + esc(ma) + '</span>');
        if (hoTen) chips.push('<span class="ze-chip"><b>Họ tên:</b>' + esc(hoTen) + '</span>');
        if (lop) chips.push('<span class="ze-chip"><b>Lớp:</b>' + esc(lop) + '</span>');
        if (nganh) chips.push('<span class="ze-chip"><b>Ngành:</b>' + esc(nganh) + '</span>');
        if (khoa) chips.push('<span class="ze-chip"><b>Khóa:</b>' + esc(khoa) + '</span>');
        el.innerHTML = chips.join('');
    };
}

if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype.openEditByPerson) {
    DeXuatHoSo.prototype.openEditByPerson = function (person) {
        var dx = this;
        if (!person || !person.id) return;
        dx.strDeXuatHoSo_Id = person.id;
        // Lưu backup để save flow không bị mất (Viện Y schema NOT NULL constraint) (2026-08-24)
        dx._lockedPersonId = person.id;
        // Safeguard: intercept Save button để force strDeXuatHoSo_Id đúng, đảm bảo gọi UPDATE (không INSERT)
        if (!dx._saveGuardBound) {
            dx._saveGuardBound = true;
            $(document).on('mousedown', '#btnSave_DeXuatHoSo', function () {
                if (dx._lockedPersonId) {
                    dx.strDeXuatHoSo_Id = dx._lockedPersonId;
                }
                if (typeof dx._bridgeCccdToShadow === 'function') dx._bridgeCccdToShadow();
                if (typeof dx._bridgeLienHeToShadow === 'function') dx._bridgeLienHeToShadow();
            });
            // Validate: Số CCCD bắt buộc nhập — capture-phase click để chặn direct click handler (2026-08-25)
            var _btnSave = document.getElementById('btnSave_DeXuatHoSo');
            if (_btnSave && !_btnSave._cccdValidatorBound) {
                _btnSave._cccdValidatorBound = true;
                _btnSave.addEventListener('click', function (ev) {
                    var el = document.getElementById('txtCCCD_So');
                    if (el && !((el.value || '') + '').trim()) {
                        try { edu.system.alert('Vui lòng nhập Số CCCD.', 'w'); } catch (er) { alert('Vui lòng nhập Số CCCD.'); }
                        setTimeout(function () { try { el.focus(); } catch (er) { } }, 50);
                        ev.preventDefault();
                        ev.stopImmediatePropagation();
                        ev.stopPropagation();
                        return false;
                    }
                }, true); // capture phase — chạy trước jQuery bubble handler
            }
        }
        var strHoDem = ((person.hoDem || '') + '').trim().replace(/\s+/g, ' ');
        var arr = strHoDem.split(' ');
        var strHo = arr.shift() || '';
        var strTenDem = arr.join(' ');
        edu.util.viewValById("txtHo", strHo);
        edu.util.viewValById("txtTenDem", strTenDem);
        edu.util.viewValById("txtTen", edu.util.returnEmpty(person.ten));
        $("#txtTen").trigger("input");
        edu.util.viewValById("txtNgaySinh", edu.util.returnEmpty(person.ngaySinh_Ngay));
        edu.util.viewValById("txtThangSinh", edu.util.returnEmpty(person.ngaySinh_Thang));
        edu.util.viewValById("txtNamSinh", edu.util.returnEmpty(person.ngaySinh_Nam));
        edu.util.viewValById("uploadPicture_SV", edu.util.returnEmpty(person.anh));
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(person.anh), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_SV").attr("src", strAnh);
        if (typeof dx._populateHeaderBadge === 'function') dx._populateHeaderBadge(person);
        var isInline = $('#zoneEdit').hasClass('ze-inline');
        if (!isInline) {
            dx.toggle_edit();
            $('body').addClass('zoneEdit-open');
        }
        $('#zoneEdit .zoneEdit-tab').removeClass('active');
        $('#zoneEdit .zoneEdit-tab[data-zetab="tabInfo"]').addClass('active');
        $('#zoneEdit .zoneEdit-pane').removeClass('active');
        $('#zoneEdit #tabInfo').addClass('active');
        if (typeof dx.getList_DinhDanh === 'function') dx.getList_DinhDanh();
        if (typeof dx.getList_LienHe === 'function') dx.getList_LienHe();
        if (dx.dtMucDoNgaySinh && dx.dtMucDoNgaySinh.length) {
            var opt = dx.dtMucDoNgaySinh.find(function (e) { return e.MA == "EXACT"; });
            if (opt) $('#dropMucDoNgaySinh').val(opt.ID).trigger("change").trigger({ type: 'select2:select' });
        }
        // Populate dropdown — accept ID hoặc MA. Nếu MA thì tìm option có data-ma khớp
        var _pickIdByMa = function (selectId, ma) {
            if (!ma) return '';
            var opt = document.querySelector('#' + selectId + ' option[name="' + ma + '"]')
                || document.querySelector('#' + selectId + ' option[data-ma="' + ma + '"]');
            if (opt) return opt.value;
            // Fallback: tìm option có TEXT khớp MA (không nên nhưng safe)
            var all = document.querySelectorAll('#' + selectId + ' option');
            for (var i = 0; i < all.length; i++) {
                if ((all[i].getAttribute('name') || '') === ma) return all[i].value;
            }
            return '';
        };
        var _setDrop = function () {
            var gt = person.gioiTinh || _pickIdByMa('dropGioiTinh', person.gioiTinhMa);
            var dt = person.danToc || _pickIdByMa('dropDanToc', person.danTocMa);
            var tg = person.tonGiao || _pickIdByMa('dropTonGiao', person.tonGiaoMa);
            var qt = person.quocTich || _pickIdByMa('dropQuocTich', person.quocTichMa);
            if (gt) { $('#dropGioiTinh').val(gt).trigger('change'); }
            if (dt) { $('#dropDanToc').val(dt).trigger('change'); }
            if (tg) { $('#dropTonGiao').val(tg).trigger('change'); }
            if (qt) { $('#dropQuocTich').val(qt).trigger('change'); }
        };
        _setDrop();
        setTimeout(_setDrop, 500);
        setTimeout(_setDrop, 1500);
        if (typeof dx._loadXHD_Section === 'function') dx._loadXHD_Section(person.id);
        if (typeof dx._loadTabInfoExtras === 'function') dx._loadTabInfoExtras(person.id);
    };
    zeNoLog('[ZE-Inject] openEditByPerson patched');
}
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._loadXHD_Section) {
    DeXuatHoSo.prototype._loadXHD_Section = function (personId) {
        var dx = this;
        var arrClear = ["ddlKQ_HD_DoiTuong", "txtKQ_HD_NguoiMua", "txtKQ_HD_TenDonVi", "txtKQ_HD_MST",
            "txtKQ_HD_MaQHNS", "txtKQ_HD_SDT", "txtKQ_HD_DiaChi", "txtKQ_HD_Email",
            "ddlKQ_HD_HinhThucTT", "txtKQ_HD_NganHang", "txtKQ_HD_SoTK", "txtKQ_HD_ChuTK", "txtKQ_HD_GhiChu"];
        edu.util.resetValByArrId(arrClear);
        if (!dx._xhdDMDLLoaded) {
            edu.system.loadToCombo_DanhMucDuLieu("TS.DOITUONGHOADON", "ddlKQ_HD_DoiTuong");
            edu.system.loadToCombo_DanhMucDuLieu("PERSON_BANK_ACCOUNT.ACCOUNT_TYPE_CODE", "ddlKQ_HD_HinhThucTT");
            dx._xhdDMDLLoaded = true;
        }
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) return;
                var list = (data.Data || []).filter(function (i) {
                    return i.PERSON_ID == personId && (i.IS_ACTIVE === undefined || i.IS_ACTIVE == 1);
                });
                if (!list.length) return;
                var b = list.find(function (i) { return i.IS_PRIMARY == 1; }) || list[0];
                dx._currentBankId = b.ID || '';
                // Bank ACCOUNT_TYPE_CODE là MA — cần tra ID từ option[name=MA] để select đúng
                var _setBank = function () {
                    var typeId = '';
                    var opt = document.querySelector('#ddlKQ_HD_HinhThucTT option[name="' + b.ACCOUNT_TYPE_CODE + '"]');
                    if (opt) typeId = opt.value;
                    if (typeId) { $('#ddlKQ_HD_HinhThucTT').val(typeId).trigger('change'); }
                    edu.util.viewValById("txtKQ_HD_NganHang", b.BANK_NAME);
                    edu.util.viewValById("txtKQ_HD_SoTK", b.ACCOUNT_NUMBER);
                    edu.util.viewValById("txtKQ_HD_ChuTK", b.ACCOUNT_NAME);
                    edu.util.viewValById("txtKQ_HD_GhiChu", b.NOTE);
                };
                _setBank();
                setTimeout(_setBank, 500);
                setTimeout(_setBank, 1500);
            },
            error: function () { },
            type: 'POST',
            action: 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP',
            contentType: true,
            data: {
                'action': 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP',
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Bank_Account',
                'iM': edu.system.iM, 'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '', 'strNguoiThucHien_Id': edu.system.userId,
                'strPerson_Id': personId
            },
            fakedb: []
        }, false, false, false, null);

        // Auto-fill XHD chỉ Email + SĐT từ contact cache (KHÔNG fill Họ tên người mua — có thể là cơ quan)
        setTimeout(function () {
            (dx.dtLienHe || []).forEach(function (item) {
                var name = ((item.CONTACT_TYPE_CODE_NAME || item.CONTACT_TYPE_NAME || '') + '').toLowerCase();
                var ma = ((item.CONTACT_TYPE_CODE_MA || item.MA || '') + '').toUpperCase();
                var val = item.CONTACT_VALUE || item.VALUE || '';
                if (!val) return;
                if ((ma === 'EMAIL' || name.indexOf('mail') > -1) && !$('#txtKQ_HD_Email').val()) $('#txtKQ_HD_Email').val(val);
                else if ((ma === 'PHONE' || ma === 'MOBILE' || name.indexOf('điện thoại') > -1 || name.indexOf('phone') > -1) && !$('#txtKQ_HD_SDT').val()) $('#txtKQ_HD_SDT').val(val);
            });
        }, 1000);

        // Load PersonInvoice từ PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo (2026-08-24)
        // TODO: sếp/A xác nhận action code encoded cho endpoint này, hiện dùng literal — nếu BE 404, sếp báo em code chính xác
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success || !data.Data || !data.Data.length) return;
                // ORDER BY IS_CURRENT DESC → record đầu là hiện hành
                var inv = data.Data[0];
                dx._currentInvoiceId = inv.ID || '';
                var _setInv = function () {
                    // BUYER_TYPE_LOAI là ID (DM Loại đối tượng) → set trực tiếp
                    if (inv.BUYER_TYPE_LOAI) { $('#ddlKQ_HD_DoiTuong').val(inv.BUYER_TYPE_LOAI).trigger('change'); }
                    if (inv.BUYER_NAME_TENNM) $('#txtKQ_HD_TenDonVi').val(inv.BUYER_NAME_TENNM);
                    if (inv.BUYER_ADDR_DIACHI) $('#txtKQ_HD_DiaChi').val(inv.BUYER_ADDR_DIACHI);
                    if (inv.BUYER_TAX_MST) $('#txtKQ_HD_MST').val(inv.BUYER_TAX_MST);
                    if (inv.BUYER_BUDGET_MAQHNS) $('#txtKQ_HD_MaQHNS').val(inv.BUYER_BUDGET_MAQHNS);
                    if (inv.BUYER_EMAIL) $('#txtKQ_HD_Email').val(inv.BUYER_EMAIL);
                    if (inv.BUYER_PHONE_SDT) $('#txtKQ_HD_SDT').val(inv.BUYER_PHONE_SDT);
                };
                _setInv();
                setTimeout(_setInv, 500);
                setTimeout(_setInv, 1500);
            },
            error: function (er) { console.warn('[ZE] LayDS_PersonInvoiceInfo error:', er); },
            type: 'POST',
            action: 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
            contentType: true,
            data: {
                'action': 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    };
}
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._loadTabInfoExtras) {
    DeXuatHoSo.prototype._loadTabInfoExtras = function (personId) {
        var dx = this;
        if (!dx._infoDMDLLoaded) {
            try {
                edu.system.loadToCombo_DanhMucDuLieu("CHUN.CHLU", "dropQuocTich");
                edu.system.loadToCombo_DanhMucDuLieu("NS.DATO", "dropDanToc");
                edu.system.loadToCombo_DanhMucDuLieu("NS.TOGI", "dropTonGiao");
            } catch (e) { console.warn('[TabInfo] loadDMDL error', e); }
            dx._infoDMDLLoaded = true;
        }
        if (!dx._cascadeInited && edu.extend && typeof edu.extend.genDropTinhThanh === 'function') {
            try {
                edu.extend.genDropTinhThanh('dropNS_Tinh', 'dropNS_Huyen', 'dropNS_Xa');
                edu.extend.genDropTinhThanh('dropHK_Tinh', 'dropHK_Huyen', 'dropHK_Xa');
            } catch (e) { console.warn('[TabInfo] genDropTinhThanh error', e); }
            dx._cascadeInited = true;
        }
        var arrClear = [
            "dropQuocTich", "dropDanToc", "dropTonGiao", "txtEmailCaNhan", "txtDienThoai",
            "dropNS_Tinh", "dropNS_Huyen", "dropNS_Xa", "txtNS_ChiTiet",
            "txtCCCD_So", "txtCCCD_NgayCap", "txtCCCD_NoiCap",
            "dropHK_Tinh", "dropHK_Huyen", "dropHK_Xa", "txtHK_SoNha"
        ];
        if (edu.util && edu.util.resetValByArrId) edu.util.resetValByArrId(arrClear);
        setTimeout(function () {
            var strip = function (s) { return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase(); };
            (dx.dtLienHe || []).forEach(function (item) {
                var val = item.CONTACT_VALUE || item.VALUE || '';
                var text = strip(item.CONTACT_TYPE_CODE_MA || item.MA) + '|' + strip(item.CONTACT_TYPE_CODE_NAME || item.CONTACT_TYPE_NAME);
                var isEmail = /EMAIL|E-MAIL|\bMAIL\b|THU DIEN TU/.test(text);
                var isPhone = /PHONE|MOBILE|\bSDT\b|\bDT\b|\bTEL\b|DIEN THOAI|SO DT/.test(text);
                if (!isEmail && !isPhone) {
                    if (val.indexOf('@') > -1) isEmail = true;
                    else if (/^[\d\s\+\-\(\)\.]+$/.test(val) && val.replace(/\D/g, '').length >= 6) isPhone = true;
                }
                if (isEmail) edu.util.viewValById('txtEmailCaNhan', val);
                else if (isPhone) edu.util.viewValById('txtDienThoai', val);
            });
            (dx.dtDinhDanh || []).forEach(function (item) {
                var typeName = ((item.IDENTIFIER_TYPE_CODE_NAME || item.IDENTIFIER_TYPE_NAME || '') + '').toUpperCase();
                var typeMa = ((item.IDENTIFIER_TYPE_CODE_MA || item.MA || '') + '').toUpperCase();
                if (typeMa === 'CCCD' || typeName.indexOf('CCCD') > -1 || typeName.indexOf('CĂN CƯỚC') > -1) {
                    edu.util.viewValById('txtCCCD_So', item.IDENTIFIER_NO || '');
                    edu.util.viewValById('txtCCCD_NgayCap', item.ISSUE_DATE || '');
                    edu.util.viewValById('txtCCCD_NoiCap', item.ISSUE_PLACE || '');
                }
            });
        }, 800);
    };
}

/*==============================================================================
== NƠI SINH / HỘ KHẨU — NẠP & GHI THẬT XUỐNG BẢNG PERSON_ADDRESS  (2026-09-11)
==
== Bug: modal #zoneEdit có đủ 8 ô địa chỉ (dropNS_Tinh/Huyen/Xa + txtNS_ChiTiet,
== dropHK_Tinh/Huyen/Xa + txtHK_SoNha), có cascade Tỉnh→Huyện→Xã, _loadTabInfoExtras còn xoá trắng
== chúng mỗi lần mở — nhưng KHÔNG có chỗ nào đọc lên từ PERSON_ADDRESS và cũng
== KHÔNG có chỗ nào ghi xuống. Nhập bao nhiêu cũng mất, mở lại luôn trắng.
==
== save_DiaChi của dexuathoso.js không dùng lại được: nó bám vào form con
== #tblDiaChi (dropLoaiDiaChi/dropTinh/dropPhuong/txtDiaChiChiTiet1...) với
== luồng "thêm từng địa chỉ một", trong khi modal này là 2 cụm cố định NS/HK.
== Vì vậy port nguyên logic đã chạy ổn bên kehoachtuyensinhnew.js, DÙNG LẠI
== đúng 3 action string của dexuathoso.js (Ins/Upd) — không tự bịa mã.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._zeAddrHooked) {
    DeXuatHoSo.prototype._zeAddrHooked = true;

    // Lấy nguyên từ dexuathoso.js save_DiaChi/getList_DiaChi — action string chính là
    // khoá XOR để BE giải mã, sai 1 ký tự là hỏng nên tuyệt đối không sửa/đoán.
    var _ZE_ADDR_GET = 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4AJSUzJDIy';
    var _ZE_ADDR_INS = 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4AJSUzJDIy';
    var _ZE_ADDR_UPD = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4AJSUzJDIy';

    // 2 cụm địa chỉ của modal. NS = nơi sinh, HK = hộ khẩu thường trú.
    var _ZE_O = {
        NS: { tinh: 'dropNS_Tinh', huyen: 'dropNS_Huyen', xa: 'dropNS_Xa', line: 'txtNS_ChiTiet' },
        HK: { tinh: 'dropHK_Tinh', huyen: 'dropHK_Huyen', xa: 'dropHK_Xa', line: 'txtHK_SoNha' }
    };

    var _zeStrip = function (s) {
        return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D').toUpperCase();
    };

    /*------------------------------------------
    -- Danh mục Loại địa chỉ. PERSON_ADDRESS.ADDRESS_TYPE_CODE lưu ID (GUID) của
    -- danh mục chứ không phải mã chữ, nên bắt buộc có bảng này mới biết đâu là
    -- Nơi sinh, đâu là Hộ khẩu. Nạp 1 lần rồi cache trên instance.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeEnsureAddrTypeDM = function (cb) {
        var dx = this;
        if (dx.dtDM_AddressType && dx.dtDM_AddressType.length) { if (cb) cb(); return; }
        edu.system.makeRequest({
            success: function (data) {
                dx.dtDM_AddressType = (data && data.Success && data.Data) || [];
                if (cb) cb();
            },
            error: function () { dx.dtDM_AddressType = []; if (cb) cb(); },
            type: 'GET',
            contentType: true,
            action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
            data: {
                'strMaBangDanhMuc': 'PERSON_ADDRESS.ADDRESS_TYPE_CODE',
                'strTieuChiSapXep': '',
                'dTrangThai': 1
            },
            fakedb: []
        }, false, false, false, null);
    };

    /*------------------------------------------
    -- kind: 'NS' | 'HK' → ID danh mục tương ứng.
    -- Trả '' nếu danh mục chưa khai báo mục đó (khi đó không ghi xuống được).
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeAddrTypeId = function (kind) {
        var dt = this.dtDM_AddressType || [];
        if (!dt.length) return '';
        var rx = (kind === 'NS') ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
        var found = dt.filter(function (e) {
            return rx.test(_zeStrip(e.TEN) + ' ' + _zeStrip(e.MA));
        })[0];
        return found ? (found.ID || '') : '';
    };

    DeXuatHoSo.prototype._zeGetAddrList = function (personId, cb) {
        if (!edu.util.checkValue(personId)) { cb([]); return; }
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                // Bỏ bản ghi đã xoá mềm, y như genTable_DiaChi của dexuathoso.js
                cb(rows.filter(function (r) {
                    return r && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1);
                }));
            },
            error: function () { cb([]); },
            type: 'POST',
            contentType: true,
            action: _ZE_ADDR_GET,
            data: {
                'action': _ZE_ADDR_GET,
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Address',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strNguoiThucHien_Id': edu.system.userId
            },
            fakedb: []
        }, false, false, false, null);
    };

    /*------------------------------------------
    -- Đổ 1 cụm địa chỉ (Tỉnh → Huyện → Xã → chi tiết) vào form.
    -- districtId: lấy thẳng từ DISTRICT_ID nếu API trả. Không có mới tra ngược
    -- Huyện từ Xã (edu.extend.dtTinhThanh: mảng phẳng {ID, TEN, QUANHECHA_ID}) —
    -- nếu chỉ tra ngược thì hồ sơ chọn Huyện mà bỏ trống Xã sẽ mất Huyện khi mở lại.
    -- Tự retry chờ cache tỉnh/thành (genDropTinhThanh nạp bất đồng bộ).
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeFillDiaChi = function (o, provinceId, districtId, wardId, chiTiet, _try) {
        var dx = this;
        if (chiTiet) edu.util.viewValById(o.line, chiTiet);
        if (!provinceId && !districtId && !wardId) return;
        var dt = (edu.extend && edu.extend.dtTinhThanh) || [];
        if (!dt.length) {                       // cache chưa sẵn sàng → chờ rồi thử lại
            _try = (_try || 0) + 1;
            if (_try > 25) return;
            setTimeout(function () {
                dx._zeFillDiaChi(o, provinceId, districtId, wardId, '', _try);
            }, 200);
            return;
        }
        var find = function (id) { return dt.filter(function (e) { return e.ID === id; })[0]; };
        var xa = wardId ? find(wardId) : null;
        var huyenId = districtId || (xa ? xa.QUANHECHA_ID : '');
        var tinhId = provinceId || (huyenId ? ((find(huyenId) || {}).QUANHECHA_ID || '') : '');
        var fill = function (elId, list, defVal, title) {
            edu.system.loadToCombo_data({
                data: list,
                renderInfor: { id: 'ID', parentId: '', name: 'TEN', code: '', default_val: defVal },
                renderPlace: [elId], type: '', title: title
            });
        };
        if (tinhId) {
            $('#' + o.tinh).val(tinhId).trigger('change');
            $('#' + o.tinh).prop('disabled', false);
        }
        // Tỉnh 2 cấp (sau sáp nhập): Xã treo thẳng vào Tỉnh, không có cấp Huyện ở giữa
        // → cha của Xã chính là Tỉnh. Nếu vẫn coi nó là Huyện thì cả 2 ô đều trống.
        var haiCap = !!(huyenId && tinhId && huyenId === tinhId);
        if (haiCap) $('#' + o.huyen).attr('data-2cap', '1').prop('disabled', false);
        if (huyenId && !haiCap) {
            fill(o.huyen, dt.filter(function (e) { return e.QUANHECHA_ID === tinhId; }),
                huyenId, 'Chọn quận/huyện');
            $('#' + o.huyen).prop('disabled', false);
        }
        // Luôn đổ danh sách Xã khi đã biết cấp cha — kể cả hồ sơ chưa chọn Xã. Nếu không,
        // ô Xã đứng nguyên ở "Vui lòng chọn Quận/Huyện trước" và không bổ sung được.
        var chaCuaXa = haiCap ? tinhId : huyenId;
        if (chaCuaXa) {
            fill(o.xa, dt.filter(function (e) { return e.QUANHECHA_ID === chaCuaXa; }),
                wardId || '', 'Chọn phường/xã');
            $('#' + o.xa).prop('disabled', false);
        }
    };

    /*------------------------------------------
    -- Nghị định bỏ cấp huyện: nhiều tỉnh giờ chỉ còn 2 cấp Tỉnh → Xã.
    -- Với các tỉnh đó genDropTinhThanh vẫn đổ con của Tỉnh vào ô "Quận/Huyện" —
    -- tức ô Quận/Huyện đang chứa danh sách XÃ, còn ô Xã rỗng vĩnh viễn, lưu ra
    -- WARD_ID rỗng → "nhập vào lưu xong mất xã".
    -- Nhận diện bằng chính dữ liệu, không hardcode danh sách tỉnh: con của Tỉnh
    -- KHÔNG có cháu thì tỉnh đó 2 cấp. Tỉnh còn 3 cấp chạy y như cũ.
    -- KHÔNG khoá ô Quận/Huyện: dữ liệu đang lẫn cả tỉnh cũ lẫn tỉnh mới, người
    -- dùng chọn được tới đâu thì lưu tới đó.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeApply2Cap = function (o) {
        var dt = (edu.extend && edu.extend.dtTinhThanh) || [];
        var $huyen = $('#' + o.huyen);
        var tinhId = $('#' + o.tinh).val() || '';
        if (!tinhId || !dt.length) { $huyen.removeAttr('data-2cap'); return; }
        var con = dt.filter(function (e) { return e.QUANHECHA_ID === tinhId; });
        if (!con.length) { $huyen.removeAttr('data-2cap'); return; }
        var coChau = con.some(function (c) {
            return dt.some(function (e) { return e.QUANHECHA_ID === c.ID; });
        });
        if (coChau) { $huyen.removeAttr('data-2cap'); return; }   // tỉnh 3 cấp → giữ nguyên

        $huyen.attr('data-2cap', '1');
        // Giữ lựa chọn hiện có nếu vẫn hợp lệ (tránh xoá khi hàm chạy lại ở mốc 250ms)
        var dangChon = $('#' + o.xa).val() || '';
        var conHopLe = con.some(function (c) { return c.ID === dangChon; });
        edu.system.loadToCombo_data({
            data: con,
            renderInfor: { id: 'ID', parentId: '', name: 'TEN', code: '', default_val: conHopLe ? dangChon : '' },
            renderPlace: [o.xa], type: '', title: 'Chọn phường/xã'
        });
        $('#' + o.xa).prop('disabled', false);
    };

    /*------------------------------------------
    -- Đánh dấu người dùng ĐÃ TỰ TAY đụng vào cụm địa chỉ.
    -- Cần để phân biệt 2 trường hợp ô trống trông y hệt nhau lúc lưu:
    --   a) form chưa nạp kịp     → phải GIỮ giá trị cũ, không thì mất dữ liệu
    --   b) user cố ý xoá lựa chọn → phải GHI RỖNG, không thì xoá mãi không được
    -- Các ô này là <select> thường (không select2) nên phân biệt bằng originalEvent:
    -- .trigger('change') trong code không có originalEvent, người dùng bấm chọn thì có.
    -- Vẫn bắt thêm sự kiện select2 phòng khi về sau có gắn select2 vào modal.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeBindAddrTouched = function () {
        var dx = this;
        var danhDau = function () { $(this).attr('data-user-touched', '1'); };
        Object.keys(_ZE_O).forEach(function (kind) {
            var o = _ZE_O[kind];
            // Người dùng vừa đụng cụm nào thì lấy cụm đó điền sang địa chỉ hoá đơn.
            // setTimeout 0 để chờ cascade đổ xong Huyện/Xã rồi mới ghép chuỗi.
            var dienSangHD = function () {
                setTimeout(function () { dx._zeAutoFillHoaDon(kind); }, 0);
            };
            ['tinh', 'huyen', 'xa'].forEach(function (cap) {
                $('#' + o[cap]).off('.zetouch')
                    .on('change.zetouch', function (e) {
                        if (!e || !e.originalEvent) return;   // code tự set, không phải user
                        danhDau.call(this); dienSangHD();
                    })
                    .on('select2:select.zetouch select2:clear.zetouch select2:unselect.zetouch',
                        function () { danhDau.call(this); dienSangHD(); });
            });
            $('#' + o.line).off('.zetouch').on('input.zetouch',
                function () { danhDau.call(this); dienSangHD(); });
            // genDropTinhThanh đổ option ở handler khác → đợi nó xong rồi mới xét tỉnh
            // 2 cấp. Chạy ở 2 mốc cho chắc vì nguồn data có thể async.
            $('#' + o.tinh).off('.zecap').on('change.zecap', function () {
                setTimeout(function () { dx._zeApply2Cap(o); }, 0);
                setTimeout(function () { dx._zeApply2Cap(o); }, 250);
            });
        });
        // Gõ vào ô địa chỉ hoá đơn = tự quyết → từ đó không tự điền đè lên nữa
        $('#txtKQ_HD_DiaChi').off('.zetouch').on('input.zetouch', danhDau);
    };

    DeXuatHoSo.prototype._zeClearAddrTouched = function () {
        var ids = [];
        Object.keys(_ZE_O).forEach(function (kind) {
            var o = _ZE_O[kind];
            ids.push('#' + o.tinh, '#' + o.huyen, '#' + o.xa, '#' + o.line);
        });
        ids.push('#txtKQ_HD_DiaChi');
        $(ids.join(',')).removeAttr('data-user-touched').removeAttr('data-ze-auto');
        $('#' + _ZE_O.NS.huyen + ',#' + _ZE_O.HK.huyen).removeAttr('data-2cap');
    };

    /*------------------------------------------
    -- Tự điền "Địa chỉ trên hoá đơn" theo cụm địa chỉ vừa chọn, cho đỡ gõ lại.
    -- KHÔNG đè khi: người dùng đã tự sửa ô đó, hoặc ô đang mang giá trị lấy từ DB
    -- (hoá đơn có thể xuất cho đơn vị ở địa chỉ khác nên không được ép đồng bộ).
    -- Giá trị do chính hàm này điền thì được phép cập nhật tiếp.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeAutoFillHoaDon = function (kind) {
        var dx = this;
        var $hd = $('#txtKQ_HD_DiaChi');
        if (!$hd.length || $hd.attr('data-user-touched')) return;
        if (edu.util.checkValue($hd.val()) && !$hd.attr('data-ze-auto')) return;  // giá trị từ DB
        var b = (dx._zeCollectAddrBlocks() || []).filter(function (x) { return x.kind === kind; })[0];
        if (!b || !edu.util.checkValue(b.full)) return;
        edu.util.viewValById('txtKQ_HD_DiaChi', b.full);
        $hd.attr('data-ze-auto', '1');
    };

    /*------------------------------------------
    -- Chụp giá trị 2 cụm địa chỉ từ form NGAY LẬP TỨC (đồng bộ).
    -- Bắt buộc gọi TRƯỚC khi luồng lưu gốc chạy, vì hàm ghi chạy async — lúc
    -- callback về thì form có thể đã bị reset/đóng, đọc ra sẽ toàn rỗng.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeCollectAddrBlocks = function () {
        var g = function (id) { return edu.system.getValById(id) || ''; };
        // Lấy tên option ĐANG CHỌN THẬT. Bám vào value rỗng để nhận ra option
        // placeholder, không so khớp chữ: bỏ dấu thì "Chơn Thành" cũng thành
        // "Chon..." và sẽ bị loại nhầm cùng với "-- Chọn --".
        var txt = function (id, val) {
            return val ? ($('#' + id + ' option:selected').text() || '').trim() : '';
        };
        var cham = function (id) { return !!$('#' + id).attr('data-user-touched'); };
        var build = function (kind) {
            var o = _ZE_O[kind];
            var b = {
                kind: kind,
                tinh: g(o.tinh), huyen: g(o.huyen), xa: g(o.xa), line: g(o.line)
            };
            // Chạm vào bất kỳ ô nào của cụm = user đang chủ động sửa cụm này. Gom chung
            // vì xoá Tỉnh sẽ khiến cascade tự dọn Huyện/Xã bằng code — 2 ô đó không được
            // đánh dấu nhưng vẫn phải coi là user cố ý xoá.
            b.daCham = cham(o.tinh) || cham(o.huyen) || cham(o.xa);
            b.chamLine = cham(o.line);
            b.full = [b.line, txt(o.xa, b.xa), txt(o.huyen, b.huyen), txt(o.tinh, b.tinh)]
                .filter(function (x) { return x; }).join(', ');
            return b;
        };
        // Giữ cụm có nhập, HOẶC cụm user vừa xoá sạch (phải gửi đi để ghi rỗng).
        // Cụm vừa trống vừa không ai đụng vào thì bỏ qua, không chạm bản ghi cũ.
        return [build('NS'), build('HK')].filter(function (b) {
            return b.tinh || b.xa || b.line || b.daCham || b.chamLine;
        });
    };

    /*------------------------------------------
    -- Ghi 2 cụm địa chỉ xuống PERSON_ADDRESS.
    -- Đã có bản ghi cùng loại → Upd_Person_Address, chưa có → Ins_Person_Address.
    -- blocks: kết quả _zeCollectAddrBlocks() chụp trước đó.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeSaveAddress = function (personId, blocks) {
        var dx = this;
        blocks = blocks || [];
        if (!edu.util.checkValue(personId) || !blocks.length) return;
        dx._zeEnsureAddrTypeDM(function () {
            var thieu = blocks.filter(function (b) { return !dx._zeAddrTypeId(b.kind); })
                .map(function (b) { return b.kind === 'NS' ? 'Nơi sinh' : 'Hộ khẩu thường trú'; });
            if (thieu.length) {
                console.warn('[ZE Address] Danh mục "Loại địa chỉ" '
                    + '(PERSON_ADDRESS.ADDRESS_TYPE_CODE) chưa khai báo: ' + thieu.join(', ')
                    + ' → không ghi xuống được.');
            }
            dx._zeGetAddrList(personId, function (rows) {
                blocks.forEach(function (b) {
                    var typeId = dx._zeAddrTypeId(b.kind);
                    if (!typeId) return;
                    var old = rows.filter(function (r) { return r.ADDRESS_TYPE_CODE === typeId; })[0];
                    var isUpd = !!(old && old.ID);
                    var id = ((isUpd ? old.ID : edu.util.uuid()) + '').toUpperCase();
                    // Chống ghi đè rỗng. Cụm địa chỉ được giữ lại khi CHỈ CẦN tỉnh hoặc số
                    // nhà có giá trị (xem _zeCollectAddrBlocks), nên nếu form chưa kịp nạp
                    // Huyện/Xã mà user bấm Lưu thì ghi thẳng b.huyen/b.xa xuống sẽ XOÁ
                    // TRẮNG dữ liệu đang có. Ô nào trống thì giữ nguyên giá trị cũ.
                    var giu = function (moi, cu, daCham) {
                        if (edu.util.checkValue(moi)) return moi;
                        if (daCham) return '';              // user chủ động xoá → ghi rỗng
                        return isUpd ? (cu || '') : '';     // form chưa nạp → giữ nguyên
                    };
                    var payload = {
                        'action': isUpd ? _ZE_ADDR_UPD : _ZE_ADDR_INS,
                        'func': 'PKG_CORE_HOSONHANSU_06.' + (isUpd ? 'Upd_Person_Address' : 'Ins_Person_Address'),
                        'iM': edu.system.iM,
                        'Id': id,
                        'strId': id,
                        'strChucNang_Id': edu.system.strChucNang_Id,
                        'strVaiTro_Id': '',
                        'strPerson_Id': personId,
                        'strAddress_Type_Code': typeId,
                        'strAddress_Status_Code': '',
                        'strCountry_Id': '',
                        'strProvince_Id': giu(b.tinh, old && old.PROVINCE_ID, b.daCham),
                        'strDistrict_Id': giu(b.huyen, old && old.DISTRICT_ID, b.daCham),
                        'strWard_Id': giu(b.xa, old && old.WARD_ID, b.daCham),
                        'strAddress_Line1': giu(b.line, old && old.ADDRESS_LINE1, b.chamLine),
                        'strAddress_Line2': '',
                        'strFull_Address': giu(b.full, old && old.FULL_ADDRESS, b.daCham || b.chamLine),
                        'strPostal_Code': '',
                        // Hộ khẩu thường trú là địa chỉ chính; d* là NUMBER nên gửi số, không gửi ''
                        'dIs_Primary': (b.kind === 'HK') ? 1 : 0,
                        'dIs_Verified': 0,
                        'dIs_Active': 1,
                        'strEffective_From': '',
                        'strEffective_To': '',
                        'strNote': '',
                        'strNguoiThucHien_Id': edu.system.userId
                    };
                    edu.system.makeRequest({
                        success: function (data) {
                            if (data && !data.Success) console.warn('[ZE Address] fail:', data.Message);
                        },
                        error: function (er) { console.warn('[ZE Address] err:', er); },
                        type: 'POST',
                        contentType: true,
                        action: payload.action,
                        data: payload,
                        fakedb: []
                    }, false, false, false, null);
                });
            });
        });
    };

    /*------------------------------------------
    -- Nạp 2 cụm địa chỉ lên form khi mở modal.
    -- Get_Person_Address chỉ chắc chắn trả PROVINCE_ID + WARD_ID; DISTRICT_ID có
    -- thì dùng, không có mới tra ngược từ Xã (xem _zeFillDiaChi).
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeLoadAddress = function (personId) {
        var dx = this;
        if (!edu.util.checkValue(personId)) return;
        dx._zeEnsureAddrTypeDM(function () {
            dx._zeGetAddrList(personId, function (rows) {
                if (!rows.length) return;
                var pick = function (kind) {
                    var typeId = dx._zeAddrTypeId(kind);
                    var found = typeId && rows.filter(function (it) {
                        return it.ADDRESS_TYPE_CODE === typeId;
                    })[0];
                    if (found) return found;
                    // Danh mục chưa có mục tương ứng → đoán theo tên loại trả kèm bản ghi
                    var rx = (kind === 'NS') ? /NOI SINH|BIRTH/ : /HO KHAU|THUONG TRU|PERMANENT/;
                    return rows.filter(function (it) {
                        return rx.test(_zeStrip(it.ADDRESS_TYPE_CODE_NAME || it.ADDRESS_TYPE_NAME || ''));
                    })[0];
                };
                var noiSinh = pick('NS');
                var hoKhau = pick('HK');
                // Không phân loại được mà chỉ có 1 dòng → coi là hộ khẩu thường trú
                if (!noiSinh && !hoKhau && rows.length === 1) hoKhau = rows[0];
                var huyenCua = function (r) {
                    return r.DISTRICT_ID || r.QUANHUYEN_ID || r.HUYEN_ID || '';
                };
                if (noiSinh) {
                    dx._zeFillDiaChi(_ZE_O.NS, noiSinh.PROVINCE_ID, huyenCua(noiSinh),
                        noiSinh.WARD_ID, noiSinh.ADDRESS_LINE1);
                }
                if (hoKhau) {
                    dx._zeFillDiaChi(_ZE_O.HK, hoKhau.PROVINCE_ID, huyenCua(hoKhau),
                        hoKhau.WARD_ID, hoKhau.ADDRESS_LINE1);
                }
            });
        });
    };

    // --- Móc vào luồng mở modal: _loadTabInfoExtras xoá trắng 8 ô địa chỉ (đồng bộ,
    // --- ngay đầu hàm) nên nạp lại NGAY SAU khi gọi bản gốc là an toàn.
    if (DeXuatHoSo.prototype._loadTabInfoExtras) {
        var _origLoadTabInfo = DeXuatHoSo.prototype._loadTabInfoExtras;
        DeXuatHoSo.prototype._loadTabInfoExtras = function (personId) {
            var dx = this;
            _origLoadTabInfo.call(dx, personId);
            dx._zeClearAddrTouched();
            dx._zeBindAddrTouched();
            dx._zeLoadAddress(personId);
        };
    }

    // --- Móc vào luồng Lưu: chụp form ĐỒNG BỘ trước khi bản gốc chạy, rồi mới ghi.
    if (DeXuatHoSo.prototype.save_DeXuatHoSo && !DeXuatHoSo.prototype._addrChainHooked) {
        DeXuatHoSo.prototype._addrChainHooked = true;
        var _prevSaveDX = DeXuatHoSo.prototype.save_DeXuatHoSo;
        DeXuatHoSo.prototype.save_DeXuatHoSo = function () {
            var dx = this;
            // try/catch: chụp form phải chạy TRƯỚC bản gốc, nên nếu ở đây ném lỗi thì
            // cả lần lưu chết câm. Địa chỉ hỏng thì bỏ địa chỉ, không được kéo theo
            // phần lưu chính.
            var blocks = null;
            try { blocks = dx._zeCollectAddrBlocks(); } catch (e) { console.warn('[ZE Address] collect err:', e); }
            var personId = dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
            _prevSaveDX.call(dx);
            if (!blocks || !blocks.length) return;
            setTimeout(function () {
                try {
                    dx._zeSaveAddress(dx.strDeXuatHoSo_Id || dx._lockedPersonId || personId, blocks);
                } catch (e) { console.warn('[ZE Address] save err:', e); }
            }, 300);
        };
    }
}

/*==============================================================================
== TAB XUẤT HOÁ ĐƠN — 3 lỗi lưu, vá cho khớp với kehoachtuyensinhnew.js
== (2026-09-11)
==
== 1) "Họ tên người mua hàng" (txtKQ_HD_NguoiMua) được đọc lên để xét hasData
==    rồi VỨT ĐI — payload Them_/Sua_PersonInvoiceInfo không có param nào chứa
==    nó. Bảng PERSON_INVOICE_INFO chỉ có BUYER_NAME nên bên tuyển sinh gửi
==    "strBuyer_Name = tên đơn vị HOẶC họ tên người mua"; làm y như vậy.
==
== 2) Cụm "Thông tin thanh toán" (5 ô ngân hàng) CHỈ được nạp lên bằng
==    Get_Person_Bank_Account, không có chỗ nào ghi xuống → nhập xong mất trắng.
==
== 3) _currentInvoiceId / _currentBankId không gắn với hồ sơ nào. Mở hồ sơ A
==    (đã có hoá đơn) rồi chuyển sang hồ sơ B (chưa có) thì 2 biến này VẪN GIỮ
==    id của A → bấm Lưu chạy Sua_PersonInvoiceInfo và GHI ĐÈ dữ liệu của B lên
==    bản ghi của A. Xoá sạch mỗi lần mở hồ sơ khác là hết.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._zeXhdHooked) {
    DeXuatHoSo.prototype._zeXhdHooked = true;

    // Lấy nguyên của dexuathoso.js (_loadXHD_Section + save_TaiKhoanNH) — không tự bịa
    var _ZE_BANK_GET = 'NS_HoSoNhanSu6_MH/BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP';
    var _ZE_BANK_INS = 'NS_HoSoNhanSu6_MH/CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP';
    var _ZE_BANK_UPD = 'NS_HoSoNhanSu6_MH/FDElHhEkMzIuLx4DIC8qHgAiIi40LzUP';

    /*------------------------------------------
    -- (1) Bridge "Họ tên người mua" sang ô Tên đơn vị ngay trước khi bản gốc đọc
    -- form, rồi trả lại nguyên trạng. Cùng kiểu với _bridgeLienHeToShadow /
    -- _bridgeCccdToShadow đang dùng trong file này — giữ được bản gốc, sếp cập
    -- nhật dexuathoso.js sau này cũng không đụng độ.
    -------------------------------------------*/
    if (DeXuatHoSo.prototype.save_PersonInvoice) {
        var _origSaveInv = DeXuatHoSo.prototype.save_PersonInvoice;
        DeXuatHoSo.prototype.save_PersonInvoice = function () {
            // (1a) Mượn ô Tên đơn vị để gửi Họ tên người mua (xem chú thích ở trên)
            var $don = $('#txtKQ_HD_TenDonVi');
            var nguoiMua = (($('#txtKQ_HD_NguoiMua').val() || '') + '').trim();
            var cu = ($don.val() || '') + '';
            var daMuon = false;
            if (!cu.trim() && nguoiMua) { $don.val(nguoiMua); daMuon = true; }

            // (1b) GỠ BỎ 11/09/2026 — trước đây ở đây đổi giá trị "Đối tượng xuất hoá
            // đơn" từ ID danh mục sang mã chữ ("CA_NHAN"), và mặc định CA_NHAN khi bỏ
            // trống. SAI: kiểm tra thẳng trong DB cho thấy PERSON_INVOICE_INFO.
            // BUYER_TYPE_LOAI phải là ID DANH MỤC (GUID) — đúng như VALUE của option
            // mà bản gốc vẫn gửi. Bản vá đó đã đẻ ra một dòng rác mang 'CA_NHAN'.
            // Giữ nguyên giá trị người dùng chọn, không đổi, không mặc định gì cả.

            try { _origSaveInv.call(this); }
            finally { if (daMuon) $don.val(cu); }
        };
    }

    /*------------------------------------------
    -- Chiều ngược lại: DB lưu BUYER_TYPE_LOAI là MÃ CHỮ, nhưng bản gốc đổ lên bằng
    -- $('#ddlKQ_HD_DoiTuong').val(<mã>) — <select> không có option nào mang value đó
    -- nên ô luôn trắng, mở lại tưởng như chưa lưu. Tra mã → id rồi mới chọn.
    -- Chỉ điền khi ô đang trống nên không đè lên thao tác của người dùng.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeFixDoiTuongTuMa = function (maHoacId) {
        if (!edu.util.checkValue(maHoacId)) return;
        var dat = function () {
            var $d = $('#ddlKQ_HD_DoiTuong');
            if (!$d.length || $d.val()) return;
            var opt = document.querySelector('#ddlKQ_HD_DoiTuong option[name="' + maHoacId + '"]')
                || document.querySelector('#ddlKQ_HD_DoiTuong option[data-ma="' + maHoacId + '"]')
                || document.querySelector('#ddlKQ_HD_DoiTuong option[value="' + maHoacId + '"]');
            if (!opt) {
                // Danh mục ở đây không khai mã riêng — giá trị lưu xuống chính là chữ
                // hiển thị ("CA_NHAN"), nên phải dò thêm theo text của option.
                var ds = document.querySelectorAll('#ddlKQ_HD_DoiTuong option');
                for (var i = 0; i < ds.length; i++) {
                    if (((ds[i].textContent || '') + '').trim() === ((maHoacId || '') + '').trim()) { opt = ds[i]; break; }
                }
            }
            if (opt && opt.value) $d.val(opt.value).trigger('change');
        };
        dat();
        setTimeout(dat, 600);
        setTimeout(dat, 1600);
    };

    /*------------------------------------------
    -- (2) Chụp cụm Thanh toán khỏi form (đồng bộ) — phải gọi TRƯỚC luồng lưu gốc.
    -- Cả 5 ô đều trống → trả null để không tạo dòng ngân hàng rỗng, và cũng là
    -- cách tránh ghi đè khi form chưa kịp nạp xong.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeCollectBank = function () {
        var g = function (id) { return ((edu.system.getValById(id) || '') + '').trim(); };
        var b = {
            loai: g('ddlKQ_HD_HinhThucTT'),
            nganHang: g('txtKQ_HD_NganHang'),
            soTK: g('txtKQ_HD_SoTK'),
            chuTK: g('txtKQ_HD_ChuTK'),
            ghiChu: g('txtKQ_HD_GhiChu')
        };
        return (b.loai || b.nganHang || b.soTK || b.chuTK || b.ghiChu) ? b : null;
    };

    /*------------------------------------------
    -- Ghi cụm Thanh toán xuống PERSON_BANK_ACCOUNT.
    -- Đã có bản ghi (_currentBankId của ĐÚNG người này) → Upd, chưa có → Ins.
    -- Các cột không có ô nhập trên modal (chi nhánh, loại tiền, ngày hiệu lực...)
    -- giữ nguyên giá trị cũ, không ghi rỗng đè lên.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeSaveBank = function (personId, b) {
        var dx = this;
        if (!edu.util.checkValue(personId) || !b) return;
        var oldId = (dx._zeXhdPersonId === personId) ? (dx._currentBankId || '') : '';
        var old = (dx._zeBankRow && dx._zeXhdPersonId === personId) ? dx._zeBankRow : {};
        var isUpd = !!(oldId && (oldId + '').length === 32);
        var giu = function (v) { return edu.util.checkValue(v) ? v : ''; };
        var so = function (v, mac) {
            var n = Number(v);
            return (v === null || v === undefined || v === '' || isNaN(n)) ? mac : n;
        };
        var payload = {
            'action': isUpd ? _ZE_BANK_UPD : _ZE_BANK_INS,
            'func': 'PKG_CORE_HOSONHANSU_06.' + (isUpd ? 'Upd_Person_Bank_Account' : 'Ins_Person_Bank_Account'),
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strVaiTro_Id': '',
            'strPerson_Id': personId,
            'strAccount_Type_Code': b.loai,
            'strAccount_Status_Code': giu(old.ACCOUNT_STATUS_CODE),
            'strBank_Id': giu(old.BANK_ID),
            'strBank_Code': giu(old.BANK_CODE),
            'strBank_Name': b.nganHang,
            'strBranch_Id': giu(old.BRANCH_ID),
            'strBranch_Code': giu(old.BRANCH_CODE),
            'strBranch_Name': giu(old.BRANCH_NAME),
            'strAccount_Number': b.soTK,
            'strAccount_Name': b.chuTK,
            'strAccount_Currency_Code': giu(old.ACCOUNT_CURRENCY_CODE),
            // d* là NUMBER bên Oracle → luôn gửi số, không gửi chuỗi rỗng
            'dIs_Primary': so(old.IS_PRIMARY, 1),
            'dIs_Payroll_Default': so(old.IS_PAYROLL_DEFAULT, 0),
            'dIs_Verified': so(old.IS_VERIFIED, 0),
            'dIs_Active': 1,
            'strEffective_From': giu(old.EFFECTIVE_FROM),
            'strEffective_To': giu(old.EFFECTIVE_TO),
            'strNote': b.ghiChu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (isUpd) payload.strId = oldId;
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) { if (!isUpd && data.Id) dx._currentBankId = data.Id; }
                else console.warn('[ZE Bank] fail:', data && data.Message);
            },
            error: function (er) { console.warn('[ZE Bank] err:', er); },
            type: 'POST',
            contentType: true,
            action: payload.action,
            data: payload,
            fakedb: []
        }, false, false, false, null);
    };

    /*------------------------------------------
    -- Nạp lại cụm Thanh toán. Bản gốc đã đổ 4 ô text rồi, nhưng ô "Loại tài khoản"
    -- nó chỉ tra theo option[name=MA] — dữ liệu cũ lưu MA thì đúng, dữ liệu mới
    -- (ô này lưu ID danh mục như mọi dropdown khác) thì tra trượt, ô trống hoài.
    -- Ở đây tra cả MA lẫn ID, và chỉ điền khi ô đang trống nên không đè bản gốc.
    -- Tiện thể giữ lại nguyên bản ghi để lúc Upd không ghi rỗng lên các cột
    -- không có ô nhập trên modal.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeLoadBank = function (personId) {
        var dx = this;
        dx._zeBankRow = null;
        if (!edu.util.checkValue(personId)) return;
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                if (rows && rows.length === undefined) rows = [rows];
                var b = rows.filter(function (r) {
                    return r && r.PERSON_ID == personId && (r.IS_ACTIVE === undefined || r.IS_ACTIVE == 1);
                }).sort(function (x, y) {
                    return (y.IS_PRIMARY == 1 ? 1 : 0) - (x.IS_PRIMARY == 1 ? 1 : 0);
                })[0];
                if (!b) return;
                dx._zeBankRow = b;
                dx._currentBankId = b.ID || '';
                var datLoai = function () {
                    var $d = $('#ddlKQ_HD_HinhThucTT');
                    if (!$d.length || $d.val()) return;               // bản gốc đặt được rồi
                    var ma = b.ACCOUNT_TYPE_CODE;
                    if (!edu.util.checkValue(ma)) return;
                    var opt = document.querySelector('#ddlKQ_HD_HinhThucTT option[name="' + ma + '"]')
                        || document.querySelector('#ddlKQ_HD_HinhThucTT option[data-ma="' + ma + '"]')
                        || document.querySelector('#ddlKQ_HD_HinhThucTT option[value="' + ma + '"]');
                    if (opt && opt.value) $d.val(opt.value).trigger('change');
                };
                datLoai();
                setTimeout(datLoai, 600);
                setTimeout(datLoai, 1600);
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: _ZE_BANK_GET,
            data: {
                'action': _ZE_BANK_GET,
                'func': 'PKG_CORE_HOSONHANSU_06.Get_Person_Bank_Account',
                'iM': edu.system.iM,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strVaiTro_Id': '',
                'strNguoiThucHien_Id': edu.system.userId,
                'strPerson_Id': personId
            },
            fakedb: []
        }, false, false, false, null);
    };

    /*------------------------------------------
    -- (3) Mở hồ sơ nào thì id hoá đơn / ngân hàng phải là của hồ sơ ĐÓ.
    -- Xoá trước khi bản gốc nạp: hồ sơ mới chưa có bản ghi thì 2 biến ở lại rỗng
    -- và luồng lưu tự đi đường Them_, không còn Sua_ nhầm sang hồ sơ trước.
    -------------------------------------------*/
    if (DeXuatHoSo.prototype._loadXHD_Section) {
        var _origLoadXHD = DeXuatHoSo.prototype._loadXHD_Section;
        DeXuatHoSo.prototype._loadXHD_Section = function (personId) {
            var dx = this;
            dx._currentInvoiceId = '';
            dx._currentBankId = '';
            dx._zeBankRow = null;
            dx._zeXhdPersonId = personId || '';
            if (typeof window._zeXoaLoiLuu === 'function') window._zeXoaLoiLuu();
            _origLoadXHD.call(dx, personId);
            dx._zeLoadBank(personId);
            dx._zeLoadInvoiceFix(personId);
            dx._zeSuaPlaceholderXHD();
        };
    }

    /*------------------------------------------
    -- Đọc lại bản ghi hoá đơn để chữa ô "Đối tượng" (mã chữ → id) và điền
    -- "Họ tên người mua" khi hoá đơn xuất cho cá nhân — bản gốc luôn đổ BUYER_NAME
    -- vào ô Tên đơn vị, nên hoá đơn cá nhân mở lại nằm sai ô.
    -- Chỉ điền vào ô đang trống, không đè bản gốc.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeLoadInvoiceFix = function (personId) {
        var dx = this;
        if (!edu.util.checkValue(personId)) return;
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                if (!rows.length) return;
                var inv = rows[0];
                if (dx._zeXhdPersonId === personId) dx._currentInvoiceId = inv.ID || '';
                dx._zeFixDoiTuongTuMa(inv.BUYER_TYPE_LOAI);
                // Hoá đơn cá nhân: không có MST và không có tên đơn vị kiểu tổ chức
                // → BUYER_NAME chính là họ tên người mua.
                var ten = inv.BUYER_NAME_TENNM || inv.BUYER_NAME || '';
                if (edu.util.checkValue(ten) && !edu.util.checkValue(inv.BUYER_TAX_MST)) {
                    var dat = function () {
                        if (!$('#txtKQ_HD_NguoiMua').val()) edu.util.viewValById('txtKQ_HD_NguoiMua', ten);
                    };
                    dat();
                    setTimeout(dat, 700);
                    setTimeout(dat, 1700);
                }
            },
            error: function () { },
            type: 'POST',
            contentType: true,
            action: 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
            data: {
                'action': 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P',
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': personId,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    };

    /*------------------------------------------
    -- 2 combo của tab Xuất hoá đơn gọi loadToCombo_DanhMucDuLieu mà KHÔNG truyền
    -- tham số thứ 5 (tiêu đề), nên dòng placeholder hiện thẳng mã bảng danh mục:
    -- "Chọn ts.doituonghoadon", "Chọn person_bank_account.account_type_code".
    -- Chỉ sửa chữ hiển thị của option rỗng, không đụng tới danh sách phía dưới.
    -- Chạy ở nhiều mốc vì danh mục nạp bất đồng bộ.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeSuaPlaceholderXHD = function () {
        var dat = function () {
            [['ddlKQ_HD_DoiTuong', '-- Chọn đối tượng --'],
            ['ddlKQ_HD_HinhThucTT', '-- Chọn loại tài khoản --']].forEach(function (c) {
                var o = document.querySelector('#' + c[0] + ' option[value=""]');
                if (o && o.textContent !== c[1]) o.textContent = c[1];
            });
        };
        dat();
        setTimeout(dat, 400);
        setTimeout(dat, 1200);
        setTimeout(dat, 2500);
    };

    // --- Móc vào luồng Lưu: chụp cụm ngân hàng ĐỒNG BỘ rồi ghi sau khi CorePerson xong.
    if (DeXuatHoSo.prototype.save_DeXuatHoSo && !DeXuatHoSo.prototype._bankChainHooked) {
        DeXuatHoSo.prototype._bankChainHooked = true;
        var _prevSaveBank = DeXuatHoSo.prototype.save_DeXuatHoSo;
        DeXuatHoSo.prototype.save_DeXuatHoSo = function () {
            var dx = this;
            // try/catch: xem chú thích cùng loại ở wrapper địa chỉ phía trên
            var bank = null;
            try { bank = dx._zeCollectBank(); } catch (e) { console.warn('[ZE Bank] collect err:', e); }
            var personId = dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
            _prevSaveBank.call(dx);
            if (!bank) return;
            setTimeout(function () {
                try {
                    dx._zeSaveBank(dx.strDeXuatHoSo_Id || dx._lockedPersonId || personId, bank);
                } catch (e) { console.warn('[ZE Bank] save err:', e); }
            }, 350);
        };
    }
}

/*==============================================================================
== BẤM LƯU MÀ KHÔNG CÓ GÌ XẢY RA — CHỐT AN TOÀN (2026-09-11)
==
== Chuỗi lưu gốc KHÔNG gọi thẳng save_DeXuatHoSo. Nó đi đường vòng:
==   btnSave → genHTML_Progress('zoneprocessXXXX', N)   (vẽ thanh tiến trình
==             vào trong modal thông báo #myModalAlert)
==           → N lần save_KiemTraDinhDanh / save_KiemTraLienHe
==           → mỗi lần gọi start_Progress(...) đếm lên 1
==           → đếm đủ N mới chạy callback = save_DeXuatHoSo()
==
== start_Progress (Corei/systemroot.js:6795) đếm như sau:
==   var x     = $('#zoneprocessXXXX #zonepercentInDS');
==   var iDem  = parseInt(x.attr('title')) + 1;
==   var iTotal= x.attr('name');
==   if (iDem == iTotal) { callback(); }
==
== Nếu thanh tiến trình KHÔNG có trong DOM (modal thông báo chưa mở kịp, bị
== modal khác chồng lên làm đóng, hoặc #alert_content bị ghi đè) thì:
==   parseInt(undefined) + 1 = NaN,  iTotal = undefined,  NaN == undefined = false
== → luôn rơi vào nhánh else, callback KHÔNG BAO GIỜ chạy, và tuyệt nhiên không
== có lỗi nào hiện ra. Người dùng bấm Lưu, form im lặng, mở lại thì trắng trơn.
==
== Chốt này KHÔNG đoán mò theo thời gian: nó kiểm tra đúng điều kiện hỏng — sau
== 600ms mà thanh tiến trình không tồn tại và save_DeXuatHoSo cũng chưa được gọi
== thì gọi thẳng 1 lần. Chuỗi gốc chạy bình thường thì chốt tự im.
== save_DeXuatHoSo vẫn tự chặn bằng `if (!me.icheck) return;` nên trường hợp
== trùng định danh vẫn không lưu — chốt này không phá validate.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._zeSaveWatchdogHooked) {
    DeXuatHoSo.prototype._zeSaveWatchdogHooked = true;

    // Đánh dấu chuỗi gốc đã chạy tới nơi
    var _prevSaveWD = DeXuatHoSo.prototype.save_DeXuatHoSo;
    DeXuatHoSo.prototype.save_DeXuatHoSo = function () {
        this._zeDaGoiSave = true;
        _prevSaveWD.call(this);
    };

    // mousedown chứ không phải click: phải đặt lại cờ TRƯỚC khi handler lưu chạy,
    // vì có nhánh gọi save_DeXuatHoSo đồng bộ ngay trong click.
    $(document).on('mousedown.zesavewd', '#btnSave_DeXuatHoSo', function () {
        var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
        if (!dx || typeof dx.save_DeXuatHoSo !== 'function') return;
        dx._zeDaGoiSave = false;
        // Không có loại định danh/liên hệ nào → chuỗi gốc đi nhánh hỏi xác nhận
        // ("Chưa có thông tin định danh. Bạn có muốn lưu không?"). Để người dùng
        // tự quyết, chốt không được tự lưu thay.
        var soLoai = (dx.dtLoaiDinhDanh || []).length + (dx.dtLoaiLienHe || []).length;
        if (!soLoai) return;
        clearTimeout(dx._zeSaveWDTimer);
        dx._zeSaveWDTimer = setTimeout(function () {
            if (dx._zeDaGoiSave) return;   // chuỗi gốc đã lưu rồi
            // Thanh tiến trình còn đó = chuỗi gốc đang chạy đúng, cứ để nó lo
            if (document.querySelector('#zoneprocessXXXX #zonepercentInDS')) return;
            dx.save_DeXuatHoSo();
        }, 600);
    });
}

/*==============================================================================
== TÁCH HOÁ ĐƠN / NGÂN HÀNG / ĐỊA CHỈ RA LƯU ĐỘC LẬP  (2026-09-11)
==
== Đây là khác biệt CỐT LÕI giữa trang này và kehoachtuyensinhnew.js, và là lý do
== "2 form giống hệt nhau mà bên kia lưu được, bên này không".
==
== Bên tuyển sinh: mỗi cụm tự gọi API của nó, không phụ thuộc nhau.
== Bên này: save_PersonInvoice bị chôn BÊN TRONG success của CorePerson
==          (dexuathoso.js:1012), mà CorePerson lại phải đi qua chuỗi
==          genHTML_Progress → start_Progress → callback. Chỉ cần một mắt xích
==          trong đó tắc là hoá đơn + ngân hàng + địa chỉ chết theo, dù người
==          dùng chỉ nhập đúng 2 ô của tab Xuất hoá đơn.
==
== Cách xử lý: bấm Lưu là chụp form ngay, rồi tự gọi thẳng 3 hàm lưu đó — không
== chờ CorePerson. Phần lưu Thông tin cơ bản vẫn chạy đường cũ của nó.
==
== Chống lưu 2 lần: mỗi lần bấm Lưu là 1 "lượt". Ba hàm lưu được bọc lại để mỗi
== lượt chỉ chạy đúng 1 lần — đường nào tới trước thì thắng, đường sau tự bỏ qua.
== Nhờ vậy chuỗi gốc chạy được hay không thì kết quả vẫn là lưu đúng 1 lần.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._zeLuuDocLapHooked) {
    DeXuatHoSo.prototype._zeLuuDocLapHooked = true;

    // --- Bọc chống chạy trùng trong cùng 1 lượt bấm Lưu ---
    ['_zeSaveAddress', '_zeSaveBank', 'save_PersonInvoice'].forEach(function (ten) {
        var goc = DeXuatHoSo.prototype[ten];
        if (typeof goc !== 'function') return;
        var co = '_zeLuotCua_' + ten;
        DeXuatHoSo.prototype[ten] = function () {
            var luot = this._zeLuotLuu || 0;
            if (this[co] === luot) return;          // lượt này đã chạy rồi
            this[co] = luot;
            return goc.apply(this, arguments);
        };
    });

    // --- Đường lưu độc lập, không qua CorePerson ---
    $(document).on('mousedown.zeluudoclap', '#btnSave_DeXuatHoSo', function () {
        var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
        if (!dx) return;
        dx._zeLuotLuu = (dx._zeLuotLuu || 0) + 1;

        // Chụp form NGAY (đồng bộ) — 500ms nữa form có thể đã bị reset/đóng
        var pid = dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
        var blocks = null, bank = null;
        try { blocks = dx._zeCollectAddrBlocks(); } catch (e) { console.warn('[ZE] collect addr:', e); }
        try { bank = dx._zeCollectBank(); } catch (e) { console.warn('[ZE] collect bank:', e); }

        clearTimeout(dx._zeLuuTimer);
        dx._zeLuuTimer = setTimeout(function () {
            var id = dx.strDeXuatHoSo_Id || dx._lockedPersonId || pid;
            if (!id) { console.warn('[ZE] không có Person_Id → bỏ qua lưu phụ thuộc'); return; }
            // Mỗi cụm bọc try riêng: cụm này lỗi không được kéo 2 cụm kia chết theo
            try { if (blocks && blocks.length) dx._zeSaveAddress(id, blocks); } catch (e) { console.warn('[ZE] save addr:', e); }
            try { if (bank) dx._zeSaveBank(id, bank); } catch (e) { console.warn('[ZE] save bank:', e); }
            try { if (typeof dx.save_PersonInvoice === 'function') dx.save_PersonInvoice(); } catch (e) { console.warn('[ZE] save invoice:', e); }
        }, 500);
    });
}

/*==============================================================================
== HIỆN LỖI BE RA MÀN HÌNH THAY VÌ NUỐT IM  (2026-09-11)
==
== Cả 3 luồng lưu (hoá đơn / ngân hàng / địa chỉ) khi BE trả Success = false đều
== chỉ console.warn. Người dùng bấm Lưu, không thấy gì, tưởng đã lưu xong —
== mất rất nhiều thời gian mới phát hiện BE đang từ chối ("BUYER_TYPE_LOAI
== khong hop le"). Từ giờ in thẳng câu từ chối của BE lên đầu tab Xuất hoá đơn.
==
== Dùng banner ngay trong tab, KHÔNG dùng edu.system.alert: alert của BS3 chồng
== lên nhau sẽ gỡ body.modal-open và làm form đang mở tự đóng.
==============================================================================*/
if (typeof edu !== 'undefined' && edu.system && edu.system.makeRequest && !edu.system._zeBaoLoiHooked) {
    edu.system._zeBaoLoiHooked = true;

    // hostId: tab nào chứa ô gây lỗi thì báo ngay trong tab đó. Lỗi liên hệ /
    // định danh thuộc tab Thông tin cơ bản, báo bên tab Xuất hoá đơn thì người
    // dùng không nhìn thấy vì tab đó đang đóng.
    var _zeHienLoi = function (msg, hostId) {
        var host = (hostId && document.getElementById(hostId))
            || document.getElementById('zoneXHD') || document.getElementById('zoneCaNhan');
        if (!host) return;
        var el = document.getElementById('zeLoiLuu');
        if (!el) {
            el = document.createElement('div');
            el.id = 'zeLoiLuu';
            el.style.cssText = 'margin:0 0 16px;padding:10px 14px;border:1px solid #fca5a5;'
                + 'background:#fef2f2;color:#b91c1c;border-radius:6px;font-size:13.5px;line-height:1.5;';
            host.insertBefore(el, host.firstChild);
        }
        el.textContent = msg;
        el.style.display = '';
    };
    window._zeXoaLoiLuu = function () {
        var el = document.getElementById('zeLoiLuu');
        if (el) el.style.display = 'none';
    };
    // Mở ra cho các khối khác trong file dùng chung một chỗ báo lỗi
    window._zeHienLoi = _zeHienLoi;

    /*--------------------------------------------------------------
    -- Thêm 2 proc liên hệ vào danh sách bắt lỗi (12/09/2026).
    -- Lý do: save_LienHe nuốt lỗi 2 tầng — nhánh thất bại chỉ báo khi cờ icheck
    -- còn true (call lỗi trước đó đã hạ cờ thì im), còn câu "Lưu thành công" lại
    -- nằm trong complete: nên chạy cả khi máy chủ từ chối. Sửa số điện thoại
    -- không ăn mà vẫn báo thành công là vì vậy.
    --------------------------------------------------------------*/
    var _TEN_LUU = /Them_PersonInvoiceInfo|Sua_PersonInvoiceInfo|Ins_Person_Bank_Account|Upd_Person_Bank_Account|Ins_Person_Address|Upd_Person_Address|InsertPersonContact|UpdatePersonContact|InsertPersonIdentifier|UpdatePersonIdentifier/;
    var _NHAN = {
        PersonInvoiceInfo: 'Thông tin hoá đơn',
        Person_Bank_Account: 'Thông tin thanh toán',
        Person_Address: 'Địa chỉ',
        PersonContact: 'Thông tin liên hệ (email / điện thoại)',
        PersonIdentifier: 'Thông tin định danh'
    };
    // Lỗi của 2 cụm này thuộc tab Thông tin cơ bản
    var _HOST_THEO_FUNC = function (f) {
        return /PersonContact|PersonIdentifier/.test(f) ? 'zoneCaNhan' : null;
    };

    /*--------------------------------------------------------------
    -- BUYER_TYPE_LOAI: hai proc kiểm tra khác nhau (16/09/2026)
    --
    -- Ô "Đối tượng xuất hoá đơn" nạp từ danh mục TS.DOITUONGHOADON: value của
    -- option là ID danh mục (GUID), còn chữ hiển thị chính là mã ("CA_NHAN").
    -- FE gửi GUID. Thực tế quan sát được:
    --   Sua_PersonInvoiceInfo   + GUID → Success = true
    --   Them_PersonInvoiceInfo  + GUID → "BUYER_TYPE_LOAI khong hop le"
    -- Tức proc Thêm đòi mã chữ còn proc Sửa thì không kiểm tra gì. Bảng
    -- PERSON_INVOICE_INFO vì vậy đang lẫn cả hai kiểu giá trị.
    --
    -- Chưa chốt được với BE nên KHÔNG đổi cứng sang mã chữ (làm thế là bẻ luôn
    -- nhánh Sửa đang chạy tốt, và đẻ thêm một kiểu dữ liệu nữa). Cách ở đây:
    -- gửi như cũ, chỉ khi máy chủ từ chối ĐÚNG vì cột này mới gửi lại một lần
    -- bằng kiểu còn lại, rồi ghi nhớ kiểu nào máy chủ chịu để các lần sau gửi
    -- thẳng, khỏi tốn một request hỏng.
    --------------------------------------------------------------*/
    var _zeKieuDoiTuongOK = '';          // '' chưa biết | 'guid' | 'ma'

    var _zeDoiTuongTheoKieu = function (kieu) {
        var sel = document.getElementById('ddlKQ_HD_DoiTuong');
        var opt = sel && sel.options[sel.selectedIndex];
        if (!opt) return '';
        if (kieu === 'guid') return opt.value || '';
        return ((opt.getAttribute('name') || opt.getAttribute('data-ma')
            || opt.textContent || '') + '').trim();
    };

    // Giá trị đang gửi thuộc kiểu nào → trả về giá trị của kiểu còn lại
    var _zeDoiKieuDoiTuong = function (dangGui) {
        var guid = _zeDoiTuongTheoKieu('guid');
        var ma = _zeDoiTuongTheoKieu('ma');
        dangGui = ((dangGui || '') + '').trim();
        if (!guid && !ma) return '';
        if (dangGui && dangGui === guid) return (ma && ma !== guid) ? ma : '';
        if (dangGui && dangGui === ma) return (guid && guid !== ma) ? guid : '';
        return ma || guid || '';         // không khớp cái nào → cứ thử mã chữ
    };
    var _mrGoc = edu.system.makeRequest;
    edu.system.makeRequest = function (o) {
        try {
            var f = (o && o.data && o.data.func) || '';
            /*--------------------------------------------------------------
            -- BUYER_REF_TYPE_NGUON / BUYER_REF_ID_NGUON (11/09/2026)
            -- dexuathoso.js gửi cứng 2 param này bằng rỗng, nên dòng ghi ra DB
            -- thiếu nguồn tham chiếu. Đối chiếu bản ghi đúng trong
            -- PERSON_INVOICE_INFO: BUYER_REF_TYPE_NGUON = 'CORE_PERSON' và
            -- BUYER_REF_ID_NGUON = chính person_id. Điền vào đây vì modal không
            -- có ô nhập nào cho 2 cột đó.
            --------------------------------------------------------------*/
            if (/PersonInvoiceInfo/.test(f) && o.data) {
                var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
                var pid = ((o.data.strPerson_Id || '') + '').trim()
                    || (dx ? ((dx.strDeXuatHoSo_Id || dx._lockedPersonId || '') + '').trim() : '');
                if (pid) {
                    if (!((o.data.strBuyer_Ref_Type || '') + '').trim()) o.data.strBuyer_Ref_Type = 'CORE_PERSON';
                    if (!((o.data.strBuyer_Ref_Id || '') + '').trim()) o.data.strBuyer_Ref_Id = pid;
                }
                // Đã biết máy chủ chịu kiểu nào thì gửi thẳng kiểu đó
                if (_zeKieuDoiTuongOK && ((o.data.strBuyer_Type_Loai || '') + '').trim()) {
                    var dung = _zeDoiTuongTheoKieu(_zeKieuDoiTuongOK);
                    if (dung) o.data.strBuyer_Type_Loai = dung;
                }
            }
            // Log lại đúng thứ cần để đối chiếu khi "báo thành công mà không đổi":
            // gửi đi là Insert hay Update, strId nào, giá trị nào — rồi máy chủ trả gì.
            if (/PersonContact|PersonIdentifier/.test(f) && o.data) {
                zeDebug('[ZE Lưu ' + f.split('.').pop() + '] gửi đi', {
                    strId: o.data.strId || '(rỗng → INSERT)',
                    strPersonId: o.data.strPersonId,
                    strContactTypeCode: o.data.strContactTypeCode || o.data.strIdentifierTypeCode,
                    giaTri: o.data.strContactValue || o.data.strIdentifierNo
                });
            }
            if (_TEN_LUU.test(f) && typeof o.success === 'function') {
                var sGoc = o.success;
                o.success = function (data) {
                    try {
                        if (/PersonContact|PersonIdentifier/.test(f)) {
                            zeDebug('[ZE Lưu ' + f.split('.').pop() + '] máy chủ trả',
                                { Success: data && data.Success, Message: data && data.Message, Id: data && data.Id });
                        }
                        if (data && data.Success === false) {
                            /*----------------------------------------------
                            -- Bị chê đúng cột BUYER_TYPE_LOAI → gửi lại một lần bằng
                            -- kiểu giá trị còn lại. Gọi thẳng hàm gốc nên request thử
                            -- lại KHÔNG đi qua chỗ này nữa, không có chuyện lặp vô hạn.
                            -----------------------------------------------*/
                            if (/PersonInvoiceInfo/.test(f) && /BUYER_TYPE_LOAI/i.test(data.Message || '')) {
                                var dangGui = (o.data && o.data.strBuyer_Type_Loai) || '';
                                var thayThe = _zeDoiKieuDoiTuong(dangGui);
                                if (thayThe && thayThe !== dangGui) {
                                    var lai = {};
                                    for (var k2 in o.data) {
                                        if (Object.prototype.hasOwnProperty.call(o.data, k2)) lai[k2] = o.data[k2];
                                    }
                                    lai.strBuyer_Type_Loai = thayThe;
                                    _mrGoc.call(edu.system, {
                                        success: function (d2) {
                                            if (d2 && d2.Success) {
                                                // Ghi nhớ kiểu máy chủ chịu, lần sau gửi thẳng
                                                _zeKieuDoiTuongOK =
                                                    (thayThe === _zeDoiTuongTheoKieu('guid')) ? 'guid' : 'ma';
                                                console.warn('[ZE Hoá đơn] BUYER_TYPE_LOAI: máy chủ KHÔNG nhận "'
                                                    + dangGui + '" nhưng nhận "' + thayThe + '" → dùng kiểu "'
                                                    + _zeKieuDoiTuongOK + '" từ giờ.');
                                                var dx2 = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
                                                if (dx2 && d2.Id && /Them_/.test(f)) dx2._currentInvoiceId = d2.Id;
                                                if (typeof window._zeXoaLoiLuu === 'function') window._zeXoaLoiLuu();
                                            } else {
                                                /*------------------------------------------
                                                -- Cả hai kiểu đều bị từ chối = máy chủ không biết mục
                                                -- đang chọn trong danh mục Đối tượng xuất hoá đơn. Ghi rõ
                                                -- mục nào để người dùng đổi sang mục khác, và để bên máy
                                                -- chủ biết cần bổ sung mã nào (23/09/2026).
                                                -------------------------------------------*/
                                                _zeHienLoi('Chưa lưu được Thông tin hoá đơn: máy chủ không chấp nhận mục'
                                                    + ' "' + (_zeDoiTuongTheoKieu('ma') || dangGui) + '"'
                                                    + ' ở ô Đối tượng xuất hoá đơn (đã thử cả mã chữ lẫn mã danh mục).'
                                                    + ' Vui lòng chọn mục khác — thường chỉ CA_NHAN và TO_CHUC được chấp nhận.'
                                                    + '  [' + (((d2 && d2.Message) || '').trim() || 'không kèm lý do') + ']', null);
                                            }
                                        },
                                        error: function (er) { console.warn('[ZE Hoá đơn] thử lại lỗi:', er); },
                                        type: 'POST', contentType: true,
                                        action: lai.action, data: lai, fakedb: []
                                    }, false, false, false, null);
                                    return sGoc.apply(this, arguments);   // đang thử lại, chưa báo lỗi vội
                                }
                            }
                            var nhan = 'Lưu';
                            for (var k in _NHAN) { if (f.indexOf(k) > -1) { nhan = _NHAN[k]; break; } }
                            _zeHienLoi('Chưa lưu được ' + nhan + ': '
                                + ((data.Message || '').trim() || 'máy chủ từ chối, không kèm lý do')
                                + '  [' + f.split('.').pop() + ']', _HOST_THEO_FUNC(f));
                        }
                    } catch (e) { }
                    return sGoc.apply(this, arguments);
                };
            }
        } catch (e) { }
        return _mrGoc.apply(this, arguments);
    };
}

/*==============================================================================
== SỬA ĐIỆN THOẠI / EMAIL / CCCD KHÔNG ĂN — Id bản ghi bị dính của hồ sơ trước
== (12/09/2026)
==
== Cách luồng gốc quyết định Thêm hay Sửa: mỗi loại liên hệ có một ô ẩn
== #txtLienHe<IdLoai>, thuộc tính name của ô đó = Id bản ghi PERSON_CONTACT.
== save_LienHe đọc name: có thì UpdatePersonContact, rỗng thì InsertPersonContact.
==
== Vấn đề: KHÔNG chỗ nào xoá name.
==   - genTable_LienHe chỉ gán name cho loại CÓ bản ghi, loại không có thì bỏ qua;
==   - _bridgeOneLienHe cũng chỉ gán khi tìm thấy, không có thì để nguyên.
== Ô ẩn lại sống suốt phiên làm việc (nằm trong bảng của modal, không dựng lại).
== Nên mở hồ sơ A (có điện thoại) rồi mở hồ sơ B, name của A vẫn còn:
== bấm Lưu ở B là chạy Update Id của A — số của A bị ghi đè, còn B thì không có
== gì thay đổi. Nhìn từ màn hình đúng như "sửa không được mà vẫn báo thành công".
== Thêm mới chạy đúng vì lúc đó ô chưa từng mang name.
==
== Ở đây đặt lại name cho TẤT CẢ ô ngay trước khi lưu, lấy đúng theo danh sách
== bản ghi của hồ sơ đang mở: có thì gán, không có thì XOÁ. Định danh (CCCD) dùng
== chung đúng cơ chế đó nên vá luôn, nếu không thì vẫn còn đường ghi đè hồ sơ khác.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype._bridgeLienHeToShadow
    && !DeXuatHoSo.prototype._zeNameHooked) {
    DeXuatHoSo.prototype._zeNameHooked = true;

    /*------------------------------------------
    -- Tìm bản ghi của đúng loại + đúng người. PERSON_ID chỉ so khi API có trả,
    -- không có thì đành tin theo loại (dữ liệu đã lấy theo từng hồ sơ).
    -------------------------------------------*/
    /*------------------------------------------
    -- So GUID KHÔNG phân biệt hoa thường (23/09/2026).
    -- Trước đây so thẳng bằng ===: danh sách trả GUID viết thường mà Id hồ sơ đang
    -- mở viết hoa là trượt hết, khiến bản ghi có sẵn bị coi như không tồn tại.
    -------------------------------------------*/
    var _zeBang = function (a, b) {
        return ((a || '') + '').trim().toUpperCase() === ((b || '') + '').trim().toUpperCase();
    };

    var _zeTimBanGhi = function (ds, pid, khopLoai) {
        return (ds || []).filter(function (x) {
            if (!khopLoai(x)) return false;
            return !pid || !x.PERSON_ID || _zeBang(x.PERSON_ID, pid);
        })[0];
    };

    /*------------------------------------------
    -- Danh sách CHƯA nạp thì KHÔNG được xoá name (23/09/2026).
    -- Danh sách của hồ sơ nạp bất đồng bộ. Nếu lúc bấm Lưu nó còn rỗng mà vẫn xoá
    -- name thì luồng gốc tưởng bản ghi chưa tồn tại → chạy bước kiểm tra trùng →
    -- máy chủ thấy chính CCCD của hồ sơ này đang nằm trong bảng → báo "đã được
    -- dùng ở hồ sơ khác" dù người dùng không hề sửa ô đó. Rỗng thì để nguyên
    -- những gì luồng gốc đã gán, chỉ dọn khi biết chắc là không có bản ghi.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeDatLaiNameLienHe = function () {
        var dx = this;
        var pid = dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
        var daNap = !!(dx.dtLienHe && dx.dtLienHe.length);
        (dx.dtLoaiLienHe || []).forEach(function (loai) {
            var $o = $('#txtLienHe' + loai.ID);
            if (!$o.length) return;
            var ban = _zeTimBanGhi(dx.dtLienHe, pid, function (x) {
                return _zeBang(x.CONTACT_TYPE_CODE_ID, loai.ID) || _zeBang(x.CONTACT_TYPE_CODE, loai.ID);
            });
            if (ban && ban.ID) $o.attr('name', ban.ID);
            else if (daNap) $o.removeAttr('name');   // chắc chắn chưa có bản ghi → Thêm mới
        });
    };

    DeXuatHoSo.prototype._zeDatLaiNameDinhDanh = function () {
        var dx = this;
        var pid = dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
        var daNap = !!(dx.dtDinhDanh && dx.dtDinhDanh.length);
        (dx.dtLoaiDinhDanh || []).forEach(function (loai) {
            var $o = $('#txtSoDinhDinh' + loai.ID);
            if (!$o.length) return;
            var ban = _zeTimBanGhi(dx.dtDinhDanh, pid, function (x) {
                return _zeBang(x.IDENTIFIER_TYPE_CODE, loai.ID) || _zeBang(x.IDENTIFIER_TYPE_CODE_ID, loai.ID);
            });
            if (ban && ban.ID) $o.attr('name', ban.ID);
            else if (daNap) $o.removeAttr('name');
        });
    };

    /*------------------------------------------
    -- Móc vào đúng 2 hàm cầu nối đang chạy ngay trước khi lưu. Đặt lại name TRƯỚC
    -- rồi mới để bản gốc chạy: bản gốc chỉ gán thêm chứ không xoá nên không đụng
    -- độ, mà mọi đường vào lưu (click, mousedown, watchdog) đều đi qua đây.
    -------------------------------------------*/
    var _origBridgeLH = DeXuatHoSo.prototype._bridgeLienHeToShadow;
    DeXuatHoSo.prototype._bridgeLienHeToShadow = function () {
        try { this._zeDatLaiNameLienHe(); } catch (e) { console.warn('[ZE Name LH]', e); }
        return _origBridgeLH.apply(this, arguments);
    };

    if (DeXuatHoSo.prototype._bridgeCccdToShadow) {
        var _origBridgeDD = DeXuatHoSo.prototype._bridgeCccdToShadow;
        DeXuatHoSo.prototype._bridgeCccdToShadow = function () {
            try { this._zeDatLaiNameDinhDanh(); } catch (e) { console.warn('[ZE Name DD]', e); }
            return _origBridgeDD.apply(this, arguments);
        };
    }

    /*------------------------------------------
    -- Mở hồ sơ khác thì xoá sạch name ngay, không đợi tới lúc bấm Lưu: danh sách
    -- liên hệ của hồ sơ mới nạp bất đồng bộ, lỡ bấm Lưu sớm là dính Id người cũ.
    -------------------------------------------*/
    if (DeXuatHoSo.prototype.openEditByPerson) {
        var _origOpenName = DeXuatHoSo.prototype.openEditByPerson;
        DeXuatHoSo.prototype.openEditByPerson = function (person) {
            try {
                $('[id^="txtLienHe"], [id^="txtSoDinhDinh"]').removeAttr('name');
            } catch (e) { }
            return _origOpenName.apply(this, arguments);
        };
    }
}

/*==============================================================================
== SỐ ĐIỆN THOẠI NHẬP VÀO KHÔNG ĐƯỢC GỬI ĐI  (16/09/2026)
==
== Bằng chứng từ log: bấm Lưu chỉ thấy UpdatePersonContact cho EMAIL, còn loại
== liên hệ kia đi qua KiemTraThongTinLienHe với strContactValue = undefined, và
== tuyệt nhiên không có Insert/UpdatePersonContact nào mang số điện thoại.
== Tức ô ẩn #txtLienHe<IdLoại> rỗng ngay lúc lưu → save_LienHe thấy rỗng là bỏ
== qua (dexuathoso.js:1426), nên số gõ vào bay mất mà vẫn báo thành công.
==
== Nguyên nhân: _bridgeLienHeToShadow nhận diện loại bằng cách dò chữ trong
== MA/TEN với danh sách cứng (DIEN THOAI, SDT, PHONE...). Danh mục của trường đặt
== tên khác (ví dụ "Di động", "Số máy", "Liên lạc") là trượt hết, và fallback
== đoán theo bản ghi cũ cũng vô dụng khi hồ sơ CHƯA có số nào — đúng tình huống
== đang gặp. Email sống sót chỉ vì chữ "mail" khó trượt, mà thật ra giá trị của
== nó là do bảng đổ từ DB chứ không phải do cầu nối.
==
== Cách xử lý: chuẩn hoá tên loại (bỏ dấu, bỏ mọi ký tự không phải chữ số) rồi
== chấm điểm để chọn ĐÚNG MỘT loại cho ô Email và MỘT loại cho ô Điện thoại,
== có đường lui cuối cùng khi danh mục đặt tên lạ hoàn toàn. Bản gốc vẫn chạy
== trước, phần này chỉ bù vào chỗ nó bỏ sót nên không phá trang nào đang chạy đúng.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype._bridgeLienHeToShadow
    && !DeXuatHoSo.prototype._zeBuLienHeHooked) {
    DeXuatHoSo.prototype._zeBuLienHeHooked = true;

    // "Số Điện Thoại" → "SODIENTHOAI": bỏ dấu, bỏ luôn khoảng trắng/gạch/chấm để
    // không phụ thuộc cách viết của từng trường.
    var _zeKey = function (s) {
        return ((s || '') + '').normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .toUpperCase().replace(/[^A-Z0-9]/g, '');
    };

    var _ZE_TU_PHONE = ['DIENTHOAI', 'SDT', 'DTDD', 'DIDONG', 'MOBILE', 'PHONE', 'TEL',
        'SOMAY', 'LIENLAC', 'CELL', 'HOTLINE'];
    var _ZE_TU_EMAIL = ['EMAIL', 'MAIL', 'THUDIENTU', 'HOMTHU'];

    /*------------------------------------------
    -- Chọn đúng một loại cho mỗi ô. Điểm: khớp chữ trong danh mục (2) cộng thêm
    -- nếu hồ sơ đã có sẵn bản ghi ở loại đó (3) — bản ghi cũ là bằng chứng chắc
    -- nhất về việc trường đang dùng loại nào để lưu số/hòm thư.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeChonLoaiLienHe = function () {
        var dx = this;
        var ds = dx.dtLoaiLienHe || [];
        var daCo = dx.dtLienHe || [];
        var banGhiCua = function (id) {
            return daCo.filter(function (x) {
                return (x.CONTACT_TYPE_CODE_ID === id) || (x.CONTACT_TYPE_CODE === id);
            })[0];
        };
        var cham = function (loai, tuKhoa) {
            var k = _zeKey(loai.MA) + '|' + _zeKey(loai.TEN);
            var diem = tuKhoa.some(function (t) { return k.indexOf(t) > -1; }) ? 2 : 0;
            var b = banGhiCua(loai.ID);
            var v = (b && (b.CONTACT_VALUE || b.VALUE) || '') + '';
            // Bản ghi sẵn có: giá trị chứa @ thì chắc chắn là hòm thư, toàn số thì là số máy
            if (v) {
                var laMail = v.indexOf('@') > -1;
                var laSo = /^[\d\s+\-().]+$/.test(v) && v.replace(/\D/g, '').length >= 6;
                if ((tuKhoa === _ZE_TU_EMAIL && laMail) || (tuKhoa === _ZE_TU_PHONE && laSo)) diem += 3;
            }
            return diem;
        };
        var tot = function (tuKhoa) {
            var xep = ds.map(function (l) { return { id: l.ID, diem: cham(l, tuKhoa) }; })
                .filter(function (x) { return x.diem > 0; })
                .sort(function (a, b) { return b.diem - a.diem; });
            return xep.length ? xep[0].id : '';
        };
        var email = tot(_ZE_TU_EMAIL);
        var phone = tot(_ZE_TU_PHONE);
        // Đường lui: danh mục đặt tên không giống bất kỳ từ nào ở trên. Chỉ dùng khi
        // còn đúng MỘT loại chưa ai nhận — đoán bừa giữa nhiều loại thì thà bỏ trống
        // còn hơn ghi số điện thoại vào nhầm chỗ.
        if (!phone) {
            var khongPhaiSo = /DIACHI|ADDRESS|FACEBOOK|ZALO|WEBSITE|SKYPE|GHICHU/;
            var conLai = ds.filter(function (l) {
                return l.ID !== email && !khongPhaiSo.test(_zeKey(l.MA) + _zeKey(l.TEN));
            });
            if (conLai.length === 1) phone = conLai[0].ID;
        }
        if (!email) {
            var conLai2 = ds.filter(function (l) { return l.ID !== phone; });
            if (conLai2.length === 1) email = conLai2[0].ID;
        }
        return { email: email, phone: phone };
    };

    /*------------------------------------------
    -- Bù giá trị vào ô ẩn của loại đã chọn. Chỉ ghi khi người dùng có nhập: ô để
    -- trống mà ghi đè xuống là xoá mất số cũ, trong khi BE chưa có đường xoá.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeBuLienHe = function () {
        var dx = this;
        var chon = dx._zeChonLoaiLienHe();
        var bang = [];
        var khongXoaDuoc = [];
        [['email', 'txtEmailCaNhan', 'Email'], ['phone', 'txtDienThoai', 'Điện thoại']].forEach(function (c) {
            var typeId = chon[c[0]];
            var giaTri = (($('#' + c[1]).val() || '') + '').trim();
            bang.push({ 'Ô': c[1], 'IdLoại': typeId || '(KHÔNG XÁC ĐỊNH ĐƯỢC)', 'Giá trị': giaTri });
            if (!typeId) return;
            if (!giaTri) {
                /*------------------------------------------
                -- Ô trống KHÔNG có nghĩa là người dùng muốn xoá (21/09/2026).
                --
                -- Bản đầu coi "trống = xoá" và đã xoá nhầm email của hồ sơ đang mở:
                -- ô Email ở tab Thông tin cơ bản có thể trống chỉ vì form chưa nạp
                -- kịp (luồng gốc đổ giá trị vào đó ở mốc 800ms), hoặc vì người dùng
                -- chỉ thao tác trong bảng ở tab Định danh & Liên hệ. Bấm Lưu là mất
                -- dữ liệu dù không ai đụng tới ô đó.
                --
                -- Nay chỉ coi là xoá khi chính người dùng vừa xoá tay ô đó — cùng
                -- cách làm với cụm địa chỉ Nơi sinh / Hộ khẩu ở trên.
                -------------------------------------------*/
                if (!$('#' + c[1]).attr('data-user-touched')) return;
                /*------------------------------------------
                -- Tới đây là người dùng thật sự xoá. Vẫn KHÔNG ghi rỗng xuống: cột
                -- CONTACT_VALUE là NOT NULL nên Update chuỗi rỗng sẽ ném ORA-01407,
                -- mà PKG_CORE_HOSONHANSU_05 không có proc xoá liên hệ nào.
                -------------------------------------------*/
                var cu = (dx.dtLienHe || []).filter(function (x) {
                    return (x.CONTACT_TYPE_CODE_ID === typeId) || (x.CONTACT_TYPE_CODE === typeId);
                })[0];
                var giaTriCu = cu && (cu.CONTACT_VALUE || cu.VALUE) || '';
                if (cu && cu.ID && giaTriCu) {
                    khongXoaDuoc.push({ id: cu.ID, typeId: typeId, giaTriCu: giaTriCu, nhan: c[2] });
                }
                return;
            }
            if (!$('#txtLienHe' + typeId).length) {
                $('body').append('<input type="hidden" id="txtLienHe' + typeId + '" />');
            }
            if (!$('#checkX' + typeId).length) {
                $('body').append('<input type="checkbox" id="checkX' + typeId + '" style="display:none" checked />');
            }
            $('#txtLienHe' + typeId).val(giaTri);
        });
        // Ghi nhận để lát nữa gửi lệnh xoá mềm (xem khối XOÁ TRẮNG Ô LIÊN HỆ bên dưới)
        dx._zeCanXoaLienHe = khongXoaDuoc;
        // Muốn xem ô nào đang gắn vào loại nào thì gõ _zeXemLoaiLienHe() trong Console
        zeDebug('[ZE Liên hệ] map ô → loại', bang);
    };

    var _origBridgeBu = DeXuatHoSo.prototype._bridgeLienHeToShadow;
    DeXuatHoSo.prototype._bridgeLienHeToShadow = function () {
        var dx = this;
        try { _origBridgeBu.apply(dx, arguments); } catch (e) { console.warn('[ZE Liên hệ] bản gốc lỗi:', e); }
        try { dx._zeBuLienHe(); } catch (e) { console.warn('[ZE Liên hệ] bù lỗi:', e); }
    };
}

/*==============================================================================
== XOÁ TRẮNG Ô EMAIL / ĐIỆN THOẠI  (16/09/2026)
==
== Yêu cầu: người dùng xoá trắng ô rồi Lưu thì số phải mất hẳn.
==
== Vì sao luồng gốc không làm được:
==   - save_LienHe thấy ô rỗng là bỏ qua, không gửi gì (dexuathoso.js:1426);
==   - cột CONTACT_VALUE là NOT NULL nên Update với chuỗi rỗng ném ORA-01407;
==   - PKG_CORE_HOSONHANSU_05 không có proc xoá liên hệ nào (chỉ Insert/Update/
==     Get, còn DeleteCorePerson là xoá cả hồ sơ).
==
== Cách làm: xoá MỀM — gọi chính UpdatePersonContact, GIỮ NGUYÊN giá trị cũ để
== không phạm ràng buộc NOT NULL, và hạ cờ hoạt động về 0. Gửi kèm cả hai cách
== đặt tên (dIsActive / dIs_Active) vì hai package trong hệ đặt khác nhau; máy
== chủ bỏ qua tham số thừa — thấy rõ qua việc mọi request đều kèm
== strVaiTroDangNhap_Id / strChucNangHeThong_Id mà proc cũ vẫn chạy bình thường.
==
== Kèm theo: khi nạp danh sách liên hệ thì bỏ các bản ghi đã tắt cờ, nếu không
== xoá xong mở lại vẫn thấy số cũ.
==
== Nếu máy chủ KHÔNG nhận cờ này: bản ghi vẫn còn, mở lại vẫn thấy số cũ và có
== banner đỏ báo lý do — lúc đó bắt buộc phải nhờ BE mở proc xoá thật.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype._zeBuLienHe
    && !DeXuatHoSo.prototype._zeXoaLienHeHooked) {
    DeXuatHoSo.prototype._zeXoaLienHeHooked = true;

    // Lấy nguyên action string của save_LienHe nhánh Update — không tự bịa
    var _ZE_LH_UPD = 'NS_HoSoNhanSu5_MH/FDElIDUkESQzMi4vAi4vNSAiNQPP';

    DeXuatHoSo.prototype._zeXoaMemLienHe = function () {
        var dx = this;
        var ds = dx._zeCanXoaLienHe || [];
        dx._zeCanXoaLienHe = [];
        if (!ds.length) return;
        var pid = dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
        if (!pid) return;
        // Success = true CHƯA chắc đã xoá: máy chủ có thể nhận request rồi bỏ qua
        // tham số lạ. Giữ danh sách này lại để đối chiếu với dữ liệu nạp về sau đó.
        dx._zeChoXacNhanXoa = ds.slice();
        var conLai = ds.length;
        ds.forEach(function (m) {
            edu.system.makeRequest({
                success: function (data) {
                    if (data && data.Success) return;
                    if (typeof window._zeHienLoi === 'function') {
                        window._zeHienLoi('Chưa xoá được ' + m.nhan + ' (' + m.giaTriCu + '): '
                            + (((data && data.Message) || '').trim()
                                || 'máy chủ chưa mở chức năng xoá thông tin liên hệ')
                            + '. Giá trị cũ được giữ nguyên, muốn đổi thì nhập giá trị mới đè lên.',
                            'zoneCaNhan');
                    }
                },
                error: function (er) { console.warn('[ZE Xoá liên hệ] err:', er); },
                complete: function () {
                    // Nạp lại để form phản ánh đúng những gì máy chủ thực sự nhận
                    if (--conLai === 0 && typeof dx.getList_LienHe === 'function') {
                        setTimeout(function () { try { dx.getList_LienHe(); } catch (e) { } }, 200);
                    }
                },
                type: 'POST',
                contentType: true,
                action: _ZE_LH_UPD,
                data: {
                    'action': _ZE_LH_UPD,
                    'func': 'PKG_CORE_HOSONHANSU_05.UpdatePersonContact',
                    'iM': edu.system.iM,
                    'strId': m.id,
                    'strChucNang_Id': edu.system.strChucNang_Id,
                    'strPersonId': pid,
                    'strContactTypeCode': m.typeId,
                    'strContactValue': m.giaTriCu,   // NOT NULL → buộc phải giữ giá trị cũ
                    'dIsPrimary': 0,
                    'dIsActive': 0,
                    'dIs_Active': 0,
                    'strNguoiThucHien_Id': edu.system.userId
                },
                fakedb: []
            }, false, false, false, null);
        });
    };

    /*------------------------------------------
    -- Đánh dấu ô nào người dùng TỰ TAY sửa. Chỉ sự kiện input của thao tác thật
    -- mới bắn; code đổ dữ liệu bằng .val()/viewValById thì không, nên phân biệt
    -- được "người dùng xoá" với "form chưa nạp".
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeBindLienHeTouched = function () {
        $('#txtEmailCaNhan, #txtDienThoai').off('.zelhtouch')
            .on('input.zelhtouch', function () { $(this).attr('data-user-touched', '1'); });
    };

    // Mở hồ sơ khác thì quên dấu của hồ sơ trước
    if (DeXuatHoSo.prototype._loadTabInfoExtras) {
        var _origLTI_LH = DeXuatHoSo.prototype._loadTabInfoExtras;
        DeXuatHoSo.prototype._loadTabInfoExtras = function (personId) {
            try { $('#txtEmailCaNhan, #txtDienThoai').removeAttr('data-user-touched'); } catch (e) { }
            var kq = _origLTI_LH.apply(this, arguments);
            try { this._zeBindLienHeTouched(); } catch (e) { }
            return kq;
        };
    }

    /*------------------------------------------
    -- Bấm Lưu: chờ cầu nối chạy xong (nó mới là chỗ phát hiện ô bị xoá trắng)
    -- rồi mới gửi lệnh xoá. 600ms để đứng sau cả chuỗi lưu chính.
    -------------------------------------------*/
    $(document).on('mousedown.zexoalh', '#btnSave_DeXuatHoSo', function () {
        var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
        if (!dx || typeof dx._zeXoaMemLienHe !== 'function') return;
        clearTimeout(dx._zeXoaLHTimer);
        dx._zeXoaLHTimer = setTimeout(function () {
            try { dx._zeXoaMemLienHe(); } catch (e) { console.warn('[ZE Xoá liên hệ]', e); }
        }, 600);
    });

    /*------------------------------------------
    -- Bản ghi đã tắt cờ thì coi như không còn: lọc ngay tại chỗ nhận dữ liệu để
    -- cả bảng ở tab 2 lẫn ô Email/Điện thoại ở tab 1 đều không thấy nó nữa.
    -- Chỉ lọc khi máy chủ có trả cột IS_ACTIVE — không trả thì giữ nguyên hết,
    -- không tự suy diễn.
    -------------------------------------------*/
    if (DeXuatHoSo.prototype.genTable_LienHe) {
        var _origGenLH = DeXuatHoSo.prototype.genTable_LienHe;
        DeXuatHoSo.prototype.genTable_LienHe = function (data, iPager) {
            var dx = this;
            var loc = (data || []).filter(function (x) {
                return !x || x.IS_ACTIVE === undefined || x.IS_ACTIVE === null || x.IS_ACTIVE == 1;
            });
            dx.dtLienHe = loc;
            // Ô ẩn của bản ghi vừa bị tắt cờ phải trả về rỗng, nếu không lần lưu
            // sau lại lấy đúng số cũ đó gửi đi.
            (data || []).forEach(function (x) {
                if (!x || x.IS_ACTIVE === undefined || x.IS_ACTIVE == 1) return;
                var tid = x.CONTACT_TYPE_CODE_ID || x.CONTACT_TYPE_CODE;
                if (tid) $('#txtLienHe' + tid).val('').removeAttr('name');
            });
            /*------------------------------------------
            -- Đối chiếu: vừa yêu cầu xoá xong mà bản ghi vẫn còn nguyên trong danh
            -- sách nạp về = máy chủ không xoá. Phải nói cho người dùng biết, chứ
            -- lặng im thì họ tưởng xong rồi lần sau mở lại mới ngã ngửa.
            -------------------------------------------*/
            var cho = dx._zeChoXacNhanXoa || [];
            if (cho.length) {
                var conNguyen = cho.filter(function (m) {
                    return loc.some(function (x) { return x.ID === m.id; });
                });
                dx._zeChoXacNhanXoa = [];
                if (conNguyen.length && typeof window._zeHienLoi === 'function') {
                    window._zeHienLoi('Chưa xoá được '
                        + conNguyen.map(function (m) { return m.nhan + ' (' + m.giaTriCu + ')'; }).join(' và ')
                        + '. Máy chủ hiện chưa có chức năng xoá thông tin liên hệ nên giá trị cũ được giữ nguyên'
                        + ' — muốn đổi thì nhập giá trị mới đè lên. (Cần bổ sung Xoa_PersonContact ở phía máy chủ.)',
                        'zoneCaNhan');
                } else if (typeof window._zeXoaLoiLuu === 'function') {
                    window._zeXoaLoiLuu();
                }
            }
            return _origGenLH.call(dx, loc, iPager);
        };
    }
}

/*------------------------------------------
-- Tiện ích xem danh mục Loại liên hệ và ô nào đang gắn vào loại nào.
-- Gõ trong Console:  _zeXemLoaiLienHe()
-------------------------------------------*/
window._zeXemLoaiLienHe = function () {
    var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
    if (!dx) { console.warn('Chưa có main_doc.DeXuatHoSo'); return []; }
    var chon = (typeof dx._zeChonLoaiLienHe === 'function') ? dx._zeChonLoaiLienHe() : {};
    var ds = (dx.dtLoaiLienHe || []).map(function (l) {
        var b = (dx.dtLienHe || []).filter(function (x) {
            return (x.CONTACT_TYPE_CODE_ID === l.ID) || (x.CONTACT_TYPE_CODE === l.ID);
        })[0];
        return {
            'Id': l.ID, 'Mã': l.MA, 'Tên': l.TEN,
            'Đang gắn ô': (l.ID === chon.email) ? 'txtEmailCaNhan'
                : ((l.ID === chon.phone) ? 'txtDienThoai' : ''),
            'Giá trị đang có': (b && (b.CONTACT_VALUE || b.VALUE)) || '',
            'Id bản ghi': (b && b.ID) || ''
        };
    });
    if (console.table) console.table(ds); else console.log(ds);
    return ds;
};

/*------------------------------------------
-- Tiện ích xem nhanh danh mục "Đối tượng xuất hoá đơn" đang có những mã nào.
-- Gõ trong Console:  _zeXemDoiTuong()
-- Dùng để đối chiếu với giá trị mà proc Them_PersonInvoiceInfo chấp nhận.
-------------------------------------------*/
window._zeXemDoiTuong = function () {
    var opts = document.querySelectorAll('#ddlKQ_HD_DoiTuong option');
    var ds = [];
    for (var i = 0; i < opts.length; i++) {
        ds.push({
            'Hiển thị (TEN)': opts[i].textContent,
            'Mã (MA) — gửi lên BE': opts[i].getAttribute('name') || opts[i].getAttribute('data-ma') || '(KHÔNG CÓ)',
            'Id danh mục': opts[i].value
        });
    }
    if (console.table) console.table(ds); else console.log(ds);
    return ds;
};





/*==============================================================================
== BADGE MÃ SỐ + HỌ TÊN TRÊN ĐẦU MODAL  (2026-09-11)
==
== Yêu cầu: đầu modal Chỉnh sửa hồ sơ phải hiện Mã số + Họ tên (kèm Lớp/Ngành/
== Khoa nếu có) — giống thanh thông tin sinh viên ở trang Thu tiền
== (ApisTaiChinh/phieuthu: #txtTen_Ma_NS_SDT + #txtSV_Lop/Nganh/Khoa).
==
== _populateHeaderBadge của dexuathoso.js đã làm việc này nhưng thực tế vẫn trống.
== Thay vì đoán chỗ nó hụt, vẽ lại badge SAU khi modal mở xong, và lấy họ tên
== thẳng từ các ô đã điền trên form — nguồn chắc chắn có, không phụ thuộc việc
== danh sách đặt tên cột kiểu gì. Chạy ở vài mốc thời gian để không bị luồng
== nạp chậm ghi đè.
==
== Chỉ ghi khi dựng được ít nhất 1 chip, nên nếu bản gốc đã vẽ đúng thì không
== bao giờ xoá mất nội dung đang có.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.openEditByPerson
    && !DeXuatHoSo.prototype._zeBadgeHooked) {
    DeXuatHoSo.prototype._zeBadgeHooked = true;

    /*------------------------------------------
    -- Lấy giá trị theo danh sách tên cột, không phân biệt hoa thường.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeLay = function (obj, keys) {
        if (!obj) return '';
        var tra = {};
        for (var k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) tra[k.toUpperCase()] = obj[k];
        }
        for (var i = 0; i < keys.length; i++) {
            var v = tra[keys[i].toUpperCase()];
            if (v !== null && v !== undefined && (v + '').trim() !== '') return (v + '').trim();
        }
        return '';
    };

    /*------------------------------------------
    -- Tìm chỗ đặt badge, KHÔNG có thì tự tạo.
    -- Cần thiết vì không phải trang nào cũng dùng markup do file này dựng:
    -- quanlytoanbo.html và hoso_taomoi.html có sẵn <div id="zoneEdit"> kiểu cũ
    -- (chưa có <div id="zeHeaderBadge">), nên inject bỏ qua không dựng lại →
    -- badge không có chỗ bám và hàm vẽ thoát ngay. Tự chèn vào header thì form
    -- nào cũng hiện được.
    -- Kèm style inline tối thiểu phòng khi trang đó không có CSS của file này.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeOBadge = function () {
        var el = document.getElementById('zeHeaderBadge');
        if (el) return el;
        var header = document.querySelector('#zoneEdit .box-header .nav-content-left')
            || document.querySelector('#zoneEdit .box-header')
            || document.querySelector('#zoneEdit .modal-header')
            || document.querySelector('#zoneEdit');
        if (!header) return null;
        el = document.createElement('div');
        el.id = 'zeHeaderBadge';
        // Đánh dấu là do mình tự tạo: trang đó không dùng markup của file này nên
        // nhiều khả năng cũng không có CSS .ze-chip → lúc vẽ sẽ tự thêm style inline.
        el.setAttribute('data-ze-tudao', '1');
        el.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px 10px;margin-top:6px;'
            + 'justify-content:center;width:100%;';
        header.appendChild(el);
        return el;
    };

    DeXuatHoSo.prototype._zeVeBadge = function (person) {
        var dx = this;
        var el = dx._zeOBadge();
        if (!el) return;
        person = person || {};
        var a = person.aData || {};
        var lay = function (keys) { return dx._zeLay(a, keys); };
        var chuoi = function (v) { return ((v === null || v === undefined) ? '' : v + '').trim(); };

        var ma = chuoi(person.ma) || lay(['MASO', 'MA', 'MA_NGUOI_HOC', 'MA_SV', 'STUDENT_CODE',
            'QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_MA', 'MA_HS', 'CURRENT_EMPLOYEE_CODE']);
        // Dự phòng: luồng mở modal kiểu cũ (getDetail_HSSV) không truyền aData nhưng
        // có điền mã số vào ô này, nên vẫn lấy ra được.
        if (!ma) ma = chuoi($('#txt_MaSoSV').val()) || chuoi($('#txtMaSoSV').val());

        var hoTen = chuoi(person.hoTen) || lay(['FULL_NAME', 'FULLNAME', 'HOTEN', 'HO_TEN',
            'HOVATEN', 'HO_VA_TEN', 'QLSV_NGUOIHOC_HOTEN']);
        if (!hoTen) {
            // Nguồn chắc chắn nhất: chính các ô đã được điền trên form
            var tuForm = chuoi($('#txtHoVaTen').val());
            if (!tuForm) {
                tuForm = [chuoi($('#txtHo').val()), chuoi($('#txtTenDem').val()), chuoi($('#txtTen').val())]
                    .filter(function (x) { return x; }).join(' ');
            }
            hoTen = tuForm;
        }
        if (!hoTen) {
            hoTen = [chuoi(person.hoDem) || lay(['HODEM', 'HO_DEM']),
            chuoi(person.ten) || lay(['TEN', 'FIRST_NAME'])]
                .filter(function (x) { return x; }).join(' ');
        }
        hoTen = hoTen.replace(/\s+/g, ' ').trim();

        var lop = chuoi(person.lop) || lay(['DAOTAO_LOPQUANLY_TEN', 'LOP_TEN', 'LOP',
            'QLSV_NGUOIHOC_LOPQUANLY_TEN', 'DAOTAO_LOPQUANLY_MA']);
        var nganh = chuoi(person.nganh) || lay(['DAOTAO_NGANH_TEN', 'NGANH_TEN', 'NGANH',
            'DAOTAO_NGANHDAOTAO_TEN', 'DAOTAO_NGANHNHAPHOC']);
        var khoa = chuoi(person.khoa) || lay(['DAOTAO_KHOAQUANLY_TEN', 'KHOA_TEN', 'KHOA',
            'DAOTAO_KHOADAOTAO_TEN', 'KHOAHOC']);

        var esc = function (s) {
            return (s + '').replace(/[&<>"']/g, function (c) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
        };
        // LUÔN kèm style inline, không chỉ khi tự tạo phần tử: trang nào cũng có thể
        // có CSS riêng nuốt mất chip (ẩn, đè màu, thu về 0). Giá trị đặt đúng bằng
        // .ze-chip nên trang có CSS chuẩn nhìn vẫn y hệt.
        var styleChip = ' style="display:inline-flex !important;align-items:center;'
            + 'padding:3px 10px;background:rgba(255,255,255,.18);'
            + 'border:1px solid rgba(255,255,255,.28);border-radius:20px;'
            + 'color:#fff !important;font-size:12.5px;font-weight:500;line-height:1.4;'
            + 'white-space:nowrap;visibility:visible !important;opacity:1 !important;"';
        var chip = function (nhan, gt) {
            return '<span class="ze-chip"' + styleChip + '><b>' + nhan + '</b>' + esc(gt) + '</span>';
        };
        var chips = [];
        // Họ tên đứng trước, in đậm — giống thanh bên trang Thu tiền
        if (hoTen) chips.push(chip('Họ tên:', hoTen.toUpperCase()));
        if (ma) chips.push(chip('Mã số:', ma));
        if (lop) chips.push(chip('Lớp:', lop));
        if (nganh) chips.push(chip('Ngành:', nganh));
        if (khoa) chips.push(chip('Khoa:', khoa));

        // Không dựng được gì thì để nguyên, không xoá nội dung bản gốc đã vẽ
        if (!chips.length) return;
        el.innerHTML = chips.join('');

        /*--------------------------------------------------------------
        -- Ép hiển thị. CSS của file này có luật `#zeHeaderBadge:empty{display:none}`,
        -- và mỗi trang còn có stylesheet riêng có thể ẩn/thu nhỏ khối này. Đặt
        -- thẳng vào style của phần tử kèm cờ important thì stylesheet không đè
        -- được nữa — kể cả luật có !important.
        -- Bọc try vì vài trình duyệt cũ không cho setProperty với priority.
        --------------------------------------------------------------*/
        try {
            var ep = {
                'display': 'flex', 'flex-wrap': 'wrap', 'justify-content': 'center',
                'align-items': 'center', 'gap': '6px 10px', 'margin-top': '6px',
                'width': '100%', 'visibility': 'visible', 'opacity': '1',
                'max-height': 'none', 'overflow': 'visible'
            };
            for (var k in ep) {
                if (Object.prototype.hasOwnProperty.call(ep, k)) el.style.setProperty(k, ep[k], 'important');
            }
            // Header là flex căn giữa theo chiều dọc — cho phép xuống dòng để badge
            // không bị đẩy ra ngoài vùng nhìn thấy.
            var hd = el.parentNode;
            if (hd && hd.style && hd.style.setProperty) hd.style.setProperty('overflow', 'visible', 'important');
        } catch (e) { }
    };

    var _origOpenBadge = DeXuatHoSo.prototype.openEditByPerson;
    DeXuatHoSo.prototype.openEditByPerson = function (person) {
        var dx = this;
        _origOpenBadge.call(dx, person);
        var ve = function () { try { dx._zeVeBadge(person); } catch (e) { } };
        ve();
        setTimeout(ve, 400);
        setTimeout(ve, 1200);
    };

    /*------------------------------------------
    -- Chốt thứ hai: bấm nút sửa ở danh sách thì vẽ lại badge, KHÔNG phụ thuộc
    -- việc trang đó mở modal bằng openEditByPerson hay bằng luồng cũ
    -- (getDetail_HSSV + slideDown). Lúc này lấy họ tên từ form và mã số từ ô
    -- #txt_MaSoSV — đều là thứ luồng cũ có điền.
    -- Vẽ trễ để form kịp nạp xong; hàm vẽ không dựng được chip nào thì tự bỏ qua.
    -------------------------------------------*/
    $(document).on('click.zebadge', '.btnEdit, .btnSelect_NguoiHoc_ThuHS', function () {
        var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
        if (!dx || typeof dx._zeVeBadge !== 'function') return;
        [300, 900, 1800].forEach(function (ms) {
            setTimeout(function () { try { dx._zeVeBadge({}); } catch (e) { } }, ms);
        });
    });
}

/*==============================================================================
== THANH THÔNG TIN SINH VIÊN TRÊN ĐẦU MODAL  (2026-09-12)
==
== Vấn đề: badge chỉ dò tên cột trong chính bản ghi mà trang danh sách truyền
== sang. Ba trang xem / danh sách / cập nhật hồ sơ lấy dữ liệu từ
== SV_HoSo/LayDanhSach — bản ghi đó chỉ có MASO / HODEM / TEN / NGAYSINH, KHÔNG
== có Lớp / Ngành / Khoa / Niên khoá, nên mấy chip đó rỗng vĩnh viễn dù phần vẽ
== chạy đúng.
==
== Thanh sinh viên bên trang Thu tiền (ApisTaiChinh/phieuthu/thutien.js:1628)
== lấy từ PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All — API đó trả sẵn
== DAOTAO_LOPQUANLY_N1_TEN / NGANHHOC_N1_TEN / KHOAHOC_N1_TEN / NIENKHOA_N1 và
== trạng thái học. Ở đây gọi đúng API đó theo MÃ SỐ của hồ sơ đang mở rồi vẽ lại
== thanh cho giống, thay vì đoán tên cột.
==
== Dữ liệu về trễ hơn lúc mở form, nên bản vẽ cũ (Mã + Họ tên) vẫn giữ làm nền:
== có dữ liệu đầy đủ thì _zeVeBadge tự chuyển sang bản đầy đủ, chưa có thì để
== nguyên chứ không xoá trắng.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype._zeVeBadge
    && !DeXuatHoSo.prototype._zeThanhSVHooked) {
    DeXuatHoSo.prototype._zeThanhSVHooked = true;

    // Lấy nguyên của thutien.js getList_HSSV — action string là khoá để BE giải mã,
    // sai 1 ký tự là hỏng nên tuyệt đối không sửa/đoán.
    var _ZE_SV_ACTION = 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIh4ALS0P';

    // Bộ trạng thái lấy nguyên switch của thutien.viewForm_DoiTuong, đổi class
    // label-* sang mã màu vì header modal nền xanh đậm, không dùng label của theme.
    var _ZE_TRANGTHAI = {
        'NORMAL': ['#16a34a', 'fa-users', 'Đang học'],
        'CHUYENTRUONG': ['#16a34a', 'fa-sign-in', 'Chuyển trường đến'],
        'GRADUATE': ['#0284c7', 'fa-graduation-cap', 'Tốt nghiệp'],
        'RESERVE': ['#0284c7', 'fa-user-secret', 'Bảo lưu'],
        'CANHBAO': ['#d97706', 'fa-exclamation-triangle', 'Cảnh báo'],
        'REPEATE': ['#d97706', 'fa-exclamation-triangle', 'Học lại'],
        'DROPOUT': ['#d97706', 'fa-exclamation-triangle', 'Thôi học'],
        'KHONGXACDINH': ['#d97706', 'fa-exclamation-triangle', 'Không xác định'],
        'DUNGHOC': ['#d97706', 'fa-ban', 'Đình chỉ'],
        'FORCEDROPOUT': ['#dc2626', 'fa-exclamation-triangle', 'Buộc thôi học'],
        'XOATEN': ['#dc2626', 'fa-user-times', 'Xóa tên'],
        'CHUYENTRUONGDI': ['#dc2626', 'fa-sign-out', 'Chuyển trường đi']
    };

    var _zeEsc = function (s) {
        return ((s === null || s === undefined) ? '' : s + '').replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };

    /*------------------------------------------
    -- Mã số của hồ sơ đang mở. Mỗi trang đặt tên cột một kiểu, và luồng mở modal
    -- kiểu cũ không truyền person nên phải lấy thêm từ ô đã điền trên form.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeMaSoDangMo = function (person) {
        var dx = this;
        var a = (person && person.aData) || {};
        var ma = (person && person.ma) || dx._zeLay(a, ['MASO', 'MA', 'MA_NGUOI_HOC', 'MA_SV',
            'STUDENT_CODE', 'QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_MA', 'MA_HS']);
        if (!ma) ma = (($('#txt_MaSoSV').val() || $('#txtMaSoSV').val() || '') + '').trim();
        return ma;
    };

    /*------------------------------------------
    -- Nạp bản ghi đầy đủ theo mã số. Một sinh viên học nhiều ngành sẽ có nhiều
    -- dòng nên ưu tiên dòng khớp Id hồ sơ đang mở, sau đó mới tới dòng khớp mã.
    -- dBoQuaPhamVi = 0 y như bên Thu tiền: giữ đúng phạm vi dữ liệu của người dùng,
    -- không tự ý nới quyền. Phạm vi chặn thì không có dòng nào → thanh giữ nguyên
    -- phần Mã + Họ tên chứ không trống đi.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeNapTTSinhVien = function (person) {
        var dx = this;
        var personId = (person && person.id) || dx.strDeXuatHoSo_Id || dx._lockedPersonId || '';
        var maSo = dx._zeMaSoDangMo(person);
        if (!maSo) { zeNoLog('[ZE ThanhSV] chưa có mã số → bỏ qua'); return; }
        if (dx._zeSVDangTai === maSo) return;          // đang gọi cho đúng hồ sơ này rồi
        dx._zeSVDangTai = maSo;
        edu.system.makeRequest({
            success: function (data) {
                var rows = (data && data.Success && data.Data) || [];
                if (!rows.length) { zeNoLog('[ZE ThanhSV] không có dòng nào cho mã ' + maSo); return; }
                var row = (personId && rows.filter(function (r) { return r.ID == personId; })[0])
                    || rows.filter(function (r) { return ((r.MASO || '') + '') === maSo; })[0]
                    || rows[0];
                if (!row) return;
                dx._zeTTSinhVien = row;
                // Vẽ lại ngay + thêm 1 mốc trễ phòng khi bản vẽ cũ chạy sau đè lên
                try { dx._zeVeBadge(person || {}); } catch (e) { }
                setTimeout(function () { try { dx._zeVeBadge(person || {}); } catch (e) { } }, 500);
            },
            error: function (er) { zeNoLog('[ZE ThanhSV] err: ' + er); },
            type: 'POST',
            contentType: true,
            action: _ZE_SV_ACTION,
            data: {
                'action': _ZE_SV_ACTION,
                'func': 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All',
                'iM': edu.system.iM,
                'strTuKhoa': maSo,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': '',
                'strDaoTao_HeDaoTao_Id': '',
                'strDaoTao_KhoaDaoTao_Id': '',
                'strDaoTao_ChuongTrinh_Id': '',
                'strDaoTao_KhoaQuanLy_Id': '',
                'strDaoTao_LopQuanLy_Id': '',
                'strStudyStatus_Ids': '',
                'dIsPrimary': '',
                'dBoQuaPhamVi': 0,
                'pageIndex': 1,
                'pageSize': 20
            },
            fakedb: []
        }, false, false, false, null);
    };

    /*------------------------------------------
    -- CHỖ ĐẶT THANH: một dải riêng nằm GIỮA header và thanh tab, KHÔNG nhét vào
    -- trong header nữa.
    -- Lý do (12/09/2026): header modal cao cố định theo CSS của trang, nhét badge
    -- vào là nội dung tràn ra khỏi vùng nền xanh — chữ trắng rơi lên nền trắng của
    -- trang nên nhìn như mất hẳn, chỉ còn mấy khung mờ. Dải riêng tự giãn theo nội
    -- dung, nền sáng chữ đậm nên không phụ thuộc màu header của từng trang.
    -- Tự tạo nếu chưa có, nên trang nào cũng chạy kể cả markup modal kiểu cũ.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeOThanhSV = function () {
        var el = document.getElementById('zeThanhSV');
        if (el) return el;
        var modal = document.getElementById('zoneEdit');
        if (!modal) return null;
        el = document.createElement('div');
        el.id = 'zeThanhSV';
        el.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;'
            + 'padding:11px 24px;background:#f8fafc;border-bottom:1px solid #e2e8f0;'
            + 'color:#0f172a;font-size:13px;line-height:1.5;';
        var tabbar = modal.querySelector('.zoneEdit-tabbar');
        var header = modal.querySelector('.box-header');
        if (tabbar && tabbar.parentNode) tabbar.parentNode.insertBefore(el, tabbar);
        else if (header && header.parentNode) header.parentNode.insertBefore(el, header.nextSibling);
        else modal.insertBefore(el, modal.firstChild);
        return el;
    };

    /*------------------------------------------
    -- Vẽ thanh: trạng thái + HỌ TÊN - Mã - SĐT, rồi Lớp / Ngành / Khoa / Niên khoá.
    -- Bố cục bám theo #zoneSinhVien của thutien.html.
    -- Chưa có bản ghi đầy đủ vẫn vẽ được phần Họ tên + Mã lấy từ chính form, nên
    -- thanh hiện ngay lúc mở chứ không đợi API.
    -- Style inline hết: mỗi trang một stylesheet, không chắc trang nào cũng có CSS
    -- của file này.
    -------------------------------------------*/
    DeXuatHoSo.prototype._zeVeThanhSV = function (person) {
        var dx = this;
        var row = dx._zeTTSinhVien || {};
        var el = dx._zeOThanhSV();
        if (!el) return false;

        var hoTen = dx._zeLay(row, ['FULL_NAME', 'HOTEN', 'HO_TEN'])
            || [dx._zeLay(row, ['HODEM']), dx._zeLay(row, ['TEN'])]
                .filter(function (x) { return x; }).join(' ');
        if (!hoTen) hoTen = (($('#txtHoVaTen').val() || '') + '').trim();
        if (!hoTen) {
            hoTen = [(($('#txtHo').val() || '') + '').trim(), (($('#txtTenDem').val() || '') + '').trim(),
            (($('#txtTen').val() || '') + '').trim()].filter(function (x) { return x; }).join(' ');
        }
        var maSo = dx._zeLay(row, ['MASO']) || dx._zeMaSoDangMo(person);
        var sdt = dx._zeLay(row, ['TTLL_DIENTHOAICANHAN', 'DIENTHOAI', 'PHONE']);
        var lop = dx._zeLay(row, ['DAOTAO_LOPQUANLY_N1_TEN', 'DAOTAO_LOPQUANLY_TEN', 'LOP_TEN', 'LOP']);
        var nganh = dx._zeLay(row, ['NGANHHOC_N1_TEN', 'DAOTAO_NGANH_TEN', 'NGANH_TEN', 'NGANH']);
        var khoa = dx._zeLay(row, ['KHOAHOC_N1_TEN', 'DAOTAO_KHOAQUANLY_TEN', 'KHOA_TEN', 'KHOAQUANLY']);
        var nienKhoa = dx._zeLay(row, ['NIENKHOA_N1', 'NIENKHOA']);
        if (!hoTen && !maSo) return false;

        // Trạng thái: ưu tiên chữ BE trả về (có trường đặt lại nhãn riêng), mã chỉ
        // dùng để chọn màu + icon. Mã lạ thì vẫn hiện chữ của BE, không nuốt mất.
        // Không có cả mã lẫn tên thì KHÔNG vẽ nhãn: thà thiếu còn hơn hiện
        // "Đang học" mặc định lên một hồ sơ đã thôi học/tốt nghiệp.
        var ttMa = ((dx._zeLay(row, ['QLSV_TRANGTHAINGUOIHOC_MA']) || '') + '').toUpperCase();
        var ttTen = dx._zeLay(row, ['QLSV_TRANGTHAINGUOIHOC_TEN']);
        var tt = null;
        if (ttMa || (ttTen && ttTen !== '-')) {
            tt = _ZE_TRANGTHAI[ttMa] || ['#64748b', 'fa-info-circle', ttTen || ttMa];
            if (ttTen && ttTen !== '-') tt = [tt[0], tt[1], ttTen];
        }

        // Nền sáng nên chữ phải đậm: nhãn xám đậm, giá trị gần như đen (đúng mức
        // tương phản đã chốt cho toàn hệ thống).
        var chip = function (icon, nhan, gt) {
            if (!gt) return '';
            return '<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 11px;'
                + 'background:#ffffff;border:1px solid #dbe3ec;border-radius:6px;'
                + 'font-size:12.5px;line-height:1.4;max-width:360px;overflow:hidden;'
                + 'text-overflow:ellipsis;white-space:nowrap;">'
                + '<i class="fa ' + icon + '" style="color:#2563eb"></i>'
                + '<span style="color:#64748b;font-weight:500">' + nhan + ':</span>'
                + '<b style="color:#0f172a;font-weight:600">' + _zeEsc(gt) + '</b></span>';
        };

        var dong1 = (tt ? ('<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 11px;'
            + 'background:' + tt[0] + ';border-radius:6px;color:#fff;font-size:12.5px;'
            + 'font-weight:600;line-height:1.4;white-space:nowrap;">'
            + '<i class="fa ' + tt[1] + '" style="color:#fff"></i>' + _zeEsc(tt[2]) + '</span>') : '')
            + '<span style="color:#0f172a;font-size:15px;font-weight:700;letter-spacing:.2px;">'
            + _zeEsc((hoTen || '').toUpperCase()) + '</span>';
        if (maSo) dong1 += '<span style="color:#334155;font-size:13.5px;font-weight:600;">- ' + _zeEsc(maSo) + '</span>';
        if (sdt) dong1 += '<span style="color:#334155;font-size:13.5px;font-weight:600;">- ' + _zeEsc(sdt) + '</span>';

        var dong2 = chip('fa-users', 'Lớp', lop) + chip('fa-book', 'Ngành', nganh)
            + chip('fa-university', 'Khoa', khoa) + chip('fa-calendar', 'Niên khoá', nienKhoa);

        var hang = 'display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;';
        el.innerHTML = '<div style="' + hang + '">' + dong1 + '</div>'
            + (dong2 ? '<div style="' + hang + 'width:100%;">' + dong2 + '</div>' : '');

        // Ép hiển thị phòng khi stylesheet của trang ẩn/thu khối này.
        try {
            var ep = {
                'display': 'flex', 'flex-wrap': 'wrap', 'align-items': 'center',
                'gap': '8px 16px', 'width': '100%', 'visibility': 'visible', 'opacity': '1',
                'max-height': 'none', 'overflow': 'visible'
            };
            for (var k in ep) {
                if (Object.prototype.hasOwnProperty.call(ep, k)) el.style.setProperty(k, ep[k], 'important');
            }
        } catch (e) { }

        // Dọn chỗ cũ: badge trong header từng vẽ cùng nội dung, để lại thì vừa trùng
        // vừa tràn ra ngoài nền xanh thành mấy khung mờ.
        try {
            var badgeCu = document.getElementById('zeHeaderBadge');
            if (badgeCu) { badgeCu.innerHTML = ''; badgeCu.style.setProperty('display', 'none', 'important'); }
        } catch (e) { }
        return true;
    };

    /*------------------------------------------
    -- Có bản ghi đầy đủ thì vẽ thanh đầy đủ, chưa có thì để bản cũ chạy. Bọc chứ
    -- không thay hẳn: mọi chỗ đang gọi _zeVeBadge (mốc 0/400/1200ms và cú click
    -- .btnEdit) tự động hưởng, không phải sửa thêm chỗ nào.
    -------------------------------------------*/
    var _origVeBadgeTT = DeXuatHoSo.prototype._zeVeBadge;
    DeXuatHoSo.prototype._zeVeBadge = function (person) {
        var dx = this;
        // Vẽ được dải riêng thì thôi, khỏi đụng badge trong header. Dải vẽ được
        // ngay cả khi API chưa về (lấy Họ tên + Mã từ form), nên gần như luôn
        // thắng; chỉ khi form trống trơn mới rơi về bản cũ.
        try { if (dx._zeVeThanhSV(person)) return; } catch (e) { console.warn('[ZE ThanhSV] vẽ lỗi:', e); }
        return _origVeBadgeTT.call(dx, person);
    };

    /*------------------------------------------
    -- Mở hồ sơ khác thì phải quên bản ghi của hồ sơ trước, nếu không thanh sẽ
    -- đứng nguyên thông tin người cũ.
    -------------------------------------------*/
    var _origOpenTT = DeXuatHoSo.prototype.openEditByPerson;
    DeXuatHoSo.prototype.openEditByPerson = function (person) {
        var dx = this;
        dx._zeTTSinhVien = null;
        dx._zeSVDangTai = '';
        _origOpenTT.call(dx, person);
        try { dx._zeNapTTSinhVien(person); } catch (e) { console.warn('[ZE ThanhSV] nạp lỗi:', e); }
    };

    /*------------------------------------------
    -- Chốt cho luồng mở kiểu cũ (không đi qua openEditByPerson): sau khi form nạp
    -- xong thì mã số đã nằm trên form, đủ để tự đi lấy bản ghi đầy đủ.
    -------------------------------------------*/
    $(document).on('click.zethanhsv', '.btnEdit, .btnSelect_NguoiHoc_ThuHS', function () {
        var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
        if (!dx || typeof dx._zeNapTTSinhVien !== 'function') return;
        setTimeout(function () {
            if (dx._zeTTSinhVien) return;          // openEditByPerson lo rồi
            try { dx._zeNapTTSinhVien(null); } catch (e) { }
        }, 1000);
    });
}

/*==========================================================================
-- 2026-09-14: Ô "Ngày sinh (đầy đủ)" — gộp Ngày/Tháng/Năm thành một chuỗi
-- dd/mm/yyyy để copy một phát là xong, khỏi phải ghép tay từ 3 ô.
-- Ô này KHÔNG gửi lên BE (payload vẫn đọc txtNgaySinh/txtThangSinh/txtNamSinh);
-- nó chỉ đồng bộ 2 chiều với 3 ô gốc, nên dán ngược vào cũng tách ra được.
==========================================================================*/
(function () {
    var ID_FULL = 'txtNgaySinhDayDu';

    function el(id) { return document.getElementById(id); }
    function raw(id) { var e = el(id); return ((e && e.value) || '') + ''; }
    function pad2(v) {
        v = (v + '').trim().replace(/\D/g, '');
        return !v ? '' : (v.length === 1 ? '0' + v : v);
    }

    /*------------------------------------------
    -- 3 ô gốc -> ô gộp. Mức độ ngày sinh có thể là MONTH_ONLY/YEAR_ONLY nên
    -- thiếu ngày/tháng thì rút gọn chứ không đẻ ra "00/00/1997".
    -------------------------------------------*/
    function zeGopNgaySinh() {
        var full = el(ID_FULL);
        if (!full) return;
        var d = pad2(raw('txtNgaySinh'));
        var m = pad2(raw('txtThangSinh'));
        var y = raw('txtNamSinh').trim().replace(/\D/g, '');
        var out = '';
        if (y) out = (d && m) ? (d + '/' + m + '/' + y) : (m ? (m + '/' + y) : y);
        else if (d && m) out = d + '/' + m;
        full.value = out;
    }

    /*------------------------------------------
    -- Ô gộp -> 3 ô gốc. Chỉ tách khi chuỗi khớp hẳn một dạng hợp lệ; gõ dở dang
    -- thì để nguyên, không được phép xoá trắng dữ liệu 3 ô kia.
    -------------------------------------------*/
    function zeTachNgaySinh() {
        var full = el(ID_FULL);
        if (!full) return;
        var s = (full.value || '').trim();
        if (!s) return;
        var d = '', m = '', y = '', mt;
        if ((mt = s.match(/^(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{4})$/))) { d = mt[1]; m = mt[2]; y = mt[3]; }
        else if ((mt = s.match(/^(\d{4})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{1,2})$/))) { y = mt[1]; m = mt[2]; d = mt[3]; }
        else if ((mt = s.match(/^(\d{1,2})\s*[\/\-.]\s*(\d{4})$/))) { m = mt[1]; y = mt[2]; }
        else if ((mt = s.match(/^(\d{2})(\d{2})(\d{4})$/))) { d = mt[1]; m = mt[2]; y = mt[3]; }
        else if ((mt = s.match(/^(\d{4})$/))) { y = mt[1]; }
        else { zeGopNgaySinh(); return; }               // không nhận dạng được -> trả về giá trị cũ
        if (d && (+d < 1 || +d > 31)) { zeGopNgaySinh(); return; }
        if (m && (+m < 1 || +m > 12)) { zeGopNgaySinh(); return; }
        if (el('txtNgaySinh')) el('txtNgaySinh').value = pad2(d);
        if (el('txtThangSinh')) el('txtThangSinh').value = pad2(m);
        if (el('txtNamSinh')) el('txtNamSinh').value = y;
        zeGopNgaySinh();                               // chuẩn hoá lại hiển thị
    }

    $(document).on('input.zedob change.zedob', '#txtNgaySinh, #txtThangSinh, #txtNamSinh', zeGopNgaySinh);
    $(document).on('change.zedob blur.zedob', '#' + ID_FULL, zeTachNgaySinh);

    /*-- Click phát là bôi đen sẵn, Ctrl+C được luôn. --*/
    $(document).on('focus.zedob', '#' + ID_FULL, function () {
        var t = this;
        setTimeout(function () { try { t.select(); } catch (e) { } }, 0);
    });

    /*------------------------------------------
    -- viewValById() nạp bằng .val() nên không bắn event 'input' -> phải tự gọi
    -- lại sau khi form nạp xong. openEditByPerson thật nằm ở dexuathoso.js nên
    -- WRAP chứ không định nghĩa mới.
    -------------------------------------------*/
    if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.openEditByPerson) {
        var _origOpenDOB = DeXuatHoSo.prototype.openEditByPerson;
        DeXuatHoSo.prototype.openEditByPerson = function (person) {
            var r = _origOpenDOB.apply(this, arguments);
            setTimeout(zeGopNgaySinh, 0);
            setTimeout(zeGopNgaySinh, 400);
            return r;
        };
    }

    /*-- Luồng mở kiểu cũ (.btnEdit) không đi qua openEditByPerson. --*/
    $(document).on('click.zedob', '.btnEdit, .btnSelect_NguoiHoc_ThuHS', function () {
        setTimeout(zeGopNgaySinh, 600);
        setTimeout(zeGopNgaySinh, 1200);
    });
})();

/*==============================================================================
== CHỐT AN TOÀN: KHÔNG XÁC ĐỊNH ĐƯỢC HỒ SƠ THÌ KHÔNG ĐƯỢC LƯU  (21/09/2026)
==
== Sự cố: máy khách báo "sửa thông tin học sinh không cho sửa", màn hình ném
==   ORA-01400: cannot insert NULL into ("TRIENKHAICKNV"."CORE_PERSON"."INITIAL_CONTEXT_CODE")
== Lỗi của câu INSERT, tức lúc đó luồng lưu đi nhánh InsertCorePerson chứ không
== phải UpdateCorePerson — mà người dùng đang SỬA.
==
== Vì sao mất Id: openEditByPerson thoát ngay ở dòng đầu khi person.id rỗng
== (dexuathoso.js:5541), nên strDeXuatHoSo_Id lẫn _lockedPersonId đều chưa từng
== được gán. Ba trang dựng form ngay trong trang (Xem hồ sơ / Danh sách / Cập
== nhật) thì form LUÔN hiển thị sẵn, không phải bật ra, nên người dùng không hề
== biết hồ sơ chưa nạp được: cứ gõ rồi bấm Lưu.
== save_DeXuatHoSo thấy strId rỗng là mặc định coi như thêm mới.
==
== Chốt này đứng ngay trước lúc gửi request:
==   - Id còn giữ được ở chỗ khác  → đổi sang UpdateCorePerson, sửa đúng hồ sơ;
==   - không còn gì để bám         → CHẶN, không gửi, báo người dùng chọn lại.
== Thà không lưu còn hơn đẻ ra hồ sơ rác hoặc ném mã lỗi Oracle vào mặt người dùng.
==
== Chỉ 4 trang sửa hồ sơ nạp file này; trang Tạo hồ sơ (hoso_taomoi.html) không
== include nên luồng thêm mới thật không bị đụng tới.
==============================================================================*/
if (typeof edu !== 'undefined' && edu.system && edu.system.makeRequest
    && !edu.system._zeChanInsertCorePerson) {
    edu.system._zeChanInsertCorePerson = true;

    // Lấy nguyên action string nhánh Update của save_DeXuatHoSo — không tự bịa
    var _ZE_CP_UPD = 'NS_HoSoNhanSu5_MH/FDElIDUkAi4zJBEkMzIuLwPP';

    /*------------------------------------------
    -- Báo ngay dưới thanh thông tin sinh viên, KHÔNG nhét vào trong tab: người
    -- dùng có thể đang đứng ở tab Định danh hay Xuất hoá đơn, báo trong tab khác
    -- thì họ không nhìn thấy. Cũng không dùng edu.system.alert vì alert của BS3
    -- chồng lên nhau sẽ gỡ body.modal-open làm form đang mở tự đóng.
    -------------------------------------------*/
    var _zeBaoChanLuu = function (msg) {
        var modal = document.getElementById('zoneEdit');
        if (!modal) return;
        var el = document.getElementById('zeChanLuu');
        if (!el) {
            el = document.createElement('div');
            el.id = 'zeChanLuu';
            el.style.cssText = 'margin:0;padding:11px 24px;background:#fef2f2;'
                + 'border-bottom:1px solid #fca5a5;color:#b91c1c;font-size:13.5px;'
                + 'font-weight:600;line-height:1.5;';
            var moc = document.getElementById('zeThanhSV') || modal.querySelector('.box-header');
            if (moc && moc.parentNode) moc.parentNode.insertBefore(el, moc.nextSibling);
            else modal.insertBefore(el, modal.firstChild);
        }
        el.textContent = msg;
        el.style.display = '';
    };
    window._zeXoaChanLuu = function () {
        var el = document.getElementById('zeChanLuu');
        if (el) el.style.display = 'none';
    };

    var _mrTruoc = edu.system.makeRequest;
    edu.system.makeRequest = function (o) {
        try {
            if (o && o.data && o.data.func === 'PKG_CORE_HOSONHANSU_05.InsertCorePerson') {
                var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
                var pid = dx ? ((dx._lockedPersonId || dx.strDeXuatHoSo_Id || '') + '').trim() : '';
                if (pid) {
                    // Id mất giữa chừng nhưng còn bản sao → sửa đúng hồ sơ, không thêm mới
                    o.data.strId = pid;
                    o.data.func = 'PKG_CORE_HOSONHANSU_05.UpdateCorePerson';
                    o.data.action = _ZE_CP_UPD;
                    o.action = _ZE_CP_UPD;
                    dx.strDeXuatHoSo_Id = pid;
                    console.warn('[ZE] Luồng lưu định gọi InsertCorePerson khi đang sửa'
                        + ' → đã chuyển sang UpdateCorePerson với Id ' + pid);
                } else {
                    // Không còn gì để bám: chặn hẳn, và hạ cờ để khỏi báo "Lưu thành công"
                    if (dx) dx.icheck = false;
                    _zeBaoChanLuu('Chưa chọn được hồ sơ nên không lưu được.'
                        + ' Vui lòng bấm chọn lại sinh viên trong danh sách rồi nhập lại.');
                    console.warn('[ZE] CHẶN InsertCorePerson: không xác định được hồ sơ đang mở'
                        + ' (strDeXuatHoSo_Id và _lockedPersonId đều rỗng).');
                    return;                       // không gửi request
                }
            }
        } catch (e) { }
        return _mrTruoc.apply(this, arguments);
    };

    // Mở hồ sơ khác thì dọn thông báo cũ
    if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.openEditByPerson) {
        var _origOpenChan = DeXuatHoSo.prototype.openEditByPerson;
        DeXuatHoSo.prototype.openEditByPerson = function (person) {
            if (person && person.id && typeof window._zeXoaChanLuu === 'function') window._zeXoaChanLuu();
            return _origOpenChan.apply(this, arguments);
        };
    }
}

/*==============================================================================
== KHÔI PHỤC LIÊN HỆ BỊ TẮT CỜ  (21/09/2026)
==
== Bản xoá mềm ngày 16/09 coi "ô trống = muốn xoá" nên đã tắt cờ nhầm một số bản
== ghi email/điện thoại. Dữ liệu KHÔNG mất — chỉ là IS_ACTIVE = 0, nên bật lại
== được. Điều kiện phát sinh đã vá, hàm này để dọn hậu quả.
==
== Gõ trong Console khi đang mở hồ sơ:  _zeKhoiPhucLienHe()
==============================================================================*/
window._zeKhoiPhucLienHe = function () {
    var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
    if (!dx) { console.warn('Chưa có main_doc.DeXuatHoSo'); return; }
    var pid = ((dx.strDeXuatHoSo_Id || dx._lockedPersonId || '') + '').trim();
    if (!pid) { console.warn('Chưa mở hồ sơ nào'); return; }

    var GET = 'NS_HoSoNhanSu5_MH/BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl';
    var UPD = 'NS_HoSoNhanSu5_MH/FDElIDUkESQzMi4vAi4vNSAiNQPP';

    edu.system.makeRequest({
        success: function (data) {
            var rows = (data && data.Success && data.Data) || [];
            // Chỉ những bản ghi đang bị tắt cờ mới cần bật lại
            var tat = rows.filter(function (x) {
                return x && x.IS_ACTIVE !== undefined && x.IS_ACTIVE !== null && x.IS_ACTIVE != 1;
            });
            if (!tat.length) { console.log('Hồ sơ này không có liên hệ nào bị tắt cờ.'); return; }
            console.log('Đang bật lại ' + tat.length + ' bản ghi:',
                tat.map(function (x) { return x.CONTACT_VALUE || x.VALUE; }));
            var conLai = tat.length;
            tat.forEach(function (x) {
                edu.system.makeRequest({
                    success: function (d) {
                        console.log((d && d.Success ? '✔ ' : '✘ ') + (x.CONTACT_VALUE || x.VALUE)
                            + (d && d.Message ? ' — ' + d.Message : ''));
                    },
                    error: function (er) { console.warn('lỗi:', er); },
                    complete: function () {
                        if (--conLai === 0 && typeof dx.getList_LienHe === 'function') {
                            setTimeout(function () { dx.getList_LienHe(); }, 200);
                            console.log('Xong. Đóng form mở lại để xem kết quả.');
                        }
                    },
                    type: 'POST', contentType: true, action: UPD,
                    data: {
                        'action': UPD,
                        'func': 'PKG_CORE_HOSONHANSU_05.UpdatePersonContact',
                        'iM': edu.system.iM,
                        'strId': x.ID,
                        'strChucNang_Id': edu.system.strChucNang_Id,
                        'strPersonId': pid,
                        'strContactTypeCode': x.CONTACT_TYPE_CODE_ID || x.CONTACT_TYPE_CODE,
                        'strContactValue': x.CONTACT_VALUE || x.VALUE,
                        'dIsPrimary': (x.IS_PRIMARY == 1) ? 1 : 0,
                        'dIsActive': 1,
                        'dIs_Active': 1,
                        'strNguoiThucHien_Id': edu.system.userId
                    },
                    fakedb: []
                }, false, false, false, null);
            });
        },
        error: function (er) { console.warn('Không đọc được danh sách liên hệ:', er); },
        type: 'POST', contentType: true, action: GET,
        data: {
            'action': GET,
            'func': 'PKG_CORE_HOSONHANSU_05.GetPersonContactByPerson_Id',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strPerson_Id': pid
        },
        fakedb: []
    }, false, false, false, null);
};

/*==============================================================================
== CẦU NỐI TAB 1 XOÁ TRẮNG Ô NGƯỜI DÙNG VỪA GÕ Ở TAB 2  (21/09/2026)
==
== Hiện tượng: nhập đủ 4 ô trong tab "Định danh & Liên hệ" (TAX_CODE, CCCD, Điện
== thoại, Email) rồi Lưu → báo thành công nhưng CHỈ TAX_CODE được lưu.
==
== Vì sao đúng TAX_CODE sống: nó là ô duy nhất không có cầu nối từ tab 1.
== Hai hàm cầu nối của luồng gốc ghi đè VÔ ĐIỀU KIỆN:
==   _bridgeCccdToShadow : $('#txtSoDinhDinh'+cid).val( $('#txtCCCD_So').val() )
==   _bridgeOneLienHe    : $('#txtLienHe'+typeId).val( $('#'+uiFieldId).val() )
== Chúng chạy ngay đầu handler nút Lưu. Người dùng gõ thẳng vào bảng ở tab 2 mà
== không đụng tab 1 → ô tab 1 rỗng → cầu nối ghi rỗng đè lên đúng thứ vừa gõ →
== save_DinhDanh / save_LienHe thấy rỗng là bỏ qua, không gửi gì.
==
== Cách xử lý: chụp giá trị các ô trong bảng TRƯỚC khi cầu nối chạy, xong thì ô
== nào bị làm rỗng mà trước đó có giá trị thì trả lại. Không đụng vào logic phân
== loại của bản gốc, và không đè lên giá trị hợp lệ mà cầu nối vừa ghi vào (chỉ
== khôi phục khi ô đang rỗng).
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype._bridgeLienHeToShadow
    && !DeXuatHoSo.prototype._zeGiuOBangHooked) {
    DeXuatHoSo.prototype._zeGiuOBangHooked = true;

    // Chụp giá trị hiện có của một nhóm ô trong bảng, theo danh mục loại
    var _zeChup = function (dsLoai, cacTienTo) {
        var luu = [];
        (dsLoai || []).forEach(function (l) {
            cacTienTo.forEach(function (tt) {
                var $o = $('#' + tt + l.ID);
                if (!$o.length) return;
                var v = (($o.val() || '') + '');
                if (v.trim()) luu.push({ id: tt + l.ID, val: v });
            });
        });
        return luu;
    };

    // Trả lại những ô bị làm rỗng; ô nào đang có giá trị thì để yên
    var _zeTraLai = function (luu) {
        (luu || []).forEach(function (m) {
            var $o = $('#' + m.id);
            if ($o.length && !(($o.val() || '') + '').trim()) $o.val(m.val);
        });
    };

    var _origLH_Giu = DeXuatHoSo.prototype._bridgeLienHeToShadow;
    DeXuatHoSo.prototype._bridgeLienHeToShadow = function () {
        var luu = [];
        try { luu = _zeChup(this.dtLoaiLienHe, ['txtLienHe']); } catch (e) { }
        var kq = _origLH_Giu.apply(this, arguments);
        try { _zeTraLai(luu); } catch (e) { }
        return kq;
    };

    if (DeXuatHoSo.prototype._bridgeCccdToShadow) {
        var _origDD_Giu = DeXuatHoSo.prototype._bridgeCccdToShadow;
        DeXuatHoSo.prototype._bridgeCccdToShadow = function () {
            var luu = [];
            try {
                luu = _zeChup(this.dtLoaiDinhDanh, ['txtSoDinhDinh', 'txtNgayCap', 'txtNoiCap']);
            } catch (e) { }
            var kq = _origDD_Giu.apply(this, arguments);
            try { _zeTraLai(luu); } catch (e) { }
            return kq;
        };
    }
}

/*==============================================================================
== SOI TỪNG Ô LÚC LƯU ĐỊNH DANH / LIÊN HỆ  (21/09/2026 — tạm thời)
==
== Nhập đủ 4 ô ở tab Định danh & Liên hệ nhưng mở lại chỉ còn TAX_CODE. Bản vá
== chặn cầu nối ghi đè rỗng chưa đủ, nên thay vì đoán tiếp thì in thẳng ra: mỗi
== loại đọc được giá trị gì từ ô nào, có Id bản ghi chưa, và luồng gốc quyết định
== GỬI hay BỎ QUA. Chỗ nào mất dữ liệu sẽ lộ ngay.
==
== Xong việc thì tắt bằng cách bọc lại dòng console.log trong zeDebug ở đầu file.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._zeSoiLuuConHooked) {
    DeXuatHoSo.prototype._zeSoiLuuConHooked = true;

    [['save_DinhDanh', 'txtSoDinhDinh'], ['save_LienHe', 'txtLienHe']].forEach(function (c) {
        var ten = c[0], tienTo = c[1];
        var goc = DeXuatHoSo.prototype[ten];
        if (typeof goc !== 'function') return;
        DeXuatHoSo.prototype[ten] = function (typeId) {
            try {
                var $o = $('#' + tienTo + typeId);
                var v = (($o.val() || '') + '');
                zeDebug('[ZE ' + ten + ']', {
                    'IdLoại': typeId,
                    'Ô': '#' + tienTo + typeId,
                    'Có trên màn hình': $o.length,
                    'Giá trị đọc được': v,
                    'Id bản ghi': $o.attr('name') || '(rỗng → sẽ INSERT)',
                    'Kết luận': v.trim() ? 'GỬI' : 'BỎ QUA vì ô rỗng'
                });
            } catch (e) { }
            return goc.apply(this, arguments);
        };
    });

    // In luôn toàn cảnh các ô ngay khi bấm Lưu, trước khi chuỗi lưu chạy
    $(document).on('mousedown.zesoi', '#btnSave_DeXuatHoSo', function () {
        var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
        if (!dx) return;
        setTimeout(function () {
            var bang = [];
            (dx.dtLoaiDinhDanh || []).forEach(function (l) {
                bang.push({
                    'Nhóm': 'Định danh', 'Tên loại': l.TEN,
                    'Giá trị': ($('#txtSoDinhDinh' + l.ID).val() || ''),
                    'Id bản ghi': $('#txtSoDinhDinh' + l.ID).attr('name') || ''
                });
            });
            (dx.dtLoaiLienHe || []).forEach(function (l) {
                bang.push({
                    'Nhóm': 'Liên hệ', 'Tên loại': l.TEN,
                    'Giá trị': ($('#txtLienHe' + l.ID).val() || ''),
                    'Id bản ghi': $('#txtLienHe' + l.ID).attr('name') || ''
                });
            });
            zeDebug('[ZE] Các ô ngay sau khi bấm Lưu:');
            if (console.table) console.table(bang); else zeDebug(bang);
        }, 50);
    });
}

/*==============================================================================
== SOI TIẾP: CHUỖI LƯU CHẾT Ở ĐÂU  (21/09/2026 — tạm thời)
==
== Log lượt trước cho thấy 4 ô còn nguyên dữ liệu lúc bấm Lưu, nhưng save_DinhDanh
== và save_LienHe KHÔNG hề được gọi. Hai hàm đó nằm trong success của CorePerson,
== nên điểm chết chỉ có thể là:
==   - CorePerson trả Success = false, hoặc
==   - cờ icheck bị một hàm KiemTraThongTin... hạ xuống false ("Dữ liệu tồn tại"),
==     khiến save_DeXuatHoSo thoát ngay dòng đầu.
== Phần này in ra cả hai.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && !DeXuatHoSo.prototype._zeSoiChuoiLuuHooked) {
    DeXuatHoSo.prototype._zeSoiChuoiLuuHooked = true;

    if (DeXuatHoSo.prototype.save_DeXuatHoSo) {
        var _gocSaveSoi = DeXuatHoSo.prototype.save_DeXuatHoSo;
        DeXuatHoSo.prototype.save_DeXuatHoSo = function () {
            zeDebug('[ZE save_DeXuatHoSo] được gọi', {
                'icheck': this.icheck,
                'strDeXuatHoSo_Id': this.strDeXuatHoSo_Id || '(rỗng → sẽ INSERT)',
                '_lockedPersonId': this._lockedPersonId || ''
            });
            if (!this.icheck) {
                zeDebug('%c[ZE] DỪNG TẠI ĐÂY: icheck = false nên cả lượt lưu bị bỏ qua'
                    + ' (một hàm KiemTraThongTin... đã báo dữ liệu tồn tại)',
                    'color:#dc2626;font-weight:bold');
            }
            return _gocSaveSoi.apply(this, arguments);
        };
    }
}

if (typeof edu !== 'undefined' && edu.system && edu.system.makeRequest
    && !edu.system._zeSoiCorePersonHooked) {
    edu.system._zeSoiCorePersonHooked = true;
    var _mrSoi = edu.system.makeRequest;
    edu.system.makeRequest = function (o) {
        try {
            var f = (o && o.data && o.data.func) || '';
            if (/CorePerson|KiemTraThongTin/.test(f) && typeof o.success === 'function') {
                var ten = f.split('.').pop();
                zeDebug('[ZE →] ' + ten, {
                    'strId': o.data.strId || '(rỗng)',
                    'giá trị kiểm tra': o.data.strIdentifier_No || o.data.strContactValue || '',
                    'loại': o.data.strIdentifier_Type_Code || o.data.strContactTypeCode || ''
                });
                var sgSoi = o.success;
                o.success = function (d) {
                    zeDebug('[ZE ←] ' + ten, {
                        'Success': d && d.Success,
                        'Message': (d && d.Message) || '',
                        'Số dòng trả về': (d && d.Data && d.Data.length !== undefined) ? d.Data.length : '-',
                        'Ghi chú': (/KiemTra/.test(ten) && d && d.Data && d.Data.length > 0)
                            ? '>>> TRÙNG DỮ LIỆU → sẽ hạ cờ icheck, cả lượt lưu bị huỷ' : ''
                    });
                    return sgSoi.apply(this, arguments);
                };
            }
        } catch (e) { }
        return _mrSoi.apply(this, arguments);
    };
}

/*==============================================================================
== BÁO RÕ KHI BỊ CHẶN VÌ TRÙNG DỮ LIỆU  (21/09/2026)
==
== Đã truy ra nguyên nhân "nhập 4 ô, lưu xong chỉ còn 1": không phải mất dữ liệu.
== KiemTraThongTinLienHe thấy email đã tồn tại ở hồ sơ khác → save_KiemTraLienHe
== hạ cờ icheck → save_DeXuatHoSo thoát ngay dòng đầu → CẢ LƯỢT LƯU bị huỷ, kể
== cả những ô hoàn toàn hợp lệ và cả tab Thông tin cơ bản. Ô TAX_CODE trông như
== "lưu được" thật ra đã có bản ghi từ trước chứ không phải vừa ghi.
==
== Đây là quy tắc nghiệp vụ của máy chủ, không sửa ở đây. Nhưng câu thông báo gốc
== "Dữ liệu tồn tại: Email cá nhân" thì quá cụt: không nói giá trị nào trùng, và
== quan trọng nhất là không nói rằng MỌI THỨ VỪA NHẬP ĐỀU KHÔNG ĐƯỢC LƯU. Phần
== này nói đủ ý đó và tô đỏ đúng ô gây ra.
==============================================================================*/
if (typeof edu !== 'undefined' && edu.system && edu.system.makeRequest
    && !edu.system._zeBaoTrungHooked) {
    edu.system._zeBaoTrungHooked = true;

    var _zeBaoTrung = function (msg) {
        var modal = document.getElementById('zoneEdit');
        if (!modal) return;
        var el = document.getElementById('zeChanLuu');
        if (!el) {
            el = document.createElement('div');
            el.id = 'zeChanLuu';
            el.style.cssText = 'margin:0;padding:11px 24px;background:#fef2f2;'
                + 'border-bottom:1px solid #fca5a5;color:#b91c1c;font-size:13.5px;'
                + 'font-weight:600;line-height:1.5;';
            var moc = document.getElementById('zeThanhSV') || modal.querySelector('.box-header');
            if (moc && moc.parentNode) moc.parentNode.insertBefore(el, moc.nextSibling);
            else modal.insertBefore(el, modal.firstChild);
        }
        el.textContent = msg;
        el.style.display = '';
    };

    var _zeToDo = function (oId) {
        var $o = $('#' + oId);
        if (!$o.length) return;
        $o.css({ 'border': '1px solid #dc2626', 'background': '#fef2f2' });
        // Người dùng sửa lại thì trả về bình thường
        $o.off('.zetrung').on('input.zetrung', function () {
            $(this).css({ 'border': '', 'background': '' });
        });
    };

    var _mrTrung = edu.system.makeRequest;
    edu.system.makeRequest = function (o) {
        try {
            var f = (o && o.data && o.data.func) || '';
            if (/KiemTraThongTin(LienHe|DinhDanh)/.test(f) && typeof o.success === 'function') {
                var laLienHe = /LienHe/.test(f);
                var typeId = laLienHe ? o.data.strContactTypeCode : o.data.strIdentifier_Type_Code;
                var giaTri = laLienHe ? o.data.strContactValue : o.data.strIdentifier_No;
                var sgTrung = o.success;
                o.success = function (d) {
                    try {
                        if (d && d.Success && d.Data && d.Data.length > 0) {
                            var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
                            var ds = (dx && (laLienHe ? dx.dtLoaiLienHe : dx.dtLoaiDinhDanh)) || [];
                            var loai = ds.filter(function (l) { return l.ID === typeId; })[0];
                            var tenLoai = (loai && loai.TEN) || (laLienHe ? 'Thông tin liên hệ' : 'Định danh');
                            _zeToDo((laLienHe ? 'txtLienHe' : 'txtSoDinhDinh') + typeId);
                            _zeBaoTrung('Không lưu được: ' + tenLoai
                                + (giaTri ? ' "' + giaTri + '"' : '')
                                + ' đã được dùng ở một hồ sơ khác.'
                                + ' Toàn bộ nội dung vừa nhập trong lần Lưu này đều KHÔNG được ghi lại'
                                + ' — sửa lại ô đang tô đỏ rồi bấm Lưu lần nữa.');
                        }
                    } catch (e) { }
                    return sgTrung.apply(this, arguments);
                };
            }
        } catch (e) { }
        return _mrTrung.apply(this, arguments);
    };

    // Mở hồ sơ khác thì dọn cảnh báo cũ
    if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.openEditByPerson) {
        var _origOpenTrung = DeXuatHoSo.prototype.openEditByPerson;
        DeXuatHoSo.prototype.openEditByPerson = function (person) {
            try {
                var el = document.getElementById('zeChanLuu');
                if (el) el.style.display = 'none';
                $('[id^="txtLienHe"], [id^="txtSoDinhDinh"]').css({ 'border': '', 'background': '' });
            } catch (e) { }
            return _origOpenTrung.apply(this, arguments);
        };
    }
}

/*==============================================================================
== "LÀ THÔNG TIN CHÍNH" CHỈ ĐƯỢC CHỌN MỘT  (21/09/2026)
==
== Máy chủ ném:
==   ORA-00001: unique constraint (TRIENKHAICKNN.UX_PERSON_IDENT_PRIMARY) violated
==   ORA-06512: at "TRIENKHAICKNN.PKG_CORE_HOSONHANSU_05", line 591
== khi tick "Là thông tin chính" cho cả TAX_CODE lẫn CCCD. Ràng buộc đó quy định
== mỗi hồ sơ chỉ được MỘT bản ghi định danh mang cờ chính (liên hệ cũng vậy).
==
== Giao diện lại để ô tick tự do nên người dùng tick được nhiều dòng, và chỉ biết
== mình sai khi nhận một dòng mã lỗi Oracle. Ở đây cho mấy ô đó hành xử như nút
== chọn một trong nhiều: tick dòng này thì dòng khác trong CÙNG bảng tự bỏ tick.
== Hai bảng độc lập nhau — định danh một cái chính, liên hệ một cái chính.
==
== Không tự sửa dữ liệu đang có lúc nạp lên: chỉ can thiệp khi người dùng tự tay
== tick, còn hiển thị thì phản ánh đúng những gì đang nằm dưới cơ sở dữ liệu.
==============================================================================*/
if (typeof jQuery !== 'undefined' && !window._zeMotChinhHooked) {
    window._zeMotChinhHooked = true;

    $(document).on('change.zemotchinh',
        '#tblDinhDanh input[type="checkbox"], #tblLienHe input[type="checkbox"]',
        function () {
            if (!this.checked) return;
            var $bang = $(this).closest('table');
            if (!$bang.length) return;
            $bang.find('input[type="checkbox"]').not(this)
                .prop('checked', false).removeAttr('checked');
        });

    /*------------------------------------------
    -- Dịch mã lỗi Oracle sang câu người dùng hiểu được. Vẫn giữ nguyên mã gốc ở
    -- cuối câu để lúc cần còn tra cứu / gửi cho bên máy chủ.
    -------------------------------------------*/
    if (typeof edu !== 'undefined' && edu.system && edu.system.makeRequest
        && !edu.system._zeDichLoiPrimaryHooked) {
        edu.system._zeDichLoiPrimaryHooked = true;

        var _zeBaoPrimary = function (msg) {
            var modal = document.getElementById('zoneEdit');
            if (!modal) return;
            var el = document.getElementById('zeChanLuu');
            if (!el) {
                el = document.createElement('div');
                el.id = 'zeChanLuu';
                el.style.cssText = 'margin:0;padding:11px 24px;background:#fef2f2;'
                    + 'border-bottom:1px solid #fca5a5;color:#b91c1c;font-size:13.5px;'
                    + 'font-weight:600;line-height:1.5;';
                var moc = document.getElementById('zeThanhSV') || modal.querySelector('.box-header');
                if (moc && moc.parentNode) moc.parentNode.insertBefore(el, moc.nextSibling);
                else modal.insertBefore(el, modal.firstChild);
            }
            el.textContent = msg;
            el.style.display = '';
        };

        var _mrPrimary = edu.system.makeRequest;
        edu.system.makeRequest = function (o) {
            try {
                var f = (o && o.data && o.data.func) || '';
                if (/PersonIdentifier|PersonContact/.test(f) && typeof o.success === 'function') {
                    var sgP = o.success;
                    o.success = function (d) {
                        try {
                            var m = (d && d.Message) || '';
                            if (/UX_PERSON_IDENT_PRIMARY|UX_PERSON_CONTACT_PRIMARY/i.test(m)
                                || (/ORA-00001/.test(m) && /PRIMARY/i.test(m))) {
                                var nhom = /Identifier/.test(f) ? 'định danh' : 'liên hệ';
                                _zeBaoPrimary('Mỗi hồ sơ chỉ được chọn MỘT dòng ' + nhom
                                    + ' là "thông tin chính". Hiện đang có nhiều hơn một dòng được tick'
                                    + ' nên máy chủ từ chối. Bỏ bớt dấu tick rồi Lưu lại.'
                                    + '  [ORA-00001]');
                            }
                        } catch (e) { }
                        return sgP.apply(this, arguments);
                    };
                }
            } catch (e) { }
            return _mrPrimary.apply(this, arguments);
        };
    }
}

/*==============================================================================
== SỬA Ô Ở BẢNG TAB 2 BỊ TAB 1 GHI ĐÈ BẰNG GIÁ TRỊ CŨ  (21/09/2026)
==
== Hiện tượng: sửa TAX_CODE thì được, sửa CCCD thì không — số cũ quay lại.
== Vì TAX_CODE không có cầu nối từ tab 1, còn CCCD thì có:
==   _bridgeCccdToShadow: $('#txtSoDinhDinh'+cid).val( $('#txtCCCD_So').val() )
== Ô #txtCCCD_So ở tab 1 đang giữ số CŨ (do luồng nạp đổ vào lúc mở hồ sơ). Người
== dùng sửa số mới ngay trong bảng tab 2, bấm Lưu → cầu nối lấy số cũ ở tab 1 ghi
== đè lên số mới → lưu lại đúng số cũ, nhìn như "sửa không ăn".
==
== Bản vá trước chỉ cứu trường hợp bị ghi đè RỖNG nên không đỡ được ca này.
==
== Nguyên tắc xử lý: ô nào người dùng vừa sửa thì ô đó thắng. Mỗi lần gõ tay là
== đóng một mốc thời gian lên ô; sau khi cầu nối chạy, ô ở bảng nào có mốc mới
== hơn phía tab 1 thì trả lại giá trị người dùng vừa gõ. Không ai gõ thì để
== nguyên hành vi cũ.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype._bridgeLienHeToShadow
    && !DeXuatHoSo.prototype._zeUuTienOVuaSuaHooked) {
    DeXuatHoSo.prototype._zeUuTienOVuaSuaHooked = true;

    var _ZE_O_TAB1 = '#txtCCCD_So, #txtCCCD_NgayCap, #txtCCCD_NoiCap, #txtEmailCaNhan, #txtDienThoai';

    // Đóng mốc thời gian mỗi khi người dùng gõ tay (code đổ dữ liệu bằng .val()
    // không bắn sự kiện input nên không bị tính nhầm)
    $(document).on('input.zemoc',
        '#tblDinhDanh input, #tblLienHe input, ' + _ZE_O_TAB1,
        function () { $(this).attr('data-ze-sua', Date.now()); });

    var _zeMoc = function (sel) {
        var max = 0;
        $(sel).each(function () {
            var v = parseInt($(this).attr('data-ze-sua') || '0', 10);
            if (v > max) max = v;
        });
        return max;
    };

    // Chụp giá trị + mốc của mọi ô trong 2 bảng
    var _zeChupCoMoc = function () {
        var luu = [];
        $('#tblDinhDanh input[type="text"], #tblDinhDanh input:not([type]), '
            + '#tblLienHe input[type="text"], #tblLienHe input:not([type])').each(function () {
                if (!this.id) return;
                luu.push({ id: this.id, val: (($(this).val() || '') + ''), moc: _zeMoc(this) });
            });
        return luu;
    };

    var _zeTraLaiTheoMoc = function (luu, mocTab1) {
        (luu || []).forEach(function (m) {
            var $o = $('#' + m.id);
            if (!$o.length) return;
            var hienTai = (($o.val() || '') + '');
            if (hienTai === m.val) return;                 // không bị đụng
            // Trả lại khi: bị xoá trắng, hoặc người dùng vừa sửa ô này mới hơn tab 1
            if (!hienTai.trim() || (m.moc && m.moc >= mocTab1)) $o.val(m.val);
        });
    };

    ['_bridgeCccdToShadow', '_bridgeLienHeToShadow'].forEach(function (ten) {
        var goc = DeXuatHoSo.prototype[ten];
        if (typeof goc !== 'function') return;
        DeXuatHoSo.prototype[ten] = function () {
            var luu = [], mocTab1 = 0;
            try { luu = _zeChupCoMoc(); mocTab1 = _zeMoc(_ZE_O_TAB1); } catch (e) { }
            var kq = goc.apply(this, arguments);
            try { _zeTraLaiTheoMoc(luu, mocTab1); } catch (e) { }
            return kq;
        };
    });

    // Mở hồ sơ khác thì xoá hết mốc của hồ sơ trước
    if (DeXuatHoSo.prototype.openEditByPerson) {
        var _origOpenMoc = DeXuatHoSo.prototype.openEditByPerson;
        DeXuatHoSo.prototype.openEditByPerson = function (person) {
            try {
                $('#tblDinhDanh input, #tblLienHe input').removeAttr('data-ze-sua');
                $(_ZE_O_TAB1).removeAttr('data-ze-sua');
            } catch (e) { }
            return _origOpenMoc.apply(this, arguments);
        };
    }
}

/*==============================================================================
== "TRÙNG VỚI CHÍNH MÌNH" THÌ KHÔNG PHẢI TRÙNG  (23/09/2026)
==
== ĐHLN báo: chỉ sửa TÊN và NGÀY SINH, không đụng gì tới CCCD, vậy mà bị chặn
== "CCCD 026208003347 đã được dùng ở một hồ sơ khác" — trong khi số đó chính là
== CCCD của hồ sơ đang mở.
==
== Cơ chế gây ra: luồng gốc chỉ bỏ qua bước kiểm tra trùng khi ô định danh đang
== mang name (Id bản ghi). Mất name vì bất cứ lý do gì — danh sách nạp chậm, so
== GUID lệch hoa thường — là nó chạy kiểm tra trùng, và máy chủ dĩ nhiên tìm thấy
== chính bản ghi của hồ sơ này → hạ cờ icheck → HUỶ CẢ LƯỢT LƯU, mất luôn phần
== tên và ngày sinh người ta vừa sửa.
==
== Hai nguyên nhân kia đã vá ở trên. Đây là lớp chặn cuối, đánh vào đúng bản
== chất: nếu mọi dòng máy chủ trả về đều là của chính hồ sơ đang mở, hoặc giá trị
== đó vốn đã nằm trong hồ sơ này, thì đó KHÔNG phải trùng — dọn khỏi kết quả để
== luồng gốc chạy tiếp bình thường.
==
== Trùng với hồ sơ NGƯỜI KHÁC thì vẫn chặn y như cũ, không nới lỏng quy tắc.
==============================================================================*/
if (typeof edu !== 'undefined' && edu.system && edu.system.makeRequest
    && !edu.system._zeBoQuaTrungChinhMinhHooked) {
    edu.system._zeBoQuaTrungChinhMinhHooked = true;

    var _zeSo = function (a, b) {
        return ((a || '') + '').trim().toUpperCase() === ((b || '') + '').trim().toUpperCase();
    };

    var _mrTrungMinh = edu.system.makeRequest;
    edu.system.makeRequest = function (o) {
        try {
            var f = (o && o.data && o.data.func) || '';
            if (/KiemTraThongTin(LienHe|DinhDanh)/.test(f) && typeof o.success === 'function') {
                var laLienHe = /LienHe/.test(f);
                var giaTri = laLienHe ? o.data.strContactValue : o.data.strIdentifier_No;
                var typeId = laLienHe ? o.data.strContactTypeCode : o.data.strIdentifier_Type_Code;
                var sgTM = o.success;
                o.success = function (d) {
                    try {
                        if (d && d.Data && d.Data.length) {
                            var dx = (window.main_doc && window.main_doc.DeXuatHoSo) || null;
                            var pid = dx ? (dx.strDeXuatHoSo_Id || dx._lockedPersonId || '') : '';

                            // Giá trị này vốn đã là của hồ sơ đang mở?
                            var dsMinh = (dx && (laLienHe ? dx.dtLienHe : dx.dtDinhDanh)) || [];
                            var laCuaMinh = dsMinh.some(function (x) {
                                var v = laLienHe ? (x.CONTACT_VALUE || x.VALUE) : x.IDENTIFIER_NO;
                                var t = laLienHe ? (x.CONTACT_TYPE_CODE_ID || x.CONTACT_TYPE_CODE)
                                    : (x.IDENTIFIER_TYPE_CODE || x.IDENTIFIER_TYPE_CODE_ID);
                                return _zeSo(v, giaTri) && (!typeId || _zeSo(t, typeId));
                            });

                            // Hoặc mọi dòng máy chủ trả về đều thuộc chính hồ sơ này
                            var conNguoiKhac = d.Data.filter(function (r) {
                                var rp = r && (r.PERSON_ID || r.PERSONID || r.CORE_PERSON_ID);
                                if (!rp || !pid) return true;      // không biết của ai → giữ, cứ coi là người khác
                                return !_zeSo(rp, pid);
                            });

                            if (laCuaMinh || conNguoiKhac.length === 0) {
                                console.warn('[ZE] "' + giaTri + '" trùng với CHÍNH hồ sơ đang mở'
                                    + ' → bỏ qua cảnh báo trùng, cho lưu bình thường.');
                                d.Data = [];                       // luồng gốc sẽ không hạ cờ icheck
                            } else {
                                d.Data = conNguoiKhac;             // chỉ giữ phần trùng thật
                            }
                        }
                    } catch (e) { }
                    return sgTM.apply(this, arguments);
                };
            }
        } catch (e) { }
        return _mrTrungMinh.apply(this, arguments);
    };
}

/*==============================================================================
== TỰ CẮT KHOẢNG TRẮNG THỪA Ở MỌI Ô NHẬP  (29/09/2026)
==
== Người dùng thường dán dữ liệu từ Excel/Word nên hay dính khoảng trắng đầu/cuối
== và cả khoảng trắng không ngắt dòng (U+00A0) — nhìn y hệt dấu cách thường nhưng
== máy chủ coi là ký tự khác, gây báo lỗi hoặc lưu sai mà không hiểu vì sao.
==
== Xử lý ở hai thời điểm:
==   1) Rời khỏi ô  → cắt ngay, người dùng nhìn thấy kết quả;
==   2) Bấm Lưu     → quét lại toàn bộ, bắt ở pha capture nên chạy TRƯỚC mọi
==                    xử lý lưu khác, đảm bảo thứ gửi đi luôn là bản đã cắt.
==
== Cắt gì: bỏ khoảng trắng hai đầu và gom nhiều khoảng trắng liên tiếp thành một.
== Không đụng ô chọn ngày, ô tick, ô chỉ đọc, và ô nào gắn data-ze-khong-trim.
== Gán bằng .value nên không bắn sự kiện gõ — các cơ chế "người dùng vừa sửa ô
== nào" ở trên không bị tính nhầm.
==============================================================================*/
if (typeof document !== 'undefined' && !window._zeTrimHooked) {
    window._zeTrimHooked = true;

    var _ZE_BO_QUA = ['checkbox', 'radio', 'file', 'hidden', 'button', 'submit',
        'image', 'reset', 'date', 'datetime-local', 'time', 'month', 'week', 'color', 'range'];

    var _zeTrimMotO = function (el) {
        if (!el || el.disabled || el.readOnly) return;
        if (el.getAttribute && el.getAttribute('data-ze-khong-trim')) return;
        var loai = ((el.type || '') + '').toLowerCase();
        if (loai && _ZE_BO_QUA.indexOf(loai) > -1) return;
        var v = el.value;
        if (typeof v !== 'string' || !v) return;
        // \u00A0 là khoảng trắng không ngắt dòng — thủ phạm quen thuộc khi dán từ Word
        var moi = v.replace(/[\s\u00A0]+/g, ' ').trim();
        if (moi !== v) el.value = moi;
    };

    window._zeTrimTatCaO = function () {
        var goc = document.getElementById('zoneEdit');
        if (!goc) return;
        var ds = goc.querySelectorAll('input, textarea');
        for (var i = 0; i < ds.length; i++) _zeTrimMotO(ds[i]);
    };

    // 1) Rời khỏi ô thì cắt ngay
    document.addEventListener('focusout', function (e) {
        var el = e.target;
        if (!el || !el.closest) return;
        if (!el.closest('#zoneEdit')) return;
        var the = (el.tagName || '').toUpperCase();
        if (the !== 'INPUT' && the !== 'TEXTAREA') return;
        _zeTrimMotO(el);
    }, true);

    // 2) Bấm Lưu: quét sạch trước khi bất kỳ xử lý lưu nào đọc tới các ô
    //    (pha capture nên đứng trước toàn bộ handler jQuery)
    document.addEventListener('mousedown', function (e) {
        var el = e.target;
        if (!el || !el.closest) return;
        if (!el.closest('#btnSave_DeXuatHoSo')) return;
        try { window._zeTrimTatCaO(); } catch (er) { }
    }, true);
}

/*==============================================================================
== HOÁ ĐƠN: PHẢI LƯU HAI LẦN MỚI LÊN  (07/10/2026)
==
== Người dùng báo: sửa thông tin xuất hoá đơn, bấm Lưu, hệ thống báo đã lưu,
== nhưng hoá đơn in ra vẫn mang địa chỉ cũ và không có mã số thuế. Lưu thêm lần
== nữa mới đúng.
==
== Nguyên nhân nằm ở save_PersonInvoice (dexuathoso.js:5447):
==     var invoiceId = me._currentInvoiceId || '';
==     var isUpdate  = !!(invoiceId && invoiceId.length === 32);
== Nó quyết định Thêm hay Sửa HOÀN TOÀN dựa vào một biến nhớ tạm, mà biến đó
== được nạp bất đồng bộ lúc mở form. Bấm Lưu trước khi danh sách hoá đơn kịp về
== là biến còn rỗng → chạy Them_PersonInvoiceInfo → ĐẺ THÊM một bản ghi nữa
== trong khi bản cũ vẫn là bản hiện hành → hoá đơn vẫn đọc bản cũ.
== Mở lại form lần hai thì biến đã có Id nên đi Sua_ đúng bản, vì vậy lần hai
== mới thấy ăn.
==
== Cách xử lý đúng — cũng là quy tắc đã chốt bên hồ sơ tuyển sinh: TRA TRƯỚC KHI
== GHI. Mỗi lần lưu đều hỏi lại máy chủ hồ sơ này đã có bản ghi hoá đơn chưa,
== có thì Sửa, chưa có mới Thêm. Không bao giờ suy ra từ biến nhớ tạm.
==
== Tốn thêm một request mỗi lần lưu, đổi lại không còn đẻ bản ghi trùng.
==============================================================================*/
if (typeof DeXuatHoSo === 'function' && DeXuatHoSo.prototype.save_PersonInvoice
    && !DeXuatHoSo.prototype._zeTraTruocKhiGhiHDHooked) {
    DeXuatHoSo.prototype._zeTraTruocKhiGhiHDHooked = true;

    // Lấy nguyên của _loadXHD_Section — không tự bịa
    var _ZE_HD_GET = 'SV_NGUOIHOC_01_MH/DSA4BRIeESQzMi4vCC83LigiJAgvJy4P';

    var _origSaveHD = DeXuatHoSo.prototype.save_PersonInvoice;
    DeXuatHoSo.prototype.save_PersonInvoice = function () {
        var dx = this;
        var pid = ((dx.strDeXuatHoSo_Id || dx._lockedPersonId || '') + '').trim();
        // Không biết đang ở hồ sơ nào thì để bản gốc tự xử, đừng tra mò
        if (!pid) return _origSaveHD.apply(dx, arguments);

        var chay = function () {
            try { _origSaveHD.call(dx); } catch (e) { console.warn('[ZE Hoá đơn] lưu lỗi:', e); }
        };

        edu.system.makeRequest({
            success: function (data) {
                try {
                    var rows = (data && data.Success && data.Data) || [];
                    if (rows.length && rows[0].ID) {
                        if (!dx._currentInvoiceId) {
                            console.warn('[ZE Hoá đơn] hồ sơ đã có bản ghi hoá đơn ('
                                + rows[0].ID + ') → chuyển sang Sửa thay vì Thêm mới.');
                        }
                        dx._currentInvoiceId = rows[0].ID;
                    } else {
                        dx._currentInvoiceId = '';     // chắc chắn chưa có → Thêm mới là đúng
                    }
                } catch (e) { }
                chay();
            },
            // Hỏi không được thì vẫn phải lưu, cứ để bản gốc quyết như cũ
            error: function (er) { console.warn('[ZE Hoá đơn] không tra được bản ghi cũ:', er); chay(); },
            type: 'POST',
            contentType: true,
            action: _ZE_HD_GET,
            data: {
                'action': _ZE_HD_GET,
                'func': 'PKG_CORE_NGUOIHOC_01.LayDS_PersonInvoiceInfo',
                'iM': edu.system.iM,
                'strPerson_Id': pid,
                'dChiHienHanh': 1,
                'strNguoiThucHien_Id': edu.system.userId,
                'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
                'strChucNangHeThong_Id': edu.system.chucNangHeThong_Id || edu.system.strChucNang_Id,
                'strHanhDong_Code': ''
            },
            fakedb: []
        }, false, false, false, null);
    };
}
