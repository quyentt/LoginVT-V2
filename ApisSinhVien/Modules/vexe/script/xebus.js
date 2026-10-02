/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function XeBus() { };
XeBus.prototype = {
    dtXeBus: [],
    strXeBus_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],
    dtXacNhan: [],
    dtTuyenXe: [],
    dtLoaiKhoan: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_XeBus();

        //me.getList_DMHocPhan();
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "");
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "", "", data => me.dtTuyenXe = data);
        //me.getList_DMLKT();

        $("#btnSearch").click(function (e) {
            me.getList_XeBus();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_XeBus();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_XeBus").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_XeBus();
            }
        });
        $("[id$=chkSelectAll_XeBus]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblXeBus" });
        });
        $("#btnXoaXeBus").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXeBus", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_XeBus(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_XeBus();
                }, arrChecked_Id.length * 50);
            });
        });
        //$("[id$=chkSelectAll_ThangApDung]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblThangApDung" });
        //});
        //$("[id$=chkSelectAll_TuyenXe]").on("click", function () {
        //    edu.util.checkedAll_BgRow(this, { table_id: "tblTuyenXe" });
        //});
        
        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });

        

        $("#tblXeBus").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblXeBus");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtXeBus, "ID")[0];
                me.viewEdit_XeBus(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        
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
            { "MA": "txtXeBus_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblXeBus").delegate('.btnKetQua', 'click', function (e) {
            //$('#myModal').modal('show');
            edu.util.toggle_overide("zone-bus", "zoneQuanSo");
            me.getList_QuanSoTheoLop(this.id);
        });
        
        
        edu.system.getList_MauImport("zonebtnBaoCao_XeBus", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXeBus", "checkX");
            addKeyValue("dHieuLuc", edu.util.getValById("dropSearch_HieuLuc"));
            arrChecked_Id.forEach(e => addKeyValue("strDiem_KeHoachCongNhan_Id", e));
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $(".btnSearch_ThangApDung").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThangApDung(id, "");
        });
        $("#tblThangApDung").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThangApDung tr[id='" + strRowId + "']").remove();
        });
        $("#tblThangApDung").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThangApDung(strId);
            });
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $(".btnSearch_TuyenXe").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_TuyenXe(id, "");
        });
        $("#tblTuyenXe").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblTuyenXe tr[id='" + strRowId + "']").remove();
        });
        $("#tblTuyenXe").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_TuyenXe(strId);
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strXeBus_Id = "";
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
        $("#tblTuyenXe tbody").html("");
        $("#tblThangApDung tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_XeBus();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_XeBus: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_XeBus/LayDSKeHoach_DichVu_XeBus',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtXeBus = dtReRult;
                    me.genTable_XeBus(dtReRult, data.Pager);
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
    save_XeBus: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus/Them_KeHoach_DichVu_XeBus',
            'type': 'POST',
            'strId': me.strXeBus_Id,
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNgayBatDau': edu.util.getValById('txtTuNgay'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgay'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_XeBus/Sua_KeHoach_DichVu_XeBus';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strXeBus_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strXeBus_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strXeBus_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strXeBus_Id);
                        }
                    });
                    //$("#tblInputDanhSachNhanSu tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strXeBus_Id);
                    //});

                    for (var i = 0; i < me.arrKhoa.length; i++) {
                        me.save_SinhVien(me.arrKhoa[i], strXeBus_Id);
                    }
                    for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                        me.save_SinhVien(me.arrChuongTrinh[i], strXeBus_Id);
                    }
                    for (var i = 0; i < me.arrLop.length; i++) {
                        me.save_SinhVien(me.arrLop[i], strXeBus_Id);
                    }
                    $("#tblTuyenXe tbody tr").each(function () {
                        me.save_TuyenXe(this.id, strXeBus_Id);
                    });
                    $("#tblThangApDung tbody tr").each(function () {
                        me.save_ThangApDung(this.id, strXeBus_Id);
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_XeBus();
            },
            error: function (er) {
                edu.system.alert("XLHV_XeBus/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_XeBus: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'SV_XeBus/Xoa_KeHoach_DichVu_XeBus',
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
                    me.getList_XeBus();
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
    genTable_XeBus: function (data, iPager) {
        var me = this;
        $("#lblXeBus_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblXeBus",

            bPaginate: {
                strFuntionName: "main_doc.XeBus.getList_XeBus()",
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
    viewEdit_XeBus: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        me.strXeBus_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_TuyenXe();
        me.getList_ThangApDung();
        //me.getList_ThanhVien();
        //me.getList_HocPhan();
    },
   
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_XeBus/LayDSKeHoach_DichVu_PhamVi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_XeBus_Id': me.strXeBus_Id,
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_XeBus_Id) {
        var me = this;
        console.log(strNhanSu_Id)
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        if (aData && aData.QLSV_NGUOIHOC_ID) strNhanSu_Id = aData.QLSV_NGUOIHOC_ID;
        console.log(strNhanSu_Id)
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus/Them_KeHoach_DichVu_PhamVi',
            'type': 'POST',
            'strQLSV_KeHoach_XeBus_Id': strQLSV_XeBus_Id,
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
            'action': 'SV_XeBus/Xoa_KeHoach_DichVu_PhamVi',
            
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
        var me = main_doc.XeBus;
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
        var me = main_doc.XeBus;
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
        var me = main_doc.XeBus;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropXeBus_ThoiGianDaoTao"],
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
        main_doc.XeBus.dtTrangThai = data;
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

    getList_QuanSoTheoLop: function (strQLSV_KeHoach_XeBus_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_XeBus/LayDSKeHoach_XeBus_DangKy',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': strQLSV_KeHoach_XeBus_Id,
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
            //    strFuntionName: "main_doc.XeBus.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
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
                    "mRender": function (nRow, aData) {
                        return '<div id="lblTuyenXe' + aData.ID + '"></div>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div id="lblThangApDung' + aData.ID + '"></div>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },

    getList_NH_TuyenXe: function (strQLSV_KeHoach_DichVu_Ve_Id, strQLSV_NguoiHoc_Id, strTuyenXe_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_XeBus/LayDSQLSV_KeHoach_Ve_DangKy',
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
                        htmlThang += ', ' + aData.TuyenXe_TEN;
                    })
                    if (htmlThang) htmlThang.substring(2);
                    $("#lblTuyenXe" + strTuyenXe_Id).html(htmlThang);
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
    getList_NH_ThangApDung: function (strQLSV_KeHoach_DichVu_Ve_Id, strQLSV_NguoiHoc_Id, strTuyenXe_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_XeBus/LayDSDichVu_Phi_DangKy',
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
                        htmlThang += ' ,' + aData.TuyenXe_TEN + ":" + aData.SOTIEN;
                    })
                    if (htmlThang) htmlThang.substring(2);
                    $("#lblPhi" + strTuyenXe_Id).html(htmlThang);
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
    save_ThangApDung: function (strKetQua_Id, strQLSV_KeHoach_XeBus_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strTuyenXe_Id = edu.util.getValById('txtNam' + strKetQua_Id);
        if (!edu.util.checkValue(strTuyenXe_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = ""; else return;
        var obj_notify;
        //--Edit
        
        var obj_save = {
            'action': 'SV_XeBus/Them_KeHoach_DichVu_Thang',
            'type': 'POST',
            'strId': strId,
            'strQLSV_KeHoach_XeBus_Id': strQLSV_KeHoach_XeBus_Id,
            'dNam': edu.util.getValById('txtNam' + strKetQua_Id),
            'dThang': edu.util.getValById('txtThang' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (strId) {
        //    obj_save.action = 'SV_XeBus/Sua_KeHoach_DichVu_Phi';
        //}
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
    getList_ThangApDung: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_XeBus/LayDSKeHoach_DichVu_Thang',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_XeBus_Id': me.strXeBus_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_ThangApDung_Data(dtResult);
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
    delete_ThangApDung: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_XeBus/Xoa_KeHoach_DichVu_Thang',
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
                    me.getList_ThangApDung();
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
    genHTML_ThangApDung_Data: function (data) {
        var me = this;
        $("#tblThangApDung tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtNam' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NAM) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtThang' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THANG) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblThangApDung tbody").append(row);
        }
        
    },
    genHTML_ThangApDung: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThangApDung").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtNam' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.NAM) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtThang' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THANG) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblThangApDung tbody").append(row);
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_TuyenXe: function (strKetQua_Id, strQLSV_KeHoach_DichVu_Ve_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strTuyenXe_Id = edu.util.getValById('txtMa' + strKetQua_Id);
        if (!edu.util.checkValue(strTuyenXe_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'SV_XeBus/Them_QLSV_XeBus_TuyenXe',
            'type': 'POST',
            'strId': strId,
            'strTen': edu.util.getValById('txtTen' + strKetQua_Id),
            'strMa': edu.util.getValById('txtMa' + strKetQua_Id),
            'strMoTa': edu.util.getValById('txtMoTa' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'SV_XeBus/Sua_QLSV_XeBus_TuyenXe';
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
    getList_TuyenXe: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_XeBus/LayDSQLSV_XeBus_TuyenXe',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLSV_KeHoach_XeBus_Id': me.strXeBus_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.genHTML_TuyenXe_Data(dtResult);
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
    delete_TuyenXe: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_XeBus/Xoa_QLSV_XeBus_TuyenXe',
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
                    me.getList_TuyenXe();
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
    genHTML_TuyenXe_Data: function (data) {
        var me = this;
        $("#tblTuyenXe tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtMa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MA) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtTen' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TEN) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblTuyenXe tbody").append(row);
        }

    },
    genHTML_TuyenXe: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblTuyenXe").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; var aData = {};
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtMa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MA) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtTen' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TEN) + '" class="form-control"/></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblTuyenXe tbody").append(row);
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