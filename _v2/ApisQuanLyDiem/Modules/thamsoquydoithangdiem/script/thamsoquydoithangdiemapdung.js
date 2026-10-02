/* =========================================================================
   Quy đổi thang điểm áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/thamsoquydoithangdiem/html/thamsoquydoithangdiemapdung.html
            + script/thamsoquydoithangdiemapdung.js (lớp ThamSoQuyDoiDiemApDung, vỏ indexi)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Ba tab:
     1) chung cho chương trình       phạm vi = ID chương trình — Kế thừa · Thêm dòng · Lưu
     2) từng học phần                phạm vi = ID học phần NỐI ID chương trình — nút "Kế thừa"
                                     (hộp Kế thừa CTĐT, Q.hopKeThuaCTDT)
     3) từng người học               Q.cap.nguoiHocLop: Thời gian → Lớp học phần ở đầu khung bảng;
                                     phạm vi = ID người học NỐI ID lớp học phần (không có chương trình).
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_QuyDoiThangDiem_ApDung/LayDanhSach GET strTuKhoa '', strThangDiemGoc_Id '', strThangDiemQuyDoi_Id '',
                                              strDiemChu_DiemQuyDoi_Id '', strDaoTao_ThoiGianDaoTao_Id '',
                                              strPhanCapApDung_Id '', strPhamViApDung_Id, pageSize 10000000
     D_QuyDoiThangDiem_ApDung/ThemMoi    POST strId, strPhanCapApDung_Id '', strDiem_QuyDoiThangDiem_Id, strPhamViApDung_Id,
                                              strThangDiemGoc_Id '', strThangDiemQuyDoi_Id '', dDiemCanDuoi_DiemGoc,
                                              dDiemCanTren_DiemGoc, dDiemSo_DiemQuyDoi, strDiemChu_DiemQuyDoi_Id,
                                              iThuTu '', strDaoTao_ThoiGianDaoTao_Id, strNgayApDung (ba tab)
     D_QuyDoiThangDiem_ApDung/Xoa        POST strIds
     D_QuyDoiThangDiem_ApDung/KeThua     POST strDaoTao_ChuongTrinh_Id (gốc hỏi "Bạn có chắc chắn kế thừa")
     D_QuyDoiThangDiem/LayDanhSach       GET  (ô "Tham số quy đổi điểm", DIEM_QUYDOITHANGDIEM_TEN)
     danh mục DIEM.DIEMCHU               (ô "Điểm chữ", TEN)
     Kế thừa CTĐT: PKG_DIEM_THONGTIN2.LayDSKeThuaCungCTDT → PKG_DIEM_THONGTIN2.KeThuaDiem_QuyDoiThangDiem_AD
                   (D_ThongTin2_MH/CiQVKTQgBSgkLB4QNDgFLigVKSAvJgUoJCweAAUP) — xem _apdung.js.
   Cột đọc: DIEM_QUYDOITHANGDIEM_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, DIEMCANDUOI_THANGDIEMGOC,
            DIEMCANTREN_THANGDIEMGOC, DIEMSO_THANGDIEMQUYDOI, DIEMCHU_THANGDIEMQUYDOI_ID, LADULIEUKHOITAO.
   Không tab nào kiểm dòng trống khi Lưu (như gốc).
   Chữ hiện: chương trình "TÊN - MÃ" (mã có mới ghi), học phần "TÊN - MÃ", người học "HỌ TÊN - MÃ SỐ" (như gốc).
   Tiêu đề khung trái gốc "Chọn thời gian đào tạo" (chép nhầm) → "Chọn chương trình" (xem _apdung.js).
   Cố ý bỏ: loadToCombo_DanhMucDuLieu("DIEM.THANGDIEM") vào hai ô không tồn tại; getDeTail_…; hai hộp
   myModal_TSQDDAP (không nút nào mở).
   Lỗi gốc đã sửa:
     · Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
     · Tab người học: Lưu đọc giá trị từ id ô của TAB HỌC PHẦN (dropHP_… / txt…_HP) trong khi dòng tab
       người học mang id dropChuongTrinh_… → mọi dòng gửi đi RỖNG hết (tham số, học kỳ, mức điểm…).
       Nay gửi đúng giá trị trên dòng.
     · Tab người học: chưa có lớp học phần thì gốc vẫn nạp / lưu với phạm vi = chỉ ID người học.
       Nay khung về lời nhắc (luật cha → con) — xem Q.cap.nguoiHocLop.
     · Hộp Kế thừa: bấm "Kế thừa" khi chưa đánh dấu dòng nào vẫn đóng hộp. Nay giữ hộp + nhắc.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-thamsoquydoithangdiemapdung');
    if (!root) return;
    var Q = ums.qldAD, ui = ums.ui;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function kemMa(ten, ma) { return e(ten) + (e(ma) ? ' - ' + e(ma) : ''); }

    var trai = Q.trai.chuongTrinh({ sub: 'Khóa đào tạo' });
    trai.item = function (r) {
        return { text: 'Chương trình: ' + kemMa(r.TENCHUONGTRINH, r.MACHUONGTRINH), sub: 'Khóa đào tạo: ' + e(r.DAOTAO_KHOADAOTAO_TEN) };
    };
    trai.ten = function (r) { return kemMa(r.TENCHUONGTRINH, r.MACHUONGTRINH); };

    Q.man(root, {
        tieuDe: 'Quy đổi thang điểm áp dụng',
        api: 'D_QuyDoiThangDiem_ApDung',
        trai: trai,
        cot: [
            { key: 'strDiem_QuyDoiThangDiem_Id', col: 'DIEM_QUYDOITHANGDIEM_ID', title: 'Tham số quy đổi điểm',
              type: 'select', ph: 'Chọn tham số', width: '220px',
              source: { name: 'DIEM_QUYDOITHANGDIEM_TEN', call: {
                  action: 'D_QuyDoiThangDiem/LayDanhSach', strTuKhoa: '', strThangDiemGoc_Id: '', strThangDiemQuyDoi_Id: '',
                  strDiemChu_DiemQuyDoi_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } } },
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            { key: 'dDiemCanDuoi_DiemGoc', col: 'DIEMCANDUOI_THANGDIEMGOC', title: 'Mức điểm bắt đầu', width: '110px' },
            { key: 'dDiemCanTren_DiemGoc', col: 'DIEMCANTREN_THANGDIEMGOC', title: 'Mức điểm kết thúc', width: '110px' },
            { key: 'dDiemSo_DiemQuyDoi', col: 'DIEMSO_THANGDIEMQUYDOI', title: 'Điểm số', width: '100px' },
            { key: 'strDiemChu_DiemQuyDoi_Id', col: 'DIEMCHU_THANGDIEMQUYDOI_ID', title: 'Điểm chữ', type: 'select',
              ph: 'Chọn điểm chữ', width: '130px', source: { dm: 'DIEM.DIEMCHU' } }
        ],
        loc: { strThangDiemGoc_Id: '', strThangDiemQuyDoi_Id: '', strDiemChu_DiemQuyDoi_Id: '',
               strDaoTao_ThoiGianDaoTao_Id: '', strPhanCapApDung_Id: '' },
        luu: { strPhanCapApDung_Id: '', strThangDiemGoc_Id: '', strThangDiemQuyDoi_Id: '', iThuTu: '' },
        keThua: { hoi: 'Bạn có chắc chắn kế thừa' },
        caps: [
            { key: 'ct', tab: '1) Tham số quy đổi điểm áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Tham số quy đổi điểm áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan({ ten: function (r) { return kemMa(r.DAOTAO_HOCPHAN_TEN, r.DAOTAO_HOCPHAN_MA); } }),
              tools: function () {
                  return ui.btn('add', { text: 'Kế thừa', mod: 'out-warn', icon: 'fa-object-ungroup', attr: { 'data-qad-tool': 'keThuaCTDT' } });
              },
              onTool: function (ten, c) {
                  if (ten === 'keThuaCTDT') Q.hopKeThuaCTDT(c, { capKey: 'hp',
                      action: 'D_ThongTin2_MH/CiQVKTQgBSgkLB4QNDgFLigVKSAvJgUoJCweAAUP', func: 'PKG_DIEM_THONGTIN2.KeThuaDiem_QuyDoiThangDiem_AD' });
              } },
            Q.cap.nguoiHocLop({ key: 'nh', tab: '3) Tham số quy đổi điểm áp dụng đến từng người học của chương trình',
                ten: function (r) {
                    return kemMa((e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim(), r.QLSV_NGUOIHOC_MASO);
                } })
        ]
    });
})();
