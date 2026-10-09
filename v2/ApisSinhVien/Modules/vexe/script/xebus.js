/* =========================================================================
   Kế hoạch dịch vụ xe buýt (bản CÁN BỘ) — khung chung ums.svVe (_kehoach.js)
   Bản gốc: ApisSinhVien/Modules/vexe/html/xebus.html + script/xebus.js (html gốc nạp "XeBus.js" — cùng tệp,
   IIS không phân biệt hoa thường). Khác hẳn màn Cổng SV ApisCongSinhVien/xebus (sinh viên TỰ đăng ký,
   _xebus.js) — không dùng lại được khung đó, không sửa gì ở đó.
   ---------------------------------------------------------------------------
   Lời gọi (SV_XeBus/, chép nguyên tên tham số):
     LayDSKeHoach_DichVu_XeBus (GET, strTuKhoa) · Them_ / Sua_ / Xoa_KeHoach_DichVu_XeBus
     Tháng áp dụng: LayDSKeHoach_DichVu_Thang (GET) · Them_KeHoach_DichVu_Thang (dNam, dThang) · Xoa_KeHoach_DichVu_Thang
     Tuyến xe: LayDSQLSV_XeBus_TuyenXe (GET) · Them_ / Sua_QLSV_XeBus_TuyenXe (strMa, strTen, strMoTa) · Xoa_QLSV_XeBus_TuyenXe
     Phạm vi: LayDSKeHoach_DichVu_PhamVi (GET) · Them_KeHoach_DichVu_PhamVi (strPhamViApDung_Id) · Xoa_KeHoach_DichVu_PhamVi
     Kết quả đăng ký: LayDSKeHoach_XeBus_DangKy (GET, strQLSV_KeHoach_XeBus_Id)
   Giữ như gốc:
     · Tháng áp dụng: CHỈ dòng MỚI được gửi (dòng đã lưu sửa trên màn cũng không gửi — gốc `else return`), dòng
       không có Năm bị bỏ qua. Dòng đã lưu xoá ngay (hỏi lại), dòng mới chỉ bỏ khỏi màn.
     · Tuyến xe: dòng có Mã mới gửi; dòng mới → Them_QLSV_XeBus_TuyenXe, dòng đã lưu → Sua_. Như gốc KHÔNG gửi id
       kế hoạch khi thêm tuyến (thủ tục có vẻ là danh mục tuyến dùng chung) — kiểm trên host.
     · Mẫu báo cáo: dHieuLuc rỗng (gốc đọc ô không có), strDiem_KeHoachCongNhan_Id = từng kế hoạch đã chọn.
   Lỗi gốc đã sửa:
     · Bảng danh sách: thead "Tên | Hiệu lực | Ngày BĐ | Ngày KT" nhưng dữ liệu đổ "Tên | Ngày BĐ | Ngày KT | Hiệu lực"
       (lệch cột) → xếp theo tiêu đề.
     · "Chi tiết" kết quả đăng ký CHƯA TỪNG hiện: hàm vẽ đọc biến strQLSV_KeHoach_DichVu_Ve_Id không tồn tại
       (ReferenceError). Nay hiện bảng; thead có cột "Điện thoại" mà gốc không đổ cột nào → đổ DIENTHOAILIENHE
       (cột mà Cổng SV đọc từ chính thủ tục này). Hai cột "Tuyến / Tháng đã đăng ký" gốc để ô trống chờ các lời gọi
       đã bị chú thích bỏ (getList_NH_TuyenXe gọi thủ tục VÉ THÁNG) → giữ cột, để trống, ghi sổ.
     · edu.util.validInputForm kiểm ô txtXeBus_So không có trên màn → bỏ.
   Bỏ: nút "Xóa" chung của hai khối Tháng / Tuyến (không có xử lý; mỗi dòng đã có nút xoá riêng), mọi hàm chết
   (hộp chọn kế hoạch TN_ThongTin, danh mục DKH_Chung/KHCT_NamNhapHoc, TC_KhoanThu không nơi nào dùng).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('sv-xebus');
    if (!root) return;
    var V = ums.svVe, C = 'SV_XeBus/', uid = V.uid;
    var ID = 'strQLSV_KeHoach_XeBus_Id';
    function khoa(o, id) { o[ID] = id; return o; }

    V.man(root, {
        tieuDe: 'Kế hoạch dịch vụ xe buýt', ctl: C, idKey: ID,
        ds: 'LayDSKeHoach_DichVu_XeBus', them: 'Them_KeHoach_DichVu_XeBus', sua: 'Sua_KeHoach_DichVu_XeBus', xoa: 'Xoa_KeHoach_DichVu_XeBus',
        pv: { ds: 'LayDSKeHoach_DichVu_PhamVi', them: 'Them_KeHoach_DichVu_PhamVi', xoa: 'Xoa_KeHoach_DichVu_PhamVi' },
        luoi: [
            {
                title: 'Tháng áp dụng', icon: 'fa-calendar-days', addText: 'Thêm dòng',
                columns: [{ key: 'dNam', col: 'NAM', title: 'Năm' }, { key: 'dThang', col: 'THANG', title: 'Tháng' }],
                list: function (id) { return khoa({ action: C + 'LayDSKeHoach_DichVu_Thang', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }, id); },
                filled: function (v, rec) { return !rec && !!v.dNam; },
                save: function (v, rec, id) {
                    return khoa({ action: C + 'Them_KeHoach_DichVu_Thang', method: 'POST', strId: '', dNam: v.dNam, dThang: v.dThang, strNguoiThucHien_Id: uid() }, id);
                },
                remove: function (rec) { return { action: C + 'Xoa_KeHoach_DichVu_Thang', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
            },
            {
                title: 'Tuyến xe', icon: 'fa-bus', addText: 'Thêm dòng',
                columns: [{ key: 'strMa', col: 'MA', title: 'Mã', width: '140px' }, { key: 'strTen', col: 'TEN', title: 'Tên' }, { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' }],
                list: function (id) { return khoa({ action: C + 'LayDSQLSV_XeBus_TuyenXe', method: 'GET', strNguoiThucHien_Id: uid() }, id); },
                filled: function (v) { return !!v.strMa; },
                save: function (v, rec) {
                    return { action: C + (rec ? 'Sua_QLSV_XeBus_TuyenXe' : 'Them_QLSV_XeBus_TuyenXe'), method: 'POST', strId: rec ? rec.ID : '',
                        strTen: v.strTen, strMa: v.strMa, strMoTa: v.strMoTa, strNguoiThucHien_Id: uid() };
                },
                remove: function (rec) { return { action: C + 'Xoa_QLSV_XeBus_TuyenXe', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
            }
        ],
        ketQua: {
            call: function (row) { return khoa({ action: C + 'LayDSKeHoach_XeBus_DangKy', method: 'GET', strNguoiThucHien_Id: uid() }, row.ID); },
            columns: V.cotSV.concat([
                { title: 'Điện thoại', prop: 'DIENTHOAILIENHE', cls: 'is-nowrap' },
                { title: 'Tuyến đã đăng ký', render: function () { return ''; } },
                { title: 'Tháng đã đăng ký', render: function () { return ''; } }
            ])
        }
    });
})();
