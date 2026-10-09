/* =========================================================================
   Quản lý phúc tra, phúc khảo (thi trắc nghiệm) — danh sách phòng thi + chi tiết phòng THAY CHỖ danh sách (một cột như gốc)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlyphuctraphuckhao/html/quanlyphuctraphuckhao.html + script/quanlyphuctraphuckhao.js
   Khung: ums.coiThi.manPhong (ApisCongCanBo/Modules/coithi/script/_phongthi.js — ba màn gốc của Cổng cán bộ chép cùng
   khối "danh sách phòng thi → chi tiết phòng" với màn này).
   ---------------------------------------------------------------------------
   Lời gọi (action kiểu cũ, không func, không iM — chép nguyên):
     Đơn vị      QLTTN_ThongTin/LayDS_DonViByUserId GET strUserId → ID, NAME
     Đợt thi     QLTTN_QuanLyThi/LayDS_DotThi GET strStatus '1' → ID, NAME
     Phòng thi   QLTTN_QuanLyThi/LayDS_ThongTinPhongThi GET versionAPI v1.0, strDonVi_Id, strDotThi_Id, strTrangThaiPhongThi,
                 strStatus, strTuNgay, strDenNgay, strTuKhoa, strNguoiDung_Id, PageNumber, ItemPerPage — cột ROOMNAME, COURSENAME,
                 EXAMDATE, TENDOTTHI, OPENSTATUS, STATUS, SOLUONGTHISINH, TENDONVI, EXAMSTRUCTID. Nút "Chi tiết phòng" CHỈ ở phòng
                 đã đóng (OPENSTATUS = 0) như gốc.
     Đề thi      QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail GET strExamRoomInfoId → [0]: EXAMSTRUCTID, GENSTYLETEXT, EXAMSTRUCTNAME,
                 DATAODE, TOLTALQUESTION, WRITETENEXAMNAME
     Phần thi    QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart GET strExamStructId… (PARENTID null) → ô "Chọn phần thi"
     Thí sinh    QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua GET versionAPI v1.0, strExamStructPartId, strCoTinhLaiDiem '1',
                 strExamRoomInfoId, strNguoiTao_Id, PageNumber, ItemPerPage (phân trang máy chủ) — cột STUDENTCODE, FULLNAME,
                 BIRTHDATE_USER, SOBAODANHIMPORT, MARK, MARKPHUCTRA, GHICHUPHUCTRA, TIMERCOUNTDOWN / TIMERSHOW / THOIGIANCONLAI /
                 FINISHED / TIMESTARTDOEXAM_TEXT (tình trạng), TIMEHHMISSSTARTDOEXAM, TENMAYDADANGNHAP, USERID.
                 Dữ liệu trả về nhận cả hai dạng: mảng (như gốc đọc) hoặc { ChiTietPhongThi: [...] } (các màn anh em).
     Cập nhật    QLTTN_QuanLyThi/save_DiemPhucTra POST versionAPI v1.0, strId (= ID dòng thí sinh), strMarkPhucTra,
                 strGhiChuPhucTra, strNguoiThucHien_Id — mỗi dòng một lời gọi (ums.ui.batch).
     Báo cáo     SYS_Report/ThemMoi POST strTuKhoa / strDuLieu (ExamRoomInfo_Id, strReportCode, strNguoiDangNhap_Id) → mở
                 rootPathReport?id=… (ums.coiThi.baoCao với goc 'heThong', khongPhanThi). Mẫu: BAOCAODIEM, THONGKETYLESUDUNGCAUHOI.
     Bài thi     TTN_ThiSinh/gen_KetQuaThi GET versionAPI v1.0, strExamRoomInfoId, strStudentExamRoomId, strThiSinhId (USERID),
                 strUserId → HTML bài làm (xem bên dưới).
   Khác gốc / lỗi gốc đã sửa:
     · "Cập nhật": gốc so ô điểm phúc tra với `dt.MARK` trong đó dt là MẢNG (luôn undefined) → gửi MỌI dòng có điểm phúc tra
       khác rỗng, kể cả dòng không sửa; nay chỉ gửi dòng có điểm phúc tra HOẶC ghi chú khác giá trị đã nạp, hỏi lại trước, chạy
       hàng loạt có tiến độ rồi nạp lại (gốc hẹn 2 giây).
     · "Chi tiết bài thi" (cột Xem kết quả): gốc gọi me.gen_KetQuaThi — hàm KHÔNG có trong tệp → lỗi JS, chưa từng chạy. Nay làm
       theo ý định (bản gen_KetQuaThi của màn quanlythi cùng phân hệ): gọi TTN_ThiSinh/gen_KetQuaThi, hiện trong hộp thoại kèm
       nút "In bài thi" (ums.ui.print). Đường ĐỌC, không ghi. Gốc còn gọi MathJax để vẽ công thức — _v2 không nạp MathJax.
     · Dòng chân bảng "Tổng số / Số Đạt / Số Không Đạt" của gốc luôn là 0 (biến không bao giờ được cộng) → bỏ.
     · Cột ô đánh dấu ở cả hai bảng: không nút nào dùng (Cập nhật lấy MỌI dòng) → bỏ.
     · Ô "Chi tiết phòng" chỉ hiện với phòng đã đóng — giữ như gốc (ums.coiThi.cotPhong chiTietKhi).
     · Nút "Đóng" của gốc có ba cái (đầu khung, thanh công cụ, chân khung) → một nút ở đầu trang (luật một nút Đóng).
     · Ô từ khoá của gốc khai đúng id ở màn này nên vẫn gửi như cũ; mở màn KHÔNG tự nạp danh sách — chờ bấm Tìm kiếm (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var root = document.getElementById('qlttn-quanlyphuctraphuckhao');
    if (!root) return;

    P.manPhong(root, {
        tieuDe: 'Quản lý phúc tra, phúc khảo',
        donVi: 'QLTTN_ThongTin/LayDS_DonViByUserId',
        action: QL + 'LayDS_ThongTinPhongThi',
        locTrangThai: true, locStatus: true, tacVu: false,
        cot: { gioThi: false, anHien: true, chiTietKhi: function (x) { return e(x.OPENSTATUS) === '0'; } },
        chiTiet: chiTiet
    });

    /* =====================================================================
       Chi tiết phòng thi (gốc zoneChiTiet): thông tin phòng / đề + bảng thí sinh với ô điểm phúc tra, ghi chú
       ===================================================================== */
    function chiTiet(room, host) {
        var st = { page: 1, size: 10, rows: [] }, structId = e(room.EXAMSTRUCTID);
        host.innerHTML = P.thongTin(room, {}) +
            pat.panel({ title: 'Danh sách thí sinh', icon: 'fa-users', count: 'tsn', flush: true, zone: 'ts', cls: 'ct-ds',
                tools: '<div class="ct-tools">' +
                    '<div class="ums-field"><select class="ums-select" data-ct="phan" data-ph="Chọn phần thi"><option value="">Chọn phần thi</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-ct="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option>' +
                        '<option value="BAOCAODIEM">Báo cáo điểm</option><option value="THONGKETYLESUDUNGCAUHOI">Thống kê tỷ lệ sử dụng câu hỏi</option></select></div>' +
                    ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-ct': 'taifile' } }) +
                    ui.btn('save', { text: 'Cập nhật', attr: { 'data-ct': 'capnhat' } }) +
                    ui.btn('reload', { attr: { 'data-ct': 'refresh' } }) +
                    '</div>' });
        ui.enhance(host);
        var selPhan = host.querySelector('[data-ct="phan"]'), ts = host.querySelector('[data-z="ts"]');

        /* Thông tin đề thi + phần thi — như gốc: LayDS_ExamRoomInfoDetail → EXAMSTRUCTID → LayDS_ExamStructPart */
        P.chiTietDe(room.ID).then(function (de) {
            var z = host.querySelector('[data-z="de"]');
            if (z) z.innerHTML = P.veDe(de, true);
            structId = e(de.EXAMSTRUCTID) || structId;
            return P.phanThi(structId);
        }).then(function (ds) { pat.fill(selPhan, ds, { name: 'TITLE', head: 'Chọn phần thi' }); })
          .catch(function (err) { ums.api.handle(err, 'thông tin đề thi'); });

        function taiTS(page) {
            if (page) st.page = page;
            ts.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return g(QL + 'LayDS_ChiTietPhongThi_KetQua', {
                versionAPI: V, strExamStructPartId: selPhan.value, strCoTinhLaiDiem: '1', strExamRoomInfoId: room.ID,
                strNguoiTao_Id: P.uid(), PageNumber: st.page, ItemPerPage: st.size
            }).then(function (r) {
                var d = r.data;
                st.rows = Array.isArray(d) ? d : arr((d || {}).ChiTietPhongThi);
                var tong = Number(r.pager) || st.rows.length;
                host.querySelector('[data-z="tsn"]').textContent = '(' + tong + ')';
                ui.table({ el: ts, rows: st.rows, empty: 'Không có thí sinh', columns: [
                    { title: 'Mã thí sinh', prop: 'STUDENTCODE', cls: 'is-center is-nowrap' },
                    { title: 'Họ và tên', prop: 'FULLNAME', cls: 'ct-cot-ten' },
                    { title: 'Ngày sinh', prop: 'BIRTHDATE_USER', cls: 'is-center is-nowrap' },
                    { title: 'Số báo danh', prop: 'SOBAODANHIMPORT', cls: 'is-center' },
                    { title: 'Điểm công nhận', prop: 'MARK', cls: 'is-center' },
                    { title: 'Điểm phúc tra', cls: 'is-center', render: function (x, i) {
                        return '<input class="ums-input ums-input--sm ct-o" data-dpt="' + i + '" value="' + esc(e(x.MARKPHUCTRA)) + '" autocomplete="off">';
                    } },
                    { title: 'Ghi chú', render: function (x, i) {
                        return '<input class="ums-input ums-input--sm qlpt-gc" data-gc="' + i + '" value="' + esc(e(x.GHICHUPHUCTRA)) + '" autocomplete="off">';
                    } },
                    { title: 'Tình trạng', cls: 'is-center is-nowrap', render: function (x) { return P.tinhTrang(x, true); } },
                    { title: 'T/g BĐ làm bài', prop: 'TIMEHHMISSSTARTDOEXAM', cls: 'is-center is-nowrap' },
                    { title: 'Máy đã đăng nhập', prop: 'TENMAYDADANGNHAP', cls: 'is-center' },
                    { title: 'Xem kết quả', cls: 'is-center', render: function (x) {
                        return ui.btn('view', { text: 'Chi tiết bài thi', icon: 'fa-eye', mod: 'out-primary', cls: 'ums-btn--sm', attr: { 'data-kq': esc(x.ID) } });
                    } }
                ], page: { index: st.page, size: st.size, total: tong, onChange: taiTS, onSize: function (n) { st.size = n; taiTS(1); } } });
                P.demNguoc(ts);
            }).catch(function (err) { ts.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách thí sinh'); });
        }
        taiTS(1);
        if (window.jQuery) jQuery(selPhan).on('select2:select select2:clear', function () { taiTS(1); });

        /* Cập nhật điểm phúc tra: chỉ các dòng đã sửa (điểm hoặc ghi chú khác giá trị đã nạp) */
        function capNhat() {
            function o(k, i) { var x = ts.querySelector('[data-' + k + '="' + i + '"]'); return x ? x.value.trim() : ''; }
            var doi = [];
            st.rows.forEach(function (r, i) {
                var d = o('dpt', i), gc = o('gc', i);
                if (d !== e(r.MARKPHUCTRA).trim() || gc !== e(r.GHICHUPHUCTRA).trim()) doi.push({ r: r, d: d, gc: gc });
            });
            if (!doi.length) { ui.toast('Chưa có dòng nào thay đổi điểm phúc tra / ghi chú', 'warn'); return; }
            var sai = doi.filter(function (x) { return x.d !== '' && isNaN(Number(x.d.replace(',', '.'))); });
            if (sai.length) { ui.toast('Điểm phúc tra phải là số: ' + sai.map(function (x) { return e(x.r.STUDENTCODE); }).join(', '), 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thực hiện không? (' + doi.length + ' thí sinh)', { title: 'Cập nhật điểm phúc tra', ok: 'Cập nhật' }).then(function (yes) {
                if (!yes) return;
                var calls = doi.map(function (x) {
                    return { action: QL + 'save_DiemPhucTra', method: 'POST', versionAPI: V, strId: x.r.ID, strMarkPhucTra: x.d,
                        strGhiChuPhucTra: x.gc, strNguoiThucHien_Id: P.uid() };
                });
                ui.batch(calls, { title: 'Đang cập nhật điểm phúc tra', okText: 'Cập nhật thành công' }).then(function () { taiTS(); });
            });
        }

        /* Chi tiết bài thi (theo ý định — gốc gọi hàm không tồn tại) */
        function ketQua(id) {
            var r = st.rows.filter(function (x) { return e(x.ID) === id; })[0];
            if (!r) return;
            g('TTN_ThiSinh/gen_KetQuaThi', { versionAPI: V, strExamRoomInfoId: room.ID, strStudentExamRoomId: id, strThiSinhId: e(r.USERID), strUserId: P.uid() })
                .then(function (res) {
                    var html = '<div class="ct-ketqua">' + (typeof res.data === 'string' ? res.data : '') + '</div>';
                    ui.dialog({ title: 'Kết quả bài thi — ' + e(r.FULLNAME), icon: 'fa-file-lines', size: 'xl', body: html,
                        buttons: [{ text: 'In bài thi', kind: 'print', keepOpen: true, onClick: function (dlg) {
                            ui.print(dlg.body.querySelector('.ct-ketqua'), { title: 'Bài thi - ' + e(r.STUDENTCODE) }); return false;
                        } }] });
                }).catch(function (err) { ums.api.handle(err, 'kết quả bài thi'); });
        }

        host.addEventListener('click', function (ev) {
            var kq = ev.target.closest('[data-kq]');
            if (kq) { ketQua(kq.getAttribute('data-kq')); return; }
            var b = ev.target.closest('button[data-ct]');
            if (!b) return;
            var k = b.getAttribute('data-ct');
            if (k === 'refresh') taiTS();
            else if (k === 'capnhat') capNhat();
            else if (k === 'taifile') P.baoCao(host.querySelector('select[data-ct="bc"]').value, room.ID, selPhan.value, { goc: 'heThong', khongPhanThi: true });
        });
        /* Dọn dẹp khi đóng khung: dừng đồng hồ đếm ngược */
        return function () { if (ts._demDung) ts._demDung(); };
    }
})();
