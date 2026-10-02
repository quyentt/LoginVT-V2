/* =========================================================================
   Dự kiến học phần (Kế hoạch chương trình › Hoạt động) — bản của PHÒNG ĐÀO TẠO
   Bản gốc: ApisKeHoachChuongTrinh/Modules/hoatdong/html/dukienhocphan.html + script/dukienhocphan.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): bộ lọc → "Danh sách học phần dự kiến" (Xóa · Thêm học phần theo CTDT · Thêm học phần theo
   đơn vị · Lưu) → "Danh sách học khoa đề xuất" (Duyệt đề xuất của Khoa). Hai vùng "Thêm …" THAY CHỖ trang (toggle_overide
   zone-bus — không phải hộp thoại), mỗi vùng có bộ lọc + bảng + Đóng / Lưu.
   Cổng cán bộ có màn cùng tên (ApisCongCanBo/…/dukienhocphan — bản của KHOA) nhưng khác gần hết lời gọi (thêm vào bảng
   ĐỀ XUẤT, sửa thời gian, khoa xác nhận…) và khác bố cục (hộp thoại) → không dùng chung tệp; chỉ dùng chung bộ lọc
   Năm → Kế hoạch → Kế hoạch chi tiết (CCB hoatdong/_kehoach.js, ums.hd.keHoach — cùng ba lời gọi của gốc).
   Lời gọi (chép nguyên; mã hoá trừ khi ghi):
       Thời gian: KHCT_ThoiGianDaoTao/LayDanhSach (GET, kiểu cũ) → DAOTAO_THOIGIANDAOTAO
       Khoa QL / Hệ / Khoá / CT: genBoLoc_HeKhoa("_CB"/"_CT"/"_DV") → ums.ref.cascadeQuyen (theo QUYỀN)
       Danh mục KH.PHANLOAI.TINHCHAT.SOLUONG → cặp cột "Số lượng theo tính chất" (HESO3 = 1: không có ô tăng/giảm)
       THONGTIN.LayDSKH_HocPhan_DuKien          bảng dự kiến (phân trang máy chủ; strDaoTao_ThoiGianDaoTao_Id RỖNG — gốc gửi 'dropAAAA')
       Mỗi dòng × tính chất: THONGTIN.LayDSGiaTriQuyMoTheoTinhChat (dLoaiQuyMo -1) → QUYMOBANDAU (chữ), TANGGIAM (ô nhập)
       Lưu: THONGTIN.Them_KH_HocPhan_QuyMo (mỗi ô tăng/giảm đã đổi, dTangGiam)
       Xóa: KHCT_HoatDong_ThongTin/Xoa_KH_HocPhan_DuKien (kiểu cũ, KHÔNG iM — như gốc) strId = ID dòng
       KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat (kiểu cũ + iM) bảng khoa đề xuất (theo Thời gian + Hệ/Khoá/CT/Khoa QL)
       Duyệt đề xuất của Khoa: KHCT_HoatDong_ThongTin/Them_KH_HocPhan_DuKien_DX (kiểu cũ + iM) strId = ID dòng đề xuất
       Vùng "theo CTDT": THONGTIN.LayDSKH_HocPhan_CT (strDaoTao_CoCauToChuc_Id = Khoa QL, thời gian rỗng — ô không có ở html)
       Vùng "theo đơn vị": THONGTIN.LayDSKH_HocPhan_DonVi; ô Thời gian = CHUNG.LayThoiGianTheoCTDT (theo Đơn vị / Hệ / Khoá)
       Lưu ở hai vùng: THONGTIN.Them_KH_HocPhan_DuKien — strKH_Nam_ChiTiet_Id, strPhamViApDung_Id = DAOTAO_TOCHUCCHUONGTRINH_ID,
         strDaoTao_HocPhan_Id, strDaoTao_ThoiGianDaoTao_Id = ô Thời gian của BỘ LỌC CHÍNH (như gốc)

   Không chép (lỗi rõ của bản gốc):
     · html gốc KHÔNG có ô Năm / Kế hoạch / Kế hoạch chi tiết mà mã vẫn nạp và gửi strKH_Nam_ChiTiet_Id (luôn rỗng) — thêm học
       phần vào kế hoạch RỖNG. Ở đây dựng ba ô đó (như molop cùng module) và bắt chọn Kế hoạch chi tiết trước khi thêm.
     · Tiêu đề bảng dự kiến thiếu 4 cột mà thân bảng có (lệch cột): thêm "Khoa đề xuất tăng/giảm", "Duyệt tăng/giảm khoa đề xuất",
       "Khoa xác nhận", "Đào tạo xác nhận" (tên đặt theo cột TANGGIAMKHOADEXUAT, DUYETTANGGIAMKHOADEXUAT, HANHDONG_TEN,
       HANHDONG_DAOTAO_TEN — gốc không có nhãn).
     · Lưu ở vùng "theo CTDT" nạp lại bảng của vùng "theo đơn vị" → nạp lại đúng vùng. Đóng vùng thêm → nạp lại bảng dự kiến
       (gốc chỉ đổi vùng, bảng cũ còn nguyên). Duyệt đề xuất xong nạp lại CẢ bảng dự kiến.
     · Ô tăng/giảm nhận chữ bất kỳ → kiểm là số nguyên (có thể âm).
   Giữ như bản gốc: tìm không bắt chọn gì; bảng dự kiến không lọc theo Thời gian; Duyệt đề xuất không hỏi lại.
   Bỏ (không có đường vào ở html gốc): nút Xác nhận / hộp #modal_XacNhan, "Duyệt tăng/giảm" (#modal_XacNhanTG), mẫu báo cáo
   (#zonebtnBaoCao_DKHP không có) và các hộp sinh viên / học phần / quân số lớp để trống.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, H = ums.khctHd, e = H.e, esc = ui.esc;
    var root = document.getElementById('khct-dukienhocphan');
    var TT = 'KHCT_HoatDong_ThongTin_MH/', P_TT = 'PKG_KEHOACH_HOATDONG_THONGTIN.';
    function iM() { return ums.session.iM; }

    root.innerHTML =
        '<div data-v="ds">' +
            pat.page('Dự kiến học phần', '') +
            pat.filterBar([
                { key: 'nam', label: 'Chọn năm', type: 'select' }, { key: 'khn', label: 'Chọn kế hoạch', type: 'select' },
                { key: 'khct', label: 'Chọn kế hoạch chi tiết', type: 'select' }, { key: 'tg', label: 'Chọn thời gian', type: 'select' },
                { key: 'kql', label: 'Chọn khoa quản lý', type: 'select' }, { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
                { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' }, { key: 'ct', label: 'Chọn chương trình', type: 'select' },
                { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách học phần dự kiến', icon: 'fa-list-timeline', count: 'n1', flush: true, zone: 'dk', cls: 'khcthd-ds',
                tools: ui.btn('add', { text: 'Thêm học phần theo CTDT', attr: { 'data-a': 'themct' } }) +
                    ui.btn('add', { text: 'Thêm học phần theo đơn vị', attr: { 'data-a': 'themdv' } }) +
                    ui.btn('save', { attr: { 'data-a': 'luu' } }) +
                    ui.xoaChon('input[data-ck]', { goc: '.ums-panel', attr: { 'data-a': 'xoa' } }) }) +
            '<div class="ums-u-mt-4">' + pat.panel({ title: 'Danh sách học phần khoa đề xuất', icon: 'fa-list-timeline', count: 'n2', flush: true, zone: 'dx',
                tools: ui.btn('confirm', { text: 'Duyệt đề xuất của Khoa', attr: { 'data-a': 'duyet' } }) }) + '</div>' +
        '</div><div data-v="them" hidden></div>';
    var VDS = root.querySelector('[data-v="ds"]'), VTHEM = root.querySelector('[data-v="them"]');
    ui.enhance(VDS);
    function z(k) { return VDS.querySelector('[data-z="' + k + '"]'); }
    function f(k) { return VDS.querySelector('[data-f="' + k + '"]'); }
    function v(k) { return f(k).value.trim(); }
    z('dk').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    z('dx').innerHTML = ui.empty('Chọn điều kiện rồi bấm "Tìm kiếm"', 'fa-hand-pointer');
    H.danhDauHet(z('dk')); H.danhDauHet(z('dx'));
    ums.hd.keHoach({ nam: f('nam'), khn: f('khn'), khct: f('khct') });
    ums.ref.cascadeQuyen({ kql: f('kql'), he: f('he'), khoa: f('khoa'), ct: f('ct') });
    ums.api.call({ action: 'KHCT_ThoiGianDaoTao/LayDanhSach', method: 'GET', strTuKhoa: '', strDAOTAO_NAM_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
        .then(function (r) { pat.fill(f('tg'), H.arr(r.data), { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); })
        .catch(function (err) { ums.api.handle(err, 'thời gian đào tạo'); });
    var dsTC = [];
    var dmSan = ums.api.dm('KH.PHANLOAI.TINHCHAT.SOLUONG').then(function (d) { dsTC = d; }).catch(function (err) { ums.api.handle(err, 'tính chất số lượng'); });
    function locCB() { return { strDaoTao_HeDaoTao_Id: v('he'), strDaoTao_KhoaDaoTao_Id: v('khoa'), strDaoTao_ChuongTrinh_Id: v('ct'), strDaoTao_KhoaQuanLy_Id: v('kql') }; }
    var G = ['Thông tin học phần dự kiến'];
    function cotHP() {
        return [
            { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: G, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: G },
            { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: G, cls: 'is-center' }, { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', group: G },
            { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: G }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: G },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: G }, { title: 'Khối kiến thức', prop: 'KHOIKIENTHUC_TEN', group: G },
            { title: 'Định hướng', prop: 'DINHHUONG_TEN', group: G }, { title: 'Thời gian trong chương trình', prop: 'THOIGIAN', group: G, cls: 'is-center' }
        ];
    }

    /* ---------- Bảng dự kiến ------------------------------------------------ */
    var daTim = false, t1 = { index: 1, size: 10 }, t2 = { index: 1, size: 10 }, dk = [], dx = [], luotVe = 0;
    function taiDK() {
        if (!daTim) return Promise.resolve();
        z('dk').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return dmSan.then(function () {
            return ums.api.call(Object.assign({ action: TT + 'DSA4BRIKCR4JLiIRKSAvHgU0CigkLwPP', func: P_TT + 'LayDSKH_HocPhan_DuKien', strNguoiThucHien_Id: H.uid(),
                strTuKhoa: v('q'), strDaoTao_ThoiGianDaoTao_Id: '', strKH_Nam_ChiTiet_Id: v('khct'), strKH_Nam_TongHop_Id: v('khn'),
                pageIndex: t1.index, pageSize: t1.size }, locCB()));
        }).then(function (r) {
            dk = H.arr(r.data);
            var tong = Number(r.pager) || dk.length, SL = ['Số lượng theo tính chất'];
            z('n1').textContent = '(' + tong + ')';
            var cot = cotHP();
            dsTC.forEach(function (tc) {
                var coO = String(tc.HESO3) !== '1';
                cot.push({ title: e(tc.TEN), group: SL, cls: 'is-center', render: function (x, i) { return '<span data-bd="' + i + ':' + esc(tc.ID) + '"></span>'; } });
                cot.push({ title: coO ? e(tc.TEN) + '(Tăng/Giảm)' : '', group: SL, cls: 'is-center', render: function (x, i) {
                    return coO ? '<input class="ums-input ums-input--sm khcthd-o" data-tg="' + i + ':' + esc(tc.ID) + '" data-goc="" inputmode="numeric" autocomplete="off">' : ''; } });
            });
            cot = cot.concat([
                { title: 'Số lượng nhu cầu', prop: 'TONGSOLUONGBANDAU', cls: 'is-center' },
                { title: 'Số điều chỉnh(tăng/giảm)', prop: 'TONGSOLUONGTANGGIAM', cls: 'is-center' },
                { title: 'Khoa đề xuất tăng/giảm', prop: 'TANGGIAMKHOADEXUAT', cls: 'is-center' },
                { title: 'Duyệt tăng/giảm khoa đề xuất', cls: 'is-center', render: function (x) { return String(x.DUYETTANGGIAMKHOADEXUAT) === '1' ? 'Duyệt' : ''; } },
                { title: 'Tổng số dự kiến', prop: 'TONGSODUKIEN', cls: 'is-center' },
                { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                { title: 'Đề xuất từ khoa', prop: 'DEXUATTUKHOA', cls: 'is-center' },
                { title: 'Khoa xác nhận', prop: 'HANHDONG_TEN', cls: 'is-center' }, { title: 'Đào tạo xác nhận', prop: 'HANHDONG_DAOTAO_TEN', cls: 'is-center' },
                H.cotCk()
            ]);
            ui.table({ el: z('dk'), rows: dk, columns: cot, empty: 'Không có học phần dự kiến',
                page: { index: t1.index, size: t1.size, total: tong, onChange: function (p) { t1.index = p; taiDK(); }, onSize: function (s) { t1.size = s; t1.index = 1; taiDK(); } } });
            napQuyMo();
        }).catch(function (err) { z('dk').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần dự kiến'); });
    }
    function napQuyMo() {
        var viec = [], lan = ++luotVe;
        dk.forEach(function (x, i) {
            dsTC.forEach(function (tc) {
                viec.push(function () {
                    return H.goi(TT + 'DSA4BRIGKCAVMygQNDgMLhUpJC4VKC8pAikgNQPP', P_TT + 'LayDSGiaTriQuyMoTheoTinhChat', { strPhamViApDung_Id: e(x.DAOTAO_TOCHUCCHUONGTRINH_ID),
                        strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID), strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID), strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID),
                        strPhanLoai_Id: tc.ID, dLoaiQuyMo: -1 }).then(function (d) {
                        if (lan !== luotVe) return;
                        var k = i + ':' + tc.ID, bd = z('dk').querySelector('[data-bd="' + k + '"]'), o = z('dk').querySelector('[data-tg="' + k + '"]');
                        d.forEach(function (r) {
                            if (bd) bd.textContent = e(r.QUYMOBANDAU);
                            if (o) { o.value = e(r.TANGGIAM); o.setAttribute('data-goc', e(r.TANGGIAM)); }
                        });
                    });
                });
            });
        });
        H.hangDoi(viec, 6);
    }
    function taiDX() {
        if (!daTim) return Promise.resolve();
        z('dx').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return ums.api.call(Object.assign({ action: 'KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat', method: 'POST', iM: iM(), strTuKhoa: v('q'),
            strDaoTao_ThoiGianDaoTao_Id: v('tg'), strNguoiThucHien_Id: H.uid(), pageIndex: t2.index, pageSize: t2.size }, locCB())).then(function (r) {
            dx = H.arr(r.data);
            var tong = Number(r.pager) || dx.length;
            z('n2').textContent = '(' + tong + ')';
            ui.table({ el: z('dx'), rows: dx, empty: 'Không có học phần khoa đề xuất',
                page: { index: t2.index, size: t2.size, total: tong, onChange: function (p) { t2.index = p; taiDX(); }, onSize: function (s) { t2.size = s; t2.index = 1; taiDX(); } },
                columns: cotHP().concat([
                    { title: 'Người tạo', prop: 'NGUOITAO_TAIKHOAN' }, { title: 'Ngày tạo', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' },
                    { title: 'Đào tạo duyệt đề xuất', prop: 'DEXUATTUKHOA', cls: 'is-center' }, H.cotCk()
                ]) });
        }).catch(function (err) { z('dx').innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần khoa đề xuất'); });
    }
    function tim() { daTim = true; t1.index = 1; t2.index = 1; taiDK(); taiDX(); }

    /* ---------- Lưu tăng/giảm ------------------------------------------------ */
    function luu() {
        var doi = Array.prototype.filter.call(z('dk').querySelectorAll('input[data-tg]'), function (i) { return i.value.trim() !== i.getAttribute('data-goc'); });
        if (!doi.length) { ui.toast('Không có thay đổi lưu', 'info'); return; }
        var sai = doi.filter(function (i) { return i.value.trim() && !/^-?\d+$/.test(i.value.trim()); });
        if (sai.length) { sai[0].focus(); ui.toast('Số tăng/giảm phải là số nguyên (có thể âm)', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn thêm ' + doi.length + ' và hủy 0?', { title: 'Lưu' }).then(function (yes) {
            if (!yes) return;
            ui.batch(doi.map(function (i) {
                var p = i.getAttribute('data-tg').split(':'), x = dk[Number(p[0])];
                return { action: TT + 'FSkkLB4KCR4JLiIRKSAvHhA0OAwu', func: P_TT + 'Them_KH_HocPhan_QuyMo', strNguoiThucHien_Id: H.uid(),
                    strPhamViApDung_Id: e(x.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_HocPhan_Id: e(x.DAOTAO_HOCPHAN_ID), strDaoTao_ThoiGianDaoTao_Id: e(x.DAOTAO_THOIGIANDAOTAO_ID),
                    strKH_Nam_ChiTiet_Id: e(x.KH_NAM_CHITIET_ID), strPhanLoai_Id: p.slice(1).join(':'), dTangGiam: i.value.trim() };
            }), { title: 'Đang lưu', okText: 'Thực hiện thành công', show: true }).then(taiDK);
        });
    }

    /* ---------- Xóa / Duyệt đề xuất ------------------------------------------ */
    function xoa() {
        var chon = H.chon(z('dk')).map(function (i) { return dk[i]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng cần xóa?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
            if (!yes) return;
            ui.batch(chon.map(function (x) {
                return { action: 'KHCT_HoatDong_ThongTin/Xoa_KH_HocPhan_DuKien', method: 'POST', strId: x.ID, strChucNang_Id: (ums.state && ums.state.chucNangId) || '', strNguoiThucHien_Id: H.uid() };
            }), { title: 'Đang xoá', okText: 'Xóa dữ liệu thành công!', show: true }).then(taiDK);
        });
    }
    function duyet() {
        var chon = H.chon(z('dx')).map(function (i) { return dx[i]; });
        if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
        ui.batch(chon.map(function (x) {
            return { action: 'KHCT_HoatDong_ThongTin/Them_KH_HocPhan_DuKien_DX', method: 'POST', strId: x.ID, strNguoiThucHien_Id: H.uid(), iM: iM() };
        }), { title: 'Đang duyệt đề xuất', okText: 'Thực hiện thành công', show: true }).then(function () { taiDX(); taiDK(); });
    }

    /* ---------- Vùng "Thêm học phần theo CTDT / theo đơn vị" (thay chỗ trang) -- */
    function moThem(theoDV) {
        if (!v('khct')) { ui.toast('Bạn cần chọn kế hoạch chi tiết', 'warn'); return; }
        var ds = [], tr = { index: 1, size: 10 };
        VTHEM.innerHTML =
            pat.page(theoDV ? 'Thêm học phần theo đơn vị vào kế hoạch' : 'Thêm học phần theo CTDT vào kế hoạch',
                ui.btn('close', { attr: { 'data-t': 'dong' } }) + ui.btn('save', { attr: { 'data-t': 'luu' } })) +
            pat.filterBar(theoDV ? [
                { key: 'dv', label: 'Chọn đơn vị', type: 'select' }, { key: 'tg', label: 'Chọn thời gian', type: 'select' },
                { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' }, { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' },
                { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
            ] : [
                { key: 'kql', label: 'Chọn khoa quản lý', type: 'select' }, { key: 'he', label: 'Chọn hệ đào tạo', type: 'select' },
                { key: 'khoa', label: 'Chọn khóa đào tạo', type: 'select' }, { key: 'ct', label: 'Chọn chương trình', type: 'select' },
                { key: 'q', label: 'Nhập từ khóa tìm kiếm' }
            ]) +
            pat.panel({ title: 'Danh sách học phần', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang' });
        ui.swap(VDS, VTHEM);
        ui.enhance(VTHEM);
        function x(k) { return VTHEM.querySelector('[data-f="' + k + '"]'); }
        function xv(k) { return x(k) ? x(k).value.trim() : ''; }
        var bang = VTHEM.querySelector('[data-z="bang"]');
        H.danhDauHet(bang);
        if (theoDV) {
            ums.ref.coCauToChuc({ iTrangThai: 1 }).then(function (d) { pat.fill(x('dv'), d, { name: 'TEN', head: 'Chọn đơn vị' }); }).catch(function (err) { ums.api.handle(err, 'đơn vị'); });
            ums.ref.cascadeQuyen({ he: x('he'), khoa: x('khoa') });
            var napTG = function () {
                H.goi('KHCT_HoatDong_Chung_MH/DSA4FSkuKAYoIC8VKSQuAhUFFQPP', 'PKG_KEHOACH_HOATDONG_CHUNG.LayThoiGianTheoCTDT', { strTuKhoa: '', strDaoTao_CoCauToChuc_Id: xv('dv'),
                    strDaoTao_HeDaoTao_Id: xv('he'), strDaoTao_KhoaDaoTao_Id: xv('khoa'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '' })
                    .then(function (d) { pat.fill(x('tg'), d, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn thời gian' }); })
                    .catch(function (err) { ums.api.handle(err, 'thời gian'); });
            };
            if (window.jQuery) jQuery([x('he'), x('khoa')]).on('select2:select select2:clear', napTG);
        } else {
            ums.ref.cascadeQuyen({ kql: x('kql'), he: x('he'), khoa: x('khoa'), ct: x('ct') });
        }
        function tai() {
            bang.innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            var ts = { strTuKhoa: xv('q'), strDaoTao_HeDaoTao_Id: xv('he'), strDaoTao_KhoaDaoTao_Id: xv('khoa'), pageIndex: tr.index, pageSize: tr.size };
            var tong = 0;
            return (theoDV
                ? ums.api.call(Object.assign({ action: TT + 'DSA4BRIKCR4JLiIRKSAvHgUuLxco', func: P_TT + 'LayDSKH_HocPhan_DonVi', strNguoiThucHien_Id: H.uid(),
                    strDaoTao_CoCauToChuc_Id: xv('dv'), strDaoTao_ThoiGianDaoTao_Id: xv('tg'), strDaoTao_ChuongTrinh_Id: '' }, ts))
                : ums.api.call(Object.assign({ action: TT + 'DSA4BRIKCR4JLiIRKSAvHgIV', func: P_TT + 'LayDSKH_HocPhan_CT', strNguoiThucHien_Id: H.uid(),
                    strDaoTao_CoCauToChuc_Id: xv('kql'), strDaoTao_ThoiGianDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: xv('ct') }, ts))
            ).then(function (r) {
                ds = H.arr(r.data); tong = Number(r.pager) || ds.length;
                VTHEM.querySelector('[data-z="n"]').textContent = '(' + tong + ')';
                var HP = ['Thông tin học phần'], CT = ['Thông tin chương trình'];
                ui.table({ el: bang, rows: ds, empty: 'Không có học phần',
                    page: { index: tr.index, size: tr.size, total: tong, onChange: function (pg) { tr.index = pg; tai(); }, onSize: function (sz) { tr.size = sz; tr.index = 1; tai(); } },
                    columns: [
                        { title: 'Mã', prop: 'DAOTAO_HOCPHAN_MA', group: HP, cls: 'is-nowrap' }, { title: 'Tên', prop: 'DAOTAO_HOCPHAN_TEN', group: HP },
                        { title: 'Số tín chỉ', prop: 'HOCTRINHAPDUNGHOCTAP', group: HP, cls: 'is-center' }, { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', group: HP },
                        { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN', group: CT }, { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN', group: CT },
                        { title: 'Chương trình', prop: 'DAOTAO_CHUONGTRINH_TEN', group: CT }, { title: 'Số tín', prop: 'HOCTRINHAPDUNGHOCTAP', group: CT, cls: 'is-center' },
                        { title: 'Khối kiến thức', prop: 'KHOIKIENTHUC_TEN', group: CT }, { title: 'Định hướng', prop: 'DINHHUONG_TEN', group: CT },
                        H.cotCk()
                    ] });
            }).catch(function (err) { bang.innerHTML = ui.fail(err.message); ums.api.handle(err, 'học phần'); });
        }
        function luuThem() {
            var chon = H.chon(bang).map(function (i) { return ds[i]; });
            if (!chon.length) { ui.toast('Vui lòng chọn đối tượng!', 'warn'); return; }
            ui.batch(chon.map(function (r) {
                return { action: TT + 'FSkkLB4KCR4JLiIRKSAvHgU0CigkLwPP', func: P_TT + 'Them_KH_HocPhan_DuKien', strNguoiThucHien_Id: H.uid(), strKH_Nam_ChiTiet_Id: v('khct'),
                    strPhamViApDung_Id: e(r.DAOTAO_TOCHUCCHUONGTRINH_ID), strDaoTao_HocPhan_Id: e(r.DAOTAO_HOCPHAN_ID), strDaoTao_ThoiGianDaoTao_Id: v('tg') };
            }), { title: 'Đang thêm học phần', okText: 'Thực hiện thành công', show: true }).then(tai);
        }
        VTHEM.onclick = function (ev) {
            var b = ev.target.closest('[data-t], [data-a="search"]');
            if (!b) return;
            if (b.getAttribute('data-a') === 'search') { tr.index = 1; tai(); return; }
            var k = b.getAttribute('data-t');
            if (k === 'luu') luuThem();
            else if (k === 'dong') { ui.swap(VTHEM, VDS); VTHEM.innerHTML = ''; taiDK(); }
        };
        x('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tr.index = 1; tai(); } });
        tai();
    }

    VDS.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tim();
        else if (a === 'luu') luu();
        else if (a === 'xoa') xoa();
        else if (a === 'duyet') duyet();
        else if (a === 'themct') moThem(false);
        else if (a === 'themdv') moThem(true);
    });
    f('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); tim(); } });
})();
