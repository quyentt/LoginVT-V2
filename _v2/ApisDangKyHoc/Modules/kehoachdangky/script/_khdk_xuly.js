/* =========================================================================
   Kế hoạch đăng ký — lưới "Thiết đặt thêm xử lý lớp HP" (NGAY TRONG TRANG, thay chỗ màn —
   pat.formTrang, BO-CUC luật 1, rà hộp thoại 2026-09-30) + hộp "Chọn lớp học phần" (hộp chọn, giữ)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky (html #myModalXuLyLHP, #myModalChonLHP;
            script: openModal_XuLyLHP, getList_XuLyLHP, renderPage_XuLyLHP, btnApDungTatCa,
            deleteSelected_XuLyLHP, delete_XuLyLHP, save_XuLyLHP, insert_XuLyLHP,
            openModal_ChonLHP, getList_PhanCongLHP, genTable_ChonLHP, filter_ChonLHP,
            toggleSelectAll_ChonLHP, cbLoad_XuLyDacThu / genOptions_XuLyDacThu)
   ---------------------------------------------------------------------------
   ums.khdk.xuLyLHP(keHoachId, vungGoc)      vungGoc = gốc màn (vùng bị thay chỗ)

   Lời gọi (chép nguyên, đều mã hoá):
       PKG_DANGKYHOC_THONGTIN2.Pr_DK_Kh_LopHp_DacThu_GetBy     strDangKy_KeHoachDangKy_Id · strXuLyDacThu_Id ''
       PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_PhanCong_LHP_GetBy    strDangKy_KeHoachDangKy_Id · strLaLopRieng (ô lọc lúc mở = '')
       PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_KH_LopHp_DacThu_Ins   strDangKy_LopHocPhan_Id · strHieuLuc '1' · strXuLyDacThu_Id
       PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_KH_LopHp_DacThu_Del   strId (ID dòng đã lưu)
       (mọi lời gọi kèm strVaiTroDangNhap_Id / strChucNangHeThong_Id hệ thống, strHanhDong_Code '')
       danh mục DANGKY.QUYDINH.LOP.XULYDACTHU (ô "Xử lý đặc thù", value = ID || MA, nhãn TEN || TENDANHMUC)
   Tên cột đọc về: chép nguyên CẢ chuỗi dự phòng của gốc (DANGKY_LOPHOCPHAN_ID || LOPHOCPHAN_ID …,
   LOPRIENG / LopRieng / LALOPRIENG / LA_LOP_RIENG) — gốc chưa chốt tên cột.

   Nghiệp vụ giữ như gốc:
     · Lưu chỉ THÊM các dòng mới (chưa có ID). Đổi "Xử lý đặc thù" của dòng đã lưu KHÔNG
       được lưu (gốc báo "Các dòng đã lưu trước đó không thay đổi") — không có procedure sửa.
     · Mọi dòng phải có Xử lý đặc thù mới lưu; lưu hết thành công thì đóng lưới, về danh sách.
     · Dòng đã lưu không bỏ chọn được ở hộp "Chọn lớp học phần" (phải xoá ở bảng).
     · "Áp dụng": áp cho các dòng đang đánh dấu, không đánh dấu dòng nào thì áp cho tất cả.
     · Nút "Lưu" của hộp Chọn lớp học phần chỉ ĐÓNG hộp — lớp đã vào bảng ngay khi đánh dấu.
     · Phân trang ở máy khách (gốc: 20/50/100/200 và 10/20/50/100).

   Khác gốc:
     · Xoá nhiều dòng: nút chuẩn ums.ui.xoaChon ở đầu khung, cạnh nút Đóng.
     · toggleSelectAll_ChonLHP của gốc chạy hai vòng (vòng đầu thêm qua addRow, vòng sau
       lặp lại) và đếm "đã lưu" hai lần — viết lại một vòng, cùng kết quả.
     · Xoá hàng loạt / lưu hàng loạt: ums.ui.batch thay cho N lời gọi song song.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var K = ums.khdk = ums.khdk || {};
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    function rs(r) { return Array.isArray(r.data) ? r.data : []; }
    function laMot(v) { return v == 1 || v === '1'; }   // eslint-disable-line eqeqeq

    var HT = { strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: '' };
    function goi(o) {
        Object.keys(HT).forEach(function (k) { if (o[k] === undefined) o[k] = HT[k]; });
        return o;
    }

    var dmXuLy = null;
    function napXuLy() {
        if (!dmXuLy) dmXuLy = ums.api.dm('DANGKY.QUYDINH.LOP.XULYDACTHU').catch(function (err) {
            dmXuLy = null; ums.api.handle(err, 'danh mục xử lý đặc thù'); return [];
        });
        return dmXuLy;
    }
    function opts(ds, chon) {
        var h = '<option value="">-- Chọn --</option>';
        (ds || []).forEach(function (it) {
            var id = it.ID || it.MA || '', ten = it.TEN || it.TENDANHMUC || '';
            h += '<option value="' + esc(id) + '"' + (chon && String(chon) === String(id) ? ' selected' : '') + '>' + esc(ten) + '</option>';
        });
        return h;
    }

    K.xuLyLHP = function (khId, goc) {
        var data = [];              // { ID, DANGKY_LOPHOCPHAN_ID, TENLOP, MALOP, XULYDACTHU_ID, _selected }
        var page = 1, size = 20, dsXL = [];

        var dlg = ums.pat.formTrang({
            host: goc,
            title: 'Thiết đặt thêm xử lý lớp HP', icon: 'fa-gear', cols: 1,
            body:
                '<div class="ums-row ums-row--between">' +
                    '<div class="ums-row">' +
                        '<span class="ums-u-muted">Áp dụng cho tất cả</span>' +
                        '<span class="khdk-bulk"><select class="ums-select" data-f="bulk" data-ph="-- Chọn xử lý đặc thù --"><option value="">-- Chọn xử lý đặc thù --</option></select></span>' +
                        ui.btn('confirm', { text: 'Áp dụng', mod: 'out-primary', attr: { 'data-a': 'apdung' } }) +
                    '</div>' +
                    ui.btn('add', { text: 'Thêm lớp', mod: 'out-success', attr: { 'data-a': 'themlop' } }) +
                '</div>' +
                '<div class="ums-u-mt-4" data-z="t">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            xoa: { chon: 'input[data-xl]', text: 'Xóa các dòng đã chọn', onClick: function () { xoaChon(); } },
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } }]
        });
        var B = dlg.body, host = B.querySelector('[data-z="t"]');

        napXuLy().then(function (ds) {
            dsXL = ds;
            B.querySelector('[data-f="bulk"]').innerHTML = opts(ds, '').replace('-- Chọn --', '-- Chọn xử lý đặc thù --');
            if (window.jQuery) jQuery(B.querySelector('[data-f="bulk"]')).trigger('change.select2');
            ve();
        });

        function ve() {
            var total = data.length;
            var pages = Math.max(1, Math.ceil(total / size));
            if (page > pages) page = pages;
            var start = (page - 1) * size;
            var tat = total > 0 && data.every(function (d) { return d._selected; });
            ui.table({
                el: host, rows: data.slice(start, start + size), stt: false,
                empty: 'Chưa có lớp học phần nào — bấm "Thêm lớp"',
                page: { index: page, size: size, total: total, sizes: [20, 50, 100, 200],
                        onChange: function (p) { if (p >= 1 && p <= pages) { page = p; ve(); } },
                        onSize: function (v) { size = v; page = 1; ve(); } },
                columns: [
                    { head: '<input type="checkbox" data-xl="all" title="Chọn tất cả"' + (tat ? ' checked' : '') + '>', cls: 'is-center is-nowrap', width: '70px',
                      render: function (d, i) { return '<label class="ums-check"><input type="checkbox" data-xl="' + (start + i) + '"' + (d._selected ? ' checked' : '') + '> ' + (start + i + 1) + '</label>'; } },
                    { title: 'Lớp học phần', render: function (d) { return esc(d.TENLOP); } },
                    { title: 'Mã lớp', cls: 'is-nowrap', render: function (d) { return esc(d.MALOP); } },
                    { title: 'Xử lý đặc thù', width: '320px',
                      render: function (d, i) { return '<select class="ums-select" data-xs="' + (start + i) + '">' + opts(dsXL, d.XULYDACTHU_ID) + '</select>'; } }
                ]
            });
            var a = host.querySelector('input[data-xl="all"]');
            if (a) a.indeterminate = !tat && data.some(function (d) { return d._selected; });
            ui.demXoaChon();
        }
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.matches('input[data-xl]')) {
                var k = t.getAttribute('data-xl');
                if (k === 'all') data.forEach(function (d) { d._selected = t.checked; });
                else if (data[Number(k)]) data[Number(k)]._selected = t.checked;
                ve();
            } else if (t.matches('select[data-xs]')) {
                var d = data[Number(t.getAttribute('data-xs'))];
                if (d) d.XULYDACTHU_ID = t.value;
            }
        });

        function nap() {
            return ums.api.call(goi({
                action: 'DKH_ThongTin2_MH/ETMeBQoeCikeDS4xCTEeBSAiFSk0HgYkNQM4', func: 'PKG_DANGKYHOC_THONGTIN2.Pr_DK_Kh_LopHp_DacThu_GetBy',
                strDangKy_KeHoachDangKy_Id: khId, strXuLyDacThu_Id: ''
            })).then(function (r) {
                data = rs(r).map(function (x) {
                    return {
                        ID: x.ID || '',
                        DANGKY_LOPHOCPHAN_ID: x.DANGKY_LOPHOCPHAN_ID || x.LOPHOCPHAN_ID || '',
                        TENLOP: x.TENLOP || x.DANGKY_LOPHOCPHAN_TEN || x.LOPHOCPHAN_TEN || '',
                        MALOP: x.MALOP || x.DANGKY_LOPHOCPHAN_MA || x.LOPHOCPHAN_MA || '',
                        XULYDACTHU_ID: x.XULYDACTHU_ID || x.QUYDINHLOPXULYDACTHU_ID || '',
                        _selected: false
                    };
                });
                page = 1;
                return napXuLy().then(ve);
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thiết đặt xử lý lớp HP'); });
        }
        nap();

        function coLop(lhpId) { for (var i = 0; i < data.length; i++) if (data[i].DANGKY_LOPHOCPHAN_ID === lhpId) return data[i]; return null; }
        function them(row) {
            if (row.ID && coLop(row.ID)) return false;
            data.push({ ID: '', DANGKY_LOPHOCPHAN_ID: row.ID, TENLOP: row.TENLOP, MALOP: row.MALOP, XULYDACTHU_ID: '', _selected: false });
            return true;
        }
        /* Bỏ một lớp chưa lưu; lớp đã lưu thì không bỏ (trả false) */
        function bo(lhpId) {
            var d = coLop(lhpId);
            if (!d) return true;
            if (d.ID) return false;
            data.splice(data.indexOf(d), 1);
            return true;
        }

        /* ---- Áp dụng cho tất cả ---- */
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !B.contains(b)) return;
            var a = b.getAttribute('data-a');
            if (a === 'apdung') {
                var v = B.querySelector('[data-f="bulk"]').value;
                if (!v) { ui.toast('Vui lòng chọn xử lý đặc thù trước khi áp dụng!', 'warn'); return; }
                if (!data.length) { ui.toast('Chưa có lớp học phần nào trong bảng!', 'warn'); return; }
                var co = data.some(function (d) { return d._selected; }), n = 0;
                data.forEach(function (d) { if (!co || d._selected) { d.XULYDACTHU_ID = v; n++; } });
                ve();
                ui.toast('Đã áp dụng cho ' + n + ' dòng.', 'ok');
            } else if (a === 'themlop') {
                chonLHP(khId, { co: coLop, them: them, bo: bo, sau: ve });
            }
        });

        /* ---- Xoá các dòng đã chọn ---- */
        function xoaChon() {
            var daLuu = [], chuaLuu = {};
            data.forEach(function (d) {
                if (!d._selected) return;
                if (d.ID) daLuu.push(d.ID); else if (d.DANGKY_LOPHOCPHAN_ID) chuaLuu[d.DANGKY_LOPHOCPHAN_ID] = true;
            });
            var n = daLuu.length + Object.keys(chuaLuu).length;
            if (!n) { ui.toast('Vui lòng tick chọn ít nhất một dòng!', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa ' + n + ' dòng đã chọn?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                data = data.filter(function (d) { return !(chuaLuu[d.DANGKY_LOPHOCPHAN_ID] && !d.ID); });
                if (!daLuu.length) { ve(); ui.toast('Đã xóa ' + n + ' dòng!', 'ok'); return; }
                ui.batch(daLuu.map(function (rid) {
                    return function () {
                        return ums.api.call(goi({
                            action: 'DKH_ThongTin2_MH/ETMeBSAvJgo4HgoJHg0uMQkxHgUgIhUpNB4FJC0P', func: 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_KH_LopHp_DacThu_Del',
                            strId: rid
                        })).then(function (r) { data = data.filter(function (d) { return d.ID !== rid; }); return r; });
                    };
                }), { title: 'Đang xóa', toast: false }).then(function (kq) {
                    ve();
                    if (!kq.fail) ui.toast('Đã xóa ' + kq.ok + ' dòng!', 'ok');
                    else ui.toast('Xóa ' + kq.ok + '/' + daLuu.length + ' dòng. ' + kq.fail + ' dòng lỗi.', 'warn');
                });
            });
        }

        /* ---- Lưu: chỉ thêm dòng mới ---- */
        function luu() {
            var moi = [], thieu = false, co = 0;
            data.forEach(function (d) {
                if (!d.DANGKY_LOPHOCPHAN_ID) return;
                if (!d.XULYDACTHU_ID) { thieu = true; return; }
                co++;
                if (!d.ID) moi.push(d);
            });
            if (thieu) { ui.toast('Vui lòng chọn xử lý đặc thù cho tất cả lớp học phần!', 'warn'); return; }
            if (!co) { ui.toast('Vui lòng thêm ít nhất một lớp học phần!', 'warn'); return; }
            if (!moi.length) { ui.toast('Không có dòng mới để lưu. Các dòng đã lưu trước đó không thay đổi.', 'info'); return; }
            ui.batch(moi.map(function (d) {
                return goi({
                    action: 'DKH_ThongTin2_MH/ETMeBSAvJgo4HgoJHg0uMQkxHgUgIhUpNB4ILzIP', func: 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_KH_LopHp_DacThu_Ins',
                    strDangKy_KeHoachDangKy_Id: khId, strDangKy_LopHocPhan_Id: d.DANGKY_LOPHOCPHAN_ID,
                    strHieuLuc: '1', strXuLyDacThu_Id: d.XULYDACTHU_ID
                });
            }), { title: 'Đang lưu thiết đặt', toast: false }).then(function (kq) {
                var loi = kq.errors[kq.errors.length - 1] || '';
                if (!kq.fail) { ui.toast('Lưu thiết đặt xử lý lớp HP thành công! (' + kq.ok + ' dòng)', 'ok'); dlg.close(); }
                else if (!kq.ok) ui.toast('Lưu thất bại ' + kq.fail + ' dòng. ' + loi, 'bad');
                else { ui.toast('Lưu ' + kq.ok + '/' + moi.length + ' dòng. ' + kq.fail + ' dòng lỗi: ' + loi, 'warn'); nap(); }
            });
        }
    };

    /* ---------- Hộp "Chọn lớp học phần" ------------------------------------------
       x = { co(lhpId) → dòng đang có, them(row) → bool, bo(lhpId) → false nếu đã lưu, sau() } */
    function chonLHP(khId, x) {
        var all = [], loc = [], page = 1, size = 10;
        var dlg = ui.dialog({
            title: 'Chọn lớp học phần', icon: 'fa-screen-users', size: 'lg',
            body:
                '<div class="ums-filter">' +
                    '<div class="ums-field khdk-q"><input class="ums-input" data-f="q" placeholder="Tìm theo tên / mã lớp..." autocomplete="off"></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="rieng" data-required>' +
                        '<option value="">Tất cả lớp</option><option value="1">Chỉ lớp riêng</option><option value="0">Không phải lớp riêng</option></select></div>' +
                '</div>' +
                '<div class="ums-u-mt-4" data-z="t">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save' }]
        });
        var B = dlg.body, host = B.querySelector('[data-z="t"]');
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }
        ui.enhance(B);

        function locLai() {
            var q = (f('q').value || '').toLowerCase().trim(), r = f('rieng').value || '';
            loc = all.filter(function (row) {
                if (q && (row.TENLOP || '').toLowerCase().indexOf(q) < 0 && (row.MALOP || '').toLowerCase().indexOf(q) < 0) return false;
                if (r === '1' && row.LALOPRIENG !== 1) return false;
                if (r === '0' && row.LALOPRIENG === 1) return false;
                return true;
            });
            page = 1;
            ve();
        }
        function ve() {
            var total = loc.length, pages = Math.max(1, Math.ceil(total / size));
            if (page > pages) page = pages;
            var start = (page - 1) * size;
            var n = loc.filter(function (row) { return !!x.co(row.ID); }).length;
            ui.table({
                el: host, rows: loc.slice(start, start + size), stt: false, empty: 'Không có dữ liệu',
                rowCls: function (row) { return x.co(row.ID) ? 'is-selected' : ''; },
                page: { index: page, size: size, total: total, sizes: [10, 20, 50, 100],
                        onChange: function (p) { if (p >= 1 && p <= pages) { page = p; ve(); } },
                        onSize: function (v) { size = v; page = 1; ve(); } },
                columns: [
                    { title: 'STT', cls: 'is-center', width: '56px', render: function (row, i) { return start + i + 1; } },
                    { title: 'Tên lớp', render: function (row) { return esc(row.TENLOP); } },
                    { title: 'Mã lớp', cls: 'is-nowrap', render: function (row) { return esc(row.MALOP); } },
                    { title: 'Lớp riêng', cls: 'is-center', width: '100px', render: function (row) { return row.LALOPRIENG === 1 ? ui.badge('Có', 'info') : ui.badge('Không', 'mute'); } },
                    { head: '<input type="checkbox" data-cl="all" title="Chọn tất cả kết quả đang lọc"' + (total && n === total ? ' checked' : '') + '>', cls: 'is-center', width: '60px',
                      render: function (row, i) { return '<input type="checkbox" data-cl="' + (start + i) + '"' + (x.co(row.ID) ? ' checked' : '') + '>'; } }
                ]
            });
            var a = host.querySelector('input[data-cl="all"]');
            if (a) a.indeterminate = n > 0 && n < total;
        }
        host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches('input[data-cl]')) return;
            var k = t.getAttribute('data-cl');
            if (k === 'all') {
                var chan = 0;
                loc.forEach(function (row) {
                    if (!row.ID) return;
                    if (t.checked) { if (!x.co(row.ID)) x.them(row); }
                    else if (!x.bo(row.ID)) chan++;
                });
                if (chan) ui.toast('Có ' + chan + ' lớp đã lưu trước đó nên không thể bỏ chọn ở đây. Hãy dùng nút xóa trong bảng bên dưới.', 'warn');
            } else {
                var row = loc[Number(k)];
                if (!row) return;
                if (t.checked) x.them(row);
                else if (!x.bo(row.ID)) { ui.toast('Dòng này đã lưu trong DB. Hãy dùng nút xóa trong bảng bên dưới để xóa.', 'warn'); }
            }
            x.sau();
            ve();
        });
        f('q').addEventListener('input', locLai);
        if (window.jQuery) jQuery(f('rieng')).on('change', locLai);

        ums.api.call(goi({
            action: 'DKH_ThongTin2_MH/ETMeBSAvJgo4HhEpIC8CLi8mHg0JER4GJDUDOAPP', func: 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_PhanCong_LHP_GetBy',
            strDangKy_KeHoachDangKy_Id: khId, strLaLopRieng: f('rieng').value || ''
        })).then(function (r) {
            all = rs(r).map(function (row) {
                return {
                    ID: row.DANGKY_LOPHOCPHAN_ID || row.LOPHOCPHAN_ID || row.ID || '',
                    TENLOP: row.DANGKY_LOPHOCPHAN_TEN || row.LOPHOCPHAN_TEN || row.TENLOP || '',
                    MALOP: row.DANGKY_LOPHOCPHAN_MA || row.LOPHOCPHAN_MA || row.MALOP || '',
                    LALOPRIENG: (laMot(row.LOPRIENG) || laMot(row.LopRieng) || laMot(row.LALOPRIENG) || laMot(row.LA_LOP_RIENG)) ? 1 : 0
                };
            });
            locLai();
        }).catch(function (err) { all = []; locLai(); ums.api.handle(err, 'lớp học phần'); });
    }
})();
