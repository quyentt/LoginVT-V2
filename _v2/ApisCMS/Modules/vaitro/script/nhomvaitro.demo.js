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
        /* Danh mục nhóm "nhomvaitro": fixture chung ở assets/js/demo-data.js (trang chủ cũng dùng) */
        'CMS_QuanLyNguoiDung/SuaVaiTro': function (o) {
            var r = vt(o.strId);
            if (r) r.MOTA = o.strMoTa;
            return { rows: [], message: 'Cập nhật thành công' };
        }
    });
})();
