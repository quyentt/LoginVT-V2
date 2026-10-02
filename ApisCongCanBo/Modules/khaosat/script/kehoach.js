/*----------------------------------------------
--Author: Văn Hiệp
--Phone: 
--Date of created: 
--Input: 
--Output:
--Note:
----------------------------------------------*/
function KeHoach() { };
KeHoach.prototype = {
    dtKeHoach: [],
    strKeHoach_Id: '',
    arrNhanSu_Id: [],
    arrSinhVien_Id: [],
    arrSinhVien: [],
    dtSinhVien: [],
    dtXacNhan: [],
    dtTuyenXe: [],
    dtLoaiKhoan: [],
    tblChon: '',
    strHead: '',
    dtDoiTuong_View: [],
    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        
        //me.save_CustomAPI();
        //me.getList_DuLieu_ChiTiet();


        me.strHead = $("#tblKetQuaChiTiet thead").html();
        me.getList_KeHoach();
        me.getList_Phieu();
        me.getList_ThoiGian();
        //me.toggle_themphieu();
        //me.getList_DMHocPhan();
        //edu.system.loadToCombo_DanhMucDuLieu("QLSV.VE.LOAI", "");
        edu.system.loadToCombo_DanhMucDuLieu("KS.PHANLOAI.DOITUONGDUOCKHAOSAT", "", "", data => me["dtLoaiDoiTuong"] = data);
        me.getList_KhoaQuanLy_TabPan();
        //me.getList_DMLKT();
        //$("#modal_giangvien").modal("show");
        $("#btnSearch").click(function (e) {
            me.getList_KeHoach();
        });
        $("#txtSearch").keypress(function (e) {
            if (e.which === 13) {
                me.getList_KeHoach();
            }
        });
        $(".btnClose").click(function () {
            me.toggle_form();
        });
        $(".btnCloseDSPhieu").click(function () {
            me.toggle_dsphieu();
        });
        $("#btnAdd").click(function () {
            me.rewrite();
            me.toggle_edit();
        });
        $("#btnSave_KeHoach").click(function (e) {
            var valid = edu.util.validInputForm(me.arrValid);

            if (valid) {
                me.save_KeHoach();
            }
        });
        $(document).on("change", "#dropPhieuMau", function () {
            var $sel = $(this);
            $sel.attr("title", $sel.find("option:selected").text() || "");
        });
        $("#btnDelete_KeHoach_Edit").click(function () {
            if (!me.strKeHoach_Id) return;
            edu.system.confirm("Bạn có chắc chắn muốn xóa kế hoạch này không?");
            $("#btnYes").off("click.delKHEdit").on("click.delKHEdit", function () {
                $('#myModalAlert').modal('hide');
                me.delete_KeHoach(me.strKeHoach_Id);
                me.toggle_form();
            });
        });
        $("[id$=chkSelectAll_KeHoach]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblKeHoach" });
        });
        $("#btnDelete_KeHoach").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoach", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                $('#myModalAlert').modal('hide');
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ResetKeHoach(arrChecked_Id[i]);
                }
            });
        });

        $("[id$=chkSelectAll_PhamVi]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhamVi" });
        });
        $("[id$=chkSelectAll_DoiTuong]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDoiTuong" });
        });

        $("[id$=chkSelectAll_ChuaThamGia]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblChuaThamGia" });
        });
        $("[id$=chkSelectAll_Phieu]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblPhieu" });
        });
        $("#tblKeHoach").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_edit()
            me.strKeHoach_Id = strId;
            edu.util.setOne_BgRow(strId, "tblKeHoach");
            if (edu.util.checkValue(strId)) {
                var data = edu.util.objGetDataInData(strId, me.dtKeHoach, "ID")[0];
                me.viewEdit_KeHoach(data);
                $("#btnDelete_KeHoach_Edit").removeClass("d-none");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });

        $("#tblKeHoach").delegate('.btnPhieu', 'click', function (e) {
            var strId = this.id;
            me.toggle_dsphieu()
            var data = me.dtKeHoach.find(e => e.ID == strId);
            me.strKeHoach_Id = strId;
            me["strMauPhieu_Id"] = data.KS_PHIEUKHAOSAT_MAU_ID;
            me.getList_PhieuKhaoSat();
            me.getList_DoiTuongDuocKhaoSat();
        });

        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order: 
        -------------------------------------------*/
        
        $("#btnAdd_PhamVi").click(function () {
            console.log(11111);
            me.tblChon = "tblPhamVi"
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                var html = "";
                arrChecked_Id.forEach(strSinhVien_Id => {
                    var aData = edu.extend.dtSinhVien.find(e => e.ID == strSinhVien_Id);
                    html += "<tr id='rm_row" + strSinhVien_Id + "' name='new' svid='" + aData.QLSV_NGUOIHOC_ID + "'>";
                    html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
                    html += "<td class='td-left' id='lblMa" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_MASO + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                })
                $("#" + main_doc.KeHoach.tblChon + " tbody").append(html);
            });
            edu.extend.getList_SinhVienMD();
        });

        $("#btnAdd_GV_PhamVi").click(function () {
            console.log(11111);
            me.tblChon = "tblPhamVi"
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                var html = "";
                arrChecked_Id.forEach(strSinhVien_Id => {
                    //if (me.arrSinhVien_Id.indexOf(strSinhVien_Id) == -1) {
                    //    me.arrSinhVien_Id.push(strSinhVien_Id);
                        
                    //}
                    var aData = edu.extend.dtNhanSu.find(e => e.ID == strSinhVien_Id);
                    html += "<tr id='rm_row" + strSinhVien_Id + "' name='new'>";
                    html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
                    html += "<td class='td-left' id='lblMa" + strSinhVien_Id + "'>" + aData.MASO + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.HOTEN + "</td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                })
                $("#" + main_doc.KeHoach.tblChon + " tbody").append(html);
            });
            edu.extend.getList_NhanSu();
        });
        $("#btnAdd_DTK_PhamVi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DoiTuongKhac_SinhVien(id);
        });
        $("#tblPhamVi").delegate('.btnDeletePoiter', 'click', function () {
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
        $(".btnDelete_PhamVi").click(function () {
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
                    me.delete_SinhVien(arrChecked_Id[i]);
                }
            });
        });

        $("#modal_sinhvien").delegate('#btnAdd_Khoa', 'click', function () {
            edu.extend.arrKhoa = $("#dropSearchModal_Khoa_SV").val();
            if (edu.extend.arrKhoa.length > 0) {
                var strApDungChoKhoa = "";
                var x = $("#dropSearchModal_Khoa_SV option:selected").each(function () {
                    strApDungChoKhoa += ", " + $(this).text();
                });
                $(".ApDungChoKhoa").html("Áp dụng cho khóa: " + strApDungChoKhoa);
                edu.system.alert("Áp dụng cho những khóa: " + strApDungChoKhoa);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_ChuongTrinh', 'click', function () {
            edu.extend.arrChuongTrinh = $("#dropSearchModal_ChuongTrinh_SV").val();
            if (edu.extend.arrChuongTrinh.length > 0) {
                var strApDungChoChuongTrinh = "";
                var x = $("#dropSearchModal_ChuongTrinh_SV option:selected").each(function () {
                    strApDungChoChuongTrinh += ", " + $(this).text();
                });
                $(".ApDungChoChuongTrinh").html("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                edu.system.alert("Áp dụng cho chương trình: " + strApDungChoChuongTrinh);
                $("#modal_sinhvien").modal("hide");
            }
        });
        $("#modal_sinhvien").delegate('#btnAdd_Lop', 'click', function () {
            edu.extend.arrLop = $("#dropSearchModal_Lop_SV").val();
            if (edu.extend.arrLop.length > 0) {
                var strApDungChoLop = "";
                var x = $("#dropSearchModal_Lop_SV option:selected").each(function () {
                    strApDungChoLop += ", " + $(this).text();
                });
                $(".ApDungChoLop").html("Áp dụng cho lớp: " + strApDungChoLop);
                edu.system.alert("Áp dụng cho lớp: " + strApDungChoLop);
                $("#modal_sinhvien").modal("hide");
            }
        });


        $("#btnAdd_DoiTuong").click(function () {
            console.log(11111);
            me.tblChon = "tblDoiTuong";
            edu.extend.genModal_SinhVien(arrChecked_Id => {
                var html = "";
                arrChecked_Id.forEach(strSinhVien_Id => {
                    var aData = edu.extend.dtSinhVien.find(e => e.ID == strSinhVien_Id);
                    html += "<tr id='rm_row" + strSinhVien_Id + "' name='new' svid='" + aData.QLSV_NGUOIHOC_ID + "'>";
                    html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
                    html += "<td class='td-left' id='lblMa" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_MASO + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.QLSV_NGUOIHOC_HODEM + " " + aData.QLSV_NGUOIHOC_TEN + "</td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                })
                $("#" + main_doc.KeHoach.tblChon + " tbody").append(html);
            });
            edu.extend.getList_SinhVienMD();
        });

        $("#btnAdd_GV_DoiTuong").click(function () {
            console.log(11111);
            me.tblChon = "tblDoiTuong";
            edu.extend.genModal_NhanSu(arrChecked_Id => {
                var html = "";
                arrChecked_Id.forEach(strSinhVien_Id => {
                    var aData = edu.extend.dtNhanSu.find(e => e.ID == strSinhVien_Id);
                    html += "<tr id='rm_row" + strSinhVien_Id + "' name='new'>";
                    html += "<td class='td-center'>" + me.arrSinhVien_Id.length + "</td>";
                    html += "<td class='td-left' id='lblMa" + strSinhVien_Id + "'>" + aData.MASO + "</td>";
                    html += "<td class='td-left' id='lblTen" + strSinhVien_Id + "'>" + aData.HOTEN + "</td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strSinhVien_Id + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                })
                $("#" + main_doc.KeHoach.tblChon + " tbody").append(html);
            });
            edu.extend.getList_NhanSu();
        });
        $("#btnAdd_DTK_DoiTuong").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_DoiTuongKhac_DoiTuong(id);
        });

        $("#btnAdd_SVDangKy_PhamVi").click(function (e) {
            e.preventDefault();
            me.tblChon = "tblPhamVi";
            me._openDSDangKyHocPicker("tblPhamVi");
        });
        $("#btnAdd_SVDangKy_DoiTuong").click(function (e) {
            e.preventDefault();
            me.tblChon = "tblDoiTuong";
            me._openDSDangKyHocPicker("tblDoiTuong");
        });

        $("#tblDoiTuong").delegate('.btnDeletePoiter', 'click', function () {
            var id = this.id;
            var strcheck = $(this).attr("name");
            var strNhanSu_Id = edu.util.cutPrefixId(/remove_nhansu/g, id);
            if (!edu.util.checkValue(strcheck)) {
                me.removeHTMLoff_DoiTuong(strNhanSu_Id);
            }
            else {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_DoiTuong(strNhanSu_Id);
                });
            }
        });
        $(".btnDelete_DoiTuong").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDoiTuong", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DoiTuong(arrChecked_Id[i]);
                }
            });
        });
        /*------------------------------------------
        --Discription: [2] Action SinhVien
        --Order:
        -------------------------------------------*/
        me.arrValid = [
            //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
            { "MA": "txtKeHoach_So", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_ToChucCoDeTai", "THONGTIN1": "EM" },
            //{ "MA": "txtDeTai_TongSoTacGia", "THONGTIN1": "EM" },
            //{ "MA": "dropDeTai_PhanLoai", "THONGTIN1": "EM" }
        ];

        $("#tblKeHoach").delegate('.btnDangKy', 'click', function (e) {
            $('#modaldangky').modal('show');
            me.getList_DaDangKy(this.id);
        });
        $("#tblKeHoach").delegate('.btnKetQua', 'click', function (e) {
            //$('#modaldathamgia').modal('show');
            //me.getList_ThamGia(this.id);
            me.toggle_ketqua();
            me.strKeHoach_Id = this.id;
            me.getList_KetQua_ThamGia();
            me.getList_KetQua_DuocKhaoSat();
            me.getList_KetQua_ChuaThucHien();
            me.getList_KetQua_ChiTiet();
        });


        $("#btnAdd_DSPhieu").click(function () {
            me.toggle_phieu();
            me["strPhieu_Id"] = "";
            me.getList_ChuaThamGia();
            $("#zonePhieu .zoneAdd").show();
            $("#zonePhieu .zoneEdit").hide();
            $("#tblThamGia tbody").html("");
            var data = {};
            edu.util.viewValById("txtTenPhieu", data.TENPHIEU);
            edu.util.viewValById("txtMaPhieu", data.MAPHIEU);
            edu.util.viewValById("txtMoTaPhieu", data.MOTA);
            edu.util.viewHTMLById("txtMoTaPhieu", data.MOTA);
        });
        $(".btnDelete_DSPhieu").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblDSPhieu", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_DSPhieu(arrChecked_Id[i]);
                }
            });
        });
        $("#btnLuuDoiTuongDuocKhaoSat").click(function () {
            me.save_DoiTuongDuocKhaoSat();
        });
        $("#btnKhoiTaoPhieu").click(function () {
            me.save_KhoiTaoPhieu();
        });
        $("#btnGenPhieu").click(function () {
            me.save_GenPhieu();
        });
        $("#btnAdd_PhieuTuDong").click(function () {
            me.toggle_themphieu();
            me.getList_TabHome();
            me.getList_TabPro();
            me.getList_TabPan();
        });

        $("#tblDSPhieu").delegate('.btnEdit', 'click', function (e) {
            var strId = this.id;
            me.toggle_phieu();
            me["strPhieu_Id"] = strId;
            $("#zonePhieu .zoneAdd").hide();
            $("#zonePhieu .zoneEdit").show();
            var data = me.dtPhieuKhaoSat.find(e => e.ID == strId);
            edu.util.viewValById("txtTenPhieu", data.TENPHIEU);
            edu.util.viewValById("txtMaPhieu", data.MAPHIEU);
            edu.util.viewValById("txtMoTaPhieu", data.MOTA);
            edu.util.viewHTMLById("txtMoTaPhieu", data.MOTA);
            me.getDetail_DoiTuongDuocKhaoSat();
            me.getList_ThamGia();
            me.getList_ChuaThamGia();
        });
        $("#tblDSPhieu").delegate('.btnXemTongThePhieu', 'click', function (e) {
            var strId = this.id;
            var aData = me.dtPhieuKhaoSat.find(e => e.ID == strId);
            var url = edu.system.strhost + ":60652/pages/phieukhaosat.aspx";
            var url = edu.system.strhost + "/congthongtin/pages/phieukhaosat.aspx";
            //var data = me.dtPhieu.find(e => e.ID == strId);
            url += '?strPhieu_Id=' + strId;
            url += '&strKeHoach_Id=' + aData.KS_KEHOACHKHAOSAT_ID;
            url += '&strNguoiThucHien_Id=' + edu.system.userId;
            console.log(url);
            window.open(url, "_blank", 'location=yes, height=' + window.screen.height + ', width=' + window.screen.width + ', scrollbars=yes, status=yes');
            //me.strPhieu_Id = strId;
            //me.toggle_phieu();
            //me.getList_Nhom();
            //var data = me.dtPhieu.find(e => e.ID == strId);
            //$("#lblTieuDe").html(data.TENPHIEU)
            //$("#lblMoTaPhieu").html('<strong>' + edu.util.returnEmpty(data.LOAIPHIEU_TEN) + ':</strong> <span>' + edu.util.returnEmpty(data.MOTA) + '</span>');
        });

        $("[id$=chkSelectAll_DSPhieu]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblDSPhieu" });
        });
        $("[id$=chkSelectAll_ThamGia]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblThamGia" });
        });
        $("[id$=chkSelectAll_TabHome]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTabHome" });
        });
        $("[id$=chkSelectAll_TabPro]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTabPro" });
        });
        $("[id$=chkSelectAll_TabPan]").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblTabPan" });
        });


        //--Bỏ auto-call khi chọn kỳ: chỉ gọi DS khi user bấm nút "Xem DS ... theo TKB"
        //  (tránh gọi N lần khi chọn nhiều kỳ)
        $("#btnTaoPhieuTabHome").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTabHome", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_TabHome(arrChecked_Id[i]);
            }
        });
        $("#btnTaoPhieuTabPro").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTabPro", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_TabPro(arrChecked_Id[i]);
            }
        });
        function runTabPan(iChayTienTrinh, strTitle) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblTabPan", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            var valKhoa = edu.util.getValById("dropKhoaQuanLy_TabPan");
            //--Khoa quản lý là tùy chọn: không chọn -> truyền chuỗi rỗng (BE coi như null)
            var arrKhoa_Id = [];
            if (valKhoa) {
                arrKhoa_Id = Array.isArray(valKhoa)
                    ? valKhoa.filter(Boolean)
                    : String(valKhoa).split(',').map(s => s.trim()).filter(Boolean);
            }
            var strKhoaQuanLy_Id = arrKhoa_Id.join(',');
            //--V3: 1 dòng = 1 call (BE tự xác định GV trong DB). Không cần lookup/split GV.
            function _go() {
                me.runBatchProgress(arrChecked_Id, strTitle, function (strLopHP_Id, done) {
                    me.save_TabPan(strLopHP_Id, strKhoaQuanLy_Id, iChayTienTrinh, done);
                });
            }
            edu.system.confirm(
                "Sẽ tạo phiếu cho <strong>" + arrChecked_Id.length + "</strong> lớp học phần.<br>" +
                "Bạn có muốn tiếp tục?"
            );
            $("#btnYes").off("click.tabpan").on("click.tabpan", function () {
                $('#myModalAlert').modal('hide');
                _go();
            });
        }
        $("#btnTaoPhieuTabPan").click(function () {
            runTabPan(0, "Đang tạo phiếu khảo sát (chạy ngay)...");
        });
        $("#btnTaoPhieuTabPanTT").click(function () {
            runTabPan(1, "Đang chạy tiến trình tạo phiếu khảo sát...");
        });
        function _validateTime(strDropId, strTblId) {
            var val = edu.util.getValById(strDropId);
            if (!val || (Array.isArray(val) && val.length === 0)) {
                edu.system.alert("Vui lòng chọn ít nhất 1 thời gian!");
                return false;
            }
            //--Hiển thị loading inline trong bảng để user biết đang tải
            $("#" + strTblId + " tbody").html(
                '<tr><td colspan="20" class="text-center py-4" style="color:#0969da">' +
                '<i class="fal fa-spinner fa-spin me-2"></i>Đang tải dữ liệu, vui lòng đợi...' +
                '</td></tr>'
            );
            return true;
        }
        $("#btnThoiGianTabPan").click(function () {
            if (!_validateTime("dropSearch_ThoiGianTabPan", "tblTabPan")) return;
            me.getList_TabPan();
        });
        $("#btnThoiGianTabPro").click(function () {
            if (!_validateTime("dropSearch_ThoiGianTabPro", "tblTabPro")) return;
            me.getList_TabPro();
        });
        $("#btnThoiGianTabHome").click(function () {
            if (!_validateTime("dropSearch_ThoiGianTabHome", "tblTabHome")) return;
            me.getList_TabHome();
        });

        $("#btnAdd_ChuaThamGia").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaThamGia", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_ChuaThamGia(arrChecked_Id[i]);
            }
        });
        $("#btnDelete_ThamGia").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblChuaThamGia", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.delete_ThamGia(arrChecked_Id[i]);
            }
        });
        edu.system.getList_MauImport("zonebtnBaoCao_KeHoach", function (addKeyValue) {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblKeHoach", "checkX");
            var arrCheckedKhoaHoc_Id = edu.util.getArrCheckedIds("tblKhoaHocPopup", "checkX");
            //addKeyValue("dHieuLuc", edu.util.getValById("dropSearch_HieuLuc"));
            arrChecked_Id.forEach(e => addKeyValue("strKS_KeHoachKhaoSat_Id", e));
            arrCheckedKhoaHoc_Id.forEach(e => addKeyValue("strDaoTao_KhoaHoc_Id", e));
        });

        $("#tblThamGia").delegate('.btnXemPhieu', 'click', function (e) {
            var strId = this.id;
            var url = edu.system.strhost + "/congthongtin/pages/thuchienkhaosat.aspx";
            //var data = me.dtPhieu.find(e => e.ID == strId);
            url += '?strPhieu_Id=' + me.strPhieu_Id;
            url += '&strNguoiThucHien_Id=' + strId;
            window.open(url, "_blank", 'location=yes, height=' + window.screen.height + ', width=' + window.screen.width + ', scrollbars=yes, status=yes');
        });

        function showPopup() {
            document.getElementById("popupOverlay").style.display = "block";
        }

        function closePopup() {
            document.getElementById("popupOverlay").style.display = "none";
        }
        $("#tblKeHoach").delegate('.btnKhoaHoc', 'click', function (e) {
            var strId = this.id;
            e.stopPropagation();

            var pop = document.getElementById("miniPopover");
            pop.style.display = "block";

            var x = e.pageX;
            var y = e.pageY;

            pop.style.left = x + "px";
            pop.style.top = y + "px";

            var popRect = pop.getBoundingClientRect();
            var maxRight = window.pageXOffset + window.innerWidth;
            var maxBottom = window.pageYOffset + window.innerHeight;

            if (x + popRect.width > maxRight) {
                pop.style.left = (maxRight - popRect.width - 10) + "px";
            }

            if (y + popRect.height > maxBottom) {
                pop.style.top = (y - popRect.height - 10) + "px";
            }
            var aData = me.dtKeHoach.find(e => e.ID == strId);
            console.log(aData);
            $("#lblTenKeHoachPopUp").html(aData.TENKEHOACH);
            me.getList_KhoaHoc(strId);
        });
        $("#btnClosePopup").click(function () {
            $("#miniPopover").hide();
        });
    },

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoach_Id = "";
        me.arrSinhVien_Id = [];
        me.arrSinhVien = [];
        me.arrNhanSu_Id = [];
        edu.extend.arrLop = [];
        edu.extend.arrKhoa = [];
        edu.extend.arrChuongTrinh = [];
        $(".ApDungChoLop").html("");
        $(".ApDungChoKhoa").html("");
        $(".ApDungChoChuongTrinh").html("");
        $("#btnDelete_KeHoach_Edit").addClass("d-none");

        var data = {};
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        edu.util.viewValById("dropCheDo", data.CHEDOKHAOSAT);
        edu.util.viewValById("dropPhieuMau", data.KS_PHIEUKHAOSAT_MAU_ID);
        edu.util.viewValById("txtNamHoc", data.NAMHOC);
        edu.util.viewValById("txtHocKy", data.HOCKY);
        edu.util.viewValById("txtDot", data.DOTHOC);
        edu.util.viewValById("txtMoTa", data.NOIDUNGKEHOACH);
        edu.util.viewHTMLById("txtMoTa", data.NOIDUNGKEHOACH);
        $("#tblPhamVi tbody").html("");
        
    },
    toggle_form: function () {
        edu.util.toggle_overide("zone-bus", "zonebatdau");
        this.getList_KeHoach();
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus", "zoneEdit");
    },
    toggle_phieu: function () {
        edu.util.toggle_overide("zone-bus", "zonePhieu");
    },
    toggle_dsphieu: function () {
        edu.util.toggle_overide("zone-bus", "zoneDSPhieu");
    },
    toggle_themphieu: function () {
        edu.util.toggle_overide("zone-bus", "zoneThemPhieu");
    },
    toggle_ketqua: function () {
        edu.util.toggle_overide("zone-bus", "zoneKetQua");
    },
    _openDSDangKyHocPicker: function (tblId) {
        var me = this;
        if (!window.DSDangKyHocPicker) {
            edu.system.alert("Chưa nạp được DSDangKyHocPicker.", "w");
            return;
        }
        window.DSDangKyHocPicker.open({
            multiple: true,
            onSelect: function (arr) {
                if (!arr || arr.length === 0) return;
                var $tbody = $("#" + tblId + " tbody");
                var iStt = $tbody.find("tr").length;
                var html = "";
                arr.forEach(function (r) {
                    var strKey = r.QLSV_NGUOIHOC_ID || r.ID;
                    if (!strKey) return;
                    if ($("#" + tblId + " #rm_row" + strKey).length) return;
                    var strTen = ((r.QLSV_NGUOIHOC_HODEM || "") + " " + (r.QLSV_NGUOIHOC_TEN || "")).trim();
                    var strMa = r.QLSV_NGUOIHOC_MASO || "";
                    iStt++;
                    html += "<tr id='rm_row" + strKey + "' name='new' svid='" + (r.QLSV_NGUOIHOC_ID || "") + "'>";
                    html += "<td class='td-center'>" + iStt + "</td>";
                    html += "<td class='td-left' id='lblMa" + strKey + "'>" + strMa + "</td>";
                    html += "<td class='td-left' id='lblTen" + strKey + "'>" + strTen + "</td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-left'></td>";
                    html += "<td class='td-center'><a id='remove_nhansu" + strKey + "' class='btnDeletePoiter poiter'><i class='fa fa-trash'></i></a></td>";
                    html += "</tr>";
                });
                if (html) $tbody.append(html);
            }
        });
    },
    /*------------------------------------------
    --Discription: [1] ACCESS DB ==> KhoanThu
    --ULR: Modules
    -------------------------------------------*/
    getList_KeHoach: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_KeHoachKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch'),
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtKeHoach = dtReRult;
                    me.genTable_KeHoach(dtReRult, data.Pager);
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
    save_KeHoach: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_KeHoachKhaoSat',
            'type': 'POST',
            'strId': me.strKeHoach_Id,
            'strTenKeHoach': edu.util.getValById('txtTen'),
            'strNoiDungKeHoach': edu.util.getValById('txtMoTa'),
            'strNgayBatDau': edu.util.getValById('txtTuNgay'),
            'strNgayKetThuc': edu.util.getValById('txtDenNgay'),
            'strNamHoc': edu.util.getValById('txtNamHoc'),
            'strHocKy': edu.util.getValById('txtHocKy'),
            'strDotHoc': edu.util.getValById('txtDot'),
            'dCheDoKhaoSat': edu.util.getValById('dropCheDo'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropPhieuMau'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'KS_ThongTin/Sua_KS_KeHoachKhaoSat';
        }
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoach_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoach_Id = obj_save.strId
                    }
                    $("#tblPhamVi tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, ''); console.log(strNhanSu_Id);
                        if ($(this).attr("name") == "new") {
                            var strTen = $("#lblTen" + strNhanSu_Id).html();
                            var strMa = $("#lblMa" + strNhanSu_Id).html();
                            if ($(this).attr("svid")) strNhanSu_Id = $(this).attr("svid");
                            me.save_SinhVien(strNhanSu_Id, strKeHoach_Id, strTen, strMa);
                        }
                        if ($(this).attr("name") == "newdoituong") {
                            //var strNhanSu_Id = this.id;
                            console.log(strNhanSu_Id);
                            me.save_SinhVien(strNhanSu_Id, strKeHoach_Id, $("#txtTen" + strNhanSu_Id).val(), $("#txtMa" + strNhanSu_Id).val());
                        }
                    });

                    for (var i = 0; i < edu.extend.arrKhoa.length; i++) {
                        me.save_SinhVien(edu.extend.arrKhoa[i], strKeHoach_Id);
                    }
                    for (var i = 0; i < edu.extend.arrChuongTrinh.length; i++) {
                        me.save_SinhVien(edu.extend.arrChuongTrinh[i], strKeHoach_Id);
                    }
                    for (var i = 0; i < edu.extend.arrLop.length; i++) {
                        me.save_SinhVien(edu.extend.arrLop[i], strKeHoach_Id);
                    }

                    $("#tblDoiTuong tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        console.log(strNhanSu_Id)
                        if ($(this).attr("name") == "new") {
                            var strTen = $("#lblTen" + strNhanSu_Id).html();
                            var strMa = $("#lblMa" + strNhanSu_Id).html();
                            if ($(this).attr("svid")) strNhanSu_Id = $(this).attr("svid");
                            me.save_DoiTuong(strNhanSu_Id, strKeHoach_Id, strTen, strMa);
                        }
                        if ($(this).attr("name") == "newdoituong") {
                            //var strNhanSu_Id = this.id;
                            me.save_DoiTuong(strNhanSu_Id, strKeHoach_Id, $("#txtTen" + strNhanSu_Id).val(), $("#txtMa" + strNhanSu_Id).val());
                        }
                    });
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoach();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoach/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoach: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_KeHoachKhaoSat',
            'type': 'POST',
            'strId': strId,
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
                    me.getList_KeHoach();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
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

    delete_ResetKeHoach: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var objKeHoach = me.dtKeHoach.find(e => e.ID == strId);
        var obj_delete = {
            'action': 'KS_TaoPhieu/ResetKetQuaTaoPhieu',
            'type': 'POST',
            'strKS_KeHoachKhaoSat_Id': strId,
            'strKS_PhieuKhaoSat_Mau_Id': objKeHoach.KS_PHIEUKHAOSAT_MAU_ID,
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
                    me.getList_KeHoach();
                }
                else {
                    obj = {
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
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
    genTable_KeHoach: function (data, iPager) {
        var me = this;
        function tinhPhanTram(thucHien, tongSo, soLe = 2) {
            if (!tongSo || tongSo === 0) return '0%';
            return ((thucHien / tongSo) * 100).toFixed(soLe) + '%';
        }
        $("#lblKeHoach_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoach",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KeHoach()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0, 2, 3, 4, 5, 6, 7, 8, 9],
            },
            aoColumns: [
                //{
                //    "mDataProp": "MA"
                //},
                {
                    "mDataProp": "TENKEHOACH",
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    //"mDataProp": "CHEDOKHAOSAT_TEN",
                    "mRender": function (nRow, aData) {
                        switch (aData.CHEDOKHAOSAT_TEN) {
                            case 1: return "Đang khảo sát";
                            case 2: return "Khảo sát giả lập";
                            case 0: return "Chờ khảo sát";
                        }
                        return "";
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnPhieu" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "TONGSOPHIEUGUI"
                },
                {
                    "mDataProp": "TONGSOPHIEUDATHUCHIEN"
                },
                {
                    "mRender": function (nRow, aData) {
                        return tinhPhanTram(aData.TONGSOPHIEUDATHUCHIEN, aData.TONGSOPHIEUGUI, 2);
                    }
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnKhoaHoc" id="' + aData.ID + '" title="Chi tiết">Xem</a></span>';
                    }
                },
                {
                    "mDataProp": "KS_PHIEUKHAOSAT_MAU_TEN"
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
        //for (var i = 0; i < data.length; i++) {
        //    me.getList_PhanCong(data[i].ID);
        //}
    },
    viewEdit_KeHoach: function (data) {
        var me = this;
        //View - Thong tin
        edu.util.viewValById("txtTen", data.TENKEHOACH);
        edu.util.viewValById("txtTuNgay", data.NGAYBATDAU);
        edu.util.viewValById("txtDenNgay", data.NGAYKETTHUC);
        edu.util.viewValById("dropCheDo", data.CHEDOKHAOSAT);
        edu.util.viewValById("dropPhieuMau", data.KS_PHIEUKHAOSAT_MAU_ID);
        edu.util.viewValById("txtNamHoc", data.NAMHOC);
        edu.util.viewValById("txtHocKy", data.HOCKY);
        edu.util.viewValById("txtDot", data.DOTHOC);
        edu.util.viewValById("txtMoTa", data.NOIDUNGKEHOACH);
        edu.util.viewHTMLById("txtMoTa", data.NOIDUNGKEHOACH);
        me.strKeHoach_Id = data.ID;

        edu.extend.arrLop = [];
        edu.extend.arrKhoa = [];
        edu.extend.arrChuongTrinh = [];
        $(".ApDungChoLop").html("");
        $(".ApDungChoKhoa").html("");
        $(".ApDungChoChuongTrinh").html("");
        me.getList_SinhVien();
        me.getList_DoiTuong();
        //me.getList_ThanhVien();
        //me.getList_HocPhan();
    },

    getList_SinhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_DoiTuongDuocKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropPhieuMau'),
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
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
    save_SinhVien: function (strNhanSu_Id, strKS_KeHoachKhaoSat_Id, strTen, strKyHieu) {
        var me = this;
        //var aData = edu.extend.dtSinhVien.find(e => e.ID == strNhanSu_Id);
        //if (aData && aData.QLSV_NGUOIHOC_ID) strNhanSu_Id = aData.QLSV_NGUOIHOC_ID;
        //--Edit
        var strId = "";
        if (strNhanSu_Id.length == 30) strId = ""; else strId = strNhanSu_Id;
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_DoiTuongDuocKhaoSat',
            'type': 'POST',
            'strId': strId,
            'strTen': strTen,
            'strKyHieu': strKyHieu,
            'strGhiChu': edu.util.getValById('txtMoTa' + strNhanSu_Id),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropLoai' + strNhanSu_Id),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropPhieuMau'),
            'strKS_KeHoachKhaoSat_Id': strKS_KeHoachKhaoSat_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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
            'action': 'KS_ThongTin/Xoa_KS_DoiTuongDuocKhaoSat',

            'strId': strIds,
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
        $("#tblPhamVi tbody").html("");
        var html = "";
        for (var i = 0; i < data.length; i++) {
            //html += "<tr id='rm_row" + data[i].ID + "'>";
            //html += "<td class='td-center'>" + (i + 1) + "</td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].KYHIEU) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].TEN) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].GHICHU) + "</span></td>";
            //html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].LOAIDOITUONGDUOCKS_TEN) + "</span></td>";
            //html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
            //html += "</tr>";
            //4. fill into tblNhanSu
            //5. create data danhmucvaitro
            me.arrSinhVien_Id.push(data[i].ID);
            me.arrSinhVien.push(data[i]);
        }
        //$("#tblPhamVi tbody").append(html);
        var jsonForm = {
            strTable_Id: "tblPhamVi",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_SinhVien()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "KYHIEU"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mDataProp": "LOAIDOITUONGDUOCKS_TEN"
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

    genHTML_DoiTuongKhac_SinhVien: function (strKetQua_Id, aData) {
        var me = this;
        if (aData == undefined) aData = {};
        var iViTri = document.getElementById("tblPhamVi").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr name="newdoituong" id="rm_row' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtMa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MADAPAN) + '" class="form-control" style="padding-left: 10px; height: 36px" /></td>';
        row += '<td><input type="text" id="txtTen' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TENDAPAN) + '" class="form-control" style="padding-left: 10px; height: 36px" /></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control" style="padding-left: 10px; height: 36px" /></td>';
        row += '<td><select id="dropLoai' + strKetQua_Id +'" class="select-opt"></select></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="btnDeletePoiter" id="' + strKetQua_Id + '" href="javascript:void(0)"><i class="fa fa-trash"></i></a></td>';
        row += '</tr>';
        $("#tblPhamVi tbody").append(row);
        me.cbGenCombo_LoaiDoiTuong(strKetQua_Id)
    },
    removeHTMLoff_SinhVien: function (strNhanSu_Id) {
        var me = this;
        $("#rm_row" + strNhanSu_Id).remove();
        //edu.util.arrExcludeVal(me.arrSinhVien_Id, strNhanSu_Id);
        //if (me.arrSinhVien_Id.length === 0) {
        //    $("#tblPhamVi tbody").html("");
        //    $("#tblPhamVi tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        //}
    },


    getList_DoiTuong: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_DoiTuongThamGiaKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropPhieuMau'),
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
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
                    me.genTable_DoiTuong(dtResult, iPager);
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
    save_DoiTuong: function (strNhanSu_Id, strKS_KeHoachKhaoSat_Id, strTen, strKyHieu) {
        var me = this;
        //var aData = edu.extend.dtSinhVien.find(e => e.ID == strNhanSu_Id);
        //if (aData && aData.QLSV_NGUOIHOC_ID) strNhanSu_Id = aData.QLSV_NGUOIHOC_ID;
        //--Edit
        var strId = "";
        if (strNhanSu_Id.length == 30) strId = ""; else strId = strNhanSu_Id;
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_DoiTuongThamGiaKhaoSat',
            'type': 'POST',
            'strId': strId,
            'strTen': strTen,
            'strMaSo': strKyHieu,
            'strGhiChu': edu.util.getValById('txtMoTa' + strNhanSu_Id),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropLoai' + strNhanSu_Id),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropPhieuMau'),
            'strKS_KeHoachKhaoSat_Id': strKS_KeHoachKhaoSat_Id,
            'strNguoiThucHien_Id': edu.system.userId,
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

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_DoiTuong: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_DoiTuongThamGiaKhaoSat',

            'strId': strIds,
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
                    me.getList_DoiTuong();
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
    genTable_DoiTuong: function (data, iPager) {
        var me = this;
        //3. create html
        //me.arrSinhVien_Id = [];
        $("#tblDoiTuong tbody").html("");
        //var html = "";
        //for (var i = 0; i < data.length; i++) {
        //    html += "<tr id='rm_row" + data[i].ID + "'>";
        //    html += "<td class='td-center'>" + (i + 1) + "</td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].MASO) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].TEN) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].GHICHU) + "</span></td>";
        //    html += "<td class='td-left'><span>" + edu.util.returnEmpty(data[i].LOAIDOITUONGTHAMGIAKS_TEN) + "</span></td>";
        //    html += '<td class="td-center"><input type="checkbox" id="checkX' + data[i].ID + '"/></td>';
        //    html += "</tr>";
        //    //4. fill into tblNhanSu
        //    //5. create data danhmucvaitro
        //    //me.arrSinhVien_Id.push(data[i].ID);
        //    //me.arrSinhVien.push(data[i]);
        //}
        //$("#tblDoiTuong tbody").append(html);
        var jsonForm = {
            strTable_Id: "tblDoiTuong",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_DoiTuong()",
                iDataRow: iPager
            },
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mDataProp": "LOAIDOITUONGTHAMGIAKS_TEN"
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

    genHTML_DoiTuongKhac_DoiTuong: function (strKetQua_Id, aData) {
        var me = this;
        if (aData == undefined) aData = {};
        var iViTri = document.getElementById("tblDoiTuong").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr name="newdoituong" id="rm_row' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtMa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MADAPAN) + '" class="form-control" style="padding-left: 10px; height: 36px" /></td>';
        row += '<td><input type="text" id="txtTen' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.TENDAPAN) + '" class="form-control" style="padding-left: 10px; height: 36px" /></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.THUTU) + '" class="form-control" style="padding-left: 10px; height: 36px" /></td>';
        row += '<td><select id="dropLoai' + strKetQua_Id + '" class="select-opt"></select></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="btnDeletePoiter" id="' + strKetQua_Id + '" href="javascript:void(0)"><i class="fa fa-trash"></i></a></td>';
        row += '</tr>';
        $("#tblDoiTuong tbody").append(row);
        me.cbGenCombo_LoaiDoiTuong(strKetQua_Id)
    },
    removeHTMLoff_DoiTuong: function (strNhanSu_Id) {
        var me = this;
        $("#rm_row" + strNhanSu_Id).remove();
    },

    cbGenCombo_LoaiDoiTuong: function (strId) {
        var me = this;
        var obj = {
            data: me.dtLoaiDoiTuong,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropLoai" + strId],
            type: "",
            title: "Chọn loại",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    getList_Phieu: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSPhieu_Mau_NguoiDung',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_Phieu(json);
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
    cbGenCombo_Phieu: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENPHIEU",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropPhieuMau"],
            type: "",
            title: "Chọn phiếu",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_ThoiGian: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSThoiGianDangKyHoc',
            'type': 'GET',
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var json = data.Data;
                    me.cbGenCombo_ThoiGian(json);
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
            renderPlace: ["dropSearch_ThoiGianTabHome", "dropSearch_ThoiGianTabPro", "dropSearch_ThoiGianTabPan"],
            type: "",
            title: "Chọn thời gian",
        }
        edu.system.loadToCombo_data(obj);
    },

    getList_PhieuKhaoSat: function (objKeHoach) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_PhieuKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtPhieuKhaoSat"] = dtReRult;
                    me.genTable_PhieuKhaoSat(dtReRult, data.Pager);
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
    genTable_PhieuKhaoSat: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDSPhieu",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0 ,2, 3, 4, 5, 6, 7],
            },
            aoColumns: [
                {
                    "mDataProp": "TENPHIEU"
                },
                {
                    "mData": "SOLUONG",
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXemTongThePhieu" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
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
                        return '<span><a class="btn btn-default btnKetQua" id="' + aData.ID + '" title="Chi tiết">Chi tiết</a></span>';
                    }
                },
                {
                    "mDataProp": "TYLE"
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
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },
    delete_DSPhieu: function (strId) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_PhieuKhaoSat',
            'type': 'POST',
            'strId': strId,
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
                        content: "/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "/Xoa (er): " + JSON.stringify(er),
                    code: "w"
                };
                edu.system.afterComfirm(obj);

            },
            type: 'POST',
            action: obj_delete.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhieuKhaoSat();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    getList_ThamGia: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_PhieuKhaoSatThamGiaKS',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_PhieuKhaoSat_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtThamGia"] = dtReRult;
                    me.genTable_ThamGia(dtReRult, data.Pager);
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
    genTable_ThamGia: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblThamGia",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "KS_DOITUONGTHAMGIAKHAOSAT_MASO"
                },
                {
                    //"mDataProp": "KS_DOITUONGTHAMGIAKHAOSAT_TEN"
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnXemPhieu" id="' + aData.KS_DOITUONGTHAMGIAKHAOSAT_ID + '" title="Sửa">' + aData.KS_DOITUONGTHAMGIAKHAOSAT_TEN + '</a></span>';
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
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },
    
    getList_ChuaThamGia: function (strQLSV_KeHoach_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDS_DoiTuongThamGiaChuaDung',
            'type': 'GET',
            'strKS_PhieuKhaoSat_Id': me.strPhieu_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtChuaThamGia"] = dtReRult;
                    me.genTable_ChuaThamGia(dtReRult, data.Pager);
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
    genTable_ChuaThamGia: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblChuaThamGia",

            //bPaginate: {
            //    strFuntionName: "main_doc.KeHoach.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
            //    iDataRow: iPager,
            //},
            aaData: data,
            colPos: {
                center: [0, 4],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "TEN"
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
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },
    
    getList_DoiTuongDuocKhaoSat: function (strQLSV_KeHoach_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_DoiTuongDuocKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtDoiTuongDuocKhaoSat"] = dtReRult;
                    me.cbGenCombo_DoiTuongDuocKhaoSat(dtReRult, data.Pager);
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

    getDetail_DoiTuongDuocKhaoSat: function (strQLSV_KeHoach_KeHoach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_PhieuKhaoSat_DuocKS',
            'type': 'GET',
            'strKS_PhieuKhaoSat_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult) edu.util.viewValById("dropDoiTuongDuocKhaoSat", dtReRult[0].KS_DOITUONGDUOCKHAOSAT_ID);
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
    cbGenCombo_DoiTuongDuocKhaoSat: function (data) {
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
            renderPlace: ["dropDoiTuongDuocKhaoSat"],
            type: "",
            title: "Chọn đối tượng",
        }
        edu.system.loadToCombo_data(obj);
    },
    
    save_DoiTuongDuocKhaoSat: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_PhieuKhaoSat_DuocKS',
            'type': 'POST',
            'strKS_PhieuKhaoSat_Id': me.strPhieu_Id,
            'strKS_DoiTuongDuocKS_Id': edu.util.getValById('dropDoiTuongDuocKhaoSat'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoach_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoach_Id = obj_save.strId
                    }
                    
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoach();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_KhoiTaoPhieu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_TaoPhieu/KhoiTaoPhieuTheoPhieuMau',
            'type': 'POST',
            'strId': me.strPhieu_Id,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strMaPhieu': edu.util.getValById('txtMaPhieu'),
            'strTenPhieu': edu.util.getValById('txtTenPhieu'),
            'strMoTa': edu.util.getValById('txtMoTaPhieu'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoach_Id = data.Id;
                        $("#zonePhieu .zoneAdd").hide();
                        $("#zonePhieu .zoneEdit").show();
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoach_Id = obj_save.strId
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoach();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ChuaThamGia: function (strKS_DoiTuongThamGiaKS_Id, strKS_PhieuKhaoSat_Id) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_ThongTin/Them_KS_PhieuKhaoSat_ThamGiaKS',
            'type': 'POST',
            'strKS_PhieuKhaoSat_Id': me.strPhieu_Id,
            'strKS_DoiTuongThamGiaKS_Id': strKS_DoiTuongThamGiaKS_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    if (!obj_save.strId) {
                        edu.system.alert("Thêm mới thành công!");
                        strKeHoach_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                        strKeHoach_Id = obj_save.strId
                    }

                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoach();
            },
            error: function (er) {
                edu.system.alert(" (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ChuaThamGia();
                    me.getList_ThamGia();
                });
            },
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_ThamGia: function (strIds) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'KS_ThongTin/Xoa_KS_PhieuKhaoSat_ThamGiaKS',

            'strId': strIds,
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
                    me.getList_ChuaThamGia();
                    me.getList_ThamGia();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    
    /*
     * Loader trung thực: chỉ hiện spinner + thời gian đã chờ + caption đổi theo mốc.
     * Không có bar % vì BE không stream tiến độ (opaque call).
     * Dùng: var p = me.showElapsedLoader("Đang gen phiếu..."); ...; p.finish() / p.fail(msg)
     */
    showElapsedLoader: function (strTitle) {
        $('#aps-elapsed-loader-wrap').remove();
        var $wrap = $(
            '<div id="aps-elapsed-loader-wrap" ' +
            'style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998;' +
            'display:flex;align-items:center;justify-content:center;">' +
                '<div style="width:min(460px,90vw);background:#fff;border-radius:10px;' +
                'box-shadow:0 12px 40px rgba(0,0,0,0.25);overflow:hidden;font-size:14px">' +
                    '<div class="aps-el-header" style="background:#0969da;color:#fff;padding:14px 20px;' +
                    'font-size:16px;font-weight:600;display:flex;align-items:center;gap:10px">' +
                        '<i class="fal fa-spinner fa-spin"></i>' +
                        '<span class="aps-el-title">' + (strTitle || 'Đang xử lý...') + '</span>' +
                    '</div>' +
                    '<div style="padding:28px 20px;text-align:center">' +
                        '<div class="aps-el-elapsed" style="font-size:32px;color:#0969da;font-weight:700;font-variant-numeric:tabular-nums">0s</div>' +
                        '<div class="aps-el-note mt-2" style="font-size:13px;color:#57606a;font-style:italic">Server đang xử lý, vui lòng chờ...</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo('body');
        var iStart = Date.now();
        var bDone = false;
        var arrMsg = [
            { t: 0,   msg: 'Server đang xử lý, vui lòng chờ...' },
            { t: 15,  msg: 'Đang tính toán dữ liệu, tiếp tục chờ...' },
            { t: 30,  msg: 'Dữ liệu lớn, server vẫn đang chạy...' },
            { t: 60,  msg: 'Vẫn đang xử lý, xin đợi thêm chút nữa...' },
            { t: 120, msg: 'Rất tiếc phải chờ lâu, server đang gồng...' }
        ];
        var hTimer = setInterval(function () {
            if (bDone) return;
            var iElapsed = Math.floor((Date.now() - iStart) / 1000);
            $wrap.find('.aps-el-elapsed').text(iElapsed + 's');
            var strMsg = arrMsg[0].msg;
            for (var i = arrMsg.length - 1; i >= 0; i--) {
                if (iElapsed >= arrMsg[i].t) { strMsg = arrMsg[i].msg; break; }
            }
            $wrap.find('.aps-el-note').text(strMsg);
        }, 500);
        return {
            finish: function () {
                bDone = true;
                clearInterval(hTimer);
                var iElapsed = Math.floor((Date.now() - iStart) / 1000);
                $wrap.find('.aps-el-note').text('Xong sau ' + iElapsed + 's');
                $wrap.find('.aps-el-header').html(
                    '<i class="fal fa-check-circle"></i><span>Hoàn tất!</span>'
                ).css('background', '#1a7f37');
                setTimeout(function () {
                    $wrap.fadeOut(400, function () { $(this).remove(); });
                }, 1000);
            },
            fail: function (msg) {
                bDone = true;
                clearInterval(hTimer);
                $wrap.find('.aps-el-header').html(
                    '<i class="fal fa-times-circle"></i><span>Lỗi: ' + (msg || 'Đã có lỗi xảy ra') + '</span>'
                ).css('background', '#cf222e');
                setTimeout(function () {
                    $wrap.fadeOut(400, function () { $(this).remove(); });
                }, 2500);
            }
        };
    },

    save_GenPhieu: function () {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'KS_TaoPhieu/GenPhieuBanTuDong',
            'type': 'POST',
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Id': me.strPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        var p = me.showElapsedLoader("Đang gen phiếu khảo sát...");
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    p.finish();
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    p.fail(data.Message);
                    edu.system.alert(data.Message);
                }
                me.getList_KeHoach();
            },
            error: function (er) {
                p.fail("Lỗi kết nối");
                edu.system.alert(" (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_TabHome: function (strGiangVien_Id, cbComplete) {
        var me = this;
        console.log("[GV-ID][save_TabHome] gọi SP với GiangVien_Id =", strGiangVien_Id);
        var obj_save = {
            'action': 'KS_TaoPhieu/GenPhieuTuDongTrucTiepGV1',
            'type': 'POST',
            'strGiangVien_Id': strGiangVien_Id,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabHome'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                if (!data.Success && data.Message) console.warn("[save_TabHome]", data.Message, obj_save);
            },
            error: function (er) { console.warn("[save_TabHome] error:", er); },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhieuKhaoSat();
                });
                if (typeof cbComplete === 'function') cbComplete();
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_TabHome: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSGiangVienTheoThoiGian',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabHome'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    me["dtTabHome"] = dtReRult;
                    me.genTable_TabHome(dtReRult, data.Pager);
                    if (dtReRult.length === 0) {
                        $("#tblTabHome tbody").html(
                            '<tr><td colspan="20" class="text-center py-4 text-muted">Không có dữ liệu</td></tr>'
                        );
                    }
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
    genTable_TabHome: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTabHome",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_QuanSoTheoLop('" + strTN_KeHoach_Id +"')",
                iDataRow: 10,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HODEM"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "DONVI_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },

    save_TabPro: function (strDaoTao_HocPhan_Id, cbComplete) {
        var me = this;
        var obj_save = {
            'action': 'KS_TaoPhieu/GenPhieuTuDongTrucTiepGV2',
            'type': 'POST',
            'strDaoTao_HocPhan_Id': strDaoTao_HocPhan_Id,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabPro'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                if (!data.Success && data.Message) console.warn("[save_TabPro]", data.Message, obj_save);
            },
            error: function (er) { console.warn("[save_TabPro] error:", er); },
            type: 'POST',
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_PhieuKhaoSat();
                });
                if (typeof cbComplete === 'function') cbComplete();
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_TabPro: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSHocPhanTheoThoiGian',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabPro'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    me["dtTabPro"] = dtReRult;
                    me.genTable_TabPro(dtReRult, data.Pager);
                    if (dtReRult.length === 0) {
                        $("#tblTabPro tbody").html(
                            '<tr><td colspan="20" class="text-center py-4 text-muted">Không có dữ liệu</td></tr>'
                        );
                    }
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
    genTable_TabPro: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTabPro",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_QuanSoTheoLop('" + strTN_KeHoach_Id + "')",
                iDataRow: 10,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 5],
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "HOCTRINH"
                },
                {
                    "mDataProp": "DONVI_TEN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },

    getList_KhoaQuanLy_TabPan: function () {
        var me = this;
        var obj = {
            strCCTC_Loai_Id: "",
            strCCTC_Cha_Id: "",
            iTrangThai: 1
        };
        edu.system.getList_CoCauToChuc(obj, "", "", function (data) {
            edu.system.loadToCombo_data({
                data: data,
                renderInfor: { id: "ID", parentId: "", name: "TEN", code: "MA" },
                renderPlace: ["dropKhoaQuanLy_TabPan"],
                type: "",
                title: "Chọn 1 hoặc nhiều khoa quản lý"
            });
        });
    },
    /*
     * STANDARD: Helper hiển thị tiến trình chuẩn cho mọi tác vụ chạy batch (N call song song).
     * Modal alert chứa: tiêu đề + progress bar + đếm "X/Y (Z%)". Auto-close khi xong.
     * Dùng: me.runBatchProgress(arrItems, "Tiêu đề", function(item, done) {
     *           callApiFor(item, done);   // gọi done() trong complete callback
     *       });
     */
    runBatchProgress: function (arrItems, strTitle, fnRun) {
        var iTotal = (arrItems || []).length;
        if (!iTotal) return;
        //--Dọn modal alert hệ thống và popup cũ nếu có
        $('#aps-batch-popup-wrap').remove();
        $('#myModalAlert').modal('hide').remove();
        edu.system.flag_alert = false;
        edu.system.arrcheckcontent = [];
        edu.system.arrStt = [];
        var strZone_Id = "aps_batch_inner_" + Date.now();
        var $wrap = $(
            '<div id="aps-batch-popup-wrap" ' +
            'style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99998;' +
            'display:flex;align-items:center;justify-content:center;">' +
                '<div id="aps-batch-popup" ' +
                'style="width:min(560px,90vw);background:#fff;border-radius:10px;' +
                'box-shadow:0 12px 40px rgba(0,0,0,0.25);overflow:hidden;font-size:14px">' +
                    '<div class="aps-batch-header" style="background:#0969da;color:#fff;padding:14px 20px;' +
                    'font-size:16px;font-weight:600;display:flex;align-items:center;gap:10px">' +
                        '<i class="fal fa-spinner fa-spin"></i>' +
                        '<span class="aps-batch-title">' + (strTitle || 'Đang xử lý...') + '</span>' +
                    '</div>' +
                    '<div style="padding:24px 20px">' +
                        '<div class="text-muted mb-3" style="font-size:13px">' +
                            'Tổng số bản ghi cần xử lý: <strong style="color:#0969da;font-size:16px">' + iTotal + '</strong>' +
                        '</div>' +
                        '<div id="' + strZone_Id + '"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        ).appendTo('body');
        edu.system.genHTML_Progress(strZone_Id, iTotal);
        //--Ẩn liên tục #overlay và #myModalAlert trong khi batch đang chạy để chống bị bật lại
        var hKeepHidden = setInterval(function () {
            $('#overlay').hide();
            $('#myModalAlert').not('#aps-batch-popup-wrap *').remove();
        }, 100);
        var iDone = 0;
        arrItems.forEach(function (item) {
            fnRun(item, function () {
                iDone++;
                edu.system.start_Progress(strZone_Id);
                if (iDone === iTotal) {
                    clearInterval(hKeepHidden);
                    $wrap.find('.aps-batch-header').html(
                        '<i class="fal fa-check-circle"></i>' +
                        '<span>Hoàn tất! Đã xử lý ' + iTotal + ' bản ghi.</span>'
                    ).css('background', '#1a7f37');
                    setTimeout(function () {
                        $wrap.fadeOut(400, function () { $(this).remove(); });
                    }, 1800);
                }
            });
        });
        $('#overlay').hide();
    },
    /*
     * BE LayDSLopHocPhanTheoThoiGian không trả GIANGVIEN_ID, chỉ có GIANGVIEN_TEN concat.
     * Workaround: load list GV qua KS_ThongTin/LayDSGiangVienTheoThoiGian (giống Tab Home),
     * dựng map fullName → ID, rồi tra ngược tên trong row Tab Pan.
     * Nếu sau này BE bổ sung GIANGVIEN_ID vào row → ưu tiên dùng trực tiếp, bỏ qua lookup.
     */
    loadGVMap_TabPan: function (cb) {
        var me = this;
        var obj_list = {
            'action': 'KS_ThongTin/LayDSGiangVienTheoThoiGian',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabPan'),
        };
        edu.system.makeRequest({
            success: function (data) {
                me.dtGV_TabPan = (data && data.Success && data.Data) ? data.Data : [];
                me.gvMap_TabPan = {};
                (me.dtGV_TabPan || []).forEach(function (gv) {
                    var fullName = ((gv.HODEM || '') + ' ' + (gv.TEN || '')).replace(/\s+/g, ' ').trim();
                    if (fullName && gv.ID) me.gvMap_TabPan[fullName] = gv.ID;
                });
                if (typeof cb === 'function') cb();
            },
            error: function (er) { edu.system.alert(JSON.stringify(er), "w"); },
            type: 'GET',
            action: obj_list.action,
            contentType: true,
            data: obj_list,
            fakedb: []
        }, false, false, false, null);
    },
    //--[DEAD CODE] Chỉ dùng nếu quay lại SP V1 (1 GV/call). V3 hiện không cần.
    buildPairs_TabPan: function (arrChecked_Id) {
        var me = this;
        var pairs = [];
        var gvMap = me.gvMap_TabPan || {};
        (arrChecked_Id || []).forEach(function (strLopHP_Id) {
            var aRow = (me.dtTabPan || []).find(e => e.ID == strLopHP_Id) || {};
            var raw = aRow.GIANGVIEN_ID || aRow.DSGIANGVIEN_ID || '';
            if (raw) {
                String(raw).split(',').forEach(function (gvId) {
                    var id = (gvId || '').trim();
                    if (id) pairs.push({ lop: strLopHP_Id, gv: id });
                });
                return;
            }
            var names = String(aRow.GIANGVIEN_TEN || '').split(',');
            names.forEach(function (name) {
                var key = (name || '').replace(/\s+/g, ' ').trim();
                if (!key) return;
                var id = gvMap[key];
                if (id) pairs.push({ lop: strLopHP_Id, gv: id });
            });
        });
        return pairs;
    },
    save_TabPan: function (strDaoTao_LopHocPhan_Id, strDaoTao_KhoaQuanLy_Id, iChayTienTrinh, cbComplete) {
        var me = this;
        //--SP GenPhieuTuDongTrucTiepGV3: BE tự xác định GV từ LopHocPhan_Id, JS không cần tách.
        var obj_save = {
            'action': 'TS_KS_TaoPhieu_MH/BiQvESkoJDQVNAUuLyYVMzQiFSgkMQYXcgPP',
            'func': 'khaosat_taophieu.GenPhieuTuDongTrucTiepGV3',
            'type': 'POST',
            'iM': edu.system.iM,
            'iChayTienTrinh': iChayTienTrinh || 0,
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strDaoTao_LopHocPhan_Id': strDaoTao_LopHocPhan_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabPan'),
            'strDaoTao_KhoaQuanLy_Id': strDaoTao_KhoaQuanLy_Id || '',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công!");
                }
                else {
                    edu.system.alert(data.Message);
                }
                if (!data.Success && data.Message) {
                    console.warn("[save_TabPan]", data.Message, obj_save);
                }
                me.getList_PhieuKhaoSat();
            },
            error: function (er) {
                console.warn("[save_TabPan] error:", er);
            },
            type: 'POST',
            complete: function () {
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //});
                //edu.system.start_Progress("zoneprocessXXXXPTD", function () {
                //});
                if (typeof cbComplete === 'function') cbComplete();
            },
            contentType: true,
            action: obj_save.action,
            data: obj_save,
            fakedb: []
        }, false, false, false, null);
    },
    getList_TabPan: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSLopHocPhanTheoThoiGian',
            'type': 'GET',
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strKS_PhieuKhaoSat_Mau_Id': me.strMauPhieu_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropSearch_ThoiGianTabPan'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data || [];
                    me["dtTabPan"] = dtReRult;
                    me.genTable_TabPan(dtReRult, data.Pager);
                    if (dtReRult.length === 0) {
                        $("#tblTabPan tbody").html(
                            '<tr><td colspan="20" class="text-center py-4 text-muted">Không có dữ liệu</td></tr>'
                        );
                    }
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
    genTable_TabPan: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblTabPan",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_QuanSoTheoLop('" + strTN_KeHoach_Id + "')",
                iDataRow: 1,
                bFilter: true
            },
            aaData: data,
            colPos: {
                center: [0, 5],
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var s = (aData.GIANGVIEN_TEN || '').trim();
                        if (!s) return '<span style="color:#cf222e;font-style:italic">Chưa có giảng viên</span>';
                        return s;
                    }
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_MA"
                },
                {
                    "mDataProp": "DAOTAO_HOCPHAN_TEN"
                },
                {
                    "mDataProp": "TENLOP"
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
        //data.forEach(aData => {
        //    me.getList_NH_TuyenXe(aData.QLSV_NGUOIHOC_ID, aData.QLSV_KEHOACH_DICHVU_VE_ID, )
        //})
        /*III. Callback*/
    },
    
    getList_KetQua_ThamGia: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_DoiTuongThamGiaKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropAAAA'),
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me["dtThamGia"] = dtReRult;
                    me.genTable_KetQua_ThamGia(dtReRult, data.Pager);
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
    genTable_KetQua_ThamGia: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDoiTuongThamGia",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KetQua_ThamGia()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.HO) + " " + edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "DIACHI"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_KetQua_DuocKhaoSat: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_DoiTuongDuocKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropAAAA'),
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me["dtThamGia"] = dtReRult;
                    me.genTable_KetQua_DuocKhaoSat(dtReRult, data.Pager);
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
    genTable_KetQua_DuocKhaoSat: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDoiTuongDuocKhaoSat",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KetQua_DuocKhaoSat()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "KYHIEU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.TEN);
                    }
                },
                {
                    "mDataProp": "GHICHU"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_KetQua_ChuaThucHien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_DoiTuongThamGiaChuaKS',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropAAAA'),
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    //me["dtThamGia"] = dtReRult;
                    me.genTable_KetQua_ChuaThucHien(dtReRult, data.Pager);
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
    genTable_KetQua_ChuaThucHien: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblDoiTuongChuaThucHien",

            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KetQua_ChuaThucHien()",
                iDataRow: iPager,
            },
            aaData: data,
            colPos: {
                center: [0],
            },
            aoColumns: [
                {
                    "mDataProp": "KS_DOITUONGTHAMGIAKHAOSAT_MA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.KS_DOITUONGTHAMGIAKHAOSAT_HO) + " " + edu.util.returnEmpty(aData.KS_DOITUONGTHAMGIAKHAOSAT_TEN);
                    }
                },
                {
                    "mDataProp": "KS_PHIEUKHAOSAT_TEN"
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
    },

    getList_KetQua_ChiTiet: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'KS_ThongTin/LayDSKS_KetQuaKhaoSat',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strKS_LoaiDoiTuong_Id': edu.util.getValById('dropAAAA'),
            'strKS_PhieuKhaoSat_Mau_Id': edu.util.getValById('dropAAAA'),
            'strKS_KeHoachKhaoSat_Id': me.strKeHoach_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me["dtKetQua_ChiTiet"] = dtReRult;
                    me.genTable_KetQua_ChiTiet(dtReRult, data.Pager);
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
    genTable_KetQua_ChiTiet: function (data, iPager, strTN_KeHoach_Id) {
        var me = this;
        var strTable_Id = "tblKetQuaChiTiet";
        $("#tblKetQuaChiTiet thead").html(me.strHead);
        var arrDoiTuong = data.rsCauHoi;
        me.dtDoiTuong_View = arrDoiTuong;
        for (var j = 0; j < arrDoiTuong.length; j++) {
            $("#" + strTable_Id + " thead tr:eq(0)").append('<th rowspan="2" class="td-center  border-left">' + edu.util.returnEmpty(arrDoiTuong[j].KS_CAUHOI_TEN) + '</th>');
        }
        var jsonForm = {
            strTable_Id: strTable_Id,
            aaData: data.rs,
            bPaginate: {
                strFuntionName: "main_doc.KeHoach.getList_KetQua_ChiTiet()",
                iDataRow: iPager,
            },
            colPos: {
                center: [0],
            },
            "aoColumns": [
                {
                    "mDataProp": "KS_DOITUONGTHAMGIAKHAOSAT_MA"
                },
                {
                    "mRender": function (nRow, aData) {
                        return edu.util.returnEmpty(aData.KS_DOITUONGTHAMGIAKHAOSAT_HO) + " " + edu.util.returnEmpty(aData.KS_DOITUONGTHAMGIAKHAOSAT_TEN);
                    }
                },
                {
                    "mDataProp": "GHICHU"
                },
                {
                    "mDataProp": "KS_PHIEUKHAOSAT_TEN"
                },
                {
                    "mDataProp": "KETQUA"
                },
                {
                    "mDataProp": "KS_DOITUONGDUOCKHAOSAT_MA"
                },
                {
                    "mDataProp": "KS_DOITUONGDUOCKHAOSAT_TEN"
                }
            ]
        };
        for (var j = 0; j < arrDoiTuong.length; j++) {
            jsonForm.aoColumns.push(
                {
                    "mRender": function (nRow, aData) {
                        var iThuTu = edu.system.icolumn++;
                        return '<div id="divcheck_' + aData.ID + '_' + main_doc.KeHoach.dtDoiTuong_View[iThuTu].KS_CAUHOI_ID + '"></div>';
                        //return '<input type="checkbox" id="lblDiem_' + aData.ID + '_' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID + '" class="check' + main_doc.DuyetBuoiHoc.dtDoiTuong_View[iThuTu].ID +'" />';
                    }
                }
            );
        }
        edu.system.loadToTable_data(jsonForm);
        //if (data.rsNhanSu.length > 0) {
        //    edu.system.genHTML_Progress("divprogessdata", data.rsNhanSu.length * data.rsLoaiSanPham.length);
        //}
        for (var i = 0; i < data.rs.length; i++) {
            for (var j = 0; j < arrDoiTuong.length; j++) {
                me.getList_KetQua_ChiTietCauHoi(data.rs[i], arrDoiTuong[j].KS_CAUHOI_ID);
            }
        }
    },
    getList_KetQua_ChiTietCauHoi: function (objHang, strCot_Id) {
        var me = this;
        $("#divcheck_" + objHang.ID + "_" + strCot_Id).parent().addClass('border-left').addClass('td-center');
        //--Edit
        var obj_list = {
            'action': 'KS_TaoPhieu/LayDSKetQuaTraLoiTheo',
            'type': 'GET',
            'strKS_DoiTuongThamGiaKS_Id': objHang.KS_DOITUONGTHAMGIAKHAOSAT_ID,
            'strKS_DoiTuongDuocKhaoSat_Id': objHang.KS_DOITUONGDUOCKHAOSAT_ID,
            'strKS_PhieuKhaoSat_Id': objHang.KS_PHIEUKHAOSAT_ID,
            'strKS_KeHoachKhaoSat_Id': objHang.KS_KEHOACHKHAOSAT_ID,
            'strKS_CauHoi_Id': strCot_Id,
            'strLoaiDapAn': edu.util.getValById('txtAAAA'),
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    dtResult = data.Data;
                    iPager = data.Pager;
                    if (dtResult.length) {
                        dtResult = dtResult[0];
                        $("#divcheck_" + objHang.ID + "_" + strCot_Id).html(dtResult.KETQUA)
                    }
                }
                else {
                    edu.system.alert(obj_list.action + " : " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessDuyetBuoiHoc", function () {
                    me.dtGiangVien.forEach(e => {
                        var iTongSo = 0;
                        var x = $(".check" + e.ID).each(function () {
                            if ($(this).is(':checked')) {
                                iTongSo += parseInt($(this).attr("name"))
                            }
                        })
                        $("#sum" + e.ID).html("Tổng số tiết: " + iTongSo);
                    });
                });
            },
            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    save_CustomAPI: function () {
        var me = this;
        var Nonce = edu.util.uuid();
        var strtokenJWT = window.btoa('fastapi:fast123!@#: ' + Nonce).trim();
        //--Edit
        var obj_save = {
            'action': 'CM_UngDung/CustomAPI',
            'type': 'POST',
            'strHost': 'https://dev.fast.com.vn',
            'strApi': '/DHMTAC_API/api/SyncData',
            'strLoaiXacThuc': "Basic",
            'strMaXacThuc': strtokenJWT,
            'strData': JSON.stringify({
                "form": "setBankCreditAdvices",
                "data": [
                    {
                        "YourId": "54323",
                        "Type": "2",
                        "VcDate": "2024-02-28",
                        "Buyer": "Phoebe",
                        "Address": "",
                        "Memo": "Test api Credit",
                        "Note": "",

                        "DebitAccount": "11211",
                        "CreditAccount": "131112",
                        "VcNo": "BN9799",
                        "CustomerCode": "01000001",
                        "SaleCode": "",
                        "Currency": "VND",
                        "Department": "",
                        "ContractCode": "",
                        "Expend": "",
                        "ExRate": 1,
                        "Amount": 20000000,
                        "LineNumber": 0,
                        "Status": "2",
                        "CusInvoiceCode": "",
                        "PosAmount": 0
                    }
                ]
            }),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoach_Id = "";
                    var objJson = {};
                    var x = getDeQuy(data.Data, null, objJson);
                    console.log(x);
                }
                else {
                    edu.system.alert(data.Message);
                }

                me.getList_KeHoach();
            },
            error: function (er) {
                edu.system.alert("XLHV_KeHoach/ThemMoi (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);

    },

    getList_DuLieu_ChiTiet: function () {
        var me = this;
        var dtDuLieu = [];
        //--Edit
        var obj_list = {
            'action': 'TC_KeToan/LayDSAPI_DoiTac_ChiTiet',
            'type': 'GET',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTenBangDuLieu': '',
            'strAPI_DoiTac_Id': 'B2042224DB1D4AA6BC11B65EED062359',
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    dtDuLieu = dtReRult;
                    var x = getDeQuy(null, {});
                    console.log(x);
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

        function getDeQuy(strCha_Id, objJson) {
            var dtXet = dtDuLieu.filter(e => e.CHA_ID == strCha_Id);
            dtXet.forEach(e => {
                setValueJson(objJson, e);
            })
            return objJson;
        }
        function getValue(objCauTruc, objData) {
            var strKetQua = (objCauTruc.VALUE_API) ? objData.VALUE_API : objCauTruc.DATADEFAULT_API;
            switch (objCauTruc.DATATYPE_API) {
                case "number": return parseFloat(strKetQua)
                case "object": return getDeQuy(objCauTruc.ID, {})
                case "array": return [getDeQuy(objCauTruc.ID, {})]
                default : return strKetQua;
            }
            
        }
        function setValueJson(objJson, objData) {
            objJson[objData.KEY_API] = getValue(objData, null);
        }
    },


    getList_KhoaHoc: function (strKS_KeHoachKhaoSat_Id) {
        var me = this;
        var obj_save = {
            'action': 'TS_KS_BaoCao_MH/DSA4BRIKEh4KKS4gCikgLhIgNQPP',
            'func': 'KHAOSAT_BAOCAO.LayDSKS_KhoaKhaoSat',
            'iM': edu.system.iM,
            'strTuKhoa': edu.system.getValById('txtAAAA'),
            'strKS_KeHoachKhaoSat_Id': strKS_KeHoachKhaoSat_Id,
            'strKS_PhieuKhaoSat_Id': edu.system.getValById('dropAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtKhoaHoc"] = data.Data;
                    me.genTable_KhoaHoc(data.Data);
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
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_KhoaHoc: function (data, iPager) {
        $("#lblDMDonGia_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKhoaHocPopup",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.DonGia.getList_DMDonGia()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
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
        /*III. Callback*/
    },
}