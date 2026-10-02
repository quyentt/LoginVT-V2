/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function VeThang() { };
VeThang.prototype = {
    dtVeThang: [],
    strVeThang_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    dtXacNhan: [],
    dtLoaiVe: [],
    dtLoaiKhoan: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_VeThang();

        //me.getList_DMHocPhan();
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "", "", data => me.dtLoaiVe = data);
        me.getList_DMLKT();

        $("#btnSearch").click(function (e) {
            me.getList_VeThang();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_VeThang();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_VeThang").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_VeThang();
            }
        });
        $("[id$=chkSelectAll_VeThang]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblVeThang" });
        });
        $("#btnXoaVeThang").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblVeThang", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_VeThang(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_VeThang();
                }, arrChecked_Id.length * 50);
            });
        });
        //$("[id$=chkSelectAll_MucPhi]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblMucPhi" });
        //});
        //$("[id$=chkSelectAll_LoaiVe]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblLoaiVe" });
        //});
        
        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });

        

        $("#tblVeThang").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblVeThang");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtVeThang, "ID")[0];
                me.viewEdit_VeThang(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchHocPhan").click(function () {
            $("#myModalHocPhan").modal("show");
        });
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien();
            edu.extend.getList_SinhVien("SEARCH");
        });
       
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });
        $(".btnDeleteDTSV_SinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });
        
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (me.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $("#ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (me.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $("#ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            if (me.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $("#ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });
       
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtVeThang_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblVeThang").delegate('.btnKetQua', 'click', function (e) {
            //$('#myModal').modal('show');
            edu.util.toggle_overide("zone-bus", "zoneQuanSo");
            me.getList_QuanSoTheoLop(this.id);
        });
        
        
        edu.system.getList_MauImport("zonebtnBaoCao_VeThang", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblVeThang", "checkX");
            addKeyValue("dHieuLuc", edu.util.getValById("dropSearch_HieuLuc"));
            arrChecked_Id.forEach(e => addKeyValue("strDiem_KeHoachCongNhan_Id", e));
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $(".btnSearch_MucPhi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_MucPhi(id, "");
        });
        $("#tblMucPhi").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblMucPhi tr[id='" + strRowId + "']").remove();
        });
        $("#tblMucPhi").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_MucPhi(strId);
            });
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $(".btnSearch_LoaiVe").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_LoaiVe(id, "");
        });
        $("#tblLoaiVe").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblLoaiVe tr[id='" + strRowId + "']").remove();
        });
        $("#tblLoaiVe").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_LoaiVe(strId);
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strVeThang_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropMoHinh", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblLoaiVe tbody").html("");
        $("#tblMucPhi tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_VeThang();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_VeThang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_VeThang/LayDSKeHoach_DichVu_Ve',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtVeThang = dtReRult;
                    me.genTable_VeThang(dtReRult, data.Pager);
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
    save_VeThang: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang/Them_KeHoach_DichVu_Ve',
            'type': 'POST',
            'strId': me.strVeThang_Id,
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNgayBatDau': edu.util.getValById('txtTuNgay'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgay'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_VeThang/Sua_KeHoach_DichVu_Ve';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strVeThang_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strVeThang_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strVeThang_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strVeThang_Id);
                        }
                    });
                    //$("#tblInputDanhSachNhanSu tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strVeThang_Id);
                    //});

                    for (var i = 0; i < me.arrKhoa.length; i++) {
                        me.save_SinhVien(me.arrKhoa[i], strVeThang_Id);
                    }
                    for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                        me.save_SinhVien(me.arrChuongTrinh[i], strVeThang_Id);
                    }
                    for (var i = 0; i < me.arrLop.length; i++) {
                        me.save_SinhVien(me.arrLop[i], strVeThang_Id);
                    }
                    $("#tblLoaiVe tbody tr").each(function () {
                        me.save_LoaiVe(this.id, strVeThang_Id);
                    });
                    $("#tblMucPhi tbody tr").each(function () {
                        me.save_MucPhi(this.id, strVeThang_Id);
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_VeThang();
            },
            error: function (er) {
                edu.system.alert("XLHV_VeThang/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_VeThang: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'SV_VeThang/Xoa_KeHoach_DichVu_Ve',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.getList_VeThang();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
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
    genTable_VeThang: function (data, iPager) {
        var me = this;
        $("#lblVeThang_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblVeThang",

            bPaginate: {
                strFuntionName: "main_doc.VeThang.getList_VeThang()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6,7],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TENKEHOACH",
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    //"mDataProp": "HIEULUC"
                    "mRender": function (nRow, aData) {
                        var x = aData.HIEULUC ?  "Có hiệu lực" :  "Hết hiệu lực";
                        return x;
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
    viewEdit_VeThang: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        me.strVeThang_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_LoaiVe();
        me.getList_MucPhi();
        //me.getList_ThanhVien();
        //me.getList_HocPhan();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_PhanCong: function (strTN_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhanSu = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strNhanSu += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strNhanSu != "") strNhanSu = strNhanSu.substring(1);
                    $("#DSPhanCong").html(strNhanSu);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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

    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDoiTuong = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strDoiTuong += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strDoiTuong != "") strDoiTuong = strDoiTuong.substring(1);
                    $("#DSDoiTuong").html(strDoiTuong);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_VeThang/LayDSKeHoach_Dich_Ve_PhamVi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_DichVu_Ve_Id': me.strVeThang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_VeThang_Id) {
        var me = this;
        console.log(strNhanSu_Id)
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        if (aData && aData.QLSV_NGUOIHOC_ID) strNhanSu_Id = aData.QLSV_NGUOIHOC_ID;
        console.log(strNhanSu_Id)
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang/Them_KeHoach_Dich_Ve_PhamVi',
            'type': 'POST',
            'strQLSV_KeHoach_DichVu_Ve_Id': strQLSV_VeThang_Id,
            'strPhamViApDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_VeThang/Xoa_KeHoach_Dich_Ve_PhamVi',
            
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.alert("Xóa thành công!");
                    
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        $("#tblInput_DTSV_SinhVien tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            //html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].PHAMVIAPDUNG_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_HOTEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_CHUONGTRINH_TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_KHOADAOTAO_TEN) + "</span></td>";
            html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInput_DTSV_SinhVien tbody").append(html);
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.VeThang;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        //html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.QLSV_NGUOIHOC_ANH) + "'></td>";
        //html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        //html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.VeThang;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    
    getList_KeHoachMD: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearchA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearchModal_LoaiKeHoach_SV'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTaoA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MDKeHoach(json);
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
    cbGenCombo_MDKeHoach: function (data) {
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
            renderPlace: ["dropSearchModal_KeHoach_SV"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayHeDaoTaoTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HeDaoTao(json);
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
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayKhoaHocTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaDaoTao(json);
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
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayChuongTrinhTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(json);
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
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayLopQuanLyTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LopQuanLy(json);
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
    getList_ThoiGianDaoTaoDKH: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao_DKH(json);
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
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
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
            renderPlace: ["dropSearchModal_He_SV"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_He_SV").val("").trigger("change");
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
            renderPlace: ["dropSearchModal_Khoa_SV"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_Khoa_SV").val("").trigger("change");
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
            renderPlace: ["dropSearchModal_ChuongTrinh_SV"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_ChuongTrinh_SV").val("").trigger("change");
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
            renderPlace: ["dropSearchModal_Lop_SV"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_Lop_SV").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.VeThang;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropVeThang_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
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
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao_DKH: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_HocKy_SV"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_HocKy_SV").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.VeThang.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
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
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_QuanSoTheoLop: function (strQLSV_KeHoach_DichVu_Ve_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_VeThang/LayDSQLSV_KeHoach_Ve_DangKy',
            'type': 'GET',
            'strQLSV_KeHoach_DichVu_Ve_Id': strQLSV_KeHoach_DichVu_Ve_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtQuanSo"] = dtReRult;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager, strQLSV_KeHoach_DichVu_Ve_Id);
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
    genTable_QuanSoTheoLop: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQuaDangKy",

            //bPaginate: {
            //    strFuntionName: "main_doc.VeThang.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOAHOC_TEN"
                },
                {
                    "mDataProp": "LOAIVE_TEN"
                    //"mRender": function (nRow, aData) {
                    //    return '<div id="lblLoaiVe' + aData.ID + '"></div>';
                    //}
                },
                {
                    "mDataProp": "SOTIEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(aData => {
        //    me.getList_NH_LoaiVe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, aData.ID)
        //    me.getList_NH_Phi(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, aData.ID)
        //})
        /*III. Callback*/
    },
    getList_NH_LoaiVe: function (strQLSV_KeHoach_DichVu_Ve_Id, strQLSV_NguoiHoc_Id, strLoaiVe_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_VeThang/LayDSQLSV_KeHoach_Ve_DangKy',
            'type': 'GET',
            'strQLSV_KeHoach_DichVu_Ve_Id': strQLSV_KeHoach_DichVu_Ve_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var htmlThang = "";
                    dtReRult.forEach(aData => {
                        htmlThang += ', ' + aData.LOAIVE_TEN;
                    })
                    if (htmlThang) htmlThang.substring(2);
                    console.log(htmlThang)
                    $("#lblLoaiVe" + strLoaiVe_Id).html(htmlThang);
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
    getList_NH_Phi: function (strQLSV_KeHoach_DichVu_Ve_Id, strQLSV_NguoiHoc_Id, strLoaiVe_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_VeThang/LayDSDichVu_Phi_DangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_DichVu_Ve_Id': strQLSV_KeHoach_DichVu_Ve_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var htmlThang = "";
                    dtReRult.forEach(aData => {
                        htmlThang += ' ,' + aData.LOAIVE_TEN + ":" + aData.SOTIEN;
                    })
                    if (htmlThang) htmlThang.substring(2);
                    console.log(htmlThang)
                    $("#lblPhi" + strLoaiVe_Id).html(htmlThang);
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_MucPhi: function (strKetQua_Id, strQLSV_KeHoach_DichVu_Ve_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strLoaiVe_Id = edu.util.getValById('dropLoaiVe' + strKetQua_Id);
        if (!edu.util.checkValue(strLoaiVe_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang/Them_KeHoach_DichVu_Phi',
            'type': 'POST',
            'strId': strId,
            'strQLSV_KeHoach_DichVu_Ve_Id': strQLSV_KeHoach_DichVu_Ve_Id,
            'strLoaiVe_Id': strLoaiVe_Id,
            'strMoTa': edu.util.getValById('txtMoTa' + strKetQua_Id),
            'dSoTien': edu.util.getValById('txtSoTien' + strKetQua_Id),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'SV_VeThang/Sua_KeHoach_DichVu_Phi';
        }
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
    getList_MucPhi: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_VeThang/LayDSKeHoach_DichVu_Phi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_DichVu_Ve_Id': me.strVeThang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_MucPhi_Data(dtResult);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_MucPhi: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_VeThang/Xoa_Sua_KeHoach_DichVu_Phi',
            'type': 'POST',
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_MucPhi();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_MucPhi_Data: function (data) {
        var me = this;
        $("#tblMucPhi tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropLoaiVe' + strKetQua_Id + '" class="select-opt"></select ></td>';
            row += '<td><select id="dropLoaiKhoan' + strKetQua_Id + '" class="select-opt"></select ></td>';
            row += '<td><input type="text" id="txtSoTien' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOTIEN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblMucPhi tbody").append(row);
            me.genComBo_LoaiVe("dropLoaiVe" + strKetQua_Id, aData.LOAIVE_ID);
            me.genComBo_LoaiKhoan("dropLoaiKhoan" + strKetQua_Id, aData.TAICHINH_CACKHOANTHU_ID);
        }
        
    },
    genHTML_MucPhi: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblMucPhi").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropLoaiVe' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td><select id="dropLoaiKhoan' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td><input type="text" id="txtSoTien' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOTIEN) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblMucPhi tbody").append(row);
        me.genComBo_LoaiVe("dropLoaiVe" + strKetQua_Id, aData.LOAIVE_ID);
        me.genComBo_LoaiKhoan("dropLoaiKhoan" + strKetQua_Id, aData.TAICHINH_CACKHOANTHU_ID);
    },
    genComBo_LoaiVe: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiVe,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn loại vé"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    genComBo_LoaiKhoan: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiKhoan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn loại khoản"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_LoaiVe: function (strKetQua_Id, strQLSV_KeHoach_DichVu_Ve_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strLoaiVe_Id = edu.util.getValById('dropLoaiVe' + strKetQua_Id);
        if (!edu.util.checkValue(strLoaiVe_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'SV_VeThang/Them_KeHoach_DichVu_LoaiVe',
            'type': 'POST',
            'strId': strId,
            'strQLSV_KeHoach_DichVu_Ve_Id': strQLSV_KeHoach_DichVu_Ve_Id,
            'strLoaiVe_Id': strLoaiVe_Id,
            'strMoTa': edu.util.getValById('txtMoTa' + strKetQua_Id),
            'dNam': edu.util.getValById('txtNam' + strKetQua_Id),
            'dThang': edu.util.getValById('txtThang' + strKetQua_Id),
            'strThang': edu.util.getValById('txtThang' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'SV_VeThang/Sua_KeHoach_DichVu_LoaiVe';
        }
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
    getList_LoaiVe: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_VeThang/LayDSKeHoach_DichVu_LoaiVe',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_DichVu_Ve_Id': me.strVeThang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_LoaiVe_Data(dtResult);
                    }
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_LoaiVe: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_VeThang/Xoa_KeHoach_DichVu_LoaiVe',
            'type': 'POST',
            'strId': strIds,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_LoaiVe();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_DeTai_ThanhVien/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_LoaiVe_Data: function (data) {
        var me = this;
        $("#tblLoaiVe tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropLoaiVe' + strKetQua_Id + '" class="select-opt"></select ></td>';
            row += '<td><input type="text" id="txtNam' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NAM) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtThang' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THANG) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblLoaiVe tbody").append(row);
            me.genComBo_LoaiVe("dropLoaiVe" + strKetQua_Id, aData.LOAIVE_ID);
        }

    },
    genHTML_LoaiVe: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblLoaiVe").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropLoaiVe' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td><input type="text" id="txtNam' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NAM) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtThang' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THANG) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblLoaiVe tbody").append(row);
        me.genComBo_LoaiVe("dropLoaiVe" + strKetQua_Id, aData.LOAIVE_ID);
    },

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
                    me.dtLoaiKhoan = data;
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
}