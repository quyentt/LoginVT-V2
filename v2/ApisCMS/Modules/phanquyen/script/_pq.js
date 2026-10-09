/* =========================================================================
   ums.pq — khung chung của SÁU màn phân quyền dạng LƯỚI Ô ĐÁNH DẤU
   (ApisCMS/Modules/phanquyen: diem, baocaoimport, canbonhaphosocanbo,
    canbonhaphososinhvien, canhantunhaphoso, sinhvientunhap)
   -------------------------------------------------------------------------
   Sáu bản gốc chép nhau gần từng dòng (so bằng git diff --no-index): cùng một
   bảng CÂY × CỘT — bên trái là cây cấu trúc (THANHPHAN_ID / THANHPHAN_CHA_ID /
   THANHPHAN_TEN, gốc vẽ bằng insertHeaderTable đệ quy rowspan/colspan), mỗi
   LÁ của cây là một dòng; các cột là người dùng hoặc trường thông tin; ô là ô
   đánh dấu "có quyền". Mỗi lá một lời gọi lấy quyền (QUYEN = 1 → đánh dấu, nhớ
   QUYEN_ID). Nút "Phân quyền" so trạng thái ô với lúc nạp: ô mới đánh dấu →
   Thêm, ô bỏ đánh dấu mà trước có quyền → Xoá. Khác nhau ở lời gọi — mỗi màn
   tự khai, tên tham số chép nguyên văn bản gốc.

   ums.pq.luoi(host, { tieuDe, tenCot(c), dong(laId) → call })
       → { ve(cot, cauTruc, tenQuyen) → Promise, thayDoi(), dangNap(), xoaTrang(msg), rong() }
       thayDoi() → { them: [{ dong, cot }], xoa: [{ dong, cot, quyen }] }
                   dong = THANHPHAN_ID của lá · cot = ID của cột · quyen = QUYEN_ID đã có
   ums.pq.phanQuyen(L, { them(x) → call, xoa(x) → call, sauLuu })   hỏi lại + chạy hàng loạt
   ums.pq.chay(calls, sauLuu)                                       chạy hàng loạt (tiến độ) rồi nạp lại
   ums.pq.chucNang(el, call) · ums.pq.hanhDong(el, call)             đổ hai ô chọn chức năng / quyền
   ums.pq.daoTao(root, { onDoi(tầng) })  Hệ → Khoá → CT → Lớp, Năm nhập học, Khoa QL (CHỌN NHIỀU như
                                         gốc) + khối "Chọn trạng thái sinh viên" → { f, v, tt, thamSo() }
   ums.pq.gopDoc(table, cột)             gộp ô liền nhau cùng chữ (edu.system.actionRowSpan)
   ums.pq.sel / inp / nutTim / legend    HTML ô lọc

   Khác bản gốc (đổi cách dựng, không đổi dữ liệu gửi đi):
     · Bảng qua ums.ui.table rồi gộp ô cây (rowspan / colspan) — gốc nối chuỗi tay.
       Lá nằm nông hơn tầng sâu nhất kéo dài hết các cột cây (gốc quên kéo lá ở
       tầng 0 nên dòng lệch cột).
     · Nạp quyền từng lá: hàng đợi 6 luồng, đếm tiến độ ở đầu bảng; đang nạp thì
       CHẶN nút Phân quyền (gốc cho bấm → ô chưa kịp đánh dấu bị coi là "thêm mới",
       ô đã có quyền không bị xoá).
     · Lưu qua ums.ui.batch (tiến độ + đếm lỗi) thay genHTML_Progress + một thông
       báo "Phân quyền thành công" cho MỖI ô; xong thì nạp lại như gốc (endGet…2).
     · Hỏi lại bằng ums.ui.confirm — gốc gắn thêm một trình xử lý #btnYes MỖI lần
       bấm, bấm lần thứ hai là gửi mọi lời gọi hai lần.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var pq = ums.pq = ums.pq || {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function esc(s) { return ui.esc(s); }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
    pq.e = e;
    pq.arr = arr;
    /* edu.system.strChucNang_Id / appId (= vai trò đăng nhập, CLAUDE.md mục 4) / userId */
    pq.cn = function () { return (ums.state && ums.state.chucNangId) || ''; };
    pq.vt = function () { return (ums.state && ums.state.roleId) || (ums.session && ums.session.appId) || ''; };
    pq.uid = function () { return (ums.session && ums.session.userId) || ''; };
    pq.gop = function (a, b) { var r = {}; [a, b].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { r[k] = o[k]; }); }); return r; };

    /* ---------- HTML ô lọc ------------------------------------------------ */
    pq.sel = function (k, ph, nhieu) {
        return '<div class="ums-field"><select class="ums-select" data-f="' + esc(k) + '" data-ph="' + esc(ph) + '"' +
            (nhieu ? ' multiple' : '') + '>' + (nhieu ? '' : '<option value=""></option>') + '</select></div>';
    };
    pq.inp = function (k, ph) {
        return '<div class="ums-field"><input class="ums-input" data-f="' + esc(k) + '" placeholder="' + esc(ph) + '" autocomplete="off"></div>';
    };
    pq.nutTim = function () {
        return '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>';
    };
    pq.hang = function (html, dau) { return '<div class="ums-filter' + (dau ? '' : ' ums-u-mt-3') + '">' + html + '</div>'; };

    /* ---------- Chức năng phân quyền / quyền cần thiết lập ----------------- */
    pq.chucNang = function (el, call) {
        return ums.api.call(pq.gop(call, { method: 'GET', silent: true })).then(function (r) {
            pat.fill(el, arr(r.data), { name: 'PHANQUYEN_CHUCNANG_TEN', head: 'Chọn chức năng phân quyền' });
        }).catch(function (err) { ums.api.handle(err, 'chức năng cần phân quyền'); });
    };
    /* call = null → xoá trắng danh sách (chưa chọn chức năng — ô đang khoá, khỏi gọi thừa) */
    pq.hanhDong = function (el, call, dsKhac) {
        var ve = function (rows) {
            [el].concat(dsKhac || []).forEach(function (x) {
                if (x) pat.fill(x, rows, { name: 'HANHDONG_TEN', head: 'Chọn quyền cần thiết lập' });
            });
            return rows;
        };
        if (!call) return Promise.resolve(ve([]));
        return ums.api.call(pq.gop(call, { method: 'GET', silent: true })).then(function (r) { return ve(arr(r.data)); })
            .catch(function (err) { ums.api.handle(err, 'quyền cần thiết lập'); return []; });
    };
    /** Chữ đang hiện của ô chọn (gốc: $("#x option:selected").text()) */
    pq.chu = function (el) {
        var o = el && el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null;
        return o && o.value ? o.textContent : '';
    };

    /* ---------- Gộp ô liền nhau cùng chữ (edu.system.actionRowSpan) ------- */
    pq.gopDoc = function (table, cot) {
        if (!table) return;
        var truoc = null, dem = 0;
        qa(table, 'tbody > tr').forEach(function (tr) {
            var td = tr.children[cot];
            if (!td) return;
            if (truoc && truoc.textContent === td.textContent) {
                dem++;
                truoc.rowSpan = dem;
                td.parentNode.removeChild(td);
            } else {
                truoc = td; dem = 1;
                td.classList.add('ums-gtable__g');
            }
        });
    };

    /* ---------- Hàng đợi nạp (không hộp tiến độ) -------------------------- */
    function hangDoi(viec, luong, moiXong) {
        var i = 0;
        function chay() {
            if (i >= viec.length) return Promise.resolve();
            var f = viec[i++];
            return Promise.resolve().then(f).catch(function () {}).then(function () { if (moiXong) moiXong(); return chay(); });
        }
        var p = [];
        for (var k = 0; k < Math.min(luong, viec.length); k++) p.push(chay());
        return Promise.all(p);
    }

    /* =====================================================================
       Lưới CÂY × CỘT
       ===================================================================== */
    pq.luoi = function (host, cfg) {
        var cot = [], la = [], cu = {}, luot = 0, dang = false;
        host.innerHTML = '<div class="pq-tien ums-u-faint ums-u-fz13" data-pq-tien></div><div data-pq-bang></div>';
        var tien = host.querySelector('[data-pq-tien]'), bang = host.querySelector('[data-pq-bang]');

        function xoaTrang(msg, icon) {
            luot++; dang = false; cot = []; la = []; cu = {};
            tien.textContent = '';
            bang.innerHTML = ui.empty(msg, icon || 'fa-hand-pointer');
        }

        /* Cây → danh sách lá theo thứ tự duyệt sâu (như recuseHeader của gốc).
           Gốc tìm gốc cây bằng THANHPHAN_CHA_ID == null. */
        function dungCay(ds) {
            var con = {};
            ds.forEach(function (r) {
                var k = r.THANHPHAN_CHA_ID == null ? '\u0000' : String(r.THANHPHAN_CHA_ID);
                (con[k] = con[k] || []).push(r);
            });
            var las = [], sau = 0;
            function duyet(nut, tren) {
                var ds2 = con[String(nut.THANHPHAN_ID)] || [];
                if (!ds2.length) {
                    las.push({ id: nut.THANHPHAN_ID, ten: nut.THANHPHAN_TEN, tren: tren });
                    if (tren.length > sau) sau = tren.length;
                    return 1;
                }
                var muc = { ten: nut.THANHPHAN_TEN, n: 0 };
                var t2 = tren.concat([muc]);
                ds2.forEach(function (c) { muc.n += duyet(c, t2); });
                return muc.n;
            }
            (con['\u0000'] || []).forEach(function (g) { duyet(g, []); });
            return { la: las, tang: sau + 1 };
        }

        function ve(dsCot, cauTruc, tenQuyen) {
            var sh = ++luot;
            cot = arr(dsCot); cu = {};
            var cay = dungCay(arr(cauTruc));
            la = cay.la;
            var T = cay.tang;
            if (!la.length) { tien.textContent = ''; bang.innerHTML = ui.empty('Không có dữ liệu', 'fa-inbox'); return Promise.resolve(); }

            /* Mỗi dòng: T ô cây — ô tổ tiên chỉ vẽ ở lá ĐẦU của nhánh (rowspan = số lá). */
            var daVe = [];
            var dong = la.map(function (l, i) {
                var o = [];
                for (var k = 0; k < T; k++) {
                    if (k < l.tren.length) {
                        var m = l.tren[k];
                        if (daVe.indexOf(m) < 0) { daVe.push(m); o.push('<span data-pqo="s" data-n="' + m.n + '">' + esc(m.ten) + '</span>'); }
                        else o.push('<span data-pqo="c"></span>');
                    } else if (k === l.tren.length) {
                        o.push('<span data-pqo="l" data-n="' + (T - k) + '">' + esc(l.ten) + '</span>');
                    } else o.push('<span data-pqo="c"></span>');
                }
                return { o: o, i: i };
            });

            var columns = [];
            for (var k = 0; k < T; k++) {
                (function (k) {
                    columns.push({ head: k === 0 ? esc(cfg.tieuDe + (tenQuyen ? ' ' + tenQuyen : '')) : '', cls: 'pq-cay',
                        render: function (r) { return r.o[k]; } });
                })(k);
            }
            cot.forEach(function (c, j) {
                columns.push({
                    head: '<span class="pq-cot">' + esc(cfg.tenCot(c)) + '</span><input type="checkbox" data-pqcot="' + j + '" title="Chọn cả cột">',
                    cls: 'is-center pq-o',
                    render: function (r) { return '<input type="checkbox" data-pq="' + r.i + '|' + j + '">'; }
                });
            });
            columns.push({ head: '<span class="pq-cot">Tất cả</span><input type="checkbox" data-pqall title="Chọn cả bảng">', cls: 'is-center pq-o',
                render: function (r) { return '<input type="checkbox" data-pqdong="' + r.i + '" title="Chọn cả dòng">'; } });

            ui.table({ el: bang, rows: dong, columns: columns, stt: false, tableCls: 'ums-table--lined ums-gtable pq-bang' });

            /* Gộp ô cây */
            qa(bang, 'tbody [data-pqo]').forEach(function (s) {
                var td = s.parentNode, k = s.getAttribute('data-pqo'), n = Number(s.getAttribute('data-n'));
                if (k === 'c') td.parentNode.removeChild(td);
                else if (k === 's') { td.rowSpan = n; td.classList.add('ums-gtable__g'); }
                else if (n > 1) td.colSpan = n;
            });
            var ths = qa(bang, 'thead th');
            if (ths[0]) ths[0].colSpan = T;
            for (var x = 1; x < T; x++) if (ths[x]) ths[x].parentNode.removeChild(ths[x]);

            /* Nạp quyền từng lá — mỗi lá một lời gọi như gốc */
            var viTri = {};
            cot.forEach(function (c, j) { viTri[String(c.ID)] = j; });
            var xong = 0;
            dang = true;
            tien.textContent = 'Đang nạp quyền 0/' + la.length + '…';
            var viec = la.map(function (l, i) {
                return function () {
                    return ums.api.call(pq.gop(cfg.dong(l.id), { method: 'GET', silent: true })).then(function (r) {
                        if (sh !== luot) return;
                        arr(r.data).forEach(function (d) {
                            if (Number(d.QUYEN) !== 1) return;
                            var j = viTri[String(d.ID)];
                            if (j === undefined) return;
                            var c = bang.querySelector('input[data-pq="' + i + '|' + j + '"]');
                            if (c) c.checked = true;
                            /* gốc: check.attr('name', QUYEN_ID) — QUYEN_ID rỗng thì ô không mang
                               name → coi như chưa có quyền */
                            if (d.QUYEN_ID !== null && d.QUYEN_ID !== undefined) cu[i + '|' + j] = d.QUYEN_ID;
                        });
                    }).catch(function (err) { if (sh === luot) ums.api.handle(err, 'quyền của ' + (l.ten || '')); });
                };
            });
            return hangDoi(viec, 6, function () {
                if (sh !== luot) return;
                xong++;
                tien.textContent = xong < la.length ? 'Đang nạp quyền ' + xong + '/' + la.length + '…' : '';
                dongBo();
            }).then(function () { if (sh === luot) { dang = false; dongBo(); } });
        }

        /* Ô "chọn cả cột / cả dòng / cả bảng" (chkSelectAll / chkSelectAllTable của gốc) */
        bang.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches) return;
            if (t.matches('[data-pqcot]')) {
                var j = t.getAttribute('data-pqcot');
                qa(bang, 'input[data-pq]').forEach(function (c) { if (c.getAttribute('data-pq').split('|')[1] === j) c.checked = t.checked; });
            } else if (t.matches('[data-pqdong]')) {
                var i = t.getAttribute('data-pqdong');
                qa(bang, 'input[data-pq]').forEach(function (c) { if (c.getAttribute('data-pq').split('|')[0] === i) c.checked = t.checked; });
            } else if (t.matches('[data-pqall]')) {
                qa(bang, 'tbody input[type="checkbox"]').forEach(function (c) { c.checked = t.checked; });
            }
            dongBo();
        });

        /* Ô cha theo ô con: ô cột / ô dòng / ô "Tất cả" chỉ đánh dấu khi MỌI ô con của nó đã đánh dấu —
           bỏ một ô con là ô cha bỏ theo (gốc chỉ có chiều cha → con). Gọi sau mỗi lần đổi và sau khi nạp quyền. */
        function dongBo() {
            var o = qa(bang, 'input[data-pq]'), cotDu = {}, dongDu = {}, tatCa = o.length > 0;
            o.forEach(function (c) {
                var ij = c.getAttribute('data-pq').split('|');
                if (cotDu[ij[1]] === undefined) cotDu[ij[1]] = true;
                if (dongDu[ij[0]] === undefined) dongDu[ij[0]] = true;
                if (!c.checked) { cotDu[ij[1]] = false; dongDu[ij[0]] = false; tatCa = false; }
            });
            qa(bang, 'input[data-pqcot]').forEach(function (c) { c.checked = !!cotDu[c.getAttribute('data-pqcot')]; });
            qa(bang, 'input[data-pqdong]').forEach(function (c) { c.checked = !!dongDu[c.getAttribute('data-pqdong')]; });
            var a = bang.querySelector('input[data-pqall]');
            if (a) a.checked = tatCa;
        }

        function thayDoi() {
            var them = [], xoa = [];
            qa(bang, 'input[data-pq]').forEach(function (c) {
                var p = c.getAttribute('data-pq'), ij = p.split('|');
                var x = { dong: la[+ij[0]].id, cot: cot[+ij[1]].ID };
                var co = cu.hasOwnProperty(p);
                if (c.checked && !co) them.push(x);
                else if (!c.checked && co) { x.quyen = cu[p]; xoa.push(x); }
            });
            return { them: them, xoa: xoa };
        }

        return {
            ve: ve, thayDoi: thayDoi, xoaTrang: xoaTrang,
            dangNap: function () { return dang; },
            rong: function () { return !la.length; },
            loi: function (msg) { luot++; dang = false; tien.textContent = ''; bang.innerHTML = ui.fail(msg); }
        };
    };

    /** Kiểm trước khi phân quyền: đang nạp / chưa tìm / không có thay đổi. Trả thayDoi() hoặc null. */
    pq.kiem = function (L) {
        if (L.dangNap()) { ui.toast('Đang nạp quyền hiện có, vui lòng chờ nạp xong.', 'warn'); return null; }
        var d = L.thayDoi();
        if (!d.them.length && !d.xoa.length) { ui.toast('Không có thay đổi để phân quyền', 'warn'); return null; }
        return d;
    };

    pq.chay = function (calls, sauLuu) {
        return ui.batch(calls, { title: 'Đang phân quyền', concurrency: 4, okText: 'Phân quyền' }).then(function () {
            if (sauLuu) sauLuu();
        });
    };

    /** btnPhanQuyen… của gốc: hỏi lại "thêm A và hủy quyền B", chạy, nạp lại */
    pq.phanQuyen = function (L, o) {
        var d = pq.kiem(L);
        if (!d) return;
        ui.confirm('Bạn có chắc chắn thêm ' + d.them.length + ' và hủy quyền ' + d.xoa.length + '?', { title: 'Phân quyền', ok: 'Đồng ý' })
            .then(function (yes) {
                if (!yes) return;
                pq.chay(d.them.map(o.them).concat(d.xoa.map(o.xoa)), o.sauLuu);
            });
    };

    /* =====================================================================
       Bộ lọc đào tạo (diem, canbonhaphososinhvien, sinhvientunhap — html gốc giống hệt)
       Hệ · Khoá · CT · Lớp · Năm nhập học · Khoa QL đều multiple="multiple" như gốc;
       gốc gọi edu.system.getList_* (KHÔNG lọc quyền) → giữ đúng các lời gọi đó.
       ===================================================================== */
    pq.daoTaoHtml = function () {
        return pq.sel('he', 'Tất cả hệ đào tạo', true) + pq.sel('khoa', 'Tất cả khóa đào tạo', true) +
            pq.sel('ct', 'Tất cả chương trình đào tạo', true) + pq.sel('lop', 'Tất cả lớp', true) +
            pq.sel('nam', 'Tất cả năm nhập học', true) + pq.sel('kql', 'Tất cả khoa quản lý', true);
    };
    pq.trangThaiHtml = function () {
        return '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div><div data-z="tt"></div>';
    };

    pq.daoTao = function (root, o) {
        o = o || {};
        function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
        function v(k) { return pat.val(f(k)); }
        function loi(t) { return function (err) { ums.api.handle(err, t); }; }
        var P = { pageIndex: 1, pageSize: 1000000 };

        function napKhoa() {
            return ums.ref.khoaDaoTao(pq.gop(P, { strHeDaoTao_Id: v('he'), strCoSoDaoTao_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f('khoa'), d, { name: 'TENKHOA' }); }).catch(loi('khóa đào tạo'));
        }
        function napCT() {
            return ums.ref.chuongTrinh(pq.gop(P, { strKhoaDaoTao_Id: v('khoa'), strN_CN_LOP_Id: '', strKhoaQuanLy_Id: '',
                strToChucCT_Cha_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '' }))
                .then(function (d) { pat.fill(f('ct'), d, { name: 'TENCHUONGTRINH' }); }).catch(loi('chương trình đào tạo'));
        }
        /* edu.system.getList_LopQuanLy của Corei (Corei/systemroot.js) — gửi thêm
           strDaoTao_KhoaQuanLy_Id rỗng, bản ums.ref.lopQuanLy (theo Core) không có */
        function napLop() {
            return ums.api.call({ action: 'KHCT_ThongTin_MH/DSA4BRIKEh4FIC4VIC4eDS4xEDQgLw04', func: 'pkg_kehoach_thongtin.LayDSKS_DaoTao_LopQuanLy',
                silent: true, strDaoTao_CoSoDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
                strDaoTao_KhoaQuanLy_Id: '', strDaoTao_Nganh_Id: '', strDaoTao_LoaiLop_Id: '', strDaoTao_ToChucCT_Id: v('ct'),
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) { pat.fill(f('lop'), arr(r.data), { name: 'TEN' }); }).catch(loi('lớp quản lý'));
        }

        ums.ref.heDaoTao(pq.gop(P, { strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '' }))
            .then(function (d) { pat.fill(f('he'), d, { name: 'TENHEDAOTAO' }); }).catch(loi('hệ đào tạo'));
        ums.api.call({ action: 'KHCT_ThongTin/LayDSNamNhapHoc', method: 'GET', silent: true, strNguoiThucHien_Id: '' })
            .then(function (r) { pat.fill(f('nam'), arr(r.data), { id: 'NAMNHAPHOC', name: 'NAMNHAPHOC' }); }).catch(loi('năm nhập học'));
        ums.ref.khoaQuanLy().then(function (d) { pat.fill(f('kql'), d, { name: 'TEN' }); }).catch(loi('khoa quản lý'));
        var tt = pat.checks(root.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'));

        /* Luật cha → con (CLAUDE.md mục 12): chưa chọn Hệ thì khoá Khoá… Gắn TRƯỚC trình
           xử lý nạp để lúc đọc giá trị các tầng dưới đã được xoá trắng. */
        ums.pat.chain([f('he'), f('khoa'), f('ct'), f('lop')], { phatLai: false });
        var NAP = { he: napKhoa, khoa: napCT, ct: napLop };
        ['he', 'khoa', 'ct', 'lop', 'nam', 'kql'].forEach(function (k) {
            jQuery(f(k)).on('select2:select select2:unselect select2:clear', function () {
                if (NAP[k]) NAP[k]();
                if (o.onDoi) o.onDoi(k);
            });
        });

        return {
            f: f, v: v, tt: tt,
            thamSo: function () {
                return { strKhoaQuanLy_Id: v('kql'), strHeDaoTao_Id: v('he'), strKhoaDaoTao_Id: v('khoa'),
                    strChuongTrinh_Id: v('ct'), strLopQuanLy_Id: v('lop'), strNamNhapHoc: v('nam'),
                    strTrangThaiNguoiHoc_Id: tt.val() };
            }
        };
    };

    /* Cột người dùng (LayDSNguoiDungTheoChucNang): "FULLNAME - NAME" như gốc */
    pq.tenNguoi = function (c) { return e(c.FULLNAME) + ' - ' + e(c.NAME); };
})();
