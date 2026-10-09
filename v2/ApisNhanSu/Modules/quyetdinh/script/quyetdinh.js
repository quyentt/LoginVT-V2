/* =========================================================================
   Quyết định — kê khai quyết định nhân sự + thành viên kèm theo
   Bản gốc: ApisNhanSu/Modules/quyetdinh/html/quyetdinh.html + script/quyetdinh.js
   (bản CHỈ XEM của Cổng cán bộ: _v2/ApisCongCanBo/Modules/hoso/script/quyetdinh.js)
   ---------------------------------------------------------------------------
   Hai cột như gốc (col-lg-3 | col-lg-9): trái "Danh sách quyết định" (từ khoá + loại
   quyết định), phải "Thông tin chung" đổi chỗ với biểu mẫu "Kê khai quyết định" —
   ums.crud({ master }). Khối "Thành viên tham gia" nằm dưới biểu mẫu (vùng extra).

   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_ThongTinQuyetDinh/LayDanhSach  GET  strNgayHieuLuc_Tu '', strNgayHieuLuc_Den '', strLoaiQuyetDinh_Id,
            strTuKhoa, iTrangThai 1, strThanhVien_Id '', pageIndex, pageSize
       NS_ThongTinQuyetDinh/ThemMoi  strId '', strNhanSu_HoSoCanBo_Id = id thành viên nối bằng "#",
            strSoQuyetDinh, strNgayQuyetDinh, strNguoiKyQuyetDinh, strNgayHieuLuc, strThongTinQuyetDinh,
            strThongTinDinhKem, strLoaiQuyetDinh_Id, strNgayHetHieuLuc, strNguoiThucHien_Id, dTrangThai 1, dThuTu 1
       NS_ThongTinQuyetDinh/CapNhat  như trên, strId, strNhanSu_HoSoCanBo_Id ''
       NS_ThongTinQuyetDinh/Xoa      strId
       NS_QuyetDinhNhanSu/LayDanhSach  GET  strNhanSu_ThongTinQD_Id — thành viên của quyết định đang sửa
       NS_QuyetDinhNhanSu/Xoa         strId (id dòng thành viên)
       NS_QuyetDinhNhanSu/ThemMoi     strNhanSu_ThongTinQD_Id, strNhanSu_HoSoCanBo_Id, dThuTu, strTrangThai 1, strTinhtrang 1
   Tệp quyết định: NS_Files (uploadFiles / saveFiles / viewFiles theo id quyết định).
   Chọn thành viên: edu.extend.genModal_NhanSu → ums.pat.pickNhanSu. Loại quyết định: NS.QUDI.

   Khác gốc (lỗi rõ ràng, làm theo ý định):
     · Lọc: gốc đọc ô txtSearch_TuKhoa / dropSearch_PhanLoai (không có trên màn — ô thật là
       btnSearch_HSLL_NhanSu / dropSearch_QuyetDinh_Loai) và nút Tìm kiếm id khác → không lọc được;
       strNgayHieuLuc_Den đọc dropSearch_LinhVuc (không có) → rỗng. Bản mới lọc thật theo từ khoá +
       loại; strNgayHieuLuc_Den gửi rỗng như cũ.
     · Sửa: gốc gửi strNguoiKyQuyetDinh = ô "Chữ ký" (luôn bị đặt trống khi mở sửa) → Sửa là XOÁ
       người ký. Bản mới gửi ô "Người ký" như khi Thêm. Ô "Chữ ký" giữ trên biểu mẫu nhưng gốc không
       gửi đi đâu — bản mới cũng không gửi.
     · Thêm thành viên khi SỬA: gốc cho chọn nhưng CapNhat gửi strNhanSu_HoSoCanBo_Id '' và hàm
       add_QuyetDinh_ThanhVien không nơi nào gọi → người chọn thêm bị mất. Bản mới lưu xong gọi
       NS_QuyetDinhNhanSu/ThemMoi với các id nối "#" (cùng cách ghép của ThemMoi quyết định) — đường
       GHI mới, kiểm trên host. dThuTu gốc đọc ô không có → rỗng.
     · Xoá quyết định: nút thùng rác trên từng mục của gốc → nút "Xoá" trong biểu mẫu (ums.crud master).
   ========================================================================= */
