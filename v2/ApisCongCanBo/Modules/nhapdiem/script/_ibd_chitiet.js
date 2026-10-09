/* =========================================================================
   inbangdiem — các hộp chi tiết của MỘT dòng (người học × chương trình) — ums.ibd.*
   Bản gốc: nhapdiem/script/inbangdiem.js (mỗi cột "Xem" một modal). Dòng = một dòng của
   pkg_diem_baocao.LayDanhSachHoSoNhieuNganh: QLSV_NGUOIHOC_ID, DAOTAO_TOCHUCCHUONGTRINH_ID (gửi làm "chương trình").
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; kiểu cũ là GET):
       Điểm toàn bộ   D_BaoCao_MH · pkg_diem_baocao.LayDSDiemKetThucCaNhan → "Xem" LayDSDiemThanhPhanCaNhan (DAOTAO_HOCPHAN_ID, dLanHoc)
       Điểm TB        SV_ThongTin/KetQuaHocTapCaNhan → vẽ bằng ums.diemHoc.veBangDiem (cùng cách nhóm + sáu dòng tổng)
       Tích luỹ khối  SV_ThongTin/LayKetQuaTichLuyTheoKhoi → ums.diemHoc.veTichLuy
       Kết quả ĐK     SV_ThongTin/LayDSThoiGianLichHoc → LayKetQuaDangKyHocCaNhan (rsKetQuaDangKy + rsLichSuDangKy)
       Học phần nợ    SV_ThongTin/LayDSHocPhanChuHoanThanh · Quyết định SV_ThongTin/LayDSQDCaNhan (strNguoiDung_Id = người học)
       Xử lý học vụ   SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayDSKetQuaXuLyHocVu
       Điểm rèn luyện SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.LayKQRenLuyenCaNhan → ums.diemHoc.veRenLuyen
       Tài chính      8 lời gọi TC_ThongTinChung/LayDSKhoan{PhaiNop,NoChung,NoRieng,DaNop,Mien,DaRut,DuChung,DuRieng} (versionAPI v1.0)
       Lịch học       ums.tkbSV (thoikhoabieusinhvien/script/_lichhocsv.js), danh sách lớp gửi id CÁN BỘ như bản nhapdiem
   Không chép (lỗi rõ của bản gốc):
     · "Điểm trung bình hệ 10" từng học kỳ lấy nhầm dòng TÍCH LUỸ (veBangDiem đã sửa). Cột "Chi tiết" luôn trống, không xử lý → bỏ.
     · Điểm TB rỗng thì lỗi JS (rsDiemThanhPhan của mảng rỗng). Kết quả ĐK: "Người học" thiếu dấu cách giữa họ đệm và tên.
     · Lịch học mở lần nào dựng lại lần đó (trình xử lý chồng), ghi đè nhãn "Điểm toàn bộ" → mỗi lần một hộp riêng.
     · Tài chính: tiêu đề mục trông như nút mà không bấm được → tiêu đề thường; căn phải cột tiền cho mọi mục.
   Chờ nghiệp vụ: Điểm rèn luyện đọc họ tên QLSV_NGUOIHOC_HODEM/TEN (bản gốc) — veRenLuyen đọc HODEM/TEN trước, thiếu thì cột QLSV_…
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var ibd = ums.ibd = ums.ibd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    ibd.nhan = function (r) { return e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN) + ' - ' + e(r.DAOTAO_LOPQUANLY_TEN); };
    function hop(title, icon, r, size, than) {
        var dlg = ui.dialog({ title: title + ' — ' + ibd.nhan(r), icon: icon, size: size || 'xl', body: than || '<div data-x="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        dlg.q = function (k) { return dlg.body.querySelector('[data-x="' + k + '"]'); };
        return dlg;
    }
    function loi(el) { return function (err) { el.innerHTML = ui.fail(err.message); }; }

    /* ---------- Điểm toàn bộ + chi tiết thành phần -------------------- */
    ibd.toanBo = function (r) {
        var dlg = hop('Điểm toàn bộ', 'fa-list-ol', r), h = dlg.q('bang'), ds = [];
        ums.api.call({ action: 'D_BaoCao_MH/DSA4BRIFKCQsCiQ1FSk0IgIgDykgLwPP', func: 'pkg_diem_baocao.LayDSDiemKetThucCaNhan', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strNguoiThucHien_Id: uid() })
            .then(function (x) {
                ds = arr(x.data);
                ui.table({ el: h, rows: ds, empty: 'Chưa có điểm', columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Điểm', prop: 'DIEM', cls: 'is-center' }, { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Điểm hệ 4', prop: 'DIEMQUYDOI', cls: 'is-center' }, { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', cls: 'is-center' },
                    { title: 'Xem', cls: 'is-center', width: '60px', render: function (y, i) { return '<button type="button" class="ums-iconbtn" data-tp="' + i + '" title="Chi tiết thành phần"><i class="fa-light fa-eye"></i></button>'; } }] });
            }).catch(loi(h));
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tp]'); if (!b) return;
            var y = ds[Number(b.getAttribute('data-tp'))];
            var d2 = ui.dialog({ title: 'Chi tiết thành phần — ' + e(y.DAOTAO_HOCPHAN_MA) + ' ' + e(y.DAOTAO_HOCPHAN_TEN), icon: 'fa-list-check', size: 'md', body: '<div data-x="tp">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var h2 = d2.body.querySelector('[data-x="tp"]');
            ums.api.call({ action: 'D_BaoCao_MH/DSA4BRIFKCQsFSkgLykRKSAvAiAPKSAv', func: 'pkg_diem_baocao.LayDSDiemThanhPhanCaNhan', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                strDaoTao_HocPhan_Id: y.DAOTAO_HOCPHAN_ID, dLanHoc: y.LANHOC, strNguoiThucHien_Id: uid() }).then(function (x) {
                ui.table({ el: h2, rows: arr(x.data), empty: 'Chưa có điểm thành phần', columns: [{ title: 'Thành phần', prop: 'TEN' }, { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }] });
            }).catch(loi(h2));
        });
    };

    /* ---------- Điểm TB · Tích luỹ khối · Rèn luyện (vẽ bằng ums.diemHoc) --- */
    ibd.diemTB = function (r) {
        var h = hop('Điểm trung bình', 'fa-chart-simple', r).q('bang');
        get('SV_ThongTin/KetQuaHocTapCaNhan', { strChucNang_Id: cn(), strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID })
            .then(function (x) { var d = x.data || {}; ums.diemHoc.veBangDiem(h, arr(d.rsDiemKetThucHocPhan), arr(d.rsDiemTrungBinhChung), { chiTiet: false, ghiChu: false }); }).catch(loi(h));
    };
    ibd.tichLuy = function (r) {
        var h = hop('Chi tiết điểm theo khối', 'fa-layer-group', r).q('bang');
        get('SV_ThongTin/LayKetQuaTichLuyTheoKhoi', { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID })
            .then(function (x) { ums.diemHoc.veTichLuy(h, x.data || {}); }).catch(loi(h));
    };
    ibd.renLuyen = function (r) {
        var h = hop('Điểm rèn luyện', 'fa-medal', r).q('bang');
        ums.api.call({ action: 'SV_ThongTin_MH/DSA4ChATJC8NNDgkLwIgDykgLwPP', func: 'pkg_congthongtin_hssv_thongtin.LayKQRenLuyenCaNhan', strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
            strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: uid() }).then(function (x) { ums.diemHoc.veRenLuyen(h, x.data || {}); }).catch(loi(h));
    };

    /* ---------- Kết quả đăng ký ---------------------------------------- */
    ibd.ketQuaDK = function (r) {
        var dlg = hop('Kết quả đăng ký', 'fa-clipboard-list', r, 'xl',
            '<div class="ums-filter"><div class="ums-field"><select class="ums-select" data-x="tg" data-ph="Chọn thời gian"><option value=""></option></select></div></div>' +
            '<div data-x="kq"></div><div class="ums-legend ums-legend--cach">Lịch sử đăng ký học</div><div data-x="ls"></div>');
        ui.enhance(dlg.body);
        function tai() {
            var kq = dlg.q('kq'), ls = dlg.q('ls');
            kq.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            get('SV_ThongTin/LayKetQuaDangKyHocCaNhan', { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ThoiGianDaoTao_Id: dlg.q('tg').value }).then(function (x) {
                var d = x.data || {};
                ui.table({ el: kq, rows: arr(d.rsKetQuaDangKy), empty: 'Chưa có dữ liệu', columns: [
                    { title: 'Mã lớp học phần', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên lớp học phần', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                    { title: 'Số tín', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center', sum: true },
                    { title: 'Người học', render: function (y) { return esc(e(y.QLSV_NGUOIHOC_HODEM) + ' ' + e(y.QLSV_NGUOIHOC_TEN) + ' - ' + e(y.QLSV_NGUOIHOC_MASO)); } },
                    { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-center' }, { title: 'Thời gian thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người thực hiện', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Học kỳ, đợt', prop: 'THOIGIAN', cls: 'is-center' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }] });
                ui.table({ el: ls, rows: arr(d.rsLichSuDangKy), empty: 'Chưa có dữ liệu', columns: [
                    { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' }, { title: 'Hành động', prop: 'HANHDONG' }, { title: 'Kết quả', prop: 'KETQUA' },
                    { title: 'Thời gian thực hiện', prop: 'THOIGIANTHUCHIEN', cls: 'is-center is-nowrap' }, { title: 'Mã học phần', prop: 'MAHOCPHAN' }, { title: 'Tên học phần', prop: 'TENHOCPHAN' },
                    { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' }, { title: 'Mã chương trình', prop: 'DAOTAO_CHUONGTRINH_MA' }, { title: 'Tên chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }] });
            }).catch(loi(kq));
        }
        get('SV_ThongTin/LayDSThoiGianLichHoc', { strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID }).then(function (x) { pat.fill(dlg.q('tg'), arr(x.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); })
            .catch(function () {}).then(tai);
        if (window.jQuery) jQuery(dlg.q('tg')).on('select2:select select2:clear', tai);
    };

    /* ---------- Học phần nợ · Xử lý học vụ · Quyết định ---------------- */
    function bangDon(tieuDe, icon, r, goi, cot) {
        var h = hop(tieuDe, icon, r).q('bang');
        goi.then(function (x) { ui.table({ el: h, rows: arr(x.data), empty: 'Chưa có dữ liệu', columns: cot }); }).catch(loi(h));
    }
    ibd.hpNo = function (r) {
        bangDon('Học phần chưa qua', 'fa-circle-exclamation', r, get('SV_ThongTin/LayDSHocPhanChuHoanThanh', { strChucNang_Id: cn(), strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
            strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID }), [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' }, { title: 'Học trình', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' },
            { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' }, { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
            { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }, { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' }, { title: 'Lớp học phần', prop: 'DIEM_DANHSACHHOC_TEN', cls: 'is-center' }]);
    };
    ibd.xuLyHocVu = function (r) {
        bangDon('Xử lý học vụ', 'fa-triangle-exclamation', r, ums.api.call({ action: 'SV_ThongTin_MH/DSA4BRIKJDUQNCAZNA04CS4iFzQP', func: 'pkg_congthongtin_hssv_thongtin.LayDSKetQuaXuLyHocVu',
            strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: uid() }), [
            { title: 'Thời gian', prop: 'THOIGIAN_HIENTHI', cls: 'is-center' }, { title: 'Mức xử lý', prop: 'MUCXULY_TEN' }, { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Ghi chú', prop: 'GHICHU' }]);
    };
    ibd.quyetDinh = function (r) {
        bangDon('Quyết định', 'fa-file-signature', r, get('SV_ThongTin/LayDSQDCaNhan', { strNguoiDung_Id: r.QLSV_NGUOIHOC_ID }), [
            { title: 'Số quyết định', prop: 'SOQUYETDINH' }, { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-center' }, { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUC', cls: 'is-center' },
            { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Loại quyết định', prop: 'LOAIQUYETDINH_TEN' }]);
    };

    /* ---------- Chi tiết tài chính (8 mục) ----------------------------- */
    var HK = [{ title: 'Học kỳ', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }, { title: 'Đợt', prop: 'DAOTAO_THOIGIANDAOTAO_DOT', cls: 'is-center' }, { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' }];
    function tien(t) { return { title: t || 'Số tiền', cls: 'is-right is-nowrap', sum: true, sumProp: 'SOTIEN', render: function (x) { return ui.money(x.SOTIEN || 0); } }; }
    var ND = { title: 'Nội dung', render: function (x) { return '<span title="' + esc(e(x.NOIDUNG)) + '">' + esc(e(x.NOIDUNG)) + '</span>'; } };
    var TC = [
        ['pn', 'Phải nộp', 'LayDSKhoanPhaiNop', HK.concat([tien(), { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }]), 0],
        ['pnc', 'Phải nộp chung', 'LayDSKhoanNoChung', HK.concat([ND, tien()]), 1], ['pnr', 'Phải nộp riêng', 'LayDSKhoanNoRieng', HK.concat([ND, tien()]), 1],
        ['dn', 'Đã nộp', 'LayDSKhoanDaNop', HK.concat([tien(), { title: 'Số chứng từ', prop: 'CHUNGTU_SO' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' },
            { title: 'Người tạo', prop: 'NGUOITAO_TENDAYDU' }]), 0],
        ['dm', 'Được miễn', 'LayDSKhoanMien', HK.concat([ND, tien('Số tiền được miễn')]), 0], ['dr', 'Đã rút', 'LayDSKhoanDaRut', HK.concat([ND, tien()]), 0],
        ['tc', 'Thừa chung', 'LayDSKhoanDuChung', HK.concat([ND, tien()]), 1], ['tr', 'Thừa riêng', 'LayDSKhoanDuRieng', HK.concat([ND, tien()]), 1]
    ];
    ibd.taiChinh = function (r) {
        function khoi(t) { return '<div class="ums-legend">' + t[1] + '</div><div data-x="' + t[0] + '" class="ums-u-mb-4">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'; }
        var dlg = hop('Chi tiết tài chính', 'fa-sack-dollar', r, 'xl', '<div class="ibd-tc"><div>' + [0, 1, 2].map(function (i) { return khoi(TC[i]); }).join('') + '</div><div>' +
            [3, 4, 5, 6, 7].map(function (i) { return khoi(TC[i]); }).join('') + '</div></div>');
        TC.forEach(function (t) {
            var o = { action: 'TC_ThongTinChung/' + t[2], method: 'GET', versionAPI: 'v1.0', silent: true, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strNguoiThucHien_Id: uid() };
            if (t[4]) { o.pageIndex = 1; o.pageSize = 1000000000; }
            ums.api.call(o).then(function (x) { ui.table({ el: dlg.q(t[0]), rows: arr(x.data), empty: 'Không có dữ liệu', columns: t[3] }); })
                .catch(function (err) { dlg.q(t[0]).innerHTML = ui.fail(err.message); });
        });
    };

    /* ---------- Lịch học (khung chung ums.tkbSV) ----------------------- */
    ibd.lichHoc = function (r) {
        var dlg = ui.dialog({ title: 'Lịch học — ' + e(r.QLSV_NGUOIHOC_MASO) + ' - ' + e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN), icon: 'fa-calendar-clock', size: 'xl', body: '<div data-x="lh"></div>' });
        ums.tkbSV.mount(dlg.q ? dlg.q('lh') : dlg.body.querySelector('[data-x="lh"]'), { sv: { ID: r.QLSV_NGUOIHOC_ID, MASO: r.QLSV_NGUOIHOC_MASO, HODEM: r.QLSV_NGUOIHOC_HODEM, TEN: r.QLSV_NGUOIHOC_TEN },
            nguoiDsLop: 'canbo', reportText: 'Báo cáo' });
    };
})();
