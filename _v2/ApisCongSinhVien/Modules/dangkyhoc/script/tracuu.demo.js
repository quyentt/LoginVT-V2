/* Dữ liệu mẫu cho tracuu (Kết quả đăng ký học) — chỉ dùng ở chế độ dựng thử.
   Kết quả đăng ký lấy từ kho chung ums.dkyDemo (_dangky.demo.js) nên đăng ký /
   hủy ở màn "Đăng ký học" là màn này thấy ngay. */
(function () {
    'use strict';
    var K = ums.dkyDemo;
    var lichSu = [
        { HANHDONG_TEN: 'Người học xác nhận', NGUOIXACNHAN_TENDAYDU: 'Lăng Văn Huy', NGAYTAO_DD_MM_YYYY: '08/09/2026', NOIDUNG: '' }
    ];

    ums.demo.add({
        'pkg_dangkyhoc_thongtin.LayThoiGianDangKyCaNhan': [
            { ID: 'TG1', THOIGIAN: '2026_2027_1' },
            { ID: 'TG2', THOIGIAN: '2025_2026_2' }
        ],
        'pkg_dangkyhoc_thongtin.LayDSKeHoachDangKyCaNhan': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id === 'TG1' ? K.kh : [K.kh[1]];
        },
        'pkg_dangkyhoc_chung.LayKetQuaDangKyLopHocPhan': function (o) {
            var ds = K.kq.map(function (q) { return Object.assign({}, q, { DAOTAO_THOIGIANDAOTAO_ID: 'TG1' }); });
            if (o.strDangKy_KeHoachDangKy_Id) ds = ds.filter(function (q) { return q.DANGKY_KEHOACHDANGKY_ID === o.strDangKy_KeHoachDangKy_Id; });
            if (o.strDaoTao_ThoiGianDaoTao_Id) ds = ds.filter(function (q) { return q.DAOTAO_THOIGIANDAOTAO_ID === o.strDaoTao_ThoiGianDaoTao_Id; });
            return ds;
        },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DANGKY.XACNHAN.LOAI': [
            { ID: 'LXN1', MA: 'KQDKH', TEN: 'Xác nhận kết quả đăng ký học', CHUNG_TENDANHMUC_TEN: 'Loại xác nhận' },
            { ID: 'LXN2', MA: 'RUTHP', TEN: 'Xác nhận rút học phần', CHUNG_TENDANHMUC_TEN: 'Loại xác nhận' }
        ],
        'PKG_DANGKY_XACNHAN.LayDSHanhDongXacNhan': function (o) {
            return o.strLoaiXacNhan_Id === 'LXN2'
                ? [{ ID: 'HD3', TEN: 'Đồng ý cho rút' }, { ID: 'HD4', TEN: 'Không đồng ý' }]
                : [{ ID: 'HD1', TEN: 'Người học xác nhận' }, { ID: 'HD2', TEN: 'Người học đề nghị sửa' }];
        },
        'PKG_DANGKY_XACNHAN.LayDSDangKy_XacNhan_KetQua': function () { return lichSu.slice(); },
        'PKG_DANGKY_XACNHAN.Them_DangKy_XacNhan_KetQua': function (o) {
            lichSu.push({ HANHDONG_TEN: o.strHanhDong_Id === 'HD2' ? 'Người học đề nghị sửa' : 'Người học xác nhận',
                NGUOIXACNHAN_TENDAYDU: 'Lăng Văn Huy', NGAYTAO_DD_MM_YYYY: '22/09/2026', NOIDUNG: o.strNoiDung || '' });
            return { rows: [], message: 'XN' + lichSu.length };
        }
    });
})();
