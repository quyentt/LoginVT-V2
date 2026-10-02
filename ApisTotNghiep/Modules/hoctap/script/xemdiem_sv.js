/*----------------------------------------------
--Discription: Trang gọn xem bảng điểm SV (nhúng trong modal của Xét TN, không dùng cơ chế thủ vai).
--Input: window._embeddedSinhVien_Id (do handler bên thuchienxet.js set trước khi loadPage)
--Gọi API pkg_congthongtin_hssv_thongtin.KetQuaHocTapCaNhan → render info + tổng điểm + bảng điểm theo học kỳ.
----------------------------------------------*/
function XemDiemSV() { }
XemDiemSV.prototype = {
    strNguoiHoc_Id: '',
    dtKetQua: {},

    init: function () {
        var me = this;
        me.strNguoiHoc_Id = window._embeddedSinhVien_Id || '';
        if (!me.strNguoiHoc_Id) {
            $('#xdsv_zone_bangdiem').html('<div class="empty">Không xác định được sinh viên.</div>');
            return;
        }
        me.getList_KetQuaHocTap();
    },

    getList_KetQuaHocTap: function () {
        var me = this;
        // Lookup ID ứng dụng "Cổng sinh viên" (CHOPHEPTHUVAI=1) để override strVaiTroDangNhap_Id — vì package pkg_congthongtin_hssv_thongtin chỉ chấp nhận role Cổng SV; nếu để nguyên role ApisTotNghiep sẽ bị ORA-24338. Fallback ID hard-code lấy từ log server.
        var strAppSV_Id = '80CF9E16C2D74F46A1ECE73B7C119A8F';
        try {
            var objSV = (edu.system.dtUngDung || []).find(function (e) { return e.CHOPHEPTHUVAI == 1; });
            if (objSV && objSV.ID) strAppSV_Id = objSV.ID;
        } catch (ex) { }
        var obj_save = {
            'action': 'SV_ThongTin_MH/CiQ1EDQgCS4iFSAxAiAPKSAv',
            'func': 'pkg_congthongtin_hssv_thongtin.KetQuaHocTapCaNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': '',
            'strChucNangHeThong_Id': strAppSV_Id,
            'strVaiTroDangNhap_Id': strAppSV_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': '',
            'strNguoiThucHien_Id': me.strNguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    $('#xdsv_zone_bangdiem').html('<div class="empty">Lỗi: ' + (data.Message || 'Không tải được bảng điểm.') + '</div>');
                    return;
                }
                me.dtKetQua = data.Data || {};
                me.render_ThongTin();
                me.render_TongDiem();
                me.render_BangDiem();
            },
            error: function (er) {
                $('#xdsv_zone_bangdiem').html('<div class="empty">Lỗi kết nối: ' + JSON.stringify(er) + '</div>');
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },

    render_ThongTin: function () {
        var me = this;
        var arr = me.dtKetQua.rsThongTinNguoiHoc || [];
        if (!arr.length) return;
        var sv = arr[0];
        $('#xdsv_hoten').text(edu.util.returnEmpty(sv.QLSV_NGUOIHOC_HODEM) + ' ' + edu.util.returnEmpty(sv.QLSV_NGUOIHOC_TEN));
        $('#xdsv_maso').text(edu.util.returnEmpty(sv.QLSV_NGUOIHOC_MASO));
        $('#xdsv_ngaysinh').text(edu.util.returnEmpty(sv.QLSV_NGUOIHOC_NGAYSINH));
        $('#xdsv_gioitinh').text(edu.util.returnEmpty(sv.QLSV_NGUOIHOC_GIOITINH));
        $('#xdsv_lop').text(edu.util.returnEmpty(sv.DAOTAO_LOPQUANLY_TEN));
        $('#xdsv_trangthai').text(edu.util.returnEmpty(sv.QLSV_TRANGTHAINGUOIHOC_TEN));
    },

    render_TongDiem: function () {
        var me = this;
        var arr = me.dtKetQua.rsDiemTrungBinhChung || [];
        var findVal = function (loai, thang, field) {
            var it = arr.find(function (e) {
                return e.DAOTAO_THOIGIANDAOTAO_ID === null
                    && e.LOAIDIEMTRUNGBINH_MA === loai
                    && e.THUOCTINHLANTINH === 0
                    && e.THANGDIEM_MA === thang;
            });
            return it ? edu.util.returnEmpty(it[field]) : '--';
        };
        $('#xdsv_tongtc').text(findVal('TRUNGBINHCHUNG', '10', 'TONGSOTINCHI'));
        $('#xdsv_tctichluy').text(findVal('TRUNGBINHTICHLUY', '10', 'TONGSOTINCHI'));
        $('#xdsv_tb10').text(findVal('TRUNGBINHCHUNG', '10', 'DIEMTRUNGBINH'));
        $('#xdsv_tb4').text(findVal('TRUNGBINHCHUNG', '4', 'DIEMTRUNGBINH'));
        $('#xdsv_tbtl10').text(findVal('TRUNGBINHTICHLUY', '10', 'DIEMTRUNGBINH'));
        $('#xdsv_tbtl4').text(findVal('TRUNGBINHTICHLUY', '4', 'DIEMTRUNGBINH'));
    },

    render_BangDiem: function () {
        var me = this;
        var data = me.dtKetQua.rsDiemKetThucHocPhan || [];
        if (!data.length) {
            $('#xdsv_zone_bangdiem').html('<div class="empty">Chưa có điểm học phần.</div>');
            return;
        }
        // Nhóm theo năm học + học kỳ
        var arrHocKy = [];
        data.forEach(function (e) {
            var key = e.NAMHOC + '_' + e.HOCKY;
            if (arrHocKy.indexOf(key) === -1) arrHocKy.push(key);
        });
        // Sort: năm giảm dần, kỳ giảm dần (mới nhất lên trên)
        arrHocKy.sort(function (a, b) {
            var pa = a.split('_'), pb = b.split('_');
            if (pa[0] !== pb[0]) return pb[0].localeCompare(pa[0]);
            return parseInt(pb[1], 10) - parseInt(pa[1], 10);
        });

        var html = '';
        arrHocKy.forEach(function (key) {
            var idx = key.lastIndexOf('_');
            var namHoc = key.substring(0, idx);
            var hocKy = key.substring(idx + 1);
            var rows = data.filter(function (e) { return e.NAMHOC === namHoc && String(e.HOCKY) === String(hocKy); });

            html += '<div class="hocky-block">';
            html += '<div class="hocky-header"><i class="fa fa-book"></i> Năm học ' + namHoc + ' - Học kỳ ' + hocKy + '</div>';
            html += '<table>';
            html += '<thead><tr>'
                + '<th style="width:40px">STT</th>'
                + '<th style="width:110px">Mã HP</th>'
                + '<th>Tên học phần</th>'
                + '<th style="width:50px">TC</th>'
                + '<th style="width:50px">Lần học</th>'
                + '<th style="width:50px">Lần thi</th>'
                + '<th style="width:70px">Hệ 10</th>'
                + '<th style="width:60px">Hệ 4</th>'
                + '<th style="width:60px">Chữ</th>'
                + '<th style="width:90px">Đánh giá</th>'
                + '<th>Ghi chú</th>'
                + '</tr></thead><tbody>';
            rows.forEach(function (e, i) {
                var danhGiaCls = '';
                var strDG = (e.DANHGIA_TEN || '').toString().toUpperCase();
                if (strDG === 'DAT' || strDG === 'ĐẠT') danhGiaCls = 'danhgia-dat';
                else if (strDG === 'KHONGDAT' || strDG === 'KHÔNG ĐẠT' || strDG === 'KHÔNGĐẠT') danhGiaCls = 'danhgia-khongdat';
                html += '<tr>'
                    + '<td class="c">' + (i + 1) + '</td>'
                    + '<td>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_MA) + '</td>'
                    + '<td>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_TEN) + '</td>'
                    + '<td class="c">' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_HOCTRINH) + '</td>'
                    + '<td class="c">' + edu.util.returnEmpty(e.LANHOC) + '</td>'
                    + '<td class="c">' + edu.util.returnEmpty(e.LANTHI) + '</td>'
                    + '<td class="c">' + edu.util.returnEmpty(e.DIEM) + '</td>'
                    + '<td class="c">' + edu.util.returnEmpty(e.DIEMQUYDOI) + '</td>'
                    + '<td class="c">' + edu.util.returnEmpty(e.DIEMQUYDOI_TEN) + '</td>'
                    + '<td class="c ' + danhGiaCls + '">' + edu.util.returnEmpty(e.DANHGIA_TEN) + '</td>'
                    + '<td>' + edu.util.returnEmpty(e.GHICHU) + '</td>'
                    + '</tr>';
            });
            html += '</tbody></table>';
            html += '</div>';
        });
        $('#xdsv_zone_bangdiem').html(html);
    }
};
