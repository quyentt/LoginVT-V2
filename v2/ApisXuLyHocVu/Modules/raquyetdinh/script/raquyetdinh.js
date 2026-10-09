/* =========================================================================
   Ra quyết định xử lý học vụ
   Bản gốc: ApisXuLyHocVu/Modules/raquyetdinh/html/raquyetdinh.html + script/raquyetdinh.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm GIỐNG HỆT pheduyetketqua → khung "Danh sách" (ẩn tới
   khi Tìm kiếm, nút × đóng lại): hàng "Chọn quyết định · Tạo mới quyết định · Thêm SV vào quyết
   định" rồi bảng người học (cột ô đánh dấu). Hộp "Nhập mới quyết định", hộp "Thay đổi mức
   cảnh cáo". Thanh lọc, bảng, hộp đổi mức: ums.xlhv.man (../../pheduyetketqua/script/_xlhv.js)
   trên ums.xlhvKQ (../../thuchienxulyhocvu/script/_ketqua.js).

   Lời gọi riêng của màn (chép nguyên, đều POST, có func → mã hoá):
       SV_QuyetDinh_MH  pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh   ô "Chọn quyết định" (SOQUYETDINH);
            mọi ô lọc gốc đọc txtAAAA / dropAAAA → rỗng; strNguonDuLieu_Id = me.strKeHoachXuLy_Id — biến
            KHÔNG BAO GIỜ được gán → rỗng; pageIndex 1, pageSize 1000000.
       SV_QuyetDinh_MH  pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh    ô "Loại quyết định" (strNguoiDung_Id).
       Danh mục QLSV.CQD → "Cấp quyết định"; Học kỳ của hộp = danh sách thời gian đào tạo của thanh lọc.
       SV_QuyetDinh_MH  pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh   Lưu hộp "Nhập mới quyết định":
            strHinhThucQuyetDinh_Id '' (dropAAAA), strLoaiQuyetDinh_Id, strSoQuyetDinh, strNgayQuyetDinh,
            strCapQuyetDinh_Id, strNgayHieuLuc, strNguyenNhan_LyDo (ô Nội dung), strDaoTao_ThoiGianDaoTao_Id,
            strNguonDuLieu_Id '' (như trên). Xong nạp lại ô quyết định.
       SV_QuyetDinh_MH  pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh_NguoiHoc   "Thêm SV vào quyết định":
            mỗi dòng đã đánh dấu một lời gọi — strQLSV_NguoiHoc_Id, strQLSV_QuyetDinh_Id, strDaoTao_LopQuanLy_Id,
            strDaoTao_ToChucCT_Id (DAOTAO_TOCHUCCHUONGTRINH_ID), strTrangThaiNguoiHoc_Id
            (QLSV_TRANGTHAINGUOIHOC_ID), strTrack_Id. Dòng đã có QLSV_QUYETDINH_ID thì BỎ QUA (như gốc). Xong nạp lại danh sách.
            strTrack_Id: gốc KHÔNG gửi → máy chủ trả ORA-01400 (cột TRACK_ID của QLSV_QUYETDINH_NGUOIHOC không cho trống) nên
            "Thêm SV vào quyết định" không thêm được ai. Bản mới tra TRACK_ID theo lớp (SV_NGUOIHOC_01_MH ·
            PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc) rồi gửi kèm, như màn Quyết định của phân hệ Sinh viên.
       Xuất báo cáo / Import: ums.report.mount (getList_MauImport "zonebtnQD", có vùng _Import) — khối
            addKeyValue như pheduyetketqua nhưng KHÔNG có strTuKhoa.
   Khác bản gốc / lỗi gốc:
     · "Kết quả điều chỉnh" → hộp đổi mức: gốc CHƯA TỪNG chạy ở màn này (trình xử lý đọc biến aData không
       tồn tại → ReferenceError; tìm dòng trong chuỗi strRaQuyetDinh thay vì danh sách; nút Lưu gắn
       #btnSave_TieuChi không có trong html) → làm theo ý định, dùng chung hộp ums.xlhvKQ.hopDoiMuc.
       Đường GHI mới — kiểm trên host. Lưu gọi XLHV_KetQuaXuLy/CapNhat (xem _xlhv.js).
     · "Nhập mới quyết định": biểu mẫu NGAY TRONG TRANG (BO-CUC luật 1), không bật hộp thoại; gốc đóng hộp cả khi
       lưu lỗi → nay chỉ đóng khi lưu được. "Thay đổi mức cảnh cáo" cũng là biểu mẫu trong trang (_xlhv.js truyền host).
     · Thêm SV: gốc đếm tiến độ bằng genHTML_Progress trong một thông báo → ums.ui.batch; mọi dòng đã có
       quyết định thì báo (gốc im lặng).
     · Gốc mở màn chỉ nạp Hệ + Khoá (CT, Lớp bị chú thích) — nay nối tầng khoá con như mọi màn.
   Bỏ: getList_MauImport riêng, report(), TaoHangDoi_ThucHienXuLy (mã chết — xem _ketqua.js);
       ô dropSearch_QuyetDinh_QD (không có trong html); danh sách ô reset txtQuyetDinh_Ten / NgayKetThuc /
       NguoiKy / ChuKy / dropHinhThuc (không có trong html).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.xlhvKQ, esc = ui.esc;
    var root = document.getElementById('xlhv-raquyetdinh');
    if (!root) return;
    var QD = 'SV_QuyetDinh_MH/';

    var man = ums.xlhv.man(root, {
        tieuDe: 'Ra quyết định xử lý học vụ',
        tren: '<div class="xlhv-qd"><div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-q="qd" data-ph="Chọn quyết định"><option value=""></option></select></div>' +
                '<div class="ums-field ums-field--fit">' +
                    ui.btn('add', { text: 'Tạo mới quyết định', attr: { 'data-a': 'taoqd' } }) + ' ' +
                    ui.btn('add', { text: 'Thêm SV vào quyết định', mod: 'out-success', icon: 'fa-paper-plane', attr: { 'data-a': 'themsv' } }) +
                '</div></div></div>',
        onNut: function (a) { if (a === 'taoqd') taoQD(); else if (a === 'themsv') themSV(); }
    });
    var selQD = root.querySelector('[data-q="qd"]');
    var X = { uid: K.uid, cn: K.cn, arr: K.arr };
    /* Học kỳ của hộp: gốc đổ CÙNG danh sách thời gian đào tạo vào ô lọc và ô của hộp (renderPlace hai ô)
       → đọc lại các mục của ô lọc Học kỳ */
    function dsHocKy() {
        return Array.prototype.filter.call(man.loc.f('hk').options, function (o) { return o.value; })
            .map(function (o) { return { ID: o.value, DAOTAO_THOIGIANDAOTAO: o.text }; });
    }

    /* ---------- Danh mục quyết định ------------------------------------- */
    function napQD() {
        return ums.api.call({ action: QD + 'DSA4BRIQDRIXHhA0OCQ1BSgvKQPP', func: 'pkg_hosohocvien_quyetdinh.LayDSQLSV_QuyetDinh',
            method: 'POST', silent: true, strTuKhoa: '', strChucNang_Id: X.cn(), strNamNhapHoc: '', strKhoaQuanLy_Id: '',
            strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '', strTrangThaiNguoiHoc_Id: '',
            strQLSV_NguoiHoc_Id: '', strLoaiQuyetDinh_Id: '', strCapQuyetDinh_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
            strNguoiTao_Id: '', strNguonDuLieu_Id: '', strNguoiThucHien_Id: X.uid(), pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { pat.fill(selQD, X.arr(r.data), { name: 'SOQUYETDINH', head: 'Chọn quyết định' }); })
            .catch(function (err) { ums.api.handle(err, 'danh sách quyết định'); });
    }
    napQD();
    var loaiQD = ums.api.call({ action: QD + 'DSA4BRINLiAoEDQ4JDUFKC8p', func: 'pkg_hosohocvien_quyetdinh.LayDSLoaiQuyetDinh',
        method: 'POST', silent: true, strNguoiDung_Id: X.uid() })
        .then(function (r) { return X.arr(r.data); })
        .catch(function (err) { ums.api.handle(err, 'loại quyết định'); return []; });

    /* ---------- "Nhập mới quyết định" (#myModalAddQuyetDinh) — biểu mẫu NGAY TRONG TRANG, thay chỗ màn (BO-CUC luật 1) --------- */
    function taoQD() {
        function sel(k, ph) { return '<select class="ums-select" data-qd="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'; }
        function inp(k, date) { return '<input class="ums-input" data-qd="' + k + '"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + ' autocomplete="off">'; }
        function dong(nhan, ctrl, ca) { return '<div' + (ca ? ' style="grid-column:1 / -1"' : '') + '>' + ui.field(nhan, ctrl, { inline: true, labelWidth: '150px' }) + '</div>'; }
        var dlg = pat.formTrang({ host: root, title: 'Nhập mới quyết định', body:
            dong('Loại quyết định', sel('loai', 'Chọn loại quyết định')) +
            dong('Cấp quyết định', sel('cap', 'Chọn cấp quyết định')) +
            dong('Học kỳ', sel('hk', 'Chọn học kỳ')) +
            dong('Số quyết định', inp('so')) +
            dong('Ngày quyết định', inp('ngay', 1)) +
            dong('Ngày hiệu lực', inp('hieuluc', 1)) +
            dong('Nội dung', inp('mota'), 1),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) { luu(d); return false; } }] });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-qd="' + k + '"]'); }
        ui.enhance(B);
        loaiQD.then(function (d) { pat.fill(q('loai'), d, { name: 'TEN', head: 'Chọn loại quyết định' }); });
        ums.api.dm('QLSV.CQD').then(function (d) { pat.fill(q('cap'), d, { head: pat.dmTitle(d) || 'Chọn cấp quyết định' }); })
            .catch(function (err) { ums.api.handle(err, 'cấp quyết định'); });
        pat.fill(q('hk'), dsHocKy(), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' });

        function luu(d) {
            ums.api.call({ action: QD + 'FSkkLB4QDRIXHhA0OCQ1BSgvKQPP', func: 'pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh', method: 'POST',
                strHinhThucQuyetDinh_Id: '', strLoaiQuyetDinh_Id: q('loai').value, strSoQuyetDinh: q('so').value.trim(),
                strNgayQuyetDinh: q('ngay').value.trim(), strCapQuyetDinh_Id: q('cap').value, strNgayHieuLuc: q('hieuluc').value.trim(),
                strNguyenNhan_LyDo: q('mota').value.trim(), strDaoTao_ThoiGianDaoTao_Id: q('hk').value,
                strNguonDuLieu_Id: '', strNguoiThucHien_Id: X.uid() })
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); d.close(); napQD(); })
                .catch(function (err) { ums.api.handle(err, 'tạo quyết định'); });
        }
    }

    /* ---------- "Thêm SV vào quyết định" --------------------------------- */
    /* TRACK_ID của người học: bảng QLSV_QUYETDINH_NGUOIHOC bắt buộc cột này (kiểm host 30/9: thiếu là ORA-01400), dòng kết quả
       xử lý lại không mang nó → tra theo LỚP bằng PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc — chính danh sách mà màn Quyết định của phân
       hệ Sinh viên lấy TRACK_ID để gửi strTrack_Id. Mỗi lớp một lời gọi. → { 'idNguoiHoc|idLớp': [{ ct, track }] } */
    function traTrack(rows) {
        var lop = {}, m = {};
        rows.forEach(function (r) { if (r.DAOTAO_LOPQUANLY_ID) lop[r.DAOTAO_LOPQUANLY_ID] = 1; });
        return Promise.all(Object.keys(lop).map(function (id) {
            return ums.api.call({ action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc', silent: true,
                strTuKhoa: '', strNguoiThucHien_Id: '', strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '',
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: id, strStudyStatus_Ids: '', dIsPrimary: '', dBoQuaPhamVi: '',
                pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    X.arr(r.data).forEach(function (x) {
                        if (!x.TRACK_ID) return;
                        var key = x.QLSV_NGUOIHOC_ID + '|' + id;
                        (m[key] = m[key] || []).push({ ct: x.DAOTAO_TOCHUCCHUONGTRINH_ID, track: x.TRACK_ID });
                    });
                });
        })).then(function () { return m; });
    }
    function trackCua(m, r) {
        var ds = m[K.e(r.QLSV_NGUOIHOC_ID) + '|' + K.e(r.DAOTAO_LOPQUANLY_ID)] || [];
        var dung = ds.filter(function (x) { return x.ct === r.DAOTAO_TOCHUCCHUONGTRINH_ID; })[0] || ds[0];
        return dung ? dung.track : '';
    }
    function themSV() {
        var qd = selQD.value;
        if (!qd) { ui.toast('Vui lòng chọn quyết định?', 'warn'); return; }
        var chon = man.chon();
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var can = chon.filter(function (r) { return !r.QLSV_QUYETDINH_ID; });
        if (!can.length) { ui.toast('Các sinh viên đã chọn đều đã có quyết định', 'info'); return; }
        traTrack(can).then(function (m) {
            var gui = can.filter(function (r) { return trackCua(m, r); });
            if (gui.length < can.length) {
                ui.toast('Không tra được mã theo dõi (TRACK) của ' + (can.length - gui.length) + ' sinh viên trong danh sách lớp — bỏ qua các sinh viên này', 'warn');
            }
            if (!gui.length) return;
            return ui.batch(gui.map(function (r) {
                return { action: QD + 'FSkkLB4QDRIXHhA0OCQ1BSgvKR4PJjQuKAkuIgPP', func: 'pkg_hosohocvien_quyetdinh.Them_QLSV_QuyetDinh_NguoiHoc',
                    method: 'POST', strQLSV_NguoiHoc_Id: K.e(r.QLSV_NGUOIHOC_ID), strQLSV_QuyetDinh_Id: qd,
                    strDaoTao_LopQuanLy_Id: K.e(r.DAOTAO_LOPQUANLY_ID), strDaoTao_ToChucCT_Id: K.e(r.DAOTAO_TOCHUCCHUONGTRINH_ID),
                    strTrangThaiNguoiHoc_Id: K.e(r.QLSV_TRANGTHAINGUOIHOC_ID), strTrack_Id: trackCua(m, r), strNguoiThucHien_Id: X.uid() };
            }), { title: 'Đang thêm sinh viên vào quyết định', okText: 'Thực hiện thành công' }).then(function () {
                if (can.length < chon.length) ui.toast('Bỏ qua ' + (chon.length - can.length) + ' sinh viên đã có quyết định', 'info');
                man.tai();
            });
        }).catch(function (err) { ums.api.handle(err, 'tra mã theo dõi của sinh viên'); });
    }
})();
