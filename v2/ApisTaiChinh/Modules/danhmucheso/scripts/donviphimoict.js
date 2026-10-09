/* =========================================================================
   Đơn vị phí theo chương trình (thực chất theo KHỐI KIẾN THỨC) — lưới
   Khối kiến thức × Thời gian
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/donviphimoict.js
   Khung lưới, hộp thoại, Khai nhanh: ums.dmhsA.dvp (cuối _chung_a.js).
   ---------------------------------------------------------------------------
   Lời gọi riêng của màn (chép nguyên từ bản gốc):
       TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien  GET  cột thời gian (ID, THOIGIAN) — KHÔNG có khoa quản lý
       TC_ThuChi2/LayDSTaiChinh_KhoiKT_DonViPhi          GET  dòng = khối kiến thức (khoá ô PHAMVIAPDUNG_ID)
       KHCT_ToChucChuongTrinh/LayDSNganhTheoKhoa         GET  danh sách ngành của Khai nhanh
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao              hệ (edu.system.getList_HeDaoTao = ums.ref.heDaoTao)
       pkg_kehoach_thongtin.LayDSKS_DaoTao_KhoaDaoTao         khoá — nạp một lần, lọc tại chỗ theo hệ
       pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT           ô lọc chương trình (ums.ref.chuongTrinh)
   Chọn khoá → nạp lưới + nạp ô chương trình; chọn chương trình → nạp lưới.
   Ô "Khối kiến thức" của hộp thoại = chính các dòng lưới (ID, "TEN - MA").

   Nghi ngờ, giữ nguyên:
     · Ô Khối kiến thức lấy value = ID của dòng, còn ô lưới/giá trị khớp theo
       PHAMVIAPDUNG_ID. Nếu hai cột này khác nhau thì sửa một ô sẽ không chọn
       sẵn được khối kiến thức (bản gốc cũng vậy).
     · Khai nhanh lưu theo NGÀNH (TC_DonViPhi_Nganh/ThemMoi) dù màn là khối
       kiến thức; strDaoTao_KhoaDaoTao_Id của LayDSNganhTheoKhoa gửi "a,b"
       (getValCombo), còn khi lưu thì "a#b".
   Cố ý bỏ: btnCapNhatAll (không có trong HTML). Bản gốc không có Kế thừa,
   Import, "Thêm nhanh mức phí" và cột khoa quản lý ở Khai nhanh — giữ vậy.
   Khi thêm mới, Loại khoản/Thời gian để trống (resetPopup của màn này).
   ========================================================================= */
(function () {
    'use strict';

    var A = ums.dmhsA, D = A.dvp;
    var root = document.getElementById('donviphimoict');

    function tenMa(ten, ma) { return (ten == null ? '' : ten) + ' - ' + (ma == null ? '' : ma); }

    D.screen(root, {
        title: 'Đơn vị phí theo chương trình',
        icon: 'fa-list-timeline',
        filters: ['he', 'khoa', 'ct', 'khoanthu', 'thoigian', 'kieuhoc'],
        rowKey: 'PHAMVIAPDUNG_ID',
        rowName: 'khối kiến thức',
        emptyMsg: 'Chọn hệ và khóa đào tạo để hiện lưới đơn vị phí',
        cols: [
            { title: 'Khóa học', render: function (r) { return ums.ui.esc(tenMa(r.DAOTAO_KHOAHOC_TEN, r.DAOTAO_KHOAHOC_MA)); } },
            { title: 'Khoa quản lý', prop: 'DAOTAO_KHOAQUANLY_TEN' },
            { title: 'Chương trình học', render: function (r) { return ums.ui.esc(tenMa(r.CHUONGTRINH_TEN, r.CHUONGTRINH_MA)); } },
            { title: 'Khối kiến thức', render: function (r) { return ums.ui.esc(tenMa(r.TEN, r.MA)); } }
        ],
        load: function (f) {
            var out = {};
            return A.rows({
                action: 'TC_DonViPhi_SoTien/LayDSThoiGian_DonViPhi_SoTien', method: 'GET',
                strDiem_KieuHoc_Id: f.kieuhoc,
                strDaoTao_ThoiGianDaoTao_Id: f.thoigian,
                strHeDaoTao_Id: f.he,
                strKhoaDaoTao_Id: f.khoa,
                strDonViTinh_Id: '',
                strTaiChinh_CacKhoanThu_Id: f.khoanthu,
                strNghiepVuApDung_Id: '',
                strNguoiThucHien_Id: ''
            }).then(function (cot) {
                out.cot = cot;
                // getList_ChuongTrinhDaoTao
                return A.rows({
                    action: 'TC_ThuChi2/LayDSTaiChinh_KhoiKT_DonViPhi', method: 'GET',
                    type: 'GET',
                    strTuKhoa: '',
                    strHeDaoTao_Id: f.he,
                    strKhoaDaoTao_Id: f.khoa,
                    strChuongTrinh_Id: f.ct,
                    strDaoTao_ThoiGianDaoTao_Id: f.thoigian,
                    strDiem_KieuHoc_Id: f.kieuhoc,
                    strTaiChinh_CacKhoanThu_Id: f.khoanthu,
                    strNguoiThucHien_Id: ''
                });
            }).then(function (rows) { out.rows = rows; return out; });
        },
        addGuard: function (f) { return !f.he || !f.khoa ? 'Hãy chọn Hệ - Khóa - Chương trình trước!' : ''; },
        dialog: {
            prefill: false,
            fields: [{
                // cbGenCombo_ChuongTrinhDaoTao → dropNew_ChuongTrinh
                k: 'pv', label: 'Khối kiến thức', head: 'Chọn Khối kiến thức',
                name: function (r) { return tenMa(r.TEN, r.MA); },
                rows: function (c) { return c.S.rows; },
                value: function (row) { return row.PHAMVIAPDUNG_ID; }
            }]
        },
        khaiNhanh: {
            title: 'Khai nhanh mức đơn vị phí',
            kql: false, themNhanh: false,
            cols: [
                { title: 'Mã ngành', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên ngành', prop: 'TEN' }
            ],
            nganhCall: function (v) {
                return {
                    action: 'KHCT_ToChucChuongTrinh/LayDSNganhTheoKhoa', method: 'GET', type: 'GET',
                    strDaoTao_KhoaDaoTao_Id: v.khoa, strNguoiThucHien_Id: ''
                };
            }
        },
        init: function (c) {
            // getList_HeDaoTao → dropHeDaoTao_DVP + dropHeDaoTao_DVP_Edit
            ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
                .then(function (r) {
                    A.fill(c.el.he, r, { name: 'TENHEDAOTAO', head: D.LABEL.he });
                    A.fill(c.kn.el.he, r, { name: 'TENHEDAOTAO', head: D.LABEL.he });
                }).catch(c.fail('hệ đào tạo'));
            // getList_KhoaDaoTao(he) = edu.system.getList_KhoaDaoTao
            D.khoaOnce(c, function (he) {
                return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
            });
            A.onPick(c.el.khoa, function () {
                c.load();
                // getList_ChuongTrinhDaoTao_ComBo → dropChuongTrinh_DVP
                ums.ref.chuongTrinh({
                    strKhoaDaoTao_Id: A.val(c.main, 'khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                    strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
                }).then(function (r) {
                    A.fill(c.el.ct, r, { name: 'TENCHUONGTRINH', head: D.LABEL.ct });
                }).catch(c.fail('chương trình đào tạo'));
            });
            A.onPick(c.el.ct, function () { c.load(); });
        }
    });
})();
