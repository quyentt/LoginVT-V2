/* Dữ liệu mẫu cho thuhocphi — chỉ dùng ở chế độ dựng thử.
   Người học mẫu: SV0001 — Lăng Văn Huy (25001029), DCOT.16.2.
   (Khoá theo func nên dùng chung được với _hocphi.demo.js; ở đây khai đủ để mở
   riêng màn này cũng có dữ liệu.) */
(function () {
    'use strict';
    var T = 'pkg_taichinh_thongtin.';
    var fx = {};

    fx['pkg_hosohocvien.LayThongTinChiTietHoSo'] = [{
        ID: 'SV0001', HODEM: 'Lăng Văn', TEN: 'Huy', MASO: '25001029',
        QLSV_NGUOIHOC_NGAYSINH: '12/04/2007', LOP: 'DCOT.16.2', NGANH: 'Công nghệ thông tin',
        MANGANH: '7480201', TTLL_DIENTHOAICANHAN: '0972 118 345',
        QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', QLSV_TRANGTHAINGUOIHOC_MA: 'NORMAL'
    }];

    fx[T + 'LayDSTinhTrangTaiChinh'] = function () {
        return {
            rsThongTin: [{
                NOCO: -1250000,
                TONGKHOANPHAINOP: 17350000, TONGKHOANDUOCMIEN: 1650000, TONGKHOANDANOP: 16100000,
                TONGKHOANDARUT: 300000, TONGNORIENG: 1250000, TONGNOCHUNG: 1250000,
                TONGDURIENG: 0, TONGDUCHUNG: 0,
                TONGTIENPHIEUTHU: 16100000, TONGTIENPHIEURUT: 300000, TONGTIENHOADON: 8250000
            }],
            rsKhoanDaNopChuaXuatHoaDon: []
        };
    };

    fx[T + 'LayDSKhoanNoChung'] = [
        { ID: 'N1', DAOTAO_THOIGIANDAOTAO: '2024-2025 - Học kỳ 2', DAOTAO_THOIGIANDAOTAO_DOT: '1',
          TAICHINH_CACKHOANTHU_TEN: 'Học phí', NOIDUNG: 'Học phí học kỳ 2 năm học 2024-2025',
          SOTIEN: 1200000, GHICHU: 'Đã bù trừ 355.000', NGAYTAO_DD_MM_YYYY: '18/02/2025',
          NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', MATHANHTOANDINHDANH: 'DHCN25001029HP' },
        { ID: 'N2', DAOTAO_THOIGIANDAOTAO: '2024-2025 - Học kỳ 2', DAOTAO_THOIGIANDAOTAO_DOT: '1',
          TAICHINH_CACKHOANTHU_TEN: 'Lệ phí', NOIDUNG: 'Lệ phí thư viện năm học 2024-2025',
          SOTIEN: 50000, GHICHU: '', NGAYTAO_DD_MM_YYYY: '10/02/2025',
          NGUOITAO_TENDAYDU: 'Hoàng Thu Trang', MATHANHTOANDINHDANH: 'DHCN25001029LP' }
    ];

    ums.demo.add(fx);
})();
