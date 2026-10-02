/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function PhieuDanhGia() { }
PhieuDanhGia.prototype = {
    dtLuongTangThem: [],
    strKeHoach_Id: '',

    init: function () {
        var me = this;
        me.page_load();
        me.genSoLuongNguoi("", "");
        me.getDetail_PhieuDG();
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
        edu.system.loadToCombo_DanhMucDuLieu("CCB.VTSK", "dropSangKien_VaiTro");
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
    /*------------------------------------------
    --Discription: [1] AcessDB PhieuDG
    -------------------------------------------*/
    save_Phieu: function () {
        var me = this;
        var obj_notify = {};
        var obj_save = {
            'action': 'NS_TDKT_GiangVien/CapNhat',            

            'strNhanSu_HoSoCanBo_Id': edu.system.userId,
            'strNhanSu_TDKT_KeHoach_Id': me.strKeHoach_Id,
            'strYK_SoGioChuan': edu.util.getValById('txtYK_GioChuan'),
            'strYK_SoGioMienGiam': edu.util.getValById('txtYK_GioMienGiam'),
            'strYK_SoGioDinhMucGDNCKH': edu.util.getValById('txtYK_GiangDay'),
            'strYK_SoGioGiangDayDaiHoc': edu.util.getValById('txtYK_GioDinhMucDH'),
            'strYK_SoGioHuongDanDaiHoc': edu.util.getValById('txtYK_GioDinhMucHDDH'),
            'strYK_SoGioGiangDaySauDaiHoc': edu.util.getValById('txtYK_GioSauDH'),
            'strYK_SoGioHuongDanSauDaiHoc': edu.util.getValById('txtYK_GioHDSauDH'),
            'strYK_DiemVietSach': edu.util.getValById('txtYK_VietSach'),
            'strYK_DiemDeTai': edu.util.getValById('txtYK_DeTai'),
            'strYK_DiemBaiBaoTrongNuoc': edu.util.getValById('txtYK_TapChiQuocGia'),
            'strYK_DiemBaiBaoQuocTe': edu.util.getValById('txtYK_TapChiQuocTe'),
            'strYK_DiemVanBangSangChe': edu.util.getValById('txtYK_VBSC'),
            'strYK_SoGioCoiThi': edu.util.getValById('txtYK_CoiThi'),
            'strYK_DiemCongDoan': edu.util.getValById('txtYK_CongDoan'),
            'strYK_DiemHop': edu.util.getValById('txtYK_DiemHop'),
            'strYK_DiemThanhTichDotXuat': edu.util.getValById('txtYK_GiaiThuong'),
            'strTenSangKienCaiTien': edu.util.getValById('txtSangKien_Ten'),
            'strNgayThangNamSangKien': edu.util.getValById('txtSangKien_NgayCongNhan'),
            'strSoQuyetDinhSangKien': edu.util.getValById('txtSangKien_SoQuyetDinh'),
            'strVaiTroSangKien_Id': edu.util.getValById('dropSangKien_VaiTro'),
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
                        if(data.Data.length > 0)
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
            'action': 'NS_TDKT_GiangVien/LayChiTiet',            

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
    /*------------------------------------------
    --Discription: [1] GenHTML PhieuDG
    --ULR:  Modules
    -------------------------------------------*/
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

        edu.util.viewHTMLById("txtGioChuan", data.SOGIOCHUAN);
        edu.util.viewValById("txtYK_GioChuan", data.YK_SOGIOCHUAN);
        edu.util.viewHTMLById("txtGioMienGiam", data.SOGIOMIENGIAM);
        edu.util.viewValById("txtYK_GioMienGiam", data.YK_SOGIOMIENGIAM);
        edu.util.viewHTMLById("txtGiangDay", data.SOGIODINHMUCGIANGDAYNCKH);
        edu.util.viewValById("txtYK_GiangDay", data.YK_SOGIODINHMUCGIANGDAYNCKH);
        edu.util.viewHTMLById("txtGioDinhMucDH", data.SOGIOGIANGDAYDAIHOC);
        edu.util.viewValById("txtYK_GioDinhMucDH", data.YK_SOGIOGIANGDAYDAIHOC);
        edu.util.viewHTMLById("txtGioDinhMucHDDH", data.SOGIOGIANGDAYDAIHOC);
        edu.util.viewValById("txtYK_GioDinhMucHDDH", data.YK_SOGIOHUONGDANDAIHOC);
        edu.util.viewHTMLById("txtGioSauDH", data.SOGIOGIANGDAYSAUDAIHOC);
        edu.util.viewValById("txtYK_GioSauDH", data.YK_SOGIOGIANGDAYSAUDAIHOC);
        edu.util.viewHTMLById("txtGioHDSauDH", data.SOGIOHUONGDANSAUDAIHOC);
        edu.util.viewValById("txtYK_GioHDSauDH", data.YK_SOGIOHUONGDANSAUDAIHOC);
        edu.util.viewHTMLById("txtVietSach", data.DIEMVIETSACH);
        edu.util.viewHTMLById("txtDiemVietSach", data.DIEMVIETSACH);
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
        edu.util.viewValById("txtSangKien_Ten", data.TENSANGKIENCAITIEN);
        edu.util.viewValById("txtSangKien_NgayCongNhan", data.NGAYTHANGNAMSANGKIEN);
        edu.util.viewValById("txtSangKien_SoQuyetDinh", data.SOQUYETDINHSANGKIEN);
        edu.util.viewValById("dropSangKien_VaiTro", data.VAITROSANGKIEN_ID);
        edu.util.viewValById("dropYK_VaiTro", data.VAITROSANGKIEN_ID);
        edu.util.viewHTMLById("txtNCKHChuan", data.SOGIONCKHCHUAN);
        edu.util.viewHTMLById("txtGioGiangDayDH", data.SOGIODH);
        edu.util.viewHTMLById("txtDiem_GiangDayDH", data.SOGIODH);
        edu.util.viewHTMLById("txtGioGiangDaySauDH", data.SOGIOSDH);
        edu.util.viewHTMLById("txtDiem_GiangDaySauDH", data.SOGIOSDH);
        edu.util.viewHTMLById("txtTongGioNCKH", edu.util.returnZero(aData.GIOCHUAN_DETAI) + edu.util.returnZero(aData.GIOCHUAN_TAPCHIQUOCTE) + edu.util.returnZero(aData.GIOCHUAN_TAPCHIQUOCGIA));
        edu.util.viewHTMLById("txtDiemNCKH", data.SOGIOSDH);
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
        $("#txtSoNguoiDangO input").replaceWith('<label type="text" class="knob" value="80%" data-width="100" data-height="100" data-fgcolor="#3c8dbc" style="width: 29px; height: 16px; position: absolute; vertical-align: middle; margin-top: 36px; margin-left: -75px; border: 0px none; background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%; font: bold 10px Arial; text-align: center; color: rgb(60, 141, 188); padding: 0px; -moz-appearance: none; font-size: 30px">' + iSoNguoiDangO +'</label >');
    },
};