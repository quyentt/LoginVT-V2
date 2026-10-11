/* =========================================================================
   Tòa nhà - số phòng (Ký túc xá / Cơ sở vật chất)
   Bản gốc: ApisKyTucXa/Modules/cosovatchat/html/toanha.html + script/toanha.js (1.037 dòng)
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá):
       KTX_ToaNha/LayDanhSach      GET   (ums.ktx.toaNha — tham số chép nguyên văn, pageSize 100000)
       KTX_ToaNha/ThemMoi | CapNhat POST strId, strTen, strMa, strThongTinLienHe, dSoTang, strDiaChi,
                                          strLoaiToaNha_Id, strViTriCauThang_Id
       KTX_ToaNha/Xoa              POST  strIds
       KTX_Phong/LayDanhSach       GET   strTuKhoa, strKTX_ToaNha_Id, strPhanLoaiDoiTuong_Id, strTangThu_Id "",
                                         strLoaiPhong_Id, strTinhChat_Id, strTinhTrang_Id "", pageIndex 1, pageSize 1000000000
                                         — gọi thêm một lần KHÔNG lọc để đếm số phòng từng toà (getCount_Phong)
       KTX_Phong/ThemMoi | CapNhat POST  strId, strTen, strMa, strKTX_ToaNha_Id, strDienTichSuDung, strSoGiuong,
                                         strTangThu_Id, strLoaiPhong_Id, strTinhChat_Id, strTinhTrang_Id, strMoTa, dSoSinhVienToiDa
       KTX_Phong/Xoa               POST  strIds
       KTX_Phong_ApDung/LayDanhSach GET  strTuKhoa "", strKTX_Phong_Id, strPhanLoaiDoiTuong_Id (ô lọc), pageIndex 1, pageSize 10000000
       KTX_Phong_ApDung/ThemMoi    POST  strId "", strKTX_Phong_Id, strPhanLoaiDoiTuong_Id   (mỗi đối tượng mới đánh dấu một lời gọi)
       KTX_Phong_ApDung/Xoa        POST  strKTX_Phong_Id, strPhanLoaiDoiTuong_Id             (mỗi đối tượng bỏ đánh dấu một lời gọi)
       Danh mục: KTX_PHANLOAIDOITUONG, KTX.ST00, KTX.LTN0, KTX.VTCT, KTX.LP00, KTX.TCP0, KTX.TTP0
   Bố cục bản gốc: MỘT cột — khung lọc phòng (Loại phòng, Tính chất, Loại đối tượng, từ khoá) ở trên;
   khung "Danh sách tòa nhà · N tòa nhà · M phòng" + nút Thêm, thân là LƯỚI THẺ toà nhà (tên, Số phòng,
   "Xem phòng →", Xóa / Chỉnh sửa). Bấm thẻ → khung "Danh sách phòng thuộc tòa nhà X" THAY CHỖ (bảng
   12 cột + dòng Tổng cộng diện tích / giường / người, nút Thêm, Đóng); thêm / sửa phòng → biểu mẫu
   ba nhóm (Thông tin chung · Quy mô và tình trạng · Phân loại) + Mô tả, thay chỗ bảng.
   Ở đây: thẻ = ums.pat.cards; khung phòng = ums.pat.formTrang chứa ums.crud nhúng; toà nhà thêm / sửa
   = ums.pat.formTrang (bản gốc bật modal — luật 2026-09-30).

   Giữ như bản gốc:
     · Bắt buộc khi lưu toà nhà: Tên, Số tầng (số nguyên), Thông tin liên hệ, Địa chỉ (arrValid_DapAn).
     · Lưu phòng xong mới đồng bộ Loại đối tượng (ApDung): thêm cái mới đánh dấu, xoá cái bỏ đánh dấu.
   Khác bản gốc (lỗi rõ ràng, ghi lại):
     · Lọc phòng từ khung trên: bản gốc gọi getList_Phong("", từ khoá) — tham số "" KHÔNG xoá toà nhà
       đang nhớ nên tìm "toàn trường" vẫn bị kẹt trong toà vừa xem. Ở đây tìm từ khung trên = mọi toà.
     · Bản gốc không bắt buộc ô nào khi lưu phòng → ở đây bắt buộc Tòa nhà + Tên phòng (không có tên
       thì dòng trong bảng trống).
     · Sửa phòng: bản gốc đổ tên toà vào ô txtToaNha_Ten của biểu mẫu TOÀ NHÀ (nhầm ô) → bỏ.
     · Xoá: bản gốc gắn thêm trình xử lý #btnYes mỗi lần bấm → ui.confirm.
   Cố ý bỏ: genCombo_ToaNha (ô chọn không có trong HTML), #notify_cn, #btnNotifyModal, #myModalLabel.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, K = ums.ktx, e = K.e;
    var root = document.getElementById('ktx-toanha');
    if (!root) return;

    var st = { toa: [], soPhong: {}, toaId: '', toaTen: '', apDungCu: [], dt: [] };

    root.innerHTML =
        pat.page('Tòa nhà - số phòng') +
        '<div data-z="man">' +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body: '<div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="lp" data-ph="--Chọn loại phòng--"><option value="">--Chọn loại phòng--</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="tc" data-ph="--Chọn tính chất--"><option value="">--Chọn tính chất--</option></select></div>' +
            '<div class="ums-field"><select class="ums-select" data-f="dt" data-ph="Chọn loại đối tượng"><option value="">Chọn loại đối tượng</option></select></div>' +
            '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
            '</div>' }) +
        /* Nút Thêm (toà nhà) + Tải lại đặt trên khung danh sách như box-tools bản gốc — nằm trong vùng bị khung phòng thay chỗ */
        pat.panel({ title: 'Danh sách tòa nhà', icon: 'fa-building', count: 'tong', zone: 'ds',
            tools: ui.btn('add', { text: 'Thêm', attr: { 'data-a': 'themtoa' } }) + ui.btn('reload', { attr: { 'data-a': 'tai' } }) }) +
        '</div>';
    var zMan = root.querySelector('[data-z="man"]');
    var zDs = root.querySelector('[data-z="ds"]');
    var zTong = root.querySelector('[data-z="tong"]');
    function fo(k) { return root.querySelector('[data-f="' + k + '"]'); }

    ums.api.dm('KTX.LP00').then(function (rs) { pat.fill(fo('lp'), rs); });
    ums.api.dm('KTX.TCP0').then(function (rs) { pat.fill(fo('tc'), rs); });
    var pDt = ums.api.dm('KTX_PHANLOAIDOITUONG').then(function (rs) { st.dt = rs; pat.fill(fo('dt'), rs); return rs; });

    /* Khung lọc trên: gõ là tự tìm (400ms), đổi ô chọn là tìm ngay — mở khung phòng của MỌI toà */
    var goTimer = null;
    fo('q').addEventListener('input', function () {
        clearTimeout(goTimer);
        goTimer = setTimeout(function () { moPhong('', ''); }, 400);
    });
    fo('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); clearTimeout(goTimer); moPhong('', ''); } });
    if (window.jQuery) jQuery(root).on('change', '[data-f="lp"],[data-f="tc"],[data-f="dt"]', function () {
        if (khungPhong) phong.load(1); else moPhong('', '');
    });
    function loc() {
        return { q: (fo('q').value || '').trim(), lp: fo('lp').value || '', tc: fo('tc').value || '', dt: fo('dt').value || '' };
    }

    /* ---------- Toà nhà: danh sách thẻ ---------- */
    function tai() {
        zDs.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        K.quen();
        return K.toaNha().then(function (rs) {
            st.toa = rs;
            ve();
            return demPhong();
        });
    }
    /* getCount_Phong: một lời gọi không lọc, đếm theo KTX_TOANHA_ID */
    function demPhong() {
        return K.phong({ pageSize: 1000000000 }).then(function (kq) {
            var d = {};
            kq.rows.forEach(function (r) { d[r.KTX_TOANHA_ID] = (d[r.KTX_TOANHA_ID] || 0) + 1; });
            st.soPhong = d;
            ve();
        }).catch(function (err) { ums.api.handle(err, 'đếm số phòng'); });
    }
    function ve() {
        var tong = 0;
        st.toa.forEach(function (t) { tong += Number(st.soPhong[t.ID] !== undefined ? st.soPhong[t.ID] : (t.TONGSOPHONG || 0)) || 0; });
        zTong.textContent = st.toa.length + ' tòa nhà · ' + tong + ' phòng';
        pat.cards({
            el: zDs, items: st.toa, cls: 'ktx-tn', empty: 'Chưa có tòa nhà nào', emptyIcon: 'fa-building',
            onPick: function (it) { moPhong(it.ID, e(it.TEN)); },
            title: function (it) { return 'Xem phòng của ' + e(it.TEN); },
            render: function (it) {
                var so = st.soPhong[it.ID] !== undefined ? st.soPhong[it.ID] : (it.TONGSOPHONG || 0);
                return '<div class="ktx-tn__head"><span class="ktx-tn__ico"><i class="fa-light fa-building"></i></span>' +
                    '<div class="ktx-tn__title">' + ui.esc(e(it.TEN)) + '</div></div>' +
                    '<div class="ktx-tn__body"><span class="ums-card__row" style="flex:1"><span>Số phòng</span><b>' + so + '</b></span>' +
                    '<span class="ktx-tn__xem">Xem phòng <i class="fa-light fa-arrow-right"></i></span></div>';
            },
            actions: function (it) {
                return ui.btn('del', { text: 'Xóa', cls: 'ums-btn--sm', attr: { 'data-a': 'xoatoa', 'data-id': it.ID } }) +
                    ui.btn('edit', { text: 'Chỉnh sửa', cls: 'ums-btn--sm', attr: { 'data-a': 'suatoa', 'data-id': it.ID } });
            }
        });
    }

    /* ---------- Toà nhà: biểu mẫu thêm / sửa (trong trang) ---------- */
    function moToa(row) {
        var f = pat.formTrang({
            host: zMan, title: (row ? 'Chỉnh sửa' : 'Thêm mới') + ' - Tòa nhà', icon: row ? 'fa-pen-to-square' : 'fa-plus',
            body:
                ui.field('Tên tòa nhà', '<input class="ums-input" data-t="ten" autocomplete="off">', { required: true }) +
                ui.field('Mã tòa nhà', '<input class="ums-input" data-t="ma" autocomplete="off">') +
                ui.field('Số tầng', '<input class="ums-input" data-t="sotang" type="number" min="0" step="1" autocomplete="off">', { required: true }) +
                ui.field('Loại tòa nhà', '<select class="ums-select" data-t="loai" data-ph="Chọn loại tòa nhà"><option value="">Chọn loại tòa nhà</option></select>') +
                ui.field('Vị trí cầu thang', '<select class="ums-select" data-t="vt" data-ph="Chọn vị trí cầu thang"><option value="">Chọn vị trí cầu thang</option></select>') +
                ui.field('Thông tin liên hệ', '<input class="ums-input" data-t="lh" autocomplete="off">', { required: true }) +
                '<div style="grid-column:1 / -1">' + ui.field('Địa chỉ', '<input class="ums-input" data-t="diachi" autocomplete="off">', { required: true }) + '</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function (api) { luuToa(api, row); return false; } }]
        });
        function o(k) { return f.body.querySelector('[data-t="' + k + '"]'); }
        ums.api.dm('KTX.LTN0').then(function (rs) { pat.fill(o('loai'), rs); if (row) { o('loai').value = e(row.LOAITOANHA_ID); if (window.jQuery) jQuery(o('loai')).trigger('change.select2'); } });
        ums.api.dm('KTX.VTCT').then(function (rs) { pat.fill(o('vt'), rs); if (row) { o('vt').value = e(row.VITRICAUTHANG_ID); if (window.jQuery) jQuery(o('vt')).trigger('change.select2'); } });
        if (row) {
            o('ten').value = e(row.TEN); o('ma').value = e(row.MA); o('sotang').value = e(row.SOTANG);
            o('lh').value = e(row.THONGTINLIENHE); o('diachi').value = e(row.DIACHI);
        }
        o('ten').focus();
        function luuToa(api, row) {
            var v = { ten: o('ten').value.trim(), ma: o('ma').value.trim(), sotang: o('sotang').value.trim(), loai: o('loai').value || '',
                vt: o('vt').value || '', lh: o('lh').value.trim(), diachi: o('diachi').value.trim() };
            if (!v.ten) { ui.toast('Chưa nhập tên tòa nhà', 'warn'); o('ten').focus(); return; }
            if (!v.sotang || !/^\d+$/.test(v.sotang)) { ui.toast('Số tầng phải là số nguyên', 'warn'); o('sotang').focus(); return; }
            if (!v.lh) { ui.toast('Chưa nhập thông tin liên hệ', 'warn'); o('lh').focus(); return; }
            if (!v.diachi) { ui.toast('Chưa nhập địa chỉ', 'warn'); o('diachi').focus(); return; }
            ums.api.call({
                action: 'KTX_ToaNha/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                strTen: v.ten, strMa: v.ma, strThongTinLienHe: v.lh, dSoTang: v.sotang, strDiaChi: v.diachi,
                strLoaiToaNha_Id: v.loai, strViTriCauThang_Id: v.vt
            }).then(function () {
                ui.toast(row ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                api.close();
                tai();
            }).catch(function (err) { ums.api.handle(err, (row ? 'cập nhật' : 'thêm') + ' tòa nhà'); });
        }
    }
    function xoaToa(row) {
        ui.confirm('Xoá tòa nhà "' + e(row.TEN) + '"? Thao tác này không hoàn tác được.', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' })
            .then(function (yes) {
                if (!yes) return;
                return ums.api.call({ action: 'KTX_ToaNha/Xoa', method: 'POST', strIds: row.ID }).then(function () {
                    ui.toast('Xóa thành công!', 'ok');
                    tai();
                });
            }).catch(function (err) { ums.api.handle(err, 'xoá tòa nhà'); });
    }

    /* ---------- Phòng: khung thay chỗ + ums.crud nhúng ---------- */
    var khungPhong = null, phong = null;
    var zPhong = document.createElement('div');
    var fToa = { key: 'strKTX_ToaNha_Id', col: 'KTX_TOANHA_ID', label: 'Tòa nhà', type: 'select', required: true,
        source: { call: { action: 'KTX_ToaNha/LayDanhSach', method: 'GET', strTuKhoa: '', strLoaiToaNha_Id: '', strViTriCauThang_Id: '', strPhanLoaiDoiTuong_Id: '',
            strTangThu_Id: '', strLoaiPhong_Id: '', strTinhChat_Id: '', strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 100000 }, name: 'TEN' } };

    function dungCrud(dtRows) {
        var cham = function (v) { return e(v) === '' ? '—' : ui.esc(v); };
        phong = ums.crud({
            root: zPhong, embedded: true, autoload: false,
            title: 'Danh sách phòng', icon: 'fa-door-open', formTitle: 'phòng', addText: 'Thêm',
            empty: 'Chưa có phòng nào',
            list: { call: function () {
                var f = loc();
                return { action: 'KTX_Phong/LayDanhSach', method: 'GET',
                    strTuKhoa: st.toaId ? '' : f.q, strKTX_ToaNha_Id: st.toaId, strPhanLoaiDoiTuong_Id: f.dt, strTangThu_Id: '',
                    strLoaiPhong_Id: f.lp, strTinhChat_Id: f.tc, strTinhTrang_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000000 };
            } },
            columns: [
                { title: 'Tòa nhà', prop: 'KTX_TOANHA_TEN' },
                { title: 'Tên phòng', prop: 'TEN' },
                { title: 'Mã phòng', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tầng', cls: 'is-center', render: function (r) { return cham(r.TANGTHU_TEN); } },
                { title: 'Tính chất', render: function (r) { return e(r.TINHCHAT_TEN) === '' ? '—' : ui.badge(r.TINHCHAT_TEN, 'info'); } },
                { title: 'Loại phòng', render: function (r) { return cham(r.LOAIPHONG_TEN); } },
                { title: 'Diện tích (m²)', cls: 'is-right', render: function (r) { return cham(r.DIENTICHSUDUNG); } },
                { title: 'Số giường', cls: 'is-right', render: function (r) { return cham(r.SOGIUONG); } },
                { title: 'Số người ở tối đa', cls: 'is-right', render: function (r) { return cham(r.SOSINHVIENTOIDA); } }
            ],
            fields: [
                { key: '_l1', type: 'legend', label: 'Thông tin chung' },
                fToa,
                { key: 'strTangThu_Id', col: 'TANGTHU_ID', label: 'Tầng số', type: 'select', source: { dm: 'KTX.ST00' } },
                { key: 'strTen', col: 'TEN', label: 'Tên phòng', required: true, placeholder: 'Nhập tên phòng' },
                { key: 'strMa', col: 'MA', label: 'Mã phòng', placeholder: 'Nhập mã phòng' },
                { key: '_l2', type: 'legend', label: 'Quy mô và tình trạng' },
                { key: 'strDienTichSuDung', col: 'DIENTICHSUDUNG', label: 'Diện tích (m²)', type: 'number', placeholder: 'Nhập diện tích' },
                { key: 'strSoGiuong', col: 'SOGIUONG', label: 'Số giường', type: 'number', placeholder: 'Nhập số giường' },
                { key: 'dSoSinhVienToiDa', col: 'SOSINHVIENTOIDA', label: 'Số người ở tối đa', type: 'number', placeholder: 'Nhập số người tối đa' },
                { key: 'strTinhTrang_Id', col: 'TINHTRANG_ID', label: 'Tình trạng', type: 'select', source: { dm: 'KTX.TTP0' } },
                { key: '_l3', type: 'legend', label: 'Phân loại' },
                { key: 'strLoaiPhong_Id', col: 'LOAIPHONG_ID', label: 'Loại phòng', type: 'select', source: { dm: 'KTX.LP00' } },
                { key: 'strTinhChat_Id', col: 'TINHCHAT_ID', label: 'Tính chất', type: 'select', source: { dm: 'KTX.TCP0' } },
                { key: '_dt', type: 'checks', label: 'Loại đối tượng', span: true,
                  items: dtRows.map(function (d) { return { key: 'dt_' + d.ID, label: e(d.TEN) }; }) },
                { key: '_l4', type: 'legend', label: 'Mô tả' },
                { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true, placeholder: 'Nhập nội dung mô tả' }
            ],
            onForm: function (row, c) {
                st.apDungCu = [];
                if (!row) return;
                ums.api.call({ action: 'KTX_Phong_ApDung/LayDanhSach', method: 'GET', strTuKhoa: '', strKTX_Phong_Id: row.ID,
                    strPhanLoaiDoiTuong_Id: loc().dt, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000000, silent: true
                }).then(function (r) {
                    st.apDungCu = K.rows(r).map(function (x) { return x.PHANLOAIDOITUONG_ID; });
                    st.apDungCu.forEach(function (id) {
                        var ck = c.z('form').querySelector('[data-k="dt_' + id + '"]');
                        if (ck) ck.checked = true;
                    });
                }).catch(function (err) { ums.api.handle(err, 'loại đối tượng của phòng'); });
            },
            save: function (v, row) {
                var p = { action: 'KTX_Phong/' + (row ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                    strTen: v.strTen, strMa: v.strMa, strKTX_ToaNha_Id: v.strKTX_ToaNha_Id,
                    strDienTichSuDung: v.strDienTichSuDung || 0, strSoGiuong: v.strSoGiuong, strTangThu_Id: v.strTangThu_Id,
                    strLoaiPhong_Id: v.strLoaiPhong_Id, strTinhChat_Id: v.strTinhChat_Id, strTinhTrang_Id: v.strTinhTrang_Id,
                    strMoTa: v.strMoTa, dSoSinhVienToiDa: v.dSoSinhVienToiDa };
                st.apDungMoi = dtRows.filter(function (d) { return String(v['dt_' + d.ID]) === '1'; }).map(function (d) { return d.ID; });
                st.suaId = row ? row.ID : '';
                return p;
            },
            onSaved: function (c, result, isEdit) {
                var id = isEdit ? st.suaId : ((result.raw && result.raw.Id) || '');
                if (!id) return;
                var moi = st.apDungMoi || [], cu = st.apDungCu || [];
                var calls = [];
                moi.forEach(function (d) { if (cu.indexOf(d) < 0) calls.push({ action: 'KTX_Phong_ApDung/ThemMoi', method: 'POST', strId: '', strKTX_Phong_Id: id, strPhanLoaiDoiTuong_Id: d, silent: true }); });
                cu.forEach(function (d) { if (moi.indexOf(d) < 0) calls.push({ action: 'KTX_Phong_ApDung/Xoa', method: 'POST', strKTX_Phong_Id: id, strPhanLoaiDoiTuong_Id: d, silent: true }); });
                calls.reduce(function (p, call) { return p.then(function () { return ums.api.call(call); }); }, Promise.resolve())
                    .catch(function (err) { ums.api.handle(err, 'loại đối tượng của phòng'); });
                demPhong();
            },
            remove: function (ids) { return ids.map(function (id) { return { action: 'KTX_Phong/Xoa', method: 'POST', strIds: id }; }); },
            onRemoved: function () { demPhong(); },
            onLoad: function (rows, c) {
                var dt = 0, g = 0, n = 0;
                rows.forEach(function (r) { dt += parseFloat(r.DIENTICHSUDUNG) || 0; g += parseInt(r.SOGIUONG, 10) || 0; n += parseInt(r.SOSINHVIENTOIDA, 10) || 0; });
                var t = c.z('table');
                var tong = t.parentNode.querySelector('.ktx-tong');
                if (!tong) { tong = document.createElement('div'); tong.className = 'ktx-tong'; t.insertAdjacentElement('afterend', tong); }
                tong.innerHTML = '<span>Tổng cộng</span><span>Diện tích: <b>' + (Math.round(dt * 100) / 100) + '</b></span>' +
                    '<span>Số giường: <b>' + g + '</b></span><span>Số người: <b>' + n + '</b></span>';
                tong.hidden = !rows.length;
            }
        });
    }

    function moPhong(toaId, toaTen) {
        st.toaId = toaId; st.toaTen = toaTen;
        fToa.value = toaId;
        var tieuDe = toaId ? 'Danh sách phòng thuộc tòa nhà ' + toaTen : 'Kết quả tìm phòng';
        pDt.then(function (dtRows) {
            if (!phong) dungCrud(dtRows);
            if (!khungPhong) {
                khungPhong = pat.formTrang({
                    host: zMan, title: tieuDe, icon: 'fa-door-open', body: zPhong, flush: true,
                    onClose: function () { khungPhong = null; if (!phong.z('form').hidden) phong.showList(); demPhong(); }
                });
            } else {
                var t = khungPhong.el.querySelector('.ums-panel__title span');
                if (t) t.textContent = tieuDe;
                if (!phong.z('form').hidden) phong.showList();
            }
            phong.load(1);
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        var row = id ? st.toa.filter(function (r) { return r.ID === id; })[0] : null;
        if (a === 'tai') tai();
        else if (a === 'themtoa') moToa(null);
        else if (a === 'suatoa' && row) moToa(row);
        else if (a === 'xoatoa' && row) xoaToa(row);
    });

    tai();
})();
