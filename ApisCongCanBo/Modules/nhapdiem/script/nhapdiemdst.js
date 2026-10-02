/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function NhapDiem() { };
NhapDiem.prototype = {
    dtTuiBai: [],
    dtNhapDiem: [],
    strNhapDiem_Id: '',
    strTuiBai_Id: '',
    strLoaiXacNhan: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        me.getList_ThoiGian();
        //me.getList_TuiBai();
        me.getList_DotThi();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();
        me.getList_TinhTrang();

        $("#btnSearch").click(function (e) {
            me.getList_TuiBai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_TuiBai();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_NhapDiem").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_NhapDiem();
            }
        });
        $("[id$=chkSelectAll_NhapDiem]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNhapDiem" });
        });
        $("[id$=chkSelectAll]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTuiThi" });
        });
        $("[id$=chkSelectAll_TuiThi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTuiThi" });
        });
        $("#tblNhapDiem").delegate('.btn-toggle-lophp', 'click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var $btn = $(this);
            var $wrap = $btn.closest('.cell-lophp-wrap');
            var expanded = $btn.attr('data-expanded') === '1';
            if (expanded) {
                $wrap.find('.lophp-short').show();
                $wrap.find('.lophp-full').hide();
                $btn.attr('data-expanded', '0').html('<i class="fal fa-angle-down"></i> Xem thêm');
            } else {
                $wrap.find('.lophp-short').hide();
                $wrap.find('.lophp-full').show();
                $btn.attr('data-expanded', '1').html('<i class="fal fa-angle-up"></i> Thu gọn');
            }
        });
        $("#tblNhapDiem").delegate('.btnExportDST', 'click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            me.exportExcel_DST(edu.util.cutPrefixId(/export/g, this.id), $(this));
        });
        $("#tblNhapDiem").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            $("#nhapdiem").modal("show");
            strId = edu.util.cutPrefixId(/edit/g, strId);
            me.strTuiBai_Id = strId;
            edu.util.setOne_BgRow(strId, "tblNhapDiem");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtTuiBai, "ID")[0];
                me.viewEdit_NhapDiem(data);
                me.getList_NhapDiem();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#btnSave_TuiThi").click(function () {
            var arrChecked_Id = [];

            me.dtNhapDiem.forEach(e => {
                var pointDiem = $("#txtDiem" + e.ID);
                var pointSoPhach = $("#txtSoPhach" + e.ID);
                if (pointDiem.val() != pointDiem.attr("name") || pointSoPhach.val() != pointSoPhach.attr("name")) arrChecked_Id.push(e.ID);
            });
            if (arrChecked_Id.length > 0) {

                edu.system.confirm("Bạn có chắc chắn lưu " + arrChecked_Id.length + " dữ liệu không?");
                $("#btnYes").click(function (e) {
                    edu.system.alert('<div id="zoneprocessXXXX"></div>');
                    edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                    for (var i = 0; i < arrChecked_Id.length; i++) {
                        me.save_NhapDiem(arrChecked_Id[i]);
                    }
                });
            }
        });


        $("#tblTuiBai").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
            edu.util.setOne_BgRow(strId, "tblNhapDiem");
            if (edu.util.checkValue(strId)) {
                me.getList_TuiThi();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtNhapDiem_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        

        $('#dropSearch_DSThi').on('select2:select', function (e) {
            me.getList_NhapDiem();
            //me.getList_TuiBai();
        });
        $('#dropSearch_ThoiGian').on('select2:select', function (e) {

            //me.getList_TuiBai();
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_LoaiDiem();
            //me.getList_TuiBai();
        });
        $('#dropSearch_DotThi').on('select2:select', function (e) {

            //me.getList_TuiBai();
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            me.getList_TuiBai();
        });

        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            me.getList_TuiBai();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_TuiBai();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_NhapDiem", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_MonThi"));
            addKeyValue("strDanhSachThi_Id", main_doc.NhapDiem.strTuiBai_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });

        $("#btnCongBo").click(function () {
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMTHI";
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }

            $("#modal_XacNhan").modal("show");

            me.getList_XacNhanSanPham(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });



        $("#btnXacNhanTuiThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }

            $("#modal_XacNhanTinhTrang").modal("show");
            
        });
        

        $("#btnDongYXacNhan").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhan");
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            if (me.strLoaiXacNhan == "XACNHAN_CONGBODIEM_THI") {
                me.save_XacNhanSanPham(me.strTuiBai_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
            } else {
                var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
                arrChecked_Id.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan));
            }
        });
        $("#btnDongYXacNhanTinhTrang").click(function () {
            var strTinhTrang = edu.util.getValById("dropLoaiXacNhanTinhTrang");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTuiThi", "checkX");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                //var objSinhVien = me.dtTuiBai.find(e => e.ID === arrChecked_Id[i]).IDDANHSACHTHI;
                var objTemp = me.dtNhapDiem.find(e => e.ID === arrChecked_Id[i]);
                me.save_XacNhanTinhTrang(objTemp.QLSV_NGUOIHOC_ID + objTemp.IDDANHSACHTHI, strTinhTrang, "");
            }
        });


        $(".btnCongBo").click(function () {
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Công bố");
            me.strLoaiXacNhan = "XACNHAN_CONGBODIEM_THI";
            me.getList_XacNhanSanPham(me.strTuiBai_Id, "tblModal_XacNhan", null, 'XACNHAN_CONGBODIEM_THI');
            me.getList_XacNhan(me.strTuiBai_Id, "tblModal_XacNhan", null, 'XACNHAN_CONGBODIEM_THI');
        });

        $("#tblTuiThi").delegate('.he10', 'change', function () {
            var temp = parseInt(this.value);
            let tlength = ("" + temp).length;
            if (Number.isInteger(temp) && temp > 10) {
                if (temp % 100 == 0) this.value = 10;
                else {
                    temp = Math.round(temp / Math.pow(10, tlength - 2)) / 10;
                    this.value = temp
                }
            }
        });
    },
    
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_TuiBai();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_TuiBai: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSThiTheoDotThi',
            'type': 'GET',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtTuiBai = dtReRult;
                    me.genTable_TuiBai(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_TuiBai: function (data, iPager) {
        var me = this;
        $("#lblTuiBai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblNhapDiem",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_TuiBai()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class=" btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.MADANHSACHTHI) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        var strLopHP = edu.util.returnEmpty(aData.THONGTINLOPHOCPHAN);
                        var maxLen = 80;
                        if (strLopHP.length <= maxLen) {
                            return '<span><a class=" btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="Chi tiết">' + strLopHP + '</a></span>';
                        }
                        var shortText = strLopHP.substring(0, maxLen) + '...';
                        return '<div class="cell-lophp-wrap">' +
                            '<a class="btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="' + strLopHP.replace(/"/g, '&quot;') + '">' +
                                '<span class="lophp-short">' + shortText + '</span>' +
                                '<span class="lophp-full" style="display:none">' + strLopHP + '</span>' +
                            '</a>' +
                            ' <a class="btn-toggle-lophp" style="color:#0d6efd;cursor:pointer;font-size:12px;white-space:nowrap;margin-left:5px" data-expanded="0"><i class="fal fa-angle-down"></i> Xem thêm</a>' +
                        '</div>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.NGAYTHI) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.THI_CATHI_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btnEdit" style="text-decoration: underline;font-style: italic; color: green; cursor: pointer" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.TKB_PHONGTHI_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.XACNHANHOANTHANHDIEMTHI == 1 ? "Đã xác nhận" : "";
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return me.genHTML_BtnExportDST(aData);
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        if ($("#btnCongBo").length == 0) {
            var jsonForm = {
                strTable_Id: "tblNhapDiem",

                //bPaginate: {
                //    strFuntionName: "main_doc.NhapDiem.getList_TuiBai()",
                //    iDataRow: iPager,
                //},
                aaData: data,
                colPos: {
                    center: [0],
                },
                aoColumns: [
                    //{
                    //    "mDataProp": "MA"
                    //},
                    {
                        "mDataProp": "MADANHSACHTHI",
                    },
                    {
                        "mDataProp": "THONGTINLOPHOCPHAN"
                    },
                    {
                        "mDataProp": "NGAYTHI",
                    },
                    {
                        "mDataProp": "THI_CATHI_TEN",
                    },
                    {
                        "mDataProp": "TKB_PHONGTHI_TEN",
                    },
                    {
                        "mDataProp": "TEN",
                        "mRender": function (nRow, aData) {
                            return aData.XACNHANHOANTHANHDIEMTHI == 1 ? "Đã xác nhận" : "";
                        }
                    },
                    {
                        "mRender": function (nRow, aData) {
                            return me.genHTML_BtnExportDST(aData);
                        }
                    }
                    , {
                        "mRender": function (nRow, aData) {
                            return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                        }
                    }
                ]
            };
        }
        edu.system.loadToTable_data(jsonForm);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_NhapDiem: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSNguoiHocTheoDST',
            'type': 'GET',
            'strDanhSachThi_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNhapDiem = dtReRult;
                    me.genTable_NhapDiem(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(JSON.stringify(er), "w");
            },
            type: obj_list.type,
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_NhapDiem: function (strId) {
        var me = this;
        //--Edit
        var objNhapDiem = me.dtNhapDiem.find(e => e.ID == strId);

        var obj_save = {
            'action': 'TP_XuLy/CapNhat_DiemPhachTheoDST',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strUngDung_Id': edu.system.appId,
            'strNguoiThucHien_Id': edu.system.userId,
            'strThi_DanhSachSinhVien_Id': strId,
            'strDiem': edu.util.getValById('txtDiem' + strId),
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhapDiem_Id = "";
                    
                    edu.system.alert("Thực hiện thành công!");

                }
                else {
                    edu.system.alert(data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("XLHV_NhapDiem/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: "POST",

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NhapDiem();
                });
            },
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_NhapDiem: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_list = {
            'action': 'TP_DotPhach/Xoa',
            'type': 'POST',
            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_NhapDiem();
                }
                else {
                    obj = {
                        content: "TN_KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "TN_KeHoach/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: obj_list.type,
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_NhapDiem: function (data, iPager) {
        var me = this;
        $("#lblNhapDiem_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblTuiThi",

            //bPaginate: {
            //    strFuntionName: "main_doc.NhapDiem.getList_NhapDiem()",
            //    iDataRow: iPager,
            //},
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
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "SOBAODANH"
                },
                //{
                //    "mRender": function (nRow, aData) {
                //        return '<input id="txtSoPhach' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.SOPHACH) + '" name="' + edu.util.returnEmpty(aData.SOPHACH) + '" />';
                //    }
                //},
                {
                    "mRender": function (nRow, aData) {
                        if (aData.CAMTHI_DUYETDKTHI == "1" || aData.CAMTHI_VIPHAMQUYCHE == "1") return '';
                        return '<input id="txtDiem' + aData.ID + '" class="form-control he' + aData.THANGDIEM + '" style="padding-left: 10px" value="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" name="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" />';
                    }
                },
                {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                    
                },
                {
                    "mDataProp": "TRANGTHAI"
                }, {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        edu.system.move_ThroughInTable("tblTuiThi")
    },
    viewEdit_NhapDiem: function (data) {
        var me = this;
        //View - Thong tin
        $("#lblTenDot").html(edu.util.returnEmpty(data.MADANHSACHTHI) + " - " + edu.util.returnEmpty(data.NGAYTHI) + " - " + edu.util.returnEmpty(data.THI_CATHI_TEN) + " - " + edu.util.returnEmpty(data.TKB_PHONGTHI_TEN));

    },

    /*------------------------------------------
    --Discription: Xuất Excel người học theo từng danh sách thi (nút trên mỗi dòng tblNhapDiem)
    --Nguồn: TP_Chung/LayDSNguoiHocTheoDST (gọi riêng, không đụng me.dtNhapDiem / me.strTuiBai_Id)
    --Lib: XLSX (SheetJS) - load lazy từ CDN khi bấm lần đầu
    -------------------------------------------*/
    genHTML_BtnExportDST: function (aData) {
        return '<div class="text-center"><a class="btnExportDST" id="export' + aData.ID + '" title="Xuất Excel danh sách thi" style="color: #1d6f42; cursor: pointer; font-size: 18px"><i class="fa-solid fa-file-excel"></i></a></div>';
    },
    loadLib_XLSX: function (callback) {
        if (typeof XLSX !== 'undefined') { callback(); return; }
        var cdnList = [
            'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
            'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js',
            'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
        ];
        var i = 0;
        function tryNext() {
            if (i >= cdnList.length) {
                edu.system.alert('Không tải được thư viện Excel. Vui lòng kiểm tra kết nối mạng và thử lại.', 'w');
                return;
            }
            var s = document.createElement('script');
            s.src = cdnList[i]; s.crossOrigin = 'anonymous';
            s.onload = function () { callback(); };
            s.onerror = function () { i++; tryNext(); };
            document.head.appendChild(s);
        }
        tryNext();
    },
    exportExcel_DST: function (strDanhSachThi_Id, $btn) {
        var me = this;
        var objDST = edu.util.objGetDataInData(strDanhSachThi_Id, me.dtTuiBai, "ID")[0];
        if (!objDST) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            return;
        }
        if ($btn.attr("data-loading") === "1") return;
        var strIconOld = $btn.html();
        $btn.attr("data-loading", "1").html('<i class="fa-solid fa-spinner fa-spin"></i>');
        var done = function () { $btn.attr("data-loading", "0").html(strIconOld); };

        me.loadLib_XLSX(function () {
            var obj_list = {
                'action': 'TP_Chung/LayDSNguoiHocTheoDST',
                'type': 'GET',
                'strDanhSachThi_Id': strDanhSachThi_Id,
                'strNguoiThucHien_Id': edu.system.userId,
            };
            edu.system.makeRequest({
                success: function (data) {
                    if (data.Success) {
                        var dtNguoiHoc = data.Data || [];
                        if (!dtNguoiHoc.length) {
                            edu.system.alert("Danh sách thi chưa có người học.", "w");
                            return;
                        }
                        me.writeExcel_DST(objDST, dtNguoiHoc);
                    }
                    else {
                        edu.system.alert(data.Message, "w");
                    }
                },
                error: function (er) {
                    edu.system.alert(JSON.stringify(er), "w");
                },
                complete: done,
                type: obj_list.type,
                action: obj_list.action,

                contentType: true,
                data: obj_list,
                fakedb: [

                ]
            }, false, false, false, null);
        });
    },
    writeExcel_DST: function (objDST, dtNguoiHoc) {
        var v = edu.util.returnEmpty;
        var arrHeader = ['STT', 'Mã số', 'Họ đệm', 'Tên', 'Lớp quản lý', 'Điểm thành phần', 'Lần học', 'Lần thi', 'Số báo danh', 'Điểm', 'Lớp đăng ký học', 'Tình trạng'];
        var aoa = [
            ['DANH SÁCH THI: ' + v(objDST.MADANHSACHTHI)],
            ['Lớp học phần: ' + v(objDST.THONGTINLOPHOCPHAN)],
            ['Ngày thi: ' + v(objDST.NGAYTHI) + '    Ca thi: ' + v(objDST.THI_CATHI_TEN) + '    Phòng thi: ' + v(objDST.TKB_PHONGTHI_TEN)],
            [],
            arrHeader
        ];
        var iHeaderRow = aoa.length - 1;
        dtNguoiHoc.forEach(function (e, i) {
            aoa.push([
                i + 1,
                v(e.QLSV_NGUOIHOC_MASO),
                v(e.QLSV_NGUOIHOC_HODEM),
                v(e.QLSV_NGUOIHOC_TEN),
                v(e.DAOTAO_LOPQUANLY_TEN),
                v(e.DIEM_THANHPHANDIEM_TEN),
                v(e.LANHOC),
                v(e.LANTHI),
                v(e.SOBAODANH),
                v(e.DIEMBANDAU),
                v(e.DIEM_DANHSACHHOC_TEN),
                v(e.TRANGTHAI)
            ]);
        });

        var ws = XLSX.utils.aoa_to_sheet(aoa);
        // Các dòng thông tin trộn ngang bằng bề rộng bảng
        ws['!merges'] = [0, 1, 2].map(function (r) {
            return { s: { r: r, c: 0 }, e: { r: r, c: arrHeader.length - 1 } };
        });
        ws['!cols'] = arrHeader.map(function (h, c) {
            var maxLen = h.length;
            for (var r = iHeaderRow + 1; r < aoa.length; r++) {
                var l = String(aoa[r][c] == null ? '' : aoa[r][c]).length;
                if (l > maxLen) maxLen = l;
            }
            return { wch: Math.min(maxLen + 2, 50) };
        });

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách thi');
        // MADANHSACHTHI có dấu "/" (VD AET3283_28/09/2026_1_1_154954) → thay ký tự cấm trong tên file
        var strTen = v(objDST.MADANHSACHTHI).replace(/[\\\/:*?"<>|]/g, '-') || 'DanhSachThi';
        XLSX.writeFile(wb, 'DSThi_' + strTen + '.xlsx');
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_TuiThi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayDSTuiTheoDotPhach',
            'type': 'GET',
            'strThi_DotPhach_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_TuiThi(dtReRult, data.Pager);
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
    genTable_TuiThi: function (data, iPager, strThi_DotPhach_Id) {
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
            renderPlace: ["dropSearch_DSThi"],
            type: "",
            title: "Chọn danh sách thi",
        };
        edu.system.loadToCombo_data(obj);
        if (data.length > 0) {
            edu.util.viewValById("dropSearch_DSThi", data[0].ID);
            me.getList_NhapDiem();
        }
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayThoiGian',
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
                avatar: "",
                selectFirst: true
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
        var obj_list = {
            'action': 'TP_Chung/LayDotThi',
            'type': 'GET',
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGian'),
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
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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

        var obj_list = {
            'action': 'TP_Chung/LayHocPhan',
            'type': 'GET',
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
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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
        var obj_list = {
            'action': 'TP_Chung/LayLoaiDiem',
            'type': 'GET',
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
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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

        var obj_list = {
            'action': 'TP_Chung/LayHinhThucThi',
            'type': 'GET',
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
            type: obj_list.type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
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

    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhan: function (data) {
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
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'D_XacNhan/Them_Diem_XacNhan',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
            'strHanhDong_Id': strTinhTrang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strThongTinXacNhan': strNoiDung,

            'strNguoiXacNhan_Id': edu.system.userId,
            'strDuLieuXacNhan': strSanPham_Id,
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

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDiem_DanhSachHoc_Id': strSanPham_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (typeof (callback) == "function") {
                    callback(data.Data);
                }
                else {
                    me.loadBtnXacNhan(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_XacNhan/LayDSDiem_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDuLieuXacNhan': strSanPham_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiXacNhan_Id': edu.util.getValById('dropAAAA'),
            'strHanhDong_Id': edu.util.getValById('dropAAAA'),
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
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_XacNhanSanPham: function (data, strTable_Id) {
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data,
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                //{
                //    "mDataProp": "NOIDUNG"
                //},
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

    getList_TinhTrang: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TP_Chung/LayTrangThaiSauThi',
            'type': 'GET',
            'strNguoiDung_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhanTinhTrang(data.Data)

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
    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    loadBtnXacNhanTinhTrang: function (data) {
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
            renderPlace: ["dropLoaiXacNhanTinhTrang"],
            type: "",
            title: "Chọn xác nhận"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    /*----------------------------------------------
    --Author: DuyenTT
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanTinhTrang: function (strHoSoDuTuyen_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'TP_XacNhanSauThi/ThemMoi',
            'strId': "",
            'strSanPham_Id': strHoSoDuTuyen_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
        };
        $("#modal_XacNhanTinhTrang").modal('hide');
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Thất bại:" + data.Message, "w");
                }
            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NhapDiem();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_XacNhanTinhTrang: function (strHoSoDuTuyen_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TP_XacNhanSauThi/LayDanhSach',
            'strTuKhoa': "",
            'strsanpham_Id': strHoSoDuTuyen_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': '',
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
                    me.genTable_XacNhanTinhTrang(data.Data, strTable_Id);
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

    genTable_XacNhanTinhTrang: function (data, strTable_Id) {
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