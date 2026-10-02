/* Dữ liệu mẫu cho thoikhoabieu/lichhoc (Cổng sinh viên) — chỉ dùng ở chế độ dựng thử.
   Người học đang thủ vai: SV0001. Cảm xúc và từ khoá tự điểm danh giữ trong bộ nhớ
   nên bấm +/− hay đổi mặt cười là thấy đổi ngay, như khi chạy API thật. */
(function () {
    var SV = 'SV0001';
    function hai(n) { return (n < 10 ? '0' : '') + n; }
    function dmy(d) { return hai(d.getDate()) + '/' + hai(d.getMonth() + 1) + '/' + d.getFullYear(); }
    function parse(s) { var p = String(s || '').split('/'); return new Date(+p[2], +p[1] - 1, +p[0]); }

    /* Danh sách cảm xúc + cảm xúc đang chọn của từng lớp học phần */
    var dsCamXuc = [
        { ID: 'CX1', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'happy.png' },
        { ID: 'CX2', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'neutral.png' },
        { ID: 'CX3', DG_CHUCNANG_CHUDE_CHITIET_ANH: 'unhappy.png' }
    ];
    var camXuc = {
        L1: { ID: 'CX1', SOLUONG: 4 },
        L2: { ID: 'CX2', SOLUONG: 2 },
        L3: { ID: 'CX1', SOLUONG: 0 }
    };
    function anh(id) {
        for (var i = 0; i < dsCamXuc.length; i++) if (dsCamXuc[i].ID === id) return dsCamXuc[i].DG_CHUCNANG_CHUDE_CHITIET_ANH;
        return dsCamXuc[0].DG_CHUCNANG_CHUDE_CHITIET_ANH;
    }
    function oCamXuc(o) {
        var k = o.strDiem_DanhSachHoc_Id;
        if (!camXuc[k]) camXuc[k] = { ID: 'CX1', SOLUONG: 0 };
        return camXuc[k];
    }

    var tuKhoaDiemDanh = { L1: 'OOP-2609', L2: '', L3: '' };

    var fx = {};

    /* ---- Lịch tuần: hai buổi học + một buổi thi, rải trong tuần đang xem ---- */
    fx['pkg_congthongtin_hssv_thongtin.LayDSLichCaNhan'] = function (o) {
        var a = parse(o.strNgayBatDau);
        function ngay(k) { var d = new Date(a); d.setDate(a.getDate() + k); return dmy(d); }
        return [
            { ID: 'B1', IDLICHHOC: 'LH1', IDLOPHOCPHAN: 'L1', TENHOCPHAN: 'Nguyên lý hệ điều hành', TENLOPHOCPHAN: 'IT4040.02',
              TENPHONGHOC: 'A2-401', GIANGVIEN: 'TS. Phạm Quang Huy', NGAYHOC: ngay(0), GIOBATDAU: 7, PHUTBATDAU: 0,
              GIOKETTHUC: 9, PHUTKETTHUC: 25, TIETBATDAU: 1, TIETKETTHUC: 3, THONGTINCHUYENCAN: 'Đã điểm danh 6/10 buổi' },
            { ID: 'B2', IDLICHHOC: 'LH2', IDLOPHOCPHAN: 'L2', TENHOCPHAN: 'Trí tuệ nhân tạo', TENLOPHOCPHAN: 'IT4080.01',
              TENPHONGHOC: 'B3-205', GIANGVIEN: 'ThS. Lê Thị Thu Hà', NGAYHOC: ngay(2), GIOBATDAU: 13, PHUTBATDAU: 0,
              GIOKETTHUC: 15, PHUTKETTHUC: 30, TIETBATDAU: 7, TIETKETTHUC: 9, THONGTINCHUYENCAN: '' },
            { ID: 'B3', IDLICHHOC: 'LH3', IDLOPHOCPHAN: 'L1', TENHOCPHAN: 'Nguyên lý hệ điều hành', TENLOPHOCPHAN: 'IT4040.02',
              TENPHONGHOC: 'A2-401', GIANGVIEN: 'TS. Phạm Quang Huy', NGAYHOC: ngay(3), GIOBATDAU: 9, PHUTBATDAU: 35,
              GIOKETTHUC: 12, PHUTKETTHUC: 0, TIETBATDAU: 4, TIETKETTHUC: 6, THONGTINCHUYENCAN: '' },
            { ID: 'B4', IDLICHHOC: 'LH4', IDLOPHOCPHAN: 'L3', PHANLOAI: 'LICHTHI', TENHOCPHAN: 'Cấu trúc dữ liệu và giải thuật',
              CATHI: 'Ca 2', DANGKY_LOPHOCPHAN_TEN: 'Thi trên máy', PHONGHOC_TEN: 'C1-102', TENPHONGHOC: 'C1-102',
              NGAYHOC: ngay(4), GIOBATDAU: 9, PHUTBATDAU: 30, GIOKETTHUC: 11, PHUTKETTHUC: 0 }
        ];
    };

    /* ---- Lớp học phần không có lịch chi tiết (chỉ khi đã chọn một ngày) ---- */
    fx['PKG_CONGTHONGTIN_HSSV_THONGTIN.LayTKBLopKhongCoLichChiTiet'] = function (o) {
        if (!o.strNgay) return [];
        return [
            { MALOP: 'IT4090.03', TENLOP: 'Đồ án chuyên ngành', TENHINHTHUCHOC: 'Tự nghiên cứu',
              NGAYBATDAU: '01/09/2026', NGAYKETTHUC: '31/12/2026', GHICHU: 'Sinh viên liên hệ giảng viên hướng dẫn' },
            { MALOP: 'PE1010.12', TENLOP: 'Giáo dục thể chất 1', TENHINHTHUCHOC: 'Thực hành',
              NGAYBATDAU: '05/09/2026', NGAYKETTHUC: '20/12/2026', GHICHU: '' }
        ];
    };

    /* ---- Cảm xúc ---- */
    fx['pkg_dg_camxuc_nguoihoc.LayDSCamXuc'] = dsCamXuc;
    fx['pkg_dg_camxuc_nguoihoc.LayTTMacDinh'] = function (o) {
        var c = oCamXuc(o);
        return [{ ID: c.ID, DG_CHUCNANG_CHUDE_CHITIET_ANH: anh(c.ID), SOLUONG: c.SOLUONG }];
    };
    fx['pkg_dg_camxuc_nguoihoc.Tang_CamXuc'] = function (o) { oCamXuc(o).SOLUONG++; return []; };
    fx['pkg_dg_camxuc_nguoihoc.Giam_CamXuc'] = function (o) {
        var c = oCamXuc(o);
        c.SOLUONG = Math.max(0, c.SOLUONG - 1);
        return [];
    };
    fx['pkg_dg_camxuc_nguoihoc.ThayDoi_CamXuc'] = function (o) {
        var c = oCamXuc(o);
        if (o.strDG_ChucNang_ChuDe_CT_Id) c.ID = o.strDG_ChucNang_ChuDe_CT_Id;
        return [];
    };

    /* ---- Bấm một buổi học: danh sách lớp + tự ghi nhận điểm danh ---- */
    fx['pkg_congthongtincanbo.LayDSDangKyHoc_2'] = function (o) {
        var lop = o.strDaoTao_LopHocPhan_Id;
        return [
            { QLSV_NGUOIHOC_ID: SV, QLSV_NGUOIHOC_MASO: '25001029', QLSV_NGUOIHOC_HODEM: 'Lăng Văn', QLSV_NGUOIHOC_TEN: 'Huy',
              MATLENHNGUOIHOC: tuKhoaDiemDanh[lop] || '', SOBUOIVANG: '1/3/6.7%' },
            { QLSV_NGUOIHOC_ID: 'SV0002', QLSV_NGUOIHOC_MASO: '25001030', QLSV_NGUOIHOC_HODEM: 'Trần Thị', QLSV_NGUOIHOC_TEN: 'Bích' },
            { QLSV_NGUOIHOC_ID: 'SV0003', QLSV_NGUOIHOC_MASO: '25001031', QLSV_NGUOIHOC_HODEM: 'Nguyễn Hoàng', QLSV_NGUOIHOC_TEN: 'Nam' }
        ];
    };
    fx['CC_ThongTin/Them_QLSV_NguoiHoc_TuGhiNhan'] = function (o) {
        tuKhoaDiemDanh[o.strDiem_DanhSach_Id] = o.strNoiDungTuGhiNhan || '';
        return { rows: [], message: 'Ghi nhận thành công' };
    };

    /* ---- Bấm một buổi thi: lịch thi trong tháng ---- */
    fx['pkg_congthongtin_hssv_thongtin.LayTTLichThi'] = function (o) {
        return [
            { DANGKY_LOPHOCPHAN_TEN: 'Thi trên máy', NGAYHOC: o.strNgayDangChon, GIOBATDAU: 9, PHUTBATDAU: 30,
              GIOKETTHUC: 11, PHUTKETTHUC: 0, PHONGHOC_TEN: 'C1-102', TENHOCPHAN: 'Cấu trúc dữ liệu và giải thuật' },
            { DANGKY_LOPHOCPHAN_TEN: 'Thi viết', NGAYHOC: o.strNgayDangChon, GIOBATDAU: 14, PHUTBATDAU: 0,
              GIOKETTHUC: 15, PHUTKETTHUC: 30, PHONGHOC_TEN: 'C1-205', TENHOCPHAN: 'Nguyên lý hệ điều hành' }
        ];
    };

    ums.demo.add(fx);
})();
