/* =========================================================================
   Bảng tính lương — tra cứu lương của cán bộ đang đăng nhập (tháng + cả năm)
   Bản gốc: ApisCongCanBo/Modules/luong/script/bangtinhluongnam.js
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, GET, chép nguyên):
       L_TraCuu_BangLuong/LayDanhSach            cấu trúc cột bảng tháng (cây thành phần)
       L_TraCuu_BangLuong/LayDSDuLieuBangLuong   { rsNhanSu: dòng, rsDuLieuLuong: ô }
       L_TraCuu_BangLuongNam/LayDanhSach         cấu trúc cột bảng cả năm
       L_TraCuu_BangLuongNam/LayDSDuLieuBangLuongNam
       L_TraCuu_LuongThang/LayChiTiet            chi tiết một ô (hộp "Chi tiết bảng lương")
   Tham số chung: strNhanSu_HoSoCanBo_Id = userId, dNam, dThang (trống → -1),
   strLoaiBangLuong_Id (danh mục NHANSU.LOAIBANGLUONG), strNguoiThucHien_Id.
   "Xuất báo cáo": mẫu báo cáo của chức năng (getList_MauImport) → ums.report,
   cùng bộ khoá addKeyValue của bản gốc.

   Tiêu đề bảng: mỗi thành phần có THANHPHAN_ID / THANHPHAN_CHA_ID /
   THANHPHAN_TEN; thành phần không có con là một CỘT, tổ tiên của nó là các
   tầng tiêu đề (bản gốc dựng bằng recuseHeader + rowspan/colspan). Thứ tự
   cột = duyệt cây theo thứ tự máy chủ trả. Ô có giá trị khác 0 mà thành phần
   có LATHANHPHANCUOI = 0 thì có nút "Chi tiết". Bảng tháng có dòng tổng các
   cột lương; bảng năm không có (như bản gốc).

   Giữ như bản gốc: ô Tháng mặc định là getMonth() (tức THÁNG TRƯỚC — hàm đếm
   từ 0); Năm bắt buộc, Tháng để trống thì gửi -1.
   Không chuyển: nút "Dữ liệu" (bản gốc display:none !important).
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('bangtinhluongnam');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }

    var now = new Date();
    root.innerHTML =
        pat.page('Bảng tính lương', '<span data-z="report"></span>') +
        pat.filterBar([
            { key: 'thang', label: 'Tháng', value: String(now.getMonth()) },
            { key: 'nam', label: 'Năm', value: String(now.getFullYear()) },
            { key: 'loai', label: 'Chọn loại bảng lương', type: 'select' }
        ], { searchText: 'Xem' }) +
        '<div data-z="ketqua" hidden>' +
        pat.panel({ title: 'Bảng tính lương & Phụ cấp', icon: 'fa-file-invoice-dollar', flush: true, zone: 'thang',
            tools: '<b class="ums-u-fz13" data-z="kyTinh"></b>' }) +
        '<div class="ums-u-mt-4"></div>' +
        pat.panel({ title: 'Bảng tổng hợp cả năm', icon: 'fa-money-check-dollar-pen', flush: true, zone: 'nam' }) +
        '</div>';
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    ums.api.dm('NHANSU.LOAIBANGLUONG').then(function (r) {
        pat.fill(f('loai'), r, { head: 'Chọn loại bảng lương' });
    }, fail('nạp loại bảng lương'));

    function base() {
        return {
            method: 'GET',
            strNhanSu_HoSoCanBo_Id: uid(),
            strLoaiBangLuong_Id: f('loai').value,
            dNam: f('nam').value.trim(),
            strNguoiThucHien_Id: uid()
        };
    }
    function thang() { var t = f('thang').value.trim(); return t === '' ? -1 : t; }
    function goi(action, extra) {
        var o = base(); o.action = action;
        Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
        return ums.api.call(o);
    }

    /* Cây thành phần → cột lá kèm đường tổ tiên (group của ui.table) */
    function cotLa(tp) {
        var con = {};
        tp.forEach(function (x) { var c = x.THANHPHAN_CHA_ID || ''; (con[c] = con[c] || []).push(x); });
        var out = [];
        (function di(cha, path) {
            (con[cha] || []).forEach(function (x) {
                if (con[x.THANHPHAN_ID]) di(x.THANHPHAN_ID, path.concat([x.THANHPHAN_TEN]));
                else out.push({ tp: x, group: path });
            });
        })('', []);
        return out;
    }
    function soHoa(v) {
        if (v === null || v === undefined || v === '') return '';
        var s = String(v);
        if (s.indexOf('.') === 0) s = '0' + s;
        return (!isNaN(parseFloat(s)) && String(parseFloat(s)).length === s.length) ? ui.money(s) : esc(s);
    }

    /* Vẽ một bảng lương: cột cố định + cột động, ô tra theo ID dòng × THANHPHAN_ID */
    function veBang(host, cauTruc, duLieu, o) {
        var la = cotLa(cauTruc);
        var o2 = {};
        arr(duLieu.rsDuLieuLuong).forEach(function (d) { (o2[d.ID] = o2[d.ID] || {})[d.THANHPHAN_ID] = d; });
        var cols = [
            { title: o.dau, prop: o.dauProp, cls: 'is-center' },
            { title: 'Mã số', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
            { title: 'Họ tên', render: function (r) { return esc((r.NHANSU_HOSOCANBO_HO || '') + ' ' + (r.NHANSU_HOSOCANBO_TEN || '')); } }
        ].concat(la.map(function (l) {
            var id = l.tp.THANHPHAN_ID;
            return {
                title: l.tp.THANHPHAN_TEN, group: l.group, cls: 'is-right is-nowrap',
                render: function (r) {
                    var d = (o2[r.ID] || {})[id];
                    if (!d) return '';
                    var h = soHoa(d.THANHPHAN_GIATRI);
                    if (o.chiTiet && d.THANHPHAN_GIATRI !== '' && Number(d.THANHPHAN_GIATRI) !== 0 && String(l.tp.LATHANHPHANCUOI) === '0') {
                        h += ' <button type="button" class="ums-btn ums-btn--out-primary ums-btn--sm" data-ct="' + esc(r.ID) + '" data-tp="' +
                            esc(id) + '" title="Xem chi tiết lương"><i class="fa-light fa-eye"></i>Chi tiết</button>';
                    }
                    return h;
                },
                sum: o.tong ? function (rows) {
                    var t = rows.reduce(function (a, r) { var d = (o2[r.ID] || {})[id]; return a + (d ? Number(d.THANHPHAN_GIATRI) || 0 : 0); }, 0);
                    return ui.money(t);
                } : undefined
            };
        }));
        ui.table({ el: host, columns: cols, rows: arr(duLieu.rsNhanSu), empty: 'Không có dữ liệu lương', tableCls: 'ums-table--lined ums-table--tight' });
        return o2;
    }

    var oThang = {};
    function xem() {
        if (!f('nam').value.trim()) { ui.toast('Hãy nhập đủ thông tin', 'warn'); return; }
        z('ketqua').hidden = false;
        z('kyTinh').textContent = 'THÁNG ' + f('thang').value.trim() + ' NĂM ' + f('nam').value.trim();
        z('thang').innerHTML = z('nam').innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        var t = thang();
        Promise.all([goi('L_TraCuu_BangLuong/LayDanhSach', { dThang: t }), goi('L_TraCuu_BangLuong/LayDSDuLieuBangLuong', { dThang: t })])
            .then(function (x) {
                oThang = veBang(z('thang'), arr(x[0].data), x[1].data || {}, { dau: 'Tháng', dauProp: 'THANG', chiTiet: true, tong: true });
                return Promise.all([goi('L_TraCuu_BangLuongNam/LayDanhSach'), goi('L_TraCuu_BangLuongNam/LayDSDuLieuBangLuongNam')]);
            })
            .then(function (x) { veBang(z('nam'), arr(x[0].data), x[1].data || {}, { dau: 'Năm', dauProp: 'NAM' }); })
            .catch(function (err) { z('thang').innerHTML = z('nam').innerHTML = ui.fail(err.message); ums.api.handle(err, 'tra cứu bảng lương'); });
    }

    /* Hộp "Chi tiết bảng lương" — L_TraCuu_LuongThang/LayChiTiet */
    function chiTiet(rowId, tpId) {
        var d = Object.keys(oThang[rowId] || {}).map(function (k) { return oThang[rowId][k]; })[0] || {};
        var host = document.createElement('div');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        ui.dialog({ title: 'Chi tiết bảng lương', icon: 'fa-list', size: 'lg', body: host });
        ums.api.call({
            action: 'L_TraCuu_LuongThang/LayChiTiet', method: 'GET',
            strThanhPhan_Id: tpId, dNam: d.NAM, dThang: d.THANG,
            strNhanSu_HoSoCanBo_Id: d.NHANSU_HOSOCANBO_ID, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            ui.table({
                el: host, rows: arr(r.data), empty: 'Không có chi tiết', tableCls: 'ums-table--lined ums-table--tight',
                columns: [
                    { title: 'Nội dung', prop: 'THANHPHAN_GIATRI_NOIDUNG' },
                    { title: 'Số tiền', cls: 'is-right', render: function (x) { return ui.money(x.THANHPHAN_GIATRI_CHITIET); } },
                    { title: 'Ngày', prop: 'THANHPHAN_GIATRI_NGAY', cls: 'is-center is-nowrap' },
                    { title: 'Thuế TNCN', prop: 'THANHPHAN_GIATRI_THUETNCN', cls: 'is-right' },
                    { title: 'Ghi chú', prop: 'THANHPHAN_GIATRI_GHICHU' }
                ]
            });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'chi tiết bảng lương'); });
    }

    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-a="search"]')) { xem(); return; }
        var b = ev.target.closest('[data-ct]');
        if (b) chiTiet(b.getAttribute('data-ct'), b.getAttribute('data-tp'));
    });

    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strLoaiBangLuong_Id', f('loai').value);
            add('strNhanSu_QuyDinhLuong_Id', '');          // bản gốc đọc dropSearch_QuyDinh — ô không có trên màn
            add('strDaoTao_CoCauToChuc_Id', '');           // dropSearch_DonViThanhVien — không có trên màn
            add('strNhanSu_HoSoCanBo_Id', '');             // dropSearch_ThanhVien — không có trên màn
            add('dNam', f('nam').value.trim());
            add('dThang', f('thang').value.trim());
            add('strNguoiDangNhap_Id', uid());
        }
    });
})();
