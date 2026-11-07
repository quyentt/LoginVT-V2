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
     · Kéo gốc lần 12–13 (7/11): Lưu (chỉ ô đã đổi) / Xóa / Kế thừa theo nhóm chạy qua form tiến trình chung ums.process.run
       (gốc edu.process.run — mỗi điều kiện / nhóm một bản ghi, cột Xếp loại hoặc Tên / Mô tả, dòng điều kiện Quỹ · Thời gian
       của thanh lọc qua o.dieuKien()), Bước 1 thay hộp hỏi lại; xong nạp lại bảng MỘT lần.
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
        function dk() { return o.dieuKien ? o.dieuKien() : []; }
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
            ums.process.run({
                title: 'Lưu điều kiện xét học bổng', unit: 'điều kiện', fileName: 'KetQuaLuuDieuKien', dieuKien: dk(), items: doi,
                columns: [{ header: 'Xếp loại', render: function (x) { var r = K.tim(rows, x.id); return r && r.XEPLOAI_TEN ? r.XEPLOAI_TEN : x.id; } }],
                okMessage: 'Cập nhật thành công!',
                request: function (x) {
                    return { action: DK + 'Sua_HB_XepLoai_DieuKien_Ad', method: 'POST', type: 'POST', strId: x.id, strXauDieuKien: x.xau, strNguoiThucHien_Id: '' };
                },
                refresh: tai
            });
        }
        function xoa() {
            var ids = K.daChon(z('t'), 'dkhb');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ums.process.run({
                title: 'Xóa điều kiện xét học bổng', unit: 'điều kiện', fileName: 'KetQuaXoaDieuKien', dieuKien: dk(),
                notes: ['Thao tác xóa dữ liệu các điều kiện trong danh sách.'],
                items: ids.map(function (id) { return K.tim(rows, id); }).filter(Boolean),
                columns: [{ header: 'Xếp loại', render: function (r) { return r.XEPLOAI_TEN || r.ID; } }],
                okMessage: 'Xóa thành công!',
                request: function (r) { return { action: DK + 'Xoa_HB_XepLoai_DieuKien_Ad', method: 'POST', type: 'POST', strIds: r.ID, strNguoiThucHien_Id: '' }; },
                refresh: tai
            });
        }
        function keThuaNhom() {
            var ktn = [];
            var dlg = ui.dialog({
                title: 'Danh sách', icon: 'fa-copy', size: 'lg', body: '<div data-z="ktn"></div>',
                buttons: [{ text: 'Kế thừa theo nhóm', kind: 'save', icon: 'fa-copy', onClick: function () {
                    var ids = K.daChon(dlg.body, 'ktnhb');
                    if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return false; }
                    dlg.close();   // gốc hideModal rồi mở form tiến trình
                    ums.process.run({
                        title: 'Kế thừa điều kiện xét theo nhóm', unit: 'nhóm', fileName: 'KetQuaKeThuaNhom', dieuKien: dk(),
                        items: ids.map(function (id) { return K.tim(ktn, id); }).filter(Boolean),
                        columns: [{ header: 'Tên', render: function (r) { return e(r.TEN); } }, { header: 'Mô tả', render: function (r) { return e(r.MOTA); } }],
                        okMessage: 'Thực hiện thành công',
                        request: function (r) {
                            return { action: 'XLHV_HB_ThongTin_MH/CiQVKTQgHgUoJDQKKCQvGTQNOB4AJQPP', func: 'pkg_hocbong_thongtin.KeThua_DieuKienXuLy_Ad',
                                strPhamViNguon_Id: r.ID, strPhamViDich_Id: khId, strNguoiThucHien_Id: '' };
                        },
                        refresh: tai
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
                    ktn = K.ds(r);
                    ui.table({ el: host, rows: ktn, empty: 'Không có dữ liệu', columns: [
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
