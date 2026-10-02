/* Dữ liệu mẫu cho xacnhankekhai/phieudanhgia* (khung _pdg_chung.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var D = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#', fx = {};
    var TT = [
        { ID: 'XN0', MA: 'XNKKCHUAKHAI', TEN: 'Chưa kê khai', THONGTIN1: 'fa fa-circle-o', THONGTIN2: 'color:#999' },
        { ID: 'XN1', MA: 'XNKKDONGY', TEN: 'Đồng ý', THONGTIN1: 'fa fa-check-circle', THONGTIN2: 'color:#16a34a' },
        { ID: 'XN2', MA: 'XNKKBOSUNG', TEN: 'Yêu cầu bổ sung', THONGTIN1: 'fa fa-exclamation-circle', THONGTIN2: 'color:#d97706' },
        { ID: 'XN3', MA: 'XNKKTUCHOI', TEN: 'Không đồng ý', THONGTIN1: 'fa fa-times-circle', THONGTIN2: 'color:#dc2626' }
    ];
    fx[D + 'NCKH.XNKK'] = TT;
    fx['NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung'] = TT;
    fx[D + 'CCB.VTSK'] = [{ ID: 'VT1', MA: 'CN', TEN: 'Chủ nhiệm' }, { ID: 'VT2', MA: 'TV', TEN: 'Thành viên' }];
    var NS = [{ ID: 'HS1', HOTEN: 'Nguyễn Văn An', MASO: 'GV001', DV: 'CC1' }, { ID: 'HS2', HOTEN: 'Trần Thị Bình', MASO: 'GV002', DV: 'CC1' },
        { ID: 'HS3', HOTEN: 'Lê Minh Châu', MASO: 'CB015', DV: 'CC3' }, { ID: 'HS4', HOTEN: 'Phạm Quốc Dũng', MASO: 'CB022', DV: 'CC3' }];
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        return NS.filter(function (x) { return !o.strDaoTao_CoCauToChuc_Id || x.DV === o.strDaoTao_CoCauToChuc_Id; });
    };
    function dong(i, ht, ms, dv, d) {
        var x = { ID: 'TD' + i, NHANSU_HOSOCANBO_ID: 'HS' + i, NHANSU_HOSOCANBO_HOTEN: ht, NHANSU_HOSOCANBO_MASO: ms, DV: dv };
        Object.keys(d).forEach(function (k) { x[k] = d[k]; });
        return x;
    }
    var GV = [
        dong(1, 'Nguyễn Văn An', 'GV001', 'CC1', { SOGIOCHUAN: 280, SOGIOMIENGIAM: 30, SOGIODINHMUCGIANGDAYNCKH: 250, SOGIONCKHCHUAN: 150, SOGIONCKHMIEN: 0,
            SOGIODH: 310, SOGIOSDH: 45, DIEMVIETSACH: 20, DIEMHOINGHIHOITHAO: 6, GIOCHUAN_DETAI: 60, DIEMDETAI: 35, GIOCHUAN_TAPCHIQUOCGIA: 20,
            DIEMBAIBAOTRONGNUOC: 15, GIOCHUAN_TAPCHIQUOCTE: 45, DIEMBAIBAOQUOCTE: 40, DIEMTHANHTICHDOTXUAT: 0, DIEMVANBANGSANGCHE: 0, SOGIOCOITHI: 360,
            SOGIOCHUANCOITHI: 24, DIEMCOITHI: 5, DIEMCONGDOAN: 5, DIEMHOP: 4, TONGDIEM: 86, XEPLOAI: 'A', KETQUAXACNHAN_TEN: 'Đồng ý',
            KETQUAXACNHAN_THONGTIN1: 'fa fa-check-circle', KETQUAXACNHAN_THONGTIN2: 'color:#16a34a', KETQUAXACNHAN_NOIDUNG: 'Đủ minh chứng' }),
        dong(2, 'Trần Thị Bình', 'GV002', 'CC1', { SOGIOCHUAN: 280, SOGIOMIENGIAM: 0, SOGIODINHMUCGIANGDAYNCKH: 280, SOGIONCKHCHUAN: 150, SOGIODH: 265,
            SOGIOSDH: 0, DIEMVIETSACH: 0, GIOCHUAN_DETAI: 30, DIEMDETAI: 18, GIOCHUAN_TAPCHIQUOCGIA: 40, DIEMBAIBAOTRONGNUOC: 25, SOGIOCOITHI: 240,
            SOGIOCHUANCOITHI: 16, DIEMCOITHI: 4, DIEMCONGDOAN: 5, DIEMHOP: 5, TONGDIEM: 72, XEPLOAI: 'B' })
    ];
    var CB = [
        dong(3, 'Lê Minh Châu', 'CB015', 'CC3', { NHOM: 'Nhóm 1', NHOMNCKH: 'Nhóm A', DIEMCHUYENMON_TC1: 48, DIEMCHUYENMON_TC2: 10, DIEMCHUYENMON_TC3: 9,
            DIEMCHUYENMON_TC4: 5, DIEMCHUYENMON_TC5: 5, DIEMCHUYENMON_TC6: 4, DIEMCHUYENMON_TC7: 5, DIEMVIETSACH: 0, GIOCHUAN_DETAI: 20, DIEMDETAI: 12,
            SOGIOCOITHI: 120, SOGIOCHUANCOITHI: 8, DIEMCOITHI: 2, DIEMCONGDOAN: 5, DIEMHOP: 4, TONGDIEM: 91, XEPLOAI: 'A' }),
        dong(4, 'Phạm Quốc Dũng', 'CB022', 'CC3', { NHOM: 'Nhóm 2', NHOMNCKH: '', DIEMCHUYENMON_TC1: 40, DIEMCHUYENMON_TC2: 8, DIEMCHUYENMON_TC3: 10,
            DIEMCHUYENMON_TC4: 5, DIEMCHUYENMON_TC5: 4, DIEMCHUYENMON_TC6: 5, DIEMCHUYENMON_TC7: 5, DIEMCONGDOAN: 4, DIEMHOP: 5, TONGDIEM: 77, XEPLOAI: 'B' })
    ];
    function loc(ds) {
        return function (o) {
            return ds.filter(function (x) {
                return (!o.strDaoTao_CoCauToChuc_Id || x.DV === o.strDaoTao_CoCauToChuc_Id) && (!o.strThanhVien_Id || x.NHANSU_HOSOCANBO_ID === o.strThanhVien_Id);
            });
        };
    }
    function chiTiet(ds) {
        return function (o) {
            var x = ds.filter(function (r) { return r.NHANSU_HOSOCANBO_ID === o.strNhanSu_HoSoCanBo_Id; })[0];
            if (!x) return [];
            var d = {};
            Object.keys(x).forEach(function (k) { d[k] = x[k]; });
            d.YK_SOGIOCHUAN = 'Đã đối chiếu thời khoá biểu'; d.YK_DIEMDETAI = 'Đề nghị bổ sung biên bản nghiệm thu';
            d.YK_SOGIOGIANGDAYDAIHOC = 'Khớp số liệu phòng Đào tạo';
            d.TENSANGKIENCAITIEN = 'Số hoá quy trình chấm thi'; d.NGAYTHANGNAMSANGKIEN = '15/05/2026'; d.SOQUYETDINHSANGKIEN = '321/QĐ-ĐHHN'; d.VAITROSANGKIEN_ID = 'VT1';
            return [d];
        };
    }
    fx['NS_TDKT_GiangVien/LayDanhSach'] = loc(GV); fx['NS_TDKT_GiangVien/LayChiTiet'] = chiTiet(GV);
    fx['NS_TDKT_CanBo/LayDanhSach'] = loc(CB); fx['NS_TDKT_CanBo/LayChiTiet'] = chiTiet(CB);
    var XN = { TD1: [{ ID: 'L1', TINHTRANG_TEN: 'Đồng ý', NOIDUNG: 'Đủ minh chứng', NGUOIXACNHAN_TENDAYDU: 'Hoàng Thu Hà', NGAYTAO_DD_MM_YYYY: '20/09/2026' }] };
    fx['NCKH_SP_XacNhanKeKhai/LayDanhSach'] = function (o) { return XN[o.strSanPham_Id] || []; };
    fx['NCKH_SP_XacNhanKeKhai/ThemMoi'] = function (o) {
        var t = TT.filter(function (x) { return x.ID === o.strTinhTrang_Id; })[0] || {};
        (XN[o.strSanPham_Id] = XN[o.strSanPham_Id] || []).unshift({ ID: 'L' + Date.now(), TINHTRANG_TEN: t.TEN, NOIDUNG: o.strNoiDung,
            NGUOIXACNHAN_TENDAYDU: 'Quản trị NCKH', NGAYTAO_DD_MM_YYYY: '27/09/2026' });
        GV.concat(CB).forEach(function (r) {
            if (r.ID !== o.strSanPham_Id) return;
            r.KETQUAXACNHAN_TEN = t.TEN; r.KETQUAXACNHAN_THONGTIN1 = t.THONGTIN1; r.KETQUAXACNHAN_THONGTIN2 = t.THONGTIN2; r.KETQUAXACNHAN_NOIDUNG = o.strNoiDung;
        });
        return [];
    };
    ums.demo.add(fx);
})();
