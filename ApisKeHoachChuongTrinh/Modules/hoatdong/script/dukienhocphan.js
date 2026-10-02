/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function DuKienHocPhan() { };
DuKienHocPhan.prototype = {
    strDuKienHocPhan_Id: '',
    dtDuKienHocPhan: [],
    dtDoiTuong_View: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_CCTC();
        me.getList_ThoiGianDaoTao();
        me.getList_Nam();
        edu.extend.genBoLoc_HeKhoa("_CB");
        setTimeout(function () {
            edu.extend.genBoLoc_HeKhoa("_CT");
            edu.extend.genBoLoc_HeKhoa("_DV");
        }, 1000);
        edu.system.loadToCombo_DanhMucDuLieu("KH.PHANLOAI.TINHCHAT.SOLUONG", "dropSearch_PhanLoaiLop", "", data => {
            me["dtTinhChat"] = data;
            var html = '';
            data.forEach(aData => {
                let strName = aData.HESO3 == 1 ? "" : aData.TEN + "(Tăng/Giảm)";
                html += '<th class="td-center">' + aData.TEN + '</th><th class="td-center">' + strName + '</th>';
            })
            console.log(html);
            $("#tblHocPhanDuKien thead tr:eq(1)").append(html);
            document.getElementById("lblSLTheoTinhChat").colSpan = (data.length*2);
        });
        edu.system.loadToCombo_DanhMucDuLieu("KH.DAOTAO.HOCPHAN.XACNHAN", "", "", me.loadBtnXacNhan);
        //$("#dropSearch_LoaiXacNhan").on("select2:select", function () {
        //    me.getList_BtnXacNhan();
        //});
        $("#btnSearch").click(function () {
            me.getList_HocPhanDuKien();
            me.getList_HocPhanCT();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhanDuKien();
                me.getList_HocPhanCT();
            }
        });
        $("#btnAddHPTheoChuongTrinh").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneHocPhanChuongTrinh");
            me.getList_HocPhanCTDT();
        });
        $("#btnAddHPTheoDonVi").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneHocPhanDonVi");
            me.getList_HocPhanDV();
        });


        $("#btnSearch_DV").click(function () {
            me.getList_HocPhanDV();
        });
        $("#txtSearch_DV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhanDV();
            }
        });

        $("#btnSearch_CT").click(function () {
            me.getList_HocPhanCTDT();
        });
        $("#txtSearch_CT").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HocPhanCTDT();
            }
        });

        $("#btnSave_HocPhanDonVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblAddHocPhanDonVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var aData = me.dtHocPhanDV.find(e => e.ID == arrChecked_Id[i]);
                me.save_HocPhanDV(aData.DAOTAO_HOCPHAN_ID, aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
            }
        });

        $("#btnSave_HocPhanChuongTrinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblAddHocPhanChuongTrinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var aData = me.dtHocPhanCTDT.find(e => e.ID == arrChecked_Id[i]);
                me.save_HocPhanDV(aData.DAOTAO_HOCPHAN_ID, aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
            }
        });

        $("#btnLuuQuyMo").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblHocPhanDuKien tbody input.doituongcheck");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != edu.util.returnEmpty($(x[i]).attr("name"))) {
                    arrThem.push(x[i]);
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrXoa.length);

                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_QuyMo(arrThem[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnDelete_HocPhanDonVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanDuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HocPhanDuKien(arrChecked_Id[i]);
                }
            });
        });


        $("#btnDuyetDeXuat").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanKhoaDeXuat", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                //var aData = me.dtHocPhanDV.find(e => e.ID == arrChecked_Id[i]);
                me.save_HocPhanCT(arrChecked_Id[i]);
            }
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanDuKien", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanTN(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanDuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanTN(arrChecked_Id.toString(), "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhanTG").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanTG");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanDuKien", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanTG(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnXacNhanTG").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhanDuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhanTG").modal("show");

            //me.getList_XacNhanTG(arrChecked_Id.toString(), "tblModal_XacNhanTG");
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoachNam();
        });
        $("#dropSearch_KeHoachNam").on("select2:select", function () {
            me.getList_KeHoachCT();
        });

        $("#dropHeDaoTao_CT").on("select2:select", function () {
            me.getList_ThoiGianDaoTaoCT();
        });
        $("#dropKhoaDaoTao_CT").on("select2:select", function () {
            me.getList_ThoiGianDaoTaoCT();
        });
        $("#dropChuongTrinh_CT").on("select2:select", function () {
            me.getList_ThoiGianDaoTaoCT();
        });

        $("#dropHeDaoTao_DV").on("select2:select", function () {
            me.getList_ThoiGianDaoTaoDV();
        });
        $("#dropKhoaDaoTao_DV").on("select2:select", function () {
            me.getList_ThoiGianDaoTaoDV();
        });
        $("#dropChuongTrinh_DV").on("select2:select", function () {
            me.getList_ThoiGianDaoTaoDV();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_DKHP", function (addKeyValue) {
            var obj_list = {
                'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_CB'),
                'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropKhoaDaoTao_CB'),
                'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_CB'),
                'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropKhoaQuanLy_CB'),
                'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
                'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_Nam'),
                'strTuKhoa': edu.util.getValById('txtSearch'),
            };
            for (variable in obj_list) {
                addKeyValue(variable, obj_list[variable]);
            }
        });
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    save_QuyMo: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var aData = me.dtHocPhanDuKien.find(e => e.ID == arrId[1]);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4JLiIRKSAvHhA0OAwu',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_HocPhan_QuyMo',
            'iM': edu.system.iM,
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strPhanLoai_Id': arrId[2],
            'dTangGiam': $(point).val(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanDuKien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HocPhanDuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DuKien',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_CB'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgU0CigkLwPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': edu.system.getValById('dropKhoaQuanLy_CB'),
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHocPhanDuKien"] = dtReRult;
                    me.genTable_HocPhanDuKien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    genTable_HocPhanDuKien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanDuKien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanDuKien()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
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
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
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
                    "mDataProp": "KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "DINHHUONG_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                }
            ]
        };
        me.dtTinhChat.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<span id="lblTinhChat_' + aData.ID + '_' + main_doc.DuKienHocPhan.dtTinhChat[iThuTu].ID + '" ></span>';
                }
            },
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        let strstyle = main_doc.DuKienHocPhan.dtTinhChat[iThuTu].HESO3 == 1 ? "display: none" : "" ;
                        return '<input id="txtTinhChat_' + aData.ID + '_' + main_doc.DuKienHocPhan.dtTinhChat[iThuTu].ID + '" class="form-control doituongcheck" style="'+strstyle  +'" />';
                    }
                })
        })
        jsonForm.aoColumns.push(
            {
                "mDataProp": "TONGSOLUONGBANDAU"
            },
            {
                "mDataProp": "TONGSOLUONGTANGGIAM"
            },
            {
                "mDataProp": "TANGGIAMKHOADEXUAT"
            },
            {
                "mRender": function (nRow, aData) {
                    return aData.DUYETTANGGIAMKHOADEXUAT == "1"? "Duyệt" : "";
                }
            },
            {
                "mDataProp": "TONGSODUKIEN"
            },
            {
                "mDataProp": "NGUOITAO_TAIKHOAN"
            },
            {
                "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
            },
            {
                "mDataProp": "DEXUATTUKHOA"
            },
            {
                "mDataProp": "HANHDONG_TEN"
            },
            {
                "mDataProp": "HANHDONG_DAOTAO_TEN"
            },
            {
                "mRender": function (nRow, aData) {
                    return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                }
            }
        )
        edu.system.loadToTable_data(jsonForm);
        data.forEach(e => me.dtTinhChat.forEach(ele => me.getList_QuyMo(e, ele.ID)));

        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
        /*III. Callback*/
    },
    getList_QuyMo: function (aData, strPhanLoai_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIGKCAVMygQNDgMLhUpJC4VKC8pAikgNQPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSGiaTriQuyMoTheoTinhChat',
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strPhanLoai_Id': strPhanLoai_Id,
            'dLoaiQuyMo': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#lblTinhChat_" + aData.ID + "_" + strPhanLoai_Id).html(edu.util.returnEmpty(e.QUYMOBANDAU));
                        $("#txtTinhChat_" + aData.ID + "_" + strPhanLoai_Id).val(edu.util.returnEmpty(e.TANGGIAM));
                        $("#txtTinhChat_" + aData.ID + "_" + strPhanLoai_Id).attr("name", edu.util.returnEmpty(e.TANGGIAM));
                    })
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    delete_HocPhanDuKien: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KHCT_HoatDong_ThongTin/Xoa_KH_HocPhan_DuKien',

            'strId': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
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

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanDuKien();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_HocPhanCT: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/Them_KH_HocPhan_DuKien_DX',
            'type': 'POST',
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanCT();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HocPhanCT: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DeXuat',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_CB'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHocPhanCT"] = dtReRult;
                    me.genTable_HocPhanCT(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    genTable_HocPhanCT: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanKhoaDeXuat",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanCT()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
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
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
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
                    "mDataProp": "KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "DINHHUONG_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "DEXUATTUKHOA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_HocPhanDV: function (strDaoTao_HocPhan_Id, strPhamViApDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4JLiIRKSAvHgU0CigkLwPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_HocPhan_DuKien',
            'iM': edu.system.iM,
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanDV();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HocPhanDV: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgUuLxco',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DonVi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_DV'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_DonVi'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_DV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_DV'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao_DV'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_DV'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHocPhanDV"] = dtReRult;
                    me.genTable_HocPhanDV(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    genTable_HocPhanDV: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblAddHocPhanDonVi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanDV()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
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
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "DINHHUONG_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_HocPhanCTDT: function (strDaoTao_HocPhan_Id, strPhamViApDung_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4JLiIRKSAvHgU0CigkLwPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_HocPhan_DuKien',
            'iM': edu.system.iM,
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanCTDT();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HocPhanCTDT: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgIV',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_CT',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch_CT'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropKhoaQuanLy_CT'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CT'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian_CT'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHocPhanCTDT"] = dtReRult;
                    me.genTable_HocPhanCTDT(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    genTable_HocPhanCTDT: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblAddHocPhanChuongTrinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.DuKienHocPhan.getList_HocPhanCTDT()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
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
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "HOCTRINHAPDUNGHOCTAP"
                },
                {
                    "mDataProp": "KHOIKIENTHUC_TEN"
                },
                {
                    "mDataProp": "DINHHUONG_TEN"
                },
                {
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
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/

    getList_QuyMo2: function (strDaoTao_HocPhan_Id, strPhanLoaiLop_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/LayGiaTriKH_PhanLoai_HP_QuyMo',
            'type': 'POST',
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'dQuyMo': -1,
            'strNguoiThucHien_Id': edu.system.userId,
            //'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        $("#txtQuyMo_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id).val(aData.QUYMO);
                        $("#txtQuyMo_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id).attr("name", aData.QUYMO);
                    })
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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
    getList_HanhDong: function (strDaoTao_HocPhan_Id, strPhanLoaiLop_Id, strLoaiXacNhan_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/LayTTKH_PhanLoai_HP_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDuLieuXacNhan': strDaoTao_HocPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        $("#lblHanhDong_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id + "_" + strLoaiXacNhan_Id).html(edu.util.returnEmpty(aData.HANHDONG_TEN));
                    })
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
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

    /*------------------------------------------
    --Discription: [3] AccessDB QuyDinh
    --ULR:  Modules
    -------------------------------------------*/
    getList_CCTC: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonVi"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },


    loadBtnXacNhan: function (data) {
        main_doc.DuKienHocPhan.dtXacNhan = data;
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
    getList_BtnXacNhan: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/LayHanhDongXacNhanNguoiDung',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strLoaiXacNhan_Id': edu.util.getValById('dropSearch_LoaiXacNhan'),
            'iM': edu.system.iM,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadBtnXacNhan(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanTN: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan_MH/FSkkLB4KCR4FFR4JER4ZICIPKSAv',
            'func': 'PKG_KEHOACH_HOATDONG_XACNHAN.Them_KH_DT_HP_XacNhan',
            'iM': edu.system.iM,
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strHanhDong_Id': strTinhTrang_Id,
        };
        $("#modal_XacNhan").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanDuKien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanTN: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan_MH/DSA4BRIKCR4FFR4JER4ZICIPKSAv',
            'func': 'PKG_KEHOACH_HOATDONG_XACNHAN.LayDSKH_DT_HP_XacNhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strsanpham_Id': strHoSoDuTuyen_Id,
            'strLoaiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'strPhanLoaiLop_Id': edu.util.getValById('dropAAAA'),
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
                    me.genTable_XacNhanTN(data.Data, strTable_Id);
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

    genTable_XacNhanTN: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
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


    save_XacNhanTG: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/BTQ4JDUVIC8mBiggLAopLiAFJBk0IDUP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.DuyetTangGiamKhoaDeXuat',
            'iM': edu.system.iM,
            'strKH_HocPhan_DuKien_Id': strSanPham_Id,
            'dDuyetTangGiamKhoaDeXuat': strTinhTrang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        $("#modal_XacNhanTG").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhanDuKien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanTG: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan_MH/DSA4BRIKCR4RKSAvDS4gKB4ZICIPKSAv',
            'func': 'PKG_KEHOACH_HOATDONG_XACNHAN.LayDSKH_PhanLoai_XacNhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strHoSoDuTuyen_Id,
            'strLoaiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'strPhanLoaiLop_Id': edu.util.getValById('dropAAAA'),
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
                    me.genTable_XacNhanTG(data.Data, strTable_Id);
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

    genTable_XacNhanTG: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    "mDataProp": "NOIDUNG"
                },
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
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ThoiGianDaoTao(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_ThoiGianDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_ThoiGianDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDAOTAO_NAM_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 1000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_Nam: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung_MH/DSA4BRIPICwP',
            'func': 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSNam',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_Nam(data);
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
    genCombo_Nam: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAM",
            },
            renderPlace: ["dropNam", "dropSearch_Nam"],
            title: "Chọn Năm"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachNam: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweFS4vJgkuMQPP',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_TongHop',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strNam': edu.system.getValById('dropSearch_Nam'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KeHoachNam(data);
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
    genCombo_KeHoachNam: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoachNam"],
            title: "Chọn kế hoạch"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_KeHoachCT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_KeHoach_MH/DSA4BRIKCR4PICweAikoFSgkNRUpJC4P',
            'func': 'PKG_KEHOACH_HOATDONG_KEHOACH.LayDSKH_Nam_ChiTietTheo',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KeHoachCT(data);
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
    genCombo_KeHoachCT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_KeHoachChiTiet"],
            title: "Chọn kế hoạch chi tiết"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_ThoiGianDaoTaoCT: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung_MH/DSA4FSkuKAYoIC8VKSQuAhUFFQPP',
            'func': 'PKG_KEHOACH_HOATDONG_CHUNG.LayThoiGianTheoCTDT',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_CT'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropKhoaDaoTao_CT'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_CT'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_ThoiGianDaoTaoCT(data);
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
    genCombo_ThoiGianDaoTaoCT: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropThoiGian_CT"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGianDaoTaoDV: function () {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung_MH/DSA4FSkuKAYoIC8VKSQuAhUFFQPP',
            'func': 'PKG_KEHOACH_HOATDONG_CHUNG.LayThoiGianTheoCTDT',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDaoTao_CoCauToChuc_Id': edu.system.getValById('dropSearch_DonVi'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_DV'),
            'strDaoTao_KhoaDaoTao_Id': edu.system.getValById('dropKhoaDaoTao_DV'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.system.getValById('dropChuongTrinh_DV'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_ThoiGianDaoTaoDV(data);
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
    genCombo_ThoiGianDaoTaoDV: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao_DV"],
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
    },
    
}