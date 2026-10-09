/* =========================================================================
   Import số tiền miễn giảm
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/import_sotienmiengiam.html + scripts/import_sotienmiengiam.js
   ---------------------------------------------------------------------------
   Khung giao diện dùng chung: _chung_tracuu.js → ums.tcTraCuu.importScreen.
   Lời gọi (chép nguyên từ bản gốc, tất cả GET trừ Xoa/ChuyenDuLieu):
       TC_Import_SoTienMienGiam/LayDanhSach                   thẻ 1 (dDaChuyenKeToan 0)
       TC_Import_SoTienMienGiam/LayDSThongTinImport_DT_ST     ô "Mã đợt import"
       CM_DanhMucDuLieu/LayDanhSach  (KHDT.DIEM.KIEUHOC)       ô "Kiểu học"
       SYS_Import/getDataFormFileImport                        máy chủ đọc tệp Excel
       TC_Import_SoTienMienGiam/Import                         thực hiện import
       TC_Import_SoTienMienGiam/Xoa                            POST, từng dòng
       TC_Import_SoTienMienGiam/ChuyenDuLieu_DoiTuong_ST_Imp   POST, từng dòng

   Cố ý bỏ:
     · Thẻ 5 "Đã import và đã hạch toán" — bản gốc không dùng được: nút tìm có
       id "#btnSearchDaImport_DaHachToan" (thừa dấu #) nên không bao giờ nạp,
       và hàm nạp gửi dDaChuyenKeToan = 0 (trùng thẻ 1). Nút "Lưu" của thẻ đó
       gọi nhầm chuyển kế toán; save_HoachToan (Sua_ST_Import_DaChuyenKT)
       không được gọi.
     · Nút "Tải file lỗi" thẻ 4 — gọi me.report_Data không tồn tại (lỗi JS).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;

    function hoTen(r) { return ui.esc((r.HODEM == null ? '' : r.HODEM) + ' ' + (r.TEN == null ? '' : r.TEN)); }
    function tien(r) { return ui.money(r.SOTIEN == null ? 0 : r.SOTIEN) || '0'; }

    var COLS = [
        { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
        { title: 'Họ tên', render: hoTen },
        { title: 'Số tiền', render: tien, cls: 'is-right is-nowrap' },
        { title: 'Đối tượng', prop: 'QLSV_DOITUONG_TEN' },
        { title: 'Nội dung', prop: 'NOIDUNG' }
    ];

    ums.tcTraCuu.importScreen(document.getElementById('import_sotienmiengiam'), {
        title: 'Import số tiền miễn giảm',
        bang: null,
        kieuHoc: true,
        ngayLabel: 'Ngày giao dịch',
        resetBeforeImport: true,
        tip: function (r) { return (r.MASO || '') + ': ' + (r.SOTIEN == null ? '' : r.SOTIEN); },
        cols1: COLS,
        cols3: COLS,

        calls: {
            list: function (v) {
                return {
                    action: 'TC_Import_SoTienMienGiam/LayDanhSach',
                    versionAPI: 'v1.0',
                    strTuKhoa: v.fTuKhoa,
                    strNguoiTao_Id: '',
                    strTaiChinh_CacKhoanThu_Id: v.fLoaiKhoan,
                    strDaoTao_ThoiGianDaoTao_Id: v.fHocKy,
                    strDaoTao_CoSoDaoTao_id: '',
                    strQLSV_NguoiHoc_Id: '',
                    dDaChuyenKeToan: 0,
                    strThongTinImport: v.fMaDot,
                    strDiem_KieuHoc_Id: v.fKieuHoc
                };
            },
            list5: null,
            maThongTin: function () {
                return { action: 'TC_Import_SoTienMienGiam/LayDSThongTinImport_DT_ST', versionAPI: 'v1.0', dChuaChuyenKeToan: 0 };
            },
            import: function (v) {
                return {
                    action: 'TC_Import_SoTienMienGiam/Import',
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
                    strKieuHoc_Id: v.kieuHoc,
                    strNguoiThucHien_Id: '',
                    strMaImport: v.mau,
                    iChiSoImport: v.chiSo
                };
            },
            xoa: function (id) {
                return { action: 'TC_Import_SoTienMienGiam/Xoa', versionAPI: 'v1.0', strIds: id, strNguoiThucHien_Id: '' };
            },
            chuyen: function (id) {
                return {
                    action: 'TC_Import_SoTienMienGiam/ChuyenDuLieu_DoiTuong_ST_Imp',
                    versionAPI: 'v1.0',
                    strNguonDuLieu_Id: id,
                    strNguoiThucHien_Id: ''
                };
            }
        }
    });
})();
