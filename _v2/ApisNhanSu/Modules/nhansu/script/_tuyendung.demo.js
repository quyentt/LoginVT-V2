/* Dữ liệu mẫu cho các màn tuyển dụng (NS_TD_*) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', P = 'pkg_ns_td_thongtin.', fx = {};
    function ok(id) { return { rows: [], raw: { Id: id || 'NEW' + Date.now() } }; }

    fx['pkg_ns_td_chung.LayDSNam_NS_TD'] = [{ ID: '2025', NAM: '2025' }, { ID: '2026', NAM: '2026' }];
    fx['pkg_ns_td_chung.LayDSNhanSu_MauHoSo'] = [
        { ID: 'MHS1', TEN: 'Mẫu hồ sơ giảng viên' }, { ID: 'MHS2', TEN: 'Mẫu hồ sơ chuyên viên' }
    ];
    fx[D + 'NS.TD.PHANLOAI'] = [{ ID: 'PL1', MA: 'GV', TEN: 'Tuyển giảng viên' }, { ID: 'PL2', MA: 'CV', TEN: 'Tuyển chuyên viên' }];
    fx[D + 'NS.TD.VAITRO'] = [{ ID: 'VT1', MA: 'CT', TEN: 'Chủ tịch' }, { ID: 'VT2', MA: 'TK', TEN: 'Thư ký' }, { ID: 'VT3', MA: 'UV', TEN: 'Ủy viên' }];
    fx[D + 'NS.TD.VITRICONGVIEC'] = [{ ID: 'VTCV1', MA: 'GV', TEN: 'Giảng viên' }, { ID: 'VTCV2', MA: 'CV', TEN: 'Chuyên viên' }, { ID: 'VTCV3', MA: 'KTV', TEN: 'Kỹ thuật viên' }];
    fx[D + 'NS.GITI'] = [{ ID: 'GT1', MA: 'NAM', TEN: 'Nam' }, { ID: 'GT2', MA: 'NU', TEN: 'Nữ' }];
    fx[D + 'NS.DATO'] = [{ ID: 'DT1', MA: 'KINH', TEN: 'Kinh' }, { ID: 'DT2', MA: 'TAY', TEN: 'Tày' }, { ID: 'DT3', MA: 'MUONG', TEN: 'Mường' }];

    var KH = [
        { ID: 'KH1', MA: 'KHTD-2026-01', TEN: 'Tuyển dụng giảng viên năm 2026', NAM: '2026', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Tuyển giảng viên',
          NHANSU_MAUHOSO_ID: 'MHS1', NHANSU_MAUHOSO_TEN: 'Mẫu hồ sơ giảng viên', MOTA: 'Bổ sung giảng viên các khoa kỹ thuật' },
        { ID: 'KH2', MA: 'KHTD-2026-02', TEN: 'Tuyển chuyên viên phòng ban 2026', NAM: '2026', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Tuyển chuyên viên',
          NHANSU_MAUHOSO_ID: 'MHS2', NHANSU_MAUHOSO_TEN: 'Mẫu hồ sơ chuyên viên', MOTA: 'Phòng Đào tạo, Phòng Tài chính' },
        { ID: 'KH3', MA: 'KHTD-2025-01', TEN: 'Tuyển dụng đợt bổ sung 2025', NAM: '2025', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Tuyển giảng viên',
          NHANSU_MAUHOSO_ID: 'MHS1', NHANSU_MAUHOSO_TEN: 'Mẫu hồ sơ giảng viên', MOTA: '' }
    ];
    fx[P + 'LayDSNS_TD_KeHoach'] = function (o) { return KH.filter(function (r) { return !o.strNam || r.NAM === o.strNam; }); };
    ['Them_NS_TD_KeHoach', 'Sua_NS_TD_KeHoach', 'Xoa_NS_TD_KeHoach'].forEach(function (k) { fx[P + k] = ok(); });

    var DOT = [
        { ID: 'DOT1', NS_TD_KEHOACH_ID: 'KH1', NS_TD_KEHOACH_TEN: 'Đợt 1 (03/2026)', TUNGAY: '01/03/2026', DENNGAY: '31/03/2026', MOTA: 'Đợt 1 — nhận hồ sơ tháng 3', TRANGTHAI_TEN: 'Đã duyệt' },
        { ID: 'DOT2', NS_TD_KEHOACH_ID: 'KH1', NS_TD_KEHOACH_TEN: 'Đợt 2 (06/2026)', TUNGAY: '01/06/2026', DENNGAY: '30/06/2026', MOTA: 'Đợt 2 — bổ sung', TRANGTHAI_TEN: 'Chờ duyệt' },
        { ID: 'DOT3', NS_TD_KEHOACH_ID: 'KH2', NS_TD_KEHOACH_TEN: 'Đợt 1 (04/2026)', TUNGAY: '10/04/2026', DENNGAY: '10/05/2026', MOTA: 'Đợt duy nhất', TRANGTHAI_TEN: 'Chờ duyệt' }
    ];
    fx[P + 'LayDSNS_TD_KeHoach_Dot'] = function (o) { return DOT.filter(function (r) { return !o.strNS_TD_KeHoach_Id || r.NS_TD_KEHOACH_ID === o.strNS_TD_KeHoach_Id; }); };
    ['Them_NS_TD_KeHoach_Dot', 'Sua_NS_TD_KeHoach_Dot', 'Xoa_NS_TD_KeHoach_Dot'].forEach(function (k) { fx[P + k] = ok(); });

    var DX = [
        { ID: 'DX1', KH: 'KH1', DOT: 'DOT1', DONVIDEXUAT_ID: 'DV1', DONVIDEXUAT_TEN: 'Khoa Công nghệ thông tin', NGUOIDEXUAT_TAIKHOAN: 'nguyenvana',
          VITRICONGVIECDEXUAT_ID: 'VTCV1', VITRICONGVIECDEXUAT_TEN: 'Giảng viên', SOLUONGDEXUAT: 3, MOTA: 'Ưu tiên tiến sĩ', TRANGTHAI_TEN: 'Đã duyệt' },
        { ID: 'DX2', KH: 'KH1', DOT: 'DOT1', DONVIDEXUAT_ID: 'DV2', DONVIDEXUAT_TEN: 'Khoa Cơ khí', NGUOIDEXUAT_TAIKHOAN: 'tranthib',
          VITRICONGVIECDEXUAT_ID: 'VTCV3', VITRICONGVIECDEXUAT_TEN: 'Kỹ thuật viên', SOLUONGDEXUAT: 1, MOTA: 'Phòng thí nghiệm', TRANGTHAI_TEN: 'Chờ duyệt' },
        { ID: 'DX3', KH: 'KH2', DOT: 'DOT3', DONVIDEXUAT_ID: 'DV3', DONVIDEXUAT_TEN: 'Phòng Đào tạo', NGUOIDEXUAT_TAIKHOAN: 'lethic',
          VITRICONGVIECDEXUAT_ID: 'VTCV2', VITRICONGVIECDEXUAT_TEN: 'Chuyên viên', SOLUONGDEXUAT: 2, MOTA: '', TRANGTHAI_TEN: 'Chờ duyệt' }
    ];
    fx[P + 'LayDSNS_TD_KeHoach_DeXuat'] = function (o) {
        return DX.filter(function (r) {
            return (!o.strNS_TD_KeHoach_Id || r.KH === o.strNS_TD_KeHoach_Id) && (!o.strNS_TD_KeHoach_Dot_Id || r.DOT === o.strNS_TD_KeHoach_Dot_Id);
        });
    };
    ['Them_NS_TD_KeHoach_DeXuat', 'Sua_NS_TD_KeHoach_DeXuat', 'Xoa_NS_TD_KeHoach_DeXuat'].forEach(function (k) { fx[P + k] = ok(); });

    var HS = [
        { ID: 'HS1', DX: 'DX1', MAHOSO: 'HS26-0001', HODEM: 'Phạm Minh', TEN: 'Đức', VITRICONGVIECDEXUAT_TEN: 'Giảng viên', NGAYSINH: '12/05/1990',
          CCCD: '001090012345', CCCD_NGAYCAP: '10/08/2021', CCCD_NOICAP: 'Cục CSQLHC về TTXH', GIOITINH_ID: 'GT1', GIOITINH_TEN: 'Nam', DANTOC_ID: 'DT1', DANTOC_TEN: 'Kinh' },
        { ID: 'HS2', DX: 'DX1', MAHOSO: 'HS26-0002', HODEM: 'Nguyễn Thu', TEN: 'Hà', VITRICONGVIECDEXUAT_TEN: 'Giảng viên', NGAYSINH: '03/11/1992',
          CCCD: '001192054321', CCCD_NGAYCAP: '22/01/2022', CCCD_NOICAP: 'Cục CSQLHC về TTXH', GIOITINH_ID: 'GT2', GIOITINH_TEN: 'Nữ', DANTOC_ID: 'DT2', DANTOC_TEN: 'Tày' },
        { ID: 'HS3', DX: 'DX3', MAHOSO: 'HS26-0003', HODEM: 'Đỗ Văn', TEN: 'Long', VITRICONGVIECDEXUAT_TEN: 'Chuyên viên', NGAYSINH: '20/02/1995',
          CCCD: '036095011122', CCCD_NGAYCAP: '05/05/2021', CCCD_NOICAP: 'Cục CSQLHC về TTXH', GIOITINH_ID: 'GT1', GIOITINH_TEN: 'Nam', DANTOC_ID: 'DT1', DANTOC_TEN: 'Kinh' }
    ];
    fx[P + 'LayDSNS_TD_KeHoach_DeXuat_HS'] = function (o) { return HS.filter(function (r) { return !o.strNS_TD_KeHoach_DeXuat_Id || r.DX === o.strNS_TD_KeHoach_DeXuat_Id; }); };
    ['Them_NS_TD_KeHoach_DeXuat_HS', 'Sua_NS_TD_KeHoach_DeXuat_HS', 'Xoa_NS_TD_KeHoach_DeXuat_HS'].forEach(function (k) { fx[P + k] = ok(); });

    var HD = [
        { ID: 'HD1', DOT: 'DOT1', LOAIHOIDONG_TEN: 'Hội đồng xét tuyển', TENHOIDONG: 'Hội đồng xét tuyển giảng viên đợt 1', SOQD: '125/QĐ-ĐHKT', NGAYQD: '20/03/2026', MOTA: '' },
        { ID: 'HD2', DOT: 'DOT1', LOAIHOIDONG_TEN: 'Ban kiểm tra sát hạch', TENHOIDONG: 'Ban sát hạch chuyên môn', SOQD: '', NGAYQD: '', MOTA: 'Chưa có quyết định' }
    ];
    fx[P + 'LayDSNS_TD_KeHoach_HD'] = function (o) { return HD.filter(function (r) { return r.DOT === o.strNS_TD_KeHoach_Dot_Id; }); };
    ['Them_NS_TD_KeHoach_HD', 'Sua_NS_TD_KeHoach_HD', 'Xoa_NS_TD_KeHoach_HD'].forEach(function (k) { fx[P + k] = ok(); });

    var TV = [
        { ID: 'TV1', HD: 'HD1', THANHVIEN_ID: 'CB1', THANHVIEN_HODEM: 'Nguyễn Văn', THANHVIEN_TEN: 'An', THANHVIEN_MASO: 'CB0001', VAITRO_ID: 'VT1', VAITRO_TEN: 'Chủ tịch', MOTA: '' },
        { ID: 'TV2', HD: 'HD1', THANHVIEN_ID: 'CB2', THANHVIEN_HODEM: 'Trần Thị', THANHVIEN_TEN: 'Bình', THANHVIEN_MASO: 'CB0002', VAITRO_ID: 'VT2', VAITRO_TEN: 'Thư ký', MOTA: '' },
        { ID: 'TV3', HD: 'HD1', THANHVIEN_ID: 'CB3', THANHVIEN_HODEM: 'Lê Hoàng', THANHVIEN_TEN: 'Cường', THANHVIEN_MASO: 'CB0003', VAITRO_ID: 'VT3', VAITRO_TEN: 'Ủy viên', MOTA: 'Chuyên môn CNTT' }
    ];
    fx[P + 'LayDSNS_TD_KeHoach_HD_TV'] = function (o) { return TV.filter(function (r) { return r.HD === o.strNS_TD_KeHoach_HD_Id; }); };
    ['Them_NS_TD_KeHoach_HD_TV', 'Sua_NS_TD_KeHoach_HD_TV', 'Xoa_NS_TD_KeHoach_HD_TV'].forEach(function (k) { fx[P + k] = ok(); });

    var DV = [{ ID: 'DV1', MA: 'CNTT', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'DV2', MA: 'CK', TEN: 'Khoa Cơ khí' }, { ID: 'DV3', MA: 'PDT', TEN: 'Phòng Đào tạo' }];
    fx['NS_CoCauToChuc/LayDanhSach'] = DV;
    var CB = [
        { ID: 'CB1', MA: 'CB0001', HODEM: 'Nguyễn Văn', TEN: 'An', DV: 'DV1' }, { ID: 'CB2', MA: 'CB0002', HODEM: 'Trần Thị', TEN: 'Bình', DV: 'DV3' },
        { ID: 'CB3', MA: 'CB0003', HODEM: 'Lê Hoàng', TEN: 'Cường', DV: 'DV1' }, { ID: 'CB4', MA: 'CB0004', HODEM: 'Phạm Thu', TEN: 'Dung', DV: 'DV2' }
    ];
    fx['NS_HoSoV2/LayDanhSach'] = function (o) { return CB.filter(function (r) { return !o.strDaoTao_CoCauToChuc_Id || r.DV === o.strDaoTao_CoCauToChuc_Id; }); };

    ums.demo.add(fx);
})();
