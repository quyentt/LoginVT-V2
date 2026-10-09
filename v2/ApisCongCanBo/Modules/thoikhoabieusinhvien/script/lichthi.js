/* =========================================================================
   Lịch thi (của người đang đăng nhập)
   Bản gốc: ApisCongCanBo/Modules/thoikhoabieusinhvien/script/lichthi.js + html/lichthi.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       SV_ThongTin/LayDSThoiGianLichThi               GET  → ô Học kỳ (THOIGIAN)
       SV_ThongTin/LayDSHocPhanLichThi                GET  strDaoTao_ThoiGianDaoTao_Id, strTHI_DotThi_Id '',
                                                           strDiem_ThanhPhanDiem_Id '' → ô Học phần
       SV_ThongTin/LayDSLichThi_KeHoachThi            GET  "Xem lịch" / chọn học phần
       SV_ThongTin/LayDSLichThi_KeHoachThi_LichSu     GET  "Xem lịch sử"
           strQLSV_NguoiHoc_Id = userId, strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id
           → Data.{ rsLichThiCaNhan, rsKeHoachThiChung }

   LƯU Ý: html gốc nạp "modules/thoikhoabieu/script/lichthi.js" — tệp đó chỉ có
   ở ApisCongSinhVien (bản mã hoá SV_ThongTin_MH), trong Cổng cán bộ là 404 →
   `new LichThi()` lỗi, màn trắng. Bản chuyển đổi theo tệp .js CỦA CHÍNH module
   này (controller kiểu cũ SV_ThongTin). KIỂM TRÊN HOST controller còn chạy không.
   Giữ như bản gốc: cột "Hình thức" đổ DANGKY_LOPHOCPHAN_TEN (tên lớp học phần).
   Theo luật chung: chưa chọn Học kỳ thì khoá Học phần; đổi Học kỳ thì xoá Học phần.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('tkb-lichthi');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hai(v) { v = '' + e(v); return v.length === 1 ? '0' + v : v; }
    function gio(r) { return hai(r.GIOBATDAU) + ':' + hai(r.PHUTBATDAU) + ' - ' + hai(r.GIOKETTHUC) + ':' + hai(r.PHUTKETTHUC); }

    root.innerHTML =
        pat.page('Lịch thi', '') +
        pat.filterBar([
            { key: 'hk', label: 'Chọn học kỳ', type: 'select' },
            { key: 'hp', label: 'Chọn học phần', type: 'select' }
        ], { searchText: 'Xem lịch', extra: '<div class="ums-field ums-field--fit">' +
            ui.btn('search', { text: 'Xem lịch sử', icon: 'fa-clock-rotate-left', attr: { 'data-a': 'lichsu' } }) + '</div>' }) +
        pat.panel({ title: 'Lịch thi cá nhân', icon: 'fa-calendar-check', zone: 'canhan', flush: true }) +
        '<div class="ums-u-mt-4">' + pat.panel({ title: 'Kế hoạch thi chung', icon: 'fa-calendar-days', zone: 'chung', flush: true }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function chonMot(el, ds) {          // selectOne: một mục thì chọn sẵn
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
        ums.api.call({ action: action || 'SV_ThongTin/LayDSLichThi_KeHoachThi', method: 'GET', strQLSV_NguoiHoc_Id: uid(),
            strDaoTao_ThoiGianDaoTao_Id: f('hk').value, strDaoTao_HocPhan_Id: f('hp').value })
            .then(function (r) { ve(r.data); })
            .catch(function (err) { ve(null); ums.api.handle(err, 'tải lịch thi'); });
    }
    function taiHocPhan() {
        return ums.api.call({ action: 'SV_ThongTin/LayDSHocPhanLichThi', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: f('hk').value,
            strTHI_DotThi_Id: '', strDiem_ThanhPhanDiem_Id: '', strNguoiThucHien_Id: uid() }).then(function (r) {
            var ds = arr(r.data);
            pat.fill(f('hp'), ds, { name: 'DAOTAO_HOCPHAN_TEN' });
            if (chonMot(f('hp'), ds)) taiLich();
        }).catch(function (err) { ums.api.handle(err, 'tải học phần'); });
    }

    if (window.jQuery) {
        jQuery(f('hk')).on('select2:select', taiHocPhan);
        jQuery(f('hp')).on('select2:select', function () { taiLich(); });
    }
    var chuoi = ums.pat.chain([f('hk'), f('hp')], { phatLai: false });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'search') taiLich();
        else if (b.getAttribute('data-a') === 'lichsu') taiLich('SV_ThongTin/LayDSLichThi_KeHoachThi_LichSu');
    });

    ve(null);
    ums.api.call({ action: 'SV_ThongTin/LayDSThoiGianLichThi', method: 'GET', strNguoiThucHien_Id: uid() }).then(function (r) {
        var ds = arr(r.data);
        pat.fill(f('hk'), ds, { name: 'THOIGIAN' });
        if (chonMot(f('hk'), ds)) { chuoi.sync(); taiHocPhan(); }
    }).catch(function (err) { ums.api.handle(err, 'tải học kỳ'); });
})();
