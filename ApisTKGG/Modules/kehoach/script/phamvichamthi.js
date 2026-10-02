/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function PhamViChamThi() { };
PhamViChamThi.prototype = {
    strPhamViChamThi_Id: '',
    dtPhamViChamThi: [],
    dtChamThi: [],
    dtChamTui: [],

    init: function () {
        var me = this;
        me['strHead'] = $("#tblPhamViChamThi thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_PhamViChamThi();
        me.getList_ThoiGian();
        me.getList_ThoiGian_CT();
        me.getList_ThoiGian_DST();
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.DONVITINH.APPhamViChamThi", "dropSearch_DonViTinh,dropDonViTinh");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAI.DANHMUCAPPhamViChamThi", "dropPhanLoai");

        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zonebatdau");
        });
        $("#btnAdd_PhamViChamThi_CT").click(function () {
            var data = {};
            edu.util.toggle_overide("zone-bus", "zoneEdit_CT");
        });
        $("#btnSave_PhamViChamTui_CT").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChamTui", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_PhamViChamThi_CT(arrChecked_Id[i]);
            }
        });

        $("#btnAdd_PhamViChamThi_DST").click(function () {
            var data = {};
            edu.util.toggle_overide("zone-bus", "zoneEdit_DST");
        });
        $("#btnSave_PhamViChamTui_DST").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChamThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_PhamViChamThi_DST(arrChecked_Id[i]);
            }
        });

        $("#btnSearch").click(function () {
            me.getList_PhamViChamThi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhamViChamThi();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_KeHoachTongHop();
        });
        $('#dropSearch_KeHoachTongHop').on('select2:select', function () {
            me.getList_KeHoachChiTiet();
        });
        $('#dropSearch_KeHoachChiTiet').on('select2:select', function () {
            me.getList_PhamViChamThi();
        });

        $('#dropSearch_ThoiGian_CT').on('select2:select', function (e) {

            //me.getList_CoiThi();
            me.getList_DotThi_CT();
            me.getList_MonThi_CT();
            me.getList_HinhThucThi_CT();
            me.getList_GVCoiThi_CT();
            me.getList_PhanGVCoiThi_CT();
        });
        $('#dropSearch_DotThi_CT').on('select2:select', function (e) {

            me.getList_MonThi_CT();
            me.getList_HinhThucThi_CT();
            me.getList_GVCoiThi_CT();
            me.getList_PhanGVCoiThi_CT();
        });
        $('#dropSearch_MonThi_CT').on('select2:select', function (e) {

            me.getList_HinhThucThi_CT();
            me.getList_GVCoiThi_CT();
            me.getList_PhanGVCoiThi_CT();
            //me.getList_DotPhach_CT();
        });
        $('#dropSearch_HinhThuc_CT').on('select2:select', function (e) {
            me.getList_PhongThi_CT();
            me.getList_NgayThi_CT();
        });
        $('#dropSearch_PhongThi_CT').on('select2:select', function (e) {
            me.getList_NgayThi_CT();
        });
        $("#btnSearch_CT").click(function (e) {
            me.getList_ChamTui();
        });
        $("#txtSearch_CT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ChamTui();
            }
        });

        $('#dropSearch_ThoiGian_DST').on('select2:select', function (e) {

            //me.getList_CoiThi();
            me.getList_DotThi_DST();
            me.getList_MonThi_DST();
            me.getList_HinhThucThi_DST();
            me.getList_GVCoiThi_DST();
            me.getList_PhanGVCoiThi_DST();
        });
        $('#dropSearch_DotThi_DST').on('select2:select', function (e) {

            me.getList_MonThi_DST();
            me.getList_HinhThucThi_DST();
            me.getList_GVCoiThi_DST();
            me.getList_PhanGVCoiThi_DST();
        });
        $('#dropSearch_MonThi_DST').on('select2:select', function (e) {

            me.getList_HinhThucThi_DST();
            me.getList_GVCoiThi_DST();
            me.getList_PhanGVCoiThi_DST();
            //me.getList_DotPhach_DST();
        });
        $('#dropSearch_HinhThuc_DST').on('select2:select', function (e) {
            me.getList_PhongThi_DST();
            me.getList_NgayThi_DST();
        });
        $('#dropSearch_PhongThi_DST').on('select2:select', function (e) {
            me.getList_NgayThi_DST();
        });
        $("#btnSearch_DST").click(function (e) {
            me.getList_ChamThi();
        });
        $("#txtSearch_DST").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ChamThi();
            }
        });


    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIVKS4oBiggLxUuLyYJLjEKDQPP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSThoiGianTongHopKL',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "THOIGIAN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropThoiGian", "dropSearch_ThoiGian"],
                        type: "",
                        title: "Chọn thời gian",
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
    getList_KeHoachTongHop: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHhUuLyYJLjEKKS4oDTQuLyYP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_TongHopKhoiLuong',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'dHieuLuc': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KeHoachTongHop"],
                        type: "",
                        title: "Chọn kế hoạch tổng hợp",
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
    getList_KeHoachChiTiet: function () {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgokCS4gIikCKSgVKCQ1',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_KeHoachChiTiet',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strKLGD_TongHopKhoiLuong_Id': edu.system.getValById('dropSearch_KeHoachTongHop'),
            'strCheDoApDung_Id': edu.system.getValById('dropAAAA'),
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'strTuNgay': edu.system.getValById('txtAAAA'),
            'strDenNgay': edu.system.getValById('txtAAAA'),
            'dHieuLuc': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_KeHoachChiTiet"],
                        type: "",
                        title: "Chọn kế hoạch chi tiết",
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
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_PhamViChamThi_CT: function (strThi_TuiBai_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CKSAsFSkoHhU0KAPP',
            'func': 'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_Tui',
            'iM': edu.system.iM,
            'strKLGD_KeHoachChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strThi_TuiBai_Id': strThi_TuiBai_Id,
            'strMoTa': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl';
        //    obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApPhamViChamThi_Ad'
        //}
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamViChamThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhamViChamThi_DST: function (strThi_TuiBai_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CKSAsFSkoHgUSFQPP',
            'func': 'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_ChamThi_DST',
            'iM': edu.system.iM,
            'strKLGD_KeHoachChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strThi_DanhSachThi_Id': strThi_TuiBai_Id,
            'strMoTa': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl';
        //    obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApPhamViChamThi_Ad'
        //}
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhamViChamThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhamViChamThi: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4CKSAsFSko',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_ChamThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropAAAA'),
            'strKLGD_KeHoachChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strKLGD_TongHopKhoiLuong_Id': edu.system.getValById('dropSearch_KeHoachTongHop'),
            'strDotHoc_Id': edu.system.getValById('dropAAAA'),
            'strLoaiXacNhan_Id': edu.system.getValById('dropAAAA'),
            'strHanhDongXacNhan_Id': edu.system.getValById('dropAAAA'),
            'strDonViQuanLyHocPhan_Id': edu.system.getValById('dropAAAA'),
            'strDonViQuanLyGiangVien_Id': edu.system.getValById('dropAAAA'),
            'strGiangVien_Id': edu.system.getValById('dropAAAA'),
            'strTKB_HinhThucHoc_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhamViChamThi"] = dtReRult;
                    me.genTable_PhamViChamThi(dtReRult, data.Pager);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_PhamViChamThi: function (data, iPager) {
        var me = this;
        $("#lblPhamViChamThi_Tong").html(iPager);
        $("#tblPhamViChamThi thead").html(me.strHead);
        var html = '';
        data.rsSoNguoiCham.forEach(e => {
            html += '<th>' + edu.util.returnEmpty(e.TIEUDETENNGUOICHAM) + " " + edu.util.returnEmpty(e.STT) + '</th><th>' + edu.util.returnEmpty(e.TIEUDESOLUONG) + '</th>';
        })
        $("#tblPhamViChamThi thead tr:eq(1)").append(html);
        document.getElementById("lblColSpan").colSpan = (data.rsSoNguoiCham.length * 2);
        var jsonForm = {
            strTable_Id: "tblPhamViChamThi",
            aaData: data.rs,
            bPaginate: {
                strFuntionName: "main_doc.PhamViChamThi.getList_PhamViChamThi()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "LOAIDULIEU_TEN"
                },
                {
                    "mDataProp": "DULIEUXACNHAN_MA"
                },
                {
                    "mDataProp": "DULIEUXACNHAN_TEN"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "THOIGIAN"
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
        me.dtPhamViChamThi.rsSoNguoiCham.forEach(e => {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<a class="" id="lblTieuDe' + aData.ID + '_' + main_doc.PhamViChamThi.dtPhamViChamThi.rsSoNguoiCham[iThuTu].STT + '" ></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<a class="" id="lblSoNguoi' + aData.ID + '_' + main_doc.PhamViChamThi.dtPhamViChamThi.rsSoNguoiCham[iThuTu].STT + '" ></a>';
                    }
                }
            );
        });
        jsonForm.aoColumns.push(
            {
                "mDataProp": "KHOADULIEU"
            },
            {
                //"mDataProp": "TONG",
                "mRender": function (nRow, aData) {
                    return '<a class="" id="lblTong' + aData.ID + '" ></a>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            }
        );
        edu.system.loadToTable_data(jsonForm);
        if (data.rs.length) {
            edu.system.genHTML_Progress("zoneprocessXXXX1", (data.rs.length * data.rsSoNguoiCham.length));
            data.rs.forEach(e => me.dtPhamViChamThi.rsSoNguoiCham.forEach(ele => me.getData_NguoiCham(e, ele.STT)));
        } else {
            $("#tblPhamViChamThi tfoot").html("");
        }
        /*III. Callback*/
    },
    getData_NguoiCham: function (e, str2) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4FRUPJjQuKAIpICwVKSgVKSQu',
            'func': 'PKG_KLGV_V2_THONGTIN.LayTTNguoiChamThiTheo',
            'iM': edu.system.iM,
            'strKLGD_DuLieu_Id': e.ID,
            'dNguoiThuMay': str2,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length) {
                        var json = dtReRult[0];
                        $('#lblTieuDe' + e.ID + "_" + str2).html(edu.util.returnEmpty(json.MASO) + " " + edu.util.returnEmpty(json.HODEM) + " " + edu.util.returnEmpty(json.TEN));
                        $('#lblSoNguoi' + e.ID + "_" + str2).html(edu.util.returnEmpty(json.SOLUONG));
                    }

                }
                else {
                    edu.system.alert(data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX1", function () {
                    me.dtPhamViChamThi.rs.forEach(e => {
                        var iTong = 0;
                        me.dtPhamViChamThi.rsSoNguoiCham.forEach(ele => {
                            var check = $('#lblSoNguoi' + e.ID + "_" + ele.STT).text();
                            if (check) iTong += parseInt(check);
                        })
                        $('#lblTong' + e.ID).html(iTong);
                    })
                    var arr = [];
                    me.dtPhamViChamThi.rsSoNguoiCham.forEach((e, nRow) => arr.push((7 + 2 * nRow)));
                    arr.push((7 + 2 * me.dtPhamViChamThi.rsSoNguoiCham.length))
                    edu.system.insertSumAfterTable("tblPhamViChamThi", arr);
                });
            },
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian_CT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIVKS4oBiggLwIpICwVKSgVNCgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSThoiGianChamThiTui',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "THOIGIAN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_ThoiGian_CT"],
                        type: "",
                        title: "Chọn thời gian",
                    })
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DotThi_CT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIFLjUVKSgCKSAsFSkoFTQo',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotThiChamThiTui',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENDOTTHI",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_DotThi_CT"],
                        type: "",
                        title: "Chọn đợt thi",
                    })
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_MonThi_CT: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIJLiIRKSAvAikgLBUpKBU0KAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSHocPhanChamThiTui',
            'iM': edu.system.iM,
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: "",
                            mRender: function (nRow, aData) {
                                return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA)
                            }
                        },
                        renderPlace: ["dropSearch_MonThi_CT"],
                        type: "",
                        title: "Chọn môn thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DotPhach_CT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIFLjURKSAiKQIpICwVKSgVNCgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotPhachChamThiTui',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_DotPhach_CT"],
                        type: "",
                        title: "Chọn đợt phách",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_PhanGVCoiThi_CT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIGKCAvJhcoJC8CKSAsFSkoFTQo',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSGiangVienChamThiTui',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "GIANGVIEN",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_PhanGVCoiThi_CT"],
                        type: "",
                        title: "Chọn được phân chấm thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_GVCoiThi_CT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIPJjQuKBEpIC8CKSAsFSkoFTQo',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSNguoiPhanChamThiTui',
            'iM': edu.system.iM,
            'strGiangVienCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi_CT'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "GIANGVIEN",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_GVCoiThi_CT"],
                        type: "",
                        title: "Chọn giảng viên thực hiện phân chấm thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HinhThucThi_CT: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIJKC8pFSk0IhUpKAIpICwVKSgVNCgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSHinhThucThiChamThiTui',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENHINHTHUCTHI",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_HinhThuc_CT"],
                        type: "",
                        title: "Chọn hình thức thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_PhongThi_CT: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIRKS4vJhUpKAIpICwVKSgVNCgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSPhongThiChamThiTui',
            'iM': edu.system.iM,
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc_CT'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENPHONGHOC",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_PhongThi_CT"],
                        type: "",
                        title: "Chọn phòng thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NgayThi_CT: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIPJiA4FSkoAikgLBUpKBU0KAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSNgayThiChamThiTui',
            'iM': edu.system.iM,
            'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi_CT'),
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc_CT'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "NGAYTHI",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_NgayThi_CT"],
                        type: "",
                        title: "Chọn ngày thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
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
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ChamTui: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRISLhUpJC4FLigCKSAsFSkoFTQo',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSSoTheoDoiChamThiTui',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_CT'),
            'strThi_DotPhach_Id': edu.system.getValById('dropSearch_DotPhach_CT'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_CT'),
            'strGVDuocPhanCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi_CT'),
            'strGVThucHienPhanCoiThi_Id': edu.system.getValById('dropSearch_GVCoiThi_CT'),
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc_CT'),
            'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi_CT'),
            'strNgayThi': edu.system.getValById('dropSearch_NgayThi_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChamTui = dtReRult;
                    me.genTable_ChamTui(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ChamTui: function (data, iPager) {
        var me = this;
        $("#lblChamTui_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChamTui",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_ChamTui()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "THI_DOTPHACH_TEN"
                },
                {
                    "mDataProp": "THI_TUIBAI_TEN"
                },
                {
                    "mDataProp": "THI_DANHSACHTHI_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "THI_HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "THI_CATHI_TEN"
                },
                {
                    "mDataProp": "TKB_PHONGHOC_TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    //"mDataProp": "DaoTao_HocPhan_Ten - DaoTao_HocPhan_Ma",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIANGVIENCOITHI_HODEM) + " " + edu.util.returnEmpty(aData.GIANGVIENCOITHI_TEN) + " - " + edu.util.returnEmpty(aData.GIANGVIENCOITHI_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIANGVIENPHANCOITHI_HODEM) + " " + edu.util.returnEmpty(aData.GIANGVIENPHANCOITHI_TEN) + " - " + edu.util.returnEmpty(aData.GIANGVIENPHANCOITHI_MA);
                    }
                },
                {
                    "mDataProp": "THI_DOTTHI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_ThoiGian_DST: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIVKS4oBiggLwIpICwVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSThoiGianChamThi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "THOIGIAN",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_ThoiGian_DST"],
                        type: "",
                        title: "Chọn thời gian",
                    })
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_DotThi_DST: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIFLjUVKSgCKSAsFSko',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotThiChamThi',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.loadToCombo_data({
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENDOTTHI",
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_DotThi_DST"],
                        type: "",
                        title: "Chọn đợt thi",
                    })
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_MonThi_DST: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIJLiIRKSAvAikgLBUpKAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSHocPhanChamThi',
            'iM': edu.system.iM,
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            code: "",
                            avatar: "",
                            mRender: function (nRow, aData) {
                                return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA)
                            }
                        },
                        renderPlace: ["dropSearch_MonThi_DST"],
                        type: "",
                        title: "Chọn môn thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_PhanGVCoiThi_DST: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIGKCAvJhcoJC8CKSAsFSko',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSGiangVienChamThi',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_DST'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "GIANGVIEN",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_PhanGVCoiThi_DST"],
                        type: "",
                        title: "Chọn được phân chấm thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_GVCoiThi_DST: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIPJjQuKBUpNCIJKCQvESkgLwIpICwVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSNguoiThucHienPhanChamThi',
            'iM': edu.system.iM,
            'strGiangVienCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi_DST'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_DST'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "GIANGVIEN",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_GVCoiThi_DST"],
                        type: "",
                        title: "Chọn giảng viên thực hiện phân chấm thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HinhThucThi_DST: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIJKC8pFSk0IhUpKAIpICwVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSHinhThucThiChamThi',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_DST'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENHINHTHUCTHI",
                            selectOne: true,
                            code: "",
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_HinhThuc_DST"],
                        type: "",
                        title: "Chọn hình thức thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_PhongThi_DST: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIRKS4vJhUpKAIpICwVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSPhongThiChamThi',
            'iM': edu.system.iM,
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc_DST'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_DST'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TENPHONGHOC",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_PhongThi_DST"],
                        type: "",
                        title: "Chọn phòng thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NgayThi_DST: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIPJiA4FSkoAikgLBUpKAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSNgayThiChamThi',
            'iM': edu.system.iM,
            'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi_DST'),
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc_DST'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_DST'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        data: data.Data,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "NGAYTHI",
                            code: "",
                            selectOne: true,
                            avatar: ""
                        },
                        renderPlace: ["dropSearch_NgayThi_DST"],
                        type: "",
                        title: "Chọn ngày thi",
                    };
                    edu.system.loadToCombo_data(obj);
                } else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
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
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ChamThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRISLhUpJC4FLigCKSAsFSko',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSSoTheoDoiChamThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_DST'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi_DST'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_MonThi_DST'),
            'strGVDuocPhanCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi_DST'),
            'strGVThucHienPhanCoiThi_Id': edu.system.getValById('dropSearch_GVCoiThi_DST'),
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc_DST'),
            'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi_DST'),
            'strNgayThi': edu.system.getValById('dropSearch_NgayThi_DST'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtChamThi = dtReRult;
                    me.genTable_ChamThi(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_ChamThi: function (data, iPager) {
        var me = this;
        $("#lblChamThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblChamThi",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_ChamThi()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "THI_DANHSACHTHI_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "THI_HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                {
                    "mDataProp": "THI_CATHI_TEN"
                },
                {
                    "mDataProp": "TKB_PHONGHOC_TEN"
                },
                {
                    "mDataProp": "SOSV"
                },
                {
                    //"mDataProp": "DaoTao_HocPhan_Ten - DaoTao_HocPhan_Ma",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIANGVIENCOITHI_HODEM) + " " + edu.util.returnEmpty(aData.GIANGVIENCOITHI_TEN) + " - " + edu.util.returnEmpty(aData.GIANGVIENCOITHI_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.GIANGVIENPHANCOITHI_HODEM) + " " + edu.util.returnEmpty(aData.GIANGVIENPHANCOITHI_TEN) + " - " + edu.util.returnEmpty(aData.GIANGVIENPHANCOITHI_MA);
                    }
                },
                {
                    "mDataProp": "THI_DOTTHI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },
}