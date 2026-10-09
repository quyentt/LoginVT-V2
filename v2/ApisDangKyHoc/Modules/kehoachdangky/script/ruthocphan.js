/* =========================================================================
   Rút học phần
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/ruthocphan.html + script/ruthocphan.js
   Khung chung với Áp phí học phần: _hp.js (ums.dkhHp.man) — đọc chú thích ở đó.
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ DKH_RutHocPhan/*, không func, chép nguyên tham số):
     LayDSThoiGianRut   ô Đợt đăng ký (ID / THOIGIAN)                      GET
     LayDSRut           khung "Học phần đã rút" (strTuKhoa, Đợt, Hệ)        GET
     LayDSDangKy        khung "Kết quả đã đăng ký" (cùng tham số)           GET
     CapNhatPhanTramTinhPhi  Lưu ô "% Mức phí" đã đổi (strMoTa = '' — gốc đọc txtAAAA)
     HuyRut             Khôi phục các dòng đã đánh dấu
     ThucHienRut        hộp "Rút học phần" → Xác nhận (dPhanTramTinhPhi, strMoTa theo từng dòng)
     Hệ đào tạo: edu.system.getList_HeDaoTao → ums.ref.heDaoTao (bản KHÔNG lọc quyền, như gốc).
     Import: hai mục viết tay của html gốc (btnImportWithProce → Corei showImportChungV2)
       IMPORTWITHPROC_RHP "Rút học phần" · IMPORTWITHPROC_HRHP " Hủy Rút" → ums.report.importChung.
   Khác gốc: xem _hp.js. Bỏ: getList_… "viewForm_RutHocPhan" (gắn trên .btnEdit không tồn tại — mã chết).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dkh-ruthocphan');
    if (!root) return;
    var H = ums.dkhHp;

    H.man(root, {
        tieuDe: 'Rút học phần',
        ctl: 'DKH_RutHocPhan/',
        goi: { dot: 'LayDSThoiGianRut', ds: 'LayDSRut', dk: 'LayDSDangKy', luu: 'CapNhatPhanTramTinhPhi', huy: 'HuyRut', thucHien: 'ThucHienRut' },
        keHoach: true,
        khung1: {
            title: 'Học phần đã rút', icon: 'fa-book-open-reader',
            nutHuy: { text: 'Khôi phục', kieu: 'khoiphuc' }, nutLuu: 'Lưu',
            cot: H.cotSV().concat([
                H.cotHP('Học phần rút'),
                { title: 'Lớp học phần rút', prop: 'DSLOPHOCPHAN' },
                H.cotPT(),
                H.cotTien('Số tiền phải nộp sau khi rút'),
                { title: 'Ngày rút', prop: 'NGAYRUT_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-nowrap' },
                { title: 'Số tín chỉ học tập', prop: 'SOTINCHI_HOCTAP', cls: 'is-center' },
                { title: 'Số tín chỉ tính phí', prop: 'SOTINCHI_TINHPHI', cls: 'is-center' },
                { title: 'Cán bộ thực hiện', prop: 'NGUOIRUT_TAIKHOAN', cls: 'is-nowrap' },
                { title: 'Ghi chú', prop: 'GHICHU' }
            ])
        },
        khung2: {
            title: 'Kết quả đã đăng ký', icon: 'fa-address-book', nut: 'Thực hiện rút', nutIcon: 'fa-money-simple-from-bracket',
            cot: H.cotSV().concat([
                H.cotHP('Học phần'),
                { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' },
                { title: 'Đã nhập điểm', prop: 'DANHAPDIEM', cls: 'is-center' },
                { title: 'Đã điểm danh', prop: 'DADIEMDANH', cls: 'is-center' },
                { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-nowrap' },
                { title: 'Số tín chỉ học tập', prop: 'SOTINCHI_HOCTAP', cls: 'is-center' },
                { title: 'Số tín chỉ tính phí', prop: 'SOTINCHI_TINHPHI', cls: 'is-center' }
            ])
        },
        hop: 'Rút học phần',
        xong: { luu: 'Cập nhật thành công', huy: 'Xóa dữ liệu thành công!', thucHien: 'Thực hiện thành công' },
        import: [
            { ma: 'IMPORTWITHPROC_RHP', ten: 'Rút học phần', chu: '1. Import Rút học phần' },
            { ma: 'IMPORTWITHPROC_HRHP', ten: ' Hủy Rút', chu: '2. Import Hủy Rút học phần' }
        ]
    });
})();
