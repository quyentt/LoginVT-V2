/* =========================================================================
   inbangdiem — hộp "Kết quả đăng ký cả lớp" — ums.ibd.caLop(dòng, o)
   o.buoiHoc = false: ô KHÔNG bấm được để xem các buổi học (bản ApisQuanLyDiem/canhan/inbangdiem —
   gốc ở đó gắn trình xử lý rỗng cho .btnDSBuoiHoc). Mặc định (bỏ trống) giữ hành vi bản Cổng cán bộ.
   Hai ngăn như bản gốc: trái các kỳ/đợt của lớp quản lý, phải ma trận sinh viên × học phần đăng ký.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ GET, chép nguyên):
       NS_ThongTinCanBo/LayDSThoiGianDKTheoLopQL (strDaoTao_LopQuanLy_Id) — tự chọn kỳ đầu
       NS_ThongTinCanBo/LayDSHocPhanDKTheoLop · LayDSNguoiHocTheoLopQL (strDaoTao_ThoiGianDaoTao_Id, strDaoTao_LopQuanLy_Id)
       DKH_Chung/KiemTraNguoiHocDangKyHocPhan — MỖI Ô (sinh viên × học phần) một lời gọi (tối đa 10 cùng lúc):
         KETQUA = 1 → "X" (+ "(tiết vắng/buổi vắng)" + tỷ lệ), cột Chuyên cần = tổng tiết/buổi vắng
       Bấm ô → XLHV_CC_ThongTin_MH · pkg_chuyencan_thongtin.LayDSBuoiHocTheoHocPhan (buổi TINHCHAT = 1 tô vàng)
   Không chép (lỗi rõ của bản gốc):
     · Tiêu đề "Họ tên, Mã số" mà dữ liệu "Mã số, Họ tên" (lệch cột) → tiêu đề theo đúng dữ liệu. Họ tên nối " - " → dấu cách.
     · Cột "Trạng thái tài chính" in số thô → định dạng tiền như danh sách chính.
     · Lớp 0 sinh viên hoặc 0 học phần: thanh tiến trình đứng "0/0" mãi.
     · Ô chưa đăng ký chỉ bấm được vào chữ (vùng bấm rỗng) → bấm cả ô.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui;
    var ibd = ums.ibd = ums.ibd || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function get(a, o) { return ums.api.call(Object.assign({ action: 'NS_ThongTinCanBo/' + a, method: 'GET', strNguoiThucHien_Id: uid() }, o)); }

    ibd.caLop = function (r, o) {
        o = o || {};
        var coBuoi = o.buoiHoc !== false;
        var lop = r.DAOTAO_LOPQUANLY_ID, ky = null, HP = [], SV = [], KQ = {};
        var dlg = ui.dialog({ title: 'Thông tin lớp quản lý — Lớp ' + e(r.DAOTAO_LOPQUANLY_TEN) + ' - ' + e(r.DAOTAO_KHOADAOTAO_TEN) + ' - ' + e(r.DAOTAO_CHUONGTRINH_TEN),
            icon: 'fa-users-rectangle', size: 'xl',
            body: '<div class="ibd-lop"><div data-x="ky">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div><div><div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-x="tt"></div><div data-x="mt"></div></div></div>' });
        function q(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        var dsKy = [];
        get('LayDSThoiGianDKTheoLopQL', { strDaoTao_LopQuanLy_Id: lop }).then(function (x) {
            dsKy = arr(x.data);
            q('ky').innerHTML = dsKy.length ? '<div class="ibd-lop__ky">' + dsKy.map(function (k, i) { return '<button type="button" data-ky="' + i + '">' + esc(e(k.TEN)) + '</button>'; }).join('') + '</div>'
                : ui.empty('Lớp chưa có kỳ đăng ký', 'fa-calendar-xmark');
            if (dsKy.length) chonKy(0);
        }).catch(function (err) { q('ky').innerHTML = ui.fail(err.message); });

        function chonKy(i) {
            ky = dsKy[i];
            Array.prototype.forEach.call(q('ky').querySelectorAll('[data-ky]'), function (b) { b.classList.toggle('is-active', Number(b.getAttribute('data-ky')) === i); });
            q('tt').textContent = e(ky.TEN);
            q('mt').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var ts = { strDaoTao_ThoiGianDaoTao_Id: ky.ID, strDaoTao_LopQuanLy_Id: lop };
            Promise.all([get('LayDSHocPhanDKTheoLop', ts), get('LayDSNguoiHocTheoLopQL', ts)]).then(function (x) {
                HP = arr(x[0].data); SV = arr(x[1].data); KQ = {};
                var tong = HP.length * SV.length, xong = 0;
                ve();
                if (!tong) return;
                var o = [];
                SV.forEach(function (s) { HP.forEach(function (h) { o.push([s, h]); }); });
                return ums.nd.pool(o, function (p) {
                    return ums.api.call({ action: 'DKH_Chung/KiemTraNguoiHocDangKyHocPhan', method: 'GET', silent: true, strQLSV_NguoiHoc_Id: p[0].ID, strDaoTao_HocPhan_Id: p[1].ID,
                        strDaoTao_ThoiGianDaoTao_Id: ky.ID, strNguoiThucHien_Id: uid() }).then(function (y) {
                        arr(y.data).forEach(function (z) {
                            if (String(z.KETQUA) !== '1') return;
                            var tiet = Number(z.SOTIETVANGMAT) || 0, buoi = Number(z.SOBUOIVANGMAT) || 0;
                            KQ[p[0].ID + '_' + p[1].ID] = { tiet: tiet, buoi: buoi, chu: 'X' + (tiet + buoi > 0 ? '(' + tiet + '/' + buoi + ')' + (z.TYLEVANG ? ' + ' + z.TYLEVANG : '') : '') };
                        });
                    }).then(function () { xong++; q('tt').textContent = e(ky.TEN) + ' — đã kiểm ' + xong + '/' + tong + ' ô'; });
                }, 10).then(function () { q('tt').textContent = e(ky.TEN); ve(); });
            }).catch(function (err) { q('mt').innerHTML = ui.fail(err.message); });
        }
        function ve() {
            var G1 = ['Tổng số tín'], G2 = ['Học phần đăng ký'];
            ui.table({ el: q('mt'), rows: SV, empty: 'Lớp chưa có sinh viên', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: function (s) { return esc(e(s.QLSV_NGUOIHOC_HODEM) + ' ' + e(s.QLSV_NGUOIHOC_TEN)); } },
                { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' }, { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' },
                { title: 'Trạng thái tài chính', cls: 'is-right is-nowrap', render: function (s) { return e(s.TONGNOPHI) === '' ? '' : ui.money(s.TONGNOPHI); } },
                { title: 'Chuyên cần', cls: 'is-center', render: function (s) {
                    var t = 0, b = 0; HP.forEach(function (h) { var k = KQ[s.ID + '_' + h.ID]; if (k) { t += k.tiet; b += k.buoi; } });
                    return t || b ? esc(t + '/' + b) : '';
                } },
                { title: 'Học đi', prop: 'SOTINHOCDI', cls: 'is-center', group: G1 }, { title: 'Học lại', prop: 'SOTINHOCLAI', cls: 'is-center', group: G1 },
                { title: 'Học nâng điểm', prop: 'SOTINHOCNANGDIEM', cls: 'is-center', group: G1 }
            ].concat(HP.map(function (h) {
                return { title: e(h.TEN), group: G2, cls: 'is-center' + (coBuoi ? ' ibd-lop__o' : ''), render: function (s) {
                    var k = KQ[s.ID + '_' + h.ID];
                    return '<span class="ibd-lop__nut' + (k && (k.tiet || k.buoi) ? ' is-vang' : '') + '"' + (coBuoi ? ' data-o="' + esc(s.ID) + '|' + esc(h.ID) + '" title="Xem các buổi học"' : '') + '>' + (k ? esc(k.chu) : '&nbsp;') + '</span>';
                } };
            })) });
        }
        function buoiHoc(svId, hpId) {
            var s = SV.filter(function (x) { return String(x.ID) === svId; })[0] || {}, h = HP.filter(function (x) { return String(x.ID) === hpId; })[0] || {};
            var d2 = ui.dialog({ title: 'Các buổi học — ' + e(s.QLSV_NGUOIHOC_MASO) + ' ' + e(s.QLSV_NGUOIHOC_HODEM) + ' ' + e(s.QLSV_NGUOIHOC_TEN) + ' — ' + e(h.TEN), icon: 'fa-calendar-days', size: 'lg',
                body: '<div data-x="b">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var el = d2.body.querySelector('[data-x="b"]');
            ums.api.call({ action: 'XLHV_CC_ThongTin_MH/DSA4BRIDNC4oCS4iFSkkLgkuIhEpIC8P', func: 'pkg_chuyencan_thongtin.LayDSBuoiHocTheoHocPhan', strQLSV_NguoiHoc_Id: svId,
                strDaoTao_HocPhan_Id: hpId, strDaoTao_ThoiGianDaoTao_Id: ky.ID, strNguoiThucHien_Id: uid() }).then(function (x) {
                var ds = arr(x.data);
                ui.table({ el: el, rows: ds, empty: 'Chưa có buổi học', columns: [{ title: 'Ngày học', prop: 'NGAYGHINHAN', cls: 'is-center is-nowrap' },
                    { title: 'Tiết bắt đầu --> kết thúc', cls: 'is-center', render: function (y) { return esc(e(y.TIETBATDAU) + ' -> ' + e(y.TIETKETTHUC)); } },
                    { title: 'Lớp học phần', prop: 'DAOTAO_LOPHOCPHAN_TEN' }, { title: 'Giảng viên', render: function (y) { return esc(e(y.CANBOGHINHAN_TENDAYDU) + ' - ' + e(y.CANBOGHINHAN_TAIKHOAN)); } },
                    { title: 'Chuyên cần', prop: 'KIEUCHUYENCAN_TEN' }] });
                Array.prototype.forEach.call(el.querySelectorAll('tbody tr'), function (tr, i) { if (ds[i] && String(ds[i].TINHCHAT) === '1') tr.classList.add('ibd-vang'); });
            }).catch(function (err) { el.innerHTML = ui.fail(err.message); });
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-ky]'); if (b) { chonKy(Number(b.getAttribute('data-ky'))); return; }
            var td = coBuoi && ev.target.closest('td.ibd-lop__o'); if (!td) return;
            var o = td.querySelector('[data-o]'); if (o) { var p = o.getAttribute('data-o').split('|'); buoiHoc(p[0], p[1]); }
        });
    };
})();
