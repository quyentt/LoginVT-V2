/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function MoLop() { };
MoLop.prototype = {
    strMoLop_Id: '',
    dtMoLop: [],
    dtDoiTuong_View: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_CCTC();
        edu.extend.genBoLoc_HeKhoa("_CB");
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KH.PHANLOAI.HOCPHAN.LOAILOP", "dropSearch_PhanLoaiLop", "", data => me["dtPhanLoaiLop"] = data);
        edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropSearch_LoaiXacNhan", "", data => me["dtPhanLoaiXN"] = data);
        $("#dropSearch_LoaiXacNhan").on("select2:select", function () {
            me.getList_BtnXacNhan();
        });
        $("#btnSearch").click(function () {
            me.getList_MoLop();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_MoLop();
            }
        });

        $("#btnLuuQuyMo").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblHocPhan tbody input.doituongcheck");
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

        $("#btnXoaHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HocPhan(arrChecked_Id[i]);
                }
            });
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanTN(arrChecked_Id[i], strTinhTrang, strMoTa);
            }
        });
        $("#btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanTN(arrChecked_Id.toString(), "tblModal_XacNhan");
        });


        $("#btnMoLop").click(function () {
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                me.save_TinhMoLop();
            });
        });
        $("#btnLayQuyMo").click(function () {
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                me.save_LayQuyMo();
            });
        });

        me.getList_Nam();

        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoachNam();
        });
        $("#dropSearch_KeHoachNam").on("select2:select", function () {
            me.getList_KeHoachCT();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_ML", function (addKeyValue) {
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
    save_QuyMo: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var aData = me.dtMoLop.find(e => e.ID == arrId[1]);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4RKSAvDS4gKB4MLg0uMR4QNDgMLgPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_PhanLoai_MoLop_QuyMo',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': arrId[2],
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'dQuyMo': $(point).val(),
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
                    me.getList_MoLop();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_MoLop: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgU0CigkLx4ZDwwN',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien_XNML',
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
                    me.dtMoLop = dtReRult;
                    me.genTable_MoLop(dtReRult, data.Pager);
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

    save_TinhMoLop: function () {
        var me = this;
        //var arrId = point.id.split("_");
        //var aData = me.dtMoLop.find(e => e.ID == arrId[1]);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_TinhToan_MH/FSgvKQ0uMQwuFSkkLhA0OAwu',
            'func': 'PKG_KEHOACH_HOATDONG_TINHTOAN.TinhLopMoTheoQuyMo',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_CB'),
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
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
            type: "POST",
            action: obj_save.action,
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_MoLop();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_LayQuyMo: function () {
        var me = this;
        //var arrId = point.id.split("_");
        //var aData = me.dtMoLop.find(e => e.ID == arrId[1]);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_TinhToan_MH/DSA4EDQ4DC4VNAISBQ0JLiIRKSAv',
            'func': 'PKG_KEHOACH_HOATDONG_TINHTOAN.LayQuyMoTuCSDLHocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_CB'),
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
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
            type: "POST",
            action: obj_save.action,
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_MoLop();
            //    });
            //},
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
    genTable_MoLop: function (data, iPager) {
        var me = this;
        var thead = '';
        var arrDoiTuong = me.dtPhanLoaiLop;
        var strDoiTuong_Id = edu.util.getValById("dropSearch_PhanLoaiLop");

        if (strDoiTuong_Id != "") {
            arrDoiTuong = me.dtPhanLoaiLop.filter(e => e.ID == strDoiTuong_Id);
        }
        me.dtDoiTuong_View = arrDoiTuong;

        thead += '<tr><th class="td-center" colspan="8">Thông tin học phần</th><th rowspan="2" class="td-center">Tổng nhu cầu học</th><th class="td-center" colspan="' + (me.dtDoiTuong_View.length * 2) + '">Quy mô</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center" colspan="' + me.dtPhanLoaiXN.length + '">' + aData.TEN + '</th>');
        thead += '<th class="td-center" rowspan="2"><input type="checkbox" class="chkSystemSelectAll" /></th></tr>';

        thead += '<tr><th class="td-fixed td-center">Stt</th><th class="td-center">Mã</th><th class="td-center">Tên</th><th class="td-center">Số tín chỉ</th><th class="td-center">Chuơng trình</th><th class="td-center">Khóa học</th><th class="td-center">Hệ đào tạo</th><th class="td-center">Khoa quản lý</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center">' + aData.TEN + '</th><th class="td-center">SL</th>');

        let temp = '';
        me.dtPhanLoaiXN.forEach(aData => temp += '<th class="td-center">' + aData.TEN + '</th>');
        me.dtDoiTuong_View.forEach(aData => thead += temp);
        thead += '<tr/>';
        $("#tblHocPhan thead").html(thead);

        $("#lblHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.MoLop.getList_MoLop()",
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
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAP_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "TONGSODUKIEN"
                }
            ]
        };
        me.dtDoiTuong_View.forEach(aData => {
            jsonForm.aoColumns.push({
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<input id="txtQuyMo_' + aData.ID + '_' + main_doc.MoLop.dtDoiTuong_View[iThuTu].ID + '" class="form-control doituongcheck" />';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span id="lblSoLuong_' + aData.ID + '_' + main_doc.MoLop.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            })
        })
        edu.system.icolumn = 0;
        me.dtDoiTuong_View.forEach(aData => {
            var iThuTu = edu.system.icolumn++;
            edu.system["icolumn2"] = 0;
            me.dtPhanLoaiXN.forEach(e => {
                jsonForm.aoColumns.push({
                    "mRender": function (nRow, aData) {
                        if (edu.system.icolumn2 = main_doc.MoLop.dtPhanLoaiXN.length) edu.system.icolumn2 = 0;
                        var iThuTu2 = edu.system.icolumn2++;
                        return '<span id="lblHanhDong_' + aData.ID + '_' + main_doc.MoLop.dtDoiTuong_View[iThuTu].ID + '_' + main_doc.MoLop.dtPhanLoaiXN[iThuTu2].ID + '" />';
                    }
                })
            })
        })
        jsonForm.aoColumns.push({
            "mRender": function (nRow, aData) {
                return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
            }
        })
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            me.dtDoiTuong_View.forEach(e => {
                me.getList_QuyMo(aData, e.ID);
                me.dtPhanLoaiXN.forEach(ele => {
                    me.getList_HanhDong(aData, e.ID, ele.ID);
                })
            })
        })
        edu.system.move_ThroughInTable(jsonForm.strTable_Id);
        /*III. Callback*/
    },

    getList_QuyMo: function (aData, strPhanLoaiLop_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BiggFTMoCgkeEQ0eDC4NLjEeFQkeEg0P',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayGiaTriKH_PL_MoLop_TH_SL',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strKh_Kehoach_HP_Dk_Th_Id': aData.ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#txtQuyMo_" + aData.ID + "_" + strPhanLoaiLop_Id).val(edu.util.returnEmpty(e.QUYMO));
                        $("#txtQuyMo_" + aData.ID + "_" + strPhanLoaiLop_Id).attr("name", edu.util.returnEmpty(e.QUYMO));
                        $("#lblSoLuong_" + aData.ID + "_" + strPhanLoaiLop_Id).html(edu.util.returnEmpty(e.SOLUONG));
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_MoLop();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_HanhDong: function (aData, strPhanLoaiLop_Id, strLoaiXacNhan_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan_MH/DSA4FRUKCR4RKSAvDS4gKB4MLg0uMR4ZICIPKSAv',
            'func': 'PKG_KEHOACH_HOATDONG_XACNHAN.LayTTKH_PhanLoai_MoLop_XacNhan',
            'iM': edu.system.iM,
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDuLieuXacNhan': aData.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#lblHanhDong_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id + "_" + strLoaiXacNhan_Id).html(edu.util.returnEmpty(e.HANHDONG_TEN));
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
        main_doc.MoLop.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fal fa-check-circle";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active">' + data[i].TEN + '</a>';
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
            data: obj_save,
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
        var aData = me.dtMoLop.find(e => e.ID == strSanPham_Id);
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_MoLop_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': edu.util.getValById('dropSearch_LoaiXacNhan'),
            'strHanhDong_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': aData.DAOTAO_HOCPHAN_ID,
            'strPhanLoaiLop_Id': edu.util.getValById('dropSearch_PhanLoaiLop'),
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
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

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanTN: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_MoLop_XacNhan',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strHoSoDuTuyen_Id,
            'strLoaiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
            'strPhanLoaiLop_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
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
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropSearch_ThoiGianDaoTao_DV"],
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
}