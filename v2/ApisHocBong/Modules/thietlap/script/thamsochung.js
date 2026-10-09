/* =========================================================================
   Tham số chung (xét duyệt)
   Bản gốc: ApisHocBong/Modules/thietlap/html/thamsochung.html + script/thamsochung.js
   Khung chung: script/_dk.js (ums.hbDk). Màn này có thêm vùng "Khai báo tham
   số" (nút ở cả hai tab): ba lưới dòng (ums.pat.rows) thay chỗ danh sách.
   ---------------------------------------------------------------------------
   Lời gọi (kiểu cũ, không func — chép nguyên; controller TN_* dù nằm ở Học bổng):
     TN_XetDuyet_ThamSo/LayDanhSach       GET: strTuKhoa, strPhanLoai_Id, strNguoiTao_Id = '' (gốc #dropAAAA)
     TN_XetDuyet_ThamSo/ThemMoi|CapNhat   POST: strId, strHT_ThuocTinhHocPhan_Id, strHT_HocPhanTinhDiem,
                                          strHT_MucKyLuat_Id, strHT_DanhGia_Id, strHT_KieuXet_Id,
                                          strHT_ThuocTinh_MonThi_Id, strHT_XetMonTuongDuong,
                                          strHT_ChoXetTuDong, strPhanLoai_Id, iThuTu = '' (+ strMoTa, xem dưới)
         ô chọn nhiều gửi chuỗi "a,b" (edu.util.getValCombo)
     TN_XetDuyet_ThamSo/Xoa               POST strIds
     TN_XetDuyet_ThamSo_Ad/LayDanhSach    GET: strTuKhoa, strPhanLoai_Id, strPhamViApDung_Id = '',
                                          strPhanCapApDung_Id, strDaoTao_ThoiGianDaoTao_Id = '', strNguoiTao_Id = ''
     TN_XetDuyet_ThamSo_Ad/ThemMoi|CapNhat  POST: strId, strXauDieuKien = '' (gốc #txtXauDieuKien —
                                          không có trên màn), strPhanLoai_Id, iThuTu = '', strMoTa,
                                          strPhamViApDung_Id, strDaoTao_ThoiGianDaoTao_Id = '' (+ strHT_*, xem dưới)
     TN_XetDuyet_ThamSo_Ad/Xoa            POST strIds
     TN_PhanCapApDung/LayDanhSach         GET strPhanLoai_Id (ô lọc tab 2)
     TN_ThongTin/LayDSTN_KeHoach          GET — ô Kế hoạch (tham số lọc lúc init = rỗng)
     Khai báo tham số (mỗi lưới: LayDanhSach GET strTuKhoa/strPhanLoai_Id/strXepLoai_Id/strNguoiTao_Id = '',
       pageIndex 1, pageSize 10000 · ThemMoi (id rỗng) | CapNhat POST · Xoa POST strIds):
       TN_PhanLoai_XepLoai      strPhanLoai_Id, strXepLoai_Id
       TN_NguoiDung_TinhTrang   strPhanLoai_Id, strNguoiDung_Id, strTinhTrang_Id
       TN_XacNhan_TinhTrang     strPhanLoai_Id, strTinhTrang_Id
       CMS_NguoiDung/LayDanhSach GET (versionAPI v1.0, iTrangThai 1, pageSize 1000000) — ô Người dùng (TENDAYDU)
   Danh mục: TN.PHANLOAI, KHCT.TTHP (hai ô thuộc tính), TN.MUCVIPHAMKYLUAT, DIEM.DANHGIA,
     TN.KIEUXETHOANTHANHCHUONGTRINH, KHCT.LOAILOP (Mô hình), VANBANG.XEPLOAI, TN.XACNHAN.

   Lỗi gốc đã sửa (phần chung: đầu tệp _dk.js):
     · "Lưu tham số" CHƯA TỪNG CHẠY: gọi save_…(id, strKetQua_Id) với biến
       strKetQua_Id không tồn tại → ReferenceError ở dòng đầu tiên. Nay lưu được;
       chỉ gửi dòng đổi / dòng mới có nhập (như điều kiện so name của gốc).
     · Lưới "phân loại xét - tình trạng xác nhận" không bao giờ nạp dòng đã lưu:
       toggle_danhmuc gọi nhầm getList_PhanCapApDung thay getList_LoaiXetTinhTrang.
     · Lưu điều kiện CHUNG không gửi Mô tả (ô có trên biểu mẫu, cột có trên bảng)
       → nay gửi strMoTa. Lưu điều kiện RIÊNG không gửi 8 thông số "Thông tin áp
       dụng" (chép từ màn xếp loại) dù biểu mẫu hiện và bảng đọc lại chúng → nay
       gửi strHT_* như điều kiện chung. Cả hai: cần kiểm procedure trên host.
   Bỏ: getList_TuKhoa / save_TuKhoa (bảng #tblTuKhoa không có trên màn — mã chết),
     getList_NamNhapHoc / ThoiGianDaoTao / genList_TrangThaiSV (không có lối vào).
   ========================================================================= */
