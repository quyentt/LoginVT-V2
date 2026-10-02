/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 12/03/2018
----------------------------------------------*/
function NoiDungChuongTrinh() { }
NoiDungChuongTrinh.prototype = {
    dtChuongTrinh: [],
    dtNoiDungChuongTrinh: [],
    strNoiDungChuongTrinh_Id: '',
    strChuongTrinh_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSearch").click(function () {
            me.getList_NoiDungChuongTrinh();
        });
        /*------------------------------------------
        --Discription: [1] Action HoSoLyLich
        --Order: 
        -------------------------------------------*/
        $("#dropSearch_TChucChuongTrinh").on("select2:select", function () {
            me.getList_NoiDungChuongTrinh();

        });
        //$("#btnSearch_NoiDungChuongTrinh_ChuongTrinh").click(function () {
        //    me.getList_ChuongTrinh();
        //});
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NoiDungChuongTrinh();
            }
        });
        /*------------------------------------------
       --Discription: [3] Action KhenThuong
       --Order: 
       -------------------------------------------*/
        
        
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strNoiDungChuongTrinh_Id)) {
                me.update_NoiDungChuongTrinh();
            }
            else {
                me.save_NoiDungChuongTrinh();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strNoiDungChuongTrinh_Id)) {
                me.update_NoiDungChuongTrinh();
            }
            else {
                me.save_NoiDungChuongTrinh();
            }
            me.rewrite();
        });
        $("#tblNoiDungChuongTrinh").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strNoiDungChuongTrinh_Id = strId;
                me.getDetail_NoiDungChuongTrinh(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblNoiDungChuongTrinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblNoiDungChuongTrinh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_NoiDungChuongTrinh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNoiDungChuongTrinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_NoiDungChuongTrinh(arrChecked_Id.toString());
            });
        });
        $("#tblNoiDungChuongTrinh").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblNoiDungChuongTrinh", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNoiDungChuongTrinh" });
        });
        //
        //me.arrValid_NoiDungChuongTrinh = [
        //    //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
        //    { "MA": "dropKhenThuong", "THONGTIN1": "EM" }
        //];
        //edu.system.uploadFiles(["txtThongTinDinhKem"]);
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        //me.getList_ChuongTrinh();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        /*------------------------------------------
        --Discription: [1] Load HoSoLyLich
        -------------------------------------------*/
        me.getList_NoiDungChuongTrinh();
        me.getList_ChuongTrinh();
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_NoiDungChuongTrinh");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_NoiDungChuongTrinh");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strNoiDungChuongTrinh_Id = "";
        edu.util.viewValById("dropChuongTrinh", edu.util.getValById('dropSearch_TChucChuongTrinh'));
        edu.util.viewValById("txtNoiDung", "");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB ChuongTrinh
    -------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = this;

        
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
                'strDaoTao_KhoaDaoTao_Id': "",
                'strDaoTao_HeDaoTao_Id': "",
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
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                order: "unorder"
            },
            renderPlace: ["dropChuongTrinh", "dropSearch_TChucChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML ChuongTrinh
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ChuongTrinh: function (data, iPager) {
        var me = main_doc.NoiDungChuongTrinh;
        me.dtNoiDungChuongTrinh = data;
        edu.util.viewHTMLById("lblNoiDungChuongTrinh_ChuongTrinh_Tong", iPager);

        var jsonForm = {
            strTable_Id: "lblNoiDungChuongTrinh_ChuongTrinh_Tong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NoiDungChuongTrinh.getList_ChuongTrinh()",
                iDataRow: iPager,
                bInfo: false,
                bChange: false,
                bLeft: false
            },
            bHiddenOrder: true,
            arrClassName: ["btnView"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span id="lbl' + aData.ID + '">' + edu.util.returnEmpty(aData.TENCHUONGTRINH) +  "</span><br />";
                        html += '<span>' + edu.util.returnEmpty(aData.MACHUONGTRINH) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    /*------------------------------------------
    --Discription: [2] AcessDB NoiDungChuongTrinh
    -------------------------------------------*/
    save_NoiDungChuongTrinh: function () {
        var me = main_doc.NoiDungChuongTrinh;
        var obj_notify = {};
        //--Edit


        var obj_save = {
            'action': 'KHCT_NoiDungChuongTrinh/ThemMoi',
            

            'strId': '',
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropChuongTrinh"),
            'strNoiDung': edu.util.getValById("txtNoiDung"),
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
                        me.getList_NoiDungChuongTrinh();
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
    update_NoiDungChuongTrinh: function () {
        var me = main_doc.NoiDungChuongTrinh;
        var obj_notify = {};
        //--Edit


        var obj_save = {
            'action': 'KHCT_NoiDungChuongTrinh/CapNhat',
            

            'strId': me.strNoiDungChuongTrinh_Id,
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropChuongTrinh"),
            'strNoiDung': edu.util.getValById("txtNoiDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_NoiDungChuongTrinh();
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
    getList_NoiDungChuongTrinh: function () {
        var me = main_doc.NoiDungChuongTrinh;

        //--Edit
        var obj_list = {
            'action': 'KHCT_NoiDungChuongTrinh/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropSearch_TChucChuongTrinh"),
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
                    me.genTable_NoiDungChuongTrinh(dtResult, iPager);
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
    getDetail_NoiDungChuongTrinh: function (strId) {
        var me = main_doc.NoiDungChuongTrinh;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_NoiDungChuongTrinh/LayChiTiet',
            
            'strId': strId
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_NoiDungChuongTrinh(data.Data[0]);
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
    delete_NoiDungChuongTrinh: function (Ids) {
        var me = main_doc.NoiDungChuongTrinh;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_NoiDungChuongTrinh/Xoa',
            
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
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

                me.getList_NoiDungChuongTrinh();
            },
            error: function (er) {
                
                edu.system.afterComfirm(er);
            },
            type: "POST",
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> UngDung
    --Author: vanhiep
	-------------------------------------------*/
    genTable_NoiDungChuongTrinh: function (data, iPager) {
        var me = main_doc.NoiDungChuongTrinh;
        $("#lblNoiDungChuongTrinh_ChuongTrinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNoiDungChuongTrinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NoiDungChuongTrinh.getList_NoiDungChuongTrinh()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 3, 4],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên chương trình: ' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA) + "</span><br />";
                //        html += '<span>' + 'Nội dung chương trình: ' + edu.util.returnEmpty(aData.NOIDUNG) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_MA"
                },
                {
                    "mDataProp": "NOIDUNG"
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
    viewForm_NoiDungChuongTrinh: function (data) {
        var me = main_doc.NoiDungChuongTrinh;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropChuongTrinh", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("txtNoiDung", data.NOIDUNG);
    },
    getList_CoCauToChuc: function () {
        var me = main_doc.ChucDanh;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genCombo_CoCauToChuc);
    },
    genCombo_CoCauToChuc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearchCoCauToChuc"],
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },
};