/* =========================================================================
   Lớp học phần — ba KHUNG THAY CHỖ DANH SÁCH: Dồn lớp · Dồn nhóm lớp · Rút học phần
   Bản gốc: html/lophocphan.html (#zoneEdit, #zoneEditNhom, #zoneRutHocPhan)
            + script/lophocphan.js
   ---------------------------------------------------------------------------
   ums.lhp.donLop(zone, { lop, lopCungHP, dong() })      nút "Dồn lớp" trên dòng
       DKH_PhanCong_LopHP/LayDSDangKyHoc  GET  sinh viên của lớp (trái) / của lớp cuối (phải)
       DKH_DangKy/ThucHienDonLopDangKyHoc POST — mỗi SV đã chọn một lời gọi   ("Dồn lớp")
       DKH_DangKy/ThucHienHuyDangKyHocHocPhan POST                              ("Xóa")
       pkg_dangkyhoc_tructiep.ThucHienHuyDangKyHocLopChon                       ("Chỉ xóa đúng lớp chọn…")
   ums.lhp.donNhom(zone, { lop, dong() })                nút "Dồn nhóm" trên dòng
       DKH_ThongTin2/Them_DangKy_DonLop_LichSu   (iM) — mỗi SV một lời gọi, chung strNguonDuLieu_Id mới
       DKH_ThongTin2/LayThongTinChuanBiDonLop    (iM) → { rsLopBanDau, rsLopMoi }
       DKH_ThongTin2/LayDSLopMoiTheo             (iM) — mỗi lớp ban đầu một lời gọi ("Chọn lớp")
       DKH_ThongTin2/LayDSDuLieuDonLop           (iM) — hộp "Xem danh sách sinh viên cần dồn"
       DKH_TrucTiep/ThucHienDonLopDangKyHocNhom  (iM) — "Đồng ý"
   ums.lhp.rut(zone, { ds, dong(daChay) })               nút "Thực hiện rút học phần"
       PKG_DANGKYHOC_RUTHOCPHAN.ThucHienRut — mỗi dòng đã chọn một lời gọi

   Ô chọn CHA → CON:
     · "Chọn lớp cuối" → bảng sinh viên lớp cuối: xoá lớp cuối thì bảng về lời nhắc.
     · "Kiểm tra trùng lịch" (lớp cuối nhóm) → ô "Lớp mới" từng dòng: khoá ô lớp cuối
       tới khi đã "Xác nhận SV dồn lớp" (chưa có danh sách); đổi/xoá thì xoá trắng
       các ô "Lớp mới" (phải bấm "Chọn lớp" lại).

   Khác bản gốc:
     · Tiêu đề khung: gốc chép nhầm "Thêm mới - <tên lớp>" cho cả hai khung dồn → nay
       "Dồn lớp - …" / "Dồn nhóm lớp - …". Cột phải khung Dồn lớp gốc cũng ghi "Thông
       tin lớp học phần cần dồn" (trùng cột trái) → nay "Thông tin lớp cuối".
     · "Dồn lớp" khi chưa chọn lớp cuối: gốc vẫn gửi strDangKy_LopHocPhan_Moi_Ids rỗng
       → nay báo "Vui lòng chọn lớp cuối?".
     · Bấm nút Dồn lớp gốc gọi lại getList_LopHocPhan(strId) (truyền chuỗi vào chỗ
       tham số đối tượng → chỉ nạp lại trang đang xem, kết quả không dùng) → bỏ.
       Danh sách lớp cuối = các lớp CÙNG học phần trên trang đang xem (như gốc).
     · "Chọn lớp" / "Đồng ý" khi chưa "Xác nhận SV dồn lớp": gốc lỗi JS
       (dtDonNhomLop undefined) → nay báo. "Đồng ý" thiếu lớp mới: gốc im lặng → báo.
     · "Thực hiện rút": giữ nguyên — quay về danh sách ngay, chạy xong nạp lại bảng
       nguồn (Đăng ký chi tiết hoặc Rút đăng ký).
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
    function timId(ds, id) { return arr(ds).filter(function (r) { return String(r.ID) === String(id); })[0]; }

    /* DKH_PhanCong_LopHP/LayDSDangKyHoc — sinh viên đăng ký của một lớp */
    function dsDangKy(idLop) {
        return ums.api.call({
            action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc', method: 'GET', type: 'GET',
            strTuKhoa: '', strDaoTao_LopHocPhan_Id: idLop, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000
        }).then(function (r) { return arr(r.data); });
    }
    function cotSV(soDuKien) {
        var c = [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', cls: 'is-nowrap', render: hoTen },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Ngành', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', cls: 'lhp-vua' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' }
        ];
        if (soDuKien !== false) c.push({ title: 'Thời gian đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' });
        if (soDuKien) c.push({ title: 'Số dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' });
        return c;
    }
    function dauTrang(tieuDe, nut) {
        return pat.page(tieuDe, ui.btn('close', { attr: { 'data-a': 'dong' } }) + (nut || ''));
    }

    /* =====================================================================
       Dồn lớp (#zoneEdit)
       ===================================================================== */
    L.donLop = function (zone, o) {
        var lop = o.lop, dsSV = [], daDon = [];
        zone.innerHTML = dauTrang('Dồn lớp - ' + e(lop.TENLOP),
                ui.btn('save', { text: 'Dồn lớp', icon: 'fa-people-arrows', mod: 'primary', attr: { 'data-a': 'don' } })) +
            '<div class="ums-grid ums-grid--2 lhp-cols">' +
                pat.panel({ title: 'Thông tin lớp học phần cần dồn', icon: 'fa-users', flush: true, zone: 'sv', cls: 'lhp-quan',
                    tools: ui.xoaChon('input[data-chon="dl"]', { goc: '.ums-panel', text: 'Chỉ xóa đúng lớp chọn khi tồn tại ở 2 lớp cùng nhóm', attr: { 'data-a': 'xoachon' } }) +
                        ui.xoaChon('input[data-chon="dl"]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) }) +
                pat.panel({ title: 'Thông tin lớp cuối', icon: 'fa-users-rectangle', flush: true,
                    body: '<div class="lhp-pad"><div class="ums-field ums-u-mb-0"><select class="ums-select" data-f="cuoi" data-ph="--Chọn lớp cuối--"><option value=""></option></select></div></div>' +
                        '<div data-z="kq"></div>' }) +
            '</div>';
        var zSV = zone.querySelector('[data-z="sv"]'), zKQ = zone.querySelector('[data-z="kq"]'), cuoi = zone.querySelector('[data-f="cuoi"]');
        L.ganChon(zone);
        pat.fill(cuoi, arr(o.lopCungHP), { name: 'TENLOP', head: '--Chọn lớp cuối--' });
        ui.enhance(zone);

        function napSV() {
            zSV.innerHTML = dang();
            return dsDangKy(lop.ID).then(function (d) {
                dsSV = d;
                ui.table({ el: zSV, rows: d, columns: cotSV(true).concat([L.cotChon('dl')]), empty: 'Lớp chưa có sinh viên đăng ký' });
            }).catch(function (err) { zSV.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của lớp'); });
        }
        function napKQ() {
            var id = pat.val(cuoi);
            if (!id) { zKQ.innerHTML = ui.empty('Chọn lớp cuối để xem sinh viên của lớp đó', 'fa-hand-pointer'); return Promise.resolve(); }
            zKQ.innerHTML = dang();
            return dsDangKy(id).then(function (d) {
                ui.table({ el: zKQ, rows: d, columns: cotSV(), empty: 'Lớp cuối chưa có sinh viên',
                    rowCls: function (r) { return daDon.indexOf(String(r.ID)) >= 0 ? 'lhp-moi' : ''; } });
            }).catch(function (err) { zKQ.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên lớp cuối'); });
        }
        jQuery(cuoi).on('select2:select select2:clear', napKQ);
        napSV(); napKQ();

        function chon() {
            var ids = L.idChon(zSV, 'dl');
            if (!ids.length) ui.toast('Vui lòng chọn đối tượng?', 'warn');
            return ids;
        }
        function chay(ids, mk, tieuDe) {
            daDon = ids.map(String);
            return ui.batch(ids.map(function (id) { return mk(timId(dsSV, id)); }), { title: tieuDe, okText: 'Thành công' })
                .then(function () { napSV(); napKQ(); });
        }
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            var a = b.getAttribute('data-a'), ids;
            if (a === 'dong') return o.dong();
            if (a === 'don') {
                ids = chon(); if (!ids.length) return;
                if (!pat.val(cuoi)) { ui.toast('Vui lòng chọn lớp cuối?', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Dồn lớp' }).then(function (ok) {
                    if (!ok) return;
                    var moi = pat.val(cuoi);
                    chay(ids, function (r) {
                        return { action: 'DKH_DangKy/ThucHienDonLopDangKyHoc', type: 'POST',
                            strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                            strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strDangKy_LopHocPhan_Cu_Ids: r.DANGKY_LOPHOCPHAN_ID,
                            strDangKy_LopHocPhan_Moi_Ids: moi, strNguoiThucHien_Id: uid() };
                    }, 'Đang dồn lớp');
                });
            } else if (a === 'xoa' || a === 'xoachon') {
                ids = chon(); if (!ids.length) return;
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
                    if (!ok) return;
                    chay(ids, a === 'xoa' ? function (r) {
                        return { action: 'DKH_DangKy/ThucHienHuyDangKyHocHocPhan', type: 'POST',
                            strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                            strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid(),
                            strDangKy_KeHoachDangKy_Id: r.DANGKY_KEHOACHDANGKY_ID };
                    } : function (r) {
                        return { action: 'DKH_TrucTiep_MH/FSk0IgkoJC8JNDgFIC8mCjgJLiINLjECKS4v', func: 'pkg_dangkyhoc_tructiep.ThucHienHuyDangKyHocLopChon',
                            iM: iM(), strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                            strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID, strNguoiThucHien_Id: uid(),
                            strDangKy_KeHoachDangKy_Id: r.DANGKY_KEHOACHDANGKY_ID, strDangKy_LopHocPhan_Chon_Id: lop.ID };
                    }, 'Đang xóa đăng ký');
                });
            }
        });
    };

    /* =====================================================================
       Dồn nhóm lớp (#zoneEditNhom)
       ===================================================================== */
    L.donNhom = function (zone, o) {
        var lop = o.lop, dsSV = [], tt = null, nguon = '';
        zone.innerHTML = dauTrang('Dồn nhóm lớp - ' + e(lop.TENLOP)) +
            '<div class="ums-grid ums-grid--2 lhp-cols">' +
                pat.panel({ title: 'Thông tin lớp học phần cần dồn', icon: 'fa-users', flush: true, zone: 'sv',
                    tools: ui.btn('confirm', { text: 'Xác nhận SV dồn lớp', attr: { 'data-a': 'xacnhan' } }) }) +
                pat.panel({ title: 'Thông tin dồn lớp', icon: 'fa-people-arrows', flush: true,
                    tools: ui.btn('search', { text: 'Xem danh sách sinh viên cần dồn', mod: 'out-primary', attr: { 'data-a': 'dssv' } }),
                    body: '<div class="lhp-pad"><div class="ums-filter">' +
                            '<div class="ums-field"><label class="ums-label">Kiểm tra trùng lịch</label>' +
                                '<select class="ums-select" data-f="cuoi" data-ph="--Chọn lớp cuối--" disabled><option value=""></option></select></div>' +
                            '<div class="ums-field ums-field--fit">' +
                                ui.btn('add', { text: 'Chọn lớp', icon: 'fa-screen-users', mod: 'out-success', attr: { 'data-a': 'chonlop' } }) + '</div>' +
                          '</div></div><div data-z="tt"></div>',
                    foot: '<div class="lhp-foot">' + ui.btn('confirm', { text: 'Đồng ý', attr: { 'data-a': 'dongy' } }) + '</div>' }) +
            '</div>';
        var zSV = zone.querySelector('[data-z="sv"]'), zTT = zone.querySelector('[data-z="tt"]'), cuoi = zone.querySelector('[data-f="cuoi"]');
        L.ganChon(zone);
        ui.enhance(zone);
        zTT.innerHTML = ui.empty('Chọn sinh viên bên trái rồi bấm "Xác nhận SV dồn lớp"', 'fa-hand-pointer');

        zSV.innerHTML = dang();
        dsDangKy(lop.ID).then(function (d) {
            dsSV = d;
            ui.table({ el: zSV, rows: d, columns: cotSV(false).concat([L.cotChon('svn')]), empty: 'Lớp chưa có sinh viên đăng ký' });
        }).catch(function (err) { zSV.innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên của lớp'); });

        function veTT() {
            ui.table({ el: zTT, rows: arr(tt.rsLopBanDau), empty: 'Không có lớp ban đầu', columns: [
                { title: 'Lớp ban đầu', prop: 'TENLOP' },
                { title: 'Thuộc tính', prop: 'HINHTHUC_TEN' },
                { title: 'Lớp mới', cls: 'lhp-vua', render: function (r) {
                    return '<select class="ums-select ums-input--sm" data-moi="' + esc(e(r.ID)) + '"><option value="">Chọn lớp</option></select>';
                } }
            ] });
            pat.fill(cuoi, arr(tt.rsLopMoi), { name: 'TENLOP', head: '--Chọn lớp cuối--' });
            cuoi.disabled = false;
            jQuery(cuoi).trigger('change.select2');
        }
        function napTT() {
            zTT.innerHTML = dang();
            return ums.api.call({ action: 'DKH_ThongTin2/LayThongTinChuanBiDonLop', type: 'POST',
                strNguonDuLieu_Id: nguon, strNguoiThucHien_Id: uid(), iM: iM() })
                .then(function (r) { tt = r.data || {}; veTT(); })
                .catch(function (err) { zTT.innerHTML = ui.fail(err.message); ums.api.handle(err, 'thông tin chuẩn bị dồn lớp'); });
        }
        function oMoi(id) { return zTT.querySelector('select[data-moi="' + id + '"]'); }
        /* Đổi / xoá lớp cuối → xoá trắng các ô "Lớp mới" (phải "Chọn lớp" lại) */
        jQuery(cuoi).on('select2:select select2:clear', function () {
            Array.prototype.forEach.call(zTT.querySelectorAll('select[data-moi]'), function (s) {
                s.innerHTML = '<option value="">Chọn lớp</option>';
            });
        });

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            var a = b.getAttribute('data-a');
            if (a === 'dong') return o.dong();
            if (a === 'dssv') return L.hopSVChonDon(nguon);
            if (a === 'xacnhan') {
                var ids = L.idChon(zSV, 'svn');
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                nguon = ums.util.uuid();
                ui.batch(ids.map(function (id) {
                    var r = timId(dsSV, id);
                    return { action: 'DKH_ThongTin2/Them_DangKy_DonLop_LichSu', type: 'POST',
                        strDangKy_LopHocPhan_Id: r.DANGKY_LOPHOCPHAN_ID, strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID,
                        strDaoTao_ChuongTrinh_Id: r.DAOTAO_TOCHUCCHUONGTRINH_ID, strNguonDuLieu_Id: nguon,
                        strNguoiThucHien_Id: uid(), iM: iM() };
                }), { title: 'Đang xác nhận sinh viên dồn lớp', okText: 'Thực hiện thành công' }).then(napTT);
                return;
            }
            if (!tt) { ui.toast('Chưa có thông tin dồn lớp — hãy chọn sinh viên và bấm "Xác nhận SV dồn lớp" trước', 'warn'); return; }
            if (a === 'chonlop') {
                var moiId = pat.val(cuoi);
                if (!moiId) { ui.toast('Vui lòng chọn lớp cuối?', 'warn'); return; }
                arr(tt.rsLopBanDau).forEach(function (r) {
                    ums.api.call({ action: 'DKH_ThongTin2/LayDSLopMoiTheo', type: 'POST',
                        strDangKy_LopHocPhan_Moi_Id: moiId, strIdHinhThucHoc: r.IDHINHTHUCHOC, strNguoiThucHien_Id: uid(), iM: iM() })
                        .then(function (x) {
                            var s = oMoi(r.ID);
                            if (!s) return;
                            var d = arr(x.data);
                            // selectFirst: true của bản gốc → chọn sẵn lớp đầu tiên
                            s.innerHTML = '<option value="">Chọn lớp</option>' + d.map(function (m, i) {
                                return '<option value="' + esc(e(m.ID)) + '"' + (i === 0 ? ' selected' : '') + '>' + esc(e(m.TENLOP)) + '</option>';
                            }).join('');
                        }).catch(L.loi('lớp mới theo hình thức học'));
                });
            } else if (a === 'dongy') {
                var cu = [], moi = [], du = true;
                arr(tt.rsLopBanDau).forEach(function (r) {
                    var s = oMoi(r.ID), v = s ? s.value : '';
                    if (!v) du = false; else { cu.push(r.ID); moi.push(v); }
                });
                if (!du) { ui.toast('Vui lòng chọn lớp mới cho mọi lớp ban đầu', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn lưu dữ liệu không?', { title: 'Dồn nhóm lớp' }).then(function (ok) {
                    if (!ok) return;
                    ums.api.call({ action: 'DKH_TrucTiep/ThucHienDonLopDangKyHocNhom', type: 'POST',
                        strNguonDuLieu_Id: nguon, strDangKy_LopHocPhan_Cu_Ids: cu.toString(), strDangKy_LopHocPhan_Moi_Ids: moi.toString(),
                        strNguoiThucHien_Id: uid(), iM: iM() })
                        .then(function () { ui.toast('Thực hiện thành công', 'ok'); })
                        .catch(L.loi('dồn nhóm lớp'));
                });
            }
        });
    };

    /* =====================================================================
       Thực hiện rút học phần (#zoneRutHocPhan)
       ===================================================================== */
    L.rut = function (zone, o) {
        var ds = arr(o.ds);
        zone.innerHTML = dauTrang('Thực hiện rút học phần (' + ds.length + ')',
                ui.btn('confirm', { text: 'Thực hiện rút', mod: 'warn', attr: { 'data-a': 'rut' } })) +
            pat.panel({ title: 'Danh sách rút', icon: 'fa-arrow-right-from-bracket', flush: true,
                body: '<div class="lhp-pad">' +
                        '<div class="ums-field"><input class="ums-input" data-f="mota" placeholder="Mô tả áp dụng cho mọi dòng (ví dụ: Sinh viên rút theo đơn ngày ...)" autocomplete="off"></div>' +
                        '<div class="lhp-dien ums-u-mt-3">' +
                            '<span class="ums-u-semi"><i class="fa-light fa-fill-drip"></i> Điền % Mức phí hàng loạt:</span>' +
                            '<input class="ums-input lhp-dien__o" data-f="pt" type="number" min="0" max="100" step="0.01" placeholder="VD: 50">' +
                            ui.btn('add', { text: 'Áp dụng cho tất cả', icon: 'fa-list', mod: 'out-primary', attr: { 'data-a': 'dienall', title: 'Điền cho mọi dòng trong bảng' } }) +
                            ui.btn('add', { text: 'Áp dụng cho dòng đã chọn', icon: 'fa-check-double', mod: 'out-primary', attr: { 'data-a': 'dienchon', title: 'Chỉ điền cho các dòng đã tick' } }) +
                        '</div>' +
                      '</div><div data-z="b"></div>' });
        var zB = zone.querySelector('[data-z="b"]');
        L.ganChon(zone);
        ui.table({ el: zB, rows: ds, empty: 'Không có dòng nào', columns: [
            { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Học phần', render: function (r) { return esc(L.tenMa(r.DAOTAO_HOCPHAN_TEN, r.DAOTAO_HOCPHAN_MA)); } },
            { title: '% Mức phí', cls: 'is-center', width: '150px', render: function (r) {
                return '<input class="ums-input ums-input--sm" type="number" min="0" max="100" step="0.01" value="0" data-pt="' + esc(e(r.ID)) + '">';
            } },
            L.cotChon('rhp')
        ] });
        function pt(id) { return zB.querySelector('input[data-pt="' + id + '"]'); }
        function giaTri() {
            var raw = zone.querySelector('[data-f="pt"]').value;
            if (raw === '' || raw === null) { ui.toast('Vui lòng nhập giá trị % cần điền.', 'warn'); return null; }
            var v = parseFloat(raw);
            if (isNaN(v) || v < 0 || v > 100) { ui.toast('Giá trị % phải trong khoảng 0 - 100.', 'warn'); return null; }
            return v;
        }
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            var a = b.getAttribute('data-a'), v, ids;
            if (a === 'dong') return o.dong(false);
            if (a === 'dienall') {
                v = giaTri(); if (v === null) return;
                Array.prototype.forEach.call(zB.querySelectorAll('input[data-pt]'), function (x) { x.value = v; });
            } else if (a === 'dienchon') {
                v = giaTri(); if (v === null) return;
                ids = L.idChon(zB, 'rhp');
                if (!ids.length) { ui.toast("Chưa có dòng nào được tick ở cột 'Chọn'.", 'warn'); return; }
                ids.forEach(function (id) { if (pt(id)) pt(id).value = v; });
            } else if (a === 'rut') {
                ids = L.idChon(zB, 'rhp');
                if (!ids.length) { ui.toast('Vui lòng chọn ít nhất một dòng?', 'warn'); return; }
                var moTa = zone.querySelector('[data-f="mota"]').value || '';
                ui.confirm('Thực hiện rút học phần cho ' + ids.length + ' dòng đã chọn?', { title: 'Thực hiện rút học phần' }).then(function (ok) {
                    if (!ok) return;
                    var calls = ids.map(function (id) {
                        var r = timId(ds, id);
                        var raw = pt(id) ? pt(id).value : '';
                        var p = parseFloat(raw === null || raw === '' ? '0' : raw);
                        if (isNaN(p)) p = 0;
                        return {
                            action: 'DKH_RutHocPhan_MH/FSk0IgkoJC8TNDUP', func: 'PKG_DANGKYHOC_RUTHOCPHAN.ThucHienRut', iM: iM(),
                            strDangKy_KeHoachDangKy_Id: r.DANGKY_KEHOACHDANGKY_ID, strDaoTao_HocPhan_Id: r.DAOTAO_HOCPHAN_ID,
                            strQLSV_NguoiHoc_Id: r.QLSV_NGUOIHOC_ID, strDaoTao_ThoiGianDaoTao_Id: r.DAOTAO_THOIGIANDAOTAO_ID,
                            dPhanTramTinhPhi: p, strMoTa: moTa, strNguoiThucHien_Id: uid()
                        };
                    });
                    o.dong(false);
                    ui.batch(calls, { title: 'Đang thực hiện rút học phần', okText: 'Thực hiện thành công' }).then(function () { o.dong(true); });
                });
            }
        });
    };
})();
