/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function Mien() { };
Mien.prototype = {
    strMien_Id: '',
    dtMien: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_Mien();
        me.getList_LoaiQuyetDinh();
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.DANHGIA", "dropDanhGia");
        $("#btnSave_Mien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            if (arrChecked_Id) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_Mien(arrChecked_Id[i]);
                }
            }
        });
        $("#btnXoaMien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Mien(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_Mien();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Mien();
            }
        });

        edu.extend.genBoLoc_HeKhoa("_CB");

        $("#dropSearch_LoaiQuyetDinh").on("select2:select", function () {
            me.getList_QuyetDinh();
        });
        $("#dropSearch_QuyetDinh").on("select2:select", function () {
            me.getList_HocPhan();
        });
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_QuyetDinh_HocPhan/LayDSHocPhanTheoQuyetDinh',
            'type': 'GET',
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
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
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_Mien: function (strId) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtMien.rs.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'D_Mien/Them_Diem_NH_CongNhan_Mien',
            'type': 'POST',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDanhGia_Id': edu.util.getValById('dropDanhGia'),
            'strQLSV_QuyetDinh_Id': aData.QLSV_QUYETDINH_ID,
            'strGhiChu': edu.util.getValById('txtGhiChu' + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID),
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'NS_HeSo_Mien/CapNhat';
        //}
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
                    //me.getList_Mien();
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
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_Mien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Mien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_Mien/LayDSNguoiHocTheoQuyetDinh',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropSearch_QuyetDinh'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_CB'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLop_CB'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtMien = dtReRult;
                    me.genTable_Mien(dtReRult, data.Pager);
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
    delete_Mien: function (strId) {
        var me = this;
        var aData = me.dtMien.rs.find(e => e.ID == strId);
        //--Edit
        var obj_delete = {
            'action': 'D_Mien/Xoa_Diem_NH_CongNhan_Mien',
            'type': 'POST',
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_QuyetDinh_Id': aData.QLSV_QUYETDINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
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
                    me.getList_Mien();
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
    genTable_Mien: function (data, iPager) {
        $("#lblMien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblMien",
            aaData: data.rs,
            //bPaginate: {
            //    strFuntionName: "main_doc.Mien.getList_Mien()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3,7,8],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblDanhGia' + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID +'"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblThoiGian' + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input class="form-control" id="txtGhiChu' + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblNgayTao' + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID + '"></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span id="lblNguoiTao' + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID + '"></span>';
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
        data.rsKetQua.forEach(aData => {
            $("#lblDanhGia" + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID).html(edu.util.returnEmpty(aData.DANHGIA_TEN));
            $("#lblThoiGian" + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID).html(edu.util.returnEmpty(aData.THOIGIAN));
            $("#lblNgayTao" + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID).html(edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY_HHMMSS));
            $("#lblNguoiTao" + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID).html(edu.util.returnEmpty(aData.NGUOITAO_TAIKHOAN));
            $("#txtGhiChu" + aData.QLSV_NGUOIHOC_ID + "_" + aData.DAOTAO_HOCPHAN_ID).val(edu.util.returnEmpty(aData.GHICHU));
        })
        /*III. Callback*/
    },
    viewForm_Mien: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtMien, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropHoatDong", data.HOATDONG_ID);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAIDIADIEM_ID);
        edu.util.viewValById("dropPhamVi", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropDonViTinh", data.DONVITINH_ID);
        edu.util.viewValById("txtHeSo", data.HESOQUYDOIMien);
        edu.util.viewValById("dropMoHinhHoc", data.MOHINHHOC_ID);
        me.strMien_Id = data.ID;
    },


    getList_LoaiQuyetDinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh_ThucThi/LayDSLoaiQuyetDinh',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiQuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_LoaiQuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LoaiQuyetDinh"],
            type: "",
            title: "Chọn loại quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_QuyetDinh: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_QuyetDinh/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strLopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropSearch_LoaiQuyetDinh'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_QuyetDinh(json);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: obj_list.type,
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    cbGenCombo_QuyetDinh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "SOQUYETDINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_QuyetDinh"],
            type: "",
            title: "Chọn quyết định",
        }
        edu.system.loadToCombo_data(obj);
    },
}