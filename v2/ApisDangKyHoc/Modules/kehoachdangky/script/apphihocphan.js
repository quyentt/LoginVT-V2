/* =========================================================================
   Áp phí học phần
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/apphihocphan.html + script/apphihocphan.js
   Khung chung với Rút học phần: _hp.js (ums.dkhHp.man) — đọc chú thích ở đó.
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ DKH_ApPhiHocPhan/*, không func, chép nguyên tham số):
     LayDSThoiGianApPhi      ô Đợt đăng ký (ID / THOIGIAN)                   GET
     LayDSApPhi              khung "Học phần áp phí" (strTuKhoa, Đợt, Hệ)     GET
     LayDSDangKy             khung "Kết quả đã đăng ký" (cùng tham số)        GET
     CapNhatPhanTramTinhPhi  nút "Áp phí": lưu ô "% Mức phí" đã đổi (strMoTa = '' — gốc đọc txtAAAA)
     HuyApPhi                nút "Xóa" các dòng đã đánh dấu
     ThucHienApPhi           hộp → Xác nhận (dPhanTramTinhPhi, strMoTa theo từng dòng)
     KHÁC bản Rút: Huỷ / Thực hiện KHÔNG gửi strDangKy_KeHoachDangKy_Id (gốc không gửi — giữ).
     Hệ đào tạo: edu.system.getList_HeDaoTao → ums.ref.heDaoTao (bản KHÔNG lọc quyền, như gốc).
   Lỗi gốc đã sửa: dòng khoá theo DAOTAO_HOCPHAN_ID (hai sinh viên cùng học phần trùng id →
     Lưu / Xóa / Thực hiện chỉ trúng dòng đầu). Bản mới khoá theo dòng, tham số gửi y như gốc.
   Hộp "Thực hiện áp phí": gốc để trống tiêu đề (chỉ biểu tượng bút) → đặt "Áp phí học phần".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('dkh-apphihocphan');
    if (!root) return;
    var H = ums.dkhHp;

    H.man(root, {
        tieuDe: 'Áp phí học phần',
        ctl: 'DKH_ApPhiHocPhan/',
        goi: { dot: 'LayDSThoiGianApPhi', ds: 'LayDSApPhi', dk: 'LayDSDangKy', luu: 'CapNhatPhanTramTinhPhi', huy: 'HuyApPhi', thucHien: 'ThucHienApPhi' },
        keHoach: false,
        khung1: {
            title: 'Học phần áp phí', icon: 'fa-circle-dollar-to-slot',
            nutHuy: { text: 'Xóa', kieu: 'xoa' }, nutLuu: 'Áp phí',
            cot: H.cotSV().concat([
                H.cotHP('Học phần áp phí'),
                { title: 'Lớp học phần áp phí', prop: 'DSLOPHOCPHAN' },
                H.cotPT(),
                H.cotTien('Số tiền phải nộp sau khi áp phí'),
                { title: 'Ngày áp phí', prop: 'NGAYRUT_DD_MM_YYYY', cls: 'is-center is-nowrap' },
                { title: 'Cán bộ thực hiện', prop: 'NGUOIRUT_TAIKHOAN', cls: 'is-nowrap' }
            ])
        },
        khung2: {
            title: 'Kết quả đã đăng ký', icon: 'fa-address-book', nut: 'Thực hiện áp phí', nutIcon: 'fa-circle-dollar-to-slot',
            cot: H.cotSV().concat([
                H.cotHP('Học phần'),
                { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' },
                { title: 'Đã nhập điểm', prop: 'DANHAPDIEM', cls: 'is-center' },
                { title: 'Đã điểm danh', prop: 'DADIEMDANH', cls: 'is-center' }
            ])
        },
        hop: 'Áp phí học phần',
        xong: { luu: 'Cập nhật thành công', huy: 'Xóa dữ liệu thành công!', thucHien: 'Thêm mới thành công!' }
    });
})();
