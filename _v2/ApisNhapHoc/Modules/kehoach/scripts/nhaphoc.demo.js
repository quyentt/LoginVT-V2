/* Dữ liệu mẫu cho Kế hoạch nhập học — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten) { return { ID: id, MA: ma, TEN: ten }; }
    var DM = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var KH = ums.demo.nhKH || [];
    var CA = { KHNH2026: [
        { ID: 'CA_A', CANHAPHOC_ID: 'CA1', CANHAPHOCHIENTAI: 1, THUTU: 1, MOTA: 'Sáng 20/08 — khối kỹ thuật' },
        { ID: 'CA_B', CANHAPHOC_ID: 'CA2', CANHAPHOCHIENTAI: 0, THUTU: 2, MOTA: 'Chiều 20/08 — khối kinh tế' }
    ] };
    var seq = 1;
    var fx = {};
    fx[DM + 'NHAPHOC.MOHINH'] = [dm('MH1', 'TRUCTIEP', 'Nhập học trực tiếp'), dm('MH2', 'TRUCTUYEN', 'Nhập học trực tuyến')];
    fx[DM + 'NHAPHOC.PHANBOPHIEUTHU'] = [dm('PT1', 'MOTPHIEU', 'Một phiếu cho mọi khoản'), dm('PT2', 'MOIKHOAN', 'Mỗi khoản một phiếu')];
    fx[DM + 'NHAPHOC.PHANBOPHIEURUT'] = [dm('PR1', 'MOTPHIEU', 'Một phiếu rút cho mọi khoản'), dm('PR2', 'MOIKHOAN', 'Mỗi khoản một phiếu rút')];
    fx[DM + 'NHAPHOC.CA.NHAPHOC'] = [dm('CA1', 'CA1', 'Ca 1 (7h30 – 11h00)'), dm('CA2', 'CA2', 'Ca 2 (13h30 – 17h00)'), dm('CA3', 'CA3', 'Ca 3 (18h00 – 20h00)')];
    fx['KHCT_HeDaoTao/LayDanhSach'] = [
        { ID: 'HE_DHCQ', MAHEDAOTAO: 'DHCQ', TENHEDAOTAO: 'Đại học chính quy' },
        { ID: 'HE_KHAC', MAHEDAOTAO: 'KHAC', TENHEDAOTAO: 'Đào tạo khác' }
    ];
    fx['TC_HeThongPhieuThu/LayDanhSach'] = [
        { ID: 'HTP1', MAUIN_MA: 'PT01 — Phiếu thu nhập học' },
        { ID: 'HTP2', MAUIN_MA: 'PR01 — Phiếu rút tiền' }
    ];
    fx['NH_KeHoachNhapHoc/LayChiTiet'] = function (o) { return KH.filter(function (r) { return r.ID === o.strId; }); };
    fx['NH_KeHoachNhapHoc/ThemMoi'] = function () { return { rows: [], raw: { Id: 'KHNHMOI' + (seq++) } }; };
    fx['NH_KeHoachNhapHoc/CapNhat'] = function (o) { return { rows: [], raw: { Id: o.strId } }; };
    fx['NH_KeHoachNhapHoc/Xoa'] = [];
    fx['NH_QuayNhapHoc/LayDSNhapHoc_KeHoach_CaNhapHoc'] = function (o) { return (CA[o.strTC_KeHoachNhapHoc_Id] || []).slice(); };
    fx['NH_QuayNhapHoc/Them_NhapHoc_KeHoach_CaNhapHoc'] = function () { return { rows: [], raw: { Id: 'CAMOI' + (seq++) } }; };
    fx['NH_QuayNhapHoc/Sua_NhapHoc_KeHoach_CaNhapHoc'] = function (o) { return { rows: [], raw: { Id: o.strId } }; };
    fx['NH_QuayNhapHoc/Xoa_NhapHoc_KeHoach_CaNhapHoc'] = [];
    ums.demo.add(fx);
})();
