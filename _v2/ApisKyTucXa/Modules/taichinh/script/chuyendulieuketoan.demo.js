/* Dữ liệu mẫu cho taichinh/chuyendulieuketoan — chỉ dùng ở chế độ dựng thử. */
(function () {
    var fx = {};
    fx['CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#KTX.NVAP'] = [{ ID: 'NV1', MA: 'PHONG', TEN: 'Tính phí phòng ở' }, { ID: 'NV2', MA: 'DIENNUOC', TEN: 'Tính phí điện - nước' }];
    fx['KTX_HangDoi/TaoHangDoi_ChuyenKeToan_TuDong'] = function () { return []; };
    fx['KTX_TinhPhi/LayDSTinhKTX_ChuaKT'] = function (o) {
        var rows = [
            { ID: 'CK1', QLSV_NGUOIHOC_ID: 'NH03', KTX_DOITUONGOKYTUCXA_MASO: 'BIT220263', KTX_DOITUONGOKYTUCXA_HODEM: 'Trần Thị', KTX_DOITUONGOKYTUCXA_TEN: 'Hoa', KTX_DOITUONGOKYTUCXA_NGAYSINH: '03/07/2004', KTX_DOITUONGOKYTUCXA_LOP: 'K67-KTPM2', KTX_DOITUONGOKYTUCXA_NGANH: 'Kỹ thuật phần mềm', KTX_DOITUONGOKYTUCXA_KHOAHOC: 'Khóa 67', TAICHINH_CACKHOANTHU_TEN: 'Phí ký túc xá', DAOTAO_THOIGIANDAOTAO_NAM: o.strNam, DAOTAO_THOIGIANDAOTAO_THANG: o.strThang, SOTIEN: 250000, NGAYTAO: '05/' + o.strThang + '/' + o.strNam, NGHIEPVUAPDUNG_ID: 'NV1' },
            { ID: 'CK2', QLSV_NGUOIHOC_ID: 'NH04', KTX_DOITUONGOKYTUCXA_MASO: 'BBA220102', KTX_DOITUONGOKYTUCXA_HODEM: 'Phạm Quốc', KTX_DOITUONGOKYTUCXA_TEN: 'Bảo', KTX_DOITUONGOKYTUCXA_NGAYSINH: '19/01/2005', KTX_DOITUONGOKYTUCXA_LOP: 'K68-QTKD1', KTX_DOITUONGOKYTUCXA_NGANH: 'Quản trị kinh doanh', KTX_DOITUONGOKYTUCXA_KHOAHOC: 'Khóa 68', TAICHINH_CACKHOANTHU_TEN: 'Phí nước', DAOTAO_THOIGIANDAOTAO_NAM: o.strNam, DAOTAO_THOIGIANDAOTAO_THANG: o.strThang, SOTIEN: 42000, NGAYTAO: '06/' + o.strThang + '/' + o.strNam, NGHIEPVUAPDUNG_ID: 'NV2' }
        ];
        return rows.filter(function (r) { return !o.strNghiepVuApDung_Id || r.NGHIEPVUAPDUNG_ID === o.strNghiepVuApDung_Id; });
    };
    ums.demo.add(fx);
})();
