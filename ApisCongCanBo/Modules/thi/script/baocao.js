/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function BaoCao() { };
BaoCao.prototype = {
    dtBaoCao: [],
    strBaoCao_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        //me.getList_BaoCao();
        me.getList_DotThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();
        me.getList_PhanLoai();


        $("#btnSearch").click(function (e) {
            me.getList_DotThi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DotThi();
            }
        });

        $("#btnBaoCao").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCao", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_BaoCao").modal("show");
            me.strBaoCao_Id = arrChecked_Id.toString();
            me.getList_PhanCong();
        });
        $("#btnAddGiangVien").click(function () {
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhanCong(arrChecked_Id[i]);
                }
            });
            edu.extend.getList_NhanSu();
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
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtNhapDiem_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            //me.getList_BaoCao();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
            //me.getList_BaoCao();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            //me.getList_BaoCao();
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            //me.getList_BaoCao();
        });
        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            //me.getList_BaoCao();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            //me.getList_BaoCao();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_BaoCao", function (addKeyValue) {
            var obj_save = {
                'strTuKhoa': edu.system.getValById('txtSearch'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
                'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
                'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
                'strGVDuocBaoCao_Id': edu.system.getValById('dropSearch_PhanGVCoiThi'),
                'strGVThucHienBaoCao_Id': edu.system.getValById('dropSearch_GVCoiThi'),
                'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc'),
                'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi'),
                'strNgayThi': edu.system.getValById('dropSearch_NgayThi'),
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCao", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strThi_DotThi_Id', e))
        });
        $("#btnSearchXN").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCao", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            me['arrXacNhan'] = arrChecked_Id;
            me['strLoaiXacNhan'] = "ChungChi";
            $("#modal_XacNhan").modal("show");

            me.getList_XacNhan(arrChecked_Id.toString(), "tblModal_XacNhan");
        });
        $("#btnDongYXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblBaoCao", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhanSanPham(arrChecked_Id[i], strTinhTrang, strMoTa, me.strLoaiXacNhan)
            }
        });

        $('#dropLoaiCongNhan').on('select2:select', function (e) {
            me.getList_TrangThaiXN();
            //me.getList_BaoCao();
        });
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_BaoCao();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_BaoCao: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIVKSgVKSQuBS41FSko',
            'func': 'pkg_thi_phancong.LayDSThiTheoDotThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dLocKhongHoanThanhNhapDiem': edu.util.getValById('dropSearch_HoanThanhNhapDiem'),
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtBaoCao = dtReRult;
                    me.genTable_BaoCao(dtReRult, data.Pager);
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
    genTable_BaoCao: function (data, iPager) {
        var me = this;
        $("#lblBaoCao_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblBaoCao",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_BaoCao()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DOTHOC"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
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

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_Chung_MH/DSA4FSkuKAYoIC8P',
            'func': 'pkg_thi_phach_chung.LayThoiGian',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
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
    cbGenCombo_ThoiGian: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "THOIGIAN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGian"],
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
            'action': 'XLHV_TP_Chung_MH/DSA4BS41FSko',
            'func': 'pkg_thi_phach_chung.LayDotThi',
            'iM': edu.system.iM,
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'dLanThi': edu.system.getValById('dropSearch_LanThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    //me.cbGenCombo_DotThi(json);
                    me.genTable_BaoCao(json);
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
                name: "TEN",
                code: "",
                avatar: ""
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
            'action': 'XLHV_TP_Chung_MH/DSA4CS4iESkgLwPP',
            'func': 'pkg_thi_phach_chung.LayHocPhan',
            'iM': edu.system.iM,
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
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
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA)
                }
            },
            renderPlace: ["dropSearch_MonThi"],
            type: "",
            title: "Chọn môn thi",
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_LoaiDiem: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_Chung_MH/DSA4DS4gKAUoJCwP',
            'func': 'pkg_thi_phach_chung.LayLoaiDiem',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LoaiDiem(json);
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
    cbGenCombo_LoaiDiem: function (data) {
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
            renderPlace: ["dropSearch_LoaiDiem"],
            type: "",
            title: "Chọn loại điểm",
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
            'action': 'XLHV_TP_Chung_MH/DSA4CSgvKRUpNCIVKSgP',
            'func': 'pkg_thi_phach_chung.LayHinhThucThi',
            'iM': edu.system.iM,
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
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
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_HinhThuc"],
            type: "",
            title: "Chọn hình thức thi",
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_PhanCong: function () {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIPKSAvEjQRKSAvAi4vJgIuKBUpKAPP',
            'func': 'pkg_thi_phancong.LayDSNhanSuPhanCongCoiThi',
            'iM': edu.system.iM,
            'strDuLieuPhanCongCoiThi_Id': me.strBaoCao_Id,
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
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.BaoCao.getList_PhanCong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "THONGTIN"
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

    save_PhanCong: function (strGiangVien_Id) {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/FSkkLB4VKSgeBiggLhcoJC8eAi4oFSko',
            'func': 'pkg_thi_phancong.Them_Thi_GiaoVien_CoiThi',
            'iM': edu.system.iM,
            'strDuLieuPhanCongCoiThi_Id': me.strBaoCao_Id,
            'strNhanSu_HoSoCanBo_v2_Id': strGiangVien_Id,
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
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/GS4gHhUpKB4GKCAuFygkLx4CLigVKSgP',
            'func': 'pkg_thi_phancong.Xoa_Thi_GiaoVien_CoiThi',
            'iM': edu.system.iM,
            'strId': strGiangVien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/FSkkLB4QDRUJCB4CLigVKSgeAikgLBUpKAPP',
            'func': 'PKG_THI_PHANCONG.Them_QLTHI_CoiThi_ChamThi',
            'iM': edu.system.iM,
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strPhanLoai_Id': edu.system.getValById('dropLoaiCongNhan'),
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
        $("#modal_XacNhan").modal('hide');
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

                    //me.strLoaiXacNhan == "BangDiem" ? me.getList_BangDiem_ChiTiet() : me.getList_ChungChi_ChiTiet();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIQDRUJCB4CLigVKSgeAikgLBUpKAPP',
            'func': 'PKG_THI_PHANCONG.LayDSQLTHI_CoiThi_ChamThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strsanpham_Id': strSanPham_Id,
            'strTinhTrang_Id': edu.system.getValById('dropAAAA'),
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.genTable_XacNhanSanPham(data.Data, data.Pager);
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
    genTable_XacNhanSanPham: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblModal_XacNhan",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DuyetChuyenDiem.getList_XacNhan()",
            //    iDataRow: iPager,
            //},
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


    getList_PhanLoai: function () {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIRKSAvDS4gKAIuKBUpKB4CKSAsFSko',
            'func': 'PKG_THI_PHANCONG.LayDSPhanLoaiCoiThi_ChamThi',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_PhanLoai(dtReRult, data.Pager);
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
    cbGenCombo_PhanLoai: function (data) {
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
            },
            renderPlace: ["dropLoaiCongNhan"],
            type: "",
            title: "Chọn phân loại",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_TrangThaiXN: function () {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIJIC8pBS4vJgIuKBUpKB4CKSAsFSko',
            'func': 'PKG_THI_PHANCONG.LayDSHanhDongCoiThi_ChamThi',
            'iM': edu.system.iM,
            'strPhanLoai_Id': edu.system.getValById('dropLoaiCongNhan'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_TrangThaiXN(dtReRult, data.Pager);
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
    cbGenCombo_TrangThaiXN: function (data) {
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
            },
            renderPlace: ["dropLoaiXacNhan"],
            type: "",
            title: "Chọn trạng thái",
        };
        edu.system.loadToCombo_data(obj);
    },
}