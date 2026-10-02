/* =========================================================================
   Tham số chung áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/thamsochung/html/thamsochungapdung.html
            + script/thamsochungapdung.js (lớp ThamSoChungApDung, vỏ indexi)
   Khung chung: ./_apdung.js (ums.qldAD) — bố cục, lời gọi dùng chung, lỗi gốc
   chung đã sửa ghi ở đầu tệp đó.
   ---------------------------------------------------------------------------
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_ThamSoHocTapChung_ApDung/LayDanhSach GET  strTuKhoa '', strDiem_ThamSoHocTapChung_Id '',
                                                 strDaoTao_ThoiGianDaoTao_Id '', strPhanCapApDung_Id '',
                                                 strPhamViApDung_Id, pageSize 10000000
     D_ThamSoHocTapChung_ApDung/ThemMoi     POST strId, strPhanCapApDung_Id '', strDiem_ThamSoHocTapChung_Id,
                                                 strPhamViApDung_Id, dSoLanHocToiDa, dSoLanThiLaiToiDa,
                                                 strDaoTao_ThoiGianDaoTao_Id, strNgayApDung
                                                 (cả hai tab — gốc chú thích bỏ nhánh CapNhat)
     D_ThamSoHocTapChung_ApDung/Xoa         POST strIds
     D_ThamSoHocTapChung_ApDung/KeThua      POST strDaoTao_ChuongTrinh_Id
     D_ThamSoHocTapChung/LayDanhSach        GET  (ô "Tham số học tập", DIEM_THAMSOHOCTAPCHUNG_TEN)
   Cột đọc: DIEM_THAMSOHOCTAPCHUNG_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG,
            SOLANHOCTOIDA, SOLANTHILAITOIDA, LADULIEUKHOITAO.
   Tab học phần: dòng chưa chọn "Tham số học tập" bị bỏ qua khi Lưu (như gốc);
   tab chương trình gửi cả dòng trống (như gốc — gốc chú thích bỏ kiểm tra).
   Cố ý bỏ: ô dropSearch_LoaiXetNangLuong (không có trên màn, gọi hàm không tồn
   tại), getDeTail_… / viewForm_… (không nơi nào gọi), reset/rewrite (đặt ô
   không tồn tại).
   Lỗi gốc đã sửa: Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-thamsochungapdung');
    if (!root) return;
    var Q = ums.qldAD;

    Q.man(root, {
        tieuDe: 'Tham số chung áp dụng',
        api: 'D_ThamSoHocTapChung_ApDung',
        cot: [
            { key: 'strDiem_ThamSoHocTapChung_Id', col: 'DIEM_THAMSOHOCTAPCHUNG_ID', title: 'Tham số học tập',
              type: 'select', ph: 'Chọn tham số', width: '220px',
              source: { name: 'DIEM_THAMSOHOCTAPCHUNG_TEN', call: {
                  action: 'D_ThamSoHocTapChung/LayDanhSach', strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: '',
                  strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } } },
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            { key: 'dSoLanHocToiDa', col: 'SOLANHOCTOIDA', title: 'Số lần học tối đa' },
            { key: 'dSoLanThiLaiToiDa', col: 'SOLANTHILAITOIDA', title: 'Số lần thi tối đa' }
        ],
        loc: { strDiem_ThamSoHocTapChung_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strPhanCapApDung_Id: '' },
        luu: { strPhanCapApDung_Id: '' },
        caps: [
            { key: 'ct', tab: '1) Tham số áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Tham số học tập áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan(), batBuoc: 'strDiem_ThamSoHocTapChung_Id' }
        ]
    });
})();
