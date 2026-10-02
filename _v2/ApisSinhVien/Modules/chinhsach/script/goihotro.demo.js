/* Dữ liệu mẫu cho goihotro — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var DMU = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var GOI = [
        { ID: 'G01', MA: 'HTHT', TEN: 'Gói hỗ trợ học tập' },
        { ID: 'G02', MA: 'HTCP', TEN: 'Gói hỗ trợ chi phí sinh hoạt' },
        { ID: 'G03', MA: 'HTKT', TEN: 'Gói hỗ trợ người khuyết tật' }
    ];
    var CT = [
        { ID: 'GC01', GOI: 'G01', TAICHINH_CACKHOANTHU_ID: 'KT1', TAICHINH_CACKHOANTHU_TEN: 'Hỗ trợ chi phí học tập', MUCHUONG: 894000, DONVITINH_ID: 'CDV1', DONVITINH_TEN: 'Đồng', KIEUTINH_ID: 'KTI1', KIEUTINH_TEN: 'Theo tháng', QUYDINHTHOIGIAN_ID: 'QD1', QUYDINHTHOIGIAN_TEN: '10 tháng / năm học', PHAMVI_BATDAU_NGAY_THANG_: '01/09/2025', PHAMVI_KETTHUC_NGAY_THANG_: '30/06/2026', GHICHU: 'QĐ 66/2013', THUTU: 1 },
        { ID: 'GC02', GOI: 'G01', TAICHINH_CACKHOANTHU_ID: 'KT2', TAICHINH_CACKHOANTHU_TEN: 'Hỗ trợ mua tài liệu', MUCHUONG: 300000, DONVITINH_ID: 'CDV1', DONVITINH_TEN: 'Đồng', KIEUTINH_ID: 'KTI2', KIEUTINH_TEN: 'Theo học kỳ', QUYDINHTHOIGIAN_ID: 'QD2', QUYDINHTHOIGIAN_TEN: 'Mỗi học kỳ', PHAMVI_BATDAU_NGAY_THANG_: '01/09/2025', PHAMVI_KETTHUC_NGAY_THANG_: '31/12/2025', GHICHU: '', THUTU: 2 },
        { ID: 'GC03', GOI: 'G02', TAICHINH_CACKHOANTHU_ID: 'KT4', TAICHINH_CACKHOANTHU_TEN: 'Trợ cấp sinh hoạt', MUCHUONG: 1490000, DONVITINH_ID: 'CDV1', DONVITINH_TEN: 'Đồng', KIEUTINH_ID: 'KTI1', KIEUTINH_TEN: 'Theo tháng', QUYDINHTHOIGIAN_ID: 'QD1', QUYDINHTHOIGIAN_TEN: '10 tháng / năm học', PHAMVI_BATDAU_NGAY_THANG_: '01/09/2025', PHAMVI_KETTHUC_NGAY_THANG_: '30/06/2026', GHICHU: '', THUTU: 1 }
    ];
    var CS = [
        { ID: 'CS01', CHEDOCHINHSACH_ID: 'CD1', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', DOITUONG_ID: 'DT1', DOITUONG_TEN: 'Con thương binh, liệt sĩ', TAICHINH_CHINHSACH_GOIHOTRO_ID: 'G01', TENGOIHOTRO: 'Gói hỗ trợ học tập', DAOTAO_THOIGIANDAOTAO_ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026', HIEULUC: 1, GHICHU: '' },
        { ID: 'CS02', CHEDOCHINHSACH_ID: 'CD1', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', DOITUONG_ID: 'DT3', DOITUONG_TEN: 'Dân tộc thiểu số vùng khó khăn', TAICHINH_CHINHSACH_GOIHOTRO_ID: 'G02', TENGOIHOTRO: 'Gói hỗ trợ chi phí sinh hoạt', DAOTAO_THOIGIANDAOTAO_ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026', HIEULUC: 1, GHICHU: '' },
        { ID: 'CS03', CHEDOCHINHSACH_ID: 'CD2', CHEDOCHINHSACH_TEN: 'Trợ cấp xã hội', DOITUONG_ID: 'DT4', DOITUONG_TEN: 'Khuyết tật', TAICHINH_CHINHSACH_GOIHOTRO_ID: 'G03', TENGOIHOTRO: 'Gói hỗ trợ người khuyết tật', DAOTAO_THOIGIANDAOTAO_ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026', HIEULUC: 0, GHICHU: '' }
    ];
    function trang(r, o) {
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: r.slice((pi - 1) * sz, pi * sz), pager: r.length };
    }
    var fx = {};
    fx[DMU + 'QLTC.CDCS'] = [dm('CD1', 'MGHP', 'Miễn giảm học phí', 'Chế độ chính sách'), dm('CD2', 'TCXH', 'Trợ cấp xã hội', 'Chế độ chính sách')];
    fx[DMU + 'TAICHINH.CHINHSACH.DONVITINH'] = [dm('CDV1', 'DONG', 'Đồng', 'Đơn vị tính'), dm('CDV2', 'PT', 'Phần trăm', 'Đơn vị tính')];
    fx[DMU + 'TAICHINH.CHINHSACH.KIEUITINH'] = [dm('KTI1', 'THANG', 'Theo tháng', 'Kiểu tính'), dm('KTI2', 'HK', 'Theo học kỳ', 'Kiểu tính')];
    fx[DMU + 'TAICHINH.CHINHSACH.QUYDINHTHOIGIAN'] = [dm('QD1', '10T', '10 tháng / năm học', 'Quy định thời gian'), dm('QD2', 'HK', 'Mỗi học kỳ', 'Quy định thời gian')];
    fx['pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao'] = [
        { ID: 'HK1', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 1 năm 2025-2026' }, { ID: 'HK2', DAOTAO_THOIGIANDAOTAO: 'Học kỳ 2 năm 2025-2026' }];
    fx['SV_ChinhSach_DT/LayDanhSach'] = [
        { ID: 'CDDT01', DOITUONG_ID: 'DT1', DOITUONG_TEN: 'Con thương binh, liệt sĩ' },
        { ID: 'CDDT03', DOITUONG_ID: 'DT3', DOITUONG_TEN: 'Dân tộc thiểu số vùng khó khăn' },
        { ID: 'CDDT04', DOITUONG_ID: 'DT4', DOITUONG_TEN: 'Khuyết tật' }
    ];
    fx['SV_GoiHoTro/LayDanhSach'] = GOI;
    fx['SV_GoiHoTro/ThemMoi'] = { rows: [], raw: { Id: 'G99' } };
    fx['SV_GoiHoTro_ChiTiet/LayDanhSach'] = function (o) {
        return trang(CT.filter(function (x) { return x.GOI === o.strTaiChinh_ChinhSach_Goi_Id; }), o);
    };
    fx['SV_CS_DoiTuong/LayDanhSach'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        return trang(CS.filter(function (x) {
            return (!o.strCheDoChinhSach_Id || x.CHEDOCHINHSACH_ID === o.strCheDoChinhSach_Id) &&
                (!o.strDoiTuong_Id || x.DOITUONG_ID === o.strDoiTuong_Id) &&
                (!q || (x.DOITUONG_TEN + ' ' + x.TENGOIHOTRO).toLowerCase().indexOf(q) >= 0);
        }), o);
    };
    ums.demo.add(fx);
})();
