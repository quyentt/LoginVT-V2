/*----------------------------------------------
--Author: nnThuong
--Phone: 
--Date of created: 18/12/2018
----------------------------------------------*/
function TongHopCongThang() { }
TongHopCongThang.prototype = {
    dtReportTemp: [],
    dtNgay: [],
    dtNhanSu: [],
    dtDanhGia: [],
    dtXacNhan: [],
    dtMoRong:[],

    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Discription: [1] Action CoCauToChuc
        --Order: 
        -------------------------------------------*/
        $("#dropSearchTHCT_Nam").on("select2:select", function () {
            var strNam = $(this).find('option:selected').val();
            $("#dropSearchTHCT_Nam").val(strNam).trigger("change");
            $("#lblThoiGian").html($("#dropSearchTHCT_Thang").val() + "/" + strNam);
        });
        $("#dropSearchTHCT_Thang").on("select2:select", function () {
            var strThang = $(this).find('option:selected').val();
            $("#dropSearchTHCT_Thang").val(strThang).trigger("change");
            $("#lblThoiGian").html(strThang + "/" + $("#dropSearchTHCT_Nam").val());
        });
        $("#dropSearchTHCT_CoCauToChuc").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (edu.util.checkValue(strCha_Id)) {
                edu.util.objGetDataInData(strCha_Id, me.dtCCTC_Childs, "DAOTAO_COCAUTOCHUC_CHA_ID", me.genCombo_CCTC_Childs);
            }
            else {
                me.genCombo_CCTC_Childs(me.dtCCTC_Childs);
            }
        });
        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_NhanSu();
            me.getList_GhiChu();
            $(window).scrollTop(290);
        });
        $("#btnSave_ChamCong").click(function () {
            edu.system.confirm('Bạn có chắc chắn muốn lưu không?');
            $("#btnYes").click(function (e) {
                //edu.system.alert("<div id='progess_Alert'></div>");
                //edu.system.genHTML_Progress("progess_Alert", me.dtNhanSu.length * me.dtNgay.length);
                var arrobj = [];
                for (var i = 0; i < me.dtNhanSu.length; i++) {
                    for (var j = 0; j < me.dtNgay.length; j++) {
                        var strThang = $("#dropSearchTHCT_Thang option:selected").text();
                        var strNam = $("#dropSearchTHCT_Nam").val();
                        var x = me.dtNhanSu[i].ID + "_" + me.dtNgay[j].CHAMCONG_NGAY + strThang + strNam;
                        var strPhanTram = $("#txtNhanSu_" + x).val();
                        var strDanhGia = $("#selectNhanSu_" + x).val();
                        var strDanhGiaCheck = $("#txtNhanSu_" + x).attr("name");
                        var strPhanTramCheck = $("#txtNhanSu_" + x).attr("title");
                        if (edu.util.returnEmpty(strPhanTram) != edu.util.returnEmpty(strPhanTramCheck) || edu.util.returnEmpty(strDanhGia) != edu.util.returnEmpty(strDanhGiaCheck)) {
                            //me.save_ChamCong(me.dtNhanSu[i].ID, me.dtNgay[j].CHAMCONG_NGAY, strThang, strNam, me.dtNgay[j].CHAMCONG_NGAYDAYDU);
                            arrobj.push({
                                strNhanSu_Id: me.dtNhanSu[i].ID,
                                strNgay: me.dtNgay[j].CHAMCONG_NGAY,
                                strThang: strThang,
                                strNam: strNam,
                                strNgayChamCong: me.dtNgay[j].CHAMCONG_NGAYDAYDU
                            });
                        }
                    }
                }

                if (arrobj.length == 0) {
                    edu.system.alert("Không có dữ liệu cần lưu");
                } else {

                    edu.system.alert('<div id="zoneprocessChamCong"></div>');
                    edu.system.genHTML_Progress("zoneprocessChamCong", arrobj.length);
                    for (var i = 0; i < arrobj.length; i++) {
                        me.save_ChamCong(arrobj[i].strNhanSu_Id, arrobj[i].strNgay, arrobj[i].strThang, arrobj[i].strNam, arrobj[i].strNgayChamCong);
                    }
                }
            });
            
        });
        $("#btnSave_QuaTrinh").click(function () {
            edu.system.confirm('Bạn có chắc chắn muốn tự động cập nhật quá trình không?');
            $("#btnYes").click(function (e) {
                edu.system.alert("<div id='progess_Alert'></div>");
                edu.system.genHTML_Progress("progess_Alert", me.dtNhanSu.length);
                for (var i = 0; i < me.dtNhanSu.length; i++) {
                    me.save_QuaTrinh(me.dtNhanSu[i].ID);
                }
            });

        });
        $("#btnSave_XacNhan").click(function () {
            $("#modalXacNhan").modal("show");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDung");
            edu.system.alert("<div id='progess_Alert'></div>");
            edu.system.genHTML_Progress("progess_Alert", me.dtNhanSu.length);
            for (var i = 0; i < me.dtNhanSu.length; i++) {
                me.save_XacNhan(me.dtNhanSu[i].ID, strTinhTrang, strMoTa);
            }
        });
        $("#tbldataTHCT").delegate(".btnxacnhan_small", "click", function (e) {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                var strSanPham = $(this).attr("name");
                var strSanPham_Id = $(this).attr("sanpham_id");
                var strXacNhan = $(this).find("a").attr("title");
                var confirm = 'Xác nhận <i class="cl-danger">' + strXacNhan + '</i> cho cán bộ <i class="cl-danger">' + strSanPham + '</i> !';
                confirm += '<div class="clear"></div>';
                confirm += '<input id="txtMota_XacNhan_small" class="form-control" placeholder="Mô tả xác nhận"/>';
                edu.system.confirm(confirm, "q");
                $("#btnYes").click(function (e) {
                    me.save_XacNhan(strSanPham_Id, strId, edu.util.getValById("txtMota_XacNhan_small"));
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tbldataTHCT").delegate(".btnLichSu", "click", function (e) {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                $("#modalLichSuXacNhan").modal("show");
                me.getList_LichSuXacNhan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        edu.system.getList_MauImport("zonebtnBaoCao_THCC", function (addKeyValue) {
            var strCoCauToChuc = edu.util.getValById("dropSearchTHCT_BoMon");
            if (!edu.util.checkValue(strCoCauToChuc)) {
                strCoCauToChuc = edu.util.getValById("dropSearchTHCT_CoCauToChuc");
            }
            addKeyValue("strDaoTao_CoCauToChuc_Id", strCoCauToChuc);
            addKeyValue("strNam", edu.util.getValById("dropSearchTHCT_Nam"));
            addKeyValue("dThang", edu.util.getValById("dropSearchTHCT_Thang"));
        });
        //$("#tbldataTHCT").delegate('.btnxacnhan_small', 'click', function () {
        //    var classPoint = this.classList;
        //    if (classPoint.contains("btn-primary")) {
        //        classPoint.remove("btn-primary");
        //        classPoint.add("btn-default");
        //    } else {
        //        classPoint.add("btn-primary");
        //        classPoint.remove("btn-default");
        //    }
        //});
        var ilength = window.innerHeight - 150;
        $("#tbldataTHCT").parent().attr("style", "height: " + ilength + "px; overflow-y: scroll;");
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_DMXacNhan();
        //edu.system.loadToCombo_DanhMucDuLieu("NHANSU.XACNHANNGHIPHEP", "", "", me.loadBtnXacNhan, "Tất cả tình trạng duyệt", "HESO1");
        edu.system.dateMonthToCombo("dropSearchTHCT_Thang", "Chọn tháng");
        edu.system.dateYearToCombo("1993", "dropSearchTHCT_Nam", "Chọn năm");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.CONGPHEP.DANHGIA", "", "", me.genCombo_DanhMucNghiLe);

        $("#dropSearchTHCT_Nam").val(edu.util.thisYear()).trigger("change");
        //$("#dropSearchTHCT_Thang").val(edu.util.thisMonth()).trigger("change");
        $("#lblThoiGian").html(edu.util.thisMonth() + "/" + edu.util.thisYear());
        /*------------------------------------------
        --Discription: Business
        -------------------------------------------*/
        me.getList_CoCauToChuc();
    },
    /*------------------------------------------
    --Discription: [1] AcessDB TongHopChamCong
    -------------------------------------------*/

    getList_LichSuXacNhan: function (strsanpham_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ChamCong_XacNhan/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strsanpham_Id': strsanpham_Id,
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
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
                    me.genTable_LichSuXacNhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_LichSuXacNhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichSuXacNhan",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
                {
                    "mDataProp": "NGUOIXACNHAN_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_DMXacNhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_CongPhep_Chung/LayDSXacNhanTheoNguoiDung',
            'type': 'GET',
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
                    me.loadBtnXacNhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoiTao_THCT: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_KhungChamCong/KhoiTao',
            

            'dNam': edu.util.getValById("dropSearchTHCT_Nam"),
            'dThang': edu.util.getValById("dropSearchTHCT_Thang"),
            'strNguoiThucHien_Id': ""
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
                    me.dtNgay = dtResult;
                    me.genTable_Header_THCT(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_DuBao/TongHopCongThang: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NS_DuBao/TongHopCongThang (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NhanSu: function () {
        var me = this;
        

        var strCoCauToChuc = edu.util.getValById("dropSearchTHCT_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearchTHCT_CoCauToChuc");
        }
        //--Edit
        var obj_list = {
            'action': 'NS_ChamCong_CaNhan/LayDSNhanSu_ChamCong',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_CoCauToChuc_Id': strCoCauToChuc,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNam': $("#dropSearchTHCT_Nam").val(),
            'strThang': $("#dropSearchTHCT_Thang option:selected").text(),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNgay = data.Data.rsThongTinNgay;
                    me.dtNhanSu = data.Data.rsThongTinNhanSu;
                    me.dtMoRong = data.Data.rsThongTinMoRong;
                    me.genTable_Header_THCT(me.dtNgay);
                    me.genTable_Body_NhanSu_THCT(me.dtNhanSu);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            complete: function () {
                edu.system.start_Progress("process_DS", function () {
                    //main_doc.DanhSachPhep.getList_DanhSachPhep();
                });
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_Data_THCT: function (strNhanSu_HoSoCanBo_Id, strNgayChamCong, strThang, strNam, strNgay) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_ChamCong_CaNhan/LayKetQuaChamCongCaNhan',
            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
            'strNam': $("#dropSearchTHCT_Nam").val(),
            'strThang': strThang,
            'strNgayChamCong': strNgay,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = "";
                    var strPhanTram = "100";
                    if (data.Data.length > 0) {
                        strId = data.Data[0].DANHGIA_ID;
                        strPhanTram = data.Data[0].PHANTRAMHUONG;
                    }
                    var x = $("#selectNhanSu_" + strNhanSu_HoSoCanBo_Id + "_" + strNgayChamCong + strThang + strNam);
                    x.val(strId).trigger("change");
                    $("#txtNhanSu_" + strNhanSu_HoSoCanBo_Id + "_" + strNgayChamCong + strThang + strNam).val(strPhanTram + "%");
                }
                else {
                    edu.system.alert(data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                
            },
            complete: function () {
                edu.system.start_Progress("process_DS", function () {
                    //main_doc.DanhSachPhep.getList_DanhSachPhep();
                });
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_DataNhanSu_THCT: function () {
        var me = this;
        //--Edit
        var strCoCauToChuc = edu.util.getValById("dropSearchTHCT_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearchTHCT_CoCauToChuc");
        }
        var strThang = $("#dropSearchTHCT_Thang option:selected").text();
        var strNam = $("#dropSearchTHCT_Nam").val();
        var obj_list = {
            'action': 'NS_ChamCong_CaNhan/LayKetQuaChamCongDonVi',
            'strDaoTao_CoCauToChuc_Id': strCoCauToChuc,
            'strNam': strNam,
            'strThang': strThang,
            'strNgayChamCong': "",
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    for (var i = 0; i < data.Data.rs.length; i++) {
                        var json = data.Data.rs[i];
                        var strId = json.DANHGIA_ID;
                        var strPhanTram = json.PHANTRAMHUONG + "%";
                        if (strPhanTram == '100%') strPhanTram = "";
                        var x = parseInt(json.CHAMCONG_NGAYDAYDU.replace(/\//g, ''));
                        x = json.NHANSU_HOSOCANBO_ID + "_" + x;
                        $("#selectNhanSu_" + x).val(strId).trigger("change");
                        $("#txtNhanSu_" + x).val(strPhanTram);
                        $("#txtNhanSu_" + x).attr("name", strId);
                        $("#txtNhanSu_" + x).attr("title", strPhanTram);
                    }
                    for (var i = 0; i < data.Data.rsMoRong.length; i++) {
                        var json = data.Data.rsMoRong[i];
                        $("#lblMoRong_" + json.NHANSU_HOSOCANBO_ID + "_" + json.THANHPHAN_ID).html(edu.util.returnEmpty(json.THANHPHAN_GIATRI));
                    }
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            complete: function () {
                edu.system.start_Progress("process_DS", function () {
                    //main_doc.DanhSachPhep.getList_DanhSachPhep();
                });
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML TongHopCongThang
    -------------------------------------------*/
    genTable_Header_THCT: function (data, iPager) {
        var me = this;
        var html = '';
        var dtWeek = [];
        var count = 0;
        $("#tbldataTHCT thead").html(html);
        //Start: Gen
        html += '<tr>';
        html += '<th rowspan="3" class="td-center">Stt</th>';
        html += '<th rowspan="3" style="width: 200px">Đơn vị</th>';
        html += '<th rowspan="3" style="width: 200px">Họ tên</th>';
        html += '<th rowspan="3">Xác nhận</th>';
        //html += '<th rowspan="3">Tổng ngày công</th>';
        //Get tuan trong thang
        for (var w = 0; w < data.length; w++) {
            if (!edu.util.arrEqualVal(dtWeek, data[w].TUAN)) {
               dtWeek.push(data[w].TUAN);
            }
        }
        //1. ==> Gen ngay trong thang (date gen)
        for (var dag = 0; dag < data.length; dag++) {
            html += '<th class="td-center">' + edu.util.returnEmpty(data[dag].CHAMCONG_NGAY) + '</th>';
        }
        for (var i = 0; i < me.dtMoRong.length; i++) {
            html += '<th rowspan="3">' + me.dtMoRong[i].THANHPHAN_TEN + '</th>';
        }
        html += '</tr>';
        //2. ==> Gen tuan trong thang (week gen)
        html += '<tr>';
        for (var wg = 0; wg < dtWeek.length; wg++) {
            count = 0;
            for (var d = 0; d < data.length; d++) {
                if (dtWeek[wg] == data[d].TUAN) {
                    count++;
                }
            }
            html += '<th colspan=' + count + ' class="td-center">T' + dtWeek[wg] + '</th>';
        }
        html += '</tr>';
        //3. ==> Gen thu trong thang (day gen)
        html += '<tr>';
        for (var dg = 0; dg < data.length; dg++) {
            html += '<th class="td-center">' + edu.util.convertNumToDay(data[dg].THUTRONGTUAN) + '</th>';
        }
        html += '</tr>';
        //End: bind
        $("#tbldataTHCT thead").html(html);
        //Call back
    },
    genTable_Body_NhanSu_THCT: function (data, iPager) {
        var me = main_doc.TongHopCongThang;
        me.dtNhanSu = data;
        //Call back
        var strThang = "" + $("#dropSearchTHCT_Thang option:selected").text();
        var strNam = $("#dropSearchTHCT_Nam").val();
        var strSelect = $("#dropSearchTHCT_DanhGia").html();
        var html = "";
        $("#tbldataTHCT tbody").html("");
        for (var i = 0; i < me.dtNhanSu.length; i++) {
            html += '<tr>';
            html += '<td class="td-center">' + (i + 1) + '</td>';
            html += '<td>' + edu.util.returnEmpty(me.dtNhanSu[i].DAOTAO_COCAUTOCHUC_TEN) + '</td>';
            html += '<td>' + me.dtNhanSu[i].HOTEN +'<br />';
            html += '<span class="italic">' + edu.util.returnEmpty(me.dtNhanSu[i].MASO) + '</span>';
            html += '</td>';
            var rowXacNhan = '';
            var row = "";
            row += '<div style="margin-left: auto; margin-right: auto; width: ' + (me.dtXacNhan.length * 40) + 'px">';
            var lblXacNhan = "";
            for (var j = 0; j < me.dtXacNhan.length; j++) {
                var btnXacNhan = "";
                if (me.dtXacNhan[j].ID == me.dtNhanSu[i].KETQUAXACNHAN_ID) {
                    btnXacNhan = "btn-primary";
                    lblXacNhan = me.dtXacNhan[j].TEN;
                }
                row += '<div id="' + me.dtXacNhan[j].ID + '" name="' + me.dtNhanSu[i].HOTEN + '" sanpham_id="' + me.dtNhanSu[i].ID + '" class="btn-large btnxacnhan_small">';
                row += '<a class="btn ' + btnXacNhan + '" title="' + me.dtXacNhan[j].TEN + '"><i style="' + me.dtXacNhan[j].THONGTIN2 + '" class="' + me.dtXacNhan[j].THONGTIN1 + '"></i></a>';
                row += '</div>';
            }
            row += '<div>' + lblXacNhan + '</div>';
            row += '<a id="' + me.dtNhanSu[i].ID + strThang + strNam +'" class="btnLichSu" style="cursor: pointer">Lịch sử</a>';
            html += '<td>' + row + '</td>';

            for (var j = 0; j < me.dtNgay.length; j++) {
                var strNgay = "" + me.dtNgay[j].CHAMCONG_NGAY + strThang + strNam;
                html += '<td class="td-center"><select style="width: 70px" id="selectNhanSu_' + me.dtNhanSu[i].ID + '_' + strNgay + '" class="select-opt">' + strSelect + '</select> <input id="txtNhanSu_' + me.dtNhanSu[i].ID + '_' + strNgay + '" style="width: 70px" class="form-control" /></td>';
            }
            for (var j = 0; j < me.dtMoRong.length; j++) {
                html += '<td class="td-center" id="lblMoRong_' + me.dtNhanSu[i].ID + '_' + me.dtMoRong[j].THANHPHAN_ID + '"></td>';//ghichu
            }
            
            html += '</tr>';
        }
        $("#tbldataTHCT tbody").html(html);
        me.getList_DataNhanSu_THCT();
        //edu.system.genHTML_Progress("process_DS", me.dtNhanSu.length * me.dtNgay.length);
        //for (var i = 0; i < me.dtNhanSu.length; i++) {
        //    for (var j = 0; j < me.dtNgay.length; j++) {
        //        me.getList_Data_THCT(me.dtNhanSu[i].ID, me.dtNgay[j].CHAMCONG_NGAY, strThang, strNam, me.dtNgay[j].CHAMCONG_NGAYDAYDU);
        //    }
        //}
    },

    save_ChamCong: function (strNhanSu_HoSoCanBo_Id, strNgayChamCong, strThang, strNam, strNgay) {
        var me = this;
        //--Edit
        var x = $("#txtNhanSu_" + strNhanSu_HoSoCanBo_Id + "_" + strNgayChamCong + strThang + strNam).val();
        if (x == "") x = "100";
        else x = x.replace(/%/g, "");
        var obj_save = {
            'action': 'NS_ChamCong_CaNhan/ThemMoi',


            'strId': edu.util.getValById('txtAAAA'),
            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
            'strDanhGia_Id': $("#selectNhanSu_" + strNhanSu_HoSoCanBo_Id + "_" + strNgayChamCong + strThang + strNam).val(),
            'strNam': strNam,
            'strThang': strThang,
            'strTuan': edu.util.getValById('txtAAAA'),
            'strQuyDinh_Id': edu.util.getValById('dropAAAA'),
            'strNgayChamCong': strNgay,
            'dPhanTramHuong': x,
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'NS_ChamCong_CaNhan/CapNhat';
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId != "") {
                        edu.system.alert("Cập nhật thành công!");
                    } else {

                        edu.system.alert("Thêm mới thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessChamCong", function () {
                    me.getList_NhanSu();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_QuaTrinh: function (strNhanSu_HoSoCanBo_Id) {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearchTHCT_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearchTHCT_CoCauToChuc");
        }
        var strThang = $("#dropSearchTHCT_Thang option:selected").text();
        var strNam = $("#dropSearchTHCT_Nam").val();
        //--Edit
        var obj_save = {
            'action': 'NS_NghiPhepCaNhan/TuDong_CapNhat_QuaTrinh_CaNhan',


            'strDaoTao_CoCauToChuc_Id': strCoCauToChuc,
            'strNhanSu_HoSoNhanSu_Id': strNhanSu_HoSoCanBo_Id,
            'strNamApDung': strNam,
            'strThangApDung': strThang,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId != "") {
                        edu.system.alert("Cập nhật thành công!");
                    } else {

                        edu.system.alert("Thêm mới thành công!");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("progess_Alert", function () {
                    main_doc.TongHopCongThang.getList_NhanSu();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_XacNhan: function (strNhanSu_HoSoCanBo_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var strCoCauToChuc = edu.util.getValById("dropSearchTHCT_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearchTHCT_CoCauToChuc");
        }
        var strThang = $("#dropSearchTHCT_Thang option:selected").text();
        var strNam = $("#dropSearchTHCT_Nam").val();
        var obj_save = {
            'action': 'NS_ChamCong_XacNhan/XacNhanTatCa_NhanSu_ChamCong',
            'strId': "",
            'strDaoTao_CoCauToChuc_Id': strCoCauToChuc,
            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
            'strNam': strNam,
            'strThang': strThang,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNoiDung': strNoiDung,
            'strNguoiXacnhan_Id': edu.system.userId,
        };
        $("#modalXacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                    var x = $("#tbldataTHCT").find(".btnxacnhan_small[sanpham_id='" + strNhanSu_HoSoCanBo_Id + "']");
                    for (var i = 0; i < x.length; i++) {
                        var classPoint = x[i].classList;
                        if (x[i].id == strTinhTrang_Id) classPoint.add("btn-primary");
                        else {
                            classPoint.remove("btn-primary");
                        }
                    }
                } else {
                    edu.system.alert("Duyệt hồ sơ thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("progess_Alert", function () {
                    main_doc.TongHopCongThang.getList_NhanSu();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] AcessDB CoCauToChuc
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = this;
        //var obj = {
        //    strCCTC_Loai_Id: "",
        //    strCCTC_Cha_Id: "",
        //    iTrangThai: 1
        //};
        //edu.system.getList_CoCauToChuc(obj, "", "", me.processData_CoCauToChuc);
        var obj_list = {
            'action': 'NS_CongPhep_Chung/LayDSDonViTheoNguoiDung',
            'type': 'GET',
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
                    me.genCombo_CCTC_Childs(dtResult, iPager);
                }
                else {
                    edu.system.alert("NS_DuBao/TongHopCongThang: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("NS_DuBao/TongHopCongThang (er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML CoCauToChuc
    --ULR:  Modules
    -------------------------------------------*/
    processData_CoCauToChuc: function (data) {
        var me = main_doc.TongHopCongThang;
        var dtParents = [];
        var dtChilds = [];
        for (var i = 0; i < data.length; i++) {
            if (edu.util.checkValue(data[i].DAOTAO_COCAUTOCHUC_CHA_ID)) {
                //Convert data ==> to get only parents
                dtChilds.push(data[i]);
            }
            else {
                //Convert data ==> to get only childs
                dtParents.push(data[i]);
            }
        }

        me.dtCCTC_Parents = dtParents;
        me.dtCCTC_Childs = dtChilds;
        me.genCombo_CCTC_Parents(dtParents);
        me.genCombo_CCTC_Childs(dtChilds);
    },
    genCombo_CCTC_Parents: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchTHCT_CoCauToChuc"],
            type: "",
            title: "Chọn cơ cấu khoa/viện/phòng ban"
        };
        edu.system.loadToCombo_data(obj);
    },
    genCombo_CCTC_Childs: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchTHCT_BoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [Last] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    cbGenLink_InHoSo: function (data) {
        var me = main_doc.TongHopCongThang;
        me.dtReportTemp = data;
        var html_link = '';
        var strId = '';
        var strTen = '';
        for (var i = 0; i < data.length; i++) {
            strId = data[i].ID;
            strTen = edu.util.returnEmpty(data[i].TEN);
            html_link += '<li><a id="print_hoso_' + strId + '" class="poiter btnPrint_InHoSo" title="' + strTen + '">' + (i + 1) + ". " + strTen + '</a></li>';
        }
        $("#zoneReport_THCT").html(html_link);
    },
    genCombo_DanhMucNghiLe: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearchTHCT_DanhGia"],
            title: "Chọn"
        };
        edu.system.loadToCombo_data(obj);
    },
    loadBtnXacNhan: function (data) {
        main_doc.TongHopCongThang.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    /*------------------------------------------
    --Discription: [Last] In Ho So
    --ULR:  Modules
    -------------------------------------------*/
    getList_GhiChu: function () {
        var me = this;


        var strCoCauToChuc = edu.util.getValById("dropSearchTHCT_BoMon");
        if (!edu.util.checkValue(strCoCauToChuc)) {
            strCoCauToChuc = edu.util.getValById("dropSearchTHCT_CoCauToChuc");
        }
        //--Edit
        var obj_list = {
            'action': 'NS_ChamCong_CaNhan/LayDSHoatDongChamCong',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_CoCauToChuc_Id': strCoCauToChuc,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNam': $("#dropSearchTHCT_Nam").val(),
            'strThang': $("#dropSearchTHCT_Thang option:selected").text(),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var row = "";
                    for (var i = 0; i < data.Data.rsHoatDong.length; i++) {
                        var json = data.Data.rsHoatDong[i];
                        row += '<div class="col-sm-2"><div style="width: 30px; float: left">' + json.MA + '</div>: ' + json.TEN + '</div>';
                    }
                    $("#zoneKyHieu").html(row);
                    var row = "";
                    for (var i = 0; i < data.Data.rsQuyDinhTongHopCong.length; i++) {
                        var json = data.Data.rsQuyDinhTongHopCong[i];
                        row += '<div><div style="float: left"><b>' + json.TEN + '</b></div>: ' + json.MOTA + '</div><div class="clear"></div>';
                    }
                    $("#zoneHuongDan").html(row);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");

            },
            complete: function () {
                edu.system.start_Progress("process_DS", function () {
                    //main_doc.DanhSachPhep.getList_DanhSachPhep();
                });
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
};