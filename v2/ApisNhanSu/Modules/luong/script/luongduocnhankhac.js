/* =========================================================================
   Lương được nhận khác (khoản được nhận khác + lương và thu nhập khác)
   Bản gốc: ApisNhanSu/Modules/luong/script/luongduocnhankhac.js
   ---------------------------------------------------------------------------
   MỘT CỘT như bản gốc: thanh lọc (+ Xuất báo cáo, Import) → dòng tóm tắt
   "Tổng lương và thu nhập khác – Tổng thuế TNCN" → "Danh sách khoản được nhận
   khác" (Sinh tự động chứng từ, Sinh lại số chứng từ, Thêm mới, Xoá nhiều; tiêu
   đề hai tầng "Thuế TNCN") → "Danh sách" lương và thu nhập (L_KetQuaLuong).
   Biểu mẫu THÊM hai cột (col-sm-4 | col-sm-8 gốc): thông tin chung | nhân sự kèm
   theo (mỗi người Số tiền, Thuế TNCN, Nội dung; "Tổng tiền"); biểu mẫu SỬA một dòng.
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       L_DuocNhan/LayDanhSach   GET  strTuKhoa, strDaoTao_CoCauToChuc_Id, strNgayPhatSinh_TuNgay,
                                     strNgayPhatSinh_DenNgay, strNhanSu_HoSoCanBo_Id (Thành viên),
                                     strSoChungTuThuNhap, strNamXuatChungTu, strSoChungTu, strNam,
                                     dLaCanBoNgoaiTruong, strNguoiTao_Id = userId, strChucNang_Id (tự chèn),
                                     pageIndex, pageSize
       L_KetQuaLuong/LayDanhSach GET strDaoTao_CoCauToChuc_Id, strNhanSu_HoSoCanBo_Id, dThang / dNam
                                     (trống → -1), strNguoiThucHien_Id — gọi SAU danh sách trên
       L_DuocNhan/LayChiTiet    GET  strId
       L_DuocNhan/ThemMoi       POST MỖI nhân sự một lời gọi: strId '', dNam '', dThang '' (ô không có
                                     trên màn), strSoTien, strThueTNCN, strMoTa (ô của người đó),
                                     strChungTu, strNgayPhatSinh, strLoaiKhoan_Id, strNhanSu_HoSoCanBo_Id
       L_DuocNhan/CapNhat       POST strId, dNam '', dThang '', strSoTien, strThueTNCN, strChungTu,
                                     strNgayPhatSinh, strMoTa, strLoaiKhoan_Id, strNhanSu_HoSoCanBo_Id
       L_DuocNhan/Xoa           POST strIds, strNguoiThucHien_Id (hàng loạt có tiến độ)
       L_SoChungTuThue/SinhLaiSoChungTuThueTNCN GET  (mỗi dòng đã chọn) strNam, strNamXuatChungTu,
                                     strNhanSu_HoSoCanBo_Id = NHANSU_HOSOCANBO_ID của dòng
       L_ThueTNCN/SinhSoChungTuThueTNCN  POST type 'POST' (khoá gốc gửi kèm), strNam, strNamXuatChungTu,
                                     strDaoTao_CoCauToChuc_Id, strNhanSu_HoSoCanBo_Id (Thành viên)
   Xuất báo cáo: mẫu của chức năng (ums.report), cùng bộ khoá addKeyValue gốc; mỗi
   dòng đang đánh dấu thêm một cặp strNhanSu_HoSoCanBo_Id = ID DÒNG (như gốc).
   Import: gốc viết cứng hai mục (IMPORTWITHPROC_LUONGDUOCNHAN, IMPORTWITHPROC_SSCT);
   mẫu import phân quyền (nếu có) thay chỗ như cbGenCombo_MauImport gốc.

   Mở màn: Năm = năm nay, nạp ngay (như gốc).
   Khác bản gốc: dòng tóm tắt cộng hai tổng bằng số (gốc `+=` trên giá trị máy
   chủ — chuỗi thì thành nối chuỗi). Thành viên KHOÁ tới khi chọn Đơn vị (luật chung).
   Bỏ: ô "Tình trạng làm việc" (gốc không nạp, không đọc).
   ========================================================================= */
