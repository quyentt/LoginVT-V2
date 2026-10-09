/* =========================================================================
   ums.diemHoc — bảng điểm & học tập chi tiết của MỘT người học (dùng chung)
   =========================================================================
   Bản viết lại của lớp DiemHoc (Cổng sinh viên "diemhoc", chép nguyên vào
   hoatdong/DaQHHT.html của Cổng cán bộ). Một khung, gọi bằng id người học:

       var dh = ums.diemHoc.mount(host, { nguoiHocId: 'QLSV_NGUOIHOC_ID' });
       dh.destroy()

   Bố cục bản gốc: cột trái (col-3) ô Chương trình, thông tin người học,
   "Điểm mới", "Tổng điểm"; cột phải (col-9) tám tab: Bảng điểm · Học phần nợ ·
   Khối kiến thức · Kết quả đăng ký học · Quyết định · Văn bằng - chứng chỉ ·
   Cảnh báo học vụ · Điểm rèn luyện.
   Lời gọi (chép nguyên, mã hoá) — SV_ThongTin_MH · pkg_congthongtin_hssv_thongtin.*:
       LayThongTinChuongTrinhHoc      ô Chương trình (tự chọn mục đầu)
       KetQuaHocTapCaNhan             thông tin, điểm mới, tổng điểm, bảng điểm, học phần nợ
       LayKetQuaTichLuyTheoKhoi       khối kiến thức (rsTongHop, rsChiTiet)
       LayDSKetQuaXuLyHocVu           cảnh báo học vụ
       LayDSThoiGianLichHoc / LayKetQuaDangKyHocCaNhan   kết quả đăng ký + lịch sử
       LayDSDiemThanhPhanTheoTKHP     hộp "Chi tiết điểm thành phần"
       LayDSQDCaNhan · LayDSTN_KetQua_CongNhan_VB · LayKQRenLuyenCaNhan
   Khác bản gốc (lỗi rõ):
     · Mỗi lần mở gắn thêm trình xử lý → N lần mở thì một bấm gọi N lần. Ở đây
       mỗi khung một bộ trình xử lý, gỡ khi destroy.
     · Dòng "Điểm trung bình hệ 10" của từng học kỳ lấy nhầm điểm TÍCH LUỸ.
     · Điểm rèn luyện nạp một lần theo chương trình lúc mở (có khi của người học
       trước) — ở đây nạp lại khi đổi chương trình.
   Nút "Điểm quá trình": trang gốc của Cổng SV CÓ hộp nên nút mở hộp thật
   (LatKetQuaDiemQuaTrinh). Màn chép lại mà không có nguồn thì truyền
   o.diemQuaTrinh = false để giữ nút khoá như trước.
   Kéo gốc 30/9 (Cổng SV hoctap/diemhoc):
     · Bấm CẢ DÒNG bảng điểm là mở "Chi tiết điểm thành phần" (gốc: tr.row-diem), không
       chỉ nút Chi tiết — veBangDiem gắn data-tp lên <tr> khi có cột Chi tiết (chiTiet !== false),
       nên mọi nơi có nút Chi tiết đều được; nơi tắt cột (In bảng điểm, QLD) không đổi.
     · Tổng điểm thêm dòng "Tổng số tín chỉ chương trình" ← TONGSOTINCHICTDT và đổi chữ hai
       dòng tín chỉ ("đã học", "đã tích lũy") — QUA TUỲ CHỌN veTongKet(el, lay, { ctdt: true }) /
       mount(host, { ctdt: true }); mặc định giữ sáu dòng cũ (bản chép ở CCB DaQHHT không đổi).
       mount(host, { ctdt: true }) = "khuôn Cổng SV mới": có cả dòng CTDT lẫn bấm cả dòng (XLHV nhúng
       CHÍNH trang Cổng SV nên bật); không có ctdt (CCB DaQHHT) thì bảng điểm chỉ mở bằng nút Chi tiết như cũ.
       Gọi thẳng veBangDiem mặc định BẬT bấm cả dòng (Cổng SV diemhoc); tắt bằng { bamDong: false }.
     · Bảng rỗng: câu "chưa có …" riêng từng bảng như gốc (showEmptyState), trong khung
       rỗng chuẩn của ums.ui.table (biểu tượng chuẩn, không chép biểu tượng riêng từng bảng).
     · Gốc đổi resolveNguoiHocId: khi nhúng chỉ lấy main_doc.LichGiang.strSinhVien_Id (bỏ
       window._embeddedSinhVien_Id — trang XLHV gốc nhúng bằng biến đó nay rơi về id CÁN BỘ, lỗi của gốc).
       Ở đây id người học luôn truyền vào mount (o.nguoiHocId) nên không đổi, không lặp lỗi đó.
   ========================================================================= */
