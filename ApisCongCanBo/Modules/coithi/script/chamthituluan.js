function chamthituluan() { };
chamthituluan.prototype = { 
    dtPhongThi: [],
    dtChiTietPhongThi: [], 
    dataExamPart: [], 
    dtHocPhan: [],
    strStudentExamRoomId: '',
    strThiSinhId: '',

    strExamStructId: '',
    strExamRoomInfoId: '',
    strMatKhauChoPhongThi: '',
    strDepartOrganId: '',
    strWritenExamId: '',
    strKieuTaoDe: '',
    strDeThiThuCongId: '',
    strStudentExamRoomIds: '',
    strTongThoiGianCauTrucDe:'',
    rootPathReport:'https://qldtbeta.phenikaa-uni.edu.vn/ttn.Apis.Report.QuanLyThiTracNghiem/Modules/Common/Baocao.aspx',
    init: function () {
        var me = this;     
        me.page_load();
        
        
        $("#btn_Refresh").click(function () {
            me.getList_ChiTietPhongThi('1');
        });
        $("[id$=chkSelectAll_ChiTietPhongThi]").on("click", function () {
            me.checkedCol_BgRow("tblChiTietPhongThi");
        });
        $("[id$=chkSelectAll_PhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi" });
        });
        
        $(document).delegate('#btnIn_DeThiCuaThiSinh', 'click', function (e) {

            
            e.stopImmediatePropagation();
            alert(222);
            me.printPhieu();

            //$(".zone-bus").hide();
            //edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThu.changeWidthPrint);
        });
        $("#btnAdd_CongNhanDiem").click(function () {

            if (edu.util.getValById('drpExamstructPart') == "") {
                edu.system.alert("Bạn chưa chọn phần thi");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < me.dtChiTietPhongThi.length; i++) {
                    //nếu cấu trúc có tổng thời gian thì lấy theo STUDENTEXAMROOM và ngược lại lấy theo STUDENTEXAMROOMPART
                    var strStudentExamRoomPartId = me.dtChiTietPhongThi[i].STUDENTEXAMROOMPARTID;
                    if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) != '')
                        strStudentExamRoomPartId = me.dtChiTietPhongThi[i].ID;

                    var strMark = edu.util.getValById("txtDiemDuocCongNhan" + strStudentExamRoomPartId);
                    var strGhiChu = edu.util.getValById("txtGhiChu" + strStudentExamRoomPartId);
                    if (edu.util.returnEmpty(me.dtChiTietPhongThi[i].MARK) != strMark)
                        me.save_CongNhanDiem(strStudentExamRoomPartId, strMark, strGhiChu);
                }
                setTimeout(function () {
                    me.getList_ChiTietPhongThi('1');
                   // me.Update_PhongThi_MucPheDuyet(me.strExamRoomInfoId, 'GVCOITHICONGNHAN');
                }, 2000);
            });

        }); 
        $("#tblChiTietPhongThi").delegate('.btnChiTietBaiThi', 'click', function (e) {
            
            var strId = this.id;            
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "STUDENTEXAMROOMID");
            alert("Kiem tra muc phe duye");
            me.strThiSinhId = dt[0].USERID;
            me.strStudentExamRoomId = strId;
            me.toggle_edit_zoneKetQuaThi();
            me.gen_KetQuaThi(); 

            //$(".zone-bus").hide();
            //edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThu.changeWidthPrint);
        });
      
        $("#btnTaiFile").click(function () {
            var selectedValue = $("#drpBaoCao").find('option:selected').val();
            me.report($("#drpBaoCao").val());
        });
        $('#drpExamstructPart').on('select2:select', function () {
              
            me.getList_ChiTietPhongThi("1");
        });
 
        $("#btnThucHienTacVu").click(function () {
            if (edu.util.getValById("drpTacVu") == "") {
                edu.system.alert("Bạn chưa chọn tác vụ cần thực hiện");
                return;
            } 
            if (edu.util.getValById("drpTacVu") == "MOPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần mở?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn mở phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    var strExamRoomInfoIds = "";
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        strExamRoomInfoIds += arrChecked_Id[i] + ",";
                    }
                    strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1);
                    me.ThaoTacPhongThi_PhongThi_GST(strExamRoomInfoIds, "MOPHONGTHI");
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
            if (edu.util.getValById("drpTacVu") == "DONGPHONGTHI") {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblPhongThi", "checkX");
                if (arrChecked_Id.length == 0) {
                    edu.system.alert("Vui lòng chọn phòng thi cần đóng?");
                    return;
                }
                edu.system.confirm("Bạn có chắc chắn đóng phòng thi?");
                $("#btnYes").click(function (e) {
                    $('#myModalAlert #alert_content').html('');
                    var strExamRoomInfoIds = "";
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        strExamRoomInfoIds += arrChecked_Id[i] + ",";
                    }
                    strExamRoomInfoIds = strExamRoomInfoIds.substr(0, strExamRoomInfoIds.length - 1); 
                    me.ThaoTacPhongThi_PhongThi_GST(strExamRoomInfoIds, "DONGPHONGTHI"); 
                });
                setTimeout(function () {
                    me.getList_PhongThi();
                }, 2000);
            }
             

        });
        $(".btnSearch_PhongThi").click(function () {
            me.getList_PhongThi();
        });
        $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;
            $('#tblChiTietPhongThi tbody').html('');
            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;
            me.strTongThoiGianCauTrucDe = edu.util.returnEmpty(edu.util.returnEmpty(dt[0].TONGTHOIGIAN));
            me.toggle_edit_chitiet();
          
            me.genThongTinDeThiDaTao();
            setTimeout(function () {
                me.getList_KieuLamBai();
               
            }, 1000);

        });
        $("#btnIn_DeThiCuaThiSinh").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
       
        $("#btn_Refresh").click(function () {
            me.getList_ChiTietPhongThi('1');
        });
       
          
        $("#tblChiTietPhongThi").delegate(".XemDiaChiIP", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.rewrite_DiaChiIP_ThiSinh();
            me.toggle_edit_DiaChiIP_ThiSinh();
            me.viewEdit_DiaChiIP_ThiSinh(dt[0]);
            me.getList_DiaChiIP_ThiSinh(strId);
           

        });
        
        
         
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_drpDonVi();  
        me.getList_drpDotThi(); 
       
     
    },
    getList_drpDonVi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_DonViByUserId_GST',
            'strUserId': edu.system.userId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDonVi(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpDonVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
   
    getList_drpDotThi: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DotThi',
            'strStatus': '1',

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_drpDotThi(data.Data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_drpDotThi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpDotThi"],
            type: "",
            title: "Chọn đợt thi"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    getList_PhongThi: function () {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_PhongThi_ChamThi',//'QLTTN_QuanLyThi/LayDS_ThongTinPhongThi_GST'
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi'),
            'strDotThi_Id': edu.util.getValById('drpDotThi'),
            'strTrangThaiPhongThi': '0',
            'strStatus': '1',
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };
         
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtPhongThi = data.Data;
                    me.genTable_PhongThi(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_PhongThi: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.chamthituluan.getList_PhongThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "ROOMNAME"
                },
                {
                    "mDataProp": "COURSENAME"
                },
                {
                    "mDataProp": "EXAMDATE"
                },
                {
                    "mDataProp": "GIOTHI"
                },
                {
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.OPENSTATUS == "0" ? "Đóng" : "Mở";
                    }
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    toggle_edit_chitiet: function () {
        var me = this;
        //edu.util.toggle_overide("zone-bus", "zoneChiTiet");
        $("#modalDanhSachThiSinh").modal('show');
    },
    getList_ChiTietPhongThi: function (strCoTinhLaiDiem) {
        var me = this;
        
        var dt = edu.util.objGetDataInData(me.strExamRoomInfoId, me.dtPhongThi, "ID");
        edu.util.viewHTMLById("lblDonVi_ChiTiet", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_ChiTiet", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_ChiTiet", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_ChiTiet", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_ChiTiet", dt[0].EXAMDATE);


        edu.util.viewHTMLById("lblDonVi_TaoDeThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeThi", dt[0].EXAMDATE);

        edu.util.viewHTMLById("lblDonVi_TaoDeTuDeThiThuCong", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TaoDeTuDeThiThuCong", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TaoDeTuDeThiThuCong", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TaoDeTuDeThiThuCong", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TaoDeTuDeThiThuCong", dt[0].EXAMDATE);



        edu.util.viewHTMLById("lblDonVi_TinhHuongThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TinhHuongThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TinhHuongThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TinhHuongThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TinhHuongThi", dt[0].EXAMDATE); 

        me.strMatKhauChoPhongThi = dt[0].MATKHAUCHOPHONGTHI;


        //--Edit
        //var obj_list = {
        //    'action': 'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua',
        //    'versionAPI': 'v1.0',
        //    'strTuKhoa': "",
        //    'strExamRoomInfoId': me.strExamRoomInfoId,
        //    'strNguoiTao_Id': edu.system.userId,
        //    'strCoTinhLaiDiem': strCoTinhLaiDiem,
        //    'strExamStructPartId': edu.util.getValById('drpExamstructPart'),
        //    'PageNumber': 1,//edu.system.pageIndex_default,
        //    'ItemPerPage':100000000// edu.system.pageSize_default,
        //};

        
        dt = edu.util.objGetDataInData($('#drpExamstructPart').find('option:selected').val(), me.dataExamPart, "ID");
        var strKieuLamBaiThi = "";
        if (dt.length > 0)
            strKieuLamBaiThi = dt[0].KIEULAMBAITHI;
        
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_CTPhongThi_Part_TuLuan',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strKieuLamBaiThi': strKieuLamBaiThi,
            'strExamStructPartId': $('#drpExamstructPart').find('option:selected').val(),
            'NguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 100000000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.dtChiTietPhongThi = data.Data.ChiTietPhongThi;

                    me.dtStudentFiles = data.Data.StudentFiles;
                    me.genTable_ChiTietPhongThi("1", me.dtChiTietPhongThi, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChiTietPhongThi: function (strCoTinhLaiDiem, data, iPager) {
        var me = this;
        var iSoThiSinhDuThi = 0;
        var iSoThiSinhKhongDat = 0;
        var iSoThiSinhDat = 0;
        var ranChar = me.randomString(3, "");


        $("#tblChiTietPhongThi tbody").html("");
        $("#tblChiTietPhongThi tfoot").html('<tr role="row" style="text-align:center; font-weight: bold; color:#007acc"><td style="text-align:center; font-weight: bold;" colspan="6">Tổng số: ' + iSoThiSinhDuThi + '</td><td style="text-align:center; font-weight: bold;" colspan="3">Số Đạt: ' + iSoThiSinhDat + '</td><td style="text-align:center; font-weight: bold;" colspan="4">Số Không Đạt: ' + iSoThiSinhKhongDat + '</td></tr>');

        var jsonForm = {
            strTable_Id: "tblChiTietPhongThi",
            aaData: data,
            sort: true,
            //bPaginate: {
            //    strFuntionName: "main_doc.chamthituluan.getList_ChiTietPhongThi('" + strCoTinhLaiDiem + "')",
            //    iDataRow: iPager,
            //    bInfo: false,
            //    bLeft: false
            //},
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
                right: [6]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                         
                        var html = '<span><img src="' + edu.system.rootPath + '/assets/images/avata-user.png" class= "avatar-sbd"" id="sl_hinhanh' + aData.STUDENTCODE + '" /></span>';
                        return '<a>' + html + '</br>' + aData.STUDENTCODE + '</a>';
                    }


                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = '<span>'+ aData.FULLNAME + '</span>';
                        if (aData.COTRONGLICHTHI == "0")
                            strReturn = '<span><span style="color:red">' + aData.FULLNAME + '</span></span>';
                        if (aData.GIANLAN == '1')
                            strReturn += "</br> <p class='cssGianLan XemDiaChiIP' id='" + aData.ID + "'>Gian lận</p>";
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "BIRTHDATE_USER"
                },
                {
                    "mDataProp": "SOBAODANHIMPORT"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = '';
                          
                        var strTextMarkId    = aData.ID;
                        strHTML = '<input type ="email" id="txtDiemDuocCongNhan' + strTextMarkId + '" value ="' + edu.util.returnEmpty(aData.MARKTULUAN) + '" class="form-control" placeholder="" style="width: 100px; height: 30px;"/>';
                             
                         
                        strHTML = '<div class="input-group no-icon">' + strHTML+ ' </div>';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        var idTimer = "timer" + aData.ID.toString() + ranChar;
                        var timeMinute = aData.TIMERCOUNTDOWN;

                        if (parseFloat(aData.THOIGIANCONLAI) > 0) {
                            if (timeMinute != "" && timeMinute != null && timeMinute != "0") {
                                if (parseInt(timeMinute) > 0 && aData.FINISHED == "0")
                                    strHTML += "<span style='text-align:center' id='" + idTimer + "'></span>";

                                else
                                    strHTML += "<span style='text-align:center'>--:--</span>";
                            }
                        }
                        else if (parseInt(timeMinute) <= 0)
                            strHTML = "<span style='color: Violet' >Kết thúc</span>";
                        if (aData.TIMESTARTDOEXAM_TEXT == null || aData.TIMESTARTDOEXAM_TEXT == '')
                            strHTML = "<span style='color: Green' >Chưa thi</span>";
                        if (aData.FINISHED == "1")
                            strHTML = "<span style='color: red' >Thi xong</span>";

                        if (aData.FINISHED != "1" && aData.STATUS == "TAMDUNGTHI")
                            strHTML = "<span style='color: red' >Tạm dừng thi</span>";


                        if (timeMinute != "" && timeMinute != null && timeMinute != "0" && parseInt(timeMinute) > 0 && aData.FINISHED == "0") {
                            $("#" + idTimer).html("");
                            me.countdown(aData.TIMERSHOW, idTimer);
                        }
                        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) == '')
                            if (edu.util.getValById("drpExamstructPart") == "")
                                strHTML = "";
                        return strHTML;
                    }
                },
                {
                    "mDataProp": "TIMEHHMISSSTARTDOEXAM"
                },
                {
                    "mDataProp": "DIACHIIPMAYDADANGNHAP"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = '<div class="input-group no-icon">';
                        console.log(aData.STUDENTEXAMROOMPARTID);
                        if (edu.util.returnEmpty(aData.TENVIPHAMQUYCHETHI) != "")
                            strHTML = "<span style='color:red;'>" + aData.TENVIPHAMQUYCHETHI + "</span>";
                        strHTML += '<input type ="text" id="txtGhiChu' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.GHICHUTULUAN) + '" class="form-control" placeholder="" style="width: 100px; height: 30px;" />';
                        strHTML += ' </div>';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var dt = edu.util.objGetDataInData(aData.STUDENTEXAMROOMPARTID, me.dtStudentFiles, "DULIEU_ID");
                        var rootPathUploadFile = edu.system.rootPathUpload;
                        var strReturn = "";
                        if (dt.length > 0) {
                            for (var idl = 0; idl < dt.length; idl++)
                                strReturn += '<a id="' + dt[idl].ID + '" href="' + rootPathUploadFile + '/' + dt[idl].DUONGDAN + '">' + dt[idl].TENHIENTHI + '</a>';

                        }

                        strReturn += '<span><a class="btn btn-default btnChiTietBaiThi" id="' + aData.STUDENTEXAMROOMID + '" title="Chi tiết bài thi"><i class="fa fa-eye color-active"></i>Chi tiết bài thi</a></span>';
                        return strReturn;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" style="display:none" class="checkStudentExamRoomPartID" id="checkStudentExamRoomPartID' + aData.STUDENTEXAMROOMPARTID + '" value="' + aData.STUDENTEXAMROOMPARTID + '"/>' +
                            '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }


            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genThongTinDeThiDaTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ExamRoomInfoDetail',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data[0];
                    edu.util.viewHTMLById("lblKieuTaoDe_TaoDeThi", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_TaoDeThi", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_TaoDeThi", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_TaoDeThi", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_TaoDeThi", dt.WRITETENEXAMNAME);

                    edu.util.viewHTMLById("lblKieuTaoDe_TaoDeTuDeThiThuCong", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_TaoDeTuDeThiThuCong", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_TaoDeTuDeThiThuCong", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_TaoDeTuDeThiThuCong", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_TaoDeTuDeThiThuCong", dt.WRITETENEXAMNAME);

                    edu.util.viewHTMLById("lblKieuTaoDe_ChiTiet", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_ChiTiet", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_ChiTiet", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_ChiTiet", dt.DATAODE);
                  
                    edu.util.viewHTMLById("lblKieuTaoDe_TinhHuongThi", dt.GENSTYLETEXT);
                    edu.util.viewHTMLById("lblCauTrucDe_TinhHuongThi", dt.EXAMSTRUCTNAME);
                    edu.util.viewHTMLById("lblTongSoCau_TinhHuongThi", dt.TOLTALQUESTION);
                    edu.util.viewHTMLById("lblTrangThai_TinhHuongThi", dt.DATAODE);
                    edu.util.viewHTMLById("lblDeThi_TinhHuongThi", dt.WRITETENEXAMNAME);
                    me.strExamStructId = dt.EXAMSTRUCTID;
                     
                   

                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KieuLamBai: function () {
        var me = this;

        var obj_list = {
            'action': 'QLTTN_QuanLyNganHangCauHoi/LayDS_ExamStructPart',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strExamStructId': me.strExamStructId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': 1,
            'ItemPerPage': 1000000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    
                    me.dataExamPart = data.Data.filter(e => e.PARENTID === null && e.KIEULAMBAITHI === 'THITULUANVANBAN' );                  
                     me.genList_drpExamstructPart(me.dataExamPart);
                    me.getList_ChiTietPhongThi('1');




                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
   
     
    genList_drpExamstructPart: function (data) {

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TITLE",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpExamstructPart"],
            type: "",
            title: "Chọn phần thi"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length == 1) {
            $("#drpExamstructPart").val(data[0].ID).trigger('change');
        }
    }, 
     
      
    
    report: function (strLoaiBaoCao) {

        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];

        //if (strLoaiBaoCao != "TEMPLATE_DANHSACHTHISINH") {
        //    if (edu.util.getValById("drpExamstructPart") == "") {
        //        edu.system.alert("Bạn chưa chọn phần thi");
        //        return;
        //    }
        //}
        if (strLoaiBaoCao == "") {
            edu.system.alert("Bạn chưa chọn mẫu báo cáo");
            return;
        }
        addKeyValue("ExamRoomInfo_Id", me.strExamRoomInfoId);
        addKeyValue("ExamstructPartId", edu.util.getValById("drpExamstructPart"));
        addKeyValue("strReportCode", strLoaiBaoCao);
        addKeyValue("strNguoiDangNhap_Id", edu.system.userId);

        var obj_save = {
            'strTuKhoa': arrTuKhoa.toString(),
            'strDuLieu': arrDuLieu.toString(),
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strBaoCao_Id = data.Message;
                    if (!edu.util.checkValue(strBaoCao_Id)) {
                        edu.system.alert("Chưa lấy được dữ liệu báo cáo!");
                        return false;
                    }
                    else {
                         var url_report = me.rootPathReport + "?id=" + strBaoCao_Id;
                        //var url_report = "http://localhost:5292/Modules/Common/Baocao.aspx?id=" + strBaoCao_Id;
                        
                         
                        location.href = url_report;
                        
                       

                    }
                }
                else {
                    edu.system.alert("Có lỗi xảy ra vui lòng thử lại!");
                }
            },
            type: "POST",
            action: 'SYS_Report/ThemMoi',
            versionAPI: 'v1.0',
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

        function addKeyValue(strTuKhoa, strDulieu) {
            arrTuKhoa.push(strTuKhoa);
            arrDuLieu.push(strDulieu);
        }
    },
    checkedCol_BgRow: function (strTable_Id) {//Check toàn bộ input theo cột dựa theo input trên thead
        var me = this;
        //alert(1);
        //Truyền vào id bảng hàm sẽ tạo sự kiện khi check input trên tiêu để bảng (th:input) sẽ lấy thự tự cột và check all toàn bộ input trong cột đó trong bảng
        $("#" + strTable_Id + " th").delegate("input", "click", function () {

            var checked_status = $(this).is(':checked');
            var child = this.parentNode;
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            $("#" + strTable_Id + " tbody tr").each(function () {
                var arrcheck = $(this).find("td:eq(" + index + ")").find('input:checkbox');
                arrcheck.each(function () {
                    if ($(this).is(":hidden")) return;
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                });
            });
        });
    },
      
   
    save_CongNhanDiem: function (strStudentExamRoomPartId, strMark, strGhiChu) {
        var me = this;
        //--Edit
        
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Sua_CongNhanDiem_TuLuan',
            'versionAPI': 'v1.0',
            'strId': strStudentExamRoomPartId,
            'strMark': strMark,
            'strGhiChu': strGhiChu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.returnEmpty(me.strTongThoiGianCauTrucDe) != '')
            obj_delete = {
                'action': 'QLTTN_QuanLyThi/Sua_CongNhanDiem_TuLuan',
                'versionAPI': 'v1.0',
                'strId': strStudentExamRoomPartId,
                'strMark': strMark,
                'strGhiChu': strGhiChu,
                'strNguoiThucHien_Id': edu.system.userId
            };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Cập nhật thành công");
                }
                else {
                    edu.system.alert(obj_delete + ": " + JSON.stringify(data.Message));
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.alert(obj_delete + ": " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_delete.action,
            versionAPI: obj_delete.versionAPI,
            contentType: true,
            authen: true,
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },   
     
    toggle_edit_zoneKetQuaThi: function () {
        var me = this;
        //$("#zoneKetQuaThi").modal('show');
    },
    countdown: function (timeCountdown, container) {
        var me = this;
        var t = timeCountdown;
        //console.log("timeCountdown: ", t);
        var current_seconds = Math.floor((t / 1000) % 60); //t.seconds;
        var seconds;

        if (current_seconds != 0)
            seconds = current_seconds + 1;
        else
            seconds = 60;
        var mins = Math.floor((t / 1000 / 60) % 60); //t.minutes;
        var hours = Math.floor((t / 1000 / (60 * 60)) % 60);

        var strColour = "orange";
        if (mins <= 3 && hours == 0 && seconds % 2 == 0)
            strColour = "red";
        //console.log("hours: ", hours + " mins: ", mins + " seconds: " + seconds);
        //clearInterval(tick());
        function tick() {

            if ($("#" + container) != null) {
                seconds--;
                //console.log("mins: ", mins + " seconds: " + seconds);
                $("#" + container).html("<span style='text-align:center; color: " + strColour + "'>" + (hours > 0 ? hours.toString() + ":" : "") + (mins < 10 ? "0" : "") + mins.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString() + "</span>");
                //var  = "<span style='text-align:center; color: " + strColour + "'>" + mins.toString() + ":" + (seconds < 10 ? "0" : "") + seconds.toString() + "</span>";

                if (seconds > 0) {
                    setTimeout(tick, 1000);
                }
                else {
                    //console.log("mins1: ", mins);
                    if (t > 60000) {//mins > 1 || (mins == 1 && hours > 0)
                        var newCountdown = hours * 3600000 + (mins - 1) * 60000;
                        //console.log("newCountdown: ", newCountdown);
                        setTimeout(function () { me.countdown(newCountdown, container); }, 1000);
                    }
                    else if (mins == 1) {
                        setTimeout(function () { me.countdown(60000 - 0.01, container); }, 1000);
                    }
                }
            }
        }
        tick();
    },

    randomString: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWYabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    printPhieu: function () {
        var me = this;
        alert(111);
        edu.extend.remove_PhoiIn("zoneKetQuaThi");
        edu.util.printHTML('zoneKetQuaThi');
        //  me.closePhieu();
    },
    Update_PhongThi_MucPheDuyet: function (strIds, strMucPheDuyet) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/Update_PhongThi_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strIds': strIds,
            'strMucPheDuyet': strMucPheDuyet,
            'strNguoiThucHien_Id': edu.system.userId,
            'strUngDung_Id': edu.system.appId,
            'strChucNang_Id': edu.system.strChucNang_Id

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    // me.genThongTinDeThiDaTao();
                    edu.system.alert("Thực hiện chuyển thành công");
                }
                else {

                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    rewrite_DiaChiIP_ThiSinh: function () {
        var me = this;
        me.strThiSinhId = "#";

        $("#lblStudentCode").html('');
        $("#lblHoTen").html('');
        $("#lblClassName").html('');
        $("#lblSoBaoDanh").html('');
        $("#lblBirthDate").html('');
    },
    toggle_edit_DiaChiIP_ThiSinh: function () {
        
        $("#zoneDiaChiIP_ThiSinh").modal('show');
    }, 
    viewEdit_DiaChiIP_ThiSinh: function (dt) {
        var me = this;
        me.strThiSinhId = dt.USERID;

        $("#lblStudentCode").html(dt.STUDENTCODE);
        $("#lblHoTen").html(dt.HODEM + ' ' + dt.TEN);
        $("#lblClassName").html(dt.CLASSNAMEIMPORT);
        $("#lblSoBaoDanh").html(dt.SOBAODANHIMPORT);
        $("#lblBirthDate").html(dt.BIRTHDATE_USER);
    },
    getList_DiaChiIP_ThiSinh: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_DiaChiIP_ThiSinh',
            'versionAPI': 'v1.0',
            'strStudentExamRoom_Id': strId,
            'strNguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_DiaChiIP_ThiSinh(data.Data, data.Pager, strId);
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DiaChiIP_ThiSinh: function (data, iPager, strId) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tbl_DiaChiIP_ThiSinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.chamthituluan.getList_DiaChiIP_ThiSinh('" + strId + "')",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 1, 2],
            },
            aoColumns: [
                {
                    "mDataProp": "IPADDRESS"
                },
                {
                    "mDataProp": "COMPUTERNAME"
                },
                {
                    "mDataProp": "DATELOGIN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    gen_KetQuaThi: function () {
        var me = this;

        //var obj_list = {
        //    'action': 'TTN_ThiSinh/gen_KetQuaThi_Kieu01',
        //    'versionAPI': 'v1.0',
        //    'strExamRoomInfoId': me.strExamRoomInfoId,
        //    'strStudentExamRoomId': me.strStudentExamRoomId,
        //    'strThiSinhId': me.strThiSinhId,
        //    'strUserId': edu.system.userId,

        //};
        dt = edu.util.objGetDataInData($('#drpExamstructPart').find('option:selected').val(), me.dataExamPart, "ID");
        var strKieuLamBaiThi = "";
        if (dt.length > 0)
            strKieuLamBaiThi = dt[0].KIEULAMBAITHI;
        var obj_list = {
            'action': 'TTN_ThiSinh/gen_KetQuaThi_KIEULAMBAI',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strStudentExamRoomId': me.strStudentExamRoomId,
            'strThiSinhId': me.strThiSinhId,
            'strUserId': edu.system.userId,
            'strKieuLamBai': strKieuLamBaiThi,

        }; 

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#zoneKetQuaThi").html(data.Data);
                    console.log($("#zoneKetQuaThi").html());
                  
                   // MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'ThongTinBaiThi']);
                    $("#zoneKetQuaThi").modal('show');
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            authen: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
     
}