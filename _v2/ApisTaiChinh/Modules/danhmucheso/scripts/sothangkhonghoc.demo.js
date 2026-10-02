/* Dữ liệu mẫu cho sothangkhonghoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var B = ums.dmhsB;
    B.demoChung();
    var SV = B.demo.sv;
    var TG = [{ ID: 'TG1', THOIGIAN: '2025_2026_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }];
    ums.demo.add({
        'CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao': [
            { ID: 'TG1', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }, { ID: 'TG2', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }
        ],
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#QLTC.DTMG': [
            { ID: 'DT1', MA: 'NVQS', TEN: 'Đi nghĩa vụ quân sự' }, { ID: 'DT2', MA: 'OMDH', TEN: 'Ốm dài hạn' }, { ID: 'DT3', MA: 'BL', TEN: 'Bảo lưu có lý do' }
        ],
        'TC_NguoiHoc_SoThang/LayDSThoiGian_DT_SoThang': TG,
        'TC_NguoiHoc_SoThang/LayDSTaiChinh_NH_SoThang': function (o) {
            return SV.filter(function (r) { return !o.strLopQuanLy_Id || r.DAOTAO_LOPQUANLY_ID === o.strLopQuanLy_Id; }).map(function (r) {
                return {
                    QLSV_NGUOIHOC_ID: r.QLSV_NGUOIHOC_ID, QLSV_NGUOIHOC_MASO: r.MASO, QLSV_NGUOIHOC_HODEM: r.HODEM, QLSV_NGUOIHOC_TEN: r.TEN,
                    QLSV_NGUOIHOC_NGAYSINH: r.NGAYSINH_NGAY + '/' + r.NGAYSINH_THANG + '/' + r.NGAYSINH_NAM,
                    DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', QLSV_NGUOIHOC_LOP: r.DAOTAO_LOPQUANLY_TEN
                };
            });
        },
        'TC_NguoiHoc_SoThang/LayDanhSach': [
            {
                ID: 'NS1', QLSV_NGUOIHOC_ID: SV[0].QLSV_NGUOIHOC_ID, DAOTAO_THOIGIANDAOTAO_ID: 'TG1', SOTHANG: 2, QLSV_DOITUONG_ID: 'DT2',
                DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Kỹ thuật phần mềm', KIEUHOC_ID: '', TAICHINH_CACKHOANTHU_ID: 'KT1',
                QLSV_NGUOIHOC_MASO: SV[0].MASO, QLSV_NGUOIHOC_HODEM: SV[0].HODEM, QLSV_NGUOIHOC_TEN: SV[0].TEN
            }
        ],
        'SV_ChuongTrinhCuaHocVien/LayDanhSach': function (o) {
            var one = [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT1', DAOTAO_CHUONGTRINH_MA: '7480103', DAOTAO_CHUONGTRINH_TEN: 'Kỹ thuật phần mềm' }];
            return o.strQLSV_NguoiHoc_Id === 'SV2' ? one.concat([{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT2', DAOTAO_CHUONGTRINH_MA: '7340101', DAOTAO_CHUONGTRINH_TEN: 'Quản trị kinh doanh (ngành 2)' }]) : one;
        }
    });
})();