(function (global) {
    'use strict';
    var ums = global.ums || (global.ums = {});
    var ui = ums.ui, pat = ums.pat;
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function uid() { return (ums.session && ums.session.userId) || ''; }
    var A = 'SV_ThongTin_MH/', F = 'pkg_congthongtin_hssv_thongtin.';
    function goi(a, f, o) { return ums.api.call(Object.assign({ action: A + a, func: F + f, silent: true, strNguoiThucHien_Id: uid() }, o)); }

    var TAB = [
        { key: 'bangdiem', text: 'Bảng điểm' }, { key: 'no', text: 'Học phần nợ' }, { key: 'khoi', text: 'Khối kiến thức' },
        { key: 'dangky', text: 'Kết quả đăng ký học' }, { key: 'qd', text: 'Quyết định' }, { key: 'vb', text: 'Văn bằng - chứng chỉ' },
        { key: 'canhbao', text: 'Cảnh báo học vụ' }, { key: 'drl', text: 'Điểm rèn luyện' }
    ];
    function mauDiem(d) {
        d = Number(d);
        if (d === 0) return 'is-0'; if (d >= 8.5) return 'is-gioi'; if (d >= 7) return 'is-kha'; if (d >= 5) return ''; if (d >= 3) return 'is-yeu';
        return '';
    }

    /* Bảng điểm: mỗi học kỳ (NAMHOC + "_" + HOCKY, thứ tự gặp đầu) một khối, kèm lưới tổng kết */
    /* Tổng kết điểm — SÁU dòng "nhãn — giá trị" đúng chữ bản gốc, nhãn dạt trái,
       số dạt phải, xếp HAI CỘT cho đỡ dài (người dùng chốt 2026-09-23; khối dưới
       bảng học kỳ rộng hơn nên tự lên ba cột, xem .ums-dh__tk--ky).
       `lay(loaiDiemTrungBinh, thangDiem, tenCot)` do nơi gọi truyền vào.
       o.ngan = true (CỘT TRÁI, chỉ rộng ~250px): nhãn rút gọn, chữ đầy đủ của bản
       gốc để ở `title` — để nguyên thì "Điểm trung bình tích lũy hệ 10" gãy ba dòng.
       o.tenTinChi: khối học kỳ giữ chữ "Tổng tín chỉ" của bản gốc.
       o.ctdt = true (Cổng SV, kéo gốc 30/9): thêm dòng đầu "Tổng số tín chỉ chương trình"
       (TONGSOTINCHICTDT của cùng bản ghi TRUNGBINHCHUNG hệ 10) và đổi chữ thành "Tổng số tín
       chỉ đã học" / "Tổng số tín chỉ đã tích lũy" — đúng nhãn html gốc mới. */
    function veTongKet(el, lay, o) {
        o = o || {};
        var muc = (o.ctdt ? [['Tổng số tín chỉ chương trình', 'TC chương trình', 'TRUNGBINHCHUNG', 10, 'TONGSOTINCHICTDT']] : []).concat([
            [o.tenTinChi || (o.ctdt ? 'Tổng số tín chỉ đã học' : 'Tổng số tín chỉ'), o.ctdt ? 'TC đã học' : 'Tổng tín chỉ', 'TRUNGBINHCHUNG', 10, 'TONGSOTINCHI'],
            [o.ctdt ? 'Tổng số tín chỉ đã tích lũy' : 'Tổng số tín chỉ tích lũy', o.ctdt ? 'TC đã tích lũy' : 'Tín chỉ tích lũy', 'TRUNGBINHTICHLUY', 10, 'TONGSOTINCHI'],
            ['Điểm trung bình hệ 10', 'TB hệ 10', 'TRUNGBINHCHUNG', 10, 'DIEMTRUNGBINH'],
            ['Điểm trung bình hệ 4', 'TB hệ 4', 'TRUNGBINHCHUNG', 4, 'DIEMTRUNGBINH'],
            ['Điểm trung bình tích lũy hệ 10', 'TB tích lũy hệ 10', 'TRUNGBINHTICHLUY', 10, 'DIEMTRUNGBINH'],
            ['Điểm trung bình tích lũy hệ 4', 'TB tích lũy hệ 4', 'TRUNGBINHTICHLUY', 4, 'DIEMTRUNGBINH']]);
        el.innerHTML = muc.map(function (x) {
            return '<div' + (o.ngan ? ' title="' + esc(x[0]) + '"' : '') + '><span>' + esc(o.ngan ? x[1] : x[0]) +
                '</span><b>' + esc(e(lay(x[2], x[3], x[4]))) + '</b></div>';
        }).join('');
    }

    function veBangDiem(el, rows, tbRows, o) {
        o = o || {};
        var nhom = [], theo = {};
        rows.forEach(function (r) { var k = e(r.NAMHOC) + '_' + e(r.HOCKY); if (!theo[k]) { theo[k] = []; nhom.push(k); } theo[k].push(r); });
        if (!nhom.length) { el.innerHTML = ui.empty('Chưa có dữ liệu', 'fa-file-circle-xmark'); return; }
        var ky = arr(tbRows).filter(function (x) { return x.DAOTAO_THOIGIANDAOTAO_ID && Number(x.THUOCTINHLANTINH) === 0 && !x.DOTHOC && x.PHAMVITONGHOPDIEM_TEN === 'HOCKY'; });
        el.innerHTML = nhom.map(function (k, i) {
            var r0 = theo[k][0];
            /* Đàn xếp (behavior.accordion) thì chỉ mở sẵn học kỳ đầu; tắt đàn xếp thì mở hết như trước */
            var moSan = (ums.cfg && ums.cfg.behavior && ums.cfg.behavior.accordion === false) || i === 0;
            return '<details class="ums-dh__ky"' + (moSan ? ' open' : '') + '><summary>Năm học ' + esc(e(r0.NAMHOC)) + ' - Học kỳ ' + esc(e(r0.HOCKY)) + '</summary><div data-ky="' + i + '"></div></details>';
        }).join('');
        nhom.forEach(function (k, i) {
            var host2 = el.querySelector('[data-ky="' + i + '"]'), r0 = theo[k][0];
            ui.table({ el: host2, rows: theo[k], empty: 'Chưa có dữ liệu', columns: [
                { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }, { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }, { title: 'Điểm hệ 10', prop: 'DIEM', cls: 'is-center' },
                { title: 'Điểm hệ 4', prop: 'DIEMQUYDOI', cls: 'is-center' }, { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', cls: 'is-center' },
                { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }].concat(o.ghiChu === false ? [] : [{ title: 'Ghi chú', prop: 'GHICHU' }],
                o.chiTiet === false ? [] : [{ title: 'Chi tiết', cls: 'is-center', render: function (x) { return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-tp="' + esc(x.ID) + '"><i class="fa-light fa-eye"></i><span>Chi tiết</span></button>'; } }])
            });
            /* Bấm CẢ DÒNG mở điểm thành phần (gốc Cổng SV 30/9: tr.row-diem) — trình xử lý của nơi gọi
               bắt [data-tp] nên chỉ cần gắn thuộc tính lên <tr>; chỉ khi có cột Chi tiết.
               o.bamDong === false tắt (mount của bản CCB DaQHHT — gốc màn đó không đổi). */
            if (o.chiTiet !== false && o.bamDong !== false) host2.querySelectorAll('tbody tr[data-id]').forEach(function (tr) {
                tr.setAttribute('data-tp', tr.getAttribute('data-id'));
                tr.classList.add('ums-dh__dong');
                tr.title = 'Bấm để xem chi tiết điểm thành phần';
            });
            var cua = ky.filter(function (x) { return e(x.NAMHOC) === e(r0.NAMHOC) && String(e(x.DAOTAO_THOIGIANDAOTAO_KY)) === String(e(r0.HOCKY)); });
            function lay(loai, thang, truong) { var x = cua.filter(function (y) { return y.LOAIDIEMTRUNGBINH_MA === loai && String(y.THANGDIEM_MA) === String(thang); })[0]; return x && x[truong] !== null && x[truong] !== undefined ? x[truong] : '...'; }
            /* Tổng kết học kỳ nằm NGOÀI bảng (người dùng yêu cầu 2026-09-23): để trong
               <tfoot> thì nó nằm trong .ums-tablewrap nên bị kéo ngang theo bảng, cuộn
               sang phải là mất hút. Nay là khối riêng ngay dưới bảng, luôn đứng yên. */
            var box = document.createElement('div');
            box.className = 'ums-dh__tk ums-dh__tk--ky';
            veTongKet(box, lay, { tenTinChi: 'Tổng tín chỉ' });
            host2.appendChild(box);
        });
    }
    /* Khối kiến thức: rsTongHop (có dòng Tổng) + rsChiTiet (ô khối lặp để trống, STT theo từng khối) */
    function veTichLuy(el, d) {
        el.innerHTML = '<div class="ums-legend">Tổng điểm theo khối</div><div data-k="th"></div><div class="ums-legend">Tổng hợp chi tiết theo khối và học phần</div><div data-k="ct"></div>';
        ui.table({ el: el.querySelector('[data-k="th"]'), rows: arr(d.rsTongHop), empty: 'Hiện tại chưa có khối kiến thức nào', columns: [
            { title: 'Mã khối', prop: 'MAKHOI' }, { title: 'Tên khối', prop: 'TENKHOI' },
            { title: 'Tổng số tín chỉ', prop: 'TONGSOTINCHICUAKHOI', cls: 'is-center', sum: true }, { title: 'Tổng số tín bắt buộc', prop: 'SOBATBUOC', cls: 'is-center', sum: true },
            { title: 'Tổng số tín đã tích lũy', prop: 'SODATICHLUY', cls: 'is-center', sum: true }] });
        /* Gộp ô Mã khối / Tên khối liền nhau (actionRowSpan của gốc): ô lặp để trống */
        var rs = arr(d.rsChiTiet), sttKhoi = 0;
        ui.table({ el: el.querySelector('[data-k="ct"]'), stt: false, rows: rs, empty: 'Chưa có chi tiết theo khối và học phần', columns: [
            { title: 'Mã khối', render: function (x, i) { return i && rs[i - 1].MAKHOI === x.MAKHOI ? '' : '<b>' + esc(e(x.MAKHOI)) + '</b>'; } },
            { title: 'Tên khối', render: function (x, i) { return i && rs[i - 1].MAKHOI === x.MAKHOI ? '' : esc(e(x.TENKHOI)); } },
            { title: 'STT', cls: 'is-center', render: function (x, i) { sttKhoi = i && rs[i - 1].MAKHOI === x.MAKHOI ? sttKhoi + 1 : 1; return sttKhoi; } },
            { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
            { title: 'Số tín chỉ', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }, { title: 'Điểm', prop: 'DIEM', cls: 'is-center' },
            { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Điểm quy đổi', prop: 'DIEMQUYDOI', cls: 'is-center' },
            { title: 'Điểm chữ', prop: 'DIEMQUYDOI_TEN', cls: 'is-center' },
            { title: 'Kết quả', cls: 'is-center', render: function (x) { return Number(x.KETQUA) === 1 ? 'Hoàn thành' : ''; } },
            { title: 'Ghi chú', render: function (x) { return Number(x.HOCPHANTHUA) === 1 ? esc('Thừa ' + e(x.HOCPHANTHUA_LOAIXULY)) : ''; } }] });
    }
    /* Điểm rèn luyện: ba bảng Kỳ / Năm / Toàn khóa (họ tên đọc HODEM/TEN, thiếu thì QLSV_NGUOIHOC_HODEM/TEN) */
    function veRenLuyen(el, d) {
        el.innerHTML = '<div class="ums-legend">Kỳ</div><div data-k="ky"></div><div class="ums-legend">Năm</div><div data-k="nam"></div>' +
            '<div class="ums-legend">Toàn khóa</div><div data-k="tk"></div>';
        var co = [{ title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' }, { title: 'Họ tên', render: function (x) { return esc(e(x.HODEM || x.QLSV_NGUOIHOC_HODEM) + ' ' + e(x.TEN || x.QLSV_NGUOIHOC_TEN)); } },
            { title: 'Chương trình', render: function (x) { return esc(e(x.DAOTAO_TOCHUCCHUONGTRINH_TEN) + ' (' + e(x.DAOTAO_TOCHUCCHUONGTRINH_MA) + ')'); } },
            { title: 'Điểm', prop: 'DIEM', cls: 'is-center' }, { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' }];
        var tg = { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' };
        ui.table({ el: el.querySelector('[data-k="ky"]'), rows: arr(d.rsKy), empty: 'Hiện tại chưa có điểm rèn luyện theo kỳ', columns: co.concat([tg]) });
        ui.table({ el: el.querySelector('[data-k="nam"]'), rows: arr(d.rsNam), empty: 'Hiện tại chưa có điểm rèn luyện theo năm', columns: co.concat([tg]) });
        ui.table({ el: el.querySelector('[data-k="tk"]'), rows: arr(d.rsToanKhoa), empty: 'Hiện tại chưa có điểm rèn luyện toàn khóa', columns: co });
    }

    function mount(host, o) {
        var nh = o.nguoiHocId;
        host.innerHTML =
            '<div class="ums-dh">' +
                '<aside class="ums-dh__trai">' +
                    ui.field('Chương trình', '<select class="ums-select" data-dh="ct" data-ph="Chọn chương trình"><option value=""></option></select>') +
                    '<div class="ums-dh__tt" data-dh="tt"></div>' +
                    '<div class="ums-dh__nhom">Điểm mới</div><ul class="ums-dh__moi" data-dh="moi"></ul>' +
                    '<div class="ums-dh__nhom">Tổng điểm</div><div class="ums-dh__tk" data-dh="tong"></div>' +
                '</aside>' +
                '<div class="ums-dh__phai">' + ui.tabs(TAB, 'bangdiem', 'data-dhtab') +
                    TAB.map(function (t, i) { return '<div class="ums-dh__pane" data-dhpane="' + t.key + '"' + (i ? ' hidden' : '') + '></div>'; }).join('') +
                '</div>' +
            '</div>';
        ui.enhance(host);
        function q(k) { return host.querySelector('[data-dh="' + k + '"]'); }
        function pane(k) { return host.querySelector('[data-dhpane="' + k + '"]'); }
        function dangTai(el) { el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin'); }
        var tb = { rsDiemTrungBinhChung: [] };

        /* ---------- Tab --------------------------------------------------- */
        function onClick(ev) {
            var t = ev.target.closest('[data-dhtab]');
            if (t) {
                var k = t.getAttribute('data-dhtab');
                ui.tabsActive(host, k, 'data-dhtab');
                TAB.forEach(function (x) { pane(x.key).hidden = x.key !== k; });
                return;
            }
            var b = ev.target.closest('[data-tp]');
            if (b) { thanhPhan(b.getAttribute('data-tp')); return; }
            b = ev.target.closest('[data-qt]');
            if (b) quaTrinh(b.getAttribute('data-qt'), b.getAttribute('data-qtten'));
        }
        host.addEventListener('click', onClick);

        /* ---------- Chương trình → KQ học tập, tích luỹ, cảnh báo, rèn luyện - */
        function ct() { return q('ct').value; }
        function theoChuongTrinh() {
            if (!ct()) return;
            ketQuaHocTap(); tichLuy(); canhBao(); renLuyen();
        }
        goi('DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP', 'LayThongTinChuongTrinhHoc', { strQLSV_NguoiHoc_Id: nh }).then(function (r) {
            var d = arr(r.data);
            pat.fill(q('ct'), d, { id: 'DAOTAO_TOCHUCCHUONGTRINH_ID', name: 'DAOTAO_CHUONGTRINH_TEN', head: 'Chọn chương trình' });
            if (d.length) { q('ct').value = d[0].DAOTAO_TOCHUCCHUONGTRINH_ID; if (global.jQuery) jQuery(q('ct')).trigger('change.select2'); theoChuongTrinh(); }
            else TAB.forEach(function (x) { if (['bangdiem', 'no', 'khoi', 'canhbao', 'drl'].indexOf(x.key) >= 0) pane(x.key).innerHTML = ui.empty('Người học chưa có chương trình học', 'fa-circle-info'); });
        }).catch(function (err) { pane('bangdiem').innerHTML = ui.fail(err.message); });
        if (global.jQuery) jQuery(q('ct')).on('select2:select', theoChuongTrinh);

        function ketQuaHocTap() {
            dangTai(pane('bangdiem')); dangTai(pane('no'));
            goi('CiQ1EDQgCS4iFSAxAiAPKSAv', 'KetQuaHocTapCaNhan', { strQLSV_NguoiHoc_Id: nh, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
                var d = r.data || {};
                tb = d;
                var t = arr(d.rsThongTinNguoiHoc)[0] || {};
                /* Bản gốc (ApisCongSinhVien/Modules/hoctap/script/diemhoc.js:179-184) đọc cột
                   QLSV_NGUOIHOC_* — trước đây đọc HODEM/TEN/NGAYSINH/GIOITINH nên với dữ liệu
                   thật bốn dòng này trống (gặp ở cả CCB/hoatdong/DaQHHT). Giữ tên cũ làm dự phòng. */
                q('tt').innerHTML = [['Họ tên', e(t.QLSV_NGUOIHOC_HODEM || t.HODEM) + ' ' + e(t.QLSV_NGUOIHOC_TEN || t.TEN)],
                    ['Mã số', t.QLSV_NGUOIHOC_MASO], ['Ngày sinh', t.QLSV_NGUOIHOC_NGAYSINH || t.NGAYSINH], ['Giới tính', t.QLSV_NGUOIHOC_GIOITINH || t.GIOITINH],
                    ['Trạng thái', t.QLSV_TRANGTHAINGUOIHOC_TEN], ['Lớp', t.DAOTAO_LOPQUANLY_TEN]].map(function (x) {
                    return '<div><span>' + esc(x[0]) + ':</span> <b>' + esc(e(x[1])) + '</b></div>'; }).join('');
                q('moi').innerHTML = arr(d.rsDiemMoiNhat).map(function (x) {
                    return '<li><span>' + esc(e(x.DAOTAO_HOCPHAN_TEN) + ' - ' + e(x.DAOTAO_HOCPHAN_MA)) + '</span><b class="' + mauDiem(x.DIEM) + '">' + esc(e(x.DIEM)) + '</b></li>';
                }).join('') || '<li class="ums-u-muted">Chưa có điểm</li>';
                var chung = arr(d.rsDiemTrungBinhChung).filter(function (x) { return (x.DAOTAO_THOIGIANDAOTAO_ID === null || x.DAOTAO_THOIGIANDAOTAO_ID === undefined || x.DAOTAO_THOIGIANDAOTAO_ID === '') && Number(x.THUOCTINHLANTINH) === 0; });
                function lay(loai, thang, truong) { var x = chung.filter(function (y) { return y.LOAIDIEMTRUNGBINH_MA === loai && String(y.THANGDIEM_MA) === String(thang); })[0]; return x ? e(x[truong]) : ''; }
                veTongKet(q('tong'), lay, { ctdt: o.ctdt });
                bangDiem(arr(d.rsDiemKetThucHocPhan));
                ui.table({ el: pane('no'), rows: arr(d.rsHocPhanChuaHoanThanh), empty: 'Hiện tại chưa có học phần nợ nào', columns: [
                    { title: 'Mã học phần', prop: 'DAOTAO_HOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên học phần', prop: 'DAOTAO_HOCPHAN_TEN' },
                    { title: 'Học trình', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center' }, { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' },
                    { title: 'Đánh giá', prop: 'DANHGIA_TEN', cls: 'is-center' }, { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' },
                    { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }, { title: 'Thời gian', prop: 'THOIGIAN', cls: 'is-center' },
                    { title: 'Lớp học phần', prop: 'DIEM_DANHSACHHOC_TEN', cls: 'is-center' }] });
            }).catch(function (err) { pane('bangdiem').innerHTML = ui.fail(err.message); pane('no').innerHTML = ui.fail(err.message); });
        }
        function bangDiem(rows) { veBangDiem(pane('bangdiem'), rows, tb.rsDiemTrungBinhChung, { bamDong: !!o.ctdt }); }
        function tichLuy() {
            dangTai(pane('khoi'));
            goi('DSA4CiQ1EDQgFSgiKQ00OBUpJC4KKS4o', 'LayKetQuaTichLuyTheoKhoi', { strQLSV_NguoiHoc_Id: nh, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
                veTichLuy(pane('khoi'), r.data || {});
            }).catch(function (err) { pane('khoi').innerHTML = ui.fail(err.message); });
        }
        function canhBao() {
            dangTai(pane('canhbao'));
            goi('DSA4BRIKJDUQNCAZNA04CS4iFzQP', 'LayDSKetQuaXuLyHocVu', { strQLSV_NguoiHoc_Id: nh, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
                ui.table({ el: pane('canhbao'), rows: arr(r.data), empty: 'Hiện tại chưa có cảnh báo học vụ nào', columns: [
                    { title: 'Thời gian', prop: 'THOIGIAN_HIENTHI', cls: 'is-center' }, { title: 'Mức xử lý', prop: 'MUCXULY_TEN' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' }, { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' }, { title: 'Ghi chú', prop: 'GHICHU' }] });
            }).catch(function (err) { pane('canhbao').innerHTML = ui.fail(err.message); });
        }
        function renLuyen() {
            dangTai(pane('drl'));
            goi('DSA4ChATJC8NNDgkLwIgDykgLwPP', 'LayKQRenLuyenCaNhan', { strQLSV_NguoiHoc_Id: nh, strDaoTao_ChuongTrinh_Id: ct() }).then(function (r) {
                veRenLuyen(pane('drl'), r.data || {});
            }).catch(function (err) { pane('drl').innerHTML = ui.fail(err.message); });
        }

        /* ---------- Kết quả đăng ký học ----------------------------------- */
        pane('dangky').innerHTML = '<div class="ums-dh__tg">' + ui.field('Thời gian', '<select class="ums-select" data-dh="tg" data-ph="Chọn thời gian"><option value=""></option></select>') + '</div>' +
            '<div data-k="kq"></div><div class="ums-legend">Lịch sử đăng ký học</div><div data-k="ls"></div>';
        ui.enhance(pane('dangky'));
        function dangKy() {
            var kq = pane('dangky').querySelector('[data-k="kq"]'), ls = pane('dangky').querySelector('[data-k="ls"]');
            dangTai(kq);
            goi('DSA4CiQ1EDQgBSAvJgo4CS4iAiAPKSAv', 'LayKetQuaDangKyHocCaNhan', { strQLSV_NguoiHoc_Id: nh, strDaoTao_ThoiGianDaoTao_Id: q('tg').value }).then(function (r) {
                var d = r.data || {};
                ui.table({ el: kq, rows: arr(d.rsKetQuaDangKy), empty: 'Hiện tại chưa có kết quả đăng ký học nào', columns: [
                    { title: 'Mã lớp HP', prop: 'DANGKY_LOPHOCPHAN_MA', cls: 'is-nowrap' }, { title: 'Tên lớp HP', prop: 'DANGKY_LOPHOCPHAN_TEN' },
                    { title: 'Số tín', prop: 'DAOTAO_HOCPHAN_HOCTRINH', cls: 'is-center', sum: true }, { title: 'Giảng viên', prop: 'THONGTINGIANGVIEN' },
                    { title: 'Kiểu học', prop: 'KIEUHOC_TEN', cls: 'is-center' }, { title: 'Thời gian thực hiện', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Người thực hiện', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Học kỳ, đợt', prop: 'THOIGIAN', cls: 'is-center' },
                    { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    /* Nút "Điểm quá trình": trang gốc của Cổng SV CÓ hộp (#diem_qua_trinh) nên nút chạy
                       thật; bản chép ở CCB/hoatdong/DaQHHT không có hộp → màn nào không cần thì đặt
                       o.diemQuaTrinh = false để giữ nút khoá như trước. */
                    { title: 'Điểm quá trình', cls: 'is-center', render: function (x) {
                        return o.diemQuaTrinh === false
                            ? '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" disabled title="Màn này chưa có hộp hiển thị"><span>Điểm quá trình</span></button>'
                            : '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-qt="' + esc(e(x.DANGKY_LOPHOCPHAN_ID)) + '" data-qtten="' + esc(e(x.DANGKY_LOPHOCPHAN_TEN)) + '"><span>Điểm quá trình</span></button>'; } }] });
                ui.table({ el: ls, rows: arr(d.rsLichSuDangKy), empty: 'Hiện tại chưa có lịch sử đăng ký học nào', columns: [
                    { title: 'Người thực hiện', prop: 'NGUOITHUCHIEN_TAIKHOAN' }, { title: 'Hành động', prop: 'HANHDONG' }, { title: 'Kết quả', prop: 'KETQUA' },
                    { title: 'Thời gian thực hiện', prop: 'THOIGIANTHUCHIEN', cls: 'is-center is-nowrap' }, { title: 'Mã học phần', prop: 'MAHOCPHAN' },
                    { title: 'Tên học phần', prop: 'TENHOCPHAN' }, { title: 'Lớp học phần', prop: 'DSLOPHOCPHAN' },
                    { title: 'Mã chương trình', prop: 'DAOTAO_CHUONGTRINH_MA' }, { title: 'Tên chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN' }] });
            }).catch(function (err) { kq.innerHTML = ui.fail(err.message); });
        }
        goi('DSA4BRIVKS4oBiggLw0oIikJLiIP', 'LayDSThoiGianLichHoc', { strQLSV_NguoiHoc_Id: nh }).then(function (r) {
            pat.fill(q('tg'), arr(r.data), { name: 'THOIGIAN', head: 'Chọn thời gian' }); dangKy();
        }).catch(function () { dangKy(); });
        if (global.jQuery) jQuery(q('tg')).on('select2:select select2:clear', dangKy);

        /* ---------- Quyết định, văn bằng ---------------------------------- */
        dangTai(pane('qd')); dangTai(pane('vb'));
        goi('DSA4BRIQBQIgDykgLwPP', 'LayDSQDCaNhan', { strNguoiDung_Id: nh }).then(function (r) {
            ui.table({ el: pane('qd'), rows: arr(r.data), empty: 'Hiện tại chưa có quyết định nào', columns: [
                { title: 'Số quyết định', prop: 'SOQUYETDINH' }, { title: 'Ngày quyết định', prop: 'NGAYQUYETDINH', cls: 'is-center' },
                { title: 'Ngày hiệu lực', prop: 'NGAYHIEULUC', cls: 'is-center' }, { title: 'Nội dung', prop: 'NOIDUNG' }, { title: 'Loại quyết định', prop: 'LOAIQUYETDINH_TEN' }] });
        }).catch(function (err) { pane('qd').innerHTML = ui.fail(err.message); });
        goi('DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8eFwMP', 'LayDSTN_KetQua_CongNhan_VB', { strNguoiDung_Id: nh || uid() }).then(function (r) {
            ui.table({ el: pane('vb'), rows: arr(r.data), empty: 'Hiện tại chưa có văn bằng - chứng chỉ nào', columns: [
                { title: 'Loại chứng chỉ - văn bằng', prop: 'PHANLOAI_TEN' }, { title: 'Chương trình học', prop: 'CHUONGTRINH_TEN' },
                { title: 'Xếp loại', prop: 'XEPLOAI_TEN', cls: 'is-center' }, { title: 'Số hiệu', prop: 'SOHIEUBANG' }, { title: 'Số vào sổ', prop: 'SOVAOSOCAPBANG' }] });
        }).catch(function (err) { pane('vb').innerHTML = ui.fail(err.message); });

        /* ---------- Hộp "Điểm quá trình: <lớp>" ---------------------------
           Nút ở tab "Kết quả đăng ký học" (pkg_congthongtin_hssv_thongtin.LatKetQuaDiemQuaTrinh).
           Màn nào không có nguồn thì đặt o.diemQuaTrinh = false để nút chỉ hiện và khoá. */
        function quaTrinh(lopId, tenLop) {
            var dlg = ui.dialog({ title: 'Điểm quá trình: ' + e(tenLop), icon: 'fa-list-check', size: 'md',
                body: '<div data-k="qt">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var h = dlg.body.querySelector('[data-k="qt"]');
            goi('DSA1CiQ1EDQgBSgkLBA0IBUzKC8p', 'LatKetQuaDiemQuaTrinh', { strQLSV_NguoiHoc_Id: nh, strDaoTao_LopHocPhan_Id: lopId }).then(function (r) {
                ui.table({ el: h, rows: arr(r.data), empty: 'Chưa có điểm quá trình', columns: [
                    { title: 'Loại điểm', prop: 'DIEM_THANHPHANDIEM_TEN' }, { title: 'Kết quả', prop: 'DIEM', cls: 'is-center' }] });
            }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
        }

        /* ---------- Hộp "Chi tiết điểm thành phần" ------------------------ */
        function thanhPhan(id) {
            var dlg = ui.dialog({ title: 'Chi tiết điểm thành phần', icon: 'fa-list-ol', size: 'lg', body: '<div data-k="tp">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
            var h = dlg.body.querySelector('[data-k="tp"]');
            goi('DSA4BRIFKCQsFSkgLykRKSAvFSkkLhUKCREP', 'LayDSDiemThanhPhanTheoTKHP', { strDiem_NguoiHoc_TongKet_Id: id }).then(function (r) {
                var d = arr(r.data), cot = [], lan = [], o2 = {};
                d.forEach(function (x) {
                    var c = e(x.DIEM_THANHPHANDIEM_TEN), k = e(x.LANHOC) + ':' + e(x.LANTHI);
                    if (cot.indexOf(c) < 0) cot.push(c);
                    if (!o2[k]) { o2[k] = { LANHOC: x.LANHOC, LANTHI: x.LANTHI, _d: {} }; lan.push(o2[k]); }
                    o2[k]._d[c] = x.DIEM;
                });
                ui.table({ el: h, rows: lan, empty: 'Chưa có điểm thành phần', columns: [
                    { title: 'Lần học', prop: 'LANHOC', cls: 'is-center' }, { title: 'Lần thi', prop: 'LANTHI', cls: 'is-center' }
                ].concat(cot.map(function (c) { return { title: c, cls: 'is-center', render: function (x) { return esc(e(x._d[c])); } }; })) });
            }).catch(function (err) { h.innerHTML = ui.fail(err.message); });
        }

        return { destroy: function () { host.removeEventListener('click', onClick); host.innerHTML = ''; } };
    }

    /* Các hàm vẽ dùng lại được ở màn khác (nhapdiem/inbangdiem gọi action gốc của nó rồi vẽ bằng các hàm này):
       veBangDiem(el, rsDiemKetThucHocPhan, rsDiemTrungBinhChung, { chiTiet: false, ghiChu: false }) · veTichLuy(el, data) · veRenLuyen(el, data)
       mount(host, { nguoiHocId, diemQuaTrinh?: false, ctdt?: true }) · veBangDiem(…, { bamDong: false }) tắt bấm cả dòng */
    ums.diemHoc = { mount: mount, veBangDiem: veBangDiem, veTongKet: veTongKet, veTichLuy: veTichLuy, veRenLuyen: veRenLuyen };
})(window);
