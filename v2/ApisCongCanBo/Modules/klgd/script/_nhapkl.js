/* =========================================================================
   klgd — Nhập khối lượng (qlklgd_nhapkhoiluong): lưới dùng CHUNG với Tuỳ chỉnh khối lượng bản QL (ums.klgd.tuyChinh(root, true, true),
   _tuychinh.js) + biểu mẫu "Thêm lớp" (trong trang) ở tệp này (ums.klgd.themLop).
   ---------------------------------------------------------------------------
   Danh sách TKGG_QLKLGD/GetKhoiLuongNhap { strBoMonId, strStaffId, strHocKy, strDotHocId, strDotHoc (CHỮ của đợt), strHeDaoTaoId,
     strCoSoDaoTaoId, strKhoaHocId '', strNguoiThucHienId } — gốc KHÔNG gửi năm học và kiểu lớp (hai ô lọc đó chỉ xoá bảng) — giữ.
   Cập nhật (dòng đã sửa) UpdateKhoiLuong_Nhap — tham số như UpdateKhoiLuongTKBNienChe bản QL + strDotHoc ''.
   Xoá (mỗi dòng) XoaKhoiLuong_Nhap { strNamHoc, strHocKy, strDotHoc: id đợt, strKhoiLuongThoiKhoaBieuId, strLopHocPhanId, strNguoiThucHienId }.
   Thêm lớp: UpdateKhoiLuong_Nhap { strID "#$" (thêm mới), StaffID, NamHoc, HocKy, strTenMon, strTenLop, strSoSinhVien, strTongSoTiet '',
     strThoiKhoaBieu '', strHeDaoTao, strSoTietTheoKeHoach '', strDVHT, strSoNgay, strHinhThucGiangDay, strTIET…_DC ×5, strBTL, strTKMH,
     strSoTien '', strTrongTruong, strIDHINHTHUCHOC, strSoTietHDMotSinhVien, strHeSoTinChi "1.1" (cứng như gốc), strDotHoc (CHỮ đợt),
     strChucNang_Id, strNguoiThucHienId }.
   Import: Import_KhoiLuongNhap { strNamHoc, strNguoiThucHien_Id, strPath } · tệp mẫu TEMPLATE_IMPORTKHOILUONG_NHAP.
   Khác bản gốc (ghi ở can-quyet.js):
     · Cập nhật gốc gửi strHeSoTinChi từ ô KHÔNG có trên lưới (luôn rỗng → xoá hệ số tín chỉ) → nay gửi lại giá trị của dòng.
     · Thêm lớp: chưa chọn đợt gốc gửi chữ "Chọn đợt" → nay gửi rỗng. Lưu xong gốc giữ id (bấm Lưu lần nữa là SỬA lớp vừa thêm) →
       nay "Lưu" đóng biểu mẫu, "Lưu và Nhập tiếp" xoá trắng ô số liệu để thêm lớp khác. Học kỳ → Đợt, Bộ môn → Giảng viên khoá cha → con.
     · Lưu / xoá báo đúng kết quả; xoá nhiều dòng nạp lại MỘT lần (gốc mỗi dòng một thông báo + một lần nạp).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat, K = ums.klgd, e = K.e, esc = ui.esc;
    var SO = [['ten', 'Tên học phần'], ['dvht', 'Số tín chỉ'], ['lop', 'Tên lớp học phần'], ['siso', 'Sĩ số'], ['lt', 'Lý thuyết'], ['bt', 'Bài tập'],
        ['tl', 'Thảo luận'], ['tn', 'Thí nghiệm'], ['th', 'Thực hành'], ['btl', 'BTL'], ['tkmh', 'TKMH'], ['songay', 'Số ngày'], ['hdsv', 'Số tiết hoặc số SV']];

    /* host = vùng gốc của màn: biểu mẫu mở TRONG TRANG, thay chỗ lưới (pat.formTrang — BO-CUC luật 1). Không truyền host thì vẫn là hộp thoại. */
    K.themLop = function (vLoc, sauLuu, host) {
        var nam = vLoc('nam');
        if (!nam) { ui.toast('Bạn chưa chọn năm học', 'warn'); return; }
        function sel(k, nhan) { return ui.field(nhan, '<select class="ums-select" data-t="' + k + '" data-ph="Chọn ' + nhan.toLowerCase() + '"><option value="">Chọn ' + esc(nhan.toLowerCase()) + '</option></select>'); }
        function inp(k, nhan) { return ui.field(nhan, '<input class="ums-input" data-t="' + k + '" autocomplete="off">'); }
        var body = '<div class="ums-grid ums-grid--3">' +
            '<div class="ums-kv"><span>Năm học</span><b>' + esc(nam) + '</b></div>' + sel('hk', 'Học kỳ') + sel('dot', 'Đợt học') +
            inp('ten', 'Tên học phần') + inp('dvht', 'Số tín chỉ') + inp('lop', 'Tên lớp học phần') +
            sel('loaiLop', 'Kiểu lớp') + sel('he', 'Hệ đào tạo') + inp('siso', 'Sĩ số') +
            inp('lt', 'Lý thuyết') + inp('bt', 'Bài tập') + inp('tl', 'Thảo luận') + inp('tn', 'Thí nghiệm') + inp('th', 'Thực hành') + inp('btl', 'BTL') +
            inp('tkmh', 'TKMH') + inp('songay', 'Số ngày') + sel('htg', 'Hình thức giảng') + sel('bm', 'Bộ môn') + sel('gv', 'Giảng viên') +
            inp('hdsv', 'Số tiết hoặc số SV') +
            '<label class="ums-check" style="align-self:end;padding-bottom:10px"><input type="checkbox" data-t="tt"> Trong trường</label></div>';
        var dlg = (host ? pat.formTrang : ui.dialog)({ host: host, title: 'Thêm lớp', icon: 'fa-plus', size: 'xl', cols: 1, body: body, buttons: [
            { text: 'Lưu và Nhập tiếp', kind: 'save', mod: 'out-primary', onClick: function () { luu(true); return false; } },
            { text: 'Lưu', kind: 'save', onClick: function () { luu(false); return false; } }] });
        var B = dlg.body;
        function f(k) { return B.querySelector('[data-t="' + k + '"]'); }
        ui.enhance(B);
        var ctl = 'TKGG_QLKLGD/';
        function g(action, o) { return K.g(ctl + action, Object.assign({ strChucNang_Id: K.chucNang(), strNguoiThucHien_Id: K.uid(), strNguoiThucHienId: K.uid(), silent: true }, o)).then(function (r) { return K.arr(r.data); }); }
        function fill(k, p, id, name) { p.then(function (d) { pat.fill(f(k), d, { id: id, name: name }); }).catch(function (err) { ums.api.handle(err, k); }); }
        fill('hk', K.namKyDot('HOCKY', nam), 'HOCKY', 'HOCKY');
        fill('loaiLop', g('ListDS_HinhThucHoc', {}), 'ID', 'TENHINHTHUCHOC');
        fill('he', g('ListDS_HeDaoTao', {}), 'ID', 'NAME');
        fill('htg', g('GetHinhThucGiang', {}), 'ID', 'NAME');
        fill('bm', g('LayDS_PhanQuyenNguoiDungDonVi', { strNamHoc: nam, strNguoiDungId: K.uid() }), 'ID', 'NAME');
        pat.chain([f('hk'), f('dot')], { phatLai: false });
        pat.chain([f('bm'), f('gv')], { phatLai: false });
        jQuery(f('hk')).on('select2:select', function () { fill('dot', K.namKyDot('DOTHOC', f('hk').value), 'ID', 'DOTHOC'); });
        jQuery(f('bm')).on('select2:select', function () { fill('gv', g('GetDanhSachCanBoNienHoc', { strNhomMonHocId: f('bm').value }), 'STAFFID', 'HOTENMASO'); });

        function luu(tiep) {
            if (!f('gv').value) { ui.toast('Bạn chưa chọn giảng viên', 'warn'); return; }
            if (!f('he').value) { ui.toast('Bạn chưa chọn hệ đào tạo', 'warn'); return; }
            if (!f('loaiLop').value) { ui.toast('Bạn chưa chọn kiểu lớp', 'warn'); return; }
            if (!f('hk').value) { ui.toast('Bạn chưa chọn học kỳ', 'warn'); return; }
            ui.confirm('Bạn có chắc chắn thêm mới ?', { ok: 'Thêm mới' }).then(function (yes) {
                if (!yes) return;
                function x(k) { return f(k).value.trim(); }
                var dot = f('dot');
                K.g(ctl + 'UpdateKhoiLuong_Nhap', { strID: '#$', StaffID: x('gv'), NamHoc: nam, HocKy: x('hk'), strTenMon: x('ten'), strTenLop: x('lop'),
                    strSoSinhVien: x('siso'), strTongSoTiet: '', strThoiKhoaBieu: '', strHeDaoTao: x('he'), strSoTietTheoKeHoach: '', strDVHT: x('dvht'),
                    strSoNgay: x('songay'), strHinhThucGiangDay: x('htg'), strTIETLYTHUYET_DC: x('lt'), strTIETBAITAP_DC: x('bt'), strTIETTHAOLUAN_DC: x('tl'),
                    strTIETTHINGHIEM_DC: x('tn'), strTIETTHUCHANH_DC: x('th'), strBTL: x('btl'), strTKMH: x('tkmh'), strSoTien: '',
                    strTrongTruong: f('tt').checked ? '1' : '0', strIDHINHTHUCHOC: x('loaiLop'), strSoTietHDMotSinhVien: x('hdsv'), strHeSoTinChi: '1.1',
                    strDotHoc: dot.value && dot.selectedIndex > 0 ? dot.options[dot.selectedIndex].text : '', strChucNang_Id: K.chucNang(), strNguoiThucHienId: K.uid() })
                    .then(function () {
                        ui.toast('Cập nhật thành công', 'ok');
                        if (tiep) SO.forEach(function (s) { f(s[0]).value = ''; });
                        else dlg.close();
                        if (sauLuu) sauLuu();
                    }).catch(function (err) { ums.api.handle(err, 'thêm lớp'); });
            });
        }
        return dlg;
    };
})();
