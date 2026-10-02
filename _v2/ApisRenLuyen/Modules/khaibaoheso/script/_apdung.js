/* =========================================================================
   ums.rlApDung — khung chung của họ màn "ÁP DỤNG" (Điểm rèn luyện)
   ---------------------------------------------------------------------------
   Dùng ở:
       tieuchidiem/tieuchidiemapdung       Tiêu chí điểm áp dụng
       tieuchixeploai/tieuchixeploaiapdung Tiêu chuẩn xếp loại áp dụng
       khaibaoheso/hesoapdung              Hệ số áp dụng (học kỳ / năm học)
   Cả ba bản gốc chép cùng một khuôn: đem một khai báo CHUNG (tiêu chí, tiêu
   chuẩn, trọng số) áp cho một PHẠM VI = Khoá đào tạo (strPhamViApDung_Id) ×
   thời gian (strDaoTao_ThoiGianDaoTao_Id — học kỳ nếu chọn, không thì năm học)
   × đối tượng áp dụng (danh mục DRL.DOITUONGAPDUNG). Hai màn tiêu chí có thêm
   "Kế thừa" (chép khai báo chung sang phạm vi) và "Xóa toàn bộ" của phạm vi.
   Cùng họ với ApisXuLyHocVu/Modules/dieukienxuly/dieukienapdung (XLHV_…_AD).

   Không dùng ums.pat.phamVi: khung đó là BẢNG nhiều phạm vi (chọn SV / khoá /
   CT / lớp) lưu SAU bản ghi cha; ở đây phạm vi là bốn ô NGAY TRÊN bản ghi.

   Nguồn ô chọn (chép bản gốc):
       CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc  GET (pageSize 10000)   → NAMHOC
       edu.system.getList_ThoiGianDaoTao → ums.ref.thoiGianDaoTao    → DAOTAO_THOIGIANDAOTAO
       edu.system.getList_HeDaoTao / KhoaDaoTao → ums.ref.*          → TENHEDAOTAO / TENKHOA
       danh mục DRL.DOITUONGAPDUNG

   API
       A.thoiGian(nam, tg)            → tg || nam (đúng biểu thức gốc)
       A.locDefs(them)                → ô lọc crud: dt, nam, tg, he, khoa (+ them)
       A.boLoc(getEl, { dt, onDoi })  → { v(k), text(k), ready } — đổ ô lọc, He → Khoá
                                         nối tầng (ums.ref.cascade — bản gốc gọi
                                         getList_KhoaDaoTao KHÔNG lọc quyền)
       A.crudEl(crud, scope)          → getEl(k) cho ô lọc / ô biểu mẫu của ums.crud
       A.pvFields({ tg })             → trường biểu mẫu: _nam, _tg, _he, strPhamViApDung_Id
       A.phamViForm(getEl, keys)      → { ready, set({ nam, tg, he, khoa }) → Promise, sync }
       A.giaTriPV(row, loc)           → phạm vi của dòng đang sửa (cột *_AD) hoặc của ô lọc
       A.toanBo(o)                    → hai nút "Kế thừa" / "Xóa toàn bộ" (toolbar crud)
       A.dat(el, v) · A.dong(els)     → đặt giá trị / khoá ô (select2 vẽ lại)
       A.themMuc(el, id, ten)         → thêm mục đang dùng nếu danh sách "chưa dùng" không có
       A.cay(rows, { id, cha })       → xếp dòng theo cây (cha trước con), gắn _cap / _con
       A.cotCay(o)                    → cột ums.ui.table vẽ tên thụt theo cấp
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, esc = ui.esc;
    var A = ums.rlApDung = {};

    function e(v) { return v === undefined || v === null ? '' : String(v); }

    A.thoiGian = function (nam, tg) { return tg ? tg : (nam || ''); };

    /* ---------- Nguồn danh mục (nạp một lần cho cả trang) ------------------ */
    var cache = {};
    function mot(k, f) {
        if (!cache[k]) cache[k] = f().catch(function (err) { delete cache[k]; throw err; });
        return cache[k];
    }
    A.namHoc = function () {
        return mot('nam', function () {
            return ums.api.call({
                action: 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc', method: 'GET', silent: true,
                strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000
            }).then(function (r) { return Array.isArray(r.data) ? r.data : []; });
        });
    };
    A.thoiGianDT = function () {
        return mot('tg', function () {
            return ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 });
        });
    };
    A.heDaoTao = function () {
        return mot('he', function () {
            return ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 });
        });
    };
    A.khoaDaoTao = function (he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he || '', strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 });
    };
    A.doiTuong = function () { return ums.api.dm('DRL.DOITUONGAPDUNG'); };

    var NHAN = {
        dt: 'Chọn đối tượng', nam: 'Chọn năm học', tg: 'Chọn thời gian đào tạo',
        he: 'Chọn hệ đào tạo', khoa: 'Chọn khóa đào tạo'
    };
    A.NHAN = NHAN;
    var TEN = { nam: 'NAMHOC', tg: 'DAOTAO_THOIGIANDAOTAO', he: 'TENHEDAOTAO', khoa: 'TENKHOA', dt: 'TEN' };

    A.dat = function (el, v) {
        if (!el) return;
        el.value = e(v);
        if (el.tagName === 'SELECT' && el.value !== e(v)) el.value = '';
        if (window.jQuery) jQuery(el).trigger('change.select2');
    };
    A.dong = function (els) {
        (els || []).forEach(function (el) {
            if (!el) return;
            el.disabled = true;
            if (window.jQuery) jQuery(el).trigger('change.select2');
        });
    };
    /** Ô "chưa dùng" không còn mục đang áp dụng → thêm vào để sửa không gửi rỗng */
    A.themMuc = function (el, id, ten) {
        if (!el || !id) return;
        var co = Array.prototype.some.call(el.options, function (o) { return o.value === String(id); });
        if (co) return;
        var o = document.createElement('option');
        o.value = id;
        o.textContent = ten || 'Đang áp dụng';
        el.appendChild(o);
    };

    /* ---------- Thanh lọc -------------------------------------------------- */
    A.locDefs = function (them) {
        return [
            { key: 'dt', type: 'select', label: NHAN.dt },
            { key: 'nam', type: 'select', label: NHAN.nam },
            { key: 'tg', type: 'select', label: NHAN.tg },
            { key: 'he', type: 'select', label: NHAN.he },
            { key: 'khoa', type: 'select', label: NHAN.khoa }
        ].concat(them || []);
    };

    A.crudEl = function (crud, scope) {
        return function (k) { return crud.root.querySelector('[data-cf="' + crud.uid + '"][data-scope="' + scope + '"][data-k="' + k + '"]'); };
    };

    /** Đổ ô lọc. getEl(k) → phần tử (dt, nam, tg, he, khoa). */
    A.boLoc = function (getEl, o) {
        o = o || {};
        var jobs = [];
        function fill(k, p) {
            var el = getEl(k);
            if (!el) return;
            jobs.push(p.then(function (rows) { ums.pat.fill(el, rows, { name: TEN[k], head: NHAN[k] }); })
                .catch(function (err) { ums.api.handle(err, NHAN[k].toLowerCase()); }));
        }
        fill('dt', A.doiTuong());
        fill('nam', A.namHoc());
        fill('tg', A.thoiGianDT());
        if (getEl('he') && getEl('khoa')) {
            // Hệ → Khoá: chưa chọn hệ thì khoá ô khoá; đổi / xoá hệ thì xoá trắng khoá
            jobs.push(ums.ref.cascade({
                he: getEl('he'), khoa: getEl('khoa'),
                labels: { he: NHAN.he, khoa: NHAN.khoa },
                onChange: o.onDoi
            }).ready);
        }
        function v(k) { var el = getEl(k); return el ? (el.value || '').trim() : ''; }
        function text(k) {
            var el = getEl(k);
            if (!el || !el.value || el.selectedIndex < 0) return '';
            return (el.options[el.selectedIndex].textContent || '').trim();
        }
        return { v: v, text: text, el: getEl, ready: Promise.all(jobs) };
    };

    /* ---------- Phạm vi trong biểu mẫu ------------------------------------ */
    A.pvFields = function (o) {
        o = o || {};
        var f = [{ key: '_nam', label: 'Năm học', type: 'select', placeholder: NHAN.nam, readonlyEdit: o.khoaKhiSua }];
        if (o.tg !== false) f.push({ key: '_tg', label: 'Thời gian đào tạo', type: 'select', placeholder: NHAN.tg, readonlyEdit: o.khoaKhiSua });
        f.push({ key: '_he', label: 'Hệ đào tạo', type: 'select', placeholder: NHAN.he, readonlyEdit: o.khoaKhiSua });
        f.push({ key: 'strPhamViApDung_Id', label: 'Khóa đào tạo', type: 'select', placeholder: NHAN.khoa, readonlyEdit: o.khoaKhiSua });
        return f;
    };

    /**
     * Bốn ô phạm vi của biểu mẫu: Năm học, Thời gian đào tạo, Hệ → Khoá.
     * Hệ của biểu mẫu nối tầng với Khoá (chưa chọn hệ thì khoá ô khoá). Dòng đang
     * sửa không có cột hệ (bản gốc đặt hệ = "") → nạp mọi khoá để hiện đúng tên
     * khoá đã lưu; ô khoá bị khoá tới khi chọn lại hệ.
     */
    A.phamViForm = function (getEl, keys) {
        keys = keys || { nam: '_nam', tg: '_tg', he: '_he', khoa: 'strPhamViApDung_Id' };
        var el = { nam: getEl(keys.nam), tg: getEl(keys.tg), he: getEl(keys.he), khoa: getEl(keys.khoa) };
        var dem = 0;

        function napKhoa(he) {
            var lan = ++dem;
            return A.khoaDaoTao(he).then(function (rows) {
                if (lan !== dem) return;
                ums.pat.fill(el.khoa, rows, { name: 'TENKHOA', head: NHAN.khoa });
            });
        }

        var jobs = [];
        if (el.nam) jobs.push(A.namHoc().then(function (r) { ums.pat.fill(el.nam, r, { name: 'NAMHOC', head: NHAN.nam }); }));
        if (el.tg) jobs.push(A.thoiGianDT().then(function (r) { ums.pat.fill(el.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO', head: NHAN.tg }); }));
        if (el.he) jobs.push(A.heDaoTao().then(function (r) { ums.pat.fill(el.he, r, { name: 'TENHEDAOTAO', head: NHAN.he }); }));
        var ready = Promise.all(jobs).catch(function (err) { ums.api.handle(err, 'phạm vi áp dụng'); });

        var chain = { sync: function () {} };
        if (el.he && el.khoa) {
            jQuery(el.he).on('select2:select select2:clear', function () {
                A.dat(el.khoa, '');
                napKhoa(el.he.value).catch(function (err) { ums.api.handle(err, 'khóa đào tạo'); });
            });
            chain = ums.pat.chain([el.he, el.khoa], { phatLai: false });
        }

        function set(v) {
            v = v || {};
            return ready.then(function () {
                A.dat(el.nam, v.nam);
                A.dat(el.tg, v.tg);
                // Máy chủ chỉ trả MỘT id thời gian (năm học HOẶC học kỳ) → tìm xem nó nằm ở ô nào
                if (v.tgId && !(el.nam && el.nam.value) && !(el.tg && el.tg.value)) {
                    A.dat(el.tg, v.tgId);
                    if (!(el.tg && el.tg.value)) A.dat(el.nam, v.tgId);
                }
                A.dat(el.he, v.he);
                return el.khoa ? napKhoa(v.he || '') : null;
            }).then(function () {
                A.dat(el.khoa, v.khoa);
                chain.sync();
            }).catch(function (err) { ums.api.handle(err, 'phạm vi áp dụng'); });
        }
        return { ready: ready, set: set, sync: function () { chain.sync(); }, el: el };
    };

    /** Phạm vi đặt sẵn cho biểu mẫu: dòng đang sửa (cột *_AD) hoặc ô lọc hiện tại */
    /* Kiểm host 2026-09-30: danh sách *_AD KHÔNG trả DAOTAO_THOIGIANDAOTAO_NAM_ID / _KY_ID (bản gốc đọc hai cột này nên
       khi Sửa ô thời gian giữ giá trị lần mở trước) mà chỉ trả DAOTAO_THOIGIANDAOTAO_ID — id năm học hoặc học kỳ. Thiếu thời
       gian thì CapNhat bị từ chối "Du lieu khong duoc de trang". Nay: lấy id đó (tgId — phamViForm.set tự tìm ô chứa nó);
       dòng không mang thời gian nào thì theo ô lọc. Hệ không có trong dòng → lấy của ô lọc khi cùng khoá. */
    A.giaTriPV = function (row, loc) {
        var cu = { he: loc.v('he'), khoa: loc.v('khoa'), nam: loc.v('nam'), tg: loc.v('tg') };
        if (!row || !e(row.PHAMVIAPDUNG_ID)) return cu;
        var nam = e(row.DAOTAO_THOIGIANDAOTAO_NAM_ID), tg = e(row.DAOTAO_THOIGIANDAOTAO_KY_ID), id = e(row.DAOTAO_THOIGIANDAOTAO_ID);
        var pv = { he: row.PHAMVIAPDUNG_ID === cu.khoa ? cu.he : '', khoa: row.PHAMVIAPDUNG_ID, nam: nam, tg: tg, tgId: id };
        if (!nam && !tg && !id) { pv.nam = cu.nam; pv.tg = cu.tg; }
        return pv;
    };

    /* ---------- "Kế thừa" · "Xóa toàn bộ" ---------------------------------- */
    /**
     * o = { loc() → bộ lọc (A.boLoc), keThua: 'X_AD/KeThua', xoa: 'X_AD/Xoa_…_PV', sauKhi(crud) }
     * Tham số chép bản gốc: strChucNang_Id, strDoiTuongApDung_Id, strPhamViApDung_Id,
     * strDaoTao_ThoiGianDaoTao_Id (học kỳ, không có thì năm học), strNguoiThucHien_Id.
     */
    A.toanBo = function (o) {
        function kiem(loc) {
            if (!loc.v('khoa')) { ui.toast('Bạn cần chọn khóa', 'warn'); return false; }
            if (!loc.v('nam') && !loc.v('tg')) { ui.toast('Bạn cần chọn năm học hoặc thời gian đào tạo', 'warn'); return false; }
            return true;
        }
        function moTa(loc) {
            return loc.text('khoa') + ' và ' + (loc.v('nam') ? 'năm học ' + loc.text('nam') : 'học kỳ ' + loc.text('tg'));
        }
        function thamSo(loc, action) {
            return {
                action: action,
                strChucNang_Id: '',
                strDoiTuongApDung_Id: loc.v('dt'),
                strPhamViApDung_Id: loc.v('khoa'),
                strDaoTao_ThoiGianDaoTao_Id: A.thoiGian(loc.v('nam'), loc.v('tg')),
                strNguoiThucHien_Id: ''
            };
        }
        function chay(crud, action, hoi, xong, opt) {
            var loc = o.loc();
            if (!kiem(loc)) return;
            ui.confirm(hoi + moTa(loc), opt).then(function (yes) {
                if (!yes) return;
                return ums.api.call(thamSo(loc, action)).then(function () {
                    ui.toast(xong, 'ok');
                    if (o.sauKhi) o.sauKhi(crud); else crud.load(1);
                });
            }).catch(function (err) { ums.api.handle(err, hoi); });
        }
        return [
            { text: 'Kế thừa', icon: 'fa-object-ungroup',
                onClick: function (crud) {
                    chay(crud, o.keThua, 'Bạn có muốn kế thừa từ khóa: ', 'Kế thừa thành công',
                        { ok: 'Kế thừa', title: 'Kế thừa khai báo chung' });
                } },
            { text: 'Xóa toàn bộ', icon: 'fa-trash-can', mod: 'out-danger',
                onClick: function (crud) {
                    chay(crud, o.xoa, 'Bạn có muốn xóa toàn bộ tiêu chí của khóa: ', 'Xóa dữ liệu thành công!',
                        { tone: 'bad', ok: 'Xóa toàn bộ', title: 'Xóa toàn bộ khai báo áp dụng' });
                } }
        ];
    };

    /* ---------- Cây (tiêu chí cha → con) ----------------------------------- */
    /**
     * Xếp dòng theo cây, giữ thứ tự máy chủ trả trong từng nhánh. Gốc = dòng không
     * có cha, hoặc cha không nằm trong danh sách (bản gốc bỏ mất dòng mồ côi).
     */
    A.cay = function (rows, o) {
        o = o || {};
        var idK = o.id || 'ID', chaK = o.cha || 'DRL_TIEUCHIDANHGIA_CHA_ID', gocK = o.goc || 'DRL_TIEUCHIDANHGIA_ID';
        var co = {}, con = {}, theoGoc = {};
        rows.forEach(function (r) { co[r[idK]] = true; if (r[gocK]) theoGoc[r[gocK]] = r[idK]; });
        rows.forEach(function (r) {
            /* Kiểm host 2026-09-30: cột cha của dòng áp dụng mang id tiêu chí CHUNG của dòng cha (Kế thừa ghi vậy, màn Nhập điểm
               cũng tra con theo id chung) chứ không phải id dòng áp dụng → dò theo cả hai. */
            var c = r[chaK];
            if (c && !co[c] && theoGoc[c]) c = theoGoc[c];
            var k = c && co[c] && c !== r[idK] ? c : '';
            (con[k] = con[k] || []).push(r);
        });
        var ra = [], da = {};
        function di(k, cap) {
            (con[k] || []).forEach(function (r) {
                if (da[r[idK]]) return;          // chống vòng lặp dữ liệu hỏng
                da[r[idK]] = true;
                r._cap = cap;
                r._con = !!(con[r[idK]] || []).length;
                ra.push(r);
                di(r[idK], cap + 1);
            });
        }
        di('', 0);
        return ra;
    };

    /** Cột tên thụt lề theo cấp; mục có con in đậm */
    A.cotCay = function (o) {
        o = o || {};
        return {
            title: o.title || 'Tên tiêu chí',
            render: function (r) {
                var t = esc(e(r[o.prop || 'TEN']));
                return '<span style="display:inline-block;padding-left:' + ((r._cap || 0) * 22) + 'px">' +
                    (r._con ? '<b>' + t + '</b>' : t) + '</span>';
            }
        };
    };
})();
