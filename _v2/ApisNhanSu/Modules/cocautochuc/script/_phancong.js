/* =========================================================================
   ApisNhanSu / cocautochuc — phần chung của "Phân công lao động" và "Quan hệ lao động" (ums.nsPhanCong)
   Hai tệp gốc (phanconglaodong.js, quanhelaodong.js) chép nhau: danh sách người (Get_Person_*), chuẩn hoá
   dòng quan hệ lao động (normalizeEmploymentRows, buildQuanHeFromPersonList, enrichEmploymentRowsFromDetails) và TOÀN BỘ
   khối "Phân công nhiệm vụ" (bảng + biểu mẫu #modalAddNhiemVu).
   ---------------------------------------------------------------------------
       var P = ums.nsPhanCong;
       P.vaiTroId() · P.chucNangId()              strVaiTro_Id / strChucNang_Id của gốc (getVaiTroId = appId = vai trò)
       P.nguoi(func, action, tuKhoa) → Promise<dòng>   Get_Person_Chua_Co_Employment | _Co_Employment | _Da_Nghi_Viec
       P.chuanHoa(rows, { loai, trangThai, donVi })     điền tên loại / trạng thái / đơn vị thiếu (normalize*)
       P.cotNguoi(them)                                  cột bảng người (Mã số … Trạng thái quan hệ lao động)
       P.quanHe(person) → Promise<dòng QHLĐ>             Get_Core_Employment (+ dự phòng dựng từ dòng người như gốc)
       P.dm() → Promise<{ loai, trangThai, loaiPC, trangThaiPC }>   các danh mục dùng chung
       P.nhiemVu(cfg) → khối phân công nhiệm vụ (xem dưới)

   Lời gọi (NS_HoSoNhanSu4_MH · PKG_CORE_HOSONHANSU_04 — chép nguyên, strChucNang_Id / strVaiTro_Id gửi tường minh):
     Get_Core_Employment         strChucNang_Id, strVaiTro_Id, strNguoiThucHien_Id, strPerson_Id
     Get_Core_Employment_By_Id   strChucNang_Id, strVaiTro_Id, strNguoiThucHien_Id, strId
     Get_Core_Assignment         strChucNang_Id, strVaiTro_Id, strNguoiThucHien_Id, strPerson_Id, strEmployment_Id
                                 → bỏ dòng IS_ACTIVE = 0 (như gốc)
     Get_Core_Assignment_By_Id   strChucNang_Id, strVaiTro_Id, strId, strNguoiThucHien_Id
     Ins_Core_Assignment | Upd_Core_Assignment (có strId)
                                 strId, strChucNang_Id, strVaiTro_Id, strPerson_Id, strEmployment_Id,
                                 strAssignment_Type_Code, strAssignment_Status_Code, strOrg_Id, strPosition_Id,
                                 dIs_Primary (ô Chính thức), dFte_Ratio 1, strEffective_From, strEffective_To,
                                 strDecision_Id '', strSource_Event_Id '', strNote, dIs_Active 1, strNguoiThucHien_Id
     Del_Core_Assignment         strId (mỗi dòng một lời gọi), strChucNang_Id, strVaiTro_Id, strNguoiThucHien_Id
   Kiểm trước khi lưu phân công (như gốc, đúng thứ tự): đã chọn QHLĐ, Vị trí, Loại phân công, Ngày bắt đầu, Đơn vị.
   Ô cha → con: Đơn vị phân công → Vị trí (ums.pat.chain) — gốc nạp lại vị trí khi đổi đơn vị.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.nsCoCau;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    var H4 = 'NS_HoSoNhanSu4_MH/', P4 = 'PKG_CORE_HOSONHANSU_04.';

    var P = ums.nsPhanCong = {};
    P.vaiTroId = function () { return (ums.state && ums.state.roleId) || (ums.session && ums.session.appId) || ''; };
    P.chucNangId = function () { return (ums.state && ums.state.chucNangId) || ''; };
    function heThong(o) {
        o.strChucNang_Id = P.chucNangId();
        o.strVaiTro_Id = P.vaiTroId();
        o.strNguoiThucHien_Id = '';
        return o;
    }
    P.goi = function (ma, ham, them) {
        var o = heThong({ action: H4 + ma, func: P4 + ham });
        Object.keys(them || {}).forEach(function (k) { o[k] = them[k]; });
        return o;
    };

    /* ---------- Danh mục dùng chung (một lần tải) ---------- */
    var dmP = null;
    P.dm = function () {
        if (dmP) return dmP;
        function m(ma) { return ums.api.dm(ma).catch(function (err) { ums.api.handle(err, ma); return []; }); }
        dmP = Promise.all([m('CORE.QUANHELAODONG.LOAI'), m('CORE.QUANHELAODONG.TRANGTHAI'),
            m('CORE_ASSIGNMENT.ASSIGNMENT_TYPE_CODE'), m('CORE_ASSIGNMENT.ASSIGNMENT_STATUS_CODE')]).then(function (x) {
            return { loai: x[0], trangThai: x[1], loaiPC: x[2], trangThaiPC: x[3] };
        });
        return dmP;
    };
    function tenTheo(rows, v) { if (v === '' || v === null || v === undefined) return ''; var r = (rows || []).filter(function (x) { return String(x.ID) === String(v); })[0]; return r ? e(r.TEN) : ''; }

    /* computeEffectiveStatusName của gốc */
    function ngay(s) {
        var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(e(s).trim());
        return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
    }
    P.trangThaiTheoNgay = function (tu, den) {
        var a = ngay(tu), b = ngay(den), h = new Date(); h.setHours(0, 0, 0, 0);
        if (a && a.getTime() > h.getTime()) return 'Chưa hiệu lực';
        if (b && b.getTime() < h.getTime()) return 'Hết hiệu lực';
        if (a || b) return 'Còn hiệu lực';
        return '';
    };

    /* normalizeEmploymentRows / normalizePersonListRows — điền tên còn thiếu từ danh mục / đơn vị */
    P.chuanHoa = function (rows, o) {
        o = o || {};
        var dv = o.donVi || [];
        function tenDv(id) { var x = dv.filter(function (r) { return r.ID === id; })[0]; return x ? e(x.NAME) : ''; }
        return (rows || []).map(function (r) {
            if (!r) return r;
            if (!r.LEGAL_ENTITY_NAME && r.LEGAL_ENTITY_ID) r.LEGAL_ENTITY_NAME = tenDv(r.LEGAL_ENTITY_ID);
            if (o.nguoi && !r.ORG_NAME && (r.ORG_ID || r.ORG_UNIT_ID)) r.ORG_NAME = tenDv(r.ORG_ID || r.ORG_UNIT_ID);
            if (!r.EMPLOYMENT_STATUS_CODE_NAME && r.EMPLOYMENT_STATUS_CODE) r.EMPLOYMENT_STATUS_CODE_NAME = tenTheo(o.trangThai, r.EMPLOYMENT_STATUS_CODE);
            if (o.theoNgay && !r.EMPLOYMENT_STATUS_CODE_NAME) {
                var t = P.trangThaiTheoNgay(r.EMPLOYMENT_EFFECTIVE_FROM || r.EFFECTIVE_FROM, r.EMPLOYMENT_EFFECTIVE_TO || r.EFFECTIVE_TO);
                if (t) r.EMPLOYMENT_STATUS_CODE_NAME = t;
            }
            if (!r.EMPLOYMENT_TYPE_CODE_NAME && r.EMPLOYMENT_TYPE_CODE) r.EMPLOYMENT_TYPE_CODE_NAME = tenTheo(o.loai, r.EMPLOYMENT_TYPE_CODE);
            return r;
        });
    };

    /* Get_Person_* — strKeyword, dIs_Active 1 */
    P.nguoi = function (ma, ham, tuKhoa) {
        return ums.api.call({ action: H4 + ma, func: P4 + ham, strKeyword: e(tuKhoa), dIs_Active: 1, strNguoiThucHien_Id: '' }).then(C.rows);
    };
    P.coQuanHe = function (x) {
        if (!x) return false;
        if (!(x.CORE_EMPLOYMENT_ID || x.EMPLOYMENT_ID || x.EMPLOYMENT_Id)) return false;
        var a = x.EMPLOYMENT_IS_ACTIVE !== null && x.EMPLOYMENT_IS_ACTIVE !== undefined ? x.EMPLOYMENT_IS_ACTIVE : x.IS_ACTIVE;
        return !(a === 0 || a === '0');
    };

    P.ngaySinh = function (r) {
        if (r.DATE_OF_BIRTH) return e(r.DATE_OF_BIRTH);
        if (r.BIRTH_DAY && r.BIRTH_MONTH && r.BIRTH_YEAR) return r.BIRTH_DAY + '/' + r.BIRTH_MONTH + '/' + r.BIRTH_YEAR;
        return '';
    };
    P.cotNguoi = function (them) {
        return [
            { title: 'Mã số', prop: 'CURRENT_EMPLOYEE_CODE', cls: 'is-nowrap' },
            { title: 'Họ tên', prop: 'FULL_NAME' },
            { title: 'Ngày sinh', cls: 'is-nowrap', render: function (r) { return ui.esc(P.ngaySinh(r)); } },
            { title: 'Giới tính', prop: 'GENDER_NAME' },
            { title: 'CCCD/Số định danh', prop: 'CCCD' },
            { title: 'Đơn vị hiện tại', prop: 'ORG_NAME' },
            { title: 'Vị trí hiện tại', prop: 'POSITION_NAME' },
            { title: 'Trạng thái nhân sự', prop: 'STATUS_CODE_NAME' },
            { title: 'Trạng thái quan hệ lao động', prop: 'EMPLOYMENT_STATUS_CODE_NAME' }
        ].concat(them || []);
    };

    /* ---------- Quan hệ lao động của một người ----------
       getList_QuanHeLaoDong / getList_QuanHe: Get_Core_Employment; trả rỗng thì dựng từ chính dòng người
       (buildQuanHeFromPersonList) rồi bổ sung chi tiết Get_Core_Employment_By_Id từng dòng (như gốc). */
    P.chiTietQuanHe = function (id) {
        return ums.api.call(P.goi('BiQ1HgIuMyQeBCwxLS44LCQvNR4DOB4IJQPP', 'Get_Core_Employment_By_Id', { strId: id }))
            .then(function (r) { return C.rows(r)[0] || null; });
    };
    function tuDongNguoi(nguoi, dsNguoi) {
        var pid = nguoi.PERSON_ID || nguoi.ID;
        return (dsNguoi || [nguoi]).filter(function (x) { return (x.PERSON_ID || x.ID) == pid && P.coQuanHe(x); }).map(function (x) {
            return {
                ID: x.CORE_EMPLOYMENT_ID || x.EMPLOYMENT_ID || x.EMPLOYMENT_Id, PERSON_ID: pid,
                EMPLOYMENT_TYPE_CODE: x.EMPLOYMENT_TYPE_CODE, EMPLOYMENT_TYPE_CODE_NAME: x.EMPLOYMENT_TYPE_CODE_NAME,
                EMPLOYMENT_STATUS_CODE: x.EMPLOYMENT_STATUS_CODE, EMPLOYMENT_STATUS_CODE_NAME: x.EMPLOYMENT_STATUS_CODE_NAME,
                LEGAL_ENTITY_ID: x.LEGAL_ENTITY_ID, LEGAL_ENTITY_NAME: x.LEGAL_ENTITY_NAME,
                EMPLOYER_ORG_ID: x.EMPLOYMENT_ORG_ID || x.EMPLOYER_ORG_ID || x.ORG_ID || x.ORG_UNIT_ID,
                EFFECTIVE_FROM: x.EMPLOYMENT_EFFECTIVE_FROM || x.EFFECTIVE_FROM, EFFECTIVE_TO: x.EMPLOYMENT_EFFECTIVE_TO || x.EFFECTIVE_TO,
                IS_PRIMARY: x.EMPLOYMENT_IS_PRIMARY !== null && x.EMPLOYMENT_IS_PRIMARY !== undefined ? x.EMPLOYMENT_IS_PRIMARY : x.IS_PRIMARY
            };
        }).filter(function (x, i, a) { return x.ID && a.findIndex(function (y) { return y.ID === x.ID; }) === i; });
    }
    P.quanHe = function (nguoi, dsNguoi) {
        var pid = nguoi.PERSON_ID || nguoi.ID;
        return ums.api.call(P.goi('BiQ1HgIuMyQeBCwxLS44LCQvNQPP', 'Get_Core_Employment', { strPerson_Id: pid })).then(function (r) {
            var rows = C.rows(r);
            if (rows.length) return rows;
            var dung = tuDongNguoi(nguoi, dsNguoi);
            return dung.reduce(function (p, x) {
                return p.then(function (acc) {
                    return P.chiTietQuanHe(x.ID).then(function (d) {
                        if (d && (d.IS_ACTIVE === 0 || d.IS_ACTIVE === '0')) return acc;
                        if (d) {
                            var m = {}; Object.keys(x).forEach(function (k) { m[k] = x[k]; }); Object.keys(d).forEach(function (k) { if (d[k] !== null && d[k] !== undefined && d[k] !== '') m[k] = d[k]; });
                            m.ID = d.ID || x.ID;
                            acc.push(m);
                        } else acc.push(x);
                        return acc;
                    }, function () { acc.push(x); return acc; });
                });
            }, Promise.resolve([]));
        });
    };

    /* =====================================================================
       KHỐI PHÂN CÔNG NHIỆM VỤ
       P.nhiemVu({
           listHost, formHost,            nơi vẽ bảng / biểu mẫu (màn tự đổi chỗ qua show)
           show(laForm),                  màn đổi vùng: true = biểu mẫu, false = danh sách
           ctx() → { person, employmentId, orgMacDinh }   ngữ cảnh hiện tại
           cotQHLD: true                  thêm cột "Quan hệ lao động" (bản phanconglaodong)
           tieuDe                         chữ đầu khung danh sách
           dong()                         có thì thêm nút "Đóng" ngoài cùng bên trái đầu khung danh sách
       }) → { nap(), xoaTrang(chữ) }
       ===================================================================== */
    P.nhiemVu = function (cfg) {
        var lh = cfg.listHost, fh = cfg.formHost;
        lh.innerHTML = pat.panel({ title: cfg.tieuDe || 'Phân công nhiệm vụ', icon: 'fa-list-check', count: 'nvDem', flush: true, zone: 'nvBang',
            tools: (cfg.dong ? ui.btn('close', { attr: { 'data-nv': 'dongds' } }) : '') +
                ui.xoaChon('input[data-nvck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-nv': 'xoa' } }) +
                ui.btn('add', { text: 'Thêm phân công', attr: { 'data-nv': 'them' } }) });
        fh.innerHTML = pat.panel({ title: 'Phân công', icon: 'fa-pen-to-square', zone: 'nvForm',
            tools: ui.btn('close', { attr: { 'data-nv': 'dong' } }) + ui.btn('save', { attr: { 'data-nv': 'luu' } }),
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Đơn vị phân công', '<select class="ums-select" data-scope="form" data-k="donvi" data-ph="Chọn đơn vị"><option value="">Chọn đơn vị</option></select>', { required: true }) +
                ui.field('Vị trí', '<select class="ums-select" data-scope="form" data-k="vitri" data-ph="Chọn vị trí"><option value="">Chọn vị trí</option></select>', { required: true }) +
                ui.field('Loại phân công', '<select class="ums-select" data-scope="form" data-k="loai" data-ph="Chọn loại phân công"><option value="">Chọn loại phân công</option></select>', { required: true }) +
                ui.field('Trạng thái phân công', '<select class="ums-select" data-scope="form" data-k="trangthai" data-ph="Chọn trạng thái phân công"><option value="">Chọn trạng thái phân công</option></select>') +
                ui.field('Chính thức', '<label class="ums-check"><input type="checkbox" data-k="chinhthuc" checked> Chính thức</label>') +
                '<div aria-hidden="true"></div>' +
                ui.field('Ngày bắt đầu hiệu lực', '<div class="ums-inputwrap"><input class="ums-input" data-scope="form" data-type="date" data-k="tu" autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>', { required: true }) +
                ui.field('Ngày kết thúc hiệu lực', '<div class="ums-inputwrap"><input class="ums-input" data-scope="form" data-type="date" data-k="den" autocomplete="off" placeholder="dd/mm/yyyy"><i class="fa-light fa-calendar"></i></div>') +
                '<div class="nscc-span">' + ui.field('Ghi chú', '<textarea class="ums-textarea" data-scope="form" data-k="ghichu"></textarea>') + '</div>' +
                '</div>' });
        function z(k) { return lh.querySelector('[data-z="' + k + '"]') || fh.querySelector('[data-z="' + k + '"]'); }
        var fb = z('nvForm');
        function f(k) { return fb.querySelector('[data-k="' + k + '"]'); }
        var S = { ds: [], sua: '' };

        P.dm().then(function (d) {
            pat.fill(f('loai'), d.loaiPC, { head: 'Chọn loại phân công' });
            pat.fill(f('trangthai'), d.trangThaiPC, { head: 'Chọn trạng thái phân công' });
        });
        C.donVi().then(function (rows) { pat.fill(f('donvi'), rows, { name: 'NAME', head: 'Chọn đơn vị' }); });

        function napViTri(org, chon) {
            var el = f('vitri');
            pat.fill(el, [], { head: 'Chọn vị trí' });
            el.value = '';
            if (!org) return Promise.resolve();
            return C.viTri(org).then(function (rows) {
                if (f('donvi').value !== org) return;
                pat.fill(el, rows, { name: 'POSITION_NAME', head: 'Chọn vị trí' });
                el.value = e(chon);
                jQuery(el).trigger('change.select2');
            });
        }
        jQuery(f('donvi')).on('select2:select select2:clear', function () { napViTri(f('donvi').value); });
        ui.enhance(fh);
        pat.chain([f('donvi'), f('vitri')], { phatLai: false });
        Array.prototype.forEach.call(fh.querySelectorAll('[data-type="date"]'), function (x) { ui.datepicker(x); });

        function dat(k, v) {
            var el = f(k); el.value = e(v);
            if (el.tagName === 'SELECT') jQuery(el).trigger('change.select2');
            if (el._flatpickr) el._flatpickr.setDate(v || null, false, 'd/m/Y');
        }

        function nap() {
            var c = cfg.ctx();
            if (!c.employmentId) { xoaTrang(cfg.nhac || 'Chọn một quan hệ lao động để xem phân công'); return Promise.resolve(); }
            var pid = c.person ? (c.person.PERSON_ID || c.person.ID) : '';
            z('nvBang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(P.goi('BiQ1HgIuMyQeADIyKCYvLCQvNQPP', 'Get_Core_Assignment', { strPerson_Id: pid, strEmployment_Id: c.employmentId })).then(function (r) {
                S.ds = C.rows(r).filter(function (x) { return x && !(x.IS_ACTIVE === 0 || x.IS_ACTIVE === '0'); });
                z('nvDem').textContent = '(' + S.ds.length + ')';
                var cot = [
                    { title: 'Vị trí', prop: 'POSITION_NAME' },
                    { title: 'Loại phân công', prop: 'ASSIGNMENT_TYPE_CODE_NAME' },
                    { title: 'Từ ngày', prop: 'EFFECTIVE_FROM', cls: 'is-nowrap' },
                    { title: 'Đến ngày', prop: 'EFFECTIVE_TO', cls: 'is-nowrap' }
                ];
                if (cfg.cotQHLD) cot.push({ title: 'Quan hệ lao động', prop: 'EMPLOYMENT_TYPE_CODE_NAME' });
                cot.push({ title: 'Chi tiết', cls: 'is-center is-actions', render: function (x) { return ui.iconBtn('view', x.ID); } });
                cot.push({ head: '<input type="checkbox" data-nvall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (x) { return '<input type="checkbox" data-nvck="' + ui.esc(x.ID) + '">'; } });
                ui.table({ el: z('nvBang'), rows: S.ds, columns: cot, empty: 'Chưa có phân công nhiệm vụ' });
            }).catch(function (err) { z('nvBang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'Get_Core_Assignment'); });
        }
        function xoaTrang(chu) {
            S.ds = [];
            z('nvDem').textContent = '';
            z('nvBang').innerHTML = ui.empty(chu, 'fa-hand-pointer');
        }

        function moForm(ct) {
            S.sua = ct ? ct.ID : '';
            var c = cfg.ctx();
            fb.parentNode.querySelector('.ums-panel__title').innerHTML = '<i class="fa-light ' + (ct ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' +
                (ct ? 'Chi tiết phân công' : 'Thêm phân công') + (c.person ? ' — ' + ui.esc(e(c.person.FULL_NAME)) : '');
            var org = ct ? (ct.ORG_ID || ct.ORG_UNIT_ID || ct.EMPLOYER_ORG_ID || '') : e(c.orgMacDinh);
            dat('donvi', org);
            napViTri(org, ct ? ct.POSITION_ID : '');
            dat('loai', ct ? ct.ASSIGNMENT_TYPE_CODE : '');
            dat('trangthai', ct ? ct.ASSIGNMENT_STATUS_CODE : '');
            dat('tu', ct ? ct.EFFECTIVE_FROM : ''); dat('den', ct ? ct.EFFECTIVE_TO : '');
            var p = ct ? (ct.IS_PRIMARY !== null && ct.IS_PRIMARY !== undefined ? ct.IS_PRIMARY : (ct.D_IS_PRIMARY !== null && ct.D_IS_PRIMARY !== undefined ? ct.D_IS_PRIMARY : ct.IS_PRIMARY_ASSIGNMENT)) : 1;
            f('chinhthuc').checked = p === 1 || p === '1' || p === true;
            dat('ghichu', ct ? (ct.NOTE || ct.NOTE_TEXT || ct.STR_NOTE || '') : '');
            cfg.show(true);
        }
        function chiTiet(id) {
            ums.api.call(P.goi('BiQ1HgIuMyQeADIyKCYvLCQvNR4DOB4IJQPP', 'Get_Core_Assignment_By_Id', { strId: id })).then(function (r) {
                var d = C.rows(r)[0];
                if (!d) { ui.toast('Không tìm thấy thông tin chi tiết!', 'warn'); return; }
                moForm(d);
            }).catch(function (err) { ums.api.handle(err, 'Get_Core_Assignment_By_Id'); });
        }
        function luu() {
            var c = cfg.ctx();
            if (!c.person || !c.employmentId) { ui.toast('Vui lòng chọn quan hệ lao động trước khi phân công!', 'warn'); return; }
            if (!f('vitri').value) { ui.toast('Vui lòng chọn vị trí!', 'warn'); return; }
            if (!f('loai').value) { ui.toast('Vui lòng chọn loại phân công!', 'warn'); return; }
            if (!f('tu').value) { ui.toast('Vui lòng nhập ngày bắt đầu hiệu lực!', 'warn'); return; }
            if (!f('donvi').value) { ui.toast('Vui lòng chọn đơn vị phân công!', 'warn'); return; }
            var sua = S.sua;
            var o = P.goi(sua ? 'FDElHgIuMyQeADIyKCYvLCQvNQPP' : 'CC8yHgIuMyQeADIyKCYvLCQvNQPP', sua ? 'Upd_Core_Assignment' : 'Ins_Core_Assignment', {
                strId: sua, strPerson_Id: c.person.PERSON_ID || c.person.ID, strEmployment_Id: c.employmentId,
                strAssignment_Type_Code: f('loai').value, strAssignment_Status_Code: f('trangthai').value,
                strOrg_Id: f('donvi').value, strPosition_Id: f('vitri').value, dIs_Primary: f('chinhthuc').checked ? 1 : 0, dFte_Ratio: 1,
                strEffective_From: f('tu').value, strEffective_To: f('den').value, strDecision_Id: '', strSource_Event_Id: '',
                strNote: e(f('ghichu').value), dIs_Active: 1
            });
            ums.api.call(o).then(function () {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                cfg.show(false);
                nap();
            }).catch(function (err) { ums.api.handle(err, o.func); });
        }
        function xoa() {
            var ids = Array.prototype.map.call(z('nvBang').querySelectorAll('input[data-nvck]:checked'), function (x) { return x.getAttribute('data-nvck'); });
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                if (!yes) return;
                ui.batch(ids.map(function (id) { return P.goi('BSQtHgIuMyQeADIyKCYvLCQvNQPP', 'Del_Core_Assignment', { strId: id }); }),
                    { title: 'Đang xóa', okText: 'Xóa dữ liệu thành công!' }).then(nap);
            });
        }

        lh.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-nvall')) Array.prototype.forEach.call(z('nvBang').querySelectorAll('input[data-nvck]'), function (x) { x.checked = ev.target.checked; });
        });
        lh.addEventListener('click', function (ev) {
            var v = ev.target.closest('[data-act="view"]');
            if (v && z('nvBang').contains(v)) { chiTiet(v.getAttribute('data-id')); return; }
            var b = ev.target.closest('button[data-nv]');
            if (!b) return;
            if (b.getAttribute('data-nv') === 'them') {
                var c = cfg.ctx();
                if (!c.employmentId) { ui.toast(cfg.canQHLD || 'Vui lòng chọn 1 quan hệ lao động trước!', 'warn'); return; }
                moForm(null);
            } else if (b.getAttribute('data-nv') === 'xoa') xoa();
            else if (b.getAttribute('data-nv') === 'dongds' && cfg.dong) cfg.dong();
        });
        fh.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-nv]');
            if (!b) return;
            if (b.getAttribute('data-nv') === 'luu') luu();
            else if (b.getAttribute('data-nv') === 'dong') cfg.show(false);
        });
        return { nap: nap, xoaTrang: xoaTrang };
    };
})();
