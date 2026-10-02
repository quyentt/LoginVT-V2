/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function GiaoDeTai() { };
GiaoDeTai.prototype = {
    dtGiaoDeTai: [],
    strGiaoDeTai_Id: '',
    arrNhanSu_Id:[],
    strDeTai_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_GiaoDeTai();
        me.getList_KeHoach();
        //edu.system.loadToCombo_DanhMucDuLieu("HB.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoai");
        //me.getList_LoaiDanhHieu();

        $("#btnSearch").click(function (e) {
            me.getList_GiaoDeTai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_GiaoDeTai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        
        $("#tblGiaoDeTai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strGiaoDeTai_Id = strId;
            me.toggle_edit()
            var data = me.dtGiaoDeTai.find(e => me.strGiaoDeTai_Id == e.ID);
            $("#lblMaSo").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_MASO))
            $("#lblHoTen").html(edu.util.returnEmpty(data.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(data.QLSV_NGUOIHOC_TEN))
            $("#lblLop").html(edu.util.returnEmpty(data.DAOTAO_LOPQUANLY_TEN))
            $("#lblChuongTrinh").html(edu.util.returnEmpty(data.DAOTAO_CHUONGTRINH_TEN))
            me.getList_DeTai();
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearch_DeTai").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneGiaoDeTai");
            me.strDeTai_Id = "";
            me.arrNhanSu_Id = [];
            edu.util.viewValById("dropDeTai", "");
            $("#tblNguoiHuongDan tbody").html("");
        });
        $("#btnSave_GiaoDeTai").click(function (e) {
            me.save_DeTai();
        });
        $(".btnDelete_DeTai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDeTai", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DeTai(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearchDTSV_GiangVien").click(function () {
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    //edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                    arrChecked_Id.forEach(strSinhVien_Id => {
                        //me.save_ThanhVien(strSinhVien_Id);
                        var html = '';
                        var strKetQua_Id = edu.util.uuid().substr(2);
                        html += "<tr id='" + strKetQua_Id + "' name='" + aData.NGUOIDUNG_ID + "'>";
                        html += "<td class='td-center'>" + (i + 1) + "</td>";
                        html += "<td class='td-center'><span>" + edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN) + "</span></td>";
                        row += '<td><select id="dropVaiTro' + strKetQua_Id + '" class="select-opt"></select ></td>';
                        html += "<td class='td-center'><input type='checkbox' id='checkX" + strKetQua_Id + "'/></td>";
                        html += "</tr>";
                        $("#tblNguoiHuongDan tbody").append(html);
                        me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, "");
                    })
                }
            });
            edu.extend.getList_NhanSu("SEARCH");
        });
        $(".btnDeleteDTSV_GiangVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_GiangVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThanhVien(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtGiaoDeTai_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblGiaoDeTai").delegate('.btnDSDoiTuong', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this.id);
        });

        $("#tblGiaoDeTai").delegate('.btnDieuKien', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zoneDieuKien");
            var strId = this.id;
            me.strGiaoDeTai_Id = strId;
            me.getList_DieuKien();
        });
        $("#chkSelectAll_DieuKien").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: this.parentNode.parentNode.parentNode.parentNode.id });
        });
        $("#btnSave_DieuKien").click(function () {
            var arrThem = [];
            $(".inputxau").each(function () {
                var point = this;
                if ($(point).val() != $(point).attr("name")) {
                    console.log($(point).attr("name"))
                    arrThem.push(point.id);
                }
            });
            if (!arrThem.length) {
                edu.system.alert("Không có thay đổi để lưu");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn lưu " + arrThem.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
                arrThem.forEach(e => {
                    me.save_DieuKien(e);
                });
            });
        });
        $("#btnDelete_DieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDieuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DieuKien(arrChecked_Id[i]);
                }
            });
        });


        $("#tblGiaoDeTai").delegate('.btnKetQua', 'click', function (e) {
            $('#myModalKetQua').modal('show');
            me.getList_NhanHocBong(this.id);
        });

        edu.system.getList_MauImport("zonebtnBaoCao_KH", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strHB_QuyHocBong_Id': edu.util.getValById('dropSearch_QuyHocBong'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblGiaoDeTai", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strHocBong_Id', e));
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strGiaoDeTai_Id = "";
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
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_GiaoDeTai();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_GiaoDeTai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_Kehoach_NguoiHoc',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strBV_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtGiaoDeTai = dtReRult;
                    me.genTable_GiaoDeTai(dtReRult, data.Pager);
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_GiaoDeTai: function (data, iPager) {
        var me = this;
        $("#lblGiaoDeTai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblGiaoDeTai",

            bPaginate: {
                strFuntionName: "main_doc.GiaoDeTai.getList_GiaoDeTai()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "Daotao_Khoadaotao_Ten"
                },
                {
                    "mDataProp": "Daotao_Khoadaotao_Ten"
                },
                {
                    "mDataProp": "Daotao_Khoadaotao_Ten"
                },
                {
                    "mDataProp": "Daotao_Khoadaotao_Ten"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DeTai: function (strDanhSach_Id) {
        var me = this;
        var aData = me.dtGiaoDeTai.find(e => e.ID == strDanhSach_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai',
            'type': 'GET',
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDeTai"] = dtReRult;
                    me.genTable_DeTai(dtReRult, data.Pager);
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
    save_DeTai: function () {
        var me = this;
        var aData = me.dtGiaoDeTai.find(e => e.ID == strDanhSach_Id);
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KH_NG_GiaoDeTai',
            'type': 'POST',
            'strId': me.strDeTai_Id,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strLyDoDieuChinh': edu.util.getValById('txtLyDoDieuChinh'),
            'strBV_KeHoach_DeTai_Id': edu.util.getValById('dropDeTai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KH_NG_GiaoDeTai';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    if ($(this).attr("name") == "new") {
                    //        me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                    //    }
                    //});
                    $("#tblNguoiHuongDan tbody tr").each(function () {
                        me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    });

                    //for (var i = 0; i < me.arrKhoa.length; i++) {
                    //    me.save_Khoa(strKeHoachXuLy_Id, me.arrKhoa[i]);
                    //}
                    //for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                    //    me.save_ChuongTrinh(strKeHoachXuLy_Id, me.arrChuongTrinh[i]);
                    //}
                    //for (var i = 0; i < me.arrLop.length; i++) {
                    //    me.save_Lop(strKeHoachXuLy_Id, me.arrLop[i]);
                    //}
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
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
    delete_DeTai: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_KH_NG_GiaoDeTai',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strNhanSu_Id,
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
                    me.getList_DeTai();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_ThanhVien();
                });
            },
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
    genTable_DeTai: function (data, iPager) {
        var me = this;
        $("#lblGiaoDeTai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeTai",

            bPaginate: {
                strFuntionName: "main_doc.GiaoDeTai.getList_DeTai()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "BV_KEHOACH_DETAI_TEN"
                },
                {
                    "mDataProp": "BV_KEHOACH_DETAI_TENTA",
                },
                {
                    "mDataProp": "QLSV_QUYETDINH_SOQD"
                },
                {
                    "mDataProp": "LYDODIEUCHINH"
                },
                {
                    "mDataProp": "BV_XACNHAN_GIAODETAI_TEN"
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
    viewEdit_DeTai: function (data) {
        var me = this;
        edu.util.viewValById("dropDeTai", data.BV_KEHOACH_DETAI_ID);
        edu.util.viewValById("txtLyDoDieuChinh", data.LYDODIEUCHINH);
        me["strDeTai_Id"] = data.ID;
        $("#lblQuyetDinh").html(edu.util.returnEmpty(data.QLSV_QUYETDINH_SOQD));
        $("#lblTinhTrang").html(edu.util.returnEmpty(data.BV_XACNHAN_GIAODETAI_TEN));
        
        me.getList_ThanhVien();
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strRowID, strGiaoDeTai_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        var aData = me.dtGiaoDeTai.find(e => e.ID == me.strGiaoDeTai_Id);
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KeHoach_NH_GiaoDT_HD',
            'type': 'POST',
            'strId': strId,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strBV_Kehoach_NH_GiaoDT_Id': strGiaoDeTai_Id,
            'strVaiTro_Id': edu.util.getValById('dropVaiTro' + strRowID),
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_NH_GiaoDT_HD';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_ThanhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        var aData = me.dtGiaoDeTai.find(e => e.ID == me.strGiaoDeTai_Id);
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KH_NG_GiaoDeTai_HD',
            'type': 'GET',
            'strBV_Kehoach_NH_GiaoDT_Id': me.strDeTai_Id,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
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
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_KeHoach_NH_GiaoDT_HD',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strNhanSu_Id,
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
                    //me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_ThanhVien();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            html += "<tr id='" + strKetQua_Id + "' name='" + aData.NGUOIDUNG_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-center'><span>" + edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN) + "</span></td>";
            row += '<td><select id="dropVaiTro' + strKetQua_Id + '" class="select-opt"></select ></td>';
            html += "<td class='td-center'><input type='checkbox' id='checkX" + strKetQua_Id + "'/></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        $("#tblNguoiHuongDan tbody").html(html);
        data.forEach(aData => {
            me.genComBo_VaiTro("dropVaiTro" + aData.ID, aData.VAITRO_ID);
        })
    },

    genComBo_VaiTro: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    
    getList_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KeHoach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'dHieuLuc': -1,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KeHoach(json);
                } else {
                    edu.system.alert(data.Message);
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
    cbGenCombo_KeHoach: function (data) {
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
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
}