/* Dữ liệu mẫu chung hai màn Lập kế hoạch / Kế hoạch chi tiết — chỉ dùng ở chế độ dựng thử. Tệp riêng từng màn bổ sung phần của màn đó. */
(function () {
    var D = ums.tkggKHDemo = ums.tkggKHDemo || {};
    var seq = 100;
    D.moi = function (p) { return p + (seq++); };
    D.TG = [{ ID: 'TG1', THOIGIAN: 'Năm học 2025-2026', MA: '2025_2026' }, { ID: 'TG2', THOIGIAN: 'Học kỳ 1 2025-2026', MA: '2025_2026_1' }, { ID: 'TG3', THOIGIAN: 'Học kỳ 2 2024-2025', MA: '2024_2025_2' }];
    D.TGDT = [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: 'Năm học 2025-2026' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 2025-2026' }, { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 2024-2025' }];
    function tgTen(id) { return (D.TG.filter(function (t) { return t.ID === id; })[0] || {}).THOIGIAN || ''; }
    D.tgTen = tgTen;
    D.PL = [{ ID: 'PL1', MA: 'GIANGDAY', TEN: 'Giảng dạy' }, { ID: 'PL2', MA: 'COITHI', TEN: 'Coi thi' }, { ID: 'PL3', MA: 'CHAMTHI', TEN: 'Chấm thi' }];
    D.CHEDO = [{ ID: 'CD1', MA: 'CHUNG', TEN: 'Chế độ chung' }, { ID: 'CD2', MA: 'RIENG', TEN: 'Chế độ riêng theo kế hoạch' }];
    D.PVXN = [{ ID: 'PV1', MA: 'LOPHP', TEN: 'Lớp học phần' }, { ID: 'PV2', MA: 'COITHI', TEN: 'Coi thi' }, { ID: 'PV3', MA: 'KHAC', TEN: 'Phạm vi khác' }];
    D.LOAI = { PV1: [{ ID: 'L1', MA: 'LT', TEN: 'Lý thuyết' }, { ID: 'L2', MA: 'TH', TEN: 'Thực hành' }], PV2: [{ ID: 'L3', MA: 'CT1', TEN: 'Coi thi giấy' }, { ID: 'L4', MA: 'CT2', TEN: 'Coi thi máy' }], PV3: [{ ID: 'L5', MA: 'HD', TEN: 'Hướng dẫn' }] };
    D.loaiTen = function (id) { var t = ''; Object.keys(D.LOAI).forEach(function (k) { D.LOAI[k].forEach(function (x) { if (x.ID === id) t = x.TEN; }); }); return t; };

    /* Kế hoạch tổng hợp */
    D.KH = [
        { ID: 'KH1', MA: 'KH2526', TEN: 'Tổng hợp giờ giảng năm học 2025-2026', MOTA: 'Kế hoạch chính thức', DAOTAO_THOIGIANDAOTAO_ID: 'TG1', THOIGIAN: tgTen('TG1'), HIEULUC: 1 },
        { ID: 'KH2', MA: 'KH2425', TEN: 'Tổng hợp giờ giảng học kỳ 2 2024-2025', MOTA: '', DAOTAO_THOIGIANDAOTAO_ID: 'TG3', THOIGIAN: tgTen('TG3'), HIEULUC: 0 }
    ];
    /* Kế hoạch chi tiết */
    D.KHCT = [
        { ID: 'CT1', TEN: 'Giảng dạy HK1 2025-2026', MOTA: 'Khối lượng giảng dạy lớp học phần', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Giảng dạy', KLGD_KHCHITIET_KEYTHUA_ID: '', KLGD_KHCHITIET_KEYTHUA_TEN: '',
          CHEDOAPDUNG_ID: 'CD1', CHEDOAPDUNG_TEN: 'Chế độ chung', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', THOIGIAN: tgTen('TG2'), TUNGAY: '01/09/2025', DENNGAY: '31/01/2026',
          NGUOITAO_TAIKHOAN: 'admin', NGAYTAO_DD_MM_YYYY: '20/08/2025', KLGD_TONGHOPKHOILUONG_ID: 'KH1', KLGD_TONGHOPKHOILUONG_TEN: 'Tổng hợp giờ giảng năm học 2025-2026', HIENTHICONGGIANVIEN: 1 },
        { ID: 'CT2', TEN: 'Coi thi HK1 2025-2026', MOTA: '', PHANLOAI_ID: 'PL2', PHANLOAI_TEN: 'Coi thi', KLGD_KHCHITIET_KEYTHUA_ID: 'CT1', KLGD_KHCHITIET_KEYTHUA_TEN: 'Giảng dạy HK1 2025-2026',
          CHEDOAPDUNG_ID: 'CD2', CHEDOAPDUNG_TEN: 'Chế độ riêng theo kế hoạch', DAOTAO_THOIGIANDAOTAO_ID: 'TG2', THOIGIAN: tgTen('TG2'), TUNGAY: '05/01/2026', DENNGAY: '31/01/2026',
          NGUOITAO_TAIKHOAN: 'admin', NGAYTAO_DD_MM_YYYY: '15/12/2025', KLGD_TONGHOPKHOILUONG_ID: 'KH1', KLGD_TONGHOPKHOILUONG_TEN: 'Tổng hợp giờ giảng năm học 2025-2026', HIENTHICONGGIANVIEN: 0 },
        { ID: 'CT3', TEN: 'Giảng dạy HK2 2024-2025', MOTA: '', PHANLOAI_ID: 'PL1', PHANLOAI_TEN: 'Giảng dạy', KLGD_KHCHITIET_KEYTHUA_ID: '', KLGD_KHCHITIET_KEYTHUA_TEN: '',
          CHEDOAPDUNG_ID: 'CD1', CHEDOAPDUNG_TEN: 'Chế độ chung', DAOTAO_THOIGIANDAOTAO_ID: 'TG3', THOIGIAN: tgTen('TG3'), TUNGAY: '10/02/2025', DENNGAY: '30/06/2025',
          NGUOITAO_TAIKHOAN: 'ptdt', NGAYTAO_DD_MM_YYYY: '01/02/2025', KLGD_TONGHOPKHOILUONG_ID: 'KH2', KLGD_TONGHOPKHOILUONG_TEN: 'Tổng hợp giờ giảng học kỳ 2 2024-2025', HIENTHICONGGIANVIEN: 1 }
    ];
    /* Người dùng / cán bộ */
    D.ND = [
        { ID: 'ND1', MASO: 'GV001', HODEM: 'Nguyễn Văn', TEN: 'An', TENDAYDU: 'Nguyễn Văn An', TAIKHOAN: 'annv', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '', DONVI_TEN: 'Khoa Công nghệ thông tin' },
        { ID: 'ND2', MASO: 'GV002', HODEM: 'Trần Thị', TEN: 'Bình', TENDAYDU: 'Trần Thị Bình', TAIKHOAN: 'binhtt', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '', DONVI_TEN: 'Khoa Kinh tế' },
        { ID: 'ND3', MASO: 'GV003', HODEM: 'Lê Minh', TEN: 'Châu', TENDAYDU: 'Lê Minh Châu', TAIKHOAN: 'chaulm', GIOITINH_TEN: 'Nam', HINHDAIDIEN: '', DONVI_TEN: 'Khoa Công nghệ thông tin' },
        { ID: 'ND4', MASO: 'CB010', HODEM: 'Phạm Thu', TEN: 'Dung', TENDAYDU: 'Phạm Thu Dung', TAIKHOAN: 'dungpt', GIOITINH_TEN: 'Nữ', HINHDAIDIEN: '', DONVI_TEN: 'Phòng Đào tạo' }
    ];
    /* Nhân sự tham gia của kế hoạch chi tiết */
    D.KHCT_NS = { CT1: [nsDong('N1', 'ND1'), nsDong('N2', 'ND3')], CT2: [nsDong('N3', 'ND4')], CT3: [] };
    function nsDong(id, ndId) { var n = D.ND.filter(function (x) { return x.ID === ndId; })[0]; return { ID: id, NGUOIDUNG_ID: n.ID, NGUOIDUNG_MASO: n.MASO, NGUOIDUNG_HODEM: n.HODEM, NGUOIDUNG_TEN: n.TEN, DONVI_TEN: n.DONVI_TEN }; }
    D.nsDong = nsDong;

    function like(rows, q, keys) { q = (q || '').toLowerCase(); if (!q) return rows.slice(); return rows.filter(function (r) { return keys.some(function (k) { return String(r[k] || '').toLowerCase().indexOf(q) >= 0; }); }); }
    D.like = like;
    ums.demo.add({
        'TKGG_KeHoach/LayDSThoiGianTongHopKL': D.TG,
        'TKGG_KeHoach/LayDSPhanLoai': D.PL,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.CHEDO': D.CHEDO,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KLGD.PHANLOAIXACNHAN': D.PVXN,
        'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong': function (o) { return D.LOAI[o.strLoaiXacNhan_Id] || []; },
        'TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong': function (o) {
            return like(D.KH, o.strTuKhoa, ['TEN', 'MOTA']).filter(function (r) { return !o.strDaoTao_ThoiGianDaoTao_Id || r.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id; });
        },
        'TKGG_KeHoach/Them_KLGD_TongHopKhoiLuong': function (o) {
            var id = D.moi('KH');
            D.KH.push({ ID: id, MA: id, TEN: o.strTen, MOTA: o.strMoTa, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id, THOIGIAN: tgTen(o.strDaoTao_ThoiGianDaoTao_Id), HIEULUC: Number(o.dHieuLuc) });
            return { rows: [], raw: { Id: id } };
        },
        'TKGG_KeHoach/Sua_KLGD_TongHopKhoiLuong': function (o) {
            D.KH.forEach(function (r) { if (r.ID === o.strId) { r.TEN = o.strTen; r.MOTA = o.strMoTa; r.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; r.THOIGIAN = tgTen(o.strDaoTao_ThoiGianDaoTao_Id); r.HIEULUC = Number(o.dHieuLuc); } });
            return [];
        },
        'TKGG_KeHoach/Xoa_KLGD_TongHopKhoiLuong': function (o) { for (var i = D.KH.length - 1; i >= 0; i--) if (D.KH[i].ID === o.strIds) D.KH.splice(i, 1); return []; },
        'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet': function (o) {
            return like(D.KHCT, o.strTuKhoa, ['TEN', 'MOTA']).filter(function (r) {
                return (!o.strDaoTao_ThoiGianDaoTao_Id || r.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id) &&
                    (!o.strKLGD_TongHopKhoiLuong_Id || r.KLGD_TONGHOPKHOILUONG_ID === o.strKLGD_TongHopKhoiLuong_Id) &&
                    (!o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id);
            });
        },
        'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet_NS': function (o) { return (D.KHCT_NS[o.strKLGD_KeHoachChiTiet_Id] || []).slice(); },
        'TKGG_KeHoach/LayDSGiangVienTongHopKL': function (o) { return o.strKLGD_TongHopKhoiLuong_Id === 'KH2' ? [D.ND[2]] : D.ND.slice(0, 3); },
        'TKGG_KeHoach/LayDSNhanSuTongHopKL': function (o) { return o.strKLGD_TongHopKhoiLuong_Id === 'KH2' ? [] : [D.ND[0], D.ND[3]]; },
        'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung': function (o) { var rows = like(D.ND, o.strTuKhoa, ['TAIKHOAN', 'TENDAYDU']); return { rows: rows, pager: rows.length }; }
    });
})();
