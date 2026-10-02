/* =========================================================================
   Quản lý phiếu khảo sát (phiếu mẫu → nhóm → câu hỏi → đáp án)
   Bản gốc: ApisCongCanBo/Modules/khaosat/script/phieu.js + html/phieu.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên) — controller KS_ThongTin:
       LayDSPhieu_Mau_NguoiDung          GET  strNguoiThucHien_Id (không có từ khoá)
       Them_KS_PhieuKhaoSat_Mau          POST | Sua_… khi có strId · Xoa_KS_PhieuKhaoSat_Mau
       LayDSKS_NhomKhaoSat               GET  strKS_PhieuKhaoSat_Mau_Id, pageSize 100000
       Them_KS_NhomKhaoSat | Sua_… · Xoa_KS_NhomKhaoSat
       LayDSKS_CauHoi                    GET  dTrangThai -1, dCauHoiBatBuocTraLoi -1
       Them_KS_CauHoi | Sua_… · Xoa_KS_CauHoi
       LayDSKS_CauHoi_DapAn              GET  đáp án của một câu hỏi — dùng ba chỗ:
                                              xem trước phiếu (mỗi câu một lời gọi), lưới đáp án, đáp án mẫu
       Them_KS_CauHoi_DapAn | Sua_… · Xoa_KS_CauHoi_DapAn — lưu SAU câu hỏi, bỏ dòng không có Tên
   Danh mục: QLKS.LPKS (loại phiếu). Loại câu hỏi / kiểu trả lời / kiểu hiển thị:
   liệt kê cứng trong html gốc (3/4/2 · 1/0 · 1/0).
   "Xem tổng thể phiếu" mở <strhost>/congthongtin/pages/phieukhaosat.aspx?strPhieu_Id&strNguoiThucHien_Id.

   Giữ như bản gốc:
     · Nút "Phân quyền" không có xử lý → giữ nút, đặt disabled.
     · Không ô nào bắt buộc (arrValid kiểm ô txtPhieu_So không có trên màn).
     · Số thứ tự "Câu n" đếm lại từ 1 trong từng nhóm; câu chưa thuộc nhóm nào
       hiện cuối, không có tiêu đề nhóm.
   Khác bản gốc:
     · Ô "Nhập từ khóa" bản gốc không gửi đi (procedure không nhận từ khoá) →
       lọc tại chỗ theo tên phiếu, không đổi lời gọi.
     · Phiếu mẫu (modal ở bản gốc) → biểu mẫu thay chỗ danh sách (quy ước chung).
       Nhóm câu hỏi (modal ở bản gốc) → biểu mẫu thay chỗ vùng soạn phiếu (ums.pat.formTrang, BO-CUC luật 1).
     · Nút "Xóa" trong khung câu hỏi: html gốc đặt trùng id btnDelete_Phieu nên
       không nút nào chạy (xử lý btnDelete_CauHoi không có phần tử) → nối vào
       Xoa_KS_CauHoi như ý định. Xoá nhóm có hỏi lại trước khi xoá.
     · Xem trước phiếu: bản gốc đẩy thêm một nhóm rỗng vào dtNhom MỖI lần vẽ →
       câu chưa thuộc nhóm hiện lặp lại sau mỗi lần sửa. Không chép.
     · Lưu câu hỏi xong quay về trang xem phiếu (bản gốc ở lại, strCauHoi_Id vẫn
       rỗng → bấm Lưu lần nữa là thêm câu thứ hai).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var C = 'KS_ThongTin/';
    var root = document.getElementById('ks-phieu');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function sel(key, items) {
        return '<select class="ums-select" data-q="' + key + '">' + items.map(function (x) {
            return '<option value="' + x[0] + '">' + esc(x[1]) + '</option>';
        }).join('') + '</select>';
    }
    var LOAI = [['3', 'Chọn 1 đáp án'], ['4', 'Chọn nhiều đáp án'], ['2', 'Câu hỏi mở gõ trực tiếp']];

    root.innerHTML =
        '<div data-z="ds"></div>' +
        /* Trang xem & sửa phiếu (zonePhieu) */
        '<div data-z="bd" hidden>' +
            pat.page('Quản lý phiếu', '') +
            pat.panel({
                title: 'Chỉnh sửa - Phiếu', icon: 'fa-pen',
                tools: ui.btn('close', { attr: { 'data-a': 'dongBd' } }) +
                ui.btn('add', { text: 'Thêm nhóm', mod: 'out-success', attr: { 'data-a': 'themNhom' } }) +
                    ui.btn('add', { text: 'Thêm câu hỏi', mod: 'out-primary', attr: { 'data-a': 'themCau', 'data-nhom': '' } }),
                                    body: '<h2 class="ks-td" data-z="td"></h2><div class="ks-mota" data-z="mota"></div><div class="ks-nd" data-z="nd"></div>'
            }) +
        '</div>' +
        /* Khung câu hỏi (zoneEdit) */
        '<div data-z="ch" hidden>' +
            pat.page('Quản lý phiếu', '') +
            pat.panel({
                title: 'Câu hỏi', icon: 'fa-file-circle-question', count: 'chTen',
                tools: ui.btn('close', { attr: { 'data-a': 'dongCh' } }) +
                    ui.btn('del', { text: 'Xóa', attr: { 'data-a': 'xoaCau' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luuCau' } }),
                body:
                    '<div class="ums-grid ums-grid--3">' +
                        ui.field('Tên câu hỏi', '<input class="ums-input" data-q="ten" autocomplete="off">') +
                        ui.field('Thuộc nhóm', '<select class="ums-select" data-q="nhom" data-ph="Chọn nhóm"><option value=""></option></select>') +
                        ui.field('Thứ tự', '<input class="ums-input" data-q="tt" autocomplete="off">') +
                        ui.field('Loại câu hỏi', sel('loai', LOAI)) +
                        ui.field('Kiểu trả lời', sel('bb', [['1', 'Bắt buộc'], ['0', 'Không bắt buộc']])) +
                        ui.field('Kiểu hiển thị', sel('ht', [['1', 'Mặc định'], ['0', 'Hàng ngang']])) +
                    '</div>' +
                    '<div class="ums-grid ums-grid--2 ums-u-mt-4">' +
                        pat.panel({
                            title: 'Danh sách đáp án mẫu', icon: 'fa-list-check', flush: true,
                            body: '<div class="ums-filter ks-mauloc"><div class="ums-field"><select class="ums-select" data-q="mauCau" data-ph="Chọn câu hỏi">' +
                                '<option value=""></option></select></div><div class="ums-field ums-field--fit">' +
                                ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-a': 'chepMau' } }) + '</div></div><div data-z="mau"></div>'
                        }) +
                        '<div data-z="da"></div>' +
                    '</div>'
            }) +
        '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function q(k) { return root.querySelector('[data-q="' + k + '"]'); }
    function setSel(el, v) { el.value = v === null || v === undefined ? '' : String(v); if (window.jQuery) jQuery(el).trigger('change.select2'); }

    var phieu = null, dsNhom = [], dsCau = [], dangCau = null, dsMau = [];

    /* ---------- 1. Danh sách phiếu mẫu (crud) ---------------------------- */
    function nut(kind, r, text, off) {
        return '<button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-ks="' + kind + '" data-id="' + esc(r.ID) + '"' +
            (off ? ' disabled title="Bản gốc chưa có xử lý"' : '') + '>' + esc(text) + '</button>';
    }
    var crud = ums.crud({
        root: z('ds'),
        title: 'Quản lý phiếu',
        listTitle: 'Danh sách phiếu',
        formTitle: 'phiếu mẫu',
        icon: 'fa-list-timeline',
        rowDelete: false, formDelete: false,
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        list: {
            call: function () { return { action: C + 'LayDSPhieu_Mau_NguoiDung', method: 'GET', strNguoiThucHien_Id: uid() }; },
            rows: function (d) {
                var k = ((crud && crud.filterValues().q) || '').toLowerCase();
                return arr(d).filter(function (r) { return !k || e(r.TENPHIEU).toLowerCase().indexOf(k) >= 0; });
            }
        },
        columns: [
            { title: 'Tên phiếu', prop: 'TENPHIEU' },
            { title: 'Loại phiếu', prop: 'LOAIPHIEU_TEN', cls: 'is-center' },
            { title: 'Phân quyền', cls: 'is-center', render: function (r) { return nut('pq', r, 'Phân quyền', true); } },
            { title: 'Xem tổng thế phiếu', cls: 'is-center', render: function (r) { return nut('tong', r, 'Xem'); } },
            { title: 'Xem phiếu', cls: 'is-center', render: function (r) { return nut('xem', r, 'Xem'); } }
        ],
        fields: [
            { key: 'strTenPhieu', col: 'TENPHIEU', label: 'Tên phiếu', span: true },
            { key: 'strMaPhieu', col: 'MAPHIEU', label: 'Mã', span: true },
            { key: 'strLoaiPhieu_Id', col: 'LOAIPHIEU_ID', label: 'Phân loại', type: 'select', span: true, source: { dm: 'QLKS.LPKS' } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea', span: true }
        ],
        save: function (v, row) {
            return {
                action: C + (row ? 'Sua_KS_PhieuKhaoSat_Mau' : 'Them_KS_PhieuKhaoSat_Mau'), method: 'POST',
                strId: row ? row.ID : '', strMaPhieu: v.strMaPhieu, strTenPhieu: v.strTenPhieu, strMoTa: v.strMoTa,
                strLoaiPhieu_Id: v.strLoaiPhieu_Id, strNguoiThucHien_Id: uid()
            };
        },
        remove: function (ids) {
            return ids.map(function (id) { return { action: C + 'Xoa_KS_PhieuKhaoSat_Mau', method: 'POST', strId: id, strNguoiThucHien_Id: uid() }; });
        }
    });

    /* ---------- 2. Trang xem & sửa phiếu --------------------------------- */
    function moPhieu(p) {
        phieu = p;
        z('td').textContent = e(p.TENPHIEU);
        z('mota').innerHTML = '<strong>' + esc(e(p.LOAIPHIEU_TEN)) + ':</strong> <span>' + esc(e(p.MOTA)) + '</span>';
        ui.swap(z('ds'), z('bd'), { top: true });
        taiNhom();
    }
    function taiNhom() {
        z('nd').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call({ action: C + 'LayDSKS_NhomKhaoSat', method: 'GET', strTuKhoa: '', strKS_PhieuKhaoSat_Mau_Id: phieu.ID,
            strNhomKhaoSat_Cha_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 }).then(function (r) {
            dsNhom = arr(r.data);
            pat.fill(q('nhom'), dsNhom, { name: 'TEN' });
            return taiCau();
        }).catch(function (err) { z('nd').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải nhóm câu hỏi'); });
    }
    function taiCau() {
        return ums.api.call({ action: C + 'LayDSKS_CauHoi', method: 'GET', strTuKhoa: '', strNguoiThucHien_Id: uid(), strKS_LoaiCauHoi_Id: '',
            dTrangThai: -1, dCauHoiBatBuocTraLoi: -1, strKS_NhomCauHoi_Id: '', strKS_PhieuKhaoSat_Mau_Id: phieu.ID, pageIndex: 1, pageSize: 100000 }).then(function (r) {
            dsCau = arr(r.data);
            pat.fill(q('mauCau'), dsCau, { name: 'TENCAUHOI' });
            veNoiDung();
        }).catch(function (err) { z('nd').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tải câu hỏi'); });
    }
    function veNoiDung() {
        var nhom = dsNhom.concat([{ ID: null }]);      // câu chưa thuộc nhóm — MỘT lần, cuối trang
        var h = nhom.map(function (n) {
            var cau = dsCau.filter(function (c) { return n.ID ? c.KS_NHOMCAUHOI_ID === n.ID : !c.KS_NHOMCAUHOI_ID; });
            if (!n.ID && !cau.length) return '';
            return '<div class="ks-nhom">' +
                (n.ID ? '<button type="button" class="ks-nhom__td" data-a="suaNhom" data-id="' + esc(n.ID) + '">' + esc(e(n.TEN)) +
                    ' <span class="ks-bb">*</span><i class="fa-light fa-pen-to-square"></i></button>' : '') +
                cau.map(function (c, i) {
                    return '<div class="ks-cau">' +
                        '<button type="button" class="ks-cau__hoi" data-a="suaCau" data-id="' + esc(c.ID) + '"><b>Câu ' + (i + 1) + ':</b>' +
                        (Number(c.CAUHOIBATBUOCTRALOI) ? '<span class="ks-bb">*</span>' : '') + ' <span>' + esc(e(c.TENCAUHOI)) + '</span></button>' +
                        '<div class="ks-cau__dap' + (Number(c.CACHHIENTHICAUHOI) ? '' : ' ks-cau__dap--ngang') + '" data-dap="' + esc(c.ID) + '"></div></div>';
                }).join('') +
                (n.ID ? ui.btn('add', { text: 'Thêm câu hỏi', mod: 'out-warn', cls: 'ums-btn--sm', attr: { 'data-a': 'themCau', 'data-nhom': n.ID } }) : '') +
                '</div>';
        }).join('');
        z('nd').innerHTML = h || ui.empty('Phiếu chưa có nhóm / câu hỏi nào', 'fa-file-circle-question');
        // Bản gốc: mỗi câu một lời gọi lấy đáp án để vẽ xem trước
        dsCau.forEach(function (c) {
            var host = root.querySelector('[data-dap="' + c.ID + '"]');
            if (!host) return;
            if (String(c.KS_LOAICAUHOI_ID) === '2') { host.innerHTML = '<input class="ums-input" disabled placeholder="Câu trả lời">'; return; }
            dapAn(c.ID).then(function (ds) {
                var kieu = String(c.KS_LOAICAUHOI_ID) === '3' ? 'radio' : 'checkbox';
                host.innerHTML = ds.map(function (d) {
                    return '<label class="ums-check"><input type="' + kieu + '" name="ks' + esc(c.ID) + '"><span>' + esc(e(d.TENDAPAN)) + '</span></label>';
                }).join('');
            }).catch(function () {});
        });
    }
    function dapAn(idCau) {
        return ums.api.call({ action: C + 'LayDSKS_CauHoi_DapAn', method: 'GET', strKS_CauHoi_Id: idCau, strKS_PhieuKhaoSat_Mau_Id: phieu.ID,
            strNguoiThucHien_Id: uid(), silent: true }).then(function (r) { return arr(r.data); });
    }

    /* Nhóm câu hỏi (myModal_NhomCauHoi) — biểu mẫu TRONG TRANG, thay chỗ vùng soạn phiếu */
    function moNhom(n) {
        var dlg = pat.formTrang({
            host: z('bd'), title: 'Nhóm câu hỏi', icon: 'fa-circle-question',
            body: ui.field('Tên nhóm', '<input class="ums-input" data-n="ten" autocomplete="off">') +
                ui.field('Thứ tự trên phiếu', '<input class="ums-input" data-n="tt" autocomplete="off">') +
                '<div style="grid-column:1 / -1">' + ui.field('Mô tả', '<textarea class="ums-input" rows="6" data-n="mota"></textarea>') + '</div>',
            buttons: (n ? [{ kind: 'del', text: 'Xóa', onClick: function () { xoaNhom(n, dlg); return false; } }] : [])
                .concat([{ kind: 'save', text: 'Lưu', onClick: function () { luuNhom(n, dlg); return false; } }])
        });
        function f(k) { return dlg.body.querySelector('[data-n="' + k + '"]'); }
        if (n) { f('ten').value = e(n.TEN); f('tt').value = e(n.THUTU); f('mota').value = e(n.MOTA); }
        f('ten').focus();
        dlg._f = f;
    }
    function luuNhom(n, dlg) {
        var f = dlg._f;
        ums.api.call({ action: C + (n ? 'Sua_KS_NhomKhaoSat' : 'Them_KS_NhomKhaoSat'), method: 'POST', strId: n ? n.ID : '',
            strTen: f('ten').value.trim(), strMoTa: f('mota').value.trim(), strNhomKhaoSat_Cha_Id: '', strKS_PhieuKhaoSat_Mau_Id: phieu.ID,
            strNguoiThucHien_Id: uid(), dThuTu: f('tt').value.trim() }).then(function () {
            ui.toast(n ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
            dlg.close(); taiNhom();
        }).catch(function (err) { ums.api.handle(err, 'lưu nhóm'); });
    }
    function xoaNhom(n, dlg) {
        ui.confirm('Xoá nhóm "' + e(n.TEN) + '"?', { tone: 'bad', ok: 'Xoá', title: 'Xoá nhóm câu hỏi' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: C + 'Xoa_KS_NhomKhaoSat', method: 'POST', strId: n.ID, strNguoiThucHien_Id: uid() }).then(function () {
                ui.toast('Xóa thành công!', 'ok'); dlg.close(); taiNhom();
            });
        }).catch(function (err) { ums.api.handle(err, 'xoá nhóm'); });
    }

    /* ---------- 3. Khung câu hỏi + đáp án -------------------------------- */
    var luoiDA = pat.rows(z('da'), {
        title: 'Danh sách đáp án dụng cho câu hỏi', icon: 'fa-list-ol', addText: 'Thêm dòng',
        columns: [
            { key: 'strTenDapAn', col: 'TENDAPAN', title: 'Tên' },
            { key: 'strMaDapAn', col: 'MADAPAN', title: 'Mã', width: '110px' },
            { key: 'dThuTu', col: 'THUTU', title: 'Thứ tự', width: '80px' },
            { key: 'dTrongSo', col: 'TRONGSODIEM', title: 'Trọng số', width: '90px' }
        ],
        list: function (id) { return { action: C + 'LayDSKS_CauHoi_DapAn', method: 'GET', strKS_CauHoi_Id: id, strKS_PhieuKhaoSat_Mau_Id: phieu.ID, strNguoiThucHien_Id: uid() }; },
        filled: function (v) { return !!v.strTenDapAn; },
        save: function (v, rec, id) {
            return { action: C + (rec ? 'Sua_KS_CauHoi_DapAn' : 'Them_KS_CauHoi_DapAn'), method: 'POST', strId: rec ? rec.ID : '',
                strFileDapAn: '', strTenDapAn: v.strTenDapAn, dThuTu: v.dThuTu, strKS_CauHoi_Id: id, strMaDapAn: v.strMaDapAn,
                dTrongSo: v.dTrongSo, strNguoiThucHien_Id: uid() };
        },
        remove: function (rec) { return { action: C + 'Xoa_KS_CauHoi_DapAn', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; }
    });

    function veMau() {
        ui.table({
            el: z('mau'), rows: dsMau, empty: 'Chọn một câu hỏi để lấy đáp án mẫu',
            columns: [
                { title: 'Tên', prop: 'TENDAPAN' },
                { title: 'Mã', prop: 'MADAPAN', cls: 'is-center' },
                { title: 'Thứ tự', prop: 'THUTU', cls: 'is-center' },
                { title: 'Trọng số', prop: 'TRONGSODIEM', cls: 'is-center' },
                { head: '<input type="checkbox" data-mau="all" title="Chọn tất cả">', cls: 'is-center', width: '44px',
                  render: function (r, i) { return '<input type="checkbox" data-mau="' + i + '">'; } }
            ]
        });
    }
    function moCau(c, nhomId) {
        dangCau = c || null;
        z('chTen').textContent = c ? '— ' + e(c.TENCAUHOI) : '— thêm mới';
        q('ten').value = c ? e(c.TENCAUHOI) : '';
        q('tt').value = c ? e(c.THUTU) : '';
        setSel(q('nhom'), c ? c.KS_NHOMCAUHOI_ID : (nhomId || ''));
        setSel(q('loai'), c ? c.KS_LOAICAUHOI_ID : '3');
        setSel(q('bb'), c ? c.CAUHOIBATBUOCTRALOI : '1');
        setSel(q('ht'), c ? c.CACHHIENTHICAUHOI : '1');
        root.querySelector('[data-a="xoaCau"]').hidden = !c;
        setSel(q('mauCau'), ''); dsMau = []; veMau();
        luoiDA.load(c ? c.ID : '');
        ui.swap(z('bd'), z('ch'), { top: true });
        q('ten').focus();
    }
    function veBd() { ui.swap(z('ch'), z('bd'), { top: true }); taiCau(); }
    function luuCau() {
        var c = dangCau;
        ums.api.call({ action: C + (c ? 'Sua_KS_CauHoi' : 'Them_KS_CauHoi'), method: 'POST', strId: c ? c.ID : '',
            strTenCauHoi: q('ten').value.trim(), strFileCauHoi: '', strMoTa: '', dSoDapAn: -1,
            strKS_LoaiCauHoi_Id: q('loai').value, dCachHienThiCauHoi: q('ht').value, strKS_PhieuKhaoSat_Mau_Id: phieu.ID,
            dCauHoiBatBuocTraLoi: q('bb').value, strKS_NhomCauHoi_Id: q('nhom').value, strKS_NhomKhaoSat_Id: '',
            dThuTu: q('tt').value.trim(), strNguoiThucHien_Id: uid() }).then(function (r) {
            var id = c ? c.ID : ((r.raw && r.raw.Id) || '');
            ui.toast(c ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok');
            return luoiDA.save(id).then(veBd);
        }).catch(function (err) { ums.api.handle(err, 'lưu câu hỏi'); });
    }
    function xoaCau() {
        if (!dangCau) return;
        ui.confirm('Xoá câu hỏi này?', { tone: 'bad', ok: 'Xoá', title: 'Xoá câu hỏi' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: C + 'Xoa_KS_CauHoi', method: 'POST', strId: dangCau.ID, strNguoiThucHien_Id: uid() }).then(function () {
                ui.toast('Xóa thành công!', 'ok'); veBd();
            });
        }).catch(function (err) { ums.api.handle(err, 'xoá câu hỏi'); });
    }

    /* ---------- Sự kiện -------------------------------------------------- */
    root.addEventListener('click', function (ev) {
        var k = ev.target.closest('[data-ks]');
        if (k) {
            var p = crud.rows.filter(function (r) { return r.ID === k.getAttribute('data-id'); })[0];
            if (!p) return;
            if (k.getAttribute('data-ks') === 'xem') return moPhieu(p);
            if (k.getAttribute('data-ks') === 'tong') {
                var url = ((ums.session && ums.session.host) || location.origin) + '/congthongtin/pages/phieukhaosat.aspx' +
                    '?strPhieu_Id=' + encodeURIComponent(p.ID) + '&strNguoiThucHien_Id=' + encodeURIComponent(uid());
                window.open(url, '_blank', 'location=yes,height=' + screen.height + ',width=' + screen.width + ',scrollbars=yes,status=yes');
            }
            return;
        }
        var b = ev.target.closest('[data-a]');
        if (!b || b.disabled) return;
        var a = b.getAttribute('data-a'), id = b.getAttribute('data-id');
        if (a === 'dongBd') { ui.swap(z('bd'), z('ds'), { top: true }); crud.load(); }
        else if (a === 'themNhom') moNhom(null);
        else if (a === 'suaNhom') moNhom(dsNhom.filter(function (n) { return n.ID === id; })[0]);
        else if (a === 'themCau') moCau(null, b.getAttribute('data-nhom'));
        else if (a === 'suaCau') moCau(dsCau.filter(function (c) { return c.ID === id; })[0]);
        else if (a === 'dongCh') veBd();
        else if (a === 'luuCau') luuCau();
        else if (a === 'xoaCau') xoaCau();
        else if (a === 'chepMau') {
            var chon = Array.prototype.filter.call(z('mau').querySelectorAll('input[data-mau]:checked'), function (x) { return x.getAttribute('data-mau') !== 'all'; });
            if (!chon.length) { ui.toast('Vui lòng chọn đáp án mẫu', 'warn'); return; }
            chon.forEach(function (x) { luoiDA.addNew(dsMau[Number(x.getAttribute('data-mau'))]); });
        }
    });
    z('mau').addEventListener('change', function (ev) {
        if (ev.target.getAttribute('data-mau') !== 'all') return;
        Array.prototype.forEach.call(z('mau').querySelectorAll('input[data-mau]'), function (x) { x.checked = ev.target.checked; });
    });
    if (window.jQuery) jQuery(q('mauCau')).on('select2:select', function () {
        dapAn(q('mauCau').value).then(function (ds) { dsMau = ds; veMau(); }).catch(function (err) { ums.api.handle(err, 'tải đáp án mẫu'); });
    });
})();
