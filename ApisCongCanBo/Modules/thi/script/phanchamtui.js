/*----------------------------------------------
--Author: 
--Phone:
--Date of created: 29/06/2018
--Input:
--Output:
--Note:
----------------------------------------------*/
function PhanChamTui() { };
PhanChamTui.prototype = {
    dtPhanChamTui: [],
    strPhanChamTui_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        //me.getList_PhanChamTui();
        me.getList_DotThi();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();
        me.getList_KhoaQuanLy();


        $("#btnSearch").click(function (e) {
            me.getList_PhanChamTui();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_PhanChamTui();
            }
        });

        $("#btnPhanChamTui").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhanChamTui", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_PhanChamTui").modal("show");
            me.strPhanChamTui_Id = arrChecked_Id.toString();
            me.getList_PhanCong();
        });
        $("#btnAddGiangVien").click(function () {
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                me.showPreview_ChonNhanSu(arrChecked_Id);
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

            //me.getList_PhanChamTui();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
            //me.getList_PhanChamTui();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            me.getList_DotPhach();
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            me.getList_DotPhach();
        });
        $('#dropSearch_DotPhach').on('select2:select', function (e) {

            me.getList_PhanChamTui();
        });
        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            //me.getList_PhanChamTui();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            //me.getList_PhanChamTui();
        });
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_MonThi();
        });
        $('#chkChuaPhanCong').on('change', function (e) {
            me.genTable_PhanChamTui(me.dtPhanChamTui, me.iPagerPhanChamTui);
        });
        $("#tblPhanChamTui").delegate(".btnEditNgayNhan", "blur", function () {
            var strId = this.id.split('_')[1];
            var strVal = $(this).val();
            console.log(strVal);
            me.save_NgayNhanBai(strId, strVal)
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
        this.getList_PhanChamTui();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_PhanChamTui: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIVNCgVKSQuBS41ESkgIikP',
            'func': 'pkg_thi_phancong.LayDSTuiTheoDotPhach',
            'iM': edu.system.iM,
            'strThi_DotPhach_Id': edu.util.getValById('dropSearch_DotPhach'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhanChamTui = dtReRult;
                    me.iPagerPhanChamTui = data.Pager;
                    me.genTable_PhanChamTui(dtReRult, data.Pager);
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
    genTable_PhanChamTui: function (data, iPager) {
        var me = this;
        if ($('#chkChuaPhanCong').is(':checked')) {
            data = (data || []).filter(function (r) { return edu.util.returnEmpty(r.DSNHANSUCHAMTHI).trim() === ''; });
        }
        $("#lblPhanChamTui_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhanChamTui",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_PhanChamTui()",
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
                    "mDataProp": "SOBAI"
                },
                {
                    "mDataProp": "DSLOP"
                }
                , {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtNgayNhanBai_' + aData.ID + '" style="padding-left: 10px" class="form-control btnEditNgayNhan" value="' + edu.util.returnEmpty(aData.NGAYNHANBAI) + '" />';
                    }
                },
                {
                    "mDataProp": "DSNHANSUCHAMTHI"
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
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
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
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
    getList_KhoaQuanLy: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    cbGenCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                order: "unorder"
            },
            renderPlace: ["dropSearch_KhoaQuanLy"],
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_DotPhach: function () {
        var me = this;
        //--Edit


        var obj_save = {
            'action': 'XLHV_TP_Chung_MH/DSA4BS41FSAuESkgIikP',
            'func': 'pkg_thi_phach_chung.LayDotTaoPhach',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_DotPhach(json);
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
    cbGenCombo_DotPhach: function (data) {
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
            renderPlace: ["dropSearch_DotPhach"],
            type: "",
            title: "Chọn đợt phách",
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_PhanCong: function () {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIPKSAvEjQRKSAvAi4vJgIpICwVKSgP',
            'func': 'pkg_thi_phancong.LayDSNhanSuPhanCongChamThi',
            'iM': edu.system.iM,
            'strDuLieuPhanCongChamThi_Id': me.strPhanChamTui_Id,
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
                strFuntionName: "main_doc.PhanChamTui.getList_PhanCong()",
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
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.STT);
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.SOLUONG);
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

    showPreview_ChonNhanSu: function (arrChecked_Id) {
        var me = this;
        if (!arrChecked_Id || arrChecked_Id.length === 0) {
            edu.system.alert("Vui lòng chọn nhân sự?");
            return;
        }
        var dt = edu.extend.dtNhanSu || [];
        var html = '<div class="text-start">';
        html += '<p class="mb-2"><b>Danh sách nhân sự sẽ phân chấm túi bài (' + arrChecked_Id.length + ')</b></p>';
        html += '<div class="aps-table-select" style="max-height:50vh;overflow:auto;">';
        html += '<table class="table table-bordered mb-0">';
        html += '<thead><tr><th class="text-center" style="width:50px">STT</th><th>Mã số</th><th>Họ tên</th><th class="text-center" style="width:100px">Thứ tự</th><th class="text-center" style="width:100px">Số lượng</th></tr></thead>';
        html += '<tbody>';
        for (var i = 0; i < arrChecked_Id.length; i++) {
            var id = arrChecked_Id[i];
            var ns = dt.find ? dt.find(function (e) { return e.ID == id; }) : null;
            var ma = ns ? edu.util.returnEmpty(ns.MASO) : '';
            var ten = ns ? edu.util.returnEmpty(ns.HOTEN) : '';
            html += '<tr>';
            html += '<td class="text-center">' + (i + 1) + '</td>';
            html += '<td>' + ma + '</td>';
            html += '<td>' + ten + '</td>';
            html += '<td><input type="number" min="1" class="form-control form-control-sm txtThuTu_PCT" id="txtThuTu_' + id + '" value="" /></td>';
            html += '<td><input type="number" min="1" class="form-control form-control-sm txtSoLuong_PCT" id="txtSoLuong_' + id + '" value="" /></td>';
            html += '</tr>';
        }
        html += '</tbody></table></div>';
        html += '</div>';
        edu.system.confirm(html, 'q');
        $("#btnYes").html('<i class="fas fa-save me-1"></i>Lưu');
        $("#btnYes").click(function (e) {
            var arrTuiId = (me.strPhanChamTui_Id || '').split(',');
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var staffId = arrChecked_Id[i];
                var thuTu = edu.util.returnEmpty($('#txtThuTu_' + staffId).val());
                var soLuong = edu.util.returnEmpty($('#txtSoLuong_' + staffId).val());
                var strDuLieu = arrTuiId.map(function (tuiId) {
                    return tuiId + ';' + thuTu + ';' + soLuong;
                }).join(',');
                me.save_PhanCong(staffId, strDuLieu);
            }
        });
    },

    save_PhanCong: function (strGiangVien_Id, strDuLieuOverride) {
        var me = this;
        //var aData = me.dtPhanGiangVien.find(e => e.ID == me.strPhanGiangVien_Id);
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/FSkkLB4VKSgeBiggLhcoJC8eAikgLBUpKAPP',
            'func': 'pkg_thi_phancong.Them_Thi_GiaoVien_ChamThi',
            'iM': edu.system.iM,
            'strDuLieuPhanCongChamThi_Id': strDuLieuOverride || me.strPhanChamTui_Id,
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
            'action': 'XLHV_TP_PhanCong_MH/GS4gHhUpKB4GKCAuFygkLx4CKSAsFSko',
            'func': 'pkg_thi_phancong.Xoa_Thi_GiaoVien_ChamThi',
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
}