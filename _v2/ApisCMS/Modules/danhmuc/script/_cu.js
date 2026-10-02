/* =========================================================================
   Tầng chung của nhóm "công cụ" trong ApisCMS/Modules/danhmuc (nhóm G):
   comparetable · exporttable · upcode · cloudupdate · autologdb
   (mauphoiin, cautrucnoidungguiemail chỉ dùng vài tiện ích nhỏ ở đây).
   ---------------------------------------------------------------------------
   ums.cmsCu = {
       e(v)                     null/undefined → ''
       demo()                   đang chạy dữ liệu dựng thử?
       lsGet(k) / lsSet(k, v)   localStorage bọc try/catch (bản gốc nhớ máy chủ,
                                tài khoản dropbox, chuỗi kết nối… bằng localStorage)
       rootPathReport()         gốc URL báo cáo (edu.system.rootPathReport): chức năng
                                → vai trò → phiên — chép cách tra của assets/js/report.js
                                (hàm đó không xuất ra ngoài)
       ghi(msg, o)              hộp hỏi lại cho MỌI nút ghi của nhóm này
                                (ums.ui.confirm tone 'bad') → Promise<boolean>
       hopPin(o)                hộp "Thực thi lệnh": ô mã pin + (tuỳ) khung lệnh chỉ đọc
       goiNgoai(url, thamSo)    GET sang máy chủ KHÁC ($.ajax crossDomain của cloudupdate)
       taiZip(file)             tải gói .zip lên <rootPathUpload>/Handler/deploycode.ashx
                                (uploadImport riêng của upcode.js) → Promise<chuỗi trả về>
       commentSQL(s) / cutBug(s)   chép nguyên SeaGate_CommentSQL / cutbugdata
                                (ApisCMS/Modules/danhmuc/script/cutsouresql.js) — hàm
                                chuỗi thuần, KHÔNG eval
       gopO(tableEl, cot)       gộp ô trùng liền nhau theo cột (edu.system.collageInTable)
   }
   Không có eval ở bất cứ đâu trong nhóm này.
   ========================================================================= */
