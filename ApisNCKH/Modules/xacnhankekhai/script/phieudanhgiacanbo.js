/*----------------------------------------------
--Author: 
--Phone: 
--Date of created: 08/12/2018
----------------------------------------------*/
function PhieuDanhGiaCanBo() { }
PhieuDanhGiaCanBo.prototype = {
    dtLuongTangThem: [],
    strKeHoach_Id: '',
    dtXacNhan: [],
    dtHoSoCanBo: [],
    strNhanSu_HoSoCanBo_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        me.getList_XacNhan();
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnAddnew").click(function () {
            me.rewrite();
            me.toggle_form();
        });
        $(".btnExtend_Search").click(function () {
            me.getList_HS();
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_HS();
            }
        });
        me.genSoLuongNguoi("", "");
        /*------------------------------------------
        --Discription: [1] Action LuongTangThem
        --Order: 
        -------------------------------------------*/
        $("#tblPhieuDanhGiaCanBo_KeHoach").delegate(".btnxacnhan_small", "click", function (e) {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                var strNhanSu_HoSoCanBo = $(this).attr("name");
                var strNhanSu_HoSoCanBo_Id = $(this).attr("nhansu_hosocanbo_id");
                var strXacNhan = $(this).find("a").attr("title");
                var confirm = 'Xác nhận <i class="cl-danger">' + strXacNhan + '</i> cho cán bộ <i class="cl-danger">' + strNhanSu_HoSoCanBo + '</i> !';
                confirm += '<div class="clear"></div>';
                confirm += '<input id="txtMota_XacNhan_small" class="form-control" placeholder="Mô tả xác nhận"/>';
                edu.system.confirm(confirm, "q");
                $("#btnYes").click(function (e) {
                    edu.extend.save_XacNhanSanPham(strNhanSu_HoSoCanBo_Id, strId, edu.util.getValById("txtMota_XacNhan_small"));
                    setTimeout(function () {
                        me.getList_HS();
                    }, 500);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnXacNhan_CanBo").click(function () {
            $("#modal_XacNhan").modal("show");
            var strNhanSu_HoSoCanBo = edu.util.objGetDataInData(me.strNhanSu_HoSoCanBo_Id, me.dtHoSoCanBo, "ID")[0]["NHANSU_HOSOCANBO_HOTEN"];
            $("#txtTenSanPham").html(strNhanSu_HoSoCanBo);
            $("#txtNoiDungXacNhanSanPham").val("");
            edu.extend.getList_XacNhanSanPham(me.strNhanSu_HoSoCanBo_Id, "tblModal_XacNhan");
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");
            edu.extend.save_XacNhanSanPham(me.strNhanSu_HoSoCanBo_Id, strTinhTrang, strMoTa);
            setTimeout(function () {
                me.toggle_notify();
                me.getList_HS();
            }, 500);
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
        $("#tblPhieuDanhGiaCanBo_KeHoach").delegate(".btnDanhGia", "click", function () {
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
        $("#tblPhieuDanhGiaCanBo_KeHoach").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/danhgia_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.rewrite();
                me.toggle_phieu();
                me.strNhanSu_HoSoCanBo_Id = strId;
                me.getDetail_PhieuDG(strId, constant.setting.ACTION.VIEW);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave").click(function () {
            me.save_Phieu();
        });
        //Xuất báo cáo
        edu.system.getList_MauImport("zonebtnBaoCao_PDGCB", function (addKeyValue) {
            addKeyValue("strKS_DonViBoPhan_Id", edu.util.getValById("dropSearch_DonViThanhVien"));
            addKeyValue("strGiangVien_Id", edu.util.getValById("dropSearch_ThanhVienDangKy"));
            addKeyValue("strNguoiDangNhap_Id", edu.system.userId);
        });
        $("#dropSearch_DonViThanhVien").on("select2:select", function () {
            me.getList_HS();
        });
    },
    /*------------------------------------------
    --Discription: [0] Common
    -------------------------------------------*/
    page_load: function () {
        var me = this;
        edu.system.page_load();
        me.toggle_notify();
        me.getList_HS();
        me.getList_CoCauToChuc();
        me.getList_NhanSu();
        edu.system.loadToCombo_DanhMucDuLieu("CCB.VTSK", "dropYK_VaiTro");
        /*------------------------------------------
        --Discription: [1] Load LuongTangThem
        -------------------------------------------*/
        edu.system.getList_MauImport("zonebtnBaoCao_PDGCB");
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
    getList_HS: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_TDKT_CanBo/LayDanhSach',
            
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNhanSu_TDKT_KeHoach_Id': "",
            'strThanhVien_Id': edu.util.getValById("dropSearch_ThanhVienDangKy"),
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtHoSoCanBo = data.Data;
                    me.genTable_HS(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genComBo_HS: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NHANSU_HOSOCANBO_HOTEN",
                code: "MA",
            },
            renderPlace: ["dropSearch_ThanhVienDangKy"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
    genTable_HS: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblPhieuDanhGiaCanBo_Tong", iPager);

        var jsonForm = {
            strTable_Id: "tblPhieuDanhGiaCanBo_KeHoach",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {

                        return '<a class="btnEdit poiter" id="' + aData.NHANSU_HOSOCANBO_ID + '">' + aData.NHANSU_HOSOCANBO_HOTEN + '</a>';
                    }
                },
                {
                    "mDataProp": "NHANSU_HOSOCANBO_MASO"
                },
                {
                    "mDataProp": "NHOM"
                },
                {
                    "mDataProp": "NHOMNCKH"
                },
                {
                    "mRender": function (nRow, aData) {

                        return (aData.DIEMCHUYENMON_TC1 + aData.DIEMCHUYENMON_TC2 + aData.DIEMCHUYENMON_TC3 + aData.DIEMCHUYENMON_TC4 + aData.DIEMCHUYENMON_TC5 + aData.DIEMCHUYENMON_TC6 + aData.DIEMCHUYENMON_TC7);
                    }
                },
                {
                    "mDataProp": "DIEMVIETSACH"
                },
                {
                    "mDataProp": "GIOCHUAN_DETAI"
                },
                {
                    "mDataProp": "DIEMDETAI"
                },
                {
                    "mDataProp": "GIOCHUAN_TAPCHIQUOCGIA"
                },
                {
                    "mDataProp": "DIEMBAIBAOTRONGNUOC"
                },
                {
                    "mDataProp": "GIOCHUAN_TAPCHIQUOCTE"
                },
                {
                    "mDataProp": "DIEMBAIBAOQUOCTE"
                },
                {
                    "mData": "TONGGIO",
                    "mRender": function (nrow, aData) {
                        var dsogio = (edu.util.returnZero(aData.GIOCHUAN_DETAI, "") + edu.util.returnZero(aData.GIOCHUAN_TAPCHIQUOCGIA) + edu.util.returnZero(aData.GIOCHUAN_TAPCHIQUOCTE));
                        if (dsogio != 0) return (Math.round(dsogio * 100)) / 100;
                        return "";
                    }
                },
                {
                    "mDataProp": "DIEMTHANHTICHDOTXUAT"
                },
                {
                    "mDataProp": "DIEMVANBANGSANGCHE"
                },
                {
                    "mDataProp": "SOGIOCOITHI"
                },
                {
                    "mDataProp": "SOGIOCHUANCOITHI"
                },
                {
                    "mDataProp": "DIEMCOITHI"
                },
                {
                    "mDataProp": "DIEMCONGDOAN"
                },
                {
                    "mDataProp": "DIEMHOP"
                },
                {
                    "mDataProp": "TONGDIEM"
                },
                {
                    "mDataProp": "XEPLOAI"
                }
                ,
                {
                    "mRender": function (nRow, aData) {
                        var row = "";
                        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((me.dtXacNhan.length - 1) * 40) + 'px">';
                        for (var i = 0; i < me.dtXacNhan.length; i++) {
                            if (me.dtXacNhan[i].MA == "XNKKCHUAKHAI") continue;
                            row += '<div id="' + me.dtXacNhan[i].ID + '" name="' + aData.NHANSU_HOSOCANBO_HOTEN + '" nhansu_hosocanbo_id="' + aData.ID + '" class="btn-large btnxacnhan_small">';
                            row += '<a class="btn" title="' + me.dtXacNhan[i].TEN + '"><i style="' + me.dtXacNhan[i].THONGTIN2 + '" class="' + me.dtXacNhan[i].THONGTIN1 + '"></i></a>';
                            row += '</div>';
                        }
                        return row;
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        var row = "";
                        if (edu.util.checkValue(aData.KETQUAXACNHAN_TEN)) {
                            row += '<div style="margin-left: auto; margin-right: auto; width: 100px">';
                            row += '<div class="btn-large" style="width: 100px">';
                            row += '<a title="' + aData.KETQUAXACNHAN_TEN + '"><i style="' + aData.KETQUAXACNHAN_THONGTIN2 + '" class="' + aData.KETQUAXACNHAN_THONGTIN1 + '"></i> ' + aData.KETQUAXACNHAN_TEN + '</a>';
                            row += '</div>';
                            row += '</div>';
                        }
                        return row;
                    }
                },
                {
                    "mDataProp": "KETQUAXACNHAN_NOIDUNG"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [1] AcessDB PhieuDG
    -------------------------------------------*/

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
    getDetail_PhieuDG: function (strNhanSu_HoSoCanBo_Id) {
        //dang lay theo danh muc TieuChi ==> thuc chat la lay theo tu phieu da gen
        var me = this;

        var obj_list = {
            'action': 'NS_TDKT_CanBo/LayChiTiet',

            'strNhanSu_HoSoCanBo_Id': strNhanSu_HoSoCanBo_Id,
            'strNhanSu_TDKT_KeHoach_Id':""
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
        $("#txtSoNguoiDangO").html('<input type="text" class="knob" value="' + (iSoNguoiDangO * 100 / iTongSo) + '" data-width="100" data-height="100" data-fgColor="#3c8dbc">');

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
    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    getList_XacNhan: function () {
        var me = this;
        var obj_list = {
            'action': 'NCKH_XacNhanTheoNguoiDung/LayDMXacNhanTheoNguoiDung',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadBtnXacNhan(dtReRult);
                    me.page_load();
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "s");
                }
            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    loadBtnXacNhan: function (data) {
        main_doc.PhieuDanhGiaCanBo.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length - 1) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            if (data[i].MA == "XNKKCHUAKHAI") continue;
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + data[i].THONGTIN1 + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },
    /*------------------------------------------
    --Discription: [1] GEN html xác nhận
    -------------------------------------------*/
    getList_XacNhanSanPham: function (strCanBo_Id) {
        var me = this;
        var obj_save = {
            'action': 'NCKH_SP_XacNhanKeKhai/LayDanhSach',
            'strTuKhoa': "",
            'strSanPham_Id': strCanBo_Id,
            'strTinhTrang_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        edu.system.makeRequest({
            success: function (data) {
                var json = data.Data;
                if (json.length > 0) {
                    var aData = json[0];
                    var row = "";
                    if (edu.util.checkValue(aData.TINHTRANG_TEN)) {
                        row += '<div style="margin-left: auto; margin-right: auto; width: 100px">';
                        row += '<div class="btn-large" style="width: 100px">';
                        row += '<a title="' + aData.TINHTRANG_TEN + '"><i style="' + aData.TINHTRANG_THONGTIN2 + '" class="' + aData.TINHTRANG_THONGTIN1 + '"></i> ' + aData.TINHTRANG_TEN + '</a>';
                        row += '</div>';
                        row += '</div>';
                        $("#txtHSXacNhan_NoiDung" + strCanBo_Id).html(edu.util.returnEmpty(aData.NOIDUNG));
                    }
                    $("#txtHSXacNhan" + strCanBo_Id).html(row);
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
    getList_CoCauToChuc: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", me.genComBo_CCTC);
    },
    genComBo_CCTC: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_DonViThanhVien"],
            type: "",
            title: "Chọn đơn vị"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] AcessDB GetList_DeTai
    -------------------------------------------*/
    getList_NhanSu: function () {
        var me = this;
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSach',

            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000,
            'strDaoTao_CoCauToChuc_Id': edu.util.getValById("dropSearch_DonViThanhVien"),
            'strNguoiThucHien_Id': "",
            'dLaCanBoNgoaiTruong': 0
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_NhanSu(data.Data, data.Pager);
                }
                else {
                    console.log(data.Message);
                }
            },
            error: function (er) {  },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);

    },
    genComBo_NhanSu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NHANSU_HOSOCANBO_HOTEN",
                code: "MA",
                Render: function (nrow, aData) {
                    return "<option id='" + edu.system.getRootPathImg(aData.ANH) + "'class='table-img' value='" + aData.ID + "'>" + aData.HOTEN + " - " + edu.util.returnEmpty(aData.MASO) + "</option>";
                }
            },
            renderPlace: ["dropSearch_ThanhVienDangKy"],
            type: "",
            title: "Chọn thành viên"
        };
        edu.system.loadToCombo_data(obj);
    },
};