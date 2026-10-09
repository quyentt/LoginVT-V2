/* =========================================================================
   Trang chủ — "Quick action": chức năng thường dùng (yêu thích) của người dùng (ApisNhanSu)
   Bản gốc: ApisNhanSu/Modules/dashboard/html/trangchu.html + script/trangchu.js (+ script/customs.js)
   ---------------------------------------------------------------------------
   Bố cục bản gốc: "Chào mừng bạn" · "Quick action" · lưới ô chức năng yêu thích, mỗi ô có nút tim "Bỏ yêu thích".
   Khối "For you today" gốc để display:none (thẻ mẫu viết cứng) → không vẽ.
   Lời gọi (kiểu cũ — chép nguyên):
     CMS_NguoiDung/LayDSChucNangThuongDung  GET  strNguoiThucHien_Id, strChung_UngDung_Id '', strChung_ChucNang_Cha_Id ''
         (hai ô dropAAAA không tồn tại) → ID, TENCHUCNANG, TENANH, CHUNG_UNGDUNG_ID, CHUNG_UNGDUNG_MA
     CMS_NguoiDung/Xoa_ChucNang_ThuongDung  POST strChucNang_Id, strNguoiDung_Id, strNguoiThucHien_Id → nạp lại
   Bấm ô → edu.system.initMain với appId = CHUNG_UNGDUNG_ID → bản mới chuyển sang #/r/<CHUNG_UNGDUNG_ID>/<ID>.
   Khác gốc: danh sách rỗng thì gốc bấm hộ nút "#menuChucNang" (mở menu của vỏ cũ) → bản mới hiện câu dẫn;
     màu ô ngẫu nhiên → xoay vòng cố định. Cố ý bỏ: getList_TinTuc / getList_CauHinhTuKhoa (không nơi nào gọi,
     vùng #zonetintuc / #dashboad_about không có trong html); customs.js (mã giao diện của vỏ cũ — menu, đổi màu,
     tải ảnh — không thuộc màn này).
   ========================================================================= */
(function () {
    'use strict';
    var root = document.getElementById('ns-trangchu');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var TONE = ['blue', 'green', 'purple', 'amber', 'red', 'slate'];

    root.innerHTML = '<p class="nsdb-chao">Chào mừng bạn</p>' + pat.page('Quick action') +
        '<div data-z="luoi">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>';
    var host = root.querySelector('[data-z="luoi"]');

    function nap() {
        return ums.api.call({ action: 'CMS_NguoiDung/LayDSChucNangThuongDung', method: 'GET',
            strNguoiThucHien_Id: uid(), strChung_UngDung_Id: '', strChung_ChucNang_Cha_Id: '' }).then(function (r) {
            var ds = Array.isArray(r.data) ? r.data : (r.data && r.data.rs) || [];
            host.innerHTML = ds.length ? '<div class="ums-grid ums-grid--tiles">' + ds.map(function (c, i) {
                return '<div class="nsdb-cn">' +
                    '<button type="button" class="ums-iconbtn nsdb-cn__tim" data-bo="' + ui.esc(c.ID) + '" title="Bỏ yêu thích"><i class="fa-solid fa-heart"></i></button>' +
                    ui.tile({ name: e(c.TENCHUCNANG), icon: (ums.iconFA4 ? ums.iconFA4(e(c.TENANH)) : e(c.TENANH)) || 'fa-light fa-grid-2', tone: TONE[i % TONE.length],
                        href: '#/r/' + encodeURIComponent(e(c.CHUNG_UNGDUNG_ID)) + '/' + encodeURIComponent(e(c.ID)) }) +
                    '</div>';
            }).join('') + '</div>' : ui.empty('Chưa có chức năng yêu thích — mở "Modul" và bấm biểu tượng tim để thêm', 'fa-heart');
        }).catch(function (err) { host.innerHTML = ''; ums.api.handle(err, 'CMS_NguoiDung/LayDSChucNangThuongDung'); });
    }
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-bo]');
        if (!b || !root.contains(b)) return;
        ums.api.call({ action: 'CMS_NguoiDung/Xoa_ChucNang_ThuongDung', strChucNang_Id: b.getAttribute('data-bo'), strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid() })
            .then(nap).catch(function (err) { ums.api.handle(err, 'CMS_NguoiDung/Xoa_ChucNang_ThuongDung'); });
    });
    nap();
})();
