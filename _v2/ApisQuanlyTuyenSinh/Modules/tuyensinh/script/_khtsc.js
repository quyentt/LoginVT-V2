/* =========================================================================
   _khtsc.js — khung chung của màn "Kế hoạch tuyển sinh" (bản cũ, TS_*)
   Bản gốc: ApisQuanlyTuyenSinh/Modules/tuyensinh/script/kehoachtuyensinh.js
   ---------------------------------------------------------------------------
   ums.khtsc = {
       e, rows, get, once,                        tiện ích
       heDaoTao(), khoaDaoTao(he), thoiGian(), khoanThu(), mauHoSo(), thanhPhan(),
       monThi(), nganhNghe(), lopQL(khId)         nguồn nạp một lần (bản gốc nạp ở init)
       congCu(host, { khId })                     bốn khối con của kế hoạch đang sửa:
                                                  Hệ khoá · Nhân sự · Hồ sơ giấy tờ · Tổ hợp môn
                                                  → { luu(khId) }
   }
   Tên tham số / cột / action chép NGUYÊN bản gốc (GET/POST như gốc; strNguoiThucHien_Id,
   strChucNang_Id để trống cho ums.api tự điền như makeRequest cũ).
   Khác gốc (tự chốt, ghi ở kehoachtuyensinh.js):
     · Hệ → Khoá trong từng dòng: chưa chọn Hệ thì KHOÁ ô Khoá; đổi Hệ thì xoá trắng Khoá.
     · Dòng MỚI của hồ sơ / tổ hợp môn gửi strId rỗng (gốc gửi chuỗi ngẫu nhiên 30 ký tự
       sinh ở máy khách — randomString — làm id); dòng trống không gửi (gốc gửi cả dòng trống).
     · Nhân sự: kiểm trùng theo ID NGƯỜI DÙNG (gốc so id nhân sự với id DÒNG phân công nên
       không bao giờ phát hiện trùng với người đã lưu).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat;
    var K = ums.khtsc = ums.khtsc || {};
    var esc = ui.esc;

    function e(v) { return v === undefined || v === null ? '' : v; }
    K.e = e;
    K.rows = function (r) { return Array.isArray(r.data) ? r.data : ((r.data && r.data.rs) || []); };
    K.get = function (o) { o.method = 'GET'; return ums.api.call(o).then(K.rows); };
    K.post = function (o) { o.method = 'POST'; return ums.api.call(o).then(K.rows); };

    var cache = {};
    K.once = function (key, fn) {
        if (!cache[key]) cache[key] = fn().catch(function (err) { delete cache[key]; throw err; });
        return cache[key];
    };

    /* ---------- Nguồn nạp một lần ----------------------------------------- */
    K.heDaoTao = function () {
        return K.once('he', function () {
            return K.get({ action: 'KHCT_HeDaoTao/LayDanhSach', strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '',
                strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 });
        });
    };
    K.khoaDaoTao = function (he) {
        return K.once('khoa|' + e(he), function () {
            return K.get({ action: 'KHCT_KhoaDaoTao/LayDanhSach', strTuKhoa: '', strDaoTao_HeDaoTao_Id: e(he),
                strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000 });
        });
    };
    K.thoiGian = function () {
        return K.once('tg', function () {
            return ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 });
        });
    };
    K.khoanThu = function () {
        return K.once('kt', function () {
            return K.get({ action: 'TC_KhoanThu/LayDanhSach', strTuKhoa: '', pageIndex: 1, pageSize: 10000, iTinhTrang: -1,
                strNhomCacKhoanThu_Id: '', strNguoiTao_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '' });
        });
    };
    K.mauHoSo = function () {
        return K.once('mau', function () {
            return K.get({ action: 'TS_MauHoSo/LayDanhSach', type: 'GET', strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 });
        });
    };
    /* TS.HOSO.TRUONGTHONGTIN — trường thông tin / thành phần, hiện "TEN - MA" như gốc */
    K.thanhPhan = function () { return ums.api.dm('TS.HOSO.TRUONGTHONGTIN'); };
    K.tenTP = function (r) { return e(r.TEN) + ' - ' + e(r.MA); };
    K.nganhNghe = function () { return ums.api.dm('TUYENSINH.NGANHNGHE'); };
    K.monThi = function () {
        return K.once('monthi', function () {
            return K.get({ action: 'TS_ToHop_MonThi/LayDanhSach', type: 'GET', strTuKhoa: '', strTS_ToHop_Id: '', strTS_MonThi_Id: '',
                strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 });
        });
    };
    /* Lớp quản lý chọn được cho "Lớp dự kiến" — theo kế hoạch (gốc nạp mỗi lần mở kế hoạch) */
    K.lopQL = function (khId) {
        return K.post({ action: 'TS_ThongTin_MH/DSA4BRINLjEQDRUpJC4KJAkuICIp', func: 'pkg_tuyensinh_thongtin.LayDSLopQLTheoKeHoach',
            strTS_KeHoachTuyenSinh_Id: khId, strNguoiThucHien_Id: '' });
    };

    function opts(list, id, name, head, chon) {
        return '<option value="">' + esc(head) + '</option>' + (list || []).map(function (r) {
            var v = e(r[id]);
            return '<option value="' + esc(v) + '"' + (String(v) === String(e(chon)) ? ' selected' : '') + '>' +
                esc(typeof name === 'function' ? name(r) : r[name]) + '</option>';
        }).join('');
    }
    K.opts = opts;

    /* =====================================================================
       Bốn khối con của kế hoạch đang sửa (vùng zone_update_KeHoachTuyenSinh của gốc)
       ===================================================================== */
    K.congCu = function (host, o) {
        var khId = o.khId;
        host.innerHTML =
            '<div class="ums-u-mt-4" data-kc="hk"></div>' +
            '<div class="ums-u-mt-4" data-kc="ns"></div>' +
            '<div class="ums-u-mt-4" data-kc="hs"></div>' +
            '<div class="ums-u-mt-4" data-kc="thm"></div>';
        function z(k) { return host.querySelector('[data-kc="' + k + '"]'); }

        /* ---- Hệ, khóa cần tuyển (TS_KeHoach_HeDaoTao) -------------------- */
        var HE = 'strDaoTao_HeDaoTao_Id', KH = 'strDaoTao_KhoaDaoTao_Id';
        var gHK = pat.rows(z('hk'), {
            title: 'Hệ, khóa cần tuyển', icon: 'fa-layer-group',
            columns: [
                { key: HE, col: 'DAOTAO_HEDAOTAO_ID', title: 'Hệ đào tạo', type: 'select', placeholder: '--- Chọn hệ đào tạo ---',
                  source: { load: K.heDaoTao, name: 'TENHEDAOTAO' } },
                { key: KH, col: 'DAOTAO_KHOADAOTAO_ID', title: 'Khóa học', type: 'select', placeholder: '--- Chọn khóa học ---',
                  width: '260px', source: { load: function () { return K.khoaDaoTao(''); }, name: 'TENKHOA' } }
            ],
            list: function (id) {
                return { action: 'TS_KeHoach_HeDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDaoTao_HeDaoTao_Id: '',
                    strDaoTao_KhoaDaoTao_Id: '', strNguoiTao_Id: '', strTS_KeHoachTuyenSinh_Id: id, pageIndex: 1, pageSize: 1000000 };
            },
            filled: function (v) { return !!(v[HE] && v[KH]); },
            save: function (v, rec, id) {
                return { action: rec ? 'TS_KeHoach_HeDaoTao/CapNhat' : 'TS_KeHoach_HeDaoTao/ThemMoi', method: 'POST',
                    strId: rec ? rec.ID : '', strDaoTao_HeDaoTao_Id: v[HE], strDaoTao_KhoaDaoTao_Id: v[KH], strTS_KeHoachTuyenSinh_Id: id };
            },
            remove: function (rec) { return { action: 'TS_KeHoach_HeDaoTao/Xoa', method: 'POST', strIds: rec.ID }; }
        });
        z('hk').querySelector('.ums-panel').insertAdjacentHTML('beforeend',
            '<div class="ums-panel__body ums-u-fz13 ums-u-muted"><i>Chú ý: Phải chọn đầy đủ hệ, khóa</i></div>');

        /* Khoá theo hệ trong từng dòng — gốc: getList_KhoaDaoTao_InTable(hệ) */
        function napKhoa(tr, giu) {
            var sHe = tr.querySelector('select[data-rk="' + HE + '"]'), sKh = tr.querySelector('select[data-rk="' + KH + '"]');
            if (!sHe || !sKh) return;
            var he = sHe.value, cu = giu ? sKh.value : '';
            sKh.disabled = !he;
            if (!he) { sKh.innerHTML = opts([], 'ID', 'TENKHOA', '--- Chọn khóa học ---'); return; }
            K.khoaDaoTao(he).then(function (ds) {
                if (sHe.value !== he) return;
                sKh.innerHTML = opts(ds, 'ID', 'TENKHOA', '--- Chọn khóa học ---', cu);
            }).catch(function (err) { ums.api.handle(err, 'khóa đào tạo'); });
        }
        function napKhoaMoi() {
            Array.prototype.forEach.call(z('hk').querySelectorAll('tbody tr'), function (tr) {
                if (tr.getAttribute('data-hk')) return;
                tr.setAttribute('data-hk', '1');
                napKhoa(tr, true);
            });
        }
        z('hk').addEventListener('change', function (ev) {
            if (ev.target.matches && ev.target.matches('select[data-rk="' + HE + '"]')) napKhoa(ev.target.closest('tr'), false);
        });
        /* Dòng vẽ thêm ("Thêm dòng mới") → khoá ô Khoá tới khi chọn hệ */
        new MutationObserver(napKhoaMoi).observe(z('hk').querySelector('tbody'), { childList: true });

        /* ---- Danh sách nhân sự tham gia (TS_KeHoach_NhanSu) --------------- */
        var nsDaLuu = [], nsMoi = [];
        z('ns').innerHTML = pat.panel({
            title: 'Danh sách nhân sự tham gia', icon: 'fa-users', flush: true,
            tools: ui.btn('add', { text: 'Thêm nhân sự', mod: 'out-success', attr: { 'data-kc': 'nsThem' } }),
            body: '<div data-kc="nsTbl"></div>'
        });
        function veNS() {
            var ds = nsDaLuu.map(function (r) { return { r: r }; }).concat(nsMoi.map(function (m) { return { m: m }; }));
            ui.table({
                el: z('ns').querySelector('[data-kc="nsTbl"]'), rows: ds, empty: 'Chưa có nhân sự tham gia',
                columns: [
                    { title: 'Họ tên', render: function (x) { return esc(x.r ? x.r.NGUOIDUNG_TENDAYDU : x.m.ten) + (x.m ? ' ' + ui.badge('Chưa lưu', 'warn') : ''); } },
                    { title: 'Mã cán bộ', cls: 'is-nowrap', render: function (x) { return esc(x.r ? x.r.NGUOIDUNG_TAIKHOAN : x.m.ma); } },
                    { title: 'Xóa', cls: 'is-center', width: '64px', render: function (x, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-nsx="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
            z('ns').querySelector('[data-kc="nsTbl"]').__ds = ds;
        }
        function napNS() {
            nsMoi = [];
            return K.get({ action: 'TS_KeHoach_NhanSu/LayDanhSach', strTuKhoa: '', strTS_KeHoachTuyenSinh_Id: khId,
                strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000 })
                .then(function (ds) { nsDaLuu = ds; veNS(); })
                .catch(function (err) { nsDaLuu = []; veNS(); ums.api.handle(err, 'nhân sự tham gia'); });
        }
        z('ns').addEventListener('click', function (ev) {
            if (ev.target.closest('[data-kc="nsThem"]')) {
                pat.pickNhanSu({
                    title: 'Thêm nhân sự tham gia',
                    onPick: function (list) {
                        var co = {}, trung = 0;
                        nsDaLuu.forEach(function (r) { co[r.NGUOIDUNG_ID] = 1; });
                        nsMoi.forEach(function (m) { co[m.id] = 1; });
                        list.forEach(function (r) {
                            if (co[r.ID]) { trung++; return; }
                            co[r.ID] = 1;
                            nsMoi.push({ id: r.ID, ten: e(r.HOTEN), ma: e(r.MASO) });
                        });
                        if (trung) ui.toast(trung + ' nhân sự đã có trong danh sách', 'warn');
                        veNS();
                    }
                });
                return;
            }
            var b = ev.target.closest('[data-nsx]');
            if (!b) return;
            var x = z('ns').querySelector('[data-kc="nsTbl"]').__ds[Number(b.getAttribute('data-nsx'))];
            if (!x) return;
            if (x.m) { nsMoi.splice(nsMoi.indexOf(x.m), 1); veNS(); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá nhân sự' }).then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: 'TS_KeHoach_NhanSu/Xoa', method: 'POST', strIds: x.r.ID }).then(function () {
                    ui.toast('Xóa thành công!', 'ok');
                    napNS();
                });
            }).catch(function (err) { ums.api.handle(err, 'xoá nhân sự'); });
        });

        /* ---- Danh sách hồ sơ giấy tờ (TS_QuyDinhHoSo) --------------------- */
        var gHS = pat.rows(z('hs'), {
            title: 'Danh sách hồ sơ giấy tờ', icon: 'fa-folder-open', addText: 'Thêm hồ sơ',
            columns: [
                { key: 'iThuTu', col: 'THUTU', title: 'Số thứ tự', width: '110px' },
                { key: 'strLoaiHoSo_Id', col: 'LOAIHOSO_ID', title: 'Loại hồ sơ', type: 'select', placeholder: '--- Chọn loại hồ sơ ---',
                  source: { dm: 'TUYENSINH.LOAIHOSO' } },
                { key: 'dSoLuong', col: 'SOLUONG', title: 'Số lượng', width: '120px' },
                { key: 'strTinhChatHoSo_Id', col: 'TINHCHATHOSO_ID', title: 'Tính chất hồ sơ', type: 'select', placeholder: '--- Chọn tính chất hồ sơ ---',
                  source: { dm: 'TUYENSINH.TINHCHATHOSO' } }
            ],
            list: function (id) {
                return { action: 'TS_QuyDinhHoSo/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_KeHoachTuyenSinh_Id: id,
                    strLoaiHoSo_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 };
            },
            filled: function (v) { return !!v.strLoaiHoSo_Id; },
            /* Gốc gửi ThemMoi cho cả dòng đã có (CapNhat bị chú thích bỏ) — giữ như gốc */
            save: function (v, rec, id) {
                return { action: 'TS_QuyDinhHoSo/ThemMoi', method: 'POST', strId: rec ? rec.ID : '', strTS_KeHoachTuyenSinh_Id: id,
                    strTinhChatHoSo_Id: v.strTinhChatHoSo_Id, strLoaiHoSo_Id: v.strLoaiHoSo_Id, dSoLuong: v.dSoLuong, iThuTu: v.iThuTu };
            },
            remove: function (rec) { return { action: 'TS_QuyDinhHoSo/Xoa', method: 'POST', strIds: rec.ID }; }
        });

        /* ---- Tổ hợp môn (TS_ToHopMon) -------------------------------------- */
        var gTHM = pat.rows(z('thm'), {
            title: 'Tổ hợp môn', icon: 'fa-books', addText: 'Thêm môn',
            columns: [
                { key: 'strThuTu', col: 'THUTU', title: 'Số thứ tự', width: '110px' },
                { key: 'strTenMon', col: 'TENMON', title: 'Tên môn' }
            ],
            list: function (id) {
                return { action: 'TS_ToHopMon/LayDanhSach', method: 'GET', strTuKhoa: '', strTS_KeHoachTuyenSinh_Id: id,
                    strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 };
            },
            filled: function (v) { return !!v.strTenMon; },
            save: function (v, rec, id) {
                return { action: 'TS_ToHopMon/ThemMoi', method: 'POST', strId: rec ? rec.ID : '', strTS_KeHoachTuyenSinh_Id: id,
                    strTenMon: v.strTenMon, strThuTu: v.strThuTu };
            },
            remove: function (rec) { return { action: 'TS_ToHopMon/Xoa', method: 'POST', strIds: rec.ID }; }
        });

        gHK.load(khId).then(napKhoaMoi);
        napNS();
        gHS.load(khId);
        gTHM.load(khId);

        return {
            /* Lưu sau khi CapNhat kế hoạch thành công — đúng thứ tự gốc: hệ khoá → nhân sự mới → hồ sơ → tổ hợp môn */
            luu: function (id) {
                var moi = nsMoi.slice();
                return gHK.save(id).then(function () {
                    return moi.reduce(function (p, m) {
                        return p.then(function () {
                            return ums.api.call({ action: 'TS_KeHoach_NhanSu/ThemMoi', method: 'POST', strId: '',
                                strNguoiDung_Id: m.id, strTS_KeHoachTuyenSinh_Id: id });
                        });
                    }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu nhân sự'); });
                }).then(function () { return gHS.save(id); })
                  .then(function () { return gTHM.save(id); });
            }
        };
    };
})();
