/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function PhanGiangVien() { };
PhanGiangVien.prototype = {
    strPhanGiangVien_Id: '',
    dtPhanGiangVien: [],
    dtDoiTuong_View: [],
    thead: '',

    init: function () {
        var me = this;
        //me.thead = $("#")
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.extend.genBoLoc_HeKhoa("_CB");
        me.getList_ThoiGianDaoTao();
        edu.system.loadToCombo_DanhMucDuLieu("KH.PHANLOAI.HOCPHAN.LOAILOP", "dropSearch_PhanLoaiLop", "", data => me["dtPhanLoaiLop"] = data);
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.PHANLOAIXACNHAN", "dropSearch_LoaiXacNhan", "", data => me["dtPhanLoaiXN"] = data);
        $("#dropSearch_ThoiGianDaoTao").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#dropHeDaoTao_CB").on("select2:select", function () {
            me.getList_HocPhan();
        });
        $("#btnSearch").click(function () {
            me.getList_PhanGiangVien();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_PhanGiangVien();
            }
        });

        $("#btnSave_GiangVien").click(function () {
            var arrThem = [];
            var arrXoa = [];
            var x = $("#tblPhanCong tbody input.doituongcheck");
            for (var i = 0; i < x.length; i++) {
                if ($(x[i]).val() != edu.util.returnEmpty($(x[i]).attr("name"))) {
                    arrThem.push(x[i]);
                    //if ($(x[i]).val()) {
                    //    arrThem.push(x[i]);
                    //} else {
                    //    arrXoa.push(x[i]);
                    //}
                }
            }
            if ((arrThem.length + arrXoa.length) > 0) {
                edu.system.confirm("Bạn có chắc chắn thêm " + arrThem.length + " và hủy " + arrXoa.length + "?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrThem.length + arrXoa.length);
                    
                    for (var i = 0; i < arrThem.length; i++) {
                        me.save_PhanCong(arrThem[i]);
                    }
                    for (var i = 0; i < arrXoa.length; i++) {
                        me.delete_PhanCong(arrXoa[i]);
                    }
                });
            }
            else {
                edu.system.alert("Không có thay đổi lưu");
            }
        });

        $("#btnDelete_GiangVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanCong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_PhanCong(arrChecked_Id[i]);
                }
            });
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblXacNhan", "checkX");
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


        $("#btnPhanGiangVien").click(function () {
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                me.save_TinhPhanGiangVien();
            });
        });
        $("#btnLayQuyMo").click(function () {
            edu.system.confirm("Bạn có chắc chắn thực hiện không?");
            $("#btnYes").click(function (e) {
                me.save_LayQuyMo();
            });
        });

        $("#tblHocPhan").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            $("#khoaphancong_giangvien").modal("show");
            var arrId = strId.split("_");
            me["strPhanGiangVien_Id"] = arrId[0];
            me["strPhanLoaiLop_Id"] = arrId[1];
            me.getList_PhanCong();
        });

        $("#btnAddGiangVien").click(function () {
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_GiangVien(arrChecked_Id[i]);
                }
            });
            $("#btnChonNhanSu").after('<input id="txtSearchModal_CauTrucGiang_NS" class="form-control" placeholder="Thông tin phân giảng" style="padding-left: 10px;width: 200px;">')
            edu.extend.getList_NhanSu();
        });
        me.getList_Nam();
        $("#dropSearch_Nam").on("select2:select", function () {
            me.getList_KeHoachNam();
        });
        $("#dropSearch_KeHoachNam").on("select2:select", function () {
            me.getList_KeHoachCT();
            me.getList_HocPhan();
        });
        $("#dropSearch_KeHoachChiTiet").on("select2:select", function () {
            me.getList_HocPhan();
        });

        edu.system.getList_MauImport("zonebtnBaoCao_PG", function (addKeyValue) {
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
    getList_PhanGiangVien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/LayDSKH_HocPhan_DuKien_PC',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4JLiIRKSAvHgU0CigkLx4RAgPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_HocPhan_DuKien_PC',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropAAAA'),
            'strDaoTao_HeDaoTao_Id': edu.system.getValById('dropHeDaoTao_CB'),
            'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
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
                    me.dtPhanGiangVien = dtReRult;
                    me.genTable_PhanGiangVien(dtReRult, data.Pager);
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

    save_TinhPhanGiangVien: function () {
        var me = this;
        //var arrId = point.id.split("_");
        //var aData = me.dtPhanGiangVien.find(e => e.ID == arrId[1]);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_TinhToan/TinhLopMoTheoQuyMo',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDaoTao_KhoaQuanLy_Id': edu.util.getValById('dropKhoaQuanLy_CB'),
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_PhanGiangVien();
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
    genTable_PhanGiangVien: function (data, iPager) {
        var me = this;
        var arrDoiTuong = me.dtPhanLoaiLop;
        var strDoiTuong_Id = edu.util.getValById("dropSearch_PhanLoaiLop");

        if (strDoiTuong_Id != "") {
            arrDoiTuong = me.dtPhanLoaiLop.filter(e => e.ID == strDoiTuong_Id);
        }
        me.dtDoiTuong_View = arrDoiTuong;

        var thead = '';
        thead += '<tr><th class="td-center" colspan="8">Thông tin học phần</th><th class="td-center" rowspan="3">Tổng nhu cầu học</th><th class="td-center" colspan="' + (me.dtDoiTuong_View.length*4) + '">Quy mô- số lớp mở-phân loại</th>';
       
        thead += '</tr>';
        //me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center" colspan="' + (me.dtPhanLoaiXN.length * 2) + '">' + aData.TEN + '</th>');
        thead += '<tr><th class="td-fixed td-center" rowspan="2">Stt</th>';
        thead += '<th class="td-center" rowspan="2">Mã</th>';
        thead += '<th class="td-center" rowspan="2">Tên</th>';
        thead += '<th class="td-center" rowspan="2">Số tín chỉ</th>';
        thead += '<th class="td-center" rowspan="2">Chương trình</th>';
        thead += '<th class="td-center" rowspan="2">Khóa học</th>';
        thead += '<th class="td-center" rowspan="2">Hệ đào tạo</th>';
        thead += '<th class="td-center" rowspan="2">Khoa quản lý</th>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center" colspan="4">' + aData.TEN + '</th>');
        thead += '<tr>';
        me.dtDoiTuong_View.forEach(aData => thead += '<th class="td-center">Quy mô</th><th class="td-center">Số lượng</th><th class="td-center">Phân loại</th><th class="td-center">Phân giảng</th>');
        thead += '</tr>';
        $("#tblHocPhan thead").html(thead);

        $("#lblHocPhan_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHocPhan",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhanGiangVien.getList_PhanGiangVien()",
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
                    return '<span id="lblQuyMo_' + aData.ID + '_' + main_doc.PhanGiangVien.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<span id="lblSoLuong_' + aData.ID + '_' + main_doc.PhanGiangVien.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn;
                    return '<span id="lblPhanLoai_' + aData.ID + '_' + main_doc.PhanGiangVien.dtDoiTuong_View[iThuTu].ID + '"></span>';
                }
            },
            {
                "mRender": function (nRow, aData) {
                    var iThuTu = edu.system.icolumn++;
                    return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '_' + main_doc.PhanGiangVien.dtDoiTuong_View[iThuTu].ID + '" title="Sửa">Chi tiết</a></span>';
                }
            })
        })
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            me.dtDoiTuong_View.forEach(e => {
                me.getList_QuyMo(aData, e.ID);
                me.getList_SoTiet(aData, e.ID);
                me.getList_HanhDong(aData, e.ID, "PHANLOAIHOCPHAN");
            })
        })
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
                        $("#lblQuyMo_" + aData.ID + "_" + strPhanLoaiLop_Id).html(edu.util.returnEmpty(e.QUYMO));
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_PhanGiangVien();
            //    });
            //},
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
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strPhanLoaiLop_Id': strPhanLoaiLop_Id,
            'strDuLieuXacNhan': aData.DAOTAO_HOCPHAN_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#lblPhanLoai_" + strDaoTao_HocPhan_Id + "_" + strPhanLoaiLop_Id + "_" + strLoaiXacNhan_Id).html(edu.util.returnEmpty(e.HANHDONG_TEN));
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

    getList_SoTiet: function (aData, strPhanLoaiLop_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BiggFTMoCgkeESkgLw0uICgeCREeEi4VKCQ1',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayGiaTriKH_PhanLoai_HP_SoTiet',
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
                        $("#" + aData.ID + "_" + strPhanLoaiLop_Id).html("Chi tiết - " + edu.util.returnEmpty(e.SOTIETPHANBO));
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_PhanGiangVien();
            //    });
            //},
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
        main_doc.PhanGiangVien.dtXacNhan = data;
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
        var aData = me.dtPhanGiangVien.find(e => e.ID == strSanPham_Id);
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan/Them_KH_PhanLoai_PhanGiangVien_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': edu.util.getValById('dropSearch_LoaiXacNhan'),
            'strHanhDong_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': aData.DAOTAO_HOCPHAN_ID,
            'strPhanLoaiLop_Id': edu.util.getValById('dropSearch_PhanLoaiLop'),
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strPhamViApDung_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
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
            'action': 'KHCT_HoatDong_XacNhan/LayDSKH_PhanLoai_PhanGiangVien_XacNhan',
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
                    me.genTable_XacNhan(data.Data, strTable_Id);
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
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung/LayDSThoiGian',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            //'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_ThoiGianDaoTao(dtReRult)
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


    getList_HocPhan: function (strDanhSach_Id) {
        var me = this;
        var obj_save = {
            'action': 'KHCT_HoatDong_Chung_MH/DSA4BRIJLiIRKSAvFSkkLgopLiACKTQ4JC8MLi8P',
            'func': 'PKG_KEHOACH_HOATDONG_CHUNG.LayDSHocPhanTheoKhoaChuyenMon',
            'iM': edu.system.iM,
            'strKH_Nam_TongHop_Id': edu.system.getValById('dropSearch_KeHoachNam'),
            'strKH_Nam_ChiTiet_Id': edu.system.getValById('dropSearch_KeHoachChiTiet'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult)
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                selectOne: true,
                mRender(nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + ' - ' + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_CauTruc: function () {
        var me = this;
        var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_XacNhan_MH/DSA4BRIKCR4CIDQVMzQiHhEpIC8NLiAoDS4x',
            'func': 'PKG_KEHOACH_HOATDONG_XACNHAN.LayDSKH_CauTruc_PhanLoaiLop',
            'iM': edu.system.iM,
            'strLoaiXacNhan_Id': "PHANLOAIHOCPHAN",
            'strPhamViApDung_Id': me.strPhanGiangVien_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strKh_Kehoach_HP_Dk_Th_Id': aData.ID,
            'strDuLieuXacNhan': aData.DAOTAO_HOCPHAN_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtCauTruc"] = dtReRult;
                    me.getList_PhanCong();
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

    getList_PhanCong: function () {
        var me = this;
        var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4RKSAvAi4vJh4GKCAvJhcoJC8P',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_PhanCong_GiangVien',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strPhamViApDung_Id': me.strPhanGiangVien_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strGiangVien_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/DSA4BRIKCR4RKSAvAi4vJh4GKCAvJhcoJC8eFQkP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.LayDSKH_PhanCong_GiangVien_TH',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strKh_Kehoach_HP_Dk_Th_Id': aData.ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strGiangVien_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhanCong"] = dtReRult;
                    me.genTable_PhanCong(dtReRult, data.Pager);
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
    genTable_PhanCong: function (data, iPager) {
        var me = this;
        var arrDoiTuong = me.dtCauTruc;
        //var strDoiTuong_Id = edu.util.getValById("dropSearch_PhanLoaiLop");

        //if (strDoiTuong_Id != "") {
        //    arrDoiTuong = me.dtPhanLoaiLop.filter(e => e.ID == strDoiTuong_Id);
        //}
        //me["dtPhanCong_View"] = arrDoiTuong;

        //var thead = '';
        //thead += '<tr><th class="td-fixed td-center">Stt</th>';
        //thead += '<th class="td-center" >Mã</th>';
        //thead += '<th class="td-center">Họ đệm</th>';
        //thead += '<th class="td-center">Tên</th>';
        //thead += '<th class="td-center">Đơn vị</th>';
        //me.dtPhanCong_View.forEach(aData => thead += '<th class="td-center" >' + aData.TEN + '</th>');
        //$("#tblPhanCong thead").html(thead);
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhanGiangVien.getList_PhanCong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "GIANGVIEN_MASO"
                },
                {
                    "mDataProp": "GIANGVIEN_HODEM"
                },
                {
                    "mDataProp": "GIANGVIEN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtGiaTri_' + aData.ID + '" class="form-control doituongcheck" value="' + edu.util.returnEmpty(aData.CAUTRUCTHONGTINPHANGIANG) + '" name="' + edu.util.returnEmpty(aData.CAUTRUCTHONGTINPHANGIANG) + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        //me.dtPhanCong_View.forEach(aData => {
        //    jsonForm.aoColumns.push({
        //        "mRender": function (nRow, aData) {
        //            var iThuTu = edu.system.icolumn++;
        //            return '<input id="txtGiaTri_' + aData.ID + '_' + main_doc.PhanGiangVien.dtPhanCong_View[iThuTu].ID + '" class="form-control" />';
        //        }
        //    })
        //})
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    getList_KetQuaPhanCong: function (strGiangVien_Id, strThanhPhan_Id) {
        var me = this;
        var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin/LayKetQuaThanhPhanPhanCong',
            'type': 'POST',
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strPhamViApDung_Id': me.strPhanGiangVien_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strGiangVien_Id': strGiangVien_Id,
            'strThanhPhan_Id': strThanhPhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(e => {
                        $("#txtGiaTri_" + strGiangVien_Id + "_" + strThanhPhan_Id).val(edu.util.returnEmpty(e.THANHPHAN_GIATRI));
                        $("#txtGiaTri_" + strGiangVien_Id + "_" + strThanhPhan_Id).attr("name", edu.util.returnEmpty(e.THANHPHAN_GIATRI));
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
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_PhanGiangVien();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_PhanCong: function (point) {
        var me = this;
        var arrId = point.id.split("_");
        var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4RKSAvAi4vJh4GKCAvJhcoJC8eFQkP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_PhanCong_GiangVien_TH',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strPhamViApDung_Id': me.strPhanGiangVien_Id,
            'strKh_Kehoach_HP_Dk_Th_Id': aData.ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strGiangVien_Id': arrId[1],
            'strThanhPhan_Id': arrId[2],
            'strThanhPhan_GiaTri': $(point).val(),
            'strCauTrucThongTinPhanGiang': $(point).val(),
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_PhanCong: function (strGiangVien_Id) {
        var me = this;
        var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/GS4gHgoJHhEpIC8CLi8mHgYoIC8mFygkLx4VCQPP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Xoa_KH_PhanCong_GiangVien_TH',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strPhamViApDung_Id': me.strPhanGiangVien_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKh_Kehoach_HP_Dk_Th_Id': aData.ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strGiangVien_Id': strGiangVien_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa thành công");
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
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    save_GiangVien: function (strGiangVien_Id) {
        var me = this;
        //var arrId = point.id.split("_");
        var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'KHCT_HoatDong_ThongTin_MH/FSkkLB4KCR4RKSAvAi4vJh4GKCAvJhcoJC8eFQkP',
            'func': 'PKG_KEHOACH_HOATDONG_THONGTIN.Them_KH_PhanCong_GiangVien_TH',
            'iM': edu.system.iM,
            'strPhanLoaiLop_Id': me.strPhanLoaiLop_Id,
            'strDaoTao_HocPhan_Id': aData.DAOTAO_HOCPHAN_ID,
            'strPhamViApDung_Id': me.strPhanGiangVien_Id,
            'strKh_Kehoach_HP_Dk_Th_Id': aData.ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strGiangVien_Id': strGiangVien_Id,
            'strKH_Nam_ChiTiet_Id': aData.KH_NAM_CHITIET_ID,
            'strCauTrucThongTinPhanGiang': edu.system.getValById('txtSearchModal_CauTrucGiang_NS'),
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhanCong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
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
                selectOne: true,
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
                selectOne: true,
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
                selectOne: true,
            },
            renderPlace: ["dropSearch_KeHoachChiTiet"],
            title: "Chọn kế hoạch chi tiết"
        };
        edu.system.loadToCombo_data(obj);
    },
}