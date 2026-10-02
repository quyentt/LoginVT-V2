/* =========================================================================
   Lớp học phần — CÁC HỘP THOẠI (thay 7 modal Bootstrap của bản gốc)
   Bản gốc: html/lophocphan.html (#myModal, #myModalNhom, #myModalPhamVi,
   #myModalHuyPhiTinChi, #myModalThuocTinhKLGD, #myModalCheDoTinhPhi_LopHP,
   #myModal_khongdangky) + script/lophocphan.js
   ---------------------------------------------------------------------------
   ums.lhp.cotChon(nhom)            cột ô đánh dấu (cuối bảng, ô "chọn tất cả" ở đầu cột)
   ums.lhp.ganChon(root)            gắn xử lý "chọn tất cả" cho mọi bảng trong root
   ums.lhp.idChon(root, nhom)       mảng ID đang đánh dấu
   ums.lhp.hoiChon({ title, cau, lua: [{ v, t }] })  → Promise<giá trị | null>
                                    (thay edu.system.confirm kèm nhóm nút radio)
   ums.lhp.hopPhamVi(idLop)         "Đã phân công" → Xem   — DKH_PhanCong_LopHP/LayDanhSach
   ums.lhp.hopSinhVien(idLop)       "Số sv đã đăng ký"    — DKH_PhanCong_LopHP/LayDSDangKyHoc
                                    + Lưu chế độ tính phí  — PKG_DANGKYHOC_THONGTIN2.CheDoTinhTienChoSVTheoLopHP
   ums.lhp.hopThuocTinh(lop, xong)  Thuộc tính phục vụ tính khối lượng
                                    — PKG_KLGV_V2_THONGTIN.Them_KLGD_PhanLoai_LopHp / Xoa_KLGD_PhanLoai_LopHp1
   ums.lhp.hopCheDo(lop, xong)      Thiết lập chế độ tính phí
                                    — PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_LopHp_CheDoPhi_Ins / _Del
   ums.lhp.hopHuyPhi(lop, xong)     Hủy phí tín chỉ — PKG_DANGKYHOC_THONGTIN2.ThucHienHuyPhiTinChiTheoLop
   ums.lhp.hopKhongDK(idKeHoach)    Danh sách không đăng ký — DKH_BaoCao/LayDSKhongDangKy
   ums.lhp.hopSVChonDon(idNguon)    Danh sách sinh viên chọn dồn — DKH_ThongTin2/LayDSDuLieuDonLop

   Khác bản gốc (đổi cách dựng, dữ liệu gửi đi giữ nguyên):
     · Lưu / xoá hàng loạt qua ums.ui.batch rồi nạp lại MỘT lần (gốc: mỗi lời gọi
       xong là nạp lại danh sách một lần).
     · Xoá nhiều dòng trong hộp = nút "Xoá đã chọn" ở CHÂN hộp (luật chung).
     · "Xuất Excel" danh sách không đăng ký: bản gốc tải xlsx-js-style từ ba CDN
       → nay ums.ui.xuatXls (bảng HTML đuôi .xls, không phụ thuộc CDN), đúng cột,
       đúng thứ tự, đúng dữ liệu đang lọc (toàn bộ, không chỉ trang đang xem).
     · Hộp phạm vi: bỏ cột ô đánh dấu (không nút nào dùng — nút Xoá đã bị chú
       thích ở bản gốc). Gốc gửi pageIndex = edu.system.pageIndex_default (trang
       đang xem của bảng NGOÀI) và pageSize 10 mà không có thanh phân trang →
       nay gửi trang 1, 1000000 dòng để thấy đủ phạm vi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var L = ums.lhp = ums.lhp || {};
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function iM() { return (ums.session && ums.session.iM) || ''; }
    function dang() { return ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
    function hoTen(r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); }

    /* ---------- Cột ô đánh dấu + "chọn tất cả" ---------------------------- */
    L.cotChon = function (nhom) {
        return {
            head: '<input type="checkbox" data-chon-all="' + nhom + '" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r) { return '<input type="checkbox" data-chon="' + nhom + '" value="' + esc(e(r.ID)) + '">'; }
        };
    };
    L.ganChon = function (root) {
        root.addEventListener('change', function (ev) {
            var t = ev.target;
            if (!t.matches) return;
            var bang = t.closest('table');
            if (!bang) return;
            if (t.matches('input[data-chon-all]')) {
                var nhom = t.getAttribute('data-chon-all');
                Array.prototype.forEach.call(bang.querySelectorAll('tbody input[data-chon="' + nhom + '"]'), function (x) {
                    if (!x.disabled) x.checked = t.checked;
                });
            } else if (t.matches('input[data-chon]')) {
                var n2 = t.getAttribute('data-chon'), h = bang.querySelector('thead input[data-chon-all="' + n2 + '"]');
                var all = bang.querySelectorAll('tbody input[data-chon="' + n2 + '"]');
                if (h) h.checked = all.length > 0 && Array.prototype.every.call(all, function (x) { return x.checked; });
            }
        });
    };
    L.idChon = function (root, nhom) {
        if (!root) return [];
        return Array.prototype.map.call(root.querySelectorAll('tbody input[data-chon="' + nhom + '"]:checked'), function (x) { return x.value; });
    };

    /* ---------- Hỏi lại kèm lựa chọn (radio) ------------------------------ */
    L.hoiChon = function (o) {
        return new Promise(function (resolve) {
            var xong = false;
            var d = ui.dialog({
                title: o.title || 'Xác nhận', icon: 'fa-circle-question', size: 'sm',
                body: '<p class="ums-u-mb-4">' + esc(o.cau || '') + '</p><div class="ums-checklist">' +
                    o.lua.map(function (x) {
                        return '<label class="ums-check"><input type="radio" name="lhpHoi" value="' + esc(x.v) + '"> ' + esc(x.t) + '</label>';
                    }).join('') + '</div>',
                buttons: [{ text: 'Đồng ý', kind: 'confirm', onClick: function (dlg) {
                    var c = dlg.body.querySelector('input[name="lhpHoi"]:checked');
                    if (!c) { ui.toast('Vui lòng chọn một lựa chọn', 'warn'); return false; }
                    xong = true; resolve(c.value);
                } }],
                onClose: function () { if (!xong) resolve(null); }
            });
            return d;
        });
    };

    /* ---------- Lọc ở máy trạm theo giá trị khác nhau của từng cột ----------
       (_populateFilters_* / _applyFilter_* của bản gốc — dùng ở hai hộp) */
    function locMay(host, cfg) {
        host.innerHTML =
            '<div class="ums-filter">' +
                '<div class="ums-field"><input class="ums-input" data-lm="q" placeholder="Tìm theo mã số / họ tên..." autocomplete="off"></div>' +
                cfg.o.map(function (x) {
                    return '<div class="ums-field"><select class="ums-select" data-lm="' + x.cot + '" data-ph="' + esc(x.ph) + '"><option value=""></option></select></div>';
                }).join('') +
                '<div class="ums-field ums-field--fit">' +
                    '<button type="button" class="ums-btn ums-btn--ghost" data-lm-xoa title="Xóa các bộ lọc"><i class="fa-light fa-eraser"></i><span>Xóa bộ lọc</span></button>' +
                '</div>' +
                '<div class="ums-field ums-field--fit"><span class="ums-u-muted ums-u-semi" data-lm-tong></span></div>' +
            '</div>';
        var raw = [], hen = null, im = false;
        function sel(c) { return host.querySelector('[data-lm="' + c + '"]'); }
        function khac(c) {
            var s = {};
            raw.forEach(function (r) { var v = r[c]; if (v !== null && v !== undefined && v !== '') s[v] = true; });
            return Object.keys(s).sort(function (a, b) { return a.localeCompare(b, 'vi'); }).map(function (v) { return { ID: v, TEN: v }; });
        }
        function loc() {
            var kw = (sel('q').value || '').trim().toLowerCase();
            var rs = raw.filter(function (r) {
                for (var i = 0; i < cfg.o.length; i++) {
                    var v = sel(cfg.o[i].cot).value;
                    if (v && e(r[cfg.o[i].cot]) !== v) return false;
                }
                if (kw) {
                    var ma = String(e(r.QLSV_NGUOIHOC_MASO)).toLowerCase();
                    var ten = (e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)).trim().toLowerCase();
                    if (ma.indexOf(kw) < 0 && ten.indexOf(kw) < 0) return false;
                }
                return true;
            });
            host.querySelector('[data-lm-tong]').textContent = rs.length ? 'Tổng: ' + rs.length + ' bản ghi' : 'Không có dữ liệu phù hợp';
            cfg.onDoi(rs);
        }
        sel('q').addEventListener('input', function () { clearTimeout(hen); hen = setTimeout(function () { if (raw) loc(); }, 250); });
        cfg.o.forEach(function (x) { jQuery(sel(x.cot)).on('change', function () { if (!im) loc(); }); });
        host.querySelector('[data-lm-xoa]').addEventListener('click', function () {
            im = true;
            sel('q').value = '';
            cfg.o.forEach(function (x) { sel(x.cot).value = ''; jQuery(sel(x.cot)).trigger('change.select2'); });
            im = false;
            loc();
        });
        return {
            nap: function (rows) {
                raw = arr(rows);
                im = true;
                sel('q').value = '';
                cfg.o.forEach(function (x) { sel(x.cot).value = ''; pat.fill(sel(x.cot), khac(x.cot), { head: x.ph }); sel(x.cot).value = ''; jQuery(sel(x.cot)).trigger('change.select2'); });
                im = false;
                loc();
            }
        };
    }

    /* ---------- Danh sách phạm vi (#myModalPhamVi) ------------------------- */
    L.hopPhamVi = function (idLop) {
        var d = ui.dialog({ title: 'Danh sách phạm vi', icon: 'fa-users-viewfinder', size: 'lg', body: '<div data-z="b">' + dang() + '</div>' });
        var z = d.body.querySelector('[data-z="b"]');
        ums.api.call({
            action: 'DKH_PhanCong_LopHP/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDangKy_KeHoachDangKy_Id: '', strDangKy_LopHocPhan_Id: idLop,
            strPhanCapApDung_Id: '', strPhamViApDung_Id: '', strNguoiThucHien_Id: uid(),
            pageIndex: 1, pageSize: 1000000
        }).then(function (r) {
            ui.table({ el: z, rows: arr(r.data), empty: 'Lớp chưa được phân công phạm vi', columns: [
                { title: 'Phạm vi', prop: 'PHAMVIAPDUNG_TEN' },
                { title: 'Phân cấp', prop: 'PHANCAPAPDUNG_TEN' }
            ] });
        }).catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phạm vi'); });
    };

    /* ---------- Danh sách sinh viên của lớp (#myModal) --------------------- */
    L.hopSinhVien = function (idLop) {
        var d = ui.dialog({
            title: 'Danh sách sinh viên', icon: 'fa-users-between-lines', size: 'xl',
            body: '<div class="ums-filter ums-u-mb-4">' +
                    '<div class="ums-field lhp-hop__cd"><select class="ums-select" data-f="cd" data-ph="Chọn chế độ tính phí"><option value=""></option></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Lưu chế độ tính phí cho sinh viên', attr: { 'data-a': 'luu' } }) + '</div>' +
                  '</div>' +
                  '<div data-z="loc" class="ums-u-mb-4"></div><div data-z="b">' + dang() + '</div>'
        });
        var b = d.body, z = b.querySelector('[data-z="b"]'), cd = b.querySelector('[data-f="cd"]');
        L.ganChon(b);
        ums.api.dm('DANGKY.NGUOIHOC.CHEDOTINHPHI').then(function (x) {
            pat.fill(cd, x, { head: pat.dmTitle(x) || 'Chọn chế độ tính phí' });
        }).catch(L.loi('chế độ tính phí'));

        var lm = locMay(b.querySelector('[data-z="loc"]'), {
            o: [
                { cot: 'QLSV_TRANGTHAINGUOIHOC_TEN', ph: '-- Tất cả tình trạng --' },
                { cot: 'DAOTAO_CHUONGTRINH_TEN', ph: '-- Tất cả chương trình --' },
                { cot: 'DAOTAO_LOPQUANLY_TEN', ph: '-- Tất cả lớp học --' },
                { cot: 'DAOTAO_KHOADAOTAO_TEN', ph: '-- Tất cả khóa học --' },
                { cot: 'KHOAQUANLY_TEN', ph: '-- Tất cả khoa quản lý --' },
                { cot: 'DAOTAO_HEDAOTAO_TEN', ph: '-- Tất cả hệ đào tạo --' }
            ],
            onDoi: function (rs) {
                ui.table({ el: z, rows: rs, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                    { title: 'Họ tên', cls: 'is-nowrap', render: hoTen },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
                    { title: 'Đã nộp', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.TONGSOTIENDANOP); } },
                    { title: 'Chế độ tính phí', prop: 'CHEDOTINHPHI_TEN' },
                    L.cotChon('sv')
                ] });
            }
        });
        function nap() {
            z.innerHTML = dang();
            ums.api.call({
                action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc', method: 'GET', type: 'GET',
                strTuKhoa: '', strDaoTao_LopHocPhan_Id: idLop, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { lm.nap(r.data); })
                .catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên của lớp'); });
        }
        nap();

        b.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-a="luu"]')) return;
            var ids = L.idChon(z, 'sv');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Lưu chế độ tính phí' }).then(function (ok) {
                if (!ok) return;
                var cheDo = pat.val(cd);
                ui.batch(ids.map(function (id) {
                    return {
                        action: 'DKH_ThongTin2_MH/AikkBS4VKC8pFSgkLwIpLhIXFSkkLg0uMQkR',
                        func: 'PKG_DANGKYHOC_THONGTIN2.CheDoTinhTienChoSVTheoLopHP',
                        iM: iM(), strDangKy_SinhVien_Lop_Id: id, strCheDoTinhPhi_Id: cheDo, strNguoiThucHien_Id: uid()
                    };
                }), { title: 'Đang lưu chế độ tính phí', okText: 'Thực hiện thành công' }).then(nap);
            });
        });
    };

    /* ---------- Bảng lớp đã chọn trong hộp (MALOP · TENLOP · LOAILOP …) ---- */
    function cotLop(them, chon) {
        var c = [
            { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
            { title: 'Tên lớp', prop: 'TENLOP' },
            { title: 'Loại lớp', prop: 'LOAILOP' }
        ].concat(them || []);
        return chon ? c.concat([L.cotChon(chon)]) : c;
    }

    /* ---------- Thuộc tính phục vụ tính khối lượng (#myModalThuocTinhKLGD) -- */
    L.hopThuocTinh = function (lop, xong) {
        var d = ui.dialog({
            title: 'Thuộc tính phục vụ tính khối lượng', icon: 'fa-scale-balanced', size: 'xl',
            body: '<div class="ums-filter ums-u-mb-4"><div class="ums-field lhp-hop__cd"><select class="ums-select" data-f="pl" data-ph="--Chọn thuộc tính--"><option value=""></option></select></div></div>' +
                  '<div data-z="b"></div>',
            xoa: { chon: 'input[data-chon="kl"]', text: 'Xóa', onClick: function () { chay(false); } },
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { chay(true); return false; } }]
        });
        var b = d.body, pl = b.querySelector('[data-f="pl"]');
        L.ganChon(b);
        ums.api.dm('KLGD.LOPHOCPHAN.PHANLOAI').then(function (x) { pat.fill(pl, x, { head: '--Chọn thuộc tính--' }); }).catch(L.loi('thuộc tính'));
        ui.table({ el: b.querySelector('[data-z="b"]'), rows: lop, columns: cotLop(null, 'kl') });

        function chay(luu) {
            var ids = L.idChon(b, 'kl');
            if (!ids.length) { ui.toast('Vui lòng chọn ít nhất một dòng?', 'warn'); return; }
            var p = pat.val(pl);
            if (!p) { ui.toast(luu ? 'Vui lòng chọn thuộc tính?' : 'Vui lòng chọn thuộc tính cần xóa?', 'warn'); return; }
            ui.confirm(luu ? 'Bạn có chắc chắn lưu thuộc tính cho ' + ids.length + ' lớp đã chọn?'
                : 'Bạn có chắc chắn xóa thuộc tính khỏi ' + ids.length + ' lớp đã chọn?', luu ? {} : { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
                if (!ok) return;
                ui.batch(ids.map(function (id) {
                    return luu ? {
                        action: 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHhEpIC8NLiAoHg0uMQkx', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_PhanLoai_LopHp',
                        iM: iM(), strDaoTao_LopHocPhan_Id: id, strPhanLoaiCachTinh_Id: p, strNguoiThucHien_Id: uid(),
                        strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
                    } : {
                        action: 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeESkgLw0uICgeDS4xCTFw', func: 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_PhanLoai_LopHp1',
                        iM: iM(), strDaoTao_LopHocPhan_Id: id, strPhanLoaiCachTinh_Id: p, strNguoiThucHien_Id: uid(),
                        strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
                    };
                }), { title: luu ? 'Đang lưu thuộc tính' : 'Đang xóa thuộc tính', okText: 'Thực hiện thành công' }).then(function () {
                    d.close(); if (xong) xong();
                });
            });
        }
    };

    /* ---------- Thiết lập chế độ tính phí cho lớp HP ------------------------ */
    L.hopCheDo = function (lop, xong) {
        var d = ui.dialog({
            title: 'Thiết lập chế độ tính phí', icon: 'fa-money-check-dollar', size: 'xl',
            body: '<div class="ums-filter ums-u-mb-4">' +
                    '<div class="ums-field lhp-hop__cd"><select class="ums-select" data-f="cd" data-ph="--Chọn chế độ tính phí--"><option value=""></option></select></div>' +
                    '<div class="ums-field lhp-hop__cd"><select class="ums-select" data-f="kh" data-ph="--Chọn kiểu học--"><option value=""></option></select></div>' +
                  '</div><div data-z="b"></div>',
            xoa: { chon: 'input[data-chon="cd"]', text: 'Xóa', onClick: function () { xoa(); } },
            buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function () { luu(); return false; } }]
        });
        var b = d.body, cd = b.querySelector('[data-f="cd"]'), kh = b.querySelector('[data-f="kh"]');
        L.ganChon(b);
        ums.api.dm('DANGKY.NGUOIHOC.CHEDOTINHPHI').then(function (x) { pat.fill(cd, x, { head: '--Chọn chế độ tính phí--' }); }).catch(L.loi('chế độ tính phí'));
        ums.api.dm('KHDT.DIEM.KIEUHOC').then(function (x) { pat.fill(kh, x, { head: '--Chọn kiểu học--' }); }).catch(L.loi('kiểu học'));
        ui.table({ el: b.querySelector('[data-z="b"]'), rows: lop, columns: cotLop([{ title: 'Chế độ hiện tại', prop: 'CHEDOTINHPHI_TEN' }], 'cd') });

        function xongLo() { d.close(); if (xong) xong(); }
        function luu() {
            var ids = L.idChon(b, 'cd');
            if (!ids.length) { ui.toast('Vui lòng chọn ít nhất một dòng?', 'warn'); return; }
            var c = pat.val(cd), k = pat.val(kh);
            if (!c) { ui.toast('Vui lòng chọn chế độ tính phí?', 'warn'); return; }
            if (!k) { ui.toast('Vui lòng chọn kiểu học?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu chế độ tính phí cho ' + ids.length + ' lớp đã chọn?').then(function (ok) {
                if (!ok) return;
                ui.batch(ids.map(function (id) {
                    return {
                        action: 'DKH_ThongTin2_MH/ETMeBSAvJgo4Hg0uMQkxHgIpJAUuESkoHggvMgPP', func: 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_LopHp_CheDoPhi_Ins',
                        iM: iM(), strDangKy_LopHocPhan_Id: id, strHieuLuc: '1', strCheDoTinhPhi_Id: c, strKieuHoc_Id: k,
                        strNguoiThucHien_Id: uid(), strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
                    };
                }), { title: 'Đang lưu chế độ tính phí', okText: 'Thực hiện thành công' }).then(xongLo);
            });
        }
        function xoa() {
            var ids = L.idChon(b, 'cd');
            if (!ids.length) { ui.toast('Vui lòng chọn ít nhất một dòng?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa chế độ tính phí khỏi ' + ids.length + ' lớp đã chọn?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
                if (!ok) return;
                /* Id bản ghi = CHEDOTINHPHI_ID của dòng lớp; lớp chưa có chế độ thì bỏ qua (như gốc) */
                var calls = ids.map(function (id) {
                    var r = lop.filter(function (x) { return x.ID == id; })[0];   // eslint-disable-line eqeqeq
                    return r && r.CHEDOTINHPHI_ID ? {
                        action: 'DKH_ThongTin2_MH/ETMeBSAvJgo4Hg0uMQkxHgIpJAUuESkoHgUkLQPP', func: 'PKG_DANGKYHOC_THONGTIN2.Pr_DangKy_LopHp_CheDoPhi_Del',
                        iM: iM(), strId: r.CHEDOTINHPHI_ID, strNguoiThucHien_Id: uid(),
                        strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
                    } : null;
                }).filter(Boolean);
                if (!calls.length) { ui.toast('Các lớp đã chọn chưa có chế độ tính phí để xóa', 'info'); return; }
                ui.batch(calls, { title: 'Đang xóa chế độ tính phí', okText: 'Thực hiện thành công' }).then(xongLo);
            });
        }
    };

    /* ---------- Hủy phí tín chỉ (#myModalHuyPhiTinChi) ---------------------- */
    L.hopHuyPhi = function (lop, xong) {
        var d = ui.dialog({
            title: 'Hủy phí tín chỉ', icon: 'fa-ban', size: 'xl', body: '<div data-z="b"></div>',
            buttons: [{ text: 'Hủy phí', kind: 'del', icon: 'fa-ban', keepOpen: true, onClick: function () { chay(); return false; } }]
        });
        ui.table({ el: d.body.querySelector('[data-z="b"]'), rows: lop, columns: cotLop() });
        function chay() {
            if (!lop.length) { ui.toast('Không có lớp nào để hủy phí?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn hủy phí tín chỉ cho ' + lop.length + ' lớp đã chọn?', { tone: 'bad', ok: 'Hủy phí' }).then(function (ok) {
                if (!ok) return;
                ui.batch(lop.map(function (r) {
                    return {
                        action: 'DKH_ThongTin2_MH/FSk0IgkoJC8JNDgRKSgVKC8CKSgVKSQuDS4x', func: 'PKG_DANGKYHOC_THONGTIN2.ThucHienHuyPhiTinChiTheoLop',
                        iM: iM(), strDaoTao_LopHocPhan_Id: r.ID, strNguoiThucHien_Id: uid(),
                        strVaiTroDangNhap_Id: '', strChucNangHeThong_Id: '', strHanhDong_Code: ''
                    };
                }), { title: 'Đang hủy phí tín chỉ', okText: 'Thực hiện thành công' }).then(function () { d.close(); if (xong) xong(); });
            });
        }
    };

    /* ---------- Danh sách không đăng ký (#myModal_khongdangky) -------------- */
    L.hopKhongDK = function (idKeHoach) {
        var rs = [], page = { index: 1, size: 10 };
        var d = ui.dialog({
            title: 'Danh sách không đăng ký', icon: 'fa-user-slash', size: 'xl',
            body: '<div data-z="loc" class="ums-u-mb-4"></div><div data-z="b">' + dang() + '</div>',
            buttons: [{ text: 'Xuất Excel', kind: 'excel', keepOpen: true, onClick: function () { xuat(); return false; } }]
        });
        var z = d.body.querySelector('[data-z="b"]');
        var cot = [
            { title: 'Mã số sinh viên', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN' },
            { title: 'Trạng thái', prop: 'QLSV_TRANGTHAI_TEN' },
            { title: 'Nợ phí', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.TONGNOPHI); } },
            { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
            { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' }
        ];
        function ve() {
            var n = rs.length, pages = Math.max(1, Math.ceil(n / page.size));
            if (page.index > pages) page.index = pages;
            var s = (page.index - 1) * page.size;
            ui.table({ el: z, rows: rs.slice(s, s + page.size), columns: cot, empty: 'Không có dữ liệu phù hợp',
                page: { index: page.index, size: page.size, total: n,
                    onChange: function (p) { page.index = p; ve(); },
                    onSize: function (v) { page.size = v; page.index = 1; ve(); } } });
        }
        var lm = locMay(d.body.querySelector('[data-z="loc"]'), {
            o: [
                { cot: 'QLSV_TRANGTHAI_TEN', ph: '-- Tất cả trạng thái --' },
                { cot: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', ph: '-- Tất cả chương trình --' },
                { cot: 'DAOTAO_LOPQUANLY_TEN', ph: '-- Tất cả lớp quản lý --' },
                { cot: 'DAOTAO_KHOADAOTAO_TEN', ph: '-- Tất cả khóa học --' }
            ],
            onDoi: function (x) { rs = x; page.index = 1; ve(); }
        });
        ums.api.call({ action: 'DKH_BaoCao/LayDSKhongDangKy', method: 'GET', type: 'GET',
            strDangKy_KeHoachDangKy_Id: idKeHoach, strNguoiThucHien_Id: uid() })
            .then(function (r) { lm.nap(r.data); })
            .catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách không đăng ký'); });

        function xuat() {
            if (!rs.length) { ui.toast('Không có dữ liệu để xuất.', 'warn'); return; }
            var t = new Date();
            function p2(n) { return n < 10 ? '0' + n : String(n); }
            ui.xuatXls('DSKhongDangKy_' + t.getFullYear() + p2(t.getMonth() + 1) + p2(t.getDate()) + '_' + p2(t.getHours()) + p2(t.getMinutes()) + '.xls', {
                cot: [{ title: 'STT', get: function (r, i) { return i + 1; } }].concat(cot.map(function (c) {
                    return { title: c.title, get: c.prop ? function (r) { return r[c.prop]; } : function (r) { return Number(r.TONGNOPHI) || 0; } };
                })),
                dong: rs
            });
        }
    };

    /* ---------- Danh sách sinh viên chọn dồn (#myModalNhom) ----------------- */
    L.hopSVChonDon = function (idNguon) {
        var d = ui.dialog({ title: 'Danh sách sinh viên chọn dồn', icon: 'fa-user-check', size: 'lg', body: '<div data-z="b">' + dang() + '</div>' });
        var z = d.body.querySelector('[data-z="b"]');
        ums.api.call({ action: 'DKH_ThongTin2/LayDSDuLieuDonLop', type: 'POST',
            strNguonDuLieu_Id: idNguon || '', strNguoiThucHien_Id: uid(), iM: iM() })
            .then(function (r) {
                ui.table({ el: z, rows: arr(r.data), empty: 'Chưa có sinh viên được xác nhận dồn lớp', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: hoTen },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' }
                ] });
            })
            .catch(function (err) { z.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên chọn dồn'); });
    };
})();
