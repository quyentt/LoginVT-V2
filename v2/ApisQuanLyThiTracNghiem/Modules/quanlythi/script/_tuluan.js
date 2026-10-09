/* =========================================================================
   Thi tự luận (Quản lý thi trắc nghiệm) — khung chung ums.qlttnTL cho hai màn chép nhau ~90%:
     quanlythi/quanlythituluan    "Quản lý thi tự luận"     kieu 'ql'    — ô điểm công nhận theo MARKTULUAN, cột Xem kết quả + File
     quanlythi/duyetdiemthituluan "Duyệt điểm thi tự luận"  kieu 'duyet' — thêm một cột điểm cho MỖI giảng viên chấm, ô điểm công
                                                                           nhận lấy MARK đã lưu (tô nền) hoặc điểm so sánh
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlythi/script/quanlythituluan.js, duyetdiemthituluan.js (+ html cùng tên).
   Danh sách phòng + chi tiết THAY CHỖ danh sách (một cột như gốc): ums.coiThi.manPhong (ApisCongCanBo/Modules/coithi/script/_phongthi.js).
   Bản anh em Cổng cán bộ "Chấm thi tự luận" (coithi/chamthituluan.js) lệch danh sách phòng, cột, phách, tải tệp → không dùng chung tệp đó.
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func, không iM — chép nguyên):
     Đơn vị      QLTTN_ThongTin/LayDS_DonViByUserId GET strUserId
     Đợt thi     QLTTN_QuanLyThi/LayDS_DotThi GET strStatus '1'
     Phòng thi   QLTTN_QuanLyThi/LayDS_ThongTinPhongThi GET versionAPI v1.0, strDonVi_Id, strDotThi_Id, strTrangThaiPhongThi, strStatus,
                 strTuNgay, strDenNgay, strTuKhoa, strNguoiDung_Id, PageNumber, ItemPerPage — ngoài cột phòng còn đọc EXAMSTRUCTID,
                 GENSTYLETEXT, EXAMSTRUCTNAME, TOLTALQUESTION, DATAODE, WRITETENEXAMNAME (khối "Thông tin đề thi" lấy NGAY từ dòng
                 danh sách, gốc không gọi LayDS_ExamRoomInfoDetail).
     Phần thi    QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart GET strExamStructId… → PARENTID null VÀ KIEULAMBAITHI = 'THITULUANVANBAN';
                 chỉ một phần thì tự chọn.
     Thí sinh    QLTTN_QuanLyThi/LayDS_CTPhongThi_Part_TuLuan GET versionAPI, strExamRoomInfoId, strKieuLamBaiThi (của phần đang chọn),
                 strExamStructPartId, NguoiDung_Id, PageNumber, ItemPerPage (PHÂN TRANG máy chủ) → { ChiTietPhongThi, StudentFiles,
                 GiaoVienChamThi [FULLNAME, NAME, NHANSUID], DiemGiaoVienChamThi [NHANSUID, EXAMSTRUCTPARTID, USERID, MARK],
                 DiemSoSanhGiaoVien [EXAMSTRUCTPARTID, USERID, MARK] } — ba mảng sau chỉ màn Duyệt điểm dùng.
                 Cột dòng: ID, STUDENTEXAMROOMID, EXAMSTRUCTPARTID, USERID, STUDENTCODE, FULLNAME, BIRTHDATE_USER, SOBAODANHIMPORT, SOPHACH,
                 MARK, MARKTULUAN, GHICHUTULUAN, DIACHIIPMAYDADANGNHAP, TENVIPHAMQUYCHETHI. Tệp bài làm: StudentFiles theo DULIEU_ID = ID.
     Công nhận   POST versionAPI, strId (= ID dòng — gốc đặt tên biến …PartId nhưng gửi ID), strMark, strGhiChu, strNguoiThucHien_Id:
                 'ql' → QLTTN_QuanLyThi/Sua_CongNhanDiem_TuLuan · 'duyet' → QLTTN_QuanLyThi/Sua_CongNhanDiem (save_CongNhanDiem_Admin).
     Tạo phách   QLTTN_QuanLyThi/save_TaoPhach GET versionAPI, strExamRoomInfoId, strKieuLamBaiThi 'THITULUANVANBAN', strNguoiThucHien_Id.
     Tải file    QLTTN_QuanLyThi/TaiFileThiSinhLamBai GET versionAPI, strExamRoomInfoId, strKieuLamBaiThi 'THITULUAN', strNguoiThucHien_Id
                 → Data = đường dẫn tệp; mở <base QLTTN của Init_API, '/api/' → '/temp/'> + Data (như gốc).
     Báo cáo     SYS_Report/ThemMoi (ums.coiThi.baoCao, URL báo cáo hệ thống): ô chọn BAOCAODIEM / BAOCAOPHACH, nút "Tải file (Văn bản)" =
                 BAITHITULUANPHONGTHI; ExamstructPartId = EXAMSTRUCTPARTID của dòng đầu danh sách (gốc), không có thì phần đang chọn.
     Bài thi     TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI GET versionAPI, strExamRoomInfoId, strStudentExamRoomId (STUDENTEXAMROOMID),
                 strThiSinhId (USERID), strUserId, strKieuLamBai → HTML bài làm (ums.coiThi.xemBaiThi) — chỉ màn 'ql'.
   Khác gốc / lỗi gốc đã sửa:
     · Công nhận điểm: gốc gửi MỌI dòng (kể cả không đổi) rồi hẹn 2 giây nạp lại → nay chỉ gửi dòng có ô điểm / ghi chú khác giá trị đã
       lưu ('duyet': khác MARK đã lưu — dòng chưa có MARK mà ô mang điểm so sánh vẫn được gửi như ý gốc), hỏi lại, chạy hàng loạt có tiến
       độ, xong nạp lại.
     · Tạo phách gốc hẹn 2 giây nạp lại kể cả khi Huỷ → nạp lại sau khi máy chủ trả về.
     · Nút "Chi tiết phòng" ở cột "Xem kết quả" (gốc đặt nhầm chữ, mở bài thi) → chữ "Chi tiết bài thi". Họ tên gốc là nút
       btnChiTietThiSinh không có xử lý → chữ thường.
     · Dòng chân bảng "Tổng số / Số Đạt / Số Không Đạt" luôn 0 → bỏ; cột ô đánh dấu thí sinh không nút nào dùng → bỏ.
     · 'duyet': html gốc có vùng Kết quả thi nhưng bảng không còn cột mở → không có nút xem bài thi (như gốc).
     · Ba nút "Đóng" của gốc → một nút đầu trang. Mở màn không tự nạp danh sách — chờ Tìm kiếm (như gốc). Gốc gọi MathJax cho bài thi →
       ums.editor.toan nếu có.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var T = ums.qlttnTL = ums.qlttnTL || {};

    /** root, o = { kieu: 'ql' | 'duyet', tieuDe } */
    T.man = function (root, o) {
        o = o || {};
        var duyet = o.kieu === 'duyet';
        P.manPhong(root, {
            tieuDe: o.tieuDe || (duyet ? 'Duyệt điểm thi tự luận' : 'Quản lý thi tự luận'),
            donVi: 'QLTTN_ThongTin/LayDS_DonViByUserId',
            action: QL + 'LayDS_ThongTinPhongThi',
            locTrangThai: true, locStatus: true, tacVu: false,
            cot: { gioThi: false, anHien: true },
            chiTiet: function (room, host) { return chiTiet(room, host, duyet); }
        });
    };

    /* =====================================================================
       Chi tiết phòng thi (gốc zoneChiTietTuLuan): thông tin phòng / đề + thanh thao tác + bảng thí sinh
       ===================================================================== */
    function chiTiet(room, host, duyet) {
        var s = { page: 1, size: 10, tong: 0, rows: [], files: [], phan: [], gv: [], dgv: [], dss: [], partId: '' };
        host.innerHTML = P.thongTin(room, { matKhau: false }) +
            pat.panel({ title: 'Danh sách thí sinh', icon: 'fa-users', count: 'tsn', flush: true, zone: 'ts', cls: 'ct-ds',
                tools: '<div class="ct-tools">' +
                    '<div class="ums-field"><select class="ums-select" data-ct="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option>' +
                        '<option value="BAOCAODIEM">Báo cáo điểm</option><option value="BAOCAOPHACH">Báo cáo phách</option></select></div>' +
                    ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-ct': 'taifile' } }) +
                    '<div class="ums-field"><select class="ums-select" data-ct="phan" data-ph="Chọn phần thi"><option value="">Chọn phần thi</option></select></div>' +
                    ui.btn('save', { text: 'Tạo phách', icon: 'fa-barcode', mod: 'out-primary', attr: { 'data-ct': 'phach' } }) +
                    ui.btn('save', { text: 'Công nhận điểm', icon: 'fa-clipboard-check', attr: { 'data-ct': 'congnhan' } }) +
                    ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-ct': 'taitep', title: 'Tải tệp bài làm của thí sinh' } }) +
                    ui.btn('excel', { text: 'Tải file (Văn bản)', icon: 'fa-file-word', attr: { 'data-ct': 'taivanban' } }) +
                    ui.btn('reload', { attr: { 'data-ct': 'refresh' } }) +
                    '</div>' });
        ui.enhance(host);
        var selPhan = host.querySelector('[data-ct="phan"]'), ts = host.querySelector('[data-z="ts"]');
        var zDe = host.querySelector('[data-z="de"]');
        // Khối "Thông tin đề thi" lấy ngay từ dòng danh sách phòng (như gốc)
        if (zDe) zDe.innerHTML = P.veDe(room, true);

        function phanId() { return selPhan.value; }
        function kieuLamBai() {
            var p = s.phan.filter(function (x) { return e(x.ID) === phanId(); })[0];
            return p ? e(p.KIEULAMBAITHI) : '';
        }
        function partBaoCao() { return s.partId || phanId(); }
        /** Tệp bài làm theo DULIEU_ID = ID dòng (gốc QLTTN; bản Cổng cán bộ khớp STUDENTEXAMROOMPARTID) */
        function tep(r) {
            var goc = (ums.session && ums.session.rootPathUpload) || '';
            return s.files.filter(function (f) { return e(f.DULIEU_ID) === e(r.ID); }).map(function (f) {
                return '<a class="ct-tep" target="_blank" rel="noopener" href="' + esc(goc + '/' + e(f.DUONGDAN)) + '">' + esc(e(f.TENHIENTHI)) + '</a>';
            }).join('');
        }

        /* ---------- Thí sinh ---------------------------------------------- */
        function taiTS(page) {
            if (page) s.page = page;
            ts.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(QL + 'LayDS_CTPhongThi_Part_TuLuan', {
                versionAPI: V, strExamRoomInfoId: room.ID, strKieuLamBaiThi: kieuLamBai(), strExamStructPartId: phanId(),
                NguoiDung_Id: P.uid(), PageNumber: s.page, ItemPerPage: s.size
            }).then(function (r) {
                var d = r.data || {};
                s.rows = Array.isArray(d) ? d : arr(d.ChiTietPhongThi);
                s.files = arr(d.StudentFiles);
                s.gv = arr(d.GiaoVienChamThi);
                s.dgv = arr(d.DiemGiaoVienChamThi);
                s.dss = arr(d.DiemSoSanhGiaoVien);
                s.partId = s.rows.length ? e(s.rows[0].EXAMSTRUCTPARTID) : '';
                s.tong = Number(r.pager) || s.rows.length;
                ve();
            }).catch(function (err) { ts.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thí sinh'); });
        }
        /** Điểm so sánh của một thí sinh (DiemSoSanhGiaoVien theo phần thi của dòng đầu + USERID, đúng một dòng) */
        function diemSoSanh(r) {
            var ds = s.dss.filter(function (x) { return e(x.EXAMSTRUCTPARTID) === s.partId && e(x.USERID) === e(r.USERID); });
            return ds.length === 1 ? e(ds[0].MARK) : '';
        }
        function diemGV(gv, r) {
            var d = s.dgv.filter(function (x) {
                return e(x.NHANSUID) === e(gv.NHANSUID) && e(x.EXAMSTRUCTPARTID) === s.partId && e(x.USERID) === e(r.USERID);
            })[0];
            return d ? e(d.MARK) : '';
        }
        /** Giá trị đã lưu để so khi Công nhận: 'ql' = MARKTULUAN, 'duyet' = MARK */
        function diemLuu(r) { return duyet ? e(r.MARK) : e(r.MARKTULUAN); }
        /** Giá trị đổ sẵn vào ô điểm */
        function diemO(r) { return duyet ? (e(r.MARK) !== '' ? e(r.MARK) : diemSoSanh(r)) : e(r.MARKTULUAN); }

        function ve() {
            host.querySelector('[data-z="tsn"]').textContent = '(' + s.tong + ')';
            var cot = [
                { title: 'Mã thí sinh', cls: 'is-center is-nowrap', render: function (r) { return P.anhThiSinh(r.STUDENTCODE) + '<br>' + esc(e(r.STUDENTCODE)); } },
                { title: 'Họ và tên', prop: 'FULLNAME', cls: 'ct-cot-ten' },
                { title: 'Ngày sinh', prop: 'BIRTHDATE_USER', cls: 'is-center is-nowrap' },
                { title: 'Số báo danh', prop: 'SOBAODANHIMPORT', cls: 'is-center' },
                { title: 'Số phách', prop: 'SOPHACH', cls: 'is-center' }
            ];
            if (duyet) s.gv.forEach(function (gv) {
                cot.push({ title: e(gv.FULLNAME) + '(' + e(gv.NAME) + ')', cls: 'is-center', render: function (r) {
                    var d = diemGV(gv, r);
                    return diemSoSanh(r) === '' ? '<span class="qltl-lech">' + esc(d) + '</span>' : esc(d);
                } });
            });
            cot.push({ title: 'Điểm công nhận', cls: 'is-center', render: function (r, i) {
                var daLuu = duyet && e(r.MARK) !== '';
                return '<input class="ums-input ums-input--sm ct-o' + (daLuu ? ' qltl-o--daluu' : '') + '" data-diem="' + i + '" value="' + esc(diemO(r)) + '" autocomplete="off">';
            } });
            if (!duyet) cot.push({ title: 'Máy đã đăng nhập', prop: 'DIACHIIPMAYDADANGNHAP', cls: 'is-center' });
            cot.push({ title: 'Ghi chú', render: function (r, i) {
                return (e(r.TENVIPHAMQUYCHETHI) ? '<span class="ct-vipham">' + esc(e(r.TENVIPHAMQUYCHETHI)) + '</span>' : '') +
                    '<input class="ums-input ums-input--sm qltl-gc" data-ghichu="' + i + '" value="' + esc(e(r.GHICHUTULUAN)) + '" autocomplete="off">';
            } });
            if (!duyet) cot.push(
                { title: 'Xem kết quả', cls: 'is-center', render: function (r) {
                    return ui.btn('view', { text: 'Chi tiết bài thi', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-kq': e(r.STUDENTEXAMROOMID) } });
                } },
                { title: 'File', cls: 'is-nowrap', render: function (r) { return tep(r); } });
            ui.table({ el: ts, rows: s.rows, columns: cot, empty: 'Không có thí sinh',
                page: { index: s.page, size: s.size, total: s.tong, onChange: taiTS, onSize: function (n) { s.size = n; taiTS(1); } } });
        }

        /* ---------- Phần thi tự luận của cấu trúc đề (từ dòng phòng) ------- */
        P.phanThi(e(room.EXAMSTRUCTID)).then(function (ds) {
            s.phan = ds.filter(function (x) { return x.KIEULAMBAITHI === 'THITULUANVANBAN'; });
            pat.fill(selPhan, s.phan, { name: 'TITLE', head: 'Chọn phần thi' });
            if (s.phan.length === 1) { selPhan.value = s.phan[0].ID; if (window.jQuery) jQuery(selPhan).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'phần thi'); }).then(function () { taiTS(1); });
        if (window.jQuery) jQuery(selPhan).on('select2:select select2:clear', function () { taiTS(1); });

        /* ---------- Công nhận điểm ----------------------------------------- */
        function congNhan() {
            function o(k, i) { var x = ts.querySelector('[data-' + k + '="' + i + '"]'); return x ? x.value.trim() : ''; }
            var doi = [];
            s.rows.forEach(function (r, i) {
                var d = o('diem', i), gc = o('ghichu', i);
                if (d !== diemLuu(r).trim() || gc !== e(r.GHICHUTULUAN).trim()) doi.push({ r: r, d: d, gc: gc });
            });
            if (!doi.length) { ui.toast('Chưa có dòng nào thay đổi điểm công nhận / ghi chú', 'warn'); return; }
            var sai = doi.filter(function (x) { return x.d !== '' && isNaN(Number(x.d.replace(',', '.'))); });
            if (sai.length) { ui.toast('Điểm công nhận phải là số: ' + sai.map(function (x) { return e(x.r.STUDENTCODE); }).join(', '), 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thực hiện không? (' + doi.length + ' thí sinh)', { title: 'Công nhận điểm', ok: 'Công nhận' }).then(function (yes) {
                if (!yes) return;
                var calls = doi.map(function (x) {
                    return { action: QL + (duyet ? 'Sua_CongNhanDiem' : 'Sua_CongNhanDiem_TuLuan'), method: 'POST', versionAPI: V,
                        strId: x.r.ID, strMark: x.d, strGhiChu: x.gc, strNguoiThucHien_Id: P.uid() };
                });
                ui.batch(calls, { title: 'Công nhận điểm', okText: 'Cập nhật thành công' }).then(function () { taiTS(); });
            });
        }

        /* ---------- Tạo phách, tải tệp bài làm ----------------------------- */
        function taoPhach() {
            ui.confirm('Bạn có chắc chắn thực hiện không?', { title: 'Tạo phách', ok: 'Tạo phách' }).then(function (yes) {
                if (!yes) return;
                g(QL + 'save_TaoPhach', { versionAPI: V, strExamRoomInfoId: room.ID, strKieuLamBaiThi: 'THITULUANVANBAN', strNguoiThucHien_Id: P.uid() })
                    .then(function () { ui.toast('Thực hiện thành công', 'ok'); taiTS(); })
                    .catch(function (err) { ums.api.handle(err, 'tạo phách'); });
            });
        }
        function taiTep() {
            g(QL + 'TaiFileThiSinhLamBai', { versionAPI: V, strExamRoomInfoId: room.ID, strKieuLamBaiThi: 'THITULUAN', strNguoiThucHien_Id: P.uid() })
                .then(function (r) {
                    var S = ums.session || {}, base = (S.api || {}).QLTTN || '';
                    var url = (base.indexOf('http') === 0 ? base : (S.apiUrlTemp || '') + base) + '/';
                    url = url.replace('/api/', '/temp/') + e(r.data);
                    ui.toast('Thực hiện thành công', 'ok');
                    if (ums.state && ums.state.mode === 'demo') ui.toast('Dựng thử — trên máy chủ thật sẽ mở: ' + url, 'info', { title: 'Tải tệp bài làm', timeout: 9000 });
                    else window.open(url, '_blank', 'noopener');
                }).catch(function (err) { ums.api.handle(err, 'tải tệp bài làm'); });
        }

        /* ---------- Chi tiết bài thi (màn 'ql') ---------------------------- */
        function ketQua(id) {
            var r = s.rows.filter(function (x) { return e(x.STUDENTEXAMROOMID) === id; })[0];
            if (!r) return;
            P.xemBaiThi({ action: 'TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI', method: 'GET', versionAPI: V, strExamRoomInfoId: room.ID,
                strStudentExamRoomId: id, strThiSinhId: e(r.USERID), strUserId: P.uid(), strKieuLamBai: kieuLamBai() },
                { title: 'Kết quả bài thi — ' + e(r.FULLNAME), ma: e(r.STUDENTCODE) });
        }

        host.addEventListener('click', function (ev) {
            var kq = ev.target.closest('[data-kq]');
            if (kq) { ketQua(kq.getAttribute('data-kq')); return; }
            var b = ev.target.closest('button[data-ct]');
            if (!b) return;
            var k = b.getAttribute('data-ct');
            if (k === 'refresh') taiTS();
            else if (k === 'congnhan') congNhan();
            else if (k === 'phach') taoPhach();
            else if (k === 'taitep') taiTep();
            else if (k === 'taivanban') P.baoCao('BAITHITULUANPHONGTHI', room.ID, partBaoCao(), { goc: 'heThong' });
            else if (k === 'taifile') P.baoCao(host.querySelector('select[data-ct="bc"]').value, room.ID, partBaoCao(), { goc: 'heThong' });
        });
        return function () {};
    }
})();
