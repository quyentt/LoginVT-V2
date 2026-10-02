/* =========================================================================
   Đề tài — kê khai đề tài nghiên cứu (cổng cán bộ). Khung chung ums.nckh.man (_sanpham.js).
   Bản gốc: ApisCongCanBo/Modules/sanphamkhoahoc/script/detai.js (2.534 dòng) + html/detai.html
   ---------------------------------------------------------------------------
   NCKH_DeTai/LayDanhSach · ThemMoi · CapNhat · Xoa (strId). Danh sách: strThanhVien_Id = strNCKH_ThanhVien_Id = userId,
     strNCKH_TinhDiem_KeHoach_Id = strNhanSu_TDKT_KeHoach_Id = năm đánh giá. "Tìm đề tài": cùng action, không lọc thành viên.
   Danh mục đề tài: NCKH_DanhMucDeTai/LayDanhSach (TENDETAI) — chọn thì tự điền tên, mã, tên TA, loại (viewEdit_DanhMuc).
   "Loại đề tài khác" / "Cấp quản lý khác" chỉ hiện khi chọn mục mã ZLOAIKHAC (switchLoaiKhac).
   Khối dưới biểu mẫu, lưu SAU đề tài (gốc: id 30 ký tự = dòng mới):
     · Sản phẩm khoa học (NCKH_DeTai_SanPham: LayDanhSach, LayDSSanPhamChuaThuocDeTai, CapNhat gắn sản phẩm vào đề tài, Xoa)
     · Sản phẩm đào tạo (LOAI = NCKH_SP_QUANLYDETAISINHVIEN; thêm = NCKH_SP_QuanLyDeTaiSinhVien/ThemMoi)
     · Sản phẩm ứng dụng NCKH_SP_DeTai · Nguồn kinh phí NCKH_SP_NguonKinhPhi · Đơn vị hợp tác NCKH_DeTai_DoiTac
     · Tiến độ NCKH_DeTai_TienDo · Quyết định phê duyệt - nghiệm thu NCKH_DeTai_KetQua (lưới 2 dòng, tệp theo từng dòng)
     · Thành viên (NCKH_ThanhVien, vai trò NCKH.VTDT, chỉ trong trường) + "Thành viên khác" (strDanhSachCacThanhVienNgoai)
   Khác bản gốc (ghi ở can-quyet.js):
     · Bắt buộc Tên đề tài, Đơn vị chủ trì, Tổng số tác giả, Loại đề tài (gốc khai arrValid_DeTai nhưng không kiểm).
     · Gốc gửi dKinhPhi_n / strNguonKinhPhi_Id / strThoiGianBaoCaoTienDo_Id từ Ô NHẬP DÒNG MỚI của bảng kinh phí / tiến độ
       (giá trị đang gõ dở), strDonViTinh_Id / strTinhTrang_Id / strQuyetDinhPheDuyetSo / strNgayPheDuyet từ ô không tồn tại
       → nay gửi rỗng. "Cấp quản lý khác" có ô nhập nhưng gốc KHÔNG gửi đi — giữ như gốc.
     · Ô "Danh mục đề tài" không được nạp lại khi sửa (gốc không đọc cột) — đọc NCKH_SP_DANHMUCDETAI_ID (tên cột đoán).
     · Xoá đề tài: nút Xoá trong biểu mẫu. Sản phẩm khoa học chưa lưu thì xoá ngay trên màn (gốc gọi Xoa lên máy chủ).
     · Tên cột tiến độ / sản phẩm ứng dụng / đơn vị hợp tác đoán theo tham số lưu (THOIGIAN, SOTIENTHANHTOAN, …) — kiểm trên host.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, N = ums.nckh, e = N.e, arr = N.arr;
    var root = document.getElementById('sanphamkhoahoc-detai');
    if (!root) return;
    function uid() { return N.uid(); }
    function esc(s) { return ui.esc(s); }
    function f(key, col, label, o) { return Object.assign({ key: key, col: col, label: label, cols: 6 }, o || {}); }
    var LOAI_DT = 'NCKH_SP_QUANLYDETAISINHVIEN';
    function soTien(v) { return String(v || '').replace(/,/g, ''); }

    /* ---------- Sản phẩm khoa học + Sản phẩm đào tạo (một lời gọi LayDanhSach, hai bảng) ---------- */
    function sanPham() {
        var ds = [], el = null, dtId = '', chua = [];
        var K = {
            html: pat.panel({ title: 'Sản phẩm khoa học', icon: 'fa-flask', flush: true, cls: 'ums-u-mt-4', body:
                    '<div data-sp="kh"></div><div class="ums-tablefoot"><div class="nk-them">' +
                    '<select class="ums-select" data-sp-in="kh" data-s2 data-ph="Chọn sản phẩm" style="width:100%"><option value="">Chọn sản phẩm</option></select>' +
                    ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-sp-a': 'kh' } }) + '</div></div>' }) +
                pat.panel({ title: 'Sản phẩm đào tạo', icon: 'fa-graduation-cap', flush: true, cls: 'ums-u-mt-4', body:
                    '<div data-sp="dt"></div><div class="ums-tablefoot"><div class="nk-them">' +
                    '<input class="ums-input" data-sp-in="dt" placeholder="Tên sản phẩm đào tạo" autocomplete="off">' +
                    ui.btn('add', { text: 'Thêm', mod: 'out-success', attr: { 'data-sp-a': 'dt' } }) + '</div></div>' }),
            gan: function (host) {
                el = host;
                ui.enhance(host);
                host.addEventListener('click', function (ev) {
                    var a = ev.target.closest('[data-sp-a]');
                    if (a) { them(a.getAttribute('data-sp-a')); return; }
                    var x = ev.target.closest('[data-sp-xoa]');
                    if (x) xoa(Number(x.getAttribute('data-sp-xoa')));
                });
                host.querySelector('[data-sp-in="dt"]').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); them('dt'); } });
            },
            nap: function (row) {
                dtId = row.ID; ds = []; ve(); napChua();
                return N.g('NCKH_DeTai_SanPham/LayDanhSach', { strLoaiSanPham: '', strThanhVien_Id: uid(), strNCKH_QuanLyDeTai_Id: row.ID }).then(function (r) {
                    ds = arr(r.data).map(function (x) { return { id: e(x.ID), ten: e(x.TENSANPHAM), dt: e(x.LOAI) === LOAI_DT, daLuu: true }; });
                    ve();
                }).catch(function (err) { ums.api.handle(err, 'sản phẩm của đề tài'); });
            },
            moi: function () { dtId = ''; ds = []; ve(); napChua(); },
            chep: function () { K.moi(); },          // gốc không chép sản phẩm khi chọn từ "Tìm đề tài"
            luu: function (id) {
                return ds.filter(function (r) { return !r.daLuu; }).reduce(function (p, r) {
                    return p.then(function () {
                        return r.dt
                            ? N.g('NCKH_SP_QuanLyDeTaiSinhVien/ThemMoi', { strId: '', strTenDeTai: r.ten, strNamThucHien: '', strDiemNghiemThu: '', strXepLoai_Id: '', strMoTa: '',
                                strNamNghiemThu: '', strQuyetDinhPheDuyet: '', strQuyetDinhNghiemThu: '', strNCKH_QuanLyDeTai_Id: id, dSoTacGia_n: '', strNguoiThucHien_Id: uid() }, true)
                            : N.g('NCKH_DeTai_SanPham/CapNhat', { strSanPham_Id: r.id, strNCKH_QuanLyDeTai_Id: id, strNguoiThucHien_Id: uid() }, true);
                    });
                }, Promise.resolve()).catch(function (err) { ums.api.handle(err, 'lưu sản phẩm của đề tài'); });
            }
        };
        function napChua() {
            N.g('NCKH_DeTai_SanPham/LayDSSanPhamChuaThuocDeTai', { strLoaiSanPham: '', strThanhVien_Id: uid(), silent: true }).then(function (r) {
                chua = arr(r.data);
                var sel = el.querySelector('[data-sp-in="kh"]');
                pat.fill(sel, chua, { head: 'Chọn sản phẩm', name: 'TENSANPHAM' });
            }).catch(function () {});
        }
        function them(k) {
            var inp = el.querySelector('[data-sp-in="' + k + '"]'), v = (inp.value || '').trim();
            if (!v) { ui.toast('Vui lòng nhập đủ thông tin', 'warn'); return; }
            if (k === 'kh') {
                if (ds.some(function (r) { return r.id === v; })) { ui.toast('Sản phẩm đã có trong danh sách', 'info'); return; }
                var x = chua.filter(function (r) { return e(r.ID) === v; })[0];
                ds.push({ id: v, ten: x ? e(x.TENSANPHAM) : v, dt: false, daLuu: false });
                inp.value = ''; if (window.jQuery) jQuery(inp).trigger('change.select2');
            } else { ds.push({ id: '', ten: v, dt: true, daLuu: false }); inp.value = ''; }
            ve();
        }
        function xoa(i) {
            var r = ds[i];
            if (!r) return;
            if (!r.daLuu || !dtId) { ds.splice(i, 1); ve(); return; }
            ui.confirm('Bạn có chắc chắn muốn xóa?', { tone: 'bad', ok: 'Xoá' }).then(function (yes) {
                if (!yes) return;
                N.g('NCKH_DeTai_SanPham/Xoa', { strSanPham_Id: r.id, strNCKH_QuanLyDeTai_Id: dtId, strNguoiThucHien_Id: uid() }, true)
                    .then(function () { ds.splice(ds.indexOf(r), 1); ve(); napChua(); ui.toast('Xóa thành công!', 'ok'); })
                    .catch(function (err) { ums.api.handle(err, 'xoá sản phẩm'); });
            });
        }
        function ve() {
            if (!el) return;
            ['kh', 'dt'].forEach(function (k) {
                var rows = ds.map(function (r, i) { return Object.assign({ _i: i }, r); }).filter(function (r) { return r.dt === (k === 'dt'); });
                ui.table({ el: el.querySelector('[data-sp="' + k + '"]'), rows: rows, empty: 'Chưa có sản phẩm', columns: [
                    { title: 'Tên', render: function (r) { return esc(r.ten) + (r.daLuu ? '' : ' <span class="ums-u-faint ums-u-fz13">(chưa lưu)</span>'); } },
                    { title: 'Xóa', cls: 'is-center', width: '70px', render: function (r) {
                        return '<button type="button" class="ums-iconbtn ums-iconbtn--del" data-sp-xoa="' + r._i + '" title="Xóa"><i class="fa-light fa-trash-can"></i></button>';
                    } }] });
            });
        }
        return K;
    }

    /* ---------- Lưới con dựng bằng pat.rows: chỉ dòng MỚI được ThemMoi; "Tìm đề tài" chép cả dòng ---------- */
    function luoi(o) {
        var g = null;
        var K = {
            html: '<div class="ums-u-mt-4" data-nk="' + o.ma + '"></div>',
            gan: function (host) {
                g = pat.rows(host.querySelector('[data-nk="' + o.ma + '"]'), {
                    title: o.title, icon: o.icon, addText: o.addText || 'Thêm', columns: o.columns, minRows: o.minRows, minRowsNew: o.minRows,
                    list: o.list, filled: o.filled, save: o.save, remove: o.remove
                });
            },
            nap: function (row) { return g.load(row.ID); },
            moi: function () { return g.clear(); },
            luu: function (id) { return g.save(id); }
        };
        if (o.chep) K.chep = function (row) {
            return g.clear().then(function () {
                return ums.api.call(Object.assign({ silent: true }, o.list(row.ID)));
            }).then(function (r) { arr(r.data).forEach(function (x) { g.addNew(x); }); }).catch(function () { /* không chép được thì bỏ */ });
        };
        else K.chep = K.moi;
        return K;
    }
    var spUngDung = luoi({ ma: 'spud', title: 'Sản phẩm ứng dụng', icon: 'fa-gears', chep: true,
        columns: [
            { key: 'loai', col: 'LOAISANPHAM_ID', title: 'Loại', type: 'select', width: '240px', placeholder: 'Chọn loại sản phẩm', source: { dm: 'NCKH.SPUD' } },
            { key: 'ten', col: 'TENSANPHAM', title: 'Tên' }, { key: 'moTa', col: 'MOTA', title: 'Mô tả' }],
        list: function (id) { return { action: 'NCKH_SP_DeTai/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: id, strLoaiSanPham_Id: '', pageIndex: 1, pageSize: 10000 }; },
        filled: function (v, rec) { return !rec && !!v.loai; },
        save: function (v, rec, id) { return { action: 'NCKH_SP_DeTai/ThemMoi', method: 'POST', strId: '', strNCKH_QuanLyDeTai_Id: id, strLoaiSanPham_Id: v.loai,
            strTenSanPham: v.ten, strMoTa: v.moTa, strNguoiThucHien_Id: uid() }; },
        remove: function (rec) { return { action: 'NCKH_SP_DeTai/Xoa', method: 'POST', strId: rec.ID, strNguoiThucHien_Id: uid() }; } });
    var donViHopTac = luoi({ ma: 'dvht', title: 'Đơn vị hợp tác', icon: 'fa-handshake', chep: true,
        columns: [{ key: 'ten', col: 'DOITAC', title: 'Tên đơn vị' },
            { key: 'quocGia', col: 'QUOCTICH_ID', title: 'Quốc gia', type: 'select', width: '240px', s2: true, placeholder: 'Chọn quốc gia', source: { dm: 'CHUN.CHLU' } }],
        list: function (id) { return { action: 'NCKH_DeTai_DoiTac/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: id, strQuocTich_Id: '', strDoiTac: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 }; },
        filled: function (v, rec) { return !rec && !!v.ten && !!v.quocGia; },
        save: function (v, rec, id) { return { action: 'NCKH_DeTai_DoiTac/ThemMoi', method: 'POST', strId: '', strNCKH_QuanLyDeTai_Id: id, strQuocTich_Id: v.quocGia,
            strDoiTac: v.ten, strNguoiThucHien_Id: uid() }; },
        remove: function (rec) { return { action: 'NCKH_DeTai_DoiTac/Xoa', method: 'POST', strIds: rec.ID, strNguoiThucHien_Id: uid() }; } });
    var tienDo = luoi({ ma: 'tddt', title: 'Tiến độ đề tài', icon: 'fa-bars-progress', chep: true,
        columns: [{ key: 'thoiGian', col: 'THOIGIAN', title: 'Thời gian' }, { key: 'thanhToan', col: 'SOTIENTHANHTOAN', title: 'Tiền thanh toán' },
            { key: 'conLai', col: 'SOTIENCONLAI', title: 'Tiền còn lại' }],
        list: function (id) { return { action: 'NCKH_DeTai_TienDo/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: id, strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 10000 }; },
        filled: function (v, rec) { return !rec && !!v.thoiGian && !!v.thanhToan; },
        save: function (v, rec, id) { return { action: 'NCKH_DeTai_TienDo/ThemMoi', method: 'POST', strId: '', strNCKH_QuanLyDeTai_Id: id, strThoiGian: v.thoiGian,
            dSoTienThanhToan: soTien(v.thanhToan), dSoTienConLai: soTien(v.conLai), strNguoiThucHien_Id: uid() }; },
        remove: function (rec) { return { action: 'NCKH_DeTai_TienDo/Xoa', method: 'POST', strIds: rec.ID, strNguoiThucHien_Id: uid() }; } });
    /* Quyết định phê duyệt - nghiệm thu: dòng đã lưu cũng được CapNhat (gốc), chỉ lưu dòng đủ Số QĐ + Năm + Tình trạng */
    var ketQua = luoi({ ma: 'kq', title: 'Quyết định phê duyệt - nghiệm thu', icon: 'fa-file-signature', addText: 'Thêm dòng mới', minRows: 2,
        columns: [
            { key: 'soQD', col: 'SOQUYETDINH', title: 'Số quyết định', width: '150px' },
            { key: 'ngay', col: 'NGAY', title: 'Ngày', width: '70px' }, { key: 'thang', col: 'THANG', title: 'Tháng', width: '76px' },
            { key: 'nam', col: 'NAM', title: 'Năm', width: '90px' },
            { key: 'tinhTrang', col: 'TINHTRANG_ID', title: 'Tình trạng', type: 'select', width: '160px', placeholder: 'Chọn tình trạng', source: { dm: 'NCKH.TTDT' } },
            { key: 'xepLoai', col: 'XEPLOAI_ID', title: 'Xếp loại', type: 'select', width: '150px', placeholder: 'Chọn xếp loại', source: { dm: 'NCKH.DETAI.XEPLOAI' } },
            { key: 'tgQuyDinh', col: 'TONGTHOIGIANQUYDINH', title: 'Tổng thời gian quy định' },
            { key: 'tgThucHien', col: 'TONGTHOIGIANDATHUCHIEN', title: 'Tổng thời gian đã thực hiện' },
            { key: 'moTa', col: 'MOTA', title: 'Mô tả' },
            { key: '_tep', title: 'File đính kèm', type: 'files', api: 'NCKH_Files' }],
        list: function (id) { return { action: 'NCKH_DeTai_KetQua/LayDanhSach', method: 'GET', strTuKhoa: '', strNCKH_QuanLyDeTai_Id: id, iTinhTrang: -1, strTinhTrang_Id: '',
            strNguoiThucHien_Id: uid(), pageIndex: 1, pageSize: 10000 }; },
        filled: function (v) { return !!v.soQD && !!v.nam && !!v.tinhTrang; },
        save: function (v, rec, id) {
            return { action: 'NCKH_DeTai_KetQua/' + (rec ? 'CapNhat' : 'ThemMoi'), method: 'POST', strId: rec ? rec.ID : '', strNCKH_QuanLyDeTai_Id: id,
                strFileMinhChung: '', strThongTinMinhChung: '', strTinhTrang_Id: v.tinhTrang, strXepLoai_Id: v.xepLoai, strMoTa: v.moTa, strNgay: v.ngay,
                strThang: v.thang, strNam: v.nam, dTongThoiGianQuyDinh: v.tgQuyDinh, dTongThoiGianDaThucHien: v.tgThucHien, strSoQuyetDinh: v.soQD,
                strNguoiThucHien_Id: uid() };
        },
        remove: function (rec) { return { action: 'NCKH_DeTai_KetQua/Xoa', method: 'POST', strIds: rec.ID, strNguoiThucHien_Id: uid() }; } });
    var ghiChuKQ = { html: '<div class="ums-u-faint ums-u-fz13 ums-u-mt-2"><i>Chú ý: Phải nhập đầy đủ số quyết định, năm và tình trạng đề tài</i></div>' };

    /* ---------- "Loại … khác" chỉ hiện khi chọn mục mã ZLOAIKHAC ---------- */
    function ganKhac(c, dmCode, kDrop, kKhac) {
        var sel = c.root.querySelector('[data-scope="form"][data-k="' + kDrop + '"]');
        var inp = c.root.querySelector('[data-scope="form"][data-k="' + kKhac + '"]');
        if (!sel || !inp) return;
        var o = inp.closest('.ums-field').parentNode;
        ums.api.dm(dmCode).then(function (d) {
            function hien() {
                var r = d.filter(function (x) { return e(x.ID) === sel.value; })[0];
                o.hidden = !(r && e(r.MA) === 'ZLOAIKHAC');
            }
            hien();
            if (window.jQuery) jQuery(sel).off('.nkkhac').on('change.nkkhac select2:select.nkkhac select2:clear.nkkhac', hien);
            else sel.addEventListener('change', hien);
        }).catch(function () {});
    }
    var dmDeTai = { call: { action: 'NCKH_DanhMucDeTai/LayDanhSach', method: 'GET', strTuKhoa: '', strPhanLoaiDeTai_Id: '', strNguoiThucHien_Id: uid(),
        pageIndex: 1, pageSize: 100000 }, name: 'TENDETAI' };
    function ganDanhMuc(c) {
        var sel = c.root.querySelector('[data-scope="form"][data-k="strNCKH_SP_DanhMucDeTai_Id"]');
        if (!sel || !window.jQuery) return;
        function o(k) { return c.root.querySelector('[data-scope="form"][data-k="' + k + '"]'); }
        jQuery(sel).off('.nkdm').on('select2:select.nkdm', function () {
            ums.crud.loadSource(dmDeTai).then(function (d) {
                var r = d.filter(function (x) { return e(x.ID) === sel.value; })[0];
                if (!r) return;
                o('strTenDeTaiTiengViet').value = e(r.TENDETAI); o('strMaDeTai').value = e(r.MADETAI); o('strTenDeTaiTiengAnh').value = e(r.TENDETAITIENGANH);
                o('strPhanLoaiDeTai_Id').value = e(r.PHANLOAIDETAI_ID); jQuery(o('strPhanLoaiDeTai_Id')).trigger('change');
                o('strPhanLoaiDeTai_Khac').value = e(r.PHANLOAIDETAI_KHAC);
            });
        });
    }

    N.man(root, {
        tieuDe: 'Đề tài', dsTieuDe: 'Đề tài', icon: 'fa-microscope', formTitle: 'đề tài', ctl: 'NCKH_DeTai', xoaKhoa: 'strId',
        loiChao: 'Hôm nay bạn có đề tài mới không? Bấm Thêm mới ở đầu trang.',
        ten: function (r) { return e(r.TENDETAITIENGVIET); },
        ds: function (q) {
            return { iTinhTrang: -1, iTrangThai: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: uid(), strTuKhoaText: q.q, dTuKhoaNumber: -1, strNCKH_DeCuong_Id: '',
                strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: '', strNguonKinhPhi_Id: '', strThietKeNghienCuu_Id: '', strNCKH_ThanhVien_Id: uid(), strChucNang_Id: N.chucNang(),
                strDonVi_Id_CuaThanhVien_Id: '', strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strTinhTrang_Id: '', strPhanLoaiDeTai_Id: '', strTinhTrangXacNhan_Id: '',
                strNhanSu_TDKT_KeHoach_Id: q.nam, strNCKH_TinhDiem_KeHoach_Id: q.nam };
        },
        formCols: 12,
        fields: [
            { type: 'legend', label: 'Thông tin đề tài' },
            f('strMaDeTai', 'MADETAI', 'Mã đề tài'),
            f('strNCKH_SP_DanhMucDeTai_Id', 'NCKH_SP_DANHMUCDETAI_ID', 'Danh mục đề tài', { type: 'select', placeholder: 'Chọn đề tài từ danh mục', source: dmDeTai }),
            f('strTenDeTaiTiengViet', 'TENDETAITIENGVIET', 'Tên đề tài tiếng việt', { required: true, cols: 12 }),
            f('strTenDeTaiTiengAnh', 'TENDETAITIENGANH', 'Tên đề tài tiếng anh', { cols: 12 }),
            f('strMucTieu', 'MUCTIEU', 'Mục tiêu', { type: 'textarea', cols: 12 }),
            f('strDonViToChucCoDeTai', 'DONVITOCHUCCODETAI', 'Đơn vị chủ trì đề tài', { required: true }),
            f('strDonViThucHienDeTai', 'DONVITHUCHIENDETAI', 'Đơn vị thực hiện đề tài'),
            f('strLinhVucNghienCuu_Id', 'LINHVUCNGHIENCUU_ID', 'Lĩnh vực', { type: 'select', placeholder: 'Chọn lĩnh vực', source: { dm: 'NCKH.LVNC' } }),
            f('dSoTacGia_n', 'SOTACGIA_N', 'Tổng số tác giả', { required: true, type: 'number' }),
            f('strPhanLoaiDeTai_Id', 'PHANLOAIDETAI_ID', 'Loại đề tài', { type: 'select', required: true, placeholder: 'Chọn loại đề tài', source: { dm: 'NCKH.PLDT' } }),
            f('strPhanLoaiDeTai_Khac', 'PHANLOAIDETAI_KHAC', 'Loại đề tài khác'),
            f('dSoTacGiaTrongTruong_n', 'SOTACGIATRONGTRUONG_N', 'Số tác giả trong trường', { type: 'number' }),
            { type: 'gap', cols: 6 },
            f('strCapQuanLy_Id', 'CAPQUANLY_ID', 'Cấp quản lý', { type: 'select', placeholder: 'Chọn cấp quản lý', source: { dm: 'NCKH.CAPQUANLY' } }),
            f('strCapQuanLy_Khac', 'CAPQUANLY_KHAC', 'Cấp quản lý khác'),
            f('strThoiGianBatDau', 'THOIGIANBATDAU', 'Thời gian từ'),
            f('strThoiGianKetThuc', 'THOIGIANKETTHUC', 'Đến'),
            { type: 'legend', label: 'Sản phẩm khác' },
            f('strSanPhamKhac', 'SANPHAMKHAC', 'Sản phẩm khác', { type: 'textarea', cols: 12 }),
            { type: 'legend', label: 'Nội dung minh chứng' },
            f('strThongTinMinhChung', 'THONGTINMINHCHUNG', 'Nội dung', { cols: 12 }),
            { key: '_tep', type: 'files', api: 'NCKH_Files', label: 'File đính kèm', cols: 12 }
        ],
        khoi: [sanPham(), spUngDung, N.kinhPhi({ khoaThem: 'strId' }), donViHopTac, tienDo, ketQua, ghiChuKQ,
            N.thanhVien({ vaiTro: 'NCKH.VTDT', tieuDeTrong: 'Thành viên tham gia' }),
            N.khac({ key: 'strDanhSachCacThanhVienNgoai', col: 'DANHSACHCACTHANHVIENNGOAI' })],
        luu: function (v, row, x) {
            return { strNCKH_TinhDiem_KeHoach_Id: x.nam, strPhanLoaiDeTai_Khac: v.strPhanLoaiDeTai_Khac, strPhanLoaiDeTai_Id: v.strPhanLoaiDeTai_Id,
                strNCKH_SP_DanhMucDeTai_Id: v.strNCKH_SP_DanhMucDeTai_Id, strSanPhamKhac: v.strSanPhamKhac, strMucTieu: v.strMucTieu, strDiaDiemThucHienDeTai: '',
                strDonViToChucCoDeTai: v.strDonViToChucCoDeTai, strDonViThucHienDeTai: v.strDonViThucHienDeTai, strNCKH_DeCuong_Id: '', strMaDeTai: v.strMaDeTai,
                strTenDeTaiTiengViet: v.strTenDeTaiTiengViet, strTenDeTaiTiengAnh: v.strTenDeTaiTiengAnh, strCapQuanLy_Id: v.strCapQuanLy_Id,
                strQuyetDinhPheDuyetSo: '', strNgayPheDuyet: '', strThietKeNghienCuu_Id: '', strLinhVucNghienCuu_Id: v.strLinhVucNghienCuu_Id,
                dKinhPhi_n: '', strNguonKinhPhi_Id: '', strDonViTinh_Id: '', strThoiGianBatDau: v.strThoiGianBatDau, dSoThangThucHien_n: '',
                strThoiGianKetThuc: v.strThoiGianKetThuc, strThoiGianBaoCaoTienDo_Id: '', strCanBoNhapDeTai_Id: uid(), strDeTaiTuVanSo: '',
                strNguoiKyDeTaiTuVan: '', strNgayKyDeTaiTuVan: '', strThongTinMinhChung: v.strThongTinMinhChung, strTinhTrang_Id: '', strFileMinhChung: '',
                dSoTacGia_n: v.dSoTacGia_n, dSoTacGiaTrongTruong_n: v.dSoTacGiaTrongTruong_n, strChucNang_Id: N.chucNang(), iTinhTrang: 1, strNhaTaiTro: '',
                strDoiTac_Id: '', strQuocTich_Id: '', strThanhVien_Id: '', strVaiTro_Id: '', iTrangThai: 1, strTrangThai_ThanhVien: '', strThuTu_ThanhVien: '',
                strTyLeThamGia: '', strDanhSachCacThanhVienNgoai: x.strDanhSachCacThanhVienNgoai };
        },
        tim: { nut: 'Tìm đề tài', truong: 'strTenDeTaiTiengViet', title: 'Tìm kiếm đề tài', chonText: 'Chọn đề tài',
            cot: [{ title: 'Tên đề tài', prop: 'TENDETAITIENGVIET' }, { title: 'Tổ chức có đề tài', prop: 'DONVITOCHUCCODETAI' },
                { title: 'Lĩnh vực', prop: 'LINHVUCNGHIENCUU_TEN' }, { title: 'Thành viên', prop: 'DSTHANHVIEN_VAITRO' }],
            ds: function (m, nam) {
                return { iTinhTrang: -1, iTrangThai: -1, strCanBoNhapDeTai_Id: '', strThanhVien_Id: '', strTuKhoaText: m.q, dTuKhoaNumber: -1, strNCKH_DeCuong_Id: '',
                    strCapQuanLy_Id: '', strLinhVucNghienCuu_Id: m.linhVuc, strNguonKinhPhi_Id: '', strThietKeNghienCuu_Id: '', strNCKH_ThanhVien_Id: '',
                    strDonVi_Id_CuaThanhVien_Id: m.donVi, strNCKH_TinhDiem_KeHoach_Id: nam, strLoaiChucDanh_Id: '', strLoaiHocVi_Id: '', strTinhTrang_Id: '',
                    strPhanLoaiDeTai_Id: '', strTinhTrangXacNhan_Id: '', strNhanSu_TDKT_KeHoach_Id: '' };
            } },
        onForm: function (row, c) {
            ganKhac(c, 'NCKH.PLDT', 'strPhanLoaiDeTai_Id', 'strPhanLoaiDeTai_Khac');
            ganKhac(c, 'NCKH.CAPQUANLY', 'strCapQuanLy_Id', 'strCapQuanLy_Khac');
            ganDanhMuc(c);
        }
    });
})();
