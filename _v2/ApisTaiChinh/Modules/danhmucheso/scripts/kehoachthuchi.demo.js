/* Dữ liệu mẫu cho kehoachthuchi — chỉ dùng ở chế độ dựng thử.
   TC_HoaDon / TC_PhieuThu / TC_BienLai (cột MAUSO) có sẵn trong assets/js/demo-data.js. */
ums.demo.add({
    'TC_KeHoachThuChi/LayDanhSach': function (o) {
        var rows = [
            { ID: 'KH1', TENKEHOACH: 'Kế hoạch thu học phí năm học 2025-2026', NGAYBATDAU: '01/08/2025', NGAYKETTHUC: '31/07/2026', MOTA: 'Áp dụng cho hệ chính quy',
              MOHINHAPDUNGHOADON_ID: 'PB1', TAICHINH_HOADON_ID: 'HD1', TAICHINH_HETHONGHOADONRUT_ID: 'HD2',
              MOHINHAPDUNGPHIEUTHU_ID: 'MP1', TAICHINH_HETHONGPHIEUTHU_ID: 'PT1', TAICHINH_HETHONGPHIEURUT_ID: 'PT1',
              MOHINHAPDUNGBIENLAI_ID: 'BLM1', TAICHINH_HETHONGBIENLAI_ID: 'BL1', TAICHINH_HETHONGBIENLAIRUT_ID: 'BL2',
              TAICHINH_HOADON_DIENTU_ID: 'HD1', MOHINHGACHNOTUDONG_ID: 'GN1', PHANTRAMTHUEGTGT: '0' },
            { ID: 'KH2', TENKEHOACH: 'Kế hoạch thu ký túc xá 2026', NGAYBATDAU: '01/01/2026', NGAYKETTHUC: '31/12/2026', MOTA: '',
              MOHINHAPDUNGHOADON_ID: 'PB2', TAICHINH_HOADON_ID: 'HD3', MOHINHGACHNOTUDONG_ID: 'GN2', PHANTRAMTHUEGTGT: '10' },
            { ID: 'KH3', TENKEHOACH: 'Kế hoạch thu lệ phí tốt nghiệp đợt 1/2026', NGAYBATDAU: '15/03/2026', NGAYKETTHUC: '30/04/2026', MOTA: 'Đợt xét tốt nghiệp tháng 4' }
        ];
        var q = (o.strTuKhoa || '').toLowerCase();
        return rows.filter(function (r) { return !q || r.TENKEHOACH.toLowerCase().indexOf(q) >= 0; });
    },
    'TC_KeHoachThuChi_NhanSu/LayDanhSach': function (o) {
        return o.strTaiChinh_KeHoach_Id === 'KH1' ? [
            { ID: 'NS1', NGUOIDUNG_HOTEN: 'Nguyễn Thị Lan', NGUOIDUNG_TAIKHOAN: 'lannt', VAITRO_TEN: 'Kế toán thu', DAOTAO_COSODAOTAO_TEN: 'Cơ sở Hà Nội' },
            { ID: 'NS2', NGUOIDUNG_HOTEN: 'Trần Văn Minh', NGUOIDUNG_TAIKHOAN: 'minhtv', VAITRO_TEN: 'Thủ quỹ', DAOTAO_COSODAOTAO_TEN: 'Cơ sở Hà Nội' }
        ] : [];
    },
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.PHANBOHOADON': [
        { ID: 'PB1', MA: 'TD', TEN: 'Phân bổ tự động' }, { ID: 'PB2', MA: 'TC', TEN: 'Phân bổ thủ công' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.MOHINH_PHIEUTHU': [
        { ID: 'MP1', MA: 'TD', TEN: 'Theo người thu' }, { ID: 'MP2', MA: 'Q', TEN: 'Theo quyển' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.PHANBOBIENLAI': [
        { ID: 'BLM1', MA: 'TD', TEN: 'Theo người thu' }, { ID: 'BLM2', MA: 'Q', TEN: 'Theo quyển' }
    ],
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#TAICHINH.MOHINHGACHNO': [
        { ID: 'GN1', MA: 'UT', TEN: 'Theo thứ tự ưu tiên khoản thu' }, { ID: 'GN2', MA: 'TG', TEN: 'Theo thời gian phát sinh' }
    ]
});
