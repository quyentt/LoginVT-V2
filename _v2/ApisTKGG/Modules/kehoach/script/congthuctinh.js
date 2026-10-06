/* =========================================================================
   Công thức tính (Thống kê giờ giảng → Tổng hợp giờ)
   Bản gốc: ApisTKGG/Modules/kehoach/html/congthuctinh.html + script/congthuctinh.js (1.512 dòng)
   ---------------------------------------------------------------------------
   Một cột như gốc, hai khối xếp dọc: (1) Công thức áp dụng — lọc Thời gian khai công thức + từ khoá, bảng, Thêm mới (biểu mẫu trong trang:
   Phạm vi → Loại · Thời gian · Xâu công thức), "Thêm mới theo lớp học phần" (khung thay chỗ: chuỗi ô lọc ĐKH → bảng lớp học phần chọn nhiều
   + Thời gian + Xâu công thức → lưu mỗi lớp một công thức); (2) Thông tin từ khoá — bảng + biểu mẫu trong trang + nút "Xem" mở khung
   "Chi tiết tham số" (crud lồng, thay chỗ màn).

   Lời gọi (NS_KLGD_ThongTin_MH, POST mã hoá, có func — chép nguyên):
       DSA4BRIVKS4oBiggLwopICgCLi8mFSk0IgPP  pkg_klgv_v2_thongtin.LayDSThoiGianKhaiCongThuc        ô lọc Thời gian (THOIGIAN)
       DSA4BRIKDQYFHgIuLyYVKTQiHgAxBTQvJgPP  pkg_klgv_v2_thongtin.LayDSKLGD_CongThuc_ApDung         strTuKhoa, strDaoTao_ThoiGianDaoTao_Id
       FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP  pkg_klgv_v2_thongtin.Them_KLGD_CongThuc_ApDung         strId, strDaoTao_ThoiGianDaoTao_Id, strXauCongThuc, strPhamViDung_Id (= ô Loại)
       EjQgHgoNBgUeAi4vJhUpNCIeADEFNC8m      pkg_klgv_v2_thongtin.Sua_KLGD_CongThuc_ApDung          khi có strId
       GS4gHgoNBgUeAi4vJhUpNCIeADEFNC8m      pkg_klgv_v2_thongtin.Xoa_KLGD_CongThuc_ApDung          strId — mỗi dòng một lời gọi
       (theo lớp HP) FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung  strPhamViDung_Id = id lớp học phần, mỗi lớp một lời gọi
       DSA4BRIKDQYFHhU0CikuIAPP / FSkkLB4KDQYFHhU0CikuIAPP / EjQgHgoNBgUeFTQKKS4g / GS4gHgoNBgUeFTQKKS4g   LayDS / Them / Sua / Xoa _KLGD_TuKhoa
           strId, strTuKhoa, strTenFunction, strTenPKG, strTenDataBaseLink, strTenTuKhoa, strMoTa
       DSA4BRIKDQYFHhU0CikuIB4VKSAsEi4P / FSkkLB4KDQYFHhU0CikuIB4VKSAsEi4P / EjQgHgoNBgUeFTQKKS4gHhUpICwSLgPP / GS4gHgoNBgUeFTQKKS4gHhUpICwSLgPP   … _KLGD_TuKhoa_ThamSo
           strKLGD_TuKhoa_Id; strId, strTenThamSo, strGiaTriMacDinh, strPhanLoai, dThuTu, strMoTa
       Danh mục KLGD.PHANLOAIXACNHAN (ô Phạm vi) → NS_KLGD_XacNhan_MH … LayDSLoaiXacNhan_HanhDong (ô Loại — ums.tkgg.loaiApDung)
       edu.system.getList_ThoiGianDaoTao → ums.ref.thoiGianDaoTao (ô Thời gian của hai biểu mẫu)
       Khung theo lớp HP: DKH_Chung/LayThoiGianDangKyHoc · ums.ref.heDaoTao · DKH_PhanCong_LopHP/LayDSKhoaToChuc · ums.ref.khoaQuanLy ·
           DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc · DKH_PhanCong_LopHP/LayDSHocPhan · DKH_ThongTin/LayDSLopHocPhan (tham số như gốc, phân trang máy chủ)
   Giữ như gốc: ô Kiểu dữ liệu / Số chữ số làm tròn của từ khoá có trên biểu mẫu gốc nhưng KHÔNG gửi → bỏ hai ô; cột Hiệu lực không có.
   Khác gốc (lỗi rõ ràng):
     · Sửa công thức: gốc đổ PHAMVIAPDUNG_ID (id LOẠI) vào ô Phạm vi (nhóm) → không khớp, ô trống; ở đây tìm nhóm chứa loại rồi chọn sẵn cả hai (KIỂM HOST).
     · Lưu công thức gốc kiểm ô txtCongThucTinh_So không có → không chặn gì; ở đây bắt buộc Loại + Xâu công thức.
     · Khung theo lớp HP: nút Lưu gốc báo "chọn đối tượng cần xóa" khi chưa chọn lớp → "chọn lớp học phần"; chuỗi ô lọc khoá cha → con (pat.chain).
     · Xoá nhiều / lưu nhiều: hỏi một lần, chạy tuần tự có tiến độ (gốc gắn chồng #btnYes, bắn N lời gọi cùng lúc).
   Cố ý bỏ (mã chết): hộp "Kế thừa tham số" (btnSave_KTDieuKien / KTXepLoai không có xử lý); hộp Xác nhận (modal_XacNhan, zoneBtnXacNhan — không có
   xử lý nào trong init); modal_nhansu / modal_sinhvien rỗng; cột "Số chữ số làm tròn" gốc đã ghi chú.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, T = ums.tkgg;
    var root = document.getElementById('tkgg-congthuctinh');
    if (!root) return;
    function e(v) { return T.e(v); }
    var TT = 'NS_KLGD_ThongTin_MH/', P = 'pkg_klgv_v2_thongtin.';
    var TG = { call: { action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao', strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }, name: 'DAOTAO_THOIGIANDAOTAO' };

    root.innerHTML = pat.page('Công thức tính', '') + '<div data-z="ct"></div><div class="ums-u-mt-5" data-z="tk"></div>';

    /* ---------- 1. Công thức áp dụng ---------- */
    var crudCT = ums.crud({
        root: root.querySelector('[data-z="ct"]'), embedded: true, listTitle: 'Danh sách', formTitle: 'công thức tính', icon: 'fa-square-root-variable',
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: { call: { action: TT + 'DSA4BRIVKS4oBiggLwopICgCLi8mFSk0IgPP', func: P + 'LayDSThoiGianKhaiCongThuc' }, name: 'THOIGIAN' } },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        toolbar: [{ text: 'Thêm mới theo lớp học phần', icon: 'fa-plus', mod: 'out-primary', onClick: function () { moTheoLop(); } }],
        list: { call: function (f) { return { action: TT + 'DSA4BRIKDQYFHgIuLyYVKTQiHgAxBTQvJgPP', func: P + 'LayDSKLGD_CongThuc_ApDung', strTuKhoa: e(f.q), strDaoTao_ThoiGianDaoTao_Id: e(f.tg) }; } },
        columns: [
            { title: 'Xâu công thức', render: function (r) { return '<code class="ums-u-fz13">' + ui.esc(e(r.XAUCONGTHUC)) + '</code>'; } },
            { title: 'Phạm vi áp dụng', prop: 'PHAMVIAPDUNG_TEN' },
            { title: 'Thời gian áp dụng', prop: 'THOIGIAN', cls: 'is-center is-nowrap' }
        ],
        fields: [
            { key: '_pv', label: 'Phạm vi áp dụng', type: 'select', required: true, source: { dm: 'KLGD.PHANLOAIXACNHAN' } },
            { key: 'strPhamViDung_Id', col: 'PHAMVIAPDUNG_ID', label: 'Loại', type: 'select', required: true, placeholder: 'Chọn loại', source: { items: [] } },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'THOIGIAN_ID', label: 'Thời gian', type: 'select', source: TG },
            { key: 'strXauCongThuc', col: 'XAUCONGTHUC', label: 'Xâu công thức', type: 'textarea', required: true, span: true }
        ],
        onForm: function (row) { noiPhamViLoai(root.querySelector('[data-z="ct"]'), '_pv', 'strPhamViDung_Id', row ? e(row.PHAMVIAPDUNG_ID) : ''); },
        save: function (v, row) {
            return { action: TT + (row ? 'EjQgHgoNBgUeAi4vJhUpNCIeADEFNC8m' : 'FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP'), func: P + (row ? 'Sua_KLGD_CongThuc_ApDung' : 'Them_KLGD_CongThuc_ApDung'), method: 'POST',
                strId: row ? row.ID : '', strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id, strXauCongThuc: v.strXauCongThuc, strPhamViDung_Id: v.strPhamViDung_Id };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: TT + 'GS4gHgoNBgUeAi4vJhUpNCIeADEFNC8m', func: P + 'Xoa_KLGD_CongThuc_ApDung', method: 'POST', strId: id }; }); }
    });
    /* Ô "Loại" theo ô "Phạm vi" (gốc: dropPhamViApDung → LayDSLoaiXacNhan_HanhDong → dropLoaiApDung). Khi sửa chỉ biết id LOẠI → dò nhóm chứa nó. */
    function noiPhamViLoai(host, kPV, kLoai, loaiChon) {
        var pv = host.querySelector('select[data-scope="form"][data-k="' + kPV + '"]'), loai = host.querySelector('select[data-scope="form"][data-k="' + kLoai + '"]');
        if (!pv || !loai) return;
        var luot = 0;
        function nap(chon) { var l = ++luot; pv._tkggVal = pv.value; pat.fill(loai, [], { head: 'Chọn loại' }); return T.loaiApDung(pv.value).then(function (rows) { if (l !== luot) return rows; pat.fill(loai, rows, { head: 'Chọn loại' }); if (chon) { loai.value = chon; if (window.jQuery) jQuery(loai).trigger('change'); } return rows; }); }
        function doi() { if (pv.value === pv._tkggVal) return; nap(''); }   // bỏ qua change do crud đổ giá trị; đổi Phạm vi thật mới nạp lại Loại
        if (!pv._tkgg) { pv._tkgg = true; /* jQuery: trigger có namespace (change.select2) không gọi handler 'change' trơn → nghe cả hai */ if (window.jQuery) jQuery(pv).on('change change.select2', doi); else pv.addEventListener('change', doi); }
        if (!loaiChon) { pat.fill(loai, [], { head: 'Chọn loại' }); return; }
        // dò nhóm: thử từng phạm vi tới khi danh sách loại chứa id đang sửa
        var nhoms = Array.prototype.filter.call(pv.options, function (o) { return o.value; }).map(function (o) { return o.value; });
        (function thu(i) {
            if (i >= nhoms.length) { pat.fill(loai, [], { head: 'Chọn loại' }); return; }
            T.loaiApDung(nhoms[i]).then(function (rows) {
                if (rows.some(function (r) { return e(r.ID) === loaiChon; })) { pv.value = nhoms[i]; pv._tkggVal = pv.value; if (window.jQuery) jQuery(pv).trigger('change.select2'); pat.fill(loai, rows, { head: 'Chọn loại' }); loai.value = loaiChon; if (window.jQuery) jQuery(loai).trigger('change'); }
                else thu(i + 1);
            });
        })(0);
    }

    /* ---------- 1b. Thêm mới theo lớp học phần (khung thay chỗ màn) ---------- */
    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" multiple data-f="' + k + '" data-ph="' + ui.esc(ph) + '"></select></div>'; }
    function moTheoLop() {
        var body = document.createElement('div');
        body.innerHTML = '<div class="ums-grid ums-grid--main-aside">' +
            '<div><div class="ums-legend">Phạm vi áp dụng</div><div class="ums-grid ums-grid--3 ums-u-mb-2">' +
                sel('tg', '--Chọn thời gian--') + sel('he', '--Chọn hệ đào tạo--') + sel('khoa', '--Chọn khóa đào tạo--') + sel('kql', 'Chọn khoa quản lý') + sel('ct', '--Chọn chương trình--') + sel('hp', 'Chọn học phần') +
                '</div><div class="ums-u-mb-2" style="text-align:right">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div><div data-z="bang"></div></div>' +
            '<div><div class="ums-field"><label class="ums-field__label">Thời gian</label><select class="ums-select" data-f="tgl" data-ph="Chọn thời gian"><option value="">Chọn thời gian</option></select></div>' +
                '<div class="ums-field"><label class="ums-field__label">Xâu công thức</label><textarea class="ums-input" data-f="xau" rows="6"></textarea></div></div></div>';
        var f = function (k) { return body.querySelector('[data-f="' + k + '"]'); };
        var el = { tg: f('tg'), he: f('he'), khoa: f('khoa'), kql: f('kql'), ct: f('ct'), hp: f('hp'), tgl: f('tgl') };
        var rows = [], page = { index: 1, size: 10, total: 0 }, chon = {};
        pat.formTrang({ host: root, title: 'Thêm mới theo phạm vi theo lớp học phần', icon: 'fa-plus', cols: 1, body: body,
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) { luu(api); return false; } }] });
        Object.keys(el).forEach(function (k) { ui.select2(el[k], { placeholder: el[k].getAttribute('data-ph'), allowClear: true }); });
        pat.chain([el.tg, el.he, el.khoa, el.ct, el.hp]);
        function v(k) { return pat.val(el[k]); }
        ums.api.call({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET' }).then(function (r) { pat.fill(el.tg, T.arr(r.data), { name: function (x) { return e(x.DAOTAO_THOIGIANDAOTAO || x.TEN); } }); }).catch(function (err) { ums.api.handle(err, 'thời gian đăng ký học'); });
        ums.ref.khoaQuanLy().then(function (d) { pat.fill(el.kql, T.arr(d), { name: 'TEN' }); });
        ums.ref.thoiGianDaoTao({ strNam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 }).then(function (d) { pat.fill(el.tgl, T.arr(d), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); });
        function napHe() { ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000000 }).then(function (d) { pat.fill(el.he, T.arr(d), { name: 'TENHEDAOTAO' }); }); }
        function napKhoa() { ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ThoiGianDaoTao_Id: v('tg') }).then(function (r) { pat.fill(el.khoa, T.arr(r.data), { name: function (x) { return e(x.TENKHOA || x.TEN); } }); }); }
        function napCT() { ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql') }).then(function (r) { pat.fill(el.ct, T.arr(r.data), { name: function (x) { return e(x.TENCHUONGTRINH || x.TEN); } }); }); }
        function napHP() { ums.api.call({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') }).then(function (r) { pat.fill(el.hp, T.arr(r.data), { name: function (x) { return e(x.TENHOCPHAN || x.TEN); } }); }); }
        el.tg.addEventListener('change', napHe); el.he.addEventListener('change', function () { napKhoa(); napCT(); }); el.khoa.addEventListener('change', function () { napCT(); napHP(); }); el.ct.addEventListener('change', napHP);
        function ve() {
            ui.table({ el: body.querySelector('[data-z="bang"]'), rows: rows, stt: true, empty: 'Chọn điều kiện rồi bấm Tìm kiếm', page: { index: page.index, size: page.size, total: page.total, onChange: tai },
                columns: [{ title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' }, { title: 'Tên lớp', prop: 'TENLOP' },
                    { head: '<input type="checkbox" data-ck="all" title="Chọn tất cả">', cls: 'is-center', width: '44px', render: function (r) { return '<input type="checkbox" data-ck="' + ui.esc(e(r.ID)) + '"' + (chon[r.ID] ? ' checked' : '') + '>'; } }] });
        }
        function tai(p) {
            page.index = p || 1;
            ums.api.call({ action: 'DKH_ThongTin/LayDSLopHocPhan', method: 'GET', strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: v('tg'), strDaoTao_HocPhan_Id: v('hp'), pageIndex: page.index, pageSize: page.size,
                strDangKy_KeHoachDangKy_Id: '', dLocGanTheoCTDT: 0, dChiLayCacLopChuaPhanCong: 0, strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaQuanLy_Id: v('kql'), dSoDaDangTuSo: -1, dSoDaDangDenSo: -1, strDaoTao_CoSoDaoTao_Id: '' })
                .then(function (r) { rows = T.arr(r.data); page.total = Number(r.pager) || rows.length; ve(); }).catch(function (err) { ums.api.handle(err, 'danh sách lớp học phần'); });
        }
        body.addEventListener('change', function (ev) {
            var c = ev.target; if (!c.matches('input[type=checkbox][data-ck]')) return;
            if (c.getAttribute('data-ck') === 'all') { rows.forEach(function (r) { if (c.checked) chon[r.ID] = true; else delete chon[r.ID]; }); ve(); return; }
            if (c.checked) chon[c.getAttribute('data-ck')] = true; else delete chon[c.getAttribute('data-ck')];
        });
        body.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="tim"]')) tai(1); });
        function luu(api) {
            var ids = Object.keys(chon);
            if (!ids.length) { ui.toast('Vui lòng chọn lớp học phần', 'warn'); return; }
            if (!f('xau').value.trim()) { ui.toast('Nhập xâu công thức', 'warn'); return; }
            ui.batch(ids.map(function (id) { return { action: TT + 'FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP', func: 'PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung', method: 'POST', strDaoTao_ThoiGianDaoTao_Id: pat.val(el.tgl), strXauCongThuc: f('xau').value.trim(), strPhamViDung_Id: id }; }),
                { title: 'Đang lưu công thức cho ' + ids.length + ' lớp', okText: 'Thêm mới thành công!' }).then(function () { api.close(); crudCT.load(); });
        }
        ve();
    }

    /* ---------- 2. Thông tin từ khoá + tham số ---------- */
    var crudTK = ums.crud({
        root: root.querySelector('[data-z="tk"]'), embedded: true, listTitle: 'Xem thông tin từ khóa', formTitle: 'từ khóa', icon: 'fa-key',
        list: { call: function () { return { action: TT + 'DSA4BRIKDQYFHhU0CikuIAPP', func: P + 'LayDSKLGD_TuKhoa' }; } },
        columns: [
            { title: 'Từ khóa', prop: 'TUKHOA', cls: 'is-nowrap' }, { title: 'Tên từ khóa hiển thị', prop: 'TENTUKHOA' }, { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Tên gói', prop: 'TENPKG' }, { title: 'Tên phương thức', prop: 'TENFUNCTION' }, { title: 'Tên liên kết', prop: 'TENDATABASELINK' }
        ],
        rowActions: [{ icon: 'fa-eye', title: 'Xem', onClick: function (row) { moThamSo(row); } }],
        fields: [
            { key: 'strTuKhoa', col: 'TUKHOA', label: 'Từ khóa', required: true }, { key: 'strTenTuKhoa', col: 'TENTUKHOA', label: 'Tên từ khóa' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' }, { key: 'strTenPKG', col: 'TENPKG', label: 'Tên gói' },
            { key: 'strTenFunction', col: 'TENFUNCTION', label: 'Tên phương thức' }, { key: 'strTenDataBaseLink', col: 'TENDATABASELINK', label: 'Tên liên kết' }
        ],
        save: function (v, row) {
            return { action: TT + (row ? 'EjQgHgoNBgUeFTQKKS4g' : 'FSkkLB4KDQYFHhU0CikuIAPP'), func: P + (row ? 'Sua_KLGD_TuKhoa' : 'Them_KLGD_TuKhoa'), method: 'POST', strId: row ? row.ID : '',
                strTuKhoa: v.strTuKhoa, strTenFunction: v.strTenFunction, strTenPKG: v.strTenPKG, strTenDataBaseLink: v.strTenDataBaseLink, strTenTuKhoa: v.strTenTuKhoa, strMoTa: v.strMoTa };
        },
        remove: function (ids) { return ids.map(function (id) { return { action: TT + 'GS4gHgoNBgUeFTQKKS4g', func: P + 'Xoa_KLGD_TuKhoa', method: 'POST', strId: id }; }); }
    });
    function moThamSo(tk) {
        var body = document.createElement('div');
        pat.formTrang({ host: root, title: 'Chi tiết tham số — ' + e(tk.TUKHOA), icon: 'fa-table-list', cols: 1, body: body, flush: true });
        ums.crud({
            root: body, embedded: true, listTitle: 'Tham số', formTitle: 'tham số chi tiết', icon: 'fa-table-list',
            list: { call: function () { return { action: TT + 'DSA4BRIKDQYFHhU0CikuIB4VKSAsEi4P', func: P + 'LayDSKLGD_TuKhoa_ThamSo', strKLGD_TuKhoa_Id: tk.ID }; } },
            columns: [{ title: 'Tên tham số', prop: 'TENTHAMSO' }, { title: 'Giá trị mặc định', prop: 'GIATRIMACDINH' }, { title: 'Phân loại', prop: 'PHANLOAI' }, { title: 'Mô tả', prop: 'MOTA' }, { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center' }],
            fields: [
                { key: 'strTenThamSo', col: 'TENTHAMSO', label: 'Tên tham số', required: true }, { key: 'strGiaTriMacDinh', col: 'GIATRIMACDINH', label: 'Giá trị mặc định' },
                { key: 'strPhanLoai', col: 'PHANLOAI', label: 'Phân loại' }, { key: 'dThuTu', col: 'THUTU', label: 'Thứ tự', type: 'number' }, { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', span: true }
            ],
            save: function (v, row) {
                return { action: TT + (row ? 'EjQgHgoNBgUeFTQKKS4gHhUpICwSLgPP' : 'FSkkLB4KDQYFHhU0CikuIB4VKSAsEi4P'), func: P + (row ? 'Sua_KLGD_TuKhoa_ThamSo' : 'Them_KLGD_TuKhoa_ThamSo'), method: 'POST', strId: row ? row.ID : '',
                    strTenThamSo: v.strTenThamSo, strGiaTriMacDinh: v.strGiaTriMacDinh, strKLGD_TuKhoa_Id: tk.ID, strPhanLoai: v.strPhanLoai, dThuTu: v.dThuTu, strMoTa: v.strMoTa };
            },
            remove: function (ids) { return ids.map(function (id) { return { action: TT + 'GS4gHgoNBgUeFTQKKS4gHhUpICwSLgPP', func: P + 'Xoa_KLGD_TuKhoa_ThamSo', method: 'POST', strId: id }; }); }
        });
    }
})();
