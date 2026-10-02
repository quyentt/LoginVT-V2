/* =========================================================================
   luanvan — ĐỀ XUẤT và DUYỆT HỘI ĐỒNG: ums.lv.hoiDong(root, 'dexuathoidong' | 'duyethoidong')
   Bản gốc: dexuathoidong.js dùng cho CẢ dexuathoidong.html và duyethoidong.html; bản duyệt chỉ khác html:
   ẩn Sửa/Xoá thành viên, ẩn Thêm/Xoá lịch, ẩn "Lưu toàn bộ", thêm nút "Duyệt" → Xác nhận.
   ---------------------------------------------------------------------------
   Danh sách: LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_Duyet; kế hoạch LayDSBV_KeHoach (dHieuLuc -1).
   Chi tiết một người học (bản gốc modal "Đề xuất hội đồng bảo vệ"):
     Hướng dẫn (chỉ xem)      LayDSBV_KH_NG_GiaoDeTai_HD
     Hội đồng                 LayDSBV_HoiDong strBV_Kehoach_NH_GiaoDT_Id (tự chọn khi chỉ một) ·
                              "Lập hội đồng mới" Them_BV_HoiDong (strTenHoiDong, strLoaiHoiDong_Id — LVLA_BV_Chung/
                              LayDSBV_NguoiDung_LoaiHoiDong) · "Xóa hội đồng" Xoa_BV_HoiDong strIds = hội đồng đang chọn
     Thành viên hội đồng      LayDSBV_KeHoach_NH_GiaoDT_BV (+ strBV_HoiDong_Id); biểu mẫu Thêm/Sửa: Đơn vị (NS_CoCauToChuc/
                              LayDanhSach — chỉ LỌC danh sách cán bộ NS_HoSoV2/LayDanhSach), Vai trò (LVLA_BV_Chung/
                              LayDSBV_VaiTro_PhanLoai), Đánh giá (BV.DANHGIA), Điểm, Nhận xét, tệp →
                              Them_/Sua_BV_KeHoach_NH_GiaoDT_BV; Xoa_…_BV strId
     Lịch bảo vệ              LayDSBV_BaoVe_Lich · Them_/Sua_BV_BaoVe_Lich (strNgay, strGio, strDiaDiem, strMoTa) · Xoa_ strId
     Kết quả                  cùng danh sách thành viên; "Lưu toàn bộ" gửi Sua_BV_KeHoach_NH_GiaoDT_BV từng dòng
                              (strId, strDanhGia_Id, dDiem, strNhanXet — CHỈ các khoá này, như gốc)
     Duyệt (duyethoidong)     Xác nhận GiaoDeTai · BV.TINHTRANG.XACNHANBAOVE · lịch sử theo mã KHÔNG có đề tài,
                              lưu theo mã CÓ đề tài (lệch nhau như gốc) — tham số lịch sử tên strsanpham_Id
   "Lập hội đồng mới" và biểu mẫu thành viên mở TRONG TRANG (ums.lv.bieuMau), thay chỗ thân khung chi tiết.
   Khác bản gốc (ghi ở can-quyet.js):
     · Biểu mẫu thành viên: gốc đặt ô Đơn vị bằng BV_KEHOACH_DETAI_ID (nhầm cột) → để trống khi sửa.
     · Thêm thành viên / lịch khi chưa có hội đồng: gốc vẫn gửi (strBV_HoiDong_Id rỗng) → báo chọn hội đồng.
     · Lịch bảo vệ: dòng trống không gửi (gốc gửi cả dòng trống).
     · Đơn vị → Thành viên KHÔNG khoá theo luật cha → con (đơn vị chỉ để lọc, gốc cho chọn thành viên khi chưa có đơn vị).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.lv, e = L.e;
    function esc(s) { return ui.esc(s); }
    var KH = L.KH;
    var VP_BO = 'Bản gốc ẩn chức năng này ở màn duyệt';

    L.hoiDong = function (root, kieu) {
        var duyet = kieu === 'duyethoidong';
        var loaiHD = null, danhGia = null, donVi = null;
        function napLoaiHD() { return loaiHD || (loaiHD = L.g(L.CH + 'LayDSBV_NguoiDung_LoaiHoiDong', { strNguoiThucHien_Id: L.uid(), silent: true }).then(function (r) { return L.arr(r.data); }, function () { return []; })); }
        function napDanhGia() { return danhGia || (danhGia = ums.api.dm('BV.DANHGIA').catch(function () { return []; })); }
        function napDonVi() { return donVi || (donVi = L.g('NS_CoCauToChuc/LayDanhSach', { strCoCauToChucCha_Id: '', dTrangThai: -1, silent: true }).then(function (r) { return L.arr(r.data); }, function () { return []; })); }

        function chiTiet(sv, khung, ctx) {
            var h = khung.host, hd = { ds: [], tv: [] };
            h.innerHTML = L.thongTin(sv, { tinhTrang: e(sv.BV_XACNHAN_GIAODETAI_TEN), lyDo: sv.QLSV_QUYETDINH_LYDO }) +
                pat.panel({ title: 'Hướng dẫn', icon: 'fa-chalkboard-user', flush: true, zone: 'hdn', cls: 'lv-khoi' }) +
                pat.panel({ title: 'Hội đồng bảo vệ', icon: 'fa-people-group', cls: 'lv-khoi', body:
                    '<div class="ums-row"><div class="ums-field ums-u-flex1 ums-u-mb-0"><select class="ums-select" data-hd="chon" data-ph="Chọn hội đồng"><option value="">Chọn hội đồng</option></select></div>' +
                    ui.btn('del', { text: 'Xóa hội đồng', mod: 'out-danger', attr: { 'data-hd-a': 'xoahd' } }) +
                    ui.btn('add', { text: 'Lập hội đồng mới', attr: { 'data-hd-a': 'laphd' } }) + '</div>' }) +
                pat.panel({ title: 'Thành viên hội đồng', icon: 'fa-users', flush: true, zone: 'tv', cls: 'lv-khoi', tools:
                    (duyet ? ui.btn('del', { text: 'Xóa', mod: 'out-danger', attr: { disabled: 'disabled', title: VP_BO } }) : ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-hd-a': 'xoatv' } })) +
                    ui.btn('add', { text: 'Thêm dòng', mod: 'out-success', attr: duyet ? { disabled: 'disabled', title: VP_BO } : { 'data-hd-a': 'themtv' } }) }) +
                (duyet ? pat.panel({ title: 'Lịch bảo vệ', icon: 'fa-calendar-days', flush: true, zone: 'lich', cls: 'lv-khoi' })
                    : '<div class="lv-khoi" data-hd="lich"></div>') +
                pat.panel({ title: 'Kết quả', icon: 'fa-square-poll-vertical', flush: true, zone: 'kq', cls: 'lv-khoi' });
            ui.enhance(h);
            var selHD = h.querySelector('[data-hd="chon"]');
            function hdId() { return selHD.value; }
            function z(k) { return h.querySelector('[data-z="' + k + '"]'); }

            /* Hướng dẫn — chỉ xem */
            z('hdn').innerHTML = L.DANG_TAI;
            Promise.all([L.canBo(), L.dsNguoi('HD', sv.ID, sv)]).then(function (ds) {
                L.bangNguoi(z('hdn'), ds[1], { nhan: 'Người hướng dẫn', empty: 'Chưa có người hướng dẫn', ten: function (x) {
                    return (e(x.NGUOIDUNG_HODEM) + ' ' + e(x.NGUOIDUNG_TEN)).trim() || L.tenTheoId(ds[0], x.NGUOIDUNG_ID, L.tenCanBo) ||
                        (e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)).trim();
                } });
            }).catch(function (err) { z('hdn').innerHTML = ui.fail(err.message); ums.api.handle(err, 'người hướng dẫn'); });

            /* Lịch bảo vệ */
            var lich = duyet ? null : pat.rows(h.querySelector('[data-hd="lich"]'), {
                title: 'Lịch bảo vệ', icon: 'fa-calendar-days', addText: 'Thêm dòng',
                columns: [
                    { key: 'strNgay', col: 'NGAY', title: 'Ngày', type: 'date', width: '160px' },
                    { key: 'strGio', col: 'GIO', title: 'Giờ', width: '120px' },
                    { key: 'strDiaDiem', col: 'DIADIEM', title: 'Địa điểm' },
                    { key: 'strMoTa', col: 'MOTA', title: 'Ghi chú' }
                ],
                list: function (hoiDong) {
                    return { action: KH + 'LayDSBV_BaoVe_Lich', method: 'GET', strBV_Kehoach_NH_GiaoDT_Id: sv.ID, strBV_HoiDong_Id: hoiDong,
                        strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: L.uid() };
                },
                filled: function (v) { return !!(v.strNgay || v.strGio || v.strDiaDiem || v.strMoTa); },
                save: function (v, rec, hoiDong) {
                    return { action: KH + (rec ? 'Sua_' : 'Them_') + 'BV_BaoVe_Lich', method: 'POST', strId: rec ? rec.ID : '', strBV_Kehoach_NH_GiaoDT_Id: sv.ID,
                        strBV_HoiDong_Id: hoiDong, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID,
                        strMoTa: v.strMoTa, strNgay: v.strNgay, strGio: v.strGio, strDiaDiem: v.strDiaDiem, strNguoiThucHien_Id: L.uid() };
                },
                remove: function (rec) { return { action: KH + 'Xoa_BV_BaoVe_Lich', strId: rec.ID, strNguoiThucHien_Id: L.uid() }; }
            });
            function taiLichXem() {
                var el = z('lich');
                if (!hdId()) { el.innerHTML = ui.empty('Chọn hội đồng', 'fa-people-group'); return; }
                el.innerHTML = L.DANG_TAI;
                L.g(KH + 'LayDSBV_BaoVe_Lich', { strBV_Kehoach_NH_GiaoDT_Id: sv.ID, strBV_HoiDong_Id: hdId(), strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                    strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: L.uid() }).then(function (r) {
                    ui.table({ el: el, rows: L.arr(r.data), empty: 'Chưa có lịch bảo vệ', columns: [
                        { title: 'Ngày', prop: 'NGAY', cls: 'is-center is-nowrap' }, { title: 'Giờ', prop: 'GIO', cls: 'is-center' },
                        { title: 'Địa điểm', prop: 'DIADIEM' }, { title: 'Ghi chú', prop: 'MOTA' }] });
                }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch bảo vệ'); });
            }

            /* Thành viên + kết quả (cùng một danh sách) */
            function tenTV(x) { return (e(x.NGUOIDUNG_HODEM) + ' ' + e(x.NGUOIDUNG_TEN)).trim(); }
            function taiTV() {
                if (!hdId()) {
                    hd.tv = [];
                    z('tv').innerHTML = ui.empty('Chọn hội đồng', 'fa-people-group');
                    z('kq').innerHTML = ui.empty('Chọn hội đồng', 'fa-people-group');
                    return Promise.resolve();
                }
                z('tv').innerHTML = L.DANG_TAI; z('kq').innerHTML = L.DANG_TAI;
                return Promise.all([L.g(KH + 'LayDSBV_KeHoach_NH_GiaoDT_BV', { strBV_Kehoach_NH_GiaoDT_Id: sv.ID, strBV_HoiDong_Id: hdId(),
                    strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguoiThucHien_Id: L.uid() }), napDanhGia()])
                    .then(function (res) {
                        hd.tv = L.arr(res[0].data);
                        var dg = res[1];
                        var cot = [{ title: 'Thành viên', render: function (x) { return esc(tenTV(x)); } }, { title: 'Vai trò', prop: 'VAITRO_TEN' },
                            { title: 'Loại hội đồng', prop: 'LOAIHOIDONG_TEN' },
                            { title: 'File', render: function (x) { return '<div data-tvf="' + esc(x.ID) + '"></div>'; } }];
                        if (!duyet) cot.push({ title: 'Sửa', cls: 'is-center', render: function (x) { return ui.iconBtn('edit', x.ID); } },
                            { head: '<input type="checkbox" data-ck="all">', cls: 'is-center', width: '44px', render: function (x) { return '<input type="checkbox" data-ck="' + esc(x.ID) + '">'; } });
                        ui.table({ el: z('tv'), rows: hd.tv, columns: cot, empty: 'Chưa có thành viên' });
                        hd.tv.forEach(function (x) {
                            var f = Array.prototype.filter.call(z('tv').querySelectorAll('[data-tvf]'), function (c) { return c.getAttribute('data-tvf') === e(x.ID); })[0];
                            if (f) ums.files.mount(f, { api: 'LVLA_Files', readonly: true }).load(x.ID);
                        });
                        var kq = [{ title: 'Thành viên', render: function (x) { return esc(tenTV(x)); } }, { title: 'Vai trò', prop: 'VAITRO_TEN' },
                            { title: 'Loại hội đồng', prop: 'LOAIHOIDONG_TEN' }];
                        if (duyet) kq.push({ title: 'Đánh giá', render: function (x) { return esc(e(x.DANHGIA_TEN) || L.tenTheoId(dg, x.DANHGIA_ID, function (d) { return e(d.TEN); })); } },
                            { title: 'Nhận xét', prop: 'NHANXET' }, { title: 'Điểm', prop: 'DIEM', cls: 'is-center' });
                        else kq.push(
                            { title: 'Đánh giá', render: function (x, i) {
                                return '<select class="ums-select ums-input--sm" data-kq-dg="' + i + '"><option value="">Chọn đánh giá</option>' + dg.map(function (d) {
                                    return '<option value="' + esc(d.ID) + '"' + (e(d.ID) === e(x.DANHGIA_ID) ? ' selected' : '') + '>' + esc(e(d.TEN)) + '</option>';
                                }).join('') + '</select>';
                            } },
                            { title: 'Nhận xét', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-kq-nx="' + i + '" value="' + esc(e(x.NHANXET)) + '">'; } },
                            { title: 'Điểm', cls: 'is-center', render: function (x, i) { return '<input class="ums-input ums-input--sm lv-diem" data-kq-d="' + i + '" value="' + esc(e(x.DIEM)) + '">'; } });
                        ui.table({ el: z('kq'), rows: hd.tv, columns: kq, empty: 'Chưa có thành viên' });
                    }).catch(function (err) { z('tv').innerHTML = ui.fail(err.message); z('kq').innerHTML = ''; ums.api.handle(err, 'thành viên hội đồng'); });
            }
            function taiTheoHD() { taiTV(); if (duyet) taiLichXem(); else lich.load(hdId()); }
            function taiHD() {
                return L.g(KH + 'LayDSBV_HoiDong', { strBV_Kehoach_NH_GiaoDT_Id: sv.ID, strNguoiThucHien_Id: L.uid() }).then(function (r) {
                    hd.ds = L.arr(r.data);
                    selHD.value = '';
                    pat.fill(selHD, hd.ds, { name: 'TENHOIDONG', head: 'Chọn hội đồng' });
                    if (hd.ds.length === 1) { selHD.value = hd.ds[0].ID; if (window.jQuery) jQuery(selHD).trigger('change.select2'); }
                    taiTheoHD();
                }).catch(function (err) { ums.api.handle(err, 'hội đồng'); });
            }
            taiHD();
            if (window.jQuery) jQuery(selHD).on('select2:select select2:clear', taiTheoHD);

            /* Biểu mẫu lập hội đồng — trong trang, thay chỗ thân khung chi tiết (BO-CUC luật 1) */
            function lapHD() {
                var dlg = L.bieuMau({ host: h, nutNgoai: khung.act, title: 'Lập hội đồng mới', icon: 'fa-people-group', body:
                    '<div class="ums-field"><label class="ums-field__label">Tên hội đồng</label><input class="ums-input" data-lh="ten"></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Loại hội đồng</label><select class="ums-select" data-lh="loai" data-ph="Chọn loại hội đồng"><option value="">Chọn loại hội đồng</option></select></div>',
                    buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                        L.g(KH + 'Them_BV_HoiDong', { strTenHoiDong: d.body.querySelector('[data-lh="ten"]').value.trim(), strLoaiHoiDong_Id: d.body.querySelector('[data-lh="loai"]').value,
                            strBV_Kehoach_NH_GiaoDT_Id: sv.ID, strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID,
                            strNguoiThucHien_Id: L.uid() }, true)
                            .then(function () { ui.toast('Thêm mới thành công!', 'ok'); d.close(); taiHD(); })
                            .catch(function (err) { ums.api.handle(err, 'lập hội đồng'); });
                        return false;
                    } }] });
                napLoaiHD().then(function (d) { pat.fill(dlg.body.querySelector('[data-lh="loai"]'), d, { head: 'Chọn loại hội đồng' }); });
            }
            /* Biểu mẫu thành viên hội đồng — trong trang, thay chỗ thân khung chi tiết */
            function hopTV(x) {
                x = x || null;
                var dlg = L.bieuMau({ host: h, nutNgoai: khung.act, title: 'Thành viên hội đồng', icon: 'fa-user-plus', body:
                    '<div class="ums-field"><label class="ums-field__label">Đơn vị</label><select class="ums-select" data-tv="dv" data-ph="Chọn đơn vị"><option value="">Chọn đơn vị</option></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Thành viên</label><select class="ums-select" data-tv="nd" data-ph="Chọn cán bộ"><option value="">Chọn cán bộ</option></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Vai trò</label><select class="ums-select" data-tv="vt" data-ph="Chọn vai trò"><option value="">Chọn vai trò</option></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Đánh giá</label><select class="ums-select" data-tv="dg" data-ph="Chọn đánh giá"><option value="">Chọn đánh giá</option></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Điểm</label><input class="ums-input" data-tv="diem" value="' + esc(e(x && x.DIEM)) + '"></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Nhận xét</label><input class="ums-input" data-tv="nx" value="' + esc(e(x && x.NHANXET)) + '"></div>' +
                    '<div class="ums-field" style="grid-column:1 / -1"><label class="ums-field__label">Files</label><div data-tv="tep"></div></div>',
                    buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                        function v(k) { return d.body.querySelector('[data-tv="' + k + '"]').value.trim(); }
                        L.g(KH + (x ? 'Sua_' : 'Them_') + 'BV_KeHoach_NH_GiaoDT_BV', { strId: x ? x.ID : '', strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID,
                            strDaoTao_ChuongTrinh_Id: sv.DAOTAO_TOCHUCCHUONGTRINH_ID, strBV_Kehoach_NH_GiaoDT_Id: sv.ID, strVaiTro_Id: v('vt'), strBV_HoiDong_Id: hdId(),
                            strDanhGia_Id: v('dg'), dDiem: v('diem'), strNhanXet: v('nx'), strNguoiDung_Id: v('nd'), strNguoiThucHien_Id: L.uid() }, true)
                            .then(function (r) {
                                var id = x ? x.ID : ((r.raw && r.raw.Id) || '');
                                ui.toast(x ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                                return id ? tep.save(id) : null;
                            }).then(function () { d.close(); taiTV(); })
                            .catch(function (err) { ums.api.handle(err, 'lưu thành viên'); });
                        return false;
                    } }] });
                var b = dlg.body, sDV = b.querySelector('[data-tv="dv"]'), sND = b.querySelector('[data-tv="nd"]');
                var tep = ums.files.mount(b.querySelector('[data-tv="tep"]'), { api: 'LVLA_Files' });
                if (x) tep.load(x.ID); else tep.clear();
                ui.enhance(b);
                function napND() {
                    return L.g('NS_HoSoV2/LayDanhSach', { strDaoTao_CoCauToChuc_Id: sDV.value, pageIndex: 1, pageSize: 100000 }).then(function (r) {
                        pat.fill(sND, L.arr(r.data), { head: 'Chọn cán bộ', name: L.tenCanBo });
                        if (x && x.NGUOIDUNG_ID) { sND.value = x.NGUOIDUNG_ID; if (window.jQuery) jQuery(sND).trigger('change.select2'); }
                    }).catch(function (err) { ums.api.handle(err, 'cán bộ'); });
                }
                napDonVi().then(function (d) { pat.fill(sDV, d, { head: 'Chọn đơn vị' }); });
                napND();
                if (window.jQuery) jQuery(sDV).on('select2:select select2:clear', napND);
                L.vaiTro(sv.PHANLOAI_ID).then(function (d) {
                    var s = b.querySelector('[data-tv="vt"]'); pat.fill(s, d, { head: 'Chọn vai trò' });
                    if (x) { s.value = e(x.VAITRO_ID); if (window.jQuery) jQuery(s).trigger('change.select2'); }
                });
                napDanhGia().then(function (d) {
                    var s = b.querySelector('[data-tv="dg"]'); pat.fill(s, d, { head: 'Chọn đánh giá' });
                    if (x) { s.value = e(x.DANHGIA_ID); if (window.jQuery) jQuery(s).trigger('change.select2'); }
                });
            }

            /* Lưu toàn bộ: lịch bảo vệ + kết quả */
            function luuToanBo() {
                if (!hdId()) { ui.toast('Vui lòng chọn hội đồng', 'warn'); return; }
                var calls = hd.tv.map(function (x, i) {
                    function v(a) { var el = z('kq').querySelector('[' + a + '="' + i + '"]'); return el ? el.value.trim() : ''; }
                    return { action: KH + 'Sua_BV_KeHoach_NH_GiaoDT_BV', method: 'POST', strId: x.ID, strDanhGia_Id: v('data-kq-dg'),
                        dDiem: v('data-kq-d'), strNhanXet: v('data-kq-nx'), strNguoiThucHien_Id: L.uid() };
                });
                lich.save(hdId()).then(function () { return calls.length ? ui.batch(calls, { title: 'Lưu kết quả', toast: false }) : null; })
                    .then(function () { ui.toast('Cập nhật thành công', 'ok'); taiTheoHD(); });
            }

            if (!duyet) L.nut(khung, ui.btn('save', { text: 'Lưu toàn bộ', attr: { 'data-hd-a': 'luu' } }));
            else L.nut(khung, ui.btn('save', { text: 'Duyệt', icon: 'fa-circle-check', attr: { 'data-hd-a': 'duyet' } }));

            khung.el.addEventListener('change', function (ev) {
                if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(z('tv').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = ev.target.checked; });
            });
            khung.el.addEventListener('click', function (ev) {
                var ed = ev.target.closest('[data-act="edit"]');
                if (ed && z('tv').contains(ed)) { hopTV(hd.tv.filter(function (x) { return e(x.ID) === ed.getAttribute('data-id'); })[0]); return; }
                var a = ev.target.closest('[data-hd-a]');
                if (!a) return;
                var k = a.getAttribute('data-hd-a');
                if (k === 'laphd') lapHD();
                else if (k === 'xoahd') {
                    if (!hdId()) { ui.toast('Vui lòng chọn hội đồng cần xóa', 'warn'); return; }
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                        if (!yes) return;
                        L.g(KH + 'Xoa_BV_HoiDong', { strChucNang_Id: L.chucNang(), strIds: hdId(), strNguoiThucHien_Id: L.uid() }, true)
                            .then(function () { ui.toast('Xóa thành công!', 'ok'); taiHD(); }).catch(function (err) { ums.api.handle(err, 'xoá hội đồng'); });
                    });
                } else if (k === 'themtv') {
                    if (!hdId()) { ui.toast('Vui lòng chọn hội đồng', 'warn'); return; }
                    hopTV(null);
                } else if (k === 'xoatv') {
                    var ids = Array.prototype.map.call(z('tv').querySelectorAll('tbody input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck'); });
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                    ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                        if (!yes) return;
                        ui.batch(ids.map(function (id) { return { action: KH + 'Xoa_BV_KeHoach_NH_GiaoDT_BV', strChucNang_Id: L.chucNang(), strId: id, strNguoiThucHien_Id: L.uid() }; }),
                            { title: 'Xoá thành viên', okText: 'Xóa thành công' }).then(taiTV);
                    });
                } else if (k === 'luu') luuToanBo();
                else if (k === 'duyet') {
                    L.xacNhan({ loai: 'GiaoDeTai', dm: 'BV.TINHTRANG.XACNHANBAOVE', khoaDs: 'strsanpham_Id', sanPham: L.sanPham(sv, false), sanPhamLuu: L.sanPham(sv),
                        onDone: function () { ctx.tai(); } });
                }
            });
            return null;
        }

        L.man(root, {
            tieuDe: duyet ? 'Duyệt hội đồng' : 'Đề xuất hội đồng',
            tieuDeChiTiet: 'Đề xuất hội đồng bảo vệ',
            keHoach: 'tatCa',
            list: function (kh) { return { action: KH + 'LayDSBV_KH_NG_GiaoDeTai_Duyet', strBV_KeHoach_Id: kh, strNguoiThucHien_Id: L.uid() }; },
            columns: function () {
                return L.cotSV().concat([
                    { title: 'Đề tài', prop: 'BV_KEHOACH_DETAI_TEN' },
                    { title: 'Quyết định', prop: 'QLSV_QUYETDINH_SOQD', cls: 'is-center' },
                    { title: 'Lý do điều chỉnh', prop: 'LYDODIEUCHINH' },
                    { title: 'Tình trạng', prop: 'BV_XACNHAN_GIAODETAI_TEN', cls: 'is-center' },
                    L.cotChon()
                ]);
            },
            chiTiet: chiTiet
        });
    };
})();
