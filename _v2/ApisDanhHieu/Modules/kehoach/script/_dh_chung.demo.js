/* Dữ liệu mẫu chung cho hai màn Kế hoạch xét danh hiệu / Thực hiện xét (_dh_chung.js — ums.dhKh). Chỉ dùng ở chế độ
   dựng thử. Học kỳ, hộp chọn sinh viên (PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc), học phần chưa hoàn thành lấy từ dữ liệu
   mẫu của Học bổng (_kh_chung.demo.js — nạp trước vì html nạp _kh_chung.js trước). Mã sinh viên / cán bộ là mã bịa.
   Kho giữ trạng thái trong phiên: thêm / sửa / xoá kế hoạch, cán bộ, phạm vi, tiêu chuẩn đều thấy ngay trên màn. */
(function () {
    function boDau(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
    function like(rows, q, cols) {
        q = boDau(q).trim();
        if (!q) return rows.slice();
        return rows.filter(function (r) { return cols.some(function (c) { return boDau(r[c]).indexOf(q) >= 0; }); });
    }
    function trang(rows, o) {
        var p = Number(o.pageIndex) || 1, s = Number(o.pageSize) || rows.length || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    }
    var dem = 0;
    function id(t) { return t + String(++dem + 100); }

    var LOAI = [
        { ID: 'LDH1', TEN: 'Danh hiệu sinh viên xuất sắc' },
        { ID: 'LDH2', TEN: 'Danh hiệu sinh viên giỏi' },
        { ID: 'LDH3', TEN: 'Danh hiệu sinh viên tiêu biểu' }
    ];
    var TG_TEN = { TG251: 'Học kỳ 1 - Năm học 2025-2026', TG252: 'Học kỳ 2 - Năm học 2025-2026', TG242: 'Học kỳ 2 - Năm học 2024-2025' };
    function tenLoai(i) { var l = LOAI.filter(function (x) { return x.ID === i; })[0]; return l ? l.TEN : ''; }
    var KH = [
        { ID: 'XLDH01', MA: 'DH-XS-2526-1', TEN: 'Xét danh hiệu sinh viên xuất sắc học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
          PHANLOAI_ID: 'LDH1', NGAYBATDAU: '05/02/2026', NGAYKETTHUC: '28/02/2026', MOTA: 'Xét theo quy chế 2025',
          DIEUKIENXET: 'Điểm TB học kỳ ≥ 3,6; rèn luyện ≥ 90', KETQUACHINHTHUC: 1 },
        { ID: 'XLDH02', MA: 'DH-G-2526-1', TEN: 'Xét danh hiệu sinh viên giỏi học kỳ 1 năm 2025-2026', DAOTAO_THOIGIANDAOTAO_ID: 'TG251',
          PHANLOAI_ID: 'LDH2', NGAYBATDAU: '05/02/2026', NGAYKETTHUC: '28/02/2026', MOTA: '',
          DIEUKIENXET: 'Điểm TB học kỳ ≥ 3,2; rèn luyện ≥ 80', KETQUACHINHTHUC: 0 },
        { ID: 'XLDH03', MA: 'DH-TB-2425-2', TEN: 'Xét danh hiệu sinh viên tiêu biểu năm học 2024-2025', DAOTAO_THOIGIANDAOTAO_ID: 'TG242',
          PHANLOAI_ID: 'LDH3', NGAYBATDAU: '01/08/2025', NGAYKETTHUC: '31/08/2025', MOTA: 'Toàn trường',
          DIEUKIENXET: 'Điểm TB tích luỹ ≥ 3,2; có thành tích', KETQUACHINHTHUC: 0 }
    ];
    function dayDu(k) { k.PHANLOAI_TEN = tenLoai(k.PHANLOAI_ID); k.DAOTAO_THOIGIANDAOTAO = TG_TEN[k.DAOTAO_THOIGIANDAOTAO_ID] || ''; return k; }
    KH.forEach(dayDu);

    var NS = {
        XLDH01: [['PC1', 'ND01', 'cb.lan', 'Nguyễn Thị Lan'], ['PC2', 'ND02', 'cb.minh', 'Trần Quang Minh']],
        XLDH02: [['PC3', 'ND03', 'cb.hoa', 'Lê Thu Hoà']],
        XLDH03: []
    };
    Object.keys(NS).forEach(function (k) {
        NS[k] = NS[k].map(function (x) { return { ID: x[0], NGUOIDUNG_ID: x[1], NGUOIDUNG_TAIKHOAN: x[2], NGUOIDUNG_TENDAYDU: x[3], NGUOICUOI_TENDAYDU: x[3] }; });
    });

    var SV = [
        ['NH01', 'SV24001', 'Nguyễn Văn', 'An', 'K24-CNTT1', 'L01', 'Công nghệ thông tin', 'CT01', 'Khóa 2024', 'Xuất sắc', 'Giỏi'],
        ['NH02', 'SV24017', 'Trần Thị', 'Bình', 'K24-CNTT1', 'L01', 'Công nghệ thông tin', 'CT01', 'Khóa 2024', 'Giỏi', ''],
        ['NH03', 'SV23045', 'Lê Hoàng', 'Cường', 'K23-QTKD2', 'L02', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023', 'Giỏi', ''],
        ['NH04', 'SV23058', 'Phạm Minh', 'Đức', 'K23-QTKD2', 'L02', 'Quản trị kinh doanh', 'CT02', 'Khóa 2023', 'Khá', ''],
        ['NH05', 'SV22110', 'Vũ Ngọc', 'Hà', 'K22-KT1', 'L03', 'Kế toán', 'CT03', 'Khóa 2022', 'Xuất sắc', 'Giỏi'],
        ['NH06', 'SV22131', 'Đỗ Thanh', 'Hương', 'K22-KT1', 'L03', 'Kế toán', 'CT03', 'Khóa 2022', 'Khá', '']
    ].map(function (x) {
        return { QLSV_NGUOIHOC_ID: x[0], QLSV_NGUOIHOC_MASO: x[1], QLSV_NGUOIHOC_HODEM: x[2], QLSV_NGUOIHOC_TEN: x[3],
            QLSV_NGUOIHOC_HOTEN: x[2] + ' ' + x[3], QLSV_NGUOIHOC_NGAYSINH: '12/05/2004',
            DAOTAO_LOPQUANLY_TEN: x[4], DAOTAO_LOPQUANLY_ID: x[5], DAOTAO_CHUONGTRINH_TEN: x[6], DAOTAO_TOCHUCCHUONGTRINH_ID: x[7],
            DAOTAO_KHOADAOTAO_TEN: x[8], DAOTAO_KHOADAOTAO_ID: 'K' + x[8].slice(-2), KHOAQUANLY_TEN: x[6] === 'Kế toán' ? 'Khoa Kinh tế' : 'Khoa ' + x[6],
            DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', QLSV_TRANGTHAINGUOIHOC_ID: 'TT1', QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học',
            XEPLOAI_TEN: x[9], XEPLOAI_THAYDOI_TEN: x[10], ANH: '' };
    });
    function svDong(s, tien, kh) {
        var r = { ID: id(tien), XLDH_KEHOACH_ID: kh, TN_KEHOACH_ID: kh, PHANLOAI_ID: 'LDH1' };
        Object.keys(s).forEach(function (c) { r[c] = s[c]; });
        return r;
    }
    /* Phạm vi (đối tượng xét) của từng kế hoạch — kho sửa được */
    var PV = { XLDH01: SV.slice(0, 5).map(function (s) { return svDong(s, 'PV', 'XLDH01'); }),
               XLDH02: SV.slice(2, 6).map(function (s) { return svDong(s, 'PV', 'XLDH02'); }),
               XLDH03: [] };
    function kq(kh, tu, den) { return SV.slice(tu, den).map(function (s) { return svDong(s, 'KQ', kh); }); }
    var KQ = { XLDH01: kq('XLDH01', 0, 3), XLDH02: kq('XLDH02', 2, 4), XLDH03: [] };
    var KQL = { XLDH01: kq('XLDH01', 3, 5), XLDH02: kq('XLDH02', 4, 6), XLDH03: [] };
    var DK = {
        XLDH01: [{ ID: 'TC1', XEPLOAI_TEN: 'Xuất sắc', XAUDIEUKIEN: 'DIEMTB_HK >= 3.6 AND DIEMRL >= 90' },
                 { ID: 'TC2', XEPLOAI_TEN: 'Giỏi', XAUDIEUKIEN: 'DIEMTB_HK >= 3.2 AND DIEMRL >= 80' }],
        XLDH02: [{ ID: 'TC3', XEPLOAI_TEN: 'Giỏi', XAUDIEUKIEN: 'DIEMTB_HK >= 3.2 AND DIEMRL >= 80' },
                 { ID: 'TC4', XEPLOAI_TEN: 'Khá', XAUDIEUKIEN: 'DIEMTB_HK >= 2.5 AND DIEMRL >= 65' }],
        XLDH03: []
    };
    function xoaTrong(kho, ids) {
        String(ids || '').split(',').forEach(function (i) {
            Object.keys(kho).forEach(function (k) { kho[k] = kho[k].filter(function (r) { return r.ID !== i; }); });
        });
    }
    var OK = { rows: [], raw: {} };

    ums.demo.add({
        'HB_XepLoaiDanhHieu/LayDSXLDH_NguoiDung_PhanLoai': LOAI,
        'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach': function (o) {
            return trang(like(KH, o.strTuKhoa, ['TEN', 'MA']).filter(function (x) {
                return (!o.strPhanLoai_Id || x.PHANLOAI_ID === o.strPhanLoai_Id) &&
                    (!o.strDaoTao_ThoiGianDaoTao_Id || x.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id);
            }), o);
        },
        'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach': function (o) {
            var k = dayDu({ ID: id('XLDH'), MA: 'DH-MOI', TEN: o.strTen, MOTA: o.strMoTa, NGAYBATDAU: o.strNgayBatDau, NGAYKETTHUC: o.strNgayKetThuc,
                PHANLOAI_ID: o.strPhanLoai_Id, DAOTAO_THOIGIANDAOTAO_ID: o.strDaoTao_ThoiGianDaoTao_Id, DIEUKIENXET: '', KETQUACHINHTHUC: 0 });
            KH.unshift(k); NS[k.ID] = []; PV[k.ID] = []; KQ[k.ID] = []; KQL[k.ID] = []; DK[k.ID] = [];
            return { rows: [], raw: { Id: k.ID } };
        },
        'HB_XepLoaiDanhHieu/Sua_XLDH_KeHoach': function (o) {
            KH.forEach(function (k) {
                if (k.ID !== o.strId) return;
                k.TEN = o.strTen; k.MOTA = o.strMoTa; k.NGAYBATDAU = o.strNgayBatDau; k.NGAYKETTHUC = o.strNgayKetThuc;
                k.PHANLOAI_ID = o.strPhanLoai_Id; k.DAOTAO_THOIGIANDAOTAO_ID = o.strDaoTao_ThoiGianDaoTao_Id; dayDu(k);
            });
            return OK;
        },
        /* Gốc xoá kế hoạch VÀ xoá tiêu chuẩn cùng một action (strIds) — mẫu xoá ở cả hai kho */
        'HB_XepLoaiDanhHieu/Xoa_XLDH_TieuChuan_AD': function (o) {
            String(o.strIds || '').split(',').forEach(function (i) {
                for (var j = KH.length - 1; j >= 0; j--) if (KH[j].ID === i) KH.splice(j, 1);
            });
            xoaTrong(DK, o.strIds);
            return OK;
        },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_NhanSu': function (o) { return (NS[o.strXLDH_KeHoach_Id] || []).slice(); },
        'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_NhanSu': function (o) {
            var kho = NS[o.strXLDH_KeHoach_Id] = NS[o.strXLDH_KeHoach_Id] || [];
            if (o.strId && kho.some(function (r) { return r.ID === o.strId; })) return OK;
            var ten = 'Cán bộ ' + o.strNguoiDung_Id;
            kho.push({ ID: id('PC'), NGUOIDUNG_ID: o.strNguoiDung_Id, NGUOIDUNG_TAIKHOAN: 'cb.' + String(o.strNguoiDung_Id).toLowerCase(),
                NGUOIDUNG_TENDAYDU: ten, NGUOICUOI_TENDAYDU: ten });
            return OK;
        },
        'HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_NhanSu': function (o) { xoaTrong(NS, o.strIds); return OK; },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach_PhamVi': function (o) {
            return trang(like(PV[o.strXLDH_KeHoach_Id] || [], o.strTuKhoa, ['QLSV_NGUOIHOC_MASO', 'QLSV_NGUOIHOC_HOTEN']), o);
        },
        'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamVi': function (o) {
            var kho = PV[o.strXLDH_KeHoach_Id] = PV[o.strXLDH_KeHoach_Id] || [];
            var s = SV.filter(function (x) { return x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id; })[0] || SV[0];
            kho.push(svDong(s, 'PV', o.strXLDH_KeHoach_Id));
            return OK;
        },
        'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViKhoa': function (o) {
            var kho = PV[o.strXLDH_KeHoach_Id] = PV[o.strXLDH_KeHoach_Id] || [];
            SV.filter(function (x) { return x.DAOTAO_KHOADAOTAO_ID === o.strDaoTao_KhoaDaoTao_Id; })
                .forEach(function (s) { kho.push(svDong(s, 'PV', o.strXLDH_KeHoach_Id)); });
            return OK;
        },
        'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViCT': function (o) {
            var kho = PV[o.strXLDH_KeHoach_Id] = PV[o.strXLDH_KeHoach_Id] || [];
            SV.filter(function (x) { return x.DAOTAO_TOCHUCCHUONGTRINH_ID === o.strDaoTao_ChuongTrinh_Id; })
                .forEach(function (s) { kho.push(svDong(s, 'PV', o.strXLDH_KeHoach_Id)); });
            return OK;
        },
        'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViLop': function (o) {
            var kho = PV[o.strXLDH_KeHoach_Id] = PV[o.strXLDH_KeHoach_Id] || [];
            SV.filter(function (x) { return x.DAOTAO_LOPQUANLY_ID === o.strDaoTao_LopQuanLy_Id; })
                .forEach(function (s) { kho.push(svDong(s, 'PV', o.strXLDH_KeHoach_Id)); });
            return OK;
        },
        'HB_XepLoaiDanhHieu/Xoa_XLDH_KeHoach_PhamVi': function (o) { xoaTrong(PV, o.strIds); return OK; },
        'HB_XepLoaiDanhHieu/LayDSXLDH_TieuChuan_Ad': function (o) { return (DK[o.strPhamViApDung_Id] || []).slice(); },
        'HB_XepLoaiDanhHieu/Sua_XLDH_TieuChuan_AD': function (o) {
            Object.keys(DK).forEach(function (k) { DK[k].forEach(function (r) { if (r.ID === o.strId) r.XAUDIEUKIEN = o.strXauDieuKien; }); });
            return OK;
        },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua': function (o) { return trang(KQ[o.strXLDH_KeHoach_Id] || [], o); },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_ChiTiet': function (o) {
            var d = [];
            (KQ[o.strXLDH_KeHoach_Id] || []).forEach(function (r, i) {
                d.push({ XLDH_KETQUA_ID: r.ID, ID: 'C1', GIATRI: (3.9 - i * 0.2).toFixed(2) });
                d.push({ XLDH_KETQUA_ID: r.ID, ID: 'C2', GIATRI: String(95 - i * 3) });
            });
            return { rows: { rsCot: [{ ID: 'C1', TEN: 'Điểm TB học kỳ' }, { ID: 'C2', TEN: 'Điểm rèn luyện' }], rsDuLieu: d } };
        },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_Loi': function (o) { return trang(KQL[o.strXLDH_KeHoach_Id] || [], o); },
        'HB_XepLoaiDanhHieu/LayDSXLDH_KetQua_Loi_ChiTiet': function (o) {
            return { rows: { rsCot: [{ ID: 'L1', TEN: 'Lý do không đạt' }], rsDuLieu: (KQL[o.strXLDH_KeHoach_Id] || []).map(function (r) {
                return { XLDH_KETQUA_ID: r.ID, ID: 'L1', GIATRI: 'Điểm rèn luyện chưa đủ' };
            }) } };
        },
        'HB_DanhHieuHangDoi/TaoHangDoi_XLDH_TuDong': OK,
        'HB_KetQua/Them_HB_KetQua_CongNhan': function (o) {
            KH.forEach(function (k) { if (k.ID === o.strXLDH_KeHoach_Id) k.KETQUACHINHTHUC = 1; });
            return { rows: [], raw: { Id: 'KQCN1' } };
        },
        'HB_KetQua/Xoa': function (o) {
            KH.forEach(function (k) { if (k.ID === o.strXLDH_KeHoach_Id) k.KETQUACHINHTHUC = 0; });
            KQ[o.strXLDH_KeHoach_Id] = []; KQL[o.strXLDH_KeHoach_Id] = [];
            return OK;
        }
    });
})();
