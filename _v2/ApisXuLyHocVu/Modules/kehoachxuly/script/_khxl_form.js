/* =========================================================================
   Kế hoạch xử lý học vụ — vùng "Thêm mới / Chỉnh sửa kế hoạch" (#zoneEdit của gốc)
   Bản gốc: ApisXuLyHocVu/Modules/kehoachxuly/script/kehoachxuly.js
       rewrite · viewEdit_KeHoachXuLy · save_KeHoachXuLy
       getList_PhanCong · save_PhanCong · delete_PhanCong · genTable_PhanCong
       getList_SinhVien · save_SinhVien · delete_SinhVien · genTable_SinhVien
       nút #btnXetKetQuaXuLyEdit (save_KetQuaXuLy trên bảng sinh viên)
   ---------------------------------------------------------------------------
   ums.khxl.taoForm(zone, { onClose, onSaved }) → { moThem(), moSua(dòng) }

   Lời gọi (chép nguyên):
     XLHV_ThongTin_MH/… pkg_xulyhocvu_thongtin.Them_XLHV_KeHoachXuLy   thêm (strId '')
     XLHV_ThongTin_MH/… pkg_xulyhocvu_thongtin.Sua_XLHV_KeHoachXuLy    sửa (strId = ID)
         strTen · strMa · strTuNgay · strDenNgay · strLoaiXuLy_Id · strDaoTao_ThoiGianDaoTao_Id
         · dKetQuaChinhThuc (ô "Dùng làm", rỗng → -1)
     XLHV_ThongTin_MH/… LayDSXLHV_KeHoach_NhanSu   strTuKhoa '' · strNguoiDung_Id '' · strXLHV_KeHoach_Id
                                                     · strNguoiTao_Id '' · pageIndex · pageSize (phân trang máy chủ)
     XLHV_ThongTin_MH/… Them_XLHV_KeHoach_NhanSu   strXLHV_KeHoach_Id · strNguoiDung_Id (mỗi người một lời gọi)
     XLHV_ThongTin_MH/… Xoa_XLHV_KeHoach_NhanSu    strIds = ID dòng phân công
     XLHV_DanhSachKhongXuLy/LayDanhSach   GET   strTuKhoa '' · strXLHV_KeHoachXuLy_Id · strNguoiTao_Id ''
                                                · pageIndex 1 · pageSize 1000000
     XLHV_ThongTin/Them_XLHV_DSKhongXuLy_PhamVi  POST (kèm tham số type=POST như gốc)
         strXLHV_KeHoachXuLy_Id · strPhamViApDung_Id = QLSV_NGUOIHOC_ID (hoặc ID hệ / khoá / CT / lớp)
         · strDaoTao_ChuongTrinh_Id = DAOTAO_TOCHUCCHUONGTRINH_ID · strQLSV_TrangThaiNguoiHoc_Id · strMoTa ''
     XLHV_DanhSachKhongXuLy/Xoa           strIds = ID dòng
   Danh mục: XLHV.LOAIXULY (ô Loại) · ô Học kỳ = pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao.

   Hộp chọn người dùng (edu.extend.genModal_NguoiDung): ums.tlKh.pickNguoiDung — nạp CHÍNH
   tệp ApisDangKyHoc/Modules/thilai/script/_chung.js (pkg_chung_quanlynguoidung.LayDanhSachNguoiDung).
   Hộp chọn sinh viên (edu.extend.genModal_SinhVien của Corei): ums.pat.pickSinhVien bản đầy đủ,
   nguồn như Corei getList_SinhVien — SV_NGUOIHOC_01_MH · PKG_CORE_NGUOIHOC_01.LayDSNguoiHoc.
     · "Thêm từng khóa / chương trình / lớp": nút của tầng chung.
     · "Thêm từng hệ": tầng chung chưa có → màn chèn thêm nút vào hàng "Thêm nhiều" của hộp.
     · "Thêm Khoa quản lý - khóa học" (btnAdd_KhoaKhoa, gửi ID khoá + ID khoa QL ghép liền) và ô lọc
       "Khoa quản lý": hộp chung KHÔNG có ô Khoa quản lý → chưa làm được (báo tầng chung).
     Nhóm (hệ/khoá/CT/lớp) gửi strPhamViApDung_Id = ID mục, strDaoTao_ChuongTrinh_Id rỗng,
     strQLSV_TrangThaiNguoiHoc_Id = các trạng thái đang đánh dấu trong hộp (như gốc).

   Cố ý bỏ (mã chết của gốc): genModal_SinhVien / getList_SinhVienMD / cbGetListModal_SinhVien riêng
   của màn (SV_HoSoNhieuNganh/LayDanhSach — màn gọi edu.extend.genModal_SinhVien chứ không gọi bản này),
   addHTMLinto_SinhVien / removeHTMLoff_SinhVien, các hàm getList_HeDaoTao… cbGenCombo_* đổ vào ô
   không có trên màn, KHCT_NamNhapHoc/LayDanhSach, khối #ApDungChoKhoa/ChuongTrinh/Lop (luôn bị xoá
   trắng), arrValid (kiểm ô txtKeHoachXuLy_So không tồn tại → validInputForm bỏ qua, không kiểm gì).

   Khác gốc:
     · Khối "Cán bộ phân công xét" và "Danh sách sinh viên" ẨN khi đang thêm mới (gốc hiện nhưng mọi
       lời gọi gửi ID kế hoạch rỗng). Lưu xong kế hoạch mới thì nhớ ID máy chủ trả, đổi tiêu đề sang
       "Chỉnh sửa" và hiện hai khối — đúng ý định của gốc (setTimeout 2 giây rồi .btnOpenDelete.show()).
       Gốc chờ 2 giây mới nhớ ID → bấm Lưu lần hai trong 2 giây là THÊM TRÙNG; ở đây nhớ ngay.
     · Nút Xóa / Thêm cán bộ / Thêm thành viên chuyển lên đầu từng khối (gốc ở góc khối / chân khối).
     · Kiểm trước khi Lưu: Mã, Tên, Học kỳ, Từ ngày, Đến ngày, Loại bắt buộc (máy chủ đòi — thiếu là "Du lieu khong hop le");
       Đến ngày không được trước Từ ngày (máy chủ không kiểm). Gốc không kiểm gì.
     · Mỗi lời gọi xoá / thêm chạy qua ums.ui.batch, xong nạp lại MỘT lần (gốc: toast mỗi lời gọi).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var K = ums.khxl = ums.khxl || {};
    var e = K.e;

    K.taoForm = function (zone, o) {
        o = o || {};
        var TT = K.TT, P = K.P;
        var khId = '', svRows = [], pcPage = 1, pcSize = 10, pcTotal = 0;

        function inp(k, date) {
            return '<input class="ums-input" data-k="' + k + '" data-scope="form" autocomplete="off"' +
                (date ? ' data-date placeholder="dd/mm/yyyy"' : '') + '>';
        }
        function sel(k, ph, opts) {
            return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph) + '"><option value="">' + esc(ph) + '</option>' + (opts || '') + '</select>';
        }

        zone.innerHTML =
            pat.panel({
                title: 'Thêm mới - Kế hoạch xử lý', icon: 'fa-plus',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luu' } }) +
                    ui.btn('save', { text: 'Xét Xử lý học vụ', icon: 'fa-chalkboard-user', attr: { 'data-a': 'xet-sv', 'data-can-id': '1' } }),
                body: '<div class="ums-legend">Thông tin kế hoạch</div>' +
                    '<div class="ums-grid ums-grid--3">' +
                        ui.field('Mã kế hoạch', inp('ma'), { required: true }) +
                        ui.field('Tên kế hoạch', inp('ten'), { required: true }) +
                        ui.field('Dùng làm', sel('kq', 'Dùng làm', '<option value="1">Kết quả chính</option><option value="0">Không dùng làm kết quả chính</option>')) +
                        ui.field('Học kỳ', sel('tg', 'Chọn học kỳ'), { required: true }) +
                        ui.field('Từ ngày', inp('tu', true), { required: true }) +
                        ui.field('Đến ngày', inp('den', true), { required: true }) +
                        ui.field('Loại', sel('loai', 'Chọn loại xử lý'), { required: true }) +
                    '</div>'
            }) +
            '<div data-z="con" hidden>' +
                pat.panel({
                    title: 'Cán bộ phân công xét', icon: 'fa-user-tie', count: 'pcn', flush: true, zone: 'pc',
                    tools: ui.xoaChon('input[data-pc]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'pc-xoa' } }) +
                        ui.btn('add', { text: 'Thêm cán bộ', mod: 'out-success', attr: { 'data-a': 'pc-them' } })
                }) +
                pat.panel({
                    title: 'Danh sách sinh viên áp dụng trong kế hoạch này', icon: 'fa-users', count: 'svn',
                    tools: ui.xoaChon('input[data-svad]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'sv-xoa' } }) +
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

        /* ---------- Danh mục của biểu mẫu ----------------------------------- */
        ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
            .then(function (ds) { pat.fill(k('tg'), ds, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' }); })
            .catch(function (err) { ums.api.handle(err, 'học kỳ'); });
        ums.api.dm('XLHV.LOAIXULY')
            .then(function (ds) { pat.fill(k('loai'), ds, { name: 'TEN', head: 'Chọn loại xử lý' }); })
            .catch(function (err) { ums.api.handle(err, 'loại xử lý'); });

        function datGiaTri(el, v) {
            el.value = v === undefined || v === null ? '' : String(v);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
            if (el._flatpickr) { if (el.value) el._flatpickr.setDate(el.value, false, 'd/m/Y'); else el._flatpickr.clear(); }
        }

        function trangThai(sua) {
            var t = zone.querySelector('.ums-panel__title');
            t.innerHTML = '<i class="fa-light ' + (sua ? 'fa-pen-to-square' : 'fa-plus') + '"></i> ' + (sua ? 'Chỉnh sửa' : 'Thêm mới') + ' - Kế hoạch xử lý';
            z('con').hidden = !sua;
            K.qa(zone, '.is-invalid').forEach(function (x) { x.classList.remove('is-invalid'); });     // viền đỏ của lần Lưu trước
            K.qa(zone, '[data-can-id]').forEach(function (b) {
                b.disabled = !sua;
                b.title = sua ? '' : 'Lưu kế hoạch trước';
            });
        }

        /* ---------- Cán bộ phân công xét ------------------------------------ */
        function taiPC(p) {
            if (p) pcPage = p;
            var host = z('pc');
            K.dang(host);
            ums.api.call({
                action: TT + 'DSA4BRIZDQkXHgokCS4gIikeDykgLxI0', func: P + 'LayDSXLHV_KeHoach_NhanSu',
                strTuKhoa: '', strNguoiDung_Id: '', strXLHV_KeHoach_Id: khId, strNguoiTao_Id: '',
                pageIndex: pcPage, pageSize: pcSize
            }).then(function (r) {
                var rows = K.ds(r);
                pcTotal = Number(r.pager) || rows.length;
                z('pcn').textContent = '(' + pcTotal + ')';
                ui.table({
                    el: host, rows: rows, empty: 'Chưa phân công cán bộ',
                    page: { index: pcPage, size: pcSize, total: pcTotal,
                        onChange: function (n) { if (n >= 1 && n <= Math.ceil(pcTotal / pcSize)) taiPC(n); },
                        onSize: function (v) { pcSize = v === 'all' ? ui.PAGE_ALL : Number(v); taiPC(1); } },
                    columns: [
                        { title: 'Mã số', prop: 'NGUOIDUNG_TAIKHOAN', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
                        { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
                        K.cotChon('pc')
                    ]
                });
            }).catch(function (err) { K.loi(host, err, 'cán bộ phân công'); });
        }
        function themPC() {
            ums.tlKh.pickNguoiDung(function (ids) {
                ui.batch(ids.map(function (id) {
                    return { action: TT + 'FSkkLB4ZDQkXHgokCS4gIikeDykgLxI0', func: P + 'Them_XLHV_KeHoach_NhanSu',
                        strChucNang_Id: '', strXLHV_KeHoach_Id: khId, strNguoiDung_Id: id, strNguoiThucHien_Id: '' };
                }), { title: 'Đang thêm cán bộ', okText: 'Thực hiện thành công', show: true }).then(function () { taiPC(1); });
            });
        }
        function xoaPC() {
            var ids = K.daChon(z('pc'), 'pc');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: TT + 'GS4gHhkNCRceCiQJLiAiKR4PKSAvEjQP', func: P + 'Xoa_XLHV_KeHoach_NhanSu', strIds: id, strNguoiThucHien_Id: '' };
            }), function () { taiPC(); });
        }

        /* ---------- Danh sách sinh viên áp dụng ------------------------------ */
        function taiSV() {
            var host = z('sv');
            K.dang(host);
            ums.api.call({
                action: 'XLHV_DanhSachKhongXuLy/LayDanhSach', method: 'GET',
                strTuKhoa: '', strChucNang_Id: '', strXLHV_KeHoachXuLy_Id: khId, strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 1000000
            }).then(function (r) {
                svRows = K.ds(r);
                z('svn').textContent = '(' + svRows.length + ')';
                ui.table({
                    el: host, rows: svRows, empty: 'Chưa có sinh viên áp dụng',
                    columns: [
                        { title: 'Hình ảnh', cls: 'is-center', width: '72px', render: function (x) {
                            return ums.pat.anhNguoi(x.ANH);
                        } },
                        { title: 'Mã số', cls: 'is-nowrap', render: K.maSo },
                        { title: 'Họ tên', render: function (x) { return esc(K.hoTen(x)); } },
                        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                        K.cotChon('svad')
                    ]
                });
                locSV();
            }).catch(function (err) { K.loi(host, err, 'danh sách sinh viên áp dụng'); });
        }
        function goiThemSV(phamVi, ct, trangThai) {
            return {
                action: 'XLHV_ThongTin/Them_XLHV_DSKhongXuLy_PhamVi', type: 'POST', method: 'POST',
                strChucNang_Id: '', strXLHV_KeHoachXuLy_Id: khId,
                strPhamViApDung_Id: phamVi, strDaoTao_ChuongTrinh_Id: ct, strQLSV_TrangThaiNguoiHoc_Id: trangThai,
                strMoTa: '', strNguoiThucHien_Id: ''
            };
        }
        function chayThemSV(calls) {
            ui.batch(calls, { title: 'Đang thêm sinh viên', okText: 'Thêm sinh viên thành công!', show: true }).then(taiSV);
        }
        function themSV() {
            var tt = null;
            function nhom(ten) {
                return function (ids, params, dlg) {
                    var arr = ids ? String(ids).split(',') : [];
                    if (!arr.length) { ui.toast('Chưa chọn ' + ten + ' nào.', 'warn'); return; }
                    var st = tt ? tt.ids().join(',') : '';
                    dlg.close();
                    chayThemSV(arr.map(function (id) { return goiThemSV(id, '', st); }));
                };
            }
            var dlg = pat.pickSinhVien({
                filters: true,
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
                    { title: 'Họ tên', render: function (r) { return esc(K.hoTen(r)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Trạng thái', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' }
                ],
                group: { khoa: nhom('khóa'), chuongTrinh: nhom('chương trình'), lop: nhom('lớp') },
                onPick: function (rows) {
                    chayThemSV(rows.map(function (r) { return goiThemSV(r.QLSV_NGUOIHOC_ID, r.DAOTAO_TOCHUCCHUONGTRINH_ID, r.QLSV_TRANGTHAINGUOIHOC_ID); }));
                }
            });
            /* "Thêm từng hệ" (btnAdd_He của gốc) — hộp chung chưa có, chèn vào đầu hàng "Thêm nhiều" */
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
            var ids = K.daChon(z('sv'), 'svad');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: 'XLHV_DanhSachKhongXuLy/Xoa', strIds: id, strNguoiThucHien_Id: '' };
            }), taiSV);
        }

        /* ---------- Lưu kế hoạch -------------------------------------------- */
        /* Máy chủ đòi đủ sáu ô dưới đây (kiểm host 30/9: thiếu một ô là "Du lieu khong hop le"), "Dùng làm" thì không.
           Gốc không kiểm gì (arrValid trỏ ô không tồn tại). Máy chủ cũng KHÔNG kiểm Từ ngày ≤ Đến ngày → màn kiểm. */
        var BATBUOC = [['ma', 'Mã kế hoạch'], ['ten', 'Tên kế hoạch'], ['tg', 'Học kỳ'], ['tu', 'Từ ngày'], ['den', 'Đến ngày'], ['loai', 'Loại']];
        function soNgay(s) {
            var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim());
            return m ? Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]) : 0;
        }
        function kiem() {
            var thieu = [];
            BATBUOC.forEach(function (b) {
                var el = k(b[0]), sai = !String(el.value || '').trim();
                el.classList.toggle('is-invalid', sai);
                var s2 = el.nextElementSibling && el.nextElementSibling.classList.contains('select2') ? el.nextElementSibling : null;
                if (s2) s2.classList.toggle('is-invalid', sai);
                if (sai) thieu.push(b[1]);
            });
            if (thieu.length) { ui.toast('Chưa nhập: ' + thieu.join(', '), 'warn'); return false; }
            var tu = soNgay(k('tu').value), den = soNgay(k('den').value);
            if (!tu || !den) { ui.toast('Từ ngày / Đến ngày phải theo dạng ngày/tháng/năm', 'warn'); return false; }
            if (den < tu) { ui.toast('Đến ngày phải bằng hoặc sau Từ ngày', 'warn'); return false; }
            return true;
        }
        function luu() {
            if (!kiem()) return;
            var c = {
                action: 'XLHV_ThongTin_MH/FSkkLB4ZDQkXHgokCS4gIikZNA04', func: P + 'Them_XLHV_KeHoachXuLy',
                strId: khId, strChucNang_Id: '',
                strTen: k('ten').value, strMa: k('ma').value,
                strTuNgay: k('tu').value, strDenNgay: k('den').value,
                strLoaiXuLy_Id: k('loai').value, strDaoTao_ThoiGianDaoTao_Id: k('tg').value,
                dKetQuaChinhThuc: k('kq').value ? k('kq').value : -1,
                strNguoiThucHien_Id: ''
            };
            if (c.strId !== '') {
                c.action = 'XLHV_ThongTin_MH/EjQgHhkNCRceCiQJLiAiKRk0DTgP';
                c.func = P + 'Sua_XLHV_KeHoachXuLy';
            }
            ums.api.call(c).then(function (r) {
                var moi = c.strId === '';
                ui.toast(moi ? 'Thêm mới thành công!' : 'Cập nhật thành công!', 'ok');
                if (moi) {
                    khId = (r.raw && r.raw.Id) || '';
                    if (khId) { trangThai(true); taiPC(1); taiSV(); }
                }
                if (o.onSaved) o.onSaved();
            }).catch(function (err) { ums.api.handle(err, 'lưu kế hoạch xử lý'); if (o.onSaved) o.onSaved(); });
        }

        /* ---------- Sự kiện ------------------------------------------------- */
        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu': luu(); break;
                case 'xet-sv': K.xet(svRows, K.daChon(z('sv'), 'svad')); break;
                case 'pc-them': themPC(); break;
                case 'pc-xoa': xoaPC(); break;
                case 'sv-them': themSV(); break;
                case 'sv-xoa': xoaSV(); break;
                case 'hoctap': K.hocTap(b.getAttribute('data-nh'), b.getAttribute('data-ten')); break;
            }
        });

        return {
            moThem: function () {
                khId = ''; svRows = [];
                ['ma', 'ten', 'kq', 'tg', 'tu', 'den', 'loai'].forEach(function (x) { datGiaTri(k(x), ''); });
                zone.querySelector('[data-f="svq"]').value = '';
                z('sv').innerHTML = ''; z('pc').innerHTML = '';
                trangThai(false);
            },
            moSua: function (d) {
                khId = d.ID;
                datGiaTri(k('ma'), d.MA);
                datGiaTri(k('ten'), d.TEN);
                datGiaTri(k('kq'), d.KETQUACHINHTHUC);
                datGiaTri(k('tg'), d.DAOTAO_THOIGIANDAOTAO_ID);
                datGiaTri(k('tu'), d.TUNGAY);
                datGiaTri(k('den'), d.DENNGAY);
                datGiaTri(k('loai'), d.LOAIXULY_ID);
                zone.querySelector('[data-f="svq"]').value = '';
                trangThai(true);
                taiSV();
                taiPC(1);
            }
        };
    };
})();
