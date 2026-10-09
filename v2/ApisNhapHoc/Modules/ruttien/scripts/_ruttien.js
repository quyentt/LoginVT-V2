/* =========================================================================
   Rút tiền nhập học — khung chung hai bản
   ums.nhRutTien.man(root, { cu })
     ruttiennew (trên menu) : cu = false — PKG_CORE_NhapHoc_ThuTien.* (có iM)
     ruttien (bản cũ)       : cu = true  — NH_DinhMuc_Chung / NH_NguoiHoc_ThongTinTuyenSinh (kiểu cũ)
   Bản gốc: ApisNhapHoc/Modules/ruttien/html/{ruttiennew,ruttien}.html + scripts/{ruttiennew,ruttien}.js (RutTien)
   Khung cột trái + khối Hồ sơ: ums.nhDs (../../thuhoso/scripts/_dsnh.js).
   Không dùng lại được phieurut/ruttien của Tài chính: màn đó rút theo LÔ (TC_NguoiHoc_DuTien / TC_TaiChinh_Rut),
   màn này rút cho TỪNG người học theo phiếu thu nhập học — mã gốc hai bên không chung dòng nào.
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn)
     TC_PhieuThu/LayDSPhieuThuNhaphoc (GET) { strQLSV_NguoiHoc_Id }        phiếu thu của người học
     TC_PhieuThu/LayDSPhieuRutNhaphoc (GET) { strQLSV_NguoiHoc_Id }        phiếu rút của người học
     Các khoản đã thu của một phiếu (bấm phiếu thu) / nội dung phiếu rút (bấm phiếu rút, sau khi rút):
       bản mới  SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKKS4gLwUgFSk0DykgMQkuIgPP
                PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc (POST) { strTC_KeHoachNhapHoc_Id, strPhieuThu_Rut_Id }
       bản cũ   NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc (GET) { strPhieuThu_Rut_Id }
     Rút tiền:
       bản mới  SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4TNDUVKCQv  PKG_CORE_NhapHoc_ThuTien.NhapHoc_RutTien (POST)
       bản cũ   NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_RutTien (POST)
                { strTC_KeHoachNhapHoc_Id, strQLSV_NguoiHoc_TTTS_Id, strTAICHINH_CacKhoanRut_Ids,
                  strTAICHINH_SoTienRut_s, strNguoiThucHien_Id = userId }  → Message = "<id phiếu>,<số phiếu>"
     Hủy phiếu rút: TC_PhieuThu/HuyPhieuNhapHoc (POST) { strPhieu_Id, strNguoiThucHien_Id = userId }

   PHÉP TÍNH TIỀN (genTable_PhieuThu_RutTien)
     · Được rút mỗi khoản = SOTIENDATHU − SOTIENDARUT; ô "Số tiền được rút" để TRỐNG (gốc chỉ điền 0 khi được rút = 0).
     · Tổng dòng: Σ đã thu, Σ đã rút, Σ được rút. "Tổng tiền đã chọn" (cạnh nút Rút tiền) = Σ số đã nhập.
     · Lưu: MỌI khoản của phiếu đang mở, số rút = số đã nhập (trống → 0), nối dấu phẩy.

   LỖI GỐC ĐÃ SỬA (làm theo ý định — bản cũ ruttien.js làm đúng)
     1. ruttiennew: getList_KhoanDaThu_Rut gọi genDetail_PhieuThu / genFormEdit_PhieuDaThu — KHÔNG có trên màn
        (chép từ màn thu tiền) → TypeError; bảng khoản không bao giờ hiện, dtKhoanRut luôn rỗng nên "Rút tiền"
        gửi danh sách rỗng, và phiếu rút không bao giờ xem được. Nay: phiếu thu → bảng khoản, phiếu rút → phiếu in.
     2. ruttiennew đọc kế hoạch từ #dropKeHoachNhapHoc_ThuTien (không có trên màn → rỗng) → gửi kế hoạch đang chọn.
     3. checkValid_RutTien không bao giờ chặn (thiếu '#') → nay ô số tiền không vượt quá số được rút.
     4. Rút khi chưa mở phiếu thu nào / mọi ô bằng 0: gốc vẫn gọi với danh sách rỗng / toàn 0 → nay báo.
   KHÁC BẢN GỐC — tự chốt
     · Hỏi lại trước khi rút (việc ghi tiền), khoá nút trong lúc gửi (bấm hai lần = hai phiếu rút).
     · Hủy phiếu xong: gốc ở lại tờ phiếu → nay đóng tờ phiếu và nạp lại hai danh sách phiếu.
     · Phiếu in: dựng bằng ums.phieu.neutral (bản rút gọn chung) từ đúng dữ liệu gốc đổ vào mẫu — viewer của
       tầng chung chỉ nạp theo TC_PhieuThu/LayTTPhieuThu_Rut, không nhận dữ liệu có sẵn (nợ tầng chung).
     · Nút "Lịch sử" từng khoản (btlHistory_RutTien) không có trình xử lý ở gốc → giữ nút, khoá.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, pat = ums.pat;
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function so(v) { var n = Number(pat.num(v)); return isNaN(n) ? 0 : n; }
    function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(String(s)) : String(s).replace(/["\\]/g, '\\$&'); }

    var AC = {
        khoanDaThu: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKKS4gLwUgFSk0DykgMQkuIgPP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKhoanDaThuNhapHoc' },
        rut: { action: 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4TNDUVKCQv', func: 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_RutTien' }
    };
    var AC_CU = {
        khoanDaThu: { action: 'NH_DinhMuc_Chung/LayDSKhoanDaThuNhapHoc', method: 'GET' },
        rut: { action: 'NH_NguoiHoc_ThongTinTuyenSinh/NhapHoc_RutTien' }
    };

    ums.nhRutTien = {
        man: function (root, cfg) {
            cfg = cfg || {};
            var A = cfg.cu ? AC_CU : AC;
            var S = { nguoi: null, phieuThu: [], phieuRut: [], khoan: [], phieuMo: null, sua: {}, phieuXem: null, xemPart: null, dangRut: false };

            var ds = ums.nhDs.cot({
                el: root, title: cfg.title || 'Rút tiền', cu: cfg.cu, chuaNhap: 'Chưa',
                nhac: 'Chọn một người học ở cột trái để xem lịch sử thu / rút tiền',
                onChon: moNguoi,
                onBoChon: function () { S.nguoi = null; dongPhieu(true); }
            });

            ds.noiDung.innerHTML =
                '<div data-rt="chiTiet">' +
                '<div class="ums-panel" data-rt="hs"><div class="ums-panel__body" data-rt="hsBody"></div></div>' +
                '<div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-money-from-bracket"></i> Lịch sử thu/rút tiền</div></div>' +
                '<div class="ums-panel__body nh-phieu">' +
                    '<div class="nh-phieu__dong"><span class="nh-phieu__lb"><i class="fa-light fa-money-bill-1"></i> Danh sách phiếu thu tiền:</span><span data-rt="dsThu"></span></div>' +
                    '<div class="nh-phieu__dong"><span class="nh-phieu__lb"><i class="fa-light fa-money-from-bracket"></i> Danh sách phiếu rút tiền:</span><span data-rt="dsRut"></span></div>' +
                '</div></div>' +
                '<div class="ums-panel nh-rut" data-rt="rut" hidden><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-circle-info"></i> Thực hiện rút tiền' +
                ' <span class="ums-u-faint" data-rt="rutSo"></span></div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-rt': 'dongRut' } }) + '</div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-rt="rutBang"></div>' +
                '<div class="ums-panel__body">' + pat.thanhThu({
                    ghiChu: 'Nhập số tiền rút cho từng khoản (không vượt quá số được rút)',
                    nut: '<button type="button" class="ums-btn ums-btn--danger" data-rt="luu"><i class="fa-light fa-money-from-bracket"></i><span>Rút tiền</span></button>'
                }) + '</div></div>' +
                '</div>' +
                /* Tờ phiếu rút (zoneHoaDon_PhieuRut + zoneAction_HoaDon_RutTien) — thay chỗ phần chi tiết */
                '<div class="ums-panel" data-rt="phieu" hidden><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-receipt"></i> Phiếu rút tiền' +
                ' <span class="ums-u-faint" data-rt="phieuSo"></span></div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-rt': 'dongPhieu' } }) +
                ui.btn('del', { text: 'Hủy', attr: { 'data-rt': 'huy' } }) +
                ui.btn('print', { attr: { 'data-rt': 'in' } }) + '</div></div>' +
                '<div class="ums-panel__body" data-rt="phieuBody"></div></div>';
            function z(k) { return ds.noiDung.querySelector('[data-rt="' + k + '"]'); }

            function moNguoi(r) {
                S.nguoi = r;
                dongPhieu(true);
                z('rut').hidden = true;
                S.khoan = []; S.phieuMo = null;
                ums.nhDs.dau(z('hs'), r, ui.btn('close', { attr: { 'data-rt': 'dong' } }));
                z('hsBody').innerHTML = ums.nhDs.hoSo(r);
                taiPhieu();
            }

            /* ---------------- Danh sách phiếu thu / phiếu rút ---------------- */
            function taiPhieu() {
                var r = S.nguoi;
                if (!r) return Promise.resolve();
                z('dsThu').innerHTML = z('dsRut').innerHTML = '<i class="fa-light fa-spinner fa-spin"></i>';
                function lay(action, k, el, tone) {
                    return ums.api.call({ action: action, method: 'GET', versionAPI: 'v1.0', strQLSV_NguoiHoc_Id: r.ID }).then(function (res) {
                        if (S.nguoi !== r) return;
                        S[k] = Array.isArray(res.data) ? res.data.filter(function (x) { return x; }) : [];
                        z(el).innerHTML = S[k].length ? '<span class="ums-chips">' + S[k].map(function (x) {
                            return '<button type="button" class="ums-chip nh-chip nh-chip--' + tone + '" data-phieu="' + k + '" data-id="' + esc(x.ID) + '">#' + esc(e(x.SOPHIEUTHU)) + '</button>';
                        }).join('') + '</span>' : '<span class="ums-u-faint">Chưa có</span>';
                    }).catch(function (err) { z(el).innerHTML = ''; ums.api.handle(err, k === 'phieuThu' ? 'phiếu thu' : 'phiếu rút'); });
                }
                return Promise.all([
                    lay('TC_PhieuThu/LayDSPhieuThuNhaphoc', 'phieuThu', 'dsThu', 'thu'),
                    lay('TC_PhieuThu/LayDSPhieuRutNhaphoc', 'phieuRut', 'dsRut', 'rut')
                ]);
            }

            /* Rê chuột lên phiếu → người thu + ngày (popover_PhieuThu_PhieuRut) */
            ui.hoverCard(ds.noiDung, '[data-phieu]', function (b) {
                var x = S[b.getAttribute('data-phieu')].filter(function (d) { return String(d.ID) === b.getAttribute('data-id'); })[0];
                if (!x) return null;
                return '<div class="ums-hovercard__in"><div class="ums-hovercard__rows">' +
                    '<div class="ums-hovercard__row"><i class="fa-light fa-circle-info"></i><span>Người thu :</span><b>' + esc(e(x.NGUOITAO_TENDAYDU)) + '</b></div>' +
                    '<div class="ums-hovercard__row"><i class="fa-light fa-calendar"></i><span>Ngày :</span><b>' + esc(e(x.NGAYTAO_DD_MM_YYYY_HHMMSS)) + '</b></div>' +
                    '</div></div>';
            });

            /* ---------------- getList_KhoanDaThu_Rut ---------------- */
            function khoanDaThu(id) {
                var o = { action: A.khoanDaThu.action, versionAPI: 'v1.0', strPhieuThu_Rut_Id: id };
                if (A.khoanDaThu.func) { o.func = A.khoanDaThu.func; o.strTC_KeHoachNhapHoc_Id = ds.keHoach(); }
                if (A.khoanDaThu.method) o.method = A.khoanDaThu.method;
                return ums.api.call(o).then(function (res) { return Array.isArray(res.data) ? res.data : []; });
            }

            /* Bấm phiếu thu → "Thực hiện rút tiền" */
            function moRut(p) {
                S.phieuMo = p; S.khoan = []; S.sua = {};
                z('rutSo').textContent = '— phiếu thu #' + e(p.SOPHIEUTHU);
                z('rut').hidden = false;
                z('rutBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                khoanDaThu(p.ID).then(function (rows) {
                    if (S.phieuMo !== p) return;
                    S.khoan = rows;
                    veRut();
                    ui.reveal && ui.reveal(z('rut'));
                }).catch(function (err) { z('rutBang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'các khoản đã thu'); });
            }
            function duocRut(x) { return so(x.SOTIENDATHU) - so(x.SOTIENDARUT); }
            function veRut() {
                ui.table({
                    el: z('rutBang'), rows: S.khoan, empty: 'Phiếu thu không có khoản nào',
                    columns: [
                        { title: 'Tên phí', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                        { title: 'Số tiền đã thu', cls: 'is-right', prop: 'SOTIENDATHU', sum: true, render: function (x) { return ui.money(so(x.SOTIENDATHU)); } },
                        { title: 'Số tiền đã rút', cls: 'is-right', prop: 'SOTIENDARUT', sum: true, render: function (x) { return ui.money(so(x.SOTIENDARUT)); } },
                        { title: 'Số tiền được rút', cls: 'is-right', width: '200px',
                          render: function (x) {
                              var d = duocRut(x), id = e(x.TAICHINH_CACKHOANTHU_ID);
                              if (S.sua[id] === undefined) S.sua[id] = d === 0 ? '0' : '';
                              return '<input class="ums-input ums-input--sm" data-tien="' + esc(id) + '" inputmode="numeric" placeholder="Nhập số tiền rút" title="Được rút tối đa ' +
                                  esc(ui.money(d)) + '" value="' + esc(S.sua[id] === '' ? '' : pat.money(S.sua[id])) + '">';
                          },
                          sum: function (rows) { return '<b>' + ui.money(rows.reduce(function (a, x) { return a + duocRut(x); }, 0)) + '</b>'; } },
                        { title: 'Lịch sử', cls: 'is-center', width: '80px', render: function () {
                            return '<button type="button" class="ums-iconbtn" disabled title="Lịch sử (bản gốc chưa có xử lý)"><i class="fa-light fa-clock-rotate-left"></i></button>';
                        } }
                    ]
                });
                tongChon();
            }
            function tongChon() {
                var t = 0;
                S.khoan.forEach(function (x) { t += so(S.sua[e(x.TAICHINH_CACKHOANTHU_ID)]); });
                pat.datDaChon(z('rut'), t);
                return t;
            }
            z('rutBang').addEventListener('input', function (ev) {
                var o = ev.target.closest('input[data-tien]');
                if (!o) return;
                var id = o.getAttribute('data-tien');
                var x = S.khoan.filter(function (d) { return e(d.TAICHINH_CACKHOANTHU_ID) === id; })[0];
                var v = o.value.replace(/[^\d]/g, '');
                if (v !== '' && x && Number(v) > duocRut(x)) { v = String(Math.max(0, duocRut(x))); ui.toast('Không được rút quá ' + ui.money(duocRut(x)), 'warn'); }
                S.sua[id] = v;
                o.value = v === '' ? '' : pat.money(v);
                tongChon();
            });

            /* ---------------- save_RutTien ---------------- */
            function rut(btn) {
                var r = S.nguoi;
                if (!r) { ui.toast('Vui lòng chọn Người học cần rút tiền!', 'warn'); return; }
                if (!S.khoan.length) { ui.toast('Chọn một phiếu thu để rút tiền', 'warn'); return; }
                var t = tongChon();
                if (t <= 0) { ui.toast('Chưa nhập số tiền rút', 'warn'); return; }
                if (S.dangRut) return;
                ui.confirm('Rút ' + ui.money(t, { donVi: true }) + ' cho người học ' + ums.nhDs.hoTen(r) + '?', { ok: 'Rút tiền', title: 'Rút tiền' }).then(function (y) {
                    if (!y) return;
                    S.dangRut = true; btn.disabled = true;
                    var o = {
                        action: A.rut.action, versionAPI: 'v1.0',
                        strTC_KeHoachNhapHoc_Id: ds.keHoach(),
                        strQLSV_NguoiHoc_TTTS_Id: r.ID,
                        strTAICHINH_CacKhoanRut_Ids: S.khoan.map(function (x) { return e(x.TAICHINH_CACKHOANTHU_ID); }).toString(),
                        strTAICHINH_SoTienRut_s: S.khoan.map(function (x) { return so(S.sua[e(x.TAICHINH_CACKHOANTHU_ID)]); }).toString(),
                        strNguoiThucHien_Id: ums.session.userId
                    };
                    if (A.rut.func) o.func = A.rut.func;
                    return ums.api.call(o).then(function (res) {
                        var p = String(res.message || '').split(',');
                        z('rut').hidden = true;
                        S.khoan = []; S.phieuMo = null;
                        return taiPhieu().then(function () {
                            /* Rút thành công → mở phiếu in (Message = "<id>,<số>") */
                            if (p[0]) xemPhieu({ ID: p[0], SOPHIEUTHU: p[1] || '' });
                            else ui.toast('Rút tiền thành công!', 'ok');
                        });
                    }).catch(function (err) { ums.api.handle(err, 'rút tiền'); })
                      .then(function () { S.dangRut = false; btn.disabled = false; });
                });
            }

            /* ---------------- Phiếu rút: xem / in / hủy (genDetail_PhieuRut) ---------------- */
            function xemPhieu(p) {
                S.phieuXem = p; S.xemPart = null;
                z('phieuSo').textContent = p.SOPHIEUTHU ? '#' + p.SOPHIEUTHU : '';
                z('phieuBody').innerHTML = ui.empty('Đang tải phiếu…', 'fa-spinner fa-spin');
                ui.swap(z('chiTiet'), z('phieu'));
                khoanDaThu(p.ID).then(function (rows) {
                    if (S.phieuXem !== p) return;
                    if (!rows.length) { z('phieuBody').innerHTML = ui.empty('Không có dữ liệu phiếu', 'fa-receipt'); return; }
                    var r = S.nguoi || {};
                    rows[0].SOPHIEUTHU = rows[0].SOCHUNGTU;
                    if (!rows[0].TENPHIEU) rows[0].TENPHIEU = 'PHIẾU RÚT TIỀN';
                    /* dataPhieuIn của gốc: thông tin người học đổi tên cột theo mẫu in */
                    var dt = {};
                    Object.keys(r).forEach(function (k) { dt[k] = r[k]; });
                    dt.HOKHAUTHUONGTRU = e(r.HOKHAU_PHUONGXA_TEN) + ', ' + e(r.HOKHAU_QUANHUYEN_TEN) + ', ' + e(r.HOKHAU_TINHTHANH_TEN);
                    dt.NGAYSINH = ums.nhDs.ngaySinh(r);
                    dt.DAOTAO_LOPQUANLY_N1_TEN = r.DAOTAO_LOPQUANLY_TEN;
                    dt.NGANHHOC_N1_TEN = r.DAOTAO_NGANHNHAPHOC;
                    dt.KHOAHOC_N1_TEN = r.DAOTAO_KHOADAOTAO_TEN;
                    dt.MAUIN_MASO = rows[0].MAUIN_MASO;
                    if (!dt.MASO) dt.MASO = r.SOBAODANH;
                    var part = S.xemPart = ums.phieu.neutral(rows, [dt], 'BIENLAIRUT');
                    z('phieuBody').innerHTML = '<iframe class="nh-phieu__khung" title="Phiếu rút" style="width:100%;border:0;background:#fff;display:block;min-height:420px"></iframe>';
                    var f = z('phieuBody').firstChild;
                    f.addEventListener('load', function () {
                        try { f.style.height = Math.max(420, f.contentDocument.documentElement.scrollHeight + 8) + 'px'; } catch (er) { /* bỏ qua */ }
                    });
                    f.srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + part.css + '\nbody{margin:12px;background:#fff}</style></head><body>' + part.html + '</body></html>';
                }).catch(function (err) { z('phieuBody').innerHTML = ui.fail(err.message); ums.api.handle(err, 'phiếu rút'); });
            }
            function dongPhieu(im) {
                S.phieuXem = null; S.xemPart = null;
                if (z('phieu').hidden) return;
                if (im) { z('phieu').hidden = true; z('chiTiet').hidden = false; }
                else ui.swap(z('phieu'), z('chiTiet'));
            }
            function huyPhieu() {
                var p = S.phieuXem;
                if (!p) return;
                ui.confirm('Bạn có chắc chắn muốn hủy phiếu rút' + (p.SOPHIEUTHU ? ' #' + p.SOPHIEUTHU : '') + '?', { tone: 'bad', ok: 'Hủy phiếu', title: 'Hủy phiếu rút' }).then(function (y) {
                    if (!y) return;
                    return ums.api.call({ action: 'TC_PhieuThu/HuyPhieuNhapHoc', versionAPI: 'v1.0', strPhieu_Id: p.ID, strNguoiThucHien_Id: ums.session.userId })
                        .then(function () {
                            ui.toast('Hủy phiếu rút thành công!', 'ok');
                            dongPhieu();
                            taiPhieu();
                        }).catch(function (err) { ums.api.handle(err, 'hủy phiếu rút'); });
                });
            }

            ds.noiDung.addEventListener('click', function (ev) {
                var c = ev.target.closest('[data-phieu]');
                if (c) {
                    var k = c.getAttribute('data-phieu');
                    var p = S[k].filter(function (d) { return String(d.ID) === c.getAttribute('data-id'); })[0];
                    if (!p) return;
                    if (k === 'phieuThu') moRut(p); else xemPhieu(p);
                    return;
                }
                var b = ev.target.closest('button[data-rt]');
                if (!b) return;
                switch (b.getAttribute('data-rt')) {
                    case 'dong': ds.boChon(); break;
                    case 'dongRut': z('rut').hidden = true; S.khoan = []; S.phieuMo = null; break;
                    case 'luu': rut(b); break;
                    case 'dongPhieu': dongPhieu(); taiPhieu(); break;
                    case 'huy': huyPhieu(); break;
                    case 'in': if (S.xemPart) ui.print(S.xemPart.html, { title: 'In phiếu rút', css: S.xemPart.css }); else ui.toast('Chưa có phiếu để in', 'warn'); break;
                }
            });
        }
    };
})();
