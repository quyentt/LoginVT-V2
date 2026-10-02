/* Dữ liệu mẫu cho kehoach/thongketinhtrangtochucthi (Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DS = [
        { ID: 'HP1', MA_HOCPHAN: 'KT2101', TEN_HOCPHAN: 'Nguyên lý kế toán', CHUONGTRINH_MO: 'Kế toán K14', SO_TINCHI: 3, KHOA_QUANLY: 'Khoa Kế toán',
            TONG_DA_DANGKY: 1240, TONG_DA_RUT: 12, TONG_TRONG_DST: 1228, TONG_CHUA_DU_DIEUKIEN: 0, TONG_CHUA_TEN_KHONG_RUT: 0, HE: 'H1' },
        { ID: 'HP2', MA_HOCPHAN: 'CT1102', TEN_HOCPHAN: 'Triết học Mác - Lênin', CHUONGTRINH_MO: 'Quản trị kinh doanh K14', SO_TINCHI: 3, KHOA_QUANLY: 'Khoa Lý luận chính trị',
            TONG_DA_DANGKY: 860, TONG_DA_RUT: 5, TONG_TRONG_DST: 840, TONG_CHUA_DU_DIEUKIEN: 9, TONG_CHUA_TEN_KHONG_RUT: 6, HE: 'H1' },
        { ID: 'HP3', MA_HOCPHAN: 'TA1203', TEN_HOCPHAN: 'Tiếng Anh 3', CHUONGTRINH_MO: 'Công nghệ thông tin K14', SO_TINCHI: 4, KHOA_QUANLY: 'Khoa Ngoại ngữ',
            TONG_DA_DANGKY: 415, TONG_DA_RUT: 3, TONG_TRONG_DST: 0, TONG_CHUA_DU_DIEUKIEN: 0, TONG_CHUA_TEN_KHONG_RUT: 412, HE: 'H1' },
        { ID: 'HP4', MA_HOCPHAN: 'TC2204', TEN_HOCPHAN: 'Tài chính doanh nghiệp', CHUONGTRINH_MO: 'Tài chính ngân hàng K13', SO_TINCHI: 3, KHOA_QUANLY: 'Khoa Tài chính',
            TONG_DA_DANGKY: 298, TONG_DA_RUT: 0, TONG_TRONG_DST: 290, TONG_CHUA_DU_DIEUKIEN: 4, TONG_CHUA_TEN_KHONG_RUT: 4, HE: 'H1' },
        { ID: 'HP5', MA_HOCPHAN: 'LT3105', TEN_HOCPHAN: 'Kế toán quản trị', CHUONGTRINH_MO: 'Kế toán liên thông K9', SO_TINCHI: 2, KHOA_QUANLY: 'Khoa Kế toán',
            TONG_DA_DANGKY: 64, TONG_DA_RUT: 1, TONG_TRONG_DST: 0, TONG_CHUA_DU_DIEUKIEN: 0, TONG_CHUA_TEN_KHONG_RUT: 63, HE: 'H2' }
    ];
    ums.demo.add({
        'DKH_Chung/LayThoiGianDangKyHoc': [{ ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2026_2027_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' },
            { ID: 'TG3', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }],
        'PKG_DIEM_THONGKE.ThongKe_HocPhan_TinhTrangDST': function (o) {
            var he = String(o.strDaoTao_HeDaoTao_Id || '').split(',').filter(Boolean);
            return DS.filter(function (x) {
                if (he.length && he.indexOf(x.HE) < 0) return false;
                if (String(o.strHanhDong) === '1') return !x.TONG_TRONG_DST;
                if (String(o.strHanhDong) === '2') return x.TONG_TRONG_DST > 0 && x.TONG_CHUA_TEN_KHONG_RUT > 0;
                return true;
            });
        }
    });
})();
