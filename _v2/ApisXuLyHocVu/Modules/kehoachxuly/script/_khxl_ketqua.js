/* =========================================================================
   Kế hoạch xử lý học vụ — hai vùng "Kết quả xử lý" (#zoneketqua) và "Danh sách xét" (#zoneDSXet)
   Bản gốc: ApisXuLyHocVu/Modules/kehoachxuly/script/kehoachxuly.js
       getList_KetQuaXuLy · genTable_KetQuaXuLy · delete_KetQuaXuLy · #btnXetKetQuaXuLy
       getList_DSXet · genTable_DSXet · #btnXetDSXet · save_KetQuaXuLy (ums.khxl.xet)
   ---------------------------------------------------------------------------
   ums.khxl.taoKetQua(zone, { onClose }) → { mo(dòng kế hoạch) }
   ums.khxl.taoDSXet(zone, { onClose })  → { mo(dòng kế hoạch) }

   Lời gọi (chép nguyên):
     XLHV_KetQuaXuLy/LayDanhSach   GET (kèm type=GET như gốc) — mọi ô lọc của gốc là ô không tồn tại
         (txtAAAA / dropAAAA) → gửi rỗng; strXLHV_KeHoachXuLy_Id = ID kế hoạch; pageIndex 1 · pageSize 100000.
         Dữ liệu ở Data.rsThongTinNguoiHoc.
     XLHV_KetQuaXuLy/Xoa           POST strId (mỗi dòng một lời gọi)
     XLHV_ThongTin_MH/… pkg_xulyhocvu_thongtin.LayDSXLHV_DanhSachKhongXuLy
         strTuKhoa (ô tìm) · strXLHV_KeHoachXuLy_Id · strNguoiTao_Id '' · pageIndex 1 · pageSize 10000
     XLHV_TinhToan/XuLyHocVuNguoiHoc — xem ums.khxl.xet (_khxl_chung.js)
   Cột: QLSV_NGUOIHOC_MASO · _HODEM · _TEN · DAOTAO_LOPQUANLY_TEN · DAOTAO_CHUONGTRINH_TEN (tiêu đề "Ngành")
        · DAOTAO_KHOADAOTAO_TEN · MUCXULY_TEN (chỉ bảng kết quả).

   Như gốc:
     · "Danh sách xét" mở ra CHƯA nạp (gốc chú thích bỏ lời gọi khi mở) — bấm Tìm kiếm mới nạp.
     · Ô tìm của "Kết quả xử lý" lọc ngay trên bảng (không gửi máy chủ).
     · Xét không hỏi lại.
   Khác gốc: xoá / xét xong nạp lại bảng đang xem một lần (gốc nạp lại cả hai bảng "Kết quả" và "Danh sách xét" sau MỖI
   lời gọi).
   Kéo gốc lần 12 (7/11): Xóa kết quả và Xét (ums.khxl.xet) chạy qua form tiến trình chung ums.process.run (cột Mã số / Họ tên /
   Lớp / Chương trình, dòng phụ "Kế hoạch xử lý: …", điều kiện Thời gian đào tạo qua o.dieuKien()), Bước 1 thay hộp hỏi lại;
   nút "Xuất Excel" ở hai vùng (gốc edu.exporter.attachTable tblKetQuaXuLy / tblDSXet) = ums.ui.xuatBang bảng đang xem.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var K = ums.khxl = ums.khxl || {};
    var e = K.e;

    function cotSV(k, coKetQua) {
        var c = [
            { title: 'Mã số', cls: 'is-nowrap', render: K.maSo },
            { title: 'Họ đệm', prop: 'QLSV_NGUOIHOC_HODEM' },
            { title: 'Tên', prop: 'QLSV_NGUOIHOC_TEN', cls: 'is-nowrap' },
            { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
            { title: 'Ngành', prop: 'DAOTAO_CHUONGTRINH_TEN' },
            { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' }
        ];
        if (coKetQua) c.push({ title: 'Kết quả', prop: 'MUCXULY_TEN' });
        c.push(K.cotChon(k));
        return c;
    }
    function tenKH(kh) { return e(kh.MA) ? '— ' + e(kh.MA) : ''; }

    /* ======================= Kết quả xử lý ================================ */
    function phu(o, khTen) { var l = khTen ? ['Kế hoạch xử lý: ' + khTen] : [], t = ums.process.dieuKien(o.dieuKien ? o.dieuKien() : []); if (t) l.push(t); return l; }
    K.taoKetQua = function (zone, o) {
        o = o || {};
        var khId = '', khTen = '', rows = [];
        zone.innerHTML = pat.panel({
            title: 'Kết quả xử lý', icon: 'fa-clipboard-check', count: 'kh',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.xoaChon('input[data-kq]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) +
                ui.btn('excel', { attr: { 'data-a': 'xuat' } }) +
                ui.btn('save', { text: 'Xét', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'xet' } }),
            body: '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div></div>' +
                '<div class="ums-u-mt-3" data-z="t"></div>'
        });
        var host = zone.querySelector('[data-z="t"]');
        var loc = K.locTaiCho(zone.querySelector('[data-f="q"]'), host);
        K.ganChon(zone);

        function tai() {
            K.dang(host);
            ums.api.call({
                action: 'XLHV_KetQuaXuLy/LayDanhSach', method: 'GET', type: 'GET',
                strTuKhoa: '', strChucNang_Id: '', strNamNhapHoc: '', strKhoaQuanLy_Id: '', strHeDaoTao_Id: '',
                strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '', strNguoiThucHien_Id: '',
                strNguoiDangNhap_Id: '', strTrangThaiNguoiHoc_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strXLHV_KeHoachXuLy_Id: khId, strLoaiXuLy_Id: '', strMucXuLy_Id: '', strTinhTrangXacNhan_Id: '',
                pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                var d = r.data || {};
                rows = Array.isArray(d.rsThongTinNguoiHoc) ? d.rsThongTinNguoiHoc : [];
                ui.table({ el: host, rows: rows, columns: cotSV('kq', true), empty: 'Chưa có kết quả xử lý' });
                loc();
            }).catch(function (err) { K.loi(host, err, 'kết quả xử lý'); });
        }
        function xoa() {
            var ids = K.daChon(host, 'kq');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ums.process.run({
                title: 'Xóa kết quả xử lý học vụ', unit: 'sinh viên', fileName: 'KetQuaXoaKetQuaXuLy', dieuKien: o.dieuKien ? o.dieuKien() : [],
                subTitles: khTen ? ['Kế hoạch xử lý: ' + khTen] : [], notes: ['Thao tác xóa dữ liệu kết quả xử lý của các sinh viên trong danh sách.'],
                items: ids.map(function (id) { return K.tim(rows, id); }).filter(Boolean), columns: K.colsSV(), okMessage: 'Xóa thành công!',
                request: function (r) { return { action: 'XLHV_KetQuaXuLy/Xoa', method: 'POST', type: 'POST', strId: r.ID, strNguoiThucHien_Id: '' }; },
                refresh: tai
            });
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'xoa': xoa(); break;
                case 'xuat': ui.xuatBang(host, { ten: 'KetQuaXuLyHocVu', tieuDe: 'KẾT QUẢ XỬ LÝ HỌC VỤ', phu: phu(o, khTen) }); break;
                case 'xet': K.xet(rows, K.daChon(host, 'kq'), tai, { tenKH: khTen, dieuKien: o.dieuKien ? o.dieuKien() : [] }); break;
                case 'hoctap': K.hocTap(b.getAttribute('data-nh'), b.getAttribute('data-ten')); break;
            }
        });

        return {
            mo: function (kh) {
                khId = kh.ID; khTen = e(kh.TEN) || e(kh.MA);
                zone.querySelector('[data-z="kh"]').textContent = tenKH(kh);
                zone.querySelector('[data-f="q"]').value = '';
                tai();
            }
        };
    };

    /* ======================= Danh sách xét ================================ */
    K.taoDSXet = function (zone, o) {
        o = o || {};
        var khId = '', khTen = '', rows = [];
        zone.innerHTML = pat.panel({
            title: 'Danh sách xét', icon: 'fa-users-viewfinder', count: 'kh',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('excel', { attr: { 'data-a': 'xuat' } }) +
                ui.btn('save', { text: 'Xét', mod: 'primary', icon: 'fa-paper-plane', attr: { 'data-a': 'xet' } }),
            body: '<div class="ums-filter">' +
                    '<div class="ums-field"><input class="ums-input" data-f="q" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'tim' } }) + '</div>' +
                '</div>' +
                '<div class="ums-u-mt-3" data-z="t"></div>'
        });
        var host = zone.querySelector('[data-z="t"]');
        var fq = zone.querySelector('[data-f="q"]');
        K.ganChon(zone);

        function tai() {
            K.dang(host);
            ums.api.call({
                action: K.TT + 'DSA4BRIZDQkXHgUgLykSICIpCikuLyYZNA04', func: K.P + 'LayDSXLHV_DanhSachKhongXuLy',
                strTuKhoa: (fq.value || '').trim(), strChucNang_Id: '', strXLHV_KeHoachXuLy_Id: khId, strNguoiTao_Id: '',
                pageIndex: 1, pageSize: 10000
            }).then(function (r) {
                rows = K.ds(r);
                ui.table({ el: host, rows: rows, columns: cotSV('xet', false), empty: 'Không có sinh viên' });
            }).catch(function (err) { K.loi(host, err, 'danh sách xét'); });
        }

        zone.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !zone.contains(b) || b.disabled) return;
            switch (b.getAttribute('data-a')) {
                case 'dong': if (o.onClose) o.onClose(); break;
                case 'tim': tai(); break;
                case 'xuat': ui.xuatBang(host, { ten: 'DanhSachXetXuLyHocVu', tieuDe: 'DANH SÁCH XÉT XỬ LÝ HỌC VỤ', phu: phu(o, khTen) }); break;
                case 'xet': K.xet(rows, K.daChon(host, 'xet'), tai, { tenKH: khTen, dieuKien: o.dieuKien ? o.dieuKien() : [] }); break;
                case 'hoctap': K.hocTap(b.getAttribute('data-nh'), b.getAttribute('data-ten')); break;
            }
        });
        fq.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tai(); } });

        return {
            mo: function (kh) {
                khId = kh.ID; khTen = e(kh.TEN) || e(kh.MA); rows = [];
                zone.querySelector('[data-z="kh"]').textContent = tenKH(kh);
                fq.value = '';
                host.innerHTML = ui.empty('Bấm "Tìm kiếm" để nạp danh sách sinh viên xét của kế hoạch này', 'fa-magnifying-glass');
            }
        };
    };
})();
