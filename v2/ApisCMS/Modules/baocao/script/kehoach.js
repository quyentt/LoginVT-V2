/* =========================================================================
   Kế hoạch báo cáo (tổng hợp báo cáo — THBC)
   Bản gốc: ApisCMS/Modules/baocao/html/kehoach.html + script/kehoach.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc. Danh sách + lọc + biểu mẫu → ums.crud (gốc: hộp #myModal,
   nay biểu mẫu thay chỗ danh sách theo luật chung). Nút "Phân quyền các cơ sở
   báo cáo" (con mắt) → khung "Kế hoạch" thay chỗ danh sách (gốc zoneEdit):
   thông tin kế hoạch + "Kết quả phân quyền" + vùng "Thêm" (hai cột Cơ sở đào
   tạo | Báo cáo, đánh dấu rồi Lưu = mọi cặp cơ sở × báo cáo).

   Lời gọi — chép nguyên văn:
     Kế hoạch
       CMS_BaoCao_XuLy_MH/DSA4BRIVCQMCHgokCS4gIikDIC4CIC4P
         func pkg_thbc_xuly.LayDSTHBC_KeHoachBaoCao   strTuKhoa, strTrangThai_Id,
                                                      strNguoiThucHien_Id, pageIndex, pageSize
       CMS_KeHoachBaoCao/ThemMoi | CapNhat   POST  type 'POST', strId, strChucNang_Id,
                         strMa, strTen, strTuNgay, strDenNgay, strTrangThai_Id, strNguoiThucHien_Id
       CMS_KeHoachBaoCao/Xoa                 POST  strIds, strChucNang_Id, strNguoiThucHien_Id
     Phân quyền cơ sở
       CMS_BaoCao_CoSo/LayDanhSach   GET  type 'GET', strTuKhoa "", strTHBC_KeHoachBaoCao_Id,
                                          strThanhPhan_Id "", strThanhPhan_Cha_Id "", pageIndex 1, pageSize 100000
       CMS_BaoCao_CoSo/ThemMoi | CapNhat  POST  type 'POST', strId, strChucNang_Id,
                         strTHBC_HeThongBaoCao_Id, strTHBC_CoSoDaoTao_Id, strTHBC_KeHoachBaoCao_Id
       CMS_BaoCao_CoSo/Xoa           POST  strIds
       CMS_BaoCao_Chung/LayDanhSach      GET  type 'GET', strTuKhoa "", pageIndex 1, pageSize 100000  (cơ sở đào tạo)
       CMS_HeThongBaoCao/LayDanhSach     GET  type 'GET', strTuKhoa "", pageIndex 1, pageSize 100000  (báo cáo)
     Danh mục trạng thái: THBC.KEHOACH.TRANGTHAI.

   Giữ như gốc (ghi can-quyet):
     · Lưu kế hoạch gửi strTrangThai_Id = giá trị ô LỌC "Trạng thái" ở thanh tìm
       kiếm (biểu mẫu gốc không có ô trạng thái). Lọc "Tất cả" → gửi rỗng.
   Lỗi gốc đã sửa:
     · Lưu hàng loạt ở vùng "Thêm" gửi strId = id dòng phân quyền đã mở Sửa
       gần nhất (me.strPhanQuyen_Id không được đặt lại) → mọi cặp thành
       CapNhat đè lên đúng một bản ghi. Nay vùng "Thêm" luôn ThemMoi (strId rỗng).
     · Sửa một dòng phân quyền: gốc gọi lưu rồi hẹn 300ms nạp lại → nay nạp lại
       sau khi máy chủ trả lời.
   Khác gốc (tầng chung): xoá kế hoạch qua ums.crud — nếu máy chủ trả Message
     kèm lời xoá (gốc hiện Message thay câu "Xóa dữ liệu thành công!" và không
     nạp lại), bản mới không hiện Message đó.
   Cặp cha → con: không có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc;
    var root = document.getElementById('cms-kehoach');
    if (!root) return;

    root.innerHTML = '<div data-z="crud"></div><div data-z="pq" hidden></div>';
    var elCrud = root.querySelector('[data-z="crud"]');
    var elPq = root.querySelector('[data-z="pq"]');

    var TRANGTHAI = { dm: 'THBC.KEHOACH.TRANGTHAI' };
    var S = { keHoach: null, dsPq: [], coSo: [], baoCao: [] };

    var crud = ums.crud({
        root: elCrud,
        title: 'Kế hoạch báo cáo',
        formTitle: 'kế hoạch',
        icon: 'fa-list-ul',
        filters: [
            { key: 'tt', type: 'select', label: 'Chọn trạng thái', source: TRANGTHAI },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'CMS_BaoCao_XuLy_MH/DSA4BRIVCQMCHgokCS4gIikDIC4CIC4P',
                    func: 'pkg_thbc_xuly.LayDSTHBC_KeHoachBaoCao',
                    strTuKhoa: f.q,
                    strTrangThai_Id: f.tt,
                    strNguoiThucHien_Id: ums.session.userId
                };
            }
        },
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN' },
            { title: 'Từ ngày', prop: 'TUNGAY', cls: 'is-center is-nowrap' },
            { title: 'Đến ngày', prop: 'DENNGAY', cls: 'is-center is-nowrap' },
            { title: 'Trạng thái', prop: 'TRANGTHAI_TEN', cls: 'is-center' }
        ],
        rowActions: [
            { icon: 'fa-eye', title: 'Phân quyền các cơ sở báo cáo', onClick: function (row) { moPhanQuyen(row); } }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã' },
            { key: 'strTen', col: 'TEN', label: 'Tên' },
            { key: 'strTuNgay', col: 'TUNGAY', label: 'Từ ngày', type: 'date' },
            { key: 'strDenNgay', col: 'DENNGAY', label: 'Đến ngày', type: 'date' }
        ],
        save: function (v, row, c) {
            v.action = row ? 'CMS_KeHoachBaoCao/CapNhat' : 'CMS_KeHoachBaoCao/ThemMoi';
            v.type = 'POST';
            v.strId = row ? row.ID : '';
            v.strTrangThai_Id = c.filterValues().tt || '';
            return v;
        },
        remove: function (ids) {
            return { action: 'CMS_KeHoachBaoCao/Xoa', strIds: ids[0] };
        },
        rowDelete: false,
        multi: false
    });

    /* ---- danh mục cơ sở đào tạo + báo cáo (nạp một lần như gốc) ---- */
    var napDm = Promise.all([
        ums.api.call({ action: 'CMS_BaoCao_Chung/LayDanhSach', method: 'GET', silent: true, type: 'GET',
            strTuKhoa: '', strNguoiThucHien_Id: ums.session.userId, pageIndex: 1, pageSize: 100000 }),
        ums.api.call({ action: 'CMS_HeThongBaoCao/LayDanhSach', method: 'GET', silent: true, type: 'GET',
            strTuKhoa: '', strNguoiThucHien_Id: ums.session.userId, pageIndex: 1, pageSize: 100000 })
    ]).then(function (r) {
        S.coSo = r[0].data || [];
        S.baoCao = r[1].data || [];
    }).catch(function (err) { ums.api.handle(err, 'danh mục cơ sở / báo cáo'); });

    /* ---- khung Phân quyền (zoneEdit) ---- */
    function moPhanQuyen(kh) {
        S.keHoach = kh;
        elPq.innerHTML = pat.panel({
            title: 'Kế hoạch', icon: 'fa-list-check',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }),
            body:
                '<div class="ums-u-semi ums-u-mb-2">Thông tin kế hoạch</div>' +
                '<div class="ums-grid ums-grid--3 ums-u-mb-4">' +
                    '<div class="ums-kv"><span>Tên kế hoạch</span><b>' + esc(kh.TEN || '') + '</b></div>' +
                    '<div class="ums-kv"><span>Từ ngày</span><b>' + esc(kh.TUNGAY || '') + '</b></div>' +
                    '<div class="ums-kv"><span>Đến ngày</span><b>' + esc(kh.DENNGAY || '') + '</b></div>' +
                '</div>' +
                pat.panel({ title: 'Kết quả phân quyền', icon: 'fa-building-shield', count: 'tongPq', flush: true, zone: 'kq',
                    tools: ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'them' } }) }) +
                '<div data-z="them" hidden class="ums-u-mt-4">' +
                    '<div class="ums-grid ums-grid--2">' +
                        pat.panel({ title: 'Cơ sở đào tạo', icon: 'fa-school', flush: true, zone: 'coSo' }) +
                        pat.panel({ title: 'Báo cáo', icon: 'fa-file-lines', flush: true, zone: 'baoCao',
                            tools: ui.btn('save', { attr: { 'data-a': 'luuThem' } }) }) +
                    '</div>' +
                '</div>'
        });
        ui.swap(elCrud, elPq);
        napPq();
    }

    function z(k) { return elPq.querySelector('[data-z="' + k + '"]'); }

    /* getList_PhanQuyen */
    function napPq() {
        var el = z('kq');
        el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({
            action: 'CMS_BaoCao_CoSo/LayDanhSach', method: 'GET', type: 'GET',
            strTuKhoa: '', strTHBC_KeHoachBaoCao_Id: S.keHoach.ID,
            strThanhPhan_Id: '', strThanhPhan_Cha_Id: '',
            strNguoiThucHien_Id: ums.session.userId, pageIndex: 1, pageSize: 100000
        }).then(function (r) {
            S.dsPq = r.data || [];
            z('tongPq').textContent = '(' + S.dsPq.length + ')';
            ui.table({
                el: el, rows: S.dsPq, empty: 'Chưa phân quyền cơ sở nào',
                columns: [
                    { title: 'Trường', prop: 'THBC_NHATRUONG_TEN' },
                    { title: 'Cơ sở đào tạo', prop: 'THBC_COSODAOTAO_TEN' },
                    { title: 'Báo cáo', prop: 'THBC_HETHONGBAOCAO_TEN' },
                    { title: 'Sửa', cls: 'is-actions', width: '64px', render: function (d) { return ui.iconBtn('edit', d.ID); } }
                ]
            });
        }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'CMS_BaoCao_CoSo/LayDanhSach'); });
    }

    function hopChon(rows, cot) {
        return [{ head: '<input type="checkbox" data-tatca title="Chọn tất cả">', cls: 'is-center', width: '48px',
            render: function (d) { return '<input type="checkbox" data-' + cot + ' value="' + esc(d.ID) + '">'; } }];
    }

    function moThem() {
        z('them').hidden = false;
        napDm.then(function () {
            ui.table({ el: z('coSo'), rows: S.coSo, empty: 'Không có cơ sở đào tạo',
                columns: [{ title: 'Trường', prop: 'DAOTAO_COSODAOTAO_CHA_TEN' }, { title: 'Cơ sở đào tạo', prop: 'TEN' }].concat(hopChon(S.coSo, 'cs')) });
            ui.table({ el: z('baoCao'), rows: S.baoCao, empty: 'Không có báo cáo',
                columns: [{ title: 'Báo cáo', prop: 'TEN' }].concat(hopChon(S.baoCao, 'bc')) });
            ui.reveal(z('them'));
        });
    }

    function goiLuu(coSoId, baoCaoId, id) {
        return {
            action: id ? 'CMS_BaoCao_CoSo/CapNhat' : 'CMS_BaoCao_CoSo/ThemMoi',
            type: 'POST', strId: id || '',
            strTHBC_HeThongBaoCao_Id: baoCaoId,
            strTHBC_CoSoDaoTao_Id: coSoId,
            strTHBC_KeHoachBaoCao_Id: S.keHoach.ID,
            strNguoiThucHien_Id: ums.session.userId,
            silent: true
        };
    }

    /* btnSave_PhanQuyen — mọi cặp cơ sở × báo cáo */
    function luuThem() {
        function ds(k) { return Array.prototype.map.call(z('them').querySelectorAll('input[data-' + k + ']:checked'), function (x) { return x.value; }); }
        var cs = ds('cs'), bc = ds('bc');
        if (!cs.length || !bc.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var calls = [];
        cs.forEach(function (c) { bc.forEach(function (b) { calls.push(goiLuu(c, b, '')); }); });
        ui.batch(calls, { title: 'Đang lưu phân quyền' }).then(function (r) {
            ui.toast(r.fail ? 'Thêm ' + r.ok + '/' + calls.length + ' — lỗi: ' + r.errors[0] : 'Thêm mới thành công!', r.fail ? 'warn' : 'ok');
            napPq();
        });
    }

    /* viewForm_PhanQuyen — sửa một dòng (Báo cáo, Cơ sở): biểu mẫu TRONG TRANG (BO-CUC luật 1), thay chỗ khung "Kế hoạch"
       (elPq đã là khung thay chỗ danh sách → tầng hai, nút Đóng của khung ngoài ẩn theo) */
    function suaPq(id) {
        var d = S.dsPq.filter(function (x) { return String(x.ID) === String(id); })[0];
        if (!d) return;
        napDm.then(function () {
            var dlg = pat.formTrang({
                host: elPq, title: 'Phân quyền', icon: 'fa-pen-to-square',
                body:
                    ui.field('Báo cáo', '<select class="ums-select" data-k="bc">' + ui.options(S.baoCao, { title: 'Chọn báo cáo' }) + '</select>') +
                    ui.field('Cơ sở', '<select class="ums-select" data-k="cs">' + ui.options(S.coSo, { title: 'Chọn cơ sở' }) + '</select>'),
                buttons: [
                    { text: 'Xoá', kind: 'del', onClick: function (h) { h.close(); xoaPq(d.ID); } },
                    { text: 'Lưu', kind: 'save', onClick: function (h) {
                        var cs = h.body.querySelector('[data-k="cs"]').value, bc = h.body.querySelector('[data-k="bc"]').value;
                        ums.api.call(goiLuu(cs, bc, d.ID)).then(function () {
                            ui.toast('Cập nhật thành công!', 'ok');
                            h.close();
                            napPq();
                        }).catch(function (err) { ums.api.handle(err, 'CMS_BaoCao_CoSo/CapNhat'); });
                        return false;
                    } }
                ]
            });
            datChon(dlg.body.querySelector('[data-k="bc"]'), d.THBC_HETHONGBAOCAO_ID || '');
            datChon(dlg.body.querySelector('[data-k="cs"]'), d.THBC_COSODAOTAO_ID || '');
        });
    }

    /* ô chọn đã được formTrang bọc select2 → đặt giá trị xong phải báo select2 vẽ lại */
    function datChon(el, v) { el.value = v; if (window.jQuery) jQuery(el).trigger('change.select2'); }

    function xoaPq(id) {
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá phân quyền' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: 'CMS_BaoCao_CoSo/Xoa', strIds: id, strNguoiThucHien_Id: ums.session.userId }).then(function (r) {
                if (r.message) { ui.toast(r.message, 'info'); return; }   // gốc: có Message thì chỉ hiện Message
                ui.toast('Xóa dữ liệu thành công!', 'ok');
                napPq();
            });
        }).catch(function (err) { ums.api.handle(err, 'CMS_BaoCao_CoSo/Xoa'); });
    }

    elPq.addEventListener('click', function (e) {
        var all = e.target.closest('[data-tatca]');
        if (all) {
            var tbl = all.closest('table');
            Array.prototype.forEach.call(tbl.querySelectorAll('tbody input[type="checkbox"]'), function (x) { x.checked = all.checked; });
            return;
        }
        var ed = e.target.closest('[data-act="edit"]');
        if (ed) { suaPq(ed.getAttribute('data-id')); return; }
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') { ui.swap(elPq, elCrud); crud.load(); }
        else if (a === 'them') moThem();
        else if (a === 'luuThem') luuThem();
    });
})();
