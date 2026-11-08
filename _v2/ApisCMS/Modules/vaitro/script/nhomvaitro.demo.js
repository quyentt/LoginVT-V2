/* Dữ liệu mẫu cho Cấu hình nhóm vai trò — chỉ dùng ở chế độ dựng thử.
   Vai trò lấy từ _chung.demo.js (ums.cmsDemo.VT); ở đây gắn sẵn vài thẻ [nhom:…] [stt:…] vào MOTA
   và mô phỏng SuaVaiTro ghi MOTA mới vào đúng dòng (để bước đối chiếu sau khi lưu chạy được). */
(function () {
    var D = ums.cmsDemo || { VT: [] };
    function vt(id) { return D.VT.filter(function (r) { return r.ID === id; })[0]; }
    function gan(id, the) { var r = vt(id); if (r && r.MOTA.indexOf('[nhom:') < 0) r.MOTA = (r.MOTA ? r.MOTA + ' ' : '') + the; }
    gan('VT01', '[nhom:quantri] [stt:1]');
    gan('VT02', '[nhom:daotao] [stt:1]');
    gan('VT03', '[nhom:daotao] [stt:2]');
    gan('VT06', '[nhom:taichinh]');
    gan('VT08', '[nhom:cong] [stt:2]');

    ums.demo.add({
        /* Danh mục nhóm: đổi tên một nhóm có sẵn, thêm một nhóm mới có thứ tự, một dòng mã sai bị bỏ qua */
        'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM#nhomvaitro': [
            { ID: 'NVT1', MA: 'daotao', TEN: 'Đào tạo & chương trình', HESO1: 1, MOTA: '', CHUNG_TENDANHMUC_TEN: 'Nhóm vai trò' },
            { ID: 'NVT2', MA: 'thuvien', TEN: 'Thư viện', HESO1: 3, MOTA: '', CHUNG_TENDANHMUC_TEN: 'Nhóm vai trò' },
            { ID: 'NVT3', MA: 'tuyensinh', TEN: 'Quản lý tuyển sinh và sinh viên', HESO1: 2, MOTA: '', CHUNG_TENDANHMUC_TEN: 'Nhóm vai trò' },
            { ID: 'NVT4', MA: 'Nhóm lạ', TEN: 'Mã sai quy tắc', HESO1: null, MOTA: '', CHUNG_TENDANHMUC_TEN: 'Nhóm vai trò' }
        ],
        'CMS_QuanLyNguoiDung/SuaVaiTro': function (o) {
            var r = vt(o.strId);
            if (r) r.MOTA = o.strMoTa;
            return { rows: [], message: 'Cập nhật thành công' };
        }
    });
})();
