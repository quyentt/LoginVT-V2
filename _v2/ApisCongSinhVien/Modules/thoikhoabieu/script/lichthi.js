/* =========================================================================
   Lịch thi — Cổng sinh viên (vai trò thủ vai: userId = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/thoikhoabieu/html/lichthi.html + script/lichthi.js
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc — MỘT cột: thanh lọc (Học kỳ, Học phần + hai nút
   "Xem lịch", "Xem lịch sử") rồi hai bảng xếp dọc "Lịch thi cá nhân" và
   "Kế hoạch thi chung".

   Lời gọi (chép nguyên action mã hoá + func + tên tham số) — SV_ThongTin_MH:
       pkg_congthongtin_hssv_thongtin.LayDSThoiGianLichThi   ô Học kỳ (cột THOIGIAN)
       pkg_congthongtin_hssv_thongtin.LayDSHocPhanLichThi    ô Học phần (DAOTAO_HOCPHAN_TEN),
           strDaoTao_ThoiGianDaoTao_Id + strTHI_DotThi_Id '' + strDiem_ThanhPhanDiem_Id ''
           (hai ô sau bản gốc đọc #dropAAAA — ô không tồn tại, tức luôn gửi rỗng)
       pkg_congthongtin_hssv_thongtin.LayDSLichThi_KeHoachThi
           "Xem lịch"     → action SV_ThongTin_MH/DSA4BRINKCIpFSkoHgokCS4gIikVKSgP
           "Xem lịch sử"  → action SV_ThongTin_MH/DSA4BRINKCIpFSkoHgokCS4gIikVKSgeDSgiKRI0
             (bản gốc đổi ACTION nhưng vẫn gửi func LayDSLichThi_KeHoachThi — giữ nguyên)
           strQLSV_NguoiHoc_Id = userId, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id
           → Data.{ rsLichThiCaNhan, rsKeHoachThiChung }

   Giống bản gốc: tên cột từng bảng chép nguyên (cột "Hình thức" đổ
   DANGKY_LOPHOCPHAN_TEN — tên lớp học phần, như gốc); danh sách chỉ có MỘT mục
   thì chọn sẵn (selectOne: true của loadToCombo_data) rồi tải tiếp; đổi ô Học kỳ
   nạp lại Học phần, đổi ô Học phần thì tải luôn lịch; mở màn chưa gọi lịch.
   Khác bản gốc: (a) theo luật chung, chưa chọn Học kỳ thì KHOÁ ô Học phần, xoá
   Học kỳ thì xoá trắng Học phần (ums.pat.chain) và hai bảng về lời nhắc ban đầu
   (không giữ dữ liệu của học kỳ cũ); (b) nút "Xem lịch sử" bản gốc
   là nút ĐỎ (btn-danger) — đây là việc XEM nên dùng nút viền xanh + biểu tượng
   lịch sử theo bảng biểu tượng chuẩn, chữ trên nút giữ nguyên.
   Màn gốc của Cổng cán bộ (thoikhoabieusinhvien/lichthi) là cùng một tệp, chỉ
   khác ở chỗ gọi controller kiểu cũ SV_ThongTin/* (GET) — bản này giữ đúng
   SV_ThongTin_MH + func của Cổng sinh viên.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-lichthi');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hai(v) { v = '' + e(v); return v.length === 1 ? '0' + v : v; }
    function gio(r) { return hai(r.GIOBATDAU) + ':' + hai(r.PHUTBATDAU) + ' - ' + hai(r.GIOKETTHUC) + ':' + hai(r.PHUTKETTHUC); }

    var A_LICH = 'SV_ThongTin_MH/DSA4BRINKCIpFSkoHgokCS4gIikVKSgP';
    var A_LICHSU = 'SV_ThongTin_MH/DSA4BRINKCIpFSkoHgokCS4gIikVKSgeDSgiKRI0';

    root.innerHTML =
        pat.page('Lịch thi', '') +
        pat.filterBar([
            { key: 'hk', label: 'Chọn học kỳ', type: 'select' },
            { key: 'hp', label: 'Chọn học phần', type: 'select' }
        ], { searchText: 'Xem lịch', extra: '<div class="ums-field ums-field--fit">' +
            ui.btn('history', { text: 'Xem lịch sử', icon: 'fa-clock-rotate-left', attr: { 'data-a': 'lichsu' } }) + '</div>' }) +
        pat.panel({ title: 'Lịch thi cá nhân', icon: 'fa-calendar-check', zone: 'canhan', flush: true }) +
        '<div class="ums-u-mt-4">' + pat.panel({ title: 'Kế hoạch thi chung', icon: 'fa-calendar-days', zone: 'chung', flush: true }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function chonMot(el, ds) {          // selectOne: chỉ một mục thì chọn sẵn
        if (ds.length === 1) { el.value = ds[0].ID; if (window.jQuery) jQuery(el).trigger('change.select2'); return true; }
        return false;
    }

    function ve(d) {
        d = d || {};
        ui.table({
            el: z('canhan'), rows: arr(d.rsLichThiCaNhan), empty: 'Không có lịch thi',
            columns: [
                { title: 'Mã học phần', prop: 'MAHOCPHAN', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                { title: 'Ngày thi', prop: 'NGAYHOC', cls: 'is-center is-nowrap' },
                { title: 'Thời gian thi', cls: 'is-center is-nowrap', render: function (r) { return esc(gio(r)); } },
                { title: 'Hình thức', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                { title: 'Phòng thi', prop: 'PHONGHOC_TEN' },
                { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' },
                { title: 'Thông tin sinh viên ( Họ tên, mã số)', render: function (r) {
                    return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN) + ' - ' + e(r.QLSV_NGUOIHOC_MASO));
                } }
            ]
        });
        ui.table({
            el: z('chung'), rows: arr(d.rsKeHoachThiChung), empty: 'Không có kế hoạch thi',
            columns: [
                { title: 'Mã học phần', prop: 'MAHOCPHAN', cls: 'is-nowrap' },
                { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                { title: 'Ngày thi', prop: 'NGAYHOC', cls: 'is-center is-nowrap' },
                { title: 'Thời gian thi', cls: 'is-center is-nowrap', render: function (r) { return esc(gio(r)); } },
                { title: 'Hình thức', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                { title: 'Phòng thi', prop: 'PHONGHOC_TEN' },
                { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' }
            ]
        });
    }

    function taiLich(action) {
        z('canhan').innerHTML = z('chung').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: action || A_LICH, func: 'pkg_congthongtin_hssv_thongtin.LayDSLichThi_KeHoachThi',
            strQLSV_NguoiHoc_Id: uid(), strDaoTao_ThoiGianDaoTao_Id: f('hk').value, strDaoTao_HocPhan_Id: f('hp').value })
            .then(function (r) { ve(r.data); })
            .catch(function (err) { ve(null); ums.api.handle(err, 'tải lịch thi'); });
    }
    function taiHocPhan() {
        return ums.api.call({ action: 'SV_ThongTin_MH/DSA4BRIJLiIRKSAvDSgiKRUpKAPP', func: 'pkg_congthongtin_hssv_thongtin.LayDSHocPhanLichThi',
            strDaoTao_ThoiGianDaoTao_Id: f('hk').value, strTHI_DotThi_Id: '', strDiem_ThanhPhanDiem_Id: '' }).then(function (r) {
            var ds = arr(r.data);
            pat.fill(f('hp'), ds, { name: 'DAOTAO_HOCPHAN_TEN' });
            if (chonMot(f('hp'), ds)) taiLich();
        }).catch(function (err) { ums.api.handle(err, 'tải học phần'); });
    }

    if (window.jQuery) {
        jQuery(f('hk')).on('select2:select', taiHocPhan);
        /* Xoá Học kỳ: hai bảng về lời nhắc ban đầu, không giữ dữ liệu của học kỳ cũ */
        jQuery(f('hk')).on('select2:clear', function () { ve(null); });
        jQuery(f('hp')).on('select2:select', function () { taiLich(); });
    }
    var chuoi = pat.chain([f('hk'), f('hp')], { phatLai: false });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') taiLich();
        else if (a === 'lichsu') taiLich(A_LICHSU);
    });

    ve(null);
    ums.api.call({ action: 'SV_ThongTin_MH/DSA4BRIVKS4oBiggLw0oIikVKSgP', func: 'pkg_congthongtin_hssv_thongtin.LayDSThoiGianLichThi' })
        .then(function (r) {
            var ds = arr(r.data);
            pat.fill(f('hk'), ds, { name: 'THOIGIAN' });
            if (chonMot(f('hk'), ds)) { chuoi.sync(); taiHocPhan(); }
        }).catch(function (err) { ums.api.handle(err, 'tải học kỳ'); });
})();
