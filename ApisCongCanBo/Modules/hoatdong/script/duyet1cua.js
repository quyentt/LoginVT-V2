/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function Duyet1Cua() { };
Duyet1Cua.prototype = {
    strDuyet1Cua_Id: '',
    strYeuCau_Id: '',
    dtDuyet1Cua: [],
    strSinhVien_Id: '',
    strChuongTrinh_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // tháng bắt đầu từ 0
        const year = now.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        edu.util.viewValById("txtSearch_TuNgay", formattedDate)
        edu.util.viewValById("txtSearch_DenNgay", formattedDate)
        me.getList_Duyet1Cua();
        me.getList_YeuCau();
        //me.getList_DoiTac();
        //me.getList_KhoanThu();
        //me.getList_ThoiGianDaoTao();
        //edu.system.loadToCombo_DanhMucDuLieu("QLTC.HTTHU", "dropSearch_HinhThuc,dropHinhThuc");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblDuyet1Cua").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strYeuCau_Id = strId;
            var aData = me.dtDuyet1Cua.find(e => e.ID == strId)
            me.strSinhVien_Id = aData.QLSV_NGUOIHOC_ID;
            me.strChuongTrinh_Id = aData.DAOTAO_CHUONGTRINH_ID;
            me.getList_TinhTrang();
            me.getList_CanBo();
            $("#modalXuLy").modal("show");
            $(".lblGiayXacNhan").html(aData.YEUCAU_TEN);
            me.getList_CauTruc();
            //if (edu.util.checkValue(strId)) {
            //    me.viewForm_Duyet1Cua(strId);
            //}
            //else {
            //    edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            //}
        });
        //$(".btnAdd").click(function () {
        //    me.popup();
        //    me.resetPopup();
        //});
        //$("#btnSave_Duyet1Cua").click(function () {
        //    me.save_Duyet1Cua();
        //});
        //$("#btnXoaDuyet1Cua").click(function () {
        //    var arrChecked_Id = edu.util.getArrCheckedIds("tblDuyet1Cua", "checkX");
        //    if (arrChecked_Id.length == 0) {
        //        edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
        //        return;
        //    }
        //    edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
        //    $("#btnYes").click(function (e) {
        //        edu.system.alert('<div id="zoneprocessXXXX"></div>');
        //        edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
        //        for (var i = 0; i < arrChecked_Id.length; i++) {
        //            me.delete_Duyet1Cua(arrChecked_Id[i]);
        //        }
        //    });
        //});

        $(".btnSeach").click(function () {
            var strLoai = $(this).attr("name");
            console.log(strLoai);
            me["strLoai"] = strLoai;
            console.log(me["strLoai"]);
            me.getList_Duyet1Cua();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_Duyet1Cua();
            }
        });

        $("#btnXuLy").click(function () {
            me.save_TinhTrang();
        });
        $("#btnChuyenXuLy").click(function () {
            me.save_ChuyenCanBo();
        });

        $("#dropTinhTrang").on("select2:select", function () {
            me.getList_CanBo();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_Duyet1Cua", function (addKeyValue) {
            addKeyValue("strYeuCau_Id", edu.util.getValById("dropSearch_LoaiYeuCau"));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuyet1Cua", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strDVMC_YeuCau_Nhan_Id",e))
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strDuyet1Cua_Id = "";
        edu.util.viewValById("dropKhoanThu", edu.util.getValById("dropSearch_KhoanThu"));
        edu.util.viewValById("dropDoiTac", edu.util.getValById("dropSearch_DoiTac"));
        edu.util.viewValById("dropHinhThuc", edu.util.getValById("dropSearch_HinhThuc"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtTKNo", "");
        edu.util.viewValById("txtTKCo", "");
    },

    getList_YeuCau: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_TiepNhan_XuLy_MH/DSA4BRINLiAoGCQ0AiA0',
            'func': 'pkg_dvmc_tiepnhan_xuly.LayDSLoaiYeuCau',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_YeuCau(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_YeuCau: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_LoaiYeuCau"],
            title: "Chọn loại yêu cầu"
        };
        edu.system.loadToCombo_data(obj);
    },


    save_TinhTrang: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_TiepNhan_XuLy_MH/FSkkLB4FFwwCHhgkNAIgNB4VKCQxDykgLx4ZNA04',
            'func': 'pkg_dvmc_tiepnhan_xuly.Them_DVMC_YeuCau_TiepNhan_XuLy',
            'iM': edu.system.iM,
            'strDVMC_YeuCau_Nhan_Id': me.strYeuCau_Id,
            'strTinhTrangXuLy_Id': edu.util.getValById('dropTinhTrang'),
            'strNguoiXuLy_Id': edu.system.userId,
            'strNguoiDuocChuyen_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
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
                        $("#modalXuLy").modal("hide");
                        me.getList_Duyet1Cua();
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    $("#modalXuLy").modal("hide");
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
    getList_TinhTrang: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRIVKC8pFTMgLyYZNA04',
            'func': 'pkg_dvmc_chung.LayDSTinhTrangXuLy',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strYeuCau_Id': me.strYeuCau_Id,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_TinhTrang(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_TinhTrang: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropTinhTrang"],
            title: "Chọn tình trạng"
        };
        edu.system.loadToCombo_data(obj);
    },

    save_ChuyenCanBo: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_TiepNhan_XuLy_MH/FSkkLB4FFwwCHhgkNAIgNB4VKCQxDykgLx4ZNA04',
            'func': 'pkg_dvmc_tiepnhan_xuly.Them_DVMC_YeuCau_TiepNhan_XuLy',
            'iM': edu.system.iM,
            'strDVMC_YeuCau_Nhan_Id': me.strYeuCau_Id,
            'strTinhTrangXuLy_Id': edu.util.getValById('dropTinhTrang'),
            'strNguoiXuLy_Id': edu.system.userId,
            'strNguoiDuocChuyen_Id': edu.util.getValById('dropCanBoChuyen'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
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
                        $("#modalXuLy").modal("hide");
                        me.getList_Duyet1Cua();
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CanBo: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRIPJjQuKAU0LyYRKSAvAi4vJhgC',
            'func': 'pkg_dvmc_chung.LayDSNguoiDungPhanCongYC',
            'iM': edu.system.iM,
            'strTinhTrangXuLy_Id': edu.util.getValById('dropTinhTrang'),
            'strYeuCau_Id': me.strYeuCau_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_CanBo(data);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_CanBo: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropCanBoChuyen"],
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_Duyet1Cua: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/FSkkLB4AEQgeCiQVLiAvHgopLiAvHgkV',
            'func': 'pkg_taichinh_ketoan.Them_API_KeToan_Khoan_HT',
            'iM': edu.system.iM,
            'strId': me.strDuyet1Cua_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropKhoanThu'),
            'strHinhThucThu_Id': edu.util.getValById('dropHinhThuc'),
            'strKeToan_TKNo': edu.util.getValById('txtTKNo'),
            'strKeToan_TKCo': edu.util.getValById('txtTKCo'),
            'strAPI_DoiTac_Id': edu.util.getValById('dropDoiTac'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
            obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
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
                    me.getList_Duyet1Cua();
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
    getList_Duyet1Cua: function () {
        var me = this;
        console.log(me["strLoai"]);
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_TiepNhan_XuLy_MH/DSA4BRIFFwwCHhgkNAIgNB4PKSAvHhk0DTgP',
            'func': 'pkg_dvmc_tiepnhan_xuly.LayDSDVMC_YeuCau_Nhan_XuLy',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strPhanLoai': me["strLoai"],
            'strTuNgay': edu.system.getValById('txtSearch_TuNgay'),
            'strDenNgay': edu.system.getValById('txtSearch_DenNgay'),
            'strYeuCau_Id': edu.util.getValById('dropSearch_LoaiYeuCau'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDuyet1Cua = dtReRult;
                    me.genTable_Duyet1Cua(dtReRult, data.Pager);
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
    delete_Duyet1Cua: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeToan_MH/GS4gHgARCB4KJBUuIC8eCikuIC8eCRUP',
            'func': 'pkg_taichinh_ketoan.Xoa_API_KeToan_Khoan_HT',
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
                }
                else {
                    obj = {
                        title: "",
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_Duyet1Cua();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_Duyet1Cua: function (data, iPager) {
        $("#lblDuyet1Cua_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuyet1Cua",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.Duyet1Cua.getList_Duyet1Cua()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3, 7, 8],
                //right: [5]
            },
            aoColumns: [
                //{
                //    "mRender": function (nRow, aData) {
                //        return edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + " - " + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_MA);
                //    }
                //},
                //{
                //    "mRender": function (nRow, aData) {
                //        return edu.util.returnEmpty(aData.HINHTHUCTHU_TEN) + " - " + edu.util.returnEmpty(aData.HINHTHUCTHU_MA);
                //    }
                //},
                {
                    "mDataProp": "YEUCAU_TEN"
                },
                {
                    "mDataProp": "MAYEUCAU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NGUOIXULY_TENDAYDU) + "(" + edu.util.returnEmpty(aData.NGUOIXULY_TAIKHOAN) + ")";
                    }
                },
                {
                    "mDataProp": "TINHTRANGXULY_TEN"
                },
                {
                    "mDataProp": "NGAYXULY_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "PHI"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " - " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "YKIENKHAC"
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
    viewForm_Duyet1Cua: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtDuyet1Cua.find(e => e.ID == strId);
        me.popup();
        //view data --Edit
        //edu.util.viewHTMLById("lblKhoaDaoTao_Add", data.DAOTAO_KHOADAOTAO_MAKHOA);
        //edu.util.viewHTMLById("lblChuongTrinh_Add", edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA));

        edu.util.viewValById("dropKhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropDoiTac", data.API_DOITAC_ID);
        edu.util.viewValById("dropHinhThuc", data.HINHTHUCTHU_ID);
        edu.util.viewValById("txtTKNo", data.KETOAN_Duyet1Cua);
        edu.util.viewValById("txtTKCo", data.KETOAN_TAIKHOANCO);
        me.strDuyet1Cua_Id = data.ID;
    },

    getList_CauTruc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRICIDQVMzQiHhgkNAIgNAPP',
            'func': 'pkg_dvmc_chung.LayDSCauTruc_YeuCau',
            'iM': edu.system.iM,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genTable_CauTruc(data.rsCauTrucYeuCau);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_CauTruc: function (data) {
        var me = this;
        var html = '';
        var arrInput = [];
        data.forEach(aData => {
            if (aData.NOIDUNG && aData.NOIDUNG.indexOf('<div') == 0) {
                html += aData.NOIDUNG;
            } else {
                html += '<div style="width: 100%"><div class="live-doc-input">' + aData.NOIDUNG + '</div></div>';
            }
            let arrIndex = getAllIndexes(aData.NOIDUNG, '@');
            for (let i = 0; i < arrIndex.length; i += 2) {
                arrInput.push(aData.NOIDUNG.substring(arrIndex[i], arrIndex[i + 1] + 1));
            }
        });
        arrInput.forEach(aData => {
            let arrTemp = aData.replace(/@/g, '').split('-');
            let htmlreplace = '';
            let strBatBuoc = arrTemp[3];
            let strKichThuoc = arrTemp[6];
            let strDoRong = aData.KICHTHUOC;
            let strStyle = "";
            console.log(arrTemp);
            if (strBatBuoc == "1") strBatBuoc = '<span style="color: red;font-size: 13px">(*)</span>';
            if (strKichThuoc) strKichThuoc = 'width: ' + strKichThuoc + 'px;';
            if (strDoRong) strKichThuoc = 'margin: bottom: ' + strDoRong + 'px;';
            strStyle = strKichThuoc + strDoRong;

            switch (arrTemp[1]) {
                case 'TEXT': htmlreplace = '&nbsp;' + strBatBuoc + '<input class="form-control" id="txt' + arrTemp[0] + '" style="' + strStyle + '" />'; break;
                case 'LIST': htmlreplace = '&nbsp;' + strBatBuoc + '<div style="' + strStyle + '"><select class="form-select" id="drop' + arrTemp[0] + '" aria-label="Default select example"></select><div>'; break;

            }
            html = html.replace(aData, htmlreplace);
        });
        $("#tblGiayXacNhan").html(html);
        arrInput.forEach(aData => {
            let arrTemp = aData.replace(/@/g, '').split('-');
            me.getList_KetQua(arrTemp);
            //switch (arrTemp[1]) {
            //    case 'TEXT': htmlreplace = '<input class="form-control" id="txtInput' + arrTemp[0] + '" />'; break;
            //    case 'LIST': htmlreplace = '<select class="form-select" id="drop' + arrTemp[0] + '" aria-label="Default select example"></select>'; break;

            //}
        });
        function getAllIndexes(str, char) {
            let indexes = [];
            for (let i = 0; i < str.length; i++) {
                if (str[i] === char) {
                    indexes.push(i);
                }
            }
            return indexes;
        }
    },
    getList_KetQua: function (arrTemp) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/DSA4FRUFFwwCHgIgNBUzNCIeGAIeBTQNKCQ0',
            'func': 'pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu',
            'iM': edu.system.iM,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strTruongThongTin_Id': arrTemp[0],
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDVMC_YeuCau_Nhan_Id': me.strXNYeuCau_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        switch (arrTemp[1]) {
                            case 'TEXT': $("#txt" + arrTemp[0]).val(edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI)); $("#txt" + arrTemp[0]).attr("name", edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI)); break;
                            case 'LIST': edu.system.loadToCombo_DanhMucDuLieu(arrTemp[2], "dropDanhGia" + arrTemp[0], "", "", "", "", aData.TRUONGTHONGTIN_GIATRI); $("#dropDanhGia" + arrTemp[0]).attr("name", edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI)); break;
                        }
                    })
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
}