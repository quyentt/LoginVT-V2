/* Dữ liệu mẫu cho hosolylich — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, t1, t3) { return { ID: id, MA: ma, TEN: ten, THONGTIN1: t1, THONGTIN2: '', THONGTIN3: t3, CHUNG_TENDANHMUC_TEN: 'Mẫu in lý lịch' }; }
    var NS = [
        { ID: 'NS1', MASO: 'CB001', HODEM: 'Nguyễn Văn', TEN: 'Hùng', NGAYSINH: 12, THANGSINH: 4, NAMSINH: 1975, ANH: '' },
        { ID: 'NS2', MASO: 'CB015', HODEM: 'Trần Thị', TEN: 'Mai', NGAYSINH: 3, THANGSINH: 9, NAMSINH: 1988, ANH: '' },
        { ID: 'NS3', MASO: 'CB102', HODEM: 'Lê Quang', TEN: 'Minh', NGAYSINH: 21, THANGSINH: 1, NAMSINH: 1983, ANH: '' }
    ];
    ums.demo.add({
        'pkg_nhansu_hoso_v2.LayDSNhanSu_HoSo_v2': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            var rows = NS.filter(function (r) { return !q || (r.HODEM + ' ' + r.TEN + ' ' + r.MASO).toLowerCase().indexOf(q) >= 0; });
            return { rows: rows, pager: rows.length };
        },
        'NS_HoSoV2/LayChiTiet': function (o) {
            var r = NS.filter(function (x) { return x.ID === o.strId; })[0] || NS[0];
            return [Object.assign({ TENGOIKHAC: '', GIOITINH_TEN: r.TEN === 'Mai' ? 'Nữ' : 'Nam', NOISINH_XA_TEN: 'Xã Dịch Vọng', NOISINH_HUYEN_TEN: 'Quận Cầu Giấy',
                NOISINH_TINH_TEN: 'TP Hà Nội', QUEQUAN_XA_TEN: 'Xã Quang Hưng', QUEQUAN_HUYEN_TEN: 'Huyện Phù Cừ', QUEQUAN_TINH_TEN: 'Tỉnh Hưng Yên' }, r)];
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#CCB.BCTK': [
            dm('BC1', 'LyLich2C_Word', 'Lý lịch 2C (Word)', 'fa fa-file-word-o', 'Modules/NhanSu/LyLich2C.aspx'),
            dm('BC2', 'LyLich2C_Pdf', 'Lý lịch 2C (PDF)', 'fa fa-file-pdf-o', 'Modules/NhanSu/LyLich2C.aspx')
        ]
    });
})();
