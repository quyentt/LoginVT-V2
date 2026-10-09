/* =========================================================================
   Thông tin lý lịch — cán bộ tự cập nhật hồ sơ của mình
   Bản gốc: ApisCongCanBo/Modules/hoso/script/capnhathoso.js + html/capnhathoso.html
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không mã hoá, chép nguyên):
       NS_HoSoV2/LayChiTiet   GET   strId = userId          → đổ biểu mẫu
       NS_HoSoV2/CapNhat      POST  strId = userId + ~70 tham số (dưới)
       NS_HoSoV2/KeThua       POST  sau khi lưu (bản gốc: save_AnhHoSo)
       In mẫu 2C: edu.system.report("2C_2008") → ums.report.run('2C_2008'),
           khoá strOutputType = DOCX, strNhanSu_Id = userId.
   Ảnh: ums.files.avatar 336×448 (uploadAvatar); lưu thì strAnh = ảnh đã chép
   sang tên chính thức (getImage). Địa chỉ nơi sinh / quê quán / hộ khẩu /
   nơi ở: ums.pat.diaChi (setTinhThanh) → strX_DiaChi + strX_Tinh/Huyen/Xa_Id.
   Tham số "#" = KHÔNG cập nhật cột đó (quy ước của procedure) — chép nguyên:
   mã số, họ đệm, tên, ngày/tháng/năm sinh, nhận xét, loại đối tượng, loại
   giảng viên, tình trạng nhân sự.

   Khác bản gốc:
     · Ngày / Tháng / Năm sinh: bản gốc cho sửa nhưng luôn gửi "#" nên sửa
       không có tác dụng — ở đây khoá như Họ tên (cùng lý do).
     · Đơn vị, Chức danh nghề nghiệp: bản gốc đặt `readonly` trên <select>
       (trình duyệt bỏ qua, vẫn đổi được) — ở đây khoá thật; giá trị vẫn gửi.
     · Tab "Túi hồ sơ": khung tệp txtThongTinDinhKem không bao giờ được bật
       và nút Lưu (btnHS_Save_TuiHoSo) không có trình xử lý — tab còn, nút khoá.
   Giữ như bản gốc: "Email *" có dấu * nhưng không bắt buộc; bản gốc gửi
   strLinhVucNghienCuu hai lần (lần sau thắng: ô Hướng nghiên cứu chính).

   DÙNG LẠI ở bản quản trị Nhân sự (ApisNhanSu/Modules/hoso/capnhatv2 — cán bộ
   nhân sự chọn một người rồi sửa): ums.ccbHoSo.mount(root, { nhanSuId, tieuDe, quanTri }).
     nhanSuId()  id hồ sơ đang sửa (LayChiTiet / CapNhat strId, KeThua, In 2C);
                 mặc định người đăng nhập.
     tieuDe      false = không vẽ tiêu đề trang (khung lồng).
     quanTri     true = khác biệt của bản NS (capnhatv2.js gốc):
                 · Mã số, Họ đệm, Tên, Ngày/Tháng/Năm sinh, Chức danh nghề nghiệp SỬA ĐƯỢC
                   và gửi giá trị thật (Cổng cán bộ gửi "#");
                 · Tình trạng / Loại đối tượng / Loại giảng viên là ô CHỌN (NS.TTNS,
                   NS.LTNS, NS.LGV0) đọc cột …_ID, gửi giá trị thật (Cổng cán bộ: chữ chỉ đọc, "#");
                 · không có tab "Túi hồ sơ" (gốc NS một tab → không vẽ dải tab).
   Mặc định giữ nguyên hành vi Cổng cán bộ: tự dựng vào #capnhathoso nếu có.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, pat = ums.pat;
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }

    function mount(root, mo) {
        mo = mo || {};
        var qt = !!mo.quanTri;
        function ns() { return mo.nhanSuId ? mo.nhanSuId() : uid(); }
        root.classList.add('hoso-ccb');

        /* ---------- Dựng biểu mẫu (bố cục theo bản gốc, lưới 12 phần) ---------- */
        function o(k, lab, cols, opt) {
            opt = opt || {};
            var ctl;
            if (opt.sel) ctl = '<select class="ums-select" data-k="' + k + '"' + (opt.ro ? ' disabled' : '') + ' data-ph="' + esc(opt.ph || 'Chọn') + '"><option value=""></option></select>';
            else if (opt.area) ctl = '<textarea class="ums-textarea" data-k="' + k + '"></textarea>';
            else ctl = '<input class="ums-input" data-k="' + k + '" autocomplete="off"' + (opt.ro ? ' readonly' : '') +
                (opt.date ? ' data-date placeholder="dd/mm/yyyy"' : '') + (opt.ph && !opt.date ? ' placeholder="' + esc(opt.ph) + '"' : '') + '>';
            return '<div style="grid-column:span ' + cols + '">' + ui.field(lab, ctl) + '</div>';
        }
        function nhom(t) { return '<div class="ums-legend ums-u-mb-0" style="grid-column:1 / -1">' + esc(t) + '</div>'; }
        function luoi(h) { return '<div class="ums-grid ums-grid--12">' + h + '</div>'; }

        var coBan =
            '<div class="hoso-coban">' +
                '<div class="hoso-coban__anh" data-z="anh"></div>' +
                '<div class="hoso-coban__o">' + luoi(
                    o('HODEM', 'Họ đệm', 3, { ro: !qt }) + o('TEN', 'Tên', 3, { ro: !qt }) + o('TENGOIKHAC', 'Bí danh', 6) +
                    o('NGAYSINH', 'Ngày sinh', 2, { ro: !qt }) + o('THANGSINH', 'Tháng', 2, { ro: !qt }) + o('NAMSINH', 'Năm', 2, { ro: !qt }) +
                    o('GIOITINH_ID', 'Giới tính', 6, { sel: 1 }) +
                    o('TINHTRANGHONNHAN_ID', 'Hôn nhân', 6, { sel: 1 }) + o('QUOCTICH_ID', 'Quốc tịch', 6, { sel: 1 }) +
                    o('DANTOC_ID', 'Dân tộc', 6, { sel: 1 }) + o('TONGIAO_ID', 'Tôn giáo', 6, { sel: 1 }) +
                    o('THANHPHANXUATTHAN_ID', 'Hoàn cảnh xuất thân', 6, { sel: 1 }) + o('GIADINHCHINHSACH_ID', 'Gia đình chính sách', 6, { sel: 1 })) +
                '</div>' +
            '</div>';

        var conLai = luoi(
            nhom('Thông tin cán bộ') +
            o('MASO', 'Mã số', 6, { ro: !qt }) +
            (qt ? o('TINHTRANGNHANSU_ID', 'Tình trạng', 6, { sel: 1 }) +
                  o('LOAIDOITUONG_ID', 'Loại đối tượng', 6, { sel: 1 }) + o('LOAIGIANGVIEN_ID', 'Loại giảng viên', 6, { sel: 1 })
                : o('TINHTRANGNHANSU_TEN', 'Tình trạng', 6, { ro: 1 }) +
                  o('LOAIDOITUONG_TEN', 'Loại đối tượng', 6, { ro: 1 }) + o('LOAIGIANGVIEN_TEN', 'Loại giảng viên', 6, { ro: 1 })) +
            o('DAOTAO_COCAUTOCHUC_ID', 'Đơn vị', 6, { sel: 1, ro: 1 }) + o('MASOTHUE', 'Mã số thuế', 6) +
            o('LOAICHUCDANHNGHENGHIEP_ID', 'Chức danh nghề nghiệp', 12, { sel: 1, ro: !qt }) +
            o('TRINHDOCHUYENMONCN_TEN', 'Trình độ chuyên môn cao nhất', 12, { ro: 1 }) +
            nhom('Các mốc thời gian quan trọng') +
            o('THOIGIAN_VAOTRUONG', 'Ngày bắt đầu vào trường', 6, { date: 1 }) + o('THOIGIAN_VAONGANHGIAODUC', 'Ngày bắt đầu vào ngành giáo dục', 6, { date: 1 }) +
            o('THOIGIAN_VAOBIENCHE', 'Ngày vào biên chế', 6, { date: 1 }) + o('THOIGIAN_TINHBHXH', 'Ngày bắt đầu đóng bảo hiểm xã hội', 6, { date: 1 }) +
            nhom('Thông tin liên lạc') +
            o('EMAIL', 'Email *', 6) + o('SDT_CANHAN', 'Số di động', 6) +
            o('SDT_COQUAN', 'Số cơ quan', 6) + o('SDT_GIADINH', 'Số gia đình', 6) +
            nhom('Số CMND (Căn cước), bảo hiểm') +
            o('CANCUOC_SO', 'Số CMND', 6) + o('CANCUOC_NGAYCAP', 'Ngày cấp', 6, { date: 1 }) +
            o('CANCUOC_NOICAP', 'Nơi cấp', 6) + o('SOBAOHIEM', 'Số sổ BH', 6) +
            nhom('Địa chỉ') +
            o('_NOISINH', 'Nơi sinh', 12) + o('_QUEQUAN', 'Quê quán', 12) +
            o('_HKTT', 'Hộ khẩu thường trú', 12) + o('_NOHN', 'Nơi ở hiện nay', 12) +
            nhom('Đảng viên') +
            o('DANG_NGAYVAO', 'Ngày vào', 6, { date: 1 }) + o('DANG_NGAYCHINHTHUC', 'Chính thức', 6, { date: 1 }) +
            o('DANG_NOIKETNAP', 'Nơi kết nạp', 12) +
            nhom('Quân ngũ') +
            o('NGU_NGAYNHAP', 'Ngày nhập', 6, { date: 1 }) + o('NGU_NGAYXUAT', 'Ngày xuất', 6, { date: 1 }) +
            o('NGU_QUANHAM_ID', 'Quân hàm', 6, { sel: 1 }) + o('THUONGBINHHANG_ID', 'Thương binh', 6, { sel: 1 }) +
            nhom('Đoàn viên') +
            o('DOAN_NGAYVAO', 'Ngày vào', 6, { date: 1 }) + o('DOAN_NOIKETNAP', 'Nơi kết nạp', 6) +
            nhom('Công đoàn') +
            o('CONGDOAN_NGAYVAO', 'Ngày vào', 6, { date: 1 }) + '<div style="grid-column:span 6"></div>' +
            nhom('Thông tin khác') +
            o('TDPT_TOTNGHIEPLOP', 'Trình độ GD phổ thông', 4) + o('TDPT_HE', 'Hệ', 4) + o('TDPT_XEPLOAITOTNGHIEP_ID', 'Xếp loại tốt nghiệp phổ thông', 4, { sel: 1 }) +
            o('HOCVI_TEN', 'Học vị cao nhất', 4, { ro: 1 }) + o('NGAYTGCACHMANG', 'Ngày T/G cách mạng', 4, { date: 1 }) + o('NGAYTGTOCHUCCHINHTRIXH', 'Ngày T/G TCCTXH', 4, { date: 1 }) +
            o('SOTRUONGCONGTAC', 'Sở trường công tác', 12) +
            o('LINHVUCNGHIENCUU', 'Hướng nghiên cứu chính', 12, { area: 1 }) +
            nhom('Thông tin hợp đồng') +
            o('HINHTHUCTUYENDUNG_TEN', 'Hình thức tuyển dụng', 4, { ro: 1 }) + o('LOAIHOPDONG_TEN', 'Loại hợp đồng', 4, { ro: 1 }) +
            o('CONGVIECPHAILAM', 'Công việc chính được giao', 4, { ro: 1 }));

        root.innerHTML =
            (mo.tieuDe === false ? '' : pat.page(mo.tieuDe || 'Thông tin lý lịch', '')) +
            (qt ? '' : '<nav class="ums-tabs ums-u-mb-4">' +
                '<a class="ums-tabs__item is-active" href="javascript:void(0)" data-tab="ll"><i class="fa-light fa-id-card"></i> Thông tin lý lịch</a>' +
                '<a class="ums-tabs__item" href="javascript:void(0)" data-tab="tui"><i class="fa-light fa-address-card"></i> Túi hồ sơ</a>' +
            '</nav>') +
            '<div data-pane="ll">' + pat.panel({
                title: 'Thông tin cơ bản', icon: 'fa-user',
                tools: ui.btn('save', { text: 'In mẫu 2C', icon: 'fa-print', attr: { 'data-a': 'in' } }) +
                       ui.btn('save', { text: 'Lưu', mod: 'primary', attr: { 'data-a': 'luu' } }),
                body: coBan + '<div class="ums-u-mt-4">' + conLai + '</div>'
            }) + '</div>' +
            (qt ? '' : '<div data-pane="tui" hidden>' + pat.panel({
                title: 'Túi hồ sơ', icon: 'fa-folder-open',
                tools: ui.btn('save', { text: 'Lưu', mod: 'primary', attr: { disabled: 'disabled', title: 'Bản gốc chưa có xử lý lưu túi hồ sơ' } }),
                body: ui.empty('Túi hồ sơ chưa dùng được: bản gốc chưa bật khung tải tệp và nút Lưu không có xử lý.', 'fa-screwdriver-wrench')
            }) + '</div>');

        function k(key) { return root.querySelector('[data-k="' + key + '"]'); }
        function v(key) { var el = k(key); return el ? (el.value || '').trim() : ''; }

        var anh = ums.files.avatar(root.querySelector('[data-z="anh"]'), { width: 336, height: 448 });
        var DC = { NOISINH: '_NOISINH', QUEQUAN: '_QUEQUAN', HKTT: '_HKTT', NOHN: '_NOHN' };
        var diaChi = {};
        Object.keys(DC).forEach(function (c) { diaChi[c] = pat.diaChi(k(DC[c])); });
        ui.enhance(root);

        /* ---------- Danh mục ---------------------------------------------------- */
        var DM = {
            GIOITINH_ID: 'NS.GITI', TINHTRANGHONNHAN_ID: 'NS.TTHN', QUOCTICH_ID: 'CHUN.CHLU', DANTOC_ID: 'NS.DATO',
            TONGIAO_ID: 'NS.TOGI', THANHPHANXUATTHAN_ID: 'NS.TPXT', GIADINHCHINHSACH_ID: 'NS.GDCS',
            LOAICHUCDANHNGHENGHIEP_ID: 'NS.CDNN', NGU_QUANHAM_ID: 'NS.QUHA', THUONGBINHHANG_ID: 'NS.TBH0',
            TDPT_XEPLOAITOTNGHIEP_ID: 'QLCB.LOTN'
        };
        if (qt) { DM.TINHTRANGNHANSU_ID = 'NS.TTNS'; DM.LOAIDOITUONG_ID = 'NS.LTNS'; DM.LOAIGIANGVIEN_ID = 'NS.LGV0'; }
        var nap = Object.keys(DM).map(function (key) {
            return ums.api.dm(DM[key]).then(function (r) { pat.fill(k(key), r); }, function () { /* thiếu danh mục thì để trống */ });
        });
        nap.push(ums.ref.coCauToChuc({}).then(function (r) { pat.fill(k('DAOTAO_COCAUTOCHUC_ID'), r, { head: 'Chọn đơn vị' }); },
            function (err) { ums.api.handle(err, 'nạp cơ cấu tổ chức'); }));

        /* ---------- Đổ hồ sơ ---------------------------------------------------- */
        function doHoSo(d) {
            d = d || {};
            Array.prototype.forEach.call(root.querySelectorAll('[data-k]'), function (el) {
                var key = el.getAttribute('data-k');
                if (key.charAt(0) === '_') return;
                el.value = e(d[key]);
                if (el.tagName === 'SELECT' && window.jQuery) jQuery(el).trigger('change.select2');
                if (el._flatpickr) el._flatpickr.setDate(e(d[key]) || null, false, 'd/m/Y');
            });
            Object.keys(DC).forEach(function (c) {
                diaChi[c].set(d[c + '_TINH_ID'], d[c + '_HUYEN_ID'], d[c + '_XA_ID'], d[c + '_DIACHI']);
            });
            anh.set(d.ANH);
        }
        function taiHoSo() {
            return Promise.all(nap).then(function () {
                return ums.api.call({ action: 'NS_HoSoV2/LayChiTiet', method: 'GET', strId: ns() });
            }).then(function (r) {
                doHoSo(Array.isArray(r.data) ? r.data[0] : r.data);
            }).catch(function (err) { ums.api.handle(err, 'nạp hồ sơ'); });
        }
        taiHoSo();

        /* ---------- Lưu --------------------------------------------------------- */
        function luu(btn) {
            btn.disabled = true;
            anh.finalize(uid()).then(function (duongAnh) {
                var x = {
                    action: 'NS_HoSoV2/CapNhat',
                    strId: ns(),
                    strMaSo: qt ? v('MASO') : '#', strHoDem: qt ? v('HODEM') : '#', strTen: qt ? v('TEN') : '#',
                    strTenGoiKhac: v('TENGOIKHAC'),
                    strNgaySinh: qt ? v('NGAYSINH') : '#', strThangSinh: qt ? v('THANGSINH') : '#', strNamSinh: qt ? v('NAMSINH') : '#',
                    strGioiTinh_Id: v('GIOITINH_ID'),
                    strQuocTich_Id: v('QUOCTICH_ID'),
                    strDanToc_Id: v('DANTOC_ID'),
                    strTonGiao_Id: v('TONGIAO_ID'),
                    strTDPT_TotNghiepLop: v('TDPT_TOTNGHIEPLOP'),
                    strTDPT_He: v('TDPT_HE'),
                    strSoTruongCongTac: v('SOTRUONGCONGTAC'),
                    strThuongBinhHang_Id: v('THUONGBINHHANG_ID'),
                    strGiaDinhChinhSach_Id: v('GIADINHCHINHSACH_ID'),
                    strThanhPhanXuatThan_Id: v('THANHPHANXUATTHAN_ID'),
                    strDang_NgayVao: v('DANG_NGAYVAO'),
                    strDang_NgayChinhThuc: v('DANG_NGAYCHINHTHUC'),
                    strDang_NoiKetNap: v('DANG_NOIKETNAP'),
                    strDoan_NgayVao: v('DOAN_NGAYVAO'),
                    strDoan_NoiKetNap: v('DOAN_NOIKETNAP'),
                    strCongDoan_NgayVao: v('CONGDOAN_NGAYVAO'),
                    strNgu_NgayNhap: v('NGU_NGAYNHAP'),
                    strNgu_NgayXuat: v('NGU_NGAYXUAT'),
                    strNgu_QuanHam_Id: v('NGU_QUANHAM_ID'),
                    strCanCuoc_So: v('CANCUOC_SO'),
                    strCanCuoc_NgayCap: v('CANCUOC_NGAYCAP'),
                    strCanCuoc_NoiCap: v('CANCUOC_NOICAP'),
                    strNhanXet: '#',
                    strEmail: v('EMAIL'),
                    strAnh: duongAnh,
                    strSDT_CaNhan: v('SDT_CANHAN'),
                    strSDT_CoQuan: v('SDT_COQUAN'),
                    strSDT_GiaDinh: v('SDT_GIADINH'),
                    strNgayTGCachMang: v('NGAYTGCACHMANG'),
                    strNgayTGToChucChinhTriXH: v('NGAYTGTOCHUCCHINHTRIXH'),
                    strLoaiHopDongLaoDong_Id: '',
                    strLoaiDoiTuong_Id: qt ? v('LOAIDOITUONG_ID') : '#',
                    strLoaiGiangVien_Id: qt ? v('LOAIGIANGVIEN_ID') : '#',
                    strDaoTao_CoCauToChuc_Id: v('DAOTAO_COCAUTOCHUC_ID'),
                    strNguoiThucHien_Id: uid(),
                    strSoBaoHiem: v('SOBAOHIEM'),
                    strTinhTrangHonNhan_Id: v('TINHTRANGHONNHAN_ID'),
                    strTinhTrangNhanSu_Id: qt ? v('TINHTRANGNHANSU_ID') : '#',
                    strTDPT_XepLoaiTotNghiep_Id: v('TDPT_XEPLOAITOTNGHIEP_ID'),
                    strCongViecChinhDuocGiao: v('CONGVIECPHAILAM'),
                    strLoaiChucDanhNgheNghiep_Id: v('LOAICHUCDANHNGHENGHIEP_ID'),
                    strLaCanBoNgoaiTruong: '0',
                    strMaSoThue: v('MASOTHUE'),
                    strThoiGian_VaoTruong: v('THOIGIAN_VAOTRUONG'),
                    strThoiGian_VaoNganhGiaoDuc: v('THOIGIAN_VAONGANHGIAODUC'),
                    strThoiGian_VaoBienChe: v('THOIGIAN_VAOBIENCHE'),
                    strThoiGian_TinhBHXH: v('THOIGIAN_TINHBHXH'),
                    strLinhVucNghienCuu: v('LINHVUCNGHIENCUU')
                };
                var TEN = { NOISINH: 'NoiSinh', QUEQUAN: 'QueQuan', HKTT: 'HKTT', NOHN: 'NOHN' };
                Object.keys(TEN).forEach(function (c) {
                    var g = diaChi[c].get(), p = 'str' + TEN[c] + '_';
                    x[p + 'DiaChi'] = g.them; x[p + 'Xa_Id'] = g.xa; x[p + 'Huyen_Id'] = g.huyen; x[p + 'Tinh_Id'] = g.tinh;
                });
                return ums.api.call(x);
            }).then(function () {
                ui.toast('Cập nhật thành công', 'ok');
                return ums.api.call({ action: 'NS_HoSoV2/KeThua', strNhanSu_HoSo_v2_Id: ns(), strNguoiThucHien_Id: uid(), silent: true })
                    .catch(function (err) { ums.api.handle(err, 'đồng bộ ảnh hồ sơ'); });
            }).then(taiHoSo).catch(function (err) { ums.api.handle(err, 'lưu hồ sơ'); })
              .then(function () { btn.disabled = false; });
        }

        root.addEventListener('click', function (ev) {
            var t = ev.target.closest('[data-tab]');
            if (t) {
                var key = t.getAttribute('data-tab');
                Array.prototype.forEach.call(root.querySelectorAll('[data-tab]'), function (a) { a.classList.toggle('is-active', a === t); });
                Array.prototype.forEach.call(root.querySelectorAll('[data-pane]'), function (p) { p.hidden = p.getAttribute('data-pane') !== key; });
                return;
            }
            var b = ev.target.closest('[data-a]');
            if (!b) return;
            if (b.getAttribute('data-a') === 'luu') luu(b);
            if (b.getAttribute('data-a') === 'in') {
                ums.report.run('2C_2008', { collect: function (add) { add('strOutputType', 'DOCX'); add('strNhanSu_Id', ns()); } });
            }
        });
    }

    ums.ccbHoSo = { mount: mount };
    var goc = document.getElementById('capnhathoso');
    if (goc) mount(goc);
})();
