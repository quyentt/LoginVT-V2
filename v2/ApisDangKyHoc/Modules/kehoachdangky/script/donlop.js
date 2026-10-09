/* =========================================================================
   Dồn lớp (dồn sinh viên đã đăng ký từ một lớp học phần sang lớp cuối)
   Bản gốc: ApisDangKyHoc/Modules/kehoachdangky/html/donlop.html + script/donlop.js
   ---------------------------------------------------------------------------
   Bố cục bản gốc (một cột): nút "Tạo danh sách nhập điểm" → khung tìm kiếm — Thời gian ·
   Hệ · Khoá · Khoa quản lý / Chương trình · Học phần (đều CHỌN NHIỀU) · "Chỉ hiện các lớp
   chưa phân công" · "Lọc theo học phần mở theo chương trình" / Số đã đăng ký từ số · đến số
   · Tìm kiếm · Xuất báo cáo / "Chọn trạng thái sinh viên" → bảng lớp học phần: Mã lớp ·
   Tên lớp · Thông tin lịch · Đã phân công ("Chi tiết" → hộp Danh sách phạm vi) · Số sv đã
   đăng ký (bấm → hộp Danh sách sinh viên) · Số sv dự kiến · "Dồn lớp" · ô đánh dấu.
   Bấm "Dồn lớp" → vùng dồn lớp THAY CHỖ danh sách, HAI CỘT như gốc: trái = sinh viên đã
   đăng ký lớp đang dồn (ô đánh dấu, nút Xóa = hủy đăng ký); phải = ô "Chọn lớp cuối" +
   sinh viên của lớp cuối. Nút "Dồn lớp" chuyển các sinh viên đã đánh dấu sang lớp cuối.

   Lời gọi (chép nguyên; kiểu cũ không mã hoá trừ LayDSLopHocPhan; gốc để 'type' trong dữ liệu):
       DKH_Chung/LayThoiGianDangKyHoc                  GET  ô Thời gian
       KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen         GET  ô Hệ (bản THEO QUYỀN như gốc)
       DKH_PhanCong_LopHP/LayDSKhoaToChuc              GET  ô Khoá (Hệ + Thời gian; đổi Thời gian: chỉ Thời gian)
       DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc       GET  ô Chương trình
       DKH_PhanCong_LopHP/LayDSHocPhan                 GET  ô Học phần (TEN - MA)
       edu.system.getList_KhoaQuanLy                   = ums.ref.khoaQuanLy
       DKH_ThongTin_MH/DSA4BRINLjEJLiIRKSAv · pkg_dangkyhoc_thongtin.LayDSLopHocPhan
                                                       POST danh sách lớp (phân trang máy chủ, 10 dòng)
       DKH_PhanCong_LopHP/LayDanhSach                  GET  hộp phạm vi (strDangKy_LopHocPhan_Id)
       DKH_PhanCong_LopHP/LayDSDangKyHoc               GET  hộp sinh viên / bảng trái / bảng phải
       DKH_PhanCong_LopHP/LayDSLopHocPhan              POST ô "Chọn lớp cuối" (bỏ lớp đang dồn)
       DKH_DangKy/ThucHienDonLopDangKyHoc              POST dồn từng sinh viên đã đánh dấu
       DKH_DangKy/ThucHienHuyDangKyHocHocPhan          POST Xóa = hủy đăng ký từng sinh viên
       D_PhanQuyen/TaoDuLieuNhapDiem                   POST "Tạo danh sách nhập điểm" cho từng lớp đánh dấu
   Báo cáo: ums.report.mount (= getList_MauImport "zonebtnBaoCao_DonLop"; html gốc KHÔNG có
   vùng _Import → import: false). collect() thêm đúng các khoá gốc thêm: strDaoTao_ThoiGianDaoTao_Id,
   strDaoTao_KhoaDaoTao_Id, strDaoTao_ChuongTrinh_Id, strDaoTao_HocPhan_Id, mỗi lớp đánh dấu một
   strDangKy_LopHocPhan_Id, mỗi trạng thái đánh dấu một strTrangThaiNguoiHoc_Id.

   Khác bản gốc:
     · Hệ → Khoá → Chương trình: chưa chọn tầng trên thì KHOÁ tầng dưới, đổi / bỏ tầng trên thì
       xoá trắng tầng dưới (luật chung 2026-09-21). Học phần nhiều cha (Thời gian, Khoá, CT) là
       lọc tuỳ chọn — không khoá.
     · Đổi Thời gian: gốc nạp lại Hệ rồi đặt Hệ về rỗng → ở đây xoá trắng Hệ/Khoá/CT như vậy.
       Gốc còn gọi me.resetCombobox (hàm KHÔNG có trong DonLop → TypeError sau mỗi lần chọn ô
       lọc, các lời gọi trước đó vẫn chạy) — bỏ.
     · Hộp "Danh sách phạm vi": gốc gửi pageIndex/pageSize mặc định của hệ (trang đang xem của
       danh sách lớp, 10 dòng) → ở đây pageIndex 1, pageSize 1000000 như hộp sinh viên bên cạnh
       (giống cách đã làm ở ApisTaiChinh lophocphan). Nút "Xóa" trong hộp: gốc KHÔNG có xử lý
       (#btnDelete_PhamVi không được gắn sự kiện) → giữ nút, khoá.
     · "Dồn lớp" khi chưa chọn lớp cuối: gốc vẫn gửi strDangKy_LopHocPhan_Moi_Ids rỗng → ở đây báo
       "Vui lòng chọn lớp cuối" và dừng.
     · Đóng vùng dồn lớp: gốc gọi getList_DonLop() không tham số → TypeError, danh sách lớp không
       nạp lại → ở đây nạp lại danh sách (ý định của toggle_form).
     · Sau khi dồn, gốc tô hồng các dòng ở bảng phải có id = ID dòng đăng ký CŨ (sau khi dồn thường
       đã đổi) → ở đây tô theo QLSV_NGUOIHOC_ID của sinh viên vừa dồn.
     · Mở vùng dồn lớp: bảng phải về lời nhắc (gốc còn để bảng của lần mở trước).
   Lỗi bản gốc: genList_TrangThaiSV khai trùng tên (bản sau thắng — dùng bản sau); hai nút cùng
   id #btnDeleteLopHocPhan (đã được chú thích bỏ trong html gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, L = ums.dkhLop, e = L.e, esc = ui.esc;
    var root = document.getElementById('dkh-donlop');
    if (!root) return;

    function sel(k, ph) { return '<div class="ums-field"><select class="ums-select" data-f="' + k + '" data-ph="' + ph + '" multiple></select></div>'; }
    root.innerHTML =
        '<div data-z="ds">' +
        pat.page('Dồn lớp', ui.btn('add', { text: 'Tạo danh sách nhập điểm', attr: { 'data-a': 'taods' } })) +
        pat.panel({ title: false, cls: 'ums-u-mb-4', body:
            '<div class="ums-filter">' +
                sel('tg', 'Chọn học kỳ') + sel('he', 'Tất cả hệ đào tạo') + sel('khoa', 'Tất cả khóa đào tạo') + sel('kql', 'Tất cả khoa quản lý') +
            '</div><div class="ums-filter ums-u-mt-4">' +
                sel('ct', 'Tất cả chương trình đào tạo') + sel('hp', 'Chọn học phần') +
                '<div class="ums-field"><label class="ums-check ums-lop-ck"><input type="checkbox" data-f="chuaPC"> Chỉ hiện các lớp chưa phân công</label></div>' +
                '<div class="ums-field"><label class="ums-check ums-lop-ck"><input type="checkbox" data-f="locCT"> Lọc theo học phần mở theo chương trình</label></div>' +
            '</div><div class="ums-filter ums-u-mt-4">' +
                '<div class="ums-field"><input class="ums-input" data-f="tuSo" placeholder="Số đã đăng ký (từ số)" inputmode="numeric" autocomplete="off"></div>' +
                '<div class="ums-field"><input class="ums-input" data-f="denSo" placeholder="Số đã đăng ký (đến số)" inputmode="numeric" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-a': 'search' } }) + '</div>' +
                '<div class="ums-field ums-field--fit" data-z="bc"></div>' +
            '</div>' +
            '<div class="ums-legend ums-legend--cach ums-u-mb-2">Chọn trạng thái sinh viên</div>' +
            '<div data-z="tt"></div>' }) +
        pat.panel({ title: 'Danh sách', icon: 'fa-list-timeline', count: 'n', flush: true, zone: 'bang',
            body: ui.empty('Chọn điều kiện rồi bấm Tìm kiếm', 'fa-filter') }) +
        '</div>' +
        /* Vùng dồn lớp — thay chỗ danh sách */
        '<div data-z="don" hidden>' +
        pat.panel({ title: 'Thêm mới - ', icon: 'fa-plus',
            tools: ui.btn('close', { attr: { 'data-a': 'dong' } }) +
                ui.btn('save', { text: 'Dồn lớp', icon: 'fa-people-arrows', mod: 'primary', attr: { 'data-a': 'don' } }),
            body: '<div class="ums-grid ums-grid--2">' +
                '<div data-z="trai">' +
                    '<div class="ums-legend ums-u-mb-2">Thông tin lớp học phần cần dồn</div>' +
                    '<div data-z="bTrai"></div>' +
                    '<div class="ums-tablefoot ums-lop-phai">' + ui.xoaChon('input[data-lck="dk"]', { goc: '[data-z="trai"]', text: 'Xóa', attr: { 'data-a': 'huy' } }) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div class="ums-legend ums-u-mb-2">Thông tin lớp học phần cần dồn</div>' +
                    '<div class="ums-field ums-u-mb-4"><select class="ums-select" data-f="lopCuoi"><option value="">Chọn lớp cuối</option></select></div>' +
                    '<div data-z="bPhai"></div>' +
                '</div>' +
            '</div>' }) +
        '</div>';

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var F = {};
    ['tg', 'he', 'khoa', 'kql', 'ct', 'hp'].forEach(function (k) { F[k] = f(k); L.s2multi(F[k]); });
    ui.enhance(root);
    L.ganChonTatCa(root);
    function m(k) { return L.multi(F[k]); }

    /* ---------- Nguồn lọc ---------- */
    function napHe() {
        return L.rows({ action: 'KHCT_ThongTin/LayDSDaoTao_HeDaoTaoQuyen', method: 'GET', type: 'GET',
            strTuKhoa: '', strDaoTao_KhoaQuanLy_Id: '', strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
            strNguoiThucHien_Id: '', strChucNang_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) { L.fillMulti(F.he, r, { name: 'TENHEDAOTAO' }); }, L.fail('nạp hệ đào tạo'));
    }
    function napKhoa(chiThoiGian) {
        var o = { action: 'DKH_PhanCong_LopHP/LayDSKhoaToChuc', method: 'GET', type: 'GET' };
        if (!chiThoiGian) o.strDaoTao_HeDaoTao_Id = m('he');   // getList_KhoaDaoTao; getList_KhoaToChuc chỉ gửi Thời gian
        o.strDaoTao_ThoiGianDaoTao_Id = m('tg');
        return L.rows(o).then(function (r) { L.fillMulti(F.khoa, r, { name: 'TENKHOA' }); }, L.fail('nạp khóa đào tạo'));
    }
    function napCT() {
        return L.rows({ action: 'DKH_PhanCong_LopHP/LayDSChuongTrinhToChuc', method: 'GET', type: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'), strDaoTao_KhoaDaoTao_Id: m('khoa'),
            strDaoTao_HeDaoTao_Id: m('he'), strDaoTao_KhoaQuanLy_Id: m('kql') })
            .then(function (r) { L.fillMulti(F.ct, r, { name: 'TENCHUONGTRINH' }); }, L.fail('nạp chương trình'));
    }
    function napHP() {
        return L.rows({ action: 'DKH_PhanCong_LopHP/LayDSHocPhan', method: 'GET',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'), strDaoTao_KhoaDaoTao_Id: m('khoa'), strDaoTao_ChuongTrinh_Id: m('ct') })
            .then(function (r) { L.fillMulti(F.hp, r, { name: function (x) { return e(x.TEN) + ' - ' + e(x.MA); } }); }, L.fail('nạp học phần'));
    }

    napHe(); napKhoa(); napCT();
    ums.ref.khoaQuanLy().then(function (r) { L.fillMulti(F.kql, r, { name: 'TEN' }); }, L.fail('nạp khoa quản lý'));
    L.rows({ action: 'DKH_Chung/LayThoiGianDangKyHoc', method: 'GET', type: 'GET', strNguoiThucHien_Id: '' })
        .then(function (r) { L.fillMulti(F.tg, r, { name: 'DAOTAO_THOIGIANDAOTAO' }); }, L.fail('nạp thời gian'));

    /* 'change' bắt cả chọn, bỏ chọn, và nút × của dòng tóm tắt ô chọn nhiều */
    function on(el, fn) { jQuery(el).on('change', fn); }
    on(F.tg, function () { napHe(); napKhoa(true); napHP(); tai(1); });
    on(F.he, function () { napKhoa().then(napCT); napHP(); });
    on(F.khoa, function () { napCT(); napHP(); });
    on(F.ct, function () { napHP(); });
    on(F.kql, function () { napCT(); napHP(); });
    on(F.hp, function () { tai(1); });
    pat.chain([F.he, F.khoa, F.ct], { phatLai: false });

    var tt = L.trangThai(z('tt'));

    /* ---------- Danh sách lớp học phần ---------- */
    var st = { trang: 1, co: 10, rows: [], token: 0 };
    function so(k) { var v = f(k).value.trim(); return v ? v : -1; }
    function tai(p) {
        if (p) st.trang = p;
        var my = ++st.token;
        z('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        ums.api.call({
            action: 'DKH_ThongTin_MH/DSA4BRINLjEJLiIRKSAv',
            func: 'pkg_dangkyhoc_thongtin.LayDSLopHocPhan',
            strTuKhoa: '',
            strDaoTao_ThoiGianDaoTao_Id: m('tg'),
            strDaoTao_HocPhan_Id: m('hp'),
            strNguoiThucHien_Id: '',
            pageIndex: st.trang,
            pageSize: st.co,
            strDangKy_KeHoachDangKy_Id: '',
            dLocGanTheoCTDT: f('locCT').checked ? 1 : 0,
            dChiLayCacLopChuaPhanCong: f('chuaPC').checked ? 1 : 0,
            strDaoTao_KhoaDaoTao_Id: m('khoa'),
            strDaoTao_ChuongTrinh_Id: m('ct'),
            strDaoTao_HeDaoTao_Id: m('he'),
            strDaoTao_KhoaQuanLy_Id: m('kql'),
            dSoDaDangTuSo: so('tuSo'),
            dSoDaDangDenSo: so('denSo')
        }).then(function (r) {
            if (my !== st.token) return;
            st.rows = L.arr(r.data);
            var tong = Number(r.pager) || st.rows.length;
            z('n').textContent = '(' + tong + ')';
            ui.table({ el: z('bang'), rows: st.rows, empty: 'Không có dữ liệu',
                page: { index: st.trang, size: st.co, total: tong, onChange: tai, onSize: function (s) { st.co = s; tai(1); } },
                columns: [
                    { title: 'Mã lớp', prop: 'MALOP', cls: 'is-nowrap' },
                    { title: 'Tên lớp', prop: 'TENLOP' },
                    { title: 'Thông tin lịch', render: function (r) { return ui.escBr(r.THOIGIANCHITIET); } },
                    { title: 'Đã phân công', cls: 'is-center', render: function (r) {
                        return ui.btn('view', { text: 'Chi tiết', icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-pv': r.ID } }); } },
                    { title: 'Số sv đã đăng ký', cls: 'is-center', render: function (r) {
                        return r.SOSVDADANGKY ? ui.btn('view', { text: String(r.SOSVDADANGKY), icon: 'fa-eye', cls: 'ums-btn--sm', attr: { 'data-sv': r.ID, title: 'Số sinh viên đã đăng ký' } }) : ''; } },
                    { title: 'Số sv dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' },
                    { title: 'Dồn lớp', cls: 'is-center', render: function (r) {
                        return ui.btn('view', { text: 'Dồn lớp', icon: 'fa-people-arrows', cls: 'ums-btn--sm', attr: { 'data-don': r.ID } }); } },
                    L.cotChon('lhp')
                ] });
        }).catch(function (err) {
            if (my !== st.token) return;
            z('bang').innerHTML = ui.fail(err.message);
            ums.api.handle(err, 'danh sách lớp học phần');
        });
    }

    /* ---------- Hộp phạm vi / sinh viên ---------- */
    function dsDangKy(lhpId) {
        return L.rows({ action: 'DKH_PhanCong_LopHP/LayDSDangKyHoc', method: 'GET', type: 'GET',
            strTuKhoa: '', strDaoTao_LopHocPhan_Id: lhpId, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 });
    }
    function hoTen(r) { return esc(e(r.QLSV_NGUOIHOC_HODEM) + ' ' + e(r.QLSV_NGUOIHOC_TEN)); }

    function hopPhamVi(id) {
        var d = ui.dialog({ title: 'Danh sách phạm vi', icon: 'fa-users-viewfinder', size: 'lg',
            body: '<div data-z="pv">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>',
            buttons: [{ text: 'Xóa', kind: 'del', keepOpen: true }] });
        var nutXoa = d.el.querySelector('[data-dlg="0"]');
        if (nutXoa) { nutXoa.disabled = true; nutXoa.title = 'Bản gốc chưa có xử lý cho nút này'; }
        L.ganChonTatCa(d.body);
        L.rows({ action: 'DKH_PhanCong_LopHP/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDangKy_KeHoachDangKy_Id: '', strDangKy_LopHocPhan_Id: id, strPhanCapApDung_Id: '',
            strPhamViApDung_Id: '', strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (rows) {
                ui.table({ el: d.body.querySelector('[data-z="pv"]'), rows: rows, empty: 'Không có dữ liệu',
                    columns: [
                        { title: 'Phạm vi', prop: 'PHAMVIAPDUNG_TEN' },
                        { title: 'Phân cấp', prop: 'PHANCAPAPDUNG_TEN' },
                        L.cotChon('pv')
                    ] });
            }, function (err) { d.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách phạm vi'); });
    }

    function hopSinhVien(id) {
        var d = ui.dialog({ title: 'Danh sách sinh viên', icon: 'fa-users', size: 'xl',
            body: '<div data-z="sv">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        dsDangKy(id).then(function (rows) {
            ui.table({ el: d.body.querySelector('[data-z="sv"]'), rows: rows, empty: 'Không có dữ liệu',
                columns: [
                    { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
                    { title: 'Họ tên', render: hoTen },
                    { title: 'Ngày sinh', prop: 'QLSV_NGUOIHOC_NGAYSINH', cls: 'is-center is-nowrap' },
                    { title: 'Tình trạng', prop: 'QLSV_TRANGTHAINGUOIHOC_TEN' },
                    { title: 'Lớp học', prop: 'DAOTAO_LOPQUANLY_TEN' },
                    { title: 'Chương trình học', prop: 'DAOTAO_CHUONGTRINH_TEN' },
                    { title: 'Khóa học', prop: 'DAOTAO_KHOADAOTAO_TEN' },
                    { title: 'Khoa quản lý', prop: 'KHOAQUANLY_TEN' },
                    { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' }
                ] });
        }, function (err) { d.body.innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách sinh viên'); });
    }

    /* ---------- Vùng dồn lớp ---------- */
    var don = { lop: null, trai: [], vuaDon: {} };
    var cotDK = [
        { title: 'Mã số', prop: 'QLSV_NGUOIHOC_MASO', cls: 'is-nowrap' },
        { title: 'Họ tên', render: hoTen },
        { title: 'Lớp', prop: 'DAOTAO_LOPQUANLY_TEN' },
        { title: 'Ngành', prop: 'DAOTAO_TOCHUCCHUONGTRINH_TEN' },
        { title: 'Khóa', prop: 'DAOTAO_KHOADAOTAO_TEN' },
        { title: 'Thời gian đăng ký', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-nowrap' }
    ];
    function taiTrai() {
        z('bTrai').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return dsDangKy(don.lop.ID).then(function (rows) {
            don.trai = rows;
            ui.table({ el: z('bTrai'), rows: rows, empty: 'Không có dữ liệu',
                columns: cotDK.concat([{ title: 'Số dự kiến', prop: 'SOLUONGDUKIENHOC', cls: 'is-center' }, L.cotChon('dk')]) });
        }, function (err) { z('bTrai').innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên lớp cần dồn'); });
    }
    function taiPhai() {
        var id = f('lopCuoi').value;
        if (!id) { z('bPhai').innerHTML = ui.empty('Chọn lớp cuối để xem sinh viên', 'fa-hand-pointer'); return Promise.resolve(); }
        z('bPhai').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
        return dsDangKy(id).then(function (rows) {
            ui.table({ el: z('bPhai'), rows: rows, empty: 'Không có dữ liệu', columns: cotDK,
                rowCls: function (r) { return don.vuaDon[r.QLSV_NGUOIHOC_ID] ? 'ums-lop-moi' : ''; } });
        }, function (err) { z('bPhai').innerHTML = ui.fail(err.message); ums.api.handle(err, 'sinh viên lớp cuối'); });
    }
    function moDon(id) {
        var row = st.rows.filter(function (x) { return x.ID === id; })[0];
        if (!row) return;
        don.lop = row;
        don.vuaDon = {};
        z('don').querySelector('.ums-panel__title').innerHTML = '<i class="fa-light fa-plus"></i> Thêm mới - ' + esc(e(row.TENLOP));
        pat.fill(f('lopCuoi'), [], { head: 'Chọn lớp cuối' });
        taiPhai();
        ui.swap(z('ds'), z('don'));
        taiTrai();
        L.rows({ action: 'DKH_PhanCong_LopHP/LayDSLopHocPhan', type: 'GET',
            strTuKhoa: '', strDaoTao_ThoiGianDaoTao_Id: row.DAOTAO_THOIGIANDAOTAO_ID, strDaoTao_HocPhan_Id: row.DAOTAO_HOCPHAN_ID,
            strDangKy_KeHoachDangKy_Id: '', dChiLayCacLopChuaPhanCong: -1, strDaoTao_KhoaDaoTao_Id: '', strDaoTao_ChuongTrinh_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000 })
            .then(function (r) {
                pat.fill(f('lopCuoi'), r.filter(function (x) { return x.ID !== row.ID; }), { name: 'TENLOP', head: 'Chọn lớp cuối' });
            }, L.fail('nạp lớp cuối'));
    }
    jQuery(f('lopCuoi')).on('change', function () { don.vuaDon = {}; taiPhai(); });

    function dongDon() { ui.swap(z('don'), z('ds')); tai(); }

    function donLop() {
        var ids = L.chon(z('bTrai'), 'dk');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var moi = f('lopCuoi').value;
        if (!moi) { ui.toast('Vui lòng chọn lớp cuối', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn lưu dữ liệu không?').then(function (ok) {
            if (!ok) return;
            var rows = don.trai.filter(function (x) { return ids.indexOf(x.ID) >= 0; });
            ui.batch(rows.map(function (o) {
                return { action: 'DKH_DangKy/ThucHienDonLopDangKyHoc', type: 'POST',
                    strDaoTao_ChuongTrinh_Id: o.DAOTAO_TOCHUCCHUONGTRINH_ID,
                    strQLSV_NguoiHoc_Id: o.QLSV_NGUOIHOC_ID,
                    strDaoTao_HocPhan_Id: o.DAOTAO_HOCPHAN_ID,
                    strDangKy_LopHocPhan_Cu_Ids: o.DANGKY_LOPHOCPHAN_ID,
                    strDangKy_LopHocPhan_Moi_Ids: moi,
                    strNguoiThucHien_Id: '' };
            }), { title: 'Đang dồn lớp', okText: 'Thành công' }).then(function () {
                don.vuaDon = {};
                rows.forEach(function (o) { don.vuaDon[o.QLSV_NGUOIHOC_ID] = 1; });
                taiTrai(); taiPhai();
            });
        });
    }

    function huyDangKy() {
        var ids = L.chon(z('bTrai'), 'dk');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.confirm('Bạn có chắc chắn xóa dữ liệu không?', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            var rows = don.trai.filter(function (x) { return ids.indexOf(x.ID) >= 0; });
            ui.batch(rows.map(function (o) {
                return { action: 'DKH_DangKy/ThucHienHuyDangKyHocHocPhan', type: 'POST',
                    strDaoTao_ChuongTrinh_Id: o.DAOTAO_TOCHUCCHUONGTRINH_ID,
                    strQLSV_NguoiHoc_Id: o.QLSV_NGUOIHOC_ID,
                    strDaoTao_HocPhan_Id: o.DAOTAO_HOCPHAN_ID,
                    strNguoiThucHien_Id: '',
                    strDangKy_KeHoachDangKy_Id: o.DANGKY_KEHOACHDANGKY_ID };
            }), { title: 'Đang xóa', okText: 'Thành công' }).then(function () { taiTrai(); taiPhai(); });
        });
    }

    function taoDSNhapDiem() {
        var ids = L.chon(z('bang'), 'lhp');
        if (!ids.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        ui.batch(ids.map(function (id) {
            return { action: 'D_PhanQuyen/TaoDuLieuNhapDiem', type: 'POST', strDaoTao_LopHocPhan_Id: id, strNguoiThucHien_Id: '' };
        }), { title: 'Đang tạo danh sách nhập điểm', okText: 'Thành công', show: true });
    }

    /* ---------- Báo cáo ---------- */
    ums.report.mount(z('bc'), {
        import: false,
        collect: function (add) {
            add('strDaoTao_ThoiGianDaoTao_Id', m('tg'));
            add('strDaoTao_KhoaDaoTao_Id', m('khoa'));
            add('strDaoTao_ChuongTrinh_Id', m('ct'));
            add('strDaoTao_HocPhan_Id', m('hp'));
            L.chon(z('bang'), 'lhp').forEach(function (id) { add('strDangKy_LopHocPhan_Id', id); });
            tt.ids().forEach(function (id) { add('strTrangThaiNguoiHoc_Id', id); });
        }
    });

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-pv]');
        if (b) { hopPhamVi(b.getAttribute('data-pv')); return; }
        b = ev.target.closest('[data-sv]');
        if (b) { hopSinhVien(b.getAttribute('data-sv')); return; }
        b = ev.target.closest('[data-don]');
        if (b) { moDon(b.getAttribute('data-don')); return; }
        b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'search') tai(1);
        else if (a === 'taods') taoDSNhapDiem();
        else if (a === 'dong') dongDon();
        else if (a === 'don') donLop();
        else if (a === 'huy') huyDangKy();
    });
})();
