/* =========================================================================
   Kế hoạch dịch vụ vé tháng (bản CÁN BỘ) — khung chung ums.svVe (_kehoach.js)
   Bản gốc: ApisSinhVien/Modules/vexe/html/vethang.html + script/vethang.js. Khác hẳn màn Cổng SV
   ApisCongSinhVien/xebus/vethang (sinh viên TỰ đăng ký vé) — không dùng lại khung _xebus.js, không sửa gì ở đó.
   ---------------------------------------------------------------------------
   Lời gọi (SV_VeThang/, chép nguyên tên tham số):
     LayDSKeHoach_DichVu_Ve (GET, strTuKhoa) · Them_ / Sua_ / Xoa_KeHoach_DichVu_Ve
     Loại vé: LayDSKeHoach_DichVu_LoaiVe (GET) · Them_ / Sua_KeHoach_DichVu_LoaiVe (strLoaiVe_Id, strMoTa, dNam,
              dThang + strThang = CÙNG ô tháng như gốc) · Xoa_KeHoach_DichVu_LoaiVe
     Mức phí: LayDSKeHoach_DichVu_Phi (GET) · Them_ / Sua_KeHoach_DichVu_Phi (strLoaiVe_Id, strTaiChinh_CacKhoanThu_Id,
              dSoTien, strMoTa) · Xoa_Sua_KeHoach_DichVu_Phi (tên thủ tục gốc)
     Phạm vi: LayDSKeHoach_Dich_Ve_PhamVi (GET) · Them_KeHoach_Dich_Ve_PhamVi · Xoa_KeHoach_Dich_Ve_PhamVi
     Kết quả đăng ký: LayDSQLSV_KeHoach_Ve_DangKy (GET, strQLSV_KeHoach_DichVu_Ve_Id, strQLSV_NguoiHoc_Id '')
     Danh mục: QLSV.VE.LOAI (loại vé) · TC_KhoanThu/LayDanhSach (loại khoản, pageSize 10000)
   Giữ như gốc: dòng có Loại vé mới gửi; dòng mới → Them_, dòng đã lưu → Sua_ (cả khi không đổi gì).
   Mẫu báo cáo: dHieuLuc rỗng, strDiem_KeHoachCongNhan_Id = từng kế hoạch đã chọn (như gốc).
   Lỗi gốc đã sửa: bảng danh sách lệch cột Hiệu lực (như xebus) → xếp theo tiêu đề; validInputForm ô không có → bỏ.
   Bỏ: nút "Xóa" chung của hai khối (không có xử lý), nút "Tìm học phần" không có trên màn, các hàm chết
   (TN_KeHoach_NhanSu / TN_KeHoach_PhamVi / DKH_Chung / KHCT_NamNhapHoc, getList_NH_LoaiVe / getList_NH_Phi đã bị
   chú thích bỏ ở gốc).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('sv-vethang');
    if (!root) return;
    var V = ums.svVe, C = 'SV_VeThang/', uid = V.uid;
    var ID = 'strQLSV_KeHoach_DichVu_Ve_Id';
    function khoa(o, id) { o[ID] = id; return o; }
    var LOAIVE = { dm: 'QLSV.VE.LOAI' };
    var KHOANTHU = { load: function () {
        return ums.api.call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 10000,
            strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '', silent: true }).then(function (r) { return V.arr(r.data); });
    } };

    V.man(root, {
        tieuDe: 'Kế hoạch dịch vụ vé tháng', ctl: C, idKey: ID,
        ds: 'LayDSKeHoach_DichVu_Ve', them: 'Them_KeHoach_DichVu_Ve', sua: 'Sua_KeHoach_DichVu_Ve', xoa: 'Xoa_KeHoach_DichVu_Ve',
        pv: { ds: 'LayDSKeHoach_Dich_Ve_PhamVi', them: 'Them_KeHoach_Dich_Ve_PhamVi', xoa: 'Xoa_KeHoach_Dich_Ve_PhamVi' },
        luoi: [
            {
                title: 'Loại vé', icon: 'fa-ticket', addText: 'Thêm dòng',
                columns: [
                    { key: 'strLoaiVe_Id', col: 'LOAIVE_ID', title: 'Loại vé', type: 'select', source: LOAIVE, placeholder: 'Chọn loại vé' },
                    { key: 'dNam', col: 'NAM', title: 'Năm', width: '110px' },
                    { key: 'dThang', col: 'THANG', title: 'Tháng', width: '110px' },
                    { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' }
                ],
                list: function (id) { return khoa({ action: C + 'LayDSKeHoach_DichVu_LoaiVe', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }, id); },
                filled: function (v) { return !!v.strLoaiVe_Id; },
                save: function (v, rec, id) {
                    return khoa({ action: C + (rec ? 'Sua_KeHoach_DichVu_LoaiVe' : 'Them_KeHoach_DichVu_LoaiVe'), method: 'POST', strId: rec ? rec.ID : '',
                        strLoaiVe_Id: v.strLoaiVe_Id, strMoTa: v.strMoTa, dNam: v.dNam, dThang: v.dThang, strThang: v.dThang, strNguoiThucHien_Id: uid() }, id);
                },
                remove: function (rec) { return { action: C + 'Xoa_KeHoach_DichVu_LoaiVe', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
            },
            {
                title: 'Mức phí áp dụng', icon: 'fa-money-bill', addText: 'Thêm dòng',
                columns: [
                    { key: 'strLoaiVe_Id', col: 'LOAIVE_ID', title: 'Loại vé', type: 'select', source: LOAIVE, placeholder: 'Chọn loại vé' },
                    { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', title: 'Loại khoản', type: 'select', s2: true,
                      source: KHOANTHU, placeholder: 'Chọn loại khoản' },
                    { key: 'dSoTien', col: 'SOTIEN', title: 'Phí', width: '140px' },
                    { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' }
                ],
                list: function (id) { return khoa({ action: C + 'LayDSKeHoach_DichVu_Phi', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid() }, id); },
                filled: function (v) { return !!v.strLoaiVe_Id; },
                save: function (v, rec, id) {
                    return khoa({ action: C + (rec ? 'Sua_KeHoach_DichVu_Phi' : 'Them_KeHoach_DichVu_Phi'), method: 'POST', strId: rec ? rec.ID : '',
                        strLoaiVe_Id: v.strLoaiVe_Id, strMoTa: v.strMoTa, dSoTien: v.dSoTien, strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id,
                        strNguoiThucHien_Id: uid() }, id);
                },
                remove: function (rec) { return { action: C + 'Xoa_Sua_KeHoach_DichVu_Phi', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
            }
        ],
        ketQua: {
            call: function (row) { return khoa({ action: C + 'LayDSQLSV_KeHoach_Ve_DangKy', method: 'GET', strQLSV_NguoiHoc_Id: '', strNguoiThucHien_Id: uid() }, row.ID); },
            columns: V.cotSV.concat([
                { title: 'Loại vé', prop: 'LOAIVE_TEN' },
                { title: 'Phí', prop: 'SOTIEN', cls: 'is-right is-nowrap' }
            ])
        }
    });
})();
