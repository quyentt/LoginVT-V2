/* =========================================================================
   Đăng ký Xét - Hoãn xét tốt nghiệp — Cổng sinh viên › Học tập
   (vai trò thủ vai: người học = ums.session.userId)
   Bản gốc: ApisCongSinhVien/Modules/hoctap/html/hoantotnghiep.html
            + ApisCongSinhVien/Modules/hoctap/script/hoantotnghiep.js (vỏ index / Core)
   ---------------------------------------------------------------------------
   Bố cục giữ nguyên bản gốc, MỘT cột:
     thanh lọc (ô Chương trình + nút "Tìm kiếm" + menu mẫu báo cáo)
     → khung "Kết quả": bảng đợt xét duyệt, mỗi dòng có các nút
       "Xác nhận" · "Khai minh chứng" · "Kết quả" · "Chi tiết"
   Bốn modal của bản gốc, giữ nguyên tiêu đề và chữ nút. Ba hộp việc phụ (xác nhận, danh sách kết quả, tự xét)
   → ums.ui.dialog; modal_minhchung là biểu mẫu thêm / sửa MỘT bản ghi → biểu mẫu NGAY TRONG TRANG
   (ums.pat.formTrang thay chỗ màn — BO-CUC luật 1, đổi 2026-09-30). Mở sửa từ hộp "Kết quả chứng chỉ":
   hộp danh sách đóng lại, đóng biểu mẫu thì hộp danh sách mở lại (và tự nạp lại).
     modal_XacNhan  "Xác nhận theo kế hoạch"   (Tình trạng + Lý do, nút Lưu)
     modal_ketqua   "Kết quả chứng chỉ"        (bảng chứng chỉ đã khai, nút Chi tiết)
     modal_minhchung "Khai chứng chỉ đã có(Minh chứng)" (biểu mẫu + tệp minh chứng, nút Xóa / Lưu)
     modal_tuxet    "Tự xét"                   (kết quả + bảng tiêu chí + điều kiện, nút Xét)

   Lời gọi (chép nguyên action / func / tên tham số):
     TN_DangKy_MH · pkg_totnghiep_dangky.LayDSKeHoachCaNhan (strDaoTao_ChuongTrinh_Id)
         → bảng: TEN · PHANLOAI_TEN · TINHTRANGDANGKY · PHANHOI · ID
     DKH_Chung_MH · pkg_dangkyhoc_chung.LayDSChuongTrinh (strQLSV_NguoiHoc_Id) → ô Chương trình
     TN_DangKy_MH · pkg_totnghiep_dangky.Them_TN_KeHoach_DangKy        (xác nhận theo kế hoạch)
     …            · LayDSTN_NguoiHoc_HocPhan_Cap → Data.rs (bảng chứng chỉ)
     …            · Them_TN_NguoiHoc_HocPhan_Cap / Xoa_TN_NguoiHoc_HocPhan_Cap
     …            · LayDSPhanLoaiChungChi (ô "Chứng chỉ cần công nhận")
     …            · LayKetQuaThongTinDieuKienXet → Data.rs (KETQUA/DIEUKIEN) + Data.rsTieuChi
     SV_CongNhanDiem_MH · pkg_congthongtin_congnhandiem.LayDSLoaiCC_BangDiem (Loại chứng chỉ)
     …            · LayDSLoaiCC_BDTheoPhanLoai (strLoaiCC_BD_Id) → Loại công nhận
     …            · LayDSCoSoDaoTaoTheoLoai (strLoaiCongNhan_Id) → Cơ sở đào tạo
     TN_TinhToan_MH · pkg_totnghiep_tinhtoan.XetDieuKien_TN_CC_DA_CaNhan (nút "Xét")
     Danh mục TN.KEHOACH.DANGKY.TINHTRANG → ô "Tình trạng" của hộp Xác nhận.
     Tệp minh chứng: SV_Files, khoá "CongNhan" + <TN_KeHoach_Id> + <QLSV_NguoiHoc_Id> (như gốc).

   Lỗi của bản gốc (xem báo cáo):
     · Nút Xóa chứng chỉ dùng edu.system.confirm + $("#btnYes").click(...): mỗi lần mở hộp
       lại gắn thêm một trình xử lý → bấm xóa lần thứ N là gọi Xoa N lần (còn cả console.log).
       Bản mới dùng ums.ui.confirm (Promise, chạy đúng một lần).
     · save_XacNhan kiểm `if (obj_save.strId)` nhưng object KHÔNG có khoá strId → nhánh
       "cập nhật" (action EjQg…) chưa bao giờ chạy và luôn báo "Thêm mới thành công!".
       Giữ nguyên: luôn gọi Them_TN_KeHoach_DangKy.
     · save_TuXet đọc 5 ô `dropAAAA` không tồn tại → gửi rỗng. Giữ nguyên (gửi '').
     · save_ChungChi đọc txtGhiChu / txtHeDaoTao / dSoTinChi không có trong màn → gửi ''.
       Giữ strGhiChu: '' (hai tham số kia bản gốc đã chú thích bỏ).
     · Nhánh CẬP NHẬT của chứng chỉ đổi action sang 'TN_DangKy/…' (controller KHÔNG có hậu tố
       _MH như mọi lời gọi khác của màn). Giữ NGUYÊN chuỗi của bản gốc — cần kiểm trên host.

   Khác bản gốc (cách làm, không đổi dữ liệu gửi đi):
     · Menu mẫu báo cáo (getList_MauImport "zonebtnBaoCao_HoanTotNghiep") → ums.report.mount
       đặt ở đầu trang; bản gốc không có vùng <zone>_Import nên `import: false`.
     · Chuỗi ô chọn Loại chứng chỉ → Loại công nhận → Cơ sở đào tạo nay KHOÁ ô con khi chưa
       chọn ô cha và xoá trắng ô con khi đổi/xoá ô cha (luật 2026-09-21, ums.pat.chain).
     · Bản gốc nạp danh sách kế hoạch NGAY lúc mở màn (chương trình còn rỗng) rồi nạp lại lần
       nữa khi selectOne chọn chương trình → hai lời gọi, kết quả trước có thể đè kết quả sau.
       Bản mới nạp chương trình trước, chọn xong mới lấy kế hoạch (một lời gọi).
     · Nút "Xóa" trong biểu mẫu minh chứng bị KHOÁ khi đang khai mới (bản gốc vẫn bấm được và gửi
       Xoa với strId rỗng).
     · getList_PhanLoai2 của bản gốc gọi ajax ĐỒNG BỘ (async: false, treo trình duyệt) để kịp
       đặt giá trị mặc định khi mở sửa — bản mới nối tuần tự bằng Promise.

   Kéo gốc 30/9 (git fed68f6e..HEAD, hoantotnghiep.js +23): gốc chỉ thêm dòng "chưa có dữ liệu"
     kèm biểu tượng cho ba bảng (showEmptyState). Bản mới vốn đã có khung rỗng chuẩn của
     ums.ui.table → chỉ đổi câu cho đúng chữ gốc: "Hiện tại chưa có đợt xét - hoãn xét tốt nghiệp
     nào", "Hiện tại chưa có chứng chỉ nào", "Chưa có tiêu chí xét".
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('ht-hoantotnghiep');
    if (!root) return;

    var SV = (ums.session && ums.session.userId) || '';
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var TN = 'TN_DangKy_MH/', PT = 'pkg_totnghiep_dangky.';
    var CN = 'SV_CongNhanDiem_MH/', PC = 'pkg_congthongtin_congnhandiem.';
    var A = {
        chuongTrinh: ['DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP', 'pkg_dangkyhoc_chung.LayDSChuongTrinh'],
        keHoach:     [TN + 'DSA4BRIKJAkuICIpAiAPKSAv', PT + 'LayDSKeHoachCaNhan'],
        themXacNhan: [TN + 'FSkkLB4VDx4KJAkuICIpHgUgLyYKOAPP', PT + 'Them_TN_KeHoach_DangKy'],
        dsChungChi:  [TN + 'DSA4BRIVDx4PJjQuKAkuIh4JLiIRKSAvHgIgMQPP', PT + 'LayDSTN_NguoiHoc_HocPhan_Cap'],
        themChungChi:[TN + 'FSkkLB4VDx4PJjQuKAkuIh4JLiIRKSAvHgIgMQPP', PT + 'Them_TN_NguoiHoc_HocPhan_Cap'],
        /* Bản gốc đổi sang controller TN_DangKy (KHÔNG có _MH) khi cập nhật — giữ nguyên */
        suaChungChi: ['TN_DangKy/EjQgHhUPHg8mNC4oCS4iHgkuIhEpIC8eAiAx', PT + 'Them_TN_NguoiHoc_HocPhan_Cap'],
        xoaChungChi: [TN + 'GS4gHhUPHg8mNC4oCS4iHgkuIhEpIC8eAiAx', PT + 'Xoa_TN_NguoiHoc_HocPhan_Cap'],
        phanLoaiCC:  [TN + 'DSA4BRIRKSAvDS4gKAIpNC8mAiko', PT + 'LayDSPhanLoaiChungChi'],
        tuXet:       [TN + 'DSA4CiQ1EDQgFSkuLyYVKC8FKCQ0CigkLxkkNQPP', PT + 'LayKetQuaThongTinDieuKienXet'],
        loaiCC:      [CN + 'DSA4BRINLiAoAgIeAyAvJgUoJCwP', PC + 'LayDSLoaiCC_BangDiem'],
        phanLoai2:   [CN + 'DSA4BRINLiAoAgIeAwUVKSQuESkgLw0uICgP', PC + 'LayDSLoaiCC_BDTheoPhanLoai'],
        coSo:        [CN + 'DSA4BRICLhIuBSAuFSAuFSkkLg0uICgP', PC + 'LayDSCoSoDaoTaoTheoLoai'],
        xet:         ['TN_TinhToan_MH/GSQ1BSgkNAooJC8eFQ8eAgIeBQAeAiAPKSAv', 'pkg_totnghiep_tinhtoan.XetDieuKien_TN_CC_DA_CaNhan']
    };
    function goi(k, ts) { return ums.api.call(Object.assign({ action: k[0], func: k[1] }, ts || {})); }

    /* ---------- Trạng thái ---------------------------------------------------- */
    var dtKeHoach = [];      // đợt xét duyệt của người học
    var dtChungChi = [];     // chứng chỉ đã khai của kế hoạch đang mở
    var khId = '';           // strTN_KeHoach_Id đang thao tác

    /* ---------- Khung màn hình ------------------------------------------------ */
    root.innerHTML =
        pat.page('Đăng ký Xét - Hoãn xét tốt nghiệp', '<span data-z="bc"></span>') +
        pat.filterBar([{ key: 'ct', type: 'select', label: 'Chọn chương trình' }], { searchText: 'Tìm kiếm' }) +
        pat.panel({ title: 'Kết quả', icon: 'fa-clipboard-check', flush: true, body: '<div data-z="bang"></div>' });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var fCT = root.querySelector('[data-f="ct"]');

    ums.report.mount(z('bc'), {
        import: false,
        collect: function (add) { add('strDaoTao_ChuongTrinh_Id', fCT.value); }
    });

    /* ---------- Bảng kế hoạch (đợt xét duyệt) --------------------------------- */
    function veBang() {
        ui.table({
            el: z('bang'), rows: dtKeHoach, empty: 'Hiện tại chưa có đợt xét - hoãn xét tốt nghiệp nào',
            columns: [
                { title: 'Đợt xét duyệt', prop: 'TEN' },
                { title: 'Loại xét', prop: 'PHANLOAI_TEN' },
                {
                    title: 'Xác nhận theo kế hoạch', cls: 'is-center is-nowrap', render: function (r) {
                        return ui.btn('search', { text: 'Xác nhận', mod: 'out-primary', icon: 'fa-circle-check', cls: 'ums-btn--sm', attr: { 'data-a': 'xacnhan', 'data-id': r.ID } }) +
                            ' <span>' + esc(e(r.TINHTRANGDANGKY)) + '</span>';
                    }
                },
                {
                    title: 'Chứng chỉ đã có(Minh chứng)', cls: 'is-center is-nowrap', render: function (r) {
                        return ui.btn('add', { text: 'Khai minh chứng', mod: 'out-primary', icon: 'fa-file-certificate', cls: 'ums-btn--sm', attr: { 'data-a': 'khai', 'data-id': r.ID } }) + ' ' +
                            ui.btn('search', { text: 'Kết quả', mod: 'ghost', icon: 'fa-list-ul', cls: 'ums-btn--sm', attr: { 'data-a': 'ketqua', 'data-id': r.ID } });
                    }
                },
                {
                    title: 'Tự xét', cls: 'is-center is-nowrap', render: function (r) {
                        return ui.btn('search', { text: 'Chi tiết', mod: 'ghost', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-a': 'tuxet', 'data-id': r.ID } });
                    }
                },
                { title: 'Phản hồi của nhà trường', prop: 'PHANHOI' }
            ]
        });
    }
    function taiKeHoach() {
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return goi(A.keHoach, { strDaoTao_ChuongTrinh_Id: fCT.value }).then(function (r) {
            dtKeHoach = arr(r.data);
            veBang();
        }).catch(function (err) {
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách đợt xét duyệt');
        });
    }

    /* ---------- Hộp "Xác nhận theo kế hoạch" ---------------------------------- */
    function hopXacNhan(id) {
        khId = id;
        var dlg = ui.dialog({
            title: 'Xác nhận theo kế hoạch', icon: 'fa-circle-check', size: 'md',
            body:
                ui.field('Tình trạng', '<select class="ums-select" data-x="tt" data-ph="Chọn tình trạng"><option value=""></option></select>') +
                ui.field('Lý do', '<textarea class="ums-textarea" data-x="lydo" rows="4"></textarea>'),
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luuXacNhan(dlg); return false; } }]
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);
        ums.api.dm('TN.KEHOACH.DANGKY.TINHTRANG').then(function (d) {
            pat.fill(x('tt'), d, { head: pat.dmTitle(d) || 'Chọn tình trạng' });
        }).catch(function (err) { ums.api.handle(err, 'danh mục tình trạng'); });

        function luuXacNhan() {
            goi(A.themXacNhan, {
                strTN_KeHoach_Id: khId,
                strQLSV_NguoiHoc_Id: SV,
                strDaoTao_ChuongTrinh_Id: fCT.value,
                strTinhTrang_Id: x('tt').value,
                strMoTa: x('lydo').value
            }).then(function () {
                ui.toast('Thêm mới thành công!', 'ok');
                dlg.close();
                taiKeHoach();
            }).catch(function (err) { ums.api.handle(err, 'xác nhận theo kế hoạch'); });
        }
    }

    /* ---------- Hộp "Kết quả chứng chỉ" --------------------------------------- */
    function hopKetQua(id) {
        khId = id;
        var dlg = ui.dialog({
            title: 'Kết quả chứng chỉ', icon: 'fa-file-certificate', size: 'lg',
            body: '<div data-x="ds">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>'
        });
        var host = dlg.body.querySelector('[data-x="ds"]');
        function ve() {
            ui.table({
                el: host, rows: dtChungChi, empty: 'Hiện tại chưa có chứng chỉ nào',
                columns: [
                    { title: 'Loại chứng chỉ', prop: 'PHANLOAI_TEN' },
                    { title: 'Kết quả', prop: 'DIEM' },
                    { title: 'Cơ sở đào tạo', prop: 'DIEM_COSODAOTAOCNDIEM_TEN' },
                    {
                        title: 'Chọn', cls: 'is-center is-nowrap', width: '110px', render: function (r) {
                            return ui.btn('search', { text: 'Chi tiết', mod: 'ghost', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-x': 'sua', 'data-id': r.ID } });
                        }
                    }
                ]
            });
        }
        function tai() {
            return goi(A.dsChungChi, { strTN_KeHoach_Id: khId, strQLSV_NguoiHoc_Id: SV }).then(function (r) {
                var d = r.data;
                dtChungChi = arr(d && d.rs);
                if (!dlg.closed) ve();
            }).catch(function (err) {
                if (!dlg.closed) host.innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'danh sách chứng chỉ');
            });
        }
        dlg.body.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-x="sua"]');
            if (!b) return;
            var row = dtChungChi.filter(function (r) { return String(r.ID) === String(b.getAttribute('data-id')); })[0];
            if (!row) return;
            /* Biểu mẫu sửa mở TRONG TRANG: đóng hộp danh sách trước; đóng biểu mẫu thì mở lại hộp (hộp tự nạp lại danh sách) */
            dlg.close();
            hopMinhChung(row, function () { hopKetQua(id); });
        });
        tai();
    }

    /* ---------- Biểu mẫu "Khai chứng chỉ đã có(Minh chứng)" — trong trang ------- */
    /** row = null khi khai mới; khiDong() chạy khi biểu mẫu đóng (Đóng / lưu xong / xoá xong) — đường sửa dùng để
        mở lại hộp "Kết quả chứng chỉ" */
    function hopMinhChung(row, khiDong) {
        var mcId = row ? e(row.ID) : '';
        var khoaTep = 'CongNhan' + khId + SV;
        var dlg = pat.formTrang({
            host: root, title: 'Khai chứng chỉ đã có(Minh chứng)', icon: 'fa-file-certificate', cols: 1,
            onClose: function () { if (khiDong) khiDong(); },
            body:
                '<div class="ums-grid ums-grid--2">' +
                    ui.field('Chứng chỉ cần công nhận', '<select class="ums-select" data-x="pl" data-ph="Chọn chứng chỉ"><option value=""></option></select>') +
                    ui.field('Loại chứng chỉ', '<select class="ums-select" data-x="lcc" data-ph="Chọn loại chứng chỉ"><option value=""></option></select>') +
                    ui.field('Loại công nhận', '<select class="ums-select" data-x="lcn" data-ph="Chọn loại"><option value=""></option></select>') +
                    ui.field('Cơ sở đào tạo', '<select class="ums-select" data-x="cs" data-ph="Chọn cơ sở"><option value=""></option></select>') +
                    ui.field('Kết quả', '<input class="ums-input" data-x="kq" autocomplete="off">') +
                    ui.field('Ngày cấp', '<input class="ums-input" data-x="nc" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                    ui.field('Ngày hết hạn', '<input class="ums-input" data-x="nhh" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Kết quả</div>' +
                ui.field('Minh chứng', '<div data-x="tep"></div>'),
            buttons: [
                { text: 'Xóa', kind: 'del', mod: 'out-danger', onClick: function () { xoa(); return false; } },
                { text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }
            ]
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }
        ui.enhance(dlg.body);

        /* Nút Xóa chỉ dùng được khi đang sửa một chứng chỉ đã lưu */
        var nutXoa = dlg.el.querySelector('.ums-panel__tools [data-ft="0"]');     // formTrang: nút mang data-ft = chỉ số trong buttons
        if (nutXoa) nutXoa.disabled = !mcId;

        var tep = ums.files.mount(x('tep'), { api: 'SV_Files' });
        var ch = pat.chain([x('lcc'), x('lcn'), x('cs')], { phatLai: false });

        function napLoaiCongNhan(macDinh) {
            if (!x('lcc').value) { pat.fill(x('lcn'), [], { head: 'Chọn loại' }); pat.fill(x('cs'), [], { head: 'Chọn cơ sở' }); ch.sync(); return Promise.resolve(); }
            return goi(A.phanLoai2, { strLoaiCC_BD_Id: x('lcc').value }).then(function (r) {
                pat.fill(x('lcn'), arr(r.data), { head: 'Chọn loại' });
                if (macDinh) x('lcn').value = macDinh;
                if (window.jQuery) jQuery(x('lcn')).trigger('change.select2');
                ch.sync();
            }).catch(function (err) { ums.api.handle(err, 'loại công nhận'); });
        }
        function napCoSo(macDinh) {
            if (!x('lcn').value) { pat.fill(x('cs'), [], { head: 'Chọn cơ sở' }); ch.sync(); return Promise.resolve(); }
            return goi(A.coSo, { strLoaiCongNhan_Id: x('lcn').value }).then(function (r) {
                pat.fill(x('cs'), arr(r.data), { head: 'Chọn cơ sở' });
                if (macDinh) x('cs').value = macDinh;
                if (window.jQuery) jQuery(x('cs')).trigger('change.select2');
                ch.sync();
            }).catch(function (err) { ums.api.handle(err, 'cơ sở đào tạo'); });
        }
        if (window.jQuery) {
            jQuery(x('lcc')).on('select2:select select2:clear', function () { napLoaiCongNhan(''); });
            jQuery(x('lcn')).on('select2:select select2:clear', function () { napCoSo(''); });
        }

        /* Hai ô nạp một lần, không phụ thuộc ô nào */
        goi(A.phanLoaiCC, {}).then(function (r) {
            pat.fill(x('pl'), arr(r.data), { head: 'Chọn chứng chỉ' });
            if (row) { x('pl').value = e(row.PHANLOAI_ID); if (window.jQuery) jQuery(x('pl')).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'chứng chỉ cần công nhận'); });

        goi(A.loaiCC, {}).then(function (r) {
            pat.fill(x('lcc'), arr(r.data), { head: 'Chọn loại chứng chỉ' });
            if (!row) { ch.sync(); return; }
            x('lcc').value = e(row.THONGTINHOCPHAN_CHUNGCHI_ID);
            if (window.jQuery) jQuery(x('lcc')).trigger('change.select2');
            ch.sync();
            /* Bản gốc: getList_PhanLoai2 (async) rồi getList_CoSoTable với giá trị mặc định */
            return napLoaiCongNhan(e(row.LOAICONGNHAN_ID)).then(function () {
                return napCoSo(e(row.DIEM_COSODAOTAOCONGNHANDIEM_ID));
            });
        }).catch(function (err) { ums.api.handle(err, 'loại chứng chỉ'); });

        if (row) {
            x('kq').value = e(row.DIEM);
            x('nc').value = e(row.NGAYCAP);
            x('nhh').value = e(row.NGAYHETHAN);
            tep.load(khoaTep);
        } else {
            tep.clear();
        }

        function soTep() { return x('tep').querySelectorAll('.ums-files__item').length; }

        function luu() {
            if (!soTep()) { ui.toast('Bạn cần tải file minh chứng lên', 'warn'); return; }
            var api = mcId ? A.suaChungChi : A.themChungChi;
            goi(api, {
                strId: mcId,
                strTN_KeHoach_Id: khId,
                strLoaiCongNhan_Id: x('lcn').value,
                strQLSV_NguoiHoc_Id: SV,
                strPhanLoai_Id: x('pl').value,
                strDiem_CoSoCongNhan_Id: x('cs').value,
                strGhiChu: '',                       // bản gốc đọc txtGhiChu — ô không có trong màn
                strNgayHetHan: x('nhh').value,
                strNgayCap: x('nc').value,
                strDiem: x('kq').value,
                strThongTinHocPhan_ChungChi: x('lcc').value
            }).then(function () {
                ui.toast(mcId ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                return tep.save(khoaTep);
            }).then(function () {
                dlg.close();                 // onClose → khiDong (mở lại hộp danh sách, hộp tự nạp lại)
            }).catch(function (err) { ums.api.handle(err, 'lưu chứng chỉ'); });
        }

        function xoa() {
            if (!mcId) return;
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá chứng chỉ' }).then(function (yes) {
                if (!yes) return;
                return goi(A.xoaChungChi, { strId: mcId }).then(function () {
                    ui.toast('Xóa dữ liệu thành công!', 'ok');
                    dlg.close();
                });
            }).catch(function (err) { ums.api.handle(err, 'xoá chứng chỉ'); });
        }
    }

    /* ---------- Hộp "Tự xét" --------------------------------------------------- */
    function hopTuXet(id) {
        khId = id;
        var dlg = ui.dialog({
            title: 'Tự xét', icon: 'fa-clipboard-check', size: 'lg',
            body:
                '<div class="ums-grid htn-tuxet">' +
                    '<div><b class="ums-u-fz13">Kết quả</b>' +
                        '<div class="ums-u-mt-2"><span data-x="kq"></span></div></div>' +
                    '<div><b class="ums-u-fz13">Lý do</b>' +
                        '<div class="ums-u-mt-2" data-x="tc"></div></div>' +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Điều kiện:</div>' +
                '<div class="ums-u-fz13" data-x="dk"></div>',
            buttons: [{ text: 'Xét', kind: 'save', onClick: function () { xet(); return false; } }]
        });
        function x(k) { return dlg.body.querySelector('[data-x="' + k + '"]'); }

        function tai() {
            x('tc').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return goi(A.tuXet, { strTN_KeHoach_Id: khId, strQLSV_NguoiHoc_Id: SV }).then(function (r) {
                if (dlg.closed) return;
                var d = r.data || {}, rs = arr(d.rs);
                x('kq').innerHTML = rs.length ? ui.badge(e(rs[0].KETQUA), 'ok') : '';
                x('dk').textContent = rs.length ? e(rs[0].DIEUKIEN) : '';
                ui.table({
                    el: x('tc'), rows: arr(d.rsTieuChi), empty: 'Chưa có tiêu chí xét',
                    columns: [
                        { title: 'Tiêu chí', prop: 'TEN' },
                        { title: 'Kết quả', prop: 'KETQUA' }
                    ]
                });
            }).catch(function (err) {
                if (!dlg.closed) x('tc').innerHTML = ui.fail(err.message);
                ums.api.handle(err, 'kết quả tự xét');
            });
        }

        function xet() {
            /* Năm tham số dưới đây bản gốc đọc từ ô `dropAAAA` không tồn tại → gửi rỗng */
            goi(A.xet, {
                strQLSV_NguoiHoc_Id: SV,
                strDaoTao_LopQuanLy_Id: '',
                strDaoTao_ChuongTrinh_Id: '',
                strQLSV_TrangThaiNguoiHoc_Id: '',
                strDaoTao_ThoiGianDaoTao_Id: '',
                strTN_KeHoach_Id: khId,
                strPhanLoai_Id: ''
            }).then(function () {
                ui.toast('Thực hiện xong!', 'ok');
                return tai();
            }).catch(function (err) { ums.api.handle(err, 'xét tốt nghiệp'); });
        }
        tai();
    }

    /* ---------- Sự kiện -------------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        if (a === 'search') { taiKeHoach(); return; }
        if (a === 'xacnhan') { hopXacNhan(id); return; }
        if (a === 'khai') { khId = id; hopMinhChung(null, null); return; }
        if (a === 'ketqua') { hopKetQua(id); return; }
        if (a === 'tuxet') { hopTuXet(id); return; }
    });
    /* Đổi chương trình thì nạp lại danh sách (bản gốc nghe select2:select) */
    fCT.addEventListener('change', taiKeHoach);

    /* ---------- Nạp đầu tiên --------------------------------------------------- */
    z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
    goi(A.chuongTrinh, { strQLSV_NguoiHoc_Id: SV }).then(function (r) {
        var d = arr(r.data);
        pat.fill(fCT, d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_TOCHUCCHUONGTRINH_TEN', head: 'Chọn chương trình' });
        /* selectOne của bản gốc: mặc định là mục CUỐI danh sách rồi bắn change */
        if (d.length) {
            fCT.value = d[d.length - 1].DAOTAO_TOCHUCCHUONGTRINH_ID;
            if (window.jQuery) jQuery(fCT).trigger('change.select2');
        }
    }).catch(function (err) {
        ums.api.handle(err, 'danh sách chương trình');
    }).then(taiKeHoach);
})();
