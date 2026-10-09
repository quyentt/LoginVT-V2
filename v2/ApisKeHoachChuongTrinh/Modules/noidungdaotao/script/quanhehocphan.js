/* =========================================================================
   Quan hệ học phần
   Bản gốc: ApisKeHoachChuongTrinh/Modules/noidungdaotao/html/quanhehocphan.html + script/quanhehocphan.js
   ---------------------------------------------------------------------------
   Một cột như gốc: ô từ khoá + danh sách; biểu mẫu "Thêm mới - Quan hệ học phần" thay chỗ.
   Lời gọi (kiểu cũ, chép nguyên):
       KHCT_QuanHeHocPhan/LayDanhSach  GET  strTuKhoa, strLoaiQuanHe_Id '', strDaoTao_HocPhan_Id '',
            strDaoTao_HocPhan_QuanHe_Id '', strDaoTao_ToChucCT_Id '', strNguoiThucHien_Id '', phân trang
       KHCT_QuanHeHocPhan/LayChiTiet   GET  strId
       KHCT_QuanHeHocPhan/ThemMoi|CapNhat  strId, strLoaiQuanHe_Id, strDaoTao_HocPhan_Id, strDaoTao_HocPhan_QuanHe_Id,
            strDaoTao_ToChucCT_Id, strXauDieuKien, iThuTu 1
       KHCT_QuanHeHocPhan/Xoa          strIds (nối dấu phẩy)
       Chương trình: KHCT_ToChucChuongTrinh/LayDanhSach (mọi CT); Học phần / Học phần quan hệ:
       KHCT_HocPhan_ChuongTrinh/LayDanhSach theo CT; Loại quan hệ: danh mục KHCT.LQH.
   Bắt buộc như gốc (arrValid): Học phần, Loại quan hệ, Học phần quan hệ.
   Khác gốc (sửa lỗi):
   - Ô Học phần / Học phần quan hệ gốc lấy id = cột ID của KHCT_HocPhan_ChuongTrinh (id dòng CT–học phần),
     trong khi mở Sửa lại đổ DAOTAO_HOCPHAN_ID → không bao giờ khớp. Nay dùng DAOTAO_HOCPHAN_ID (như màn Học phần
     tương đương) — tức giá trị GỬI ĐI đổi từ id dòng CT–HP sang id học phần. Kiểm trên host.
   - Gốc không nạp lại học phần theo CT khi mở Sửa → nay nạp theo CT của bản ghi. Chương trình → (Học phần,
     Học phần quan hệ) khoá con tới khi chọn cha.
   - Tiêu đề danh sách gốc chép nhầm "Danh sách học phần tương đương" → "Danh sách quan hệ học phần".
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('khct-quanhehocphan');
    if (!root) return;
    var N = ums.khctND;
    var CTL = 'KHCT_QuanHeHocPhan';

    var crud = ums.crud({
        root: root,
        title: 'Quan hệ học phần',
        formTitle: 'quan hệ học phần',
        listTitle: 'Danh sách quan hệ học phần',
        icon: 'fa-diagram-project',
        saveAgain: 'Lưu và Nhập tiếp',
        rowDelete: false,
        formDelete: false,
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strLoaiQuanHe_Id: '', strDaoTao_HocPhan_Id: '',
                         strDaoTao_HocPhan_QuanHe_Id: '', strDaoTao_ToChucCT_Id: '', strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_MA' },
            { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Loại quan hệ', prop: 'LOAIQUANHE_TEN' },
            { title: 'Học phần quan hệ', prop: 'DAOTAO_HOCPHAN_QUANHE_TEN' },
            { title: 'Điều kiện', prop: 'GIATRIDIEUKIEN' }
        ],
        detail: function (row) { return { action: CTL + '/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Quan hệ học phần' },
            { key: 'strDaoTao_ToChucCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select',
              source: N.srcChuongTrinh(), placeholder: 'Chọn chương trình' },
            { key: 'strDaoTao_HocPhan_Id', label: 'Học phần', type: 'select', required: true, placeholder: 'Chọn học phần' },
            { key: 'strLoaiQuanHe_Id', col: 'LOAIQUANHE_ID', label: 'Loại quan hệ', type: 'select', required: true,
              source: { dm: 'KHCT.LQH' }, placeholder: 'Chọn loại quan hệ' },
            { key: 'strDaoTao_HocPhan_QuanHe_Id', label: 'Học phần quan hệ', type: 'select', required: true, placeholder: 'Chọn học phần quan hệ' },
            { key: 'strXauDieuKien', col: 'GIATRIDIEUKIEN', label: 'Điều kiện' }
        ],
        onForm: function (row) {
            hp.nap(row ? row.DAOTAO_HOCPHAN_ID : '');
            hpQH.nap(row ? row.DAOTAO_HOCPHAN_QUANHE_ID : '');
        },
        save: function (v, row) {
            return {
                action: CTL + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strLoaiQuanHe_Id: v.strLoaiQuanHe_Id,
                strDaoTao_HocPhan_Id: v.strDaoTao_HocPhan_Id,
                strDaoTao_HocPhan_QuanHe_Id: v.strDaoTao_HocPhan_QuanHe_Id,
                strDaoTao_ToChucCT_Id: v.strDaoTao_ToChucCT_Id,
                strXauDieuKien: v.strXauDieuKien,
                iThuTu: 1,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return { action: CTL + '/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: '' };
        }
    });

    var opt = { nap: N.hocPhanCT, id: 'DAOTAO_HOCPHAN_ID', name: 'DAOTAO_HOCPHAN_TEN' };
    var hp = N.phuThuoc(crud, 'strDaoTao_ToChucCT_Id', 'strDaoTao_HocPhan_Id', Object.assign({ head: 'Chọn học phần' }, opt));
    var hpQH = N.phuThuoc(crud, 'strDaoTao_ToChucCT_Id', 'strDaoTao_HocPhan_QuanHe_Id', Object.assign({ head: 'Chọn học phần quan hệ' }, opt));
})();
