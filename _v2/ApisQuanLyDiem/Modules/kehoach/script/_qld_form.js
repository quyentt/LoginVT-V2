/* =========================================================================
   Kế hoạch công nhận điểm — vùng "Thêm mới / Sửa kế hoạch" (#zoneEdit của gốc)
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/script/kehoach.js
       rewrite · viewEdit_KeHoachXuLy · save_KeHoachXuLy
       getList_SinhVien · save_SinhVien · delete_SinhVien · genTable_SinhVien · addHTMLinto_SinhVien
       nút .btnSearchDTSV_SinhVien (edu.extend.genModal_SinhVien) + #btnAdd_Khoa / _ChuongTrinh / _Lop
   ---------------------------------------------------------------------------
   ums.qldKh.taoForm(zone, { onClose, onSaved }) → { moThem(), moSua(dòng) }

   Lời gọi (chép nguyên):
     SV_CongNhanDiem_MH/FSkkLB4FKCQsHgokCS4gIikCLi8mDykgLwUoJCwP
         PKG_CONGTHONGTIN_CONGNHANDIEM.Them_Diem_KeHoachCongNhanDiem   (strId rỗng)
     SV_CongNhanDiem_MH/EjQgHgUoJCweCiQJLiAiKQIuLyYPKSAvBSgkLAPP
         PKG_CONGTHONGTIN_CONGNHANDIEM.Sua_Diem_KeHoachCongNhanDiem    (strId = ID)
         strTenKeHoach · strMaKeHoach · strTuNgay · strDenNgay · dHieuLuc · strMoHinhDangKy_Id · strHanInDon
     SV_CongNhanDiem/LayDSKeHoachCongNhan_PhamVi   GET  strDiem_KeHoachCongNhan_Id
     SV_CongNhanDiem/Them_KeHoachCongNhan_PhamVi   POST strDiem_KeHoachCongNhan_Id · strPhamViApDung_Id
         (sinh viên: QLSV_NGUOIHOC_ID của dòng chọn, không có thì ID; nhóm: ID khoá / CT / lớp)
     SV_CongNhanDiem/Xoa_KeHoachCongNhan_PhamVi    strId = ID dòng phạm vi (mỗi dòng một lời gọi)
     Import "1. Phạm vi": IMPORTWITHPROC_DKHPV (btnImportWithProce → ums.report.importChung)
   Danh mục: DIEM.CONGNHANDIEM.MOHINH (ô Mô hình).

   Hộp chọn sinh viên: edu.extend.genModal_SinhVien của Corei (vỏ indexi) — nguồn
   SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc → ums.pat.pickSinhVien bản đầy đủ với call
   riêng (như XLHV kehoachxuly). KHÔNG dùng ums.pat.phamVi: khối đó cứng hộp pickSinhVienNganh
   (LayDanhSachHoSoNhieuNganh — bản của vỏ index / Core), khác nguồn của màn này (ghi nợ tầng chung).
   "Thêm từng khóa / chương trình / lớp" như gốc (gốc chỉ nghe ba nút này — không có "Thêm từng hệ").

   Cố ý bỏ (mã chết của gốc):
     · Ảnh minh hoạ cột phải (Upload/images/img-kehoach_1.png, col-md-5) — chỉ là hình trang trí,
       biểu mẫu nay chiếm cả chiều ngang.
     · arrValid (kiểm ô txtKeHoachXuLy_So không tồn tại → validInputForm không kiểm gì): không kiểm ô nào, như gốc.
     · genModal_SinhVien / getList_SinhVienMD / genModal_SinhVienKeHoach / DKH… riêng của màn, các
       getList_HeDaoTao… cbGenCombo_* đổ vào ô không có trên màn, bảng #tblInputDanhSachNhanSu /
       #tblInputHocPhan và hộp #myModalHocPhan (không nút nào mở), save_Lop / save_ChuongTrinh /
       save_Khoa (TN_KeHoach_PhamVi/* — chép từ màn tốt nghiệp, không nơi nào gọi),
       getList_DoiTuong (biến strTN_KeHoach_Id không tồn tại), getList_PhanCong bản đầu
       (TN_KeHoach_NhanSu — bị bản sau cùng tên ghi đè).
   Khác gốc (sửa lỗi):
     · Lưu kế hoạch MỚI xong gốc vẫn giữ strKeHoachXuLy_Id rỗng → bấm Lưu lần hai là THÊM TRÙNG, và
       các dòng phạm vi "new" vẫn mang dấu new → lưu lại là thêm trùng phạm vi. Ở đây nhớ ID máy chủ trả,
       đổi tiêu đề sang "Sửa", lưu phạm vi xong nạp lại bảng phạm vi (dòng mới thành dòng đã lưu).
     · Thêm phạm vi / xoá phạm vi chạy qua ums.ui.batch (gốc: một thông báo mỗi lời gọi).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var Q = ums.qldKh, K = Q.K, e = Q.e;

    Q.taoForm = function (zone, o) {
        o = o || {};
        var khId = '', saved = [], moi = [], nhom = {};
        var NHAN = { khoa: 'Áp dụng cho khóa', ct: 'Áp dụng cho chương trình', lop: 'Áp dụng cho lớp' };

        function inp(k, date) {
            return '<input class="ums-input" data-k="' + k + '" data-scope="form" autocomplete="off"' +
                (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>';
        }
        function sel(k, ph, opts, req) {
            return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph) + '"' + (req ? ' data-required' : '') + '>' +
                (opts || '<option value="">' + esc(ph) + '</option>') + '</select>';
        }

        zone.innerHTML =
            pat.panel({
                title: 'Thêm mới - Kế hoạch', icon: 'fa-plus', cls: 'qldkh-form',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="ums-legend">Thông tin kế hoạch</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        '<div style="grid-column:1 / -1">' + ui.field('Tên kế hoạch', inp('ten')) + '</div>' +
                        ui.field('Mã kế hoạch', inp('ma')) +
                        ui.field('Mô hình', sel('mh', 'Chọn mô hình')) +
                        ui.field('Hiệu lực', sel('hl', 'Hiệu lực', '<option value="1">Hiệu lực</option><option value="0">Hết hiệu lực</option>', true)) +
                        ui.field('Từ ngày', inp('tu', true)) +
                        ui.field('Đến ngày', inp('den', true)) +
                        ui.field('Hạn in đơn', inp('han')) +
                    '</div>'
            }) +
            pat.panel({
                title: 'Phạm vi áp dụng', icon: 'fa-users-viewfinder', count: 'pvn', flush: true, zone: 'pv', cls: 'qldkh-pv',
                tools: ui.btn('importer', { attr: { 'data-a': 'pv-import' } }) +
                    ui.xoaChon('input[data-pvq]', { sm: true, goc: '.qldkh-pv', attr: { 'data-a': 'pv-xoa' } }) +
                    ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-a': 'pv-them' } }),
                foot: '<div class="ums-u-fz13 ums-u-muted" data-z="nhom"></div>'
            });

        function k(x) { return zone.querySelector('[data-k="' + x + '"]'); }
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        ui.enhance(zone);
        K.ganChon(zone);

        ums.api.dm('DIEM.CONGNHANDIEM.MOHINH')
            .then(function (ds) { Q.chon(k('mh'), ds, 'Chọn mô hình'); })
            .catch(function (err) { ums.api.handle(err, 'mô hình'); });

        function tieuDe(sua) {
            zone.querySelector('.qldkh-form .ums-panel__title').innerHTML =
                '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Sửa' : 'Thêm mới') + ' - Kế hoạch';
        }

        /* ---------- Phạm vi áp dụng ------------------------------------------ */
        function vePV() {
            var rows = saved.map(function (r) { return { r: r }; }).concat(moi.map(function (m) { return { m: m }; }));
            z('pvn').textContent = '(' + rows.length + ')';
            ui.table({
                el: z('pv'), rows: rows, empty: 'Chưa có phạm vi áp dụng',
                columns: [
                    { title: 'Phạm vi', render: function (x) {
                        return x.r ? esc(e(x.r.PHAMVIAPDUNG_TEN)) : esc(x.m.ten) + ' ' + ui.badge('chưa lưu', 'warn');
                    } },
                    { head: '<input type="checkbox" data-all="pvq" title="Chọn tất cả">', cls: 'is-center', width: '56px', render: function (x, i) {
                        return x.r ? '<input type="checkbox" data-pvq="' + esc(x.r.ID) + '">'
                            : '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="pv-bo" data-id="' + esc(x.m.id) + '" title="Bỏ dòng chưa lưu"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
            z('nhom').innerHTML = Object.keys(nhom).filter(function (x) { return nhom[x].ids.length; }).map(function (x) {
                return '<div>' + esc(NHAN[x]) + ': <b>' + esc(nhom[x].names.join(', ')) + '</b></div>';
            }).join('');
        }
        function taiPV() {
            moi = []; nhom = {};
            if (!khId) { saved = []; vePV(); return Promise.resolve(); }
            K.dang(z('pv'));
            return ums.api.call({
                action: 'SV_CongNhanDiem/LayDSKeHoachCongNhan_PhamVi', method: 'GET', type: 'GET',
                strDiem_KeHoachCongNhan_Id: khId, strNguoiThucHien_Id: ''
            }).then(function (r) { saved = K.ds(r); vePV(); })
              .catch(function (err) { saved = []; vePV(); ums.api.handle(err, 'phạm vi áp dụng'); });
        }
        function themPV() {
            var dlg = pat.pickSinhVien({
                filters: true,
                status: function (el) { return pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3, what: 'trạng thái sinh viên' }); },
                call: function (p, page, size) {
                    return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                        strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                        strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                        strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                        strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
                },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc(K.hoTen(r)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
                ],
                group: { khoa: nhomFn('khoa'), chuongTrinh: nhomFn('ct'), lop: nhomFn('lop') },
                onPick: function (rows) {
                    var trung = 0;
                    rows.forEach(function (s) {
                        var id = s.QLSV_NGUOIHOC_ID || s.ID;
                        var co = moi.some(function (m) { return m.id === id; }) ||
                            saved.some(function (r) { return r.PHAMVIAPDUNG_ID === id || r.QLSV_NGUOIHOC_ID === id; });
                        if (co) { trung++; return; }
                        moi.push({ id: id, ten: K.hoTen(s) });
                    });
                    if (trung) ui.toast('Đã tồn tại: ' + trung + ' sinh viên', 'warn');
                    vePV();
                }
            });
            return dlg;
        }
        function nhomFn(kind) {
            return function (ids, params, dlg) {
                var arr = ids ? String(ids).split(',') : [];
                if (!arr.length) return;
                var s = dlg.body.querySelector('[data-f="' + kind + '"]');
                var names = s ? Array.prototype.filter.call(s.options, function (x) { return x.selected && x.value; }).map(function (x) { return x.text; }) : [];
                nhom[kind] = { ids: arr, names: names };
                ui.toast(NHAN[kind] + ': ' + names.join(', '), 'ok');
                dlg.close();
                vePV();
            };
        }
        function xoaPV() {
            var ids = K.daChon(z('pv'), 'pvq');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: 'SV_CongNhanDiem/Xoa_KeHoachCongNhan_PhamVi', strId: id, strNguoiThucHien_Id: '' };
            }), taiPV);
        }
        function luuPV(id) {
            var ids = moi.map(function (m) { return m.id; });
            ['khoa', 'ct', 'lop'].forEach(function (x) { if (nhom[x]) ids = ids.concat(nhom[x].ids); });
            if (!ids.length || !id) return Promise.resolve();
            return ui.batch(ids.map(function (pv) {
                return { action: 'SV_CongNhanDiem/Them_KeHoachCongNhan_PhamVi', type: 'POST', method: 'POST',
                    strDiem_KeHoachCongNhan_Id: id, strPhamViApDung_Id: pv, strNguoiThucHien_Id: '' };
            }), { title: 'Đang thêm phạm vi áp dụng', okText: 'Thêm thành công!' });
        }

        /* ---------- Lưu kế hoạch -------------------------------------------- */
        function luu() {
            var c = {
                action: Q.CN + 'FSkkLB4FKCQsHgokCS4gIikCLi8mDykgLwUoJCwP',
                func: 'PKG_CONGTHONGTIN_CONGNHANDIEM.Them_Diem_KeHoachCongNhanDiem',
                strId: khId,
                strTenKeHoach: k('ten').value, strMaKeHoach: k('ma').value,
                strTuNgay: k('tu').value, strDenNgay: k('den').value,
                dHieuLuc: k('hl').value, strMoHinhDangKy_Id: k('mh').value,
                strHanInDon: k('han').value, strNguoiThucHien_Id: ''
            };
            if (c.strId) {
                c.action = Q.CN + 'EjQgHgUoJCweCiQJLiAiKQIuLyYPKSAvBSgkLAPP';
                c.func = 'PKG_CONGTHONGTIN_CONGNHANDIEM.Sua_Diem_KeHoachCongNhanDiem';
            }
            var btn = zone.querySelector('[data-a="luu"]');
            btn.disabled = true;
            ums.api.call(c).then(function (r) {
                var laMoi = c.strId === '';
                ui.toast(laMoi ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
                var id = laMoi ? ((r.raw && r.raw.Id) || '') : c.strId;
                return luuPV(id).then(function () {
                    if (id) { khId = id; tieuDe(true); return taiPV(); }
                });
            }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch'); })
              .then(function () { btn.disabled = false; if (o.onSaved) o.onSaved(); });
        }

        /* ---------- Sự kiện ------------------------------------------------- */
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu': luu(); break;
                case 'pv-them': themPV(); break;
                case 'pv-xoa': xoaPV(); break;
                case 'pv-bo':
                    var id = b.getAttribute('data-id');
                    moi = moi.filter(function (m) { return m.id !== id; });
                    vePV();
                    break;
                case 'pv-import': ums.report.importChung('Phạm vi', 'IMPORTWITHPROC_DKHPV', { onDone: taiPV }); break;
            }
        });

        return {
            moThem: function () {
                khId = '';
                ['ten', 'ma', 'mh', 'tu', 'den', 'han'].forEach(function (x) { Q.datGiaTri(k(x), ''); });
                Q.datGiaTri(k('hl'), 1);
                tieuDe(false);
                taiPV();
            },
            moSua: function (d) {
                khId = d.ID;
                Q.datGiaTri(k('ma'), d.MAKEHOACH);
                Q.datGiaTri(k('ten'), d.TENKEHOACH);
                Q.datGiaTri(k('mh'), d.MOHINHDANGKY_ID);
                Q.datGiaTri(k('hl'), d.HIEULUC);
                Q.datGiaTri(k('tu'), d.TUNGAY);
                Q.datGiaTri(k('den'), d.DENNGAY);
                Q.datGiaTri(k('han'), d.HANINDON);
                tieuDe(true);
                taiPV();
            }
        };
    };
})();
