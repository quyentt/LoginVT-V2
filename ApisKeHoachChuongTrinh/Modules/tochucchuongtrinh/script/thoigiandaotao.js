/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 23/04/2019
----------------------------------------------*/
function ThoiGianDaoTao() { };
ThoiGianDaoTao.prototype = {
    treenode: '',
    dtTab: '',
    dtThoiGianDaoTao: '',//danh sách học kỳ
    strThoiGianDaoTao_Id: '',

    init: function () {
        var me = this;
        edu.system.page_load();
        me.getList_ThoiGianDaoTao();
        me.getList_NamHoc();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Initial local
        -------------------------------------------*/
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_ThoiGianDaoTao();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $("#btnSave").click(function () {


            if (edu.util.checkValue(me.strThoiGianDaoTao_Id)) {
                me.update_ThoiGianDaoTao();
            }
            else {
                me.save_ThoiGianDaoTao();
            }
        });
        $(".btnReWrite").click(function () {

            if (edu.util.checkValue(me.strThoiGianDaoTao_Id)) {
                me.update_ThoiGianDaoTao();
            }
            else {
                me.save_ThoiGianDaoTao();
            }
            me.rewrite();
        });
        $("#tblThoiGianDaoTao").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strThoiGianDaoTao_Id = strId;
                me.getDetail_ThoiGianDaoTao(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblThoiGianDaoTao");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblThoiGianDaoTao").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThoiGianDaoTao(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThoiGianDaoTao", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThoiGianDaoTao(arrChecked_Id.toString());
            });
        });
        $("#tblThoiGianDaoTao").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblThoiGianDaoTao", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThoiGianDaoTao" });
        });
        $("#btnSearch").click(function () {
            me.getList_ThoiGianDaoTao();
        });
        $("#dropSearch_NamHoc").on("select2:select", function () {
            me.getList_ThoiGianDaoTao();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ThoiGianDaoTao();
            }
        });
        $("#dropNamHoc").on("select", function () {
            var strId = edu.util.getValById("dropNamHoc");
            me.getList_NamHoc();
            $("#dropNamHoc").val(strId).trigger("change");

        });
        $(".btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThoiGianDaoTao", "check");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn năm học cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ThoiGianDaoTao(arrChecked_Id.toString());
            });
        });
        $("[id$=chkSelectAll_ThoiGianDaoTao]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThoiGianDaoTao" });
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.getList_ThoiGianDaoTao();
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_ThoiGianDaoTao");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ThoiGianDaoTao");
    },
    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strThoiGianDaoTao_Id = "";
        edu.util.viewValById("dropNamHoc", edu.util.getValById('dropSearch_NamHoc'));
        edu.util.viewValById("txtHocKy", "");
        edu.util.viewValById("txtDotHoc", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("txtLoaiHocKy", "");
        //var arrId = ["txtHocKy", "txtDotHoc", "dropNamHoc", "txtNgayBatDau", "txtNgayKetThuc", "txtLoaiHocKy"];
        //edu.util.resetValByArrId(arrId);
    },
    /*------------------------------------------
    --Date of created: 22/04/2019
    --Discription: middleware
    ----------------------------------------------*/
    save_ThoiGianDaoTao: function () {
        var me = main_doc.ThoiGianDaoTao;
        var obj_notify = {};
        // check nga bat dau khong duoc lon hon ngay ket thuc
        var strNgayBatDau = edu.util.getValById("txtNgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtNgayKetThuc");
        var check = edu.util.dateCompare(strNgayBatDau, strNgayKetThuc); console.log(check)
        if (check == 1) {
            objNotify = {
                content: "Ngày bắt đầu không được lớn hơn ngày kết thúc!",
                type: "w"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Them_DaoTao_ThoiGianDaoTao',
            

            'strId': '',
            'dHocKy': edu.util.getValById("txtHocKy"),
            'dThang': edu.util.getValById("txtThang"),
            'dDotHoc': edu.util.getValById("txtDotHoc"),
            'strDaoTao_Nam_Id': edu.util.getValById("dropNamHoc"),
            'dLoaiHocKy': edu.util.getValById("txtLoaiHocKy"),
            'dTrangThai': 1,
            'strNgayBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNgayKetThuc"),
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
                        me.getList_ThoiGianDaoTao();
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
    update_ThoiGianDaoTao: function () {
        var me = main_doc.ThoiGianDaoTao;
        var obj_notify = {};
        // check nga bat dau khong duoc lon hon ngay ket thuc
        var strNgayBatDau = edu.util.getValById("txtNgayBatDau");
        var strNgayKetThuc = edu.util.getValById("txtNgayKetThuc");
        var check = edu.util.dateCompare(strNgayBatDau, strNgayKetThuc); console.log(check)
        if (check == 1) {
            objNotify = {
                content: "Ngày bắt đầu không được lớn hơn ngày kết thúc!",
                type: "w"
            }
            edu.system.alertOnModal(objNotify);
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin/Sua_DaoTao_ThoiGianDaoTao',
            

            'strId': me.strThoiGianDaoTao_Id,
            'dHocKy': edu.util.getValById("txtHocKy"),
            'dDotHoc': edu.util.getValById("txtDotHoc"),
            'dThang': edu.util.getValById("txtThang"),
            'strDaoTao_Nam_Id': edu.util.getValById("dropNamHoc"),
            'dLoaiHocKy': edu.util.getValById("txtLoaiHocKy"),
            'dTrangThai': 1,
            'strNgayBatDau': edu.util.getValById("txtNgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txtNgayKetThuc"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strThoiGianDaoTao_Id = me.strThoiGianDaoTao_Id;
                    edu.system.alert("Cập nhật thành công!");
                    me.getList_ThoiGianDaoTao();
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
    getList_ThoiGianDaoTao: function () {
        var me = main_doc.ThoiGianDaoTao;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThoiGianDaoTao/LayDanhSach',
            

            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDAOTAO_NAM_Id': edu.util.getValById("dropSearch_NamHoc"),
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
                    me.genTable_ThoiGianDaoTao(dtResult, iPager);
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
    getDetail_ThoiGianDaoTao: function (strId) {
        var me = main_doc.ThoiGianDaoTao;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_ThoiGianDaoTao/LayChiTiet',
            
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
                        me.viewEdit_ThoiGianDaoTao(data.Data[0]);
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
    delete_ThoiGianDaoTao: function (Ids) {
        var me = main_doc.ThoiGianDaoTao;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ThoiGianDaoTao/Xoa',
            
            'strId': Ids,
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
                me.getList_ThoiGianDaoTao();
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
    genTable_ThoiGianDaoTao: function (data, iPager) {
        var me = main_doc.ThoiGianDaoTao;
        $("#lblThoiGianDaoTao_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblThoiGianDaoTao",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ThoiGianDaoTao.getList_ThoiGianDaoTao()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7,8],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Học kỳ: ' + edu.util.returnEmpty(aData.HOCKY) + "</span><br />";
                //        html += '<span>' + 'Năm học: ' + edu.util.returnEmpty(aData.NAMHOC) + "</span><br />";
                //        html += '<span>' + 'Đợt học: '+ edu.util.returnEmpty(aData.DOTHOC) + "</span><br />";
                //        html += '<span>' + 'Thời gian: ' + edu.util.returnEmpty(aData.NGAYBATDAU) + ' - ' + edu.util.returnEmpty(aData.NGAYKETTHUC)+"</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "HOCKY"
                },
                {
                    "mDataProp": "NAMHOC"
                },
                {
                    "mDataProp": "DOTHOC"
                },
                {
                    "mDataProp": "THANG"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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
    viewEdit_ThoiGianDaoTao: function (data) {
        var me = this;
        var dt = data[0];
        edu.util.viewValById("txtHocKy", data.HOCKY);
        edu.util.viewValById("txtLoaiHocKy", data.LOAIHOCKY);
        edu.util.viewValById("txtDotHoc", data.DOTHOC);
        edu.util.viewValById("dropNamHoc", data.DAOTAO_THOIGIANDAOTAO_NAM_ID);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
        
    },

    /*----------------------------------------------
    --Date of created: 22/04/2019
    --Discription: genCombo NamHoc
    ----------------------------------------------*/
    getList_NamHoc: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_NamHoc/LayDanhSach',
            

            'strTuKhoa': "",
            'strNguoiThucHien_Id': "",
            //'strCanBoNhapDeTai_Id': "",
            'pageIndex': 1,
            'pageSize': 10000000
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
                    me.genCombo_NamHoc(dtResult, iPager);
                }
                else {
                    edu.system.alert("KHCT_NamHoc/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("KHCT_NamHoc/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
   
    genCombo_NamHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                order: "unorder"
            },
            renderPlace: ["dropNamHoc", "dropSearch_NamHoc"],
            type: "",
            title: "Chọn năm học"
        };
        edu.system.loadToCombo_data(obj);
    },

}