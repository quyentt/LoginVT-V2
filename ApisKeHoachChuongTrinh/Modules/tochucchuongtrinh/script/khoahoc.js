/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/KhoaDaoTao
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KhoaDaoTao() { };
KhoaDaoTao.prototype = {
    strKhoaDaoTao_Id: '',
    treenode: '',
    dtTab: '',
    dtKhoaDaoTao: '',//danh sách khóa đào tạo
    strId: '',

    init: function () {
        var me = this;
        edu.system.page_load();
        me.page_load();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.COSODAOTAO", "dropHP_CoSoDaoTao");
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $(".btnAdd").click(function () {
            me.rewrite();
            console.log(1);
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {
            if (edu.util.checkValue(me.strKhoaDaoTao_Id)) {
                me.update_KhoaDaoTao();
            }
            else {
                me.save_KhoaDaoTao();
            }
        });
        $(".btnReWrite").click(function () {
            if (edu.util.checkValue(me.strKhoaDaoTao_Id)) {
                me.update_KhoaDaoTao();
            }
            else {
                me.save_KhoaDaoTao();
            }
            me.rewrite();
        });
        $("#tblKhoaDaoTao").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strKhoaDaoTao_Id = strId;
                me.getDetail_KhoaDaoTao(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblKhoaDaoTao");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKhoaDaoTao").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KhoaDaoTao(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoaDaoTao", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            //edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_KhoaDaoTao(arrChecked_Id.toString());
            });
        });
        $("#tblKhoaDaoTao").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblKhoaDaoTao", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhoaDaoTao" });
        });
        $("#btnSearch").click(function () {
            me.getList_KhoaDaoTao();
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KhoaDaoTao();
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKhoaDaoTao", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn khóa đào tạo cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_KhoaDaoTao(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_ChuongTrinh]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhoaDaoTao" });
        });
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KhoaDaoTao");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_KhoaDaoTao");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKhoaDaoTao_Id = "";
        edu.util.viewValById("dropHeDaoTao", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("txtKH_Ma", "");
        edu.util.viewValById("txtKH_Ten", "");
        edu.util.viewValById("txtKH_NamNhapHoc", "");
        edu.util.viewValById("txtKH_NamKetThucTheoKeHoach", "");
        edu.util.viewValById("txtKH_SoNamDaoTao", "");
        //var arrId = ["txtKH_Ma", "txtKH_Ten", "dropHeDaoTao", "txtKH_NamNhapHoc", "txtKH_NamKetThucTheoKeHoach"];
        //edu.util.resetValByArrId(arrId);
    },
    /*----------------------------------------------
    --Date of created: 10/04/2018
    --Discription: middleware
    ----------------------------------------------*/
    /*----------------------------------------------
    --Date of created: 10/04/2018
    --Discription:  
    --API:
    ----------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.util.toggle("box-sub-search");
        edu.util.focus("txtSearch_TuKhoa");
        /*------------------------------------------
        --Discription: [1] Load KhoaDaoTao
        -------------------------------------------*/
        setTimeout(function () {
            me.getList_KhoaDaoTao();
        }, 50);
    },
    save_KhoaDaoTao: function () {
        var me = main_doc.KhoaDaoTao;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eCikuIAUgLhUgLgPP',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_KhoaDaoTao',
            'iM': edu.system.iM,
            

            'strId': '',
            'strTenKhoa': edu.util.getValById("txtKH_Ten"),
            'strMaKhoa': edu.util.getValById("txtKH_Ma"),
            'strNamNhapHoc': edu.util.getValById("txtKH_NamNhapHoc"),
            'strNamKetThucTheoKeHoach': edu.util.getValById("txtKH_NamKetThucTheoKeHoach"),
            'strSoNamDaoTao': edu.util.getValById("txtKH_SoNamDaoTao"),
            'dTrangThai': 1,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropHeDaoTao"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById("dropHP_CoSoDaoTao"),
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
                        me.getList_KhoaDaoTao();
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

    update_KhoaDaoTao: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4KKS4gBSAuFSAu',
            'func': 'pkg_kehoach_thongtin.Sua_DaoTao_KhoaDaoTao',
            'iM': edu.system.iM,
            'strId': me.strKhoaDaoTao_Id,
            'strTenKhoa': edu.util.getValById("txtKH_Ten"),
            'strMaKhoa': edu.util.getValById("txtKH_Ma"),
            'strNamNhapHoc': edu.util.getValById("txtKH_NamNhapHoc"),
            'strNamKetThucTheoKeHoach': edu.util.getValById("txtKH_NamKetThucTheoKeHoach"),
            'strSoNamDaoTao': edu.util.getValById("txtKH_SoNamDaoTao"),
            'dTrangThai': 1,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropHeDaoTao"),
            'strDaoTao_CoSoDaoTao_Id': edu.util.getValById("dropHP_CoSoDaoTao"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKhoaDaoTao_Id = me.strKhoaDaoTao_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_KhoaDaoTao();
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

    getList_KhoaDaoTao: function () {
        var me = main_doc.KhoaDaoTao;

        //--Edit
        var obj_list = {
            'action': 'KHCT_KhoaDaoTao/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strDaoTao_CoSoDaoTao_Id': "",
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
                    me.genTable_KhoaDaoTao(dtResult, iPager);
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
    getDetail_KhoaDaoTao: function (strId) {
        var me = main_doc.KhoaDaoTao;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_KhoaDaoTao/LayChiTiet',
            
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
                        me.viewForm_KhoaDaoTao(data.Data[0]);
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
    delete_KhoaDaoTao: function (Ids) {
        var me = main_doc.KhoaDaoTao;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_KhoaDaoTao/Xoa',
            
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
                me.getList_KhoaDaoTao();
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
    genTable_KhoaDaoTao: function (data, iPager) {
        var me = main_doc.KhoaDaoTao;
        $("#lblKhoaHoc_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoaDaoTao",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KhoaDaoTao.getList_KhoaDaoTao()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 4, 5, 6, 7],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Mã khóa học: ' + edu.util.returnEmpty(aData.MAKHOA) + "</span><br />";
                //        html += '<span>' + 'Tên khóa học: ' + edu.util.returnEmpty(aData.TENKHOA) + "</span><br />";
                //        html += '<span>' + 'Hệ đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_HEDAOTAO_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //},
                {
                    "mDataProp": "MAKHOA"
                },
                {
                    "mDataProp": "TENKHOA"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "NAMNHAPHOC"
                },
                {
                    "mDataProp": "NAMKETTHUCTHEOKEHOACH"
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
    viewForm_KhoaDaoTao: function (data) {
        var me = this;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txtKH_Ten", data.TENKHOA);
        edu.util.viewValById("txtKH_Ma", data.MAKHOA);
        edu.util.viewValById("txtKH_NamNhapHoc", data.NAMNHAPHOC);
        edu.util.viewValById("txtKH_NamKetThucTheoKeHoach", data.NAMKETTHUCTHEOKEHOACH);
        edu.util.viewValById("txtKH_SoNamDaoTao", data.SONAMDAOTAO);
        edu.util.viewValById("dropHeDaoTao", data.DAOTAO_HEDAOTAO_ID);
        edu.util.viewValById("dropHP_CoSoDaoTao", data.DAOTAO_HEDAOTAO_TEN);
    },

    getList_HeDaoTao: function () {
        var me = main_doc.KhoaDaoTao;

        
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
        var me = main_doc.KhoaDaoTao;
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
};