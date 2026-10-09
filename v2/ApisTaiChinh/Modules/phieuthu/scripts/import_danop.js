/* =========================================================================
   Import các khoản đã nộp
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/import_danop.html + scripts/import_danop.js
   ---------------------------------------------------------------------------
   Khung giao diện dùng chung: _chung_tracuu.js → ums.tcTraCuu.importScreen.
   Lời gọi (chép nguyên từ bản gốc, tất cả GET trừ Xoa/ChuyenDuLieu):
       CMS_DanhMucThuocTinh… #TAICHINH.IMPORT.BANGDULIEU.THU   ô "Bảng dữ liệu"
       TC_Import/LayDS_Import_DaNop           thẻ 1 (dDaChuyenKeToan 0) và thẻ 5 (1)
       TC_Import_DaNop/LayDSThongTinImport_DaNop  ô "Mã đợt import"
       SYS_Import/getDataFormFileImport        máy chủ đọc tệp Excel đã tải lên
       TC_Import_DaNop/Import                  thực hiện import
       TC_Import_DaNop/Xoa                     POST, từng dòng
       TC_Import_DaNop/ChuyenDuLieu_DaNop      POST, từng dòng
       (khoản thu, học kỳ, mẫu import: xem _chung_tracuu.js)

   Cố ý bỏ:
     · Nút "Lưu" ở thẻ 5 — bản gốc gắn nhầm save_ChuyenKeToan (chuyển kế
       toán lại các dòng ĐÃ hạch toán), còn hàm save_HoachToan
       (TC_Import_DaNop/Sua_Import_DaNop_DaChuyenKT, đọc số tiền / nội dung
       sửa trong ô) không được gọi ở đâu. Hai ô sửa trong bảng thẻ 5 vì vậy
       hiện dạng chữ. Cần nghiệp vụ xác nhận trước khi bật lại.
     · Nút "Tải file lỗi" ở thẻ 4 — bản gốc gọi me.report_Data không tồn tại
       trong tệp này (bấm là lỗi JS).
   Lỗi bản gốc khác (đã sửa, không đổi lời gọi):
     · Nút "Tải lại" thẻ 5 nạp lại thẻ 1 → ở đây nạp lại thẻ 5.
     · Tiêu đề bảng thẻ 5 có cột "Mã giao dịch" nhưng không có dữ liệu → bỏ.
   Giữ nguyên (nghi ngờ): thẻ 5 lọc theo "Mã đợt import" của ô NHẬP (thông
   tin bổ sung), không phải ô lọc của thẻ 1.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var ACT = 'TC_Import/LayDS_Import_DaNop';

    function hoTen(r) { return ui.esc((r.HODEM == null ? '' : r.HODEM) + ' ' + (r.TEN == null ? '' : r.TEN)); }
    function tien(r) { return ui.money(r.SOTIEN == null ? 0 : r.SOTIEN) || '0'; }

    var COLS = [
        { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
        { title: 'Họ tên', render: hoTen },
        { title: 'Số tiền', render: tien, cls: 'is-right is-nowrap' },
        { title: 'Mã giao dịch', prop: 'MAGIAODICHCHUYENTIEN', cls: 'is-center' },
        { title: 'Nội dung', prop: 'NOIDUNG' }
    ];

    function list(v, daChuyen, tuKhoa, maDot) {
        return {
            action: ACT,
            versionAPI: 'v1.0',
            strNguoiTao_Id: '',
            strTuKhoa: tuKhoa,
            strTaiChinh_CacKhoanThu_Id: v.fLoaiKhoan,
            strDaoTao_ThoiGianDaoTao_Id: v.fHocKy,
            strDaoTao_CoSoDaoTao_id: '',
            strQLSV_NguoiHoc_Id: '',
            dDaChuyenKeToan: daChuyen,
            strThongTinImport: maDot,
            strBangDuLieu_Thu_Id: v.bang
        };
    }

    ums.tcTraCuu.importScreen(document.getElementById('import_danop'), {
        title: 'Import các khoản đã nộp',
        bang: { dm: 'TAICHINH.IMPORT.BANGDULIEU.THU' },
        ngayLabel: 'Ngày giao dịch',
        resetBeforeImport: true,
        filterNullCols: true,
        clearThatBaiOnView: true,
        xoaReload5: true,
        tip: function (r) { return (r.MASO || '') + ': ' + (r.SOTIEN == null ? '' : r.SOTIEN); },

        cols1: COLS,
        cols3: COLS,
        cols5: [
            { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
            { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Số tiền', render: tien, cls: 'is-right is-nowrap' },
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' }
        ],

        calls: {
            list: function (v) { return list(v, 0, v.fTuKhoa, v.fMaDot); },
            list5: function (v) { return list(v, 1, v.f5TuKhoa, v.maDot); },
            maThongTin: function (v) {
                return {
                    action: 'TC_Import_DaNop/LayDSThongTinImport_DaNop',
                    dChuaChuyenKeToan: 0,
                    strBangDuLieu_Thu_Id: v.bang
                };
            },
            import: function (v) {
                return {
                    action: 'TC_Import_DaNop/Import',
                    versionAPI: 'v1.0',
                    strPath: v.path,
                    strSheetName: v.sheetName,
                    dChuyenKeToan: v.chuyenKT,
                    dNganh1_2: '1',
                    strTaiChinh_CacKhoanThu_Id: v.loaiKhoan,
                    strDaoTao_ThoiGianDaoTao_Id: v.hocKy,
                    strDaoTao_CoSoDaoTao_Id: '',
                    strThongTinImport: v.maDot,
                    strNgayGiaoDich: v.ngay,
                    dCheDoKiemTraDuLieu: v.kiemTra,
                    strNguoiThucHien_Id: '',
                    strMaImport: v.mau,
                    strBangDuLieu_Thu_Id: v.bang,
                    iChiSoImport: v.chiSo
                };
            },
            xoa: function (id) {
                return { action: 'TC_Import_DaNop/Xoa', versionAPI: 'v1.0', strIds: id, strNguoiThucHien_Id: '' };
            },
            chuyen: function (id, v) {
                return {
                    action: 'TC_Import_DaNop/ChuyenDuLieu_DaNop',
                    versionAPI: 'v1.0',
                    strNguonDuLieu_Id: id,
                    strBangDuLieu_Thu_Id: v.bang,
                    strNguoiThucHien_Id: ''
                };
            }
        }
    });
})();
