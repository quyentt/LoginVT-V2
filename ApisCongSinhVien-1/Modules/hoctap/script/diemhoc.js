/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DiemHoc() { };
DiemHoc.prototype = {
    dtKetQua: [],
    strNguoiHoc_Id: '',
    init: function () {
        var me = this;

        //$("#zoneDiemMoi").delegate('.chitietdiem', 'mouseenter', function (e) {
        //    var point = this;
        //    var id = this.id;
        //    me.popover_DiemHoc(id, point);
        //});

        //$("#zone_bangdiem").delegate('.btnXemDiemThanhPhan', 'mouseenter', function (e) {
        //    var point = this;
        //    var id = this.id;
        //    me.popover_DiemThanhPhan(id, point);
        //});
        $("#zone_bangdiem").delegate('.btnXemDiemThanhPhan', 'click', function (e) {
            var point = this;
            var id = this.id;
            me.getList_DiemThanhPhan(id, point);
        });
        try {
            if (main_doc && main_doc.LichGiang && main_doc.LichGiang.strSinhVien_Id) me.strNguoiHoc_Id = main_doc.LichGiang.strSinhVien_Id
            else
                me.strNguoiHoc_Id = edu.system.userId;// 'e7c4d5e4b2ed4ea1a50c3aaaac1988f6';
        } catch {
            me.strNguoiHoc_Id = edu.system.userId;// 'e7c4d5e4b2ed4ea1a50c3aaaac1988f6';
        }

        me.getList_ChuongTrinhHoc();
        me.getList_ThoiGianDangKy(me.strNguoiHoc_Id);
        me.getList_QuaTrinhQuyetDinh();
        me.getList_VanBang();
        me.getList_DiemRenLuyen();
        // test

        //me.dtKetQua = JSON.parse(dtResult).Data;

        //me.genHtml_ThongTinCaNhan();
        //me.genHtml_DiemMoi();
        //me.genHtml_TongDiem();
        //me.genHtml_BangDiem();
        //me.genHtml_HocPhanChuaQua();
        //end test

        $('#dropSearch_ChuongTrinh').on('change', function () {
            if (!edu.util.getValById('dropSearch_ChuongTrinh')) return;
            me.getList_KetQuaHocTap();
            me.getList_TichLuyTheoKhoi();
            me.getList_CanhBao();
        });

        // Hộp "Tổng điểm": đổi phạm vi (Toàn khóa / Năm học / Học kỳ) và đổi năm học / học kỳ cụ thể
        $('#selTongDiem_PhamVi').on('change', function () {
            me.genCombo_TongDiemKy();
            me.render_TongDiem();
        });
        $('#selTongDiem_Ky').on('change', function () {
            me.render_TongDiem();
        });

        $('#dropSearch_ThoiGianDangKy').on('select2:select', function (e) {
            me.getList_KetQuaDangKy(me.strNguoiHoc_Id);
        });

        $("#tblKetQuaDangKy").delegate('.btnChiTietDiemQuaTrinh', 'click', function (e) {
            $('#diem_qua_trinh').modal('show');
            var strTenLop = $(this).attr("title");
            var strTenLop_Id = this.id;
            $(".zoomfileLabel").html(strTenLop);
            me.getList_DiemQuaTrinh(strTenLop_Id);
        });
        $(document).ready(function () {
            const colors = ["#ffffff", "#faebd7"]; // Mảng màu
            let colorIndex = 0; // Chỉ số màu trong mảng

            $("#tblTongHopDiemHP tbody tr").each(function () {
                const td = $(this).find("td[rowspan]");
                if (td.length > 0) {
                    const rowspan = parseInt(td.attr("rowspan")) || 1; // Lấy số rowspan
                    const bgColor = colors[colorIndex % colors.length]; // Chọn màu

                    // Đặt màu cho chính thẻ <tr>
                    $(this).css("background-color", bgColor);

                    // Đặt màu cho các hàng tiếp theo
                    let nextRow = $(this).next();
                    for (let i = 1; i < rowspan; i++) {
                        nextRow.css("background-color", bgColor);
                        nextRow = nextRow.next(); // Chuyển sang hàng tiếp theo
                    }

                    colorIndex++; // Chuyển sang màu tiếp theo trong mảng
                }
            });
        });
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/
    getList_KetQuaHocTap: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/CiQ1EDQgCS4iFSAxAiAPKSAv',
            'func': 'pkg_congthongtin_hssv_thongtin.KetQuaHocTapCaNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKetQua = dtResult;
                    var arrThanhPhan = [];
                    me.dtKetQua.rsDiemThanhPhan.forEach(element => {
                        if (arrThanhPhan.indexOf(element.DIEM_THANHPHANDIEM_TEN) === -1) arrThanhPhan.push(element.DIEM_THANHPHANDIEM_TEN);
                    });
                    //var arrThanhPhan = [];
                    //me.dtKetQua.rsDiemThanhPhan.forEach(element => {
                    //    if (arrThanhPhan.indexOf(element.DIEM_THANHPHANDIEM_TEN) === -1) arrThanhPhan.push(element.DIEM_THANHPHANDIEM_TEN);
                    //});
                    me.dtKetQua["arrThanhPhan"] = arrThanhPhan;
                    console.log(me.dtKetQua.arrThanhPhan)
                    me.genHtml_ThongTinCaNhan();
                    me.genHtml_DiemMoi();
                    me.genHtml_TongDiem();
                    me.genHtml_BangDiem();
                    me.genHtml_HocPhanChuaQua();
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genHtml_ThongTinCaNhan: function () {
        var me = this;
        var jsonSV = me.dtKetQua.rsThongTinNguoiHoc[0];
        $(".lblHoTen").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_TEN));
        console.log(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_TEN));
        $("#lblMaSo").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_MASO));
        $("#lblNgaySinh").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_NGAYSINH));
        $("#lblGioiTinh").html(edu.util.returnEmpty(jsonSV.QLSV_NGUOIHOC_GIOITINH));
        $("#lblTrangThai").html(edu.util.returnEmpty(jsonSV.QLSV_TRANGTHAINGUOIHOC_TEN));
        $("#lblLop").html(edu.util.returnEmpty(jsonSV.DAOTAO_LOPQUANLY_TEN));
    },
    genHtml_DiemMoi: function () {
        var me = this;
        var htmlDiemMoi = '';
        me.dtKetQua.rsDiemMoiNhat.forEach(element => {
            var classBG = "";
            if (element.DIEM === 0) classBG = "color-red";
            if (element.DIEM >= 3) classBG = "color-orange";
            if (element.DIEM >= 5) classBG = "";
            if (element.DIEM >= 7) classBG = "color-blue";
            if (element.DIEM >= 8.5) classBG = "color-green";
            htmlDiemMoi += '<li id="' + element.ID + '"  class="chitietdiem"><span class="subject">' + edu.util.returnEmpty(element.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(element.DAOTAO_HOCPHAN_MA) + '</span><span class="' + classBG + '"><b>' + edu.util.returnEmpty(element.DIEM) + '</b></span></li>';
        });
        $("#zoneDiemMoi").html(htmlDiemMoi);
    },
    popover_DiemHoc: function (strId, point) {
        var me = this;
        var data = me.dtKetQua.rsDiemMoiNhat.find(element => element.ID === strId);
        var row = "";
        row += '<div class="pcard" style="width: 330px; float: left; padding-left: 0px; margin-top: -7px; font-size: 18px"></td>';
        row += '<table  class="table">';
        row += '<thead>';
        row += '<tr>';
        row += '<th class="td-center td-fixed">Stt</th>';
        row += '<th class="td-center">Lần học</th>';
        row += '<th class="td-center">Lần thi</th>';
        row += '<th class="td-center">Điểm</th>';
        row += '</tr>';
        row += '</thead>';
        row += '<tbody>';
        row += '<tr>';
        row += '<td class="td-center">1</td>';
        row += '<td class="td-center">' + edu.util.returnEmpty(data.LANHOC) + '</td>';
        row += '<td class="td-center">' + edu.util.returnEmpty(data.LANTHI) + '</td>';
        row += '<td class="td-center">' + edu.util.returnEmpty(data.DIEM) + '</td>';
        row += '</tr>';
        row += '</tbody>';
        row += '</table>';
        row += '</div>';
        $(point).popover({
            container: 'body',
            content: row,
            trigger: 'hover',
            html: true,
            placement: 'top',
        });
        $(point).popover('show');
    },
    /*------------------------------------------
    --Discription: Hộp "Tổng điểm" — chọn phạm vi Toàn khóa / Năm học / Học kỳ
    --Nguồn: rsDiemTrungBinhChung, trường PHAMVITONGHOPDIEM_TEN = TOANKHOA | NAMHOC | HOCKY (NHIEUKY: không dùng)
    --  Toàn khóa: DAOTAO_THOIGIANDAOTAO_ID === null (điều kiện cũ, giữ nguyên)
    --  Năm học  : khóa theo NAMHOC
    --  Học kỳ   : khóa theo NAMHOC + DAOTAO_THOIGIANDAOTAO_KY, DOTHOC === null (giống khối tổng kết từng kỳ)
    -------------------------------------------*/
    genHtml_TongDiem: function () {
        var me = this;
        var arr = me.dtKetQua.rsDiemTrungBinhChung || [];
        var $pv = $("#selTongDiem_PhamVi");
        $pv.empty().append($('<option>').val("TOANKHOA").text("Toàn khóa"));
        if (arr.some(function (e) { return e.PHAMVITONGHOPDIEM_TEN == 'NAMHOC'; })) $pv.append($('<option>').val("NAMHOC").text("Năm học"));
        if (arr.some(function (e) { return e.PHAMVITONGHOPDIEM_TEN == 'HOCKY' && e.DOTHOC === null; })) $pv.append($('<option>').val("HOCKY").text("Học kỳ"));
        $pv.val("TOANKHOA"); // nạp lại dữ liệu (đổi chương trình/sinh viên) thì về Toàn khóa
        me.genCombo_TongDiemKy();
        me.render_TongDiem();
    },
    key_TongDiem: function (e, strPhamVi) {
        return strPhamVi == 'HOCKY' ? String(e.NAMHOC) + '|' + e.DAOTAO_THOIGIANDAOTAO_KY : String(e.NAMHOC);
    },
    genCombo_TongDiemKy: function () {
        var me = this;
        var strPhamVi = $("#selTongDiem_PhamVi").val();
        var $ky = $("#selTongDiem_Ky");
        $ky.empty();
        if (strPhamVi != 'NAMHOC' && strPhamVi != 'HOCKY') { $ky.hide(); return; }
        var arrDaCo = {}, ds = [];
        (me.dtKetQua.rsDiemTrungBinhChung || []).forEach(function (e) {
            if (e.PHAMVITONGHOPDIEM_TEN != strPhamVi) return;
            if (strPhamVi == 'HOCKY' && e.DOTHOC !== null) return;
            var strKey = me.key_TongDiem(e, strPhamVi);
            if (arrDaCo[strKey]) return;
            arrDaCo[strKey] = true;
            ds.push({
                key: strKey,
                nam: String(e.NAMHOC),
                ky: Number(e.DAOTAO_THOIGIANDAOTAO_KY) || 0,
                label: strPhamVi == 'NAMHOC' ? 'Năm học ' + e.NAMHOC : 'Năm học ' + e.NAMHOC + ' - Học kỳ ' + e.DAOTAO_THOIGIANDAOTAO_KY
            });
        });
        ds.sort(function (a, b) { return b.nam.localeCompare(a.nam) || (b.ky - a.ky); }); // mới nhất lên đầu, giống thứ tự các bảng điểm
        ds.forEach(function (d) { $ky.append($('<option>').val(d.key).text(d.label)); });
        $ky.val(ds.length ? ds[0].key : '').show();
    },
    find_TongDiem: function (strLoai, strThang, strPhamVi) {
        var me = this;
        if (!strPhamVi) strPhamVi = $("#selTongDiem_PhamVi").val() || 'TOANKHOA';
        var strKey = $("#selTongDiem_Ky").val();
        return (me.dtKetQua.rsDiemTrungBinhChung || []).find(function (e) {
            if (e.LOAIDIEMTRUNGBINH_MA !== strLoai || e.THUOCTINHLANTINH !== 0 || e.THANGDIEM_MA !== strThang) return false;
            if (strPhamVi == 'NAMHOC' || strPhamVi == 'HOCKY') {
                if (e.PHAMVITONGHOPDIEM_TEN != strPhamVi) return false;
                if (strPhamVi == 'HOCKY' && e.DOTHOC !== null) return false;
                return me.key_TongDiem(e, strPhamVi) === strKey;
            }
            return e.DAOTAO_THOIGIANDAOTAO_ID === null; // Toàn khóa: điều kiện cũ
        });
    },
    render_TongDiem: function () {
        var me = this;
        var set = function (strId, objRow, strField) {
            $("#" + strId).html(objRow !== undefined ? edu.util.returnEmpty(objRow[strField]) : "...");
        };
        var chung10 = me.find_TongDiem('TRUNGBINHCHUNG', '10');
        var tichLuy10 = me.find_TongDiem('TRUNGBINHTICHLUY', '10');
        // Tổng số tín chỉ chương trình là hằng số của chương trình, không đổi theo phạm vi → luôn lấy từ bản ghi toàn khóa
        set("lblTongTinChiCTDT", me.find_TongDiem('TRUNGBINHCHUNG', '10', 'TOANKHOA'), 'TONGSOTINCHICTDT');
        set("lblTongTinChi", chung10, 'TONGSOTINCHI');
        set("lblTrungBinh10", chung10, 'DIEMTRUNGBINH');
        set("lblTrungBinh4", me.find_TongDiem('TRUNGBINHCHUNG', '4'), 'DIEMTRUNGBINH');
        set("lblTichLuy", tichLuy10, 'TONGSOTINCHI');
        set("lblTichLuy10", tichLuy10, 'DIEMTRUNGBINH');
        set("lblTichLuy4", me.find_TongDiem('TRUNGBINHTICHLUY', '4'), 'DIEMTRUNGBINH');
    },
    genHtml_BangDiem: function () {
        var me = this;
        var data = me.dtKetQua.rsDiemKetThucHocPhan;

        var arrHocKy = [];
        data.forEach(element => {
            var strHocKy = element.NAMHOC + "_" + element.HOCKY;
            if (arrHocKy.indexOf(strHocKy) === -1) arrHocKy.push(strHocKy);
        });

        var htmlBangDiem = "";
        var check = true;
        arrHocKy.forEach(element => {
            var strNamHoc = element.substring(0, element.lastIndexOf('_'));
            var strHocKy = element.substring(element.lastIndexOf('_') + 1);
            var jsonDiem = data.filter(element => element.NAMHOC === strNamHoc && element.HOCKY == strHocKy);

            htmlBangDiem += '<div class="accordion-item">';
            htmlBangDiem += '<div class="accordion-header">';
            htmlBangDiem += '<a class="header banghocphan" href="#hocky_' + element + '" data-bs-toggle="collapse" >';
            htmlBangDiem += '<i class="fal fa-chevron-circle-right"></i>';
            htmlBangDiem += '<span>Năm học ' + strNamHoc + ' - Học kỳ ' + strHocKy + '</span>';
            htmlBangDiem += '</a>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div id="hocky_' + element + '" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">';
            htmlBangDiem += '<div class="accordion-body">';
            htmlBangDiem += '<table class="table transcrip-table">';
            htmlBangDiem += '<thead>';
            htmlBangDiem += '<tr>';
            htmlBangDiem += '<th class="text-center" scope="col">STT</th>';
            htmlBangDiem += '<th scope="col">Mã học phần</th>';
            htmlBangDiem += '<th scope="col">Tên học phần</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Số tín chỉ</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Lần học</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Lần thi</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Điểm hệ 10</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Điểm hệ 4</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Điểm chữ</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Đánh giá</th>';
            htmlBangDiem += '<th class="text-center" scope="col">Ghi chú</th>';
            htmlBangDiem += '<th scope="col">Chi tiết</th>';
            htmlBangDiem += '</tr>';
            htmlBangDiem += '</thead>';
            htmlBangDiem += '<tbody>';

            jsonDiem.forEach((e, nRow) => {
                htmlBangDiem += '<tr>';
                htmlBangDiem += '<th class="text-center" scope="row"><em class="show-in-mobi">STT</em><span>' + (nRow + 1) + '</span></th>';
                htmlBangDiem += '<td><em class="show-in-mobi">Mã học phần:</em><span>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_MA) + '</span></td>';
                htmlBangDiem += '<td><em class="show-in-mobi">Tên học phần:</em><span>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_TEN) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Số tín chỉ:</em><span>' + edu.util.returnEmpty(e.DAOTAO_HOCPHAN_HOCTRINH) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Lần học:</em><span>' + edu.util.returnEmpty(e.LANHOC) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Lần thi:</em><span>' + edu.util.returnEmpty(e.LANTHI) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Điểm hệ 10:</em><span>' + edu.util.returnEmpty(e.DIEM) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Điểm hệ 4:</em><span>' + edu.util.returnEmpty(e.DIEMQUYDOI) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Điểm chữ:</em><span>' + edu.util.returnEmpty(e.DIEMQUYDOI_TEN) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Đánh giá:</em><span>' + edu.util.returnEmpty(e.DANHGIA_TEN) + '</span></td>';
                htmlBangDiem += '<td class="text-center"><em class="show-in-mobi">Ghi chú:</em><span>' + edu.util.returnEmpty(e.GHICHU) + '</span></td>';
                htmlBangDiem += '<td class="btnXemDiemThanhPhan" id="' + e.ID + '"><em class="show-in-mobi">Chi tiết:</em><a href="#">Chi tiết</a></td>';
                htmlBangDiem += '</tr>';
            });

            htmlBangDiem += '</tbody>';
            htmlBangDiem += '<tfoot></tfoot>';
            htmlBangDiem += '</table>';
            htmlBangDiem += '<div class="row py-4">';
            htmlBangDiem += '<div class="synthetic-line"></div>';
            htmlBangDiem += '<div class="col-12"><div style="padding: 0 20px; font-weight: 600; color: #223771; margin-bottom: 6px;">Tổng kết học kỳ</div></div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Tổng tín chỉ</span>';
            var temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            var diem = temp !== undefined ? edu.util.returnEmpty(temp.TONGSOTINCHI) : "...";
            var tempChung10 = temp; // giữ bản ghi TRUNGBINHCHUNG/10: temp bị ghi đè bởi TRUNGBINHTICHLUY ở dưới, "Điểm trung bình hệ 10" cần dùng lại bản này
            //console.log("TONGSOTINCHI");
            //console.log(temp);
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Tổng số tín chỉ tích lũy</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.TONGSOTINCHI) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình hệ 10</span>';
            diem = tempChung10 !== undefined ? edu.util.returnEmpty(tempChung10.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình hệ 4</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHCHUNG' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '4' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình tích lũy hệ 10</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '10' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '<div class="col-12 col-md-6">';
            htmlBangDiem += '<div class="summary-row">';
            htmlBangDiem += '<span class="color-66">Điểm trung bình tích lũy hệ 4</span>';
            temp = me.dtKetQua.rsDiemTrungBinhChung.find(element => element.DAOTAO_THOIGIANDAOTAO_ID !== null && element.LOAIDIEMTRUNGBINH_MA === 'TRUNGBINHTICHLUY' && element.THUOCTINHLANTINH === 0 && element.THANGDIEM_MA === '4' && element.NAMHOC === strNamHoc && element.DAOTAO_THOIGIANDAOTAO_KY == strHocKy && element.DOTHOC === null && element.PHAMVITONGHOPDIEM_TEN == 'HOCKY');
            diem = temp !== undefined ? edu.util.returnEmpty(temp.DIEMTRUNGBINH) : "...";
            htmlBangDiem += '<span>' + diem + '</span>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
            htmlBangDiem += '</div>';
        });
        $("#zone_bangdiem").html(htmlBangDiem);
        $(".banghocphan").each(function () {
            $(this).trigger("click");
        });
    },
    popover_DiemThanhPhan: function (strId, point) {
        var me = this;
        var jsonSoSanh = me.dtKetQua.rsDiemKetThucHocPhan.find(element => element.ID == strId);
        console.log(jsonSoSanh);
        var data = me.dtKetQua.rsDiemThanhPhan.filter(element => element.DAOTAO_HOCPHAN_ID === jsonSoSanh.DAOTAO_HOCPHAN_ID && element.LANHOC === jsonSoSanh.LANHOC && element.LANTHI === jsonSoSanh.LANTHI);
        if (data != undefined) {
            console.log(data);
            console.log(me.dtKetQua.arrThanhPhan);
            var arrThanhPhan = [];
            data.forEach(element => {
                if (arrThanhPhan.indexOf(element.DIEM_THANHPHANDIEM_TEN) === -1) arrThanhPhan.push(element.DIEM_THANHPHANDIEM_TEN);
            });
            me.dtKetQua.arrThanhPhan = arrThanhPhan;
            var row = "";
            row += '<div class="pcard" style="width: 330px; float: left; padding-left: 0px; margin-top: -7px; font-size: 18px"></td>';
            row += '<table  class="table">';
            row += '<thead>';
            row += '<tr>';
            row += '<th class="td-center td-fixed">Stt</th>';
            row += '<th class="td-center">Lần học</th>';
            row += '<th class="td-center">Lần thi</th>';
            for (var i = 0; i < me.dtKetQua.arrThanhPhan.length; i++) {
                row += '<th class="td-center">' + edu.util.returnEmpty(me.dtKetQua.arrThanhPhan[i]) + '</th>';
            }
            row += '</tr>';
            row += '</thead>';
            row += '<tbody>';
            var idem = 1;
            var arrcheck = [];
            data.forEach(element => {
                var strCheck = element.LANHOC + ":" + element.LANTHI;
                if (arrcheck.indexOf(strCheck) !== -1) return;
                arrcheck.push(strCheck);
                row += '<tr>';
                row += '<td class="td-center">' + idem + '</td>';
                row += '<td class="td-center">' + edu.util.returnEmpty(element.LANHOC) + '</td>';
                row += '<td class="td-center">' + edu.util.returnEmpty(element.LANTHI) + '</td>';
                for (var i = 0; i < me.dtKetQua.arrThanhPhan.length; i++) {
                    var temp = data.find(e => e.LANHOC === element.LANHOC && e.LANTHI === element.LANTHI && e.DIEM_THANHPHANDIEM_TEN === me.dtKetQua.arrThanhPhan[i]);
                    if (temp !== undefined) row += '<td class="td-center">' + edu.util.returnEmpty(temp.DIEM) + '</td>';
                }
                row += '</tr>';
                idem++;
            });

            row += '</tbody>';
            row += '</table>';
            row += '</div>';
            console.log(row);
            $(point).popover({
                container: 'body',
                content: row,
                trigger: 'hover',
                html: true,
                placement: 'left',
            });
            $(point).popover('show');
        }

    },
    view_DiemThanhPhan: function (data) {
        var me = this;
        //var jsonSoSanh = me.dtKetQua.rsDiemKetThucHocPhan.find(element => element.ID == strId);
        //console.log(jsonSoSanh);
        //var data = me.dtKetQua.rsDiemThanhPhan.filter(element => element.DAOTAO_HOCPHAN_ID === jsonSoSanh.DAOTAO_HOCPHAN_ID && element.LANHOC === jsonSoSanh.LANHOC && element.LANTHI === jsonSoSanh.LANTHI);
        if (data != undefined) {
            console.log(data);
            var arrThanhPhan = [];
            data.forEach(element => {
                if (arrThanhPhan.indexOf(element.DIEM_THANHPHANDIEM_TEN) === -1) arrThanhPhan.push(element.DIEM_THANHPHANDIEM_TEN);
            });
            me.dtKetQua.arrThanhPhan = arrThanhPhan;
            var row = "";
            //row += '<div class="pcard" style="width: 330px; float: left; padding-left: 0px; margin-top: -7px; font-size: 18px"></td>';
            row += '<table  class="table">';
            row += '<thead>';
            row += '<tr>';
            row += '<th class="td-center td-fixed">Stt</th>';
            row += '<th class="td-center">Lần học</th>';
            row += '<th class="td-center">Lần thi</th>';
            for (var i = 0; i < me.dtKetQua.arrThanhPhan.length; i++) {
                row += '<th class="td-center">' + edu.util.returnEmpty(me.dtKetQua.arrThanhPhan[i]) + '</th>';
            }
            row += '</tr>';
            row += '</thead>';
            row += '<tbody>';
            var idem = 1;
            var arrcheck = [];
            data.forEach(element => {
                var strCheck = element.LANHOC + ":" + element.LANTHI;
                if (arrcheck.indexOf(strCheck) !== -1) return;
                arrcheck.push(strCheck);
                row += '<tr>';
                row += '<td class="td-center">' + idem + '</td>';
                row += '<td class="td-center">' + edu.util.returnEmpty(element.LANHOC) + '</td>';
                row += '<td class="td-center">' + edu.util.returnEmpty(element.LANTHI) + '</td>';
                for (var i = 0; i < me.dtKetQua.arrThanhPhan.length; i++) {
                    var temp = data.find(e => e.LANHOC === element.LANHOC && e.LANTHI === element.LANTHI && e.DIEM_THANHPHANDIEM_TEN === me.dtKetQua.arrThanhPhan[i]);
                    if (temp !== undefined) row += '<td class="td-center">' + edu.util.returnEmpty(temp.DIEM) + '</td>';
                    else row += '<td class="td-center"></td>';
                }
                row += '</tr>';
                idem++;
            });

            row += '</tbody>';
            row += '</table>';
            //row += '</div>';
            console.log(row);
            $("#viewThanhPhan").html(row);
            $("#modal_ThanhPhan").modal("show");
            //$(point).popover({
            //    container: 'body',
            //    content: row,
            //    trigger: 'hover',
            //    html: true,
            //    placement: 'top',
            //});
            //$(point).popover('show');
        }

    },
    genHtml_HocPhanChuaQua: function () {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanChuaQua",
            aaData: me.dtKetQua.rsHocPhanChuaHoanThanh,
            colPos: {
                center: [0, 3, 4, 5, 6, 7, 8, 9],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                }
                , {
                    "mDataProp": "THOIGIAN"
                }
                , {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinhHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,//edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinhHoc(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinhHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_CHUONGTRINH_TEN",
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
            //me.getList_KetQuaHocTap();
            //me.getList_TichLuyTheoKhoi();
        }
    },


    getList_TichLuyTheoKhoi: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4CiQ1EDQgFSgiKQ00OBUpJC4KKS4o',
            'func': 'pkg_congthongtin_hssv_thongtin.LayKetQuaTichLuyTheoKhoi',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_TongHopDiem(dtResult.rsTongHop);
                    me.genTable_TongHopDiemHP(dtResult.rsChiTiet);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TongHopDiem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTongHopDiem",

            aaData: data,
            colPos: {
                center: [0, 3, 4, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "MAKHOI"
                },
                {
                    "mDataProp": "TENKHOI"
                },
                {
                    "mDataProp": "TONGSOTINCHICUAKHOI"
                },
                {
                    "mDataProp": "SOBATBUOC"
                },
                {
                    "mDataProp": "SODATICHLUY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable("tblTongHopDiem", [5, 3, 4])
    },
    genTable_TongHopDiemHP: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTongHopDiemHP",

            aaData: data,
            colPos: {
                center: [0, 1, 3, 6, 7, 8, 9, 10, 11],
            },
            bHiddenOrder: true,
            aoColumns: [
                {
                    "mDataProp": "MAKHOI"
                },
                {
                    "mDataProp": "TENKHOI",
                },
                {
                    "mRender": function (nRow, aData) {
                        return (nRow + 1);
                    }
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMQUYDOI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.KETQUA == 1 ? "Hoàn thành" : "";
                    }
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        return aData.HOCPHANTHUA == 1 ? "Thừa " + edu.util.returnEmpty(aData.HOCPHANTHUA_LOAIXULY) : "";
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.actionRowSpan("tblTongHopDiemHP", [1, 2]);
    },


    getList_KetQuaDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4CiQ1EDQgBSAvJgo4CS4iAiAPKSAv',
            'func': 'pkg_congthongtin_hssv_thongtin.LayKetQuaDangKyHocCaNhan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDangKy'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.genTable_KetQuaDangKy(dtResult.rsKetQuaDangKy);
                    me.genTable_LichSuDangKy(dtResult.rsLichSuDangKy);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KetQuaDangKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaDangKy",

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_MA"
                },
                {
                    "mDataProp": "DANGKY_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_HOCTRINH"
                },
                {
                    "mDataProp": "THONGTINGIANGVIEN",
                    //mRender: function (nRow, aData) {
                    //    return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO)
                    //}
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    mRender: function (nRow, aData) {
                        return '<button class="btn btn-view-detail btnChiTietDiemQuaTrinh" id="' + aData.DANGKY_LOPHOCPHAN_ID + '" title="' + aData.DANGKY_LOPHOCPHAN_TEN + '">Điểm quá trình</button>'
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.insertSumAfterTable("tblKetQuaDangKy", [3])
    },
    genTable_LichSuDangKy: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "HANHDONG"
                },
                {
                    "mDataProp": "KETQUA"
                },
                {
                    "mDataProp": "THOIGIANTHUCHIEN"
                },
                {
                    "mDataProp": "MAHOCPHAN"
                },
                {
                    "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "DSLOPHOCPHAN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_MA"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_ThoiGianDangKy: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIVKS4oBiggLw0oIikJLiIP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSThoiGianLichHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDangKy(json);
                    me.getList_KetQuaDangKy(strQLSV_NguoiHoc_Id)
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_ThoiGianDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDangKy"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },


    getList_DiemThanhPhan: function (strDiem_NguoiHoc_TongKet_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIFKCQsFSkgLykRKSAvFSkkLhUKCREP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSDiemThanhPhanTheoTKHP',
            'iM': edu.system.iM,
            'strDiem_NguoiHoc_TongKet_Id': strDiem_NguoiHoc_TongKet_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.view_DiemThanhPhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_QuaTrinhQuyetDinh: function (point) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIQBQIgDykgLwPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSQDCaNhan',
            'iM': edu.system.iM,
            'strNguoiDung_Id': me.strNguoiHoc_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuaTrinhQuyetDinh(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_QuaTrinhQuyetDinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuyetDinh",
            aaData: data,
            colPos: {
                center: [0, 2, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "SOQUYETDINH"
                },
                {
                    "mDataProp": "NGAYQUYETDINH"
                },
                {
                    "mDataProp": "NGAYHIEULUC"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "LOAIQUYETDINH_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_VanBang: function (point) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIVDx4KJDUQNCAeAi4vJg8pIC8eFwMP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSTN_KetQua_CongNhan_VB',
            'iM': edu.system.iM,
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_VanBang(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_VanBang: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblVangBangChungChi",
            aaData: data,
            colPos: {
                center: [0, 4, 5, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "SOHIEUBANG"
                },
                {
                    "mDataProp": "SOVAOSOCAPBANG"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_DiemQuaTrinh: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA1CiQ1EDQgBSgkLBA0IBUzKC8p',
            'func': 'pkg_congthongtin_hssv_thongtin.LatKetQuaDiemQuaTrinh',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_LopHocPhan_Id': strDangKy_LopHocPhan_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DiemQuaTrinh(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemQuaTrinh: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDiemQuaTrinh",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Loại điểm:</em><span>' + edu.util.returnEmpty(aData.DIEM_THANHPHANDIEM_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Kết quả:</em><span>' + edu.util.returnEmpty(aData.DIEM) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_CanhBao: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4BRIKJDUQNCAZNA04CS4iFzQP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayDSKetQuaXuLyHocVu',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CanhBao(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_CanhBao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCanhBaoHocVu",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thời gian:</em><span>' + edu.util.returnEmpty(aData.THOIGIAN_HIENTHI) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mức xử lý:</em><span>' + edu.util.returnEmpty(aData.MUCXULY_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Chương trình học:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Lớp:</em><span>' + edu.util.returnEmpty(aData.DAOTAO_LOPQUANLY_TEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ghi chú:</em><span>' + edu.util.returnEmpty(aData.GHICHU) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },

    getList_DiemRenLuyen: function (strDangKy_LopHocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4ChATJC8NNDgkLwIgDykgLwPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayKQRenLuyenCaNhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DiemRenLuyen(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_DiemRenLuyen: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDRL_ToanKhoa",
            aaData: data.rsToanKhoa,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thời gian:</em><span>' + edu.util.returnEmpty(aData.THOIGIAN_HIENTHI) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Điểm:</em><span>' + edu.util.returnEmpty(aData.DIEM) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Xếp loại:</em><span>' + edu.util.returnEmpty(aData.XEPLOAI_TEN) + '</span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<em class="show-in-mobi">Thời gian:</em><span>' + edu.util.returnEmpty(aData.THOIGIAN) + '</span>';
            }
        })
        jsonForm.strTable_Id = "tblDRL_Nam";
        jsonForm.aaData = data.rsNam;
        edu.system.loadToTable_data(jsonForm);
        jsonForm.strTable_Id = "tblDRL_Ky";
        jsonForm.aaData = data.rsKy;
        edu.system.loadToTable_data(jsonForm);
        //edu.system.actionRowSpan("tblLichHoc", [1,2,3]);
        /*III. Callback*/
    },
}