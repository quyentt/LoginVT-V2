/* =========================================================================
   luanvan — ba màn PHẢN BIỆN: khoaphanbien, duyetdexuat, pbxacnhan — ums.lv.phanBien(root, kieu)
   Bản gốc: khoaphanbien.js (dùng cho CẢ khoaphanbien.html và duyetdexuat.html) và pbxacnhan.js
   (chép khoaphanbien.js 96%). Ba màn cùng danh sách, chỉ khác khung chi tiết và bộ xác nhận.
   ---------------------------------------------------------------------------
   Danh sách: LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_Duyet GET strBV_KeHoach_Id, strNguoiThucHien_Id
     (không phân trang); kế hoạch LayDSKeHoachTheoNguoiDung. Cột "Tình trạng GVHD" = BV_XACNHAN_HD_TEN + nút Xác nhận.
   Xác nhận (mã sản phẩm có BV_KEHOACH_DETAI_ID):
     khoaphanbien, duyetdexuat  LayDSBV_XacNhan_PhanBienQ / Them_BV_XacNhan_PhanBienQ · BV.TINHTRANG.XACNHANPHANBIENQUYEN
     pbxacnhan                  LayDSBV_XacNhan_PB / Them_BV_XacNhan_PB · PB.TINHTRANG.XACNHAN.TRUOCKHILAPHOIDONG
   Chi tiết (bản gốc: modal "Đề xuất phản biện"):
     khoaphanbien  "Phản biện đề xuất" SỬA ĐƯỢC (cán bộ · vai trò PHANBIEN · tệp) + "Lưu toàn bộ":
                   Them_/Sua_BV_KeHoach_NH_GiaoDT_PB, Xoa_…_PB; strBV_Kehoach_NH_GiaoDT_Id = ID dòng danh sách.
     duyetdexuat   "Phản biện đề xuất" CHỈ XEM (html gốc bỏ "Thêm" và nút lưu) + "Tạo quyết định" + "Duyệt đề xuất PB"
     pbxacnhan     "Hướng dẫn" + "Phản biện đề xuất" CHỈ XEM (không nút lưu, không tải tệp) + hai nút như trên;
                   vai trò qua LVLA_BV_Chung/LayDSBV_VaiTro_PhanLoai (bản không mã hoá, như gốc).
   Khác bản gốc (ghi ở can-quyet.js):
     · Mở chi tiết gốc KHÔNG nạp danh sách phản biện đã có (chỉ nạp lại sau khi Lưu) → nạp ngay.
     · khoaphanbien: nút "Xác nhận" mở hộp KHÔNG có trong html gốc (bấm không hiện gì) → nay hiện hộp.
     · pbxacnhan: nút "Thêm dòng" có nhưng không có nút lưu, không gắn tải tệp → bỏ (chỉ xem).
     · "Tạo quyết định": nút Lưu không có xử lý ở gốc → khoá (ums.lv.hopQuyetDinh).
     · "Duyệt đề xuất PB": gốc là khung mẫu (Lớp "T5K6", nội dung chép cứng) → hiện dữ liệu thật; "Duyệt" → hộp Xác nhận.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, L = ums.lv, e = L.e;
    function esc(s) { return ui.esc(s); }

    var KIEU = {
        khoaphanbien: { tieuDe: 'Khoa phân phản biện', xn: { loai: 'PhanBienQ', dm: 'BV.TINHTRANG.XACNHANPHANBIENQUYEN' }, sua: true },
        duyetdexuat: { tieuDe: 'Duyệt đề xuất phản biện', xn: { loai: 'PhanBienQ', dm: 'BV.TINHTRANG.XACNHANPHANBIENQUYEN' }, duyet: true },
        pbxacnhan: { tieuDe: 'Phản biện xác nhận', xn: { loai: 'PB', dm: 'PB.TINHTRANG.XACNHAN.TRUOCKHILAPHOIDONG' }, duyet: true, huongDan: true }
    };

    L.phanBien = function (root, kieu) {
        var K = KIEU[kieu];
        function xacNhan(r, ctx) {
            L.xacNhan({ loai: K.xn.loai, dm: K.xn.dm, sanPham: L.sanPham(r), onDone: function () { ctx.tai(); } });
        }
        L.man(root, {
            tieuDe: K.tieuDe,
            tieuDeChiTiet: kieu === 'khoaphanbien' ? 'Đề xuất phản biện' : K.tieuDe,
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
            chiTiet: function (r, khung, ctx) {
                var h = khung.host;
                h.innerHTML = L.thongTin(r, { tinhTrang: e(r.BV_XACNHAN_HD_TEN) }) +
                    (K.huongDan ? ums.pat.panel({ title: 'Hướng dẫn', icon: 'fa-chalkboard-user', flush: true, zone: 'hd', cls: 'lv-khoi' }) : '') +
                    (K.sua ? '<div class="lv-khoi" data-lv="pb"></div>'
                        : ums.pat.panel({ title: 'Phản biện đề xuất', icon: 'fa-user-tie', flush: true, zone: 'pb', cls: 'lv-khoi' }));

                if (K.sua) {
                    var g = L.luoiNguoi(h.querySelector('[data-lv="pb"]'), { loai: 'PB', sv: r, tieuDe: 'Phản biện đề xuất', nhan: 'Người phản biện',
                        vaiTro: L.vaiTro(r.PHANLOAI_ID, 'PHANBIEN') });
                    g.load(r.ID);
                    L.nut(khung, ui.btn('save', { text: 'Lưu toàn bộ', attr: { 'data-lv-a': 'luu' } }));
                    khung.el.addEventListener('click', function (ev) {
                        if (!ev.target.closest('[data-lv-a="luu"]')) return;
                        g.save(r.ID).then(function () { ui.toast('Cập nhật thành công', 'ok'); g.load(r.ID); });
                    });
                    return null;
                }

                /* Chỉ xem: tên người / vai trò lấy từ danh sách cán bộ và vai trò (gốc vẽ ô chọn đặt sẵn giá trị) */
                var vt = kieu === 'pbxacnhan' ? L.vaiTro(r.PHANLOAI_ID) : L.vaiTro(r.PHANLOAI_ID, 'PHANBIEN');
                Promise.all([L.canBo(), vt]).then(function (ds) {
                    var o = { ten: function (x) { return (e(x.NGUOIDUNG_HODEM) + ' ' + e(x.NGUOIDUNG_TEN)).trim() || L.tenTheoId(ds[0], x.NGUOIDUNG_ID, L.tenCanBo); },
                        vaiTro: function (x) { return L.tenTheoId(ds[1], x.VAITRO_ID, function (v) { return e(v.TEN); }); } };
                    var zPB = h.querySelector('[data-z="pb"]'), zHD = h.querySelector('[data-z="hd"]');
                    zPB.innerHTML = L.DANG_TAI;
                    L.dsNguoi('PB', r.ID, r).then(function (rows) { L.bangNguoi(zPB, rows, Object.assign({ nhan: 'Người phản biện', empty: 'Chưa có phản biện đề xuất' }, o)); })
                        .catch(function (err) { zPB.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phản biện'); });
                    if (zHD) {
                        zHD.innerHTML = L.DANG_TAI;
                        L.dsNguoi('HD', r.ID, r).then(function (rows) { L.bangNguoi(zHD, rows, Object.assign({ nhan: 'Người hướng dẫn', empty: 'Chưa có người hướng dẫn' }, o)); })
                            .catch(function (err) { zHD.innerHTML = ui.fail(err.message); ums.api.handle(err, 'người hướng dẫn'); });
                    }
                });
                L.nut(khung, ui.btn('save', { text: kieu === 'pbxacnhan' ? 'Tạo QĐ' : 'Tạo quyết định', icon: 'fa-file-signature', mod: 'out-success', attr: { 'data-lv-a': 'qd' } }) +
                    ui.btn('save', { text: 'Duyệt đề xuất PB', icon: 'fa-list-check', mod: 'primary', attr: { 'data-lv-a': 'duyet' } }));
                khung.el.addEventListener('click', function (ev) {
                    var a = ev.target.closest('[data-lv-a]');
                    if (!a) return;
                    if (a.getAttribute('data-lv-a') === 'qd') L.hopQuyetDinh(r, khung);
                    else L.hopDuyet(r, function () { xacNhan(r, ctx); });
                });
                return null;
            }
        });
    };
})();
