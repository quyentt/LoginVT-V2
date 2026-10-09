/* =========================================================================
   _profile — khung dùng chung của ba màn Hồ sơ cá nhân (Cổng sinh viên)
   (vai trò thủ vai: ums.session.userId = ID người học — bản gốc edu.system.userId)
   Bản gốc: ApisCongSinhVien/Modules/profile/script/{hoso,tunhaphoso,minhchung}.js
            + html/{hoso,tunhaphoso,minhchung}.html
   ---------------------------------------------------------------------------
   Ba tệp gốc chép nhau gần như từng dòng:
     · khối "Thông tin cá nhân" (ảnh + Họ tên / Ngày sinh / CMND / Mã SV / Ngành /
       Lớp) — getDetail_SinhVien + viewForm_SinhVien, GIỐNG HỆT ở cả ba tệp;
     · bảng "Nhóm | Tên thông tin | Dữ liệu | Xác nhận từ trường" + dải tab theo
       TAB_THONGTIN — hoso.js và tunhaphoso.js chỉ khác Ô LỌC (Chương trình ≠ Kế
       hoạch), hai lời gọi lấy danh sách/tab, và hoso CHỈ XEM (geninput của hoso
       `return` ngay dòng đầu nên toàn bộ switch bên dưới là mã chết).
   Nên phần chung nằm ở tệp này; mỗi màn chỉ còn phần khai lời gọi của nó.

   Lời gọi (chép nguyên action / func / tên tham số / tên cột):
     SV_Custom/…              pkg_hosohocvien.LayThongTinChiTietHoSo   (hoso, tunhaphoso)
     SV_HoSoHocVien_MH/…      pkg_hosohocvien.LayThongTinChiTietHoSo   (minhchung — cùng func,
                              KHÁC tiền tố controller; giữ đúng của từng màn)
     SV_ThongTin_MH/…         pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc
     SV_KeHoach_MH/…          pkg_hososinhvien_kehoach.LayDSKeHoachNhapHoSo
                              pkg_hososinhvien_kehoach.LayDSHoSoChoPhepSVNhap
                              pkg_hososinhvien_kehoach.LayDSTabThongTinNguoiHoc
                              pkg_hososinhvien_kehoach.Them_QLSV_KeHoach_DuLieu
     SV_HoSoHocVien_Quyen_MH/… pkg_hosohocvien_quyen.LayDSHoSoChoPhepCBNhap
                               pkg_hosohocvien_quyen.LayDSTabThongTinNguoiHoc
     SV_HoSoHocVien_MH/…      pkg_hosohocvien.Sua_QLSV_NguoiHoc_1      (lưu ảnh đại diện)
   Tệp đính kèm của trường kiểu FILE: SV_Files, khoá = <ID người học> + <ID trường>
   (bản gốc: viewFiles/saveFiles("m"+ID, me.strSinhVien_Id + aData.ID, "SV_Files")).

   Khác bản gốc (cách làm, KHÔNG đổi dữ liệu gửi đi):
     · Bảng dựng bằng ums.ui.table (ô chọn trong bảng KHÔNG bọc select2 — luật
       BO-CUC 2); nhóm THUOCNHOM hiện ở cột đầu đúng chỗ bản gốc in ra rồi kẻ <hr>.
     · Ảnh đại diện: ums.files.avatar (= edu.system.uploadAvatar + getImage).
     · Tệp của trường FILE: ums.files.mount (= uploadFiles/viewFiles/saveFiles).
     · Lưu hàng loạt: ums.ui.batch (= genHTML_Progress + start_Progress).
     · Menu mẫu báo cáo (getList_MauImport "zonebtnBaoCao_TNHS") → ums.report.mount
       đặt ở đầu trang; bản gốc không có vùng <zone>_Import nên import: false.
     · Dải tab đặt ở ĐẦU trang như bản gốc (.content-tab đứng trước .sv-add-info);
       chỉ MỘT tab thì không vẽ dải tab (luật 2026-09-22).
     · Khối thông tin cá nhân và bảng dữ liệu tách thành hai khung (.ums-panel)
       xếp dọc — vẫn MỘT cột, vẫn đúng thứ tự bản gốc.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var P = ums.csvProfile = {};

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    P.e = e; P.esc = esc; P.arr = arr;

    /** ID người học đang xem (thủ vai) — bản gốc: edu.system.userId */
    P.sv = function () { return (ums.session && ums.session.userId) || ''; };

    var G = {
        hoSo:        { action: 'SV_Custom/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP', func: 'pkg_hosohocvien.LayThongTinChiTietHoSo' },
        hoSoMH:      { action: 'SV_HoSoHocVien_MH/DSA4FSkuLyYVKC8CKSgVKCQ1CS4SLgPP', func: 'pkg_hosohocvien.LayThongTinChiTietHoSo' },
        chuongTrinh: { action: 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP', func: 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc' },
        keHoach:     { action: 'SV_KeHoach_MH/DSA4BRIKJAkuICIpDykgMQkuEi4P', func: 'pkg_hososinhvien_kehoach.LayDSKeHoachNhapHoSo' },
        dsSV:        { action: 'SV_KeHoach_MH/DSA4BRIJLhIuAikuESkkMRIXDykgMQPP', func: 'pkg_hososinhvien_kehoach.LayDSHoSoChoPhepSVNhap' },
        tabSV:       { action: 'SV_KeHoach_MH/DSA4BRIVICMVKS4vJhUoLw8mNC4oCS4i', func: 'pkg_hososinhvien_kehoach.LayDSTabThongTinNguoiHoc' },
        dsCB:        { action: 'SV_HoSoHocVien_Quyen_MH/DSA4BRIJLhIuAikuESkkMQIDDykgMQPP', func: 'pkg_hosohocvien_quyen.LayDSHoSoChoPhepCBNhap' },
        tabCB:       { action: 'SV_HoSoHocVien_Quyen_MH/DSA4BRIVICMVKS4vJhUoLw8mNC4oCS4i', func: 'pkg_hosohocvien_quyen.LayDSTabThongTinNguoiHoc' },
        luuTruong:   { action: 'SV_KeHoach_MH/FSkkLB4QDRIXHgokCS4gIikeBTQNKCQ0', func: 'pkg_hososinhvien_kehoach.Them_QLSV_KeHoach_DuLieu' },
        luuAnh:      { action: 'SV_HoSoHocVien_MH/EjQgHhANEhceDyY0LigJLiIecAPP', func: 'pkg_hosohocvien.Sua_QLSV_NguoiHoc_1' }
    };
    P.G = G;
    P.goi = function (k, o) {
        var x = {}, g = G[k] || {};
        Object.keys(g).forEach(function (n) { x[n] = g[n]; });
        Object.keys(o || {}).forEach(function (n) { x[n] = o[n]; });
        return ums.api.call(x);
    };

    /* =====================================================================
       1. Khối "Thông tin cá nhân" — bản gốc .sv-info-base + viewForm_SinhVien
       ---------------------------------------------------------------------
       o = { anh: false | 'xem' | 'sua', lop: bool, nguon: 'hoSo' | 'hoSoMH',
             loc: { nhan, html } }   ô lọc của màn (Chương trình / Kế hoạch)
       → { anh (ums.files.avatar hoặc null), nap() → Promise<dòng hồ sơ> }
       ===================================================================== */
    P.khoiSV = function (host, o) {
        o = o || {};
        var DONG = [['ten', 'Họ và tên'], ['ngaysinh', 'Ngày sinh'], ['cmt', 'CMND/CCCD'],
            ['maso', 'Mã sinh viên'], ['nganh', 'Ngành học']];
        if (o.lop) DONG.push(['lop', 'Lớp quản lý']);

        host.innerHTML = '<div class="pf-tt">' +
            (o.anh ? '<div class="pf-tt__anh" data-z="anh"></div>' : '') +
            '<div class="pf-tt__kv">' +
            DONG.map(function (d) {
                return '<div class="ums-kv"><span>' + esc(d[1]) + '</span><b data-z="' + d[0] + '"></b></div>';
            }).join('') +
            (o.loc ? '<div class="ums-kv pf-kv--o"><span>' + esc(o.loc.nhan) + '</span>' +
                '<div class="pf-o">' + o.loc.html + '</div></div>' : '') +
            '</div></div>';

        function z(k) { return host.querySelector('[data-z="' + k + '"]'); }
        var anh = null;
        if (o.anh === 'sua') {
            anh = ums.files.avatar(z('anh'), { width: 336, height: 448, icon: 'fa-user-graduate' });
        } else if (o.anh === 'xem') {
            /* Bản gốc hoso.html KHÔNG gọi uploadAvatar nên ảnh không bao giờ hiện
               (mã đổ ảnh vào #srcuploadPicture_SV — phần tử chỉ có sau uploadAvatar).
               Bản mới hiện ảnh ở dạng CHỈ XEM, đúng ý định của bản gốc. */
            z('anh').innerHTML = '<div class="ums-avatar is-empty pf-anh"><img alt="">' +
                '<i class="fa-light fa-user-graduate ums-avatar__none"></i></div>';
        }
        function veAnhXem(duong) {
            var box = z('anh') && z('anh').querySelector('.pf-anh');
            if (!box) return;
            var img = box.querySelector('img');
            var u = duong ? ums.files.url(duong) : '';
            if (!u) { box.classList.add('is-empty'); img.removeAttribute('src'); return; }
            img.onload = function () { box.classList.remove('is-empty'); };
            img.onerror = function () { box.classList.add('is-empty'); };
            img.src = u;
        }

        return {
            anh: anh,
            nap: function () {
                return P.goi(o.nguon || 'hoSo', { strId: P.sv() }).then(function (r) {
                    var d = arr(r.data)[0] || {};
                    z('ten').textContent = (e(d.HODEM) + ' ' + e(d.TEN)).trim();
                    z('ngaysinh').textContent = e(d.QLSV_NGUOIHOC_NGAYSINH);
                    z('cmt').textContent = e(d.CMTND_SO);
                    z('maso').textContent = e(d.MASO);
                    z('nganh').textContent = e(d.NGANH);
                    if (o.lop) z('lop').textContent = e(d.LOP);
                    if (anh) anh.set(d.ANHCANHANTUUP); else if (o.anh === 'xem') veAnhXem(d.ANHCANHANTUUP);
                    return d;
                }).catch(function (err) { ums.api.handle(err, 'thông tin sinh viên'); return null; });
            }
        };
    };

    /* =====================================================================
       2. Màn "hồ sơ theo trường thông tin" — dùng chung hoso + tunhaphoso
       ---------------------------------------------------------------------
       cfg = {
         tieuDe, icon,
         sua: bool,                   tunhaphoso = true (có nút "Lưu thông tin")
         anh: 'xem' | 'sua',
         lop: bool,
         nguonSV: 'hoSo' | 'hoSoMH',
         loc: { nhan, tai() → Promise<rows>, id, name, ma },   ô lọc + cột mã
         ds(gt) → tham số lời gọi danh sách trường thông tin,
         tab(gt) → tham số lời gọi danh sách tab,
         cotDuLieu: 'Dữ liệu' | 'Dữ liệu cần nhập',
         luu(gt, aData, giaTri) → tham số lời gọi lưu MỘT trường,
         bcheck(dongLoc) → bool,      true = ô nhập mang TRUONGTHONGTIN_GIATRI
         baoCao(add, gt)              cặp addKeyValue của getList_MauImport
         — bốn cờ dưới đây chỉ tunhaphoso bật (kéo gốc 30/9), hoso giữ nguyên:
         locTren: true | 'nhãn'       ô lọc thành dải riêng trên dải tab
         tabCoTruong: bool            bỏ tab không có trường nào
         theoNhom: bool               vẽ theo nhóm THUOCNHOM (tiêu đề + bảng mỗi nhóm)
         tuLuuAnh: bool               tải ảnh lên xong tự lưu (save_Anh) + báo
       }
       ===================================================================== */
    P.manHoSo = function (root, cfg) {
        var dsTruong = [], dsTab = [], dsHienTai = [], dsLoc = [];
        var bcheck = false;                       // bản gốc: me.bcheck
        var nhanXacNhan = 'Xác nhận từ trường';   // bản gốc: #lblXacNhanTuTruong
        var tepTruong = {};                       // ID trường (kiểu FILE) → ums.files.mount

        var oLoc = '<select class="ums-select" data-z="loc" data-ph="' + esc(cfg.loc.nhan) + '"></select>';
        root.innerHTML =
            pat.page(cfg.tieuDe, '<span data-z="bc"></span>') +
            /* cfg.locTren (tunhaphoso, kéo gốc 30/9): ô lọc đứng riêng một dải NGAY TRÊN dải tab
               (gốc .tnhs-plan-bar "Kế hoạch nhập hồ sơ"), không nằm trong khối thông tin cá nhân. */
            (cfg.locTren ? '<div class="pf-locbar ums-u-mb-4"><label class="pf-locbar__nhan"><i class="fa-light fa-clipboard-list-check"></i> ' +
                esc(cfg.locTren === true ? cfg.loc.nhan : cfg.locTren) + '</label><div class="pf-o">' + oLoc + '</div></div>' : '') +
            '<nav class="ums-tabs ums-u-mb-4" data-z="tab" hidden></nav>' +
            pat.panel({
                title: 'Thông tin cá nhân', icon: 'fa-id-card',
                body: '<div data-z="sv"></div>'
            }) +
            pat.panel({
                title: false, flush: true,
                tools: cfg.sua ? ui.btn('save', { text: 'Lưu thông tin', attr: { 'data-a': 'luu' } }) : '',
                body: '<div data-z="bang"></div>'
            });
        function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

        var khoi = P.khoiSV(z('sv'), {
            anh: cfg.anh, lop: cfg.lop, nguon: cfg.nguonSV,
            loc: cfg.locTren ? null : { nhan: cfg.loc.nhan, html: oLoc }
        });
        var elLoc = z('loc');
        ui.enhance(cfg.locTren ? root.querySelector('.pf-locbar') : z('sv'));
        khoi.nap();

        function gt() { return elLoc ? elLoc.value : ''; }

        /* Khung trống hai dòng (gốc .tnhs-empty: tiêu đề + câu hướng dẫn) */
        function trong(tieuDe, loiKhuyen, icon) {
            return '<div class="ums-empty pf-trong"><i class="fa-light ' + (icon || 'fa-inbox') + '"></i>' +
                '<b>' + esc(tieuDe) + '</b>' + (loiKhuyen ? '<span>' + esc(loiKhuyen) + '</span>' : '') + '</div>';
        }
        /* Chưa chọn ô lọc — gốc tunhaphoso.html đặt sẵn khung này trong #tblTuNhapHoSo */
        function veChuaChon() {
            z('bang').innerHTML = cfg.theoNhom
                ? trong('Chưa có nhóm thông tin nào để nhập', 'Vui lòng chọn ' + cfg.loc.nhan + ' để bắt đầu nhập hồ sơ.', 'fa-clipboard-list-check')
                : ui.empty('Chưa có ' + cfg.loc.nhan.toLowerCase() + ' nào', 'fa-folder-open');
        }

        /* ---------- Ô lọc (bản gốc: genCombo_KeHoach / genCombo_ChuongTrinhHoc,
           chọn sẵn mục đầu rồi viewValById bắn change) -------------------- */
        cfg.loc.tai().then(function (rows) {
            dsLoc = arr(rows);
            /* Tiêu đề cột thứ tư: bản gốc xoá chữ khi kế hoạch đầu tiên có
               XACNHANTHONGTIN = 0 (getList_KeHoach). */
            if (cfg.loc.ma && dsLoc.length && String(e(dsLoc[0][cfg.loc.ma])) === '0') nhanXacNhan = '';
            pat.fill(elLoc, dsLoc, { id: cfg.loc.id, name: cfg.loc.name, head: 'Chọn ' + cfg.loc.nhan.toLowerCase() });
            if (dsLoc.length) {
                elLoc.value = e(dsLoc[0][cfg.loc.id]);
                if (window.jQuery) jQuery(elLoc).trigger('change.select2');
                taiDanhSach();
            } else {
                veChuaChon();
            }
        }).catch(function (err) { ums.api.handle(err, cfg.loc.nhan); });

        if (elLoc) elLoc.addEventListener('change', function () {
            if (!elLoc.value) {
                dsTruong = []; dsTab = []; dsHienTai = []; veTab();
                if (cfg.theoNhom) veChuaChon(); else veBang([]);
                return;
            }
            taiDanhSach();
        });

        /* ---------- Danh sách trường thông tin + tab --------------------- */
        function taiDanhSach() {
            var v = gt();
            /* Bản gốc bật me.bcheck khi mục chọn có XACNHANTHONGTIN = 0 nhưng
               KHÔNG bao giờ tắt lại (chốt một chiều) — xem báo cáo. Ở đây tính
               lại theo mục đang chọn. */
            if (cfg.bcheck) bcheck = cfg.bcheck(dsLoc.filter(function (r) { return e(r[cfg.loc.id]) === v; })[0]);
            z('bang').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
            P.goi(cfg.ds.nguon, cfg.ds.tham(v)).then(function (r) {
                dsTruong = arr(r.data);
                return P.goi(cfg.tab.nguon, cfg.tab.tham(v));
            }).then(function (r) {
                dsTab = arr(r.data);
                /* cfg.tabCoTruong (tunhaphoso, kéo gốc 30/9 genTab_DM_HoatDong): chỉ giữ tab có ít nhất
                   MỘT trường thông tin; không còn tab nào thì báo khung trống, không hiện bảng. */
                if (cfg.tabCoTruong) {
                    dsTab = dsTab.filter(function (t) {
                        return dsTruong.some(function (f) { return e(f.TAB_THONGTIN_ID) === e(t.ID); });
                    });
                    if (!dsTab.length) {
                        dsHienTai = []; veTab();
                        z('bang').innerHTML = trong('Kế hoạch này chưa có nhóm thông tin nào để nhập',
                            'Vui lòng chọn kế hoạch khác hoặc liên hệ nhà trường.', 'fa-inbox');
                        return;
                    }
                }
                veTab();
                chonTab(dsTab.length ? e(dsTab[0].ID) : '');
            }).catch(function (err) {
                z('bang').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách thông tin hồ sơ');
            });
        }

        /* Dải tab — bản gốc genTab_DM_HoatDong (TAB_THONGTIN_TEN + TAB_THONGTIN_TENANH).
           MỘT tab thì không vẽ dải tab (luật 2026-09-22). */
        function veTab() {
            var nav = z('tab');
            if (dsTab.length < 2) { nav.hidden = true; nav.innerHTML = ''; return; }
            nav.hidden = false;
            nav.innerHTML = dsTab.map(function (t, i) {
                return '<a class="ums-tabs__item' + (i === 0 ? ' is-active' : '') + '" href="javascript:void(0)" data-ptab="' + esc(t.ID) + '">' +
                    '<i class="' + esc(ums.iconFA4 ? ums.iconFA4(e(t.TAB_THONGTIN_TENANH)) : e(t.TAB_THONGTIN_TENANH)) + '"></i> ' +
                    esc(e(t.TAB_THONGTIN_TEN)) + '</a>';
            }).join('');
        }
        function chonTab(id) {
            ui.tabsActive(z('tab'), id, 'data-ptab');
            dsHienTai = id ? dsTruong.filter(function (x) { return e(x.TAB_THONGTIN_ID) === id; }) : dsTruong.slice();
            veBang(dsHienTai);
        }
        root.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-ptab]');
            if (t && root.contains(t)) { chonTab(t.getAttribute('data-ptab')); return; }
            var b = ev.target.closest('[data-a="luu"]');
            if (b) luuTatCa(b);
        });

        /* ---------- Bảng trường thông tin ------------------------------- */
        function veBang(rows) {
            tepTruong = {};
            if (cfg.theoNhom) { veTheoNhom(rows); return; }
            var nhomTruoc = null;
            ui.table({
                el: z('bang'), rows: rows, stt: false,
                empty: 'Không có thông tin nào',
                tableCls: 'ums-table--lined pf-bang',
                columns: [
                    { title: 'Nhóm', width: '18%', render: function (x, i) {
                        /* Bản gốc chỉ in tên nhóm ở dòng đầu và mỗi khi nhóm đổi */
                        var g = e(x.THUOCNHOM);
                        var hien = i === 0 || g !== nhomTruoc;
                        nhomTruoc = g;
                        return hien ? '<b class="pf-nhom">' + esc(g) + '</b>' : '';
                    } },
                    { title: 'Tên thông tin', width: '22%', render: function (x) {
                        return esc(e(x.TEN)) + (String(e(x.BATBUOC)) === '1' ? ' <span class="pf-sao">*</span>' : '');
                    } },
                    { title: cfg.cotDuLieu, render: function (x) { return veO(x); } },
                    { title: nhanXacNhan, width: '20%', prop: 'KETQUAXACNHAN_TEN' }
                ],
                rowCls: function (x, i) { return (i > 0 && e(x.THUOCNHOM) !== rows[i - 1].THUOCNHOM) ? 'pf-r--nhom' : ''; }
            });
            sauKhiVe(rows);
        }

        /* Vẽ theo NHÓM (cfg.theoNhom — tunhaphoso, kéo gốc 30/9 genTable_TuNhapHoSo): gom trường theo
           THUOCNHOM đã chuẩn hoá (NFC + gộp khoảng trắng + chữ hoa) nên cùng một nhóm viết lệch dấu /
           cách hay nằm rải rác vẫn về MỘT khối (thứ tự khối = lần đầu nhóm xuất hiện); nhóm rỗng →
           "THÔNG TIN CHUNG". Mỗi khối: tiêu đề nhóm (biểu tượng theo tên nhóm như gốc) + số trường, rồi
           bảng Tên thông tin | Dữ liệu cần nhập | Xác nhận từ trường. Không có trường nào → khung trống. */
        var ICON_NHOM = {
            'CCCD': 'fa-id-card',
            'THÔNG TIN CƯ TRÚ (TRA TRÊN VNIED)': 'fa-house-user',
            'THÔNG TIN CƯ TRÚ (TRA TRÊN VNEID)': 'fa-house-user',
            'BỐ': 'fa-user-tie', 'MẸ': 'fa-user-tie',
            'THÔNG TIN CHUNG': 'fa-user'
        };
        function chuanNhom(v) {
            var s = String(e(v));
            if (s.normalize) s = s.normalize('NFC');
            return s.replace(/\s+/g, ' ').trim().toUpperCase();
        }
        function veTheoNhom(rows) {
            var host = z('bang');
            if (!rows.length) {
                host.innerHTML = trong('Nhóm này chưa có thông tin cần nhập', 'Vui lòng chọn nhóm khác ở phía trên.', 'fa-clipboard-list');
                return;
            }
            var ds = [], map = {};
            rows.forEach(function (x) {
                var k = chuanNhom(x.THUOCNHOM), ten = String(e(x.THUOCNHOM)).trim();
                if (!k) { k = 'THONG_TIN_CHUNG'; ten = 'THÔNG TIN CHUNG'; }
                if (!map[k]) { map[k] = { ten: ten, ds: [] }; ds.push(map[k]); }
                map[k].ds.push(x);
            });
            host.innerHTML = '<div class="pf-nhomds">' + ds.map(function (g, i) {
                var ic = ICON_NHOM[g.ten.toUpperCase()] || 'fa-folder-open';
                return '<div class="ums-legend pf-nhomtd' + '' + '"><i class="fa-light ' + ic + '"></i> ' +
                    esc(g.ten) + '<span class="pf-nhomtd__so">' + g.ds.length + ' trường</span></div><div data-nhom="' + i + '"></div>';
            }).join('') + '</div>';
            ds.forEach(function (g, i) {
                ui.table({
                    el: host.querySelector('[data-nhom="' + i + '"]'), rows: g.ds, stt: false,
                    tableCls: 'ums-table--lined pf-bang',
                    columns: [
                        { title: 'Tên thông tin', width: '28%', render: function (x) {
                            return esc(e(x.TEN)) + (String(e(x.BATBUOC)) === '1' ? ' <span class="pf-sao">*</span>' : '');
                        } },
                        { title: cfg.cotDuLieu, render: function (x) { return veO(x); } },
                        { title: nhanXacNhan, width: '22%', prop: 'KETQUAXACNHAN_TEN' }
                    ]
                });
            });
            sauKhiVe(rows);
        }

        /** Giá trị đang có của một trường — bản gốc getGiaTri */
        function giaTri(x) { return e(bcheck ? x.TRUONGTHONGTIN_GIATRI : x.THONGTINXACMINH); }

        /** Ô nhập của một trường — bản gốc geninput */
        function veO(x) {
            var ic = e(x.TENANH) ? '<i class="' + esc(ums.iconFA4 ? ums.iconFA4(e(x.TENANH)) : e(x.TENANH)) + ' pf-ic"></i>' : '';
            var val = giaTri(x);
            if (!cfg.sua) {
                /* hoso: geninput trả NGAY ô chỉ đọc mang TRUONGTHONGTIN_GIATRI
                   (mọi nhánh switch bên dưới là mã chết) — giữ đúng như vậy. */
                return '<div class="pf-ctl">' + ic + '<input class="ums-input ums-input--sm" value="' +
                    esc(e(x.TRUONGTHONGTIN_GIATRI)) + '" readonly></div>';
            }
            var k = String(e(x.KIEUDULIEU)).toUpperCase();
            var ro = String(e(x.DUOCSUA)) === '0' ? ' readonly' : '';
            var cao = x.DORONG ? ' style="height:' + Number(x.DORONG) + 'px"' : '';
            var id = ' data-m="' + esc(e(x.ID)) + '"';
            var o;
            if (k === 'FILE') o = '<div data-mfile="' + esc(e(x.ID)) + '"></div>';
            else if (k === 'LIST' || k === 'TINH' || k === 'HUYEN' || k === 'XA')
                o = '<select class="ums-select ums-input--sm"' + id + ' data-kieu="' + k + '"' +
                    ' data-dm="' + esc(e(x.MABANGDANHMUC)) + '" data-nhom="' + esc(e(x.NHOM)) + '"' +
                    ' data-v="' + esc(val) + '"' + (ro ? ' disabled' : '') + '><option value=""></option></select>';
            else if (k === 'DATE')
                o = '<input class="ums-input ums-input--sm"' + id + ' data-date value="' + esc(val) + '"' + ro + '>';
            else if (x.DORONG)
                o = '<textarea class="ums-input ums-input--sm"' + id + cao + ro + '>' + esc(val) + '</textarea>';
            else
                o = '<input class="ums-input ums-input--sm"' + id + (k === 'NUMBER' ? ' inputmode="decimal"' : '') +
                    ' value="' + esc(val) + '"' + ro + '>';
            return '<div class="pf-ctl">' + ic + o + '</div>';
        }

        /** Đổ danh mục, nối tầng Tỉnh → Huyện → Xã, gắn khung tệp — bản gốc phần
            sau genTable_TuNhapHoSo (loadToCombo_DanhMucDuLieu / genDropTinhThanh /
            uploadFiles + viewFiles trong setTimeout 1000ms). */
        function sauKhiVe(rows) {
            ui.enhance(z('bang'));
            if (!cfg.sua) return;

            /* Danh mục đã nạp của từng trường LIST (gốc me['dt' + ID]) — cho các ô con nối tầng */
            var dmTruong = {};
            function oTruong(id) { return id ? z('bang').querySelector('select[data-m="' + e(id) + '"]') : null; }
            /* Nối tầng theo cột cấu hình (kéo gốc 30/9): LIST có THONGTIN5 = ID trường con — đổi ô cha thì
               ô con lấy danh mục CỦA CHA lọc QUANHECHA_ID = giá trị cha (cha trống → cả danh mục);
               TINH có THONGTIN3 = ID trường LIST con, lọc danh mục của trường đó theo tỉnh đã chọn.
               Khác gốc: theo luật cha → con (2026-09-21) đổi ô cha thì XOÁ TRẮNG ô con (gốc giữ giá trị đã
               lưu nếu còn trong danh sách lọc) và chưa chọn cha thì khoá ô con. */
            function noiTang(cha, idCon, nguon) {
                var con = oTruong(idCon);
                if (!cha || !con) return;
                var tCon = rows.filter(function (r) { return e(r.ID) === e(idCon); })[0] || {};
                cha.addEventListener('change', function () {
                    var d = dmTruong[nguon] || [];
                    if (cha.value) d = d.filter(function (r) { return e(r.QUANHECHA_ID) === cha.value; });
                    con.setAttribute('data-v', '');
                    pat.fill(con, d, { head: 'Chọn ' + e(tCon.TEN) });
                    con.value = '';
                });
                pat.chain([cha, con], { phatLai: false });
            }

            rows.forEach(function (x) {
                var k = String(e(x.KIEUDULIEU)).toUpperCase();
                if (k === 'LIST' && x.MABANGDANHMUC) {
                    var s = oTruong(x.ID);
                    if (!s) return;
                    ums.api.dm(e(x.MABANGDANHMUC)).then(function (r) {
                        r = arr(r);
                        dmTruong[e(x.ID)] = r;
                        /* Trường có THONGTIN5 / THONGTIN3: ô này chỉ hiện mục gốc (QUANHECHA_ID rỗng) */
                        if (x.THONGTIN5 || x.THONGTIN3) r = r.filter(function (d) { return !d.QUANHECHA_ID; });
                        pat.fill(s, r, { head: 'Chọn dữ liệu' });
                        s.value = s.getAttribute('data-v');
                        /* đặt giá trị bằng mã → cho chuỗi cha → con mở/khoá lại ô con */
                        if (window.jQuery) jQuery(s).trigger('ums:refresh');
                    }, function () { /* thiếu danh mục thì để trống như gốc */ });
                    if (x.THONGTIN5) noiTang(s, x.THONGTIN5, e(x.ID));
                }
                if (k === 'TINH' && x.THONGTIN3) noiTang(oTruong(x.ID), x.THONGTIN3, e(x.THONGTIN3));
                if (k === 'FILE') {
                    var h = z('bang').querySelector('[data-mfile="' + e(x.ID) + '"]');
                    if (!h) return;
                    var f = ums.files.mount(h, { api: 'SV_Files' });
                    tepTruong[e(x.ID)] = f;
                    f.load(P.sv() + e(x.ID));
                }
            });

            /* Tỉnh / Huyện / Xã: cùng NHÓM thì nối tầng (bản gốc genDropTinhThanh) */
            var nhomTinh = rows.filter(function (x) { return String(e(x.KIEUDULIEU)).toUpperCase() === 'TINH'; });
            if (!nhomTinh.length) return;
            pat.dmTinhThanh().then(function (dm) {
                function con(cha) { return dm.filter(function (r) { return (r.QUANHECHA_ID || null) === (cha || null); }); }
                nhomTinh.forEach(function (xt) {
                    function oCua(kieu) {
                        var x = rows.filter(function (r) {
                            return e(r.NHOM) === e(xt.NHOM) && String(e(r.KIEUDULIEU)).toUpperCase() === kieu;
                        })[0];
                        return x ? z('bang').querySelector('select[data-m="' + e(x.ID) + '"]') : null;
                    }
                    var t = oCua('TINH'), h = oCua('HUYEN'), xa = oCua('XA');
                    if (!t) return;
                    function nap(el, list) {
                        if (!el) return;
                        var v = el.getAttribute('data-v') || '';
                        pat.fill(el, list, { head: 'Chọn' });
                        el.value = v;
                    }
                    nap(t, con(null));
                    if (window.jQuery) jQuery(t).trigger('ums:refresh');   // chuỗi THONGTIN3 (noiTang) mở ô con
                    nap(h, t.value ? con(t.value) : []);
                    nap(xa, h && h.value ? con(h.value) : []);
                    t.addEventListener('change', function () {
                        if (h) { h.setAttribute('data-v', ''); pat.fill(h, t.value ? con(t.value) : [], { head: 'Chọn' }); h.value = ''; }
                        if (xa) { xa.setAttribute('data-v', ''); pat.fill(xa, [], { head: 'Chọn' }); xa.value = ''; }
                    });
                    if (h) h.addEventListener('change', function () {
                        if (xa) { xa.setAttribute('data-v', ''); pat.fill(xa, h.value ? con(h.value) : [], { head: 'Chọn' }); xa.value = ''; }
                    });
                    /* Luật cha → con (2026-09-21): chưa chọn cha thì con bị khoá */
                    pat.chain([t, h, xa].filter(Boolean), { phatLai: false });
                });
            }, function (err) { ums.api.handle(err, 'danh mục tỉnh thành'); });
        }

        /* ---------- Lưu -------------------------------------------------- */
        function oVal(id) {
            var el = z('bang').querySelector('[data-m="' + id + '"]');
            return el ? e(el.value) : '';
        }
        /** Kiểm ràng buộc — bản gốc phần đầu .btnSave_TuNhapHoSo */
        function kiem() {
            var loi = [];
            dsHienTai.filter(function (x) { return String(e(x.BATBUOC)) === '1'; }).forEach(function (x) {
                var v = oVal(e(x.ID));
                if (v === '') { loi.push([x, 'bắt buộc']); return; }
                if (x.DODAI && String(v).length !== Number(x.DODAI)) loi.push([x, 'sai độ dài (' + x.DODAI + ')']);
                var k = String(e(x.KIEUDULIEU)).toUpperCase();
                if (k === 'NUMBER' && isNaN(v)) loi.push([x, 'sai kiểu số']);
                if (k === 'DATE' && !/^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/.test(v)) loi.push([x, 'sai định dạng ngày(dd/mm/yyyy)']);
            });
            return loi;
        }
        function luuTatCa(btn) {
            var loi = kiem();
            if (loi.length) {
                ui.dialog({
                    title: 'Chưa nhập đủ thông tin', icon: 'fa-triangle-exclamation', size: 'sm',
                    /* Bản gốc: "Trường thông tin <lý do>: <tên>" (tên chữ đỏ) */
                    body: '<div class="ums-stack">' + loi.map(function (l) {
                        return '<div class="pf-loi">Trường thông tin ' + esc(l[1]) + ': <b class="pf-sao">' + esc(e(l[0].TEN)) + '</b></div>';
                    }).join('') + '</div>'
                });
                return;
            }
            btn.disabled = true;
            var v = gt();
            /* save_Anh của bản gốc — chạy trước khi lưu từng trường; không có ảnh thì bỏ qua (gốc 30/9) */
            luuAnh(false).then(function () {
                var viec = [];
                dsHienTai.forEach(function (x) {
                    var f = tepTruong[e(x.ID)];
                    if (f) viec.push(function () { return f.save(P.sv() + e(x.ID)); });
                    viec.push(cfg.luu(v, x, String(e(x.KIEUDULIEU)).toUpperCase() === 'FILE' ? '' : oVal(e(x.ID)), bcheck));
                });
                return ui.batch(viec, { title: 'Đang lưu thông tin', okText: 'Cập nhật thành công' });
            }).then(function () {
                btn.disabled = false;
                taiDanhSach();
            }, function (err) { btn.disabled = false; ums.api.handle(err, 'lưu hồ sơ'); });
        }

        /* ---------- Ảnh đại diện (save_Anh) ------------------------------
           Kéo gốc 30/9: không có ảnh thì KHÔNG gọi (gốc `if (!strAnhRaw) return`); strAnh gửi đường dẫn
           CHÍNH THỨC (= edu.system.getImage: ảnh tạm "unsave_" được chép sang tên chính thức qua
           copyfile.ashx — ums.files.avatar.finalize), không gửi đường dẫn tạm. Ảnh đã chép thì nhớ lại để
           lần lưu sau không chép lần nữa (gốc viewValById đường dẫn mới vào ô ảnh). */
        var anhDaChep = { tam: null, that: '' };
        function luuAnh(bao) {
            var anh = khoi.anh;
            var d = anh ? anh.get() : '';
            if (!d) return Promise.resolve(null);
            var p = d === anhDaChep.tam ? Promise.resolve(anhDaChep.that) : anh.finalize(P.sv());
            return p.then(function (duong) {
                anhDaChep = { tam: d, that: duong };
                return P.goi('luuAnh', { strQLSV_NguoiHoc_Id: P.sv(), strAnh: duong });
            }).then(function (r) {
                if (bao) ui.toast('Đã lưu ảnh đại diện', 'ok');
                return r;
            }).catch(function (err) { ums.api.handle(err, 'lưu ảnh cá nhân'); return null; });
        }
        /* cfg.tuLuuAnh (tunhaphoso, kéo gốc 30/9): tải ảnh lên xong là TỰ LƯU (gốc truyền save_Anh làm
           hàm gọi lại của uploadAvatar) và báo "Đã lưu ảnh đại diện". ums.files.avatar chưa có móc
           "tải lên xong" nên: bắt sự kiện chọn tệp ở pha BẮT (trước trình xử lý của khung ảnh), rồi chờ
           đường dẫn ảnh đổi (tải lên thành công). Tải lỗi thì đường dẫn không đổi → không lưu. */
        if (cfg.tuLuuAnh && khoi.anh) {
            var luotAnh = 0;
            z('sv').addEventListener('change', function (ev) {
                if (!ev.target.matches || !ev.target.matches('.ums-avatar input[type="file"]')) return;
                if (!ev.target.files || !ev.target.files.length) return;
                var cu = khoi.anh.get(), luot = ++luotAnh, t0 = Date.now();
                (function cho() {
                    if (luot !== luotAnh) return;              // đã chọn ảnh khác — lượt mới lo
                    var moi = khoi.anh.get();
                    if (moi && moi !== cu) { luuAnh(true); return; }
                    if (Date.now() - t0 < 120000) setTimeout(cho, 250);
                })();
            }, true);
        }

        /* ---------- Menu mẫu báo cáo ------------------------------------- */
        ums.report.mount(z('bc'), {
            import: false,
            collect: function (add) { cfg.baoCao(add, gt()); }
        });
    };
})();
