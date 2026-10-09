/* =========================================================================
   Quản lý thi (Quản lý thi trắc nghiệm) — màn quản trị phòng thi: danh sách phòng + chi tiết phòng THAY CHỖ danh sách (một cột như gốc)
   Bản gốc: ApisQuanLyThiTracNghiem/modules/quanlythi/html/quanlythi.html (1.581 dòng, 17 vùng zone-bus) + script/quanlythi.js (5.755 dòng)
   Khung: ums.coiThi.manPhong + ums.coiThi.gst.chiTiet (ApisCongCanBo/Modules/coithi — bản Cổng cán bộ "Coi thi" là bản rút của chính màn này;
   mọi khác biệt truyền bằng tuỳ chọn, xem đầu coithi.js) + ums.qlt (_qlt_chung.js: tạo đề, báo cáo; _qlt_phong.js: biểu mẫu phòng thi;
   _qlt_import.js: import phòng thi / import DS thí sinh).
   ---------------------------------------------------------------------------
   Lời gọi riêng của tệp này (QLTTN_QuanLyThi/… viết tắt QL/; versionAPI 'v1.0' trừ khi ghi "không"; GET trừ khi ghi POST):
     Lọc    QLTTN_ThongTin/LayDS_DonViByUserId (không) strUserId · QL/LayDS_NamHoc (không) strStatus '1' → SCHOOLYEAR · QL/LayDS_HocKyBySchoolYear (không)
            strStatus '1', strSchoolYear → SEMESTER · QL/LayDS_DoThiByHocKy (không) strStatus '1', strHocKy → ID, NAME ·
            QL/LayDS_HocPhan_TheoDotThi (không) strDotThiId, strNamHoc, strHocKy → Data.Table: ID, TEN, MA
     Phòng  QL/LayDS_ThongTinPhongThi strDonVi_Id, strDotThi_Id, strTrangThaiPhongThi, strStatus, strHocPhanId, strTuNgay, strDenNgay, strTuKhoa,
            strNguoiDung_Id, PageNumber, ItemPerPage — ngoài cột phòng còn dùng DEPARTORGANID, TONGTHOIGIAN, MATKHAUCHOPHONGTHI và các cột biểu mẫu
     Tác vụ QL/ThaoTacPhongThi_PhongThi strExamRoomInfoIds (MỘT phòng mỗi lời gọi như gốc), strThaoTacPhongThi MOPHONGTHI / DONGPHONGTHI / ANPHONGTHI / HIENPHONGTHI
            QL/Xoa_PhongThi (POST) strId · QL/ThucHienTinhDiemCauHoi_PhongThi (POST) strIds (một id)
            QL/ThucHienGenDeTuDeThiCoSan_CacPhongThi (POST) strIds (nối phẩy), strExamStructId, strWritenExamId ·
            QL/ThucHienGenDe_NgauNhien_CacPhongThi · ThucHienGenDe_CungDe_CacPhongThi (POST) strIds, strExamStructId — đều strNguoiThucHien_Id
     Chi tiết phòng (coithi.js): LayDS_ChiTietPhongThi_KetQua (phân trang máy chủ, strCoTinhLaiDiem '0' khi mở / Refresh, '1' khi Xem kết quả / chọn phần /
            sau thao tác ghi), LayDS_ExamRoomInfoDetail, LayDS_ExamStructPart, Sua_CongNhanDiem / _ALL, LayDS_ThiSinhGianLan (30 giây), hộp tình huống
            (LayDS_ThiSinh_TinhHuongThi, XulyTinhHuongThi, KhoiTaoLaiDeChoThiSinh, Save_DoiMay, Save_ViPhamQuyCheThi), TTN_ThiSinh/gen_KetQuaThi, LayDS_DiaChiIP_ThiSinh
     Thí sinh QL/ThemMoiCapNhat_StudentExamRoom (POST) strId ('#' khi thêm — như gốc), strExamRoomInfoId, strStudentCode, strLastName, strFirtName, strClassName,
            strSoBaoDanh, strBirthDate, strDatMatKhauChoPhongThi (= MATKHAUCHOPHONGTHI của phòng), strThi_DanhsachSinhVien_Id '', strNguoiThucHien_Id
            QL/Xoa_ThiSinhKhoiPhongThi (POST) strExamRoomInfoId, strUserId · QL/ChuyenDuLieuDiem_ThiSinh (POST) strExamRoomInfoId, strUserId, strChucNang_Id, strUngDung_Id
     Tạo đề một phòng  QL/ThucHienGenDeTuDeThiCoSan strExamRoomInfoId, strExamStructId, strWritenExamId, strNguoiTaoId · QL/ThucHienGenDe_NgauNhien · ThucHienGenDe_CungDe
            strExamRoomInfoId, strExamStructId, strNguoiTaoId · TTN_ThiSinh/LayDS_MatKhauPhanThi strExamRoomInfoId → EXAMSTRUCTPARTID, MATKHAUPHANTHI ·
            QL/CapNhatMatKhauPhanThi strExamRoomInfoId, strExamStructId (= id PHẦN thi — tên tham số gốc), strMatKhauPhanThi
     Tạo đề từ đề thủ công  QL/ThucHienGenLayNDeTuDeThiThuCong strExamRoomInfoId, strExamstructPartId, strDeThiThuCongId, strSoDeLayRa ·
            QL/ThucHienGenDeTuDeThiThuCong … · QL/ThucHienGenDeThiSinhTuDeThiThuCong … + strStudentExamRoom_Ids — đều strNguoiThucHien_Id
     Báo cáo SYS_Report/ThemMoi (ums.qlt.baoCao: BAOCAOLOCTHEODULIEU, ExamRoomInfo_Id, ExamstructPartId, strReportCode, strNguoiDangNhap_Id, tokenJWT, strExamRoomInfoIds)
            + mẫu báo cáo theo chức năng (ums.report.mount — gốc getList_MauImport "zonebtnBaoCao")
   ---------------------------------------------------------------------------
   Khác gốc / lỗi gốc đã sửa:
     · Năm học → Học kỳ → Đợt thi → Học phần nối tầng cha → con (gốc nạp sẵn đợt thi của mọi học kỳ khi mở màn).
     · Mở màn không tự nạp danh sách — chờ Tìm kiếm (như gốc). Mọi hàng loạt (mở / đóng / ẩn / hiện / xoá phòng, tạo dữ liệu báo cáo, xoá thí sinh,
       chuyển lại dữ liệu) chờ xong rồi nạp lại (gốc hẹn 2 giây), hỏi lại bằng ui.confirm (gốc gắn $("#btnYes").click chồng nhau — bấm lần sau chạy cả lệnh trước).
     · Gian lận: gốc hỏi mỗi 30 giây từ lúc mở màn kể cả chưa mở phòng → chỉ khi đang xem một phòng (coithi.js). Hộp tình huống là hộp thoại (thao tác
       hàng loạt trên dòng đánh dấu — BO-CUC luật 1); giữ luật mã vi phạm 3442B9AD… (không kết thúc bài) của gốc.
     · Công nhận điểm: gốc chỉ gửi dòng đổi ĐIỂM (đổi ghi chú không lưu) và khi đề có tổng thời gian đọc nhầm ô ghi chú → coithi.js gửi đúng, nạp lại '1'.
     · Tác vụ TINHVACONGNHANDIEM có trong js nhưng không có trong ô chọn và hàm không tồn tại → bỏ. Nút "Xem kết quả điểm(đang test)" gọi lời gọi thử
       nghiệm …_dangtest → giữ nút, khoá. Sửa phòng: strExamScheduleId / strDepartOrganId gốc lấy từ ô lọc → lấy của dòng (xem _qlt_phong.js).
     · Tạo đề từ đề thủ công: danh sách đề gốc lọc theo ô Đơn vị của BỘ LỌC (trống nếu không lọc) → theo đơn vị của phòng thi; sau khi tạo nạp lại thí sinh
       + thông tin đề (gốc không nạp lại). Mật khẩu phần thi chỉ gửi ô có thay đổi (gốc gửi mọi ô).
     · Khung tạo đề / tình huống / báo cáo theo DS / biểu mẫu thí sinh là khung trong trang (pat.formTrang); import DS thí sinh là hộp thoại.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, P = ums.coiThi, G = P.gst, Q = ums.qlt;
    var e = P.e, arr = P.arr, g = P.g, QL = P.QL, V = P.V;
    function esc(s) { return ui.esc(s); }
    var root = document.getElementById('qlttn-quanlythi');
    if (!root) return;

    G.nap({ cauHinh: false });     // gốc QLTTN không đọc cấu hình COITHI.*; nạp danh mục vi phạm quy chế
    var man = null, ctApi = null;
    var BC_CHINH = [['BAOCAODIEM_NHIEUPHONG', 'Báo cáo điểm'], ['BAOCAODIEM_NHIEUPHONG_CACPHANTHI', 'Báo cáo điểm(Các phần thi)'], ['BAOCAODIEM_CLO', 'Thống kê câu hỏi thí sinh']];

    function chon(api, k) { var f = api.f(k); return { id: f ? f.value : '', ten: Q.tenChon(f) }; }
    function canDvDot(api) {
        if (!chon(api, 'dot').id) { ui.toast('Chưa chọn đợt thi', 'warn'); return false; }
        if (!chon(api, 'dv').id) { ui.toast('Chưa chọn đơn vị', 'warn'); return false; }
        return true;
    }
    function hangLoat(ids, hoi, lam, sau, o) {
        ui.confirm(hoi, o || {}).then(function (yes) {
            if (!yes) return;
            return ui.batch(ids.map(lam), { title: (o && o.title) || 'Đang xử lý', okText: 'Thực hiện thành công' }).then(function () { if (sau) sau(); });
        });
    }

    /* =====================================================================
       Danh sách phòng thi
       ===================================================================== */
    man = P.manPhong(root, {
        tieuDe: 'Quản lý thi',
        donVi: 'QLTTN_ThongTin/LayDS_DonViByUserId',
        action: QL + 'LayDS_ThongTinPhongThi',
        locTrangThai: true, locStatus: true, dotThi: false,
        locThem: function (loc) {
            var iDv = loc.findIndex(function (f) { return f.key === 'dv'; });
            loc.splice(iDv + 1, 0, { key: 'nam', type: 'select', label: 'Chọn năm học' }, { key: 'hk', type: 'select', label: 'Chọn học kỳ' });
            var iSt = loc.findIndex(function (f) { return f.key === 'st'; });
            loc.splice(iSt + 1, 0, { key: 'hp', type: 'select', label: 'Học phần' });
            return loc;
        },
        thamSo: function (v) { return { strHocPhanId: v('hp') }; },
        toolbar: '<div class="ums-field"><select class="ums-select" data-f="bc" data-ph="Chọn loại báo cáo"><option value="">Chọn loại báo cáo</option>' +
            BC_CHINH.map(function (m) { return '<option value="' + esc(m[0]) + '">' + esc(m[1]) + '</option>'; }).join('') + '</select></div>' +
            '<div class="ums-field ums-field--fit">' + ui.btn('excel', { text: 'Tải file', icon: 'fa-download', attr: { 'data-a': 'taifile' } }) + '</div>' +
            '<div class="ums-field ums-field--fit" data-z="mauBC"></div>',
        tacVu: [
            { ma: 'IMPORTPHONGTHI', ten: 'Import phòng thi', chon: false, lam: function (ids, api) {
                if (!canDvDot(api)) return;
                Q.importPhong({ host: api.z('list'), dv: chon(api, 'dv'), dot: chon(api, 'dot'), sau: function () { api.tai(); } });
            } },
            { ma: 'BAOCAOTHEODANHSACH', ten: 'Báo cáo theo DS', chon: false, lam: baoCaoTheoDS },
            { ma: 'THEMPHONGTHI', ten: 'Nhập mới phòng thi', chon: false, lam: function (ids, api) {
                if (!canDvDot(api)) return;
                Q.formPhong({ host: api.z('list'), room: null, dv: chon(api, 'dv'), dot: chon(api, 'dot'), sau: function () { api.tai(); } });
            } },
            ['MOPHONGTHI', 'Mở phòng thi', 'mở'], ['DONGPHONGTHI', 'Đóng phòng thi', 'đóng'],
            ['ANPHONGTHI', 'Ẩn phòng thi', 'ẩn'], ['HIENPHONGTHI', 'Hiển thị phòng thi', 'hiển thị'],
            { ma: 'XOAPHONGTHI', ten: 'Xóa phòng thi', dongTu: 'xóa', nhac: 'Vui lòng chọn đối tượng cần xóa?', lam: function (ids, api) {
                hangLoat(ids, 'Bạn có chắc chắn xóa ' + ids.length + ' phòng thi không?', function (id) {
                    return { action: QL + 'Xoa_PhongThi', method: 'POST', versionAPI: V, strId: id, strNguoiThucHien_Id: P.uid() };
                }, function () { api.tai(); }, { tone: 'bad', ok: 'Xóa', title: 'Đang xóa phòng thi' });
            } },
            { ma: 'TINHDIEMCAUHOI', ten: 'Tạo dữ liệu báo cáo', dongTu: 'tạo dữ liệu báo cáo', nhac: 'Vui lòng chọn đối tượng cần thực hiện?', lam: function (ids, api) {
                hangLoat(ids, 'Tạo dữ liệu báo cáo (tính điểm câu hỏi) cho ' + ids.length + ' phòng thi?', function (id) {
                    return { action: QL + 'ThucHienTinhDiemCauHoi_PhongThi', method: 'POST', versionAPI: V, strIds: id, strNguoiThucHien_Id: P.uid() };
                }, function () { api.tai(); }, { title: 'Đang tạo dữ liệu báo cáo' });
            } },
            { ma: 'KHOITAODETHI', ten: 'Khởi tạo đề thi', dongTu: 'khởi tạo đề', nhac: 'Vui lòng chọn phòng thi cần khởi tạo đề?', lam: function (ids, api) {
                if (!chon(api, 'dv').id) { ui.toast('Vui lòng chọn đơn vị cần khởi tạo đề?', 'warn'); return; }
                khoiTaoNhieu(ids, api);
            } }
        ],
        thaoTac: function (ids, tv) {
            // gốc: một lời gọi cho từng phòng đã đánh dấu (tham số vẫn tên strExamRoomInfoIds)
            return ids.reduce(function (p, id) {
                return p.then(function () { return g(QL + 'ThaoTacPhongThi_PhongThi', { versionAPI: V, strExamRoomInfoIds: id, strThaoTacPhongThi: tv, strNguoiThucHien_Id: P.uid() }); });
            }, Promise.resolve());
        },
        cot: { anHien: true, sua: true },
        sua: function (room, api) {
            Q.formPhong({ host: api.z('list'), room: room,
                dv: { id: e(room.DEPARTORGANID) || chon(api, 'dv').id, ten: e(room.TENDONVI) || chon(api, 'dv').ten },
                dot: { id: e(room.EXAMSCHEDULEID) || chon(api, 'dot').id, ten: e(room.TENDOTTHI) || chon(api, 'dot').ten },
                sau: function () { api.tai(); } });
        },
        sauDung: sauDung,
        chiTiet: chiTiet
    });

    function sauDung(api) {
        var nam = api.f('nam'), hk = api.f('hk'), dot = api.f('dot'), hp = api.f('hp');
        g(QL + 'LayDS_NamHoc', { strStatus: '1' }).then(function (r) { pat.fill(nam, arr(r.data), { id: 'SCHOOLYEAR', name: 'SCHOOLYEAR', head: 'Chọn năm học' }); })
            .catch(function (err) { ums.api.handle(err, 'năm học'); });
        if (window.jQuery) {
            jQuery(nam).on('select2:select', function () {
                if (!nam.value) return;
                g(QL + 'LayDS_HocKyBySchoolYear', { strStatus: '1', strSchoolYear: nam.value }).then(function (r) { pat.fill(hk, arr(r.data), { id: 'SEMESTER', name: 'SEMESTER', head: 'Chọn học kỳ' }); })
                    .catch(function (err) { ums.api.handle(err, 'học kỳ'); });
            });
            jQuery(hk).on('select2:select', function () {
                if (!hk.value) return;
                g(QL + 'LayDS_DoThiByHocKy', { strStatus: '1', strHocKy: hk.value }).then(function (r) { pat.fill(dot, arr(r.data), { name: 'NAME', head: 'Chọn đợt thi' }); })
                    .catch(function (err) { ums.api.handle(err, 'đợt thi'); });
            });
            jQuery(dot).on('select2:select', function () {
                if (!dot.value) return;
                g(QL + 'LayDS_HocPhan_TheoDotThi', { strDotThiId: dot.value, strNamHoc: nam.value, strHocKy: hk.value }).then(function (r) {
                    var d = r.data || {};
                    pat.fill(hp, Array.isArray(d) ? d : arr(d.Table), { name: 'TEN', head: 'Học phần' });
                }).catch(function (err) { ums.api.handle(err, 'học phần'); });
            });
        }
        pat.chain([nam, hk, dot, hp]);

        /* Mẫu báo cáo theo chức năng (gốc getList_MauImport "zonebtnBaoCao") */
        ums.report.mount(api.z('mauBC'), { import: false, collect: function (add) {
            add('ExamRoomInfo_Id', Q.tt.roomId);
            add('strExamRoomInfoIds', api.daChon().join(';'));
            add('ExamstructPartId', ctApi ? ctApi.phanId() : '');
            add('BAOCAOLOCTHEODULIEU', Q.tt.nhomDuLieu);
            add('strNguoiDangNhap_Id', P.uid());
            add('strChucNang_Id', P.chucNang());
        } });
        root.addEventListener('click', function (ev) {
            var a = ev.target.closest('[data-a="taifile"]');
            if (!a || !api.z('list').contains(a)) return;
            Q.baoCao(api.f('bc').value, { roomIds: api.daChon(), partId: ctApi ? ctApi.phanId() : Q.tt.partId });
        });
    }

    /* ---------- Tác vụ "Báo cáo theo DS" (gốc #zoneBaoCaoLocTheoDuLieu) ---------- */
    function baoCaoTheoDS(ids, api) {
        var el = document.createElement('div');
        el.innerHTML = ui.field('Nhóm dữ liệu', '<input class="ums-input" data-q="nhom" value="' + esc(Q.tt.nhomDuLieu) + '" autocomplete="off">', { required: true });
        pat.formTrang({ host: api.z('list'), title: 'Báo cáo theo danh sách', icon: 'fa-file-chart-column', cols: 1, body: el,
            buttons: [{ text: 'Xuất dữ liệu', kind: 'report', keepOpen: true, onClick: function () {
                Q.tt.nhomDuLieu = el.querySelector('[data-q="nhom"]').value.trim();
                if (!Q.tt.nhomDuLieu) { ui.toast('Chưa nhập nhóm dữ liệu', 'warn'); return false; }
                Q.baoCao('BAOCAOLOCTHEODULIEU', { roomIds: api.daChon() });
                return false;
            } }] });
    }

    /* ---------- Tác vụ "Khởi tạo đề thi" cho các phòng đã đánh dấu (gốc #zoneKhoiTaoDeChoCacPhongThi) ---------- */
    function khoiTaoNhieu(ids, api) {
        var ten = ids.map(function (id) { var r = api.phong(id); return r ? e(r.ROOMNAME) : id; });
        var el = document.createElement('div');
        el.innerHTML = '<div class="ums-u-faint ums-u-fz13 ums-u-mb-4">Khởi tạo đề cho ' + ids.length + ' phòng thi: ' + esc(ten.join(', ')) + '</div><div data-q="khung"></div>';
        var f = pat.formTrang({ host: api.z('list'), title: 'Khởi tạo đề', icon: 'fa-wand-magic-sparkles', cols: 1, body: el });
        function chay(action, them) {
            return g(QL + action, Object.assign({ versionAPI: V, strIds: ids.join(','), strNguoiThucHien_Id: P.uid() }, them), true)
                .then(function () { ui.toast('Thực hiện khởi tạo đề thành công', 'ok'); api.tai(); f.close(); })
                .catch(function (err) { Q.loiTaoDe(err, api.rows()); });
        }
        Q.khungTaoDe(el.querySelector('[data-q="khung"]'), {
            dvId: chon(api, 'dv').id,
            coSan: function (ct, de) { return chay('ThucHienGenDeTuDeThiCoSan_CacPhongThi', { strExamStructId: ct, strWritenExamId: de }); },
            ngauNhien: function (ct) { return chay('ThucHienGenDe_NgauNhien_CacPhongThi', { strExamStructId: ct }); },
            cungDe: function (ct) { return chay('ThucHienGenDe_CungDe_CacPhongThi', { strExamStructId: ct }); }
        });
    }

    /* =====================================================================
       Chi tiết phòng thi (gốc #zoneChiTiet) — khung Cổng cán bộ + các nút riêng của màn quản trị
       ===================================================================== */
    function chiTiet(room, host) {
        Q.tt.roomId = e(room.ID);
        Q.tt.phong = man.rows();
        var don = G.chiTiet(room, host, {
            phanTrang: true, anhThiSinh: true, matKhau: false, tinhLaiSauGhi: true, ketQuaThi: true, chuXuLy: 'Xử lý TS',
            baoCao: 'chon', baoCaoMa: [['BAOCAODIEM', 'Báo cáo điểm'], ['BAOCAODIEMCAUHOI', 'Báo cáo điểm chi tiết']],
            baoCaoChay: function (code, partId) { Q.baoCao(code, { roomId: e(room.ID), partId: partId, roomIds: man.daChon() }); },
            tenBam: function (r, api) { formThiSinh(room, r, api); },
            tools: {
                truocPhan: ui.btn('importer', { text: 'Import DS Thí sinh', icon: 'fa-file-excel', attr: { 'data-ct': 'importts' } }) +
                    ui.btn('add', { text: 'Thêm thí sinh', attr: { 'data-ct': 'themts' } }),
                sauPhan: ui.btn('save', { text: 'Tạo đề cho phòng thi', icon: 'fa-wand-magic-sparkles', mod: 'out-primary', attr: { 'data-ct': 'taode' } }) +
                    ui.btn('save', { text: 'Tạo đề cho phòng thi từ đề thi thủ công', icon: 'fa-file-pen', mod: 'out-primary', attr: { 'data-ct': 'taodetc' } }),
                sauCongNhan: ui.btn('save', { text: 'Chuyển lại dữ liệu', icon: 'fa-arrow-right-arrow-left', attr: { 'data-ct': 'chuyendl' } }),
                cuoi: ui.btn('search', { text: 'Xem kết quả điểm(đang test)', mod: 'out-primary',
                    attr: { 'data-ct': 'kqtest', disabled: 'disabled', title: 'Bản gốc gọi lời gọi thử nghiệm LayDS_ChiTietPhongThi_KetQua_dangtest — khoá' } }) +
                    ui.xoaChon('input[data-ck]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-ct': 'xoats' } })
            },
            onCt: function (k, api) {
                if (k === 'importts') Q.importTS({ room: room, sau: function (kq) { api.tai('1'); Q.ketQuaImport(host, kq); } });
                else if (k === 'themts') formThiSinh(room, null, api);
                else if (k === 'taode') khungTaoDe(room, host, api);
                else if (k === 'taodetc') { if (!api.phanId()) { ui.toast('Chưa chọn phần thi', 'warn'); return; } khungTaoDeTC(room, host, api); }
                else if (k === 'chuyendl') theoThiSinh(api, 'Bạn chưa chọn thí sinh', 'Chuyển lại dữ liệu điểm của %n thí sinh đã chọn?', function (r) {
                    return { action: QL + 'ChuyenDuLieuDiem_ThiSinh', method: 'POST', versionAPI: V, strExamRoomInfoId: e(r.EXAMROOMINFOID) || e(room.ID), strUserId: e(r.USERID),
                        strChucNang_Id: P.chucNang(), strUngDung_Id: P.vaiTro(), strNguoiThucHien_Id: P.uid() };
                }, { title: 'Chuyển lại dữ liệu' });
                else if (k === 'xoats') theoThiSinh(api, 'Vui lòng chọn đối tượng cần xóa?', 'Bạn có chắc chắn xóa %n thí sinh khỏi phòng thi không?', function (r) {
                    return { action: QL + 'Xoa_ThiSinhKhoiPhongThi', method: 'POST', versionAPI: V, strExamRoomInfoId: e(r.EXAMROOMINFOID) || e(room.ID), strUserId: e(r.USERID), strNguoiThucHien_Id: P.uid() };
                }, { tone: 'bad', ok: 'Xóa', title: 'Đang xóa thí sinh' });
            },
            sanSang: function (api) { ctApi = api; }
        });
        return function () { ctApi = null; Q.tt.roomId = ''; if (typeof don === 'function') don(); };
    }

    /** Chạy một lệnh POST cho từng thí sinh đã đánh dấu (dòng theo ID), hỏi lại, xong nạp lại với '1' */
    function theoThiSinh(api, nhacTrong, hoi, lam, o) {
        var ids = api.daChon();
        if (!ids.length) { ui.toast(nhacTrong, 'warn'); return; }
        var rows = api.rows().filter(function (r) { return ids.indexOf(e(r.ID)) >= 0; });
        ui.confirm(hoi.replace('%n', rows.length), o).then(function (yes) {
            if (!yes) return;
            return ui.batch(rows.map(lam), { title: o.title, okText: 'Thực hiện thành công' }).then(function () { api.tai('1'); });
        });
    }

    /* ---------- Biểu mẫu thí sinh (gốc #zoneThiSinh): thêm mới / sửa khi bấm họ tên ---------- */
    function formThiSinh(room, r, api) {
        var el = document.createElement('div');
        el.className = 'ums-grid ums-grid--2';
        el.innerHTML = ui.field('Mã sinh viên', Q.inp('ma'), { required: true }) + ui.field('Lớp', Q.inp('lop')) +
            ui.field('Họ đệm', Q.inp('ho'), { required: true }) + ui.field('Tên', Q.inp('ten'), { required: true }) +
            ui.field('Số báo danh', Q.inp('sbd'), { required: true }) + ui.field('Ngày sinh', Q.inp('ns', { date: true, ph: 'dd/MM/yyyy' }), { required: true });
        function q(k) { return el.querySelector('[data-q="' + k + '"]'); }
        function v(k) { return q(k).value.trim(); }
        if (r) { q('ma').value = e(r.STUDENTCODE); q('lop').value = e(r.CLASSNAMEIMPORT); q('ho').value = e(r.HODEM); q('ten').value = e(r.TEN); q('sbd').value = e(r.SOBAODANHIMPORT); q('ns').value = e(r.BIRTHDATE_USER); }
        pat.formTrang({ host: api.host, title: 'Thí sinh', icon: 'fa-user-graduate', body: el, buttons: [{ text: 'Lưu', kind: 'save', keepOpen: true, onClick: function (f) {
            var thieu = [['ma', 'Mã sinh viên'], ['ho', 'Họ đệm'], ['ten', 'Tên'], ['sbd', 'Số báo danh'], ['ns', 'Ngày sinh']].filter(function (x) { return !v(x[0]); });
            if (thieu.length) { ui.toast('Chưa nhập: ' + thieu.map(function (x) { return x[1]; }).join(', '), 'warn'); return false; }
            g(QL + 'ThemMoiCapNhat_StudentExamRoom', { versionAPI: V, strId: r ? e(r.USERID) : '#', strExamRoomInfoId: e(room.ID), strStudentCode: v('ma'), strLastName: v('ho'),
                strFirtName: v('ten'), strClassName: v('lop'), strSoBaoDanh: v('sbd'), strBirthDate: v('ns'), strDatMatKhauChoPhongThi: e(room.MATKHAUCHOPHONGTHI),
                strThi_DanhsachSinhVien_Id: '', strNguoiThucHien_Id: P.uid() }, true)
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); api.tai('1'); f.close(); })
                .catch(function (err) { ums.api.handle(err, 'lưu thí sinh'); });
            return false;
        } }] });
    }

    /* ---------- Khung "Tạo đề" cho MỘT phòng (gốc #zoneTaoDeThi): thông tin phòng / đề, mật khẩu phần thi, hai tab tạo đề ---------- */
    function khungTaoDe(room, host, api) {
        var el = document.createElement('div');
        el.innerHTML = P.thongTin(room) +
            pat.panel({ title: 'Mật khẩu phần thi', icon: 'fa-key', cls: 'ums-u-mt-4', body: '<div class="qlt-mk" data-q="mk">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
                foot: ui.btn('save', { text: 'Cập nhật mật khẩu phần thi', icon: 'fa-key', attr: { 'data-q': 'luumk' } }) }) +
            '<div class="ums-u-mt-4" data-q="khung"></div>';
        var f = pat.formTrang({ host: host, title: 'Tạo đề', icon: 'fa-wand-magic-sparkles', cols: 1, body: el });
        var mkZone = el.querySelector('[data-q="mk"]');
        Q.doDe(el, api.de());
        function veMK() {
            g('TTN_ThiSinh/LayDS_MatKhauPhanThi', { versionAPI: V, strExamRoomInfoId: e(room.ID) }).then(function (r) {
                var mk = {};
                arr(r.data).forEach(function (x) { mk[e(x.EXAMSTRUCTPARTID)] = e(x.MATKHAUPHANTHI); });
                var parts = api.phan();
                mkZone.innerHTML = parts.length ? parts.map(function (p) {
                    var val = mk[e(p.ID)] || '';
                    return '<div class="ums-kv"><span>Mật khẩu phần ' + esc(e(p.TITLE)) + '</span><b><input class="ums-input ums-input--sm" data-mkp="' + esc(e(p.ID)) + '" data-cu="' + esc(val) + '" value="' + esc(val) + '" title="' + esc(e(p.KIEULAMBAITHI)) + '" autocomplete="off"></b></div>';
                }).join('') : ui.empty('Đề chưa có phần thi', 'fa-key');
            }).catch(function (err) { mkZone.innerHTML = ui.fail(err.message); ums.api.handle(err, 'mật khẩu phần thi'); });
        }
        (api.phan().length ? Promise.resolve() : api.taiDe()).then(veMK);
        el.addEventListener('click', function (ev) {
            if (!ev.target.closest('[data-q="luumk"]')) return;
            var calls = [];
            Array.prototype.forEach.call(mkZone.querySelectorAll('input[data-mkp]'), function (i) {
                if (i.value === i.getAttribute('data-cu')) return;
                calls.push({ action: QL + 'CapNhatMatKhauPhanThi', method: 'GET', versionAPI: V, strExamRoomInfoId: e(room.ID), strExamStructId: i.getAttribute('data-mkp'), strMatKhauPhanThi: i.value });
            });
            if (!calls.length) { ui.toast('Không có mật khẩu nào thay đổi', 'info'); return; }
            ui.batch(calls, { title: 'Đang cập nhật mật khẩu', okText: 'Cập nhật thành công' }).then(veMK);
        });
        function chay(action, them) {
            return g(QL + action, Object.assign({ versionAPI: V, strExamRoomInfoId: e(room.ID), strNguoiTaoId: P.uid() }, them))
                .then(function () {
                    ui.toast('Thực hiện khởi tạo đề thành công', 'ok');
                    return api.taiDe().then(function () { Q.doDe(el, api.de()); veMK(); api.tai('1'); });
                }).catch(function (err) { Q.loiTaoDe(err, [room]); });
        }
        Q.khungTaoDe(el.querySelector('[data-q="khung"]'), {
            dvId: e(room.DEPARTORGANID),
            coSan: function (ct, de) { return chay('ThucHienGenDeTuDeThiCoSan', { strExamStructId: ct, strWritenExamId: de }); },
            ngauNhien: function (ct) { return chay('ThucHienGenDe_NgauNhien', { strExamStructId: ct }); },
            cungDe: function (ct) { return chay('ThucHienGenDe_CungDe', { strExamStructId: ct }); }
        });
        return f;
    }

    /* ---------- Khung "Tạo đề từ đề thi thủ công" (gốc #zoneTaoDeTuDeThiThuCong) ---------- */
    function khungTaoDeTC(room, host, api) {
        var partId = api.phanId(), tenPhan = Q.tenChon(host.querySelector('select[data-ct="phan"]'));
        var dsDe = [];
        var el = document.createElement('div');
        el.innerHTML = P.thongTin(room) +
            pat.panel({ title: 'Phần thi', icon: 'fa-layer-group', cls: 'ums-u-mt-4', body: P.kv('Tên phần thi', tenPhan) +
                '<div class="ums-grid ums-grid--2 ums-u-mt-3"><div class="ums-field"><select class="ums-select" data-q="nhom" data-ph="Chọn nhóm câu hỏi"><option value="">Chọn nhóm câu hỏi</option></select></div></div>' +
                '<div class="ums-u-mt-3" data-q="bang"></div>' +
                '<div class="ums-row qlt-nut ums-u-mt-3">' +
                ui.btn('add', { text: 'Lấy ra n đề rồi tạo đề', mod: 'out-primary', attr: { 'data-q': 'layn' } }) +
                '<input class="ums-input ums-input--so qlt-son" data-q="n" placeholder="n" inputmode="numeric" autocomplete="off">' +
                ui.btn('save', { text: 'Thực hiện khởi tạo lấy đề ngẫu nhiên', icon: 'fa-shuffle', mod: 'primary', attr: { 'data-q': 'ngaunhien' } }) +
                ui.btn('save', { text: 'Thực hiện khởi tạo đề cho thí sinh lấy đề ngẫu nhiên', icon: 'fa-user-check', mod: 'primary', attr: { 'data-q': 'thisinh' } }) +
                '</div>' });
        var f = pat.formTrang({ host: host, title: 'Tạo đề từ đề thi thủ công', icon: 'fa-file-pen', cols: 1, body: el });
        Q.doDe(el, api.de());
        var nhom = el.querySelector('[data-q="nhom"]'), bang = el.querySelector('[data-q="bang"]');
        Q.bangDe(bang, [], 'qlt-de-tc');
        Q.nhomCauHoi(e(room.DEPARTORGANID)).then(function (ds) { pat.fill(nhom, ds, { name: 'GROUPQUESTIONNAME', head: 'Chọn nhóm câu hỏi' }); })
            .catch(function (err) { ums.api.handle(err, 'nhóm câu hỏi'); });
        if (window.jQuery) jQuery(nhom).on('select2:select select2:clear', function () {
            if (!nhom.value) { dsDe = []; Q.bangDe(bang, [], 'qlt-de-tc'); return; }
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            Q.deThiThuCong(e(room.DEPARTORGANID), nhom.value).then(function (ds) { dsDe = ds; Q.bangDe(bang, ds, 'qlt-de-tc'); })
                .catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'đề thi thủ công'); });
        });
        function deChon() {
            var id = Q.deChon(bang);
            if (!id) { ui.toast('Bạn chưa chọn đề để tạo?', 'warn'); return null; }
            return dsDe.filter(function (d) { return e(d.ID) === id; })[0] || { ID: id };
        }
        function chay(action, them) {
            return g(QL + action, Object.assign({ versionAPI: V, strExamRoomInfoId: e(room.ID), strExamstructPartId: partId, strNguoiThucHien_Id: P.uid() }, them))
                .then(function () {
                    ui.toast('Thực hiện khởi tạo đề thành công', 'ok');
                    api.tai('1');
                    return api.taiDe().then(function () { Q.doDe(el, api.de()); });
                }).catch(function (err) { Q.loiTaoDe(err, [room]); });
        }
        el.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-q]'); if (!b) return;
            var k = b.getAttribute('data-q'), de = deChon();
            if (!de) return;
            if (k === 'layn') {
                var n = el.querySelector('[data-q="n"]').value.trim();
                if (!n) { ui.toast('Bạn chưa nhập số đề lấy ra?', 'warn'); return; }
                if (isNaN(Number(n)) || Number(n) < 1) { ui.toast('Số đề lấy ra phải là số nguyên dương', 'warn'); return; }
                if (parseInt(e(de.SODETAO), 10) < parseInt(n, 10)) { ui.toast('Số đề lấy ra lớn hơn đề đã tạo?', 'warn'); return; }
                ui.confirm('Lấy ' + n + ' đề từ "' + e(de.NAME) + '" rồi tạo đề cho phòng thi?', { title: 'Khởi tạo đề', ok: 'Tạo đề' }).then(function (yes) {
                    if (yes) chay('ThucHienGenLayNDeTuDeThiThuCong', { strDeThiThuCongId: e(de.ID), strSoDeLayRa: n });
                });
            } else if (k === 'ngaunhien') {
                ui.confirm('Bạn có chắc chắn tạo đề?', { title: 'Khởi tạo đề', ok: 'Tạo đề' }).then(function (yes) { if (yes) chay('ThucHienGenDeTuDeThiThuCong', { strDeThiThuCongId: e(de.ID) }); });
            } else if (k === 'thisinh') {
                var ids = api.daChon();
                if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
                ui.confirm('Tạo đề ngẫu nhiên từ "' + e(de.NAME) + '" cho ' + ids.length + ' thí sinh đã chọn?', { title: 'Khởi tạo đề', ok: 'Tạo đề' }).then(function (yes) {
                    if (yes) chay('ThucHienGenDeThiSinhTuDeThiThuCong', { strDeThiThuCongId: e(de.ID), strStudentExamRoom_Ids: ids.join(',') });
                });
            }
        });
        return f;
    }
})();
