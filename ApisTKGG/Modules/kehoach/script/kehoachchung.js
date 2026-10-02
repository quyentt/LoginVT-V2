/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 10/12/2018
--Note: su dung bien do_table de phan biet dang thao tac (insert, delete, update) voi bang csdl nao duoi db
--Note: [strCommon_Id - lu tam cac id dang xu ly, vi du nhu chinh sua, xoa, ..]
----------------------------------------------*/
function KeHoachChung() { };
KeHoachChung.prototype = {
    strKeHoachChung_Id: '',
    dtKeHoachChung: [],
    strCongThucTinh_Id:'',
    init: function () {
        var me = this;
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropNhomLoaiTinh_PLT,dropPhamViApDung");
        me.getList_ThoiGian();
        me.getList_KeHoachChung();
        me.getList_ThoiGianChung();
        me.getList_HinhThucHoc();
        me.getList_ThoiGianDaoTao();
        $("#btnSearch").click(function (e) {
            me.getList_KeHoachChung();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachChung();
            }
        });
        $("#btnSearch_ChiTiet").click(function (e) {
            me.getList_ChiTiet();
        });
        $("#txtSearch_ChiTiet").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ChiTiet();
            }
        });
        $("#btnSearch_THHocPhan").click(function (e) {
            me.getList_THHocPhan();
        });
        $("#txtSearch_THHocPhan").keypress(function (e) {
            if (e.which === 13) {
                me.getList_THHocPhan();
            }
        });
        $("#btnSearch_THGiangVien").click(function (e) {
            me.getList_THGiangVien();
        });
        $("#txtSearch_THGiangVien").keypress(function (e) {
            if (e.which === 13) {
                me.getList_THGiangVien();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAdd_KeHoach").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachChung").click(function (e) {
            me.save_KeHoachChung();
        });
        $("[id$=chkSelectAll_KeHoachChung]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThongTin" });
        });
        $("#btnDelete_KeHoachChung").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_KeHoachChung(me.strKeHoachChung_Id);
            });
        });
        $("#tblKeHoachChung").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strKeHoachChung_Id = strId;
            edu.util.setOne_BgRow(strId, "tblKeHoachChung");
            me.getList_KeHoachChiTiet(strId)
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachChung, "ID")[0];
                me.viewEdit_KeHoachChung(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblKeHoachChung").delegate('.btnCanBo', 'click', function (e) {
            var strId = this.id;
            me.getList_CanBoGiangVien(strId);
            $("#myModalCanBo").modal("show");
        });
        $("#tblKeHoachChung").delegate('.btnNhanSu', 'click', function (e) {
            var strId = this.id;
            me.getList_NhanSuThamGia(strId);
            $("#myModalCanBo").modal("show");
        });
        $("#tblKeHoachChiTiet").delegate('.btnNhanSu', 'click', function (e) {
            var strId = this.id;
            me.getList_NhanSuChiTiet(strId);
            $("#myModalCanBo").modal("show");
        });
        $("#tblKeHoachChung").delegate('.btnChiTiet', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachChung_Id = strId;
            //me.getList_ChiTiet(strId);
            $("#myModalChiTiet").modal("show");
        });
        $("#tblKeHoachChung").delegate('.btnTHGiangVien', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachChung_Id = strId;
            //me.getList_THGiangVien(strId);
            $("#myModalTHGiangVien").modal("show");
        });
        $("#tblKeHoachChung").delegate('.btnDotTach', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachChung_Id = strId;
            me.getList_DotTach(strId);
            $("#myModalDotTach").modal("show");
        });
        $("#tblKeHoachChung").delegate('.btnTHHocPhan', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachChung_Id = strId;
            //me.getList_THHocPhan(strId);
            $("#myModalTHHocPhan").modal("show");
        });
        $("#tblKeHoachChung").delegate('.btnPhanLoaiTinh', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachChung_Id = strId;
            edu.util.toggle_overide("zone-bus", "zonePhanLoaiTinh");
            me.getList_PhanLoaiTinh();
        });
        $("#tblKeHoachChung").delegate('.btnCongThucTinh', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachChung_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneCongThucTinh");
            me.getList_CongThucTinh();
        });

        $("#dropSearch_ThoiGian").on("select2:select", function () {
            me.getList_KeHoachChung();
        });

        $("#dropNhomLoaiTinh_PLT").on("select2:select", function () {
            me.getList_CBPhanLoaiTinh();
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        
        $("#btnAdd_PhanLoaiTinh").click(function () {
            var data = {};
            edu.util.viewValById("dropHinhThucHoc_PLT", data.TENTHAMSO);
            edu.util.viewValById("dropNhomLoaiTinh_PLT", data.GIATRIMACDINH);
            edu.util.viewValById("dropPhanLoai_PLT", data.PHANLOAI);
            me["strPhanLoaiTinh_Id"] = data.ID;
            $("#myModalPhanLoaiTinh").modal("show");
        });
        $("#btnSave_PhanLoaiTinh").click(function () {
            me.save_PhanLoaiTinh();
        });
        $("#btnDelete_PhanLoaiTinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanLoaiTinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanLoaiTinh(arrChecked_Id[i]);
                }
            });
        });
        $("#btnKeThua_PhanLoaiTinh").click(function () {
            $("#myModalKeThuaPhanLoaiTinh").modal("show");
        });

        $("#btnSave_KTPhanLoai").click(function () {
            me.save_KTPhanLoaiTinh();
        });

        $("#btnAdd_CongThucTinh").click(function () {
            var data = {};
            edu.util.viewValById("dropPhamViApDung", data.PHAMVIAPDUNG_ID);
            edu.util.viewValById("dropThoiGian", data.THOIGIAN_ID);
            edu.util.viewValById("txtXauCongThuc", data.XAUCONGTHUC);
            edu.util.viewHTMLById("txtXauCongThuc", data.XAUCONGTHUC);
            edu.util.viewHTMLById("lblPhamViAP", data.PHAMVIAPDUNG_TEN);
            edu.util.viewHTMLById("lblLoaiApDung", data.PHAMVIAPDUNG_TEN);
            edu.util.viewHTMLById("lblThoiGianApDung", data.THOIGIAN);
            me.strCongThucTinh_Id = data.ID;
            $("#myModalCongThucTinh").modal("show");
        });
        $("#btnSave_CongThucTinh").click(function (e) {

            me.save_CongThucTinh();
        });
        $("#btnDelete_CongThucTinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCongThucTinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CongThucTinh(arrChecked_Id[i]);
                }
            });
        });


        $("#tblCongThucTinh").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            var data = me.dtCongThucTinh.find(e => e.ID == strId);
            edu.util.viewValById("dropPhamViApDung", data.PHAMVIAPDUNG_ID);
            edu.util.viewValById("dropThoiGian", data.THOIGIAN_ID);
            edu.util.viewValById("txtXauCongThuc", data.XAUCONGTHUC);
            edu.util.viewHTMLById("txtXauCongThuc", data.XAUCONGTHUC);
            edu.util.viewHTMLById("lblPhamViAP", data.PHAMVIAPDUNG_TEN);
            edu.util.viewHTMLById("lblLoaiApDung", data.PHAMVIAPDUNG_TEN);
            edu.util.viewHTMLById("lblThoiGianApDung", data.THOIGIAN);
            me.strCongThucTinh_Id = data.ID;
            $("#myModalCongThucTinh").modal("show");
        });
        $('#dropPhamViApDung').on('select2:select', function () {
            me.getList_LoaiApDung();
        });

        $("#tblDotTach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            var data = me.dtDotTach.find(e => e.ID == strId);
            $("#myModalAddDotTach").modal("show");
            me["strDotTach_Id"] = data.ID;
            edu.util.viewValById("txtTuNgay_DT", data.TUNGAY);
            edu.util.viewValById("txtDenNgay_DT", data.DENNGAY);
            edu.util.viewValById("dropHieuLuc_DT", data.HIEULUC);
            edu.util.viewValById("txtTen_DT", data.TEN);
            edu.util.viewValById("txtMoTa_DT", data.MOTA);
        });
        $("#btnAdd_DotTach").click(function () {
            var data = {};
            $("#myModalAddDotTach").modal("show");
            me["strDotTach_Id"] = data.ID;
            edu.util.viewValById("txtTuNgay_DT", data.TUNGAY);
            edu.util.viewValById("txtDenNgay_DT", data.DENNGAY);
            edu.util.viewValById("dropHieuLuc_DT", data.HIEULUC);
            edu.util.viewValById("txtTen_DT", data.TEN);
            edu.util.viewValById("txtMoTa_DT", data.MOTA);
        });
        $("#btnSave_DotTach").click(function () {
            me.save_DotTach();
        });
        $("#btnDelete_DotTach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDotTach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DotTach(arrChecked_Id[i]);
                }
            });
        });
        $("#tblDotTach").delegate(".btnKetQua", "click", function () {
            var strId = this.id;
            //var data = me.dtDotTach.find(e => e.ID == strId);
            me["strKetQuaDotTach_Id"] = strId;
            $("#myModalKetQuaDotTach").modal("show");
            me.getList_KetQuaDotTach(strId)
        });
        $("#btnTaoDuLieuDotTach").click(function () {
            me.save_TaoDuLieuDotTach();
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        $("#zoneKeHoachChiTiet").hide();
        //edu.util.viewValById("dropHoatDong", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropThoiGian", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("dropHieuLuc", 1);
        me.strKeHoachChung_Id = "";
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    
    getList_KeHoachChung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSKLGD_TongHopKhoiLuong',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'dHieuLuc': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachChung = dtReRult;
                    me.genTable_KeHoachChung(dtReRult, data.Pager);
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
    save_KeHoachChung: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TKGG_KeHoach/Them_KLGD_TongHopKhoiLuong',
            'type': 'POST',
            'strId': me.strKeHoachChung_Id,
            'strTen': edu.util.getValById('txtTen'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId != "") {
            obj_save.action = 'TKGG_KeHoach/Sua_KLGD_TongHopKhoiLuong';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachChung_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachChung_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachChung_Id = obj_save.strId;
                    }
                    me.toggle_form();
                    //$("#tblQuyetDinh tbody tr").each(function () {
                    //    var strKetQua_Id = this.id.replace(/rm_row/g, '');
                    //    me.save_QuyetDinh(strKetQua_Id, strKeHoachChung_Id);
                    //});
                    //for (var i = 0; i < me.dtTuNhapHoSo.length; i++) {
                    //    me.save_TuNhapHoSo(me.dtTuNhapHoSo[i], strKeHoachChung_Id);
                    //}
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachChung();
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
    delete_KeHoachChung: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TKGG_KeHoach/Xoa_KLGD_TongHopKhoiLuong',


            'strIds': strId,
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
                    me.getList_KeHoachChung();
                    me.toggle_form();
                }
                else {
                    obj = {
                        content: "NS_HoatDong_KeHoachChung/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
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
    genTable_KeHoachChung: function (data, iPager) {
        var me = this;
        $("#lblKeHoachChung_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachChung",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachChung.getList_KeHoachChung()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDotTach" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnCanBo" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNhanSu" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChiTiet" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnTHGiangVien" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnTHHocPhan" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnPhanLoaiTinh" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnCongThucTinh" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC ? "" : "Hết hiệu lực";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                //, {
                //    "mRender": function (nRow, aData) {
                //        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                //    }
                //}
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropKeHoachKT_PLT"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },
    viewEdit_KeHoachChung: function (data) {
        var me = this;
        //View - Thong tin
        $("#zoneKeHoachChiTiet").show();

        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropThoiGian", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtMoTa", data.MOTA);
        me.strKeHoachChung_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSThoiGianTongHopKL',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_ThoiGian(dtReRult, data.Pager);
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
    genCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },


    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThoiGianChung: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_ThoiGianDaoTao/LayDanhSach',


            'strDAOTAO_Nam_Id': '',
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 1000000
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genList_ThoiGianChung(dtReRult, data.Pager);
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
    genList_ThoiGianChung: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "MA",
                order: ""
            },
            renderPlace: ["dropThoiGian"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_CanBoGiangVien: function (strKLGD_TongHopKhoiLuong_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSGiangVienTongHopKL',
            'type': 'GET',
            'strKLGD_TongHopKhoiLuong_Id': strKLGD_TongHopKhoiLuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CanBo(dtReRult, data.Pager);
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
    getList_NhanSuThamGia: function (strKLGD_TongHopKhoiLuong_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSNhanSuTongHopKL',
            'type': 'GET',
            'strKLGD_TongHopKhoiLuong_Id': strKLGD_TongHopKhoiLuong_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CanBo(dtReRult, data.Pager);
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
    getList_NhanSuChiTiet: function (strKLGD_KeHoachChiTiet_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet_NS',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strKLGD_KeHoachChiTiet_Id': strKLGD_KeHoachChiTiet_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_CanBoChiTiet(dtReRult, data.Pager);
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

    genTable_CanBo: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCanBo",
            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO",
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "DONVI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    genTable_CanBoChiTiet: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCanBo",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_MASO",
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN);
                    }
                },
                {
                    "mDataProp": "DONVI_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    
    getList_KeHoachChiTiet: function (strKLGD_TongHopKhoiLuong_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TKGG_KeHoach/LayDSKLGD_KeHoachChiTiet',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strKLGD_TongHopKhoiLuong_Id': strKLGD_TongHopKhoiLuong_Id,
            'strCheDoApDung_Id': edu.util.getValById('dropAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'dHieuLuc': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KeHoachChiTiet(dtReRult, data.Pager);
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
    genTable_KeHoachChiTiet: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblKeHoachChiTiet",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "Ten",
                },
                {
                    "mDataProp": "MOTA",
                },
                {
                    "mDataProp": "PHANLOAI_TEN",
                },
                {
                    "mDataProp": "CHEDOAPDUNG_TEN",
                },
                {
                    "mDataProp": "THOIGIAN",
                },
                {
                    "mDataProp": "TUNGAY",
                },
                {
                    "mDataProp": "DENNGAY",
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN",
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY",
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnNhanSu" id="' + aData.ID + '" title="Sửa">Chi tiết</a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_ChiTiet: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_BaoCao_MH/DSA4BRIKJDUQNCACKSgVKCQ1FSkkLgoJ',
            'func': 'pkg_klgv_v2_baocao.LayDSKetQuaChiTietTheoKH',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_ChiTiet'),
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ChiTiet(dtReRult, data.Pager);
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
    genTable_ChiTiet: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblChiTiet",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TaiKhoanNo.getList_TaiKhoanNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "DONVI"
                },
                {
                    "mDataProp": "MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " - " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "GIOCHUAN"
                },
                {
                    "mDataProp": "SOLUONG"
                },
                {
                    "mDataProp": "SOGVCUNGDAY"
                },
                {
                    "mDataProp": "QUYMO"
                },
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "MALOP"
                },
                {
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "TIETBATDAU"
                },
                {
                    "mDataProp": "TIETKETTHUC"
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_THGiangVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_BaoCao_MH/DSA4BRIVCRUpJC4GKCAvJhcoJC8VKSQuCgkP',
            'func': 'pkg_klgv_v2_baocao.LayDSTHTheoGiangVienTheoKH',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_THGiangVien'),
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ThGiangVien(dtReRult, data.Pager);
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
    genTable_ThGiangVien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblTHGiangVien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TaiKhoanNo.getList_TaiKhoanNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "DONVI"
                },
                {
                    "mDataProp": "MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " - " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "TONGGIOCHUAN"
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    getList_THHocPhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_BaoCao_MH/DSA4BRIVCRUpJC4NLjEXIAYXFSkkLgoJ',
            'func': 'pkg_klgv_v2_baocao.LayDSTHTheoLopVaGVTheoKH',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_THHocPhan'),
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_THHocPhan(dtReRult, data.Pager);
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
    genTable_THHocPhan: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblTHHocPhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.TaiKhoanNo.getList_TaiKhoanNo()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "DONVI"
                },
                {
                    "mDataProp": "MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " - " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "TONGGIOCHUAN"
                },
                
                {
                    "mDataProp": "TENLOP"
                },
                {
                    "mDataProp": "MALOP"
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

    getList_HinhThucHoc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_Chung_MH/DSA4BRIJKC8pFSk0IgkuIgPP',
            'func': 'PKG_KLGV_V2_CHUNG.LayDSHinhThucHoc',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HinhThucHoc(dtReRult, data.Pager);
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
    genCombo_HinhThucHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHINHTHUCHOC",
                code: "MA",
                order: "",
                mRender: function (nRow, aData) {
                    return aData.TENHINHTHUCHOC + " - " + edu.util.returnEmpty(aData.MAHINHTHUCHOC);
                }
            },
            renderPlace: ["dropHinhThucHoc_PLT"],
            title: "Chọn hình thức học"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CBPhanLoaiTinh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_XacNhan_MH/DSA4CSAvKQUuLyYZICIPKSAvDyY0LigFNC8m',
            'func': 'PKG_KLGV_V2_XACNHAN.LayHanhDongXacNhanNguoiDung',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.system.getValById('dropNhomLoaiTinh_PLT'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var obj = {
                        data: dtReRult,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "MA",
                            order: ""
                        },
                        renderPlace: ["dropPhanLoai_PLT"],
                        title: "Chọn phân loại"
                    };
                    edu.system.loadToCombo_data(obj);
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


    save_KTPhanLoaiTinh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/CiQVKTQgHgoNBgUeCSgvKRUpNCIeESkgLw0uICgP',
            'func': 'PKG_KLGV_V2_THONGTIN.KeThua_KLGD_HinhThuc_PhanLoai',
            'iM': edu.system.iM,
            'strPhamViApDung_Nguon_Id': edu.system.getValById('dropKeHoachKT_PLT'),
            'strPhamViApDung_Dich_Id': me.strKeHoachChung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_PhanLoaiTinh();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhanLoaiTinh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgkoLykVKTQiHhEpIC8NLiAo',
            'func': 'PKG_KLGV_V2_THONGTIN.Them_KLGD_HinhThuc_PhanLoai',
            'iM': edu.system.iM,
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropHinhThucHoc_PLT'),
            'strLoaiXacNhan_Id': edu.system.getValById('dropNhomLoaiTinh_PLT'),
            'strHanhDong_Id': edu.system.getValById('dropPhanLoai_PLT'),
            'strPhamViApDung_Id': me.strKeHoachChung_Id,
            'strGhiChu': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_PhanLoaiTinh();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhanLoaiTinh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgkoLykVKTQiHhEpIC8NLiAo',
            'func': 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_HinhThuc_PhanLoai',
            'iM': edu.system.iM,
            'strPhamViApDung_Id': me.strKeHoachChung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhanLoaiTinh"] = dtReRult;
                    me.genTable_PhanLoaiTinh(dtReRult, data.Pager);
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
    delete_PhanLoaiTinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeCSgvKRUpNCIeESkgLw0uICgP',
            'func': 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_HinhThuc_PhanLoai',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanLoaiTinh();
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
    genTable_PhanLoaiTinh: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblPhanLoaiTinh",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.PhanLoaiTinh.getList_PhanLoaiTinh()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TKB_HINHTHUCHOC_MA"
                },
                {
                    "mDataProp": "HANHDONG_MA"
                },
                {
                    "mDataProp": "LOAIXACNHAN_TEN"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
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

    save_CongThucTinh: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/FSkkLB4KDQYFHgIuLyYVKTQiHgAxBTQvJgPP',
            'func': 'PKG_KLGV_V2_THONGTIN.Them_KLGD_CongThuc_ApDung',
            'iM': edu.system.iM,
            'strId': me.strCongThucTinh_Id,
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGianCT'),
            'strXauCongThuc': edu.system.getValById('txtXauCongThuc'),
            'strPhamViDung_Id': edu.system.getValById('dropLoaiApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_ThongTin_MH/EjQgHgoNBgUeAi4vJhUpNCIeADEFNC8m'; 
            obj_save.func = 'PKG_KLGV_V2_THONGTIN.Sua_KLGD_CongThuc_ApDung'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_CongThucTinh();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CongThucTinh: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4BRIKDQYFHgIuLyYVKTQiHgAxBTQvJgPP',
            'func': 'PKG_KLGV_V2_THONGTIN.LayDSKLGD_CongThuc_ApDung',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtCongThucTinh"] = dtReRult;
                    me.genTable_CongThucTinh(dtReRult, data.Pager);
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
    delete_CongThucTinh: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/GS4gHgoNBgUeAi4vJhUpNCIeADEFNC8m',
            'func': 'PKG_KLGV_V2_THONGTIN.Xoa_KLGD_CongThuc_ApDung',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_CongThucTinh();
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CongThucTinh();
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
    genTable_CongThucTinh: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblCongThucTinh",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.CongThucTinh.getList_CongThucTinh()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "XAUCONGTHUC"
                },
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
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
    cbGenCombo_ThoiGianDaoTao: function (data) {
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
            renderPlace: ["dropThoiGianCT", "dropSearch_ThoiGian"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_LoaiApDung: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_XacNhan_MH/DSA4BRINLiAoGSAiDykgLx4JIC8pBS4vJgPP',
            'func': 'pkg_klgv_v2_xacnhan.LayDSLoaiXacNhan_HanhDong',
            'iM': edu.system.iM,
            'strLoaiXacNhan_Id': edu.util.getValById('dropPhamViApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_LoaiApDung(dtReRult, data.Pager);
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
    cbGenCombo_LoaiApDung: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLoaiApDung"],
            type: "",
            title: "Chọn loại",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/

    save_TaoDuLieuDotTach: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/FSAuBTQNKCQ0HgoNBgUeFS4vJgkuMQoNHgUuNQPP',
            'func': 'PKG_KLGV_V2_KEHOACH.TaoDuLieu_KLGD_TongHopKL_Dot',
            'iM': edu.system.iM,
            'strId': me["strDotTach_Id"],
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                    //me.getList_DotTach();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_DotTach: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHhUuLyYJLjEKKS4oDTQuLyYeBS41',
            'func': 'PKG_KLGV_V2_KEHOACH.Them_KLGD_TongHopKhoiLuong_Dot',
            'iM': edu.system.iM,
            'strId': me.strDotTach_Id,
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strTuNgay': edu.system.getValById('txtTuNgay_DT'),
            'strDenNgay': edu.system.getValById('txtDenNgay_DT'),
            'strTen': edu.system.getValById('txtTen_DT'),
            'strMoTa': edu.system.getValById('txtMoTa_DT'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc_DT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'NS_KLGD_KeHoach_MH/EjQgHgoNBgUeFS4vJgkuMQopLigNNC4vJh4FLjUP';
            obj_save.func = 'PKG_KLGV_V2_KEHOACH.Sua_KLGD_TongHopKhoiLuong_Dot'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DotTach();
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DotTach: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/GS4gHgoNBgUeFS4vJgkuMQopLigNNC4vJh4FLjUP',
            'func': 'PKG_KLGV_V2_KEHOACH.Xoa_KLGD_TongHopKhoiLuong_Dot',
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
                    me.getList_DotTach();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DotTach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHhUuLyYJLjEKDR4FLjUP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKL_Dot',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strKLGD_TongHopKhoiLuong_Id': me.strKeHoachChung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDotTach"] = dtReRult;
                    me.genTable_DotTach(dtReRult, data.Pager);
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
    genTable_DotTach: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblDotTach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachChung.getList_DotTach()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TUNGAY"
                },
                {
                    "mDataProp": "DENNGAY"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '">Xem</a></span>';
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
    
    getList_KetQuaDotTach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4NBh4VBgPP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_LG_TG',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strKLGD_TongHoKL_Dot_Id': me.strKetQuaDotTach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_KetQuaDotTach(dtReRult, data.Pager);
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
    genTable_KetQuaDotTach: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblKetQuaDotTach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachChung.getList_KetQuaDotTach()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "NGUOIDUNG_MASO"
                },
                {
                    "mDataProp": "NGUOIDUNG_HODEM"
                },
                {
                    "mDataProp": "NGUOIDUNG_TEN"
                },
                {
                    "mDataProp": "DULIEUXACNHAN_TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    "mDataProp": "NGAY"
                },
                {
                    "mDataProp": "SOTIETTHEOTKB"
                },
                {
                    "mDataProp": "SOTIETCODIEMDANH"
                },
                {
                    "mDataProp": "GIOCHUAN"
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "MOTA"
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
}