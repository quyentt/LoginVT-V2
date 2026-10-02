/* =========================================================================
   Công thức điểm áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/congthucdiem/html/congthucdiemapdung.html
            + script/congthucdiemapdung.js (lớp CongThucDiemApDung, vỏ indexi)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Ba tab:
     1) chung cho chương trình       phạm vi = ID chương trình — Kế thừa · Thêm dòng · Lưu
     2) từng học phần                phạm vi = ID học phần NỐI ID chương trình. Danh sách học phần có ô
                                     đánh dấu từng mục + ô "chọn tất cả"; nút "Kế thừa" chép công thức
                                     của học phần ĐANG CHỌN sang các học phần ĐÃ ĐÁNH DẤU.
     3) từng người học               Q.cap.nguoiHocLop: Thời gian → Lớp học phần ở đầu khung bảng;
                                     phạm vi = ID người học NỐI ID lớp học phần.
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_CongThucDiem_ApDung/LayDanhSach GET strTuKhoa '', strDiem_ThanhPhanDiem_Id '', strDaoTao_ThoiGianDaoTao_Id '',
                                           strDiem_CongThucDiem_Id '', strPhanCapApDung_Id '', strPhamViApDung_Id,
                                           pageSize 10000000
     D_CongThucDiem_ApDung/ThemMoi    POST strId, strPhanCapApDung_Id '', strPhamViApDung_Id, strDiem_CongThucDiem_Id,
                                           strXauCongThuc '', strMa '', strTen '', strDaoTao_ThoiGianDaoTao_Id,
                                           dSoThanhPhanToiThieu, dTongHopKhiDuDiem, strNgayApDung '' (ô ngày không có
                                           trên màn gốc — gửi rỗng), iThuTu '' — riêng tab học phần gửi dThuTu ''
                                           thay iThuTu (chép nguyên)
     D_CongThucDiem_ApDung/Xoa        POST strIds
     D_CongThucDiem_ApDung/KeThua     POST strDaoTao_ChuongTrinh_Id (gốc hỏi "Bạn có chắc chắn kế thừa")
     D_ThongTin/KeThua_CongThucDiem_HP_CT_AD POST strDaoTao_HocPhan_Id (học phần đánh dấu),
                                           strDaoTao_HocPhan_KeThua_Id (học phần đang chọn), strDaoTao_ChuongTrinh_Id
     D_CongThucDiem/LayDanhSach       GET  (ô "Xâu công thức", XAUCONGTHUC)
   Cột đọc: DIEM_CONGTHUCDIEM_ID, DAOTAO_THOIGIANDAOTAO_ID, DIEM_THANHPHANDIEM_TEN (chỉ xem),
            MOHINHXULY_TEN (chỉ xem), TONGHOPKHIDUDIEMTHANHPHAN, SOTHANHPHANDIEMTOITHIEU, LADULIEUKHOITAO.
   "Mô hình tổng hợp": 1 = Chỉ tổng hợp khi đủ điểm thành phần quy định, 0 = Tổng hợp khi có điểm bất kỳ,
   không có dòng trống (dòng mới mặc định 1) — như gốc.
   Tab học phần bỏ qua dòng chưa chọn Xâu công thức (như gốc); tab 1 và 3 gửi cả dòng trống.
   Chữ hiện: chương trình "TÊN - MÃ", đầu khung "Chương trình TÊN" (như gốc); học phần trong danh sách
   ghi TÊN, đầu khung bảng ghi "TÊN - MÃ"; người học "MÃ SỐ - HỌ ĐỆM TÊN".
   Tiêu đề khung trái gốc "Chọn thời gian đào tạo" (chép nhầm) → "Chọn chương trình" (xem _apdung.js).
   Cố ý bỏ: danh mục DIEM.MOHINHCONGTHUC và D_ThanhPhanDiem/LayDanhSach (nạp nhưng không ô nào dùng),
   getDeTail_…, hai hộp myModal_TSHTAP / myModal_TSAPHP (không nút nào mở); getList_ThamSoDanhGia_NguoiHoc
   gốc khai obj_list HAI lần (D_QuyDoiThangDiem_ApDung rồi D_CongThucDiem_ApDung) — bản sau thắng, giữ bản sau.
   Lỗi gốc đã sửa:
     · Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
     · Kế thừa học phần: N lời gọi song song, mỗi lời gọi một thông báo → ums.ui.batch; hỏi lại liệt kê tên
       học phần cách nhau ", " (gốc toString(', ') bỏ qua tham số → dính liền dấu phẩy).
     · Dấu đánh dấu học phần mất khi lọc từ khoá / bấm mục khác (cây vẽ lại) → nay giữ (xem _apdung.js).
     · Tab người học: chưa có lớp học phần thì gốc vẫn nạp / lưu với phạm vi = chỉ ID người học.
       Nay khung về lời nhắc (luật cha → con) — xem Q.cap.nguoiHocLop.
   Nghi ngờ, GIỮ: kế thừa cho phép đánh dấu cả chính học phần đang chọn (gốc không chặn).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-congthucdiemapdung');
    if (!root) return;
    var Q = ums.qldAD, ui = ums.ui;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    var trai = Q.trai.chuongTrinh({ sub: 'Khóa đào tạo' });
    trai.item = function (r) {
        return { text: 'Chương trình: ' + e(r.TENCHUONGTRINH) + ' - ' + e(r.MACHUONGTRINH), sub: 'Khóa đào tạo: ' + e(r.DAOTAO_KHOADAOTAO_TEN) };
    };

    /* Kế thừa công thức của học phần đang chọn sang các học phần đã đánh dấu (btnKeThua_CongThucDiemApDungHPCT) */
    function keThuaHP(ctx) {
        var nguon = ctx.con.hp;
        if (!nguon || !ctx.trai) return;
        var chon = ctx.conChon('hp');
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var ten = chon.map(function (r) { return e(r.DAOTAO_HOCPHAN_TEN); }).join(', ');
        ui.confirm('Bạn có kế thừa từ ' + e(nguon.DAOTAO_HOCPHAN_TEN) + ' sang ' + ten + ' không?', { title: 'Kế thừa', ok: 'Kế thừa' }).then(function (yes) {
            if (!yes) return;
            return ui.batch(chon.map(function (r) {
                return {
                    action: 'D_ThongTin/KeThua_CongThucDiem_HP_CT_AD', strNguoiThucHien_Id: '',
                    strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strDaoTao_HocPhan_KeThua_Id: nguon.DAOTAO_HOCPHAN_ID,
                    strDaoTao_ChuongTrinh_Id: ctx.trai.ID
                };
            }), { title: 'Đang kế thừa', okText: 'Thêm mới thành công' });
        });
    }

    Q.man(root, {
        tieuDe: 'Công thức điểm áp dụng',
        api: 'D_CongThucDiem_ApDung',
        trai: trai,
        cot: [
            { key: 'strDiem_CongThucDiem_Id', col: 'DIEM_CONGTHUCDIEM_ID', title: 'Xâu công thức',
              type: 'select', ph: 'Chọn xâu công thức', width: '220px',
              source: { name: 'XAUCONGTHUC', call: {
                  action: 'D_CongThucDiem/LayDanhSach', method: 'GET', strTuKhoa: '', strDiem_ThanhPhanDiem_Id: '', strMoHinhXuLy_Id: '',
                  strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } } },
            Q.cot.thoiGian({ title: 'Thời gian bắt đầu áp dụng', group: null }),
            { col: 'DIEM_THANHPHANDIEM_TEN', title: 'Thành phần điểm', type: 'static' },
            { col: 'MOHINHXULY_TEN', title: 'Mô hình xử lý', type: 'static' },
            { key: 'dTongHopKhiDuDiem', col: 'TONGHOPKHIDUDIEMTHANHPHAN', title: 'Mô hình tổng hợp', type: 'select', trong: false, width: '280px',
              source: { items: [{ ID: '1', TEN: 'Chỉ tổng hợp khi đủ điểm thành phần quy định' }, { ID: '0', TEN: 'Tổng hợp khi có điểm bất kỳ' }] } },
            { key: 'dSoThanhPhanToiThieu', col: 'SOTHANHPHANDIEMTOITHIEU', title: 'Số thành phần tối thiểu', width: '110px' }
        ],
        loc: { strDiem_ThanhPhanDiem_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strDiem_CongThucDiem_Id: '', strPhanCapApDung_Id: '' },
        luu: { strPhanCapApDung_Id: '', strXauCongThuc: '', strMa: '', strTen: '', iThuTu: '', strNgayApDung: '' },
        keThua: { hoi: 'Bạn có chắc chắn kế thừa' },
        thamSo: function (kind, o, cap) {
            if (kind === 'luu' && cap.key === 'hp') { delete o.iThuTu; o.dThuTu = ''; }   // gốc save_CongThucDiemApDung_HocPhan
            return o;
        },
        caps: [
            { key: 'ct', tab: '1) Tham số áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Tham số công thức áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan({ chon: true, chonTatCa: true,
                  nhan: function (r) { return e(r.DAOTAO_HOCPHAN_TEN) + ' - ' + e(r.DAOTAO_HOCPHAN_MA); } }),
              batBuoc: 'strDiem_CongThucDiem_Id',
              tools: function () {
                  return ui.btn('add', { text: 'Kế thừa', mod: 'out-warn', icon: 'fa-object-ungroup', attr: { 'data-qad-tool': 'keThuaHP' } });
              },
              onTool: function (ten, c) { if (ten === 'keThuaHP') keThuaHP(c); } },
            Q.cap.nguoiHocLop({ key: 'nh', tab: '3) Tham số công thức áp dụng đến từng người học của chương trình' })
        ]
    });
})();
