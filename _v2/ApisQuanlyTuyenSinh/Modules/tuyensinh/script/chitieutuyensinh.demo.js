/* Dữ liệu mẫu cho Kế hoạch chỉ tiêu — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var rows = [
        { ID: 'CT1', KH: 'KHCT26', NGANH_TEN: 'Kỹ thuật phần mềm', NGANH_MA: '6480202', TRINHDO_TEN: 'Cao đẳng', KHOAQUANLY_TEN: 'Khoa Công nghệ thông tin',
          QUYMOTUYENSINH: 120, PHANTRAMVUOT: 10, QUYMOTUYENSINH_VUOT: 132, SOTRUNGTUYEN: 118, SONHAPHOC: 104,
          CHOTIEUCONSOVOITRUNGTUYEN: 14, CHITIEUCONSOVOINHAPHOC: 28, VUOTCHITIEUSOVOITRUNGTUYEN: 0, VUOTCHITIEUSOVOINHAPHOC: 0 },
        { ID: 'CT2', KH: 'KHCT26', NGANH_TEN: 'Quản trị kinh doanh', NGANH_MA: '6340404', TRINHDO_TEN: 'Cao đẳng', KHOAQUANLY_TEN: 'Khoa Kinh tế',
          QUYMOTUYENSINH: 80, PHANTRAMVUOT: 10, QUYMOTUYENSINH_VUOT: 88, SOTRUNGTUYEN: 95, SONHAPHOC: 86,
          CHOTIEUCONSOVOITRUNGTUYEN: 0, CHITIEUCONSOVOINHAPHOC: 2, VUOTCHITIEUSOVOITRUNGTUYEN: 7, VUOTCHITIEUSOVOINHAPHOC: 0 },
        { ID: 'CT3', KH: 'KHCT26', NGANH_TEN: 'Công nghệ ô tô', NGANH_MA: '6510216', TRINHDO_TEN: 'Trung cấp', KHOAQUANLY_TEN: 'Khoa Cơ khí động lực',
          QUYMOTUYENSINH: 60, PHANTRAMVUOT: 10, QUYMOTUYENSINH_VUOT: 66, SOTRUNGTUYEN: 41, SONHAPHOC: 37,
          CHOTIEUCONSOVOITRUNGTUYEN: 25, CHITIEUCONSOVOINHAPHOC: 29, VUOTCHITIEUSOVOITRUNGTUYEN: 0, VUOTCHITIEUSOVOINHAPHOC: 0 },
        { ID: 'CT4', KH: 'KHCT25', NGANH_TEN: 'Điện công nghiệp', NGANH_MA: '6520227', TRINHDO_TEN: 'Cao đẳng', KHOAQUANLY_TEN: 'Khoa Điện',
          QUYMOTUYENSINH: 70, PHANTRAMVUOT: 5, QUYMOTUYENSINH_VUOT: 74, SOTRUNGTUYEN: 70, SONHAPHOC: 69,
          CHOTIEUCONSOVOITRUNGTUYEN: 4, CHITIEUCONSOVOINHAPHOC: 5, VUOTCHITIEUSOVOITRUNGTUYEN: 0, VUOTCHITIEUSOVOINHAPHOC: 0 }
    ];
    ums.demo.add({
        'TS_KeHoachChiTieu/LayDanhSach': [{ ID: 'KHCT26', TEN: 'Chỉ tiêu tuyển sinh năm 2026' }, { ID: 'KHCT25', TEN: 'Chỉ tiêu tuyển sinh năm 2025' }]
    });
    ums.demo.crudStore('TS_ChiTieuTuyenSinh', rows, {
        list: function (ds, o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return ds.filter(function (r) {
                return (!o.strTS_KeHoachChiTieu_Id || r.KH === o.strTS_KeHoachChiTieu_Id) &&
                    (!q || (r.NGANH_TEN + ' ' + r.NGANH_MA).toLowerCase().indexOf(q) >= 0);
            });
        },
        map: function (o) { return { QUYMOTUYENSINH: Number(o.dQuyMoTuyenSinh) || 0, PHANTRAMVUOT: Number(o.dPhanTramVuot) || 0 }; }
    });
})();
