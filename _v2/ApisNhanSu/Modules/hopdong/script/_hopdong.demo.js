/* Dữ liệu mẫu nhóm hợp đồng (nạp cùng _hopdong.js) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var LHD = [{ ID: 'HD1', MA: 'XDTH', TEN: 'Hợp đồng xác định thời hạn' }, { ID: 'HD2', MA: 'KXDTH', TEN: 'Hợp đồng không xác định thời hạn' }, { ID: 'HD3', MA: 'TV', TEN: 'Hợp đồng thử việc' }];
    function ten(id) { var r = LHD.filter(function (x) { return x.ID === id; })[0]; return r ? r.TEN : ''; }
    ums.demo.add({
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.LOAIHOPDONG': LHD,
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.HINHTHUCTUYENDUNG': [{ ID: 'TD1', MA: 'TT', TEN: 'Thi tuyển' }, { ID: 'TD2', MA: 'XT', TEN: 'Xét tuyển' }],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#NS.TTNS': [{ ID: 'TT1', MA: 'DLV', TEN: 'Đang làm việc' }, { ID: 'TT2', MA: 'NH', TEN: 'Nghỉ hưu' }],
        'NS_SapHetHanHopDong/LapDSSapHetHanHD': [
            { ID: 'SH1', HO: 'Trần Thị', TEN: 'Mai', MACANBO: 'CB015', NGAYHIEULUCHOPDONG: '01/11/2024', NGAYHETHIEULUCHOPDONG: '31/10/2026' },
            { ID: 'SH2', HO: 'Phạm Văn', TEN: 'Long', MACANBO: 'CB210', NGAYHIEULUCHOPDONG: '15/12/2024', NGAYHETHIEULUCHOPDONG: '14/12/2026' }
        ]
    });
    ums.demo.crudStore('NS_ThongTinHopDong', [
        { ID: 'TH1', NHANSU_HOSOCANBO_ID: 'NS1', SOHOPDONG: '12/HĐLĐ-2020', NGAYKYHOPDONG: '01/08/2020', DIEU1_LOAIHOPDONG_ID: 'HD2', DIEU1_LOAIHOPDONG_TEN: 'Hợp đồng không xác định thời hạn',
          DIEU1_HINHTHUCTUYENDUNG_ID: 'TD1', DAOTAO_COCAUTOCHUC_ID: 'CC1', NGAYHIEULUCHOPDONG: '01/09/2020', NGAYHETHIEULUCHOPDONG: '', DIEU1_DIADIEMLAMVIEC: 'Cơ sở chính', DIEU1_CONGVIECPHAILAM: 'Giảng dạy' },
        { ID: 'TH2', NHANSU_HOSOCANBO_ID: '', BENB_TEN: 'Vũ Thị Lan', BENB_SOCMTND: '001199012345', BENB_NGAYSINH: '12/05/1999', BENB_DIACHI: 'Hà Nội',
          SOHOPDONG: '05/HĐDK-2026', NGAYKYHOPDONG: '15/08/2026', DIEU1_LOAIHOPDONG_ID: 'HD3', DIEU1_LOAIHOPDONG_TEN: 'Hợp đồng thử việc', DAOTAO_COCAUTOCHUC_ID: 'CC4',
          NGAYHIEULUCHOPDONG: '01/09/2026', NGAYHETHIEULUCHOPDONG: '30/11/2026', DIEU1_DIADIEMLAMVIEC: 'Phòng Đào tạo', DIEU1_CONGVIECPHAILAM: 'Chuyên viên' }
    ], {
        map: function (o) {
            return { NHANSU_HOSOCANBO_ID: o.strNhanSu_HoSoCanBo_Id, SOHOPDONG: o.strSoHopDong, NGAYKYHOPDONG: o.strNgayKyHopDong, DIEU1_LOAIHOPDONG_ID: o.strDieu1_LoaiHopDong_Id,
                DIEU1_LOAIHOPDONG_TEN: ten(o.strDieu1_LoaiHopDong_Id), DIEU1_HINHTHUCTUYENDUNG_ID: o.strDieu1_HinhThucTuyen_Id, DAOTAO_COCAUTOCHUC_ID: o.strDaoTao_CoCauToChuc_Id,
                NGAYHIEULUCHOPDONG: o.strNgayHieuLucHopDong, NGAYHETHIEULUCHOPDONG: o.strNgayHetHieuLucHopDong, DIEU1_DIADIEMLAMVIEC: o.strDieu1_DiaDiemLamViec,
                DIEU1_CONGVIECPHAILAM: o.strDieu1_CongViecPhaiLam, BENB_TEN: o.strBenB_Ten, BENB_SOCMTND: o.strBenB_SoCMTND, BENB_NGAYSINH: o.strBenB_NgaySinh, BENB_DIACHI: o.strBenB_DiaChi };
        },
        list: function (rows, o) {
            var r = rows.filter(function (x) { return !o.strNhanSu_HoSoCanBo_Id || x.NHANSU_HOSOCANBO_ID === o.strNhanSu_HoSoCanBo_Id; });
            return { rows: r, pager: r.length };
        }
    });
})();
