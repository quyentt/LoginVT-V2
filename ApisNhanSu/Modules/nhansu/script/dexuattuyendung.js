/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DeXuatTuyenDung() { };
DeXuatTuyenDung.prototype = {
    strDeXuatTuyenDung_Id: '',
    dtDeXuatTuyenDung: [],
    strHoSoUngVien_Id: '',
    dtHoSoUngVien: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        me.getList_DeXuatTuyenDung();
        me.getList_DonVi();
        me.getList_Nam();
        me.getList_KeHoach();

        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.DATO, "dropDanToc");
        edu.system.loadToCombo_DanhMucDuLieu(constant.setting.CATOR.NS.GITI, "dropGioiTinh");
        //me.getList_ThoiGianDaoTao();

        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoach();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            me.getList_DotTuyenDung();
        });
        $("#dropSearch_Dot").on("select2:select", function () {
            me.getList_DeXuatTuyenDung();
        });
        edu.system.loadToCombo_DanhMucDuLieu("NS.TD.VITRICONGVIEC", "dropViTri");
        $("#tblDeXuatTuyenDung").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDeXuatTuyenDung.find(e => e.ID == strId);
            edu.util.viewValById("dropDonVi", data.DONVIDEXUAT_ID);
            edu.util.viewValById("dropViTri", data.VITRICONGVIECDEXUAT_ID);
            edu.util.viewValById("txtSoLuong", data.SOLUONGDEXUAT);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            me.strDeXuatTuyenDung_Id = data.ID;
            $('#themmoidexuat').modal('show');
            
        });
        $("#tblDeXuatTuyenDung").delegate(".btnHoSoUngVien", "click", function () {
            var strId = this.id;
            me.strDeXuatTuyenDung_Id = strId;
            $('#modalHoSoUngVien').modal('show');
            me.getList_HoSoUngVien();
        });
        $("#btnAdd_DeXuatTuyenDung").click(function () {
            var data = {};
            edu.util.viewValById("dropDonVi", data.DONVIDEXUAT_ID);
            edu.util.viewValById("dropViTri", data.VITRICONGVIECDEXUAT_ID);
            edu.util.viewValById("txtSoLuong", data.SOLUONGDEXUAT);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            me.strDeXuatTuyenDung_Id = data.ID;
            $('#themmoidexuat').modal('show');
        });
        $("#btnSave_DeXuatTuyenDung").click(function () {
            me.save_DeXuatTuyenDung();
        });
        $("#btnDelete_DeXuatTuyenDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDeXuatTuyenDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DeXuatTuyenDung(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_DeXuatTuyenDung();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_DeXuatTuyenDung();
            }
        });

        $("#tblHoSoUngVien").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtHoSoUngVien.find(e => e.ID == strId);
            edu.util.viewValById("txtMaHoSo", data.MAHOSO);
            edu.util.viewValById("txtHoDem", data.HODEM);
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtNgaySinh", data.NGAYSINH);
            edu.util.viewValById("dropGioiTinh", data.GIOITINH_ID);
            edu.util.viewValById("dropDanToc", data.DANTOC_ID);
            edu.util.viewValById("txtCCCD", data.CCCD);
            edu.util.viewValById("txtNgayCapCCCD", data.CCCD_NGAYCAP);
            edu.util.viewValById("txtNoiCap", data.CCCD_NOICAP);
            //edu.util.viewValById("txtMoTa", data.MOTA);
            //edu.util.viewHTMLById("txtMoTa", data.MOTA);
            me["strHoSoUngVien_Id"] = data.ID;
            $('#themmoiHoSoUngVien').modal('show');

        });
        $(".btnAdd_HoSoUngVien").click(function () {
            var strId = this.id;
            var data = {};
            edu.util.viewValById("txtDTD_TuNgay", data.TUNGAY);
            edu.util.viewValById("txtDTD_DenNgay", data.DENNGAY);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            me["strHoSoUngVien_Id"] = data.ID;
            $('#themmoiHoSoUngVien').modal('show');
        });
        $(".btnSave_HoSoUngVien").click(function () {
            me.save_HoSoUngVien();
        });
        $(".btnDelete_HoSoUngVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHoSoUngVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HoSoUngVien(arrChecked_Id[i]);
                }
            });
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DeXuatTuyenDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/FSkkLB4PEh4VBR4KJAkuICIpHgUkGTQgNQPP',
            'func': 'pkg_ns_td_thongtin.Them_NS_TD_KeHoach_DeXuat',
            'iM': edu.system.iM,
            'strId': me.strDeXuatTuyenDung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Dot_Id': edu.system.getValById('dropSearch_Dot'),
            'strDonViDeXuat_Id': edu.system.getValById('dropDonVi'),
            'strNguoiDeXuat_Id': edu.system.userId,
            'strViTriCongViecDeXuat_Id': edu.system.getValById('dropViTri'),
            'dSoLuongDeXuat': edu.system.getValById('txtSoLuong') ? edu.system.getValById('txtSoLuong') : undefined,
            'strMoTa': edu.system.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_TD_ThongTin_MH/EjQgHg8SHhUFHgokCS4gIikeBSQZNCA1';
            obj_save.func = 'pkg_ns_td_thongtin.Sua_NS_TD_KeHoach_DeXuat'
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
                    me.getList_DeXuatTuyenDung();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DeXuatTuyenDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgUkGTQgNQPP',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_DeXuat',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Id': edu.system.getValById('dropSearch_KeHoach'),
            'strNS_TD_KeHoach_Dot_Id': edu.system.getValById('dropSearch_Dot'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDeXuatTuyenDung = dtReRult;
                    me.genTable_DeXuatTuyenDung(dtReRult, data.Pager);
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
    delete_DeXuatTuyenDung: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikeBSQZNCA1',
            'func': 'pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach_DeXuat',
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
                    me.getList_DeXuatTuyenDung();
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
    genTable_DeXuatTuyenDung: function (data, iPager) {
        $("#lblDeXuatTuyenDung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeXuatTuyenDung",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DeXuatTuyenDung.getList_DeXuatTuyenDung()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "VITRICONGVIECDEXUAT_TEN"
                },
                {
                    "mDataProp": "SOLUONGDEXUAT"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "NGUOIDEXUAT_TAIKHOAN"
                },
                {
                    "mDataProp": "DONVIDEXUAT_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnHoSoUngVien" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
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
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_HoSoUngVien: function () {
        var me = this;
        var obj_notify = {};
        var arrNgaySinh = [];
        var strNgaySinh = $("#txtNgaySinh").val();
        if (strNgaySinh && strNgaySinh.indexOf("/") != -1) {
            arrNgaySinh = strNgaySinh.split("/");
        }
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/FSkkLB4PEh4VBR4KJAkuICIpHgUkGTQgNR4JEgPP',
            'func': 'pkg_ns_td_thongtin.Them_NS_TD_KeHoach_DeXuat_HS',
            'iM': edu.system.iM,
            'strId': me.strHoSoUngVien_Id,
            'strNS_TD_KeHoach_DeXuat_Id': me.strDeXuatTuyenDung_Id,
            'strHoDem': edu.system.getValById('txtHoDem'),
            'strTen': edu.system.getValById('txtTen'),
            'strMaHoSo': edu.system.getValById('txtAAAA'),
            'strCCCD': edu.system.getValById('txtCCCD'),
            'strCCCD_NgayCap': edu.system.getValById('txtNgayCapCCCD'),
            'strCCCD_NoiCap': edu.system.getValById('txtNoiCap'),
            'strGioiTinh_Id': edu.system.getValById('dropGioiTinh'),
            'strNgaySinh_Ngay': arrNgaySinh[0],
            'strNgaySinh_Thang': arrNgaySinh[1],
            'strNgaySinh_Nam': arrNgaySinh[2],
            'strDanhGia_Id': edu.system.getValById('dropAAAA'),
            'strDanToc_Id': edu.system.getValById('dropDanToc'),
            'strNhanSu_HoSoCanBo_V2_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_TD_ThongTin_MH/EjQgHg8SHhUFHgokCS4gIikeBSQZNCA1HgkS';
            obj_save.func = 'pkg_ns_td_thongtin.Sua_NS_TD_KeHoach_DeXuat_HS'
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
                    me.getList_HoSoUngVien();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HoSoUngVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgUkGTQgNR4JEgPP',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_DeXuat_HS',
            'iM': edu.system.iM,
            'strNS_TD_KeHoach_Id': edu.system.getValById('dropAAAA'),
            'strNS_TD_KeHoach_Dot_Id': edu.system.getValById('dropAAAA'),
            'strNS_TD_KeHoach_HD_Id': edu.system.getValById('dropAAAA'),
            'strNS_TD_KeHoach_DeXuat_Id': me.strDeXuatTuyenDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtHoSoUngVien = dtReRult;
                    me.genTable_HoSoUngVien(dtReRult, data.Pager);
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
    delete_HoSoUngVien: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/GS4gHg8SHhUFHgokCS4gIikeBSQZNCA1',
            'func': 'pkg_ns_td_thongtin.Xoa_NS_TD_KeHoach_DeXuat',
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
                    me.getList_HoSoUngVien();
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
    genTable_HoSoUngVien: function (data, iPager) {
        $("#lblHoSoUngVien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHoSoUngVien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.HoSoUngVien.getList_HoSoUngVien()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MAHOSO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "VITRICONGVIECDEXUAT_TEN"
                },
                {
                    "mDataProp": "NGAYSINH"
                },
                {
                    "mDataProp": "CCCD"
                },
                {
                    "mDataProp": "GIOITINH_TEN"
                },
                {
                    "mDataProp": "DANTOC_TEN"
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
    

    getList_DonVi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_CoCauToChuc/LayDanhSach',
            'type': 'GET',
            'strCoCauToChucCha_Id': '',
            'dTrangThai': -1,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.genComBo_DonVi(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_DonVi: function (data, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropDonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_Nam: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_TD_Chung_MH/DSA4BRIPICweDxIeFQUP',
            'func': 'pkg_ns_td_chung.LayDSNam_NS_TD',
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
                selectOne: true,
            },
            renderPlace: ["dropSearch_Nam", "dropNam"],
            title: "Chọn Năm"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIp',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNam': edu.system.getValById('dropSearch_Nam'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoach = dtReRult;
                    me.genCombo_KeHoach(dtReRult, data.Pager);
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
    genCombo_KeHoach: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true,
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_DotTuyenDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_TD_ThongTin_MH/DSA4BRIPEh4VBR4KJAkuICIpHgUuNQPP',
            'func': 'pkg_ns_td_thongtin.LayDSNS_TD_KeHoach_Dot',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNS_TD_KeHoach_Id': edu.system.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDotTuyenDung = dtReRult;
                    me.genCombo_DotTuyenDung(dtReRult, data.Pager);
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
    genCombo_DotTuyenDung: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NS_TD_KEHOACH_TEN",
                selectOne: true,
            },
            renderPlace: ["dropSearch_Dot"],
            title: "Chọn đợt"
        };
        edu.system.loadToCombo_data(obj);
    },
}