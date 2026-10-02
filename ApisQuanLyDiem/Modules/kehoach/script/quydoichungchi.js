/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function QuyDoiChungChi() { };
QuyDoiChungChi.prototype = {
    dtQuyDoiChungChi: [],
    strQuyDoiChungChi_Id: '',
    strChiTiet_Id: '',
    arrPhamVi: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.CHUNGCHI.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoaiChungChi");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.PHUONGTHUCQUYDOI", "dropPhuongThucQuyDoi");
        me.getList_ChungChi();
        me.getList_HocPhan();
        me.getList_QuyDoiChungChi();
        me.getList_HocPhan2();
        me.getList_CongThuc();
        me.getList_DauDiem();
        me.getList_CCTC();

        $("#btnSearch").click(function (e) {
            me.getList_QuyDoiChungChi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_QuyDoiChungChi();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });

        $("#btnSave_QuyDoiChungChi").click(function (e) {
            me.save_QuyDoiChungChi();
        });
        $("#btnXoaQuyDoiChungChi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblQuyDoiChungChi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_QuyDoiChungChi(arrChecked_Id[i]);
                }
            });
        });
        $("#tblQuyDoiChungChi").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblQuyDoiChungChi");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtQuyDoiChungChi, "ID")[0];
                me.viewEdit_QuyDoiChungChi(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblQuyDoiChungChi").delegate('.btnBangQuyDoi', 'click', function (e) {
            var strId = this.id;
            me.strQuyDoiChungChi_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneChiTiet");
            me.getList_ChiTiet();
        });

        $("#btnAddChiTiet").click(function () {
            me.rewriteChiTiet();
            me.toggle_editChiTiet();
        });

        $("#btnSave_ChiTiet").click(function (e) {
            me.save_ChiTiet();
        });
        $("#btnDeleteChiTiet").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChiTiet(arrChecked_Id[i]);
                }
            });
        });

        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            var arrKhoa = $("#dropSearchModal_He_SV").val();
            me.arrPhamVi = me.arrPhamVi.concat(arrKhoa);
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_He_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#lblPhamViApDung").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những hệ: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            me.arrPhamVi = me.arrPhamVi.concat(me.arrKhoa);
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#lblPhamViApDung").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            me.arrPhamVi = me.arrPhamVi.concat(me.arrChuongTrinh);
            if (me.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $("#lblPhamViApDung").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            me.arrPhamVi = me.arrPhamVi.concat(me.arrLop);
            if (me.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $("#lblPhamViApDung").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });

        $(".btnSelect_PhamVi").click(function () {
            edu.extend.genModal_SinhVien();
        });


        $("#dropSearch_PhanLoai").on("select2:select", function () {
            me.getList_ChungChi();
            me.getList_HocPhan();
            me.getList_QuyDoiChungChi();
        });

        $("#dropPhanLoaiChungChi").on("select2:select", function () {
            me.getList_ChungChi();
        });
        $("#dropSearch_ChungChi").on("select2:select", function () {
            me.getList_HocPhan();
            me.getList_QuyDoiChungChi();
        });
        $("#dropSearch_HocPhan").on("select2:select", function () {
            me.getList_QuyDoiChungChi();
        });
        //
       
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtQuyDoiChungChi_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
    },

    rewrite: function () {
        //reset id
        var me = this;
        $(".btnOpenNew").show();
        //
        me.strQuyDoiChungChi_Id = "";

        edu.util.viewValById("txtMucDo", "");
        edu.util.viewValById("dropCongThucTinh", "");
        edu.util.viewValById("dropPhuongThucQuyDoi", "");
        edu.util.viewValById("txtGhiChu", "");
        edu.util.viewValById("dropPhanLoaiChungChi", "");
        edu.util.viewValById("txtPLCCMoi", "");
        edu.util.viewValById("dropChungChi", "");
        edu.util.viewValById("txtChungChiMoi", "");
        edu.util.viewValById("txtDiemCongNhan", "");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        //this.getList_QuyDoiChungChi();
    },
    toggle_edit: function () {
        $("#myModal").modal("show");
        //edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewriteChiTiet: function () {
        //reset id
        var me = this;
        $(".btnOpenNew").show();
        //
        me.strChiTiet_Id = "";

        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropHocPhan", "");
        edu.util.viewValById("dropDauDiem", "");
        edu.util.viewValById("txtCanDuoi", "");
        edu.util.viewValById("txtCanTren", "");
        edu.util.viewValById("dropDauDiem", "");
        edu.util.viewValById("txtDiemCongNhan2", "");
        edu.util.viewValById("txtDiemQuyDoi", "");
        edu.util.viewValById("dropCongThucTinh2", "");
        edu.util.viewHTMLById("lblPhamViApDung", "");
        me.arrPhamVi = [];
    },
    toggle_editChiTiet: function () {
        $("#myModalChiTiet").modal("show");
        //edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_QuyDoiChungChi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongNhanDiem/LaYDSDiem_TT_CC_CapDo',
            'type': 'GET',
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDiem_ThongTin_ChungChi_Id': edu.util.getValById('dropSearch_ChungChi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtQuyDoiChungChi = dtReRult;
                    me.genTable_QuyDoiChungChi(dtReRult, data.Pager);
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
    save_QuyDoiChungChi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_CongNhanDiem/Them_Diem_TT_CC_CapDo',
            'type': 'POST',
            'strPhanLoaiCC_Id': edu.util.getValById('dropPhanLoaiChungChi'),
            'strPhanLoaiCC_Ten': edu.util.getValById('txtPLCCMoi'),
            'strDiem_ThongTin_ChungChi_Id': edu.util.getValById('dropChungChi'),
            'strTenChungChi': edu.util.getValById('txtChungChiMoi'),
            'strTenCapDo': edu.util.getValById('txtMucDo'),
            'strPhuongThucQuyDoi_Id': edu.util.getValById('dropPhuongThucQuyDoi'),
            'strDiem_CongThucDiem_Id': edu.util.getValById('dropCongThucTinh'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'dDiemCongNhan': edu.util.getValById('txtDiemCongNhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'D_CongNhanDiem/Sua_Diem_TT_CC_CapDo';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyDoiChungChi_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strQuyDoiChungChi_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strQuyDoiChungChi_Id = obj_save.strId
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_QuyDoiChungChi();
            },
            error: function (er) {
                edu.system.alert("XLHV_QuyDoiChungChi/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_QuyDoiChungChi: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'D_CongNhanDiem/Xoa_Diem_TT_CC_CapDo',
            

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
                    me.getList_QuyDoiChungChi();
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_QuyDoiChungChi: function (data, iPager) {
        var me = this;
        $("#lblQuyDoiChungChi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblQuyDoiChungChi",

            //bPaginate: {
            //    strFuntionName: "main_doc.QuyDoiChungChi.getList_QuyDoiChungChi()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0,2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAICC_TEN"
                },
                {
                    "mDataProp": "TENCHUNGCHI",
                },
                {
                    "mDataProp": "TENCAPDO"
                },
                {
                    "mDataProp": "CONGTHUCTINHDIEM"
                },
                {
                    "mDataProp": "PHUONGTHUCQUYDOI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnBangQuyDoi" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "GHICHU",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
        //for (var i = 0; i < data.length; i++) {
        //    me.getList_PhanCong(data[i].ID);
        //}
    },
    viewEdit_QuyDoiChungChi: function (data) {
        var me = this;
        //View - Thong tin
        $(".btnOpenNew").hide();
        edu.util.viewValById("dropPhanLoaiChungChi", data.MA);
        edu.util.viewValById("txtPLCCMoi", data.TENKEHOACH);
        edu.util.viewValById("dropChungChi", data.MOHINHDANGKY_ID);
        edu.util.viewValById("txtChungChiMoi", data.HIEULUC);
        edu.util.viewValById("txtMucDo", data.TENCAPDO);
        edu.util.viewValById("dropCongThucTinh", data.DIEM_CONGTHUCDIEM_ID);
        edu.util.viewValById("dropPhuongThucQuyDoi", data.PHUONGTHUCQUYDOI_ID);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        edu.util.viewValById("txtDiemCongNhan", data.DIEMCONGNHAN);
        me.strQuyDoiChungChi_Id = data.ID;
        
        //me.getList_ThanhVien();
        //me.getList_HocPhan();
    },

    getList_ChungChi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongNhanDiem/LayDSDiem_ThongTin_ChungChi',
            'type': 'GET',
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ChungChi(json);
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
    cbGenCombo_ChungChi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUNGCHI",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChungChi", "dropChungChi"],
            type: "",
            title: "Chọn chứng chỉ",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_HocPhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongNhanDiem/LayDSHocPhan_QuyDoi_CapDo',
            'type': 'GET',
            'strPhanLoaiCC_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDiem_ThongTin_ChungChi_Id': edu.util.getValById('dropSearch_ChungChi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HocPhan(json);
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
    cbGenCombo_HocPhan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",

                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_HocPhan2: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDaoTao_MonHoc_Id': edu.util.getValById("dropSearch_MonHoc"),
            'strThuocBoMon_Id': edu.util.getValById("dropSearch_BoMon"),
            'strThuocTinhHocPhan_Id': edu.util.getValById("dropSearch_ThuocTinhHocPhan"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HocPhan2(json);
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
    cbGenCombo_HocPhan2: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",

                code: "",
                avatar: "",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropHocPhan"],
            type: "",
            title: "Chọn học phần",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_CongThuc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongThucDiem/LayDanhSach',
            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById("dropSearch_ThanhPhanDiem"),
            'strMoHinhXuLy_Id': edu.util.getValById("dropSearch_MoHinhXuLy"),
            'strNguoiThucHien_Id': "",
            'pageIndex': 1,
            'pageSize': 1000000
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_CongThuc(json);
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
    cbGenCombo_CongThuc: function (data) {
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
            renderPlace: ["dropCongThucTinh", "dropCongThucTinh2"],
            type: "",
            title: "Chọn công thức",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_DauDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongNhanDiem/LayDSThanhPhanDiemTheoCapDo',
            'type': 'GET',
            'strDiem_TT_CC_CapDo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DauDiem(json);
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
    cbGenCombo_DauDiem: function (data) {
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
            renderPlace: ["dropDauDiem"],
            type: "",
            title: "Chọn đầu điểm",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_CCTC: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
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
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ChiTiet: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'D_CongNhanDiem/LayDSDiem_CC_CapDo_QuyDoi_DK',
            'type': 'GET',
            'strDiem_ThongTin_CC_CapDo_Id': me.strQuyDoiChungChi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChiTiet"] = dtReRult;
                    me.genTable_ChiTiet(dtReRult, data.Pager);
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
    save_ChiTiet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'D_CongNhanDiem/Them_Diem_CC_CapDo_QuyDoi_DK',
            'type': 'POST',
            'strPhamViApDung_Id': me.arrPhamVi.toString(),
            'strDiem_TT_CC_CapDo_Id': me.strQuyDoiChungChi_Id,
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropDauDiem'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan'),
            'dCanDuoi': edu.util.getValById('txtCanDuoi'),
            'dCanTren': edu.util.getValById('txtCanTren'),
            'dDiemQuyDoi': edu.util.getValById('txtDiemQuyDoi'),
            'strDiem_CongThucDiem_Id': edu.util.getValById('dropCongThucTinh2'),
            'dDiemCongNhan': edu.util.getValById('txtDiemCongNhan2'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'D_CongNhanDiem/Sua_Diem_CC_CapDo_QuyDoi_DK';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyDoiChungChi_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strQuyDoiChungChi_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strQuyDoiChungChi_Id = obj_save.strId
                    }
                    $("#myModalChiTiet").modal("hide");
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_QuyDoiChungChi();
            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ChiTiet: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'D_CongNhanDiem/Xoa_Diem_CC_CapDo_QuyDoi_DK',


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
                    me.getList_QuyDoiChungChi();
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ChiTiet: function (data, iPager) {
        var me = this;
        $("#lblQuyDoiChungChi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChiTiet",

            //bPaginate: {
            //    strFuntionName: "main_doc.QuyDoiChungChi.getList_ChiTiet()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA",
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "CANDUOI"
                },
                {
                    "mDataProp": "CANTREN"
                },
                {
                    "mDataProp": "DIEMCONGNHAN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "MUCNHOMDIEUKIEN"
                },
                {
                    "mDataProp": "LOAIKIEMTRA"
                },
                {
                    "mDataProp": "GHICHU"
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
        //for (var i = 0; i < data.length; i++) {
        //    me.getList_PhanCong(data[i].ID);
        //}
    },
    viewEdit_ChiTiet: function (data) {
        var me = this;
        //View - Thong tin
        $(".btnOpenNew").hide();
        edu.util.viewValById("dropDonVi", data.MA);
        edu.util.viewValById("dropHocPhan", data.DAOTAO_HOCPHAN_ID);
        edu.util.viewValById("dropDauDiem", data.DIEM_THANHPHANDIEM_ID);
        edu.util.viewValById("txtCanDuoi", data.CANDUOI);
        edu.util.viewValById("txtCanTren", data.CANTREN);
        edu.util.viewValById("txtDiemCongNhan2", data.DIEMCONGNHAN);
        edu.util.viewValById("txtDiemQuyDoi", data.DIEMQUYDOI);
        edu.util.viewHTMLById("lblPhamViApDung", data.PHAMVIAPDUNG_TEN);
        me.strChiTiet_Id = data.ID;

        //me.getList_ThanhVien();
        //me.getList_HocPhan();
    },

}