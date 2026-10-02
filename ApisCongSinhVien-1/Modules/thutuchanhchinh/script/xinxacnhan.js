/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function GiayTo() { }
GiayTo.prototype = {
    strNguoiHoc_Id: '',
    strHoatDong_Id: '',
    dtChoXacNhan: [],
    dtGiayTo: [],
    dtTuNhapHoSo: [],
    strGiayTo_Id: '',
    strMotCua_NguoiHoc_YeuCau_Id: '',
    dtDanhGia: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strNguoiHoc_Id = edu.system.userId;
        me.getList_DM_HoatDong();
        me.getList_ChoXacNhan();
        me.getList_GiayTo();
        //edu.system.loadToCombo_DanhMucDuLieu("MOTCUA.DIEMMOCKIEMTRA", "dropSearch_MocKiemTra,dropTinhTrang");
        edu.system.loadToCombo_DanhMucDuLieu("MOTCUA_DANHGIA_CHATLUONG", "", "", function (data) {
            me.dtDanhGia = data;
        });

        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#chkSelectAll_ChoXacNhan").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChoXacNhan" });
        });
        $("#chkSelectAll_ConLai").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblGiayTo" });
        });

        $("#zoneTab").delegate('.tabhoatdong', 'click', function (e) {
            var strId = this.id;
            me.strHoatDong_Id = strId;
            me.getList_TinhTrang(strId);
        });
        $("#tblChoXacNhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_ChoXacNhan(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $(".btnSave_DanhMucChung").click(function () {
            //for (var i = 0; i < me.dtGiayTo.length; i++) {
            //    me.save_GiayTo(me.dtGiayTo[i].ID);
            //}
            me.save_GiayTo(me.strGiayTo_Id);
            
        });
        $("#btnDeleteChoXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChoXacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ChoXacNhan(arrChecked_Id[i]);
                }
            });
        });
        $("#tblGiayTo").delegate('.checkgiayto', 'change', function (e) {
            var strId = this.id.replace('checkX', '');
            me.strGiayTo_Id = strId;
            if (this.checked) {
                //me.save_TaoFile(strFile);
                me.getList_TuNhapHoSo();
            }
            //else {
            //    $("#tblTuNhapHoSo tr[class='" + strId + "']").html("");
            //}
        });

        $("#tblConLai").delegate(".chonsao", "click", function () {
            var strId = this.id;
            var strGiayTo = $(this).attr("name");
            iDanhGia = parseInt(strId);
            for (var i = 1; i <= iDanhGia; i++) {
                $("#zonechonsao #" + i).removeClass("fa fa-star-o").addClass("fa fa-star");
            }
            for (var i = iDanhGia + 1; i <= 5; i++) {
                $("#zonechonsao #" + i).removeClass("fa fa-star").addClass("fa fa-star-o");
            }

            var obj = me.dtDanhGia.find(e => e.MA === strId);
            if (obj) {
                me.save_DanhGia(strGiayTo, obj.ID);
            }
        });
        //$(".checkgiayto").change(function () {
        //    var strId = this.id.replace('checkX', '');
        //    console.log(strId+ "22222");
        //    if (this.checked) {
        //        me.getList_TuNhapHoSo(strId);
        //    } else {
        //        $("#tblTuNhapHoSo tr[class='" + strId +"']").html("");
        //    }
        //});
        //edu.system.uploadFiles(["txtFileDinhKem"]);
        
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_ChoXacNhan();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strMotCua_NguoiHoc_YeuCau_Id = "";
        edu.util.viewValById("txtYKien", "");
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
            'action': 'SV_MotCua_NguoiHoc_YeuCau/ThemMoi',
            'type': 'POST',
            'strId': me.strMotCua_NguoiHoc_YeuCau_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'dSoLuong': edu.util.getValById('txtSoLuong' + strId),
            'strMoTa': edu.util.getValById('txtGhiChu' + strId),
            'strNhanXet': edu.util.getValById('txtYKien'),
            'strDanhGiaChatLuong_Id': edu.util.getValById('dropAAAA'),
            'strSoDienThoaiNguoiNhan': edu.util.getValById('txtDienThoai'),
            'strDiaChiNguoiNhan': edu.util.getValById('txtDiaChi'),
            'strEmailNguoiNhan': edu.util.getValById('txtEmail'),
            'strMotCua_DanhMuc_Id': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'SV_MotCua_NguoiHoc_YeuCau/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alert("Thêm mới thành công!");
                        me.strMotCua_NguoiHoc_YeuCau_Id = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                    var x = $("#tblTuNhapHoSo tbody tr");
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", x.length);
                    for (var i = 0; i < x.length; i++) {
                        me.save_TuNhapHoSo(x[i].id);
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
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
            //    me.getList_GiayTo();
            //},
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
            'action': 'SV_MotCua_Chung/LayDSMotCua_DanhMuc',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
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
        var obj_save = {
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
    getList_ChoXacNhan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_NguoiHoc_YeuCau/LayDSYeuCauChuaXuLy',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChoXacNhan = dtReRult;
                    me.genTable_ChoXacNhan(dtReRult);
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
    getList_TinhTrang: function (strTinhTrangXuLy_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_NguoiHoc_YeuCau/LayDSYeuCauTheoTinhTrangXuLy',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strTinhTrangXuLy_Id': strTinhTrangXuLy_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTable_TinhTrang(dtReRult);
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
    genTable_TinhTrang: function (data, iPager) {
        //$("#lblGiayTo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblConLai",
            aaData: data,
            colPos: {
                center: [0, 3, 4, 5, 6,7],
                right: [2]
            },
            aoColumns: [
                {
                    "mDataProp": "MOTCUA_DANHMUC_TEN"
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mDataProp": "NGAYXULY_DD_MM_YYYY"
                },
                {
                    "mDataProp": "TINHTRANGXULY_TEN"
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        var iDanhGia = aData.DANHGIACHATLUONG_MA;
                        if (iDanhGia) iDanhGia = parseInt(iDanhGia);
                        else {
                            iDanhGia = 0;
                        }
                        var strKetQua = '<div id="zonechonsao" class="poiter">';
                        for (var i = 1; i <= iDanhGia; i++) {
                            strKetQua += '<i class="fa fa-star chonsao" id="' + i + '" name="' + aData.MOTCUA_NGUOIHOC_YEUCAU_ID + '"></i>';
                        }
                        for (var i = iDanhGia + 1; i <= 5; i++) {
                            strKetQua += '<i class="fa fa-star-o chonsao" id="' + i + '" name="' + aData.MOTCUA_NGUOIHOC_YEUCAU_ID + '"></i>';
                        }
                        strKetQua += '</div>';
                        return strKetQua;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    genTable_ChoXacNhan: function (data, iPager) {
        $("#lblGiayTo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChoXacNhan",
            aaData: data,
            colPos: {
                center: [0,6, 7, 3, 4],
                right: [2]
            },
            aoColumns: [
                {
                    "mDataProp": "MOTCUA_DANHMUC_TEN"
                },
                {
                    "mData": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
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
    genTable_GiayTo: function (data, iPager) {
        //$("#lblGiayTo_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGiayTo",
            aaData: data,
            colPos: {
                center: [0, 5,6],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtSoLuong' + aData.ID + '" class="form-control form-border-bottom" value="1" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtGhiChu' + aData.ID + '" class="form-control form-border-bottom" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtFileDinhKem' + aData.ID + '" class="form-control form-border-bottom" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        if (!aData.DUONGDANFILE) return "";
                        return '<a href="' + edu.system.rootPathUpload + "//" + aData.DUONGDANFILE + '"  target="_blank"><i class="fa fa-cloud-download"></i></a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="radio" name="checkgiayto" class="checkgiayto" id="checkX' + aData.ID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var arrFileDinhKem = [];
        data.forEach(e => arrFileDinhKem.push("txtFileDinhKem" + e.ID));
        edu.system.uploadFiles(arrFileDinhKem);
        data.forEach(e => edu.system.viewFiles("txtFileDinhKem" + e.ID, e.ID, "SV_Files"));
        /*III. Callback*/
    },
    viewForm_ChoXacNhan: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtChoXacNhan, "ID")[0];
        me.toggle_edit();
        //view data --Edit
        edu.util.viewValById("txtDienThoai", data.SODIENTHOAINGUOINHAN);
        edu.util.viewValById("txtEmail", data.EMAILNGUOINHAN);
        edu.util.viewValById("txtDiaChi", data.DIACHINGUOINHAN);
        edu.util.viewValById("txtYKien", data.NHANXET);
        me.strMotCua_NguoiHoc_YeuCau_Id = data.ID;
        me.strGiayTo_Id = data.MOTCUA_DANHMUC_ID;
        me.getList_TuNhapHoSo();
    },

    getList_DM_HoatDong: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_Chung/LayDSTinhTrangXuLy',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.genComBo_DM_HoatDong(dtReRult);
                    me.genTab_DM_HoatDong(dtReRult);
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
    genComBo_DM_HoatDong: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropHoatDong"],
            type: "",
            title: "Chọn hoạt động"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTab_DM_HoatDong: function (data) {
        var me = this;
        var html = '';
        data.forEach((aData, nRow) => {
            html += '<li class="tabhoatdong" id="' + aData.ID + '">';
            html += '<a href="#tab_2" data-toggle="tab" aria-expanded="false">';
            html += '<span class="lang" key="">' + (nRow + 2) + ') ' + aData.TEN + '</span>';
            html += '</a>';
            html += '</li>';
        });
        $("#zoneTab").append(html);
    },


    delete_ChoXacNhan: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_NguoiHoc_YeuCau/Xoa',

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
                    me.getList_ChoXacNhan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TuNhapHoSo: function (strId) {
        var me = this;

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_DanhMuc_DuLieu/ThemMoi',
            'type': 'POST',
            'strId': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strTruongThongTin_Id': strId.substring(0,32),
            'strTruongThongTin_GiaTri': $("#m" + strId).val(),
            'strNguoiThucHien_Id': edu.system.userId,
            'strMotCua_DanhMuc_Id': strId.substr(32),
            'strMotCua_NguoiHoc_YeuCau_Id': me.strMotCua_NguoiHoc_YeuCau_Id,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'SV_MotCua_DanhMuc_DuLieu/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_TuNhapHoSo();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TuNhapHoSo: function () {
        var me = this;
        var strMotCua_DanhMuc_Id = me.strGiayTo_Id;
        var objGiayTo = me.dtGiayTo.find(e => e.ID === strMotCua_DanhMuc_Id);
        //--Edit
        var obj_list = {
            'action': 'SV_MotCua_Chung/LayDSDanhMucMoRong',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strMotCua_DanhMuc_Id': strMotCua_DanhMuc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDuongDanFile': objGiayTo.DUONGDANFILE,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me.dtTuNhapHoSo = dtReRult;
                    me.genTable_TuNhapHoSo(dtReRult, data.Pager, strMotCua_DanhMuc_Id);
                    if (data.Id) {
                        var offsetwidth = document.getElementById("tblTuNhapHoSo").offsetWidth;
                        $("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Id + '" width="' + offsetwidth +'px" height="600px"></iframe>');
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
    delete_TuNhapHoSo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_MotCua_DanhMuc_DuLieu/Xoa',

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
                    me.getList_TuNhapHoSo();
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
    genTable_TuNhapHoSo: function (data, iPager, strMotCua_DanhMuc_Id) {
        var me = this;
        $("#lblTuNhapHoSo_Tong").html(iPager);
        $("#tblTuNhapHoSo tbody").html("");
        data.forEach(aData => {
            var html = '<tr class="' + strMotCua_DanhMuc_Id + '" id="' + aData.ID + strMotCua_DanhMuc_Id +'">';
            html += '<td style="text-align: center">#</td>';
            html += '<td>' + aData.TEN + '</td>';
            html += '<td>';
            switch (aData.KIEUDULIEU.toUpperCase()) {
                case "TEXT": html += '<input id="m' + aData.ID + strMotCua_DanhMuc_Id + '" class="form-control" value="' + edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI) + '" />'; break;
                case "LIST": html += '<select id="m' + aData.ID + strMotCua_DanhMuc_Id + '" class="select-opt"></select>'; break;
                case "FILE": html += '<div id="m' + aData.ID + strMotCua_DanhMuc_Id + '"></div>'; break;
                //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
            }
            html += '</td>';
            html += '</tr>';
            $("#tblTuNhapHoSo tbody").append(html);
        });

        //var jsonForm = {
        //    strTable_Id: "tblTuNhapHoSo",
        //    aaData: data,
        //    colPos: {
        //        center: [0],
        //        //right: [5]
        //    },
        //    aoColumns: [
        //        {
        //            "mDataProp": "TEN"
        //        }]
        //};
        //jsonForm.aoColumns.push({
        //    "mRender": function (nRow, aData) {
        //        if (aData.KIEUDULIEU) {
        //            switch (aData.KIEUDULIEU.toUpperCase()) {
        //                case "TEXT": return '<input id="m' + aData.ID + '" class="form-control" value="' + aData.MABANGDANHMUC + '" />';
        //                case "LIST": return '<select id="m' + aData.ID + '" class="select-opt"></select>';
        //                case "FILE": return '<div id="m' + aData.ID + '"></div>';
        //                //case "AVATAR": return '<div id="' + aData.ID + '"></div>';
        //            }
        //        }
        //    }
        //});
        //edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            if (aData.KIEUDULIEU) {
                switch (aData.KIEUDULIEU.toUpperCase()) {
                    case "LIST": {
                        if (aData.MABANGDANHMUC) {
                            edu.system.loadToCombo_DanhMucDuLieu(aData.MABANGDANHMUC, "m" + aData.ID + strMotCua_DanhMuc_Id);
                            $("#m" + aData.ID + strMotCua_DanhMuc_Id).select2();
                        }
                    }; break;
                    case "FILE": edu.system.uploadFiles(["m" + aData.ID + strMotCua_DanhMuc_Id]); break;
                }
            }
        });
        setTimeout(function () {
            data.forEach(aData => {
                if (aData.KIEUDULIEU) {

                    switch (aData.KIEUDULIEU.toUpperCase()) {
                        case "LIST": {
                            $("#m" + aData.ID + strMotCua_DanhMuc_Id).val(aData.TRUONGTHONGTIN_GIATRI).trigger("change");
                        }; break;
                        case "FILE": edu.system.viewFiles("m" + aData.ID + strMotCua_DanhMuc_Id, "m" + aData.ID + strMotCua_DanhMuc_Id, "NS_Files"); break;
                    }
                }
            });
        }, 1000);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TaoFile: function (strMota) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_File/TaoFile',
            'type': 'POST',
            'strMota': strMota,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#zoneketqua").html('<iframe src="' + edu.system.rootPathUpload + "//" + data.Message + '" width="800px" height="600px"></iframe>');
                    //edu.system.alert("Cập nhật thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
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

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DanhGia: function (strId, strDanhGiaChatLuong_Id) {
        var me = this;

        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_MotCua_NguoiHoc_YeuCau/DanhGia_MotCua_NguoiHoc_YeuCau',
            'type': 'POST',
            'strId': strId,
            'strDanhGiaChatLuong_Id': strDanhGiaChatLuong_Id,
            'strNhanXet': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
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
}