/* Dữ liệu mẫu cho chedochinhsach — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    function dm(id, ma, ten, tenDM) { return { ID: id, MA: ma, TEN: ten, CHUNG_TENDANHMUC_TEN: tenDM || '' }; }
    var DMU = 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#';
    var DS = [
        { ID: 'CDDT01', CHEDOCHINHSACH_ID: 'CD1', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', DOITUONG_ID: 'DT1', DOITUONG_TEN: 'Con thương binh, liệt sĩ', DONVITINH_ID: 'DV1', DONVITINH_TEN: 'Phần trăm', HIEULUC: 1, PHANTRAMHUONG: 100, GHICHU: 'Nghị định 81/2021' },
        { ID: 'CDDT02', CHEDOCHINHSACH_ID: 'CD1', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', DOITUONG_ID: 'DT2', DOITUONG_TEN: 'Hộ nghèo, cận nghèo', DONVITINH_ID: 'DV1', DONVITINH_TEN: 'Phần trăm', HIEULUC: 1, PHANTRAMHUONG: 50, GHICHU: '' },
        { ID: 'CDDT03', CHEDOCHINHSACH_ID: 'CD1', CHEDOCHINHSACH_TEN: 'Miễn giảm học phí', DOITUONG_ID: 'DT3', DOITUONG_TEN: 'Dân tộc thiểu số vùng khó khăn', DONVITINH_ID: 'DV1', DONVITINH_TEN: 'Phần trăm', HIEULUC: 1, PHANTRAMHUONG: 70, GHICHU: '' },
        { ID: 'CDDT04', CHEDOCHINHSACH_ID: 'CD2', CHEDOCHINHSACH_TEN: 'Trợ cấp xã hội', DOITUONG_ID: 'DT4', DOITUONG_TEN: 'Khuyết tật', DONVITINH_ID: 'DV2', DONVITINH_TEN: 'Tháng', HIEULUC: 1, PHANTRAMHUONG: '', GHICHU: '140.000 đ/tháng' },
        { ID: 'CDDT05', CHEDOCHINHSACH_ID: 'CD2', CHEDOCHINHSACH_TEN: 'Trợ cấp xã hội', DOITUONG_ID: 'DT5', DOITUONG_TEN: 'Mồ côi cả cha lẫn mẹ', DONVITINH_ID: 'DV2', DONVITINH_TEN: 'Tháng', HIEULUC: 0, PHANTRAMHUONG: '', GHICHU: 'Hết hiệu lực từ 2025' }
    ];
    var fx = {};
    fx[DMU + 'QLTC.CDCS'] = [dm('CD1', 'MGHP', 'Miễn giảm học phí', 'Chế độ chính sách'), dm('CD2', 'TCXH', 'Trợ cấp xã hội', 'Chế độ chính sách')];
    fx[DMU + 'QLTC.DTMG'] = [dm('DT1', 'CTB', 'Con thương binh, liệt sĩ', 'Đối tượng'), dm('DT2', 'HN', 'Hộ nghèo, cận nghèo', 'Đối tượng'),
        dm('DT3', 'DTTS', 'Dân tộc thiểu số vùng khó khăn', 'Đối tượng'), dm('DT4', 'KT', 'Khuyết tật', 'Đối tượng'), dm('DT5', 'MC', 'Mồ côi cả cha lẫn mẹ', 'Đối tượng')];
    fx[DMU + 'QLTC.DONVITINH'] = [dm('DV1', 'PT', 'Phần trăm', 'Đơn vị tính'), dm('DV2', 'THANG', 'Tháng', 'Đơn vị tính')];
    fx['SV_ChinhSach_DT/LayDanhSach'] = function (o) {
        var q = (o.strTuKhoa || '').toLowerCase();
        var r = DS.filter(function (x) {
            return (!o.strCheDoChinhSach_Id || x.CHEDOCHINHSACH_ID === o.strCheDoChinhSach_Id) &&
                (!q || (x.DOITUONG_TEN + ' ' + x.GHICHU).toLowerCase().indexOf(q) >= 0);
        });
        var sz = Number(o.pageSize) || 10, pi = Number(o.pageIndex) || 1;
        return { rows: r.slice((pi - 1) * sz, pi * sz), pager: r.length };
    };
    ums.demo.add(fx);
})();
