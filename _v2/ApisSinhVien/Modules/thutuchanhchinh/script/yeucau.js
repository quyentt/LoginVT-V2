/* =========================================================================
   Yêu cầu một cửa — bản CÁN BỘ khai báo loại yêu cầu (mô tả dịch vụ + cấu trúc biểu mẫu)
   Bản gốc: ApisSinhVien/Modules/thutuchanhchinh/html/yeucau.html + script/yeucau.js
   (khác hẳn màn Cổng SV ApisCongSinhVien/thutuchanhchinh/yeucau — sinh viên GỬI yêu cầu; hai màn cùng dùng
   gói pkg_dvmc_thongtin nhưng không chung khung nào, nên không nạp _ttc.js).
   ---------------------------------------------------------------------------
   Bố cục giữ như gốc (MỘT cột): thanh lọc (ô Yêu cầu + từ khoá + Tìm kiếm) → khung "Thông tin yêu cầu" của loại
   yêu cầu đang chọn (bên trái: tiêu đề, mô tả, địa chỉ trả, số ngày / giờ / phút trả kết quả, thông báo khi đăng
   ký thành công, nút Lưu; bên phải: ảnh minh hoạ, đường dẫn mẫu) → "Danh sách" cấu trúc biểu mẫu (ums.crud).
   Thêm / sửa dòng cấu trúc: biểu mẫu thay chỗ danh sách (gốc là hộp #myModal — luật chung BO-CUC 1).

   Lời gọi (SV_DVMC_ThongTin_MH · pkg_dvmc_thongtin, chép nguyên):
     danh mục DVMC.YEUCAU                        → ô Yêu cầu (lọc) + ô "Loại yêu cầu" của biểu mẫu
     LayTTDVMC_YeuCu_MoTa (strYeuCau_Id)          → khung Thông tin yêu cầu (TIEUDE, MOTA, DIACHITRAYEUCAU, SONGAYTRAKETQUA,
                                                    SOGIOTRAKETQUA, SOPHUTTRAKETQUA, THONGBAOKHIDANGKYTHANHCONG, DUONGDANMAUDON, HINHANHMINHHOA)
     Them_DVMC_YeuCu_MoTa                         → Lưu khung đó (số ngày/giờ/phút trống gửi 0 như gốc), rồi gắn tệp
                                                    SV_Files vào id loại yêu cầu (saveFiles gốc)
     LayDSDVMC_CauTruc_YeuCau (strTuKhoa, strYeuCau_Id) → danh sách
     Them_ / Sua_DVMC_CauTruc_YeuCau (strYeuCau_Id, strNoiDung, dDongThu / dKichThuocDong trống gửi -1, strCanLe, dHieuLuc)
     Xoa_DVMC_CauTruc_YeuCau (strId)              → Xoá đã chọn (mỗi dòng một lời gọi như gốc)
   Giữ như gốc:
     · Ảnh minh hoạ: gửi đường dẫn TẠM của ảnh vừa tải lên (uploadAvatar gốc, không gọi getImage/copyfile).
     · Thêm dòng cấu trúc: ô "Loại yêu cầu" điền sẵn theo ô lọc; Hiệu lực mặc định "Có".
   Khác gốc / điểm treo:
     · "Đường dẫn mẫu": gốc biến CÙNG MỘT ô txtDuongDanMau thành ô tải tệp (uploadFiles) VÀ đọc giá trị của nó làm
       strDuongDanMauDon. Ở đây tách làm hai: ô chữ "Đường dẫn mẫu" (gửi strDuongDanMauDon, đổ DUONGDANMAUDON) và khung
       tệp đính kèm SV_Files của loại yêu cầu — kiểm trên host giá trị gốc thực sự gửi đi.
     · Chưa chọn Yêu cầu ở ô lọc thì khung Thông tin yêu cầu khoá (gốc cho bấm Lưu với strYeuCau_Id rỗng).
     · Cột "Hiệu lực": 0 → Không, còn lại → Có (như gốc).
   ========================================================================= */
