/* =========================================================================
   Thu hồ sơ nhập học — khung chung hai bản
   ums.nhThuHoSo.man(root, { cu })
     thuhosonew (trên menu) : cu = false — API PKG_CORE_NhapHoc_ThuTien.*, khối Tài chính ẨN, nút
                              "Xem thông tin nộp phí" để mở
     thuhoso (bản cũ)       : cu = true  — API kiểu cũ NH_* (GET), khối Tài chính luôn hiện
   Bản gốc: ApisNhapHoc/Modules/thuhoso/html/{thuhosonew,thuhoso}.html + scripts/{thuhosonew,thuhoso}.js (ThuHoSo)
   Khung cột trái + khối Hồ sơ: ums.nhDs (_dsnh.js).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn)                                  bản mới                 | bản cũ
     Các khoản nhập học   SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIKKS4gLw8pIDEJLiIP
                          PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc (POST)     | NH_DinhMuc_Chung/LayDSCacKhoanNhapHoc (GET)
                          { strTC_KeHoachNhapHoc_Id, strQLSV_NguoiHoc_TTTS_Id }
     Loại hồ sơ           SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIJLhIuDykgMQkuIgPP
                          PKG_CORE_NhapHoc_ThuTien.LayDSCacHoSoNhapHoc (POST)      | NH_ThongTin/LayDSCacHoSoNhapHoc (GET)
                          { strQLSV_NguoiHoc_TTTS_Id, strNguoiThucHien_Id = userId }
     Xem hồ sơ minh chứng SV_Core_NhapHoc_ThuTien_MH/DSA4BRIVKS4vJhUoLwkuEi4MKC8pAik0LyYP
                          PKG_CORE_NhapHoc_ThuTien.LayDSThongTinHoSoMinhChung      | NH_ThongKe/LayDSThongTinHoSoMinhChung (GET)
                          { strQLSV_NguoiHoc_Id = QLSV_NGUOIHOC_ID, strLoaiHoSo_Id = LOAIHOSO_ID }
     Lưu                  SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4VKTQJLhIu
                          PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuHoSo (POST)          | NH_ThongTin/NhapHoc_ThuHoSo (POST)
                          { strChucNang_Id, strQLSV_NguoiHoc_TTTS_Id, strLoaiHoSo_Ids (LOAIHOSO_ID nối phẩy),
                            strLoaiHoSo_SoLuong_s (số lượng / "1"|"0" ô đánh dấu), strNguoiThucHien_Id = userId }
     Tệp từng loại hồ sơ  ums.files (edu.system.uploadFiles / viewFiles / saveFiles, api SV_Files, id = ID dòng loại hồ sơ)
     Xuất báo cáo         ums.report.mount (getList_MauImport "zonebtnTHS"):
                          strTaiChinh_KeHoach_Id + strQLSV_NguoiHoc_Id cho mỗi người đã đánh dấu + người đang chọn

   Khác bản gốc
     · LayDSNhapHoc_HoSo (bản cũ NH_HoSo/LayDanhSach) gốc gọi mỗi lần chọn người học nhưng chỉ console.log
       kết quả → bỏ lời gọi thừa.
     · Cột "Cần nộp" của khối Tài chính gốc là ô nhập mà onblur gọi main_doc.ThuTien (không tồn tại trên màn này
       → lỗi JS) và không gửi đi đâu → chỉ hiện số (định mức − đã thu, âm thì 0).
     · Bản cũ đọc kế hoạch từ #dropKeHoachNhapHoc_ThuTien (không có trên màn → gửi rỗng) → gửi kế hoạch đang chọn.
     · Ô số lượng thực thu: gốc ghi value="null" khi chưa thu; onblur checkValid_ThuHoSo không bao giờ chạy
       (thiếu '#', lại truyền số THỰC THU làm mức trần) → không chặn trần (đúng hành vi đang chạy), chỉ nhận số.
     · "Xóa" ở dòng ô đánh dấu (KIEUDULIEU_MA = CHECK): gốc chỉ xoá ô chữ → nay bỏ đánh dấu.
     · Lưu: đợi gắn tệp mới xong rồi mới gửi NhapHoc_ThuHoSo; lưu xong nạp lại bảng loại hồ sơ.
     · Bỏ: vùng "Sửa số phiếu thu" / "Chọn khoản cần xuất hóa đơn" / "Số phiếu đã thu, đã hủy" / nút "Thu hs"
       (luôn ẩn, không có trình xử lý nào hiện chúng).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, esc = ui.esc, pat = ums.pat;
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function so(v) { var n = Number(pat.num(v)); return isNaN(n) ? 0 : n; }

    var AC = {
        khoan: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIKKS4gLw8pIDEJLiIP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSCacKhoanNhapHoc' },
        loai: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRICICIJLhIuDykgMQkuIgPP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSCacHoSoNhapHoc' },
        minhChung: { action: 'SV_Core_NhapHoc_ThuTien_MH/DSA4BRIVKS4vJhUoLwkuEi4MKC8pAik0LyYP', func: 'PKG_CORE_NhapHoc_ThuTien.LayDSThongTinHoSoMinhChung' },
        luu: { action: 'SV_Core_NhapHoc_ThuTien_MH/DykgMQkuIh4VKTQJLhIu', func: 'PKG_CORE_NhapHoc_ThuTien.NhapHoc_ThuHoSo' }
    };
    var AC_CU = {
        khoan: { action: 'NH_DinhMuc_Chung/LayDSCacKhoanNhapHoc', method: 'GET' },
        loai: { action: 'NH_ThongTin/LayDSCacHoSoNhapHoc', method: 'GET' },
        minhChung: { action: 'NH_ThongKe/LayDSThongTinHoSoMinhChung', method: 'GET' },
        luu: { action: 'NH_ThongTin/NhapHoc_ThuHoSo' }
    };

    ums.nhThuHoSo = {
        man: function (root, cfg) {
            cfg = cfg || {};
            var A = cfg.cu ? AC_CU : AC;
            function goi(k, thamSo) {
                var o = { action: A[k].action, versionAPI: 'v1.0' };
                if (A[k].func) o.func = A[k].func;
                if (A[k].method) o.method = A[k].method;
                Object.keys(thamSo).forEach(function (x) { o[x] = thamSo[x]; });
                return ums.api.call(o);
            }

            var S = { loai: [], khoan: [], tep: {}, nguoi: null, dangLuu: false };
            var ds;

            ds = ums.nhDs.cot({
                el: root, title: cfg.title || 'Thu hồ sơ', cu: cfg.cu, cmnd: !cfg.cu, chonNhieu: true,
                chuaNhap: 'Chưa nhập',
                actions: '<span data-th="bc"></span>',
                nhac: 'Chọn một người học ở cột trái để thu hồ sơ',
                onChon: moNguoi,
                onBoChon: function () { S.nguoi = null; }
            });

            ds.noiDung.innerHTML =
                '<div class="ums-panel" data-th="hs"><div class="ums-panel__body" data-th="hsBody"></div></div>' +
                '<div class="ums-panel" data-th="tc"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-money-bill"></i> Tài chính</div>' +
                '<div class="ums-panel__tools">' +
                (cfg.cu ? '' : ui.btn('view', { text: 'Xem thông tin nộp phí', icon: 'fa-eye', attr: { 'data-th': 'tcNut' } })) +
                '</div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-th="tcBody"' + (cfg.cu ? '' : ' hidden') + '></div></div>' +
                '<div class="ums-panel" data-th="tui"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-address-book"></i> Túi hồ sơ</div>' +
                '<div class="ums-panel__tools">' + ui.btn('save', { text: 'Lưu', attr: { 'data-th': 'luu' } }) + '</div></div>' +
                '<div class="ums-panel__body ums-panel__body--flush" data-th="tuiBody"></div></div>';
            function z(k) { return ds.noiDung.querySelector('[data-th="' + k + '"]'); }

            /* Xuất báo cáo — getList_MauImport("zonebtnTHS") */
            ums.report.mount(root.querySelector('[data-th="bc"]'), {
                collect: function (add) {
                    ds.daDanhDau().forEach(function (id) { add('strQLSV_NguoiHoc_Id', id); });
                    add('strTaiChinh_KeHoach_Id', ds.keHoach());
                    if (S.nguoi) add('strQLSV_NguoiHoc_Id', S.nguoi.ID);
                }
            });

            function moNguoi(r) {
                S.nguoi = r;
                ums.nhDs.dau(z('hs'), r, ui.btn('close', { attr: { 'data-th': 'dong' } }));
                z('hsBody').innerHTML = ums.nhDs.hoSo(r);
                taiKhoan(r);
                taiLoai(r);
            }

            /* ---------------- Tài chính (getList_KhoanNhapHoc → genTable_KhoanNhapHoc) ---------------- */
            function taiKhoan(r) {
                z('tcBody').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                goi('khoan', { strTC_KeHoachNhapHoc_Id: ds.keHoach(), strQLSV_NguoiHoc_TTTS_Id: r.ID }).then(function (res) {
                    if (S.nguoi !== r) return;
                    S.khoan = Array.isArray(res.data) ? res.data : [];
                    veKhoan();
                }).catch(function (err) { z('tcBody').innerHTML = ui.fail(err.message); ums.api.handle(err, 'các khoản nhập học'); });
            }
            function canNop(x) { var t = so(x.SOTIENDINHMUC) - so(x.SOTIENDATHU); return t < 0 ? 0 : t; }
            function veKhoan() {
                ui.table({
                    el: z('tcBody'), rows: S.khoan, empty: 'Không có khoản nhập học',
                    columns: [
                        { title: 'Tên phí', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                        { title: 'Định mức', group: ['Số tiền'], cls: 'is-right', prop: 'SOTIENDINHMUC_CHUNG', sum: true,
                          render: function (x) { return ui.money(so(x.SOTIENDINHMUC_CHUNG)); } },
                        { title: 'Thực thu', group: ['Số tiền'], cls: 'is-right', prop: 'SOTIENDINHMUC', sum: true,
                          render: function (x) { return ui.money(so(x.SOTIENDINHMUC)); } },
                        { title: 'Đã thu', group: ['Số tiền'], cls: 'is-right', prop: 'SOTIENDATHU', sum: true,
                          render: function (x) {
                              var t = ui.money(so(x.SOTIENDATHU));
                              return so(x.SOTIENDATHU) > so(x.SOTIENDINHMUC) ? '<span class="nh-vuot">' + t + '</span>' : t;
                          } },
                        { title: 'Cần nộp', group: ['Số tiền'], cls: 'is-right',
                          render: function (x) { return ui.money(canNop(x)); },
                          sum: function (rows) { return '<b>' + ui.money(rows.reduce(function (a, x) { return a + canNop(x); }, 0)) + '</b>'; } },
                        { title: 'Đơn vị', cls: 'is-center', render: function () { return 'vnđ'; }, sum: function () { return 'vnđ'; } }
                    ]
                });
            }

            /* ---------------- Túi hồ sơ (getList_LoaiHoSo → genFormInput_ThuHoSo) ---------------- */
            function taiLoai(r) {
                z('tuiBody').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return goi('loai', { strQLSV_NguoiHoc_TTTS_Id: r.ID, strNguoiThucHien_Id: ums.session.userId }).then(function (res) {
                    if (S.nguoi !== r) return;
                    S.loai = Array.isArray(res.data) ? res.data : [];
                    veLoai();
                }).catch(function (err) { z('tuiBody').innerHTML = ui.fail(err.message); ums.api.handle(err, 'các loại hồ sơ nhập học'); });
            }
            function laCheck(x) { return x.KIEUDULIEU_MA === 'CHECK'; }
            function veLoai() {
                /* gộp dòng theo NHOMHOSO_TEN (actionRowSpan cột Nhóm hồ sơ) — thứ tự dòng giữ như máy chủ trả */
                var nhom = [];
                S.loai.forEach(function (x) {
                    var g = nhom[nhom.length - 1];
                    if (!g || g.row.NHOMHOSO_TEN !== x.NHOMHOSO_TEN) nhom.push(g = { row: { NHOMHOSO_TEN: x.NHOMHOSO_TEN }, rows: [] });
                    g.rows.push(x);
                });
                pat.groupTable({
                    el: z('tuiBody'), groups: nhom, empty: 'Không có loại hồ sơ',
                    groupCols: [{ title: 'Nhóm hồ sơ', prop: 'NHOMHOSO_TEN' }],
                    cols: [
                        { title: 'Loại hồ sơ', render: function (x, i) {
                            return esc((i + 1) + '. ' + e(x.LOAIHOSO_TEN)) +
                                (x.NHAPHOC_XACMINH_LOAIHOSO ? ' <button type="button" class="ums-btn ums-btn--quiet ums-btn--sm" data-xem="' + esc(x.ID) + '"><i class="fa-light fa-eye"></i><span>Xem Hồ sơ</span></button>' : '');
                        } },
                        { title: 'Số lượng quy định', cls: 'is-right', width: '120px', prop: 'SOLUONGQUYDINH' },
                        { title: 'Số lượng thực thu', cls: 'is-right', width: '150px', render: function (x) {
                            if (laCheck(x)) return '<input type="checkbox" data-sl="' + esc(x.ID) + '"' + (x.SOLUONGTHUCTE ? ' checked' : '') + '>';
                            return '<input class="ums-input ums-input--sm nh-so" data-sl="' + esc(x.ID) + '" inputmode="numeric" placeholder="Nhập số lượng" value="' + esc(e(x.SOLUONGTHUCTE)) + '">';
                        } },
                        { title: 'Files', width: '260px', render: function (x) { return '<div data-tep="' + esc(x.ID) + '"></div>'; } },
                        { title: 'Xóa', cls: 'is-center', width: '64px', render: function (x) {
                            /* nút xoá chuẩn (fa-trash-can, màu đỏ) — người dùng 2026-09-27: "sai quy tắc của nút xóa" */
                            return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoasl="' + esc(x.ID) + '" title="Xoá số lượng thực thu"><i class="fa-light fa-trash-can"></i></button>';
                        } }
                    ]
                });
                S.tep = {};
                S.loai.forEach(function (x) {
                    var host = z('tuiBody').querySelector('[data-tep="' + cssEsc(x.ID) + '"]');
                    if (!host) return;
                    var f = S.tep[x.ID] = ums.files.mount(host, { api: 'SV_Files' });
                    f.load(x.ID);
                    /* Tải tệp lên xong → số lượng thực thu = số tệp đang có (callback uploadFiles của gốc) */
                    var truoc = 0;
                    new MutationObserver(function () {
                        var moi = host.querySelectorAll('.ums-files__item.is-new').length;
                        var tang = moi > truoc;
                        truoc = moi;
                        if (!tang) return;
                        var o = z('tuiBody').querySelector('input.nh-so[data-sl="' + cssEsc(x.ID) + '"]');
                        if (o) o.value = host.querySelectorAll('.ums-files__item').length;
                    }).observe(host, { childList: true, subtree: true });
                });
            }
            function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(String(s)) : String(s).replace(/["\\]/g, '\\$&'); }

            ds.noiDung.addEventListener('input', function (ev) {
                var o = ev.target.closest('input.nh-so');
                if (!o) return;
                var v = o.value.replace(/[^\d]/g, '');
                if (v !== o.value) o.value = v;
            });

            ds.noiDung.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-th], [data-xem], [data-xoasl]');
                if (!b || !ds.noiDung.contains(b)) return;
                if (b.hasAttribute('data-xoasl')) {
                    var o = z('tuiBody').querySelector('[data-sl="' + cssEsc(b.getAttribute('data-xoasl')) + '"]');
                    if (o) { if (o.type === 'checkbox') o.checked = false; else o.value = ''; }
                    return;
                }
                if (b.hasAttribute('data-xem')) { xemMinhChung(b.getAttribute('data-xem')); return; }
                switch (b.getAttribute('data-th')) {
                    case 'dong': ds.boChon(); break;
                    case 'luu': luu(b); break;
                    case 'tcNut':
                        var an = !z('tcBody').hidden;
                        z('tcBody').hidden = an;
                        b.querySelector('span').textContent = an ? 'Xem thông tin nộp phí' : 'Ẩn thông tin nộp phí';
                        b.querySelector('i').className = an ? 'fa-light fa-eye' : 'fa-light fa-eye-slash';
                        break;
                }
            });

            /* ---------------- Xem hồ sơ minh chứng (getList_QuanSoTheoLop, #myModal) ---------------- */
            function xemMinhChung(id) {
                var x = S.loai.filter(function (d) { return String(d.ID) === String(id); })[0];
                if (!x) return;
                var dlg = ui.dialog({ title: 'Chi tiết — ' + e(x.LOAIHOSO_TEN), icon: 'fa-eye', size: 'lg',
                    body: ui.empty('Đang tải…', 'fa-spinner fa-spin') });
                goi('minhChung', { strQLSV_NguoiHoc_Id: x.QLSV_NGUOIHOC_ID, strLoaiHoSo_Id: x.LOAIHOSO_ID }).then(function (res) {
                    ui.table({
                        el: dlg.body, rows: Array.isArray(res.data) ? res.data : [], empty: 'Không có thông tin',
                        columns: [
                            { title: 'Loại dữ liệu', prop: 'TRUONGTHONGTIN_TEN' },
                            { title: 'Kết quả', render: function (d) { return giaTri(d.TRUONGTHONGTIN_GIATRI); } }
                        ]
                    });
                }).catch(function (err) { dlg.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'hồ sơ minh chứng'); });
            }
            /* Giá trị có thể là đường dẫn tệp minh chứng (gốc chèn HTML thô) → đường dẫn thì thành liên kết */
            function giaTri(v) {
                var s = e(v).trim();
                if (/^https?:\/\//i.test(s)) return '<a href="' + esc(s) + '" target="_blank" rel="noopener">' + esc(s) + '</a>';
                if (/\.(pdf|jpe?g|png|gif|docx?|xlsx?)$/i.test(s) && s.indexOf(' ') < 0) {
                    return '<a href="' + esc(ums.files.url(s)) + '" target="_blank" rel="noopener">' + esc(s.split('/').pop()) + '</a>';
                }
                return ui.escBr(s);
            }

            /* ---------------- Lưu (save_ThuHoSo) ---------------- */
            function luu(btn) {
                var r = S.nguoi;
                if (!r) { ui.toast('Vui lòng chọn Người học cần thu hồ sơ!', 'warn'); return; }
                if (S.dangLuu) return;
                if (Object.keys(S.tep).some(function (k) { return S.tep[k].busy(); })) { ui.toast('Đang tải tệp lên, vui lòng chờ…', 'warn'); return; }
                var ids = [], sl = [];
                S.loai.forEach(function (x) {
                    var o = z('tuiBody').querySelector('[data-sl="' + cssEsc(x.ID) + '"]');
                    var v = !o ? '' : (o.type === 'checkbox' ? (o.checked ? '1' : '0') : pat.num(o.value));
                    ids.push(x.LOAIHOSO_ID);
                    sl.push(v);
                });
                S.dangLuu = true; btn.disabled = true;
                /* saveFiles cho dòng có tệp mới rồi NhapHoc_ThuHoSo */
                Object.keys(S.tep).reduce(function (p, id) {
                    return p.then(function () { return S.tep[id].pending() ? S.tep[id].save(id) : null; });
                }, Promise.resolve()).then(function () {
                    return goi('luu', {
                        strChucNang_Id: ums.state.chucNangId || '',
                        strQLSV_NguoiHoc_TTTS_Id: r.ID,
                        strLoaiHoSo_Ids: ids.toString(),
                        strLoaiHoSo_SoLuong_s: sl.toString(),
                        strNguoiThucHien_Id: ums.session.userId
                    });
                }).then(function () {
                    ui.toast('Thu hồ sơ thành công!', 'ok');
                    return taiLoai(r);
                }).catch(function (err) { ums.api.handle(err, 'thu hồ sơ'); })
                  .then(function () { S.dangLuu = false; btn.disabled = false; });
            }
        }
    };
})();
