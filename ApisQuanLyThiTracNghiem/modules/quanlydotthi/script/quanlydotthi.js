function quanlydotthi() { };
quanlydotthi.prototype = {
    dtDotThi: [],    
    strDotThiId: '',
    dtDotThiXLT:[],
    strErr:'',
    init: function () {
        var me = this;        
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DotThi();
            }
        });   
        $("[id$=chkSelectAll_DotThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDotThi" });
        });
        $(".btnSearch_DotThi").click(function () {
            me.getList_DotThi();
        });
        $("#drpTrangThai").on("select2:select", function () {
            me.getList_DotThi();
        });
        $("#tblDotThi").delegate(".btnChiTietDotThi", "click", function () {
            var strId = this.id;
            me.strDotThiId = strId;
            var dt = edu.util.objGetDataInData(strId, me.dtDotThi, "ID");  
            me.rewrite_DotThi();
            edu.util.toggle_overide("zone-bus", "zoneDotThi");
            
            me.viewEdit_DotThi(dt[0]); 

        });
        
        $("#btnDelete_DotThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDotThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DotThi(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_DotThi();
            }, 2000);
        }); 
        $("#btnAdd_DotThi").click(function () {
            me.strDotThiId = ''; 
            me.rewrite_DotThi();  
            edu.util.toggle_overide("zone-bus", "zoneDotThi");
        });
        $("#btnDongBo_DotThi").click(function () {
            
            edu.util.toggle_overide("zone-bus", "zoneDongBoDotThi");
        });
        $("#btnSave_DotThi").click(function () {
            var arrValid_HS = [
                //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...             
                { "MA": "txtTenDotThi", "THONGTIN1": "EM" }, 
            ];

            var valid = edu.util.validInputForm(arrValid_HS);
            if (!valid) {
                return;
            }
            var strTenDotThi = edu.util.getValById('txtTenDotThi');
            var strHocKy = edu.util.getValById('txtHocKy');
            var strNamHoc = edu.util.getValById('txtNamHoc');
            var strLoaiThi = edu.util.getValById('drpLoaiThi');
            var strSoDiemLe = edu.util.getValById('txtSoDiemLe');
            var strThangDiem = edu.util.getValById('txtThangDiem');
            var strThangThai = edu.util.getValById('drpTrangThai_Edit');
            me.save_DotThi(strTenDotThi, strHocKy, strNamHoc, strLoaiThi, strSoDiemLe, strThangDiem,  strThangThai);
        });     
        $("#dropSearch_ThoiGian").on("select2:select", function () {
            me.getList_tblImportDotThi();
        });
        $("#btnAdd_ImportDotThi").click(function () {
            
            var arrChecked_Id = edu.util.getArrCheckedIds("tblImportDotThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần import?");
                return;
            }
            me.strErr = '';
            var strSoDiemLe = '';
            var strThangDiem = '';
            for (var i = 0; i < arrChecked_Id.length; i++) {
                strSoDiemLe = edu.util.getValById('txtSoDiemLe' + arrChecked_Id[i]);
                strThangDiem = edu.util.getValById('txtThangDiem' + arrChecked_Id[i]);
                if (strSoDiemLe == '' || strThangDiem == '') {
                    edu.system.alert('Bạn chưa nhập thông tin điểm lẻ/thang điểm');
                    return;
                }
            }
            edu.system.confirm("Bạn có chắc chắn import dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.strErr = '';
                $('#myModalAlert #alert_content').html('');
                me.strDotThiId = '';
                var strTenDotThi = "";
                var strHocKy = "";
                var strNamHoc = "";
                var strLoaiThi = '1';
                var strThangThai = '1';
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    strSoDiemLe = edu.util.getValById('txtSoDiemLe' + arrChecked_Id[i]);
                    strThangDiem = edu.util.getValById('txtThangDiem' + arrChecked_Id[i]);
                    var dt = edu.util.objGetDataInData(arrChecked_Id[i], me.dtDotThiXLT, "ID");  
                    strTenDotThi = dt[0].TEN;
                    strHocKy = $("#dropSearch_ThoiGian option:selected").text().trim();
                    strNamHoc = $("#dropSearch_ThoiGian option:selected").text().trim();
                     
                    if (strNamHoc.length > 9)
                        strNamHoc = strNamHoc.substring(0, 9);
                    me.save_Import_ThongTinDotThi(arrChecked_Id[i], strTenDotThi, strHocKy, strNamHoc, strLoaiThi, strSoDiemLe, strThangDiem,  strThangThai);
                    
                     
                }
            });

            setTimeout(function () {
                if (me.strErr == '')
                    edu.system.alert('Thực hiện thành công');
                else
                    edu.system.alert(me.strErr);
                me.getList_DotThi();
            }, 2000);
        }); 
    },
    page_load: function () {        
        var me = this;
        edu.system.page_load(); 
        me.getList_DotThi();
        me.getList_dropSearch_ThoiGian();
     

    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    rewrite_DotThi: function () {
        var me = this;
      
        edu.util.viewValById("txtTenDotThi", "");
        edu.util.viewValById("txtHocKy", "");
        edu.util.viewValById("txtNamHoc", "");
        edu.util.viewValById("txtSoDiemLe", "");
        edu.util.viewValById("txtThangDiem", ""); 
        $("#drpTrangThai_Edit").val("").change();
        $("#drpLoaiThi").val("").change();
    },
    toggle_edit_DotThi: function (zonean,zonehien) {
        var me = this;
        edu.util.toggle_overide(zonean, zonehien);
    },  

    viewEdit_DotThi: function (dt) {
        var me = this; 
        edu.util.viewValById("txtTenDotThi", dt.NAME);  
        edu.util.viewValById("txtHocKy", dt.SEMESTER);  
        edu.util.viewValById("txtNamHoc", dt.SCHOOLYEAR);  
        edu.util.viewValById("txtSoDiemLe", dt.SODIEMLE);  
        edu.util.viewValById("txtThangDiem", dt.THANGDIEM);    

        $("#drpTrangThai_Edit").val(dt.STATUS).change();
        $("#drpLoaiThi").val(dt.EXAMSCHEDULETYPE).change();
    },
    getList_DotThi: function () {
        var me = this; 
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_ThonTinDotThi',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strStatus': edu.util.getValById('drpTrangThai'), 
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDotThi = data.Data;
                    me.genTable_DotThi(data.Data, data.Pager);
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
    genTable_DotThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDotThi",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.quanlydotthi.getList_DotThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0,2,3,4,5,6],
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"
                },
                {
                    "mDataProp": "SCHOOLYEAR"
                },
                {
                    "mDataProp": "SEMESTER"
                },
                {
                    "mDataProp": "SODIEMLE"
                },
                {
                    "mDataProp": "THANGDIEM"
                },
                {
                    "mRender": function (nRow, aData) {
                        var strThangThai = aData.EXAMSCHEDULETYPE == "1" ? "Thi thật" : "Thi thử";
                        return '<span>' + strThangThai + '</span>';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        var strThangThai = aData.STATUS == "1" ? "Hiện" : "Ẩn";
                        return '<span>'+strThangThai+'</span>';
                    }

                }, 
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTietDotThi" id="' + aData.ID + '" title="Chi tiết đợt thi"><i class="fa fa-eye color-active"></i>Chi tiết đợt thi</a></span>';
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
    save_DotThi: function (strTenDotThi, strHocKy, strNamHoc, strLoaiThi, strSoDiemLe, strThangDiem, strThangThai) {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_ThongTin/Them_ThongTinDotThi',
            'versionAPI': 'v1.0',
            'strId': "",
            'strName': strTenDotThi,
            'strSemester': strHocKy,
            'strSchoolyear': strNamHoc,
            'strExamscheduleType': strLoaiThi,
            'strSoDiemLe': strSoDiemLe,
            'strThangDiem': strThangDiem,
            'strStatus': strThangThai, 
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (me.strDotThiId != "") {
            obj_save.action = 'QLTTN_ThongTin/Sua_ThongTinDotThi';
            obj_save.strId = me.strDotThiId;
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.strDotThiId = data.ID;
                    me.getList_DotThi();
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DotThi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_ThongTin/Xoa_ThongTinDotThi',
            'versionAPI': 'v1.0',
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
                    //me.getList_KyThi();
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
    getList_dropSearch_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genList_dropSearch_ThoiGian(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genList_dropSearch_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_tblImportDotThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_QuanLyThi/LayDanhSach_DotThi',
            'type': 'GET',
            'strHinhThucThi_Id': '',
            'strDiem_ThanhPhanDiem_Id': '',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDotThiXLT = data.Data;
                    me.genTable_tblImportDotThi(data.Data, data.Pager);
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
    genTable_tblImportDotThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblImportDotThi",
            aaData: data,
            sort: true,
            bPaginate: {
                strFuntionName: "main_doc.quanlydotthi.getList_tblImportDotThi()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            colPos: {
                center: [0, 1 ],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                }, 
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtSoDiemLe' + aData.ID + '"  class="form-control" />';
                    }

                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type ="text" id="txtThangDiem' + aData.ID + '"  class="form-control" />';
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
    save_Import_ThongTinDotThi: function (strId, strTenDotThi, strHocKy, strNamHoc, strLoaiThi, strSoDiemLe, strThangDiem, strThangThai) {
        var me = this;
        var obj_save = {
            'action': 'QLTTN_ThongTin/Import_ThongTinDotThi',
            'versionAPI': 'v1.0',
            'strId': strId,
            'strName': strTenDotThi,
            'strSemester': strHocKy,
            'strSchoolyear': strNamHoc,
            'strExamscheduleType': strLoaiThi,
            'strSoDiemLe': strSoDiemLe,
            'strThangDiem': strThangDiem,
            'strStatus': strThangThai,
            'strNguoiThucHien_Id': edu.system.userId
        }; 
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                     
                }
                else {
                    
                    me.strErr += data.Message;
                    
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
                me.strErr += er;
            },
            type: "POST",
            action: obj_save.action,
            versionAPI: obj_save.versionAPI,
            contentType: true,
            authen: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


}

