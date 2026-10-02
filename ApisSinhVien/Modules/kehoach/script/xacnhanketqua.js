/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function XacNhanKetQua() { };
XacNhanKetQua.prototype = {
    dtThongTin: [],
    dtThongTin_View: [],
    dtSinhVien: [],
    strHead: '',

    init: function () {
        var me = this;
        me.strHead = $("#tblKetQua thead").html();
        me.getList_KeHoach();
        //me.getList_ThongTin();
        edu.system.loadToCombo_DanhMucDuLieu("QLSV.XACNHAN.SINHVIEN.NHAP.HOSO", "", "", me.loadBtnXacNhan);
        //edu.system.loadToCombo_DanhMucDuLieu("QLTC.CDCS", "dropSearch_CheDo");

        $("#btnSearch").click(function (e) {
            me.getList_TongHop();
        });
        $("#txtSearch_DT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TongHop();
            }
        });

        $('#dropSearch_KeHoach').on('select2:select', function (e) {
            me.getList_ThongTin();
        });
        $("#tblKetQua").delegate(".chkSelectAll", "click", function (e) {
            
            var checked_status = this.checked;
            var strClass = this.id.substring(this.id.indexOf("_") + 1);
            $(".check" + strClass).each(function () {
                this.checked = checked_status;
            });
        });
        $("#tblKetQua").delegate("#chkSelectAllTable", "click", function (e) {
            var checked_status = $(this).is(':checked');
            $("#tblKetQua tbody").find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });
        edu.system.getList_MauImport("zonebtnBaoCao_XNKQ", function (addKeyValue) {
            addKeyValue("strTuKhoa", edu.util.getValById("txtSearch_DT"));
            addKeyValue("strKhoaQuanLy_Id", edu.util.getValCombo("dropSearch_KhoaQuanLy"));
            addKeyValue("strHeDaoTao_Id", edu.util.getValCombo("dropSearch_HeDaoTao"));
            addKeyValue("strKhoaDaoTao_Id", edu.util.getValCombo("dropSearch_KhoaDaoTao"));
            addKeyValue("strChuongTrinh_Id", edu.util.getValCombo("dropSearch_ChuongTrinh"));
            addKeyValue("strLopQuanLy_Id", edu.util.getValCombo("dropSearch_Lop"));
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_HocKy"));
            addKeyValue("strTaiChinh_CacKhoanThu_Id", edu.util.getValCombo("dropSearch_KhoanThu"));
            addKeyValue("strDoiTuong_Id", edu.util.getValCombo("dropSearch_DoiTuong"));
            addKeyValue("strCheDoChinhSach_Id", edu.util.getValCombo("dropSearch_CheDo"));
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblKetQua .checkPhanQuyen");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    }
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {

                $("#modal_XacNhan").modal("hide");
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length);
            
            for (var i = 0; i < arrThem.length; i++) {
                me.save_KetQua(arrThem[i], strMoTa, strTinhTrang);
            }
        });
        $("#btnXacNhan").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblKetQua .checkPhanQuyen");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).is(':checked')) {
                    if ($(x[i]).attr("name") == undefined) {
                        arrThem.push(x[i]);
                    }
                    //else {
                    //    var inputcheck = $("#" + x[i].id.replace("chkSelect_", "inputSoThang_"));
                    //    if (inputcheck.attr("name") != inputcheck.val()) arrThem.push(x[i]);
                    //}
                }
                //else {
                //    if ($(x[i]).attr("name") != undefined) {
                //        arrXoa.push($(x[i]).attr("name"));
                //    }
                //}
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                //edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                //$("#btnYes").click(function (e) {
                //    edu.system.alert('<div id="divprogessdata"></div>');
                //    edu.system.genHTML_Progress("divprogessdata", arrThem.length + arrXoa.length);
                //    for (var i = 0; i < arrXoa.length; i++) {
                //        me.delete_KetQua(arrXoa[i]);
                //    }
                //    for (var i = 0; i < arrThem.length; i++) {
                //        me.save_KetQua(arrThem[i]);
                //    }
                //});

                $("#modal_XacNhan").modal("show");
            }
            else {
                edu.system.alert("Vui lòng chọn đối tượng");
            }
        });

        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        //me.getList_ChuongTrinhDaoTao();
        //me.getList_LopQuanLy();
        me.getList_NamNhapHoc();
        me.getList_KhoaQuanLy();
        $('#dropSearch_HeDaoTao_IHD').on('select2:select', function (e) {

            me.getList_KhoaDaoTao();
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            
        });
        $('#dropSearch_KhoaDaoTao_IHD').on('select2:select', function (e) {

            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            
        });
        $('#dropSearch_ChuongTrinh_IHD').on('select2:select', function (e) {

            me.getList_LopQuanLy();
            
        });
        $('#dropSearch_Lop_IHD').on('select2:select', function (e) {

            var x = $(this).val();
            
        });
        $('#dropSearch_NguoiThu_IHD').on('select2:select', function (e) {

            
        });
        $('#dropSearch_KhoaQuanLy_IHD').on('select2:select', function (e) {

            
        });
        $('#dropSearch_TruongThongTin').on('select2:select', function (e) {
            //me.getList_TongHop();
        });
        $("#dropSearch_KeHoach").on("select2:select", function () {
            var temp = $("#dropSearch_KeHoach option:selected").attr("name");
            if (temp && temp != "0") {
                me.bcheck = true;
            }
        });

        $("#btnImport").click(function () {
            me.showBaoCao("", "IMPORTWITHPROC_TRUONGTT", main_doc.XacNhanKetQua.getList_TruongTT);
        });

        $("#btnXuatExcel").click(function () { me.exportExcel_OpenModal(); });
        $("#btnExport_Start").click(function () { me.exportExcel_Start(); });
        $("#btnExport_Huy").click(function () { me.exportExcel_Cancel(); });
        $("#btnExport_Dem").click(function () { me.exportExcel_DemTongSV(); });
        $("#modal_ExportExcel").on('hidden.bs.modal', function () { me.exportCancelled = true; });

        $(".btnDownloadAllFile").click(function () {
            var arrFile = [];
            var arrFileName = [];
            me.dtSinhVien.forEach((e) => {
                var iVitri = 0;
                if ($('#tblKetQua tr[id=' + e.ID + ']').is(":hidden")) return;
                $('#tblKetQua tr[id=' + e.ID + '] .upload-img').each(function () {
                    var url = $(this).attr("name");

                    if (arrFile.indexOf(url) == -1) {
                        arrFile.push(url);
                        //arrFileName.push(e.DAOTAO_LOPQUANLY_MA + "_" +e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "//" + ++iVitri + "_" + e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "_" + $(this).attr("title"));
                        var strTenFile = $(this).attr("title");
                        arrFileName.push(e.QLSV_NGUOIHOC_MASO + strTenFile.substring(strTenFile.lastIndexOf(".")));
                    }
                });
                $('#tblKetQua tr[id=' + e.ID + '] .upload-file').each(function () {
                    var url = $(this).attr("name");
                    if (arrFile.indexOf(url) == -1) {
                        arrFile.push(url);
                        //arrFileName.push(e.DAOTAO_LOPQUANLY_MA + "_" +e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "//" + ++iVitri + "_" + e.QLSV_NGUOIHOC_MASO + "_" + e.QLSV_NGUOIHOC_HODEM + " " + e.QLSV_NGUOIHOC_TEN + "_" + $(this).attr("title"));
                        var strTenFile = $(this).attr("title");
                        arrFileName.push(e.QLSV_NGUOIHOC_MASO + strTenFile.substring(strTenFile.lastIndexOf(".")));
                    }
                });
            });

            me.save_GopFile(arrFile, arrFileName);
        });
    },
    resetCombobox: function (point) {
        var x = $(point).val();
        if (x.length == 2) {
            if (x[0] == "") {
                $(point).val(x[1]).trigger("change");
            }
        }
    },
    loadBtnXacNhan: function (data) {
        main_doc.XacNhanKetQua.dtXacNhan = data;
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

    getList_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_KeHoach_NguoiHoc/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genList_KeHoach(data.Data, data.Pager);
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
    genList_KeHoach: function (data) {
        data.push({
            "ID": "DULIEUGOC",
            "MOTA": "Dữ liệu gốc",
            "XACNHANTHONGTIN": 0
        })
        console.log(data);
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MOTA",
                code: "XACNHANTHONGTIN",
                selectOne: true
            },
            renderPlace: ["dropSearch_KeHoach"],
            type: "",
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropSearch_KeHoach").val(data[0].ID).trigger({ type: 'select2:select' });
    },

    getList_ThongTin: function () {
        var me = this;
        var obj_list = {
            'action': 'SV_KeHoach_NguoiHoc/LayDSThongTinTheoKeHoach',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtThongTin = data.Data;
                    me.genList_ThongTin(data.Data, data.Pager);
                    //me.getList_TongHop();
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
    genList_ThongTin: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_TruongThongTin"],
            type: "",
            title: "Chọn trường thông tin",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_TongHop: function (strTuKhoa) {
        var me = this;
        var obj_list = {
            'action': 'SV_KeHoach_PhamVi/LayDSQLSV_KeHoach_PhamVi_DL',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNamNhapHoc': edu.util.getValById('txtAAAA'),
            'strKhoaQuanLy_Id': edu.util.getValById('dropAAAA'),
            'strHeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearch_Lop_IHD'),
            'strTrangThaiNguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strTruongThongTin_Id': edu.util.getValById('dropSearch_TruongThongTin'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtSinhVien = data.Data;
                    me.genTable_TongHop(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }
                edu.system.endLoading();
            },
            error: function (er) {
                edu.system.endLoading();
                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            versionAPI: obj_list.versionAPI,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_TongHop: function (data, iPager) {
        var me = main_doc.XacNhanKetQua;
        var strTable_Id = "tblKetQua";
        $("#tblKetQua thead").html(me.strHead);
        var arrDoiTuong = me.dtThongTin;
        var strDoiTuong_Id = edu.util.getValById("dropSearch_TruongThongTin");
        if (strDoiTuong_Id  != "") {
            arrDoiTuong = [];
            var arDT = [strDoiTuong_Id];
            if (strDoiTuong_Id.indexOf(',') != -1) arDT = strDoiTuong_Id.split(",");
            arDT.forEach(e => arrDoiTuong.push(me.dtThongTin.find(ele => ele.ID == e)))
        }
        me.dtThongTin_View = arrDoiTuong;

        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center">' + arrDoiTuong[j].TEN + ' <br/> <input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + arrDoiTuong[j].ID + '" /></th>');
        }

        //$("#" + strTable_Id + " thead tr:eq(0)").append('<th colspan="' + (arrDoiTuong.length) + '" class="td-center">' + $("#dropSearch_CheDo option:selected").text() + '</th>');
        $("#" + strTable_Id + " thead tr:eq(0)").append('<th class="td-center">Tất cả <input type="checkbox" id="chkSelectAllTable"></th>');
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,

            bPaginate: {
                strFuntionName: "main_doc.XacNhanKetQua.getList_TongHop()",
                iDataRow: iPager,
                bFilter: true,
            },
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_MA"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                }
                , {
                    "mData": "TAICHINH_CACKHOANTHU_TEN",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<label id="inputNoiDung_' + aData.ID + '_' + main_doc.XacNhanKetQua.dtThongTin_View[iThuTu].ID + '" ></label>'
                            + '<input type="checkbox" class="check' + aData.ID + ' check' + main_doc.XacNhanKetQua.dtThongTin_View[iThuTu].ID + ' checkPhanQuyen poiter" id="chkSelect_' + aData.ID + '_' + main_doc.XacNhanKetQua.dtThongTin_View[iThuTu].ID + '" sanpham="' + main_doc.XacNhanKetQua.dtThongTin_View[iThuTu].ID + aData.ID +'" />'
                            + '<span id="lblxacnhan_' + aData.ID + '_' + main_doc.XacNhanKetQua.dtThongTin_View[iThuTu].ID + '"></span>';
                    }
                }
            );
            jsonForm.colPos.center.push(j + 3);
        }
        jsonForm.aoColumns.push(
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" class="chkSelectAll" id="chkSelectAll_' + aData.ID + '" />';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            //for (var j = 0; j < arrDoiTuong.length; j++) {
            //    me.getList_KetQua(data[i].ID, arrDoiTuong[j].ID, data[i].QLSV_NGUOIHOC_ID);
            //}
            me.getList_KetQua(data[i].ID, "", data[i].QLSV_NGUOIHOC_ID);
        }
        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
    },

    getList_KetQua: function (strId, strDoiTuong_Id, strQLSV_NguoiHoc_Id) {
        var me = this;
        var obj_list = {
            'action': 'SV_KeHoach_DuLieu/LayKQQLSV_KeHoach_DuLieu',
            'type': 'GET',
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strTruongThongTin_Id': strDoiTuong_Id,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
        };
        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    console.log(data.Data)
                    for (var i = 0; i < data.Data.length; i++) {
                        var json = data.Data[i];
                        //if (json.KETQUAXACNHAN_TEN) {
                        //    strDoiTuong_Id = json.TRUONGTHONGTIN_ID;
                        //    var check = $("#chkSelect_" + strId + "_" + strDoiTuong_Id);
                        //    console.log(strDoiTuong_Id);
                        //    console.log(check);
                        //    check.attr('checked', true);
                        //    check.prop('checked', true);
                        //    check.attr('name', json.ID);

                        //    var xannhan = $("#lblxacnhan_" + strId + "_" + strDoiTuong_Id);
                        //    xannhan.html(edu.util.returnEmpty(json.TRUONGTHONGTIN_GIATRI));
                        //}
                        strDoiTuong_Id = json.TRUONGTHONGTIN_ID;
                        //var check = $("#chkSelect_" + strId + "_" + strDoiTuong_Id);
                        //check.attr('checked', true);
                        //check.prop('checked', true);
                        //check.attr('name', json.ID);

                        var xannhan = $("#lblxacnhan_" + strId + "_" + strDoiTuong_Id);
                        xannhan.html(edu.util.returnEmpty(json.KETQUAXACNHAN_TEN));
                        var inputCheck = $("#inputNoiDung_" + strId + "_" + strDoiTuong_Id);
                        inputCheck.html(edu.util.returnEmpty(me.bcheck ? json.THONGTINXACMINH_KQ : json.TRUONGTHONGTIN_GIATRI_KQ));
                        var strKieuDuLieu = me.dtThongTin.find(e => e.ID == strDoiTuong_Id);
                        if (strKieuDuLieu && strKieuDuLieu.KIEUDULIEU == "FILE") {
                            edu.system.viewFiles("inputNoiDung_" + strId + "_" + strDoiTuong_Id, json.QLSV_NGUOIHOC_ID + json.TRUONGTHONGTIN_ID, "SV_Files")
                        }
                        //inputCheck.attr("name", edu.util.returnEmpty(json.TRUONGTHONGTIN_GIATRI));
                    }
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
    save_KetQua: function (point, strNoiDung, strTinhTrang_Id) {
        var me = this;
        let strSanPham_Id = edu.system.strChucNang_Id + edu.util.getValById("dropSearch_KeHoach") + $(point).attr("sanpham");
        var obj_save = {
            'action': 'SV_KeHoachHoSo_XacNhan/ThemMoi',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strQuyetDinh_Id = "";       

                    edu.system.alert("Thực hiện thành công", 'w');
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.endSetData();
                });
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    endSetData: function () {
        var me = main_doc.XacNhanKetQua;
        setTimeout(function () {
            me.getList_TongHop();
        }, 1000);
    },


    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
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
            strHeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
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
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
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
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao_IHD"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao_IHD"),
            strNganh_Id: "",
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinh_IHD"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000
        }
        edu.system.getList_LopQuanLy(objList, "", "", me.cbGenCombo_LopQuanLy);
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
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
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
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
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
            renderPlace: ["dropSearch_HeDaoTao_IHD"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HeDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_KhoaDaoTao_IHD"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_KhoaDaoTao_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_ChuongTrinh_IHD"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ChuongTrinh_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_Lop_IHD"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_Lop_IHD").val("").trigger("change");
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
            renderPlace: ["dropSearch_HocKy_IHD"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_HocKy_IHD").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.TinhTrangQuanSo.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_LHD_ALL" style="float: left; margin-right: 5px"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left; margin-right: 5px"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV_LHD" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV_LHD").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc_IHD"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy_IHD"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu_IHD").val("").trigger("change");
    },
    
    showBaoCao: function (strTenHienThi, strMaDanhMuc, sCallback) {
        var me = edu.system;
        
        var row = '';
        row += '<div class="row"><div class="col-sm-2" >- Thực hiện import: </div><div class="col-sm-2"><div id="importToCheck"></div></div></div>';
        if (strMaDanhMuc) {
            var url_report = edu.system.strhost + "/reportcms/Modules/Common/MauImport.aspx?Ma=" + strMaDanhMuc;
            row += '<div class="row"><div class="col-sm-2" style="overflow: hidden; height: 30px">- Mẫu ' + strTenHienThi + ': </div><div class="col-sm-2"><a id="btnHSLL_Import" href="' + url_report + '"><i class="fa-solid fa-file-import"></i></a></div></div>';
        }
        row += '<div class="group-title">';
        row += '<div class="clear">Bảng import</div>';
        row += '<div class="area-search">';
        row += '<div class="col-sm-3 item-search"><select id="dropSearch_BangA" class="select-opt"></select></div>';
        row += '</div>';
        row += '</div>';

        row += '<div class="clear"></div>';
        row += '<div class="zone-content">';
        row += '<div class="box-header with-border">';
        row += '<h3 class="box-title"><i class="fa fa-list-alt"></i> Danh sách</h3>';
        row += '<div class="pull-right"><a class="btn btn-primary" id="btnThucHienImport" href="#"><i class="fa fa-plus"></i> Thực hiện import</a></div>';
        row += '</div>';
        row += '<div class="clear"></div>';
        row += '<div class="row row-align">';
        row += '<table id="tblBangA" class="table table-hover table-bordered">';
        row += '<tbody></tbody>';
        row += '</table>';
        row += '</div>';
        row += '</div>';
        $("#modalBaoCao #modal_body").html(row);
        $("#modalBaoCao").modal("show");
        edu.system.uploadImport(["importToCheck"], me.getList_DataImport);
        $('#dropSearch_BangA').on('change', function () {
            me.genTable_Import_View(me.dtImport[$("#dropSearch_BangA").val()], "tblBangA")
        });
        //me.showCot($("#dropSearch_BangB").val(), "dropSearch_CotB");
        //$('#dropSearch_BangB').on('change', function () {
        //    me.showCot($("#dropSearch_BangB").val(), "dropSearch_CotB");
        //});
        $("#btnThucHienImport").click(function () {
            edu.system["strPhien_Id"] = edu.util.uuid();
            GetDuLieuDanhMuc("", edu.util.getValById("importToCheck"))
        });


        function GetDuLieuDanhMuc(a, strPath) {
            var strSheet = $("#dropSearch_BangA opntion:selected").text();
            var obj_list = {
                'action': 'SYS_Import/SImport',
                'strPath': strPath,
                'strApp_Id': edu.system.appId,
                'strMaDanhMuc': strMaDanhMuc,
                'strChucNang_Id': edu.system.strChucNang_Id,
                'strSheet': strSheet,
                'strNguoiThucHien_Id': edu.system.userId,
                'lKeyVal': []
            };
            if (strMaDanhMuc === undefined || strMaDanhMuc === "") {
                ImportData(obj_list);
            }
            me.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var lKeyVal = [];
                        for (var i = 0; i < data.Data.length; i++) {
                            if (edu.util.checkValue(data.Data[i].THONGTIN5)) {
                                //obj_list[data.Data[i].MA] = eval(data.Data[i].THONGTIN5);
                                lKeyVal.push({ strKey: data.Data[i].MA, strVal: eval(data.Data[i].THONGTIN5) });
                            }
                        }
                    }
                    obj_list.lKeyVal = lKeyVal;
                    //console.log(obj_list);
                    ImportData(obj_list);

                },
                error: function (er) {
                },
                type: 'GET',
                action: 'CMS_DanhMucThuocTinh/LayDanhSachDuLieuTheoBangDM',
                contentType: true,
                data: {
                    'strMaBangDanhMuc': strMaDanhMuc,
                    'strTieuChiSapXep': "",
                    'dTrangThai': 995
                },
                fakedb: [

                ]
            }, false, false, false, null);
        }

        function ImportData(obj_list) {

            //

            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        data = data.Data;
                        $(".tableError").remove();
                        if (data.length > 0) {
                            var iThanhCong = 0;
                            var iThatBai = 0;
                            var row = '';
                            row += '<table class="table table-hover table-bordered tableError">';
                            row += '<tbody>';
                            row += '<tr>';
                            row += '<td>Dữ liệu</td>';
                            row += '<td>Lỗi</td>';
                            row += '</tr>';
                            for (var i = 0; i < data.length; i++) {
                                row += '<tr>';
                                if (edu.util.checkValue(data[i].VALUE)) {
                                    iThatBai++;
                                    row += '<td>' + edu.util.returnEmpty(data[i].KEY) + '</td>';
                                    row += '<td>' + edu.util.returnEmpty(data[i].VALUE) + '</td>';
                                } else {
                                    iThanhCong++;
                                }
                                row += '</tr>';
                            }
                            row += '</tbody>';
                            row += '<thead><tr><td colspan="2">Thành công <span class="italic color-active">' + iThanhCong + '</span>; Thất bại: <span class="italic color-warning">' + iThatBai + '</span></td></tr></thead>';
                            row += '</table>';
                            edu.system.alert(row);
                        }
                        if (sCallback != undefined && sCallback != "undefined" && sCallback != "") {
                            sCallback();
                        }
                    }
                },
                error: function (er) {
                    edu.system.alert(JSON.stringify(er), "w");
                },
                type: 'POST',
                action: obj_list.action,

                contentType: true,

                data: obj_list,
                fakedb: [

                ]
            }, false, false, false, null);
        }
    },


    getList_TruongTT: function (strDanhSach_Id) {
        var me = main_doc.XacNhanKetQua;
        //--Edit
        var obj_save = {
            'action': 'SV_Import_MH/DSA4BRIKEAgsMS4zNR4JLhIuHhUzNC4vJhUV',
            'func': 'PKG_HOSOSINHVIEN_IMPORT.LayDSKQImport_HoSo_TruongTT',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strPhienImport': edu.system.strPhien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["TruongTT"] = dtReRult;
                    me.genTable_TruongTT(dtReRult, data.Pager);
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
    genTable_TruongTT: function (data, iPager) {
        $("#lblTruongTT_Tong").html(iPager);
        $("#modalBaoCao").modal("hide");
        $("#myModalTruongTT").modal("show");
        setTimeout(function () {
            $("#myModalAlert").modal("hide");
        }, 1000)
        var jsonForm = {
            strTable_Id: "tblTruongTT",
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
                    "mDataProp": "QLSV_NGUOIHOC_MA"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITHUCHIEN_TAIKHOAN"
                },
                {
                    "mDataProp": "TRUONGTHONGTIN_TEN"
                },
                {
                    "mDataProp": "TRUONGTHONGTINDULIEU_GIATRI"
                },
                {
                    "mDataProp": "ERR"
                },
                {
                    "mDataProp": "QLSV_KEHOACH_NGUOIHOC_TEN"
                }
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                //    }
                //}
                //, {
                //    "mRender": function (nRow, aData) {
                //        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                //    }
                //}
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    save_GopFile: function (arrUrl, arrFileName) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'CMS_Files/GopFile',

            'arrTuKhoa': arrUrl,
            'arrDuLieu': arrFileName,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Data) {
                        window.open(edu.system.rootPathUpload + "/" + data.Data);
                    }
                }
            },
            error: function (er) {
                obj_notify = {
                    renderPlace: "slnhansu" + strNhanSu_Id,
                    type: "w",
                    title: obj_save + " (er): " + JSON.stringify(er)
                };
                edu.system.notifyLocal(obj_notify);
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*------------------------------------------
    --Discription: Xuất Excel dữ liệu hồ sơ (client-side)
    --Nguồn: LayDSQLSV_KeHoach_PhamVi_DL (DS SV) + LayKQQLSV_KeHoach_DuLieu (giá trị từng trường)
    --Lib: XLSX (SheetJS) load lazy từ CDN trong xacnhanketqua.html
    -------------------------------------------*/
    exportExcel_OpenModal: function () {
        var me = this;
        if (typeof XLSX === 'undefined') {
            edu.system.alert('Thư viện Excel chưa load xong. Vui lòng thử lại sau vài giây.', 'w');
            return;
        }
        var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');
        if (!edu.util.checkValue(strKeHoach_Id) || strKeHoach_Id === 'DULIEUGOC') {
            edu.system.alert('Vui lòng chọn Kế hoạch (khác "Dữ liệu gốc") trước khi xuất Excel.', 'w');
            return;
        }
        me.exportCancelled = false;
        me._exportResetModalUI();
        $("#lblExport_KeHoach").text($("#dropSearch_KeHoach option:selected").text() || '—');

        var strTruongTT_Id = edu.util.getValById('dropSearch_TruongThongTin');
        var arrTT = me.dtThongTin || [];
        if (edu.util.checkValue(strTruongTT_Id)) {
            var ids = strTruongTT_Id.indexOf(',') >= 0 ? strTruongTT_Id.split(',') : [strTruongTT_Id];
            var names = ids.map(function (id) {
                var f = arrTT.find(function (e) { return e && e.ID === id; });
                return f ? f.TEN : id;
            });
            $("#lblExport_TruongTT").text(names.length + ' trường: ' + names.join(', '));
        } else {
            $("#lblExport_TruongTT").text('Tất cả ' + arrTT.length + ' trường của kế hoạch');
        }
        $("#lblExport_TongSV").text('— (bấm "Đếm" để kiểm tra)');
        $("#modal_ExportExcel").modal('show');
    },

    _exportResetModalUI: function () {
        $("#zoneExport_Progress").hide();
        $("#barExport_Progress").css('width', '0%').text('0%');
        $("#lblExport_ProgressLog").text('Đang chuẩn bị…');
        $("#btnExport_Huy").hide();
        $("#btnExport_Start").prop('disabled', false).show();
        $('input[name="exportQty"]').prop('disabled', false);
    },

    _exportBuildQueryParams: function (pageIndex, pageSize) {
        return {
            'action': 'SV_KeHoach_PhamVi/LayDSQLSV_KeHoach_PhamVi_DL',
            'type': 'GET',
            'strTuKhoa': '',
            'strQLSV_KeHoach_NguoiHoc_Id': edu.util.getValById('dropSearch_KeHoach'),
            'strNamNhapHoc': '',
            'strKhoaQuanLy_Id': edu.util.getValCombo('dropSearch_KhoaQuanLy_IHD'),
            'strHeDaoTao_Id': edu.util.getValCombo('dropSearch_HeDaoTao_IHD'),
            'strKhoaDaoTao_Id': edu.util.getValCombo('dropSearch_KhoaDaoTao_IHD'),
            'strChuongTrinh_Id': edu.util.getValCombo('dropSearch_ChuongTrinh_IHD'),
            'strLopQuanLy_Id': edu.util.getValCombo('dropSearch_Lop_IHD'),
            'strTrangThaiNguoiHoc_Id': '',
            'strTruongThongTin_Id': '',
            'strNguoiTao_Id': '',
            'pageIndex': pageIndex,
            'pageSize': pageSize
        };
    },

    exportExcel_DemTongSV: function () {
        var me = this;
        $("#lblExport_TongSV").text('Đang đếm…');
        var obj = me._exportBuildQueryParams(1, 1);
        edu.system.makeRequest({
            success: function (data) {
                if (data && data.Success) {
                    var iTotal = parseInt(data.Pager, 10);
                    if (isNaN(iTotal)) iTotal = (data.Data ? data.Data.length : 0);
                    me.exportTongSV_Cache = iTotal;
                    $("#lblExport_TongSV").text(iTotal.toLocaleString('vi-VN') + ' SV');
                } else {
                    $("#lblExport_TongSV").text('Lỗi: ' + (data && data.Message ? data.Message : 'không xác định'));
                }
            },
            error: function () { $("#lblExport_TongSV").text('Lỗi mạng khi đếm.'); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj.action,
            data: obj,
            fakedb: []
        }, false, false, false, null);
    },

    exportExcel_Cancel: function () {
        var me = this;
        me.exportCancelled = true;
        $("#lblExport_ProgressLog").text('Đã hủy bởi người dùng. Có thể bấm "Xuất Excel" để chạy lại.');
        me._exportResetModalUI();
        $("#zoneExport_Progress").show();
    },

    exportExcel_Start: function () {
        var me = this;
        var qtyVal = $('input[name="exportQty"]:checked').val() || 'all';
        var iPageSize = qtyVal === 'all' ? 100000 : parseInt(qtyVal, 10);
        if (!iPageSize || isNaN(iPageSize)) iPageSize = 100000;

        me.exportCancelled = false;
        $("#btnExport_Start").prop('disabled', true);
        $('input[name="exportQty"]').prop('disabled', true);
        $("#btnExport_Huy").show();
        $("#zoneExport_Progress").show();
        $("#barExport_Progress").css('width', '0%').text('0%');
        $("#lblExport_ProgressLog").text('Đang lấy danh sách sinh viên…');

        var obj = me._exportBuildQueryParams(1, iPageSize);
        edu.system.makeRequest({
            success: function (data) {
                if (me.exportCancelled) return;
                if (!data || !data.Success) {
                    $("#lblExport_ProgressLog").text('Lỗi lấy DS SV: ' + (data && data.Message ? data.Message : ''));
                    me._exportResetModalUI();
                    $("#zoneExport_Progress").show();
                    return;
                }
                var arrSV = data.Data || [];
                if (arrSV.length === 0) {
                    $("#lblExport_ProgressLog").text('Không có sinh viên nào trong phạm vi lọc.');
                    me._exportResetModalUI();
                    $("#zoneExport_Progress").show();
                    return;
                }
                me.exportExcel_FetchAllKetQua(arrSV);
            },
            error: function () {
                $("#lblExport_ProgressLog").text('Lỗi mạng khi lấy danh sách SV.');
                me._exportResetModalUI();
                $("#zoneExport_Progress").show();
            },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj.action,
            data: obj,
            fakedb: []
        }, false, false, false, null);
    },

    exportExcel_FetchAllKetQua: function (arrSV) {
        var me = this;
        var iTotal = arrSV.length;
        var iDone = 0, iFail = 0;
        var iRunning = 0, iNext = 0;
        var CONCURRENCY = 6;
        var TIMEOUT_MS = 20000;
        var mapKetQua = {};
        var strKeHoach_Id = edu.util.getValById('dropSearch_KeHoach');

        function updateProgress() {
            var iper = iTotal ? Math.round((iDone / iTotal) * 100) : 100;
            $("#barExport_Progress").css('width', iper + '%').text(iper + '%');
            $("#lblExport_ProgressLog").text('Đã tải ' + iDone + '/' + iTotal + ' SV (Lỗi/timeout: ' + iFail + ')');
        }
        updateProgress();

        function fetchOne(sv) {
            return new Promise(function (resolve) {
                var timer = setTimeout(function () { resolve({ error: 'timeout' }); }, TIMEOUT_MS);
                var obj = {
                    'action': 'SV_KeHoach_DuLieu/LayKQQLSV_KeHoach_DuLieu',
                    'type': 'GET',
                    'strQLSV_KeHoach_NguoiHoc_Id': strKeHoach_Id,
                    'strTruongThongTin_Id': '',
                    'strQLSV_NguoiHoc_Id': sv.QLSV_NGUOIHOC_ID
                };
                edu.system.makeRequest({
                    success: function (data) {
                        clearTimeout(timer);
                        resolve({ data: (data && data.Success) ? (data.Data || []) : [] });
                    },
                    error: function () {
                        clearTimeout(timer);
                        resolve({ error: 'network' });
                    },
                    type: "GET",
                    versionAPI: "v1.0",
                    contentType: true,
                    action: obj.action,
                    data: obj,
                    fakedb: []
                }, false, false, false, null);
            });
        }

        function tick() {
            if (me.exportCancelled) return;
            while (iRunning < CONCURRENCY && iNext < iTotal) {
                var sv = arrSV[iNext++];
                iRunning++;
                (function (svCur) {
                    fetchOne(svCur).then(function (res) {
                        if (me.exportCancelled) return;
                        iRunning--;
                        iDone++;
                        if (res.error) {
                            iFail++;
                        } else {
                            var row = mapKetQua[svCur.QLSV_NGUOIHOC_ID] = mapKetQua[svCur.QLSV_NGUOIHOC_ID] || {};
                            (res.data || []).forEach(function (kq) {
                                if (kq && kq.TRUONGTHONGTIN_ID) row[kq.TRUONGTHONGTIN_ID] = kq;
                            });
                        }
                        updateProgress();
                        if (iDone === iTotal) {
                            me.exportExcel_Generate(arrSV, mapKetQua, iFail);
                        } else {
                            tick();
                        }
                    });
                })(sv);
            }
        }
        tick();
    },

    exportExcel_Generate: function (arrSV, mapKetQua, iFail) {
        var me = this;
        if (me.exportCancelled) return;
        if (typeof XLSX === 'undefined') {
            $("#lblExport_ProgressLog").text('Lỗi: XLSX chưa load. Thử refresh trang.');
            me._exportResetModalUI(); $("#zoneExport_Progress").show();
            return;
        }
        $("#lblExport_ProgressLog").text('Đang tạo file Excel…');

        var strTruongTT_Id = edu.util.getValById('dropSearch_TruongThongTin');
        var arrTT_All = (me.dtThongTin || []).filter(function (e) { return e && e.ID && e.TEN; });
        var arrTT_Ex = [];
        if (edu.util.checkValue(strTruongTT_Id)) {
            var ids = strTruongTT_Id.indexOf(',') >= 0 ? strTruongTT_Id.split(',') : [strTruongTT_Id];
            ids.forEach(function (id) {
                var f = arrTT_All.find(function (e) { return e.ID === id; });
                if (f) arrTT_Ex.push(f);
            });
        } else {
            arrTT_Ex = arrTT_All;
        }

        var v = edu.util.returnEmpty || function (x) { return x == null ? '' : x; };
        var usedNames = {};
        function uniqueName(name) {
            var base = name || 'Trường';
            var n = base, i = 2;
            while (usedNames[n]) { n = base + ' (' + i + ')'; i++; }
            usedNames[n] = true;
            return n;
        }
        var colTT = arrTT_Ex.map(function (tt) { return { id: tt.ID, kieu: tt.KIEUDULIEU, name: uniqueName(tt.TEN || tt.MA || ('Trường ' + tt.ID)) }; });

        function fmtNgaySinh(o) {
            if (!o) return '';
            var raw = v(o.QLSV_NGUOIHOC_NGAYSINH) || v(o.NGAYSINH) || v(o.QLSV_NGUOIHOC_NGAYSINH_DD_MM_YYYY);
            if (raw && String(raw).indexOf('/') > 0) return raw;
            var d = v(o.QLSV_NGUOIHOC_NGAYSINH) || v(o.NGAYSINH);
            var m = v(o.QLSV_NGUOIHOC_THANGSINH) || v(o.THANGSINH);
            var y = v(o.QLSV_NGUOIHOC_NAMSINH) || v(o.NAMSINH);
            var pad = function (n) { n = String(n); return n.length < 2 ? '0' + n : n; };
            if (d && m && y) return pad(d) + '/' + pad(m) + '/' + y;
            return raw || '';
        }
        var rows = arrSV.map(function (sv, i) {
            var kqOfSV = mapKetQua[sv.QLSV_NGUOIHOC_ID] || {};
            var hoTen = (v(sv.QLSV_NGUOIHOC_HODEM) + ' ' + v(sv.QLSV_NGUOIHOC_TEN)).replace(/\s+/g, ' ').trim();
            var row = {
                'STT': i + 1,
                'Lớp': v(sv.DAOTAO_LOPQUANLY_MA),
                'Mã số': v(sv.QLSV_NGUOIHOC_MASO),
                'Họ và tên': hoTen,
                'Ngày sinh': fmtNgaySinh(sv),
                'Giới tính': v(sv.QLSV_NGUOIHOC_GIOITINH_TEN) || v(sv.GIOITINH_TEN)
                    || v(sv.QLSV_NGUOIHOC_GIOITINH) || v(sv.GIOITINH)
                    || v(sv.TENGIOITINH) || v(sv.QLSV_NGUOIHOC_TENGIOITINH)
                    || v(sv.QLSV_NGUOIHOC_GIOITINH_MA) || v(sv.GIOITINH_MA)
                    || ''
            };
            colTT.forEach(function (c) {
                var kq = kqOfSV[c.id];
                var val = '';
                if (kq) {
                    if (c.kieu === 'FILE') {
                        val = kq.TRUONGTHONGTIN_GIATRI_KQ ? 'Có file' : '';
                    } else {
                        val = v(kq.TRUONGTHONGTIN_GIATRI_KQ);
                    }
                }
                row[c.name] = val;
            });
            return row;
        });

        var ws = XLSX.utils.json_to_sheet(rows);
        var headers = Object.keys(rows[0] || {});
        ws['!cols'] = headers.map(function (h) {
            var maxLen = h.length;
            for (var i = 0; i < rows.length; i++) {
                var l = String(rows[i][h] == null ? '' : rows[i][h]).length;
                if (l > maxLen) maxLen = l;
            }
            return { wch: Math.min(maxLen + 2, 50) };
        });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'XacNhanKetQua');

        var now = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var stamp = now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate())
            + '_' + pad(now.getHours()) + pad(now.getMinutes());
        var fileName = 'XacNhanKetQua_' + stamp + '.xlsx';
        XLSX.writeFile(wb, fileName);

        var msg = 'Đã xuất: ' + fileName + ' (' + arrSV.length + ' SV × ' + colTT.length + ' trường)';
        if (iFail > 0) msg += ' — có ' + iFail + ' SV bị lỗi/timeout, cột trường TT để trống.';
        $("#lblExport_ProgressLog").text(msg);
        me._exportResetModalUI();
        $("#zoneExport_Progress").show();
    }
}