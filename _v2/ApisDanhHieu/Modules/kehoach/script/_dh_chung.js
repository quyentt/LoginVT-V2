/* =========================================================================
   Danh hiệu — khung dùng chung của hai màn (ums.dhKh)
       kehoach.html (Kế hoạch xét danh hiệu) · thuchienxet.html (Thực hiện xét)
   Bản gốc: ApisDanhHieu/Modules/kehoach/script/{kehoach,thuchienxet}.js — hai tệp chép từ Học bổng
   (kehoach 90%, thuchienxet 93%; Luận văn chép lại thuchienxet của màn này 98%) nên dựng trên CHÍNH khung
   Học bổng ums.hbKh (ApisHocBong/Modules/kehoach/script/_kh_chung.js: học kỳ, cột người học, hộp danh sách,
   cột nhân sự phân công) + ums.khxl (Xử lý học vụ: ô đánh dấu, hỏi lại hàng loạt, hộp học tập).
   Khác Học bổng CHỈ ở bộ lời gọi: controller HB_XepLoaiDanhHieu/*, khoá strXLDH_KeHoach_Id, cột nối kết quả
   XLDH_KETQUA_ID, ô lọc "Loại danh hiệu" thay "Quỹ học bổng".
   ---------------------------------------------------------------------------
   D.XL                        'HB_XepLoaiDanhHieu/'
   D.napLoai(els)              HB_XepLoaiDanhHieu/LayDSXLDH_NguoiDung_PhanLoai GET strNguoiThucHien_Id → cột TEN,
                               đầu "Chọn loại danh hiệu" (cbGenCombo_LoaiDanhHieu — đổ vào cả ô lọc lẫn ô biểu mẫu)
   D.dsKeHoach(thamSo)         HB_XepLoaiDanhHieu/LayDSXLDH_KeHoach GET — màn truyền đúng bộ tham số của mình
   D.napPhanCong(host, dòng)   cột "Nhân sự phân công xét": H.napPhanCong với action LayDSXLDH_KeHoach_NhanSu,
                               khoá strXLDH_KeHoach_Id (getList_PhanCong — mỗi kế hoạch một lời gọi, như gốc)
   D.hopDoiTuong(kh)           hộp "Danh sách sinh viên xét" (#myModal của cả hai màn — getList_QuanSoTheoLop /
                               getList_DoiTuong): LayDSXLDH_KeHoach_PhamVi GET strTuKhoa '' · strQLSV_NguoiHoc_Id ''
                               · strXLDH_KeHoach_Id · strDaoTao_ChuongTrinh_Id '' · strNguoiThucHien_Id · pageIndex · pageSize
                               (phân trang máy chủ — gốc kehoach ghi tên hàm phân trang sai, thuchienxet có)
   D.hopKetQua(kh, o)          hộp danh sách sinh viên đạt / "Xem kết quả": LayDSXLDH_KetQua GET strTuKhoa ''
                               · strXLDH_KeHoach_Id · strNguoiThucHien_Id · pageIndex · pageSize; cột người học + xếp loại.
                               o.chiTiet = true → thêm cột động LayDSXLDH_KetQua_ChiTiet (rsCot / rsDuLieu nối bằng
                               XLDH_KETQUA_ID — khác Học bổng HB_KETQUA_ID); o.title đổi tiêu đề.
   ========================================================================= */
(function () {
    'use strict';

    var pat = ums.pat;
    var H = ums.hbKh, K = H.K;
    var D = ums.dhKh = ums.dhKh || {};

    D.XL = 'HB_XepLoaiDanhHieu/';
    D.H = H;
    D.K = K;

    D.napLoai = function (els) {
        return ums.api.call({ action: D.XL + 'LayDSXLDH_NguoiDung_PhanLoai', method: 'GET', strNguoiThucHien_Id: H.uid() })
            .then(function (r) {
                var ds = K.ds(r);
                els.forEach(function (el) { pat.fill(el, ds, { name: 'TEN', head: 'Chọn loại danh hiệu' }); });
                return ds;
            }).catch(function (err) { ums.api.handle(err, 'loại danh hiệu'); });
    };

    D.dsKeHoach = function (p) {
        var c = { action: D.XL + 'LayDSXLDH_KeHoach', method: 'GET' };
        Object.keys(p || {}).forEach(function (k) { c[k] = p[k]; });
        return ums.api.call(c);
    };

    D.napPhanCong = function (host, rows) {
        return H.napPhanCong(host, rows, { action: D.XL + 'LayDSXLDH_KeHoach_NhanSu', khoa: 'strXLDH_KeHoach_Id' });
    };

    D.hopDoiTuong = function (kh) {
        return H.hopDS({
            title: 'Danh sách sinh viên xét', phanTrang: true, tim: false,
            call: function (p, s) {
                return { action: D.XL + 'LayDSXLDH_KeHoach_PhamVi', method: 'GET',
                    strTuKhoa: '', strQLSV_NguoiHoc_Id: '', strXLDH_KeHoach_Id: kh.ID, strDaoTao_ChuongTrinh_Id: '',
                    strNguoiThucHien_Id: H.uid(), pageIndex: p, pageSize: s };
            },
            columns: function () { return H.cotSV({ hocTap: true }); }
        });
    };

    D.hopKetQua = function (kh, o) {
        o = o || {};
        return H.hopDS({
            title: o.title || 'Danh sách sinh viên', phanTrang: true, tim: false, khoaKQ: 'XLDH_KETQUA_ID',
            chiTiet: o.chiTiet ? { action: D.XL + 'LayDSXLDH_KetQua_ChiTiet', method: 'GET', strXLDH_KeHoach_Id: kh.ID } : null,
            call: function (p, s) {
                return { action: D.XL + 'LayDSXLDH_KetQua', method: 'GET',
                    strTuKhoa: '', strXLDH_KeHoach_Id: kh.ID, strNguoiThucHien_Id: H.uid(), pageIndex: p, pageSize: s };
            },
            columns: function () { return H.cotSV({ hocTap: true }).concat(H.cotXepLoai()); }
        });
    };
})();
