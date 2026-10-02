/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/CoVanLop
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function CoVanLop() { };
CoVanLop.prototype = {
    strCoVanLop_Id: '',
    strId: '',
    treenode: '',
    dtCoVanLop: '',//danh sách cố vấn lớp
    strNhanSu_Id: '',
    dtCCTC_Childs: [],
    dtCCTC_Parents: [],

    init: function () {
        var me = this;
        edu.system.page_load();
        me.getList_CoVanLop();
        me.getList_LopHoc();
        me.getList_CoCauToChuc();
        me.getList_KhoaDaoTao();
        me.getList_HeDaoTao();
        me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao();
        me.getList_GV();
        me.getList_GV_Input();
        me.page_load();
       
        $("#btnRefresh").click(function () {
            me.getList_CoVanLop();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strCoVanLop_Id)) {
                me.update_CoVanLop();
            }
            else {
                me.save_CoVanLop();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strCoVanLop_Id)) {
                me.update_CoVanLop();
            }
            else {
                me.save_CoVanLop();
            }
            me.rewrite();
        });
        $(".btnExtend").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CoVanLop();
            }
        });
        $(".btnExtend_Search").click(function () {
            me.getList_CoVanLop();
        });

        $("#tblCoVanLop").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strCoVanLop_Id = strId;
                me.getDetail_CoVanLop(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblCoVanLop");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblCoVanLop").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_CoVanLop(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoVanLop", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            //edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_CoVanLop(arrChecked_Id.toString());
            });
        });
        $("#tblCoVanLop").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblCoVanLop", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCoVanLop" });
        });
        $("#btnSearch").click(function () {
            me.getList_CoVanLop();
        });
        $("#dropBoMon").on("select2:select", function () {
            me.getList_GV_Input();
        });
        $("#dropSearch_GiangVien").on("select2:select", function () {
            me.getList_CoVanLop();
        });
        $("#dropSearch_LopHoc").on("select2:select", function () {
            me.getList_CoVanLop();
        });
        $("#dropSearch_VaiTro").on("select2:select", function () {
            me.getList_CoVanLop();
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
            me.getList_LopHoc();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_CoVanLop();
            me.getList_LopHoc();
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_LopHoc();
        });
        $("#dropSearch_BoMon").on("select2:select", function () {
            me.getList_GV();
            me.getList_LopHoc();
        });
        $("#dropLopQuanLy").on("select", function () {
            me.getList_LopHoc();
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoVanLop", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn chương trình cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_CoVanLop(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_CoVanLop]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCoVanLop" });
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.VTGV", "dropVaiTro");
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.VTGV", "dropSearch_VaiTro");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_CoVanLop");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_CoVanLop");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strCoVanLop_Id = "";
        edu.util.viewValById("dropBoMon", edu.util.getValById('dropSearch_BoMon'));
        edu.util.viewValById("dropGiangVien", edu.util.getValById('dropSearch_GiangVien'));
        edu.util.viewValById("dropLopQuanLy", edu.util.getValById('dropSearch_LopHoc'));
        edu.util.viewValById("dropVaiTro", edu.util.getValById('dropSearch_VaiTro'));
    },
    
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        //valid data
        //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        //me.arrValid_LopHoc = [
        //    EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        //    { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        //];
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: co van lop
    ----------------------------------------------*/
    save_CoVanLop: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LopQuanLy_CoVan/ThemMoi',
            

            'strId': '',
            'strDaoTao_LopQuanLy_Id': edu.util.getValById("dropLopQuanLy"),
            'strGiangVien_Id': edu.util.getValById("dropGiangVien"),
            'strVaiTro_Id': edu.util.getValById("dropVaiTro"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công!. Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                        
                    }

                    setTimeout(function () {
                        me.getList_CoVanLop();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    update_CoVanLop: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_LopQuanLy_CoVan/CapNhat',
            

            'strId': me.strCoVanLop_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById("dropLopQuanLy"),
            'strGiangVien_Id': edu.util.getValById("dropGiangVien"),
            'strVaiTro_Id': edu.util.getValById("dropVaiTro"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strCoVanLop_Id = me.strCoVanLop_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_CoVanLop();
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CoVanLop: function () {
        var me = main_doc.CoVanLop;

        //--Edit
        var obj_list = {
            'action': 'KHCT_LopQuanLy_CoVan/LayDanhSach',
            
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById("dropSearch_LopHoc"),
            'strGiangVien_Id': edu.util.getValById("dropSearch_GiangVien"),
            'strVaiTro_Id': edu.util.getValById("dropSearch_VaiTro"),
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
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
                    me.genTable_CoVanLop(dtResult, iPager);
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
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_CoVanLop: function (strId) {
        var me = main_doc.CoVanLop;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_LopQuanLy_CoVan/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_CoVanLop(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,
            
            contentType: true,
            
            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CoVanLop: function (Ids) {
        var me = main_doc.CoVanLop;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_LopQuanLy_CoVan/Xoa',
            
            'strIds': Ids,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_CoVanLop();
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_CoVanLop: function (data, iPager) {
        var me = main_doc.CoVanLop;
        $("#lblCoVanLop_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCoVanLop",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CoVanLop.getList_CoVanLop()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 5, 6],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Giảng viên: ' + edu.util.returnEmpty(aData.GIANGVIEN_HODEM) + ' ' + edu.util.returnEmpty(aData.GIANGVIEN_TEN) +"</span><br />";
                //        html += '<span>' + 'Vai trò: ' + edu.util.returnEmpty(aData.VAITRO_TEN) + "</span><br />";
                //        html += '<span>' + 'Lớp: ' + edu.util.returnEmpty(aData.DAOTAO_LOPQUANLY_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //},
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span>' + edu.util.returnEmpty(aData.GIANGVIEN_HODEM) + ' ' + edu.util.returnEmpty(aData.GIANGVIEN_TEN) + ' - ' + edu.util.returnEmpty(aData.GIANGVIEN_MASO) +  "</span><br />";
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkOne' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        
    },
    viewForm_CoVanLop: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropBoMon", data.DAOTAO_COCAUTOCHUC_ID);
        edu.util.viewValById("dropGiangVien", data.GIANGVIEN_ID);
        edu.util.viewValById("dropLopQuanLy", data.DAOTAO_LOPQUANLY_ID);
        edu.util.viewValById("dropVaiTro", data.VAITRO_ID);
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: lop quan ly
    ----------------------------------------------*/
    getList_LopHoc: function () {
        var me = main_doc.CoVanLop;

        //--Edit
        var obj_list = {
            'action': 'KHCT_LopQuanLy/LayDanhSach',
            

            'strTuKhoa': "",
            'strDaoTao_CoSoDaoTao_Id': "",
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strDaoTao_Nganh_Id': "",
            'strDaoTao_LoaiLop_Id': "",
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 10000
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
                    me.genCombo_LopHoc(dtResult, iPager);
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
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LopHoc: function (data) {
        //var jsonNS = $.parseJSON(localStorage.dataNhanSu_Combo);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: ""
            },
            renderPlace: ["dropLopQuanLy", "dropSearch_LopHoc"],
            type: "",
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB BoMon
    -------------------------------------------*/
    getList_CoCauToChuc: function () {
        console.log(222222222);
        var me = main_doc.CoVanLop;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropBoMon", "dropSearch_BoMon"],
            type: "",
            title: "Chọn bộ môn"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB giang vien
    -------------------------------------------*/
    getList_GV: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_BoMon"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genCombo_GV(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genCombo_GV: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                }
            },
            renderPlace: ["dropSearch_GiangVien"],
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_GV_Input: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropSearch_CapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropSearch_KhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropBoMon"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dt_HS = data.Data;
                    me.genCombo_GV_Input(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
                
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genCombo_GV_Input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (row, aData) {
                    return aData.HODEM + " " + aData.TEN + " - " + aData.MASO;
                }
            },
            renderPlace: ["dropGiangVien"],
            title: "Chọn giảng viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.CoVanLop;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (data) {
        var me = main_doc.CoVanLop;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = main_doc.CoVanLop;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (data) {
        var me = main_doc.CoVanLop;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropKhoaDaoTao", "dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = main_doc.CoVanLop;

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinh(dtResult);
                }
                else {
                    edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_ToChucChuongTrinh/LayDanhSach (ex): " + JSON.stringify(er), "w");
                
            },
            type: 'GET',
            action: 'KHCT_ToChucChuongTrinh/LayDanhSach',
            
            contentType: true,
            
            data: {
                'strTuKhoa': "",
                'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
                'strDaoTao_N_CN_Id': "",
                'strDaoTao_KhoaQuanLy_Id': "",
                'strDaoTao_ToChucCT_Cha_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinh: function (data) {
        var me = main_doc.CoVanLop;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "MACHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropToChucCT", "dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },
}