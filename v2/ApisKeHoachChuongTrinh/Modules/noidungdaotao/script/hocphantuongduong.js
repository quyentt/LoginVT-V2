/* =========================================================================
   Học phần tương đương
   Bản gốc: ApisKeHoachChuongTrinh/Modules/noidungdaotao/html/hocphantuongduong.html + script/hocphantuongduong.js
   ---------------------------------------------------------------------------
   Một cột như gốc: thanh lọc Hệ → Khoá → Chương trình + từ khoá, "Danh sách học
   phần tương đương" (nút Chuyển điểm tương đương 1 - nhiều); biểu mẫu thay chỗ.
   Lời gọi (kiểu cũ, chép nguyên):
       KHCT_ThongTin/LayDSKS_DaoTao_HocPhanTD   GET  strTuKhoa, strDaoTao_HocPhan_Id '', strDaoTao_ToChucCT_Id = CT lọc,
            strDaoTao_HocPhan_TD_Id '', strDaoTao_ToChucCT_TD_Id '', strNguoiThucHien_Id '', phân trang,
            strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id
       KHCT_ThongTin/LayTTDaoTao_HocPhanTuongDuong   GET  strId
       KHCT_ThongTin/Them_DaoTao_HocPhanTuongDuong | Sua_DaoTao_HocPhanTuongDuong
            strId, strDaoTao_ToChucCT_Id, strDaoTao_HocPhan_Id, strDaoTao_HocPhan_TD_Id, strDaoTao_ToChucCT_TD_Id, strNhom
       KHCT_ThongTin/Xoa_DaoTao_HocPhanTuongDuong   strIds (nối dấu phẩy)
       D_XuLyDiem/Tinh_HocPhan_TuongDuong_PhamVi    POST  type 'POST', strChucNang_Id, Hệ / Khoá / CT đang lọc,
            strQuyTacTinhTuongDuong_Id '' (gốc đọc ô dropAAAA không tồn tại)
       Lọc: KHCT_HeDaoTao / KHCT_KhoaDaoTao / KHCT_ToChucChuongTrinh/LayDanhSach (không lọc quyền — như gốc)
       Biểu mẫu: Chương trình = KHCT_ToChucChuongTrinh/LayDanhSach (mọi CT, nhãn "Mã - Tên");
                 Học phần = KHCT_HocPhan_ChuongTrinh/LayDanhSach theo CT (id DAOTAO_HOCPHAN_ID, nhãn "Mã - Tên").
   Khác gốc (sửa lỗi):
   - Sửa: gốc đặt nhầm `me.action` thay vì `obj_save.action` nên SỬA vẫn gọi Them_… kèm strId → nay gọi
     Sua_DaoTao_HocPhanTuongDuong. Kiểm lời gọi Sửa trên host (đường GHI chưa từng chạy).
   - Chương trình → Học phần, Chương trình tương đương → Học phần tương đương: khoá con tới khi chọn cha.
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('khct-hocphantuongduong');
    if (!root) return;
    var N = ums.khctND, ui = ums.ui;
    var CT = N.srcChuongTrinh(N.tenCT);
    var PRE = 'KHCT_ThongTin/';

    var crud = ums.crud({
        root: root,
        title: 'Học phần tương đương',
        formTitle: 'học phần tương đương',
        listTitle: 'Danh sách học phần tương đương',
        icon: 'fa-book-open-cover',
        saveAgain: 'Lưu và Nhập tiếp',
        rowDelete: false,
        formDelete: false,
        toolbar: [{ text: 'Chuyển điểm tương đương 1 - nhiều', icon: 'fa-money-bill-transfer', mod: 'primary', onClick: chuyenDiem }],
        filters: [
            { key: 'he', type: 'select', label: 'Chọn hệ đào tạo' },
            { key: 'khoa', type: 'select', label: 'Chọn khóa đào tạo' },
            { key: 'ct', type: 'select', label: 'Chọn chương trình' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: PRE + 'LayDSKS_DaoTao_HocPhanTD', method: 'GET',
                    strTuKhoa: f.q, strDaoTao_HocPhan_Id: '', strDaoTao_ToChucCT_Id: f.ct, strDaoTao_HocPhan_TD_Id: '',
                    strDaoTao_ToChucCT_TD_Id: '', strNguoiThucHien_Id: '',
                    strDaoTao_HeDaoTao_Id: f.he, strDaoTao_KhoaDaoTao_Id: f.khoa
                };
            }
        },
        columns: [
            { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Học phần tương đương', prop: 'DAOTAO_HOCPHAN_TD_TEN' },
            { title: 'Chương trình tương đương', prop: 'DAOTAO_CHUONGTRINH_TD_TEN' },
            { title: 'Nhóm', prop: 'NHOM' }
        ],
        detail: function (row) { return { action: PRE + 'LayTTDaoTao_HocPhanTuongDuong', method: 'GET', strId: row.ID }; },
        fields: [
            { type: 'legend', label: 'Học phần tương đương' },
            { key: 'strDaoTao_ToChucCT_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_ID', label: 'Chương trình', type: 'select', source: CT, placeholder: 'Chọn chương trình' },
            { key: 'strDaoTao_HocPhan_Id', label: 'Học phần', type: 'select', placeholder: 'Chọn học phần' },
            { key: 'strDaoTao_ToChucCT_TD_Id', col: 'DAOTAO_TOCHUCCHUONGTRINH_TD_ID', label: 'Chương trình tương đương', type: 'select', source: CT, placeholder: 'Chọn chương trình tương đương' },
            { key: 'strDaoTao_HocPhan_TD_Id', label: 'Học phần tương đương', type: 'select', placeholder: 'Chọn học phần tương đương' },
            { key: 'strNhom', col: 'NHOM', label: 'Nhóm' }
        ],
        onForm: function (row) {
            hp.nap(row ? row.DAOTAO_HOCPHAN_ID : '');
            hpTD.nap(row ? row.DAOTAO_HOCPHAN_TD_ID : '');
        },
        save: function (v, row) {
            return {
                action: PRE + (row ? 'Sua_DaoTao_HocPhanTuongDuong' : 'Them_DaoTao_HocPhanTuongDuong'),
                strId: row ? row.ID : '',
                strDaoTao_ToChucCT_Id: v.strDaoTao_ToChucCT_Id,
                strDaoTao_HocPhan_Id: v.strDaoTao_HocPhan_Id,
                strDaoTao_HocPhan_TD_Id: v.strDaoTao_HocPhan_TD_Id,
                strDaoTao_ToChucCT_TD_Id: v.strDaoTao_ToChucCT_TD_Id,
                strNhom: v.strNhom,
                strNguoiThucHien_Id: ''
            };
        },
        remove: function (ids) {
            return { action: PRE + 'Xoa_DaoTao_HocPhanTuongDuong', strIds: ids.join(','), strNguoiThucHien_Id: '' };
        }
    });

    var loc = N.locDaoTao(crud, {});
    var hpOpt = { nap: N.hocPhanCT, id: 'DAOTAO_HOCPHAN_ID', name: N.tenHPCT };
    var hp = N.phuThuoc(crud, 'strDaoTao_ToChucCT_Id', 'strDaoTao_HocPhan_Id', Object.assign({ head: 'Chọn học phần' }, hpOpt));
    var hpTD = N.phuThuoc(crud, 'strDaoTao_ToChucCT_TD_Id', 'strDaoTao_HocPhan_TD_Id', Object.assign({ head: 'Chọn học phần tương đương' }, hpOpt));

    /* Nút "Chuyển điểm tương đương 1 - nhiều" — hỏi lại rồi chạy theo Hệ / Khoá / CT đang lọc */
    function chuyenDiem() {
        ui.confirm('Bạn có chắc chắn muốn thực hiện?', { title: 'Chuyển điểm tương đương 1 - nhiều', ok: 'Thực hiện' }).then(function (yes) {
            if (!yes) return;
            var F = loc.F;
            return ums.api.call({
                action: 'D_XuLyDiem/Tinh_HocPhan_TuongDuong_PhamVi',
                type: 'POST',
                strChucNang_Id: ums.state.chucNangId || '',
                strDaoTao_HeDaoTao_Id: F.he.value,
                strDaoTao_KhoaDaoTao_Id: F.khoa.value,
                strDaoTao_ChuongTrinh_Id: F.ct.value,
                strQuyTacTinhTuongDuong_Id: '',
                strNguoiThucHien_Id: ''
            }).then(function () { ui.toast('Thực hiện thành công!', 'ok'); });
        }).catch(function (err) { ums.api.handle(err, 'chuyển điểm tương đương'); });
    }
})();
