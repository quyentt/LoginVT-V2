/* =========================================================================
   Thiết đặt không bắt nợ theo đợt đăng ký
   Bản gốc: ApisTaiChinh/Modules/danhmucheso/html/khongbatno.html + scripts/khongbatno.js
            (HTML gốc nạp "KhongBatNo.js" — trên IIS không phân biệt hoa thường)
   ---------------------------------------------------------------------------
   Ba khối như bản gốc, cùng lọc theo Thời gian → Kế hoạch đăng ký:
     1. Chế độ kiểm tra nợ của từng kế hoạch: lưới nhập (Có/Không ×3, quy
        định kiểm tra học phí, số nợ tối đa) — "Lưu" gửi TẤT CẢ kế hoạch
        đang hiện như bản gốc.
     2. Phạm vi / thời gian KHÔNG kiểm tra nợ: danh sách, thêm (chọn sinh
        viên / từng khoá / từng chương trình / từng lớp), xoá nhiều.
     3. Khoản SẼ kiểm tra nợ: danh sách, xoá nhiều (xem "Cố ý bỏ").
   Kiểu procedure, có mã hoá (pkg_taichinh_kehoachthu_giahan.*):
       LayDSThoiGian · LayDSKeHoachDangKyHoc · Sua_DangKy_KeHoachDangKy
       LayDSDangKy_TaiChinh_ThoiGian · Them_… · Xoa_DangKy_TaiChinh_ThoiGian
       LayDSDangKy_Khoan_KiemTraNo · Xoa_DangKy_Khoan_KiemTraNo
       danh mục DANGKY.QUYDINHKIEMTRAHOCPHI
   Hộp chọn sinh viên = edu.extend.genModal_SinhVien (Core/systemextend.js:918):
       pkg_hosohocvien.LayDanhSachHoSoNhieuNganh (10 dòng/trang), Hệ/Khoá/CT/
       Lớp chọn nhiều qua edu.system.getList_* (ums.ref.*), danh mục QLSV.TRANGTHAI.
       Phạm vi của sinh viên = QLSV_NGUOIHOC_ID + DAOTAO_TOCHUCCHUONGTRINH_ID.

   Cố ý bỏ:
     · THÊM "khoản sẽ kiểm tra nợ" (Them_DangKy_Khoan_KiemTraNo): bản gốc
       lưu SAI — save_PhamVi lặp theo từng khoản thu đã chọn và gọi
       save_BatNo(idKhoanThu), tức strPhamViApDung_Id = id KHOẢN THU còn
       strTaiChinh_CacKhoanThu_Id = cả chuỗi khoản đã chọn; phạm vi sinh
       viên/lớp vừa chọn bị bỏ mất (dòng đúng đã bị comment:
       //me.save_BatNo(strPhamViApDung_Id)). Theo nguyên tắc chuyển đổi,
       không chép lỗi này: khối 3 chỉ còn xem và xoá. Xem báo cáo.
     · Nút "Import sinh viên" (IMPORTWITHPROC_DKTCTG, khối 2): màn gốc
       không gọi getList_MauImport nên nút không có trình xử lý nào.
     · Ô đánh dấu ở bảng kế hoạch (khối 1): không dùng vào việc gì.
     · getList_QuyDinhKiemTraHocPhi / popup / resetPopup: mã chết.
     · Nút #btnAdd_He, #btnAdd_KhoaKhoa trong hộp chọn: không có trong markup.
   Lỗi bản gốc khác: mỗi lần mở hộp chọn sinh viên, genModal_SinhVien gắn
   thêm một lượt .delegate → mở lần thứ hai thì mỗi lần chọn lưu hai lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, B = ums.dmhsB, esc = ui.esc, e = B.e;
    var root = document.getElementById('khongbatno');
    var st = { keHoach: [], kiemTra: [], kbn: [], bn: [], tt: [] };
    var P = 'TC_KeHoachThu_GiaHan_MH/';
    var G = 'pkg_taichinh_kehoachthu_giahan.';

    function panel(key, icon, title, tools, foot) {
        return '<div class="ums-panel ums-u-mb-4" data-z="' + key + '">' +
            '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light ' + icon + '"></i> ' + esc(title) +
            ' <span class="ums-u-faint ums-u-fz13" data-z="' + key + 'Count"></span></div>' +
            '<div class="ums-panel__tools">' + tools + '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-z="' + key + 'Table">' +
                ui.empty('Chọn thời gian và kế hoạch đăng ký', 'fa-filter') + '</div>' +
            (foot || '') + '</div>';
    }
    function delBtn(key) {
        return '<button type="button" class="ums-btn ums-btn--delsel ums-btn--sm" data-do="del" data-k="' + key + '" disabled>' +
            '<i class="fa-light fa-trash-can"></i><span>Xoá đã chọn</span></button>';
    }

    root.innerHTML =
        '<div class="ums-page__head"><h1 class="ums-page__title ums-u-mb-0">Thiết đặt không bắt nợ theo đợt</h1></div>' +
        '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__body"><div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="tg"><option value="">Chọn thời gian</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="kh"><option value="">Chọn kế hoạch</option></select></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-do': 'search' } }) + '</div>' +
        '</div></div></div>' +
        panel('kh', 'fa-money-check-dollar-pen', 'Chế độ kiểm tra tình trạng nợ phí khi đăng ký học, tính phí tự động',
            ui.btn('save', { attr: { 'data-do': 'saveKH' } })) +
        panel('kbn', 'fa-circle-dollar', 'Phạm vi, thời gian không kiểm tra nợ cho kế hoạch đăng ký',
            '<button type="button" class="ums-btn ums-btn--out-info" data-do="import">' +
                '<i class="fa-light fa-cloud-arrow-up"></i><span>Import</span></button>' +
            '<div style="width:220px"><select class="ums-select" data-f="tg2"><option value="">Chọn thời gian</option></select></div>' +
            delBtn('kbn') + ui.btn('add', { attr: { 'data-do': 'addKBN' } })) +
        panel('bn', 'fa-display-chart-up-circle-dollar', 'Khoản sẽ kiểm tra nợ cho kế hoạch đăng ký',
            '<div style="width:420px"><select class="ums-select" data-f="khoan" multiple data-ph="Chọn khoản thu"></select></div>' +
            delBtn('bn') + ui.btn('add', { attr: { 'data-do': 'addBN' } }));

    function q(s) { return root.querySelector(s); }
    var F = { tg: q('[data-f="tg"]'), kh: q('[data-f="kh"]'), q: q('[data-f="q"]'), tg2: q('[data-f="tg2"]'), khoan: q('[data-f="khoan"]') };
    ui.enhance(root);       // select2 cho mọi ô chọn (chữ gợi ý lấy từ dòng đầu)

    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    /* --- Nguồn --- */
    B.rows({ action: P + 'DSA4BRIVKS4oBiggLwPP', func: G + 'LayDSThoiGian', strNguoiThucHien_Id: '' })
        .then(function (r) {
            B.fill(F.tg, r, { name: 'THOIGIAN', head: 'Chọn thời gian' });
            B.fill(F.tg2, r, { name: 'THOIGIAN', head: 'Chọn thời gian' });
        }, fail('nạp thời gian'));

    /* Khoản thu cho ô chọn nhiều ở khối 3 — tham số chép nguyên bản gốc
       (getList_KhoanThu), trừ hai ô txtAAAA / dropAAAA không tồn tại trên màn
       nên bản gốc luôn gửi rỗng; ở đây gửi rỗng tường minh. */
    B.rows({
        action: 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
        func: 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
        strTuKhoa: '', strNhomCacKhoanThu_Id: '', strcanboquanly_id: '',
        strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000
    }).then(function (r) { B.fill(F.khoan, r, { name: 'TEN' }); }, fail('nạp khoản thu'));

    var kiemTraReady = ums.api.dm('DANGKY.QUYDINHKIEMTRAHOCPHI')
        .then(function (r) { st.kiemTra = r; }, fail('nạp quy định kiểm tra học phí'));

    /* --- Khối 1: kế hoạch --- */
    function loadKeHoach() {
        var host = q('[data-z="khTable"]');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return Promise.all([kiemTraReady, B.rows({
            action: P + 'DSA4BRIKJAkuICIpBSAvJgo4CS4i',
            func: G + 'LayDSKeHoachDangKyHoc',
            strDaoTao_ThoiGianDaoTao_Id: F.tg.value,
            strNguoiThucHien_Id: ''
        })]).then(function (x) {
            st.keHoach = x[1];
            B.fill(F.kh, st.keHoach, { name: 'TENKEHOACH', head: 'Chọn kế hoạch' });
            drawKeHoach();
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'nạp kế hoạch'); });
    }

    function yn(k, i, v) {
        return '<select class="ums-select ums-input--sm" data-kh="' + k + '" data-i="' + i + '">' +
            '<option value="">Không</option><option value="1"' + (String(v) === '1' ? ' selected' : '') + '>Có</option></select>';
    }
    function drawKeHoach() {
        q('[data-z="khCount"]').textContent = '(' + st.keHoach.length + ')';
        ui.table({
            el: q('[data-z="khTable"]'), rows: st.keHoach, empty: 'Không có kế hoạch', tableCls: 'ums-table--lined ums-table--tight',
            columns: [
                { title: 'Mã kế hoạch', prop: 'MAKEHOACH', cls: 'is-nowrap' },
                { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
                { title: 'Kiểm tra tài chính của SV?', cls: 'is-center', render: function (r, i) { return yn('tc', i, r.KIEMTRATAICHINH); } },
                { title: 'Hiện đơn giá học phí?', cls: 'is-center', render: function (r, i) { return yn('dg', i, r.HIENTHIDONGIAHOCPHI); } },
                { title: 'Tự động tính phí khi đăng ký?', cls: 'is-center', render: function (r, i) { return yn('tp', i, r.TINHPHITUDONG); } },
                { title: 'Quy định kiểm tra học phí', render: function (r, i) {
                    return '<select class="ums-select ums-input--sm" data-kh="kt" data-i="' + i + '"><option value="">Chọn quy định kiểm tra học phí</option>' +
                        st.kiemTra.map(function (x) {
                            return '<option value="' + esc(x.ID) + '"' + (String(x.ID) === e(r.QUYDINHKIEMTRAHOCPHI_ID) ? ' selected' : '') + '>' + esc(x.TEN) + '</option>';
                        }).join('') + '</select>';
                } },
                { title: 'Số nợ tối đa cho phép', width: '140px', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm" data-kh="no" data-i="' + i + '" value="' + esc(r.SOHOCPHINOTOIDACHOPHEP) + '" autocomplete="off">';
                } },
                { title: 'Thời gian đăng ký chung', cls: 'is-center is-nowrap', render: function (r) { return esc(e(r.NGAYBATDAU) + ' → ' + e(r.NGAYKETTHUC)); } },
                /* Cột chọn như bản gốc. Bản gốc KHÔNG đọc tới nó (không hàm nào
                   gọi getArrCheckedIds trên bảng này) — ở đây cho nó một việc:
                   đánh dấu dòng nào thì "Lưu" chỉ gửi những dòng đó, không
                   đánh dấu dòng nào thì gửi tất cả như bản gốc. */
                {
                    head: '<input type="checkbox" data-pick="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (x, i) { return '<input type="checkbox" data-pick="' + i + '">'; }
                }
            ]
        });
    }

    function saveKeHoach() {
        if (!st.keHoach.length) { ui.toast('Chưa có kế hoạch nào để lưu', 'info'); return; }
        var host = q('[data-z="khTable"]');
        function v(k, i) { var el = host.querySelector('[data-kh="' + k + '"][data-i="' + i + '"]'); return el ? el.value.trim() : ''; }
        var chon = Array.prototype.slice.call(host.querySelectorAll('input[data-pick]:checked'))
            .map(function (x) { return x.getAttribute('data-pick'); })
            .filter(function (x) { return x !== 'all'; });
        var canLuu = chon.length
            ? st.keHoach.map(function (r, i) { return { r: r, i: i }; }).filter(function (o) { return chon.indexOf(String(o.i)) >= 0; })
            : st.keHoach.map(function (r, i) { return { r: r, i: i }; });
        ui.batch(canLuu.map(function (o) {
            var r = o.r, i = o.i;
            return {
                action: P + 'EjQgHgUgLyYKOB4KJAkuICIpBSAvJgo4',
                func: G + 'Sua_DangKy_KeHoachDangKy',
                strDangKy_KeHoach_Id: r.ID,
                dKiemTraTaiChinh: v('tc', i),
                dHienThiDonGiaHocPhi: v('dg', i),
                dTinhPhiTuDong: v('tp', i),
                strQuyDinhKiemTraHocPhi_Id: v('kt', i),
                dSoHocPhiNoToiDaChoPhep: v('no', i),
                strNguoiThucHien_Id: ''
            };
        }), { title: 'Đang lưu chế độ kiểm tra nợ', okText: 'Thực hiện thành công' }).then(function () { loadKeHoach(); });
    }

    /* --- Khối 2 và 3: danh sách phạm vi --- */
    var LIST = {
        kbn: {
            call: { action: P + 'DSA4BRIFIC8mCjgeFSAoAikoLykeFSkuKAYoIC8P', func: G + 'LayDSDangKy_TaiChinh_ThoiGian' },
            del: { action: P + 'GS4gHgUgLyYKOB4VICgCKSgvKR4VKS4oBiggLwPP', func: G + 'Xoa_DangKy_TaiChinh_ThoiGian' },
            cols: [
                { title: 'Mã kế hoạch', prop: 'DANGKY_KEHOACHDANGKY_MA', cls: 'is-nowrap' },
                { title: 'Tên kế hoạch', prop: 'DANGKY_KEHOACHDANGKY_TEN' },
                { title: 'Thời gian không bắt nợ', prop: 'THOIGIAN', cls: 'is-center is-nowrap' },
                { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }
            ]
        },
        bn: {
            call: { action: P + 'DSA4BRIFIC8mCjgeCikuIC8eCigkLBUzIA8u', func: G + 'LayDSDangKy_Khoan_KiemTraNo' },
            del: { action: P + 'GS4gHgUgLyYKOB4KKS4gLx4KKCQsFTMgDy4P', func: G + 'Xoa_DangKy_Khoan_KiemTraNo' },
            cols: [
                { title: 'Mã kế hoạch', prop: 'DANGKY_KEHOACHDANGKY_MA', cls: 'is-nowrap' },
                { title: 'Tên kế hoạch', prop: 'DANGKY_KEHOACHDANGKY_TEN' },
                { title: 'Loại khoản', prop: 'TAICHINH_CACKHOANTHU_TEN' },
                { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' }
            ]
        }
    };

    function loadList(k) {
        var L = LIST[k], host = q('[data-z="' + k + 'Table"]');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: L.call.action,
            func: L.call.func,
            strTuKhoa: F.q.value.trim(),
            strDangKy_KeHoachDangKy_Id: F.kh.value,
            strNguoiThucHien_Id: ''
        }).then(function (r) {
            st[k] = B.arr(r.data);
            q('[data-z="' + k + 'Count"]').textContent = '(' + (r.pager || st[k].length) + ')';
            ui.table({
                el: host, rows: st[k], empty: 'Không có dữ liệu',
                columns: L.cols.concat([{
                    head: '<input type="checkbox" data-pick="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (x, i) { return '<input type="checkbox" data-pick="' + i + '">'; }
                }])
            });
            syncPick(k);
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách'); });
    }
    function loadLists() { loadList('kbn'); loadList('bn'); }

    function picked(k) {
        return Array.prototype.slice.call(q('[data-z="' + k + 'Table"]').querySelectorAll('input[data-pick]:checked'))
            .filter(function (x) { return x.getAttribute('data-pick') !== 'all'; })
            .map(function (x) { return st[k][Number(x.getAttribute('data-pick'))]; });
    }
    function syncPick(k) {
        var n = picked(k).length;
        var b = q('[data-do="del"][data-k="' + k + '"]');
        b.disabled = !n;
        b.querySelector('span').textContent = n ? 'Xoá ' + n + ' dòng đã chọn' : 'Xoá đã chọn';
        Array.prototype.forEach.call(q('[data-z="' + k + 'Table"]').querySelectorAll('input[data-pick]'), function (x) {
            var tr = x.closest('tr');
            if (x.getAttribute('data-pick') !== 'all' && tr) tr.classList.toggle('is-selected', x.checked);
        });
    }
    ['kbn', 'bn'].forEach(function (k) {
        q('[data-z="' + k + 'Table"]').addEventListener('change', function (ev) {
            var x = ev.target;
            if (!x.matches('input[data-pick]')) return;
            if (x.getAttribute('data-pick') === 'all') {
                Array.prototype.forEach.call(q('[data-z="' + k + 'Table"]').querySelectorAll('input[data-pick]'), function (y) { y.checked = x.checked; });
            }
            syncPick(k);
        });
    });

    function removeRows(k) {
        var rows = picked(k);
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            ui.batch(rows.map(function (r) {
                return { action: LIST[k].del.action, func: LIST[k].del.func, strId: r.ID, strNguoiThucHien_Id: '' };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!' }).then(function () { loadList(k); });
        });
    }

    /* --- Thêm phạm vi không bắt nợ --- */
    function saveKBN(ids) {
        if (!ids.length) return;
        ui.batch(ids.map(function (id) {
            return {
                action: P + 'FSkkLB4FIC8mCjgeFSAoAikoLykeFSkuKAYoIC8P',
                func: G + 'Them_DangKy_TaiChinh_ThoiGian',
                strDangKy_KeHoachDangKy_Id: F.kh.value,
                strDaoTao_ThoiGianDaoTao_Id: F.tg2.value,
                strPhamViApDung_Id: id,
                strNguoiThucHien_Id: ''
            };
        }), { title: 'Đang thêm phạm vi', okText: 'Thực hiện thành công' }).then(function () { loadList('kbn'); });
    }

    /* --- Thêm khoản sẽ kiểm tra nợ (khối 3) ---------------------------------
       BẢN GỐC LƯU SAI, ở đây sửa — người dùng đã quyết (2026-09-21):
       save_PhamVi lặp theo từng khoản thu rồi gọi save_BatNo(idKhoanThu), tức
       nhét id KHOẢN THU vào strPhamViApDung_Id và vứt mất phạm vi sinh viên /
       lớp vừa chọn; dòng đúng đã bị chú thích sẵn trong bản gốc
       (//me.save_BatNo(strPhamViApDung_Id)). Ở đây mỗi PHẠM VI một bản ghi,
       kèm cả chuỗi khoản thu đã chọn — đúng chữ ký procedure.
       Lưu ý: bản ghi cũ trên hệ đang chạy vẫn mang id khoản thu ở cột phạm vi. */
    function saveBN(ids) {
        if (!ids.length) return;
        var khoan = B.multi(F.khoan);
        ui.batch(ids.map(function (id) {
            return {
                action: P + 'FSkkLB4FIC8mCjgeCikuIC8eCigkLBUzIA8u',
                func: G + 'Them_DangKy_Khoan_KiemTraNo',
                strDangKy_KeHoachDangKy_Id: F.kh.value,
                strTaiChinh_CacKhoanThu_Id: khoan,
                strPhamViApDung_Id: id,
                strNguoiThucHien_Id: ''
            };
        }), { title: 'Đang thêm khoản kiểm tra nợ', okText: 'Thực hiện thành công' }).then(function () { loadList('bn'); });
    }

    function addBN() {
        if (!F.kh.value) { ui.toast('Bạn hãy chọn kế hoạch', 'warn'); return; }
        var khoan = B.multi(F.khoan);
        if (!khoan) { ui.toast('Bạn hãy chọn khoản thu', 'warn'); return; }   // bản gốc cũng chặn ở đây
        pickSinhVien(function (kind, ids, rows) {
            if (kind === 'sv') saveBN(rows.map(function (x) { return e(x.QLSV_NGUOIHOC_ID) + e(x.DAOTAO_TOCHUCCHUONGTRINH_ID); }));
            else saveBN(ids);
        });
    }

    function addKBN() {
        if (!F.kh.value) { ui.toast('Bạn hãy chọn kế hoạch', 'warn'); return; }
        if (!F.tg2.value) { ui.toast('Bạn hãy chọn thời gian', 'warn'); return; }
        pickSinhVien(function (kind, ids, rows) {
            if (kind === 'sv') saveKBN(rows.map(function (x) { return e(x.QLSV_NGUOIHOC_ID) + e(x.DAOTAO_TOCHUCCHUONGTRINH_ID); }));
            else saveKBN(ids);
        });
    }

    /* Hộp chọn sinh viên — edu.extend.genModal_SinhVien. Bản dựng ở tầng
       chung: ums.pat.pickSinhVienNganh (cùng procedure
       pkg_hosohocvien.LayDanhSachHoSoNhieuNganh, cùng bộ lọc Hệ/Khoá/CT/Lớp
       và khối trạng thái QLSV.TRANGTHAI). */
    function pickSinhVien(done) {
        return ums.pat.pickSinhVienNganh({
            onPick: function (rows) { done('sv', rows.map(function (x) { return x.ID; }), rows); },
            onGroup: function (kind, ids) { done(kind, ids); }
        });
    }

    /* --- Sự kiện --- */
    jQuery(F.tg).on('select2:select', function () { loadKeHoach(); });
    jQuery(F.kh).on('select2:select', function () { loadLists(); });
    /* Chưa chọn Thời gian thì khoá Kế hoạch; xoá Thời gian / Kế hoạch thì
       đưa các khung về lời nhắc ban đầu thay vì để dữ liệu của lựa chọn cũ */
    ums.pat.chain([F.tg, F.kh], { phatLai: false });
    function veNhac(keys) {
        keys.forEach(function (k) {
            if (k === 'kh') st.keHoach = []; else st[k] = [];
            q('[data-z="' + k + 'Count"]').textContent = '';
            q('[data-z="' + k + 'Table"]').innerHTML = ui.empty('Chọn thời gian và kế hoạch đăng ký', 'fa-filter');
        });
    }
    jQuery(F.tg).on('select2:clear', function () { veNhac(['kh', 'kbn', 'bn']); });
    jQuery(F.kh).on('select2:clear', function () { veNhac(['kbn', 'bn']); });
    F.q.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); loadLists(); } });

    /* Ô chọn ở bảng khối 1: "Chọn tất cả" và tô sáng dòng */
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t.matches || !t.matches('[data-z="khTable"] input[data-pick]')) return;
        var host = q('[data-z="khTable"]');
        var ones = Array.prototype.slice.call(host.querySelectorAll('input[data-pick]:not([data-pick="all"])'));
        if (t.getAttribute('data-pick') === 'all') ones.forEach(function (x) { x.checked = t.checked; });
        else {
            var all = host.querySelector('input[data-pick="all"]');
            if (all) all.checked = ones.every(function (x) { return x.checked; });
        }
        ones.forEach(function (x) { var tr = x.closest('tr'); if (tr) tr.classList.toggle('is-selected', x.checked); });
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-do]');
        if (!b || !root.contains(b)) return;
        var act = b.getAttribute('data-do');
        if (act === 'search') loadLists();
        else if (act === 'saveKH') saveKeHoach();
        else if (act === 'addKBN') addKBN();
        else if (act === 'addBN') addBN();
        else if (act === 'import') {
            /* Bản gốc có sẵn nút này (btnImportWithProce name="IMPORTWITHPROC_DKTCTG")
               nhưng không hề gọi getList_MauImport nên trình xử lý chưa bao giờ
               được gắn — bấm không ra gì. Ở đây nối thẳng vào hộp import chung
               (= edu.system.showImportChung) với đúng mã đó. */
            ums.report.importChung('Import sinh viên', 'IMPORTWITHPROC_DKTCTG', {
                onDone: function () { loadLists(); }
            });
        }
        else if (act === 'del') removeRows(b.getAttribute('data-k'));
    });
})();
