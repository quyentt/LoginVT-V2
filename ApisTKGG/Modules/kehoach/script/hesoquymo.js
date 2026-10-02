/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HeSoQuyMo() { };
HeSoQuyMo.prototype = {
    strHeSoQuyMo_Id: '',
    dtHeSoQuyMo: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_HeSoQuyMo();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.LOAIBANG", "dropSearch_PhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropPhamViApDung");
        $("#tblHeSoQuyMo").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtHeSoQuyMo.find(e => e.ID == strId);
            me["strHeSoQuyMo_Id"] = data.ID;
            edu.util.viewValById("dropPhanLoai", data.LOAIBANG_ID);
            edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
            //edu.util.viewValById("lblPhamVi", data.PHAMVIAPDUNG_ID);
            edu.util.viewValById("dropThoiGian", data.THOIGIAN_ID);
            edu.util.viewValById("txtSoBatDau", data.SOBATDAU);
            edu.util.viewValById("txtSoKetThuc", data.SOKETTHUC);
            edu.util.viewValById("txtHeSo", data.HESO);
            $("#myModal_HeSoQuyMo").modal("show");
            $("#lblPhamVi").html(data.PHAMVIAPDUNG_TEN)
        });
        $("#btnAdd_HeSoQuyMo").click(function () {
            var data = {};
            me["strHeSoQuyMo_Id"] = data.ID;
            edu.util.viewValById("dropPhanLoai", data.LOAIBANG_ID);
            edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
            edu.util.viewValById("dropThoiGian", data.THOIGIAN_ID);
            edu.util.viewValById("txtSoBatDau", data.SOBATDAU);
            edu.util.viewValById("txtSoKetThuc", data.SOKETTHUC);
            edu.util.viewValById("txtHeSo", data.HESO);
            $("#myModal_HeSoQuyMo").modal("show");
        });
        $("#btnSave_HeSoQuyMo").click(function () {
            me.save_HeSoQuyMo();
        });
        $("#btnDelete_HeSoQuyMo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHeSoQuyMo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HeSoQuyMo(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_HeSoQuyMo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HeSoQuyMo();
            }
        });
        $('#dropPhamViApDung').on('select2:select', function () {
            me.getList_LoaiApDung();
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGian", "dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HeSoQuyMo: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkkEi4eEDQ4DC4SLg00Li8m',
            'func': 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HeSo_QuyMoSoLuong',
            'iM': edu.system.iM,
            'strId': me.strHeSoQuyMo_Id,
            'strPhamViApDung_Id': edu.system.getValById('dropLoaiApDung'),
            'dHeSo': edu.system.getValById('txtHeSo'),
            'dSoBatDau': edu.system.getValById('txtSoBatDau'),
            'dSoKetThuc': edu.system.getValById('txtSoKetThuc'),
            'strLoaiBang_Id': edu.system.getValById('dropPhamViApDung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeCSQSLh4QNDgMLhIuDTQuLyYP';
            obj_save.func = 'PKG_KLGV_V2_THONGTIN.Sua_KLGD_HeSo_QuyMoSoLuong'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_HeSoQuyMo();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HeSoQuyMo: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkkEi4eEDQ4DC4SLg00Li8m',
            'func': 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HeSo_QuyMoSoLuong',
            'iM': edu.system.iM,
            'strLoaiBang_Id': edu.system.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHeSoQuyMo = dtReRult;
                    me.genTable_HeSoQuyMo(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_HeSoQuyMo: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSQSLh4QNDgMLhIuDTQuLyYP',
            'func': 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HeSo_QuyMoSoLuong',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                
                obj = {
                    title: "",
                    content:  JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HeSoQuyMo();
                });
            },
            contentType: true,
            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_HeSoQuyMo: function (data, iPager) {
        $("#lblHeSoQuyMo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHeSoQuyMo",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.HeSoQuyMo.getList_HeSoQuyMo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIBANG_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "SOBATDAU"
                },
                {
                    "mDataProp": "SOKETTHUC"
                },
                {
                    "mDataProp": "HESO"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getList_LoaiApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_XacNhan_MH/DSA4BRINLiAoGSAiDykgLx4JIC8pBS4vJgPP',
            'func': 'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong',
            'iM': edu.system.iM,
            'strLoaiXacNhan_Id': edu.util.getValById('dropPhamViApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_LoaiApDung(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiApDung: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLoaiApDung"],
            type: "",
            title: "Chọn loại",
        }
        edu.system.loadToCombo_data(obj);
    },
}