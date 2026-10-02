/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CauHinhHopDong() { };
CauHinhHopDong.prototype = {
    strCauHinhHopDong_Id: '',
    dtCauHinhHopDong: [],
    dtTinhTrang: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_CauHinhHopDong();
        $("#tblCauHinhHopDong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_CauHinhHopDong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblCauHinhHopDong").delegate(".btnDetail", "click", function () {
            var strId = this.id;
            me.strCauHinhHopDong_Id = strId;
            me.getList_ThongTin();
            me.toggle_edit();
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_CauHinhHopDong").click(function () {
            me.save_CauHinhHopDong();
        });
        $("#btnXoaCauHinhHopDong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauHinhHopDong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CauHinhHopDong(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_CauHinhHopDong();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CauHinhHopDong();
            }
        });
        $("#chkSelectAll_CauHinhHopDong").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCauHinhHopDong" });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        });
        $("#tblCauHinhThongTin").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblCauHinhThongTin tr[id='" + strRowId + "']").remove();
        });
        $("#tblCauHinhThongTin").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThongTin(strId);
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.TRUONGTHONGTIN", "", "", me.cbGetList_TruongTT);
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.HOATDONG", "dropHoatDong");
        edu.system.loadToCombo_DanhMucDuLieu("NHANSU.PHAMVI.HOATDONG", "dropPhamVi");


        $("#btnSave_CauHinhThongTin").click(function () {
            $("#tblCauHinhThongTin tbody tr").each(function () {
                var strKetQua_Id = this.id.replace(/rm_row/g, '');
                me.save_ThongTin(strKetQua_Id);
            });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strCauHinhHopDong_Id = "";
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("dropHoatDong", "");
        edu.util.viewValById("dropPhamVi", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CauHinhHopDong: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_DanhMucHoatDong/ThemMoi',

            'strId': me.strCauHinhHopDong_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById('txtTen'),
            'strMa': edu.util.getValById('txtMa'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhamViApDung_Id': edu.util.getValById('dropPhamVi'),
            'strHoatDongNhanSu_Id': edu.util.getValById('dropHoatDong'),
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_DanhMucHoatDong/CapNhat';
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
                    me.getList_CauHinhHopDong();
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
    getList_CauHinhHopDong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_DanhMucHoatDong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCauHinhHopDong = dtReRult;
                    me.genTable_CauHinhHopDong(dtReRult, data.Pager);
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
    delete_CauHinhHopDong: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NS_DanhMucHoatDong/Xoa',

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
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CauHinhHopDong();
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
    genTable_CauHinhHopDong: function (data, iPager) {
        $("#lblCauHinhHopDong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCauHinhHopDong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CauHinhHopDong.getList_CauHinhHopDong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3,6, 7, 8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "HOATDONGNHANSU_MA"
                },
                {
                    "mDataProp": "HOATDONGNHANSU_TEN"
                },
                {
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Hiệu lực" : "";
                    }
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDetail" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
        /*III. Callback*/
    },
    viewForm_CauHinhHopDong: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtCauHinhHopDong, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("dropHoatDong", data.HOATDONGNHANSU_ID);
        edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
        me.strCauHinhHopDong_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [2] AccessDB ThongTin
    --ULR:  Modules
    -------------------------------------------*/
    save_ThongTin: function (strKetQua_Id, strDeTai_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strTruongThongTin_Id = edu.util.getValById('dropThongTin' + strKetQua_Id);
        console.log(strTruongThongTin_Id);
        var iThuTu = edu.util.getValById('txtThuTu' + strKetQua_Id);
        var dDoRong = edu.util.getValById('txtDoRong' + strKetQua_Id);
        var dBatBuoc = edu.util.getValById('txtBatBuoc' + strKetQua_Id);
        var strMoTa = edu.util.getValById('txtMoTa' + strKetQua_Id);
        if (!edu.util.checkValue(strTruongThongTin_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'NS_HoatDong_MoRong/ThemMoi',

            'strId': strId,
            'strMoTa': strMoTa,
            'strHoatDongNhanSu_Id': me.strCauHinhHopDong_Id,
            'strTruongThongTin_Id': strTruongThongTin_Id,
            'iThuTu': iThuTu,
            'dDoRong': dDoRong,
            'dBatBuoc': dBatBuoc,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'NS_HoatDong_MoRong/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThongTin: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoatDong_MoRong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strHoatDongNhanSu_Id': me.strCauHinhHopDong_Id,
            'strTruongThongTin_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 200000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThongTin_Data(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_ThongTin: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'NS_HoatDong_MoRong/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.genHTML_ThongTin_Data(data.Data);
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: 'POST',
            action: obj_delete.action,

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_ThongTin_Data: function (data) {
        var me = this;
        $("#tblCauHinhThongTin tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropThongTin' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtDoRong' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DORONG) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtBatBuoc' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.BATBUOC) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblCauHinhThongTin tbody").append(row);
            me.genComBo_TruongTT("dropThongTin" + strKetQua_Id, data[i].TRUONGTHONGTIN_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThongTin(id, "");
        }
    },
    genHTML_ThongTin: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblCauHinhThongTin").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropThongTin' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn thông tin--</option ></select ></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtDoRong' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.DORONG) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtBatBuoc' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.BATBUOC) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblCauHinhThongTin tbody").append(row);
        me.genComBo_TruongTT("dropThongTin" + strKetQua_Id, "");
    },
    cbGetList_TruongTT: function (data) {
        main_doc.CauHinhHopDong.dtTinhTrang = data;
    },
    genComBo_TruongTT: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTinhTrang,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn trường thông tin"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
}