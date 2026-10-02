/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function PhieuDanhGiaCanBo() { }
PhieuDanhGiaCanBo.prototype = {
    dtLuongTangThem: [],
    strKeHoach_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });
        me.genSoLuongNguoi("", "");
        me.getDetail_PhieuDG();
        $("#btnSearch_PhieuDG").click(function () {
            me.getList_PhieuDG();
        });
        $("#btnSave_PhieuDG").click(function () {
            if (edu.util.checkValue(me.strKeHoach_Id)) {
                me.update_PhieuDG();
            }
            else {
                me.save_PhieuDG();
            }
        });
        $("#tblPhieuDG_KeHoach").delegate(".btnDanhGia", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/danhgia_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_phieu();
                me.strKeHoach_Id = strId;
                me.getDetail_PhieuDG(strId, constant.setting.ACTION.VIEW);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave").click(function () {
            me.save_Phieu();
        })
    },
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_phieu();
        edu.system.loadToCombo_DanhMucDuLieu("CCB.VTSK", "dropYK_VaiTro");
    },
    toggle_phieu: function () {
        edu.util.toggle_overide("zonePhieuDG", "zone_PhieuDG");
    },
    toggle_notify: function () {
        edu.util.toggle_overide("zonePhieuDG", "zone_notify_PhieuDG");
    },
    rewrite: function () {
        //reset id
        var me = this;
        me.strKeHoach_Id = "";
        var arrId = ["txtPhieuDG_Ten", "txtPhieuDG_TuNgay", "txtPhieuDG_DenNgay", "txtPhieuDG_NoiDung"];
        edu.util.resetValByArrId(arrId);
    },
    save_Phieu: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_TDKT_CanBo/CapNhat',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNhanSu_TDKT_KeHoach_Id': me.strKeHoach_Id,
            'dDiemChuyenMon_TC1': edu.util.getValById('txtThucTe1'),
            'dDiemChuyenMon_TC2': edu.util.getValById('txtThucTe2'),
            'dDiemChuyenMon_TC3': edu.util.getValById('txtThucTe3'),
            'dDiemChuyenMon_TC4': edu.util.getValById('txtThucTe4'),
            'dDiemChuyenMon_TC5': edu.util.getValById('txtThucTe5'),
            'dDiemChuyenMon_TC6': edu.util.getValById('txtThucTe6'),
            'dDiemChuyenMon_TC7': edu.util.getValById('txtThucTe7'),
            'strYK_DiemVietSach': edu.util.getValById('txtYK_VietSach'),
            'strYK_DiemDeTai': edu.util.getValById('txtYK_DeTai'),
            'strYK_DiemBaiBaoTrongNuoc': edu.util.getValById('txtYK_TapChiQuocGia'),
            'strYK_DiemBaiBaoQuocTe': edu.util.getValById('txtYK_TapChiQuocTe'),
            'strYK_DiemVanBangSangChe': edu.util.getValById('txtYK_VBSC'),
            'strYK_SoGioCoiThi': edu.util.getValById('txtYK_CoiThi'),
            'strYK_DiemCongDoan': edu.util.getValById('txtYK_CongDoan'),
            'strYK_DiemHop': edu.util.getValById('txtYK_DiemHop'),
            'strYK_DiemThanhTichDotXuat': edu.util.getValById('txtYK_GiaiThuong'),
            'strTenSangKienCaiTien': edu.util.getValById('txtYK_Ten'),
            'strNgayThangNamSangKien': edu.util.getValById('txtYK_NgayCongNhan'),
            'strSoQuyetDinhSangKien': edu.util.getValById('txtYK_SoQuyetDinh'),
            'strVaiTroSangKien_Id': edu.util.getValById('dropYK_VaiTro'),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!");
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
                me.getDetail_PhieuDG();                
            },
            error: function (er) {                
                edu.system.alert(obj_save.action + " (er): " + er);
            },
            type: "POST",
            action: obj_save.action,            
            contentType: true,            
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_PhieuDG: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_PLDG_NLD_KeHoach/LayDanhSach',            

            'strTuKhoa': edu.util.getValById(""),
            'strNguoiThucHien_Id': '',
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
                        me.dtLuongTangThem = dtResult;
                        if (data.Data.length > 0)
                        me.genTable_PhieuDG(dtResult, iPager);
                    }
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_PhieuDG/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_PhieuDG/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getDetail_PhieuDG: function (strKeHoach_Id) {
        //dang lay theo danh muc TieuChi ==> thuc chat la lay theo tu phieu da gen
        var me = this;
        var obj_list = {
            'action': 'NS_TDKT_CanBo/LayChiTiet',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNhanSu_TDKT_KeHoach_Id': ""
        };        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        me.dtTieuChi = dtResult;
                        if (data.Data.length > 0)
                            me.genDetail_PhieuDG(dtResult);
                    }
                }
                else {
                    edu.system.alert("NS_PLDG_LTT_TieuChi/LayDanhSach: " + data.Message, "w");
                }                
            },
            error: function (er) {
                edu.system.alert("NS_PLDG_LTT_TieuChi/LayDanhSach (er): " + JSON.stringify(er), "w");                
            },
            type: "GET",
            action: obj_list.action,            
            contentType: true,            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_PhieuDG: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblPhieuDG_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblPhieuDG_KeHoach",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.PhieuDanhGia.getList_PhieuDG()",
                iDataRow: iPager
            },
            bHiddenHeader: true,
            bHiddenOrder: true,
            arrClassName: ["btnDanhGia"],
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENKEHOACH) + "</span><br />";
                        html += '<span class="pull-right">';
                        html += '<a class="btn color-warning" id="danhgia_' + aData.ID + '" href="#" title="Đánh giá">Đánh giá</a>';
                        html += '</span>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        if (data.length == 1) {
            $("#tblPhieuDG_KeHoach tr[id='" + data[0].ID + "']").trigger("click");
        }
        /*III. Callback*/
    },
    genDetail_PhieuDG: function (data) {
        var me = this;
        var html = '';
        data = data[0];
      
        edu.util.viewValById("txtThucTe1", data.DIEMCHUYENMON_TC1);
        edu.util.viewValById("txtThucTe2", data.DIEMCHUYENMON_TC2);
        edu.util.viewValById("txtThucTe3", data.DIEMCHUYENMON_TC3);
        edu.util.viewValById("txtThucTe4", data.DIEMCHUYENMON_TC4);
        edu.util.viewValById("txtThucTe5", data.DIEMCHUYENMON_TC5);
        edu.util.viewValById("txtThucTe6", data.DIEMCHUYENMON_TC6);
        edu.util.viewValById("txtThucTe7", data.DIEMCHUYENMON_TC7);
        edu.util.viewHTMLById("txtVietSach", data.DIEMVIETSACH);
        edu.util.viewValById("txtYK_VietSach", data.YK_DIEMVIETSACH);
        edu.util.viewHTMLById("txtDeTai", data.DIEMDETAI);
        edu.util.viewValById("txtYK_DeTai", data.YK_DIEMDETAI);
        edu.util.viewHTMLById("txtTapChiQuocGia", data.DIEMBAIBAOTRONGNUOC);
        edu.util.viewValById("txtYK_TapChiQuocGia", data.YK_DIEMBAIBAOTRONGNUOC);
        edu.util.viewHTMLById("txtTapChiQuocTe", data.DIEMBAIBAOQUOCTE);
        edu.util.viewValById("txtYK_TapChiQuocTe", data.YK_DIEMBAIBAOQUOCTE);
        edu.util.viewHTMLById("txtVBSC", data.DIEMVANBANGSANGCHE);
        edu.util.viewValById("txtYK_VBSC", data.YK_DIEMVANBANGSANGCHE);
        edu.util.viewHTMLById("txtGiaiThuong", data.DIEMTHANHTICHDOTXUAT);
        edu.util.viewValById("txtYK_GiaiThuong", data.YK_DIEMTHANHTICHDOTXUAT);
        edu.util.viewHTMLById("txtCoiThi", data.SOGIOCOITHI);
        edu.util.viewHTMLById("txtDiem_CoiThi", data.DIEMCOITHI);
        edu.util.viewValById("txtYK_CoiThi", data.YK_SOGIOCOITHI);
        edu.util.viewHTMLById("txtCongDoan", data.DIEMCONGDOAN);
        edu.util.viewValById("txtYK_CongDoan", data.YK_DIEMCONGDOAN);
        edu.util.viewHTMLById("txtDiemHop", data.DIEMHOP);
        edu.util.viewValById("txtYK_DiemHop", data.YK_DIEMHOP);
        me.genSoLuongNguoi(edu.util.returnEmpty(data.TONGDIEM), edu.util.returnEmpty(data.TONGDIEM));
       
        $("#txtXepLoai").html(edu.util.returnEmpty(data.XEPLOAI));
        edu.util.viewValById("txtYK_Ten", data.TENSANGKIENCAITIEN);
        edu.util.viewValById("txtYK_NgayCongNhan", data.NGAYTHANGNAMSANGKIEN);
        edu.util.viewValById("txtYK_SoQuyetDinh", data.SOQUYETDINHSANGKIEN);
        edu.util.viewValById("dropYK_VaiTro", data.VAITROSANGKIEN_ID);
    },
    genSoLuongNguoi: function (iSoNguoiDangO, iTongSo) {
        var me = this;
        //Check xem phòng đã full chưa
        if (iSoNguoiDangO < iTongSo) this.bFullPhong = false;
        else this.bFullPhong = true;
        $("#txtSoNguoiDangO").html('<input type="text" class="knob" value="0" data-width="100" data-height="100" data-fgColor="#3c8dbc">');
        $(".knob").knob({
            draw: function () {
                // "tron" case
                if (this.$.data('skin') == 'tron') {
                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = true;
                    this.g.lineWidth = this.lineWidth;
                    this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);
                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.value);
                        this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.previousColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }
                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();
                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();
                    return false;
                }
            }
        });
        $("#txtSoNguoiDangO input").replaceWith('<label type="text" class="knob" value="80%" data-width="100" data-height="100" data-fgcolor="#3c8dbc" style="width: 29px; height: 16px; position: absolute; vertical-align: middle; margin-top: 36px; margin-left: -75px; border: 0px none; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; font: bold 10px Arial; text-align: center; color: rgb(60, 141, 188); padding: 0px; -moz-appearance: none; font-size: 30px">' + iSoNguoiDangO + '</label >');
    },
};