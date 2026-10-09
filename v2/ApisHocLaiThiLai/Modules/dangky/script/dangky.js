/* =========================================================================
   Đăng ký học lại thi lại
   Bản gốc: ApisHocLaiThiLai/Modules/dangky/html/dangky.html + script/dangky.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm kiếm (Hệ · Khoá · CT · Lớp / Học kỳ · Khoa QL ·
   Đánh giá · Trạng thái đăng ký / từ khoá · Tìm kiếm / Học phần · "Xem học phần" /
   trạng thái sinh viên) → khung "Danh sách" (ẩn tới khi Tìm kiếm, nút × để đóng) có
   nút "Đăng ký" và bảng sinh viên (cột Kết quả + cột ô đánh dấu) → hộp "Đăng ký"
   (Nội dung · nút theo từng tình trạng đăng ký · Lịch sử).
   Thanh lọc dùng chung: ums.hltl.boLoc (lapdanhsach/script/_hltl.js).

   Lời gọi (chép nguyên):
       HLTL_ThongTinChung/LayDSHocPhanHocLaiThiLai  GET  nút "Xem học phần" → ô Học phần
            ("MA - TEN"); strTuKhoa = '' (gốc đọc txtAAAA).
       HLTL_ThongTinChung/LayDSNguoiHocHocLaiThiLai GET  Tìm kiếm, phân trang MÁY CHỦ
            (pageIndex/pageSize như pageIndex_default/pageSize_default gốc) → Data.rs;
            strDaoTao_HocPhan_Id = ô Học phần, strTinhTrangXacNhan_Id = '' (gốc đọc dropAAAA).
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM  QLHLTL.TINHTRANGDANGKY, sắp theo HESO1
            → một nút cho mỗi tình trạng trong hộp "Đăng ký" (loadBtnXacNhan gốc).
       HLTL_XacNhanDangKy/LayDanhSach GET  bảng Lịch sử của hộp (strsanpham_Id = '' như gốc,
            strTuKhoa / strTinhTrang_Id = '' — gốc đọc txtAAAA / dropAAAA; pageSize 10000000).
       HLTL_XacNhanDangKy/ThemMoi     POST MỘT lời gọi cho mỗi sinh viên đã đánh dấu:
            strId '' · strSanPham_Id = ID dòng · strNoiDung · strTinhTrang_Id · strNguoiXacnhan_Id.

   Khác gốc (đổi cách dựng, dữ liệu gửi đi giữ nguyên):
     · Lưu hàng loạt qua ums.ui.batch rồi nạp lại trang đang xem. Gốc bắn N lời gọi cùng lúc
       và nạp lại sau setTimeout(arrChecked_Id * 50) = NaN ms, tức nạp NGAY — thường trước khi
       lưu xong nên danh sách chưa đổi.
     · Mỗi lần mở hộp ô Nội dung để trống (gốc giữ chữ của lần trước).

   Cố ý bỏ (mã chết — không nút / ô nào dùng tới):
     · LayKQNguoiHocHocLaiThiLai (getList_KetQua không nơi nào gọi), TC_DoiTuong_MienGiam/ThemMoi
       · /Xoa (save_KetQua / delete_KetQua chép từ màn Tài chính, không có nút),
       D_HangDoi/TaoHangDoi_LapDSHLTL_TuDong (không có nút "Thực hiện xử lý" ở màn này).
     · Nút "Đăng ký" thứ hai (khối .btn-show đặt display:none !important trong html gốc).
     · Ba nút mẫu "Đóng" (id trùng btnClose_HDBL) trong vùng nút xác nhận — loadBtnXacNhan
       vẽ đè ngay khi mở màn.
     · Chung ba màn: xem đầu tệp _hltl.js.
   Giữ như gốc (nghi ngờ, ghi can-quyet): ô "Trạng thái đăng ký" có trên thanh lọc nhưng
   KHÔNG gửi đi (strTinhTrangXacNhan_Id gốc đọc dropAAAA).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.hltl, esc = ui.esc;
    var root = document.getElementById('hltl-dangky');
    if (!root) return;

    root.innerHTML = pat.page('Đăng ký học lại thi lại', '') +
        '<div data-z="loc"></div>' +
        H.khungDS({ icon: 'fa-list-timeline',
            tools: ui.btn('confirm', { text: 'Đăng ký', mod: 'primary', attr: { 'data-a': 'dangky' } }) });
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    var loc = H.boLoc(z('loc'), {
        khoaQL: 'khct', trangThaiDK: true,
        hocPhan: {
            nut: 'Xem học phần',
            ten: function (r) { return H.e(r.MA) + ' - ' + H.e(r.TEN); },
            call: function (p) {
                return Object.assign({ action: H.AC + 'LayDSHocPhanHocLaiThiLai', method: 'GET' }, p,
                    { strTuKhoa: '', strNguoiThucHien_Id: H.uid() });
            }
        }
    });

    var st = { p: null, index: 1, size: 10, rows: [] };

    function cot() {
        return H.cotSV().concat([
            { title: 'Kết quả', prop: 'KETQUAXACNHAN_TEN' },
            { head: '<input type="checkbox" data-hlall title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r) { return '<input type="checkbox" data-hl value="' + esc(r.ID) + '">'; } }
        ]);
    }

    function nap(index) {
        st.index = index || 1;
        z('kq').hidden = false;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call(Object.assign({ action: H.AC + 'LayDSNguoiHocHocLaiThiLai', method: 'GET' }, st.p, {
            strDaoTao_HocPhan_Id: st.hp, strTinhTrangXacNhan_Id: '', strNguoiThucHien_Id: H.uid(),
            pageIndex: st.index, pageSize: st.size }))
            .then(function (r) {
                var d = r.data || {};
                st.rows = H.arr(d.rs);
                z('n').textContent = '(' + (r.pager || st.rows.length) + ')';
                ui.table({ el: z('bang'), rows: st.rows, columns: cot(), empty: 'Không có dữ liệu',
                    page: { index: st.index, size: st.size, total: r.pager || st.rows.length,
                        onChange: nap, onSize: function (v) { st.size = v; nap(1); } } });
            })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đăng ký'); });
    }
    function tim() { st.p = loc.thamSo(); st.hp = loc.hocPhan(); nap(1); }

    function chon() {
        return Array.prototype.slice.call(z('bang').querySelectorAll('tbody input[data-hl]:checked')).map(function (x) { return x.value; });
    }

    /* ---------- Hộp "Đăng ký" (#modal_XacNhan) ---------- */
    function hopDangKy(ids) {
        var dlg = ui.dialog({
            title: 'Đăng ký', icon: 'fa-pen-field', size: 'lg',
            body:
                '<div class="ums-legend">Nội dung</div>' +
                '<input class="ums-input" data-f="nd" autocomplete="off">' +
                '<div class="ums-legend ums-legend--cach">Chọn loại đăng ký</div>' +
                '<div class="ums-row" data-f="nut"></div>' +
                '<div class="ums-legend ums-legend--cach">Lịch sử</div>' +
                '<div data-f="ls"></div>'
        });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-f="' + k + '"]'); }

        f('nut').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.dm('QLHLTL.TINHTRANGDANGKY', 'HESO1').then(function (ds) {
            f('nut').innerHTML = ds.length ? ds.map(function (x, i) {
                return ui.btn('confirm', { text: H.e(x.TEN), mod: 'out-primary', attr: { 'data-xn': i } });
            }).join('') : ui.empty('Chưa khai tình trạng đăng ký (QLHLTL.TINHTRANGDANGKY)');
            f('nut').addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-xn]');
                if (!b) return;
                var tt = ds[Number(b.getAttribute('data-xn'))];
                var nd = (f('nd').value || '').trim();
                dlg.close();
                ui.batch(ids.map(function (id) {
                    return { action: 'HLTL_XacNhanDangKy/ThemMoi', strId: '', strSanPham_Id: id, strNoiDung: nd,
                        strTinhTrang_Id: tt.ID, strNguoiXacnhan_Id: H.uid() };
                }), { title: 'Đang đăng ký', okText: 'Xác nhận thành công' }).then(function () { nap(st.index); });
            });
        }).catch(function (err) { f('nut').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tình trạng đăng ký'); });

        f('ls').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'HLTL_XacNhanDangKy/LayDanhSach', method: 'GET',
            strTuKhoa: '', strNguoiThucHien_Id: H.uid(), strsanpham_Id: '', strTinhTrang_Id: '',
            pageIndex: 1, pageSize: 10000000 })
            .then(function (r) {
                ui.table({ el: f('ls'), rows: H.arr(r.data), empty: 'Chưa có lịch sử', columns: [
                    { title: 'Xác nhận', prop: 'TINHTRANG_TEN' },
                    { title: 'Nội dung', prop: 'NOIDUNG' },
                    { title: 'Người xác nhận', prop: 'NGUOIXACNHAN_TENDAYDU' },
                    { title: 'Ngày', prop: 'NGAYTAO_DD_MM_YYYY', cls: 'is-center is-nowrap', width: '100px' }
                ] });
            })
            .catch(function (err) { f('ls').innerHTML = ui.fail(err.message); ums.api.handle(err, 'lịch sử đăng ký'); });
    }

    root.addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.hasAttribute && t.hasAttribute('data-hlall')) {
            z('bang').querySelectorAll('tbody input[data-hl]').forEach(function (x) { x.checked = t.checked; });
        }
    });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'dong') z('kq').hidden = true;
        else if (a === 'dangky') {
            var ids = chon();
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
            hopDangKy(ids);
        }
    });
    loc.f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
