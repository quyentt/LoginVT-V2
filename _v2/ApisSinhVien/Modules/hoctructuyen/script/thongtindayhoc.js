/* =========================================================================
   Thông tin dạy học — lịch học trực tuyến của các lớp học phần, theo dõi giảng viên / sinh viên vào lớp
   Bản gốc: ApisSinhVien/Modules/hoctructuyen/html/thongtindayhoc.html + script/thongtindayhoc.js
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (MỘT cột): thanh lọc → "Danh sách" (phân trang máy chủ) → bấm "Chi tiết" một dòng thì
   khung "Danh sách sinh viên" (sinh viên × buổi học) THAY CHỖ danh sách, nút Đóng quay lại (_dssv.js).

   Lời gọi (kiểu cũ, GET, chép nguyên tên tham số):
     SV_HoTro_Chung/LayDSThoiGian   → ô Thời gian (DAOTAO_THOIGIANDAOTAO; gốc selectOne: chỉ chọn sẵn khi có đúng một)
     SV_HoTro_Chung/LayDSGiangVien  (strDaoTao_ThoiGianDaoTao_Id) → ô Giảng viên (HOTEN)
     SV_HoTro_Chung/LayDSHocPhan    (strDaoTao_ThoiGianDaoTao_Id, strGiangVien_Id) → ô Học phần ("TEN - MA")
     SV_LopHoc_Lich_GV/LayDanhSach  (strTuKhoa, strGiangVien_Id, strDaoTao_HocPhan_Id, strTuNgay, strDenNgay,
                                     strDaoTao_ThoiGianDaoTao_Id, strNgayHoc = ô "Ngày học" bị ẨN trong gốc → '',
                                     các ô dropAAAA/txtAAAA không có → '', pageIndex/pageSize) → bảng
     Chi tiết: ums.svHttt.dsSV (LayDSNgayHocTheoLop / LayDSSVTheoLop / LayKQVaoHocCuaNguoiHoc)
   Nối tầng: Thời gian → Giảng viên (khoá khi chưa chọn thời gian). Học phần lọc theo CẢ thời gian và giảng
   viên (nhiều cha) → chỉ khoá theo Thời gian; đổi / xoá giảng viên thì nạp lại và xoá trắng Học phần.
   Khác gốc:
     · Nút dòng: gốc là bút "Sửa" (btnEdit) nhưng việc làm là XEM danh sách sinh viên → biểu tượng xem.
     · Liên kết "Thông tin lớp học online": gốc bắt click rồi window.open; ở đây là liên kết mở tab mới.
     · Bỏ ô "Ngày học" bị ẩn (display:none) của gốc — vẫn gửi strNgayHoc rỗng như gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.svHttt;
    var root = document.getElementById('httt-thongtin');
    if (!root) return;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML =
        '<div data-z="ds">' +
            pat.page('Thông tin dạy học', '') +
            pat.filterBar([
                { key: 'tg', type: 'select', label: 'Chọn học kỳ, đợt' },
                { key: 'gv', type: 'select', label: 'Chọn giảng viên' },
                { key: 'hp', type: 'select', label: 'Chọn học phần' },
                { key: 'tu', type: 'date', label: 'Từ ngày' },
                { key: 'den', type: 'date', label: 'Đến ngày' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang' }) +
        '</div>' +
        '<div data-z="sv" hidden></div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    var chainGV = pat.chain([f('tg'), f('gv')], { phatLai: false });
    var chainHP = pat.chain([f('tg'), f('hp')], { phatLai: false });
    function dongBo() { chainGV.sync(); chainHP.sync(); }

    get('SV_HoTro_Chung/LayDSThoiGian').then(function (r) {
        var ds = arr(r.data);
        pat.fill(f('tg'), ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ, đợt' });
        if (ds.length === 1) { f('tg').value = ds[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); }
        dongBo();
        napGV(); napHP();                     // gốc: trigger select2:select ngay sau khi đổ danh sách
    }).catch(function (err) { ums.api.handle(err, 'thời gian'); });

    function napGV() {
        if (!f('tg').value) { pat.fill(f('gv'), [], { head: 'Chọn giảng viên' }); dongBo(); return; }
        get('SV_HoTro_Chung/LayDSGiangVien', { strDaoTao_ThoiGianDaoTao_Id: f('tg').value }).then(function (r) {
            pat.fill(f('gv'), arr(r.data), { name: 'HOTEN', head: 'Chọn giảng viên' }); dongBo();
        }).catch(function (err) { ums.api.handle(err, 'giảng viên'); });
    }
    function napHP() {
        if (!f('tg').value) { pat.fill(f('hp'), [], { head: 'Chọn học phần' }); dongBo(); return; }
        get('SV_HoTro_Chung/LayDSHocPhan', { strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strGiangVien_Id: f('gv').value }).then(function (r) {
            pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, head: 'Chọn học phần' }); dongBo();
        }).catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    if (window.jQuery) {
        jQuery(f('tg')).on('select2:select select2:clear', function () { napGV(); napHP(); });
        jQuery(f('gv')).on('select2:select select2:clear', function () {
            f('hp').value = ''; if (window.jQuery) jQuery(f('hp')).trigger('change.select2');
            napHP();
        });
    }

    /* ---------- Danh sách (phân trang máy chủ) ---------- */
    var trang = 1, co = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.pageSize) || 10, tong = 0, ds = [];
    function tai(p) {
        if (p) trang = p;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        get('SV_LopHoc_Lich_GV/LayDanhSach', {
            strTuKhoa: f('q').value, strGiangVien_Id: f('gv').value, strCongCuHoc_Id: '', strNgayVao: '',
            strNgayHoc: '', strTuNgay: f('tu').value, strDenNgay: f('den').value, strHoTroHoc_LopHoc_Lich_Id: '',
            strTrangThaiGhiNhan_Id: '', strDaoTao_HocPhan_Id: f('hp').value, strDangKy_LopHocPhan_Id: '',
            strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strNgay: '', pageIndex: trang, pageSize: co
        }).then(function (r) {
            ds = arr(r.data);
            tong = Number(r.pager) || ds.length;
            ve();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách'); });
    }
    function lienKet(x) {
        var s = e(x.THONGTINVAOHETHONGHOC_KETHUA);
        if (s && s.indexOf('http') !== -1) return '<a href="' + esc(s) + '" target="_blank" rel="noopener">' + esc(s) + '</a>';
        return esc(s);
    }
    function ve() {
        z('n').textContent = '(' + tong + ')';
        ui.table({
            el: z('bang'), rows: ds, empty: 'Không có dữ liệu',
            page: {
                index: trang, size: co, total: tong,
                onChange: function (p) { if (p >= 1 && p <= Math.ceil(tong / co)) tai(p); },
                onSize: function (v) { co = v === 'all' ? Math.max(tong, 1) : Number(v); tai(1); }
            },
            columns: [
                { title: 'Ngày', cls: 'is-center is-nowrap', render: function (x) { return esc(H.buoi(x)); } },
                { title: 'Mã giảng viên', prop: 'GIANGVIEN_MA', cls: 'is-nowrap' },
                { title: 'Tên giảng viên', prop: 'GIANGVIEN_HOTEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                { title: 'Thông tin lớp học online', render: lienKet },
                { title: 'Trạng thái giảng dạy GV', prop: 'TRANGTHAIGHINHAN_TEN' },
                { title: 'Số sv vào đúng giờ', prop: 'SODUNGGIO', cls: 'is-center' },
                { title: 'Số sv vào trước giờ', prop: 'SOVAOTRUOCGIO', cls: 'is-center' },
                { title: 'Số sv vào muộn giờ', prop: 'SOVAOMUONGIO', cls: 'is-center' },
                { title: 'Số sv vắng mặt', prop: 'SOVANGMAT', cls: 'is-center' },
                { title: 'Chi tiết', cls: 'is-actions', width: '64px', render: function (x, i) {
                    return ui.iconBtn('view', String(i));
                } }
            ]
        });
    }

    function moSV(x) {
        H.dsSV(z('sv'), x.DANGKY_LOPHOCPHAN_ID, function () { ui.swap(z('sv'), z('ds')); });
        ui.swap(z('ds'), z('sv'));
    }

    root.addEventListener('click', function (ev) {
        var c = ev.target.closest('[data-act="view"]');
        if (c) { var x = ds[Number(c.getAttribute('data-id'))]; if (x) moSV(x); return; }
        if (ev.target.closest('[data-a="search"]')) tai(1);
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
    tai(1);                                   // gốc nạp danh sách ngay khi mở màn
})();
