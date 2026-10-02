function phanquyenpheduyetdiem() { }
phanquyenpheduyetdiem.prototype = { 
    strNguoiDung_Id: '', 
    strDonViId:'',
    dtNguoiDungDonVi: [],
    dtNguoiDungMucPheDuyet_Diem: [],
    dtNguoiDungMucPheDuyet_NHCH: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load(); 
        me.getList_NguoiDung();  
        $("#tblNguoiDung_NDDV").delegate(".btnPopover_NguoiDung_NDDV", "mouseenter", function () {
            var strId = this.id;
            var obj = this;
            edu.extend.popover_NguoiDung(strId, edu.extend.dtNguoiDung, obj);
        });
        $("#tblNguoiDung_NDDV").delegate(".btnView_NguoiDung", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {                
                me.strNguoiDung_Id = strId;
                me.getDetail_NguoiDung(strId);
                me.getList_NguoiDungDonVi();
                me.getList_DonViChuaPhanQuyen();
                
                edu.util.setOne_BgRow(strId, "tblNguoiDung_NDDV");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNguoiDungDonVi").delegate(".btnViewMucPheDuyet", "click", function () {
            var strId = this.id; 
            
            var dt = edu.util.objGetDataInData(strId, me.dtNguoiDungDonVi, "ID");
            me.strDonViId = dt[0].DONVIID;
            $('#lblMuc_DonVi').html(dt[0].NAME);
            me.toggle_edit_zoneChiTietQuyen();
           // me.viewEdit_PhongThi(dt[0]);

        });
        $(".btnClose").click(function () {
            me.toggle_batdau();
        });
        $("#btnDelete_PhanQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDungDonVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Xoa_NguoiDungDonVi(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_NguoiDungDonVi();
                me.getList_DonViChuaPhanQuyen();
            }, 2000);
        }); 
        $(".btnThem_PhanQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDonViChuaPhanQuyen", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần thêm?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn thêm dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.Them_NguoiDungDonVi(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_NguoiDungDonVi();
                me.getList_DonViChuaPhanQuyen();
            }, 2000);
        }); 
        $("[id$=chkMucPheDuyetDiem_NguoiDung]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblMucPheDuyetDiem_NguoiDung" });
        });
        $("[id$=chkMucPheDuyetNHCH_NguoiDung]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblMucPheDuyetNHCH_NguoiDung" });
        });
        $("[id$=chkSelectAll_DonViChuaPhanQuyen]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDonViChuaPhanQuyen" });
        });
        $("[id$=chkSelectAll_NguoiDungDonVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNguoiDungDonVi" });
        });
        $(".btnExtend_Search").click(function () {           
            me.getList_NguoiDung();
        }); 
        
        $("#txtSearch_TuKhoa_NDDV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDung();
            }
        }); 
        $(".btnThem_Muc_DonVi_PhanQuyen").click(function () {
            
            edu.system.confirm("Bạn có chắc chắn thực hiện?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert #alert_content').html('');
                for (var i = 0; i < me.dtNguoiDungMucPheDuyet_Diem.length; i++) {
                    
                    var strCoQuyen = "0";
                    if ($('#checkPQMucDonVi_Diem' + me.dtNguoiDungMucPheDuyet_Diem[i].ID).is(':checked'))
                        strCoQuyen = "1";
                    me.Them_MucNguoiDungDonVi(me.dtNguoiDungMucPheDuyet_Diem[i].ID, strCoQuyen);
                }
                for (var i = 0; i < me.dtNguoiDungMucPheDuyet_NHCH.length; i++) {

                    var strCoQuyen = "0";
                    if ($('#checkPQMucDonVi_NHCH' + me.dtNguoiDungMucPheDuyet_NHCH[i].ID).is(':checked'))
                        strCoQuyen = "1";
                    me.Them_MucNguoiDungDonVi(me.dtNguoiDungMucPheDuyet_NHCH[i].ID, strCoQuyen);
                }
           });
            setTimeout(function () {
                me.getList_NguoiDungMucPheDuyet_DIEM(); 
                me.getList_NguoiDungMucPheDuyet_NHCH(); 
                me.getList_NguoiDungDonVi();
            }, 2000);
        }); 
    },
    
    /*----------------------------------------------
    --Discription: [1] Access DB/GenHTML - NguoiDung
    --API:  
    ----------------------------------------------*/
    getList_NguoiDung: function () {
        var me = this;
        
        var obj = {
            strTuKhoa: edu.util.getValById("txtSearch_TuKhoa_NDDV"),
            iPageIndex: edu.system.pageIndex_default,
            iPageSize: edu.system.pageSize_default,
            iTrangThai: 1,
            strDonVi_Id: "",
            strVaiTro_Id: "",
            strPhanLoaiDoiTuong: "",
            strCapXuLy_Id: "",
            strTinhThanh_Id: ""
        };
        edu.extend.getList_NguoiDung(obj, "", "", me.genTable_NguoiDung);
        
    },
    getDetail_NguoiDung: function (strId) {
        var me = this;
        edu.util.objGetDataInData(strId, edu.extend.dtNguoiDung, "ID", me.viewForm_NguoiDung);
    },
    viewForm_NguoiDung: function (data) {
        var me = this;
        //view data
        
        edu.util.viewHTMLById("lblNguoiDung_NDDV", data[0].TENDAYDU);
        edu.util.viewHTMLById("lblMuc_NguoiDung", data[0].TENDAYDU);
        
    },
    genTable_NguoiDung: function (data, iPager) {
        var me = main_doc.phanquyenpheduyetdiem;
        edu.util.viewHTMLById("tblNguoiDung_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDung_NDDV",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.phanquyenpheduyetdiem.getList_NguoiDung()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiDung_NDDV", "btnView_NguoiDung"],
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(aData.HINHDAIDIEN);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDAYDU) + "</span><br />";
                        html += '<span class="italic">' + edu.util.returnEmpty(aData.EMAIL) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
         
    },
     
    getList_NguoiDungDonVi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_NguoiDungDonVi_DaPQ',
            'versionAPI': 'v1.0',            
            'strUserId': me.strNguoiDung_Id,  
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDungDonVi = data.Data;
                    
                    me.genList_NguoiDungDonVi(data.Data, data.Pager);
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
    genList_NguoiDungDonVi: function (data, iPager) {
        var me = this;
        $("#lblNguoiDungDonVi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDungDonVi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.phanquyenpheduyetdiem.getList_NguoiDungDonVi()",
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
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
                },
                { 
                    "mRender": function (nRow, aData) {

                        return edu.util.returnEmpty(aData.QUYENDUOCCAP_PHEDUYETNHCH);
                        
                    }
                },
                { 
                    "mRender": function (nRow, aData) {
                      
                        return edu.util.returnEmpty(aData.QUYENDUOCCAP_PHEDUYETDIEM); 
                    }
                }, 
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnViewMucPheDuyet" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i> Sửa</a></span>';
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
    Xoa_NguoiDungDonVi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_ThongTin/Xoa_NguoiDungDonVi',
            'versionAPI': 'v1.0',
            'strId': strIds,
            'strNguoiThucHienId': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
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
    Them_NguoiDungDonVi: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'QLTTN_ThongTin/Them_NguoiDungDonVi',
            'versionAPI': 'v1.0',            
            'strUserId': me.strNguoiDung_Id,
            'strDepartOrganId': strIds,
            'strNguoiThucHienId': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
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
    getList_DonViChuaPhanQuyen: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_NguoiDungDonVi_ChuaPQ',
            'versionAPI': 'v1.0',
            'strUserId': me.strNguoiDung_Id,
            'PageNumber': edu.system.pageIndex_default,
            'ItemPerPage': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                     me.genList_DonViChuaPhanQuyen(data.Data, data.Pager);
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
    genList_DonViChuaPhanQuyen: function (data, iPager) {
        var me = this;
        $("#lblDonViChuaPhanQuyen_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDonViChuaPhanQuyen",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.phanquyenpheduyetdiem.getList_DonViChuaPhanQuyen()",
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
                    "mDataProp": "CODE"
                },
                {
                    "mDataProp": "NAME"
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
    toggle_edit_zoneChiTietQuyen: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneChiTietQuyen");
        
        me.getList_NguoiDungMucPheDuyet_DIEM();
        me.getList_NguoiDungMucPheDuyet_NHCH();
    },  
    toggle_batdau: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneQuyen");
    },
    getList_NguoiDungMucPheDuyet_DIEM: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_NguoiDung_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strUserId': me.strNguoiDung_Id,
            'strLoaiPheDuyet':'PHEDUYETDIEM',
            'strDonViId': me.strDonViId, 
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) { 
                    me.dtNguoiDungMucPheDuyet_Diem = data.Data;
                    me.genList_NguoiDungMucPheDuyet_DIEM(data.Data);
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
    genList_NguoiDungMucPheDuyet_DIEM: function (data) {
        var me = this;
        
        var jsonForm = {
            strTable_Id: "tblMucPheDuyetDiem_NguoiDung",
            aaData: data,            
            sort: true,
            colPos: {
                center: [0, 1]
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        console.log(aData.MUCPHEDUYET_NGUOIDUNGID);
                        if (aData.MUCPHEDUYET_NGUOIDUNGID != null)
                            return '<input type="checkbox" checked id="checkPQMucDonVi_Diem' + aData.ID + '"/>';
                        else
                            return '<input type="checkbox" id="checkPQMucDonVi_Diem' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
     
    },
    getList_NguoiDungMucPheDuyet_NHCH: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'QLTTN_ThongTin/LayDS_NguoiDung_MucPheDuyet',
            'versionAPI': 'v1.0',
            'strUserId': me.strNguoiDung_Id,
            'strLoaiPheDuyet': 'PHEDUYETNHCH',
            'strDonViId': me.strDonViId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtNguoiDungMucPheDuyet_NHCH = data.Data;
                    me.genList_NguoiDungMucPheDuyet_NHCH(data.Data);
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
    genList_NguoiDungMucPheDuyet_NHCH: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblMucPheDuyetNHCH_NguoiDung",
            aaData: data,
            sort: true,
            colPos: {
                center: [0, 1]
            },
            aoColumns: [
                {
                    "mDataProp": "NAME"
                },
                {
                    "mRender": function (nRow, aData) {
                        console.log(aData.MUCPHEDUYET_NGUOIDUNGID);
                        if (aData.MUCPHEDUYET_NGUOIDUNGID != null)
                            return '<input type="checkbox" checked id="checkPQMucDonVi_NHCH' + aData.ID + '"/>';
                        else
                            return '<input type="checkbox" id="checkPQMucDonVi_NHCH' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/

    },
     
    Them_MucNguoiDungDonVi: function (strMucPheDuyetId, strCoQuyen) { 
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'QLTTN_ThongTin/Them_MucNguoiDungDonVi',
            'versionAPI': 'v1.0',
            'strUserId': me.strNguoiDung_Id,
            'strDonViId': me.strDonViId, 
            'strMucPheDuyetId': strMucPheDuyetId,
            'strCoQuyen': strCoQuyen,
            'strNguoiThucHienId': edu.system.userId

        };

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
};