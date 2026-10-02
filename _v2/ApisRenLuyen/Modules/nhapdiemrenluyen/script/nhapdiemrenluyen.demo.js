/* Dữ liệu mẫu cho nhapdiemrenluyen (Điểm rèn luyện) — chỉ dùng ở chế độ dựng thử (Hệ/Khoá/CT/Lớp dùng dữ liệu mẫu chung). */
(function () {
    var CON = [{ QLSV_NGUOIHOC_ID: 'SV1', DRL_TIEUCHIDANHGIA_ID: 'TC1', DIEM: 5 }, { QLSV_NGUOIHOC_ID: 'SV1', DRL_TIEUCHIDANHGIA_ID: 'TC2', DIEM: 8 }, { QLSV_NGUOIHOC_ID: 'SV2', DRL_TIEUCHIDANHGIA_ID: 'TC1', DIEM: 4 }];
    function dat(o, xoa) {
        CON = CON.filter(function (x) { return !(x.QLSV_NGUOIHOC_ID === o.strQLSV_NguoiHoc_Id && x.DRL_TIEUCHIDANHGIA_ID === o.strDRL_TieuChiDanhGia_Id); });
        if (!xoa) CON.push({ QLSV_NGUOIHOC_ID: o.strQLSV_NguoiHoc_Id, DRL_TIEUCHIDANHGIA_ID: o.strDRL_TieuChiDanhGia_Id, DIEM: o.dDiem });
        return [];
    }
    ums.demo.add({
        'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc': [{ ID: 'N1', NAMHOC: '2026-2027' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao_Ky': function (o) { return o.strDAOTAO_Nam_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026_2027_2' }] : []; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DRL.DOITUONGAPDUNG': [{ ID: 'DT1', TEN: 'Sinh viên chính quy' }],
        'CM_DanhMucDuLieu/LayDanhSach': [{ ID: 'TT1', TEN: 'Đang học' }],
        'RL_TieuChiDanhGia/LayDanhSach': function (o) { return o.strDoiTuongApDung_Id ? [{ ID: 'TCC1', TEN: 'I. Ý thức học tập' }] : []; },
        'RL_ThongTinChung/LayDSTieuChiRenLuyenTheoKhoa': function (o) { return o.strDRL_TieuChiDanhGia_Cha_Id ? [{ ID: 'TC1', TEN: 'Đi học đầy đủ' }, { ID: 'TC2', TEN: 'Kết quả học tập' }] : []; },
        'RL_ThongTinChung/LayDSDRLTheoLop': function () {
            var cha = {}; CON.forEach(function (x) { cha[x.QLSV_NGUOIHOC_ID] = (cha[x.QLSV_NGUOIHOC_ID] || 0) + Number(x.DIEM); });
            return { rows: { rsSV: [{ ID: 'SV1', MASO: 'SV2201', HODEM: 'Trần Minh', TEN: 'Anh', QLSV_NGUOIHOC_NGAYSINH: '02/03/2004', CHUONGTRINH_ID: 'CT1', LOP_ID: 'L1', QLSV_NGUOIHOC_TRANGTHAI_ID: 'TT1' },
                    { ID: 'SV2', MASO: 'SV2202', HODEM: 'Lê Thu', TEN: 'Hà', QLSV_NGUOIHOC_NGAYSINH: '15/08/2004', CHUONGTRINH_ID: 'CT1', LOP_ID: 'L1', QLSV_NGUOIHOC_TRANGTHAI_ID: 'TT1' }],
                rsTieuChi: [{ ID: 'TC1', TEN: 'Đi học đầy đủ', MUCDIEMQUYDINH: 6 }, { ID: 'TC2', TEN: 'Kết quả học tập', MUCDIEMQUYDINH: 10 }],
                rsDuLieuDrl_TieuChiCon: CON,
                rsDuLieuDrl_TieuChiCha: Object.keys(cha).map(function (k) { return { QLSV_NGUOIHOC_ID: k, DIEM: cha[k], XEPLOAI_TEN: cha[k] >= 10 ? 'Tốt' : 'Khá' }; }) } };
        },
        'RL_XuLy/Them_DRL_TongHopKetQua_TieuChi': function (o) { return dat(o, false); },
        'RL_XuLy/Xoa_DRL_TongHopKetQua_TieuChi': function (o) { return dat(o, true); },
        'RL_XuLy/TongHopDRLTheoCacTieuChi': []
    });
})();
