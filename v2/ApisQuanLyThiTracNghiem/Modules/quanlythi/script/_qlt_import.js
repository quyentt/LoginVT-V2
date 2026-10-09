/* =========================================================================
   _qlt_import.js — hai đường NHẬP của màn "Quản lý thi" (Quản lý thi trắc nghiệm): ums.qlt.importPhong / importTS / ketQuaImport / xemTSPhong
   Bản gốc: quanlythi.html #zoneImportPhongThi (+ #zoneImportPhongThi_SinhVien), #myModal_Upload + #zoneImport và các hàm getList_dropSearch_*,
   getList_ImportPhongThi, DongBoDuLieuPhongThi, getList_PhongThiImport_ThiSinh*, import_DMIP, genTable_Import_View của quanlythi.js.
   ---------------------------------------------------------------------------
   Lời gọi (GET trừ khi ghi POST; tham số chép nguyên — các lời gọi TP_Chung / LayDanhSach_DotThi / LayDS_DSThiTheoDotThi KHÔNG có versionAPI):
     TP_Chung/LayThoiGian            strNguoiThucHien_Id → ID, THOIGIAN
     TP_Chung/LayLoaiDiem            strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id → ID, TEN
     TP_Chung/LayHinhThucThi         strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id → ID, TEN
     QLTTN_QuanLyThi/LayDanhSach_DotThi   strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id → ID, TEN
     TP_Chung/LayHocPhan             strDotThi_Id, strHinhThucThi_Id, strDiem_ThanhPhanDiem_Id, strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id → ID, TEN
     QLTTN_QuanLyThi/LayDS_DSThiTheoDotThi   strThi_DotThi_Id, strDaoTao_HocPhan_Id, strHinhThucThi_Id, strLoaiDiem_Id, strNguoiThucHien_Id, PageNumber, ItemPerPage
                                     → ID, MADANHSACHTHI, NGAYTHI, THI_CATHI_TEN, TKB_PHONGTHI_TEN, SOLUONGTHISINHDUDIEUKIENDUTHI, SOLUONGTSDAIMPORT
     QLTTN_QuanLyThi/DongBoDuLieuPhongThi (POST, versionAPI)  strId, strMatKhauChoPhongThi, strCachTinhDiem THEOSOY | THEOSOCAU, ChoPhepXemDiem, ChoPhepXemKetQuaTraLoi,
                                     strExamScheduleId (đợt thi đang lọc), strDepartOrganId (đơn vị đang lọc), strGroupQuestionId, strNguoiThucHien_Id
     QLTTN_QuanLyThi/LayDS_PhongThiTSDaImport · LayDS_PhongThiTSChuaImport (versionAPI)  strPhongThiId, strNguoiDung_Id, PageNumber, ItemPerPage
                                     → MATHISINH, HODEM, TEN, NGAYSINH, CLASSNAME, SOBAODANH, DATHI (chỉ "đã import")
     QLTTN_QuanLyThi/Import_StudentExamRoom (versionAPI)  strExamRoomInfoId, strMatKhauChoPhongThi, NguoiThucHien_Id, strPath → Data { Table1 lỗi, Table2 thành công }, Message
     SYS_Report/ThemMoi — tải file mẫu TEMPLATE_DANHSACHTHISINH (ums.qlt.baoCao)
   Khác gốc / lỗi gốc đã sửa:
     · Năm ô lọc Thời gian → Loại điểm → Hình thức → Đợt thi → Môn thi nối tầng cha → con (gốc nạp lại mọi tầng dưới mỗi lần đổi).
     · Ô "Nhập từ khóa tìm kiếm" của khung Import phòng thi gốc KHÔNG được gửi đi → bỏ; hai vùng mẫu báo cáo #zonebtnBaoCao_NhapDiem(_Import)
       gốc không nơi nào nạp → bỏ.
     · "Thêm phòng thi": gốc biến strCachTinhDiem không đặt lại giữa các dòng (một dòng đánh dấu "theo số câu" kéo mọi dòng sau theo) → tính
       từng dòng; strGroupQuestionId gốc gửi biến chưa từng gán → ''. Hỏi lại trước khi đồng bộ, chạy hàng loạt có tiến độ, xong nạp lại.
     · Import DS thí sinh là hộp thoại (nhập từ tệp = việc phụ); kết quả hai tab thay chỗ khung chi tiết (như gốc #zoneImport).
     · Tiêu đề khung gốc "Chi tiết Phòng thi" (chép nhầm) → "Import phòng thi".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi, Q = ums.qlt;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }

    /** o = { host, dv: { id, ten }, dot: { id, ten }, sau() } */
    Q.importPhong = function (o) {
        var el = document.createElement('div');
        el.innerHTML =
            '<div class="ums-grid ums-grid--2 qlt-kvdau ums-u-mb-4">' + P.kv('Đơn vị', e(o.dv.ten)) + P.kv('Đợt thi', e(o.dot.ten)) + '</div>' +
            pat.filterBar([
                { key: 'tg', type: 'select', label: '--Chọn thời gian--' }, { key: 'ld', type: 'select', label: '--Chọn loại điểm--' },
                { key: 'ht', type: 'select', label: '--Chọn hình thức--' }, { key: 'dot', type: 'select', label: '--Chọn đợt thi--' },
                { key: 'mon', type: 'select', label: '--Chọn môn thi--' }
            ], { extra: '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Thêm phòng thi', attr: { 'data-q': 'them' } }) + '</div>' }) +
            pat.panel({ title: 'Danh sách thi theo đợt', icon: 'fa-list-check', count: 'n', flush: true, zone: 'bang' });
        var f = pat.formTrang({ host: o.host, title: 'Import phòng thi', icon: 'fa-file-import', cols: 1, body: el });
        function q(k) { return el.querySelector('[data-f="' + k + '"]'); }
        var tg = q('tg'), ld = q('ld'), ht = q('ht'), dot = q('dot'), mon = q('mon');
        var bang = el.querySelector('[data-z="bang"]'), dem = el.querySelector('[data-z="n"]');
        var st = { page: 1, size: 10, rows: [] };
        var uid = P.uid();
        bang.innerHTML = ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass');

        g('TP_Chung/LayThoiGian', { strNguoiThucHien_Id: uid }).then(function (r) { pat.fill(tg, arr(r.data), { name: 'THOIGIAN', head: '--Chọn thời gian--' }); })
            .catch(function (err) { ums.api.handle(err, 'thời gian'); });
        if (window.jQuery) {
            jQuery(tg).on('select2:select', function () {
                if (!tg.value) return;
                g('TP_Chung/LayLoaiDiem', { strDaoTao_ThoiGianDaoTao_Id: tg.value, strNguoiThucHien_Id: uid }).then(function (r) { pat.fill(ld, arr(r.data), { name: 'TEN', head: '--Chọn loại điểm--' }); })
                    .catch(function (err) { ums.api.handle(err, 'loại điểm'); });
            });
            jQuery(ld).on('select2:select', function () {
                if (!ld.value) return;
                g('TP_Chung/LayHinhThucThi', { strDiem_ThanhPhanDiem_Id: ld.value, strDaoTao_ThoiGianDaoTao_Id: tg.value, strNguoiThucHien_Id: uid })
                    .then(function (r) { pat.fill(ht, arr(r.data), { name: 'TEN', head: '--Chọn hình thức--' }); }).catch(function (err) { ums.api.handle(err, 'hình thức thi'); });
            });
            jQuery(ht).on('select2:select', function () {
                if (!ht.value) return;
                g(QL + 'LayDanhSach_DotThi', { strHinhThucThi_Id: ht.value, strDiem_ThanhPhanDiem_Id: ld.value, strDaoTao_ThoiGianDaoTao_Id: tg.value, strNguoiThucHien_Id: uid })
                    .then(function (r) { pat.fill(dot, arr(r.data), { name: 'TEN', head: '--Chọn đợt thi--' }); }).catch(function (err) { ums.api.handle(err, 'đợt thi'); });
            });
            jQuery(dot).on('select2:select', function () {
                if (!dot.value) return;
                g('TP_Chung/LayHocPhan', { strDotThi_Id: dot.value, strHinhThucThi_Id: ht.value, strDiem_ThanhPhanDiem_Id: ld.value, strDaoTao_ThoiGianDaoTao_Id: tg.value, strNguoiThucHien_Id: uid })
                    .then(function (r) { pat.fill(mon, arr(r.data), { name: 'TEN', head: '--Chọn môn thi--' }); }).catch(function (err) { ums.api.handle(err, 'môn thi'); });
            });
        }
        pat.chain([tg, ld, ht, dot, mon]);

        function lk(r, t) { return '<button type="button" class="ct-tenlink" data-xem="' + esc(e(r.ID)) + '" title="Thông tin thí sinh phòng thi">' + esc(e(t)) + '</button>'; }
        function ck(r, cot) { return '<input type="checkbox" data-cot="' + cot + '" data-id="' + esc(e(r.ID)) + '">'; }
        function ve() {
            ui.table({
                el: bang, rows: st.rows, empty: 'Không có danh sách thi', columns: [
                    { title: 'Mã DS Thi', cls: 'is-nowrap', render: function (r) { return lk(r, r.MADANHSACHTHI); } },
                    { title: 'Ngày thi', cls: 'is-center is-nowrap', render: function (r) { return lk(r, r.NGAYTHI); } },
                    { title: 'Ca thi', cls: 'is-center', render: function (r) { return lk(r, r.THI_CATHI_TEN); } },
                    { title: 'Phòng thi', render: function (r) { return lk(r, r.TKB_PHONGTHI_TEN); } },
                    { title: 'SLTS đủ ĐK thi', cls: 'is-center', render: function (r) { return lk(r, r.SOLUONGTHISINHDUDIEUKIENDUTHI); } },
                    { title: 'SLTS đã import', cls: 'is-center', render: function (r) { return lk(r, r.SOLUONGTSDAIMPORT); } },
                    { title: 'Mật khẩu phòng thi', cls: 'is-center', width: '150px', render: function (r) { return '<input class="ums-input ums-input--sm" data-mk="' + esc(e(r.ID)) + '" autocomplete="off">'; } },
                    { head: 'Cách tính điểm theo số câu<br><span class="ums-u-faint ums-u-fz12">(Không check là theo số ý)</span><br><input type="checkbox" data-cotall="socau" title="Đánh dấu cả cột">', cls: 'is-center', render: function (r) { return ck(r, 'socau'); } },
                    { head: 'Cho phép xem điểm<br><input type="checkbox" data-cotall="xd" title="Đánh dấu cả cột">', cls: 'is-center', render: function (r) { return ck(r, 'xd'); } },
                    { head: 'Cho phép xem kết quả<br><input type="checkbox" data-cotall="xkq" title="Đánh dấu cả cột">', cls: 'is-center', render: function (r) { return ck(r, 'xkq'); } },
                    P.cotChon()
                ],
                page: { index: st.page, size: st.size, total: st.tong, onChange: tai, onSize: function (s) { st.size = s; tai(1); } }
            });
            dem.textContent = st.tong ? '(' + st.tong + ')' : '';
        }
        function tai(p) {
            if (p) st.page = p;
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(QL + 'LayDS_DSThiTheoDotThi', { strThi_DotThi_Id: dot.value, strDaoTao_HocPhan_Id: mon.value, strHinhThucThi_Id: ht.value, strLoaiDiem_Id: ld.value,
                strNguoiThucHien_Id: uid, PageNumber: st.page, ItemPerPage: st.size }).then(function (r) {
                st.rows = arr(r.data); st.tong = Number(r.pager) || st.rows.length;
                ve();
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thi theo đợt'); });
        }
        function them() {
            var ids = P.daChon(bang);
            if (!ids.length) { ui.toast('Bạn chưa chọn phòng thi', 'warn'); return; }
            function o1(sel, id) { return bang.querySelector(sel + '[data-id="' + id + '"]'); }
            ui.confirm('Đưa ' + ids.length + ' danh sách thi đã chọn vào phòng thi của đợt "' + e(o.dot.ten) + '"?', { title: 'Thêm phòng thi', ok: 'Thêm phòng thi' }).then(function (yes) {
                if (!yes) return;
                return ui.batch(ids.map(function (id) {
                    var mk = bang.querySelector('input[data-mk="' + id + '"]');
                    return { action: QL + 'DongBoDuLieuPhongThi', method: 'POST', versionAPI: V, strId: id, strMatKhauChoPhongThi: mk ? mk.value.trim() : '',
                        strCachTinhDiem: o1('input[data-cot="socau"]', id).checked ? 'THEOSOCAU' : 'THEOSOY',
                        ChoPhepXemDiem: o1('input[data-cot="xd"]', id).checked ? '1' : '0', ChoPhepXemKetQuaTraLoi: o1('input[data-cot="xkq"]', id).checked ? '1' : '0',
                        strExamScheduleId: e(o.dot.id), strDepartOrganId: e(o.dv.id), strGroupQuestionId: '', strNguoiThucHien_Id: uid };
                }), { title: 'Đang thêm phòng thi', okText: 'Thực hiện thành công' }).then(function () { tai(); if (o.sau) o.sau(); });
            });
        }
        P.ganChonTatCa(el);
        el.addEventListener('change', function (ev) {
            var t = ev.target, cot = t.getAttribute && t.getAttribute('data-cotall');
            if (!cot) return;
            Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-cot="' + cot + '"]'), function (c) { c.checked = t.checked; });
        });
        el.addEventListener('click', function (ev) {
            var khung = ev.target.closest('.ums-formtrang');
            if (khung && khung !== f.el) return;    // nút của khung thí sinh (tầng hai) đang mở trong el — không phải của khung này
            var x = ev.target.closest('[data-xem]');
            if (x) { var r = st.rows.filter(function (y) { return e(y.ID) === x.getAttribute('data-xem'); })[0]; Q.xemTSPhong({ host: el, id: x.getAttribute('data-xem'), ten: r ? e(r.TKB_PHONGTHI_TEN) : '' }); return; }
            var a = ev.target.closest('[data-a="search"]');
            if (a) { tai(1); return; }
            var b = ev.target.closest('[data-q="them"]');
            if (b) them();
        });
        return f;
    };

    /** Hai tab thí sinh đã / chưa đưa vào phòng thi của một danh sách thi. o = { host, id, ten } */
    Q.xemTSPhong = function (o) {
        var el = document.createElement('div');
        el.innerHTML = ui.tabs([{ key: 'da', text: 'Danh sách thí sinh đã đưa vào phòng thi', icon: 'fa-user-check' },
            { key: 'chua', text: 'Danh sách thí sinh chưa đưa vào phòng thi', icon: 'fa-user-clock' }], 'da', 'data-qtab2') +
            '<div class="ums-u-mt-4" data-q="da"></div><div class="ums-u-mt-4" data-q="chua" hidden></div>';
        var f = pat.formTrang({ host: o.host, title: 'Thông tin thí sinh phòng thi' + (o.ten ? ' — ' + o.ten : ''), icon: 'fa-users', cols: 1, body: el });
        function tab(k, action, daThi) {
            var z = el.querySelector('[data-q="' + k + '"]'), nhan = el.querySelector('[data-qtab2="' + k + '"]'), st = { page: 1, size: 10 };
            var dem = document.createElement('span'); dem.className = 'ums-u-faint'; nhan.appendChild(dem);
            function tai(p) {
                if (p) st.page = p;
                z.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                g(QL + action, { versionAPI: V, strPhongThiId: o.id, strNguoiDung_Id: P.uid(), PageNumber: st.page, ItemPerPage: st.size }).then(function (r) {
                    var rows = arr(r.data), tong = Number(r.pager) || rows.length;
                    dem.textContent = ' (' + tong + ')';
                    var cols = [
                        { title: 'Mã Thí sinh', prop: 'MATHISINH', cls: 'is-center is-nowrap' }, { title: 'Họ đệm', prop: 'HODEM' }, { title: 'Tên', prop: 'TEN' },
                        { title: 'Ngày sinh', prop: 'NGAYSINH', cls: 'is-center is-nowrap' }, { title: 'Lớp', prop: 'CLASSNAME', cls: 'is-center' }, { title: 'Số báo danh', prop: 'SOBAODANH', cls: 'is-center' }
                    ];
                    if (daThi) cols.push({ title: 'Tình trạng thi', cls: 'is-center', render: function (r) { return e(r.DATHI) === '0' ? ui.badge('Chưa thi', 'mute') : ui.badge('Đã thi', 'ok'); } });
                    ui.table({ el: z, rows: rows, empty: 'Không có thí sinh', columns: cols,
                        page: { index: st.page, size: st.size, total: tong, onChange: tai, onSize: function (s) { st.size = s; tai(1); } } });
                }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thí sinh phòng thi'); });
            }
            tai(1);
        }
        tab('da', 'LayDS_PhongThiTSDaImport', true);
        tab('chua', 'LayDS_PhongThiTSChuaImport', false);
        el.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-qtab2]'); if (!a) return;
            var k = a.getAttribute('data-qtab2');
            ui.tabsActive(el, k, 'data-qtab2');
            el.querySelector('[data-q="da"]').hidden = k !== 'da';
            el.querySelector('[data-q="chua"]').hidden = k !== 'chua';
        });
        return f;
    };

    /** Hộp "Import dữ liệu" danh sách thí sinh của một phòng. o = { room, sau(kq) } — kq = { ok, loi, message } */
    Q.importTS = function (o) {
        var body = document.createElement('div');
        body.innerHTML = ui.field('- Chọn file Import', ui.file({ key: 'tep', accept: '.xls,.xlsx' })) + '<div class="ums-u-faint ums-u-fz13" data-q="bao"></div>';
        var bao = body.querySelector('[data-q="bao"]');
        return ui.dialog({
            title: 'Import dữ liệu', icon: 'fa-file-excel', size: 'md', body: body,
            buttons: [
                { text: 'Tải file mẫu', kind: 'excel', icon: 'fa-download', keepOpen: true, onClick: function () {
                    Q.baoCao('TEMPLATE_DANHSACHTHISINH', { roomId: e(o.room.ID), partId: '', roomIds: [] });
                    return false;
                } },
                { text: 'Import dữ liệu file Excel', kind: 'importer', keepOpen: true, onClick: function (api) {
                    var inp = body.querySelector('input[type="file"]'), tep = inp && inp.files && inp.files[0];
                    if (!tep) { ui.toast('Bạn chưa chọn file nào!', 'warn'); return false; }
                    ui.confirm('Nhập danh sách thí sinh từ tệp "' + tep.name + '" vào phòng ' + e(o.room.ROOMNAME) + '?', { title: 'Import dữ liệu' }).then(function (yes) {
                        if (!yes) return;
                        bao.textContent = 'Đang tải tệp lên…';
                        return ums.upload(tep).then(function (duong) {
                            bao.textContent = 'Đang nhập…';
                            return g(QL + 'Import_StudentExamRoom', { versionAPI: V, strExamRoomInfoId: e(o.room.ID), strMatKhauChoPhongThi: e(o.room.MATKHAUCHOPHONGTHI),
                                NguoiThucHien_Id: P.uid(), strPath: duong });
                        }).then(function (r) {
                            var d = r.data || {};
                            api.close();
                            ui.toast('Đã import dữ liệu: ' + e(r.message), 'ok');
                            if (o.sau) o.sau({ ok: arr(d.Table2), loi: arr(d.Table1), message: e(r.message) });
                        }).catch(function (err) { bao.textContent = 'Lỗi: ' + (err.message || ''); ums.api.handle(err, 'import danh sách thí sinh'); });
                    });
                    return false;
                } }
            ]
        });
    };

    /** Kết quả import: hai tab (thành công / lỗi), bảng cột theo khoá dòng đầu (như gốc genTable_Import_View) */
    Q.ketQuaImport = function (host, kq) {
        var body = document.createElement('div');
        body.innerHTML = ui.tabs([{ key: 'ok', text: '1) Kết quả import thành công (' + kq.ok.length + ')', icon: 'fa-circle-check' },
            { key: 'loi', text: '2) Kết quả import lỗi (' + kq.loi.length + ')', icon: 'fa-triangle-exclamation' }], 'ok', 'data-tab') +
            '<div class="ums-u-mt-4" data-k="ok"></div><div class="ums-u-mt-4" data-k="loi" hidden></div>';
        function bang(el, ds) {
            if (!ds.length) { el.innerHTML = ui.empty('Không có dòng nào'); return; }
            var keys = Object.keys(ds[0]);
            ui.table({ el: el, rows: ds, columns: keys.map(function (k) { return { title: k, render: function (r) { return ui.escBr(r[k]); } }; }) });
        }
        bang(body.querySelector('[data-k="ok"]'), kq.ok);
        bang(body.querySelector('[data-k="loi"]'), kq.loi);
        body.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-tab]'); if (!a) return;
            var k = a.getAttribute('data-tab');
            ui.tabsActive(body, k, 'data-tab');
            body.querySelector('[data-k="ok"]').hidden = k !== 'ok';
            body.querySelector('[data-k="loi"]').hidden = k !== 'loi';
        });
        return pat.formTrang({ host: host, title: 'Import danh sách thi', icon: 'fa-cloud-arrow-up', cols: 1, body: body });
    };
})();
