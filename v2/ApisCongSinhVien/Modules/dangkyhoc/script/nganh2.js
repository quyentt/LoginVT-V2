/* =========================================================================
   Đăng ký học ngành 2, 3… (Cổng sinh viên)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/nganh2.html + script/nganh2.js
   ---------------------------------------------------------------------------
   Người học = ums.session.userId (vai trò thủ vai: vỏ đã chọn người học trước).
   Lời gọi (chép nguyên action / func / tham số):
       pkg_dangkyhoc_nganh2.LayDSChuongTrinhNguoiHoc     → ô Chương trình (chọn sẵn mục đầu)
       pkg_dangkyhoc_nganh2.LayDSKeHoachTheoNguoiHoc     → ô Kế hoạch theo chương trình (chọn sẵn mục đầu)
       pkg_dangkyhoc_nganh2.LayDSNganhMoDangKy           → Data.{ rsNganhMo (được mở), rsKetQua (đã đăng ký) }
       pkg_dangkyhoc_nganh2.Them_DangKy_Nganh_Tiep_KetQua  dòng được chọn (radio) ở bảng 1
       pkg_dangkyhoc_nganh2.Xoa_DangKy_Nganh_Tiep_KetQua   "Hủy đăng ký" — mỗi dòng đánh dấu ở bảng 2
   Bố cục giữ nguyên: MỘT cột — thanh lọc, bảng được mở + Đăng ký, bảng đã đăng ký + Hủy.
   Khung chung: script/_dangkyds.js (ums.dkhDs) — dùng chung với dinhhuong.
   Khác bản gốc:
     · Bản gốc nạp Chương trình, Kế hoạch, danh sách CÙNG LÚC khi mở màn (bất đồng
       bộ — Kế hoạch và danh sách đi với chương trình còn TRỐNG) → nạp lần lượt:
       Chương trình → Kế hoạch → danh sách, đúng ý "chọn sẵn mục đầu".
     · "Đăng ký" khi chưa chọn dòng: bản gốc lỗi JS (aData undefined) → báo.
     · Luật chung cha → con: chưa chọn Chương trình thì khoá Kế hoạch; xoá Chương
       trình thì xoá Kế hoạch và đưa hai bảng về trống.
     · Bỏ khối "Thông tin mô tả / tệp đính kèm" (đã chú thích bỏ trong html gốc) và
       ô "chọn tất cả" của bảng 1 (chú thích bỏ — bảng 1 chọn một).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var A = 'DKH_Nganh2_MH/', P = 'pkg_dangkyhoc_nganh2.';
    var root = document.getElementById('dkh-nganh2');
    var svId = (ums.session && ums.session.userId) || '';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var ds = ums.dkhDs(root, {
        title: 'Đăng ký học ngành 2,3...',
        filters: [{ key: 'ct', label: 'Chọn chương trình' }, { key: 'kh', label: 'Chọn kế hoạch' }],
        xem: { text: 'Xem', icon: 'fa-list-check' },
        radio: 'inputChuaDangKy',
        mo: { title: 'Danh sách chương trình được mở đăng ký', icon: 'fa-list-check', empty: 'Chưa có chương trình được mở đăng ký',
            columns: [
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
                { title: 'Ngành học', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                { title: 'Lớp dự kiến', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Tình trạng đủ điều kiện', prop: 'TINHTRANGDUDIEUKIEN', cls: 'is-center' },
                { title: 'Kết quả duyệt', prop: 'KETQUADUYET', cls: 'is-center' }
            ] },
        da: { title: 'Danh sách đã đăng ký', icon: 'fa-clipboard-check', empty: 'Chưa đăng ký chương trình nào',
            columns: [
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
                { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                { title: 'Lớp dự kiến', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Tình trạng đủ điều kiện', prop: 'TINHTRANGDUDIEUKIEN', cls: 'is-center' },
                { title: 'Kết quả duyệt', prop: 'KETQUADUYET', cls: 'is-center' }
            ] },
        tai: function (f) {
            return ums.api.call({ action: A + 'DSA4BRIPJiAvKQwuBSAvJgo4', func: P + 'LayDSNganhMoDangKy',
                strQLSV_NguoiHoc_Id: svId, strDaoTao_ChuongTrinh_Id: f('ct').value,
                strQLSV_DangKy_Nganh_Tiep_Id: f('kh').value, strNguoiThucHien_Id: uid() })
                .then(function (r) { var d = r.data || {}; return { mo: d.rsNganhMo, da: d.rsKetQua }; });
        },
        chuaChon: 'Vui lòng chọn đối tượng?',
        dangKy: function (r) {
            return { action: A + 'FSkkLB4FIC8mCjgeDyYgLykeFSgkMR4KJDUQNCAP', func: P + 'Them_DangKy_Nganh_Tiep_KetQua',
                strQLSV_DangKy_Nganh_Tiep_Id: ds.f('kh').value, strDaoTao_ChuongTrinh_Id: ds.f('ct').value,
                strQLSV_NguoiHoc_Id: svId, strQLSV_NguoiHoc_DK_Id: svId,
                strDaoTao_KhoaDaoTao_DK_Id: r.DAOTAO_KHOADAOTAO_ID, strDaoTao_ChuongTrinh_DK_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID,
                strDaoTao_LopQuanLy_DK_Id: r.DAOTAO_LOPQUANLY_ID, strNguoiThucHien_Id: uid() };
        },
        dangKyOk: 'Thêm mới thành công!',
        huy: function (r) {
            return { action: A + 'GS4gHgUgLyYKOB4PJiAvKR4VKCQxHgokNRA0IAPP', func: P + 'Xoa_DangKy_Nganh_Tiep_KetQua',
                strId: r.ID, strNguoiThucHien_Id: uid() };
        },
        huyOk: 'Xóa thành công!'
    });
    var fCt = ds.f('ct'), fKh = ds.f('kh');

    function taiKeHoach() {
        if (!fCt.value) { pat.fill(fKh, []); return Promise.resolve(); }
        return ums.api.call({ action: A + 'DSA4BRIKJAkuICIpFSkkLg8mNC4oCS4i', func: P + 'LayDSKeHoachTheoNguoiHoc',
            strDaoTao_ChuongTrinh_Id: fCt.value, strQLSV_NguoiHoc_Id: svId, strNguoiThucHien_Id: uid() })
            .then(function (r) { var d = arr(r.data); pat.fill(fKh, d, { name: 'TENKEHOACH' }); ds.chonDau(fKh, d); chuoi.sync(); })
            .catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    }
    function taiChuongTrinh() {
        return ums.api.call({ action: A + 'DSA4BRICKTQuLyYVMygvKQ8mNC4oCS4i', func: P + 'LayDSChuongTrinhNguoiHoc',
            strQLSV_NguoiHoc_Id: svId, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var d = arr(r.data);
                pat.fill(fCt, d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN' });
                ds.chonDau(fCt, d, 'DAOTAO_TOCHUCCHUONGTRINH_ID'); chuoi.sync();
            }).catch(function (err) { ums.api.handle(err, 'chương trình'); });
    }

    if (window.jQuery) {
        /* Bản gốc: chọn chương trình → nạp kế hoạch + danh sách; chọn kế hoạch → danh sách */
        jQuery(fCt).on('select2:select', function () { taiKeHoach().then(ds.tai); });
        jQuery(fKh).on('select2:select', function () { ds.tai(); });
        /* Xoá ô lọc: con bị xoá (pat.chain), hai bảng về trống */
        jQuery(fCt).on('select2:clear', function () { pat.fill(fKh, []); ds.xoa(); });
        jQuery(fKh).on('select2:clear', function () { ds.xoa(); });
    }
    var chuoi = pat.chain([fCt, fKh], { phatLai: false });

    taiChuongTrinh().then(taiKeHoach).then(ds.tai);
})();
