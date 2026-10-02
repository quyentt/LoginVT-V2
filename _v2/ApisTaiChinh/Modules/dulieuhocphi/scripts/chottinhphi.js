/* =========================================================================
   Quy trình 2: Chốt tính phí
   Bản gốc: ApisTaiChinh/Modules/dulieuhocphi/scripts/chottinhphi.js
   ---------------------------------------------------------------------------
   Nguồn ô chọn (xem _chung.js):
       pkg_kehoach_thongtin.LayDSDaoTao_HeDaoTao / LayDSKS_DaoTao_KhoaDaoTao (ums.ref)
       CM_ThoiGianDaoTao/LayDSDAOTAO_ThoiGianDaoTao    GET (chọn MỘT)
       TC_KhoanThu/LayDanhSach                         GET, toàn bộ khoản thu
       danh mục QLTC.NVAP                              nghiệp vụ áp dụng
       CM_DanhMucDuLieu/LayDanhSach#QLSV.TRANGTHAI     trạng thái sinh viên
   Tác vụ:
       TC_HangDoi/TaoHangDoi_ChuyenKeToan_TuDong       GET — đúng như bản gốc (nút "Chốt
                                                        tính phí" gọi action tên "ChuyenKeToan",
                                                        KHÔNG có tiền tố P như màn chuyển kế
                                                        toán; nghi ngờ nhưng giữ nguyên)
       ums.queue CHOTTINHPHITUDONG                     hàng đợi + lịch sử
       TC_KetQuaDaTinhPhi_ChuaKiemTra/LayDanhSach      GET, theo tín chỉ
       TC_KetQuaDaTinhPhi_NC_ChuaKiemTra/LayDanhSach   GET, theo niên chế
       TC_KetQuaDaTinhPhi_NC/LayDanhSach               GET, chi tiết một SV
       ums.report (getList_MauImport)                  báo cáo

   Khác bản gốc, có chủ đích:
     · Nút "Xem danh sách" của bản gốc KHÔNG chạy: sự kiện gắn bằng
       $("#tblTaskBar_ChotTinhPhi").delegate("#btnXemDanhSach") nhưng nút nằm
       ngoài bảng đó. Ở đây nút nạp hai bảng như ý đồ của mã.
     · Loại nhiệm vụ hàng đợi: bản gốc ghép "CHOTTINHPHITUDONG" + giá trị ô
       nghiệp vụ LÚC KHỞI TẠO — khi đó ô chưa có dữ liệu nên luôn là
       "CHOTTINHPHITUDONG". Giữ nguyên chuỗi đó (chưa rõ máy chủ tạo hàng đợi
       với loại nào).
     · Hộp xác nhận ghi "Chốt tính phí" (bản gốc chép nhầm "Tính học phí").
   Bỏ: loadProgressBar, proSeq…, genHTML_HangDoi, getList_MauImport riêng
   (SYS_Import_PhanQuyen — hàm chết, không nơi nào gọi), fakedb.
   ========================================================================= */
