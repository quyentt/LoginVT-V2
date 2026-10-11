/* =========================================================================
   Kế hoạch xét danh hiệu — vùng "Chỉnh sửa - Điều kiện" (#zoneDieuKien của gốc)
   Bản gốc: ApisDanhHieu/Modules/kehoach/script/kehoach.js
       getList_DieuKien · genTable_DieuKien · save_DieuKien · delete_DieuKien
   Chép cấu trúc vùng điều kiện của Học bổng (ApisHocBong/…/_kh_dieukien.js), đổi bộ lời gọi; Danh hiệu KHÔNG có
   hộp "Kế thừa theo nhóm" (gốc không có getList_KeThuaNhom).
   ---------------------------------------------------------------------------
   ums.dhKh.taoDieuKien(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên):
     HB_XepLoaiDanhHieu/LayDSXLDH_TieuChuan_Ad   GET  strTuKhoa '' · strPhanLoai_Id '' · strDanhHieu_Id '' (gốc đọc dropAAAA)
         · strPhamViApDung_Id = ID kế hoạch · strPhanCapApDung_Id '' · strDaoTao_ThoiGianDaoTao_Id '' · strNguoiThucHien_Id
         · pageIndex 1 · pageSize 100000 (gốc pageIndex/pageSize mặc định — chỉ thấy trang đầu, không có bộ phân trang)
         Cột: XEPLOAI_TEN · XAUDIEUKIEN (ô nhập nhiều dòng sửa ngay trong bảng, như gốc) · ô đánh dấu.
     HB_XepLoaiDanhHieu/Sua_XLDH_TieuChuan_AD    POST strId · strXauDieuKien · strNguoiThucHien_Id — mỗi ô ĐÃ ĐỔI một lời gọi
     HB_XepLoaiDanhHieu/Xoa_XLDH_TieuChuan_AD    POST strIds · strNguoiThucHien_Id — mỗi dòng đã đánh dấu một lời gọi

   Như gốc: Lưu chỉ gửi ô đã đổi (so với giá trị lúc nạp), hỏi lại "Bạn có chắc chắn lưu N dữ liệu không?".
   Khác gốc:
     · "Kế thừa mặc định từ điều kiện chuẩn" (#btnSave_KeThuaDieuKien) KHÔNG có xử lý nào trong kehoach.js → giữ nút, đặt disabled.
     · Xoá hỏi lại tone đỏ; chạy hàng loạt qua ums.ui.batch, xong nạp lại bảng MỘT lần (gốc nạp lại sau mỗi start_Progress).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var D = ums.dhKh, H = D.H, K = D.K, e = H.e, XL = D.XL;

    D.taoDieuKien = function (zone, o) {
        o = o || {};
        var khId = '', rows = [];

        zone.innerHTML = pat.panel({
            title: 'Chỉnh sửa - Điều kiện', icon: 'fa-pen-field',
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-z="kh"></div><div data-z="t"></div>',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.xoaChon('input[data-dkdh]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
                '<button type="button" class="ums-btn ums-btn--out-success" disabled title="Bản gốc không có xử lý cho nút này">' +
                    '<i class="fa-light fa-copy"></i><span>Kế thừa mặc định từ điều kiện chuẩn</span></button>' +
                ui.btn('save', { attr: { 'data-a': 'luu' } })
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        K.ganChon(zone);

        function tai() {
            var host = z('t');
            K.dang(host);
            return ums.api.call({
                action: XL + 'LayDSXLDH_TieuChuan_Ad', method: 'GET',
                strTuKhoa: '', strPhanLoai_Id: '', strDanhHieu_Id: '', strPhamViApDung_Id: khId,
                strPhanCapApDung_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiThucHien_Id: H.uid(), pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                rows = K.ds(r);
                ui.table({
                    el: host, rows: rows, empty: 'Chưa có điều kiện',
                    columns: [
                        { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center hbkh-xl' },
                        { title: 'Xâu điều kiện', render: function (x) {
                            return '<textarea class="ums-textarea hbkh-xau" rows="12" spellcheck="false" data-xau="' + esc(x.ID) + '">' + esc(e(x.XAUDIEUKIEN)) + '</textarea>';
                        } },
                        K.cotChon('dkdh')
                    ]
                });
            }).catch(function (err) { K.loi(host, err, 'điều kiện xét danh hiệu'); });
        }

        function luu() {
            var doi = [];
            K.qa(z('t'), 'textarea[data-xau]').forEach(function (t) {
                var r = K.tim(rows, t.getAttribute('data-xau'));
                if (r && t.value !== e(r.XAUDIEUKIEN)) doi.push({ id: r.ID, xau: t.value });
            });
            if (!doi.length) { ui.toast('Không có thay đổi để lưu', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { ok: 'Lưu', title: 'Lưu điều kiện' }).then(function (yes) {
                if (!yes) return;
                ui.batch(doi.map(function (x) {
                    return { action: XL + 'Sua_XLDH_TieuChuan_AD', method: 'POST', type: 'POST',
                        strId: x.id, strXauDieuKien: x.xau, strNguoiThucHien_Id: '' };
                }), { title: 'Đang lưu điều kiện', okText: 'Cập nhật thành công!', show: true }).then(tai);
            });
        }
        function xoa() {
            var ids = K.daChon(z('t'), 'dkdh');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: XL + 'Xoa_XLDH_TieuChuan_AD', method: 'POST', type: 'POST', strIds: id, strNguoiThucHien_Id: '' };
            }), tai);
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu': luu(); break;
                case 'xoa': xoa(); break;
            }
        });

        return {
            mo: function (kh) {
                khId = kh.ID;
                z('kh').textContent = e(kh.TEN) ? 'Kế hoạch: ' + e(kh.TEN) : '';
                tai();
            }
        };
    };
})();
