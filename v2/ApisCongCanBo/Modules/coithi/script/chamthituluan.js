/* =========================================================================
   Chấm thi tự luận (cổng cán bộ)
   Bản gốc: ApisCongCanBo/Modules/coithi/html/chamthituluan.html + script/chamthituluan.js
   ---------------------------------------------------------------------------
   Danh sách phòng: QLTTN_QuanLyThi/LayDS_PhongThi_ChamThi (strTrangThaiPhongThi '0' cố định, không có ô lọc
     trạng thái) — khung ums.coiThi.manPhong (_phongthi.js); đơn vị LayDS_DonViByUserId_GST.
   Chi tiết phòng (bản gốc: modal "Phòng thi"):
     LayDS_ExamRoomInfoDetail → "Thông tin đề thi" (không có dòng Đề thi) + EXAMSTRUCTID →
     phần thi LayDS_ExamStructPart chỉ lấy PARENTID null VÀ KIEULAMBAITHI = 'THITULUANVANBAN';
     chỉ một phần thì tự chọn. Rồi nạp thí sinh:
     LayDS_CTPhongThi_Part_TuLuan GET strExamRoomInfoId, strKieuLamBaiThi (của phần đang chọn),
       strExamStructPartId, NguoiDung_Id, trang 1 × 100000000 → { ChiTietPhongThi, StudentFiles }
     Chọn phần thi → nạp lại. Refresh → nạp lại.
     Công nhận điểm (POST): Sua_CongNhanDiem_TuLuan strId = STUDENTEXAMROOMPARTID (ID khi đề có tổng
       thời gian), strMark, strGhiChu — ô điểm MARKTULUAN, ô ghi chú GHICHUTULUAN.
     "Chi tiết bài thi": TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI GET strExamRoomInfoId, strStudentExamRoomId,
       strThiSinhId (USERID), strUserId, strKieuLamBai → HTML bài làm, hiện trong hộp thoại.
     Báo cáo: ô "Chọn loại báo cáo" (BAOCAODIEMPHANTHI) + "Tải file" → ums.coiThi.baoCao (SYS_Report, URL cứng).
   Khác bản gốc (ghi ở can-quyet.js):
     · "Thực hiện tác vụ" (Mở/Đóng phòng thi): tệp gốc gọi me.ThaoTacPhongThi_PhongThi_GST mà KHÔNG khai
       hàm đó → lỗi JS, chưa từng chạy. Nay gọi đúng action của màn Coi thi — đường GHI mới, thử trên host.
     · "Gian lận" → hộp máy đã đăng nhập: html gốc không có hộp đó (bấm không hiện gì) → nay hiện.
     · Công nhận điểm: gốc so ô nhập với MARK trong khi ô hiện MARKTULUAN, và đọc ô theo
       STUDENTEXAMROOMPARTID trong khi ô mang ID → nay so với chính giá trị đang hiện, gửi dòng đổi điểm
       HOẶC ghi chú.
     · Bỏ các alert gỡ lỗi của gốc ("Kiem tra muc phe duye", 111, 222).
     · Cột ô đánh dấu thí sinh: không thao tác nào dùng → bỏ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var root = document.getElementById('coithi-chamthituluan');
    if (!root) return;

    P.manPhong(root, {
        tieuDe: 'Chấm thi tự luận',
        donVi: 'QLTTN_ThongTin/LayDS_DonViByUserId_GST',
        action: QL + 'LayDS_PhongThi_ChamThi',
        trangThai: '0',
        chiTiet: chiTiet
    });

    function chiTiet(room, host) {
        var tong = e(room.TONGTHOIGIAN) !== '';
        var s = { rows: [], files: [], phan: [] };
        host.innerHTML = P.thongTin(room) +
            pat.panel({ title: 'Danh sách thí sinh', icon: 'fa-users', count: 'tsn', flush: true, zone: 'ts', cls: 'ct-ds',
                tools: '<div class="ct-tools">' +
                    '<div class="ums-field"><select class="ums-select" data-ct="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option>' +
                    '<option value="BAOCAODIEMPHANTHI">Báo cáo điểm</option></select></div>' +
                    ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-ct': 'taifile' } }) +
                    '<div class="ums-field"><select class="ums-select" data-ct="phan" data-ph="Chọn phần thi"><option value="">Chọn phần thi</option></select></div>' +
                    ui.btn('save', { text: 'Công nhận điểm', icon: 'fa-clipboard-check', attr: { 'data-ct': 'congnhan' } }) +
                    ui.btn('reload', { attr: { 'data-ct': 'refresh' } }) +
                    '</div>' });
        ui.enhance(host);
        function zz(k) { return host.querySelector('[data-z="' + k + '"]'); }
        var selPhan = host.querySelector('[data-ct="phan"]');
        function phanId() { return selPhan.value; }
        function kieuLamBai() {
            var p = s.phan.filter(function (x) { return e(x.ID) === phanId(); })[0];
            return p ? e(p.KIEULAMBAITHI) : '';
        }

        function tai() {
            zz('ts').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(QL + 'LayDS_CTPhongThi_Part_TuLuan', {
                versionAPI: V, strExamRoomInfoId: room.ID, strKieuLamBaiThi: kieuLamBai(), strExamStructPartId: phanId(),
                NguoiDung_Id: P.uid(), PageNumber: 1, ItemPerPage: 100000000
            }).then(function (r) {
                var d = r.data || {};
                s.rows = arr(d.ChiTietPhongThi);
                s.files = arr(d.StudentFiles);
                ve();
            }).catch(function (err) { zz('ts').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thí sinh'); });
        }
        function ve() {
            zz('tsn').textContent = '(' + s.rows.length + ')';
            var coPhan = tong || !!phanId();
            ui.table({ el: zz('ts'), rows: s.rows, empty: 'Không có thí sinh', columns: [
                { title: 'Mã thí sinh', prop: 'STUDENTCODE', cls: 'is-center is-nowrap' },
                { title: 'Họ và tên', cls: 'ct-cot-ten', render: function (r) { return P.tenThiSinh(r, false); } },
                { title: 'Ngày sinh', prop: 'BIRTHDATE_USER', cls: 'is-center is-nowrap' },
                { title: 'Số BD', prop: 'SOBAODANHIMPORT', cls: 'is-center' },
                { title: 'Điểm công nhận', cls: 'is-center', render: function (r, i) {
                    return '<input class="ums-input ums-input--sm ct-o" data-diem="' + i + '" value="' + esc(e(r.MARKTULUAN)) + '" autocomplete="off">';
                } },
                { title: 'Tình trạng', cls: 'is-center is-nowrap', render: function (r) { return P.tinhTrang(r, coPhan); } },
                { title: 'T/g BĐ làm bài', prop: 'TIMEHHMISSSTARTDOEXAM', cls: 'is-center is-nowrap' },
                { title: 'Máy đăng nhập', prop: 'DIACHIIPMAYDADANGNHAP', cls: 'is-center' },
                { title: 'Ghi chú', render: function (r, i) {
                    return (e(r.TENVIPHAMQUYCHETHI) ? '<span class="ct-vipham">' + esc(e(r.TENVIPHAMQUYCHETHI)) + '</span>' : '') +
                        '<input class="ums-input ums-input--sm ct-o" data-ghichu="' + i + '" value="' + esc(e(r.GHICHUTULUAN)) + '" autocomplete="off">';
                } },
                { title: 'Xem', cls: 'is-nowrap', render: function (r) {
                    return P.tep(r, s.files) + '<button type="button" class="ums-btn ums-btn--sm ums-btn--out-primary" data-kq="' + esc(r.STUDENTEXAMROOMID) + '">' +
                        '<i class="fa-light fa-eye"></i><span>Chi tiết bài thi</span></button>';
                } }
            ] });
            P.demNguoc(zz('ts'));
        }

        /* ---------- Thông tin đề, phần thi tự luận ------------------------ */
        P.chiTietDe(room.ID).then(function (de) {
            zz('de').innerHTML = P.veDe(de, false);
            return P.phanThi(e(de.EXAMSTRUCTID));
        }).then(function (ds) {
            s.phan = ds.filter(function (x) { return x.KIEULAMBAITHI === 'THITULUANVANBAN'; });
            pat.fill(selPhan, s.phan, { name: 'TITLE', head: 'Chọn phần thi' });
            if (s.phan.length === 1) { selPhan.value = s.phan[0].ID; if (window.jQuery) jQuery(selPhan).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'thông tin đề thi'); }).then(tai);
        if (window.jQuery) jQuery(selPhan).on('select2:select select2:clear', function () { tai(); });

        /* ---------- Chi tiết bài thi ------------------------------------- */
        function ketQua(id) {
            var r = s.rows.filter(function (x) { return e(x.STUDENTEXAMROOMID) === id; })[0];
            if (!r) return;
            g('TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI', { versionAPI: V, strExamRoomInfoId: room.ID, strStudentExamRoomId: id,
                strThiSinhId: r.USERID, strUserId: P.uid(), strKieuLamBai: kieuLamBai() }).then(function (res) {
                ui.dialog({ title: 'Chi tiết bài thi — ' + e(r.FULLNAME), icon: 'fa-file-lines', size: 'xl',
                    body: '<div class="ct-ketqua">' + e(res.data) + '</div>' });
            }).catch(function (err) { ums.api.handle(err, 'chi tiết bài thi'); });
        }

        /* ---------- Công nhận điểm --------------------------------------- */
        function congNhan() {
            if (!phanId()) { ui.toast('Bạn chưa chọn phần thi', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thực hiện không?', { title: 'Công nhận điểm', ok: 'Công nhận' }).then(function (yes) {
                if (!yes) return;
                var calls = [];
                s.rows.forEach(function (r, i) {
                    var o1 = zz('ts').querySelector('[data-diem="' + i + '"]'), o2 = zz('ts').querySelector('[data-ghichu="' + i + '"]');
                    var diem = o1 ? o1.value.trim() : '', gc = o2 ? o2.value : '';
                    if (diem === e(r.MARKTULUAN) && gc === e(r.GHICHUTULUAN)) return;
                    calls.push({ action: QL + 'Sua_CongNhanDiem_TuLuan', versionAPI: V, strId: tong ? r.ID : r.STUDENTEXAMROOMPARTID,
                        strMark: diem, strGhiChu: gc, strNguoiThucHien_Id: P.uid() });
                });
                if (!calls.length) { ui.toast('Không có điểm nào thay đổi', 'info'); return; }
                ui.batch(calls, { title: 'Công nhận điểm', okText: 'Cập nhật thành công' }).then(function () { tai(); });
            });
        }

        host.addEventListener('click', function (ev) {
            var ip = ev.target.closest('[data-ip]');
            if (ip) {
                var r = s.rows.filter(function (x) { return e(x.ID) === ip.getAttribute('data-ip'); })[0];
                if (r) P.xemIP(r);
                return;
            }
            var kq = ev.target.closest('[data-kq]');
            if (kq) { ketQua(kq.getAttribute('data-kq')); return; }
            var a = ev.target.closest('button[data-ct]');
            if (!a) return;
            var k = a.getAttribute('data-ct');
            if (k === 'refresh') tai();
            else if (k === 'congnhan') congNhan();
            else if (k === 'taifile') P.baoCao(host.querySelector('select[data-ct="bc"]').value, room.ID, phanId());
        });

        return function () {
            var ts = zz('ts');
            if (ts && ts._demDung) ts._demDung();
        };
    }
})();
