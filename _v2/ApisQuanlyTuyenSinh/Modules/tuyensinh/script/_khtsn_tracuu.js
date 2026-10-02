/* =========================================================================
   ums.khtsn.moTraCuu() — hộp "Tra cứu người học" (bản gốc: modal #tra-cuu-nguoi-hoc, traCuu_* / _tc*)
   ---------------------------------------------------------------------------
   Tìm trên TOÀN hệ thống theo họ tên / số CCCD / mã lớp, gộp ba nguồn như gốc:
     · Hồ sơ tuyển sinh: PKG_CORE_TS_HOSO.LayDS_HoSo_TS (pageSize 200) — thử lần lượt các kiểu viết hoa/thường
       của từ khoá (proc so khớp phân biệt hoa thường), dừng ở kiểu đầu tiên có kết quả.
     · Người học: PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc_All (dBoQuaPhamVi 1) + pkg_hosohocvien.LayDanhSachHoSoNhieuNganh (tìm tên đúng hơn).
     · Theo lớp quản lý: từ khoá không có dấu cách → khớp mã / tên lớp (LayDSKS_DaoTao_LopQuanLy), tối đa 3 lớp,
       mỗi lớp hỏi LayDanhSachHoSoNhieuNganh theo strLopQuanLy_Id rồi soát lại đúng lớp.
   Nguyện vọng đầu ra → kế hoạch / đợt: Pr_Ts_Kh_Dau_Ra_Get_Ds (toàn bộ, dIs_Active 1), một lần mỗi phiên.
   Như gốc: mỗi bản ghi một dòng (không gộp theo người); bỏ dòng "chưa gắn quá trình học" khi người đó có dòng khác;
   dòng người học được tra bổ sung CCCD / giới tính / SĐT / hồ sơ TS (6 luồng, chỉ dòng trên trang đang xem) và
   ẨN khi tra xong mà không có hồ sơ tuyển sinh; "Mở hồ sơ" → hộp Kết quả đăng ký của kế hoạch / đợt đó, mở luôn biểu mẫu Sửa.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, T = ums.khtsn, P = T.phu;
    var TT = { TRUNGTUYEN: 'Trúng tuyển', KHONGTRUNGTUYEN: 'Không trúng tuyển', CHOXETTUYEN: 'Chờ xét tuyển', DA_TIEPNHAN: 'Đã tiếp nhận',
        CHUA_TIEPNHAN: 'Chưa tiếp nhận', DA_NOPHOSO: 'Đã nộp hồ sơ', MOI: 'Mới tạo', HUY: 'Đã hủy' };
    var drMap = null, info = {};

    function bienThe(kw) {
        var out = [];
        [kw, String(kw).toLowerCase().replace(/(^|\s)(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }), String(kw).toUpperCase(), String(kw).toLowerCase()]
            .forEach(function (s) { s = String(s || '').trim(); if (s && out.indexOf(s) < 0) out.push(s); });
        return out;
    }
    function timHoSo(kw, size) {
        var ds = bienThe(kw), i = 0;
        return (function thu() {
            if (i >= ds.length) return Promise.resolve([]);
            var o = P.dsHoSoTS({ tuKhoa: ds[i++], pageSize: size || 200 });
            o.silent = true;
            return ums.api.call(o).then(T.rows, function () { return []; }).then(function (rows) { return rows.length || i >= ds.length ? rows : thu(); });
        })();
    }
    function dauRa() {
        if (drMap) return Promise.resolve(drMap);
        return T.dauRaMap('').then(function (m) { drMap = m || {}; return drMap; });
    }
    function theoLop(kw) {
        if (/\s/.test(kw)) return Promise.resolve([]);
        return P.lopQL().then(function (map) {
            var k = kw.toLowerCase(), ids = [];
            Object.keys(map || {}).forEach(function (id) {
                var o = map[id] || {}, ma = String(o.ma || '').toLowerCase(), ten = String(o.ten || '').toLowerCase();
                if (ma === k || ten === k) ids.unshift(id); else if (ma.indexOf(k) >= 0 || ten.indexOf(k) >= 0) ids.push(id);
            });
            return Promise.all(ids.slice(0, 3).map(function (id) {
                return P.qltb({ strLopQuanLy_Id: id }).then(function (rows) {
                    return (rows || []).filter(function (r) { return String(r.DAOTAO_LOPQUANLY_ID || r.LOPQUANLY_ID || '') === String(id); });
                }, function () { return []; });
            })).then(function (a) { return [].concat.apply([], a); });
        }, function () { return []; });
    }

    T.moTraCuu = function () {
        var S = { ds: [], page: 1, size: 50, kw: '', chay: false };
        var dlg = ui.dialog({
            title: 'Tra cứu người học', icon: 'fa-magnifying-glass', size: 'xl',
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2">Tìm trên toàn hệ thống theo <b>họ tên</b>, <b>số CCCD</b> hoặc <b>mã lớp quản lý</b> — ' +
                    'gồm cả hồ sơ tuyển sinh và người học đang học.</div>' +
                '<div class="ums-searchbar"><input class="ums-input" data-tc="kw" placeholder="Họ tên / số CCCD / mã lớp (ít nhất 2 ký tự)" autocomplete="off">' +
                    '<div class="ums-inputwrap"><input class="ums-input" data-tc="ns" data-date placeholder="Ngày sinh (không bắt buộc)" autocomplete="off"><i class="fa-light fa-calendar"></i></div>' +
                    ui.btn('search', { text: 'Tra cứu', attr: { 'data-tc': 'tim' } }) +
                    ui.btn('reload', { text: 'Nhập lại', mod: 'ghost', icon: 'fa-rotate-left', attr: { 'data-tc': 'xoa' } }) + '</div>' +
                '<div class="ums-u-fz13 ums-u-mt-2 ums-u-mb-2" data-tc="tong"></div><div data-tc="bang"></div>'
        });
        var b = dlg.body, q = function (k) { return b.querySelector('[data-tc="' + k + '"]'); };
        ui.enhance(b);
        setTimeout(function () { q('kw').focus(); }, 200);
        veRong('Nhập họ tên, số CCCD hoặc mã lớp rồi bấm Tra cứu.');

        function veRong(m) { q('bang').innerHTML = ui.empty(m, 'fa-magnifying-glass'); }
        function tim() {
            var kw = String(q('kw').value || '').trim();
            if (kw.length < 2) { ui.toast('Nhập ít nhất 2 ký tự (họ tên hoặc số CCCD) rồi tra cứu.', 'warn'); return; }
            if (S.chay) return;
            S.chay = true; S.kw = kw;
            q('tong').textContent = '';
            q('bang').innerHTML = ui.empty('Đang tìm trên toàn hệ thống…', 'fa-spinner fa-spin');
            dauRa().then(function () {
                return Promise.all([
                    timHoSo(kw),
                    P.nguoiHocAll({ strTuKhoa: kw }, true).catch(function () { return []; }),
                    P.qltb({ strTuKhoa: kw }).catch(function () { return []; }),
                    theoLop(kw), T.napMapDM(T.DM.GIOITINH).catch(function () {})
                ]);
            }).then(function (x) {
                var daCo = {}, nh = [];
                x[1].concat(x[2], x[3]).forEach(function (r) {
                    var k = (r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || '') + '|' + (r.STUDY_ID || r.TRACK_ID || r.DAOTAO_LOPQUANLY_ID || '');
                    if (daCo[k]) return; daCo[k] = 1; nh.push(r);
                });
                gop(x[0], nh);
                S.page = 1; ve();
                if (x[0].length) P.ensureLop(x[0]).then(function (coMoi) { if (coMoi) { gop(x[0], nh); ve(); } }, function () {});
            }).catch(function (err) { ums.api.handle(err, 'Tra cứu người học'); veRong('Tra cứu lỗi — thử lại.'); })
                .then(function () { S.chay = false; });
        }
        function gop(rowsTS, rowsNH) {
            var ngayLoc = T.ngayUI(String(q('ns').value || '').trim()), hop = function (ns) { return !ngayLoc || T.ngayUI(ns) === ngayLoc; };
            var lopNg = {};
            rowsNH.forEach(function (r) {
                var pid = r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || '', lop = r.DAOTAO_LOPQUANLY_TEN || r.LOPQUANLY_TEN || r.DAOTAO_LOPQUANLY_N1_TEN || r.DAOTAO_LOPQUANLY_MA || r.LOPQUANLY_MA || '';
                if (pid && lop && !lopNg[pid]) lopNg[pid] = lop;
            });
            var ds = [];
            rowsTS.forEach(function (r) {
                var ns = T.pick(r, ['COREPERSON_NGAYSINH']); if (!hop(ns)) return;
                var dr = drMap[T.pick(r, ['NGUYENVONG_DAURA_ID'])] || {}, pid = T.pick(r, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID']);
                ds.push({ loai: 'TS', personId: pid, hoTen: T.pick(r, ['COREPERSON_HOTEN']), ngaySinh: ns,
                    gioiTinh: T.tenDM(T.DM.GIOITINH, T.pick(r, ['COREPERSON_GIOITINH_ID'])), cccd: T.pick(r, ['PERSONIDEN_SOCCCD']),
                    dienThoai: T.pick(r, ['PERSONCONTACT_DIENTHOAI']), hosoId: T.pick(r, ['HOSO_ID']), khId: dr.khId || '', dotId: dr.dotId || '',
                    lop: lopNg[pid] || P.lopCua(r) || '',
                    noi: dr.khTen ? '<b>Tuyển sinh</b><br><span class="khtsn-phu">' + ui.esc(dr.khTen) + (dr.dotTen ? ' — đợt ' + ui.esc(dr.dotTen) : '') + '</span>' +
                        (dr.heTen || dr.nganhTen ? '<br><span class="khtsn-phu">' + ui.esc(dr.heTen) + (dr.nganhTen ? ' • ' + ui.esc(dr.nganhTen) : '') + '</span>' : '')
                        : '<b>Tuyển sinh</b><br><span class="khtsn-phu">chưa xác định được kế hoạch/đợt</span>',
                    trangThai: [T.pick(r, ['HOSO_KETQUA']), T.pick(r, ['HOSO_STATUS'])].filter(Boolean).map(function (x) { return TT[String(x).trim().toUpperCase()] || x; }).join(' · ') });
            });
            rowsNH.forEach(function (r) {
                var ns = r.NGAYSINH || r.DATE_OF_BIRTH || r.QLSV_NGUOIHOC_NGAYSINH || ''; if (!hop(ns)) return;
                var he = r.DAOTAO_HEDAOTAO_TEN || r.TENHEDAOTAO || '', khoa = r.DAOTAO_KHOADAOTAO_TEN || r.KHOAHOC_N1_TEN || '',
                    lop = r.DAOTAO_LOPQUANLY_TEN || r.LOPQUANLY_TEN || '', nganh = r.DAOTAO_CHUONGTRINH_TEN || r.NGANHHOC_N1_TEN || r.TENCHUONGTRINH || '';
                var coHoc = !!(he || khoa || lop || nganh);
                ds.push({ loai: 'NH', chuaGan: !coHoc, personId: r.PERSON_ID || r.QLSV_NGUOIHOC_ID || r.ID || '',
                    hoTen: r.FULL_NAME || ((r.HODEM || '') + ' ' + (r.TEN || '')).trim(), ngaySinh: ns, gioiTinh: r.GIOITINH_TEN || '',
                    cccd: r.DINHDANH_CHINH_SO || '', dienThoai: r.SODIENTHOAI_CANHAN || r.SODIENTHOAI_GIADINH || '',
                    maSV: r.MASO || r.MA_NGUOIHOC_CHINH || r.QLSV_NGUOIHOC_MASO || '', lop: lop,
                    noi: coHoc ? '<b>Đang học</b><br><span class="khtsn-phu">' + ui.esc(he) + (khoa ? ' • khóa ' + ui.esc(khoa) : '') + '</span>' +
                        (nganh ? '<br><span class="khtsn-phu">' + ui.esc(nganh) + '</span>' : '')
                        : '<b>Hồ sơ người học</b><br><span class="khtsn-phu">chưa gắn quá trình học (chưa phân lớp)</span>',
                    trangThai: r.QLSV_TRANGTHAINGUOIHOC_TEN || r.STUDY_STATUS_TEN || '' });
            });
            var khoaNg = function (x) { return x.personId || x.cccd || (x.hoTen + '|' + x.ngaySinh); }, co = {};
            ds.forEach(function (x) { if (!x.chuaGan) co[khoaNg(x)] = 1; });
            S.soAnGan = 0;
            ds = ds.filter(function (x) { if (x.chuaGan && co[khoaNg(x)]) { S.soAnGan++; return false; } return true; });
            ds.sort(function (a, c) { var n = String(a.hoTen || '').localeCompare(String(c.hoTen || ''), 'vi'); return n || (a.loai === c.loai ? 0 : a.loai === 'TS' ? -1 : 1); });
            S.ds = ds;
        }
        function ve() {
            var soAn = 0;
            var ds = S.ds.filter(function (x) {
                if (x.loai === 'TS' || x.hosoId) return true;
                var bs = x.personId ? info[x.personId] : null;
                if (bs && !bs.hosoId) { soAn++; return false; }
                return true;
            });
            var soTS = ds.filter(function (x) { return x.loai === 'TS'; }).length;
            q('tong').textContent = ds.length ? ds.length + ' kết quả — ' + soTS + ' hồ sơ tuyển sinh, ' + (ds.length - soTS) + ' người học' +
                (S.soAnGan ? ' (ẩn ' + S.soAnGan + ' dòng chưa gắn quá trình học)' : '') + (soAn ? ' (ẩn ' + soAn + ' em không có hồ sơ tuyển sinh)' : '') : '';
            if (!ds.length) {
                veRong(soAn ? 'Tìm thấy ' + soAn + ' em nhưng không em nào có hồ sơ tuyển sinh nên đã ẩn hết.'
                    : 'Không tìm thấy ai khớp với "' + S.kw + '". Thử bỏ bớt dấu, nhập họ tên ngắn hơn, hoặc tra bằng số CCCD.');
                return;
            }
            var tr = Math.max(1, Math.ceil(ds.length / S.size)); if (S.page > tr) S.page = tr;
            var view = ds.slice((S.page - 1) * S.size, S.page * S.size);
            view.forEach(function (x) {
                var bs = x.personId ? info[x.personId] : null;
                if (!bs) return;
                x.cccd = x.cccd || bs.cccd; x.gioiTinh = x.gioiTinh || bs.gioiTinh; x.dienThoai = x.dienThoai || bs.dienThoai;
                if (!x.hosoId) { x.hosoId = bs.hosoId; x.khId = bs.khId; x.dotId = bs.dotId; }
            });
            ui.table({ el: q('bang'), rows: view, stt: true,
                columns: [
                    { title: 'Họ và tên', render: function (x) {
                        return '<span class="khtsn-cham khtsn-cham--' + (x.loai === 'TS' ? 'ts' : 'nh') + '"></span><b>' + ui.esc(x.hoTen) + '</b>' +
                            (x.maSV ? '<br><span class="khtsn-phu">Mã SV: ' + ui.esc(x.maSV) + '</span>' : ''); } },
                    { title: 'Ngày sinh', cls: 'is-center is-nowrap', render: function (x) { return ui.esc(T.ngayUI(x.ngaySinh) || x.ngaySinh); } },
                    { title: 'Giới tính', cls: 'is-center', prop: 'gioiTinh' },
                    { title: 'CCCD', cls: 'is-center', prop: 'cccd' },
                    { title: 'Điện thoại', cls: 'is-center', prop: 'dienThoai' },
                    { title: 'Đang ở đâu', render: function (x) { return x.noi; } },
                    { title: 'Lớp quản lý', cls: 'is-center', render: function (x) { return x.lop ? '<b>' + ui.esc(x.lop) + '</b>' : '<span class="khtsn-phu">Chưa phân lớp</span>'; } },
                    { title: 'Trạng thái', cls: 'is-center', render: function (x) { return '<span class="khtsn-phu">' + ui.esc(x.trangThai) + '</span>'; } },
                    { title: 'Thao tác', cls: 'is-center', render: function (x) {
                        if (x.hosoId && x.khId) return ui.btn('view', { text: 'Mở hồ sơ', cls: 'ums-btn--sm', attr: { 'data-tc': 'mo', 'data-hoso': x.hosoId, 'data-kh': x.khId, 'data-dot': x.dotId } });
                        return x.personId && !(x.personId in info) ? '<i class="fa-light fa-spinner fa-spin khtsn-phu" title="Đang tra hồ sơ tuyển sinh…"></i>' : ''; } }
                ],
                page: { index: S.page, size: S.size, total: ds.length, sizes: [25, 50, 100, 200],
                    onChange: function (p) { S.page = p; ve(); }, onSize: function (v) { S.size = Number(v) || 50; S.page = 1; ve(); } }
            });
            boSung(view);
        }
        function boSung(rows) {
            var can = [];
            rows.forEach(function (x) {
                if (x.loai === 'TS' || x.hosoId || !x.personId || !x.hoTen || (x.personId in info)) return;
                if (can.some(function (y) { return y.personId === x.personId; })) return;
                can.push(x);
            });
            if (!can.length) return;
            T.hangDoi(can.map(function (it) {
                return function () {
                    return timHoSo(it.hoTen, 50).then(function (rs) {
                        var hit = rs.filter(function (r) { return String(T.pick(r, ['COREPERSON_ID', 'CORE_PERSON_ID', 'PERSON_ID'])) === String(it.personId); })[0] ||
                            rs.filter(function (r) { return String(T.pick(r, ['COREPERSON_HOTEN'])).trim() === String(it.hoTen).trim() && T.ngayUI(T.pick(r, ['COREPERSON_NGAYSINH'])) === T.ngayUI(it.ngaySinh); })[0];
                        var dr = hit ? (drMap[T.pick(hit, ['NGUYENVONG_DAURA_ID'])] || {}) : {};
                        info[it.personId] = hit ? { cccd: T.pick(hit, ['PERSONIDEN_SOCCCD']), gioiTinh: T.tenDM(T.DM.GIOITINH, T.pick(hit, ['COREPERSON_GIOITINH_ID'])),
                            dienThoai: T.pick(hit, ['PERSONCONTACT_DIENTHOAI']), hosoId: T.pick(hit, ['HOSO_ID']), khId: dr.khId || '', dotId: dr.dotId || '' }
                            : { cccd: '', gioiTinh: '', dienThoai: '', hosoId: '', khId: '', dotId: '' };
                    });
                };
            }), 6).then(function () { if (document.body.contains(b)) ve(); });
        }

        b.addEventListener('click', function (ev) {
            var x = ev.target.closest('button[data-tc]');
            if (!x) return;
            var k = x.getAttribute('data-tc');
            if (k === 'tim') tim();
            else if (k === 'xoa') { q('kw').value = ''; q('ns').value = ''; if (q('ns')._flatpickr) q('ns')._flatpickr.clear(); q('tong').textContent = ''; S.ds = []; veRong('Nhập họ tên, số CCCD hoặc mã lớp rồi bấm Tra cứu.'); q('kw').focus(); }
            else if (k === 'mo') {
                var khId = x.getAttribute('data-kh');
                var kh = (T.S.dtKH || []).filter(function (r) { return String(T.id(r)) === String(khId); })[0] || { ID: khId };
                dlg.close();
                setTimeout(function () { T.moKQDK({ kh: kh, dot: x.getAttribute('data-dot') || '', mode: 'list', moHoSo: x.getAttribute('data-hoso') }); }, 50);
            }
        });
        q('kw').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
    };
})();