(function () {
    'use strict';

    var S = ums.nsCham, ui = ums.ui, pat = ums.pat, esc = S.esc, e = S.e, C = 'NS_ThongTinQuyetDinh';
    var st = { moi: [], cu: [], qd: '' };

    function tenNS(r) {
        var cd = (r.LOAICHUCDANH_MA ? r.LOAICHUCDANH_MA + '.' : '') + (r.LOAIHOCVI_MA ? r.LOAIHOCVI_MA + '.' : '');
        return esc((cd ? cd + ' ' : '') + e(r.HOTEN || (e(r.HODEM) + ' ' + e(r.TEN)))) + '<br><span class="ums-u-faint">' + esc(e(r.MACANBO || r.MASO)) + '</span>';
    }
    function ngaySinh(r) {
        return esc(r.NGAYSINHDAYDU || [r.NGAYSINH, r.THANGSINH, r.NAMSINH].filter(function (x) { return x !== null && x !== undefined && x !== ''; }).join('/'));
    }

    var extra = null;
    function veTV() {
        if (!extra) return;
        var rows = st.cu.map(function (r) { return { r: r, cu: true }; }).concat(st.moi.map(function (r) { return { r: r, cu: false }; }));
        ui.table({
            el: extra.querySelector('[data-z="tv"]'), rows: rows, empty: 'Chưa chọn thành viên',
            columns: [
                { title: 'Hình ảnh', cls: 'is-center', width: '80px', render: function (x) { return S.anh(x.r.ANH); } },
                { title: 'Họ tên', render: function (x) { return tenNS(x.r); } },
                { title: 'Ngày sinh', cls: 'is-nowrap', render: function (x) { return ngaySinh(x.r); } },
                { title: 'Xóa', cls: 'is-center is-actions', width: '64px', render: function (x) {
                    return x.r._chiXem ? '' : x.cu ? ui.iconBtn('del', x.r.ID)
                        : '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-danger" data-bo="' + esc(x.r.ID) + '"><i class="fa-light fa-xmark"></i><span>Bỏ chọn</span></button>';
                } }
            ]
        });
    }
    function taiTV() {
        if (!st.qd) { st.cu = []; veTV(); return; }
        ums.api.call({ action: 'NS_QuyetDinhNhanSu/LayDanhSach', method: 'GET', strNhanSu_ThongTinQD_Id: st.qd })
            .then(function (r) {
                st.cu = S.rows(r);
                if (st.cu.length) { veTV(); return; }
                /* Kiểm host 2026-09-30: danh sách thành viên trả rỗng cho MỌI quyết định, kể cả quyết định vừa lưu có thành viên → mở Sửa thấy
                   "Chưa chọn thành viên". Người của quyết định vẫn có trong NS_ThongTinQuyetDinh/LayChiTiet (NHANSU_HOSOCANBO_ID, HO, TEN, MACANBO)
                   → hiện từ đó, CHỈ XEM (không có id dòng thành viên nên không có nút xoá). */
                var qd = st.qd;
                return ums.api.call({ action: C + '/LayChiTiet', method: 'GET', strId: qd, silent: true }).then(function (c) {
                    if (qd !== st.qd) return;
                    st.cu = S.rows(c).filter(function (x) { return x.NHANSU_HOSOCANBO_ID; }).map(function (x) {
                        return { ID: x.NHANSU_HOSOCANBO_ID, HOTEN: (e(x.HO) + ' ' + e(x.TEN)).trim(), MACANBO: x.MACANBO, _chiXem: true };
                    });
                    veTV();
                }, function () { veTV(); });
            })
            .catch(function (err) { ums.api.handle(err, 'thành viên quyết định'); });
    }

    var crud = ums.crud({
        root: document.getElementById('quyetdinh'),
        title: 'Quyết định',
        formTitle: 'kê khai quyết định',
        icon: 'fa-list',
        master: {
            title: 'Danh sách quyết định', icon: 'fa-hard-drive',
            empty: '- Bạn có quyết định mới không? Bấm "Thêm mới" ở đầu trang.',
            item: function (r) { return '<span class="ums-master__item__main">' + esc(e(r.THONGTINQUYETDINH)) + '</span>'; }
        },
        filters: [
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' },
            { key: 'loai', type: 'select', label: 'Chọn loại quyết định', source: { dm: 'NS.QUDI' } }
        ],
        list: {
            paged: true,
            call: function (f) {
                return { action: C + '/LayDanhSach', method: 'GET', strNgayHieuLuc_Tu: '', strNgayHieuLuc_Den: '',
                    strLoaiQuyetDinh_Id: f.loai, strTuKhoa: f.q, iTrangThai: 1, strThanhVien_Id: '' };
            }
        },
        fields: [
            { type: 'legend', label: 'Thông tin quyết định' },
            { key: 'strThongTinQuyetDinh', col: 'THONGTINQUYETDINH', label: 'Tên quyết định' },
            { key: 'strLoaiQuyetDinh_Id', col: 'LOAIQUYETDINH_ID', label: 'Loại quyết định', type: 'select', source: { dm: 'NS.QUDI' } },
            { key: 'strNguoiKyQuyetDinh', col: 'NGUOIKYQUYETDINH', label: 'Người ký' },
            { key: 'strSoQuyetDinh', col: 'SOQUYETDINH', label: 'Số quyết định' },
            { key: 'strNgayQuyetDinh', col: 'NGAYQUYETDINH', label: 'Ngày quyết định', type: 'date' },
            { key: 'strNgayHieuLuc', col: 'NGAYHIEULUC', label: 'Ngày hiệu lực', type: 'date' },
            { key: 'strNgayHetHieuLuc', col: 'NGAYHETHIEULUC', label: 'Ngày kết thúc', type: 'date' },
            { key: '_chuKy', label: 'Chữ ký' },
            { type: 'legend', label: 'File thông tin' },
            { key: '_tep', type: 'files', label: 'File quyết định', api: 'NS_Files', span: true }
        ],
        onForm: function (row, c, ex) {
            extra = ex;
            st.qd = row ? row.ID : '';
            st.moi = []; st.cu = [];
            ex.innerHTML = pat.panel({
                title: 'Thành viên tham gia', icon: 'fa-users', flush: true, zone: 'tv',
                tools: '<span class="ums-u-faint ums-u-fz13">Vui lòng chọn thành viên tham gia</span>' +
                    ui.btn('search', { text: 'Chọn', mod: 'out-primary', attr: { 'data-a': 'chontv' } })
            });
            veTV();
            taiTV();
        },
        save: function (v, row) {
            return {
                action: C + (row ? '/CapNhat' : '/ThemMoi'),
                strId: row ? row.ID : '',
                strNhanSu_HoSoCanBo_Id: row ? '' : st.moi.map(function (r) { return r.ID; }).join('#'),
                strSoQuyetDinh: v.strSoQuyetDinh,
                strNgayQuyetDinh: v.strNgayQuyetDinh,
                strNguoiKyQuyetDinh: v.strNguoiKyQuyetDinh,
                strNgayHieuLuc: v.strNgayHieuLuc,
                strThongTinQuyetDinh: v.strThongTinQuyetDinh,
                strThongTinDinhKem: '',
                strLoaiQuyetDinh_Id: v.strLoaiQuyetDinh_Id,
                strNgayHetHieuLuc: v.strNgayHetHieuLuc,
                strNguoiThucHien_Id: '',
                dTrangThai: 1,
                dThuTu: 1,
                /* Máy chủ đọc iTrangThai / iThuTu (kiểm host 2026-09-30): gốc chỉ gửi dTrangThai nên quyết định lưu TRANGTHAI = 0,
                   danh sách (iTrangThai = 1) không hiện → người nhập tưởng chưa lưu, nhập lại là trùng. Gửi cả hai tên. */
                iTrangThai: 1,
                iThuTu: 1
            };
        },
        onSaved: function (c, result, isEdit) {
            if (!isEdit || !st.moi.length || !st.qd) return;
            ums.api.call({
                action: 'NS_QuyetDinhNhanSu/ThemMoi', strNhanSu_ThongTinQD_Id: st.qd,
                strNhanSu_HoSoCanBo_Id: st.moi.map(function (r) { return r.ID; }).join('#'),
                dThuTu: '', strTrangThai: 1, strTinhtrang: 1
            }).then(function () { ui.toast('Đã thêm thành viên', 'ok'); })
                .catch(function (err) { ums.api.handle(err, 'thêm thành viên quyết định'); });
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + '/Xoa', strId: id, strNguoiThucHien_Id: S.uid() }; });
        }
    });

    crud.root.addEventListener('click', function (ev) {
        if (!extra || !extra.contains(ev.target)) return;
        var a = ev.target.closest('[data-a="chontv"]');
        if (a) {
            pat.pickNhanSu({
                title: 'Chọn thành viên tham gia',
                onPick: function (rows) {
                    var co = {};
                    st.cu.forEach(function (r) { co[r.NHANSU_HOSOCANBO_ID || r.ID] = 1; });
                    st.moi.forEach(function (r) { co[r.ID] = 1; });
                    var bo = 0;
                    rows.forEach(function (r) { if (co[r.ID]) bo++; else { st.moi.push(r); co[r.ID] = 1; } });
                    if (bo) ui.toast('Đã tồn tại: ' + bo + ' người', 'warn');
                    veTV();
                }
            });
            return;
        }
        var bo = ev.target.closest('[data-bo]');
        if (bo) {
            st.moi = st.moi.filter(function (r) { return String(r.ID) !== bo.getAttribute('data-bo'); });
            veTV();
            return;
        }
        var xoa = ev.target.closest('[data-act="del"]');
        if (xoa) {
            var id = xoa.getAttribute('data-id');
            ui.confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi quyết định?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                ums.api.call({ action: 'NS_QuyetDinhNhanSu/Xoa', strId: id, strNguoiThucHien_Id: S.uid() })
                    .then(function () { ui.toast('Xóa thành công!', 'ok'); taiTV(); })
                    .catch(function (err) { ums.api.handle(err, 'xoá thành viên'); });
            });
        }
    });
})();
