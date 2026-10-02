/* Dữ liệu mẫu cho Chuyển lớp (nhập học) — chỉ dùng ở chế độ dựng thử. */
(function () {
    'use strict';
    var ds = [
        { ID: 'HS01', MASO: '2601001', SOBAODANH: 'HN260101', HODEM: 'Nguyễn Văn', TEN: 'An', QLSV_NGUOIHOC_NGAYSINH: '12/03/2008',
          DAOTAO_LOPQUANLY_TEN: 'K68-KTPM1', DAOTAO_NGANHNHAPHOC: 'Kỹ thuật phần mềm', DAOTAO_NGANHTRUNGTUYEN: 'Kỹ thuật phần mềm' },
        { ID: 'HS02', MASO: '2601002', SOBAODANH: 'HN260102', HODEM: 'Trần Thị', TEN: 'Bình', QLSV_NGUOIHOC_NGAYSINH: '05/11/2008',
          DAOTAO_LOPQUANLY_TEN: 'K68-QTKD1', DAOTAO_NGANHNHAPHOC: 'Quản trị kinh doanh', DAOTAO_NGANHTRUNGTUYEN: 'Quản trị kinh doanh' },
        { ID: 'HS03', MASO: '2601003', SOBAODANH: 'HN260103', HODEM: 'Lê Hoàng', TEN: 'Cường', QLSV_NGUOIHOC_NGAYSINH: '21/07/2008',
          DAOTAO_LOPQUANLY_TEN: 'K68-KTPM2', DAOTAO_NGANHNHAPHOC: 'Kỹ thuật phần mềm', DAOTAO_NGANHTRUNGTUYEN: 'Hệ thống thông tin' },
        { ID: 'HS04', MASO: '2601004', SOBAODANH: 'HN260104', HODEM: 'Phạm Minh', TEN: 'Dũng', QLSV_NGUOIHOC_NGAYSINH: '30/01/2008',
          DAOTAO_LOPQUANLY_TEN: '', DAOTAO_NGANHNHAPHOC: 'Quản trị kinh doanh', DAOTAO_NGANHTRUNGTUYEN: 'Quản trị kinh doanh' }
    ];
    ums.demo.add({
        'NH_NguoiHoc_ThongTinTuyenSinh/LayDanhSach': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return ds.filter(function (r) { return !q || (r.MASO + ' ' + r.HODEM + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; });
        },
        'NH_NguoiHoc_ThongTinTuyenSinh/ChuyenLop': []
    });
})();
