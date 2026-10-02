/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 15/1/2018
----------------------------------------------*/
function HoiDongXetChucDanh() { }
HoiDongXetChucDanh.prototype = {
    dtHoiDongXCD: [],
    strHoiDongXetCD_Id: '',
    strNhanSu_Id:'',
    dtVaiTro: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnReWrite").click(function () {
            me.rewrite();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        $("#btnSearchHDXCD_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        /*------------------------------------------
        --Discription: [1] Action HoiDongXetChucDanh
        --Order: 
        -------------------------------------------*/
        $("#btnSearch_HDXCD").click(function () {
            me.getList_HDXCD();
        });
        $("#btnSave_HDXCD").click(function () {
            var valid = ""; //edu.util.objGetDataInData("VALID.NCKH.HDXCD", edu.system.dataCache, "key", "");
            if (edu.util.checkValue(valid)) {
                if (edu.util.validInputForm(valid[0].data)) {
                    if (edu.util.checkValue(me.strHoiDongXetCD_Id)) {
                        me.update_HDXCD();
                    }
                    else {
                        me.save_HDXCD();
                    }
                }
            }
            else {
                if (edu.util.checkValue(me.strHoiDongXetCD_Id)) {
                    me.update_HDXCD();
                }
                else {
                    me.save_HDXCD();
                }
            }
        });
        $("#tblHDXCD").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_detail();
                me.strHoiDongXetCD_Id = strId;
                me.getDetail_HDXCD(strId, constant.setting.ACTION.VIEW);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
        --Discription: [3] Action TCQG_ThanhVien input
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strId = edu.util.cutPrefixId(/slnhansu/g, id);
            if (edu.util.checkValue(strId)) {
                me.strNhanSu_Id = strId;
                me.addHTMLinto_tblNhanSu(strId);
            }
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        edu.util.toggle("box-sub-search");
        me.toggle_notify();
        setTimeout(function () {
            me.getList_HDXCD();
            setTimeout(function () {
                var obj = {
                    code: "QLCB.CHDA",
                    renderPlace: "rdHDXCD_ChucDanh",
                    nameRadio: "rdChucDanh",
                    title: ""
                }
                edu.system.loadToRadio_DanhMucDuLieu(obj);
                setTimeout(function () {
                    var obj = {
                        code: "NCKH.HDCS",
                        renderPlace: "rdHDXCD_HDCoSo",
                        nameRadio: "rdHDCoSo",
                        title: ""
                    }
                    edu.system.loadToRadio_DanhMucDuLieu(obj);
                    setTimeout(function () {
                        var obj = {
                            code: "NCKH.HDNG",
                            renderPlace: "rdHDXCD_HDNganh",
                            nameRadio: "rdHDNganh",
                            title: ""
                        }
                        edu.system.loadToRadio_DanhMucDuLieu(obj);
                        setTimeout(function () {
                            var obj = {
                                code: "NCKH.HDNN",
                                renderPlace: "rdHDXCD_HDNhaNuoc",
                                nameRadio: "rdHDNhaNuoc",
                                title: ""
                            }
                            edu.system.loadToRadio_DanhMucDuLieu(obj);
                            setTimeout(function () {
                                edu.system.loadToCombo_DanhMucDuLieu("CHUN.NGAN", "dropHDXCD_ChuyenNganh", "Chọn chuyên ngành");

                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus", "zone_detail_hdxcd");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_hdxcd");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_hdxcd");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strHoiDongXetCD_Id = "";
        me.strNhanSu_Id = "";
        $("#tblInput_HDXCD_DoiTuong tbody").html("");
        //
        var arrId = ["dropHDXCD_ChuyenNganh"];
        edu.util.resetValByArrId(arrId);
        edu.util.resetRadio("name", "rdChucDanh");
        edu.util.resetRadio("name", "rdHDCoSo");
        edu.util.resetRadio("name", "rdHDNganh");
        edu.util.resetRadio("name", "rdHDNhaNuoc");
    },
    /*------------------------------------------
    --Discription: [1] AcessDB HoiDongXetChucDanh
    -------------------------------------------*/
    getList_HDXCD: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'NCKH_HoiDongXetChucDanh/LayDanhSach',
            

            'strChucDanhDeXuat_Id': "",
            'strDoiTuongDeXuat_Id': edu.system.userId,
            'strKetQuaHoiDongCoSo_Id': "",
            'strKetQuaHoiDongNghanh_Id': "",
            'strKetQuaHoiDongNhaNuoc_Id': "",
            'strNguoiThucHien_Id': "",
            'strTuKhoa': "",
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                        me.dtHoiDongXCD = dtResult;
                    }
                    me.genTable_HDXCD(dtResult, iPager);
                }
                else {
                    edu.system.alert("NCKH_HoiDongXetChucDanh/LayDanhSach: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiDongXetChucDanh/LayDanhSach (er): " + JSON.stringify(er), "w");
                
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_HDXCD: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_HoiDongXetChucDanh/ThemMoi',
            

            'strId': "",
            'strChucDanhDeXuat_Id': edu.util.getValRadio("name", "rdChucDanh"),
            'strDoiTuongDeXuat_Id': me.strNhanSu_Id,
            'strChuyenNganh_Id': edu.util.getValById("dropHDXCD_ChuyenNganh"),
            'strKetQuaHoiDongCoSo_Id': edu.util.getValRadio("name", "rdHDCoSo"),
            'strKetQuaHoiDongNganh_Id': edu.util.getValRadio("name", "rdHDNganh"),
            'strKetQuaHoiDongNhaNuoc_Id': edu.util.getValRadio("name", "rdHDNhaNuoc"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.getList_HDXCD();
                }
                else {
                    edu.system.alert("NCKH_HoiDongXetChucDanh/ThemMoi: " + data.Message);
                }
                
                edu.system.alert('Tiến trình thực hiện thành công!');
                //$("#btnYes").click(function (e) {
                //    me.rewrite();
                //    $('#myModalAlert').modal('hide');
                //});
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiDongXetChucDanh/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    update_HDXCD: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'NCKH_HoiDongXetChucDanh/CapNhat',
            

            'strId': me.strHoiDongXetCD_Id,
            'strChucDanhDeXuat_Id': edu.util.getValRadio("name", "rdChucDanh"),
            'strDoiTuongDeXuat_Id': me.strNhanSu_Id,
            'strChuyenNganh_Id': "",
            'strKetQuaHoiDongCoSo_Id': edu.util.getValRadio("name", "rdHDCoSo"),
            'strKetQuaHoiDongNganh_Id': edu.util.getValRadio("name", "rdHDNganh"),
            'strKetQuaHoiDongNhaNuoc_Id': edu.util.getValRadio("name", "rdHDNhaNuoc"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Tiến trình thực hiện thành công!");
                    me.getList_HDXCD();
                }
                else {
                    edu.system.alert("NCKH_HoiDongXetChucDanh/CapNhat: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("NCKH_HoiDongXetChucDanh/CapNhat (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_HDXCD: function (strId) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'NCKH_HoiDongXetChucDanh/Xoa',
            
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId
        };
        var obj = {};
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HDXCD();
                }
                else {
                    obj = {
                        content: "NCKH_HoiDongXetChucDanh/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: "NCKH_HoiDongXetChucDanh/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [1] GenHTML HoiDongXetChucDanh
    -------------------------------------------*/
    genTable_HDXCD: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblaiBaoTN_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblHDXCD",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.HoiDongXetChucDanh.getList_HDXCD()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.DOITUONGDEXUAT_TEN) + " - " + edu.util.returnEmpty(aData.CHUCDANHDEXUAT_TEN) + "</span><br />";
                        if (edu.util.checkValue(aData.KETQUAXACNHAN_TEN)) {
                            html += '<span class="pull-right lbTinhTrang" style="' + aData.KETQUAXACNHAN_THONGTIN2 + '" title="' + aData.KETQUAXACNHAN_NOIDUNG + '">';
                            html += aData.KETQUAXACNHAN_TEN;
                            html += '</span>';
                        }
                        if (aData.HOANTHANHNHAPDULIEU == 0) {
                            html += '<span class="pull-right lbTinhTrang" style="color: orange" title="' + aData.HOANTHANHNHAPDULIEU_LYDO + '">';
                            html += "Chưa hoàn thành";
                            html += '</span>';
                        } else {
                            if (aData.HOANTHANHNHAPDULIEU == 1) {
                                html += '<span class="pull-right lbTinhTrang" style="color: green">';
                                html += "Hoàn thành";
                                html += '</span>';
                            }
                        }
                        html += '<span class="pull-right">';
                        html += '<a class="btn btn-default btn-circle btnView" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    getDetail_HDXCD: function (strId, strAction) {
        var me = this;
        switch (strAction) {
            case constant.setting.ACTION.EDIT:
                edu.util.objGetDataInData(strId, me.dtHoiDongXCD, "ID", me.viewEdit_HDXCD);
                break;
            case constant.setting.ACTION.VIEW:
                edu.util.objGetDataInData(strId, me.dtHoiDongXCD, "ID", me.viewDetail_HDXCD);
                break;
        }
    },
    viewDetail_HDXCD: function (data) {
        var dt = data[0];
        //View - Nguoi nhap
        edu.util.viewHTMLById("lblHDXCD_NguoiNhap", dt.NGUOITHUCHIEN_TENDAYDU);
        //View - Thong tin
        edu.util.viewHTMLById("lblHDXCD_ChucDanh", dt.CHUCDANHDEXUAT_TEN);
        edu.util.viewHTMLById("lblHDXCD_DoiTuong", dt.DOITUONGDEXUAT_TEN);
        edu.util.viewHTMLById("lblHDXCD_ChuyenNganh", dt.CHUYENNGANH_TEN);
        edu.util.viewHTMLById("lblHDXCD_HDCoSo", dt.KETQUAHOIDONGCOSO_TEN);
        edu.util.viewHTMLById("lblHDXCD_HDNganh", dt.KETQUAHOIDONGNGANH_TEN);
        edu.util.viewHTMLById("lblHDXCD_HDNhaNuoc", dt.KETQUAHOIDONGNHANUOC_TEN);
        //view DoiTuong

    },
    viewEdit_HDXCD: function (data) {
        var dt = data[0];
        //Edit - Thong tin
        edu.util.viewRadioById("rdChucDanh", dt.CHUCDANHDEXUAT_ID);
        edu.util.viewValById("txtHDXCD_DoiTuong", dt.DOITUONGDEXUAT_ID);
        edu.util.viewValById("dropHDXCD_ChuyenNganh", dt.CHUYENNGANH_ID);
        edu.util.viewRadioById("rdHDCoSo", dt.KETQUAHOIDONGCOSO_ID);
        edu.util.viewRadioById("rdHDNganh", dt.KETQUAHOIDONGNGANH_ID);
        edu.util.viewRadioById("rdHDNhaNuoc", dt.KETQUAHOIDONGNHANUOC_ID);
        //view DoiTuong
    },
    /*------------------------------------------
    --Discription: [2] GenHTML add NhanSu
    --Task: 
    -------------------------------------------*/
    addHTMLinto_tblNhanSu: function (strNhanSu_Id) {
        var me = this;
        //1. notify
        obj_notify = {
            renderPlace: "slnhansu" + strNhanSu_Id,
            type: "s",
            title: "Đã chọn!"
        };
        edu.system.notifyLocal(obj_notify);
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        //3. create html
        var html = "";
        $("#tblInput_HDXCD_DoiTuong tbody").html(html);
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'><img class='table-img' src='" + valHinhAnh + "'></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span> - <span>" + valMa + "</span></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_HDXCD_DoiTuong tbody").html(html);
    },
};