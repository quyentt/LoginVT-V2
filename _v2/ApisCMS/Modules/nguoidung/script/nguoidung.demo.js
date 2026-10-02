/* Dữ liệu mẫu cho Quản lý người dùng — chỉ dùng ở chế độ dựng thử.
   Danh sách người dùng dùng chung ở _chung.demo.js. */
(function () {
    'use strict';
    function trang(rows, o) {
        var q = String(o.strTuKhoa || '').toLowerCase();
        if (q) rows = rows.filter(function (r) { return (r.MASO + ' ' + r.HOTEN).toLowerCase().indexOf(q) >= 0; });
        var n = rows.length, sz = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
        return { rows: rows.slice((p - 1) * sz, p * sz), pager: n };
    }
    function ng(id, ma, ho, ten, ns, sdt, mail) {
        return { ID: id, MASO: ma, HODEM: ho, TEN: ten, HOTEN: ho + ' ' + ten, NGAYSINHDAYDU: ns, SDT_CANHAN: sdt, EMAIL_CANHAN: mail };
    }
    var CB = [
        ng('NS21', 'CB210', 'Nguyễn Thị', 'Hồng', '14/02/1990', '0912000210', 'hongnt@ums.edu.vn'),
        ng('NS22', 'CB211', 'Phạm Văn', 'Khánh', '03/08/1986', '0912000211', 'khanhpv@ums.edu.vn'),
        ng('NS23', 'CB212', 'Lê Thị', 'Thu', '27/11/1992', '0912000212', 'thult@ums.edu.vn'),
        ng('NS24', 'CB213', 'Đặng Quốc', 'Việt', '09/05/1984', '0912000213', 'vietdq@ums.edu.vn')
    ];
    var SV = [
        ng('SV31', 'BIT250101', 'Nguyễn Văn', 'An', '12/03/2007', '0868000101', 'an.nv@gmail.com'),
        ng('SV32', 'BIT250102', 'Trần Thị', 'Bình', '05/07/2007', '0868000102', 'binh.tt@gmail.com'),
        ng('SV33', 'BBA250561', 'Lê Minh', 'Châu', '21/11/2007', '0868000561', 'chau.lm@gmail.com'),
        ng('SV34', 'BIT250210', 'Phạm Thu', 'Dung', '02/01/2007', '0868000210', 'dung.pt@gmail.com'),
        ng('SV35', 'BIT250211', 'Vũ Đức', 'Mạnh', '18/09/2007', '0868000211', 'manh.vd@gmail.com')
    ];
    ums.demo.add({
        'CMS_TaiKhoan/LaySoLuongTaiKhoanChuaKhoiTao': [{ CANBO: CB.length, SINHVIEN: 245, NCS: 3, GIADINH: 0, DOITAC: 2 }],
        'NS_HoSoV2/LayDanhSachNhanSuChuaTaoTK': function (o) { return trang(CB, o); },
        'SV_HoSoHocVien/LayDanhSachSinhVienChuaKhoiTao': function (o) { return trang(SV, o); },
        'CMS_TaiKhoan/TaoMoiTaiKhoan': [],
        'CMS_Custom/ResetPassword': [],
        'CMS_PhanQuyenDuLieu/KhoiTao_KeThua_Quyen': [],
        'pkg_chung_quanlynguoidung.CapNhatThongTinTaiKhoan': [],
        'NS_CoCauToChuc/LayDanhSach': [
            { ID: 'CC1', MA: 'KCNTT', TEN: 'Khoa Công nghệ thông tin' },
            { ID: 'CC2', MA: 'BMHTTT', TEN: 'Bộ môn Hệ thống thông tin' },
            { ID: 'CC3', MA: 'KKT', TEN: 'Khoa Kinh tế' },
            { ID: 'CC4', MA: 'PDT', TEN: 'Phòng Đào tạo' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CMS.LRS': [
            { ID: 'LRS1', MA: 'NGAYSINH', TEN: 'Đặt lại theo ngày sinh (ddMMyyyy)' },
            { ID: 'LRS2', MA: 'MASO', TEN: 'Đặt lại theo mã số' }
        ]
    });
})();
