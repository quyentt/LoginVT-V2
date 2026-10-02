/* =========================================================================
   Tham số làm tròn áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/thamsolamtron/html/thamsolamtronapdung.html
            + script/thamsolamtronapdung.js (lớp ThamSoLamTronApDung, vỏ indexi)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_ThamSoLamTron_ApDung/LayDanhSach GET  strTuKhoa '', strDiem_ThamSoLamTron_Id '',
                                             strLoaiDiemTrungBinh_Id '', strDaoTao_ThoiGianDaoTao_Id '',
                                             strPhamViApDung_Id, pageSize 10000000
     D_ThamSoLamTron_ApDung/ThemMoi     POST strId, strPhanCapApDung_Id '', strLoaiDiemTrungBinh_Id,
                                             strPhamViApDung_Id, dSoLeSauDauPhay, dCoLamTron, strMoTa '',
                                             strDiem_ThamSoLamTron_Id '', strDaoTao_ThoiGianDaoTao_Id, strNgayApDung
     D_ThamSoLamTron_ApDung/CapNhat     POST (cùng tham số) — CHỈ tab học phần, dòng đã có id (như gốc;
                                             tab chương trình gốc chú thích bỏ CapNhat → luôn ThemMoi)
     D_ThamSoLamTron_ApDung/Xoa         POST strIds
     D_ThamSoLamTron_ApDung/KeThua      POST strDaoTao_ChuongTrinh_Id
     danh mục DIEM.LOAIDIEMTRUNGBINH    (ô "Loại điểm trung bình", TEN)
   Cột đọc: LOAIDIEMTRUNGBINH_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, COLAMTRON,
            SOLESAUDAUPHAY, LADULIEUKHOITAO.
   "Có làm tròn": ô Không (0) / Có (1), không có dòng trống — như gốc.
   Tab học phần bỏ qua dòng chưa chọn Loại điểm trung bình (như gốc).
   Lỗi gốc đã sửa: Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
   Nghi ngờ, GIỮ: tab chương trình luôn ThemMoi kể cả dòng cũ (có strId), tab học
   phần thì CapNhat — hai tab của cùng màn xử lý khác nhau.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-thamsolamtronapdung');
    if (!root) return;
    var Q = ums.qldAD;

    Q.man(root, {
        tieuDe: 'Tham số làm tròn áp dụng',
        api: 'D_ThamSoLamTron_ApDung',
        cot: [
            { key: 'strLoaiDiemTrungBinh_Id', col: 'LOAIDIEMTRUNGBINH_ID', title: 'Loại điểm trung bình',
              type: 'select', ph: 'Chọn loại điểm trung bình', width: '220px', source: { dm: 'DIEM.LOAIDIEMTRUNGBINH' } },
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            Q.cot.coKhong('dCoLamTron', 'COLAMTRON', 'Có làm tròn'),
            { key: 'dSoLeSauDauPhay', col: 'SOLESAUDAUPHAY', title: 'Số lẻ sau dấu phẩy' }
        ],
        loc: { strDiem_ThamSoLamTron_Id: '', strLoaiDiemTrungBinh_Id: '', strDaoTao_ThoiGianDaoTao_Id: '' },
        luu: { strPhanCapApDung_Id: '', strMoTa: '', strDiem_ThamSoLamTron_Id: '' },
        caps: [
            { key: 'ct', tab: '1) Tham số làm tròn áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Tham số làm tròn áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan(), batBuoc: 'strLoaiDiemTrungBinh_Id', capNhat: true }
        ]
    });
})();
