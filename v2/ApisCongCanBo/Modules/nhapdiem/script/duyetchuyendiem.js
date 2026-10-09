/* =========================================================================
   duyetchuyendiem — Khoa chuyên môn duyệt công nhận (chuyển) điểm, hai tab:
   "Công nhận từ bảng điểm" / "Công nhận từ chứng chỉ". Xem chi tiết một hồ sơ,
   đánh dấu học phần rồi Xác nhận (chọn loại công nhận + trạng thái + nội dung).
   Bản gốc: nhapdiem/script/duyetchuyendiem.js (vỏ index / Core).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên; GET trừ khi ghi):
       SV_CND_ThongTin/LayDSKeHoachTheoNhanSu (tự chọn khi chỉ có 1) → LayDSHocPhanTheoKhoaChuyenmon (strDiem_KeHoachCongNhan_Id)
       Bộ lọc Khoa QL → Hệ → Khoá → CT → Lớp: bản chép tay của genBoLoc_HeKhoa, procedure …Quyen
         → ums.ref.cascadeQuyen (cùng procedure lọc theo quyền, bản mã hoá).
       Tab 1: SV_CND_ThongTin/LayDSDiem_NH_CN_So_DiemKhoaCM (phân trang máy chủ) · chi tiết LayDSChiTetCNTheoDiemKhoaCM (rs / rsFiles)
       Tab 2: danh mục DIEM.CHUNGCHI.PHANLOAI → D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi → D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo;
              SV_CND_ThongTin/LayDSDiem_NH_CN_So_CCKhoaCM · chi tiết LayDSChiTetCNTheoCCKhoaCM (+ strPhanLoaiCC_Id)
       Xác nhận: SV_CND_ThongTin/LayDSLoaiCongNhan → LayDSHanhDongTheoXacNhan (strLoaiXacNhan_Id);
         POST SV_CND_ThongTin/Them_Diem_DK_CongNhan_XacNhan mỗi học phần một lời gọi
           (strDuLieuXacNhan = khoá ghép, strNguoiXacnhan_Id — chữ n thường như gốc, strHanhDong_Id, strNoiDung);
         lịch sử: SV_CND_ThongTin_MH · pkg_congthongtin_cnd_thongtin.LayDSDiem_DK_CongNhan_XacNhan (khoá ghép nối dấu phẩy).
       Khoá ghép: QLSV_NGUOIHOC_ID + DAOTAO_CHUONGTRINH_ID + DAOTAO_HOCPHAN_ID + DIEM_KEHOACHCONGNHANDIEM_ID
         + DIEM_COSODAOTAOCONGNHANDIEM_ID + DIEM_THONGTIN_CC_CAPDO_ID (không dấu cách, như gốc).
   Không chép (lỗi rõ của bản gốc):
     · Hai hàm trùng tên getList_ChungChi → chuỗi Loại → Tên chứng chỉ → Cấp độ chết, chữ giữ chỗ "Chọn tên chứng chỉ"
       / "Chọn cấp độ" gửi lên làm id. Ở đây nạp đúng từng tầng; ô trống gửi rỗng.
     · Tab 2 ô Khoa QL mang nhầm id (không bao giờ được nạp) → nạp như tab 1.
     · Thanh phân trang tab 1 gọi nhầm tên đối tượng (bấm trang là lỗi JS).
     · Lịch sử của tab chứng chỉ dùng khoá còn sót của tab bảng điểm → dùng khoá của chính lượt chọn.
     · Lưu xong không nạp lại danh sách (cột "Xác nhận" cũ) và lịch sử → nạp lại cả hai.
     · Mở màn gọi học phần trước khi có kế hoạch (gửi chữ giữ chỗ làm id).
     · Ô đánh dấu ở DANH SÁCH chính không nơi nào đọc → bỏ.
     · Tiêu đề cột chi tiết ghi nhầm "tblHocPhanCongNhan_BangDiem" → "Thông tin học phần"; "Mã hồ sinh viên" → "Mã sinh viên".
   Chờ nghiệp vụ:
     · strLoaiXacNhan_Id gửi CHỮ "BangDiem" / "ChungChi" (như gốc); màn anh em ApisQuanLyDiem/kehoach gửi giá trị ô
       "Loại công nhận" cho cùng procedure — hỏi bên nào đúng.
     · Cấp độ gửi strDaoTao_HocPhan_Id rỗng (gốc đọc biến không bao giờ gán).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('nd-duyetchuyendiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    var C = 'SV_CND_ThongTin/';
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }
    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select></div>'; }
    function tim(k, nut) {
        return '<div class="ums-field"><input class="ums-input" data-f="' + k + '" placeholder="Nhập thông tin hồ sơ (Mã hồ sơ)" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem danh sách', attr: { 'data-a': nut } }) + '</div>';
    }
    function locHeKhoa(s) { return sel('kql' + s, 'Chọn khoa quản lý chương trình') + sel('he' + s, 'Chọn hệ đào tạo') + sel('khoa' + s, 'Chọn khóa đào tạo') + sel('ct' + s, 'Chọn chương trình') + sel('lop' + s, 'Chọn lớp'); }
    root.innerHTML = pat.page('Duyệt chuyển điểm', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + sel('kh', 'Chọn kế hoạch công nhận điểm') + '</div>' }) +
        ui.tabs([{ key: 'bd', text: 'Công nhận từ bảng điểm' }, { key: 'cc', text: 'Công nhận từ chứng chỉ' }], 'bd', 'data-dtab') +
        '<div data-tab-pane="bd">' + pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + sel('hp', 'Chọn học phần đăng ký công nhận điểm') + locHeKhoa('_QD') + tim('q_bd', 'timbd') + '</div>' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-book-open-reader', count: 'nBD', flush: true, zone: 'bd' }) + '</div>' +
        '<div data-tab-pane="cc" hidden>' + pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' + sel('loaicc', 'Chọn loại chứng chỉ') + sel('cc', 'Chọn tên chứng chỉ') +
                sel('capdo', 'Chọn cấp độ') + locHeKhoa('_BD') + tim('q_cc', 'timcc') + '</div>' }) +
            pat.panel({ title: 'Danh sách', icon: 'fa-certificate', count: 'nCC', flush: true, zone: 'cc' }) + '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    ['_QD', '_BD'].forEach(function (s) { ums.ref.cascadeQuyen({ kql: f('kql' + s), he: f('he' + s), khoa: f('khoa' + s), ct: f('ct' + s), lop: f('lop' + s) }); });

    /* ---------- Kế hoạch → học phần; Loại CC → Tên CC → Cấp độ ---------- */
    var c1 = pat.chain([f('kh'), f('hp')], { phatLai: false }), c2 = pat.chain([f('loaicc'), f('cc'), f('capdo')], { phatLai: false });
    function napHP() {
        if (!v('kh')) { pat.fill(f('hp'), []); c1.sync(); return; }
        get(C + 'LayDSHocPhanTheoKhoaChuyenmon', { strDiem_KeHoachCongNhan_Id: v('kh') })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); }, head: 'Chọn học phần' }); c1.sync(); })
            .catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    function chonKH() { napHP(); trang.bd = trang.cc = 1; taiBD(); taiCC(); }
    get(C + 'LayDSKeHoachTheoNhanSu').then(function (r) {
        var d = arr(r.data);
        pat.fill(f('kh'), d, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
        if (d.length === 1) { f('kh').value = d[0].ID; if (window.jQuery) jQuery(f('kh')).trigger('change.select2'); chonKH(); }
        c1.sync();
    }).catch(function (err) { ums.api.handle(err, 'kế hoạch'); });
    ums.api.dm('DIEM.CHUNGCHI.PHANLOAI').then(function (d) { pat.fill(f('loaicc'), d, { head: 'Chọn loại chứng chỉ' }); c2.sync(); }).catch(function () {});
    function napCC() {
        if (!v('loaicc')) { pat.fill(f('cc'), []); pat.fill(f('capdo'), []); c2.sync(); return; }
        get('D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi', { strPhanLoaiCC_Id: v('loaicc') })
            .then(function (r) { pat.fill(f('cc'), arr(r.data), { name: 'TENCHUNGCHI', head: 'Chọn chứng chỉ' }); c2.sync(); }).catch(function (err) { ums.api.handle(err, 'chứng chỉ'); });
    }
    function napCapDo() {
        if (!v('cc')) { pat.fill(f('capdo'), []); c2.sync(); return; }
        get('D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo', { strPhanLoaiCC_Id: v('loaicc'), strDiem_ThongTin_ChungChi_Id: v('cc'), strDaoTao_HocPhan_Id: '' })
            .then(function (r) { pat.fill(f('capdo'), arr(r.data), { name: 'TENCAPDO', head: 'Chọn cấp độ' }); c2.sync(); }).catch(function (err) { ums.api.handle(err, 'cấp độ'); });
    }
    if (window.jQuery) {
        jQuery(f('kh')).on('select2:select select2:clear', chonKH);
        jQuery(f('loaicc')).on('select2:select select2:clear', napCC);
        jQuery(f('cc')).on('select2:select select2:clear', napCapDo);
    }

    /* ---------- Hai danh sách ------------------------------------------ */
    var trang = { bd: 1, cc: 1 }, co = { bd: 10, cc: 10 }, DS = { bd: [], cc: [] };
    function locChung(s) {
        return { strDiem_KeHoachCongNhan_Id: v('kh'), strDaoTao_KhoaQuanLy_Id: v('kql' + s), strDaoTao_HeDaoTao_Id: v('he' + s), strDaoTao_KhoaDaoTao_Id: v('khoa' + s),
            strDaoTao_ChuongTrinh_Id: v('ct' + s), strDaoTao_LopQuanLy_Id: v('lop' + s) };
    }
    function taiDS(k, action, ts) {
        z(k).innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return get(C + action, Object.assign(ts, { pageIndex: trang[k], pageSize: co[k] })).then(function (r) {
            DS[k] = arr(r.data);
            var tong = Number(r.pager) || DS[k].length;
            z(k === 'bd' ? 'nBD' : 'nCC').textContent = '(' + tong + ')';
            var cot = [{ title: 'Mã hồ sơ đăng ký', prop: 'MACONGNHAN', cls: 'is-nowrap' }, { title: 'Mã sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                { title: 'Họ và tên', prop: 'QLSV_NGUOIHOC_HOTEN' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center' }];
            if (k === 'cc') cot.push({ title: 'Loại chứng chỉ', prop: 'PHANLOAICC_TEN' });
            cot.push({ title: 'Học phần xin công nhận', prop: 'HOCPHANCNTHEODIEMKHOACM' },
                { title: 'Xác nhận', cls: 'is-center is-nowrap', render: function (x) { return x.DAXACNHAN && String(x.DAXACNHAN) !== '0' ? ui.badge('Đã xác nhận', 'ok') : ''; } },
                { title: 'Chi tiết', cls: 'is-center', width: '70px', render: function (x, i) { return '<button type="button" class="ums-iconbtn" data-ct="' + k + '|' + i + '" title="Xem chi tiết"><i class="fa-light fa-eye"></i></button>'; } });
            ui.table({ el: z(k), rows: DS[k], columns: cot, empty: 'Không có hồ sơ',
                page: { index: trang[k], size: co[k], total: tong, onChange: function (p) { trang[k] = p; (k === 'bd' ? taiBD : taiCC)(); },
                    onSize: function (s) { co[k] = s === 'all' ? Math.max(tong, 1) : Number(s); trang[k] = 1; (k === 'bd' ? taiBD : taiCC)(); } } });
        }).catch(function (err) { z(k).innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách hồ sơ'); });
    }
    function taiBD() { return taiDS('bd', 'LayDSDiem_NH_CN_So_DiemKhoaCM', Object.assign({ strTuKhoa: v('q_bd'), strDaoTao_HocPhan_Id: v('hp') }, locChung('_QD'))); }
    function taiCC() {
        return taiDS('cc', 'LayDSDiem_NH_CN_So_CCKhoaCM', Object.assign({ strTuKhoa: v('q_cc'), strLoaiCC_Id: v('loaicc'), strTenChungChi_Id: v('cc'), strCapDo_Id: v('capdo') }, locChung('_BD')));
    }

    /* ---------- Chi tiết + xác nhận ------------------------------------ */
    function khoa(x) {
        return e(x.QLSV_NGUOIHOC_ID) + e(x.DAOTAO_CHUONGTRINH_ID) + e(x.DAOTAO_HOCPHAN_ID) + e(x.DIEM_KEHOACHCONGNHANDIEM_ID) + e(x.DIEM_COSODAOTAOCONGNHANDIEM_ID) + e(x.DIEM_THONGTIN_CC_CAPDO_ID);
    }
    function linkTep(x) { return x.DUONGDAN ? '<a href="' + esc(ums.files.url(x.DUONGDAN)) + '" target="_blank" rel="noopener">' + esc(e(x.TENHIENTHI) || 'Tệp') + '</a>' : ''; }
    function chiTiet(k, sv) {
        var cc = k === 'cc', rs = [];
        var dlg = ui.dialog({ title: 'Chi tiết', icon: 'fa-memo-circle-info', size: 'xl',
            body: '<p class="ums-u-fz13 ums-u-muted">' + esc(e(sv.MACONGNHAN) + ' · ' + e(sv.QLSV_NGUOIHOC_MASO) + ' - ' + e(sv.QLSV_NGUOIHOC_HOTEN) + ' · ' + e(sv.DAOTAO_CHUONGTRINH_TEN)) + '</p>' +
                '<div class="ums-legend">Học phần công nhận</div><div data-x="hp"></div><div class="ums-legend ums-legend--cach">Minh chứng</div><div data-x="mc"></div>',
            buttons: [{ text: 'Xác nhận', kind: 'save', mod: cc ? 'save' : 'primary', onClick: function () {
                var chon = Array.prototype.filter.call(q('hp').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
                    .map(function (c) { return rs[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
                if (!chon.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return false; }
                xacNhan(chon, cc ? 'ChungChi' : 'BangDiem', function () { tai(); (cc ? taiCC : taiBD)(); });
                return false;
            } }] });
        function q(x) { return dlg.body.querySelector('[data-x="' + x + '"]'); }
        function tai() {
            q('hp').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var ts = { strQLSV_NguoiHoc_Id: sv.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: sv.DAOTAO_CHUONGTRINH_ID, strDiem_KeHoachCongNhan_Id: v('kh') };
            if (cc) ts.strPhanLoaiCC_Id = sv.PHANLOAICC_ID;
            get(C + (cc ? 'LayDSChiTetCNTheoCCKhoaCM' : 'LayDSChiTetCNTheoDiemKhoaCM'), ts).then(function (r) {
                var d = r.data || {}; rs = d.rs || [];
                var cot = [{ title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Điểm công nhận', prop: 'DIEMCONGNHAN', cls: 'is-center' }];
                if (cc) cot.push({ title: 'Cấp độ', prop: 'DIEM_THONGTIN_CC_CAPDO_TEN' }, { title: 'Cơ sở đào tạo', prop: 'DIEM_COSODAOTAO_TEN' }, { title: 'Ngày cấp', prop: 'NGAYCAP', cls: 'is-center' });
                else cot.push({ title: 'Cơ sở đào tạo', prop: 'DIEM_COSODAOTAO_TEN' }, { title: 'Thông tin học phần', prop: 'THONGTINHOCPHAN' });
                cot.push({ title: 'Tình trạng xác nhận', prop: 'TINHTRANG_KHOA_XACNHAN_TEN' },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
                ui.table({ el: q('hp'), rows: rs, columns: cot, empty: 'Không có học phần' });
                ui.table({ el: q('mc'), rows: d.rsFiles || [], empty: 'Không có minh chứng', columns: cc ?
                    [{ title: 'Loại chứng chỉ', prop: 'PHANLOAICC_TEN' }, { title: 'Tên chứng chỉ', prop: 'DIEM_THONGTIN_CHUNGCHI_TEN' }, { title: 'Cấp độ', prop: 'CAPDO_TEN' }, { title: 'Minh chứng', render: linkTep }] :
                    [{ title: 'Cơ sở đào tạo', prop: 'TENCOSODAOTAO' }, { title: 'Minh chứng', render: linkTep }] });
            }).catch(function (err) { q('hp').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết'); });
        }
        dlg.body.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-ck') === 'all') Array.prototype.forEach.call(q('hp').querySelectorAll('input[data-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        tai();
    }
    function xacNhan(ds, loai, xong) {
        var keys = ds.map(khoa);
        var dlg = ui.dialog({ title: 'Xác nhận hoàn thành', icon: 'fa-check-to-slot', size: 'lg',
            body: '<p class="ums-u-fz13 ums-u-muted">Đã chọn ' + ds.length + ' học phần.</p>' +
                '<div class="ums-grid ums-grid--2">' + ui.field('Loại công nhận', '<select class="ums-select" data-x="loai" data-ph="Chọn loại công nhận"><option value=""></option></select>') +
                ui.field('Trạng thái', '<select class="ums-select" data-x="tt" data-ph="Chọn xác nhận"><option value=""></option></select>', { required: true }) + '</div>' +
                ui.field('Nội dung', '<textarea class="ums-input" data-x="nd" rows="3"></textarea>') +
                '<div class="ums-legend ums-legend--cach">Lịch sử</div><div data-x="ls"></div>',
            buttons: [{ text: 'Xác nhận', kind: 'save', onClick: function () {
                var tt = q('tt').value;
                if (!tt) { ui.toast('Chọn trạng thái xác nhận', 'warn'); return false; }
                ui.batch(ds.map(function (x) {
                    return { action: C + 'Them_Diem_DK_CongNhan_XacNhan', method: 'POST', strDuLieuXacNhan: khoa(x), strNguoiXacnhan_Id: uid(), strLoaiXacNhan_Id: loai,
                        strNoiDung: q('nd').value.trim(), strHanhDong_Id: tt, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công', show: true }).then(xong);
            } }] });
        function q(x) { return dlg.body.querySelector('[data-x="' + x + '"]'); }
        ui.enhance(dlg.body);
        var ch = pat.chain([q('loai'), q('tt')], { phatLai: false });
        function napTT() {
            if (!q('loai').value) { pat.fill(q('tt'), []); ch.sync(); return; }
            get(C + 'LayDSHanhDongTheoXacNhan', { strLoaiXacNhan_Id: q('loai').value }).then(function (r) {
                var d = arr(r.data); pat.fill(q('tt'), d, { head: 'Chọn xác nhận' });
                if (d.length === 1) { q('tt').value = d[0].ID; if (window.jQuery) jQuery(q('tt')).trigger('change.select2'); }
                ch.sync();
            }).catch(function (err) { ums.api.handle(err, 'trạng thái'); });
        }
        get(C + 'LayDSLoaiCongNhan').then(function (r) {
            var d = arr(r.data); pat.fill(q('loai'), d, { head: 'Chọn loại công nhận' });
            if (d.length === 1) { q('loai').value = d[0].ID; if (window.jQuery) jQuery(q('loai')).trigger('change.select2'); napTT(); }
            ch.sync();
        }).catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
        if (window.jQuery) jQuery(q('loai')).on('select2:select select2:clear', napTT);
        q('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_CND_ThongTin_MH/DSA4BRIFKCQsHgUKHgIuLyYPKSAvHhkgIg8pIC8P', func: 'pkg_congthongtin_cnd_thongtin.LayDSDiem_DK_CongNhan_XacNhan',
            strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strDuLieuXacNhan: keys.join(','), strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000 }).then(function (r) {
            ui.table({ el: q('ls'), rows: arr(r.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                { title: 'Trạng thái', prop: 'HANHDONG_TEN' }, { title: 'Nội dung', prop: 'THONGTINXACNHAN' }, { title: 'Người thực hiện', prop: 'NGUOIXACNHAN_TENDAYDU' },
                { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center' }] });
        }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
    }

    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-dtab]'))) {
            var t = b.getAttribute('data-dtab'); ui.tabsActive(root, t, 'data-dtab');
            Array.prototype.forEach.call(root.querySelectorAll('[data-tab-pane]'), function (p) { p.hidden = p.getAttribute('data-tab-pane') !== t; });
            return;
        }
        if ((b = ev.target.closest('[data-ct]'))) { var p = b.getAttribute('data-ct').split('|'); chiTiet(p[0], DS[p[0]][Number(p[1])]); return; }
        if ((b = ev.target.closest('[data-a]'))) {
            var a = b.getAttribute('data-a');
            if (a === 'timbd') { trang.bd = 1; taiBD(); } else if (a === 'timcc') { trang.cc = 1; taiCC(); }
        }
    });
    [['q_bd', 'bd'], ['q_cc', 'cc']].forEach(function (x) {
        f(x[0]).addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang[x[1]] = 1; (x[1] === 'bd' ? taiBD : taiCC)(); } });
    });
    z('bd').innerHTML = z('cc').innerHTML = ui.empty('Chọn kế hoạch công nhận điểm rồi bấm "Xem danh sách"', 'fa-hand-pointer');
})();
