/* =========================================================================
   Lịch phòng — lịch tuần của MỘT phòng học + đăng ký / duyệt mượn phòng
   Bản gốc: ApisCongCanBo/Modules/lichgiang/html/lichgiangphonghoc.html + script/lichgiangphonghoc.js
   (bản gốc là một bản chép của lichgiang.js — cùng tên lớp LichGiang)
   ---------------------------------------------------------------------------
   Bố cục bản gốc: cột trái (col-9) "Lịch phòng" — ô Phòng học + 4 nút + lưới
   tuần; cột phải (col-3) lịch tháng. Lịch tuần / lịch tháng / hộp điểm danh:
   tầng chung ums.lich (assets/js/lich.js).

   Lời gọi (chép nguyên):
       NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayDSPhongHoc          ô phòng (màn, hộp đăng ký, hộp duyệt)
       NS_ThongTinCanBo_MH · pkg_congthongtincanbo.LayLichPhongHoc        lịch tuần (strIdPhongHoc)
       SV_CamXuc_MH · pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop            cảm xúc — mỗi buổi một lời gọi như gốc
       DKH_MuonPhong_MH · PKG_CORE_DANGKY_MUONPHONG.
           Pr_Tkb_Dk_Phong_Tg_Ins / _Check                                  gửi yêu cầu / kiểm tra lịch trùng
           Pr_Tkb_DangKy_Phong_Get_List                                     đánh dấu ngày · danh sách theo ngày · kết quả cá nhân
           Pr_Tkb_DK_TT_Get_By_User                                         các trạng thái xác nhận
           LayDSTKB_DangKy_Duyet                                            lịch sử duyệt
           Pr_Tkb_DangKy_Duyet_Insert                                       duyệt — mỗi dòng đã chọn một lời gọi
   Hộp điểm danh: kiểu chuyên cần lấy từ danh mục QLSV.KIEUCHUYENCAN, cột 2
   "Số buổi vắng tích lũy" — đúng như bản gốc của màn này.

   Không chép (lỗi rõ của bản gốc):
     · A-B1 hai lịch tháng cùng lớp ".days" — bấm lịch trong hộp Duyệt làm hỏng
       lịch chính và ngược lại. Ở đây hai lịch hai khung riêng.
     · Chưa chọn phòng vẫn gọi LayLichPhongHoc với strIdPhongHoc rỗng (và gọi
       trước khi ô phòng nạp xong). Ở đây chưa chọn phòng thì lưới trống kèm lời nhắc.
     · Đánh dấu ngày có đăng ký ở hộp Duyệt: ngày của tháng khác bị parseInt
       thành "ngày 22" của tháng đang xem. Ở đây chỉ đánh dấu ngày thuộc tháng đang xem.
     · Ô phòng ở hộp Duyệt có hai tuỳ chọn rỗng ("Chọn phòng học" + "Tất cả phòng") → còn một.
     · Dòng không tìm được ID thật: gốc bịa "FAKE_…" rồi vẫn gửi lên
       Pr_Tkb_DangKy_Duyet_Insert. Ở đây dòng đó không có ô chọn.
     · Hộp đăng ký không kiểm gì — ở đây bắt buộc Phòng, Ngày, Giờ bắt đầu/kết thúc.
     · "Đăng ký sử dụng phòng" (modal ở bản gốc) → biểu mẫu TRONG TRANG thay chỗ lịch (ums.pat.formTrang, BO-CUC luật 1).
   Giữ như bản gốc (chờ nghiệp vụ):
     · A-B22 ai mở màn này cũng điểm danh được mọi lớp học trong phòng.
     · Nút xoá ở "Kết quả cá nhân" không có xử lý → giữ nút, đặt disabled.
     · Duyệt không hỏi lại; lịch sử duyệt chỉ hiện của dòng ĐẦU TIÊN đã chọn.
     · Tên cột trả về của Pr_Tkb_DangKy_Phong_Get_List chưa từng được xác nhận
       (bản gốc dò nhiều tên) — giữ nguyên danh sách tên dò. Kiểm trên host.
     · Không có nút báo cáo (html gốc không có vùng zonebtnBaoCao_LichGiang).
   Bỏ: getList_HocKy (đổ vào ô không tồn tại), cụm đổi lịch / phê duyệt đổi
   lịch (nút mở đã bị chú thích, bảng #tblDoiLich không có — không đường vào).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('lg-lichgiangphonghoc');
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function esc(s) { return ui.esc(s); }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : (d && Array.isArray(d.rs) ? d.rs : []); }
    function lay(r, ks) { for (var i = 0; i < ks.length; i++) { var v = r[ks[i]]; if (v !== null && v !== undefined && v !== '') return v; } return ''; }
    function hai(n) { return ums.lich.hai(n); }
    var EMO = '../assets/images/eval-emoji/';
    var MP = 'DKH_MuonPhong_MH/', PKG = 'PKG_CORE_DANGKY_MUONPHONG.';
    /* THONGTINGIANGVIEN là HTML dựng sẵn (các giảng viên cách nhau <br>) */
    function giangVien(s) { return esc(String(e(s)).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')).replace(/\n/g, '<br>'); }

    root.innerHTML =
        pat.page('Lịch phòng', '') +
        '<div class="lg-trang">' +
            '<div class="lg-trang__chinh">' + pat.panel({
                title: 'Lịch phòng', icon: 'fa-door-open', count: 'phTen',
                body: '<div class="lgp-bar"><label>Phòng học</label><select class="ums-select" data-f="phong" data-ph="Chọn phòng học"><option value=""></option></select>' +
                    ui.btn('search', { text: 'Danh sách', attr: { 'data-a': 'ds' } }) +
                    ui.btn('add', { text: 'Đăng ký sử dụng phòng', icon: 'fa-calendar-plus', attr: { 'data-a': 'dangky' } }) +
                    ui.btn('save', { text: 'Duyệt đăng ký', icon: 'fa-calendar-check', mod: 'out-primary', attr: { 'data-a': 'duyet' } }) +
                    ui.btn('search', { text: 'Kết quả cá nhân', icon: 'fa-list-check', mod: 'out-primary', attr: { 'data-a': 'ketqua' } }) + '</div>' +
                    '<div data-z="tuan"></div>'
            }) + '</div>' +
            '<aside class="lg-trang__phu"><div data-z="thang"></div></aside>' +
        '</div>';
    ui.enhance(root);
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    var fPhong = root.querySelector('[data-f="phong"]');

    /* ---------- Danh sách phòng (dùng ở ba chỗ, nạp một lần) ------------- */
    var dsPhong = null;
    function napPhong() {
        if (dsPhong) return Promise.resolve(dsPhong);
        return ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4BRIRKS4vJgkuIgPP', func: 'pkg_congthongtincanbo.LayDSPhongHoc', strNguoiThucHien_Id: uid() })
            .then(function (r) { dsPhong = arr(r.data); return dsPhong; });
    }
    napPhong().then(function (d) { pat.fill(fPhong, d, { name: 'TEN' }); }).catch(function (err) { ums.api.handle(err, 'phòng học'); });

    /* ---------- Lịch tuần ------------------------------------------------ */
    function noiDung(r) {
        return '<b>' + esc(e(r.TENHOCPHAN)) + '</b><span class="ums-ltuan__tg">' + esc(ums.lich.khungGio(r)) + ' (Tiết ' + esc(e(r.TIETBATDAU)) + '-' + esc(e(r.TIETKETTHUC)) + ')</span>' +
            '<div>' + giangVien(r.THONGTINGIANGVIEN) + '</div><div class="ums-ltuan__cx" data-cx="' + esc(r.ID) + '"></div>';
    }
    var cfg = {
        thang: z('thang'), tuan: z('tuan'), mau: 'IDLOPHOCPHAN', noiDung: noiDung, empty: 'Chọn phòng học để xem lịch',
        load: function (t) {
            if (!fPhong.value) { cfg.empty = 'Chọn phòng học để xem lịch'; return Promise.resolve([]); }
            cfg.empty = 'Tuần này phòng không có lịch';
            return ums.api.call({ action: 'NS_ThongTinCanBo_MH/DSA4DSgiKREpLi8mCS4i', func: 'pkg_congthongtincanbo.LayLichPhongHoc',
                strIdPhongHoc: fPhong.value, strNgayBatDau: t.batdau, strNgayKetThuc: t.ketthuc }).then(function (r) { return arr(r.data); });
        },
        danhDau: function (ds) { return ds.length ? String(e(ds[0].DSNGAYCOLICH)).split(',') : []; },
        sauKhiVe: function (ds, host) {
            ds.forEach(function (r) {
                ums.api.call({ action: 'SV_CamXuc_MH/DSA4FRUCICwZNCIVLi8mCS4x', func: 'pkg_dg_camxuc_nguoihoc.LayTTCamXucTongHop', silent: true,
                    strDiem_DanhSachHoc_Id: e(r.IDLOPHOCPHAN), strNgayGhiNhan: e(r.NGAYHOC), dGio: e(r.GIOBATDAU), dPhut: e(r.PHUTBATDAU), dGiay: 0, strNguoiThucHien_Id: uid() })
                    .then(function (x) {
                        var el = host.querySelector('[data-cx="' + r.ID + '"]');
                        if (el) el.innerHTML = arr(x.data).map(function (c) {
                            return '<span><img alt="" src="' + esc(EMO + e(c.DG_CHUCNANG_CHUDE_CHITIET_ANH)) + '">' + (c.SOLUONG ? ' ' + esc(c.SOLUONG) : '') + '</span>';
                        }).join('');
                    }).catch(function () {});
            });
        },
        onClick: function (r) {
            if (!e(r.TENLOPHOCPHAN)) return;                     // bản gốc: buổi không có lớp thì bấm không mở
            ums.lich.diemDanh(r, { kieuTuDanhMuc: true, cot2: 'Số buổi vắng tích lũy' });
        }
    };
    var L = ums.lich.tao(cfg);
    function taiLai() {
        var p = (dsPhong || []).filter(function (x) { return x.ID === fPhong.value; })[0];
        z('phTen').textContent = p ? '— ' + e(p.TEN) : '';
        L.xoaDanhDau();
        return L.reload();
    }
    if (window.jQuery) jQuery(fPhong).on('change', taiLai); else fPhong.addEventListener('change', taiLai);

    /* ---------- Đăng ký sử dụng phòng ----------------------------------- */
    function thamSoDangKy(B) {
        function v(k) { return B.querySelector('[data-dk="' + k + '"]').value.trim(); }
        return { strTkb_Phong_Id: v('phong'), strNgaySuDung: v('ngay'), strGioBatDau: v('gbd'), strPhutBatDau: v('pbd'), strGioKetThuc: v('gkt'),
            strPhutKetThuc: v('pkt'), strMucDichSuDung: v('mucdich'), strNguonDuLieuTKB_Id: '', strNguoiThucHien_Id: uid(), strHanhDong_Code: '' };
    }
    function kiemDangKy(x) {
        if (!x.strTkb_Phong_Id) return 'Chọn phòng';
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(x.strNgaySuDung)) return 'Nhập ngày sử dụng (dd/mm/yyyy)';
        var gio = [x.strGioBatDau, x.strGioKetThuc], ph = [x.strPhutBatDau || '0', x.strPhutKetThuc || '0'];
        if (gio.some(function (g) { return !/^\d{1,2}$/.test(g) || +g > 23; })) return 'Nhập giờ bắt đầu và giờ kết thúc (0–23)';
        if (ph.some(function (p) { return !/^\d{1,2}$/.test(p) || +p > 59; })) return 'Phút phải từ 0 đến 59';
        if (+x.strGioBatDau * 60 + +ph[0] >= +x.strGioKetThuc * 60 + +ph[1]) return 'Giờ kết thúc phải sau giờ bắt đầu';
        return '';
    }
    function moDangKy() {
        var o2 = '<input class="ums-input" inputmode="numeric" autocomplete="off" maxlength="2" ';
        var dlg = pat.formTrang({
            host: root, title: 'Đăng ký sử dụng phòng', icon: 'fa-calendar-plus',
            body:
                ui.field('Phòng', '<select class="ums-select" data-dk="phong" data-ph="Chọn phòng học"><option value=""></option></select>', { required: true }) +
                ui.field('Ngày', '<input class="ums-input" data-dk="ngay" data-date placeholder="dd/mm/yyyy" autocomplete="off" value="' + esc(ums.lich.dmy(new Date())) + '">', { required: true }) +
                ui.field('Giờ/phút bắt đầu', '<div class="lgp-gio">' + o2 + 'data-dk="gbd" placeholder="Giờ"><span>:</span>' + o2 + 'data-dk="pbd" placeholder="Phút"></div>', { required: true }) +
                ui.field('Giờ/phút kết thúc', '<div class="lgp-gio">' + o2 + 'data-dk="gkt" placeholder="Giờ"><span>:</span>' + o2 + 'data-dk="pkt" placeholder="Phút"></div>', { required: true }) +
                '<div style="grid-column:1 / -1">' + ui.field('Mục đích sử dụng', '<textarea class="ums-input" rows="3" data-dk="mucdich"></textarea>') + '</div>',
            buttons: [
                { kind: 'search', text: 'Kiểm tra lịch trùng', mod: 'out-primary', onClick: function (d) { gui(d, false); return false; } },
                { kind: 'save', text: 'Gửi yêu cầu', onClick: function (d) { gui(d, true); return false; } }
            ]
        });
        var B = dlg.body, sel = B.querySelector('[data-dk="phong"]');
        napPhong().then(function (d) { pat.fill(sel, d, { name: 'TEN' }); sel.value = fPhong.value; if (window.jQuery) jQuery(sel).trigger('change.select2'); }).catch(function (err) { ums.api.handle(err, 'phòng học'); });
        function gui(d, that) {
            var x = thamSoDangKy(B), loi = kiemDangKy(x);
            if (loi) { ui.toast(loi, 'warn'); return; }
            x.action = MP + (that ? 'ETMeFSojHgUqHhEpLi8mHhUmHggvMgPP' : 'ETMeFSojHgUqHhEpLi8mHhUmHgIpJCIq');
            x.func = PKG + (that ? 'Pr_Tkb_Dk_Phong_Tg_Ins' : 'Pr_Tkb_Dk_Phong_Tg_Check');
            ums.api.call(x).then(function () {
                if (that) { ui.toast('Gửi yêu cầu thành công', 'ok'); d.close(); }
                else ui.toast('Dữ liệu kiểm tra hợp lệ', 'ok');
            }).catch(function (err) { ums.api.handle(err, that ? 'gửi yêu cầu' : 'kiểm tra lịch trùng'); });
        }
    }

    /* ---------- Bảng đăng ký (dùng ở hộp Duyệt và Kết quả cá nhân) ------- */
    function hm(r, g, p) { return r[g] === undefined || r[g] === null || r[g] === '' ? '' : hai(r[g]) + ':' + hai(e(r[p]) || 0); }
    function idThat(r) {
        var id = lay(r, ['TKB_DANGKY_PHONG_THOIGIAN_ID', 'TKB_DK_PHONG_THOIGIAN_ID', 'TKB_DK_P_TG_ID', 'TKB_DANGKY_PHONG_ID', 'TKB_DK_PHONG_ID', 'ID']);
        if (id) return id;
        var bo = ['NGUOIDANGKY_ID', 'NGUOITAO_ID', 'TKB_PHONG_ID', 'NGUONDULIEUTKB_ID'];
        for (var k in r) if (/_ID$/.test(k) && bo.indexOf(k) < 0 && r[k]) return r[k];
        return '';
    }
    var COT = [
        { title: 'Người đăng ký', group: ['Thông tin người đăng ký'], render: function (r) { return esc(lay(r, ['NGUOIDANGKY', 'NGUOIDANGKY_TEN', 'NGUOIDANGKY_HOTEN', 'NGUOIDANGKY_FULLNAME', 'NGUOITAO_TENDAYDU', 'NGUOITAO'])); } },
        { title: 'Thời gian thực hiện', group: ['Thông tin người đăng ký'], cls: 'is-center is-nowrap', render: function (r) { return esc(lay(r, ['THOIGIANTHUCHIEN', 'NGAYTAO_DD_MM_YYYY_HHMMSS', 'NGAYTAO'])); } },
        { title: 'Phòng đăng ký', group: ['Thông tin đăng ký'], render: function (r) { return esc(lay(r, ['PHONGDANGKY', 'TKB_PHONG_TEN', 'TENPHONG', 'TENPHONGHOC', 'PHONG_TEN'])); } },
        { title: 'Ngày sử dụng', group: ['Thông tin đăng ký'], cls: 'is-center is-nowrap', render: function (r) { return esc(lay(r, ['NGAYSUDUNG', 'NGAYSUDUNG_HIENTHI', 'NGAY'])); } },
        { title: 'Giờ/phút bắt đầu', group: ['Thông tin đăng ký'], cls: 'is-center', render: function (r) { return esc(lay(r, ['GIOPHUTBATDAU']) || hm(r, 'GIOBATDAU', 'PHUTBATDAU')); } },
        { title: 'Giờ/phút kết thúc', group: ['Thông tin đăng ký'], cls: 'is-center', render: function (r) { return esc(lay(r, ['GIOPHUTKETTHUC']) || hm(r, 'GIOKETTHUC', 'PHUTKETTHUC')); } },
        { title: 'Mục đích sử dụng', group: ['Thông tin đăng ký'], render: function (r) { return esc(lay(r, ['MUCDICHSUDUNG', 'MUCDICH', 'NOIDUNG', 'GHICHU', 'MOTA'])); } },
        { title: 'Tình trạng duyệt', cls: 'is-center', render: function (r) { return esc(lay(r, ['TINHTRANG_DUYET_TEN', 'TINHTRANG_TEN', 'TRANGTHAI_TEN', 'TINHTRANG', 'TRANGTHAI', 'KETQUAXULY'])); } }
    ];
    function getList(x) {
        x.action = MP + 'ETMeFSojHgUgLyYKOB4RKS4vJh4GJDUeDSgyNQPP'; x.func = PKG + 'Pr_Tkb_DangKy_Phong_Get_List';
        x.strNguoiThucHien_Id = uid(); x.strHanhDong_Code = '';
        return ums.api.call(x).then(function (r) { return arr(r.data); });
    }

    /* ---------- Duyệt đăng ký ------------------------------------------- */
    function moDuyet() {
        var dlg = ui.dialog({
            title: 'Duyệt đăng ký', icon: 'fa-calendar-check', size: 'xl',
            body: '<div class="lgp-duyet">' +
                    '<div>' +
                        '<div class="lgp-duyet__loc">' + ui.field('Phòng học', '<select class="ums-select" data-dy="phong" data-ph="Tất cả phòng"><option value="">Tất cả phòng</option></select>') +
                            '<b data-dy="ngay"></b></div>' +
                        '<div data-dy="bang"></div>' +
                    '</div>' +
                    '<aside><div data-dy="thang"></div><div hidden data-dy="an"></div></aside>' +
                  '</div>',
            buttons: [{ kind: 'save', text: 'Duyệt', icon: 'fa-check', onClick: function () { batDauDuyet(); return false; } }]
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-dy="' + k + '"]'); }
        var sel = q('phong'), ds = [], ngayCo = [], ngayChon = '';
        napPhong().then(function (d) { pat.fill(sel, d, { name: 'TEN', head: 'Tất cả phòng' }); }).catch(function (err) { ums.api.handle(err, 'phòng học'); });
        ui.enhance(B);

        /* Ngày có đăng ký — cả danh sách của phòng, lọc theo tháng đang xem */
        function napNgayCo() {
            return getList({ strNguoiDangKy_Id: '', strNgaySuDung: '', strTkb_Phong_Id: sel.value }).then(function (d) {
                ngayCo = d.map(function (r) { return String(lay(r, ['NGAYSUDUNG', 'NGAYSUDUNG_HIENTHI', 'NGAY'])).slice(0, 10); });
            }).catch(function () { ngayCo = []; });
        }
        var dauTien = napNgayCo();
        var M = ums.lich.tao({
            thang: q('thang'), tuan: q('an'), noiDung: function () { return ''; },
            load: function (t) {
                ngayChon = t.ngay;
                q('ngay').textContent = 'Ngày: ' + t.ngay;
                return dauTien.then(function () { return taiNgay(); }).then(function () { return []; });
            },
            danhDau: function () {
                var th = ngayChon.slice(2);             // "/mm/yyyy"
                return ngayCo.filter(function (s) { return s.slice(2) === th; }).map(function (s) { return Number(s.slice(0, 2)); });
            }
        });
        function taiNgay() {
            q('bang').innerHTML = ui.empty('Đang tải…', 'fa-spinner fa-spin');
            return getList({ strNguoiDangKy_Id: '', strNgaySuDung: ngayChon, strTkb_Phong_Id: sel.value }).then(function (d) {
                ds = d;
                ui.table({ el: q('bang'), rows: ds, empty: 'Không có dữ liệu', columns: COT.concat([{
                    head: '<input type="checkbox" data-dy-all title="Chọn tất cả">', cls: 'is-center', width: '44px',
                    render: function (r, i) { return idThat(r) ? '<input type="checkbox" data-dy-ck="' + i + '">' : ''; }
                }]) });
            }).catch(function (err) { q('bang').innerHTML = ui.fail(err.message); ums.api.handle(err, 'danh sách đăng ký'); });
        }
        if (window.jQuery) jQuery(sel).on('change', function () { dauTien = napNgayCo(); M.xoaDanhDau(); M.reload(); });
        B.addEventListener('change', function (ev) {
            if (ev.target.hasAttribute('data-dy-all')) Array.prototype.forEach.call(B.querySelectorAll('[data-dy-ck]'), function (c) { c.checked = ev.target.checked; });
        });
        function batDauDuyet() {
            var ids = Array.prototype.map.call(B.querySelectorAll('[data-dy-ck]:checked'), function (c) { return idThat(ds[Number(c.getAttribute('data-dy-ck'))]); });
            if (!ids.length) { ui.toast('Vui lòng chọn ít nhất 1 dòng để duyệt', 'warn'); return; }
            xacNhan(ids, taiNgay);
        }
    }
    /* Hộp "Các trạng thái xác nhận": bấm một trạng thái = duyệt các dòng đã chọn */
    function xacNhan(ids, sauKhiDuyet) {
        var dlg = ui.dialog({
            title: 'Các trạng thái xác nhận', icon: 'fa-list-check', size: 'lg',
            body: '<div class="lgp-tt__nhan">Các trạng thái xác nhận</div><div class="lgp-tt" data-xn="tt">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' +
                ui.field('Nội dung', '<textarea class="ums-input" rows="3" data-xn="nd" placeholder="Cho gõ nội dung"></textarea>') +
                '<div class="lgp-tt__nhan">Lịch sử duyệt</div><div data-xn="ls"></div>'
        });
        var B = dlg.body;
        function q(k) { return B.querySelector('[data-xn="' + k + '"]'); }
        var MAU = ['is-vang', 'is-xanh', 'is-lam', 'is-hong', 'is-cam'];
        ums.api.call({ action: MP + 'ETMeFSojHgUKHhUVHgYkNR4DOB4UMiQz', func: PKG + 'Pr_Tkb_DK_TT_Get_By_User', strNguoiDung_Id: uid(), strNguoiThucHien_Id: uid(), strHanhDong_Code: '' })
            .then(function (r) {
                var d = arr(r.data);
                q('tt').innerHTML = d.length ? d.map(function (x, i) {
                    return '<button type="button" class="lgp-tt__muc ' + MAU[i % MAU.length] + '" data-tt="' + esc(lay(x, ['ID', 'TINHTRANG_ID', 'TRANGTHAI_ID'])) + '">' +
                        esc(lay(x, ['TEN', 'TINHTRANG_TEN', 'TRANGTHAI_TEN', 'TINHTRANG_DUYET_TEN'])) + '</button>';
                }).join('') : ui.empty('Không có trạng thái xác nhận nào', 'fa-circle-info');
            }).catch(function (err) { q('tt').innerHTML = ui.fail(err.message); });
        function lichSu() {
            ums.api.call({ action: MP + 'DSA4BRIVCgMeBSAvJgo4HgU0OCQ1', func: PKG + 'LayDSTKB_DangKy_Duyet', strTuKhoa: '', strSanPham_Id: ids[0], strTinhTrang_Id: '',
                strNguoiXacNhan_Id: '', strNguoiThucHien_Id: uid(), strHanhDong_Code: '' }).then(function (r) {
                ui.table({ el: q('ls'), rows: arr(r.data), empty: 'Chưa có lịch sử duyệt', columns: [
                    { title: 'Tình trạng duyệt', prop: 'TINHTRANG_TEN' },
                    { title: 'Người duyệt', prop: 'NGUOIXACNHAN_HIENTHI' },
                    { title: 'Thời gian', prop: 'NGAYTAO_DD_MM_YYYY_HHMMSS', cls: 'is-center is-nowrap' }
                ] });
            }).catch(function (err) { q('ls').innerHTML = ui.fail(err.message); });
        }
        lichSu();
        B.addEventListener('click', function (ev) {
            var b = ev.target.closest('[data-tt]');
            if (!b) return;
            var nd = q('nd').value.trim(), tt = b.getAttribute('data-tt');
            ui.batch(ids.map(function (id) {
                return { action: MP + 'ETMeFSojHgUgLyYKOB4FNDgkNR4ILzIkMzUP', func: PKG + 'Pr_Tkb_DangKy_Duyet_Insert', strNguoiXacNhan_Id: uid(), strSanPham_Id: id,
                    strNoiDung: nd, strTinhTrang_Id: tt, strNguoiThucHien_Id: uid(), strHanhDong_Code: '' };
            }), { title: 'Đang duyệt', okText: 'Duyệt thành công', show: true }).then(function () { lichSu(); sauKhiDuyet(); });
        });
    }

    /* ---------- Kết quả cá nhân ----------------------------------------- */
    function moKetQua() {
        var dlg = ui.dialog({ title: 'Kết quả cá nhân - đăng ký', icon: 'fa-list-check', size: 'xl', body: '<div data-kq="bang">' + ui.empty('Đang tải…', 'fa-spinner fa-spin') + '</div>' });
        var host = dlg.body.querySelector('[data-kq="bang"]');
        getList({ strNguoiDangKy_Id: uid(), strNgaySuDung: '', strTkb_Phong_Id: '' }).then(function (d) {
            ui.table({ el: host, rows: d, empty: 'Không có dữ liệu', columns: COT.concat([{
                title: 'Hành động', cls: 'is-center', width: '90px',
                // Bản gốc vẽ nút xoá nhưng không có xử lý — giữ nút, khoá lại
                render: function () { return ui.btn('del', { text: '', cls: 'ums-btn--sm', attr: { disabled: '', title: 'Chưa có chức năng xoá' } }); }
            }]) });
        }).catch(function (err) { host.innerHTML = ui.fail(err.message); ums.api.handle(err, 'kết quả cá nhân'); });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b) return;
        var a = b.getAttribute('data-a');
        if (a === 'ds') { if (!fPhong.value) ui.toast('Chọn phòng học', 'warn'); taiLai(); }
        else if (a === 'dangky') moDangKy();
        else if (a === 'duyet') moDuyet();
        else if (a === 'ketqua') moKetQua();
    });
})();
