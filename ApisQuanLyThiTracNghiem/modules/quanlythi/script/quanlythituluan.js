function quanlythituluan() { };
quanlythituluan.prototype = {
    dtPhongThi: [],
    dtChiTietPhongThi: [],
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
                     
                        me.save_CongNhanDiem(strStudentExamRoomPartId, strMark, strGhiChu);
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
                     
                    
                    if (me.dtChiTietPhongThi.length > 0)
                        me.strExamstructPartId = me.dtChiTietPhongThi[0].EXAMSTRUCTPARTID;
                     
                    
                    me.genTable_ChiTietPhongThi(strCoTinhLaiDiem, me.dtChiTietPhongThi, data.Pager);
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
       
        var rootPathUploadFile = edu.system.rootPathUpload;
        
          
        $("#tblChiTietPhongThi_TuLuan tfoot").html('<tr role="row" style="text-align:center; font-weight: bold; color:#007acc"><td style="text-align:center; font-weight: bold;" colspan="6">Tổng số: ' + iSoThiSinhDuThi + '</td><td style="text-align:center; font-weight: bold;" colspan="3">Số Đạt: ' + iSoThiSinhDat + '</td><td style="text-align:center; font-weight: bold;" colspan="4">Số Không Đạt: ' + iSoThiSinhKhongDat + '</td></tr>');
       
        var jsonForm = {
            strTable_Id: "tblChiTietPhongThi_TuLuan",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.quanlythituluan.getList_ChiTietPhongThi(" + strCoTinhLaiDiem+")",
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
                    "mRender": function (nRow, aData) {
                    
                        var html = '<span><img src="' + edu.system.rootPath+'/Upload/Anh/' + aData.STUDENTCODE + '.jpg" class= "table-img" id="sl_hinhanh' + aData.STUDENTCODE + '" /></span>';
                        return '<a>' + html + '</br>' + aData.STUDENTCODE  +'</a>';

                    }
                     
                  
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietThiSinh" id="' + aData.ID + '" title="Thông tin thí sinh"><i class="fa fa-edit color-active"></i>' + aData.FULLNAME + '</a></span>';
                    }
                     
                },
                {
                    "mDataProp": "BIRTHDATE_USER"
                },
                {
                    "mDataProp": "SOBAODANHIMPORT"
                },
                {
                    "mDataProp": "SOPHACH"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        var timeMinute = aData.TIMERCOUNTDOWN;
                        var strDiem = "";                         
                        strHTML = '<input type ="text" id="txtDiemDuocCongNhan' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.MARKTULUAN)  + '" class="form-control" />';
                          
                        return strHTML;
                    }
                } ,
                {
                    "mDataProp": "DIACHIIPMAYDADANGNHAP"
                },
                {
                    "mRender": function (nrow, aData) {
                        var strHTML = "";
                        if (edu.util.returnEmpty(aData.TENVIPHAMQUYCHETHI) != "")
                            strHTML = "<span style='color:red;'>" + aData.TENVIPHAMQUYCHETHI + "</span>";
                        strHTML += '<input type ="text" id="txtGhiChu' + aData.ID + '" value ="' + edu.util.returnEmpty(aData.GHICHUTULUAN) + '" class="form-control" />';
                        return strHTML;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietBaiThi_TuLuan" id="' + aData.STUDENTEXAMROOMID + '" title="Chi tiết phòng"><i class="fa fa-eye color-active"></i>Chi tiết phòng</a></span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        //  return '<span><a class="btn btn-default btnChiTietBaiThi_TuLuan" id="' + aData.ID + '" title="Chi tiết bài thi"><i class="fa fa-eye color-active"></i>Chi tiết bài thi</a></span>';
                     
                        var strReturn = "";
                        var dt = edu.util.objGetDataInData(aData.ID, me.dtStudentFiles, "DULIEU_ID");
                        
                        for (var idl = 0; idl < dt.length; idl++) 
                            strReturn += '<a id="' + dt[idl].ID + '" href="' + rootPathUploadFile + '/' + dt[idl].DUONGDAN + '">' + dt[idl].TENHIENTHI + '</a>';
                        
                       
                        return strReturn;

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
                strFuntionName: "main_doc.quanlythituluan.getList_PhongThi()",
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

