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
    dtHeDaoTao: [],
    arrChecked_Id: [],
    dtXacNhan: [],
    dtPhi: [],
    strPhi_Id: '',

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/

        //me.getList_ThoiGianDaoTao();
        me.getList_KeHoachXuLy();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_ThoiGianDaoTao();
        me.getList_KhoanThu();
        //me.getList_PhanLoai();
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.THI.HOCPHAN.MOHINH", "dropSearch_MoHinhDaoTao,dropMoHinhDaoTao");
        edu.system.loadToCombo_DanhMucDuLieu("DANGKY.THI.HOCPHAN.LOAI", "dropPhanLoai");
        edu.system.loadToCombo_DanhMucDuLieu("KHDT.DIEM.KIEUHOC", "dropKieuHoc");
        me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.DANGKY.NGANH.TIEP.DUYET", "", "", me.loadBtnXacNhan);
        //me.getList_LoaiDanhHieu();
        $('#dropSearch_MoHinhDaoTao').on('select2:select', function (e) {

            me.getList_KeHoachXuLy();
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
        $("#btnAddKeHoach").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoachXuLy").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoachXuLy();
            }
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

        $("#tblKeHoachXuLy").delegate('.btnDSNganh', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneNganh");
            me.getList_Nganh();
        });
        $("#tblKeHoachXuLy").delegate('.btnKetQua', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneSinhVien");
            me.getList_SinhVien();
        });
        $("#tblKeHoachXuLy").delegate('.btnCBDangKy', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneCanBoDangKy");
            me.getList_CBDangKy();
        });
        $("#tblKeHoachXuLy").delegate('.btnChuaDangKy', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            $("#modalChuaDangKy").modal("show");
            me.getList_ChuaDangKy();
        });

        $("#tblKeHoachXuLy").delegate('.btnLopHocPhanSuDung', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            $("#modalLopHocPhanSuDung").modal("show");
            me.getList_LopHocPhanSuDung();
            me.getList_KeHoachDangKy();
        });
        $("#tblKeHoachXuLy").delegate('.btnLopQuanLySuDung', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            $("#modalLopQuanLySuDung").modal("show");
            me.getList_LopQuanLySuDung();
        });
        $("#tblKeHoachXuLy").delegate('.btnDSD', 'click', function (e) {
            var strId = this.id;
            me.strKeHoachXuLy_Id = strId;
            edu.util.toggle_overide("zone-bus", "zoneDSD");
            me.getList_HocPhan_DSD();
            me.getList_DanhSachHoc_DSD();
            me.getList_DSD();
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        $(".btnSearchDTSV_SinhVien").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    var arrNganhXet = [];
                    me.arrChecked_Id = arrChecked_Id;
                    arrChecked_Id.forEach(e => arrNganhXet.push(edu.extend.dtSinhVien.find(ele => ele.ID == e).DAOTAO_TOCHUCCHUONGTRINH_ID))
                    me.getList_NganhXet(arrChecked_Id.toString(), arrNganhXet.toString())
                }
            });
            var html = "";
            html += '<div class="box box-solid">';
            html += '<div class="box-body">';
            html += '<div class="search">';
            html += '<div class="item-modal">';
            html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Ngành đăng ký</p>';
            html += '</div>';
            html += '<div class="item-modal">';
            html += '<select id="dropNganhXet" class="select-opt" style="width:100% !important">';
            html += '</select>';
            html += '</div>';
            html += '<div class="item-modal">';
            html += '<a class="btn btn-default" href="#" id="btnAdd_SinhVienNganh"><i class="fa fa-plus fa-customer"></i> Thêm sinh viên</a>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $("#modalContent .col-sm-3").append(html);
            $("#btnAdd_SinhVienNganh").click(function () {
                edu.system.genHTML_Progress("zoneprocessProGes", me.arrChecked_Id.length);
                me.arrChecked_Id.forEach(strSinhVien_Id => {
                    me.save_SinhVien(strSinhVien_Id);
                })
            })
            $("#zoneChonNhieuSV").hide();
            edu.extend.getList_SinhVien("SEARCH");
        });
        //$(".btnSearchDTSV_SinhVien").trigger("click");
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


        $(".btnSearch_PhamVi").click(function () {
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                var html = "";
                arrChecked_Id.forEach(strSinhVien_Id => {
                    var aData = edu.extend.dtSinhVien.find(e => e.ID == strSinhVien_Id);
                    html += "<tr id='" + strSinhVien_Id + "' name='" + aData.QLSV_NGUOIHOC_ID + "'>";
                    html += "<td class='td-center'></td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_MASO) + " - " + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                })
                $("#tblPhamVi tbody").append(html);
            });
            edu.extend.getList_SinhVien();
        });
        $("#tblPhamVi").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                $("#tblPhamVi #" + strNhanSu_Id).remove();
            }
        });

        $("#modal_sinhvien").delegate('#btnAdd_He', 'click', function () {
            var arrHe = $("#dropSearchModal_He_SV").val();
            if (arrHe.length > 0) {
                var html = "";
                var x = $("#dropSearchModal_He_SV option:selected").each(function () {
                    var strPhamVi_Id = $(this).val();
                    html += "<tr id='" + strPhamVi_Id + "' name='" + strPhamVi_Id + "'>";
                    html += "<td class='td-center'></td>";
                    html += "<td class='td-left' id='lblTen" + strPhamVi_Id + "'>" + $(this).text() + "</td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strPhamVi_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                });
                $("#tblPhamVi tbody").append(html);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            me.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (me.arrKhoa.length > 0) {
                var html = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    var strPhamVi_Id = $(this).val();
                    html += "<tr id='" + strPhamVi_Id + "' name='" + strPhamVi_Id + "'>";
                    html += "<td class='td-center'></td>";
                    html += "<td class='td-left' id='lblTen" + strPhamVi_Id + "'>" + $(this).text() + "</td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strPhamVi_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                });
                $("#tblPhamVi tbody").append(html);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            me.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            var html = "";
            if (me.arrChuongTrinh.length > 0) {
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    var strPhamVi_Id = $(this).val();
                    html += "<tr id='" + strPhamVi_Id + "' name='" + strPhamVi_Id + "'>";
                    html += "<td class='td-center'></td>";
                    html += "<td class='td-left' id='lblTen" + strPhamVi_Id + "'>" + $(this).text() + "</td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strPhamVi_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                });
                $("#tblPhamVi tbody").append(html);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            me.arrLop = $("#dropSearchModal_Lop_SV").val();
            var html = "";
            if (me.arrLop.length > 0) {
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    var strPhamVi_Id = $(this).val();
                    html += "<tr id='" + strPhamVi_Id + "' name='" + strPhamVi_Id + "'>";
                    html += "<td class='td-center'></td>";
                    html += "<td class='td-left' id='lblTen" + strPhamVi_Id + "'>" + $(this).text() + "</td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strPhamVi_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                });
                $("#tblPhamVi tbody").append(html);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#btnDelete_PhamVi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhamVi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }

            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_KeHoachTuyenSinh_HeKhoa(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
       --Discription: [2] Action NhanSu
       --Order: 
       -------------------------------------------*/
        $(".btnSearch_Nganh").click(function () {
            edu.extend.genModal_Lop(arrChecked_Id => {
                console.log(arrChecked_Id);
                if (arrChecked_Id.length) {
                    edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                    arrChecked_Id.forEach(strSinhVien_Id => {
                        me.save_Nganh(strSinhVien_Id);
                    })
                }
            });
            var html = "";
            html += '<div class="box box-solid">';
            html += '<div class="box-body">';
            html += '<div class="search">';
            html += '<div class="item-modal">';
            html += '<p class="group-title"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Xâu điều kiện</p>';
            html += '</div>';
            html += '<div class="item-modal">';
            html += '<input id="txtDieuKienModal" class="form-control" placeholder="Nhập xâu điều kiện" />';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $("#modalContent .col-sm-3").append(html);
            edu.extend.getList_Lop("SEARCH");
        });
        $(".btnDelete_Nganh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNganh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Nganh(arrChecked_Id[i]);
                }
            });
        });
        //$(".btnSearch_HocPhan").trigger("click");
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoachXuLy_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        

        edu.system.getList_MauImport("zonebtnBaoCao_KH", function (addKeyValue) {
            var obj_list = {
                'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
                'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById("dropSearch_ThoiGianDaoTao"),
                'strHB_QuyHocBong_Id': edu.util.getValById('dropSearch_QuyHocBong'),
            };
            for (var x in obj_list) {
                addKeyValue(x, obj_list[x]);
            }
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoachXuLy", "checkX");
            arrChecked_Id.forEach(e => addKeyValue('strHocBong_Id', e));
        });


        $("#btnThemHeKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoachTuyenSinh_HeKhoa(id, "");
        });
        $("#tbl_HeKhoa").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HeKhoa tr[id='" + strRowId + "']").remove();
        });
        $("#tbl_HeKhoa").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KeHoachTuyenSinh_HeKhoa(strId);
            });
        });;
        

        $("#btnSaveDieuKien").click(function () {
            var arrThem = [];
            $("#tblNganh .dieukien").each(function () {
                var point = $(this);
                if (point.val() != point.attr("name")) {
                    arrThem.push(point.attr("id").replace("txtDieuKien", ""))
                }
            })
            if (arrThem.length == 0) {
                edu.system.alert("Không có dữ liệu cần cập nhật");
            }
            edu.system.alert('<div id="zoneprocessProGes"></div>');
            edu.system.genHTML_Progress("zoneprocessProGes", arrThem.length);
            arrThem.forEach(strSinhVien_Id => {
                me.save_Nganh("", strSinhVien_Id);
            })
        });

        $("#tblInput_DTSV_SinhVien").delegate('.btnEdit', 'click', function (e) {
            $('#modalChiTietDiem').modal('show');
            var strId = this.id; 
            var aData = me.dtKetQua.find(e => e.ID == strId);
            me.getList_QuanSoTheoLop(aData.QLSV_NGUOIHOC_ID, aData.DIEM_DANHSACHHOC_ID);
        });


        $("#btnAddThoiGian").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_ThoiGian(id, "");
        });
        $("#tblThoiGian").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblThoiGian tr[id='" + strRowId + "']").remove();
        });
        $("#tblThoiGian").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ThoiGian(strId);
            });
        });;

        $(".btnXacNhan").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#modal_XacNhan").modal("show");
            $(".loaiXacNhan").html("Xác nhận");
            me.strLoaiXacNhan = "XACNHAN_HOANTHANH_NHAP";
            //me.getList_BtnXacNhanSanPham("#zoneBtnXacNhan", me.strLoaiXacNhan);
            var aData = me.dtKetQua.find(e => e.ID == arrChecked_Id[0]);
            var strSanPham = aData.ID + aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_HOCPHAN_ID + aData.DAOTAO_THOIGIANDAOTAO_ID;
            me.getList_XacNhan(strSanPham, "tblModal_XacNhan", null, me.strLoaiXacNhan);
        });
        $(".btnTinhPhi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var arrCanTinh = [];
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var aData = me.dtKetQua.find(e => e.ID == arrChecked_Id[i]);
                if (aData) arrCanTinh.push(aData);
            }
            if (arrCanTinh.length == 0) {
                edu.system.alert("Không có dữ liệu hợp lệ để tính phí?");
                return;
            }
            edu.system.alert('<div id="zoneprocessTinhPhi"></div>');
            edu.system.genHTML_Progress("zoneprocessTinhPhi", arrCanTinh.length);
            arrCanTinh.forEach(function (aData) {
                me.tinhPhiThiTuDong(aData.QLSV_NGUOIHOC_ID, aData.ID);
            });
        });
        $("#zoneBtnXacNhan").delegate('.btnxacnhan', 'click', function () {
            var strTinhTrang = this.id;
            var strMoTa = edu.util.getValById("txtNoiDungXacNhanSanPham");

            $("#modal_XacNhan").modal('hide');
            var arrChecked_Id = edu.util.getArrCheckedIds("tblInput_DTSV_SinhVien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                var aData = me.dtKetQua.find(e => e.ID == arrChecked_Id[i]);
                var strSanPham = aData.ID + aData.QLSV_NGUOIHOC_ID + aData.DAOTAO_HOCPHAN_ID + aData.DAOTAO_THOIGIANDAOTAO_ID;
                me.save_XacNhanSanPham(strSanPham, strTinhTrang, strMoTa);
            }
        });

        edu.extend.genBoLoc_HeKhoa("_CB");
        $("#btnKhoiTaoDuLieu").click(function (e) {
            me.getList_KhoiTaoCBDangKy();
        });
        $("#btnSearch_CB").click(function (e) {
            me.getList_CBDangKy();
        });
        $("#btnSave_DangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_CbDangKy(arrChecked_Id[i]);
            }
        });
        $("#btnDelete_DangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCanBoDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CbDangKy(arrChecked_Id[i]);
                }
            });
        });
        
        $("#btnAdd_LopHocPhanSuDung").click(function () {
            console.log(11111);
            $("#myModalAddLHPSD").modal("show");
        });
        $("#btnSave_LopHocPhanSuDung").click(function () {
            me.save_LopHocPhanSuDung();
        });
        $("#btnDelete_LopHocPhanSuDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopHocPhanSuDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopHocPhanSuDung(arrChecked_Id[i]);
                }
            });
        });

        $("#btnAdd_LopQuanLySuDung").click(function () {
            console.log(11111);
            $("#myModalAddLQLSD").modal("show");
        });
        $("#btnSave_LopQuanLySuDung").click(function () {
            me.save_LopQuanLySuDung();
        });
        $("#btnDelete_LopQuanLySuDung").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopQuanLySuDung", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopQuanLySuDung(arrChecked_Id[i]);
                }
            });
        });

        $("#btnAdd_DotThi").click(function () {
            if (!me.strKeHoachXuLy_Id) {
                edu.system.alert("Vui lòng lưu kế hoạch trước khi thêm đợt thi");
                return;
            }
            $("#myModalAddDotThi").modal("show");
            me.getList_DotThi();
        });
        $("#btnDelete_DotThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDotThi", "checkX");
            if (arrChecked_Id.length === 0) {
                edu.system.alert("Vui lòng chọn đợt thi cần xóa");
                return;
            }
            edu.system.confirm("Bạn có chắc muốn xóa <strong>" + arrChecked_Id.length + "</strong> đợt thi đã chọn?");
            $("#btnYes").off('click.delDotThiBatch').on('click.delDotThiBatch', function (e) {
                $('#myModalAlert').modal('hide');
                edu.system.alert('<div id="zoneprocessDotThiBatch"></div>');
                edu.system.genHTML_Progress("zoneprocessDotThiBatch", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DotThi(arrChecked_Id[i]);
                }
            });
        });
        $("#btnSave_DotThi_Modal").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModalDotThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đợt thi");
                return;
            }
            edu.system.alert('<div id="zoneprocessDotThi"></div>');
            edu.system.genHTML_Progress("zoneprocessDotThi", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_DotThi(arrChecked_Id[i]);
            }
        });
        $("#tblDotThi").delegate('.deleteDotThi', 'click', function () {
            var strId = this.id;
            if (!strId) {
                edu.system.alert("Không lấy được ID đợt thi, vui lòng kiểm tra console.");
                return;
            }
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").off('click.delDotThi').on('click.delDotThi', function (e) {
                $('#myModalAlert').modal('hide');
                me.delete_DotThi(strId);
            });
        });

        me.getList_HocPhan();
        me.getList_ThanhPhanDiem();
        $('#dropKeHoachDangKy').on('select2:select', function (e) {
            me.getList_HocPhan();
            me.getList_LopHocPhan();
        });
        $('#dropHocPhan').on('select2:select', function (e) {
            me.getList_LopHocPhan();
        });
        edu.extend.genBoLoc_HeKhoa("_TL");


        $("#btnSearch_SV").click(function (e) {
            me.getList_SinhVien();
        });
        $("#txtSearch_SV").keypress(function (e) {
            if (e.which === 13) {
                me.getList_SinhVien();
            }
        });
        $("#txtSearch_SV").on('input', function () {
            var kw = ($(this).val() || '').toLowerCase().trim();
            $("#tblInput_DTSV_SinhVien tbody tr").each(function () {
                if (!kw) { $(this).show(); return; }
                var txt = $(this).text().toLowerCase();
                $(this).toggle(txt.indexOf(kw) !== -1);
            });
        });

        $('#dropTinhTrangNop').on('select2:select', function (e) {
            me.getList_SinhVien();
        });

        $("#tblKeHoachXuLy").delegate('.btnDSNhanSu', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSNhanSu");
            me.strKeHoachXuLy_Id = strId;
            me.getList_PhanCong();
        });
        $("#btnAdd_PhanCong").click(function () {
            edu.extend.genModal_NguoiDung(arrChecked_Id => {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_PhanCong(arrChecked_Id[i]);
                }
            });
            edu.extend.getList_NguoiDungP();
        });
        $("#btnDelete_PhanCong").click(function () {
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

        $("#tblKeHoachXuLy").delegate('.btnDSPhi', 'click', function (e) {
            var strId = this.id;
            edu.util.toggle_overide("zone-bus", "zoneDSPhi");
            me.strKeHoachXuLy_Id = strId;
            me.getList_Phi();
        });

        $("#btnAdd_Phi").click(function () {
            $('#myModalPhi').modal('show');
            me.strPhi_Id = "";
            edu.util.viewValById("dropLoaiKhoan", "");
            edu.util.viewValById("txtSoTien", "");
        });
        $("#btnSave_Phi").click(function () {
            me.save_Phi();
        });
        $("#btnDelete_Phi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblPhi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Phi(arrChecked_Id[i]);
                }
            });
        });
        $("#tblPhi").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_Phi(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        
        $("#btnAdd_DSD").click(function () {
            me.save_DSD();
        });
        $('#dropHocPhan_DSD').on('select2:select', function (e) {
            me.getList_DanhSachHoc_DSD();
            me.getList_DSD();
        });
        $('#dropDanhSachHoc_DSD').on('select2:select', function (e) {
            me.getList_DSD();
        });
        $("#btnSearch_DSD").click(function (e) {
            me.getList_DSD();
        });
        $("#btnAdd_ChuaTao").click(function () {
            $("#modalChuaTaoDSD").modal("show");
            me.getList_ChuaTaoDSD();
        });

        $("#btnAdd_TinhDiemDSD").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSD", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_TinhDiemDSD(arrChecked_Id[i]);
            }
        });
        $("#btnAdd_HPDangKy").click(function () {
            edu.extend.genModal_HocPhan(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    //var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_HPDangKy(e);
                })
            });
            //edu.extend.getList_SinhVien();
        });
        $("#btnDelete_HPDangKy").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHPDangKy", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_HPDangKy(arrChecked_Id[i]);
            }
        });

        $("#btnAdd_HPKhong").click(function () {
            edu.extend.genModal_HocPhan(arrChecked_Id => {
                edu.system.genHTML_Progress("zoneprocessProGes", arrChecked_Id.length);
                arrChecked_Id.forEach(e => {
                    //var aData = edu.extend.dtSinhVien.find(eSV => eSV.ID == e);
                    me.save_HPKhong(e);
                })
            });
            //edu.extend.getList_SinhVien();
        });
        $("#btnDelete_HPKhong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblHPKhong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_HPKhong(arrChecked_Id[i]);
            }
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

        edu.util.viewValById("txtMa", "");
        edu.util.viewValById("txtTen", "");
        edu.util.viewValById("dropPhanLoai", edu.util.getValById("dropSearch_PhanLoai"));
        edu.util.viewValById("dropMoHinhDaoTao","");
        edu.util.viewValById("txtTuNgay", "");
        edu.util.viewValById("txtDenNgay", "");
        edu.util.viewValById("txtHanNopPhi", "");
        edu.util.viewValById("txtTrinhDo", "");
        edu.util.viewValById("txtThoiGianDuKien", "");
        edu.util.viewValById("txtDiaDiemDuKien", "");
        $("#tbl_HeKhoa tbody").html("");
        $("#tblThoiGian tbody").html("");
        $("#tblPhamVi tbody").html("");
        $("#tblDotThi tbody").html("");
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
            'action': 'DKH_DangKyThi_MonThi_Chung/LayDSKeHoach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strMoHinh_Id': edu.util.getValById('dropSearch_MoHinhDaoTao'),
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoachXuLy = dtReRult;
                    me.genTable_KeHoachXuLy(dtReRult, data.Pager);
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
            'action': 'DKH_DangKyThi_MonThi_Chung/Them_DangKy_Thi_HP_KeHoach',
            'type': 'POST',
            'strId': me.strKeHoachXuLy_Id,
            'strPhanLoai_Id': edu.util.getValById('dropPhanLoai'),
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strTuNgay': edu.util.getValById('txtTuNgay'),
            'strDenNgay': edu.util.getValById('txtDenNgay'),
            'strHanNopPhi': edu.util.getValById('txtHanNopPhi'),
            'strTrinhDo': edu.util.getValById('txtTrinhDo'),
            'strThoiGianThiDuKien': edu.util.getValById('txtThoiGianDuKien'),
            'strDiaDiemDuKien': edu.util.getValById('txtDiaDiemDuKien'),
            'dHieuLuc': edu.util.getValById('dropHieuLuc'),
            'strMoHinhDangKy_Id': edu.util.getValById('dropMoHinhDaoTao'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'DKH_DangKyThi_MonThi_Chung/Sua_DangKy_Thi_HP_KeHoach';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachXuLy_Id = "";

                    if (obj_save.strId == "") {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoachXuLy_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoachXuLy_Id = obj_save.strId
                    }
                    //$("#tbl_HeKhoa tbody tr").each(function () {
                    //    var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                    //    me.save_KeHoachTuyenSinh_HeKhoa(strHeKhoa_Id, strKeHoachXuLy_Id);
                    //});
                    $("#tblPhamVi tbody tr").each(function () {
                        var strHeKhoa_Id = $(this).attr("name");
                        if (strHeKhoa_Id) me.save_KeHoachTuyenSinh_HeKhoa(strHeKhoa_Id, strKeHoachXuLy_Id);
                    });
                    $("#tblThoiGian tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        me.save_ThoiGian(strHeKhoa_Id, strKeHoachXuLy_Id);
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
            'action': 'DKH_DangKyThi_MonThi_Chung/Xoa_DangKy_Thi_HP_KeHoach',
            
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
                    me.getList_KeHoachXuLy();
                }
                else {
                    obj = {
                        content: "KeHoach/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "HB_KeHoach/Xoa (er): " + JSON.stringify(er),
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

    tinhPhiThiTuDong: function (strQLSV_NguoiHoc_Id, strNguonDuLieu_Id) {
        var me = this;
        var obj_save = {
            'action': 'TC_TinhPhi_MH/FSgvKREpKBUpKBU0BS4vJgPP',
            'func': 'pkg_taichinh_tinhphi.TinhPhiThiTuDong',
            'iM': edu.system.iM,
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strNguonDuLieu_Id': strNguonDuLieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    console.warn("TinhPhiThiTuDong: " + data.Message);
                }
            },
            error: function (er) {
                console.warn("TinhPhiThiTuDong (er): " + JSON.stringify(er));
            },
            type: 'POST',
            contentType: true,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessTinhPhi", function () {
                    me.getList_SinhVien();
                });
            },
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    save_Lop: function (strXLDH_KeHoach_Id, strDaoTao_LopQuanLy_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViLop',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_LopQuanLy_Id': strDaoTao_LopQuanLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
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
    save_ChuongTrinh: function (strXLDH_KeHoach_Id, strDaoTao_ChuongTrinh_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViCT',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
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
    save_Khoa: function (strXLDH_KeHoach_Id, strDaoTao_KhoaDaoTao_Id) {
        var me = this;
        //--Edit
        var obj_save = {

            'action': 'HB_XepLoaiDanhHieu/Them_XLDH_KeHoach_PhamViKhoa',
            'type': 'POST',
            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strXLDH_KeHoach_Id': strXLDH_KeHoach_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId != "") {
        //    obj_save.action = 'HB_KeHoach/CapNhat';
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

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TENKEHOACH",
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "MOHINHDANGKY_TEN"
                },
                {
                    //"mDataProp": "TUNGAY"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TUNGAY) + " --> " + edu.util.returnEmpty(aData.DENNGAY);
                    }
                },
                {
                    "mDataProp": "NGAYHANNOPPHI"
                },
                {
                    "mDataProp": "TRINHDO"
                },
                {
                    "mDataProp": "THOIGIANTHIDUKIEN"
                },
                {
                    "mDataProp": "DIADIEMDUKIEN"
                },

                {
                    //"mDataProp": "TUNGAY"
                    "mRender": function (nRow, aData) {
                        return aData.HIEULUC? "Hiệu lực": "Hết hiệu lực";
                    }
                },
                {

                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSPhi" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSNhanSu" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnChuaDangKy" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnCBDangKy" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnLopHocPhanSuDung" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnLopQuanLySuDung" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnDSD" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
    },
    viewEdit_KeHoachXuLy: function (data) {
        var me = this;
        //View - Thong tin
        //edu.util.viewValById("dropHieuLuc", data.MA);
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("dropPhanLoai", data.PHANLOAI_ID);
        edu.util.viewValById("txtMoTa", data.MOTA);
        edu.util.viewValById("dropMoHinhDaoTao", data.MOHINHDANGKY_ID);
        edu.util.viewValById("txtTuNgay", data.TUNGAY);
        edu.util.viewValById("txtDenNgay", data.DENNGAY);
        edu.util.viewValById("txtHanNopPhi", data.NGAYHANNOPPHI);
        edu.util.viewValById("dropHieuLuc", data.HIEULUC);
        edu.util.viewValById("txtTrinhDo", data.TRINHDO);
        edu.util.viewValById("txtThoiGianDuKien", data.THOIGIANTHIDUKIEN);
        edu.util.viewValById("txtDiaDiemDuKien", data.DIADIEMDUKIEN);
        me.strKeHoachXuLy_Id = data.ID;
        me.getList_KeHoachTuyenSinh_HeKhoa();
        me.getList_ThoiGian();
        me.getList_HPDangKy();
        me.getList_HPKhong();
        me.getList_DotThi_KeHoach();
        //me.arrLop = [];
        //me.arrKhoa = [];
        //me.arrChuongTrinh = [];
        //$("#ApDungChoLop").html("");
        //$("#ApDungChoKhoa").html("");
        //$("#ApDungChoChuongTrinh").html("");
        //me.getList_SinhVien();
        //me.getList_ThanhVien();
    },
    /*------------------------------------------
   --Discription: [1] AcessDB ThanhVien
   --ULR:  Modules
   -------------------------------------------*/
    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_Chung/LayDSDK_Nganh_Thi_HP_KetQua',
            'type': 'GET',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_Chung/LayDSDK_Nganh_Thi_HP_KetQua_PT',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_SV'),
            'dTinhTrangNopTien': edu.util.getValById('dropTinhTrangNop'),
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strQLSV_NguoiHoc_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropAAAA'),
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
                    me["dtKetQua"] = dtResult;
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
        var aData = edu.extend.dtSinhVien.find(e => e.ID == strNhanSu_Id);
        //var aDataNganh = me.dtNganhXet.find(e => e.ID == $("#dropNganhXet").val())
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DangKy_Nganh_Tiep_KetQua',
            'type': 'POST',
            'strQLSV_DangKy_Nganh_Tiep_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strQLSV_NguoiHoc_Id': aData.QLSV_NGUOIHOC_ID,
            'strQLSV_NguoiHoc_DK_Id': aData.QLSV_NGUOIHOC_ID,
            'strDaoTao_KhoaDaoTao_DK_Id': aDataNganh.DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_ChuongTrinh_DK_Id': aDataNganh.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_LopQuanLy_DK_Id': aDataNganh.DAOTAO_LOPQUANLY_ID,
            'strNguoiThucHien_Id': edu.system.userId,
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
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    $("#modal_sinhvien").modal("hide");
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
    delete_SinhVien: function (strIds) {
        var me = this;
        var aData = me.dtKetQua.find(e => e.ID == strIds);
        if (!aData) aData = {};
        //--Edit
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/ThucHienHuyDangKy',

            'strId': strIds,
            'strDangKy_Thi_HP_KeHoach_Id': aData.DANGKY_THI_HOCPHAN_KEHOACH_ID,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDangKy_Thi_HocPhan_KQ_Id': strIds,
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
                    //me.getList_SinhVien();
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
        var jsonForm = {
            strTable_Id: "tblInput_DTSV_SinhVien",
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_SinhVien()", 
                iDataRow: iPager,
                //bFilter: true,
                //bChange: false
            },
            aaData: data,
            colPos: {
                center: [0, 8],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "GIOITINH_TEN"
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
                    "mDataProp": "DAOTAO_KHOAQUANLY_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TRUONG_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "THI_DOTTHI_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_MA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DIEM) + '<a title="Chi tiết điểm"  class="text-decoration-underline btnEdit" id="' + aData.ID + '" href="#" >Xem chi tiết</a>';
                    }
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "NGAYDK_DD_MM_YYYY_HHMMS"
                },
                {
                    //"mDataProp": "SOTIEN"
                    "mRender": function (nRow, aData) {
                        return edu.util.formatCurrency(aData.SOTIEN);
                    }
                },
                {
                    "mDataProp": "SOTIENDANOP"
                },
                {
                    "mDataProp": "SOTIENRUT"
                }
                ,
                {
                    "mDataProp": "TINHTRANG_TEN"
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
    
    save_Nganh: function (strData_Id, strRowID, strKeHoachXuLy_Id, strDaoTao_CoCauToChuc_Id) {
        var me = this;
        var obj_notify;
        var strId = strRowID;
        var aData = {};
        if (!strRowID) aData = edu.extend.dtLopQuanLy.find(e => e.ID == strData_Id);
        //--Edit
        var obj_save = {
            'action': 'DKH_Nganh2/Them_DK_Nganh_Tiep_PV_MoNganh',
            'type': 'POST',
            'strId': strId,
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HeDaoTao_Id': aData.DAOTAO_HEDAOTAO_ID,
            'strDaoTao_KhoaDaoTao_Id': aData.DAOTAO_KHOADAOTAO_ID,
            'strDaoTao_ChuongTrinh_Id': aData.DAOTAO_TOCHUCCHUONGTRINH_ID,
            'strDaoTao_LopQuanLy_Id': aData.ID,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strXauDieuKien': edu.util.getValById('txtDieuKien' + strRowID),
            'strMoTa': edu.util.getValById('txtAAAA'),
            'dSoTien': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'DKH_Nganh2/Sua_DK_Nganh_Tiep_PV_MoNganh';
        } else {
            obj_save.strXauDieuKien = edu.util.getValById('txtDieuKienModal')
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
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    $("#modal_lophoc").modal("hide");
                    me.getList_Nganh();
                });
            },
            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Nganh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSDK_Nganh_Tiep_PV_MoNganh',
            'type': 'GET',
            'strQLSV_DangKy_Nganh_Tiep_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 1000000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_Nganh(dtResult);
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
    delete_Nganh: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_Nganh2/Xoa_DK_Nganh_Tiep_PV_MoNganh',

            'strChucNang_Id': edu.system.strChucNang_Id,
            'strId': strNhanSu_Id,
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
                    me.getList_Nganh();
                });
            },
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
    genTable_Nganh: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblNganh",
            
            aaData: data,
            colPos: {
                center: [0,7],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtDieuKien' + aData.ID + '" value="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" name="' + edu.util.returnEmpty(aData.XAUDIEUKIEN) + '" class="form-control form-border-bottom dieukien" />';
                    }
                },
                {
                    "mDataProp": "MOTA"
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
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoachTuyenSinh_HeKhoa: function (strHeKhoa_Id, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;
        var strId = strHeKhoa_Id;
        //var strDaoTao_HeDaoTao_Id = edu.util.getValById('dropHeDaoTao' + strHeKhoa_Id);
        //var strDaoTao_KhoaDaoTao_Id = edu.util.getValById('dropKhoaDaoTao' + strHeKhoa_Id);
        //if (!edu.util.checkValue(strDaoTao_HeDaoTao_Id) || !edu.util.checkValue(strDaoTao_KhoaDaoTao_Id)) {
        //    return;
        //}
        ////Kiểm tra dữ liệu để them mới hoặc sửa
        //if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung/Them_DangKy_Thi_HP_KH_PhamVi',
            'type': 'POST',
            'strId': strId,
            'strDangKy_Thi_HP_KeHoach_Id': strDangKy_Thi_HP_KeHoach_Id,
            'strPhamViApDung_Id': strHeKhoa_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (strId) {
        //    obj_save.action = 'DKH_DangKyThi_MonThi_Chung/Sua_DangKy_Thi_HP_KH_PhamVi';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
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
    getList_KeHoachTuyenSinh_HeKhoa: function () {
        var me = this;

        //--Edit
        var obj_list = { 
            'action': 'DKH_DangKyThi_MonThi_Chung/LayDSDangKy_Thi_HP_KH_PhamVi',
            'type': 'GET',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(dtResult);
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
    delete_KeHoachTuyenSinh_HeKhoa: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_Chung/Xoa_DangKy_Thi_HP_KH_PhamVi',

            'strId': strIds,
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
                    content: "(er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_KeHoachTuyenSinh_HeKhoa();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_KeHoachTuyenSinh_HeKhoa_Data: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblPhamVi",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoachXuLy.getList_KeHoachXuLy()",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0,2],
            },
            aoColumns: [
                {
                    "mDataProp": "PHAMVIAPDUNG_TEN",
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //$("#tbl_HeKhoa tbody").html("");
        //for (var i = 0; i < data.length; i++) {
        //    var strHeKhoa_Id = data[i].ID;
        //    var row = '';
        //    row += '<tr id="' + strHeKhoa_Id + '">';
        //    row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
        //    row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
        //    row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
        //    row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
        //    row += '</tr>';
        //    $("#tbl_HeKhoa tbody").append(row);
        //    me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, data[i].DAOTAO_HEDAOTAO_ID);
        //    //me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, data[i].DAOTAO_KHOADAOTAO_ID);
        //    me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, data[i].PHAMVIAPDUNG_ID);

        //    $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
        //        var strDrop_Id = this.id.replace("dropHeDaoTao", "");
        //        me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id);
        //    });
        //}
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },
    genHTML_KeHoachTuyenSinh_HeKhoa: function (strHeKhoa_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_HeKhoa").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHeKhoa_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
        row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHeKhoa_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_HeKhoa tbody").append(row);
        me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, "");
        me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, "");
        me.getList_KhoaDaoTao(edu.util.getValById("dropHeDaoTao"));

        $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
            var strDrop_Id = this.id.replace("dropHeDaoTao", "");
            me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id, "");
        });
    },

    getList_HeDaoTao: function () {
        var me = this;


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtHeDaoTao = dtResult;
                    //me.genCombo_HeDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_HeDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_HeDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_HeDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HinhThucDaoTao_Id': "",
                'strDaoTao_BacDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 100000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HeDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtHeDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENHEDAOTAO",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn hệ đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },

    getList_KhoaDaoTao_InTable: function (strDaoTao_HeDaoTao_Id, strDrop_Id, default_val) {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_KhoaDaoTao_InTable(dtResult, strDrop_Id, default_val);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao_InTable: function (data, strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },

   

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_KhoaDaoTao: function () {
        var me = this;
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.dtKhoaDaoTao = dtResult;
                    //me.genCombo_KhoaDaoTao(dtResult);
                }
                else {
                    edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach: " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("KHCT_KhoaDaoTao/LayDanhSach (ex): " + JSON.stringify(er), "w");

            },
            type: 'GET',
            action: 'KHCT_KhoaDaoTao/LayDanhSach',

            contentType: true,

            data: {
                'strTuKhoa': "",
                'strDaoTao_HeDaoTao_Id': edu.util.getValById("dropHeDaoTao"),
                'strDaoTao_CoSoDaoTao_Id': "",
                'strNguoiThucHien_Id': "",
                'pageIndex': 1,
                'pageSize': 10000000
            },
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KhoaDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKhoaDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            title: "Chọn khóa đào tạo"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },
    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
    getList_PhanLoai: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSQLSV_NguoiDung_PhanLoai',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_PhanLoai(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_PhanLoai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropPhanLoai", "dropSearch_PhanLoai"],
            title: "Chọn phân loại"
        };
        edu.system.loadToCombo_data(obj);
    },


    getList_NganhXet: function (strQLSV_NguoiHoc_Id, strDaoTao_ChuongTrinh_Id) {
        var me = main_doc.KeHoachXuLy;
        //--Edit
        var obj_list = {
            'action': 'DKH_Nganh2/LayDSNganhMoDangKy',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_ChuongTrinh_Id': strDaoTao_ChuongTrinh_Id,
            'strQLSV_DangKy_Nganh_Tiep_Id': main_doc.KeHoachXuLy.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtNganhXet"] = dtReRult.rsNganhMo;
                    me.genCombo_Nganh(dtReRult.rsNganhMo);
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
    genCombo_Nganh: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_LOPQUANLY_TEN",
                //mRender: function (index, aData) {
                //    return aData.DAOTAO_KHOADAOTAO_TEN
                //}
            },
            renderPlace: ["dropNganhXet"],
            title: "Chọn ngành"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropNganhXet").select2();
    },

    /*----------------------------------------------
    --Author:
    --Date of created:
    --Discription: SinhVien Modal
    ----------------------------------------------*/
    save_XacNhanSanPham: function (strSanPham_Id, strTinhTrang_Id, strNoiDung, strLoaiXacNhan) {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/Them_DangKy_Thi_XacNhan',
            'type': 'POST',
            'strSanPham_Id': strSanPham_Id,
            'strNguoiXacnhan_Id': edu.system.userId,
            'strNoiDung': strNoiDung,
            'strTinhTrang_Id': strTinhTrang_Id,
        };
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
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_SinhVien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    getList_BtnXacNhanSanPham: function (strZoneXacNhan_Id, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_Chung/LayDSTinhTrangTheoNguoiDung',
            'type': 'GET',
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
    loadBtnXacNhan: function (data) {
        main_doc.KeHoachXuLy.dtXacNhan = data;
        var row = "";
        row += '<div style="margin-left: auto; margin-right: auto; width: ' + ((data.length) * 90) + 'px">';
        for (var i = 0; i < data.length; i++) {
            var strClass = data[i].THONGTIN1;
            if (!edu.util.checkValue(strClass)) strClass = "fa-solid fa-circle-check";
            row += '<div id="' + data[i].ID + '" class="btn-large btnxacnhan">';
            row += '<a class="btn"><i style="' + data[i].THONGTIN2 + '" class="' + strClass + ' fa-4x"></i></a>';
            row += '<a class="color-active bold">' + data[i].TEN + '</a>';
            row += '</div>';
        }
        row += '</div>';
        $("#zoneBtnXacNhan").html(row);
    },

    getList_XacNhan: function (strSanPham_Id, strTable_Id, callback, strLoaiXacNhan) {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/LayDSDangKy_Thi_XacNhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strsanpham_Id': strSanPham_Id,
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


    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KHCT_ThoiGianDaoTao/LayDanhSach',
            'strDAOTAO_Nam_Id': "",
            'strNguoiThucHien_Id': edu.system.userId,
            'strTuKhoa': "",
            'pageIndex': 1,
            'pageSize': 1000000
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtThoiGianDaoTao"] = data.Data;
                    //me.genList_ThoiGianDaoTao(data.Data, data.Pager);
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) { },
            type: "GET",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
        }, false, false, false, null);
    },
    genList_ThoiGianDaoTao: function (strDrop_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThoiGianDaoTao,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: "",
                default_val: default_val
            },
            renderPlace: [strDrop_Id],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strDrop_Id).select2();
    },


    getList_QuanSoTheoLop: function (strQLSV_NguoiHoc_Id, strDaoTao_LopHocPhan_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_ThongTin/LatKetQuaDiemCaNhanTheoLop',
            'type': 'GET',
            'strQLSV_NguoiHoc_Id': strQLSV_NguoiHoc_Id,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    var json = dtReRult.rsTP.concat(dtReRult.rsTKHP);
                    me.genTable_QuanSoTheoLop(json);
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
    genTable_QuanSoTheoLop: function (data, iPager, strHB_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChiTietDiem",

            aaData: data,
            colPos: {
                center: [0, 1, 3, 4, 2, 6],
            },
            aoColumns: [
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
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI_SO"
                },
                {
                    "mDataProp": "DIEMQUYDOI_CHU"
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },


    save_ThoiGian: function (strRow_Id, strDangKy_Thi_HP_KeHoach_Id) {
        var me = this;
        var strId = strRow_Id;

        var strThoiGian = edu.util.getValById('dropThoiGian' + strRow_Id);
        if (!strThoiGian) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung/Them_DangKy_Thi_HP_KH_ThoiGian',
            'type': 'POST',
            'strId': strId,
            'strDangKy_Thi_HP_KeHoach_Id': strDangKy_Thi_HP_KeHoach_Id,
            'strDaoTao_ThoiGianDaoTao_Id': strThoiGian,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (strId) {
            obj_save.action = 'DKH_DangKyThi_MonThi_Chung/Sua_DangKy_Thi_HP_KH_ThoiGian';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strId == "") {
                        strId = data.Id;
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
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
    getList_ThoiGian: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_Chung/LayDSDangKy_Thi_HP_KH_ThoiGian',
            'type': 'GET',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genHTML_ThoiGian_Data(dtResult);
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
    delete_ThoiGian: function (strIds) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_Chung/Xoa_DangKy_Thi_HP_KH_ThoiGian',

            'strId': strIds,
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
                    me.getList_ThoiGian();
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "(er): " + JSON.stringify(er),
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


    genHTML_ThoiGian_Data: function (data) {
        var me = this;
        $("#tblThoiGian tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHeKhoa_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHeKhoa_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropThoiGian' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblThoiGian tbody").append(row);
            me.genList_ThoiGianDaoTao("dropThoiGian" + strHeKhoa_Id, data[i].DAOTAO_THOIGIANDAOTAO_ID);
            
        }
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },
    genHTML_ThoiGian: function (strHeKhoa_Id) {
        var me = this;
        var iViTri = document.getElementById("tblThoiGian").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHeKhoa_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropThoiGian' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHeKhoa_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblThoiGian tbody").append(row);
        me.genList_ThoiGianDaoTao("dropThoiGian" + strHeKhoa_Id);
    },

    getList_KhoiTaoCBDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/LayDSHocPhanDangKyTheoPhamVi',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dKhoiTaoDuLieu': 1,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_CanBoDangKy(dtResult);
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
    getList_CBDangKy: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/LayDSHocPhanDangKyTheoPhamVi',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dKhoiTaoDuLieu': 0,
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_CB'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_CB'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_CB'),
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_CanBoDangKy(dtResult);
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
    genTable_CanBoDangKy: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblCanBoDangKy",

            aaData: data,
            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HoDem + QLSV_NGUOIHOC_Ten"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TENLOP"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " (" + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA) +")";
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
    save_CbDangKy: function (strQLHLTL_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/ThucHienDangKy',
            'type': 'POST',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLHLTL_NguoiHoc_Id': strQLHLTL_NguoiHoc_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CBDangKy();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CbDangKy: function (strQLHLTL_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/ThucHienHuyDangKy',
            'type': 'POST',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strQLHLTL_NguoiHoc_Id': strQLHLTL_NguoiHoc_Id,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CBDangKy();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_LopHocPhanSuDung: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/LayDSDangKy_Thi_LopHocPhan',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genTable_LopHocPhanSuDung(dtResult);
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
    genTable_LopHocPhanSuDung: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblLopHocPhanSuDung",

            aaData: data,
            colPos: {
                center: [0, 6],
            },
            aoColumns: [
                {
                    "mDataProp": "DANGKY_KEHOACHDANGKY_TEN"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HoDem + QLSV_NGUOIHOC_Ten"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_TEN) + " - " + edu.util.returnEmpty(aData.DAOTAO_HOCPHAN_MA);
                    }
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_TEN"
                },
                {
                    "mDataProp": "KIEUHOC_TEN"
                },
                {
                    "mDataProp": "DIEM_THANHPHANDIEM_TEN"
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
    save_LopHocPhanSuDung: function (strQLHLTL_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/Them_DangKy_Thi_LopHocPhan',
            'type': 'POST',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan'),
            'strDaoTao_LopHocPhan_Id': edu.util.getValById('dropLopHocPhan'),
            'strKieuHoc_Id': edu.util.getValById('dropKieuHoc'),
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropKeHoachDangKy'),
            'strDiem_ThanhPhanDiem_Id': edu.util.getValById('dropThanhPhanDiem'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    me.getList_LopHocPhanSuDung();
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CBDangKy();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_LopHocPhanSuDung: function (strIds) {
        var me = this;
        //--Edit
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/Xoa_DangKy_Thi_LopHocPhan',

            'strId': strIds,
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
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "(er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopHocPhanSuDung();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_LopQuanLySuDung: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/LayDSDangKy_Thi_LopQuanLy',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                    me.genTable_LopQuanLySuDung(dtResult);
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
    genTable_LopQuanLySuDung: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblLopQuanLySuDung",

            aaData: data,
            colPos: {
                center: [0, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HEDAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_KHOADAOTAO_TEN"
                },
                {
                    "mDataProp": "DAOTAO_TOCHUCCHUONGTRINH_TEN"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
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
    save_LopQuanLySuDung: function (strQLHLTL_NguoiHoc_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/Them_DangKy_Thi_LopQuanLy',
            'type': 'POST',
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropChuongTrinh_TL'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropLop_TL'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropKhoaDaoTao_TL'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropHeDaoTao_TL'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        title: obj_save + ": " + data.Message
                    };
                    edu.system.alert(data.Message);
                }
                me.getList_LopQuanLySuDung();
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));

            },
            type: 'POST',

            contentType: true,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_CBDangKy();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_LopQuanLySuDung: function (strIds) {
        var me = this;
        //--Edit
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin/Xoa_DangKy_Thi_LopQuanLy',

            'strId': strIds,
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
                }
                else {
                    obj = {
                        content: ": " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "(er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_LopQuanLySuDung();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },


    getList_KeHoachDangKy: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_KeHoachDangKy/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
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
                        iPager = data.Pager;
                    }
                    me.genCombo_KeHoachDangKy(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_KeHoachDangKy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKEHOACH",
            },
            renderPlace: ["dropKeHoachDangKy"],
            title: "Chọn kế hoạch đăng ký"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_HocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSHocPhanTheoKeHoach',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropKeHoachDangKy'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_HocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TEN) + " - " + edu.util.returnEmpty(aData.MA);
                }
            },
            renderPlace: ["dropHocPhan"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_LopHocPhan: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'DKH_ThongTin/LayDSLopHocPhanTheoKeHoach',
            'type': 'GET',
            'strDangKy_KeHoachDangKy_Id': edu.util.getValById('dropKeHoachDangKy'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                        iPager = data.Pager;
                    }
                    me.genCombo_LopHocPhan(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_LopHocPhan: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                mRender: function (nRow, aData) {
                    return edu.util.returnEmpty(aData.TENLOP) + " - " + edu.util.returnEmpty(aData.MALOP);
                }
            },
            renderPlace: ["dropLopHocPhan"],
            title: "Chọn lớp học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_ThanhPhanDiem: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'D_ThongTin_MH/DSA4BRIFKCQsHhUpIC8pESkgLwUoJCwP',
            'func': 'pkg_diem_thongtin.LayDSDiem_ThanhPhanDiem',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strThangDiem_Id': edu.util.getValById('dropAAAA'),
            'dLaThanhPhanDiemCuoi': -1,
            'strQuyTacLamTron_Id': edu.util.getValById('dropAAAA'),
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        iPager = data.Pager;
                    }
                    me.genCombo_ThanhPhanDiem(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_ThanhPhanDiem: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropThanhPhanDiem"],
            title: "Chọn thành phần điểm"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_PhanCong: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/DSA4BRIFIC8mCjgeFSkoHgkxHgopHg8pIC8SNAPP',
            'func': 'pkg_dangkythi_monthi_thongtin.LayDSDangKy_Thi_Hp_Kh_NhanSu',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
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
    save_PhanCong: function (strId) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/FSkkLB4FIC8mCjgeFSkoHgkxHgopHg8pIC8SNAPP',
            'func': 'pkg_dangkythi_monthi_thongtin.Them_DangKy_Thi_Hp_Kh_NhanSu',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiDung_Id': strId,
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
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/GS4gHgUgLyYKOB4VKSgeCTEeCikeDykgLxI0',
            'func': 'pkg_dangkythi_monthi_thongtin.Xoa_DangKy_Thi_Hp_Kh_NhanSu',
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

    genTable_PhanCong: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblPhanCong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachXuLy.getList_PhanCong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGUOIDUNG_TAIKHOAN"
                },
                {
                    "mDataProp": "NGUOIDUNG_TENDAYDU"
                },
                {
                    "mDataProp": "DAOTAO_COCAUTOCHUC_TEN"
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

    getList_KhoanThu: function () {
        var me = this;
        var obj_save = {
            'action': 'TC_ThuChi_MH/DSA4BRICICIKKS4gLxUpNAPP',
            'func': 'pkg_taichinh_thuchi.LayDSCacKhoanThu',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNhomCacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
            'strcanboquanly_id': edu.util.getValById('txtAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var data = data.Data;
                    me.genCombo_KhoanThu(data);
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
    genCombo_KhoanThu: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropLoaiKhoan", "dropKhoanThu"],
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_Phi: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/FSkkLB4FIC8mCjgeFSkoHgkxHgopHgw0IhEpKAPP',
            'func': 'pkg_dangkythi_monthi_thongtin.Them_DangKy_Thi_Hp_Kh_MucPhi',
            'iM': edu.system.iM,
            'strId': me.strPhi_Id,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strPhamViApDung_Id': edu.util.getValById('dropAAAA'),
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropLoaiKhoan'),
            'dSoTien': edu.util.getValById('txtSoTien'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'DKH_DangKyThi_MonThi_ThongTin_MH/EjQgHgUgLyYKOB4VKSgeCTEeCikeDDQiESko';
            obj_save.func = 'pkg_dangkythi_monthi_thongtin.Sua_DangKy_Thi_Hp_Kh_MucPhi'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alertOnModal(obj_notify);
                    }
                    me.getList_Phi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Phi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/DSA4BRIFIC8mCjgeFSkoHgkxHgopHgw0IhEpKAPP',
            'func': 'pkg_dangkythi_monthi_thongtin.LayDSDangKy_Thi_Hp_Kh_MucPhi',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtPhi = dtReRult;
                    me.genTable_Phi(dtReRult, data.Pager);
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
    delete_Phi: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_ThongTin_MH/GS4gHgUgLyYKOB4VKSgeCTEeCikeDDQiESko',
            'func': 'pkg_dangkythi_monthi_thongtin.Xoa_DangKy_Thi_Hp_Kh_MucPhi',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_Phi();
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
    genTable_Phi: function (data, iPager) {
        $("#lblPhi_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblPhi",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.Phi.getList_Phi()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [

                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_TEN) + " - " + edu.util.returnEmpty(aData.TAICHINH_CACKHOANTHU_MA);
                    }
                },
                {
                    "mDataProp": "SOTIEN"
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
    viewForm_Phi: function (strId) {
        var me = this;
        //call popup --Edit
        var data = me.dtPhi.find(e => e.ID == strId);
        $('#myModalPhi').modal('show');
        edu.util.viewValById("dropLoaiKhoan", data.TAICHINH_CACKHOANTHU_ID);
        edu.util.viewValById("txtSoTien", data.SOTIEN);
        me.strPhi_Id = data.ID;
    },
    
    getList_HocPhan_DSD: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'D_DKT_MonThi_Diem_MH/DSA4BRIJLiIRKSAvFSkkLgokNRA0IAUgLyYKOAPP',
            'func': 'pkg_dangkythi_monthi_diem.LayDSHocPhanTheoKetQuaDangKy',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_HocPhan_DSD(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_HocPhan_DSD: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropHocPhan_DSD"],
            title: "Chọn học phần"
        };
        edu.system.loadToCombo_data(obj);
    },

    getList_DanhSachHoc_DSD: function () {
        var me = this;

        //--Edit
        var obj_save = {
            'action': 'D_DKT_MonThi_Diem_MH/DSA4BRIFIC8pEiAiKQkuIgPP',
            'func': 'pkg_dangkythi_monthi_diem.LayDSDanhSachHoc',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan_DSD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    me.genCombo_DanhSachHoc_DSD(dtResult, iPager);
                }
                else {
                    edu.system.alert(": " + data.Message, "w");
                }

            },
            error: function (er) {
                edu.system.alert("(er): " + JSON.stringify(er), "w");

            },
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genCombo_DanhSachHoc_DSD: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropDanhSachHoc_DSD"],
            title: "Chọn danh sách học"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    save_DSD: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_DKT_MonThi_Diem_MH/FSAuBRIPKSAxBSgkLBUpJC4KJDUQNCAFIC8mCjgP',
            'func': 'pkg_dangkythi_monthi_diem.TaoDSNhapDiemTheoKetQuaDangKy',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan_DSD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'DKH_DangKyThi_MonThi_ThongTin_MH/EjQgHgUgLyYKOB4VKSgeCTEeCikeDDQiESko';
        //    obj_save.func = 'pkg_dangkythi_monthi_thongtin.Sua_DangKy_Thi_Hp_Kh_MucPhi'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                    //me.getList_Phi();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_TinhDiemDSD: function (strDiem_DSH_NguoiHoc_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'D_DKT_MonThi_Diem_MH/FSgvKQ0gKAUoJCwVKSgNICgP',
            'func': 'pkg_dangkythi_monthi_diem.TinhLaiDiemThiLai',
            'iM': edu.system.iM,
            'strDiem_DSH_NguoiHoc_Id': strDiem_DSH_NguoiHoc_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (obj_save.strId) {
        //    obj_save.action = 'DKH_DangKyThi_MonThi_ThongTin_MH/EjQgHgUgLyYKOB4VKSgeCTEeCikeDDQiESko';
        //    obj_save.func = 'pkg_dangkythi_monthi_thongtin.Sua_DangKy_Thi_Hp_Kh_MucPhi'
        //}
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_DSD();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_DSD: function () {
        var me = this;
        var obj_save = {
            'action': 'D_DKT_MonThi_Diem_MH/DSA4BRIFIC8pEiAiKQkuIh4PJjQuKAkuIgPP',
            'func': 'pkg_dangkythi_monthi_diem.LayDSDanhSachHoc_NguoiHoc',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDiem_DanhSach_Id': edu.util.getValById('dropDanhSachHoc_DSD'),
            'strDaoTao_HocPhan_Id': edu.util.getValById('dropHocPhan_DSD'),
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_DSD(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genTable_DSD: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblDSD",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "DIEM_DANHSACHHOC_TEN"
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HoDem + QLSV_NGUOIHOC_Ten"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                {
                    "mDataProp": "QLSV_NGUOIHOC_NGAYSINH"
                },
                {
                    "mDataProp": "GIOITINH_TEN"
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
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
                },
                {
                    "mDataProp": "THOIGIAN"
                },
                {
                    "mDataProp": "DAOTAO_LOPHOCPHAN_GOC_TEN"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMCHU"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
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

    getList_ChuaTaoDSD: function () {
        var me = this;
        var obj_save = {
            'action': 'D_DKT_MonThi_Diem_MH/DSA4BRIFIAU0OCQ1Dyk0LyYCKTQgFSAuBRIFKCQs',
            'func': 'pkg_dangkythi_monthi_diem.LayDSDaDuyetNhungChuaTaoDSDiem',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_ChuaTaoDSD(dtResult);
                }
                else {
                    edu.system.alert( data.Message, "w");
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
    genTable_ChuaTaoDSD: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblChuaTaoDSD",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "QLSV_NGUOIHOC_MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HoDem + QLSV_NGUOIHOC_Ten"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.QLSV_NGUOIHOC_HODEM) + " " + edu.util.returnEmpty(aData.QLSV_NGUOIHOC_TEN);
                    }
                },
                
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "LANHOC"
                },
                {
                    "mDataProp": "LANTHI"
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


    getList_ChuaDangKy: function () {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIFChUzLi8mESkgLBcoDyk0LyYCKTQgBQoP',
            'func': 'pkg_dangkythi_monthi_chung.LayDSDKTrongPhamViNhungChuaDK',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    me.genTable_ChuaDangKy(dtResult);
                }
                else {
                    edu.system.alert(data.Message, "w");
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
    genTable_ChuaDangKy: function (data) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblChuaDangKy",

            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    //"mDataProp": "QLSV_NGUOIHOC_HoDem + QLSV_NGUOIHOC_Ten"
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HODEM) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },

                {
                    "mDataProp": "CHUONGTRINH"
                },
                {
                    "mDataProp": "KHOAHOC"
                },
                {
                    "mDataProp": "KHOAQUANLY"
                },
                {
                    "mDataProp": "TENHOCPHAN"
                },
                {
                    "mDataProp": "MAHOCPHAN"
                },
                {
                    "mDataProp": "SOTINCHI"
                },
                {
                    "mDataProp": "LOPDANGKY"
                },
                {
                    "mDataProp": "DIEM"
                },
                {
                    "mDataProp": "DANHGIA_TEN"
                },
                {
                    "mDataProp": "DIEMQUYDOI"
                },
                {
                    "mDataProp": "DIEMCHU"
                },
                {
                    "mDataProp": "THOIGIAN"
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

    save_HPDangKy: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/FSkkLB4FIC8mCjgeFSkoHgkRHgoJHgkuIhEpIC8P',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.Them_DangKy_Thi_HP_KH_HocPhan',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HocPhan_Id': strPhamViApDung_Id,
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

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_HPDangKy();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HPDangKy: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIFIC8mCjgeFSkoHgkRHgoJHgkuIhEpIC8P',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDangKy_Thi_HP_KH_HocPhan',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHPDangKy"] = dtReRult;
                    me.genTable_HPDangKy(dtReRult, data.Pager);
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
    delete_HPDangKy: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/GS4gHgUgLyYKOB4VKSgeCREeCgkeCS4iESkgLwPP',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.Xoa_DangKy_Thi_HP_KH_HocPhan',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HPDangKy();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HPDangKy: function (data, iPager) {
        $("#lblHPDangKy_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHPDangKy",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.HPDangKy.getList_HPDangKy()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_DONVI"
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

    save_HPKhong: function (strPhamViApDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/FSkkLB4FIC8mCjgeFSkoHgkRHgoJHgoJLiIRKSAv',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.Them_DangKy_Thi_HP_KH_KHocPhan',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strDaoTao_HocPhan_Id': strPhamViApDung_Id,
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

                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessProGes", function () {
                    me.getList_HPKhong();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_HPKhong: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIFIC8mCjgeFSkoHgkRHgoJHgoJLiIRKSAv',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDangKy_Thi_HP_KH_KHocPhan',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtHPKhong"] = dtReRult;
                    me.genTable_HPKhong(dtReRult, data.Pager);
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
    delete_HPKhong: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/GS4gHgUgLyYKOB4VKSgeCREeCgkeCgkuIhEpIC8P',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.Xoa_DangKy_Thi_HP_KH_KHocPhan',
            'iM': edu.system.iM,
            'strId': Ids,
            'strNguoiThucHien_Id': edu.system.userId,
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
                        content: data.Message,
                        code: "w"
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {

                obj = {
                    title: "",
                    content: JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);
            },
            type: "POST",
            action: obj_save.action,

            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_HPKhong();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_HPKhong: function (data, iPager) {
        $("#lblHPKhong_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblHPKhong",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.HPKhong.getList_HPKhong()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_SOTIN"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_DONVI"
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
    --Discription: [1] AccessDB ==> DotThi (Chọn đợt thi cho kế hoạch)
    -------------------------------------------*/
    getList_DotThi_KeHoach: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIFIC8mCjgeFSkoHgkRHgoJHgUuNRUpKAPP',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDangKy_Thi_HP_KH_DotThi',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genTable_DotThi_KeHoach(dtResult);
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
    genTable_DotThi_KeHoach: function (data) {
        $("#tblDotThi tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var strId = edu.util.returnEmpty(d.ID);
            var strTen = edu.util.returnEmpty(d.THI_DOTTHI_TEN);
            var row = '';
            row += '<tr>';
            row += '<td class="td-center">' + (i + 1) + '</td>';
            row += '<td class="td-left">' + strTen + '</td>';
            row += '<td class="td-center"><a class="deleteDotThi" id="' + strId + '" href="javascript:void(0)" style="color:red">Xóa</a></td>';
            row += '<td class="td-center"><input type="checkbox" id="checkX' + strId + '"/></td>';
            row += '</tr>';
            $("#tblDotThi tbody").append(row);
        }
    },
    getList_DotThi: function () {
        var me = this;
        var obj_list = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/DSA4BRIFLjUVKSgP',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.LayDSDotThi',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.genTable_ModalDotThi(dtResult);
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
    genTable_ModalDotThi: function (data) {
        var jsonForm = {
            strTable_Id: "tblModalDotThi",
            aaData: data,
            colPos: {
                center: [0, 2],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.THI_DOTTHI_TEN || aData.TENDOTTHI);
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
    },
    save_DotThi: function (strThi_DotThi_Id) {
        var me = this;
        var obj_save = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/FSkkLB4FIC8mCjgeFSkoHgkRHgoJHgUuNRUpKAPP',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.Them_DangKy_Thi_HP_KH_DotThi',
            'iM': edu.system.iM,
            'strDangKy_Thi_HP_KeHoach_Id': me.strKeHoachXuLy_Id,
            'strThi_DotThi_Id': strThi_DotThi_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (!data.Success) {
                    edu.system.alert(data.Message);
                }
            },
            error: function (er) {
                edu.system.alert(JSON.stringify(er));
            },
            type: 'POST',
            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessDotThi", function () {
                    $("#myModalAddDotThi").modal("hide");
                    me.getList_DotThi_KeHoach();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    delete_DotThi: function (strId) {
        var me = this;
        var obj = {};
        var obj_delete = {
            'action': 'DKH_DangKyThi_MonThi_Chung_MH/GS4gHgUgLyYKOB4VKSgeCREeCgkeBS41FSko',
            'func': 'PKG_DANGKYTHI_MONTHI_CHUNG.Xoa_DangKy_Thi_HP_KH_DotThi',
            'iM': edu.system.iM,
            'strId': strId,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj = { content: "Xóa thành công!", code: "" };
                    edu.system.afterComfirm(obj);
                    me.getList_DotThi_KeHoach();
                }
                else {
                    obj = { content: ": " + data.Message, code: "" };
                    edu.system.afterComfirm(obj);
                }
            },
            error: function (er) {
                edu.system.afterComfirm({ content: "(er): " + JSON.stringify(er), code: "w" });
            },
            type: 'POST',
            action: obj_delete.action,
            contentType: true,
            data: obj_delete,
            fakedb: []
        }, false, false, false, null);
    },
}