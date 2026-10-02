/* Dữ liệu mẫu cho _nvchon (hộp chọn học phần / lớp) — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'pkg_kehoach_thongtin.LayDSKS_DaoTao_HocPhan': function (o) {
        var all = [
            { ID: 'HPC01', MA: 'MA1011', TEN: 'Giải tích 1', HOCTRINH: 3 },
            { ID: 'HPC02', MA: 'MA1012', TEN: 'Giải tích 2', HOCTRINH: 3 },
            { ID: 'HPC03', MA: 'PH1011', TEN: 'Vật lý đại cương 1', HOCTRINH: 3 },
            { ID: 'HPC04', MA: 'IT2031', TEN: 'Cấu trúc dữ liệu và giải thuật', HOCTRINH: 3 },
            { ID: 'HPC05', MA: 'IT2040', TEN: 'Cơ sở dữ liệu', HOCTRINH: 3 },
            { ID: 'HPC06', MA: 'EN1002', TEN: 'Tiếng Anh cơ bản 2', HOCTRINH: 2 },
            { ID: 'HPC07', MA: 'PE1001', TEN: 'Giáo dục thể chất 1', HOCTRINH: 1 }
        ];
        var q = String(o.strTuKhoa || '').toLowerCase();
        var rows = q ? all.filter(function (r) { return (r.MA + ' ' + r.TEN).toLowerCase().indexOf(q) >= 0; }) : all;
        var s = Number(o.pageSize) || rows.length, p = Number(o.pageIndex) || 1;
        return { rows: rows.slice((p - 1) * s, p * s), pager: rows.length };
    },
    'pkg_kehoach_thongtin.LayDSKhoaQuanLy': [
        { ID: 'KQL1', TEN: 'Khoa Công nghệ thông tin' }, { ID: 'KQL2', TEN: 'Khoa Kinh tế' }
    ],
    'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen': [
        { ID: 'H1', TENHEDAOTAO: 'Đại học chính quy' }, { ID: 'H2', TENHEDAOTAO: 'Liên thông' }
    ]
});
