/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function GiayTo() { };
GiayTo.prototype = {
    strGiayTo_Id: '',
    strDanhMucPhi_Id: '',
    strPhanCong_Id: '',
    strNgayLamViec_Id: '',
    dtGiayTo: [],
    dtDanhMucPhi: [],
    dtPhanCong: [],
    dtNgayLamViec: [],
    dtNguoiDung: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_GiayTo();
        me.getList_DMLKT();
        me.getList_CCTC();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_HS();
        edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.HINHTHUCTHANHTOAN", "dropHinhThucThanhToan");
        edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.TRUONGTHONGTIN", "", "", me.genTable_KhoanCanKhai);

        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnSearch").click(function () {
            me.getList_GiayTo();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_GiayTo();
            }
        });
        $("#chkSelectAll_DanhMucChung").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblGiayTo" });
        });
        $("#tblDanhMucChung").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_GiayTo(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddDanhMucChung").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_DanhMucChung").click(function () {
            me.save_GiayTo();
        });
        $("#btnXoaDanhMucChung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucChung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_GiayTo(arrChecked_Id[i]);
                }
            });
        });
        
        $("#tblDanhMucChung").delegate(".btnDSPhi", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strGiayTo_Id = strId;
                edu.util.toggle_overide("zone-bus", "zoneDanhMucPhi");
                me.getList_DanhMucPhi();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDanhMucChung").delegate(".btnDSPhanCong", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strGiayTo_Id = strId;
                edu.util.toggle_overide("zone-bus", "zonePhanCong");
                me.getList_PhanCong();
                me.getList_NguoiDung();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblDanhMucChung").delegate(".btnDSNgayLamViec", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strGiayTo_Id = strId;
                edu.util.toggle_overide("zone-bus", "zoneNgayLamViec");
                me.getList_NgayLamViec();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });


        $("#chkSelectAll_DanhMucPhi").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDanhMucPhi" });
        });
        $("#tblDanhMucPhi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_DanhMucPhi(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddDanhMucPhi").click(function () {
            me.popup_DanhMucPhi();
            me.resetPopup_DanhMucPhi();
        });
        $("#btnSave_DanhMucPhi").click(function () {
            me.save_DanhMucPhi();
        });
        $("#btnXoaDanhMucPhi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDanhMucPhi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DanhMucPhi(arrChecked_Id[i]);
                }
            });
        });


        $("#chkSelectAll_PhanCong").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhanCong" });
        });
        $("#tblPhanCong").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_PhanCong(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddPhanCong").click(function () {
            me.popup_PhanCong();
            me.resetPopup_PhanCong();
        });
        $("#btnSave_PhanCong").click(function () {
            me.save_PhanCong();
        });
        $("#btnXoaPhanCong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanCong(arrChecked_Id[i]);
                }
            });
        });


        $("#chkSelectAll_NgayLamViec").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNgayLamViec" });
        });
        $("#tblNgayLamViec").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_NgayLamViec(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAddNgayLamViec").click(function () {
            me.popup_NgayLamViec();
            me.resetPopup_NgayLamViec();
        });
        $("#btnSave_NgayLamViec").click(function () {
            me.save_NgayLamViec();
        });
        $("#btnXoaNgayLamViec").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNgayLamViec", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NgayLamViec(arrChecked_Id[i]);
                }
            });
        });

        $("#dropDonVi").on("select2:select", function () {
            me.getList_HS();
        });

        $('#dropHeDaoTao').on('select2:select', function (e) {
            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropKhoaDaoTao').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropChuongTrinh').on('select2:select', function (e) {
            me.getList_LopQuanLy();
        });

        edu.system.uploadFiles(["txtFileDinhKem"]);


        $("#chkSelectAll_KhoanCanKhai").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKhoanCanKhai" });
        });

        /*------------------------------------------
        --Discription: [2] Action NhanSu
        --Order: 
        -------------------------------------------*/
        $(".btnSearchTTS_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInput_TTS_ThanhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DeTai_ThanhVien(strNhanSu_Id);
                });
            }
        });

        /*------------------------------------------
      --Discription: [4-1] Action KetQua_Detai
      --Order:
      -------------------------------------------*/
        $("#btnThemDongMoi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_NguoiDung(id, "");
        });
        $("#tblNguoiDung").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblNguoiDung tr[id='" + strRowId + "']").remove();
        });
        $("#tblNguoiDung").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_NguoiDung(strId);
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.TINHTRANGXULY", "", "", me.cbGetList_TruongTT);


        $("#btnSave_CauHinhThongTin").click(function () {
            $("#tblNguoiDung tbody tr").each(function () {
                var strKetQua_Id = this.id.replace(/rm_row/g, '');
                me.save_NguoiDung(strKetQua_Id, "");
            });
        });
        me.getComBo_NguoiDung();
    },
    popup: function () {
        //show
        $('#myModalDanhMucChung').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strGiayTo_Id = "";
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropDonViDanhMucChung", "");
        edu.util.viewValById("txtNgayXuLy", "");
        edu.util.viewValById("txtGio", "");
        edu.util.viewValById("txtPhut", "");
        edu.util.viewValById("txtSoLuong", "");
        edu.util.viewValById("txtMoTa", "");
        edu.system.viewFiles("txtFileDinhKem", "");
    },
    popup_DanhMucPhi: function () {
        //show
        $('#myModalDanhMucPhi').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_DanhMucPhi: function () {
        var me = this;
        me.strDanhMucPhi_Id = "";
        edu.util.viewValById("dropKhoanPhi", "");
        edu.util.viewValById("dropHinhThucThanhToan", "");
        edu.util.viewValById("txtNgayApDung", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("txtSoTien", "");
        $("#lblDanhMucChung").html("");
    },
    popup_PhanCong: function () {
        //show
        $('#myModalPhanCong').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_PhanCong: function () {
        var me = this;
        me.strPhanCong_Id = "";
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLopQuanLy", "");
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropCanBo", "");
        $("#lblPhanCong").html("");
    },
    popup_NgayLamViec: function () {
        //show
        $('#myModalNgayLamViec').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup_NgayLamViec: function () {
        var me = this;
        var html = "";
        for (var i = 2; i < 8; i++) {
            html += '<div class="checkbox-inline user-check-print zoneCkbDSThu">';
            html += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="' + i + '" name="' + i + '" class="ckbDSThu"><label for="' + i + '">Thứ ' + i +'</label>';
            html += '</div>';
        }
        html += '<div class="checkbox-inline user-check-print zoneCkbDSThu">';
        html += '<input checked="checked" style="float: left; margin-right: 5px" type="checkbox" id="8" name="8" class="ckbDSThu"><label for="8">Chủ nhật</label>';
        html += '</div>';
        $("#zoneLamViec").html(html);
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_GiayTo();
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_GiayTo: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_DanhMuc/ThemMoi',
            'type': 'POST',
            'strId': me.strGiayTo_Id,
            'strMa': edu.util.getValById('txtMa'),
            'strTen': edu.util.getValById('txtTen'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'dSoLuongToiDa': edu.util.getValById('txtSoLuong'),
            'strDonViPhuTrach_Id': edu.util.getValById('dropDonViDanhMucChung'),
            'dSoNgay_XuLy': edu.util.getValById('txtNgayXuLy'),
            'dSoGio_XuLy': edu.util.getValById('txtGio'),
            'dSoPhut_XuLy': edu.util.getValById('txtPhut'),
            'iThuTu': edu.util.getValById('txtAAAA'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_MotCua_DanhMuc/CapNhat'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strId = obj_save.strId;
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalDanhMucChung #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                        strId = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalDanhMucChung #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    edu.system.saveFiles("txtFileDinhKem", strId, "SV_Files");
                    var arrThem = [];
                    var arrXoa = [];
                    var x = $("#tblKhoanCanKhai .checkKhoanCanKhai");
                    for (var i = 0; i < x.length; i++) {
                        if ($(x[i]).is(':checked')) {
                            if ($(x[i]).attr("name") == undefined) {
                                arrThem.push(x[i]);
                            }
                        }
                        else {
                            if ($(x[i]).attr("name") != undefined) {
                                arrXoa.push($(x[i]).attr("name"));
                            }
                        }
                    }
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_KhoanCanKhai(arrThem[i].id.replace("checkX"), strId);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_KhoanCanKhai(arrXoa[i]);
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalDanhMucChung #notify"
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
                me.getList_GiayTo();
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_GiayTo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_DanhMuc/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGiayTo = dtReRult;
                    me.genTable_GiayTo(dtReRult, data.Pager);
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
    delete_GiayTo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc/Xoa',
            'type': 'POST',
            'strIds': Ids,
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
                    me.getList_GiayTo();
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
    genTable_GiayTo: function (data, iPager) {
        $("#lblGiayTo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucChung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.GiayTo.getList_GiayTo()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 4,5,6,7,8,9,10,11,12,13,14, 15],
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
                    "mDataProp": "DONVIPHUTRACH_TEN"
                },
                {
                    "mDataProp": "SOLUONGTOIDA"
                },
                {
                    "mDataProp": "SONGAY_XULY"
                },
                {
                    "mDataProp": "SOGIO_XULY"
                },
                {
                    "mDataProp": "SOPHUT_XULY"
                },
                {
                    "mDataProp": "HIEULUC"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSPhi" id="' + aData.ID + '" title="Xem phí"><i class="fa fa-eye color-active"></i> Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSPhanCong" id="' + aData.ID + '" title="Xem phân công"><i class="fa fa-eye color-active"></i> Xem</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSNgayLamViec" id="' + aData.ID + '" title="Xem ngày làm việc"><i class="fa fa-eye color-active"></i> Xem</a></span>';
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
    viewForm_GiayTo: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtGiayTo, "ID")[0];
        me.popup();
        //view data --Edit
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropDonViDanhMucChung", data.DONVIPHUTRACH_ID);
        edu.util.viewValById("txtNgayXuLy", data.SONGAY_XULY);
        edu.util.viewValById("txtGio", data.SOGIO_XULY);
        edu.util.viewValById("txtPhut", data.SOPHUT_XULY);
        edu.util.viewValById("txtSoLuong", data.SOLUONGTOIDA);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.system.viewFiles("txtFileDinhKem", data.ID, "SV_Files");
        me.strGiayTo_Id = data.ID;
        me.getList_KhoanCanKhai();
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DanhMucPhi: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_DanhMuc_Phi/ThemMoi',
            'type': 'POST',
            'strId': me.strDanhMucPhi_Id,
            'dSoTien': edu.util.getValById('txtSoTien'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanPhi'),
            'strNgayApDung': edu.util.getValById('txtNgayApDung'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strHinhThucThanhToan_Id': edu.util.getValById('dropHinhThucThanhToan'),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_MotCua_DanhMuc_Phi/CapNhat'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalDanhMucPhi #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalDanhMucPhi #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_DanhMucPhi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalDanhMucPhi #notify"
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

                me.getList_DanhMucPhi();
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DanhMucPhi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_DanhMuc_Phi/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
            'strHinhThucThanhToan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDanhMucPhi = dtReRult;
                    me.genTable_DanhMucPhi(dtReRult, data.Pager);
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
    delete_DanhMucPhi: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc_Phi/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_DanhMucPhi();
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
    genTable_DanhMucPhi: function (data, iPager) {
        $("#lblDanhMucPhi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDanhMucPhi",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.GiayTo.getList_DanhMucPhi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 4, 7, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TAICHINH_CACKHOANTHU_TEN"
                },
                {
                    "mDataProp": "SOTIEN"
                },
                {
                    "mDataProp": "HINHTHUCTHANHTOAN_TEN"
                },
                {
                    "mDataProp": "NGAYAPDUNG"
                },
                {
                    "mDataProp": "MOTA"
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
    viewForm_DanhMucPhi: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtDanhMucPhi, "ID")[0];
        me.popup_DanhMucPhi();
        //view data --Edit
        edu.util.viewValById("dropKhoanPhi", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropHinhThucThanhToan", data.HINHTHUCTHANHTOAN_ID);
        edu.util.viewValById("txtNgayApDung", data.NGAYAPDUNG);
        edu.util.viewValById("txtSoTien", data.SOTIEN);
        edu.util.viewValById("txtMoTa", data.MOTA);
        $("#lblDanhMucChung").html(" - " + data.MOTCUA_DANHMUC_TEN);
        me.strDanhMucPhi_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_PhanCong: function (strId) {
        var me = this;
        var obj_notify = {};
        var strPhamViApDung_Id = "";
        var strHeDaoDao_Id = edu.util.getValById('dropHeDaoTao');
        var strKhoaDaoDao_Id = edu.util.getValById('dropKhoaDaoTao');
        var strChuongTrinhDaoDao_Id = edu.util.getValById('dropChuongTrinh');
        var strLop_Id = edu.util.getValById('dropLopQuanLy');
        if (strLop_Id) strPhamViApDung_Id = strLop_Id;
        else if (strChuongTrinhDaoDao_Id) strPhamViApDung_Id = strChuongTrinhDaoDao_Id;
        else if (strKhoaDaoDao_Id) strPhamViApDung_Id = strKhoaDaoDao_Id;
        else if (strHeDaoDao_Id) strPhamViApDung_Id = strHeDaoDao_Id;
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_DanhMuc_PhanCong/ThemMoi',
            'type': 'POST',
            'strId': me.strPhanCong_Id,
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strVaiTro_Id': edu.util.getValById('dropAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropCanBo'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        if (obj_save.strId) {
            obj_save.action = 'SV_MotCua_DanhMuc_PhanCong/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalPhanCong #notify"
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalPhanCong #notify"
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_PhanCong();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalPhanCong #notify"
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

                me.getList_PhanCong();
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhanCong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_DanhMuc_PhanCong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhanCong = dtReRult;
                    me.genTable_PhanCong(dtReRult, data.Pager);
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
    delete_PhanCong: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc_PhanCong/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_PhanCong();
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
    genTable_PhanCong: function (data, iPager) {
        $("#lblPhanCong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.GiayTo.getList_PhanCong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MOTCUA_DANHMUC_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "VAITRO_TEN"
                },
                {
                    "mDataProp": "MOTA"
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
    viewForm_PhanCong: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtPhanCong, "ID")[0];
        me.popup_PhanCong();
        //view data --Edit
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", "");
        edu.util.viewValById("dropChuongTrinh", "");
        edu.util.viewValById("dropLopQuanLy", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropDonVi", "");
        edu.util.viewValById("dropCanBo", data.NGUOIDUNG_ID);
        $("#lblPhanCong").html(" - " + data.MOTCUA_DANHMUC_TEN);
        me.strPhanCong_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NgayLamViec: function (dThuTrongTuan) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_DanhMuc_NgayLV/ThemMoi',
            'type': 'POST',
            'dThuTrongTuan': edu.extend.getCheckedCheckBoxByClassName('ckbDSThu').toString(),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
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
                            prePos: "#myModalNgayLamViec #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalNgayLamViec #notify"
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_NgayLamViec();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalNgayLamViec #notify"
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
                    me.getList_NgayLamViec();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NgayLamViec: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_DanhMuc_NgayLV/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNgayLamViec = dtReRult;
                    me.genTable_NgayLamViec(dtReRult, data.Pager);
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
    delete_NgayLamViec: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc_NgayLV/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_NgayLamViec();
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
    genTable_NgayLamViec: function (data, iPager) {
        $("#lblNgayLamViec_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNgayLamViec",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.GiayTo.getList_NgayLamViec()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3, 4],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MOTCUA_DANHMUC_TEN"
                },
                {
                    "mDataProp": "THUTRONGTUAN"
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
    viewForm_NgayLamViec: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtGiayTo, "ID")[0];
        //me.resetPopup_NgayLamViec();
        me.popup_NgayLamViec();
        var html = "";
        for (var i = 2; i < 8; i++) {
            html += '<div class="checkbox-inline user-check-print zoneCkbDSThu">';
            html += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + i + '" class="ckbDSThu"><a for="' + i + '">Thứ ' + i + '</a>';
            html += '</div>';
        }
        html += '<div class="checkbox-inline user-check-print zoneCkbDSThu">';
        html += '<input style="float: left; margin-right: 5px" type="checkbox" id="8" class="ckbDSThu"><a for="8">Chủ nhật</a>';
        html += '</div>';
        $("#zoneLamViec").html(html);
        //view data --Edit
        var point = $("#zoneLamViec #" + data.ID);
        point.attr('checked', true);
        point.prop('checked', true);
        me.strNgayLamViec_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
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
                    me.cbGenCombo_KhoanThu(data.Data);
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
    cbGenCombo_KhoanThu: function (data) {
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
            renderPlace: ["dropKhoanPhi"],
            type: "",
            title: "Chọn khoản phí",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
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
            renderPlace: ["dropDonVi", "dropDonViDanhMucChung"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_HS: function () {
        var me = this;
        //
        //var strDaoTao_CoCauToChuc_Id = edu.util.getValById("dropCapNhat_BoMon");
        //if (!edu.util.checkValue(strDaoTao_CoCauToChuc_Id)) {
        //    strDaoTao_CoCauToChuc_Id = "";//edu.util.getValById("dropKhoiTao_CCTC");
        //}
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',


            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 100000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropDonVi"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': -1
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }

            },
            error: function (er) { },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);

    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropCanBo"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },


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
            strHeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropKhoaDaoTao"),
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropHeDaoTao"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropChuongTrinh"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
    },

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
            renderPlace: ["dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropChuongTrinh"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
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
            renderPlace: ["dropLopQuanLy"],
            type: "",
            title: "Chọn lớp",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KhoanCanKhai: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblKhoanCanKhai",
            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MA"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="checkKhoanCanKhai" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    getList_KhoanCanKhai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_DanhMuc_MoRong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strMotCua_DanhMuc_Id': me.strGiayTo_Id,
            'strTruongThongTin_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        var x = $("#tblKhoanCanKhai #checkX" + e.TRUONGTHONGTIN_ID);
                        x.attr("checked", true);
                        x.prop("checked", true);
                        x.attr("name", e.ID);
                    });
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
    save_KhoanCanKhai: function (strTruongThongTin_Id, strMotCua_DanhMuc_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_DanhMuc_MoRong/ThemMoi',
            'type': 'POST',
            'strId': "",
            'strMotCua_DanhMuc_Id': strMotCua_DanhMuc_Id,
            'strTruongThongTin_Id': strTruongThongTin_Id,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_MotCua_DanhMuc/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                            prePos: "#myModalNgayLamViec #notify"
                        }
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                            prePos: "#myModalNgayLamViec #notify"
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                        prePos: "#myModalNgayLamViec #notify"
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_NgayLamViec();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KhoanCanKhai: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc_MoRong/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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

            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_NgayLamViec();
            //    });
            //},
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    /*------------------------------------------
    --Discription: [2] AccessDB ThongTin
    --ULR:  Modules
    -------------------------------------------*/
    save_NguoiDung: function (strKetQua_Id, strDeTai_Id) {
        var me = this;
        var strId = strKetQua_Id;
        var strNguoiDung_Id = edu.util.getValById('dropNguoiDung' + strKetQua_Id);
        var strTinhTrangXuLy_Id = edu.util.getValById('dropTrangThai' + strKetQua_Id);
        if (!edu.util.checkValue(strNguoiDung_Id) || !edu.util.checkValue(strTinhTrangXuLy_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_TT_NguoiDung/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTinhTrangXuLy_Id': strTinhTrangXuLy_Id,
            'strNguoiDung_Id': strNguoiDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'SV_MotCua_TT_NguoiDung/CapNhat';
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
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
    getList_NguoiDung: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_MotCua_TT_NguoiDung/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_NguoiHoc_Id': me.strKeHoachXuLy_Id,
            'strTruongThongTin_Id': edu.util.getValById('dropAAAA'), 
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 200000,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_NguoiDung_Data(dtResult);
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
    delete_NguoiDung: function (strIds) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'SV_MotCua_TT_NguoiDung/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NguoiDung();
                }
                else {
                    obj = {
                        content: "NCKH_DeTai_ThanhVien/Xoa: " + data.Message,
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
    genHTML_NguoiDung_Data: function (data) {
        var me = this;
        $("#tblNguoiDung tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropNguoiDung' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn người dùng--</option ></select ></td>';
            row += '<td><select id="dropTrangThai' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn trạng thái--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblNguoiDung tbody").append(row);
            me.genComBo_NguoiDung("dropNguoiDung" + strKetQua_Id, aData.NGUOIDUNG_ID);
            me.genComBo_TrangThai("dropTrangThai" + strKetQua_Id, aData.TINHTRANGXULY_ID);
        }
        for (var i = data.length; i < 2; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_NguoiDung(id, "");
        }
    },
    genHTML_NguoiDung: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblNguoiDung").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropNguoiDung' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn người dùng--</option ></select ></td>';
        row += '<td><select id="dropTrangThai' + strKetQua_Id + '" class="select-opt"><option value=""> --- Chọn trạng thái--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblNguoiDung tbody").append(row);
        me.genComBo_NguoiDung("dropNguoiDung" + strKetQua_Id, aData.NGUOIDUNG_ID);
        me.genComBo_TrangThai("dropTrangThai" + strKetQua_Id, aData.TINHTRANGXULY_ID);
    },

    genComBo_NguoiDung: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtNguoiDung,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val,
                mRender: function (nRow, aData) {
                    var strKetQua = aData.TENDAYDU + " - " + aData.TAIKHOAN;
                    return strKetQua;
                }
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn người dùng"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    cbGetList_TruongTT: function (data) {
        main_doc.GiayTo.dtTinhTrang = data;
    },
    genComBo_TrangThai: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTinhTrang,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val,
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn trạng thái"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    
    getComBo_NguoiDung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_Chung/LayDSNguoiDung',
            'type': 'GET',
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
                    me.dtNguoiDung = dtResult;
                }
                else {
                    edu.system.alert("CMS_NguoiDung/LayDanhSach: " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert("CMS_NguoiDung/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
}