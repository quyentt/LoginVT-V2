/* Dữ liệu mẫu cho _hd_chung.js (đề tài sinh viên / giảng dạy / hướng dẫn sau đại học / hướng dẫn giảng dạy — ApisNCKH)
   — chỉ dùng ở chế độ dựng thử. Danh mục NCKH.* đã có ở ApisCongCanBo/…/_sanpham.demo.js. */
(function () {
    function map(o) {
        var r = {};
        Object.keys(o).forEach(function (k) { if (/^(str|d|i)[A-Z]/.test(k)) r[k.replace(/^(str|d|i)/, '').replace(/_n$/, '_N').toUpperCase()] = o[k]; });
        return r;
    }
    var XN = { KETQUAXACNHAN_TEN: 'Đã xác nhận', KETQUAXACNHAN_THONGTIN1: 'fa fa-check-circle', KETQUAXACNHAN_THONGTIN2: 'color:#198754', KETQUAXACNHAN_NOIDUNG: 'Đủ minh chứng' };
    ums.demo.crudStore('NCKH_SP_QuanLyDeTaiSinhVien', [
        Object.assign({ ID: 'DTSV1', TENDETAI: 'Nhận diện khuôn mặt để điểm danh lớp học', NAMTHUCHIEN: '2025', NAMNGHIEMTHU: '2026', DIEMNGHIEMTHU: '9.2',
            XEPLOAI_ID: 'NCKHXLDT0', XEPLOAI_TEN: 'Xuất sắc', QUYETDINHPHEDUYET: '112/QĐ-ĐHCN', QUYETDINHNGHIEMTHU: '58/QĐ-ĐHCN', MOTA: 'Nhóm Nguyễn Minh Anh, Lê Hoàng Nam' }, XN),
        { ID: 'DTSV2', TENDETAI: 'Ứng dụng IoT theo dõi chất lượng không khí ký túc xá', NAMTHUCHIEN: '2026', XEPLOAI_ID: 'NCKHXLDT1', XEPLOAI_TEN: 'Tốt', MOTA: 'Trần Thu Hà' },
        { ID: 'DTSV3', TENDETAI: 'Chatbot tư vấn tuyển sinh', NAMTHUCHIEN: '2026', MOTA: 'Phạm Quốc Bảo' }
    ], { map: map, list: function (rows, o) {
        return rows.filter(function (r) { return (!o.strXepLoai_Id || r.XEPLOAI_ID === o.strXepLoai_Id) && (!o.strTuKhoa || r.TENDETAI.toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0); });
    } });
    ums.demo.crudStore('NCKH_SP_HuongDan_GiangDay', [
        Object.assign({ ID: 'GD1', TENDETAI_GIANGDAY: 'Học máy nâng cao', MOTA: 'Cao học KHMT K32', THOIGIANBATDAU: '02/2026', THOIGIANKETTHUC: '05/2026',
            NAMNGHIEMTHU: '2026', PHANLOAI_ID: 'HDGD1', PHANLOAI_TEN: 'Giảng dạy', GIANGVIEN_HD_GD: 'Nguyễn Văn Hùng', NOIDUNG_HD_GD: 'Giảng lý thuyết 30 tiết',
            NGUOITHUCHIEN_TENDAYDU: 'Trần Thị Mai' }, XN),
        { ID: 'GD2', TENDETAI_GIANGDAY: 'Phương pháp nghiên cứu khoa học', MOTA: 'NCS khoá 2025', THOIGIANBATDAU: '09/2025', THOIGIANKETTHUC: '12/2025',
            NAMNGHIEMTHU: '2025', PHANLOAI_ID: 'HDGD1', PHANLOAI_TEN: 'Giảng dạy', NGUOITHUCHIEN_TENDAYDU: 'Trần Thị Mai' },
        Object.assign({ ID: 'HD1', TENDETAI_GIANGDAY: 'Phát hiện gian lận thi trực tuyến bằng học sâu', MOTA: 'Lê Văn Tâm (học viên cao học)', THOIGIANBATDAU: '01/2025',
            THOIGIANKETTHUC: '12/2025', NAMNGHIEMTHU: '2026', PHANLOAI_ID: 'HDGD2', PHANLOAI_TEN: 'Hướng dẫn', GIANGVIEN_HD_GD: 'Nguyễn Văn Hùng',
            VAITRO_HD_GD: 'Hướng dẫn chính', NGUOITHUCHIEN_TENDAYDU: 'Trần Thị Mai' }, XN),
        { ID: 'HD2', TENDETAI_GIANGDAY: 'Tối ưu lịch thi bằng giải thuật di truyền', MOTA: 'Phạm Thu Trang (NCS)', THOIGIANBATDAU: '03/2024',
            THOIGIANKETTHUC: '03/2027', PHANLOAI_ID: 'HDGD2', PHANLOAI_TEN: 'Hướng dẫn', NGUOITHUCHIEN_TENDAYDU: 'Trần Thị Mai' }
    ], { map: map, list: function (rows, o) {
        return rows.filter(function (r) { return (!o.strPhanLoai_Id || r.PHANLOAI_ID === o.strPhanLoai_Id) &&
            (!o.strTuKhoa || r.TENDETAI_GIANGDAY.toLowerCase().indexOf(String(o.strTuKhoa).toLowerCase()) >= 0); });
    } });

    /* Người theo sản phẩm — giữ trạng thái để thử thêm / xoá */
    function nguoi(hang, id) { return { ID: 'R' + id, ANH: '', HODEM: hang[0], TEN: hang[1], MASO: hang[2], LATHANHVIENCUATRUONG: 1 }; }
    var GV = { DTSV1: [Object.assign(nguoi(['Nguyễn Văn', 'Hùng', 'CB001'], 'GVS1'), { SINHVIEN_ID: 'CB1' })] };
    var SVDT = { DTSV1: [Object.assign(nguoi(['Nguyễn Minh', 'Anh', 'SV2201'], 'SVS1'), { SINHVIEN_ID: 'SV0001', VAITRO_TEN: 'Hướng dẫn chính' })] };
    var GVGD = { GD1: [Object.assign(nguoi(['Nguyễn Văn', 'Hùng', 'CB001'], 'GD1'), { GIANGVIEN_ID: 'CB1', NOIDUNGGIANGDAY: '3 tháng', THOIGIAN: 'Giảng lý thuyết 30 tiết' })] };
    var GVHD = { HD1: [Object.assign(nguoi(['Nguyễn Văn', 'Hùng', 'CB001'], 'HDR1'), { GIANGVIEN_ID: 'CB1', VAITRO_TEN: 'Chủ nhiệm' })] };
    var HV = { GD1: [nguoi(['Lê Văn', 'Tâm', 'HV2501'], 'HV1')], HD1: [nguoi(['Lê Văn', 'Tâm', 'HV2501'], 'HV2')] };
    function ds(kho, khoa) { return function (o) { return (kho[o[khoa]] || []).slice(); }; }
    function xoa(kho, khoa, cot) { return function (o) { Object.keys(kho).forEach(function (k) { kho[k] = kho[k].filter(function (x) { return x[cot] !== o[khoa]; }); }); return []; }; }
    function them(kho, khoaSp, khoaNguoi, dung) {
        return function (o) {
            var l = kho[o[khoaSp]] || (kho[o[khoaSp]] = []);
            String(o[khoaNguoi] || '').split('#').filter(Boolean).forEach(function (id, i) { l.push(dung(o, id, i)); });
            return [];
        };
    }
    function moi(id, them2) { return Object.assign({ ID: 'N' + Date.now() + Math.random().toString(16).slice(2, 6), HODEM: 'Người', TEN: 'mới', MASO: id, LATHANHVIENCUATRUONG: 1 }, them2 || {}); }
    ums.demo.add({
        'NCKH_SP_QLDTSV_GiangVien/LayDanhSach': ds(GV, 'strNCKH_SP_SinhVien_DeTai_Id'),
        'NCKH_SP_QLDTSV_GiangVien/ThemMoi': them(GV, 'strNCKH_SP_QuanLyDeTaiSV_Id', 'strDanhSachGV_Ids', function (o, id) { return moi(id, { SINHVIEN_ID: id }); }),
        'NCKH_SP_QLDTSV_GiangVien/Xoa': xoa(GV, 'strIds', 'ID'),
        'NCKH_SP_QLDTSV_SinhVien/LayDanhSach': ds(SVDT, 'strNCKH_SP_SinhVien_DeTai_Id'),
        'NCKH_SP_QLDTSV_SinhVien/ThemMoi': them(SVDT, 'strNCKH_SP_QuanLyDeTaiSV_Id', 'strDanhSachSV_Ids', function (o, id) { return moi(id, { SINHVIEN_ID: id, VAITRO_TEN: o.strVaiTro_Ids ? 'Đã chọn vai trò' : '' }); }),
        'NCKH_SP_QLDTSV_SinhVien/Xoa': xoa(SVDT, 'strIds', 'ID'),
        'NCKH_SP_HDGD_GiangVien_GD/LayDanhSach': ds(GVGD, 'strNCKH_SP_HD_GD_Id'),
        'NCKH_SP_HDGD_GiangVien_GD/ThemMoi': them(GVGD, 'strNCKH_SP_HD_GD_Id', 'strGiangVien_Ids', function (o, id, i) {
            return moi(id, { GIANGVIEN_ID: id, NOIDUNGGIANGDAY: String(o.strNoiDung || '').split('#')[i] || '', THOIGIAN: String(o.strThoiGian || '').split('#')[i] || '' }); }),
        'NCKH_SP_HDGD_GiangVien_GD/Xoa': xoa(GVGD, 'strIds', 'ID'),
        'NCKH_SP_HDGD_GiangVien_GD/Xoa_GiangVien': xoa(GVGD, 'strGiangVien_Ids', 'GIANGVIEN_ID'),
        'NCKH_SP_HDGD_GiangVien_HD/LayDanhSach': ds(GVHD, 'strNCKH_SP_HD_GD_Id'),
        'NCKH_SP_HDGD_GiangVien_HD/ThemMoi': them(GVHD, 'strNCKH_SP_HD_GD_Id', 'strGiangVien_Ids', function (o, id) { return moi(id, { GIANGVIEN_ID: id, VAITRO_TEN: o.strVaiTro_Ids ? 'Đã chọn vai trò' : '' }); }),
        'NCKH_SP_HDGD_GiangVien_HD/Xoa': xoa(GVHD, 'strIds', 'ID'),
        'NCKH_SP_HDGD_GiangVien_HD/Xoa_GiangVien': xoa(GVHD, 'strGiangVien_Ids', 'GIANGVIEN_ID'),
        'NCKH_SP_HDGD_SinhVien/LayDanhSach': ds(HV, 'strNCKH_SP_HD_GD_Id'),
        'NCKH_SP_HDGD_SinhVien/ThemMoi': them(HV, 'strNCKH_SP_HD_GD_Id', 'strSinhVien_Ids', function (o, id) { return moi(id); }),
        'NCKH_SP_HDGD_SinhVien/Xoa_SinhVien': xoa(HV, 'strSinhVien_Ids', 'ID')
    });
})();
