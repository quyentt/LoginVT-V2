/* =========================================================================
   Khai báo hệ thống báo cáo (mẫu báo cáo + cấu trúc cột / dòng)
   Bản gốc: ApisCMS/Modules/baocao/html/khaibao.html + script/khaibao.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc. Danh sách mẫu báo cáo → ums.crud (gốc: hộp #myModal,
   nay biểu mẫu thay chỗ danh sách). Nút "Cấu hình" (con mắt) → khung "Cấu trúc
   báo cáo" thay chỗ danh sách (gốc zoneEdit): bảng tiêu đề cây (cột chính +
   cột phụ) + thân cây dòng dữ liệu — ums.cmsBaoCao.bangCay (script/_chung.js).
   Bấm ô tiêu đề → biểu mẫu sửa Cấu trúc chính / phụ TRONG TRANG (có Xoá; ums.pat.formTrang);
   ô cột chính LÁ có "Thêm dữ liệu" → hộp Thành phần (hộp CHỌN, giữ hộp thoại); dòng dữ liệu lá có nút xoá.

   Lời gọi — chép nguyên văn:
     Mẫu báo cáo
       CMS_HeThongBaoCao/LayDanhSach  GET  type 'GET', strTuKhoa "" (ô txtAAAA không tồn tại),
                                           strPhanLoai_Id, strNguoiThucHien_Id, pageIndex, pageSize
       CMS_HeThongBaoCao/ThemMoi | CapNhat  POST  type 'POST', strId, strChucNang_Id, strMa, strTen,
                                                  dHieuLuc, strPhanLoai_Id, strNguoiThucHien_Id
       CMS_HeThongBaoCao/Xoa          POST  strIds, strChucNang_Id, strNguoiThucHien_Id
     Cấu trúc (mọi lời gọi danh sách: type 'GET', strTuKhoa "", strTHBC_HeThongBaoCao_Id,
       strThanhPhan_Id "", strThanhPhan_Cha_Id "", strNguoiThucHien_Id, pageIndex 1, pageSize 100000)
       CMS_BaoCao_CauTruc_Phu_G/LayDanhSach · ThemMoi | CapNhat · Xoa
           lưu: type 'POST', strId, strChucNang_Id, strThanhPhan_Id, strThanhPhan_Cha_Id "",
                strTHBC_BC_CT_Phu_G_Cha_Id, strTHBC_HeThongBaoCao_Id, iThuTu, strNguoiThucHien_Id
       CMS_BaoCao_CauTruc_C_G/LayDanhSach · ThemMoi | CapNhat · Xoa
           lưu: … strTHBC_BC_CT_C_G_Cha_Id … (như trên)
       CMS_CauTruc_DuLieu_G/LayDanhSach · ThemMoi · Xoa
           lưu: type 'POST', strId "", strChucNang_Id, strThanhPhan_Id, strThanhPhan_Cha_Id "",
                strTHBC_CT_DuLieu_G_Cha_Id, strTHBC_HeThongBaoCao_Id, strTHBC_BC_CauTruc_C_G_Id,
                iThuTu, strThanhPhan_Ten "", strThanhPhan_Ma "", strThanhPhan_Cha_Ten "",
                strThanhPhan_Cha_Ma "", dChieuDinhHuongHienThi "", strNguoiThucHien_Id
       CMS_CauTruc_DuLieu_G/LayTHBC_CauTruc_DuLieu_G_Cha  GET  type 'GET', strTHBC_BC_CT_Chinh_G_Id
     Danh mục: THBC.HETHONGBAOCAO.PHANLOAI, THBC.THANHPHAN.CHINH, THBC.THANHPHAN.PHU,
       THBC.DANHMUC.TENBANG (MA của mục chọn = mã bảng danh mục chứa các thành phần).
     Cây tiêu đề: khoá cha THBC_BC_CAUTRUC_PHU_G_CHA_ID (cột chính chép từ
       THBC_BAOCAO_CAUTRUC_C_G_CHA_ID như gốc); cột chính = dòng CÓ cột
       MABANGDM_THANHPHAN_DULIEU_G. Cây dòng: khoá cha THBC_CAUTRUC_DULIEU_G_CHA_ID.

   Giữ như gốc (ghi can-quyet):
     · Ô từ khoá: gốc gửi strTuKhoa từ ô txtAAAA không tồn tại → luôn rỗng. Giữ;
       ô từ khoá lọc trên trang đang hiện (ums.pat.loc).
   Lỗi gốc đã sửa:
     · Mở sửa Cấu trúc chính/phụ: ô "Trực thuộc" gốc đổ THANHPHAN_CHA_ID (id
       THÀNH PHẦN) trong khi danh sách chọn là id DÒNG cấu trúc → ô luôn trống,
       bấm Lưu là XOÁ quan hệ cha. Nay đổ đúng khoá cha của cây
       (THBC_BAOCAO_CAUTRUC_C_G_CHA_ID / THBC_BC_CAUTRUC_PHU_G_CHA_ID).
     · Hộp Thành phần: bảng gốc đổ MA dưới tiêu đề "Tên" và TEN dưới "Mã" —
       nay đúng cột.
     · Lưu thành phần gốc gửi strId = me.strThanhPhanChinh_Id (không bao giờ
       gán) → thực tế luôn rỗng / ThemMoi; giữ ThemMoi.
   Khác gốc: biểu mẫu Cấu trúc / hộp Thành phần đóng sau khi lưu (gốc để mở kèm thông
     báo); xoá mẫu báo cáo qua ums.crud không hiện Message máy chủ trả kèm.
   Cặp cha → con: không có (ô "Danh mục thành phần" nạp BẢNG, không phải ô chọn).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, BC = ums.cmsBaoCao;
    var root = document.getElementById('cms-khaibao');
    if (!root) return;

    root.innerHTML = '<div data-z="crud"></div><div data-z="ct" hidden></div>';
    var elCrud = root.querySelector('[data-z="crud"]');
    var elCt = root.querySelector('[data-z="ct"]');

    var PHANLOAI = { dm: 'THBC.HETHONGBAOCAO.PHANLOAI' };
    var HIEULUC = { items: [{ ID: '1', TEN: 'Có hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] };
    var S = { htbc: null, chinh: [], phu: [], duLieu: [], q: '' };
    function uid() { return ums.session.userId; }

    var crud = ums.crud({
        root: elCrud,
        title: 'Khai báo hệ thống báo cáo',
        formTitle: 'mẫu báo cáo',
        icon: 'fa-list-ul',
        filters: [
            { key: 'pl', type: 'select', label: 'Chọn phân loại', source: PHANLOAI },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                S.q = f.q || '';
                return {
                    action: 'CMS_HeThongBaoCao/LayDanhSach', method: 'GET', type: 'GET',
                    strTuKhoa: '', strPhanLoai_Id: f.pl, strNguoiThucHien_Id: uid()
                };
            },
            rows: function (d) { return pat.loc(Array.isArray(d) ? d : [], S.q, ['MA', 'TEN', 'PHANLOAI_TEN']); }
        },
        columns: [
            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
            { title: 'Tên', prop: 'TEN' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.HIEULUC ? ui.badge('Hiệu lực', 'ok') : ''; } },
            { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' }
        ],
        rowActions: [
            { icon: 'fa-eye', title: 'Cấu hình', onClick: function (row) { moCauTruc(row); } }
        ],
        fields: [
            { key: 'strMa', col: 'MA', label: 'Mã' },
            { key: 'strTen', col: 'TEN', label: 'Tên' },
            { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', label: 'Phân loại', type: 'select', source: PHANLOAI },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: HIEULUC, value: '1', required: true }
        ],
        save: function (v, row) {
            v.action = row ? 'CMS_HeThongBaoCao/CapNhat' : 'CMS_HeThongBaoCao/ThemMoi';
            v.type = 'POST';
            v.strId = row ? row.ID : '';
            return v;
        },
        remove: function (ids) { return { action: 'CMS_HeThongBaoCao/Xoa', strIds: ids[0] }; },
        rowDelete: false,
        multi: false
    });

    var dmChinh = ums.api.dm('THBC.THANHPHAN.CHINH'), dmPhu = ums.api.dm('THBC.THANHPHAN.PHU'), dmBang = ums.api.dm('THBC.DANHMUC.TENBANG');
    [dmChinh, dmPhu, dmBang].forEach(function (p) { p.catch(function (err) { ums.api.handle(err, 'danh mục thành phần'); }); });

    /* ---------- khung Cấu trúc báo cáo ---------- */
    function moCauTruc(row) {
        S.htbc = row;
        elCt.innerHTML = pat.panel({
            title: 'Cấu trúc báo cáo — ' + (row.TEN || ''), icon: 'fa-table-tree', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('add', { text: 'Thêm mới cột chính', mod: 'primary', attr: { 'data-a': 'themChinh' } }) +
                ui.btn('add', { text: 'Thêm mới cột phụ', mod: 'primary', attr: { 'data-a': 'themPhu' } })                
        });
        ui.swap(elCrud, elCt);
        napCauTruc();
    }
    function bang() { return elCt.querySelector('[data-z="bang"]'); }

    function dsCall(action) {
        return { action: action, method: 'GET', type: 'GET', strTuKhoa: '', strTHBC_HeThongBaoCao_Id: S.htbc.ID,
            strThanhPhan_Id: '', strThanhPhan_Cha_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 };
    }

    /* getList_CauTrucPhu → getList_CauTrucChinh → getList_ThanhPhanChinh (tuần tự như gốc) */
    function napCauTruc() {
        bang().innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(dsCall('CMS_BaoCao_CauTruc_Phu_G/LayDanhSach')).then(function (r) {
            S.phu = r.data || [];
            return ums.api.call(dsCall('CMS_BaoCao_CauTruc_C_G/LayDanhSach'));
        }).then(function (r) {
            S.chinh = (r.data || []).map(function (x) { x.THBC_BC_CAUTRUC_PHU_G_CHA_ID = x.THBC_BAOCAO_CAUTRUC_C_G_CHA_ID; return x; });
            return ums.api.call(dsCall('CMS_CauTruc_DuLieu_G/LayDanhSach'));
        }).then(function (r) {
            S.duLieu = r.data || [];
            ve();
        }).catch(function (err) { bang().innerHTML = ui.fail(err.message); ums.api.handle(err, 'Cấu trúc báo cáo'); });
    }

    function laChinh(x) { return x.MABANGDM_THANHPHAN_DULIEU_G !== undefined; }

    function ve() {
        BC.bangCay(bang(), {
            dau: S.chinh.concat(S.phu), dauId: 'ID', dauCha: 'THBC_BC_CAUTRUC_PHU_G_CHA_ID',
            oDau: function (x, laLa) {
                var h = '<button type="button" class="ums-link" data-dau="' + esc(x.ID) + '" data-loai="' + (laChinh(x) ? 'chinh' : 'phu') +
                    '" title="Sửa ' + (laChinh(x) ? 'cấu trúc chính' : 'cấu trúc phụ') + '">' + esc(x.THANHPHAN_TEN || '') + '</button>';
                if (laChinh(x) && laLa) {
                    h += '<br><button type="button" class="ums-link" data-tp="' + esc(x.ID) + '"><i class="fa-light fa-plus"></i> Thêm dữ liệu</button>';
                }
                return h;
            },
            than: S.duLieu, thanId: 'ID', thanCha: 'THBC_CAUTRUC_DULIEU_G_CHA_ID',
            oThan: function (x, laLa) {
                return esc(x.THANHPHAN_TEN || '') + (laLa ? ' ' + '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-xoatp="' + esc(x.ID) + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>' : '');
            },
            empty: 'Chưa khai báo cấu trúc — bấm "Thêm mới cột chính" / "Thêm mới cột phụ".'
        });
    }

    /* ---------- Cấu trúc chính / phụ — biểu mẫu TRONG TRANG (BO-CUC luật 1): thay chỗ khung "Cấu trúc báo cáo"
       (elCt đã là khung thay chỗ danh sách → tầng hai, nút Đóng của khung ngoài ẩn theo) ---------- */
    var LOAI = {
        chinh: { ten: 'Cấu trúc chính', ctl: 'CMS_BaoCao_CauTruc_C_G', dm: function () { return dmChinh; }, ds: function () { return S.chinh; },
            chaKhoa: 'strTHBC_BC_CT_C_G_Cha_Id', chaCot: 'THBC_BAOCAO_CAUTRUC_C_G_CHA_ID' },
        phu: { ten: 'Cấu trúc phụ', ctl: 'CMS_BaoCao_CauTruc_Phu_G', dm: function () { return dmPhu; }, ds: function () { return S.phu; },
            chaKhoa: 'strTHBC_BC_CT_Phu_G_Cha_Id', chaCot: 'THBC_BC_CAUTRUC_PHU_G_CHA_ID' }
    };

    /* ô chọn đã được formTrang bọc select2 → đặt giá trị xong phải báo select2 vẽ lại */
    function datChon(el, v) { el.value = v; if (window.jQuery) jQuery(el).trigger('change.select2'); }

    function hopCauTruc(loai, dong) {
        var L = LOAI[loai];
        L.dm().then(function (dm) {
            var cha = L.ds().filter(function (x) { return !dong || x.ID !== dong.ID; });
            var btns = [];
            if (dong) btns.push({ text: 'Xoá', kind: 'del', onClick: function (h) { h.close(); xoa(L.ctl + '/Xoa', dong.ID); } });
            btns.push({ text: 'Lưu', kind: 'save', onClick: function (h) {
                var v = function (k) { return h.body.querySelector('[data-k="' + k + '"]').value; };
                var p = {
                    action: L.ctl + (dong ? '/CapNhat' : '/ThemMoi'), type: 'POST',
                    strId: dong ? dong.ID : '',
                    strThanhPhan_Id: v('tp'),
                    strThanhPhan_Cha_Id: '',
                    strTHBC_HeThongBaoCao_Id: S.htbc.ID,
                    iThuTu: v('tt'),
                    strNguoiThucHien_Id: uid()
                };
                p[L.chaKhoa] = v('cha');
                ums.api.call(p).then(function () {
                    ui.toast(dong ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
                    h.close();
                    napCauTruc();
                }).catch(function (err) { ums.api.handle(err, p.action); });
                return false;
            } });
            var dlg = pat.formTrang({
                host: elCt, title: (dong ? 'Chỉnh sửa - ' : 'Thêm mới - ') + L.ten, icon: dong ? 'fa-pen-to-square' : 'fa-plus',
                body:
                    ui.field('Thứ tự', '<input class="ums-input" data-k="tt" type="number">') +
                    ui.field('Thành phần', '<select class="ums-select" data-k="tp">' + ui.options(dm, { title: pat.dmTitle(dm) || 'Chọn thành phần' }) + '</select>') +
                    ui.field('Trực thuộc', '<select class="ums-select" data-k="cha">' + ui.options(cha, { title: 'Chọn thành phần cha', name: 'THANHPHAN_TEN' }) + '</select>'),
                buttons: btns
            });
            if (dong) {
                dlg.body.querySelector('[data-k="tt"]').value = dong.THUTU == null ? '' : dong.THUTU;
                datChon(dlg.body.querySelector('[data-k="tp"]'), dong.THANHPHAN_ID || '');
                datChon(dlg.body.querySelector('[data-k="cha"]'), dong[L.chaCot] || '');
            }
        });
    }

    /* ---------- hộp Thành phần (Thêm dữ liệu cho một cột chính lá) ---------- */
    function hopThanhPhan(cotId) {
        Promise.all([dmBang, ums.api.call({ action: 'CMS_CauTruc_DuLieu_G/LayTHBC_CauTruc_DuLieu_G_Cha', method: 'GET', type: 'GET',
            strTHBC_BC_CT_Chinh_G_Id: cotId, silent: true })]).then(function (r) {
            var bangDm = r[0] || [], cha = r[1].data || [], tp = [];
            var dlg = ui.dialog({
                title: 'Thành phần', icon: 'fa-list-tree', size: 'lg',
                body: '<div class="ums-stack">' +
                    ui.field('Danh mục thành phần', '<select class="ums-select" data-k="bang">' + ui.options(bangDm, { title: pat.dmTitle(bangDm) || 'Chọn danh mục' }) + '</select>') +
                    '<div data-k="tp">' + ui.empty('Chọn danh mục thành phần để hiện các thành phần', 'fa-hand-pointer') + '</div>' +
                    ui.field('Thành phần cha', '<select class="ums-select" data-k="cha">' + ui.options(cha, { title: 'Chọn thành phần cha' }) + '</select>') +
                    '</div>',
                buttons: [{ text: 'Lưu', kind: 'save', onClick: function (h) {
                    var chon = Array.prototype.filter.call(h.body.querySelectorAll('input[data-tpc]'), function (x) { return x.checked; });
                    if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần lưu?', 'warn'); return false; }
                    var chaId = h.body.querySelector('[data-k="cha"]').value;
                    var calls = chon.map(function (x) {
                        var id = x.value;
                        var o = h.body.querySelector('input[data-stt="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
                        return {
                            action: 'CMS_CauTruc_DuLieu_G/ThemMoi', type: 'POST', strId: '',
                            strThanhPhan_Id: id, strThanhPhan_Cha_Id: '',
                            strTHBC_CT_DuLieu_G_Cha_Id: chaId,
                            strTHBC_HeThongBaoCao_Id: S.htbc.ID,
                            strTHBC_BC_CauTruc_C_G_Id: cotId,
                            iThuTu: o ? o.value : '',
                            strThanhPhan_Ten: '', strThanhPhan_Ma: '', strThanhPhan_Cha_Ten: '', strThanhPhan_Cha_Ma: '',
                            dChieuDinhHuongHienThi: '',
                            strNguoiThucHien_Id: uid(), silent: true
                        };
                    });
                    ui.batch(calls, { title: 'Đang lưu thành phần' }).then(function (res) {
                        ui.toast(res.fail ? 'Lưu ' + res.ok + '/' + calls.length + ' — lỗi: ' + res.errors[0] : 'Thêm mới thành công!', res.fail ? 'warn' : 'ok');
                        h.close();
                        napCauTruc();
                    });
                    return false;
                } }]
            });
            var elBang = dlg.body.querySelector('[data-k="bang"]');
            function napTp() {
                var d = bangDm.filter(function (x) { return String(x.ID) === String(elBang.value); })[0];
                var el = dlg.body.querySelector('[data-k="tp"]');
                if (!d || !d.MA) { el.innerHTML = ui.empty('Chọn danh mục thành phần để hiện các thành phần', 'fa-hand-pointer'); return; }
                el.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
                ums.api.dm(d.MA).then(function (rows) {
                    tp = rows || [];
                    ui.table({
                        el: el, rows: tp, empty: 'Danh mục không có thành phần',
                        columns: [
                            { title: 'Tên', prop: 'TEN' },
                            { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                            { title: 'Thứ tự', width: '110px', render: function (x, i) { return '<input class="ums-input" type="number" data-stt="' + esc(x.ID) + '" value="' + (i + 1) + '">'; } },
                            { head: '<input type="checkbox" data-tpall title="Chọn tất cả">', cls: 'is-center', width: '48px',
                                render: function (x) { return '<input type="checkbox" data-tpc value="' + esc(x.ID) + '">'; } }
                        ]
                    });
                }).catch(function (err) { el.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh mục ' + d.MA); });
            }
            if (window.jQuery) jQuery(elBang).on('select2:select select2:clear', napTp);
            elBang.addEventListener('change', function () { if (!elBang.classList.contains('select2-hidden-accessible')) napTp(); });
            dlg.body.addEventListener('click', function (e) {
                var all = e.target.closest('[data-tpall]');
                if (all) Array.prototype.forEach.call(dlg.body.querySelectorAll('input[data-tpc]'), function (x) { x.checked = all.checked; });
            });
            ui.enhance(dlg.body);
        }).catch(function (err) { ums.api.handle(err, 'CMS_CauTruc_DuLieu_G/LayTHBC_CauTruc_DuLieu_G_Cha'); });
    }

    /* delete_CauTrucChinh / delete_CauTrucPhu / delete_ThanhPhanChinh */
    function xoa(action, id) {
        ui.confirm('Bạn có chắc chắn muốn xóa dữ liệu?', { tone: 'bad', ok: 'Xoá', title: 'Xoá dữ liệu' }).then(function (yes) {
            if (!yes) return;
            return ums.api.call({ action: action, strIds: id, strNguoiThucHien_Id: uid() }).then(function (r) {
                if (r.message) { ui.toast(r.message, 'info'); return; }   // gốc: có Message thì chỉ hiện Message
                ui.toast('Xóa dữ liệu thành công!', 'ok');
                napCauTruc();
            });
        }).catch(function (err) { ums.api.handle(err, action); });
    }

    elCt.addEventListener('click', function (e) {
        var tp = e.target.closest('[data-tp]');
        if (tp) { hopThanhPhan(tp.getAttribute('data-tp')); return; }
        var d = e.target.closest('[data-dau]');
        if (d) {
            var loai = d.getAttribute('data-loai'), id = d.getAttribute('data-dau');
            var dong = LOAI[loai].ds().filter(function (x) { return String(x.ID) === id; })[0];
            if (dong) hopCauTruc(loai, dong);
            return;
        }
        var x = e.target.closest('[data-xoatp]');
        if (x) { xoa('CMS_CauTruc_DuLieu_G/Xoa', x.getAttribute('data-xoatp')); return; }
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') { ui.swap(elCt, elCrud); crud.load(); }
        else if (a === 'themChinh') hopCauTruc('chinh', null);
        else if (a === 'themPhu') hopCauTruc('phu', null);
    });
})();
