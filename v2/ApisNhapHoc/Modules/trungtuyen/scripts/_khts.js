/* =========================================================================
   ums.khts — khung CHUNG của hai màn "Kế hoạch … tuyển sinh (new)"
   ---------------------------------------------------------------------------
   Hai bản gốc:
     A. ApisNhapHoc/Modules/trungtuyen/scripts/kehoachtuyensinhnew.js        (2.106 dòng)
        → KẾ HOẠCH NHẬP HỌC mở từ Kế hoạch tuyển sinh + Đợt (PKG_CORE_NHAPHOC)
     B. ApisQuanlyTuyenSinh/Modules/tuyensinh/script/kehoachtuyensinhnew.js  (13.832 dòng)
        → KẾ HOẠCH TUYỂN SINH (PKG_CORE_TS_KEHOACH, PKG_CORE_TS_HOSO…)
   Hai bản CÙNG TÊN, cùng tên lớp (KeHoachTuyenSinhNew), cùng khuôn (thanh lọc +
   bảng kế hoạch + cột "Xem" mở màn con + màn con phân công nhân sự (trong trang) có hộp chọn
   nhân sự lồng) nhưng KHÁC thực thể chính và khác gần hết procedure (diff
   15.375 dòng). Vì vậy tệp này chỉ gom những phần HAI BẢN LÀM GIỐNG NHAU;
   phần riêng của từng bản nằm ở tệp màn của phân hệ đó.

   Dùng chung (bản B gọi y hệt bản A):
     · dsKeHoachTS(dIsActive)   PKG_CORE_TS_KEHOACH.Pr_Ts_KH_TuyenSinh_Get_List
     · dsDotTS(khId, dIsActive) PKG_CORE_TS_KEHOACH.Pr_Ts_Kh_Ts_Dot_Get_Ds
     · donVi()                  NS_CoCauToChuc/LayDanhSach (GET, dTrangThai 1)
     · noiKHDot(elKH, elDot, o) nối tầng Kế hoạch TS → Đợt TS (luật cha → con)
     · phanCong(kh, cfg)        màn con "Phân công / Bố trí nhân sự" theo một kế hoạch (mở trong trang, cfg.host):
                                danh sách + Thêm (chọn NHIỀU nhân sự bằng
                                ums.pat.pickNhanSu, một bộ "thông tin gán chung",
                                MỖI nhân sự MỘT lời gọi) + Xem-sửa / Xoá một dòng.
                                Lời gọi, cột, trường do màn khai (cờ):
                                  A: *_NH_KeHoach_NhanSu (PKG_CORE_NHAPHOC)
                                  B: Pr_Ts_Kh_Ns_PhanCong_* (PKG_CORE_TS_KEHOACH)
     · ngay / ngayGio            đọc ngày YYYYMMDD[HHMMSS] (_fmtDate / _fmtDateTime
                                 của cả hai bản)
     · dmDuPhong(ma, duPhong)    danh mục, rỗng thì dùng danh sách dự phòng viết
                                 cứng như bản gốc
     · vietLai(crud, fn)         nút "Viết lại" trong biểu mẫu ums.crud

   Không dùng chung (khác thật sự giữa A và B):
     · danh sách kế hoạch chính, biểu mẫu kế hoạch chính (tham số khác hẳn);
     · "Kế hoạch đầu ra": A chỉ XEM + Khởi tạo từ tuyển sinh + cờ Yêu cầu xác
       nhận CSĐT (LayDS_NH_KeHoach_DauRa…); B là CRUD đầy đủ (Pr_Ts_Kh_Dau_Ra_*);
     · B có thêm: đợt tuyển sinh, quy định hồ sơ, kết quả đăng ký / import hồ
       sơ, đối tác, tra cứu người học… — không có ở A.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums;
    var ui = ums.ui, pat = ums.pat;
    var K = ums.khts = {};

    /* ---------- Tiện ích ---------------------------------------------------- */
    function e(v) { return v === undefined || v === null ? '' : v; }
    K.e = e;
    /** pick(r, 'MA', 'MA_KEHOACH') — cột đầu tiên có giá trị (bản gốc dò nhiều tên cột) */
    K.pick = function (r) {
        for (var i = 1; i < arguments.length; i++) {
            var v = r ? r[arguments[i]] : undefined;
            if (v !== undefined && v !== null && v !== '') return v;
        }
        return '';
    };
    K.rows = function (r) { var d = r && r.data; return Array.isArray(d) ? d : (d && d.rs) || []; };

    /** _fmtDate: 20260706[102656] → 06/07/2026; "dd/mm/yyyy hh:mm:ss" → phần ngày */
    K.ngay = function (v) {
        var s = String(e(v)).trim();
        if (!s) return '';
        if (/^\d{14}$/.test(s) || /^\d{8}$/.test(s)) return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4);
        var m = s.match(/^(\d{2}\/\d{2}\/\d{4})/);
        return m ? m[1] : s;
    };
    /** _fmtDateTime: 20260706102656 → 06/07/2026 10:26:56 */
    K.ngayGio = function (v) {
        var s = String(e(v)).trim();
        if (!s) return '';
        if (/^\d{14}$/.test(s)) {
            return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4) + ' ' +
                s.substr(8, 2) + ':' + s.substr(10, 2) + ':' + s.substr(12, 2);
        }
        if (/^\d{8}$/.test(s)) return s.substr(6, 2) + '/' + s.substr(4, 2) + '/' + s.substr(0, 4);
        return s;
    };
    /** Cờ 1/0 trong bảng — bản gốc vẽ dấu tích xanh / dấu x đỏ */
    K.co = function (v, toneKhong) {
        return v == 1 ? ui.badge('Có', 'ok') : ui.badge('Không', toneKhong || 'mute');   // eslint-disable-line eqeqeq
    };
    /** "Tên (Mã)" — mergeTenMa của bản gốc */
    K.tenMa = function (ten, ma) {
        ten = e(ten); ma = e(ma);
        if (ten && ma) return ten + ' (' + ma + ')';
        return ten || ma;
    };

    /* ---------- Lời gọi dùng chung ----------------------------------------- */
    var TS = 'TS_Core_KeHoach_MH/', PTS = 'PKG_CORE_TS_KEHOACH.';

    /** Pr_Ts_KH_TuyenSinh_Get_List — combo Kế hoạch tuyển sinh */
    K.dsKeHoachTS = function (dIsActive) {
        return ums.api.call({
            action: TS + 'ETMeFTIeCgkeFTQ4JC8SKC8pHgYkNR4NKDI1',
            func: PTS + 'Pr_Ts_KH_TuyenSinh_Get_List',
            strTuKhoa: '', strLoai_TuyenSinh_Id: '', strTs_PhuongAn_TuyenSinh_Id: '',
            strNam_TuyenSinh: '', strNam_Hoc: '', strHoc_Ky: '', strPlan_Status_Code: '',
            dIs_Active: dIsActive === undefined || dIsActive === '' ? 1 : dIsActive,
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '',
            strHanhDong_Code: 'XEM',
            silent: true
        }).then(K.rows);
    };

    /** Pr_Ts_Kh_Ts_Dot_Get_Ds — combo Đợt tuyển sinh theo kế hoạch.
        o.tatCa (cờ của màn Tuyển sinh): gửi dIs_Active RỖNG = mọi đợt, như bảng "Các đợt tuyển sinh"
        và _ensureDotTuyenSinh của bản gốc B. Không truyền o → hành vi cũ (rỗng quy về 1). */
    K.dsDotTS = function (khId, dIsActive, o) {
        if (!khId) return Promise.resolve([]);
        return ums.api.call({
            action: TS + 'ETMeFTIeCikeFTIeBS41HgYkNR4FMgPP',
            func: PTS + 'Pr_Ts_Kh_Ts_Dot_Get_Ds',
            strTuKhoa: '',
            strTs_KeHoach_TuyenSinh_Id: khId,
            strDot_Status_Code: '',
            dIs_Active: o && o.tatCa ? '' : (dIsActive === undefined || dIsActive === '' ? 1 : dIsActive),
            strNguoiThucHien_Id: '', strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '',
            strHanhDong_Code: 'XEM',
            silent: true
        }).then(K.rows);
    };

    /** NS_CoCauToChuc/LayDanhSach (GET) — ba ô đơn vị; nạp một lần mỗi màn */
    var pDonVi = null;
    K.nguonDonVi = {
        call: { action: 'NS_CoCauToChuc/LayDanhSach', method: 'GET', dTrangThai: 1, strLoaiCoCauToChuc_Id: '', strCoCauToChucCha_Id: '' },
        id: 'ID', name: 'TEN'
    };
    K.donVi = function () {
        if (!pDonVi) pDonVi = ums.crud.loadSource(K.nguonDonVi).catch(function (err) { pDonVi = null; throw err; });
        return pDonVi;
    };

    /** Danh mục (getList_DanhMucDulieu); rỗng → danh sách dự phòng viết cứng của bản gốc */
    K.dmDuPhong = function (ma, duPhong) {
        return ums.api.dm(ma).then(function (rows) {
            return rows && rows.length ? rows : (duPhong || []);
        }, function () { return duPhong || []; });
    };

    /* ---------- Nối tầng Kế hoạch TS → Đợt TS --------------------------------
       Bản gốc: đổi Kế hoạch (change) → xoá Đợt rồi nạp lại. Ở đây theo luật
       cha → con: chưa chọn Kế hoạch thì Đợt KHOÁ; xoá Kế hoạch thì xoá Đợt.
           var nt = K.noiKHDot(elKH, elDot, { hieuLuc: fn → dIs_Active });
           nt.napKH().then(…);   nt.napDot(khId, giáTrịGiữ).then(…);            */
    K.noiKHDot = function (elKH, elDot, o) {
        o = o || {};
        function hl() { return o.hieuLuc ? o.hieuLuc() : 1; }
        var api = {};
        api.napKH = function (giu) {
            return K.dsKeHoachTS(hl()).then(function (rows) {
                pat.fill(elKH, rows, { name: 'TEN' });
                if (giu !== undefined) { elKH.value = giu; if (window.jQuery) jQuery(elKH).trigger('change.select2'); }
                if (ch) ch.sync();
                return rows;
            }).catch(function (err) { ums.api.handle(err, 'kế hoạch tuyển sinh'); return []; });
        };
        api.napDot = function (khId, giu) {
            return K.dsDotTS(khId, hl()).then(function (rows) {
                pat.fill(elDot, rows, { name: 'TEN' });
                elDot.value = giu && rows.some(function (r) { return String(r.ID) === String(giu); }) ? giu : '';
                if (window.jQuery) jQuery(elDot).trigger('change.select2');
                if (ch) ch.sync();
                return rows;
            }).catch(function (err) { ums.api.handle(err, 'đợt tuyển sinh'); return []; });
        };
        if (window.jQuery) {
            jQuery(elKH).on('select2:select', function () { api.napDot(elKH.value); });
        }
        var ch = pat.chain([elKH, elDot]);   // xoá Kế hoạch → phát lại select2:select → napDot('') → Đợt rỗng
        api.sync = function () { ch.sync(); };
        return api;
    };

    /* ---------- Nút "Viết lại" trong biểu mẫu ums.crud (btnRewrite_* của gốc) --- */
    K.vietLai = function (crud, fn) {
        var tools = crud.z('form') && crud.z('form').querySelector('.ums-panel__tools');
        if (!tools || tools.querySelector('[data-khts="vietlai"]')) return;
        var luu = tools.querySelector('[data-c="' + crud.uid + ':save"]');
        var tmp = document.createElement('div');
        tmp.innerHTML = ui.btn('reload', { text: 'Viết lại', mod: 'out-warn', icon: 'fa-rotate-left', attr: { 'data-khts': 'vietlai' } });
        tools.insertBefore(tmp.firstChild, luu);
        tools.querySelector('[data-khts="vietlai"]').addEventListener('click', function () { fn(crud); });
    };

    /* =======================================================================
       Màn con PHÂN CÔNG NHÂN SỰ theo một kế hoạch — mở NGAY TRONG TRANG, thay chỗ vùng cfg.host
       (ums.pat.formTrang — BO-CUC luật 1; trước 30/9 là hộp thoại lớn). Dùng chung: Nhập học
       trungtuyen/kehoachtuyensinhnew và Tuyển sinh tuyensinh/_khtsn_phancong.js.
       -----------------------------------------------------------------------
       ums.khts.phanCong(kh, {
           host,                                    vùng bị thay chỗ (gốc màn) — BẮT BUỘC
           title, icon, tieuDe(kh),                 đầu khung / đầu danh sách
           addText, formTitle,
           list(kh) → call,                         danh sách phân công
           columns,                                  cột ums.crud
           onLoad(rows, crud),                       (tuỳ chọn) bù cột thiếu rồi crud.draw()
           fields,                                   trường biểu mẫu (dùng chung Thêm / Sửa)
           chiSua: ['khoá'…],                        trường CHỈ hiện khi Xem-sửa
           them(ns, v, kh) → call,                   MỖI nhân sự đã tick MỘT lời gọi
           sua(v, row, kh) → call, xoa(row, kh) → call,
           detail(row, kh) → call,                   (tuỳ chọn, bản B) lấy chi tiết trước khi Xem-sửa
                                                     (Pr_Ts_Kh_Ns_PhanCong_Get_By_Id); không khai = dùng dòng danh sách
           xoaHoi,                                   chữ hỏi lại khi xoá
           chon: { title, okText, loaiCanBo }        hộp chọn nhân sự (ums.pat.pickNhanSu)
       })
       Bảng "Nhân sự đã chọn" (chỉ ở Thêm): tick / bỏ tick, xoá dòng, phân trang
       ở máy (10/20/50/100 như gốc); ô "chọn tất cả" áp cho MỌI trang như gốc.
       Lưu đọc từ danh sách trong bộ nhớ (không đọc DOM) — không mất dòng ở trang khác.
       ======================================================================= */
    K.phanCong = function (kh, cfg) {
        var ft = pat.formTrang({
            host: cfg.host,
            title: cfg.title || 'Bố trí nhân sự', icon: cfg.icon || 'fa-users-gear', cols: 1,
            body: '<div data-khts="pc"></div>'
        });
        var host = ft.body.querySelector('[data-khts="pc"]');
        var daChon = [], trang = 1, coTrang = 20;
        var khoi = null;

        var crud = ums.crud({
            root: host,
            embedded: true,
            title: cfg.tieuDe ? cfg.tieuDe(kh) : (cfg.title || 'Bố trí nhân sự'),
            icon: cfg.icon || 'fa-users-gear',
            formTitle: cfg.formTitle || 'phân công nhân sự',
            addText: cfg.addText || 'Thêm mới nhân sự',
            empty: 'Không có dữ liệu',
            list: { call: function () { return cfg.list(kh); } },
            detail: cfg.detail ? function (row) { return cfg.detail(row, kh); } : undefined,
            columns: cfg.columns,
            onLoad: cfg.onLoad,
            fields: cfg.fields,
            save: function (v, row, c) {
                if (row) return cfg.sua(v, row, kh);
                var ds = daChon.filter(function (x) { return x._checked !== false; });
                if (!ds.length) { ui.toast('Vui lòng tích chọn ít nhất một nhân sự để lưu', 'warn'); return null; }
                ui.batch(ds.map(function (ns) {
                    return function () {
                        return ums.api.call(cfg.them(ns, v, kh)).catch(function (err) {
                            throw new Error((ns.HOTEN || ns.ID) + ': ' + (err && err.message ? err.message : 'lỗi'));
                        });
                    };
                }), { title: 'Đang lưu phân công nhân sự', okText: 'Đã lưu nhân sự', show: true }).then(function (r) {
                    if (r.ok) { c.showList(); c.load(); }
                });
                return null;
            },
            remove: function (ids, rows) { return cfg.xoa(rows[0], kh); },
            rowDelete: false,
            multi: false,
            removeConfirm: function () { return cfg.xoaHoi || 'Bạn có chắc chắn muốn xóa phân công nhân sự này?'; },
            onForm: function (row, c) {
                var grid = c.z('form').querySelector('.ums-grid');
                if (!khoi) {
                    khoi = document.createElement('div');
                    khoi.style.gridColumn = '1 / -1';
                    khoi.innerHTML =
                        '<div class="ums-row ums-row--between">' +
                            '<div class="ums-legend ums-u-mb-0">Nhân sự <span class="ums-u-faint ums-u-fz13" data-khts="dem"></span></div>' +
                            ui.btn('add', { text: 'Chọn nhân sự', mod: 'out-success', icon: 'fa-user-check', cls: 'ums-btn--sm', attr: { 'data-khts': 'chon' } }) +
                        '</div>' +
                        '<div class="ums-u-mt-2" data-khts="bang"></div>';
                    grid.insertBefore(khoi, grid.firstChild);
                    khoi.addEventListener('click', onKhoi);
                    khoi.addEventListener('change', onKhoiDoi);
                    K.vietLai(c, function (cc) {
                        cc.fillForm(cc.editing);
                        if (!cc.editing) { daChon = []; trang = 1; veDaChon(); }
                    });
                }
                khoi.hidden = !!row;
                (cfg.chiSua || []).forEach(function (k) {
                    var el = c.z('form').querySelector('[data-k="' + k + '"]');
                    var o = el && el.closest('.ums-field');
                    var w = o && o.parentNode && o.parentNode.parentNode === grid ? o.parentNode : o;
                    if (w) w.hidden = !row;
                });
                if (!row) { daChon = []; trang = 1; veDaChon(); }
            }
        });

        function veDaChon() {
            var bang = khoi.querySelector('[data-khts="bang"]');
            var tong = daChon.length;
            var tick = daChon.filter(function (x) { return x._checked !== false; }).length;
            khoi.querySelector('[data-khts="dem"]').textContent = '(' + (tong ? tick + '/' + tong + ' đã tick' : '0') + ')';
            var soTrang = Math.max(1, Math.ceil(tong / coTrang));
            if (trang > soTrang) trang = soTrang;
            var tu = (trang - 1) * coTrang;
            var tatCa = tong > 0 && tick === tong;
            ui.table({
                el: bang,
                rows: daChon.slice(tu, tu + coTrang),
                empty: 'Chưa chọn nhân sự — bấm "Chọn nhân sự"',
                columns: [
                    { title: 'Thông tin nhân sự đã chọn', render: function (r) { return ui.esc(K.tenMa(r.HOTEN, r.MASO)); } },
                    { title: 'Đơn vị', prop: 'DONVI_TEN' },
                    { head: '<input type="checkbox" data-khts="tatca" title="Chọn tất cả"' + (tatCa ? ' checked' : '') + '>',
                      cls: 'is-center', width: '60px',
                      render: function (r) { return '<input type="checkbox" data-khts="tick" data-id="' + ui.esc(r.ID) + '"' + (r._checked !== false ? ' checked' : '') + '>'; } },
                    { title: 'Xóa', cls: 'is-actions', width: '60px',
                      render: function (r) {
                          return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-khts="bo" data-id="' + ui.esc(r.ID) + '" title="Xoá khỏi danh sách"><i class="fa-light fa-trash-can"></i></button>';
                      } }
                ],
                page: !tong ? null : {
                    index: trang, size: coTrang, total: tong, sizes: [10, 20, 50, 100],
                    onChange: function (p) { if (p >= 1 && p <= soTrang) { trang = p; veDaChon(); } },
                    onSize: function (v) { coTrang = v; trang = 1; veDaChon(); }
                }
            });
            var all = bang.querySelector('[data-khts="tatca"]');
            if (all) all.indeterminate = tick > 0 && tick < tong;
        }

        function onKhoi(ev) {
            var b = ev.target.closest('[data-khts]');
            if (!b) return;
            var k = b.getAttribute('data-khts');
            if (k === 'chon') {
                var ch = cfg.chon || {};
                pat.pickNhanSu({
                    title: ch.title || 'Chọn nhân sự', okText: ch.okText || 'Xác nhận đã chọn',
                    loaiCanBo: ch.loaiCanBo !== undefined ? ch.loaiCanBo : '0',
                    onPick: function (list) {
                        var co = {}, them = 0;
                        daChon.forEach(function (x) { co[x.ID] = true; });
                        list.forEach(function (ns) {
                            if (!ns || !ns.ID || co[ns.ID]) return;
                            co[ns.ID] = true;
                            daChon.push({
                                ID: ns.ID, HOTEN: ns.HOTEN || '', MASO: ns.MASO || '',
                                DONVI_ID: ns.DAOTAO_COCAUTOCHUC_ID || ns.DONVI_ID || '',
                                DONVI_TEN: ns.DAOTAO_COCAUTOCHUC_TEN || ns.DONVI_TEN || '',
                                _checked: true
                            });
                            them++;
                        });
                        veDaChon();
                        if (them) ui.toast('Đã thêm ' + them + ' nhân sự vào danh sách', 'ok');
                        else ui.toast('Các nhân sự đã chọn đều có trong danh sách', 'info');
                    }
                });
            } else if (k === 'bo') {
                var id = b.getAttribute('data-id');
                daChon = daChon.filter(function (x) { return String(x.ID) !== id; });
                veDaChon();
            }
        }
        function onKhoiDoi(ev) {
            var t = ev.target;
            if (!t.matches) return;
            if (t.matches('[data-khts="tatca"]')) {
                daChon.forEach(function (x) { x._checked = t.checked; });
                veDaChon();
            } else if (t.matches('[data-khts="tick"]')) {
                var id = t.getAttribute('data-id');
                daChon.forEach(function (x) { if (String(x.ID) === id) x._checked = t.checked; });
                veDaChon();
            }
        }

        return { form: ft, crud: crud };
    };
})();
