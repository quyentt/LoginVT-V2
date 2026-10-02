/* =========================================================================
   Kế hoạch nguyện vọng đăng ký
   Bản gốc: ApisDangKyHoc/Modules/nguyenvongdangky/html/kehoachdangky.html + script/kehoachdangky.js
   ---------------------------------------------------------------------------
   Một cột như gốc (ums.crud): thanh lọc Thời gian + từ khoá, bảng kế hoạch (tiêu đề hai tầng Thời gian
   bắt đầu / kết thúc / Tình hình đăng ký), biểu mẫu thay chỗ danh sách. Dưới biểu mẫu, hai cột như gốc:
   Kiểu đăng ký | Chế độ đăng ký · Trạng thái sinh viên | Kiểu học · Phạm vi học phần | Quy mô lớp.
   Lời gọi — chép nguyên văn (kiểu cũ, không mã hoá, trừ chỗ ghi iM):
       DKH_KeHoachDangKyNV/LayDanhSach   GET  strTuKhoa, strDaoTao_ThoiGianDaoTao_Id, strNguoiThucHien_Id, pageIndex, pageSize
           (MAKEHOACH, TENKEHOACH, NGAYBATDAU, GIODANGKYTRONGNGAYDAU, PHUTDANGKYTRONGNGAYDAU, NGAYKETTHUC,
            GIOKETTHUCTRONGNGAYCUOI, PHUTKETTHUCTRONGNGAYCUOI, SOLUONGDUKIEN, SOLUONGDADANGKY, TYLE, HIEULUC,
            KIEUHOC_TEN; sửa đọc thêm SOTINCHITOIDA, DAOTAO_THOIGIANDAOTAO_ID, KIEUHOC_IDS, TRANGTHAI_ID,
            TRANGTHAISINHVIEN_IDS — biểu mẫu sửa lấy từ dòng danh sách, không gọi chi tiết, như gốc)
       DKH_KeHoachDangKyNV/ThemMoi | CapNhat   POST  strId, strTenKeHoach, strMaKeHoach, strKieuHoc_Ids (ID các ô
           Kiểu đăng ký), strDaoTao_ThoiGianDaoTao_Id, strNgayBatDau, strNgayKetThuc, strTrangThaiSinhVien_Ids,
           dHieuLuc, dSoTinChiToiDa, strTrangThai_Id (ID ô Chế độ), dGio…/dPhut… (4 ô), strNguoiThucHien_Id
       Kiểu học (lưu SAU kế hoạch, dòng chưa chọn kiểu học thì bỏ qua):
           DKH_GioiHan_KieuHoc/LayDanhSach GET (strTuKhoa "", strDangKy_KeHoachDangKy_Id, strKieuHoc_Id "",
               strDiemQuyDoi_Id "", pageIndex 1, pageSize 20000) · ThemMoi | CapNhat (strId, strKeHoachNguyenVong_Id,
               strKieuHoc_Id, strDiemQuyDoi_Id) · Xoa (strIds)
           Ô Kiểu học: DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach (strKeHoachNguyenVong_Id); ô Điểm: danh mục DIEM.DIEMCHU
       Phạm vi học phần (ghi NGAY, không chờ Lưu — như gốc):
           DKH_NguyenVong/LayDSDangKy_NV_PC_HocPhan GET · Them_DangKy_NV_PC_HocPhan (strDangKy_KeHoachDangKy_Id,
           strDaoTao_HocPhan_Id, strPhamViApDung_Id "") · Xoa_DangKy_NV_PC_HocPhan (strId, mỗi dòng một lời gọi)
           Hộp chọn: ums.dkhChon.hocPhan (edu.extend.genModal_HocPhan) — _nvchon.js
       Quy mô lớp (lưu SAU kế hoạch, iM truyền tường minh như gốc):
           DKH_NguyenVong/LayDSQuyMoLopDangKy POST (strDangKy_NguyenVong_Id, strQLSV_NguoiHoc_Id "", strDaoTao_HocPhan_Id "")
           · Them_DK_NguyenVong_QuyMoLop (strId, strDangKy_KeHoach_Id, strQuyMoLop_Id, strMoTa "")
           · Xoa_DK_NguyenVong_QuyMoLop (strDangKy_KeHoach_Id, strId). Ô: danh mục DANGKY.NGUYENVONG.QUYMO
       Danh mục: KHDT.DIEM.KIEUHOC (Kiểu đăng ký), DANGKY.CHEDO (Chế độ), QLSV.TRANGTHAI (Trạng thái SV).
       Thời gian: edu.system.getList_ThoiGianDaoTao → pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao.
   Cố ý bỏ / khác bản gốc:
     · Nút "Xóa" kế hoạch: gốc đặt display:none và KHÔNG chỗ nào hiện lại → chưa từng dùng được. Không dựng
       (ghi can-quyet: có mở chức năng xoá không; lời gọi gốc DKH_KeHoachDangKyNV/Xoa strIds).
     · Nút con mắt cạnh "Số đã đăng ký" (btnDetail): gốc không có xử lý → giữ, khoá.
     · Thêm mới: gốc nạp ô Kiểu học theo id kế hoạch VỪA SỬA trước đó (gọi trước rewrite) → bản mới gửi rỗng.
     · Phạm vi học phần khi kế hoạch CHƯA LƯU: gốc vẫn gửi Them_… với strDangKy_KeHoachDangKy_Id rỗng → bản mới
       chặn, nhắc lưu kế hoạch trước.
     · Xoá một dòng Quy mô đã lưu: gốc vẽ lại bảng KIỂU HỌC bằng dữ liệu trả về (nhầm hàm) → bản mới chỉ bỏ dòng đó.
     · Kiểu học / Quy mô: gốc xoá theo ô đánh dấu + nút "Xóa" dưới bảng → lưới dòng chuẩn (ums.pat.rows), nút xoá
       trên từng dòng (dòng chưa lưu bỏ ngay, dòng đã lưu hỏi lại rồi gọi Xoa).
     · Ô Quy mô của dòng đã lưu: gốc chọn sẵn theo ID DÒNG (aData.ID) nên luôn trống → bản mới đọc QUYMOLOP_ID
       (tên cột ĐOÁN, không có thì lùi về ID như gốc) — kiểm trên host.
     · Bỏ mã chết: arrValid dropKhenThuong, tblTangThem, dropThoiGian_Nam/Ky, getList_DMHocPhan, genHTML_HocPhan, hàng
       loạt resetValById cho ô không có trên màn.
   Ô cha → con: không có (Thời gian lọc danh sách; các ô trong biểu mẫu không phụ thuộc nhau).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('nvdk-kehoach');
    if (!root) return;
    function e(v) { return v === undefined || v === null ? '' : v; }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function iM() { return (ums.session && ums.session.iM) || undefined; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function ids(s) { return String(e(s)).split(',').filter(Boolean); }

    var THOIGIAN = { call: {
        action: 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eFSkuKAYoIC8FIC4VIC4P', func: 'pkg_kehoach_thongtin.LayDSDaoTao_ThoiGianDaoTao',
        strDAOTAO_Nam_Id: '', strNguoiThucHien_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000
    }, name: 'DAOTAO_THOIGIANDAOTAO' };

    /* Khối trong biểu mẫu — dựng lại mỗi lần mở */
    var W = { kdk: null, ttsv: null, cheDo: null, kieuHoc: null, quyMo: null, keHoachId: '', token: 0 };

    function panel(title, icon, zone, tools) {
        return pat.panel({ title: title, icon: icon, zone: zone, tools: tools });
    }

    function veCheDo(host, rows, chon) {
        host.innerHTML = '<div class="ums-checklist">' + rows.map(function (r) {
            return '<label class="ums-check"><input type="radio" name="nvdk-chedo" value="' + esc(r.ID) + '"' +
                (String(r.ID) === String(e(chon)) ? ' checked' : '') + '> ' + esc(r.TEN) + '</label>';
        }).join('') + '</div>' + (rows.length ? '' : '<span class="ums-u-faint ums-u-fz13">Không có dữ liệu</span>');
        return {
            val: function () { var x = host.querySelector('input[name="nvdk-chedo"]:checked'); return x ? x.value : ''; }
        };
    }

    /* ---------- Phạm vi học phần ------------------------------------------ */
    function napHocPhan() {
        var host = root.querySelector('[data-z="hp"]');
        if (!host) return;
        if (!W.keHoachId) { host.innerHTML = ui.empty('Lưu kế hoạch trước, rồi thêm học phần vào phạm vi', 'fa-circle-info'); return; }
        host.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'DKH_NguyenVong/LayDSDangKy_NV_PC_HocPhan', method: 'GET',
            strDangKy_KeHoachDangKy_Id: W.keHoachId, strPhamViApDung_Id: '', strNguoiThucHien_Id: uid() })
            .then(function (r) {
                ui.table({
                    el: host, rows: arr(r.data), empty: 'Chưa có học phần',
                    columns: [
                        { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' },
                        { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                        { head: '<input type="checkbox" data-hpall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                          render: function (x) { return '<input type="checkbox" data-hpck value="' + esc(x.ID) + '">'; } }
                    ]
                });
            }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'phạm vi học phần'); });
    }
    function themHocPhan() {
        if (!W.keHoachId) { ui.toast('Lưu kế hoạch trước, rồi thêm học phần vào phạm vi', 'warn'); return; }
        var kh = W.keHoachId;
        ums.dkhChon.hocPhan({ onPick: function (rows) {
            ui.batch(rows.map(function (r) {
                return { action: 'DKH_NguyenVong/Them_DangKy_NV_PC_HocPhan', method: 'POST',
                    strDangKy_KeHoachDangKy_Id: kh, strDaoTao_HocPhan_Id: r.ID, strPhamViApDung_Id: '', strNguoiThucHien_Id: uid() };
            }), { title: 'Đang thêm học phần', okText: 'Thực hiện thành công' }).then(napHocPhan);
        } });
    }
    function xoaHocPhan() {
        var chon = Array.prototype.slice.call(root.querySelectorAll('[data-z="hp"] input[data-hpck]:checked')).map(function (x) { return x.value; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá', title: 'Xoá học phần khỏi phạm vi' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (id) {
                return { action: 'DKH_NguyenVong/Xoa_DangKy_NV_PC_HocPhan', method: 'POST', strId: id, strNguoiThucHien_Id: uid() };
            }), { title: 'Đang xoá', okText: 'Xóa thành công' }).then(napHocPhan);
        });
    }

    /* ---------- Dựng khối phụ của biểu mẫu -------------------------------- */
    function dungKhoi(row, extra) {
        var t = ++W.token;
        W.keHoachId = row ? row.ID : '';
        extra.innerHTML = '<div class="ums-grid ums-grid--2">' +
            panel('Kiểu đăng ký', 'fa-list-check', 'kdk') +
            panel('Chế độ đăng ký', 'fa-toggle-on', 'cddk') +
            panel('Trạng thái sinh viên', 'fa-user-check', 'ttsv') +
            '<div data-z="kieuhoc"></div>' +
            pat.panel({ title: 'Phạm vi học phần', icon: 'fa-book', flush: true, zone: 'hp',
                tools: ui.xoaChon('input[data-hpck]', { goc: '.ums-panel', sm: true, attr: { 'data-a': 'hp-xoa' } }) +
                    ui.btn('add', { text: 'Thêm mới', mod: 'out-success', attr: { 'data-a': 'hp-them' } }) }) +
            '<div data-z="quymo"></div>' +
            '</div>';
        function z(k) { return extra.querySelector('[data-z="' + k + '"]'); }
        z('kdk').innerHTML = z('cddk').innerHTML = z('ttsv').innerHTML = '<span class="ums-u-faint ums-u-fz13">Đang tải…</span>';

        ums.api.dm('KHDT.DIEM.KIEUHOC').then(function (rows) {
            if (t !== W.token) return;
            W.kdk = pat.checks(z('kdk'), rows, { all: false, checked: false, cols: 1 });
            if (row) W.kdk.set(ids(row.KIEUHOC_IDS));
        }).catch(function (err) { ums.api.handle(err, 'Kiểu đăng ký'); });
        ums.api.dm('DANGKY.CHEDO').then(function (rows) {
            if (t !== W.token) return;
            W.cheDo = veCheDo(z('cddk'), rows, row ? row.TRANGTHAI_ID : '');
        }).catch(function (err) { ums.api.handle(err, 'Chế độ đăng ký'); });
        ums.api.dm('QLSV.TRANGTHAI').then(function (rows) {
            if (t !== W.token) return;
            W.ttsv = pat.checks(z('ttsv'), rows, { all: 'Tất cả', checked: false, cols: 3 });
            if (row) W.ttsv.set(ids(row.TRANGTHAISINHVIEN_IDS));
        }).catch(function (err) { ums.api.handle(err, 'Trạng thái sinh viên'); });

        var kh = W.keHoachId;
        W.kieuHoc = pat.rows(z('kieuhoc'), {
            title: 'Kiểu học', icon: 'fa-graduation-cap', minRows: 1,
            columns: [
                { key: 'strKieuHoc_Id', col: 'KIEUHOC_ID', title: 'Kiểu học', type: 'select', placeholder: 'Chọn kiểu học',
                  source: { load: function () {
                      return ums.api.call({ action: 'DKH_KeHoachDangKyNV/LayDSKieuHocTheoKeHoach', method: 'GET', silent: true,
                          strKeHoachNguyenVong_Id: kh, strNguoiThucHien_Id: uid() }).then(function (r) { return arr(r.data); });
                  } } },
                { key: 'strDiemQuyDoi_Id', col: 'DIEMQUYDOI_ID', title: 'Điểm quy đổi', type: 'select', placeholder: 'Chọn điểm',
                  source: { dm: 'DIEM.DIEMCHU' } }
            ],
            list: function (id) {
                return { action: 'DKH_GioiHan_KieuHoc/LayDanhSach', method: 'GET', strTuKhoa: '', strDangKy_KeHoachDangKy_Id: id,
                    strKieuHoc_Id: '', strDiemQuyDoi_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 20000 };
            },
            filled: function (v) { return !!v.strKieuHoc_Id; },
            save: function (v, rec, id) {
                return { action: rec ? 'DKH_GioiHan_KieuHoc/CapNhat' : 'DKH_GioiHan_KieuHoc/ThemMoi', method: 'POST',
                    strId: rec ? rec.ID : '', strKeHoachNguyenVong_Id: id, strKieuHoc_Id: v.strKieuHoc_Id,
                    strDiemQuyDoi_Id: v.strDiemQuyDoi_Id, strNguoiThucHien_Id: uid() };
            },
            remove: function (rec) { return { action: 'DKH_GioiHan_KieuHoc/Xoa', method: 'POST', strIds: rec.ID, strNguoiThucHien_Id: uid() }; }
        });
        W.kieuHoc.load(kh);

        W.quyMo = pat.rows(z('quymo'), {
            title: 'Quy mô lớp', icon: 'fa-people-group',
            columns: [
                { key: 'strQuyMoLop_Id', title: 'Quy mô áp dụng', type: 'select', placeholder: 'Chọn quy mô',
                  get: function (rec) { return rec.QUYMOLOP_ID !== undefined && rec.QUYMOLOP_ID !== null ? rec.QUYMOLOP_ID : rec.ID; },
                  source: { dm: 'DANGKY.NGUYENVONG.QUYMO' } }
            ],
            list: function (id) {
                return { action: 'DKH_NguyenVong/LayDSQuyMoLopDangKy', method: 'POST', strDangKy_NguyenVong_Id: id,
                    strQLSV_NguoiHoc_Id: '', strDaoTao_HocPhan_Id: '', iM: iM() };
            },
            filled: function (v) { return !!v.strQuyMoLop_Id; },
            save: function (v, rec, id) {
                return { action: 'DKH_NguyenVong/Them_DK_NguyenVong_QuyMoLop', method: 'POST', strId: rec ? rec.ID : '',
                    strDangKy_KeHoach_Id: id, strQuyMoLop_Id: v.strQuyMoLop_Id, strMoTa: '', strNguoiThucHien_Id: uid(), iM: iM() };
            },
            remove: function (rec) {
                return { action: 'DKH_NguyenVong/Xoa_DK_NguyenVong_QuyMoLop', method: 'POST',
                    strDangKy_KeHoach_Id: W.keHoachId, strId: rec.ID, strNguoiThucHien_Id: uid() };
            }
        });
        W.quyMo.load(kh);
        napHocPhan();
    }

    function soDaDangKy(r) {
        return esc(e(r.SOLUONGDADANGKY)) + ' ' +
            '<button type="button" class="ums-iconbtn" disabled title="Chi tiết — bản gốc chưa có xử lý"><i class="fa-light fa-eye"></i></button>';
    }
    function hieuLuc(r) {
        var v = String(e(r.HIEULUC));
        return v === '1' ? ui.badge('Hiệu lực', 'ok') : v === '0' ? ui.badge('Không hiệu lực', 'mute') : esc(v);
    }

    var crud = ums.crud({
        root: root,
        title: 'Kế hoạch nguyện vọng',
        listTitle: 'Danh sách kế hoạch đăng ký',
        formTitle: 'kế hoạch đăng ký',
        icon: 'fa-clipboard-list-check',
        formCols: 12,
        filters: [
            { key: 'tg', type: 'select', label: 'Chọn thời gian', source: THOIGIAN },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: 'DKH_KeHoachDangKyNV/LayDanhSach', method: 'GET', strTuKhoa: f.q,
                    strDaoTao_ThoiGianDaoTao_Id: f.tg, strNguoiThucHien_Id: uid() };
            }
        },
        columns: [
            { title: 'Mã kế hoạch', prop: 'MAKEHOACH', cls: 'is-center is-nowrap' },
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH', width: '260px' },
            { title: 'Ngày', prop: 'NGAYBATDAU', group: ['Thời gian bắt đầu'], cls: 'is-center is-nowrap' },
            { title: 'Giờ', prop: 'GIODANGKYTRONGNGAYDAU', group: ['Thời gian bắt đầu'], cls: 'is-center' },
            { title: 'Phút', prop: 'PHUTDANGKYTRONGNGAYDAU', group: ['Thời gian bắt đầu'], cls: 'is-center' },
            { title: 'Ngày', prop: 'NGAYKETTHUC', group: ['Thời gian kết thúc'], cls: 'is-center is-nowrap' },
            { title: 'Giờ', prop: 'GIOKETTHUCTRONGNGAYCUOI', group: ['Thời gian kết thúc'], cls: 'is-center' },
            { title: 'Phút', prop: 'PHUTKETTHUCTRONGNGAYCUOI', group: ['Thời gian kết thúc'], cls: 'is-center' },
            { title: 'Số lượng dự kiến', prop: 'SOLUONGDUKIEN', group: ['Tình hình đăng ký'], cls: 'is-center' },
            { title: 'Số đã đăng ký', group: ['Tình hình đăng ký'], cls: 'is-center is-nowrap', render: soDaDangKy },
            { title: 'Tỷ lệ', prop: 'TYLE', group: ['Tình hình đăng ký'], cls: 'is-center' },
            { title: 'Hiệu lực', cls: 'is-center', render: hieuLuc },
            { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-center' }
        ],
        fields: [
            { type: 'legend', label: 'Thông tin cơ bản' },
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', placeholder: 'Nhập tên kế hoạch', required: true, cols: 12 },
            { key: 'strMaKeHoach', col: 'MAKEHOACH', label: 'Mã kế hoạch', required: true, cols: 4 },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', required: true, value: '1', cols: 4,
              source: { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Không hiệu lực' }] } },
            { key: 'dSoTinChiToiDa', col: 'SOTINCHITOIDA', label: 'Số TC tối đa', type: 'number', cols: 4 },
            { type: 'legend', label: 'Thời gian đăng ký' },
            { key: 'strDaoTao_ThoiGianDaoTao_Id', col: 'DAOTAO_THOIGIANDAOTAO_ID', label: 'Chọn thời gian', type: 'select',
              placeholder: 'Chọn đợt', required: true, cols: 4, source: THOIGIAN },
            { type: 'note', label: '' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date', required: true, cols: 2 },
            { key: 'dGioDangKyTrongNgayDau', col: 'GIODANGKYTRONGNGAYDAU', label: 'Giờ', cols: 2 },
            { key: 'dPhutDangKyTrongNgayDau', col: 'PHUTDANGKYTRONGNGAYDAU', label: 'Phút', cols: 2 },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date', required: true, cols: 2 },
            { key: 'dGioKetThucTrongNgayCuoi', col: 'GIOKETTHUCTRONGNGAYCUOI', label: 'Giờ', cols: 2 },
            { key: 'dPhutKetThucTrongNgayCuoi', col: 'PHUTKETTHUCTRONGNGAYCUOI', label: 'Phút', cols: 2 }
        ],
        onForm: function (row, c, extra) { dungKhoi(row, extra); },
        save: function (v, row) {
            var kdk = W.kdk ? W.kdk.val() : '';
            var cheDo = W.cheDo ? W.cheDo.val() : '';
            if (!kdk) { ui.toast('Vui lòng chọn ít nhất một Kiểu đăng ký', 'warn'); return null; }
            if (!cheDo) { ui.toast('Vui lòng chọn Chế độ đăng ký', 'warn'); return null; }
            return {
                action: row ? 'DKH_KeHoachDangKyNV/CapNhat' : 'DKH_KeHoachDangKyNV/ThemMoi', method: 'POST',
                strId: row ? row.ID : '',
                strTenKeHoach: v.strTenKeHoach,
                strMaKeHoach: v.strMaKeHoach,
                strKieuHoc_Ids: kdk,
                strDaoTao_ThoiGianDaoTao_Id: v.strDaoTao_ThoiGianDaoTao_Id,
                strNgayBatDau: v.strNgayBatDau,
                strNgayKetThuc: v.strNgayKetThuc,
                strTrangThaiSinhVien_Ids: W.ttsv ? W.ttsv.val() : '',
                dHieuLuc: v.dHieuLuc,
                dSoTinChiToiDa: v.dSoTinChiToiDa,
                strTrangThai_Id: cheDo,
                dGioDangKyTrongNgayDau: v.dGioDangKyTrongNgayDau,
                dGioKetThucTrongNgayCuoi: v.dGioKetThucTrongNgayCuoi,
                dPhutDangKyTrongNgayDau: v.dPhutDangKyTrongNgayDau,
                dPhutKetThucTrongNgayCuoi: v.dPhutKetThucTrongNgayCuoi,
                strNguoiThucHien_Id: uid()
            };
        },
        onSaved: function (c, result, isEdit) {
            // Như gốc: lưu xong kế hoạch mới lưu từng dòng Kiểu học và Quy mô lớp, gắn vào id kế hoạch
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (W.kieuHoc) W.kieuHoc.save(id);
            if (W.quyMo) W.quyMo.save(id);
        }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'hp-them') themHocPhan();
        else if (a === 'hp-xoa') xoaHocPhan();
    });
    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (!t.matches || !t.matches('input[data-hpall]')) return;
        Array.prototype.forEach.call(root.querySelectorAll('[data-z="hp"] input[data-hpck]'), function (x) { x.checked = t.checked; });
    });
    void crud;
})();
