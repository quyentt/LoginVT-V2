/* =========================================================================
   Đơn vị phí theo học phần — lưới Học phần × Thời gian
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/scripts/donviphimoihp.js
   Khung lưới và hộp thoại: ums.dmhsA.dvp (cuối _chung_a.js).
   ---------------------------------------------------------------------------
   Lời gọi riêng của màn (chép nguyên từ bản gốc, đều có func + iM):
       pkg_taichinh_thuchi2.LayDSThoiGian_DonViPhi_HocPhan   cột thời gian (ID, THOIGIAN)
       pkg_taichinh_thuchi2.LayDSHocPhanKhaiDonViPhi         dòng = học phần (khoá ô ID)
       pkg_nhansu_hoso_v2.LayDanhSachToanBo                  ô Đơn vị của hộp thoại (edu.system.getList_CoCauToChuc)
       pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan           ô Học phần của hộp thoại, lọc theo Đơn vị
   Mở màn là nạp lưới ngay (init gọi getList_ThoiGian_DVP). Bộ lọc Khoản
   thu / Thời gian / Kiểu học KHÔNG đổi cột hay dòng — chỉ vào
   TC_DonViPhi_SoTien/LayDanhSach và khi lưu, như bản gốc.

   Hai lời gọi nạp cột/dòng gửi tham số từ ô không tồn tại (txtAAAA,
   dropAAAA) qua edu.system.getValById → undefined → bị JSON.stringify bỏ
   khỏi payload mã hoá. Ở đây gửi chuỗi rỗng; phía Oracle coi như nhau (NULL).

   Cố ý bỏ (bản gốc có mã nhưng không bấm tới được vì HTML đã comment nút
   / ô lọc): Khai nhanh (zoneEdit), Kế thừa (myModalKeThua), bộ lọc Khoa
   quản lý / Hệ / Khoá và các lời gọi chỉ để đổ các ô đó lúc mở màn
   (getList_KhoaQuanLy, genBoLoc_HeKhoa("_KT")). Không có kiểm tra Hệ/Khoá
   trước khi Thêm mới (bản gốc đã comment).
   ========================================================================= */
(function () {
    'use strict';

    var A = ums.dmhsA, D = A.dvp;
    var root = document.getElementById('donviphimoihp');

    var hocPhan = [];      // dropNew_HocPhan
    var donVi = [];        // dropNew_DonVi
    var donViChon = '';    // modal gốc giữ nguyên lựa chọn giữa các lần mở

    /** getList_HocPhan — strThuocBoMon_Id = dropNew_DonVi */
    function loadHocPhan(dv) {
        return A.rows({
            action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eCS4iESkgLwPP',
            func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan',
            strTuKhoa: '',                        // txtSearchModal_TuKhoa_HP không tồn tại
            strDaoTao_MonHoc_Id: '',
            strThuocBoMon_Id: dv,
            strThuocTinhHocPhan_Id: '',
            strNguoiThucHien_Id: '',
            pageIndex: 1, pageSize: 1000000
        }).then(function (r) { hocPhan = r; return r; });
    }

    function tenHP(r) { return r.MA + ' - ' + r.TEN; }   // genComBo_HocPhan: MA + " - " + TEN

    D.screen(root, {
        title: 'Đơn vị phí theo học phần',
        icon: 'fa-book-open',
        filters: ['khoanthu', 'thoigian', 'kieuhoc'],
        rowKey: 'ID',
        rowName: 'học phần',
        autoload: true,
        cols: [
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
            { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Học trình', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' }
        ],
        load: function () {
            var out = {};
            // getList_ThoiGian_DVP rồi getList_Dong
            return A.rows({
                action: 'TC_ThuChi2_MH/DSA4BRIVKS4oBiggLx4FLi8XKBEpKB4JLiIRKSAv',
                func: 'pkg_taichinh_thuchi2.LayDSThoiGian_DonViPhi_HocPhan',
                strTuKhoa: '', strDaoTao_CoCauToChuc_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strDiem_KieuHoc_Id: '', strTaiChinh_CacKhoanThu_Id: '', strNguoiThucHien_Id: ''
            }).then(function (cot) {
                out.cot = cot;
                return A.rows({
                    action: 'TC_ThuChi2_MH/DSA4BRIJLiIRKSAvCikgKAUuLxcoESko',
                    func: 'pkg_taichinh_thuchi2.LayDSHocPhanKhaiDonViPhi',
                    strTuKhoa: '', strDaoTao_CoCauToChuc_Id: '', strNguoiThucHien_Id: ''
                });
            }).then(function (rows) { out.rows = rows; return out; });
        },
        dialog: {
            prefill: true,
            fields: [{
                k: 'donvi', label: 'Đơn vị', head: 'Chọn cơ cấu tổ chức',
                rows: function () { return donVi; },
                value: function () { return donViChon; },
                addValue: function () { return donViChon; },
                onPick: function (b) {
                    donViChon = A.val(b, 'donvi');
                    loadHocPhan(donViChon).then(function (r) {
                        A.fill(A.k(b, 'pv'), r, { name: tenHP, head: 'Chọn học phần' });
                    }).catch(function (e) { ums.api.handle(e, 'học phần'); });
                }
            }, {
                k: 'pv', label: 'Học phần', head: 'Chọn học phần', name: tenHP,
                rows: function () { return hocPhan; },
                value: function (row) { return row.PHAMVIAPDUNG_ID; }
            }]
        },
        khaiNhanh: null,
        init: function (c) {
            // getList_CoCauToChuc → dropNew_DonVi
            A.rows({
                action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P',
                func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
                dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: ''
            }).then(function (r) { donVi = r; }).catch(c.fail('cơ cấu tổ chức'));
            loadHocPhan('').catch(c.fail('học phần'));
        }
    });

})();
