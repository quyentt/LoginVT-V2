function thanhtoangiangday() { };
thanhtoangiangday.prototype = {
    strStaffId: '',
    dtThanhToan: [],
    dtTienDaThanhToan: [],
    strErr:'',
   
    init: function () {
        var me = this;
        me.page_load();

        $('#drpSchoolYear').on('select2:select', function () {
          
            me.getList_drpBoMon(); 
        });

        $('#drpHeDaoTao').on('select2:select', function () {
            me.getList_drpAcademicyear();
        });
        $('#drpBoMon').on('select2:select', function () {
            
            me.getList_tblKhoiLuong(); 
        });
        $("#tblKhoiLuong").delegate(".inputnhapso", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;
             
        });
        
        $("#tblDaThanhToan").delegate(".inputnhapso", "keyup", function (e) {
            var check = edu.system.checkSoTienInput(this, false);
            if (!check) return;

        });
        $('#btnSearch').click(function () {
            me.getList_tblKhoiLuong(); 
        });
        $('#btnThanhToan').click(function () {
          
            edu.system.confirm("Bạn có chắc chắn thanh toán giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strStaffId = "", strNoiDung = "", strSoTienDHCQ = "", strSoTienDHTC = "", strCAOHOC = "", strTTHTQT = "";
                var strNgayThanhToan = "";
                for (var i = 0; i < me.dtThanhToan.length; i++) {
                    strStaffId = me.dtThanhToan[i].ID;
                    strNoiDung = edu.util.getValById("txtNoiDung" + me.dtThanhToan[i].ID);
                    strSoTienDHCQ = edu.util.getValById("txtTienConLaiDHCQ" + me.dtThanhToan[i].ID);
                    strSoTienDHTC = edu.util.getValById("txtTienConLaiDHTC" + me.dtThanhToan[i].ID);
                    strCAOHOC = edu.util.getValById("txtTienConLaiCaoHoc" + me.dtThanhToan[i].ID);
                    strTTHTQT =  edu.util.getValById("txtTienConLaiHTQT" + me.dtThanhToan[i].ID);
                    strNgayThanhToan = edu.util.getValById("txtNgayThanhToan" + me.dtThanhToan[i].ID);
                    if (strSoTienDHCQ != edu.util.returnEmpty(me.dtThanhToan[i].TIENCONLAIDHCQ)
                        || strSoTienDHTC != edu.util.returnEmpty(me.dtThanhToan[i].TIENCONLAIDHTC)
                        || strCAOHOC != edu.util.returnEmpty(me.dtThanhToan[i].TIENCONLAICAOHOC)                        
                        || strTTHTQT != edu.util.returnEmpty(me.dtThanhToan[i].TIENCONLAITTHTQT))
                        
                        me.SaveThanhToanGiangDay(strStaffId, strNoiDung, strSoTienDHCQ, strSoTienDHTC, strCAOHOC, strTTHTQT, strNgayThanhToan);
                }
                setTimeout(function () {
                    if (me.strErr == "") {
                        edu.system.alert("Cập nhật thành công");
                        me.getList_tblKhoiLuong();
                    }
                    else
                        edu.system.alert(me.strErr);

                }, 2000);

               
            });
        });
        $('#btnXoaThanhToan').click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblDaThanhToan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn thanh toán cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa thanh toán giảng dạy?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    
                    me.DeleteTienThanhToan(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    if (me.strErr == "") {
                        edu.system.alert("Thực hiện thành công");
                        me.getList_tblDaThanhToan(me.strStaffId);
                        me.getList_tblKhoiLuong();
                    }
                    else
                        edu.system.alert(me.strErr);

                }, 2000);


            });
        });
        $("#tblKhoiLuong").delegate(".btnViewChiTiet", "click", function () {
            var strId = this.id;
            me.strStaffId = strId;
            me.getList_tblDaThanhToan(strId);
            
            var dt = edu.util.objGetDataInData(strId, me.dtThanhToan, "ID");
            
            edu.util.viewHTMLById("lblDonVi_ChiTiet", dt[0].TENBM);
            edu.util.viewHTMLById("lblHoTen_ChiTiet", dt[0].HOTEN);
            edu.util.viewHTMLById("lblNamHoc_ChiTiet", dt[0].NIENHOC);            
            $("#modalChiTietThanhToan").modal('show');
        });

        $("[id$=chkSelectAll_ThanhToan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDaThanhToan" });
        });
        $('#btnCapNhatThanhToan').click(function () {

            edu.system.confirm("Bạn có chắc chắn cập nhật?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                me.strErr = "";
                var strId = "", strNoiDung = "", strSoTien = "", strNgayThanhToan = "";
                for (var i = 0; i < me.dtTienDaThanhToan.length; i++) {
                    strId =  me.dtTienDaThanhToan[i].ID;
                    strNoiDung = edu.util.getValById("txtNoiDung" + me.dtTienDaThanhToan[i].ID);
                    strSoTien = edu.util.getValById("txtSoTien" + me.dtTienDaThanhToan[i].ID);
                    strNgayThanhToan = edu.util.getValById("txtNgayThanhToan" + me.dtTienDaThanhToan[i].ID);
                   
                    if (strNoiDung != edu.util.returnEmpty(me.dtTienDaThanhToan[i].NOIDUNG)
                        || strSoTien != edu.util.returnEmpty(me.dtTienDaThanhToan[i].SOTIEN)
                        || strNgayThanhToan != edu.util.returnEmpty(me.dtTienDaThanhToan[i].NGAYTHANHTOAN))
                        me.CapNhatTienDaThanhToan(strId, strNoiDung, strSoTien, strNgayThanhToan);
                }
                setTimeout(function () {
                    if (me.strErr == "") {
                        edu.system.alert("Cập nhật thành công");
                        
                        me.getList_tblDaThanhToan(me.strStaffId);
                        me.getList_tblKhoiLuong();
                    }
                    else
                        edu.system.alert(me.strErr);

                }, 2000);


            });
        });
        edu.system.getList_MauImport("zonebtnKLGD", function (addKeyValue) {
            var obj_list = {
                'strNamHoc': edu.util.getValById('drpSchoolYear'),
                'strNhomMonHocId': edu.util.getValById('drpBoMon'),
                'Id': edu.util.getValById('drpBoMon'),
                'strChucNang_Id': edu.system.strChucNang_Id,
            };

            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
        });


      
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_SchoolYear();
        
        
            
        me.getList_drpBoMon();
        

    },
    getList_SchoolYear: function () {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'TKGG_KLGD/GetcboSchoolYear',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId, 
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.genList_SchoolYear(data.Data);
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
    genList_SchoolYear: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "NIENHOC",
                parentId: "",
                name: "NIENHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpSchoolYear"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    
    getList_drpBoMon: function () {
        var me = this;
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        
        var obj_list = {
            'action': 'TKGG_KLGD/GetBoMonDuocPhanCong',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data.length >0 )
                    me.genList_drpBoMon(data.Data);
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
    genList_drpBoMon: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAME",
                code: "",
                avatar: ""
            },
            renderPlace: ["drpBoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_tblKhoiLuong: function () {
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'TKGG_KLGD/GetTienThanhThoanVuotGio',
            'versionAPI': 'v1.0',
            'NhomMonHocID': edu.util.getValById('drpBoMon'),
            'strNamHoc': edu.util.getValById('drpSchoolYear'),  
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.genTable_tblKhoiLuong(data.Data, data.Pager);
                    me.dtThanhToan = data.Data;
                    
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
    genTable_tblKhoiLuong: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);

        var jsonForm = {
            strTable_Id: "tblKhoiLuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.thanhtoangiangday.getList_tblKhoiLuong()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 3, 4,],
            },
            aoColumns: [
                {
                    "mDataProp": "HOTEN"
                },
                 
                {
                    "mDataProp": "TIENVUOTGIODHCQ"
                },
                 
                {
                    "mRender": function (nRow, aData) {
                       
                        var strReturn = "<span>" + aData.TIENDATHANHTOANDHCQ+"</span> </br>";
                        strReturn += '<input type="text" class="inputnhapso" id="txtTienConLaiDHCQ' + aData.ID + '"  style="width:95px;" value="' + edu.util.returnEmpty(aData.TIENCONLAIDHCQ) + '" >';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "TIENVUOTGIODHTC"
                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = "<span>" + aData.TIENDATHANHTOANDHTC + "</span> </br>";
                        strReturn += '<input type="text" class="inputnhapso" id="txtTienConLaiDHTC' + aData.ID + '"  style="width:95px;" value="' + edu.util.returnEmpty(aData.TIENCONLAIDHTC) + '" >';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "TIENVUOTGIOCAOHOC"
                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = "<span>" + aData.TIENDATHANHTOANCAOHOC + "</span> </br>";
                        strReturn += '<input type="text" class="inputnhapso" id="txtTienConLaiCaoHoc' + aData.ID + '"  style="width:95px;" value="' + edu.util.returnEmpty(aData.TIENCONLAICAOHOC) + '" >';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "TIENVUOTGIOTTHTQT"
                },
                {
                    "mRender": function (nRow, aData) {

                        var strReturn = "<span>" + aData.TIENDATHANHTOANTTHTQT + "</span> </br>";
                        strReturn += '<input type="text" class="inputnhapso" id="txtTienConLaiHTQT' + aData.ID + '"  style="width:95px;" value="' + edu.util.returnEmpty(aData.TIENCONLAITTHTQT) + '" >';
                        return strReturn;
                    }
                },
                {
                    "mDataProp": "TONGTIENVUOTGIO"
                },
                {
                    "mDataProp": "TONGTIENDATHANHTOAN"
                },
                {
                    "mDataProp": "TONGTIENCONLAI"
                },
                {
                    "mRender": function (nRow, aData) {


                        return '<input type="text" id="txtNoiDung' + aData.ID + '"  style="width:95px;" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" >';
                    }
                },
                {
                    "mRender": function (nRow, aData) {


                        return '<input type="text" id="txtNgayThanhToan' + aData.ID + '"  style="width:95px;" >';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewChiTiet" id="' + aData.ID + '" title="CT"><i class="fa fa-eye color-active"></i>Chi tiết</a></span>';
                    }

                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },  
    getList_tblDaThanhToan: function (strStaffId) {
        var me = this;
        //--Edit
        var strHocKy = edu.util.getValById('drpSchoolYear') + "_" + edu.util.getValById('drpHocKy');
        var obj_list = {
            'action': 'TKGG_QLKLGD/GetThongTinQuaTrinhThanhToan',
            'versionAPI': 'v1.0',
            'strStaffId': strStaffId, 
            'strNamHoc': edu.util.getValById('drpSchoolYear'), 
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtTienDaThanhToan = data.Data;
                    me.genTable_tblDaThanhToan(data.Data, data.Pager);
                    
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
    genTable_tblDaThanhToan: function (data, iPager) {
        var me = this;
        //$("#lblPhongThi_Tong").html(iPager);
        
        var jsonForm = {
            strTable_Id: "tblDaThanhToan",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1,],
            },
            aoColumns: [
                {
                    "mDataProp": "NAMHOC"
                },
                {

                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtNoiDung' + aData.ID + '"  style="width:125px;" value="' + edu.util.returnEmpty(aData.NOIDUNG) + '" >';
                    }
                },
                {
                    
                      "mRender": function (nRow, aData) {
                          return '<input type="text" class="inputnhapso" id="txtSoTien' + aData.ID + '"  style="width:125px;" value="' + edu.util.returnEmpty(aData.SOTIEN) + '" >';
                    }
                },
                {

                    "mRender": function (nRow, aData) {
                        return '<input type="text" id="txtNgayThanhToan' + aData.ID + '"  style="width:125px;" value="' + edu.util.returnEmpty(aData.NGAYTHANHTOAN) + '" >';
                    }
                },
                {
                    "mDataProp": "MAHEDAOTAO"
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
    SaveThanhToanGiangDay: function (strStaffId, strNoiDung, strSoTienDHCQ, strSoTienDHTC, strCAOHOC, strTTHTQT, strNgayThanhToan) {
        var me = this; 
        
        var obj_list = {
            'action': 'TKGG_QLKLGD/SaveThanhToanGiangDay',
            'versionAPI': 'v1.0',
            'strStaffId': strStaffId,
            'strNoiDung': strNoiDung,
            'strNamHoc': edu.util.getValById('drpSchoolYear'),
            'strSoTienDHCQ': strSoTienDHCQ,
            'strSoTienDHTC': strSoTienDHTC,
            'strCAOHOC': strCAOHOC,
            'strTTHTQT': strTTHTQT,
            'strNgayThanhToan': strNgayThanhToan,
            'strUserId': edu.system.userId,
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.strErr = data.Message;
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                    me.strErr += JSON.stringify(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                me.strErr += JSON.stringify(er);
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
    DeleteTienThanhToan: function (strId) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/DeleteTienThanhToan',
            'versionAPI': 'v1.0',
            'strId': strId,
           
            'strUserId': edu.system.userId,
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {


                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                    me.strErr += JSON.stringify(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                me.strErr += JSON.stringify(er);
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
    CapNhatTienDaThanhToan: function (strId, strNoiDung, strSoTien, strNgayThanhToan) {
        var me = this;

        var obj_list = {
            'action': 'TKGG_QLKLGD/CapNhatTienDaThanhToan',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strNoiDung': strNoiDung,
            'strSoTien': strSoTien,
            'strNgayThanhToan': strNgayThanhToan,
            'strNguoiDung_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    me.strErr = data.Message;
                }
                else {
                    edu.system.alert(obj_list.action + " (er): " + JSON.stringify(data.Message), "w");
                    me.strErr += JSON.stringify(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
                me.strErr += JSON.stringify(er);
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

