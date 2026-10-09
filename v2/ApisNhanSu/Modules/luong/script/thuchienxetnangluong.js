/* =========================================================================
   Thực hiện xét nâng lương — "BẢNG XÉT NÂNG LƯƠNG"
   Bản gốc: ApisNhanSu/Modules/luong/script/thuchienxetnangluong.js
   ---------------------------------------------------------------------------
   MỘT CỘT như bản gốc: thanh lọc (Kế hoạch xét lương + Xem; Đơn vị, Thành
   viên + Xét nâng lương, Xuất báo cáo) → bảng xét nâng lương, tiêu đề là cây
   thành phần (THANHPHAN_ID / THANHPHAN_CHA_ID / THANHPHAN_TEN — thành phần
   không có con là một CỘT, tổ tiên là các tầng tiêu đề; gốc: insertHeaderTable
   + recuseHeader + rowspan/colspan → ui.table cột `group`).
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_KeHoachXetLuong/LayDanhSach  GET  strTuKhoa '', strLoaiXetLuong_Id '', strNguoiTao_Id '',
                                           pageIndex 1, pageSize 100000 — ô Kế hoạch (tên LOAIXETLUONG_TEN)
       L_XetLuong_CauTruc/LayDanhSach GET  strNhanSu_KeHoachXetLuong_Id, strNguoiThucHien_Id '' — cây cột
       L_XetLuong_CauTruc/LayDSDuLieuXetLuong
           GET  (getList_XetNangLuong) strDaoTao_CoCauToChuc_Id, strNhanSu_HoSoCanBo_Id,
                strNhanSu_KeHoachXetLuong_Id, strNguoiThucHien_Id '' → { rsNhanSu, rsDuLieuXetLuong }
           POST (XetNangLuong) cùng tham số, strNguoiThucHien_Id = userId
   Ô lọc: Đơn vị (getList_CoCauToChuc) → Thành viên (NS_HoSoV2/LayDanhSach GET, dLaCanBoNgoaiTruong 0)
   — ô mang nhãn "Tất cả …" = lọc TUỲ CHỌN, không khoá Thành viên (luật chung).
   Xuất báo cáo: mẫu của chức năng (ums.report); bộ khoá gốc: strLoaiBangLuong_Id,
   strNhanSu_QuyDinhLuong_Id, dNam, dThang (các ô đó đã bị chú thích → rỗng),
   strDaoTao_CoCauToChuc_Id, strNhanSu_HoSoCanBo_Id, strNguoiDangNhap_Id.
   Màn gốc không có vùng Import → ẩn nút Import.

   Bản gốc CHƯA TỪNG CHẠY trọn — làm theo ý định:
     · "Xem" nạp cây cột rồi gọi me.getList_DuLieuBangLuong() — hàm KHÔNG tồn tại
       (TypeError), bảng chỉ có tiêu đề. Nay "Xem" = cây cột + getList_XetNangLuong
       (LayDSDuLieuXetLuong GET — hàm gốc có sẵn nhưng không nơi nào gọi): dòng là
       rsNhanSu (NHANSU_HOSOCANBO_MASO / _HO / _TEN, DAOTAO_COCAUTOCHUC_TEN), ô tra
       theo NHANSU_HOSOCANBO_ID × THANHPHAN_ID → THANHPHAN_GIATRI.
     · Nút "Xét nâng lương" (btnXetNangLuong) KHÔNG gắn xử lý nào (gốc gắn
       #btnTinhLuong → me.TinhLuong không tồn tại). Nay gọi hàm XetNangLuong có sẵn
       (POST LayDSDuLieuXetLuong) rồi nạp lại bảng — đường GHI mới, thử trên host.
     · Bỏ: getList_HSSV (SV_HoSo — chép từ màn sinh viên, không nơi nào gọi); bảng
       tiêu đề nổi tự dựng khi cuộn (tầng chung lo); mục "1. Xét nâng lương" viết cứng
       trong ô báo cáo (bị getList_MauImport ghi đè khi có mẫu; tự nó gọi báo cáo mã
       "Xét nâng lương" không có thật).
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui, pat = ums.pat;
    var esc = ui.esc, e = L.e, uid = L.uid;
    var root = document.getElementById('thuchienxetnangluong');

    root.innerHTML =
        pat.page('Thực hiện xét nâng lương', '<span data-z="bc"></span>') +
        pat.filterBar([
            { key: 'kh', type: 'select', label: '--Chọn kế hoạch xét lương--' },
            { key: 'dv', type: 'select', label: '--Tất cả đơn vị thành viên--' },
            { key: 'tv', type: 'select', label: '--Tất cả thành viên đăng ký--' }
        ], {
            searchText: 'Xem',
            extra: '<div class="ums-field ums-field--fit">' + ui.btn('confirm', { text: 'Xét nâng lương', attr: { 'data-a': 'xet' } }) + '</div>'
        }) +
        pat.panel({ title: 'BẢNG XÉT NÂNG LƯƠNG', icon: 'fa-table-list', flush: true, zone: 'bang',
            body: ui.empty('Chọn kế hoạch xét lương rồi bấm Xem', 'fa-hand-pointer') });
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }

    ums.api.call({ action: 'L_KeHoachXetLuong/LayDanhSach', method: 'GET', strTuKhoa: '', strLoaiXetLuong_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 })
        .then(function (r) { pat.fill(f('kh'), L.rows(r), { name: 'LOAIXETLUONG_TEN' }); })
        .catch(function (err) { ums.api.handle(err, 'kế hoạch xét lương'); });
    L.donViThanhVien(f('dv'), f('tv'), { la: 0, khoa: false, napDau: true });

    /* Cây thành phần → cột lá kèm đường tổ tiên (group của ui.table) */
    function cotLa(tp) {
        var con = {};
        tp.forEach(function (x) { var c = x.THANHPHAN_CHA_ID || ''; (con[c] = con[c] || []).push(x); });
        var out = [];
        (function di(cha, path) {
            (con[cha] || []).forEach(function (x) {
                if (con[x.THANHPHAN_ID]) di(x.THANHPHAN_ID, path.concat([x.THANHPHAN_TEN]));
                else out.push({ tp: x, group: path });
            });
        })('', []);
        return out;
    }

    function thamSo() {
        return { strDaoTao_CoCauToChuc_Id: f('dv').value, strNhanSu_HoSoCanBo_Id: f('tv').value, strNhanSu_KeHoachXetLuong_Id: f('kh').value };
    }

    var cauTruc = [];
    function xem() {
        if (!f('kh').value) { ui.toast('Hãy nhập đủ thông tin', 'warn'); return; }
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({ action: 'L_XetLuong_CauTruc/LayDanhSach', method: 'GET', strNhanSu_KeHoachXetLuong_Id: f('kh').value, strNguoiThucHien_Id: '' })
            .then(function (r) { cauTruc = L.rows(r); return taiDuLieu(); })
            .catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'cấu trúc xét lương'); });
    }

    function taiDuLieu() {
        var o = thamSo();
        o.action = 'L_XetLuong_CauTruc/LayDSDuLieuXetLuong'; o.method = 'GET'; o.strNguoiThucHien_Id = '';
        return ums.api.call(o).then(function (r) {
            var d = r.data || {};
            var o2 = {};
            (d.rsDuLieuXetLuong || []).forEach(function (x) { (o2[x.NHANSU_HOSOCANBO_ID] = o2[x.NHANSU_HOSOCANBO_ID] || {})[x.THANHPHAN_ID] = x.THANHPHAN_GIATRI; });
            var cols = [
                { title: 'Mã số', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
                { title: 'Họ tên', render: function (x) { return esc((e(x.NHANSU_HOSOCANBO_HO) + ' ' + e(x.NHANSU_HOSOCANBO_TEN)).trim()); } },
                { title: 'CCTC', prop: 'DAOTAO_COCAUTOCHUC_TEN' }
            ].concat(cotLa(cauTruc).map(function (l) {
                var id = l.tp.THANHPHAN_ID;
                return { title: l.tp.THANHPHAN_TEN, group: l.group, cls: 'is-center is-nowrap',
                    render: function (x) { return esc(e((o2[x.NHANSU_HOSOCANBO_ID] || {})[id])); } };
            }));
            ui.table({ el: z('bang'), rows: d.rsNhanSu || [], columns: cols, empty: 'Không có dữ liệu', tableCls: 'ums-table--lined ums-table--tight' });
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'dữ liệu xét lương'); });
    }

    function xet() {
        if (!f('kh').value) { ui.toast('Hãy nhập đủ thông tin', 'warn'); return; }
        var o = thamSo();
        o.action = 'L_XetLuong_CauTruc/LayDSDuLieuXetLuong'; o.strNguoiThucHien_Id = uid();
        ums.api.call(o).then(function () {
            ui.toast('Thực hiện xét nâng lương thành công', 'ok');
            xem();
        }).catch(function (err) { ums.api.handle(err, 'xét nâng lương'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') xem();
        else if (a === 'xet') xet();
    });

    L.baoCao(z('bc'), {
        import: false,
        collect: function (add) {
            add('strLoaiBangLuong_Id', '');
            add('strNhanSu_QuyDinhLuong_Id', '');
            add('strDaoTao_CoCauToChuc_Id', f('dv').value);
            add('strNhanSu_HoSoCanBo_Id', f('tv').value);
            add('dNam', '');
            add('dThang', '');
            add('strNguoiDangNhap_Id', uid());
        }
    });
})();
