/* =========================================================================
   Thời gian đào tạo (học kỳ)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/tochucchuongtrinh/script/thoigiandaotao.js
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn — kiểu cũ, KHÔNG func, KHÔNG iM):
       KHCT_ThoiGianDaoTao/LayDanhSach            GET  strTuKhoa, strDAOTAO_NAM_Id, pageIndex/pageSize
       KHCT_ThoiGianDaoTao/LayChiTiet             GET  strId
       KHCT_ThongTin/Them_DaoTao_ThoiGianDaoTao   POST strId='', dHocKy, dThang, dDotHoc, strDaoTao_Nam_Id, dLoaiHocKy,
                                                       dTrangThai=1, strNgayBatDau, strNgayKetThuc
       KHCT_ThongTin/Sua_DaoTao_ThoiGianDaoTao    POST như trên + strId
       KHCT_ThoiGianDaoTao/Xoa                    POST strId (nhiều id nối dấu phẩy, MỘT lời gọi — như gốc)
       KHCT_NamHoc/LayDanhSach                    GET  (ô Năm học — lọc và biểu mẫu)
   Giữ: kiểm "Ngày bắt đầu không được lớn hơn ngày kết thúc" trước khi lưu.
   Sửa lỗi gốc: viewEdit gốc KHÔNG đổ ô Tháng → mở Sửa rồi Lưu là xoá trắng Tháng. Nay đổ THANG.
   Bỏ: trình nghe "select" trên dropNamHoc (sự kiện không bao giờ bắn), nút .btnDelete trùng.
   ========================================================================= */
(function () {
    'use strict';

    var T = ums.khctTC;
    var NAM = T.srcNamHoc();

    function ngay(s) {
        var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s || '');
        return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : null;
    }

    T.crud({
        ctl: 'KHCT_ThoiGianDaoTao',
        xoaKhoa: 'strId',
        root: document.getElementById('thoigiandaotao'),
        title: 'Thời gian đào tạo',
        formTitle: 'học kỳ',
        listTitle: 'Danh sách học kỳ',
        icon: 'fa-list-timeline',

        filters: [
            { key: 'nam', type: 'select', label: 'Chọn năm học', source: NAM },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q,
                    strDAOTAO_NAM_Id: f.nam,
                    strNguoiThucHien_Id: ''
                };
            }
        },

        columns: [
            { title: 'Học kỳ', prop: 'HOCKY', cls: 'is-center' },
            { title: 'Năm học', prop: 'NAMHOC', cls: 'is-center' },
            { title: 'Đợt học', prop: 'DOTHOC', cls: 'is-center' },
            { title: 'Tháng', prop: 'THANG', cls: 'is-center' },
            { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { type: 'legend', label: 'Thông tin học kỳ' },
            { key: 'strDaoTao_Nam_Id', col: 'DAOTAO_THOIGIANDAOTAO_NAM_ID', label: 'Năm học', type: 'select',
                placeholder: '--- Chọn năm học--', source: NAM },
            { key: 'dHocKy', col: 'HOCKY', label: 'Học kỳ' },
            { key: 'dThang', col: 'THANG', label: 'Tháng' },
            { key: 'dDotHoc', col: 'DOTHOC', label: 'Đợt học' },
            { key: 'dLoaiHocKy', col: 'LOAIHOCKY', label: 'Loại học kỳ' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date' }
        ],

        onForm: function (row, crud) {
            if (!row) T.datTuLoc(crud, [['nam', 'strDaoTao_Nam_Id']]);
        },

        save: function (v, row) {
            var bd = ngay(v.strNgayBatDau), kt = ngay(v.strNgayKetThuc);
            if (bd !== null && kt !== null && bd > kt) {
                ums.ui.toast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'warn');
                return null;
            }
            return {
                action: 'KHCT_ThongTin/' + (row ? 'Sua_DaoTao_ThoiGianDaoTao' : 'Them_DaoTao_ThoiGianDaoTao'),
                strId: row ? row.ID : '',
                dHocKy: v.dHocKy,
                dThang: v.dThang,
                dDotHoc: v.dDotHoc,
                strDaoTao_Nam_Id: v.strDaoTao_Nam_Id,
                dLoaiHocKy: v.dLoaiHocKy,
                dTrangThai: 1,
                strNgayBatDau: v.strNgayBatDau,
                strNgayKetThuc: v.strNgayKetThuc,
                strNguoiThucHien_Id: ''
            };
        }
    });
})();
