/* Dữ liệu mẫu cho Quy định hồ sơ áp dụng — chỉ dùng ở chế độ dựng thử. */
(function () {
    var KH1 = 'Thu học phí sinh viên nhập học 2025-2026';
    var DS = [
        { ID: 'AD1', THUTU: 1, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH1', NHAPHOC_KEHOACHNHAPHOC_TEN: KH1,
          LOAIHOSO_ID: 'HS1', LOAIHOSO_TEN: 'Học bạ THPT (bản sao)', TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', SOLUONG: 1,
          PHANCAPAPDUNG_ID: 'PC1', PHAMVIAPDUNG_ID: 'CTKTPM' },
        { ID: 'AD2', THUTU: 2, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH1', NHAPHOC_KEHOACHNHAPHOC_TEN: KH1,
          LOAIHOSO_ID: 'HS3', LOAIHOSO_TEN: 'Ảnh 3x4', TINHCHATHOSO_ID: 'TC2', TINHCHATHOSO_TEN: 'Không bắt buộc', SOLUONG: 6,
          PHANCAPAPDUNG_ID: 'PC2', PHAMVIAPDUNG_ID: 'L1' },
        { ID: 'AD3', THUTU: 1, NHAPHOC_KEHOACHNHAPHOC_ID: 'NHKH2', NHAPHOC_KEHOACHNHAPHOC_TEN: 'Nhập học bổ sung đợt 2 năm 2025',
          LOAIHOSO_ID: 'HS4', LOAIHOSO_TEN: 'Căn cước công dân (bản sao)', TINHCHATHOSO_ID: 'TC1', TINHCHATHOSO_TEN: 'Bắt buộc', SOLUONG: 2,
          PHANCAPAPDUNG_ID: '', PHAMVIAPDUNG_ID: '' }
    ];
    var OK = { rows: [], message: '' };
    ums.demo.add({
        'NH_QuyDinhHoSo_ApDung/LayDanhSach': function (o) {
            var k = o.strNHAPHOC_KeHoach_Id, q = (o.strTuKhoa || '').toLowerCase();
            var r = DS.filter(function (x) {
                return (!k || k.indexOf('NHKH') !== 0 || x.NHAPHOC_KEHOACHNHAPHOC_ID === k) && (!q || x.LOAIHOSO_TEN.toLowerCase().indexOf(q) >= 0);
            });
            return { rows: r, pager: r.length };
        },
        'NH_QuyDinhHoSo_ApDung/LayChiTiet': function (o) { return DS.filter(function (x) { return x.ID === o.strId; }); },
        'NH_QuyDinhHoSo_ApDung/ThemMoi': OK,
        'NH_QuyDinhHoSo_ApDung/CapNhat': OK,
        'NH_QuyDinhHoSo_ApDung/Xoa': OK,
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_ToChucCT': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id === 'K68' ? [{ ID: 'CTHTTT', TENCHUONGTRINH: 'Hệ thống thông tin' }]
                : [{ ID: 'CTKTPM', TENCHUONGTRINH: 'Kỹ thuật phần mềm' }, { ID: 'CTQTKD', TENCHUONGTRINH: 'Quản trị kinh doanh' }];
        },
        'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy': function (o) {
            return o.strDaoTao_KhoaDaoTao_Id === 'K68' ? [{ ID: 'L3', TEN: 'K68-HTTT1' }]
                : [{ ID: 'L1', TEN: 'K67-KTPM1' }, { ID: 'L4', TEN: 'K67-KTPM2' }, { ID: 'L2', TEN: 'K67-QTKD2' }];
        }
    });
})();
