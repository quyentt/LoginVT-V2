/* Dữ liệu mẫu cho autopk (Tự động phân khối) — chỉ dùng ở chế độ dựng thử. */
ums.demo.add({
    'SV_HoSo/LayDanhSach': function (o) {
        var all = [
            { ID: 'SVPK01', MASO: 'BIT220263' }, { ID: 'SVPK02', MASO: 'BIT220271' }, { ID: 'SVPK03', MASO: 'BBA220561' }
        ];
        return { rows: all.slice(0, Math.max(0, Number(o.pageSize) || 0)), pager: all.length };
    },
    'DKH_Chung/LayDSChuongTrinh': function (o) {
        return [{ DAOTAO_TOCHUCCHUONGTRINH_ID: 'CT-' + o.strQLSV_NguoiHoc_Id, DAOTAO_TOCHUCCHUONGTRINH_TEN: 'Công nghệ thông tin' }];
    },
    'DKH_Chung/LayDSKeHoachDangKyHoc': [{ ID: 'KHPK01', MAKEHOACH: 'DK2025-1', TENKEHOACH: 'Đăng ký học kỳ 1 năm 2025-2026' }],
    'DKH_Chung/LayDSHocPhanDangToChuc': [
        { DAOTAO_HOCPHAN_ID: 'HPPK01', DAOTAO_HOCPHAN_MA: 'IT2031', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DADANGKY: 0 },
        { DAOTAO_HOCPHAN_ID: 'HPPK02', DAOTAO_HOCPHAN_MA: 'MA1012', DAOTAO_HOCPHAN_TEN: 'Giải tích 2', DADANGKY: 0 }
    ],
    'DKH_Chung/LayDSLopHocPhanDangToChuc': function (o) {
        return { rows: { rs: [
            { ID: o.strDaoTao_HocPhan_Id + '.01', SOLOPTHUOCCUNGNHOM: 1 },
            { ID: o.strDaoTao_HocPhan_Id + '.02', SOLOPTHUOCCUNGNHOM: 2 }
        ] } };
    },
    'DKH_DangKy/DangKyHocTrucTiep': function (o) {
        return { rows: [], message: /HPPK02/.test(o.strDangKy_LopHocPhan_Ids) ? 'Trùng lịch với lớp đã đăng ký' : 'Đăng ký thành công', raw: { Id: 'DKPK' } };
    }
});
