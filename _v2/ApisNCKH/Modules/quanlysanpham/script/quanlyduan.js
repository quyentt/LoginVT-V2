/* =========================================================================
   Quản lý dự án (NCKH) — hai cột: danh sách dự án bên trái, biểu mẫu kê khai bên phải
   Bản gốc: ApisNCKH/Modules/quanlysanpham/html/quanlyduan.html + script/QuanLyDuAn.js (852 dòng; tệp trên đĩa quanlyduan.js)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, GET/POST như gốc):
     NCKH_QuanLyDuAn/LayDanhSach GET  strTuKhoa · strThanhVien_Id (ô Thành viên) · strNCKH_TinhDiem_KeHoach_Id (ô Năm đánh giá)
         · strDaoTao_CoCauToChuc_Id (ô Đơn vị) · strNguoiThucHien_Id · trang máy chủ
     NCKH_QuanLyDuAn/ThemMoi | CapNhat POST  strChucNang_Id · strNCKH_TinhDiem_KeHoach_Id (ô Năm đánh giá ở cột trái, như gốc)
         · strTenDuAn · strDonViChuTri_Id · strNhaTaiTro '' (gốc đọc txtAAAA) · strTuNgay · strDenNgay · strMucDich_PhamVi_NoiDung
         · strKetQuaDuAn · dMoU · strDonViKyKetMoU · strThoiHanKyKetMoU · strNguoiThucHien_Id
     NCKH_QuanLyDuAn/Xoa POST strIds
     NCKH_ThanhVien/LayDanhSach · ThemMoi (strSanPham_Id, strThanhVien_Id, strVaiTro_Id, dTyLeThamGia '', strNCKH_TinhDiem_KeHoach_Id)
         · Xoa — khối ums.nckh.thanhVien của Cổng cán bộ (vai trò NCKH.VTDT, hộp chọn nhân sự chung)
     Đơn vị chủ trì / ô lọc Đơn vị: pkg_nhansu_hoso_v2.LayDanhSachToanBo (edu.system.getList_CoCauToChuc) — TEN
     Ô lọc Thành viên: NS_HoSoV2/LayDanhSach theo Đơn vị (ums.nckhDt.ganDonVi) · Năm đánh giá: NCKH_TinhDiem_KeHoach/LayDanhSach
   Khác bản gốc / TỰ CHỐT (ghi báo cáo):
     · Lỗi gốc: CapNhat KHÔNG gửi strId (máy chủ không biết sửa dòng nào) → nay gửi strId = ID dự án đang sửa.
     · Lỗi gốc: ô từ khoá có trên màn nhưng strTuKhoa đọc ô txtAAAA không tồn tại (luôn rỗng) → nay gửi từ khoá.
     · "Lưu và Nhập tiếp": gốc chỉ xoá trắng biểu mẫu (không lưu) dù chữ nút là "Lưu và…" → nay lưu rồi xoá trắng.
     · Tên dự án bắt buộc (gốc có dấu (*), arrValid khai nhầm ô của màn Hội nghị hội thảo nên không kiểm).
     · Mục ở cột trái không còn thùng rác (luật 12) → nút Xoá trong biểu mẫu.
     · Khung "Thành viên ngoài trường" gốc ẨN hẳn (display:none) → thành viên ngoài trường (nếu có) hiện chung một bảng để còn xoá được.
     · Ô Thành viên lọc theo Đơn vị: lọc "Tất cả …" tuỳ chọn → KHÔNG khoá; đổi Đơn vị thì xoá chọn Thành viên.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, N = ums.nckh, D = ums.nckhDt;
    var root = document.getElementById('nckh-quanlyduan');
    if (!root || !N || !D) return;
    var e = N.e, uid = N.uid, esc = ui.esc;

    var srcDonVi = { call: { action: 'NS_HoSo_V2_MH/DSA4BSAvKRIgIikVLiAvAy4P', func: 'pkg_nhansu_hoso_v2.LayDanhSachToanBo',
        dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' }, name: 'TEN' };
    var tv = N.thanhVien({ vaiTro: 'NCKH.VTDT', tieuDeTrong: 'Thành viên trong trường tham gia', tuThem: false });
    function nam() { var s = root.querySelector('[data-scope="filter"][data-k="nam"]'); return s ? s.value : ''; }

    var crud = ums.crud({
        root: root, title: 'Quản lý dự án', formTitle: 'thông tin dự án', icon: 'fa-diagram-project', autoload: false,
        master: { title: 'Danh sách sản phẩm', icon: 'fa-list-ul', item: function (r) { return '<div class="nk-ten">' + esc(e(r.TENDUAN)) + '</div>'; },
            empty: 'Hôm nay bạn có sản phẩm mới không? Bấm Thêm mới ở đầu trang.' },
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'donVi', type: 'select', label: 'Tất cả đơn vị thành viên' },
            { key: 'thanhVien', type: 'select', label: 'Tất cả thành viên đăng ký' },
            { key: 'nam', type: 'select', label: 'Tất cả năm đánh giá', source: D.srcNam }
        ],
        list: { paged: true, call: function (f) {
            return { action: 'NCKH_QuanLyDuAn/LayDanhSach', method: 'GET', strTuKhoa: e(f.q), strThanhVien_Id: e(f.thanhVien),
                strNCKH_TinhDiem_KeHoach_Id: e(f.nam), strDaoTao_CoCauToChuc_Id: e(f.donVi), strNguoiThucHien_Id: uid() };
        } },
        fields: [
            { type: 'legend', label: 'Thông tin dự án' },
            { key: 'strTenDuAn', col: 'TENDUAN', label: 'Tên dự án', required: true },
            { key: 'strDonViChuTri_Id', col: 'DONVICHUTRI_ID', label: 'Đơn vị chủ trì', type: 'select', placeholder: 'Chọn đơn vị', source: srcDonVi },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' },
            { key: 'dMoU', col: 'MOU', label: 'MoU', type: 'select', value: '1', source: { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] } },
            { key: 'strDonViKyKetMoU', col: 'DONVIKYKETMOU', label: 'Đơn vị ký MoU' },
            { key: 'strThoiHanKyKetMoU', col: 'THOIHANKYKETMOU', label: 'Thời hạn' },
            { type: 'gap' },
            { key: 'strMucDich_PhamVi_NoiDung', col: 'MUCDICH_PHAMVI_NOIDUNG', label: 'Nội dung', type: 'textarea', span: true },
            { key: 'strKetQuaDuAn', col: 'KETQUADUAN', label: 'Kết quả', type: 'textarea', span: true }
        ],
        saveAgain: 'Lưu và Nhập tiếp',
        save: function (v, row) {
            var p = { action: 'NCKH_QuanLyDuAn/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strChucNang_Id: N.chucNang(),
                strNCKH_TinhDiem_KeHoach_Id: nam(), strTenDuAn: v.strTenDuAn, strDonViChuTri_Id: v.strDonViChuTri_Id, strNhaTaiTro: '',
                strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strMucDich_PhamVi_NoiDung: v.strMucDich_PhamVi_NoiDung,
                strKetQuaDuAn: v.strKetQuaDuAn, dMoU: v.dMoU, strDonViKyKetMoU: v.strDonViKyKetMoU, strThoiHanKyKetMoU: v.strThoiHanKyKetMoU,
                strNguoiThucHien_Id: uid() };
            if (row) p.strId = row.ID;
            return p;
        },
        remove: function (ids) { return ids.map(function (id) { return { action: 'NCKH_QuanLyDuAn/Xoa', method: 'POST', strIds: id, strNguoiThucHien_Id: uid() }; }); },
        multi: false,
        onForm: function (row, c, extra) {
            if (!extra) return;
            extra.innerHTML = '<div data-nk-khoi>' + tv.html + '</div>';
            tv.gan(extra.querySelector('[data-nk-khoi]'), c);
            if (row) tv.nap(row); else tv.moi();
        },
        /* Lưu thành viên NGAY (đọc danh sách trước khi "Lưu và Nhập tiếp" xoá trắng biểu mẫu) */
        onSaved: function (c, result, isEdit) {
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (id) tv.luu(id, isEdit, { nam: nam() });
        }
    });
    D.ganDonVi(crud, 'donVi', 'thanhVien', { khoa: true });
    crud.sourcesReady.then(function () { crud.load(1); });
})();
