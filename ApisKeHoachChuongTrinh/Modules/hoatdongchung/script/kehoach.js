/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    dtHeDaoTao: [],
    arrChecked_Id: [],
    dtXacNhan: [],
    dtPhi: [],
    strPhi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KeHoachXuLy();
        me.getList_ThoiGianDaoTao();
        me.getList_Nam();
        edu.system.loadToCombo_DanhMucDuLieu("KH.NAM.PHANLOAI", "dropPhanLoai");
        
        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAddKeHoach").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            me.save_KeHoachXuLy();
        });
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachXuLy(arrChecked_Id[i]);
                }
                
            });
        });
        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblKeHoachXuLy").delegate('.btnKeHoachChiTiet', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneKeHoachChiTiet");
            me.getList_KeHoachChiTiet();
        });

        $("#btnAddThoiGian").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThoiGian(id, "");
        });
        $("#tblThoiGian").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThoiGian tr[id='" + strRowId + "']").remove();
        });
        $("#tblThoiGian").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThoiGian(strId);
            });
        });;
        
        

        $("#tblKeHoachXuLy").delegate('.btnDSNhanSu', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSNhanSu");
            me.strKeHoachXuLy_Id = strId;
            me.getList_PhanCong();
        });
        $("#btnAdd_PhanCong").click(function () {
            edu.extend.genModal_NguoiDung(arrChecked_Id => {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhanCong(arrChecked_Id[i]);
                }
            });
            edu.extend.getList_NguoiDungP();
        });
        $("#btnDelete_PhanCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanCong(arrChecked_Id[i]);
                }
            });
        });
        
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropNam", edu.util.getValById("dropSearch_Nam"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("dropPhanLoai", "");
        edu.util.viewValById("dropHieuLuc", "1");
        edu.util.viewValById("dropKhoaDuLieu", "0");
        $("#tblThoiGian tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweFS4vJgkuMQPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_TongHop',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNam': edu.system.getValById('dropSearch_Nam'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/FSkkLB4KCR4PICweFS4vJgkuMQPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Them_KH_Nam_TongHop',
            'iM': edu.system.iM,
            'strId': me.strKeHoachXuLy_Id,
            'strPhanLoai_Id': edu.system.getValById('dropPhanLoai'),
            'strTen': edu.system.getValById('txtTen'),
            'strMa': edu.system.getValById('txtMa'),
            'strTuNgay': edu.system.getValById('txtTuNgay'),
            'strDenNgay': edu.system.getValById('txtDenNgay'),
            'strNam': edu.system.getValById('dropNam'),
            'dKhoaDuLieu': edu.system.getValById('dropKhoaDuLieu'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KHCT_HoatDong_KeHoach_MH/EjQgHgoJHg8gLB4VLi8mCS4x';
            obj_save.func = 'PKG_KEHOACH_HOATDONG_KEHOACH.Sua_KH_Nam_TongHop';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    $("#tblThoiGian tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThoiGian(strHeKhoa_Id, strKeHoachXuLy_Id);
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachXuLy: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KHCT_HoatDong_KeHoach_MH/GS4gHgoJHg8gLB4VLi8mCS4x',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Xoa_KH_Nam_TongHop',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KeHoachXuLy();
                }
                else {
                    obj = {
                        content: "KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "HB_KeHoach/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "NAM"
                },
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Hiệu lực" : "Hết hiệu lực";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Khóa dữ liệu" : "";
                    }
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKeHoachChiTiet" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSNhanSu" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
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
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        //edu.util.viewValById("dropHieuLuc", data.MA);
        edu.util.viewValById("dropNam", data.NAM);
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("dropKhoaDuLieu", data.KHOADULIEU);
        me.strKeHoachXuLy_Id = data.ID;
        me.getList_ThoiGian();
    },

    getList_ThoiGianDaoTao: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThoiGianDaoTao/LayDanhSach',
            'strDAOTAO_Nam_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtThoiGianDaoTao"] = data.Data;
                    //me.genList_ThoiGianDaoTao(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },

    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropThanhPhanDiem"],
            title: "Chọn thời gian đào tạo"
        };
        edu.system.loadToCombo_data(obj);
    },
    genList_ThoiGianDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThoiGianDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: "",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    
    save_ThoiGian: function (strRow_Id, strKH_Nam_TongHop_Id) {
        var me = this;
        var strId = strRow_Id;

        var strThoiGian = edu.util.getValById('dropThoiGian' + strRow_Id);
        if (!strThoiGian) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        else return;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/FSkkLB4KCR4PICweFSkuKAYoIC8P',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Them_KH_Nam_ThoiGian',
            'iM': edu.system.iM,
            'strId': strId,
            'strKH_Nam_TongHop_Id': strKH_Nam_TongHop_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGian,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (strId) {
        //    obj_save.action = 'KHCT_HoatDong_KeHoach_MH/Sua_DangKy_Thi_HP_KH_ThoiGian';
        //}
        //default

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
    getList_ThoiGian: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweFSkuKAYoIC8P',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ThoiGian',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKH_Nam_TongHop_Id': me.strKeHoachXuLy_Id,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThoiGian_Data(dtResult);
                }
                else {
                    edu.system.alert( data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert( JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThoiGian: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KHCT_HoatDong_KeHoach_MH/GS4gHgoJHg8gLB4VKS4oBiggLwPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Xoa_KH_Nam_ThoiGian',
            'iM': edu.system.iM,
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ThoiGian();
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
                    content: "(er): " + JSON.stringify(er),
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


    genHTML_ThoiGian_Data: function (data) {
        var me = this;
        $("#tblThoiGian tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHeKhoa_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHeKhoa_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropThoiGian' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblThoiGian tbody").append(row);
            me.genList_ThoiGianDaoTao("dropThoiGian" + strHeKhoa_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            
        }
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },
    genHTML_ThoiGian: function (strHeKhoa_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThoiGian").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHeKhoa_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropThoiGian' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHeKhoa_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblThoiGian tbody").append(row);
        me.genList_ThoiGianDaoTao("dropThoiGian" + strHeKhoa_Id);
    },
    
    getList_PhanCong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweDykgLxI0',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_NhanSu',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKH_Nam_TongHop_Id': me.strKeHoachXuLy_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhanCong"] = dtReRult;
                    me.genTable_PhanCong(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    save_PhanCong: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/FSkkLB4KCR4PICweDykgLxI0',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Them_KH_Nam_NhanSu',
            'iM': edu.system.iM,
            'strKH_Nam_TongHop_Id': me.strKeHoachXuLy_Id,
            'strNguoiDung_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_PhanCong: function (strGiangVien_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/GS4gHgoJHg8gLB4PKSAvEjQP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Xoa_KH_Nam_NhanSu',
            'iM': edu.system.iM,
            'strId': strGiangVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    genTable_PhanCong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_PhanCong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TENDAYDU"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_Nam: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung_MH/DSA4BRIPICwP',
            'func': 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSNam',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_Nam(data);
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
    genCombo_Nam: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAM",
            },
            renderPlace: ["dropNam", "dropSearch_Nam"],
            title: "Chọn Năm"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_KeHoachChiTiet: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNRUpJC4P',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ChiTietTheo',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKH_Nam_TongHop_Id': me.strKeHoachXuLy_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKeHoachChiTiet"] = dtReRult;
                    me.genTable_KeHoachChiTiet(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KeHoachChiTiet: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKeHoachChiTiet",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "CHEDOAPDUNG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Hiệu lực" : "Hết hiệu lực";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Khóa dữ liệu" : "";
                    }
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                }
                
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}