/* =========================================================================
   _tp_tui_tui — vùng "Đánh túi bài thi của đợt phách đang chọn" + biểu mẫu / hộp thoại của hai màn túi bài (ums.tpTui)
   BO-CUC luật 1: "Thêm mới - Túi" và "Danh sách sinh viên trong túi bài" của màn tuibaitc (sửa tên / số / tiền tố túi) là biểu mẫu
   TRONG TRANG (ums.pat.formTrang, thay chỗ vùng đánh túi — tầng hai); màn tuibai cũ chỉ XEM sinh viên trong túi → giữ hộp thoại.
   Hộp "Danh sách thi" và hộp "Danh sách cần thêm" (chọn sinh viên) giữ hộp thoại.
   Bản gốc: ApisThiPhach/Modules/kehoach/script/tuibai.js (zoneView, myModal, myModal_Tui, myModalSVChuaThem, myModalDSThi).
   Nạp SAU _tp_tui.js.
   ---------------------------------------------------------------------------
   ums.tpTui.moTui(ctx, dot)   vùng đánh túi thay chỗ danh sách (ctx do T.man dựng; ctx.tc = màn tuibaitc)
   ums.tpTui.hopDSThi(dot)     hộp "Danh sách thi" của một đợt phách
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên tên tham số):
     TP_Chung/LayDSTuiTheoDotPhach (strThi_DotPhach_Id) · TP_ThongTin/LayDSQuyTacPhanDoan
     Sinh số phách (tc)          POST TP_XuLy/SinhSoPhachTheoTuiBai — MỖI túi đánh dấu một lời gọi (strThi_TuiBai_Id, strTHI_QuyTacPhanDoan_Id)
     Tạo túi - sinh số phách (cu) POST TP_XuLy/TaoTuiBai_SinhSoPhach_NguoiHoc (strThi_DotPhach_Id)
     Xóa túi                     POST TP_TuiBai/Xoa (strIds = chuỗi id nối phẩy — MỘT lời gọi)
     Xóa số phách                POST TP_XuLy/XoaSoPhachTheoTuiBai (strThi_TuiBai_Id = chuỗi id nối phẩy — MỘT lời gọi)
     Xóa đợt phách (tc)          POST TP_DotPhach/Xoa (strIds) — đúng lời gọi nút gốc đang chạy (hàm delete_DotPhach gọi
                                 TP_ThongTin/Xoa_Thi_DotPhach có trong mã gốc nhưng KHÔNG nút nào gọi tới)
     Hộp "Thêm mới - Túi" (tc)   TP_Chung/LayDSThiChuaGanTuiTheoDotPhach (strThi_DotThi_Id, strThi_DotPhach_Id, strDaoTao_HocPhan_Id)
                                 · TP_TuiBai/LayDSThi_TuiBai_DotThi (strTuKhoa '', strThi_DotThi_Id, pageIndex 1, pageSize 1000000)
                                 · TP_Chung/LayTuiTiepTheoTrongDotThi (strDaoTao_HocPhan_Id, strThi_DotThi_Id) → TUITIEPTHEO, SOPHACHTIEPTHEO
                                 · Lưu: POST TP_TuiBai/ThemMoi (strMa '', strTen, iThuTu 1, strTienTo, dSoBaiThi -1, dSoPhachBatDau,
                                   dSoPhachKetThuc -1, strThi_DotPhach_Id) → mỗi danh sách thi đánh dấu POST TP_TuiBai_DST/Them_Thi_TuiBai_DST
                                 · Tạo túi tự động theo DST: POST TP_XuLy/TaoTui_SinhPhach_DST (như ThemMoi + strTHI_QuyTacPhanDoan_Id,
                                   strThi_DanhSachThi_Id = chuỗi id nối phẩy)
     Hộp sinh viên trong túi     TP_Chung/LayDSNguoiHocTheoTuiBai (strThi_TuiBai_Id) · tc: POST TP_TuiBai/CapNhat (strId + như ThemMoi)
                                 · POST TP_XuLy/Xoa_Thi_Tui_NH_ThuCong (strThi_TuiBai_NguoiHoc_Id, strThi_TuiBai_Id, iM) mỗi dòng
                                 · POST TP_XuLy/LayDSNguoiHocChuaDonTui (strThi_TuiBai_Id, iM)
                                 · POST TP_XuLy/Them_Thi_Tui_NH_ThuCong (strThi_DanhSachSinhVien_Id, strThi_TuiBai_Id, strTienTo, strSoPhach, iM) mỗi dòng
     Báo cáo trong vùng (tc)     strThi_DotThi_Id, strDaoTao_HocPhan_Id, strDanhSachThi_Id (đợt phách đang mở), strTuiBai_Id mỗi túi đánh dấu
   ---------------------------------------------------------------------------
   KHÔNG chép (lỗi rõ của bản gốc) / làm theo ý định:
     · Xóa túi xong gốc nhảy về danh sách đợt phách → nay ở lại, nạp lại bảng túi.
     · Lưu túi mới: gốc nạp lại bảng túi TRƯỚC khi các lời gọi gán danh sách thi chạy xong → nay đợi xong.
     · Ô "phân đoạn" trong hộp Thêm túi (dropPhanDoan2) gốc luôn ẩn (chỉ ô ngoài được cho hiện) → nay hiện khi có quy tắc phân đoạn.
     · Tiêu đề vùng gốc kèm nhãn quy tắc (lblTuiThi) của đợt phách mở "Sửa" LẦN TRƯỚC (không nạp lại khi bấm Chi tiết) → bỏ nhãn đó.
     · Bản cũ (cu): bảng sinh viên trong túi có cột ô đánh dấu nhưng không nút nào dùng → bỏ cột.
   Khác gốc có chủ ý: MỌI nút ghi đều hỏi lại (gốc: Sinh số phách, Tạo túi - sinh số phách, Lưu túi, thêm / xoá sinh viên chạy ngay).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var T = ums.tpTui = ums.tpTui || {};
    function e(v) { return T.e(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return T.arr(d); }

    T.hopDSThi = function (dot) {
        var dlg = ui.dialog({ title: 'Danh sách thi', icon: 'fa-list-ol', size: 'md', body: '<div data-h="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var h = dlg.body.querySelector('[data-h="bang"]');
        T.get('TP_Chung/LayDSThiTheoDotPhach', { strThi_DotPhach_Id: dot.ID }).then(function (r) {
            ui.table({ el: h, rows: arr(r.data), empty: 'Đợt phách chưa gán danh sách thi', columns: [{ title: 'Mã danh sách thi', prop: 'MADANHSACHTHI' }] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi'); });
        return dlg;
    };

    var dmPD = null;     // quy tắc phân đoạn — nạp một lần mỗi lần mở màn
    function phanDoan() {
        dmPD = dmPD || T.get('TP_ThongTin/LayDSQuyTacPhanDoan', {}).then(function (r) { return arr(r.data); }, function (err) { dmPD = null; ums.api.handle(err, 'quy tắc phân đoạn'); return []; });
        return dmPD;
    }
    function oPhanDoan(attr) {
        return '<span class="tpt-pd" ' + attr + '-bao hidden><select class="ums-select" ' + attr + ' data-ph="Chọn phân đoạn"><option value=""></option></select></span>';
    }
    function napPhanDoan(host, attr) {
        return phanDoan().then(function (d) {
            var el = host.querySelector('select[' + attr + ']'); if (!el) return;
            pat.fill(el, d, { head: 'Chọn phân đoạn' });
            host.querySelector('[' + attr + '-bao]').hidden = !d.length;
        });
    }

    T.moTui = function (ctx, dot) {
        var tc = ctx.tc, V = ctx.z('view'), ds = [];
        dmPD = null;
        V.innerHTML = pat.panel({ title: 'Đánh túi bài thi của đợt phách đang chọn ' + e(dot.TEN), icon: 'fa-box-archive', count: 'nt', flush: true, zone: 'tui',
            tools: ui.btn('close', { attr: { 'data-t': 'dong' } }) +
                (tc ? ui.btn('add', { attr: { 'data-t': 'them' } }) + '<span data-z="bct"></span>' : '') + oPhanDoan('data-pd') +
                (tc ? ui.btn('confirm', { text: 'Sinh số phách', icon: 'fa-plus', mod: 'primary', attr: { 'data-t': 'sinh' } })
                    : ui.btn('confirm', { text: 'Tạo túi - sinh số phách', icon: 'fa-plus', mod: 'save', attr: { 'data-t': 'taosinh' } })) +
                ui.btn('reload', { attr: { 'data-t': 'tai' } }),
            foot: ui.xoaChon('input[data-ckt]', { text: tc ? 'Xóa túi' : 'Xóa', goc: '.ums-panel', attr: { 'data-t': 'xoatui' } }) +
                ui.xoaChon('input[data-ckt]', { text: 'Xóa số phách', goc: '.ums-panel', attr: { 'data-t': 'xoaphach' } }) +
                (tc ? ui.btn('del', { text: 'Xóa đợt phách', mod: 'out-warn', attr: { 'data-t': 'xoadot', 'data-khong-chon': '1' } }) : '') });
        function zv(k) { return V.querySelector('[data-z="' + k + '"]'); }
        ui.enhance(V);
        napPhanDoan(V, 'data-pd');

        function tai() {
            zv('tui').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return T.get('TP_Chung/LayDSTuiTheoDotPhach', { strThi_DotPhach_Id: dot.ID }).then(function (r) {
                ds = arr(r.data);
                zv('nt').textContent = '(' + ds.length + ')';
                ui.table({ el: zv('tui'), rows: ds, empty: 'Đợt phách chưa có túi bài', columns: [
                    { title: 'Túi bài', render: function (x, i) { return '<a href="javascript:void(0)" class="tpt-lk" data-sv="' + i + '" title="Chi tiết">' + esc(e(x.TEN)) + '</a>'; } },
                    { title: 'Số bài', prop: 'SOBAI', cls: 'is-center' }, { title: 'Số phách bắt đầu', prop: 'SOPHACHBATDAU', cls: 'is-center' },
                    { title: 'Số phách kết thúc', prop: 'SOPHACHKETTHUC', cls: 'is-center' }, T.cotChon('data-ckt', function (x) { return e(x.ID); })] });
            }).catch(function (err) { zv('tui').innerHTML = ui.fail(err.message); ums.api.handle(err, 'túi bài'); });
        }
        function chon() { return T.daChon(zv('tui'), 'data-ckt'); }
        function ten(ids) { return ids.length + ' túi bài đã chọn'; }
        if (tc) ums.report.mount(zv('bct'), { import: false, collect: function (add) {
            add('strThi_DotThi_Id', ctx.loc.v('dot')); add('strDaoTao_HocPhan_Id', ctx.loc.v('mon')); add('strDanhSachThi_Id', dot.ID);
            chon().forEach(function (id) { add('strTuiBai_Id', id); });
        } });

        V.onclick = function (ev) {
            var b = ev.target.closest('[data-sv]');
            if (b) { if (ds[Number(b.getAttribute('data-sv'))]) hopSinhVien(ctx, dot, ds[Number(b.getAttribute('data-sv'))], tai); return; }
            if (!(b = ev.target.closest('[data-t]')) || b.disabled) return;
            var a = b.getAttribute('data-t'), ids = chon();
            if (a === 'dong') { V.innerHTML = ''; ctx.veDanhSach(); }
            else if (a === 'tai') tai();
            else if (a === 'them') hopThemTui(ctx, dot, tai);
            else if (a === 'sinh') {
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
                var pd = V.querySelector('select[data-pd]').value;
                ui.confirm('Sinh số phách cho ' + ten(ids) + '? Số phách đã có của các túi này sẽ được sinh lại.', { title: 'Sinh số phách', ok: 'Sinh số phách' }).then(function (yes) {
                    if (yes) ui.batch(ids.map(function (id) { return T.thamSo('TP_XuLy/SinhSoPhachTheoTuiBai', 'POST', { strThi_TuiBai_Id: id, strTHI_QuyTacPhanDoan_Id: pd }); }),
                        { title: 'Đang sinh số phách', okText: 'Sinh số phách', concurrency: 1, show: true }).then(tai);
                });
            } else if (a === 'taosinh') {
                ui.confirm('Tạo túi bài và sinh số phách cho CẢ đợt phách "' + e(dot.TEN) + '" theo quy tắc đã khai?', { title: 'Tạo túi - sinh số phách', ok: 'Thực hiện' }).then(function (yes) {
                    if (yes) T.post('TP_XuLy/TaoTuiBai_SinhSoPhach_NguoiHoc', { strThi_DotPhach_Id: dot.ID })
                        .then(function () { ui.toast('Thực hiện thành công!', 'ok'); return tai(); }).catch(function (err) { ums.api.handle(err, 'tạo túi - sinh số phách'); });
                });
            } else if (a === 'xoatui') {
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Xoá ' + ten(ids) + '? Thao tác không hoàn lại được.', { tone: 'bad', ok: 'Xoá', title: 'Xóa túi' }).then(function (yes) {
                    if (yes) T.post('TP_TuiBai/Xoa', { strIds: ids.join(',') })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); return tai(); }).catch(function (err) { ums.api.handle(err, 'xoá túi'); });
                });
            } else if (a === 'xoaphach') {
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Xoá số phách của ' + ten(ids) + '? Thao tác không hoàn lại được.', { tone: 'bad', ok: 'Xoá', title: 'Xóa số phách' }).then(function (yes) {
                    if (yes) T.post('TP_XuLy/XoaSoPhachTheoTuiBai', { strThi_TuiBai_Id: ids.join(',') })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); return tai(); }).catch(function (err) { ums.api.handle(err, 'xoá số phách'); });
                });
            } else if (a === 'xoadot') {
                ctx.xoaDot(dot).then(function (ok) { if (ok) { V.innerHTML = ''; ctx.veDanhSach(); } });
            }
        };
        tai();
        ui.swap(ctx.z('ds'), V);
    };

    /* ---------- Biểu mẫu "Thêm mới - Túi" (chỉ màn tc) — trong trang, thay chỗ vùng đánh túi --------- */
    function hopThemTui(ctx, dot, xong) {
        var dlg = pat.formTrang({ host: ctx.z('view'), title: 'Thêm mới - Túi', icon: 'fa-plus', cols: 1,
            body: '<div class="ums-legend">Thông tin túi</div><div class="ums-grid ums-grid--2">' +
                    ui.field('Tên túi', '<input class="ums-input" data-h="ten" autocomplete="off">') +
                    ui.field('Số bắt đầu', '<input class="ums-input" data-h="so" autocomplete="off">') +
                    ui.field('Tiền tố', '<input class="ums-input" data-h="tiento" autocomplete="off">') +
                    '<div data-pd2-bao hidden>' + ui.field('Quy tắc phân đoạn', '<select class="ums-select" data-pd2 data-ph="Chọn phân đoạn"><option value=""></option></select>') + '</div></div>' +
                '<div class="ums-legend ums-legend--cach">Phòng thi - Đợt phách - chưa gán cho Túi nào</div><div class="tpt-bang" data-h="phong"></div>' +
                '<div class="ums-legend ums-legend--cach">Danh sách các túi đã tạo của cả đợt thi</div><div class="tpt-bang" data-h="datao"></div>',
            buttons: [{ text: 'Tạo túi tự động theo DST', kind: 'confirm', icon: 'fa-plus', mod: 'out-success', onClick: function () { taoTuDong(); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }] });
        function q(k) { return dlg.body.querySelector('[data-h="' + k + '"]'); }
        T.ganChonTatCa(dlg.body, ['data-ckp']);
        phanDoan().then(function (d) {
            if (dlg.closed) return;
            pat.fill(dlg.body.querySelector('select[data-pd2]'), d, { head: 'Chọn phân đoạn' });
            dlg.body.querySelector('[data-pd2-bao]').hidden = !d.length;
        });
        q('phong').innerHTML = q('datao').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        T.get('TP_Chung/LayDSThiChuaGanTuiTheoDotPhach', { strThi_DotThi_Id: ctx.loc.v('dot') || e(dot.THI_DOTTHI_ID), strThi_DotPhach_Id: dot.ID, strDaoTao_HocPhan_Id: e(dot.DAOTAO_HOCPHAN_ID) }).then(function (r) {
            ui.table({ el: q('phong'), rows: arr(r.data), empty: 'Không còn danh sách thi chưa gán túi', columns: [{ title: 'Mã danh sách', prop: 'MADANHSACHTHI' },
                { title: 'Phòng thi', prop: 'PHONGTHI_TEN' }, { title: 'Số SV', prop: 'SOSV', cls: 'is-center' },
                { title: 'Dải số báo danh', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.CHISOBAODANHBATDAU) + ' --> ' + e(x.CHISOBAODANHKETTHUC)); } },
                { title: 'Ngày thi', prop: 'NGAYTHI', cls: 'is-center' }, T.cotChon('data-ckp', function (x) { return e(x.ID); })] });
        }).catch(function (err) { q('phong').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi chưa gán túi'); });
        T.get('TP_TuiBai/LayDSThi_TuiBai_DotThi', { strTuKhoa: '', strThi_DotThi_Id: e(dot.THI_DOTTHI_ID), pageIndex: 1, pageSize: 1000000 }).then(function (r) {
            ui.table({ el: q('datao'), rows: arr(r.data), empty: 'Đợt thi chưa có túi nào', columns: [{ title: 'Túi', prop: 'TEN' }, { title: 'Đợt phách', prop: 'THI_DOTPHACH_TEN' },
                { title: 'Học phần', prop: 'DAOTAO_HOCPHAN_TEN' }, { title: 'Số phách bắt đầu', prop: 'SOPHACHBATDAU', cls: 'is-center' },
                { title: 'Số phách kết thúc', prop: 'SOPHACHKETTHUC', cls: 'is-center' }] });
            T.locDong(q('datao'), q('ten').value);
        }).catch(function (err) { q('datao').innerHTML = ui.fail(err.message); ums.api.handle(err, 'túi đã tạo'); });
        T.get('TP_Chung/LayTuiTiepTheoTrongDotThi', { strDaoTao_HocPhan_Id: e(dot.DAOTAO_HOCPHAN_ID), strThi_DotThi_Id: e(dot.THI_DOTTHI_ID) }).then(function (r) {
            var d = arr(r.data)[0];
            if (!d || dlg.closed) return;
            if (!q('ten').value) q('ten').value = e(d.TUITIEPTHEO);
            if (!q('so').value) q('so').value = e(d.SOPHACHTIEPTHEO);
        }).catch(function (err) { ums.api.handle(err, 'túi tiếp theo'); });
        /* gõ tên túi → lọc bảng "túi đã tạo" để thấy tên đã dùng chưa (như gốc) */
        q('ten').addEventListener('input', function () { T.locDong(q('datao'), q('ten').value); });

        function giaTri() {
            return { strMa: '', strTen: q('ten').value.trim(), iThuTu: 1, strTienTo: q('tiento').value.trim(), dSoBaiThi: -1, dSoPhachBatDau: q('so').value.trim(),
                dSoPhachKetThuc: -1, strThi_DotPhach_Id: dot.ID };
        }
        function luu() {
            var v = giaTri(), ids = T.daChon(q('phong'), 'data-ckp');
            if (!v.strTen) { ui.toast('Nhập tên túi', 'warn'); q('ten').focus(); return; }
            ui.confirm('Tạo túi "' + v.strTen + '"' + (ids.length ? ' và gán ' + ids.length + ' danh sách thi đã chọn' : ' (chưa chọn danh sách thi nào)') + '?', { title: 'Lưu túi bài' }).then(function (yes) {
                if (!yes) return;
                T.post('TP_TuiBai/ThemMoi', v).then(function (r) {
                    var id = (r.raw && r.raw.Id) || '';
                    ui.toast('Thêm mới thành công!', 'ok');
                    if (!id && ids.length) { ui.toast('Máy chủ không trả mã túi mới — chưa gán được danh sách thi đã chọn.', 'warn'); return null; }
                    return ids.length ? ui.batch(ids.map(function (d) {
                        return T.thamSo('TP_TuiBai_DST/Them_Thi_TuiBai_DST', 'POST', { strThi_DanhSachThi_Id: d, strThi_DotPhach_Id: dot.ID, strThi_TuiBai_Id: id });
                    }), { title: 'Đang gán danh sách thi vào túi', okText: 'Gán danh sách thi', concurrency: 5 }) : null;
                }).then(function () { dlg.close(); xong(); }).catch(function (err) { ums.api.handle(err, 'lưu túi'); });
            });
        }
        function taoTuDong() {
            var ids = T.daChon(q('phong'), 'data-ckp');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
            ui.confirm('Tạo túi tự động và sinh phách theo ' + ids.length + ' danh sách thi đã chọn?', { title: 'Tạo túi tự động theo DST', ok: 'Thực hiện' }).then(function (yes) {
                if (!yes) return;
                var v = giaTri();
                T.post('TP_XuLy/TaoTui_SinhPhach_DST', Object.assign({ strTHI_QuyTacPhanDoan_Id: dlg.body.querySelector('select[data-pd2]').value }, v, { strThi_DanhSachThi_Id: ids.join(',') }))
                    .then(function () { ui.toast('Thực hiện thành công!', 'ok'); dlg.close(); xong(); }).catch(function (err) { ums.api.handle(err, 'tạo túi tự động'); });
            });
        }
        return dlg;
    }

    /* ---------- "Danh sách sinh viên trong túi bài" ------------------------------
       tc (tuibaitc): sửa được tên / số bắt đầu / tiền tố + thêm, xoá sinh viên → biểu mẫu TRONG TRANG thay chỗ vùng đánh túi.
       cu (tuibai):   chỉ xem → giữ hộp thoại. */
    function hopSinhVien(ctx, dot, tui, xong) {
        var tc = ctx.tc, doi = false;
        var cauHinh = { title: 'Danh sách sinh viên trong túi bài', icon: 'fa-users',
            body: (tc ? '<div class="ums-grid ums-grid--2">' +
                        '<div class="tpt-cadong">' + ui.field('Tên túi', '<input class="ums-input" data-h="ten" autocomplete="off">') + '</div>' +
                        ui.field('Số bắt đầu', '<input class="ums-input" data-h="so" autocomplete="off">') +
                        ui.field('Tiền tố', '<input class="ums-input" data-h="tiento" autocomplete="off">') + '</div>' +
                    '<div class="tpt-thanh">' + ui.btn('add', { text: 'Thêm vào túi', mod: 'out-success', attr: { 'data-h': 'them' } }) + '</div>' : '') +
                '<div class="tpt-bang" data-h="bang"></div>',
            xoa: tc ? { chon: 'input[data-cks]', text: 'Xóa', onClick: function () { xoa(); } } : null,
            buttons: tc ? [{ text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }] : [],
            onClose: function () { if (doi) xong(); } };
        var dlg = tc ? pat.formTrang(Object.assign({ host: ctx.z('view'), cols: 1 }, cauHinh)) : ui.dialog(Object.assign({ size: 'xl' }, cauHinh));
        function q(k) { return dlg.body.querySelector('[data-h="' + k + '"]'); }
        T.ganChonTatCa(dlg.body, ['data-cks']);
        if (tc) { q('ten').value = e(tui.TEN); q('so').value = e(tui.SOPHACHBATDAU); q('tiento').value = e(tui.TIENTO); }
        function tai() {
            q('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return T.get('TP_Chung/LayDSNguoiHocTheoTuiBai', { strThi_TuiBai_Id: tui.ID }).then(function (r) {
                var cot = [{ title: 'Số báo danh', prop: 'SOBAODANH' },
                    { title: 'Số phách', render: function (x) { return esc((e(x.TIENTO) + ' ' + e(x.SOPHACH)).trim()); } },
                    { title: 'Mã sinh viên', prop: 'QLSV_NGUOIHOC_MASO' },
                    { title: 'Họ và tên', render: function (x) { return esc((e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)).trim()); } },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Danh sách thi', prop: 'THI_DANHSACHTHI_TEN' }];
                if (tc) cot.push(T.cotChon('data-cks', function (x) { return e(x.ID); }));
                ui.table({ el: q('bang'), rows: arr(r.data), empty: 'Túi chưa có sinh viên', columns: cot });
            }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên trong túi'); });
        }
        function luu() {
            var v = { strId: tui.ID, strMa: '', strTen: q('ten').value.trim(), iThuTu: 1, strTienTo: q('tiento').value.trim(), dSoBaiThi: -1, dSoPhachBatDau: q('so').value.trim(),
                dSoPhachKetThuc: -1, strThi_DotPhach_Id: dot.ID };
            if (!v.strTen) { ui.toast('Nhập tên túi', 'warn'); q('ten').focus(); return; }
            ui.confirm('Cập nhật tên, số bắt đầu, tiền tố của túi "' + e(tui.TEN) + '"?', { title: 'Lưu túi bài' }).then(function (yes) {
                if (!yes) return;
                T.post('TP_TuiBai/CapNhat', v).then(function () { ui.toast('Cập nhật thành công!', 'ok'); doi = true; dlg.close(); })
                    .catch(function (err) { ums.api.handle(err, 'cập nhật túi'); });
            });
        }
        function xoa() {
            var ids = T.daChon(q('bang'), 'data-cks');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng ?', 'warn'); return; }
            ui.confirm('Xoá ' + ids.length + ' sinh viên khỏi túi "' + e(tui.TEN) + '"?', { tone: 'bad', ok: 'Xoá', title: 'Xóa sinh viên khỏi túi' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) { return T.thamSo('TP_XuLy/Xoa_Thi_Tui_NH_ThuCong', 'POST', { strThi_TuiBai_NguoiHoc_Id: id, strThi_TuiBai_Id: tui.ID, iM: T.iM() }); }),
                    { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!', concurrency: 5, show: true }).then(function () { doi = true; return tai(); });
            });
        }
        if (tc) q('them').addEventListener('click', function () { hopChuaThem(tui, function () { doi = true; tai(); }); });
        tai();
        return dlg;
    }

    /* ---------- Hộp "Danh sách cần thêm" — sinh viên chưa dồn túi (chỉ màn tc) ------ */
    function hopChuaThem(tui, xong) {
        var ds = [];
        var dlg = ui.dialog({ title: 'Danh sách cần thêm', icon: 'fa-user-plus', size: 'lg', body: '<div class="tpt-bang" data-h="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }] });
        var h = dlg.body.querySelector('[data-h="bang"]');
        T.ganChonTatCa(dlg.body, ['data-ckn']);
        T.post('TP_XuLy/LayDSNguoiHocChuaDonTui', { strThi_TuiBai_Id: tui.ID, iM: T.iM() }).then(function (r) {
            ds = arr(r.data);
            ui.table({ el: h, rows: ds, empty: 'Không còn sinh viên chưa dồn túi', columns: [{ title: 'Mã Số', prop: 'MASO' }, { title: 'Họ và tên', prop: 'HOTEN' },
                { title: 'Số báo danh', prop: 'SOBAODANH' },
                { title: 'Tiền tố', width: '150px', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-tt="' + i + '" autocomplete="off">'; } },
                { title: 'Số phách', width: '150px', render: function (x, i) { return '<input class="ums-input ums-input--sm" data-sp="' + i + '" autocomplete="off">'; } },
                T.cotChon('data-ckn')] });
        }).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên chưa dồn túi'); });
        function luu() {
            var ids = T.daChon(h, 'data-ckn');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return; }
            ui.confirm('Thêm ' + ids.length + ' sinh viên vào túi "' + e(tui.TEN) + '"?', { title: 'Thêm vào túi' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (i) {
                    return T.thamSo('TP_XuLy/Them_Thi_Tui_NH_ThuCong', 'POST', { strThi_DanhSachSinhVien_Id: e(ds[Number(i)].ID), strThi_TuiBai_Id: tui.ID,
                        strTienTo: h.querySelector('[data-tt="' + i + '"]').value.trim(), strSoPhach: h.querySelector('[data-sp="' + i + '"]').value.trim(), iM: T.iM() });
                }), { title: 'Đang thêm vào túi', okText: 'Thực hiện thành công', concurrency: 5, show: true }).then(function () { dlg.close(); xong(); });
            });
        }
        return dlg;
    }
})();
