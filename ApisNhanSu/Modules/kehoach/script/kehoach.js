/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function KeHoach() { };
KeHoach.prototype = {
    strKeHoach_Id: '',
    dtKeHoach: [],
    strCongThucTinh_Id: '',
    strPhamVi_Id: '',
    init: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("CORE.NHANSU.KH.MOHINH", "dropSearch_MoHinh,dropMoHinh");
        edu.system.loadToCombo_DanhMucDuLieu("CHUNG.HANHDONG", "dropQuyenQuyen");
        me.getList_KeHoach();
        $("#tblKeHoach").delegate('.btnPhamVi', 'click', function (e) {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            $("#modalPhamVi").modal("show")
            me.getList_PhamVi();
        });
        $("#tblKeHoach").delegate('.btnQuyen', 'click', function (e) {
            var strId = this.id;
            me.strKeHoach_Id = strId;
            $("#modalQuyen").modal("show")
            me.getList_Quyen();
        });
        $("#tblPhamVi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtPhamVi.find(e => e.ID == strId);
            me["strPhamVi_Id"] = data.ID;
            $("#lblPhamViApDung").html(data.PHAMVIAPDUNG_TEN);
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewValById("txtNgayBatDauPV", data.NGAYBATDAU);
            edu.util.viewValById("txtGioBatDauPV", data.GIOBATDAU);
            edu.util.viewValById("txtPhutBatDauPV", data.PHUTBATDAU);
            edu.util.viewValById("txtNgayKetThucPV", data.NGAYKETTHUC);
            edu.util.viewValById("txtGioKetThucPV", data.GIOKETTHUC);
            edu.util.viewValById("txtPhutKetThucPV", data.PHUTKETTHUC);
            $("#modalSuaPhamVi").modal("show");
        });
        $("#tblPhamVi").delegate('.btnNhanSuQuyen', 'click', function (e) {
            var strId = this.id;
            me.strPhamVi_Id = strId;
            $("#modalNhanSuQuyen").modal("show")
            me.getList_NhanSuQuyen();
        });
        $("#btnSave_PhamVi").click(function () {
            me.update_PhamVi();
        });
        //me.getList_ThoiGian();
        //me.getList_KeHoach();
        //me.getList_ThoiGianChung();
        //me.getList_HinhThucHoc();
        //me.getList_ThoiGianDaoTao();
        $("#btnSearch").click(function (e) {
            me.getList_KeHoach();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoach();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#tblKeHoach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtKeHoach.find(e => e.ID == strId);
            me["strKeHoach_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            edu.util.viewValById("dropMoHinh", data.MOHINHCAPNHATDULIEU_ID);
            edu.util.viewValById("dropHieuLuc", data.HIEULUC);
            edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
            edu.util.viewValById("txtGioBatDau", data.GIOBATDAU);
            edu.util.viewValById("txtPhutBatDau", data.PHUTBATDAU);
            edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
            edu.util.viewValById("txtGioKetThuc", data.GIOKETTHUC);
            edu.util.viewValById("txtPhutKetThuc", data.PHUTKETTHUC);
            $("#modalKeHoach").modal("show");
        });
        $("#btnAdd_KeHoach").click(function () {
            var data = {};

            me["strKeHoach_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            edu.util.viewValById("dropMoHinh", data.MOHINHCAPNHATDULIEU_TEN);
            edu.util.viewValById("dropHieuLuc", 1);
            edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
            edu.util.viewValById("txtGioBatDau", data.GIOBATDAU);
            edu.util.viewValById("txtPhutBatDau", data.PHUTBATDAU);
            edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
            edu.util.viewValById("txtGioKetThuc", data.GIOKETTHUC);
            edu.util.viewValById("txtPhutKetThuc", data.PHUTKETTHUC);
            $("#modalKeHoach").modal("show");
        });
        $("#btnSave_KeHoach").click(function () {
            me.save_KeHoach();
        });
        $("#btnDelete_KeHoach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoach(arrChecked_Id[i]);
                }
            });
        });
        
        
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnAdd_PhamVi").click(function () {
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhamVi(arrChecked_Id[i]);
                }
            });
            edu.extend.getList_NhanSu();
        });
        $("#btnDelete_PhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhamVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhamVi(arrChecked_Id[i]);
                }
            });
        });

        $("#modal_nhansu").delegate('#btnAdd_TungDonVi', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_CCTC_NS").val();
            if (arrChecked_Id.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhamVi(arrChecked_Id[i]);
                }
            }
        });
        
        $("#btnAdd_Quyen").click(function () {
            var data = {};
            $("#modalAddQuyen").modal("show");
        });
        $("#btnSave_AddQuyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblAddQuyen", "checkX");
            var arrChecked_Id2 = $("#dropQuyenQuyen").val();
            if (arrChecked_Id.length * arrChecked_Id2.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length * arrChecked_Id2.length);
            arrChecked_Id.forEach(e => arrChecked_Id2.forEach(ele => me.save_Quyen(e, ele)));
        });
        $("#btnDelete_Quyen").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyen", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Quyen(arrChecked_Id[i]);
                }
            });
        });
        $('#dropBangQuyen').on('select2:select', function () {
            me.getList_AddQuyen();
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        $("#zoneKeHoachChiTiet").hide();
        //edu.util.viewValById("dropHoatDong", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropThoiGian", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("dropHieuLuc", 1);
        me.strKeHoach_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },

    getList_BangQuyen: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/DSA4BRIFIDUgHg4jKyQiNQPP',
            'func': 'PKG_CORE_HOSONHANSU_01.LayDSData_Object',
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
                            name: "OBJECT_NAME",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropBangQuyen"],
                        type: "",
                        title: "Chọn bảng thông tin"
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

    save_KeHoach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? edu.system.getValById('dropSearch_KeHoachChiTiet') : edu.system.getValById('dropSearch_KeHoachTongHop');
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/FSkkLB4CLjMkHg8pIC8SNB4KJAkuICIp',
            'func': 'PKG_CORE_HOSONHANSU_01.Them_Core_NhanSu_KeHoach',
            'iM': edu.system.iM,
            'strId': me.strKeHoach_Id,
            'strTen': edu.system.getValById('txtTen'),
            'strMa': edu.system.getValById('txtMa'),
            'strMoTa': edu.system.getValById('txtMoTa'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc'),
            'strNgayBatDau': edu.system.getValById('txtNgayBatDau'),
            'dGioBatDau': edu.system.getValById('txtGioBatDau'),
            'dPhutBatDau': edu.system.getValById('txtPhutBatDau'),
            'strNgayKetThuc': edu.system.getValById('txtNgayKetThuc'),
            'dGioKetThuc': edu.system.getValById('txtGioKetThuc'),
            'dPhutKetThuc': edu.system.getValById('txtPhutKetThuc'),
            'strMoHinhCapNhatDuLieu_Id': edu.system.getValById('dropMoHinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu1_MH/EjQgHgIuMyQeDykgLxI0HgokCS4gIikP';
            obj_save.func = 'PKG_CORE_HOSONHANSU_01.Sua_Core_NhanSu_KeHoach'
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
                    me.getList_KeHoach();
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
    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;//--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/DSA4BRICLjMkHg8pIC8SNB4KJAkuICIp',
            'func': 'PKG_CORE_HOSONHANSU_01.LayDSCore_NhanSu_KeHoach',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strMoHinhCapNhatDuLieu_Id': edu.system.getValById('dropSearch_MoHinh'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKeHoach"] = dtReRult;
                    me.genTable_KeHoach(dtReRult, data.Pager);
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
    delete_KeHoach: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/GS4gHgIuMyQeDykgLxI0HgokCS4gIikP',
            'func': 'PKG_CORE_HOSONHANSU_01.Xoa_Core_NhanSu_KeHoach',
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
                    me.getList_KeHoach();
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
    genTable_KeHoach: function (data, iPager) {
        $("#lblKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoach",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "MOHINHCAPNHATDULIEU_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnPhamVi" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnQuyen" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "GIOBATDAU"
                },
                {
                    "mDataProp": "PHUTBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "GIOKETTHUC"
                },
                {
                    "mDataProp": "PHUTKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "Hiệu lực" : "Hết hiệu lực";
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
        /*III. Callback*/
    },

    save_PhamVi: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/FSkkLB4CLjMkHg8SHgoJHhEpICwXKAPP',
            'func': 'PKG_CORE_HOSONHANSU_01.Them_Core_NS_KH_PhamVi',
            'iM': edu.system.iM,
            //'strId': me.strPhamVi_Id,
            'strCore_NS_KH_Id': me.strKeHoach_Id,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNgayBatDau': edu.system.getValById('txtAAAA'),
            'dGioBatDau': edu.system.getValById('txtAAAA'),
            'dPhutBatDau': edu.system.getValById('txtAAAA'),
            'strNgayKetThuc': edu.system.getValById('txtAAAA'),
            'dGioKetThuc': edu.system.getValById('txtAAAA'),
            'dPhutKetThuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu1_MH/EjQgHgIuMyQeDxIeCgkeESkgLBco';
            obj_save.func = 'PKG_CORE_HOSONHANSU_01.Sua_Core_NS_KH_PhamVi'
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
                    //me.getList_PhamVi();
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamVi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    update_PhamVi: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtPhamVi.find(e => e.ID == me.strPhamVi_Id);
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/EjQgHgIuMyQeDxIeCgkeESkgLBco',
            'func': 'PKG_CORE_HOSONHANSU_01.Sua_Core_NS_KH_PhamVi',
            'iM': edu.system.iM,
            'strId': me.strPhamVi_Id,
            'strCore_NS_KH_Id': me.strKeHoach_Id,
            'strPhamViApDung_Id': aData.PHAMVIAPDUNG_ID,
            'strNgayBatDau': edu.system.getValById('txtNgayBatDauPV'),
            'dGioBatDau': edu.system.getValById('txtGioBatDauPV'),
            'dPhutBatDau': edu.system.getValById('txtPhutBatDauPV'),
            'strNgayKetThuc': edu.system.getValById('txtNgayKetThucPV'),
            'dGioKetThuc': edu.system.getValById('txtGioKetThucPV'),
            'dPhutKetThuc': edu.system.getValById('txtPhutKetThucPV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu1_MH/EjQgHgIuMyQeDxIeCgkeESkgLBco';
            obj_save.func = 'PKG_CORE_HOSONHANSU_01.Sua_Core_NS_KH_PhamVi'
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
                    me.getList_PhamVi();
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamVi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhamVi: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/DSA4BRICLjMkHg8SHgoJHhEpICwXKAPP',
            'func': 'PKG_CORE_HOSONHANSU_01.LayDSCore_NS_KH_PhamVi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strCore_NS_KH_Id': me.strKeHoach_Id,
            'strPhamViApDung_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhamVi"] = dtReRult;
                    me.genTable_PhamVi(dtReRult, data.Pager);
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
    delete_PhamVi: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/GS4gHgIuMyQeDxIeCgkeESkgLBco',
            'func': 'PKG_CORE_HOSONHANSU_01.Xoa_Core_NS_KH_PhamVi',
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
                    me.getList_PhamVi();
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
    genTable_PhamVi: function (data, iPager) {
        $("#lblPhamVi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhamVi",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.PhamVi.getList_PhamVi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNhanSuQuyen" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "GIOBATDAU"
                },
                {
                    "mDataProp": "PHUTBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "GIOKETTHUC"
                },
                {
                    "mDataProp": "PHUTKETTHUC"
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
    save_Quyen: function (strData_Field_Id, strHanhDong_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {

            'action': 'NS_HoSoNhanSu1_MH/FSkkLB4CLjMkHg8SHgoJHhA0OCQv',
            'func': 'PKG_CORE_HOSONHANSU_01.Them_Core_NS_KH_Quyen',
            'iM': edu.system.iM,
            'strId': me.strQuyen_Id,

            'strCore_NS_KH_PhamVi_Id': edu.system.getValById('dropAAAA'),
            'strCore_NS_KH_Id': me.strKeHoach_Id,
            'strHanhDong_Id': strHanhDong_Id,
            'strTable_Name': edu.system.getValById('txtAAAA'),
            'strColumn_Name': edu.system.getValById('txtAAAA'),
            'strKey_Column': edu.system.getValById('txtAAAA'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strData_Object_Id': edu.system.getValById('dropBangQuyen'),
            'strData_Field_Id': strData_Field_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_HoSoNhanSu1_MH/EjQgHgIuMyQeDxIeCgkeEDQ4JC8P';
            obj_save.func = 'PKG_CORE_HOSONHANSU_01.Sua_Core_NS_KH_Quyen'
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
                    me.getList_Quyen();
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
    getList_Quyen: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/DSA4BRICLjMkHg8SHgoJHhA0OCQv',
            'func': 'PKG_CORE_HOSONHANSU_01.LayDSCore_NS_KH_Quyen',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strCore_NS_KH_PhamVi_Id': edu.system.getValById('dropAAAA'),
            'strCore_NS_KH_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuyen"] = dtReRult;
                    me.genTable_Quyen(dtReRult, data.Pager);
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
    getList_AddQuyen: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/DSA4BRIFIDUgHgcoJC0l',
            'func': 'PKG_CORE_HOSONHANSU_01.LayDSData_Field',
            'iM': edu.system.iM,
            'strData_Object_Id': edu.system.getValById('dropBangQuyen'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtAddQuyen"] = dtReRult;
                    me.genTable_AddQuyen(dtReRult, data.Pager);
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
    delete_Quyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/GS4gHgIuMyQeDxIeCgkeEDQ4JC8P',
            'func': 'PKG_CORE_HOSONHANSU_01.Xoa_Core_NS_KH_Quyen',
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
                    me.getList_Quyen();
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
    genTable_Quyen: function (data, iPager) {
        $("#lblQuyen_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyen",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.Quyen.getList_Quyen()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_DANHMUCAPQuyen_TEN"
                },
                {
                    "mDataProp": "Quyen"
                },
                {
                    "mDataProp": "DONVITINH_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "HIEULUC"
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
    genTable_AddQuyen: function (data, iPager) {
        $("#lblQuyen_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblAddQuyen",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.Quyen.getList_Quyen()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DATA_OBJECT_NAME"
                },
                {
                    "mDataProp": "FIELD_NAME"
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
    save_NhanSuQuyen: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? edu.system.getValById('dropSearch_KeHoachChiTiet') : edu.system.getValById('dropSearch_KeHoachTongHop');
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.Them_KLGD_DanhMucApNhanSuQuyen_Ad',
            'iM': edu.system.iM,
            'strId': me.strNhanSuQuyen_Id,
            'strKLGD_DanhMucApNhanSuQuyen_Id': edu.system.getValById('dropDMNhanSuQuyen'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strDonViTinh_Id': edu.system.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'dNhanSuQuyen': edu.system.getValById('txtNhanSuQuyen'),
            'dHieuLuc': 1,
            'strMoTa': edu.system.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl';
            obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApNhanSuQuyen_Ad'
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
                    me.getList_NhanSuQuyen();
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
    getList_NhanSuQuyen: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_HoSoNhanSu1_MH/DSA4BRICLjMkHg8SHgoJHhEpICwXKB4PEgPP',
            'func': 'PKG_CORE_HOSONHANSU_01.LayDSCore_NS_KH_PhamVi_NS',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strCore_NS_KH_PhamVi_Id': me.strPhamVi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtNhanSuQuyen"] = dtReRult;
                    me.genTable_NhanSuQuyen(dtReRult, data.Pager);
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
    delete_NhanSuQuyen: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl',
            'func': 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApNhanSuQuyen_Ad',
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
                    me.getList_NhanSuQuyen();
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
    genTable_NhanSuQuyen: function (data, iPager) {
        $("#lblNhanSuQuyen_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhanSuQuyen",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.NhanSuQuyen.getList_NhanSuQuyen()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_DANHMUCAPNhanSuQuyen_TEN"
                },
                {
                    "mDataProp": "NhanSuQuyen"
                },
                {
                    "mDataProp": "DONVITINH_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "HIEULUC"
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
}