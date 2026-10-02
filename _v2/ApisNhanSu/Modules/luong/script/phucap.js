/* =========================================================================
   Phụ cấp — phòng tổ chức khai phụ cấp cho từng cán bộ
   Bản gốc: ApisNhanSu/Modules/luong/script/phucap.js
   ---------------------------------------------------------------------------
   HAI CỘT như bản gốc: cột trái "Danh sách cán bộ" (ums.luongB.canBo —
   getList_NhanSu, dLaCanBoNgoaiTruong 0, Khoa/Viện → Bộ môn); cột phải "Họ tên
   - Mã cán bộ" + MỖI LOẠI PHỤ CẤP (danh mục NHANSU.LOAIPHUCAP) MỘT KHUNG, hai
   khung một hàng (col-lg-6 gốc) → ums.pat.sections, mỗi khung một ums.crud.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_QT_ThongTinPhuCap/LayDanhSach  GET  strTuKhoa '', strNguoiTao_Id '', strNhanSu_ThongTinQD_Id '',
                                            strLoaiPhuCap_Id '', strNhanSu_HoSoCanBo_Id, pageIndex 1, pageSize 100000
           → gốc gọi MỘT lần rồi chia theo LOAIPHUCAP_ID; ở đây mỗi khung gọi một lần
             cùng tham số và lọc LOAIPHUCAP_ID tại chỗ (Nợ tầng chung: nguồn danh sách dùng chung).
       L_QT_ThongTinPhuCap/ThemMoi | CapNhat  POST
           strId, strNhanSu_ThongTinQD_Id (ô ẩn txtQuyetDinh_ID ← NHANSU_THONGTINQUYETDINH_ID),
           strSoQuyetDinh, strNgayQuyetDinh, strNguoiKyQuyetDinh '', strThongTinQuyetDinh '',
           strLoaiQuyetDinh_Id, strNgayHieuLuc, strNgayHetHieuLuc, iTrangThai 1, iThuTu 0,
           strNhanSu_HoSoCanBo_Id, dHieuLuc, dPhuCap, strLoaiPhuCap_Id (= khung), strDonViTinh_Id, strNgayApDung
       L_QT_ThongTinPhuCap/Xoa          POST strIds, strNguoiThucHien_Id
       Tệp đính kèm: NS_Files, gắn vào data.Id (thêm) / id dòng (sửa) như saveFiles gốc.
   Danh mục: NHANSU.LOAIPHUCAP (khung), KPI.DVT (Đơn vị tính), NS.QUDI (Loại quyết định).
   Cột đọc khi sửa (lấy từ danh sách, gốc không có LayChiTiet): PHUCAP,
   NHANSU_TTQUYETDINH_SOQD / _NGAYQD / _NGAYAD / _NGAYHL / _NGAYHHL, HIEULUC,
   LOAIQUYETDINH_ID, DONVITINH_ID.

   Khác bản gốc: biểu mẫu Thêm / Sửa phụ cấp gốc là hộp thoại — ở đây biểu mẫu
   thay chỗ khung (luật BO-CUC 1). Bảng gốc ẩn khi loại phụ cấp chưa có dòng
   nào — ở đây hiện "Không có dữ liệu". Cột ô đánh dấu trên tiêu đề bảng gốc
   không có nút xoá nhiều đi kèm → bỏ, xoá từng dòng như gốc.
   Bỏ: ô "Tình trạng làm việc" của cột trái (gốc không nạp, không đọc); lời gọi
   getList_NoiDungChuongTrinh (hàm không tồn tại) gắn vào ô không có trên màn.
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui;
    var C = 'L_QT_ThongTinPhuCap';
    var uid = L.uid;
    var nsId = '';
    var loai = ums.api.dm('NHANSU.LOAIPHUCAP');

    function cfg(lpc) {
        return {
            title: lpc.TEN,
            listTitle: lpc.TEN,
            formTitle: 'phụ cấp — ' + lpc.TEN,
            icon: 'fa-file-lines',
            multi: false,
            list: {
                call: function () {
                    return { action: C + '/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiTao_Id: '', strNhanSu_ThongTinQD_Id: '',
                        strLoaiPhuCap_Id: '', strNhanSu_HoSoCanBo_Id: nsId, pageIndex: 1, pageSize: 100000 };
                },
                rows: function (d) { return L.rows({ data: d }).filter(function (r) { return r.LOAIPHUCAP_ID === lpc.ID; }); }
            },
            columns: [
                { title: 'Hệ số', prop: 'PHUCAP', cls: 'is-center' },
                { title: 'Ngày áp dụng', prop: 'NHANSU_TTQUYETDINH_NGAYAD', cls: 'is-center is-nowrap' },
                { title: 'Ngày có hiệu lực', prop: 'NHANSU_TTQUYETDINH_NGAYHL', cls: 'is-center is-nowrap' },
                { title: 'Ngày hết hiệu lực', prop: 'NHANSU_TTQUYETDINH_NGAYHHL', cls: 'is-center is-nowrap' }
            ],
            fields: [
                { key: 'strNhanSu_ThongTinQD_Id', col: 'NHANSU_THONGTINQUYETDINH_ID', type: 'hidden' },
                { key: 'dPhuCap', col: 'PHUCAP', label: 'Hệ số' },
                { key: 'strSoQuyetDinh', col: 'NHANSU_TTQUYETDINH_SOQD', label: 'Số quyết định' },
                { key: 'strNgayQuyetDinh', col: 'NHANSU_TTQUYETDINH_NGAYQD', label: 'Ngày quyết định', type: 'date' },
                { key: 'strNgayApDung', col: 'NHANSU_TTQUYETDINH_NGAYAD', label: 'Ngày áp dụng', type: 'date' },
                { key: 'strNgayHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHL', label: 'Ngày có hiệu lực', type: 'date' },
                { key: 'strNgayHetHieuLuc', col: 'NHANSU_TTQUYETDINH_NGAYHHL', label: 'Ngày hết hiệu lực', type: 'date' },
                { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', value: '1', required: true,
                  source: { items: [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] }, placeholder: false },
                { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: { dm: 'NS.QUDI' } },
                { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị tính', type: 'select', source: { dm: 'KPI.DVT' } },
                { key: '_tep', label: 'File đính kèm', type: 'files', api: 'NS_Files' }
            ],
            save: function (v, row) {
                return {
                    action: C + (row ? '/CapNhat' : '/ThemMoi'),
                    strId: row ? row.ID : '',
                    strNhanSu_ThongTinQD_Id: v.strNhanSu_ThongTinQD_Id,
                    strSoQuyetDinh: v.strSoQuyetDinh,
                    strNgayQuyetDinh: v.strNgayQuyetDinh,
                    strNguoiKyQuyetDinh: '',
                    strThongTinQuyetDinh: '',
                    strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                    strNgayHieuLuc: v.strNgayHieuLuc,
                    strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                    iTrangThai: 1,
                    iThuTu: 0,
                    strNhanSu_HoSoCanBo_Id: nsId,
                    dHieuLuc: v.dHieuLuc,
                    dPhuCap: v.dPhuCap,
                    strLoaiPhuCap_Id: row ? (row.LOAIPHUCAP_ID || lpc.ID) : lpc.ID,
                    strDonViTinh_Id: v.strDonViTinh_Id,
                    strNgayApDung: v.strNgayApDung,
                    strNguoiThucHien_Id: uid()
                };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); }
        };
    }

    L.canBo(document.getElementById('phucap'), {
        title: 'Phụ cấp',
        onPick: function (r, host) {
            nsId = r.ID;
            host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            loai.then(function (ds) {
                if (nsId !== r.ID) return;
                host.innerHTML = '<div class="lgb-phucap"></div>';
                if (!ds.length) { host.firstChild.innerHTML = ui.empty('Chưa khai danh mục loại phụ cấp (NHANSU.LOAIPHUCAP)'); return; }
                ums.pat.sections({ el: host.firstChild, tabs: [{ key: 'pc', text: 'Phụ cấp', sections: ds.map(cfg) }] });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'loại phụ cấp'); });
        }
    });
})();
