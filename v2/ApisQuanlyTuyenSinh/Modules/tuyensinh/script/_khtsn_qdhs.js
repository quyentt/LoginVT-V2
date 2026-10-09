/* =========================================================================
   ums.khtsn.moQDHS(dot, ten, vung) — lưới "Khai danh mục hồ sơ giấy tờ" theo ĐỢT tuyển sinh (mở trong trang, thay chỗ vung)
   Bản gốc: modal #khai-danh-muc-ho-so (getList_ / addRow_ / xoaDong_ / save_QuyDinhHoSo)
   ---------------------------------------------------------------------------
   Lời gọi (TS_KeHoach_MH / pkg_tuyensinh_kehoach — chép nguyên):
     LayDSTS_QuyDinhHoSo  strTuKhoa '', strTS_KeHoachTuyenSinh_Id = ID ĐỢT (tên tham số lệch — BE xác nhận),
                          strLoaiHoSo_Id '', strNguoiTao_Id '', pageIndex 1, pageSize 100000
     Them_ / Sua_TS_QuyDinhHoSo  strTS_KeHoachTuyenSinh_Id (đợt), strTinhChatHoSo_Id, strLoaiHoSo_Id,
                          dSoLuong, dThuTu (số — rỗng quy 0 như gốc), [strId khi Sửa]
     Xoa_TS_QuyDinhHoSo   strIds
     Danh mục TUYENSINH.LOAIHOSO, TUYENSINH.TINHCHATHOSO
   Lưới nhập như gốc: mỗi dòng một loại hồ sơ; Lưu = dòng mới Thêm, dòng đã có Sửa; Xoá dòng mới chỉ gỡ
   khỏi lưới, dòng đã lưu hỏi lại rồi xoá ngay. Ô chọn trong bảng là ô gốc (luật: ô chọn trong bảng ít mục).
   ========================================================================= */
