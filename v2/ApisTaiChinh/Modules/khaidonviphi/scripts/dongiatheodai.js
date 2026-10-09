/* =========================================================================
   Đơn giá theo dải (sĩ số → số tiền)
   Bản gốc: ApisTaiChinh/Modules/khaidonviphi/scripts/dongiatheodai.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, chép nguyên bản gốc — kể cả tham số `type`
   bản gốc đặt TRONG dữ liệu gửi lên):
       TC_ThuChi2/LayDSPhamViDVP_SiSo_SoTien     GET  danh sách
       TC_ThuChi2/Them_DonViTinh_SiSo_SoTien     thêm
       TC_ThuChi2/Sua_DonViTinh_SiSo_SoTien2     sửa (khi có strId)
       TC_Chung/LayDSPhanCapApDung               GET  loại phạm vi (ô lọc)
       TC_ThuChi2/LayDSThoiGian                  GET  thời gian theo phân cấp
       TC_ThuChi2/LayDSKieuHocDVP_SiSo_SoTien    GET  kiểu học theo phân cấp + thời gian
       TC_KhoanThu/LayDanhSach                   khoản thu

   Bản gốc hỏng nặng — những gì làm ở đây:
     · getList_ThoiGian / getList_KieuHoc có sẵn nhưng không được gọi ở đâu
       nên hai ô lọc và hai ô biểu mẫu tương ứng luôn rỗng. Ở đây nối tầng:
       đổi loại phạm vi → nạp thời gian; đổi thời gian → nạp kiểu học (đúng
       tham số hai hàm gốc).
     · Xoá gọi TN_KeHoach/Xoa — procedure xoá KẾ HOẠCH TỐT NGHIỆP, nhầm
       module → BỎ chức năng xoá.
     · Nút sửa: viewEdit_DonGiaTheoDai đổ vào các ô của màn khác (txtMa,
       txtTen, dropPhanLoai…) rồi gọi ba hàm không tồn tại → lỗi JS; chỉ
       strId và thời gian (DAOTAO_THOIGIANDAOTAO_ID) là đúng. Ở đây sửa chỉ
       đổ thời gian — bản gốc không đọc cột nào khác cho các ô còn lại, tên
       cột thật cần kiểm trên máy chủ.
     · "Loại phạm vi" / "Phạm vi áp dụng" trong biểu mẫu: không có nguồn nào
       nạp (dropLoaiPhamVi, dropPhamVi) → strPhamViApDung_Id luôn rỗng. Bỏ hai
       ô, tham số vẫn gửi rỗng như bản gốc. CẦN API phạm vi theo phân cấp.
     · Bảng: tiêu đề HTML 5 cột, genTable 9 cột (lệch) và gọi getList_PhanCong
       không tồn tại. Giữ các cột dữ liệu TEN, DAOTAO_THOIGIANDAOTAO,
       NGAYBATDAU, NGAYKETTHUC, PHANLOAI_TEN; bỏ hai cột nút "Chi tiết" không
       có xử lý.
     · Ô từ khoá tìm kiếm: không gửi lên (lời gọi danh sách không có
       strTuKhoa) → bỏ.
   ========================================================================= */
