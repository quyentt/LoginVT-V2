/* =========================================================================
   congnhandiem — Đăng ký xin công nhận điểm (bản cũ, Cổng sinh viên - thủ vai)
   Bản gốc: ApisCongSinhVien/Modules/dangkyhoc/html/congnhandiem.html + script/congnhandiem.js
   Phần chung với congnhandiemv3: script/_congnhandiem.js (ums.cnd).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc: MỘT cột — thanh lọc (Kế hoạch, Chương trình, "Xem học phần",
   "Kết quả") + bảng học phần; mỗi dòng hai lối "Từ chứng chỉ" / "Từ bảng điểm" mở BIỂU MẪU NGAY TRONG TRANG
   (ums.pat.formTrang thay chỗ màn — BO-CUC luật 1; gốc là hai modal, trước 2026-09-30 bản mới cũng bật hộp thoại).
   Người học = ums.session.userId (vỏ thủ vai đã đặt, như edu.system.userId của gốc).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, SV_CongNhanDiem_MH · pkg_congthongtin_congnhandiem trừ khi ghi):
     LayDSKeHoachCongNhan · DKH_Chung_MH pkg_dangkyhoc_chung.LayDSChuongTrinh (chọn sẵn mục đầu)
     LayDSChuongTrinhHoc (strDaoTao_ChuongTrinh_Id, strDiem_KeHoachCongNhan_Id) — chọn ô / "Xem học phần"
     D_ThongTin_MH pkg_diem_thongtin.LayDSDiem_CoSoCongNhanDiem (Nơi cấp, Cơ sở đào tạo đã học)
     Biểu mẫu "từ chứng chỉ": danh mục DIEM.CHUNGCHI.PHANLOAI → LayDSDiem_ThongTin_ChungChi →
       LaYDSDiem_TT_CC_CapDo (strDaoTao_HocPhan_Id = học phần của dòng) → LayDSDiem_CC_CapDo_QuyDoi_DK (đầu điểm);
       Lưu: Them_Diem_NguoiHoc_Diem_CN → mỗi đầu điểm Them_Diem_NguoiHoc_Diem_CN_CC → tệp SV_Files
         khoá "ChungChi" + người học + ID dòng; Huỷ: Xoa_Diem_NguoiHoc_Diem_CN.
     Biểu mẫu "từ bảng điểm": ums.cnd.bangDiem (xem _congnhandiem.js).
   ---------------------------------------------------------------------------
   Giữ như gốc (chỗ lạ):
     · strLoai gửi rỗng (gốc đọc ô txtAAAA không tồn tại); strDiem_TT_CC_CapDo_Id của Lưu/Huỷ chứng chỉ
       = ID DÒNG học phần (aData.ID), không phải cấp độ đang chọn.
     · strDiem_ThanhPhanDiem_Id của từng đầu điểm = ID dòng đầu điểm (e.ID). Ghi chú của đầu điểm không gửi.
     · Nút "Kết quả" (đầu trang) và "Xem kết quả" (trong biểu mẫu) không có xử lý ở gốc → giữ nút, khoá.
   Sửa (lỗi rõ của gốc):
     · Nút "Xác nhận đồng ý quy đổi điểm" của biểu mẫu chứng chỉ gọi save_ChungChiDauDiem() KHÔNG tham số
       (gửi id rỗng, không tạo bản ghi công nhận) → nay chạy save_ChungChi như ý định: tạo bản ghi, rồi lưu đầu điểm.
     · Điểm từng đầu điểm gốc đọc ô 'lblDauDiem' + ID BẢN GHI MỚI (không tồn tại → luôn rỗng) → đọc ô của chính đầu điểm.
     · Lưu xong gốc gọi me.getList_ChuaDangKy (không có ở bản này → lỗi JS) → nạp lại danh sách học phần.
     · Mở biểu mẫu gọi LaYDSDiem_TT_CC_CapDo với ô cũ của lần mở trước; nay Loại → Chứng chỉ → Cấp độ khoá theo tầng.
   Bỏ: getList_KetQua (LayGiaTriNguoiHoc_Diem_CN_CC) — không nơi nào gọi.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, C = ums.cnd, e = C.e, arr = C.arr, esc = ui.esc;
    var root = document.getElementById('cnd-congnhandiem');
    var sv = C.uid();
    var ds = [];

    root.innerHTML = pat.page('Đăng ký xin công nhận điểm', '') +
        C.locHtml(ui.btn('search', { text: 'Xem học phần', icon: 'fa-magnifying-glass', attr: { 'data-a': 'xem' } }) +
            ui.btn('save', { text: 'Kết quả', icon: 'fa-circle-check', attr: { disabled: 'disabled', title: 'Bản gốc chưa gắn xử lý cho nút này' } })) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-ul', flush: true, zone: 'ds' });
    ui.enhance(root);
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    var zDS = root.querySelector('[data-z="ds"]');
    zDS.innerHTML = ui.empty('Chọn kế hoạch, chương trình rồi bấm "Xem học phần"', 'fa-hand-pointer');

    function dk(r, i) {
        return '<div class="ums-row cnd-dk">' +
            ui.btn('search', { text: 'Từ chứng chỉ', mod: 'out-primary', icon: 'fa-certificate', cls: 'ums-btn--sm', attr: { 'data-dk': 'cc|' + i } }) +
            ui.btn('search', { text: 'Từ bảng điểm', mod: 'out-primary', icon: 'fa-table-list', cls: 'ums-btn--sm', attr: { 'data-dk': 'bd|' + i } }) + '</div>';
    }
    function tai() {
        return C.taiDS(zDS, { strDaoTao_ChuongTrinh_Id: f('ct').value, strDiem_KeHoachCongNhan_Id: f('kh').value }, dk)
            .then(function (d) { ds = d; });
    }
    C.napLoc(f('kh'), f('ct'));
    if (window.jQuery) jQuery([f('kh'), f('ct')]).on('select2:select', tai);

    /* ---------- Biểu mẫu "Đăng ký công nhận từ chứng chỉ" (trong trang) ------- */
    function chungChi(row) {
        var kh = f('kh').value, ct = f('ct').value, dauDiem = [];
        var s = C.sel;
        var dlg = pat.formTrang({
            host: root, title: 'Đăng ký công nhận từ chứng chỉ', icon: 'fa-certificate', cols: 1,
            body: '<div class="ums-grid ums-grid--3">' +
                    ui.field('Loại chứng chỉ', s('loai', 'Chọn loại chứng chỉ')) +
                    ui.field('Chứng chỉ', s('cc', 'Chọn chứng chỉ')) +
                    ui.field('Cấp độ', s('capdo', 'Chọn cấp độ')) + '</div>' +
                '<div class="ums-u-mt-4" data-x="dd"></div>' +
                '<div class="ums-row ums-row--between ums-u-mt-4"><b>Điểm quy đổi</b>' +
                    ui.btn('search', { text: 'Xem kết quả', mod: 'out-primary', icon: 'fa-magnifying-glass', attr: { disabled: 'disabled', title: 'Bản gốc chưa gắn xử lý cho nút này' } }) + '</div>' +
                '<div class="ums-grid ums-grid--3 ums-u-mt-4">' +
                    ui.field('Nơi cấp', s('noicap', 'Chọn nơi cấp')) +
                    ui.field('Ngày cấp', '<input class="ums-input" data-x="ngaycap" data-date placeholder="Nhập ngày cấp" autocomplete="off">') +
                    ui.field('Ngày hết hạn', '<input class="ums-input" data-x="ngayhethan" data-date placeholder="Nhập ngày hết hạn" autocomplete="off">') + '</div>' +
                ui.field('Nhập minh chứng', '<div data-x="tep"></div>'),
            buttons: [
                { text: 'Xác nhận hủy kết quả đăng ký', kind: 'del', mod: 'out-warn', onClick: function () { huy(); return false; } },
                { text: 'Xác nhận đồng ý quy đổi điểm', kind: 'save', mod: 'primary', onClick: function () { luu(); return false; } }
            ]
        });
        function q(k) { return dlg.body.querySelector('[data-f="' + k + '"], [data-x="' + k + '"]'); }
        var nutHuy = dlg.el.querySelector('.ums-panel__tools [data-ft="0"]');     // formTrang: nút mang data-ft = chỉ số trong buttons
        if (nutHuy) nutHuy.hidden = !row.TINHTRANGCONGNHAN;
        ui.enhance(dlg.body);
        var files = C.tep(q('tep'));
        var khoaTep = 'ChungChi' + sv + row.ID;
        files.load(khoaTep);
        C.noiCap().then(function (d) { pat.fill(q('noicap'), d, { head: 'Chọn nơi cấp' }); });

        function loiNhac() { dauDiem = []; q('dd').innerHTML = ui.empty('Chọn loại chứng chỉ, chứng chỉ và cấp độ để hiện các đầu điểm', 'fa-hand-pointer'); }
        loiNhac();
        C.chungChi({ loai: q('loai'), cc: q('cc'), capdo: q('capdo') }, {
            hocPhan: function () { return row.DAOTAO_HOCPHAN_ID; },
            onXoa: loiNhac,
            onCapDo: napDauDiem
        });
        function napDauDiem() {
            q('dd').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            C.call('ddQuyDoiDK', { strDiem_ThongTin_CC_CapDo_Id: q('capdo').value }).then(function (r) {
                dauDiem = arr(r.data);
                ui.table({ el: q('dd'), rows: dauDiem, tableCls: 'ums-table--lined ums-table--tight', empty: 'Không có đầu điểm', columns: [
                    { title: 'Tên đầu điểm nhập', prop: 'DIEM_THANHPHANDIEM_TEN' },
                    { title: 'Kết quả', width: '160px', render: function (x) { return '<input class="ums-input ums-input--sm" data-diem="' + esc(x.ID) + '" autocomplete="off">'; } },
                    { title: 'Ghi chú', render: function (x) { return '<input class="ums-input ums-input--sm" data-ghichu="' + esc(x.ID) + '" autocomplete="off">'; } }
                ] });
            }).catch(function (err) { q('dd').innerHTML = ui.fail(err.message); ums.api.handle(err, 'đầu điểm'); });
        }
        function diem(id) { var el = q('dd').querySelector('[data-diem="' + id + '"]'); return el ? el.value.trim() : ''; }
        function goc() {
            return { strLoai: '', strDiem_TT_CC_CapDo_Id: row.ID, strQLSV_NguoiHoc_Id: sv, strDaoTao_ChuongTrinh_Id: ct,
                strDiem_KeHoachCongNhan_Id: kh, strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID,
                strNgayCap: q('ngaycap').value.trim(), strNoiCap_Id: q('noicap').value, strNgayHetHan: q('ngayhethan').value.trim() };
        }
        function luu() {
            var ts = goc();
            C.call('themCN', ts).then(function (r) {
                var id = (r.raw && r.raw.Id) || '';
                var calls = dauDiem.map(function (x) {
                    return { action: C.A.themCNCC[0], func: C.A.themCNCC[1], strDiem_NguoiHoc_Diem_CN_Id: id,
                        strDiem_ThanhPhanDiem_Id: x.ID, dDiem: diem(x.ID), strNguoiThucHien_Id: sv };
                });
                return ui.batch(calls, { title: 'Đang lưu đầu điểm', toast: false }).then(function (b) {
                    if (b.fail) ui.toast('Thất bại: ' + b.errors[0], 'bad');
                    return files.save(khoaTep);
                }).then(function () {
                    ui.toast('Thêm mới thành công!', 'ok');
                    row.TINHTRANGCONGNHAN = row.TINHTRANGCONGNHAN || 1;
                    if (nutHuy) nutHuy.hidden = false;
                    files.load(khoaTep);
                    tai();
                });
            }).catch(function (err) { ums.api.handle(err, 'đăng ký công nhận'); });
        }
        function huy() {
            ui.confirm('Hủy kết quả đăng ký công nhận điểm của học phần này?', { tone: 'bad', ok: 'Hủy đăng ký', title: 'Xác nhận hủy' }).then(function (yes) {
                if (!yes) return;
                return C.call('xoaCN', goc()).then(function () { ui.toast('Thực hiện thành công!', 'ok'); tai(); dlg.close(); });
            }).catch(function (err) { ums.api.handle(err, 'hủy kết quả đăng ký'); });
        }
    }

    root.addEventListener('click', function (ev) {
        var b;
        if ((b = ev.target.closest('[data-a="xem"]'))) { tai(); return; }
        if ((b = ev.target.closest('[data-dk]'))) {
            var p = b.getAttribute('data-dk').split('|'), row = ds[Number(p[1])];
            if (!row) return;
            if (p[0] === 'cc') chungChi(row);
            else C.bangDiem({ host: root, row: row, kh: f('kh').value, ct: f('ct').value, v3: false, onDone: tai });
        }
    });
})();
