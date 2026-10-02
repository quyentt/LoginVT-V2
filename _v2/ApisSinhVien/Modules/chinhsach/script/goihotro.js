/* =========================================================================
   Gói hỗ trợ — HAI cột như gốc: danh sách GÓI HỖ TRỢ (trái, 4) · CHÍNH SÁCH – GÓI HỖ TRỢ (phải, 8)
   Bản gốc: ApisSinhVien/Modules/chinhsach/html/goihotro.html + script/goihotro.js
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, chép nguyên bản gốc):
     Gói             SV_GoiHoTro/LayDanhSach GET (strTuKhoa '', strNguoiTao_Id '', trang 1 × 1000000)
                     SV_GoiHoTro/ThemMoi | CapNhat (strId, strChucNang_Id, strTen, strMa) · SV_GoiHoTro/Xoa (strIds)
     Chi tiết gói    SV_GoiHoTro_ChiTiet/LayDanhSach GET (strTaiChinh_ChinhSach_Goi_Id = gói đang chọn, các lọc khác '',
                     phân trang máy chủ) · ThemMoi | CapNhat (strNgay_Thang_BatDau, strNgay_Thang_KetThuc, iThuTu,
                     strTaiChinh_CS_GoiHoTro_Id, strTaiChinh_CacKhoanThu_Id, strDonViTinh_Id, strKieuTinh_Id,
                     strQuyDinhThoiGian_Id, dMucHuong, strGhiChu) · Xoa (strIds)
     Chính sách–gói  SV_CS_DoiTuong/LayDanhSach GET (strTuKhoa, strDoiTuong_Id, strCheDoChinhSach_Id, 3 lọc '', phân trang)
                     ThemMoi | CapNhat (strTaiChinh_CS_GoiHoTro_Id, strDoiTuong_Id, strCheDoChinhSach_Id,
                     strDaoTao_ThoiGianDaoTao_Id, dHieuLuc) · Xoa (strIds)
     Nguồn ô chọn    SV_ChinhSach_DT/LayDanhSach GET (đối tượng: DOITUONG_ID / DOITUONG_TEN) · TC_KhoanThu/LayDanhSach GET
                     · edu.system.getList_ThoiGianDaoTao · danh mục QLTC.CDCS, TAICHINH.CHINHSACH.DONVITINH,
                     TAICHINH.CHINHSACH.KIEUITINH, TAICHINH.CHINHSACH.QUYDINHTHOIGIAN
   Bố cục: như gốc — thanh lọc + hai cột; "Thêm mới / sửa" gói thay chỗ cả trang (gốc toggle zone-bus), khối
   "Gói hỗ trợ chi tiết" nằm dưới thông tin gói (chỉ hiện khi đã có gói). Chính sách–gói: gốc là hộp thoại →
   biểu mẫu thay chỗ trang (quy ước chung). Chi tiết gói (myModal_ChiTiet gốc, bản ghi con bên trong biểu mẫu gói):
   từ 2026-09-30 cũng là biểu mẫu NGAY TRONG TRANG, thay chỗ biểu mẫu gói (ums.pat.formTrang, BO-CUC luật 1) —
   bấm Đóng / lưu xong / xoá xong thì quay về biểu mẫu gói. Nút Xóa nay hỏi lại TRƯỚC, xoá xong mới đóng biểu mẫu
   (trước đó hộp đóng ngay khi bấm).
   Lỗi gốc đã sửa (làm theo ý định):
     · Sửa chính sách–gói gửi strId = ID CHI TIẾT gói đang nhớ (me.strGoiHoTro_ChiTiet_Id) → thành Thêm mới
       (tạo trùng) hoặc cập nhật nhầm dòng. Nay gửi ID dòng chính sách–gói đang sửa.
     · Ba nút Xóa (gói / chính sách–gói / chi tiết) luôn ẩn (display: none, không chỗ nào bật; nút xoá chính
       sách–gói còn gắn nhầm id) → chưa từng xoá được. Nay hiện khi đang sửa.
     · Lưu chi tiết xong gốc nạp lại danh sách GÓI (bảng chi tiết đứng im) → nay nạp lại bảng chi tiết.
     · Thêm gói mới xong gốc không nhớ ID trả về → bấm Lưu lần hai là thêm TRÙNG, không thêm được chi tiết.
       Nay nhớ ID (data.Id như gốc định dùng), chuyển sang sửa và mở khối chi tiết.
   Giữ như gốc: ô "Ghi chú" của chính sách–gói hiện nhưng KHÔNG gửi đi (save gốc không có strGhiChu).
   Bỏ: ảnh minh hoạ Upload/images/img-support.svg ở cột phải biểu mẫu gói (trang trí).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('svcs-goihotro');
    if (!root) return;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function cn() { return (ums.state && ums.state.chucNangId) || ''; }
    function loi(t) { return function (err) { ums.api.handle(err, t); }; }
    function hieuLuc(v) { return String(v) === '1' ? 'Có' : (String(v) === '0' ? 'Không' : e(v)); }

    /* ---------- Khung ---------- */
    function sel(k, ph) {
        return '<select class="ums-select" data-f="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>';
    }
    function inp(k, date) {
        return '<input class="ums-input" data-f="' + k + '"' + (date ? ' data-date' : '') + ' autocomplete="off">';
    }
    function hieuLucSel(k) {
        return '<select class="ums-select" data-f="' + k + '" data-required><option value="1">Có</option><option value="0">Không</option></select>';
    }

    root.innerHTML = ums.pat.page('Gói hỗ trợ', '') +
        '<div data-z="dau">' +
            pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
                '<div class="ums-field">' + sel('lcd', 'Chọn chế độ') + '</div>' +
                '<div class="ums-field">' + sel('ldt', 'Chọn đối tượng') + '</div>' +
                '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '</div>' }) +
            '<div class="ghtr-cols">' +
                pat.panel({ title: 'Gói hỗ trợ', icon: 'fa-headset', count: 'ngoi', flush: true, zone: 'bgoi',
                    tools: ui.btn('add', { mod: 'out-primary', attr: { 'data-a': 'themgoi' } }) }) +
                pat.panel({ title: 'Chính sách - Gói hỗ trợ', icon: 'fa-books', count: 'ncs', flush: true, zone: 'bcs',
                    tools: ui.btn('add', { mod: 'out-success', attr: { 'data-a': 'themcs' } }) }) +
            '</div>' +
        '</div>' +
        /* Biểu mẫu gói (zoneEdit gốc) */
        '<div data-z="goiform" hidden>' +
            pat.panel({ title: 'Gói hỗ trợ', icon: 'fa-headset', cls: 'ghtr-form',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoagoi', hidden: 'hidden' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luugoi' } }),
                body: '<div class="ums-legend">Thông tin gói hỗ trợ</div>' +
                    '<div class="ums-grid ums-grid--2">' +
                        ui.field('Mã', inp('gma')) + ui.field('Tên', inp('gten')) +
                    '</div>' }) +
            '<div data-z="ctkhoi" hidden>' +
                pat.panel({ title: 'Gói hỗ trợ chi tiết', icon: 'fa-list-check', count: 'nct', flush: true,
                    tools: ui.btn('add', { text: 'Thêm gói hỗ trợ', mod: 'out-success', attr: { 'data-a': 'themct' } }),
                    body: '<div class="ghtr-chon">' + sel('ggoi', 'Chọn gói hỗ trợ') + '</div><div data-z="bct"></div>' }) +
            '</div>' +
        '</div>' +
        /* Biểu mẫu chính sách – gói (myModal_DoiTuong gốc) */
        '<div data-z="csform" hidden>' +
            pat.panel({ title: 'Gói hỗ trợ - đối tượng', icon: 'fa-books',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoacs', hidden: 'hidden' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luucs' } }),
                body: '<div class="ums-grid ums-grid--2">' +
                    ui.field('Chế độ', sel('ccd', 'Chọn chế độ')) +
                    ui.field('Đối tượng', sel('cdt', 'Chọn đối tượng')) +
                    ui.field('Gói hỗ trợ', sel('cgoi', 'Chọn gói hỗ trợ')) +
                    ui.field('Thời gian', sel('ctg', 'Chọn học kỳ')) +
                    ui.field('Hiệu lực', hieuLucSel('chl')) +
                    '<div style="grid-column:1 / -1">' + ui.field('Ghi chú', inp('cgc')) + '</div>' +
                    '</div>' }) +
        '</div>';
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k) ? pat.val(f(k)) : ''; }
    function dat(k, val) {
        var el = f(k);
        if (!el) return;
        el.value = e(val);
        if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
        if (el._flatpickr) el._flatpickr.setDate(e(val) || null, false, 'd/m/Y');
    }

    /* ---------- Nguồn ô chọn ---------- */
    var dmCheDo = ums.api.dm('QLTC.CDCS');
    dmCheDo.then(function (d) {
        pat.fill(f('lcd'), d, { head: pat.dmTitle(d) || 'Chọn chế độ' });
        pat.fill(f('ccd'), d, { head: pat.dmTitle(d) || 'Chọn chế độ' });
    }).catch(loi('chế độ chính sách'));
    /* getList_CheDoChinhSach gốc: đối tượng lấy từ khai báo chế độ – đối tượng, nạp MỘT lần lúc mở màn */
    ums.api.call({ action: 'SV_ChinhSach_DT/LayDanhSach', method: 'GET', silent: true,
        strTuKhoa: '', strCheDoChinhSach_Id: '', strDoiTuong_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (r) {
            var d = arr(r.data);
            pat.fill(f('ldt'), d, { id: 'DOITUONG_ID', name: 'DOITUONG_TEN', head: 'Chọn đối tượng' });
            pat.fill(f('cdt'), d, { id: 'DOITUONG_ID', name: 'DOITUONG_TEN', head: 'Chọn đối tượng' });
        }).catch(loi('đối tượng'));
    ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 })
        .then(function (d) { pat.fill(f('ctg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' }); })
        .catch(loi('thời gian đào tạo'));
    var dsKhoanThu = ums.api.call({ action: 'TC_KhoanThu/LayDanhSach', method: 'GET', silent: true,
        strTuKhoa: '', pageIndex: 1, pageSize: 10000, strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: '' })
        .then(function (r) { return arr(r.data); });
    dsKhoanThu.catch(loi('khoản thu'));

    /* =================================================================
       Danh sách gói hỗ trợ (trái)
       ================================================================= */
    var dsGoi = [];
    function napGoi() {
        return ums.api.call({ action: 'SV_GoiHoTro/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) {
                dsGoi = arr(r.data);
                z('ngoi').textContent = '(' + (Number(r.pager) || dsGoi.length) + ')';
                ui.table({ el: z('bgoi'), rows: dsGoi, empty: 'Chưa có gói hỗ trợ', columns: [
                    { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                    { title: 'Tên', prop: 'TEN' },
                    { title: 'Chi tiết', cls: 'is-center is-actions', render: function (x, i) {
                        return ui.iconBtn('edit', String(i)); } }
                ] });
                pat.fill(f('ggoi'), dsGoi, { head: 'Chọn gói hỗ trợ' });
                pat.fill(f('cgoi'), dsGoi, { head: 'Chọn gói hỗ trợ' });
            })
            .catch(function (err) { z('bgoi').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách gói hỗ trợ'); });
    }

    /* =================================================================
       Danh sách chính sách – gói hỗ trợ (phải), phân trang máy chủ
       ================================================================= */
    var dsCS = [], trangCS = 1, coCS = 10;
    function napCS(p) {
        trangCS = p || 1;
        z('bcs').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: 'SV_CS_DoiTuong/LayDanhSach', method: 'GET',
            strTuKhoa: (f('q').value || '').trim(), strDoiTuong_Id: v('ldt'), strCheDoChinhSach_Id: v('lcd'),
            strDaoTao_ThoiGianDaoTao_Id: '', strTaiChinh_CS_GoiHoTro_Id: '', strNguoiTao_Id: '',
            pageIndex: trangCS, pageSize: coCS })
            .then(function (r) {
                dsCS = arr(r.data);
                var tong = Number(r.pager) || 0;
                z('ncs').textContent = '(' + tong + ')';
                ui.table({ el: z('bcs'), rows: dsCS, empty: 'Không có dữ liệu', columns: [
                    { title: 'Chế độ', prop: 'CHEDOCHINHSACH_TEN' },
                    { title: 'Đối tượng', prop: 'DOITUONG_TEN' },
                    { title: 'Gói hỗ trợ', prop: 'TENGOIHOTRO' },
                    { title: 'Thời gian', prop: 'DAOTAO_THOIGIANDAOTAO', cls: 'is-nowrap' },
                    { title: 'Hiệu lực', cls: 'is-center', render: function (x) { return esc(hieuLuc(x.HIEULUC)); } },
                    { title: 'Chi tiết', cls: 'is-center is-actions', render: function (x, i) {
                        return ui.iconBtn('edit', String(i)); } }
                ], page: { index: trangCS, size: coCS, total: tong,
                    onChange: function (p) { napCS(p); }, onSize: function (s) { coCS = s; napCS(1); } } });
            })
            .catch(function (err) { z('bcs').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chính sách - gói hỗ trợ'); });
    }

    function veDau() {
        ['goiform', 'csform'].forEach(function (k) { if (!z(k).hidden) ui.swap(z(k), z('dau')); });
    }

    /* =================================================================
       Biểu mẫu gói + chi tiết gói
       ================================================================= */
    var goiId = '';
    function moGoi(row) {
        goiId = row ? e(row.ID) : '';
        dat('gma', row ? row.MA : '');
        dat('gten', row ? row.TEN : '');
        dat('ggoi', goiId);
        capNhatDauGoi();
        ui.swap(z('dau'), z('goiform'));
        if (goiId) napCT(1);
    }
    function capNhatDauGoi() {
        var t = z('goiform').querySelector('.ums-panel__title');
        if (t) t.innerHTML = '<i class="fa-light fa-headset"></i> ' + esc((goiId ? 'Sửa' : 'Thêm mới') + ' - Gói hỗ trợ');
        root.querySelector('[data-a="xoagoi"]').hidden = !goiId;
        z('ctkhoi').hidden = !goiId;
    }
    function luuGoi() {
        var sua = !!goiId;
        ums.api.call({ action: sua ? 'SV_GoiHoTro/CapNhat' : 'SV_GoiHoTro/ThemMoi',
            strId: goiId, strChucNang_Id: cn(), strTen: (f('gten').value || '').trim(), strMa: (f('gma').value || '').trim(),
            strNguoiThucHien_Id: uid() })
            .then(function (r) {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                if (!sua) {
                    var id = r.raw && (r.raw.Id || r.raw.ID);
                    if (id) { goiId = String(id); capNhatDauGoi(); napCT(1); }
                    else veDau();                     // không có ID trả về thì quay về danh sách, khỏi thêm trùng
                }
                return napGoi().then(function () { if (goiId) dat('ggoi', goiId); });
            })
            .catch(loi('lưu gói hỗ trợ'));
    }
    function xoaGoi() {
        if (!goiId) return;
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: 'SV_GoiHoTro/Xoa', strIds: goiId, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); veDau(); napGoi(); })
                .catch(loi('xóa gói hỗ trợ'));
        });
    }

    var dsCT = [], trangCT = 1, coCT = 10;
    function napCT(p) {
        trangCT = p || 1;
        var goi = v('ggoi');
        if (!goi) { z('bct').innerHTML = ui.empty('Chọn gói hỗ trợ'); z('nct').textContent = ''; return; }
        z('bct').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'SV_GoiHoTro_ChiTiet/LayDanhSach', method: 'GET',
            strTuKhoa: '', strTaiChinh_CacKhoanThu_Id: '', strTaiChinh_ChinhSach_Goi_Id: goi, strDonViTinh_Id: '',
            strKieuTinh_Id: '', strQuyDinhThoiGian_Id: '', strNguoiTao_Id: '', pageIndex: trangCT, pageSize: coCT })
            .then(function (r) {
                dsCT = arr(r.data);
                var tong = Number(r.pager) || 0;
                z('nct').textContent = '(' + tong + ')';
                ui.table({ el: z('bct'), rows: dsCT, empty: 'Chưa có chi tiết', columns: [
                    { title: 'Khoản được nhận', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { title: 'Mức nhận', prop: 'MUCHUONG', cls: 'is-right is-nowrap' },
                    { title: 'Đơn vị tính', prop: 'DONVITINH_TEN' },
                    { title: 'Kiểu tính', prop: 'KIEUTINH_TEN' },
                    { title: 'Quy định thời gian', prop: 'QUYDINHTHOIGIAN_TEN' },
                    { title: 'Ngày bắt đầu', prop: 'PHAMVI_BATDAU_NGAY_THANG_', cls: 'is-center is-nowrap' },
                    { title: 'Ngày kết thúc', prop: 'PHAMVI_KETTHUC_NGAY_THANG_', cls: 'is-center is-nowrap' },
                    { title: 'Ghi chú', prop: 'GHICHU' },
                    { title: 'Chi tiết', cls: 'is-center is-actions', render: function (x, i) {
                        return ui.iconBtn('edit', String(i)); } }
                ], page: { index: trangCT, size: coCT, total: tong,
                    onChange: function (q) { napCT(q); }, onSize: function (s) { coCT = s; napCT(1); } } });
            })
            .catch(function (err) { z('bct').innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết gói hỗ trợ'); });
    }
    /* Đổi gói ở khối chi tiết = mở gói đó để sửa (select2:select dropSearch_GoiHoTro gốc) */
    jQuery(f('ggoi')).on('select2:select', function () {
        var r = dsGoi.filter(function (x) { return String(x.ID) === v('ggoi'); })[0];
        if (!r) return;
        goiId = e(r.ID);
        dat('gma', r.MA);
        dat('gten', r.TEN);
        capNhatDauGoi();
        napCT(1);
    });

    /* Biểu mẫu chi tiết gói (myModal_ChiTiet gốc) — trong trang, thay chỗ biểu mẫu gói đang mở */
    function hopCT(row) {
        var tenGoi = (dsGoi.filter(function (x) { return String(x.ID) === String(goiId); })[0] || {}).TEN || '';
        var btns = [];
        if (row) {
            btns.push({ text: 'Xóa', kind: 'del', onClick: function (dlg) {
                ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
                    if (!ok) return;
                    ums.api.call({ action: 'SV_GoiHoTro_ChiTiet/Xoa', strIds: row.ID, strNguoiThucHien_Id: uid() })
                        .then(function () { ui.toast('Xóa thành công!', 'ok'); dlg.close(); napCT(trangCT); })
                        .catch(loi('xóa chi tiết gói hỗ trợ'));
                });
                return false;
            } });
        }
        btns.push({ text: 'Lưu', kind: 'save', onClick: function (dlg) {
            function g(k) { var el = dlg.body.querySelector('[data-h="' + k + '"]'); return el ? (el.value || '').trim() : ''; }
            var sua = !!row;
            ums.api.call({ action: sua ? 'SV_GoiHoTro_ChiTiet/CapNhat' : 'SV_GoiHoTro_ChiTiet/ThemMoi',
                strId: sua ? row.ID : '', strChucNang_Id: cn(),
                strNgay_Thang_BatDau: g('bd'), strNgay_Thang_KetThuc: g('kt'), iThuTu: g('tt'),
                strTaiChinh_CS_GoiHoTro_Id: goiId, strTaiChinh_CacKhoanThu_Id: g('kt0'), strDonViTinh_Id: g('dvt'),
                strKieuTinh_Id: g('kieu'), strQuyDinhThoiGian_Id: g('qd'), dMucHuong: g('muc'), strGhiChu: g('gc'),
                strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok'); dlg.close(); napCT(sua ? trangCT : 1); })
                .catch(loi('lưu chi tiết gói hỗ trợ'));
            return false;
        } });
        function s(k, ph) { return '<select class="ums-select" data-h="' + k + '" data-ph="' + esc(ph) + '"><option value=""></option></select>'; }
        function t(k, date) { return '<input class="ums-input" data-h="' + k + '"' + (date ? ' data-date' : '') + ' autocomplete="off">'; }
        var dlg = pat.formTrang({ host: root, title: 'Chi tiết gói hỗ trợ' + (tenGoi ? ' ' + tenGoi : ''), icon: 'fa-list-check', cols: 1,
            body: '<div class="ums-grid ums-grid--2">' +
                ui.field('Khoản được nhận', s('kt0', 'Chọn khoản được nhận')) +
                ui.field('Mức nhận', t('muc')) +
                ui.field('Đơn vị tính', s('dvt', 'Chọn đơn vị tính')) +
                ui.field('Kiểu tính', s('kieu', 'Chọn kiểu tính')) +
                ui.field('Quy định thời gian', s('qd', 'Chọn quy định thời gian')) +
                ui.field('Ngày bắt đầu', t('bd', true)) +
                ui.field('Ngày kết thúc', t('kt', true)) +
                '<div style="grid-column:1 / -1">' + ui.field('Ghi chú', t('gc')) + '</div>' +
                ui.field('Thứ tự', t('tt')) +
                '</div>',
            buttons: btns });
        function h(k) { return dlg.body.querySelector('[data-h="' + k + '"]'); }
        function datH(k, val) {
            var el = h(k);
            el.value = e(val);
            if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
            if (el._flatpickr) el._flatpickr.setDate(e(val) || null, false, 'd/m/Y');
        }
        ui.enhance(dlg.body);
        var cho = [
            dsKhoanThu.then(function (d) { pat.fill(h('kt0'), d, { head: 'Chọn khoản được nhận' }); }),
            ums.api.dm('TAICHINH.CHINHSACH.DONVITINH').then(function (d) { pat.fill(h('dvt'), d, { head: pat.dmTitle(d) || 'Chọn đơn vị tính' }); }),
            ums.api.dm('TAICHINH.CHINHSACH.KIEUITINH').then(function (d) { pat.fill(h('kieu'), d, { head: pat.dmTitle(d) || 'Chọn kiểu tính' }); }),
            ums.api.dm('TAICHINH.CHINHSACH.QUYDINHTHOIGIAN').then(function (d) { pat.fill(h('qd'), d, { head: pat.dmTitle(d) || 'Chọn quy định thời gian' }); })
        ];
        Promise.all(cho).catch(loi('danh mục chi tiết gói')).then(function () {
            if (!row) return;
            datH('kt0', row.TAICHINH_CACKHOANTHU_ID);
            datH('muc', row.MUCHUONG);
            datH('dvt', row.DONVITINH_ID);
            datH('kieu', row.KIEUTINH_ID);
            datH('qd', row.QUYDINHTHOIGIAN_ID);
            datH('bd', row.PHAMVI_BATDAU_NGAY_THANG_);
            datH('kt', row.PHAMVI_KETTHUC_NGAY_THANG_);
            datH('gc', row.GHICHU);
            datH('tt', row.THUTU);
        });
    }

    /* =================================================================
       Biểu mẫu chính sách – gói hỗ trợ
       ================================================================= */
    var csDong = null;
    function moCS(row) {
        csDong = row || null;
        dat('ccd', row ? row.CHEDOCHINHSACH_ID : '');
        dat('cdt', row ? row.DOITUONG_ID : '');
        dat('cgoi', row ? row.TAICHINH_CHINHSACH_GOIHOTRO_ID : '');
        dat('ctg', row ? row.DAOTAO_THOIGIANDAOTAO_ID : '');
        dat('chl', row ? e(row.HIEULUC) || '1' : '1');
        dat('cgc', row ? row.GHICHU : '');
        var t = z('csform').querySelector('.ums-panel__title');
        if (t) t.innerHTML = '<i class="fa-light fa-books"></i> ' + esc((row ? 'Sửa' : 'Thêm mới') + ' - Gói hỗ trợ - đối tượng');
        root.querySelector('[data-a="xoacs"]').hidden = !row;
        ui.swap(z('dau'), z('csform'));
    }
    function luuCS() {
        var sua = !!csDong;
        ums.api.call({ action: sua ? 'SV_CS_DoiTuong/CapNhat' : 'SV_CS_DoiTuong/ThemMoi',
            strId: sua ? csDong.ID : '', strChucNang_Id: cn(), strTaiChinh_CS_GoiHoTro_Id: v('cgoi'),
            strNguoiThucHien_Id: uid(), strDoiTuong_Id: v('cdt'), strCheDoChinhSach_Id: v('ccd'),
            strDaoTao_ThoiGianDaoTao_Id: v('ctg'), dHieuLuc: v('chl') })
            .then(function () {
                ui.toast(sua ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                veDau();
                napCS(sua ? trangCS : 1);
            })
            .catch(loi('lưu chính sách - gói hỗ trợ'));
    }
    function xoaCS() {
        if (!csDong) return;
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xóa' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: 'SV_CS_DoiTuong/Xoa', strIds: csDong.ID, strNguoiThucHien_Id: uid() })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); veDau(); napCS(trangCS); })
                .catch(loi('xóa chính sách - gói hỗ trợ'));
        });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        /* Nút Sửa trong ba bảng (ui.iconBtn — data-id = chỉ số dòng) */
        var sb = ev.target.closest('[data-act="edit"]');
        if (sb && root.contains(sb)) {
            var bang = sb.closest('[data-z]').getAttribute('data-z'), k = Number(sb.getAttribute('data-id'));
            if (bang === 'bgoi') moGoi(dsGoi[k]);
            else if (bang === 'bcs') moCS(dsCS[k]);
            else if (bang === 'bct') hopCT(dsCT[k]);
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') napCS(1);
        else if (a === 'themgoi') moGoi(null);
        else if (a === 'luugoi') luuGoi();
        else if (a === 'xoagoi') xoaGoi();
        else if (a === 'themct') hopCT(null);
        else if (a === 'themcs') moCS(null);
        else if (a === 'luucs') luuCS();
        else if (a === 'xoacs') xoaCS();
        else if (a === 'dong') veDau();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); napCS(1); } });

    napGoi();
    napCS(1);
})();
