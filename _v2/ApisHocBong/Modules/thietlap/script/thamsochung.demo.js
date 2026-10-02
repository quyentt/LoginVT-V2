/* Dữ liệu mẫu cho thamsochung — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var CHUNG = [
        { ID: 'TS1', PHANLOAI_ID: 'PL1', MOTA: 'Tham số xét tốt nghiệp đại học chính quy',
          HOANTHANH_THUOCTINHHOCPHAN_ID: 'TT1,TT2', HOANTHANH_THUOCTINHHOCPHAN_TEN: 'Bắt buộc, Tự chọn',
          HOANTHANH_HOCPHANTINHDIEM: '1', HOANTHANH_HOCPHANTINHDIEM_TEN: 'Tính điểm',
          HOANTHANH_MUCKYLUAT_ID: 'KL2', HOANTHANH_MUCKYLUAT_TEN: 'Cảnh cáo',
          HOANTHANH_DANHGIA_ID: 'DG1', HOANTHANH_DANHGIA_TEN: 'Đạt',
          HOANTHANH_KIEUXET_ID: 'KX1', HOANTHANH_KIEUXET_TEN: 'Theo khối kiến thức',
          HOANTHANH_THUOCTINH_MONTHI_ID: 'TT3', HOANTHANH_THUOCTINH_MONTHI_TEN: 'Thi tốt nghiệp',
          HOANTHANH_XETMONTUONGDUONG: '1', HOANTHANH_XETMONTUONGDUONG_TEN: 'Có áp dụng',
          HETHONG_CHOXETTUDONG: '0', HETHONG_CHOXETTUDONG_TEN: 'Không áp dụng' }
    ];
    var RIENG = [
        { ID: 'TSR1', PHANLOAI_ID: 'PL1', PHANCAPAPDUNG_ID: 'PC1', PHAMVIAPDUNG_ID: 'H2', PHAMVIAPDUNG_TEN: 'Liên thông',
          MOTA: 'Hệ liên thông không xét học phần thi tốt nghiệp',
          HOANTHANH_THUOCTINHHOCPHAN_ID: 'TT1', HOANTHANH_THUOCTINHHOCPHAN_TEN: 'Bắt buộc',
          HOANTHANH_HOCPHANTINHDIEM: '1', HOANTHANH_HOCPHANTINHDIEM_TEN: 'Tính điểm',
          HOANTHANH_XETMONTUONGDUONG: '0', HOANTHANH_XETMONTUONGDUONG_TEN: 'Không áp dụng',
          HETHONG_CHOXETTUDONG: '0', HETHONG_CHOXETTUDONG_TEN: 'Không áp dụng' }
    ];
    var fx = {
        'TN_XetDuyet_ThamSo/LayDanhSach': function (o) {
            return CHUNG.filter(function (r) { return !o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id; });
        },
        'TN_XetDuyet_ThamSo_Ad/LayDanhSach': function (o) {
            return RIENG.filter(function (r) { return r.PHANCAPAPDUNG_ID === o.strPhanCapApDung_Id; });
        },
        'TN_PhanLoai_XepLoai/LayDanhSach': [{ ID: 'PX1', PHANLOAI_ID: 'PL1', XEPLOAI_ID: 'XL1' }, { ID: 'PX2', PHANLOAI_ID: 'PL1', XEPLOAI_ID: 'XL2' }],
        'TN_NguoiDung_TinhTrang/LayDanhSach': [{ ID: 'NT1', PHANLOAI_ID: 'PL1', NGUOIDUNG_ID: 'ND1', TINHTRANG_ID: 'XN1' }],
        'TN_XacNhan_TinhTrang/LayDanhSach': [{ ID: 'XT1', PHANLOAI_ID: 'PL2', TINHTRANG_ID: 'XN2' }],
        'CMS_NguoiDung/LayDanhSach': [
            { ID: 'ND1', MA: 'phongdaotao', TENDAYDU: 'Phòng Đào tạo' },
            { ID: 'ND2', MA: 'ctsv', TENDAYDU: 'Phòng Công tác sinh viên' },
            { ID: 'ND3', MA: 'khoacntt', TENDAYDU: 'Khoa Công nghệ thông tin' }
        ]
    };
    fx[DM + 'KHCT.TTHP'] = [dm('TT1', 'BB', 'Bắt buộc'), dm('TT2', 'TC', 'Tự chọn'), dm('TT3', 'TN', 'Thi tốt nghiệp')];
    fx[DM + 'TN.MUCVIPHAMKYLUAT'] = [dm('KL1', 'KT', 'Khiển trách'), dm('KL2', 'CC', 'Cảnh cáo'), dm('KL3', 'DC', 'Đình chỉ học tập')];
    fx[DM + 'DIEM.DANHGIA'] = [dm('DG1', 'D', 'Đạt'), dm('DG2', 'KD', 'Không đạt')];
    fx[DM + 'TN.KIEUXETHOANTHANHCHUONGTRINH'] = [dm('KX1', 'KKT', 'Theo khối kiến thức'), dm('KX2', 'TC', 'Theo tổng số tín chỉ')];
    fx[DM + 'TN.XACNHAN'] = [dm('XN1', 'CHO', 'Chờ xác nhận'), dm('XN2', 'DA', 'Đã xác nhận'), dm('XN3', 'TC', 'Từ chối')];
    ums.demo.add(fx);
})();
