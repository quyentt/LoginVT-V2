/* Dữ liệu mẫu cho dangkyhoc/xacnhannhaphoc — chỉ dùng ở chế độ dựng thử. */
(function () {
    var DA = {};    // kế hoạch nhập học → cơ sở đã xác nhận
    var LS = {      // kế hoạch nhập học → lịch sử xác nhận (mới nhất trước)
        NH2026A: [{ ThoiGianThucHien: '20/08/2026 09:15', NguoiThucHien: 'Lăng Văn Huy', CoSoDaoTao: 'Cơ sở Hà Nội' }]
    };
    var CS = {
        NH2026A: [{ ID: 'CS01', TEN: 'Cơ sở Hà Nội' }, { ID: 'CS02', TEN: 'Cơ sở Nam Định' }, { ID: 'CS03', TEN: 'Cơ sở Hải Dương' }],
        NH2026B: [{ ID: 'CS01', TEN: 'Cơ sở Hà Nội' }]
    };
    ums.demo.add({
        'PKG_CORE_NhapHoc_ThuTien.LayDS_KeHoach_TheoNguoiHoc': function (o) {
            return o.strCore_Person_Id ? [
                { ID: 'NH2026A', TEN_KEHOACH: 'Nhập học đại học chính quy khóa 16 - đợt 1 (2026)' },
                { ID: 'NH2026B', TEN_KEHOACH: 'Nhập học bổ sung khóa 16 - đợt 2 (2026)' }
            ] : [];
        },
        'PKG_CORE_NhapHoc_ThuTien.LayDS_CSDT_TheoNguoiHoc_KH': function (o) {
            var ds = CS[o.strNh_KeHoach_NhapHoc_Id] || [], da = DA[o.strNh_KeHoach_NhapHoc_Id];
            /* Cơ sở đã xác nhận đưa lên đầu — ô chọn lấy sẵn mục đầu (selectFirst) */
            if (!da) return ds;
            return ds.filter(function (x) { return x.ID === da; }).concat(ds.filter(function (x) { return x.ID !== da; }));
        },
        'PKG_CORE_NhapHoc_ThuTien.Sua_CoSoNhapHoc': function (o) {
            var kh = o.strNh_KeHoach_NhapHoc_Id, cs = (CS[kh] || []).filter(function (x) { return x.ID === o.strDaoTao_CoSoDaoTao_Id; })[0];
            DA[kh] = o.strDaoTao_CoSoDaoTao_Id;
            var d = new Date(), p2 = function (n) { return (n < 10 ? '0' : '') + n; };
            (LS[kh] = LS[kh] || []).unshift({ ThoiGianThucHien: p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes()),
                NguoiThucHien: 'Lăng Văn Huy', CoSoDaoTao: cs ? cs.TEN : '' });
            return [];
        },
        'PKG_CORE_NhapHoc_ThuTien.LayDS_LichSu_XacNhanCoSo': function (o) { return (LS[o.strNh_KeHoach_NhapHoc_Id] || []).slice(); }
    });
})();
