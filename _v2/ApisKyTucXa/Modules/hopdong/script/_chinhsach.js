/* =========================================================================
   Chính sách hợp đồng (chinhsach) / Miễn giảm hợp đồng (miengiam) — khung chung
   Bản gốc: ApisKyTucXa/Modules/hopdong/html/chinhsach.html + script/chinhsach.js (313 dòng)
            ApisKyTucXa/Modules/hopdong/html/miengiam.html  + script/miengiam.js  (313 dòng)
   Hai tệp gốc giống nhau 100% sau khi đổi tên (diff chỉ khác khoảng trắng và tiêu đề)
   → một khung: ums.ktxChinhSach.mount(root, { loai: 'ChinhSach' | 'MienGiam' })
   Hai màn này KHÔNG có trên menu host (nhóm "Ngoài menu host").
   ---------------------------------------------------------------------------
   Hai cột như gốc: trái = ô tìm + "Danh sách đối tượng chính sách / miễn giảm" (họ tên người ở, từ
   LayDanhSach); phải = "Danh sách chính sách ưu đãi / các khoản miễn giảm" (Stt, Loại khoản, Chính sách |
   % miễn giảm, Đơn vị, Ngày áp dụng, Ngày hết hạn) + nút Thêm; thêm / sửa = biểu mẫu thay chỗ (ums.crud nhúng).

   Lời gọi (kiểu cũ, không mã hoá):
       KTX_HopDong_ChinhSach | KTX_HopDong_MienGiam
           LayDanhSach  GET  strTuKhoa, strDonViTinh_Id '', strTaiChinh_CacKhoanThu_Id '', strKTX_DoiTuongOKyTucXa_Id, strKTX_HopDong_Id '',
                             pageIndex 1, pageSize 10000
           ThemMoi | CapNhat  POST  strId, strKTX_HopDong_Id, dSoDienNuocDuocMien | dPhanTramMienGiam, strNgayBatDauApDung,
                             strNgayKetThucApDung, strTaiChinh_CacKhoanThu_Id, strDonViTinh_Id, strKTX_DoiTuongOKyTucXa_Id
           Xoa  POST strIds
       TC_KhoanThu/LayDanhSach  GET strNhomCacKhoanThu_Id 'KTX' (ô Loại khoản) · danh mục KTX.DVT0 (Đơn vị)

   Bản gốc là KHUNG CHƯA LÀM XONG: bảng bên phải không bao giờ được đổ; biểu mẫu Thêm chép từ màn "Thiết bị"
   (Tên / Mã / Phòng / Số lượng / Loại thiết bị / Tình trạng / Mô tả) và lưu với MỌI tham số đọc từ ô có id rỗng;
   khung chi tiết chép từ màn "Chức năng"; nút Sửa / Xoá không có xử lý; tìm kiếm không gửi. Làm theo ý định
   (ghi "Khác gốc"):
     · Cột trái gom theo người ở (một mục một người, từ các dòng LayDanhSach), gõ từ khoá → gửi strTuKhoa.
     · Chọn người → bảng bên phải là các dòng của người đó, Thêm / Sửa / Xoá qua ThemMoi / CapNhat / Xoa với đúng
       tham số của lưới trong màn hợp đồng (chuacohopdong); strKTX_HopDong_Id / strKTX_DoiTuongOKyTucXa_Id lấy từ dòng
       đã có của người đó (KTX_HOPDONG_ID / KTX_DOITUONGOKYTUCXA_ID).
     · chinhsach gốc gửi hệ số dưới tên dPhanTramChinhSach (rỗng) — bản mới gửi dSoDienNuocDuocMien như màn hợp đồng
       (cột trả về SODIENNUOCDUOCMIEN). CẦN CHỐT tên tham số với backend.
     · Tên loại khoản / đơn vị tra theo id từ hai danh sách trên (dòng trả về chỉ có TAICHINH_CACKHOANTHU_ID / DONVITINH_ID;
       có cột *_TEN thì dùng thẳng).
   Cố ý bỏ: toàn bộ ô biểu mẫu / khung chi tiết chép nhầm (txtChinhSach_Ten, dropChinhSach_Phong, lblChinhSach_Icon…),
   rewrite / reset / getDetail (gọi viewEdit_ChucNang không tồn tại), nút kính lúp bật box-sub-search không có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function hoTen(r) { return (e(r.KTX_DOITUONGOKYTUCXA_HODEM) + ' ' + e(r.KTX_DOITUONGOKYTUCXA_TEN)).trim(); }

    var K = ums.ktxChinhSach = ums.ktxChinhSach || {};
    var CFG = {
        ChinhSach: { ctrl: 'KTX_HopDong_ChinhSach', title: 'Chính sách hợp đồng', side: 'Danh sách đối tượng chính sách', main: 'Danh sách chính sách ưu đãi',
            form: 'chính sách ưu đãi', heSo: 'Chính sách', key: 'dSoDienNuocDuocMien', col: 'SODIENNUOCDUOCMIEN', icon: 'fa-gift' },
        MienGiam: { ctrl: 'KTX_HopDong_MienGiam', title: 'Miễn giảm hợp đồng', side: 'Danh sách đối tượng miễn giảm', main: 'Danh sách các khoản miễn giảm',
            form: 'khoản miễn giảm', heSo: '% miễn giảm', key: 'dPhanTramMienGiam', col: 'PHANTRAMMIENGIAM', icon: 'fa-percent' }
    };
    /* Lời gọi khoản thu KTX dùng chung với màn hợp đồng (_hopdong.js nạp trước) */
    var KT_CALL = ums.ktxHopDong.goiKhoanThu();

    K.mount = function (root, o) {
        var C = CFG[(o && o.loai) || 'ChinhSach'];
        var st = { rows: [], nguoi: [], chon: '', khoanThu: {}, donVi: {} };

        var m = pat.master({
            el: root, title: C.title,
            side: { title: C.side, icon: 'fa-hard-drive', search: 'Nhập từ khóa tìm kiếm' },
            main: { title: false }
        });
        ui.enhance(root);
        ums.api.call(KT_CALL).then(function (r) { arr(r.data).forEach(function (x) { st.khoanThu[x.ID] = x.TEN; }); }, function () {});
        ums.api.dm('KTX.DVT0').then(function (rows) { rows.forEach(function (x) { st.donVi[x.ID] = x.TEN; }); }, function () {});

        function goiDS(doiTuongId, tuKhoa) {
            return { action: C.ctrl + '/LayDanhSach', method: 'GET', strTuKhoa: tuKhoa || '', strDonViTinh_Id: '', strTaiChinh_CacKhoanThu_Id: '',
                strKTX_DoiTuongOKyTucXa_Id: doiTuongId || '', strKTX_HopDong_Id: '', pageIndex: 1, pageSize: 10000 };
        }
        function veDs() {
            m.sideCount.textContent = '(' + st.nguoi.length + ')';
            m.sideBody.innerHTML = st.nguoi.length ? st.nguoi.map(function (n) {
                return pat.masterItem({ id: n.id, text: n.ten, sub: n.ma, active: n.id === st.chon });
            }).join('') : ui.empty('Không có đối tượng nào', 'fa-inbox');
        }
        var token = 0;
        function tai() {
            var t = ++token;
            m.sideBody.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return ums.api.call(goiDS('', (m.search.value || '').trim())).then(function (r) {
                if (t !== token) return;
                st.rows = arr(r.data);
                var seen = {};
                st.nguoi = [];
                st.rows.forEach(function (x) {
                    var id = e(x.KTX_DOITUONGOKYTUCXA_ID);
                    if (!id || seen[id]) return;
                    seen[id] = 1;
                    st.nguoi.push({ id: id, ten: hoTen(x), ma: e(x.KTX_DOITUONGOKYTUCXA_MASO), hopDongId: e(x.KTX_HOPDONG_ID) });
                });
                veDs();
            }).catch(function (err) {
                if (t !== token) return;
                st.rows = []; st.nguoi = []; m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, C.side.toLowerCase());
            });
        }

        var main = m.mainBody;
        function nhac() {
            st.chon = '';
            main.innerHTML = pat.panel({ title: C.main, icon: 'fa-sun', body: ui.empty('Chọn một đối tượng ở cột trái để xem ' + C.form, C.icon) });
        }
        function moNguoi(n) {
            st.chon = n.id; veDs();
            main.innerHTML = '';
            ums.crud({
                root: main, embedded: true, icon: 'fa-sun',
                title: C.main + ' — ' + n.ten + (n.ma ? ' (' + n.ma + ')' : ''),
                formTitle: C.form, addText: 'Thêm',
                back: function () { nhac(); veDs(); },
                list: { call: function () { return goiDS(n.id, ''); } },
                columns: [
                    { title: 'Loại khoản', render: function (r) { return esc(e(r.TAICHINH_CACKHOANTHU_TEN) || st.khoanThu[r.TAICHINH_CACKHOANTHU_ID] || e(r.TAICHINH_CACKHOANTHU_ID)); } },
                    { title: C.heSo, prop: C.col, cls: 'is-center' },
                    { title: 'Đơn vị', render: function (r) { return esc(e(r.DONVITINH_TEN) || st.donVi[r.DONVITINH_ID] || e(r.DONVITINH_ID)); } },
                    { title: 'Ngày áp dụng', prop: 'NGAYBATDAUAPDUNG', cls: 'is-center is-nowrap' },
                    { title: 'Ngày hết hạn', prop: 'NGAYKETTHUCAPDUNG', cls: 'is-center is-nowrap' }
                ],
                fields: [
                    { key: 'strTaiChinh_CacKhoanThu_Id', col: 'TAICHINH_CACKHOANTHU_ID', label: 'Loại khoản', type: 'select', required: true,
                      source: { call: KT_CALL, id: 'ID', name: 'TEN' }, placeholder: 'Chọn khoản thu' },
                    { key: C.key, col: C.col, label: C.heSo, type: 'number', required: true },
                    { key: 'strDonViTinh_Id', col: 'DONVITINH_ID', label: 'Đơn vị', type: 'select', source: { dm: 'KTX.DVT0' }, placeholder: 'Chọn đơn vị' },
                    { key: '_gap', type: 'gap' },
                    { key: 'strNgayBatDauApDung', col: 'NGAYBATDAUAPDUNG', label: 'Ngày áp dụng', type: 'date' },
                    { key: 'strNgayKetThucApDung', col: 'NGAYKETTHUCAPDUNG', label: 'Ngày hết hạn', type: 'date' }
                ],
                save: function (v, row) {
                    var c = { action: C.ctrl + (row ? '/CapNhat' : '/ThemMoi'), method: 'POST', strId: row ? row.ID : '',
                        strKTX_HopDong_Id: row ? e(row.KTX_HOPDONG_ID) : n.hopDongId, strNgayBatDauApDung: v.strNgayBatDauApDung, strNgayKetThucApDung: v.strNgayKetThucApDung,
                        strTaiChinh_CacKhoanThu_Id: v.strTaiChinh_CacKhoanThu_Id, strDonViTinh_Id: v.strDonViTinh_Id, strKTX_DoiTuongOKyTucXa_Id: n.id, strNguoiThucHien_Id: uid() };
                    c[C.key] = v[C.key];
                    return c;
                },
                remove: function (ids) { return ids.map(function (id) { return { action: C.ctrl + '/Xoa', method: 'POST', strIds: id, strNguoiThucHien_Id: uid() }; }); }
            });
        }

        m.sideBody.addEventListener('click', function (ev) {
            var it = ev.target.closest('[data-id]');
            if (!it || !m.sideBody.contains(it)) return;
            var n = st.nguoi.filter(function (x) { return x.id === it.getAttribute('data-id'); })[0];
            if (n) moNguoi(n);
        });
        m.search.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });
        pat.cotTrai(m, { tai: tai });
        nhac();
        tai();
    };
})();
