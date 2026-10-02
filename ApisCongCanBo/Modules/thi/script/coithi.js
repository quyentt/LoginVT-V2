/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function CoiThi() { };
CoiThi.prototype = {
    dtCoiThi: [],
    strCoiThi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        me.getList_CoiThi();


        $("#btnSearch").click(function (e) {
            me.getList_CoiThi();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_CoiThi();
            }
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
        this.getList_CoiThi();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
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
    getList_ThoiGian: function () {
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
                avatar: "",
                selectFirst: true,
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
            'action': 'XLHV_TP_PhanCong_SoTheoDoi_MH/DSA4BRIFLjUVKSgCLigVKSgP',
            'func': 'PKG_THI_PHANCONG_SOTHEODOI.LayDSDotThiCoiThi',
            'iM': edu.system.iM,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropSearch_ThoiGian'),
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