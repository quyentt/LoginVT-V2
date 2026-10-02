/* =========================================================================
   Đánh giá kết quả áp dụng
   Bản gốc: ApisQuanLyDiem/Modules/thamsodanhgiaketqua/html/thamsodanhgiaketquaapdung.html
            + script/thamsodanhgiaketquaapdung.js (lớp ThamSoDanhGiaKetQuaApDung, vỏ indexi)
            (html/thamsodanhgiaketquaapdung.js là bản chép y hệt tệp script — không dùng)
   Khung chung: ../../thamsochung/script/_apdung.js (ums.qldAD).
   ---------------------------------------------------------------------------
   Ba tab (gốc có đủ ba):
     1) chung cho chương trình       phạm vi = ID chương trình — Kế thừa · Thêm dòng · Lưu
     2) từng học phần                phạm vi = ID học phần NỐI ID chương trình — nút "Kế thừa cho các
                                     chương trình cùng học HP này" (hộp Kế thừa CTĐT, Q.hopKeThuaCTDT)
     3) từng người học               danh sách SV_HoSoNhieuNganh/LayDanhSach; đầu khung bảng ô
                                     "Tất cả học phần" (học phần của chương trình, KHCT_HocPhan_ChuongTrinh);
                                     phạm vi = ID người học NỐI ID chương trình NỐI ID học phần đang chọn
                                     (trống = "Tất cả") — chép nguyên chuỗi ghép.
   Lời gọi riêng (kiểu cũ, không func — chép nguyên):
     D_ThamSoDanhGiaKetQua_ApDung/LayDanhSach GET strTuKhoa '', strDanhGia_Id '', strDaoTao_ThoiGianDaoTao_Id '',
                                                  strPhanCapApDung_Id '', strPhamViApDung_Id, pageSize 10000000
     D_ThamSoDanhGiaKetQua_ApDung/ThemMoi    POST strId, strPhanCapApDung_Id '', strDiem_ThamSoDanhGiaKQ_Id, strPhamViApDung_Id,
                                                  strXauDieuKien, strMoTa, dThuTuUuTien '', strDaoTao_ThoiGianDaoTao_Id,
                                                  strNgayApDung; tab 2 và 3 gửi THÊM strDiem_ThamSoDanhGia_Id (cùng giá trị)
     D_ThamSoDanhGiaKetQua_ApDung/Xoa        POST strIds
     D_ThamSoDanhGiaKetQua_ApDung/KeThua     POST strDaoTao_ChuongTrinh_Id (gốc hỏi "Bạn có chắc chắn kế thừa")
     D_ThamSoDanhGiaKetQua/LayDanhSach       GET  (ô "Tham số đánh giá", DANHGIA_TEN)
     Kế thừa CTĐT: PKG_DIEM_THONGTIN2.LayDSKeThuaCungCTDT → PKG_DIEM_THONGTIN2.KeThuaDiem_TSDanhGiaKetQua_AD
                   (D_ThongTin2_MH/CiQVKTQgBSgkLB4VEgUgLykGKCAKJDUQNCAeAAUP) — xem _apdung.js.
   Cột đọc: DIEM_THAMSODANHGIAKETQUA_ID, DAOTAO_THOIGIANDAOTAO_ID, NGAYAPDUNG, XAUDIEUKIEN, MOTA, LADULIEUKHOITAO.
   Tab 1 gửi cả dòng trống (như gốc); tab 2, 3 bỏ qua dòng chưa chọn Tham số đánh giá (như gốc).
   Mục học phần ở tab 2 ghi "MÃ - TÊN" (gốc mRender); người học "MÃ SỐ - HỌ ĐỆM TÊN".
   Tiêu đề khung trái gốc "Chọn thời gian đào tạo" (chép nhầm) → "Chọn chương trình" (xem _apdung.js).
   Cố ý bỏ: getDeTail_… (không nơi nào gọi); hai hộp myModal_TSDGAP* (không nút nào mở).
   Nghi ngờ, GIỮ: danh sách người học lọc theo ô Hệ đào tạo đang chọn ở cột trái (strHeDaoTao_Id);
   ô học phần tab 3 nạp bằng một lời gọi KHCT_HocPhan_ChuongTrinh riêng (gốc dùng chung kết quả với tab 2).
   Lỗi gốc đã sửa:
     · Lưu xong không nạp lại → Lưu lần hai thêm trùng (xem _apdung.js).
     · Mỗi lần chọn chương trình gắn thêm trình xử lý "select_node" cho hai cây → bấm một mục gọi
       LayDanhSach N lần. Nay một lần.
     · Hộp Kế thừa: bấm "Kế thừa" khi chưa đánh dấu dòng nào vẫn đóng hộp. Nay giữ hộp + nhắc.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('qld-thamsodanhgiaketquaapdung');
    if (!root) return;
    var Q = ums.qldAD, ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }

    /* Tab 3: ô "Tất cả học phần" ở đầu khung bảng */
    function oHP(luoi) { return luoi.el.querySelector('[data-qad-f="hp"]'); }

    var capNH = {
        key: 'nh', tab: '3) Tham số đánh giá áp dụng đến từng người học trong chương trình',
        con: Q.con.nguoiHoc(), batBuoc: 'strDiem_ThamSoDanhGiaKQ_Id',
        tools: function () {
            return '<div class="ums-field qad-loc"><select class="ums-select" data-qad-f="hp" data-ph="Tất cả học phần">' +
                '<option value="">Tất cả học phần</option></select></div>';
        },
        pv: function (c) {
            var r = c.con.nh;
            return r && c.trai ? e(r.QLSV_NGUOIHOC_ID) + e(c.trai.ID) + oHP(c.luoi.nh).value : '';
        },
        init: function (c, luoi) {
            // "Tất cả học phần" là lọc TUỲ CHỌN (trống vẫn hợp lệ) — không khoá, chỉ nạp lại bảng
            if (window.jQuery) window.jQuery(oHP(luoi)).on('select2:select select2:clear', function () {
                if (c.con.nh) luoi.nap(capNH.pv(c));
            });
        },
        onTrai: function (r, c, luoi) {
            var el = oHP(luoi);
            pat.fill(el, [], { head: 'Tất cả học phần' });
            el.value = '';
            ums.api.call(Object.assign({ method: 'GET', silent: true }, Q.con.hocPhan().tai(r))).then(function (x) {
                if (c.trai !== r) return;
                pat.fill(el, Array.isArray(x.data) ? x.data : [], { id: 'DAOTAO_HOCPHAN_ID', name: 'DAOTAO_HOCPHAN_TEN', head: 'Tất cả học phần' });
            }).catch(function (err) { ums.api.handle(err, 'nạp học phần'); });
        }
    };

    Q.man(root, {
        tieuDe: 'Đánh giá kết quả áp dụng',
        api: 'D_ThamSoDanhGiaKetQua_ApDung',
        cot: [
            { key: 'strDiem_ThamSoDanhGiaKQ_Id', col: 'DIEM_THAMSODANHGIAKETQUA_ID', title: 'Tham số đánh giá',
              type: 'select', ph: 'Chọn tham số đánh giá kết quả', width: '220px',
              source: { name: 'DANHGIA_TEN', call: {
                  action: 'D_ThamSoDanhGiaKetQua/LayDanhSach', strTuKhoa: '', strDanhGia_Id: '',
                  strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 } } },
            Q.cot.thoiGian(),
            Q.cot.ngay(),
            { key: 'strXauDieuKien', col: 'XAUDIEUKIEN', title: 'Xâu điều kiện', width: '200px' },
            { key: 'strMoTa', col: 'MOTA', title: 'Mô tả', width: '200px' }
        ],
        loc: { strDanhGia_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strPhanCapApDung_Id: '' },
        luu: { strPhanCapApDung_Id: '', dThuTuUuTien: '' },
        keThua: { hoi: 'Bạn có chắc chắn kế thừa' },
        thamSo: function (kind, o, cap) {
            // Tab học phần / người học gửi thêm strDiem_ThamSoDanhGia_Id cùng giá trị (gốc đọc cùng một ô hai lần)
            if (kind === 'luu' && cap.key !== 'ct') o.strDiem_ThamSoDanhGia_Id = o.strDiem_ThamSoDanhGiaKQ_Id;
            return o;
        },
        caps: [
            { key: 'ct', tab: '1) Tham số đánh giá áp dụng chung cho chương trình', keThua: true },
            { key: 'hp', tab: '2) Tham số đánh giá áp dụng đến từng học phần của chương trình',
              con: Q.con.hocPhan({ ten: function (r) { return e(r.DAOTAO_HOCPHAN_MA) + ' - ' + e(r.DAOTAO_HOCPHAN_TEN); } }),
              batBuoc: 'strDiem_ThamSoDanhGiaKQ_Id',
              tools: function () {
                  return ui.btn('add', { text: 'Kế thừa cho các chương trình cùng học HP này', mod: 'out-warn',
                      icon: 'fa-object-ungroup', attr: { 'data-qad-tool': 'keThuaCTDT' } });
              },
              onTool: function (ten, c) {
                  if (ten === 'keThuaCTDT') Q.hopKeThuaCTDT(c, { capKey: 'hp',
                      action: 'D_ThongTin2_MH/CiQVKTQgBSgkLB4VEgUgLykGKCAKJDUQNCAeAAUP', func: 'PKG_DIEM_THONGTIN2.KeThuaDiem_TSDanhGiaKetQua_AD' });
              } },
            capNH
        ]
    });
})();
