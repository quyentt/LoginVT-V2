/* =========================================================================
   Import các khoản phải nộp
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/import_phainop.html + scripts/import_phainop.js
   ---------------------------------------------------------------------------
   Khung giao diện dùng chung: _chung_tracuu.js → ums.tcTraCuu.importScreen.
   Lời gọi (chép nguyên từ bản gốc, tất cả GET trừ Xoa/ChuyenDuLieu/Sys_Report):
       CMS_DanhMucThuocTinh… #TAICHINH.IMPORT.BANGDULIEU.CHI   ô "Bảng dữ liệu"
       TC_Import/LayDS_Import_PhaiNop          thẻ 1 (dDaChuyenKeToan 0) và thẻ 5 (1)
       TC_Import/LayDSThongTinImport_PhaiNop   ô "Mã đợt import"
       SYS_Import/getDataFormFileImport        máy chủ đọc tệp Excel đã tải lên
       TC_Import_PhaiNop/Import                thực hiện import (strNgayPhatSinhCongNo)
       TC_Import_PhaiNop/Xoa                   POST, từng dòng
       TC_Import_PhaiNop/ChuyenDuLieu_PhaiNop  POST, từng dòng
       Sys_Report/ThemMoi                      "Tải tệp lỗi" (report_Data, ô A2…F…)

   Khác import_danop đúng như bản gốc: strNguoiTao_Id = người đăng nhập,
   bảng dữ liệu là strBangDuLieu_Chi_Id, thẻ 5 không lọc theo bảng dữ liệu,
   xoá xong chỉ nạp lại thẻ 1, dọn ô tệp/sheet SAU khi import thành công.

   Cố ý bỏ:
     · Nút "Lưu" ở thẻ 5 — bản gốc gắn nhầm save_ChuyenKeToan cho các dòng
       ĐÃ hạch toán; save_HoachToan (TC_Import_PhaiNop/Sua_Import_PhaiNop_DaChuyenKT)
       không được gọi ở đâu. Ô sửa số tiền / nội dung hiện dạng chữ.
   Sửa không đổi lời gọi: nút "Tải lại" thẻ 5 nạp lại thẻ 5 (bản gốc nạp thẻ 1);
   tiêu đề bảng thẻ 1/3 thiếu cột "Mã giao dịch" dù có dữ liệu → bổ sung đúng
   cột dữ liệu; thẻ 5 bỏ tiêu đề "Mã giao dịch" không có dữ liệu.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var ACT = 'TC_Import/LayDS_Import_PhaiNop';

    function hoTen(r) { return ui.esc((r.HODEM == null ? '' : r.HODEM) + ' ' + (r.TEN == null ? '' : r.TEN)); }
    function tien(r) { return ui.money(r.SOTIEN == null ? 0 : r.SOTIEN) || '0'; }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    function list(v, daChuyen, tuKhoa, maDot, bang) {
        var o = {
            action: ACT,
            versionAPI: 'v1.0',
            strNguoiTao_Id: uid(),
            strTuKhoa: tuKhoa,
            strTaiChinh_CacKhoanThu_Id: v.fLoaiKhoan,
            strDaoTao_ThoiGianDaoTao_Id: v.fHocKy,
            strDaoTao_CoSoDaoTao_id: ''
        };
        if (bang) o.strBangDuLieu_Chi_Id = v.bang;
        o.strQLSV_NguoiHoc_Id = '';
        o.dDaChuyenKeToan = daChuyen;
        o.strThongTinImport = maDot;
        return o;
    }

    ums.tcTraCuu.importScreen(document.getElementById('import_phainop'), {
        title: 'Import các khoản phải nộp',
        bang: { dm: 'TAICHINH.IMPORT.BANGDULIEU.CHI' },
        ngayLabel: 'Ngày phát sinh công nợ',
        resetBeforeImport: false,
        tip: function (r) { return (r.MASO || '') + ': ' + (r.SOTIEN == null ? '' : r.SOTIEN); },

        cols1: [
            { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Số tiền', render: tien, cls: 'is-right is-nowrap' },
            { title: 'Nội dung', prop: 'NOIDUNG' }
        ],
        cols3: [
            { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Số tiền', render: tien, cls: 'is-right is-nowrap' },
            { title: 'Mã giao dịch', prop: 'MAGIAODICHCHUYENTIEN', cls: 'is-center' },
            { title: 'Nội dung', prop: 'NOIDUNG' }
        ],
        cols5: [
            { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' },
            { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Số tiền', render: tien, cls: 'is-right is-nowrap' },
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Số chứng từ', prop: 'CHUNGTU_SO', cls: 'is-center' }
        ],

        /* report_Data("ImportThatBai", "tblImport_ThatBai", [0..5]) — bảng lỗi
           gốc dựng dòng đầu là tên cột rồi mới đến dữ liệu, nên ô A2 là tên cột */
        exportLoi: function (rows) {
            if (!rows || !rows.length) { ui.toast('Không có dòng lỗi để tải.', 'warn'); return; }
            var keys = Object.keys(rows[0]);
            var matrix = [keys].concat(rows.map(function (r) { return keys.map(function (k) { return r[k]; }); }));
            ums.tcTraCuu.reportCells('ImportThatBai', matrix, [0, 1, 2, 3, 4, 5].filter(function (i) { return i < keys.length; }));
        },

        calls: {
            list: function (v) { return list(v, 0, v.fTuKhoa, v.fMaDot, true); },
            list5: function (v) { return list(v, 1, v.f5TuKhoa, v.maDot, false); },
            maThongTin: function (v) {
                return {
                    action: 'TC_Import/LayDSThongTinImport_PhaiNop',
                    versionAPI: 'v1.0',
                    dChuaChuyenKeToan: 0,
                    strBangDuLieu_Chi_Id: v.bang
                };
            },
            import: function (v) {
                return {
                    action: 'TC_Import_PhaiNop/Import',
                    versionAPI: 'v1.0',
                    strPath: v.path,
                    strSheetName: v.sheetName,
                    dChuyenKeToan: v.chuyenKT,
                    dNganh1_2: '1',
                    strTaiChinh_CacKhoanThu_Id: v.loaiKhoan,
                    strDaoTao_ThoiGianDaoTao_Id: v.hocKy,
                    strDaoTao_CoSoDaoTao_Id: '',
                    strThongTinImport: v.maDot,
                    strNgayPhatSinhCongNo: v.ngay,
                    dCheDoKiemTraDuLieu: v.kiemTra,
                    strNguoiThucHien_Id: '',
                    strMaImport: v.mau,
                    strBangDuLieu_Chi_Id: v.bang,
                    iChiSoImport: v.chiSo
                };
            },
            xoa: function (id) {
                return { action: 'TC_Import_PhaiNop/Xoa', versionAPI: 'v1.0', strIds: id, strNguoiThucHien_Id: '' };
            },
            chuyen: function (id) {
                return {
                    action: 'TC_Import_PhaiNop/ChuyenDuLieu_PhaiNop',
                    versionAPI: 'v1.0',
                    strNguonDuLieu_Id: id,
                    strNguoiThucHien_Id: ''
                };
            }
        }
    });
})();
