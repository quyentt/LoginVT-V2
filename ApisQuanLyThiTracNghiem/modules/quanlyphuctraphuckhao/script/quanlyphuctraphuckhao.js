function quanlyphuctraphuckhao() { };
quanlyphuctraphuckhao.prototype = {
    dtPhongThi: [],
    dtChiTietPhongThi: [],
    strStudentExamRoomId:'',
    strThiSinhId:'',
    strExamRoomInfoId: '',
    strMatKhauChoPhongThi: '',
    strDepartOrganId: '',
    strWritenExamId: '',
    strKieuTaoDe: '',
    strStudentExamRoomIds: '',
    strExamStructId:'',
    init: function () {
        var me = this;        
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhongThi();
            }
        });   
        $(".btnSearch_PhongThi").click(function () {
            me.getList_PhongThi();
        });         
        $("#btn_Refresh").click(function () {
            me.getList_ChiTietPhongThi();
        });         
        $("#tblChiTietPhongThi").delegate(".btnChiTietThiSinh", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.rewrite_ThiSinh();
            me.toggle_edit_ThiSinh();
            me.viewEdit_ThiSinh(dt[0]);

        });         
        $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;              

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;
            me.genThongTinDeThiDaTao();
            me.toggle_edit_chitiet();
            me.getList_ChiTietPhongThi();
            setTimeout(function () {
                me.getList_KieuLamBai();
            }, 2000);
                   
        });   
        $("[id$=chkSelectAll_ChiTietPhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChiTietPhongThi" });
        });        
        $("#drpExamstructPart").on("select2:select", function () {
            me.getList_ChiTietPhongThi();
        });
        $(".btnCloseSubDetail").click(function () {

            me.toggle_edit_chitiet();
        });
        
        $("#tblChiTietPhongThi").delegate('.btnChiTietBaiThi', 'click', function (e) {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
            me.strThiSinhId = dt[0].USERID;  
            me.strStudentExamRoomId = strId;
            e.stopImmediatePropagation();  
            $("#zoneChiTiet").hide();
            $("#zoneKetQuaThi").slideDown();
            me.gen_KetQuaThi();
          
            
            //$(".zone-bus").hide();
            //edu.extend.getData_Phieu(strPhieuThu_Id, "BIENLAI", 'MauInPhieuThu', main_doc.PhieuThu.changeWidthPrint);
        });
        $("#btnClose_KetQuaThi").click(function (e) {
            e.stopImmediatePropagation();
            me.closeKetQuaThi();
        });
         
        $("#btnIn_DeThiCuaThiSinh").click(function (e) {
            e.stopImmediatePropagation();
            me.printPhieu();
        });
        $("#btnTaiFile").click(function () {
            var selectedValue = $("#drpBaoCao").find('option:selected').val();
            me.report($("#drpBaoCao").val());
        });
        $("#btnAdd_PhucTraDiem").click(function () {
            var arrChecked_Id = edu.util.getAllArrCheckBoxIds("tblChiTietPhongThi", "checkX");
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    var strId = arrChecked_Id[i];
                    var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID");
                    var strStudentExamRoomPartId = strId;
                    var strMarkPhucTra = edu.util.getValById("txtDiemPhucTra" + strId);
                    var strGhiChuPhucTra = edu.util.getValById("txtGhiChuPhucTra" + strId);

                    if (edu.util.returnEmpty(dt.MARK) != strMarkPhucTra)
                        me.save_DiemPhucTra(strStudentExamRoomPartId, strMarkPhucTra, strGhiChuPhucTra);
                }
            });
            setTimeout(function () {
                me.getList_ChiTietPhongThi();
            }, 2000);
        }); 
      

    },
    page_load: function () {        
        var me = this;
        edu.system.page_load();
        me.getList_drpDonVi();
        me.getList_drpDotThi();
     

    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit_chitiet: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneChiTiet");
    },    
    getList_ChiTietPhongThi: function () {
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


        edu.util.viewHTMLById("lblDonVi_TinhHuongThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TinhHuongThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TinhHuongThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TinhHuongThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TinhHuongThi", dt[0].EXAMDATE);
        me.strExamStructId = dt.EXAMSTRUCTID;

        me.strMatKhauChoPhongThi = dt[0].MATKHAUCHOPHONGTHI;
        
         
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_ChiTietPhongThi_KetQua',
            'versionAPI': 'v1.0',
            'strExamStructPartId': edu.util.getValById("drpExamstructPart"),
            'strCoTinhLaiDiem':"1",
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strNguoiTao_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtChiTietPhongThi = data.Data;
                    me.genTable_ChiTietPhongThi(data.Data, data.Pager);
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
    genTable_ChiTietPhongThi: function (data, iPager) {
        var me = this;
        var iSoThiSinhDuThi = 0;
        var iSoThiSinhKhongDat = 0;
        var iSoThiSinhDat = 0;
         
        $("#tblChiTietPhongThi tfoot").html('<tr role="row" style="text-align:center; font-weight: bold; color:#007acc"><td style="text-align:center; font-weight: bold;" colspan="6">Tổng số: ' + iSoThiSinhDuThi + '</td><td style="text-align:center; font-weight: bold;" colspan="3">Số Đạt: ' + iSoThiSinhDat + '</td><td style="text-align:center; font-weight: bold;" colspan="4">Số Không Đạt: ' + iSoThiSinhKhongDat + '</td></tr>');
       
        var jsonForm = {
            strTable_Id: "tblChiTietPhongThi",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.quanlyphuctraphuckhao.getList_ChiTietPhongThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
                right:[6]
            },
            aoColumns: [
                {
                    "mDataProp": "STUDENTCODE"
                },
                {
                    "mDataProp": "FULLNAME"
                },
                {
                    "mDataProp": "BIRTHDATE_USER"
                },
                {
                    "mDataProp": "SOBAODANHIMPORT"
                },
                {
                    "mDataProp": "MARK"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        strHTML = '<input type ="text" id="txtDiemPhucTra' + aData.ID + '" value = "' + edu.util.returnEmpty(aData.MARKPHUCTRA) + '" class="form-control" />';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        strHTML = '<input type ="text" id="txtGhiChuPhucTra' + aData.ID + '" value="' + edu.util.returnEmpty(aData.GHICHUPHUCTRA) + '" class="form-control" />';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = ""; 
                        var idTimer = "timer" + aData.ID.toString();
                        var timeMinute = aData.TIMERCOUNTDOWN;
                       
                        if (parseFloat(aData.THOIGIANCONLAI) > 0)  
                        {
                            if (timeMinute != "" && timeMinute != null && timeMinute != "0") {
                                if (parseInt(timeMinute) > 0 && aData.FINISHED == "0")  
                                    strHTML += "<span style='text-align:center' id='" + idTimer + "'></span>"; 
                               
                                else  
                                    strHTML += "<span style='text-align:center'>--:--</span>"; 
                            }
                        }
                        else if  (parseInt(timeMinute) <= 0)
                            strHTML = "<span style='color: Violet' >Kết thúc</span>"; 
                        if (aData.TIMESTARTDOEXAM_TEXT == null || aData.TIMESTARTDOEXAM_TEXT == '')
                            strHTML = "<span style='color: Green' >Chưa thi</span>";
                        if (aData.FINISHED == "1")
                            strHTML = "<span style='color: red' >Thi xong</span>";                       
                       
                        if (timeMinute != "" && timeMinute != null && timeMinute != "0" && parseInt(timeMinute) > 0 && aData.FINISHED == "0") {
                            $("#" + idTimer).html("");
                            me.countdown(aData.TIMERSHOW, idTimer);
                        }
                        return strHTML; 
                    }
                },
                {
                    "mDataProp": "TIMEHHMISSSTARTDOEXAM"
                },
                {
                    "mDataProp": "TENMAYDADANGNHAP"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietBaiThi" id="' + aData.ID + '" title="Chi tiết bài thi"><i class="fa fa-eye color-active"></i>Chi tiết bài thi</a></span>';
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
    getList_drpDonVi: function () {
        var me = this;
        
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_DonViByUserId',            
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
            'action': 'QLTTN_QuanLyThi/LayDS_ThongTinPhongThi',
            'versionAPI': 'v1.0',
            'strDonVi_Id': edu.util.getValById('drpDonVi'),
            'strDotThi_Id': edu.util.getValById('drpDotThi'),
            'strTrangThaiPhongThi': edu.util.getValById('drpTrangThaiPhongThi'),
            'strStatus': edu.util.getValById('drpStatus'),
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
        $("#lblPhongThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhongThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlyphuctraphuckhao.getList_PhongThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4,5,6,7 ],
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
                    "mDataProp": "TENDOTTHI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.OPENSTATUS == "0" ? "Đóng" : "Mở";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.STATUS == "0" ? "Ẩn" : "Hiện";
                    }
                },
                {
                    "mDataProp": "SOLUONGTHISINH"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strHTML = "";
                        if (aData.OPENSTATUS == "0")
                            strHTML = '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                        return strHTML;
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
    report: function (strLoaiBaoCao) {

        var me = this;
        var arrTuKhoa = [];
        var arrDuLieu = [];


        addKeyValue("ExamRoomInfo_Id", me.strExamRoomInfoId); 
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
                        var url_report = edu.system.rootPathReport + "?id=" + strBaoCao_Id;
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
    closeKetQuaThi: function () {
        var me = this;        
        $("#zoneChiTiet").show();
        $("#zoneKetQuaThi").slideUp();
    },

    save_DiemPhucTra: function (strStudentExamRoomPartId, strMarkPhucTra , strGhiChuPhucTra) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/save_DiemPhucTra',
            'versionAPI': 'v1.0',
            'strId': strStudentExamRoomPartId,
            'strMarkPhucTra': strMarkPhucTra,
            'strGhiChuPhucTra': strGhiChuPhucTra,
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
                    //alert(me.strExamStructId);
                    //var dtMatKhauPhanThi;
                    var dataExamPart = data.Data.filter(e => e.PARENTID === null);
                    //dtMatKhauPhanThi = me.LayDS_MatKhauPhanThi();
                   // alert(dataExamPart);
                    //me.genList_KieuLamBai(dataExamPart, dtMatKhauPhanThi);
                    me.genList_drpExamstructPart(dataExamPart);




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
                    
                    me.strExamStructId = dt.EXAMSTRUCTID;
                    me.getList_KieuLamBai();
                    

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
    printPhieu: function () {
        var me = this;
        edu.extend.remove_PhoiIn("ThongTinBaiThi");
        edu.util.printHTML('ThongTinBaiThi'); 
      //  me.closePhieu();
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
}

