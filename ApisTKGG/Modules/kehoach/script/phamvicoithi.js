/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function PhamViCoiThi() { };
PhamViCoiThi.prototype = {
    strPhamViCoiThi_Id: '',
    dtPhamViCoiThi: [],
    dtChamThi: [],
    dtChamTui: [],

    init: function () {
        var me = this;
        me['strHead'] = $("#tblPhamViCoiThi thead").html();
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_PhamViCoiThi();
        me.getList_ThoiGian();
        me.getList_ThoiGian_CT();
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.DONVITINH.APPhamViCoiThi", "dropSearch_DonViTinh,dropDonViTinh");
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAI.DANHMUCAPPhamViCoiThi", "dropPhanLoai");

        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zonebatdau");
        });
        $("#btnAdd_PhamViCoiThi").click(function () {
            var data = {};
            edu.util.toggle_overide("zone-bus", "zoneEdit_CT");
        });
        $("#btnSave_PhamViCoiThi_CT").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCoiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_PhamViCoiThi_CT(arrChecked_Id[i]);
            }
        });
        

        $("#btnSearch").click(function () {
            me.getList_PhamViCoiThi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhamViCoiThi();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function () {
            me.getList_KeHoachTongHop();
        });
        $('#dropSearch_KeHoachTongHop').on('select2:select', function () {
            me.getList_KeHoachChiTiet();
        });
        $('#dropSearch_KeHoachChiTiet').on('select2:select', function () {
            me.getList_PhamViCoiThi();
        });

        $('#dropSearch_ThoiGian_CT').on('select2:select', function (e) {

            //me.getList_CoiThi();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_GVCoiThi();
            me.getList_PhanGVCoiThi();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_GVCoiThi();
            me.getList_PhanGVCoiThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            me.getList_HinhThucThi();
            me.getList_GVCoiThi();
            me.getList_PhanGVCoiThi();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_PhongThi();
            me.getList_NgayThi();
        });
        $('#dropSearch_PhongThi').on('select2:select', function (e) {
            me.getList_NgayThi();
        });
        $("#btnSearch_CT").click(function (e) {
            me.getList_CoiThi();
        });
        $("#txtSearch_CT").keypress(function (e) {
            if (e.which === 13) {
                me.getList_CoiThi();
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
    save_PhamViCoiThi_CT: function (strThi_TuiBai_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/FSkkLB4KDQYFHgU0DSgkNB4CLigVKSgP',
            'func': 'PKG_KLGV_V2_KEHOACH.Them_KLGD_DuLieu_CoiThi',
            'iM': edu.system.iM,
            'strKLGD_KeHoachChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strThi_DanhSachThi_Id': strThi_TuiBai_Id,
            'strMoTa': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'NS_KLGD_TinhTien_MH/EjQgHgoNBgUeBSAvKQw0IgAxBS4vBiggHgAl';
        //    obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApPhamViCoiThi_Ad'
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
                    me.getList_PhamViCoiThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_PhamViCoiThi_DST: function (strThi_TuiBai_Id) {
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
        //    obj_save.func = 'PKG_KLGV_V2_TINHTIEN.Sua_KLGD_DanhMucApPhamViCoiThi_Ad'
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
                    me.getList_PhamViCoiThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhamViCoiThi: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'NS_KLGD_KeHoach_MH/DSA4BRIKDQYFHgU0DSgkNB4CLigVKSgP',
            'func': 'PKG_KLGV_V2_KEHOACH.LayDSKLGD_DuLieu_CoiThi',
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
                    me["dtPhamViCoiThi"] = dtReRult;
                    me.genTable_PhamViCoiThi(dtReRult, data.Pager);
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
    genTable_PhamViCoiThi: function (data, iPager) {
        var me = this;
        $("#lblPhamViCoiThi_Tong").html(iPager);
        $("#tblPhamViCoiThi thead").html(me.strHead);
        var html = '';
        data.rsSoNguoiCoi.forEach(e => {
            html += '<th>' + edu.util.returnEmpty(e.TIEUDETENNGUOICHAM) + " " + edu.util.returnEmpty(e.STT) + '</th><th>' + edu.util.returnEmpty(e.TIEUDESOLUONG) + '</th>';
        })
        $("#tblPhamViCoiThi thead tr:eq(1)").append(html);
        document.getElementById("lblColSpan").colSpan = (data.rsSoNguoiCoi.length * 2);
        var jsonForm = {
            strTable_Id: "tblPhamViCoiThi",
            aaData: data.rs,
            bPaginate: {
                strFuntionName: "main_doc.PhamViCoiThi.getList_PhamViCoiThi()",
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
        me.dtPhamViCoiThi.rsSoNguoiCoi.forEach(e => {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn;
                        return '<a class="" id="lblTieuDe' + aData.ID + '_' + main_doc.PhamViCoiThi.dtPhamViCoiThi.rsSoNguoiCoi[iThuTu].STT + '" ></a>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<a class="" id="lblSoNguoi' + aData.ID + '_' + main_doc.PhamViCoiThi.dtPhamViCoiThi.rsSoNguoiCoi[iThuTu].STT + '" ></a>';
                    }
                }
            );
        });
        jsonForm.aoColumns.push(
            {
                "mDataProp": "KHOADULIEU"
            },
            {
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
            edu.system.genHTML_Progress("zoneprocessXXXX1", (data.rs.length * data.rsSoNguoiCoi.length));
            data.rs.forEach(e => me.dtPhamViCoiThi.rsSoNguoiCoi.forEach(ele => me.getData_NguoiCham(e, ele.STT)));
        } else {
            $("#tblPhamViCoiThi tfoot").html("");
        }
        /*III. Callback*/
    },
    getData_NguoiCham: function (e, str2) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NS_KLGD_ThongTin_MH/DSA4FRUPJjQuKAIuKBUpKBUpJC4P',
            'func': 'PKG_KLGV_V2_THONGTIN.LayTTNguoiCoiThiTheo',
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
                    me.dtPhamViCoiThi.rs.forEach(e => {
                        var iTong = 0;
                        me.dtPhamViCoiThi.rsSoNguoiCoi.forEach(ele => {
                            var check = $('#lblSoNguoi' + e.ID + "_" + ele.STT).text();
                            if (check) iTong += parseInt(check);
                        })
                        $('#lblTong' + e.ID).html(iTong);
                    })
                    var arr = [];
                    me.dtPhamViCoiThi.rsSoNguoiCoi.forEach((e, nRow) => arr.push((7 + 2 * nRow)));
                    arr.push((7 + 2 * me.dtPhamViCoiThi.rsSoNguoiCoi.length))
                    edu.system.insertSumAfterTable("tblPhamViCoiThi", arr);
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
    getList_CoiThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRISLhUpJC4FLigCLigVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSSoTheoDoiCoiThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
            'strGVDuocPhanCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi'),
            'strGVThucHienPhanCoiThi_Id': edu.system.getValById('dropSearch_GVCoiThi'),
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc'),
            'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi'),
            'strNgayThi': edu.system.getValById('dropSearch_NgayThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtCoiThi = dtReRult;
                    me.genTable_CoiThi(dtReRult, data.Pager);
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
    genTable_CoiThi: function (data, iPager) {
        var me = this;
        $("#lblCoiThi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblCoiThi",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_CoiThi()",
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

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian_CT: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIVKS4oBiggLwIuKBUpKAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSThoiGianCoiThi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian_CT(json);
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
    cbGenCombo_ThoiGian_CT: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: "",
                selectFirst: true,
            },
            renderPlace: ["dropSearch_ThoiGian_CT"],
            type: "",
            title: "Chọn thời gian",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DotThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIFLjUVKSgCLigVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotThiCoiThi',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotThi(json);
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
    cbGenCombo_DotThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENDOTTHI",
                code: "",
                avatar: "",
                selectOne: true,
            },
            renderPlace: ["dropSearch_DotThi"],
            type: "",
            title: "Chọn đợt thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_MonThi: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIJLiIRKSAvAi4oFSko',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSHocPhanCoiThi',
            'iM': edu.system.iM,
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MonThi(json);
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
    cbGenCombo_MonThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: "",
                selectOne: true,
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA)
                }
            },
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn học phần",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/

    getList_PhanGVCoiThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIGKCAvJhcoJC8CLigVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSGiangVienCoiThi',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_PhanGVCoiThi(json);
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
    cbGenCombo_PhanGVCoiThi: function (data) {
        var me = this;
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
            renderPlace: ["dropSearch_PhanGVCoiThi"],
            type: "",
            title: "Chọn được phân coi thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_GVCoiThi: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIPJjQuKBUpNCIJKCQvESkgLwIuKBUpKAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSNguoiThucHienPhanCoiThi',
            'iM': edu.system.iM,
            'strGiangVienCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_GVCoiThi(json);
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
    cbGenCombo_GVCoiThi: function (data) {
        var me = this;
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
            renderPlace: ["dropSearch_GVCoiThi"],
            type: "",
            title: "Chọn giảng viên thực hiện phân coi thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HinhThucThi: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIJKC8pFSk0IhUpKAIuKBUpKAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSHinhThucThiCoiThi',
            'iM': edu.system.iM,
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HinhThucThi(json);
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
    cbGenCombo_HinhThucThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHINHTHUCTHI",
                code: "",
                selectOne: true,
                avatar: ""
            },
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_PhongThi: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIRKS4vJhUpKAIuKBUpKAPP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSPhongThiCoiThi',
            'iM': edu.system.iM,
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_PhongThi(json);
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
    cbGenCombo_PhongThi: function (data) {
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
            renderPlace: ["TENPHONGHOC"],
            type: "",
            title: "Chọn phòng thi",
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_NgayThi: function () {
        var me = this;
        //--Edit

        var obj_save = {
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIPJiA4FSkoAi4oFSko',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSNgayThiCoiThi',
            'iM': edu.system.iM,
            'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi'),
            'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
            'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NgayThi(json);
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
    cbGenCombo_NgayThi: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NGAYTHI",
                code: "",
                selectOne: true,
                avatar: ""
            },
            renderPlace: ["dropSearch_NgayThi"],
            type: "",
            title: "Chọn ngày thi",
        };
        edu.system.loadToCombo_data(obj);
    }
    
}