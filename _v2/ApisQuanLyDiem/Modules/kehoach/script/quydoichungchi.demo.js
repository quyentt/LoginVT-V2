/* Dữ liệu mẫu cho quydoichungchi (Quy đổi chứng chỉ — Quản lý điểm) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function dm(id, ma, ten, nhom) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: nhom || '' }; }
    var CC = [
        { ID: 'CC1', TENCHUNGCHI: 'IELTS', PHANLOAICC_ID: 'PL1' },
        { ID: 'CC2', TENCHUNGCHI: 'TOEIC', PHANLOAICC_ID: 'PL1' },
        { ID: 'CC3', TENCHUNGCHI: 'MOS', PHANLOAICC_ID: 'PL2' }
    ];
    var CAPDO = [
        { ID: 'CD01', PHANLOAICC_ID: 'PL1', PHANLOAICC_TEN: 'Chứng chỉ ngoại ngữ', DIEM_THONGTIN_CHUNGCHI_ID: 'CC1', TENCHUNGCHI: 'IELTS', TENCAPDO: '6.5',
          DIEM_CONGTHUCDIEM_ID: 'CTD1', CONGTHUCTINHDIEM: 'Quy đổi theo bảng', PHUONGTHUCQUYDOI_ID: 'PT1', PHUONGTHUCQUYDOI_TEN: 'Theo khoảng điểm', DIEMCONGNHAN: '8.5', GHICHU: 'Áp dụng từ khóa 2024' },
        { ID: 'CD02', PHANLOAICC_ID: 'PL1', PHANLOAICC_TEN: 'Chứng chỉ ngoại ngữ', DIEM_THONGTIN_CHUNGCHI_ID: 'CC2', TENCHUNGCHI: 'TOEIC', TENCAPDO: '650',
          DIEM_CONGTHUCDIEM_ID: 'CTD1', CONGTHUCTINHDIEM: 'Quy đổi theo bảng', PHUONGTHUCQUYDOI_ID: 'PT2', PHUONGTHUCQUYDOI_TEN: 'Công nhận trực tiếp', DIEMCONGNHAN: '8.0', GHICHU: '' },
        { ID: 'CD03', PHANLOAICC_ID: 'PL2', PHANLOAICC_TEN: 'Chứng chỉ tin học', DIEM_THONGTIN_CHUNGCHI_ID: 'CC3', TENCHUNGCHI: 'MOS', TENCAPDO: 'Expert',
          DIEM_CONGTHUCDIEM_ID: 'CTD2', CONGTHUCTINHDIEM: 'Điểm cố định', PHUONGTHUCQUYDOI_ID: 'PT2', PHUONGTHUCQUYDOI_TEN: 'Công nhận trực tiếp', DIEMCONGNHAN: '9.0', GHICHU: '' }
    ];
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.CHUNGCHI.PHANLOAI'] = [dm('PL1', 'NN', 'Chứng chỉ ngoại ngữ', 'Phân loại chứng chỉ'), dm('PL2', 'TH', 'Chứng chỉ tin học', 'Phân loại chứng chỉ')];
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#DIEM.PHUONGTHUCQUYDOI'] = [dm('PT1', 'KHOANG', 'Theo khoảng điểm', 'Phương thức quy đổi'), dm('PT2', 'TRUCTIEP', 'Công nhận trực tiếp', 'Phương thức quy đổi')];
    fx['D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo'] = function (o) {
        return CAPDO.filter(function (x) {
            return (!o.strPhanLoaiCC_Id || x.PHANLOAICC_ID === o.strPhanLoaiCC_Id) && (!o.strDiem_ThongTin_ChungChi_Id || x.DIEM_THONGTIN_CHUNGCHI_ID === o.strDiem_ThongTin_ChungChi_Id);
        });
    };
    fx['D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi'] = function (o) { return CC.filter(function (x) { return !o.strPhanLoaiCC_Id || x.PHANLOAICC_ID === o.strPhanLoaiCC_Id; }); };
    fx['D_CongNhanDiem/LayDSHocPhan_QuyDoi_CapDo'] = [{ ID: 'HP01', MA: 'TA101', TEN: 'Tiếng Anh 1' }, { ID: 'HP02', MA: 'TA102', TEN: 'Tiếng Anh 2' }];
    fx['D_CongNhanDiem/Them_Diem_TT_CC_CapDo'] = [];
    fx['D_CongNhanDiem/Sua_Diem_TT_CC_CapDo'] = [];
    fx['D_CongNhanDiem/Xoa_Diem_TT_CC_CapDo'] = [];
    fx['D_CongThucDiem/LayDanhSach'] = [{ ID: 'CTD1', TEN: 'Quy đổi theo bảng' }, { ID: 'CTD2', TEN: 'Điểm cố định' }];
    fx['D_CongNhanDiem/LayDSDiem_CC_CapDo_QuyDoi_DK'] = function (o) {
        return o.strDiem_ThongTin_CC_CapDo_Id === 'CD01' ? [
            { ID: 'QD1', DAOTAO_HOCPHAN_ID: 'HP01', DAOTAO_HOCPHAN_MA: 'TA101', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 1', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_THANHPHANDIEM_TEN: 'Điểm tổng kết',
              CANDUOI: 6.5, CANTREN: 7, DIEMQUYDOI: 8.5, DIEMCONGNHAN: 8.5, PHAMVIAPDUNG_TEN: 'Khóa 2024', MUCNHOMDIEUKIEN: 1, LOAIKIEMTRA: 'Cận dưới ≤ điểm < cận trên', GHICHU: '' },
            { ID: 'QD2', DAOTAO_HOCPHAN_ID: 'HP02', DAOTAO_HOCPHAN_MA: 'TA102', DAOTAO_HOCPHAN_TEN: 'Tiếng Anh 2', DIEM_THANHPHANDIEM_ID: 'TP1', DIEM_THANHPHANDIEM_TEN: 'Điểm tổng kết',
              CANDUOI: 7, CANTREN: 9, DIEMQUYDOI: 9.5, DIEMCONGNHAN: 9.5, PHAMVIAPDUNG_TEN: 'Khóa 2024', MUCNHOMDIEUKIEN: 1, LOAIKIEMTRA: 'Cận dưới ≤ điểm < cận trên', GHICHU: '' }] : [];
    };
    fx['D_CongNhanDiem/Them_Diem_CC_CapDo_QuyDoi_DK'] = [];
    fx['D_CongNhanDiem/Sua_Diem_CC_CapDo_QuyDoi_DK'] = [];
    fx['D_CongNhanDiem/Xoa_Diem_CC_CapDo_QuyDoi_DK'] = [];
    fx['KHCT_HocPhan/LayDanhSach'] = [{ ID: 'HP01', MA: 'TA101', TEN: 'Tiếng Anh 1' }, { ID: 'HP02', MA: 'TA102', TEN: 'Tiếng Anh 2' }, { ID: 'HP03', MA: 'TH101', TEN: 'Tin học đại cương' }];
    fx['D_CongNhanDiem/LayDSThanhPhanDiemTheoCapDo'] = [{ ID: 'TP1', TEN: 'Điểm tổng kết' }, { ID: 'TP2', TEN: 'Điểm thi' }];
    fx['pkg_nhansu_hoso_v2.LayDanhSachToanBo'] = [{ ID: 'DV1', MA: 'KNN', TEN: 'Khoa Ngoại ngữ' }, { ID: 'DV2', MA: 'KCNTT', TEN: 'Khoa Công nghệ thông tin' }];
    fx['PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc'] = { rows: [
        { ID: 'R1', QLSV_NGUOIHOC_ID: 'NH01', QLSV_NGUOIHOC_MASO: 'SV24001', QLSV_NGUOIHOC_HODEM: 'Nguyễn Văn', QLSV_NGUOIHOC_TEN: 'An', DAOTAO_LOPQUANLY_TEN: 'K24-CNTT1', DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin', DAOTAO_KHOADAOTAO_TEN: 'Khóa 2024' }
    ], pager: 1 };
    ums.demo.add(fx);
})();
