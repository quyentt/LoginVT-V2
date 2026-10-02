/* =========================================================================
   Nhập học — khung CHUNG hai cột "chọn người học theo kế hoạch nhập học"
   ums.nhDs — dùng cho thuhoso/{thuhosonew, thuhoso} và ruttien/{ruttiennew, ruttien}
   (ruttien nạp chéo ../../thuhoso/scripts/_dsnh.js).
   ---------------------------------------------------------------------------
   Bản gốc (bốn tệp chép nhau từng khối):
     cột trái  #dropKeHoachNhapHoc_* + radio "Điều kiện" (Đã nhập / Chưa / Toàn bộ) + ô từ khoá
               + bảng #tblNguoiHoc_* (ảnh · họ tên + SBD · "Chọn" + thẻ đã nhập học), popover khi rê
     khối "Hồ sơ" #1 / #2 (genDetail_NguoiHoc_TTTS)
   Lời gọi (chép nguyên văn):
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP
         PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc   { strNguoiThucHien_Id = userId }
     SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP
         PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS (POST, phân trang máy chủ)
         { dDaNhapHoc, strTaiChinh_KeHoach_Id, strNguoiThucHien_Id: '', strTuKhoa, pageIndex, pageSize }
       · bản CŨ gọi edu.extend.getList_NguoiHoc_TTTS — ở vỏ indexi (Corei/systemextend.js:7276) chính là
         lời gọi trên với tiền tố 'SV_CORE_NhapHoc_ThuTien_MH' → chép đúng chuỗi đó khi cờ cu.

   Khác bản gốc (theo luật chung / sửa lỗi):
     · Cột trái theo BO-CUC luật 12: Kế hoạch + Điều kiện nằm trong "Bộ lọc nâng cao" (mở sẵn — kế hoạch
       bắt buộc chọn), gõ từ khoá tự tìm, không nút Tìm kiếm, nút Tải lại trên tiêu đề cột.
     · Chưa chọn kế hoạch: gốc gửi strTaiChinh_KeHoach_Id = "xxx" (trả rỗng) — ở đây không gọi, hiện lời
       nhắc. Nút tìm của thuhoso gốc quên đổi "" → "xxx" (gửi RỖNG → có thể trả người học mọi kế hoạch) —
       thống nhất như các đường còn lại.
     · Gốc: còn đúng một kết quả thì tự bấm "Chọn" — bỏ (luật 12: không tự chọn).
     · Mục danh sách: link "Xem Hồ sơ" ở cột trái của thuhosonew KHÔNG có trình xử lý (chỉ bắt trong bảng
       túi hồ sơ) → bỏ, giữ nhãn "Đã nhập học" (thẻ fa-tag của gốc).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, pat = ums.pat;
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function co(v) { return v !== null && v !== undefined && v !== ''; }

    var N = ums.nhDs = {};

    N.AC = {
        keHoach: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIKJAkuICIpDykgMQkuIgPP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSKeHoachNhapHoc' },
        nguoiHoc: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS' },
        nguoiHocCu: { action: 'SV_CORE_NhapHoc_ThuTien_MH/DSA4BRIQDRIXHg8mNC4oCS4iHhUVFRIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSQLSV_NguoiHoc_TTTS' }
    };

    N.hoTen = function (r) { return (e(r.HODEM) + ' ' + e(r.TEN)).trim(); };
    N.ngaySinh = function (r) { return e(r.NGAYSINH_NGAY) + '/' + e(r.NGAYSINH_THANG) + '/' + e(r.NGAYSINH_NAM); };
    N.queQuan = function (r) {
        return e(r.HOKHAU_PHUONGXAKHOIXOM) + ' - ' + e(r.HOKHAU_QUANHUYEN_TEN) + ' - ' + e(r.HOKHAU_TINHTHANH_TEN);
    };

    /* Khối "Hồ sơ" #1 / #2 — genDetail_NguoiHoc_TTTS (họ tên viết HOA như gốc) */
    N.hoSo = function (r) {
        function kv(k, v, dam) {
            return '<div class="ums-kv' + (dam ? ' ums-kv--dam' : '') + '"><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>';
        }
        var pt = co(r.PHANTRAMMIENGIAM) ? r.PHANTRAMMIENGIAM : 0;
        return '<div class="nh-hoso">' +
            '<div class="nh-hoso__cot">' +
                kv('Họ tên', N.hoTen(r).toUpperCase(), true) +
                kv('Ngày sinh', N.ngaySinh(r)) +
                kv('SBD', e(r.SOBAODANH)) +
                kv('Điện thoại', e(r.SODIENTHOAICANHAN)) +
                kv('Quê quán', N.queQuan(r)) +
                kv('CMND/CCCD', e(r.CMTND_SO)) +
            '</div><div class="nh-hoso__cot">' +
                kv('Khu vực', e(r.KHUVUC_TEN)) +
                kv('Đối tượng', e(r.DOITUONGDUTHI_TEN)) +
                kv('% Miễn giảm', pt) +
                kv('Ngành học', e(r.NGANHHOC_TEN)) +
            '</div></div>';
    };

    /* Đầu khung người học đang chọn (ums.pat.dauDoiTuong) */
    N.dau = function (panel, r, tools) {
        pat.datDau(panel, {
            anh: co(r.ANH) ? r.ANH : '',
            ten: N.hoTen(r).toUpperCase(),
            nhan: String(r.DANHAPHOC) === '1' ? ui.badge('Đã nhập học', 'ok') : ui.badge('Chưa nhập học', 'mute'),
            tools: tools || ''
        });
    };

    /* Thẻ khi rê chuột — edu.extend.popover_NguoiHoc_TTTS (Corei/systemextend.js:7332) */
    function the(r) {
        var ma = co(r.MASO) ? ['MSSV', r.MASO] : ['SBD', e(r.SOBAODANH)];
        var lop = co(r.DAOTAO_LOPQUANLY_TEN) ? ['Lớp học', r.DAOTAO_LOPQUANLY_TEN] : ['Lớp dự kiến', e(r.MALOPDUKIEN)];
        var rows = [
            ['fa-id-badge', ma[0], ma[1]],
            ['fa-circle-user', 'Họ tên', N.hoTen(r)],
            ['fa-cake-candles', 'Ngày sinh', N.ngaySinh(r)],
            ['fa-book-open-cover', 'Ngành', e(r.NGANHHOC_TEN)],
            ['fa-screen-users', lop[0], lop[1]],
            ['fa-location-dot', 'Địa chỉ', N.queQuan(r)]
        ];
        return '<div class="ums-hovercard__in"><div class="ums-hovercard__rows">' + rows.map(function (d) {
            return '<div class="ums-hovercard__row"><i class="fa-light ' + d[0] + '"></i><span>' + esc(d[1]) + ' :</span><b>' + esc(d[2]) + '</b></div>';
        }).join('') + '</div></div>';
    }

    /* =====================================================================
       N.cot(o) — dựng khung hai cột
         o = { el, title, cu: bool (bản cũ), chuaNhap: 'Chưa' | 'Chưa nhập', cmnd: bool (dòng phụ kèm CMND),
               chonNhieu: bool (ô đánh dấu từng người — cho báo cáo), actions: HTML đầu trang,
               nhac: lời dẫn khung phải, onChon(r), onBoChon() }
         → { m, keHoach(), dangChon(), chon(id), boChon(), tai(trang), daDanhDau() }
       ===================================================================== */
    N.cot = function (o) {
        var S = { rows: [], page: 1, size: 10, total: 0, chon: null, danhDau: {} };
        var m = pat.master({
            el: o.el, title: o.title, actions: o.actions || '',
            side: {
                title: 'Người học', icon: 'fa-user-graduate',
                search: 'Nhập từ khóa tìm kiếm: tên, số báo danh...',
                filter:
                    '<div class="ums-master__adv" data-nh="adv">' +
                    '<div class="ums-field"><select class="ums-select" data-nh="kh" data-ph="Chọn kế hoạch nhập học"><option value=""></option></select></div>' +
                    '<div class="ums-field"><label class="ums-field__label">Điều kiện</label><div class="ums-radios">' +
                    '<label class="ums-check"><input type="radio" name="nhdk" value="1" checked> Đã nhập</label>' +
                    '<label class="ums-check"><input type="radio" name="nhdk" value="0"> ' + esc(o.chuaNhap || 'Chưa nhập') + '</label>' +
                    '<label class="ums-check"><input type="radio" name="nhdk" value="-1"> Toàn bộ</label></div></div>' +
                    '</div>'
            },
            main: { title: false }
        });
        m.el.classList.add('nh-man');
        var kh = m.side.querySelector('[data-nh="kh"]');
        m.sideBody.innerHTML = ui.empty('Chọn kế hoạch nhập học', 'fa-calendar');

        m.mainBody.innerHTML =
            '<div class="ums-panel" data-nh="nhac"><div class="ums-panel__body">' +
                ui.empty(o.nhac || 'Chọn một người học ở cột trái', 'fa-user-magnifying-glass') + '</div></div>' +
            '<div data-nh="noidung" hidden></div>';
        var nhac = m.mainBody.querySelector('[data-nh="nhac"]');
        var noiDung = m.mainBody.querySelector('[data-nh="noidung"]');

        function tinhTrang() {
            var r = m.side.querySelector('input[name="nhdk"]:checked');
            return r ? r.value : '1';
        }

        function tai(page) {
            if (page) S.page = page;
            if (!kh.value) {
                S.rows = []; S.total = 0;
                m.sideBody.innerHTML = ui.empty('Chọn kế hoạch nhập học', 'fa-calendar');
                m.sideCount.textContent = '';
                m.setPage({ index: 1, size: S.size, total: 0 });
                return Promise.resolve();
            }
            var ac = o.cu ? N.AC.nguoiHocCu : N.AC.nguoiHoc;
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call({
                action: ac.action, func: ac.func, versionAPI: 'v1.0',
                dDaNhapHoc: tinhTrang(),
                strTaiChinh_KeHoach_Id: kh.value,
                strNguoiThucHien_Id: '',
                strTuKhoa: m.search.value.trim(),
                pageIndex: S.page,
                pageSize: S.size
            }).then(function (r) {
                S.rows = Array.isArray(r.data) ? r.data : [];
                S.total = Number(r.pager) || S.rows.length;
                ve();
            }).catch(function (err) {
                m.sideBody.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách người học');
            });
        }

        function ve() {
            m.sideCount.textContent = S.total ? '(' + ui.so(S.total) + ')' : '';
            if (!S.rows.length) m.sideBody.innerHTML = ui.empty('Không tìm thấy người học', 'fa-user-magnifying-glass');
            /* Ô đánh dấu (có ở gốc: chọn nhiều người để "Xuất báo cáo" in cả nhóm) — người dùng 2026-09-27 hỏi "2 check bên cạnh
               tên để làm gì" → đưa ô lên ĐẦU mục, tách khỏi dấu "đã nhập học" ở cuối, kèm thanh ghi rõ mục đích + chọn tất cả trang. */
            else m.sideBody.innerHTML = (o.chonNhieu ? thanhDanhDau() : '') + S.rows.map(function (r) {
                var sub = e(r.SOBAODANH) + (o.cmnd && co(r.CMTND_SO) ? ' - ' + r.CMTND_SO : '');
                return '<div class="ums-master__item nh-muc' + (S.chon && S.chon.ID === r.ID ? ' is-active' : '') + '" data-id="' + esc(r.ID) + '">' +
                    (o.chonNhieu ? '<input type="checkbox" class="nh-muc__ck" data-nhck="' + esc(r.ID) + '"' +
                        (S.danhDau[r.ID] ? ' checked' : '') + ' title="Chọn để Xuất báo cáo">' : '') +
                    pat.anhNguoi(co(r.ANH) ? r.ANH : '') +
                    '<span class="ums-master__item__main nh-muc__txt"><span class="ums-cell__title">' + esc(N.hoTen(r)) + '</span>' +
                    '<span class="ums-master__item__sub">' + esc(sub) + '</span>' +
                    '</span>' +
                    (String(r.DANHAPHOC) === '1' ? '<i class="fa-light fa-tag ums-master__tt" title="Đã nhập học"></i>' : '') +
                    '</div>';
            }).join('');
            m.setPage({
                index: S.page, size: S.size, total: S.total,
                onChange: function (p) { tai(p); },
                onSize: function (v) { S.size = v; tai(1); }
            });
        }

        m.sideBody.addEventListener('click', function (ev) {
            if (ev.target.closest('input[data-nhck], .nh-dd')) return;
            var it = ev.target.closest('.ums-master__item[data-id]');
            if (!it) return;
            var id = it.getAttribute('data-id');
            var r = S.rows.filter(function (x) { return String(x.ID) === id; })[0];
            if (r) chon(r);
        });
        function soDanhDau() { return Object.keys(S.danhDau).filter(function (k) { return S.danhDau[k]; }).length; }
        function thanhDanhDau() {
            var tatCa = S.rows.length && S.rows.every(function (r) { return S.danhDau[r.ID]; });
            return '<div class="nh-dd" title="Đánh dấu người học để Xuất báo cáo cho cả nhóm"><label class="ums-check"><input type="checkbox" data-nhall' +
                (tatCa ? ' checked' : '') + '> Chọn cả trang</label><span class="nh-dd__so" data-nhso>' + tomTat() + '</span>' +
                '<button type="button" class="nh-dd__bo" data-nhbo' + (soDanhDau() ? '' : ' hidden') + '>Bỏ chọn</button></div>';
        }
        function tomTat() { var n = soDanhDau(); return n ? 'Đã chọn ' + n : 'để Xuất báo cáo'; }
        function capNhatThanh() {
            var s = m.sideBody.querySelector('[data-nhso]'); if (s) s.textContent = tomTat();
            var b = m.sideBody.querySelector('[data-nhbo]'); if (b) b.hidden = !soDanhDau();
            var a = m.sideBody.querySelector('[data-nhall]');
            if (a) a.checked = !!S.rows.length && S.rows.every(function (r) { return S.danhDau[r.ID]; });
        }
        m.sideBody.addEventListener('change', function (ev) {
            var c = ev.target.closest('input[data-nhck]');
            if (c) { S.danhDau[c.getAttribute('data-nhck')] = c.checked; capNhatThanh(); return; }
            var a = ev.target.closest('input[data-nhall]');
            if (a) {
                S.rows.forEach(function (r) { S.danhDau[r.ID] = a.checked; });
                Array.prototype.forEach.call(m.sideBody.querySelectorAll('input[data-nhck]'), function (x) { x.checked = a.checked; });
                capNhatThanh();
            }
        });
        m.sideBody.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-nhbo]')) return;
            S.danhDau = {};
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('input[data-nhck]'), function (x) { x.checked = false; });
            capNhatThanh();
        });
        ui.hoverCard(m.sideBody, '.ums-master__item[data-id]', function (it) {
            var id = it.getAttribute('data-id');
            var r = S.rows.filter(function (x) { return String(x.ID) === id; })[0];
            return r ? the(r) : null;
        });

        function chon(r) {
            S.chon = r;
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) {
                x.classList.toggle('is-active', x.getAttribute('data-id') === String(r.ID));
            });
            nhac.hidden = true;
            noiDung.hidden = false;
            if (o.onChon) o.onChon(r, noiDung);
        }
        function boChon() {
            S.chon = null;
            Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item.is-active'), function (x) { x.classList.remove('is-active'); });
            noiDung.hidden = true;
            nhac.hidden = false;
            if (o.onBoChon) o.onBoChon();
        }

        /* Đổi kế hoạch / điều kiện → bỏ người đang chọn (gốc: reset_NguoiHoc_*); pat.cotTrai tự tải lại */
        m.side.querySelector('[data-nh="adv"]').addEventListener('change', function () { if (S.chon) boChon(); });
        pat.cotTrai(m, { tai: tai, moSan: true });

        /* Kế hoạch được phân quyền của người dùng — getList_KeHoachNhapHoc_NhanSu */
        ums.api.call({ action: N.AC.keHoach.action, func: N.AC.keHoach.func, strNguoiThucHien_Id: ums.session.userId })
            .then(function (r) {
                kh.innerHTML = '<option value=""></option>' + ui.options(Array.isArray(r.data) ? r.data : [], { id: 'ID', name: 'TENKEHOACH', title: false });
                if (window.jQuery) jQuery(kh).trigger('change.select2');
            }).catch(function (err) { ums.api.handle(err, 'kế hoạch nhập học'); });

        return {
            m: m, noiDung: noiDung,
            keHoach: function () { return kh.value; },
            dangChon: function () { return S.chon; },
            chon: chon, boChon: boChon, tai: tai,
            daDanhDau: function () { return Object.keys(S.danhDau).filter(function (k) { return S.danhDau[k]; }); }
        };
    };
})();
