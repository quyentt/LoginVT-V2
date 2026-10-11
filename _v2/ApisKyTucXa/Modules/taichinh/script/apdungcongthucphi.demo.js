/* Dữ liệu mẫu cho taichinh/apdungcongthucphi — chỉ dùng ở chế độ dựng thử. */
(function () {
    var CT = [
        { ID: 'CTP1', PHAMVIAPDUNG_ID: 'KH1', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', XAUCONGTHUC: '[DONGIAPHONG]*[SONGAY]/30', NGHIEPVUAPDUNG_ID: 'NV1', NGAYAPDUNG: '01/09/2025', DKETHUA: 0 },
        { ID: 'CTP2', PHAMVIAPDUNG_ID: 'KH1', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', XAUCONGTHUC: '[DONGIAPHONG]', NGHIEPVUAPDUNG_ID: 'NV1', NGAYAPDUNG: '01/01/2026', DKETHUA: 0 },
        { ID: 'CTP3', PHAMVIAPDUNG_ID: 'KH2', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', XAUCONGTHUC: '[CHISODIEN]*[DONGIADIEN]', NGHIEPVUAPDUNG_ID: 'NV2', NGAYAPDUNG: '01/09/2025', DKETHUA: 1 }
    ];
    var seq = 10, fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.NVAP'] = [{ ID: 'NV1', MA: 'PHONG', TEN: 'Tính phí phòng ở' }, { ID: 'NV2', MA: 'DIENNUOC', TEN: 'Tính phí điện - nước' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.KHOADAOTAO'] = [{ ID: 'KH1', MA: 'K67', TEN: 'Khóa 67' }, { ID: 'KH2', MA: 'K68', TEN: 'Khóa 68' }, { ID: 'KH3', MA: 'K69', TEN: 'Khóa 69' }];
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'HK1 2025-2026' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'HK2 2025-2026' }, { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'HK1 2026-2027' }];
    fx['KTX_CongThucTinhPhi/LayDSThoiGian_CongThucTinhPhi'] = function (o) {
        var all = [{ ID: 'TG1', THOIGIAN: 'HK1 2025-2026' }, { ID: 'TG2', THOIGIAN: 'HK2 2025-2026' }];
        return all.filter(function (t) { return !o.strDaoTao_ThoiGianDaoTao_Id || t.ID === o.strDaoTao_ThoiGianDaoTao_Id; });
    };
    fx['KTX_CongThucTinhPhi/LayDanhSach'] = function (o) {
        return CT.filter(function (r) { return (!o.strNghiepVuApDung_Id || r.NGHIEPVUAPDUNG_ID === o.strNghiepVuApDung_Id) && (!o.strDaoTao_ThoiGianDaoTao_Id || r.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id); });
    };
    function luu(o) {
        var r = o.strId ? CT.filter(function (x) { return x.ID === o.strId; })[0] : null;
        if (!r) { r = { ID: 'CTP' + (seq++) }; CT.push(r); }
        r.PHAMVIAPDUNG_ID = o.strPhamViApDung_Id; r.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; r.XAUCONGTHUC = o.strXauCongThuc;
        r.NGHIEPVUAPDUNG_ID = o.strNghiepVuApDung_Id; r.NGAYAPDUNG = o.strNgayApDung; r.DKETHUA = o.dKeThua;
        return { rows: [], raw: { Id: r.ID } };
    }
    fx['KTX_CongThucTinhPhi/ThemMoi'] = luu;
    fx['KTX_CongThucTinhPhi/CapNhat'] = luu;
    fx['KTX_CongThucTinhPhi/Xoa'] = function (o) { CT = CT.filter(function (x) { return x.ID !== o.strIds; }); return []; };
    fx['KTX_TuKhoa/LayDanhSach'] = [
        { ID: 'TK1', TUKHOA: '[DONGIAPHONG]', MOTA: 'Đơn giá phòng ở theo tháng' }, { ID: 'TK2', TUKHOA: '[SONGAY]', MOTA: 'Số ngày ở trong tháng' },
        { ID: 'TK3', TUKHOA: '[CHISODIEN]', MOTA: 'Số điện tiêu thụ trong tháng' }, { ID: 'TK4', TUKHOA: '[DONGIADIEN]', MOTA: 'Đơn giá điện theo bậc lũy kế' }
    ];
    ums.demo.add(fx);
})();
