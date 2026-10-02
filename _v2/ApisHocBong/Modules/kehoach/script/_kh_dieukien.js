/* =========================================================================
   Kế hoạch xét học bổng — vùng "Chỉnh sửa - Điều kiện" (#zoneDieuKien của gốc)
   Bản gốc: ApisHocBong/Modules/kehoach/script/kehoach.js
       getList_DieuKien · genTable_DieuKien · save_DieuKien · delete_DieuKien
       getList_KeThuaNhom · genTable_KeThuaNhom · save_KeThuaNhom + hộp #myModalKeThuaNhom
   ---------------------------------------------------------------------------
   ums.hbKh.taoDieuKien(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên):
     HB_XepLoai_DieuKien_Ad/LayDSHB_XepLoai_DieuKien_Ad   GET (kèm type=GET như gốc)
         strTuKhoa '' · strPhanLoai_Id '' · strXepLoai_Id '' · strPhamViApDung_Id = ID kế hoạch
         · strPhanCapApDung_Id '' · strDaoTao_ThoiGianDaoTao_Id '' · strNguoiTao_Id '' · pageIndex 1 · pageSize 100000
         Cột: XEPLOAI_TEN · XAUDIEUKIEN (ô nhập nhiều dòng sửa ngay trong bảng, như gốc) · ô đánh dấu.
     HB_XepLoai_DieuKien_Ad/Sua_HB_XepLoai_DieuKien_Ad    POST (type=POST) strId · strXauDieuKien — mỗi ô ĐÃ ĐỔI một lời gọi
     HB_XepLoai_DieuKien_Ad/Xoa_HB_XepLoai_DieuKien_Ad    POST (type=POST) strIds — mỗi dòng đã đánh dấu một lời gọi
     XLHV_HB_ThongTin_MH/… pkg_hocbong_thongtin.LayDSHB_PhamVi_ApDung   strHB_QuyHocBong_Id = ID KẾ HOẠCH (tên tham
         số gốc như vậy) — hộp "Kế thừa theo nhóm", cột TEN · MOTA
     XLHV_HB_ThongTin_MH/… pkg_hocbong_thongtin.KeThua_DieuKienXuLy_Ad  strPhamViNguon_Id (mỗi dòng chọn)
         · strPhamViDich_Id = ID kế hoạch

   Như gốc: Lưu chỉ gửi ô đã đổi (so với giá trị lúc nạp), hỏi lại "Bạn có chắc chắn lưu N dữ liệu không?".
   Khác gốc:
     · "Kế thừa mặc định từ điều kiện chuẩn" (#btnSave_KeThuaDieuKien) KHÔNG có xử lý nào trong kehoach.js →
       giữ nút, đặt disabled.
     · Xoá hỏi lại tone đỏ; hộp kế thừa: gốc đóng hộp rồi hỏi lại — ở đây hỏi lại, đồng ý mới đóng hộp và chạy.
     · Chạy hàng loạt qua ums.ui.batch, xong nạp lại bảng MỘT lần (gốc nạp lại sau mỗi start_Progress).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var H = ums.hbKh, K = H.K, e = H.e;
    var DK = 'HB_XepLoai_DieuKien_Ad/';

    H.taoDieuKien = function (zone, o) {
        o = o || {};
        var khId = '', rows = [];

        zone.innerHTML = pat.panel({
            title: 'Chỉnh sửa - Điều kiện', icon: 'fa-pen-field',
            body: '<div class="ums-u-fz13 ums-u-muted ums-u-mb-2" data-z="kh"></div><div data-z="t"></div>',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.xoaChon('input[data-dkhb]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
                ui.btn('search', { text: 'Kế thừa theo nhóm', mod: 'out-primary', icon: 'fa-copy', attr: { 'data-a': 'kethua-nhom' } }) +
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
                action: DK + 'LayDSHB_XepLoai_DieuKien_Ad', method: 'GET', type: 'GET',
                strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strPhamViApDung_Id: khId,
                strPhanCapApDung_Id: '', strDaoTao_ThoiGianDaoTao_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                rows = K.ds(r);
                ui.table({
                    el: host, rows: rows, empty: 'Chưa có điều kiện',
                    columns: [
                        { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center hbkh-xl' },
                        { title: 'Xâu điều kiện', render: function (x) {
                            return '<textarea class="ums-textarea hbkh-xau" rows="12" spellcheck="false" data-xau="' + esc(x.ID) + '">' + esc(e(x.XAUDIEUKIEN)) + '</textarea>';
                        } },
                        K.cotChon('dkhb')
                    ]
                });
            }).catch(function (err) { K.loi(host, err, 'điều kiện xét học bổng'); });
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
                    return { action: DK + 'Sua_HB_XepLoai_DieuKien_Ad', method: 'POST', type: 'POST',
                        strId: x.id, strXauDieuKien: x.xau, strNguoiThucHien_Id: '' };
                }), { title: 'Đang lưu điều kiện', okText: 'Cập nhật thành công!', show: true }).then(tai);
            });
        }
        function xoa() {
            var ids = K.daChon(z('t'), 'dkhb');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: DK + 'Xoa_HB_XepLoai_DieuKien_Ad', method: 'POST', type: 'POST', strIds: id, strNguoiThucHien_Id: '' };
            }), tai);
        }
        function keThuaNhom() {
            var dlg = ui.dialog({
                title: 'Danh sách', icon: 'fa-copy', size: 'lg', body: '<div data-z="ktn"></div>',
                buttons: [{ text: 'Kế thừa theo nhóm', kind: 'save', icon: 'fa-copy', onClick: function () {
                    var ids = K.daChon(dlg.body, 'ktnhb');
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                    ui.confirm('Bạn có muốn kế thừa không?', { ok: 'Kế thừa', title: 'Kế thừa theo nhóm' }).then(function (yes) {
                        if (!yes) return;
                        dlg.close();
                        ui.batch(ids.map(function (id) {
                            return { action: 'XLHV_HB_ThongTin_MH/CiQVKTQgHgUoJDQKKCQvGTQNOB4AJQPP', func: 'pkg_hocbong_thongtin.KeThua_DieuKienXuLy_Ad',
                                strPhamViNguon_Id: id, strPhamViDich_Id: khId, strNguoiThucHien_Id: '' };
                        }), { title: 'Đang kế thừa', okText: 'Thực hiện thành công', show: true }).then(tai);
                    });
                    return false;
                } }]
            });
            var host = dlg.body.querySelector('[data-z="ktn"]');
            K.ganChon(host);
            K.dang(host);
            ums.api.call({ action: 'XLHV_HB_ThongTin_MH/DSA4BRIJAx4RKSAsFygeADEFNC8m', func: 'pkg_hocbong_thongtin.LayDSHB_PhamVi_ApDung',
                strNguoiThucHien_Id: '', strHB_QuyHocBong_Id: khId })
                .then(function (r) {
                    ui.table({ el: host, rows: K.ds(r), empty: 'Không có dữ liệu', columns: [
                        { title: 'Tên', prop: 'TEN' },
                        { title: 'Mô tả', prop: 'MOTA' },
                        K.cotChon('ktnhb')
                    ] });
                }).catch(function (err) { K.loi(host, err, 'danh sách kế thừa theo nhóm'); });
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'luu': luu(); break;
                case 'xoa': xoa(); break;
                case 'kethua-nhom': keThuaNhom(); break;
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