(function () {
    'use strict';

    var ums = window.ums, ui = ums.ui, T = ums.khtsn;
    var A = {
        LayDS: 'TS_KeHoach_MH/DSA4BRIVEh4QNDgFKC8pCS4SLgPP',
        Them: 'TS_KeHoach_MH/FSkkLB4VEh4QNDgFKC8pCS4SLgPP',
        Sua: 'TS_KeHoach_MH/EjQgHhUSHhA0OAUoLykJLhIu',
        Xoa: 'TS_KeHoach_MH/GS4gHhUSHhA0OAUoLykJLhIu'
    };
    var P = 'pkg_tuyensinh_kehoach.';
    T.A_QDHS = A;

    T.moQDHS = function (dot, ten, vung) {
        var dotId = T.id(dot);
        var dsLoai = [], dsTC = [], dong = [];
        /* Lưới nhập NGAY TRONG TRANG (BO-CUC luật 1; trước 30/9 là hộp thoại): thay chỗ thân màn con "Các đợt tuyển sinh" (vung — tầng hai).
           Lưu xong ở lại và nạp lại lưới như cũ. */
        var dlg = T.moTrang({
            host: vung,
            title: 'Khai danh mục hồ sơ giấy tờ' + (ten ? ' — ' + ten : ''), icon: 'fa-folder-open', cols: 1,
            body: ums.pat.panel({
                title: 'Danh sách hồ sơ giấy tờ', icon: 'fa-list-check', count: 'qdn', flush: true, zone: 'qdb',
                tools: ui.btn('add', { text: 'Thêm hồ sơ', mod: 'out-success', attr: { 'data-q': 'them' } }) + ui.btn('reload', { attr: { 'data-q': 'nap' } })
            }) + '<div class="ums-u-faint ums-u-fz13 ums-u-mt-2"><i class="fa-light fa-circle-info"></i> Bấm <b>Lưu</b> để ghi tất cả các dòng ' +
                '(dòng mới sẽ Thêm, dòng đã có sẽ Sửa). Nút <b>Xóa</b> ở từng dòng xóa ngay dòng đó.</div>',
            buttons: [{ text: 'Lưu', kind: 'save', onClick: function () { luu(); return false; } }]
        });
        var B = dlg.body, bang = B.querySelector('[data-z="qdb"]'), dem = B.querySelector('[data-z="qdn"]');

        function opt(arr, sel, ph) {
            return '<option value="">' + ui.esc(ph) + '</option>' + arr.map(function (d) {
                var id = String(T.id(d)).trim();
                return id ? '<option value="' + ui.esc(id) + '"' + (id === String(sel) ? ' selected' : '') + '>' + ui.esc(d.TEN || d.Ten || d.MA || '') + '</option>' : '';
            }).join('');
        }
        function ve() {
            dem.textContent = '(' + dong.length + ')';
            ui.table({
                el: bang, rows: dong, stt: false,
                empty: 'Chưa khai danh mục hồ sơ — bấm "Thêm hồ sơ" để thêm dòng',
                columns: [
                    { title: 'STT', cls: 'is-center', width: '100px', render: function (d, i) { return '<input class="ums-input khtsn-so" type="number" min="0" data-q="thutu" data-i="' + i + '" value="' + ui.esc(d.thuTu) + '">'; } },
                    { title: 'Loại hồ sơ *', render: function (d, i) { return '<select class="ums-select" data-q="loai" data-i="' + i + '">' + opt(dsLoai, d.loai, '-- Chọn loại hồ sơ --') + '</select>'; } },
                    { title: 'Số lượng', cls: 'is-center', width: '160px', render: function (d, i) { return '<input class="ums-input khtsn-so" type="number" min="0" data-q="soluong" data-i="' + i + '" value="' + ui.esc(d.soLuong) + '">'; } },
                    { title: 'Tính chất hồ sơ', width: '240px', render: function (d, i) { return '<select class="ums-select" data-q="tinhchat" data-i="' + i + '">' + opt(dsTC, d.tinhChat, '-- Chọn tính chất --') + '</select>'; } },
                    { title: 'Xóa', cls: 'is-actions', width: '60px', render: function (d, i) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-q="xoa" data-i="' + i + '" title="Xóa dòng"><i class="fa-light fa-trash-can"></i></button>'; } }
                ]
            });
        }
        function tuDong(d) {
            var sl = T.pickLoose(d, ['SOLUONG', 'SO_LUONG']), tt = T.pickLoose(d, ['THUTU', 'THU_TU']);
            return {
                id: T.pickLoose(d, ['ID']),
                loai: T.pickLoose(d, ['LOAIHOSO_ID', 'LOAI_HOSO_ID', 'TS_LOAIHOSO_ID']),
                tinhChat: T.pickLoose(d, ['TINHCHATHOSO_ID', 'TINHCHAT_HOSO_ID', 'TS_TINHCHATHOSO_ID']),
                soLuong: sl === '' ? 1 : sl, thuTu: tt === '' ? 0 : tt
            };
        }
        function nap() {
            if (!dotId) { dong = []; ve(); return; }
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.api.call({ action: A.LayDS, func: P + 'LayDSTS_QuyDinhHoSo', strTuKhoa: '', strTS_KeHoachTuyenSinh_Id: dotId,
                strLoaiHoSo_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 100000 }).then(function (r) {
                dong = T.rows(r).map(tuDong); ve();
            }).catch(function (err) { dong = []; ve(); ums.api.handle(err, 'danh mục hồ sơ của đợt'); });
        }
        B.addEventListener('input', doi); B.addEventListener('change', doi);
        function doi(ev) {
            var t = ev.target, k = t.getAttribute && t.getAttribute('data-q'), i = Number(t.getAttribute && t.getAttribute('data-i'));
            if (!k || isNaN(i) || !dong[i]) return;
            if (k === 'thutu') dong[i].thuTu = t.value;
            else if (k === 'soluong') dong[i].soLuong = t.value;
            else if (k === 'loai') dong[i].loai = t.value;
            else if (k === 'tinhchat') dong[i].tinhChat = t.value;
        }
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('button[data-q]');
            if (!b) return;
            var k = b.getAttribute('data-q');
            if (k === 'them') { dong.push({ id: '', loai: '', tinhChat: '', soLuong: 1, thuTu: dong.length + 1 }); ve(); }
            else if (k === 'nap') nap();
            else if (k === 'xoa') {
                var i = Number(b.getAttribute('data-i')), d = dong[i];
                if (!d) return;
                if (!d.id) { dong.splice(i, 1); ve(); return; }
                ui.confirm('Bạn có chắc chắn xóa dòng hồ sơ này không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                    if (!yes) return;
                    return ums.api.call({ action: A.Xoa, func: P + 'Xoa_TS_QuyDinhHoSo', strIds: d.id, strNguoiThucHien_Id: '' }).then(function () {
                        ui.toast('Xóa thành công', 'ok'); nap();
                    });
                }).catch(function (err) { ums.api.handle(err, 'xoá dòng hồ sơ'); });
            }
        });
        function so(v) { if (v === '' || v === undefined || v === null) return 0; var n = Number(v); return isNaN(n) ? 0 : n; }
        function luu() {
            if (!dotId) { ui.toast('Chưa xác định đợt tuyển sinh (mở lại từ bảng Các đợt tuyển sinh)', 'warn'); return; }
            if (dong.some(function (d) { return !d.loai; })) { ui.toast('Có dòng chưa chọn Loại hồ sơ — vui lòng chọn hoặc xóa dòng đó', 'warn'); return; }
            if (!dong.length) { ui.toast('Chưa có dòng nào để lưu', 'warn'); return; }
            ui.batch(dong.map(function (d) {
                var o = { action: d.id ? A.Sua : A.Them, func: P + (d.id ? 'Sua_TS_QuyDinhHoSo' : 'Them_TS_QuyDinhHoSo'),
                    strChucNang_Id: '', strTS_KeHoachTuyenSinh_Id: dotId, strTinhChatHoSo_Id: d.tinhChat,
                    strLoaiHoSo_Id: d.loai, dSoLuong: so(d.soLuong), dThuTu: so(d.thuTu), strNguoiThucHien_Id: '' };
                if (d.id) o.strId = d.id;
                return o;
            }), { title: 'Đang lưu danh mục hồ sơ', okText: 'Đã lưu danh mục hồ sơ', concurrency: 5, show: true }).then(nap);
        }
        Promise.all([T.dmMot(T.DM.LOAIHOSO), T.dmMot(T.DM.TINHCHATHOSO)]).then(function (x) { dsLoai = x[0]; dsTC = x[1]; nap(); });
        return dlg;
    };
})();