(function () {
    'use strict';

    var ui = ums.ui, H = ums.hocphi;
    var root = document.getElementById('chottinhphi');

    root.innerHTML =
        '<div class="ums-page__head">' +
            '<h1 class="ums-page__title ums-u-mb-0">Chốt tính phí</h1>' +
            '<div class="ums-page__actions"><span data-z="report"></span></div>' +
        '</div>' +
        '<div data-z="main">' +
            '<div class="ums-grid ums-grid--2 ums-u-mb-4">' +
                '<div><div class="ums-panel">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-lock"></i> Quy trình 2: Chốt tính phí</div></div>' +
                    '<div class="ums-panel__body ums-filter hp-cond">' +
                        H.selField('ctpHe', 'Hệ đào tạo', { head: '-- Chọn hệ đào tạo --' }) +
                        H.selField('ctpKhoa', 'Khóa đào tạo', { head: '-- Chọn khóa đào tạo --' }) +
                        H.selField('ctpThoiGian', 'Thời gian đào tạo', { head: '-- Chọn thời gian đào tạo --' }) +
                        H.selField('ctpKhoanThu', 'Khoản thu', { head: '-- Chọn khoản thu --' }) +
                        H.selField('ctpNghiepVu', 'Nghiệp vụ áp dụng', { head: '-- Chọn nghiệp vụ --' }) +
                        '<div class="ums-legend ums-legend--cach">Chọn trạng thái sinh viên</div>' +
                        '<div data-z="tt"></div>' +
                    '</div>' +
                    '<div class="ums-panel__foot ums-row--end">' +
                        '<button type="button" class="ums-btn ums-btn--out-primary" data-a="xem"><i class="fa-light fa-list"></i><span>Xem danh sách</span></button>' +
                        '<button type="button" class="ums-btn ums-btn--primary" data-a="chot"><i class="fa-light fa-lock"></i><span>Chốt tính phí</span></button>' +
                    '</div>' +
                '</div></div>' +
                '<div><div class="ums-panel">' +
                    '<div class="ums-panel__head"><div class="ums-panel__title"><i class="fa-light fa-clock-rotate-left"></i> Tiến trình · Lịch sử chốt tính học phí</div></div>' +
                    '<div class="ums-panel__body" data-z="queue"></div>' +
                '</div></div>' +
            '</div>' +
            '<div data-z="kq"></div>' +
        '</div>' +
        '<div data-z="detail" hidden></div>';

    function z(k) { return root.querySelector('[data-z="' + k + '"]'); }
    function v(id) { return H.val(document.getElementById(id)); }
    function fail(where) { return function (err) { ums.api.handle(err, where); }; }

    H.s2(root);
    var tt = H.trangThai(z('tt'));

    /* ---------- Ô chọn ------------------------------------------------------ */
    function loadKhoa(he) {
        return ums.ref.khoaDaoTao({ strHeDaoTao_Id: he, strCoSoDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 10000 })
            .then(function (r) { H.fill('ctpKhoa', r, { name: 'TENKHOA', head: 'Chọn khóa đào tạo' }); }).catch(fail('khóa đào tạo'));
    }
    ums.ref.heDaoTao({ strHinhThucDaoTao_Id: '', strBacDaoTao_Id: '', strTuKhoa: '', pageIndex: 1, pageSize: 1000 })
        .then(function (r) { H.fill('ctpHe', r, { name: 'TENHEDAOTAO', head: 'Chọn hệ đào tạo' }); }).catch(fail('hệ đào tạo'));
    loadKhoa('');
    H.thoiGianDaoTao().then(function (r) { H.fill('ctpThoiGian', r, { name: 'DAOTAO_THOIGIANDAOTAO', head: 'Chọn học kỳ' }); }).catch(fail('thời gian đào tạo'));
    H.khoanThu().then(function (r) { H.fill('ctpKhoanThu', r, { name: 'TEN', head: 'Chọn khoản thu' }); }).catch(fail('khoản thu'));
    ums.api.dm('QLTC.NVAP').then(function (r) { H.fill('ctpNghiepVu', r, { head: 'Chọn nghiệp vụ áp dụng' }); }).catch(fail('nghiệp vụ'));
    H.on('ctpHe', function () { loadKhoa(v('ctpHe')); });
    // Chưa chọn tầng trên thì khoá tầng dưới; xoá tầng trên thì xoá tầng dưới
    ums.pat.chain([document.getElementById('ctpHe'), document.getElementById('ctpKhoa')], { phatLai: false });

    /* ---------- Kết quả ------------------------------------------------------ */
    function dk() {
        return {
            strDaoTao_ThoiGianDaoTao_Id: v('ctpThoiGian'),
            strHeDaoTao_Id: v('ctpHe'),
            strKhoaDaoTao_Id: v('ctpKhoa'),
            strNghiepVuApDung_Id: v('ctpNghiepVu'),
            strTaiChinh_CacKhoanThu_Id: v('ctpKhoanThu'),
            strNguoiThucHien_Id: ''
        };
    }
    function withAction(action, o) {
        var c = { action: action, method: 'GET', versionAPI: 'v1.0' };
        Object.keys(o).forEach(function (key) { c[key] = o[key]; });
        return c;
    }
    var kq = H.mountKetQua({
        host: z('kq'), main: z('main'), detail: z('detail'),
        tinChi: function () { return withAction('TC_KetQuaDaTinhPhi_ChuaKiemTra/LayDanhSach', dk()); },
        nienChe: function () { return withAction('TC_KetQuaDaTinhPhi_NC_ChuaKiemTra/LayDanhSach', dk()); },
        chiTiet: function (id) {
            return withAction('TC_KetQuaDaTinhPhi_NC/LayDanhSach', {
                strDaoTao_ThoiGianDaoTao_Id: v('ctpThoiGian'),
                strTaiChinh_CacKhoanThu_Id: v('ctpKhoanThu'),
                strNguoiThucHien_Id: '',
                strNghiepVuApDung_Id: v('ctpNghiepVu'),
                strChuongTrinh_Id: '',
                strQLSV_NguoiHoc_Id: id
            });
        }
    });

    /* ---------- Hàng đợi + báo cáo ------------------------------------------ */
    var queue = ums.queue.mount(z('queue'), {
        strLoaiNhiemVu: 'CHOTTINHPHITUDONG',
        strName: 'ChotTinhPhi',
        onDone: function () { kq.loadTinChi(); kq.loadNienChe(); }     // endHangDoi
    });

    ums.report.mount(z('report'), {
        collect: function (add) {
            add('strHeDaoTao', v('ctpHe'));
            add('strKhoaDaoTao', v('ctpKhoa'));
            add('strThoiGianDaoTao', v('ctpThoiGian'));
            add('strKhoanThu', v('ctpKhoanThu'));
            add('strNghiepVu', v('ctpNghiepVu'));
        }
    });

    /* ---------- Chốt tính phí ------------------------------------------------ */
    function chot() {
        ui.confirm('Bạn có chắc chắn Chốt tính phí không?', { title: 'Chốt tính phí', ok: 'Chốt tính phí' }).then(function (yes) {
            if (!yes) return;
            ums.api.call({
                action: 'TC_HangDoi/TaoHangDoi_ChuyenKeToan_TuDong',
                method: 'GET',
                versionAPI: 'v1.0',
                strTaiChinh_CacKhoanThu_Id: v('ctpKhoanThu'),
                strDaoTao_ThoiGianDaoTao_Id: v('ctpThoiGian'),
                strDaoTao_HeDaoTao_Id: v('ctpHe'),
                strDaoTao_KhoaDaoTao_Id: v('ctpKhoa'),
                strNghiepVuApDung_Id: v('ctpNghiepVu'),
                strTrangThaiNguoiHoc_Id: tt.ids().join(','),
                strNguoiThucHien_Id: ''
            }).then(function () {
                ui.toast('Khởi tạo dữ liệu thành công, vui lòng chạy tiến trình để thực hiện!', 'ok');
                queue.reload();
            }).catch(fail('tạo hàng đợi chốt tính phí'));
        });
    }

    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-a]');
        if (!b || !root.contains(b)) return;
        var a = b.getAttribute('data-a');
        if (a === 'chot') chot();
        else if (a === 'xem') { kq.loadNienChe(); kq.loadTinChi(); }
    });
})();
