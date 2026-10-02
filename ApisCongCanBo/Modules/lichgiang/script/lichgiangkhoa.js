/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function LichGiangKhoa() { };
LichGiangKhoa.prototype = {
    strThongTin_Id: '',
    dtThongTin: [],
    iNgayBatDau: 0,
    strGiangVien_Id: '',
    arrDay: [],
    dtLichHoc: [],
    strLichHoc_Id: '',
    dtKieuChuyenCan: [],
    dtSinhVien: [],
    strNgayBatDau: '',
    strNgayKetThuc: '',
    dtGiangVienThayDoi: [],
    strDoiLich_Id: '',
    strLoaiXacNhan: '',

    init: function () {
        var me = this;
        
        edu.system.loadToCombo_DanhMucDuLieu("TKB.LICHGIANG.DUYETDOILICH", "dropSearch_TrangThaiDuyet");
        edu.system.loadToCombo_DanhMucDuLieu("TKB.LICHGIANG.XACNHANDOILICH", "dropSearch_KetQuaXuLy");
        me.getList_HocKy();
        me.getList_HocPhan();
        me.getList_NguoiGui();
        me.getList_LGXacNhan();
        me.getList_TrangThaiXacNhan();
        $("#btnSearch").click(function () {
            me.getList_LGXacNhan();
        });

        $('#dropSearch_HocKy').on('select2:select', function (e) {
            me.getList_HocPhan();
            me.getList_NguoiGui();
            me.getList_LGXacNhan();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {

            me.getList_LGXacNhan();
        });
        $('#dropSearch_NguoiGui').on('select2:select', function (e) {

            me.getList_LGXacNhan();
        });
        $('#dropSearch_TrangThaiDuyet').on('select2:select', function (e) {

            me.getList_LGXacNhan();
        });
        $('#dropSearch_KetQuaXuLy').on('select2:select', function (e) {

            me.getList_LGXacNhan();
        });
        $("#tblLichGiang_XacNhan").delegate(".btnEdit", "click", function (e) {
            var strId = this.id;
            me.strDoiLich_Id = strId;
            me.getDetail_DoiLich(strId);
        });
        $("#btnPheDuyet").click(function () {
            $("#modalPheDuyet").modal("show");
            //edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            //$("#btnYes").click(function (e) {
            //    me.save_PhetDuyet(me.strDoiLich_Id);
            //});
            $(".loaiXacNhan").html("");
            me["strLoaiXacNhan"] = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_XacNhanSanPham(me.strDSDiem_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_NHAP');
            me.getList_XacNhan(me.strDoiLich_Id + edu.system.strChucNang_Id, "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_NHAP'); 
        });
        $("#btnLuuPheDuyet").click(function () {
            edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            $("#btnYes").click(function (e) {
                me.save_XacNhan(me.strDoiLich_Id + edu.system.strChucNang_Id, $("#dropPhetDuyet_TrangThai").val());
            });
        });
        $("#btnLuuPheDuyet2").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLichGiang_XacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng ?");
                return;
            }
            arrChecked_Id.forEach(e => {
                me.save_XacNhan(e + edu.system.strChucNang_Id, $("#dropPhetDuyet_TrangThai2").val())
            })
            //edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            //$("#btnYes").click(function (e) {
            //    me.save_PhetDuyet(me.strDoiLich_Id);
            //});
        });
        $("#btnDuyet").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLichGiang_XacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng ?");
                return;
            }
            $("#modalPheDuyet2").modal("show");
            //edu.system.confirm("Bạn có chắc chắn phê duyệt không?");
            //$("#btnYes").click(function (e) {
            //    me.save_PhetDuyet(me.strDoiLich_Id);
            //});
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblLichGiang_XacNhan" });
        });
    },
    
    getList_LGXacNhan: function (strDanhSach_Id) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSLichGiang_Doi_PhamVi_PC',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strNgayGuiYeuCau_TuNgay': edu.util.getValById('txtSearch_TuNgay'),
            'strNgayGuiYeuCau_DenNgay': edu.util.getValById('txtSearch_DenNgay'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiGuiYeuCau_Id': edu.util.getValById('dropSearch_NguoiGui'),
            'strTrangThaiDuyet_Id': edu.util.getValById('dropSearch_TrangThaiDuyet'),
            'strTrangThaiXuLy_Id': edu.util.getValById('dropSearch_KetQuaXuLy'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLGXacNhan"] = dtReRult;
                    me.genTable_LGXacNhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_LGXacNhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblLichGiang_XacNhan",
            bPaginate: {
                strFuntionName: "main_doc.LichGiangKhoa.getList_LGXacNhan()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,4, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "LOPHOCPHAN_TEN",
                },
                {
                    "mDataProp": "NGUOIYEUCAU_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mDataProp": "NGUOIDUYET_TAIKHOAN"
                },
                {
                    //"mDataProp": "ThoiGianDuyet - TinhTrangDuyet_Ten",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THOIGIANDUYET) + " - " + edu.util.returnEmpty(aData.TINHTRANGDUYET_TEN);
                    }
                },
                {
                    "mDataProp": "NGUOIXULY_TAIKHOAN"
                },
                {
                    //"mDataProp": "ThoiGianXuLy - KetQuaXuLy - NoiDungXuLy",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THOIGIANXULY) + " - " + edu.util.returnEmpty(aData.KETQUAXULY) + " - " + edu.util.returnEmpty(aData.NOIDUNGXULY);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
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
   

    save_XacNhan: function (strSanPham_Id, strTinhTrang_Id) {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'KHCT_LichGiang_DoiLich/Them_LichGiang_CapDoThongQua',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': edu.util.getValById('txtAAAA'),
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(data.Message);
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
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_Chung_MH/DSA4BRIJIC8pBS4vJhkgIg8pIC8P',
            'func': 'pkg_diem_chung.LayDSHanhDongXacNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.loadBtnXacNhan(data.Data, strTable_Id);
                }
            },

            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id) {
        var me = this;
        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSLichGiang_CapDoThongQua',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strsanpham_Id': strSanPham_Id,
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getDetail_DoiLich: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayTTLichGiang_Doi',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': strId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.viewForm_DoiLich_View(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    viewForm_DoiLich_View: function (data, iPager) {
        var me = this;
        if (data.length > 0) {
            var aData = data[0];
            edu.util.viewValById("txtNoiDungDoiLich_View", aData.NOIDUNG);
            edu.util.viewValById("txtTenLopHocPhan_View", aData.LOPHOCPHAN_TEN);
            edu.util.viewValById("txtNgayHoc_View", aData.NGAYHOC);
            edu.util.viewValById("txtNgayHoc_DoiSang_View", aData.NGAYHOC_THAYDOI);
            edu.util.viewValById("txtTietBatDau_View", aData.TIETBATDAU);
            edu.util.viewValById("txtTietBatDau_DoiSang_View", aData.TIETBATDAU_THAYDOI);
            edu.util.viewValById("txtTietKetThuc_View", aData.TIETKETTHUC);
            edu.util.viewValById("txtTietKetThuc_DoiSang_View", aData.TIETKETTHUC_THAYDOI);
            edu.util.viewValById("txtPhongHoc_View", aData.PHONGHOC_TEN);
            edu.util.viewValById("txtPhongHoc_DoiSang_View", aData.PHONGHOC_THAYDOI_TEN);
            var html = "";
            data.forEach((e, nRow) => {
                html += '<div class="form-item on-row form-add-info">';
                html += '<label for="">Giảng viên</label>';
                html += '<div class="input-group">';
                html += '<input type="text" class="form-control" value="' + edu.util.returnEmpty(e.GIANGVIEN_HOVATEN) + '" disabled>';
                html += '<i class="fal fa-user-crown"></i>';
                html += '</div>';
                html += '<div class="right">';
                html += '<div class="arrow">';
                html += '<span>Đổi sang</span>';
                html += '</div>';
                html += '<label for="">Giảng viên</label>';
                html += '<div class="input-group">';
                html += '<input type="text" class="form-control" value="' + edu.util.returnEmpty(e.GIANGVIEN_THAYDOI_HOVATEN) + '" disabled>';
                html += '</select>';
                html += '<i class="fal fa-user-crown"></i>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            });
            $("#tblDoiGiangVien_View").html(html);
            $("#modalXemLich").modal("show");
        }

    },
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/

    getList_HocKy: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayThoiGian',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocKy(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
            },
            renderPlace: ["dropSearch_HocKy"],
            title: "Chọn học kỳ"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },

    getList_HocPhan: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSHocPhanMucKhoaQuanLy',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },

    getList_NguoiGui: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSNguoiGuiKhoaQuanLy',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_HocKy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_NguoiGui(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_NguoiGui: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                mRender: function (nRow, aData) {
                    return aData.NGUOIYEUCAU_MASO + " - " + aData.NGUOIYEUCAU_HODEM + " " + aData.NGUOIYEUCAU_TEN
                }
            },
            renderPlace: ["dropSearch_NguoiGui"],
            title: "Chọn người gửi"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },

    getList_TrangThaiXacNhan: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'KHCT_LichGiang_DoiLich/LayDSTinhTrangCapDo',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strChucNang_Id': edu.system.strChucNang_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_TrangThaiXacNhan(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_TrangThaiXacNhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN"
            },
            renderPlace: ["dropPhetDuyet_TrangThai2", "dropPhetDuyet_TrangThai"],
            title: "Chọn trạng thái"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },
}