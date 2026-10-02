/* Dữ liệu mẫu cho baocaoimport — chỉ dùng ở chế độ dựng thử. Cây: nhóm báo cáo → mẫu báo cáo / import (lá). */
(function () {
    var K = ums.demo.pqKho;
    ums.demo.add({
        'CMS_UngDung/LayDanhSach': [
            { ID: 'UD1', TENUNGDUNG: 'Tài chính' },
            { ID: 'UD2', TENUNGDUNG: 'Đào tạo' },
            { ID: 'UD3', TENUNGDUNG: 'Nhân sự' }
        ],
        'CMS_PhanQuyen_ThongTinChung/LayDSChucNangCanPhanQuyen': function (o) {
            return o.strUngDung_Id ? [
                { ID: 'PQBC1', MA: 'BAOCAO', PHANQUYEN_CHUCNANG_TEN: 'Báo cáo theo mẫu' },
                { ID: 'PQBC2', MA: 'IMPORT', PHANQUYEN_CHUCNANG_TEN: 'Import theo mẫu' }
            ] : [];
        },
        'CMS_PhanQuyen_ThongTinChung/LayDSNguoiDungTheoChucNang': function () { return ums.demo.pqNguoiDung.slice(); },
        'CMS_PhanQuyen_ThongTin/LayDSBaoCaoChuaPhanQuyen': [
            { ID: 'BC9', MA: 'TC_BC09', TEN: 'Báo cáo công nợ theo lớp' },
            { ID: 'BC10', MA: 'TC_BC10', TEN: 'Báo cáo miễn giảm học phí' }
        ],
        'CMS_PhanQuyen_ThongTin/LayDSCauTrucPhanQuyenBaoCao': [
            { THANHPHAN_ID: 'NBC1', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Báo cáo thu học phí' },
            { THANHPHAN_ID: 'BC1', THANHPHAN_CHA_ID: 'NBC1', THANHPHAN_TEN: 'TC_BC01 - Tổng hợp thu theo khoản' },
            { THANHPHAN_ID: 'BC2', THANHPHAN_CHA_ID: 'NBC1', THANHPHAN_TEN: 'TC_BC02 - Danh sách sinh viên nợ học phí' },
            { THANHPHAN_ID: 'NBC2', THANHPHAN_CHA_ID: null, THANHPHAN_TEN: 'Mẫu import' },
            { THANHPHAN_ID: 'BC3', THANHPHAN_CHA_ID: 'NBC2', THANHPHAN_TEN: 'IMP_DANOP - Import dữ liệu đã nộp' }
        ],
        'CMS_PhanQuyen_ThongTin/LayDSQuyenBaoCaoTheoNguoiDung': function (o) {
            return K.dong(ums.demo.pqNguoiDung.map(function (x) { return x.ID; }), function (nd) { return K.co(nd, o.strBaoCao_Id, ''); });
        },
        'CMS_PhanQuyen_MauImport/ThemMoi': function (o) { K.them(o.strNguoiDung_Id, o.strMauImport_Id, ''); return []; },
        'CMS_PhanQuyen_MauImport/Xoa': function (o) { K.xoaId(o.strIds); return []; }
    });
    K.them('ND01', 'BC1', ''); K.them('ND02', 'BC1', ''); K.them('ND03', 'BC3', '');
})();
