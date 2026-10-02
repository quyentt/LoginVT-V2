/* =========================================================================
   Kế hoạch công nhận điểm — vùng "Phân nhân sự" (#zoneDSNhanSu của gốc, nút "Phân công")
   Bản gốc: ApisQuanLyDiem/Modules/kehoach/script/kehoach.js
       getList_PhanCong (bản CUỐI tệp — bản đầu cùng tên bị ghi đè) · save_PhanCong · delete_PhanCong
       · genTable_PhanCong · #btnAdd_PhanCong (edu.extend.genModal_NguoiDung) · #btnDelete_PhanCong
   ---------------------------------------------------------------------------
   ums.qldKh.taoPhanCong(zone, { onClose }) → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên):
     SV_CND_ThongTin_MH/DSA4BRIFKCQsHgokCS4gIikeDykgLxI0  pkg_congthongtin_cnd_thongtin.LayDSDiem_KeHoach_NhanSu
         strDiem_KeHoach_NhanSu_Id = ID kế hoạch (tên tham số như gốc)
     SV_CND_ThongTin_MH/FSkkLB4FKCQsHgokCS4gIikeDykgLxI0  …Them_Diem_KeHoach_NhanSu
         strDiem_KeHoach_NhanSu_Id = ID kế hoạch · strNguoiDung_Id · strNgayBatDau · strNgayKetThuc (hai ô ngày)
     SV_CND_ThongTin_MH/GS4gHgUoJCweCiQJLiAiKR4PKSAvEjQP  …Xoa_Diem_KeHoach_NhanSu   strId = ID dòng
   Hộp chọn người dùng: ums.tlKh.pickNguoiDung (nạp chéo ApisDangKyHoc/Modules/thilai/script/_chung.js —
   pkg_chung_quanlynguoidung.LayDanhSachNguoiDung, thay genModal_NguoiDung + getList_NguoiDungP).
   Cột: NGUOIDUNG_TAIKHOAN · NGUOIDUNG_TENDAYDU · DONVI · NGAYBATDAU · NGAYKETTHUC.
   Khác gốc: nút Xóa chuyển từ dải riêng dưới bảng lên đầu khung (ums.ui.xoaChon); thêm / xoá chạy
   qua ums.ui.batch rồi nạp lại một lần.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var Q = ums.qldKh, K = Q.K;
    var P = 'pkg_congthongtin_cnd_thongtin.';

    Q.taoPhanCong = function (zone, o) {
        o = o || {};
        var khId = '';
        zone.innerHTML = pat.panel({
            title: 'Danh sách', icon: 'fa-user-tie', count: 'n',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.xoaChon('input[data-pc]', { sm: true, goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) +
                ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'them' } }),
            body: '<div class="ums-grid ums-grid--2 qldkh-pc-ngay">' +
                    ui.field('Từ ngày', '<input class="ums-input" data-k="tu" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                    ui.field('Đến ngày', '<input class="ums-input" data-k="den" data-date placeholder="dd/mm/yyyy" autocomplete="off">') +
                '</div><div class="ums-u-mt-4" data-z="t"></div>'
        });
        function z(x) { return zone.querySelector('[data-z="' + x + '"]'); }
        function k(x) { return zone.querySelector('[data-k="' + x + '"]'); }
        ui.enhance(zone);
        K.ganChon(zone);

        function tai() {
            var host = z('t');
            K.dang(host);
            ums.api.call({
                action: Q.CND + 'DSA4BRIFKCQsHgokCS4gIikeDykgLxI0', func: P + 'LayDSDiem_KeHoach_NhanSu',
                strDiem_KeHoach_NhanSu_Id: khId, strNguoiThucHien_Id: ''
            }).then(function (r) {
                var rows = K.ds(r);
                z('n').textContent = '(' + rows.length + ')';
                ui.table({
                    el: host, rows: rows, empty: 'Chưa phân công nhân sự',
                    columns: [
                        { title: 'Mã số', prop: 'NGUOIDUNG_TAIKHOAN', cls: 'is-nowrap' },
                        { title: 'Họ tên', prop: 'NGUOIDUNG_TENDAYDU' },
                        { title: 'Đơn vị', prop: 'DONVI' },
                        { title: 'Ngày bắt đầu', prop: 'NGAYBATDAU', cls: 'is-center is-nowrap' },
                        { title: 'Ngày kết thúc', prop: 'NGAYKETTHUC', cls: 'is-center is-nowrap' },
                        K.cotChon('pc')
                    ]
                });
            }).catch(function (err) { K.loi(host, err, 'phân công'); });
        }
        function them() {
            ums.tlKh.pickNguoiDung(function (ids) {
                var tu = k('tu').value, den = k('den').value;
                ui.batch(ids.map(function (id) {
                    return { action: Q.CND + 'FSkkLB4FKCQsHgokCS4gIikeDykgLxI0', func: P + 'Them_Diem_KeHoach_NhanSu',
                        strDiem_KeHoach_NhanSu_Id: khId, strNguoiDung_Id: id, strNgayBatDau: tu, strNgayKetThuc: den, strNguoiThucHien_Id: '' };
                }), { title: 'Đang phân công', okText: 'Thực hiện thành công', show: true }).then(tai);
            });
        }
        function xoa() {
            var ids = K.daChon(z('t'), 'pc');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            K.xoa(ids.map(function (id) {
                return { action: Q.CND + 'GS4gHgUoJCweCiQJLiAiKR4PKSAvEjQP', func: P + 'Xoa_Diem_KeHoach_NhanSu', strId: id, strNguoiThucHien_Id: '' };
            }), tai);
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'them': them(); break;
                case 'xoa': xoa(); break;
            }
        });

        return {
            mo: function (kh) {
                khId = kh.ID;
                Q.datGiaTri(k('tu'), ''); Q.datGiaTri(k('den'), '');
                tai();
            }
        };
    };
})();
