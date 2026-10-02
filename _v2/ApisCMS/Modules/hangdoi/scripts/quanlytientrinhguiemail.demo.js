/* Dữ liệu mẫu cho hangdoi/quanlytientrinhguiemail — chỉ dùng ở chế độ dựng thử.
   MAILTO của máy chủ thay "@" bằng ký tự mã 4 (màn đổi ngược lại). */
(function () {
    var A = String.fromCharCode(4);
    var CT = [{ ID: 'CT1', MA: 'THONGBAO_HOCPHI' }, { ID: 'CT2', MA: 'THONGBAO_LICHTHI' }, { ID: 'CT3', MA: 'XACNHAN_DANGKY' }];
    var TEN = ['nguyenvan.an', 'tranthi.binh', 'le.hoang.cuong', 'pham.thu.dung', 'vo.minh.em', 'dang.quoc.phong', 'bui.thanh.giang'];
    var ROWS = TEN.map(function (t, i) {
        var dg = ['1', '1', '2', '0', '1', '2', '0'][i];
        return {
            ID: 'Q' + (i + 1), CAUTRUC: CT[i % 3].ID, MAILTO: t + A + 'sv.truong.edu.vn',
            MAILSUBJECT: ['Thông báo học phí học kỳ 1', 'Lịch thi cuối kỳ', 'Xác nhận đăng ký học phần'][i % 3],
            NOIDUNGEMAIL: '<p>Chào bạn,</p><p>' + ['Học phí học kỳ 1 năm học 2026-2027 là <b>8.750.000 đ</b>, hạn nộp 15/10/2026.',
                'Lịch thi cuối kỳ đã được công bố trên cổng sinh viên.', 'Bạn đã đăng ký thành công 18 tín chỉ.'][i % 3] + '</p>',
            NGAYGUI: (20 + (i % 5)) + '/09/2026 0' + (8 + (i % 2)) + ':1' + i + ':00',
            DAGUI: dg, LOIGUIMAIL: dg === '2' ? '550 5.1.1 Mailbox unavailable' : ''
        };
    });
    ums.demo.add({
        'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail': CT,
        'CMS_TienIch/LayDS_TienTrinhGuiEmail': function (o) {
            var q = (o.strTuKhoa || '').toLowerCase();
            var r = ROWS.filter(function (x) {
                return (!o.strCauTrucNoiDungGuiEmailId || x.CAUTRUC === o.strCauTrucNoiDungGuiEmailId) &&
                    (!q || (x.MAILTO + ' ' + x.MAILSUBJECT).toLowerCase().indexOf(q) >= 0);
            });
            var s = Number(o.pageSize) || 10, p = Number(o.pageIndex) || 1;
            return { rows: r.slice((p - 1) * s, p * s), pager: r.length };
        },
        'CMS_TienIch/ThucHienGuiEmail': function (o) {
            String(o.ArrstrId || '').split(',').forEach(function (id) {
                ROWS.forEach(function (x) { if (x.ID === id) { x.DAGUI = '1'; x.LOIGUIMAIL = ''; } });
            });
            return { rows: [], message: 'OK' };
        },
        'CMS_TienIch/LayDS_LichSuGuiEmailBy': function (o) {
            var x = ROWS.filter(function (r) { return r.ID === o.strHangDoiGuiEmail_Id; })[0];
            if (!x) return [];
            return [
                { ID: x.ID + '-1', MAILTO: x.MAILTO, NOIDUNGEMAIL: x.NOIDUNGEMAIL, NGAYGUI: '19/09/2026 08:00:00', DAGUI: '2', LOIGUIMAIL: 'Timeout kết nối máy chủ SMTP' },
                { ID: x.ID + '-2', MAILTO: x.MAILTO, NOIDUNGEMAIL: x.NOIDUNGEMAIL, NGAYGUI: x.NGAYGUI, DAGUI: x.DAGUI, LOIGUIMAIL: x.LOIGUIMAIL }
            ];
        }
    });
})();
