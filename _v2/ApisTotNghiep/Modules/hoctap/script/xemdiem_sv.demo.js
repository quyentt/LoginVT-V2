/* Dữ liệu mẫu cho hoctap/xemdiem_sv (Tốt nghiệp) — chỉ dùng ở chế độ dựng thử.
   Mở thẳng màn thì không có người học (như gốc); thử bằng ums.state.tnXemDiemSV = 'SV0001' trước khi mở. */
(function () {
    'use strict';
    function tb(tgId, nam, ky, loai, thang, tc, d) {
        return {
            DAOTAO_THOIGIANDAOTAO_ID: tgId, NAMHOC: nam, DAOTAO_THOIGIANDAOTAO_KY: ky,
            THUOCTINHLANTINH: 0, DOTHOC: null, PHAMVITONGHOPDIEM_TEN: tgId ? 'HOCKY' : '',
            LOAIDIEMTRUNGBINH_MA: loai, THANGDIEM_MA: thang, TONGSOTINCHI: tc, DIEMTRUNGBINH: d
        };
    }
    function hp(id, nam, ky, ma, ten, tin, lt, diem, qd, chu, dg, ghi) {
        return {
            ID: id, NAMHOC: nam, HOCKY: ky, DAOTAO_HOCPHAN_MA: ma, DAOTAO_HOCPHAN_TEN: ten, DAOTAO_HOCPHAN_HOCTRINH: tin,
            LANHOC: 1, LANTHI: lt, DIEM: diem, DIEMQUYDOI: qd, DIEMQUYDOI_TEN: chu, DANHGIA_TEN: dg, GHICHU: ghi || ''
        };
    }
    ums.demo.add({
        'pkg_congthongtin_hssv_thongtin.KetQuaHocTapCaNhan': { rows: {
            rsThongTinNguoiHoc: [{
                QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy', QLSV_NGUOIHOC_MASO: '25001029',
                QLSV_NGUOIHOC_NGAYSINH: '14/03/2006', QLSV_NGUOIHOC_GIOITINH: 'Nam',
                QLSV_TRANGTHAINGUOIHOC_TEN: 'Đang học', DAOTAO_LOPQUANLY_TEN: 'DCOT.16.2'
            }],
            rsDiemTrungBinhChung: [
                tb(null, null, null, 'TRUNGBINHCHUNG', '10', 42, 7.64), tb(null, null, null, 'TRUNGBINHCHUNG', '4', 42, 3.05),
                tb(null, null, null, 'TRUNGBINHTICHLUY', '10', 39, 7.81), tb(null, null, null, 'TRUNGBINHTICHLUY', '4', 39, 3.18),
                tb('TG1', '2024-2025', '1', 'TRUNGBINHCHUNG', '10', 21, 7.45), tb('TG1', '2024-2025', '1', 'TRUNGBINHCHUNG', '4', 21, 2.95),
                tb('TG2', '2024-2025', '2', 'TRUNGBINHCHUNG', '10', 21, 7.83), tb('TG2', '2024-2025', '2', 'TRUNGBINHCHUNG', '4', 21, 3.15)
            ],
            rsDiemKetThucHocPhan: [
                hp('KT1', '2024-2025', '1', 'IT1110', 'Nhập môn lập trình', 3, 1, 8.0, 3.5, 'B+', 'Đạt'),
                hp('KT2', '2024-2025', '1', 'PH1110', 'Vật lý đại cương', 3, 2, 4.5, 1, 'D', 'Đạt', 'Thi lại lần 2'),
                hp('KT3', '2024-2025', '2', 'IT2110', 'Cấu trúc dữ liệu và giải thuật', 3, 1, 8.7, 4, 'A', 'Đạt'),
                hp('KT4', '2024-2025', '2', 'MI1110', 'Giải tích 1', 4, 2, 3.2, 0, 'F', 'Không đạt')
            ]
        } }
    });
})();
