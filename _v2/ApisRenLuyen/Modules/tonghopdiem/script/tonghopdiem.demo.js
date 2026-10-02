/* Dữ liệu mẫu cho tonghopdiem (Điểm rèn luyện) — chỉ dùng ở chế độ dựng thử (Hệ/Khoá/CT/Lớp dùng dữ liệu mẫu chung). */
(function () {
    var CT = [
        { ID: 'K1', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh',
            DAOTAO_LOPQUANLY_TEN: 'QTKD66A', MASO: 'SV2201', HODEM: 'Trần Minh', TEN: 'Anh', QLSV_NGUOIHOC_NGAYSINH: '02/03/2004', GIOITINH_TEN: 'Nam', XEPLOAI_TEN: 'Tốt', DIEM: 85, DIEMQUYDOI: 3.4, GHICHU: '' },
        { ID: 'K2', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh',
            DAOTAO_LOPQUANLY_TEN: 'QTKD66A', MASO: 'SV2202', HODEM: 'Lê Thu', TEN: 'Hà', QLSV_NGUOIHOC_NGAYSINH: '15/08/2004', GIOITINH_TEN: 'Nữ', XEPLOAI_TEN: 'Khá', DIEM: 72, DIEMQUYDOI: 2.9, GHICHU: '' },
        { ID: 'K3', DAOTAO_HEDAOTAO_TEN: 'Đại học chính quy', DAOTAO_KHOADAOTAO_TEN: 'K66', DAOTAO_KHOAQUANLY_TEN: 'Khoa Kinh tế', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Quản trị kinh doanh',
            DAOTAO_LOPQUANLY_TEN: 'QTKD66A', MASO: 'SV2203', HODEM: 'Phạm Quốc', TEN: 'Bảo', QLSV_NGUOIHOC_NGAYSINH: '21/11/2004', GIOITINH_TEN: 'Nam', XEPLOAI_TEN: 'Xuất sắc', DIEM: 92, DIEMQUYDOI: 3.7, GHICHU: 'Cán bộ lớp' }
    ];
    var THIEU = [];
    ['Nguyễn Văn', 'Đỗ Thị', 'Hoàng Gia', 'Vũ Thanh', 'Bùi Ngọc', 'Đặng Hữu', 'Ngô Phương', 'Lý Minh', 'Trịnh Quang', 'Mai Anh', 'Tạ Hồng', 'Phan Đức'].forEach(function (h, i) {
        THIEU.push({ MASO: 'SV23' + (10 + i), HODEM: h, TEN: ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hải', 'Lan', 'Long', 'Nam', 'Thảo', 'Trang', 'Vinh'][i],
            TRANGTHAI_TEN: 'Đang học', TENLOP: 'QTKD66A', TENCHUONGTRINH: 'Quản trị kinh doanh', MACHUONGTRINH: 'QTKD', TENKHOA: 'K66', TENKHOAQUANLY: 'Khoa Kinh tế', TENHEDAOTAO: 'Đại học chính quy' });
    });
    ums.demo.add({
        'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc': [{ ID: 'N1', NAMHOC: '2026-2027' }],
        'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao_Ky': function (o) { return o.strDAOTAO_Nam_Id ? [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2026_2027_2' }] : []; },
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DRL.DOITUONGAPDUNG': [{ ID: 'DT1', TEN: 'Sinh viên chính quy' }],
        'CM_DanhMucDuLieu/LayDanhSach': [{ ID: 'TT1', TEN: 'Đang học' }],
        'pkg_diemrenluyen_thongtin.LayDSTongHopDRLTheoLop': function () {
            var tk = {}; CT.forEach(function (x) { tk[x.XEPLOAI_TEN] = (tk[x.XEPLOAI_TEN] || 0) + 1; });
            return { rows: { rsChiTiet: CT, rsThongKe: Object.keys(tk).map(function (k) { return { TEN: k, SOLUONG: tk[k] }; }) } };
        },
        'pkg_diemrenluyen_thongtin.LayDSTongHopThieuDRL': { rows: { rsChiTiet: THIEU } },
        'RL_XuLy/TongHopDRLTheoKyNamToanKhoa': []
    });
})();
