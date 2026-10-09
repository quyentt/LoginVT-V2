/* =========================================================================
   NCKH — Giải thưởng / Văn bằng sáng chế / Hội nghị hội thảo: khung ums.nckhGT (nhóm B, tiền tố _gt_)
   Bản gốc: ApisNCKH/Modules/quanlysanpham/script/{giaithuong,vanbangsangche,hoinghihoithao}.js (QUẢN TRỊ —
   kê khai thay mọi cán bộ, hai cột) và ApisNCKH/Modules/xacnhankekhai/script/<cùng tên>.js (XÁC NHẬN kê khai —
   một cột: thanh lọc + bảng + chi tiết thay chỗ + hộp "Xác nhận sản phẩm").
   DÙNG LẠI khung Cổng cán bộ ApisCongCanBo/Modules/sanphamkhoahoc/script/_sanpham.js (ums.nckh): N.item (tên +
   tình trạng ở cột trái), N.locNam (ô năm đánh giá), N.kinhPhi (nguồn kinh phí), N.tepRieng (tệp gắn <id>_QD),
   N.g / N.e / N.arr / N.uid. KHÔNG sửa tệp CCB — chỗ khác làm bằng khung riêng dưới đây:
     · N.man chỉ có ô lọc Năm + Từ khoá; bản quản trị cần thêm Đơn vị → Thành viên, Đề tài (và Phạm vi / Lĩnh vực /
       Đơn vị tổ chức ở Hội nghị) → G.quanTri là bản của N.man nhận cfg.locThem.
     · N.thanhVien không có cột "Hình ảnh", luôn gửi năm đánh giá → G.thanhVien (có ảnh, cờ xem = chỉ đọc).
     · N.deTai chỉ nạp đề tài của NGƯỜI ĐĂNG NHẬP (strThanhVien_Id = userId); bản quản trị nạp MỌI đề tài
       (strThanhVien_Id rỗng, như gốc) → G.deTai.
   ---------------------------------------------------------------------------
   G.quanTri(root, cfg)  — hai cột (ums.crud master). cfg: tieuDe, dsTieuDe, icon, formTitle, ctl, ten(r), ds(f) → tham số
       danh sách (f: q, dv, tv, nam, detai + khoá của locThem), paged, locThem [ô lọc crud], fields, luu(v, row, x) →
       tham số lưu (x: nam + giá trị khối), khoi [ { html, gan, nap, moi, luu(id, isEdit, x), gt() } ], loiChao, onForm.
   G.xacNhan(root, cfg) — một cột. cfg: tieuDe, dsTieuDe, icon, formTitle, ctl, ten(r), cotTen, cot [cột bảng], ds(f),
       locThem, bc { ma, thu(f) } (Xuất báo cáo), xem [ { legend } | { label, col, dm } ] (khung chi tiết chỉ xem),
       kinhPhi (true: bảng nguồn kinh phí), vaiTro (mã danh mục vai trò thành viên).
   Lời gọi chung của bản xác nhận (edu.extend Corei/systemextend.js:3267):
     NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung  GET strChucNang_Id, strNguoiThucHien_Id → các tình trạng
     NCKH_SP_XacNhanKeKhai/ThemMoi  POST strId '', strSanPham_Id, strNoiDung, strTinhTrang_Id, strNguoiXacnhan_Id
     NCKH_SP_XacNhanKeKhai/LayDanhSach GET strTuKhoa '', strSanPham_Id, strTinhTrang_Id '', strNguoiThucHien_Id '', 1/100000
     NCKH_Files/GopFile  POST arrTuKhoa (đường dẫn tệp) · arrDuLieu (tên tệp) · strNguoiThucHien_Id → mở tệp nén
   Khác bản gốc: xem đầu tệp _gt_cauhinh.js.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nckh;
    var e = N.e, arr = N.arr, uid = N.uid;
    var G = ums.nckhGT = ums.nckhGT || {};
    function esc(s) { return ui.esc(s); }
    var DANG_TAI = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    function q2(el, sel) { return el.querySelector(sel); }
    function s2(el) { if (window.jQuery && el) jQuery(el).trigger('change.select2'); }

    /* ---------- Nguồn / ô lọc dùng chung --------------------------------- */
    /** NCKH_DeTai/LayDanhSach — MỌI đề tài (strThanhVien_Id rỗng như gốc quản trị). them: tham số thêm của từng bản gốc */
    G.nguonDeTai = function (them) {
        return { call: Object.assign({ action: 'NCKH_DeTai/LayDanhSach', method: 'GET', iTinhTrang: -1, iTrangThai: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: '',
            strTuKhoaText: '', dTuKhoaNumber: -1, strNCKH_DeCuong_Id: '', strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: '', strNguonKinhPhi_Id: '',
            strThietKeNghienCuu_Id: '', strNCKH_ThanhVien_Id: '', strDonVi_Id_CuaThanhVien_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strTinhTrang_Id: '',
            strPhanLoaiDeTai_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '', pageIndex: 1, pageSize: 10000000 }, them || {}),
            name: 'TENDETAITIENGVIET' };
    };
    G.locDonVi = function () { return { key: 'dv', type: 'select', label: 'Tất cả đơn vị thành viên' }; };
    G.locThanhVien = function () { return { key: 'tv', type: 'select', label: 'Tất cả thành viên đăng ký' }; };
    G.locDeTai = function (src) { return { key: 'detai', type: 'select', label: 'Chọn đề tài', source: src }; };
    G.locDm = function (key, dm, label) { return { key: key, type: 'select', label: label, source: { dm: dm } }; };

    /** Đơn vị → Thành viên (getList_CoCauToChuc + getList_HS gốc: NS_HoSoV2/LayDanhSach GET). Luật CHA → CON:
        chưa chọn đơn vị thì khoá ô thành viên (gốc nạp sẵn toàn trường). → Promise (đã đổ đơn vị) */
    G.noiDonVi = function (root, pageSize) {
        var dv = q2(root, '[data-scope="filter"][data-k="dv"]'), tv = q2(root, '[data-scope="filter"][data-k="tv"]');
        if (!dv || !tv) return Promise.resolve();
        function napTv() {
            var id = dv.value;
            if (!id) { pat.fill(tv, [], { head: 'Tất cả thành viên đăng ký' }); return; }
            ums.api.call({ action: 'NS_HoSoV2/LayDanhSach', method: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: pageSize || 1000000,
                strDaoTao_CoCauToChuc_Id: id, strNguoiThucHien_Id: '', dLaCanBoNgoaiTruong: 0 })
                .then(function (r) {
                    if (dv.value !== id) return;
                    pat.fill(tv, arr(r.data), { head: 'Tất cả thành viên đăng ký', name: function (x) { return e(x.HOTEN) + ' - ' + e(x.MASO); } });
                }).catch(function (err) { ums.api.handle(err, 'thành viên'); });
        }
        if (window.jQuery) jQuery(dv).on('select2:select', napTv);
        pat.chain([dv, tv]);
        return ums.ref.coCauToChuc({}).then(function (d) { pat.fill(dv, d, { head: 'Tất cả đơn vị thành viên', name: 'TEN' }); })
            .catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    };

    /* =====================================================================
       Khối THÀNH VIÊN (NCKH_ThanhVien) — có cột Hình ảnh như gốc.
       o = { vaiTro: mã danh mục | null, them(x) → tham số ThemMoi thêm (GT: năm đánh giá), xem: true (chỉ đọc) }
       Gốc: ThemMoi cho MỌI dòng mỗi lần lưu (upsert); Xoa strSanPham_Id + strThanhVien_Id (dòng đã lưu).
       ===================================================================== */
    G.thanhVien = function (o) {
        o = o || {};
        var ds = [], vt = [], el = null, spId = '';
        var K = {
            html: pat.panel({ title: 'Thành viên tham gia', icon: 'fa-users', flush: true, zone: 'gtTv', cls: 'ums-u-mt-4',
                tools: o.xem ? '' : ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-gttv': 'them' } }) }),
            gan: function (host) {
                el = host;
                if (o.vaiTro) ums.api.dm(o.vaiTro).then(function (d) { vt = d; ve(); }).catch(function (err) { ums.api.handle(err, 'vai trò'); });
                host.addEventListener('click', function (ev) {
                    if (ev.target.closest('[data-gttv="them"]')) { chon(); return; }
                    var x = ev.target.closest('[data-gttv-xoa]');
                    if (x) xoa(Number(x.getAttribute('data-gttv-xoa')));
                });
                host.addEventListener('change', function (ev) {
                    var i = ev.target.getAttribute('data-gttv-vt');
                    if (i !== null && ds[Number(i)]) ds[Number(i)].vaiTro = ev.target.value;
                });
                ve();
            },
            nap: function (row) {
                spId = row.ID; ds = [];
                var z = q2(el, '[data-z="gtTv"]');
                if (z) z.innerHTML = DANG_TAI;
                return N.g('NCKH_ThanhVien/LayDanhSach', { strSanPham_Id: row.ID, pageIndex: 1, pageSize: o.pageSize || 100 }).then(function (r) {
                    ds = arr(r.data).map(function (x) {
                        return { id: e(x.ID), ten: e(x.HOTEN) + (e(x.MACANBO) ? ' - ' + e(x.MACANBO) : ''), anh: e(x.ANH), vaiTro: e(x.VAITRO_ID), vaiTroTen: e(x.VAITRO_TEN), daLuu: true };
                    });
                    ve();
                }).catch(function (err) { ums.api.handle(err, 'thành viên'); });
            },
            moi: function () { spId = ''; ds = []; ve(); },
            luu: function (id, isEdit, x) {
                return ds.reduce(function (p, r) {
                    return p.then(function () {
                        return N.g('NCKH_ThanhVien/ThemMoi', Object.assign({ strSanPham_Id: id, strThanhVien_Id: r.id, strVaiTro_Id: o.vaiTro ? r.vaiTro : '',
                            dTyLeThamGia: '', strNguoiThucHien_Id: uid() }, o.them ? o.them(x || {}) : {}), true);
                    });
                }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu thành viên'); });
            }
        };
        function tenVt(id) { var x = vt.filter(function (v) { return e(v.ID) === id; })[0]; return x ? e(x.TEN) : ''; }
        function ve() {
            var z = el && q2(el, '[data-z="gtTv"]');
            if (!z) return;
            var cot = [{ title: 'Họ tên', render: function (r) { return '<span class="gt-tv">' + pat.anhNguoi(r.anh) + '<span>' + esc(r.ten) + '</span></span>'; } }];
            if (o.vaiTro) cot.push({ title: 'Vai trò', width: '260px', render: function (r, i) {
                if (o.xem) return esc(r.vaiTroTen || tenVt(r.vaiTro));
                return '<select class="ums-select ums-input--sm" data-gttv-vt="' + i + '"><option value="">Chọn vai trò</option>' + vt.map(function (v) {
                    return '<option value="' + esc(v.ID) + '"' + (e(v.ID) === r.vaiTro ? ' selected' : '') + '>' + esc(e(v.TEN)) + '</option>';
                }).join('') + '</select>';
            } });
            if (!o.xem) cot.push({ title: 'Xóa', cls: 'is-center', width: '70px', render: function (r, i) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-gttv-xoa="' + i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>';
            } });
            ui.table({ el: z, rows: ds, columns: cot, empty: o.xem ? 'Chưa có thành viên' : 'Vui lòng chọn thành viên tham gia' });
        }
        function chon() {
            pat.pickNhanSu({ title: 'Tìm kiếm nhân sự', onPick: function (list) {
                var trung = 0;
                list.forEach(function (r) {
                    if (ds.some(function (x) { return x.id === e(r.ID); })) { trung++; return; }
                    ds.push({ id: e(r.ID), ten: e(r.HOTEN) + (e(r.MASO) ? ' - ' + e(r.MASO) : ''), anh: e(r.ANH), vaiTro: '', daLuu: false });
                });
                if (trung) ui.toast(trung + ' nhân sự đã có trong danh sách', 'info');
                ve();
            } });
        }
        function xoa(i) {
            var r = ds[i];
            if (!r) return;
            if (!r.daLuu || !spId) { ds.splice(i, 1); ve(); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa thành viên này?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                N.g('NCKH_ThanhVien/Xoa', { strSanPham_Id: spId, strThanhVien_Id: r.id }, true)
                    .then(function () { ds.splice(ds.indexOf(r), 1); ve(); ui.toast('Xóa thành công!', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'xoá thành viên'); });
            });
        }
        return K;
    };

    /* ---------- Khối "Đề tài của sản phẩm" (MỌI đề tài) ------------------- */
    G.deTai = function (o) {
        var sel = null, muon = '', xong = false;
        return {
            html: pat.panel({ title: 'Đề tài của sản phẩm', icon: 'fa-flask', cls: 'ums-u-mt-4', body:
                '<div class="ums-grid ums-grid--2"><div>' + ui.field('Thuộc đề tài', '<select class="ums-select" data-gtdt="1" data-ph="Chọn đề tài"><option value="">Chọn đề tài</option></select>') +
                '</div><div class="ums-u-faint ums-u-fz13 nk-chuy"><b>Chú ý:</b> Nếu sản phẩm không thuộc đề tài nào thì bỏ qua mục này</div></div>' }),
            gan: function (host) {
                sel = q2(host, '[data-gtdt]'); xong = false;
                ui.enhance(host);
                return ums.crud.loadSource(o.src).then(function (d) {
                    pat.fill(sel, d, { head: 'Chọn đề tài', name: 'TENDETAITIENGVIET' });
                    xong = true; sel.value = muon; s2(sel);
                }).catch(function (err) { ums.api.handle(err, 'đề tài'); });
            },
            nap: function (row) { dat(e(row.NCKH_QUANLYDETAI_ID)); }, moi: function () { dat(''); },
            gt: function () { var v = {}; v[o.key] = sel ? sel.value : ''; return v; }
        };
        /* Nguồn đề tài chưa về mà đã đổ giá trị thì ô chọn chưa có mục đó → giữ lại, đặt khi nạp xong */
        function dat(v) { muon = v; if (sel && xong) { sel.value = v; s2(sel); } }
    };

    /* =====================================================================
       BẢN QUẢN TRỊ — hai cột
       ===================================================================== */
    G.quanTri = function (root, cfg) {
        var khoi = cfg.khoi || [], crud;
        var deTaiSrc = G.nguonDeTai();
        function loc(k) { var s = q2(root, '[data-scope="filter"][data-k="' + k + '"]'); return s ? s.value : ''; }
        function giaTriKhoi() {
            var x = { nam: loc('nam') };
            khoi.forEach(function (k) { if (k.gt) Object.assign(x, k.gt()); });
            return x;
        }
        crud = ums.crud({
            root: root, title: cfg.tieuDe, formTitle: cfg.formTitle, icon: cfg.icon,
            master: { title: cfg.dsTieuDe, icon: cfg.icon, item: function (r) { return N.item(cfg.ten(r), r); },
                empty: cfg.loiChao || 'Hôm nay bạn có sản phẩm mới không? Bấm Thêm mới ở đầu trang.' },
            filters: [{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }, G.locDonVi(), G.locThanhVien(), N.locNam()]
                .concat(cfg.locThem || []).concat([G.locDeTai(deTaiSrc)]),
            autoload: false,
            list: { paged: cfg.paged !== false, call: function (f) { return Object.assign({ action: cfg.ctl + '/LayDanhSach', method: 'GET' }, cfg.ds(f)); } },
            fields: cfg.fields,
            formCols: cfg.formCols,
            save: function (v, row) {
                var p = cfg.luu(v, row, giaTriKhoi());
                p.action = cfg.ctl + (row ? '/CapNhat' : '/ThemMoi');
                p.strId = row ? row.ID : '';
                return p;
            },
            remove: function (ids) { return ids.map(function (id) { return { action: cfg.ctl + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); },
            onForm: function (row, c, extra) {
                if (!extra) return;
                extra.innerHTML = khoi.map(function (k) { return '<div data-nk-khoi>' + k.html + '</div>'; }).join('');
                var hosts = extra.querySelectorAll('[data-nk-khoi]');
                khoi.forEach(function (k, i) { if (k.gan) k.gan(hosts[i], c); });
                if (row) khoi.forEach(function (k) { if (k.nap) k.nap(row); });
                else khoi.forEach(function (k) { if (k.moi) k.moi(); });
                if (cfg.onForm) cfg.onForm(row, c, extra);
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var x = giaTriKhoi();
                khoi.reduce(function (p, k) { return p.then(function () { return k.luu ? k.luu(id, isEdit, x) : null; }); }, Promise.resolve());
            }
        });
        Promise.all([crud.sourcesReady, G.noiDonVi(root)]).then(function () { crud.load(1); });
        return crud;
    };

    /* =====================================================================
       BẢN XÁC NHẬN KÊ KHAI — một cột: thanh lọc + bảng; bấm tên → chi tiết thay chỗ danh sách
       ===================================================================== */
    function iconXN(x, dau) {
        var ic = ums.iconFA4 ? ums.iconFA4(e(x[dau + 'THONGTIN1']) || 'fa fa-circle-check') : 'fa-light fa-circle-check';
        return '<i class="' + esc(ic) + '"' + (e(x[dau + 'THONGTIN2']) ? ' style="' + esc(e(x[dau + 'THONGTIN2'])) + '"' : '') + '></i>';
    }
    G.luuXacNhan = function (spId, tinhTrang, noiDung) {
        return N.g('NCKH_SP_XacNhanKeKhai/ThemMoi', { strId: '', strSanPham_Id: spId, strNoiDung: noiDung || '', strTinhTrang_Id: tinhTrang, strNguoiXacnhan_Id: uid() }, true)
            .then(function () { ui.toast('Xác nhận thành công', 'ok'); })
            .catch(function (err) { ums.api.handle(err, 'xác nhận'); throw err; });
    };

    G.xacNhan = function (root, cfg) {
        root.innerHTML = '<div data-gt="ds"></div><div data-gt="ct" hidden></div>';
        var zDs = q2(root, '[data-gt="ds"]'), zCt = q2(root, '[data-gt="ct"]');
        var dmXN = [], tep = {}, rows = [], dangMo = null;
        var deTaiSrc = G.nguonDeTai({ strDaoTao_CoCauToChuc_Id: '' });
        var xnP = N.g('NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung', { strChucNang_Id: N.chucNang(), strNguoiThucHien_Id: uid() })
            .then(function (r) { dmXN = arr(r.data); return dmXN; })
            .catch(function (err) { ums.api.handle(err, 'danh mục xác nhận'); return []; });
        function nutXN() { return dmXN.filter(function (x) { return e(x.MA) !== 'XNKKCHUAKHAI'; }); }

        var crud = ums.crud({
            root: zDs, title: cfg.tieuDe, icon: cfg.icon, listTitle: cfg.dsTieuDe,
            filters: [G.locDonVi(), G.locThanhVien(), { key: 'tt', type: 'select', label: 'Tất cả tình trạng' }]
                .concat(cfg.locThem || []).concat([G.locDeTai(deTaiSrc), N.locNam(), { key: 'q', label: 'Nhập từ khóa tìm kiếm' }]),
            toolbar: [
                { text: 'Xuất báo cáo', icon: 'fa-file-chart-column', mod: 'out-info', onClick: baoCao },
                { text: 'Tải file', icon: 'fa-cloud-arrow-down', mod: 'out-primary', onClick: taiFile }
            ],
            autoload: false,
            list: { paged: true, call: function (f) { return Object.assign({ action: cfg.ctl + '/LayDanhSach', method: 'GET' }, cfg.ds(f)); } },
            columns: [{ title: cfg.cotTen, render: function (r) {
                return '<button type="button" class="ums-link" data-gt-mo="' + esc(r.ID) + '">' + esc(cfg.ten(r)) + '</button>';
            } }].concat(cfg.cot).concat([
                { title: 'File đính kèm', render: function (r) { return '<div class="gtxn-tep" data-gt-tep="' + esc(r.ID) + '">' + veTep(r.ID) + '</div>'; } },
                { title: 'Xác nhận', cls: 'is-center', render: function (r) {
                    return '<span class="gtxn-nho">' + nutXN().map(function (x) {
                        return '<button type="button" class="gtxn-nho__nut" data-gt-xn="' + esc(x.ID) + '" data-gt-sp="' + esc(r.ID) + '" title="' + esc(e(x.TEN)) + '">' + iconXN(x, '') + '</button>';
                    }).join('') + '</span>';
                } },
                { title: 'Xác nhận cuối cùng', cls: 'is-center', render: function (r) {
                    return e(r.KETQUAXACNHAN_TEN) ? '<span class="gtxn-kq" title="' + esc(e(r.KETQUAXACNHAN_TEN)) + '">' + iconXN(r, 'KETQUAXACNHAN_') + esc(e(r.KETQUAXACNHAN_TEN)) + '</span>' : '';
                } },
                { title: 'Nội dung xác nhận', prop: 'KETQUAXACNHAN_NOIDUNG' }
            ]),
            onLoad: function (rs) { rows = rs; napTep(rs); }
        });
        var F = function (k) { return q2(zDs, '[data-scope="filter"][data-k="' + k + '"]'); };
        var ttP = xnP.then(function (d) { pat.fill(F('tt'), d, { head: 'Tất cả tình trạng', name: 'TEN' }); });
        Promise.all([crud.sourcesReady, G.noiDonVi(zDs, 100000), ttP]).then(function () { crud.load(1); });

        /* ---- tệp đính kèm từng dòng (viewFiles gốc) ---- */
        function veTep(id) {
            var l = tep[id];
            if (!l) return '';
            return l.map(function (f) {
                var ten = e(f.TENHIENTHI) || e(f.FILEMINHCHUNG).split('/').pop();
                return '<a class="ums-link" href="' + esc(ums.files.url(f.FILEMINHCHUNG)) + '" target="_blank" rel="noopener">' + esc(ten) + '</a>';
            }).join('');
        }
        function napTep(rs) {
            rs.forEach(function (r) {
                N.g('NCKH_Files/LayDanhSach', { strDuLieu_Id: r.ID, silent: true }).then(function (res) {
                    tep[r.ID] = arr(res.data).filter(function (f) { return e(f.FILEMINHCHUNG); });
                    var o = q2(zDs, '[data-gt-tep="' + (window.CSS && CSS.escape ? CSS.escape(r.ID) : r.ID) + '"]');
                    if (o) o.innerHTML = veTep(r.ID);
                }).catch(function () { /* như gốc: lỗi thì để trống ô */ });
            });
        }
        /* ---- .btnDownloadAllFile → NCKH_Files/GopFile (tệp của các dòng đang hiện) ---- */
        function taiFile() {
            var arrUrl = [], arrTen = [];
            rows.forEach(function (r) {
                (tep[r.ID] || []).forEach(function (f) { arrUrl.push(e(f.FILEMINHCHUNG)); arrTen.push(e(f.TENHIENTHI)); });
            });
            if (!arrUrl.length) { ui.toast('Không có tệp nào để tải', 'warn'); return; }
            N.g('NCKH_Files/GopFile', { arrTuKhoa: arrUrl, arrDuLieu: arrTen, strNguoiThucHien_Id: uid() }, true).then(function (r) {
                var d = r.data;
                if (d && typeof d === 'string') window.open(ums.files.url(d));
            }).catch(function (err) { ums.api.handle(err, 'gộp tệp'); });
        }
        /* ---- Xuất báo cáo (zonebtnBaoCao_* → edu.system.report(<mã>)) ---- */
        function baoCao() {
            ums.report.run(cfg.bc.ma, { collect: function (add) {
                var p = cfg.bc.thu(crud.filterValues());
                Object.keys(p).forEach(function (k) { add(k, p[k]); });
            } });
        }

        /* ---- Nút nhỏ trong bảng: hỏi mô tả rồi lưu (btnxacnhan_small gốc) ---- */
        function xacNhanNhanh(spId, ttId) {
            var r = rows.filter(function (x) { return x.ID === spId; })[0] || {};
            var t = dmXN.filter(function (x) { return x.ID === ttId; })[0] || {};
            var dlg = ui.dialog({ title: 'Xác nhận', icon: 'fa-circle-check', size: 'md', body:
                '<p>Xác nhận <b>' + esc(e(t.TEN)) + '</b> cho sản phẩm <b>' + esc(cfg.ten(r)) + '</b>!</p>' +
                ui.field('Mô tả xác nhận', '<input class="ums-input" data-x="mt" autocomplete="off" placeholder="Mô tả xác nhận">'),
                buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function () {
                    var mt = (q2(dlg.body, '[data-x="mt"]').value || '').trim();
                    G.luuXacNhan(spId, ttId, mt).then(function () { crud.load(); }, function () {});
                } }] });
        }
        zDs.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-gt-xn]');
            if (b) { xacNhanNhanh(b.getAttribute('data-gt-sp'), b.getAttribute('data-gt-xn')); return; }
            var m = ev.target.closest('[data-gt-mo]');
            if (m) { var r = rows.filter(function (x) { return x.ID === m.getAttribute('data-gt-mo'); })[0]; if (r) moChiTiet(r); }
        });

        /* ---- Chi tiết chỉ xem (zone_input gốc không có nút Lưu) ---- */
        var dmL = {};       // mã danh mục → danh sách (tên hiện cho ô chọn của biểu mẫu gốc)
        function napDm() {
            return Promise.all((cfg.xem || []).filter(function (x) { return x.dm && !dmL[x.dm]; }).map(function (x) {
                return ums.api.dm(x.dm).then(function (l) { dmL[x.dm] = l; }, function () { dmL[x.dm] = []; });
            }));
        }
        function giaTri(r, x) {
            var v = e(r[x.col]);
            if (x.dm && v) {
                var hit = (dmL[x.dm] || []).filter(function (y) { return e(y.ID) === v; })[0];
                return hit ? e(hit.TEN) : (e(r[x.col.replace(/_ID$/, '_TEN')]) || v);
            }
            return v;
        }
        function kv(r) {
            var h = '', mo = false;
            (cfg.xem || []).forEach(function (x) {
                if (x.legend) {
                    if (mo) h += '</div>';
                    h += '<div class="ums-legend">' + esc(x.legend) + '</div><div class="ums-grid ums-grid--2">';
                    mo = true; return;
                }
                h += '<div class="ums-kv' + (x.dai ? '" style="grid-column:1 / -1' : '') + '"><span>' + esc(x.label) + '</span><b>' + esc(giaTri(r, x)) + '</b></div>';
            });
            if (mo) h += '</div>';
            return h;
        }
        function moChiTiet(r) {
            dangMo = r;
            napDm().then(function () { veChiTiet(r); });
        }
        function veChiTiet(r) {
            var tv = G.thanhVien({ xem: true, vaiTro: cfg.vaiTro, pageSize: cfg.tvPageSize });
            zCt.innerHTML =
                '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">' + esc(cfg.tieuDe) + '</h1></div>' +
                pat.panel({ title: 'Thông tin ' + cfg.formTitle, icon: 'fa-eye', tools:
                    ui.btn('close', { attr: { 'data-gtct': 'dong' } }) + ui.btn('confirm', { text: 'Xác nhận sản phẩm', attr: { 'data-gtct': 'xn' } }),
                    body: kv(r) +
                        '<div class="ums-legend">Nội dung minh chứng</div>' +
                        '<div class="ums-kv"><span>Nội dung minh chứng</span><b>' + esc(e(r.THONGTINMINHCHUNG)) + '</b></div>' +
                        ui.field('File đính kèm', '<div data-gtct="tep"></div>') }) +
                (cfg.kinhPhi ? pat.panel({ title: 'Nguồn kinh phí', icon: 'fa-sack-dollar', flush: true, zone: 'gtKp', cls: 'ums-u-mt-4', body: DANG_TAI }) : '') +
                '<div data-gtct="tv">' + tv.html + '</div>' +
                pat.panel({ title: 'Đề tài của sản phẩm', icon: 'fa-flask', cls: 'ums-u-mt-4', body:
                    '<div class="ums-kv"><span>Thuộc đề tài</span><b data-gtct="dt"></b></div>' });
            ums.files.mount(q2(zCt, '[data-gtct="tep"]'), { api: 'NCKH_Files', readonly: true }).load(r.ID);
            var tvHost = q2(zCt, '[data-gtct="tv"]');
            tv.gan(tvHost); tv.nap(r);
            ums.crud.loadSource(deTaiSrc).then(function (d) {
                var x = d.filter(function (y) { return e(y.ID) === e(r.NCKH_QUANLYDETAI_ID); })[0];
                q2(zCt, '[data-gtct="dt"]').textContent = x ? e(x.TENDETAITIENGVIET) : '';
            }).catch(function () {});
            if (cfg.kinhPhi) {
                N.g('NCKH_SP_NguonKinhPhi/LayDanhSach', { strSanPham_Id: r.ID, pageIndex: 1, pageSize: 10000 }).then(function (res) {
                    ui.table({ el: q2(zCt, '[data-z="gtKp"]'), rows: arr(res.data), empty: 'Chưa có nguồn kinh phí', columns: [
                        { title: 'Tên nguồn', prop: 'NGUONKINHPHI_TEN' },
                        { title: 'Số tiền', cls: 'is-right', width: '200px', render: function (x) { return esc(ui.money ? ui.money(String(e(x.SOTIEN)).replace(/,/g, '')) : e(x.SOTIEN)); } },
                        { title: 'Đơn vị', prop: 'DONVITINH_TEN', width: '180px' }] });
                }).catch(function (err) { ums.api.handle(err, 'nguồn kinh phí'); });
            }
            ui.swap(zDs, zCt);
        }
        function dong() { dangMo = null; ui.swap(zCt, zDs); }
        zCt.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-gtct]');
            if (!b) return;
            var a = b.getAttribute('data-gtct');
            if (a === 'dong') dong();
            else if (a === 'xn' && dangMo) hopXacNhan(dangMo);
        });

        /* ---- Hộp "Xác nhận sản phẩm" (#modal_XacNhan gốc) ---- */
        function hopXacNhan(r) {
            var dlg = ui.dialog({ title: 'Xác nhận sản phẩm: ' + cfg.ten(r), icon: 'fa-circle-check', size: 'lg', body:
                ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="gtxn-lon" data-x="nut">' + DANG_TAI + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls">' + DANG_TAI + '</div>' });
            var B = dlg.body;
            xnP.then(function () {
                var d = nutXN();
                q2(B, '[data-x="nut"]').innerHTML = d.length ? d.map(function (x) {
                    return '<button type="button" class="gtxn-lon__nut" data-x-tt="' + esc(x.ID) + '">' + iconXN(x, '') + '<span>' + esc(e(x.TEN)) + '</span></button>';
                }).join('') : ui.empty('Chưa khai báo tình trạng xác nhận');
            });
            N.g('NCKH_SP_XacNhanKeKhai/LayDanhSach', { strTuKhoa: '', strSanPham_Id: r.ID, strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
                .then(function (res) {
                    ui.table({ el: q2(B, '[data-x="ls"]'), rows: arr(res.data), empty: 'Chưa có lịch sử xác nhận', columns: [
                        { title: 'Xác nhận', prop: 'TINHTRANG_TEN' }, { title: 'Nội dung', prop: 'NOIDUNG' },
                        { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' }, { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '110px' }] });
                }).catch(function (err) { q2(B, '[data-x="ls"]').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xác nhận'); });
            B.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-x-tt]');
                if (!b) return;
                var nd = (q2(B, '[data-x="nd"]').value || '').trim();
                G.luuXacNhan(r.ID, b.getAttribute('data-x-tt'), nd).then(function () { dlg.close(); dong(); crud.load(); }, function () {});
            });
        }
        return crud;
    };
})();
