/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function YeuCau() { };
YeuCau.prototype = {
    strYeuCau_Id: '',
    dtYeuCau: [],
    strSinhVien_Id: '',
    strChuongTrinh_Id: '',
    strXNYeuCau_Id: '',
    bAdd: true,

    init: function () {
        var me = this;
        me.strSinhVien_Id = edu.system.userId;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ChuongTrinhHoc();
        //edu.system.loadToCombo_DanhMucDuLieu("KLGD.HOATDONG", "dropSearch_HoatDong,dropHoatDong");
        //edu.system.loadToCombo_DanhMucDuLieu("KHCT.DDPG", "dropSearch_PhanLoai,dropPhanLoai");
        //edu.system.loadToCombo_DanhMucDuLieu("KHDT.PHANLOAIDOITUONGDAOTAO", "dropSearch_PhamVi,dropPhamVi");
        $("#tblYeuCau").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_YeuCau(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnXoaYeuCau").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblYeuCau", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_YeuCau(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSearch").click(function () {
            me.getList_YeuCau();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_YeuCau();
            }
        });

        $('#dropSearch_ChuongTrinh').on('change', function () {
            if (!edu.util.getValById('dropSearch_ChuongTrinh')) return;
            me.strChuongTrinh_Id = $('#dropSearch_ChuongTrinh').val();
            me.getList_YeuCau();
            me.getList_TTYeuCau();
        });

        //$('#dropSearch_YeuCau').on('change', function () {
        //    if (!edu.util.getValById('dropSearch_YeuCau')) return;
        //    me.strYeuCau_Id = $('#dropSearch_YeuCau').val();
        //    $(".lblGiayXacNhan").html($('#dropSearch_YeuCau option:selected').text())
        //    edu.util.toggle_overide("zone-bus", "zoneEdit");
        //    me.save_YeuCau();
        //    me.getList_CauTruc();
        //});
        $("#btnAddYeuCau").click(function () {
            me.strYeuCau_Id = $('#dropSearch_YeuCau').val();
            if (!me.strYeuCau_Id) {
                edu.system.alert("Vui lòng chọn dịch vụ!");
                return;
            }
            me.bAdd = true;
            me.strXNYeuCau_Id = "";
            $(".lblGiayXacNhan").html($('#dropSearch_YeuCau option:selected').text())
            edu.util.toggle_overide("zone-bus", "zoneEdit");
            me.save_YeuCau();
            me.getList_CauTruc();
        });
        $("#tblTinhTrang").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.bAdd = false;
            let aData = me.dtTinhTrang.find(e => e.ID == strId);
            me.strXNYeuCau_Id = strId;
            me.strYeuCau_Id = aData.YEUCAU_ID; 
            $("#modalTinhTrang").modal("hide");
            $(".lblGiayXacNhan").html(aData.YEUCAU_TEN)
            edu.util.toggle_overide("zone-bus", "zoneEdit");
            me.getList_CauTruc();
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        
        $(".btnTinhTrang").click(function () {
            var strLoai = $(this).attr("name");
            $("#modalTinhTrang").modal("show");
            me.getList_TinhTrang(strLoai)
        });

        $("#tblGiayXacNhan").delegate('.form-select', 'change', function (e) {
            me.save_KetQua(this.id.replace(/drop/g, ''), $(this).val());
        });
        $("#tblGiayXacNhan").delegate('.form-control', 'blur', function (e) {
            me.save_KetQua(this.id.replace(/txt/g, ''), $(this).val(), $(this).attr("name"));
        });
        $(".btnDelete_YeuCau").click(function () {
            me.delete_YeuCau();
        });
        $(".btnDelete_YeuCau2").click(function () {
            if (me.bAdd) me.delete_YeuCau();
        });

        $("#btnSave_YeuCau").click(function () {
            me.save_YeuCau(1);
        });

        $('#dropSearch_YeuCau').on('change', function () {
            if (!$('#dropSearch_YeuCau').val()) {
                me.viewForm_LoaiYeuCau({ MOTA: ""});
                return;
            }
            me.getList_LoaiYeuCau();
        });
        edu.system.uploadAvatar(['uploadPicture_HS'], "");

        $("#tblTinhTrang").delegate('.btnYKien', 'blur', function (e) {

            me.save_YKien(this.id, $(this).val());
        });
        $("#tblTinhTrang").delegate('.select-opt', 'change', function (e) {
            var temp = $(this);
            if (temp.val() != temp.attr("name")) me.save_DanhGia(this.id.replace(/dropDanhGia/g, ''), $(this).val());
        });

    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
    },
    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strYeuCau_Id = "";
        edu.util.viewValById("dropKhoanThu", edu.util.getValById("dropSearch_KhoanThu"));
        edu.util.viewValById("dropDoiTac", edu.util.getValById("dropSearch_DoiTac"));
        edu.util.viewValById("dropHinhThuc", edu.util.getValById("dropSearch_HinhThuc"));
        //edu.util.viewValById("dropPhamVi", edu.util.getValById("dropSearch_PhamVi"));
        //edu.util.viewValById("dropMoHinhHoc", edu.util.getValById("dropSearch_MoHinhHoc"));
        edu.util.viewValById("txtTKNo", "");
        edu.util.viewValById("txtTKCo", "");
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> thoi gian dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_TTYeuCau: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_YeuCau_MH/DSA4FRUVLi8mCS4xBRcMAh4YJDQCIDQeDykgLwPP',
            'func': 'pkg_dvmc_yeucau.LayTTTongHopDVMC_YeuCau_Nhan',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genTable_TTYeuCau(data);
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
    genTable_TTYeuCau: function (data) {
        var me = this;
        var aData = data.length ? data[0] : {};
        $("#btnTongYeuCau").html(edu.util.returnEmpty(aData.TONGSOYEUCAUDAGUI))
        $("#btnDaXuLy").html(edu.util.returnEmpty(aData.TONGSOYEUCAUDADUOCXULY))
        $("#btnDangXuLy").html(edu.util.returnEmpty(aData.TONGSOYEUCAUDANGXULY))
        $("#btnBoSung").html(edu.util.returnEmpty(aData.TONGSOYEUCAUCANHOANTHIEN))
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_YeuCau: function (dHanhDong) {
        var me = this;
        if (dHanhDong == undefined) dHanhDong = 0;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_YeuCau_MH/FSkkLB4FFwwCHhgkNAIgNB4PKSAv',
            'func': 'pkg_dvmc_yeucau.Them_DVMC_YeuCau_Nhan',
            'iM': edu.system.iM,
            'strId': me.strXNYeuCau_Id,
            'dHanhDong': dHanhDong,
            'strDiaChiNhanMongMuon': edu.util.getValById('txtDiaChi'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId) {
                        var strThongBao = "Gửi yêu cầu thành công";
                        var aThongBao = me.dtYeuCau.find(e => e.ID == me.strYeuCau_Id);
                        if (aThongBao && aThongBao.THONGBAOKHIDANGKYTHANHCONG) strThongBao = aThongBao.THONGBAOKHIDANGKYTHANHCONG;
                        edu.system.alert(strThongBao);
                        me.toggle_form();
                        me.getList_TTYeuCau();
                    }
                    me.strXNYeuCau_Id = data.Id
                }
                else {
                    obj_notify = {
                        type: "w",
                        content:  data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_YeuCau: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRIYJDQCIDQVKSQuESkgLBco',
            'func': 'pkg_dvmc_chung.LayDSYeuCauTheoPhamVi',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtYeuCau = dtReRult;
                    me.genCombo_YeuCau(dtReRult, data.Pager);
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
    delete_YeuCau: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_YeuCau_MH/GS4gHgUXDAIeGCQ0AiA0Hg8pIC8P',
            'func': 'pkg_dvmc_yeucau.Xoa_DVMC_YeuCau_Nhan',
            'iM': edu.system.iM,
            'strId': me.strXNYeuCau_Id,
            'strDiaChiNhanMongMuon': edu.util.getValById('txtDiaChi'),
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //obj = {
                    //    title: "",
                    //    content: "Xóa dữ liệu thành công!",
                    //    code: ""
                    //};
                    //edu.system.afterComfirm(obj);
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
                    me.getList_YeuCau();
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
    genCombo_YeuCau: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_YeuCau"],
            title: "Chọn yêu cầu"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_YeuCau: function (data, iPager) {
        $("#lblYeuCau_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblYeuCau",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.YeuCau.getList_YeuCau()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 3, 7, 8],
                //right: [5]
            },
            aoColumns: [

                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + " - " + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_MA);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HINHTHUCTHU_TEN) + " - " + edu.util.returnEmpty(aData.HINHTHUCTHU_MA);
                    }
                },
                {
                    "mDataProp": "API_DOITAC_TEN"
                },
                {
                    "mDataProp": "KETOAN_YeuCau"
                },
                {
                    "mDataProp": "KETOAN_TAIKHOANCO"
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
    viewForm_YeuCau: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtYeuCau.find(e => e.ID == strId);
        me.popup();
        //view data --Edit
        //edu.util.viewHTMLById("lblKhoaDaoTao_Add", data.DAOTAO_KHOADAOTAO_MAKHOA);
        //edu.util.viewHTMLById("lblChuongTrinh_Add", edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_CHUONGTRINH_MA));

        edu.util.viewValById("dropKhoanThu", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("dropDoiTac", data.API_DOITAC_ID);
        edu.util.viewValById("dropHinhThuc", data.HINHTHUCTHU_ID);
        edu.util.viewValById("txtTKNo", data.KETOAN_YeuCau);
        edu.util.viewValById("txtTKCo", data.KETOAN_TAIKHOANCO);
        me.strYeuCau_Id = data.ID;
    },

    getList_ChuongTrinhHoc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_ThongTin_MH/DSA4FSkuLyYVKC8CKTQuLyYVMygvKQkuIgPP',
            'func': 'pkg_congthongtin_hssv_thongtin.LayThongTinChuongTrinhHoc',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,//edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_ChuongTrinhHoc(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er), "w");

            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ChuongTrinhHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "DAOTAO_TOCHUCCHUONGTRINH_ID",
                parentId: "",
                name: "DAOTAO_CHUONGTRINH_TEN",
            },
            renderPlace: ["dropSearch_ChuongTrinh"],
            title: "Chọn chương trình"
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_ChuongTrinh", data[0].DAOTAO_TOCHUCCHUONGTRINH_ID);
        }
        if (data.length > 2) {
            $("#dropSearch_ChuongTrinh").parent().parent().show();
        } else {
            $("#dropSearch_ChuongTrinh").parent().parent().hide();
        }
    },
    
    getList_CauTruc: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRICIDQVMzQiHhgkNAIgNAPP',
            'func': 'pkg_dvmc_chung.LayDSCauTruc_YeuCau',
            'iM': edu.system.iM,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genTable_CauTruc(data.rsCauTrucYeuCau);
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
    genTable_CauTruc: function (data) {
        var me = this;
        var html = '';
        var arrInput = [];
        data.forEach(aData => {
            if (aData.NOIDUNG && aData.NOIDUNG.indexOf('<div') == 0) {
                html += aData.NOIDUNG;
            } else {
                html += '<div style="width: 100%"><div class="live-doc-input">' + aData.NOIDUNG + '</div></div>';
            }
            let arrIndex = getAllIndexes(aData.NOIDUNG, '@');
            for (let i = 0; i < arrIndex.length; i += 2) {
                arrInput.push(aData.NOIDUNG.substring(arrIndex[i], arrIndex[i + 1] + 1));
            }
        });
        arrInput.forEach(aData => {
            let arrTemp = aData.replace(/@/g, '').split('-');
            let htmlreplace = '';
            let strBatBuoc = arrTemp[3];
            let strKichThuoc = arrTemp[6];
            let strDoRong = aData.KICHTHUOC;
            let strStyle = "";
            console.log(arrTemp);
            if (strBatBuoc == "1") strBatBuoc = '<span style="color: red;font-size: 13px">(*)</span>';
            if (strKichThuoc) strKichThuoc = 'width: ' + strKichThuoc + 'px;';
            if (strDoRong) strKichThuoc = 'margin: bottom: ' + strDoRong + 'px;';
            strStyle = strKichThuoc + strDoRong;

            switch (arrTemp[1]) {
                case 'TEXT': htmlreplace = '&nbsp;' + strBatBuoc +'<input class="form-control" id="txt' + arrTemp[0] + '" style="' + strStyle +'" />'; break;
                case 'LIST': htmlreplace = '&nbsp;' + strBatBuoc +'<div style="' + strStyle +'"><select class="form-select" id="drop' + arrTemp[0] + '" aria-label="Default select example"></select><div>'; break;
                   
            }
            html = html.replace(aData, htmlreplace);
        });
        $("#tblGiayXacNhan").html(html);
        arrInput.forEach(aData => {
            let arrTemp = aData.replace(/@/g, '').split('-');
            me.getList_KetQua(arrTemp);
            //switch (arrTemp[1]) {
            //    case 'TEXT': htmlreplace = '<input class="form-control" id="txtInput' + arrTemp[0] + '" />'; break;
            //    case 'LIST': htmlreplace = '<select class="form-select" id="drop' + arrTemp[0] + '" aria-label="Default select example"></select>'; break;

            //}
        });
        function getAllIndexes(str, char) {
            let indexes = [];
            for (let i = 0; i < str.length; i++) {
                if (str[i] === char) {
                    indexes.push(i);
                }
            }
            return indexes;
        }
    },
    
    getList_LoaiYeuCau: function () {
        var me = this;
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/DSA4FRUFFwwCHhgkNAI0HgwuFSAP',
            'func': 'pkg_dvmc_thongtin.LayTTDVMC_YeuCu_MoTa',
            'iM': edu.system.iM,
            'strYeuCau_Id': edu.util.getValById('dropSearch_YeuCau'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    let aData = {};
                    if (data.length) aData = data[0];
                    me.viewForm_LoaiYeuCau(aData);
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
    viewForm_LoaiYeuCau: function (data) {
        var me = this;
        var strDownLoad = data.DUONGDANMAUDON ? data.DUONGDANMAUDON: "";
        if (strDownLoad) {
            if (strDownLoad.indexOf(',')) strDownLoad = strDownLoad.split(',')[0];
            strDownLoad = strDownLoad ? '<a style="float: right;" class="pointer" id="lblDownload" href="' + edu.system.rootPathUpload + '/' + strDownLoad + '"><i class="fa fa-cloud-download"></i> Tải file</a>' : '';
        }
        edu.util.viewHTMLById("txtTieuDe", data.TIEUDE + strDownLoad);
        edu.util.viewHTMLById("txtMoTa", data.MOTA.replace(/\n/g, '<br/>'));
        edu.util.viewValById("txtDiaChiTraVe", data.DIACHITRAYEUCAU);
        edu.util.viewValById("txtPhongBan", data.DIACHITRAYEUCAU);
        edu.util.viewValById("uploadPicture_HS", data.HINHANHMINHHOA);
        var strAnh = edu.system.getRootPathImg(edu.util.returnEmpty(data.HINHANHMINHHOA), constant.setting.EnumImageType.ACCOUNT);
        $("#srcuploadPicture_HS").attr("src", strAnh);
        edu.system.viewFiles("txtFileDindKem", edu.util.getValById('dropSearch_YeuCau'), "SV_Files");
    },
    
    getList_TinhTrang: function (strPhanLoaiYeuCau) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_YeuCau_MH/DSA4BRIFFwwCHhgkNAIgNB4PKSAv',
            'func': 'pkg_dvmc_yeucau.LayDSDVMC_YeuCau_Nhan',
            'iM': edu.system.iM,
            'strPhanLoaiYeuCau': strPhanLoaiYeuCau,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtTinhTrang"] = dtReRult;
                    me.genTable_TinhTrang(dtReRult, data.Pager);
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
    genTable_TinhTrang: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTinhTrang",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.YeuCau.getList_YeuCau()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0,6,7],
                right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Mã yêu cầu:</em><span>' + edu.util.returnEmpty(aData.MAYEUCAU) + '</span>';
                    }
                    //"mDataProp": "MAYEUCAU"
                },
                {
                    //"mDataProp": "YEUCAU_TEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Yêu cầu:</em><span>' + edu.util.returnEmpty(aData.YEUCAU_TEN) + '</span>';
                    }
                },
                {
                    //"mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Thời gian:</em><span>' + edu.util.returnEmpty(aData.NGAYTAO_DD_MM_YYYY_HHMMSS) + '</span>';
                    }
                },
                {
                    //"mDataProp": "TINHTRANGXULY_THOIGIAN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Tình trạng:</em><span>' + edu.util.returnEmpty(aData.TINHTRANGXULY_THOIGIAN) + '</span>';
                    }
                },
                {
                    //"mDataProp": "THOIGIANHOANTHANHDUKIEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Hoàn thành:</em><span>' + edu.util.returnEmpty(aData.THOIGIANHOANTHANHDUKIEN) + '</span>';
                    }
                },
                {
                    //"mDataProp": "SOTIEN",
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Số tiền:</em><span>' + edu.util.returnEmpty(aData.SOTIEN) + '</span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Sửa:</em><span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Xem:</em><span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Hài lòng:</em><select class="select-opt" id="dropDanhGia' + aData.ID + '"></select>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<em class="show-in-mobi">Ý kiến:</em><input class="form-control btnYKien" id="' + aData.ID + '" style="margin-left: 10px" value="' + edu.util.returnEmpty(aData.YKIENKHAC) + '" name="' + edu.util.returnEmpty(aData.YKIENKHAC) + '">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        data.forEach(aData => {
            me.getList_DanhGia(aData)
        })
        $(".select-opt").select2();
        /*III. Callback*/
    },
    
    save_KetQua: function (strTruongThongTin_Id, strTruongThongTin_GiaTri) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/FSkkLB4FFwwCHgIgNBUzNCIeGAIeBTQNKCQ0',
            'func': 'pkg_dvmc_thongtin.Them_DVMC_CauTruc_YC_DuLieu',
            'iM': edu.system.iM,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strTruongThongTin_Id': strTruongThongTin_Id,
            'strTruongThongTin_GiaTri': strTruongThongTin_GiaTri,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDVMC_YeuCau_Nhan_Id': me.strXNYeuCau_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.strXNYeuCau_Id = data.Id
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KetQua: function (arrTemp) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/DSA4FRUFFwwCHgIgNBUzNCIeGAIeBTQNKCQ0',
            'func': 'pkg_dvmc_thongtin.LayTTDVMC_CauTruc_YC_DuLieu',
            'iM': edu.system.iM,
            'strYeuCau_Id': me.strYeuCau_Id,
            'strTruongThongTin_Id': arrTemp[0],
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDVMC_YeuCau_Nhan_Id': me.strXNYeuCau_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtReRult.forEach(aData => {
                        switch (arrTemp[1]) {
                            case 'TEXT': $("#txt" + arrTemp[0]).val(edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI)); $("#txt" + arrTemp[0]).attr("name", edu.util.returnEmpty(aData.TRUONGTHONGTIN_GIATRI)); break;
                            case 'LIST': edu.system.loadToCombo_DanhMucDuLieu(arrTemp[2], "dropDanhGia" + arrTemp[0], "", "", "", "", aData.TRUONGTHONGTIN_GIATRI);  break;
                        }
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

    getList_DanhGia: function (aData) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_Chung_MH/DSA4BRIFIC8pBiggFSkkLhEpICwXKAPP',
            'func': 'pkg_dvmc_chung.LayDSDanhGiaTheoPhamVi',
            'iM': edu.system.iM,
            'strDVMC_YeuCau_Nhan_Id': aData.ID,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var strDefalt_val = "";
                    if (dtReRult.rsKetQuaDanhGia.length) strDefalt_val = dtReRult.rsKetQuaDanhGia[0].DANHGIA_ID;
                    $("#dropDanhGia" + aData.ID).attr("name", strDefalt_val);
                    var obj = {
                        data: dtReRult.rsDanhMucDanhGia,
                        renderInfor: {
                            id: "ID",
                            parentId: "",
                            name: "TEN",
                            default_val: strDefalt_val
                        },
                        renderPlace: ["dropDanhGia" + aData.ID],
                        title: "Chọn đánh giá"
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
    save_DanhGia: function (strDVMC_YeuCau_Nhan_Id, strDanhGia_Id) {
        var me = this;
        var obj_notify = {};
        let aData = me.dtTinhTrang.find(e => e.ID == strDVMC_YeuCau_Nhan_Id);
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_ThongTin_MH/FSkkLB4FFwwCHgUgLykGKCAeGAIeBTQNKCQ0',
            'func': 'pkg_dvmc_thongtin.Them_DVMC_DanhGia_YC_DuLieu',
            'iM': edu.system.iM,
            'strYeuCau_Id': aData.YEUCAU_ID,
            'strDanhGia_Id': strDanhGia_Id,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strDVMC_YeuCau_Nhan_Id': strDVMC_YeuCau_Nhan_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.strXNYeuCau_Id = data.Id
                }
                else {
                    obj_notify = {
                        type: "w",
                        content:  data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_YKien: function (strId, strYKienKhac) {
        var me = this;
        var obj_notify = {};
        let aData = me.dtTinhTrang.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'SV_DVMC_YeuCau_MH/EjQgHhgKKCQvHgUXDAIeGCQ0AiA0Hg8pIC8P',
            'func': 'pkg_dvmc_yeucau.Sua_YKien_DVMC_YeuCau_Nhan',
            'iM': edu.system.iM,
            'strId': strId,
            'strYKienKhac': strYKienKhac,
            'strQLSV_NguoiHoc_Id': me.strSinhVien_Id,
            'strDaoTao_ChuongTrinh_Id': me.strChuongTrinh_Id,
            'strYeuCau_Id': aData.YEUCAU_ID,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'TC_KeToan_MH/EjQgHgARCB4KJBUuIC8eCikuIC8eCRUP';
        //    obj_save.func = 'pkg_taichinh_ketoan.Sua_API_KeToan_Khoan_HT'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    //me.strXNYeuCau_Id = data.Id
                }
                else {
                    obj_notify = {
                        type: "w",
                        content:  data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
}