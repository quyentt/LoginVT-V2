/* =========================================================================
   phuckhao — Khoa xem phúc khảo: danh sách thi đã đăng ký phúc khảo (CHỈ XEM)
   + lịch sử phúc khảo của từng dòng.
   Bản gốc: nhapdiem/script/phuckhao.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, GET, chép nguyên):
       TP_PhucKhao/LayThoiGianTheoDotThi (ID / THOIGIAN) → TP_PhucKhao/LayHocPhanPhucKhao (strDaoTao_ThoiGianDaoTao_Id)
       TP_PhucKhao/LayDSThiPhucKhaoNhapDiem (strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id) — mở màn nạp không lọc (như gốc)
   Lịch sử: bản gốc gọi me.getList_LichSu KHÔNG tồn tại → dựng theo bản cổng sinh viên
       (ApisCongSinhVien/Modules/hoctap/script/phuckhao.js:298): XLHV_TP_PhucKhao_MH ·
       pkg_thi_phach_phuckhao.LayDSLichSuPhucKhao, strThi_DanhSachThi_TuiBai_Id = ID dòng → rsKetQuaDangKy.
   Không chép (lỗi rõ của bản gốc):
     · Bảng CHƯA từng hiện dữ liệu (id đặt trên <tr> tiêu đề nên hàm vẽ bảng thoát ngay).
     · 20 ô tiêu đề / 19 ô dữ liệu → từ "Ngày công bố điểm" trở đi lệch cột; ở đây xếp đúng theo nhóm.
     · Nút dòng ghi "Đăng ký" và bật/tắt ba nút Đăng ký / Nộp phí / Huỷ của cổng sinh viên (không có ở màn này)
       → một nút "Lịch sử" (tiêu đề hộp gốc là "Lịch sử phúc khảo"). Ô từ khoá không có trong html gốc.
   Chờ nghiệp vụ:
     · Tài khoản cán bộ có được gọi dịch vụ XLHV (lịch sử) không — kiểm trên host.
     · "Thời hạn đăng ký còn lại" gốc đổ NGAYHETHANDANGKYPHUCKHAO (một ngày, không phải thời gian còn lại) — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nd-phuckhao');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: 'TP_PhucKhao/' + a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    root.innerHTML = pat.page('Khoa xem phúc khảo', '') +
        pat.filterBar([{ key: 'tg', type: 'select', label: 'Chọn thời gian' }, { key: 'hp', type: 'select', label: 'Chọn học phần' }]) +
        pat.panel({ title: 'Theo danh sách thi', icon: 'fa-book-open-reader', count: 'n', flush: true, zone: 'bang' });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var ds = [];
    var chain = pat.chain([f('tg'), f('hp')], { phatLai: false });
    get('LayThoiGianTheoDotThi').then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); chain.sync(); })
        .catch(function (err) { ums.api.handle(err, 'thời gian'); });
    function napHP() {
        if (!f('tg').value) { pat.fill(f('hp'), []); chain.sync(); return; }
        get('LayHocPhanPhucKhao', { strDaoTao_ThoiGianDaoTao_Id: f('tg').value }).then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần' }); chain.sync(); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    var G1 = ['Kết quả thi ban đầu'], G2 = ['Đăng ký phúc khảo'], G3 = ['Kết quả sau phúc khảo'];
    function tai() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        get('LayDSThiPhucKhaoNhapDiem', { strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strDaoTao_HocPhan_Id: f('hp').value }).then(function (r) {
            ds = arr(r.data);
            z('n').textContent = '(' + ds.length + ')';
            ui.table({ el: z('bang'), rows: ds, empty: 'Không có dữ liệu phúc khảo', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: G1, cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM', group: G1 },
                { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', group: G1 }, { title: 'Số báo danh', prop: 'SOBAODANH', group: G1, cls: 'is-center' },
                { title: 'Học phần thi', group: G1, render: function (x) { return ui.esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Loại điểm thi', prop: 'DIEM_THANHPHANDIEM_TEN', group: G1 }, { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN', group: G1 },
                { title: 'Ngày thi', prop: 'NGAYTHI', group: G1, cls: 'is-center is-nowrap' }, { title: 'Ca thi', prop: 'CATHI_TEN', group: G1, cls: 'is-center' },
                { title: 'Phòng thi', prop: 'PHONGTHI_TEN', group: G1, cls: 'is-center' }, { title: 'Kết quả', prop: 'DIEM', group: G1, cls: 'is-center' },
                { title: 'Ngày công bố điểm', prop: 'NGAYXACNHANHOANTHANHDIEMTHI', group: G2, cls: 'is-center' },
                { title: 'Ngày đăng ký phúc khảo', prop: 'NGAYDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
                { title: 'Thời hạn đăng ký còn lại', prop: 'NGAYHETHANDANGKYPHUCKHAO', group: G2, cls: 'is-center' },
                { title: 'Phí phúc khảo / Tình trạng', group: G2, render: function (x) { return ui.esc([e(x.PHIPHUCKHAO), e(x.TINHTRANGNOPPHI)].filter(Boolean).join(' - ')); } },
                { title: 'Kết quả duyệt', prop: 'TINHTRANG_TEN', group: G3 }, { title: 'Kết quả', prop: 'KETQUAPHUCKHAO', group: G3, cls: 'is-center' },
                { title: 'Lịch sử', cls: 'is-center', width: '60px', render: function (x, i) {
                    return '<button type="button" class="ums-iconbtn" data-ls="' + i + '" title="Lịch sử phúc khảo"><i class="fa-light fa-clock-rotate-left"></i></button>'; } }
            ] });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phúc khảo'); });
    }
    function lichSu(x) {
        var dlg = ui.dialog({ title: 'Lịch sử phúc khảo', icon: 'fa-calendar-lines-pen', size: 'xl',
            body: '<p class="ums-u-fz13 ums-u-muted">' + ui.esc(e(x.QLSV_NGUOIHOC_MASO) + ' - ' + e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)) + '</p><div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-x="bang"]');
        ums.api.call({ action: 'XLHV_TP_PhucKhao_MH/DSA4BRINKCIpEjQRKTQiCikgLgPP', func: 'pkg_thi_phach_phuckhao.LayDSLichSuPhucKhao',
            strThi_DanhSachThi_TuiBai_Id: x.ID, strNguoiThucHien_Id: uid() }).then(function (r) {
            ui.table({ el: h, rows: (r.data && r.data.rsKetQuaDangKy) || [], empty: 'Chưa có lịch sử', columns: [
                { title: 'Ngày thực hiện', prop: 'NGAYTHUCHIEN_DD_MM_YYYY', cls: 'is-center is-nowrap' }, { title: 'Hành động (Đăng ký/Hủy)', prop: 'HANHDONG' },
                { title: 'Học phần thi', render: function (y) { return ui.esc(e(y.DAOTAO_HOCPHAN_TEN) + ' - ' + e(y.DAOTAO_HOCPHAN_MA)); } },
                { title: 'Loại điểm thi', prop: 'DIEM_THANHPHANDIEM_TEN' }, { title: 'Hình thức thi', prop: 'HINHTHUCTHI_TEN' },
                { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center is-nowrap' }, { title: 'Ca thi', prop: 'CATHI_TEN', cls: 'is-center' }, { title: 'Phòng thi', prop: 'PHONGTHI_TEN', cls: 'is-center' }
            ] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
    }
    if (window.jQuery) {
        jQuery(f('tg')).on('select2:select select2:clear', function () { napHP(); tai(); });
        jQuery(f('hp')).on('select2:select select2:clear', tai);
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ls]');
        if (b) { lichSu(ds[Number(b.getAttribute('data-ls'))]); return; }
        if (ev.target.closest('[data-a="search"]')) tai();
    });
    tai();
})();
