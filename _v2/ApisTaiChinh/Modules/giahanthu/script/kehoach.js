/* =========================================================================
   Kế hoạch thu tiền — gia hạn thu
   Bản gốc: ApisTaiChinh/Modules/giahanthu/script/kehoach.js
   ---------------------------------------------------------------------------
   Dùng chung: ../../dulieuhocphi/scripts/_chung.js (ums.hocphi — hộp chọn
   sinh viên genModal_SinhVien, đổ ô chọn, chạy hàng loạt).

   Kế hoạch (ums.crud), tiền tố TC_KeHoachThu_GiaHan/:
       LayDSTaiChinh_KeHoachThuTien                GET, không phân trang
       Them_ / Sua_TaiChinh_KeHoachThuTien         POST (Sua khi có strId)
       Xoa_TaiChinh_KeHoachThuTien                 POST, từng id đã chọn
   Trong biểu mẫu SỬA (bản gốc chỉ hiện các khối .btnOpenDelete khi sửa):
       Đối tượng thuộc phạm vi       LayDS/Them/Xoa_TaiChinh_PhamViThu
       Đối tượng không thuộc phạm vi LayDS/Them/Xoa_TaiChinh_PhamViThu_Khong
       Khoản thu - thời gian kỳ, đợt LayDS/Them/Xoa_TaiChinh_KeHoach_Khoan
                                     (một lời gọi Them mỗi khoản thu đã chọn)
       Đối tượng gia hạn             LayDSTaiChinh_PhamViThu_GiaHan,
                                     Them_/Sua_/Xoa_TaiChinh_PhamViThu_GiHan ("GiHan" đúng như gốc)
     Nguồn phạm vi:
       LayDSThoiGian → LayDSKeHoachDangKyHoc      "Phạm vi là kế hoạch đăng ký học"
       hộp chọn SV (QLSV_NGUOIHOC_ID) hoặc "Thêm từng khoá / chương trình / lớp"
       SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh → SV_QuyetDinh/LayDanhSach   (gia hạn)
       ums.report.importChung IMPORTWITHPROC_KHTPN "Thêm từ file"
   Các khoản không theo kế hoạch (vùng riêng):
       pkg_taichinh_kehoachthu_giahan.LayDSTC_KhoanThu_KhongKTra / Them_ / Xoa_
       strPhamViApDung_Id = QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID (ghép
       chuỗi, đúng như bản gốc) hoặc id khoá/chương trình/lớp;
       strTaiChinh_CacKhoanThu_Id = các khoản đã chọn nối bằng dấu phẩy.
   Tình trạng nợ (vùng riêng, cần chọn kế hoạch trước):
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen    hệ đào tạo (genBoLoc_HeKhoa)
       pkg_taichinh_thuchi2.ThongKeNoPhiTheoKhoaHoc      danh sách nợ theo khoá
       pkg_taichinh_kehoachthu_giahan.ThemPhamViKeHoachKhongThuTien | ThemPhamViKeHoachThuTien
                                                         (kế hoạch × dòng đã chọn)
   Chế độ: pkg_taichinh_chung.LayTTThamSoChungThanhToan / CapNhatThamSoChanThanhToan
   Báo cáo: ums.report — khoá strTuKhoa / strDaoTao_ThoiGianDaoTao_Id /
       strHB_QuyHocBong_Id (ô không tồn tại → rỗng, như gốc) + strHocBong_Id
       cho MỖI kế hoạch đã chọn (tên khoá chép từ màn học bổng — giữ nguyên).

   Khác bản gốc, có chủ đích:
     · Vùng "Tình trạng nợ": bản gốc KHÔNG nạp được danh sách (lời gọi
       getList_TinhTrangNo bị comment, nút Tìm kiếm trùng id #btnSearch nên
       bấm chỉ tải lại danh sách kế hoạch). Ở đây nút Tìm kiếm của vùng nạp
       ThongKeNoPhiTheoKhoaHoc. Ô từ khoá của vùng này bản gốc không gửi đi — bỏ.
     · Các nút "Thêm từ file" (IMPORTWITHPROC_KHTPN) của bản gốc không chạy
       (sự kiện gắn vào #zonebtnBaoCao_KH_Import — không tồn tại). Ở đây nối
       ums.report.importChung; CHƯA RÕ thủ tục import lấy id kế hoạch từ đâu.
     · Thêm phạm vi / khoản / gia hạn: bản gốc đếm tiến độ trên vùng
       #zoneprocessProGes không tồn tại nên không bao giờ nạp lại bảng. Ở đây
       chạy bằng ums.ui.batch rồi nạp lại bảng tương ứng; hộp "phạm vi là kế
       hoạch đăng ký" đóng sau khi lưu.
     · "Các khoản không theo kế hoạch → Thêm mới" bắt buộc chọn khoản thu
       (bản gốc cho gửi khoản rỗng).
     · Lưu kế hoạch xong quay về danh sách (bản gốc ở lại biểu mẫu; khi thêm
       mới id kế hoạch không được giữ nên các khối con vẫn ẩn).
   Bỏ: mã chết trong comment, getList_ThoiGianDaoTao gắn vào #dropThoiGianKT
   / #dropThoiGianKyDot — giữ, chỉ nạp lúc mở hộp; txtAAAA/dropAAAA gửi rỗng.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi, esc = ui.esc;
    var elMain = document.getElementById('kehoach');
    var elKKH = document.getElementById('kehoachKhoanKhongKH');
    var elTTN = document.getElementById('kehoachTinhTrangNo');
    var P = 'TC_KeHoachThu_GiaHan/';
    var HIEULUC = { items: [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] };

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }
    function uid() { return (ums.session && ums.session.userId) || ''; }

    /* =====================================================================
       Danh sách kế hoạch
       ===================================================================== */
    var crud = ums.crud({
        root: elMain,
        title: 'Kế hoạch thu tiền - gia hạn thu',
        formTitle: 'kế hoạch',
        icon: 'fa-calendar-lines',
        listTitle: 'Danh sách kế hoạch',
        autoload: false,
        filters: [
            { key: 'hieuLuc', type: 'select', label: 'Chọn hiệu lực', source: HIEULUC },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return {
                    action: P + 'LayDSTaiChinh_KeHoachThuTien',
                    method: 'GET',
                    type: 'GET',
                    strTuKhoa: f.q,
                    strNguoiThucHien_Id: '',
                    dHieuLuc: f.hieuLuc
                };
            }
        },
        columns: [
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) {
                return String(r.HIEULUC) === '1' ? ui.badge('Có hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute');
            } },
            { title: 'Kế hoạch thu tiền', prop: 'TENKEHOACH' },
            { title: 'Từ ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Chế độ cảnh báo cho SV', cls: 'is-center', render: function (r) { return r.BATCHEDOCANHBAOCHOSV ? ui.badge('Thông báo cho SV', 'info') : ''; } },
            { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
            { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }
        ],
        toolbar: [
            { text: 'Xác định phạm vi, khoản nợ', icon: 'fa-magnifying-glass-dollar', onClick: function (c) { openTTN(c); } },
            { text: 'Các khoản không theo kế hoạch', icon: 'fa-file-magnifying-glass', onClick: function () { openKKH(); } },
            { text: 'Chế độ', icon: 'fa-sliders', onClick: function () { cheDo(); } }
        ],
        fields: [
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', span: true },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: HIEULUC, value: '1' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Từ ngày', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Đến ngày', type: 'date' }
        ],
        formCols: 3,
        save: function (v, row) {
            return {
                action: P + (row ? 'Sua_TaiChinh_KeHoachThuTien' : 'Them_TaiChinh_KeHoachThuTien'),
                type: 'POST',
                strId: row ? row.ID : '',
                strTenKeHoach: v.strTenKeHoach,
                strNgayBatDau: v.strNgayBatDau,
                strNgayKetThuc: v.strNgayKetThuc,
                dHieuLuc: v.dHieuLuc,
                strNguoiThucHien_Id: ''
            };
        },
        onForm: function (row, c, extra) { if (row) openSub(row, extra); },
        rowDelete: false,
        formDelete: false,
        remove: function (ids) {
            return ids.map(function (id) { return { action: P + 'Xoa_TaiChinh_KeHoachThuTien', strId: id, strNguoiThucHien_Id: '' }; });
        }
    });

    /* Bản gốc: ô hiệu lực không có mục trống, mặc định "Có hiệu lực" */
    crud.sourcesReady.then(function () {
        var el = elMain.querySelector('[data-scope="filter"][data-k="hieuLuc"]');
        el.value = '1';
        jQuery(el).trigger('change.select2');
        crud.load();
    });

    /* Báo cáo — đặt cạnh nút trên đầu trang */
    var rp = document.createElement('span');
    elMain.querySelector('.ums-page__actions').insertBefore(rp, elMain.querySelector('.ums-page__actions').firstChild);
    ums.report.mount(rp, {
        collect: function (add) {
            add('strTuKhoa', '');
            add('strDaoTao_ThoiGianDaoTao_Id', '');
            add('strHB_QuyHocBong_Id', '');
            crud.pickedRows().forEach(function (r) { add('strHocBong_Id', r.ID); });
        }
    });

    /* =====================================================================
       Bốn khối con của một kế hoạch
       ===================================================================== */
    var KH = null, EX = null;
    var KIND = {
        PHAMVI:      { title: 'Đối tượng thuộc phạm vi', icon: 'fa-users-viewfinder', list: 'LayDSTaiChinh_PhamViThu', them: 'Them_TaiChinh_PhamViThu', xoa: 'Xoa_TaiChinh_PhamViThu' },
        KHONGPHAMVI: { title: 'Đối tượng không thuộc phạm vi', icon: 'fa-user-slash', list: 'LayDSTaiChinh_PhamViThu_Khong', them: 'Them_TaiChinh_PhamViThu_Khong', xoa: 'Xoa_TaiChinh_PhamViThu_Khong' },
        GIAHAN:      { title: 'Đối tượng gia hạn', icon: 'fa-calendar-clock', list: 'LayDSTaiChinh_PhamViThu_GiaHan', them: 'Them_TaiChinh_PhamViThu_GiHan', sua: 'Sua_TaiChinh_PhamViThu_GiHan', xoa: 'Xoa_TaiChinh_PhamViThu_GiHan' }
    };
    var data = { PHAMVI: [], KHONGPHAMVI: [], GIAHAN: [], KHOAN: [] };

    function btn(act, icon, text, mod, title) {
        return '<button type="button" class="ums-btn ums-btn--' + (mod || 'out-primary') + ' ums-btn--sm" data-s="' + act + '"' + (title ? ' title="' + esc(title) + '"' : '') + '><i class="fa-light ' + icon + '"></i><span>' + esc(text) + '</span></button>';
    }
    function box(k, icon, title, tools, before) {
        return '<div><div class="ums-panel"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light ' + icon + '"></i> ' + esc(title) + '</div></div>' +
            (before || '') +
            '<div class="ums-panel__body ums-panel__body--flush" data-sb="' + k + '"></div>' +
            '<div class="ums-panel__foot ums-row--end kh-foot">' + tools + '</div></div></div>';
    }
    function phamViTools(k) {
        return btn('xoa:' + k, 'fa-trash-can', 'Xóa', 'quiet') +
            btn('file:' + k, 'fa-file-plus', 'Thêm từ file') +
            btn('khdk:' + k, 'fa-file-circle-plus', 'Kế hoạch ĐK học', '', 'Thêm phạm vi là kế hoạch đăng ký học') +
            btn('hekhoa:' + k, 'fa-rectangle-history-circle-plus', 'Hệ, khóa, CT, SV…', '', 'Thêm phạm vi là hệ, khóa, chương trình, lớp hoặc sinh viên') +
            (k === 'GIAHAN' ? btn('qd:GIAHAN', 'fa-gavel', 'Từ quyết định', '', 'Thêm phạm vi đi từ quyết định') : '');
    }

    function openSub(row, extra) {
        KH = row; EX = extra;
        extra.innerHTML =
            '<div class="ums-grid ums-grid--2">' +
                box('PHAMVI', KIND.PHAMVI.icon, KIND.PHAMVI.title, phamViTools('PHAMVI')) +
                box('KHONGPHAMVI', KIND.KHONGPHAMVI.icon, KIND.KHONGPHAMVI.title, phamViTools('KHONGPHAMVI')) +
                box('KHOAN', 'fa-money-check-dollar-pen', 'Khoản thu - thời gian kỳ, đợt',
                    btn('xoa:KHOAN', 'fa-trash-can', 'Xóa', 'quiet') + btn('addkhoan', 'fa-plus', 'Thêm dòng mới')) +
                box('GIAHAN', KIND.GIAHAN.icon, KIND.GIAHAN.title, phamViTools('GIAHAN'),
                    '<div class="ums-panel__body"><div class="ums-row">' +
                        '<div class="ums-u-flex1"><input class="ums-input" data-gh="ngay" placeholder="Gia hạn đến ngày (dùng khi thêm)" autocomplete="off"></div>' +
                        '<div class="ums-u-flex1"><input class="ums-input" data-gh="mota" placeholder="Mô tả (dùng khi thêm)" autocomplete="off"></div>' +
                        btn('capnhat', 'fa-pen', 'Cập nhật dòng đã sửa', 'primary') +
                    '</div></div>') +
            '</div>';
        ui.datepicker(extra.querySelector('[data-gh="ngay"]'));
        ['PHAMVI', 'KHONGPHAMVI', 'GIAHAN'].forEach(loadPhamVi);
        loadKhoan();
    }
    function sb(k) { return EX.querySelector('[data-sb="' + k + '"]'); }

    function checkCol(k) {
        return { head: '<input type="checkbox" data-ck="' + k + ':all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
            render: function (r, i) { return '<input type="checkbox" data-ck="' + k + ':' + i + '">'; } };
    }
    function checked(k) {
        return Array.prototype.filter.call(sb(k).querySelectorAll('input[data-ck]'), function (x) {
            return x.checked && x.getAttribute('data-ck') !== k + ':all';
        }).map(function (x) { return data[k][Number(x.getAttribute('data-ck').split(':')[1])]; });
    }

    function loadPhamVi(k) {
        var host = sb(k);
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return H.rows({
            action: P + KIND[k].list, method: 'GET', type: 'GET',
            strTaiChinh_KeHoachThu_Id: KH.ID, strNguoiThucHien_Id: ''
        }).then(function (rows) {
            data[k] = rows;
            var cols = [{ title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }];
            if (k === 'GIAHAN') {
                cols.push({ title: 'Gia hạn đến ngày', width: '150px', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-ghr="ngay" data-i="' + i + '" value="' + esc(H.e(r.NGAYKETTHUC)) + '" placeholder="dd/mm/yyyy">';
                } });
                cols.push({ title: 'Mô tả', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-ghr="mota" data-i="' + i + '" value="' + esc(H.e(r.MOTA)) + '">';
                } });
            }
            cols.push(checkCol(k));
            ui.table({ el: host, rows: rows, columns: cols, empty: 'Chưa có phạm vi', tableCls: 'ums-table--lined ums-table--tight' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, KIND[k].title); });
    }

    function loadKhoan() {
        var host = sb('KHOAN');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return H.rows({
            action: P + 'LayDSTaiChinh_KeHoach_Khoan', method: 'GET', type: 'GET',
            strTaiChinh_KeHoachThu_Id: KH.ID, strNguoiThucHien_Id: ''
        }).then(function (rows) {
            data.KHOAN = rows;
            ui.table({
                el: host, rows: rows, empty: 'Chưa có khoản thu', tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                    { title: 'Thời gian', prop: 'THOIGIAN' },
                    checkCol('KHOAN')
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khoản thu - thời gian'); });
    }

    /** save_PhamVi / save_KhongPhamVi / save_PhamVi_GiaHan(strPhamViApDung_Id, strId) */
    function callThem(k, phamViId, row) {
        if (k !== 'GIAHAN') {
            return { action: P + KIND[k].them, type: 'POST', strTaiChinh_KeHoachThu_Id: KH.ID, strPhamViApDung_Id: phamViId, strNguoiThucHien_Id: '' };
        }
        var strId = row ? row.ID : '';
        var ngay, mota;
        if (row) {
            var i = data.GIAHAN.indexOf(row);
            ngay = sb('GIAHAN').querySelector('[data-ghr="ngay"][data-i="' + i + '"]').value;
            mota = sb('GIAHAN').querySelector('[data-ghr="mota"][data-i="' + i + '"]').value;
        } else {
            ngay = EX.querySelector('[data-gh="ngay"]').value;
            mota = EX.querySelector('[data-gh="mota"]').value;
        }
        return {
            action: P + (strId ? KIND.GIAHAN.sua : KIND.GIAHAN.them),
            type: 'POST',
            strId: strId,
            strTaiChinh_KeHoachThu_Id: KH.ID,
            strPhamViApDung_Id: phamViId,
            strNgayKetThuc: (ngay || '').trim(),
            strMoTa: (mota || '').trim(),
            strNguoiThucHien_Id: ''
        };
    }
    function themPhamVi(k, ids) {
        return H.runAll(ids.map(function (id) { return callThem(k, id); }), 'Đang thêm phạm vi', function () { loadPhamVi(k); });
    }

    function xoa(k) {
        var rows = checked(k);
        if (!rows.length) return ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn');
        var action = k === 'KHOAN' ? P + 'Xoa_TaiChinh_KeHoach_Khoan' : P + KIND[k].xoa;
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            H.runAll(rows.map(function (r) { return { action: action, strId: r.ID, strNguoiThucHien_Id: '' }; }), 'Đang xoá', function () {
                if (k === 'KHOAN') loadKhoan(); else loadPhamVi(k);
            });
        });
    }

    /* --- "Cập nhật" gia hạn: các dòng có ngày / mô tả đã sửa --- */
    function capNhatGiaHan() {
        var rows = [];
        data.GIAHAN.forEach(function (r, i) {
            var n = sb('GIAHAN').querySelector('[data-ghr="ngay"][data-i="' + i + '"]');
            var m = sb('GIAHAN').querySelector('[data-ghr="mota"][data-i="' + i + '"]');
            if ((n && n.value !== H.e(r.NGAYKETTHUC)) || (m && m.value !== H.e(r.MOTA))) rows.push(r);
        });
        if (!rows.length) return ui.toast('Không có thay đổi để lưu', 'warn');
        // Bản gốc: save_PhamVi_GiaHan("", id) — strPhamViApDung_Id gửi rỗng khi sửa
        H.runAll(rows.map(function (r) { return callThem('GIAHAN', '', r); }), 'Đang cập nhật gia hạn', function () { loadPhamVi('GIAHAN'); });
    }

    /* --- Hộp "Phạm vi là kế hoạch đăng ký học" --- */
    function hopKHDK(k) {
        var dlg = ui.dialog({
            title: 'Phạm vi là kế hoạch đăng ký học', icon: 'fa-chalkboard-user', size: 'md',
            body: ui.field('Thời gian', '<select class="ums-select" data-d="tg"><option value="">Chọn học kỳ</option></select>') +
                  ui.field('Kế hoạch đăng ký', '<select class="ums-select" data-d="kh"><option value="">Chọn kế hoạch đăng ký</option></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var id = d.body.querySelector('[data-d="kh"]').value;
                if (!id) { ui.toast('Chọn kế hoạch đăng ký', 'warn'); return false; }
                themPhamVi(k, [id]);
            } }]
        });
        var tg = dlg.body.querySelector('[data-d="tg"]'), kh = dlg.body.querySelector('[data-d="kh"]');
        ui.enhance(dlg.body);
        function loadKH() {
            H.rows({ action: P + 'LayDSKeHoachDangKyHoc', method: 'GET', type: 'GET', strDaoTao_ThoiGianDaoTao_Id: tg.value, strNguoiThucHien_Id: '' })
                .then(function (r) { H.fill(kh, r, { name: 'TENKEHOACH', head: 'Chọn kế hoạch đăng ký' }); }).catch(fail('kế hoạch đăng ký'));
        }
        thoiGian().then(function (r) { H.fill(tg, r, { name: 'THOIGIAN', head: 'Chọn học kỳ' }); }).catch(fail('thời gian'));
        loadKH();
        jQuery(tg).on('select2:select', loadKH);
    }
    var tgP = null;
    function thoiGian() {   // getList_ThoiGianDaoTao
        if (!tgP) tgP = H.rows({ action: P + 'LayDSThoiGian', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' }).catch(function (e) { tgP = null; throw e; });
        return tgP;
    }

    /* --- Hộp "Phạm vi đi từ Quyết định" (chỉ gia hạn) --- */
    function hopQuyetDinh() {
        var dlg = ui.dialog({
            title: 'Thêm phạm vi đi từ Quyết định', icon: 'fa-gavel', size: 'md',
            body: ui.field('Loại quyết định', '<select class="ums-select" data-d="loai"><option value="">Chọn loại quyết định</option></select>') +
                  ui.field('Quyết định', '<select class="ums-select" data-d="qd"><option value="">Chọn quyết định</option></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var id = d.body.querySelector('[data-d="qd"]').value;
                if (!id) { ui.toast('Chọn quyết định', 'warn'); return false; }
                themPhamVi('GIAHAN', [id]);
            } }]
        });
        var loai = dlg.body.querySelector('[data-d="loai"]'), qd = dlg.body.querySelector('[data-d="qd"]');
        ui.enhance(dlg.body);
        H.rows({ action: 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh', method: 'GET', type: 'GET', strNguoiDung_Id: uid() })
            .then(function (r) { H.fill(loai, r, { name: 'TEN', head: 'Chọn loại quyết định' }); }).catch(fail('loại quyết định'));
        jQuery(loai).on('select2:select', function () {
            H.rows({
                action: 'SV_QuyetDinh/LayDanhSach', method: 'GET', type: 'GET',
                strTuKhoa: '', strNamNhapHoc: '', strKhoaQuanLy_Id: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '',
                strChuongTrinh_Id: '', strLopQuanLy_Id: '', strTrangThaiNguoiHoc_Id: '', strQLSV_NguoiHoc_Id: '',
                strLoaiQuyetDinh_Id: loai.value, strCapQuyetDinh_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 100000
            }).then(function (r) { H.fill(qd, r, { name: 'SOQUYETDINH', head: 'Chọn quyết định' }); }).catch(fail('quyết định'));
        });
    }

    /* --- Hộp "Thêm dòng mới" khoản thu - thời gian --- */
    var ktP = null;
    function khoanThu() {
        if (!ktP) ktP = H.rows({
            action: 'TC_KhoanThu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: '', pageIndex: 1, pageSize: 10000, strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
        }).catch(function (e) { ktP = null; throw e; });
        return ktP;
    }
    /* Bản ghi con của kế hoạch → biểu mẫu NGAY TRONG TRANG (BO-CUC luật 1), thay chỗ cả màn (khung chi tiết kế hoạch ẩn đi, đóng thì
       hiện lại). Lưu xong mới đóng; có khoản lỗi thì biểu mẫu ở lại để sửa rồi lưu tiếp (bản hộp thoại đóng ngay lúc bấm Lưu). */
    function hopKhoan() {
        var dlg = ums.pat.formTrang({
            host: elMain, title: 'Thêm Khoản thu - thời gian', icon: 'fa-money-check-dollar-pen',
            body: ui.field('Khoản thu', '<select class="ums-select" multiple data-d="kt" data-ph="Chọn khoản thu"></select>') +
                  ui.field('Thời gian', '<select class="ums-select" data-d="tg"><option value="">Chọn học kỳ</option></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var kts = H.vals(d.body.querySelector('[data-d="kt"]'));
                var tg = d.body.querySelector('[data-d="tg"]').value;
                if (!kts.length) { ui.toast('Chọn khoản thu', 'warn'); return false; }
                H.runAll(kts.map(function (k) {
                    return {
                        action: P + 'Them_TaiChinh_KeHoach_Khoan', type: 'POST',
                        strTaiChinh_KeHoachThu_Id: KH.ID, strDaoTao_ThoiGianDaoTao_Id: tg, strTaiChinh_CacKhoanThu_Id: k, strNguoiThucHien_Id: ''
                    };
                }), 'Đang thêm khoản thu', function (r) {
                    if (!r || !r.fail) d.close();
                    loadKhoan();
                });
                return false;
            } }]
        });
        var kt = dlg.body.querySelector('[data-d="kt"]'), tg = dlg.body.querySelector('[data-d="tg"]');
        ui.enhance(dlg.body);
        khoanThu().then(function (r) { H.fill(kt, r, { name: 'TEN' }); }).catch(fail('khoản thu'));
        thoiGian().then(function (r) { H.fill(tg, r, { name: 'THOIGIAN', head: 'Chọn học kỳ' }); }).catch(fail('thời gian'));
    }

    /* --- Hộp chọn SV / "Thêm từng khoá, chương trình, lớp" --- */
    function hopHeKhoa(k) {
        H.pickSinhVien({
            onPick: function (list) { themPhamVi(k, list.map(function (s) { return s.QLSV_NGUOIHOC_ID; })); },
            onGroup: function (kind, ids) { themPhamVi(k, ids); }
        });
    }

    EX_bind();
    function EX_bind() {
        elMain.addEventListener('click', function (e) {
            var b = e.target.closest('[data-s]');
            if (!b || !elMain.contains(b) || !KH) return;
            var p = b.getAttribute('data-s').split(':');
            switch (p[0]) {
                case 'xoa': xoa(p[1]); break;
                case 'file': ums.report.importChung('Thêm từ file', 'IMPORTWITHPROC_KHTPN', { onDone: function () { loadPhamVi(p[1]); } }); break;
                case 'khdk': hopKHDK(p[1]); break;
                case 'hekhoa': hopHeKhoa(p[1]); break;
                case 'qd': hopQuyetDinh(); break;
                case 'addkhoan': hopKhoan(); break;
                case 'capnhat': capNhatGiaHan(); break;
            }
        });
        elMain.addEventListener('change', function (e) {
            var t = e.target;
            if (!t.matches || !t.matches('input[data-ck$=":all"]')) return;
            var k = t.getAttribute('data-ck').split(':')[0];
            Array.prototype.forEach.call(sb(k).querySelectorAll('input[data-ck]'), function (x) { x.checked = t.checked; });
        });
    }

    /* =====================================================================
       Các khoản không theo kế hoạch
       ===================================================================== */
    var kkhRows = [];
    elKKH.innerHTML =
        '<div class="ums-panel">' +
            '<div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-circle-dollar-to-slot"></i> Các khoản không theo kế hoạch</div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-k': 'back' } }) + '</div>' +
            '</div>' +
            '<div class="ums-panel__body"><div class="ums-row">' +
                '<div class="ums-u-flex1" style="max-width:520px"><select class="ums-select" multiple data-k="loaikhoan" data-ph="Chọn khoản thu"></select></div>' +
                ui.btn('add', { attr: { 'data-k': 'them' } }) +
                '<button type="button" class="ums-btn ums-btn--quiet" data-k="xoa"><i class="fa-light fa-trash-can"></i><span>Xóa</span></button>' +
            '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-k="tbl"></div>' +
        '</div>';
    function kq(k) { return elKKH.querySelector('[data-k="' + k + '"]'); }
    ui.enhance(elKKH);

    function openKKH() {
        ui.swap(elMain, elKKH);
        khoanThu().then(function (r) { H.fill(kq('loaikhoan'), r, { name: 'TEN' }); }).catch(fail('khoản thu'));
        loadKKH();
    }
    function loadKKH() {
        var host = kq('tbl');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'TC_KeHoachThu_GiaHan_MH/DSA4BRIVAh4KKS4gLxUpNB4KKS4vJgoVMyAP',
            func: 'pkg_taichinh_kehoachthu_giahan.LayDSTC_KhoanThu_KhongKTra',
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            kkhRows = Array.isArray(r.data) ? r.data : [];
            ui.table({
                el: host, rows: kkhRows, empty: 'Chưa có khoản không theo kế hoạch',
                columns: [
                    { title: 'Loại khoản', render: function (x) { return esc(H.e(x.TAICHINH_CACKHOANTHU_TEN) + ' - ' + H.e(x.TAICHINH_CACKHOANTHU_MA)); } },
                    { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
                    { head: '<input type="checkbox" data-kx="all">', cls: 'is-center', width: '44px', render: function (x, i) { return '<input type="checkbox" data-kx="' + i + '">'; } }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'các khoản không theo kế hoạch'); });
    }
    function themKKH() {
        var khoan = H.val(kq('loaikhoan'));
        if (!khoan) return ui.toast('Chọn khoản thu trước khi thêm phạm vi', 'warn');
        function call(pv) {
            return {
                action: 'TC_KeHoachThu_GiaHan_MH/FSkkLB4VAh4KKS4gLxUpNB4KKS4vJgoVMyAP',
                func: 'pkg_taichinh_kehoachthu_giahan.Them_TC_KhoanThu_KhongKTra',
                strTaiChinh_CacKhoanThu_Id: khoan,
                strPhamViApDung_Id: pv,
                strNguoiThucHien_Id: ''
            };
        }
        H.pickSinhVien({
            onPick: function (list) {
                H.runAll(list.map(function (s) { return call(H.e(s.QLSV_NGUOIHOC_ID) + H.e(s.DAOTAO_TOCHUCCHUONGTRINH_ID)); }), 'Đang thêm', loadKKH);
            },
            onGroup: function (kind, ids) { H.runAll(ids.map(call), 'Đang thêm', loadKKH); }
        });
    }
    function xoaKKH() {
        var rows = Array.prototype.filter.call(kq('tbl').querySelectorAll('input[data-kx]'), function (x) { return x.checked && x.getAttribute('data-kx') !== 'all'; })
            .map(function (x) { return kkhRows[Number(x.getAttribute('data-kx'))]; });
        if (!rows.length) return ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn');
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            H.runAll(rows.map(function (r) {
                return {
                    action: 'TC_KeHoachThu_GiaHan_MH/GS4gHhUCHgopLiAvFSk0HgopLi8mChUzIAPP',
                    func: 'pkg_taichinh_kehoachthu_giahan.Xoa_TC_KhoanThu_KhongKTra',
                    strId: r.ID, strNguoiThucHien_Id: ''
                };
            }), 'Đang xoá', loadKKH);
        });
    }
    elKKH.addEventListener('click', function (e) {
        var b = e.target.closest('[data-k]');
        if (!b || !elKKH.contains(b)) return;
        var a = b.getAttribute('data-k');
        if (a === 'back') { ui.swap(elKKH, elMain); crud.load(); }
        else if (a === 'them') themKKH();
        else if (a === 'xoa') xoaKKH();
    });
    elKKH.addEventListener('change', function (e) {
        var t = e.target;
        if (t.matches && t.matches('input[data-kx="all"]')) Array.prototype.forEach.call(kq('tbl').querySelectorAll('input[data-kx]'), function (x) { x.checked = t.checked; });
    });

    /* =====================================================================
       Tình trạng nợ — áp phạm vi / khoản nợ cho các kế hoạch đã chọn
       ===================================================================== */
    var ttnKeHoach = [], ttnRows = [];
    elTTN.innerHTML =
        '<div class="ums-panel">' +
            '<div class="ums-panel__head">' +
                '<div class="ums-panel__title"><i class="fa-light fa-money-check-dollar"></i> Tình trạng nợ <span class="ums-u-faint ums-u-fz13" data-t="kh"></span></div>' +
                '<div class="ums-panel__tools">' + ui.btn('close', { attr: { 'data-t': 'back' } }) + '</div>' +
            '</div>' +
            '<div class="ums-panel__body"><div class="ums-filter">' +
                '<div class="ums-field"><select class="ums-select" data-t="he"><option value="">Chọn hệ đào tạo</option></select></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-t': 'search' } }) + '</div>' +
            '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-t="tbl"></div>' +
            '<div class="ums-panel__foot ums-row--between">' +
                '<button type="button" class="ums-btn ums-btn--out-success" data-t="khongthu"><i class="fa-light fa-money-bill"></i><span>Thêm vào kế hoạch không thu tiền</span></button>' +
                '<button type="button" class="ums-btn ums-btn--primary" data-t="thu"><i class="fa-light fa-circle-dollar-to-slot"></i><span>Thêm vào kế hoạch thu tiền</span></button>' +
            '</div>' +
        '</div>';
    function tq(k) { return elTTN.querySelector('[data-t="' + k + '"]'); }
    ui.enhance(elTTN);
    var heP = null;

    function openTTN(c) {
        var picked = c.pickedRows();
        if (!picked.length) return ui.toast('Vui lòng chọn kế hoạch?', 'warn');
        ttnKeHoach = picked.map(function (r) { return r.ID; });
        tq('kh').textContent = '— áp dụng cho ' + picked.length + ' kế hoạch';
        ui.swap(elMain, elTTN);
        if (!heP) {
            heP = ums.api.call({
                action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eCSQFIC4VIC4QNDgkLwPP',
                func: 'pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTaoQuyen',
                strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
                strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000
            }).then(function (r) { H.fill(tq('he'), Array.isArray(r.data) ? r.data : [], { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); })
              .catch(function (e) { heP = null; ums.api.handle(e, 'hệ đào tạo'); });
        }
        ui.table({ el: tq('tbl'), rows: ttnRows = [], columns: ttnCols(), empty: 'Chọn hệ đào tạo rồi bấm Tìm kiếm' });
    }
    function ttnCols() {
        return [
            { title: 'Khóa học', prop: 'TENKHOA' },
            { title: 'Thời gian nợ', prop: 'THOIGIAN' },
            { title: 'Khoản nợ', prop: 'TAICHINH_CACKHOANTHU_TEN' },
            { title: 'Tổng tiền nợ', prop: 'TONGTIENNO', cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.TONGTIENNO); }, sum: true },
            { head: '<input type="checkbox" data-tx="all">', cls: 'is-center', width: '44px', render: function (r, i) { return '<input type="checkbox" data-tx="' + i + '">'; } }
        ];
    }
    function loadTTN() {
        var host = tq('tbl');
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'TC_ThuChi2_MH/FSkuLyYKJA8uESkoFSkkLgopLiAJLiIP',
            func: 'pkg_taichinh_thuchi2.ThongKeNoPhiTheoKhoaHoc',
            strDaoTao_HeDaoTao_Id: tq('he').value,
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            ttnRows = Array.isArray(r.data) ? r.data : [];
            ui.table({ el: host, rows: ttnRows, columns: ttnCols(), empty: 'Không có khoản nợ' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng nợ'); });
    }
    function apDung(thu) {
        var rows = Array.prototype.filter.call(tq('tbl').querySelectorAll('input[data-tx]'), function (x) { return x.checked && x.getAttribute('data-tx') !== 'all'; })
            .map(function (x) { return ttnRows[Number(x.getAttribute('data-tx'))]; });
        if (!rows.length) return ui.toast('Vui lòng chọn đối tượng?', 'warn');
        var calls = [];
        ttnKeHoach.forEach(function (khId) {
            rows.forEach(function (a) {
                calls.push({
                    action: thu ? 'TC_KeHoachThu_GiaHan_MH/FSkkLBEpICwXKAokCS4gIikVKTQVKCQv' : 'TC_KeHoachThu_GiaHan_MH/FSkkLBEpICwXKAokCS4gIikKKS4vJhUpNBUoJC8P',
                    func: thu ? 'pkg_taichinh_kehoachthu_giahan.ThemPhamViKeHoachThuTien' : 'pkg_taichinh_kehoachthu_giahan.ThemPhamViKeHoachKhongThuTien',
                    strTaiChinh_KeHoachThu_Id: khId,
                    strDaoTao_ThoiGianDaoTao_Id: a.DAOTAO_THOIGIANDAOTAO_ID,
                    strTaiChinh_CacKhoanThu_Id: a.TAICHINH_CACKHOANTHU_ID,
                    strDaoTao_KhoaDaoTao_Id: a.ID,
                    strNguoiThucHien_Id: ''
                });
            });
        });
        H.runAll(calls, thu ? 'Đang thêm vào kế hoạch thu tiền' : 'Đang thêm vào kế hoạch không thu tiền');
    }
    elTTN.addEventListener('click', function (e) {
        var b = e.target.closest('[data-t]');
        if (!b || !elTTN.contains(b)) return;
        var a = b.getAttribute('data-t');
        if (a === 'back') { ui.swap(elTTN, elMain); crud.load(); }
        else if (a === 'search') loadTTN();
        else if (a === 'thu') apDung(true);
        else if (a === 'khongthu') apDung(false);
    });
    elTTN.addEventListener('change', function (e) {
        var t = e.target;
        if (t.matches && t.matches('input[data-tx="all"]')) Array.prototype.forEach.call(tq('tbl').querySelectorAll('input[data-tx]'), function (x) { x.checked = t.checked; });
    });

    /* =====================================================================
       Chế độ chặn nộp tiền khi không có kế hoạch thu
       ===================================================================== */
    function cheDo() {
        var dlg = ui.dialog({
            title: 'Chế độ', icon: 'fa-books-medical', size: 'md',
            body: ui.field('Chế độ', '<select class="ums-select" data-d="chedo">' +
                '<option value="0">Không áp dụng mô hình chặn nộp tiền theo kế hoạch</option>' +
                '<option value="1">Đang áp dụng mô hình chặn nộp tiền theo kế hoạch</option></select>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                ums.api.call({
                    action: 'TC_Chung_MH/AiAxDykgNRUpICwSLgIpIC8VKSAvKRUuIC8P',
                    func: 'pkg_taichinh_chung.CapNhatThamSoChanThanhToan',
                    strNguoiThucHien_Id: '',
                    dChanTTKhiKhongCoKeHoach: d.body.querySelector('[data-d="chedo"]').value
                }).then(function () { ui.toast('Thực hiện thành công', 'ok'); }).catch(fail('cập nhật chế độ'));
            } }]
        });
        var sel = dlg.body.querySelector('[data-d="chedo"]');
        ui.enhance(dlg.body);
        ums.api.call({
            action: 'TC_Chung_MH/DSA4FRUVKSAsEi4CKTQvJhUpIC8pFS4gLwPP',
            func: 'pkg_taichinh_chung.LayTTThamSoChungThanhToan',
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            var d = Array.isArray(r.data) ? r.data : [];
            if (d.length && d[0].CHANTTKHIKHONGCOKEHOACHTHU !== undefined && d[0].CHANTTKHIKHONGCOKEHOACHTHU !== null) {
                sel.value = String(d[0].CHANTTKHIKHONGCOKEHOACHTHU);
                if (window.jQuery) jQuery(sel).trigger('change.select2');   // ô đã gắn select2 — phải báo để đổi chữ hiện
            }
        }).catch(fail('chế độ'));
    }
})();
