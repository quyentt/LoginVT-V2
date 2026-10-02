/* =========================================================================
   Thi phách — phân quyền nhập điểm: VÙNG CHI TIẾT (#zoneEdit) của bản Túi và bản Danh sách thi
   ums.tpPq.nhapDiem(c) → hàm vẽ (host, dòng, ctx) cho cfg.chiTiet của ums.tpPq.man
   Bản gốc: kehoach/script/phanquyennhapdiem.js (toggle_edit, getList_TuiThi, getList_NhapDiem, save_NhapDiem,
            actionCopyXacNhan, getList_BtnXacNhanSanPham, getList_XacNhan, save_XacNhanSanPham) + bản …dst.js cùng tên hàm.
   Hai màn "phân quyền" gốc là bản chép của hai màn nhập điểm (nhapdiem / nhapdiemdst) nên bấm một dòng vẫn mở lưới nhập
   điểm — giữ nguyên như gốc.
   ---------------------------------------------------------------------------
   c = {
     tieuDe(dòng)                       tiêu đề vùng
     tui: { goi(idDòng) }               (bản Túi) ô chọn túi — TP_Chung/LayDSTuiTheoDotPhach, tự chọn túi ĐẦU như gốc
     ds(idNguồn) → lời gọi              danh sách dòng điểm (idNguồn = túi đang chọn | ID danh sách thi)
     cot: [cột ui.table]                cột TRƯỚC / SAU ô điểm: { …, diem: true } đánh dấu vị trí ô "Điểm"
     luu(dòngĐiểm, điểm) → lời gọi      POST mỗi dòng đã sửa
     xnNguon: { text, chuDe, loai }     (bản Túi) "Xác nhận theo túi" — một lời gọi với id túi
     xnTung:  { text, chuDe, loai, cot: [cột chép sang hộp] }   "Xác nhận từng phách / từng bản ghi"
                                        id xác nhận = idNguồn + QLSV_NGUOIHOC_ID (ghép chuỗi như gốc)
     rong
   }
   Hộp xác nhận: ums.nd.xacNhanNut (Cổng cán bộ nhapdiem/_xacnhan.js — hộp KIỂU NÚT, đúng loadBtnXacNhan của gốc):
       D_HanhDongXacNhan/LayDanhSach (GET strChucNang_Id, strLoaiXacNhan_Id) · D_XacNhan/LayDSDiem_XacNhan (GET, pageSize 100000)
       · D_XacNhan/Them_Diem_XacNhan (POST strDiem_DanhSachHoc_Id = strDuLieuXacNhan = id, strHanhDong_Id, strLoaiXacNhan_Id,
         strThongTinXacNhan = ô Nội dung, strNguoiXacNhan_Id)
   Không chép (lỗi rõ của bản gốc):
     · Mở hộp "từng phách" lần thứ N thì bấm một dòng gọi lịch sử N lần (delegate gắn lại mỗi lần mở).
     · "từng phách" không đánh dấu dòng nào mà bấm nút xác nhận: gốc im lặng không làm gì → nay nhắc chọn dòng.
     · Đổi túi làm nạp lại danh sách đợt phách phía sau (mất ô đánh dấu) → bỏ; Đóng mới nạp lại.
     · Lưu điểm: mỗi dòng một thông báo + nạp lại lưới sau MỖI lời gọi → ums.ui.batch, nạp lại một lần.
     · #chkSelectAll của bản DST trỏ bảng điểm (không có ô đánh dấu nào) — mã chết.
     · Phím ↑/↓ (move_ThroughInTable) nhảy lệch khi có dòng khoá → ums.nd.phim.
   Giữ như gốc: dòng CAMTHI_DUYETDKTHI / CAMTHI_VIPHAMQUYCHE = 1 để trống ô điểm; strUngDung_Id = vai trò đăng nhập
     (edu.system.appId); bản Túi gửi strSoPhach = số phách ĐANG LƯU (gốc đã bỏ ô sửa số phách).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.tpPq;
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function qa(el, s) { return Array.prototype.slice.call(el.querySelectorAll(s)); }

    P.nhapDiem = function (c) {
        return function (host, dong, ctx) {
            var nd = ums.nd, NH = [], luot = 0;
            host.innerHTML = pat.page(c.tieuDe(dong), ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    (c.tui ? '' : nutXn(c.xnTung, 'xntung', 'out-success')) + ui.btn('save', { attr: { 'data-n': 'luu' } })) +
                pat.panel({ title: 'Danh sách', icon: 'fa-list-ol', count: 'nct', flush: true, body:
                    (c.tui ? '<div class="nd-thanh"><div class="nd-thanh__trai tppq-tui">' + P.sel('tui', 'Chọn danh sách thi') + '</div><div class="nd-thanh__phai">' +
                        nutXn(c.xnNguon, 'xnnguon', 'out-primary') + nutXn(c.xnTung, 'xntung', 'out-success') + '</div></div>' : '') +
                    '<div data-z="luoi"></div>' });
            ui.enhance(host);
            function z(k) { return host.querySelector('[data-z="' + k + '"]'); }
            var oTui = host.querySelector('[data-f="tui"]'), h = z('luoi');
            nd.phim(h);
            function nutXn(x, a, mod) { return x ? ui.btn('confirm', { text: x.text, mod: mod, attr: { 'data-n': a } }) : ''; }
            function nguon() { return c.tui ? pat.val(oTui) : dong.ID; }
            function khoa(x) { return nguon() + e(x.QLSV_NGUOIHOC_ID); }

            function tai() {
                var sh = ++luot;
                if (!nguon()) { NH = []; z('nct').textContent = ''; h.innerHTML = ui.empty('Chọn danh sách thi (túi) để nhập điểm', 'fa-hand-pointer'); return Promise.resolve(); }
                h.innerHTML = P.dang();
                return ums.api.call(c.ds(nguon())).then(function (r) {
                    if (sh !== luot) return;
                    NH = P.arr(r.data);
                    z('nct').textContent = '(' + NH.length + ')';
                    ui.table({ el: h, rows: NH, empty: c.rong || 'Không có dữ liệu', tableCls: 'ums-table--lined nd-luoi', columns: c.cot.map(function (k) {
                        if (!k.diem) return k;
                        return { title: k.title || 'Điểm', cls: 'is-center', render: function (x, i) {
                            if (String(x.CAMTHI_DUYETDKTHI) === '1' || String(x.CAMTHI_VIPHAMQUYCHE) === '1') return '';
                            var g = esc(e(x.DIEMBANDAU));
                            return '<input class="ums-input ums-input--sm nd-o" data-d="' + i + '" data-r="' + i + '" data-c="0" data-goc="' + g + '" value="' + g + '" autocomplete="off">';
                        } };
                    }) });
                }).catch(function (err) { if (sh !== luot) return; h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách điểm'); });
            }
            function luu() {
                var doi = nd.oDoi(h);
                if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
                ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Lưu điểm' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(doi.map(function (i) { return c.luu(NH[Number(i.getAttribute('data-d'))] || {}, i.value.trim()); }),
                        { title: 'Đang lưu điểm', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(tai);
                });
            }
            /* "Xác nhận theo túi" — một đối tượng: id túi đang chọn */
            function xacNhanNguon() {
                if (!nguon()) { ui.toast('Vui lòng chọn danh sách thi (túi)', 'warn'); return; }
                nd.xacNhanNut({ tieuDe: 'Xác nhận', chuDe: c.xnNguon.chuDe, icon: 'fa-clipboard-list', loai: c.xnNguon.loai, ids: [nguon()], lichSu: nguon() });
            }
            /* "Xác nhận từng phách / từng bản ghi" — bảng chép từ lưới (actionCopyXacNhan) + tình trạng từng dòng */
            function xacNhanTung() {
                if (!NH.length) { ui.toast('Chưa có dữ liệu để xác nhận', 'warn'); return; }
                var X = c.xnTung, ds = NH.slice(), TT = {};
                var dlg = nd.xacNhanNut({ tieuDe: 'Xác nhận', chuDe: X.chuDe, icon: 'fa-clipboard-list-check', loai: X.loai, lichSu: '',
                    lichSuRong: 'Bấm một dòng của danh sách để xem lịch sử', size: 'lg',
                    truoc: '<div class="ums-legend ums-legend--cach">Danh sách</div><div data-x="ds"></div>',
                    luu: function (hd, noiDung) {
                        var chon = P.chon(dlg.body, 'xn', ds);
                        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                        return nd.luuXacNhan(chon.map(khoa), hd, X.loai, noiDung);
                    } });
                var b = dlg.body.querySelector('[data-x="ds"]');
                function veDS() {
                    ui.table({ el: b, rows: ds, empty: 'Không có dữ liệu', columns: X.cot.map(function (k, ci) {
                        return ci ? k : { title: k.title, cls: k.cls, render: function (x, i) {
                            return '<a href="javascript:void(0)" class="nd-lk" data-ls="' + i + '" title="Xem lịch sử xác nhận">' + esc(e(x[k.prop])) + '</a>'; } };
                    }).concat([{ title: 'Tình trạng', cls: 'is-center', render: function (x) { return esc(TT[x.ID] || ''); } }, P.cotChon('xn')]) });
                }
                b.innerHTML = P.dang();
                nd.pool(ds, function (x) { return nd.trangThai(khoa(x), X.loai).then(function (t) { TT[x.ID] = t; }); }, 10).then(veDS);
                dlg.body.addEventListener('change', function (ev) {
                    if (ev.target.getAttribute('data-all') === 'xn') qa(b, 'tbody input[data-xn]').forEach(function (k) { k.checked = ev.target.checked; });
                });
                dlg.body.addEventListener('click', function (ev) {
                    var a = ev.target.closest('[data-ls]');
                    if (!a) return;
                    var x = ds[Number(a.getAttribute('data-ls'))];
                    if (x) dlg.lichSu(khoa(x));
                });
            }

            host.onclick = function (ev) {
                var b = ev.target.closest('[data-n]');
                if (!b || b.disabled) return;
                var a = b.getAttribute('data-n');
                if (a === 'luu') luu();
                else if (a === 'xnnguon') xacNhanNguon();
                else if (a === 'xntung') xacNhanTung();
            };

            if (c.tui) {
                h.innerHTML = P.dang();
                ums.api.call(c.tui.goi(dong.ID)).then(function (r) {
                    var d = P.arr(r.data);
                    pat.fill(oTui, d, { head: 'Chọn danh sách thi' });
                    if (d.length) { oTui.value = d[0].ID; if (window.jQuery) jQuery(oTui).trigger('change.select2'); }
                    tai();
                }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách túi'); });
                if (window.jQuery) jQuery(oTui).on('select2:select select2:clear', tai);
            } else tai();
        };
    };
})();
