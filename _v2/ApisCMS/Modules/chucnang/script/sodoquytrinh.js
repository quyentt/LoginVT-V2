/* =========================================================================
   Sơ đồ quy trình (ApisCMS) — chuyển TỐI THIỂU
   Bản gốc: ApisCMS/Modules/chucnang/html/sodoquytrinh.html + script/sodoquytrinh.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (HAI cột): trái ô chọn ứng dụng + cây "Danh sách chức năng"
   (số lượng); phải khung "Thông tin chi tiết" với thân RỖNG (box-view trống).

   Lời gọi (kiểu cũ, GET, không func — chép nguyên):
       CMS_UngDung/LayDanhSach   strTuKhoa '', pageIndex 1, pageSize 1000, dTrangThai 1
       CMS_ChucNang/LayDanhSach  versionAPI v1.0, strTuKhoa '', strChung_UngDung_Id,
                                 strCha_Id '', pageIndex 1, pageSize 1000,
                                 strPhamViTruyCap_Id '', dTrangThai 1
   Lỗi bản gốc: bấm một nút cây gọi me.viewForm_ChucNang — hàm KHÔNG có trong
   SoDoQuyTrinh (chép từ chucnang.js mà bỏ sót) → TypeError, khung phải mãi trống.
   Màn chưa từng hiện được nội dung "sơ đồ" nào, nên bản mới chỉ dựng lại phần
   chạy được (chọn ứng dụng → cây) và báo ở khung phải rằng nghiệp vụ chưa có.
   Cố ý bỏ: genCombo_ChucNang / dropChucNang_UngDung (ô không tồn tại trên màn).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.cmsCN;
    var root = document.getElementById('cms-sodoquytrinh');
    if (!root || !C) return;

    var mst = pat.master({
        el: root,
        title: 'Sơ đồ quy trình',
        side: {
            title: 'Danh sách chức năng', kieu: 'danhmuc', search: false,
            filter: '<div class="ums-filter"><div class="ums-field"><select class="ums-select" data-a="ungdung" data-ph="Chọn ứng dụng">' +
                '<option value="">Chọn ứng dụng</option></select></div></div>'
        },
        main: { title: 'Thông tin chi tiết', icon: 'fa-circle-info' }
    });
    var elTree = mst.sideBody, elDem = mst.sideCount, elMain = mst.mainBody;
    var selApp = root.querySelector('[data-a="ungdung"]');
    var ds = [];

    function nhac() { elMain.innerHTML = ui.empty('Chọn ứng dụng, rồi chọn một chức năng ở cột trái', 'fa-hand-pointer'); }
    nhac();

    ums.api.call({
        action: 'CMS_UngDung/LayDanhSach', method: 'GET',
        strTuKhoa: '', pageIndex: 1, pageSize: 1000, dTrangThai: 1
    }).then(function (r) {
        C.fillUngDung(selApp, C.rows(r));
    }).catch(function (err) { ums.api.handle(err, 'CMS_UngDung/LayDanhSach'); });

    function napCay() {
        elTree.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'CMS_ChucNang/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: '', strChung_UngDung_Id: selApp.value, strCha_Id: '',
            pageIndex: 1, pageSize: 1000, strPhamViTruyCap_Id: '', dTrangThai: 1
        }).then(function (r) {
            ds = C.rows(r);
            elDem.textContent = String(r.pager || ds.length);
            C.cay(elTree, ds, '');
            nhac();
        }).catch(function (err) {
            elTree.innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'CMS_ChucNang/LayDanhSach');
        });
    }

    jQuery(selApp).on('select2:select', function () {
        if (selApp.value) napCay();
        else ui.toast('Vui lòng chọn ứng dụng!', 'warn');
    });
    jQuery(selApp).on('select2:clear', function () {
        ds = []; elTree.innerHTML = ''; elDem.textContent = ''; nhac();
    });

    elTree.addEventListener('click', function (ev) {
        var b = ev.target.closest('.cn-node');
        if (!b) return;
        var id = b.getAttribute('data-id');
        var row = ds.filter(function (x) { return x.ID === id; })[0];
        if (!row) return;
        C.chon(elTree, id);
        elMain.innerHTML = '<div class="ums-kv"><span>Chức năng</span><b>' + ui.esc(row.TENCHUCNANG) + '</b></div>' +
            ui.empty('Bản gốc chưa dựng nội dung sơ đồ quy trình cho chức năng — đang chờ nghiệp vụ mô tả.', 'fa-diagram-project');
    });

    ui.enhance(root);
})();
