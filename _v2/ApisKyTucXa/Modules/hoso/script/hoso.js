/* =========================================================================
   Hồ sơ người ở (xem)
   Bản gốc: ApisKyTucXa/Modules/hoso/html/hoso.html + script/hoso.js (469 dòng)
   ---------------------------------------------------------------------------
   Bố cục gốc: HAI cột — trái (col-lg-3): ô từ khoá + "Danh sách người ở" (ảnh · họ tên · ngày sinh · nút xem, phân trang
   máy chủ); phải (col-lg-9): ba tab Hồ sơ / Tài chính / Hợp đồng — tab Hồ sơ gồm 1) Nhóm thông tin cơ bản, 2) Quyết định
   đào tạo, 3) Quyết định gia hạn; hai tab còn lại TRỐNG trong bản gốc. Ở đây: ums.pat.master + pat.cotTrai (gõ tự tìm).
   Lời gọi: KTX_DoiTuongOKyTucXa/LayDanhSach (strTuKhoa; dDoiTuongConDangOKTX 1; dBiKyLuat -1; các ô lọc khác gốc đọc
   id không có trên trang → rỗng; pageIndex / pageSize) · KTX_DoiTuongOKyTucXa/LayChiTiet (strId).
   Khác gốc (lỗi rõ):
     · Gốc đổ giá trị bằng viewHTMLById vào <input> (đặt innerHTML cho ô nhập) → KHÔNG hiện gì; nay hiện bằng khối
       chỉ đọc .ums-kv. Các cột gốc ghi "chưa trả về" (GIADINHCHINHSACH_TEN, THANHPHANXUATTHAN_TEN, NGU_NGAYNHAP,
       NGU_NGAYXUAT) vẫn đọc đúng tên cột đó — máy chủ chưa trả thì để trống.
   Cố ý bỏ: hai ô lọc Cơ cấu tổ chức / Bộ môn (id dropSearch_HSLL_* không khớp dropSearch_NOLL_* trong JS, hàm
   getList_CoCauToChuc không nơi nào gọi); ô Tải lên hồ sơ + nút Lưu túi hồ sơ (tab_tuihoso không có liên kết tab, nút
   không có xử lý); popover khi rê chuột (extend.popover_NhanSu); nhãn lblNO_TinhTrangNguoiO (không được đặt giá trị).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, esc = ui.esc, X = ums.ktxHoSo;
    var root = document.getElementById('ktx-hoso');
    if (!root) return;

    var m = pat.master({
        el: root, title: 'Hồ sơ người ở',
        side: { title: 'Danh sách người ở', icon: 'fa-list-ul', search: 'Nhập từ khóa tìm kiếm' },
        main: { title: 'Hồ sơ', icon: 'fa-clipboard' }
    });
    var pg = { index: 1, size: 10, total: 0 }, rows = [], dangChon = '';
    pg.onChange = function (p) { if (p < 1 || p > Math.ceil(pg.total / pg.size)) return; tai(p); };
    pg.onSize = function (s) { pg.size = s; tai(1); };
    pat.cotTrai(m, { tai: function () { tai(1); } });

    function tai(p) {
        pg.index = p || 1;
        ums.api.call(X.dsCall({ strTuKhoa: pat.val(m.search), dDoiTuongConDangOKTX: 1, dBiKyLuat: -1, pageIndex: pg.index, pageSize: pg.size })).then(function (d) {
            rows = X.arr(d.data); pg.total = Number(d.pager) || rows.length;
            m.sideBody.innerHTML = rows.length ? rows.map(function (r) {
                return '<button type="button" class="ums-master__item' + (r.ID === dangChon ? ' is-active' : '') + '" data-id="' + esc(r.ID) + '">' +
                    pat.anhNguoi(r.ANH) +
                    '<span class="ums-master__item__main">' + esc(X.hoTen(r)) + '</span>' +
                    '<span class="ums-master__item__sub">' + esc(X.ngaySinh(r)) + '</span></button>';
            }).join('') : ui.empty('Không có người ở');
            m.sideFoot.innerHTML = ui.pager(pg, rows.length); ui.pagerBind(m.sideFoot, pg);
            if (m.sideCount) m.sideCount.textContent = '(' + pg.total + ')';
        }, function (err) { m.sideBody.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách người ở'); });
    }
    m.mainBody.innerHTML = ui.empty('Chọn người ở bên trái để xem hồ sơ');

    m.sideBody.addEventListener('click', function (e) {
        var b = e.target.closest('.ums-master__item'); if (!b) return;
        dangChon = b.getAttribute('data-id');
        Array.prototype.forEach.call(m.sideBody.querySelectorAll('.ums-master__item'), function (x) { x.classList.toggle('is-active', x === b); });
        ums.api.call({ action: X.P + 'LayChiTiet', method: 'GET', strId: dangChon }).then(function (d) {
            var r = X.arr(d.data)[0];
            if (!r) { m.mainBody.innerHTML = ui.empty('Không tìm thấy hồ sơ'); return; }
            veHoSo(r);
        }, X.loi('chi tiết hồ sơ'));
    });

    var TABS = [{ key: 'tt', text: 'Hồ sơ', icon: 'fa-clipboard' }, { key: 'tc', text: 'Tài chính', icon: 'fa-list' }, { key: 'hd', text: 'Hợp đồng', icon: 'fa-repeat' }];
    function kv(nhan, v) { return '<div class="ums-kv ums-kv--thuong"><span>' + esc(nhan) + '</span><b>' + esc(X.e(v)) + '</b></div>'; }
    function veHoSo(r) {
        m.mainBody.innerHTML = ui.tabs(TABS, 'tt', 'data-ktab') +
            '<div data-pane="tt" class="ums-u-mt-4">' +
            '<div class="ums-legend">1) Nhóm thông tin cơ bản</div>' +
            '<div class="ums-grid ums-grid--12">' +
            '<div style="grid-column:span 2">' + (r.ANH ? '<div class="ums-avatar"><img alt="" src="' + esc(ums.files && ums.files.url ? ums.files.url(r.ANH) : r.ANH) + '"></div>'
                : '<div class="ums-avatar is-empty"><i class="fa-light fa-user ums-avatar__none"></i></div>') + '</div>' +
            '<div style="grid-column:span 10"><div class="ums-grid ums-grid--2">' +
            '<div class="ums-kv"><span>Họ và tên</span><b>' + esc(X.hoTen(r).toUpperCase()) + '</b></div>' + kv('Mã số', r.MASO) +
            kv('Ngày sinh', X.ngaySinh(r)) + kv('Giới tính', r.GIOITINH_TEN) +
            kv('Email', r.EMAIL_CANHAN) + kv('SĐT Cá nhân', r.SDT_CANHAN) +
            kv('Số căn cước', r.CANCUOC_SO) + kv('Số hộ chiếu', r.SOHOCHIEU) +
            kv('Hạn visa', r.THOIHANVISA) + kv('Địa chỉ liên hệ', r.DIACHILIENHE) +
            kv('Ghi chú', r.GHICHU) +
            '</div></div></div>' +
            '<div class="ums-legend ums-legend--cach">2) Quyết định đào tạo</div>' +
            '<div class="ums-grid ums-grid--2">' + kv('Số quyết định', r.GIADINHCHINHSACH_TEN) + kv('Ngày ký', r.THANHPHANXUATTHAN_TEN) +
            kv('Ngày đến', r.THOIGIANDEN) + kv('Ngày đi', r.THOIGIANDI) + '</div>' +
            '<div class="ums-legend ums-legend--cach">3) Quyết định gia hạn</div>' +
            '<div class="ums-grid ums-grid--2">' + kv('Số quyết định', r.NGU_NGAYNHAP) + kv('Ngày ký', r.NGU_NGAYXUAT) + '</div>' +
            '</div>' +
            '<div data-pane="tc" class="ums-u-mt-4" hidden>' + ui.empty('Bản gốc chưa có nội dung ở tab này') + '</div>' +
            '<div data-pane="hd" class="ums-u-mt-4" hidden>' + ui.empty('Bản gốc chưa có nội dung ở tab này') + '</div>';
    }
    m.mainBody.addEventListener('click', function (e) {
        var a = e.target.closest('[data-ktab]'); if (!a) return;
        var k = a.getAttribute('data-ktab');
        ui.tabsActive(m.mainBody, k, 'data-ktab');
        Array.prototype.forEach.call(m.mainBody.querySelectorAll('[data-pane]'), function (p) { p.hidden = p.getAttribute('data-pane') !== k; });
    });

    tai(1);
})();