(function () {
    'use strict';

    var root = document.getElementById('hb-thamsochung');
    if (!root) return;
    var ui = ums.ui, pat = ums.pat;

    function e(v) { return v === undefined || v === null ? '' : String(v); }
    var COKHONG = [{ ID: '1', TEN: 'Có áp dụng' }, { ID: '0', TEN: 'Không áp dụng' }];

    function thamSo(v) {
        return {
            strHT_ThuocTinhHocPhan_Id: v.strHT_ThuocTinhHocPhan_Id,
            strHT_HocPhanTinhDiem: v.strHT_HocPhanTinhDiem,
            strHT_MucKyLuat_Id: v.strHT_MucKyLuat_Id,
            strHT_DanhGia_Id: v.strHT_DanhGia_Id,
            strHT_KieuXet_Id: v.strHT_KieuXet_Id,
            strHT_ThuocTinh_MonThi_Id: v.strHT_ThuocTinh_MonThi_Id,
            strHT_XetMonTuongDuong: v.strHT_XetMonTuongDuong,
            strHT_ChoXetTuDong: v.strHT_ChoXetTuDong,
            iThuTu: '',
            strMoTa: v.strMoTa
        };
    }

    var M = ums.hbDk.man(root, {
        tieuDe: 'Tham số chung',
        phanLoai: { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', nhan: 'Phân loại', loc: 'Chọn phân loại', nguon: { dm: 'TN.PHANLOAI' } },
        cotChung: [
            { title: 'Thuộc tính các học phần cần kiểm tra hoàn thành', prop: 'HOANTHANH_THUOCTINHHOCPHAN_TEN' },
            { title: 'Xét học phần tính điểm, không tính điểm', prop: 'HOANTHANH_HOCPHANTINHDIEM_TEN' },
            { title: 'Xét các mức kỷ luật vi phạm', prop: 'HOANTHANH_MUCKYLUAT_TEN' },
            { title: 'Xét các mức đánh giá học phần ghi nhận hoàn thành', prop: 'HOANTHANH_DANHGIA_TEN' },
            { title: 'Xét mô hình kiểm tra hoàn thành chương trình học', prop: 'HOANTHANH_KIEUXET_TEN' },
            { title: 'Xét thuộc tính học phần các môn thi TN', prop: 'HOANTHANH_THUOCTINH_MONTHI_TEN' },
            { title: 'Xét áp dụng môn học tương đương', prop: 'HOANTHANH_XETMONTUONGDUONG_TEN' },
            { title: 'Xét có áp dụng tự động xét TN khi tổng hợp điểm hay không', prop: 'HETHONG_CHOXETTUDONG_TEN' },
            { head: '<span class="hbdk-rong">Mô tả</span>', prop: 'MOTA' }   // bảng 10 cột tràn ngang — tiêu đề giữ bề ngang để cột cuối không bị bóp
        ],
        phai: [
            { key: 'strHT_ThuocTinhHocPhan_Id', col: 'HOANTHANH_THUOCTINHHOCPHAN_ID', multi: true, type: 'select',
              label: 'Thuộc tính các học phần cần kiểm tra hoàn thành', source: { dm: 'KHCT.TTHP' }, placeholder: 'Chọn thuộc tính' },
            { key: 'strHT_HocPhanTinhDiem', col: 'HOANTHANH_HOCPHANTINHDIEM', type: 'select', required: true, value: '1',
              label: 'Xét học phần tính điểm, không tính điểm',
              source: { items: [{ ID: '1', TEN: 'Tính điểm' }, { ID: '0', TEN: 'Không tính' }] } },
            { key: 'strHT_MucKyLuat_Id', col: 'HOANTHANH_MUCKYLUAT_ID', multi: true, type: 'select',
              label: 'Xét các mức kỷ luật vi phạm', source: { dm: 'TN.MUCVIPHAMKYLUAT' }, placeholder: 'Chọn mức kỷ luật' },
            { key: 'strHT_DanhGia_Id', col: 'HOANTHANH_DANHGIA_ID', multi: true, type: 'select',
              label: 'Xét các mức đánh giá học phần ghi nhận hoàn thành', source: { dm: 'DIEM.DANHGIA' }, placeholder: 'Chọn mức đánh giá' },
            { key: 'strHT_KieuXet_Id', col: 'HOANTHANH_KIEUXET_ID', type: 'select',
              label: 'Xét mô hình kiểm tra hoàn thành chương trình học', source: { dm: 'TN.KIEUXETHOANTHANHCHUONGTRINH' }, placeholder: 'Chọn mô hình kiểm tra' },
            { key: 'strHT_ThuocTinh_MonThi_Id', col: 'HOANTHANH_THUOCTINH_MONTHI_ID', multi: true, type: 'select',
              label: 'Xét thuộc tính học phần các môn thi TN', source: { dm: 'KHCT.TTHP' }, placeholder: 'Chọn thuộc tính' },
            { key: 'strHT_XetMonTuongDuong', col: 'HOANTHANH_XETMONTUONGDUONG', type: 'select', required: true, value: '1',
              label: 'Xét áp dụng môn học tương đương', source: { items: COKHONG } },
            { key: 'strHT_ChoXetTuDong', col: 'HETHONG_CHOXETTUDONG', type: 'select', required: true, value: '1',
              label: 'Xét có áp dụng tự động xét TN khi tổng hợp điểm hay không', source: { items: COKHONG } },
            { key: 'strMoTa', col: 'MOTA', label: 'Mô tả', type: 'textarea' }
        ],
        chung: {
            ctl: 'TN_XetDuyet_ThamSo',
            ds: { strNguoiTao_Id: '' },
            luu: function (v) { return thamSo(v); }
        },
        rieng: {
            ctl: 'TN_XetDuyet_ThamSo_Ad',
            ds: { strNguoiTao_Id: '' },
            luu: function (v) {
                var c = thamSo(v);
                c.strXauDieuKien = '';
                return c;
            }
        },
        phanCap: 'TN_PhanCapApDung/LayDanhSach',
        keHoach: {
            call: {
                action: 'TN_ThongTin/LayDSTN_KeHoach', method: 'GET',
                strTuKhoa: '', strPhanLoai_Id: '', strDaoTao_ThoiGianDaoTao_Id: '',
                strNguoiDung_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000
            }
        },
        tuKhoa: null,
        toolbar: [{ text: 'Khai báo tham số', icon: 'fa-gears', mod: 'out-primary', onClick: function () { moThamSo(); } }]
    });

    /* =====================================================================
       Khai báo - Thiết lập tham số chung (zonedanhmuc của gốc)
       ===================================================================== */
    var PHANLOAI = { key: 'strPhanLoai_Id', col: 'PHANLOAI_ID', title: 'Loại xét', type: 'select', width: '220px',
                     source: { dm: 'TN.PHANLOAI' }, placeholder: 'Chọn phân loại' };
    var TINHTRANG = { key: 'strTinhTrang_Id', col: 'TINHTRANG_ID', title: 'Tình trạng xác nhận', type: 'select',
                      source: { dm: 'TN.XACNHAN' }, placeholder: 'Chọn tình trạng' };
    var pNguoiDung = null;
    function nguoiDung() {
        if (!pNguoiDung) {
            pNguoiDung = ums.api.call({
                action: 'CMS_NguoiDung/LayDanhSach', method: 'GET', silent: true, versionAPI: 'v1.0',
                strTuKhoa: '', pageIndex: 1, pageSize: 1000000, iTrangThai: 1,
                strChung_DonVi_Id: '', strVaiTro_Id: '', strPhanLoaiDoiTuong: '', strCapXuLy_Id: '', strTinhThanh_Id: ''
            }).then(function (r) { return Array.isArray(r.data) ? r.data : []; })
              .catch(function (err) { pNguoiDung = null; ums.api.handle(err, 'danh sách người dùng'); return []; });
        }
        return pNguoiDung;
    }

    /* Mỗi lưới: dòng cũ chỉ gửi khi đổi (so với giá trị đã lưu), dòng mới chỉ gửi khi có nhập */
    function luoi(host, o) {
        return pat.rows(host, {
            title: o.title, icon: 'fa-list-check',
            columns: o.cot,
            list: function () {
                return {
                    action: o.ctl + '/LayDanhSach', method: 'GET',
                    strTuKhoa: '', strPhanLoai_Id: '', strXepLoai_Id: '', strNguoiTao_Id: '', pageIndex: 1, pageSize: 10000
                };
            },
            filled: function (v, rec) {
                return o.cot.some(function (c) { return rec ? v[c.key] !== e(rec[c.col]) : !!v[c.key]; });
            },
            save: function (v, rec) {
                var c = { action: o.ctl + (rec ? '/CapNhat' : '/ThemMoi'), strId: rec ? rec.ID : '' };
                o.cot.forEach(function (x) { c[x.key] = v[x.key]; });
                return c;
            },
            remove: function (rec) { return { action: o.ctl + '/Xoa', strIds: rec.ID }; }
        });
    }

    var G = null;
    function moThamSo() {
        var phu = M.phu;
        if (!G) {
            phu.innerHTML =
                pat.page('Khai báo - Thiết lập tham số chung cho hệ thống xét tuyển',
                    ui.btn('close', { attr: { 'data-ts': 'dong' } }) +
                    ui.btn('save', { text: 'Lưu tham số', attr: { 'data-ts': 'luu' } })) +
                '<div class="ums-stack">' +
                '<div data-ts="plxl"></div><div data-ts="ndtt"></div><div data-ts="lxtt"></div></div>';
            G = {
                plxl: luoi(phu.querySelector('[data-ts="plxl"]'), {
                    title: 'Danh mục phân loại xét - xếp loại', ctl: 'TN_PhanLoai_XepLoai',
                    cot: [PHANLOAI, { key: 'strXepLoai_Id', col: 'XEPLOAI_ID', title: 'Xếp loại', type: 'select',
                                      source: { dm: 'VANBANG.XEPLOAI' }, placeholder: 'Chọn xếp loại' }]
                }),
                ndtt: luoi(phu.querySelector('[data-ts="ndtt"]'), {
                    title: 'Danh mục phân người dùng - tình trạng xác nhận', ctl: 'TN_NguoiDung_TinhTrang',
                    cot: [PHANLOAI, { key: 'strNguoiDung_Id', col: 'NGUOIDUNG_ID', title: 'Người dùng', type: 'select', s2: true,
                                      source: { load: nguoiDung, name: 'TENDAYDU' }, placeholder: 'Chọn người dùng' }, TINHTRANG]
                }),
                lxtt: luoi(phu.querySelector('[data-ts="lxtt"]'), {
                    title: 'Danh mục phân loại xét - tình trạng xác nhận', ctl: 'TN_XacNhan_TinhTrang',
                    cot: [PHANLOAI, TINHTRANG]
                })
            };
            phu.addEventListener('click', function (ev) {
                var b = ev.target.closest('[data-ts]');
                if (!b || !phu.contains(b)) return;
                var a = b.getAttribute('data-ts');
                if (a === 'dong') M.dongPhu();
                else if (a === 'luu') luu(b);
            });
        }
        napLai();
        M.moPhu();
    }
    function napLai() { G.plxl.load('1'); G.ndtt.load('1'); G.lxtt.load('1'); }   // lưới không có bản ghi cha — '1' chỉ để nạp
    function luu(b) {
        b.disabled = true;
        // Thứ tự như gốc: phân loại - xếp loại, loại xét - tình trạng, người dùng - tình trạng
        G.plxl.save('1').then(function () { return G.lxtt.save('1'); }).then(function () { return G.ndtt.save('1'); })
            .then(function () { ui.toast('Đã lưu tham số', 'ok'); napLai(); })
            .then(function () { b.disabled = false; });
    }
})();
