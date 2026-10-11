/* Dữ liệu mẫu cho taichinh/tinhphi — chỉ dùng ở chế độ dựng thử (hàng đợi + mẫu báo cáo dùng mẫu chung của ums.queue / ums.report). */
(function () {
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.NVAP'] = [{ ID: 'NV1', MA: 'PHONG', TEN: 'Tính phí phòng ở' }, { ID: 'NV2', MA: 'DIENNUOC', TEN: 'Tính phí điện - nước' }];
    fx['KTX_HangDoi/TaoHangDoi_TinhPhi_TuDong'] = function () { return []; };
    fx['KTX_TinhPhi/LayDanhSach'] = function (o) {
        var rows = [
            { ID: 'TP1', QLSV_NGUOIHOC_ID: 'NH01', KTX_DOITUONGOKYTUCXA_MASO: 'BIT220101', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Văn', KTX_DOITUONGOKYTUCXA_TEN: 'An', KTX_DOITUONGOKYTUCXA_NGAYSINH: '12/03/2004', KTX_DOITUONGOKYTUCXA_LOP: 'K67-KTPM1', KTX_DOITUONGOKYTUCXA_NGANH: 'Kỹ thuật phần mềm', KTX_DOITUONGOKYTUCXA_KHOAHOC: 'Khóa 67', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DAOTAO_THOIGIANDAOTAO_NAM: o.strNam, DAOTAO_THOIGIANDAOTAO_THANG: o.strThang, SOTIEN: 250000, NGAYTAO: '05/' + o.strThang + '/' + o.strNam, NGHIEPVUAPDUNG_ID: 'NV1' },
            { ID: 'TP2', QLSV_NGUOIHOC_ID: 'NH02', KTX_DOITUONGOKYTUCXA_MASO: 'BBA220561', KTX_DOITUONGOKYTUCXA_HODEM: 'Lê Minh', KTX_DOITUONGOKYTUCXA_TEN: 'Châu', KTX_DOITUONGOKYTUCXA_NGAYSINH: '25/11/2004', KTX_DOITUONGOKYTUCXA_LOP: 'K67-QTKD2', KTX_DOITUONGOKYTUCXA_NGANH: 'Quản trị kinh doanh', KTX_DOITUONGOKYTUCXA_KHOAHOC: 'Khóa 67', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DAOTAO_THOIGIANDAOTAO_NAM: o.strNam, DAOTAO_THOIGIANDAOTAO_THANG: o.strThang, SOTIEN: 300000, NGAYTAO: '05/' + o.strThang + '/' + o.strNam, NGHIEPVUAPDUNG_ID: 'NV1' },
            { ID: 'TP3', QLSV_NGUOIHOC_ID: 'NH01', KTX_DOITUONGOKYTUCXA_MASO: 'BIT220101', KTX_DOITUONGOKYTUCXA_HODEM: 'Nguyễn Văn', KTX_DOITUONGOKYTUCXA_TEN: 'An', KTX_DOITUONGOKYTUCXA_NGAYSINH: '12/03/2004', KTX_DOITUONGOKYTUCXA_LOP: 'K67-KTPM1', KTX_DOITUONGOKYTUCXA_NGANH: 'Kỹ thuật phần mềm', KTX_DOITUONGOKYTUCXA_KHOAHOC: 'Khóa 67', TAICHINH_CACKHOANTHU_TEN: 'Phí điện', DAOTAO_THOIGIANDAOTAO_NAM: o.strNam, DAOTAO_THOIGIANDAOTAO_THANG: o.strThang, SOTIEN: 86500, NGAYTAO: '06/' + o.strThang + '/' + o.strNam, NGHIEPVUAPDUNG_ID: 'NV2' }
        ];
        return rows.filter(function (r) { return !o.strNghiepVuApDung_Id || r.NGHIEPVUAPDUNG_ID === o.strNghiepVuApDung_Id; });
    };
    ums.demo.add(fx);
})();
