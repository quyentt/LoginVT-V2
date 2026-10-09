/* =========================================================================
   Kế hoạch xét học bổng — vùng "Thêm mới / Chỉnh sửa kế hoạch" (#zoneEdit của gốc)
   Bản gốc: ApisHocBong/Modules/kehoach/script/kehoach.js
       rewrite · viewEdit_KeHoachXuLy · save_KeHoachXuLy
       getList_ThanhVien · save_ThanhVien · delete_ThanhVien · genHTML_NhanSu · removeHTML_NhanSu
       getList_SinhVien · genTable_SinhVien · save_PhamVi · delete_SinhVien
   ---------------------------------------------------------------------------
   ums.hbKh.taoForm(zone, { onClose, onSaved, hocKyLoc() }) → { moThem(), moSua(dòng) }

   Lời gọi (chép nguyên):
     HB_KeHoach/ThemMoi (strId '') · HB_KeHoach/CapNhat (strId = ID)
         strTen · strMa (ô Mã ẩn như gốc — giữ MA cũ khi sửa) · strMoTa '' (gốc đọc txtAAAA)
         · strNgayBatDau · strNgayKetThuc · strHB_QuyHocBong_Id · strDaoTao_ThoiGianDaoTao_Id · dHieuLuc 1
     Cán bộ phân công xét (lưu CÙNG lúc Lưu kế hoạch, như gốc):
       HB_KeHoach_NhanSu/LayDanhSach GET  strTuKhoa '' (gốc đọc txtSearch_TuKhoa — không có) · strHB_KeHoach_Id
           · strDaoTao_ThoiGianDaoTao_Id = ô Học kỳ của THANH LỌC (gốc đọc dropSearch_ThoiGianDaoTao)
           · strNhanSu_HoSoCanBo_Id '' · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000
           Cột: NGUOIDUNG_TAIKHOAN · NGUOIDUNG_TENDAYDU; dòng đã lưu nhớ NGUOIDUNG_ID.
       HB_KeHoach_NhanSu/ThemMoi (dòng mới, strId '') · HB_KeHoach_NhanSu/CapNhat (dòng đã lưu, strId = ID dòng)
           strHB_KeHoach_Id · strNguoiDung_Id = ID nhân sự — gốc gửi CapNhat lại MỌI dòng đã lưu mỗi lần Lưu; giữ.
       HB_KeHoach_NhanSu/Xoa   strChucNang_Id · strIds = ID dòng (dòng chưa lưu chỉ bỏ khỏi bảng)
     Danh sách học sinh - sinh viên xét duyệt:
       HB_KeHoach_PhamVi/LayDanhSach GET  strTuKhoa '' · strNguoiDung_Id '' · strHB_KeHoach_Id · strNguoiTao_Id ''
           · pageIndex · pageSize (phân trang máy chủ)
           Cột: ANH (gốc in NGUYÊN chuỗi đường dẫn — ở đây vẽ ảnh) · QLSV_NGUOIHOC_MASO · QLSV_NGUOIHOC_HOTEN
           · DAOTAO_LOPQUANLY_TEN · DAOTAO_CHUONGTRINH_TEN · DAOTAO_KHOADAOTAO_TEN
       HB_ThongTin/Them_HB_KeHoach_PhamVi_ToanBo POST (kèm type=POST như gốc) — save_PhamVi, mỗi mục một lời gọi:
           strHB_KeHoach_Id · strQLSV_TrangThai_Id = trạng thái đánh dấu trong hộp chọn sinh viên
           · strPhamViApDung_Id = QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID (ghép liền, như gốc) khi chọn
             sinh viên; = ID hệ / khoá / chương trình / lớp khi "Thêm từng …"
       HB_KeHoach_PhamVi/Xoa  strIds = ID dòng
     Hộp chọn nhân sự (edu.extend.genModal_NhanSu): ums.pat.pickNhanSu — nhận ID · MASO · HOTEN.
     Hộp chọn sinh viên (edu.extend.genModal_SinhVien của Corei, có callback): ums.pat.pickSinhVien bản đầy đủ,
       nguồn như Corei getList_SinhVien — SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc.
       · "Thêm từng khóa / chương trình / lớp": nút của tầng chung; "Thêm từng hệ": màn chèn thêm (như XLHV).
       · "Thêm Khoa quản lý - khóa học" (btnAdd_KhoaKhoa — gửi ID khoá + ID khoa QL ghép liền) và ô lọc Khoa
         quản lý: hộp chung KHÔNG có ô Khoa quản lý → chưa làm được (báo tầng chung).

   Cố ý bỏ (mã chết của gốc): save_Lop / save_ChuongTrinh / save_Khoa + arrLop/arrKhoa/arrChuongTrinh (các nút
   gán mảng đã bị chú thích → mảng luôn rỗng); save_SinhVien (dòng name="new" không bao giờ có — bảng vẽ bằng
   loadToTable_data); genModal_SinhVien / getList_SinhVienMD / cbGetListModal_SinhVien riêng (SV_HoSoNhieuNganh
   — màn gọi edu.extend.genModal_SinhVien); getList_HeDaoTao… cbGenCombo_* đổ vào ô không có trên màn,
   KHCT_NamNhapHoc; getList_DoiTuong (biến strHB_KeHoach_Id không khai báo); arrValid (ô txtKeHoachXuLy_So
   không tồn tại → không kiểm gì); ảnh trang trí Upload/images/img-kehoach_1.png ở nửa phải biểu mẫu.

   Khác gốc:
     · Khối sinh viên ẨN khi đang thêm mới (gốc hiện nhưng save_PhamVi gửi ID kế hoạch rỗng). Lưu xong kế hoạch
       mới thì nhớ ID máy chủ trả (data.Id), đổi tiêu đề sang "Chỉnh sửa", hiện khối sinh viên. Gốc KHÔNG nhớ ID
       → bấm Lưu lần hai là THÊM TRÙNG kế hoạch (và thêm trùng cán bộ).
     · Chọn cán bộ đã có trong bảng → báo "Đã tồn tại!" (gốc so ID nhân sự với ID DÒNG nên không bắt được dòng
       đã lưu).
     · Lời gọi hàng loạt qua ums.ui.batch, xong nạp lại MỘT lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var H = ums.hbKh, K = H.K, e = H.e;

    H.taoForm = function (zone, o) {
        o = o || {};
        var khId = '', ma = '', ns = [], svPage = 1, svSize = 10, svTotal = 0, tam = 0;

        function inp(k, date) {
            return '<input class="ums-input" data-k="' + k + '" data-scope="form" autocomplete="off"' + (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>';
        }
        function sel(k, ph) {
            return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option></select>';
        }

        zone.innerHTML =
            pat.panel({
                title: 'Thêm mới - Kế hoạch', icon: 'fa-plus',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                body: '<div class="ums-legend">Thông tin kế hoạch</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Tên kế hoạch', inp('ten')) +
                        ui.field('Học kỳ', sel('tg', 'Chọn học kỳ')) +
                        ui.field('Quỹ học bổng', sel('quy', 'Chọn quỹ học bổng')) +
                        '<div></div>' +
                        ui.field('Từ ngày', inp('tu', true)) +
                        ui.field('Đến ngày', inp('den', true)) +
                    '</div>'
            }) +
            pat.panel({
                title: 'Cán bộ phân công xét', icon: 'fa-user-tie', count: 'nsn', flush: true, zone: 'ns',
                tools: ui.btn('add', { text: 'Thêm cán bộ', mod: 'out-success', attr: { 'data-a': 'ns-them' } })
            }) +
            '<div class="ums-u-mt-4" data-z="con" hidden>' +
                pat.panel({
                    title: 'Danh sách học sinh - sinh viên xét duyệt', icon: 'fa-users', count: 'svn',
                    tools: ui.xoaChon('input[data-svkh]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'sv-xoa' } }) +
                        ui.btn('add', { text: 'Thêm thành viên', mod: 'out-success', attr: { 'data-a': 'sv-them' } }),
                    body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="svq" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                        '<div class="ums-u-mt-3" data-z="sv"></div>'
                }) +
            '</div>';

        function k(x) { return zone.querySelector('[data-k="' + x + '"]'); }
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        ui.enhance(zone);
        K.ganChon(zone);
        var locSV = K.locTaiCho(zone.querySelector('[data-f="svq"]'), z('sv'));

        H.napHocKy([k('tg')], ['Chọn học kỳ']);
        H.napQuy([k('quy')]);

        function datGiaTri(el, v) {
            el.value = v === undefined || v === null ? '' : String(v);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
            if (el._flatpickr) { if (el.value) el._flatpickr.setDate(el.value, false, 'd/m/Y'); else el._flatpickr.clear(); }
        }
        function trangThai(sua) {
            zone.querySelector('.ums-panel__title').innerHTML = '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' +
                (sua ? 'Chỉnh sửa' : 'Thêm mới') + ' - Kế hoạch';
            z('con').hidden = !sua;
        }

        /* ---------- Cán bộ phân công xét ------------------------------------ */
        function veNS() {
            z('nsn').textContent = '(' + ns.length + ')';
            ui.table({
                el: z('ns'), rows: ns, stt: true, empty: 'Chưa phân công cán bộ',
                columns: [
                    { title: 'Mã số', cls: 'is-nowrap', render: function (r) {
                        return esc(e(r.NGUOIDUNG_TAIKHOAN)) + (r._moi ? ' ' + ui.badge('Chưa lưu', 'warn') : '');
                    } },
                    { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
                    { title: 'Xóa', cls: 'is-center is-actions', width: '60px', render: function (r) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-a="ns-xoa" data-id="' + esc(r.ID) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                    } }
                ]
            });
        }
        function taiNS() {
            if (!khId) { ns = []; veNS(); return Promise.resolve(); }
            K.dang(z('ns'));
            return ums.api.call({
                action: 'HB_KeHoach_NhanSu/LayDanhSach', method: 'GET',
                strTuKhoa: '', strHB_KeHoach_Id: khId,
                strDaoTao_ThoiGianDaoTao_Id: o.hocKyLoc ? o.hocKyLoc() : '',
                strNhanSu_HoSoCanBo_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) { ns = K.ds(r); veNS(); })
              .catch(function (err) { K.loi(z('ns'), err, 'cán bộ phân công'); });
        }
        function themNS() {
            pat.pickNhanSu({
                title: 'Tìm kiếm nhân sự',
                onPick: function (list) {
                    var trung = 0;
                    list.forEach(function (x) {
                        if (ns.some(function (r) { return String(r.NGUOIDUNG_ID) === String(x.ID); })) { trung++; return; }
                        var ten = (x.LOAICHUCDANH_MA ? x.LOAICHUCDANH_MA + '. ' : '') + (x.LOAIHOCVI_MA ? x.LOAIHOCVI_MA + '. ' : '') + e(x.HOTEN);
                        ns.push({ ID: 'moi' + (++tam), _moi: true, NGUOIDUNG_ID: x.ID, NGUOIDUNG_TAIKHOAN: x.MASO, NGUOIDUNG_TENDAYDU: ten });
                    });
                    if (trung) ui.toast(trung + ' cán bộ đã tồn tại!', 'warn');
                    veNS();
                }
            });
        }
        function xoaNS(id) {
            var r = K.tim(ns, id);
            if (!r) return;
            if (r._moi) { ns = ns.filter(function (x) { return x !== r; }); veNS(); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá cán bộ phân công' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'HB_KeHoach_NhanSu/Xoa', strChucNang_Id: '', strIds: id, strNguoiThucHien_Id: '' })
                    .then(function () { ui.toast('Xóa thành công!', 'ok'); taiNS(); })
                    .catch(function (err) { ums.api.handle(err, 'xoá cán bộ phân công'); });
            });
        }
        function luuNS(id) {
            return ui.batch(ns.map(function (r) {
                return { action: r._moi ? 'HB_KeHoach_NhanSu/ThemMoi' : 'HB_KeHoach_NhanSu/CapNhat',
                    strId: r._moi ? '' : r.ID, strChucNang_Id: '', strHB_KeHoach_Id: id, strNguoiDung_Id: r.NGUOIDUNG_ID, strNguoiThucHien_Id: '' };
            }), { title: 'Đang lưu cán bộ phân công', okText: 'Lưu cán bộ phân công' });
        }

        /* ---------- Danh sách học sinh - sinh viên xét duyệt ---------------- */
        function taiSV(p) {
            if (p) svPage = p;
            var host = z('sv');
            K.dang(host);
            ums.api.call({
                action: 'HB_KeHoach_PhamVi/LayDanhSach', method: 'GET',
                strTuKhoa: '', strNguoiDung_Id: '', strHB_KeHoach_Id: khId, strNguoiTao_Id: '',
                pageIndex: svPage, pageSize: svSize
            }).then(function (r) {
                var rows = K.ds(r);
                svTotal = Number(r.pager) || rows.length;
                z('svn').textContent = '(' + svTotal + ')';
                ui.table({
                    el: host, rows: rows, empty: 'Chưa có sinh viên xét duyệt',
                    page: { index: svPage, size: svSize, total: svTotal,
                        onChange: function (n) { if (n >= 1 && n <= Math.ceil(svTotal / svSize)) taiSV(n); },
                        onSize: function (v) { svSize = v === 'all' ? ui.PAGE_ALL : Number(v); taiSV(1); } },
                    columns: [
                        { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: function (x) {
                            return ums.pat.anhNguoi(x.ANH);
                        } },
                        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'QLSV_NGUOIHOC_HOTEN' },
                        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                        K.cotChon('svkh')
                    ]
                });
                locSV();
            }).catch(function (err) { K.loi(host, err, 'danh sách sinh viên xét duyệt'); });
        }
        function goiPhamVi(phamVi, trangThai) {
            return { action: 'HB_ThongTin/Them_HB_KeHoach_PhamVi_ToanBo', method: 'POST', type: 'POST',
                strChucNang_Id: '', strHB_KeHoach_Id: khId, strQLSV_TrangThai_Id: trangThai,
                strPhamViApDung_Id: phamVi, strNguoiThucHien_Id: '' };
        }
        function chayPhamVi(calls) {
            ui.batch(calls, { title: 'Đang thêm', okText: 'Thêm thành công!', show: true }).then(function () { taiSV(1); });
        }
        function themSV() {
            var tt = null;
            function st() { return tt ? tt.ids().join(',') : ''; }
            function nhom(ten) {
                return function (ids, params, dlg) {
                    var arr = ids ? String(ids).split(',') : [];
                    if (!arr.length) { ui.toast('Chưa chọn ' + ten + ' nào.', 'warn'); return; }
                    var s = st();
                    dlg.close();
                    chayPhamVi(arr.map(function (id) { return goiPhamVi(id, s); }));
                };
            }
            var dlg = pat.pickSinhVien({
                filters: true,
                okText: 'Chọn',
                status: function (el) { tt = pat.checks(el, ums.api.dm('QLSV.TRANGTHAI'), { cols: 3, what: 'trạng thái sinh viên' }); return tt; },
                call: function (p, page, size) {
                    return { action: 'SV_NGUOIHOC_01_MH/DSA4BRIPJjQuKAkuIgPP', func: 'PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc',
                        strTuKhoa: p.strTuKhoa, strNguoiThucHien_Id: '',
                        strDaoTao_HeDaoTao_Id: p.strHeDaoTao_Id, strDaoTao_KhoaDaoTao_Id: p.strKhoaDaoTao_Id,
                        strDaoTao_ChuongTrinh_Id: p.strChuongTrinh_Id, strDaoTao_KhoaQuanLy_Id: '', strDaoTao_LopQuanLy_Id: p.strLopQuanLy_Id,
                        strStudyStatus_Ids: p.strTrangThaiNguoiHoc_Id, dIsPrimary: '', dBoQuaPhamVi: '', pageIndex: page, pageSize: size };
                },
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc(H.hoTen(r)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
                ],
                group: { khoa: nhom('khóa'), chuongTrinh: nhom('chương trình'), lop: nhom('lớp') },
                onPick: function (rows) {
                    var s = st();
                    chayPhamVi(rows.map(function (r) { return goiPhamVi(e(r.QLSV_NGUOIHOC_ID) + e(r.DAOTAO_TOCHUCCHUONGTRINH_ID), s); }));
                }
            });
            /* "Thêm từng hệ" (btnAdd_He) — hộp chung chưa có, chèn vào đầu hàng "Thêm nhiều" */
            var g = dlg.body.querySelector('[data-g]');
            if (g) {
                g.insertAdjacentHTML('beforebegin', '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-xg="he">' +
                    '<i class="fa-light fa-plus"></i><span>Thêm từng hệ</span></button>');
                dlg.body.addEventListener('click', function (ev) {
                    if (!ev.target.closest('[data-xg="he"]')) return;
                    nhom('hệ')(pat.val(dlg.body.querySelector('[data-f="he"]')), null, dlg);
                });
            }
        }
        function xoaSV() {
            var ids = K.daChon(z('sv'), 'svkh');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: 'HB_KeHoach_PhamVi/Xoa', strIds: id, strNguoiThucHien_Id: '' };
            }), function () { taiSV(); });
        }

        /* ---------- Lưu kế hoạch -------------------------------------------- */
        function luu() {
            var c = {
                action: 'HB_KeHoach/ThemMoi',
                strId: khId, strChucNang_Id: '',
                strTen: k('ten').value, strMa: ma, strMoTa: '',
                strNgayBatDau: k('tu').value, strNgayKetThuc: k('den').value,
                strHB_QuyHocBong_Id: k('quy').value, strDaoTao_ThoiGianDaoTao_Id: k('tg').value,
                dHieuLuc: 1, strNguoiThucHien_Id: ''
            };
            if (c.strId !== '') c.action = 'HB_KeHoach/CapNhat';
            ums.api.call(c).then(function (r) {
                var moi = c.strId === '';
                ui.toast(moi ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
                var id = moi ? ((r.raw && r.raw.Id) || '') : c.strId;
                if (o.onSaved) o.onSaved();
                if (!id) return;
                khId = id;
                trangThai(true);
                luuNS(id).then(function () { taiNS(); });
                if (moi) taiSV(1);
            }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch'); if (o.onSaved) o.onSaved(); });
        }

        /* ---------- Sự kiện ------------------------------------------------- */
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu': luu(); break;
                case 'ns-them': themNS(); break;
                case 'ns-xoa': xoaNS(b.getAttribute('data-id')); break;
                case 'sv-them': themSV(); break;
                case 'sv-xoa': xoaSV(); break;
            }
        });

        return {
            moThem: function () {
                khId = ''; ma = ''; ns = [];
                datGiaTri(k('ten'), '');
                datGiaTri(k('tg'), o.hocKyLoc ? o.hocKyLoc() : '');       // rewrite: lấy ô Học kỳ của thanh lọc
                datGiaTri(k('quy'), '');
                datGiaTri(k('tu'), ''); datGiaTri(k('den'), '');
                zone.querySelector('[data-f="svq"]').value = '';
                z('sv').innerHTML = '';
                veNS();
                trangThai(false);
            },
            moSua: function (d) {
                khId = d.ID; ma = e(d.MA);
                datGiaTri(k('ten'), d.TEN);
                datGiaTri(k('quy'), d.HB_QUYHOCBONG_ID);
                datGiaTri(k('tg'), d.DAOTAO_THOIGIANDAOTAO_ID);
                datGiaTri(k('tu'), d.NGAYBATDAU);
                datGiaTri(k('den'), d.NGAYKETTHUC);
                zone.querySelector('[data-f="svq"]').value = '';
                trangThai(true);
                taiSV(1);
                taiNS();
            }
        };
    };
})();
