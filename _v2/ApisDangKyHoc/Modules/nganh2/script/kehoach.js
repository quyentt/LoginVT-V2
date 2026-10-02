/* =========================================================================
   Kế hoạch ngành 2 (đăng ký học ngành tiếp theo)
   Bản gốc: ApisDangKyHoc/Modules/nganh2/html/kehoach.html + script/kehoach.js (84 KB)
   ---------------------------------------------------------------------------
   Một cột như gốc. Vùng danh sách (zonebatdau): thanh lọc Phân loại + từ khoá + Tìm kiếm + Xuất báo cáo,
   khung "Chọn trạng thái sinh viên" (chỉ làm tham số báo cáo), bảng kế hoạch (Thêm mới · Xoá đã chọn).
   Bốn vùng thay chỗ danh sách, như toggle_overide của gốc:
     · Biểu mẫu kế hoạch (zoneEdit) — ums.crud, kèm lưới "Phạm vi đăng ký" Hệ / Khoá lưu SAU kế hoạch;
     · "Ngành mở đăng ký" (zoneNganh)   — nút Chi tiết ở cột "Ngành mở đăng ký";
     · "Danh sách đã đăng ký" (zoneSinhVien) — nút Chi tiết ở cột "Kết quả đăng ký";
     · "Giới hạn" (zoneGioiHan)          — nút Chi tiết ở cột "Giới hạn".
   Lời gọi — chép nguyên văn (kiểu cũ, không mã hoá; riêng nhóm Giới hạn là DKH_Nganh2_MH + func):
     Kế hoạch   DKH_Nganh2/LayDSKeHoach GET (strTuKhoa, strNguoiThucHien_Id, strPhanLoai_Id)
                  → TENKEHOACH, PHANLOAI_ID/_TEN, MOHINHDANGKY_ID/_TEN, TUNGAY, DENNGAY, HIEULUC, MOTA
                DKH_Nganh2/Them_DangKy_Nganh_Tiep | Sua_DangKy_Nganh_Tiep  (strId, strPhanLoai_Id, strTenKeHoach,
                  strMoTa, strTuNgay, strDenNgay, dHieuLuc, strMoHinhDangKy_Id) · Xoa_DangKy_Nganh_Tiep (strId, từng dòng)
                DKH_Nganh2/LayDSQLSV_NguoiDung_PhanLoai GET (ô Phân loại) · danh mục QLSV.DANGKY.NGANH2.MOHINH (ô Mô hình)
     Phạm vi    DKH_Nganh2/LayDSDangKy_Nganh_Tiep_PhamVi GET · Them_ | Sua_DangKy_Nganh_Tiep_PhamVi (strId,
                  strDaoTao_HeDaoTao_Id, strPhamViApDung_Id = KHOÁ, strQLSV_DangKy_Nganh_Tiep_Id) · Xoa_… (strId)
                  (cột DAOTAO_HEDAOTAO_ID, PHAMVIAPDUNG_ID). Ô Hệ: KHCT_HeDaoTao/LayDanhSach GET; ô Khoá:
                  KHCT_KhoaDaoTao/LayDanhSach GET (strDaoTao_HeDaoTao_Id của dòng — dòng đã lưu nạp sẵn mọi khoá như gốc)
     Ngành mở   DKH_Nganh2/LayDSDK_Nganh_Tiep_PV_MoNganh GET (pageSize 1000000) → DAOTAO_HEDAOTAO_TEN, DAOTAO_KHOADAOTAO_TEN,
                  DAOTAO_TOCHUCCHUONGTRINH_TEN, DAOTAO_LOPQUANLY_TEN, XAUDIEUKIEN, MOTA
                Them_DK_Nganh_Tiep_PV_MoNganh (mỗi LỚP chọn ở hộp ums.dkhChon.lop = genModal_Lop, xâu điều kiện ở hộp)
                Sua_DK_Nganh_Tiep_PV_MoNganh ("Cập nhật điều kiện": chỉ dòng có ô điều kiện đổi; Hệ/Khoá/CT/Lớp gửi RỖNG
                  như gốc — aData = {}) · Xoa_DK_Nganh_Tiep_PV_MoNganh (strId)
     Kết quả    DKH_Nganh2/LayDSDK_Nganh_Tiep_KetQua GET (strQLSV_NguoiHoc_Id "", strDaoTao_ChuongTrinh_Id "")
                "Duyệt": nút lấy từ danh mục QLSV.DANGKY.NGANH.TIEP.DUYET (THONGTIN1 biểu tượng FA4 → ums.iconFA4,
                  THONGTIN2 kiểu chữ); mỗi dòng đánh dấu → DKH_Nganh2/Them_DK_Nganh_Tiep_Duyet (strSanPham_Id =
                  QLSV_DANGKY_NGANH_TIEP_ID + QLSV_NGUOIHOC_ID + DAOTAO_CHUONGTRINH_ID + DAOTAO_CHUONGTRINH_DANGKY_ID,
                  strNguoiXacnhan_Id, strNoiDung, strTinhTrang_Id)
     Giới hạn   DKH_Nganh2_MH/… pkg_dangkyhoc_nganh2.LayDSQLSV_DangKy_Nganh_GioiHan · LayDSChuongTrinhDeGioiHan ·
                  LayDSLopQuanLyDeGioiHan · Them_QLSV_DangKy_Nganh_GioiHan (strDaoTao_LopQL_GioiHan_Id, strDaoTao_CT_DangKy_Id)
                  · Xoa_QLSV_DangKy_Nganh_GioiHan (strId)
     Báo cáo    getList_MauImport("zonebtnBaoCao_KH") → ums.report.mount (không vùng _Import → import: false):
                  strTuKhoa / strDaoTao_ThoiGianDaoTao_Id / strHB_QuyHocBong_Id = "" (gốc đọc ô KHÔNG có trên màn),
                  strQLSV_TrangThaiNguoiHoc_Id (ô trạng thái), rồi mỗi kế hoạch đánh dấu: strHocBong_Id, sau đó
                  strQLSV_DANGKY_NGANH_TIEP_ID (đúng thứ tự gốc).
   Khác bản gốc:
     · Cột "Phạm vi đăng ký" của gốc là nút SỬA thứ hai (cùng btnEdit với cột "Sửa") → bỏ cột trùng; phạm vi nằm
       trong biểu mẫu sửa.
     · "Duyệt": gốc gửi strTinhTrang_Id = ô dropAAAA (KHÔNG tồn tại → luôn rỗng) dù đã nhận nút tình trạng người dùng
       bấm → bản mới gửi ID nút đã bấm (đường GHI mới — kiểm trên host).
     · "Cập nhật điều kiện" khi không có dòng nào đổi: gốc báo rồi vẫn mở hộp tiến độ rỗng → bản mới dừng.
     · Hộp chọn lớp gửi chữ trong ô từ khoá (gốc đọc txtAAAA) — xem _nvchon.js.
     · Bỏ (mã chết / vùng không có trên màn): save_Lop / save_ChuongTrinh / save_Khoa (HB_XepLoaiDanhHieu),
       getList_BtnXacNhanSanPham, getList_XacNhan (bảng "Lịch sử xác nhận" không bao giờ được nạp — giữ khung trống),
       hộp thêm/xoá sinh viên (btnSearchDTSV_SinhVien / btnDeleteDTSV_SinhVien nằm trong khối html đã chú thích),
       báo cáo thứ hai "zonebtnBaoCao_NguyenVong" (vùng không có trên màn).
     · Nút "Lưu" ở chân vùng Kết quả và Giới hạn (btnSave_SinhVien): gốc không có xử lý → giữ, khoá.
   Ô cha → con: Hệ → Khoá trong TỪNG DÒNG phạm vi (khoá ô Khoá khi dòng chưa chọn Hệ; đổi/xoá Hệ thì xoá trắng
     và nạp lại Khoá theo Hệ). Hộp chọn lớp: ô "Tất cả …" chọn nhiều là lọc tuỳ chọn — không khoá.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('ng2-kehoach');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function qa(r, s) { return Array.prototype.slice.call(r.querySelectorAll(s)); }
    var C = 'DKH_Nganh2/';

    root.innerHTML = '<div data-z="ds"></div><div data-z="ct" hidden></div>';
    var elDs = root.querySelector('[data-z="ds"]');
    var elCt = root.querySelector('[data-z="ct"]');

    var PHANLOAI = { call: { action: C + 'LayDSQLSV_NguoiDung_PhanLoai', method: 'GET', strNguoiThucHien_Id: uid() }, name: 'TEN' };
    var tt = null, pv = null;

    /* ---------- Lưới "Phạm vi đăng ký" (Hệ → Khoá trong từng dòng) -------- */
    var HE = null;
    function dsHe() {
        if (!HE) {
            HE = ums.api.call({ action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '',
                strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000000 })
                .then(function (r) { return arr(r.data); }, function (err) { HE = null; throw err; });
        }
        return HE;
    }
    function dsKhoa(he) {
        return ums.api.call({ action: 'KHCT_KhoaDaoTao/LayDanhSach', method: 'GET', silent: true, strTuKhoa: '',
            strDaoTao_HeDaoTao_Id: he, strDaoTao_CoSoDaoTao_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000 })
            .then(function (r) { return arr(r.data); });
    }
    function khoaDong(host) {
        qa(host, 'tbody tr').forEach(function (tr) {
            var h = tr.querySelector('[data-rk="strDaoTao_HeDaoTao_Id"]'), k = tr.querySelector('[data-rk="strPhamViApDung_Id"]');
            if (h && k) k.disabled = !h.value;
        });
    }
    function dungPhamVi(host, row) {
        host.innerHTML = '<div data-z="pvl"></div><div class="ums-u-faint ums-u-fz13 ums-u-mt-2">Chú ý: Phải chọn đầy đủ hệ, khóa</div>';
        var g = host.querySelector('[data-z="pvl"]');
        pv = pat.rows(g, {
            title: 'Phạm vi đăng ký', icon: 'fa-users-viewfinder',
            columns: [
                { key: 'strDaoTao_HeDaoTao_Id', col: 'DAOTAO_HEDAOTAO_ID', title: 'Hệ đào tạo', type: 'select', placeholder: 'Chọn hệ đào tạo',
                  source: { load: dsHe, name: 'TENHEDAOTAO' } },
                { key: 'strPhamViApDung_Id', col: 'PHAMVIAPDUNG_ID', title: 'Khóa học', type: 'select', placeholder: 'Chọn khóa học',
                  source: { load: function () { return dsKhoa(''); }, name: 'TENKHOA' } }
            ],
            list: function (id) { return { action: C + 'LayDSDangKy_Nganh_Tiep_PhamVi', method: 'GET', strQLSV_DangKy_Nganh_Tiep_Id: id, strNguoiThucHien_Id: uid() }; },
            filled: function (v) { return !!(v.strDaoTao_HeDaoTao_Id && v.strPhamViApDung_Id); },
            save: function (v, rec, id) {
                return { action: C + (rec ? 'Sua_DangKy_Nganh_Tiep_PhamVi' : 'Them_DangKy_Nganh_Tiep_PhamVi'), method: 'POST',
                    strId: rec ? rec.ID : '', strDaoTao_HeDaoTao_Id: v.strDaoTao_HeDaoTao_Id, strPhamViApDung_Id: v.strPhamViApDung_Id,
                    strQLSV_DangKy_Nganh_Tiep_Id: id, strNguoiThucHien_Id: uid() };
            },
            remove: function (rec) { return { action: C + 'Xoa_DangKy_Nganh_Tiep_PhamVi', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
        });
        pv.load(row ? row.ID : '').then(function () { khoaDong(g); });
        // Dòng mới thêm: khoá ô Khoá cho tới khi chọn Hệ
        g.addEventListener('click', function (ev) { if (ev.target.closest('[data-rows="add"]')) setTimeout(function () { khoaDong(g); }, 0); });
        // Đổi / xoá Hệ của một dòng → xoá trắng Khoá, nạp lại theo Hệ (getList_KhoaDaoTao_InTable)
        g.addEventListener('change', function (ev) {
            var h = ev.target;
            if (!h.matches || !h.matches('[data-rk="strDaoTao_HeDaoTao_Id"]')) return;
            var k = h.closest('tr').querySelector('[data-rk="strPhamViApDung_Id"]');
            k.innerHTML = '<option value="">Chọn khóa học</option>';
            k.disabled = !h.value;
            if (!h.value) return;
            dsKhoa(h.value).then(function (ds) {
                k.innerHTML = '<option value="">Chọn khóa học</option>' + ds.map(function (x) {
                    return '<option value="' + esc(x.ID) + '">' + esc(e(x.TENKHOA)) + '</option>';
                }).join('');
            }).catch(function (err) { ums.api.handle(err, 'KHCT_KhoaDaoTao/LayDanhSach'); });
        });
    }

    /* ---------- Danh sách kế hoạch ---------------------------------------- */
    function nutCT(kind) {
        return function (r) { return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-ct': kind, 'data-id': r.ID } }); };
    }
    var crud = ums.crud({
        root: elDs,
        title: 'Kế hoạch ngành 2',
        listTitle: 'Danh sách kế hoạch',
        formTitle: 'kế hoạch',
        icon: 'fa-building',
        formCols: 12,
        rowDelete: false, formDelete: false,
        filters: [
            { key: 'pl', type: 'select', label: 'Chọn phân loại', source: PHANLOAI },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return { action: C + 'LayDSKeHoach', method: 'GET', strTuKhoa: f.q, strNguoiThucHien_Id: uid(), strPhanLoai_Id: f.pl };
            }
        },
        columns: [
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH', width: '220px' },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN' },
            { title: 'Mô hình đăng ký', prop: 'MOHINHDANGKY_TEN' },
            { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) { return esc(e(r.TUNGAY) + ' --> ' + e(r.DENNGAY)); } },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.HIEULUC ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute'); } },
            { title: 'Ngành mở đăng ký', cls: 'is-center', render: nutCT('nganh') },
            { title: 'Kết quả đăng ký', cls: 'is-center', render: nutCT('sv') },
            { title: 'Giới hạn', cls: 'is-center', render: nutCT('gh') }
        ],
        fields: [
            { type: 'legend', label: 'Thông tin kế hoạch' },
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', cols: 8 },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', required: true, value: '1', cols: 4,
              source: { items: [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] } },
            { key: 'strMoHinhDangKy_Id', col: 'MOHINHDANGKY_ID', label: 'Mô hình', type: 'select', cols: 6,
              source: { dm: 'QLSV.DANGKY.NGANH2.MOHINH' } },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', placeholder: 'Chọn phân loại', cols: 6, source: PHANLOAI },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date', cols: 6 },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date', cols: 6 },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', cols: 6 }
        ],
        onForm: function (row, c, extra) {
            // Thêm mới: Phân loại lấy theo ô lọc (rewrite của gốc)
            if (!row) {
                var pl = c.root.querySelector('[data-scope="form"][data-k="strPhanLoai_Id"]');
                if (pl) { pl.value = c.filterValues().pl || ''; if (window.jQuery) jQuery(pl).trigger('change.select2'); }
            }
            dungPhamVi(extra, row);
        },
        save: function (v, row) {
            return {
                action: C + (row ? 'Sua_DangKy_Nganh_Tiep' : 'Them_DangKy_Nganh_Tiep'), method: 'POST',
                strId: row ? row.ID : '',
                strPhanLoai_Id: v.strPhanLoai_Id,
                strTenKeHoach: v.strTenKeHoach,
                strMoTa: v.strMoTa,
                strTuNgay: v.strTuNgay,
                strDenNgay: v.strDenNgay,
                dHieuLuc: v.dHieuLuc,
                strMoHinhDangKy_Id: v.strMoHinhDangKy_Id,
                strNguoiThucHien_Id: uid()
            };
        },
        onSaved: function (c, result, isEdit) {
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (pv) pv.save(id);
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_DangKy_Nganh_Tiep', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; });
        }
    });

    /* Báo cáo trong hàng lọc + khung "Chọn trạng thái sinh viên" ngay dưới (như gốc) */
    var loc = elDs.querySelector('.ums-filter');
    if (loc) {
        var bc = document.createElement('div');
        bc.className = 'ums-field ums-field--fit';
        loc.appendChild(bc);
        ums.report.mount(bc, {
            import: false,
            collect: function (add) {
                add('strTuKhoa', '');
                add('strDaoTao_ThoiGianDaoTao_Id', '');
                add('strHB_QuyHocBong_Id', '');
                add('strQLSV_TrangThaiNguoiHoc_Id', tt ? tt.val() : '');
                var chon = crud.pickedRows();
                chon.forEach(function (r) { add('strHocBong_Id', r.ID); });
                chon.forEach(function (r) { add('strQLSV_DANGKY_NGANH_TIEP_ID', r.ID); });
            }
        });
        var khungLoc = loc.closest('.ums-panel');
        var ttp = document.createElement('div');
        ttp.innerHTML = pat.panel({ title: 'Chọn trạng thái sinh viên', icon: 'fa-user-check', zone: 'tt', cls: 'ums-u-mb-4' });
        khungLoc.parentNode.insertBefore(ttp.firstChild, khungLoc.nextSibling);
        tt = pat.checks(elDs.querySelector('[data-z="tt"]'), ums.api.dm('QLSV.TRANGTHAI'), { all: 'Tất cả', checked: true, cols: 3 });
    }

    /* ---------- Vùng chi tiết (thay chỗ danh sách) ------------------------ */
    var CT = { row: null, kind: '', ds: [] };
    function dongCT() {
        ui.swap(elCt, elDs, { top: true });
        crud.load();          // toggle_form của gốc nạp lại danh sách
    }
    function moCT(kind, row) {
        CT.row = row; CT.kind = kind; CT.ds = [];
        var ten = e(row.TENKEHOACH);
        var h;
        if (kind === 'nganh') {
            h = pat.page('Ngành mở đăng ký — ' + ten, ui.btn('close', { attr: { 'data-a': 'dong' } })) +
                pat.panel({ title: 'Ngành mở đăng ký', icon: 'fa-graduation-cap', flush: true, zone: 'bang',
                    tools: ui.xoaChon('input[data-ck2]', { goc: '.ums-panel', sm: true, attr: { 'data-a': 'ng-xoa' } }) +
                        ui.btn('save', { text: 'Cập nhật điều kiện', mod: 'out-primary', attr: { 'data-a': 'ng-dk' } }) +
                        ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'ng-them' } }) });
        } else if (kind === 'sv') {
            h = pat.page('Danh sách đã đăng ký — ' + ten, ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    '<button type="button" class="ums-btn ums-btn--save" disabled title="Bản gốc chưa có xử lý"><i class="fa-light fa-floppy-disk"></i><span>Lưu</span></button>') +
                pat.panel({ title: 'Danh sách người học', icon: 'fa-users', flush: true, zone: 'bang',
                    tools: ui.btn('confirm', { text: 'Duyệt', attr: { 'data-a': 'sv-duyet' } }) });
        } else {
            h = pat.page('Giới hạn — ' + ten, ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                    '<button type="button" class="ums-btn ums-btn--save" disabled title="Bản gốc chưa có xử lý"><i class="fa-light fa-floppy-disk"></i><span>Lưu</span></button>') +
                pat.panel({ title: 'Danh sách người học', icon: 'fa-ban', flush: true, zone: 'bang',
                    tools: ui.xoaChon('input[data-ck2]', { goc: '.ums-panel', sm: true, attr: { 'data-a': 'gh-xoa' } }) +
                        ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'gh-them' } }) });
        }
        elCt.innerHTML = h;
        ui.swap(elDs, elCt, { top: true });
        napCT();
    }
    function bangCT() { return elCt.querySelector('[data-z="bang"]'); }
    function oChon(r) { return '<input type="checkbox" data-ck2 value="' + esc(r.ID) + '">'; }
    var OCHON_ALL = '<input type="checkbox" data-ck2all title="Chọn tất cả">';
    function chonIds() { return qa(elCt, 'input[data-ck2]:checked').map(function (x) { return x.value; }); }

    function napCT() {
        var host = bangCT(), kh = CT.row.ID, kind = CT.kind;
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        var call = kind === 'nganh'
            ? { action: C + 'LayDSDK_Nganh_Tiep_PV_MoNganh', method: 'GET', strQLSV_DangKy_Nganh_Tiep_Id: kh, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 1000000 }
            : kind === 'sv'
            ? { action: C + 'LayDSDK_Nganh_Tiep_KetQua', method: 'GET', strQLSV_DangKy_Nganh_Tiep_Id: kh, strQLSV_NguoiHoc_Id: '', strDaoTao_ChuongTrinh_Id: '', strNguoiThucHien_Id: uid() }
            : { action: 'DKH_Nganh2_MH/DSA4BRIQDRIXHgUgLyYKOB4PJiAvKR4GKC4oCSAv', func: 'pkg_dangkyhoc_nganh2.LayDSQLSV_DangKy_Nganh_GioiHan',
                strQLSV_DangKy_Nganh_Tiep_Id: kh, strNguoiThucHien_Id: uid() };
        ums.api.call(call).then(function (r) {
            if (CT.row.ID !== kh || CT.kind !== kind) return;
            CT.ds = arr(r.data);
            var cols;
            if (kind === 'nganh') {
                cols = [
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
                    { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Điều kiện xét', width: '220px', render: function (x) {
                        return '<input class="ums-input ums-input--sm" data-dk="' + esc(x.ID) + '" data-cu="' + esc(e(x.XAUDIEUKIEN)) + '" value="' + esc(e(x.XAUDIEUKIEN)) + '">';
                    } },
                    { title: 'Mô tả', prop: 'MOTA' }
                ];
            } else if (kind === 'sv') {
                cols = [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', group: ['Thông tin cá nhân'], cls: 'is-nowrap' },
                    { title: 'Họ tên', group: ['Thông tin cá nhân'], render: function (x) { return esc(e(x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ngành đang học', prop: 'DAOTAO_CHUONGTRINH_TEN', group: ['Thông tin cá nhân'] },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_DANGKY_TEN', group: ['Kết quả đăng ký'] },
                    { title: 'Ngành', prop: 'DAOTAO_CHUONGTRINH_DANGKY_TEN', group: ['Kết quả đăng ký'] },
                    { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_DANGKY_TEN', group: ['Kết quả đăng ký'] },
                    { title: 'Số tiền phải nộp', group: ['Kết quả đăng ký'], cls: 'is-right is-nowrap', render: function (x) { return x.SOTIENPHAINOP == null ? '' : ui.money(x.SOTIENPHAINOP); } },
                    { title: 'Số tiền đã nộp', group: ['Kết quả đăng ký'], cls: 'is-right is-nowrap', render: function (x) { return x.SOTIENDANOP == null ? '' : ui.money(x.SOTIENDANOP); } },
                    { title: 'Tình trạng duyệt', prop: 'TINHTRANGDUYET', cls: 'is-center' }
                ];
            } else {
                cols = [
                    { title: 'Lớp quản lý', prop: 'DAOTAO_LOPQUANLY_GIOIHAN_TEN' },
                    { title: 'Chương trình', render: function (x) { return esc(e(x.DAOTAO_CHUONGTRINH_DANGKY_TEN) + ' - ' + e(x.MANGANH)); } }
                ];
            }
            cols.push({ head: OCHON_ALL, cls: 'is-center', width: '44px', render: oChon });
            ui.table({ el: host, rows: CT.ds, columns: cols, empty: 'Không có dữ liệu' });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, call.func || call.action); });
    }

    /* --- Ngành mở đăng ký --- */
    function themNganh() {
        var kh = CT.row.ID;
        ums.dkhChon.lop({
            extraHtml: '<div class="ums-u-mt-4">' + ui.field('Xâu điều kiện', '<input class="ums-input" data-f="dk" placeholder="Nhập xâu điều kiện" autocomplete="off">') + '</div>',
            onPick: function (rows, dlg) {
                var dk = (dlg.body.querySelector('[data-f="dk"]').value || '').trim();
                ui.batch(rows.map(function (r) {
                    return { action: C + 'Them_DK_Nganh_Tiep_PV_MoNganh', method: 'POST', strId: '', strQLSV_DangKy_Nganh_Tiep_Id: kh,
                        strDaoTao_HeDaoTao_Id: e(r.DAOTAO_HEDAOTAO_ID), strDaoTao_KhoaDaoTao_Id: e(r.DAOTAO_KHOADAOTAO_ID),
                        strDaoTao_ChuongTrinh_Id: e(r.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_LopQuanLy_Id: r.ID,
                        strTaiChinh_CacKhoanThu_Id: '', strXauDieuKien: dk, strMoTa: '', dSoTien: '', strNguoiThucHien_Id: uid() };
                }), { title: 'Đang thêm ngành mở đăng ký', okText: 'Thêm mới thành công' }).then(napCT);
            }
        });
    }
    function capNhatDieuKien() {
        var doi = qa(elCt, 'input[data-dk]').filter(function (x) { return x.value !== x.getAttribute('data-cu'); });
        if (!doi.length) { ui.toast('Không có dữ liệu cần cập nhật', 'warn'); return; }
        var kh = CT.row.ID;
        ui.batch(doi.map(function (x) {
            return { action: C + 'Sua_DK_Nganh_Tiep_PV_MoNganh', method: 'POST', strId: x.getAttribute('data-dk'), strQLSV_DangKy_Nganh_Tiep_Id: kh,
                strDaoTao_HeDaoTao_Id: '', strDaoTao_KhoaDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '', strDaoTao_LopQuanLy_Id: '',
                strTaiChinh_CacKhoanThu_Id: '', strXauDieuKien: x.value, strMoTa: '', dSoTien: '', strNguoiThucHien_Id: uid() };
        }), { title: 'Đang cập nhật điều kiện', okText: 'Cập nhật thành công' }).then(napCT);
    }
    function xoaChon(action, func) {
        var ids = chonIds();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            ui.batch(ids.map(function (id) {
                var c = { action: action, method: 'POST', strId: id, strNguoiThucHien_Id: uid() };
                if (func) c.func = func;
                return c;
            }), { title: 'Đang xoá', okText: 'Xóa thành công' }).then(napCT);
        });
    }

    /* --- Kết quả đăng ký: Duyệt --- */
    function duyet() {
        var ids = chonIds();
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var dlg = ui.dialog({
            title: 'Xác nhận', icon: 'fa-circle-check', size: 'md',
            body:
                ui.field('Nội dung xác nhận', '<input class="ums-input" data-f="nd" autocomplete="off">') +
                '<div class="ums-legend ums-legend--cach">Chọn xác nhận</div><div class="ums-row" data-f="nut">' +
                    '<span class="ums-u-faint ums-u-fz13">Đang tải…</span></div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử xác nhận</div><div data-f="ls"></div>'
        });
        var B = dlg.body;
        ui.table({ el: B.querySelector('[data-f="ls"]'), rows: [], empty: 'Chưa có lịch sử xác nhận',
            columns: [{ title: 'Xác nhận' }, { title: 'Người xác nhận' }, { title: 'Ngày', cls: 'is-center' }] });
        ums.api.dm('QLSV.DANGKY.NGANH.TIEP.DUYET').then(function (ds) {
            B.querySelector('[data-f="nut"]').innerHTML = ds.length ? ds.map(function (x) {
                var ic = ums.iconFA4 ? ums.iconFA4(e(x.THONGTIN1) || 'fa fa-paper-plane') : 'fa-light fa-paper-plane';
                return '<button type="button" class="ums-btn ums-btn--out-primary" data-xn="' + esc(x.ID) + '">' +
                    '<i class="' + esc(ic) + '"' + (x.THONGTIN2 ? ' style="' + esc(x.THONGTIN2) + '"' : '') + '></i><span>' + esc(e(x.TEN)) + '</span></button>';
            }).join('') : '<span class="ums-u-faint ums-u-fz13">Chưa khai danh mục QLSV.DANGKY.NGANH.TIEP.DUYET</span>';
        }).catch(function (err) { ums.api.handle(err, 'danh mục duyệt'); });
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-xn]');
            if (!b) return;
            var tinhTrang = b.getAttribute('data-xn');
            var nd = (B.querySelector('[data-f="nd"]').value || '').trim();
            dlg.close();
            ui.batch(ids.map(function (id) {
                var x = CT.ds.filter(function (r) { return String(r.ID) === id; })[0] || {};
                return { action: C + 'Them_DK_Nganh_Tiep_Duyet', method: 'POST',
                    strSanPham_Id: '' + x.QLSV_DANGKY_NGANH_TIEP_ID + x.QLSV_NGUOIHOC_ID + x.DAOTAO_CHUONGTRINH_ID + x.DAOTAO_CHUONGTRINH_DANGKY_ID,
                    strNguoiXacnhan_Id: uid(), strNoiDung: nd, strTinhTrang_Id: tinhTrang };
            }), { title: 'Đang xác nhận', okText: 'Xác nhận thành công' }).then(napCT);
        });
    }

    /* --- Giới hạn: hộp Thêm --- */
    function themGioiHan() {
        var kh = CT.row.ID, dsCT = [];
        var dlg = ui.dialog({
            title: 'Giới hạn', icon: 'fa-pen', size: 'lg',
            body: '<div class="ums-grid ums-grid--2">' +
                    ui.field('Lớp', '<select class="ums-select" data-f="lop" data-ph="Chọn lớp"><option value="">Chọn lớp</option></select>') +
                '</div>' +
                '<div class="ums-legend ums-legend--cach">Chương trình giới hạn</div><div data-f="ct">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (d) {
                var ids = qa(d.body, 'input[data-ghct]:checked').map(function (x) { return x.value; });
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                var lop = d.body.querySelector('[data-f="lop"]').value;
                ui.batch(ids.map(function (id) {
                    return { action: 'DKH_Nganh2_MH/FSkkLB4QDRIXHgUgLyYKOB4PJiAvKR4GKC4oCSAv', func: 'pkg_dangkyhoc_nganh2.Them_QLSV_DangKy_Nganh_GioiHan',
                        strQLSV_DangKy_Nganh_Tiep_Id: kh, strDaoTao_LopQL_GioiHan_Id: lop, strDaoTao_CT_DangKy_Id: id, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang lưu giới hạn', okText: 'Thêm mới thành công' }).then(napCT);
            } }]
        });
        var B = dlg.body;
        ui.enhance(B);
        ums.api.call({ action: 'DKH_Nganh2_MH/DSA4BRINLjEQNCAvDTgFJAYoLigJIC8P', func: 'pkg_dangkyhoc_nganh2.LayDSLopQuanLyDeGioiHan',
            strQLSV_DangKy_Nganh_Tiep_Id: kh, strNguoiThucHien_Id: uid() })
            .then(function (r) { pat.fill(B.querySelector('[data-f="lop"]'), arr(r.data), { name: 'TEN', head: 'Chọn lớp' }); })
            .catch(function (err) { ums.api.handle(err, 'LayDSLopQuanLyDeGioiHan'); });
        ums.api.call({ action: 'DKH_Nganh2_MH/DSA4BRICKTQuLyYVMygvKQUkBiguKAkgLwPP', func: 'pkg_dangkyhoc_nganh2.LayDSChuongTrinhDeGioiHan',
            strQLSV_DangKy_Nganh_Tiep_Id: kh, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                dsCT = arr(r.data);
                ui.table({ el: B.querySelector('[data-f="ct"]'), rows: dsCT, empty: 'Không có chương trình',
                    columns: [
                        { title: 'Mã chương trình', render: function (x) { return esc(e(x.MACHUONGTRINH) + ' - ' + e(x.MANGANH)); } },
                        { title: 'Tên chương trình', render: function (x) { return esc(e(x.TENCHUONGTRINH) + ' - ' + e(x.TENNGANH)); } },
                        { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                        { head: '<input type="checkbox" data-ghall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (x) { return '<input type="checkbox" data-ghct value="' + esc(x.ID) + '">'; } }
                    ] });
            }).catch(function (err) { B.querySelector('[data-f="ct"]').innerHTML = ui.fail(err.message); ums.api.handle(err, 'LayDSChuongTrinhDeGioiHan'); });
        B.addEventListener('change', function (ev) {
            if (ev.target.matches && ev.target.matches('input[data-ghall]')) {
                qa(B, 'input[data-ghct]').forEach(function (x) { x.checked = ev.target.checked; });
            }
        });
    }

    /* ---------- Sự kiện ---------------------------------------------------- */
    elDs.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ct]');
        if (!b || !elDs.contains(b)) return;
        var row = crud.rows.filter(function (r) { return String(r.ID) === b.getAttribute('data-id'); })[0];
        if (row) moCT(b.getAttribute('data-ct'), row);
    });
    elCt.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !elCt.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') dongCT();
        else if (a === 'ng-them') themNganh();
        else if (a === 'ng-dk') capNhatDieuKien();
        else if (a === 'ng-xoa') xoaChon(C + 'Xoa_DK_Nganh_Tiep_PV_MoNganh');
        else if (a === 'sv-duyet') duyet();
        else if (a === 'gh-them') themGioiHan();
        else if (a === 'gh-xoa') xoaChon('DKH_Nganh2_MH/GS4gHhANEhceBSAvJgo4Hg8mIC8pHgYoLigJIC8P', 'pkg_dangkyhoc_nganh2.Xoa_QLSV_DangKy_Nganh_GioiHan');
    });
    elCt.addEventListener('change', function (ev) {
        if (ev.target.matches && ev.target.matches('input[data-ck2all]')) {
            qa(elCt, 'input[data-ck2]').forEach(function (x) { x.checked = ev.target.checked; });
        }
    });
})();
