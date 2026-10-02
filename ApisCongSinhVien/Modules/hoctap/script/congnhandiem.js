/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 02/8/2018
--Input: 
--Output:
--Note:
----------------------------------------------*/
function CongNhanDiem() { };
CongNhanDiem.prototype = {
    strNguoiHoc_Id: '',
    strCongNhanDiem_Id: '',
    strHocPhan_Id: '',
    dtCongNhanDiem: [],
    dtLoaiCongNhan: [],
    dtHocPhan: [],
    dtCoSo: [],
    strDsHocPhan_Id: '',
    init: function () {
        var me = this;

        me.strNguoiHoc_Id = edu.system.userId;// 'e7c4d5e4b2ed4ea1a50c3aaaac1988f6';
        me.getList_ChuongTrinh();
        me.getList_KeHoach();
        me.getList_CoSo();
        me.getList_LoaiChungChi();
        edu.system.pickerdate();
        $(".select-opt").select2();
        $("#btnSearch").click(function (e) {
            me.getList_HocPhan();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TuiBai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            if ($("#dropSearch_KeHoach").val() == "") {
                edu.system.alert("Bạn cần chọn kế hoạch");
                return;
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn học phần?");
                return;
            }
            me.toggle_edit();
            me.strDsHocPhan_Id = arrChecked_Id.toString();
            me.getList_CongNhanDiem(arrChecked_Id.toString());
            edu.system.viewFiles("txtFileDinhKemDS", "CongNhan" + edu.util.getValById("dropSearch_KeHoach")  + me.strNguoiHoc_Id, "SV_Files");
        });

        $('#dropSearch_KeHoach').on('select2:select', function () {
            //me.getList_LopQuanLy();
            //me.getList_HocPhan();
            ////me.getList_Hoc();
        })
        $('#dropSearch_ChuongTrinh').on('select2:select', function () {
            me.getList_HocPhan();
        });;
        $('#dropSearch_LoaiChungChi').on('select2:select', function () {
            me.getList_PhanLoai();
        });;


        $('#dropLoaiChungChi').on('select2:select', function () {
            me.getList_PhanLoai2();
        });;

        $('#dropLoaiCongNhan').on('select2:select', function () {
            me.getList_CoSoTable("", "");
        });;
        
        $("#tblHocPhan").delegate('.btnEdit', 'click', function (e) {
            var id = this.id;
            console.log(11111111);
            $("#lichsu_chitiet").modal("show");

            me.strHocPhan_Id = id;
            var aData = me.dtHocPhan.find(e => e.DAOTAO_HOCPHAN_ID == me.strHocPhan_Id);
            $("#lblHocPhan").html(aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN);
            edu.util.viewValById("dropCoSoDaoTao", "");
            edu.util.viewValById("dropLoaiChungChi", "");
            edu.util.viewValById("dropLoaiCongNhan", "");
            edu.util.viewValById("txtKetQuaCongNhan", "");
            edu.util.viewValById("txtNgayCap", "");
            edu.util.viewValById("txtNgayHetHan", "");
            edu.util.viewValById("txtGhiChu", "");
            edu.util.viewValById("txtHeDaoTao", "");
            edu.util.viewValById("txtSoTinChi", "");
            edu.util.viewValById("txtTenHocPhan", "");
            me["strPhanLoai_Id"] = "";
            me.strCongNhanDiem_Id = "";
            edu.system.viewFiles("txtFileDinhKem", "CongNhan" + edu.util.getValById("dropSearch_KeHoach") + me.strNguoiHoc_Id, "SV_Files");
            me.getDetail_CongNhanDiem();
        });
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.CONGNHAN.LOAI", "dropLoaiCongNhan", "", data => me.dtLoaiCongNhan = data);
        $("#btnSave_CongNhanDiem").click(function () {
            if (edu.util.getValById("txtFileDinhKem")) {
                me.save_CongNhanDiem();
                edu.system.saveFiles("txtFileDinhKem", "CongNhan" + edu.util.getValById("dropSearch_KeHoach") + me.strNguoiHoc_Id, "SV_Files");
            } else {
                edu.system.alert("Bạn cần tải file minh chứng lên")
            }
        });
        $("#btnDelete_CongNhanDiem").click(function () {
            console.log(11111111);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_CongNhanDiem(me.strCongNhanDiem_Id)
            });
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan(arrChecked_Id[i], strTinhTrang, strMoTa, "DUYETDANGKYPHUCKHAO");
            }
        });
        $(".btnDangKy").click(function () {
            if (edu.util.getValById("txtFileDinhKemDS")) {
                var x = $("#tblCongNhanDiem tbody tr");
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", x.length);
                x.each(function () {
                    var strId = this.id;
                    me.save_DSCongNhanDiem(strId);
                })
                //edu.system.viewFiles("txtFileDinhKemDS", "CongNhan" + me.strNguoiHoc_Id, "SV_Files");
                edu.system.saveFiles("txtFileDinhKemDS", "CongNhan" + edu.util.getValById("dropSearch_KeHoach") + me.strNguoiHoc_Id, "SV_Files");
            } else {
                edu.system.alert("Bạn cần tải file minh chứng lên")
            }
        });
        edu.system.uploadFiles(["txtFileDinhKem", "txtFileDinhKemDS"]);
        edu.system.getList_MauImport("zonebtnBaoCao_CongNhanDiem", function (addKeyValue) {
            addKeyValue("strDiem_KeHoachCongNhan_Id", edu.util.getValById("dropSearch_KeHoach"));
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValById("dropSearch_ChuongTrinh"));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            addKeyValue("strDaoTao_HocPhan_Id", arrChecked_Id.toString());
        });

        //$("#lichsu_chitiet").modal("show")
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: Hàm chung 
    -------------------------------------------*/

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_CongNhanDiem: function () {
        var me = this;
        var obj_notify = {};
        //var aData = me.dtHocPhan.find(e => e.ID == me.strHocPhan_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgkuIhEpIC8eAiAx',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
            'strId': me.strCongNhanDiem_Id,
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiCongNhan_Id': edu.util.getValById('dropLoaiCongNhan'),
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strDiem_CoSoCongNhan_Id': edu.util.getValById('dropCoSoDaoTao'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem': edu.util.getValById('txtKetQuaCongNhan'),
            'strThongTinHocPhan_ChungChi': edu.util.getValById('txtTenHocPhan'),
            'strHeDaoTao': edu.util.getValById('txtHeDaoTao'),
            'dSoTinChi': edu.util.getValById('txtSoTinChi'),
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
                    me.getList_HocPhan();
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_DSCongNhanDiem: function (strCongNhanDiem_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtCongNhanDiem.find(e => e.ID == strCongNhanDiem_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/FSkkLB4FKCQsHg8mNC4oCS4iHgkuIhEpIC8eAiAx',
            'func': 'pkg_congthongtin_congnhandiem.Them_Diem_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
            //'strId': strCongNhanDiem_Id,
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strLoaiCongNhan_Id': edu.util.getValById('dropLoaiCongNhan' + strCongNhanDiem_Id),
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_HocPhan_Id': aData.ID,
            'strDiem_CoSoCongNhan_Id': edu.util.getValById('dropCoSoDaoTao' + strCongNhanDiem_Id),
            'strGhiChu': edu.util.getValById('txtGhiChu' + strCongNhanDiem_Id),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan' + strCongNhanDiem_Id),
            'strNgayCap': edu.util.getValById('txtNgayCap' + strCongNhanDiem_Id),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem': edu.util.getValById('txtKetQuaCongNhan' + strCongNhanDiem_Id),
            'strThongTinHocPhan_ChungChi': edu.util.getValById('txtTenHocPhan' + strCongNhanDiem_Id),
            'strHeDaoTao': edu.util.getValById('txtHeDaoTao' + strCongNhanDiem_Id),
            'dSoTinChi': edu.util.getValById('txtSoTinChi' + strCongNhanDiem_Id),
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
                    me.getList_HocPhan();
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
                    //me.toggle_form();
                    //me.getList_HocPhan();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CongNhanDiem: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'SV_CongNhanDiem_MH/GS4gHgUoJCweDyY0LigJLiIeCS4iESkgLx4CIDEP',
            'func': 'pkg_congthongtin_congnhandiem.Xoa_Diem_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
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
                    $("#lichsu_chitiet").modal("hide");
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_HocPhan();
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
            //    edu.system.start_Progress("zoneprocessCheDoChinhSach", function () {
            //        me.getList_CheDoChinhSach();
            //    });
            //},
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CongNhanDiem: function (strDaoTao_HocPhan_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIFIC8mCjgCLi8mDykgLwPP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSDangKyCongNhan',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.dtCongNhanDiem = dtResult;
                    me.genTable_CongNhanDiem(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getDetail_CongNhanDiem: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        //var aData = me.dtHocPhan.find(e => e.ID == me.strHocPhan_Id);
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4FRUFKCQsHg8mNC4oCS4iHgkuIhEpIC8eAiAx',
            'func': 'pkg_congthongtin_congnhandiem.LayTTDiem_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
            'strDiem_KeHoachCongNhan_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strDaoTao_HocPhan_Id': me.strHocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.dtCongNhanDiem = dtResult;
                    me.viewForm_CongNhanDiem(dtResult[0]);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    genTable_CongNhanDiem: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCongNhanDiem",

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    mRender: function (nRow, aData) {
                        return '<div class="input-group no-icon"><select id="dropLoaiCongNhan' + aData.ID + '" class="select-opt dropLoaiCongNhan"></select ><div>';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<div class="input-group no-icon"><select id="dropCoSoDaoTao' + aData.ID + '" class="select-opt"></select ></div>';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtNgayCap' + aData.ID + '" class="form-control input-datepicker" style="padding-left: 10px" placeholder="dd/mm/yyyy"/>';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtNgayHetHan' + aData.ID + '" class="form-control input-datepicker" style="padding-left: 10px" placeholder="dd/mm/yyyy"/>';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtKetQuaCongNhan' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtTenHocPhan' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtSoTinChi' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtHeDaoTao' + aData.ID + '" class="form-control" style="padding-left: 10px" />';
                    }
                },
                {
                    mRender: function (nRow, aData) {
                        return '<input type="text" id="txtGhiChu' + aData.ID + '" class="form-control"  style="padding-left: 10px"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => {
            //me.genComBo_CoSoTable("dropCoSoDaoTao" + e.ID);
            me.genComBo_LoaiCongNhan("dropLoaiCongNhan" + e.ID);
        })
        $('.dropLoaiCongNhan').on('select2:select', function () {
            var strId = this.id.replace("dropLoaiCongNhan", "");
            me.getList_CoSoTable(strId);
        })
        edu.system.pickerdate();
        //edu.system.move_ThroughInTable(jsonForm.strTable_Id);
    },

    getList_HocPhan: function (strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRICKTQuLyYVMygvKQkuIgPP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSChuongTrinhHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = data.Data;
                    me.dtHocPhan = dtResult;
                    me.genTable_HocPhan(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_HocPhan: function (data) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhan",

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "KETQUA",
                    //mRender: function (nRow, aData) {
                    //    return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO)
                    //}
                },
                {
                    "mDataProp": "KETQUAMOI"
                },
                {
                    //"mDataProp": "KETQUA",
                    mRender: function (nRow, aData) {
                        var tinhTrangTen = edu.util.returnEmpty(aData.TINHTRANG_TEN);
                        var isHetHieuLuc = tinhTrangTen === "Hết hiệu lực";
                        var isDaDangKy = !!aData.DADANGKYCONGNHAN && !isHetHieuLuc;

                        var html = '';
                        html += '<div class="form-check mb-0 min-h-auto pointer">';
                        html += isDaDangKy ? "" : '<input class="form-check-input" type="checkbox" value="" id="checkX' + aData.DAOTAO_HOCPHAN_ID + '">';
                        html += '<a id="' + aData.DAOTAO_HOCPHAN_ID + '" class="btnEdit form-check-label fw-normal" for="chk' + aData.DAOTAO_HOCPHAN_ID + '">';
                        html += isDaDangKy ? '<span style="color: green">Đã đăng ký</span>' : "Đăng ký";
                        html += '</a>';
                        html += '</div>';
                        return html;
                        //return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO)
                    }
                }, 
                {
                    mRender: function (nRow, aData) {
                        var tinhTrangTen = edu.util.returnEmpty(aData.TINHTRANG_TEN);
                        return tinhTrangTen === "Hết hiệu lực" ? "" : tinhTrangTen;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    viewForm_CongNhanDiem: function (data) {
        var me = this;
        //call popup --Edit
        if (data) {

            //edu.util.viewValById("dropCoSoDaoTao", data.DIEM_COSODAOTAOCONGNHANDIEM_ID);
            //edu.util.viewValById("dropLoaiCongNhan", data.LOAICONGNHAN_ID);
            edu.util.viewValById("dropLoaiChungChi", data.LOAICC_BANGDIEM_ID);
            edu.util.viewValById("txtKetQuaCongNhan", data.DIEM);
            edu.util.viewValById("txtNgayCap", data.NGAYCAP);
            edu.util.viewValById("txtNgayHetHan", data.NGAYHETHAN);
            edu.util.viewValById("txtGhiChu", data.GHICHU);
            edu.util.viewValById("txtHeDaoTao", data.HEDAOTAO);
            edu.util.viewValById("txtSoTinChi", data.SOTINCHI);
            edu.util.viewValById("txtTenHocPhan", data.THONGTINHOCPHAN_CHUNGCHI);
            me.strCongNhanDiem_Id = data.ID;
            me["strPhanLoai_Id"] = data.LOAICONGNHAN_ID;
            me.getList_PhanLoai2();
            me.getList_CoSoTable("", data.DIEM_COSODAOTAOCONGNHANDIEM_ID);
        }
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRIKJAkuICIpAi4vJg8pIC8P',
            'func': 'pkg_congthongtin_congnhandiem.LayDSKeHoachCongNhan',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

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
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne:true,
            },
            renderPlace: ["dropSearch_KeHoach"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_KeHoach", data[0].ID);
        //}
    },

    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'pkg_dangkyhoc_chung.LayDSChuongTrinh',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strNguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genComBo_ChuongTrinh(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_ChuongTrinh: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_TOCHUCCHUONGTRINH_TEN",
                code: "TONGSOTINCHIQUYDINH",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            type: "",
            title: "Chọn chương trình",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_CoSo: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4BRIFKCQsHgIuEi4CLi8mDykgLwUoJCwP',
            'func': 'pkg_diem_thongtin.LayDSDiem_CoSoCongNhanDiem',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };



        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtCoSo = dtResult;
                    me.genComBo_CoSo(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_CoSo: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                avatar: "",
            },
            renderPlace: ["dropCoSoDaoTao"],
            type: "",
            title: "Chọn cơ sở",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CoSoTable: function (strId, default_val) {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRICLhIuBSAuFSAuFSkkLg0uICgP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSCoSoDaoTaoTheoLoai',
            'iM': edu.system.iM,
            'strLoaiCongNhan_Id': edu.util.getValById('dropLoaiCongNhan' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };



        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genComBo_CoSoTable(dtResult, "dropCoSoDaoTao" + strId, default_val);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_CoSoTable: function (data, strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                avatar: "",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            type: "",
            title: "Chọn cơ sở",
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    genComBo_LoaiCongNhan: function (strDrop_Id) {
        var me = this;
        var obj = {
            data: me.dtLoaiCongNhan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                avatar: "",
            },
            renderPlace: [strDrop_Id],
            type: "",
            title: "Chọn loại",
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    
    getList_LoaiChungChi: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRINLiAoAgIeAyAvJgUoJCwP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSLoaiCC_BangDiem',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_LoaiChungChi(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LoaiChungChi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                //selectOne: true,
            },
            renderPlace: ["dropSearch_LoaiChungChi", "dropLoaiChungChi"],
            title: "Chọn loại chứng chỉ"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_KeHoach", data[0].ID);
        //}
    },

    getList_PhanLoai: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRINLiAoAgIeAwUVKSQuESkgLw0uICgP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSLoaiCC_BDTheoPhanLoai',
            'iM': edu.system.iM,
            'strLoaiCC_BD_Id': edu.util.getValById('dropSearch_LoaiChungChi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.dtLoaiCongNhan = dtResult;
                    me.getList_CongNhanDiem(me.strDsHocPhan_Id);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    

    getList_PhanLoai2: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_CongNhanDiem_MH/DSA4BRINLiAoAgIeAwUVKSQuESkgLw0uICgP',
            'func': 'pkg_congthongtin_congnhandiem.LayDSLoaiCC_BDTheoPhanLoai',
            'iM': edu.system.iM,
            'strLoaiCC_BD_Id': edu.util.getValById('dropLoaiChungChi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    
                    me.genComBo_PhanLoai2(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,
            async: false,
            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_PhanLoai2: function (dtResult) {
        var me = this;
        var obj = {
            data: dtResult,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                avatar: "",
                default_val: me.strPhanLoai_Id,
            },
            renderPlace: ["dropLoaiCongNhan"],
            type: "",
            title: "Chọn loại",
        };
        edu.system.loadToCombo_data(obj);
    },

}