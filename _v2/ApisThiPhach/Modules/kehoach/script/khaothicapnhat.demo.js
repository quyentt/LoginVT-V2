/* Dữ liệu mẫu cho khaothicapnhat (Thi phách) — chỉ dùng ở chế độ dựng thử. */
(function () {
    function ct(id, ma, ho, ten, lop, dst, hp, maHP, tt, sbd) {
        return { ID: id, IDDANHSACHTHI: 'DST' + dst, QLSV_NGUOIHOC_MASO: ma, QLSV_NGUOIHOC_HODEM: ho, QLSV_NGUOIHOC_TEN: ten, DAOTAO_LOPQUANLY_TEN: lop,
            DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin K23', LANHOC: 1, LANTHI: 1, THI_DANHSACHTHI_TEN: 'DST-IT2030-0' + dst,
            DAOTAO_HOCPHAN_TEN: hp, DAOTAO_HOCPHAN_MA: maHP, HINHTHUCTHI_TEN: 'Tự luận', TRANGTHAI: tt, SOBAODANH: sbd };
    }
    var DS = [
        ct('CT01', 'BIT230101', 'Nguyễn Hoàng', 'An', 'CNTT23A', 1, 'Cấu trúc dữ liệu và giải thuật', 'IT2030', '', '001'),
        ct('CT02', 'BIT230145', 'Trần Thị Minh', 'Châu', 'CNTT23A', 1, 'Cấu trúc dữ liệu và giải thuật', 'IT2030', 'Vắng thi có phép', '002'),
        ct('CT03', 'BIT230178', 'Lê Quốc', 'Dũng', 'CNTT23B', 1, 'Cấu trúc dữ liệu và giải thuật', 'IT2030', 'Đình chỉ thi', '003'),
        ct('CT04', 'BIT230190', 'Phạm Thu', 'Hà', 'CNTT23B', 2, 'Cấu trúc dữ liệu và giải thuật', 'IT2030', '', '004'),
        ct('CT05', 'BIT230233', 'Vũ Ngọc', 'Lan', 'CNTT23C', 2, 'Cấu trúc dữ liệu và giải thuật', 'IT2030', 'Vắng thi không phép', '005')
    ];
    function vp(ma, sbd, ho, ten, tt, lyDo) {
        return { QLSV_NGUOIHOC_MASO: ma, SOBAODANH: sbd, QLSV_NGUOIHOC_HODEM: ho, QLSV_NGUOIHOC_TEN: ten, DAOTAO_CHUONGTRINH_TEN: 'Công nghệ thông tin K23',
            DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DAOTAO_HOCPHAN_MA: 'IT2030', NGAYTHI: '12/01/2027', TRANGTHAI: tt, LYDO: lyDo };
    }
    var NUT = [{ ID: 'ST1', TEN: 'Vắng thi có phép', THONGTIN1: 'fa fa-user-times', THONGTIN2: 'color: #ef6c00' },
        { ID: 'ST2', TEN: 'Vắng thi không phép', THONGTIN1: 'fa fa-ban', THONGTIN2: 'color: #c62828' },
        { ID: 'ST3', TEN: 'Đình chỉ thi', THONGTIN1: 'fa fa-gavel', THONGTIN2: 'color: #c62828' },
        { ID: 'ST4', TEN: 'Bình thường', THONGTIN1: '', THONGTIN2: '' }];
    ums.demo.add({
        'TP_ToChucThi/LayDSThoiGian': [{ ID: 'TG1', THOIGIAN: '2026_2027_1' }, { ID: 'TG2', THOIGIAN: '2025_2026_2' }],
        'TP_ToChucThi/LayDSThanhPhanDiemSauThi': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'LD1', TEN: 'Điểm thi kết thúc học phần' }, { ID: 'LD2', TEN: 'Điểm thi lại' }] : [];
        },
        'TP_ToChucThi/LayDSDotThi': function (o) {
            return o.strDaoTao_ThoiGianDaoTao_Id ? [{ ID: 'DT1', TENDOTTHI: 'Đợt thi chính học kỳ 1', NGAYBD: '05/01/2027', NGAYKT: '25/01/2027' },
                { ID: 'DT2', TENDOTTHI: 'Đợt thi phụ học kỳ 1', NGAYBD: '20/02/2027', NGAYKT: '28/02/2027' }] : [];
        },
        'TP_ToChucThi/LayDSHocPhan': function (o) {
            return o.strTHI_DotThi_Id ? [{ ID: 'HP1', DAOTAO_HOCPHAN_TEN: 'Cấu trúc dữ liệu và giải thuật', DAOTAO_HOCPHAN_MA: 'IT2030' },
                { ID: 'HP2', DAOTAO_HOCPHAN_TEN: 'Toán cao cấp 2', DAOTAO_HOCPHAN_MA: 'MA1020' }] : [];
        },
        'TP_ToChucThi/LayDSCaThi': function (o) { return o.strTHI_DotThi_Id ? [{ ID: 'CA1', CATHI_TEN: 'Ca 1 (07:30)' }, { ID: 'CA2', CATHI_TEN: 'Ca 2 (09:30)' }] : []; },
        'TP_ToChucThi/LayDSThi': function (o) {
            return o.strTHI_DotThi_Id ? [{ ID: 'DST1', MADANHSACHTHI: 'DST-IT2030-01', NGAYTHI: '12/01/2027', THI_CATHI_TEN: 'Ca 1', TKB_PHONGHOC_TEN: 'A2-301' },
                { ID: 'DST2', MADANHSACHTHI: 'DST-IT2030-02', NGAYTHI: '13/01/2027', THI_CATHI_TEN: 'Ca 2', TKB_PHONGHOC_TEN: 'A2-302' }] : [];
        },
        'TP_ToChucThi/LayDSThiChiTietTheoDieuKien': function (o) {
            var q = String(o.strTuKhoa || '').toLowerCase();
            return DS.filter(function (x) {
                if (o.strThi_DanhSachThi_Id && x.IDDANHSACHTHI !== o.strThi_DanhSachThi_Id) return false;
                return !q || (x.QLSV_NGUOIHOC_MASO + ' ' + x.QLSV_NGUOIHOC_HODEM + ' ' + x.QLSV_NGUOIHOC_TEN).toLowerCase().indexOf(q) >= 0;
            });
        },
        'TP_Chung/LayTrangThaiSauThi': NUT,
        'TP_Chung/LayTrangThaiCongBoLich': [{ ID: 'CB1', TEN: 'Công bố', THONGTIN1: 'fa fa-bullhorn', THONGTIN2: 'color: #2e7d32' },
            { ID: 'CB2', TEN: 'Hủy công bố', THONGTIN1: 'fa fa-undo', THONGTIN2: 'color: #c62828' }],
        'TP_XacNhanSauThi/LayDanhSach': [
            { ID: 'LS1', TINHTRANG_TEN: 'Vắng thi có phép', NOIDUNG: 'Có đơn xin hoãn thi', NGUOIXACNHAN_TENDAYDU: 'Đỗ Thị Hạnh', NGAYTAO_DD_MM_YYYY: '13/01/2027' }],
        'TP_XacNhanSauThi/ThemMoi': [],
        'TP_CongBoLichThi/Them_CongBoLichThi_DotThi': [],
        'TP_BaoCao/LayDSViPhamQuyCheTruocThi': [vp('BIT230178', '003', 'Lê Quốc', 'Dũng', 'Cấm thi', 'Nghỉ quá 20% số tiết'),
            vp('BIT230260', '011', 'Hoàng Văn', 'Khôi', 'Cấm thi', 'Chưa hoàn thành học phí')],
        'TP_BaoCao/LayDSViPhamQuyCheSauThi': [vp('BIT230233', '005', 'Vũ Ngọc', 'Lan', 'Vắng thi không phép', 'Không có mặt tại phòng thi'),
            vp('BIT230145', '002', 'Trần Thị Minh', 'Châu', 'Khiển trách', 'Mang tài liệu vào phòng thi')]
    });
})();
