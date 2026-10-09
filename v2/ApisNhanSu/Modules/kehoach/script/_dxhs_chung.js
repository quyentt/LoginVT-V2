/* =========================================================================
   kehoach/dexuathoso — tiện ích chung (ums.nsDxhs)
   ---------------------------------------------------------------------------
   Bảng mã action (chép nguyên từ script gốc, cùng quy tắc mã hoá — mọi chuỗi dưới đây ĐỀU có trong gốc):
       NS_HoSoNhanSu5_MH · PKG_CORE_HOSONHANSU_05.*   hồ sơ người, định danh, liên hệ
       NS_HoSoNhanSu6_MH · PKG_CORE_HOSONHANSU_06.*   địa chỉ, gia đình, tài khoản NH, học vấn, chứng chỉ,
                                                      tài liệu, học hàm (Get / Ins / Upd / Del / *_By_Id)
   ums.nsDxhs = {
       g5(tên, thamSố) · g6(tên, thamSố)   lời gọi { action, func, … } (g6 tự thêm strVaiTro_Id '' như gốc)
       arr(d) · ngay(v) (→ dd/mm/yyyy) · co(v) (1/true/'y' → true) · lay(r, [cột…]) (giá trị đầu tiên có)
       dmRows(mã) → Promise<dòng>          danh mục (ums.api.dm), lỗi → []
       chon(el, giáTrị, dòng)             đặt ô chọn theo ID, không khớp thì theo MA (setComboSmart của gốc)
       an(el, true|false)                 ẩn/hiện cả ô (nhãn + ô nhập) trong lưới biểu mẫu
       kv(nhóm)                           khối "nhãn : giá trị" theo nhóm cho hộp Chi tiết
       ddlh(host, cờ)                     hai bảng Định danh | Liên hệ (dùng ở ApisSinhVien/hoso — xem chú thích tại hàm)
   }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, esc = ui.esc;
    var X = ums.nsDxhs = ums.nsDxhs || {};

    var A5 = {
        GetCorePersonByNguoiTaoId: 'BiQ1Ai4zJBEkMzIuLwM4DyY0LigVIC4IJQPP',
        InsertCorePerson: 'CC8yJDM1Ai4zJBEkMzIuLwPP',
        UpdateCorePerson: 'FDElIDUkAi4zJBEkMzIuLwPP',
        DeleteCorePerson: 'BSQtJDUkAi4zJBEkMzIuLwPP',
        KiemTraThongTinDinhDanh: 'CigkLBUzIBUpLi8mFSgvBSgvKQUgLykP',
        InsertPersonIdentifier: 'CC8yJDM1ESQzMi4vCCUkLzUoJygkMwPP',
        UpdatePersonIdentifier: 'FDElIDUkESQzMi4vCCUkLzUoJygkMwPP',
        GetPersonIdentifierByPerson_Id: 'BiQ1ESQzMi4vCCUkLzUoJygkMwM4ESQzMi4vHggl',
        KiemTraThongTinLienHe: 'CigkLBUzIBUpLi8mFSgvDSgkLwkk',
        InsertPersonContact: 'CC8yJDM1ESQzMi4vAi4vNSAiNQPP',
        UpdatePersonContact: 'FDElIDUkESQzMi4vAi4vNSAiNQPP',
        GetPersonContactByPerson_Id: 'BiQ1ESQzMi4vAi4vNSAiNQM4ESQzMi4vHggl',
        LayDSLoaiDinhDanhBatBuoc: 'DSA4BRINLiAoBSgvKQUgLykDIDUDNC4i',
        LayDSLoaiLienHeBatBuoc: 'DSA4BRINLiAoDSgkLwkkAyA1AzQuIgPP'
    };
    var A6 = {
        Get_Person_Address: 'BiQ1HhEkMzIuLx4AJSUzJDIy',
        Ins_Person_Address: 'CC8yHhEkMzIuLx4AJSUzJDIy',
        Upd_Person_Address: 'FDElHhEkMzIuLx4AJSUzJDIy',
        Del_Person_Address: 'BSQtHhEkMzIuLx4AJSUzJDIy',
        Get_Person_Family: 'BiQ1HhEkMzIuLx4HICwoLTgP',
        Ins_Person_Family: 'CC8yHhEkMzIuLx4HICwoLTgP',
        Upd_Person_Family: 'FDElHhEkMzIuLx4HICwoLTgP',
        Del_Person_Family: 'BSQtHhEkMzIuLx4HICwoLTgP',
        Get_Person_Bank_Account: 'BiQ1HhEkMzIuLx4DIC8qHgAiIi40LzUP',
        Ins_Person_Bank_Account: 'CC8yHhEkMzIuLx4DIC8qHgAiIi40LzUP',
        Upd_Person_Bank_Account: 'FDElHhEkMzIuLx4DIC8qHgAiIi40LzUP',
        Del_Person_Bank_Account: 'BSQtHhEkMzIuLx4DIC8qHgAiIi40LzUP',
        Get_Person_Education: 'BiQ1HhEkMzIuLx4EJTQiIDUoLi8P',
        Ins_Person_Education: 'CC8yHhEkMzIuLx4EJTQiIDUoLi8P',
        Upd_Person_Education: 'FDElHhEkMzIuLx4EJTQiIDUoLi8P',
        Del_Person_Education: 'BSQtHhEkMzIuLx4EJTQiIDUoLi8P',
        Get_Person_Certificate: 'BiQ1HhEkMzIuLx4CJDM1KCcoIiA1JAPP',
        Ins_Person_Certificate: 'CC8yHhEkMzIuLx4CJDM1KCcoIiA1JAPP',
        Upd_Person_Certificate: 'FDElHhEkMzIuLx4CJDM1KCcoIiA1JAPP',
        Del_Person_Certificate: 'BSQtHhEkMzIuLx4CJDM1KCcoIiA1JAPP',
        Get_Person_Document: 'BiQ1HhEkMzIuLx4FLiI0LCQvNQPP',
        Ins_Person_Document: 'CC8yHhEkMzIuLx4FLiI0LCQvNQPP',
        Upd_Person_Document: 'FDElHhEkMzIuLx4FLiI0LCQvNQPP',
        Del_Person_Document: 'BSQtHhEkMzIuLx4FLiI0LCQvNQPP',
        Get_Person_Academic_Rank: 'BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8q',
        Ins_Person_Academic_Rank: 'CC8yHhEkMzIuLx4AIiAlJCwoIh4TIC8q',
        Upd_Person_Academic_Rank: 'FDElHhEkMzIuLx4AIiAlJCwoIh4TIC8q',
        Del_Person_Academic_Rank: 'BSQtHhEkMzIuLx4AIiAlJCwoIh4TIC8q',
        Get_Person_Education_By_Id: 'BiQ1HhEkMzIuLx4EJTQiIDUoLi8eAzgeCCUP',
        Get_Person_Certificate_By_Id: 'BiQ1HhEkMzIuLx4CJDM1KCcoIiA1JB4DOB4IJQPP',
        Get_Person_Document_By_Id: 'BiQ1HhEkMzIuLx4FLiI0LCQvNR4DOB4IJQPP',
        Get_Person_Academic_Rank_By_Id: 'BiQ1HhEkMzIuLx4AIiAlJCwoIh4TIC8qHgM4Hggl'
    };

    function gop(a, b) { Object.keys(b || {}).forEach(function (k) { a[k] = b[k]; }); return a; }
    X.g5 = function (ten, o) { return gop({ action: 'NS_HoSoNhanSu5_MH/' + A5[ten], func: 'PKG_CORE_HOSONHANSU_05.' + ten }, o); };
    X.g6 = function (ten, o) { return gop({ action: 'NS_HoSoNhanSu6_MH/' + A6[ten], func: 'PKG_CORE_HOSONHANSU_06.' + ten, strVaiTro_Id: '' }, o); };

    X.arr = function (d) { return Array.isArray(d) ? d : (d && d.rs) || []; };
    X.ngay = function (v) { return ui.ngayGio(v, { chiNgay: true }); };
    X.co = function (v) {
        if (v === true) return true;
        var s = (v === null || v === undefined) ? '' : String(v).trim().toLowerCase();
        return s === '1' || s === 'true' || s === 'y' || s === 'yes';
    };
    X.lay = function (r, ks) {
        r = r || {};
        for (var i = 0; i < ks.length; i++) {
            var v = r[ks[i]];
            if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
        }
        return '';
    };
    X.dmRows = function (ma) { return ums.api.dm(ma).then(function (r) { return r || []; }, function () { return []; }); };

    X.chon = function (el, val, rows) {
        if (!el) return '';
        val = val === undefined || val === null ? '' : String(val).trim();
        var ok = '';
        if (val) {
            var co = Array.prototype.some.call(el.options, function (o) { return o.value === val; });
            if (co) ok = val;
            else {
                var r = (rows || []).filter(function (x) { return String(x.MA || '').trim() === val; })[0];
                if (r) ok = r.ID;
            }
        }
        el.value = ok;
        if (window.jQuery) jQuery(el).trigger('change.select2').trigger('ums:refresh');
        return ok;
    };

    X.an = function (el, an) {
        var o = el && el.closest('.ums-field');
        var c = o && o.parentElement;
        if (c) c.hidden = !!an;
    };

    /* nhom = [{ t: 'Thông tin chung', i: [['Nhãn', 'COT' | fn(r)], …] }, …] */
    X.kv = function (r, nhom) {
        return nhom.map(function (g) {
            return '<div class="ums-legend">' + esc(g.t) + '</div><div class="ums-grid ums-grid--2">' +
                g.i.map(function (x) {
                    var v = typeof x[1] === 'function' ? x[1](r) : esc(r[x[1]] === null || r[x[1]] === undefined ? '' : r[x[1]]);
                    return '<div class="ums-kv"><span>' + esc(x[0]) + '</span><b>' + v + '</b></div>';
                }).join('') + '</div>';
        }).join('');
    };
    X.coKhong = function (v, a, b) { return X.co(v) ? ui.badge(a || 'Có', 'ok') : ui.badge(b || 'Không', 'mute'); };

    /* =====================================================================
       Hai bảng "Thông tin định danh" | "Thông tin liên hệ" của biểu mẫu hồ sơ (genTable_DinhDanh /
       genTable_LienHe + save_KiemTra* + save_DinhDanh / save_LienHe của dexuathoso.js). Dùng ở
       ApisSinhVien/hoso (_hsA.js). kehoach/dexuathoso.js (Nhân sự) còn bản viết thẳng trong tệp —
       hành vi mặc định dưới đây GIỮ ĐÚNG bản đó (Nợ: cho dexuathoso.js gọi hàm này).
           var b = X.ddlh(host, o)          vẽ hai khung vào host (lưới hai cột)
           b.loai → Promise<[dòng định danh, dòng liên hệ]>   (LayDSLoai*BatBuoc, nạp một lần mỗi bảng)
           b.nap(pid) → Promise              đổ bản ghi đã lưu, ghi nhận Id (lần Lưu sau là Update)
           b.o('dd'|'lh', idLoai, 'so'|'ngay'|'noi'|'gt'|'chinh') → ô nhập
           b.kiemTra(pid) → Promise<'' | { ten, gt, kind, loai }>  trùng của loại CHƯA có bản ghi
           b.calls(pid) → [lời gọi Insert|Update…] · b.sauLuu(pid) nạp lại Id · b.rows = { dd, lh }
       o (mặc định = hành vi Nhân sự):
           boQuaRong      ô trống thì không kiểm tra trùng, không gửi (bản Sinh viên: "tránh insert NULL")
           motChinh       "Là thông tin chính" chọn một trong mỗi bảng (UX_PERSON_*_PRIMARY)
           locHieuLuc     bỏ bản ghi liên hệ IS_ACTIVE = 0 khi nạp
           boQuaTrungMinh kết quả kiểm tra trùng là của CHÍNH hồ sơ đang mở → không tính là trùng
           xoaMem         liên hệ đã có bản ghi mà người dùng tự xoá trắng → UpdatePersonContact giữ giá trị
                          cũ + dIsActive / dIs_Active 0 (cột CONTACT_VALUE NOT NULL, không có proc xoá)
           motCot         hai khung xếp dọc (khung chứa hẹp — biểu mẫu ở cột phải của màn hai cột)
       ===================================================================== */
    X.ddlh = function (host, o) {
        o = o || {};
        var id = { dd: {}, lh: {} }, rows = { dd: [], lh: [] }, cu = { lh: {} };
        host.innerHTML = '<div class="ums-grid' + (o.motCot ? '' : ' ums-grid--2') + ' ums-cols">' +
            ums.pat.panel({ title: 'Thông tin định danh', icon: 'fa-id-card', flush: true, zone: 'dd' }) +
            ums.pat.panel({ title: 'Thông tin liên hệ', icon: 'fa-address-book', flush: true, zone: 'lh' }) + '</div>';
        var loai = Promise.all([
            ums.api.call(X.g5('LayDSLoaiDinhDanhBatBuoc', { silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; }),
            ums.api.call(X.g5('LayDSLoaiLienHeBatBuoc', { silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; })
        ]);
        function oNhap(attr, v, f, date) { return '<input class="ums-input" ' + attr + '="' + esc(v) + '" data-f="' + f + '"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + ' autocomplete="off">'; }
        function chinh(attr, v) { return '<input type="checkbox" ' + attr + '="' + esc(v) + '" data-f="chinh">'; }
        var api = { loai: loai, rows: rows, id: id };
        api.o = function (k, t, f) { return host.querySelector('[data-' + k + '="' + t + '"][data-f="' + f + '"]'); };
        var ve = loai.then(function (x) {
            ui.table({ el: host.querySelector('[data-z="dd"]'), rows: x[0], empty: 'Không có loại định danh bắt buộc', columns: [
                { title: 'Loại định danh', prop: 'TEN' },
                { title: 'Số định danh', render: function (r) { return oNhap('data-dd', r.ID, 'so'); } },
                { title: 'Ngày cấp', width: '140px', render: function (r) { return oNhap('data-dd', r.ID, 'ngay', true); } },
                { title: 'Nơi cấp', render: function (r) { return oNhap('data-dd', r.ID, 'noi'); } },
                { title: 'Là thông tin chính', cls: 'is-center', width: '90px', render: function (r) { return chinh('data-dd', r.ID); } }
            ] });
            ui.table({ el: host.querySelector('[data-z="lh"]'), rows: x[1], empty: 'Không có loại liên hệ bắt buộc', columns: [
                { title: 'Loại liên hệ', prop: 'TEN' },
                { title: 'Thông tin', render: function (r) { return oNhap('data-lh', r.ID, 'gt'); } },
                { title: 'Là thông tin chính', cls: 'is-center', width: '90px', render: function (r) { return chinh('data-lh', r.ID); } }
            ] });
            ui.enhance(host);
            return x;
        });
        api.ve = ve;
        if (o.motChinh) host.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches('input[data-f="chinh"]') || !t.checked) return;
            var k = t.hasAttribute('data-dd') ? 'dd' : 'lh';
            Array.prototype.forEach.call(host.querySelectorAll('input[data-' + k + '][data-f="chinh"]'), function (c) { if (c !== t) c.checked = false; });
        });
        /* Người dùng tự gõ vào ô (xoá trắng = cố ý xoá, không phải "form chưa nạp") */
        host.addEventListener('input', function (ev) { if (ev.target.matches('input[data-f]')) ev.target.setAttribute('data-cham', '1'); });

        function datNgay(el, v) { el.value = v || ''; if (el._flatpickr) el._flatpickr.setDate(el.value || null, false, 'd/m/Y'); }
        api.xoa = function () {
            id.dd = {}; id.lh = {}; rows.dd = []; rows.lh = []; cu.lh = {};
            Array.prototype.forEach.call(host.querySelectorAll('input[data-f]'), function (el) {
                if (el.type === 'checkbox') el.checked = false; else if (el.getAttribute('data-f') === 'ngay') datNgay(el, ''); else el.value = '';
                el.removeAttribute('data-cham'); el.classList.remove('is-invalid');
            });
        };
        /* genTable_DinhDanh / genTable_LienHe: chỉ nhận mã loại dài 32 */
        api.nap = function (pid) {
            return ve.then(function () {
                return Promise.all([
                    ums.api.call(X.g5('GetPersonIdentifierByPerson_Id', { strPerson_Id: pid, silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; }),
                    ums.api.call(X.g5('GetPersonContactByPerson_Id', { strPerson_Id: pid, silent: true })).then(function (r) { return X.arr(r.data); }, function () { return []; })
                ]);
            }).then(function (x) {
                var lh = o.locHieuLuc ? x[1].filter(function (d) { return d.IS_ACTIVE === undefined || d.IS_ACTIVE === null || d.IS_ACTIVE == 1; }) : x[1];
                rows.dd = x[0]; rows.lh = lh;
                x[0].forEach(function (d) {
                    var t = String(d.IDENTIFIER_TYPE_CODE || '');
                    if (t.length !== 32 || !api.o('dd', t, 'so')) return;
                    id.dd[t] = d.ID;
                    api.o('dd', t, 'so').value = d.IDENTIFIER_NO || '';
                    datNgay(api.o('dd', t, 'ngay'), d.ISSUE_DATE);
                    api.o('dd', t, 'noi').value = d.ISSUE_PLACE || '';
                    if (X.co(d.IS_PRIMARY)) api.o('dd', t, 'chinh').checked = true;
                });
                lh.forEach(function (d) {
                    var t = String(d.CONTACT_TYPE_CODE_ID || '');
                    if (t.length !== 32 || !api.o('lh', t, 'gt')) return;
                    id.lh[t] = d.ID;
                    cu.lh[t] = d.CONTACT_VALUE || '';
                    api.o('lh', t, 'gt').value = d.CONTACT_VALUE || '';
                    if (X.co(d.IS_PRIMARY)) api.o('lh', t, 'chinh').checked = true;
                });
                return rows;
            });
        };
        function gt(k, t) { var el = api.o(k, t, k === 'dd' ? 'so' : 'gt'); return el ? el.value.trim() : ''; }
        function laCuaMinh(pid, k, t, v, d) {
            if (!o.boQuaTrungMinh) return false;
            var cua = (rows[k] || []).some(function (x) {
                var xv = k === 'dd' ? x.IDENTIFIER_NO : x.CONTACT_VALUE, xt = k === 'dd' ? x.IDENTIFIER_TYPE_CODE : x.CONTACT_TYPE_CODE_ID;
                return String(xv || '').trim().toUpperCase() === v.toUpperCase() && String(xt || '').toUpperCase() === String(t).toUpperCase();
            });
            if (cua) return true;
            return d.every(function (r) {
                var rp = r.PERSON_ID || r.PERSONID || r.CORE_PERSON_ID;
                return rp && String(rp).toUpperCase() === String(pid).toUpperCase();
            });
        }
        /* save_KiemTraDinhDanh / save_KiemTraLienHe: chỉ loại CHƯA có bản ghi */
        api.kiemTra = function (pid) {
            return loai.then(function (x) {
                var ds = [];
                x[0].forEach(function (t) {
                    var v = gt('dd', t.ID);
                    if (id.dd[t.ID] || (o.boQuaRong && !v)) return;
                    ds.push({ kind: 'dd', loai: t, gt: v, call: X.g5('KiemTraThongTinDinhDanh', { strIdentifier_Type_Code: t.ID, strIdentifier_No: v, silent: true }) });
                });
                x[1].forEach(function (t) {
                    var v = gt('lh', t.ID);
                    if (id.lh[t.ID] || (o.boQuaRong && !v)) return;
                    ds.push({ kind: 'lh', loai: t, gt: v, call: X.g5('KiemTraThongTinLienHe', { strContactTypeCode: t.ID, strContactValue: v, silent: true }) });
                });
                return Promise.all(ds.map(function (k) {
                    return ums.api.call(k.call).then(function (r) {
                        var d = X.arr(r.data);
                        return d.length && !laCuaMinh(pid, k.kind, k.loai.ID, k.gt, d) ? { ten: 'Dữ liệu tồn tại: ' + k.loai.TEN, gt: k.gt, kind: k.kind, loai: k.loai } : '';
                    }, function (err) { return { ten: err.message || 'Lỗi kiểm tra ' + k.loai.TEN, kind: k.kind, loai: k.loai }; });
                })).then(function (loi) { return loi.filter(Boolean)[0] || ''; });
            });
        };
        /* Insert|Update theo Id đã ghi nhận — gọi SAU khi đã có pid */
        api.calls = function (pid, x) {
            var calls = [];
            x[0].forEach(function (t) {
                var v = gt('dd', t.ID);
                if (o.boQuaRong && !v) return;
                var rid = id.dd[t.ID] || '';
                calls.push(X.g5(rid ? 'UpdatePersonIdentifier' : 'InsertPersonIdentifier', {
                    strId: rid, strIdentifierTypeCode: t.ID, strPersonId: pid, strIdentifierNo: v,
                    strIssueDate: api.o('dd', t.ID, 'ngay').value.trim(), strIssuePlace: api.o('dd', t.ID, 'noi').value.trim(),
                    dIsPrimary: api.o('dd', t.ID, 'chinh').checked ? 1 : 0, strEffectiveFrom: '', strEffectiveTo: ''
                }));
            });
            x[1].forEach(function (t) {
                var v = gt('lh', t.ID), rid = id.lh[t.ID] || '';
                if (o.boQuaRong && !v) {
                    if (o.xoaMem && rid && cu.lh[t.ID] && api.o('lh', t.ID, 'gt').hasAttribute('data-cham')) {
                        calls.push(X.g5('UpdatePersonContact', { strId: rid, strPersonId: pid, strContactTypeCode: t.ID,
                            strContactValue: cu.lh[t.ID], dIsPrimary: 0, dIsActive: 0, dIs_Active: 0 }));
                    }
                    return;
                }
                calls.push(X.g5(rid ? 'UpdatePersonContact' : 'InsertPersonContact', {
                    strId: rid, strPersonId: pid, strContactTypeCode: t.ID, strContactValue: v,
                    dIsPrimary: api.o('lh', t.ID, 'chinh').checked ? 1 : 0, strEffectiveFrom: '', strEffectiveTo: ''
                }));
            });
            return calls;
        };
        return api;
    };
})();
