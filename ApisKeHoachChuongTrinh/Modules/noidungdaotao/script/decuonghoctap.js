/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/ChuongTinh
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function DeCuongHocTap() { };
DeCuongHocTap.prototype = {
    strDeCuongHocTap_Id: '',
    strId: '',
    treenode: '',
    dtTab: '',
    dtDeCuongHocTap: '',//danh sach de cuong hoc tap

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_DeCuongHocTap();
        me.getList_HeDaoTao();
        me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao();
        me.getList_HocPhan();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnRefresh").click(function () {
            me.getList_DeCuongHocTap();
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
            if (edu.util.checkValue(me.strDeCuongHocTap_Id)) {
                me.update_DeCuongHocTap();
            }
            else {
                me.save_DeCuongHocTap();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strDeCuongHocTap_Id)) {
                me.update_DeCuongHocTap();
            }
            else {
                me.save_DeCuongHocTap();
            }
            me.rewrite();
        });
        $("#tblDeCuongHocTap").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strDeCuongHocTap_Id = strId;
                me.getDetail_DeCuongHocTap(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblDeCuongHocTap");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDeCuongHocTap").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeCuongHocTap(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSearch").click(function () {
            me.getList_DeCuongHocTap("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DeCuongHocTap("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));

            }
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
            me.getList_DeCuongHocTap("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
            me.getList_DeCuongHocTap("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {

            me.getList_DeCuongHocTap("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_HocPhan_ChuongTrinh").on("select2:select", function () {
            me.getList_DeCuongHocTap("", edu.util.getValById("txtSearch_TuKhoa"), edu.util.getValById("dropSearch_HeDaoTao"), edu.util.getValById("dropSearch_KhoaDaoTao", edu.util.getValById("dropSearch_ChuongTrinh"), edu.util.getValById("btnSearch_TCCT")));
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();

        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();

        });
        $("#dropSearch_ChuongTrinh").on("select2:select", function () {
            me.getList_HocPhan();

        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDeCuongHocTap", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_DeCuongHocTap(arrChecked_Id.toString());
            });
        });
        $("#tblDeCuongHocTap").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblDeCuongHocTap", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDeCuongHocTap" });
        });
        //
        me.arrValid_DeCuongHocTap = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            { "MA": "dropChucDanh", "THONGTIN1": "EM" }
        ];
        //toggle_input_ChuongTrinh: function () {
        //    console.log(11111);
        //    edu.util.toggle_overide("zone-bus", "zone_input_ChuongTrinh");
        //},
        //toggle_list_ChuongTrinh: function () {
        //    edu.util.toggle_overide("zone-bus", "zone_list_ChuongTrinh");
        //},
        edu.util.viewValById("dropToChucCT", edu.util.getValById("dropSearch_ChuongTrinh"));
        edu.util.viewValById("dropHocPhan", edu.util.getValById("dropSearch_HocPhan_ChuongTrinh"));
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_DeCuongHocTap");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_DeCuongHocTap");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDeCuongHocTap_Id = "";
        edu.util.viewValById("dropToChucCT", edu.util.getValById('dropSearch_ChuongTrinh'));
        edu.util.viewValById("dropHocPhan", edu.util.getValById('dropSearch_HocPhan_ChuongTrinh'));
        edu.util.viewValById("txtNoiDung", "");
        edu.util.viewValById("txtMoTa", "");
    },
    /*----------------------------------------------
    --Date of created: 22/04/2019
    ----------------------------------------------*/
    

    save_DeCuongHocTap: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_DeCuongHocTap/ThemMoi',
            

            'strId': '',
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropToChucCT"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropHocPhan"),
            'strMoTa': edu.util.getValById("txtMoTa"),
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
                            //me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                        
                    }

                    setTimeout(function () {
                        me.getList_DeCuongHocTap();
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

    update_DeCuongHocTap: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_DeCuongHocTap/CapNhat',
            

            'strId': me.strDeCuongHocTap_Id,
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropToChucCT"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropHocPhan"),
            'strMoTa': edu.util.getValById("txtMoTa"),
            'strNoiDung': edu.util.getValById("txtNoiDung"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDeCuongHocTap_Id = me.strDeCuongHocTap_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_DeCuongHocTap();
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

    getList_DeCuongHocTap: function () {
        var me = main_doc.DeCuongHocTap;

        //--Edit
        var obj_list = {
            'action': 'KHCT_DeCuongHocTap/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_HocPhan_Id': edu.util.getValById("dropSearch_HocPhan_ChuongTrinh"),
            'strDaoTao_ToChucCT_Id': edu.util.getValById("dropSearch_ChuongTrinh"),
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
                    me.genTable_DeCuongHocTap(dtResult, iPager);
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
    getDetail_DeCuongHocTap: function (strId) {
        var me = main_doc.DeCuongHocTap;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_DeCuongHocTap/LayChiTiet',
            
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
                        me.viewForm_DeCuongHocTap(data.Data[0]);
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
    delete_DeCuongHocTap: function (Ids) {
        var me = main_doc.DeCuongHocTap;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_DeCuongHocTap/Xoa',
            
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
                
                me.getList_DeCuongHocTap();
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
    genTable_DeCuongHocTap: function (data, iPager) {
        var me = main_doc.DeCuongHocTap;
        $("#lblDeCuongHocTap_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeCuongHocTap",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DeCuongHocTap.getList_DeCuongHocTap()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 4, 5],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Nội dung: ' + edu.util.returnEmpty(aData.NOIDUNG) + "</span><br />";
                //        html += '<span>' + 'Học phần: ' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + "</span><br />";
                //        html += '<span>' + 'Chương trình: ' + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
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
        
        /*III. Callback*/
    },
    viewForm_DeCuongHocTap: function (data) {
        var me = main_doc.DeCuongHocTap;
        //call popup --Edit
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropToChucCT", data.DAOTAO_TOCHUCCHUONGTRINH_ID);
        edu.util.viewValById("dropHocPhan", data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("txtNoiDung", data.NOIDUNG);
        edu.util.viewValById("txtMoTa", data.MOTA);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.DeCuongHocTap;

        
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
        var me = main_doc.DeCuongHocTap;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "MAHEDAOTAO",
                order: "unorder"
            },
            renderPlace: ["dropHeDaoTao", "dropSearch_HeDaoTao"],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = main_doc.DeCuongHocTap;

        
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
        var me = main_doc.DeCuongHocTap;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropCT_KhoaDaoTao", "dropSearch_KhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_ChuongTrinh: function () {
        var me = main_doc.DeCuongHocTap;

        
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
        var me = main_doc.DeCuongHocTap;
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

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> hoc phan - chuong trinh
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan: function () {
        var me = main_doc.DeCuongHocTap;

        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',
            

            'strTuKhoa': '',
            'strDaoTao_MonHoc_Id': "",
            'strThuocBoMon_Id': "",
            'strThuocTinhHocPhan_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 100000000
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtHocPhan_ChuongTrinh = dtResult;
                    }
                    me.genCombo_HocPhan_ChuongTrinh(dtResult);
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
    genCombo_HocPhan_ChuongTrinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                order: "unorder"
            },
            renderPlace: ["dropHocPhan", "dropSearch_HocPhan_ChuongTrinh"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
}