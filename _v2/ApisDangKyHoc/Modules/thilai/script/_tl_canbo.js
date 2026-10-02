/* =========================================================================
   Kế hoạch thi lại — vùng "Cán bộ tự đăng ký" (nút "Cán bộ đăng ký")
   Bản gốc: kehoach.html #zoneCanBoDangKy + kehoach.js getList_CBDangKy,
            getList_KhoiTaoCBDangKy, save_CbDangKy, delete_CbDangKy,
            edu.extend.genBoLoc_HeKhoa("_CB")
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên văn):
     DKH_DangKyThi_MonThi_ThongTin/LayDSHocPhanDangKyTheoPhamVi   GET
         strChucNang_Id (tự điền), dKhoiTaoDuLieu 0 = "Danh sách" / 1 = "Khởi tạo dữ liệu",
         strDaoTao_HeDaoTao_Id, strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id (chọn nhiều,
         "a,b"), strDangKy_Thi_HP_KeHoach_Id
         cột QLSV_NGUOIHOC_MASO, _HODEM, _TEN, DAOTAO_LOPQUANLY_TENLOP,
         DAOTAO_TOCHUCCHUONGTRINH_TEN, DAOTAO_HOCPHAN_TEN, DAOTAO_HOCPHAN_MA
     DKH_DangKyThi_MonThi_ThongTin/ThucHienDangKy       "Đăng ký"     — strQLHLTL_NguoiHoc_Id = ID dòng
     DKH_DangKyThi_MonThi_ThongTin/ThucHienHuyDangKy    "Hủy đăng ký" — strQLHLTL_NguoiHoc_Id = ID dòng
     Import: .btnImportWithProce → edu.system.showImportChungV2(title, name) của vỏ Corei
         IMPORTWITHPROC_MTTHUCHIENDANGKY ("Người học") · IMPORTWITHPROC_MTHUYDANGKY ("Hủy đk")
         → ums.report.importChung (bản V2 có thêm ô chọn sheet — tầng chung chưa có).
   Bộ lọc Hệ → Khoá → Chương trình: genBoLoc_HeKhoa = bản LỌC QUYỀN → ums.ref.cascadeQuyen
   (đã tự khoá tầng dưới khi chưa chọn tầng trên).
   Như gốc: mở vùng là nạp danh sách ngay (bộ lọc trống); Đăng ký không hỏi lại,
   Hủy đăng ký có hỏi lại. Khác gốc: import xong nạp lại danh sách.
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, pat = ums.pat, esc = ui.esc, T = ums.tlKh;
    var e = T.e;

    T.vungCanBo = function (host, kh, ctx) {
        host.innerHTML =
            pat.panel({
                title: 'Cán bộ tự đăng ký — ' + e(kh.TENKEHOACH), icon: 'fa-user-pen', cls: 'ums-u-mb-4',
                tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
                body: '<div class="ums-filter">' +
                    '<div class="ums-field"><select class="ums-select" data-f="he" data-ph="Chọn hệ đào tạo"><option value="">Chọn hệ đào tạo</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="khoa" data-ph="Chọn khóa đào tạo"><option value="">Chọn khóa đào tạo</option></select></div>' +
                    '<div class="ums-field"><select class="ums-select" data-f="ct" multiple data-ph="Chọn chương trình đào tạo"></select></div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: 'Danh sách', attr: { 'data-a': 'tim' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('add', { text: 'Khởi tạo dữ liệu', mod: 'primary', attr: { 'data-a': 'khoitao' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('importer', { text: 'Import thực hiện đăng ký', attr: { 'data-a': 'imp', 'data-ma': 'IMPORTWITHPROC_MTTHUCHIENDANGKY', 'data-ten': 'Người học' } }) + '</div>' +
                    '<div class="ums-field ums-field--fit">' + ui.btn('importer', { text: 'Import Hủy đăng ký', attr: { 'data-a': 'imp', 'data-ma': 'IMPORTWITHPROC_MTHUYDANGKY', 'data-ten': 'Hủy đk' } }) + '</div>' +
                '</div>'
            }) +
            pat.panel({
                title: 'Danh sách', icon: 'fa-list-ul', count: 'n', flush: true, zone: 'bang',
                tools: ui.xoaChon('input[data-cb]', { goc: '.ums-panel', text: 'Hủy đăng ký', attr: { 'data-a': 'huy' } }) +
                    ui.btn('save', { text: 'Đăng ký', mod: 'primary', icon: 'fa-user-pen', attr: { 'data-a': 'dangky' } })
            });
        function f(k) { return host.querySelector('[data-f="' + k + '"]'); }
        var bang = host.querySelector('[data-z="bang"]');
        var rows = [];
        ui.enhance(host);
        T.ganChon(host);
        ums.ref.cascadeQuyen({ he: f('he'), khoa: f('khoa'), ct: f('ct') });

        function nap(khoiTao) {
            T.dang(bang);
            ums.api.call({
                action: T.TT + 'LayDSHocPhanDangKyTheoPhamVi', method: 'GET',
                strChucNang_Id: '',
                dKhoiTaoDuLieu: khoiTao ? 1 : 0,
                strDaoTao_HeDaoTao_Id: f('he').value,
                strDaoTao_KhoaDaoTao_Id: f('khoa').value,
                strDaoTao_ChuongTrinh_Id: pat.val(f('ct')),
                strDangKy_Thi_HP_KeHoach_Id: kh.ID,
                strNguoiThucHien_Id: ''
            }).then(function (r) {
                rows = T.ds(r);
                host.querySelector('[data-z="n"]').textContent = '(' + rows.length + ')';
                ui.table({ el: bang, rows: rows, empty: 'Không có dữ liệu', columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: function (x) { return esc(T.hoTen(x)); } },
                    { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TENLOP', cls: 'is-nowrap' },
                    { title: 'Chương trình', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
                    { title: 'Học phần', render: function (x) { return esc(e(x.DAOTAO_HOCPHAN_TEN) + ' (' + e(x.DAOTAO_HOCPHAN_MA) + ')'); } },
                    T.cotChon('cb')
                ] });
            }).catch(function (err) { rows = []; T.loi(bang, err, 'danh sách cán bộ đăng ký'); });
        }
        function goi(act, ids) {
            return ids.map(function (id) {
                return { action: T.TT + act, strDangKy_Thi_HP_KeHoach_Id: kh.ID, strNguoiThucHien_Id: '', strQLHLTL_NguoiHoc_Id: id };
            });
        }

        host.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-a]');
            if (!b || !host.contains(b)) return;
            var a = b.getAttribute('data-a'), ids;
            if (a === 'dong') return ctx.dong();
            if (a === 'tim') return nap(false);
            if (a === 'khoitao') return nap(true);
            if (a === 'imp') {
                ums.report.importChung(b.getAttribute('data-ten'), b.getAttribute('data-ma'), { onDone: function () { nap(false); } });
                return;
            }
            ids = T.daChon(bang, 'cb');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng', 'warn'); return; }
            if (a === 'dangky') {
                ui.batch(goi('ThucHienDangKy', ids), { title: 'Đang đăng ký', okText: 'Thực hiện thành công' }).then(function () { nap(false); });
            } else if (a === 'huy') {
                T.xoa(goi('ThucHienHuyDangKy', ids), function () { nap(false); });
            }
        });

        nap(false);
    };
})();
