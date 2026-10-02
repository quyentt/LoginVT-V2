/* Dữ liệu mẫu cho dangky (Đăng ký học) — chỉ dùng ở chế độ dựng thử.
   Kho dữ liệu chung ở _dangky.demo.js (ums.dkyDemo); các lời GHI đổi thẳng kho
   đó nên đăng ký / hủy / đổi lịch thấy ngay kết quả trên màn hình. */
(function () {
    'use strict';
    var K = ums.dkyDemo;

    ums.demo.add({
        'PKG_DANGKYHOC_CHUNG1.LayDSChuongTrinh': function () { return K.ct; },
        'pkg_dangkyhoc_chung2.LayDSKeHoachDangKyHoc': function () { return K.kh; },
        'pkg_dangkyhoc_chung3.LayDSHocPhanDangToChuc': function () { K.datDaDangKy(); return K.hp; },

        /* Lớp học phần CHÍNH của học phần đang chọn + các nhóm kiểm soát (phương án) */
        'pkg_dangkyhoc_chung4.LayDSLopHocPhanDangToChuc': function (o) {
            var rs = K.lhp.filter(function (l) { return l.LOPHOCPHANCHINH === 1 && l.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; });
            if (o.strThuHoc) rs = rs.filter(function (l) { return o.strThuHoc.split(',').indexOf(String(l.THUHOC)) >= 0; });
            if (Number(o.dChiLayCacLopKhongTrung) === 1) rs = rs.filter(function (l) { return l.SOTHUCTEDANGKYHOC < l.SOLUONGDUKIENHOC; });
            return { rows: { rs: rs, rsNhomKiemSoat: [
                { ID: 'NKS1', TENNHOM: 'Phương án 1 - Sáng thứ 2, 4' },
                { ID: 'NKS2', TENNHOM: 'Phương án 2 - Chiều thứ 3, 5' }
            ] } };
        },

        /* Các lớp cùng nhóm (thảo luận / thực hành) — hộp "Chọn thêm … lớp" */
        'pkg_dangkyhoc_chung.LayDSLopHocPhanDangToChuc': function (o) {
            return { rows: {
                rs: K.lhp.filter(function (l) { return l.MANHOMLOP === o.strMaNhomLop; }),
                rsThuocTinhLopHocPhan: K.thuocTinh.filter(function (t) { return t.MANHOMLOP === o.strMaNhomLop; })
            } };
        },

        'PKG_DANGKYHOC_CHUNG6.LayKetQuaDangKyLopHocPhan': function () { return K.kq; },
        'PKG_DANGKYHOC_CHUNG6.LayGiangVienTheoHocPhan': [
            { ID: 'GV1', MASO: 'CB0125', HODEM: 'Nguyễn Văn', TEN: 'Bình' },
            { ID: 'GV2', MASO: 'CB0330', HODEM: 'Trần Thị', TEN: 'Hoa' },
            { ID: 'GV3', MASO: 'CB0412', HODEM: 'Lê Quang', TEN: 'Dũng' }
        ],
        'PKG_DANGKYHOC_CHUNG6.LayThuHocTheoHocPhan': [
            { THUHOC: '2' }, { THUHOC: '3' }, { THUHOC: '4' }, { THUHOC: '5' }, { THUHOC: '6' }, { THUHOC: '7' }
        ],

        'pkg_taichinh_thongtin.LayDSTinhTrangTaiChinhDKH': function () {
            return { raw: { Id: 1250000 }, rows: {
                rsConPhaiNopHienTai: [
                    { SOTIEN: 2400000, NOIDUNG: 'Học phí học kỳ 2 năm 2025 - 2026', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' },
                    { SOTIEN: 150000, NOIDUNG: 'Bảo hiểm y tế', DAOTAO_THOIGIANDAOTAO: '2025_2026_2' }
                ],
                rsConDuHienTai: [{ SOTIEN: 1250000, NOIDUNG: 'Nộp thừa học phí', DAOTAO_THOIGIANDAOTAO: '2025_2026_1' }],
                rsConPhaiNopTrongDotDK: K.kq.map(function (q) {
                    return { DANGKY_LOPHOCPHAN_TEN: q.DANGKY_LOPHOCPHAN_TEN, DAOTAO_HOCPHAN_TEN: q.DAOTAO_HOCPHAN_TEN, DAOTAO_HOCPHAN_MA: q.DAOTAO_HOCPHAN_MA,
                        TAICHINH_CACKHOANTHU_TEN: 'Học phí tín chỉ', SOTINCHI: 3, KIEUHOC_TEN: 'Học lần đầu',
                        SOTIEN: q.PHISAUKHITRUMIEN, PHAMTRAMMIEN: 0, SOTIENDUOCMIEN: 0, SOTIENPHAINOP: q.PHISAUKHITRUMIEN, DACHUYENKETOAN: 0 };
                })
            } };
        },

        /* Đổi lịch: các lớp khác cùng học phần / cùng thuộc tính */
        'PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanDangToChuc': function (o) {
            return { rows: { rs: K.lhp.filter(function (l) { return l.DAOTAO_HOCPHAN_ID === o.strDaoTao_HocPhan_Id; }) } };
        },
        'PKG_DANGKYHOC_CHUNG7.LayDSLopHocPhanTheoNhomKS': function (o) {
            return K.lhp.filter(function (l) { return l.LOPHOCPHANCHINH === 1; }).map(function (l, i) {
                return { MALOP: l.ID, TENLOP: l.TENLOP, SODUKIEN: l.SOLUONGDUKIENHOC, SODADANGKY: l.SOTHUCTEDANGKYHOC + (o.strTKB_NhomKiemSoat_Id === 'NKS2' ? i : 0) };
            });
        },

        /* ---- Lời GHI: đổi thẳng kho dữ liệu mẫu ---- */
        'DKH_DangKyMH/DangKyHocTrucTiep': function (o) {
            var d = K.doc(o), ids = String(d.strDangKy_LopHocPhan_Ids || '').split(',').filter(Boolean);
            ids.forEach(function (id) {
                var l = K.lop(id);
                if (!l || K.kq.filter(function (q) { return q.DANGKY_LOPHOCPHAN_ID === id; }).length) return;
                l.SOTHUCTEDANGKYHOC++;
                K.kq.push(K.dongKQ(l));
            });
            K.kq.sort(function (a, b) { return a.DAOTAO_HOCPHAN_ID < b.DAOTAO_HOCPHAN_ID ? -1 : 1; });
            K.datDaDangKy();
            return { rows: [], raw: { Id: 'DK' + Date.now() } };
        },
        'DKH_DangKyMH/ThucHienHuyDangKyHoc': function (o) {
            var d = K.doc(o), ids = String(d.strDangKy_LopHocPhan_Ids || '').split(',').filter(Boolean);
            K.kq = K.kq.filter(function (q) {
                if (ids.indexOf(q.DANGKY_LOPHOCPHAN_ID) < 0) return true;
                var l = K.lop(q.DANGKY_LOPHOCPHAN_ID);
                if (l && l.SOTHUCTEDANGKYHOC > 0) l.SOTHUCTEDANGKYHOC--;
                return false;
            });
            K.datDaDangKy();
            return { rows: [], raw: { Id: 'HUY' } };
        },
        'DKH_DangKyMH/ThucHienDoiLichDangKyHoc': function (o) {
            var d = K.doc(o);
            var cu = String(d.strDangKy_LopHocPhan_Cu_Ids || '').split(','), moi = String(d.strDangKy_LopHocPhan_Moi_Ids || '').split(',');
            cu.forEach(function (id, i) {
                if (!id || id === moi[i]) return;
                var l = K.lop(moi[i]);
                if (!l) return;
                K.kq = K.kq.map(function (q) { return q.DANGKY_LOPHOCPHAN_ID === id ? K.dongKQ(l) : q; });
            });
            K.datDaDangKy();
            return { rows: [], raw: { Id: 'DOI' } };
        }
    });
})();
