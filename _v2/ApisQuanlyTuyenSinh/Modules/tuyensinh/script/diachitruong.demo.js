/* Dữ liệu mẫu cho Địa chỉ trường — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[DM + 'TUYENSINH.TRUONGHOC'] = [dm('TH1', 'THPT01', 'THPT Chu Văn An'), dm('TH2', 'THPT02', 'THPT Kim Liên'),
        dm('TH3', 'THPT03', 'THPT Phan Đình Phùng'), dm('TH4', 'THPT04', 'THPT Huỳnh Thúc Kháng')];
    fx[DM + 'CHUN.DMTT'] = [
        { ID: 'T01', TEN: 'Thành phố Hà Nội', QUANHECHA_ID: null }, { ID: 'T02', TEN: 'Tỉnh Nghệ An', QUANHECHA_ID: null },
        { ID: 'H0101', TEN: 'Quận Ba Đình', QUANHECHA_ID: 'T01' }, { ID: 'H0102', TEN: 'Quận Đống Đa', QUANHECHA_ID: 'T01' },
        { ID: 'H0201', TEN: 'Thành phố Vinh', QUANHECHA_ID: 'T02' },
        { ID: 'X010101', TEN: 'Phường Thụy Khuê', QUANHECHA_ID: 'H0101' }, { ID: 'X010201', TEN: 'Phường Láng Hạ', QUANHECHA_ID: 'H0102' },
        { ID: 'X020101', TEN: 'Phường Hưng Dũng', QUANHECHA_ID: 'H0201' }
    ];
    ums.demo.add(fx);
    ums.demo.crudStore('TS_Truong_DiaChi', [
        { ID: 'DCT1', TRUONG_ID: 'TH1', TRUONG_TEN: 'THPT Chu Văn An', TINHTHANH_ID: 'T01', TINHTHANH_TEN: 'Thành phố Hà Nội',
          QUANHUYEN_ID: 'H0101', QUANHUYEN_TEN: 'Quận Ba Đình', PHUONGXA_ID: 'X010101', PHUONGXA_TEN: 'Phường Thụy Khuê', DIACHI: '10 Thụy Khuê' },
        { ID: 'DCT2', TRUONG_ID: 'TH2', TRUONG_TEN: 'THPT Kim Liên', TINHTHANH_ID: 'T01', TINHTHANH_TEN: 'Thành phố Hà Nội',
          QUANHUYEN_ID: 'H0102', QUANHUYEN_TEN: 'Quận Đống Đa', PHUONGXA_ID: '', PHUONGXA_TEN: '', DIACHI: '1 Tôn Thất Tùng' },
        { ID: 'DCT3', TRUONG_ID: 'TH4', TRUONG_TEN: 'THPT Huỳnh Thúc Kháng', TINHTHANH_ID: 'T02', TINHTHANH_TEN: 'Tỉnh Nghệ An',
          QUANHUYEN_ID: 'H0201', QUANHUYEN_TEN: 'Thành phố Vinh', PHUONGXA_ID: 'X020101', PHUONGXA_TEN: 'Phường Hưng Dũng', DIACHI: '62 Lê Hồng Phong' },
        { ID: 'DCT4', TRUONG_ID: 'TH3', TRUONG_TEN: 'THPT Phan Đình Phùng', TINHTHANH_ID: '', TINHTHANH_TEN: '', QUANHUYEN_ID: '',
          QUANHUYEN_TEN: '', PHUONGXA_ID: '', PHUONGXA_TEN: '', DIACHI: '' }
    ], {
        list: function (rows, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return rows.filter(function (r) { return !q || (r.TRUONG_TEN + ' ' + r.DIACHI).toLowerCase().indexOf(q) >= 0; });
        },
        map: function (o) { return { TINHTHANH_ID: o.strTinhThanh_Id, QUANHUYEN_ID: o.strQuanHuyen_Id, PHUONGXA_ID: o.strPhuongXa_Id, DIACHI: o.strDiaChi }; }
    });
})();
