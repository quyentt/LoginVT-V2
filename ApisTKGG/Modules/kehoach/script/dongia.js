/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DonGia() { };
DonGia.prototype = {
    strDonGia_Id: '',
    dtDonGia: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_DonGia();
        me.getList_ThoiGian();
        me.getList_DMDonGia();
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.DONVITINH.APDONGIA", "dropSearch_DonViTinh,dropDonViTinh");
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAI.DANHMUCAPDONGIA", "dropPhanLoai");
        $("#tblDonGia").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDonGia.find(e => e.ID == strId);
            var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? $("#dropSearch_KeHoachChiTiet option:seleted").text() : $("#dropSearch_KeHoachTongHop option:seleted").text();
            me["strDonGia_Id"] = data.ID;
            edu.util.viewValById("dropDMDonGia", data.KLGD_DANHMUCAPDONGIA_ID);
            edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
            edu.util.viewValById("txtDonGia", data.DONGIA);
            edu.util.viewValById("txtMoTa", data.MOTA);
            $("#lblPhamViApDung").html(strPhamViApDung_Id);
            $("#myModal_DonGia").modal("show");
        });
        $("#btnAdd_DonGia").click(function () {
            var data = {};
            me["strDonGia_Id"] = data.ID;
            $("#myModal_DonGia").modal("show");
            me["strDonGia_Id"] = data.ID;
            edu.util.viewValById("dropDMDonGia", data.KLGD_DANHMUCAPDONGIA_ID);
            edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
            edu.util.viewValById("txtDonGia", data.DONGIA);
            edu.util.viewValById("txtMoTa", data.MOTA);
            var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? $("#dropSearch_KeHoachChiTiet option:seleted").text() : $("#dropSearch_KeHoachTongHop option:seleted").text();
            $("#lblPhamViApDung").html(strPhamViApDung_Id);
        });
        $("#btnSave_DonGia").click(function () {
            me.save_DonGia();
        });
        $("#btnDelete_DonGia").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDonGia", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DonGia(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_DonGia();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DonGia();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_KeHoachTongHop();
        });
        $('#dropSearch_KeHoachTongHop').on('select2:select', function () {
            me.getList_KeHoachChiTiet();
        });
        $('#dropSearch_KeHoachChiTiet').on('select2:select', function () {
            me.getList_DonGia();
        });


        $("#tblDMDonGia").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDMDonGia.find(e => e.ID == strId);
            me["strDMDonGia_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
            edu.util.viewValById("dropHieuLuc", data.HIEULUC);
            $("#myModal_DMDonGia").modal("show");
        });
        $("#btnAdd_DMDonGia").click(function () {
            var data = {};
            me["strDMDonGia_Id"] = data.ID;
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
            edu.util.viewValById("dropHieuLuc", data.HIEULUC);
            $("#myModal_DMDonGia").modal("show");
        });
        $("#btnSave_DMDonGia").click(function () {
            me.save_DMDonGia();
        });
        $("#btnDelete_DMDonGia").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDMDonGia", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DMDonGia(arrChecked_Id[i]);
                }
            });
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
    save_DonGia: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? edu.system.getValById('dropSearch_KeHoachChiTiet'): edu.system.getValById('dropSearch_KeHoachTongHop');
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.Them_KLGD_DanhMucApDonGia_Ad',
            'iM': edu.system.iM,
            'strId': me.strDonGia_Id,
            'strKLGD_DanhMucApDonGia_Id': edu.system.getValById('dropDMDonGia'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strDonViTinh_Id': edu.system.getValById('dropDonViTinh'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'dDonGia': edu.system.getValById('txtDonGia'),
            'dHieuLuc': 1,
            'strMoTa': edu.system.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl';
            obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApDonGia_Ad'
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
                    me.getList_DonGia();
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
    getList_DonGia: function (strDanhSach_Id) {
        var me = this;
        var strPhamViApDung_Id = edu.system.getValById('dropSearch_KeHoachChiTiet') ? edu.system.getValById('dropSearch_KeHoachChiTiet'): edu.system.getValById('dropSearch_KeHoachTongHop');
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIB4AJQPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia_Ad',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch_TuKhoa'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strKLGD_DanhMucApDonGia_Id': edu.system.getValById('dropSearch_DMDonGia'),
            'strDonViTinh_Id': edu.system.getValById('dropSearch_DonViTinh'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDonGia"] = dtReRult;
                    me.genTable_DonGia(dtReRult, data.Pager);
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
    delete_DonGia: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl',
            'func': 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia_Ad',
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
                    me.getList_DonGia();
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
    genTable_DonGia: function (data, iPager) {
        $("#lblDonGia_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDonGia",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DonGia.getList_DonGia()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "KLGD_DANHMUCAPDONGIA_TEN"
                },
                {
                    "mDataProp": "DONGIA"
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
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DMDonGia: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/FSkkLB4KDQYFHgUgLykMNCIAMQUuLwYoIAPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.Them_KLGD_DanhMucApDonGia',
            'iM': edu.system.iM,
            'strId': me.strDMDonGia_Id,

            'strPhanLoai_Id': edu.system.getValById('dropPhanLoai'),
            'strMa': edu.system.getValById('txtMa'),
            'strTen': edu.system.getValById('txtTen'),
            'strMoTa': edu.system.getValById('txtMoTa'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBigg';
            obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApDonGia'
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
                    me.getList_DMDonGia();
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
    getList_DMDonGia: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/DSA4BRIKDQYFHgUgLykMNCIAMQUuLwYoIAPP',
            'func': 'PKG_KLGV_V2_TINHTIEN.LayDSKLGD_DanhMucApDonGia',
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
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_DMDonGia", "dropDMDonGia"],
                        type: "",
                        title: "Chọn danh mục đơn giá",
                    })
                    me["dtDMDonGia"] = data.Data;
                    me.genTable_DMDonGia(data.Data);
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
    delete_DMDonGia: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_TinhTien_MH/GS4gHgoNBgUeBSAvKQw0IgAxBS4vBigg',
            'func': 'PKG_KLGV_V2_TINHTIEN.Xoa_KLGD_DanhMucApDonGia',
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
                    me.getList_DMDonGia();
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
    genTable_DMDonGia: function (data, iPager) {
        $("#lblDMDonGia_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDMDonGia",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DonGia.getList_DMDonGia()",
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
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC? "": "Hết hiệu lực";
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
}