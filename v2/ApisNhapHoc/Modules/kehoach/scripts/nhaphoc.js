/* =========================================================================
   Kế hoạch nhập học
   Bản gốc: ApisNhapHoc/Modules/kehoach/html/nhaphoc.html + scripts/nhaphoc.js
   ---------------------------------------------------------------------------
   Bố cục gốc: thanh tìm (từ khoá + nút) · bảng "Danh sách" (Tải lại, Xóa, Truy/xuất,
   Tạo mới) · biểu mẫu thay chỗ danh sách: trái "#1 Thông tin kế hoạch" + "#2 Thông số
   áp dụng", phải bảng "Ca nhập học" có "Thêm dòng mới" → ums.crud một cột, lưới ca
   nhập học là ums.pat.rows đặt ngay dưới biểu mẫu (khuôn "lưới dòng nhập trong biểu mẫu").

   Lời gọi (chép nguyên):
     Danh sách  SV_CORE_NhapHoc_ThuTien_MH/… PKG_CORE_NhapHoc_ThuTien.LayDSNhapHoc_KeHoachNhapHoc
                POST, phân trang máy chủ (ums.nhKH.callDs)
     Chi tiết   NH_KeHoachNhapHoc/LayChiTiet  GET  strId
     Lưu        NH_KeHoachNhapHoc/ThemMoi | CapNhat  POST  strId, strTenKeHoach, strMoTa "",
                strNgayBatDau, strNgayKetThuc, strDAOTAO_KhoaDaoTao_Id, strMoHinhNhapHoc_Id,
                strMoHinhApDungPhieuThu_Id, strTAICHINH_HeThongPhieu_Id,
                strMoHinhApDungPhieuRut_Id, strTAICHINH_HeThongRut_Id
     Xoá        NH_KeHoachNhapHoc/Xoa  POST  strIds (nối dấu phẩy, một lời gọi)
     Hệ         KHCT_HeDaoTao/LayDanhSach  GET  (kiểu cũ, không lọc quyền — như gốc)
     Khóa       edu.system.getList_KhoaDaoTao → ums.ref.khoaDaoTao({ strHeDaoTao_Id })
     Phiếu      TC_HeThongPhieuThu/LayDanhSach  GET  (tên MAUIN_MA, dùng cho cả ô phiếu thu và phiếu rút)
     Danh mục   NHAPHOC.MOHINH, NHAPHOC.PHANBOPHIEUTHU, NHAPHOC.PHANBOPHIEURUT, NHAPHOC.CA.NHAPHOC
     Ca         NH_QuayNhapHoc/LayDSNhapHoc_KeHoach_CaNhapHoc  GET  strTC_KeHoachNhapHoc_Id, strNguoiThucHien_Id
                NH_QuayNhapHoc/Them_ | Sua_NhapHoc_KeHoach_CaNhapHoc  POST  strId, strCaNhapHoc_Id,
                    strTC_KeHoachNhapHoc_Id, dCaNhapHocHienTai, iThuTu, strMoTa, strNguoiThucHien_Id
                NH_QuayNhapHoc/Xoa_NhapHoc_KeHoach_CaNhapHoc  POST  strId, strNguoiThucHien_Id
     (Gốc còn nhét 'type': 'POST'/'GET' vào THÂN lời gọi ca nhập học — đó là tham số truyền tải
      bị đặt nhầm chỗ, không phải tham số procedure → bỏ.)

   Khác gốc:
     · Hệ → Khóa theo luật cha → con (gốc nạp sẵn mọi khóa, chọn được khóa khi chưa chọn hệ).
       Hệ KHÔNG gửi đi (như gốc). Mở biểu mẫu sửa: hệ lấy từ DAOTAO_HEDAOTAO_ID của chi tiết,
       thiếu thì tra theo khóa trong danh sách mọi khóa.
     · Lưu xong quay về danh sách (gốc ở lại biểu mẫu mà không nhận id mới → bấm Lưu lần hai
       là THÊM TRÙNG kế hoạch). Lưới ca lưu SAU kế hoạch, gắn vào id máy chủ trả (như gốc).
     · Ô "Tên kế hoạch" bắt buộc (valid_KHNH gốc khai nhưng không gọi kiểm).
     · Nút "Truy/xuất" (Import / Export dữ liệu) gốc không có xử lý → giữ nút, khoá.
     · Ô "Là ca đang chạy" của dòng mới / dòng chưa có giá trị mặc định "Ca đang chạy" (1) như gốc.
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('nhaphoc');
    if (!root) return;
    var ums = window.ums, ui = ums.ui, pat = ums.pat, N = ums.nhKH, e = N.e;
    var ca = null, curId = '', chuoi = null;

    var PHIEU = {
        call: {
            action: 'TC_HeThongPhieuThu/LayDanhSach', method: 'GET', versionAPI: 'v1.0',
            strTuKhoa: '', iTuKhoa_Number: -1, pageIndex: 1, pageSize: 10,
            strNguoiThucHien_Id: '', iTinhTrang: -1
        },
        id: 'ID', name: 'MAUIN_MA'
    };
    var HE = {
        call: {
            action: 'KHCT_HeDaoTao/LayDanhSach', method: 'GET',
            strTuKhoa: '', strDaoTao_HinhThucDaoTao_Id: '', strDaoTao_BacDaoTao_Id: '',
            strNguoiThucHien_Id: '', pageIndex: 1, pageSize: 1000000
        },
        id: 'ID', name: 'TENHEDAOTAO'
    };

    function khoaTen(r) { return e(r.TENKHOA) + ' - ' + e(r.DAOTAO_HEDAOTAO_TEN); }
    function napKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 100000 });
    }

    var crud = ums.crud({
        root: root,
        title: 'Kế hoạch nhập học',
        formTitle: 'kế hoạch nhập học',
        icon: 'fa-calendar-days',
        addText: 'Tạo mới',
        filters: [{ key: 'q', type: 'text', label: 'Nhập từ khóa tìm kiếm' }],
        toolbar: [{ text: 'Truy/xuất', icon: 'fa-file-excel', mod: 'out-info', onClick: function () {} }],

        list: {
            paged: true,
            call: function (f) { return N.callDs(f.q); }
        },
        columns: [
            { title: 'Tên kế hoạch', prop: 'TENKEHOACH' },
            { title: 'Thời gian', cls: 'is-center is-nowrap', render: function (r) {
                return ui.esc(e(r.NGAYBATDAU) + ' - ' + e(r.NGAYKETTHUC));
            } },
            { title: 'Hệ đào tạo', prop: 'DAOTAO_HEDAOTAO_TEN' },
            { title: 'Khóa đào tạo', prop: 'DAOTAO_KHOADAOTAO_TEN' },
            { title: 'Mô hình nhập học', prop: 'MOHINHNHAPHOC_TEN' },
            { title: 'Mô hình áp dụng', prop: 'MOHINHAPDUNGPHIEUTHU_TEN' }
        ],

        formCols: 2,
        fields: [
            { type: 'legend', label: '#1 Thông tin kế hoạch' },
            { key: 'strTenKeHoach', col: 'TENKEHOACH', label: 'Tên kế hoạch', placeholder: 'Nhập tên kế hoạch nhập học', required: true },
            { type: 'gap' },
            { key: 'strNgayBatDau', col: 'NGAYBATDAU', label: 'Ngày bắt đầu', type: 'date' },
            { key: 'strNgayKetThuc', col: 'NGAYKETTHUC', label: 'Ngày kết thúc', type: 'date' },
            { key: '_he', label: 'Hệ đào tạo', type: 'select', placeholder: 'Chọn hệ đào tạo', source: HE },
            { key: 'strDAOTAO_KhoaDaoTao_Id', col: 'DAOTAO_KHOADAOTAO_ID', label: 'Khóa đào tạo', type: 'select', placeholder: 'Chọn khóa đào tạo' },
            { type: 'legend', label: '#2 Thông số áp dụng' },
            { key: 'strMoHinhNhapHoc_Id', col: 'MOHINHNHAPHOC_ID', label: 'Mô hình nhập học', type: 'select',
              placeholder: 'Chọn mô hình nhập học', source: { dm: 'NHAPHOC.MOHINH' } },
            { type: 'gap' },
            { key: 'strMoHinhApDungPhieuThu_Id', col: 'MOHINHAPDUNGPHIEUTHU_ID', label: 'Mô hình áp dụng phiếu thu', type: 'select',
              placeholder: 'Chọn mô hình áp dụng phiếu thu', source: { dm: 'NHAPHOC.PHANBOPHIEUTHU' } },
            { key: 'strMoHinhApDungPhieuRut_Id', col: 'MOHINHAPDUNGPHIEURUT_ID', label: 'Mô hình áp dụng phiếu rút', type: 'select',
              placeholder: 'Chọn mô hình áp dụng phiếu rút', source: { dm: 'NHAPHOC.PHANBOPHIEURUT' } },
            { key: 'strTAICHINH_HeThongPhieu_Id', col: 'TAICHINH_HETHONGPHIEUTHU_ID', label: 'Phiếu thu', type: 'select',
              placeholder: 'Chọn phiếu', source: PHIEU },
            { key: 'strTAICHINH_HeThongRut_Id', col: 'TAICHINH_HETHONGPHIEURUT_ID', label: 'Phiếu rút', type: 'select',
              placeholder: 'Chọn phiếu', source: PHIEU }
        ],

        detail: function (row) {
            return { action: 'NH_KeHoachNhapHoc/LayChiTiet', method: 'GET', versionAPI: 'v1.0', strId: row.ID };
        },
        save: function (v, row) {
            return {
                action: row ? 'NH_KeHoachNhapHoc/CapNhat' : 'NH_KeHoachNhapHoc/ThemMoi',
                versionAPI: 'v1.0',
                strId: row ? row.ID : '',
                strTenKeHoach: v.strTenKeHoach,
                strMoTa: '',
                strNgayBatDau: v.strNgayBatDau,
                strNgayKetThuc: v.strNgayKetThuc,
                strDAOTAO_KhoaDaoTao_Id: v.strDAOTAO_KhoaDaoTao_Id,
                strMoHinhNhapHoc_Id: v.strMoHinhNhapHoc_Id,
                strMoHinhApDungPhieuThu_Id: v.strMoHinhApDungPhieuThu_Id,
                strTAICHINH_HeThongPhieu_Id: v.strTAICHINH_HeThongPhieu_Id,
                strMoHinhApDungPhieuRut_Id: v.strMoHinhApDungPhieuRut_Id,
                strTAICHINH_HeThongRut_Id: v.strTAICHINH_HeThongRut_Id
            };
        },
        rowDelete: false,
        formDelete: false,
        remove: function (ids) {
            return { action: 'NH_KeHoachNhapHoc/Xoa', versionAPI: 'v1.0', strIds: ids.join(',') };
        },
        removeConfirm: function () { return 'Bạn có chắc chắn muốn xóa dữ liệu hệ thống?'; },

        onForm: function (row, c, extra) {
            curId = row ? row.ID : '';
            var heEl = N.o(c, '_he'), khEl = N.o(c, 'strDAOTAO_KhoaDaoTao_Id');
            ganHe(heEl, khEl);
            if (row) datHeKhoa(heEl, khEl, row);
            else { pat.fill(khEl, [], { head: 'Chọn khóa đào tạo' }); chuoi.sync(); }

            if (!extra.querySelector('[data-nh="ca"]')) extra.innerHTML = '<div data-nh="ca"></div>';
            ca = pat.rows(extra.querySelector('[data-nh="ca"]'), {
                title: 'Ca nhập học', icon: 'fa-clock',
                columns: [
                    { key: 'strCaNhapHoc_Id', col: 'CANHAPHOC_ID', title: 'Ca nhập học', type: 'select',
                      source: { dm: 'NHAPHOC.CA.NHAPHOC' }, placeholder: 'Chọn ca nhập học' },
                    { key: 'dCaNhapHocHienTai', col: 'CANHAPHOCHIENTAI', title: 'Là ca đang chạy', type: 'select', width: '170px',
                      source: { items: [{ ID: '1', TEN: 'Ca đang chạy' }, { ID: '0', TEN: 'Ca đã chạy' }] }, placeholder: 'Ca đang chạy' },
                    { key: 'iThuTu', col: 'THUTU', title: 'Thứ tự', width: '110px' },
                    { key: 'strMoTa', col: 'MOTA', title: 'Mô tả' }
                ],
                list: function (id) {
                    return { action: 'NH_QuayNhapHoc/LayDSNhapHoc_KeHoach_CaNhapHoc', method: 'GET',
                        strTC_KeHoachNhapHoc_Id: id, strNguoiThucHien_Id: N.uid() };
                },
                filled: function (v) { return !!v.strCaNhapHoc_Id; },          // gốc bỏ qua dòng chưa chọn ca
                save: function (v, rec, id) {
                    return {
                        action: rec ? 'NH_QuayNhapHoc/Sua_NhapHoc_KeHoach_CaNhapHoc' : 'NH_QuayNhapHoc/Them_NhapHoc_KeHoach_CaNhapHoc',
                        strId: rec ? rec.ID : '',
                        strCaNhapHoc_Id: v.strCaNhapHoc_Id,
                        strTC_KeHoachNhapHoc_Id: id,
                        dCaNhapHocHienTai: v.dCaNhapHocHienTai || '1',
                        iThuTu: v.iThuTu,
                        strMoTa: v.strMoTa,
                        strNguoiThucHien_Id: N.uid()
                    };
                },
                remove: function (rec) {
                    return { action: 'NH_QuayNhapHoc/Xoa_NhapHoc_KeHoach_CaNhapHoc', strId: rec.ID, strNguoiThucHien_Id: N.uid() };
                }
            });
            (row ? ca.load(row.ID) : ca.clear()).then(macDinhCa);
        },
        onSaved: function (c, result) {
            var id = curId || (result.raw && result.raw.Id) || '';
            if (ca && id) ca.save(id);
        }
    });

    /* Nút "Truy/xuất" gốc (Import / Export dữ liệu) không có xử lý nào → giữ nút, khoá */
    var tx = root.querySelector('[data-c="' + crud.uid + ':tool0"]');
    if (tx) { tx.disabled = true; tx.title = 'Chưa có chức năng (bản gốc không có xử lý)'; }

    /* Ô "Là ca đang chạy" trống → "Ca đang chạy" (option đầu của ô gốc) */
    function macDinhCa() {
        Array.prototype.forEach.call(root.querySelectorAll('select[data-rk="dCaNhapHocHienTai"]'), function (el) {
            if (!el.value) el.value = '1';
        });
    }
    root.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-rows="add"]')) setTimeout(macDinhCa, 0);
    });

    /* ---------- Hệ → Khóa (luật cha → con) ---------------------------------- */
    var daGan = false;
    function ganHe(heEl, khEl) {
        if (daGan) return;
        daGan = true;
        jQuery(heEl).on('select2:select select2:clear', function () {
            var he = heEl.value;
            if (!he) { pat.fill(khEl, [], { head: 'Chọn khóa đào tạo' }); return; }
            napKhoa(he).then(function (rs) { pat.fill(khEl, rs, { name: khoaTen, head: 'Chọn khóa đào tạo' }); })
                .catch(function (err) { ums.api.handle(err, 'khóa đào tạo'); });
        });
        chuoi = pat.chain([heEl, khEl], { phatLai: false });
    }
    function datHeKhoa(heEl, khEl, row) {
        var khoa = e(row.DAOTAO_KHOADAOTAO_ID);
        var timHe = row.DAOTAO_HEDAOTAO_ID ? Promise.resolve(e(row.DAOTAO_HEDAOTAO_ID))
            : (khoa ? napKhoa('').then(function (rs) {
                var k = rs.filter(function (x) { return String(x.ID) === khoa; })[0];
                return k ? e(k.DAOTAO_HEDAOTAO_ID) : '';
            }) : Promise.resolve(''));
        timHe.then(function (he) {
            N.dat(heEl, he, row.DAOTAO_HEDAOTAO_TEN);
            return he ? napKhoa(he) : [];
        }).then(function (rs) {
            pat.fill(khEl, rs, { name: khoaTen, head: 'Chọn khóa đào tạo' });
            N.dat(khEl, khoa, e(row.DAOTAO_KHOADAOTAO_TEN));
            chuoi.sync();
            /* Không tra được hệ mà chi tiết có khóa → vẫn mở ô khóa để không khoá cứng giá trị đang có */
            if (khoa && !heEl.value) { khEl.disabled = false; jQuery(khEl).trigger('change.select2'); }
        }).catch(function (err) { ums.api.handle(err, 'khóa đào tạo'); });
    }
})();
