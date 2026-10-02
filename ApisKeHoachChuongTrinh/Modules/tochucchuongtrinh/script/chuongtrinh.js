/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 22/04/2019
--Input: 
--Output:
--API URL: KHCT/ChuongTrinh
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function ChuongTrinh() { };
ChuongTrinh.prototype = {
    treenode: '',
    strChuongTrinh_Id: '',
    dtTab: '',
    dtChuongTrinh: [],
    dtChuongTrinh_Full: [],
    strDaoTao_ToChucCT_Cha_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //me.getList_ChuongTrinh();
        me.getList_KhoaDaoTao();
        me.getList_CoCauToChuc();
        me.getList_ChuongTrinhCha();
        me.getList_HeDaoTao();
        me.getList_CoSoDaoTao();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("btnRefresh").click(function () {
            me.getList_ChuongTrinh();
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
            
            if (edu.util.checkValue(me.strChuongTrinh_Id)) {
                me.update_ChuongTrinh();
            }
            else {
                me.save_ChuongTrinh();
            }
        });
        $(".btnReWrite").click(function () {

            if (edu.util.checkValue(me.strChuongTrinh_Id)) {
                me.update_ChuongTrinh();
            }
            else {
                me.save_ChuongTrinh();
            }
            me.rewrite();
        });
        
        $("#tblChuongTrinh").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form();
                me.strChuongTrinh_Id = strId;
                me.getDetail_ChuongTrinh(strId, constant.setting.ACTION.EDIT);
                edu.util.setOne_BgRow(strId, "tblChuongTrinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblChuongTrinh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strId = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strId);
            if (edu.util.checkValue(strId)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ChuongTrinh(strId);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSearch_TCCT").click(function () {
            me.getList_ChuongTrinh();
        });
        $("#btnDelete").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuongTrinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn tham số cần xóa!");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn muốn xóa dữ liệu?");
            $("#btnYes").click(function (e) {
                me.delete_ChuongTrinh(arrChecked_Id.toString());
            });
        });
        $("#tblChuongTrinh").delegate(".checkOne", "click", function () {
            edu.util.checkedOne_BgRow(this, { table_id: "tblChuongTrinh", regexp: /checkX/g, });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChuongTrinh" });
        });

        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_ChuongTrinh();
            }
        });
        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinh();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinh();
        });
        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTaoKT();
        });
        $("#dropCT_KhoaQuanLy").on("select", function () {
            var strId = edu.util.getValById("dropCT_KhoaQuanLy");
            me.getList_CoCauToChuc();
            $("#dropCT_KhoaQuanLy").val(strId).trigger("change");

        });
        me.arrValid_ChuongTrinh = [
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
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.NCN", "dropCT_DaoTao_N_CN", "", function (data) {
            var me = main_doc.ChuongTrinh;
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENCHUONGTRINH",
                    code: "",
                    mRender: function (nRow, aData) {
                        return aData.TEN + " - " + aData.MA;
                    }
                },
                renderPlace: ["dropCT_DaoTao_N_CN"],
                title: "Chọn chương trình cha"
            };
            edu.system.loadToCombo_data(obj);
        });
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.NGANHNGHE", "dropNganhTuyenSinh", "", function (data) {
            var me = main_doc.ChuongTrinh;
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TENCHUONGTRINH",
                    code: "",
                    mRender: function (nRow, aData) {
                        return aData.TEN + " - " + aData.MA;
                    }
                },
                renderPlace: ["dropNganhTuyenSinh"],
                title: "Chọn ngành nghề"
            };
            edu.system.loadToCombo_data(obj);
        });
        edu.system.loadToCombo_DanhMucDuLieu("KHCT.LOAICHUONGTRINH", "drop_LoaiChuongTrinh");
        edu.system.loadToCombo_DanhMucDuLieu("DAOTAO.CHUONGTRINH.TRINHDO", "dropCT_TrinhDo");

        $("#btnAdd_KeThua").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuongTrinh", "checkOne");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#myModalKeThua").modal("show");
        });
        $("#btnSave_KeThua").click(function () {
            var strKhoa = edu.util.getValById("dropKhoaDaoTao");
            if (strKhoa == "") return;
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuongTrinh", "checkOne");
            $('#myModalKeThua').modal('hide');
            edu.system.confirm("Bạn có muốn kế thừa <span style='color: red'>" + arrChecked_Id.length + "</span> chương trình sang khóa  <span style='color: blue'>" + $("#dropKhoaDaoTao option:selected").text() + " </span> không?");
            $("#btnYes").click(function (e) {
                //edu.system.alert('<div id="zoneprocessXXXX"></div>');
                //edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                arrChecked_Id.forEach(e => { me.keThua_ChuongTrinh(e)});
            });
        });
    },
    page_load: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        

        me.getList_ChuongTrinh();
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_ChuongTrinh");
    },
    toggle_form: function () {
        console.log(2);
        edu.util.toggle_overide("zone-bus", "zone_input_ChuongTrinh");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    },

    rewrite: function () {
        //reset id
        var me = main_doc.ChuongTrinh;
        //
        me.strChuongTrinh_Id = "";
        //edu.util.viewValById("dropBacDaoTao", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("dropCT_KhoaDaoTao", edu.util.getValById('dropSearch_KhoaDaoTao'));
        edu.util.viewValById("dropCT_NganhTuyenSinh", "");
        edu.util.viewValById("txtCT_PhanLoai_N_CN", "");
        edu.util.viewValById("dropCT_DaoTao_N_CN", "");
        edu.util.viewValById("dropNganhTuyenSinh", "");
        edu.util.viewValById("txtCT_Ten", "");
        edu.util.viewValById("txtCT_TenTA", "");
        edu.util.viewValById("txtCT_Ma", "");
        edu.util.viewValById("txtCT_TongSoTinChi", "");
        edu.util.viewValById("txtCT_ThoiGianDaoTao", "");
        edu.util.viewValById("txtCT_MoTa", "");
        edu.util.viewValById("dropCT_KhoaQuanLy", "");
        edu.util.viewValById("dropCT_CoSoDaoTao", "");
        edu.util.viewValById("dropCT_TrinhDo", "");

    },

    save_ChuongTrinh: function () {
        var me = main_doc.ChuongTrinh;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/FSkkLB4FIC4VIC4eFS4CKTQiAhUP',
            'func': 'pkg_kehoach_thongtin.Them_DaoTao_ToChucCT',
            'iM': edu.system.iM,
            'strId': '',
            'strNganhTuyenSinh_Id': edu.util.getValById("dropNganhTuyenSinh") || null,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropCT_KhoaDaoTao") || null,
            'strPhanLoai_N_CN': edu.util.getValById("txtCT_PhanLoai_N_CN"),
            'strDaoTao_N_CN_Id': edu.util.getValById("dropCT_DaoTao_N_CN") || null,
            'strTenChuongTrinh': edu.util.getValById("txtCT_Ten"),
            'strMaChuongTrinh': edu.util.getValById("txtCT_Ma"),
            'strLoaiChuongTrinh_Id': edu.util.getValById("drop_LoaiChuongTrinh") || null,
            'dTongSoTinChiQuyDinh': edu.util.getValById("txtCT_TongSoTinChi") || null,
            'dThoiGianDaoTao': edu.util.getValById('txtCT_ThoiGianDaoTao') || null,
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById("dropCT_KhoaQuanLy") || null,
            'strDaoTao_ToChucCT_Cha_Id': edu.util.getValById("dropCT_ChuongTrinhCha") || null,
            'strMoTa': edu.util.getValById("txtCT_MoTa"),
            'strTenChuongTrinhTA': edu.util.getValById("txtCT_TenTA"),
            'strDaoTao_CoSoDaoTao_Id': edu.system.getValById('dropCT_CoSoDaoTao') || null,
            'strTrinhDo_Id': edu.util.getValById("dropCT_TrinhDo") || null,
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
                        me.getList_ChuongTrinh();
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
    update_ChuongTrinh: function () {
        var me = main_doc.ChuongTrinh;
        //--Edit
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/EjQgHgUgLhUgLh4VLgIpNCICFQPP',
            'func': 'pkg_kehoach_thongtin.Sua_DaoTao_ToChucCT',
            'iM': edu.system.iM,
            'strId': me.strChuongTrinh_Id,
            'strNganhTuyenSinh_Id': edu.util.getValById("dropNganhTuyenSinh") || null,
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropCT_KhoaDaoTao") || null,
            'strPhanLoai_N_CN': edu.util.getValById("txtCT_PhanLoai_N_CN"),
            'strDaoTao_N_CN_Id': edu.util.getValById("dropCT_DaoTao_N_CN") || null,
            'strTenChuongTrinh': edu.util.getValById("txtCT_Ten"),
            'strMaChuongTrinh': edu.util.getValById("txtCT_Ma"),
            'strLoaiChuongTrinh_Id': edu.util.getValById("drop_LoaiChuongTrinh") || null,
            'dTongSoTinChiQuyDinh': edu.util.getValById("txtCT_TongSoTinChi") || null,
            'dThoiGianDaoTao': edu.util.getValById('txtCT_ThoiGianDaoTao') || null,
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById("dropCT_KhoaQuanLy") || null,
            'strDaoTao_ToChucCT_Cha_Id': edu.util.getValById("dropCT_ChuongTrinhCha") || null,
            'strMoTa': edu.util.getValById("txtCT_MoTa"),
            'strTenChuongTrinhTA': edu.util.getValById("txtCT_TenTA"),
            'strDaoTao_CoSoDaoTao_Id': edu.system.getValById('dropCT_CoSoDaoTao') || null,
            'strTrinhDo_Id': edu.util.getValById("dropCT_TrinhDo") || null,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                    var strChuongTrinh_Id = me.strChuongTrinh_Id;
                    me.getList_ChuongTrinh();
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
    getList_ChuongTrinh: function () {
        var me = main_doc.ChuongTrinh;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ToChucChuongTrinh/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strDaoTao_N_CN_Id': "",
            'strDaoTao_KhoaQuanLy_Id': "",
            'strDaoTao_ToChucCT_Cha_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genTable_ChuongTrinh(dtResult, iPager);
                    me["dtChuongTrinhChon"] = dtResult;
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
    getDetail_ChuongTrinh: function (strId) {
        var me = main_doc.ChuongTrinh;
        //view data --Edit
        var obj_detail = {
            'action': 'KHCT_ToChucChuongTrinh/LayChiTiet',
            
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
                        me.viewForm_ChuongTrinh(data.Data[0]);
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
    getDetail_ChuongTrinh_Full: function (strId, strAction) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtChuongTrinh, "ID", me.viewEdit_ChuongTrinh);
    },
    delete_ChuongTrinh: function (Ids) {
        var me = main_doc.ChuongTrinh;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_ToChucChuongTrinh/Xoa',
            
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
                
                me.getList_ChuongTrinh();
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
    genTable_ChuongTrinh: function (data, iPager) {
        var me = main_doc.ChuongTrinh;
        $("#lblChuongTrinh_Tong").html(iPager);
        //edu.util.viewHTMLById("lblChuongTrinh_Tong", data.length);
        var jsonForm = {
            strTable_Id: "tblChuongTrinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.ChuongTrinh.getList_ChuongTrinh()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            colPos: {
                center: [0],
                fix: [0]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        var html = '';
                //        html += '<span>' + 'Tên chương trình: ' + edu.util.returnEmpty(aData.TENCHUONGTRINH) + "</span><br />";
                //        html += '<span>' + 'Khóa đào tạo: ' + edu.util.returnEmpty(aData.DAOTAO_KHOADAOTAO_TEN) + "</span><br />";
                //        html += '<span>' + 'Khoa quản lý: '+ edu.util.returnEmpty(aData.DAOTAO_KHOAQUANLY_TEN) + "</span><br />";
                //        html += '<span class="pull-right">';
                //        html += '<a class="btn btn-default btn-circle btnDelete" id="delete_' + aData.ID + '" href="#" title="Delete"><i class="fa fa-trash color-active"></i></a>';
                //        html += '</span>';
                //        return html;
                //    }
                //}
                {
                    "mDataProp": "MACHUONGTRINH"
                },
                {
                    "mDataProp": "TENCHUONGTRINH"
                },
                {
                    "mDataProp": "TENCHUONGTRINHTA"
                },
                {
                    "mDataProp": "LOAICHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "NGANHTUYENSINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_N_CN_TEN"
                },
                {
                    "mDataProp": "TONGSOTINCHIQUYDINH"
                }, 
                {
                    "mDataProp": "DSLOPQUANLY"
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
    viewForm_ChuongTrinh: function (data) {
        var me = main_doc.ChuongTrinh;
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("dropNganhTuyenSinh", data.NGANHTUYENSINH_ID);
        edu.util.viewValById("dropCT_KhoaDaoTao", data.DAOTAO_KHOADAOTAO_ID);
        edu.util.viewValById("txtCT_PhanLoai_N_CN", data.PHANLOAI_N_CN);
        edu.util.viewValById("dropCT_DaoTao_N_CN", data.DAOTAO_N_CN_ID);
        edu.util.viewValById("txtCT_Ten", data.TENCHUONGTRINH);
        edu.util.viewValById("txtCT_TenTA", data.TENCHUONGTRINHTA);
        edu.util.viewValById("txtCT_Ma", data.MACHUONGTRINH);
        edu.util.viewValById("txtCT_TongSoTinChi", data.TONGSOTINCHIQUYDINH);
        edu.util.viewValById("txtCT_ThoiGianDaoTao", data.THOIGIANDAOTAO);
        edu.util.viewValById("dropCT_KhoaQuanLy", data.DAOTAO_KHOAQUANLY_ID);
        edu.util.viewValById("dropCT_ChuongTrinhCha", data.DAOTAO_TOCHUCCT_CHA_ID);
        edu.util.viewValById("txtCT_MoTa", data.MOTA);
        edu.util.viewValById("drop_LoaiChuongTrinh", data.LOAICHUONGTRINH_ID);
        edu.util.viewValById("dropCT_CoSoDaoTao", data.COSODAOTAO_ID);
        edu.util.viewValById("dropCT_TrinhDo", data.TrinhDo_Id || data.TRINHDO_ID || "");
        //$("#dropCT_ChuongTrinhCha").val(data[0].CHUCNANGCHA_ID).trigger("change");
    },
    viewEdit_ChuongTrinh: function (data) {
        var me = this;
        var dt = data[0];
        edu.util.viewValById("dropNganhTuyenSinh", data[0].NGANHTUYENSINH_ID);
        edu.util.viewValById("dropCT_KhoaDaoTao", data[0].DAOTAO_KHOADAOTAO_ID);
        edu.util.viewValById("txtCT_PhanLoai_N_CN", data[0].PHANLOAI_N_CN);
        edu.util.viewValById("dropCT_DaoTao_N_CN", data[0].DAOTAO_N_CN_ID);
        edu.util.viewValById("txtCT_Ten", data[0].TENCHUONGTRINH);
        edu.util.viewValById("txtCT_Ma", data[0].MACHUONGTRINH);
        edu.util.viewValById("txtCT_TongSoTinChi", data[0].TONGSOTINCHIQUYDINH);
        edu.util.viewValById("dropCT_KhoaQuanLy", data[0].DAOTAO_KHOAQUANLY_ID);
        edu.util.viewValById("dropCT_ChuongTrinhCha", data[0].DAOTAO_TOCHUCCT_CHA_ID);
        edu.util.viewValById("txtCT_MoTa", data[0].MOTA);
        edu.util.viewValById("dropCT_CoSoDaoTao", data.COSODAOTAO_ID);
    },
    getList_ChuongTrinhCha: function () {
        var me = main_doc.ChuongTrinh;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ToChucChuongTrinh/LayDanhSach',
            

            'strTuKhoa': "",
            'strDaoTao_KhoaDaoTao_Id': "",
            'strDaoTao_HeDaoTao_Id': "",
            'strDaoTao_N_CN_Id': "",
            'strDaoTao_KhoaQuanLy_Id': "",
            'strDaoTao_ToChucCT_Cha_Id': "",
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000
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
                    me.genCombo_ChuongTrinhCha(dtResult, iPager);
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
    genCombo_ChuongTrinhCha: function (data) {
        var me = main_doc.ChuongTrinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
            },
            renderPlace: ["dropCT_ChuongTrinhCha"],
            title: "Chọn chương trình cha"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = main_doc.ChuongTrinh;

        
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
        var me = main_doc.ChuongTrinh;
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
        var me = main_doc.ChuongTrinh;
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
        var me = main_doc.ChuongTrinh;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropCT_KhoaDaoTao", "dropSearch_KhoaDaoTao", "dropKhoaDaoTao" ],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KhoaDaoTaoKT: function () {
        var me = main_doc.ChuongTrinh;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTaoKT(dtResult);
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
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropHeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTaoKT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "MAKHOA",
                order: "unorder"
            },
            renderPlace: ["dropKhoaDaoTao"],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> CCTC
    --Author: duyentt
	-------------------------------------------*/
    getList_CoCauToChuc: function () {
        var me = main_doc.ChuongTrinh;
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
            renderPlace: ["dropCT_KhoaQuanLy"],
            title: "Chọn cơ cấu tổ chức"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HocPhan_baiHoc
    --ULR:  Modules
    -------------------------------------------*/
    keThua_ChuongTrinh: function (strDaoTao_CT_Nguon_Id) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'KHCT_ToChucChuongTrinh/KeThua',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_KhoaHoc_Nguon_Id': me.dtChuongTrinhChon.find(e => e.ID == strDaoTao_CT_Nguon_Id).DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_CT_Nguon_Id': strDaoTao_CT_Nguon_Id,
            'strDaoTao_KhoaHoc_Id': edu.util.getValById("dropKhoaDaoTao"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công", "w");
                }
                else {
                    edu.system.alert(obj.obj_save + ": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(obj.obj_save + " (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_CoSoDaoTao: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_ThongTin_MH/DSA4BRIFIC4VIC4eAi4SLgUgLhUgLgPP',
            'func': 'pkg_kehoach_thongtin.LayDSDaoTao_CoSoDaoTao',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_CoSoDaoTao(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_CoSoDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropCT_CoSoDaoTao"],
            title: "Chọn Đối tác/cơ sở đào tạo"
        };
        edu.system.loadToCombo_data(obj);

    },
};