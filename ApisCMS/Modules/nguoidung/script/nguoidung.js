/*----------------------------------------------
--Author: nnthuong  
--Phone: 
--Date of created: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function NguoiDung() { }
NguoiDung.prototype = {
    arrValid_NguoiDung: [],
    arrValid_NguoiDung_Edit: [],
    dtNguoiDung: '',
    strNguoiDung_Id: '',
    iNguoiDung_PhanLoai: '',
    dtUser: '',
    strLoaiDoiTuong: 'CANBO',
    //--[5] Cap nhat tai khoan
    objNguoiDung_Current: null,     //ban ghi dang xem chi tiet (cache tu danh sach)
    dtDonVi: [],                    //NS_CoCauToChuc/LayDanhSach

    init: function () {
        var me = this;
        /*------------------------------------------
        --Discription: Initial system
        -------------------------------------------*/
        edu.system.page_load();
        edu.system.loadToCombo_DanhMucDuLieu("CMS.LRS", "dropLoaiThongTin");

        $("#dropLoaiThongTin").on("select2:select", function () {
            var strCha_Id = $(this).find('option:selected').val();
            if (strCha_Id) {
                $("#strPassResetA").parent().parent().hide();
            } else {
                $("#strPassResetA").parent().parent().show();
            }
        });
        /*------------------------------------------
        --Discription: Initial Page 
        -------------------------------------------*/
        me.toggle_list();
        $("#txtSearch_NguoiDung_TuKhoa").focus();
        //EM-empty, FL-float, IN-int, DA-date, seperated by '#' character...
        me.arrValid_NguoiDung = [
            { "MA": "txtNguoiDung_Ho", "THONGTIN1": "EM" },
            { "MA": "txtNguoiDung_Ten", "THONGTIN1": "EM" },
            { "MA": "txtNguoiDung_TaiKhoan", "THONGTIN1": "EM" },
            { "MA": "txtNguoiDung_MatKhau", "THONGTIN1": "EM" },
            { "MA": "txtNguoiDung_Email", "THONGTIN1": "EM" }
        ];
        me.arrValid_NguoiDung_Edit = [
            { "MA": "txtEditND_TaiKhoan", "THONGTIN1": "EM" },
            { "MA": "txtEditND_TenDayDu", "THONGTIN1": "EM" }
        ];
        me.getList_NguoiDung();
        me.getList_DonVi();
        //edu.system.loadToCombo_DanhMucDuLieuDuLieu("QLTC.LOVT", "dropVaiTro_Loai", "Chọn loại vai trò");
        /*------------------------------------------
        --Discription: [0] Action common
        --Order: 
        -------------------------------------------*/
        $(".btnClose").click(function () {
            //--Dong form Sua thi quay ve man Chi tiet, khong nhay ve danh sach
            if ($(this).closest("#zone_bus_edit").length > 0) {
                me.toggle_detail();
                return;
            }
            me.toggle_list();
        });
        $(".btnAddnew").click(function () {
            me.toggle_input();
            $("#txtNguoiDung_Ho").focus();
        }); 
        $(".btnExtend_Search").click(function () {
            me.getList_NguoiDung();
            //edu.util.toggle("box-sub-search");
        });
        $(".btnND_Search").click(function () {
            me.getList_CanBo();

        });
        $("#txtSearch_ND_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_CanBo();

            }
        });
        /*------------------------------------------
        --Discription: [1] Action NguoiDung zone_timkiem
        -------------------------------------------*/
        $("#txtSearch_NguoiDung_TuKhoa").keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                me.getList_NguoiDung();
                me.getList_NguoiDung2();
            }
        });
        $("#tblNguoiDung").delegate(".btnView", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/view_/g, strId);
            if (edu.util.checkValue(strId)) {
                me.toggle_detail();
                me.strNguoiDung_Id = strId;
                edu.util.setOne_BgRow(strId, "tblNguoiDung");
                me.getDetail_NguoiDung(strId, function (data) {
                    //--giu lai ban ghi goc de form Cap nhat lay du lieu (ke ca cac cot khong hien thi)
                    me.objNguoiDung_Current = (data && data.length > 0) ? data[0] : null;
                    me.viewForm_NguoiDung(data);
                });
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $('.rdNguoiDung_PhanLoai').on('change', function () {
            me.iNguoiDung_PhanLoai = $('input[name="rdNguoiDung_PhanLoai"]:checked').val();
            me.getList_NguoiDung();
        });
        $("#tblNguoiDung").delegate(".btnPopover_NguoiDung", "mouseenter", function () {
            var strId   = this.id;
            var obj     = this;
            edu.extend.popover_NguoiDung(strId, me.dtNguoiDung, obj);
        });
        /*------------------------------------------
        --Discription: [1] Action NguoiDung zone_bus
        -------------------------------------------*/
        $("#btnSave_NguoiDung").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_NguoiDung);
            if (valid) {
                me.save_NguoiDung();
            }
        });
        $("#btnDelete_VaiTro").click(function (e) {
            e.preventDefault();
            edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");
            $("#btnYes").click(function (e) {
                me.delete_VaiTro();
            });
            return false;
        });
        $("#btnRewrite_VaiTro").click(function () {
            me.rewrite();
        });       
        /*------------------------------------------
        --Discription: [2] Action NguoiDung_KhoiTao
        -------------------------------------------*/
        $("#detailInitial_ND").delegate("#btnIntital_CanBo", "click", function () {
            me.toggle_initial();
            me.strLoaiDoiTuong = "CANBO";
            me.getList_CanBo();
        });
        $("#detailInitial_ND").delegate("#btnIntital_SinhVien", "click", function () {
            me.toggle_initial_SV();
            me.strLoaiDoiTuong = "SINHVIEN";
            //me.getList_SinhVien();
        });
        $("#detailInitial_ND").delegate("#btnIntital_NCS", "click", function () {

            me.strLoaiDoiTuong = "NCS";
        });
        $("#detailInitial_ND").delegate("#btnIntital_GiaDinh", "click", function () {

            me.strLoaiDoiTuong = "GIADINH";
        });
        $("#detailInitial_ND").delegate("#btnIntital_DoiTac", "click", function () {

            me.strLoaiDoiTuong = "DOITAC";
        });

        $("#listInitial_ND").delegate(".btnInitial", "click", function () {
            var strId = this.id;
            strId = edu.util.cutPrefixId(/initial_/g, strId);
            if (edu.util.checkValue(strId)) {
                //
                me.save_NguoiDung_UserId(strId);
               //
            }
            else {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            }
        });
        $("#imgnguoidung").attr("src", edu.system.getRootPathImg(""));
        /*------------------------------------------
        --Discription: [2] Action Reset Password
        -------------------------------------------*/
        $("#btnResetPass_Default").click(function () {
            //var MD5 = function (d) { var r = M(V(Y(X(d), 8 * d.length))); return r.toLowerCase() }; function M(d) { for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++)_ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _); return f } function X(d) { for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++)_[m] = 0; for (m = 0; m < 8 * d.length; m += 8)_[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32; return _ } function V(d) { for (var _ = "", m = 0; m < 32 * d.length; m += 8)_ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255); return _ } function Y(d, _) { d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _; for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) { var h = m, t = f, g = r, e = i; f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e) } return Array(m, f, r, i) } function md5_cmn(d, _, m, f, r, i) { return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m) } function md5_ff(d, _, m, f, r, i, n) { return md5_cmn(_ & m | ~_ & f, d, _, r, i, n) } function md5_gg(d, _, m, f, r, i, n) { return md5_cmn(_ & f | m & ~f, d, _, r, i, n) } function md5_hh(d, _, m, f, r, i, n) { return md5_cmn(_ ^ m ^ f, d, _, r, i, n) } function md5_ii(d, _, m, f, r, i, n) { return md5_cmn(m ^ (_ | ~f), d, _, r, i, n) } function safe_add(d, _) { var m = (65535 & d) + (65535 & _); return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m } function bit_rol(d, _) { return d << _ | d >>> 32 - _ }

            $('#myModal').modal('show');
            $("#btnNotifyModal").remove();
            /** NORMAL words**/
            var value = 'test';
            
            if (edu.util.checkValue(me.strNguoiDung_Id)) {
                var strPass = Math.floor(Math.random() * 1000000);
                edu.util.viewValById("strPassResetA", strPass);
                //edu.system.confirm('Mật khẩu sẽ reset: <input class="form-control" id="strPassResetA" value="' + strPass + '" style="width: 100px"></input>');
                
            }
        });
        $("#btnSave_MatKhau").click(function (e) {
            me.resetPass_Default(me.strNguoiDung_Id);
        });
        $("#btnResetPass_Email").click(function () {
            if (edu.util.checkValue(me.strNguoiDung_Id)) {
               
            }
        });


        $("#chkSelectAll").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNguoiDung_CanBo" });
        });
        $("#btnKichHoat").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDung_CanBo", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần kích hoạt?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn kích hoạt tài khoản không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessND"></div>');
                edu.system.genHTML_Progress("zoneprocessND", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_NguoiDung_UserId(arrChecked_Id[i]);
                }
            });
        });

        $("#chkSelectAll_SV").on("click", function () {
            edu.util.checkedAll_BgRow(this, { table_id: "tblNguoiDung_SV" });
        });
        $("#btnKichHoat_SV").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDung_SV", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng cần kích hoạt?");
                return;
            }
            edu.system.confirm("Bạn có chắc chắn kích hoạt tài khoản không?");
            $("#btnYes").click(function (e) {
                edu.system.alert('<div id="zoneprocessND"></div>');
                edu.system.genHTML_Progress("zoneprocessND", arrChecked_Id.length);
                for (var i = 0; i < arrChecked_Id.length; i++) {
                    me.save_NguoiDung_UserId(arrChecked_Id[i]);
                }
            });
        });

        $(".btnSV_Search").click(function () {
            me.getList_SinhVien();
        });
        $("#txtSearch_SV_TuKhoa").keypress(function (e) {
            if (e.which == 13) {
                me.getList_SinhVien();
            }
        });

        $("#dropSearch_HeDaoTao").on("select2:select", function () {
            me.getList_KhoaDaoTao();
            // me.getList_SinhVien();
        });
        $("#dropSearch_KhoaDaoTao").on("select2:select", function () {
            me.getList_ChuongTrinhDaoTao();
            me.getList_LopQuanLy();
            // me.getList_SinhVien();
        });
        $("#dropSearch_ChuongTrinhDaoTao").on("select2:select", function () {
            me.getList_LopQuanLy();
            // me.getList_SinhVien();
        });
        $("#dropSearch_LopQuanLy").on("select2:select", function () {
            me.getList_SinhVien();
        });


        me.getList_HeDaoTao();
        me.getList_KhoaDaoTao();

        $("#btnRewrite_NguoiDung").click(function () {
            me.getList_SinhVien();
        });

        $("#btnKeThua").click(function () {
            $("#dsNguoiDung2").show();
            me.getList_NguoiDung2();
        });
        $("#btnKeThuaToanBo").click(function () {
            var arrChecked_Id = edu.util.getArrCheckedIds("tblNguoiDung2", "checkX");
            if (arrChecked_Id.length == 0) {
                edu.system.alert("Vui lòng chọn đối tượng?");
                return;
            }
            edu.system.alert('<div id="zoneprocessXXXX"></div>');
            edu.system.genHTML_Progress("zoneprocessXXXX", arrChecked_Id.length);
            for (var i = 0; i < arrChecked_Id.length; i++) {
                me.save_KeThua(arrChecked_Id[i]);
            }
        });
        /*------------------------------------------
        --Discription: [5] Action Cap nhat thong tin tai khoan
        -------------------------------------------*/
        $("#btnEdit_NguoiDung").click(function () {
            if (!edu.util.checkValue(me.strNguoiDung_Id) || !me.objNguoiDung_Current) {
                edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
                return;
            }
            me.toggle_edit();
            me.viewForm_Edit_NguoiDung(me.objNguoiDung_Current);
            $("#txtEditND_TenDayDu").focus();
        });
        $("#btnUpdate_NguoiDung").click(function () {
            var valid = edu.util.validInputForm(me.arrValid_NguoiDung_Edit);
            if (valid) {
                me.update_NguoiDung();
            }
        });
    },
    /*----------------------------------------------
    --Discription: function common
    ----------------------------------------------*/
    rewrite: function () {
        var me = this;
        edu.util.resetValById("txtVaiTro_Ten");
        edu.util.resetValById("txtVaiTro_Ma");
        edu.util.resetValById("txtVaiTro_ThuTuHienThi");
        edu.util.resetValById("txtVaiTro_MoTa");
        edu.util.resetValById("dropVaiTro_Loai");
        me.strNguoiDung_Id = "";
    },
    rewrite_User: function () {
        var me = this;
        edu.util.resetValById("txtNguoiDung_Ho");
        edu.util.resetValById("txtNguoiDung_Ten");
        edu.util.resetValById("txtNguoiDung_TaiKhoan");
        edu.util.resetValById("txtNguoiDung_MatKhau");
        edu.util.resetValById("txtNguoiDung_Email");
        edu.util.resetValById("txtNguoiDung_DienThoai");
        me.strNguoiDung_Id = "";
    },
    toggle_list: function () {
        edu.util.toggle_overide("zone-bus-nd", "zone_bus_list");
    },
    toggle_detail: function () {
        edu.util.toggle_overide("zone-bus-nd", "zone_bus_detail");
    },
    toggle_input: function () {
        edu.util.toggle_overide("zone-bus-nd", "zone_bus_input");
    },
    toggle_initial: function () {
        edu.util.toggle_overide("zone-bus-nd", "zone_bus_initial");
    },
    toggle_initial_SV: function () {
        edu.util.toggle_overide("zone-bus-nd", "zone_bus_initial_SV");
    },
    toggle_edit: function () {
        edu.util.toggle_overide("zone-bus-nd", "zone_bus_edit");
    },
    /*----------------------------------------------
    --Discription: [1] Acces DB NguoiDung
    --API:  
    ----------------------------------------------*/
    save_NguoiDung: function () {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_TaiKhoan/TaoMoiTaiKhoan',
            

            'strFirstName'  : edu.util.getValById("txtNguoiDung_Ten"),
            'strLastName'   : edu.util.getValById("txtNguoiDung_Ho"),
            'strTaiKhoan'    : edu.util.getValById("txtNguoiDung_TaiKhoan"),
            'strPassWord'   : edu.util.getValById("txtNguoiDung_MatKhau"),
            'strEmail'      : edu.util.getValById("txtNguoiDung_Email"),
            'strSoDienThoai': edu.util.getValById("txtNguoiDung_DienThoai"),
            'dTrangThai'       : 1,
            'dThoiHanDoiMatKhau':1,
            'strNguoiThucHien_Id' : edu.system.userId,
            'strId': "",
            'strDonViId': edu.util.getValById('txtAAAA'),
            'strDiaChi': edu.util.getValById('txtAAAA'),
            'strQuyDinhDoiMatKhauId': edu.util.getValById('txtAAAA'),
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("CMS_NguoiDung/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_NguoiDung/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    save_NguoiDung_UserId: function (strUserId) {
        var me = this;
        var dataUser = "";
        for (var i = 0; i < me.dtUser.length; i++) {
            if (strUserId == me.dtUser[i].ID) {
                dataUser = me.dtUser[i];
                break;
            }
        }
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_TaiKhoan/TaoMoiTaiKhoan',
            

            'strFirstName': dataUser.HODEM,
            'strLastName': dataUser.TEN,
            'strTaiKhoan': dataUser.MASO,
            'strPassWord': "",
            'strEmail': dataUser.EMAIL_CANHAN,
            'strSoDienThoai': dataUser.SDT_CANHAN,
            'dTrangThai': 1,
            'dThoiHanDoiMatKhau': 1,
            'strNguoiThucHien_Id': edu.system.userId,
            'strId': dataUser.ID,
            'strTenDayDu': edu.util.getValById('txtAAAA'),
            'strDonViId': edu.util.getValById('txtAAAA'),
            'strHinhDaiDien': edu.util.getValById('txtAAAA'),
            'strQuyDinhDoiMatKhauId': edu.util.getValById('txtAAAA'),
            'strDiaChi': edu.util.getValById('txtAAAA'),
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thêm mới thành công!");
                }
                else {
                    edu.system.alert("CMS_NguoiDung/ThemMoi: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_NguoiDung/ThemMoi (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',

            complete: function () {
                edu.system.start_Progress("zoneprocessND", function () {
                    switch (me.strLoaiDoiTuong) {
                        case "CANBO": me.getList_CanBo(); break;
                        case "SINHVIEN": me.getList_SinhVien(); break;
                    }
                });
            },
            contentType: true,
            
            action: obj_save.action,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NguoiDung: function () {
        var me = this;
        //--Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
			'iM' : edu.system.iM,
            'versionAPI'            : 'v1.0',

            'strTuKhoa'             : edu.util.getValById("txtSearch_NguoiDung_TuKhoa"),
            'pageIndex'             : edu.system.pageIndex_default,
            'pageSize'              : edu.system.pageSize_default,
            'dTrangThai'            : 1,
            'strChung_DonVi_Id'     : "",
            'strVaiTro_Id'          : "",
            'strPhanLoaiDoiTuong'   : me.iNguoiDung_PhanLoai,
            'strCapXuLy_Id'         : "",
            'strTinhThanh_Id': "",
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
                    me.genTable_NguoiDung(dtResult, iPager);
                    me.dtNguoiDung = dtResult;
                    me.getCount_NguoiDungKhoiTao();
                }
                else {
                    edu.system.alert("CMS_NguoiDung/LayDanhSach: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_NguoiDung/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,
            
            contentType: true,
            
            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_NguoiDung2: function () {
        var me = this;
        //--Edit
		var obj_save = {
			'action': 'CMS_QuanLyNguoiDung_MH/DSA4BSAvKRIgIikPJjQuKAU0LyYP',
			'func': 'pkg_chung_quanlynguoidung.LayDanhSachNguoiDung',
			'iM' : edu.system.iM,

            'strTuKhoa': edu.util.getValById("txtSearch_NguoiDung_TuKhoa"),
            'pageIndex': edu.system.pageIndex_default,
            'pageSize': edu.system.pageSize_default,
            'dTrangThai': 1,
            'strChung_DonVi_Id': "",
            'strVaiTro_Id': "",
            'strPhanLoaiDoiTuong': me.iNguoiDung_PhanLoai,
            'strCapXuLy_Id': "",
            'strTinhThanh_Id': "",
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
                    me.genTable_NguoiDung2(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_NguoiDung/LayDanhSach: " + data.Message);
                }

            },
            error: function (er) {

                edu.system.alert("CMS_NguoiDung/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    getDetail_NguoiDung: function (strId, callback) {
        var me = this;
        edu.util.objGetDataInData(strId, me.dtNguoiDung, "ID", callback);
    },
    delete_VaiTro: function () {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_QuanLyNguoiDung/XoaVaiTro',
            
            'strIds': me.strVaiTro_Id,
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var obj = {
                        content: "Xóa thành công!",
                        code: ""
                    };
                    edu.system.afterComfirm(obj);
                    me.getList_VaiTro();
                }
                else {
                    edu.system.alert("CMS_VaiTro/Xoa: " + data.Message);
                }
                
            },
            error: function (er) {
                edu.system.alert("CMS_VaiTro/Xoa (er): " + JSON.stringify(er), "w");
                
            },
            type: 'POST',
            action: obj_delete.action,
            
            contentType: true,
            
            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [1] Gen HTML NguoiDung
    --ULR:  
    ----------------------------------------------*/
    genTable_NguoiDung: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("tblNguoiDung_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDung",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NguoiDung.getList_NguoiDung()",
                iDataRow: iPager
            },
            arrClassName: ["tr-pointer", "btnPopover_NguoiDung", "btnView"],
            bHiddenHeader: true,
            bHiddenOrder: true,
            colPos: {
                left: [1],
                fix: [0]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        var strAnh = edu.system.getRootPathImg(aData.HINHDAIDIEN);
                        var html = '<img src="' + strAnh + '" class= "table-img" />';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<span>' + edu.util.returnEmpty(aData.TENDAYDU) + "</span><br />";
                        html += '<span class="italic">' + edu.util.returnEmpty(aData.EMAIL) + "</span><br />";
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        var html = '';
                        html += '<a class="btn btn-default btn-circle" id="view_' + aData.ID + '" href="#" title="View"><i class="fa fa-eye color-active"></i></a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/
        
    },
    genTable_NguoiDung2: function (data, iPager) {
        var me = this;
        edu.util.viewHTMLById("lblNguoiDung2_Tong", iPager);
        var jsonForm = {
            strTable_Id: "tblNguoiDung2",
            aaData: data,
            colPos: {
                left: [1],
                fix: [0],
                center: [0, 3]
            },
            bPaginate: {
                strFuntionName: "main_doc.NguoiDung.getList_NguoiDung2()",
                iDataRow: iPager
            },
            aoColumns: [
                {
                    "mDataProp": "TAIKHOAN"
                },
                {
                    "mDataProp": "TENDAYDU"
                },
                {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '" class="checkOne">';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        /*III. Callback*/

    },
    viewForm_NguoiDung: function (data) {
        var me = this;
        if (!data || data.length == 0) return;
        //view data
        edu.util.viewHTMLById("lblNguoiDung_HoTen", edu.util.returnEmpty(data[0].TENDAYDU).toUpperCase());
        edu.util.viewHTMLById("lblNguoiDung_TaiKhoan", data[0].TAIKHOAN);
        edu.util.viewHTMLById("lblNguoiDung_DienThoai", data[0].SODIENTHOAI);
        edu.util.viewHTMLById("lblNguoiDung_Email", data[0].EMAIL);
        edu.util.viewHTMLById("lblNguoiDung_DonVi", data[0].TENDONVI);
        edu.util.viewHTMLById("lblNguoiDung_HanMatKhau", data[0].THOIHANPHAIDOIMATKHAU);
        edu.util.viewHTMLById("lblNguoiDung_TruyCapGanNhat", data[0].NGAYCN_GAN_DD_MM_YYYY);
        $(".imgnguoidung").attr("src", edu.system.getRootPathImg(data[0].HINHDAIDIEN));
    },
    genCombo_VaiTro: function () {
        var me = this;
        var obj = {
            data: me.dtVaiTro,
            renderInfor: {
                id: "ID",
                parentId: "CHUNG_VAITRO_CHA_ID",
                name: "TENVAITRO",
                code: "MAVAITRO"
            },
            renderPlace: ["dropVaiTro_Cha"],
            type: "order",
            title: "Chọn vai trò"
        };
        edu.system.loadToCombo_data(obj);
    },
    /*----------------------------------------------
    --Discription: [2] Access DB NguoiDung_KhoiTao
    --ULR:  
    ----------------------------------------------*/
    getCount_NguoiDungKhoiTao: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_TaiKhoan/LaySoLuongTaiKhoanChuaKhoiTao',
            'versionAPI': 'v1.0'
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

                    me.genDetail_NguoiDungKhoiTao(dtResult);
                }
                else {
                    edu.system.alert("CMS_NguoiDung/LaySoLuongChuaKhoiTao: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_NguoiDung/LaySoLuongChuaKhoiTao (er): " + er, "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },

    getList_CanBo: function(){
        var me = this;
        //--Edit
        
        var obj_list = {
            'action': 'NS_HoSoV2/LayDanhSachNhanSuChuaTaoTK',
            'strTuKhoa': edu.util.getValById('txtSearch_ND_TuKhoa'),
            'strDonViChinhThuc_Id': edu.util.getValById('dropAAAA'),
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
                        iPager = data.Pager;
                        me.dtUser = dtResult;
                    }

                    me.genList_CanBo(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_NguoiDungKhoiTao/LayDanhSach_NhanSu: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_NguoiDungKhoiTao/LayDanhSach_NhanSu (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    getList_SinhVien: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SV_HoSoHocVien/LayDanhSachSinhVienChuaKhoiTao',
            'type': 'GET',
            'strTuKhoa': edu.util.getValById('txtSearch_SV_TuKhoa'),
            'strDaoTao_HeDaoTao_Id': edu.util.getValById('dropSearch_HeDaoTao'),
            'strDaoTao_KhoaDaoTao_Id': edu.util.getValById('dropSearch_KhoaDaoTao'),
            'strDaoTao_ChuongTrinh_Id': edu.util.getValById('dropSearch_ChuongTrinhDaoTao'),
            'strDaoTao_LopQuanLy_Id': edu.util.getValById('dropSearch_LopQuanLy'),
            'dTrangThai': 1,
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
                        me.dtUser = dtResult;
                    }
                    me.genList_SinhVien(dtResult, iPager);
                }
                else {
                    edu.system.alert("CMS_NguoiDungKhoiTao/LayDanhSach_SinhVien: " + data.Message);
                }
                
            },
            error: function (er) {
                
                edu.system.alert("CMS_NguoiDungKhoiTao/LayDanhSach_SinhVien (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    /*----------------------------------------------
    --Discription: [2] Gen HTML NguoiDung_KhoiTao
    --ULR:  
    ----------------------------------------------*/
    genDetail_NguoiDungKhoiTao: function (data) {
        var me = this;
        $("#detailInitial_ND").html("");
        var html = '';
        //canbo
        html += '<li>';
        html += '<span><i class="fa fa-angle-right"></i> Danh sách tài khoản Cán bộ chờ khởi tạo</span>';
        html += ' <span class="badge">' + data[0].CANBO + '</span >';
        html += '<a id="btnIntital_CanBo" class=" pull-right btn btn-default color-active">Chi tiết</a>';
        html += '</li>';
        //sinhvien
        html += '<li>';
        html += '<span><i class="fa fa-angle-right"></i> Danh sách tài khoản Sinh viên chờ khởi tạo</span>';
        html += ' <span class="badge">' + data[0].SINHVIEN + '</span >';
        html += '<a id="btnIntital_SinhVien" class=" pull-right btn btn-default color-active">Chi tiết</a>';
        html += '</li>';
        //ncs
        html += '<li>';
        html += '<span><i class="fa fa-angle-right"></i> Danh sách tài khoản Nghiên cứu sinh chờ khởi tạo</span>';
        html += ' <span class="badge">' + data[0].NCS + '</span >';
        html += '<a id="btnIntital_NCS" class=" pull-right btn btn-default color-active">Chi tiết</a>';
        html += '</li>';
        //giaidinh
        html += '<li>';
        html += '<span><i class="fa fa-angle-right"></i> Danh sách tài khoản Phụ huynh chờ khởi tạo</span>';
        html += ' <span class="badge">' + data[0].GIADINH + '</span >';
        html += '<a id="btnIntital_GiaDinh" class=" pull-right btn btn-default color-active">Chi tiết</a>';
        html += '</li>';
        //doitac
        html += '<li>';
        html += '<span><i class="fa fa-angle-right"></i> Danh sách Đối tác chờ khởi tạo</span>';
        html += ' <span class="badge">' + data[0].DOITAC + '</span >';
        html += '<a id="btnIntital_DoiTac" class=" pull-right btn btn-default color-active">Chi tiết</a>';
        html += '</li>';
        //

        //3. bind
        $("#detailInitial_ND").html(html);
    },

    genList_CanBo: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguoiDung_CanBo",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NguoiDung.getList_CanBo()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4,5]
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "NGAYSINHDAYDU"
                },
                {
                    "mDataProp": "SDT_CANHAN"
                }
                , {
                    "mRender": function (nRow, aData) {
                        return '<input type="checkbox" id="checkX' + aData.ID + '"/>';
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //edu.system.loadPagination("listInitial_ND", "main_doc.NguoiDung.getList_CanBo()", iPager);
        ////1. variable
        //$("#listInitial_ND").html("");
        //var html = '';
        //var strNguoiDung_Id = "";
        //var strNguoiDung_Ten = "";
        ////2. processing
        //for (var i = 0; i < data.length; i++) {
        //    strNguoiDung_Id = data[i].ID;
        //    strNguoiDung_Ten = edu.util.returnEmpty(data[i].HOTEN);

        //    html += '<li id="' + strNguoiDung_Id + '" title="' + strNguoiDung_Ten + '">';
        //    html += '<span class=""><i class="fa fa-angle-right"></i> ' + strNguoiDung_Ten + '</span>';
        //    html += '<div class="tools" style="display: block">';
        //    html += '<a id="initial_' + strNguoiDung_Id + '" class="btn btn-default btn-circle btnInitial" title="Kích hoạt"><i class="fa fa-toggle-off color-active"></i> Kích hoạt tài khoản</a>';
        //    html += '</div>';
        //    html += '</li>';
        //}
        ////3. bind
        //$("#listInitial_ND").html(html);
    },
    genList_SinhVien: function (data, iPager) {
        var me = this;
        var jsonForm = {
            strTable_Id: "tblNguoiDung_SV",
            aaData: data,
            bPaginate: {
                strFuntionName: "main_doc.NguoiDung.getList_SinhVien()",
                iDataRow: iPager
            },
            colPos: {
                center: [0, 3, 4, 5]
                //right: [5]
            },
            aoColumns: [
                {
                    "mDataProp": "MASO"
                },
                {
                    "mDataProp": "HOTEN"
                },
                {
                    "mDataProp": "NGAYSINHDAYDU"
                },
                {
                    "mDataProp": "SDT_CANHAN"
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
    /*----------------------------------------------
    --Discription: [2] NguoiDung Reset_password
    --ULR:  
    ----------------------------------------------*/
    resetPass_Default: function (strUser_Id) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'CMS_Custom/ResetPassword',
            
            'strId': strUser_Id,
            'strLoaiThongTin': edu.util.getValById("dropLoaiThongTin"),
            'strNguoiThucHienId': edu.system.userId,
            'strMatKhau': edu.util.getValById("strPassResetA").replace(/ /g, '')
        };
        //
        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    obj_notify = {
                        type: "s",
                        content: "Reset mật khẩu thành công",
                    }
                    edu.system.alertOnModal(obj_notify);
                    //edu.system.alert("Reset mật khẩu thành công");
                }
                
                else {
                    obj_notify = {
                        type: "i",
                        content: "User/ResetPassword: " + data.Message,
                    }
                    edu.system.alertOnModal(obj_notify);
                }
            },
            error: function (er) {
                
                edu.system.alert("User/ResetPassword failed (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    resetPass_Email: function () {
    },

    /*------------------------------------------
	--Discription: [2] ACCESS DB ==> Systemroot HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
    --Author:
	-------------------------------------------*/
    getList_HeDaoTao: function () {
        var me = this;
        var obj_HeDT = {
            strHinhThucDaoTao_Id: "",
            strBacDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 1000
        };
        edu.system.getList_HeDaoTao(obj_HeDT, "", "", me.cbGenCombo_HeDaoTao);
    },
    getList_KhoaDaoTao: function (strHeDaoTao_Id) {
        var me = this;
        var obj_KhoaDT = {
            strHeDaoTao_Id: edu.util.getValById("dropSearch_HeDaoTao"),
            strCoSoDaoTao_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000
        };
        edu.system.getList_KhoaDaoTao(obj_KhoaDT, "", "", me.cbGenCombo_KhoaDaoTao);
    },
    getList_ThoiGianDaoTao: function () {
        var me = this;
        var obj = {
            strNam_Id: edu.util.getValCombo("dropSearch_NamHoc"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_ThoiGianDaoTao(obj, me.loadToCombo_ThoiGianDaoTao);

    },
    getList_ChuongTrinhDaoTao: function () {
        var me = this;
        var obj = {
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strN_CN_LOP_Id: "",
            strKhoaQuanLy_Id: edu.util.getValCombo("dropKhoaQuanLy"),
            strToChucCT_Cha_Id: "",
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 10000,
        };
        edu.system.getList_ChuongTrinhDaoTao(obj, me.loadToCombo_ChuongTrinhDaoTao);
    },
    getList_LopQuanLy: function () {
        var me = this;
        var obj = {
            strCoSoDaoTao_Id: "",
            strDaoTao_HeDaoTao_Id: edu.util.getValCombo("dropSearch_HeDaoTao"),
            strKhoaDaoTao_Id: edu.util.getValCombo("dropSearch_KhoaDaoTao"),
            strNganh_Id: edu.util.getValCombo("dropKhoaQuanLy"),
            strLoaiLop_Id: "",
            strToChucCT_Id: edu.util.getValCombo("dropSearch_ChuongTrinhDaoTao"),
            strNguoiThucHien_Id: "",
            strTuKhoa: "",
            pageIndex: 1,
            pageSize: 100000,
        };
        edu.system.getList_LopQuanLy(obj, "", "", me.loadToCombo_LopQuanLy);

    },
    getList_NamNhapHoc: function () {
        var me = this;
        var obj_list = {
            'action': 'KHCT_ThongTin/LayDSDaoTao_NamHoc',
            'strNguoiThucHien_Id': '',
            'strTuKhoa': '',
            'pageIndex': 1,
            'pageSize': 10000,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.loadToCombo_NamNhapHoc(dtReRult);
                }
                else {
                    edu.system.alert(data.Message, "s");
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
    getList_KhoaQuanLy: function () {
        var me = this;
        edu.system.getList_KhoaQuanLy(null, "", "", me.loadToCombo_KhoaQuanLy)
    },
    /*------------------------------------------
	--Discription: [2] GEN HTML ==> HeDaoTao/KhoaDaoTao/ChuongTrinhDaoTao
	--ULR:  
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
            renderPlace: ["dropSearch_HeDaoTao", "dropHeDaoTao"],
            type: "",
            title: "Chọn hệ đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    cbGenCombo_KhoaDaoTao: function (data) {
        var me = this

        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENKHOA",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_KhoaDaoTao"],
            type: "",
            title: "Chọn khóa đào tạo",
        };
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_KhoaDaoTao", "");
    },
    loadToCombo_ChuongTrinhDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TENCHUONGTRINH",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ChuongTrinhDaoTao"],
            type: "",
            title: "Chọn chương trình đào tạo",
        }
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_ChuongTrinhDaoTao", "");
    },
    loadToCombo_ThoiGianDaoTao: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "DAOTAO_THOIGIANDAOTAO",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_ThoiGianDaoTao", "dropThoiGianDaoTao"],
            type: "",
            title: "Chọn thời gian đào tạo",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_LopQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropSearch_LopQuanLy"],
            type: "",
            title: "Chọn lớp quản lý",
        }
        edu.system.loadToCombo_data(obj);
        edu.util.viewValById("dropSearch_LopQuanLy", "");
    },
    cbGenBo_TrangThai: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "",
                avatar: ""
            },
            renderPlace: ["dropTinhTrangSinhVien"]
        }
        edu.system.loadToCombo_data(obj);
        //$('#dropTinhTrangSinhVien option').prop('selected', true);
    },
    loadToCombo_PhamVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: "MA"
            },
            renderPlace: ["dropSearch_PhanViTongHop"],
            type: "",
            title: "Chọn phạm vi",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_NamNhapHoc: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "NAMHOC",
                code: "NAMHOC",
                avatar: "NAMNHAPHOC"
            },
            renderPlace: ["dropSearch_NamHoc", "dropNamHoc"],
            type: "",
            title: "Chọn năm nhập học",
        }
        edu.system.loadToCombo_data(obj);
    },
    loadToCombo_KhoaQuanLy: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
            },
            renderPlace: ["dropKhoaQuanLy"],
            type: "",
            title: "Chọn khoa quản lý",
        }
        edu.system.loadToCombo_data(obj);
    },


    save_KeThua: function (strNguoiDung_Id) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_PhanQuyenDuLieu/KhoiTao_KeThua_Quyen',
            'type': 'POST',
            'strNguoiDung_Id': strNguoiDung_Id,
            'strNguoiDung_DungKeThua_Id': me.strNguoiDung_Id,
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
                    //me.getList_TangThem();
                });
            },
            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },

    /*----------------------------------------------
    --Discription: [5] Cap nhat thong tin tai khoan
    --API: pkg_chung_quanlynguoidung.CapNhatThongTinTaiKhoan
    ----------------------------------------------*/
    /*--Lay gia tri dau tien ton tai trong ban ghi theo danh sach ten cot uu tien
      (LayDanhSachNguoiDung khong dong nhat ten cot giua cac ban trien khai)--*/
    pickField_NguoiDung: function (objData, arrKey) {
        if (!objData) return "";
        for (var i = 0; i < arrKey.length; i++) {
            if (objData[arrKey[i]] !== undefined && objData[arrKey[i]] !== null) {
                return objData[arrKey[i]];
            }
        }
        return "";
    },
    getList_DonVi: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'NS_CoCauToChuc/LayDanhSach',
            'dTrangThai': 1,
            'strLoaiCoCauToChuc_Id': '',
            'strCoCauToChucCha_Id': ''
        };
        //
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    me.dtDonVi = edu.util.checkValue(data.Data) ? data.Data : [];
                    me.loadToCombo_DonVi(me.dtDonVi);
                }
                else {
                    edu.system.alert("NS_CoCauToChuc/LayDanhSach: " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert("NS_CoCauToChuc/LayDanhSach (er): " + JSON.stringify(er), "w");
            },
            type: 'GET',
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    loadToCombo_DonVi: function (data) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "TEN",
                code: "MA",
                avatar: ""
            },
            renderPlace: ["dropEditND_DonVi"],
            type: "",
            title: "Chọn đơn vị",
        };
        edu.system.loadToCombo_data(obj);
    },
    viewForm_Edit_NguoiDung: function (objData) {
        var me = this;
        if (!objData) return;

        var strTaiKhoan = edu.util.returnEmpty(objData.TAIKHOAN);
        var strTenDayDu = edu.util.returnEmpty(objData.TENDAYDU);
        //--Cac cot khong hien thi o man chi tiet: do ten cot co the khac nhau nen lay theo thu tu uu tien
        var strDonVi_Id = me.pickField_NguoiDung(objData, ["CHUNG_DONVI_ID", "DONVI_ID", "DAOTAO_COCAUTOCHUC_ID"]);
        var strDiaChi = me.pickField_NguoiDung(objData, ["DIACHI"]);
        var strQuyDinh_Id = me.pickField_NguoiDung(objData, ["CHUNG_QUYDINHDOIMATKHAU_ID", "QUYDINHDOIMATKHAU_ID"]);
        var iTrangThai = me.pickField_NguoiDung(objData, ["TRANGTHAI"]);
        var iThoiHan = me.pickField_NguoiDung(objData, ["THOIHANPHAIDOIMATKHAU", "THOIHANDOIMATKHAU"]);
        //--Khong co DONVI_ID thi do nguoc tu ten don vi sang ID trong danh muc co cau to chuc
        if (!edu.util.checkValue(strDonVi_Id) && edu.util.checkValue(objData.TENDONVI)) {
            for (var i = 0; i < me.dtDonVi.length; i++) {
                if (me.dtDonVi[i].TEN == objData.TENDONVI) {
                    strDonVi_Id = me.dtDonVi[i].ID;
                    break;
                }
            }
        }

        edu.util.viewHTMLById("lblEditND_TieuDe", strTenDayDu + " (" + strTaiKhoan + ")");
        edu.util.viewValById("hidEditND_Id", edu.util.returnEmpty(objData.ID));
        edu.util.viewValById("hidEditND_HinhDaiDien", edu.util.returnEmpty(objData.HINHDAIDIEN));
        edu.util.viewValById("hidEditND_QuyDinhDoiMatKhauId", strQuyDinh_Id);
        edu.util.viewValById("txtEditND_TaiKhoan", strTaiKhoan);
        edu.util.viewValById("txtEditND_TenDayDu", strTenDayDu);
        edu.util.viewValById("txtEditND_Email", edu.util.returnEmpty(objData.EMAIL));
        edu.util.viewValById("txtEditND_DienThoai", edu.util.returnEmpty(objData.SODIENTHOAI));
        edu.util.viewValById("txtEditND_DiaChi", strDiaChi);
        edu.util.viewValById("txtEditND_ThoiHanDoiMatKhau", iThoiHan);
        edu.util.viewValById("dropEditND_TrangThai", edu.util.checkValue(iTrangThai) ? iTrangThai : 1);
        edu.util.viewValById("dropEditND_DonVi", strDonVi_Id);
        $("#imgEditND_Avatar").attr("src", edu.system.getRootPathImg(objData.HINHDAIDIEN));
    },
    update_NguoiDung: function () {
        var me = this;
        var strId = edu.util.getValById("hidEditND_Id");
        if (!edu.util.checkValue(strId)) {
            edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));
            return;
        }
        //--QuanLyNguoiDung_MHEntity khai bao dTrangThai/dThoiHanDoiMatKhau la System.Double
        //  KHONG nullable => gui null se loi "Error converting value {null} to type 'System.Double'"
        //  ngay o buoc deserialize (HTTP 500). Rong thi phai gui so 0.
        var iTrangThai = parseInt(edu.util.getValById("dropEditND_TrangThai"), 10);
        var iThoiHan = parseInt(edu.util.getValById("txtEditND_ThoiHanDoiMatKhau"), 10);
        if (isNaN(iTrangThai)) iTrangThai = 1;
        if (isNaN(iThoiHan)) iThoiHan = 0;
        //--Edit
        var obj_save = {
            'action': 'CMS_QuanLyNguoiDung_MH/AiAxDykgNRUpLi8mFSgvFSAoCikuIC8P',
            'func': 'pkg_chung_quanlynguoidung.CapNhatThongTinTaiKhoan',
            'iM': edu.system.iM,

            'strId': strId,
            'strTaiKhoan': edu.util.getValById("txtEditND_TaiKhoan"),
            'strTenDayDu': edu.util.getValById("txtEditND_TenDayDu"),
            'strDonViId': edu.util.getValById("dropEditND_DonVi"),
            'dTrangThai': iTrangThai,
            'strEmail': edu.util.getValById("txtEditND_Email"),
            'dThoiHanDoiMatKhau': iThoiHan,
            'strQuyDinhDoiMatKhauId': edu.util.getValById("hidEditND_QuyDinhDoiMatKhauId"),
            'strDiaChi': edu.util.getValById("txtEditND_DiaChi"),
            'strSoDienThoai': edu.util.getValById("txtEditND_DienThoai"),
            'strHinhDaiDien': edu.util.getValById("hidEditND_HinhDaiDien"),
            'strNguoiThucHien_Id': edu.system.userId,
        };
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Cập nhật thành công!", "s");
                    //--Cap nhat lai ban ghi dang giu de man Chi tiet hien ngay gia tri moi
                    if (me.objNguoiDung_Current) {
                        me.objNguoiDung_Current.TAIKHOAN = obj_save.strTaiKhoan;
                        me.objNguoiDung_Current.TENDAYDU = obj_save.strTenDayDu;
                        me.objNguoiDung_Current.EMAIL = obj_save.strEmail;
                        me.objNguoiDung_Current.SODIENTHOAI = obj_save.strSoDienThoai;
                        me.objNguoiDung_Current.THOIHANPHAIDOIMATKHAU = obj_save.dThoiHanDoiMatKhau;
                        me.objNguoiDung_Current.TENDONVI = $("#dropEditND_DonVi option:selected").text();
                        me.viewForm_NguoiDung([me.objNguoiDung_Current]);
                    }
                    //--Nap lai danh sach de cache (me.dtNguoiDung) dong bo voi DB
                    me.getList_NguoiDung();
                    me.toggle_detail();
                }
                else {
                    edu.system.alert(obj_save.func + ": " + data.Message, "w");
                }
            },
            error: function (er) {
                edu.system.alert(obj_save.func + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
};