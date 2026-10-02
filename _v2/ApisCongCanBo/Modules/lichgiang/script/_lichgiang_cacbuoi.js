/* =========================================================================
   Lịch giảng — "Các buổi học theo thời khóa biểu" (ums.lg.xemCacBuoi)
   Bản gốc: lichgiang.js xemCacBuoi_* — #mymodal_CacBuoiHoc (chỉ có ở lichgiang.html)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, chép nguyên):
       NS_ThongTinCanBo/LayDSLichGiang (GET)       mọi buổi của lớp (strDaoTao_LopHocPhan_Id, ngày rỗng)
       NS_ThongTinCanBo/LayDSDangKyHoc (GET)       sinh viên của buổi đang chọn → Data.rs
       CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan (GET)      đã điểm danh buổi đó
       CC_ThoiGian_ChuyenCan/LayKQTongHopTheoKieuChuyenCan (GET)   tổng hợp — mỗi kiểu một lời gọi
       CC_NguoiHoc_ChuyenCan/ThemMoi · Xoa_QLSV_NguoiHoc_ChuyenCan2 (POST)   "Chỉnh sửa điểm danh"
       CC_GiangVien_TuGhiNhan/XuLyDiemDanhKhongTonTaiTKB (POST)            "Đồng bộ theo TKB"
       Kiểu chuyên cần: danh mục QLSV.KIEUCHUYENCAN (khác hộp một buổi — như bản gốc).
   Giữ như bản gốc: danh sách buổi lấy theo NGƯỜI ĐĂNG NHẬP (edu.system.userId).
   o (tuỳ chọn, cho lichgiang/nguoihoc*): { giangVien: id lấy buổi thay người đăng nhập
   (nguoihoctheokhoa — giảng viên bấm ở cột "Tổng hợp điểm danh"), chiXem: true (không
   Đồng bộ / Chỉnh sửa, ô khoá — bản gốc nguoihoctheokhoa vẽ ô sửa được mà không có nút lưu),
   chonCot: true (ô "chọn cả cột" ở tiêu đề mỗi kiểu — bản nguoihoc),
   host: gốc màn → MÀN CON mở TRONG TRANG thay chỗ màn (ums.pat.formTrang, BO-CUC luật 1), hai nút "Đồng bộ theo TKB" /
   "Chỉnh sửa điểm danh" lên đầu khung; chiXem (chỉ đọc) hoặc không truyền host thì vẫn là hộp thoại như trước }
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var lg = ums.lg = ums.lg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function gp(r, a, b) { return e(r[a]) + 'h' + e(r[b]); }

    lg.xemCacBuoi = function (lop, dsTuan, o) {
        o = o || {};
        var trongTrang = !!o.host && !o.chiXem;      // chỉ xem = hộp XEM → giữ hộp thoại
        var dlg = (trongTrang ? pat.formTrang : ui.dialog)({
            host: o.host, cols: 1, title: 'Các buổi học theo thời khóa biểu', icon: 'fa-clipboard-list', size: 'xl',
            buttons: trongTrang ? [
                { text: 'Đồng bộ theo TKB', kind: 'save', mod: 'out-warn', icon: 'fa-arrows-rotate', keepOpen: true, onClick: function () { dongBo(); } },
                { text: 'Chỉnh sửa điểm danh', kind: 'save', keepOpen: true, onClick: function () { luu(); } }
            ] : undefined,
            body:
                '<div class="ums-row ums-row--between ums-u-mb-2"><b class="ums-u-navy">' + esc(e(lop.TENLOPHOCPHAN)) + '</b>' +
                    '<div class="ums-row"><select class="ums-select ums-input--sm" data-cb="sx" data-no-s2 style="width:190px"><option value="">Sắp xếp</option>' +
                        '<option value="ABC">Xếp theo ABC</option><option value="LOPQUANLY">Xếp theo Lớp quản lý</option><option value="MASO">Xếp theo Mã sinh viên</option></select>' +
                        (o.chiXem || trongTrang ? '' : ui.btn('save', { text: 'Đồng bộ theo TKB', mod: 'out-warn', cls: 'ums-btn--sm', icon: 'fa-arrows-rotate', attr: { 'data-cb': 'dongbo' } }) +
                        ui.btn('save', { text: 'Chỉnh sửa điểm danh', cls: 'ums-btn--sm', attr: { 'data-cb': 'luu' } })) + '</div></div>' +
                '<div class="lg-cb"><div class="lg-cb__chinh"><div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-cb="tg"></div><div data-cb="bang"></div></div>' +
                    '<div class="lg-cb__phu"><div data-cb="buoi">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div></div></div>'
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-cb="' + k + '"]'); }
        var kieu = [], buoi = [], dang = null, sv = [], goc = {};

        ums.api.dm('QLSV.KIEUCHUYENCAN').then(function (k) {
            kieu = k || [];
            return ums.api.call({ action: 'NS_ThongTinCanBo/LayDSLichGiang', method: 'GET', strNhanSu_HoSoCanBo_Id: o.giangVien !== undefined ? o.giangVien : uid(), strDaoTao_LopHocPhan_Id: e(lop.IDLOPHOCPHAN),
                strNgayBatDau: '', strNgayKetThuc: '', strNgayDangChon: '' });
        }).then(function (r) {
            buoi = arr(r.data).filter(function (x) { return x.IDLOPHOCPHAN === lop.IDLOPHOCPHAN; });
            veBuoi();
            if (buoi.length) chon(0); else q('bang').innerHTML = ui.empty('Lớp chưa có buổi học', 'fa-calendar-xmark');
        }).catch(function (err) { q('buoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'các buổi học'); });

        function veBuoi() {
            ui.table({ el: q('buoi'), rows: buoi, empty: 'Không có buổi', columns: [
                { title: 'Ngày', prop: 'NGAYHOC', cls: 'is-center is-nowrap' },
                { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (x) { return esc(gp(x, 'GIOBATDAU', 'PHUTBATDAU') + ' → ' + gp(x, 'GIOKETTHUC', 'PHUTKETTHUC')); } }
            ] });
            Array.prototype.forEach.call(q('buoi').querySelectorAll('tbody tr'), function (tr, i) { tr.setAttribute('data-buoi', i); tr.style.cursor = 'pointer'; });
        }
        function chon(i) {
            dang = buoi[i];
            Array.prototype.forEach.call(q('buoi').querySelectorAll('tbody tr'), function (tr) { tr.classList.toggle('is-selected', Number(tr.getAttribute('data-buoi')) === i); });
            q('tg').innerHTML = esc(e(dang.NGAYHOC)) + ' <span>' + esc(gp(dang, 'GIOBATDAU', 'PHUTBATDAU')) + '</span> <i class="fa-light fa-arrow-right-long"></i> <span>' + esc(gp(dang, 'GIOKETTHUC', 'PHUTKETTHUC')) + '</span>';
            napSV();
        }
        function napSV() {
            q('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var p = { strNgayGhiNhan: e(dang.NGAYHOC), strDaoTao_LopHocPhan_Id: e(lop.IDLOPHOCPHAN) };
            ums.api.call({ action: 'NS_ThongTinCanBo/LayDSDangKyHoc', method: 'GET', strTuKhoa: '', strNgayGhiNhan: p.strNgayGhiNhan, dGio: e(dang.GIOBATDAU),
                dPhut: e(dang.PHUTBATDAU), dGiay: 0, strReport_Id: '', strTieuChiSapXep: q('sx').value, strDaoTao_LopHocPhan_Id: p.strDaoTao_LopHocPhan_Id, strNguoiThucHien_Id: uid() })
                .then(function (r) {
                    sv = arr(r.data);
                    veBang();
                    ums.api.call({ action: 'CC_ThoiGian_ChuyenCan/LayKetQuaTheoKieuChuyenCan', method: 'GET', silent: true, strKieuChuyenCan_Id: '', strNgayGhiNhan: p.strNgayGhiNhan,
                        strGio: e(dang.GIOBATDAU), strPhut: e(dang.PHUTBATDAU), strGiay: 0, strQLSV_NguoiHoc_Id: '', strDaoTao_LopHocPhan_Id: p.strDaoTao_LopHocPhan_Id }).then(function (x) {
                        goc = {};
                        arr(x.data).forEach(function (k) {
                            if (Number(k.GIATRI) !== 1) return;
                            var key = k.QLSV_NGUOIHOC_ID + '|' + k.KIEUCHUYENCAN_ID;
                            goc[key] = { soLuong: Number(k.SOLUONG) ? String(k.SOLUONG) : '' };
                            var c = B.querySelector('[data-ck="' + key + '"]'), n = B.querySelector('[data-sl="' + key + '"]');
                            if (c) c.checked = true; if (n && goc[key].soLuong) n.value = goc[key].soLuong;
                        });
                    }).catch(function () {});
                    kieu.forEach(function (k) {
                        ums.api.call({ action: 'CC_ThoiGian_ChuyenCan/LayKQTongHopTheoKieuChuyenCan', method: 'GET', silent: true, strKieuChuyenCan_Id: k.ID, strDaoTao_LopHocPhan_Id: p.strDaoTao_LopHocPhan_Id })
                            .then(function (x) {
                                arr(x.data).forEach(function (t) {
                                    var a = B.querySelector('[data-sb="' + t.QLSV_NGUOIHOC_ID + '|' + k.ID + '"]'), b = B.querySelector('[data-st="' + t.QLSV_NGUOIHOC_ID + '|' + k.ID + '"]');
                                    if (a) a.textContent = e(t.TONGSOBUOI); if (b) b.textContent = e(t.TONGSOTIET);
                                });
                            }).catch(function () {});
                    });
                }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
        }
        function veBang() {
            var KQ = ['Kết quả đánh giá'];
            ui.table({ el: q('bang'), rows: sv, empty: 'Không có sinh viên', columns: [
                { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' }, { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
                { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
                { title: 'Tổng số tiết học', prop: 'TONGSOTIETHOC', group: KQ, cls: 'is-center' }, { title: 'Tổng số tiết có mặt', prop: 'TONGSOTIETCOMAT', group: KQ, cls: 'is-center' },
                { title: 'Điều kiện', prop: 'PHANTRAMHOANTHANH', group: KQ, cls: 'is-center' }, { title: 'Đã thực hiện', prop: 'PHANTRAMTHUCHIEN', group: KQ, cls: 'is-center' }
            ].concat([].concat.apply([], kieu.map(function (k) {
                var g = ['Tổng hợp', e(k.TEN)];
                return [
                    { title: 'Số buổi', group: g, cls: 'is-center', render: function (s) { return '<span data-sb="' + esc(s.QLSV_NGUOIHOC_ID + '|' + k.ID) + '"></span>'; } },
                    { title: 'Số tiết', group: g, cls: 'is-center', render: function (s) { return '<span data-st="' + esc(s.QLSV_NGUOIHOC_ID + '|' + k.ID) + '"></span>'; } }
                ];
            }))).concat(kieu.map(function (k) {
                var khoa = o.chiXem ? ' disabled' : '';
                return { title: e(k.TEN), head: o.chonCot && !o.chiXem ? esc(e(k.TEN)) + '<br><input type="checkbox" data-all="' + esc(k.ID) + '" title="Chọn cả cột">' : undefined,
                    group: ['Buổi đang chọn'], cls: 'is-center', width: '104px', render: function (s) {
                    var key = s.QLSV_NGUOIHOC_ID + '|' + k.ID;
                    return '<div class="ums-lich-dd__o"><input type="checkbox" data-ck="' + esc(key) + '" data-sv="' + esc(s.QLSV_NGUOIHOC_ID) + '"' + khoa + '>' +
                        '<input class="ums-input ums-input--sm" data-sl="' + esc(key) + '" inputmode="numeric" autocomplete="off"' + khoa + '></div>';
                } };
            })) });
        }
        function motKieu(c) {
            if (!c.checked) return;
            Array.prototype.forEach.call(B.querySelectorAll('[data-sv="' + c.getAttribute('data-sv') + '"]'), function (x) { if (x !== c) x.checked = false; });
        }
        B.addEventListener('change', function (ev) {
            var t = ev.target;
            if (t.hasAttribute('data-all')) {
                sv.forEach(function (x) { var c = B.querySelector('[data-ck="' + x.QLSV_NGUOIHOC_ID + '|' + t.getAttribute('data-all') + '"]'); if (c) { c.checked = t.checked; motKieu(c); } });
            } else if (t.hasAttribute('data-ck')) motKieu(t);
            else if (t.getAttribute('data-cb') === 'sx' && dang) napSV();
        });
        B.addEventListener('focusout', function (ev) {
            var t = ev.target;
            if (!t.hasAttribute || !t.hasAttribute('data-sl')) return;
            var c = B.querySelector('[data-ck="' + t.getAttribute('data-sl') + '"]');
            if (c) { c.checked = !!t.value.trim(); motKieu(c); }
        });
        B.addEventListener('click', function (ev) {
            var tr = ev.target.closest('[data-buoi]');
            if (tr) { chon(Number(tr.getAttribute('data-buoi'))); return; }
            var b = ev.target.closest('button[data-cb]');
            if (!b) return;
            if (b.getAttribute('data-cb') === 'dongbo') dongBo();
            else if (b.getAttribute('data-cb') === 'luu') luu();
        });
        function dongBo() {
                ums.api.call({ action: 'CC_GiangVien_TuGhiNhan/XuLyDiemDanhKhongTonTaiTKB', method: 'POST', strDaoTao_LopHocPhan_Id: e(lop.IDLOPHOCPHAN), strNguoiThucHien_Id: uid() })
                    .then(function () { if (dang) napSV(); ui.toast('Thực hiện thành công!', 'ok'); }).catch(function (err) { ums.api.handle(err, 'đồng bộ theo TKB'); });
        }
        function luu() {
                if (!dang) return;
                var them = [], xoa = [];
                sv.forEach(function (s) {
                    kieu.forEach(function (k) {
                        var key = s.QLSV_NGUOIHOC_ID + '|' + k.ID, c = B.querySelector('[data-ck="' + key + '"]'), n = B.querySelector('[data-sl="' + key + '"]');
                        if (!c) return;
                        var g = goc[key], sl = n ? n.value.trim() : '';
                        var x = { method: 'POST', strId: '', strNguoiThucHien_Id: uid(), strQLSV_NguoiHoc_Id: s.QLSV_NGUOIHOC_ID, strDaoTao_LopQuanLy_Id: '',
                            strDaoTao_ChuongTrinh_Id: e(s.DAOTAO_TOCHUCCHUONGTRINH_ID), strQLSV_TrangThaiNguoiHoc_Id: e(s.QLSV_TRANGTHAINGUOIHOC_ID), strKieuChuyenCan_Id: k.ID,
                            strNgayGhiNhan: e(dang.NGAYHOC), dSoLuong: sl, dGio: e(dang.GIOBATDAU), dPhut: e(dang.PHUTBATDAU), dGiay: 0 };
                        if (c.checked && (!g || sl !== g.soLuong)) { x.action = 'CC_NguoiHoc_ChuyenCan/ThemMoi'; x.strDiem_DanhSach_Id = e(s.DANGKY_LOPHOCPHAN_ID); them.push(x); }
                        else if (!c.checked && g) { x.action = 'CC_NguoiHoc_ChuyenCan/Xoa_QLSV_NguoiHoc_ChuyenCan2'; x.strDiem_DanhSachHoc_Id = e(s.DANGKY_LOPHOCPHAN_ID); xoa.push(x); }
                    });
                });
                if (!them.length && !xoa.length) { ui.toast('Bạn chưa thay đổi gì dữ liệu.', 'info'); return; }
                ui.batch(xoa.concat(them), { title: 'Đang lưu điểm danh', okText: 'Lưu thành công' }).then(napSV);
        }
        return dlg;
    };
})();
