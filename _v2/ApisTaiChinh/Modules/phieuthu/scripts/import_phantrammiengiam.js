/* =========================================================================
   Import phần trăm miễn giảm
   Bản gốc: ApisTaiChinh/Modules/phieuthu/html/import_phantrammiengiam.html + scripts/import_phantrammiengiam.js
   ---------------------------------------------------------------------------
   Khung giao diện dùng chung: _chung_tracuu.js → ums.tcTraCuu.importScreen.
   Lời gọi (chép nguyên từ bản gốc, tất cả GET trừ Xoa/ChuyenDuLieu):
       TC_Import_PhanTramMienGiam/LayDanhSach                   thẻ 1 (dDaChuyenKeToan 0)
       TC_Import_PhanTramMienGiam/LayDSThongTinImport_DT_MG     ô "Mã đợt import"
       CM_DanhMucDuLieu/LayDanhSach  (KHDT.DIEM.KIEUHOC)         ô "Kiểu học"
       SYS_Import/getDataFormFileImport                          máy chủ đọc tệp Excel
       TC_Import_PhanTramMienGiam/Import                         thực hiện import
       TC_Import_PhanTramMienGiam/Xoa                            POST, từng dòng
       TC_Import_PhanTramMienGiam/ChuyenDuLieu_DoiTuong_MG_Imp   POST, từng dòng

   Tên cột giữ đúng bản gốc: thẻ 1 đọc PHANTRAMMIENGIAM, bảng kết quả import
   (thẻ 3) đọc PHANTRAMMIEN.

   Cố ý bỏ (như import_sotienmiengiam):
     · Thẻ 5 — nút tìm sai id "#btnSearchDaImport_DaHachToan" nên không bao
       giờ nạp, hàm nạp gửi dDaChuyenKeToan = 0 (trùng thẻ 1); nút "Lưu" gọi
       nhầm chuyển kế toán, Sua_MG_Import_DaChuyenKT không được gọi.
     · Nút "Tải file lỗi" — gọi me.report_Data không tồn tại (lỗi JS).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;

    function hoTen(r) { return ui.esc((r.HODEM == null ? '' : r.HODEM) + ' ' + (r.TEN == null ? '' : r.TEN)); }
    function so(col) { return function (r) { return ui.money(r[col] == null ? 0 : r[col]) || '0'; }; }

    function cols(col) {
        return [
            { title: 'Mã số', prop: 'MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Phần trăm miễn', render: so(col), cls: 'is-center is-nowrap' },
            { title: 'Đối tượng', prop: 'QLSV_DOITUONG_TEN' },
            { title: 'Nội dung', prop: 'NOIDUNG' }
        ];
    }

    ums.tcTraCuu.importScreen(document.getElementById('import_phantrammiengiam'), {
        title: 'Import phần trăm miễn giảm',
        bang: null,
        kieuHoc: true,
        ngayLabel: 'Ngày giao dịch',
        resetBeforeImport: true,
        tip: function (r) { return (r.MASO || '') + ': ' + (r.PHANTRAMMIENGIAM == null ? '' : r.PHANTRAMMIENGIAM); },
        cols1: cols('PHANTRAMMIENGIAM'),
        cols3: cols('PHANTRAMMIEN'),

        calls: {
            list: function (v) {
                return {
                    action: 'TC_Import_PhanTramMienGiam/LayDanhSach',
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
                return { action: 'TC_Import_PhanTramMienGiam/LayDSThongTinImport_DT_MG', versionAPI: 'v1.0', dChuaChuyenKeToan: 0 };
            },
            import: function (v) {
                return {
                    action: 'TC_Import_PhanTramMienGiam/Import',
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
                    strKieuHoc_Id: v.kieuHoc,
                    strMaImport: v.mau,
                    iChiSoImport: v.chiSo
                };
            },
            xoa: function (id) {
                return { action: 'TC_Import_PhanTramMienGiam/Xoa', versionAPI: 'v1.0', strIds: id, strNguoiThucHien_Id: '' };
            },
            chuyen: function (id) {
                return {
                    action: 'TC_Import_PhanTramMienGiam/ChuyenDuLieu_DoiTuong_MG_Imp',
                    versionAPI: 'v1.0',
                    strNguonDuLieu_Id: id,
                    strNguoiThucHien_Id: ''
                };
            }
        }
    });
})();
