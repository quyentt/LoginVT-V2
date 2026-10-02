/* =========================================================================
   Đề cương học tập
   Bản gốc: ApisKeHoachChuongTrinh/Modules/noidungdaotao/html/decuonghoctap.html + script/decuonghoctap.js
   ---------------------------------------------------------------------------
   Một cột như gốc (cùng khuôn màn Bài học): thanh lọc Hệ → Khoá → Chương trình,
   Học phần, từ khoá + "Danh sách đề cương học tập"; biểu mẫu thay chỗ.
   Lời gọi (kiểu cũ, chép nguyên):
       KHCT_DeCuongHocTap/LayDanhSach  GET  strTuKhoa, strDaoTao_HocPhan_Id = HP lọc, strDaoTao_ToChucCT_Id = CT lọc,
            strNguoiThucHien_Id '', phân trang
       KHCT_DeCuongHocTap/LayChiTiet   GET  strId
       KHCT_DeCuongHocTap/ThemMoi|CapNhat  strId, strDaoTao_ToChucCT_Id, strDaoTao_HocPhan_Id, strMoTa, strNoiDung
       KHCT_DeCuongHocTap/Xoa          strIds (nối dấu phẩy)
       Lọc: KHCT_HeDaoTao / KHCT_KhoaDaoTao / KHCT_ToChucChuongTrinh/LayDanhSach (không lọc quyền — như gốc)
       Học phần (lọc + biểu mẫu): KHCT_HocPhan/LayDanhSach mọi tham số '', pageSize 100000000, nhãn TEN.
   Thêm mới: Chương trình / Học phần điền sẵn giá trị đang lọc (rewrite của gốc).
   Khác gốc (tự chốt): ô Chương trình của biểu mẫu nạp mọi chương trình (gốc dùng chung danh sách với ô lọc —
   thu hẹp theo Hệ/Khoá đang lọc). Học phần không phụ thuộc Chương trình (lời gọi gốc không lọc theo CT).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('khct-decuonghoctap');
    if (!root) return;
    var N = ums.khctND;
    var CTL = 'KHCT_DeCuongHocTap';
    var HP = N.srcHocPhan('TEN');

    var crud = ums.crud({
        root: root,
        title: 'Đề cương học tập',
        formTitle: 'đề cương học tập',
        listTitle: 'Danh sách đề cương học tập',
        icon: 'fa-books',
        saveAgain: 'Lưu và Nhập tiếp',
        rowDelete: false,
        formDelete: false,
        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình' },
            { key: 'hp', type: 'select', label: 'Chọn học phần', source: HP },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: CTL + '/LayDanhSach', method: 'GET', strTuKhoa: f.q, strDaoTao_HocPhan_Id: f.hp,
                         strDaoTao_ToChucCT_Id: f.ct, strNguoiThucHien_Id: '' };
            }
        },
        columns: [
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Nội dung', prop: 'NOIDUNG' }
        ],
        detail: function (row) { return { action: CTL + '/LayChiTiet', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Thông tin đề cương học tập' },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', type: 'textarea' },
            { key: 'strDaoTao_ToChucCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select',
              source: N.srcChuongTrinh(), placeholder: 'Chọn chương trình' },
            { key: 'strDaoTao_HocPhan_Id', col: 'DAOTAO_HOCPHAN_ID', label: 'Học phần', type: 'select', source: HP, placeholder: 'Chọn học phần' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        onForm: function (row, c) {
            if (row) return;
            N.datGT(N.fe(c, 'strDaoTao_ToChucCT_Id'), N.fl(c, 'ct').value);
            N.datGT(N.fe(c, 'strDaoTao_HocPhan_Id'), N.fl(c, 'hp').value);
        },
        save: function (v, row) {
            return {
                action: CTL + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strDaoTao_ToChucCT_Id: v.strDaoTao_ToChucCT_Id,
                strDaoTao_HocPhan_Id: v.strDaoTao_HocPhan_Id,
                strMoTa: v.strMoTa,
                strNoiDung: v.strNoiDung,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return { action: CTL + '/Xoa', strIds: ids.join(','), strNguoiThucHien_Id: '' };
        }
    });
    N.locDaoTao(crud, {});
})();
