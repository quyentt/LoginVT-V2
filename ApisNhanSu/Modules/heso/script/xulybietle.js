/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function XuLyBietLe() { };
XuLyBietLe.prototype = {
    strXuLyBietLe_Id: '',
    dtXuLyBietLe: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_XuLyBietLe();
        me.getList_CCTC();
        me.getList_QuyDinhLuong();
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LUONG,LOAIXULYBIETLE", "dropSearch_LoaiXuLy,dropLoaiXuLy");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.THANHPHANLUONG", "dropSearch_ThanhPhanLuong,dropThanhPhanLuong");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.LOAIBANGLUONG", "dropLoaiBangLuong");
        $("#tblXuLyBietLe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_XuLyBietLe(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_XuLyBietLe").click(function () {
            me.save_XuLyBietLe();
        });
        $("#btnKeThua").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXuLyBietLe", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var row = '<select id="dropThangKeThua" class="select-opt"  multiple="multiple" style="width: 220px">';
            row += '</select>';
            edu.system.confirm('Nhập năm:<input style="width: 100px" id="txtNamKeThua" value="' + edu.util.getValById("txtSearch_Nam") + '" class="form-control" /> <div class="clear"></div> Chọn tháng kế thừa: ' + row);
            $("#dropThangKeThua").select2();
            var obj = {
                data: [{ D: 1 }, { D: 2 }, { D: 3 }, { D: 4 }, { D: 5 }, { D: 6 }, { D: 7 }, { D: 8 }, { D: 9 }, { D: 10 }, { D: 11 }, { D: 12 }],
                renderInfor: {
                    id: "D",
                    parentId: "",
                    name: "D",
                    code: "MA",
                    order: ""
                },
                renderPlace: ["dropThangKeThua"],
                title: "Chọn tháng"
            };
            edu.system.loadToCombo_data(obj);
            $("#btnYes").click(function (e) {
                var x = $("#dropThangKeThua").val();
                if (x.length > 0) {

                    edu.system.alert('<div id="zoneprocessXuLyBietLe"></div>');
                    edu.system.genHTML_Progress("zoneprocessXuLyBietLe", arrChecked_Id.length * x.length);
                    arrChecked_Id.forEach(e => x.forEach(ele => me.KeThua_XuLyBietLe(e, ele)));
                }
            });
        });
        $("#btnXoaXuLyBietLe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXuLyBietLe", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXuLyBietLe"></div>');
                edu.system.genHTML_Progress("zoneprocessXuLyBietLe", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_XuLyBietLe(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_XuLyBietLe();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_XuLyBietLe();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblXuLyBietLe" });
        });

        $("#dropSearch_DonVi").on("select2:select", function () {
            me.getList_HS(edu.util.getValById("dropSearch_DonVi"), "");
        });
        $("#dropDonVi").on("select2:select", function () {
            me.getList_HS(edu.util.getValById("dropDonVi"), "");
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strXuLyBietLe_Id = "";
        edu.util.viewValById("dropDonVi", edu.util.getValById("dropSearch_DonVi"));
        edu.util.viewValById("dropThanhVien", edu.util.getValById("dropSearch_ThanhVien"));
        edu.util.viewValById("dropLoaiXuLy", edu.util.getValById("dropSearch_LoaiXuLy"));
        edu.util.viewValById("dropThanhPhanLuong", edu.util.getValById("dropSearch_ThanhPhanLuong"));
        edu.util.viewValById("txtNam", "");
        edu.util.viewValById("txtThang", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_XuLyBietLe: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'L_XuLyBietLe/ThemMoi',

            'strId': me.strXuLyBietLe_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropThanhVien'),
            'strNhanSu_BangQuyDinh_Id': edu.util.getValById('dropAAAA'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropThanhPhanLuong'),
            'strLoaiXuLyBietLe_Id': edu.util.getValById('dropLoaiXuLy'),
            'strThanhPhan_Id': edu.util.getValById('dropThanhPhanLuong'),
            'strNam': edu.util.getValById('txtNam'),
            'strThang': edu.util.getValById('txtThang'),
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'L_XuLyBietLe/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_XuLyBietLe();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    KeThua_XuLyBietLe: function (strId, strThang) {
        var me = this;
        var obj_notify = {};
        var obj = me.dtXuLyBietLe.find(e => e.ID === strId);
        //--Edit
        var obj_save = {
            'action': 'L_XuLyBietLe/ThemMoi',

            'strId': me.strXuLyBietLe_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNhanSu_HoSoCanBo_Id': obj.NHANSU_HOSOCANBO_ID,
            'strNhanSu_BangQuyDinh_Id': edu.util.getValById('dropAAAA'),
            'strLoaiBangLuong_Id': obj.THANHPHAN_ID,
            'strLoaiXuLyBietLe_Id': obj.LOAIXULYBIETLE_ID,
            'strThanhPhan_Id': obj.THANHPHAN_ID,
            'strNam': edu.util.getValById('txtNamKeThua'),
            'strThang': strThang,
            'strGhiChu': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'L_XuLyBietLe/CapNhat';
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công");

                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXuLyBietLe", function () {
                    me.getList_XuLyBietLe();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XuLyBietLe: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_XuLyBietLe/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropSearch_ThanhVien'),
            'strNhanSu_BangQuyDinh_Id': edu.util.getValById('dropSearch_QuyDinh'),
            'strLoaiBangLuong_Id': edu.util.getValById('dropLoaiBangLuong'),
            'strLoaiXuLyBietLe_Id': edu.util.getValById('dropSearch_LoaiXuLy'),
            'strThanhPhan_Id': edu.util.getValById('dropSearch_ThanhPhanLuong'),
            'strNam': edu.util.getValById('txtSearch_Nam'),
            'strThang': edu.util.getValById('txtSearch_Thang'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtXuLyBietLe = dtReRult;
                    me.genTable_XuLyBietLe(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
                
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_XuLyBietLe: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'L_XuLyBietLe/Xoa',
            
            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXuLyBietLe", function () {
                    me.getList_XuLyBietLe();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_XuLyBietLe: function (data, iPager) {
        $("#lblXuLyBietLe_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblXuLyBietLe",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.XuLyBietLe.getList_XuLyBietLe()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4, 7,8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MA"
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_HODEM) + " " + edu.util.returnEmpty(aData.NHANSU_HOSOCANBO_TEN);
                    }
                },
                {
                    "mDataProp": "NAM"
                },
                {
                    "mDataProp": "THANG"
                },
                {
                    "mDataProp": "LOAIXULYBIETLE_TEN"
                },
                {
                    "mDataProp": "THANHPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_XuLyBietLe: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtXuLyBietLe, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropThanhVien", data.NHANSU_HOSOCANBO_ID);
        edu.util.viewValById("dropLoaiXuLy", data.LOAIXULYBIETLE_ID);
        edu.util.viewValById("dropThanhPhanLuong", data.THANHPHAN_ID);
        edu.util.viewValById("txtNam", data.NAM);
        edu.util.viewValById("txtThang", data.THANG);
        me.strXuLyBietLe_Id = data.ID;
        me.getList_HS("", data.NHANSU_HOSOCANBO_ID);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_QuyDinhLuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'L_BangQuyDinhLuong/LayDanhSach',


            'strTuKhoa': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 100000
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_QuyDinhLuong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_QuyDinhLuong: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MUCLUONGCOBAN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_QuyDinh"],
            title: "Chọn quy định lương"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CCTC: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropDonVi", "dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function (strDaoTao_CoCauToChuc_Id, strDefaultVal) {
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
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': strDaoTao_CoCauToChuc_Id,
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, strDefaultVal);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data, default_val) {
        if (default_val === undefined) default_val = "";
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                },
                default_val: default_val
            },
            renderPlace: ["dropThanhVien"],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                },
            },
            renderPlace: ["dropSearch_ThanhVien"],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
    },
}