/* =========================================================================
   Kế hoạch đăng ký — BIỂU MẪU kế hoạch (vùng #zoneEdit của bản gốc)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/kehoachdangky.html (#zoneEdit)
            + script/kehoachdangky.js: rewrite, viewForm_KeHoachDangKy,
              save_KeHoachDangKy (phần đọc ô), getList_NamHoc / ThoiGianDaoTao / DotHoc,
              genList_TrangThaiSV, getList_NguyenVongUuTien, các loadToRadio/CheckBox_DMDL.
   ---------------------------------------------------------------------------
   ums.khdk.taoForm(host) → {
       ready            Promise — mọi danh mục đã nạp (đổ giá trị sửa phải chờ)
       reset()          = rewrite() của gốc (xem "khác gốc")
       fill(row)        = viewForm_KeHoachDangKy(row) → Promise
       values()         bộ tham số đúng như obj_save của save_KeHoachDangKy
                        (chưa có action / func / strId)
   }

   Lời gọi (chép nguyên):
       KHCT_NamHoc/LayDanhSach                GET  strTuKhoa '' · strNguoiThucHien_Id '' ·
                                                   strCanBoNhapDeTai_Id '' · pageIndex 1 · pageSize 10000000
       KHCT_ThoiGianDaoTao/LayDanhSach        GET  strDAOTAO_NAM_Id = năm · pageSize 100000
                                                   → chỉ giữ dòng có HOCKY, không THANG, không DOTHOC (như gốc)
       KHCT_DotHoc/LayDanhSach_RutGon         GET  strDaoTao_HocKy_Id = học kỳ
       DKH_Chung/LayDSKeHoachDKNV             GET  (nguyện vọng cần ưu tiên)
       CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM (ums.api.dm):
           DANGKY.MOHINH (radio) · KHDT.DIEM.KIEUHOC (ô đánh dấu) · DANGKY.KIEUHOCLAI.PHANLOAI (ô đánh dấu)
           DANGKY.CHEDO · DANGKY.QUYDINHVETINCHITOIDA · DANGKY.QUYDINHVETINCHITOIDA.PHAMVI
           DANGKY.PHAMVIKIEMTRATRUNGTHOIGIAN · DANGKY.TOHOPQUYDINH · DANGKY.QUYDINHVENANGDIEM
           DANGKY.QUYDINHKIEMTRAHOCPHI (radio) · QLSV.TRANGTHAI (ô đánh dấu có "Tất cả")
           DIEM.DIEMCHU · DANGKY.PHANLOAIDOT · DANGKY.MOHINHUTDANGKYNGUYENVONG ·
           DANGKY.SOTINCHI.KHOIKT.TUCHON (ô chọn)

   Giá trị gửi đi — chép đúng cách gốc đọc:
       · nhóm radio / ô đánh dấu nạp từ danh mục → ID các mục đang chọn, nối dấu phẩy
         (edu.util.getValCheckBoxByDiv trả id của <input>, id = ID danh mục); không chọn → ''.
       · câu hỏi Có / Không → "1" / "0"; chưa chọn → KHÔNG GỬI khoá (gốc: `x ? x : undefined`).
       · ô chữ tham số d* rỗng → không gửi; ô chữ tham số str* rỗng → ''.
       · strNgayBatDauXacNhan / strNgayKetThucXacNhan: gốc đọc bằng edu.system.getValById
         (rỗng → undefined → không gửi).
       · dApDungLuuBangTam*: đánh dấu → 1, không → không gửi.

   Cố ý bỏ:
       · Ô đánh dấu #chkHienThiDonGia "Dành cho học đi" trong khối tài chính: không
         nơi nào đọc (save không gửi, view không đổ) — ô thừa chép nhầm từ khối
         "Kiểu đăng ký".
       · Nội dung dựng sẵn trong HTML gốc của các khối radio (MHDK_1, CDDK_1,
         QuyDinhTinChi_1…, PhamViKTTL_1…, QDToHopDK_1…, TTSV_1…, KieuDangky_1…):
         đều bị danh mục ghi đè khi nạp (id = ID danh mục); danh mục rỗng thì ở gốc
         còn trơ mấy ô mẫu với id giả — ở đây ghi "Chưa có danh mục".

   Khác gốc (sửa lỗi):
       · "Chọn những nguyện vọng cần ưu tiên cho kế hoạch": gốc CHƯA BAO GIỜ vẽ được
         (genTable_NguyenVongUuTien đọc `data.Data` của một MẢNG → undefined, còn dùng
         biến `type` / `callback` không khai báo) nên strDSNguyenVongLuaChon_Id luôn ''.
         Nay vẽ theo ý định (ô đánh dấu value = ID, nhãn = TEN như loadToCheckBox_DMDL)
         và đổ lại từ DSNGUYENVONGLUACHON_ID khi sửa.
       · rewrite() của gốc "làm trắng" các khối radio bằng resetValById (chỉ đổi .val()
         của <div> — không bỏ chọn gì) nên Thêm mới sau khi xem một kế hoạch vẫn mang
         lựa chọn cũ; viewForm chỉ bấm vào ô khớp giá trị nên kế hoạch có cột rỗng vẫn
         giữ lựa chọn của kế hoạch xem trước. Nay reset() / fill() bỏ chọn hết trước.
         Năm học + học kỳ vẫn giữ khi Thêm mới (gốc không đặt lại hai ô này).
       · Học kỳ khoá tới khi chọn Năm học, Đợt khoá tới khi chọn Học kỳ (luật cha → con);
         gốc nạp sẵn mọi học kỳ của mọi năm.
       · dApDungLuuBangTam* khi sửa: gốc .prop('checked', giá trị cột) — chuỗi "0" cũng
         thành đánh dấu. Nay chỉ đánh dấu khi cột = 1.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui;
    var esc = ui.esc;
    var K = ums.khdk = ums.khdk || {};

    function e(v) { return v === undefined || v === null ? '' : v; }
    function qa(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

    /* Danh mục của các khối radio / ô đánh dấu: khoá khối → mã danh mục, kiểu ô */
    var DM = {
        divMoHinh: ['DANGKY.MOHINH', 'radio'],
        divKieuDangKy: ['KHDT.DIEM.KIEUHOC', 'checkbox'],
        divLyDoHocLai: ['DANGKY.KIEUHOCLAI.PHANLOAI', 'checkbox'],
        divCheDoDangKy: ['DANGKY.CHEDO', 'radio'],
        divCachTinhTinChiToiDa: ['DANGKY.QUYDINHVETINCHITOIDA', 'radio'],
        divCachTinhTinChiToiDaPV: ['DANGKY.QUYDINHVETINCHITOIDA.PHAMVI', 'radio'],
        divKiemTranTrungThoiGian: ['DANGKY.PHAMVIKIEMTRATRUNGTHOIGIAN', 'radio'],
        divDKTheoToHopQuyDinh: ['DANGKY.TOHOPQUYDINH', 'radio'],
        divQuyDinhNangDiem: ['DANGKY.QUYDINHVENANGDIEM', 'radio'],
        divQuyDinhKiemTraTaiChinh: ['DANGKY.QUYDINHKIEMTRAHOCPHI', 'radio']
    };
    /* Ô chọn nạp từ danh mục: ô → [mã danh mục, chữ gợi ý của gốc] */
    var DMSEL = {
        dropMucDiem: ['DIEM.DIEMCHU', 'Chọn mức điểm'],
        dropPhanLoaiDot: ['DANGKY.PHANLOAIDOT', ''],
        dropMucUuTienNguyenVong: ['DANGKY.MOHINHUTDANGKYNGUYENVONG', 'Chọn mức ưu tiên nguyện vọng'],
        dropTuyChonKTVuot: ['DANGKY.SOTINCHI.KHOIKT.TUCHON', '']
    };

    /* ---------- Dựng HTML ---------------------------------------------------- */
    function sec(span, title, body) {
        return '<section class="khdk-s' + span + '"><div class="ums-legend">' + esc(title) + '</div>' + body + '</section>';
    }
    function inp(k, o) {
        o = o || {};
        return '<input class="ums-input' + (o.cls ? ' ' + o.cls : '') + '" data-k="' + k + '" data-scope="form" autocomplete="off"' +
            (o.date ? ' data-date data-type="date" placeholder="dd/mm/yyyy"' : '') +
            (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>';
    }
    function sel(k, ph) {
        return '<select class="ums-select" data-k="' + k + '" data-scope="form" data-ph="' + esc(ph || '') + '">' +
            '<option value="">' + esc(ph || '') + '</option></select>';
    }
    /* Câu hỏi Có / Không — name riêng cho từng câu (tên nhóm radio của gốc) */
    function yn(name, q, extra) {
        return '<div class="khdk-yn"><span class="khdk-yn__q">' + esc(q) + '</span>' +
            '<span class="khdk-yn__a">' +
            '<label class="ums-check"><input type="radio" name="khdk_' + name + '" value="1"> Có</label>' +
            '<label class="ums-check"><input type="radio" name="khdk_' + name + '" value="0"> Không</label></span>' +
            (extra ? '<span class="khdk-yn__x">' + extra + '</span>' : '') + '</div>';
    }
    function nho(label, k) { return '<label>' + esc(label) + inp(k, { cls: 'ums-input--sm' }) + '</label>'; }
    function dmBox(k) { return '<div class="ums-checklist" data-dm="' + k + '"><span class="ums-u-faint ums-u-fz13">Đang tải…</span></div>'; }
    function f(label, ctrl, o) { return ui.field(label, ctrl, o); }

    function html() {
        var h = '<div class="khdk-form">';

        h += sec(9, 'Thông tin cơ bản',
            '<div class="ums-grid ums-grid--2">' +
                f('Tên kế hoạch', inp('txtTenKeHoach', { ph: 'Nhập tên kế hoạch' })) +
                f('Mã kế hoạch', inp('txtMaKeHoach', { ph: 'Nhập mã kế hoạch' })) +
            '</div>' +
            f('Mô tả', '<textarea class="ums-input" rows="3" data-k="txtMoTa" data-scope="form"></textarea>'));

        h += sec(3, 'Cho phép hiện thông báo khi chưa đến hạn',
            '<div class="ums-checklist" data-r="divDenHan">' +
                '<label class="ums-check"><input type="radio" name="khdk_DenHanDangKy" value="1"> Đồng ý</label>' +
                '<label class="ums-check"><input type="radio" name="khdk_DenHanDangKy" value="0"> Không đồng ý</label></div>');

        h += sec(12, 'Thời gian đăng ký',
            '<div class="ums-grid ums-grid--4">' +
                f('Năm học', sel('dropThoiGian_Nam', 'Chọn năm')) +
                f('Học kỳ', sel('dropThoiGian_Ky', 'Chọn kỳ')) +
                f('Đợt học', sel('dropThoiGian_Dot', 'Chọn đợt')) +
                f('Phân loại đợt', sel('dropPhanLoaiDot', 'Chọn phân loại đợt')) +
            '</div>' +
            '<div class="ums-grid ums-grid--2">' +
                f('Ngày bắt đầu', '<div class="khdk-ngaygio">' + inp('txtBD_Ngay', { date: true }) + inp('txtBD_Gio', { ph: 'Giờ' }) + inp('txtBD_Phut', { ph: 'Phút' }) + '</div>') +
                f('Ngày kết thúc', '<div class="khdk-ngaygio">' + inp('txtKT_Ngay', { date: true }) + inp('txtKT_Gio', { ph: 'Giờ' }) + inp('txtKT_Phut', { ph: 'Phút' }) + '</div>') +
            '</div>' +
            '<div class="ums-grid ums-grid--4">' +
                f('Số giây chờ', inp('txtSoGiayCho'), { hint: 'Ghi chú: Để áp dụng cho phương án xử lý tắc nghẽn khi cần' }) +
            '</div>');

        h += sec(3, 'Mô hình đăng ký', dmBox('divMoHinh'));
        h += sec(9, 'Trạng thái sinh viên', '<div data-z="ttsv"><span class="ums-u-faint ums-u-fz13">Đang tải…</span></div>');

        h += sec(6, 'Kiểu đăng ký', dmBox('divKieuDangKy'));
        h += sec(6, 'Tùy chọn lý do học lại', dmBox('divLyDoHocLai'));

        h += sec(6, 'Chế độ đăng ký', dmBox('divCheDoDangKy'));

        h += sec(12, 'Quy định về giảng viên', yn('QDGV', 'Hiển thị thông tin giảng viên trên lịch giảng'));

        h += sec(6, 'Kiểm tra tình trạng tài chính',
            yn('KiemTraTaiChinh', 'Có kiểm tra tình trạng tài chính của sinh viên?') +
            yn('HienThiDonGia', 'Hiện thị đơn giá học phí?') +
            yn('TuDongTinhPhi', 'Tính phí tự động khi xác nhận?') +
            yn('TuDongTinhTien', 'Tự động tính tiền?') +
            '<div class="ums-u-mt-3">' + dmBox('divQuyDinhKiemTraTaiChinh') + '</div>' +
            '<div class="ums-u-mt-3">' + f('Số nợ tối đa cho phép', inp('txtNoToiDa'), { inline: true, labelWidth: '190px' }) + '</div>');

        h += sec(6, 'Quy định về hủy/rút học phần',
            yn('QDRHP', 'Có cho sinh viên được hủy học phần sau khi đã đăng ký và trừ tiền?') +
            yn('CVDK', 'Có cho cố vấn đăng ký hộ cho sinh viên?') +
            '<div class="ums-u-mt-3">' + f('Số ngày được rút học phần', inp('txtSoNgayRutHP'), { inline: true, labelWidth: '250px' }) + '</div>' +
            f('Ngày bắt đầu tính mốc rút học phần', inp('txtNgayBDRutHP', { date: true }), { inline: true, labelWidth: '250px' }));

        h += sec(12, 'Quy định về số tín chỉ tối đa/ tối thiểu',
            yn('QDTCTD', 'Có kiểm tra số tín chỉ tối đa?', nho('Số tối đa N1', 'txtSoTCToiDa') + nho('Số tối đa N2', 'txtSoTCToiDaN2')) +
            yn('QDTCTT', 'Có kiểm tra số tín chỉ tối thiểu?', nho('Số tối thiểu N1', 'txtSoTCToiThieu') + nho('Số tối thiểu N2', 'txtSoTCToiThieuN2')) +
            '<div class="khdk-sub">Quy định về cách tính số tín chỉ tối đa</div>' + dmBox('divCachTinhTinChiToiDa') +
            '<div class="khdk-sub">Quy định tín chỉ tối đa - phạm vi</div>' + dmBox('divCachTinhTinChiToiDaPV'));

        h += sec(6, 'Kiểm tra về trùng lịch',
            yn('KTTLich', 'Kiểm tra trùng lịch khi đăng ký học?') +
            yn('KTTLop', 'Kiểm tra lịch trùng với những lớp không có lịch chi tiết(tức là chỉ có giai đoạn học)?') +
            '<div class="khdk-sub">Phạm vi kiểm tra trùng lịch</div>' + dmBox('divKiemTranTrungThoiGian'));

        h += sec(6, 'Quy định về tổ hợp đăng ký', dmBox('divDKTheoToHopQuyDinh'));

        h += sec(12, 'Quy định về đăng ký mở rộng',
            f('Tỷ lệ phần trăm đăng ký vượt so với số dự kiến của lớp:', inp('txtTyLeVuot'), { inline: true, labelWidth: '380px' }) +
            yn('DKMR', 'Cho đăng ký mở rộng ngoài chương trình?') +
            yn('DKHPTD', 'Cho phép đăng ký học phần tương đương?') +
            yn('DHP', 'Không cho phép đổi lớp học phần?') +
            yn('DKML', 'Chỉ cho phép đăng ký học phần 1 lần trong kỳ') +
            yn('KTDKTQ', 'Kiểm tra điều kiện tiên quyết học phần?') +
            yn('HDHT', 'Kiểm tra định hướng học tập?') +
            '<div class="ums-checklist ums-u-mt-3">' +
                '<label class="ums-check"><input type="checkbox" data-c="chkTinhHocPhan"> Có áp dụng tĩnh sẵn dữ liệu học phần</label>' +
                '<label class="ums-check"><input type="checkbox" data-c="chkTinhTaiChinh"> Có áp dụng tính sẵn dữ liệu tài chính</label>' +
                '<label class="ums-check"><input type="checkbox" data-c="chkTinhLopHocPhan"> Có áp dụng tính sẵn dữ liệu lớp học phần</label>' +
            '</div>' +
            '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                f('Ngày bắt đầu cho phép sv xác nhận đăng ký', inp('txtNgayBatDauXN')) +
                f('Ngày kết thúc cho phép sv xác nhận đăng ký', inp('txtNgayKetThucXN')) +
            '</div>');

        h += sec(4, 'Tùy chọn ưu tiên kết quả ký nguyên vọng',
            sel('dropMucUuTienNguyenVong', 'Chọn mức ưu tiên nguyện vọng') +
            '<div class="khdk-sub">Chọn những nguyện vọng cần ưu tiên cho kế hoạch</div>' + dmBox('divNguyenVongUuTien'));

        h += sec(3, 'Quy định về điều kiện đăng ký nâng điểm',
            sel('dropMucDiem', 'Chọn mức điểm') + '<div class="ums-u-mt-3">' + dmBox('divQuyDinhNangDiem') + '</div>');

        h += sec(5, 'Tùy chọn có kiểm tra vượt số tín quy định của khối tự chọn không:', sel('dropTuyChonKTVuot', 'Chọn tùy chọn'));

        return h + '</div>';
    }

    /* ---------- Biểu mẫu ------------------------------------------------------ */
    K.taoForm = function (host) {
        host.innerHTML = html();
        ui.enhance(host);

        function el(k) { return host.querySelector('[data-k="' + k + '"]'); }
        function box(k) { return host.querySelector('[data-dm="' + k + '"]'); }
        function val(k) { var x = el(k); return x ? (x.value || '').trim() : ''; }
        function dOrU(k) { var v = val(k); return v ? v : undefined; }
        function setVal(k, v) {
            var x = el(k);
            if (!x) return;
            v = e(v);
            if (x._flatpickr) x._flatpickr.setDate(v ? String(v) : null, false, 'd/m/Y');
            x.value = v;
        }
        function setSel(k, v) {
            var x = el(k);
            if (!x) return;
            x.value = e(v);
            if (x.value !== String(e(v))) x.value = '';          // mã không có trong danh sách
            if (window.jQuery) jQuery(x).trigger('change');
        }
        function radio(name) {
            var x = host.querySelector('input[name="khdk_' + name + '"]:checked');
            return x ? x.value : undefined;
        }
        function setRadio(name, v) {
            qa(host, 'input[name="khdk_' + name + '"]').forEach(function (x) {
                x.checked = v !== null && v !== undefined && v !== '' && x.value === String(v);
            });
        }
        function dmVal(k) {
            return qa(box(k), 'input:checked').map(function (x) { return x.value; }).join(',');
        }
        function dmSet(k, ids) {
            var want = {};
            String(e(ids)).split(',').forEach(function (x) { if (x) want[x] = 1; });
            qa(box(k), 'input').forEach(function (x) { x.checked = !!want[x.value]; });
        }
        function veDm(k, rows, kieu) {
            var b = box(k);
            if (!rows || !rows.length) { b.innerHTML = '<span class="ums-u-faint ums-u-fz13">Chưa có danh mục</span>'; return; }
            b.innerHTML = rows.map(function (r) {
                return '<label class="ums-check"><input type="' + kieu + '" name="khdk_' + k + '" value="' + esc(r.ID) + '"> ' + esc(r.TEN) + '</label>';
            }).join('');
        }
        function loi(what) { return function (err) { ums.api.handle(err, what); return []; }; }

        /* --- Năm học → Học kỳ → Đợt học ------------------------------------ */
        function napKy() {
            return ums.api.call({
                action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', silent: true,
                strTuKhoa: '', strDAOTAO_NAM_Id: val('dropThoiGian_Nam'), strNguoiThucHien_Id: '',
                pageIndex: 1, pageSize: 100000
            }).then(function (r) {
                var ds = (Array.isArray(r.data) ? r.data : []).filter(function (x) { return x.HOCKY && !x.THANG && !x.DOTHOC; });
                ums.pat.fill(el('dropThoiGian_Ky'), ds, { name: 'HOCKY', head: 'Chọn học kỳ' });
            }).catch(loi('học kỳ'));
        }
        function napDot() {
            return ums.api.call({
                action: 'KHCT_DotHoc/LayDanhSach_RutGon', method: 'GET', silent: true,
                strDaoTao_HocKy_Id: val('dropThoiGian_Ky')
            }).then(function (r) {
                ums.pat.fill(el('dropThoiGian_Dot'), Array.isArray(r.data) ? r.data : [], { name: 'DOTHOC', head: 'Chọn đợt học' });
            }).catch(loi('đợt học'));
        }
        function xoaDs(k, head) { ums.pat.fill(el(k), [], { head: head }); }
        if (window.jQuery) {
            jQuery(el('dropThoiGian_Nam')).on('select2:select', function () {
                xoaDs('dropThoiGian_Dot', 'Chọn đợt học');
                if (val('dropThoiGian_Nam')) napKy(); else xoaDs('dropThoiGian_Ky', 'Chọn học kỳ');
            });
            jQuery(el('dropThoiGian_Ky')).on('select2:select', function () {
                if (val('dropThoiGian_Ky')) napDot(); else xoaDs('dropThoiGian_Dot', 'Chọn đợt học');
            });
        }
        ums.pat.chain([el('dropThoiGian_Nam'), el('dropThoiGian_Ky'), el('dropThoiGian_Dot')]);

        /* --- Nạp danh mục -------------------------------------------------- */
        var ttsv = null;
        var cho = [];
        cho.push(ums.api.call({
            action: 'KHCT_NamHoc/LayDanhSach', method: 'GET', silent: true,
            strTuKhoa: '', strNguoiThucHien_Id: '', strCanBoNhapDeTai_Id: '', pageIndex: 1, pageSize: 10000000
        }).then(function (r) {
            ums.pat.fill(el('dropThoiGian_Nam'), Array.isArray(r.data) ? r.data : [], { name: 'NAMHOC', head: 'Chọn năm học' });
        }).catch(loi('năm học')));
        Object.keys(DM).forEach(function (k) {
            cho.push(ums.api.dm(DM[k][0]).then(function (rows) { veDm(k, rows, DM[k][1]); })
                .catch(function (err) { veDm(k, [], 'radio'); ums.api.handle(err, 'danh mục ' + DM[k][0]); }));
        });
        Object.keys(DMSEL).forEach(function (k) {
            cho.push(ums.api.dm(DMSEL[k][0]).then(function (rows) {
                ums.pat.fill(el(k), rows, { head: DMSEL[k][1] || ums.pat.dmTitle(rows) || '-- Chọn --' });
            }).catch(loi('danh mục ' + DMSEL[k][0])));
        });
        cho.push(ums.api.dm('QLSV.TRANGTHAI').then(function (rows) {
            ttsv = ums.pat.checks(host.querySelector('[data-z="ttsv"]'), rows, { all: 'Tất cả', checked: false, cols: 3 });
        }).catch(loi('trạng thái sinh viên')));
        cho.push(ums.api.call({ action: 'DKH_Chung/LayDSKeHoachDKNV', method: 'GET', silent: true, strNguoiThucHien_Id: '' })
            .then(function (r) { veDm('divNguyenVongUuTien', Array.isArray(r.data) ? r.data : [], 'checkbox'); })
            .catch(function (err) { veDm('divNguyenVongUuTien', [], 'checkbox'); ums.api.handle(err, 'nguyện vọng'); }));
        var ready = Promise.all(cho);

        var TEXT = ['txtTenKeHoach', 'txtMaKeHoach', 'txtMoTa', 'txtBD_Ngay', 'txtBD_Gio', 'txtBD_Phut', 'txtKT_Ngay',
            'txtKT_Gio', 'txtKT_Phut', 'txtNoToiDa', 'txtSoNgayRutHP', 'txtNgayBDRutHP', 'txtSoGiayCho', 'txtSoTCToiDa',
            'txtSoTCToiThieu', 'txtSoTCToiDaN2', 'txtSoTCToiThieuN2', 'txtTyLeVuot', 'txtNgayBatDauXN', 'txtNgayKetThucXN'];
        var YN = ['DenHanDangKy', 'QDGV', 'KiemTraTaiChinh', 'HienThiDonGia', 'TuDongTinhPhi', 'TuDongTinhTien', 'QDRHP',
            'CVDK', 'QDTCTD', 'QDTCTT', 'KTTLich', 'KTTLop', 'DKMR', 'DKHPTD', 'DHP', 'DKML', 'KTDKTQ', 'HDHT'];

        function boChonHet() {
            YN.forEach(function (n) { setRadio(n, null); });
            Object.keys(DM).concat(['divNguyenVongUuTien']).forEach(function (k) { dmSet(k, ''); });
            if (ttsv) ttsv.setAll(false);
            qa(host, 'input[data-c]').forEach(function (x) { x.checked = false; });
        }

        function reset() {
            TEXT.forEach(function (k) { setVal(k, ''); });
            // Như rewrite(): đặt lại Đợt, Phân loại đợt, Mức điểm, Mức ưu tiên NV, Tuỳ chọn KT vượt — giữ Năm / Học kỳ
            ['dropThoiGian_Dot', 'dropPhanLoaiDot', 'dropMucDiem', 'dropMucUuTienNguyenVong', 'dropTuyChonKTVuot'].forEach(function (k) { setSel(k, ''); });
            boChonHet();
        }

        function fill(d) {
            d = d || {};
            return ready.then(function () {
                boChonHet();
                setVal('txtTenKeHoach', d.TENKEHOACH);
                setVal('txtMaKeHoach', d.MAKEHOACH);
                setVal('txtMoTa', d.MOTA);
                setVal('txtBD_Ngay', d.NGAYBATDAU);
                setVal('txtBD_Gio', d.GIODANGKYTRONGNGAYDAU);
                setVal('txtBD_Phut', d.PHUTDANGKYTRONGNGAYDAU);
                setVal('txtKT_Ngay', d.NGAYKETTHUC);
                setVal('txtKT_Gio', d.GIOKETTHUCTRONGNGAYCUOI);
                setVal('txtKT_Phut', d.PHUTKETTHUCTRONGNGAYCUOI);
                setVal('txtNoToiDa', d.SOHOCPHINOTOIDACHOPHEP);
                setVal('txtSoNgayRutHP', d.SONGAYDUOCPHEPRUTHOCPHAN);
                setVal('txtNgayBDRutHP', d.NGAYBATDAUTINHRUTHOCPHAN);
                setVal('txtSoTCToiDa', d.SOTINCHITOIDA);
                setVal('txtSoTCToiThieu', d.SOTINCHITOITHIEU);
                setVal('txtSoTCToiDaN2', d.SOTINCHITOIDAN2);
                setVal('txtSoTCToiThieuN2', d.SOTINCHITOITHIEUN2);
                setVal('txtTyLeVuot', d.PHANTRAMDANGKYVUOTQUYDINH);
                setVal('txtSoGiayCho', d.SOGIAYCHO);
                setVal('txtNgayBatDauXN', d.NGAYBATDAUXACNHAN);
                setVal('txtNgayKetThucXN', d.NGAYKETTHUCXACNHAN);
                setSel('dropPhanLoaiDot', d.PHANLOAIDOTDANGKY_ID);
                setSel('dropMucDiem', d.MUCDIEMCHUHE4_NANGDIEM);
                setSel('dropTuyChonKTVuot', d.KIEMTRADANGKYSOTINCUAKHOITC_ID);
                setSel('dropMucUuTienNguyenVong', d.MOHINHUUTIENDADKNGUYENVONG_ID);

                dmSet('divMoHinh', d.MOHINHDANGKY_ID);
                setRadio('DenHanDangKy', d.HIEULUC);
                setRadio('QDGV', d.HIENTHITHONGTINGIANGVIEN);
                dmSet('divCachTinhTinChiToiDa', d.QUYDINHTINCHITOIDA_ID);
                dmSet('divCachTinhTinChiToiDaPV', d.QUYDINHTINCHITOIDA_PHAMVI_ID);
                dmSet('divQuyDinhNangDiem', d.QUYDINHDANGKYNANGDIEM_ID);
                dmSet('divDKTheoToHopQuyDinh', d.DANGKYTHEOTOHOPQUYDINH_ID);
                dmSet('divKiemTranTrungThoiGian', d.KIEMTRATRUNGTHOIGIAN_ID);
                dmSet('divCheDoDangKy', d.TRANGTHAI_ID);
                setRadio('KiemTraTaiChinh', d.KIEMTRATAICHINH);
                setRadio('HienThiDonGia', d.HIENTHIDONGIAHOCPHI);
                setRadio('TuDongTinhTien', d.TINHPHITUDONG);
                setRadio('TuDongTinhPhi', d.TINHPHITUDONGKHIXACNHAN);
                dmSet('divKieuDangKy', d.KIEUHOC_IDS);
                dmSet('divLyDoHocLai', d.KIEUHOCLAI_PHANLOAI_ID);
                if (ttsv) ttsv.set(String(e(d.TRANGTHAISINHVIEN_IDS)).split(',').filter(Boolean));
                dmSet('divNguyenVongUuTien', d.DSNGUYENVONGLUACHON_ID);
                setRadio('QDRHP', d.CHOPHEPNGUOCHOCHUYHOCPHAN);
                setRadio('CVDK', d.KHONGCHOPHEPCOVANDANGKY);
                setRadio('QDTCTD', d.KIEMTRASOTINCHITOIDA);
                setRadio('QDTCTT', d.KIEMTRASOTINCHITOITHIEU);
                setRadio('KTTLich', d.KIEMTRATRUNGLICH);
                setRadio('KTTLop', d.KIEMTRATRUNGLOPKHONGXEP);
                setRadio('DKMR', d.CHOPHEPDANGKYNGOAICHUONGTRINH);
                setRadio('DKHPTD', d.CHOPHEPDANGKYHPTUONGDUONG);
                setRadio('DHP', d.KHONGCHOPHEPDOILOPHOCPHAN);
                setRadio('DKML', d.CHIDANGKYMOTLANTRONGKY);
                setRadio('KTDKTQ', d.KIEMTRARANGBUOCHOCPHAN);
                setRadio('HDHT', d.KIEMTRADINHHUONGHOCTAP);
                dmSet('divQuyDinhKiemTraTaiChinh', d.QUYDINHKIEMTRAHOCPHI_ID);
                host.querySelector('[data-c="chkTinhHocPhan"]').checked = Number(d.APDUNGLUUBANGTAMHOCPHAN) === 1;
                host.querySelector('[data-c="chkTinhTaiChinh"]').checked = Number(d.APDUNGLUUBANGTAMTAICHINH) === 1;
                host.querySelector('[data-c="chkTinhLopHocPhan"]').checked = Number(d.APDUNGLUUBANGTAMLOPHOCPHAN) === 1;

                /* Năm → Học kỳ → Đợt: đổ lần lượt, nạp danh sách con sau mỗi tầng (gốc: async:false) */
                setSel('dropThoiGian_Nam', d.DAOTAO_THOIGIANDAOTAO_NAM_ID);
                return (val('dropThoiGian_Nam') ? napKy() : Promise.resolve(xoaDs('dropThoiGian_Ky', 'Chọn học kỳ'))).then(function () {
                    setSel('dropThoiGian_Ky', d.DAOTAO_THOIGIANDAOTAO_KY_ID);
                    return val('dropThoiGian_Ky') ? napDot() : xoaDs('dropThoiGian_Dot', 'Chọn đợt học');
                }).then(function () {
                    setSel('dropThoiGian_Dot', d.DAOTAO_THOIGIANDAOTAO_DOT_ID);
                });
            });
        }

        /* Bộ tham số của save_KeHoachDangKy (chưa có action / func / strId) */
        function values() {
            function yv(n) { var v = radio(n); return v ? v : undefined; }
            function chk(k) { return host.querySelector('[data-c="' + k + '"]').checked ? 1 : undefined; }
            var denHan = radio('DenHanDangKy');
            return {
                strTenKeHoach: val('txtTenKeHoach'),
                strMaKeHoach: val('txtMaKeHoach'),
                strMoTa: val('txtMoTa'),
                strMoHinhDangKy_Id: dmVal('divMoHinh'),
                strTrangThai_Id: dmVal('divCheDoDangKy'),
                strKieuHoc_Ids: dmVal('divKieuDangKy'),
                dHienThiThongTinGiangVien: yv('QDGV'),
                dHieuLuc: denHan ? denHan : undefined,
                dSoTinChiToiDaN2: dOrU('txtSoTCToiDaN2'),
                dSoTinChiToiThieuN2: dOrU('txtSoTCToiThieuN2'),
                strTrangThaiSinhVien_Ids: ttsv ? ttsv.ids().toString() : '',
                strQuyDinhKiemTraHocPhi_Id: dmVal('divQuyDinhKiemTraTaiChinh'),
                dChoPhepNguocHocHuyHocPhan: yv('QDRHP'),
                dKhongChoPhepCoVanDangKy: yv('CVDK'),
                dKiemTraSoTinChiToiDa: yv('QDTCTD'),
                dKiemTraSoTinChiToiThieu: yv('QDTCTT'),
                strQuyDinhTinChiToiDa_Id: dmVal('divCachTinhTinChiToiDa'),
                dKiemTraTrungLich: yv('KTTLich'),
                dKiemTraTrungLopKhongXep: yv('KTTLop'),
                strKiemTraTrungThoiGian_Id: dmVal('divKiemTranTrungThoiGian'),
                strDangKyTheoToHopQuyDinh_Id: dmVal('divDKTheoToHopQuyDinh'),
                dChoPhepDangKyMoRong: yv('DKMR'),
                dChoPhepDangKyHPTuongDuong: yv('DKHPTD'),
                dKhongChoPhepDoiLopHocPhan: yv('DHP'),
                dChiDangKyMotLanTrongKy: yv('DKML'),
                dKiemTraRangBuocHocPhan: yv('KTDKTQ'),
                strQuyDinhDangKyNangDiem_Id: dmVal('divQuyDinhNangDiem'),

                dGioDangKyTrongNgayDau: dOrU('txtBD_Gio'),
                dGioKetThucTrongNgayCuoi: dOrU('txtKT_Gio'),
                strNgayBatDau: val('txtBD_Ngay'),
                strNgayKetThuc: val('txtKT_Ngay'),
                dSoHocPhiNoToiDaChoPhep: dOrU('txtNoToiDa'),
                dSoTinChiToiDa: dOrU('txtSoTCToiDa'),
                dSoTinChiToiThieu: dOrU('txtSoTCToiThieu'),
                strNamHoc_Id: val('dropThoiGian_Nam'),
                strHocKy_Id: val('dropThoiGian_Ky'),
                strDotHoc_Id: val('dropThoiGian_Dot'),
                dPhanTramDangKyMoRong: dOrU('txtTyLeVuot'),
                dPhutDangKyTrongNgayDau: dOrU('txtBD_Phut'),
                dPhutKetThucTrongNgayCuoi: dOrU('txtKT_Phut'),
                dSoNgayDuocPhepRutHocPhan: dOrU('txtSoNgayRutHP'),
                strNgayBatDauTinhRutHP: val('txtNgayBDRutHP'),
                dKiemTraTaiChinh: yv('KiemTraTaiChinh'),
                strMucDiemChuHe4_NangDiem: val('dropMucDiem'),
                strNguoiThucHien_Id: '',
                dSoGiayCho: dOrU('txtSoGiayCho'),
                strPhanLoaiDotDangKy_Id: val('dropPhanLoaiDot'),
                dHienThiDonGiaHocPhi: yv('HienThiDonGia'),
                dTinhPhiTuDong: yv('TuDongTinhTien'),
                dTinhPhiTuDongKhiXacNhan: radio('TuDongTinhPhi'),
                dKiemTraDinhHuongHocTap: radio('HDHT'),
                strQuyDinhTCToiDa_PhamVi_Id: dmVal('divCachTinhTinChiToiDaPV'),

                strMoHinhUuTienDaDKNV_Id: val('dropMucUuTienNguyenVong'),
                strDSNguyenVongLuaChon_Id: dmVal('divNguyenVongUuTien'),
                strKTDangKySoTinCuaKhoiTC_Id: val('dropTuyChonKTVuot'),
                strKieuHocLai_PhanLoai_Id: dmVal('divLyDoHocLai'),
                dApDungLuuBangTamTaiChinh: chk('chkTinhTaiChinh'),
                dApDungLuuBangTamLHocPhan: chk('chkTinhLopHocPhan'),
                dApDungLuuBangTamHocPhan: chk('chkTinhHocPhan'),
                strNgayBatDauXacNhan: dOrU('txtNgayBatDauXN'),
                strNgayKetThucXacNhan: dOrU('txtNgayKetThucXN')
            };
        }

        return { ready: ready, reset: reset, fill: fill, values: values };
    };
})();
