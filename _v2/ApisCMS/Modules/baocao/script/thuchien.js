/* =========================================================================
   Thực hiện báo cáo (nhập số liệu vào mẫu báo cáo được phân quyền)
   Bản gốc: ApisCMS/Modules/baocao/html/thuchien.html + script/thuchien.js
   ---------------------------------------------------------------------------
   Một cột như bản gốc: lọc Kế hoạch + danh sách mẫu báo cáo của cá nhân; nút
   "Cấu hình" (con mắt) → khung "Cấu trúc báo cáo" thay chỗ danh sách: bảng
   tiêu đề cây + cây dòng, mỗi dòng lá × mỗi cột PHỤ lá là một ô nhập; "Lưu"
   ghi các ô đã đổi (có giá trị → ThemMoi/CapNhat, xoá trắng → Xoa).

   Lời gọi — chép nguyên văn:
       CMS_KeHoachBaoCao/LayKeHoachBaoCaoTheoCanNhan  GET  type 'GET', strChucNang_Id, strNguoiThucHien_Id
       CMS_HeThongBaoCao/LayHeThongBaoCaoTheoCanNhan  GET  type 'GET', strChucNang_Id, strNguoiThucHien_Id,
                                                           strTHBC_KeHoachBaoCao_Id
       CMS_BaoCao_CauTruc_Phu/LayDanhSach   GET  type 'GET', strTuKhoa "", strTHBC_HeThongBaoCao_Id (= ID dòng
       CMS_BaoCao_CauTruc_Chinh/LayDanhSach      danh sách, như gốc), strThanhPhan_Id "", strThanhPhan_Cha_Id "",
                                                 strNguoiThucHien_Id, pageIndex 1, pageSize 100000
       CMS_CauTruc_DuLieu/LayDanhSach       GET  … strTHBC_HeThongBaoCao_Id = THBC_HETHONGBAOCAO_ID của dòng,
                                                 strTHBC_CoSoDaoTao_Id, strTHBC_KeHoachBaoCao_Id (của dòng),
                                                 strTHBC_BaoCao_CauTruc_C_Id "", strTHBC_CT_DuLieu_Cha_Id ""
       CMS_BaoCao_DuLieu/LayDanhSach        GET  (mỗi dòng lá × mỗi cột phụ lá MỘT lời gọi, như gốc)
             type 'GET', strTuKhoa "", strTHBC_CauTrucCay_DuLieu_Id, strTHBC_BaoCao_CauTruc_P_Id,
             strThanhPhan_CayDuLieu_Id "", strThanhPhan_CauTruc_Phu_Id "", strTHBC_CoSoDaoTao_Id,
             strTHBC_KeHoachBaoCao_Id, strNguoiThucHien_Id, pageIndex 1, pageSize 100000
             → ID (id bản ghi), THANHPHAN_GIATRI
       CMS_BaoCao_DuLieu/ThemMoi | CapNhat  POST  type 'POST', strId, strChucNang_Id,
             strTHBC_CauTrucCay_DuLieu_Id, strTHBC_BaoCao_CauTruc_P_Id, strThanhPhan_CayDuLieu_Id,
             strThanhPhan_GiaTri, strThanhPhan_CauTruc_Phu_Id, strTHBC_CoSoDaoTao_Id,
             strTHBC_KeHoachBaoCao_Id, strNguoiThucHien_Id
       CMS_BaoCao_DuLieu/Xoa                POST  strIds, strChucNang_Id, strNguoiThucHien_Id
     Cây tiêu đề: khoá CON_ID, khoá cha THBC_BC_CAUTRUC_PHU_CHA_ID (cột chính chép
       từ THBC_BAOCAO_CAUTRUC_C_CHA_ID); cột có ô nhập = cột LÁ KHÔNG có cột
       LABANGCHINH (cột phụ). Cây dòng: khoá CON_ID, khoá cha THBC_CAUTRUC_DULIEU_CHA_ID.

   Giữ như gốc (ghi can-quyet):
     · Chỉ tự chọn kế hoạch khi danh sách kế hoạch có ĐÚNG MỘT mục (selectOne).
     · Ô từ khoá không được gửi (lời gọi danh sách không có strTuKhoa) → lọc
       trên danh sách đã tải (ums.pat.loc).
     · Nút "Sửa" ở mỗi dòng của gốc không có xử lý (viewForm_ThucHien không gắn
       vào đâu) → giữ nút, khoá (disabled).
     · Cấu trúc cột / dòng lấy theo ID DÒNG danh sách, dữ liệu dòng lấy theo
       THBC_HETHONGBAOCAO_ID — hai khoá khác nhau như gốc.
   Lỗi gốc đã sửa:
     · Ô chọn danh mục của cột phụ: gốc tìm cột phụ bằng THANHPHAN_ID === ID
       cột (so nhầm khoá) và đặt id ô "drop_" nhưng đổ danh mục vào "drop" →
       không bao giờ ra ô chọn, mọi ô là ô chữ. Nay: cột phụ có
       MABANGDM_THANHPHAN_DULIEU thì ô chọn theo danh mục đó (đúng ý định).
   Khác gốc: nạp giá trị ô qua hàng đợi 6 luồng (gốc bắn N×M lời gọi cùng
     lúc); bỏ phím di chuyển giữa ô (move_ThroughInTable).
   Cặp cha → con: không có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat, esc = ui.esc, BC = ums.cmsBaoCao;
    var root = document.getElementById('cms-thuchien');
    if (!root) return;

    root.innerHTML = '<div data-z="crud"></div><div data-z="ct" hidden></div>';
    var elCrud = root.querySelector('[data-z="crud"]');
    var elCt = root.querySelector('[data-z="ct"]');
    function uid() { return ums.session.userId; }

    var S = { row: null, phu: [], chinh: [], duLieu: [], cot: [], thanLa: [], q: '' };
    var crud = null;

    /* getList_KeHoachBaoCao — nạp trước để biết có đúng một kế hoạch không */
    ums.api.call({ action: 'CMS_KeHoachBaoCao/LayKeHoachBaoCaoTheoCanNhan', method: 'GET', type: 'GET', silent: true,
        strNguoiThucHien_Id: uid() })
        .then(function (r) { return r.data || []; }, function (err) { ums.api.handle(err, 'CMS_KeHoachBaoCao/LayKeHoachBaoCaoTheoCanNhan'); return []; })
        .then(dung);

    function dung(dsKh) {
        crud = ums.crud({
            root: elCrud,
            title: 'Thực hiện báo cáo',
            icon: 'fa-list-ul',
            filters: [
                { key: 'kh', type: 'select', label: 'Chọn kế hoạch báo cáo', source: { items: dsKh }, value: dsKh.length === 1 ? dsKh[0].ID : '' },
                { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
            ],
            list: {
                call: function (f) {
                    S.q = f.q || '';
                    return { action: 'CMS_HeThongBaoCao/LayHeThongBaoCaoTheoCanNhan', method: 'GET', type: 'GET',
                        strNguoiThucHien_Id: uid(), strTHBC_KeHoachBaoCao_Id: f.kh };
                },
                rows: function (d) { return pat.loc(Array.isArray(d) ? d : [], S.q, ['MA', 'TEN', 'PHANLOAI_TEN']); }
            },
            columns: [
                { title: 'Mã', prop: 'MA', cls: 'is-nowrap' },
                { title: 'Tên', prop: 'TEN' },
                { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return r.HIEULUC ? ui.badge('Hiệu lực', 'ok') : ''; } },
                { title: 'Phân loại', prop: 'PHANLOAI_TEN', cls: 'is-center' },
                { title: 'Sửa', cls: 'is-actions', width: '64px', render: function () {
                    return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" disabled title="Bản gốc chưa có chức năng sửa ở đây"><i class="fa-light fa-pen-to-square"></i></button>';
                } }
            ],
            rowActions: [
                { icon: 'fa-eye', title: 'Cấu hình', onClick: function (row) { mo(row); } }
            ]
        });
    }

    /* ---------- khung Cấu trúc báo cáo (nhập số liệu) ---------- */
    function mo(row) {
        S.row = row;
        elCt.innerHTML = pat.panel({
            title: 'Cấu trúc báo cáo — ' + (row.TEN || ''), icon: 'fa-table-cells', flush: true, zone: 'bang',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } })
        });
        ui.swap(elCrud, elCt);
        nap();
    }
    function bang() { return elCt.querySelector('[data-z="bang"]'); }

    function dsCall(action) {
        return { action: action, method: 'GET', type: 'GET', strTuKhoa: '', strTHBC_HeThongBaoCao_Id: S.row.ID,
            strThanhPhan_Id: '', strThanhPhan_Cha_Id: '', strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000 };
    }

    /* getList_CauTrucPhu → getList_CauTrucChinh → getList_ThanhPhanChinh → genTable_ThanhPhanChinh */
    function nap() {
        bang().innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(dsCall('CMS_BaoCao_CauTruc_Phu/LayDanhSach')).then(function (r) {
            S.phu = r.data || [];
            return ums.api.call(dsCall('CMS_BaoCao_CauTruc_Chinh/LayDanhSach'));
        }).then(function (r) {
            S.chinh = (r.data || []).map(function (x) { x.THBC_BC_CAUTRUC_PHU_CHA_ID = x.THBC_BAOCAO_CAUTRUC_C_CHA_ID; return x; });
            return ums.api.call({
                action: 'CMS_CauTruc_DuLieu/LayDanhSach', method: 'GET', type: 'GET', strTuKhoa: '',
                strTHBC_HeThongBaoCao_Id: S.row.THBC_HETHONGBAOCAO_ID,
                strThanhPhan_Id: '', strThanhPhan_Cha_Id: '', strNguoiThucHien_Id: uid(),
                strTHBC_CoSoDaoTao_Id: S.row.THBC_COSODAOTAO_ID,
                strTHBC_KeHoachBaoCao_Id: S.row.THBC_KEHOACHBAOCAO_ID,
                strTHBC_BaoCao_CauTruc_C_Id: '', strTHBC_CT_DuLieu_Cha_Id: '',
                pageIndex: 1, pageSize: 100000
            });
        }).then(function (r) {
            S.duLieu = r.data || [];
            return veLuoi();
        }).catch(function (err) { bang().innerHTML = ui.fail(err.message); ums.api.handle(err, 'Cấu trúc báo cáo'); });
    }

    function cotPhu(id) { return S.phu.filter(function (x) { return String(x.ID) === String(id); })[0]; }

    function veLuoi() {
        // danh mục của các cột phụ có MABANGDM_THANHPHAN_DULIEU — nạp trước khi vẽ ô chọn
        var ma = {};
        S.phu.forEach(function (x) { if (x.MABANGDM_THANHPHAN_DULIEU) ma[x.MABANGDM_THANHPHAN_DULIEU] = 1; });
        var dm = {};
        return Promise.all(Object.keys(ma).map(function (k) {
            return ums.api.dm(k).then(function (rows) { dm[k] = rows || []; }, function () { dm[k] = []; });
        })).then(function () {
            var kq = BC.bangCay(bang(), {
                dau: S.chinh.concat(S.phu), dauId: 'CON_ID', dauCha: 'THBC_BC_CAUTRUC_PHU_CHA_ID',
                oDau: function (x) { return esc(x.THANHPHAN_TEN || ''); },
                laCot: function (x) { return x.LABANGCHINH === undefined; },
                than: S.duLieu, thanId: 'CON_ID', thanCha: 'THBC_CAUTRUC_DULIEU_CHA_ID',
                oThan: function (x) { return esc(x.THANHPHAN_TEN || ''); },
                oDuLieu: function (dong, cot) {
                    var a = ' data-b="' + esc(dong.ID) + '" data-h="' + esc(cot.ID) + '" data-rec="" data-cu=""';
                    var p = cotPhu(cot.ID);
                    if (p && p.MABANGDM_THANHPHAN_DULIEU) {
                        return '<select class="ums-select"' + a + '>' + ui.options(dm[p.MABANGDM_THANHPHAN_DULIEU] || [], { title: '-- Chọn --' }) + '</select>';
                    }
                    return '<input class="ums-input"' + a + ' autocomplete="off">';
                },
                empty: 'Mẫu báo cáo chưa có cấu trúc'
            });
            S.cot = kq.cot;
            S.thanLa = kq.thanLa;
            return napGiaTri();
        });
    }

    function o(b, h) {
        return bang().querySelector('[data-b="' + cssEsc(b) + '"][data-h="' + cssEsc(h) + '"]');
    }
    function cssEsc(s) { return window.CSS && CSS.escape ? CSS.escape(String(s)) : String(s).replace(/["\\]/g, '\\$&'); }

    /* getAll_DuLieu — mỗi dòng lá × mỗi cột phụ lá một lời gọi */
    function napGiaTri() {
        var tasks = [];
        S.thanLa.forEach(function (dong) {
            S.cot.forEach(function (cot) {
                tasks.push(function () {
                    return ums.api.call({
                        action: 'CMS_BaoCao_DuLieu/LayDanhSach', method: 'GET', type: 'GET', silent: true,
                        strTuKhoa: '', strTHBC_CauTrucCay_DuLieu_Id: dong.ID, strTHBC_BaoCao_CauTruc_P_Id: cot.ID,
                        strThanhPhan_CayDuLieu_Id: '', strThanhPhan_CauTruc_Phu_Id: '',
                        strTHBC_CoSoDaoTao_Id: dong.THBC_COSODAOTAO_ID, strTHBC_KeHoachBaoCao_Id: dong.THBC_KEHOACHBAOCAO_ID,
                        strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 100000
                    }).then(function (r) {
                        var x = o(dong.ID, cot.ID);
                        if (!x) return;
                        (r.data || []).forEach(function (d) {
                            var v = d.THANHPHAN_GIATRI == null ? '' : String(d.THANHPHAN_GIATRI);
                            x.setAttribute('data-rec', d.ID == null ? '' : d.ID);
                            x.value = v;
                            x.setAttribute('data-cu', v);
                        });
                    });
                });
            });
        });
        return BC.chayLuong(tasks, 6);
    }

    /* btnSave_ThucHien */
    function luu() {
        var ds = Array.prototype.slice.call(bang().querySelectorAll('[data-b][data-h]'));
        var luuDs = [], xoaDs = [];
        ds.forEach(function (x) {
            if (x.value === x.getAttribute('data-cu')) return;
            if (x.value) luuDs.push(x);
            else if (x.getAttribute('data-rec')) xoaDs.push(x.getAttribute('data-rec'));
        });
        if (!luuDs.length && !xoaDs.length) { ui.toast('Không có dữ liệu mới cần lưu', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn muốn lưu ' + luuDs.length + ' và xóa ' + xoaDs.length + ' không?', { title: 'Lưu số liệu', ok: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            var calls = luuDs.map(function (x) {
                var bId = x.getAttribute('data-b'), hId = x.getAttribute('data-h'), rec = x.getAttribute('data-rec');
                var chinh = S.duLieu.filter(function (d) { return String(d.ID) === bId; })[0] || {};
                var phu = cotPhu(hId) || {};
                return {
                    action: rec ? 'CMS_BaoCao_DuLieu/CapNhat' : 'CMS_BaoCao_DuLieu/ThemMoi', type: 'POST',
                    strId: rec || '',
                    strTHBC_CauTrucCay_DuLieu_Id: bId,
                    strTHBC_BaoCao_CauTruc_P_Id: hId,
                    strThanhPhan_CayDuLieu_Id: chinh.THANHPHAN_ID,
                    strThanhPhan_GiaTri: x.value,
                    strThanhPhan_CauTruc_Phu_Id: phu.THANHPHAN_ID,
                    strTHBC_CoSoDaoTao_Id: chinh.THBC_COSODAOTAO_ID,
                    strTHBC_KeHoachBaoCao_Id: chinh.THBC_KEHOACHBAOCAO_ID,
                    strNguoiThucHien_Id: uid(), silent: true
                };
            }).concat(xoaDs.map(function (id) {
                return { action: 'CMS_BaoCao_DuLieu/Xoa', strIds: id, strNguoiThucHien_Id: uid(), silent: true };
            }));
            return ui.batch(calls, { title: 'Đang lưu số liệu', show: true }).then(function (r) {
                ui.toast(r.fail ? 'Lưu ' + r.ok + '/' + calls.length + ' — lỗi: ' + r.errors[0] : 'Đã lưu ' + luuDs.length + ', xoá ' + xoaDs.length + ' ô', r.fail ? 'warn' : 'ok');
                return napGiaTri();
            });
        });
    }

    elCt.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'dong') { ui.swap(elCt, elCrud); if (crud) crud.load(); }
        else if (a === 'luu') luu();
    });
})();
