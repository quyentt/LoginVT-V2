/* =========================================================================
   GVHD xác nhận — GVHD cập nhật tiến độ (cổng cán bộ)
   Bản gốc: ApisCongCanBo/Modules/luanvan/html/gvhdxacnhan.html + script/gvhdxacnhan.js
   ---------------------------------------------------------------------------
   Danh sách: LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_Duyet (như các màn phản biện) — khung ums.lv.man.
   Xác nhận: LayDSBV_XacNhan_HD / Them_BV_XacNhan_HD · HD.TINHTRANG.XACNHANHUONGDAN · mã sản phẩm có đề tài.
   Chi tiết (bản gốc modal "GVHD cập nhật tiến độ"):
     "Thành viên" (người hướng dẫn) CHỈ XEM — LayDSBV_KH_NG_GiaoDeTai_HD
     "Tiến độ" SỬA ĐƯỢC — LayDSBV_KeHoach_NH_GiaoDT_TD; Them_/Sua_BV_KeHoach_NH_GiaoDT_TD POST strId,
       strNguoiDung_Id (= người đăng nhập), strBV_KeHoach_Id, strBV_Kehoach_NH_GiaoDT_Id (= ID dòng danh sách),
       strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id, strTuNgay, strDenNgay, strNoiDung; Xoa_…_TD POST strId.
       Dòng không có Nội dung thì bỏ qua (như gốc). Tệp LVLA_Files.
   Khác bản gốc (ghi ở can-quyet.js):
     · Bảng "Thành viên" gốc đổ tên từ QLSV_NGUOIHOC_HODEM/TEN (tên NGƯỜI HỌC) → tên người hướng dẫn
       (NGUOIDUNG_HODEM/TEN, thiếu thì tra danh sách cán bộ).
     · Xác nhận xong gốc gọi hàm không tồn tại (lỗi JS) → nạp lại danh sách.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, L = ums.lv, e = L.e;
    var root = document.getElementById('luanvan-gvhdxacnhan');
    if (!root) return;

    function xacNhan(r, ctx) {
        L.xacNhan({ loai: 'HD', dm: 'HD.TINHTRANG.XACNHANHUONGDAN', sanPham: L.sanPham(r), onDone: function () { ctx.tai(); } });
    }
    L.man(root, {
        tieuDe: 'GVHD xác nhận',
        tieuDeChiTiet: 'GVHD cập nhật tiến độ',
        keHoach: 'nguoiDung',
        list: function (kh) { return { action: L.KH + 'LayDSBV_KH_NG_GiaoDeTai_Duyet', strBV_KeHoach_Id: kh, strNguoiThucHien_Id: L.uid() }; },
        columns: function () {
            return L.cotSV().concat([
                { title: 'Đề tài', prop: 'BV_KEHOACH_DETAI_TEN' },
                { title: 'Quyết định', prop: 'QLSV_QUYETDINH_SOQD', cls: 'is-center' },
                { title: 'Lý do điều chỉnh', prop: 'LYDODIEUCHINH' },
                { title: 'Tình trạng GVHD', cls: 'is-center', render: function (r) { return L.oXacNhan(r, r.BV_XACNHAN_HD_TEN); } },
                L.cotChon()
            ]);
        },
        onXacNhan: xacNhan,
        chiTiet: function (r, khung) {
            var h = khung.host;
            h.innerHTML = L.thongTin(r, { tinhTrang: e(r.BV_XACNHAN_HD_TEN) }) +
                ums.pat.panel({ title: 'Thành viên', icon: 'fa-chalkboard-user', flush: true, zone: 'hd', cls: 'lv-khoi' }) +
                '<div class="lv-khoi" data-lv="td"></div>';

            var zHD = h.querySelector('[data-z="hd"]');
            zHD.innerHTML = L.DANG_TAI;
            Promise.all([L.canBo(), L.dsNguoi('HD', r.ID, r)]).then(function (ds) {
                L.bangNguoi(zHD, ds[1], { nhan: 'Thành viên', empty: 'Chưa có người hướng dẫn', ten: function (x) {
                    return (e(x.NGUOIDUNG_HODEM) + ' ' + e(x.NGUOIDUNG_TEN)).trim() || L.tenTheoId(ds[0], x.NGUOIDUNG_ID, L.tenCanBo) ||
                        (e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)).trim();
                } });
            }).catch(function (err) { zHD.innerHTML = ui.fail(err.message); ums.api.handle(err, 'người hướng dẫn'); });

            var g = ums.pat.rows(h.querySelector('[data-lv="td"]'), {
                title: 'Tiến độ', icon: 'fa-list-check', addText: 'Thêm dòng',
                columns: [
                    { key: 'strNoiDung', col: 'NOIDUNG', title: 'Nội dung' },
                    { key: 'strTuNgay', col: 'TUNGAY', title: 'Từ ngày', type: 'date', width: '150px' },
                    { key: 'strDenNgay', col: 'DENNGAY', title: 'Đến ngày', type: 'date', width: '150px' },
                    { key: '_ngay', col: 'NGAYTAO_DD_MM_YYYY_HHMMSS', title: 'Ngày tạo', type: 'static', cls: 'is-nowrap' },
                    { key: '_nguoi', col: 'NGUOITAO_TENDAYDU', title: 'Người tạo', type: 'static' },
                    { key: '_tep', title: 'File', type: 'files', api: 'LVLA_Files' }
                ],
                list: function (pid) {
                    return { action: L.KH + 'LayDSBV_KeHoach_NH_GiaoDT_TD', method: 'GET', strBV_Kehoach_NH_GiaoDT_Id: pid, strBV_KeHoach_Id: r.BV_KEHOACH_ID,
                        strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: L.uid() };
                },
                filled: function (v) { return !!v.strNoiDung; },
                save: function (v, rec, pid) {
                    return { action: L.KH + (rec ? 'Sua_' : 'Them_') + 'BV_KeHoach_NH_GiaoDT_TD', method: 'POST', strId: rec ? rec.ID : '',
                        strNguoiDung_Id: L.uid(), strBV_KeHoach_Id: r.BV_KEHOACH_ID, strBV_Kehoach_NH_GiaoDT_Id: pid, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                        strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strTuNgay: v.strTuNgay, strDenNgay: v.strDenNgay, strNoiDung: v.strNoiDung,
                        strNguoiThucHien_Id: L.uid() };
                },
                remove: function (rec) { return { action: L.KH + 'Xoa_BV_KeHoach_NH_GiaoDT_TD', strId: rec.ID, strNguoiThucHien_Id: L.uid() }; }
            });
            g.load(r.ID);
            L.nut(khung, ui.btn('save', { text: 'Lưu toàn bộ', attr: { 'data-lv-a': 'luu' } }));
            khung.el.addEventListener('click', function (ev) {
                if (!ev.target.closest('[data-lv-a="luu"]')) return;
                g.save(r.ID).then(function () { ui.toast('Cập nhật thành công', 'ok'); g.load(r.ID); });
            });
            return null;
        }
    });
})();
