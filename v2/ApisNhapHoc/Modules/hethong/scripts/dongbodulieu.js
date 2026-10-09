/* =========================================================================
   Đồng bộ dữ liệu (Nhập học)
   Bản gốc: ApisNhapHoc/Modules/hethong/html/dongbodulieu.html + scripts/dongbodulieu.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên):
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP  PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc
         strNguoiThucHien_Id = người đăng nhập                    → ô Kế hoạch (ID / TENKEHOACH)
     NH_ChuyenHoSo/ChuyenDuLieuNhapHoc  POST, versionAPI v1.0     "Thực hiện" (hỏi lại trước)
         strNHAPHOC_KeHoach_Id, strNguoiThucHien_Id
   Bố cục: hai khung ngang hàng như gốc. Nút "Thực hiện" dời lên đầu khung "Chuyển dữ liệu"
   (luật thao tác trên tiêu đề khung) — gốc đặt góc dưới phải thân khung.
   Khung "Lịch sử đồng bộ dữ liệu": bản gốc là bảng TĨNH một dòng "Không có dữ liệu tìm thấy!",
   không một hàm nào đổ dữ liệu vào → giữ bảng rỗng đúng như vậy (chưa có API lịch sử).
   Khác gốc: gốc gắn trình xử lý #btnYes bằng delegate mỗi lần bấm "Thực hiện" → bấm N lần
   thì lần xác nhận sau gọi chuyển dữ liệu N lần. Bản mới hỏi lại một lần, gọi một lần.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nh-dongbodulieu');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    root.innerHTML = pat.page('Đồng bộ dữ liệu') +
        '<div class="ums-grid ums-grid--2 ums-cols">' +
        pat.panel({ title: 'Chuyển dữ liệu', icon: 'fa-arrow-progress',
            tools: ui.btn('save', { text: 'Thực hiện', mod: 'primary', icon: 'fa-gear-complex', attr: { 'data-a': 'chuyen' } }),
            body: ui.field('Kế hoạch', '<select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch nhập học">' +
                '<option value="">Chọn kế hoạch nhập học</option></select>', { inline: true }) }) +
        pat.panel({ title: 'Lịch sử đồng bộ dữ liệu', icon: 'fa-clock-rotate-left', flush: true, zone: 'ls' }) +
        '</div>';
    ui.enhance(root);

    var fKh = root.querySelector('[data-f="kh"]');

    ui.table({ el: root.querySelector('[data-z="ls"]'), rows: [], empty: 'Không có dữ liệu tìm thấy!',
        columns: [{ title: 'Nội dung', prop: 'NOIDUNG' }] });

    ums.api.call({ action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP',
        func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc', strNguoiThucHien_Id: uid() })
        .then(function (r) { pat.fill(fKh, arr(r.data), { name: 'TENKEHOACH', head: 'Chọn kế hoạch nhập học' }); })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); });

    root.addEventListener('click', function (ev) {
        if (!ev.target.closest('[data-a="chuyen"]')) return;
        if (!fKh.value) { ui.toast('Dữ liệu không hợp lệ', 'warn'); return; }
        ui.confirm('Bạn có muốn thực hiện chuyển dữ liệu?', { ok: 'Thực hiện' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'NH_ChuyenHoSo/ChuyenDuLieuNhapHoc', versionAPI: 'v1.0',
                strNHAPHOC_KeHoach_Id: fKh.value, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Chuyển dữ liệu thành công!', 'ok'); });
        }).catch(function (err) { ums.api.handle(err, 'NH_ChuyenHoSo.ChuyenDuLieuNhapHoc'); });
    });
})();
