function duyetdiemthituluan() { };
duyetdiemthituluan.prototype = {
    dtPhongThi: [],
    dtChiTietPhongThi: [],
    dtGiaoVienChamThi: [],
    dtDiemGiaoVienChamThi: [],
    dtDiemSoSanhGiaoVien:[],
    dataExamPart:[],
    dtStudentFiles: [],
    strStudentExamRoomId:'',
    strThiSinhId:'',
    strExamRoomInfoId: '',
    strExamstructPartId:'',
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
          $('#drpExamstructPart').on('select2:select', function () {
              
            me.getList_ChiTietPhongThi("1");
        });
        $(".btnSearch_PhongThi").click(function () {
            me.getList_PhongThi();
        });
        
        
        $("#btn_Refresh").click(function () {
            me.getList_ChiTietPhongThi('1');
        });   
        
        
       
        $("#tblChiTietPhongThi_TuLuan").delegate(".btnChiTietThiSinh", "click", function () {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "ID"); 

        });
        $("#btnAdd_CongNhanDiem").click(function () { 
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                
                for (var i = 0; i < me.dtChiTietPhongThi.length; i++) {
                    
                    var strStudentExamRoomPartId = me.dtChiTietPhongThi[i].ID;
                    var strMark = edu.util.getValById("txtDiemDuocCongNhan" + strStudentExamRoomPartId); 
                    var strGhiChu = edu.util.getValById("txtGhiChu" + strStudentExamRoomPartId);                     
                    me.save_CongNhanDiem_Admin(strStudentExamRoomPartId, strMark, strGhiChu);
                }
                setTimeout(function () {
                    me.getList_ChiTietPhongThi('1');
                }, 2000);
            });
          
        }); 
        $("#btnAdd_TaoPhach").click(function () {


            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');                
               
                me.save_TaoPhach();
                setTimeout(function () {
                    me.getList_ChiTietPhongThi('1');
                }, 2000);
                
            });
           
        }); 
        $("#btnAdd_TaiFileThiSinhLamBai").click(function () {
            me.TaiFileThiSinhLamBai();
        });
        $("#btnAdd_TaiFileThiSinhLamBai_VanBan").click(function () {
            me.report("BAITHITULUANPHONGTHI");
        });
        
        $("#tblPhongThi").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strExamRoomInfoId = strId;              

            var dt = edu.util.objGetDataInData(strId, me.dtPhongThi, "ID");
            me.strDepartOrganId = dt[0].DEPARTORGANID;
            me.strExamStructId = dt[0].EXAMSTRUCTID;
            
            me.toggle_edit_chitiet();
            
            setTimeout(function () {
                me.getList_KieuLamBai();

            }, 1000);                  
        });
        
       
        $("[id$=chkSelectAll_PhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhongThi" });
        });
      

        $("[id$=chkSelectAll_ChiTietPhongThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChiTietPhongThi_TuLuan" });
        }); 
         
        $(".btnCloseSubDetail").click(function () {

            me.toggle_edit_chitiet();
        }); 
        
        $("#tblChiTietPhongThi_TuLuan").delegate('.btnChiTietBaiThi_TuLuan', 'click', function (e) {
            var strId = this.id;
            var dt = edu.util.objGetDataInData(strId, me.dtChiTietPhongThi, "STUDENTEXAMROOMID");
            me.strThiSinhId = dt[0].USERID;  
            me.strStudentExamRoomId = strId;
            e.stopImmediatePropagation();  
            $("#zoneChiTietTuLuan").hide();
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
        edu.util.toggle_overide("zone-bus", "zoneChiTietTuLuan");
    },  
   
    
    toggle_edit_TaoDeThi: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneTaoDeThi");
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


        edu.util.viewHTMLById("lblDonVi_TinhHuongThi", dt[0].TENDONVI);
        edu.util.viewHTMLById("lblDotThi_TinhHuongThi", dt[0].TENDOTTHI);
        edu.util.viewHTMLById("lblPhongThi_TinhHuongThi", dt[0].ROOMNAME);
        edu.util.viewHTMLById("lblMonThi_TinhHuongThi", dt[0].COURSENAME);
        edu.util.viewHTMLById("lblNgayThi_TinhHuongThi", dt[0].EXAMDATE);

        edu.util.viewHTMLById("lblKieuTaoDe_ChiTiet", dt[0].GENSTYLETEXT);
        edu.util.viewHTMLById("lblCauTrucDe_ChiTiet", dt[0].EXAMSTRUCTNAME);
        edu.util.viewHTMLById("lblTongSoCau_ChiTiet", dt[0].TOLTALQUESTION);
        edu.util.viewHTMLById("lblTrangThai_ChiTiet", dt[0].DATAODE);
        edu.util.viewHTMLById("lblDeThi_ChiTiet", dt[0].WRITETENEXAMNAME);
        me.strMatKhauChoPhongThi = dt[0].MATKHAUCHOPHONGTHI;
         
        
        dt = edu.util.objGetDataInData($('#drpExamstructPart').find('option:selected').val(), me.dataExamPart, "ID");
        var strKieuLamBaiThi = "";
        if (dt.length > 0)
            strKieuLamBaiThi = dt[0].KIEULAMBAITHI;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDS_CTPhongThi_Part_TuLuan',
            'versionAPI': 'v1.0',  
            'strExamRoomInfoId': me.strExamRoomInfoId, 
            'strKieuLamBaiThi': strKieuLamBaiThi,
            'strExamStructPartId': $('#drpExamstructPart').find('option:selected').val(),
            'NguoiDung_Id': edu.system.userId,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {  

                    me.dtChiTietPhongThi = data.Data.ChiTietPhongThi;
                    me.dtStudentFiles = data.Data.StudentFiles;
                    me.dtGiaoVienChamThi = data.Data.GiaoVienChamThi;
                    me.dtDiemGiaoVienChamThi = data.Data.DiemGiaoVienChamThi;
                    me.dtDiemSoSanhGiaoVien = data.Data.DiemSoSanhGiaoVien; 
                    if (me.dtChiTietPhongThi.length > 0)
                        me.strExamstructPartId = me.dtChiTietPhongThi[0].EXAMSTRUCTPARTID; 
                   // me.genTable_ChiTietPhongThi(strCoTinhLaiDiem, me.dtChiTietPhongThi, data.Pager);
                    me.gen_zoneTable_ChiTietPhongThi(strCoTinhLaiDiem, me.dtChiTietPhongThi, data.Pager);
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
                strFuntionName: "main_doc.duyetdiemthituluan.getList_PhongThi()",
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
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
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
        addKeyValue("ExamstructPartId", me.strExamstructPartId);

        
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
   
    
     
    genTable_Import_View: function (data, strTable) {
        if (data == undefined || data.length == 0) {
            $("#" + strTable + "_Tong").html("");                   
            $("#" + strTable + " tbody").html("");
        }
        else {
            $("#" + strTable + "_Tong").html(data.length);
            var row = "";
            row += '<tr>';
            for (var x in data[0]) {
                row += '<td>' + edu.util.returnEmpty(x) + '</td>';
            }
            row += '</tr>';
            for (var i = 0; i < data.length; i++) {
                row += '<tr>';
                for (var x in data[0]) {
                    row += '<td>' + edu.util.returnEmpty(data[i][x]) + '</td>';
                }
                row += '</tr>';
            }
            $("#" + strTable + " tbody").html(row);
        }
        
    },  
    toggle_import: function () {
        $("#myModal_Upload").modal("hide");
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneImport");



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
    save_CongNhanDiem_Admin: function (strStudentExamRoomPartId, strMark, strGhiChu) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_QuanLyThi/Sua_CongNhanDiem',
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
    closeKetQuaThi: function () {
        var me = this;        
        $("#zoneChiTietTuLuan").show();
        $("#zoneKetQuaThi").slideUp();
    },
    gen_KetQuaThi: function () {
        var me = this;
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
         
        $("#ThongTinBaiThi").html("");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#ThongTinBaiThi").html(data.Data); 
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
    //#region tab_GenDeTuDeThiCoSan 
    
     
    //#endregion

    save_TaoPhach: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/save_TaoPhach',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strKieuLamBaiThi': 'THITULUANVANBAN',
            'strNguoiThucHien_Id': edu.system.userId
        }; 

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    edu.system.alert("Thực hiện thành công");
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
    TaiFileThiSinhLamBai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/TaiFileThiSinhLamBai',
            'versionAPI': 'v1.0',
            'strExamRoomInfoId': me.strExamRoomInfoId,
            'strKieuLamBaiThi': 'THITULUAN',
            'strNguoiThucHien_Id': edu.system.userId
        };

        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");    
                    me.objApi = Init_API();
                    var strKeySwitch = "QLTTN";
                    
                    var strUrl = edu.system.apiUrlTemp + edu.system.objApi[strKeySwitch] + '/';
                    if (edu.system.objApi[strKeySwitch].indexOf("http") === 0)  
                        strUrl = edu.system.objApi[strKeySwitch] + '/';
                    strUrl = strUrl.replace('/api/', '/temp/') + data.Data;
                     window.open(strUrl);

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

                    me.dataExamPart = data.Data.filter(e => e.PARENTID === null && e.KIEULAMBAITHI === 'THITULUANVANBAN'); 
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
    gen_zoneTable_ChiTietPhongThi: function (strCoTinhLaiDiem,data, iPager) {
        var me = this;
        $("#zoneTable_ChiTietPhongThi").html('');
        // gen header
        var strHead = "<table id='Table_ChiTietPhongThi' class='table table-hover table-bordered'><thead>";
        strHead += "<tr>";
        strHead += "<th class='td-center td-fixed'>Stt</th>";
        strHead += "<th class='td-center td-fixed'>Mã thí sinh</th>";
        strHead += "<th class='td-center td-fixed'>Họ và tên</th>";
        strHead += "<th class='td-center td-fixed'>Ngày sinh</th>";
        strHead += "<th class='td-center td-fixed'>Số báo danh</th>";
        strHead += "<th class='td-center td-fixed'>Số phách</th>";
        
        for (var iCol = 0; iCol < me.dtGiaoVienChamThi.length; iCol++)  
            strHead += "<th class='td-center' >" + me.dtGiaoVienChamThi[iCol].FULLNAME + "(" + me.dtGiaoVienChamThi[iCol].NAME+")</th>"; 
        strHead += "<th class='td-center' style='width:150px'>Điểm công nhận</th>";
        strHead += "<th class='td-center' style='width:150px'>Ghi chú</th>";
        //strHead += "<th class='td-center td-fixed'>Xem kết quả</th>";
        //strHead += "<th class='td-center td-fixed'>File</th>";        
        strHead += "</tr>";
        strHead += "</thead>";
     
        
        me.gen_tblDuLieuDanhMuc_body(strCoTinhLaiDiem, data, iPager, strHead);

    },
    gen_tblDuLieuDanhMuc_body: function (strCoTinhLaiDiem, data, iPager, strHead) {
        var me = this;
        var jsonForm = {
            strTable_Id: "zoneTable_ChiTietPhongThi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.duyetdiemthituluan.getList_ChiTietPhongThi(" + strCoTinhLaiDiem + ")",
                iDataRow: iPager
            },
            sort: true,

        };
        // gen header 
        
        var strBody = "<tbody>";
        //B1: Lay tung row du lieu
        var iSTT = 0;
       
        for (var iRow = 0; iRow < data.length; iRow++) {// tung dong du lieu

            var strID = data[iRow].ID;
            iSTT++;
            strBody += "<tr id='" + strID + "'>";
            strBody += "<td class='td-center'>" +
                iSTT +
                "</td>";
            //Mã thí sinh
            strBody += "<td class='td-center'>" +
                '<a>' + '<span><img src="' + edu.system.rootPath + '/Upload/Anh/' + data[iRow].STUDENTCODE + '.jpg" class= "table-img" id="sl_hinhanh' + data[iRow].STUDENTCODE + '" /></span>' + '</br>' + data[iRow].STUDENTCODE + '</a>' +
                "</td>";
            //Họ và tên
            strBody += "<td class='td-left'>" +
                '<span><a class="btn btn-default btnChiTietThiSinh" id="' + data[iRow].ID + '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i>' + data[iRow].FULLNAME + '</a></span>' +
                "</td>";
            //Ngày sinh
            strBody += "<td class='td-left'>" +
                data[iRow].BIRTHDATE_USER +
                "</td>";
            //Số báo danh
            strBody += "<td class='td-left'>" +
                edu.util.returnEmpty(data[iRow].SOBAODANHIMPORT) +
                "</td>";
            //Số phách
            strBody += "<td class='td-left'>" +
                edu.util.returnEmpty(data[iRow].SOPHACH) +
                "</td>";
            //Điểm công nhận
            var strDiemSoSanh = "";
            var dtDiemSoSanh = edu.util.objGetDataInData(me.strExamstructPartId, me.dtDiemSoSanhGiaoVien, "EXAMSTRUCTPARTID");
            if (dtDiemSoSanh.length > 0) {
                var dtDiem_ThiSinh = edu.util.objGetDataInData(data[iRow].USERID, dtDiemSoSanh, "USERID");
                if (dtDiem_ThiSinh.length == 1)
                    strDiemSoSanh = dtDiem_ThiSinh[0].MARK;
            }
            //Lay tung ten cot điểm giảng viên

            for (var iCol = 0; iCol < me.dtGiaoVienChamThi.length; iCol++) {
                var strGiaTri = "";
                var dtDiem = edu.util.objGetDataInData(me.dtGiaoVienChamThi[iCol].NHANSUID, me.dtDiemGiaoVienChamThi, "NHANSUID");

                if (dtDiem.length > 0) {
                    var dtDiem_PhanThi = edu.util.objGetDataInData(me.strExamstructPartId, dtDiem, "EXAMSTRUCTPARTID");
                    if (dtDiem_PhanThi.length > 0) {
                        var dtDiem_SinhVien_PhanThi = edu.util.objGetDataInData(data[iRow].USERID, dtDiem_PhanThi, "USERID");
                        if (dtDiem_SinhVien_PhanThi.length > 0)
                            strGiaTri = edu.util.returnEmpty(dtDiem_SinhVien_PhanThi[0].MARK);
                    }
                }
                if (strDiemSoSanh == "")
                    strGiaTri = "<span style='color:red'>" + strGiaTri + "</span>";
                strBody += "<td class='td-center'>" +
                    strGiaTri +
                    "</td>";
            }
            var dtDiemDaLuu = edu.util.objGetDataInData(strID, me.dtChiTietPhongThi, "ID");
            if (dtDiemDaLuu.length == 1) {
                if (edu.util.returnEmpty(dtDiemDaLuu[0].MARK) != '') {
                    strBody += "<td class='td-left'>" +
                        '<input type ="text" id="txtDiemDuocCongNhan' + data[iRow].ID + '" style="background-color:burlywood;" value ="' + edu.util.returnEmpty(dtDiemDaLuu[0].MARK) + '" class="form-control" />'
                    "</td>";
                }
                else {
                    strBody += "<td class='td-left'>" +
                        '<input type ="text" id="txtDiemDuocCongNhan' + data[iRow].ID + '" value ="' + edu.util.returnEmpty(strDiemSoSanh) + '" class="form-control" />'
                    "</td>";
                }

            }
            else {
                strBody += "<td class='td-left'>" +
                    '<input type ="text" id="txtDiemDuocCongNhan' + data[iRow].ID + '" value ="' + edu.util.returnEmpty(strDiemSoSanh) + '" class="form-control" />'
                "</td>";
            }
            var strHTML = "";
            if (edu.util.returnEmpty(data[iRow].TENVIPHAMQUYCHETHI) != "")
                strHTML = "<span style='color:red;'>" + data[iRow].TENVIPHAMQUYCHETHI + "</span>";
            strHTML += '<input type ="text" id="txtGhiChu' + data[iRow].ID + '" value ="' + edu.util.returnEmpty(data[iRow].GHICHUTULUAN) + '" class="form-control" />';
            //Ghi chú
            strBody += "<td class='td-left'>" +
                strHTML+
                "</td>";
            //Xem kết quả
            //strBody += "<td class='td-left'>" +
            //    '<span><a class="btn btn-default btnChiTietBaiThi_TuLuan" id="' + data[iRow].STUDENTEXAMROOMID + '" title="Chi tiết "><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
            //"</td>";
            ////File
            //var strFile = "";
            //var dt = edu.util.objGetDataInData(data[iRow].ID, me.dtStudentFiles, "DULIEU_ID");

            //for (var idl = 0; idl < dt.length; idl++)
            //    strFile += '<a id="' + dt[idl].ID + '" href="' + rootPathUploadFile + '/' + dt[idl].DUONGDAN + '">' + dt[idl].TENHIENTHI + '</a>';

            //strBody += "<td class='td-left'>" +
            //    strFile+
            //"</td>";
          

            
            strBody += "</tr>";
        }

 
        strBody += "</tbody></table>";
        var strTable = strHead + strBody;
        $("#zoneTable_ChiTietPhongThi").append(strTable); 
        
        var strzoneId = "zoneTable_ChiTietPhongThi";
        if (document.getElementsByClassName("zone-pag-footer" + strzoneId).length === 0) {
            edu.system.pagInfoRender(strzoneId);
            //Thay đổi sang ô tìm kiếm
            //edu.system.insertFilterToTable(strzoneId, strFuntionName);
            //Tùy chọn thay đổi change
            //edu.system.insertChangLenghtToTable([[24, 30, 50, 100, 200, -1], [24, 30, 50, 100, 200, 'Tất cả']], strzoneId);
            //Tùy chọn Cập nhật lại PageSizechange
            $("#dropPageSizechange" + strzoneId).val(edu.system.pageSize_default).trigger('change');
            //Tạo dải phân cách giữa 2 thằng sau sẽ xóa
            $(".zone-pag-clear" + strzoneId).replaceWith('');
            $("#" + strzoneId).before('<div class="zone-pag-clear' + strzoneId + '" style="clear: both;"></div>');
        }
        edu.system.pagButtonRender("main_doc.duyetdiemthituluan.getList_ChiTietPhongThi(" + strCoTinhLaiDiem + ")", "zoneTable_ChiTietPhongThi", iPager);

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
    
}

