/* =========================================================================
   diemrenluyen — Điểm rèn luyện (Cổng sinh viên, vai trò thủ vai: userId = ID người học)
   Bản gốc: ApisCongSinhVien/Modules/hoctap/html/diemrenluyen.html + script/diemrenluyen.js
   (lớp DiemRenLuyen, vỏ index / Core).
   ---------------------------------------------------------------------------
   Bố cục GIỮ như gốc — MỘT cột: hàng lọc (ô "Chọn kế hoạch" + nút Xem + Cập nhật),
   dưới là TỜ PHIẾU: quốc hiệu hai bên, tiêu đề "Phiếu đánh giá kết quả rèn luyện
   cho sinh viên", dòng số quyết định, khối thông tin sinh viên (Họ tên · Học kỳ ·
   Mã số SV · Lớp · Khóa · Khoa · Ngày sinh · Năm học) và bảng năm cột
   (Nội dung đánh giá · SV tự đánh giá · HĐ cấp khoa đánh giá · HĐ cấp trường
   đánh giá · Files minh chứng).

   Lời gọi (chép nguyên action / func / tham số / tên cột) — XLHV_RL_TinhToan_MH ·
   pkg_diemrenluyen_tinhtoan.*:
       LayDSKeHoach                          ô "Chọn kế hoạch" (ID, TEN — chọn sẵn mục đầu)
       LayDSDRL_CauTrucHienThi               cấu trúc phiếu (THANHPHAN_ID, THANHPHAN_CHA_ID,
                                             THANHPHAN_TEN, NHAPTRUCTIEP, DRL_KEHOACH_ID)
       LayDSKetQua                           rsThongTin (đầu phiếu) + rs (điểm đã lưu)
       Them_DRL_CauTrucHienThi_KetQua        lưu từng ô điểm đã đổi
   Tệp minh chứng: ums.files (= edu.system.uploadFiles / viewFiles / saveFiles),
       api "SV_Files", khoá bản ghi = <id người học> + DRL_KEHOACH_ID + THANHPHAN_ID
       (chép nguyên cách ghép của gốc).

   Khác bản gốc (cách làm, không đổi bố cục):
     · Bảng vẽ bằng ums.ui.table; dòng "cha" (thành phần có thành phần con) là một
       dòng tiêu đề nhóm (gốc là một ô gộp cả hàng) — cùng vai trò, không thêm ô.
     · Ô tệp dùng ums.files (nút "Chọn tệp") thay input file trần; dòng KHÔNG cho
       nhập trực tiếp thì ô tệp chỉ xem, đúng như gốc (gốc chỉ bật upload cho
       dòng NHAPTRUCTIEP nhưng vẫn hiện tệp đã lưu của mọi dòng).
     · Mở màn là nạp luôn phiếu theo kế hoạch đầu tiên (gốc chọn sẵn kế hoạch
       nhưng bắt bấm "Xem" mới hiện) — nút "Xem" vẫn giữ.
     · Lưu hàng loạt chạy tuần tự kèm tiến độ (ums.ui.batch) thay genHTML_Progress
       + start_Progress; hỏi lại bằng ums.ui.confirm.
   Lỗi bản gốc đã sửa:
     · Gốc gắn `$("#btnYes").click(...)` MỚI mỗi lần bấm "Cập nhật" → bấm lần thứ
       n thì mỗi ô được lưu n lần. Ở đây một lần bấm = một lượt lưu.
     · Gốc so ô nhập với thuộc tính `name` để biết ô nào đổi nhưng `name` chỉ được
       đặt cho các ô CÓ kết quả cũ; ô chưa có điểm mang name="" nên chỉ cần gõ rồi
       xoá trắng là bị coi như đã đổi. Ở đây so với giá trị lúc nạp (data-goc),
       cùng cách nhưng tính cho mọi ô.
   Giữ như gốc (chờ nghiệp vụ — xem báo cáo): hai cột "HĐ cấp khoa đánh giá" /
     "HĐ cấp trường đánh giá" luôn để trống (gốc không đổ gì); dòng số quyết định
     "10/QĐ- ĐHCMC-CTSN ngày 10 tháng 10 năm 2023" viết cứng trong HTML gốc.
   Bỏ (mã chết của gốc): hai vùng #zonebtnBaoCao_DiemRenLuyen và
     #zonebtnBaoCao_DiemRenLuyen_Import — không tệp .js nào đổ nút vào đó;
     edu.system.strTypeCheckFile = ".pdf" (ums.files dùng danh sách đuôi chung).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('csv-diemrenluyen');
    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(e(s)); }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    var sv = (ums.session && ums.session.userId) || '';

    var A = 'XLHV_RL_TinhToan_MH/', F = 'pkg_diemrenluyen_tinhtoan.';
    var G = {
        kh: { action: A + 'DSA4BRIKJAkuICIp', func: F + 'LayDSKeHoach' },
        ct: { action: A + 'DSA4BRIFEw0eAiA0FTM0IgkoJC8VKSgP', func: F + 'LayDSDRL_CauTrucHienThi' },
        kq: { action: A + 'DSA4BRIKJDUQNCAP', func: F + 'LayDSKetQua' },
        luu: { action: A + 'FSkkLB4FEw0eAiA0FTM0IgkoJC8VKSgeCiQ1EDQg', func: F + 'Them_DRL_CauTrucHienThi_KetQua' }
    };
    function goi(k, o) { return ums.api.call(Object.assign({ silent: true }, G[k], o)); }

    var dtRenLuyen = [];            // cấu trúc phiếu đang hiện
    var oTep = {};                  // THANHPHAN_ID → khung tệp của ums.files

    root.innerHTML = pat.page('Điểm rèn luyện', '') +
        pat.panel({ title: 'Kế hoạch rèn luyện', icon: 'fa-clipboard-check', cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
            '<div class="ums-field"><select class="ums-select" data-f="kh" data-ph="Chọn kế hoạch công nhận điểm"><option value="">Chọn kế hoạch công nhận điểm</option></select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Xem', icon: 'fa-magnifying-glass', mod: 'out-primary', attr: { 'data-a': 'xem' } }) + '</div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('save', { text: 'Cập nhật', icon: 'fa-table', attr: { 'data-a': 'luu' } }) + '</div>' +
            '</div>' }) +
        pat.panel({ title: false, body:
            '<div class="drl-phieu__head">' +
                '<p><span class="drl-phieu__co">Bộ giáo dục và đào tạo</span></p>' +
                '<p><span class="drl-phieu__qh">Cộng hòa xã hội chủ nghĩa việt nam</span><br>' +
                '<span class="drl-phieu__td">Độc lập - Tự do - Hạnh phúc</span></p>' +
            '</div>' +
            '<div class="drl-phieu__title">Phiếu đánh giá kết quả rèn luyện cho sinh viên</div>' +
            '<p class="drl-phieu__qd">(Ban hành kèm theo Quyết định số: <b>10</b>/QĐ- ĐHCMC-CTSN ngày <b>10</b> tháng <b>10</b> năm 2023)</p>' +
            '<div class="drl-info" data-z="tt"></div>' +
            '<div data-z="bang"></div>' });
    ui.enhance(root);

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }

    /* ---------- Kế hoạch --------------------------------------------------- */
    goi('kh', {}).then(function (r) {
        var rows = arr(r.data);
        pat.fill(f('kh'), rows, { head: 'Chọn kế hoạch' });
        if (rows.length) {
            f('kh').value = e(rows[0].ID);                   // selectOne của bản gốc
            if (window.jQuery) jQuery(f('kh')).trigger('change.select2');
            napPhieu();
        } else {
            z('bang').innerHTML = ui.empty('Chưa có kế hoạch rèn luyện', 'fa-clipboard-question');
        }
    }).catch(function (err) { ums.api.handle(err, 'danh sách kế hoạch'); });
    if (window.jQuery) jQuery(f('kh')).on('select2:select', napPhieu);

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        if (b.getAttribute('data-a') === 'xem') napPhieu();
        else if (b.getAttribute('data-a') === 'luu') capNhat();
    });

    /* ---------- Cấu trúc phiếu + kết quả ----------------------------------- */
    function napPhieu() {
        if (!f('kh').value) { ui.toast('Bạn chưa chọn kế hoạch', 'warn'); return; }
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        z('tt').innerHTML = '';
        goi('ct', { strDRL_KeHoach_Id: f('kh').value }).then(function (r) {
            dtRenLuyen = arr(r.data);
            veBang(dtRenLuyen);
            return ketQua();
        }).catch(function (err) { z('bang').innerHTML = ui.fail(err.message); });
    }

    /* Dòng CHA (có thành phần con) = dòng tiêu đề nhóm; dòng lá = một ô điểm */
    function laCha(x) {
        return dtRenLuyen.some(function (y) { return y.THANHPHAN_CHA_ID === x.THANHPHAN_ID; });
    }
    function veBang(rows) {
        oTep = {};
        ui.table({
            el: z('bang'), rows: rows, stt: false, empty: 'Chưa có nội dung đánh giá',
            rowCls: function (x) { return laCha(x) ? 'drl-nhom' : ''; },
            columns: [
                { title: 'Nội dung đánh giá', render: function (x) { return esc(x.THANHPHAN_TEN); } },
                { title: 'SV tự đánh giá', head: 'SV tự<br>đánh giá', cls: 'is-center', render: function (x) {
                    if (laCha(x)) return '';
                    return '<input type="text" class="ums-input drl-diem" data-diem="' + esc(x.THANHPHAN_ID) + '" data-goc="" value=""' +
                        (x.NHAPTRUCTIEP ? '' : ' readonly') + '>';
                } },
                { title: 'HĐ cấp khoa đánh giá', head: 'HĐ cấp khoa<br>đánh giá', cls: 'is-center', render: function () { return ''; } },
                { title: 'HĐ cấp trường đánh giá', head: 'HĐ cấp trường<br>đánh giá', cls: 'is-center', render: function () { return ''; } },
                { title: 'Files minh chứng', render: function (x) {
                    return laCha(x) ? '' : '<div data-tep="' + esc(x.THANHPHAN_ID) + '"></div>';
                } }
            ]
        });
        /* Khung tệp của từng dòng — như viewFiles của gốc, khoá = người học + kế hoạch + thành phần */
        rows.forEach(function (x) {
            var host = z('bang').querySelector('[data-tep="' + x.THANHPHAN_ID + '"]');
            if (!host) return;
            var ctl = ums.files.mount(host, { api: 'SV_Files', readonly: !x.NHAPTRUCTIEP });
            oTep[x.THANHPHAN_ID] = { ctl: ctl, key: sv + e(x.DRL_KEHOACH_ID) + e(x.THANHPHAN_ID), nhap: !!x.NHAPTRUCTIEP };
            ctl.load(oTep[x.THANHPHAN_ID].key);
        });
    }

    function ketQua() {
        return goi('kq', { strDRL_KeHoach_Id: f('kh').value }).then(function (r) {
            var d = r.data || {};
            var tt = arr(d.rsThongTin)[0];
            if (tt) thongTin(tt);
            arr(d.rs).forEach(function (x) {
                var el = z('bang').querySelector('[data-diem="' + x.THANHPHAN_ID + '"]');
                if (!el) return;
                el.value = e(x.THANHPHAN_GIATRI);
                el.setAttribute('data-goc', e(x.THANHPHAN_GIATRI));
            });
        }).catch(function (err) { ums.api.handle(err, 'kết quả rèn luyện'); });
    }
    function thongTin(a) {
        z('tt').innerHTML =
            muc('Họ tên', e(a.HODEM) + ' ' + e(a.TEN)) +
            muc('Học kỳ', a.DAOTAO_THOIGIANDAOTAO_KY, 'is-nho') +
            muc('Mã số SV', a.MASO, 'is-to') +
            muc('Lớp', a.DAOTAO_LOPQUANLY_TEN) +
            muc('Khóa', a.DAOTAO_KHOADAOTAO_TEN, 'is-nho') +
            muc('Khoa', a.DAOTAO_KHOAQUANLY_TEN, 'is-to') +
            muc('Ngày sinh', a.QLSV_NGUOIHOC_NGAYSINH) +
            muc('Năm học', a.DAOTAO_THOIGIANDAOTAO_NAM, 'is-nho');
    }
    function muc(nhan, gt, cls) {
        return '<div' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(nhan) + ': <b>' + esc(gt) + '</b></div>';
    }

    /* ---------- Cập nhật --------------------------------------------------- */
    function capNhat() {
        if (!f('kh').value) { ui.toast('Bạn chưa chọn kế hoạch', 'warn'); return; }
        /* 1. Tệp minh chứng của các dòng cho nhập trực tiếp — như gốc, chạy trước
              và không phụ thuộc vào việc điểm có đổi hay không */
        var tep = Object.keys(oTep).filter(function (k) { return oTep[k].nhap && oTep[k].ctl.pending(); });
        tep.forEach(function (k) { oTep[k].ctl.save(oTep[k].key); });

        /* 2. Các ô điểm đã đổi so với lúc nạp */
        var doi = Array.prototype.filter.call(root.querySelectorAll('.drl-diem'), function (el) {
            return el.value !== el.getAttribute('data-goc');
        });
        if (!doi.length) { ui.toast('Không có thay đổi để lưu', 'warn'); return; }

        ui.confirm('Bạn có chắc chắn lưu ' + doi.length + ' dữ liệu không?', { title: 'Cập nhật điểm rèn luyện' })
            .then(function (yes) {
                if (!yes) return;
                var calls = doi.map(function (el) {
                    return Object.assign({}, G.luu, {
                        strThanhPhan_Id: el.getAttribute('data-diem'),
                        strThanhPhan_GiaTri: el.value,
                        strPhamViApDung_Id: sv,
                        strDRL_KeHoach_Id: f('kh').value
                    });
                });
                return ui.batch(calls, { title: 'Đang lưu điểm rèn luyện', okText: 'Đã lưu' })
                    .then(function () { napPhieu(); });
            }).catch(function (err) { ums.api.handle(err, 'lưu điểm rèn luyện'); });
    }
})();
