/* =========================================================================
   Hợp đồng (đối tác ký hợp đồng đào tạo cho người học)
   Bản gốc: ApisTaiChinh/Modules/dulieuhocphi/scripts/hopdong.js
   ---------------------------------------------------------------------------
   Hợp đồng (ums.crud):
       TC_HopDong/LayDSTaiChinh_NguoiHoc_HopDong   GET, phân trang máy chủ
       TC_NguoiHoc_HopDong/ThemMoi | CapNhat       POST (phân biệt bằng strId)
       TC_NguoiHoc_HopDong/Xoa                     POST, strIds (nút Xoá trong biểu mẫu)
   Học viên thuộc hợp đồng:
       TC_NguoiHoc_QuanLy/LayDanhSach              GET (biểu mẫu sửa + hộp "DS học viên")
       TC_NguoiHoc_QuanLy/ThemMoi                  POST, từng SV mới thêm, SAU khi lưu hợp đồng
       TC_NguoiHoc_QuanLy/Xoa                      POST, strIds
   Chính sách áp dụng (khoản × kiểu học):
       TC_NguoiHoc_Khoan/LayDanhSach | ThemMoi | CapNhat | Xoa
   Chính sách áp dụng riêng theo học viên:
       TC_HopDong_NH_Khoan/LayDanhSach | ThemMoi | CapNhat | Xoa
   Nguồn ô chọn:
       TC_DoiTuongKhac/LayDanhSach                 đối tác (TENDOITUONG)
       danh mục TAICHINH.DOITAC.NGUYENTACPHANBO, KHDT.DIEM.KIEUHOC
       TC_KhoanThu/LayDanhSach                     khoản thu
       SV_HoSo/LayDanhSach (pageSize 1000000)      học viên cho "chính sách riêng" —
                                                    nạp một lần, lần đầu mở biểu mẫu
       hộp chọn SV (ums.hocphi.pickSinhVien)       "Thêm thành viên"
   Bản gốc để 'type': 'GET'/'POST' NGAY TRONG dữ liệu gửi đi — vẫn gửi y như vậy.

   Thứ tự lưu giữ như bản gốc: lưu hợp đồng → lấy id (strId khi sửa, data.Id
   khi thêm) → lưu SV mới, chính sách, chính sách riêng (dòng thiếu khoản
   thu hoặc kiểu học thì bỏ qua như bản gốc). Dòng chính sách mới (id ngẫu
   nhiên 30 ký tự ở bản gốc) gửi strId rỗng + ThemMoi; dòng cũ gửi CapNhat.

   Khác bản gốc, có chủ đích:
     · Thêm mới mà máy chủ không trả id hợp đồng thì KHÔNG lưu các bảng con
       (bản gốc sẽ gửi strTaiChinh_NguoiHoc_HD_Id rỗng) — báo để người dùng
       mở lại hợp đồng mà thêm.
     · Lưu xong quay về danh sách (bản gốc ở lại biểu mẫu với id rỗng nên bấm
       Lưu lần nữa sẽ tạo hợp đồng thứ hai).
     · "Số hợp đồng" bắt buộc — bản gốc khai kiểm tra rỗng cho ô
       #txtHopDong_So không tồn tại nên không bao giờ kiểm.
     · Nút "Xoá" ở dòng chính sách ĐÃ LƯU của bản gốc không chạy (lớp
       deleteKetQua nhưng sự kiện gắn cho deleteChinhSach). Ở đây gọi đúng
       TC_NguoiHoc_Khoan/Xoa (TC_HopDong_NH_Khoan/Xoa với chính sách riêng).
     · Mở sửa một hợp đồng không có chính sách: bản gốc giữ nguyên các dòng
       của hợp đồng mở trước đó; ở đây hiện hai dòng trống.
     · "Thêm thành viên": bản gốc gọi genModal_SinhVien() không kèm callback
       nên nút "Chọn sinh viên" trong hộp không thêm được ai. Ở đây nối vào
       danh sách SV của hợp đồng.
     · Nút Xoá hợp đồng chỉ có trong biểu mẫu sửa (bản gốc đặt display:none;
       nút "Xóa" trên danh sách không có sự kiện, bảng không có ô chọn).
   Bỏ: cột "Hình ảnh" (edu.system.getRootPathImg chưa có ở tầng mới), ô lọc
   "Hiệu lực" (bản gốc không gửi lên khi tìm, chỉ làm giá trị mặc định khi
   thêm — ở đây mặc định "Hiệu lực"), các hàm chết getList_HeDaoTao…NamNhapHoc,
   KhoaQuanLy, genList_TrangThaiSV (phần tử không tồn tại), fakedb.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi, esc = ui.esc;
    var root = document.getElementById('hopdong');

    var DOITAC = {
        call: { action: 'TC_DoiTuongKhac/LayDanhSach', method: 'GET', type: 'GET', strTuKhoa: '', pageIndex: 1, pageSize: 100000 },
        name: 'TENDOITUONG'
    };
    var NGUYENTAC = { dm: 'TAICHINH.DOITAC.NGUYENTACPHANBO' };
    var HIEULUC = { items: [{ ID: '1', TEN: 'Hiệu lực' }, { ID: '0', TEN: 'Hết hiệu lực' }] };

    function hieuLuc(x) { return x && String(x) !== '0'; }   // bản gốc: aData.HIEULUC ? … : …
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    /* Nguồn cho các dòng chính sách — nạp một lần */
    var src = null;
    function sources() {
        if (!src) {
            src = Promise.all([
                H.rows({
                    action: 'TC_KhoanThu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                    strTuKhoa: '', pageIndex: 1, pageSize: 10000, strNhomCacKhoanThu_Id: '', strCanBoQuanLy_Id: '', strNguoiThucHien_Id: ''
                }),
                ums.api.dm('KHDT.DIEM.KIEUHOC'),
                H.rows({
                    action: 'SV_HoSo/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
                    strTuKhoa: '', strHeDaoTao_Id: '', strKhoaDaoTao_Id: '', strChuongTrinh_Id: '', strLopQuanLy_Id: '',
                    strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
                })
            ]).then(function (x) { return { khoan: x[0], kieu: x[1], sv: x[2] }; })
              .catch(function (e) { src = null; throw e; });
        }
        return src;
    }

    /* ---------- Danh sách + biểu mẫu hợp đồng ------------------------------- */
    var crud = ums.crud({
        root: root,
        title: 'Hợp đồng',
        formTitle: 'hợp đồng',
        icon: 'fa-file-signature',
        listTitle: 'Danh sách hợp đồng',
        filters: [
            { key: 'doiTac', type: 'select', label: 'Chọn đối tác', source: DOITAC },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            paged: true,
            call: function (f) {
                return {
                    action: 'TC_HopDong/LayDSTaiChinh_NguoiHoc_HopDong',
                    method: 'GET',
                    type: 'GET',
                    strTuKhoa: f.q,
                    strDonViKyHopDong_Id: f.doiTac,
                    strNguoiTao_Id: ''
                };
            }
        },
        columns: [
            { title: 'Đối tác ký hợp đồng', prop: 'DONVIKYHOPDONG_TEN' },
            { title: 'Số hợp đồng', prop: 'SOHOPDONG', cls: 'is-nowrap' },
            { title: 'Ngày ký', prop: 'NGAYKY', cls: 'is-center is-nowrap' },
            { title: 'Mô tả', prop: 'MOTA' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return hieuLuc(r.HIEULUC) ? ui.badge('Hiệu lực', 'ok') : ui.badge('Hết hiệu lực', 'mute'); } },
            { title: 'Nguyên tắc phân bổ', prop: 'NGUYENTACPHANBO_TEN' }
        ],
        rowActions: [{ icon: 'fa-users', title: 'Danh sách học viên thuộc hợp đồng', onClick: function (row) { dsHocVien(row); } }],
        fields: [
            { type: 'legend', label: 'Thông tin' },
            { key: 'strDonViKyHopDong_Id', col: 'DONVIKYHOPDONG_ID', label: 'Đối tác ký hợp đồng', type: 'select', source: DOITAC, placeholder: 'Chọn đối tác' },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả' },
            { key: 'strSoHopDong', col: 'SOHOPDONG', label: 'Số hợp đồng', required: true },
            { key: 'strNgayKy', col: 'NGAYKY', label: 'Ngày ký', type: 'date' },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', source: HIEULUC, value: '1', get: function (r) { return hieuLuc(r.HIEULUC) ? '1' : '0'; } },
            { key: 'strNguyenTacPhanBo_Id', col: 'NGUYENTACPHANBO_ID', label: 'Nguyên tắc phân bổ', type: 'select', source: NGUYENTAC }
        ],
        onForm: function (row, c, extra) { openSub(row, c, extra); },
        save: function (v, row, c) { luu(v, row, c); return null; },
        rowDelete: false,
        multi: false,
        remove: function (ids) {
            return { action: 'TC_NguoiHoc_HopDong/Xoa', strIds: ids[0], strNguoiThucHien_Id: '' };
        }
    });

    /* ---------- Ba bảng con trong biểu mẫu ---------------------------------- */
    var hd = null;          // hợp đồng đang sửa (null = thêm mới)
    var ex = null;          // vùng extra của crud
    var svRows = [];        // [{ ID (dòng cũ) | '', QLSV_NGUOIHOC_ID, MASO, HOTEN, LOP, CT, KHOA, isNew }]
    var seq = 0;

    function openSub(row, c, extra) {
        hd = row; ex = extra; svRows = [];
        if (!row) {
            // rewrite(): đối tác mặc định = đối tác đang lọc
            var f = c.filterValues();
            var dt = root.querySelector('[data-scope="form"][data-k="strDonViKyHopDong_Id"]');
            if (dt && f.doiTac) { dt.value = f.doiTac; jQuery(dt).trigger('change.select2'); }
        }
        extra.innerHTML =
            panel('sv', 'fa-user-group', 'Danh sách học sinh - sinh viên xét duyệt',
                '<button type="button" class="ums-btn ums-btn--out-success ums-btn--sm" data-h="addsv"><i class="fa-light fa-plus"></i><span>Thêm thành viên</span></button>') +
            panel('cs', 'fa-scale-balanced', 'Chính sách áp dụng',
                '<button type="button" class="ums-btn ums-btn--out-success ums-btn--sm" data-h="addcs"><i class="fa-light fa-plus"></i><span>Thêm dòng mới</span></button>') +
            panel('csr', 'fa-user-gear', 'Chính sách áp dụng riêng theo học viên',
                '<button type="button" class="ums-btn ums-btn--out-success ums-btn--sm" data-h="addcsr"><i class="fa-light fa-plus"></i><span>Thêm dòng mới</span></button>');
        drawSv();
        sources().then(function () {
            if (!row) { csSet('cs', [], 1); csSet('csr', [], 1); return; }
            loadSv(); loadCs(); loadCsr();
        }).catch(fail('nguồn chính sách'));
    }

    function panel(k, icon, title, tools) {
        return '<div class="ums-panel ums-u-mb-4"><div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light ' + icon + '"></i> ' + esc(title) + '</div>' +
            '<div class="ums-panel__tools">' + tools + '</div></div>' +
            '<div class="ums-panel__body ums-panel__body--flush" data-h="' + k + '"></div></div>';
    }
    function x(k) { return ex.querySelector('[data-h="' + k + '"]'); }

    /* --- Sinh viên --- */
    function loadSv() {
        return H.rows({
            action: 'TC_NguoiHoc_QuanLy/LayDanhSach', method: 'GET', type: 'GET',
            strTuKhoa: '', strQLSV_NguoiHoc_DoiTac_Id: '', dHieuLuc: 1, strTaiChinh_NguoiHoc_HD_Id: hd.ID, strNguoiTao_Id: '',
            pageIndex: 1, pageSize: 100000
        }).then(function (rows) {
            svRows = rows.map(function (r) {
                return { ID: r.ID, QLSV_NGUOIHOC_ID: r.QLSV_NGUOIHOC_ID, MASO: r.QLSV_NGUOIHOC_MASO, HOTEN: r.QLSV_NGUOIHOC_HOTEN,
                    LOP: r.DAOTAO_LOPQUANLY_TEN, CT: r.DAOTAO_CHUONGTRINH_TEN, KHOA: r.DAOTAO_KHOADAOTAO_TEN, isNew: false };
            });
            drawSv();
        }).catch(fail('học viên của hợp đồng'));
    }
    function drawSv() {
        ui.table({
            el: x('sv'), rows: svRows, empty: 'Chưa có sinh viên',
            columns: [
                { title: 'Mã số', prop: 'MASO', cls: 'is-nowrap' },
                { title: 'Họ tên', prop: 'HOTEN' },
                { title: 'Lớp', prop: 'LOP' },
                { title: 'Chương trình', prop: 'CT' },
                { title: 'Khóa', prop: 'KHOA' },
                { title: '', cls: 'is-actions', width: '90px', render: function (r, i) {
                    return (r.isNew ? ui.badge('Mới', 'info') + ' ' : '') +
                        '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-h="delsv" data-i="' + i + '" title="Xoá"><i class="fa-light fa-trash-can"></i></button>';
                } }
            ]
        });
    }
    function addSv() {
        H.pickSinhVien({
            onPick: function (list) {
                var dup = 0;
                list.forEach(function (s) {
                    if (svRows.some(function (r) { return r.QLSV_NGUOIHOC_ID === s.QLSV_NGUOIHOC_ID; })) { dup++; return; }
                    svRows.push({ ID: '', QLSV_NGUOIHOC_ID: s.QLSV_NGUOIHOC_ID, MASO: s.QLSV_NGUOIHOC_MASO,
                        HOTEN: H.e(s.QLSV_NGUOIHOC_HODEM) + ' ' + H.e(s.QLSV_NGUOIHOC_TEN),
                        LOP: s.DAOTAO_LOPQUANLY_TEN, CT: s.DAOTAO_CHUONGTRINH_TEN, KHOA: s.DAOTAO_KHOADAOTAO_TEN, isNew: true });
                });
                if (dup) ui.toast(dup + ' sinh viên đã có trong danh sách.', 'warn');
                drawSv();
            }
        });
    }
    function delSv(i) {
        var r = svRows[i];
        if (r.isNew) { svRows.splice(i, 1); return drawSv(); }       // removeHTMLoff_SinhVien
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: 'TC_NguoiHoc_QuanLy/Xoa', strIds: r.ID, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); loadSv(); }).catch(fail('xoá sinh viên'));
        });
    }

    /* --- Chính sách / chính sách riêng: bảng nhập, mỗi dòng các ô chọn --- */
    var CS = {
        cs:  { list: 'TC_NguoiHoc_Khoan', rieng: false },
        csr: { list: 'TC_HopDong_NH_Khoan', rieng: true }
    };
    function loadCs() { return loadList('cs'); }
    function loadCsr() { return loadList('csr'); }
    function loadList(k) {
        return H.rows({
            action: CS[k].list + '/LayDanhSach', method: 'GET', type: 'GET',
            strTuKhoa: '', strTaiChinh_CacKhoanThu_Id: '', strKieuHoc_Id: '', strTaiChinh_NguoiHoc_HD_Id: hd.ID, strNguoiTao_Id: '',
            pageIndex: 1, pageSize: 10000
        }).then(function (rows) { csSet(k, rows, 2); }).catch(fail('chính sách'));
    }
    /** Vẽ bảng: các dòng đã lưu + dòng trống cho đủ `min` (genHTML_ChinhSach_Data) */
    function csSet(k, rows, min) {
        var host = x(k);
        var head = '<th class="is-center" style="width:56px">Stt</th><th>Loại khoản</th><th>Kiểu học</th>' +
            (CS[k].rieng ? '<th>Học viên</th>' : '') + '<th class="is-actions" style="width:70px"></th>';
        host.innerHTML = '<div class="ums-tablewrap"><table class="ums-table ums-table--lined"><thead><tr>' + head + '</tr></thead><tbody></tbody></table></div>';
        rows.forEach(function (r) { csAdd(k, r); });
        for (var i = rows.length; i < min; i++) csAdd(k, null);
    }
    function csAdd(k, r) {
        var tb = x(k).querySelector('tbody');
        var id = r ? r.ID : '';
        var tr = document.createElement('tr');
        tr.setAttribute('data-cs', id);
        tr.setAttribute('data-seq', String(++seq));
        tr.innerHTML = '<td class="is-center" data-stt></td>' +
            '<td><select class="ums-select" data-f="khoan"></select></td>' +
            '<td><select class="ums-select" data-f="kieu"></select></td>' +
            (CS[k].rieng ? '<td><select class="ums-select" data-f="sv"></select></td>' : '') +
            '<td class="is-actions"><button type="button" class="ums-iconbtn ums-iconbtn--del" data-h="delrow" data-k="' + k + '" title="' +
                (id ? 'Xoá chính sách' : 'Xoá dòng') + '"><i class="fa-light fa-trash-can"></i></button></td>';
        tb.appendChild(tr);
        sources().then(function (s) {
            fillSel(tr.querySelector('[data-f="khoan"]'), s.khoan, 'TEN', r && r.TAICHINH_CACKHOANTHU_ID, 'Chọn khoản thu');
            fillSel(tr.querySelector('[data-f="kieu"]'), s.kieu, 'TEN', r && r.KIEUHOC_ID, 'Chọn kiểu học');
            if (CS[k].rieng) fillSel(tr.querySelector('[data-f="sv"]'), s.sv,
                function (a) { return H.e(a.HODEM) + ' ' + H.e(a.TEN) + ' - ' + H.e(a.MASO); }, r && r.QLSV_NGUOIHOC_ID, 'Chọn sinh viên');
        });
        renumber(k);
    }
    function fillSel(el, rows, name, val, head) {
        H.fill(el, rows, { name: name, head: head });       // ums.pat.fill: đổ + gắn select2
        if (val) { el.value = val; if (window.jQuery) jQuery(el).trigger('change.select2'); }
    }
    function renumber(k) {
        Array.prototype.forEach.call(x(k).querySelectorAll('tbody tr'), function (tr, i) { tr.querySelector('[data-stt]').textContent = i + 1; });
    }
    function delRow(btn) {
        var k = btn.getAttribute('data-k');
        var tr = btn.closest('tr');
        var id = tr.getAttribute('data-cs');
        if (!id) { tr.parentNode.removeChild(tr); return renumber(k); }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({ action: CS[k].list + '/Xoa', strIds: id, strNguoiThucHien_Id: '' })
                .then(function () { ui.toast('Xóa thành công!', 'ok'); loadList(k); }).catch(fail('xoá chính sách'));
        });
    }
    /** Lời gọi lưu cho các dòng đủ khoản thu + kiểu học (save_ChinhSach / save_ChinhSachRieng) */
    function csCalls(k, hdId) {
        var out = [];
        Array.prototype.forEach.call(x(k).querySelectorAll('tbody tr'), function (tr) {
            var khoan = (tr.querySelector('[data-f="khoan"]').value || '').trim();
            var kieu = (tr.querySelector('[data-f="kieu"]').value || '').trim();
            if (!khoan || !kieu) return;
            var id = tr.getAttribute('data-cs') || '';
            var c = {
                action: CS[k].list + (id ? '/CapNhat' : '/ThemMoi'),
                strId: id,
                strTaiChinh_NguoiHoc_HD_Id: hdId
            };
            if (CS[k].rieng) c.strQLSV_NguoiHoc_Id = (tr.querySelector('[data-f="sv"]').value || '').trim();
            c.strKieuHoc_Id = kieu;
            c.strTaiChinh_CacKhoanThu_Id = khoan;
            c.strNguoiThucHien_Id = '';
            out.push(c);
        });
        return out;
    }

    /* ---------- Lưu ------------------------------------------------------------ */
    function luu(v, row, c) {
        var isEdit = !!row;
        var call = {
            action: isEdit ? 'TC_NguoiHoc_HopDong/CapNhat' : 'TC_NguoiHoc_HopDong/ThemMoi',
            strId: isEdit ? row.ID : '',
            strSoHopDong: v.strSoHopDong,
            strNgayKy: v.strNgayKy,
            strMoTa: v.strMoTa,
            dHieuLuc: v.dHieuLuc,
            strDonViKyHopDong_Id: v.strDonViKyHopDong_Id,
            strNguyenTacPhanBo_Id: v.strNguyenTacPhanBo_Id,
            strNguoiThucHien_Id: ''
        };
        var btn = root.querySelector('[data-c$=":save"]');
        if (btn) btn.disabled = true;
        ums.api.call(call).then(function (r) {
            ui.toast(isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!', 'ok');
            var raw = r.raw || {};
            var id = isEdit ? row.ID : (raw.Id || raw.ID || (/^[0-9A-Fa-f]{32}$/.test(r.message || '') ? r.message : ''));
            var subs = [];
            if (id) {
                svRows.filter(function (s) { return s.isNew; }).forEach(function (s) {
                    subs.push({
                        action: 'TC_NguoiHoc_QuanLy/ThemMoi', type: 'POST',
                        strQLSV_NguoiHoc_Id: s.QLSV_NGUOIHOC_ID,
                        strQLSV_NguoiHoc_DoiTac_Id: v.strDonViKyHopDong_Id,
                        strGhiChu: '', strPhanLoai_Id: '',
                        strTaiChinh_NguoiHoc_HD_Id: id,
                        strNguoiThucHien_Id: ''
                    });
                });
                subs = subs.concat(csCalls('cs', id), csCalls('csr', id));
            } else if (svRows.some(function (s) { return s.isNew; }) || csCalls('cs', 'x').length || csCalls('csr', 'x').length) {
                ui.toast('Máy chủ không trả mã hợp đồng mới — chưa lưu sinh viên / chính sách. Mở lại hợp đồng để thêm.', 'warn', { timeout: 9000 });
            }
            return H.runAll(subs, 'Đang lưu sinh viên, chính sách').then(function () {
                c.showList();
                c.load();
            });
        }).catch(fail('lưu hợp đồng')).then(function () { if (btn) btn.disabled = false; });
    }

    /* ---------- Hộp "DS học viên" (getList_QuanSoTheoLop) -------------------- */
    function dsHocVien(row) {
        var dlg = ui.dialog({ title: 'Danh sách sinh viên thuộc hợp đồng — ' + H.e(row.SOHOPDONG), icon: 'fa-users', size: 'xl',
            body: '<div data-dl="tbl">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        H.rows({
            action: 'TC_NguoiHoc_QuanLy/LayDanhSach', method: 'GET', type: 'GET',
            strTuKhoa: '', strQLSV_NguoiHoc_DoiTac_Id: '', dHieuLuc: 1, strTaiChinh_NguoiHoc_HD_Id: row.ID, strNguoiTao_Id: '',
            pageIndex: 1, pageSize: 100000
        }).then(function (rows) {
            ui.table({
                el: dlg.body.querySelector('[data-dl="tbl"]'), rows: rows, empty: 'Hợp đồng chưa có sinh viên',
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-center is-nowrap' },
                    { title: 'Họ tên', render: function (r) { return esc(H.e(r.QLSV_NGUOIHOC_HODEM) + ' ' + H.e(r.QLSV_NGUOIHOC_TEN)); } },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN', cls: 'is-center' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN', cls: 'is-center' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN', cls: 'is-center' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', cls: 'is-center' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN', cls: 'is-center' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', cls: 'is-center' }
                ]
            });
        }).catch(function (err) { dlg.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách học viên'); });
    }

    /* ---------- Sự kiện vùng bảng con (gắn trên root) ----------------------- */
    root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-h]');
        if (!b || !root.contains(b)) return;
        switch (b.getAttribute('data-h')) {
            case 'addsv': addSv(); break;
            case 'delsv': delSv(Number(b.getAttribute('data-i'))); break;
            case 'addcs': csAdd('cs', null); break;
            case 'addcsr': csAdd('csr', null); break;
            case 'delrow': delRow(b); break;
        }
    });
})();