(function () {
    'use strict';
    var ui = ums.ui, pat = ums.pat;
    var root = document.getElementById('ttc-yeucau-cb');
    if (!root) return;
    var A = 'SV_DVMC_ThongTin_MH/', P = 'pkg_dvmc_thongtin.';
    function uid() { return (ums.session && ums.session.userId) || ''; }
    function e(v) { return v === null || v === undefined ? '' : v; }
    function arr(d) { return Array.isArray(d) ? d : []; }
    function so(v, macDinh) { return v === '' || v === null || v === undefined ? macDinh : v; }
    var DM = { dm: 'DVMC.YEUCAU' };

    var crud = ums.crud({
        root: root,
        title: 'Yêu cầu',
        formTitle: 'cấu trúc yêu cầu',
        icon: 'fa-list',
        formCols: 1,
        rowDelete: false, formDelete: false,
        filters: [
            { key: 'yc', type: 'select', label: 'Chọn yêu cầu', source: DM },
            { key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }
        ],
        list: {
            call: function (f) {
                return { action: A + 'DSA4BRIFFwwCHgIgNBUzNCIeGCQ0AiA0', func: P + 'LayDSDVMC_CauTruc_YeuCau',
                    strTuKhoa: f.q || '', strYeuCau_Id: f.yc || '', strNguoiThucHien_Id: uid() };
            }
        },
        columns: [
            { title: 'Nội dung', prop: 'NOIDUNG' },
            { title: 'Loại yêu cầu', prop: 'YEUCAU_TEN' },
            { title: 'Dòng thứ', prop: 'DONGTHU', cls: 'is-center' },
            { title: 'Kích thước dòng', prop: 'KICHTHUOCDONG', cls: 'is-center' },
            { title: 'Căn lề', prop: 'CANLE', cls: 'is-center' },
            { title: 'Hiệu lực', cls: 'is-center', render: function (r) { return String(r.HIEULUC) === '0' ? 'Không' : 'Có'; } }
        ],
        fields: [
            { key: 'strYeuCau_Id', col: 'YEUCAU_ID', label: 'Loại yêu cầu', type: 'select', source: DM, placeholder: 'Chọn loại yêu cầu' },
            { key: 'strNoiDung', col: 'NOIDUNG', label: 'Nội dung', type: 'textarea' },
            { key: 'dDongThu', col: 'DONGTHU', label: 'Dòng thứ' },
            { key: 'dKichThuocDong', col: 'KICHTHUOCDONG', label: 'Kích thước' },
            { key: 'strCanLe', col: 'CANLE', label: 'Căn lề' },
            { key: 'dHieuLuc', col: 'HIEULUC', label: 'Hiệu lực', type: 'select', required: true, value: '1',
              source: { items: [{ ID: '1', TEN: 'Có' }, { ID: '0', TEN: 'Không' }] } }
        ],
        onForm: function (row, c) {
            if (row) return;
            // resetPopup gốc: Loại yêu cầu = ô lọc
            var el = c.root.querySelector('[data-scope="form"][data-k="strYeuCau_Id"]');
            if (el) { el.value = c.filterValues().yc || ''; if (window.jQuery) jQuery(el).trigger('change.select2'); }
        },
        save: function (v, row) {
            return {
                action: A + (row ? 'EjQgHgUXDAIeAiA0FTM0Ih4YJDQCIDQP' : 'FSkkLB4FFwwCHgIgNBUzNCIeGCQ0AiA0'),
                func: P + (row ? 'Sua_DVMC_CauTruc_YeuCau' : 'Them_DVMC_CauTruc_YeuCau'),
                strId: row ? row.ID : '', strYeuCau_Id: v.strYeuCau_Id, strNoiDung: v.strNoiDung,
                dDongThu: so(v.dDongThu, -1), dKichThuocDong: so(v.dKichThuocDong, -1), strCanLe: v.strCanLe,
                dHieuLuc: v.dHieuLuc, strNguoiThucHien_Id: uid()
            };
        },
        remove: function (ids) {
            return ids.map(function (id) {
                return { action: A + 'GS4gHgUXDAIeAiA0FTM0Ih4YJDQCIDQP', func: P + 'Xoa_DVMC_CauTruc_YeuCau', strId: id, strNguoiThucHien_Id: uid() };
            });
        }
    });

    /* ---------- Khung "Thông tin yêu cầu" — chèn giữa thanh lọc và danh sách (như gốc) ---------- */
    var tt = document.createElement('div');
    tt.innerHTML = pat.panel({ title: 'Thông tin yêu cầu', icon: 'fa-pen-field', cls: 'ums-u-mb-4',
        tools: ui.btn('save', { attr: { 'data-tt': 'luu' } }), body:
        '<div class="ums-grid ums-grid--main-aside">' +
            '<div class="ums-stack">' +
                ui.field('Tiêu đề', '<input class="ums-input" data-t="TIEUDE" autocomplete="off">') +
                ui.field('Mô tả chi tiết yêu cầu', '<textarea class="ums-textarea ttcyc-mota" data-t="MOTA"></textarea>') +
                ui.field('Địa chỉ trả về yêu cầu', '<input class="ums-input" data-t="DIACHITRAYEUCAU" autocomplete="off">') +
                '<div class="ums-grid ums-grid--3">' +
                    ui.field('Số ngày trả về kết quả', '<input class="ums-input" inputmode="numeric" data-t="SONGAYTRAKETQUA" autocomplete="off">') +
                    ui.field('Số giờ trả về kết quả', '<input class="ums-input" inputmode="numeric" data-t="SOGIOTRAKETQUA" autocomplete="off">') +
                    ui.field('Số phút trả về kết quả', '<input class="ums-input" inputmode="numeric" data-t="SOPHUTTRAKETQUA" autocomplete="off">') +
                '</div>' +
                ui.field('Thông báo khi đăng ký thành công dịch vụ', '<input class="ums-input" data-t="THONGBAOKHIDANGKYTHANHCONG" autocomplete="off">') +
            '</div>' +
            '<div class="ums-stack">' +
                ui.field('Hình ảnh minh họa', '<div data-tt="anh"></div>') +
                ui.field('Đường dẫn mẫu', '<input class="ums-input" data-t="DUONGDANMAUDON" autocomplete="off">') +
                ui.field('Tệp mẫu đơn', '<div data-tt="tep"></div>') +
            '</div>' +
        '</div>' });
    var list = crud.z('list');
    list.insertBefore(tt.firstChild, list.lastElementChild);
    var ttEl = root.querySelector('[data-tt="luu"]').closest('.ums-panel');
    var anh = ums.files.avatar(ttEl.querySelector('[data-tt="anh"]'), { width: 200, height: 210, icon: 'fa-image' });
    var tep = ums.files.mount(ttEl.querySelector('[data-tt="tep"]'), { api: 'SV_Files' });
    function o(k) { return ttEl.querySelector('[data-t="' + k + '"]'); }
    function ycId() { return crud.filterValues().yc || ''; }

    function khoaTT() {
        var co = !!ycId();
        Array.prototype.forEach.call(ttEl.querySelectorAll('[data-t]'), function (x) { x.disabled = !co; });
        root.querySelector('[data-tt="luu"]').disabled = !co;
    }
    function napTT() {
        var id = ycId();
        khoaTT();
        Array.prototype.forEach.call(ttEl.querySelectorAll('[data-t]'), function (x) { x.value = ''; });
        anh.set('');
        tep.load(id);
        if (!id) return;
        ums.api.call({ action: A + 'DSA4FRUFFwwCHhgkNAI0HgwuFSAP', func: P + 'LayTTDVMC_YeuCu_MoTa', strYeuCau_Id: id, strNguoiThucHien_Id: uid() })
            .then(function (r) {
                var d = arr(r.data)[0] || {};
                Array.prototype.forEach.call(ttEl.querySelectorAll('[data-t]'), function (x) { x.value = e(d[x.getAttribute('data-t')]); });
                anh.set(e(d.HINHANHMINHHOA));
            }).catch(function (err) { ums.api.handle(err, 'thông tin yêu cầu'); });
    }
    function luuTT() {
        var id = ycId();
        if (!id) { ui.toast('Vui lòng chọn yêu cầu', 'warn'); return; }
        if (tep.busy()) { ui.toast('Đang tải tệp lên, đợi xong rồi lưu', 'warn'); return; }
        ums.api.call({
            action: A + 'FSkkLB4FFwwCHhgkNAI0HgwuFSAP', func: P + 'Them_DVMC_YeuCu_MoTa',
            strYeuCau_Id: id, strMoTa: o('MOTA').value, strTieuDe: o('TIEUDE').value, strHinhAnhMinhHoa: anh.get(),
            strDiaChiTraYeuCau: o('DIACHITRAYEUCAU').value, strDuongDanMauDon: o('DUONGDANMAUDON').value, strNguoiThucHien_Id: uid(),
            dSoNgayTraKetQua: so(o('SONGAYTRAKETQUA').value, 0), dSoGioTraKetQua: so(o('SOGIOTRAKETQUA').value, 0),
            dSoPhutTraKetQua: so(o('SOPHUTTRAKETQUA').value, 0), strTBKhiDangKyThanhCong: o('THONGBAOKHIDANGKYTHANHCONG').value
        }).then(function () {
            ui.toast('Cập nhật thành công!', 'ok');
            return tep.save(id);
        }).then(napTT).catch(function (err) { ums.api.handle(err, 'lưu thông tin yêu cầu'); });
    }

    var elYC = root.querySelector('[data-scope="filter"][data-k="yc"]');
    if (window.jQuery) jQuery(elYC).on('select2:select select2:clear', function () { napTT(); crud.load(1); });
    ttEl.addEventListener('click', function (ev) { if (ev.target.closest('[data-tt="luu"]')) luuTT(); });
    napTT();
})();
