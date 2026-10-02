/* =========================================================================
   phanlichgiang — "Danh sách mời giảng" (quản lý nhân sự NGOÀI trường) — ums.plg.moiGiang(host)
   host = gốc màn → MÀN CON mở TRONG TRANG (ums.pat.formTrang, BO-CUC luật 1); không truyền thì hộp thoại như trước.
   Bản gốc: edu.extend.genModal_NhanSu_NgoaiTruong (Corei/systemextend.js:807–1110).
   ---------------------------------------------------------------------------
   Lời gọi (chép nguyên, mã hoá):
       ums.ref.nhanSuPage (dLaCanBoNgoaiTruong 1) — danh sách, phân trang máy chủ
       NS_HoSo_V2_MH · pkg_nhansu_hoso_v2.Them_NhanSu_HoSo_v2 — thêm; SỬA đổi action sang
           …/EjQgHg8pIC8SNB4JLhIuHjdz nhưng GIỮ func Them_… (như gốc — kiểm trên host)
       66 tham số như gốc: strTen, strGioiTinh_Id, strEmail, strSDT_CaNhan, strNoiSinh_DiaChi
       (ô Địa chỉ), strLaCanBoNgoaiTruong 1, còn lại rỗng. Giới tính: danh mục NS.GITI.
   Giữ như bản gốc: cột "Chọn" (btnSelect_NgoaiTruong) không có xử lý ở màn phân giảng → bỏ cột.
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var plg = ums.plg = ums.plg || {};
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    var RONG = ('strMaSo, strHoDem, strTenGoiKhac, strNgaySinh, strThangSinh, strNamSinh, strNoiSinh_Xa_Id, strNoiSinh_Huyen_Id, strNoiSinh_Tinh_Id, ' +
        'strQueQuan_Xa_Id, strQueQuan_Huyen_Id, strQueQuan_Tinh_Id, strHKTT_DiaChi, strHKTT_Xa_Id, strHKTT_Huyen_Id, strHKTT_Tinh_Id, strNOHN_DiaChi, ' +
        'strNOHN_Xa_Id, strNOHN_Huyen_Id, strNOHN_Tinh_Id, strQuocTich_Id, strDanToc_Id, strTonGiao_Id, strTDPT_TotNghiepLop, strTDPT_He, strSoTruongCongTac, ' +
        'strThuongBinhHang_Id, strGiaDinhChinhSach_Id, strThanhPhanXuatThan_Id, strDang_NgayVao, strDang_NgayChinhThuc, strDang_NoiKetNap, strDoan_NgayVao, ' +
        'strDoan_NoiKetNap, strCongDoan_NgayVao, strNgu_NgayNhap, strNgu_NgayXuat, strNgu_QuanHam_Id, strCanCuoc_So, strCanCuoc_NgayCap, strCanCuoc_NoiCap, ' +
        'strNhanXet, strAnh, strSDT_CoQuan, strSDT_GiaDinh, strNgayTGCachMang, strNgayTGToChucChinhTriXH, strDaoTao_CoCauToChuc_Id, strSoBaoHiem, ' +
        'strLoaiDoiTuong_Id, strLoaiGiangVien_Id, strTinhTrangNhanSu_Id, strTinhTrangHonNhan_Id, strTuNhanXetBanThan, strTDPT_XepLoaiTotNghiep_Id, strQueQuan_DiaChi').split(', ');

    plg.moiGiang = function (host) {
        var sua = '', ds = [], trang = 1, co = 10;
        var dlg = (host ? pat.formTrang : ui.dialog)({ host: host, cols: 1, title: 'Tìm kiếm nhân sự ngoài trường', icon: 'fa-user-plus', size: 'xl', body:
            '<div class="ums-filter"><div class="ums-field"><input class="ums-input" data-m="q" placeholder="Tìm kiếm" autocomplete="off"></div>' +
                '<div class="ums-field ums-field--fit">' + ui.btn('search', { attr: { 'data-ma': 'tim' } }) + '</div></div>' +
            '<div class="ums-legend ums-legend--cach" data-m="tieude">Thêm mới - Nhân sự ngoài trường</div>' +
            '<div class="ums-grid ums-grid--4">' + ui.field('Họ tên', '<input class="ums-input" data-m="ten" autocomplete="off">', { required: true }) +
                ui.field('Giới tính', '<select class="ums-select" data-m="gt" data-ph="Chọn giới tính"><option value=""></option></select>') +
                ui.field('Email', '<input class="ums-input" data-m="email" autocomplete="off">') + ui.field('Số điện thoại', '<input class="ums-input" data-m="sdt" autocomplete="off">') + '</div>' +
            ui.field('Địa chỉ', '<input class="ums-input" data-m="dc" autocomplete="off">') +
            '<div class="ums-row ums-row--end">' + ui.btn('add', { text: 'Thêm nhân sự', attr: { 'data-ma': 'luu' } }) + '</div>' +
            '<div class="ums-legend ums-legend--cach">Danh sách</div><div data-m="bang"></div>' });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-m="' + k + '"]'); }
        ui.enhance(B);
        ums.api.dm('NS.GITI').then(function (d) { pat.fill(q('gt'), d, { name: 'TEN', head: 'Chọn giới tính' }); }).catch(function () {});
        function tai() {
            q('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            ums.ref.nhanSuPage({ strTuKhoa: q('q').value.trim(), strCoCauToChuc_Id: '', dLaCanBoNgoaiTruong: 1, pageIndex: trang, pageSize: co }).then(function (r) {
                ds = r.rows;
                ui.table({ el: q('bang'), rows: ds, empty: 'Chưa có nhân sự ngoài trường',
                    page: { index: trang, size: co, total: r.total, onChange: function (p) { trang = p; tai(); }, onSize: function (s) { co = s; trang = 1; tai(); } },
                    columns: [{ title: 'Họ tên', render: function (x) { return esc(e(x.HOTEN) || (e(x.HODEM) + ' ' + e(x.TEN))); } }, { title: 'Giới tính', prop: 'GIOITINH_TEN', cls: 'is-center' },
                        { title: 'Email', prop: 'EMAIL' }, { title: 'Số điện thoại', prop: 'SDT_CANHAN' },
                        { title: 'Sửa', cls: 'is-center', width: '60px', render: function (x, i) { return '<button type="button" class="ums-iconbtn ums-iconbtn--edit" data-msua="' + i + '" title="Sửa"><i class="fa-light fa-pen-to-square"></i></button>'; } }] });
            }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); });
        }
        function datForm() {
            sua = ''; ['ten', 'email', 'sdt', 'dc'].forEach(function (k) { q(k).value = ''; }); q('gt').value = ''; if (window.jQuery) jQuery(q('gt')).trigger('change.select2');
            q('tieude').textContent = 'Thêm mới - Nhân sự ngoài trường'; B.querySelector('[data-ma="luu"] span').textContent = 'Thêm nhân sự';
        }
        function luu() {
            if (!q('ten').value.trim()) { ui.toast('Nhập họ tên', 'warn'); return; }
            var x = { action: sua ? 'NS_HoSo_V2_MH/EjQgHg8pIC8SNB4JLhIuHjdz' : 'NS_HoSo_V2_MH/FSkkLB4PKSAvEjQeCS4SLh43cwPP', func: 'pkg_nhansu_hoso_v2.Them_NhanSu_HoSo_v2',
                strId: sua, strTen: q('ten').value.trim(), strGioiTinh_Id: q('gt').value, strEmail: q('email').value.trim(), strSDT_CaNhan: q('sdt').value.trim(),
                strNoiSinh_DiaChi: q('dc').value.trim(), strLaCanBoNgoaiTruong: 1, strNguoiThucHien_Id: uid() };
            RONG.forEach(function (k) { x[k] = ''; });
            ums.api.call(x).then(function () { ui.toast(sua ? 'Cập nhật thành công' : 'Thêm mới thành công', 'ok'); datForm(); tai(); }).catch(function (err) { ums.api.handle(err, 'lưu nhân sự'); });
        }
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-msua]');
            if (b) {
                var r = ds[Number(b.getAttribute('data-msua'))]; sua = r.ID;
                q('ten').value = e(r.TEN); q('email').value = e(r.EMAIL); q('sdt').value = e(r.SDT_CANHAN); q('dc').value = e(r.DIACHI);
                q('gt').value = e(r.GIOITINH_ID); if (window.jQuery) jQuery(q('gt')).trigger('change.select2');
                q('tieude').textContent = 'Chỉnh sửa - Nhân sự ngoài trường'; B.querySelector('[data-ma="luu"] span').textContent = 'Cập nhật';
                return;
            }
            if ((b = ev.target.closest('[data-ma]'))) { if (b.getAttribute('data-ma') === 'tim') { trang = 1; tai(); } else luu(); }
        });
        q('q').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); trang = 1; tai(); } });
        tai();
        return dlg;
    };
})();
