/* Dữ liệu mẫu cho thutuchanhchinh/yeucau (bản cán bộ) — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DVMC.YEUCAU': [
        { ID: 'YCL1', MA: 'XNSV', TEN: 'Giấy xác nhận sinh viên' },
        { ID: 'YCL2', MA: 'BDTA', TEN: 'Bảng điểm tiếng Anh' },
        { ID: 'YCL3', MA: 'VAYVON', TEN: 'Giấy xác nhận vay vốn' }
    ],
    'pkg_dvmc_thongtin.LayTTDVMC_YeuCu_MoTa': function (o) {
        if (o.strYeuCau_Id !== 'YCL1') return [];
        return [{ ID: 'MT1', TIEUDE: 'Cấp giấy xác nhận sinh viên', MOTA: 'Dùng để bổ sung hồ sơ tạm hoãn nghĩa vụ quân sự, xin học bổng…',
            DIACHITRAYEUCAU: 'Phòng Công tác sinh viên, tầng 1 nhà A1', SONGAYTRAKETQUA: 2, SOGIOTRAKETQUA: 0, SOPHUTTRAKETQUA: 0,
            THONGBAOKHIDANGKYTHANHCONG: 'Đăng ký thành công, vui lòng mang thẻ sinh viên khi nhận giấy.', DUONGDANMAUDON: 'Upload/Mau/xacnhansv.docx', HINHANHMINHHOA: '' }];
    },
    'pkg_dvmc_thongtin.LayDSDVMC_CauTruc_YeuCau': [
        { ID: 'CT1', YEUCAU_ID: 'YCL1', YEUCAU_TEN: 'Giấy xác nhận sinh viên', NOIDUNG: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', DONGTHU: 1, KICHTHUOCDONG: 14, CANLE: 'center', HIEULUC: 1 },
        { ID: 'CT2', YEUCAU_ID: 'YCL1', YEUCAU_TEN: 'Giấy xác nhận sinh viên', NOIDUNG: 'Độc lập - Tự do - Hạnh phúc', DONGTHU: 2, KICHTHUOCDONG: 13, CANLE: 'center', HIEULUC: 1 },
        { ID: 'CT3', YEUCAU_ID: 'YCL1', YEUCAU_TEN: 'Giấy xác nhận sinh viên', NOIDUNG: 'GIẤY XÁC NHẬN', DONGTHU: 4, KICHTHUOCDONG: 16, CANLE: 'center', HIEULUC: 0 }
    ]
});
