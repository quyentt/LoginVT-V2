/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function HoanTotNghiep() { };
HoanTotNghiep.prototype = {
    strSinhVien_Id: '',
    dtKeHoach: [],
    strKeHoach_Id: '',
    strMinhChung_Id: '',
    showEmptyState: function (tableId, message, icon) {
        var $table = $("#" + tableId);
        if ($table.length === 0) return;
        if ($table.find("tbody tr").not(".empty-state-row").length > 0) {
            $table.find("tbody tr.empty-state-row").remove();
            return;
        }
        var colCount = $table.find("thead th").length || 1;
        var iconClass = icon || "fal fa-inbox";
        var html = ''
            + '<tr class="empty-state-row">'
            + '<td colspan="' + colCount + '" style="text-align:center; padding:36px 16px; border:none;">'
            + '<div style="display:inline-block; padding:18px 28px; background:#fafbff; border:1px dashed #d9deeb; border-radius:14px; color:#7a8499;">'
            + '<i class="' + iconClass + '" style="font-size:42px; color:#b8c0d4; display:block; margin-bottom:8px;"></i>'
            + '<div style="font-size:14px;">' + message + '</div>'
            + '</div>'
            + '</td>'
            + '</tr>';
        $table.find("tbody").html(html);
    },
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.strSinhVien_Id = edu.system.userId;
        me.getList_KeHoach();
        $("#btnSearch").click(function () {
            me.getList_KeHoach();
        });
        me.getList_ChuongTrinh();
        me.getList_LoaiChungChi();
        me.getList_ChungChiCanCongNhan();
        $("#tblKetQua").delegate('.btnXacNhan', 'click', function (e) {
            var id = this.id;
            $("#modal_XacNhan").modal("show");
            me.strKeHoach_Id = id;
        });

        $("#tblKetQua").delegate('.btnAdd', 'click', function (e) {
            var id = this.id;
            me.strKeHoach_Id = id;
            $("#modal_minhchung").modal("show");
            //var aData = me.dtHocPhan.find(e => e.DAOTAO_HOCPHAN_ID == me.strHocPhan_Id);
            //$("#lblHocPhan").html(aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN);
            edu.util.viewValById("dropChungChiCanCongNhan", "");
            edu.util.viewValById("dropCoSoDaoTao", "");
            edu.util.viewValById("dropLoaiChungChi", "");
            edu.util.viewValById("dropLoaiCongNhan", "");
            edu.util.viewValById("txtKetQuaCongNhan", "");
            edu.util.viewValById("txtNgayCap", "");
            edu.util.viewValById("txtNgayHetHan", "");
            me.strMinhChung_Id = "";
            me["strPhanLoai_Id"] = "";
            edu.system.viewFiles("txtFileDinhKem", "");
        });
        $("#tblChungChi").delegate('.btnEdit', 'click', function (e) {
            var id = this.id;
            me.strMinhChung_Id = id;
            $("#modal_minhchung").modal("show");
            var data = me.dtChungChi.find(e => e.ID == id);
            //$("#lblHocPhan").html(aData.DAOTAO_HOCPHAN_MA + " - " + aData.DAOTAO_HOCPHAN_TEN);
            edu.util.viewValById("dropLoaiChungChi", data.THONGTINHOCPHAN_CHUNGCHI_ID);
            edu.util.viewValById("dropChungChiCanCongNhan", data.PHANLOAI_ID);
            edu.util.viewValById("txtKetQuaCongNhan", data.DIEM);
            edu.util.viewValById("txtNgayCap", data.NGAYCAP);
            edu.util.viewValById("txtNgayHetHan", data.NGAYHETHAN);
            edu.util.viewValById("txtGhiChu", data.GHICHU);
            edu.util.viewValById("txtHeDaoTao", data.HEDAOTAO);
            edu.util.viewValById("txtSoTinChi", data.SOTINCHI);
            edu.util.viewValById("txtTenHocPhan", data.THONGTINHOCPHAN_CHUNGCHI);
            me["strPhanLoai_Id"] = data.LOAICONGNHAN_ID;
            me.getList_PhanLoai2();
            me.getList_CoSoTable("", data.DIEM_COSODAOTAOCONGNHANDIEM_ID);
            edu.system.viewFiles("txtFileDinhKem", "CongNhan" + me.strKeHoach_Id + me.strSinhVien_Id, "SV_Files");
        });
        $("#tblKetQua").delegate('.btnEdit', 'click', function (e) {
            var id = this.id;
            me.strKeHoach_Id = id;
            $("#modal_ketqua").modal("show");
            me.getList_ChungChi();
        });

        $("#tblKetQua").delegate('.btnTuXet', 'click', function (e) {
            var id = this.id;
            me.strKeHoach_Id = id;
            $("#modal_tuxet").modal("show");
            me.getList_TuXet();
        });
        $('#dropLoaiChungChi').on('select2:select', function () {
            me.getList_PhanLoai2();
        });;

        $('#dropLoaiCongNhan').on('select2:select', function () {
            me.getList_CoSoTable("", "");
        });;
        $('#dropSearch_ChuongTrinh').on('select2:select', function () {
            me.getList_KeHoach();
        });;

        $("#btnDongYXacNhan").click(function () {
            me.save_XacNhan();
        });
        $("#btnXetTotNghiep").click(function () {
            me.save_TuXet();
        });
        $("#btnSave_ChungChi").click(function () {
            if (edu.util.getValById("txtFileDinhKem")) {
                me.save_ChungChi();
                edu.system.saveFiles("txtFileDinhKem", "CongNhan" + me.strKeHoach_Id + me.strSinhVien_Id, "SV_Files");
            } else {
                edu.system.alert("Bạn cần tải file minh chứng lên")
            }
        });
        $("#btnDelete_ChungChi").click(function () {
            console.log(11111111);
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_ChungChi(me.strMinhChung_Id)
            });
        });
        edu.system.loadToCombo_DanhMucDuLieu("TN.KEHOACH.DANGKY.TINHTRANG", "dropLoaiXacNhan");
        edu.system.uploadFiles(["txtFileDinhKem"]);

        edu.system.getList_MauImport("zonebtnBaoCao_HoanTotNghiep", function (addKeyValue) {
            addKeyValue("strDaoTao_ChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
        });
        
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KeHoach: function () {
        var me = this;
        var obj_save = {
            'action': 'TN_DangKy_MH/DSA4BRIKJAkuICIpAiAPKSAv',
            'func': 'pkg_totnghiep_dangky.LayDSKeHoachCaNhan',
            'iM': edu.system.iM,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
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
                    me.dtKeHoach = dtResult;
                    me.genTable_KeHoach(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(" (ex): " + JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKetQua",
            aaData: data,

            colPos: {
                center: [0, 4, 3, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a id="' + aData.ID + '"  style="height: 27px; min-width: 92px;" class="btn btn-outline-dask-blue fs-14 align-items-center lh-1 btnXacNhan">Xác nhận</a> <a>' + edu.util.returnEmpty(aData.TINHTRANGDANGKY) + '</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div class="d-flex align-items-center justify-content-center">' +
                            '<a id="' + aData.ID + '" style="height: 27px; min-width: 92px;" class="btn btn-outline-dask-blue fs-14 align-items-center lh-1 btnAdd">Khai minh chứng</a>' +
                            '<a id="' + aData.ID + '" style="height: 27px; min-width: 92px;" class="btn btn-outline-secondary fs-14 align-items-center lh-1 ms-2 btnEdit">Kết quả</a>' +
                            '</div>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnTuXet" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "PHANHOI"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.showEmptyState("tblKetQua", "Hiện tại chưa có đợt xét - hoãn xét tốt nghiệp nào", "fal fa-graduation-cap");
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_XacNhan: function () {
        var me = this;
        var obj_notify = {};
        //var aData = me.dtHocPhan.find(e => e.ID == me.strHocPhan_Id);
        //--Edit
        var obj_save = {
            'action': 'TN_DangKy_MH/FSkkLB4VDx4KJAkuICIpHgUgLyYKOAPP',
            'func': 'pkg_totnghiep_dangky.Them_TN_KeHoach_DangKy',
            'iM': edu.system.iM,
            'strTN_KeHoach_Id': me.strKeHoach_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh'),
            'strTinhTrang_Id': edu.util.getValById('dropLoaiXacNhan'),
            'strMoTa': edu.util.getValById('txtNoiDungXacNhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_DangKy_MH/EjQgHhUPHgokCS4gIikeBSAvJgo4';
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
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_KeHoach();
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ChungChi: function () {
        var me = this;
        var obj_notify = {};
        //var aData = me.dtHocPhan.find(e => e.ID == me.strHocPhan_Id);
        //--Edit
        var obj_save = {
            'action': 'TN_DangKy_MH/FSkkLB4VDx4PJjQuKAkuIh4JLiIRKSAvHgIgMQPP',
            'func': 'pkg_totnghiep_dangky.Them_TN_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
            'strId': me.strMinhChung_Id,
            'strTN_KeHoach_Id': me.strKeHoach_Id,
            'strLoaiCongNhan_Id': edu.util.getValById('dropLoaiCongNhan'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strPhanLoai_Id': edu.util.getValById('dropChungChiCanCongNhan'),
            'strDiem_CoSoCongNhan_Id': edu.util.getValById('dropCoSoDaoTao'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNgayHetHan': edu.util.getValById('txtNgayHetHan'),
            'strNgayCap': edu.util.getValById('txtNgayCap'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem': edu.util.getValById('txtKetQuaCongNhan'),
            'strThongTinHocPhan_ChungChi': edu.util.getValById('dropLoaiChungChi'),
            //'strHeDaoTao': edu.util.getValById('txtAAAA'),
            //'dSoTinChi': edu.util.getValById('txtAAAA'),
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_DangKy/EjQgHhUPHg8mNC4oCS4iHgkuIhEpIC8eAiAx';
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
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    //edu.system.saveFiles("txtFileDinhKem", "HoanXet" + me.strKeHoach_Id + me.strSinhVien_Id, "SV_Files");
                    me.getList_ChungChi();
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
    delete_ChungChi: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TN_DangKy_MH/GS4gHhUPHg8mNC4oCS4iHgkuIhEpIC8eAiAx',
            'func': 'pkg_totnghiep_dangky.Xoa_TN_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
            'strId': Ids,
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
                    $("#modal_minhchung").modal("hide");
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }
                me.getList_ChungChi();
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
    getList_ChungChi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_DangKy_MH/DSA4BRIVDx4PJjQuKAkuIh4JLiIRKSAvHgIgMQPP',
            'func': 'pkg_totnghiep_dangky.LayDSTN_NguoiHoc_HocPhan_Cap',
            'iM': edu.system.iM,
            'strTN_KeHoach_Id': me.strKeHoach_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChungChi"] = dtReRult.rs;
                    me.genTable_ChungChi(dtReRult.rs);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChungChi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChungChi",
            aaData: data,
            
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DIEM_COSODAOTAOCNDIEM_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.showEmptyState("tblChungChi", "Hiện tại chưa có chứng chỉ nào", "fal fa-file-certificate");
        /*III. Callback*/
    },

    getList_ChungChiCanCongNhan: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_DangKy_MH/DSA4BRIRKSAvDS4gKAIpNC8mAiko',
            'func': 'pkg_totnghiep_dangky.LayDSPhanLoaiChungChi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChungChiCanCongNhan"] = dtReRult;
                    me.genTable_ChungChiCanCongNhan(dtReRult);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_ChungChiCanCongNhan: function (data, iPager) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                //selectOne: true,
            },
            renderPlace: ["dropChungChiCanCongNhan"],
            title: "Chọn chứng chỉ"
        };
        edu.system.loadToCombo_data(obj);
        /*III. Callback*/
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
            renderPlace: ["dropLoaiChungChi"],
            title: "Chọn loại chứng chỉ"
        };
        edu.system.loadToCombo_data(obj);
        //if (data.length > 0) {
        //    edu.util.viewValById("dropSearch_KeHoach", data[0].ID);
        //}
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


    save_TuXet: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'TN_TinhToan_MH/GSQ1BSgkNAooJC8eFQ8eAgIeBQAeAiAPKSAv',
            'func': 'pkg_totnghiep_tinhtoan.XetDieuKien_TN_CC_DA_CaNhan',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_TrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strKeHoach_Id,
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thực hiện xong!",
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
                    me.getList_TuXet();
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
    getList_TuXet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_DangKy_MH/DSA4CiQ1EDQgFSkuLyYVKC8FKCQ0CigkLxkkNQPP',
            'func': 'pkg_totnghiep_dangky.LayKetQuaThongTinDieuKienXet',
            'iM': edu.system.iM,
            'strTN_KeHoach_Id': me.strKeHoach_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me["dtChungChiCanCongNhan"] = dtReRult;
                    me.genTable_TuXet(dtReRult.rs);
                    me.genTable_TieuChi(dtReRult.rsTieuChi);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TuXet: function (data, iPager) {
        var me = this;
        if (data.length) {
            $("#lblDieuKien").html(data[0].DIEUKIEN)
            $("#lblKetQua").html(data[0].KETQUA)
        }
    },
    genTable_TieuChi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTieuChi",
            aaData: data,

            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "KETQUA"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        me.showEmptyState("tblTieuChi", "Chưa có tiêu chí xét", "fal fa-clipboard-check");
    },


    getList_ChuongTrinh: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'DKH_Chung_MH/DSA4BRICKTQuLyYVMygvKQPP',
            'func': 'pkg_dangkyhoc_chung.LayDSChuongTrinh',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
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
}
