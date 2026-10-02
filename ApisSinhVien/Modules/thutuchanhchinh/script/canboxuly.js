/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CanBoXuLy() { };
CanBoXuLy.prototype = {
    strCanBoXuLy_Id: '',
    dtCanBoXuLy: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_CanBoXuLy();
        edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.DIEMMOCKIEMTRA", "dropSearch_MocKiemTra");
        //edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.TINHTRANGXULY", "dropTinhTrang,dropSearch_TinhTrang");
        $("#tblCanBoXuLy").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strCanBoXuLy_Id = strId;
            $('#myModalLichSu').modal('show');
            me.getList_LichSu(this);
        });
        $("#tblCanBoXuLy").delegate(".btnXemFile", "click", function () {
            var strId = this.id;
            me.getList_TuNhapHoSo(strId);
        });
        $("#tblCanBoXuLy").delegate(".btnXemTinNhan", "click", function () {
            var strId = this.id;
            var aData = me.dtCanBoXuLy.find(e => e.ID == strId);
            //me.strCanBoXuLy_Id = strId;
            //$('#myModalLichSu').modal('show');
            //me.getList_LichSu(this);
            me.genHtmlChat(strId, edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            me.getList_TinNhan(strId);
        });
        $("#btnSave_XuLy").click(function () {
            $("#lblYeuCau").html("");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            if (arrChecked_Id.length == 1) {
                me.getList_TinhTrang(arrChecked_Id[0]);
            } else {
                //edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.TINHTRANGXULY", "dropTinhTrang");
                me.getList_TinhTrangXuLy();
            }
            var strYeuCau = "";
            arrChecked_Id.forEach(e => {
                strYeuCau += ", " + me.dtCanBoXuLy.find(ele => ele.ID === e).THONGTINYEUCAU;
            });
            if (strYeuCau) strYeuCau = strYeuCau.substring(2);
            $("#lblYeuCau").html(strYeuCau);
            me.popup();
        });
        $("#btnSave_CanBoXuLy").click(function () {

            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $('#myModal').modal('hide');
            edu.system.confirm("Bạn có chắc chắn lưu dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_CanBoXuLy(arrChecked_Id[i]);
                }
            });
        });
        $("#btnXoaCanBoXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CanBoXuLy(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_CanBoXuLy();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_CanBoXuLy();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblCanBoXuLy" });
        });


        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ChuongTrinhDaoTao();
        me.getList_LopQuanLy();
        me.getList_NguoiDung();
        me.getList_TinhTrangXuLy();
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {

                me.activeTabFun();
            }
        });
        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
           
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
           
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {

            me.getList_LopQuanLy();
           
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {

            var x = $(this).val();
           
        });
        $('#dropSearch_NguoiThu_IHD').on('select2:select', function (e) {

           
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {

           
        });
        $('#dropSearch_NamNhapHoc_IHD').on('select2:select', function (e) {

           
        });

        $("#zoneChat").delegate('.btnSendMessage', 'click', function (e) {
            var roomId = this.title;
            me.save_TinNhan(roomId)
        });
        $("#zoneChat").delegate('.txtSendMessage', 'keypress', function (e) {
            if (e.which === 13) {
                var roomId = this.title;
                me.save_TinNhan(roomId)
            }
        });

        $("#zoneChat").delegate(".btnDeleteTin", "click", function (e) {

            var strId = this.id;
            var strCha_Id = $(this).attr("name");
            me.delete_TinNhan(strId, strCha_Id);
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strCanBoXuLy_Id = "";
        edu.util.viewValById("dropThoiGian", edu.util.getValById("dropSearch_ThoiGian"));
        edu.util.viewValById("dropHoatDong", edu.util.getValById("dropSearch_HoatDong"));
        edu.util.viewValById("dropDiaDiem", edu.util.getValById("dropSearch_DiaDiem"));
        edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtHeSo", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CanBoXuLy: function (strId) {
        var me = this;
        var obj_notify = {};
        var obj = me.dtCanBoXuLy.find(e => e.ID === strId);
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_NguoiHoc_YeuCau_XL/ThemMoi',
            'type': 'POST',
            'strQLSV_NguoiHoc_Id': obj.QLSV_NGUOIHOC_ID,
            'strNguoiXuLy_Id': edu.system.userId,
            'strTinhTrangXuLy_Id': edu.util.getValById('dropTinhTrang'),
            'strMotCua_NguoiHoc_YeuCau_Id': strId,
            'strMotCua_DanhMuc_Id': obj.MOTCUA_DANHMUC_ID,
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
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
                    me.getList_CanBoXuLy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CanBoXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_XuLy/LayDSTheoDoiTinhTrangYeuCau',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_IHD'),
            'strCanBoXuLy_Id': edu.util.getValById('dropSearch_CanBo'),
            'strTuNgay': edu.util.getValById('txtSearch_TuNgay_IHD'),
            'strDenNgay': edu.util.getValById('txtSearch_DenNgay_IHD'),
            'strTinhTrangKiemTra_Id': edu.util.getValById('dropSearch_MocKiemTra'),
            'strTinhTrangXuLy_Id': edu.util.getValById('dropSearch_TinhTrang'),
            'strNguoiTao_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCanBoXuLy = dtReRult;
                    me.genTable_CanBoXuLy(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_CanBoXuLy: function (data, iPager) {
        $("#lblCanBoXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCanBoXuLy",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.CanBoXuLy.getList_CanBoXuLy()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3,7,8,9,10, 11, 12, 13,14, 16],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "THONGTINYEUCAU"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mDataProp": "NGAYTAO_DUKIEN_DD_MM_YYYY"
                },
                {
                    "mDataProp": "NGAYTAO_THUCTE_DD_MM_YYYY"
                },
                {
                    //"mDataProp": "TINHTRANGHIENTAI_TEN"
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXemTinNhan" id="' + aData.ID + '" title="Xem"><i class="fa fa-eye color-active"></i> ' + edu.util.returnEmpty(aData.TINHTRANGHIENTAI_TEN) + '</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXemFile" id="' + aData.ID + '" title="Xem"><i class="fa fa-eye color-active"></i> Xem</a></span>';
                    }
                }, 
                {
                    "mDataProp": "CANBOXULY_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Xem"><i class="fa fa-eye color-active"></i> Xem</a></span>';
                    }
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        var iDanhGia = aData.DANHGIACHATLUONG_MA;
                        if (iDanhGia) iDanhGia = parseInt(iDanhGia);
                        else {
                            return "";
                        }
                        var strKetQua = '<div id="zonechonsao" class="poiter">';
                        for (var i = 1; i <= iDanhGia; i++) {
                            strKetQua += '<i class="fa fa-star chonsao" id="' + i + '" name="' + aData.MOTCUA_NGUOIHOC_YEUCAU_ID + '" style="padding-right: 3px; color: orange"></i>';
                        }
                        for (var i = iDanhGia + 1; i <= 5; i++) {
                            strKetQua += '<i class="fa fa-star-o chonsao" id="' + i + '" name="' + aData.MOTCUA_NGUOIHOC_YEUCAU_ID + '" style="padding-right: 3px; color: orange"></i>';
                        }
                        strKetQua += '</div>';
                        return strKetQua;
                    }
                },
                {
                    "mDataProp": "NHANXET" 
                },
                {
                    "mDataProp": "TRALOI"
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
    getList_LichSu: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_XuLy/LayDSLichSuXuLyYeuCau',
            'type': 'GET',
            'strMotCua_NguoiHoc_YeuCau_Id': me.strCanBoXuLy_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_LichSu(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_LichSu: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblLichSu",
            aaData: data,
            colPos: {
                center: [0, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mData": "PHAMVIAPDUNG_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "MOTCUA_DANHMUC_TEN"
                },
                {
                    "mDataProp": "TINHTRANGXULY_TEN"
                },
                {
                    "mDataProp": "NGUOIXULY_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYY"
                },
                {
                    "mDataProp": "NGAYXULY_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var objList = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_HeDaoTao(objList, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var objList = {
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_KhoaDaoTao(objList, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var objList = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: "",
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_ChuongTrinhDaoTao(objList, "", "", me.cbGenCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var objList = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
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
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
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
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },

    getList_NguoiDung: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_MotCua_Chung/LayDSNguoiDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NguoiDung(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HeDaoTao_IHD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao_IHD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_IHD").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinh_IHD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_IHD").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
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
            renderPlace: ["dropSearch_Lop_IHD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_NguoiDung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDAYDU",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_CanBo"],
            type: "",
            title: "Chọn cán bộ",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_TuNhapHoSo: function (strMotCua_DanhMuc_Id) {
        var me = this;
        var objGiayTo = me.dtCanBoXuLy.find(e => e.ID === strMotCua_DanhMuc_Id);
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_Chung/LayDSDanhMucMoRong',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': objGiayTo.QLSV_NGUOIHOC_ID,
            'strMotCua_DanhMuc_Id': objGiayTo.MOTCUA_DANHMUC_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDuongDanFile': objGiayTo.DUONGDANFILE,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtTuNhapHoSo = dtReRult;
                    //me.genTable_TuNhapHoSo(dtReRult, data.Pager, strMotCua_DanhMuc_Id);
                    if (data.Id) {
                        var url = edu.system.rootPathUpload + "//" + data.Id;
                        window.open(url, '_blank').focus();
                        //var offsetwidth = document.getElementById("tblTuNhapHoSo").offsetWidth;
                        //$("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Id + '" width="' + offsetwidth + 'px" height="600px"></iframe>');
                    }
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

    getList_TinhTrang: function (strMotCua_NguoiHoc_YeuCau_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_MotCua_XuLy/LayDSTinhTrangXuLyTiep',
            'type': 'GET',
            'strMotCua_NguoiHoc_YeuCau_Id': strMotCua_NguoiHoc_YeuCau_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_TinhTrang(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
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
    cbGenCombo_TinhTrang: function (data) {
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
            renderPlace: ["dropTinhTrang"],
            type: "",
            title: "Chọn tình trạng",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_TinhTrangXuLy: function (strMotCua_NguoiHoc_YeuCau_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_MotCua_XuLy/LayDMucTinhTrangXuLy',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_TinhTrangXuLy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
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
    cbGenCombo_TinhTrangXuLy: function (data) {
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
            renderPlace: ["dropTinhTrang","dropSearch_TinhTrang"],
            type: "",
            title: "Chọn tình trạng",
        }
        edu.system.loadToCombo_data(obj);
    },


    getList_TinNhan: function (strMotCua_NH_YC_XuLy_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_ThongTin/LayDSMotCua_NH_YC_XL_PhanHoi',
            'type': 'GET',
            'strMotCua_NH_YC_XuLy_Id': strMotCua_NH_YC_XuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTab_TinNhan(dtReRult, strMotCua_NH_YC_XuLy_Id);
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
    genTab_TinNhan: function (data, strMotCua_NH_YC_XuLy_Id) {
        var me = this;
        var classPosition = "";
        var show = "";
        var rMess = "";
        data.forEach(aData => {
            if (aData.NGUOITAO_ID == edu.system.userId) { classPosition = "right"; show = "pull-right"; }
            rMess += '<div class="direct-chat-msg ' + classPosition + '" title="' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY) + '">';
            rMess += '<div class="direct-chat-info clearfix">';
            rMess += '<span class="direct-chat-name ' + show + '">' + edu.util.returnEmpty(aData.NGUOITAO_TENDAYDU) + '</span>';
            //rMess += '<span class="direct-chat-timestamp pull-left">23 Jan 2:05 pm</span>';
            rMess += '</div>';
            rMess += '<img class="direct-chat-img" src="' + edu.system.getRootPathImg(aData.ANHDAIDIEN) + '" alt="' + edu.util.returnEmpty(aData.NGUOITAO_TAIKHOAN) + '">';

            rMess += '<div class="direct-chat-text">';
            rMess += edu.util.returnEmpty(aData.NOIDUNG);
            rMess += '</div>';

            rMess += '<div class="action">';
            rMess += '<a class="btn-sm btn btnDeleteTin" id="' + aData.ID + '" name="' + strMotCua_NH_YC_XuLy_Id + '" title="Xóa"><i class="fa fa-trash"></i></a>';
            rMess += '</div>';
            rMess += '<!-- /.direct-chat-text -->';
            rMess += '</div>';
        })
        
        var pointChat = $("#zoneChat #" + strMotCua_NH_YC_XuLy_Id + " .direct-chat-messages");
        pointChat.html(rMess);
        var objDiv = pointChat[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    },
    save_TinNhan: function (strId) {
        var me = this;

        var strTinNhan = $("#txtMessage" + strId).val();
        $("#txtMessage" + strId).val("");
        if (!strTinNhan) return;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_ThongTin/Them_MotCua_NH_YC_XL_PhanHoi',
            'type': 'POST',
            'strMotCua_NH_YC_XuLy_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNoiDung': strTinNhan,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //$("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Message + '" width="800px" height="600px"></iframe>');
                    //edu.system.alert("Cập nhật thành công");
                    me.getList_TinNhan(strId);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_TuNhapHoSo();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    delete_TinNhan: function (strId, strPhanHoi_Id) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_ThongTin/Xoa_MotCua_NH_YC_XL_PhanHoi',
            'type': 'POST',
            'strId': strId,
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
                me.getList_TinNhan(strPhanHoi_Id)
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
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_GiayTo();
                //});
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genHtmlChat: function (room, userName) {
        var me = this;
        if ($("#zoneChat #" + room).length > 0) return;
        var rChat = "";
        rChat += '<div id="' + room + '" class="box box-success direct-chat direct-chat-success" style="float: right; width: 400px; margin-right: 5px">';
        rChat += '<div class="box-header with-border">';
        rChat += '<h3 class="box-title">' + userName + '</h3>';
        rChat += '<div class="box-tools pull-right">';
        //rChat += '<span data-toggle="tooltip" title="" class="badge bg-yellow" data-original-title="3 New Messages">3</span>';
        rChat += '<button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>';
        rChat += '</button>';
        rChat += '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i>';
        rChat += '</button>';
        rChat += '</div>';
        rChat += '</div>';
        rChat += '<div class="box-body" style="height: 450px">';
        rChat += '<div class="direct-chat-messages">';
        rChat += '</div>';
        rChat += '</div>';
        rChat += '<div class="box-footer">';
        rChat += '<div id="userDangNhan' + room + '"></div>';
        rChat += '<div>';
        rChat += '<div class="input-group">';
        rChat += '<input type="text" name="message" id="txtMessage' + room + '" placeholder="Type Message ..." class="form-control txtSendMessage" title="' + room + '">';
        rChat += '<span class="input-group-btn">';
        rChat += '<button type="button" class="btn btn-success  btn-flat btnSendMessage" title="' + room + '">Send</button>';
        rChat += '</span>';
        rChat += '</div>';
        rChat += '</div>';
        rChat += '</div>';
        rChat += '</div>';

        $("#zoneChat").append(rChat);
        $('#zoneChat #' + room).boxWidget();
    }
}