(function () {
    'use strict';

    var M = ums.miengiam;
    var root = document.getElementById('dongiatheodai');

    var PHANCAP = { call: { action: 'TC_Chung/LayDSPhanCapApDung', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' } };
    var KHOANTHU = { call: {
        action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 10000,
        strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
    } };

    var crud = ums.crud({
        root: root,
        title: 'Đơn giá theo dải',
        formTitle: 'đơn giá theo dải',
        icon: 'fa-building',
        filters: [
            { key: 'pl', type: 'select', label: 'Chọn loại phạm vi', source: PHANCAP },
            { key: 'tg', type: 'select', label: 'Chọn thời gian' },
            { key: 'kh', type: 'select', label: 'Chọn kiểu học' }
        ],
        list: {
            call: function (f) {
                return {
                    action: 'TC_ThuChi2/LayDSPhamViDVP_SiSo_SoTien',
                    method: 'GET',
                    type: 'GET',
                    strKieuHoc_Id: f.kh,
                    strPhanCapApDung_Id: f.pl,
                    strDaoTao_ThoiGianDaoTao_Id: f.tg,
                    strNguoiThucHien_Id: ''
                };
            }
        },
        columns: [
            { title: 'Tên phạm vi', prop: 'TEN' },
            { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
            { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' }
        ],
        fields: [
            { type: 'legend', label: 'Thông tin' },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Thời gian', type: 'select' },
            { key: 'strKieuHoc_Id', label: 'Kiểu học', type: 'select' },
            { key: 'dTongSoTien', label: 'Mức phí', type: 'number' },
            { key: 'dTongSoTienCanDuoi', label: 'Mức phí cận dưới', type: 'number' },
            { key: 'dSiSoBatDau', label: 'Số lượng bắt đầu', type: 'number' },
            { key: 'dSiSoKetThuc', label: 'Số lượng kết thúc', type: 'number' },
            { key: 'strTaiChinh_CacKhoanThu_Id', label: 'Tài chính', type: 'select', source: KHOANTHU },
            { key: 'strTuKhoa', label: 'Từ khóa' },
            { key: 'strGhiChu', label: 'Ghi chú', span: true }
        ],
        onForm: function (row) {
            // Bản gốc (rewrite): thêm mới thì lấy sẵn thời gian đang lọc
            if (!row) jQuery(el('form', 'strDaoTao_ThoiGianDaoTao_Id')).val(el('filter', 'tg').value).trigger('change.select2');
        },
        save: function (v, row) {
            return {
                action: row ? 'TC_ThuChi2/Sua_DonViTinh_SiSo_SoTien2' : 'TC_ThuChi2/Them_DonViTinh_SiSo_SoTien',
                type: 'POST',
                strId: row ? row.ID : '',
                strTuKhoa: v.strTuKhoa,
                strKieuHoc_Id: v.strKieuHoc_Id,
                strPhamViApDung_Id: '',
                strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                dSiSoBatDau: v.dSiSoBatDau,
                dSiSoKetThuc: v.dSiSoKetThuc,
                dTongSoTien: v.dTongSoTien,
                dTongSoTienCanDuoi: v.dTongSoTienCanDuoi,
                strGhiChu: v.strGhiChu,
                strNguoiThucHien_Id: ''
            };
        }
    });

    function el(scope, k) { return root.querySelector('[data-scope="' + scope + '"][data-k="' + k + '"]'); }

    /* Nối tầng loại phạm vi → thời gian → kiểu học. Bản gốc đổ cùng danh
       sách vào ô lọc và ô biểu mẫu (renderPlace hai chỗ). */
    function loadThoiGian() {
        return M.rows({
            action: 'TC_ThuChi2/LayDSThoiGian', method: 'GET', type: 'GET',
            strPhanCapApDung_Id: el('filter', 'pl').value, strNguoiThucHien_Id: '', silent: true
        }).then(function (r) {
            M.fill(el('filter', 'tg'), r, { head: 'Chọn thời gian' });
            M.fill(el('form', 'strDaoTao_ThoiGianDaoTao_Id'), r, { head: 'Chọn thời gian' });
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    }
    function loadKieuHoc() {
        return M.rows({
            action: 'TC_ThuChi2/LayDSKieuHocDVP_SiSo_SoTien', method: 'GET', type: 'GET',
            strPhanCapApDung_Id: el('filter', 'pl').value, strDaoTao_ThoiGianDaoTao_Id: el('filter', 'tg').value,
            strNguoiThucHien_Id: '', silent: true
        }).then(function (r) {
            M.fill(el('filter', 'kh'), r, { head: 'Chọn kiểu học' });
            M.fill(el('form', 'strKieuHoc_Id'), r, { head: 'Chọn kiểu học' });
        }).catch(function (err) { ums.api.handle(err, 'kiểu học'); });
    }
    jQuery(el('filter', 'pl')).on('change', function () { loadThoiGian().then(loadKieuHoc); });
    jQuery(el('filter', 'tg')).on('change', loadKieuHoc);
    loadThoiGian().then(loadKieuHoc);

    return crud;
})();
