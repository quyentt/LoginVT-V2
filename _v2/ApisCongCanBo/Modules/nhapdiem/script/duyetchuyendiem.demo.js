/* Dữ liệu mẫu cho duyetchuyendiem — chỉ dùng ở chế độ dựng thử. */
(function () {
    var C = 'SV_CND_ThongTin/', fx = {};
    fx[C + 'LayDSKeHoachTheoNhanSu'] = [{ ID: 'KH1', TENKEHOACH: 'Công nhận điểm HK1 2026-2027' }];
    fx[C + 'LayDSHocPhanTheoKhoaChuyenmon'] = function (o) { return o.strDiem_KeHoachCongNhan_Id ? [{ ID: 'HP1', TEN: 'Tiếng Anh 1', MA: 'EN1010' }, { ID: 'HP2', TEN: 'Tin học đại cương', MA: 'IT1010' }] : []; };
    function hs(i, cc) {
        return { ID: 'HS' + i, MACONGNHAN: 'CN00' + i, QLSV_NGUOIHOC_ID: 'SV' + i, QLSV_NGUOIHOC_MASO: 'SV220' + i, QLSV_NGUOIHOC_HOTEN: ['Trần Minh Anh', 'Lê Thu Hà'][i - 1],
            DAOTAO_CHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm', NGAYTAO_DD_MM_YYYY_HHMMSS: '10/09/2026 08:30:00', HOCPHANCNTHEODIEMKHOACM: cc ? 'Tiếng Anh 1' : 'Tin học đại cương',
            PHANLOAICC_ID: 'LCC1', PHANLOAICC_TEN: 'Ngoại ngữ', DAXACNHAN: i === 2 ? 1 : 0 };
    }
    fx[C + 'LayDSDiem_NH_CN_So_DiemKhoaCM'] = function () { return { rows: [hs(1), hs(2)], pager: 2 }; };
    fx[C + 'LayDSDiem_NH_CN_So_CCKhoaCM'] = function () { return { rows: [hs(1, 1)], pager: 1 }; };
    var HP = [{ ID: 'D1', QLSV_NGUOIHOC_ID: 'SV1', DAOTAO_CHUONGTRINH_ID: 'CT1', DAOTAO_HOCPHAN_ID: 'HP2', DIEM_KEHOACHCONGNHANDIEM_ID: 'KH1', DIEM_COSODAOTAOCONGNHANDIEM_ID: 'CS1',
        DAOTAO_HOCPHAN_MA: 'IT1010', DAOTAO_HOCPHAN_TEN: 'Tin học đại cương', DIEMCONGNHAN: 8.5, DIEM_COSODAOTAO_TEN: 'ĐH Bách khoa', THONGTINHOCPHAN: '3 TC', TINHTRANG_KHOA_XACNHAN_TEN: 'Chưa xác nhận',
        DIEM_THONGTIN_CC_CAPDO_ID: 'CD1', DIEM_THONGTIN_CC_CAPDO_TEN: 'B1', NGAYCAP: '01/06/2026' }];
    var FILES = [{ TENCOSODAOTAO: 'ĐH Bách khoa', DUONGDAN: 'Upload/minhchung.pdf', TENHIENTHI: 'Bảng điểm.pdf', PHANLOAICC_TEN: 'Ngoại ngữ', DIEM_THONGTIN_CHUNGCHI_TEN: 'VSTEP', CAPDO_TEN: 'B1' }];
    fx[C + 'LayDSChiTetCNTheoDiemKhoaCM'] = function () { return { rows: { rs: HP, rsFiles: FILES } }; };
    fx[C + 'LayDSChiTetCNTheoCCKhoaCM'] = function () { return { rows: { rs: HP, rsFiles: FILES } }; };
    fx['D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi'] = [{ ID: 'CC1', TENCHUNGCHI: 'VSTEP' }, { ID: 'CC2', TENCHUNGCHI: 'IELTS' }];
    fx['D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo'] = [{ ID: 'CD1', TENCAPDO: 'B1' }, { ID: 'CD2', TENCAPDO: 'B2' }];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.CHUNGCHI.PHANLOAI'] = [{ ID: 'LCC1', TEN: 'Ngoại ngữ' }, { ID: 'LCC2', TEN: 'Tin học' }];
    fx[C + 'LayDSLoaiCongNhan'] = [{ ID: 'LCN1', TEN: 'Công nhận khoa chuyên môn' }];
    fx[C + 'LayDSHanhDongTheoXacNhan'] = function (o) { return o.strLoaiXacNhan_Id ? [{ ID: 'HD1', TEN: 'Đồng ý' }, { ID: 'HD2', TEN: 'Không đồng ý' }] : []; };
    var LS = [];
    fx[C + 'Them_Diem_DK_CongNhan_XacNhan'] = function (o) { LS.unshift({ HANHDONG_TEN: o.strHanhDong_Id === 'HD1' ? 'Đồng ý' : 'Không đồng ý', THONGTINXACNHAN: o.strNoiDung, NGUOIXACNHAN_TENDAYDU: 'Cán bộ khoa', NGAYTAO_DD_MM_YYYY: '22/09/2026' });
        HP[0].TINHTRANG_KHOA_XACNHAN_TEN = LS[0].HANHDONG_TEN; return []; };
    fx['pkg_congthongtin_cnd_thongtin.LayDSDiem_DK_CongNhan_XacNhan'] = function () { return LS; };
    ums.demo.add(fx);
})();
