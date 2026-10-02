/*----------------------------------------------
--Author: duyentt
--Phone: 
--Date of created: 20/05/2020
--Input: 
--Output:
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function KeHoachTuyenSinh() { };
KeHoachTuyenSinh.prototype = {
    treenode: '',
    strKeHoachTuyenSinh_Id: '',
    dtTab: '',
    dtKeHoachTuyenSinh: [],
    dtHeDaoTao: [],
    dtKhoaDaoTao: [],
    dtLoaiHoSo: [],
    dtTinhChatHoSo: [],
    arrValiD_Input_KeHoachTuyenSinh: [],
    arrValiD_KeHoachTuyenSinh: [],
    strHoSo_KeHoach_Id: '',
    dtDotPhuongThuc: [],
    strDotPhuongThuc_Id: '',
    dtThoiGian: [],
    dtKhoanThu: [],
    strNganhNghe_Id: [],
    dtNganhNghe: [],
    dtMonThi: [],
    strLopDuKien_Id: '',
    dtLopDuKien: [],

    init: function () {

        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        me.getList_KeHoachTuyenSinh();
        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();
        me.getList_Nam();
        me.getList_ThoiGianDaoTao();
        me.getList_KhoanThu();
        /*------------------------------------------
        --Discription: Action
        -------------------------------------------*/
        $("#btnAddKeHoach").click(function () {
            me.rewrite();
            me.toggle_form_input();
        });

        
        //$("#btnThemHoSo").click(function () {
        //    me.rewrite();
        //    me.toggle_form_input_LoaiHoSo();
        //});
        $(".btnClose").click(function () {
            me.toggle_notify();
        });
        $(".btnClose_HoSo").click(function () {
            me.toggle_form_update();
            me.getList_DotPhuongThuc();
        });
        $("#btnSave").click(function () {
            me.save_KeHoachTuyenSinh()
        });
        $("#btnSave_HoSo").click(function () {
            me.save_HoSo()
        });
        $("#btnUpDate").click(function () {
            //if (edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
            //    me.update_KeHoachTuyenSinh();
            //}
            //else {
            //    me.save_KeHoachTuyenSinh();
            //}
            me.update_KeHoachTuyenSinh();
            //me.rewrite();
        });
        $("#zone_update_KeHoachTuyenSinh").delegate('.btnDelete', 'click', function () {
            if (edu.util.checkValue(me.strKeHoachTuyenSinh_Id)) {
                edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachTuyenSinh();
                });
                return false;
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
            //edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            //$("#btnYes").click(function (e) {
            //    me.delete_KeHoachTuyenSinh(strIds);
            //});
        });
        $("#txtSearch_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_KeHoachTuyenSinh();
            }
        });

        $("#dropHeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
        });


        //$("#tblKeHoachTuyenSinh").delegate(".btnEdit", "click", function (e) {
        //    var strId = this.id;
        //    strId = edu.util.cutPrefixId(/edit_/g, strId);
        //    if (edu.util.checkValue(strId)) {
        //        me.toggle_form_update();
        //        me.strKeHoachTuyenSinh_Id = strId;
        //        //me.getDetail_KeHoachTuyenSinh(strId);
        //        me.getList_KeHoachTuyenSinh_HeKhoa();
        //        me.getList_KeHoachTuyenSinh_ThanhVien();
        //        me.getDetail_KeHoachTuyenSinh(strId, constant.setting.ACTION.EDIT);
        //        edu.util.setOne_BgRow(strId, "tblKeHoachTuyenSinh");
        //    }
        //    else {
        //        edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
        //    }
        //});
        $("#tblKeHoachTuyenSinh").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_form_update();
                me.strKeHoachTuyenSinh_Id = strId;
                me.getDetail_KeHoachTuyenSinh(strId);
                me.getList_KeHoachTuyenSinh_HeKhoa();
                me.getList_KeHoachTuyenSinh_ThanhVien();
                me.getList_ToHopMon();
                me.getList_HoSo();
                me.getList_HeDaoTao();
                me.getList_KhoaDaoTao();
                me.getList_DotPhuongThuc();
                me.getList_ComBoLopDuKien();
                //me.getList_NganhNghe();
                edu.util.setOne_BgRow(strId, "tblKeHoachTuyenSinh");
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $(".btnSearch").click(function () {
            me.getList_KeHoachTuyenSinh();
        });
      
        $("#tblKeHoachTuyenSinh").delegate(".btnDelete", "click", function (e) {
            e.stopImmediatePropagation()
            var strIds = this.id;
            strIds = edu.util.cutPrefixId(/delete_/g, strIds);
            if (edu.util.checkValue(strIds)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachTuyenSinh(strIds);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#tblKeHoachTuyenSinh").delegate(".btnDelete", "click", function (event) {
            event.stopImmediatePropagation()
            var strIds = this.id;
            strId = edu.util.cutPrefixId(/delete_/g, strIds);
            if (edu.util.checkValue(strIds)) {
                edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
                $("#btnYes").click(function (e) {
                    me.delete_KeHoachTuyenSinh(strIds);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        me.arrValiD_Input_KeHoachTuyenSinh = [
            { "MA": "txt_Input_TenKeHoach", "THONGTIN1": "EM" },
        ];
        me.arrValiD_KeHoachTuyenSinh = [
            { "MA": "txt_TenKeHoach", "THONGTIN1": "EM" },
        ];

        $("#zone_update_KeHoachTuyenSinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_HeKhoa tr[id='" + strRowId + "']").remove();
        });
        $("#zone_update_KeHoachTuyenSinh").delegate(".deleteHeKhoa", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KeHoachTuyenSinh_HeKhoa(strId);
            });
        });;
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/
        $("#modal_nhansu").delegate('.btnSelect', 'click', function () {
            var id = this.id;
            var strNhanSu_Id = edu.util.cutPrefixId(/slnhansu/g, id);
            me.genHTML_NhanSu(strNhanSu_Id);
            //if (edu.util.checkValue(me.strDeTai_Id)) {//Them truc tiep ThanhVien vao DeTai trong truong hop da co DeTai roi
            //    me.save_DeTai_ThanhVien(strNhanSu_Id);
            //}
            //else {//add html va se them ThanhVien khi them moi DeTai
            //    me.genHTML_NhanSu(strNhanSu_Id);
            //}
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
                    me.delete_KeHoachTuyenSinh_ThanhVien(strNhanSu_Id);
                });
            }
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#zone_update_KeHoachTuyenSinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblHoSo tr[id='" + strRowId + "']").remove();
        });
        $("#zone_update_KeHoachTuyenSinh").delegate(".deleteHoSo", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_HoSo(strId);
            });
        });
        $("#zone_update_KeHoachTuyenSinh").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tbl_ToHopMon tr[id='" + strRowId + "']").remove();
        });
        $("#zone_update_KeHoachTuyenSinh").delegate(".deleteToHopMon", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_ToHopMon(strId);
            });
        });
        $("#btnThemHeKhoa").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoachTuyenSinh_HeKhoa(id, "");
        });
        $("#btnThemHoSo").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoachTuyenSinh_HoSo(id, "");
        });
        $("#btnThemMon").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KeHoachTuyenSinh_ToHopMon(id, "");
        });
        $("#btnSearch_NhanSu").click(function () {
            edu.extend.genModal_NhanSu();
            edu.extend.getList_NhanSu("SEARCH");
        });
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHCHATHOSO", "drop_HoSo_TinhChat");
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "drop_HoSo_Loai");
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "", "", me.cbGetList_LoaiHoSo);
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHCHATHOSO", "", "", me.cbGetList_TinhChatHoSo);
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.NGANHNGHE", "dropNganhNghe", "", me.genTableModal_NganhNghe);
        edu.system.loadToCombo_DanhMucDuLieu("TS.DOITUONGDUTUYEN", "dropPhuongThucTuyen");
        edu.system.loadToCombo_DanhMucDuLieu("TS.DOTTUYENSINH", "dropDot");
        edu.system.loadToCombo_DanhMucDuLieu("TS.CHEDONHAPDULIEU", "dropCheDoHoatDong,drop_CheDoHoatDong");
        edu.system.loadToCombo_DanhMucDuLieu("TS.HOSO.TRUONGTHONGTIN", "", "", data => {
            me["dtThanhPhan"] = data;
            var obj = {
                data: data,
                renderInfor: {
                    id: "ID",
                    parentId: "",
                    name: "TEN",
                    code: "MA",
                    mRender: function (nRow, aData) {
                        return aData.TEN + " - " + aData.MA;
                    }
                },
                renderPlace: ["dropTruongThongTin", "dropThanhPhan_CauTruc", "dropThanhPhanCha_CauTruc", "dropSearch_ThanhPhan_CauTruc"],
                type: "",
                title: "Chọn thành phần"
            };
            edu.system.loadToCombo_data(obj);
        });
        me.getList_MonThi();
        me.getList_MauHoSo();
        /*------------------------------------------
        --Discription: [2-1] Action NhanSu/ThanhVien html
        --Order: 
        -------------------------------------------*/

        $("#btnThemDotPhuongThuc").click(function () {

            me.rewrite_dotphuongthuc();
            me.toggle_dotphuongthuc();
        });
        $("#tblDotPhuongThuc").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/edit_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_dotphuongthuc();
                me.viewForm_DotPhuongThuc(strId);
                me.getList_KhoanPhi();
                me.getList_NganhNghe();
                me.getList_LopDuKien();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnSave_DotPhuongThuc").click(function () {
            me.save_DotPhuongThuc();
        });
        $("#btnDelete_DotPhuongThuc").click(function () {
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {

                me.delete_DotPhuongThuc(me.strDotPhuongThuc_Id);
            });
        });

        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#btnAddKhoanPhi").click(function () {
            var id = edu.util.randomString(30, "");
            me.genHTML_KhoanPhi(id, "");
        });
        $("#tblKhoanPhi").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblKhoanPhi tr[id='" + strRowId + "']").remove();
        });
        $("#tblKhoanPhi").delegate(".deleteKetQua", "click", function () {
            var strId = this.id;
            edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));
            $("#btnYes").click(function (e) {
                me.delete_KhoanPhi(strId);
            });
        });

        $("#chkSelectAll_ModalNganhNghe").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblModalNganhNghe" });
        });
        $("#btnAddNganhNghe").click(function () {
            $("#myModalNganhNghe").modal("show");
        });
        $("#btnSave_NganhNghe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblModalNganhNghe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModalNganhNghe").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => {
                me.save_NganhNghe(e);
            });
        });

        $("#chkSelectAll_NganhNghe").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNganhNghe" });
        });
        $("#btnXoaNganhNghe").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNganhNghe", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_NganhNghe(arrChecked_Id[i]);
                }
            });
        });

        $("#tblNganhNghe").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            me.strNganhNghe_Id = strId;
            if (edu.util.checkValue(strId)) {
                $("#myModalToHop").modal("show");
                me.getList_ToHop();
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        /*------------------------------------------
       --Discription: [4-1] Action KetQua_Detai
       --Order:
       -------------------------------------------*/
        $("#chkSelectAll_ToHop").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblToHop" });
        });
        $("#chkSelectAll_MonThi").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblMonThi" });
        });
        $("#btnAddToHop").click(function () {
            $("#myModalMonThi").modal("show");
        });
        $("#btnSave_MonThi").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMonThi", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            $("#myModalMonThi").modal("hide");
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            arrChecked_Id.forEach(e => {
                me.save_ToHop(e);
            });
        });
        
        $("#btnXoaToHop").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblToHop", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_ToHop(arrChecked_Id[i]);
                }
            });
        });

        $('#myModalToHop').on('hidden.bs.modal', function () {
            me.getList_NganhNghe();
        });

        $("#btnEditMau").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_MauTuyenSinh");
        });
        $("#dropSearch_MauHoSo").on("select2:select", function () {
            me.getList_Mau_ThongTin();
        });
        $("#btnSave_MauTuyenSinh").click(function () {
            var arrChecked_Id =[]
            $("#tblMauTuyenSinh tbody tr").each(function () {
                if ($(this).attr("name")) {
                    arrChecked_Id.push(this.id)
                }
            });
            edu.system.confirm("Bạn có chắc chắn lưu " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_Mau_ThongTin(arrChecked_Id[i]);
                }
            });
        });
        $("#tblMauTuyenSinh").delegate("input", "blur", function (e) {
            var strId = this.id.split('_')[1];
            if ($(this).attr("name") != $(this).val()) {
                $("#tblMauTuyenSinh tr[id=" + strId + "]").attr("name", "1");
            }
        });
        $("#btnDelete_MauTuyenSinh").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblMauTuyenSinh", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_Mau_ThongTin(arrChecked_Id[i]);
                }
            });
        });
        $("#btnAddMauTuyenSinh").click(function () {
            $('#myModalTTTuyenSinh').modal('show');
            $("#btnNotifyModal").remove();
        });
        $("#btnSave_TTTuyenSinh").click(function () {
            me.add_Mau_ThongTin();
        });
        
        $("#btnCauTruc").click(function () {
            edu.util.toggle_overide("zone-bus", "zone_CauTruc");
            me.getList_CauTruc();
        });
        $("#btnSave_CauTruc").click(function () {
            var arrChecked_Id = []
            $("#tblCauTruc tbody tr").each(function () {
                if ($(this).attr("name")) {
                    arrChecked_Id.push(this.id)
                }
            });
            edu.system.confirm("Bạn có chắc chắn lưu " + arrChecked_Id.length + " dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_CauTruc(arrChecked_Id[i]);
                }
            });
        });
        $("#tblCauTruc").delegate("input", "blur", function (e) {
            var strId = this.id.split('_')[1];
            if ($(this).attr("name") != $(this).val()) {
                $("#tblCauTruc tr[id=" + strId + "]").attr("name", "1");
            }
        });
        $("#tblCauTruc").on("select2:select", ".edittable", function () {
            var strId = this.id.split('_')[1];
            if ($(this).attr("name") != $(this).val()) {
                $("#tblCauTruc tr[id=" + strId + "]").attr("name", "1");
            }
        });
        $("#btnDelete_CauTruc").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblCauTruc", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_CauTruc(arrChecked_Id[i]);
                }
            });
        });
        $("#btnAddCauTruc").click(function () {
            $('#myModalCauTruc').modal('show');
            $("#btnNotifyModal").remove();
        });
        $("#btnSave_TTCauTruc").click(function () {
            me.add_CauTruc();
        }); 

        $("#dropSearch_ThanhPhan_CauTruc").on("select2:select", function () {
            var value = $("#dropSearch_ThanhPhan_CauTruc").val();
            $("#tblCauTruc tbody tr").filter(function () {
                $(this).toggle($(this).find(".loccha").val() == value);
            }).css("color", "red");
        });

        $("#tblLopDuKien").delegate(".btnEdit", "click", function () {
            var strId = this.id;
            if (edu.util.checkValue(strId)) {
                me.viewForm_LopDuKien(strId);
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#btnAdd_LopDuKien").click(function () {
            $("#myModalLopDuKien").modal("show");
            var data = {};
            edu.util.viewValById("dropLopDuKien", data.DAOTAO_LOPQUANLY_ID);
            edu.util.viewValById("txtSoKeHoach", data.SOLUONGKEHOACH);
            me.strLopDuKien_Id = data.ID;
        });
        $("#btnSave_LopDuKien").click(function () {
            me.save_LopDuKien();
        });
        $("#btnDelete_LopDuKien").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblLopDuKien", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần xóa?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessXXXX"></div>');
                edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.delete_LopDuKien(arrChecked_Id[i]);
                }
            });
        });
    },
    page_load: function () {
        var me = this;
        me.getList_KeHoachTuyenSinh();
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHCHATHOSO", "drop_HoSo_TinhChat");
        //edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "drop_HoSo_Loai");
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.LOAIHOSO", "", "", me.cbGetList_LoaiHoSo);
        edu.system.loadToCombo_DanhMucDuLieu("TUYENSINH.TINHCHATHOSO", "", "", me.cbGetList_TinhChatHoSo);
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        //start_load: getList_DanToc
        
        //end_load: getDetail_HS
        me.toggle_notify();
    },

    toggle_notify: function () {
        edu.util.toggle_overide("zone-bus", "zone_notify_KeHoachTuyenSinh");
    },
    toggle_form_input: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_KeHoachTuyenSinh");
    },
    toggle_form_input_LoaiHoSo: function () {
        edu.util.toggle_overide("zone-bus", "zone_input_HoSo");
    },
    toggle_form_update: function () {
        edu.util.toggle_overide("zone-bus", "zone_update_KeHoachTuyenSinh");
    },
    toggle_dotphuongthuc: function () {
        edu.util.toggle_overide("zone-bus", "zone_DotPhuongThuc");
    },
    //toggle_detail: function () {
    //    edu.util.toggle_overide("zone-bus", "zone_detail_TTS");
    //},

    rewrite: function () {
        //reset id
        var me = this;
        //
        me.strKeHoachTuyenSinh_Id = "";
        var arrId = ["txt_Input_TenKeHoach", "txt_Input_NgayBatDau", "txt_Input_NgayKetThuc", "txt_Input_MoTa", "dropCheDoHoatDong"];
        edu.util.resetValByArrId(arrId);
    },
    rewrite_dotphuongthuc: function () {
        //reset id
        var me = this;
        //
        me.strDotPhuongThuc_Id = "";
        edu.util.viewValById("txtMaDot", "");
        edu.util.viewValById("txtTenDot", "");
        edu.util.viewValById("txtNgayBatDau", "");
        edu.util.viewValById("txtNgayKetThuc", "");
        edu.util.viewValById("dropMau", "");
        edu.util.viewValById("dropPhuongThucTuyen", "");
        edu.util.viewValById("txtMoTa", "");
        edu.util.viewValById("dropDot", "");
        edu.util.viewValById("txtThuTu", "");
        edu.util.viewValById("txtTenToHop", "");
        edu.util.viewValById("txtNguyenVongToiThieu", "");
        edu.util.viewValById("txtNguyenVongToiDa", "");
        $("#zoneNganhNghe").hide();
        $("#tblKhoanPhi tbody").html("");
        $("#tblLopDuKien tbody").html("");
    },

    getList_KeHoachTuyenSinh: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDanhSach',


            'strTuKhoa': edu.util.getValById("txtSearch_TuKhoa"),
            'strNguoiTao_Id': edu.system.userId,
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
                    }
                    me.genTable_KeHoachTuyenSinh(dtResult, iPager);
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

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    save_KeHoachTuyenSinh: function () {
        
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoachTuyenSinh/ThemMoi',


            'strId': '',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById("txt_Input_TenKeHoach"),
            'strMa': "",
            'strMoTa': edu.util.getValById("txt_Input_MoTa"),
            'strNgayBatDau': edu.util.getValById("txt_Input_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txt_Input_NgayKetThuc"),
            'strCheDoNhapDuLieu_Id': edu.util.getValById("dropCheDoHoatDong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Id != undefined) {
                        edu.system.confirm('Thêm mới thành công! Bạn có muốn tiếp tục thêm không?');
                        $("#btnYes").click(function (e) {
                            me.rewrite();
                            $('#myModalAlert').modal('hide');
                        });
                    }
                    setTimeout(function () {
                        me.getList_KeHoachTuyenSinh();
                    }, 50);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message);
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
    update_KeHoachTuyenSinh: function () {
        var me = main_doc.KeHoachTuyenSinh;
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoachTuyenSinh/CapNhat',


            'strId': me.strKeHoachTuyenSinh_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById("txt_TenKeHoach"),
            'strMa': "",
            'strMoTa': edu.util.getValById("txt_MoTa"),
            'strNgayBatDau': edu.util.getValById("txt_NgayBatDau"),
            'strNgayKetThuc': edu.util.getValById("txt_NgayKetThuc"),
            'strCheDoNhapDuLieu_Id': edu.util.getValById("drop_CheDoHoatDong"),
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var strKeHoachTuyenSinh_Id = me.strKeHoachTuyenSinh_Id;
                    //edu.system.confirm('Cập nhật thành công!. Bạn có muốn tiếp tục thêm không?');
                    edu.system.alert("Cập nhật thành công!");
                    //$("#btnYes").click(function (e) {
                    //    //me.rewrite();
                    //    $('#myModalAlert').modal('hide');
                    //});
                    $("#tbl_HeKhoa tbody tr").each(function () {
                        var strHeKhoa_Id = this.id.replace(/rm_row/g, '');
                        me.save_KeHoachTuyenSinh_HeKhoa(strHeKhoa_Id, strKeHoachTuyenSinh_Id);
                    });
                    $("#tblInputDanhSachNhanSu tbody tr").each(function () {
                        var strNhanSu_Id = this.id.replace(/rm_row/g, '');
                        if (!edu.util.checkValue($(this).attr("name"))){// Nếu chưa có dữ liệu thì gọi thêm
                            me.save_KeHoachTuyenSinh_ThanhVien(strNhanSu_Id, strKeHoachTuyenSinh_Id);
                        }
                    });
                    $("#tblHoSo tbody tr").each(function () {
                        var strHoSo_Id = this.id.replace(/rm_row/g, '');
                        me.save_HoSo(strHoSo_Id, strKeHoachTuyenSinh_Id);
                    });
                    $("#tbl_ToHopMon tbody tr").each(function () {
                        var strToHopMon_Id = this.id.replace(/rm_row/g, '');
                        me.save_ToHopMon(strToHopMon_Id, strKeHoachTuyenSinh_Id);
                    });
                    me.getList_KeHoachTuyenSinh();
                }
                else {
                    edu.system.alert("TS_KeHoachTuyenSinh/CapNhat: " + data.Message);
                }

            },
            error: function (er) {
                edu.system.alert("TS_KeHoachTuyenSinh/CapNhat (er): " + JSON.stringify(er), "w");

            },
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    //getDetail_KeHoachTuyenSinh: function (strId) {
    //    var me = main_doc.KeHoachTuyenSinh;
    //    edu.util.objGetDataInData(strId, me.dtKeHoachTuyenSinh, "ID", me.viewForm_KeHoachTuyenSinh);
    //},
    getDetail_KeHoachTuyenSinh: function (strId) {
        var me = main_doc.KeHoachTuyenSinh;
        //view data --Edit
        var obj_detail = {
            'action': 'TS_KeHoachTuyenSinh/LayChiTiet',

            'strId': strId
        };


        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    obj_notify = {
                        type: "w",
                        content: data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                    return;
                }
                if (data.Success) {
                    if (edu.util.checkValue(data.Data)) {
                        me.viewForm_KeHoachTuyenSinh(data.Data[0]);
                    }
                }
                else {
                    edu.system.alert(obj_detail.action + ": " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert(obj_detail.action + " (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_detail.action,

            contentType: true,

            data: obj_detail,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_KeHoachTuyenSinh: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_KeHoachTuyenSinh/Xoa',

            'strIds': me.strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
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

                me.getList_KeHoachTuyenSinh();
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

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genTable_KeHoachTuyenSinh: function (data, iPager) {
        var me = main_doc.KeHoachTuyenSinh;
        $("#lblKeHoachTuyenSinh_Tong").html(iPager);
        var jsonForm = {
            strTable_Id: "tblKeHoachTuyenSinh",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.KeHoachTuyenSinh.getList_KeHoachTuyenSinh()",
                iDataRow: iPager
            },
            //bHiddenHeader: true,
            //bHiddenOrder: true,
            //arrClassName: ["btnEdit"],
            sort: true,
            colPos: {
                center: [0, 5, 3, 4],
                //left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "CHEDONHAPDULIEU_TEN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                },
            ]
        };
        edu.system.loadToTable_data(jsonForm);

        /*III. Callback*/
    },
    viewForm_KeHoachTuyenSinh: function (data) {
        var me = main_doc.KeHoachTuyenSinh;
        //edu.util.toggle_overide("zone-bus", "zone_update_KeHoachTuyenSinh");
        //me.toggle_form_update();
        var dt = data[0];
        //view data --Edit
        edu.util.viewValById("txt_TenKeHoach", data.TEN);
        edu.util.viewValById("txt_MoTa", data.MOTA);
        edu.util.viewValById("txt_NgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txt_NgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("drop_CheDoHoatDong", data.CHEDONHAPDULIEU_ID);
        $(".lblKeHoach").html(data.TEN);
    },

    /*------------------------------------------
	--Discription: [4]  ACESS DB ==> he dao tao
    --Author: duyentt
	-------------------------------------------*/
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
                    me.dtHeDaoTao= dtResult;
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
	--Discription: [4]  ACESS DB ==> khoa dao tao
    --Author: duyentt
	-------------------------------------------*/
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
    --Discription: [2] AccessDB DeTai_ThanhVien
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoachTuyenSinh_ThanhVien: function (strNhanSu_Id, strKeHoachTuyenSinh_Id) {
        var me = this;
        //var strVaiTro_Id = $("#vaitro_" + strNhanSu_Id).val();
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_NhanSu/ThemMoi',


            'strId': "",
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNguoiDung_Id': strNhanSu_Id,
            'strTS_KeHoachTuyenSinh_Id': strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'TS_KeHoach_NhanSu/CapNhat';
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
            type: 'POST',

            contentType: true,

            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_KeHoachTuyenSinh_ThanhVien: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoach_NhanSu/LayDanhSach',


            'strTuKhoa': "",
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiDung_Id': "",
            'strNguoiTao_Id': "",
            'pageIndex': 1,
            'pageSize': 10000,
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtResult = [];
                    var iPager = 0;
                    if (edu.util.checkValue(data.Data)) {
                        dtResult = data.Data;
                    }
                    me.genTable_KeHoachTuyenSinh_ThanhVien(dtResult);
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
    delete_KeHoachTuyenSinh_ThanhVien: function (strNhanSu_Id) {
        var me = this;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TS_KeHoach_NhanSu/Xoa',

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
                    me.getList_KeHoachTuyenSinh_ThanhVien();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_NhanSu/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_NhanSu/Xoa (er): " + JSON.stringify(er),
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
    genTable_KeHoachTuyenSinh_ThanhVien: function (data) {
        var me = this;
        //3. create html
        me.arrNhanSu_Id = [];
        $("#tblInputDanhSachNhanSu tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var html = "";
            html += "<tr id='rm_row" + data[i].NGUOIDUNG_ID + "' name='" + data[i].ID + "'>";
            html += "<td class='td-center'>" + (i + 1) + "</td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIDUNG_TENDAYDU  + "</span></td>";
            html += "<td class='td-left'><span>" + data[i].NGUOIDUNG_TAIKHOAN + "</span></td>";
            html += "<td class='td-center'><a id='remove_nhansu" + data[i].ID + "' name='true' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
            html += "</tr>";
            //4. fill into tblNhanSu
            $("#tblInputDanhSachNhanSu tbody").append(html);
            //5. create data danhmucvaitro
            me.arrNhanSu_Id.push(data[i].ID);
        }
    },
    genHTML_NhanSu: function (strNhanSu_Id, bcheckadd) {
        var me = main_doc.KeHoachTuyenSinh;
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
        //3. create html
        var html = "";
        html += "<tr id='rm_row" + strNhanSu_Id + "'>";
        html += "<td class='td-center'>--</td>";
        html += "<td class='td-left'><span>" + valHoTen + "</span></td>";
        html += "<td class='td-left'><span>" + valMa + "</span></td>";
        html += "<td class='td-center'><a id='remove_nhansu" + strNhanSu_Id + "' class='btnDeletePoiter'><i class='fa fa-trash'></i></a></td>";
        html += "</tr>";
        //4. fill into tblNhanSu
        $("#tblInputDanhSachNhanSu tbody").append(html);
       
    },
    removeHTML_NhanSu: function (strNhanSu_Id) {
        var me = this;
        var $remove_row = "#rm_row" + strNhanSu_Id;
        console.log("$remove_row: " + $remove_row);
        $($remove_row).remove();
        edu.util.arrExcludeVal(me.arrNhanSu_Id, strNhanSu_Id);
        if (me.arrNhanSu_Id.length === 0) {
            $("#tblInputDanhSachNhanSu tbody").html("");
            $("#tblInputDanhSachNhanSu tbody").html('<tr><td colspan="6">Không tìm thấy dữ liệu!</td></tr>');
        }
    },
    /*------------------------------------------
    --Discription: [2] AccessDB DeTai_KetQua
    --ULR:  Modules
    -------------------------------------------*/
    save_KeHoachTuyenSinh_HeKhoa: function (strHeKhoa_Id, strKeHoachTuyenSinh_Id) {
        var me = this;
        var strId = strHeKhoa_Id;
        var strDaoTao_HeDaoTao_Id = edu.util.getValById('dropHeDaoTao' + strHeKhoa_Id);
        var strDaoTao_KhoaDaoTao_Id = edu.util.getValById('dropKhoaDaoTao' + strHeKhoa_Id);
        if (!edu.util.checkValue(strDaoTao_HeDaoTao_Id) || !edu.util.checkValue(strDaoTao_KhoaDaoTao_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";
        var obj_notify;
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_HeDaoTao/ThemMoi',
            
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strDaoTao_HeDaoTao_Id': strDaoTao_HeDaoTao_Id,
            'strDaoTao_KhoaDaoTao_Id': strDaoTao_KhoaDaoTao_Id,
            'strTS_KeHoachTuyenSinh_Id': strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(strId)) {
            obj_save.action = 'TS_KeHoach_HeDaoTao/CapNhat';
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
    getList_KeHoachTuyenSinh_HeKhoa: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_KeHoach_HeDaoTao/LayDanhSach',


            'strTuKhoa': '',
            'strDaoTao_HeDaoTao_Id': '',
            'strDaoTao_KhoaDaoTao_Id': '',
            'strNguoiTao_Id': '',
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
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
        var me = main_doc.KeHoachTuyenSinh;
        //--Edit
        var obj = {};
        var obj_delete = {
            'action': 'TS_KeHoach_HeDaoTao/Xoa',

            'strIds': strIds,
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
                    me.getList_KeHoachTuyenSinh_HeKhoa();
                }
                else {
                    obj = {
                        content: "TS_KeHoach_HeDaoTao/Xoa: " + data.Message,
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                }

            },
            error: function (er) {
                var obj = {
                    content: "TS_KeHoach_HeDaoTao/Xoa (er): " + JSON.stringify(er),
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
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_KeHoachTuyenSinh_HeKhoa_Data: function (data) {
        var me = this;
        $("#tbl_HeKhoa tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHeKhoa_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHeKhoa_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strHeKhoa_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropHeDaoTao' + strHeKhoa_Id + '" class="select-opt dropHeDaoTao_InTable"><option value=""> --- Chọn hệ đào tạo--</option ></select ></td>';
            row += '<td><select id="dropKhoaDaoTao' + strHeKhoa_Id + '" class="select-opt"><option value=""> --- Chọn khóa học--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHeKhoa" id="' + strHeKhoa_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_HeKhoa tbody").append(row);
            me.genCombo_HeDaoTao("dropHeDaoTao" + strHeKhoa_Id, data[i].DAOTAO_HEDAOTAO_ID);
            //me.genCombo_KhoaDaoTao("dropKhoaDaoTao" + strHeKhoa_Id, data[i].DAOTAO_KHOADAOTAO_ID);
            me.getList_KhoaDaoTao_InTable(data[i].DAOTAO_HEDAOTAO_ID, "dropKhoaDaoTao" + strHeKhoa_Id, data[i].DAOTAO_KHOADAOTAO_ID);

            $("#dropHeDaoTao" + strHeKhoa_Id).on("select2:select", function () {
                var strDrop_Id = this.id.replace("dropHeDaoTao", "");
                me.getList_KhoaDaoTao_InTable($(this).val(), "dropKhoaDaoTao" + strDrop_Id);
            });
        }
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
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> hồ sơ
    --Author: duyentt
    -------------------------------------------*/
    getList_HoSo: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'TS_QuyDinhHoSo/LayDanhSach',


            'strTuKhoa': "",
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strLoaiHoSo_Id': "",
            'strNguoiTao_Id': "",
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
                    }
                    me.genHTML_KeHoachTuyenSinh_HoSo_Data(dtResult);
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
    save_HoSo: function (strHoSo_Id, strKeHoachTuyenSinh_Id) {
        var me = this;
        var strId = strHoSo_Id;
        var strTinhChatHoSo_Id = edu.util.getValById('drop_HoSo_TinhChat' + strHoSo_Id);
        var strLoaiHoSo_Id = edu.util.getValById('drop_HoSo_Loai' + strHoSo_Id);
        var dSoLuong = edu.util.getValById('txt_HS_SoLuong' + strHoSo_Id);
        var iThuTu = edu.util.getValById('txtStt' + strHoSo_Id);
        var obj_notify = {};

        var obj_save = {
            'action': 'TS_QuyDinhHoSo/ThemMoi',
            
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_KeHoachTuyenSinh_Id': strKeHoachTuyenSinh_Id,
            'strTinhChatHoSo_Id': strTinhChatHoSo_Id,
            'strLoaiHoSo_Id': strLoaiHoSo_Id,
            'dSoLuong': dSoLuong,
            'iThuTu': iThuTu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'TS_QuyDinhHoSo/CapNhat';
        //}
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_HoSo();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    delete_HoSo: function (Ids) {
        var me = this;
        var strIds = Ids;
        //--Edit
        var obj_delete = {
            'action': 'TS_QuyDinhHoSo/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_HoSo();
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

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHTML_KeHoachTuyenSinh_HoSo_Data: function (data) {
        var me = this;
        $("#tblHoSo tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strHoSo_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strHoSo_Id + '">';
            //row += '<td style="text-align: center"><label id="txtStt' + strHoSo_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><input type="text" id="txtStt' + strHoSo_Id + '" value="' + edu.util.returnEmpty(data[i].THUTU) + '" class="form-control"/></td>';
            row += '<td><select id="drop_HoSo_Loai' + strHoSo_Id + '" class="select-opt"><option value=""> --- Chọn loại hồ sơ--</option ></select ></td>';
            row += '<td><input type="text" id="txt_HS_SoLuong' + strHoSo_Id + '" value="' + edu.util.returnEmpty(data[i].SOLUONG) + '" class="form-control"/></td>';
            row += '<td><select id="drop_HoSo_TinhChat' + strHoSo_Id + '" class="select-opt"><option value=""> --- Chọn tính chất hồ sơ--</option ></select ></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteHoSo" id="' + strHoSo_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblHoSo tbody").append(row);
            me.genCombo_LoaiHoSo("drop_HoSo_Loai" + strHoSo_Id, data[i].LOAIHOSO_ID);
            me.genCombo_TinhChatHoSo("drop_HoSo_TinhChat" + strHoSo_Id, data[i].TINHCHATHOSO_ID);
        }
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },
    genHTML_KeHoachTuyenSinh_HoSo: function (strHoSo_Id) {
        var me = this;
        var iViTri = document.getElementById("tblHoSo").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strHoSo_Id + '">';
        //row += '<td style="text-align: center"><label id="txtStt' + strHoSo_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtStt' + strHoSo_Id + '"  class="form-control"/></td>';
        row += '<td><select id="drop_HoSo_Loai' + strHoSo_Id + '" class="select-opt"><option value=""> --- Chọn loại hồ sơ--</option ></select ></td>';
        row += '<td><input type="text" id="txt_HS_SoLuong' + strHoSo_Id + '"  class="form-control"/></td>';
        row += '<td><select id="drop_HoSo_TinhChat' + strHoSo_Id + '" class="select-opt"><option value=""> --- Chọn tính chất hồ sơ--</option ></select ></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strHoSo_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblHoSo tbody").append(row);
        me.genCombo_LoaiHoSo("drop_HoSo_Loai" + strHoSo_Id, "");
        me.genCombo_TinhChatHoSo("drop_HoSo_TinhChat" + strHoSo_Id, "");
    },
    cbGetList_LoaiHoSo: function (data) {
        main_doc.KeHoachTuyenSinh.dtLoaiHoSo = data;
    },
    genCombo_LoaiHoSo: function (strLoaiHoSo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtLoaiHoSo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strLoaiHoSo_Id],
            type: "",
            title: "Chọn loại hồ sơ"
        };
        edu.system.loadToCombo_data(obj);
    },
    cbGetList_TinhChatHoSo: function (data) {
        main_doc.KeHoachTuyenSinh.dtTinhChatHoSo = data;
    },
    genCombo_TinhChatHoSo: function (strTinhChatHoSo_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtTinhChatHoSo,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhChatHoSo_Id],
            type: "",
            title: "Chọn tính chất hồ sơ"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> tổ hợp môn
    --Author: duyentt
    -------------------------------------------*/
    getList_ToHopMon: function () {
        var me = main_doc.KeHoachTuyenSinh;

        //--Edit
        var obj_list = {
            'action': 'TS_ToHopMon/LayDanhSach',


            'strTuKhoa': "",
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiTao_Id': "",
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
                    }
                    me.genHTML_KeHoachTuyenSinh_ToHopMon_Data(dtResult);
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
    save_ToHopMon: function (strToHopMon_Id, strKeHoachTuyenSinh_Id) {
        var me = this;
        var strId = strToHopMon_Id;
        var strTenMon = edu.util.getValById('txt_TenMonHoc' + strToHopMon_Id);
        var strThuTu = edu.util.getValById('txtStt' + strToHopMon_Id);
        var obj_notify = {};

        var obj_save = {
            'action': 'TS_ToHopMon/ThemMoi',


            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTS_KeHoachTuyenSinh_Id': strKeHoachTuyenSinh_Id,
            'strTenMon': strTenMon,
            'strThuTu': strThuTu,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //if (edu.util.checkValue(obj_save.strId)) {
        //    obj_save.action = 'TS_ToHopMon/CapNhat';
        //}

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ToHopMon();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    delete_ToHopMon: function (Ids) {
        var me = this;
        var strIds = Ids;
        //--Edit
        var obj_delete = {
            'action': 'TS_ToHopMon/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_ToHopMon();
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

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHTML_KeHoachTuyenSinh_ToHopMon_Data: function (data) {
        var me = this;
        $("#tbl_ToHopMon tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var strToHopMon_Id = data[i].ID;
            var row = '';
            row += '<tr id="' + strToHopMon_Id + '">';
            //row += '<td style="text-align: center"><label id="txtStt' + strToHopMon_Id + '">' + (i + 1) + '</label></td>';
            row += '<td style="text-align: center"><input type="text" id="txtStt' + strToHopMon_Id + '" value="' + edu.util.returnEmpty(data[i].THUTU) + '" class="form-control"/></td>';
            row += '<td><input type="text" id="txt_TenMonHoc' + strToHopMon_Id + '" value="' + edu.util.returnEmpty(data[i].TENMON) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteToHopMon" id="' + strToHopMon_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tbl_ToHopMon tbody").append(row);
        }
        //for (var i = data.length; i < 4; i++) {
        //    var id = edu.util.randomString(30, "");
        //    me.genHTML_KeHoachTuyenSinh_HeKhoa_Data(id, "");
        //}
    },
    genHTML_KeHoachTuyenSinh_ToHopMon: function (strToHopMon_Id) {
        var me = this;
        var iViTri = document.getElementById("tbl_ToHopMon").getElementsByTagName('tbody')[0].rows.length + 1;
        var row = '';
        row += '<tr id="' + strToHopMon_Id + '">';
        //row += '<td style="text-align: center"><label id="txtStt' + strToHopMon_Id + '">' + iViTri + '</label></td>';
        row += '<td><input type="text" id="txtStt' + strToHopMon_Id + '"  class="form-control"/></td>';
        row += '<td><input type="text" id="txt_TenMonHoc' + strToHopMon_Id + '"  class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strToHopMon_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tbl_ToHopMon tbody").append(row);
    },

    getList_Nam: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_KeHoachTuyenSinh/LayDSNamTuyenSinhTheoKeHoach',
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
                    me.cbGenCombo_Nam(dtResult, iPager);
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

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    cbGenCombo_Nam: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "NAM",
                parentId: "",
                name: "NAM",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_Nam"],
            type: "",
            title: "Chọn năm",
        }
        edu.system.loadToCombo_data(obj);
    },

    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_DotPhuongThuc: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_Dot_DoiTuong/ThemMoi',

            'strId': me.strDotPhuongThuc_Id,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strTen': edu.util.getValById('txtTenDot'),
            'strMa': edu.util.getValById('txtMaDot'),
            'strMoTa': edu.util.getValById('txtMoTa'),
            'strNgayBatDau': edu.util.getValById('txtNgayBatDau'),
            'strNgayKetThuc': edu.util.getValById('txtNgayKetThuc'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropPhuongThucTuyen'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropDot'),
            'strMoTaDieuKienXet': edu.util.getValById('txtMoTa'),
            'strTS_MauHoSo_Id': edu.util.getValById('dropMau'),
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
            'iThuTu': edu.util.getValById('txtThuTu'),
            'strTenHienThiToHop': edu.util.getValById('txtTenToHop'),
            'dNguyenVongToiThieuCanNhap': edu.util.getValById('txtNguyenVongToiThieu'),
            'dNguyenVongToiDaCanNhap': edu.util.getValById('txtNguyenVongToiDa'),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_Dot_DoiTuong/CapNhat';
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
                        edu.system.alert("Thêm mới thành công!");
                        obj_save.strId = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }

                    $("#tblKhoanPhi tbody tr").each(function () {
                        var strKetQua_Id = this.id.replace(/rm_row/g, '');
                        me.save_KhoanPhi(strKetQua_Id, obj_save.strId);
                    });
                    me.getList_DotPhuongThuc();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
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
    getList_DotPhuongThuc: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DoiTuong/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropAAAA'),
            'strDotTuyenSinh_Id': edu.util.getValById('dropAAAA'),
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtDotPhuongThuc= dtReRult;
                    me.genTable_DotPhuongThuc(dtReRult, data.Pager);
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
    delete_DotPhuongThuc: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_Dot_DoiTuong/Xoa',

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
                me.getList_DotPhuongThuc();
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
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_DotPhuongThuc();
                //});
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_DotPhuongThuc: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblDotPhuongThuc",
            aaData: data,
            colPos: {
                center: [0, 6,7,8,9],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MA"
                },
                {
                    "mDataProp": "TEN"
                },
                {
                    "mDataProp": "MOTADIEUKIENXET"
                },
                {
                    "mDataProp": "DOITUONGDUTUYEN_TEN"
                },
                {
                    "mDataProp": "DOTTUYENSINH_TEN"
                },
                {
                    "mDataProp": "NGAYBATDAU"
                },
                {
                    "mDataProp": "NGAYKETTHUC"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_DotPhuongThuc: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtDotPhuongThuc, "ID")[0];
        $("#zoneNganhNghe").show();
        //view data --Edit
        edu.util.viewValById("txtMaDot", data.MA);
        edu.util.viewValById("txtTenDot", data.TEN);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("dropMau", data.TS_MAUHOSO_ID);
        edu.util.viewValById("dropPhuongThucTuyen", data.DOITUONGDUTUYEN_ID);
        edu.util.viewValById("txtMoTa", data.MOTADIEUKIENXET);
        edu.util.viewValById("dropDot", data.DOTTUYENSINH_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtTenToHop", data.TENHIENTHITOHOP);
        edu.util.viewValById("txtNguyenVongToiThieu", data.NGUYENVONGTOITHIEUCANNHAP);
        edu.util.viewValById("txtNguyenVongToiDa", data.NGUYENVONGTOIDACANNHAP);
        me.strDotPhuongThuc_Id = data.ID;
    },

    /*------------------------------------------
    --Discription: [4]  ACESS DB ==> tổ hợp môn
    --Author: duyentt
    -------------------------------------------*/
    getList_KhoanPhi: function () {
        var me = this;

        var aData = me.dtDotPhuongThuc.find(e => e.ID === me.strDotPhuongThuc_Id);
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/DSA4BRIVEh4KJAkuICIpHhEpKB4FLjUP',
            'func': 'pkg_tuyensinh_kehoach.LayDSTS_KeHoach_Phi_Dot',
            'iM': edu.system.iM,
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strDoiTuongDuTuyen_Id': aData.DOITUONGDUTUYEN_ID,
            'strDotTuyenSinh_Id': me.strDotPhuongThuc_Id,
            'strTS_DotTS_DoiTuong_Id': me.strDotPhuongThuc_Id,
            'strTaiChinh_CacKhoanThu_Id': edu.util.getValById('dropAAAA'),
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropAAAA'),
            'dSoTien': -1,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strTS_KeHoachTuyenSinh_Id': aData.TS_KEHOACHTUYENSINH_ID,
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
                    me.genHTML_KhoanPhi_Data(dtResult);
                }
                else {
                    edu.system.alert(obj_save.action + ": " + data.Message, "w");
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
    save_KhoanPhi: function (strKhoanPhi_Id, strDotTuyenSinh_Id) {
        var me = this;
        var strId = strKhoanPhi_Id;
        var strTaiChinh_CacKhoanThu_Id = edu.util.getValById('dropKhoanPhi' + strKhoanPhi_Id);
        if (!edu.util.checkValue(strTaiChinh_CacKhoanThu_Id)) {
            return;
        }
        //Kiểm tra dữ liệu để them mới hoặc sửa
        if (strId.length == 30) strId = "";

        var obj_save = {
            'action': 'TS_KeHoach_MH/FSkkLB4VEh4KJAkuICIpHhEpKB4FLjUP',
            'func': 'pkg_tuyensinh_kehoach.Them_TS_KeHoach_Phi_Dot',
            'iM': edu.system.iM,
            'strId': strId,
            'strChucNang_Id': edu.system.strChucNang_Id,
            'dSoTien': edu.util.getValById('txtSoTien' + strKhoanPhi_Id),
            'strMoTa': edu.util.getValById('txtMoTa' + strKhoanPhi_Id),
            'strDoiTuongDuTuyen_Id': edu.util.getValById('dropPhuongThucTuyen'),
            'strDotTuyenSinh_Id': strDotTuyenSinh_Id,
            'strTS_DotTS_DoiTuong_Id': strDotTuyenSinh_Id,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strTaiChinh_CacKhoanThu_Id': strTaiChinh_CacKhoanThu_Id,
            'strDaoTao_ThoiGianDaoTao_Id': edu.util.getValById('dropThoiGian' + strKhoanPhi_Id),
            'strNguoiThucHien_Id': edu.system.userId
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_KeHoach_MH/EjQgHhUSHgokCS4gIikeESkoHgUuNQPP';
        }

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_save.strId = data.Id;
                        edu.system.alert("Thêm mới thành công!");
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }
                    me.getList_ToHopMon();
                }
                else {
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }

            },
            error: function (er) {

                obj_notify = {
                    type: "s",
                    content: obj_save.action + " (er): " + er,
                }
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
    delete_KhoanPhi: function (Ids) {
        var me = this;
        var strIds = Ids;
        //--Edit
        var obj_delete = {
            'action': 'TS_KeHoach_Phi_Dot/Xoa',

            'strIds': strIds,
            'strNguoiThucHien_Id': edu.system.userId
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (edu.util.checkValue(data.Message)) {
                    edu.system.alert(data.Message);
                    return;
                }
                if (data.Success) {
                    obj = {
                        title: "",
                        content: "Xóa dữ liệu thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_KhoanPhi();
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

            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genHTML_KhoanPhi_Data: function (data) {
        var me = this;
        $("#tblKhoanPhi tbody").html("");
        for (var i = 0; i < data.length; i++) {
            var aData = data[i];
            var strKetQua_Id = aData.ID;
            var row = '';
            row += '<tr id="' + strKetQua_Id + '">';
            row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + (i + 1) + '</label></td>';
            row += '<td><select id="dropKhoanPhi' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
            row += '<td><input type="text" id="txtSoTien' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOTIEN) + '" class="form-control"/></td>';
            row += '<td><select id="dropThoiGian' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
            row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
            row += '<td style="text-align: center"><a title="Xóa" class="deleteKetQua" id="' + strKetQua_Id + '" href="javascript:void(0)" style="color: red">Xóa</a></td>';
            row += '</tr>';
            $("#tblKhoanPhi tbody").append(row);
            me.genComBo_KhoanThu("dropKhoanPhi" + strKetQua_Id, aData.TAICHINH_CACKHOANTHU_ID);
            me.genComBo_ThoiGian("dropThoiGian" + strKetQua_Id, aData.DAOTAO_THOIGIANDAOTAO_ID);
        }
        for (var i = data.length; i < 1; i++) {
            var id = edu.util.randomString(30, "");
            me.genHTML_KhoanPhi(id, "");
        }
    },
    genHTML_KhoanPhi: function (strKetQua_Id) {
        var me = this;
        var iViTri = document.getElementById("tblKhoanPhi").getElementsByTagName('tbody')[0].rows.length + 1;
        var aData = {};
        var row = '';
        row += '<tr id="' + strKetQua_Id + '">';
        row += '<td style="text-align: center"><label id="txtStt' + strKetQua_Id + '">' + iViTri + '</label></td>';
        row += '<td><select id="dropKhoanPhi' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
        row += '<td><input type="text" id="txtSoTien' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.SOTIEN) + '" class="form-control"/></td>';
        row += '<td><select id="dropThoiGian' + strKetQua_Id + '" class="select-opt"><option value=""></option ></select ></td>';
        row += '<td><input type="text" id="txtMoTa' + strKetQua_Id + '" value="' + edu.util.returnEmpty(aData.MOTA) + '" class="form-control"/></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strKetQua_Id + '" href="javascript:void(0)">Xóa dòng</a></td>';
        row += '</tr>';
        $("#tblKhoanPhi tbody").append(row);
        me.genComBo_KhoanThu("dropKhoanPhi" + strKetQua_Id, aData.TAICHINH_CACKHOANTHU_ID);
        me.genComBo_ThoiGian("dropThoiGian" + strKetQua_Id, aData.DAOTAO_THOIGIANDAOTAO_ID);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var objList = {
            strNam_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000000,
        };
        edu.system.getList_ThoiGianDaoTao(objList, "", "", data => me.dtThoiGian = data);
    },
    genComBo_ThoiGian: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtThoiGian,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn thời gian"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_KhoanThu: function () {
        var me = this;
        var obj_list = {
            'action': 'TC_KhoanThu/LayDanhSach',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
            'iTinhTrang': -1,
            'strNhomCacKhoanThu_Id': '',
            'strNguoiTao_Id': '',
            'strCanBoQuanLy_Id': '',
            'strNguoiThucHien_Id': '',
        }

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    me.dtKhoanThu = dt;
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_KhoanThu: function (strTinhTrang_Id, default_val) {
        var me = this;
        var obj = {
            data: me.dtKhoanThu,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                default_val: default_val
            },
            renderPlace: [strTinhTrang_Id],
            type: "",
            title: "Chọn khoản thu"
        };
        edu.system.loadToCombo_data(obj);
        $("#" + strTinhTrang_Id).select2();
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Kết quả Đề tài
    --ULR:  Modules
    -------------------------------------------*/
    getList_MauHoSo: function () {
        var me = this;
        var obj_list = {
            'action': 'TS_MauHoSo/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };

        edu.system.beginLoading();
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dt = data.Data;
                    me.genComBo_MauHoSo(dt);
                }
                else {
                    console.log(data.Message);
                }
                edu.system.endLoading();
            },
            error: function (er) { edu.system.endLoading(); },
            type: "GET",
            versionAPI: "v1.0",
            contentType: true,
            action: obj_list.action,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_MauHoSo: function (dt) {
        var me = this;
        var obj = {
            data: dt,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
            },
            renderPlace: ["dropMau", "dropSearch_MauHoSo"],
            type: "",
            title: "Chọn mẫu hồ sơ"
        };
        edu.system.loadToCombo_data(obj);
        $("#dropMau").select2();
    },
    
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NganhNghe: function (strNganhNghe_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtDotPhuongThuc.find(e => e.ID === me.strDotPhuongThuc_Id);
        //--Edit
        var obj_save = {
			'action': 'TS_Dot_DT_NganhNghe/ThemMoi',
            'type': 'POST',
            'strId': "",
			'strChucNang_Id' : edu.system.strChucNang_Id,
            'strNganhNghe_Id': strNganhNghe_Id,
            'strTS_Dot_DoiTuong_Id': me.strDotPhuongThuc_Id,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strDoiTuongDuTuyen_Id': aData.DOITUONGDUTUYEN_ID,
            'strMaNganhNgheXetTuyen': $("#txtMaNganh" + strNganhNghe_Id).val(),
            'strDotTuyenSinh_Id': aData.DOTTUYENSINH_ID,
			'strNguoiThucHien_Id' : edu.system.userId,
		};
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_Dot_DT_NganhNghe/CapNhat';
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
                        edu.system.alert("Thêm mới thành công!");
                        obj_save.strId = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_NganhNghe();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NganhNghe: function (strDanhSach_Id) {
        var me = this;
        var aData = me.dtDotPhuongThuc.find(e => e.ID === me.strDotPhuongThuc_Id);
        //--Edit
        var obj_list = {
            'action': 'TS_Dot_DT_NganhNghe/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNganhNghe_Id': edu.util.getValById('dropAAAA'),
            'strDoiTuongDuTuyen_Id': aData.DOITUONGDUTUYEN_ID,
            'strDotTuyenSinh_Id': aData.DOTTUYENSINH_ID,
            'strTS_KeHoachTuyenSinh_Id': aData.TS_KEHOACHTUYENSINH_ID,
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 100000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtNganhNghe = dtReRult;
                    me.genTable_NganhNghe(dtReRult, data.Pager);
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
    delete_NganhNghe: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_Dot_DT_NganhNghe/Xoa',

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
                me.getList_DotPhuongThuc();
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
                    me.getList_NganhNghe();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_NganhNghe: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblNganhNghe",
            aaData: data,
            colPos: {
                center: [0, 5, 6],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "NGANHNGHE_MA"
                },
                {
                    "mDataProp": "NGANHNGHE_TEN"
                },
                {
                    "mDataProp": "DSTOHOP"
                },
                {
                    "mDataProp": "MANGANHNGHEXETTUYEN"
                }
                , {
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
    genTableModal_NganhNghe: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblModalNganhNghe",
            aaData: data,
            colPos: {
                center: [0, 4],
                //right: [5]
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
                        return '<input class="form-control" id="txtMaNganh' + aData.ID + '" value="' + edu.util.returnEmpty(aData.MANGANHNGHEXETTUYEN) + '" />';
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" />';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
    },
    viewForm_NganhNghe: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtDotPhuongThuc, "ID")[0];
        //view data --Edit
        edu.util.viewValById("txtMaDot", data.MA);
        edu.util.viewValById("txtTenDot", data.TEN);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("dropMau", data.TS_MAUHOSO_ID);
        edu.util.viewValById("dropPhuongThucTuyen", data.DOITUONGDUTUYEN_ID);
        edu.util.viewValById("txtMoTa", data.MOTADIEUKIENXET);
        edu.util.viewValById("dropDot", data.DOTTUYENSINH_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtTenToHop", data.TENHIENTHITOHOP);
        edu.util.viewValById("txtNguyenVongToiThieu", data.NGUYENVONGTOITHIEUCANNHAP);
        edu.util.viewValById("txtNguyenVongToiDa", data.NGUYENVONGTOIDACANNHAP);
        me.strNganhNghe_Id = data.ID;
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_ToHop: function (strTS_MonThi_Id) {
        var me = this;
        var obj_notify = {};
        var aData = me.dtNganhNghe.find(e => e.ID === me.strNganhNghe_Id);
        var aDataMonThi = me.dtMonThi.find(e => e.ID === strTS_MonThi_Id);
        //--Edit
        var obj_save = {
            'action': 'TS_ToHop_Mon_Nganh_Dot/ThemMoi',
            'type': 'POST',
            'strChucNang_Id': edu.system.strChucNang_Id,
            'strNganhNghe_Id': aData.NGANHNGHE_ID,
            'strTS_Dot_DoiTuong_Id': aData.TS_DOTTUYENSINH_DOITUONG_ID,
            'strTS_KeHoachTuyenSinh_Id': aData.TS_KEHOACHTUYENSINH_ID,
            'strDoiTuongDuTuyen_Id': aData.DOITUONGDUTUYEN_ID,
            'strDotTuyenSinh_Id': aData.DOTTUYENSINH_ID,
            'strPhanLoai_Id': aDataMonThi.PHANLOAI_ID,
            'strTS_ToHop_Id': aDataMonThi.TS_TOHOP_ID,
            'strTS_MonThi_Id': aDataMonThi.TS_MONTHI_ID,
            'strTinhChat_Id': aDataMonThi.TINHCHAT_ID,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'TS_ToHop_Mon_Nganh_Dot/CapNhat';
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
                        edu.system.alert("Thêm mới thành công!");
                        obj_save.strId = data.Id;
                    }
                    else {
                        obj_notify = {
                            type: "i",
                            content: "Cập nhật thành công!",
                        }
                        edu.system.alert("Cập nhật thành công!");
                    }
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message,
                    }
                    edu.system.alert(obj_save.action + " (er): " + data.Message);
                }
            },
            error: function (er) {
                edu.system.alertOnModal(obj_notify);
            },
            type: "POST",
            async: false,
            action: obj_save.action,
            complete: function () {
                edu.system.start_Progress("zoneprocessXXXX", function () {
                    me.getList_ToHop();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_ToHop: function (strDanhSach_Id) {
        var me = this;
        var aData = me.dtNganhNghe.find(e => e.ID === me.strNganhNghe_Id);
        edu.util.viewValById("dropNganhNghe", aData.NGANHNGHE_ID)
        //--Edit
        var obj_list = {
            'action': 'TS_ToHop_Mon_Nganh_Dot/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strNganhNghe_Id': aData.NGANHNGHE_ID,
            'strDoiTuongDuTuyen_Id': aData.DOITUONGDUTUYEN_ID,
            'strDotTuyenSinh_Id': aData.DOTTUYENSINH_ID,
            'strTS_KeHoachTuyenSinh_Id': aData.TS_KEHOACHTUYENSINH_ID,
            'strTS_ToHop_Id': "",
            'strTS_MonThi_Id':"",
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtToHop = dtReRult;
                    me.genTable_ToHop(dtReRult, data.Pager);
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
    delete_ToHop: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'TS_ToHop_Mon_Nganh_Dot/Xoa',

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
                me.getList_DotPhuongThuc();
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
                    me.getList_ToHop();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*------------------------------------------
    --Discription: [4] GenHTML Tiến độ đề tài
    --ULR:  Modules
    -------------------------------------------*/
    genTable_ToHop: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblToHop",
            aaData: data,
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TS_TOHOP_TEN"
                },
                {
                    "mDataProp": "TS_MONTHI_TEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "TINHCHAT_TEN"
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
    viewForm_ToHop: function (strId) {
        var me = this;
        //call popup --Edit
        var data = edu.util.objGetDataInData(strId, me.dtDotPhuongThuc, "ID")[0];
        //view data --Edit
        edu.util.viewValById("txtMaDot", data.MA);
        edu.util.viewValById("txtTenDot", data.TEN);
        edu.util.viewValById("txtNgayBatDau", data.NGAYBATDAU);
        edu.util.viewValById("txtNgayKetThuc", data.NGAYKETTHUC);
        edu.util.viewValById("dropMau", data.TS_MAUHOSO_ID);
        edu.util.viewValById("dropPhuongThucTuyen", data.DOITUONGDUTUYEN_ID);
        edu.util.viewValById("txtMoTa", data.MOTADIEUKIENXET);
        edu.util.viewValById("dropDot", data.DOTTUYENSINH_ID);
        edu.util.viewValById("txtThuTu", data.THUTU);
        edu.util.viewValById("txtTenToHop", data.TENHIENTHITOHOP);
        edu.util.viewValById("txtNguyenVongToiThieu", data.NGUYENVONGTOITHIEUCANNHAP);
        edu.util.viewValById("txtNguyenVongToiDa", data.NGUYENVONGTOIDACANNHAP);
        me.strToHop_Id = data.ID;
    },


    getList_MonThi: function (strDanhSach_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'TS_ToHop_MonThi/LayDanhSach',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtAAAA'),
            'strTS_ToHop_Id': edu.util.getValById('dropAAAA'),
            'strTS_MonThi_Id': edu.util.getValById('dropAAAA'),
            'strNguoiTao_Id': edu.util.getValById('dropAAAA'),
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtMonThi = dtReRult;
                    me.genTable_MonThi(dtReRult, data.Pager);
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
    genTable_MonThi: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblMonThi",
            aaData: data,
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TS_TOHOP_TEN"
                },
                {
                    "mDataProp": "TS_MONTHI_TEN"
                },
                {
                    "mDataProp": "PHANLOAI_TEN"
                },
                {
                    "mDataProp": "TINHCHAT_TEN"
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

    add_Mau_ThongTin: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/FSkkLB4VEh4JLhIuHgwuEy4vJgPP',
            'func': 'pkg_tuyensinh_kehoach.Them_TS_HoSo_MoRong',
            'iM': edu.system.iM,
            'strTS_MauHoSo_Id': edu.util.getValById('dropSearch_MauHoSo'),
            'strTruongThongTin_Id': edu.util.getValById('dropTruongThongTin'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_Mau_ThongTin();
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
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_Mau_ThongTin();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Mau_ThongTin: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/EjQgHhUSHgkuEi4eDC4TLi8m',
            'func': 'pkg_tuyensinh_kehoach.Sua_TS_HoSo_MoRong',
            'iM': edu.system.iM,
            'strId': strId,
            'dThuTu': edu.util.getValById('txtThuTu_' + strId) ? edu.util.getValById('txtThuTu_' + strId): -1,
            'dDoRong': edu.util.getValById('txtDoRong_' + strId) ? edu.util.getValById('txtDoRong_' + strId) : -1,
            'dBatBuoc': edu.util.getValById('txtBatBuoc_' + strId) ? edu.util.getValById('txtBatBuoc_' + strId) : -1,
            'strThuocNhom': edu.util.getValById('txtThuocNhom_' + strId),
            'dPhamViBatDau': edu.util.getValById('txtPVBatDau_' + strId) ? edu.util.getValById('txtPVBatDau_' + strId) : -1,
            'dPhamViKetThuc': edu.util.getValById('txtPVKetThuc_' + strId) ? edu.util.getValById('txtPVKetThuc_' + strId) : -1,
            'strNguoiThucHien_Id': edu.system.userId,
        };
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
                    me.getList_Mau_ThongTin();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_Mau_ThongTin: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/GS4gHhUSHgkuEi4eDC4TLi8m',
            'func': 'pkg_tuyensinh_kehoach.Xoa_TS_HoSo_MoRong',
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
                    me.getList_Mau_ThongTin();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_Mau_ThongTin: function () {
        var me = this;
        var obj_save = {
            'action': 'TS_KeHoach_MH/DSA4BRIVEh4JLhIuHgwuEy4vJgPP',
            'func': 'pkg_tuyensinh_kehoach.LayDSTS_HoSo_MoRong',
            'iM': edu.system.iM,
            'strTS_MauHoSo_Id': edu.util.getValById('dropSearch_MauHoSo'),
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_Mau_ThongTin(data.Data);
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
    genTable_Mau_ThongTin: function (data, iPager) {
        var jsonForm = {
            strTable_Id: "tblMauTuyenSinh",
            aaData: data,
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "TRUONGTHONGTIN_MA"
                },
                {
                    "mDataProp": "TRUONGTHONGTIN_TEN"
                },
                {
                    "mDataProp": "TRUONGTHONGTIN_KIEUDULIEU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThuocNhom_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.THUOCNHOM) + '" name="' + edu.util.returnEmpty(aData.THUOCNHOM) + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThuTu_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.THUTU) + '" name="' + edu.util.returnEmpty(aData.THUTU) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtBatBuoc_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.BATBUOC) + '" name="' + edu.util.returnEmpty(aData.BATBUOC) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtDoRong_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.DORONG) + '" name="' + edu.util.returnEmpty(aData.DORONG) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtPVBatDau_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.PHAMVIBATDAU) + '" name="' + edu.util.returnEmpty(aData.PHAMVIBATDAU) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtPVKetThuc_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.PHAMVIKETTHUC) + '" name="' + edu.util.returnEmpty(aData.PHAMVIKETTHUC) + '"/>';
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
    
    add_CauTruc: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/FSkkLB4VEh4CIDQVMzQiCSgkLxUpKAkuEi4P',
            'func': 'pkg_tuyensinh_kehoach.Them_TS_CauTrucHienThiHoSo',
            'iM': edu.system.iM,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strThanhPhan_Id': edu.util.getValById('dropThanhPhan_CauTruc'),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropThanhPhanCha_CauTruc'),
            'dThuTu': -1,
            'strXauCongThucTinh': edu.util.getValById('txtAAAA'),
            'strKyHieu': edu.util.getValById('txtAAAA'),
            'dLaThanhPhanCuoi': -1,
            'dTinhToan': -1,
            'dHienThiKetQuaTraCuu': -1,
            'dThuTuTraCuu': -1,
            'strMoTa': edu.util.getValById('txtAAAA'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Thêm mới thành công!",
                    }
                    edu.system.alertOnModal(obj_notify);
                    me.getList_CauTruc();
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
                //edu.system.start_Progress("zoneprocessXXXX", function () {
                //    me.getList_Mau_ThongTin();
                //});
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_CauTruc: function (strId) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/EjQgHhUSHgIgNBUzNCIJKCQvFSkoCS4SLgPP',
            'func': 'pkg_tuyensinh_kehoach.Sua_TS_CauTrucHienThiHoSo',
            'iM': edu.system.iM,
            'strId': strId,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strThanhPhan_Id': edu.util.getValById('dropThanhPhan_' + strId),
            'strThanhPhan_Cha_Id': edu.util.getValById('dropThanhPhanCha_' + strId),
            'dThuTu': edu.util.getValById('txtThuTu_' + strId) ? edu.util.getValById('txtThuTu_' + strId) : -1,
            'strXauCongThucTinh': edu.util.getValById('txtCongThuc_' + strId),
            'strKyHieu': edu.util.getValById('txtKyHieu_' + strId),
            'dLaThanhPhanCuoi': edu.util.getValById('txtThanhPhanCuoi_' + strId) ? edu.util.getValById('txtThanhPhanCuoi_' + strId) : -1,
            'dTinhToan': edu.util.getValById('txtTinhToan_' + strId) ? edu.util.getValById('txtTinhToan_' + strId) : -1,
            'dHienThiKetQuaTraCuu': edu.util.getValById('txtHienThiKQ_' + strId) ? edu.util.getValById('txtHienThiKQ_' + strId) : -1,
            'dThuTuTraCuu': edu.util.getValById('txtThuTuTraCuu_' + strId) ? edu.util.getValById('txtThuTuTraCuu_' + strId) : -1,
            'strMoTa': edu.util.getValById('txtMoTa_' + strId),
            'strNguoiThucHien_Id': edu.system.userId,
        };
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
                    me.getList_CauTruc();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    delete_CauTruc: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_KeHoach_MH/GS4gHhUSHgIgNBUzNCIJKCQvFSkoCS4SLgPP',
            'func': 'pkg_tuyensinh_kehoach.Xoa_TS_CauTrucHienThiHoSo',
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
                    me.getList_CauTruc();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_CauTruc: function () {
        var me = this;
        var obj_save = {
            'action': 'TS_KeHoach_MH/DSA4BRIVEh4CIDQVMzQiCSgkLxUpKAkuEi4P',
            'func': 'pkg_tuyensinh_kehoach.LayDSTS_CauTrucHienThiHoSo',
            'iM': edu.system.iM,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genTable_CauTruc(data.Data);
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
    genTable_CauTruc: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblCauTruc",
            aaData: data,
            colPos: {
                center: [0, 5],
                //right: [5]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        return '<div style="width: 420px"><select id="dropThanhPhan_' + aData.ID + '" class="select-opt edittable"  name="' + edu.util.returnEmpty(aData.THANHPHAN_ID) + '"></select></div>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<div style="width: 420px"><select id="dropThanhPhanCha_' + aData.ID + '" class="select-opt edittable loccha"  name="' + edu.util.returnEmpty(aData.THANHPHAN_CHA_ID) + '"></select></div>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input style="width: 420px" id="txtCongThuc_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.XAUCONGTHUCTINH) + '" name="' + edu.util.returnEmpty(aData.XAUCONGTHUCTINH) + '" />';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input  style="width: 220px" id="txtKyHieu_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.KYHIEU) + '" name="' + edu.util.returnEmpty(aData.KYHIEU) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThanhPhanCuoi_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.LATHANHPHANCUOI) + '" name="' + edu.util.returnEmpty(aData.LATHANHPHANCUOI) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtTinhToan_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.TINHTOAN) + '" name="' + edu.util.returnEmpty(aData.TINHTOAN) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThuTu_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.THUTU) + '" name="' + edu.util.returnEmpty(aData.THUTU) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtThuTuTraCuu_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.THUTUTRACUU) + '" name="' + edu.util.returnEmpty(aData.THUTUTRACUU) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtHienThiKQ_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.HIENTHIKETQUATRACUU) + '" name="' + edu.util.returnEmpty(aData.HIENTHIKETQUATRACUU) + '"/>';
                    }
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input id="txtMoTa_' + aData.ID + '" class="form-control edittable" value="' + edu.util.returnEmpty(aData.MOTA) + '" name="' + edu.util.returnEmpty(aData.MOTA) + '"/>';
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
        var arrThanhPhan = [];
        data.forEach(e => arrThanhPhan.push("dropThanhPhan_" + e.ID, "dropThanhPhanCha_" + e.ID))
        var obj = {
            data: me.dtThanhPhan,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                mRender: function (nRow, aData) {
                    return aData.TEN + " - " + aData.MA;
                }
            },
            renderPlace: arrThanhPhan,
            type: "",
            title: "Chọn thành phần"
        };
        edu.system.loadToCombo_data(obj);
        $(".select-opt").select2();
        data.forEach(e => {
            edu.util.viewValById("dropThanhPhan_" + e.ID, e.THANHPHAN_ID)
            $("#dropThanhPhan_" + e.ID).prop('disabled', true)
            edu.util.viewValById("dropThanhPhanCha_" + e.ID, e.THANHPHAN_CHA_ID)
        })
        /*III. Callback*/
    },
    
    getList_ComBoLopDuKien: function () {
        var me = this;
        var obj_save = {
            'action': 'TS_ThongTin_MH/DSA4BRINLjEQDRUpJC4KJAkuICIp',
            'func': 'pkg_tuyensinh_thongtin.LayDSLopQLTheoKeHoach',
            'iM': edu.system.iM,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        console.log(obj_save);

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.genComBo_ComBoLopDuKien(data.Data);
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
    genComBo_ComBoLopDuKien: function (dt) {
        var me = this;
        var obj = {
            data: dt,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
            },
            renderPlace: ["dropLopDuKien"],
            type: "",
            title: "Chọn lớp quản lý"
        };
        edu.system.loadToCombo_data(obj);
    },
    
    getList_LopDuKien: function () {
        var me = this;

        var obj_save = {
            'action': 'TS_ThongTin_MH/DSA4BRIVEh4FLjUeBS4oFTQuLyYeDS4xCS4i',
            'func': 'pkg_tuyensinh_thongtin.LayDSTS_Dot_DoiTuong_LopHoc',
            'iM': edu.system.iM,
            'strTS_DoiTuongTS_DT_Id': me.strDotPhuongThuc_Id,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me["dtLopDuKien"] = data.Data;
                    me.genTable_LopDuKien(data.Data);
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
    genTable_LopDuKien: function (data, iPager) {
        var me = this;

        var jsonForm = {
            strTable_Id: "tblLopDuKien",
            aaData: data,
            //bPaginate: {
            //    strFuntionName: "main_doc.LopDuKien.getList_LopDuKien()",
            //    iDataRow: iPager
            //},
            colPos: {
                center: [0],
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_MA"
                },
                {
                    "mDataProp": "DAOTAO_LOPQUANLY_TEN"
                },
                {
                    "mDataProp": "SOLUONGKEHOACH"
                },
                {
                    "mDataProp": "SOLUONGTHUCTE"
                },
                {
                    "mDataProp": "NGAY_DD_MM_YYYY_HHMMSS"
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
        /*III. Callback*/
    },
    save_LopDuKien: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'TS_ThongTin_MH/FSkkLB4VEh4FLjUeBS4oFTQuLyYeDS4xCS4i',
            'func': 'pkg_tuyensinh_thongtin.Them_TS_Dot_DoiTuong_LopHoc',
            'iM': edu.system.iM,
            'strId': me.strLopDuKien_Id,
            'strTS_DoiTuongTS_DT_Id': me.strDotPhuongThuc_Id,
            'strTS_KeHoachTuyenSinh_Id': me.strKeHoachTuyenSinh_Id,
            'strDaoTao_LopQuanLy_Id': edu.system.getValById('dropLopDuKien'),
            'dSoLuongKeHoach': edu.system.getValById('txtSoKeHoach'),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        if (obj_save.strId) {
            obj_save.action = 'TS_ThongTin_MH/EjQgHhUSHgUuNR4FLigVNC4vJh4NLjEJLiIP';
            obj_save.func = 'TS_ThongTin_MH.Sua_TS_Dot_DoiTuong_LopHoc'
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!obj_save.strId) {
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
                    me.getList_LopDuKien();
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
    delete_LopDuKien: function (Ids) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'TS_ThongTin_MH/GS4gHhUSHgUuNR4FLigVNC4vJh4NLjEJLiIP',
            'func': 'pkg_tuyensinh_thongtin.Xoa_TS_Dot_DoiTuong_LopHoc',
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
                    me.getList_LopDuKien();
                });
            },
            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    viewForm_LopDuKien: function (strId) {
        var me = this;
        //call popup --Edit
        $("#myModalLopDuKien").modal("show");
        var data = me.dtLopDuKien.find(e => e.ID == strId);
        edu.util.viewValById("dropLopDuKien", data.DAOTAO_LOPQUANLY_ID);
        edu.util.viewValById("txtSoKeHoach", data.SOLUONGKEHOACH);
        me.strLopDuKien_Id = data.ID;
    },
};