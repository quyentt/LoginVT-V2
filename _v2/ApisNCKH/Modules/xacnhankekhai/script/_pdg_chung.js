/* =========================================================================
   NCKH — Xác nhận kê khai: "Tiêu chí thi đua khen thưởng" (giảng viên / cán bộ)
   Khung chung của hai màn phieudanhgia (NS_TDKT_GiangVien) và phieudanhgiacanbo (NS_TDKT_CanBo).
   Bản gốc: ApisNCKH/Modules/xacnhankekhai/html/phieudanhgia*.html + script/phieudanhgia*.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (MỘT cột, col-lg-12): khung "Tìm kiếm" (Đơn vị, Thành viên, Từ khoá, nút Tìm kiếm,
   nút Báo cáo) + khung "Danh sách giảng viên / cán bộ" (bảng nhiều cột, tiêu đề hai tầng, cột nút
   Xác nhận nhỏ). Bấm TÊN → khung "Phiếu đánh giá" THAY CHỖ danh sách (bảng tiêu chí + Thông tin sáng
   kiến + Tổng điểm, chân: Đóng · Xác nhận) → hộp "Xác nhận sản phẩm" (nội dung + nút tình trạng lớn
   + lịch sử). Giữ đúng bố cục đó.

   KHÁC bản CCB (dgplnguoilaodong/phieudanhgia*, ums.dgpl.phieu): bản CCB là phiếu TỰ ĐÁNH GIÁ của người
   đăng nhập (hai cột: kế hoạch trái, phiếu + Lưu phải). Bản NCKH là màn QUẢN TRỊ xem phiếu của TỪNG
   người rồi XÁC NHẬN — không có nút Lưu (html gốc không có #btnSave). ums.dgpl.phieu dựng cứng khung
   hai cột + đọc LayChiTiet theo userId + CSS gắn id #dg-phieu → không nhúng được mà không sửa tệp CCB
   (cờ đề xuất ghi ở báo cáo). Ở đây giữ CÙNG cấu trúc dòng (ten / gio / donVi / yk) như cấu hình CCB.

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       <ctrl>/LayDanhSach            GET  strNhanSu_TDKT_KeHoach_Id '', strDaoTao_CoCauToChuc_Id, strThanhVien_Id
       <ctrl>/LayChiTiet             GET  strNhanSu_HoSoCanBo_Id = NHANSU_HOSOCANBO_ID của dòng, strNhanSu_TDKT_KeHoach_Id ''
       NS_HoSoV2/LayDanhSach         GET  ô Thành viên — strTuKhoa '', 1/1000000, strDaoTao_CoCauToChuc_Id, strNguoiThucHien_Id '', dLaCanBoNgoaiTruong 0
       ums.ref.coCauToChuc           ô Đơn vị (edu.system.getList_CoCauToChuc, iTrangThai 1)
       NCKH_SP_XacNhanKeKhai/ThemMoi POST strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id = userId
                                          (edu.extend.save_XacNhanSanPham — Corei/systemextend.js:3267)
       NCKH_SP_XacNhanKeKhai/LayDanhSach GET strTuKhoa '', strSanPham_Id, strTinhTrang_Id '', strNguoiThucHien_Id '', 1/100000
                                          (edu.extend.getList_XacNhanSanPham — lịch sử trong hộp)
       Nút tình trạng: giảng viên = danh mục NCKH.XNKK; cán bộ = NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung
                       GET strChucNang_Id, strNguoiThucHien_Id. Bỏ mục MA = "XNKKCHUAKHAI" (như gốc).
       Mẫu báo cáo: strKS_DonViBoPhan_Id, strGiangVien_Id, strNguoiDangNhap_Id.

   Lỗi rõ của bản gốc — làm theo Ý ĐỊNH:
     · jquery.knob.min.js RỖNG (0 byte) → $(".knob").knob() ném lỗi NGAY trong init: bản giảng viên dừng
       trước khi gắn mọi nút (màn chết hẳn), bản cán bộ dừng trước khi nạp danh sách. "Tổng điểm" nay là
       vòng tròn số (CSS), không cần thư viện.
     · Hộp Xác nhận: gốc tìm tên bằng objGetDataInData(NHANSU_HOSOCANBO_ID, …, "ID") (sai cột → TypeError,
       không nạp lịch sử), giảng viên gọi edu.extend.save_XacNhanGiangVien KHÔNG tồn tại (không lưu được),
       cán bộ lưu strSanPham_Id = NHANSU_HOSOCANBO_ID trong khi nút nhỏ ở bảng lưu ID DÒNG. Thống nhất: mọi
       xác nhận (nút nhỏ ở bảng lẫn hộp) và lịch sử đều theo ID DÒNG — đúng cột "Xác nhận cuối cùng" của dòng.
     · Ý kiến "Số giờ giảng dạy đại học / sau đại học": gốc đổ YK_… vào ô không có (txtYK_GioDinhMucDH…)
       → nay đổ đúng dòng.
     · Báo cáo bản giảng viên đọc đơn vị từ ô không có (dropSearch_DonViThanhVien_GiaiThuong) → gửi ô Đơn vị.
     · Điểm chuyên môn (cán bộ) cộng 7 cột bằng "+" (chuỗi thì thành nối chữ) → cộng số.
   Tự chốt:
     · Phiếu CHỈ XEM (ý kiến, sáng kiến hiện chữ) — gốc có ô nhập nhưng không có đường lưu nào.
     · Ô từ khoá: gốc không gửi (LayDanhSach không có strTuKhoa) → lọc tại chỗ trên Tên / Mã.
     · Đơn vị → Thành viên nối tầng (luật cha → con); bản cán bộ đổi Đơn vị là tải lại danh sách (như gốc).
     · Ô "Điểm" của sáng kiến và cột "Điểm thi đua" của phiếu: gốc không đổ gì → bỏ cột/ô rỗng.
   Nút "Kê khai" giữ đường dẫn gốc (/modules/sanphamkhoahoc/html/…) qua ums.app.openPath.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function so(v) { var n = Number(String(e(v)).replace(/,/g, '')); return isNaN(n) ? 0 : n; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function tron(n) { return n ? Math.round(n * 100) / 100 : ''; }

    var N = ums.nckhPdg = {};
    N.so = so; N.tron = tron; N.e = e;
    /** Cột số trong bảng danh sách */
    N.c = function (title, prop, group) { var c = { title: title, prop: prop, cls: 'is-center' }; if (group) c.group = [group]; return c; };

    /* ---------- Hộp "Xác nhận sản phẩm" (modal_XacNhan) ------------------- */
    function lichSu(el, sanPham) {
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'NCKH_SP_XacNhanKeKhai/LayDanhSach', method: 'GET', strTuKhoa: '', strSanPham_Id: sanPham,
            strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                ui.table({ el: el, rows: arr(r.data), empty: 'Chưa có lượt xác nhận', columns: [
                    { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '110px' }] });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xác nhận'); });
    }
    function luuXacNhan(sanPham, tinhTrang, noiDung) {
        return ums.api.call({ action: 'NCKH_SP_XacNhanKeKhai/ThemMoi', method: 'POST', strId: '', strSanPham_Id: sanPham,
            strNoiDung: noiDung, strTinhTrang_Id: tinhTrang, strNguoiXacnhan_Id: uid() })
            .then(function () { ui.toast('Xác nhận thành công', 'ok'); return true; })
            .catch(function (err) { ums.api.handle(err, 'xác nhận'); return false; });
    }
    function iconTT(t) { return esc(ums.iconFA4 ? ums.iconFA4(e(t.THONGTIN1) || 'fa fa-circle-check') : 'fa-light fa-circle-check'); }
    function nutTT(t, lon) {
        return '<button type="button" class="' + (lon ? 'pdg-xn__nut' : 'pdg-xnn') + '" data-tt="' + esc(t.ID) + '" title="' + esc(e(t.TEN)) + '">' +
            '<i class="' + iconTT(t) + '"' + (t.THONGTIN2 ? ' style="' + esc(t.THONGTIN2) + '"' : '') + '></i>' +
            (lon ? '<span>' + esc(e(t.TEN)) + '</span>' : '') + '</button>';
    }
    /** o = { ds (tình trạng), sanPham, ten, onDone } */
    N.hopXacNhan = function (o) {
        var dlg = ui.dialog({ title: 'Xác nhận sản phẩm: ' + e(o.ten), icon: 'fa-circle-check', size: 'lg',
            body: ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div>' +
                '<div class="pdg-xn" data-x="nut">' + (o.ds.length ? o.ds.map(function (t) { return nutTT(t, true); }).join('') : ui.empty('Chưa khai báo tình trạng xác nhận')) + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        lichSu(q('ls'), o.sanPham);
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            luuXacNhan(o.sanPham, b.getAttribute('data-tt'), (q('nd').value || '').trim()).then(function (ok) {
                if (!ok) return;
                dlg.close();
                if (o.onDone) o.onDone();
            });
        });
        return dlg;
    };
    /** Nút nhỏ trên dòng: hỏi lại kèm ô "Mô tả xác nhận" (edu.system.confirm + txtMota_XacNhan_small) */
    function hoiNhanh(tt, row, doiTuong, onDone) {
        ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'sm',
            body: '<p>Xác nhận <b>' + esc(e(tt.TEN)) + '</b> cho ' + esc(doiTuong) + ' <b>' + esc(e(row.NHANSU_HOSOCANBO_HOTEN)) + '</b>?</p>' +
                ui.field('Mô tả xác nhận', '<input class="ums-input" data-x="mt" placeholder="Mô tả xác nhận" autocomplete="off">'),
            buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (dlg) {
                luuXacNhan(row.ID, tt.ID, (dlg.body.querySelector('[data-x="mt"]').value || '').trim()).then(function (ok) { if (ok && onDone) onDone(); });
            } }] });
    }

    /* =====================================================================
       Màn: cfg = {
         root, tieuDe, ctrl: 'NS_TDKT_GiangVien', doiTuong: 'giảng viên',
         nguonXacNhan: () → Promise<[tình trạng]>,
         cot: [cột ui.table sau Tên / Mã, trước ba cột xác nhận],
         taiKhiDoiDonVi: true  (bản cán bộ: đổi Đơn vị là tải lại danh sách),
         tieuChi: [{ ten, keHoach, c }] (phiếu cán bộ — khối "Điểm chuyên môn"),
         rows: [{ ten, gio: COT | fn(d), donVi: 'Giờ chuẩn' | { keKhai }, yk: COT_YK }],
         xepLoai: true (phiếu cán bộ hiện ô Xếp loại cạnh Tổng điểm)
       }
       ===================================================================== */
    N.man = function (cfg) {
        var root = cfg.root, ds = [], dsTT = [], dmVaiTro = [], dang = null;
        var dt = cfg.doiTuong;
        root.innerHTML = '<div data-v="ds">' +
            pat.page(cfg.tieuDe, '<div data-z="bc"></div>') +
            pat.filterBar([
                { key: 'dv', type: 'select', label: cfg.nhanDonVi || 'Tất cả đơn vị' },
                { key: 'tv', type: 'select', label: 'Tất cả thành viên đăng ký' },
                { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách ' + dt, icon: 'fa-users', count: 'n', flush: true, zone: 'bang' }) +
            '</div><div data-v="pg" hidden></div>';
        ui.enhance(root);
        var vDs = root.querySelector('[data-v="ds"]'), vPg = root.querySelector('[data-v="pg"]');
        function f(k) { return vDs.querySelector('[data-f="' + k + '"]'); }
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

        /* ---------- Ô lọc ---------- */
        ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(f('dv'), d, { name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
        function napTV() {
            if (!f('dv').value) { pat.fill(f('tv'), []); return; }
            ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 1000000,
                strDaoTao_CoCauToChuc_Id: f('dv').value, strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0, silent: true })
                .then(function (r) { pat.fill(f('tv'), arr(r.data), { name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } }); })
                .catch(function (err) { ums.api.handle(err, 'thành viên'); });
        }
        if (window.jQuery) jQuery(f('dv')).on('select2:select select2:clear', function () { napTV(); if (cfg.taiKhiDoiDonVi) tai(); });
        pat.chain([f('dv'), f('tv')], { phatLai: false });
        ums.api.dm('CCB.VTSK').then(function (d) { dmVaiTro = d; }).catch(function () {});
        cfg.nguonXacNhan().then(function (d) {
            dsTT = arr(d).filter(function (t) { return t.MA !== 'XNKKCHUAKHAI'; });
            if (ds.length) ve();
        }).catch(function (err) { ums.api.handle(err, 'tình trạng xác nhận'); });

        /* ---------- Bảng danh sách ---------- */
        var cot = [
            { title: 'Tên ' + dt, cls: 'is-nowrap', render: function (r, i) {
                return '<button type="button" class="ums-link" data-mo="' + i + '">' + esc(e(r.NHANSU_HOSOCANBO_HOTEN)) + '</button>'; } },
            { title: 'Mã ' + dt, prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-nowrap' }
        ].concat(cfg.cot, [
            { title: 'Xác nhận', cls: 'is-center is-nowrap', render: function (r, i) {
                return '<div class="pdg-xnn-nhom" data-dong="' + i + '">' + dsTT.map(function (t) { return nutTT(t, false); }).join('') + '</div>'; } },
            { title: 'Xác nhận cuối cùng', cls: 'is-center is-nowrap', render: function (r) {
                return r.KETQUAXACNHAN_TEN ? '<span class="pdg-kq"><i class="' + iconTT({ THONGTIN1: r.KETQUAXACNHAN_THONGTIN1 }) + '"' +
                    (r.KETQUAXACNHAN_THONGTIN2 ? ' style="' + esc(r.KETQUAXACNHAN_THONGTIN2) + '"' : '') + '></i> ' + esc(r.KETQUAXACNHAN_TEN) + '</span>' : ''; } },
            { title: 'Nội dung xác nhận', render: function (r) { return '<div class="pdg-nd">' + ui.escBr(r.KETQUAXACNHAN_NOIDUNG) + '</div>'; } }
        ]);
        var hien = [];
        function ve() {
            var k = (f('q').value || '').trim().toLowerCase();
            hien = ds.filter(function (r) { return !k || (e(r.NHANSU_HOSOCANBO_HOTEN) + ' ' + e(r.NHANSU_HOSOCANBO_MASO)).toLowerCase().indexOf(k) >= 0; });
            z('n').textContent = '(' + hien.length + ')';
            ui.table({ el: z('bang'), rows: hien, columns: cot, empty: 'Không có ' + dt + ' nào' });
        }
        function tai() {
            z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: cfg.ctrl + '/LayDanhSach', method: 'GET', strNhanSu_TDKT_KeHoach_Id: '',
                strDaoTao_CoCauToChuc_Id: f('dv').value, strThanhVien_Id: f('tv').value })
                .then(function (r) { ds = arr(r.data); ve(); })
                .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách ' + dt); });
        }
        ums.report.mount(z('bc'), { collect: function (add) {
            add('strKS_DonViBoPhan_Id', f('dv').value); add('strGiangVien_Id', f('tv').value); add('strNguoiDangNhap_Id', uid());
        } });

        /* ---------- Phiếu đánh giá (zone_PhieuDG) — chỉ xem ---------- */
        function kk(ten, v, cls) { return '<div class="ums-kv' + (cls ? ' ums-kv--' + cls : '') + '"><span>' + esc(ten) + '</span><b>' + esc(e(v)) + '</b></div>'; }
        function giaTri(spec, d) { return typeof spec === 'function' ? spec(d) : (spec ? e(d[spec]) : ''); }
        function donVi(r) {
            if (r.donVi && r.donVi.keKhai) {
                return '<button type="button" class="ums-btn ums-btn--primary ums-btn--sm" data-kekhai="' + esc(r.donVi.keKhai) + '">' +
                    '<i class="fa-light fa-pen-to-square"></i><span>Kê khai</span></button>';
            }
            return esc(r.donVi || '');
        }
        function vePhieu(d) {
            var stt = 0;
            var h = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined pdg-bang"><thead><tr>' +
                '<th class="is-center" style="width:56px">Stt</th><th>Nội dung</th><th class="is-center" style="width:90px">Giá trị</th>' +
                '<th class="is-center" style="width:110px">Đơn vị</th><th>Ý kiến phản hồi</th></tr></thead><tbody>';
            if (cfg.tieuChi) {
                stt++;
                h += '<tr><td class="is-center">' + stt + '</td><td colspan="4"><b>Điểm chuyên môn</b>' +
                    '<div class="ums-tablewrap pdg-tieuchi"><table class="ums-table ums-table--lined ums-table--tight"><thead><tr>' +
                    '<th class="is-center" style="width:56px">Stt</th><th>Nội dung</th><th class="is-center" style="width:92px">Kế hoạch</th>' +
                    '<th class="is-center" style="width:94px">Thực tế</th></tr></thead><tbody>' +
                    cfg.tieuChi.map(function (t, i) {
                        return '<tr><td class="is-center">' + (i + 1) + '</td><td>' + esc(t.ten) + '</td><td class="is-center">' + esc(t.keHoach) +
                            '</td><td class="is-center pdg-so">' + esc(e(d[t.c])) + '</td></tr>';
                    }).join('') + '</tbody></table></div></td></tr>';
            }
            cfg.rows.forEach(function (r) {
                stt++;
                h += '<tr><td class="is-center">' + stt + '</td><td><b>' + esc(r.ten) + '</b></td>' +
                    '<td class="is-center pdg-so">' + esc(giaTri(r.gio, d)) + '</td><td class="is-center">' + donVi(r) + '</td>' +
                    '<td>' + esc(r.yk ? e(d[r.yk]) : '') + '</td></tr>';
            });
            h += '</tbody></table></div>';
            var vt = dmVaiTro.filter(function (x) { return e(x.ID) === e(d.VAITROSANGKIEN_ID); })[0];
            var sk = '<div class="ums-grid ums-grid--2">' +
                '<div>' + kk('Tên sáng kiến', d.TENSANGKIENCAITIEN) + kk('Số quyết định công nhận', d.SOQUYETDINHSANGKIEN) + '</div>' +
                '<div>' + kk('Ngày công nhận', d.NGAYTHANGNAMSANGKIEN, 'thuong') + kk('Vai trò', vt ? vt.TEN : '') + '</div></div>';
            var tong = '<div class="pdg-tong"><div class="pdg-tong__khoi"><div class="pdg-tong__so">' + esc(e(d.TONGDIEM) || '0') + '</div>' +
                '<div class="pdg-tong__nhan">Tổng điểm</div></div>' +
                (cfg.xepLoai ? '<div class="pdg-tong__khoi"><div class="pdg-tong__xl">' + esc(e(d.XEPLOAI)) + '</div><div class="pdg-tong__nhan">Xếp loại</div></div>' : '') + '</div>';
            vPg.querySelector('[data-z="pgbang"]').innerHTML = h;
            vPg.querySelector('[data-z="pgsk"]').innerHTML = sk + tong;
        }
        function moPhieu(row) {
            dang = row;
            vPg.innerHTML = pat.page('Phiếu đánh giá',
                    ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('confirm', { mod: 'primary', attr: { 'data-a': 'xn' } })) +
                pat.panel({ title: e(row.NHANSU_HOSOCANBO_HOTEN) + (row.NHANSU_HOSOCANBO_MASO ? ' - ' + row.NHANSU_HOSOCANBO_MASO : ''),
                    icon: 'fa-file-lines', flush: true, zone: 'pgbang', body: ui.empty('Đang tải…', 'fa-spinner fa-spin') }) +
                pat.panel({ title: 'Thông tin sáng kiến', icon: 'fa-lightbulb', zone: 'pgsk' });
            ui.swap(vDs, vPg);
            vePhieu({});
            ums.api.call({ action: cfg.ctrl + '/LayChiTiet', method: 'GET', strNhanSu_HoSoCanBo_Id: e(row.NHANSU_HOSOCANBO_ID), strNhanSu_TDKT_KeHoach_Id: '' })
                .then(function (r) { var d = arr(r.data); vePhieu(d[0] || {}); if (!d.length) ui.toast('Chưa có phiếu đánh giá của ' + dt + ' này', 'info'); })
                .catch(function (err) { ums.api.handle(err, 'tải phiếu đánh giá'); });
        }
        function dong() { dang = null; ui.swap(vPg, vDs); }

        root.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a], [data-mo], [data-tt], [data-kekhai]');
            if (!b || !root.contains(b)) return;
            if (b.hasAttribute('data-mo')) moPhieu(hien[Number(b.getAttribute('data-mo'))]);
            else if (b.hasAttribute('data-tt')) {
                var nhom = b.closest('[data-dong]');
                var tt = dsTT.filter(function (t) { return e(t.ID) === b.getAttribute('data-tt'); })[0];
                if (nhom && tt) hoiNhanh(tt, hien[Number(nhom.getAttribute('data-dong'))], dt, tai);
            } else if (b.hasAttribute('data-kekhai')) { if (ums.app && ums.app.openPath) ums.app.openPath(b.getAttribute('data-kekhai')); }
            else {
                var a = b.getAttribute('data-a');
                if (a === 'search') tai();
                else if (a === 'dong') dong();
                else if (a === 'xn' && dang) {
                    N.hopXacNhan({ ds: dsTT, sanPham: dang.ID, ten: dang.NHANSU_HOSOCANBO_HOTEN, onDone: function () { dong(); tai(); } });
                }
            }
        });
        f('q').addEventListener('input', function () { if (ds.length) ve(); });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
        tai();
    };
})();
