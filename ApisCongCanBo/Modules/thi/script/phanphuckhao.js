/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function PhanPhucKhao() { };
PhanPhucKhao.prototype = {
    dtPhanPhucKhao: [],
    strPhanPhucKhao_Id: '',

    init: function () { 
        var me = this;
        me.getList_ThoiGian();
        me.getList_HocPhan();
        me.getList_Khoa();
        me.getList_PhucKhao();
        edu.system.loadToCombo_DanhMucDuLieu("THI.PHUCKHAO.TINHTRANG", "dropSearch_KetQuaDuyet,dropLoaiXacNhan");
        $("#btnSearch").click(function (e) {
            me.getList_PhucKhao();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_PhucKhao();
            }
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            me.getList_HocPhan();
            me.getList_PhucKhao();
        });
        $('#dropSearch_HocPhan').on('select2:select', function (e) {
            me.getList_PhucKhao();
        });
        $('#dropSearch_Khoa').on('select2:select', function (e) {
            me.getList_PhucKhao();
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan(arrChecked_Id[i], strTinhTrang, strMoTa, "DUYETDANGKYPHUCKHAO");
            }
        });
        $("#btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhan(arrChecked_Id[0], "DUYETDANGKYPHUCKHAO", "tblModal_XacNhan")
        });

        edu.system.getList_MauImport("zonebtnBaoCao_PK", function (addKeyValue) {
            addKeyValue("strDaoTao_ThoiGianDaoTao_Id", edu.util.getValCombo("dropSearch_ThoiGian"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_HocPhan"));
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strPhucKhao_Id", e));
        });

        $("#btnPhanPhucKhao").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_PhanPhucKhao").modal("show");
            me.arrPhanPhucKhao_Id = arrChecked_Id;
            me.strPhanPhucKhao_Id = arrChecked_Id.toString();
            me.getList_PhanCong();
        });
        $("#btnAddGiangVien").click(function () {
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                var arrPhucKhao_Id = me.arrPhanPhucKhao_Id || [me.strPhanPhucKhao_Id];
                var iTotal = arrChecked_Id.length * arrPhucKhao_Id.length;
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", iTotal);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    for (var j = 0; j < arrPhucKhao_Id.length; j++) {
                        me.save_PhanCong(arrChecked_Id[i], arrPhucKhao_Id[j]);
                    }
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
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhan");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan(arrChecked_Id[i], strTinhTrang, strMoTa, "DUYETDANGKYPHUCKHAO");
            }
        });
        $(".btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng!");
                return;
            }
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhan(arrChecked_Id[0], "DUYETDANGKYPHUCKHAO", "tblModal_XacNhan")
        });
        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSThi", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_XacNhan(arrChecked_Id[i], strTinhTrang, strMoTa, "DUYETDANGKYPHUCKHAO");
            }
        });
        edu.system.getList_MauImport("zonebtnBaoCao_ChamThi", function (addKeyValue) {
            var obj_save = {
                'strTuKhoa': edu.system.getValById('txtSearch'),
                'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
                'strThi_DotThi_Id': edu.system.getValById('dropSearch_DotThi'),
                'strDaoTao_HocPhan_Id': edu.system.getValById('dropSearch_HocPhan'),
                'strGVDuocPhanCoiThi_Id': edu.system.getValById('dropSearch_PhanGVCoiThi'),
                'strGVThucHienPhanCoiThi_Id': edu.system.getValById('dropSearch_GVCoiThi'),
                'strThi_HinhThucThi_Id': edu.system.getValById('dropSearch_HinhThuc'),
                'strTKB_PhongThi_Id': edu.system.getValById('dropSearch_PhongThi'),
                'strNgayThi': edu.system.getValById('dropSearch_NgayThi'),
            };
            for (variable in obj_save) {
                addKeyValue(variable, obj_save[variable]);
            }
        });
    },

    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_PhanPhucKhao();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_PhucKhao: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhucKhao_MH/DSA4BRIVKSgRKTQiCikgLgPP',
            'func': 'pkg_thi_phach_phuckhao.LayDSThiPhucKhao',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_HocPhan'),
            'strNgayHetHanDangKy': edu.util.getValById('txtNgayHetHanDangKy'),
            'strNgayHetHanNopPhi': edu.util.getValById('txtNgayHetHanNopPhi'),
            'strTinhTrangNopPhi': edu.util.getValById('dropSearch_PhiPhucKhao'),
            'strTinhTrang_Duyet_Id': edu.util.getValById('dropSearch_KetQuaDuyet'),
            'dChuaCoTrangThaiDuyetNao': $('#dTrangThaiDuyet').is(":checked") ? 1 : 0,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    // Lọc theo khoa phía client
                    var strKhoa_Id = edu.util.getValById('dropSearch_Khoa');
                    if (strKhoa_Id) {
                        var strKhoa_Ten = $('#dropSearch_Khoa option:selected').text().trim();
                        dtReRult = dtReRult.filter(function (e) {
                            return edu.util.returnEmpty(e.DAOTAO_KHOAQUANLYSV_TEN).indexOf(strKhoa_Ten) !== -1
                                || edu.util.returnEmpty(e.DAOTAO_KHOAQUANLYHP_TEN).indexOf(strKhoa_Ten) !== -1;
                        });
                    }
                    me.dtNhapDiem = dtReRult;
                    me.genTable_PhucKhao(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_PhucKhao: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDSThi",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HODEM"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_EMAIL"
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLYSV_TEN",
                },
                {
                    "mDataProp": "TUI",
                },
                {
                    "mDataProp": "SOPHACH",
                },
                {
                    "mDataProp": "SOBAODANH",
                },
                {
                    "mDataProp": "CATHI_TEN",
                },
                {
                    "mDataProp": "PHONGTHI_TEN",
                },
                {
                    //"mDataProp": "Daotao_Hocphan_Ten - Daotao_Hocphan_Ma",
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA)
                    }
                },
                //{
                //    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                //},
                {
                    "mDataProp": "HINHTHUCTHI_TEN"
                },
                {
                    "mDataProp": "NGAYTHI"
                },
                //{
                //    "mDataProp": "CATHI_TEN"
                //},
                //{
                //    "mDataProp": "PHONGTHI_TEN"
                //},
                {
                    mRender: function (nRow, aData) {
                        var v = aData.DIEM;
                        if (v === null || v === undefined || v === "") return "";
                        var num = parseFloat(v);
                        if (isNaN(num)) return edu.util.returnEmpty(v);
                        return (Number.isInteger(num) ? num.toFixed(1) : num.toString()).replace(".", ",");
                    }
                },
                {
                    "mDataProp": "DSNHANSUCHAMTHIPK"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOAQUANLYHP_TEN"
                },
                {
                    "mDataProp": "NGAYXACNHANHOANTHANHDIEMTHI"
                },
                {
                    "mDataProp": "NGAYDANGKYPHUCKHAO"
                },
                {
                    "mDataProp": "NGAYHETHANDANGKYPHUCKHAO"
                },
                {
                    "mDataProp": "NGAYHETHANNOPPHIPHUCKHAO"
                },
                {
                    //"mDataProp": "PhiPhucKhao - TinhTrangNopPhi"
                    mRender: function (nRow, aData) {
                        return edu.util.returnEmpty(aData.PHIPHUCKHAO) + " - " + edu.util.returnEmpty(aData.TINHTRANGNOPPHI)
                    }
                },
                {
                    "mDataProp": "TINHTRANG_TEN"
                },
                {
                    mRender: function (nRow, aData) {
                        var v = aData.KETQUAPHUCKHAO;
                        if (v === null || v === undefined || v === "") return "";
                        var num = parseFloat(v);
                        if (isNaN(num)) return edu.util.returnEmpty(v);
                        return (Number.isInteger(num) ? num.toFixed(1) : num.toString()).replace(".", ",");
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
        var obj_list = {
            'action': 'TP_PhucKhao/LayThoiGianTheoDotThi',
            'type': 'GET',
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
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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

    getList_HocPhan: function (strId) {
        var me = this;
        //--Edit

        var obj_list = {
            'action': 'TP_PhucKhao/LayHocPhanPhucKhao',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genCombo_HocPhan(dtReRult);
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
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_HocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
        //$("#dropSearch_HocPhan").select2();
    },

    getList_Khoa: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy({}, "", "", me.genCombo_Khoa);
    },
    genCombo_Khoa: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropSearch_Khoa"],
            title: "Chọn khoa"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_PhanCong: function () {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIPKSAvEjQRKSAvAi4vJgIpICwVKSgRCgPP',
            'func': 'pkg_thi_phancong.LayDSNhanSuPhanCongChamThiPK',
            'iM': edu.system.iM,
            'strDuLieuPhanCongChamThi_Id': me.strPhanPhucKhao_Id,
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
                strFuntionName: "main_doc.PhanPhucKhao.getList_PhanCong()",
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

    save_PhanCong: function (strGiangVien_Id, strPhucKhao_Id) {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/FSkkLB4VKSgeBiggLhcoJC8eAikgLBUpKBEK',
            'func': 'pkg_thi_phancong.Them_Thi_GiaoVien_ChamThiPK',
            'iM': edu.system.iM,
            'strDuLieuPhanCongChamThi_Id': strPhucKhao_Id || me.strPhanPhucKhao_Id,
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
            'action': 'XLHV_TP_PhanCong_MH/GS4gHhUpKB4GKCAuFygkLx4CKSAsFSkoEQoP',
            'func': 'pkg_thi_phancong.Xoa_Thi_GiaoVien_ChamThiPK',
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
                    me.getList_PhucKhao();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NgayNhanBai: function (strThi_GV_ChamThi_Id, strNgayNhanBai) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/AiAxDykgNR4VKS4oBiggLw8pIC8DICgP',
            'func': 'pkg_thi_phancong.CapNhat_ThoiGianNhanBai',
            'iM': edu.system.iM,
            'strThi_GV_ChamThi_Id': strThi_GV_ChamThi_Id,
            'strNgayNhanBai': strNgayNhanBai,
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
                    edu.system.alert("Cập nhật thành công");
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    save_XacNhan: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan_Id) {
        var me = this;
        var obj_list = {
            'action': 'TP_PhucKhao/Them_Thi_PhucKhao_XacNhan',
            'type': 'POST',
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacNhan_Id': edu.system.userId,
            'strThongTinXacNhan': strNoiDung,
            'strDuLieuXacNhan': strSanPham_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhucKhao();
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhan: function (strDuLieuXacNhan, strLoaiXacNhan_Id, strTable_Id) {
        var me = this;
        var obj_save = {
            'action': 'TP_PhucKhao/LayDSThi_PhucKhao_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strDuLieuXacNhan,
            'strLoaiXacNhan_Id': strLoaiXacNhan_Id,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strTinhTrang_Id': edu.util.getValById('dropAAAA'),
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
                    me.genTable_XacNhan(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    genTable_XacNhan: function (data, strTable_Id) {
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
}