/* =========================================================================
   _qlt_phong.js — biểu mẫu PHÒNG THI của màn "Quản lý thi" (Quản lý thi trắc nghiệm): ums.qlt.formPhong
   Bản gốc: quanlythi.html #zonePhongThi (+ #zoneCanBoCoiThi, #zoneCanBoChamThi) và các hàm viewEdit_PhongThi / rewrite_PhongThi /
   save_PhongThi / getList_HocPhan / CanBoCoiThi / CanBoChamThi của quanlythi.js.
   ---------------------------------------------------------------------------
   Lời gọi (QLTTN_QuanLyThi/… viết tắt QL/; GET trừ khi ghi POST; versionAPI 'v1.0' trừ khi ghi "không"):
     QL/LayDS_HocPhan (không)        strTuKhoa '', strDaoTao_MonHoc_Id '', strThuocBoMon_Id '', strThuocTinhHocPhan_Id '', strNguoiThucHien_Id ''
                                     → ID, TEN, MA, HOCTRINH, THUOCBOMON_TEN (ô chọn hiện "TEN_MA_HOCTRINH_BOMON" như gốc; chọn → điền Môn thi, Mã môn, Số ĐVHT)
     QL/Them_PhongThi · Sua_PhongThi (POST)  strId, strRoomName, strCourseName, strRoomTitle, strRoomHelp, strTeacher1, strTeacher2, strExamDate, strTotalTime,
                                     strExamScheduleId, strDepartOrganId, ChoPhepXemDiem, ChoPhepXemKetQuaTraLoi, strSoDiemLe, strThangDiem, strMatKhauChoPhongThi,
                                     strCourseCode, strCourseCredit, strCodeDST, strOpenstatus, strStatus, strCachTinhDiem, strHocPhanId, strNguoiThucHien_Id
     QL/LayDS_NhanSuCoiThi · LayDS_NhanSuChamThi        strExamRoomInfoId, strNguoiDung_Id, PageNumber, ItemPerPage → ID, MASO, HOTEN, TENDONVI
     QL/getList_SearchCanBoCoiThi · getList_SearchCanBoChamThi   strTuKhoa, strNguoiDung_Id, PageNumber, ItemPerPage → ID (nhân sự), MASO, HOTEN, TENDONVI
     QL/Them_CanBoCoiThi · Them_CanBoChamThi (POST)     strNhanSuId, strExamRoomInfoId, strNguoiThucHien_Id
     QL/Xoa_CanBoCoiThi · Xoa_CanBoChamThi (POST)       strId (dòng trong danh sách của phòng), strNguoiThucHien_Id
   Khác gốc / lỗi gốc đã sửa:
     · Biểu mẫu là khung trong trang (pat.formTrang) thay vùng #zonePhongThi; hộp "Thêm cán bộ coi / chấm thi" là hộp thoại (việc CHỌN).
     · Kiểm bắt buộc gốc trỏ id không tồn tại (txtPhongThi, txtMonThi, txtNgayThi) nên thực tế không kiểm → nay kiểm Phòng thi, Môn thi,
       Ngày thi, Thời gian thi, Cách tính điểm, Trạng thái, Tình trạng; ba ô số phải là số.
     · Gốc Sửa gửi strExamScheduleId / strDepartOrganId lấy từ ô LỌC (trống nếu người dùng không lọc) → màn truyền id đợt / đơn vị của dòng.
     · Cán bộ coi thi / chấm thi chỉ hiện khi SỬA (gốc Them_CanBo… cần id phòng đã có; màn mới chưa có id).
     · Hộp tìm cán bộ nạp ngay danh sách (từ khoá rỗng) thay vì chờ bấm Tìm kiếm — việc đọc. Thêm / xoá hàng loạt chờ xong rồi nạp lại.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi, Q = ums.qlt;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }

    /** Ô nhập của các biểu mẫu trong module (data-q) */
    Q.inp = function (k, o) {
        o = o || {};
        return '<input class="ums-input' + (o.so ? ' ums-input--so' : '') + '" data-q="' + esc(k) + '"' + (o.so ? ' inputmode="decimal"' : '') +
            (o.date ? ' data-date' : '') + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + ' autocomplete="off">';
    };
    Q.sel = function (k, ph, rows) {
        return '<select class="ums-select" data-q="' + esc(k) + '" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option>' +
            (rows || []).map(function (r) { return '<option value="' + esc(r.ID) + '">' + esc(r.TEN) + '</option>'; }).join('') + '</select>';
    };
    Q.s2 = function (el) { if (el && window.jQuery) jQuery(el).trigger('change.select2'); };

    var CACH_TINH = [{ ID: 'THEOSOY', TEN: 'Theo số ý' }, { ID: 'THEOSOCAU', TEN: 'Theo số câu' }];
    var MO_DONG = [{ ID: '1', TEN: 'Đang mở' }, { ID: '0', TEN: 'Đang đóng' }];
    var AN_HIEN = [{ ID: '0', TEN: 'Ẩn' }, { ID: '1', TEN: 'Hiện' }];

    /**
     * o = { host, room (null = nhập mới), dv: { id, ten }, dot: { id, ten }, sau() }
     */
    Q.formPhong = function (o) {
        var room = o.room || null, sua = !!room, hocPhan = [];
        var el = document.createElement('div');
        el.className = 'ums-grid ums-grid--2';
        el.innerHTML =
            '<div class="qlt-full ums-grid ums-grid--2 qlt-kvdau">' + P.kv('Đơn vị', e(o.dv.ten)) + P.kv('Đợt thi', e(o.dot.ten)) + '</div>' +
            ui.field('Phòng thi', Q.inp('ten'), { required: true }) +
            ui.field('Chọn học phần', '<select class="ums-select" data-q="hp" data-ph="Chọn học phần"><option value="">Chọn học phần</option></select>') +
            ui.field('Môn thi', Q.inp('mon'), { required: true }) + ui.field('Mã môn', Q.inp('ma')) +
            ui.field('Số ĐVHT/TC', Q.inp('tc', { so: true })) + ui.field('Mã DST', Q.inp('dst')) +
            ui.field('Tiêu đề phòng thi', Q.inp('tieude')) + ui.field('Hướng dẫn làm bài', Q.inp('hd')) +
            ui.field('Giám khảo 1', Q.inp('gk1')) + ui.field('Giám khảo 2', Q.inp('gk2')) +
            (sua ? '<div class="qlt-full" data-q="cbct"></div><div class="qlt-full" data-q="cbch"></div>'
                : '<div class="qlt-full ums-u-faint ums-u-fz13">Danh sách cán bộ coi thi / chấm thi khai sau khi lưu phòng thi (mở lại bằng nút Sửa).</div>') +
            ui.field('Ngày thi', Q.inp('ngay', { date: true, ph: 'dd/MM/yyyy' }), { required: true }) + ui.field('Mật khẩu cho phòng thi', Q.inp('mk')) +
            '<div class="qlt-full ums-grid ums-grid--3">' + ui.field('Thời gian thi(phút)', Q.inp('tg', { so: true }), { required: true }) +
                ui.field('Thang điểm', Q.inp('thang', { so: true })) + ui.field('Số điểm lẻ', Q.inp('le', { so: true })) + '</div>' +
            '<div class="qlt-full ums-grid ums-grid--3">' + ui.field('Cách tính điểm', Q.sel('ctd', 'Chọn cách tính điểm', CACH_TINH), { required: true }) +
                ui.field('Trạng thái phòng', Q.sel('mo', 'Chọn trạng thái phòng(Đóng/Mở)', MO_DONG), { required: true }) +
                ui.field('Tình trạng phòng', Q.sel('st', 'Tình trạng phòng(Ẩn/Hiện)', AN_HIEN), { required: true }) + '</div>' +
            '<div class="qlt-full ums-checklist"><label class="ums-check"><input type="checkbox" data-q="xd"> Cho phép xem điểm</label>' +
            '<label class="ums-check"><input type="checkbox" data-q="xkq"> Cho phép xem kết quả</label></div>';
        function q(k) { return el.querySelector('[data-q="' + k + '"]'); }
        function v(k) { var x = q(k); return x ? x.value.trim() : ''; }
        function dat(k, val) { var x = q(k); if (x) { x.value = e(val); if (x.tagName === 'SELECT') Q.s2(x); } }

        if (sua) {
            dat('ten', room.ROOMNAME); dat('mon', room.COURSENAME); dat('ma', room.COURSECODE); dat('tc', room.COURSECREDIT); dat('dst', room.CODEDST);
            dat('tieude', room.ROOMTITLE); dat('hd', room.ROOMHELP); dat('gk1', room.TEACHER1); dat('gk2', room.TEACHER2); dat('ngay', room.EXAMDATE);
            dat('mk', room.MATKHAUCHOPHONGTHI); dat('tg', room.TOTALTIME); dat('thang', room.THANGDIEM); dat('le', room.SODIEMLE);
            dat('ctd', room.CACHTINHDIEM); dat('mo', room.OPENSTATUS); dat('st', room.STATUS);
            q('xd').checked = e(room.CHOPHEPXEMDIEM) === '1';
            q('xkq').checked = e(room.CHOPHEPXEMKETQUATRALOI) === '1';
        } else {
            q('xd').checked = true;      // gốc rewrite_PhongThi: Cho phép xem điểm đánh dấu sẵn
        }

        var f = pat.formTrang({
            host: o.host, title: sua ? 'Chi tiết Phòng thi' : 'Nhập mới phòng thi', icon: 'fa-door-open', body: el,
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: luu }]
        });

        /* Học phần: chọn → điền Môn thi / Mã môn / Số ĐVHT (như gốc) */
        g(QL + 'LayDS_HocPhan', { strTuKhoa: '', strDaoTao_MonHoc_Id: '', strThuocBoMon_Id: '', strThuocTinhHocPhan_Id: '', strNguoiThucHien_Id: '' }).then(function (r) {
            hocPhan = arr(r.data);
            pat.fill(q('hp'), hocPhan, { name: function (x) { return e(x.TEN) + '_' + e(x.MA) + '_' + e(x.HOCTRINH) + '_' + e(x.THUOCBOMON_TEN); }, head: 'Chọn học phần' });
            if (sua) dat('hp', room.HOCPHANID);
        }).catch(function (err) { ums.api.handle(err, 'học phần'); });
        if (window.jQuery) jQuery(q('hp')).on('select2:select', function () {
            var hp = hocPhan.filter(function (x) { return e(x.ID) === q('hp').value; })[0];
            if (!hp) return;
            dat('mon', hp.TEN); dat('ma', hp.MA); dat('tc', hp.HOCTRINH);
        });

        if (sua) {
            khungCB(q('cbct'), room, { tieuDe: 'DS cán bộ coi thi', them: 'Thêm CB coi thi', hop: 'Thêm cán bộ coi thi', chuThem: 'Thêm CBCT',
                ds: 'LayDS_NhanSuCoiThi', tim: 'getList_SearchCanBoCoiThi', themAct: 'Them_CanBoCoiThi', xoaAct: 'Xoa_CanBoCoiThi' });
            khungCB(q('cbch'), room, { tieuDe: 'DS cán bộ chấm thi', them: 'Thêm CB chấm thi', hop: 'Thêm cán bộ chấm thi', chuThem: 'Thêm CB chấm thi',
                ds: 'LayDS_NhanSuChamThi', tim: 'getList_SearchCanBoChamThi', themAct: 'Them_CanBoChamThi', xoaAct: 'Xoa_CanBoChamThi' });
        }

        function luu(api) {
            var thieu = [];
            [['ten', 'Phòng thi'], ['mon', 'Môn thi'], ['ngay', 'Ngày thi'], ['tg', 'Thời gian thi'], ['ctd', 'Cách tính điểm'], ['mo', 'Trạng thái phòng'], ['st', 'Tình trạng phòng']]
                .forEach(function (x) { if (!v(x[0])) thieu.push(x[1]); });
            if (thieu.length) { ui.toast('Chưa nhập: ' + thieu.join(', '), 'warn'); return false; }
            var sai = [['tg', 'Thời gian thi'], ['thang', 'Thang điểm'], ['le', 'Số điểm lẻ'], ['tc', 'Số ĐVHT/TC']].filter(function (x) { return v(x[0]) && isNaN(Number(v(x[0]))); });
            if (sai.length) { ui.toast(sai.map(function (x) { return x[1]; }).join(', ') + ' phải là số', 'warn'); return false; }
            ums.api.call({
                action: QL + (sua ? 'Sua_PhongThi' : 'Them_PhongThi'), method: 'POST', versionAPI: V, strId: sua ? e(room.ID) : '',
                strRoomName: v('ten'), strCourseName: v('mon'), strRoomTitle: v('tieude'), strRoomHelp: v('hd'), strTeacher1: v('gk1'), strTeacher2: v('gk2'),
                strExamDate: v('ngay'), strTotalTime: v('tg'), strExamScheduleId: e(o.dot.id), strDepartOrganId: e(o.dv.id),
                ChoPhepXemDiem: q('xd').checked ? '1' : '0', ChoPhepXemKetQuaTraLoi: q('xkq').checked ? '1' : '0',
                strSoDiemLe: v('le'), strThangDiem: v('thang'), strMatKhauChoPhongThi: v('mk'), strCourseCode: v('ma'), strCourseCredit: v('tc'), strCodeDST: v('dst'),
                strOpenstatus: v('mo'), strStatus: v('st'), strCachTinhDiem: v('ctd'), strHocPhanId: v('hp'), strNguoiThucHien_Id: P.uid()
            }).then(function () {
                ui.toast('Thực hiện thành công', 'ok');
                if (o.sau) o.sau();
                api.close();
            }).catch(function (err) { ums.api.handle(err, 'lưu phòng thi'); });
            return false;
        }
        return f;
    };

    /* ---------- Danh sách cán bộ coi thi / chấm thi của phòng ---------- */
    function khungCB(host, room, c) {
        host.innerHTML = pat.panel({
            title: c.tieuDe, icon: 'fa-users', count: 'n', flush: true, zone: 'bang', cls: 'ums-u-mb-0',
            tools: ui.btn('add', { text: c.them, attr: { 'data-cb': 'them' } }) + ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-cb': 'xoa' } })
        });
        var bang = host.querySelector('[data-z="bang"]'), dem = host.querySelector('[data-z="n"]');
        var st = { page: 1, size: 10 };
        function tai(p) {
            if (p) st.page = p;
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(QL + c.ds, { versionAPI: V, strExamRoomInfoId: room.ID, strNguoiDung_Id: P.uid(), PageNumber: st.page, ItemPerPage: st.size }).then(function (r) {
                var rows = arr(r.data), tong = Number(r.pager) || rows.length;
                dem.textContent = tong ? '(' + tong + ')' : '';
                ui.table({ el: bang, rows: rows, empty: 'Chưa có cán bộ', columns: [
                    { title: 'Mã', prop: 'MASO', cls: 'is-center is-nowrap' }, { title: 'Họ tên', prop: 'HOTEN' }, { title: 'Đơn vị', prop: 'TENDONVI' }, P.cotChon()
                ], page: { index: st.page, size: st.size, total: tong, onChange: tai, onSize: function (s) { st.size = s; tai(1); } } });
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, c.tieuDe); });
        }
        P.ganChonTatCa(host);
        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-cb]');
            if (!b || !host.contains(b) || b.disabled) return;
            var k = b.getAttribute('data-cb');
            if (k === 'them') hopChon();
            else if (k === 'xoa') {
                var ids = P.daChon(bang);
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (yes) {
                    if (!yes) return;
                    return ui.batch(ids.map(function (id) { return { action: QL + c.xoaAct, method: 'POST', versionAPI: V, strId: id, strNguoiThucHien_Id: P.uid() }; }), { title: 'Đang xóa' })
                        .then(function () { tai(); });
                });
            }
        });
        tai(1);

        function hopChon() {
            var dlg = ui.dialog({
                title: c.hop, icon: 'fa-user-plus', size: 'lg',
                body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-h="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-h': 'tim' } }) + '</div></div><div class="ums-u-mt-4" data-h="bang"></div>',
                buttons: [{ text: c.chuThem, kind: 'add', keepOpen: true, onClick: function (api) {
                    var ids = P.daChon(b2);
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần thêm?', 'warn'); return false; }
                    ui.confirm('Bạn có chắc chắn thêm dữ liệu không?', { title: c.hop }).then(function (yes) {
                        if (!yes) return;
                        return ui.batch(ids.map(function (id) { return { action: QL + c.themAct, method: 'POST', versionAPI: V, strNhanSuId: id, strExamRoomInfoId: room.ID, strNguoiThucHien_Id: P.uid() }; }),
                            { title: 'Đang thêm', okText: 'Thực hiện thành công' }).then(function () { tai(); api.close(); });
                    });
                    return false;
                } }]
            });
            var b2 = dlg.body.querySelector('[data-h="bang"]'), oq = dlg.body.querySelector('[data-h="q"]');
            var s2 = { page: 1, size: 10 };
            function tim(p) {
                if (p) s2.page = p;
                b2.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                g(QL + c.tim, { versionAPI: V, strTuKhoa: oq.value.trim(), strNguoiDung_Id: P.uid(), PageNumber: s2.page, ItemPerPage: s2.size }).then(function (r) {
                    var rows = arr(r.data), tong = Number(r.pager) || rows.length;
                    ui.table({ el: b2, rows: rows, empty: 'Không tìm thấy cán bộ', columns: [
                        { title: 'Mã', prop: 'MASO', cls: 'is-center is-nowrap' }, { title: 'Họ Tên', prop: 'HOTEN' }, { title: 'Đơn vị', prop: 'TENDONVI' }, P.cotChon()
                    ], page: { index: s2.page, size: s2.size, total: tong, onChange: tim, onSize: function (s) { s2.size = s; tim(1); } } });
                }).catch(function (err) { b2.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tìm cán bộ'); });
            }
            P.ganChonTatCa(dlg.body);
            dlg.body.addEventListener('click', function (ev) { if (ev.target.closest('[data-h="tim"]')) tim(1); });
            oq.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(1); } });
            tim(1);
            setTimeout(function () { oq.focus(); }, 50);
        }
    }
})();
