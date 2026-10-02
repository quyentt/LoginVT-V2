/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function DieuKienNhom() { };
DieuKienNhom.prototype = {
    dtDieuKienNhom: [],
    strDieuKienNhom_Id: '',
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
        me.getList_DieuKienNhom();
        me.getList_LenhDieuKien();
        me.getList_LenhXepLoai();
        //me.getList_DMHocPhan();
        //me.getList_PhanLoai();
        edu.extend.genBoLoc_HeKhoa("_KT");
        edu.system.loadToCombo_DanhMucDuLieu("TN.PHANLOAI", "dropSearch_PhanLoai,dropPhanLoaiDK");
        edu.system.loadToCombo_DanhMucDuLieu("VANBANG.XEPLOAI", "dropXepLoai_ApDung");
        //edu.system.loadToCombo_DanhMucDuLieu("TN.KHOA.MO.DULIEU", "", "", data => {
        //    var row = "";
        //    row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        //    for (var i = 0; i < data.length; i++) {
        //        var strClass = data[i].THONGTIN1;
        //        if (!edu.util.checkValue(strClass)) strClass = "fa fa-paper-plane";
        //        row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
        //        row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
        //        row += '<a class="color-active bold">' + data[i].TEN + '</a>';
        //        row += '</div>';
        //    }
        //    row += '</div>';
        //    $("#zoneBtnXacNhan").html(row);
        //});
        $('#dropSearch_PhanLoai').on('select2:select', function () {
            me.getList_DieuKienNhom();
        });

        $("#btnSearch").click(function (e) {
            me.getList_DieuKienNhom();
        });
        $("#btnSearchDieuKien").click(function (e) {
            me.getList_LenhDieuKien();
        });
        $("#btnSearchXepLoai").click(function (e) {
            me.getList_LenhXepLoai();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_DieuKienNhom();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $("#btnAddDieuKienNhom").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_DieuKienNhom").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_DieuKienNhom();
            }
        });
        $("#btnXoaDieuKienNhom").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDieuKienNhom", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DieuKienNhom(arrChecked_Id[i]);
                }
            });
        });
        

        $("#tblDieuKienNhom").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            strId = edu.util.cutPrefixId(/edit/g, strId);
            edu.util.setOne_BgRow(strId, "tblDieuKienNhom");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtDieuKienNhom, "ID")[0];
                me.viewEdit_DieuKienNhom(data);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblDieuKienNhom").delegate('.btnDieuKienXet', 'click', function (e) {
            var strId = this.id;
            me.strDieuKienNhom_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneKeThua");
            //var aData = me.dtKeHoachXuLy.find(e => e.ID == strId);
            $("#txtXauDieuKien").val("")
            $("#txtXauDieuKien").html("");
            me.getList_XetDuyet();
            me.getList_DieuKien();
        });

        $("#tblDieuKienNhom").delegate('.btnXacNhan', 'click', function (e) {
            var strId = this.id;
            me.strDieuKienNhom_Id = strId;
            $("#modal_XacNhan").modal("show");
            me.getList_XacNhanSanPham(me.strDieuKienNhom_Id, "tblModal_XacNhan");
        });
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid= [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtDieuKienNhom_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];
        

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

            me.save_XacNhanSanPham(me.strDieuKienNhom_Id, strTinhTrang, strMoTa);
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

        $("#tblLenhDieuKien").delegate(".btnEdit", "click", function () {
            $(".lenhdieukien").show();
            $(".lenhxeploai").hide();
            var strId = this.id;
            var data = me.dtLenhDieuKien.find(e => e.ID == strId);
            edu.util.viewValById("txtTuKhoa_XepLoai", data.TUKHOA);
            edu.util.viewValById("txtTenTuKhoa_XepLoai", data.TENTUKHOA);
            edu.util.viewValById("txtMoTa_XepLoai", data.MOTA);
            edu.util.viewValById("txtTenGoi_XepLoai", data.TENPKG);
            edu.util.viewValById("txtTenPhuongThuc_XepLoai", data.TENFUNCTION);
            edu.util.viewValById("txtTenLienKet_XepLoai", data.TENDATABASELINK);
            edu.util.viewValById("txtKieuDuLieu_XepLoai", data.KIEUDULIEU);
            edu.util.viewValById("txtSoChuSoLamTron_XepLoai", data.SOCHUSOLAMTRON);
            me["strLenhDieuKien_Id"] = data.ID;
            $("#myModalDieuKienXepLoai").modal("show");
        });
        $("#tblLenhDieuKien").delegate(".btnThamSo", "click", function () {
            $(".lenhdieukien").show();
            $(".lenhxeploai").hide();
            var strId = this.id;
            var data = me.dtLenhDieuKien.find(e => e.ID == strId);
            console.log(data)
            $(".lblTuKhoaThamSo").html(data.TUKHOA)
            me["strLenhDieuKien_Id"] = strId;
            me.getList_ThamSoDieuKien();
            $("#myModalThamSoChiTiet").modal("show");
        });
        $("#btnAdd_LenhDieuKien").click(function () {
            $(".lenhdieukien").show();
            $(".lenhxeploai").hide();
            var data = {};
            edu.util.viewValById("txtTuKhoa_XepLoai", data.TUKHOA);
            edu.util.viewValById("txtTenTuKhoa_XepLoai", data.TENTUKHOA);
            edu.util.viewValById("txtMoTa_XepLoai", data.MOTA);
            edu.util.viewValById("txtTenGoi_XepLoai", data.TENPKG);
            edu.util.viewValById("txtTenPhuongThuc_XepLoai", data.TENFUNCTION);
            edu.util.viewValById("txtTenLienKet_XepLoai", data.TENDATABASELINK);
            edu.util.viewValById("txtKieuDuLieu_XepLoai", data.KIEUDULIEU);
            edu.util.viewValById("txtSoChuSoLamTron_XepLoai", data.SOCHUSOLAMTRON);
            me["strLenhDieuKien_Id"] = data.ID;
            $("#myModalDieuKienXepLoai").modal("show");
        });
        $("#btnSave_LenhDieuKien").click(function () {
            me.save_LenhDieuKien();
        });
        $("#btnDelete_LenhDieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLenhDieuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LenhDieuKien(arrChecked_Id[i]);
                }
            });
        });

        $("#tblLenhXepLoai").delegate(".btnEdit", "click", function () {
            $(".lenhdieukien").hide();
            $(".lenhxeploai").show();
            var strId = this.id;
            var data = me.dtLenhXepLoai.find(e => e.ID == strId);
            edu.util.viewValById("txtTuKhoa_XepLoai", data.TUKHOA);
            edu.util.viewValById("txtTenTuKhoa_XepLoai", data.TENTUKHOA);
            edu.util.viewValById("txtMoTa_XepLoai", data.MOTA);
            edu.util.viewValById("txtTenGoi_XepLoai", data.TENPKG);
            edu.util.viewValById("txtTenPhuongThuc_XepLoai", data.TENFUNCTION);
            edu.util.viewValById("txtTenLienKet_XepLoai", data.TENDATABASELINK);
            edu.util.viewValById("txtKieuDuLieu_XepLoai", data.KIEUDULIEU);
            edu.util.viewValById("txtSoChuSoLamTron_XepLoai", data.SOCHUSOLAMTRON);
            me["strLenhXepLoai_Id"] = data.ID;
            $("#myModalDieuKienXepLoai").modal("show");
        });
        $("#tblLenhXepLoai").delegate(".btnThamSo", "click", function () {
            $(".lenhdieukien").hide();
            $(".lenhxeploai").show();
            var strId = this.id;
            var data = me.dtLenhXepLoai.find(e => e.ID == strId);
            $(".lblTuKhoaThamSo").html(data.TUKHOA)
            me["strLenhXepLoai_Id"] = strId;
            me.getList_ThamSoXepLoai();
            $("#myModalThamSoChiTiet").modal("show");
        });
        $("#btnAdd_LenhXepLoai").click(function () {
            $(".lenhdieukien").hide();
            $(".lenhxeploai").show();
            var data = {};
            edu.util.viewValById("txtTuKhoa_XepLoai", data.TUKHOA);
            edu.util.viewValById("txtTenTuKhoa_XepLoai", data.TENTUKHOA);
            edu.util.viewValById("txtMoTa_XepLoai", data.MOTA);
            edu.util.viewValById("txtTenGoi_XepLoai", data.TENPKG);
            edu.util.viewValById("txtTenPhuongThuc_XepLoai", data.TENFUNCTION);
            edu.util.viewValById("txtTenLienKet_XepLoai", data.TENDATABASELINK);
            edu.util.viewValById("txtKieuDuLieu_XepLoai", data.KIEUDULIEU);
            edu.util.viewValById("txtSoChuSoLamTron_XepLoai", data.SOCHUSOLAMTRON);
            me["strLenhXepLoai_Id"] = data.ID;
            $("#myModalDieuKienXepLoai").modal("show");
        });
        $("#btnSave_LenhXepLoai").click(function () {
            me.save_LenhXepLoai();
        });
        $("#btnDelete_LenhXepLoai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLenhXepLoai", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LenhXepLoai(arrChecked_Id[i]);
                }
            });
        });

        $("#btnAdd_ApDung").click(function () {
            //$(".lenhdieukien").hide();
            //$(".lenhxeploai").show();
            //var data = {};
            //edu.util.viewValById("txtTuKhoa_XepLoai", data.TUKHOA);
            //edu.util.viewValById("txtTenTuKhoa_XepLoai", data.TENTUKHOA);
            //edu.util.viewValById("txtMoTa_XepLoai", data.MOTA);
            //edu.util.viewValById("txtTenGoi_XepLoai", data.TENPKG);
            //edu.util.viewValById("txtTenPhuongThuc_XepLoai", data.TENFUNCTION);
            //edu.util.viewValById("txtTenLienKet_XepLoai", data.TENDATABASELINK);
            //edu.util.viewValById("txtKieuDuLieu_XepLoai", data.KIEUDULIEU);
            //edu.util.viewValById("txtSoChuSoLamTron_XepLoai", data.SOCHUSOLAMTRON);
            //me["strLenhXepLoai_Id"] = data.ID;
            $("#myModalApDung").modal("show");
        });
        $("#btnSave_ApDung").click(function () {
            me.save_ApDung();
        });

        $("#tblThamSoChiTiet").delegate(".btnEditDieuKien", "click", function () {
            var strId = this.id;
            var data = me.dtThamSoDieuKien.find(e => e.ID == strId);
            edu.util.viewValById("txtTenThamSo_ChiTiet", data.TENTHAMSO);
            edu.util.viewValById("txtGiaTriMacDinh_ChiTiet", data.GIATRIMACDINH);
            edu.util.viewValById("txtPhanLoai_ChiTiet", data.PHANLOAI);
            edu.util.viewValById("txtMoTa_ChiTiet", data.MOTA);
            edu.util.viewValById("txtThuTu_ChiTiet", data.THUTU);
            me["strThamSoDieuKien_Id"] = data.ID;
            $("#myModalTSChiTiet").modal("show");
        });
        $("#btnAdd_ThamSoDieuKien").click(function () {
            var data = {};
            edu.util.viewValById("txtTenThamSo_ChiTiet", data.TENTHAMSO);
            edu.util.viewValById("txtGiaTriMacDinh_ChiTiet", data.GIATRIMACDINH);
            edu.util.viewValById("txtPhanLoai_ChiTiet", data.PHANLOAI);
            edu.util.viewValById("txtMoTa_ChiTiet", data.MOTA);
            edu.util.viewValById("txtThuTu_ChiTiet", data.THUTU);
            me["strThamSoDieuKien_Id"] = data.ID;
            $("#myModalTSChiTiet").modal("show");
        });
        $("#btnSave_ThamSoDieuKien").click(function () {
            me.save_ThamSoDieuKien();
        });
        $("#btnDelete_ThamSoDieuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThamSoDieuKien(arrChecked_Id[i]);
                }
            });
        });

        $("#tblThamSoChiTiet").delegate(".btnEditXepLoai", "click", function () {
            var strId = this.id;
            var data = me.dtThamSoXepLoai.find(e => e.ID == strId);
            edu.util.viewValById("txtTenThamSo_ChiTiet", data.TENTHAMSO);
            edu.util.viewValById("txtGiaTriMacDinh_ChiTiet", data.GIATRIMACDINH);
            edu.util.viewValById("txtPhanLoai_ChiTiet", data.PHANLOAI);
            edu.util.viewValById("txtMoTa_ChiTiet", data.MOTA);
            edu.util.viewValById("txtThuTu_ChiTiet", data.THUTU);
            me["strThamSoXepLoai_Id"] = data.ID;
            $("#myModalTSChiTiet").modal("show");
        });
        $("#btnAdd_ThamSoXepLoai").click(function () {
            var data = {};
            edu.util.viewValById("txtTenThamSo_ChiTiet", data.TENTHAMSO);
            edu.util.viewValById("txtGiaTriMacDinh_ChiTiet", data.GIATRIMACDINH);
            edu.util.viewValById("txtPhanLoai_ChiTiet", data.PHANLOAI);
            edu.util.viewValById("txtMoTa_ChiTiet", data.MOTA);
            edu.util.viewValById("txtThuTu_ChiTiet", data.THUTU);
            me["strThamSoXepLoai_Id"] = data.ID;
            $("#myModalTSChiTiet").modal("show");
        });
        $("#btnSave_ThamSoXepLoai").click(function () {
            me.save_ThamSoXepLoai();
        });
        $("#btnDelete_ThamSoXepLoai").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblThamSoChiTiet", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ThamSoXepLoai(arrChecked_Id[i]);
                }
            });
        });


        $("#btnAdd_KeThuaThamSo").click(function () {
            //$(".lenhdieukien").hide();
            //$(".lenhxeploai").show();
            edu.util.viewValById("txtTuKhoaNguon_KeThua", "");
            edu.util.viewValById("txtTuKhoaDich_KeThua", "");
            //edu.util.viewValById("txtMoTa_XepLoai", data.MOTA);
            //edu.util.viewValById("txtTenGoi_XepLoai", data.TENPKG);
            //edu.util.viewValById("txtTenPhuongThuc_XepLoai", data.TENFUNCTION);
            //edu.util.viewValById("txtTenLienKet_XepLoai", data.TENDATABASELINK);
            //edu.util.viewValById("txtKieuDuLieu_XepLoai", data.KIEUDULIEU);
            //edu.util.viewValById("txtSoChuSoLamTron_XepLoai", data.SOCHUSOLAMTRON);
            //me["strLenhXepLoai_Id"] = data.ID;
            $("#myModalKeThuaChiTiet").modal("show");
        });
        $("#btnSave_KTDieuKien").click(function () {
            me.save_KeThuaThamSoDieuKien();
        });
        $("#btnSave_KTXepLoai").click(function () {
            me.save_KeThuaThamSoXepLoai();
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        var data = {};
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoaiDK", data.PHANLOAI_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropHieuLuc", 1);
        me.strDieuKienNhom_Id = data.ID;
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_DieuKienNhom();
    },
    toggle_edit: function () {
        //edu.util.toggle_overide("zone-bus", "zoneEdit");
        $("#myModalDieuKienNhom").modal("show");
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_DieuKienNhom: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/DSA4BRIVDx4RKSAsFygeADEFNC8m',
            'func': 'PKG_TOTNGHIEP_THAMSO.LayDSTN_PhamVi_ApDung',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            'strPhanLoai_Id': edu.system.getValById('dropSearch_PhanLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDieuKienNhom = dtReRult;
                    me.genTable_DieuKienNhom(dtReRult, data.Pager);
                    //me.cbGenCombo_DieuKienNhom(dtReRult)
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
    save_DieuKienNhom: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/FSkkLB4VDx4RKSAsFygeADEFNC8m',
            'func': 'PKG_TOTNGHIEP_THAMSO.Them_TN_PhamVi_ApDung',
            'iM': edu.system.iM,
            'strId': me.strDieuKienNhom_Id,
            'strMa': edu.system.getValById('txtMa'),
            'strTen': edu.system.getValById('txtTen'),
            'strMoTa': edu.system.getValById('txtMota'),
            'strPhanLoai_Id': edu.system.getValById('dropPhanLoaiDK'),
            'dHieuLuc': edu.system.getValById('dropHieuLuc'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_ThamSo_MH/EjQgHhUPHhEpICwXKB4AMQU0LyYP';
            obj_save.func = 'PKG_TOTNGHIEP_THAMSO.Sua_TN_PhamVi_ApDung';
        }
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strDieuKienNhom_Id = "";
                    
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strDieuKienNhom_Id = data.Id;
                        //setTimeout(function () {
                        //    me.strDieuKienNhom_Id = strDieuKienNhom_Id;
                        //    me.getList_ThanhVien();
                        //    me.getList_HocPhan();
                        //    $(".myModalLabel").html('.. <i class="fa fa-pencil"></i> Chỉnh sửa - ');
                        //    $(".btnOpenDelete").show();
                        //    $(".zoneOpenNew").hide();
                        //}, 2000);
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strDieuKienNhom_Id = obj_save.strId
                    }
                    //$("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                    //    var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                    //    if ($(this).attr("name") == "new"){
                    //        me.save_SinhVien(strNhanSu_Id, strDieuKienNhom_Id);
                    //    }
                    //});
                    //$("#tblInputDanhSachNhanSu tbody tr").each(function () {
                    //    me.save_ThanhVien($(this).attr("name"), this.id.replace(/rm_row/g, ''), strDieuKienNhom_Id);
                    //});

                    //for (var i = 0; i < me.arrKhoa.length; i++) {
                    //    me.save_Khoa(strDieuKienNhom_Id, me.arrKhoa[i]);
                    //}
                    //for (var i = 0; i < me.arrChuongTrinh.length; i++) {
                    //    me.save_ChuongTrinh(strDieuKienNhom_Id, me.arrChuongTrinh[i]);
                    //}
                    //for (var i = 0; i < me.arrLop.length; i++) {
                    //    me.save_Lop(strDieuKienNhom_Id, me.arrLop[i]);
                    //}
                    //$("#tblInputHocPhan tbody tr[class=addHocPhan]").each(function () {
                    //    me.save_HocPhan(this.id, strDieuKienNhom_Id);
                    //});
                }
                else {
                    edu.system.alert(data.Message);
                }
                
                me.getList_DieuKienNhom();
            },
            error: function (er) {
                edu.system.alert(" " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DieuKienNhom: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TN_ThamSo_MH/GS4gHhUPHhEpICwXKB4AMQU0LyYP',
            'func': 'PKG_TOTNGHIEP_THAMSO.Xoa_TN_PhamVi_ApDung',
            'iM': edu.system.iM,

            'strId': strId,
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
                    me.getList_DieuKienNhom();
                }
                else {
                    obj = {
                        content: " " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }
                
            },
            error: function (er) {
                var obj = {
                    content: JSON.stringify(er),
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
    --Discription: [0] GEN HTML ==> Systemroot
    --ULR: Modules
    -------------------------------------------*/
    genTable_DieuKienNhom: function (data, iPager) {
        var me = this;
        $("#lblDieuKienNhom_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblDieuKienNhom",

            bPaginate: {
                strFuntionName: "main_doc.DieuKienNhom.getList_DieuKienNhom()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN",
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        if (!aData.HIEULUC) return "Hết hiệu lực"
                        return '';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDieuKienXet" id="' + aData.ID + '" title="Chi tiết">Điều kiện xét</a></span>';
                    }
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "NGAYTAO_DD_MM_YYYY_HHMMSS"
                },
                {
                    "mDataProp": "NGUOITAO_TAIKHOAN"
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
    },

    getList_KeThuaNhom: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TN_ThongTin/LayDSTN_PhamVi_ApDung',
            'type': 'POST',
            'strNguoiThucHien_Id': edu.system.userId,
            'strPhanLoai_Id': me.strDieuKienNhom_Id,
            'iM': edu.system.iM,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.cbGenCombo_DieuKienNhom(dtReRult)
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
    cbGenCombo_DieuKienNhom: function (data) {
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
    viewEdit_DieuKienNhom: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtMa", data.MA);
        edu.util.viewValById("txtTen", data.TEN);
        edu.util.viewValById("dropPhanLoaiDK", data.PHANLOAI_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        me.strDieuKienNhom_Id = data.ID;
        
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
            'strTN_KeHoach_Id': me.strDieuKienNhom_Id,
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
    save_SinhVien: function (strNhanSu_Id, strQLSV_DieuKienNhom_Id) {
        var me = this;
        var aData = edu.util.objGetOneDataInData(strNhanSu_Id, me.arrSinhVien, "ID");
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_PhamVi/ThemMoi',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strQLSV_DieuKienNhom_Id,
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
                strFuntionName: "main_doc.DieuKienNhom.getList_SinhVien()",
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
        var me = main_doc.DieuKienNhom;
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
        var me = main_doc.DieuKienNhom;
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
        html += '<th class="td-center">Hình ảnh</th>';
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
            'strTN_KeHoach_Id': me.strDieuKienNhom_Id,
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
                strFuntionName: "main_doc.DieuKienNhom.getList_SinhVienMDDKH('SEARCH')",
                iDataRow: iPager,
                //bLeft: false,
                //bChange: false
            },
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
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
        html += '<th class="td-center">Hình ảnh</th>';
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
            //    strFuntionName: "main_doc.DieuKienNhom.getList_SinhVienMDDKH('SEARCH')",
            //    iDataRow: iPager,
            //    //bLeft: false,
            //    //bChange: false
            //},
            colPos: {
                center: [0, 1, 7]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Avatar = edu.system.getRootPathImg(data.ANH);
                        return '<img src="' + strNhanSu_Avatar + '" class= "table-img" id="sl_hinhanh' + aData.ID + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var strNhanSu_Ma = aData.QLSV_NGUOIHOC_MASO;
                        var strNhanSu_HoTen = edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                        var html = '<span id="sl_hoten' + aData.ID + '">' + strNhanSu_HoTen + '</span><br />';
                        html += '<span id="sl_ma' + aData.ID + '">' + strNhanSu_Ma + '</span>'
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
        var me = main_doc.DieuKienNhom;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropThoiGian_ApDung"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
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
        main_doc.DieuKienNhom.dtTrangThai = data;
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
    save_ThanhVien: function (strNhanSu_Id, strRowID, strDieuKienNhom_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        if (strRowID.length == 30) strId = "";
        //--Edit
        var obj_save = {
            'action': 'TN_KeHoach_NhanSu/ThemMoi',

            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTN_KeHoach_Id': strDieuKienNhom_Id,
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
            'strTN_KeHoach_Id': me.strDieuKienNhom_Id,
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
                strFuntionName: "main_doc.DieuKienNhom.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
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
                strFuntionName: "main_doc.DieuKienNhom.getList_DMHocPhan()",
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
            'strTN_KeHoach_Id': me.strDieuKienNhom_Id,
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
            'strPhamViApDung_Id': me.strDieuKienNhom_Id,
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
                    me["dtXetDuyet"] = [];
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
            'strPhamViApDung_Id': me.strDieuKienNhom_Id,
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
                        return '<textarea id="txtXauDieuKien' + aData.ID + '" class="form-control xaudieukien" value="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" name="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" style="height: 300px !important" rowspan="4">' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '</textarea>';
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
        var aDataDK = me.dtDieuKienNhom.find(e => e.ID == me.strDieuKienNhom_Id)
        //--Edit
        var obj_save = {

            'action': 'TN_ThongTin_MH/FSkkLB4VDx4ZJDUFNDgkNR4FKCQ0CigkLx4AJQPP',
            'func': 'pkg_totnghiep_thongtin.Them_TN_XetDuyet_DieuKien_Ad',
            'iM': edu.system.iM,
            'strId': aData.ID,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': $("#txtXauDieuKien").val(),
            'strPhanLoai_Id': aDataDK.PHANLOAI_ID,
            'dThuTu': -1,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strPhamViApDung_Id': me.strDieuKienNhom_Id,
            'strDaoTao_ThoiGianDaoTao_Id': aDataDK.DAOTAO_THOIGIANDAOTAO_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'iM': edu.system.iM,
        };
        if (obj_save.strId) {
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
        }
        
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

    save_ApDung: function () {
        var me = this;
        var obj_notify = {};
        var aData = me.dtDieuKienNhom.find(e => e.ID == me.strDieuKienNhom_Id);
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/FSkkLB4VDx4ZJDENLiAoHgUoJDQKKCQvHgAl',
            'func': 'pkg_totnghiep_thongtin.Them_TN_XepLoai_DieuKien_Ad',
            'iM': edu.system.iM,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXauDieuKien': edu.system.getValById('txtXauDieuKien_ApDung'),
            'strPhanLoai_Id': aData.PHANLOAI_ID,
            'strXepLoai_Id': edu.system.getValById('dropXepLoai_ApDung'),
            'dThuTu': edu.system.getValById('txtThuTu_ApDung'),
            'strMoTa': edu.system.getValById('txtMoTa_ApDung'),
            'strPhamViApDung_Id': me.strDieuKienNhom_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.system.getValById('dropThoiGian_ApDung'),
            'strNgayApDung': edu.system.getValById('txtNgay_ApDung'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_DieuKien();
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

    save_KeThuaDieuKien: function (strPhamViNguon_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin/KeThuaXetDuyet_DieuKien_Ad',
            'type': 'POST',
            'strPhamViNguon_Id': strPhamViNguon_Id,
            'strPhamViDich_Id': me.strDieuKienNhom_Id,
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
            'strPhamViDich_Id': me.strDieuKienNhom_Id,
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
                me.getList_DieuKienNhom();
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

    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    save_LenhDieuKien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/FSkkLB4VDx4ZJDUFNDgkNR4VNAopLiAP',
            'func': 'pkg_totnghiep_thongtin.Them_TN_XetDuyet_TuKhoa',
            'iM': edu.system.iM,
            'strId': me.strLenhDieuKien_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTenTuKhoa': edu.system.getValById('txtTenTuKhoa_XepLoai'),
            'strKieuDuLieu': edu.system.getValById('txtKieuDuLieu_XepLoai'),
            'strSoChuSoLamTron': edu.system.getValById('txtSoChuSoLamTron_XepLoai'),
            'strMoTa': edu.system.getValById('txtMoTa_XepLoai'),
            'strNguoiThucHien_Id': edu.system.userId,

            'strTuKhoa': edu.system.getValById('txtTuKhoa_XepLoai'),
            'strTenFunction': edu.system.getValById('txtTenPhuongThuc_XepLoai'),
            'strTenDataBaseLink': edu.system.getValById('txtTenLienKet_XepLoai'),
            'strTenPKG': edu.system.getValById('txtTenGoi_XepLoai'),
            'strPhanLoai_Id': edu.system.getValById('dropSearch_PhanLoai'),
            'dSoChuSoLamTron': edu.system.getValById('txtSoChuSoLamTron_XepLoai'),
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_ThongTin_MH/EjQgHhUPHhkkNQU0OCQ1HhU0CikuIAPP';
            obj_save.func = 'pkg_totnghiep_thongtin.Sua_TN_XetDuyet_TuKhoa'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_LenhDieuKien();
                }
                else {
                    $("#myModalDieuKienXepLoai #notify").html(data.Message)
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
    getList_LenhDieuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4ZJDUFNDgkNR4VNAopLiAP',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_XetDuyet_TuKhoa',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            //'strPhanLoai_Id': edu.system.getValById('dropSearch_PhanLoai'),
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLenhDieuKien"] = dtReRult;
                    me.genTable_LenhDieuKien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_LenhDieuKien: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoach_MH/GS4gHhUCHgopLiAvFSk0HhAFGTQgNQkF',
            'func': 'pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LenhDieuKien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_LenhDieuKien: function (data, iPager) {
        $("#lblLenhDieuKien_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLenhDieuKien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.LenhDieuKien.getList_LenhDieuKien()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "TENTUKHOA"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TENPKG"
                },
                {
                    "mDataProp": "TENFUNCTION"
                },
                {
                    "mDataProp": "TENDATABASELINK"
                },
                {
                    "mDataProp": "KIEUDULIEU"
                },
                {
                    "mDataProp": "SOCHUSOLAMTRON"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnThamSo" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
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
        /*III. Callback*/
    },

    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/
    save_LenhXepLoai: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/FSkkLB4VDx4ZJDENLiAoHhU0CikuIAPP',
            'func': 'pkg_totnghiep_thongtin.Them_TN_XepLoai_TuKhoa',
            'iM': edu.system.iM,
            'strId': me.strLenhXepLoai_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTenTuKhoa': edu.system.getValById('txtTenTuKhoa_XepLoai'),
            'strKieuDuLieu': edu.system.getValById('txtKieuDuLieu_XepLoai'),
            'strSoChuSoLamTron': edu.system.getValById('txtSoChuSoLamTron_XepLoai'),
            'strMoTa': edu.system.getValById('txtMoTa_XepLoai'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': edu.system.getValById('txtTuKhoa_XepLoai'),
            'strTenFunction': edu.system.getValById('txtTenPhuongThuc_XepLoai'),
            'strTenDataBaseLink': edu.system.getValById('txtTenLienKet_XepLoai'),
            'strTenPKG': edu.system.getValById('txtTenGoi_XepLoai'),
            'strPhanLoai_Id': edu.system.getValById('dropSearch_PhanLoai'),
            'dSoChuSoLamTron': edu.system.getValById('txtSoChuSoLamTron_XepLoai'),
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_ThongTin_MH/EjQgHhUPHhkkMQ0uICgeFTQKKS4g';
            obj_save.func = 'pkg_totnghiep_thongtin.Sua_TN_XepLoai_TuKhoa'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_LenhXepLoai();
                }
                else {
                    $("#myModalDieuKienXepLoai #notify").html(data.Message)
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
    getList_LenhXepLoai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThongTin_MH/DSA4BRIVDx4ZJDENLiAoHhU0CikuIAPP',
            'func': 'pkg_totnghiep_thongtin.LayDSTN_XepLoai_TuKhoa',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtSearch'),
            //'strPhanLoai_Id': edu.system.getValById('dropSearch_PhanLoai'),
            'strNguoiTao_Id': edu.system.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtLenhXepLoai"] = dtReRult;
                    me.genTable_LenhXepLoai(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_LenhXepLoai: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TC_KeHoach_MH/GS4gHhUCHgopLiAvFSk0HhAFGTQgNQkF',
            'func': 'pkg_taichinh_kehoach.Xoa_TC_KhoanThu_QDXuatHD',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LenhXepLoai();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_LenhXepLoai: function (data, iPager) {
        $("#lblLenhXepLoai_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblLenhXepLoai",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.LenhXepLoai.getList_LenhXepLoai()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TUKHOA"
                },
                {
                    "mDataProp": "TENTUKHOA"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "TENPKG"
                },
                {
                    "mDataProp": "TENFUNCTION"
                },
                {
                    "mDataProp": "TENDATABASELINK"
                },
                {
                    "mDataProp": "KIEUDULIEU"
                },
                {
                    "mDataProp": "SOCHUSOLAMTRON"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnThamSo" id="' + aData.ID + '" title="Sửa">Xem</a></span>';
                    }
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
        /*III. Callback*/
    },


    /*------------------------------------------
    --Discription: Danh mục 
    -------------------------------------------*/

    save_KeThuaThamSoDieuKien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/CiQVKTQgHhkkNQU0OCQ1HhU0CikuIB4VKSAsEi4P',
            'func': 'PKG_TOTNGHIEP_THAMSO.KeThua_XetDuyet_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strTuKhoa_XetDuyet_Nguon': edu.system.getValById('txtTuKhoaNguon_KeThua'),
            'strTuKhoa_XetDuyet_Dich': edu.system.getValById('txtTuKhoaDich_KeThua'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công!");
                    me.getList_ThamSoDieuKien();
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
    save_ThamSoDieuKien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/FSkkLB4ZJDUFNDgkNR4VNAopLiAeFSkgLBIu',
            'func': 'PKG_TOTNGHIEP_THAMSO.Them_XetDuyet_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strId': me.strThamSoDieuKien_Id,
            'strTenThamSo': edu.system.getValById('txtTenThamSo_ChiTiet'),
            'strGiaTriMacDinh': edu.system.getValById('txtGiaTriMacDinh_ChiTiet'),
            'strTN_XetDuyet_TuKhoa_Id': me.strLenhDieuKien_Id,
            'strPhanLoai': edu.system.getValById('txtPhanLoai_ChiTiet'),
            'strThuTu': edu.system.getValById('txtThuTu_ChiTiet'),
            'strMoTa': edu.system.getValById('txtMoTa_ChiTiet'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_ThamSo_MH/EjQgHhkkNQU0OCQ1HhU0CikuIB4VKSAsEi4P';
            obj_save.func = 'PKG_TOTNGHIEP_THAMSO.Sua_XetDuyet_TuKhoa_ThamSo'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ThamSoDieuKien();
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
    getList_ThamSoDieuKien: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/DSA4BRIeGSQ1BTQ4JDUeFTQKKS4gHhUpICwSLgPP',
            'func': 'PKG_TOTNGHIEP_THAMSO.LayDS_XetDuyet_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strTN_XetDuyet_TuKhoa_Id': me.strLenhDieuKien_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThamSoDieuKien"] = dtReRult;
                    me.genTable_ThamSoDieuKien(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThamSoDieuKien: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/GS4gHhkkNQU0OCQ1HhU0CikuIB4VKSAsEi4P',
            'func': 'PKG_TOTNGHIEP_THAMSO.Xoa_XetDuyet_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThamSoDieuKien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThamSoDieuKien: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblThamSoChiTiet",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ThamSoDieuKien.getList_ThamSoDieuKien()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TENTHAMSO"
                },
                {
                    "mDataProp": "GIATRIMACDINH"
                },
                {
                    "mDataProp": "PHANLOAI"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEditDieuKien" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
    
    save_KeThuaThamSoXepLoai: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/CiQVKTQgHhkkMQ0uICgeFTQKKS4gHhUpICwSLgPP',
            'func': 'PKG_TOTNGHIEP_THAMSO.KeThua_XepLoai_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strTuKhoa_XepLoai_Nguon': edu.system.getValById('txtTuKhoaNguon_KeThua'),
            'strTuKhoa_XepLoai_Dich': edu.system.getValById('txtTuKhoaDich_KeThua'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Kế thừa thành công!");
                    me.getList_ThamSoXepLoai();
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
    save_ThamSoXepLoai: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/FSkkLB4ZJDENLiAoHhU0CikuIB4VKSAsEi4P',
            'func': 'PKG_TOTNGHIEP_THAMSO.Them_XepLoai_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strId': me.strThamSoXepLoai_Id,
            'strTenThamSo': edu.system.getValById('txtTenThamSo_ChiTiet'),
            'strGiaTriMacDinh': edu.system.getValById('txtGiaTriMacDinh_ChiTiet'),
            'strTN_XepLoai_TuKhoa_Id': me.strLenhXepLoai_Id,
            'strPhanLoai': edu.system.getValById('txtPhanLoai_ChiTiet'),
            'strThuTu': edu.system.getValById('txtThuTu_ChiTiet'),
            'strMoTa': edu.system.getValById('txtMoTa_ChiTiet'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TN_ThamSo_MH/EjQgHhkkMQ0uICgeFTQKKS4gHhUpICwSLgPP';
            obj_save.func = 'PKG_TOTNGHIEP_THAMSO.Sua_XepLoai_TuKhoa_ThamSo'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ThamSoXepLoai();
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
    getList_ThamSoXepLoai: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/DSA4BRIeGSQxDS4gKB4VNAopLiAeFSkgLBIu',
            'func': 'PKG_TOTNGHIEP_THAMSO.LayDS_XepLoai_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strTN_XepLoai_TuKhoa_Id': me.strLenhXepLoai_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThamSoXepLoai"] = dtReRult;
                    me.genTable_ThamSoXepLoai(dtReRult, data.Pager);
                }
                else {
                    edu.system.alert(" : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    delete_ThamSoXepLoai: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TN_ThamSo_MH/GS4gHhkkMQ0uICgeFTQKKS4gHhUpICwSLgPP',
            'func': 'PKG_TOTNGHIEP_THAMSO.Xoa_XepLoai_TuKhoa_ThamSo',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Xóa dữ liệu thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ThamSoXepLoai();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ThamSoXepLoai: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblThamSoChiTiet",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.ThamSoXepLoai.getList_ThamSoXepLoai()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mDataProp": "TENTHAMSO"
                },
                {
                    "mDataProp": "GIATRIMACDINH"
                },
                {
                    "mDataProp": "PHANLOAI"
                },
                {
                    "mDataProp": "MOTA"
                },
                {
                    "mDataProp": "THUTU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEditXepLoai" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
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
}