/* =========================================================================
   Điều kiện nhóm (Xét tốt nghiệp) — vùng "ĐIỀU KIỆN XÉT" của một nhóm (#zoneKeThua của gốc)
   Bản gốc: ApisTotNghiep/Modules/kehoach/script/dieukiennhom.js
       .btnDieuKienXet → getList_XetDuyet · getList_DieuKien · genTable_DieuKien
       save_XetDuyet · save_XepLoai (#btnSave_DieuKien2) · delete_XepLoai · save_ApDung (#myModalApDung)
       .btnDKHaBac → getList_DieuKienHaBac · genTable_DieuKienHaBac (#myModalDieuKienHaBac)
   ---------------------------------------------------------------------------
   ums.tndkn.dieuKien(man, dòngNhóm, { onClose }) — thay chỗ cả màn (ums.pat.formTrang, như toggle_overide của gốc).
       Tab 1 "1) Điều kiện xét áp dụng cho kế hoạch xét": một ô xâu điều kiện + Lưu.
       Tab 2 "2) Điều kiện xếp loại áp dụng cho kế hoạch xét": bảng xếp loại, xâu sửa NGAY TRONG Ô (như gốc) + Lưu,
             Thêm mới (biểu mẫu trong trang — tầng hai), Xóa các dòng đã đánh dấu.
       Nút ở đầu khung đổi theo tab: tab 1 chỉ Lưu; tab 2 Thêm mới · Xóa đã chọn · Lưu (gốc đặt nút trong từng tab).

   Lời gọi (chép nguyên — lời gọi kiểu cũ TN_ThongTin/* gửi kèm type và iM như gốc):
     TN_ThongTin/LayDSTN_XetDuyet_DieuKien_Ad   POST · strTuKhoa '' · strPhanLoai_Id '' · strPhamViApDung_Id = ID nhóm
         · strPhanCapApDung_Id '' · strDaoTao_ThoiGianDaoTao_Id '' · strNguoiTao_Id '' (gốc đọc #txtAAAA / #dropAAAA)
         · pageIndex 1 · pageSize 10 (pageIndex_default / pageSize_default) — dùng DÒNG ĐẦU: XAUDIEUKIEN, ID, PHANLOAI_ID,
         PHAMVIAPDUNG_ID, DAOTAO_THOIGIANDAOTAO_ID
     Lưu tab 1: chưa có dòng → TN_ThongTin_MH/… pkg_totnghiep_thongtin.Them_TN_XetDuyet_DieuKien_Ad
                 (strPhanLoai_Id / strDaoTao_ThoiGianDaoTao_Id lấy từ DÒNG NHÓM, strPhamViApDung_Id = ID nhóm)
               có dòng → TN_ThongTin/Sua_TN_XetDuyet_DieuKien_Ad (lấy từ dòng điều kiện)
               chung: strId · strXauDieuKien · dThuTu -1 · strMoTa ''
     TN_ThongTin/LayDSTN_XepLoai_DieuKien_Ad    GET · strTuKhoa/strPhanLoai_Id/strXepLoai_Id/strPhanCapApDung_Id/
         strDaoTao_ThoiGianDaoTao_Id/strNguoiTao_Id '' · strPhamViApDung_Id = ID nhóm · pageIndex 1 · pageSize 1000000
         Cột: XEPLOAI_TEN · THOIGIAN · XAUDIEUKIEN (+ PHANLOAI_ID, XEPLOAI_ID, THUTU, MOTA, PHAMVIAPDUNG_ID,
         DAOTAO_THOIGIANDAOTAO_ID gửi lại khi lưu)
     TN_ThongTin/Sua_TN_XepLoai_DieuKien_Ad     POST — mỗi ô ĐÃ ĐỔI một lời gọi: strId · strXauDieuKien · strPhanLoai_Id ·
         strXepLoai_Id · dThuTu (THUTU, trống thì bỏ khoá) · strMoTa · strPhamViApDung_Id · strDaoTao_ThoiGianDaoTao_Id ·
         strNgayApDung '' (gốc đọc #txtAAAA — xem "Giữ như gốc")
     TN_ThongTin/Xoa_TN_XepLoai_DieuKien_Ad     POST — mỗi dòng đã đánh dấu một lời gọi: strIds
     TN_ThongTin_MH/… pkg_totnghiep_thongtin.Them_TN_XepLoai_DieuKien_Ad   strXauDieuKien · strPhanLoai_Id (dòng nhóm) ·
         strXepLoai_Id (danh mục VANBANG.XEPLOAI) · dThuTu · strMoTa · strPhamViApDung_Id = ID nhóm ·
         strDaoTao_ThoiGianDaoTao_Id (edu.system.getList_ThoiGianDaoTao → ums.ref.thoiGianDaoTao) · strNgayApDung
     TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSTN_XepLoai_DieuKien_HaBac  strTn_XepLoai_DieuKien_Id = ID dòng xếp loại
         (các khoá khác '') · pageIndex 1 · pageSize 100000 — cột XAUDIEUKIEN · XEPLOAI_TEN

   Khác gốc:
     · Thêm điều kiện xếp loại: hộp #myModalApDung → biểu mẫu trong trang (BO-CUC luật 1). "Xếp loại" bắt buộc, "Thứ tự"
       kiểm kiểu số (gốc không kiểm). Lưu xong đóng biểu mẫu (gốc để hộp mở, bấm Lưu lần hai là THÊM TRÙNG).
     · Lưu tab 2 khi không có ô nào đổi: báo "Không có thay đổi" (gốc im lặng). Xoá hỏi lại tone đỏ, chạy qua ums.ui.batch,
       xong nạp lại bảng MỘT lần (gốc nạp lại sau mỗi start_Progress).
     · Lưu tab 1 xong nạp lại (như gốc) — lần lưu sau là SỬA dòng vừa tạo (gốc cũng vậy vì nạp lại dtXetDuyet).
     · Hộp điều kiện hạ bậc: chỉ xem. Ô "Nhập từ khóa tìm kiếm" và cột ô đánh dấu không có xử lý nào → bỏ; nút "Lưu"
       (.btnSave_HocPhan) không có trình xử lý → giữ, đặt disabled. Tiêu đề gốc "Danh sách" → "Danh sách điều kiện hạ bậc".
     · Ba nút "Kế thừa" / "Kế thừa theo nhóm" (#btnAdd_KeThua, #btnAdd_KeThua2, #btnAdd_KeThuaTheoNhom) đã bị chú thích bỏ
       trong html gốc → không dựng; mã của chúng (save_KeThuaDieuKien / save_KeThuaXepLoai, hộp #myModalKeThua,
       #myModalKeThuaNhom, getList_KeThuaNhom) là mã chết.
   Giữ như gốc (nghi ngờ, ghi lại):
     · Lưu xâu ở tab 2 gửi strNgayApDung RỖNG (gốc đọc ô không tồn tại) — nếu thủ tục ghi đè cột ngày áp dụng thì mỗi lần sửa
       xâu sẽ xoá ngày áp dụng đã nhập lúc thêm. Không đoán tên cột ngày trong dữ liệu trả về nên chưa gửi lại giá trị cũ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var N = ums.tndkn = ums.tndkn || {};
    var e = N.e || function (x) { return x === undefined || x === null ? '' : String(x); };

    var TT = 'TN_ThongTin_MH/', PT = 'pkg_totnghiep_thongtin.', CU = 'TN_ThongTin/';

    N.dieuKien = function (man, nhom, o) {
        o = o || {};
        var xet = null;        // dòng điều kiện xét đang có (dtXetDuyet của gốc)
        var rows = [];         // điều kiện xếp loại (dtDieuKien)
        var tab = 'xet';

        var body = document.createElement('div');
        body.innerHTML =
            ui.tabs([
                { key: 'xet', text: '1) Điều kiện xét áp dụng cho kế hoạch xét' },
                { key: 'xl', text: '2) Điều kiện xếp loại áp dụng cho kế hoạch xét' }
            ], 'xet', 'data-tndkn-tab') +
            '<div class="tndkn-pane" data-pane="xet">' +
                '<textarea class="ums-textarea tndkn-xau tndkn-xau--lon" data-k="xau" spellcheck="false" aria-label="Xâu điều kiện xét"></textarea>' +
            '</div>' +
            '<div class="tndkn-pane tndkn-xl" data-pane="xl" hidden><div data-z="xl"></div></div>';

        var ft = pat.formTrang({
            host: man, icon: 'fa-sliders', cols: 1, body: body,
            title: 'Điều kiện xét — ' + (e(nhom.TEN) || e(nhom.MA)),
            xoa: { chon: 'input[data-tndkn-ck]', text: 'Xóa', onClick: function () { xoa(); } },
            buttons: [
                { text: 'Thêm mới', kind: 'add', onClick: function () { them(); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function () { if (tab === 'xet') luuXet(); else luuXL(); return false; } }
            ],
            onClose: o.onClose
        });

        function z(x) { return body.querySelector('[data-z="' + x + '"]'); }
        var oXau = body.querySelector('[data-k="xau"]');

        function doiTab(k) {
            tab = k;
            ui.tabsActive(body, k, 'data-tndkn-tab');
            Array.prototype.forEach.call(body.querySelectorAll('[data-pane]'), function (p) { p.hidden = p.getAttribute('data-pane') !== k; });
            var them = ft.el.querySelector('[data-ft="0"]'), nutXoa = ft.el.querySelector('[data-ft="xoa"]');
            if (them) them.hidden = k !== 'xl';
            if (nutXoa) nutXoa.hidden = k !== 'xl';
        }

        /* ---------- Tab 1: điều kiện xét ---------------------------------- */
        function taiXet() {
            return ums.api.call({
                action: CU + 'LayDSTN_XetDuyet_DieuKien_Ad', method: 'POST', type: 'POST', iM: ums.session.iM,
                strTuKhoa: '', strPhanLoai_Id: '', strPhamViApDung_Id: nhom.ID, strPhanCapApDung_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10
            }).then(function (r) {
                var d = Array.isArray(r.data) ? r.data : [];
                xet = d.length ? d[0] : null;
                oXau.value = xet ? e(xet.XAUDIEUKIEN) : '';
            }).catch(function (err) { ums.api.handle(err, 'điều kiện xét'); });
        }
        function luuXet() {
            var c = xet && xet.ID ? {
                action: CU + 'Sua_TN_XetDuyet_DieuKien_Ad', method: 'POST', type: 'POST', iM: ums.session.iM,
                strId: xet.ID, strChucNang_Id: '', strXauDieuKien: oXau.value, strPhanLoai_Id: xet.PHANLOAI_ID, dThuTu: -1,
                strMoTa: '', strPhamViApDung_Id: xet.PHAMVIAPDUNG_ID, strDaoTao_ThoiGianDaoTao_Id: xet.DAOTAO_THOIGIANDAOTAO_ID,
                strNguoiThucHien_Id: ''
            } : {
                action: TT + 'FSkkLB4VDx4ZJDUFNDgkNR4FKCQ0CigkLx4AJQPP', func: PT + 'Them_TN_XetDuyet_DieuKien_Ad',
                strChucNang_Id: '', strXauDieuKien: oXau.value, strPhanLoai_Id: nhom.PHANLOAI_ID, dThuTu: -1,
                strMoTa: '', strPhamViApDung_Id: nhom.ID, strDaoTao_ThoiGianDaoTao_Id: nhom.DAOTAO_THOIGIANDAOTAO_ID,
                strNguoiThucHien_Id: ''
            };
            ums.api.call(c).then(function () {
                ui.toast('Thực hiện thành công', 'ok');
                taiXet();
            }).catch(function (err) { ums.api.handle(err, 'lưu điều kiện xét'); });
        }

        /* ---------- Tab 2: điều kiện xếp loại ------------------------------ */
        function taiXL() {
            var host = z('xl');
            if (!rows.length) host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            return ums.api.call({
                action: CU + 'LayDSTN_XepLoai_DieuKien_Ad', method: 'GET', type: 'GET', iM: ums.session.iM,
                strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strPhamViApDung_Id: nhom.ID, strPhanCapApDung_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000
            }).then(function (r) {
                rows = Array.isArray(r.data) ? r.data : [];
                ui.table({
                    el: host, rows: rows, empty: 'Chưa có điều kiện xếp loại',
                    columns: [
                        { title: 'Xếp loại', cls: 'is-center is-nowrap', render: function (x) {
                            return ui.btn('view', { text: e(x.XEPLOAI_TEN) || 'Chi tiết', cls: 'ums-btn--sm',
                                attr: { 'data-tndkn-hb': e(x.ID), title: 'Xem điều kiện hạ bậc' } });
                        } },
                        { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                        { title: 'Điều kiện', render: function (x) {
                            return '<textarea class="ums-textarea tndkn-xau" spellcheck="false" data-tndkn-xau="' + esc(e(x.ID)) + '">' +
                                esc(e(x.XAUDIEUKIEN)) + '</textarea>';
                        } },
                        { head: '<input type="checkbox" data-tndkn-all title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x) {
                            return '<input type="checkbox" data-tndkn-ck="' + esc(e(x.ID)) + '">';
                        } }
                    ]
                });
            }).catch(function (err) {
                rows = [];
                host.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'điều kiện xếp loại');
            });
        }
        function tim(id) { return rows.filter(function (x) { return e(x.ID) === id; })[0]; }

        function luuXL() {
            var doi = [];
            Array.prototype.forEach.call(body.querySelectorAll('textarea[data-tndkn-xau]'), function (t) {
                var r = tim(t.getAttribute('data-tndkn-xau'));
                if (r && t.value !== e(r.XAUDIEUKIEN)) doi.push({ r: r, xau: t.value });
            });
            if (!doi.length) { ui.toast('Không có thay đổi để lưu', 'warn'); return; }
            ui.batch(doi.map(function (x) {
                var r = x.r;
                return {
                    action: CU + 'Sua_TN_XepLoai_DieuKien_Ad', method: 'POST', type: 'POST', iM: ums.session.iM,
                    strId: r.ID, strChucNang_Id: '', strXauDieuKien: x.xau, strPhanLoai_Id: r.PHANLOAI_ID,
                    strXepLoai_Id: r.XEPLOAI_ID, dThuTu: r.THUTU ? r.THUTU : undefined, strMoTa: r.MOTA,
                    strPhamViApDung_Id: r.PHAMVIAPDUNG_ID, strDaoTao_ThoiGianDaoTao_Id: r.DAOTAO_THOIGIANDAOTAO_ID,
                    strNgayApDung: '', strNguoiThucHien_Id: ''
                };
            }), { title: 'Đang lưu điều kiện xếp loại', okText: 'Thực hiện thành công', show: true }).then(taiXL);
        }

        function xoa() {
            var ids = Array.prototype.filter.call(body.querySelectorAll('input[data-tndkn-ck]'), function (x) { return x.checked; })
                .map(function (x) { return x.getAttribute('data-tndkn-ck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa ' + ids.length + ' dòng đã chọn không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá điều kiện xếp loại' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) {
                    return { action: CU + 'Xoa_TN_XepLoai_DieuKien_Ad', method: 'POST', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
                }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!', show: true }).then(taiXL);
            });
        }

        /* ---------- Thêm điều kiện xếp loại — biểu mẫu trong trang (tầng hai) ---------- */
        function them() {
            var f = pat.formTrang({
                host: ft.body, icon: 'fa-pen-to-square', title: 'Điều kiện xếp loại áp dụng cho kế hoạch xét',
                body:
                    ui.field('Xếp loại', '<select class="ums-select" data-k="xl" data-ph="Chọn xếp loại" data-required></select>', { required: true }) +
                    ui.field('Thời gian', '<select class="ums-select" data-k="tg" data-ph="Chọn thời gian"></select>') +
                    ui.field('Thứ tự', '<input class="ums-input" data-k="thutu" inputmode="numeric" autocomplete="off">') +
                    ui.field('Ngày áp dụng', '<div class="ums-inputwrap"><input class="ums-input" data-k="ngay" autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>') +
                    '<div style="grid-column:1 / -1">' + ui.field('Mô tả', '<input class="ums-input" data-k="mota" autocomplete="off">') + '</div>' +
                    '<div style="grid-column:1 / -1">' + ui.field('Xâu điều kiện',
                        '<textarea class="ums-textarea tndkn-xau tndkn-xau--vua" data-k="xau" spellcheck="false"></textarea>') + '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luuThem(); return false; } }]
            });
            function k(x) { return f.body.querySelector('[data-k="' + x + '"]'); }
            ui.datepicker(k('ngay'));
            ums.api.dm('VANBANG.XEPLOAI').then(function (d) {
                pat.fill(k('xl'), d, { head: pat.dmTitle(d) || 'Chọn xếp loại' });
            }).catch(function (err) { ums.api.handle(err, 'danh mục xếp loại'); });
            ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) {
                pat.fill(k('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' });
            }).catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });

            function luuThem() {
                var xl = pat.val(k('xl')), thuTu = k('thutu').value.trim(), ngay = k('ngay').value.trim();
                var loi = [];
                if (!xl) loi.push('Xếp loại');
                if (thuTu && isNaN(Number(thuTu))) loi.push('Thứ tự (phải là số)');
                if (ngay && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(ngay)) loi.push('Ngày áp dụng (dd/mm/yyyy)');
                if (loi.length) { ui.toast('Kiểm tra lại: ' + loi.join(', '), 'warn'); return; }
                ums.api.call({
                    action: TT + 'FSkkLB4VDx4ZJDENLiAoHgUoJDQKKCQvHgAl', func: PT + 'Them_TN_XepLoai_DieuKien_Ad',
                    strChucNang_Id: '', strXauDieuKien: k('xau').value, strPhanLoai_Id: nhom.PHANLOAI_ID, strXepLoai_Id: xl,
                    dThuTu: thuTu, strMoTa: k('mota').value.trim(), strPhamViApDung_Id: nhom.ID,
                    strDaoTao_ThoiGianDaoTao_Id: pat.val(k('tg')), strNgayApDung: ngay, strNguoiThucHien_Id: ''
                }).then(function () {
                    ui.toast('Thêm mới thành công!', 'ok');
                    f.close();
                    taiXL();
                }).catch(function (err) { ums.api.handle(err, 'thêm điều kiện xếp loại'); });
            }
        }

        /* ---------- Hộp điều kiện hạ bậc (chỉ xem) ------------------------- */
        function haBac(id) {
            var r = tim(id) || {};
            var dlg = ui.dialog({
                title: 'Danh sách điều kiện hạ bậc' + (e(r.XEPLOAI_TEN) ? ' — ' + e(r.XEPLOAI_TEN) : ''), icon: 'fa-list-ul', size: 'lg',
                body: '<div data-z="hb"><div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div></div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { return false; } }]
            });
            var nut = dlg.el.querySelector('[data-dlg="0"]');
            if (nut) { nut.disabled = true; nut.title = 'Bản gốc không có xử lý cho nút này'; }
            var host = dlg.body.querySelector('[data-z="hb"]');
            ums.api.call({
                action: TT + 'DSA4BRIVDx4ZJDENLiAoHgUoJDQKKCQvHgkgAyAi', func: PT + 'LayDSTN_XepLoai_DieuKien_HaBac',
                strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strTn_XepLoai_DieuKien_Id: id, strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 100000
            }).then(function (res) {
                ui.table({
                    el: host, rows: Array.isArray(res.data) ? res.data : [], empty: 'Không có điều kiện hạ bậc',
                    columns: [
                        { title: 'Xâu điều kiện', prop: 'XAUDIEUKIEN' },
                        { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-nowrap' }
                    ]
                });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'điều kiện hạ bậc'); });
        }

        body.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-tndkn-tab]');
            if (t) { doiTab(t.getAttribute('data-tndkn-tab')); return; }
            var hb = ev.target.closest('[data-tndkn-hb]');
            if (hb) { haBac(hb.getAttribute('data-tndkn-hb')); return; }
            var all = ev.target.closest('[data-tndkn-all]');
            if (all) {
                Array.prototype.forEach.call(body.querySelectorAll('input[data-tndkn-ck]'), function (x) { x.checked = all.checked; });
                if (ui.demXoaChon) ui.demXoaChon();
            }
        });

        doiTab('xet');
        taiXet();
        taiXL();
        return ft;
    };
})();
