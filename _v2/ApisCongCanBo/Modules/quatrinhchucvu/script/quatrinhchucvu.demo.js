/* Dữ liệu mẫu cho quatrinhchucvu — chỉ dùng ở chế độ dựng thử.
   Cơ cấu tổ chức, NS.QUDI, NS.DMCV, NS_Files có sẵn trong assets/js/demo-data.js. */
(function () {
    var ROWS = [
        { ID: 'QTCV1', CHUCVU_ID: 'CV4', CHUCVU_TEN: 'Trưởng bộ môn', CHUCVU_CU_ID: 'CV1', DAOTAO_COCAUTOCHUC_ID: 'CC2',
          DAOTAO_COCAUTOCHUC_TEN: 'Bộ môn Hệ thống thông tin', DAOTAO_COCAUTOCHUC_CU_ID: 'CC2', HESO: '0.3',
          LOAIQUYETDINH_ID: 'QD1', NHANSU_THONGTINQUYETDINH_ID: 'TTQD1', NHANSU_TTQUYETDINH_SOQD: '125/QĐ-ĐHHN',
          NHANSU_TTQUYETDINH_NGAYQD: '15/08/2022', NHANSU_TTQUYETDINH_NGAYHL: '01/09/2022', NHANSU_TTQUYETDINH_NGAYAD: '01/09/2022',
          NHANSU_TTQUYETDINH_NGAYHHL: '31/08/2027', GHICHU: 'Nhiệm kỳ 2022–2027' },
        { ID: 'QTCV2', CHUCVU_ID: 'CV2', CHUCVU_TEN: 'Phó trưởng khoa', CHUCVU_CU_ID: 'CV4', DAOTAO_COCAUTOCHUC_ID: 'CC1',
          DAOTAO_COCAUTOCHUC_TEN: 'Khoa Công nghệ thông tin', DAOTAO_COCAUTOCHUC_CU_ID: 'CC2', HESO: '0.4',
          LOAIQUYETDINH_ID: 'QD1', NHANSU_THONGTINQUYETDINH_ID: 'TTQD2', NHANSU_TTQUYETDINH_SOQD: '88/QĐ-ĐHHN',
          NHANSU_TTQUYETDINH_NGAYQD: '20/06/2025', NHANSU_TTQUYETDINH_NGAYHL: '01/07/2025', NHANSU_TTQUYETDINH_NGAYAD: '01/07/2025',
          NHANSU_TTQUYETDINH_NGAYHHL: '', GHICHU: '' }
    ];
    var seq = 3;

    ums.demo.add({
        'NS_QT_ChucVu/LayDanhSach': function () { return ROWS.slice(); },
        'NS_QT_ChucVu/LayChiTiet': function (o) { return ROWS.filter(function (r) { return r.ID === o.strId; }); },
        'NS_QT_ChucVu/ThemMoi': function (o) {
            var id = 'QTCV' + (seq++);
            ROWS.push({ ID: id, CHUCVU_ID: o.strChucVu_Id, CHUCVU_TEN: o.strChucVu_Id, HESO: o.dHeSo,
                LOAIQUYETDINH_ID: o.strLoaiQuyetDinh_Id, NHANSU_TTQUYETDINH_SOQD: o.strSoQuyetDinh,
                NHANSU_TTQUYETDINH_NGAYQD: o.strNgayQuyetDinh, NHANSU_TTQUYETDINH_NGAYHL: o.strNgayBatDauApDung,
                NHANSU_TTQUYETDINH_NGAYAD: o.strNgayBatDauApDung, NHANSU_TTQUYETDINH_NGAYHHL: o.strNgayKetThucNhiemKy,
                GHICHU: o.strGhiChu });
            return { rows: [], raw: { Id: id } };
        },
        'NS_QT_ChucVu/CapNhat': function (o) { return { rows: [], raw: { Id: o.strId } }; },
        'NS_QT_ChucVu/Xoa': function (o) {
            ROWS = ROWS.filter(function (r) { return r.ID !== o.strIds; });
            return [];
        }
    });
})();
