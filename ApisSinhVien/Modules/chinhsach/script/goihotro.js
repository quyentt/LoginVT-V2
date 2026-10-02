/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function GoiHoTro() { };
GoiHoTro.prototype = {
    dtGoiHoTro: [],
    strGoiHoTro_Id: '',

    dtGoiHoTro_ChiTiet: [],
    strGoiHoTro_ChiTiet_Id: '',
    
    dtGoiHoTro_DoiTuong: [],
    strGoiHoTro_DoiTuong_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGianDaoTao();
        me.getList_GoiHoTro();
        me.getList_GoiHoTro_DoiTuong();
        me.getList_DMLKT();
        me.getList_CheDoChinhSach();
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("QLTC.CDCS", "dropSearch_CheDo,dropCheDo");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.CHINHSACH.DONVITINH", "dropDonViTinh");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.CHINHSACH.KIEUITINH", "dropKieuTinh");
        edu.system.loadToCombo_DanhMucDuLieu("TAICHINH.CHINHSACH.QUYDINHTHOIGIAN", "dropQuyDinhThoiGian");


        $("#btnSearch").click(function (e) {
            me.getList_GoiHoTro_DoiTuong();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_GoiHoTro_DoiTuong();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $("#btnAddGoiHoTro").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_GoiHoTro").click(function (e) {
            me.save_GoiHoTro();
        });
        $("#btnXoaGoiHoTro").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_GoiHoTro(me.strGoiHoTro_Id);
            });
        });
        $("#tblGoiHoTro").delegate('.btnEditHoTro', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblGoiHoTro");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtGoiHoTro, "ID")[0];
                me.toggle_edit();
                me.viewEdit_GoiHoTro(data);
                me.getList_GoiHoTro_ChiTiet();
                $("#zoneChiTiet").slideDown();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        $("#btnAddChiTiet").click(function () {
            me.rewrite_ChiTiet();
            $('#myModal_ChiTiet').modal('show');
        });
        $("#btnSave_GoiHoTro_ChiTiet").click(function (e) {
            me.save_GoiHoTro_ChiTiet();
        });
        $("#btnDelete_ChiTiet").click(function () {
            $("#myModal_ChiTiet").modal("hide");
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_GoiHoTro_ChiTiet(me.strGoiHoTro_ChiTiet_Id);
            });
        });
        $("#tblGoiHoTro_ChiTiet").delegate('.btnEdit_ChiTiet', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblGoiHoTro_ChiTiet");
            if (edu.util.checkValue(strId)) {
                $('#myModal_ChiTiet').modal('show');
                var data = edu.util.objGetDataInData(strId, me.dtGoiHoTro_ChiTiet, "ID")[0];
                me.viewEdit_GoiHoTro_ChiTiet(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnAddDoiTuong").click(function () {
            me.rewrite_DoiTuong();
            $('#myModal_DoiTuong').modal('show');
        });
        $("#btnSave_GoiHoTro_DoiTuong").click(function (e) {
            me.save_GoiHoTro_DoiTuong();
        });
        $("#btnDelete_DoiTuong").click(function () {
            $("#myModal_DoiTuong").modal("hide");
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_GoiHoTro_DoiTuong(me.strGoiHoTro_DoiTuong_Id);
            });
        });
        $("#tblGoiHoTro_DoiTuong").delegate('.btnEdit_ChiTiet', 'click', function (e) {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblGoiHoTro_DoiTuong");
            if (edu.util.checkValue(strId)) {
                $('#myModal_DoiTuong').modal('show');
                var data = edu.util.objGetDataInData(strId, me.dtGoiHoTro_DoiTuong, "ID")[0];
                me.viewEdit_GoiHoTro_DoiTuong(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        //$('#dropSearch_CheDo').on('select2:select', function (e) {
        //    me.getList_CheDoChinhSach();
        //});
        $('#dropSearch_GoiHoTro').on('select2:select', function (e) {
            me.getList_GoiHoTro_ChiTiet();
            strId = $('#dropSearch_GoiHoTro').val();
            edu.util.setOne_BgRow(strId, "tblGoiHoTro");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtGoiHoTro, "ID")[0];
                me.viewEdit_GoiHoTro(data);
            }
        });
        
    },

    rewrite: function () {
        //reset id
        var me = this;
        me.strGoiHoTro_Id = "";
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        $("#zoneChiTiet").hide();
    },
    rewrite_ChiTiet: function () {
        var me = this;
        me.strGoiHoTro_ChiTiet_Id = "";
        edu.util.viewValById("dropKhoanDuocNhan", "");
        edu.util.viewValById("txtMucNhan", "");
        edu.util.viewValById("dropDonViTinh", "");
        edu.util.viewValById("dropKieuTinh", "");
        edu.util.viewValById("dropQuyDinhThoiGian", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("txtCT_GhiChu", "");
        edu.util.viewValById("txtThuTu", "");
    },
    rewrite_DoiTuong: function () {
        var me = this;
        me.strGoiHoTro_DoiTuong_Id = "";
        edu.util.viewValById("dropCheDo", "");
        edu.util.viewValById("dropDoiTuong", "");
        edu.util.viewValById("dropGoiHoTro", "");
        edu.util.viewValById("dropThoiGian", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("txtGhiChu", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_GoiHoTro: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_GoiHoTro/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGoiHoTro = dtReRult;
                    me.genTable_GoiHoTro(dtReRult, data.Pager);
                    me.cbGenCombo_GoiHoTro(dtReRult);
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
    save_GoiHoTro: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_GoiHoTro/ThemMoi',
            
            'strId': me.strGoiHoTro_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById('txtTen'),
            'strMa': edu.util.getValById('txtMa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'SV_GoiHoTro/CapNhat';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strGoiHoTro_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strGoiHoTro_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strGoiHoTro_Id = obj_save.strId;
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_GoiHoTro();
            },
            error: function (er) {
                edu.system.alert("XLHV_GoiHoTro/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GoiHoTro: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'SV_GoiHoTro/Xoa',
            

            'strIds': strId,
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
                    me.getList_GoiHoTro();
                }
                else {
                    obj = {
                        content: "SV_GoiHoTro/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "SV_GoiHoTro/Xoa (er): " + JSON.stringify(er),
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
    genTable_GoiHoTro: function (data, iPager) {
        var me = this;
        $("#lblGoiHoTro_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGoiHoTro",

            //bPaginate: {
            //    strFuntionName: "main_doc.GoiHoTro.getList_GoiHoTro()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0,3],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN",
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEditHoTro" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_GoiHoTro: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropSearch_GoiHoTro", data.ID);
        me.strGoiHoTro_Id = data.ID;
    },
    cbGenCombo_GoiHoTro: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_GoiHoTro", "dropGoiHoTro"],
            type: "",
            title: "Chọn gói hỗ trợ",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_GoiHoTro_ChiTiet: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_GoiHoTro_ChiTiet/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_ChinhSach_Goi_Id': edu.util.getValById('dropSearch_GoiHoTro'),
            'strDonViTinh_Id': edu.util.getValById('dropAAAA'),
            'strKieuTinh_Id': edu.util.getValById('dropAAAA'),
            'strQuyDinhThoiGian_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGoiHoTro_ChiTiet = dtReRult;
                    me.genTable_GoiHoTro_ChiTiet(dtReRult, data.Pager);
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
    save_GoiHoTro_ChiTiet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_GoiHoTro_ChiTiet/ThemMoi',

            'strId': me.strGoiHoTro_ChiTiet_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNgay_Thang_BatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgay_Thang_KetThuc': edu.util.getValById('txtNgayKetThuc'),
            'iThuTu': edu.util.getValById('txtThuTu'),
            'strTaiChinh_CS_GoiHoTro_Id': me.strGoiHoTro_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanDuocNhan'),
            'strDonViTinh_Id': edu.util.getValById('dropDonViTinh'),
            'strKieuTinh_Id': edu.util.getValById('dropKieuTinh'),
            'strQuyDinhThoiGian_Id': edu.util.getValById('dropQuyDinhThoiGian'),
            'dMucHuong': edu.util.getValById('txtMucNhan'),
            'strGhiChu': edu.util.getValById('txtCT_GhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'SV_GoiHoTro_ChiTiet/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strGoiHoTro_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strGoiHoTro_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strGoiHoTro_Id = obj_save.strId;
                    }
                    $("#myModal_ChiTiet").modal("hide");
                    me.getList_GoiHoTro();
                }
                else {
                    obj_notify = {
                        prePos: "#myModal_ChiTiet #notify",
                        type: "w",
                        content: data.Message
                    };
                    edu.system.alertOnModal(obj_notify);
                }
                
            },
            error: function (er) {
                edu.system.alert("XLHV_GoiHoTro/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GoiHoTro_ChiTiet: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'SV_GoiHoTro_ChiTiet/Xoa',
            'strIds': strId,
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
                    me.getList_GoiHoTro_ChiTiet();
                }
                else {
                    obj = {
                        content: "SV_GoiHoTro/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "SV_GoiHoTro/Xoa (er): " + JSON.stringify(er),
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
    genTable_GoiHoTro_ChiTiet: function (data, iPager) {
        var me = this;
        $("#lblGoiHoTro_ChiTiet_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGoiHoTro_ChiTiet",

            bPaginate: {
                strFuntionName: "main_doc.GoiHoTro.getList_GoiHoTro_ChiTiet()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 6, 7, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "MUCHUONG"
                },
                {
                    "mDataProp": "DONVITINH_TEN"
                },
                {
                    "mDataProp": "KIEUTINH_TEN"
                },
                {
                    "mDataProp": "QUYDINHTHOIGIAN_TEN"
                },
                {
                    "mDataProp": "PHAMVI_BATDAU_NGAY_THANG_"
                },
                {
                    "mDataProp": "PHAMVI_KETTHUC_NGAY_THANG_"
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEdit_ChiTiet" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_GoiHoTro_ChiTiet: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropKhoanDuocNhan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("txtMucNhan", data.MUCHUONG);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("dropKieuTinh", data.KIEUTINH_ID);
        edu.util.viewValById("dropQuyDinhThoiGian", data.QUYDINHTHOIGIAN_ID);
        edu.util.viewValById("txtNgayBatDau", data.PHAMVI_BATDAU_NGAY_THANG_);
        edu.util.viewValById("txtNgayKetThuc", data.PHAMVI_KETTHUC_NGAY_THANG_);
        edu.util.viewValById("txtCT_GhiChu", data.GHICHU);
        edu.util.viewValById("txtThuTu", data.THUTU);
        me.strGoiHoTro_ChiTiet_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_GoiHoTro_DoiTuong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_CS_DoiTuong/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDoiTuong_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_CS_GoiHoTro_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGoiHoTro_DoiTuong = dtReRult;
                    me.genTable_GoiHoTro_DoiTuong(dtReRult, data.Pager);
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
    save_GoiHoTro_DoiTuong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_CS_DoiTuong/ThemMoi',

            'strId': me.strGoiHoTro_ChiTiet_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTaiChinh_CS_GoiHoTro_Id': edu.util.getValById('dropGoiHoTro'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDoiTuong_Id': edu.util.getValById('dropDoiTuong'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropCheDo'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
        };
        if (obj_save.strId != "") {
            obj_save.action = 'SV_CS_DoiTuong/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strGoiHoTro_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strGoiHoTro_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strGoiHoTro_Id = obj_save.strId
                    }

                    $("#myModal_DoiTuong").modal("hide");
                    me.getList_GoiHoTro_DoiTuong();
                }
                else {
                    obj_notify = {
                        prePos: "#myModal_DoiTuong #notify",
                        type: "w",
                        content: data.Message
                    };
                    edu.system.alertOnModal(obj_notify);
                }

            },
            error: function (er) {
                edu.system.alert("XLHV_GoiHoTro/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_GoiHoTro_DoiTuong: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'SV_CS_DoiTuong/Xoa',
            'strIds': strId,
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
                    me.getList_GoiHoTro_DoiTuong();
                }
                else {
                    obj = {
                        content: "SV_GoiHoTro/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "SV_GoiHoTro/Xoa (er): " + JSON.stringify(er),
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
    genTable_GoiHoTro_DoiTuong: function (data, iPager) {
        var me = this;
        $("#lblGoiHoTro_DoiTuong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGoiHoTro_DoiTuong",

            bPaginate: {
                strFuntionName: "main_doc.GoiHoTro.getList_GoiHoTro_DoiTuong()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "CHEDOCHINHSACH_TEN"
                },
                {
                    "mDataProp": "DOITUONG_TEN"
                },
                {
                    "mDataProp": "TENGOIHOTRO"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "HIEULUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit btnEdit_ChiTiet" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    viewEdit_GoiHoTro_DoiTuong: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("dropCheDo", data.CHEDOCHINHSACH_ID);
        edu.util.viewValById("dropDoiTuong", data.DOITUONG_ID);
        edu.util.viewValById("dropGoiHoTro", data.TAICHINH_CHINHSACH_GOIHOTRO_ID);
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        me.strGoiHoTro_DoiTuong_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DMLKT: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'strNhomCacKhoanThu_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.cbGenCombo_KhoanThu(data);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_KhoanThu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropKhoanDuocNhan"],
            type: "",
            title: "Chọn khoản được nhận",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_CheDoChinhSach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ChinhSach_DT/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strCheDoChinhSach_Id': edu.util.getValById('dropSearch_CheDo'),
            'strDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_CheDoChinhSach(dtReRult, data.Pager);
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
    cbGenCombo_CheDoChinhSach: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DOITUONG_ID",
                parentId: "",
                name: "DOITUONG_TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropDoiTuong", "dropSearch_DoiTuong"],
            type: "",
            title: "Chọn đối tượng",
        };
        edu.system.loadToCombo_data(obj);
    },

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
            renderPlace: ["dropThoiGian"],
            type: "",
            title: "Chọn học kỳ",
        };
        edu.system.loadToCombo_data(obj);
    },
}