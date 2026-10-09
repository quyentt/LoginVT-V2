/* =========================================================================
   Báo cáo kết quả thi kết thúc học phần — phổ điểm
   Bản gốc: ApisCongCanBo/Modules/thongke/script/phodiem.js + html/phodiem.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       D_ThongKe/LayDSNganhDaoTaoTheoCTDT   GET  ô Ngành
       D_ThongKe/LayDSThoiGian              GET  ô Thời gian (THOIGIAN)
       danh mục DIEM.THANGDIEM              ô Thang điểm
       D_ThongKe/LayDSHocPhanTrongKy        GET  "Tìm kiếm" → danh sách học phần (cột trái)
       D_ThongKe/LayDSKetQuaPhoDiem         GET  bấm một học phần → Data.{ rsThanhPhanDiem (cột),
                                                  rsPhoDiem (dòng: MUCCANDUOI đến MUCCANTREN), rsKeQuaTheoPhoDiem (SOLUONG) }
       D_ThongKe/TinhPhoDiemHocPhan         POST "Thống kê" — mỗi học phần đang chọn một lời gọi
       Biểu đồ: SYS_Report/ThemMoi (strLoaiBaoCao = strReportCode = "KetQuaPhoDiem" + tham số)
                → GET <strhost>/reporttest/modules/common/baocao.aspx?id=… → { Success, Data: đường dẫn ảnh }
   Mẫu báo cáo: strDaoTao_ThoiGianDaoTao_Id, strDaoTao_HocPhan_Id (học phần đang xem), strThangDiem_Id, strNganhHoc_Id.
   Giữ như bản gốc: chọn nhiều học phần bằng cách bấm từng mục (bấm lại là bỏ);
   ô "Tên học phần" đánh dấu = chọn / bỏ tất cả; bảng + biểu đồ theo mục bấm SAU CÙNG.
   Bỏ: nút xoá "tăng thêm" và bảng thống kê chép từ màn khác (không có trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var D = 'D_ThongKe/';
    var root = document.getElementById('tk-phodiem');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function host() { return (ums.session && ums.session.host) || location.origin; }

    root.innerHTML = pat.page('Báo cáo kết quả thi kết thúc học phần', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'nganh', label: 'Chọn ngành', type: 'select' },
            { key: 'tg', label: 'Chọn thời gian', type: 'select' },
            { key: 'thang', label: 'Chọn thang điểm', type: 'select' }
        ], { extra: '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Thống kê', icon: 'fa-chart-simple', attr: { 'data-a': 'thongke' } }) + '</div>' }) +
        '<div data-z="md"></div>';
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var m = pat.master({
        el: root.querySelector('[data-z="md"]'),
        side: { title: 'Tên học phần', icon: 'fa-book', search: false, tools: '<label class="ums-check" title="Chọn / bỏ tất cả"><input type="checkbox" data-a="all"><span>Tất cả</span></label>' },
        main: { title: 'Phổ điểm', icon: 'fa-chart-column', count: true }
    });
    m.mainBody.innerHTML = '<div class="pd-trang"><div data-z="bang">' + ui.empty('Bấm "Tìm kiếm" rồi chọn một học phần', 'fa-hand-pointer') + '</div>' +
        '<div class="pd-bieudo"><div class="ums-u-center ums-u-semi ums-u-mb-2">Biểu đồ phổ điểm</div><div data-z="bd"></div></div></div>';
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var dsHP = [], chon = {}, dangXem = null;
    ums.api.call({ action: D + 'LayDSNganhDaoTaoTheoCTDT', method: 'GET', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('nganh'), arr(r.data), { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'ngành'); });
    ums.api.call({ action: D + 'LayDSThoiGian', method: 'GET', strNguoiThucHien_Id: uid(), silent: true })
        .then(function (r) { pat.fill(f('tg'), arr(r.data), { name: 'THOIGIAN' }); }).catch(function (err) { ums.api.handle(err, 'thời gian'); });
    ums.api.dm('DIEM.THANGDIEM').then(function (d) { pat.fill(f('thang'), d, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'thang điểm'); });

    function veDS() {
        m.sideCount.textContent = '(' + dsHP.length + ')';
        m.sideBody.innerHTML = dsHP.length ? dsHP.map(function (h, i) {
            return '<button type="button" class="ums-master__item' + (chon[h.ID] ? ' is-active' : '') + '" data-hp="' + i + '">' +
                esc(e(h.MA) + ' - ' + e(h.TEN) + '(TC ' + e(h.HOCTRINH) + ')') + '</button>';
        }).join('') : ui.empty('Không có học phần', 'fa-book');
    }
    function taiHP() {
        m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: D + 'LayDSHocPhanTrongKy', method: 'GET', strNguoiThucHien_Id: uid(), strNganhHoc_Id: f('nganh').value, strDaoTao_ThoiGianDaoTao_Id: f('tg').value })
            .then(function (r) { dsHP = arr(r.data); chon = {}; veDS(); }).catch(function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); });
    }
    function tieuDe(h) { return e(h.MA) + ' - ' + e(h.TEN) + '(TC ' + e(h.HOCTRINH) + ')'; }
    function taiPhoDiem(h) {
        dangXem = h;
        m.mainCount.textContent = '— ' + tieuDe(h);
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: D + 'LayDSKetQuaPhoDiem', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strDaoTao_HocPhan_Id: h.ID,
            strThangDiem_Id: f('thang').value, strPhanViApDung_Id: f('nganh').value, strNguoiThucHien_Id: uid() }).then(function (r) {
            var d = r.data || {}, tp = arr(d.rsThanhPhanDiem), kq = arr(d.rsKeQuaTheoPhoDiem);
            ui.table({ el: z('bang'), stt: false, rows: arr(d.rsPhoDiem), empty: 'Chưa có kết quả phổ điểm',
                columns: [{ title: 'Phổ điểm', cls: 'is-center is-nowrap', render: function (p) { return esc(e(p.MUCCANDUOI) + ' đến ' + e(p.MUCCANTREN)); } }]
                    .concat(tp.map(function (t) {
                        return { title: e(t.DIEM_THANHPHANDIEM_TEN), cls: 'is-center', render: function (p) {
                            var o = kq.filter(function (x) { return x.MUCCANDUOI == p.MUCCANDUOI && x.MUCCANTREN == p.MUCCANTREN && x.DIEM_THANHPHANDIEM_ID == t.DIEM_THANHPHANDIEM_ID; })[0];
                            return esc(o ? e(o.SOLUONG) : '');
                        } };
                    })) });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'phổ điểm'); });
        bieuDo(h);
    }
    /* report_PhoDiem: tạo báo cáo KetQuaPhoDiem ở máy chủ báo cáo, trang đó trả đường dẫn ảnh biểu đồ */
    function bieuDo(h) {
        var bd = z('bd');
        if (ums.state && ums.state.mode === 'demo') { bd.innerHTML = ui.empty('Biểu đồ do máy chủ báo cáo vẽ — chỉ hiện khi chạy với máy chủ', 'fa-chart-column'); return; }
        bd.innerHTML = ui.empty('Đang vẽ biểu đồ…', 'fa-spinner fa-spin');
        var k = ['strLoaiBaoCao', 'strReportCode', 'strDaoTao_ThoiGianDaoTao_Id', 'strDaoTao_HocPhan_Id', 'strThangDiem_Id', 'strPhanViApDung_Id', 'strTenHienThi', 'strNguoiThucHien_Id'];
        var v = ['KetQuaPhoDiem', 'KetQuaPhoDiem', f('tg').value, h.ID, f('thang').value, f('nganh').value, tieuDe(h), uid()];
        ums.api.json('SYS_Report/ThemMoi', { arrTuKhoa: k, arrDuLieu: v, strNguoiThucHien_Id: uid() }).then(function (r) {
            if (!r.message) throw new Error('Chưa lấy được dữ liệu báo cáo!');
            return fetch(host() + '/reporttest/modules/common/baocao.aspx?id=' + encodeURIComponent(r.message), { cache: 'no-store' }).then(function (x) { return x.json(); });
        }).then(function (d) {
            if (!d || !d.Success) throw new Error((d && d.Message) || 'Không vẽ được biểu đồ');
            bd.innerHTML = '<img class="pd-anh" alt="Biểu đồ phổ điểm" src="' + esc(host() + d.Data) + '">';
        }).catch(function (err) { bd.innerHTML = ui.fail(err.message); });
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strDaoTao_ThoiGianDaoTao_Id', f('tg').value); add('strDaoTao_HocPhan_Id', dangXem ? dangXem.ID : '');
        add('strThangDiem_Id', f('thang').value); add('strNganhHoc_Id', f('nganh').value);
    } });
    root.addEventListener('click', function (ev) {
        var hp = ev.target.closest('[data-hp]');
        if (hp) {
            var h = dsHP[Number(hp.getAttribute('data-hp'))];
            if (chon[h.ID]) { delete chon[h.ID]; hp.classList.remove('is-active'); }
            else { chon[h.ID] = true; hp.classList.add('is-active'); taiPhoDiem(h); }
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') taiHP();
        else if (a === 'thongke') {
            var ids = Object.keys(chon);
            if (!ids.length) { ui.toast('Chọn học phần ở cột trái (bấm để chọn)', 'warn'); return; }
            ui.batch(ids.map(function (id) {
                return { action: D + 'TinhPhoDiemHocPhan', method: 'POST', strDaoTao_ThoiGianDaoTao_Id: f('tg').value, strDaoTao_HocPhan_Id: id,
                    strThangDiem_Id: f('thang').value, strPhanViApDung_Id: f('nganh').value, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang thống kê phổ điểm', okText: 'Thực hiện thành công' }).then(function () { if (dangXem) taiPhoDiem(dangXem); });
        }
    });
    root.addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-a') !== 'all') return;
        chon = {};
        if (ev.target.checked) dsHP.forEach(function (h) { chon[h.ID] = true; });
        veDS();
    });
    veDS();
})();
