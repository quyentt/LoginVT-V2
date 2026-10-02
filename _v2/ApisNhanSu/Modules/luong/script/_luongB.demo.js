/* Dữ liệu mẫu dùng chung của nhóm màn lương (luongB) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var K = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var fx = {};
    fx[K + 'LUONG.LOAICONGCHUC'] = [dm('LCC1', 'A', 'Công chức loại A'), dm('LCC2', 'B', 'Công chức loại B'), dm('LCC3', 'C', 'Công chức loại C')];
    fx[K + 'LUONG.NHOMNGACH'] = [dm('NN1', 'A1', 'Nhóm A1'), dm('NN2', 'A2', 'Nhóm A2'), dm('NN3', 'A3', 'Nhóm A3')];
    fx[K + 'LUONG.NGACH'] = [dm('NG1', 'V.07.01.01', 'Giảng viên cao cấp'), dm('NG2', 'V.07.01.02', 'Giảng viên chính'), dm('NG3', 'V.07.01.03', 'Giảng viên')];
    fx[K + 'LUONG.LOAIPHUCAP'] = [dm('PC1', 'CV', 'Phụ cấp chức vụ'), dm('PC2', 'UD', 'Phụ cấp ưu đãi'), dm('PC3', 'TN', 'Phụ cấp thâm niên')];
    fx[K + 'NHANSU.LOAIPHUCAP'] = [dm('LPC1', 'CV', 'Phụ cấp chức vụ'), dm('LPC2', 'UD', 'Phụ cấp ưu đãi nghề'), dm('LPC3', 'TN', 'Phụ cấp thâm niên nhà giáo')];
    fx[K + 'NHANSU.LOAIKHOAN'] = [dm('LK1', 'LCB', 'Lương cơ bản'), dm('LK2', 'PCCV', 'Phụ cấp chức vụ'), dm('LK3', 'TT', 'Tiền thưởng'), dm('LK4', 'TL', 'Truy lĩnh')];
    fx[K + 'LUONG.BAOHIEM.DOITUONGAPDUNG'] = [dm('DT1', 'NLD', 'Người lao động'), dm('DT2', 'DV', 'Đơn vị')];
    fx[K + 'NS.NHNG'] = [
        { ID: 'NHNG1', MA: 'GV', TEN: 'Ngạch giảng viên', QUANHECHA_ID: '' },
        { ID: 'NHNG2', MA: 'GVCC', TEN: 'Giảng viên cao cấp', QUANHECHA_ID: 'NHNG1' },
        { ID: 'NHNG3', MA: 'GVC', TEN: 'Giảng viên chính', QUANHECHA_ID: 'NHNG1' },
        { ID: 'NHNG4', MA: 'CV', TEN: 'Ngạch chuyên viên', QUANHECHA_ID: '' }
    ];
    fx[K + 'NS.BALU'] = [dm('BL1', '1', 'Bậc 1'), dm('BL2', '2', 'Bậc 2'), dm('BL3', '3', 'Bậc 3'), dm('BL4', '4', 'Bậc 4')];
    fx[K + 'KPI.DVT'] = [dm('DVT1', 'HS', 'Hệ số'), dm('DVT2', 'PT', 'Phần trăm'), dm('DVT3', 'VND', 'Đồng')];
    fx[K + 'NS.CDNN'] = [dm('CD1', 'V.07.01.03', 'Giảng viên (hạng III)'), dm('CD2', 'V.07.01.02', 'Giảng viên chính (hạng II)')];
    fx['L_BangQuyDinhLuong/LayDanhSach'] = [
        { ID: 'QDL1', MUCLUONGCOBAN: '1800000', SOBACLUONGTOIDA: 9, LUONGTOITHIEUVUNG: '4680000', NGAYBATDAUAPDUNG: '01/07/2023', NGAYKETTHUCAPDUNG: '30/06/2024', MOTA: 'Nghị định 24/2023' },
        { ID: 'QDL2', MUCLUONGCOBAN: '2340000', SOBACLUONGTOIDA: 9, LUONGTOITHIEUVUNG: '4960000', NGAYBATDAUAPDUNG: '01/07/2024', NGAYKETTHUCAPDUNG: '', MOTA: 'Nghị định 73/2024' }
    ];
    fx['L_BangQuyDinhLuong/LayChiTiet'] = function (o) { return fx['L_BangQuyDinhLuong/LayDanhSach'].filter(function (r) { return r.ID === o.strId; }); };
    fx['NS_HoSoV2/LayDanhSach'] = function (o) {
        var ds = [
            { ID: 'NS1', MASO: 'CB001', HOTEN: 'Nguyễn Văn Hùng', DAOTAO_COCAUTOCHUC_ID: 'CC1' },
            { ID: 'NS2', MASO: 'CB015', HOTEN: 'Trần Thị Mai', DAOTAO_COCAUTOCHUC_ID: 'CC2' },
            { ID: 'NS3', MASO: 'CB102', HOTEN: 'Lê Quang Minh', DAOTAO_COCAUTOCHUC_ID: 'CC1' }
        ];
        return o.strDaoTao_CoCauToChuc_Id ? ds.filter(function (r) { return r.DAOTAO_COCAUTOCHUC_ID === o.strDaoTao_CoCauToChuc_Id; }) : ds;
    };
    ums.demo.add(fx);
})();
