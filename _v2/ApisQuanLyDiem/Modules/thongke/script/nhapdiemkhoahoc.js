/* =========================================================================
   Tiến độ nhập điểm theo KHOÁ HỌC (Quản lý điểm)
   Bản gốc: ApisQuanLyDiem/Modules/thongke/html/nhapdiemkhoahoc.html + script/nhapdiemkhoahoc.js
   (tệp gốc là bản chép của nhapdiemhocphan.js, đổi bộ lọc Kế hoạch → Thời gian + Hệ/Khoá).
   ---------------------------------------------------------------------------
   Bố cục gốc (một cột): 7 ô lọc (Thời gian · Hệ · Khoá · Khoa quản lý · Học phần · Chọn lọc · Từ khoá)
   + Tìm kiếm + Báo cáo/Import → bảng "Danh sách" (tiêu đề hai tầng theo loại điểm).
   Lời gọi (chép nguyên):
       TP_ToChucThi/LayDSThoiGianDangKyHoc      GET, iM (không func — bản gốc vẫn truyền iM)  ô Thời gian (THOIGIAN, chọn nhiều)
       Hệ / Khoá: edu.extend.genBoLoc_HeKhoa("_TK") → ums.ref.cascadeQuyen (…HeDaoTaoQuyen / …KhoaDaoTaoQuyen — lọc quyền)
       TP_ToChucThi/LayDSKhoaQLTheoKeHoach      GET  ô Khoa quản lý (chọn nhiều) theo Thời gian; kế hoạch rỗng (ô không có)
       TP_ToChucThi/LayDSHocPhanTheoKeHoach     GET  ô Học phần theo Thời gian + Khoa quản lý ("MA - TEN")
       Danh mục DIEM.TRANGTHAILOC (giá trị = MA)                                          ô "Chọn lọc"
       "Tìm kiếm":
         TP_ToChucThi/LayDSLoaiDiemTheoKhoaHoc  GET  các cột loại điểm (mỗi loại hai cột SL | Tỷ lệ %)
         XLHV_TP_ToChucThi_MH/DSA4BRINLjEJLiIRKSAvFSA1AiAP  func pkg_thi_tochucthi.LayDSLopHocPhanTatCa  POST
             (dLocKhongHoanThanhNhapDiem = ô Chọn lọc; để trống thì không gửi — edu.system.getValById trả undefined)
         TP_ToChucThi/LayTTTienDoNhapDiemTheoLopHP  GET  MỖI Ô một lời gọi, như gốc; bỏ giá trị "x"
   Mẫu báo cáo (chép nguyên): strThi_DotThi_Id, strDangKy_KeHoachDangKy_Id, strHinhThucThi_Id,
   strDiem_ThanhPhanDiem_Id (ô không có → rỗng), strDaoTao_HocPhan_Id, strDaoTao_KhoaQuanLy_Id,
   strDaoTao_ThoiGianDaoTao_Id, strHoanThanhNhapDiem_Id.
   Vẽ bảng: ums.tkNhapDiem.bang (ApisCongCanBo/Modules/thongke/script/_nhapdiem.js).
   Nối tầng: Thời gian → Khoa quản lý, Thời gian → Học phần (khoá tới khi chọn Thời gian); Khoa quản lý → Học phần
   nạp lại (lọc thêm, không khoá); Hệ → Khoá (cascadeQuyen tự khoá).
   Bỏ: nạp Khoa quản lý / Học phần lúc mở màn khi chưa có Thời gian (luật cha → con: ô con bị khoá).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = 'TP_ToChucThi/';
    var root = document.getElementById('qld-nhapdiemkhoahoc');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    root.innerHTML = pat.page('Tiến độ nhập điểm khoá học', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'tg', label: 'Chọn thời gian', type: 'select', multiple: true },
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
            { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' },
            { key: 'kql', label: 'Chọn khoa quản lý', type: 'select', multiple: true },
            { key: 'hp', label: 'Chọn học phần', type: 'select' },
            { key: 'ht', label: 'Chọn lọc', type: 'select' },
            { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(k) { return pat.val(f(k)); }
    z('bang').innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-filter');

    /* ---------- Bộ lọc -------------------------------------------------------- */
    ums.api.call({ action: T + 'LayDSThoiGianDangKyHoc', method: 'GET', strNguoiThucHien_Id: uid(), iM: ums.session && ums.session.iM, silent: true })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN' }); }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    ums.ref.cascadeQuyen({ he: f('he'), khoa: f('khoa') });
    ums.api.dm('DIEM.TRANGTHAILOC').then(function (d) { pat.fill(f('ht'), d, { id: 'MA', name: 'TEN', head: 'Chọn lọc' }); }).catch(function () {});

    function napKQL() {
        return ums.api.call({ action: T + 'LayDSKhoaQLTheoKeHoach', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDangKy_KeHoachDangKy_Id: '', silent: true })
            .then(function (r) { pat.fill(f('kql'), arr(r.data), { name: 'DAOTAO_KHOAQUANLY_TEN' }); }).catch(function (err) { ums.api.handle(err, 'khoa quản lý'); });
    }
    function napHP() {
        return ums.api.call({ action: T + 'LayDSHocPhanTheoKeHoach', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaQuanLy_Id: v('kql'), strDangKy_KeHoachDangKy_Id: '', silent: true })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.MA) + ' - ' + e(x.TEN); } }); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    if (window.jQuery) {
        jQuery(f('tg')).on('select2:select select2:unselect select2:clear', function () { if (v('tg')) { napHP(); napKQL(); } });
        jQuery(f('kql')).on('select2:select select2:unselect select2:clear', function () { if (v('tg')) { pat.fill(f('hp'), [], {}); napHP(); } });
    }
    pat.chain([f('tg'), f('kql')], { phatLai: false });
    pat.chain([f('tg'), f('hp')], { phatLai: false });

    /* ---------- Danh sách ----------------------------------------------------- */
    var COT = [
        { title: 'Mã lớp học phần', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp học phần', prop: 'TENLOP' },
        { title: 'Số TC', prop: 'DAOTAO_HOCPHAN_SOTIN', cls: 'is-center' }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
        { title: 'Giảng viên dạy', prop: 'DSGIANGVIEN' }, { title: 'Khoa chuyên môn', prop: 'DONVIPHUTRACHHOCPHAN_TEN' },
        { title: 'Công thức tính điểm', prop: 'CONGTHUC' }, { title: 'Hạn nộp điểm', prop: 'HANNOPDIEM', cls: 'is-center is-nowrap' }
    ];
    var soHieu = 0;
    function tim() {
        var sh = ++soHieu;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: T + 'LayDSLoaiDiemTheoKhoaHoc', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he'),
            strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HocPhan_Id: v('hp'), strNguoiThucHien_Id: uid() }).then(function (r) {
            var cot = arr(r.data);
            return ums.api.call({
                action: 'XLHV_TP_ToChucThi_MH/DSA4BRINLjEJLiIRKSAvFSA1AiAP', func: 'pkg_thi_tochucthi.LayDSLopHocPhanTatCa', method: 'POST',
                dLocKhongHoanThanhNhapDiem: v('ht') || undefined,
                strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strTuKhoa: v('q'), strDangKy_KeHoachDangKy_Id: '', strDaoTao_KhoaQuanLy_Id: v('kql'), strDaoTao_HocPhan_Id: v('hp'),
                strThi_DotThi_Id: '', strNguoiThucHien_Id: uid()
            }).then(function (x) {
                if (sh !== soHieu) return;
                var rows = arr(x.data);
                z('n').textContent = '(' + rows.length + ')';
                ums.tkNhapDiem.bang(z('bang'), rows, cot, COT, function (h, c) {
                    return { action: T + 'LayTTTienDoNhapDiemTheoLopHP', strDangKy_KeHoachDangKy_Id: '', strDaoTao_LopHocPhan_Id: h.ID,
                        strDiem_ThanhPhanDiem_Id: c.ID, strNguoiThucHien_Id: uid(), strCongThucDiem: e(h.CONGTHUC), strDaoTao_HocPhan_Id: h.ID };
                });
            });
        }).catch(function (err) { if (sh === soHieu) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tiến độ nhập điểm'); } });
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strThi_DotThi_Id', ''); add('strDaoTao_HocPhan_Id', v('hp')); add('strDangKy_KeHoachDangKy_Id', '');
        add('strDaoTao_KhoaQuanLy_Id', v('kql')); add('strHinhThucThi_Id', ''); add('strDaoTao_ThoiGianDaoTao_Id', v('tg'));
        add('strDiem_ThanhPhanDiem_Id', ''); add('strHoanThanhNhapDiem_Id', v('ht'));
    } });
    root.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="search"]')) tim(); });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
