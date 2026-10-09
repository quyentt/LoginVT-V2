/* =========================================================================
   Tham số tính điểm áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/thamsotinhdiem/html/thamsotinhdiemapdung.html
            + script/thamsotinhdiemapdung.js (lớp ThamSoTinhDiemApDung, vỏ indexi)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Khác anh em: cột trái là KHOÁ ĐÀO TẠO (KHCT_KhoaDaoTao/LayDanhSach, lọc Hệ + từ khoá,
   pageSize 1000000 — không phân trang), tab 2 là danh sách CHƯƠNG TRÌNH của khoá
   (KHCT_ToChucChuongTrinh/LayDanhSach strDaoTao_KhoaDaoTao_Id = ID khoá).
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_ThamSoTongHop_ApDung/LayDanhSach GET  strTuKhoa '', strDiem_ThamSoTongHop_Id '', strQuyCheApDung_Id '',
                                             strDaoTao_ThoiGianDaoTao_Id '', strPhamViApDung_Id, pageSize 10000000
                                             (tab 1: ID khoá; tab 2: ID chương trình NỐI ID khoá)
     D_ThamSoTongHop_ApDung/ThemMoi     POST strId, strPhanCapApDung_Id '', strDiem_ThamSoTongHop_id '' (chữ "id"
                                             thường — chép nguyên), strPhamViApDung_Id, strQuyCheApDung_Id,
                                             strQuyTacLayDiemCaoNhat_Id, strQuyTacLayDuLieuCT_Id,
                                             strQuyTacXacDinhDiem_Id, strQuyTacVeDieuKienDiem_Id,
                                             strQuyTacLayDiemLan1_Id, strMoTa '', strDaoTao_ThoiGianDaoTao_Id,
                                             strNgayApDung (cả hai tab)
     D_ThamSoTongHop_ApDung/Xoa         POST strIds
     D_ThamSoTongHop_ApDung/KeThua      POST strDaoTao_KhoaDaoTao_Id (= ID khoá; KHÔNG phải strDaoTao_ChuongTrinh_Id
                                             như các màn anh em) — gốc KHÔNG hỏi lại; khung luôn hỏi.
     Danh mục (TEN): DIEM.QUYCHEDIEM, DIEM.QUYTACLAYDIEMCAONHAT, DIEM.QUYTACLAYDIEMLAN1,
                     DIEM.QUYTACLAYDULIEU, DIEM.QUYTACXACDINHDIEM, DIEM.QUYTACDIEUKIENVEDIEM
   Cột đọc: QUYCHEAPDUNG_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, QUYTACLAYDIEMCAONHAT_ID,
            QUYTACLAYDIEMLAN1_ID, QUYTACLAYDULIEUCT_ID, QUYTACXACDINHDIEM_ID, QUYTACVEDIEUKIENDIEM_ID,
            LADULIEUKHOITAO.
   Tab 1 gửi cả dòng trống (như gốc); tab 2 bỏ qua dòng chưa chọn Quy chế (như gốc).
   Tiêu đề cột: tab 1 gốc ghi "Quy tắc lấy điểm lần", tab 2 "Quy tắc lấy điểm lần 1" — cùng một
   cột (strQuyTacLayDiemLan1_Id) → dùng chung "Quy tắc lấy điểm lần 1".
   Cố ý bỏ: D_ThamSoTongHop/LayDanhSach (nạp vào dtThamSoTinhDiem nhưng không ô nào dùng),
   getDeTail_… (không nơi nào gọi), lời gọi danh sách chương trình lúc mở màn với khoá rỗng.
   Lỗi gốc đã sửa:
     · Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
     · Mỗi lần chọn khoá gắn thêm một trình xử lý "select_node" cho cây chương trình → bấm một
       chương trình gọi LayDanhSach N lần. Nay một lần.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-thamsotinhdiemapdung');
    if (!root) return;
    var Q = ums.qldAD;

    function dm(key, col, title, ma, ph) {
        return { key: key, col: col, title: title, type: 'select', ph: ph, width: '200px', source: { dm: ma } };
    }

    Q.man(root, {
        tieuDe: 'Tham số tính điểm áp dụng',
        api: 'D_ThamSoTongHop_ApDung',
        trai: Q.trai.khoa({ tieuDe: 'Chọn khóa học' }),
        dauDe: 'Khóa',
        cot: [
            dm('strQuyCheApDung_Id', 'QUYCHEAPDUNG_ID', 'Quy chế', 'DIEM.QUYCHEDIEM', 'Chọn quy chế'),
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            dm('strQuyTacLayDiemCaoNhat_Id', 'QUYTACLAYDIEMCAONHAT_ID', 'Quy tắc lấy điểm cao nhất', 'DIEM.QUYTACLAYDIEMCAONHAT', 'Chọn quy tắc lấy điểm cao nhất'),
            dm('strQuyTacLayDiemLan1_Id', 'QUYTACLAYDIEMLAN1_ID', 'Quy tắc lấy điểm lần 1', 'DIEM.QUYTACLAYDIEMLAN1', 'Chọn quy tắc lấy điểm lần'),
            dm('strQuyTacLayDuLieuCT_Id', 'QUYTACLAYDULIEUCT_ID', 'Quy tắc lấy dữ liệu', 'DIEM.QUYTACLAYDULIEU', 'Chọn quy tắc lấy dữ liệu'),
            dm('strQuyTacXacDinhDiem_Id', 'QUYTACXACDINHDIEM_ID', 'Quy tắc xác định', 'DIEM.QUYTACXACDINHDIEM', 'Chọn quy tắc xác định điểm'),
            dm('strQuyTacVeDieuKienDiem_Id', 'QUYTACVEDIEUKIENDIEM_ID', 'Quy tắc về điều kiện điểm', 'DIEM.QUYTACDIEUKIENVEDIEM', 'Chọn quy tắc về điều kiện điểm')
        ],
        loc: { strDiem_ThamSoTongHop_Id: '', strQuyCheApDung_Id: '', strDaoTao_ThoiGianDaoTao_Id: '' },
        luu: { strPhanCapApDung_Id: '', strDiem_ThamSoTongHop_id: '', strMoTa: '' },
        keThua: {
            text: 'Kế thừa cho tất cả chương trình trong hệ đào tạo',
            hoi: 'Bạn có chắc chắn kế thừa? Tham số tính điểm của khóa sẽ được áp cho tất cả chương trình.',
            xong: 'Kế thừa cho tất cả chương trình trong hệ đào tạo thành công',
            thamSo: function (ctx) { return { strDaoTao_KhoaDaoTao_Id: ctx.trai.ID, strNguoiThucHien_Id: '' }; }
        },
        caps: [
            { key: 'khoa', tab: '1) Tham số tính điểm áp dụng chung cho khóa', keThua: true },
            { key: 'ct', tab: '2) Tham số tính điểm áp dụng đến từng chương trình',
              con: Q.con.chuongTrinh({ tieuDe: 'Chọn chương trình - khóa học' }), batBuoc: 'strQuyCheApDung_Id' }
        ]
    });
})();
