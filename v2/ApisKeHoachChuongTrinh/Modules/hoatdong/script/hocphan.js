/* =========================================================================
   Học phần — quy mô / số tiết theo phân loại lớp (Kế hoạch chương trình › Hoạt động)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/hoatdong/html/hocphan.html + script/hocphan.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm hai hàng — hàng 1 Đơn vị + từ khoá + "Lọc theo đơn vị",
   hàng 2 Hệ / Khoá / Chương trình + từ khoá + "Lọc theo chương trình" — rồi khung "Danh sách"
   (ô Phân loại lớp, Xác nhận, Lưu quy mô) với bảng tiêu đề nhiều tầng vẽ theo phân loại lớp.
   Lời gọi (chép nguyên):
       Đơn vị: edu.system.getList_CoCauToChuc (ums.ref.coCauToChuc, trạng thái 1)
       Hệ / Khoá / CT: genBoLoc_HeKhoa("_CB") → ums.ref.cascadeQuyen (theo QUYỀN)
       Danh mục KH.PHANLOAI.HOCPHAN.LOAILOP (cột theo phân loại lớp) · KLGD.PHANLOAIXACNHAN (cột theo loại xác nhận)
       KHCT_ThongTin/LayDSKS_DaoTao_HocPhan     (kiểu cũ + iM) "Lọc theo đơn vị": strThuocBoMon_Id = Đơn vị
       KHCT_ThongTin/LayDSKS_DaoTao_HocPhan_CT  (kiểu cũ + iM) "Lọc theo chương trình": strDaoTao_ChuongTrinh_Id
       Mỗi dòng × phân loại lớp:
         KHCT_HoatDong_ThongTin/LayGiaTriKH_PhanLoai_HP_QuyMo (kiểu cũ, KHÔNG iM — gốc chú thích) dQuyMo -1 → QUYMO
         THONGTIN.LayGiaTriKH_PhanLoai_HP_SoTiet (mã hoá) → SOTIETPHANBO
         × loại xác nhận: KHCT_HoatDong_XacNhan/LayTTKH_PhanLoai_HP_XacNhan (kiểu cũ + iM) → HANHDONG_TEN
       Lưu quy mô: KHCT_HoatDong_ThongTin/Them_KH_PhanLoai_HP_QuyMo (ô có giá trị) / Xoa_KH_PhanLoai_HP_QuyMo (ô xoá trắng)
       Xác nhận: KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_XacNhan · lịch sử LayDSKH_PhanLoai_XacNhan (hộp chung _hd_chung.js)
   Khoá dữ liệu mọi ô = DAOTAO_HOCPHAN_ID (như gốc).

   Không chép (lỗi rõ của bản gốc):
     · Enter ở ô từ khoá hàng 2 gọi hàm không tồn tại (getList_HocPhan_CB) → ở đây lọc theo chương trình.
     · Lưu quy mô / xoá xong luôn nạp lại danh sách "theo đơn vị" dù đang xem "theo chương trình" → nạp lại đúng kiểu đang xem.
     · Hộp Xác nhận gốc chưa từng lưu được (đọc dòng chọn ở bảng #tblXacNhan và ô nội dung #txtNoiDungXacNhan — cả hai không tồn tại)
       → lưu theo dòng chọn của bảng danh sách và ô "Nội dung" của hộp. strDuLieuXacNhan = DAOTAO_HOCPHAN_ID (cùng khoá mà cột
       hành động đọc lại; gốc gửi cột ID). Bắt chọn "Phân loại lớp" trước (strPhanLoaiLop_Id; để trống thì bản ghi không hiện ở cột nào).
     · Đổi ô "Phân loại lớp" gốc không vẽ lại bảng tới lần tìm sau → ở đây vẽ lại ngay.
   Giữ như bản gốc: tìm không bắt chọn Đơn vị / Chương trình; mỗi ô một lời gọi (chạy hàng đợi 6 luồng thay vì bắn một lượt).
   Bỏ (không có đường vào): nút "Lưu số tiết" và "Xoá học phần" (có mã xử lý nhưng html không có nút) → cột Số tiết phân bổ CHỈ HIỆN
   (gốc cho gõ mà không có cách lưu).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.khctHd, e = H.e, esc = ui.esc;
    var root = document.getElementById('khct-hocphan');
    var TT = 'KHCT_HoatDong_ThongTin/', P_TT = 'PKG_KEHOACH_HOATDONG_THONGTIN.';
    function iM() { return ums.session.iM; }

    function oChon(key, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + key + '" data-ph="' + ph + '"><option value="">' + ph + '</option></select></div>'; }
    function oNhap(key) { return '<div class="ums-field"><input class="ums-input" data-f="' + key + '" placeholder="Nhập từ khóa tìm kiếm" autocomplete="off"></div>'; }
    function nut(a, text) { return '<div class="ums-field ums-field--fit">' + ui.btn('search', { text: text, attr: { 'data-a': a } }) + '</div>'; }

    root.innerHTML =
        pat.page('Học phần', '') +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' + oChon('dv', 'Chọn đơn vị') + oNhap('q') + nut('dv', 'Lọc theo đơn vị') + '</div>' +
            '<div class="ums-filter ums-u-mt-3">' + oChon('he', 'Chọn hệ đào tạo') + oChon('khoa', 'Chọn khóa đào tạo') + oChon('ct', 'Chọn chương trình') +
                oNhap('qct') + nut('ct', 'Lọc theo chương trình') + '</div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'ds', cls: 'khcthd-ds',
            tools: '<div class="ums-field khcthd-pl"><select class="ums-select" data-f="pl" data-ph="Chọn phân loại lớp"><option value=""></option></select></div>' +
                ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }) +
                ui.btn('save', { text: 'Lưu quy mô', attr: { 'data-a': 'luu' } }) });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k).value.trim(); }
    z('ds').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Lọc theo đơn vị" hoặc "Lọc theo chương trình"', 'fa-hand-pointer');
    H.danhDauHet(z('ds'));

    ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(f('dv'), d, { name: 'TEN', head: 'Chọn đơn vị' }); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
    ums.ref.cascadeQuyen({ he: f('he'), khoa: f('khoa'), ct: f('ct') });
    var dsPL = [], dsXN = [];
    var dmSan = Promise.all([
        ums.api.dm('KH.PHANLOAI.HOCPHAN.LOAILOP').then(function (d) { dsPL = d; pat.fill(f('pl'), d, { name: 'TEN', head: 'Chọn phân loại lớp' }); }),
        ums.api.dm('KLGD.PHANLOAIXACNHAN').then(function (d) { dsXN = d; })
    ]).catch(function (err) { ums.api.handle(err, 'danh mục phân loại'); });

    /* ---------- Danh sách ---------------------------------------------------- */
    var kieu = '', t = { index: 1, size: 10 }, rows = [], tong = 0;
    function goiDS() {
        if (kieu === 'dv') return ums.api.call({ action: 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhan', method: 'POST', iM: iM(), strTuKhoa: v('q'), strDaoTao_MonHoc_Id: '',
            strThuocBoMon_Id: v('dv'), strThuocTinhHocPhan_Id: '', strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strNguoiThucHien_Id: H.uid(),
            pageIndex: t.index, pageSize: t.size });
        return ums.api.call({ action: 'KHCT_ThongTin/LayDSKS_DaoTao_HocPhan_CT', method: 'POST', iM: iM(), strTuKhoa: v('qct'), strDaoTao_ThoiGian_KH_Id: '',
            strDaoTao_ThoiGian_TT_Id: '', strThuocTinhHocPhan_Id: '', strPhanCongPhamViDamNhiem_Id: '', strDaoTao_HocPhan_Id: '',
            strDaoTao_ChuongTrinh_Id: v('ct'), strNguoiThucHien_Id: H.uid(), pageIndex: t.index, pageSize: t.size });
    }
    function tai() {
        if (!kieu) return Promise.resolve();
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return dmSan.then(goiDS).then(function (r) {
            rows = H.arr(r.data); tong = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); });
    }
    function plXem() { var id = v('pl'); return id ? dsPL.filter(function (x) { return String(x.ID) === id; }) : dsPL; }
    function hpId(x) { return e(x.DAOTAO_HOCPHAN_ID) || e(x.ID); }
    function ve() {
        z('n').textContent = '(' + tong + ')';
        var pls = plXem(), G = ['Thông tin học phần'];
        var cot = [
            { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: G, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: G },
            { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: G, cls: 'is-center' }, { title: 'Đơn vị', prop: 'THUOCBOMON_TEN', group: G }
        ];
        pls.forEach(function (pl) {
            cot.push({ title: e(pl.TEN), group: ['Số tiết phân bổ'], cls: 'is-center', render: function (x, i) { return '<span data-st="' + i + ':' + esc(pl.ID) + '"></span>'; } });
        });
        pls.forEach(function (pl) {
            cot.push({ title: e(pl.TEN), group: ['Quy mô'], cls: 'is-center', render: function (x, i) {
                return '<input class="ums-input ums-input--sm khcthd-o" data-qm="' + i + ':' + esc(pl.ID) + '" data-goc="" inputmode="numeric" autocomplete="off">'; } });
        });
        pls.forEach(function (pl) {
            dsXN.forEach(function (xn) {
                cot.push({ title: e(xn.TEN), group: [e(pl.TEN)], cls: 'is-center', render: function (x, i) { return '<span data-hd="' + i + ':' + esc(pl.ID) + ':' + esc(xn.ID) + '"></span>'; } });
            });
        });
        cot.push(H.cotCk());
        ui.table({ el: z('ds'), rows: rows, columns: cot, empty: 'Không có học phần',
            page: { index: t.index, size: t.size, total: tong, onChange: function (p) { t.index = p; tai(); }, onSize: function (s) { t.size = s; t.index = 1; tai(); } } });
        napO(pls);
    }
    function o(sel) { return z('ds').querySelector(sel); }
    function napO(pls) {
        var viec = [], lan = ++luotVe;
        rows.forEach(function (x, i) {
            var hp = hpId(x);
            pls.forEach(function (pl) {
                var k = i + ':' + pl.ID;
                viec.push(function () {
                    return H.goi(TT + 'LayGiaTriKH_PhanLoai_HP_QuyMo', null, { method: 'POST', strPhanLoaiLop_Id: pl.ID, strDaoTao_HocPhan_Id: hp, dQuyMo: -1 }).then(function (d) {
                        var el = o('[data-qm="' + k + '"]'); if (lan !== luotVe || !el) return;
                        d.forEach(function (r) { el.value = e(r.QUYMO); el.setAttribute('data-goc', e(r.QUYMO)); });
                    });
                });
                viec.push(function () {
                    return H.goi('KHCT_HoatDong_ThongTin_MH/DSA4BiggFTMoCgkeESkgLw0uICgeCREeEi4VKCQ1', P_TT + 'LayGiaTriKH_PhanLoai_HP_SoTiet', { strPhanLoaiLop_Id: pl.ID, strDaoTao_HocPhan_Id: hp }).then(function (d) {
                        var el = o('[data-st="' + k + '"]'); if (lan !== luotVe || !el) return;
                        d.forEach(function (r) { el.textContent = e(r.SOTIETPHANBO); });
                    });
                });
                dsXN.forEach(function (xn) {
                    viec.push(function () {
                        return H.goi('KHCT_HoatDong_XacNhan/LayTTKH_PhanLoai_HP_XacNhan', null, { method: 'POST', strLoaiXacNhan_Id: xn.ID, strPhanLoaiLop_Id: pl.ID,
                            strDuLieuXacNhan: hp, iM: iM() }).then(function (d) {
                            var el = o('[data-hd="' + k + ':' + xn.ID + '"]'); if (lan !== luotVe || !el) return;
                            d.forEach(function (r) { el.textContent = e(r.HANHDONG_TEN); });
                        });
                    });
                });
            });
        });
        H.hangDoi(viec, 6);
    }
    var luotVe = 0;
    function tim(k) { kieu = k; t.index = 1; tai(); }

    /* ---------- Lưu quy mô --------------------------------------------------- */
    function luu() {
        var doi = Array.prototype.filter.call(z('ds').querySelectorAll('input[data-qm]'), function (i) { return i.value.trim() !== i.getAttribute('data-goc'); });
        if (!doi.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
        var sai = doi.filter(function (i) { return i.value.trim() && !/^\d+(\.\d+)?$/.test(i.value.trim()); });
        if (sai.length) { sai[0].focus(); ui.toast('Quy mô phải là số', 'warn'); return; }
        var them = doi.filter(function (i) { return i.value.trim(); }), xoa = doi.filter(function (i) { return !i.value.trim(); });
        ui.confirm('Bạn có chắc chắn thêm ' + them.length + ' và hủy ' + xoa.length + '?', { title: 'Lưu quy mô' }).then(function (yes) {
            if (!yes) return;
            function ts(i) { var p = i.getAttribute('data-qm').split(':'); return { hp: hpId(rows[Number(p[0])]), pl: p.slice(1).join(':') }; }
            var calls = them.map(function (i) { var k = ts(i);
                return { action: TT + 'Them_KH_PhanLoai_HP_QuyMo', method: 'POST', strPhanLoaiLop_Id: k.pl, strDaoTao_HocPhan_Id: k.hp, dQuyMo: i.value.trim(), strNguoiThucHien_Id: H.uid(), iM: iM() };
            }).concat(xoa.map(function (i) { var k = ts(i);
                return { action: TT + 'Xoa_KH_PhanLoai_HP_QuyMo', method: 'POST', strPhanLoaiLop_Id: k.pl, strDaoTao_HocPhan_Id: k.hp, strNguoiThucHien_Id: H.uid(), iM: iM() };
            }));
            ui.batch(calls, { title: 'Đang lưu quy mô', okText: 'Thực hiện thành công', show: true }).then(tai);
        });
    }

    /* ---------- Xác nhận ----------------------------------------------------- */
    function xacNhan() {
        var chon = H.chon(z('ds')).map(function (i) { return rows[i]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var pl = v('pl');
        if (!pl) { ui.toast('Chọn phân loại lớp cần xác nhận', 'warn'); f('pl').focus(); return; }
        var ids = chon.map(hpId);
        H.xacNhan({ ids: ids, lichSu: 'KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_XacNhan', onDone: tai,
            luu: function (loai, hd, noiDung) {
                return ids.map(function (id) {
                    return { action: 'KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_XacNhan', method: 'POST', strLoaiXacNhan_Id: loai, strHanhDong_Id: hd,
                        strNguoiXacNhan_Id: H.uid(), strThongTinXacNhan: noiDung, strDuLieuXacNhan: id, strPhanLoaiLop_Id: pl, strNguoiThucHien_Id: H.uid(), iM: iM() };
                });
            } });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'dv' || a === 'ct') tim(a);
        else if (a === 'luu') luu();
        else if (a === 'xacnhan') xacNhan();
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim('dv'); } });
    f('qct').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim('ct'); } });
    if (window.jQuery) jQuery(f('pl')).on('select2:select select2:clear', function () { if (kieu && rows.length) ve(); });
})();
