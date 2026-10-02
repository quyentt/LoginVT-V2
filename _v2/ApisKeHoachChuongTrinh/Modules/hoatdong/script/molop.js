/* =========================================================================
   Mở lớp — quy mô mở lớp theo phân loại lớp (Kế hoạch chương trình › Hoạt động)
   Bản gốc: ApisKeHoachChuongTrinh/Modules/hoatdong/html/molop.html + script/molop.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): khung tìm (Năm → Kế hoạch → Kế hoạch chi tiết, Khoa QL / Hệ / Khoá / CT, từ khoá,
   Tìm kiếm + nút mẫu báo cáo) rồi khung "Danh sách" (ô Phân loại lớp, "Thực hiện tính lớp mở theo quy mô",
   "Lấy quy mô từ CSDL Học phần", Xác nhận, Lưu quy mô) với bảng tiêu đề nhiều tầng vẽ theo phân loại lớp.
   Lời gọi (chép nguyên; mã hoá trừ khi ghi):
       Năm / Kế hoạch năm / Kế hoạch chi tiết: CCB hoatdong/_kehoach.js (ums.hd.keHoach — cùng ba lời gọi của gốc)
       Khoa QL / Hệ / Khoá / CT: genBoLoc_HeKhoa("_CB") → ums.ref.cascadeQuyen (theo QUYỀN)
       Danh mục KH.PHANLOAI.HOCPHAN.LOAILOP (cột theo phân loại lớp) · KLGD.PHANLOAIXACNHAN (cột theo loại xác nhận)
       THONGTIN.LayDSKH_HocPhan_DuKien_XNML       danh sách (phân trang máy chủ; strDaoTao_ThoiGianDaoTao_Id rỗng như gốc)
       Mỗi dòng × phân loại lớp: THONGTIN.LayGiaTriKH_PL_MoLop_TH_SL → QUYMO (ô nhập), SOLUONG (cột SL)
         × loại xác nhận: XACNHAN.LayTTKH_PhanLoai_MoLop_XacNhan → HANHDONG_TEN
       Lưu quy mô: THONGTIN.Them_KH_PhanLoai_MoLop_QuyMo (mỗi ô đã đổi)
       TINHTOAN.TinhLopMoTheoQuyMo · TINHTOAN.LayQuyMoTuCSDLHocPhan (tham số = bộ lọc; thời gian rỗng — ô bị chú thích ở html gốc)
       Xác nhận: KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_MoLop_XacNhan (kiểu cũ + iM) · lịch sử LayDSKH_PhanLoai_MoLop_XacNhan
       Mẫu báo cáo (zonebtnBaoCao_ML): Hệ / Khoá / CT / Khoa QL, KH chi tiết, KH năm, strDaoTao_ThoiGianDaoTao_Id = ID NĂM
       (gốc gửi như vậy — giữ), strTuKhoa.

   Không chép (lỗi rõ của bản gốc):
     · Cột hành động xác nhận chưa từng hiện: lời gọi xong đọc biến không tồn tại (strDaoTao_HocPhan_Id → ReferenceError),
       và mọi cột loại xác nhận cùng trỏ loại ĐẦU (gán nhầm "=" thay "=="). Ở đây mỗi cột đúng loại của nó.
     · Mỗi lời gọi nạp quy mô xong lại gọi start_Progress → nạp lại cả danh sách → bỏ.
     · Xác nhận đọc ô nội dung #txtNoiDungXacNhan không tồn tại → luôn rỗng; ở đây đọc ô "Nội dung" của hộp.
       Lịch sử xác nhận gửi strDuLieuXacNhan = DAOTAO_HOCPHAN_ID (cùng khoá mà lời lưu gửi; gốc gửi ID dòng — lệch nhau).
       Bắt chọn "Phân loại lớp" trước (strPhanLoaiLop_Id của bản ghi xác nhận).
     · Đổi ô "Phân loại lớp" gốc không vẽ lại bảng tới lần tìm sau → vẽ lại ngay.
     · "Tính lớp mở" / "Lấy quy mô" xong gốc không nạp lại → nạp lại danh sách để thấy kết quả.
   Giữ như bản gốc: tìm không bắt chọn kế hoạch; mỗi ô một lời gọi (hàng đợi 6 luồng).
   Bỏ (không có đường vào): "Xoá học phần" (có mã, html không có nút).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.khctHd, e = H.e, esc = ui.esc;
    var root = document.getElementById('khct-molop');
    var TT = 'KHCT_HoatDong_ThongTin_MH/', XN = 'KHCT_HoatDong_XacNhan_MH/', TO = 'KHCT_HoatDong_TinhToan_MH/';
    var P_TT = 'PKG_KEHOACH_HOATDONG_THONGTIN.', P_XN = 'PKG_KEHOACH_HOATDONG_XACNHAN.', P_TO = 'PKG_KEHOACH_HOATDONG_TINHTOAN.';
    function iM() { return ums.session.iM; }

    root.innerHTML =
        pat.page('Mở lớp', '<div data-z="bc"></div>') +
        pat.filterBar([
            { key: 'nam', label: 'Chọn năm', type: 'select' }, { key: 'khn', label: 'Chọn kế hoạch', type: 'select' },
            { key: 'khct', label: 'Chọn kế hoạch chi tiết', type: 'select' }, { key: 'kql', label: 'Chọn khoa quản lý', type: 'select' },
            { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' }, { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' },
            { key: 'ct', label: 'Chọn chương trình', type: 'select' }, { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
        ]) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'ds', cls: 'khcthd-ds',
            tools: '<div class="ums-field khcthd-pl"><select class="ums-select" data-f="pl" data-ph="Chọn phân loại lớp"><option value=""></option></select></div>' +
                ui.btn('save', { text: 'Thực hiện tính lớp mở theo quy mô', icon: 'fa-chalkboard-user', mod: 'out-warn', attr: { 'data-a': 'tinh' } }) +
                ui.btn('save', { text: 'Lấy quy mô từ CSDL Học phần', icon: 'fa-book-open-reader', mod: 'out-info', attr: { 'data-a': 'layqm' } }) +
                ui.btn('confirm', { attr: { 'data-a': 'xacnhan' } }) +
                ui.btn('save', { text: 'Lưu quy mô', attr: { 'data-a': 'luu' } }) });
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k).value.trim(); }
    z('ds').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    H.danhDauHet(z('ds'));
    ums.hd.keHoach({ nam: f('nam'), khn: f('khn'), khct: f('khct') });
    ums.ref.cascadeQuyen({ kql: f('kql'), he: f('he'), khoa: f('khoa'), ct: f('ct') });
    var dsPL = [], dsXN = [];
    var dmSan = Promise.all([
        ums.api.dm('KH.PHANLOAI.HOCPHAN.LOAILOP').then(function (d) { dsPL = d; pat.fill(f('pl'), d, { name: 'TEN', head: 'Chọn phân loại lớp' }); }),
        ums.api.dm('KLGD.PHANLOAIXACNHAN').then(function (d) { dsXN = d; })
    ]).catch(function (err) { ums.api.handle(err, 'danh mục phân loại'); });
    function loc() {
        return { strTuKhoa: v('q'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'),
            strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql'), strKH_Nam_ChiTiet_Id: v('khct'), strKH_Nam_TongHop_Id: v('khn') };
    }

    /* ---------- Danh sách ---------------------------------------------------- */
    var daTim = false, t = { index: 1, size: 10 }, rows = [], tong = 0, luotVe = 0;
    function tai() {
        if (!daTim) return Promise.resolve();
        z('ds').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return dmSan.then(function () {
            return ums.api.call(Object.assign({ action: TT + 'DSA4BRIKCR4JLiIRKSAvHgU0CigkLx4ZDwwN', func: P_TT + 'LayDSKH_HocPhan_DuKien_XNML',
                strNguoiThucHien_Id: H.uid(), pageIndex: t.index, pageSize: t.size }, loc()));
        }).then(function (r) {
            rows = H.arr(r.data); tong = Number(r.pager) || rows.length;
            ve();
        }).catch(function (err) { z('ds').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách mở lớp'); });
    }
    function plXem() { var id = v('pl'); return id ? dsPL.filter(function (x) { return String(x.ID) === id; }) : dsPL; }
    function ve() {
        z('n').textContent = '(' + tong + ')';
        var pls = plXem(), G = ['Thông tin học phần'];
        var cot = [
            { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: G, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: G },
            { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: G, cls: 'is-center' }, { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: G },
            { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: G }, { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: G },
            { title: 'Khoa quản lý', prop: 'DAOTAP_KHOAQUANLY_TEN', group: G },
            { title: 'Tổng nhu cầu học', prop: 'TONGSODUKIEN', cls: 'is-center' }
        ];
        pls.forEach(function (pl) {
            cot.push({ title: e(pl.TEN), group: ['Quy mô'], cls: 'is-center', render: function (x, i) {
                return '<input class="ums-input ums-input--sm khcthd-o" data-qm="' + i + ':' + esc(pl.ID) + '" data-goc="" inputmode="numeric" autocomplete="off">'; } });
            cot.push({ title: 'SL', group: ['Quy mô'], cls: 'is-center', render: function (x, i) { return '<span data-sl="' + i + ':' + esc(pl.ID) + '"></span>'; } });
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
            pls.forEach(function (pl) {
                var k = i + ':' + pl.ID;
                viec.push(function () {
                    return H.goi(TT + 'DSA4BiggFTMoCgkeEQ0eDC4NLjEeFQkeEg0P', P_TT + 'LayGiaTriKH_PL_MoLop_TH_SL', { strPhanLoaiLop_Id: pl.ID, strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID),
                        strKh_Kehoach_HP_Dk_Th_Id: e(x.ID), strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID), strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID) }).then(function (d) {
                        if (lan !== luotVe) return;
                        var el = o('[data-qm="' + k + '"]'), sl = o('[data-sl="' + k + '"]');
                        d.forEach(function (r) {
                            if (el) { el.value = e(r.QUYMO); el.setAttribute('data-goc', e(r.QUYMO)); }
                            if (sl) sl.textContent = e(r.SOLUONG);
                        });
                    });
                });
                dsXN.forEach(function (xn) {
                    viec.push(function () {
                        return H.goi(XN + 'DSA4FRUKCR4RKSAvDS4gKB4MLg0uMR4ZICIPKSAv', P_XN + 'LayTTKH_PhanLoai_MoLop_XacNhan', { strLoaiXacNhan_Id: xn.ID, strPhanLoaiLop_Id: pl.ID,
                            strDuLieuXacNhan: e(x.DAOTAO_HOCPHAN_ID), strPhamViApDung_Id: e(x.DAOTAO_TOCHUCCHUONGTRINH_ID), strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID),
                            strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID) }).then(function (d) {
                            var el = o('[data-hd="' + k + ':' + xn.ID + '"]'); if (lan !== luotVe || !el) return;
                            d.forEach(function (r) { el.textContent = e(r.HANHDONG_TEN); });
                        });
                    });
                });
            });
        });
        H.hangDoi(viec, 6);
    }
    function tim() { daTim = true; t.index = 1; tai(); }

    /* ---------- Lưu quy mô --------------------------------------------------- */
    function luu() {
        var doi = Array.prototype.filter.call(z('ds').querySelectorAll('input[data-qm]'), function (i) { return i.value.trim() !== i.getAttribute('data-goc'); });
        if (!doi.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
        var sai = doi.filter(function (i) { return i.value.trim() && !/^\d+(\.\d+)?$/.test(i.value.trim()); });
        if (sai.length) { sai[0].focus(); ui.toast('Quy mô phải là số', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn thêm ' + doi.length + ' và hủy 0?', { title: 'Lưu quy mô' }).then(function (yes) {
            if (!yes) return;
            ui.batch(doi.map(function (i) {
                var p = i.getAttribute('data-qm').split(':'), x = rows[Number(p[0])];
                return { action: TT + 'FSkkLB4KCR4RKSAvDS4gKB4MLg0uMR4QNDgMLgPP', func: P_TT + 'Them_KH_PhanLoai_MoLop_QuyMo', strNguoiThucHien_Id: H.uid(),
                    strPhanLoaiLop_Id: p.slice(1).join(':'), strPhamViApDung_Id: e(x.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID),
                    strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID), strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID), dQuyMo: i.value.trim() };
            }), { title: 'Đang lưu quy mô', okText: 'Thực hiện thành công', show: true }).then(tai);
        });
    }

    /* ---------- Tính lớp mở / Lấy quy mô ------------------------------------- */
    function tinhToan(action, func, ten) {
        ui.confirm('Bạn có chắc chắn thực hiện không?', { title: ten }).then(function (yes) {
            if (!yes) return;
            ums.api.call(Object.assign({ action: action, func: func, strNguoiThucHien_Id: H.uid() }, loc()))
                .then(function () { ui.toast('Thực hiện thành công', 'ok'); tai(); })
                .catch(function (err) { ums.api.handle(err, ten); });
        });
    }

    /* ---------- Xác nhận ----------------------------------------------------- */
    function xacNhan() {
        var chon = H.chon(z('ds')).map(function (i) { return rows[i]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        var pl = v('pl');
        if (!pl) { ui.toast('Chọn phân loại lớp cần xác nhận', 'warn'); return; }
        H.xacNhan({ ids: chon.map(function (x) { return e(x.DAOTAO_HOCPHAN_ID); }), lichSu: 'KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_MoLop_XacNhan', onDone: tai,
            luu: function (loai, hd, noiDung) {
                return chon.map(function (x) {
                    return { action: 'KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_MoLop_XacNhan', method: 'POST', strLoaiXacNhan_Id: loai, strHanhDong_Id: hd,
                        strNguoiXacNhan_Id: H.uid(), strThongTinXacNhan: noiDung, strDuLieuXacNhan: e(x.DAOTAO_HOCPHAN_ID), strPhanLoaiLop_Id: pl,
                        strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID), strPhamViApDung_Id: e(x.DAOTAO_TOCHUCCHUONGTRINH_ID),
                        strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID), strNguoiThucHien_Id: H.uid(), iM: iM() };
                });
            } });
    }

    ums.report.mount(z('bc'), { collect: function (add) {
        add('strDaoTao_HeDaoTao_Id', v('he')); add('strDaoTao_KhoaDaoTao_Id', v('khoa')); add('strDaoTao_ChuongTrinh_Id', v('ct'));
        add('strDaoTao_KhoaQuanLy_Id', v('kql')); add('strKH_Nam_ChiTiet_Id', v('khct')); add('strKH_Nam_TongHop_Id', v('khn'));
        add('strDaoTao_ThoiGianDaoTao_Id', v('nam')); add('strTuKhoa', v('q'));
    } });
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'luu') luu();
        else if (a === 'xacnhan') xacNhan();
        else if (a === 'tinh') tinhToan(TO + 'FSgvKQ0uMQwuFSkkLhA0OAwu', P_TO + 'TinhLopMoTheoQuyMo', 'Thực hiện tính lớp mở theo quy mô');
        else if (a === 'layqm') tinhToan(TO + 'DSA4EDQ4DC4VNAISBQ0JLiIRKSAv', P_TO + 'LayQuyMoTuCSDLHocPhan', 'Lấy quy mô từ CSDL Học phần');
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
    if (window.jQuery) jQuery(f('pl')).on('select2:select select2:clear', function () { if (daTim && rows.length) ve(); });
})();
