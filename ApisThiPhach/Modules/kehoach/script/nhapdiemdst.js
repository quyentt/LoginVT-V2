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
    dtThongKeKQ: [],
    dtThongKeKQ_View: [],
    colThongKeKQ: [],
    pageThongKeKQ: 1,
    pageSizeThongKeKQ: 20,
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
        me.getList_KhoaQuanLy();
        me.getList_MonThi();
        me.getList_HinhThucThi();
        me.getList_LoaiDiem();


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
        $("#tblNhapDiem").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit();
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
        $('#dropSearch_KhoaQuanLy').on('select2:select', function (e) {
            me.getList_MonThi();
        });
        $('#dropSearch_MonThi').on('select2:select', function (e) {

            //me.getList_TuiBai();
        });

        $('#dropSearch_LoaiDiem').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            me.getList_HinhThucThi();
            //me.getList_TuiBai();
        });

        $('#dropSearch_HinhThuc').on('select2:select', function (e) {
            me.getList_DotThi();
            me.getList_MonThi();
            //me.getList_TuiBai();
        });
        edu.system.getList_MauImport("zonebtnBaoCao_NhapDiem", function (addKeyValue) {
            addKeyValue("strThi_DotThi_Id", edu.util.getValCombo("dropSearch_DotThi"));
            addKeyValue("strDaoTao_HocPhan_Id", edu.util.getValCombo("dropSearch_MonThi"));
            addKeyValue("strDanhSachThi_Id", main_doc.NhapDiem.strTuiBai_Id);
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            arrChecked_Id.forEach(e => addKeyValue("strDanhSachThi_Id", e));
        });
        $(".btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMTHI";
            me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            me.getList_XacNhan(arrChecked_Id[0], "tblModal_XacNhan", null, 'XACNHAN_HOANTHANH_DIEMTHI');
        });

        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNhapDiem", "checkX");
            arrChecked_Id.forEach(e => me.save_XacNhanSanPham(e, strTinhTrang, strMoTa, me.strLoaiXacNhan));
        });

        $(".btnXacNhanTungSinhVien").click(function () {
            $("#modal_XacNhanTungSinhVien").modal("show");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_DIEMTHI_NGUOIHOC";
            me.getList_BtnXacNhanSanPham("#zoneBtnXacNhanTungSinhVien", me.strLoaiXacNhan);
            me.actionCopyXacNhan("tblTuiThi", [1, 2, 3]);
            var point = document.getElementById("tblTuiThi").getElementsByTagName("tbody")[0].rows
            for (var i = 0; i < point.length; i++) {
                getXacNhan(point[i].id)
            }

            function getXacNhan(strZoneId) {
                var strNguoiHoc_Id = me.dtNhapDiem.find(ele => ele.ID === strZoneId);
                if (strNguoiHoc_Id) {
                    strNguoiHoc_Id = strNguoiHoc_Id.QLSV_NGUOIHOC_ID
                    me.getList_XacNhan(edu.util.getValById("dropSearch_DSThi") + strNguoiHoc_Id, "", data => {
                        if (data.length > 0) $("#lblTinhTrang" + strZoneId).html(data[0].TEN)
                    }, me.strLoaiXacNhan)
                }

            }
        });
        $("#zoneBtnXacNhanTungSinhVien").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanTungSinhVien");
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_DanhSachXacNhan", "checkX");
            if (arrChecked_Id.length == 0) {
                //edu.system.alert("Vui lòng chọn đối tượng?");
                //return;
            } else {
                var strTuiBai_Id = me.strTuiBai_Id
                arrChecked_Id.forEach(e => {
                    var strNguoiHoc_Id = me.dtNhapDiem.find(ele => ele.ID === e);
                    if (strNguoiHoc_Id) {
                        strNguoiHoc_Id = strNguoiHoc_Id.QLSV_NGUOIHOC_ID
                        me.save_XacNhanSanPham(strTuiBai_Id + strNguoiHoc_Id, strTinhTrang, strMoTa, me.strLoaiXacNhan);
                    }

                })

                $("#modal_XacNhanTungSinhVien").modal('hide');
            }

        });

        $("#tblNhapDiem").delegate(".btnEditNgayNhan", "blur", function () {
            var strId = this.id.split('_')[1];
            var strVal = $(this).val();
            console.log(strVal);
            me.save_NgayNhanBai(strId, strVal)
        });

        $("#tblNhapDiem").delegate('.btnCanBoChamThi', 'click', function (e) {
            var strId = this.id;
            me.strTuiBai_Id = strId;
            $("#myModalCanBoChamThi").modal("show");
            me.getList_CanBoChamThi();
        });
        $("#btnDelete_CanBoChamThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoChamThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            $("#myModalCanBoChamThi").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_CanBoChamThi(arrChecked_Id[i]);
            }
        });

        /*------------------------------------------
        --Discription: Thống kê kết quả điểm thi
        -------------------------------------------*/
        $("#btnThongKeKetQua").click(function (e) {
            e.preventDefault();
            me.getList_ThongKeKetQua();
        });
        $("#txtSearch_ThongKeKQ").on('input', function () {
            me._applyFilter_ThongKeKQ();
        });
        $("#ddlFilterKhoa_TKKQ").on('change', function () {
            me._applyFilter_ThongKeKQ();
        });
        $("#ddlFilterCN_TKKQ").on('change', function () {
            me._applyFilter_ThongKeKQ();
        });
        $("#btnClearFilter_TKKQ").click(function (e) {
            e.preventDefault();
            $("#txtSearch_ThongKeKQ").val('');
            $("#ddlFilterKhoa_TKKQ").val('');
            $("#ddlFilterCN_TKKQ").val('');
            me._applyFilter_ThongKeKQ();
        });
        $("#btnExportExcel_ThongKeKQ").click(function (e) {
            e.preventDefault();
            me.export_ThongKeKetQua_Excel();
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
        // strTrangThaiNhapDiem: '' = tất cả, '0' = chưa hoàn thành, '1' = đã hoàn thành
        // Luôn lấy toàn bộ DST rồi lọc ở client theo XACNHANHOANTHANHDIEMTHI để
        // đảm bảo tổng = đã hoàn thành + chưa hoàn thành (filter backend cũ trả sai 0).
        var strTrangThaiNhapDiem = edu.util.getValById('dropSearch_HoanThanhNhapDiem');
        var obj_save = {
            'action': 'XLHV_TP_Chung_MH/DSA4BRIVKSgVKSQuBS41FSko',
            'func': 'pkg_thi_phach_chung.LayDSThiTheoDotThi',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dLocKhongHoanThanhNhapDiem': '0',
            'strThi_DotThi_Id': edu.util.getValById('dropSearch_DotThi'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropSearch_MonThi'),
            'strTuNgay': edu.util.getValById('txtAAAA'),
            'strDenNgay': edu.util.getValById('txtAAAA'),
            'strHinhThucThi_Id': edu.util.getValById('dropSearch_HinhThuc'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropSearch_LoaiDiem'),
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById('dropSearch_KhoaQuanLy'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    if (strTrangThaiNhapDiem === '1') {
                        dtReRult = dtReRult.filter(function (e) { return e.XACNHANHOANTHANHDIEMTHI == 1; });
                    } else if (strTrangThaiNhapDiem === '0') {
                        dtReRult = dtReRult.filter(function (e) { return e.XACNHANHOANTHANHDIEMTHI != 1; });
                    }
                    me.dtTuiBai = dtReRult;
                    me.genTable_TuiBai(dtReRult, dtReRult.length);
                }
                else {
                    edu.system.alert( data.Message, "s");
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
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_TuiBai: function (data, iPager) {
        var me = this;
        var iTotal = (iPager && iPager > 0) ? iPager : (data ? data.length : 0);
        var iPageSize = parseInt(edu.system.pageSize_default) || 10;
        var iPageIndex = parseInt(edu.system.pageIndex_default) || 1;
        var iStart = (iPageIndex - 1) * iPageSize;
        var dataPage = (data || []).slice(iStart, iStart + iPageSize);
        $("#lblTuiBai_Tong").html(iTotal);
        $("#lblNhapDiem_Tong").html(iTotal);
        var jsonForm = {
            strTable_Id: "tblNhapDiem",

            bPaginate: {
                strFuntionName: "main_doc.NhapDiem.getList_TuiBai()",
                iDataRow: iTotal,
            },
            aaData: dataPage,
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
                        return '<span><a class="btn btn-default btnEdit" style="text-decoration: underline;font-style: italic; color: green" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.MADANHSACHTHI) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.NGAYTHI) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.THI_CATHI_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.TKB_PHONGTHI_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.SOSVTHEODST) + '</a></span>';
                    }
                }
                , {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return '<input id="txtNgayNhanBai_' + aData.ID + '" class="form-control btnEditNgayNhan" />';
                    }
                }
                , {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        let temp = aData.DSNHANSUCHAMTHI ? aData.DSNHANSUCHAMTHI : "Xem";
                        return '<span><a class="btn btn-default btnCanBoChamThi" id="' + aData.ID + '" title="Chi tiết">' + temp + '</a></span>';
                    }
                },
                {
                    "mDataP": "TEN",
                    "mRender": function (nRow, aData) {
                        return aData.XACNHANHOANTHANHDIEMTHI == 1 ? "Đã xác nhận": "";
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
        me.syncTopScroll_TuiBai();
    },
    syncTopScroll_TuiBai: function () {
        var $top = $("#topScroll_tblNhapDiem");
        var $topInner = $("#topScrollInner_tblNhapDiem");
        var $wrap = $("#wrapScroll_tblNhapDiem");
        if (!$top.length || !$wrap.length) return;
        var resize = function () {
            var w = $wrap[0].scrollWidth;
            $topInner.css("width", w + "px");
        };
        resize();
        setTimeout(resize, 50);
        if (!$top.data("synced")) {
            $top.data("synced", true);
            $top.on("scroll", function () { $wrap.scrollLeft($top.scrollLeft()); });
            $wrap.on("scroll", function () { $top.scrollLeft($wrap.scrollLeft()); });
            $(window).on("resize", resize);
        }
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
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                
                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
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
            type: obj_save.type,

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
                        return '<input id="txtDiem' + aData.ID + '" class="form-control" value="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" name="' + edu.util.returnEmpty(aData.DIEMBANDAU) + '" />';
                    }
                },
                {
                    "mDataProp": "DiemPhucKhao".toUpperCase()
                },
                {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                },
                {
                    "mDataProp": "NGUOISUA_TAIKHOAN"
                },
                {
                    "mDataProp": "NGAYSUA_DD_MM_YYYY"
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
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
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
    --Discription: [0] GEN HTML ==> Khoa quản lý
    --ULR: Modules
    -------------------------------------------*/
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
            title: "Chọn khoa quản lý"
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
    loadBtnXacNhan: function (data, strZoneXacNhan) {
        main_doc.NhapDiem.dtXacNhan = data;
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
        $(strZoneXacNhan).html(row);
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
    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'D_HanhDongXacNhan/LayDanhSach',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strLoaiXacNhan_Id': strLoaiXacNhan,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                me.loadBtnXacNhan(data.Data, strZoneXacNhan_Id);
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
    actionCopyXacNhan: function (strTable_Id, arrCols) {
        var me = this;
        $("#modal_XacNhanTungSinhVien").modal("show")
        var pointHead = document.getElementById(strTable_Id).getElementsByTagName("thead")[0].rows
        var html = '';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        arrCols.forEach(e => {
            html += '<th class="td-center">' + pointHead[0].cells[e].innerText;
            html += '</th>';
        })
        html += '<th class="td-center">Tình trạng';
        html += '</th>';
        html += '<th class="td-center td-fixed">';
        html += '</th>';
        html += '</tr>';
        $("#tblModal_DanhSachXacNhan thead").html(html);

        var point = document.getElementById(strTable_Id).getElementsByTagName("tbody")[0].rows
        var html = '';
        for (var i = 0; i < point.length; i++) {
            html += '<tr class="btnChiTiet poiter" id="' + point[i].id + '">';
            html += '<td class="td-fixed td-center">' + (i + 1) + '</td>';
            arrCols.forEach(e => {
                html += '<td class="td-center">' + point[i].cells[e].innerText;
                html += '</td>';
            })
            html += '<td class="td-center"><span type="checkbox" id="lblTinhTrang' + point[i].id + '" ></span></td>';
            html += '<td class="td-center td-fixed"><input type="checkbox" id="checkX' + point[i].id + '"/></td>';
            html += '</tr>';
        }
        $("#tblModal_DanhSachXacNhan tbody").html(html);
        $("#tblModal_DanhSachXacNhan").delegate('.btnChiTiet', 'click', function (e) {
            var strId = this.id;
            edu.util.setOne_BgRow(strId, "tblModal_DanhSachXacNhan");
            if (edu.util.checkValue(strId)) {
                var strNguoiHoc_Id = me.dtNhapDiem.find(ele => ele.ID === strId);
                if (strNguoiHoc_Id) {
                    strNguoiHoc_Id = strNguoiHoc_Id.QLSV_NGUOIHOC_ID
                    me.getList_XacNhan(me.strTuiBai_Id + strNguoiHoc_Id, "tblModal_XacNhanDSTungSinhVien", null, me.strLoaiXacNhan)
                }
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
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

    getList_CanBoChamThi: function () {
        var me = this;
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/DSA4BRIPKSAvEjQRKSAvAi4vJgIuKBUpKAPP',
            'func': 'pkg_thi_phancong.LayDSNhanSuPhanCongCoiThi',
            'iM': edu.system.iM,
            'strDuLieuPhanCongCoiThi_Id': me.strTuiBai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genTable_CanBoChamThi(data);
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
    genTable_CanBoChamThi: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTuiBai",
            aaData: data,

            colPos: {
                //center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "THI_TUIBAI_TEN"
                },
                {
                    "mDataProp": "CANBOCHAMTHI_HOTEN"
                },
                {
                    "mDataProp": "SOBAI"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        //if (data && data.length) edu.system.actionRowSpanForACol(jsonForm.strTable_Id, [1])

        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: Thống kê kết quả điểm thi
    --Origin: PKG_THI_PHACH_THONGKE.ThongKeKetQuaDiemThiTheo
    -------------------------------------------*/
    getList_ThongKeKetQua: function () {
        var me = this;
        var strThoiGian = edu.util.getValById('dropSearch_ThoiGian');
        var strDotThi = edu.util.getValById('dropSearch_DotThi');
        var strKhoaQL = edu.util.getValById('dropSearch_KhoaQuanLy');
        var strMonThi = edu.util.getValById('dropSearch_MonThi');
        if (!edu.util.checkValue(strThoiGian)) {
            edu.system.alert("Vui lòng chọn <b>Thời gian</b> trước khi thống kê!", "w");
            return;
        }
        if (!edu.util.checkValue(strDotThi)
            && !edu.util.checkValue(strKhoaQL)
            && !edu.util.checkValue(strMonThi)) {
            edu.system.alert("Vui lòng chọn thêm ít nhất một trong: <b>Đợt thi / Khoa quản lý / Môn thi</b> để thu hẹp phạm vi thống kê!", "w");
            return;
        }
        var obj_save = {
            'action': 'XLHV_TP_ThongKe_MH/FSkuLyYKJAokNRA0IAUoJCwVKSgVKSQu',
            'func': 'PKG_THI_PHACH_THONGKE.ThongKeKetQuaDiemThiTheo',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
            'strVaiTroDangNhap_Id': edu.system.vaiTroDangNhap_Id || '',
            'strChucNangHeThong_Id': edu.system.strChucNang_Id,
            'strHanhDong_Code': '',
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGian,
            'strThi_DotThi_Id': strDotThi,
            'strDaoTao_HocPhan_Id': strMonThi,
            'strDaoTao_KhoaQuanLyHP_Id': strKhoaQL,
        };
        edu.system.beginLoading && edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                edu.system.endLoading && edu.system.endLoading();
                if (data.Success) {
                    me.dtThongKeKQ = data.Data || [];
                    edu.util.toggle_overide("zone-bus", "zoneThongKeKetQua");
                    $("#txtSearch_ThongKeKQ").val('');
                    $("#ddlFilterKhoa_TKKQ").val('');
                    $("#ddlFilterCN_TKKQ").val('');
                    me.colThongKeKQ = me.dtThongKeKQ.length
                        ? Object.keys(me.dtThongKeKQ[0]) : [];
                    me._populateFilters_TKKQ();
                    me.genTable_ThongKeKetQua(me.dtThongKeKQ);
                } else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {
                edu.system.endLoading && edu.system.endLoading();
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,
            contentType: true,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    genTable_ThongKeKetQua: function (data) {
        var me = this;
        if (data !== undefined) {
            me.dtThongKeKQ_View = data || [];
            me.pageThongKeKQ = 1;
        }
        var view = me.dtThongKeKQ_View || [];
        var total = view.length;
        var pageSize = parseInt(me.pageSizeThongKeKQ) || 20;
        var totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (me.pageThongKeKQ > totalPages) me.pageThongKeKQ = totalPages;
        if (me.pageThongKeKQ < 1) me.pageThongKeKQ = 1;
        var page = me.pageThongKeKQ;
        var start = (page - 1) * pageSize;
        var dataPage = view.slice(start, start + pageSize);

        $("#lblThongKeKQ_Tong").html(total);
        var $thead = $("#tblThongKeKetQua thead");
        var $tbody = $("#tblThongKeKetQua tbody");
        if (total === 0) {
            $thead.html('<tr><th class="td-center">Không có dữ liệu</th></tr>');
            $tbody.html('');
            me.colThongKeKQ = [];
            me._renderPagerTKKQ(0, 1, 1);
            return;
        }
        var cols = Object.keys(view[0]);
        me.colThongKeKQ = cols;
        var headHtml = '<tr><th class="td-fixed td-center w-50px">Stt</th>';
        cols.forEach(function (c) {
            headHtml += '<th class="td-center">' + me._prettifyLabelTKKQ(c) + '</th>';
        });
        headHtml += '</tr>';
        $thead.html(headHtml);
        var bodyHtml = '';
        dataPage.forEach(function (row, i) {
            bodyHtml += '<tr>';
            bodyHtml += '<td class="td-fixed td-center">' + (start + i + 1) + '</td>';
            cols.forEach(function (c) {
                var v = row[c];
                if (v === null || v === undefined) v = '';
                bodyHtml += '<td>' + me._escapeHtmlTKKQ(v) + '</td>';
            });
            bodyHtml += '</tr>';
        });
        $tbody.html(bodyHtml);
        me._renderPagerTKKQ(total, page, totalPages);
    },
    _renderPagerTKKQ: function (total, page, totalPages) {
        var me = this;
        var pageSize = parseInt(me.pageSizeThongKeKQ) || 20;
        var iStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
        var iEnd = Math.min(total, page * pageSize);
        var html = '';
        html += '<div class="d-flex" style="align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">';
        html += '<div>Hiển thị <b>' + iStart + '-' + iEnd + '</b> / <b>' + total + '</b> bản ghi';
        html += ' &nbsp;|&nbsp; Kích thước trang: ';
        html += '<select id="ddlPageSize_TKKQ" class="form-control d-inline-block" style="width:80px;display:inline-block;">';
        [10, 20, 50, 100, 200, 500].forEach(function (sz) {
            html += '<option value="' + sz + '"' + (sz === pageSize ? ' selected' : '') + '>' + sz + '</option>';
        });
        html += '</select>';
        html += '</div>';
        html += '<div class="pager-btns">';
        html += '<button type="button" class="btn btn-default btn-sm" id="btnPageFirst_TKKQ"'
            + (page <= 1 ? ' disabled' : '') + '>&laquo;</button>';
        html += '<button type="button" class="btn btn-default btn-sm" id="btnPagePrev_TKKQ"'
            + (page <= 1 ? ' disabled' : '') + '>&lsaquo;</button>';
        html += '<span style="padding:0 10px;">Trang <b>' + page + '</b> / ' + totalPages + '</span>';
        html += '<button type="button" class="btn btn-default btn-sm" id="btnPageNext_TKKQ"'
            + (page >= totalPages ? ' disabled' : '') + '>&rsaquo;</button>';
        html += '<button type="button" class="btn btn-default btn-sm" id="btnPageLast_TKKQ"'
            + (page >= totalPages ? ' disabled' : '') + '>&raquo;</button>';
        html += '</div>';
        html += '</div>';
        $("#pagerThongKeKQ").html(html);
        $("#ddlPageSize_TKKQ").off('change').on('change', function () {
            me.pageSizeThongKeKQ = parseInt($(this).val()) || 20;
            me.pageThongKeKQ = 1;
            me.genTable_ThongKeKetQua();
        });
        $("#btnPageFirst_TKKQ").off('click').on('click', function () {
            me.pageThongKeKQ = 1;
            me.genTable_ThongKeKetQua();
        });
        $("#btnPagePrev_TKKQ").off('click').on('click', function () {
            me.pageThongKeKQ = Math.max(1, me.pageThongKeKQ - 1);
            me.genTable_ThongKeKetQua();
        });
        $("#btnPageNext_TKKQ").off('click').on('click', function () {
            me.pageThongKeKQ = Math.min(totalPages, me.pageThongKeKQ + 1);
            me.genTable_ThongKeKetQua();
        });
        $("#btnPageLast_TKKQ").off('click').on('click', function () {
            me.pageThongKeKQ = totalPages;
            me.genTable_ThongKeKetQua();
        });
    },
    _populateFilters_TKKQ: function () {
        var me = this;
        var data = me.dtThongKeKQ || [];
        me._khoaFieldTKKQ = me._findFilterField_TKKQ(
            ['KHOA_QLSV', 'KHOA_QLHP', 'KHOA', 'TEN_KHOA', 'MA_KHOA']);
        me._cnFieldTKKQ = me._findFilterField_TKKQ(
            ['CHUYEN_NGANH', 'CHUYENNGANH', 'CHUYEN_NGANH_TEN', 'TEN_CHUYENNGANH']);
        me._fillDistinctSelect_TKKQ('#ddlFilterKhoa_TKKQ', data,
            me._khoaFieldTKKQ, '-- Chọn Khoa --');
        me._fillDistinctSelect_TKKQ('#ddlFilterCN_TKKQ', data,
            me._cnFieldTKKQ, '-- Chọn chuyên ngành --');
    },
    _findFilterField_TKKQ: function (candidates) {
        var cols = this.colThongKeKQ || [];
        for (var i = 0; i < candidates.length; i++) {
            if (cols.indexOf(candidates[i]) !== -1) return candidates[i];
        }
        return null;
    },
    _fillDistinctSelect_TKKQ: function (sel, data, field, placeholder) {
        var $sel = $(sel);
        $sel.empty().append('<option value="">' + placeholder + '</option>');
        if (!field) { $sel.prop('disabled', true); return; }
        $sel.prop('disabled', false);
        var seen = {};
        var arr = [];
        data.forEach(function (row) {
            var v = row[field];
            if (v === null || v === undefined || v === '') return;
            var key = String(v);
            if (seen[key]) return;
            seen[key] = true;
            arr.push(key);
        });
        arr.sort(function (a, b) {
            try { return a.localeCompare(b, 'vi'); }
            catch (e) { return a < b ? -1 : (a > b ? 1 : 0); }
        });
        var $tmp = $('<div>');
        arr.forEach(function (v) {
            var safe = $tmp.text(v).html();
            $sel.append('<option value="' + safe + '">' + safe + '</option>');
        });
    },
    _applyFilter_ThongKeKQ: function () {
        var me = this;
        var kw = ($("#txtSearch_ThongKeKQ").val() || '').toString().trim().toLowerCase();
        var khoaVal = $("#ddlFilterKhoa_TKKQ").val() || '';
        var cnVal = $("#ddlFilterCN_TKKQ").val() || '';
        var data = me.dtThongKeKQ || [];
        if (khoaVal && me._khoaFieldTKKQ) {
            data = data.filter(function (r) {
                return String(r[me._khoaFieldTKKQ] == null ? '' : r[me._khoaFieldTKKQ]) === khoaVal;
            });
        }
        if (cnVal && me._cnFieldTKKQ) {
            data = data.filter(function (r) {
                return String(r[me._cnFieldTKKQ] == null ? '' : r[me._cnFieldTKKQ]) === cnVal;
            });
        }
        if (kw) {
            data = data.filter(function (row) {
                for (var k in row) {
                    if (!row.hasOwnProperty(k)) continue;
                    var v = row[k];
                    if (v !== null && v !== undefined
                        && String(v).toLowerCase().indexOf(kw) !== -1) return true;
                }
                return false;
            });
        }
        me.genTable_ThongKeKetQua(data);
    },
    export_ThongKeKetQua_Excel: function () {
        var me = this;
        var data = me.dtThongKeKQ_View && me.dtThongKeKQ_View.length
            ? me.dtThongKeKQ_View
            : (me.dtThongKeKQ || []);
        if (data.length === 0) {
            edu.system.alert("Không có dữ liệu để xuất Excel!", "w");
            return;
        }
        var cols = Object.keys(data[0]);
        var html = '';
        html += '<html xmlns:o="urn:schemas-microsoft-com:office:office"';
        html += ' xmlns:x="urn:schemas-microsoft-com:office:excel"';
        html += ' xmlns="http://www.w3.org/TR/REC-html40">';
        html += '<head><meta charset="utf-8"/></head><body>';
        html += '<table border="1"><tr><th>Stt</th>';
        cols.forEach(function (c) {
            html += '<th>' + me._escapeHtmlTKKQ(me._prettifyLabelTKKQ(c)) + '</th>';
        });
        html += '</tr>';
        data.forEach(function (row, i) {
            html += '<tr><td>' + (i + 1) + '</td>';
            cols.forEach(function (c) {
                var v = row[c];
                if (v === null || v === undefined) v = '';
                html += '<td>' + me._escapeHtmlTKKQ(v) + '</td>';
            });
            html += '</tr>';
        });
        html += '</table></body></html>';
        var blob = new Blob(['﻿', html], {
            type: 'application/vnd.ms-excel;charset=utf-8'
        });
        var d = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : n; };
        var stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate())
            + '_' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
        var fileName = 'ThongKeKetQuaDiemThi_' + stamp + '.xls';
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },
    _prettifyLabelTKKQ: function (key) {
        if (!key) return '';
        return String(key).replace(/_/g, ' ');
    },
    _escapeHtmlTKKQ: function (v) {
        return String(v)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    delete_CanBoChamThi: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'XLHV_TP_PhanCong_MH/GS4gHhUpKB4GKCAuFygkLx4CLigVKSgP',
            'func': 'pkg_thi_phancong.Xoa_Thi_GiaoVien_CoiThi',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { edu.system.alert(" (er): " + JSON.stringify(er), "w"); },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CanBoChamThi();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    }
}