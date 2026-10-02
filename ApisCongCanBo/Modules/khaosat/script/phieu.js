/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function Phieu() { };
Phieu.prototype = {
    dtPhieu: [],
    strPhieu_Id: '',
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        //$("#myModal_NhomCauHoi").modal("show");
        me.getList_Phieu();

        //me.getList_DMHocPhan();
        edu.system.loadToCombo_DanhMucDuLieu("QLKS.LPKS", "dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "", "", data => me.dtTuyenXe = data);
        //me.getList_DMLKT();
        //$("#modal_sinhvien").modal("show");
        $("#btnSearch").click(function (e) {
            me.getList_Phieu();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_Phieu();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });

        $(".btnClosePhieu").click(function () {
            me.toggle_phieu();
            me.getList_CauHoi();
        });
        $("#btnAdd_Phieu").click(function () {
            me.strPhieu_Id = "";
            var data = {};
            edu.util.viewValById("txtTen", data.TEN);
            edu.util.viewValById("txtMa", data.MA);
            edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
            edu.util.viewValById("txtMoTa", data.MOTA);
            edu.util.viewHTMLById("txtMoTa", data.MOTA);
            $("#myModal").modal("show");
        });
        $("#btnSave_Phieu").click(function (e) {

            me.save_Phieu();
        });
        $("[id$=chkSelectAll_Phieu]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhieu" });
        });
        $("#btnDelete_Phieu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhieu", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Phieu(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtPhieu_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblPhieu").delegate('.btnEdit', 'click', function (e) {
            $('#myModal').modal('show');
            var strId = this.id;
            var data = me.dtPhieu.find(e => e.ID == strId);
            me.viewEdit_Phieu(data);
        });
        $("#tblPhieu").delegate('.btnXemPhieu', 'click', function (e) {
            var strId = this.id;
            me.strPhieu_Id = strId;
            me.toggle_phieu();
            me.getList_Nhom();
            var data = me.dtPhieu.find(e => e.ID == strId);
            $("#lblTieuDe").html(data.TENPHIEU)
            $("#lblMoTaPhieu").html('<strong>' + edu.util.returnEmpty(data.LOAIPHIEU_TEN) + ':</strong> <span>' + edu.util.returnEmpty(data.MOTA) + '</span>');
        });
        $("#tblPhieu").delegate('.btnXemTongThePhieu', 'click', function (e) {
            var strId = this.id;
            //var url = edu.system.strhost + ":60652/pages/phieukhaosat.aspx";
            var url = edu.system.strhost + "/congthongtin/pages/phieukhaosat.aspx";
            //var data = me.dtPhieu.find(e => e.ID == strId);
            url += '?strPhieu_Id=' + strId;
            url += '&strNguoiThucHien_Id=' + edu.system.userId;
            console.log(url);
            window.open(url, "_blank", 'location=yes, height=' + window.screen.height + ', width=' + window.screen.width + ', scrollbars=yes, status=yes');
            //me.strPhieu_Id = strId;
            //me.toggle_phieu();
            //me.getList_Nhom();
            //var data = me.dtPhieu.find(e => e.ID == strId);
            //$("#lblTieuDe").html(data.TENPHIEU)
            //$("#lblMoTaPhieu").html('<strong>' + edu.util.returnEmpty(data.LOAIPHIEU_TEN) + ':</strong> <span>' + edu.util.returnEmpty(data.MOTA) + '</span>');
        });
        
        $("#btnAdd_Nhom").click(function () {
            me.strNhom_Id = "";
            var data = {};
            edu.util.viewValById("txtTen_NhomCauHoi", data.TEN);
            edu.util.viewValById("txtThuTu_NhomCauHoi", data.THUTU);
            edu.util.viewValById("txtMoTa_NhomCauHoi", data.MOTA);
            edu.util.viewHTMLById("txtMoTa_NhomCauHoi", data.MOTA);
            $("#myModal_NhomCauHoi").modal("show");
        });
        $("#btnSave_Nhom").click(function (e) {

            me.save_Nhom();
        });
        $("#btnDelete_Nhom").click(function () {
            $("#myModal_NhomCauHoi").modal("hide");
            me.delete_Nhom(me.strNhom_Id);
        });
        $("#tblNoiDung").delegate('.btnEditNhom', 'click', function (e) {
            $("#myModal_NhomCauHoi").modal("show");
            var strId = this.id;
            var data = me.dtNhom.find(e => e.ID == strId);
            me.viewEdit_Nhom(data);
        });

        $("#zonePhieu").delegate('.btnAdd_CauHoi', 'click', function (e) {
            me.strCauHoi_Id = "";
            var strId = this.id;
            //if (strId) me.strNhom_Id = strId;
            var data = {};
            edu.util.viewValById("txtCauHoi", data.TENCAUHOI);
            edu.util.viewValById("dropThuocNhom", strId);
            edu.util.viewValById("txtThuTu", data.ThuTu);
            edu.util.viewValById("dropLoaiCauHoi", data.KS_LOAICAUHOI_ID);
            edu.util.viewValById("dropKieuTraLoi", data.CAUHOIBATBUOCTRALOI);
            edu.util.viewValById("dropKieuHienThi", data.CACHHIENTHICAUHOI);
            me["strCauHoi_Id"] = data.ID;
            $("#tblDapAn tbody").html("");
            me.toggle_edit();
        });
        $("#btnSave_CauHoi").click(function (e) {

            me.save_CauHoi();
        });
        $("#btnDelete_CauHoi").click(function () {
            me.delete_CauHoi(me.strCauHoi_Id);
        });
        $("#tblNoiDung").delegate('.btnEditCauHoi', 'click', function (e) {
            me.toggle_edit();
            var strId = this.id;
            var data = me.dtCauHoi.find(e => e.ID == strId);
            me.viewEdit_CauHoi(data);
            me.getList_DapAn();
            me.getList_DapAn_Mau();
        });
        $('#dropSearch_CauHoi').on('select2:select', function () {
            me.getList_DapAn_Mau();
        });

        /*------------------------------------------
      --Discription: [4-1] Action KetQua_Detai
      --Order:
      -------------------------------------------*/
        $(".btnAdd_DapAn").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DapAn(id, "");
        });
        $("#tblDapAn").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblDapAn tr[id='" + strRowId + "']").remove();
        });
        $("#tblDapAn").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_DapAn(strId);
            });
        });
        
        $("[id$=chkSelectAll_DapAn]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDapAn" });
        });

        $("[id$=chkSelectAll_DapAn_Mau]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDapAn_Mau" });
        });
        $("#btnAdd_DapAn_Mau").click(function(){
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDapAn_Mau", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            arrChecked_Id.forEach(e => {
                var id = edu.util.randomString(30, "");
                var aData = me.dtDapAn_Mau.find(ele => ele.ID == e);
                me.genHTML_DapAn(id, aData);
            })
        })

        edu.system.getList_MauImport("zonebtnBaoCao_Phieu", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhieu", "checkX");
            addKeyValue("dHieuLuc", edu.util.getValById("dropSearch_HieuLuc"));
            arrChecked_Id.forEach(e => addKeyValue("strDiem_PhieuCongNhan_Id", e));
        });
        
    },

    rewrite: function () {
        //reset id
        var me = this;
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_Phieu();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_phieu: function () {
        edu.util.toggle_overide("zone-bus", "zonePhieu");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_Phieu: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSPhieu_Mau_NguoiDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhieu = dtReRult;
                    me.genTable_Phieu(dtReRult, data.Pager);
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
    save_Phieu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_PhieuKhaoSat_Mau',
            'type': 'POST',
            'strId': me.strPhieu_Id,
            'strMaPhieu': edu.util.getValById('txtMa'),
            'strTenPhieu': edu.util.getValById('txtTen'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strLoaiPhieu_Id': edu.util.getValById('dropPhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KS_ThongTin/Sua_KS_PhieuKhaoSat_Mau';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strPhieu_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strPhieu_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strPhieu_Id = obj_save.strId
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_Phieu();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Phieu: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_PhieuKhaoSat_Mau',
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
                    me.getList_Phieu();
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
    genTable_Phieu: function (data, iPager) {
        var me = this;
        $("#lblPhieu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhieu",

            bPaginate: {
                strFuntionName: "main_doc.Phieu.getList_Phieu()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "TENPHIEU",
                },
                {
                    "mDataProp": "LOAIPHIEU_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnPhanQuyen" id="' + aData.ID + '" title="Chi tiết">Phân quyền</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXemTongThePhieu" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXemPhieu" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
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
    },
    viewEdit_Phieu: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtTen", data.TENPHIEU);
        edu.util.viewValById("txtMa", data.MAPHIEU);
        edu.util.viewValById("dropPhanLoai", data.LOAIPHIEU_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewHTMLById("txtMoTa", data.MOTA);
        me.strPhieu_Id = data.ID;
    },
    
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_Nhom: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_NhomKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'strNhomKhaoSat_Cha_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtNhom"] = dtReRult;
                    me.genTable_Nhom(dtReRult, data.Pager);
                    me.cbGenCombo_Nhom(dtReRult);
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
    save_Nhom: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_NhomKhaoSat',
            'type': 'POST',
            'strId': me.strNhom_Id,
            'strTen': edu.util.getValById('txtTen_NhomCauHoi'),
            'strMoTa': edu.util.getValById('txtMoTa_NhomCauHoi'),
            'strNhomKhaoSat_Cha_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'dThuTu': edu.util.getValById('txtThuTu_NhomCauHoi'),
        };
        if (obj_save.strId) {
            obj_save.action = 'KS_ThongTin/Sua_KS_NhomKhaoSat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strPhieu_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strPhieu_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strPhieu_Id = obj_save.strId
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_Nhom();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Nhom: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_NhomKhaoSat',
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
                    me.getList_Nhom();
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
    genTable_Nhom: function (data, iPager) {
        var me = this;
        me.getList_CauHoi();
    },
    viewEdit_Nhom: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtTen_NhomCauHoi", data.TEN);
        edu.util.viewValById("txtThuTu_NhomCauHoi", data.THUTU);
        edu.util.viewValById("txtMoTa_NhomCauHoi", data.MOTA);
        edu.util.viewHTMLById("txtMoTa_NhomCauHoi", data.MOTA);
        me["strNhom_Id"] = data.ID;
    },
    cbGenCombo_Nhom: function (data) {
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
            renderPlace: ["dropThuocNhom"],
            type: "",
            title: "Chọn nhóm",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_CauHoi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_CauHoi',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strKS_LoaiCauHoi_Id': edu.util.getValById('dropAAAA'),
            'dTrangThai': -1,
            'dCauHoiBatBuocTraLoi': -1,
            'strKS_NhomCauHoi_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtCauHoi"]= dtReRult;
                    me.genTable_CauHoi(dtReRult, data.Pager);
                    me.cbGenCombo_CauHoi(dtReRult);
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
    save_CauHoi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_CauHoi',
            'type': 'POST',
            'strId': me.strCauHoi_Id,
            'strTenCauHoi': edu.util.getValById('txtCauHoi'),
            'strFileCauHoi': edu.util.getValById('txtAAAA'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'dSoDapAn': -1,
            'strKS_LoaiCauHoi_Id': edu.util.getValById('dropLoaiCauHoi'),
            'dCachHienThiCauHoi': edu.util.getValById('dropKieuHienThi'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'dCauHoiBatBuocTraLoi': edu.util.getValById('dropKieuTraLoi'),
            'strKS_NhomCauHoi_Id': edu.util.getValById('dropThuocNhom'),
            'strKS_NhomKhaoSat_Id': edu.util.getValById('dropAAAA'),
            'dThuTu': edu.util.getValById('txtThuTu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KS_ThongTin/Sua_KS_CauHoi';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strCauHoi_Id = "";

                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strCauHoi_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strCauHoi_Id = obj_save.strId
                    }
                    $("#tblDapAn tbody tr").each(function () {
                        var strDapAn_Id = this.id;
                        me.save_DapAn(strDapAn_Id, strCauHoi_Id);
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_CauHoi();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CauHoi: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_CauHoi',
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
                    me.getList_CauHoi();
                    me.toggle_phieu();
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
    genTable_CauHoi: function (data, iPager) {
        var me = this;
        $("#tblNoiDung").html("");
        var html = '';
        me.dtNhom.push({ ID: null });

        me.dtNhom.forEach((oNhom, iNhom) => {
            if (oNhom.TEN) {
                html += '<div class="cmc-suvery-group">';
                html += '<div class="title btnEditNhom btnEdit" id="' + oNhom.ID + '">';
                html += oNhom.TEN + ' <span class="color-red">*</span>';
                html += '</div>';
            }
            
            var dtCauHoiTheoNhom = me.dtCauHoi.filter(e => e.KS_NHOMCAUHOI_ID == oNhom.ID)
            dtCauHoiTheoNhom.forEach((oCauHoi, iCauHoi) => {
                html += '<div class="cmc-suvery-item">';
                html += '<div class="cmc-suvery-question pointer btnEdit btnEditCauHoi" id="' + oCauHoi.ID +'">';
                html += '<span class="fw-bold">Câu ' + (iCauHoi + 1) + ':</span>';
                html += oCauHoi.CAUHOIBATBUOCTRALOI ?'<span class="color-red">*</span>': '';
                html += ' <span class="question-text">' + oCauHoi.TENCAUHOI + '</span>';
                html += '</div>';
                html += '<div class="cmc-suvery-answer">';
                html += '<div class="answer-l" id="answer' + oCauHoi.ID + '">';
                //html += '<div class="form-check mb-2">';
                //html += '<input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">';
                //html += '<label class="form-check-label" for="flexRadioDefault1">';
                //html += 'Hoàn toàn không đồng ý';
                //html += '</label>';
                //html += '</div>';
                html += '</div>';
                
                html += '</div>';
                html += '</div>';
            })
            if (oNhom.TEN) {
                html += '<a class="btn btn-outline-warning btnAdd_CauHoi btnAdd" id="' + oNhom.ID + '" style="min-width: unset">';
                html += '<i class="fal fa-plus"></i>';
                html += '<span>Thêm câu hỏi</span>';
                html += '</a>';
                html += '</div>';
            }
        })
        $("#tblNoiDung").html(html);
        me.dtCauHoi.forEach(e => me.getList_DapAn_CauHoi(e))
    },
    viewEdit_CauHoi: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtCauHoi", data.TENCAUHOI);
        edu.util.viewValById("dropThuocNhom", data.KS_NHOMCAUHOI_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("dropLoaiCauHoi", data.KS_LOAICAUHOI_ID);
        edu.util.viewValById("dropKieuTraLoi", data.CAUHOIBATBUOCTRALOI);
        edu.util.viewValById("dropKieuHienThi", data.CACHHIENTHICAUHOI);
        me["strCauHoi_Id"] = data.ID;
    },
    cbGenCombo_CauHoi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCAUHOI",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_CauHoi"],
            type: "",
            title: "Chọn câu hỏi",
        }
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_DapAn: function (strKetQua_Id, strKS_CauHoi_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strThoiGian_Id = edu.util.getValById('txtTenDapAn' + strKetQua_Id);
        if (!edu.util.checkValue(strThoiGian_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_CauHoi_DapAn',
            'type': 'POST',
            'strId': strId,
            'strFileDapAn': edu.util.getValById('txtAAAA'),
            'strTenDapAn': edu.util.getValById('txtTenDapAn' + strKetQua_Id),
            'dThuTu': edu.util.getValById('txtThuTu' + strKetQua_Id),
            'strKS_CauHoi_Id': strKS_CauHoi_Id,
            'strMaDapAn': edu.util.getValById('txtMaDapAn' + strKetQua_Id),
            'dTrongSo': edu.util.getValById('txtTrongSo' + strKetQua_Id),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'KS_ThongTin/Sua_KS_CauHoi_DapAn';
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
    getList_DapAn: function () {
        var me = this;
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_CauHoi_DapAn',
            'type': 'GET',
            'strKS_CauHoi_Id': me.strCauHoi_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    me.genHTML_DapAn_Data(dtResult);
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

    delete_DapAn: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_CauHoi_DapAn',
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
                    me.getList_DapAn();
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
    genHTML_DapAn_Data: function (data) {
        var me = this;
        $("#tblDapAn tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtTenDapAn' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TENDAPAN) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtMaDapAn' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MADAPAN) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td><input type="text" id="txtTrongSo' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TRONGSODIEM) + '" class="form-control" style="padding-left: 10px" /></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblDapAn tbody").append(row);
        }

    },
    genHTML_DapAn: function (strKetQua_Id, aData) {
        var me = this;
        if (aData == undefined) aData = {};
        var iViTri = document.getElementById("tblDapAn").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = ''; 
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtTenDapAn' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TENDAPAN) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtMaDapAn' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MADAPAN) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtThuTu' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td><input type="text" id="txtTrongSo' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TRONGSODIEM) + '" class="form-control" style="padding-left: 10px" /></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblDapAn tbody").append(row);
    },

    getList_DapAn_Mau: function () {
        var me = this;
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_CauHoi_DapAn',
            'type': 'GET',
            'strKS_CauHoi_Id': edu.util.getValById('dropSearch_CauHoi'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    me["dtDapAn_Mau"] = dtResult;
                    me.genTable_DapAn_Mau(dtResult);
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
    genTable_DapAn_Mau: function (data, iPager) {
        var me = this;
        $("#lblPhieu_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDapAn_Mau",
            
            aaData: data,
            colPos: {
                center: [0, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "TENDAPAN"
                },
                {
                    "mDataProp": "MADAPAN"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mDataProp": "TRONGSODIEM"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        console.log(jsonForm)
        edu.system.loadToTable_data(jsonForm);
    },


    getList_DapAn_CauHoi: function (objCauHoi) {
        var me = this;
        if (objCauHoi.KS_LOAICAUHOI_ID == 2) {
            var html = "";
            html += '<div class="input-group">';
            html += '<input type="text" class="form-control ps-3" />';
            html += '</div>';
            $("#answer" + objCauHoi.ID).html(html)
            return;
        }

        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_CauHoi_DapAn',
            'type': 'GET',
            'strKS_CauHoi_Id': objCauHoi.ID,
            'strKS_PhieuKhaoSat_Mau_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    var html = '';
                    dtResult = data.Data;
                    dtResult.forEach(e => {
                        var strStyle = objCauHoi.CACHHIENTHICAUHOI ? 'width: 100%' : '';
                        var typean = objCauHoi.KS_LOAICAUHOI_ID == "3" ? "radio" : "checkbox";
                        html += '<div class="form-check mb-2" style="' + strStyle + '">';
                        html += '<input class="form-check-input" type="' + typean +'" name="' + e.ID + '" id="' + e.ID + '">';
                        html += '<label class="form-check-label" for="' + e.ID + '">';
                        html += e.TENDAPAN;
                        html += '</label>';
                        html += '</div>';
                    })
                    $("#answer" + objCauHoi.ID).html(html)
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
    }
}