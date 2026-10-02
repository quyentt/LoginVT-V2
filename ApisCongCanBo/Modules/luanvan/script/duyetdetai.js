/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DuyetDeTai() { };
DuyetDeTai.prototype = {
    dtDuyetDeTai: [],
    strDuyetDeTai_Id: '',
    arrNhanSu_Id:[],
    strDeTai_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_DuyetDeTai();
        me.getList_KeHoach();
        //me.getList_VaiTro();
        //me.getList_CanBo();
        edu.system.loadToCombo_DanhMucDuLieu("BV.TINHTRANG.XACNHANGIAODETAI", "dropTrangThaiXacNhan");
        //me.getList_LoaiDanhHieu();

        $("#btnSearch").click(function (e) {
            me.getList_DuyetDeTai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DuyetDeTai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        
        $("#tblDuyetDeTai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.strDuyetDeTai_Id = strId;
            //me.toggle_edit()
            $("#giaoDeTai_chitiet").modal("show");
            var data = me.dtDuyetDeTai.find(e => me.strDuyetDeTai_Id == e.ID);
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
            $("#modalDeTai").modal("show");
            me.strDeTai_Id = "";
            me.arrNhanSu_Id = [];
            edu.util.viewValById("dropDeTaiHuongDan", "");
            $("#tblNguoiHuongDan tbody").html("");
            $(".btnOpenDelete").hide();
        });
        $("#btnSave_DeTai").click(function (e) {
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
        $("#tblDeTai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me["strDeTai_Id"] = strId;
            //me.toggle_edit()
            $("#modalDeTai").modal("show");
            var aData = me.dtDeTai.find(e => strId == e.ID);
            edu.util.viewValById("dropDeTaiHuongDan", aData.BV_KEHOACH_DETAI_ID);
            edu.util.viewValById("txtLyDoDieuChinh", aData.LYDODIEUCHINH);
            edu.util.viewHTMLById("lblQuyetDinh", aData.QLSV_QUYETDINH_SOQD);
            edu.util.viewHTMLById("lblTinhTrang", aData.BV_XACNHAN_GIAODETAI_TEN);
            me.getList_ThanhVien(); 
        });
        $("#tblDeTai").delegate('.btnQuyetDinh', 'click', function (e) {
            var strId = this.id;
            me["strDeTai_Id"] = strId;
            //me.toggle_edit()
            $("#modalQuyetDinh").modal("show");
            var aData = me.dtDeTai.find(e => strId == e.ID);
            $(".lblMaSo").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
            $(".lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            $(".lblLop").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_LOP));
            $(".lblChuongTrinh").html(edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN));
            $(".lblDeTaiTiengViet").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TEN));
            $(".lblDeTaiTiengAnh").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TENTA));
            $(".lblSoQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_SOQD));
            $(".lblNgayQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_NGAYQD));
            $(".lblNoiDung").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_LYDO));
            $(".lblTinhTrang").html(edu.util.returnEmpty(aData.BV_XACNHAN_GIAODETAI_TEN));
            
            edu.util.viewValById("txtSoQuyetDinh", aData.QLSV_QUYETDINH_NGAYQD);
            edu.util.viewValById("txtNgayQuyetDinh", aData.QLSV_QUYETDINH_NGAYQD);
            edu.util.viewValById("txtNoiDung", aData.QLSV_QUYETDINH_LYDO);
            edu.util.viewHTMLById("txtNoiDung", aData.QLSV_QUYETDINH_LYDO);
        });
        $("#tblDeTai").delegate('.btnDuyet', 'click', function (e) {
            var strId = this.id;
            me["strDeTai_Id"] = strId;
            //me.toggle_edit()
            $("#modalDuyet").modal("show");
            var aData = me.dtDeTai.find(e => strId == e.ID);
            $(".lblMaSo").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO));
            $(".lblHoTen").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN));
            $(".lblLop").html(edu.util.returnEmpty(aData.QLSV_NGUOIHOC_LOP));
            $(".lblChuongTrinh").html(edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN));
            $(".lblDeTaiTiengViet").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TEN));
            $(".lblDeTaiTiengAnh").html(edu.util.returnEmpty(aData.BV_KEHOACH_DETAI_TENTA));
            $(".lblSoQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_SOQD));
            $(".lblNgayQuyetDinh").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_NGAYQD));
            $(".lblNoiDung").html(edu.util.returnEmpty(aData.QLSV_QUYETDINH_LYDO));
            $(".lblTinhTrang").html(edu.util.returnEmpty(aData.BV_XACNHAN_GIAODETAI_TEN));

        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        //$(".btnSearch_NguoiHuongDan").click(function () {
        //    edu.extend.genModal_NhanSu(arrChecked_Id => {
        //        console.log(arrChecked_Id);
        //        if (arrChecked_Id.length) {
        //            //edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
        //            arrChecked_Id.forEach(strSinhVien_Id => {
        //                //me.save_ThanhVien(strSinhVien_Id);
        //                var html = '';
        //                var strKetQua_Id = edu.util.uuid().substr(2);
        //                html += "<tr id='" + strKetQua_Id + "' name='" + aData.NGUOIDUNG_ID + "'>";
        //                html += "<td class='td-center'>" + (i + 1) + "</td>";
        //                html += "<td class='td-center'><span>" + edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN) + "</span></td>";
        //                row += '<td><select id="dropVaiTro' + strKetQua_Id + '" class="select-opt"></select ></td>';
        //                html += "<td class='td-center'><input type='checkbox' id='checkX" + strKetQua_Id + "'/></td>";
        //                html += "</tr>";
        //                $("#tblNguoiHuongDan tbody").append(html);
        //                me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, "");
        //            })
        //        }
        //    });
        //    edu.extend.getList_NhanSu("SEARCH");
        //});
        //$(".btnDelete_NguoiHuongDan").click(function () {
        //    var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_GiangVien", "checkX");
        //    if (arrChecked_Id.length == 0) {
        //        edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
        //        return;
        //    }
        //    edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
        //    $("#btnYes").click(function (e) {
        //        edu.system.alert('<div id="zoneprocessXXXX"></div>');
        //        edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
        //        for (var i = 0; i < arrChecked_Id.length; i++) {
        //            me.delete_ThanhVien(arrChecked_Id[i]);
        //        }
        //    });
        //});
        $(".btnSearch_NguoiHuongDan").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThanhVien(id, "");
        });
        $("#tblNguoiHuongDan").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblNguoiHuongDan tr[id='" + strRowId + "']").remove();
        });
        $("#tblNguoiHuongDan").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThanhVien(strId);
            });
        });;
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDuyetDeTai_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        //$("#tblDuyetDeTai").delegate('.btnDSDoiTuong', 'click', function (e) {
        //    $('#myModal').modal('show');
        //    me.getList_QuanSoTheoLop(this.id);
        //});

        $("#tblDuyetDeTai").delegate('.btnDieuKien', 'click', function (e) {
            edu.util.toggle_overide("zone-bus", "zoneDieuKien");
            var strId = this.id;
            me.strDuyetDeTai_Id = strId;
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


        $("#tblDuyetDeTai").delegate('.btnKetQua', 'click', function (e) {
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
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDuyetDeTai", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strHocBong_Id', e));
        });


        $(".btnSearch_DSDeTai").click(function () {
            $("#modalDSDeTai").modal("show");
            var aData = {};
            edu.util.viewValById("txtMaSo", aData.BV_KEHOACH_DETAI_ID);
            edu.util.viewValById("txtTenDeTaiTiengViet", aData.BV_KEHOACH_DETAI_ID);
            edu.util.viewValById("txtTenDeTaiTiengAnh", aData.BV_KEHOACH_DETAI_ID);
        });
        $("#tblDSDeTai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me["strDSDeTai_Id"] = strId;
            //me.toggle_edit()
            $("#modalDSDeTai").modal("show");
            var aData = me.dtDSDeTai.find(e => me.strDSDeTai_Id == e.ID);
            edu.util.viewValById("txtMaSo", aData.MADETAI);
            edu.util.viewValById("txtTenDeTaiTiengViet", aData.TENDETAITIENGVIET);
            edu.util.viewValById("txtTenDeTaiTiengAnh", aData.TENDETAITIENGANH);
        });
        $(".btnDelete_DSDeTai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSDeTai", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DSDeTai(arrChecked_Id[i]);
                }
            });
        });

        $("#btnThemDeTai").click(function () {
            if (!edu.util.getValById("dropSearch_KeHoach")) {
                edu.system.alert("Bạn cần chọn kế hoạch");
                return;
            }
            $("#modalThemDeTai").modal("show");

        })
        $("#btnSave_DSDeTai").click(function () {
            me.save_DSDeTai();
        });

        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_DuyetDeTai();
            me.getList_DSDeTai();
        });

        $(".btnXacNhan").click(function () {
            //var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            //if (arrChecked_Id.length == 0) {
            //    edu.system.alert("Vui lòng chọn đối tượng?");
            //    return;
            //}
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            var aData = me.dtDeTai.find(e => me.strDeTai_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $(".btnSave_XacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropTrangThaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            var aData = me.dtDeTai.find(e => me.strDeTai_Id == e.ID);
            var strSanPham = aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID + aData.BV_KEHOACH_ID + aData.BV_KEHOACH_DETAI_ID;
            me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
        });

        edu.system.uploadFiles(["txtFileDinhKem"]);
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strDuyetDeTai_Id = "";
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
        this.getList_DuyetDeTai();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DuyetDeTai: function (strDanhSach_Id) {
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
                    me.dtDuyetDeTai = dtReRult;
                    me.genTable_DuyetDeTai(dtReRult, data.Pager);
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

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DuyetDeTai: function (data, iPager) {
        var me = this;
        $("#lblDuyetDeTai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDuyetDeTai",

            bPaginate: {
                strFuntionName: "main_doc.DuyetDeTai.getList_DuyetDeTai()",
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
                    "mDataProp": "THONGTINDETAI"
                },
                {
                    "mDataProp": "BV_KEHOACH_DETAI_TEN"
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
        var aData = me.dtDuyetDeTai.find(e => e.ID == me.strDuyetDeTai_Id);
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
    save_DeTai: function () {
        var me = this;
        var aData = me.dtDuyetDeTai.find(e => e.ID == me.strDuyetDeTai_Id);
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KH_NG_GiaoDeTai',
            'type': 'POST',
            'strId': me.strDeTai_Id,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strLyDoDieuChinh': edu.util.getValById('txtLyDoDieuChinh'),
            'strBV_KeHoach_DeTai_Id': edu.util.getValById('dropDeTaiHuongDan'),
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
                    //$("#tblNguoiHuongDan tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    //});
                    $("#tblNguoiHuongDan tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThanhVien(strKetQua_Id, strKeHoachXuLy_Id);
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

                me.getList_DeTai();
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
        $("#lblDuyetDeTai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDeTai",

            bPaginate: {
                strFuntionName: "main_doc.DuyetDeTai.getList_DeTai()",
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
                        return '<a class="link-base btnEdit pointer" id="' + aData.ID + '">Chi tiết</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="link-base btnQuyetDinh pointer" id="' + aData.ID + '">Chi tiết</a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<a class="link-base btnDuyet pointer" id="' + aData.ID + '">Chi tiết</a>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strRowID, strDuyetDeTai_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        var aData = me.dtDuyetDeTai.find(e => e.ID == me.strDuyetDeTai_Id);
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KeHoach_NH_GiaoDT_HD',
            'type': 'POST',
            'strId': strId,
            'strBV_KeHoach_Id': aData.BV_KEHOACH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strBV_Kehoach_NH_GiaoDT_Id': strDuyetDeTai_Id,
            'strVaiTro_Id': edu.util.getValById('dropVaiTro' + strRowID),
            'strNguoiDung_Id': edu.util.getValById('dropCanBo' + strRowID),
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

        var aData = me.dtDuyetDeTai.find(e => e.ID == me.strDuyetDeTai_Id);
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
                    me.getList_ThanhVien();
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
        $("#tblNguoiHuongDan tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strKetQua_Id = data[i].ID;
            console.log(strKetQua_Id);
            var aData = data[i];
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td>' + edu.util.returnEmpty(aData.NGUOIDUNG_HODEM) + " " + edu.util.returnEmpty(aData.NGUOIDUNG_TEN) + '</td>';
            row += '<td>' + edu.util.returnEmpty(aData.VAITRO_TEN) + '</td>';
            row += '<td ><div id="txtFileDinhKem' + strKetQua_Id + '"></div></td>';
            row += '<td style="text-align: center"></td>';
            row += '</tr>';
            $("#tblNguoiHuongDan tbody").append(row);
            //me.genComBo_CanBo("dropCanBo" + strKetQua_Id, aData.NGUOIDUNG_ID);
            //me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, aData.VAITRO_ID);
            edu.system.viewFiles("txtFileDinhKem" + strKetQua_Id, strKetQua_Id, "LVLA_Files");
        }
    },
    genHTML_ThanhVien: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblNguoiHuongDan").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropCanBo' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td><select id="dropVaiTro' + strKetQua_Id + '" class="select-opt"></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblNguoiHuongDan tbody").append(row);
        me.genComBo_CanBo("dropCanBo" + strKetQua_Id, aData.NGUOIDUNG_ID);
        me.genComBo_VaiTro("dropVaiTro" + strKetQua_Id, aData.VAITRO_ID);
    },

    getList_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_Chung/LayDSBV_VaiTro_PhanLoai',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtVaiTro"] = json;
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
    
    getList_CanBo: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',
            'type': 'GET',
                'pageIndex': 1,
                'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me["dtCanBo"] = json;
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
    genComBo_CanBo: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtCanBo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return aData.MASO + " - " + aData.HODEM + " " + aData.TEN;
                },
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn cán bộ"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
        $("#" + strTinhTrang_Id).select2({
            dropdownParent: $('#modalDeTai .modal-content')
        });
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
                selectOne: true,
                avatar: ""
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    cbGenCombo_DeTaiHuongDan: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDETAITIENGVIET",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropDeTaiHuongDan"],
            type: "",
            title: "Chọn đề tài",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_DSDeTai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'LVLA_BV_KeHoach/LayDSBV_KeHoach_DeTai',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strBV_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDSDeTai"] = dtReRult;
                    me.genTable_DSDeTai(dtReRult, data.Pager);
                    me.cbGenCombo_DeTaiHuongDan(dtReRult);
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
    save_DSDeTai: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'LVLA_BV_KeHoach/Them_BV_KeHoach_DeTai',
            'type': 'POST',
            'strId': me.strDSDeTai_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strMaDeTai': edu.util.getValById('txtMaSo'),
            'strTenDeTaiTiengViet': edu.util.getValById('txtTenDeTaiTiengViet'),
            'strTenDeTaiTiengAnh': edu.util.getValById('txtTenDeTaiTiengAnh'),
            'strBV_KeHoach_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'LVLA_BV_KeHoach/Sua_BV_KeHoach_DeTai';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId) {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    if ($(this).attr("name") == "new") {
                    //        me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                    //    }
                    //});
                    //$("#tblNguoiHuongDan tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    //});

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

                me.getList_DSDeTai();
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
    delete_DSDeTai: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'LVLA_BV_KeHoach/Xoa_BV_KeHoach_DeTai',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
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
                    //me.getList_DeTai();
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
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DSDeTai();
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
    genTable_DSDeTai: function (data, iPager) {
        var me = this;
        $("#lblDuyetDeTai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDSDeTai",

            //bPaginate: {
            //    strFuntionName: "main_doc.DuyetDeTai.getList_DeTai()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "MADETAI"
                },
                {
                    "mDataProp": "TENDETAITIENGVIET",
                },
                {
                    "mDataProp": "TENDETAITIENGANH"
                },
                {
                    "mDataProp": "NGUOICUOI_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                },
                {
                    "mRender": function (nRow, aData) {
                        return aData.DASUDUNG ? "Đã sử dụng": "";
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

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'LVLA_BV_Chung/Them_BV_XacNhan_GiaoDeTai',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
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
    loadBtnXacNhan: function (data) {
        main_doc.KeHoachXuLy.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'LVLA_BV_Chung/LayDSBV_XacNhan_GiaoDeTai',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strsanpham_Id': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
                {
                    "mDataProp": "NGUOIXACNHAN_TENDAYDU"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    save_QuyetDinh: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_QuyetDinh/ThemMoi',
            'type': 'SET',
            'strHinhThucQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strLoaiQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strSoQuyetDinh': edu.util.getValById('txtAAAA'),
            'strNgayQuyetDinh': edu.util.getValById('txtAAAA'),
            'strCapQuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strNgayHieuLuc': edu.util.getValById('txtAAAA'),
            'strNguyenNhan_LyDo': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId) {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DSDeTai();
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

    save_QuyetDinh_NguoiHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_QuyetDinh_NguoiHoc/SV_QuyetDinh_NguoiHoc',
            'type': 'SET',
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strQLSV_QuyetDinh_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('txtAAAA'),
            'strDaoTao_ToChucCT_Id': edu.util.getValById('txtAAAA'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId) {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_DSDeTai();
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
}