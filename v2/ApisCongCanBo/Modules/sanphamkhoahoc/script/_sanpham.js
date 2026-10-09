/* =========================================================================
   sanphamkhoahoc — tầng chung các màn KÊ KHAI SẢN PHẨM KHOA HỌC (cổng cán bộ): ums.nckh.*
   Bản gốc: ApisCongCanBo/Modules/sanphamkhoahoc/script/*.js — 12 tệp chép nhau 60–70%: hai cột
   (col-lg-3 danh sách · col-lg-9 khung "Thông tin chung / Thêm mới"), ô "năm đánh giá"
   (NCKH_TinhDiem_KeHoach), bảng thành viên trong / ngoài trường (NCKH_ThanhVien), "Sản phẩm thuộc
   đề tài", tệp minh chứng NCKH_Files, hộp "Tìm <sản phẩm>" để chép một sản phẩm đã có.
   ---------------------------------------------------------------------------
   ums.nckh.man(root, cfg) — khung ums.crud hai cột (master). cfg:
     tieuDe, dsTieuDe, icon, formTitle, ctl (controller: /LayDanhSach /ThemMoi /CapNhat /Xoa),
     nam (true: ô năm đánh giá chọn sẵn mục đầu), ds(f) → tham số danh sách (f.nam, f.q), paged,
     ten(row) → tên ở cột trái, fields (trường ums.crud), luu(v, row, x) → tham số lưu (x: giá trị
     các khối dưới biểu mẫu + nam), xoaKhoa ('strIds' | 'strId'),
     khoi: [ khối dưới biểu mẫu — { html, gan(el, ctx), nap(row), chep(nguon), moi(), luu(id, isEdit), gt() } ],
     tim: { nut, truong, title, cot, chonText, ds(fm) } — hộp "Tìm …" (chép sản phẩm: lưu thành bản ghi MỚI,
          chép cả tệp minh chứng — ums.files.chep), onForm(row, crud, extra), sauThem(id, nam)
   Khối dựng sẵn: ums.nckh.thanhVien(o) · ums.nckh.kinhPhi(o) · ums.nckh.deTai(o) · ums.nckh.khac(o)
   Thành viên (NCKH_ThanhVien): LayDanhSach strSanPham_Id (pageSize 100) — LATHANHVIENCUATRUONG = 1 vào bảng
     NGOÀI trường (tên cờ ngược nghĩa nhưng gốc làm vậy); ThemMoi cho MỌI dòng mỗi lần lưu (upsert như gốc):
     strSanPham_Id, strNCKH_TinhDiem_KeHoach_Id, strThanhVien_Id, strVaiTro_Id, dTyLeThamGia, strChucNang_Id;
     Xoa strSanPham_Id + strThanhVien_Id (dòng đã lưu). Thêm mới: tự thêm NGƯỜI ĐĂNG NHẬP (getDetail_HS gốc —
     pkg_nhansu_hoso_v2.LayTT_NhanSu_HoSo_v2).
   Khác bản gốc (ghi ở can-quyet.js):
     · Xoá sản phẩm: nút Xoá trong biểu mẫu (gốc có thùng rác trên từng dòng ở cột trái).
     · Thành viên ngoài trường: chọn trong danh sách nhân sự ngoài trường (hộp chọn nhân sự chung, đặt sẵn
       "Cán bộ ngoài trường"); gốc có ô TẠO MỚI nhân sự ngoài trường ngay trong hộp — chưa làm.
     · Lưu thêm mới xong gốc KHÔNG giữ id (bấm Lưu lần nữa là tạo bản trùng) → về danh sách.
     · Dòng giữ chỗ "Không tìm thấy dữ liệu!" của gốc bị gửi như một thành viên rỗng → không còn.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var N = ums.nckh = ums.nckh || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    N.e = e; N.arr = arr; N.uid = uid;
    N.chucNang = function () { return (ums.state && ums.state.chucNangId) || ''; };
    N.g = function (action, o, post) { return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET' }, o || {})); };

    /* ---------- Nguồn dùng chung ---------------------------------------- */
    N.locNam = function () {
        return { key: 'nam', type: 'select', label: 'Tất cả kế hoạch đánh giá', first: true,
            source: { call: { action: 'NCKH_TinhDiem_KeHoach/LayDanhSach', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 }, name: 'MOTA' } };
    };
    /** Đề tài của người đăng nhập (NCKH_DeTai/LayDanhSach) — khoaTT: 'dTrangThai' | 'iTrangThai' như từng màn gốc */
    N.nguonDeTai = function (khoaTT) {
        var c = { action: 'NCKH_DeTai/LayDanhSach', method: 'GET', iTinhTrang: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: uid(), strTuKhoaText: '',
            dTuKhoaNumber: -1, strNCKH_DeCuong_Id: '', strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: '', strNguonKinhPhi_Id: '', strThietKeNghienCuu_Id: '',
            strNCKH_ThanhVien_Id: '', strDonVi_Id_CuaThanhVien_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strTinhTrang_Id: '', strPhanLoaiDeTai_Id: '',
            strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '', pageIndex: 1, pageSize: 10000000 };
        c[khoaTT || 'dTrangThai'] = -1;
        return { call: c, name: 'TENDETAITIENGVIET' };
    };
    var toiP = null;
    /** Hồ sơ người đăng nhập — getDetail_HS gốc */
    N.toi = function () {
        if (!toiP) toiP = ums.api.call({ action: 'NS_HoSo_V2_MH/DSA4FRUeDykgLxI0HgkuEi4eN3MP', func: 'pkg_nhansu_hoso_v2.LayTT_NhanSu_HoSo_v2', strId: uid(), silent: true })
            .then(function (r) { var d = Array.isArray(r.data) ? r.data[0] : r.data; return d || null; }, function (err) { toiP = null; ums.api.handle(err, 'hồ sơ người đăng nhập'); return null; });
        return toiP;
    };

    /* ---------- Cột trái: tên + tình trạng ------------------------------ */
    N.item = function (ten, r) {
        var h = '<div class="nk-ten">' + esc(ten) + '</div><div class="nk-tt">';
        if (e(r.KETQUAXACNHAN_TEN)) h += '<span class="nk-xn" style="' + esc(e(r.KETQUAXACNHAN_THONGTIN2)) + '" title="' + esc(e(r.KETQUAXACNHAN_NOIDUNG)) + '">' + esc(e(r.KETQUAXACNHAN_TEN)) + '</span>';
        if (e(r.HOANTHANHNHAPDULIEU) === '0') h += '<span class="nk-ht nk-ht--chua" title="' + esc(e(r.HOANTHANHNHAPDULIEU_LYDO)) + '">Chưa hoàn thành</span>';
        else if (e(r.HOANTHANHNHAPDULIEU) === '1') h += '<span class="nk-ht nk-ht--xong">Hoàn thành</span>';
        return h + '</div>';
    };

    /* =====================================================================
       Khối THÀNH VIÊN (NCKH_ThanhVien) — o = { vaiTro (mã danh mục), ngoai: true, tyLe: true (cột
       "Tỷ lệ tham gia" ở bảng trong trường — thongtinsach), tuThem: true (tự thêm người đăng nhập) }
       ===================================================================== */
    N.thanhVien = function (o) {
        o = o || {};
        var ds = [], vt = [], el = null, spId = '';
        var K = {
            html: pat.panel({ title: o.tieuDeTrong || 'Thành viên trong trường tham gia', icon: 'fa-users', flush: true, zone: 'tvTrong',
                    tools: ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-tv-a': 'trong' } }) }) +
                (o.ngoai ? pat.panel({ title: o.tieuDeNgoai || 'Thành viên ngoài trường tham gia', icon: 'fa-user-group', flush: true, zone: 'tvNgoai', cls: 'ums-u-mt-4',
                    tools: ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-tv-a': 'ngoai' } }) }) : ''),
            gan: function (host) {
                el = host;
                if (o.vaiTro) ums.api.dm(o.vaiTro).then(function (d) { vt = d; ve(); }).catch(function (err) { ums.api.handle(err, 'vai trò'); });
                host.addEventListener('click', function (ev) {
                    var a = ev.target.closest('[data-tv-a]');
                    if (a) { chon(a.getAttribute('data-tv-a') === 'ngoai'); return; }
                    var x = ev.target.closest('[data-tv-xoa]');
                    if (x) xoa(Number(x.getAttribute('data-tv-xoa')));
                });
                host.addEventListener('change', function (ev) {
                    var i = ev.target.getAttribute('data-tv-vt'), t = ev.target.getAttribute('data-tv-tl');
                    if (i !== null) ds[Number(i)].vaiTro = ev.target.value;
                    if (t !== null) ds[Number(t)].tyLe = ev.target.value;
                });
            },
            nap: function (row) {
                spId = row.ID; ds = [];
                ve(true);
                return N.g('NCKH_ThanhVien/LayDanhSach', { strSanPham_Id: row.ID, pageIndex: 1, pageSize: 100 }).then(function (r) {
                    ds = arr(r.data).map(function (x) {
                        var ngoai = !!o.ngoai && e(x.LATHANHVIENCUATRUONG) === '1';
                        return { id: e(x.ID), ten: e(x.HOTEN) + (ngoai ? '' : (e(x.MACANBO) ? ' - ' + e(x.MACANBO) : '')), vaiTro: e(x.VAITRO_ID),
                            tyLe: e(x.TYLETHAMGIA), ngoai: ngoai, daLuu: true };
                    });
                    ve();
                }).catch(function (err) { ums.api.handle(err, 'thành viên'); });
            },
            moi: function () {
                spId = ''; ds = []; ve();
                if (o.tuThem === false) return Promise.resolve();
                return N.toi().then(function (t) {
                    if (t && !ds.some(function (x) { return x.id === e(t.ID); })) ds.unshift({ id: e(t.ID), ten: e(t.HOTEN) + ' - ' + e(t.MASO), vaiTro: '', tyLe: '', ngoai: false, daLuu: false });
                    ve();
                });
            },
            chep: function () { return K.moi(); },          // gốc: không chép thành viên của sản phẩm nguồn, chỉ tự thêm mình
            luu: function (id, isEdit, x) {
                return ds.reduce(function (p, r) {
                    return p.then(function () {
                        return N.g('NCKH_ThanhVien/ThemMoi', { strSanPham_Id: id, strNCKH_TinhDiem_KeHoach_Id: x.nam, strThanhVien_Id: r.id, strVaiTro_Id: r.vaiTro,
                            dTyLeThamGia: o.tyLe && !r.ngoai ? r.tyLe : '', strChucNang_Id: N.chucNang(), strNguoiThucHien_Id: uid() }, true);
                    });
                }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu thành viên'); });
            }
        };
        function ve(dangTai) {
            if (!el) return;
            ['tvTrong', 'tvNgoai'].forEach(function (z) {
                var host = el.querySelector('[data-z="' + z + '"]');
                if (!host) return;
                if (dangTai) { host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); return; }
                var ngoai = z === 'tvNgoai';
                var rows = ds.map(function (r, i) { return Object.assign({ _i: i }, r); }).filter(function (r) { return r.ngoai === ngoai; });
                var cot = [{ title: 'Họ tên', render: function (r) { return esc(r.ten); } }];
                if (o.vaiTro) cot.push({ title: 'Vai trò', width: '260px', render: function (r) {
                        return '<select class="ums-select ums-input--sm" data-tv-vt="' + r._i + '"><option value="">Chọn vai trò</option>' + vt.map(function (v) {
                            return '<option value="' + esc(v.ID) + '"' + (e(v.ID) === r.vaiTro ? ' selected' : '') + '>' + esc(e(v.TEN)) + '</option>';
                        }).join('') + '</select>';
                    } });
                if (o.tyLe && !ngoai) cot.push({ title: 'Tỷ lệ tham gia', width: '140px', render: function (r) {
                    return '<input class="ums-input ums-input--sm" data-tv-tl="' + r._i + '" value="' + esc(r.tyLe) + '" autocomplete="off">';
                } });
                cot.push({ title: 'Xóa', cls: 'is-center', width: '70px', render: function (r) {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-tv-xoa="' + r._i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>';
                } });
                ui.table({ el: host, rows: rows, columns: cot, empty: 'Chưa có thành viên' });
            });
        }
        function chon(ngoai) {
            pat.pickNhanSu({ title: ngoai ? 'Tìm kiếm nhân sự ngoài trường' : 'Tìm kiếm nhân sự', loaiCanBo: ngoai ? '1' : '0', onPick: function (list) {
                var trung = 0;
                list.forEach(function (r) {
                    if (ds.some(function (x) { return x.id === e(r.ID); })) { trung++; return; }
                    var ten = (r.LOAICHUCDANH_MA ? r.LOAICHUCDANH_MA + '. ' : '') + (r.LOAIHOCVI_MA ? r.LOAIHOCVI_MA + '. ' : '') + e(r.HOTEN);
                    ds.push({ id: e(r.ID), ten: ngoai ? (e(r.MASO) ? e(r.MASO) + ' - ' : '') + e(r.TEN || r.HOTEN) : ten + (e(r.MASO) ? ' - ' + e(r.MASO) : ''),
                        vaiTro: '', tyLe: '', ngoai: !!ngoai, daLuu: false });
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
                N.g('NCKH_ThanhVien/Xoa', { strSanPham_Id: spId, strThanhVien_Id: r.id, strNguoiThucHien_Id: uid() }, true)
                    .then(function () { ds.splice(ds.indexOf(r), 1); ve(); ui.toast('Xóa thành công!', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'xoá thành viên'); });
            });
        }
        return K;
    };

    /* =====================================================================
       Khối NGƯỜI dùng controller RIÊNG (giảng viên / học viên của giangdaysaudaihoc, huongdansaudaihoc,
       detaisinhvien). o = { tieuDe, icon, nguon: 'nhansu' | 'sinhvien', tuThem (thêm người đăng nhập),
         vaiTro (mã danh mục — ô chọn chỉ ở dòng MỚI; dòng đã lưu hiện VAITRO_TEN như gốc),
         them: [{ key, title }] (ô nhập thêm ở dòng MỚI; dòng đã lưu hiện cột `col`),
         list(spId) → lời gọi, map(x) → { id, ten, vaiTroTen, [key]: giá trị hiện } | null (bỏ dòng),
         save(r, spId) → lời gọi (chỉ dòng MỚI), xoa(r, spId) → lời gọi }
       Gốc gửi lại MỌI dòng mỗi lần lưu (dòng đã lưu không có ô vai trò/nội dung → ghi đè rỗng / trùng) →
       chỉ gửi dòng mới (ghi can-quyet.js).
       ===================================================================== */
    N.nguoi = function (o) {
        var ds = [], vt = [], el = null, spId = '';
        var K = {
            html: pat.panel({ title: o.tieuDe, icon: o.icon || 'fa-users', flush: true, zone: 'ng', cls: 'ums-u-mt-4',
                tools: ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-ng-a': 'them' } }) }),
            gan: function (host) {
                el = host;
                if (o.vaiTro) ums.api.dm(o.vaiTro).then(function (d) { vt = d; ve(); }).catch(function () {});
                host.addEventListener('click', function (ev) {
                    if (ev.target.closest('[data-ng-a]')) { chon(); return; }
                    var x = ev.target.closest('[data-ng-xoa]');
                    if (x) xoa(Number(x.getAttribute('data-ng-xoa')));
                });
                host.addEventListener('change', function (ev) {
                    var i = ev.target.getAttribute('data-ng-i');
                    if (i !== null) ds[Number(i)][ev.target.getAttribute('data-ng-k')] = ev.target.value;
                });
                host.addEventListener('input', function (ev) {
                    var i = ev.target.getAttribute('data-ng-i');
                    if (i !== null) ds[Number(i)][ev.target.getAttribute('data-ng-k')] = ev.target.value;
                });
            },
            nap: function (row) {
                spId = row.ID; ds = [];
                el.querySelector('[data-z="ng"]').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                return ums.api.call(Object.assign({ method: 'GET' }, o.list(row.ID))).then(function (r) {
                    ds = arr(r.data).map(o.map).filter(Boolean).map(function (x) { x.daLuu = true; return x; });
                    ve();
                }).catch(function (err) { ums.api.handle(err, o.tieuDe); });
            },
            moi: function () {
                spId = ''; ds = []; ve();
                if (!o.tuThem) return Promise.resolve();
                return N.toi().then(function (t) {
                    if (t && !ds.length) ds.push({ id: e(t.ID), ten: e(t.HOTEN) + ' - ' + e(t.MASO), daLuu: false });
                    ve();
                });
            },
            chep: function () { return K.moi(); },
            luu: function (id) {
                return ds.filter(function (r) { return !r.daLuu; }).reduce(function (p, r) {
                    return p.then(function () { return ums.api.call(Object.assign({ method: 'POST' }, o.save(r, id))); });
                }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu ' + o.tieuDe.toLowerCase()); });
            }
        };
        function ve() {
            if (!el) return;
            var host = el.querySelector('[data-z="ng"]');
            var cot = [{ title: 'Họ tên', render: function (r) { return esc(r.ten); } }];
            if (o.vaiTro) cot.push({ title: 'Vai trò', width: '240px', render: function (r, i) {
                if (r.daLuu) return esc(e(r.vaiTroTen));
                return '<select class="ums-select ums-input--sm" data-ng-i="' + i + '" data-ng-k="vaiTro"><option value="">Chọn vai trò</option>' + vt.map(function (v) {
                    return '<option value="' + esc(v.ID) + '"' + (e(v.ID) === e(r.vaiTro) ? ' selected' : '') + '>' + esc(e(v.TEN)) + '</option>';
                }).join('') + '</select>';
            } });
            (o.them || []).forEach(function (c) {
                cot.push({ title: c.title, render: function (r, i) {
                    if (r.daLuu) return esc(e(r[c.key]));
                    return '<input class="ums-input ums-input--sm" data-ng-i="' + i + '" data-ng-k="' + c.key + '" value="' + esc(e(r[c.key])) + '" autocomplete="off">';
                } });
            });
            cot.push({ title: 'Xóa', cls: 'is-center', width: '70px', render: function (r, i) {
                return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-ng-xoa="' + i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>';
            } });
            ui.table({ el: host, rows: ds, columns: cot, empty: 'Chưa có thành viên' });
        }
        function them(list, map) {
            var trung = 0;
            list.forEach(function (r) {
                var x = map(r);
                if (ds.some(function (y) { return y.id === x.id; })) { trung++; return; }
                ds.push(x);
            });
            if (trung) ui.toast(trung + ' người đã có trong danh sách', 'info');
            ve();
        }
        function chon() {
            if (o.nguon === 'sinhvien') {
                pat.pickSinhVien({ onPick: function (list) {
                    them([].concat(list), function (r) { return { id: e(r.QLSV_NGUOIHOC_ID || r.ID), ten: (e(r.QLSV_NGUOIHOC_HODEM || r.HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN || r.TEN)).trim() + ' - ' + e(r.QLSV_NGUOIHOC_MASO || r.MASO), daLuu: false }; });
                } });
            } else {
                pat.pickNhanSu({ title: 'Tìm kiếm nhân sự', loaiCanBo: '0', onPick: function (list) {
                    them(list, function (r) { return { id: e(r.ID), ten: e(r.HOTEN) + (e(r.MASO) ? ' - ' + e(r.MASO) : ''), daLuu: false }; });
                } });
            }
        }
        function xoa(i) {
            var r = ds[i];
            if (!r) return;
            if (!r.daLuu || !spId) { ds.splice(i, 1); ve(); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ums.api.call(Object.assign({ method: 'POST' }, o.xoa(r, spId))).then(function () { ds.splice(ds.indexOf(r), 1); ve(); ui.toast('Xóa thành công!', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'xoá'); });
            });
        }
        return K;
    };
    /* ---------- Khối tệp gắn id RIÊNG (vanbangsangche: "File đính kèm QĐ" gắn <id>_QD) ---------- */
    N.tepRieng = function (o) {
        var fl = null;
        return {
            html: pat.panel({ title: o.tieuDe, icon: 'fa-paperclip', cls: 'ums-u-mt-4', body: '<div data-nk="tep"></div>' }),
            gan: function (host) { fl = ums.files.mount(host.querySelector('[data-nk="tep"]'), { api: o.api || 'NCKH_Files' }); },
            nap: function (row) { return fl.load(row.ID + o.hauTo); },
            chep: function (row) { return Promise.resolve(fl.load(row.ID + o.hauTo)).then(function () { fl.chep(); }); },
            moi: function () { fl.clear(); },
            luu: function (id) { return fl.save(id + o.hauTo); }
        };
    };

    /* ---------- Khối "Thành viên khác" (ô chữ sau bảng ngoài trường) ----- */
    N.khac = function (o) {
        var inp = null;
        return {
            html: '<div class="ums-panel ums-u-mt-4"><div class="ums-panel__body">' + ui.field('Thành viên khác', '<input class="ums-input" data-nk="khac" autocomplete="off">') + '</div></div>',
            gan: function (host) { inp = host.querySelector('[data-nk="khac"]'); },
            nap: function (row) { inp.value = e(row[o.col]); }, chep: function (row) { inp.value = e(row[o.col]); }, moi: function () { inp.value = ''; },
            gt: function () { var v = {}; v[o.key] = inp.value.trim(); return v; }
        };
    };
    /* ---------- Khối "Sản phẩm thuộc đề tài" ------------------------------ */
    N.deTai = function (o) {
        var sel = null;
        return {
            html: pat.panel({ title: 'Sản phẩm thuộc đề tài', icon: 'fa-flask', cls: 'ums-u-mt-4', body:
                '<div class="ums-grid ums-grid--2"><div>' + ui.field('Tên đề tài', '<select class="ums-select" data-nk="detai" data-ph="Chọn đề tài"><option value="">Chọn đề tài</option></select>') +
                '</div><div class="ums-u-faint ums-u-fz13 nk-chuy"><b>Chú ý:</b> Nếu sản phẩm không thuộc đề tài nào thì bỏ qua mục này</div></div>' }),
            gan: function (host) {
                sel = host.querySelector('[data-nk="detai"]');
                ui.enhance(host);
                return ums.crud.loadSource(N.nguonDeTai(o.khoaTT)).then(function (d) {
                    var v = sel.value;
                    pat.fill(sel, d, { head: 'Chọn đề tài', name: 'TENDETAITIENGVIET' });
                    if (v) { sel.value = v; if (window.jQuery) jQuery(sel).trigger('change.select2'); }
                }).catch(function (err) { ums.api.handle(err, 'đề tài'); });
            },
            nap: function (row) { dat(row); }, chep: function (row) { dat(row); }, moi: function () { dat({}); },
            gt: function () { var v = {}; v[o.key] = sel.value; return v; }
        };
        function dat(row) { sel.value = e(row.NCKH_QUANLYDETAI_ID); if (window.jQuery) jQuery(sel).trigger('change.select2'); }
    };

    /* =====================================================================
       Khối NGUỒN KINH PHÍ (NCKH_SP_NguonKinhPhi) — o = { khoaThem: 'strIds' | 'strId' (khoá id rỗng khi thêm) }
       Chỉ dòng MỚI được gửi ThemMoi (gốc: id 30 ký tự); dòng đã lưu chỉ xoá được. Chép sản phẩm → chép cả dòng.
       ===================================================================== */
    N.kinhPhi = function (o) {
        o = o || {};
        var g = null;
        return {
            html: '<div class="ums-u-mt-4" data-nk="kp"></div>',
            gan: function (host) {
                g = pat.rows(host.querySelector('[data-nk="kp"]'), {
                    title: 'Nguồn kinh phí', icon: 'fa-sack-dollar', addText: 'Thêm',
                    columns: [
                        { key: 'nguon', col: 'NGUONKINHPHI_ID', title: 'Tên nguồn', type: 'select', placeholder: 'Chọn nguồn', source: { dm: 'NCKH.NGKP' } },
                        { key: 'soTien', col: 'SOTIEN', title: 'Số tiền', width: '200px' },
                        { key: 'donVi', col: 'DONVITINH_ID', title: 'Đơn vị', type: 'select', width: '180px', placeholder: 'Chọn đơn vị', source: { dm: 'CHUN.DVTT' } }
                    ],
                    list: function (id) { return { action: 'NCKH_SP_NguonKinhPhi/LayDanhSach', method: 'GET', strSanPham_Id: id, pageIndex: 1, pageSize: 10000 }; },
                    filled: function (v, rec) { return !rec && !!v.nguon && !!v.soTien; },
                    save: function (v, rec, id) {
                        var p = { action: 'NCKH_SP_NguonKinhPhi/ThemMoi', method: 'POST', strSanPham_Id: id, strNguonKinhPhi_Id: v.nguon, strDonViTinh_Id: v.donVi,
                            dSoTien: String(v.soTien).replace(/,/g, ''), strNguoiThucHien_Id: uid() };
                        p[o.khoaThem || 'strIds'] = '';
                        return p;
                    },
                    remove: function (rec) { return { action: 'NCKH_SP_NguonKinhPhi/Xoa', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
                });
            },
            nap: function (row) { return g.load(row.ID); },
            chep: function (row) {
                return g.clear().then(function () {
                    return N.g('NCKH_SP_NguonKinhPhi/LayDanhSach', { strSanPham_Id: row.ID, pageIndex: 1, pageSize: 10000, silent: true });
                }).then(function (r) { arr(r.data).forEach(function (x) { g.addNew(x); }); }).catch(function () { /* không chép được thì bỏ */ });
            },
            moi: function () { return g.clear(); },
            luu: function (id) { return g.save(id); }
        };
    };

    /* =====================================================================
       Hộp "Tìm <sản phẩm>" — o = { title, chonText, cot (cột bảng), ds(fm, page, size) → lời gọi, onChon(row) }
       fm = { q, donVi, linhVuc }
       ===================================================================== */
    N.tim = function (o) {
        var page = 1, size = 10, rows = [];
        var dlg = ui.dialog({ title: o.title, icon: 'fa-magnifying-glass', size: 'xl', body:
            '<div class="ums-filter">' +
            '<div class="ums-field"><input class="ums-input" data-tm="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field"><select class="ums-select" data-tm="dv" data-ph="Chọn đơn vị"><option value="">Chọn đơn vị</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-tm="lv" data-ph="Chọn lĩnh vực"><option value="">Chọn lĩnh vực</option></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-tm-a': 'tim' } }) + '</div></div>' +
            '<div class="ums-u-mt-4" data-tm="bang"></div>' });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-tm="' + k + '"]'); }
        ui.enhance(B);
        ums.ref.coCauToChuc({}).then(function (d) { pat.fill(f('dv'), d, { head: 'Chọn đơn vị' }); }).catch(function () {});
        ums.api.dm('NCKH.LVNC').then(function (d) { pat.fill(f('lv'), d, { head: 'Chọn lĩnh vực' }); }).catch(function () {});
        function tai(p) {
            if (p) page = p;
            f('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call(Object.assign({ method: 'GET' }, o.ds({ q: f('q').value.trim(), donVi: f('dv').value, linhVuc: f('lv').value }, page, size)))
                .then(function (r) {
                    rows = arr(r.data);
                    var tong = Number(r.pager) || rows.length;
                    ui.table({ el: f('bang'), rows: rows, empty: 'Không tìm thấy dữ liệu', columns: o.cot.concat([{ title: '', cls: 'is-center is-nowrap', render: function (x, i) {
                        return '<button type="button" class="ums-btn ums-btn--sm ums-btn--primary" data-tm-chon="' + i + '"><span>' + esc(o.chonText) + '</span></button>';
                    } }]), page: { index: page, size: size, total: tong, onChange: tai, onSize: function (n) { size = n; tai(1); } } });
                }).catch(function (err) { f('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, o.title); });
        }
        B.addEventListener('click', function (ev) {
            if (ev.target.closest('[data-tm-a]')) { tai(1); return; }
            var c = ev.target.closest('[data-tm-chon]');
            if (c) { var r = rows[Number(c.getAttribute('data-tm-chon'))]; if (r) { dlg.close(); o.onChon(r); } }
        });
        f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(1); } });
        setTimeout(function () { f('q').focus(); }, 300);
        tai(1);
        return dlg;
    };

    /* =====================================================================
       Khung màn hai cột
       ===================================================================== */
    N.man = function (root, cfg) {
        var khoi = (cfg.khoi || []), chon = null, crud;
        function namHienTai() { var s = root.querySelector('[data-scope="filter"][data-k="nam"]'); return s ? s.value : ''; }
        function giaTriKhoi() {
            var x = { nam: namHienTai() };
            khoi.forEach(function (k) { if (k.gt) Object.assign(x, k.gt()); });
            return x;
        }
        crud = ums.crud({
            root: root, title: cfg.tieuDe, formTitle: cfg.formTitle, icon: cfg.icon,
            master: { title: cfg.dsTieuDe, icon: cfg.icon, item: function (r) { return N.item(cfg.ten(r), r); },
                empty: cfg.loiChao || 'Hôm nay bạn có sản phẩm mới không? Bấm Thêm mới ở đầu trang.' },
            filters: (cfg.nam === false ? [] : [N.locNam()]).concat([{ key: 'q', label: 'Nhập từ khóa tìm kiếm' }]),
            autoload: false,
            list: { paged: cfg.paged !== false, call: function (f) { return Object.assign({ action: cfg.ctl + '/LayDanhSach', method: 'GET' }, cfg.ds(f)); } },
            fields: cfg.fields,
            formCols: cfg.formCols,
            canAdd: cfg.canAdd,
            save: cfg.luu ? function (v, row) {
                var p = cfg.luu(v, row, giaTriKhoi());
                p.action = cfg.ctl + (row ? '/CapNhat' : '/ThemMoi');
                p.strId = row ? row.ID : '';
                return p;
            } : null,
            remove: cfg.luu ? function (ids) {
                return ids.map(function (id) { var p = { action: cfg.ctl + '/Xoa', strNguoiThucHien_Id: uid() }; p[cfg.xoaKhoa || 'strIds'] = id; return p; });
            } : null,
            onForm: function (row, c, extra) {
                if (!extra) return;
                extra.innerHTML = khoi.map(function (k) { return '<div data-nk-khoi>' + k.html + '</div>'; }).join('');
                var hosts = extra.querySelectorAll('[data-nk-khoi]');
                khoi.forEach(function (k, i) { if (k.gan) k.gan(hosts[i], c); });
                var nguon = chon; chon = null;
                if (row) khoi.forEach(function (k) { if (k.nap) k.nap(row); });
                else if (nguon) {
                    c.fillForm(nguon);
                    khoi.forEach(function (k) { if (k.chep) k.chep(nguon); });
                    Object.keys(c.files || {}).forEach(function (fk) { var fl = c.files[fk]; Promise.resolve(fl.load(nguon.ID)).then(function () { fl.chep(); }); });
                    ui.toast('Đã chép thông tin "' + cfg.ten(nguon) + '" — bấm Lưu để thêm vào sản phẩm của bạn', 'info', { timeout: 7000 });
                } else khoi.forEach(function (k) { if (k.moi) k.moi(); });
                if (cfg.tim) themNutTim(c);
                if (cfg.onForm) cfg.onForm(row || nguon, c, extra);
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var x = giaTriKhoi();
                khoi.reduce(function (p, k) { return p.then(function () { return k.luu ? k.luu(id, isEdit, x) : null; }); }, Promise.resolve())
                    .then(function () { if (!isEdit && cfg.sauThem) return cfg.sauThem(id, x); });
            }
        });
        function themNutTim(c) {
            var f = root.querySelector('[data-scope="form"][data-k="' + cfg.tim.truong + '"]');
            var wrap = f && f.closest('.ums-field');
            if (!wrap || wrap.querySelector('[data-nk-tim]')) return;
            wrap.insertAdjacentHTML('beforeend', '<div class="nk-tim">' + ui.btn('search', { text: cfg.tim.nut, mod: 'out-primary', attr: { 'data-nk-tim': '1' } }) + '</div>');
            wrap.querySelector('[data-nk-tim]').addEventListener('click', function () {
                N.tim({ title: cfg.tim.title, chonText: cfg.tim.chonText, cot: cfg.tim.cot,
                    ds: function (fm, page, size) { return Object.assign({ action: cfg.ctl + '/LayDanhSach' }, cfg.tim.ds(fm, namHienTai()), { pageIndex: page, pageSize: size }); },
                    onChon: function (r) { chon = r; c.showForm(null); } });
            });
        }
        Promise.all([crud.sourcesReady, cfg.choNap]).then(function () { crud.load(1); });
        return crud;
    };
})();
