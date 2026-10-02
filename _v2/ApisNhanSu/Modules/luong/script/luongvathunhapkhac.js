/* =========================================================================
   Lương và thu nhập khác — tra cứu toàn trường (CHỈ XEM)
   Bản gốc: ApisNhanSu/Modules/luong/script/luongvathunhapkhac.js
   (KHÁC bản Cổng cán bộ — bản đó chỉ xem của người đăng nhập, hai bảng.)
   ---------------------------------------------------------------------------
   MỘT CỘT như bản gốc: thanh lọc + "Danh sách" (dòng tổng Số tiền, Thuế TNCN).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_KetQuaLuong/LayDanhSach  GET  strDaoTao_CoCauToChuc_Id, strNhanSu_HoSoCanBo_Id (Thành viên),
                                       dThang / dNam (trống → -1), strNguoiThucHien_Id
   Ô lọc: Đơn vị (getList_CoCauToChuc) → Thành viên (NS_HoSoV2/LayDanhSach GET,
   dLaCanBoNgoaiTruong -1 — gốc chỉ nạp khi chọn Đơn vị). Mở màn: Năm = năm nay, nạp ngay.

   Giữ như bản gốc: ô "Nhập từ khóa tìm kiếm" có trên màn, Enter là tải lại,
   nhưng lời gọi KHÔNG có tham số từ khoá (procedure không nhận) — giữ ô.
   Không chuyển: vùng Xuất báo cáo / Import (khối HTML gốc bị chú thích);
   editForm_NhanSu_LuongThuNhap / rewrite (mã chết, không vùng nào trên màn).
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui;
    function tien(k, t) { return { title: t, cls: 'is-right is-nowrap', render: function (r) { return ui.money(r[k]); }, sum: true, sumProp: k }; }

    var crud = ums.crud({
        root: document.getElementById('luongvathunhapkhac'),
        title: 'Lương và thu nhập khác',
        listTitle: 'Danh sách',
        icon: 'fa-money-check-dollar-pen',
        pageSize: 1000000,          // gốc không phân trang, dòng tổng cộng trên MỌI dòng

        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị' },
            { key: 'tv', type: 'select', label: 'Chọn thành viên' },
            { key: 'thang', type: 'text', label: 'Tháng tìm kiếm' },
            { key: 'nam', type: 'text', label: 'Năm tìm kiếm', value: String(new Date().getFullYear()) },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            call: function (f) {
                return { action: 'L_KetQuaLuong/LayDanhSach', method: 'GET', strDaoTao_CoCauToChuc_Id: f.dv, strNhanSu_HoSoCanBo_Id: f.tv,
                    dThang: f.thang || -1, dNam: f.nam || -1, strNguoiThucHien_Id: L.uid() };
            }
        },

        columns: [
            { title: 'Năm', prop: 'NAM', cls: 'is-center' },
            { title: 'Tháng', prop: 'THANG', cls: 'is-center' },
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', cls: 'is-center' },
            { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO' },
            { title: 'Họ tên', cls: 'is-center', render: function (r) { return ui.esc(L.hoTen(r)); } },
            { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
            { title: 'Chứng từ', prop: 'CHUNGTU', cls: 'is-center' },
            tien('SOTIEN', 'Số tiền'),
            tien('THUETNCN', 'Thuế TNCN'),
            { title: 'Nội dung', prop: 'MOTA', cls: 'is-center' },
            { title: 'Ngày phát sinh', prop: 'NGAYPHATSINH', cls: 'is-center is-nowrap' }
        ]
    });

    L.donViThanhVien(L.oLoc(crud, 'dv'), L.oLoc(crud, 'tv'), { la: -1 });
})();
