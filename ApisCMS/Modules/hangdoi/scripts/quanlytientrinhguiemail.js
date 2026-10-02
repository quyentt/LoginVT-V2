function quanlytientrinhguiemail() { };
quanlytientrinhguiemail.prototype = {
    dtHangDoiGuiEmail: [],
    strHangDoiGuiEmail_Id: '', 
    init: function () {
        var me = this;
        me.page_load();
        /*------------------------------------------
        --Action: 
        -------------------------------------------*/
        $(".btnSearch_TienTrinhGuiEmail").click(function () {
            me.getList_TienTrinhGuiEmail();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TienTrinhGuiEmail();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        }); 
                $("[id$=chkSelectAll_TienTrinhGuiEmail]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTienTrinhGuiEmail" });
        });
        $(".btn_ThucHienGuiEmail").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTienTrinhGuiEmail", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần gửi");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn gửi?");
            $("#btnYes").click(function (e) {
                me.strErr = "";
                var items = '';
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    items += arrChecked_Id[i] + ',';                                 
                }
                items = items.replace(/Course/g, "");
                items = items.substr(0, items.lastIndexOf(",")); 
            
                me.ThucHienGuiEmail(items);      

            });
            setTimeout(function () {
                me.getList_TienTrinhGuiEmail(); 
            }, 2000);
        });
        $("#tblTienTrinhGuiEmail").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strHangDoiGuiEmail_Id = strId;
            var dt = edu.util.objGetDataInData(me.strHangDoiGuiEmail_Id, me.dtHangDoiGuiEmail, "ID");
            if (dt.length > 0) {
                me.viewEdit_ChiTietHangDoiGuiEmail(dt[0]);
            }
            else {
                edu.system.alert("Cột dữ liệu chọn không đúng");
            }
            
        });
        
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load(); 
        me.getList_drpCauTrucNoiDungGuiEmail();
         
        me.getList_drpCauTrucNoiDungGuiEmail(); 
    },
    
    /*------------------------------------------
    --Discription: Access DB KyThi
    --ULR: Modules
    -------------------------------------------*/ 
           
    getList_TienTrinhGuiEmail: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_TienIch/LayDS_TienTrinhGuiEmail',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiTao_Id': "",            
            'strTuNgay': edu.util.getValById("txtTuNgay"),
            'strDenNgay': edu.util.getValById("txtDenNgay"),                        
            'strDaGui': edu.util.getValById("drpTrangThaiGuiMail"),
            'strCauTrucNoiDungGuiEmailId': edu.util.getValById("drpCauTrucNoiDungGuiEmail"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHangDoiGuiEmail = data.Data;
                    me.genTable_TienTrinhGuiEmail(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    genTable_TienTrinhGuiEmail: function (data, iPager) {
        var me = this;
        $("#lblTienTrinhGuiEmail_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTienTrinhGuiEmail",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlytientrinhguiemail.getList_TienTrinhGuiEmail()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 1]                
            },
            aoColumns: [ 
                {
                    
                     "mRender": function (nRow, aData) {
                         return '<span><a class="btn btnEdit" style="font-size: 18px;" id="' + aData.ID + '" title="' + (aData.MAILTO).replace(String.fromCharCode(4), "@") + '"> ' + (aData.MAILTO).replace(String.fromCharCode(4), "@") + '</a></span>';
                    }
                },
                {
                    "mDataProp": "NOIDUNGEMAIL"
                },
                {
                    "mDataProp": "NGAYGUI"
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        var strTrangThai = "";                        
                        if (aData.DAGUI == "1") {
                            strTrangThai = "Thành công";
                        }
                        if (aData.DAGUI == "0") {
                            strTrangThai = "Chưa gửi";
                        }
                        if (aData.DAGUI == "2") {
                            strTrangThai = "<span style='color: red'> Gửi lỗi: </span> <br />" + aData.LOIGUIMAIL;
                        }
                        return '<span>' + strTrangThai + '</span>';

                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"  />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_drpCauTrucNoiDungGuiEmail: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_TienIch/LayDS_CauTrucNoiDungGuiEmail',
            'versionAPI': 'v1.0',
            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000,

        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.gen_drpCauTrucNoiDungGuiEmail(data.Data);

                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    gen_drpCauTrucNoiDungGuiEmail: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MA",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["drpCauTrucNoiDungGuiEmail"],
            title: "--Chọn cấu trúc--"
        };
        edu.system.loadToCombo_data(obj);
    }, 
    viewEdit_ChiTietHangDoiGuiEmail: function (data) {
        var me = this;
        //call popup --Edit       
        me.rewrite();
        me.toggle_edit();        
        edu.util.viewHTMLById("lblTieuDe", data.MAILSUBJECT);
        edu.util.viewHTMLById("lblNoiDung", data.NOIDUNGEMAIL); 
        
        edu.util.viewHTMLById("lblNgayGui", data.NGAYGUI); 
        var strTrangThai = "";
        if (data.DAGUI == "1") {
            strTrangThai = "Thành công";
        }
        if (data.DAGUI == "0") {
            strTrangThai = "Chưa gửi";
        }
        if (data.DAGUI == "2") {
            strTrangThai = "<span style='color: red'> Gửi lỗi: </span> <br />" + data.LOIGUIMAIL;
        }
      

        edu.util.viewHTMLById("lblTrangThai", strTrangThai); 
        me.getList_LichSuGuiEmail();
        
    },
    rewrite: function () {
        var me = this;
        edu.util.viewHTMLById("lblTieuDe", "");
        edu.util.viewHTMLById("lblNoiDung", ""); 

    },
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    ThucHienGuiEmail: function (strHangDoiGuiEmail_Ids) {
        var me = this;
        var obj_list = {
            'action': 'CMS_TienIch/ThucHienGuiEmail',
            'versionAPI': 'v1.0',
            'ArrstrId': strHangDoiGuiEmail_Ids,         
            'strHanhDong':'GUILAI',
            'strNguoiThucHien_Id': edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    var strErr = "OK";
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    getList_LichSuGuiEmail: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_TienIch/LayDS_LichSuGuiEmailBy',
            'versionAPI': 'v1.0',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strNguoiTao_Id': "",             
            'strHangDoiGuiEmail_Id': me.strHangDoiGuiEmail_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                     
                    me.genTable_LichSuGuiEmail(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
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
    genTable_LichSuGuiEmail: function (data, iPager) {
        var me = this;
        $("#lbltblLichSuGuiEmail_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLichSuGuiEmail",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.quanlytientrinhguiemail.genTable_LichSuGuiEmail()",
                iDataRow: iPager,
                bInfo: false,
                bLeft: false
            },
            sort: true,
            colPos: {
                center: [0, 1]
            },
            aoColumns: [
                {

                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btnEdit" style="font-size: 18px;" id="' + aData.ID + '" title="' + (aData.MAILTO).replace(String.fromCharCode(4), "@") + '"> ' + (aData.MAILTO).replace(String.fromCharCode(4), "@") + '</a></span>';
                    }
                },
                {
                    "mDataProp": "NOIDUNGEMAIL"
                },
                {
                    "mDataProp": "NGAYGUI"
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        var strTrangThai = "";
                        if (aData.DAGUI == "1") {
                            strTrangThai = "Thành công";
                        }
                        if (aData.DAGUI == "0") {
                            strTrangThai = "Chưa gửi";
                        }
                        if (aData.DAGUI == "2") {
                            strTrangThai = "<span style='color: red'> Gửi lỗi: </span> <br />" + aData.LOIGUIMAIL;
                        }
                        return '<span>' + strTrangThai + '</span>';

                    }
                } 
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    }, 
     
}