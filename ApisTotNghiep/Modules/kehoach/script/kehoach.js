/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoachXuLy() { };
KeHoachXuLy.prototype = {
    dtKeHoachXuLy: [],
    strKeHoachXuLy_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    arrLop: [],
    arrKhoa: [],
    arrChuongTrinh: [],

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_DMHocPhan();
        me.getList_PhanLoai();
        me.getList_QuyTacSinhSoHieu();
        me.getList_QuyTacSinhSoVaoSo();
        edu.extend.genBoLoc_HeKhoa("_KT");
        edu.system.loadToCombo_DanhMucDuLieu("DIEM.THANGDIEM", "dropSearch_ThangDiem_ChuanBi");
        edu.system.loadToCombo_DanhMucDuLieu("TN.KHOA.MO.DULIEU", "", "", data => {
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
            $("#zoneBtnXacNhan").html(row);
        });

        $("#btnSearch").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoachXuLy();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
        });
        $("[id$=chkSelectAll_KeHoachXuLy]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKeHoachXuLy" });
        });
        $("#btnXoaKeHoachXuLy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachXuLy(arrChecked_Id[i]);
                }
                setTimeout(function () {
                    me.getList_KeHoachXuLy();
                }, arrChecked_Id.length * 50);
            });
        });
        $("[id$=chkSelectAll_InputHocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInputHocPhan" });
        });
        $("[id$=chkSelectAll_HocPhan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblHocPhan" });
        });


        $("[id$=chkSelectAll_DTSV_SinhVien]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblInput_DTSV_SinhVien" });
        });

        $(".btnSave_HocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHocPhan", "checkX");
            arrChecked_Id.forEach(e => {
                if ($("#tblInputHocPhan tr[id=" + e + "]").length == 0) {
                    $("#tblInputHocPhan tbody").append('<tr id="' + e + '" class="addHocPhan">' + $("#tblHocPhan tr[id=" + e + "]").html() + '</tr>');
                }
            });
        });

        $("#tblKeHoachXuLy").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblKeHoachXuLy");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoachXuLy, "ID")[0];
                me.viewEdit_KeHoachXuLy(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoachXuLy").delegate('.btnChuanBi', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneChuanBiDuLieu");
            me.getList_HocPhanKeHoach();
            me.getList_ChuanBi();
        });

        $("#tblKeHoachXuLy").delegate('.btnXacNhan', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhanSanPham(me.strKeHoachXuLy_Id, "tblModal_XacNhan");
        });
        $("#btnSave_HocPhan").click(function (e) {
            me.getList_KeHoachXuLy();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchHocPhan").click(function () {
            $("#myModalHocPhan").modal("show");
        });
        //$(".btnSearchDTSV_SinhVien").click(function () {
        //    edu.extend.genModal_SinhVien();
        //    edu.extend.getList_SinhVien("SEARCH");
        //});
        $(".btnSearch_SinhVienDKH").click(function () {
            me.genModal_SinhVienDKH();
            me.getList_SinhVienMDDKH("SEARCH");
        });
        $(".btnSearch_SinhVienKeHoach").click(function () {
            me.genModal_SinhVienKeHoach();
            //me.getList_SinhVienMDDKH("SEARCH");
        });
        $("#modal_sinhvien").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#modal_sinhvien_kehoach").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.addHTMLinto_SinhVien(strNhanSu_Id);
        });
        $("#tblInput_DTSV_SinhVien").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_SinhVien(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_SinhVien(strNhanSu_Id);
                });
            }
        });
        
        //$("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
        //    me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
        //    if (me.arrKhoa.length > 0) {
        //        var strApDungChoKhoa = "";
        //        var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
        //            strApDungChoKhoa += ", " + $(this).text();
        //        });
        //        $("#ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
        //        edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        //$("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
        //    me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
        //    if (me.arrChuongTrinh.length > 0) {
        //        var strApDungChoChuongTrinh = "";
        //        var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
        //            strApDungChoChuongTrinh += ", " + $(this).text();
        //        });
        //        $("#ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
        //        edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        //$("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
        //    me.arrLop = $("#dropSearchModal_Lop_SV").val();
        //    if (me.arrLop.length > 0) {
        //        var strApDungChoLop = "";
        //        var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
        //            strApDungChoLop += ", " + $(this).text();
        //        });
        //        $("#ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
        //        edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
        //        $("#modal_sinhvien").modal("hide");
        //    }
        //});
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_PhamVi(aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_TOCHUCCHUONGTRINH_ID);
                })
            });
            //edu.extend.getList_SinhVien();
        });

        $("#modal_sinhvien").delegate('#btnAdd_KhoaKhoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_KhoaQL_SV").val();
            var arrChecked_Id2 = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0 && arrChecked_Id2.length) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length * arrChecked_Id2.length);
                arrChecked_Id.forEach(e => {
                    arrChecked_Id2.forEach(ele => me.save_PhamVi(ele + e))
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_He_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Khoa_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            var arrChecked_Id = $("#dropSearchModal_Lop_SV").val();
            if (arrChecked_Id.length > 0) {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    me.save_PhamVi(e);
                })
                $("#modal_sinhvien").modal("hide");
            }
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearchDTSV_GiangVien").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
        });
        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblKeHoachXuLy").delegate('.btnDSDoiTuong', 'click', function (e) {
            $('#myModal').modal('show');
            me.getList_QuanSoTheoLop(this.id);
        });

        $("#tblKeHoachXuLy").delegate('.btnDieuKienXet', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneKeThua");
            //var aData = me.dtKeHoachXuLy.find(e => e.ID == strId);
            $("#txtXauDieuKien").val("")
            $("#txtXauDieuKien").html("");
            me.getList_XetDuyet();
            me.getList_DieuKien();
        });

        $("#txtSearchHocPhan").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblHocPhan tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });

        $("#tblInputDanhSachNhanSu").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTML_NhanSu(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_ThanhVien(strNhanSu_Id);
                });
            }
        });
        $(".btnDeleteHocPhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInputHocPhan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_HocPhan(arrChecked_Id[i]);
                }
            });
        });
        $(".btnDeleteDTSV_SinhVien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });

        $("#btnAdd_KeThua").click(function () {
            me["strLoai"] = "DIEUKIEN"
            $("#myModalKeThua").modal("show");
        });
        $("#btnAdd_KeThua2").click(function () {
            me["strLoai"] = "XEPLOAI"
            $("#myModalKeThua").modal("show");
        });
        $("#btnSave_DieuKien").click(function () {
            me.save_XetDuyet();
        });

        $("#btnSave_DieuKien2").click(function () {
            var SoLuong = $("#tblDieuKien .xaudieukien");
            var arrThem = [];
            var arrXoa = [];
            SoLuong.each(function () {
                var point = $(this);
                if (point.val() != point.attr("name")) arrThem.push(this.id.replace("txtXauDieuKien", ""))
            });
            if (arrThem.length > 0) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", (arrThem.length));
                //arrXoa.forEach(e => me.save_ThucHienXetTungSV(strNguoiHoc_Id, 0.0))
                arrThem.forEach(e => me.save_XepLoai(e))
            }
        });
        $("#btnDelete_DieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDieuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_XepLoai(arrChecked_Id[i]);
                }
            });
        });

        $("#btnSave_KeThua").click(function () {
            $('#myModalKeThua').modal('hide');
            edu.system.confirm("Bạn có muốn kế thừa không?");
            $("#btnYes").click(function (e) {
                if (me["strLoai"] == "DIEUKIEN") {
                    me.save_KeThuaDieuKien(edu.util.getValById('dropHeDaoTao_KT'));
                } else {
                    me.save_KeThuaXepLoai(edu.util.getValById('dropHeDaoTao_KT'));
                }
            });
        });

        $("#btnAdd_KeThuaTheoNhom").click(function () {
            $("#myModalKeThuaNhom").modal("show");
            me.getList_KeThuaNhom();
        });

        $("#btnSave_KeThuaTheoNhom").click(function () {
            $('#myModalKeThuaNhom').modal('hide');
            edu.system.confirm("Bạn có muốn kế thừa không?");
            $("#btnYes").click(function (e) {
                me.save_KeThuaXepLoai(edu.util.getValById('dropKeHoachKT'));
                me.save_KeThuaDieuKien(edu.util.getValById('dropKeHoachKT'));
            });
        });
        
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            me.save_XacNhanSanPham(me.strKeHoachXuLy_Id, strTinhTrang, strMoTa);
            $("#modal_XacNhan").modal('hide');
        });
        //var dHN = new Date(Date.now());
        //JOB_TUDONG.forEach(aData => {
        //    let bCall = false;
        //    switch (aData.PHANLOAI) {
        //        case "HANGNGAY": {
        //            bCall = true;
        //        }; break;
        //        case "DAUTUAN": {
        //            if (dHN.getDay() == 1) bCall = true;
        //        }; break;
        //        case "CUOITUAN": {
        //            if (dHN.getDay() == 0) bCall = true;
        //        }; break;
        //        case "HANGTHANG_DAUTHANG": {
        //            if (dHN.getDate() == 1) bCall = true;
        //        }; break;
        //        case "HANGTHANG_CUOITHANG": {
        //            if (dHN.getDate() == Date(dHN.getFullYear(), dHN.getMonth() + 1, 0).getDate()) bCall = true;
        //        }; break;
        //    }
        //    if(bCall) PKG_JOB_TUDONG.JOB_TUDONG(aData.ID, "", "");
        //})
        $("#tblDieuKien").delegate('.btnDKHaBac', 'click', function () {
            var strId = this.id;
            $('#myModalDieuKienHaBac').modal('show');
            me.getList_DieuKienHaBac(strId);
        });


        $("#btnSearch_ChuanBi").click(function (e) {
            me.getList_ChuanBi();
        });
        $("#txtSearch_ChuanBi").keypress(function (e) {
            if (e.which === 13) {
                me.getList_ChuanBi();
            }
        });
        $("#btnSave_ChuanBi").click(function () {
            edu.system.confirm("Bạn có muốn Thực hiện tạo dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.save_ChuanBi();
            });
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachXuLy_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        $("#myModal input[type=checkbox]").each(function () {
            $(this).attr('checked', false);
            $(this).prop('checked', false);
        })
        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropThoiGianDaoTao", edu.util.getValById("dropSearch_ThoiGianDaoTao"));
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("dropHieuLuc", 1);
        edu.util.viewValById("dropQuyTacSinhSoHieu", "");
        edu.util.viewValById("dropQuyTacSinhSoVaoSo", "");
        $("#rowQuyTacSinh").hide();
        $("#tblInput_DTSV_SinhVien tbody").html("");
        $("#tblInputDanhSachNhanSu tbody").html("");
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoachXuLy();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoachXuLy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
                    me.cbGenCombo_KeHoachXuLy(dtReRult)
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
    getList_KeHoachXuLy2: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strPhanLoai_Id': edu.util.getValById('dropSearch_PhanLoai'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    $("#tblKeHoachXuLy tr[id=" + me.strKeHoachXuLy_Id + "] .btnDieuKienXet").trigger("click");
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
    save_KeHoachXuLy: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/FSkkLB4VDx4KJAkuICIp',
            'func': 'pkg_totnghiep_thongtin.Them_TN_KeHoach',
            'iM': edu.system.iM,
            'strId': me.strKeHoachXuLy_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById('txtTen'),
            'strMa': edu.util.getValById('txtMa'),
            'strNgayBatDau': edu.util.getValById('txtTuNgay'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgay'),
            'dMoChoNguoiHocDangKy': edu.util.getValById('dropHieuLuc'),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGianDaoTao'),
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'dCoTinhLaiDiemTKHP': $("#chkCoTinhLaiDiemTKHP").is(':checked') ? 1 : undefined,
            'dKetQuaChinhThuc': edu.util.getValById('dropKetQua'),
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_ThongTin_MH/EjQgHhUPHgokCS4gIikP';
            obj_save.func = 'pkg_totnghiep_thongtin.Sua_TN_KeHoach';
            obj_save.strTN_QuyTacSinhSoHieu_Ad_Id = edu.util.getValById('dropQuyTacSinhSoHieu');
            obj_save.strTN_QuyTacSinhSoVSo_Ad_Id = edu.util.getValById('dropQuyTacSinhSoVaoSo');
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";
                    
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                        setTimeout(function () {
                            me.strKeHoachXuLy_Id = strKeHoachXuLy_Id;
                            me.getList_ThanhVien();
                            me.getList_HocPhan();
                            $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
                            $(".btnOpenDelete").show();
                            $(".zoneOpenNew").hide();
                        }, 2000);
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if ($(this).attr("name") == "new"){
                            me.save_SinhVien(strNhanSu_Id, strKeHoachXuLy_Id);
                        }
                    });
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strKeHoachXuLy_Id);
                    });

                    for (var i = 0; i < me.arrKhoa.length; i++) {
                        me.save_Khoa(strKeHoachXuLy_Id, me.arrKhoa[i]);
                    }
                    for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                        me.save_ChuongTrinh(strKeHoachXuLy_Id, me.arrChuongTrinh[i]);
                    }
                    for (var i = 0; i < me.arrLop.length; i++) {
                        me.save_Lop(strKeHoachXuLy_Id, me.arrLop[i]);
                    }
                    $("#tblInputHocPhan tbody tr[class=addHocPhan]").each(function () {
                        me.save_HocPhan(this.id, strKeHoachXuLy_Id);
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachXuLy: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach/Xoa',
            

            'strIds': strId,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_KeHoachXuLy();
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
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    save_PhamVi: function (strPhamViApDung_Id) {
        var me = this;
        var obj_save = {
            'action': 'TN_ThongTin/Them_TN_KeHoach_PhamVi_ToanBo',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strPhamViApDung_Id': strPhamViApDung_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            //'iM': edu.system.iM,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_Lop: function (strTN_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViLop',

            'strId':"",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuongTrinh: function (strTN_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViCT',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Khoa: function (strTN_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/Them_TN_KeHoach_PhamViKhoa',

            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strQLSV_TrangThai_Id': edu.extend.getCheckedCheckBoxByClassName('ckbDSTrangThaiSV').toString(),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'TN_KeHoach/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoachXuLy();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoachXuLy/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_KeHoachXuLy: function (data, iPager) {
        var me = this;
        $("#lblKeHoachXuLy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachXuLy",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0,4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "DAOTAO_THOIGIANDAOTAO"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default" id="DSPhanCong' + aData.ID + '" title="Chi tiết"></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSDoiTuong" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDieuKienXet" id="' + aData.ID + '" title="Chi tiết">Điều kiện xét</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        let temp = aData.TINHTRANG_KHOA_TEN ? aData.TINHTRANG_KHOA_TEN : 'Chi tiết';
                        return '<span><a class="btn btn-default btnXacNhan" id="' + aData.ID + '" title="Chi tiết">' + temp + '</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChuanBi" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                },

                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOICUOI_TAIKHOAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
        for (var i = 0; i < data.length; i++) {
            me.getList_PhanCong(data[i].ID);
        }
    },

    getList_KeThuaNhom: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_PhamVi_ApDung',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhanLoai_Id': me.strKeHoachXuLy_Id,
            'iM': edu.system.iM,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_KeHoachXuLy(dtReRult)
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
    cbGenCombo_KeHoachXuLy: function (data) {
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
            renderPlace: ["dropKeHoachKT"],
            type: "",
            title: "Chọn nhóm",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_QuyTacSinhSoHieu: function () {
        var me = this;
        var obj_list = {
            'action': 'TN_VanBang_ChungChi_Chung_MH/DSA4BRIVDx4QNDgVICISKC8pHhIuCSgkNB4AJQPP',
            'func': 'PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoHieu_Ad',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenCombo_QuyTacSinhSoHieu(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    cbGenCombo_QuyTacSinhSoHieu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyTacSinhSoHieu"],
            type: "",
            title: "--Chọn quy tắc sinh số hiệu--",
        }
        edu.system.loadToCombo_data(obj);
    },
    getList_QuyTacSinhSoVaoSo: function () {
        var me = this;
        var obj_list = {
            'action': 'TN_VanBang_ChungChi_Chung_MH/DSA4BRIVDx4QNDgVICISKC8pHhIuFyAuEi4eACUP',
            'func': 'PKG_VANBANG_CHUNGCHI_CHUNG.LayDSTN_QuyTacSinh_SoVaoSo_Ad',
            'iM': edu.system.iM,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.cbGenCombo_QuyTacSinhSoVaoSo(data.Data);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    cbGenCombo_QuyTacSinhSoVaoSo: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropQuyTacSinhSoVaoSo"],
            type: "",
            title: "--Chọn quy tắc sinh số vào sổ--",
        }
        edu.system.loadToCombo_data(obj);
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("dropThoiGianDaoTao", data.DAOTAO_THOIGIANDAOTAO_ID);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        edu.util.viewValById("dropHieuLuc", data.MOCHONGUOIHOCDANGKY);
        $("#chkCoTinhLaiDiemTKHP").prop("checked", data.COTINHLAIDIEMTKHP);
        edu.util.viewValById("dropQuyTacSinhSoHieu", data.PHOI_TN_QUYTACSINHSOHIEU_AD_ID);
        edu.util.viewValById("dropQuyTacSinhSoVaoSo", data.PHOI_TN_QUYTACSINHSOVSO_AD_ID);
        $("#rowQuyTacSinh").show();
        me.strKeHoachXuLy_Id = data.ID;

        me.arrLop = [];
        me.arrKhoa = [];
        me.arrChuongTrinh = [];
        $("#ApDungChoLop").html("");
        $("#ApDungChoKhoa").html("");
        $("#ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_ThanhVien();
        me.getList_HocPhan();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_PhanCong: function (strTN_KeHoach_Id) {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strNhanSu = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strNhanSu += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strNhanSu != "") strNhanSu = strNhanSu.substring(1);
                    $("#DSPhanCong").html(strNhanSu);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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

    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_DoiTuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDoiTuong = "";
                    for (var i = 0; i < data.Data.length; i++) {
                        strDoiTuong += ", " + data.Data[i].NGUOICUOI_TENDAYDU;
                    }
                    if (strDoiTuong != "") strDoiTuong = strDoiTuong.substring(1);
                    $("#DSDoiTuong").html(strDoiTuong);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('tblInput_DTSV_SinhVien_input'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genTable_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_KeHoachXuLy_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/ThemMoi',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strQLSV_KeHoachXuLy_Id,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_LopQuanLy_Id': aData.DAOTAO_LOPQUANLY_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {

                    edu.system.alert("Thêm sinh viên thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_SinhVien: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TN_KeHoach_PhamVi/Xoa',
            
            'strIds': strIds,
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
                    edu.system.alert("Xóa thành công!");
                    
                }
                else {
                    obj = {
                        content: obj_delete.action + ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: obj_delete.action + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
                
            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [2] GenHTML NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_SinhVien: function (data, iPager) {
        var me = this;
        //3. create html
        me.arrSinhVien_Id = [];
        //$("#tblInput_DTSV_SinhVien tbody").html("");
        //for (var i = 0; i < data.length; i++) {
        //    var html = "";
        //    html += "<tr id='rm_row" + data[i].QLSV_NGUOIHOC_ID + "'>";
        //    html += "<td class='td-center'>" + (i + 1) + "</td>";
        //    html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(data[i].ANH) + "'></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_MASO) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].QLSV_NGUOIHOC_HOTEN) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_LOPQUANLY_TEN) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_CHUONGTRINH_TEN) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].DAOTAO_KHOADAOTAO_TEN) + "</span></td>";
        //    html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
        //    html += "</tr>";
        //    //4. fill into tblNhanSu
        //    $("#tblInput_DTSV_SinhVien tbody").append(html);
        //    //5. create data danhmucvaitro
        //    me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
        //    me.arrSinhVien.push(data[i]);
        //}
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVien",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVien()",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 1,7],
            },
            aoColumns: [
                {
                    "mDataProp": "ANH"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                }
                
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        for (var i = 0; i < data.length; i++) {
            me.arrSinhVien_Id.push(data[i].QLSV_NGUOIHOC_ID);
            me.arrSinhVien.push(data[i]);
        }
    },
    addHTMLinto_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrSinhVien_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            }
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            }
            edu.system.notifyLocal(obj_notify);
            me.arrSinhVien_Id.push(strNhanSu_Id);
        }
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.dtSinhVien, "ID");
        console.log(aData);
        me.arrSinhVien.push(aData);
        //2. get id and get val
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "' name='new'>";
        html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
        html += "<td class='td-center'><img class='table-img' src='" + edu.system.getRootPathImg(aData.QLSV_NGUOIHOC_ANH) + "'></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_MASO + "</span></td>";
        html += "<td class='td-left'><span>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_LOPQUANLY_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_CHUONGTRINH_TEN + "</span></td>";
        html += "<td class='td-left'><span>" + aData.DAOTAO_KHOADAOTAO_TEN + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInput_DTSV_SinhVien tbody").append(html);
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = main_doc.KeHoachXuLy;
        $("#rm_row" + strNhanSu_Id).remove();
        edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        if (me.arrSinhVien_Id.length === 0) {
            $("#tblInput_DTSV_SinhVien tbody").html("");
            $("#tblInput_DTSV_SinhVien tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVienDKH: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_HocKy_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_He_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả hệ đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Khoa_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả khóa đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_ChuongTrinh_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả chương trình đào tạo -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_Lop_SV" class="select-opt" multiple="multiple" style="width:100% !important">';
        html += '<option value=""> -- Tất cả lớp quản lý -- </option>';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '<div class="box box-solid" style="display: none">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tùy chọn thêm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Khoa"><i class="fa fa-plus fa-customer"></i> Thêm từng khóa</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_ChuongTrinh"><i class="fa fa-plus fa-customer"></i> Thêm từng chương trình</a>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<a class="btn btn-soft-success" href="#" id="btnAdd_Lop"><i class="fa fa-plus fa-customer"></i> Thêm từng lớp</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<div class="pull-left">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonSinhVien" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';

        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Mã số</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_SinhVien"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien").html("");
        $("#modal_sinhvien").append(html);
        $("#modal_sinhvien").modal("show");
        $("#txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienMD("SEARCH");
            }
        });
        $('#dropSearchModal_HocKy_SV').select2();
        $('#dropSearchModal_He_SV').select2();
        $('#dropSearchModal_Khoa_SV').select2();
        $('#dropSearchModal_ChuongTrinh_SV').select2();
        $('#dropSearchModal_Lop_SV').select2();
        me.getList_ThoiGianDaoTaoDKH();
        $("#btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMDDKH("SEARCH");
        });
        $('#dropSearchModal_HocKy_SV').on('select2:select', function (e) {
            me.getList_HeDaoTao();
        });
        $('#dropSearchModal_He_SV').on('select2:select', function (e) {
            me.getList_KhoaDaoTao();
        });
        $('#dropSearchModal_Khoa_SV').on('select2:select', function (e) {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
        });
        $('#dropSearchModal_ChuongTrinh_SV').on('select2:select', function (e) {
            me.getList_LopQuanLy();
        });

        $('#dropSearchModal_Lop_SV').on('select2:select', function (e) {
            me.getList_SinhVienMDDKH();
        });

        $("#modal_sinhvien").delegate("#chkSelectAll_SinhVien", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        });
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 10;
        $("#modal_sinhvien").delegate("#btnChonSinhVien", "click", function (e) {
            e.stopImmediatePropagation();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_SinhVien", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_SinhVien #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
    },
    getList_SinhVienMDDKH: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayDanhSachHoSoTheoDangKy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strHeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strKhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strLopQuanLy_Id': edu.util.getValById('dropSearchModal_Lop_SV'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_SinhVienDKH(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    cbGetListModal_SinhVienDKH: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "tblModal_SinhVien",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVienMDDKH('SEARCH')",
                iDataRow: iPager,
                //bLeft: false,
                //bChange: false
            },
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },

    /*----------------------------------------------
    --Author: 
    --Date of created: 
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    genModal_SinhVienKeHoach: function () {
        var me = this;
        var html = "";
        html += '<div class="modal-dialog" style = "width:80%" >';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h4 class="modal-title modal-name" id="myModalLabel"><i class="fa fa-search"></i> Tìm kiếm sinh viên</h4>';
        html += '</div>';
        html += '<div class="modal-body" id="modalContent">';
        html += '<div class="row">';
        html += '<div class="col-sm-3">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="search">';
        html += '<div class="item-modal">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Tìm kiếm</p>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<input id="txtSearchModal_TuKhoa_SV" class="form-control" placeholder="Nhập từ khóa tìm kiếm" />';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_LoaiKeHoach_SV" class="select-opt" style="width:100% !important">';
        html += '</select>';
        html += '</div>';
        html += '<div class="item-modal">';
        html += '<select id="dropSearchModal_KeHoach_SV" class="select-opt" style="width:100% !important">';
        html += '</select>';
        html += '</div>';
        
        html += '<div class="item-modal">';
        html += '<a class="btn btn-default" href="#" id="btnSearch_ModalSinhVien"><i class="fa fa-search fa-customer"></i> Tìm kiếm</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        

        html += '</div>';
        html += '<div class="col-sm-9">';
        html += '<div class="box box-solid">';
        html += '<div class="box-body">';
        html += '<div class="item-modal">';
        html += '<div class="pull-left">';
        html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Danh sách</p>';
        html += '</div>';
        html += '<div class="pull-right">';
        html += '<a class="btn btn-primary" id="btnChonSinhVien" href="#"><i class="fa fa-plus"></i> Chọn</a>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';

        html += '<div class="scroll-table-x">';
        html += '<table id="tblModal_SinhVien" class="table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th class="td-fixed td-center">Stt</th>';
        html += '<th class="td-center">Mã số</th>';
        html += '<th class="td-left">Họ tên</th>';
        html += '<th class="td-left">Ngày sinh</th>';
        html += '<th class="td-left">Lớp</th>';
        html += '<th class="td-left">Chương trình</th>';
        html += '<th class="td-left">Khóa</th>';
        html += '<th class="td-fixed td-center">#</th>';
        html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll_SinhVien"></th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="modal-footer">';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal" id="btnCancel"><i class="fa fa-times-circle"></i> Đóng</button>';
        html += '</div>';
        html += '</div>';
        html += '</div >';
        $("#modal_sinhvien_kehoach").html(html);
        $("#modal_sinhvien_kehoach").modal("show");
        $("#modal_sinhvien_kehoach #txtSearchModal_TuKhoa_SV").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_SinhVienKeHoach("SEARCH");
            }
        });
        $('#modal_sinhvien_kehoach #dropSearchModal_KeHoach_SV').select2();
        $('#modal_sinhvien_kehoach #dropSearchModal_LoaiKeHoach_SV').select2();
        me.getList_KeHoachMD();
        //$('#dropSearchModal_He_SV').select2();
        //$('#dropSearchModal_Khoa_SV').select2();
        //$('#dropSearchModal_ChuongTrinh_SV').select2();
        //$('#dropSearchModal_Lop_SV').select2();
        //me.getList_ThoiGianDaoTaoDKH();
        $("#modal_sinhvien_kehoach #btnSearch_ModalSinhVien").click(function () {
            me.getList_SinhVienMDKeHoach("SEARCH");
        }); 
        $('#modal_sinhvien_kehoach #dropSearchModal_LoaiKeHoach_SV').on('select2:select', function (e) {
            me.getList_KeHoachMD();
        });
        $('#modal_sinhvien_kehoach #dropSearchModal_KeHoach_SV').on('select2:select', function (e) {
            me.getList_SinhVienMDKeHoach();
        });


        $("#modal_sinhvien_kehoach").delegate("#chkSelectAll_SinhVien", "click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModal_SinhVien" });
        });
        edu.system.pageIndex_default = 1;
        edu.system.pageSize_default = 10;
        $("#modal_sinhvien_kehoach").delegate("#btnChonSinhVien", "click", function (e) {
            e.stopImmediatePropagation();
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModal_SinhVien", "checkX");
            for (var i = 0; i < arrChecked_Id.length; i++) {
                $("#tblModal_SinhVien #slnhansu" + arrChecked_Id[i]).trigger("click");
            }
        });
        edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearchModal_LoaiKeHoach_SV");
    },
    getList_SinhVienMDKeHoach: function (type, palce) {
        //--Edit
        var me = this;
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': edu.util.getValById('dropSearchModal_KeHoach_SV'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.cbGetListModal_SinhVienKeHoach(dtResult, iPager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    cbGetListModal_SinhVienKeHoach: function (data, iPager) {
        var me = this;
        me.dtSinhVien = data;
        var jsonForm = {
            strTable_Id: "modal_sinhvien_kehoach #tblModal_SinhVien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVienMDDKH('SEARCH')",
            //    iDataRow: iPager,
            //    //bLeft: false,
            //    //bChange: false
            //},
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO",
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        return html;
                    }
                }
                , {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH",
                }
                , {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN",
                }
                , {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<a id="slnhansu' + aData.ID + '" class="btnSelect poiter">Chọn</a>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" class="CheckOne" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        setTimeout(function () {
            $("#txtSearchModal_TuKhoa_NS").focus();
        }, 500);
    },
    
    getList_KeHoachMD: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_KeHoach',
            'strTuKhoa': edu.util.getValById('txtSearchA'),
            'strPhanLoai_Id': edu.util.getValById('dropSearchModal_LoaiKeHoach_SV'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTaoA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_MDKeHoach(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_MDKeHoach: function (data) {
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
            renderPlace: ["dropSearchModal_KeHoach_SV"],
            type: "",
            title: "Chọn kế hoạch",
        }
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==>Systemroot
    --ULR: Modules
    -------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayHeDaoTaoTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_HeDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayKhoaHocTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_KhoaDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayChuongTrinhTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ChuongTrinhDaoTao(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayLopQuanLyTheoDangKy',
            'type': 'GET',
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearchModal_HocKy_SV'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearchModal_He_SV'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearchModal_Khoa_SV'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearchModal_ChuongTrinh_SV'),
            'strTN_KeHoach_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_LopQuanLy(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", me.cbGenCombo_ThoiGianDaoTao);
    },
    getList_ThoiGianDaoTaoDKH: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_Chung/LayThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGianDaoTao_DKH(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_NamNhapHoc: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_NamNhapHoc/LayDanhSach',

            'strNguoiThucHien_Id': '',
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_NamNhapHoc(json);
                } else {
                    edu.system.alert("Lỗi: " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alert("Lỗi: " + JSON.stringify(er));
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_KhoaQuanLy: function () {
        var me = this;
        var objList = {
        };
        edu.system.getList_KhoaQuanLy({}, "", "", me.cbGenCombo_KhoaQuanLy);
    },
    /*------------------------------------------
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    cbGenCombo_HeDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_He_SV"],
            type: "",
            title: "Tất cả hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_He_SV").val("").trigger("change");
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_Khoa_SV"],
            type: "",
            title: "Tất cả khóa đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_Khoa_SV").val("").trigger("change");
    },
    cbGenCombo_ChuongTrinhDaoTao: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_ChuongTrinh_SV"],
            type: "",
            title: "Tất cả chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_ChuongTrinh_SV").val("").trigger("change");
    },
    cbGenCombo_LopQuanLy: function (data) {
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
            renderPlace: ["dropSearchModal_Lop_SV"],
            type: "",
            title: "Tất cả lớp",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_Lop_SV").val("").trigger("change");
    },
    cbGenCombo_ThoiGianDaoTao: function (data) {
        var me = main_doc.KeHoachXuLy;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropKeHoachXuLy_ThoiGianDaoTao"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_ThoiGianDaoTao").val("").trigger("change");
        me.cbGenCombo_ThoiGianDaoTao_input(data);
    },
    cbGenCombo_ThoiGianDaoTao_input: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGianDaoTao"],
            type: "",
            title: "Chọn học kỳ",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_ThoiGianDaoTao_DKH: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearchModal_HocKy_SV"],
            type: "",
            title: "Tất cả học kỳ",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearchModal_HocKy_SV").val("").trigger("change");
    },
    genList_TrangThaiSV: function (data) {
        var me = this;
        main_doc.KeHoachXuLy.dtTrangThai = data;
        var row = '';
        row += '<div class="col-lg-3 checkbox-inline user-check-print">';
        row += '<input type="checkbox" class="ckbDSTrangThaiSV_ALL" style="float: left;"  checked="checked"/>';
        row += '<span><b>Tất cả</b></p></span>';
        row += '</div>';
        for (var i = 0; i < data.length; i++) {
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-3 checkbox-inline user-check-print">';
            row += '<input checked="checked" type="checkbox" style="float: left;"  id="' + data[i].ID + '" class="ckbDSTrangThaiSV" title="' + data[i].TEN + '"' + strcheck + '/>';
            row += '<span><p>' + data[i].TEN + '</p></span>';
            row += '</div>';
        }
        $("#DSTrangThaiSV").html(row);
    },
    cbGenCombo_NamNhapHoc: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAMNHAPHOC",
                parentId: "",
                name: "NAMNHAPHOC",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_NamNhapHoc"],
            type: "",
            title: "Tất cả năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },
    cbGenCombo_KhoaQuanLy: function (data) {
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
            renderPlace: ["dropSearch_KhoaQuanLy"],
            type: "",
            title: "Tất cả khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
        if (data.length != 1) $("#dropSearch_NguoiThu").val("").trigger("change");
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_ThanhVien: function (strNhanSu_Id, strRowID, strKeHoachXuLy_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_NhanSu/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strKeHoachXuLy_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TN_KeHoach_NhanSu/CapNhat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_NhanSu/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtSearch_TuKhoa'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianDaoTao'),
            'strNhanSu_HoSoCanBo_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ThanhVien(dtResult);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach_NhanSu/Xoa',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strIds': strNhanSu_Id,
            'strNguoiThucHien_Id': edu.system.userId
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
                    me.getList_ThanhVien();
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
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
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].ID + "' name='" + data[i].NGUOIDUNG_ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TAIKHOAN) + "</span></td>";
            html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].NGUOIDUNG_TENDAYDU) + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter' style='color: red'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
        edu.system.pickerdate();
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = this;
        if (bcheckadd == true && me.arrNhanSu_Id.length > 0) return; //Nếu có dữ liệu thành viên thì bỏ qua
        //[1] add to arrNhanSu_Id
        if (edu.util.arrEqualVal(me.arrNhanSu_Id, strNhanSu_Id)) {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "w",
                title: "Đã tồn tại!"
            };
            edu.system.notifyLocal(obj_notify);
            return false;
        }
        else {
            obj_notify = {
                renderPlace: "slnhansu" + strNhanSu_Id,
                type: "s",
                title: "Đã chọn!"
            };
            edu.system.notifyLocal(obj_notify);
            me.arrNhanSu_Id.push(strNhanSu_Id);
        }
        //2. get id and get val
        var $hinhanh = "#sl_hinhanh" + strNhanSu_Id;
        var $hoten = "#sl_hoten" + strNhanSu_Id;
        var $ma = "#sl_ma" + strNhanSu_Id;
        var valHinhAnh = $($hinhanh).attr("src");
        var valHoTen = $($hoten).text();
        var valMa = $($ma).text();
        var objNhanSu = edu.util.objGetOneDataInData(strNhanSu_Id, edu.extend.dtNhanSu, "ID");
        //3. create html
        var html = "";
        var strRowID = edu.util.uuid().substr(2);
        html += "<tr id='" + strRowID + "' name='" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strRowID + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html); edu.system.pickerdate();
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#" + strNhanSu_Id;
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },

    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_QuanSoTheoLop: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_PhamVi/LayDanhSach',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiDung_Id': edu.util.getValById('dropAAAA'),
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_QuanSoTheoLop(dtReRult, data.Pager, strTN_KeHoach_Id);
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
    genTable_QuanSoTheoLop: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblQuanSoLop",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN",
                    "mRender": function (nRow, aData) {
                        return aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN;
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "QLSV_TRANGTHAINGUOIHOC_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_CHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    /*------------------------------------------
    --Discription: [2] GenHTML ThanhVien/NhanSu
    --ULR:  Modules
    -------------------------------------------*/

    getList_DMHocPhan: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KHCT_HocPhan/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('tblHocPhan_input'),
            'strDaoTao_MonHoc_Id': edu.util.getValById('dropAAAA'),
            'strThuocBoMon_Id': edu.util.getValById('dropAAAA'),
            'strThuocTinhHocPhan_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DMHocPhan(dtReRult, data.Pager, strTN_KeHoach_Id);
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
    genTable_DMHocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhan",

            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_DMHocPhan()",
                iDataRow: iPager,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0,3],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                
                {
                    "mDataProp": "TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_HocPhan: function (strDaoTao_HocPhan_Id, strTN_KeHoach_Id) {
        var me = this;
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_HocPhan/Them_TN_KeHoach_HocPhan',
            'type': 'POST',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strTN_KeHoach_Id': strTN_KeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công");
                    } else {
                        edu.system.alert("Cập nhật thành công");
                    }
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TN_KeHoach_HocPhan/LayDSTN_KeHoach_HocPhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_HocPhan(dtResult, data.Pager);
                }
                else {
                    edu.system.alert(obj_list.action + ": " + data.Message, "w");
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
    delete_HocPhan: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_KeHoach_HocPhan/Xoa_TN_KeHoach_HocPhan',
            'type': 'POST',
            'strIds': strIds,
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
                }
                else {
                    obj = {
                        content: data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_BaoVeLuanVan_NhanSu/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HocPhan();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HocPhan: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblInputHocPhan",
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_HocPhan()",
                iDataRow: iPager
            },

            aaData: data,
            colPos: {
                center: [0, 3],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },

                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    getList_PhanLoai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_Chung/LayDSPhanLoaiTheoNguoiDung',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genComBo_PhanLoai(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_PhanLoai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA"
            },
            renderPlace: ["dropSearch_PhanLoai","dropPhanLoai"],
            type: "",
            title: "Chọn phân loại"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_XetDuyet: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/LayDSTN_XetDuyet_DieuKien_Ad',
            'type': 'POST',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': me.strKeHoachXuLy_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        me["dtXetDuyet"] = dtReRult[0];
                        $("#txtXauDieuKien").val(edu.util.returnEmpty(dtReRult[0].XAUDIEUKIEN))
                        $("#txtXauDieuKien").html(edu.util.returnEmpty(dtReRult[0].XAUDIEUKIEN));
                    }
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_DieuKien: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/LayDSTN_XepLoai_DieuKien_Ad',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.util.getValById('dropAAAA'),
            'strXepLoai_Id': edu.util.getValById('dropAAAA'),
            'strPhamViApDung_Id': me.strKeHoachXuLy_Id,
            'strPhanCapApDung_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 1000000,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDieuKien"] = dtReRult;
                    me.genTable_DieuKien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genTable_DieuKien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDieuKien",
            aaData: data,
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    //"mDataProp": "XEPLOAI_TEN",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDKHaBac" id="' + aData.ID + '" title="Chi tiết">' + edu.util.returnEmpty(aData.XEPLOAI_TEN) + '</a></span>';
                    }
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<textarea id="txtXauDieuKien' + aData.ID + '" class="form-control xaudieukien" value="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" name="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" style="height: 300px !important">' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '</textarea>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },

    save_XetDuyet: function (strId) {
        var me = this;
        var aData = me.dtXetDuyet;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/Sua_TN_XetDuyet_DieuKien_Ad',
            'type': 'POST',
            'strId': aData.ID,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': $("#txtXauDieuKien").val(),
            'strPhanLoai_Id': aData.PHANLOAI_ID,
            'dThuTu': -1,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strPhamViApDung_Id': aData.PHAMVIAPDUNG_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_XetDuyet();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_HocPhanCT();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_XepLoai: function (strId) {
        var me = this;
        var aData = me.dtDieuKien.find(e => e.ID == strId);
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/Sua_TN_XepLoai_DieuKien_Ad',
            'type': 'POST',
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.util.getValById('txtXauDieuKien' + strId),
            'strPhanLoai_Id': aData.PHANLOAI_ID,
            'strXepLoai_Id': aData.XEPLOAI_ID,
            'dThuTu': aData.THUTU ? aData.THUTU : undefined,
            'strMoTa': aData.MOTA,
            'strPhamViApDung_Id': aData.PHAMVIAPDUNG_ID,
            'strDaoTao_ThoiGianDaoTao_Id': aData.DAOTAO_THOIGIANDAOTAO_ID,
            'strNgayApDung': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
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
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DieuKien();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_XepLoai: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TN_ThongTin/Xoa_TN_XepLoai_DieuKien_Ad',

            'strIds': Ids,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                else {
                    obj = {
                        title: "",
                        content: obj_delete + ": " + data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: obj_delete + ": " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DieuKien();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_KeThuaDieuKien: function (strPhamViNguon_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/KeThuaXetDuyet_DieuKien_Ad',
            'type': 'POST',
            'strPhamViNguon_Id': strPhamViNguon_Id,
            'strPhamViDich_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_XetDuyet();
                    //me.getList_DieuKien();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_HocPhanCT();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeThuaXepLoai: function (strPhamViNguon_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/KeThuaXepLoai_DieuKien_Ad',
            'type': 'POST',
            'strPhamViNguon_Id': strPhamViNguon_Id, //edu.util.getValById('dropHeDaoTao_KT'),
            'strPhamViDich_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    //me.getList_XetDuyet();
                    me.getList_DieuKien();
                }
                else {
                    edu.system.alert(obj_save.action + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_save.action + " (er): " + JSON.stringify(er), "w");
            },
            type: obj_save.type,
            action: obj_save.action,
            //complete: function () {
            //    edu.system.start_Progress("zoneprocessXXXX", function () {
            //        me.getList_HocPhanCT();
            //    });
            //},
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung) {
        var me = this;
        var obj_save = {
            'action': 'TN_ThongTin_MH/FSkkLB4VDx4KJAkuICIpHhkgIg8pIC8P',
            'func': 'pkg_totnghiep_thongtin.Them_TN_KeHoach_XacNhan',
            'iM': edu.system.iM,
            'strSanPham_Id': strSanPham_Id,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {

                if (data.Success) {
                    edu.system.alert("Xác nhận thành công", "s");
                } else {
                    edu.system.alert("Xác nhận thất bại:" + data.Message, "w");
                }
                me.getList_KeHoachXuLy();
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
    getList_XacNhanSanPham: function (strSanPham_Id, strTable_Id, callback) {
        var me = this;
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4KJAkuICIpHhkgIg8pIC8P',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_KeHoach_XacNhan',
            'iM': edu.system.iM,
            'strTuKhoa': "",
            'strSanPham_Id': strSanPham_Id,
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
                    me.genTable_XacNhanSanPham(data.Data, strTable_Id);
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
    genTable_XacNhanSanPham: function (data, strTable_Id) {
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


    getList_DieuKienHaBac: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4ZJDENLiAoHgUoJDQKKCQvHgkgAyAi',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_XepLoai_DieuKien_HaBac',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strPhanLoai_Id': edu.system.getValById('dropAAAA'),
            'strXepLoai_Id': edu.system.getValById('dropAAAA'),
            'strTn_XepLoai_DieuKien_Id': strTN_KeHoach_Id,
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_DieuKienHaBac(dtReRult, data.Pager, strTN_KeHoach_Id);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genTable_DieuKienHaBac: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDieuKienHaBac",

            
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "XAUDIEUKIEN"
                },
                {
                    "mDataProp": "XEPLOAI_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    
    getList_HocPhanKeHoach: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4KJAkuICIpHgkuIhEpIC8P',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_KeHoach_HocPhan',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_HocPhanKeHoach(dtReRult, data.Pager, strTN_KeHoach_Id);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genTable_HocPhanKeHoach: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblHocPhanKeHoach",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_HocPhanKeHoach()",
                iDataRow: iPager
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    save_ChuanBi: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_TinhToan_MH/FSgvKQUVAx4VDx4KJAkuICIpHgkuIhEpIC8P',
            'func': 'pkg_totnghiep_tinhtoan.TinhDTB_TN_KeHoach_HocPhan',
            'iM': edu.system.iM,
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strThangDiem_Id': edu.system.getValById('dropSearch_ThangDiem_ChuanBi'),
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
            type: obj_save.type,
            action: obj_save.action,
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_DieuKien();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_ChuanBi: function (strTN_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4KCR4FFQMeCS4iESkgLx4VICwP',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_KH_DTB_HocPhan_Tam',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch_ChuanBi'),
            'strTN_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strThangDiem_Id': edu.system.getValById('dropSearch_ThangDiem_ChuanBi'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genTable_ChuanBi(dtReRult, data.Pager, strTN_KeHoach_Id);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    genTable_ChuanBi: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChuanBi",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_ChuanBi()",
            //    iDataRow: iPager
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
                    "mDataProp": "QLSV_NGUOIHOC_HOTEN"
                },
                {
                    //"mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN(DAOTAO_TOCHUCCHUONGTRINH_MA)",
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_TEN) + "(" + edu.util.returnEmpty(aData.DAOTAO_TOCHUCCHUONGTRINH_MA) + ")";
                    }
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DTB"
                },
                {
                    "mDataProp": "CHITIETKETQUAHOCPHAN"
                },
                {
                    "mDataProp": "THANGDIEM_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
}