(function () {
    'use strict';

    var L = ums.luongB, ui = ums.ui, pat = ums.pat;
    var C = 'L_DuocNhan';
    var uid = L.uid, esc = ui.esc;
    var luoi = null;
    function num(v) { var n = Number(pat.num(v)); return isNaN(n) ? 0 : n; }

    function hoTen(r) { return esc(L.hoTen(r)); }
    function tien(k, t) { return { title: t, cls: 'is-right is-nowrap', render: function (r) { return ui.money(r[k]); }, sum: true, sumProp: k }; }

    var crud = ums.crud({
        root: document.getElementById('luongduocnhankhac'),
        title: 'Lương được nhận khác',
        listTitle: 'Danh sách khoản được nhận khác',
        formTitle: 'khoản được nhận khác',
        icon: 'fa-circle-dollar-to-slot',

        filters: [
            { key: 'dv', type: 'select', label: 'Chọn đơn vị' },
            { key: 'tv', type: 'select', label: 'Chọn thành viên' },
            { key: 'la', type: 'select', label: 'Toàn bộ nhân sự', value: '-1',
              source: { items: [{ ID: '-1', TEN: 'Toàn bộ nhân sự' }, { ID: '0', TEN: 'Là cán bộ trong trường' }, { ID: '1', TEN: 'Là cán bộ ngoài trường' }] } },
            { key: 'nam', type: 'text', label: 'Năm lấy dữ liệu lương', value: String(new Date().getFullYear()) },
            { key: 'thang', type: 'text', label: 'Tháng tìm kiếm' },
            { key: 'tuNgay', type: 'text', label: 'Tìm kiếm từ ngày' },
            { key: 'denNgay', type: 'text', label: 'Tìm kiếm đến ngày' },
            { key: 'soCT', type: 'text', label: 'Số chứng từ' },
            { key: 'soCTTN', type: 'text', label: 'Số chứng từ thu nhập' },
            { key: 'namXCT', type: 'text', label: 'Năm xuất chứng từ' },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],

        list: {
            paged: true,
            call: function (f) {
                return {
                    action: C + '/LayDanhSach', method: 'GET',
                    strTuKhoa: f.q, strDaoTao_CoCauToChuc_Id: f.dv,
                    strNgayPhatSinh_TuNgay: f.tuNgay, strNgayPhatSinh_DenNgay: f.denNgay,
                    strNhanSu_HoSoCanBo_Id: f.tv,
                    strSoChungTuThuNhap: f.soCTTN, strNamXuatChungTu: f.namXCT, strSoChungTu: f.soCT,
                    strNam: f.nam, dLaCanBoNgoaiTruong: f.la, strNguoiTao_Id: uid()
                };
            }
        },
        detail: function (row) { return { action: C + '/LayChiTiet', method: 'GET', strId: row.ID }; },

        toolbar: [
            { text: 'Sinh tự động chứng từ', icon: 'fa-paper-plane', mod: 'out-warn', onClick: sinhTuDong },
            { text: 'Sinh lại số chứng từ', icon: 'fa-paper-plane', mod: 'out-warn', onClick: sinhLai }
        ],

        columns: [
            { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN' },
            { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO', cls: 'is-center' },
            { title: 'Họ tên', render: hoTen },
            { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE', cls: 'is-center' },
            { title: 'Chứng từ', prop: 'CHUNGTU' },
            tien('SOTIEN', 'Số tiền'),
            { title: 'Thuế', group: ['Thuế TNCN'], cls: 'is-right is-nowrap', render: function (r) { return ui.money(r.THUETNCN); }, sum: true, sumProp: 'THUETNCN' },
            { title: 'Ký hiệu', group: ['Thuế TNCN'], prop: 'KYHIEU' },
            { title: 'Số chứng từ', group: ['Thuế TNCN'], prop: 'SOCHUNGTU' },
            { title: 'Ngày chứng từ', group: ['Thuế TNCN'], prop: 'NGAYCHUNGTU', cls: 'is-nowrap' },
            { title: 'Nội dung', prop: 'MOTA' },
            { title: 'Khoản được nhận', prop: 'LOAIKHOAN_TEN' },
            { title: 'Ngày phát sinh', prop: 'NGAYPHATSINH', cls: 'is-center is-nowrap' }
        ],

        fields: [
            { key: '_canBo', label: 'Cán bộ', type: 'static', span: true, get: function (r) { return L.hoTen(r) + ' - Mã cán bộ: ' + L.e(r.NHANSU_HOSOCANBO_MASO); } },
            { key: 'strLoaiKhoan_Id', col: 'LOAIKHOAN_ID', label: 'Loại khoản', type: 'select', source: { dm: 'NHANSU.LOAIKHOAN' }, placeholder: '-- Chọn loại khoản --' },
            { key: 'strSoTien', col: 'SOTIEN', label: 'Số tiền', get: function (r) { return pat.money(r.SOTIEN); } },
            { key: 'strThueTNCN', col: 'THUETNCN', label: 'Thuế thu nhập', get: function (r) { return pat.money(r.THUETNCN); } },
            { key: 'strChungTu', col: 'CHUNGTU', label: 'Chứng từ' },
            { key: 'strNgayPhatSinh', col: 'NGAYPHATSINH', label: 'Ngày phát sinh', type: 'date' },
            { key: 'strMoTa', col: 'MOTA', label: 'Nội dung', span: true }
        ],

        onForm: function (row, c) {
            L.tienForm(c, ['strSoTien', 'strThueTNCN']);
            function gt(k) { return function () { var el = L.oForm(c, k); return el ? el.value : ''; }; }
            luoi = L.formNhanSu(c, row, {
                hai: true, chiSua: ['_canBo'],
                title: 'Danh sách nhân sự kèm theo', chon: 'Chọn giảng viên', tong: 'tien',
                ghiChu: 'Chú ý: Nhập đầy đủ thông tin bên trên. Sau đó chọn nhân sự',
                cot: [
                    { key: 'tien', title: 'Số tiền', kieu: 'tien', width: '150px', macDinh: gt('strSoTien') },
                    { key: 'thue', title: 'Thuế TNCN', kieu: 'tien', width: '150px', macDinh: gt('strThueTNCN') },
                    { key: 'noiDung', title: 'Nội dung', macDinh: gt('strMoTa') }
                ]
            });
        },

        save: function (v, row, c) {
            if (row) {
                return {
                    action: C + '/CapNhat', strId: row.ID, dNam: '', dThang: '',
                    strSoTien: pat.num(v.strSoTien), strThueTNCN: pat.num(v.strThueTNCN),
                    strChungTu: v.strChungTu, strNgayPhatSinh: v.strNgayPhatSinh, strMoTa: v.strMoTa,
                    strLoaiKhoan_Id: v.strLoaiKhoan_Id, strNhanSu_HoSoCanBo_Id: row.NHANSU_HOSOCANBO_ID, strNguoiThucHien_Id: uid()
                };
            }
            var ds = luoi ? luoi.ds() : [];
            if (!ds.length) { ui.toast('Nhập đầy đủ thông tin bên trên. Sau đó chọn nhân sự', 'warn'); return null; }
            ui.batch(ds.map(function (x) {
                return {
                    action: C + '/ThemMoi', strId: '', dNam: '', dThang: '',
                    strSoTien: pat.num(x.v.tien), strThueTNCN: pat.num(x.v.thue),
                    strChungTu: v.strChungTu, strNgayPhatSinh: v.strNgayPhatSinh, strMoTa: x.v.noiDung,
                    strLoaiKhoan_Id: v.strLoaiKhoan_Id, strNhanSu_HoSoCanBo_Id: x.ns.ID, strNguoiThucHien_Id: uid()
                };
            }), { title: 'Thêm khoản được nhận khác' }).then(function (r) {
                if (r.ok) { c.showList(); c.load(); }
            });
            return null;
        },

        remove: function (ids) { return ids.map(function (id) { return { action: C + '/Xoa', strIds: id, strNguoiThucHien_Id: uid() }; }); },

        onLoad: function (rows) {
            tongLuong = rows.length ? num(rows[0].TONGLUONG_THUNHAPKHAC) : 0;
            tongThue = rows.length ? num(rows[0].TONGTHUE_TNCN) : 0;
            tomTat();
            bang2();
        }
    });

    /* ---- Vùng thêm vào khung danh sách: tóm tắt (zoneLuong) + bảng lương & thu nhập ---- */
    var vung = crud.z('list');
    var tong = document.createElement('div');
    tong.className = 'ums-u-mb-4';
    tong.hidden = true;
    vung.insertBefore(tong, vung.children[1] || null);
    var khung2 = document.createElement('div');
    khung2.className = 'ums-u-mt-4';
    khung2.innerHTML = pat.panel({ title: 'Danh sách', icon: 'fa-money-check-dollar-pen', count: 'dem2', flush: true, zone: 'bang2' });
    vung.appendChild(khung2);

    var tongLuong = 0, tongThue = 0;
    function tomTat() {
        tong.hidden = !(tongLuong > 0 || tongThue > 0);
        tong.innerHTML = '<div class="ums-panel"><div class="ums-panel__body lgb-tong">Tổng lương và thu nhập khác: <b>' +
            ui.money(tongLuong) + '</b> — Tổng thuế TNCN: <b class="is-warn">' + ui.money(tongThue) + '</b></div></div>';
    }

    function bang2() {
        var f = crud.filterValues();
        var host = khung2.querySelector('[data-z="bang2"]');
        host.innerHTML = '<div class="ums-empty"><i class="fa-light fa-spinner fa-spin"></i>Đang tải…</div>';
        return ums.api.call({
            action: 'L_KetQuaLuong/LayDanhSach', method: 'GET',
            strDaoTao_CoCauToChuc_Id: f.dv, strNhanSu_HoSoCanBo_Id: f.tv,
            dThang: f.thang || -1, dNam: f.nam || -1, strNguoiThucHien_Id: uid()
        }).then(function (r) {
            var rows = L.rows(r);
            khung2.querySelector('[data-z="dem2"]').textContent = '(' + (r.pager || rows.length) + ')';
            ui.table({
                el: host, rows: rows, empty: 'Không có dữ liệu',
                columns: [
                    { title: 'Năm', prop: 'NAM', cls: 'is-center' },
                    { title: 'Tháng', prop: 'THANG', cls: 'is-center' },
                    { title: 'Đơn vị', prop: 'DAOTAO_COCAUTOCHUC_TEN', cls: 'is-center' },
                    { title: 'Mã', prop: 'NHANSU_HOSOCANBO_MASO' },
                    { title: 'Họ tên', render: hoTen, cls: 'is-center' },
                    { title: 'Mã số thuế', prop: 'NHANSU_HOSOCANBO_MASOTHUE' },
                    { title: 'Chứng từ', prop: 'CHUNGTU', cls: 'is-center' },
                    tien('SOTIEN', 'Số tiền'), tien('THUETNCN', 'Thuế TNCN'),
                    { title: 'Nội dung', prop: 'MOTA', cls: 'is-center' },
                    { title: 'Ngày phát sinh', prop: 'NGAYPHATSINH', cls: 'is-center is-nowrap' }
                ]
            });
            if (rows.length) { tongLuong += num(rows[0].TONGLUONG_THUNHAPKHAC); tongThue += num(rows[0].TONGTHUE_TNCN); }
            tomTat();
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'lương và thu nhập khác'); });
    }

    /* ---- Sinh chứng từ ---- */
    function sinhTuDong(c) {
        ui.confirm('Bạn có muốn sinh số chứng từ không?', { ok: 'Thực hiện', title: 'Sinh tự động chứng từ' }).then(function (yes) {
            if (!yes) return;
            var f = c.filterValues();
            ums.api.call({
                action: 'L_ThueTNCN/SinhSoChungTuThueTNCN', type: 'POST',
                strNam: f.nam, strNamXuatChungTu: f.namXCT, strDaoTao_CoCauToChuc_Id: f.dv,
                strNhanSu_HoSoCanBo_Id: f.tv, strNguoiThucHien_Id: uid()
            }).then(function () { ui.toast('Thực hiện thành công', 'ok'); c.load(); })
              .catch(function (err) { ums.api.handle(err, 'sinh số chứng từ'); c.load(); });
        });
    }
    function sinhLai(c) {
        var rows = c.pickedRows();
        if (!rows.length) { ui.toast('Vui lòng chọn đối tượng?', 'warn'); return; }
        var co = rows.some(function (r) { return !!r.SOCHUNGTU; });
        ui.confirm(co ? 'Bạn có chắc chắn muốn tạo lại số không?' : 'Bạn có chắc chắn muốn tạo số mới không?',
            { ok: 'Thực hiện', title: 'Sinh lại số chứng từ' }).then(function (yes) {
            if (!yes) return;
            var f = c.filterValues();
            ui.batch(rows.map(function (r) {
                return { action: 'L_SoChungTuThue/SinhLaiSoChungTuThueTNCN', method: 'GET', strNam: f.nam, strNamXuatChungTu: f.namXCT,
                    strNhanSu_HoSoCanBo_Id: r.NHANSU_HOSOCANBO_ID, strNguoiThucHien_Id: uid() };
            }), { title: co ? 'Tạo lại số chứng từ' : 'Tạo mới số chứng từ' }).then(function () { c.load(); });
        });
    }

    /* ---- Ô lọc, báo cáo ---- */
    L.ngayLoc(crud, ['tuNgay', 'denNgay']);
    L.donViThanhVien(L.oLoc(crud, 'dv'), L.oLoc(crud, 'tv'), { la: -1 });

    var bc = document.createElement('span');
    crud.z('actions').insertBefore(bc, crud.z('actions').firstChild);
    L.baoCao(bc, {
        collect: function (add) {
            var f = crud.filterValues();
            add('strTuKhoa', f.q);
            add('strDaoTao_CoCauToChuc_Id', f.dv);
            add('strNgayPhatSinh_TuNgay', f.tuNgay);
            add('strNgayPhatSinh_DenNgay', f.denNgay);
            add('strSearch_NhanSu_HoSoCanBo_Id', f.tv);
            add('strNam', f.nam);
            add('dLaCanBoNgoaiTruong', f.la);
            add('strNamXuatChungTu', f.namXCT);
            crud.pickedRows().forEach(function (r) { add('strNhanSu_HoSoCanBo_Id', r.ID); });
        },
        importCung: [
            { chu: 'Import được nhận khác', ma: 'IMPORTWITHPROC_LUONGDUOCNHAN' },
            { chu: 'Import sinh số chứng từ', ma: 'IMPORTWITHPROC_SSCT' }
        ],
        onImported: function () { crud.load(); }
    });
})();