(function () {
    'use strict';
    var ums = window.ums, ui = ums.ui;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function demo() { return !!(ums.state && ums.state.mode === 'demo'); }
    function S() { return ums.session || {}; }

    function lsGet(k) { try { return window.localStorage.getItem(k); } catch (x) { return null; } }
    function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (x) { /* trình duyệt chặn lưu trữ: bỏ qua */ } }

    function rootPathReport() {
        var s = ums.state || {};
        var cn = (s.menu || []).filter(function (c) { return c.id === s.chucNangId; })[0];
        if (cn && cn.report) return cn.report;
        var role = (s.roles || []).filter(function (r) { return r.id === s.roleId; })[0];
        if (role && role.report) return role.report;
        return S().rootPathReport || '';
    }

    /* Mọi nút GHI của nhóm công cụ (chạy lệnh DDL, cập nhật mã, import, xoá log…)
       đi qua đây — kể cả chỗ bản gốc không hỏi. */
    function ghi(msg, o) {
        o = o || {};
        return ui.confirm(msg, { tone: 'bad', ok: o.ok || 'Thực hiện', title: o.title || 'Thao tác tác động trực tiếp lên hệ thống' });
    }

    /* Hộp "Thực thi lệnh" (myModal của comparetable): mã pin + lệnh sẽ chạy.
       o = { title, placeholder, lenh (chuỗi, bỏ trống = không có khung lệnh), nut, onOk(pin, dlg) } */
    function hopPin(o) {
        var body = '<div class="ums-stack">' +
            ui.field('Nhập mã pin', '<input type="password" class="ums-input" data-pin autocomplete="new-password" placeholder="' + ui.esc(o.placeholder || '') + '">') +
            (o.lenh !== undefined
                ? ui.field('Lệnh sẽ thực thi', '<textarea class="ums-textarea cu-code cu-code--dlg" readonly>' + ui.esc(o.lenh) + '</textarea>',
                    { hint: 'Chỉ để xem lại. Muốn sửa lệnh thì sửa ở cột "Lệnh" của bảng rồi bấm Thực thi lần nữa.' })
                : '') +
            (o.them || '') +
            '</div>';
        var dlg = ui.dialog({
            title: o.title || 'Thực thi lệnh', icon: 'fa-terminal', size: o.lenh !== undefined ? 'lg' : 'md', body: body,
            buttons: [{ text: o.nut || 'Thực thi tất cả', kind: 'confirm', mod: 'danger', onClick: function (d) {
                var pin = d.body.querySelector('[data-pin]').value;
                o.onOk(pin, d);
                return false;           // onOk tự đóng khi đã hỏi lại xong
            } }]
        });
        var p = dlg.body.querySelector('[data-pin]');
        if (p) p.focus();
        return dlg;
    }

    /* $.param của jQuery (form-urlencoded, khoảng trắng thành "+") */
    function toQuery(o) {
        if (window.jQuery && jQuery.param) return jQuery.param(o);
        return Object.keys(o).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(e(o[k])); }).join('&').replace(/%20/g, '+');
    }

    /* GET sang máy chủ khác — bản gốc $.ajax({ type: 'GET', crossDomain: true, cache: false }),
       không header Authorization. Trả Promise<json>, reject khi Success = false. */
    function goiNgoai(url, thamSo) {
        if (demo()) {
            console.info('[cmsCu demo] GET', url, thamSo);
            return new Promise(function (ok) { setTimeout(function () { ok({ Success: true, Message: '', Data: [] }); }, 300); });
        }
        return fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + toQuery(thamSo) + '&_=' + Date.now(), { method: 'GET', mode: 'cors', cache: 'no-store' })
            .then(function (r) {
                if (!r.ok) throw new Error('Máy chủ trả mã ' + r.status);
                return r.json();
            })
            .then(function (j) {
                if (j && j.Success === false) throw new Error(j.Message || 'Máy chủ báo lỗi');
                return j;
            });
    }

    /* Tải gói .zip (upcode.js: uploadImport riêng, checkFileImport chỉ nhận ".zip").
       POST <rootPathUpload>/Handler/deploycode.ashx, thân multipart (tên trường = tên tệp).
       Chứa "Loi System" = lỗi. Kết quả nhân đôi dấu "\" như outThongTinDinhKem của gốc. */
    function taiZip(file) {
        var n = (file && file.name) || '';
        var ext = n.substring(n.lastIndexOf('.') + 1).toLowerCase();
        if (!file) return Promise.reject(new Error('Bạn chưa chọn file nào!'));
        if (ext !== 'zip') return Promise.reject(new Error('File ' + n + ' không hợp lệ!'));
        var xong = function (t) {
            t = String(t);
            if (t.indexOf('Loi System') !== -1) throw new Error(t);
            return t.replace(/\\/g, '\\\\');
        };
        if (demo()) {
            return new Promise(function (ok) { setTimeout(function () { ok(xong('D:\\Deploy\\' + n + '$' + n)); }, 400); });
        }
        var fd = new FormData();
        fd.append(n, file);
        return fetch((S().rootPathUpload || '') + '/Handler/deploycode.ashx', { method: 'POST', body: fd, cache: 'no-store' })
            .then(function (r) { if (!r.ok) throw new Error(r.statusText || ('Máy chủ trả mã ' + r.status)); return r.text(); })
            .then(xong);
    }

    /* ---------------------------------------------------------------------
       SeaGate_CommentSQL + cutbugdata — chép NGUYÊN logic của cutsouresql.js
       (kể cả chỗ lạ: kiểm "--" / "." trên cả MẢNG tham số chứ không phải từng
       phần tử; vị trí "begin" tìm từ ivitrihambatdau của vòng trước). Đây là
       mã sinh ra để GHI ĐÈ package trên CSDL nên phải cho ra đúng chuỗi như gốc.
       Khác gốc duy nhất: cutBug có chốt chặn vòng lặp vô tận khi dòng log là
       dòng cuối không có "\n" (gốc treo trình duyệt).
       --------------------------------------------------------------------- */
    function cutBug(strdata) {
        function cat(key) {
            while (strdata.indexOf(key) !== -1) {
                var iBatDau = strdata.indexOf(key);
                var iKetThuc = strdata.indexOf('\n', iBatDau + 2) + 1;
                if (iKetThuc <= iBatDau) iKetThuc = strdata.length;          // chốt chặn (gốc: lặp mãi)
                var strtemp = strdata.substring(iBatDau, iKetThuc);
                strdata = strdata.replace(strtemp, '');
            }
        }
        cat('insert into bot values');
        cat('vdate_bot varchar2(100)');
        return strdata;
    }

    function commentSQL(strdata) {
        var isoluongrefcur = 0;
        strdata = cutBug(strdata);
        var strOldData = strdata;
        var strdatacheck = strdata.toLowerCase();
        var strPackage = '';
        var ivitripackage = strdatacheck.indexOf('create or replace package ');
        var ivitriketthuc;
        if (ivitripackage > -1 && ivitripackage < 10) {
            ivitripackage += 26;
            if (strdatacheck.indexOf('create or replace package body') !== -1) ivitripackage += 5;
            ivitriketthuc = strdatacheck.indexOf(' ', ivitripackage);
            strPackage = strdatacheck.substring(ivitripackage, ivitriketthuc);
        }
        var ivitrihambatdau, ivitrihamketthuc, iViTriBegin, strTempReplace, strNewData, strFunctionName, arrThamSo, newString, i;

        function vong(tuProc, tuBegin) {
            while (strdata.indexOf(tuProc) !== -1) {
                strdata = strdata.substring(strdata.indexOf(tuProc) + 9);
                iViTriBegin = strdata.indexOf(tuBegin, ivitrihambatdau);
                strTempReplace = strdata.substring(0, iViTriBegin + 5);
                strNewData = cutcomment(strTempReplace);
                ivitrihambatdau = strNewData.indexOf('(');
                ivitrihamketthuc = strNewData.indexOf(')');
                strFunctionName = strNewData.substring(0, ivitrihambatdau).replace(/\n/g, '').replace(/ /g, '');
                arrThamSo = cutcomment(strNewData.substring(ivitrihambatdau + 1, ivitrihamketthuc)).split(',');
                arrThamSo = selectIn(sort(arrThamSo));
                newString = '\n\t\tvdate_bot varchar2(100) := pkg_chung.ChuyenDuLieuNgayThang(sysdate);';
                newString += '\n\tbegin';
                for (i = 0; i < arrThamSo.length; i++) {
                    if (arrThamSo.indexOf('--') !== -1) continue;       // gốc: arrThamSo.includes("--") trên MẢNG
                    if (arrThamSo.indexOf('.') !== -1) continue;
                    newString += "\n\t\tinsert into bot values('" + strPackage + "','" + strFunctionName + "', vdate_bot, '" + arrThamSo[i] + "', " + arrThamSo[i] + ');';
                }
                newString = strdata.substring(0, iViTriBegin) + newString;
                strOldData = strOldData.replace(strTempReplace, newString);
            }
        }
        vong('procedure', 'begin');
        vong('PROCEDURE', 'BEGIN');
        return strOldData;

        function selectIn(arr) {
            var newArr = [];
            for (var k = 0; k < arr.length; k++) {
                if (arr[k].indexOf(' out ') !== -1 || arr[k].indexOf(' OUT ') !== -1) {
                    if (arr[k].indexOf(' IN ') === -1 && arr[k].indexOf(' in ') === -1) continue;
                }
                var strTemp = arr[k].trim();
                while (strTemp[0] === ' ') strTemp = strTemp.substring(1);
                strTemp = strTemp.substring(0, strTemp.indexOf(' '));
                newArr.push(strTemp);
            }
            return newArr;
        }
        function sort(arr) {
            var arrbegin = ['ParamTuKhoa ', 'ParamErr '];
            var arrb = [], arrtemp = [];
            var arrexcept = [' refcur', 'ParamId ', 'TotalPage ', 'TotalItem ', 'ItemPerPage ', 'PageNumber ', 'ParamTrangThai '];
            var a, j;
            for (a = 0; a < arr.length; a++) if (arr[a].indexOf(' refcur') !== -1) isoluongrefcur++;
            for (a = 0; a < arrbegin.length; a++) {
                for (j = 0; j < arr.length; j++) {
                    if (arr[j].indexOf(arrbegin[a]) !== -1) { arrb.unshift(arr[j]); arr.splice(j, 1); break; }
                }
            }
            for (a = 0; a < arrexcept.length; a++) {
                for (j = 0; j < arr.length; j++) {
                    if (arr[j].indexOf(arrexcept[a]) !== -1) { arrtemp.unshift(arr[j]); arr.splice(j, 1); break; }
                }
            }
            return arrb.concat(arr.concat(arrtemp));
        }
        function cutcomment(s) {
            var vt, kt;
            while (s.indexOf('/*') !== -1) {
                vt = s.indexOf('/*');
                kt = s.indexOf('*/', vt) + 2;
                if (kt < vt) break;
                s = s.replace(s.substring(vt, kt), '');
            }
            while (s.indexOf('--') !== -1) {
                vt = s.indexOf('--');
                kt = s.indexOf('\n', vt);
                if (kt < vt) break;
                s = s.replace(s.substring(vt, kt), '');
            }
            return s;
        }
    }

    /* Gộp ô (rowspan) các ô liền nhau có cùng chữ — collageInTable của Corei.
       cot = chỉ số ô trong <tr> (0 = cột Stt của ums.ui.table), theo thứ tự lồng:
       nhóm của cột sau chỉ tính trong nhóm của cột trước. Ô trống không gộp. */
    function gopO(tableEl, cot) {
        if (!tableEl) return;
        var rows = Array.prototype.slice.call(tableEl.querySelectorAll('tbody > tr'));
        if (rows.length < 2) return;
        var cells = rows.map(function (r) { return Array.prototype.slice.call(r.cells); });
        if (cells[0].length <= Math.max.apply(null, cot)) return;          // dòng "không có dữ liệu"
        function txt(r, c) { return cells[r][c] ? cells[r][c].innerHTML : ''; }
        var span = {}, del = {};
        var runs = [[0, rows.length]];
        cot.forEach(function (c) {
            var moi = [];
            runs.forEach(function (run) {
                var i = run[0];
                while (i < run[1]) {
                    var j = i + 1;
                    while (j < run[1] && txt(j, c) === txt(i, c) && txt(i, c) !== '') j++;
                    if (j - i > 1) {
                        span[i + ':' + c] = j - i;
                        for (var k = i + 1; k < j; k++) del[k + ':' + c] = true;
                    }
                    moi.push([i, j]);
                    i = j;
                }
            });
            runs = moi;
        });
        cells.forEach(function (row, r) {
            cot.slice().sort(function (a, b) { return b - a; }).forEach(function (c) {
                if (!row[c]) return;
                if (del[r + ':' + c]) row[c].parentNode.removeChild(row[c]);
                else if (span[r + ':' + c]) row[c].rowSpan = span[r + ':' + c];
            });
        });
    }

    ums.cmsCu = {
        e: e, demo: demo, lsGet: lsGet, lsSet: lsSet, rootPathReport: rootPathReport,
        ghi: ghi, hopPin: hopPin, goiNgoai: goiNgoai, taiZip: taiZip,
        commentSQL: commentSQL, cutBug: cutBug, gopO: gopO
    };
})();
