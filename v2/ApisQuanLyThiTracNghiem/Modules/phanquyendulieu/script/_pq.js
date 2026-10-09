/* =========================================================================
   Phân quyền dữ liệu (thi trắc nghiệm) — khung chung của ba màn: ums.qlttnPq
   Bản gốc: ApisQuanLyThiTracNghiem/modules/phanquyendulieu/{html,script}/phanquyendulieu, phanquyenpheduyetdiem,
   phanquyendulieugroupquestion — ba tệp chép nhau: HAI cột (col-sm-3 danh sách người dùng · col-sm-9 khung quyền),
   khung quyền gồm "Người dùng: <tên>" + hai bảng cạnh nhau (col-sm-6 "Danh sách đã phân quyền" có nút Xóa · col-sm-6
   "Danh sách chưa phân quyền" có nút Thêm); hai màn đầu có thêm khung "Chi tiết quyền" THAY CHỖ khung quyền (nút "Sửa cấp
   PD" trên dòng) với bảng Mức × Quyền (ô đánh dấu) + nút "Phân quyền".
   Cột trái dùng CHÍNH ums.cmsNd.dsNguoiDung (ApisCMS/Modules/nguoidung/script/_chung.js) — gốc gọi edu.extend.getList_NguoiDung
   y hệt bốn màn người dùng của CMS (Corei/systemextend.js:2688).

   ums.qlttnPq.man(root, { kieu: 'donvi' | 'pheduyet' | 'nhom', tieuDe })
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên — action kiểu cũ, không func, không iM):
     Người dùng  CMS_QuanLyNguoiDung_MH · pkg_chung_quanlynguoidung.LayDanhSachNguoiDung: strTuKhoa, strPhanLoaiDoiTuong '',
                 dTrangThai 1, strChung_DonVi_Id '', strVaiTro_Id '', strCapXuLy_Id '', strTinhThanh_Id '', pageIndex, pageSize
     donvi / pheduyet:
       Đã PQ     QLTTN_ThongTin/LayDS_NguoiDungDonVi_DaPQ GET versionAPI v1.0, strUserId, PageNumber, ItemPerPage
                 → ID (dòng phân quyền), DONVIID, CODE, NAME, TENNGUOIDUNGCAPPHANQUYEN (donvi) /
                   QUYENDUOCCAP_PHEDUYETNHCH + QUYENDUOCCAP_PHEDUYETDIEM (pheduyet)
       Chưa PQ   QLTTN_ThongTin/LayDS_NguoiDungDonVi_ChuaPQ GET versionAPI v1.0, strUserId, PageNumber, ItemPerPage → ID, CODE, NAME
       Thêm      QLTTN_ThongTin/Them_NguoiDungDonVi POST versionAPI v1.0, strUserId, strDepartOrganId (từng id), strNguoiThucHienId
       Xoá       QLTTN_ThongTin/Xoa_NguoiDungDonVi POST versionAPI v1.0, strId (từng id), strNguoiThucHienId
       Mức       donvi:    QLTTN_ThongTin/LayDS_NguoiDungMucPheDuyet GET versionAPI v1.0, strUserId, strDonViId → ID, NAME, DAPHANQUYEN (> 0 = có)
                 pheduyet: QLTTN_ThongTin/LayDS_NguoiDung_MucPheDuyet GET versionAPI v1.0, strUserId, strLoaiPheDuyet
                           (PHEDUYETNHCH | PHEDUYETDIEM), strDonViId → ID, NAME, MUCPHEDUYET_NGUOIDUNGID (khác null = có)
       Phân quyền  QLTTN_ThongTin/Them_MucNguoiDungDonVi GET (gốc type GET) versionAPI v1.0, strUserId, strDonViId, strMucPheDuyetId,
                 strCoQuyen '1' | '0', strNguoiThucHienId — gửi cho MỌI mức trong bảng (như gốc), pheduyet gửi bảng Điểm rồi NHCH
     nhom:
       Đơn vị    QLTTN_ThongTin/LayDS_DonViByUserId GET strUserId (= người đăng nhập) → ID, NAME — ô lọc trên bảng "chưa phân quyền"
       Đã PQ     QLTTN_ThongTin/LayDS_GroupQuestion_DaPQ GET versionAPI v1.0, strUserId, PageNumber, ItemPerPage → ID, CODE, NAME
       Chưa PQ   QLTTN_ThongTin/LayDS_GroupQuestion_ChuaPQ GET versionAPI v1.0, strUserId, strDepartOrganId, PageNumber, ItemPerPage
       Thêm      QLTTN_ThongTin/Them_PhanQuyenGroupQuestion POST versionAPI v1.0, strUserId, strGroupQuestionId, strNguoiThucHienId
       Xoá       QLTTN_ThongTin/Xoa_PhanQuyenGroupQuestion POST versionAPI v1.0, strId, strNguoiThucHienId
   Khác gốc / lỗi gốc đã sửa:
     · Thêm / Xoá / Phân quyền: gốc bắn từng lời gọi rồi hẹn 2 giây nạp lại (kể cả khi bấm Huỷ ở hộp hỏi) → ums.ui.batch có tiến độ,
       xong mới nạp lại hai bảng; Xoá nhiều dòng = ui.xoaChon.
     · Gốc gắn trình xử lý #btnYes CỘNG DỒN mỗi lần bấm (bấm Thêm lần hai là chạy cả lệnh lần một) → không còn.
     · Khung "Chi tiết quyền" của gốc là vùng thay chỗ bên cột phải → ums.pat.formTrang (biểu mẫu trong trang, nút Đóng trái,
       "Phân quyền" phải); lưu xong ở lại khung và nạp lại bảng mức + bảng đã phân quyền.
     · nhom: tiêu đề cột gốc chép nhầm "Mã đơn vị / Tên đơn vị" cho bảng nhóm câu hỏi → "Mã nhóm / Tên nhóm câu hỏi";
       câu báo "…cần xóa1?" (gõ nhầm) → "…cần xóa?". Đổi ô Đơn vị là nạp lại bảng chưa phân quyền (như gốc); chưa chọn đơn vị
       vẫn nạp với strDepartOrganId rỗng (như gốc khi vừa chọn người dùng).
     · pheduyet: gốc có ô "Chọn tất cả" ở tiêu đề cột Quyền của từng bảng mức → giữ (ô đầu cột, tự đồng bộ hai chiều).
     · Cột trái theo luật BO-CUC 12 (gõ tự tìm, nút Tải lại) — ums.cmsNd.dsNguoiDung đã lo; hộp rê chuột popover_NguoiDung giữ.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.cmsNd;
    var V = 'v1.0', TT = 'QLTTN_ThongTin/';
    function e(v) { return v === undefined || v === null ? '' : String(v); }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : (d && d.rs) || []; }
    function uid() { return ums.session.userId; }
    function g(action, o, post) { return ums.api.call(Object.assign({ action: action, method: post ? 'POST' : 'GET', versionAPI: V }, o || {})); }

    var Q = ums.qlttnPq = {};

    /* Cấu hình theo kiểu màn */
    var KIEU = {
        donvi: {
            tieuDe: 'Phân quyền dữ liệu', donVi: true,
            da: TT + 'LayDS_NguoiDungDonVi_DaPQ', chua: TT + 'LayDS_NguoiDungDonVi_ChuaPQ',
            them: function (u, id) { return { strUserId: u, strDepartOrganId: id, strNguoiThucHienId: uid() }; }, themAction: TT + 'Them_NguoiDungDonVi',
            xoaAction: TT + 'Xoa_NguoiDungDonVi',
            cotDa: [{ title: 'Mã đơn vị', prop: 'CODE', cls: 'is-nowrap' }, { title: 'Tên đơn vị', prop: 'NAME' },
                { title: 'Cấp phê duyệt NHCH', prop: 'TENNGUOIDUNGCAPPHANQUYEN' }],
            cotChua: [{ title: 'Mã đơn vị', prop: 'CODE', cls: 'is-nowrap' }, { title: 'Tên đơn vị', prop: 'NAME' }],
            muc: [{ key: 'm', title: 'Mức phê duyệt', action: TT + 'LayDS_NguoiDungMucPheDuyet', co: function (r) { return Number(r.DAPHANQUYEN) > 0; } }]
        },
        pheduyet: {
            tieuDe: 'Phân quyền phê duyệt dữ liệu điểm, NHCH', donVi: true,
            da: TT + 'LayDS_NguoiDungDonVi_DaPQ', chua: TT + 'LayDS_NguoiDungDonVi_ChuaPQ',
            them: function (u, id) { return { strUserId: u, strDepartOrganId: id, strNguoiThucHienId: uid() }; }, themAction: TT + 'Them_NguoiDungDonVi',
            xoaAction: TT + 'Xoa_NguoiDungDonVi',
            cotDa: [{ title: 'Mã đơn vị', prop: 'CODE', cls: 'is-nowrap' }, { title: 'Tên đơn vị', prop: 'NAME' },
                { title: 'Cấp phê duyệt NHCH', prop: 'QUYENDUOCCAP_PHEDUYETNHCH' }, { title: 'Cấp phê duyệt Điểm', prop: 'QUYENDUOCCAP_PHEDUYETDIEM' }],
            cotChua: [{ title: 'Mã đơn vị', prop: 'CODE', cls: 'is-nowrap' }, { title: 'Tên đơn vị', prop: 'NAME' }],
            /* Gốc gửi bảng Điểm trước rồi tới NHCH; hiển thị NHCH bên trái, Điểm bên phải như html gốc */
            muc: [{ key: 'nhch', title: 'Mức phê duyệt NHCH', action: TT + 'LayDS_NguoiDung_MucPheDuyet', loai: 'PHEDUYETNHCH', thuTu: 2,
                    co: function (r) { return r.MUCPHEDUYET_NGUOIDUNGID !== null && r.MUCPHEDUYET_NGUOIDUNGID !== undefined && r.MUCPHEDUYET_NGUOIDUNGID !== ''; } },
                  { key: 'diem', title: 'Mức phê duyệt Điểm', action: TT + 'LayDS_NguoiDung_MucPheDuyet', loai: 'PHEDUYETDIEM', thuTu: 1,
                    co: function (r) { return r.MUCPHEDUYET_NGUOIDUNGID !== null && r.MUCPHEDUYET_NGUOIDUNGID !== undefined && r.MUCPHEDUYET_NGUOIDUNGID !== ''; } }]
        },
        nhom: {
            tieuDe: 'Phân quyền nhóm câu hỏi', donVi: false, locDonVi: true,
            da: TT + 'LayDS_GroupQuestion_DaPQ', chua: TT + 'LayDS_GroupQuestion_ChuaPQ',
            them: function (u, id) { return { strUserId: u, strGroupQuestionId: id, strNguoiThucHienId: uid() }; }, themAction: TT + 'Them_PhanQuyenGroupQuestion',
            xoaAction: TT + 'Xoa_PhanQuyenGroupQuestion',
            cotDa: [{ title: 'Mã nhóm', prop: 'CODE', cls: 'is-nowrap' }, { title: 'Tên nhóm câu hỏi', prop: 'NAME' }],
            cotChua: [{ title: 'Mã nhóm', prop: 'CODE', cls: 'is-nowrap' }, { title: 'Tên nhóm câu hỏi', prop: 'NAME' }],
            muc: null
        }
    };

    Q.man = function (root, o) {
        var K = KIEU[o.kieu] || KIEU.donvi;
        var st = { nd: null, da: { page: 1, size: 10, rows: [], total: 0 }, chua: { page: 1, size: 10, rows: [], total: 0 } };

        var m = pat.master({
            el: root, title: o.tieuDe || K.tieuDe,
            side: { title: 'Danh sách người dùng', icon: 'fa-users', search: 'Nhập từ khóa tìm kiếm', page: { index: 1, size: 10, total: 0 } },
            main: { title: false }
        });
        var main = m.mainBody;

        /* ---------- Khung quyền (zoneQuyen) ---------------------------------- */
        function cotChon(k) {
            return { head: '<input type="checkbox" data-pq="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                render: function (r) { return '<input type="checkbox" data-pq="' + k + '" value="' + esc(r.ID) + '">'; } };
        }
        main.innerHTML = pat.panel({
            title: 'Người dùng:', icon: 'fa-user', count: 'ten', cls: 'qlpq-khung',
            body: '<div class="ums-grid ums-grid--2 qlpq-hai">' +
                pat.panel({ title: 'Danh sách đã phân quyền', icon: 'fa-user-check', count: 'daN', flush: true, zone: 'da', cls: 'ums-u-mb-0',
                    tools: ui.xoaChon('input[data-pq="da"]', { goc: '.ums-panel', text: 'Xóa', attr: { 'data-a': 'xoa' } }) }) +
                pat.panel({ title: 'Danh sách chưa phân quyền', icon: 'fa-user-plus', count: 'chuaN', flush: true, cls: 'ums-u-mb-0',
                    tools: ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'them' } }),
                    body: (K.locDonVi ? '<div class="qlpq-loc"><div class="ums-field"><select class="ums-select" data-f="dv" data-ph="Chọn đơn vị">' +
                        '<option value="">Chọn đơn vị</option></select></div></div>' : '') + '<div data-z="chua"></div>' }) +
                '</div>'
        });
        ui.enhance(main);
        function z(k) { return main.querySelector('[data-z="' + k + '"]'); }
        var selDv = main.querySelector('[data-f="dv"]');
        function nhac(msg) { return ui.empty(msg || 'Chọn một người dùng ở cột trái', 'fa-hand-pointer'); }
        z('da').innerHTML = nhac();
        z('chua').innerHTML = nhac();

        if (selDv) {
            ums.api.call({ action: TT + 'LayDS_DonViByUserId', method: 'GET', strUserId: uid() }).then(function (r) {
                pat.fill(selDv, arr(r.data), { name: 'NAME', head: 'Chọn đơn vị' });
            }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
            if (window.jQuery) jQuery(selDv).on('select2:select select2:clear', function () { if (st.nd) taiChua(1); });
        }

        function bang(k, s, cot, action, them, vung) {
            if (!st.nd) { vung.innerHTML = nhac(); return Promise.resolve(); }
            vung.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var o = Object.assign({ strUserId: st.nd.ID, PageNumber: s.page, ItemPerPage: s.size }, them || {});
            return g(action, o).then(function (r) {
                s.rows = arr(r.data);
                s.total = Number(r.pager) || s.rows.length;
                z(k + 'N').textContent = '(' + s.total + ')';
                ui.table({ el: vung, rows: s.rows, columns: cot.concat([cotChon(k)]), empty: 'Không có dữ liệu',
                    page: { index: s.page, size: s.size, total: s.total,
                        onChange: function (p) { s.page = p; bang(k, s, cot, action, them, vung); },
                        onSize: function (n) { s.size = n; s.page = 1; bang(k, s, cot, action, them, vung); } } });
            }).catch(function (err) { vung.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phân quyền'); });
        }
        function cotSua() {
            return { title: 'Sửa cấp PD', cls: 'is-center is-nowrap', render: function (r) {
                return ui.btn('edit', { text: 'Sửa', cls: 'ums-btn--sm', attr: { 'data-sua': esc(r.ID) } });
            } };
        }
        function taiDa(p) { if (p) st.da.page = p; return bang('da', st.da, K.muc ? K.cotDa.concat([cotSua()]) : K.cotDa, K.da, null, z('da')); }
        function taiChua(p) {
            if (p) st.chua.page = p;
            return bang('chua', st.chua, K.cotChua, K.chua, K.locDonVi ? { strDepartOrganId: selDv ? selDv.value : '' } : null, z('chua'));
        }
        function taiCaHai() { taiDa(); taiChua(); }

        function daChon(k) {
            return Array.prototype.map.call(main.querySelectorAll('tbody input[data-pq="' + k + '"]:checked'), function (c) { return c.value; });
        }
        function them() {
            var ids = daChon('chua');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần thêm?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thêm dữ liệu không? (' + ids.length + ' dòng)', { title: K.tieuDe, ok: 'Thêm' }).then(function (yes) {
                if (!yes) return;
                var calls = ids.map(function (id) { return Object.assign({ action: K.themAction, method: 'POST', versionAPI: V }, K.them(st.nd.ID, id)); });
                ui.batch(calls, { title: 'Đang thêm phân quyền', okText: 'Thực hiện thành công' }).then(function () { st.chua.page = 1; taiCaHai(); });
            });
        }
        function xoa() {
            var ids = daChon('da');
            if (!ids.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn xóa dữ liệu không? (' + ids.length + ' dòng)', { title: K.tieuDe, ok: 'Xóa', tone: 'bad' }).then(function (yes) {
                if (!yes) return;
                var calls = ids.map(function (id) { return { action: K.xoaAction, method: 'POST', versionAPI: V, strId: id, strNguoiThucHienId: uid() }; });
                ui.batch(calls, { title: 'Đang xóa phân quyền', okText: 'Thực hiện thành công' }).then(function () { st.da.page = 1; taiCaHai(); });
            });
        }

        /* ---------- Chi tiết quyền (zoneChiTietQuyen) — thay chỗ khung quyền ---- */
        function chiTietQuyen(dong) {
            var donViId = e(dong.DONVIID), ten = e(dong.NAME);
            var ds = {};
            var ft = pat.formTrang({
                host: main, title: 'Chi tiết quyền', icon: 'fa-user-lock', cols: 1,
                body: '<div class="ums-grid ums-grid--2 qlpq-kv">' +
                        '<div class="ums-kv"><span>Đơn vị</span><b>' + esc(ten) + '</b></div>' +
                        '<div class="ums-kv"><span>Người dùng</span><b>' + esc(e(st.nd.TENDAYDU)) + '</b></div></div>' +
                    '<div class="' + (K.muc.length > 1 ? 'ums-grid ums-grid--2' : '') + ' qlpq-muc">' +
                    K.muc.map(function (mc) {
                        return '<div><h4 class="ums-legend">' + esc(mc.title) + '</h4><div data-muc="' + mc.key + '"></div></div>';
                    }).join('') + '</div>',
                buttons: [{ text: 'Phân quyền', kind: 'save', keepOpen: true, onClick: function () { phanQuyen(); return false; } }]
            });
            var body = ft.body;
            function taiMuc(mc) {
                var vung = body.querySelector('[data-muc="' + mc.key + '"]');
                vung.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                var o = { strUserId: st.nd.ID, strDonViId: donViId };
                if (mc.loai) o.strLoaiPheDuyet = mc.loai;
                return g(mc.action, o).then(function (r) {
                    ds[mc.key] = arr(r.data);
                    ui.table({ el: vung, rows: ds[mc.key], empty: 'Chưa khai mức phê duyệt', chonCuoi: false, columns: [
                        { title: 'Mức', prop: 'NAME' },
                        { head: 'Quyền <input type="checkbox" data-mucall="' + mc.key + '" title="Chọn tất cả">', cls: 'is-center', width: '110px',
                          render: function (x) { return '<input type="checkbox" data-mucck="' + mc.key + '" value="' + esc(x.ID) + '"' + (mc.co(x) ? ' checked' : '') + '>'; } }
                    ] });
                    ui.dongBoChon(vung.querySelector('table'));
                }).catch(function (err) { vung.innerHTML = ui.fail(err.message); ums.api.handle(err, mc.title); });
            }
            K.muc.forEach(taiMuc);
            body.addEventListener('change', function (ev) {
                var k = ev.target.getAttribute && ev.target.getAttribute('data-mucall');
                if (!k) return;
                Array.prototype.forEach.call(body.querySelectorAll('input[data-mucck="' + k + '"]'), function (c) { c.checked = ev.target.checked; });
            });
            function phanQuyen() {
                var calls = [];
                K.muc.slice().sort(function (a, b) { return (a.thuTu || 0) - (b.thuTu || 0); }).forEach(function (mc) {
                    (ds[mc.key] || []).forEach(function (r) {
                        var c = body.querySelector('input[data-mucck="' + mc.key + '"][value="' + e(r.ID).replace(/"/g, '\\"') + '"]');
                        calls.push({ action: TT + 'Them_MucNguoiDungDonVi', method: 'GET', versionAPI: V, strUserId: st.nd.ID, strDonViId: donViId,
                            strMucPheDuyetId: r.ID, strCoQuyen: c && c.checked ? '1' : '0', strNguoiThucHienId: uid() });
                    });
                });
                if (!calls.length) { ui.toast('Chưa có mức phê duyệt nào để phân quyền', 'warn'); return; }
                ui.confirm('Bạn có chắc chắn thực hiện?', { title: 'Phân quyền', ok: 'Phân quyền' }).then(function (yes) {
                    if (!yes) return;
                    ui.batch(calls, { title: 'Đang phân quyền', okText: 'Thực hiện thành công' }).then(function () {
                        K.muc.forEach(taiMuc);
                        taiDa();
                    });
                });
            }
        }

        /* ---------- Sự kiện ------------------------------------------------- */
        main.addEventListener('change', function (ev) {
            if (ev.target.getAttribute('data-pq') !== 'all') return;
            var t = ev.target.closest('table');
            if (t) Array.prototype.forEach.call(t.querySelectorAll('tbody input[data-pq]'), function (c) { c.checked = ev.target.checked; });
        });
        main.addEventListener('click', function (ev) {
            if (ev.target.closest('.ums-formtrang')) return;
            var s = ev.target.closest('[data-sua]');
            if (s) {
                var id = s.getAttribute('data-sua');
                var dong = st.da.rows.filter(function (r) { return e(r.ID) === id; })[0];
                if (dong) chiTietQuyen(dong);
                return;
            }
            var a = ev.target.closest('[data-a]');
            if (!a) return;
            var k = a.getAttribute('data-a');
            if (k === 'them') them();
            else if (k === 'xoa') xoa();
        });

        /* ---------- Cột trái ------------------------------------------------ */
        var ds = N.dsNguoiDung(m, {
            goi: function (tk, page, size) {
                return { action: 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP', func: 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
                    strTuKhoa: tk, strPhanLoaiDoiTuong: '', dTrangThai: 1, strChung_DonVi_Id: '', strVaiTro_Id: '',
                    strCapXuLy_Id: '', strTinhThanh_Id: '', pageIndex: page, pageSize: size };
            },
            onChon: function (r) {
                if (main._umsFormTrang) main._umsFormTrang.close();
                st.nd = r;
                z('ten').textContent = e(r.TENDAYDU);
                st.da.page = 1; st.chua.page = 1;
                taiCaHai();
            }
        });
        ds.nap(1);
        return { ds: ds, taiLai: taiCaHai };
    };
})();
