/* =========================================================================
   Quản lý kế hoạch khảo sát
   Bản gốc: ApisCongCanBo/Modules/khaosat/script/kehoach.js (3.474 dòng) + html/kehoach.html
            + script/dsdangkyhoc_picker.js
   ---------------------------------------------------------------------------
   Tệp của màn (nạp theo thứ tự trong html):
       _pickdangkyhoc.js   hộp "Thêm sinh viên từ đăng ký học"
       _kehoach_luoi.js    lưới Đối tượng được khảo sát / tham gia khảo sát
       _kehoach_phieu.js   phiếu khảo sát của kế hoạch (danh sách, một phiếu, phiếu tự động)
       _kehoach_ketqua.js  kết quả khảo sát (4 tab)
       kehoach.js          tệp này: danh sách kế hoạch + biểu mẫu kế hoạch + chuyển khung

   Lời gọi của tệp này (kiểu cũ, không mã hoá, chép nguyên):
       KS_ThongTin/LayDSKS_KeHoachKhaoSat      GET  strTuKhoa, pageIndex, pageSize
       KS_ThongTin/Them_KS_KeHoachKhaoSat      POST | Sua_KS_KeHoachKhaoSat khi có strId
       KS_ThongTin/Xoa_KS_KeHoachKhaoSat       POST nút "Xóa kế hoạch" trong biểu mẫu
       KS_TaoPhieu/ResetKetQuaTaoPhieu         POST nút "Xóa" ở DANH SÁCH (xem dưới)
       KS_ThongTin/LayDSPhieu_Mau_NguoiDung    GET  ô Phiếu mẫu
       Đối tượng được khảo sát: LayDSKS_DoiTuongDuocKhaoSat | Them_KS_DoiTuongDuocKhaoSat (strKyHieu) | Xoa_…
       Đối tượng tham gia:      LayDSKS_DoiTuongThamGiaKhaoSat | Them_KS_DoiTuongThamGiaKhaoSat (strMaSo) | Xoa_…
       Khóa học (cột "Khóa học" → Xem): TS_KS_BaoCao_MH (mã hoá) KHAOSAT_BAOCAO.LayDSKS_KhoaKhaoSat
       Mẫu báo cáo: ums.report.mount — kèm strKS_KeHoachKhaoSat_Id của từng kế hoạch
                    đánh dấu và strDaoTao_KhoaHoc_Id của từng khóa đánh dấu trong hộp Khóa học.
       Danh mục: KS.PHANLOAI.DOITUONGDUOCKHAOSAT (loại đối tượng ở dòng tự nhập).

   CHỜ NGHIỆP VỤ:
     · Nút "Xóa" ở danh sách bản gốc gọi KS_TaoPhieu/ResetKetQuaTaoPhieu (ĐẶT LẠI
       kết quả tạo phiếu) rồi báo "Xóa thành công!" — KHÔNG xoá kế hoạch. Giữ lời
       gọi, nhưng chữ hỏi lại nói rõ việc sẽ làm. Xoá kế hoạch thật: nút "Xóa kế
       hoạch" trong biểu mẫu (Xoa_KS_KeHoachKhaoSat).
     · Cột "Trạng thái" bản gốc so CHEDOKHAOSAT_TEN với số 0/1/2 (cột tên mà so
       số) — ở đây: CHEDOKHAOSAT_TEN là chữ thì hiện chữ, là số thì đổi như gốc,
       trống thì đổi theo CHEDOKHAOSAT. KIỂM TRÊN HOST.
     · "Thêm từng khóa / chương trình / lớp" luôn lưu vào ĐỐI TƯỢNG ĐƯỢC KHẢO SÁT,
       kể cả khi bấm từ lưới tham gia (như bản gốc — edu.extend.arrKhoa… dùng chung).
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Thêm mới xong bản gốc không giữ id kế hoạch và không đánh dấu dòng đã lưu →
       bấm Lưu lần nữa là thêm TRÙNG kế hoạch và mọi dòng mới. Ở đây lưu xong về danh sách.
     · rewrite() không xoá lưới tham gia → mở "Thêm mới" sau khi sửa kế hoạch khác
       vẫn còn dòng cũ. Ở đây xoá cả hai lưới.
     · Không ô nào bắt buộc (arrValid kiểm ô txtKeHoach_So không có trên màn) — giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, ks = ums.ks;
    var C = 'KS_ThongTin/';
    var root = document.getElementById('ks-kehoach');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var VIEWS = ['ds', 'dsphieu', 'phieu', 'tudong', 'ketqua'];
    root.innerHTML = VIEWS.map(function (v) { return '<div data-kz="' + v + '"' + (v === 'ds' ? '' : ' hidden') + '></div>'; }).join('');
    var dangMo = 'ds';
    var ctx = {
        z: function (k) { return root.querySelector('[data-kz="' + k + '"]'); },
        show: function (k) {
            if (k === dangMo) return;
            ui.swap(ctx.z(dangMo), ctx.z(k), { top: true });
            dangMo = k;
            if (k === 'ds') crud.load();
        },
        reloadList: function () { crud.load(); }
    };

    /* ---------- Hai lưới đối tượng trong biểu mẫu ------------------------ */
    var dsLoai = ums.api.dm('KS.PHANLOAI.DOITUONGDUOCKHAOSAT');
    var nhom = {};            // edu.extend.arrKhoa / arrChuongTrinh / arrLop — luôn lưu vào "được khảo sát"
    var NHAN = { khoa: 'Áp dụng cho khóa', ct: 'Áp dụng cho chương trình', lop: 'Áp dụng cho lớp' };
    function veNhom() {
        var el = root.querySelector('[data-z="nhom"]');
        if (el) el.innerHTML = Object.keys(nhom).filter(function (k) { return nhom[k].ids.length; })
            .map(function (k) { return '<div>' + esc(NHAN[k]) + ': <b>' + esc(nhom[k].names.join(', ')) + '</b></div>'; }).join('');
    }
    function onGroup(kind, ids, names) { nhom[kind] = { ids: ids, names: names || [] }; veNhom(); ui.toast(NHAN[kind] + ': ' + (names || []).join(', '), 'ok'); }
    function goiDS(ds) {
        return function (id) {
            return { action: C + ds, method: 'GET', strTuKhoa: '', strKS_LoaiDoiTuong_Id: '', strKS_PhieuKhaoSat_Mau_Id: phieuMau(),
                strKS_KeHoachKhaoSat_Id: id, strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 };
        };
    }
    function phieuMau() { var el = root.querySelector('[data-k="strKS_PhieuKhaoSat_Mau_Id"]'); return el ? el.value : ''; }
    function luuDong(api, maParam) {
        return function (m, id) {
            var x = { action: C + api, method: 'POST', strId: m.tuNhap ? '' : m.id, strTen: m.ten };
            x[maParam] = m.ma;
            x.strGhiChu = m.tuNhap ? m.moTa : '';
            x.strKS_LoaiDoiTuong_Id = m.tuNhap ? m.loai : '';
            x.strKS_PhieuKhaoSat_Mau_Id = phieuMau(); x.strKS_KeHoachKhaoSat_Id = id; x.strNguoiThucHien_Id = uid();
            return x;
        };
    }
    var luoiPV = null, luoiDT = null;

    /* ---------- Danh sách kế hoạch + biểu mẫu ---------------------------- */
    var CHEDO = { 0: 'Chờ khảo sát', 1: 'Đang khảo sát', 2: 'Khảo sát giả lập' };
    function cheDo(r) {
        var t = r.CHEDOKHAOSAT_TEN;
        if (t !== null && t !== undefined && t !== '' && isNaN(Number(t))) return e(t);
        var v = (t === null || t === undefined || t === '') ? r.CHEDOKHAOSAT : t;
        return CHEDO[Number(v)] || '';
    }
    function tyLe(r) {
        var g = Number(r.TONGSOPHIEUGUI) || 0, d = Number(r.TONGSOPHIEUDATHUCHIEN) || 0;
        return g ? (d / g * 100).toFixed(2) + '%' : '0%';
    }
    function nut(kind, id, text) {
        return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-kh="' + kind + '" data-id="' + esc(id) + '">' + esc(text) + '</button>';
    }
    var khoaChon = [];
    var crud = ums.crud({
        root: ctx.z('ds'),
        title: 'Quản lý kế hoạch',
        listTitle: 'Danh sách kế hoạch',
        formTitle: 'kế hoạch',
        icon: 'fa-list-timeline',
        formCols: 12,
        rowDelete: false,
        removeText: 'Xóa',
        formRemoveText: 'Xóa kế hoạch',
        removeConfirm: function (rows, trongBieuMau) {
            return trongBieuMau ? 'Bạn có chắc chắn muốn xóa kế hoạch này không?'
                : 'Đặt lại (xoá) KẾT QUẢ TẠO PHIẾU của ' + rows.length + ' kế hoạch đã chọn? Kế hoạch vẫn được giữ — muốn xoá kế hoạch thì mở "Sửa" rồi bấm "Xóa kế hoạch".';
        },
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            paged: true,
            call: function (f, p) {
                return { action: C + 'LayDSKS_KeHoachKhaoSat', method: 'GET', strTuKhoa: f.q || '', strNguoiThucHien_Id: uid(), pageIndex: p.index, pageSize: p.size };
            }
        },
        columns: [
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
            { title: 'Từ ngày', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
            { title: 'Trạng thái', cls: 'is-center', render: function (r) { return esc(cheDo(r)); } },
            { title: 'Phiếu khảo sát', cls: 'is-center', render: function (r) { return nut('phieu', r.ID, 'Chi tiết'); } },
            { title: 'Kết quả khảo sát', cls: 'is-center', render: function (r) { return nut('ketqua', r.ID, 'Chi tiết'); } },
            { title: 'Tổng số phiếu gửi', prop: 'TONGSOPHIEUGUI', cls: 'is-center' },
            { title: 'Tổng số phiếu đã thực hiện', prop: 'TONGSOPHIEUDATHUCHIEN', cls: 'is-center' },
            { title: 'Tỷ lệ hoàn thành', cls: 'is-center', render: function (r) { return esc(tyLe(r)); } },
            { title: 'Khóa học', cls: 'is-center', render: function (r) { return nut('khoa', r.ID, 'Xem'); } },
            { title: 'Phiếu khảo sát mẫu', prop: 'KS_PHIEUKHAOSAT_MAU_TEN' }
        ],
        fields: [
            // required (kiểm host 6/10): máy chủ từ chối "Phieu khao sat mau khong ton tai" khi để trống Phiếu mẫu — chặn ở màn trước
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', cols: 12, required: true },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Từ ngày', type: 'date', cols: 3 },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Đến ngày', type: 'date', cols: 3 },
            { key: 'dCheDoKhaoSat', col: 'CHEDOKHAOSAT', label: 'Chế độ', type: 'select', cols: 3,
              source: { items: [{ ID: '2', TEN: 'Khảo sát giả lập' }, { ID: '0', TEN: 'Chờ khảo sát' }, { ID: '1', TEN: 'Đang khảo sát' }] } },
            { key: 'strNamHoc', col: 'NAMHOC', label: 'Năm học', cols: 3 },
            { key: 'strHocKy', col: 'HOCKY', label: 'Học kỳ', cols: 3 },
            { key: 'strDotHoc', col: 'DOTHOC', label: 'Đợt', cols: 3 },
            { key: 'strKS_PhieuKhaoSat_Mau_Id', col: 'KS_PHIEUKHAOSAT_MAU_ID', label: 'Phiếu mẫu', type: 'select', cols: 6, placeholder: 'Chọn phiếu', required: true,
              source: { call: { action: C + 'LayDSPhieu_Mau_NguoiDung', method: 'GET', strNguoiThucHien_Id: uid() }, name: 'TENPHIEU' } },
            { key: 'strNoiDungKeHoach', col: 'NOIDUNGKEHOACH', label: 'Mô tả', type: 'textarea', cols: 12 }
        ],
        onForm: function (row, c, extra) {
            nhom = {};
            extra.innerHTML = '<div class="ums-grid ums-grid--2"><div><div data-z="pv"></div><div class="ums-u-fz13 ums-u-muted ums-u-mt-2" data-z="nhom"></div></div><div data-z="dt"></div></div>';
            luoiPV = ks.luoiDoiTuong(extra.querySelector('[data-z="pv"]'), {
                title: 'Đối tượng được khảo sát', icon: 'fa-bullseye', maCol: 'KYHIEU', loaiCol: 'LOAIDOITUONGDUOCKS_TEN', dsLoai: dsLoai, onGroup: onGroup,
                list: goiDS('LayDSKS_DoiTuongDuocKhaoSat'), save: luuDong('Them_KS_DoiTuongDuocKhaoSat', 'strKyHieu'),
                remove: function (id) { return { action: C + 'Xoa_KS_DoiTuongDuocKhaoSat', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; }
            });
            luoiDT = ks.luoiDoiTuong(extra.querySelector('[data-z="dt"]'), {
                title: 'Đối tượng tham gia khảo sát', icon: 'fa-users', maCol: 'MASO', loaiCol: 'LOAIDOITUONGTHAMGIAKS_TEN', dsLoai: dsLoai, onGroup: onGroup,
                list: goiDS('LayDSKS_DoiTuongThamGiaKhaoSat'), save: luuDong('Them_KS_DoiTuongThamGiaKhaoSat', 'strMaSo'),
                remove: function (id) { return { action: C + 'Xoa_KS_DoiTuongThamGiaKhaoSat', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; }
            });
            luoiPV.load(row ? row.ID : ''); luoiDT.load(row ? row.ID : '');
        },
        save: function (v, row) {
            return {
                action: C + (row ? 'Sua_KS_KeHoachKhaoSat' : 'Them_KS_KeHoachKhaoSat'), method: 'POST',
                strId: row ? row.ID : '', strTenKeHoach: v.strTenKeHoach, strNoiDungKeHoach: v.strNoiDungKeHoach,
                strNgayBatDau: v.strNgayBatDau, strNgayKetThuc: v.strNgayKetThuc, strNamHoc: v.strNamHoc, strHocKy: v.strHocKy,
                strDotHoc: v.strDotHoc, dCheDoKhaoSat: v.dCheDoKhaoSat, strKS_PhieuKhaoSat_Mau_Id: v.strKS_PhieuKhaoSat_Mau_Id, strNguoiThucHien_Id: uid()
            };
        },
        onSaved: function (c, result, isEdit) {
            var id = isEdit ? (c.editing && c.editing.ID) : ((result.raw && result.raw.Id) || '');
            if (!id) return;
            var p = luoiPV ? luoiPV.save(id) : Promise.resolve();
            p.then(function () {
                // Khóa / CT / lớp (edu.extend.arrKhoa, arrChuongTrinh, arrLop) → Them_KS_DoiTuongDuocKhaoSat, strId = id nhóm
                var ids = [].concat((nhom.khoa || {}).ids || [], (nhom.ct || {}).ids || [], (nhom.lop || {}).ids || []);
                if (!ids.length) return;
                return ui.batch(ids.map(function (gid) {
                    return { action: C + 'Them_KS_DoiTuongDuocKhaoSat', method: 'POST', strId: gid, strTen: '', strKyHieu: '', strGhiChu: '', strKS_LoaiDoiTuong_Id: '',
                        strKS_PhieuKhaoSat_Mau_Id: phieuMau(), strKS_KeHoachKhaoSat_Id: id, strNguoiThucHien_Id: uid() };
                }), { title: 'Đang lưu khóa / chương trình / lớp', okText: 'Thêm thành công!' });
            }).then(function () { return luoiDT ? luoiDT.save(id) : null; });
        },
        remove: function (ids, rows) {
            return rows.map(function (r) {
                return { action: 'KS_TaoPhieu/ResetKetQuaTaoPhieu', method: 'POST', strKS_KeHoachKhaoSat_Id: r.ID, strKS_PhieuKhaoSat_Mau_Id: e(r.KS_PHIEUKHAOSAT_MAU_ID), strNguoiThucHien_Id: uid() };
            });
        },
        formRemove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_KS_KeHoachKhaoSat', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; });
        }
    });

    /* Mẫu báo cáo ở đầu trang (getList_MauImport "zonebtnBaoCao_KeHoach") */
    var act = ctx.z('ds').querySelector('.ums-page__actions');
    if (act) {
        var rp = document.createElement('div');
        act.insertBefore(rp, act.firstChild);
        ums.report.mount(rp, { collect: function (add) {
            crud.pickedRows().forEach(function (r) { add('strKS_KeHoachKhaoSat_Id', r.ID); });
            khoaChon.forEach(function (id) { add('strDaoTao_KhoaHoc_Id', id); });
        } });
    }

    /* Hộp "Khóa học" (miniPopover) — khóa đánh dấu làm tham số báo cáo */
    function moKhoaHoc(r) {
        var ds = [];
        var dlg = ui.dialog({ title: 'Khóa học — ' + e(r.TENKEHOACH), icon: 'fa-graduation-cap', size: 'sm',
            body: '<div data-z="kh">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-z="kh"]');
        ums.api.call({ action: 'TS_KS_BaoCao_MH/DSA4BRIKEh4KKS4gCikgLhIgNQPP', func: 'KHAOSAT_BAOCAO.LayDSKS_KhoaKhaoSat', method: 'POST',
            strTuKhoa: '', strKS_KeHoachKhaoSat_Id: r.ID, strKS_PhieuKhaoSat_Id: '', strNguoiThucHien_Id: uid() }).then(function (x) {
            ds = arr(x.data);
            ui.table({ el: host, rows: ds, empty: 'Không có khóa học', columns: [
                { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                { head: '<input type="checkbox" data-kk="all">', cls: 'is-center', width: '44px', render: function (k, i) {
                    return '<input type="checkbox" data-kk="' + i + '"' + (khoaChon.indexOf(k.ID) >= 0 ? ' checked' : '') + '>'; } }
            ] });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'khóa học'); });
        host.addEventListener('change', function (ev) {
            var t = ev.target, k = t.getAttribute('data-kk');
            if (k === 'all') Array.prototype.forEach.call(host.querySelectorAll('input[data-kk]'), function (c) { c.checked = t.checked; });
            khoaChon = Array.prototype.filter.call(host.querySelectorAll('input[data-kk]:checked'), function (c) { return c.getAttribute('data-kk') !== 'all'; })
                .map(function (c) { return ds[Number(c.getAttribute('data-kk'))].ID; });
        });
    }

    var phieuView = ks.phieu(ctx), ketQuaView = ks.ketQua(ctx);
    ctx.z('ds').addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-kh]');
        if (!b) return;
        var r = crud.rows.filter(function (x) { return x.ID === b.getAttribute('data-id'); })[0];
        if (!r) return;
        var k = b.getAttribute('data-kh');
        if (k === 'phieu') phieuView.mo(r);
        else if (k === 'ketqua') ketQuaView.mo(r);
        else if (k === 'khoa') moKhoaHoc(r);
    });
})();
