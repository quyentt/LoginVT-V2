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
    strKH_Nam_TongHop_Id: '',
    strThoiGian_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_KeHoachXuLy();
        me.getList_Nam();
        me.getList_ThoiGian();
        edu.system.loadToCombo_DanhMucDuLieu("KH.NAM.PHANLOAI", "dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("KH.NAM.CHEDOAPDUNG", "dropCheDo");
        
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

        $("#tblKeHoachXuLy").delegate('.btnHocPhanDuKien', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneHocPhanDuKien");
            me.getList_HocPhanDuKien();
        });
        $("#tblKeHoachXuLy").delegate('.btnHocPhanDeXuat', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneHocPhanDeXuat");
            me.getList_HocPhanDeXuat();
        });
        

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

        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoachNam();
        });
        $("#dropSearch_KeHoachNam").on("select2:select", function () {
            me.getList_KeHoachCT();
            me.getList_ThoiGian();
            me.strKH_Nam_TongHop_Id = edu.util.getValById("dropSearch_KeHoachNam")
        });
        $("#dropSearch_KeHoachChiTiet").on("select2:select", function () {
            me.getList_KeHoachXuLy();
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";
        me.strThoiGian_Id = "";
        me.strKH_Nam_TongHop_Id = edu.util.getValById("dropSearch_KeHoachNam");
        me.getList_ThoiGian();

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropNam", edu.util.getValById("dropSearch_Nam"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("dropPhanLoai", "");
        edu.util.viewValById("dropThoiGian", "");
        edu.util.viewValById("dropCheDo", "");
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
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNQPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ChiTiet',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strNam': edu.system.getValById('dropSearch_Nam'),
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strNguoiThucHien_Id': edu.system.userId,
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
            'action': 'KHCT_HoatDong_KeHoach_MH/FSkkLB4KCR4PICweAikoFSgkNQPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Them_KH_Nam_ChiTiet',
            'iM': edu.system.iM,
            'strId': me.strKeHoachXuLy_Id,
            'strPhanLoai_Id': edu.system.getValById('dropPhanLoai'),
            'strTen': edu.system.getValById('txtTen'),
            'strMa': edu.system.getValById('txtMa'),
            'strTuNgay': edu.system.getValById('txtTuNgay'),
            'strDenNgay': edu.system.getValById('txtDenNgay'),
            'strNam': edu.system.getValById('dropSearch_Nam'),
            'dKhoaDuLieu': edu.system.getValById('dropKhoaDuLieu'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc'),

            'strCheDoApDung_Id': edu.system.getValById('dropCheDo'),
            'strKH_Nam_TongHop_Id': me.strKH_Nam_TongHop_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGian'),

            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KHCT_HoatDong_KeHoach_MH/EjQgHgoJHg8gLB4CKSgVKCQ1';
            obj_save.func = 'PKG_KEHOACH_HOATDONG_KEHOACH.Sua_KH_Nam_ChiTiet';
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
            'action': 'KHCT_HoatDong_KeHoach_MH/GS4gHgoJHg8gLB4CKSgVKCQ1',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Xoa_KH_Nam_ChiTiet',
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
                    "mDataProp": "KH_NAM_TONGHOP_TEN"
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
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnHocPhanDuKien" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnHocPhanDeXuat" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropCheDo", data.CHEDOAPDUNG_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("dropKhoaDuLieu", data.KHOADULIEU);
        me.strKeHoachXuLy_Id = data.ID;
        me.strKH_Nam_TongHop_Id = data.KH_NAM_TONGHOP_ID;
        me.strThoiGian_Id = data.DAOTAO_THOIGIANDAOTAO_ID;
        me.getList_ThoiGian();
    },
    
    getList_PhanCong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNR4PKSAvEjQP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ChiTiet_NhanSu',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKH_Nam_ChiTiet_Id': me.strKeHoachXuLy_Id,
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
            'action': 'KHCT_HoatDong_KeHoach_MH/FSkkLB4KCR4PICweAikoFSgkNR4PKSAvEjQP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Them_KH_Nam_ChiTiet_NhanSu',
            'iM': edu.system.iM,
            'strKH_Nam_ChiTiet_Id': me.strKeHoachXuLy_Id,
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
            'action': 'KHCT_HoatDong_KeHoach_MH/GS4gHgoJHg8gLB4CKSgVKCQ1Hg8pIC8SNAPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.Xoa_KH_Nam_ChiTiet_NhanSu',
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

    getList_KeHoachNam: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweFS4vJgkuMQPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_TongHop',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNam': edu.system.getValById('dropSearch_Nam'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KeHoachNam(data);
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
    genCombo_KeHoachNam: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoachNam"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachCT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNRUpJC4P',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ChiTietTheo',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KeHoachCT(data);
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
    genCombo_KeHoachCT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoachChiTiet"],
            title: "Chọn kế hoạch chi tiết"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_HocPhanDuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgU0CigkLwPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropAAAA'),
            'strKH_Nam_ChiTiet_Id': me.strKeHoachXuLy_Id,
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHocPhanDuKien"] = dtReRult;
                    me.genTable_HocPhanDuKien(dtReRult, data.Pager);
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
    genTable_HocPhanDuKien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanDuKien",

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
                    "mDataProp": "DAOTAO_HOCPHAN_MA",
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "DINHHUONG_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
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

    getList_HocPhanDeXuat: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgUkGTQgNQPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DeXuat',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropAAAA'),
            'strKH_Nam_ChiTiet_Id': me.strKeHoachXuLy_Id,
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHocPhanDeXuat"] = dtReRult;
                    me.genTable_HocPhanDeXuat(dtReRult, data.Pager);
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
    genTable_HocPhanDeXuat: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanDeXuat",

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
                    "mDataProp": "DAOTAO_HOCPHAN_MA",
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "DINHHUONG_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },

                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOITAO_DONVI_TEN"
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
    
    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung_MH/DSA4BRIVKS4oBiggLxUpJC4KJAkuICIp',
            'func': 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSThoiGianTheoKeHoach',
            'iM': edu.system.iM,
            'strKH_Nam_TongHop_Id': me.strKH_Nam_TongHop_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_ThoiGian(data);
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
    genCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                default_val: me.strThoiGian_Id
            },
            renderPlace: ["dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
}