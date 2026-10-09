/* =========================================================================
   Kế hoạch xét tốt nghiệp — vùng "Điều kiện xét" (#zoneKeThua), vùng "Chuẩn bị dữ liệu" (#zoneChuanBiDuLieu)
   và hộp "Xác nhận" khoá - mở dữ liệu (#modal_XacNhan) của gốc
   Bản gốc: ApisTotNghiep/Modules/kehoach/script/kehoach.js
       getList_XetDuyet · save_XetDuyet · getList_DieuKien · genTable_DieuKien · save_XepLoai · delete_XepLoai
       save_KeThuaDieuKien · save_KeThuaXepLoai · getList_KeThuaNhom (#myModalKeThua, #myModalKeThuaNhom)
       getList_DieuKienHaBac (#myModalDieuKienHaBac)
       getList_HocPhanKeHoach · getList_ChuanBi · save_ChuanBi
       save_XacNhanSanPham · getList_XacNhanSanPham + nút từ danh mục TN.KHOA.MO.DULIEU
   ---------------------------------------------------------------------------
   ums.tnKh.taoDieuKien(zone, { onClose }) → { mo(kế hoạch) }
   ums.tnKh.taoChuanBi(zone, { onClose })  → { mo(kế hoạch) }
   ums.tnKh.xacNhan(kế hoạch, onDone)       hộp xác nhận (ums.ui.dialog)

   Lời gọi (chép nguyên; TN_ThongTin/* không có func nhưng gốc vẫn gửi iM → truyền iM tường minh):
     Tab 1 "Điều kiện xét áp dụng cho kế hoạch xét":
       TN_ThongTin/LayDSTN_XetDuyet_DieuKien_Ad POST (type=POST, iM) strTuKhoa '' · strPhanLoai_Id '' · strPhamViApDung_Id = ID
           kế hoạch · strPhanCapApDung_Id '' · strDaoTao_ThoiGianDaoTao_Id '' · strNguoiTao_Id '' · pageIndex 1 · pageSize 10
           (pageIndex/pageSize_default) → dòng ĐẦU: XAUDIEUKIEN vào ô chữ.
       TN_ThongTin/Sua_TN_XetDuyet_DieuKien_Ad POST (type=POST, iM) strId · strXauDieuKien · strPhanLoai_Id = PHANLOAI_ID
           · dThuTu -1 · strMoTa '' · strPhamViApDung_Id = PHAMVIAPDUNG_ID · strDaoTao_ThoiGianDaoTao_Id (đọc từ dòng đầu)
     Tab 2 "Điều kiện xếp loại áp dụng cho kế hoạch xét":
       TN_ThongTin/LayDSTN_XepLoai_DieuKien_Ad GET (type=GET, iM) … strXepLoai_Id '' … pageIndex 1 · pageSize 1000000
           Cột: XEPLOAI_TEN (nút → hộp hạ bậc) · THOIGIAN · XAUDIEUKIEN (ô nhiều dòng sửa trong bảng) · ô đánh dấu
       TN_ThongTin/Sua_TN_XepLoai_DieuKien_Ad POST (type=POST, iM) — mỗi ô ĐÃ ĐỔI một lời gọi: strId · strXauDieuKien
           · strPhanLoai_Id · strXepLoai_Id · dThuTu (THUTU, trống thì không gửi) · strMoTa = MOTA · strPhamViApDung_Id
           · strDaoTao_ThoiGianDaoTao_Id · strNgayApDung ''
       TN_ThongTin/Xoa_TN_XepLoai_DieuKien_Ad POST strIds · strChucNang_Id — mỗi dòng đã đánh dấu một lời gọi
       Hộp hạ bậc: TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSTN_XepLoai_DieuKien_HaBac strTn_XepLoai_DieuKien_Id = ID dòng
           · pageSize 100000; cột XAUDIEUKIEN · XEPLOAI_TEN (chỉ xem — gốc có ô đánh dấu nhưng không nút nào dùng)
     Kế thừa (nút ở cả hai tab — hộp chọn Hệ đào tạo, genBoLoc_HeKhoa("_KT") → ums.ref.cascadeQuyen, LỌC QUYỀN như gốc):
       tab 1: TN_ThongTin/KeThuaXetDuyet_DieuKien_Ad · tab 2: TN_ThongTin/KeThuaXepLoai_DieuKien_Ad
           POST (type=POST, iM) strPhamViNguon_Id = ID hệ · strPhamViDich_Id = ID kế hoạch
     Kế thừa theo nhóm: TN_ThongTin/LayDSTN_PhamVi_ApDung POST (type=POST, iM) strPhanLoai_Id = ID KẾ HOẠCH (tên tham số
           gốc như vậy) → ô "Chọn nhóm"; đồng ý thì gọi CẢ KeThuaXepLoai_DieuKien_Ad và KeThuaXetDuyet_DieuKien_Ad với nhóm đó.
     Chuẩn bị dữ liệu:
       tab 1: TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSTN_KeHoach_HocPhan strTuKhoa '' · strTN_KeHoach_Id · pageIndex
           · pageSize (phân trang máy chủ); cột DAOTAO_HOCPHAN_MA · DAOTAO_HOCPHAN_TEN
       tab 2: TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSTN_KH_DTB_HocPhan_Tam strTuKhoa · strTN_KeHoach_Id · strThangDiem_Id
           (danh mục DIEM.THANGDIEM); cột QLSV_NGUOIHOC_MASO · QLSV_NGUOIHOC_HOTEN · DAOTAO_TOCHUCCHUONGTRINH_TEN(MA)
           · DAOTAO_KHOADAOTAO_TEN · DTB · CHITIETKETQUAHOCPHAN · THANGDIEM_TEN
       "Thực hiện tạo dữ liệu": TN_TinhToan_MH/… pkg_totnghiep_tinhtoan.TinhDTB_TN_KeHoach_HocPhan strTN_KeHoach_Id · strThangDiem_Id
     Xác nhận khoá - mở dữ liệu:
       nút = danh mục TN.KHOA.MO.DULIEU (THONGTIN1 biểu tượng — qua ums.iconFA4, THONGTIN2 kiểu)
       TN_ThongTin_MH/… pkg_totnghiep_thongtin.Them_TN_KeHoach_XacNhan strSanPham_Id = ID kế hoạch · strNoiDung · strTinhTrang_Id
           · strNguoiXacnhan_Id = userId
       TN_ThongTin_MH/… pkg_totnghiep_thongtin.LayDSTN_KeHoach_XacNhan GET strTuKhoa '' · strSanPham_Id · strTinhTrang_Id ''
           · pageSize 100000; cột TINHTRANG_TEN · NOIDUNG · NGUOIXACNHAN_TENDAYDU · NGAYTAO_DD_MM_YYYY

   Lỗi gốc đã sửa (theo ý định):
     · Tab 1 Lưu khi kế hoạch CHƯA có dòng điều kiện xét: gốc đọc dòng của LẦN MỞ TRƯỚC (me.dtXetDuyet không đặt lại khi mở
       kế hoạch khác) → GHI ĐÈ xâu điều kiện lên kế hoạch khác; không có lần trước thì lỗi JS. Nay đặt lại mỗi lần mở, chưa có
       dòng thì báo "Chưa có điều kiện xét — hãy Kế thừa trước".
     · Bảng của hai vùng / hộp vẽ qua ums.ui.table; tab 1 Chuẩn bị phân trang được (gốc gắn trang vào main_doc.KeHoach —
       không tồn tại). Ô đánh dấu ở hai bảng Chuẩn bị và hộp hạ bậc bị bỏ (gốc không nút nào dùng).
     · Thực hiện tạo dữ liệu xong thì nạp lại danh sách người học (gốc không nạp lại).
   Khác gốc: hộp kế thừa hỏi lại TRƯỚC rồi mới đóng (gốc đóng hộp rồi hỏi); chạy hàng loạt qua ums.ui.batch, nạp lại MỘT lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var T = ums.tnKh, K = T.K, e = T.e;
    var TT = 'TN_ThongTin/';

    function napHop(o) {
        var dlg = ui.dialog({ title: o.title, icon: o.icon || 'fa-copy', size: 'md',
            body: ui.field(o.nhan, '<select class="ums-select" data-f="x" data-required data-ph="' + esc(o.ph) + '"><option value="">' + esc(o.ph) + '</option></select>'),
            buttons: [{ text: o.nut, kind: 'save', icon: 'fa-copy', onClick: function () {
                var v = el.value;
                if (!v) { ui.toast('Vui lòng ' + o.ph.toLowerCase().replace(/^-+|-+$/g, ''), 'warn'); return false; }
                ui.confirm('Bạn có muốn kế thừa không?', { ok: 'Kế thừa', title: o.nut }).then(function (yes) {
                    if (!yes) return;
                    dlg.close();
                    o.chay(v);
                });
                return false;
            } }] });
        var el = dlg.body.querySelector('[data-f="x"]');
        ui.enhance(dlg.body);
        o.nap(el);
        return dlg;
    }

    /* =====================================================================
       Điều kiện xét
       ===================================================================== */
    T.taoDieuKien = function (zone, o) {
        o = o || {};
        var khId = '', xetDuyet = null, rows = [], tab = 'xet';

        zone.innerHTML = pat.panel({
            title: 'Điều kiện xét', icon: 'fa-pen-field',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('save', { text: 'Kế thừa theo nhóm', icon: 'fa-copy', attr: { 'data-a': 'kethua-nhom' } }),
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-z="kh"></div>' +
                ui.tabs([{ key: 'xet', text: '1) Điều kiện xét áp dụng cho kế hoạch xét' },
                         { key: 'xl', text: '2) Điều kiện xếp loại áp dụng cho kế hoạch xét' }], 'xet', 'data-dktab') +
                '<div data-p="xet" class="ums-u-mt-3">' +
                    '<textarea class="ums-textarea tnkh-xau tnkh-xau--lon" spellcheck="false" data-z="xau"></textarea>' +
                    '<div class="ums-row ums-row--end ums-u-mt-3">' +
                        ui.btn('save', { text: 'Kế thừa', icon: 'fa-copy', attr: { 'data-a': 'kethua', 'data-loai': 'DIEUKIEN' } }) +
                        ui.btn('save', { attr: { 'data-a': 'luu-xet' } }) +
                    '</div>' +
                '</div>' +
                '<div data-p="xl" class="ums-u-mt-3" hidden>' +
                    '<div class="ums-row ums-row--end ums-u-mb-3">' +
                        ui.xoaChon('input[data-tndk]', { goc: '[data-p="xl"]', text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
                        ui.btn('save', { text: 'Kế thừa', icon: 'fa-copy', attr: { 'data-a': 'kethua', 'data-loai': 'XEPLOAI' } }) +
                        ui.btn('save', { attr: { 'data-a': 'luu-xl' } }) +
                    '</div>' +
                    '<div class="tnkh-bang" data-z="t"></div>' +
                '</div>'
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        K.ganChon(zone);

        function moTab(k) {
            tab = k;
            ui.tabsActive(zone, k, 'data-dktab');
            K.qa(zone, '[data-p]').forEach(function (p) { p.hidden = p.getAttribute('data-p') !== k; });
        }

        function taiXet() {
            xetDuyet = null;
            z('xau').value = '';
            return ums.api.call({ action: TT + 'LayDSTN_XetDuyet_DieuKien_Ad', method: 'POST', type: 'POST', iM: T.iM(),
                strTuKhoa: '', strPhanLoai_Id: '', strPhamViApDung_Id: khId, strPhanCapApDung_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10 })
                .then(function (r) {
                    var d = K.ds(r);
                    if (d.length) { xetDuyet = d[0]; z('xau').value = e(d[0].XAUDIEUKIEN); }
                }).catch(function (err) { ums.api.handle(err, 'điều kiện xét'); });
        }
        function taiXL() {
            var host = z('t');
            K.dang(host);
            return ums.api.call({ action: TT + 'LayDSTN_XepLoai_DieuKien_Ad', method: 'GET', type: 'GET', iM: T.iM(),
                strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strPhamViApDung_Id: khId, strPhanCapApDung_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 })
                .then(function (r) {
                    rows = K.ds(r);
                    ui.table({
                        el: host, rows: rows, empty: 'Chưa có điều kiện xếp loại',
                        columns: [
                            { title: 'Xếp loại', cls: 'is-center tnkh-xl', render: function (x) {
                                return ui.btn('view', { text: e(x.XEPLOAI_TEN) || 'Chi tiết', cls: 'ums-btn--sm', attr: { 'data-a': 'habac', 'data-id': x.ID } });
                            } },
                            { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                            { title: 'Điều kiện', render: function (x) {
                                return '<textarea class="ums-textarea tnkh-xau" rows="12" spellcheck="false" data-xau="' + esc(x.ID) + '">' + esc(e(x.XAUDIEUKIEN)) + '</textarea>';
                            } },
                            K.cotChon('tndk')
                        ]
                    });
                }).catch(function (err) { K.loi(host, err, 'điều kiện xếp loại'); });
        }

        function luuXet() {
            var a = xetDuyet;
            if (!a) { ui.toast('Chưa có điều kiện xét cho kế hoạch này — hãy Kế thừa trước', 'warn'); return; }
            ums.api.call({ action: TT + 'Sua_TN_XetDuyet_DieuKien_Ad', method: 'POST', type: 'POST', iM: T.iM(),
                strId: a.ID, strChucNang_Id: '', strXauDieuKien: z('xau').value, strPhanLoai_Id: a.PHANLOAI_ID,
                dThuTu: -1, strMoTa: '', strPhamViApDung_Id: a.PHAMVIAPDUNG_ID, strDaoTao_ThoiGianDaoTao_Id: a.DAOTAO_THOIGIANDAOTAO_ID,
                strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); taiXet(); })
                .catch(function (err) { ums.api.handle(err, 'lưu điều kiện xét'); });
        }
        function luuXL() {
            var doi = [];
            K.qa(z('t'), 'textarea[data-xau]').forEach(function (t) {
                var r = K.tim(rows, t.getAttribute('data-xau'));
                if (r && t.value !== e(r.XAUDIEUKIEN)) doi.push({ r: r, xau: t.value });
            });
            if (!doi.length) { ui.toast('Không có thay đổi để lưu', 'warn'); return; }
            ui.batch(doi.map(function (x) {
                var a = x.r;
                return { action: TT + 'Sua_TN_XepLoai_DieuKien_Ad', method: 'POST', type: 'POST', iM: T.iM(),
                    strId: a.ID, strChucNang_Id: '', strXauDieuKien: x.xau, strPhanLoai_Id: a.PHANLOAI_ID, strXepLoai_Id: a.XEPLOAI_ID,
                    dThuTu: a.THUTU ? a.THUTU : undefined, strMoTa: a.MOTA, strPhamViApDung_Id: a.PHAMVIAPDUNG_ID,
                    strDaoTao_ThoiGianDaoTao_Id: a.DAOTAO_THOIGIANDAOTAO_ID, strNgayApDung: '', strNguoiThucHien_Id: '' };
            }), { title: 'Đang lưu điều kiện xếp loại', okText: 'Thực hiện thành công', show: true }).then(taiXL);
        }
        function xoa() {
            var ids = K.daChon(z('t'), 'tndk');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: TT + 'Xoa_TN_XepLoai_DieuKien_Ad', method: 'POST', strIds: id, strChucNang_Id: '', strNguoiThucHien_Id: '' };
            }), taiXL);
        }
        function goiKeThua(loai, nguon) {
            return { action: TT + (loai === 'DIEUKIEN' ? 'KeThuaXetDuyet_DieuKien_Ad' : 'KeThuaXepLoai_DieuKien_Ad'), method: 'POST', type: 'POST',
                iM: T.iM(), strPhamViNguon_Id: nguon, strPhamViDich_Id: khId, strNguoiThucHien_Id: '' };
        }
        function keThua(loai) {
            napHop({
                title: 'Kế thừa', nhan: 'Hệ đào tạo', ph: '--Chọn hệ đào tạo--', nut: 'Kế thừa theo hệ',
                nap: function (el) { ums.ref.cascadeQuyen({ he: el }); },
                chay: function (he) {
                    ums.api.call(goiKeThua(loai, he)).then(function () {
                        ui.toast('Thực hiện thành công', 'ok');
                        if (loai === 'DIEUKIEN') taiXet(); else taiXL();
                    }).catch(function (err) { ums.api.handle(err, 'kế thừa'); });
                }
            });
        }
        function keThuaNhom() {
            napHop({
                title: 'Kế thừa', nhan: 'Nhóm', ph: 'Chọn nhóm', nut: 'Kế thừa theo nhóm',
                nap: function (el) {
                    ums.api.call({ action: TT + 'LayDSTN_PhamVi_ApDung', method: 'POST', type: 'POST', iM: T.iM(),
                        strNguoiThucHien_Id: '', strPhanLoai_Id: khId })
                        .then(function (r) { pat.fill(el, K.ds(r), { name: 'TEN', head: 'Chọn nhóm' }); })
                        .catch(function (err) { ums.api.handle(err, 'danh sách nhóm kế thừa'); });
                },
                chay: function (nhom) {
                    ui.batch([goiKeThua('XEPLOAI', nhom), goiKeThua('DIEUKIEN', nhom)],
                        { title: 'Đang kế thừa', okText: 'Thực hiện thành công', show: true })
                        .then(function () { taiXet(); taiXL(); });
                }
            });
        }
        function haBac(id) {
            var dlg = ui.dialog({ title: 'Danh sách', icon: 'fa-list-ul', size: 'lg', body: '<div data-z="hb"></div>' });
            var host = dlg.body.querySelector('[data-z="hb"]');
            K.dang(host);
            ums.api.call({ action: 'TN_ThongTin_MH/DSA4BRIVDx4ZJDENLiAoHgUoJDQKKCQvHgkgAyAi', func: 'pkg_totnghiep_thongtin.LayDSTN_XepLoai_DieuKien_HaBac',
                method: 'POST', strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strTn_XepLoai_DieuKien_Id: id, strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 100000 })
                .then(function (r) {
                    ui.table({ el: host, rows: K.ds(r), empty: 'Không có điều kiện hạ bậc', columns: [
                        { title: 'Điều kiện hạ bậc', prop: 'XAUDIEUKIEN' },
                        { title: 'Xếp loại hạ xuống', prop: 'XEPLOAI_TEN' }
                    ] });
                }).catch(function (err) { K.loi(host, err, 'điều kiện hạ bậc'); });
        }

        zone.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-dktab]');
            if (t) { moTab(t.getAttribute('data-dktab')); return; }
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu-xet': luuXet(); break;
                case 'luu-xl': luuXL(); break;
                case 'xoa': xoa(); break;
                case 'kethua': keThua(b.getAttribute('data-loai')); break;
                case 'kethua-nhom': keThuaNhom(); break;
                case 'habac': haBac(b.getAttribute('data-id')); break;
            }
        });

        return {
            mo: function (kh) {
                khId = kh.ID;
                z('kh').textContent = e(kh.TEN) ? 'Kế hoạch: ' + e(kh.TEN) : '';
                moTab('xet');
                taiXet(); taiXL();
            }
        };
    };

    /* =====================================================================
       Chuẩn bị dữ liệu
       ===================================================================== */
    T.taoChuanBi = function (zone, o) {
        o = o || {};
        var khId = '', hpPage = 1, hpSize = 10;

        zone.innerHTML = pat.panel({
            title: 'Chuẩn bị dữ liệu', icon: 'fa-database',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-z="kh"></div>' +
                ui.tabs([{ key: 'hp', text: '1) Danh sách các học phần khai theo kế hoạch' },
                         { key: 'nh', text: '2) Danh sách người học' }], 'hp', 'data-cbtab') +
                '<div data-p="hp" class="ums-u-mt-3"><div class="tnkh-bang" data-z="hp"></div></div>' +
                '<div data-p="nh" class="ums-u-mt-3" hidden>' +
                    '<div class="ums-filter">' +
                        '<div class="ums-field"><select class="ums-select" data-f="td" data-ph="Chọn thang điểm"><option value=""></option></select></div>' +
                        '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                        '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Thực hiện tạo dữ liệu', attr: { 'data-a': 'tao' } }) + '</div>' +
                    '</div>' +
                    '<div class="ums-u-mt-3 tnkh-bang" data-z="nh"></div>' +
                '</div>'
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        var fTd = zone.querySelector('[data-f="td"]'), fQ = zone.querySelector('[data-f="q"]');
        ui.enhance(zone);
        ums.api.dm('DIEM.THANGDIEM').then(function (ds) { pat.fill(fTd, ds, { name: 'TEN', head: 'Chọn thang điểm' }); })
            .catch(function (err) { ums.api.handle(err, 'thang điểm'); });

        function moTab(k) {
            ui.tabsActive(zone, k, 'data-cbtab');
            K.qa(zone, '[data-p]').forEach(function (p) { p.hidden = p.getAttribute('data-p') !== k; });
        }
        function taiHP(p) {
            if (p) hpPage = p;
            var host = z('hp');
            K.dang(host);
            ums.api.call({ action: 'TN_ThongTin_MH/DSA4BRIVDx4KJAkuICIpHgkuIhEpIC8P', func: 'pkg_totnghiep_thongtin.LayDSTN_KeHoach_HocPhan',
                method: 'POST', strTuKhoa: '', strTN_KeHoach_Id: khId, pageIndex: hpPage, pageSize: hpSize })
                .then(function (r) {
                    var d = K.ds(r), total = Number(r.pager) || d.length;
                    ui.table({ el: host, rows: d, empty: 'Kế hoạch chưa khai học phần',
                        page: { index: hpPage, size: hpSize, total: total,
                            onChange: function (n) { if (n >= 1 && n <= Math.ceil(total / hpSize)) taiHP(n); },
                            onSize: function (v) { hpSize = v === 'all' ? ui.PAGE_ALL : Number(v); taiHP(1); } },
                        columns: [{ title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' }] });
                }).catch(function (err) { K.loi(host, err, 'học phần của kế hoạch'); });
        }
        function taiNH() {
            var host = z('nh');
            K.dang(host);
            ums.api.call({ action: 'TN_ThongTin_MH/DSA4BRIVDx4KCR4FFQMeCS4iESkgLx4VICwP', func: 'pkg_totnghiep_thongtin.LayDSTN_KH_DTB_HocPhan_Tam',
                method: 'POST', strTuKhoa: (fQ.value || '').trim(), strTN_KeHoach_Id: khId, strThangDiem_Id: fTd.value, strNguoiThucHien_Id: '' })
                .then(function (r) {
                    ui.table({ el: host, rows: K.ds(r), empty: 'Chưa có dữ liệu', columns: [
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN', cls: 'is-nowrap' },
                        { title: 'Chương trình', render: function (x) { return esc(e(x.DAOTAO_TOCHUCCHUONGTRINH_TEN) + '(' + e(x.DAOTAO_TOCHUCCHUONGTRINH_MA) + ')'); } },
                        { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                        { title: 'Điểm trung bình nhóm học phần', prop: 'DTB', cls: 'is-center' },
                        { title: 'Chi tiết kết quả từng học phần', prop: 'CHITIETKETQUAHOCPHAN', cls: 'tnkh-ct' },
                        { title: 'Thang điểm', prop: 'THANGDIEM_TEN', cls: 'is-center' }
                    ] });
                }).catch(function (err) { K.loi(host, err, 'danh sách người học'); });
        }
        function tao() {
            ui.confirm('Bạn có muốn Thực hiện tạo dữ liệu không?', { ok: 'Thực hiện', title: 'Thực hiện tạo dữ liệu' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'TN_TinhToan_MH/FSgvKQUVAx4VDx4KJAkuICIpHgkuIhEpIC8P', func: 'pkg_totnghiep_tinhtoan.TinhDTB_TN_KeHoach_HocPhan',
                    strTN_KeHoach_Id: khId, strThangDiem_Id: fTd.value, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); taiNH(); })
                    .catch(function (err) { ums.api.handle(err, 'tạo dữ liệu'); });
            });
        }

        zone.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-cbtab]');
            if (t) { moTab(t.getAttribute('data-cbtab')); return; }
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'tim': taiNH(); break;
                case 'tao': tao(); break;
            }
        });
        fQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); taiNH(); } });

        return {
            mo: function (kh) {
                khId = kh.ID;
                z('kh').textContent = e(kh.TEN) ? 'Kế hoạch: ' + e(kh.TEN) : '';
                fQ.value = '';
                moTab('hp');
                taiHP(1); taiNH();
            }
        };
    };

    /* =====================================================================
       Xác nhận khoá - mở dữ liệu
       ===================================================================== */
    T.xacNhan = function (kh, onDone) {
        var dlg = ui.dialog({
            title: 'Xác nhận: ' + e(kh.TEN), icon: 'fa-wrench', size: 'lg',
            body: ui.field('Nội dung xác nhận', '<input class="ums-input" data-x="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="nd-xn" data-x="nut">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-x="ls"></div>'
        });
        function q(x) { return dlg.body.querySelector('[data-x="' + x + '"]'); }
        ums.api.dm('TN.KHOA.MO.DULIEU').then(function (d) {
            q('nut').innerHTML = d.length ? d.map(function (h) {
                var ic = ums.iconFA4 ? ums.iconFA4(h.THONGTIN1 || 'fa fa-paper-plane') : 'fa-light fa-paper-plane';
                return '<button type="button" class="nd-xn__nut" data-hd="' + esc(h.ID) + '"><i class="' + esc(ic) + '"' +
                    (h.THONGTIN2 ? ' style="' + esc(h.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(h.TEN)) + '</span></button>';
            }).join('') : ui.empty('Chưa khai báo danh mục TN.KHOA.MO.DULIEU');
        }).catch(function (err) { q('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng xác nhận'); });
        ums.api.call({ action: 'TN_ThongTin_MH/DSA4BRIVDx4KJAkuICIpHhkgIg8pIC8P', func: 'pkg_totnghiep_thongtin.LayDSTN_KeHoach_XacNhan',
            method: 'GET', strTuKhoa: '', strSanPham_Id: kh.ID, strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 })
            .then(function (r) {
                ui.table({ el: q('ls'), rows: K.ds(r), empty: 'Chưa có lịch sử', columns: [
                    { title: 'Xác nhận', prop: 'TINHTRANG_TEN' },
                    { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center', width: '110px' }
                ] });
            }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử xác nhận'); });
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-hd]');
            if (!b) return;
            var noiDung = (q('nd').value || '').trim();
            dlg.close();
            ums.api.call({ action: 'TN_ThongTin_MH/FSkkLB4VDx4KJAkuICIpHhkgIg8pIC8P', func: 'pkg_totnghiep_thongtin.Them_TN_KeHoach_XacNhan',
                strSanPham_Id: kh.ID, strNoiDung: noiDung, strTinhTrang_Id: b.getAttribute('data-hd'), strNguoiXacnhan_Id: T.uid() })
                .then(function () { ui.toast('Xác nhận thành công', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'Xác nhận thất bại'); })
                .then(function () { if (onDone) onDone(); });
        });
        return dlg;
    };
})();
