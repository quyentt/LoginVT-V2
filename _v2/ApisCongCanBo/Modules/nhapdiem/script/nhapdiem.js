/* =========================================================================
   nhapdiem — Nhập điểm: danh sách bảng điểm → lưới nhập điểm theo công thức
   (cột tiêu đề nhiều tầng) → thống kê kết quả (4 tab).
   Bản gốc: nhapdiem/script/nhapdiem.js (vỏ index / Core). Hộp xác nhận: _xacnhan.js.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên; GET trừ khi ghi):
       D_LoaiDanhSach/LayLoaiDanhSach → D_ThoiGian/LayDanhSach (strLoaiDanhSach_Id; tự chọn mục đầu)
         → D_HocPhan/LayDanhSach (strDaoTao_LopQuanLy_Id '', strLoaiDanhSach_Id, strDaoTao_ThoiGianDaoTao_Id)
       D_Hoc/LayDanhSach (phân trang máy chủ; strTrangThai_Id / strDangKy_KeHoachDangKy_Id / strNguoiTao_Id '' như gốc)
       D_CongThuc/LayChiTiet (strDaoTao_HocPhan_Id '', strDiem_DanhSachHoc_Id) → rsDSCotThongTinNguoiHoc + rsDSCotThongTinDiem (cây MACOT_CHA)
       D_Hoc_NguoiHoc/LayDanhSach (strTieuChiSapXep) · D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach (mỗi cột lá một lời gọi)
       Lưu: POST D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan mỗi ô đã đổi (strDiem_ThanhPhanDiem_Id = MACOT như gốc)
         → POST …/Tinh_Diem_NguoiHoc_ThanhPhan mỗi dòng → nạp lại lưới
       Lấy điểm lại theo Rubric: POST TP_XuLyTuKhoa/QuyDoiRubricTheoLopHocPhan (dCapNhatLaiDuLieu -1)
       Xác nhận / Công bố: ums.nd.xacNhan (XACNHAN_HOANTHANH_NHAP / XACNHAN_CONGBODIEM)
       Vi phạm điều kiện thi: ums.nd.viPham('Truoc') + đầu điểm D_XuLyDiem/LayDSDauDiemThiTheoCongThuc (strDaoTao_LopHocPhan_Id = id bảng điểm)
       Thống kê: D_ThoiGian… → D_ThongKe_MH · pkg_diem_thongke.ThongHocTapTheoLopHP (strDaoTao_LopHocPhan_1_Id … _10_Id)
       Báo cáo: ums.report.mount · Tải bảng điểm / Nhập điểm qua file: ums.report.taiBangNhap / nhapBangTuTep
   Không chép (lỗi rõ của bản gốc):
     · Lưu xong nạp lưới HAI lần (tính lại chạy trên các dòng cũ khi lưới đang nạp lại) → một lần, sau khi tính xong.
     · Bảng điểm rỗng thì lỗi JS và thanh tiến trình treo. Lấy điểm Rubric: thanh tiến trình không bao giờ xong.
     · Phím ↑/↓ nhảy sai ô (đếm cả ô đánh dấu, dòng có ô khoá lệch cột) → đi theo đúng cột (ums.nd.phim, _chung.js).
     · Hệ 10: "12.5" bị đổi thành 1.2 (parseInt) → chỉ đổi khi gõ SỐ NGUYÊN > 10 (85 → 8.5, 755 → 7.6, 100 → 10).
     · Thống kê bỏ sót id thứ 101, 201… và mọi id sau 1000 (cắt lệch một); dòng Tổng lệch cột ở dòng gộp khoa.
     · Đổi cách sắp xếp / xác nhận xong nạp lại mà không hỏi khi còn điểm chưa lưu → hỏi. Đóng lưới nay nạp lại danh sách (tỉ lệ nhập).
     · Tiêu đề hộp dính chữ ("Xác nhậnHoàn thành nhập điểm"). Ô chọn "Chọn" trong ô mã HTML hỏng.
     · Trạng thái vi phạm nạp từ HAI nguồn cùng lúc (danh mục QLHLTL.TINHTRANGDANGKY và TP_Chung), nguồn về sau thắng
       → chỉ dùng TP_Chung/LayTrangThaiTruocThi (đúng hàm của nút).
   Chờ nghiệp vụ (đang giữ như gốc hoặc tạm):
     · Ô "Lớp quản lý" gốc ẨN mà vẫn gửi (luôn '') → bỏ ô, vẫn gửi ''.
     · Cột "File" gốc tải tệp lên nhưng không lưu, không hiện → bỏ cột (hỏi có cần không).
     · Sắp xếp: danh mục DIEM.NHAPDIEM.SAPXEP ghi đè ABC / LOPQUANLY / MASO (gửi ID danh mục) — giữ; danh mục rỗng thì dùng ba mục gốc.
     · Khoá ô chỉ theo CHIXEM từng ô (CHIXEM của cột bị bỏ qua) — giữ.
     · Sau khi lưu vẫn TÍNH LẠI MỌI dòng (không chỉ dòng đã sửa) — giữ.
     · Lấy điểm Rubric: gốc không hỏi lại — ở đây hỏi lại (ghi đè điểm cả bảng).
     · Hệ 10: 200 → 10 (mọi bội của 100) — giữ quy tắc gốc.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, nd = ums.nd;
    var root = document.getElementById('nd-nhapdiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function vt() { return (ums.state && ums.state.roleId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function get(a, o) { return ums.api.call(Object.assign({ action: a, method: 'GET', strChucNang_Id: cn(), strNguoiThucHien_Id: uid() }, o)); }

    root.innerHTML =
        '<section data-v="ds">' + pat.page('Nhập điểm', '') +
            pat.filterBar([{ key: 'loai', type: 'select', label: 'Chọn loại danh sách' }, { key: 'tg', type: 'select', label: 'Chọn thời gian' },
                { key: 'hp', type: 'select', label: 'Chọn học phần' }, { key: 'q', label: 'Nhập mã số hoặc tên' }]) +
            pat.panel({ title: 'Danh sách bảng điểm', icon: 'fa-file-lines', count: 'nDS', flush: true, zone: 'ds',
                tools: ui.btn('save', { text: 'Thống kê', icon: 'fa-square-poll-horizontal', attr: { 'data-a': 'thongke' } }) }) + '</section>' +
        '<section data-v="nd" hidden>' + pat.page('Nhập điểm', ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } })) +
            pat.panel({ title: 'Bảng điểm', icon: 'fa-table-cells', count: 'nND', flush: true,
                body: '<div class="nd-thanh">' +
                    '<div class="nd-thanh__trai"><span class="nd-hp" data-z="hp"></span>' +
                        '<div class="ums-field"><select class="ums-select" data-f="sx" data-no-s2><option value="ABC">Xếp theo ABC</option><option value="LOPQUANLY">Xếp theo Lớp quản lý</option><option value="MASO">Xếp theo Mã sinh viên</option></select></div></div>' +
                    '<div class="nd-thanh__phai"><span data-z="bc"></span>' +
                        ui.btn('save', { text: 'Vi phạm điều kiện thi', icon: 'fa-circle-check', mod: 'out-success', attr: { 'data-a': 'vipham' } }) +
                        ui.btn('excel', { text: 'Tải bảng điểm', icon: 'fa-file-arrow-down', mod: 'out-warn', attr: { 'data-a': 'tai' } }) +
                        ui.btn('search', { text: 'Nhập điểm qua file', icon: 'fa-file-arrow-up', mod: 'out-primary', attr: { 'data-a': 'nhap' } }) +
                        ui.btn('save', { text: 'Công bố', icon: 'fa-bullhorn', mod: 'out-danger', attr: { 'data-a': 'congbo' } }) +
                        ui.btn('save', { text: 'Xác nhận', icon: 'fa-circle-check', mod: 'out-success', attr: { 'data-a': 'xacnhan' } }) +
                        ui.btn('search', { text: 'Lấy điểm lại theo Rubric', icon: 'fa-calculator', mod: 'out-info', attr: { 'data-a': 'rubric' } }) +
                        ui.btn('search', { text: 'Tính lại', icon: 'fa-calculator', mod: 'out-alt', attr: { 'data-a': 'tinh' } }) + '</div></div>' +
                    '<div data-z="luoi"></div>' }) + '</section>' +
        '<section data-v="tk" hidden>' + pat.page('Thống kê kết quả', ui.btn('close', { attr: { 'data-a': 'dongtk' } })) +
            ui.tabs([{ key: 'chu', text: 'Thống kê điểm chữ A,B,C,..' }, { key: 'dg', text: 'Thống kê đánh giá Học lại,…' },
                { key: '10', text: 'Thống kê kết quả theo thang điểm 10' }, { key: '4', text: 'Thống kê kết quả theo thang điểm 4' }], 'chu', 'data-tktab') +
            pat.panel({ title: false, flush: true, zone: 'tk' }) + '</section>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? f(k).value.trim() : ''; }
    function vung(k) { return root.querySelector('[data-v="' + k + '"]'); }
    var dang = 'ds';
    function sang(k) { ui.swap(vung(dang), vung(k), { top: true }); dang = k; }

    /* ---------- 1. Bộ lọc + danh sách bảng điểm ------------------------ */
    var chain = pat.chain([f('loai'), f('tg'), f('hp')], { phatLai: false });
    get('D_LoaiDanhSach/LayLoaiDanhSach').then(function (r) { pat.fill(f('loai'), arr(r.data), { head: 'Chọn loại danh sách' }); chain.sync(); })
        .catch(function (err) { ums.api.handle(err, 'loại danh sách'); });
    function napTG() {
        if (!v('loai')) { pat.fill(f('tg'), []); pat.fill(f('hp'), []); chain.sync(); return; }
        get('D_ThoiGian/LayDanhSach', { strLoaiDanhSach_Id: v('loai') }).then(function (r) {
            var d = arr(r.data);
            pat.fill(f('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' });
            if (d.length) { f('tg').value = d[0].ID; if (window.jQuery) jQuery(f('tg')).trigger('change.select2'); }   // selectFirst như gốc
            chain.sync(); napHP();
        }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    }
    function napHP() {
        if (!v('tg')) { pat.fill(f('hp'), []); chain.sync(); return; }
        get('D_HocPhan/LayDanhSach', { strDaoTao_LopQuanLy_Id: '', strLoaiDanhSach_Id: v('loai'), strDaoTao_ThoiGianDaoTao_Id: v('tg') })
            .then(function (r) { pat.fill(f('hp'), arr(r.data), { head: 'Chọn học phần' }); chain.sync(); }).catch(function (err) { ums.api.handle(err, 'học phần'); });
    }
    var trang = 1, co = 10, DS = [];
    function taiDS() {
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return get('D_Hoc/LayDanhSach', { strTuKhoa: v('q'), strDaoTao_LopQuanLy_Id: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'),
            strTrangThai_Id: '', strDangKy_KeHoachDangKy_Id: '', strLoaiDanhSach_Id: v('loai'), strNguoiDung_Id: uid(), strNguoiTao_Id: '', pageIndex: trang, pageSize: co }).then(function (r) {
            DS = arr(r.data);
            var tong = Number(r.pager) || DS.length;
            z('nDS').textContent = '(' + tong + ')';
            ui.table({ el: z('ds'), rows: DS, empty: 'Không có bảng điểm', columns: [
                { title: 'Loại danh sách', prop: 'LOAIDANHSACH_TEN' }, { title: 'Mã danh sách', prop: 'MA', cls: 'is-nowrap' }, { title: 'Tên danh sách', prop: 'TEN' },
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số lượng', cls: 'is-center is-nowrap', render: function (x) { return esc(e(x.SOLUONG) + '(' + e(x.TYLENHAPDIEM) + '%)'); } },
                { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-center' }, { title: 'Khóa mở lớp', prop: 'DAOTAO_KHOADAOTAO_MA', cls: 'is-center' },
                { title: 'Hiển thị', cls: 'is-center', render: function (x, i) { return ui.btn('search', { text: 'Chọn', icon: 'fa-pen-to-square', mod: 'primary', cls: 'ums-btn--sm', attr: { 'data-chon': i } }); } },
                { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } }],
                page: { index: trang, size: co, total: tong, onChange: function (p) { trang = p; taiDS(); }, onSize: function (s) { co = s === 'all' ? Math.max(tong, 1) : Number(s); trang = 1; taiDS(); } } });
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách bảng điểm'); });
    }
    if (window.jQuery) {
        jQuery(f('loai')).on('select2:select select2:clear', napTG);
        jQuery(f('tg')).on('select2:select select2:clear', napHP);
        jQuery(f('hp')).on('select2:select select2:clear', function () { trang = 1; taiDS(); });
    }
    z('ds').innerHTML = ui.empty('Chọn học phần hoặc bấm "Tìm kiếm" để xem danh sách bảng điểm', 'fa-hand-pointer');

    /* ---------- 2. Lưới nhập điểm -------------------------------------- */
    var bd = null, COT = { nh: [], diem: [], la: [] }, NH = [], KQ = {};
    ums.api.dm('DIEM.NHAPDIEM.SAPXEP').then(function (d) { if (d && d.length) f('sx').innerHTML = d.map(function (x) { return '<option value="' + esc(x.ID) + '">' + esc(e(x.TEN)) + '</option>'; }).join(''); }).catch(function () {});
    function kieu(c, than) {
        var s = '';
        if (c.KICHTHUOCFONTCHU) s += 'font-size:' + c.KICHTHUOCFONTCHU + 'px;';
        if (c.CANLE) s += String(c.CANLE).replace(/;?$/, ';');
        if (c.MAMAUHIENTHI) s += 'color:#' + String(c.MAMAUHIENTHI).replace(/^#/, '') + ';';
        if (than && c.CHUDAM) s += String(c.CHUDAM).replace(/;?$/, ';');
        return s;
    }
    function boc(c, html) { var s = kieu(c, true); return s ? '<div style="' + esc(s) + '">' + html + '</div>' : html; }
    function la(ds) {   // duyệt cây theo chiều sâu → cột lá kèm đường dẫn tên các tầng cha
        var ra = [];
        function di(n, duong) {
            var con = ds.filter(function (x) { return x.MACOT_CHA === n.MACOT; });
            if (!con.length) { ra.push({ c: n, group: duong }); return; }
            con.forEach(function (x) { di(x, duong.concat([n.TENCOT])); });
        }
        ds.filter(function (x) { return x.MACOT_CHA === null || x.MACOT_CHA === undefined || x.MACOT_CHA === ''; }).forEach(function (r) { di(r, []); });
        return ra;
    }
    function moBang(x) {
        bd = x;
        z('hp').textContent = e(x.DAOTAO_HOCPHAN_MA) + ' - ' + e(x.DAOTAO_HOCPHAN_TEN);
        if (dang !== 'nd') sang('nd');
        taiLuoi();
    }
    function taiLuoi() {
        var h = z('luoi');
        h.innerHTML = ui.empty('Đang tải công thức điểm…', 'fa-spinner fa-spin');
        z('nND').textContent = '';
        return get('D_CongThuc/LayChiTiet', { strDaoTao_HocPhan_Id: '', strDiem_DanhSachHoc_Id: bd.ID }).then(function (r) {
            var d = r.data || {};
            COT.nh = d.rsDSCotThongTinNguoiHoc || []; COT.diem = d.rsDSCotThongTinDiem || []; COT.la = la(COT.diem);
            return get('D_Hoc_NguoiHoc/LayDanhSach', { strDiem_DanhSachHoc_Id: bd.ID, strTieuChiSapXep: v('sx') });
        }).then(function (r) {
            NH = arr(r.data); KQ = {};
            if (!NH.length || !COT.la.length) return null;
            var xong = 0;
            h.innerHTML = ui.empty('Đang tải điểm 0 / ' + COT.la.length + ' cột…', 'fa-spinner fa-spin');
            return Promise.all(COT.la.map(function (l) {
                return get('D_Hoc_NguoiHoc_Diem/LayGiaTriDiemTheoDanhSach', { silent: true, strDaoTao_HocPhan_Id: NH[0].DAOTAO_HOCPHAN_ID, strDiem_DanhSachHoc_Id: NH[0].DIEM_DANHSACHHOC_ID,
                    strKyHieuCotDuLieu: l.c.MACOT }).then(function (r2) {
                    var m = KQ[l.c.MACOT] = {};
                    arr(r2.data).forEach(function (y) { m[y.QLSV_NGUOIHOC_ID] = y; });
                }, function (err) { KQ[l.c.MACOT] = {}; console.warn('[nhapdiem] cột', l.c.MACOT, err.message); })
                    .then(function () { xong++; h.innerHTML = ui.empty('Đang tải điểm ' + xong + ' / ' + COT.la.length + ' cột…', 'fa-spinner fa-spin'); });
            }));
        }).then(veLuoi).catch(function (err) { h.innerHTML = ui.fail(err.message); ums.api.handle(err, 'bảng điểm'); });
    }
    function veLuoi() {
        var h = z('luoi');
        z('nND').textContent = '(' + NH.length + ')';
        var cot = COT.nh.map(function (c) { return { title: e(c.TENCOT), render: function (x) { return boc(c, ui.escBr(x[c.MACOT])); } }; });
        cot.push({ head: 'Chọn <input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center is-nowrap', render: function (x, i) { return '<input type="checkbox" data-ck="' + i + '">'; } });
        COT.la.forEach(function (l, ci) {
            cot.push({ title: e(l.c.TENCOT), group: l.group, cls: 'is-center', render: function (x, ri) {
                var o = (KQ[l.c.MACOT] || {})[x.QLSV_NGUOIHOC_ID];
                if (!o) return '';
                var gt = e(o.GIATRICOTDULIEU);
                if (String(o.CHIXEM) === '1') return boc(l.c, esc(gt));
                return '<input class="ums-input ums-input--sm nd-o" id="input' + esc(x.QLSV_NGUOIHOC_ID) + '_' + esc(l.c.MACOT) + '" data-r="' + ri + '" data-c="' + ci + '" data-he="' + esc(e(l.c.THANGDIEM)) +
                    '" data-goc="' + esc(gt) + '" value="' + esc(gt) + '" autocomplete="off">';
            } });
        });
        ui.table({ el: h, rows: NH, columns: cot, stt: false, empty: NH.length ? 'Công thức điểm chưa có cột điểm' : 'Bảng điểm chưa có người học' });
        var t = h.querySelector('table');
        if (t) {
            t.id = 'tblNhapDiem'; t.setAttribute('colreport', '1'); t.classList.add('nd-luoi');
            if (COT.la.length > 13) t.classList.add('nd-luoi--nho');
            Array.prototype.forEach.call(t.tBodies[0].rows, function (tr, i) { if (NH[i]) tr.id = NH[i].QLSV_NGUOIHOC_ID; });
        }
    }
    function oDoi() { return nd.oDoi(z('luoi')); }
    function danhDau() { nd.danhDau(z('luoi')); }
    function hoiBo() { return oDoi().length ? ui.confirm('Có điểm chưa lưu. Bạn có chắc chắn muốn đóng và bỏ qua thay đổi không?', { tone: 'warn', ok: 'Bỏ thay đổi' }) : Promise.resolve(true); }
    function dong(x) { return NH.filter(function (n) { return n.QLSV_NGUOIHOC_ID === x; })[0]; }
    function goiTinh(n) {
        return { action: 'D_Hoc_NguoiHoc_Diem/Tinh_Diem_NguoiHoc_ThanhPhan', method: 'POST', strChucNang_Id: cn(), strUngDung_Id: vt(), strDaoTao_ThoiGianDaoTao_Id: n.DAOTAO_THOIGIANDAOTAO_ID,
            strDiem_DanhSach_NguoiHoc_Id: n.ID, strDiem_DanhSachHoc_Id: n.DIEM_DANHSACHHOC_ID, strQLSV_NguoiHoc_Id: n.QLSV_NGUOIHOC_ID, strDaoTao_ChuongTrinh_Id: n.CHUONGTRINH_ID,
            strDaoTao_HocPhan_Id: n.DAOTAO_HOCPHAN_ID, strDiem_ThanhPhanDiem_Id: '', strLanHoc: n.LANHOC, strLanThi: n.LANTHI, strGhiChu: '', strNguoiThucHien_Id: uid() };
    }
    function tinhLai() {
        return ui.batch(NH.map(goiTinh), { title: 'Đang tính lại điểm', okText: 'Tính lại điểm', concurrency: 5, show: true }).then(taiLuoi);
    }
    function luu() {
        var doi = oDoi();
        if (!doi.length) { ui.toast('Chưa có điểm mới nào cần lưu', 'info'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu điểm không? (' + doi.length + ' ô đã sửa)', { title: 'Lưu điểm' }).then(function (yes) {
            if (!yes) return;
            ui.batch(doi.map(function (i) {
                var p = i.id.substring(5).split('_'), n = dong(p[0]), macot = p.slice(1).join('_');
                return function () {
                    var o = goiTinh(n);
                    o.action = 'D_Hoc_NguoiHoc_Diem/Nhan_Diem_NguoiHoc_ThanhPhan'; o.strDiem_ThanhPhanDiem_Id = macot; o.strDiem = i.value.trim();
                    return ums.api.call(o).catch(function (err) { throw new Error(e(n.HODEMNGUOIHOC) + ' ' + e(n.TENNGUOIHOC) + ' (' + macot + ': ' + i.value + ') lỗi: ' + err.message); });
                };
            }), { title: 'Đang lưu điểm', okText: 'Lưu điểm', concurrency: 5, show: true }).then(tinhLai);
        });
    }
    function daChonHS() {
        return Array.prototype.filter.call(z('luoi').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return NH[Number(c.getAttribute('data-ck'))]; }).filter(Boolean);
    }
    ums.report.mount(z('bc'), { reportText: 'Báo cáo', import: false, tables: function () { var t = document.getElementById('tblNhapDiem'); return t ? [t] : []; }, collect: function (add) {
        add('strTuKhoa', v('q')); add('strDaoTao_LopQuanLy_Id', ''); add('strChucNang_Id', cn()); add('strDaoTao_ThoiGianDaoTao_Id', v('tg'));
        add('strDaoTao_HocPhan_Id', v('hp')); add('strTrangThai_Id', ''); add('strDangKy_KeHoachDangKy_Id', ''); add('strLoaiDanhSach_Id', v('loai'));
        add('strNguoiDung_Id', uid()); add('strNguoiTao_Id', ''); add('strNguoiThucHien_Id', uid()); add('strDiem_DanhSachHoc_Id', bd ? bd.ID : '');
        add('strQLSV_NguoiHoc_Id', ''); add('strDiem_DanhSach_NguoiHoc_Id', ''); add('strKyHieuCotDuLieu', '');
    } });

    /* ---------- 3. Thống kê --------------------------------------------- */
    var TK = null, TAB = 'chu';
    var TKCFG = { chu: ['rsDanhMucDiemChu', 'rsDuLieuDiemChu', 'DIEMQUYDOI_ID'], dg: ['rsDanhMucDanhGia', 'rsDuLieuDanhGia', 'DANHGIA_ID'],
        '10': ['rsDanhMucDiemHe10', 'rsDuLieuDiemHe10', 'DIEM'], '4': ['rsDanhMucDiemHe4', 'rsDuLieuDiemHe4', 'DIEMQUYDOI'] };
    function thongKe() {
        var ids = Array.prototype.filter.call(z('ds').querySelectorAll('input[data-ck]:checked'), function (c) { return c.getAttribute('data-ck') !== 'all'; })
            .map(function (c) { return (DS[Number(c.getAttribute('data-ck'))] || {}).ID; }).filter(Boolean);
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
        if (ids.length > 1000) ui.toast('Thống kê tối đa 1000 bảng điểm — lấy 1000 bảng đầu', 'warn');
        sang('tk');
        z('tk').innerHTML = ui.empty('Đang thống kê…', 'fa-spinner fa-spin');
        var o = { action: 'D_ThongKe_MH/FSkuLyYJLiIVIDEVKSQuDS4xCREP', func: 'pkg_diem_thongke.ThongHocTapTheoLopHP', strNguoiThucHien_Id: uid() };
        for (var k = 0; k < 10; k++) o['strDaoTao_LopHocPhan_' + (k + 1) + '_Id'] = ids.slice(k * 100, k * 100 + 100).toString();
        ums.api.call(o).then(function (r) { TK = r.data || {}; veTK(); }).catch(function (err) { z('tk').innerHTML = ui.fail(err.message); ums.api.handle(err, 'thống kê'); });
    }
    function veTK() {
        var c = TKCFG[TAB], dm = TK[c[0]] || [], dl = TK[c[1]] || [], hp = TK.rsThongTinHocPhan || [];
        function dem(x, id) { return dl.filter(function (y) { return y.DAOTAO_HOCPHAN_ID === x.DAOTAO_HOCPHAN_ID && y.DAOTAO_KHOAQUANLY_ID === x.DAOTAO_KHOAQUANLY_ID && String(y[c[2]]) === String(id); }).length; }
        var rows = hp.map(function (x) { var o = { KHOA: x.DAOTAO_KHOAQUANLY_TEN, KHOA_ID: x.DAOTAO_KHOAQUANLY_ID, HP: e(x.DAOTAO_HOCPHAN_TEN) + ' ' + e(x.DAOTAO_HOCPHAN_MA), SUM: 0 };
            dm.forEach(function (m, i) { o['c' + i] = dem(x, m.ID); o.SUM += o['c' + i]; }); return o; });
        var cot = [{ title: 'Khoa quản lý', prop: 'KHOA' }, { title: 'Học phần', prop: 'HP' }].concat(dm.map(function (m, i) { return { title: e(m.TEN), prop: 'c' + i, cls: 'is-center', sum: true }; }),
            [{ title: 'Sum', prop: 'SUM', cls: 'is-center', sum: true }]);
        ui.table({ el: z('tk'), rows: rows, columns: cot, empty: 'Không có dữ liệu thống kê' });
        var tb = z('tk').querySelector('tbody'), truoc = null, dem2 = 0;   // gộp ô Khoa quản lý liền nhau (actionRowSpan của gốc)
        if (rows.length) Array.prototype.forEach.call(tb.rows, function (tr, i) {
            if (truoc && rows[i].KHOA_ID === rows[i - 1].KHOA_ID) { tr.cells[1].remove(); dem2++; truoc.rowSpan = dem2 + 1; }
            else { truoc = tr.cells[1]; dem2 = 0; }
        });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.getAttribute('data-ck') === 'all') { Array.prototype.forEach.call(t.closest('table').querySelectorAll('tbody input[data-ck]'), function (c) { c.checked = t.checked; }); return; }
        if (t === f('sx')) hoiBo().then(function (yes) { if (yes) taiLuoi(); });
    });
    nd.phim(z('luoi'));
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang = 1; taiDS(); } });
    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-chon]'))) { moBang(DS[Number(b.getAttribute('data-chon'))]); return; }
        if ((b = ev.target.closest('[data-tktab]'))) { TAB = b.getAttribute('data-tktab'); ui.tabsActive(root, TAB, 'data-tktab'); if (TK) veTK(); return; }
        if (!(b = ev.target.closest('[data-a]'))) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') { trang = 1; taiDS(); }
        else if (a === 'thongke') thongKe();
        else if (a === 'dongtk') sang('ds');
        else if (a === 'dong') hoiBo().then(function (yes) { if (yes) { sang('ds'); taiDS(); } });
        else if (a === 'luu') luu();
        else if (a === 'tinh') ui.confirm('Bạn có chắc chắn muốn tính lại điểm không?', { title: 'Tính lại điểm' }).then(function (yes) { if (yes) tinhLai(); });
        else if (a === 'rubric') ui.confirm('Lấy lại điểm theo Rubric cho cả bảng điểm? Điểm hiện có sẽ được quy đổi lại.', { title: 'Lấy điểm lại theo Rubric', tone: 'warn' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TP_XuLyTuKhoa/QuyDoiRubricTheoLopHocPhan', method: 'POST', dCapNhatLaiDuLieu: -1, strQLSV_NguoiHoc_Id: '', strDiem_DanhSachHoc_Id: bd.ID, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Thực hiện hoàn tất', 'ok'); return tinhLai(); }).catch(function (err) { ums.api.handle(err, 'quy đổi Rubric'); });
        });
        else if (a === 'xacnhan' || a === 'congbo') {
            var cb = a === 'congbo';
            hoiBo().then(function (yes) {
                if (yes) nd.xacNhan({ loai: cb ? 'XACNHAN_CONGBODIEM' : 'XACNHAN_HOANTHANH_NHAP', tieuDe: cb ? 'Công bố' : 'Xác nhận', chuDe: 'Hoàn thành nhập điểm', id: bd.ID, onDone: taiLuoi });
            });
        }
        else if (a === 'vipham') nd.viPham({ kieu: 'Truoc', ds: daChonHS(), onDone: taiLuoi,
            dauDiem: function () { return get('D_XuLyDiem/LayDSDauDiemThiTheoCongThuc', { strDaoTao_LopHocPhan_Id: bd.ID }).then(function (r) { return arr(r.data); }); },
            khoa: function (x, dd) { return e(x.QLSV_NGUOIHOC_ID) + bd.ID + dd; } });
        else if (a === 'tai') { var t = document.getElementById('tblNhapDiem'); if (t) ums.report.taiBangNhap(t); else ui.toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); }
        else if (a === 'nhap') { if (document.getElementById('tblNhapDiem')) ums.report.nhapBangTuTep({ onDone: danhDau }); else ui.toast('Bạn cần hiển thị dữ liệu trước khi thao tác!', 'warn'); }
    });
})();
