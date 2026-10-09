/* =========================================================================
   Đơn vị phí theo lớp — lưới Lớp quản lý × Thời gian
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/donviphimoilop.js
   Khung lưới và hộp thoại: ums.dmhsA.dvp (cuối _chung_a.js).
   ---------------------------------------------------------------------------
   Lời gọi riêng của màn (chép nguyên từ bản gốc):
       PKG_TAICHINH_THUCHI3.LayDSThoiGian_DVP_LopQL_SoTien   cột thời gian (ID, THOIGIAN)
       PKG_TAICHINH_THUCHI3.LayDSTaiChinh_LopQL_DonViPhi     dòng = lớp quản lý (khoá ô ID)
       KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen          GET  hệ (A.dvp.heQuyen)
       KHCT_ThongTin/LayDSKS_DaoTao_KhoaDaoTaoQuyen     GET  khoá — nạp một lần, lọc tại chỗ theo hệ
       pkg_kehoach_thongtin.LayDSKhoaQuanLy                  khoa quản lý (ums.ref.khoaQuanLy)
       pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT          ô lọc chương trình (ums.ref.chuongTrinh)
   Chọn khoá → CHỈ nạp ô chương trình; chọn chương trình (hoặc Tìm kiếm) →
   nạp lưới. Ô "Lớp" của hộp thoại (dropLQL456) = chính các dòng lưới.
   Hai lời gọi nạp cột/dòng lấy giá trị bằng edu.system.getValById: ô trống
   → undefined → bị JSON.stringify bỏ khỏi payload mã hoá. Ở đây gửi chuỗi
   rỗng; phía Oracle coi như nhau (NULL).

   Cố ý bỏ (bản gốc có mã nhưng HTML đã comment nút): Khai nhanh (zoneEdit,
   kể cả getList_ChuongTrinhDaoTao_ComBoEdit đọc nhầm ô dropChuongTrinh_DVP_Edit
   làm mã khoá), Kế thừa, Import, và các lời gọi chỉ để đổ các ô đó lúc mở
   màn (genBoLoc_HeKhoa("_KT")). Bỏ console.log thừa trong save_DonViPhiSoTien_One.
   ========================================================================= */
(function () {
    'use strict';

    var A = ums.dmhsA, D = A.dvp;
    var root = document.getElementById('donviphimoilop');

    D.screen(root, {
        title: 'Đơn vị phí theo lớp',
        filters: ['kql', 'he', 'khoa', 'ct', 'khoanthu', 'thoigian', 'kieuhoc'],
        rowKey: 'ID',
        rowName: 'lớp',
        emptyMsg: 'Chọn hệ, khóa và chương trình để hiện lưới đơn vị phí',
        cols: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN', cls: 'is-nowrap' },
            { title: 'Chương trình', render: function (r) {
                return ums.ui.esc((r.DAOTAO_TOCHUCCHUONGTRINH_TEN == null ? '' : r.DAOTAO_TOCHUCCHUONGTRINH_TEN) + ' - ' +
                    (r.DAOTAO_TOCHUCCHUONGTRINH_MA == null ? '' : r.DAOTAO_TOCHUCCHUONGTRINH_MA));
            } },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' }
        ],
        load: function (f) {
            var out = {};
            return A.rows({
                action: 'TC_ThuChi3_MH/DSA4BRIVKS4oBiggLx4FFxEeDS4xEA0eEi4VKCQv',
                func: 'PKG_TAICHINH_THUCHI3.LayDSThoiGian_DVP_LopQL_SoTien',
                strHeDaoTao_Id: f.he,
                strKhoaDaoTao_Id: f.khoa,
                strChuongTrinh_Id: f.ct,
                strDaoTao_CoCauToChuc_Id: f.kql,
                strDaoTao_ThoiGianDaoTao_Id: f.thoigian,
                strDiem_KieuHoc_Id: f.kieuhoc,
                strTaiChinh_CacKhoanThu_Id: f.khoanthu,
                strNguoiThucHien_Id: ''
            }).then(function (cot) {
                out.cot = cot;
                // getList_ChuongTrinhDaoTao
                return A.rows({
                    action: 'TC_ThuChi3_MH/DSA4BRIVICgCKSgvKR4NLjEQDR4FLi8XKBEpKAPP',
                    func: 'PKG_TAICHINH_THUCHI3.LayDSTaiChinh_LopQL_DonViPhi',
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
            prefill: true,
            fields: [{
                k: 'pv', label: 'Lớp', head: 'Chọn lớp quản lý', name: 'TEN',
                rows: function (c) { return c.S.rows; },
                value: function (row) { return row.PHAMVIAPDUNG_ID; }
            }]
        },
        khaiNhanh: null,
        init: function (c) {
            D.heQuyen('').then(function (r) {
                A.fill(c.el.he, r, { name: 'TENHEDAOTAO', head: D.LABEL.he });
            }).catch(c.fail('hệ đào tạo'));
            D.khoaOnce(c, function () { return D.khoaQuyen('', ''); });
            ums.ref.khoaQuanLy().then(function (r) {
                A.fill(c.el.kql, r, { head: D.LABEL.kql });
            }).catch(c.fail('khoa quản lý'));
            A.onPick(c.el.khoa, function () {
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
