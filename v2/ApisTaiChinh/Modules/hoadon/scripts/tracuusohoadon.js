/* =========================================================================
   Tra cứu số hóa đơn
   Bản gốc: ApisTaiChinh/Modules/hoadon/scripts/tracuusohoadon.js (HeThongHoaDon)
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     TC_HoaDon/LayDanhSach            GET v1.0  pageSize 100000 — tình trạng mẫu (SODADUNG, SODAHUY)
     TC_NguoiDungDaThuTien/LayDanhSach GET v1.0 — ô người thu (TAIKHOAN)
     TC_HoaDon/LayDSTaiChinh_SoHoaDon GET v1.0  pageIndex, pageSize (24), strTuNgay, strDenNgay,
          dSoTien (rỗng → -1), strTaichinh_Hoadon_Id (luôn '' — xem dưới), dChuaIn -1,
          dTinhTrang (Loại phiếu), strNguoiThucHien_Id '', strNguoiThu_Id, strTuKhoa
     TC_HoaDon/LayTTHoaDonThu_Rut     — xem chứng từ (ums.hoadon.xem)
     TC_HoaDon/HuyHoaDon              POST strHoaDon_Id  → nạp lại danh sách + tình trạng mẫu
     In toàn bộ đang hiển thị:
       với hoá đơn điện tử chưa có tệp: HDDT_HoaDon/GetFiles (+ transectionId, strDuongDanFile,
         strDuongDanFileTongHop, strPhuongThuc_MA, strSoHoaDon) → TC_HoaDon…/Sua_TaiChinh_DuongDanHDDT
         — chạy NGAY khi bấm, trước khi xác nhận, đúng như bản gốc
       xác nhận xong: hoá đơn tự in → bản xem chung, gộp để in;
                     hoá đơn điện tử có tệp → HDDT_HoaDon/GetServerPath rồi
                     TC_HoaDon/InNhieuHoaDon POST { arrHDDT: [...], strPath } → mở tệp gộp (Id)
     Gửi email: HDDT_HoaDon/GetServerPath → mỗi hoá đơn có email hợp lệ: (lấy tệp nếu thiếu:
       HDDT_HoaDon/GetFiles không kèm strPhuongThuc_MA + TC_HoaDonNhap/Sua_TaiChinh_DuongDanHDDT
       với strId = ID) → CMS_NguoiDung/SendEmail { mailTo, mailSubject, strBody,
       arrFileDinhKem: [path\file, path\filetonghop] }
     Báo cáo: ums.report.mount — cùng bộ tham số với danh sách (getList_MauImport "zonebtnBaoCao_TCHD").

   CỐ Ý BỎ / LỖI BẢN GỐC
     · Ô "Mẫu hoá đơn" (#dropMau_HoaDon): trình xử lý chọn mẫu bị comment → strMau_Id luôn ''
       → ô không có tác dụng. Bỏ ô, strTaichinh_Hoadon_Id gửi '' như bản gốc. Thanh tình trạng
       mẫu vẫn giữ (tổng mọi mẫu, đúng như bản gốc khi chưa chọn mẫu).
     · Nút "Đồng bộ hóa đơn điện tử" (#btnSearch_Sync): xem chú thích hàm dongBo() — đã
       chuyển, nhưng đây là đường ghi chưa từng chạy trên hệ thật (bản gốc lỗi biến).
     · Danh sách không tự nạp khi mở màn (bản gốc comment `me.getList_SHD()` ở init) — giữ.
     · Popover khi rê chuột, chọn cỡ trang, liên hoá đơn / đổi mẫu in: bỏ (trang trí / phôi in riêng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, H = ums.hoadon;
    var root = document.getElementById('tracuusohoadon');
    var st = { page: 1, size: 24, total: 0, data: [], mau: [], soId: '', loaded: false };

    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Tra cứu số hóa đơn</h1>' +
        '<div class="ums-page__actions">' +
          '<button type="button" class="ums-btn ums-btn--out-info" data-a="inDS" title="In toàn bộ hóa đơn đang hiển thị trên màn hình"><i class="fa-light fa-print"></i><span>In DS Hóa đơn</span></button>' +
          '<button type="button" class="ums-btn ums-btn--out-info" data-a="email" title="Gửi toàn bộ hóa đơn đang hiển thị trên màn hình"><i class="fa-light fa-envelope"></i><span>Gửi email</span></button>' +
          '<span data-x="report"></span>' +
          '<button type="button" class="ums-btn ums-btn--primary" data-a="dongbo" title="Đồng bộ hóa với hóa đơn điện tử"><i class="fa-light fa-rotate"></i><span>Đồng bộ hóa đơn điện tử</span></button>' +
        '</div></div>' +
        '<div data-x="list">' +
          '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body">' +
            '<div class="ums-grid ums-grid--3">' +
              ui.field('Người thu', '<select class="ums-select" data-x="nguoiThu"><option value="">Tất cả người thu</option></select>') +
              ui.field('Từ khoá', '<input class="ums-input" data-x="q" placeholder="Số hoá đơn, mã / tên người mua…" autocomplete="off">') +
              ui.field('Số tiền', '<input class="ums-input" data-x="soTien" placeholder="Nhập số tiền" autocomplete="off">') +
              ui.field('Từ ngày', '<div class="ums-inputwrap"><input class="ums-input" data-x="tuNgay" placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') +
              ui.field('Đến ngày', '<div class="ums-inputwrap"><input class="ums-input" data-x="denNgay" placeholder="dd/mm/yyyy" autocomplete="off"><i class="fa-light fa-calendar"></i></div>') +
              ui.field('Loại phiếu', '<div class="hd-radios">' +
                [['-1', 'Toàn bộ'], ['1', 'Phiếu thu'], ['2', 'Phiếu đã sửa'], ['0', 'Phiếu hủy']].map(function (r, i) {
                    return '<label class="ums-check"><input type="radio" name="hdLoaiPhieu" value="' + r[0] + '"' + (i === 0 ? ' checked' : '') + '> ' + r[1] + '</label>';
                }).join('') + '</div>') +
            '</div>' +
            '<div class="ums-row ums-row--between ums-u-mt-4">' +
              '<div class="hd-meters ums-u-flex1" data-x="mau"></div>' +
              ui.btn('search', { attr: { 'data-a': 'search' } }) +
            '</div>' +
          '</div></div>' +
          '<div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-receipt"></i> Danh sách số hóa đơn <span class="ums-u-faint ums-u-fz13" data-x="count"></span></div>' +
            '<div class="ums-panel__tools ums-u-fz14">Tổng tiền: <b class="ums-u-danger" data-x="tong">0</b></div></div>' +
            '<div data-x="cards">' + ui.empty('Nhập điều kiện rồi bấm Tìm kiếm', 'fa-magnifying-glass') + '</div>' +
          '</div>' +
        '</div>' +
        '<div data-x="xem" hidden><div class="ums-panel"><div class="ums-panel__head">' +
            '<div class="ums-panel__title"><i class="fa-light fa-file-invoice"></i> <span data-x="xemTitle">Hoá đơn</span></div>' +
            '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-a': 'dong' } }) +
              '<button type="button" class="ums-btn ums-btn--danger" data-a="huy"><i class="fa-light fa-trash-can"></i><span>Hủy hóa đơn</span></button>' +
              ui.btn('print', { text: 'In hóa đơn', attr: { 'data-a': 'in' } }) +
                          '</div></div><div class="ums-panel__body"><div data-x="phieu"></div></div></div></div>';

    function x(n) { return root.querySelector('[data-x="' + n + '"]'); }
    ui.datepicker(x('tuNgay'));
    ui.datepicker(x('denNgay'));
    ui.select2(x('nguoiThu'), { allowClear: true, placeholder: 'Tất cả người thu' });

    /* ---------- Tình trạng mẫu hoá đơn ---------------------------------- */
    function loadMau() {
        return ums.api.call({
            action: 'TC_HoaDon/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            pageIndex: 1, pageSize: 100000, strTuKhoa: '', strLoaiHoaDon_Id: '', strNguoiThucHien_Id: ''
        }).then(function (r) {
            st.mau = H.rows(r);
            if (st.mau.length) drawMau();
        }).catch(function (e) { ums.api.handle(e, 'nạp mẫu hoá đơn'); });
    }

    function drawMau() {
        var dung = 0, huy = 0;
        st.mau.forEach(function (m) { dung += m.SODADUNG; huy += m.SODAHUY; });
        var tong = dung + huy;
        var bar = function (lbl, n, tone) {
            var p = tong ? n * 100 / tong : 0;
            return '<div class="hd-meter--' + tone + '"><div class="hd-meter__lb"><span>' + lbl + '</span><span><b>' + n + '</b> /' + tong + '</span></div>' +
                '<div class="ums-meter"><div class="ums-meter__track"><div class="ums-meter__fill" style="width:' + p + '%"></div></div></div></div>';
        };
        x('mau').innerHTML = bar('Đã dùng', dung, 'ok') + bar('Đã sửa', 0, 'warn') + bar('Đã hủy', huy, 'bad');
    }

    H.nguoiThu().then(function (r) {
        H.fillSelect(x('nguoiThu'), r, 'ID', 'TAIKHOAN', 'Tất cả người thu');
        if (r.length === 1) jQuery(x('nguoiThu')).val(r[0].ID).trigger('change');   // bản gốc: chỉ 1 người thu thì giữ chọn
    }).catch(function (e) { ums.api.handle(e, 'nạp người thu'); });

    /* ---------- Danh sách số hoá đơn ------------------------------------ */
    function params() {
        var soTien = x('soTien').value.trim();
        var loai = root.querySelector('input[name="hdLoaiPhieu"]:checked');
        return {
            action: 'TC_HoaDon/LayDSTaiChinh_SoHoaDon', method: 'GET', versionAPI: 'v1.0',
            pageIndex: st.page, pageSize: st.size,
            strTuNgay: x('tuNgay').value.trim(),
            strDenNgay: x('denNgay').value.trim(),
            dSoTien: soTien ? soTien : -1,
            strTaichinh_Hoadon_Id: '',
            dChuaIn: -1,
            dTinhTrang: loai ? loai.value : undefined,
            strNguoiThucHien_Id: '',
            strNguoiThu_Id: H.val(x('nguoiThu')),
            strTuKhoa: x('q').value.trim()
        };
    }

    function load(page) {
        if (page) st.page = page;
        x('cards').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(params()).then(function (r) {
            st.data = H.rows(r);
            st.total = Number(r.pager) || 0;
            st.loaded = true;
            draw();
        }).catch(function (e) {
            x('cards').innerHTML = ui.fail(e.message);
            ums.api.handle(e, 'tra cứu số hoá đơn');
        });
    }

    /* tình trạng → sắc thái thẻ (ums.pat.cards) + nhãn */
    var LOAI = { '1': ['ok', 'Phiếu thu', 'ok'], '-1': ['bad', 'Đã hủy', 'bad'], '2': ['warn', 'Đã sửa', 'warn'] };

    function draw() {
        var d = st.data;
        x('count').textContent = st.total ? '(' + st.total + ')' : '';
        x('tong').textContent = d.length ? ui.money(d[0].TONGTIENDAXUATHOADON || 0) : '0';
        if (!st.total) d = [];
        ums.pat.cards({
            el: x('cards'), items: d, empty: 'Không tìm thấy dữ liệu',
            tone: function (r) { return (LOAI[String(r.TINHTRANG)] || [''])[0]; },
            render: function (r) {
                var l = LOAI[String(r.TINHTRANG)] || ['', '', 'mute'];
                return '<span class="ums-row ums-row--between"><span class="ums-card__no">#' + esc(r.SOHOADON) + '</span>' +
                    (l[1] ? ui.badge(l[1], l[2]) : '') + '</span>' +
                    ums.pat.cardRow('Tổng tiền', ui.money(r.TONGTIEN)) +
                    ums.pat.cardRow('Người thu', r.NGUOITAO_TAIKHOAN) +
                    ums.pat.cardRow('Ngày thu', r.NGAYTAO_DD_MM_YYYY_HHMMSS) +
                    ums.pat.cardRow('Người mua', ((r.MASONGUOIMUAHANG || '') + ' ' + (r.HOTENNGUOIMUAHANG || '')).trim());
            },
            page: {
                index: st.page, size: st.size, total: st.total, onChange: load,
                onSize: function (v) { st.size = v; load(1); }
            },
            onPick: function (r) { xem(r.ID, r.TINHTRANG); }
        });
    }

    /* ---------- Xem / in / huỷ ------------------------------------------- */
    function xem(id, tt) {
        st.soId = id;
        root.querySelector('[data-a="huy"]').hidden = String(tt) === '-1';     // viewchungtu_DaXoa: ẩn nút huỷ
        var r = st.data.find(function (z) { return String(z.ID) === String(id); }) || {};
        x('xemTitle').textContent = 'Hoá đơn #' + (r.SOHOADON || '');
        ui.swap(x('list'), x('xem'));
        H.xem(x('phieu'), id, 'HOADON').catch(function () {});
    }

    function dong() { ui.swap(x('xem'), x('list')); }

    function huy() {
        ui.confirm('Bạn có chắc chắn muốn hủy hóa đơn không!', { tone: 'bad', ok: 'Hủy hóa đơn' }).then(function (yes) {
            if (!yes) return;
            H.huy(st.soId).then(function () {
                load(); loadMau(); dong();
                ui.toast('Xóa chứng từ thành công', 'ok');
            }).catch(function (e) { ums.api.handle(e, 'huỷ hoá đơn'); });
        });
    }

    /* ---------- Đồng bộ hoá đơn điện tử (btnSearch_Sync) ------------------
       Bản gốc: me.getList_HoaDonChuaSinh(strTuKhoa) — biến strTuKhoa không có
       trong phạm vi nên bấm là ReferenceError, tính năng CHƯA BAO GIỜ chạy.
       Chính hàm đó lại KHÔNG nhận tham số nào, nên ở đây gọi không đối số —
       đúng ý định của bản gốc. Chuỗi ba lời gọi chép nguyên:
         TC_HoaDonChuaSinh/LayDanhSach            GET  hoá đơn chờ nhà cung cấp phát hành
         HDDT_HoaDon/GetFiles                     GET  transectionId, ba tham số còn lại để RỖNG
         TC_HoaDonChuaSinh/CapNhatThongTinHoaDon  POST strId, str_PhatHanh_invoiceNo = Data[2],
                                                       strDuongDanFileHoaDon = Data[0]
       Khác bản gốc: bản gốc bắn N lời gọi cùng lúc rồi đếm complete; ở đây
       dùng ums.ui.batch (tuần tự, có hộp tiến độ) — tầng chung thay cho
       genHTML_Progress/start_Progress. Hoá đơn chưa có số thì BỬA QUA, không ghi
       đè rỗng (bản gốc ghi luôn dù Data rỗng).
       ⚠ Đây là đường GHI chưa từng chạy trên hệ thật — xem CLAUDE.md mục 11. */
    function dongBo() {
        return ums.api.call({ action: 'TC_HoaDonChuaSinh/LayDanhSach', method: 'GET' })
            .then(function (r) {
                var ds = r.data || [];
                if (!ds.length) return ui.toast('Đã đồng bộ', 'ok');
                var bo = 0;
                return ui.batch(ds.map(function (a) {
                    return function () {
                        return ums.api.call({
                            action: 'HDDT_HoaDon/GetFiles', method: 'GET', silent: true,
                            transectionId: a.TRANSACTIONID,
                            strDuongDanFile: '', strDuongDanFileTongHop: '', strSoHoaDon: ''
                        }).then(function (g) {
                            var d = g.data || [];
                            if (!d[2] && !d[0]) { bo++; return; }   // nhà cung cấp chưa phát hành xong
                            return ums.api.call({
                                action: 'TC_HoaDonChuaSinh/CapNhatThongTinHoaDon', silent: true,
                                strId: a.ID, str_PhatHanh_invoiceNo: d[2], strDuongDanFileHoaDon: d[0]
                            });
                        });
                    };
                }), { title: 'Đồng bộ hoá đơn điện tử' }).then(function (kq) {
                    ui.toast('Đồng bộ ' + (kq.ok - bo) + '/' + ds.length + ' hoá đơn' +
                        (bo ? ', ' + bo + ' chưa có số' : '') +
                        (kq.fail ? ', ' + kq.fail + ' lỗi' : ''), kq.fail ? 'warn' : 'ok');
                    if (st.loaded) load();
                });
            }).catch(function (e) { ums.api.handle(e, 'đồng bộ hoá đơn điện tử'); });
    }

    /* ---------- In toàn bộ (btnSearch_InDS) ------------------------------ */
    function serverPath() {
        return ums.api.call({ action: 'HDDT_HoaDon/GetServerPath', method: 'GET' }).then(function (r) { return r.data; });
    }

    function inDS() {
        var hddt = [], hd = [], soChuaCo = [], chuaCo = [];
        st.data.forEach(function (r) {
            if (r.DUONGDANFILEHOADON) hddt.push(r.DUONGDANFILEHOADON);
            else if (Number(r.LAHOADONDIENTU) === 1) { soChuaCo.push(r.SOHOADON); chuaCo.push(r); }
            else hd.push(r);
        });
        if (!st.data.length) return ui.toast('Chưa có hoá đơn nào đang hiển thị — hãy tìm kiếm trước', 'warn');

        // Bản gốc lấy tệp cho hoá đơn điện tử chưa có tệp NGAY, không chờ xác nhận
        if (chuaCo.length) {
            ui.batch(chuaCo.map(function (a) {
                return function () {
                    return H.getFiles(a, true).then(function (d) {
                        ui.toast(d && d[0] ? 'Lấy file thành công' : 'Lấy file không thành công', d && d[0] ? 'ok' : 'warn');
                    });
                };
            }), { title: 'Đang lấy tệp hoá đơn điện tử', toast: false }).then(function () {
                setTimeout(function () { load(); }, 2000);
            });
        }

        var msg = 'Số hóa đơn điện tử sẽ in: ' + hddt.length +
            '. Số hóa đơn điện tử chưa có file: ' + (soChuaCo.toString() || '0') +
            '. Số hóa đơn tự in: ' + hd.length + '.';
        ui.confirm(msg, { title: 'In toàn bộ hóa đơn đang hiển thị', ok: 'In' }).then(function (yes) {
            if (!yes) return;
            if (hd.length) inTuIn(hd);
            if (hddt.length) {
                serverPath().then(function (path) {
                    return ums.api.call({ action: 'TC_HoaDon/InNhieuHoaDon', arrHDDT: hddt, strPath: path });
                }).then(function (r) {
                    var id = r.raw && r.raw.Id;
                    if (id) H.openTab(H.hddtFile(id));
                    if (r.message) ui.toast('HDDT Lỗi: ' + r.message, 'warn');
                }).catch(function (e) { ums.api.handle(e, 'in nhiều hoá đơn điện tử'); });
            }
        });
    }

    /* In nhiều hoá đơn tự in: MỘT khung xem, mỗi hoá đơn nối thêm một trang
       (ums.phieu.viewer.add tự chèn ngắt trang) — trước đây mỗi hoá đơn một
       hộp riêng rồi in cả vùng chứa. */
    function inTuIn(list) {
        var host = x('phieu');
        host.innerHTML = '';
        delete host.__phieu;
        var v = H.viewer(host);
        ui.batch(list.map(function (r) {
            return function () {
                return v.add({ id: r.ID, loai: 'HOADON' }).then(function (row) {
                    if (!row) throw new Error('Không dựng được hoá đơn ' + (r.SOHOADON || r.ID));
                    return row;
                });
            };
        }), { title: 'Đang dựng hoá đơn để in', toast: false }).then(function (res) {
            x('xemTitle').textContent = 'In ' + res.ok + ' hoá đơn tự in';
            root.querySelector('[data-a="huy"]').hidden = true;
            st.soId = '';
            ui.swap(x('list'), x('xem'));
        });
    }

    /* ---------- Gửi email (btnSearch_SendEmail) -------------------------- */
    var EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /** getFilesPath riêng của màn này: không gửi strPhuongThuc_MA, lưu theo ID */
    function tepCuaHoaDon(a) {
        if ((a.DUONGDANFILEHOADON !== null && a.DUONGDANFILETONGHOP !== null) || a.TRACSECTION_ID === null) {
            return Promise.resolve([a.DUONGDANFILEHOADON, a.DUONGDANFILETONGHOP]);
        }
        return ums.api.call({
            action: 'HDDT_HoaDon/GetFiles', method: 'GET', silent: true,
            transectionId: a.TRACSECTION_ID, strDuongDanFile: a.DUONGDANFILEHOADON,
            strDuongDanFileTongHop: a.DUONGDANFILETONGHOP, strSoHoaDon: a.SOHOADON
        }).then(function (r) {
            var d = r.data || [];
            H.luuDuongDan(a.ID, d[0], d[1]);
            return d;
        });
    }

    function email() {
        var gui = [], sai = [];
        st.data.forEach(function (r) {
            if (r.EMAIL && EMAIL.test(String(r.EMAIL).toLowerCase())) gui.push(r); else sai.push(r.SOHOADON);
        });
        if (!gui.length) return ui.toast('Không tìm thấy email nào có thể gửi', 'warn');
        if (sai.length) ui.toast('Số phiếu sai email: ' + sai.length + '. ' + sai.toString(), 'warn', { timeout: 8000 });
        ui.dialog({
            title: 'Gửi hoá đơn qua email', icon: 'fa-envelope', size: 'md',
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-4">Số phiếu sẽ gửi: <b>' + gui.length + '</b>. Tệp hoá đơn được hệ thống tự đính kèm.</div>' +
                ui.field('Tiêu đề', '<input class="ums-input" data-e="tieuDe">') +
                ui.field('Nội dung', '<input class="ums-input" data-e="noiDung">'),
            buttons: [{ text: 'Gửi', kind: 'save', onClick: function (dlg) {
                var tieuDe = dlg.body.querySelector('[data-e="tieuDe"]').value;
                var noiDung = dlg.body.querySelector('[data-e="noiDung"]').value;
                serverPath().then(function (path) {
                    return ui.batch(gui.map(function (a) {
                        return function () {
                            return tepCuaHoaDon(a).then(function (f) {
                                return ums.api.call({
                                    action: 'CMS_NguoiDung/SendEmail',
                                    mailTo: a.EMAIL, mailSubject: tieuDe, strBody: noiDung,
                                    arrFileDinhKem: [path + '\\' + f[0], path + '\\' + f[1]]
                                });
                            });
                        };
                    }), { title: 'Đang gửi email', okText: 'Đã gửi email' });
                }).catch(function (e) { ums.api.handle(e, 'gửi email'); });
            } }]
        });
    }

    /* ---------- Báo cáo ---------------------------------------------------- */
    ums.report.mount(x('report'), {
        collect: function (add) {
            var p = params();
            ['action', 'versionAPI', 'pageIndex', 'pageSize', 'strTuNgay', 'strDenNgay', 'dSoTien', 'strTaichinh_Hoadon_Id',
             'dChuaIn', 'dTinhTrang', 'strNguoiThucHien_Id', 'strNguoiThu_Id', 'strTuKhoa'].forEach(function (k) { add(k, p[k]); });
        }
    });

    /* ---------- Sự kiện ---------------------------------------------------- */
    root.addEventListener('click', function (e) {
        var a = e.target.closest('[data-a]');
        if (!a) return;
        switch (a.getAttribute('data-a')) {
            case 'search': load(1); break;
            case 'inDS': inDS(); break;
            case 'email': email(); break;
            case 'dongbo': dongBo(); break;
            case 'dong': dong(); break;
            case 'huy': huy(); break;
            case 'in':
                H.print(x('phieu'), 'In hoá đơn');     // printPhieu: in rồi quay về danh sách
                dong();
                break;
        }
    });
    root.addEventListener('change', function (e) {
        if (e.target.name === 'hdLoaiPhieu') load(1);        // .rdLoaiPhieu_HoaDon change
    });
    root.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target === x('q')) { e.preventDefault(); load(1); }
    });

    root._hd = { st: st, params: params, load: load };
    loadMau();
})();
