/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function TieuChiXepLoaiApDung() { };
TieuChiXepLoaiApDung.prototype = {
    strTieuChiXepLoaiApDung_Id: '',
    dtTieuChiXepLoaiApDung: [],
    dtDMTieuChiXepLoaiApDung: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_TieuChiXepLoaiApDung();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_NamNhapHoc();
        me.getList_ThoiGianDaoTao();
        me.getList_TieuChi();
        me.getList_DMTieuChi();

        edu.system.loadToCombo_DanhMucDuLieu("DRL.DOITUONGAPDUNG", "dropSearch_DoiTuong,dropDoiTuongApDung");
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.HINHTHUCKYLUAT", "dropKyLuatCaoNhat");
        edu.system.loadToCombo_DanhMucDuLieu("DRL.XEPLOAI", "dropXepLoai");
        $("#tblTieuChiXepLoaiApDung").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.strTieuChiXepLoaiApDung_Id = strId;
                var data = edu.util.objGetDataInData(strId, me.dtTieuChiXepLoaiApDung, "ID")[0];
                me.viewForm_TieuChiXepLoaiApDung(data);
                edu.util.viewValById("dropDMTieuChuanChung", data.PHANCAPAPDUNG_ID);
                edu.system.hiddenElement('{"readonlyselect2": "#dropDoiTuongApDung,#dropNamHoc,#dropThoiGianDaoTao,#dropHeDaoTao,#dropKhoaDaoTao,#dropXepLoai"}');
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_TieuChi").click(function () {
            me.save_TieuChiXepLoaiApDung();
        });
        $("#btnDelete_TieuChi").click(function () {
            $('#myModal').modal('hide');
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_TieuChiXepLoaiApDung(me.strTieuChiXepLoaiApDung_Id);
            });
        });
        $("#btnXoaXepLoai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTieuChiXepLoaiApDung", "checkHS");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_TieuChiXepLoaiApDung(arrChecked_Id[i]);
                }
            });
            setTimeout(function () {
                me.getList_TieuChiXepLoaiApDung();
            }, arrChecked_Id.length * 50);
        });

        $("#btnSearch").click(function () {
            me.getList_TieuChiXepLoai();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_TieuChiXepLoai();
            }
        });
        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTieuChiXepLoaiApDung" });
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
        });
        $("#dropDMTieuChuanChung").on("select2:select", function () {
            var strId = this.value;
            if (edu.util.checkValue(strId)) {
                me.viewForm_TieuChiXepLoaiApDung(edu.util.objGetDataInData(strId, me.dtDMTieuChiXepLoaiApDung, "ID")[0]);
            } else {
                //me.resetPopup();
            }
        });

        $("#btnKeThua").click(function () {
            if (!edu.util.checkValue(edu.util.getValById('dropSearch_KhoaDaoTao'))) {
                edu.system.alert("Bạn cần chọn khóa");
                return;
            }
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc")) && !edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao"))) {
                edu.system.alert("Bạn cần chọn năm học hoặc thời gian đào tạo");
                return;
            }
            var html = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc"))) {
                html = "năm học" + $("#dropSearch_NamHoc option:selected").text();
            }
            else {
                html = "học kỳ" + $("#dropSearch_ThoiGianDaoTao option:selected").text();
            }
            edu.system.confirm("Bạn có muốn kế thừa từ khóa: " + $("#dropSearch_KhoaDaoTao option:selected").text() + " và " + html);
            $("#btnYes").click(function (e) {
                me.keThua_TieuChiXepLoaiApDung();
            });
        });
        $("#btnXoaToanBo").click(function () {
            if (!edu.util.checkValue(edu.util.getValById('dropSearch_KhoaDaoTao'))) {
                edu.system.alert("Bạn cần chọn khóa");
                return;
            }
            if (!edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc")) && !edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao"))) {
                edu.system.alert("Bạn cần chọn năm học hoặc thời gian đào tạo");
                return;
            }
            var html = "";
            if (edu.util.checkValue(edu.util.getValById("dropSearch_NamHoc"))) {
                html = "năm học" + $("#dropSearch_NamHoc option:selected").text();
            }
            else {
                html = "học kỳ" + $("#dropSearch_ThoiGianDaoTao option:selected").text();
            }
            edu.system.confirm("Bạn có muốn xóa toàn bộ tiêu chí của khóa: " + $("#dropSearch_KhoaDaoTao option:selected").text() + " và " + html);
            $("#btnYes").click(function (e) {
                me.delete_TieuChiXepLoaiApDung_ToanBo();
            });
        });
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        var strUnhide = "#dropDoiTuongApDung,#dropNamHoc,#dropThoiGianDaoTao,#dropHeDaoTao,#dropKhoaDaoTao,#dropXepLoai";
        $(strUnhide).attr("disabled", false); 
        me.strTieuChiXepLoaiApDung_Id = "";
        edu.util.viewValById("txtMucCaoNhat", "");
        edu.util.viewValById("txtMucThapNhat", "");
        edu.util.viewValById("dropXepLoai", "");
        edu.util.viewValById("txtMucDiem", "");
        edu.util.viewValById("dropDoiTuongApDung", edu.util.getValById('dropSeacrch_DoiTuong'));
        edu.util.viewValById("txtDiemQuyDoi", "");
        edu.util.viewValById("dropTieuChi", edu.util.getValById('dropSearch_TieuChi'));
        edu.util.viewValById("txtGhiChu", "");
        edu.util.viewValById("dropKyLuatCaoNhat", "");
        edu.util.viewValById("dropHeDaoTao", edu.util.getValById('dropSearch_HeDaoTao'));
        edu.util.viewValById("dropKhoaDaoTao", edu.util.getValById('dropSearch_KhoaDaoTao'));
        edu.util.viewValById("dropNamHoc", edu.util.getValById('dropSearch_NamHoc'));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById('dropSearch_ThoiGianDaoTao'));
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_TieuChiXepLoaiApDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TieuChuanXepLoai_AD/ThemMoi',

            'strId': me.strTieuChiXepLoaiApDung_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhamViApDung_Id': edu.util.getValById('dropKhoaDaoTao'),
            'strPhanCapApDung_Id': edu.util.getValById('dropDMTieuChuanChung'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropThoiGianDaoTao")) ? edu.util.getValById('dropThoiGianDaoTao') : edu.util.getValById('dropNamHoc'),
            'strMucKyLuatCaoNhat_Id': edu.util.getValById('dropKyLuatCaoNhat'),
            'dDiemCanTren': edu.util.getValById('txtMucCaoNhat'),
            'dDiemCanDuoi': edu.util.getValById('txtMucThapNhat'),
            'strXepLoai_Id': edu.util.getValById('dropXepLoai'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'dDiemQuyDoi': edu.util.getValById('txtDiemQuyDoi'),
            'strDRL_TieuChiDanhGia_Id': edu.util.getValById('dropTieuChi'),
            'strGhiChu': edu.util.getValById('txtGhiChu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'RL_TieuChuanXepLoai_AD/CapNhat';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (edu.util.checkValue(data.Id)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        };
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_TieuChiXepLoaiApDung();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_TieuChiXepLoaiApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChuanXepLoai_AD/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TieuChiXepLoai(dtReRult, data.Pager);
                    me.dtTieuChiXepLoaiApDung = dtReRult;
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
    delete_TieuChiXepLoaiApDung: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TieuChuanXepLoai_AD/Xoa',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_TieuChiXepLoaiApDung();
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

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    keThua_TieuChiXepLoaiApDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'RL_TieuChuanXepLoai_AD/KeThua',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công");
                    me.getList_TieuChiXepLoaiApDung();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_TieuChiXepLoaiApDung_ToanBo: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'RL_TieuChuanXepLoai_AD/Xoa_DRL_TieuChuanXepLoai_AD_PV',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDoiTuongApDung_Id': edu.util.getValById('dropDoiTuongApDung'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
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
                    me.getList_TieuChiXepLoaiApDung();
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
    genTable_TieuChiXepLoai: function (data, iPager) {
        $("#lblTieuChiXepLoaiApDung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTieuChiXepLoaiApDung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.TieuChiXepLoaiApDung.getList_TieuChiXepLoaiApDung()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 6, 7],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DIEMCANDUOI"
                },
                {
                    "mDataProp": "DIEMCANTREN"
                },
                {
                    "mDataProp": "MUCKYLUATCAONHAT_TEN",
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkHS' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_TieuChiXepLoaiApDung: function (data) {
        var me = this;
        //call popup --Edit
        me.popup();
        edu.util.viewValById("txtMucCaoNhat", data.DIEMCANTREN);
        edu.util.viewValById("txtMucThapNhat", data.DIEMCANDUOI);
        edu.util.viewValById("dropXepLoai", data.XEPLOAI_ID);
        edu.util.viewValById("txtMucDiem", data.DIEMQUYDOI);
        edu.util.viewValById("dropDoiTuongApDung", data.DOITUONGAPDUNG_ID);
        edu.util.viewValById("txtDiemQuyDoi", data.DIEMQUYDOI);
        edu.util.viewValById("dropTieuChi", data.DRL_TIEUCHIDANHGIA_ID);
        edu.util.viewValById("txtGhiChu", data.GHICHU);
        edu.util.viewValById("dropKyLuatCaoNhat", data.MUCKYLUATCAONHAT_ID);
        edu.util.viewValById("dropHeDaoTao", "");
        edu.util.viewValById("dropKhoaDaoTao", data.PHAMVIAPDUNG_ID);
        edu.util.viewValById("dropNamHoc", data.DAOTAO_THOIGIANDAOTAO_NAM_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_KY_ID);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_TieuChi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChiDanhGia/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDRL_TieuChiDanhGia_Cha_id': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'strNhomTieuChi_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_TieuChi(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genCombo_TieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_TieuChi", "dropTieuChi"],
            title: "Chọn danh mục tiêu chí"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_DMTieuChi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'RL_TieuChuanXepLoai_AD/LayDSTieuChuanXepLoaiChuaDung',
            'strDoiTuongApDung_Id': edu.util.getValById('dropSearch_DoiTuong'),
            'strPhamViApDung_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.checkValue(edu.util.getValById("dropSearch_ThoiGianDaoTao")) ? edu.util.getValById('dropSearch_ThoiGianDaoTao') : edu.util.getValById('dropSearch_NamHoc'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDMTieuChiXepLoaiApDung = dtReRult;
                    me.genCombo_LoaiTieuChi(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genCombo_LoaiTieuChi: function (data) {
        var me = this;

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DRL_TIEUCHIDANHGIA_TEN",
            },
            renderPlace: ["dropDMTieuChuanChung"],
            title: "Chọn danh mục tiêu chuẩn chung"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValById("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValById("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValById("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValById("dropChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'CM_ThoiGianDaoTao/LayDSDAOTAO_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
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
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao", "dropKhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
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
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropPhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc"],
            type: "",
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },
}