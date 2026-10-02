/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CoCauToChuc() { };
CoCauToChuc.prototype = {
    strCoCauToChuc_Id: '',
    dtCoCauToChuc: [],

    init: function () {
        var me = this;
        console.log(22222222);
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        $("#txtSearch_NgayXem").val(edu.util.dateToday());
        me.getList_CoCauToChuc();
        // Đồng bộ nguồn dữ liệu với trang khởi tạo CCTC (cocautochuc.js)
        // Loại cơ cấu tổ chức: NS.LCTC
        edu.system.loadToCombo_DanhMucDuLieu("NS.LCTC", "dropSearch_LoaiDonVi,dropLoaiDonVi");

        $("#tblCoCauToChuc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtCoCauToChuc.find(e => e.ID == strId);
            me["strCoCauToChuc_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("dropLoaiDonVi", data.DAOTAO_LOAICOCAUTOCHUC_ID);
            edu.util.viewValById("txtTenVietTat", edu.util.returnEmpty(data.GHICHU));
            edu.util.viewValById("txtNgayHieuLuc", "");
            edu.util.viewValById("txtNgayHetHieuLuc", "");
            edu.util.viewValById("dropTrangThai", edu.util.returnEmpty(data.TRANGTHAI) || 1);
            $("#modalDonVi").modal("show");
        });
        $("#btnAdd_CoCauToChuc").click(function () {
            var data = {};
            me["strCoCauToChuc_Id"] = data.ID;
            edu.util.viewValById("txtMa", "");
            edu.util.viewValById("txtTen", "");
            edu.util.viewValById("dropLoaiDonVi", "");
            edu.util.viewValById("txtTenVietTat", "");
            edu.util.viewValById("txtNgayHieuLuc", "");
            edu.util.viewValById("txtNgayHetHieuLuc", "");
            edu.util.viewValById("dropTrangThai", 1);
            $("#modalDonVi").modal("show");
            // Thuộc cơ cấu (cha)
            edu.util.viewValById("dropDonVi_Cha", "");
        });
        $("#btnSave_CoCauToChuc").click(function () {
            me.save_CoCauToChuc();
        });
        $("#btnDelete_CoCauToChuc").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_CoCauToChuc(me.strCoCauToChuc_Id);
            });
        });

        $("#btnSearch").click(function () {
            me.getList_CoCauToChuc();
        });
        // Từ khóa lọc client-side (giống cocautochuc.js)
        $("#txtSearch_TuKhoa").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#treesjs_cocautochuc ul li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            }).css("color", "red");
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CoCauToChuc();
            }
        });
        $('#dropSearch_LoaiDonVi').on('select2:select', function () {
            me.getList_CoCauToChuc();
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIVKS4oBiggLxUuLyYJLjEKDQPP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "THOIGIAN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropThoiGian", "dropSearch_ThoiGian"],
                        type: "",
                        title: "Chọn thời gian",
                    })
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
    getList_KeHoachTongHop: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHhUuLyYJLjEKKS4oDTQuLyYP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKhoiLuong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'dHieuLuc': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KeHoachTongHop"],
                        type: "",
                        title: "Chọn kế hoạch tổng hợp",
                    })
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
    getList_KeHoachChiTiet: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgokCS4gIikCKSgVKCQ1',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_KeHoachChiTiet',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strKLGD_TongHopKhoiLuong_Id': edu.system.getValById('dropSearch_KeHoachTongHop'),
            'strCheDoApDung_Id': edu.system.getValById('dropAAAA'),
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'strTuNgay': edu.system.getValById('txtAAAA'),
            'strDenNgay': edu.system.getValById('txtAAAA'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KeHoachChiTiet"],
                        type: "",
                        title: "Chọn kế hoạch chi tiết",
                    })
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CoCauToChuc: function () {
        var me = this;
        var obj_notify = {};
        // Đồng bộ theo NS_CoCauToChuc (giống cocautochuc.js)
        var isUpdate = edu.util.checkValue(me.strCoCauToChuc_Id);
        var obj_save = {
            action: isUpdate ? 'NS_CoCauToChuc/CapNhat' : 'NS_CoCauToChuc/ThemMoi',

            strTen: edu.system.getValById('txtTen'),
            strMa: edu.system.getValById('txtMa'),
            strDaoTao_Loai_Id: edu.system.getValById('dropLoaiDonVi'),
            dThuTu: 1,
            dTrangThai: edu.system.getValById('dropTrangThai') || 1,
            strDaoTao_CoCau_Cha_Id: edu.system.getValById('dropDonVi_Cha'),
            // Không có field ghi chú riêng trong UI v2 → tạm dùng "Tên viết tắt" làm ghi chú.
            strGhiChu: edu.system.getValById('txtTenVietTat'),
            strNguoiThucHien_Id: edu.system.userId,
            strId: isUpdate ? me.strCoCauToChuc_Id : ""
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert(isUpdate ? "Cập nhật thành công!" : "Thêm mới thành công!");
                    me.getList_CoCauToChuc();
                    $("#modalDonVi").modal("hide");
                } else {
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
            fakedb: []
        }, false, false, false, null);
    },
    getList_CoCauToChuc: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            action: 'NS_CoCauToChuc/LayDanhSach',
            dTrangThai: edu.system.getValById('dropSearch_TrangThai') || 1,
            strLoaiCoCauToChuc_Id: edu.system.getValById('dropSearch_LoaiDonVi'),
            strCoCauToChucCha_Id: ""
        };

        edu.system.makeRequest({
            success: function (data) {
                console.log("Kết quả trả về từ backend:", data);
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtCoCauToChuc = dtResult;
                    me.genTable_CoCauToChuc(dtResult, iPager);
                } else {
                    edu.system.alert(obj_list.action + ": " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    delete_CoCauToChuc: function (Ids) {
        var me = this;
        var obj_delete = {
            action: 'NS_HoSo_V2/Xoa_DaoTao_CoCauToChuc',
            strId: me.strCoCauToChuc_Id,
            strNguoiThucHien_Id: edu.system.userId
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.afterComfirm({ title: "", content: "Xóa dữ liệu thành công!", code: "" });
                    me.getList_CoCauToChuc();
                    $("#modalDonVi").modal("hide");
                } else {
                    edu.system.afterComfirm({ title: "", content: data.Message, code: "w" });
                }
            },
            error: function (er) {
                edu.system.afterComfirm({ title: "", content: JSON.stringify(er), code: "w" });
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CoCauToChuc: function (data, iPager) {
        var me = this;
        console.log("Dữ liệu danh sách đơn vị hành chính:", data);
        edu.util.viewHTMLById("lblCoCauToChuc_Tong", data.length);
        edu.system.loadToCombo_data({
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: ""
            },
            renderPlace: ["dropDonVi_Cha", "dropDonVi_ChaNew"],
            type: "",
            title: "Chọn cơ cấu tổ chức cha",
        })
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "DAOTAO_COCAUTOCHUC_CHA_ID",
                name: "TEN",
                code: "MA"
            },
            renderPlaces: ["treesjs_cocautochuc"],
            style: "fa fa-institution color-active",
            splitString: 1000,
        };
        edu.system.loadToTreejs_data(obj);
        $('#treesjs_cocautochuc').on("select_node.jstree", function (e, data) {
            var strId = data.node.id;
            console.log(111111);
            //$(".btnOpenDelete").show();
            //$(".zoneOpenNew").hide();
            var data = me.dtCoCauToChuc.find(e => e.ID == strId);
            me["strCoCauToChuc_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("dropLoaiDonVi", data.DAOTAO_LOAICOCAUTOCHUC_ID);
            edu.util.viewValById("txtTenVietTat", edu.util.returnEmpty(data.GHICHU));
            edu.util.viewValById("txtNgayHieuLuc", "");
            edu.util.viewValById("txtNgayHetHieuLuc", "");
            edu.util.viewValById("dropTrangThai", edu.util.returnEmpty(data.TRANGTHAI) || 1);
            $("#modalDonVi").modal("show");
            // Thuộc cơ cấu (cha)
            edu.util.viewValById("dropDonVi_Cha", data.DAOTAO_COCAUTOCHUC_CHA_ID);
        });
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_QuanHe: function () {
        var me = this;
        var obj_notify = {};
        if (!edu.system.getValById('dropDonVi_Cha')) return;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/FSkkLB4CLjMkHg4zJh4TJC0gNSguLwPP',
            'func': 'PKG_CORE_HOSONHANSU_03.Them_Core_Org_Relation',
            'iM': edu.system.iM,
            'strId': me.strQuanHe_Id,

            'strParent_Org_Id': edu.system.getValById('dropDonVi_Cha'),
            'strChild_Org_Id': me.strCoCauToChuc_Id,
            'strRelation_Type_Code': edu.system.getValById('dropLoaiQuanHe_Cha'),
            'dIs_Active': edu.system.getValById('dropTrangThai_Cha'),
            'strStart_Date': edu.system.getValById('txtNgayHieuLuc_Cha'),
            'strEnd_Date': edu.system.getValById('txtNgayHetHieuLuc_Cha'),
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu3_MH/EjQgHgIuMyQeDjMmHhMkLSA1KC4v';
            obj_save.func = 'PKG_CORE_HOSONHANSU_03.Sua_Core_Org_Relation'
            
        }
        if ($('#modalQuanHe').hasClass('show')) {
            obj_save.strParent_Org_Id = edu.system.getValById('dropDonVi_ChaNew');
            obj_save.strRelation_Type_Code = edu.system.getValById('dropLoaiQuanHe_ChaNew');
            obj_save.dIs_Active = edu.system.getValById('dropTrangThai_ChaNew');
            obj_save.strStart_Date = edu.system.getValById('txtNgayHieuLuc_ChaNew');
            obj_save.strEnd_Date = edu.system.getValById('txtNgayHetHieuLuc_ChaNew');
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
                    me.getList_QuanHe();
                    me.getList_CoCauToChuc();
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
    getList_QuanHe: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/DSA4BRICLjMkHg4zJh4TJC0gNSguLwPP',
            'func': 'PKG_CORE_HOSONHANSU_03.LayDSCore_Org_Relation',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': me.strCoCauToChuc_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtQuanHe"] = data.Data;
                    me.genTable_QuanHe(data.Data);
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
    delete_QuanHe: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu3_MH/GS4gHgIuMyQeDjMmHhMkLSA1KC4v',
            'func': 'PKG_CORE_HOSONHANSU_03.Xoa_Core_Org_Relation',
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
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_QuanHe();
                    me.getList_CoCauToChuc();
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
    genTable_QuanHe: function (data, iPager) {
        var me = this;
        $("#lblQuanHe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuanHe",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.CoCauToChuc.getList_QuanHe()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.PARENT_ORG_NAME) + " - " + edu.util.returnEmpty(aData.PARENT_ORG_CODE);
                    }
                },
                {
                    "mDataProp": "START_DATE"
                },
                {
                    "mDataProp": "END_DATE"
                },
                {
                    "mDataProp": "RELATION_TYPE_CODE_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.IS_ACTIVE ? "" : "Hết hiệu lực";
                    }
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
        if (data.length) {
            var data = data[0];
            me["strQuanHe_Id"] = data.ID;
            edu.util.viewValById("dropDonVi_Cha", data.PARENT_ORG_ID);
            edu.util.viewValById("txtNgayHieuLuc_Cha", data.START_DATE);
            edu.util.viewValById("txtNgayHetHieuLuc_Cha", data.END_DATE);
            edu.util.viewValById("dropLoaiQuanHe_Cha", data.RELATION_TYPE_CODE_ID);
            edu.util.viewValById("dropTrangThai_Cha", data.IS_ACTIVE);
            $("#tblQuanHe").parent().parent().parent().show();
        } else {
            me["strQuanHe_Id"] = "";
            edu.util.viewValById("dropDonVi_Cha", data.MOTA);
            edu.util.viewValById("txtNgayHieuLuc_Cha", data.MOTA);
            edu.util.viewValById("txtNgayHetHieuLuc_Cha", data.MOTA);
            edu.util.viewValById("dropLoaiQuanHe_Cha", data.MOTA);
            edu.util.viewValById("dropTrangThai_Cha", 1);
            $("#tblQuanHe").parent().parent().parent().hide();
        }
        /*III. Callback*/
    },
}