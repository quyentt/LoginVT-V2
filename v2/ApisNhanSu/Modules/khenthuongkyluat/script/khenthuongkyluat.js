/* =========================================================================
   Khen thưởng - Kỷ luật — bản QUẢN TRỊ (Nhân sự): chọn cán bộ rồi xem/sửa
   Bản gốc: ApisNhanSu/Modules/khenthuongkyluat/script/khenthuongkyluat.js
   ---------------------------------------------------------------------------
   Bản gốc hai cột: trái "Danh sách cán bộ" (ums.nsQT.man), phải một tab
   (không vẽ dải tab), hai khung:
       Quá trình khen thưởng   NS_QT_KhenThuong
       Quá trình kỷ luật       NS_QT_KyLuat   (thêm xong: ThietLapQuaTrinhCuoiCung NHANSU_QT_KYLU)
   LayDanhSach GET (strNhanSu_HoSoCanBo_Id = cán bộ đang chọn) · LayChiTiet GET ·
   ThemMoi | CapNhat · Xoa (strIds) · tệp NS_Files — TRÙNG bản Cổng cán bộ →
   dùng lại ums.ccbHS.khenthuongkyluat(P) (cờ P.ns: chia nhóm ô, Ngày QĐ không
   bắt buộc).

   Riêng Nhân sự — "Danh sách kèm theo" trong biểu mẫu khen thưởng:
     bảng thành viên (ảnh · họ tên - mã · xoá) + nút "Thêm thành viên"
     (edu.extend.genModal_NhanSu → ums.pat.pickNhanSu). THÊM MỚI gửi MỘT lời gọi
     NS_QT_KhenThuong/ThemMoi cho MỖI thành viên, strNhanSu_HoSoCanBo_Id = thành viên.

   Khác bản gốc (lỗi rõ ràng):
     · Sửa khen thưởng CHƯA TỪNG LƯU ĐƯỢC: save_KhenThuong có `return;` trước lời
       gọi CapNhat (chỉ nhánh thêm theo danh sách chạy). Ở đây Sửa gọi CapNhat
       cho đúng dòng đang sửa; khối "Danh sách kèm theo" chỉ hiện khi Thêm mới.
     · Thêm mới mà danh sách kèm theo TRỐNG thì bản gốc không gửi gì (im lặng).
       Ở đây danh sách mở sẵn với chính cán bộ đang chọn (gỡ được); trống thì
       báo "Chọn ít nhất một cán bộ".
     · strNhanSu_ThongTinQD_Id: bản gốc lấy me.strQuyetDinh_Id — KHÔNG đặt lại khi
       Thêm mới (mang id quyết định của dòng sửa trước đó). Ở đây Thêm gửi rỗng,
       Sửa gửi id của dòng (như Cổng cán bộ).
     · "Hình thức khen thưởng khác": bản gốc gửi strHinhThucKhenThuong rỗng dù ô
       hiện trên màn → gửi giá trị ô (như Cổng cán bộ).
     · Thêm theo danh sách: bản gốc không gọi ThietLapQuaTrinhCuoiCung (chỉ nhánh
       cũ đã chết gọi) — ở đây gọi một lần "NHANSU_QT_KHTT" sau khi thêm, như
       nhánh cũ và như Cổng cán bộ.
     · Tệp đính kèm: gắn vào bản ghi của thành viên ĐẦU TIÊN (bản gốc gọi
       saveFiles cho từng bản ghi) — ums.files chỉ gắn tệp chờ một lần.
     · Bản gốc chặn "Ngày ký quyết định không được lớn hơn ngày hiện tại" nhưng
       đọc ô txtNgayKy / txtKL_NgayKy không có trên màn → không bao giờ chặn. Bỏ.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, Q = ums.nsQT;
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function esc(s) { return ui.esc(s); }

    /* Khối "Danh sách kèm theo" gắn vào vùng extra của biểu mẫu khen thưởng */
    function danhSachKemTheo(extra, canBo) {
        var ds = canBo ? [canBo] : [];
        extra.innerHTML = pat.panel({
            title: 'Danh sách kèm theo', icon: 'fa-users', flush: true, zone: 'tv',
            tools: ui.btn('add', { text: 'Thêm thành viên', attr: { 'data-a': 'themtv' } })
        });
        var bang = extra.querySelector('[data-z="tv"]');
        function ve() {
            ui.table({
                el: bang, rows: ds, empty: 'Không tìm thấy dữ liệu!',
                columns: [
                    { title: 'Hình ảnh', cls: 'is-center', width: '64px', render: function (r) { return Q.anh(r.ANH); } },
                    { title: 'Họ tên', render: function (r) { return esc(e(r.HOTEN) || (e(r.HODEM) + ' ' + e(r.TEN))) + ' - ' + esc(e(r.MASO)); } },
                    { title: 'Xóa', cls: 'is-center', width: '64px', render: function (r) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-bo="' + esc(r.ID) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>'; } }
                ]
            });
        }
        extra.onclick = function (ev) {
            var b = ev.target.closest('[data-bo]');
            if (b) { var id = b.getAttribute('data-bo'); ds = ds.filter(function (x) { return x.ID !== id; }); ve(); return; }
            if (ev.target.closest('[data-a="themtv"]')) {
                pat.pickNhanSu({
                    title: 'Tìm kiếm cán bộ',
                    onPick: function (rows) {
                        var trung = 0;
                        rows.forEach(function (r) {
                            if (ds.some(function (x) { return x.ID === r.ID; })) trung++;
                            else ds.push(r);
                        });
                        if (trung) ui.toast(trung + ' cán bộ đã có trong danh sách', 'warn');
                        ve();
                    }
                });
            }
        };
        ve();
        return { ds: function () { return ds; } };
    }

    Q.man({
        el: document.getElementById('ns_khenthuongkyluat'),
        title: 'Khen thưởng - Kỷ luật',
        mo: function (host, cb, P) {
            var cfg = ums.ccbHS.khenthuongkyluat(P);
            var kt = cfg.tabs[0].sections[0];
            var kem = null, conLai = [];
            var onForm = kt.onForm, save = kt.save, onSaved = kt.onSaved;

            kt.onForm = function (row, crud, extra) {
                kem = null;
                extra.innerHTML = '';
                extra.onclick = null;
                if (!row) kem = danhSachKemTheo(extra, cb);
                if (onForm) onForm(row, crud, extra);
            };
            kt.save = function (v, row, crud) {
                var goc = save(v, row, crud);
                conLai = [];
                if (!goc || row || !kem) return goc;
                var ds = kem.ds();
                if (!ds.length) { ui.toast('Chọn ít nhất một cán bộ trong danh sách kèm theo', 'warn'); return null; }
                /* Thành viên đầu đi theo lời gọi của ums.crud (kèm tệp đính kèm); còn lại gửi sau */
                conLai = ds.slice(1).map(function (r) {
                    var x = {};
                    Object.keys(goc).forEach(function (k) { x[k] = goc[k]; });
                    x.strNhanSu_HoSoCanBo_Id = r.ID;
                    return x;
                });
                goc.strNhanSu_HoSoCanBo_Id = ds[0].ID;
                return goc;
            };
            kt.onSaved = function (crud, result, isEdit) {
                if (isEdit || !conLai.length) { if (onSaved) onSaved(crud, result, isEdit); return; }
                var calls = conLai; conLai = [];
                calls.reduce(function (p, c) {
                    return p.then(function () { return ums.api.call(c); });
                }, Promise.resolve()).then(function () {
                    ui.toast('Đã thêm cho ' + (calls.length + 1) + ' cán bộ', 'ok');
                }).catch(function (err) { ums.api.handle(err, 'thêm khen thưởng cho thành viên'); })
                  .then(function () { if (onSaved) onSaved(crud, result, isEdit); crud.load(); });
            };
            Q.sections(host, cfg);
        }
    });
})();
