/* =========================================================================
   Mẫu phôi in — MauPhoiIn (trình thiết kế phôi)
   Bản gốc: ApisCMS/Modules/danhmuc/html/mauphoiin.html + script/mauphoiin.js
   ---------------------------------------------------------------------------
   Phôi = ảnh scan tờ in (bằng, giấy chứng nhận…) + các NỘI DUNG đặt tuyệt đối
   trên đó (lề trái / lề trên tính bằng px, cỡ chữ, độ rộng, đậm/nghiêng/gạch,
   căn lề, định dạng CSS bổ sung). Màn cho đặt, kéo bằng phím mũi tên, lưu, in thử.
   Không liên quan tới phôi HTML của ums.phieu (Upload/Files/PrintTemplate) — đây là
   bảng CMS_MauPhoiIn / CMS_MauPhoiIn_ChiTiet.

   Bố cục bản gốc: HAI CỘT 3 | 9.
     Trái: ô chọn mẫu + "Thêm mẫu" ; "Thêm nội dung" (ô + Thêm) ; "Tùy chọn khổ giấy"
           (Font chữ, Dài/Rộng chỉ đọc, Cỡ chữ, DPI chỉ đọc, Top/Left, Trang) ;
           "Vị trí nội dung phôi" (Khoảng cách trái / trên, Font size, Kiểu chữ B I U,
           Căn lề, Độ rộng, Định dạng bổ sung, Xóa) ; "Bảng trên phôi" (Khoảng cách dòng).
     Phải: khung "Phôi" (In · Lưu) chứa các trang phôi.
     Hộp "Mẫu phôi in" (Mã mẫu in, Số trang, Ảnh scan) → ở đây là biểu mẫu THAY CHỖ
     khung Phôi (BO-CUC luật 1: không dùng hộp thoại cho biểu mẫu chính).

   Lời gọi (chép nguyên):
       CMS_MauPhoiIn/LayDanhSach            GET  strId '' (ô txtAAAA không tồn tại)
       Thêm mẫu: CMS_BaoCao_ThongTin_MH/FSkkLB4MIDQRKS4oCC8P · pkg_baocao_thongtin.Them_MauPhoiIn
       Sửa mẫu:  CMS_BaoCao_ThongTin_MH/EjQgHgwgNBEpLigILwPP · func 'CMS_BaoCao_ThongTin_MH/Sua_MauPhoiIn'
                 (func gốc viết đúng như vậy — không phải tên procedure; GIỮ NGUYÊN, kiểm trên host)
           strId, strMaPhoi, strTenPhoi, strKhogiay (ô Khoảng cách dòng), strDoDai (ô Cỡ chữ),
           strDoRong (ô DPI), strFont, strSoTrang, strDuongDanFile, strMargin_Top, strMargin_Left
           — khi sửa: strMaPhoi / strSoTrang / strDuongDanFile lấy lại từ dòng đang chọn.
           strTenPhoi luôn '' (ô txtTenBang đã bị chú thích bỏ trong html gốc).
       Ảnh scan: uploadAvatar(['txtAnhScan']) → ums.files.avatar; lưu = getImage: ảnh mới
           ("unsave_") → getDimensions.ashx?strFileName= (rộng_cao) → copyfile.ashx với
           strId = <userId>_<rộng>_<cao> (tên tệp mang kích thước, genChonTrang tách "_").
       CMS_MauPhoiIn_ChiTiet/LayDanhSach    GET  strId = id mẫu
           → ID, NOIDUNG, LETRAI, LETREN, LEPHAI (chuỗi kiểu chữ), DINHDANG, FONTSIZE, TRANG,
             CANLE_TRAI_PHAI_GIUA, DORONGPHANTUCANLE
       CMS_MauPhoiIn_ChiTiet/ThemMoi | CapNhat (có id)  POST strId, strNoiDung, strLetrai,
           strLephai, strLeTren, strDinhDang, strFontSize, strTrang, strPhoi_MauPhoiIn_Id,
           strCanLe_Trai_Phai_Giua, strDoRongPhanTuCanLe
       CMS_MauPhoiIn_ChiTiet/Xoa            POST strId, strChucNang_Id, strNguoiThucHien_Id
       Mẫu mặc định khi chọn: Cỡ chữ = DODAI || 20, DPI = DORONG || 96, Khoảng cách dòng = KHOGIAY.

   Cố ý bỏ:
     · getList_HSSV / getList_NoiDungTheoMa / genData_Phoi / genData_ChiTiet / makeQRCode /
       makePicture: mã in thử theo hồ sơ sinh viên, KHÔNG được gọi ở đâu (dòng gọi đã chú
       thích) — và dùng eval(NOIDUNG) → không chép. Nạp qrcode.min.js cũng bỏ theo.
     · delete_MauPhoiIn: không có nút nào gọi.
     · Ô DPI chỉ đọc nên trình xử lý keyup của nó không bao giờ chạy — bỏ.
     · localStorage "<chức năng>dropSearch_Phoi" gốc ghi nhưng không nơi nào đọc — bỏ.
   Khác gốc:
     · Nội dung phôi hiện dạng CHỮ THUẦN (textContent), không dựng HTML từ dữ liệu máy
       chủ; lưu gửi đúng chuỗi đó (gốc gửi innerHTML — giống nhau khi nội dung không có thẻ).
     · Phím mũi tên chỉ di chuyển khi vùng phôi đang được chọn (bấm vào nội dung) — gốc
       nghe trên cả document nên gõ mũi tên trong ô nhập cũng bị chặn và kéo phôi.
     · "Lưu" khi chưa chọn mẫu: báo và dừng (gốc gọi Them_MauPhoiIn với các ô trống →
       sinh mẫu rác). Lưu xong nạp lại nội dung để các phần tử mới có id (gốc giữ id rỗng
       → bấm Lưu lần hai là THÊM TRÙNG mọi nội dung mới).
     · Thêm mẫu xong tự chọn mẫu vừa tạo và mở phôi (gốc chọn lại bằng trigger("change")
       nên không nạp phôi).
     · Đổi Font chữ / Cỡ chữ đổi ngay trên phôi (gốc phải chọn lại mẫu mới thấy).
     · Đổi căn lề gỡ luôn khung xám "border: solid 2px gray" của căn giữa (gốc để lại).
     · Hàng "Trang" hiện lại khi đổi sang mẫu nhiều trang (gốc ẩn một lần là ẩn luôn).
     · Nội dung thuộc trang không tồn tại: gốc bỏ im lặng — nay bỏ và báo số lượng.
     · In: mỗi trang phôi sang một tờ (page-break) — gốc in liền các trang.
     · Mẫu chưa có ảnh scan: khung A4 dọc để thấy chỗ đặt (gốc trang cao 0).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('cms-mauphoiin');
    if (!root) return;

    var CT = 'CMS_MauPhoiIn_ChiTiet/';
    var FONT = [['Bitter-VariableFont_wght', 'Bitter-Variable'], ['SVN-TIMES NEW ROMAN 2', 'SVN-TIMES NEW ROMAN 2'],
        ['Times New Roman', 'Times New Roman'], ['Palatino Linotype', 'Palatino Linotype'], ['Arial Black', 'Arial Black'],
        ['Comic Sans MS', 'Comic Sans MS'], ['Lucida Sans Unicode', 'Lucida Sans Unicode'], ['Trebuchet MS', 'Trebuchet MS']];
    var CHUDAM = [['font-weight: bold;', 'fa-bold', 'Chữ đậm'], ['font-style: italic;', 'fa-italic', 'Chữ nghiêng'],
        ['text-decoration: underline;', 'fa-underline', 'Gạch chân']];
    var CANLE = [['text-align: left;', 'fa-align-left', 'Căn trái'], ['text-align: center;', 'fa-align-center', 'Căn giữa'],
        ['text-align: right;', 'fa-align-right', 'Căn phải']];
    var VIEN_GIUA = 'border: solid 2px gray;';

    var dsMau = [], mauId = '', iTrang = 0, sel = null, dai = 0, rong = 0;

    function e(v) { return v === null || v === undefined ? '' : v; }
    function esc(s) { return ui.esc(s); }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function px(v) { return String(e(v)).replace('px', ''); }
    function demo() { return !!(ums.state && ums.state.mode === 'demo'); }

    function prop(label, ctl, o) {
        o = o || {};
        return '<div class="mpi-prop' + (o.cls ? ' ' + o.cls : '') + '"><label' + (o.wide ? ' class="mpi-prop__wide"' : '') + '>' + esc(label) + '</label>' + ctl + '</div>';
    }
    /* Hai cặp nhãn + ô trên một dòng (gốc: 20% | 30% | 20% | 30%) */
    function cap(l1, c1, l2, c2) {
        return '<div class="mpi-prop mpi-prop--cap"><label>' + esc(l1) + '</label>' + c1 + '<label class="mpi-prop__r">' + esc(l2) + '</label>' + c2 + '</div>';
    }
    function inp(k, o) {
        o = o || {};
        return '<input class="ums-input ums-input--sm ' + (o.num ? 'mpi-prop__num' : 'mpi-prop__ctl') + '" data-f="' + k + '"' +
            (o.ro ? ' readonly' : '') + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + (o.val !== undefined ? ' value="' + esc(o.val) + '"' : '') + ' autocomplete="off">';
    }
    function nutKieu(ds, attr) {
        return '<div class="mpi-prop__btns">' + ds.map(function (d) {
            return '<button type="button" class="ums-btn ums-btn--ghost ums-btn--sm" ' + attr + '="' + esc(d[0]) + '" title="' + esc(d[2]) + '"><i class="fa-light ' + d[1] + '"></i></button>';
        }).join('') + '</div>';
    }

    root.innerHTML =
        pat.page('Mẫu phôi in', '') +
        '<div class="mpi-cols">' +
            '<aside>' +
                pat.panel({ title: false, cls: 'ums-u-mb-4', body:
                    '<div class="mpi-prop"><div class="mpi-prop__ctl"><select class="ums-select" data-f="mau" data-ph="Chọn mẫu phôi"><option value="">Chọn mẫu phôi</option></select></div>' +
                    ui.btn('add', { text: 'Thêm mẫu', mod: 'out-success', cls: 'ums-btn--sm', attr: { 'data-a': 'themmau', title: 'Thêm mới mẫu in' } }) + '</div>' }) +
                pat.panel({ title: 'Thiết kế phôi', icon: 'fa-pen-ruler', flush: true, body:
                    '<div class="mpi-sec"><div class="mpi-sec__title">Thêm nội dung</div>' +
                        '<div class="mpi-prop">' + inp('noidung') + ui.btn('add', { text: 'Thêm', mod: 'out-success', cls: 'ums-btn--sm', attr: { 'data-a': 'themnd' } }) + '</div></div>' +
                    '<div class="mpi-sec"><div class="mpi-sec__title">Tùy chọn khổ giấy</div>' +
                        prop('Font chữ', '<div class="mpi-prop__ctl"><select class="ums-select" data-f="font" data-required>' +
                            FONT.map(function (x) { return '<option value="' + esc(x[0]) + '">' + esc(x[1]) + '</option>'; }).join('') + '</select></div>') +
                        cap('Dài', inp('dai', { ro: true }), 'Rộng', inp('rong', { ro: true })) +
                        cap('Cỡ chữ', inp('cochu', { val: '13' }), 'DPI', inp('dpi', { ro: true })) +
                        cap('Top', inp('mtop'), 'Left', inp('mleft')) +
                        '<div class="mpi-trang" data-z="trangrow" hidden>' + prop('Trang', '<div class="mpi-prop__ctl" data-z="trang"></div>') + '</div>' +
                    '</div>' +
                    '<div class="mpi-sec"><div class="mpi-sec__title">Vị trí nội dung phôi</div>' +
                        prop('Khoảng cách bên trái', inp('left', { num: true }), { wide: true }) +
                        prop('Khoảng cách phía trên', inp('top', { num: true }), { wide: true }) +
                        prop('Font size', inp('size', { num: true }), { wide: true }) +
                        prop('Kiểu chữ', nutKieu(CHUDAM, 'data-cd'), { cls: 'mpi-prop--tools' }) +
                        prop('Căn lề', nutKieu(CANLE, 'data-cl'), { cls: 'mpi-prop--tools' }) +
                        prop('Độ rộng', inp('rongnd', { num: true }), { wide: true }) +
                        '<div class="mpi-prop"><label class="mpi-prop__wide">Định dạng bổ sung</label></div>' +
                        '<div class="mpi-prop">' + inp('dinhdang', { ph: 'CSS thêm, vd: letter-spacing: 2px;' }) + '</div>' +
                        '<div class="mpi-prop mpi-prop--end">' + ui.btn('del', { mod: 'out-danger', cls: 'ums-btn--sm', text: 'Xóa', attr: { 'data-a': 'xoand' } }) + '</div>' +
                    '</div>' +
                    '<div class="mpi-sec"><div class="mpi-sec__title">Bảng trên phôi</div>' +
                        prop('Khoảng cách dòng:', inp('khoangcach', { num: true, ph: '30' }), { wide: true }) +
                    '</div>' }) +
            '</aside>' +
            '<div>' +
                '<div data-z="khungphoi">' +
                    pat.panel({ title: 'Phôi', icon: 'fa-address-card', flush: true,
                        tools: ui.btn('print', { attr: { 'data-a': 'in' } }) + ui.btn('save', { attr: { 'data-a': 'luu' } }),
                        body: '<div class="mpi-canvas" data-z="canvas" tabindex="0">' + ui.empty('Chọn một mẫu phôi ở cột trái', 'fa-address-card') + '</div>' }) +
                '</div>' +
                '<div data-z="bieumau" hidden>' +
                    pat.panel({ title: 'Mẫu phôi in', icon: 'fa-pencil',
                        tools: ui.btn('close', { attr: { 'data-a': 'dongmau' } }) + ui.btn('save', { attr: { 'data-a': 'luumau' } }),
                        body: '<div class="ums-grid ums-grid--2">' +
                            ui.field('Mã mẫu in', '<input class="ums-input" data-m="ma" placeholder="Viết liền không dấu" autocomplete="off">') +
                            ui.field('Số trang', '<input class="ums-input" data-m="sotrang" value="1" inputmode="numeric" autocomplete="off">', { required: true }) +
                            ui.field('Ảnh scan', '<div data-z="anh"></div>', { hint: 'Ảnh scan tờ phôi; kích thước ảnh quyết định khổ trang trên màn thiết kế.' }) +
                        '</div>' }) +
                '</div>' +
            '</div>' +
        '</div>';
    ui.enhance(root);

    function f(k) { return root.querySelector('[data-f="' + k + '"]'); }
    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function m(k) { return root.querySelector('[data-m="' + k + '"]'); }
    function setSel(el, v) { el.value = v; if (window.jQuery) jQuery(el).trigger('change.select2'); }
    var canvas = z('canvas');
    var anh = ums.files.avatar(z('anh'), { icon: 'fa-image' });

    /* ---------- Danh sách mẫu ---------- */
    function taiMau(chon) {
        return ums.api.call({ action: 'CMS_MauPhoiIn/LayDanhSach', method: 'GET', strId: '' })
            .then(function (r) {
                dsMau = arr(r.data);
                pat.fill(f('mau'), dsMau, { id: 'ID', name: 'MAPHOI' });
                if (chon && dsMau.some(function (x) { return x.ID === chon; })) { setSel(f('mau'), chon); moMau(chon); }
            })
            .catch(function (err) { ums.api.handle(err, 'nạp danh sách mẫu phôi'); });
    }
    function dongMau() { return dsMau.filter(function (x) { return x.ID === mauId; })[0]; }

    /* ---------- Vẽ các trang (genChonTrang) ---------- */
    function veTrang(soTrang, anhNen) {
        sel = null;
        apFont();
        var tyLe = (Number(f('dpi').value) || 96) / 96;
        var h = '', co = false;
        if (anhNen && String(anhNen).indexOf('_') !== -1) {
            var t = String(anhNen).split('_');
            dai = parseFloat(t[1]) || 0; rong = parseFloat(t[2]) || 0;
            co = !!(dai && rong);
            f('dai').value = (dai * 0.2645833333).toFixed(2);
            f('rong').value = (rong * 0.2645833333).toFixed(2);
        } else { dai = rong = 0; f('dai').value = ''; f('rong').value = ''; }
        var url = anhNen ? ums.files.url(anhNen) : '';
        for (var i = 0; i < Math.max(1, Number(soTrang) || 1); i++) {
            h += co
                ? '<div class="mpi-page" data-trang="' + i + '" style="background-image:url(&quot;' + esc(url) + '&quot;);background-size:' + (dai * tyLe) + 'px;width:' + (dai * tyLe) + 'px;height:' + (rong * tyLe) + 'px"></div>'
                : '<div class="mpi-page mpi-page--trong" data-trang="' + i + '"></div>';
        }
        canvas.innerHTML = h;
        var n = canvas.querySelectorAll('.mpi-page').length;
        iTrang = 0;
        z('trangrow').hidden = n <= 1;
        if (n > 1) {
            var c = []; for (var k = 0; k < n; k++) c.push({ key: String(k), label: String(k + 1) });
            c.push({ key: 'all', label: 'Tất cả' });
            z('trang').innerHTML = ui.chips(c, 'all');
        }
        boChon();
    }
    function apFont() {
        canvas.style.setProperty('--mpi-font', '"' + f('font').value + '"');
        var c = Number(f('cochu').value);
        canvas.style.setProperty('--mpi-size', (c > 0 ? c : 13) + 'px');
    }

    /* ---------- Nội dung (genHtml_NoiDung) ---------- */
    function kieuNoiDung(d) {
        var s = '';
        if (d.FONTSIZE) s = ' font-size: ' + d.FONTSIZE + 'px;';
        if (d.DORONGPHANTUCANLE) s += 'width: ' + d.DORONGPHANTUCANLE + 'px;';
        if (d.CANLE_TRAI_PHAI_GIUA === 'text-align: center;') s += VIEN_GIUA;
        return 'margin-top: ' + e(d.LETREN) + 'px; margin-left: ' + e(d.LETRAI) + 'px; ' + s + ' ' + e(d.DINHDANG) + '; ' + e(d.LEPHAI) + e(d.CANLE_TRAI_PHAI_GIUA);
    }
    function taoPhoi(d) {
        var el = document.createElement('span');
        el.className = 'mpi-phoi';
        el.setAttribute('style', d.style);
        el.setAttribute('data-id', e(d.ID));
        el.setAttribute('data-trang', e(d.TRANG));
        if (d.DINHDANG !== undefined) el.setAttribute('data-dinhdang', e(d.DINHDANG));
        if (d.LEPHAI !== undefined) el.setAttribute('data-chudam', e(d.LEPHAI));
        if (d.CANLE !== undefined) el.setAttribute('data-canle', e(d.CANLE));
        el.textContent = e(d.NOIDUNG);
        return el;
    }
    function taiNoiDung() {
        if (!mauId) return Promise.resolve();
        return ums.api.call({ action: CT + 'LayDanhSach', method: 'GET', strId: mauId })
            .then(function (r) {
                var trang = canvas.querySelectorAll('.mpi-page'), lac = 0;
                arr(r.data).forEach(function (d) {
                    var p = trang[Number(d.TRANG) || 0];
                    if (!p) { lac++; return; }
                    p.appendChild(taoPhoi({ ID: d.ID, TRANG: e(d.TRANG), NOIDUNG: d.NOIDUNG, style: kieuNoiDung(d),
                        DINHDANG: e(d.DINHDANG), LEPHAI: e(d.LEPHAI), CANLE: e(d.CANLE_TRAI_PHAI_GIUA) }));
                });
                if (lac) ui.toast(lac + ' nội dung thuộc trang không tồn tại trên mẫu nên không hiện', 'warn');
            })
            .catch(function (err) { ums.api.handle(err, 'nạp nội dung phôi'); });
    }

    function moMau(id) {
        mauId = id || '';
        if (!mauId) { canvas.innerHTML = ui.empty('Chọn một mẫu phôi ở cột trái', 'fa-address-card'); z('trangrow').hidden = true; sel = null; return; }
        var d = dongMau();
        if (!d) return;
        f('khoangcach').value = e(d.KHOGIAY);
        if (d.FONT) setSel(f('font'), d.FONT);
        f('cochu').value = d.DODAI ? d.DODAI : 20;
        f('dpi').value = d.DORONG ? d.DORONG : 96;
        f('mtop').value = e(d.MARGIN_TOP);
        f('mleft').value = e(d.MARGIN_LEFT);
        veTrang(d.SOTRANG, d.DUONGDANFILE);
        taiNoiDung();
    }

    /* ---------- Chọn / bỏ chọn một nội dung ---------- */
    function boNut() {
        Array.prototype.forEach.call(root.querySelectorAll('[data-cd],[data-cl]'), function (b) {
            b.classList.remove('ums-btn--primary'); b.classList.add('ums-btn--ghost');
        });
    }
    function batNut(b, on) { b.classList.toggle('ums-btn--primary', on); b.classList.toggle('ums-btn--ghost', !on); }
    function laKieu(el, name) {
        if (name === 'font-weight: bold;') return el.style.fontWeight === 'bold' || el.style.fontWeight === '700';
        if (name === 'font-style: italic;') return el.style.fontStyle === 'italic';
        if (name === 'text-decoration: underline;') return (el.style.textDecoration || el.style.textDecorationLine || '').indexOf('underline') >= 0;
        return el.style.textAlign === name.replace('text-align: ', '').replace(';', '');
    }
    function chonPhoi(el) {
        Array.prototype.forEach.call(canvas.querySelectorAll('.mpi-phoi.is-active'), function (x) { x.classList.remove('is-active'); });
        sel = el;
        el.classList.add('is-active');
        boNut();
        Array.prototype.forEach.call(root.querySelectorAll('[data-cd],[data-cl]'), function (b) {
            batNut(b, laKieu(el, b.getAttribute('data-cd') || b.getAttribute('data-cl')));
        });
        f('left').value = px(el.style.marginLeft);
        f('top').value = px(el.style.marginTop);
        f('size').value = px(el.style.fontSize);
        f('rongnd').value = px(el.style.width);
        f('dinhdang').value = el.getAttribute('data-dinhdang') || '';
        f('noidung').value = el.textContent;
        canvas.focus({ preventScroll: true });
    }
    function boChon() {
        Array.prototype.forEach.call(canvas.querySelectorAll('.mpi-phoi.is-active'), function (x) { x.classList.remove('is-active'); });
        sel = null;
        boNut();
        f('left').value = ''; f('top').value = ''; f('dinhdang').value = '';
    }

    /* Kiểu chữ: bật/tắt; data-chudam = nối các kiểu đang bật (như gốc) */
    function doiKieu(b) {
        if (!sel) return;
        var name = b.getAttribute('data-cd');
        var on = !laKieu(sel, name);
        if (name === 'font-weight: bold;') { if (on) sel.style.fontWeight = 'bold'; else sel.style.removeProperty('font-weight'); }
        else if (name === 'font-style: italic;') { if (on) sel.style.fontStyle = 'italic'; else sel.style.removeProperty('font-style'); }
        else { if (on) sel.style.textDecoration = 'underline'; else sel.style.removeProperty('text-decoration'); }
        batNut(b, on);
        var s = '';
        Array.prototype.forEach.call(root.querySelectorAll('[data-cd]'), function (x) { if (x.classList.contains('ums-btn--primary')) s += x.getAttribute('data-cd'); });
        sel.setAttribute('data-chudam', s);
    }
    function doiCanLe(b) {
        if (!sel) return;
        var name = b.getAttribute('data-cl');
        Array.prototype.forEach.call(root.querySelectorAll('[data-cl]'), function (x) { batNut(x, x === b); });
        sel.style.textAlign = name.replace('text-align: ', '').replace(';', '');
        if (name === 'text-align: center;') sel.style.border = 'solid 2px gray';
        else sel.style.removeProperty('border');
        sel.setAttribute('data-canle', name);
    }

    /* ---------- Thêm / xoá / lưu nội dung ---------- */
    function themNoiDung() {
        if (!f('mau').value) { ui.toast('Bạn cần chọn mẫu in', 'warn'); return; }
        var v = f('noidung').value;
        if (!v) return;
        var trang = canvas.querySelectorAll('.mpi-page');
        var p = trang[iTrang] || trang[0];
        if (!p) return;
        p.appendChild(taoPhoi({ ID: '', TRANG: String(iTrang), NOIDUNG: v, style: 'margin-top: 100px; margin-left: 100px; ' }));
        f('noidung').value = '';
    }

    function xoaNoiDung() {
        if (!sel) { ui.toast('Chọn một nội dung trên phôi trước', 'warn'); return; }
        var el = sel, id = el.getAttribute('data-id');
        if (!id) { el.parentNode.removeChild(el); boChon(); return; }
        ui.confirm('Bạn có chắc chắn muốn xóa không!', { tone: 'bad', ok: 'Xoá' }).then(function (ok) {
            if (!ok) return;
            ums.api.call({ action: CT + 'Xoa', method: 'POST', strId: id })
                .then(function () { ui.toast('Xóa dữ liệu thành công!', 'ok'); if (el.parentNode) el.parentNode.removeChild(el); boChon(); })
                .catch(function (err) { ums.api.handle(err, 'xoá nội dung phôi'); });
        });
    }

    function thamSoMau(themMoi) {
        var o = {
            action: 'CMS_BaoCao_ThongTin_MH/FSkkLB4MIDQRKS4oCC8P',
            func: 'pkg_baocao_thongtin.Them_MauPhoiIn',
            strId: themMoi ? '' : mauId,
            strMaPhoi: m('ma').value,
            strTenPhoi: '',
            strKhogiay: f('khoangcach').value,
            strDoDai: f('cochu').value,
            strDoRong: f('dpi').value,
            strFont: f('font').value,
            strSoTrang: m('sotrang').value,
            strDuongDanFile: '',
            strMargin_Top: f('mtop').value,
            strMargin_Left: f('mleft').value
        };
        if (!themMoi) {
            var d = dongMau() || {};
            o.strMaPhoi = d.MAPHOI;
            o.strSoTrang = d.SOTRANG;
            o.strDuongDanFile = d.DUONGDANFILE;
            o.action = 'CMS_BaoCao_ThongTin_MH/EjQgHgwgNBEpLigILwPP';
            o.func = 'CMS_BaoCao_ThongTin_MH/Sua_MauPhoiIn';
        }
        return o;
    }

    function thamSoNoiDung(el) {
        var id = el.getAttribute('data-id') || '';
        return {
            action: CT + (id ? 'CapNhat' : 'ThemMoi'), method: 'POST',
            strId: id,
            strNoiDung: el.textContent,
            strLetrai: px(el.style.marginLeft),
            strLephai: el.getAttribute('data-chudam') || '',
            strLeTren: px(el.style.marginTop),
            strDinhDang: el.getAttribute('data-dinhdang') || '',
            strFontSize: px(el.style.fontSize),
            strTrang: el.getAttribute('data-trang') || '',
            strPhoi_MauPhoiIn_Id: f('mau').value,
            strCanLe_Trai_Phai_Giua: el.getAttribute('data-canle') || '',
            strDoRongPhanTuCanLe: px(el.style.width)
        };
    }

    function luuPhoi() {
        if (!mauId || !f('mau').value) { ui.toast('Bạn cần chọn mẫu in', 'warn'); return; }
        Array.prototype.forEach.call(canvas.querySelectorAll('.mpi-phoi.is-active'), function (x) { x.classList.remove('is-active'); });
        var calls = [thamSoMau(false)];
        Array.prototype.forEach.call(canvas.querySelectorAll('.mpi-phoi'), function (el) { calls.push(thamSoNoiDung(el)); });
        ui.batch(calls, { title: 'Đang lưu phôi', okText: 'Lưu thành công' }).then(function () {
            var giu = mauId;
            return taiMau().then(function () { setSel(f('mau'), giu); moMau(giu); });
        });
    }

    /* ---------- Thêm mẫu (biểu mẫu thay chỗ khung Phôi) ---------- */
    function moBieuMau() {
        m('ma').value = ''; m('sotrang').value = '1'; anh.set('');
        ui.swap(z('khungphoi'), z('bieumau'), { top: false });
        m('ma').focus();
    }
    function dongBieuMau() { ui.swap(z('bieumau'), z('khungphoi'), { top: false }); }

    /* getImage: ảnh mới → getDimensions.ashx → copyfile với strId = <userId>_<rộng>_<cao> */
    function duongDanAnh() {
        var src = anh.get();
        if (!src || src.indexOf('unsave_') < 0) return Promise.resolve(src || '');
        var uid = (ums.session && ums.session.userId) || '';
        var kichThuoc = demo()
            ? Promise.resolve('794_1123')
            : fetch((ums.session.rootPathUpload || '') + '/Handler/getDimensions.ashx?strFileName=' + encodeURIComponent(src), { method: 'POST', cache: 'no-store' })
                .then(function (r) { return r.text(); });
        return kichThuoc.then(function (t) {
            var id = String(t).indexOf('Sys_error') !== 0 ? uid + '_' + String(t).trim() : src;
            return anh.finalize(id);
        });
    }

    function luuMau() {
        if (!m('sotrang').value) { ui.toast('Số trang không được bỏ trống', 'warn'); return; }
        duongDanAnh().then(function (duong) {
            var o = thamSoMau(true);
            o.strDuongDanFile = duong;
            return ums.api.call(o);
        }).then(function (r) {
            ui.toast('Thêm mới thành công!', 'ok');
            var id = (r.raw && r.raw.Id) || '';
            dongBieuMau();
            return taiMau(id);
        }).catch(function (err) { ums.api.handle(err, 'lưu mẫu phôi in'); });
    }

    /* ---------- In ---------- */
    function inPhoi() {
        var pages = canvas.querySelectorAll('.mpi-page');
        if (!pages.length) { ui.toast('Chưa có phôi để in', 'warn'); return; }
        var h = '';
        Array.prototype.forEach.call(pages, function (p) {
            var c = p.cloneNode(true);
            c.classList.remove('mpi-page--trong');
            Array.prototype.forEach.call(c.querySelectorAll('.mpi-phoi'), function (x) {
                x.classList.remove('is-active');
                ['data-id', 'data-trang', 'data-dinhdang', 'data-chudam', 'data-canle'].forEach(function (a) { x.removeAttribute(a); });
            });
            h += c.outerHTML;
        });
        var co = Number(f('cochu').value) > 0 ? Number(f('cochu').value) : 13;
        ui.print(h, { title: 'Print', css:
            'body{margin:0} @media print{body{margin:0}}' +
            '.mpi-page{position:relative;background-repeat:no-repeat}' +
            '.mpi-page[hidden]{display:none}' +
            '.mpi-page + .mpi-page{page-break-before:always;break-before:page}' +
            '.mpi-phoi{position:absolute;font-family:"' + f('font').value.replace(/"/g, '') + '";font-size:' + co + 'px}' });
    }

    /* ---------- Sự kiện ---------- */
    root.addEventListener('click', function (ev) {
        var ph = ev.target.closest('.mpi-phoi');
        if (ph && canvas.contains(ph)) { ev.preventDefault(); chonPhoi(ph); return; }
        if (ev.target.closest('[data-z="canvas"]')) { boChon(); return; }
        var ch = ev.target.closest('[data-chip]');
        if (ch && z('trang').contains(ch)) {
            var k = ch.getAttribute('data-chip');
            var trang = canvas.querySelectorAll('.mpi-page');
            iTrang = k === 'all' ? 0 : Number(k);
            Array.prototype.forEach.call(trang, function (p, i) { p.hidden = k !== 'all' && i !== iTrang; });
            Array.prototype.forEach.call(z('trang').querySelectorAll('[data-chip]'), function (x) { x.classList.toggle('is-active', x === ch); });
            return;
        }
        var b = ev.target.closest('[data-cd]');
        if (b) { doiKieu(b); return; }
        b = ev.target.closest('[data-cl]');
        if (b) { doiCanLe(b); return; }
        b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'themmau') moBieuMau();
        else if (a === 'dongmau') dongBieuMau();
        else if (a === 'luumau') luuMau();
        else if (a === 'themnd') themNoiDung();
        else if (a === 'xoand') xoaNoiDung();
        else if (a === 'luu') luuPhoi();
        else if (a === 'in') inPhoi();
    });

    // Di chuyển nội dung đang chọn bằng phím mũi tên (chỉ khi vùng phôi đang giữ phím)
    canvas.addEventListener('keydown', function (ev) {
        if (!sel) return;
        var d = { 37: ['marginLeft', -1, 'left'], 39: ['marginLeft', 1, 'left'], 38: ['marginTop', -1, 'top'], 40: ['marginTop', 1, 'top'] }[ev.keyCode];
        if (!d) return;
        ev.preventDefault();
        var v = (parseInt(px(sel.style[d[0]]), 10) || 0) + d[1];
        sel.style[d[0]] = v + 'px';
        f(d[2]).value = v;
    });

    root.addEventListener('input', function (ev) {
        var k = ev.target.getAttribute('data-f');
        if (!k) return;
        if (k === 'cochu') { apFont(); return; }
        if (!sel) return;
        var v = ev.target.value;
        if (k === 'left') sel.style.marginLeft = v + 'px';
        else if (k === 'top') sel.style.marginTop = v + 'px';
        else if (k === 'size') sel.style.fontSize = v !== '' ? v + 'px' : '';
        else if (k === 'rongnd') sel.style.width = v !== '' ? v + 'px' : '';
        else if (k === 'noidung') sel.textContent = v;
    });
    // Định dạng bổ sung: rời ô → ghi vào data-dinhdang và nối vào style (như gốc), rồi xoá ô
    f('dinhdang').addEventListener('blur', function () {
        var v = f('dinhdang').value;
        if (sel) {
            sel.setAttribute('data-dinhdang', v);
            sel.setAttribute('style', (sel.getAttribute('style') || '') + v);
        }
        f('dinhdang').value = '';
    });
    f('noidung').addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && !sel) { ev.preventDefault(); themNoiDung(); } });

    if (window.jQuery) {
        jQuery(f('mau')).on('select2:select', function () { moMau(f('mau').value); });
        jQuery(f('mau')).on('select2:clear', function () { moMau(''); });
        jQuery(f('font')).on('select2:select', apFont);
    }

    taiMau();
})();
