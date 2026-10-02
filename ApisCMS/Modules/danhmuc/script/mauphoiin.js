/*----------------------------------------------
--Author:
--Phone:
--Date of created:
--Input:
--Output:
--API URL:
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function MauPhoiIn() { }
MauPhoiIn.prototype = {
    strMauPhoiIn_Id: '',
    dtMauPhoiIn: [],
    iLienSelect: 0,
    dDoDai: 0,
    dDoRong: 0,
    
    init: function () {
        var me = this;
        var pointElement = null;
        $(".btnAdd").click(function () {
            me.popup();
            me.resetPopup();
        });
        $("#btnSave_MauPhoiIn").click(function () {
            me.save_MauPhoiIn();
        });
        me.getList_MauPhoiIn();
        $("#btnThemNoiDung").click(function () {
            if ($("#dropSearch_Phoi").val() == "") {
                edu.system.alert("Bạn cần chọn mẫu in");
                return;
            }
            var data = $("#txtNoiDungPhoi").val();
            if (data != "") {
                $("#zoneMotherPhoi .pr-containt:eq(" + me.iLienSelect + ")").append('<span class="phoi" style="margin-top: 100px; margin-left: 100px; " title="' + me.iLienSelect + '">' + data + '</span>');
                $("#txtNoiDungPhoi").val("");
            }
        });

        $(document).delegate(".phoi", "click", function (e) {
            e.preventDefault();
            pointElement = this;
            $(".phoi").each(function () {
                //this.style.border = "none";
                this.classList.remove("activeNoiDung");
            });
            $(".btnChuDam").each(function () {
                this.classList.remove("btn-primary");
                this.classList.add("btn-default");
            });
            $(".btnCanLe").each(function () {
                this.classList.remove("btn-primary");
                this.classList.add("btn-default");
            });
            this.classList.add("activeNoiDung");
            var stylePoint = $(this).attr("style");
            if (stylePoint.includes("font-weight: bold;")) {
                var classPoint = $(".btnChuDam[name='font-weight: bold;']")[0].classList;
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
            if (stylePoint.includes("font-style: italic;")) {
                var classPoint = $(".btnChuDam[name='font-style: italic;']")[0].classList;
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
            if (stylePoint.includes("text-decoration: underline;")) {
                var classPoint = $(".btnChuDam[name='text-decoration: underline;']")[0].classList;
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }

            if (stylePoint.includes("text-align: left;")) {
                var classPoint = $(".btnCanLe[name='text-align: left;']")[0].classList;
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
            if (stylePoint.includes("text-align: center;")) {
                var classPoint = $(".btnCanLe[name='text-align: center;']")[0].classList;
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
            if (stylePoint.includes("text-align: right;")) {
                var classPoint = $(".btnCanLe[name='text-align: right;']")[0].classList;
                classPoint.add("btn-primary");
                classPoint.remove("btn-default");
            }
            $("#txtPaddingLeft").val(this.style.marginLeft.replace("px", ""));
            $("#txtPaddingTop").val(this.style.marginTop.replace("px", ""));
            $("#txtFontSize").val(this.style.fontSize.replace("px", ""));
            $("#txtDoRong").val(this.style.width.replace("px", ""));
            $("#txtDinhDang").val($(this).attr("name"));
            $("#txtNoiDungPhoi").val(this.innerHTML);
        });
        $("#zoneMotherPhoi").click(function (e) {
            e.preventDefault();
            $(".phoi").each(function () {
                this.classList.remove("activeNoiDung");
            });
            $(".btnChuDam").each(function () {
                this.classList.remove("btn-primary");
                this.classList.add("btn-default");
            });
            pointElement = null;
            $("#txtPaddingLeft").val("");
            $("#txtPaddingTop").val("");
            $("#txtDinhDang").val("");
        });
        //Di chuyá»ƒn cÃ¡c pháº§n tá»­ trong phÃ´i
        $(document).keydown(function (e) {
            //e.preventDefault();
            if (pointElement == null || pointElement == undefined) return;
            switch (parseInt(e.which, 10)) {
                case 39: //Sang pháº£i
                    e.preventDefault();
                    var iChieuRong = parseInt(pointElement.style.marginLeft.replace("px", ""));
                    iChieuRong++;
                    //if (iChieuRong < 0) return;
                    pointElement.style.marginLeft = iChieuRong + "px";
                    $("#txtPaddingLeft").val(iChieuRong);
                    break;
                case 38: //LÃªn trÃªn
                    e.preventDefault();
                    var iChieuRong = parseInt(pointElement.style.marginTop.replace("px", ""));
                    iChieuRong--;
                    //if (iChieuRong < 0) return;
                    pointElement.style.marginTop = iChieuRong + "px";
                    $("#txtPaddingTop").val(iChieuRong);
                    break;
                case 37: //Sang trÃ¡i
                    e.preventDefault();
                    var iChieuRong = parseInt(pointElement.style.marginLeft.replace("px", ""));
                    iChieuRong--;
                    //if (iChieuRong < 0) return;
                    pointElement.style.marginLeft = iChieuRong + "px";
                    $("#txtPaddingLeft").val(iChieuRong);
                    break;
                case 40: //Xuá»‘ng dÆ°á»›i
                    e.preventDefault();
                    var iChieuRong = parseInt(pointElement.style.marginTop.replace("px", ""));
                    iChieuRong++;
                    //if (iChieuRong < 0) return;
                    pointElement.style.marginTop = iChieuRong + "px";
                    $("#txtPaddingTop").val(iChieuRong);
                    break;
            }
        });
        //Di chuyá»ƒn pháº§n tá»­ phÃ´i Ä‘ang chá»n
        $("#txtPaddingLeft").keyup(function (e) {
            e.preventDefault();
            if (pointElement == null || pointElement == undefined) return;
            pointElement.style.marginLeft = $("#txtPaddingLeft").val() + "px";
        });
        $("#txtPaddingTop").keyup(function (e) {
            e.preventDefault();
            if (pointElement == null || pointElement == undefined) return;
            pointElement.style.marginTop = $("#txtPaddingTop").val() + "px";
        });
        $("#txtFontSize").keyup(function (e) {
            e.preventDefault();
            if (pointElement == null || pointElement == undefined) return;
            var strFontSize = "";
            if ($("#txtFontSize").val() != "") strFontSize = $("#txtFontSize").val() + "px";
            pointElement.style.fontSize = strFontSize;
        });
        $("#txtDPI").keyup(function (e) {
            e.preventDefault();
            var strTyLe = $("#txtDPI").val() / 96;
            var dDoDai = me.dDoDai * strTyLe;
            var dDoRong = me.dDoRong * strTyLe;
            var point = $("#zoneMotherPhoi .pr-containt")[0];
            point.style.backgroundSize = dDoDai + "px";
            point.style.height = dDoRong + "px";

            var strPhanTram = $("#txtDPI").val() / 110;

            $("#txtChieuDaiKhoGiay").val((me.dDoDai * strPhanTram * 0.2645833333).toFixed(2));
            $("#txtChieuRongKhoGiay").val((me.dDoRong * strPhanTram * 0.2645833333).toFixed(2));
        });

        //$("#txtMarginTop").keyup(function (e) {
        //    e.preventDefault();
        //    var strMt = $("#txtMarginTop").val();
        //    $(".pr-containt").css({ paddingTop: strMt + "px" })
        //});
        //$("#txtMarginLeft").keyup(function (e) {
        //    e.preventDefault();
        //    var strMt = $("#txtMarginLeft").val();
        //    $(".pr-containt").css({ paddingLeft: strMt + "px" })
        //});
        $("#txtDoRong").keyup(function (e) {
            e.preventDefault();
            if (pointElement == null || pointElement == undefined) return;
            var strWidth = "";
            if ($("#txtDoRong").val() != "") strWidth = $("#txtDoRong").val() + "px";
            pointElement.style.width = strWidth;
        });
        $("#txtNoiDungPhoi").keyup(function (e) {
            e.preventDefault();
            if (pointElement) {
                pointElement.innerHTML = this.value;
            }
        });
        $("#btnSavePhoi").click(function (e) {
            e.preventDefault();
            console.log(me.strMauPhoiIn_Id);
            //XÃ³a háº¿t viá»n Ä‘á» rá»“i áº¥n lÆ°u
            me.save_MauPhoiIn();
            $(".phoi").each(function () {
                this.classList.remove("activeNoiDung");
                me.save_NoiDung(this);
            });
        });
        setTimeout(function () {
            edu.system.uploadAvatar(['txtAnhScan'], "");
        }, 200);
        $("#dropSearch_Phoi").on("select2:select", function () {
            if (!$("#dropSearch_Phoi").val() == "") {
                me.strMauPhoiIn_Id = $("#dropSearch_Phoi").val();
                var aData = edu.util.objGetDataInData($("#dropSearch_Phoi").val(), me.dtMauPhoiIn, "ID");
                console.log(aData);
                edu.util.viewValById("dropHoatDong", aData[0].HOATDONG_ID);
                edu.util.viewValById("txtTenBang", aData[0].TENPHOI);
                edu.util.viewValById("txtKhoangCach", aData[0].KHOGIAY);
                edu.util.viewValById("dropFontChu", aData[0].FONT);
                edu.util.viewValById("txtAnhScan", aData[0].DUONGDANFILE);
                edu.util.viewValById("txtCoChu", aData[0].DODAI? aData[0].DODAI : 20);
                edu.util.viewValById("txtDPI", aData[0].DORONG ? aData[0].DORONG : 96);
                edu.util.viewValById("txtMarginTop", aData[0].MARGIN_TOP);
                edu.util.viewValById("txtMarginLeft", aData[0].MARGIN_LEFT);
                me.genChonTrang(aData[0].SOTRANG, aData[0].DUONGDANFILE);
                me.getList_NoiDung();
            } else {
                me.strMauPhoiIn_Id = "";
            }
        });
        $("#btnDeleteNoiDung").click(function (e) {
            if (pointElement != null) {
                if (pointElement.id == "") {
                    console.log(pointElement.id);
                    $(pointElement).remove();
                } else {
                    edu.system.confirm('Bạn có chắc chắn muốn xóa không!', 'w');
                    $("#btnYes").click(function (e) {
                        me.delete_NoiDung(pointElement.id);
                        $(pointElement).remove();
                    });
                }
            }
        });
        $("#btnInPhoi").click(function (e) {
            e.preventDefault();
            //console.log($("#zoneMotherPhoi").html());
            me.printHTML("zoneMotherPhoi");
        });
        document.getElementById("txtDinhDang").addEventListener("blur", function () {
            if (pointElement != null) {
                $(pointElement).attr("name", $("#txtDinhDang").val());
                pointElement.style = $(pointElement).attr("style") + $("#txtDinhDang").val();
            }
            $("#txtDinhDang").val("");
        });
        //me.getList_HSSV();
        //me.makeQRCode("#" + zoneMauIn + " #" + aPhoi_ChiTiet.ID, aData.HODEM, 80, 80);
        $("#zoneCauHinh").delegate('.btnChuDam', 'click', function (e) {
            e.preventDefault();
            if (pointElement != null) {
                var classPoint = this.classList;
                var name = $(this).attr("name");
                if (classPoint.contains("btn-primary")) {
                    classPoint.remove("btn-primary");
                    classPoint.add("btn-default");
                    $(pointElement).attr("style", $(pointElement).attr("style").replace(name, ""));
                    //$(pointElement).attr("chudam", $(pointElement).attr("style").replace(name, "").replace($("#txtDinhDang").val()));
                } else {
                    classPoint.add("btn-primary");
                    classPoint.remove("btn-default");
                    $(pointElement).attr("style", $(pointElement).attr("style") + name);
                    //$(pointElement).attr("chudam", $(pointElement).attr("style").replace($("#txtDinhDang").val()) + name);
                }
                var strStyleChuDam = "";
                $(".btnChuDam").each(function (e) {
                    var arrClass = this.classList;
                    if (arrClass.contains("btn-primary")) strStyleChuDam += $(this).attr("name");
                })
                $(pointElement).attr("chudam", strStyleChuDam);
            }
            
        });
        $("#zoneCauHinh").delegate('.btnCanLe', 'click', function (e) {
            e.preventDefault();
            var strName = this.name;
            var strName2 = strName;
            if (strName == "text-align: center;") strName2 += ";border: solid 2px gray;"
            if (pointElement != null) {
                $(".btnCanLe").each(function () {
                    this.classList.remove("btn-primary");
                    this.classList.add("btn-default");
                });
                var classPoint = this.classList;
                var strStyle = $(pointElement).attr("style").replace(/text-align: left;|text-align: center;|text-align: right;/g, '');
                if (classPoint.contains("btn-primary")) {
                    classPoint.remove("btn-primary");
                    classPoint.add("btn-default");
                } else {
                    classPoint.add("btn-primary");
                    classPoint.remove("btn-default");
                }
                $(pointElement).attr("style", strStyle + strName2);
                $(pointElement).attr("canle", strName);
            }

        });
    },

    popup: function () {
        //show
        $('#myModal').modal('show');
        $("#btnNotifyModal").remove();
    },
    resetPopup: function () {
        var me = this;
        me.strMauPhoiIn_Id = "";
        edu.util.viewValById("txtMaMauIn", "");
        edu.util.viewValById("txtSoTrang", "1");
        edu.util.viewValById("txtAnhScan", "");
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_MauPhoiIn: function () {
        var me = this;
        var obj_notify = {};
        if (edu.util.getValById('txtSoTrang') == "") {
            obj_notify = {
                type: "w",
                content: "Số trang không được bỏ trống"
            };
            edu.system.alertOnModal(obj_notify);
            return;
        }
        //--Edit
        var obj_save = {
            'action': 'CMS_BaoCao_ThongTin_MH/FSkkLB4MIDQRKS4oCC8P',
            'func': 'pkg_baocao_thongtin.Them_MauPhoiIn',
            'iM': edu.system.iM,
            'strId': me.strMauPhoiIn_Id,
            'strMaPhoi': edu.util.getValById('txtMaMauIn'),
            'strTenPhoi': edu.util.getValById('txtTenBang'),
            'strKhogiay': edu.util.getValById('txtKhoangCach'),
            'strDoDai': edu.util.getValById('txtCoChu'),
            'strDoRong': edu.util.getValById('txtDPI'),
            'strFont': edu.util.getValById('dropFontChu'),
            'strSoTrang': edu.util.getValById('txtSoTrang'),
            'strDuongDanFile': me.getImage('txtAnhScan', edu.system.userId),
            'strMargin_Top': edu.util.getValById('txtMarginTop'),
            'strMargin_Left': edu.util.getValById('txtMarginLeft'),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            var aData = me.dtMauPhoiIn.find(e => e.ID === obj_save.strId);
            obj_save.strMaPhoi = aData.MAPHOI;
            obj_save.strSoTrang = aData.SOTRANG;
            obj_save.strDuongDanFile = aData.DUONGDANFILE;
            obj_save.action = 'CMS_BaoCao_ThongTin_MH/EjQgHgwgNBEpLigILwPP';
            obj_save.func = 'CMS_BaoCao_ThongTin_MH/Sua_MauPhoiIn';
        }
        //default
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (!edu.util.checkValue(obj_save.strId)) {
                        obj_notify = {
                            type: "s",
                            content: "Thêm mới thành công!"
                        };
                        edu.system.alertOnModal(obj_notify);
                        me.strMauPhoiIn_Id = data.Id;
                    }
                    else {
                        edu.system.alert("Cập nhật thành công!");
                    }

                    localStorage.setItem(edu.system.strChucNang_Id + "dropSearch_Phoi", data.Id);
                    me.getList_MauPhoiIn();
                }
                else {
                    obj_notify = {
                        type: "w",
                        content: obj_save.action + " (er): " + data.Message
                    };
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
    getList_MauPhoiIn: function () {
        var me = this;
        //--Edit
        //me.strMauPhoiIn_Id = "";
        var obj_list = {
            'action': 'CMS_MauPhoiIn/LayDanhSach',
            'strId': edu.util.getValById('txtAAAA')
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.dtMauPhoiIn = dtReRult;
                    me.genCombo_MauPhoiIn(dtReRult, data.Pager);
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
    delete_MauPhoiIn: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_MauPhoiIn/Xoa',

            'strId': Ids,
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
                edu.system.start_Progress("zoneprocessMauPhoiIn", function () {
                    me.getList_MauPhoiIn();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genCombo_MauPhoiIn: function (data) {
        var me = this;
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: "MAPHOI",
                //selectOne: true
            },
            renderPlace: ["dropSearch_Phoi"],
            title: "Chọn mẫu phôi" 
        };
        edu.system.loadToCombo_data(obj);
        if (me.strMauPhoiIn_Id) {
            var check = data.find(e => e.ID === me.strMauPhoiIn_Id);
            if (check) {
                $("#dropSearch_Phoi").val(me.strMauPhoiIn_Id).trigger("change");
            }
        }
    },
    genChonTrang: function (iSoTrang, strAnhNen) {
        var me = this;

        var zoneTool = "zoneTrang";
        var zoneMauIn = "zoneMotherPhoi";
        var strhead = '<style>.phoi{font-family:"' + $("#dropFontChu").val() + '";position:absolute;cursor: pointer; font-size: ' + $("#txtCoChu").val() + 'px}</style>';
        $("#" + zoneMauIn).html(strhead);
        //
        var arrTemp = [];
        if (strAnhNen != null && strAnhNen.indexOf("_") != -1) {
            arrTemp = strAnhNen.split("_");
            me.dDoDai = arrTemp[1];
            me.dDoRong = arrTemp[2];
            var strTyLe = $("#txtDPI").val() / 96;
            var dDoDai = arrTemp[1] * strTyLe;
            var dDoRong = arrTemp[2] * strTyLe;
            $("#txtChieuDaiKhoGiay").val((arrTemp[1] * 0.2645833333).toFixed(2));
            $("#txtChieuRongKhoGiay").val((arrTemp[2] * 0.2645833333).toFixed(2));

            for (var i = 0; i < iSoTrang; i++) {
                $("#" + zoneMauIn).append('<div style="background: url(' + edu.system.getRootPathImg(strAnhNen) + ');background-repeat: no-repeat; background-size: ' + dDoDai + 'px;height: ' + dDoRong +'px;" ><div class="pr-containt"></div></div>');
            }
        } else {

            for (var i = 0; i < iSoTrang; i++) {
                $("#" + zoneMauIn).append('<div><div class="pr-containt"></div></div>');
            }
        }

        var Lien = $("#" + zoneMauIn + " .pr-containt");
        if (Lien.length > 1) {
            var row = '<div id="zoneSelectedLien" class="compact-theme simple-pagination" style="float:left; width: 100%">';
            row += '<ul>';
            for (var i = 0; i < Lien.length; i++) {
                row += '<li>';
                row += '<a class="activeLien" name="' + i + '" style="cursor: pointer">' + (i + 1) + '</a>';
                row += '</li>';
            }
            row += '<li>';
            row += '<a class="activeLien" name="selectall" style="cursor: pointer">Tất cả</a>';
            row += '</li>';
            row += '</ul>';
            row += '</div>';
            $("#" + zoneTool).html(row);
            $("#zoneSelectedLien").delegate("li a", "click", function (e) {
                var point = this;
                var iVitri = $(point).attr("name");
                if (iVitri != "selectall") {
                    me.iLienSelect = iVitri;
                    for (var i = 0; i < Lien.length; i++) {
                        if (i == iVitri) {
                            Lien[i].style.display = "";
                            continue;
                        }
                        Lien[i].style.display = "none";
                    }
                    $("#" + zoneMauIn + " p[style='page-break-before: always;']").hide();
                }
                else {
                    me.iLienSelect = 0;
                    for (var i = 0; i < Lien.length; i++) {
                        Lien[i].style.display = "";
                    }
                    $("#" + zoneMauIn + " p[style='page-break-before: always;']").show();
                }
            });
        }
        else {
            //Cẩn thận nhé
            $("#" + zoneTool).parent().hide();
        }
    },
    /*------------------------------------------
    --Discription: [3] AccessDB HOC
    --ULR:  Modules
    -------------------------------------------*/
    save_NoiDung: function (point) {
        var me = this;
        var obj_notify = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_MauPhoiIn_ChiTiet/ThemMoi',

            'strId': point.id,
            'strNoiDung': point.innerHTML,
            'strLetrai': point.style.marginLeft.replace("px", ""),
            'strLephai': $(point).attr("chudam"),
            'strLeTren': point.style.marginTop.replace("px", ""),
            'strDinhDang': $(point).attr("name"),
            'strFontSize': point.style.fontSize.replace("px", ""),
            'strTrang': point.title,
            'strPhoi_MauPhoiIn_Id': edu.util.getValById('dropSearch_Phoi'),
            'strCanLe_Trai_Phai_Giua': $(point).attr("canle"),
            'strDoRongPhanTuCanLe': point.style.width.replace("px", ""),
        };
        if (edu.util.checkValue(obj_save.strId)) {
            obj_save.action = 'CMS_MauPhoiIn_ChiTiet/CapNhat';
        }
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

            contentType: true,
            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    getList_NoiDung: function () {
        var me = this;
        //--Edit
        //me.strMauPhoiIn_Id = "";
        var obj_list = {
            'action': 'CMS_MauPhoiIn_ChiTiet/LayDanhSach',
            'strId': edu.util.getValById('dropSearch_Phoi'),
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    me.genHtml_NoiDung(dtReRult, data.Pager);
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
    delete_NoiDung: function (Ids) {
        var me = this;
        //--Edit
        var obj_delete = {
            'action': 'CMS_MauPhoiIn_ChiTiet/Xoa',

            'strId': Ids,
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
                edu.system.start_Progress("zoneprocessMauPhoiIn", function () {
                    me.getList_MauPhoiIn();
                });
            },
            contentType: true,

            data: obj_delete,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    genHtml_NoiDung: function (data) {
        for (var i = 0; i < data.length; i++) {
            var strFontSize = "";
            var strClass = "";
            if (data[i].FONTSIZE) strFontSize = ' font-size: ' + data[i].FONTSIZE + 'px;'
            if (data[i].DORONGPHANTUCANLE) strFontSize += 'width: ' + data[i].DORONGPHANTUCANLE + 'px;';
            if (data[i].CANLE_TRAI_PHAI_GIUA == "text-align: center;") strFontSize += "border: solid 2px gray;";
            var html = '<span id="' + data[i].ID + '" class="phoi ' + strClass +'" style="margin-top: ' + data[i].LETREN + 'px; margin-left: ' + data[i].LETRAI + 'px; ' + strFontSize + ' ' + edu.util.returnEmpty(data[i].DINHDANG) + '; ' + edu.util.returnEmpty(data[i].LEPHAI) + edu.util.returnEmpty(data[i].CANLE_TRAI_PHAI_GIUA) + '" title="' + data[i].TRANG + '" name="' + edu.util.returnEmpty(data[i].DINHDANG) + '" chudam="' + edu.util.returnEmpty(data[i].LEPHAI) + '" canle="' + edu.util.returnEmpty(data[i].CANLE_TRAI_PHAI_GIUA) +'">' + data[i].NOIDUNG + '</span>';
            $("#zoneMotherPhoi .pr-containt:eq(" + edu.util.returnZero(data[i].TRANG) + ")").append(html);
        }
    },
    getList_HSSV: function () {
        var me = this;

        //--Edit
        var obj_list = {
            'action': 'SV_HoSo/LayDanhSach',
            'versionAPI': 'v1.0',

            'strTuKhoa': edu.util.getValById("txtSearchDSSV_TuKhoa"),
            'strHeDaoTao_Id': edu.util.getValById("dropSearch_HeDaoTao"),
            'strKhoaDaoTao_Id': edu.util.getValById("dropSearch_KhoaDaoTao"),
            'strChuongTrinh_Id': edu.util.getValById("dropSearch_ChuongTrinhDaoTao"),
            'strLopQuanLy_Id': edu.util.getValById("dropSearch_LopQuanLy"),
            'strNguoiThucHien_Id': "",
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
                    me.dt_HS = dtResult;
                    me.getList_NoiDungTheoMa("TEST_MAUIN", "zoneMotherPhoi", dtResult);
                }
                else {
                    edu.system.alert("Lỗi: " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert("Lỗi (er): " + JSON.stringify(er), "w");
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
    --Discription: [3] tes
    --ULR:  Modules
    -------------------------------------------*/
    getList_NoiDungTheoMa: function (strMa, zoneMauIn, dataIn, callback) {
        var me = this;
        var obj_list = {
            'action': 'CMS_MauPhoiIn_ChiTiet/LayDanhSach',
            'strId': strMa,
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        var iMaxTrang = 0;
                        for (var i = 0; i < dtReRult.length; i++) {
                            if (dtReRult[i].TRANG > iMaxTrang) iMaxTrang = dtReRult[i].TRANG;
                        }
                        var strhead = '<style>.phoi{font-family:"' + dtReRult[0].FONT + '";position:absolute}</style>';
                        $("#" + zoneMauIn).html(strhead);
                        for (var i = 0; i < iMaxTrang + 1; i++) {
                            $("#" + zoneMauIn).append('<div class="pr-containt"></div>');
                            if (i < iMaxTrang) $("#" + zoneMauIn).append('<p style="page-break-before: always;">&nbsp;</p>');
                        }
                        for (var i = 0; i < dtReRult.length; i++) {
                            var html = '<span id="' + dtReRult[i].ID + '" class="phoi" style="margin-top: ' + dtReRult[i].LETREN + 'px; margin-left: ' + dtReRult[i].LETRAI + 'px; ' + edu.util.returnEmpty(dtReRult[i].DINHDANG) + '; '+ edu.util.returnEmpty(dtReRult[i].LEPHAI) + '"></span>';
                            $("#" + zoneMauIn + " .pr-containt:eq(" + edu.util.returnZero(dtReRult[i].TRANG) + ")").append(html);

                        }
                        if (typeof callback === "function") {
                            callback(dtReRult);
                        } else {
                            me.genData_Phoi(zoneMauIn, dataIn, dtReRult);
                        }
                    }
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
    genData_Phoi: function (zoneMauIn, dataIn, dataPhoi) {
        var me = this;
        var pointMauIn = $("#" + zoneMauIn);
        var htmlPhoi = pointMauIn.html();
        pointMauIn.html("");
        for (var i = 0; i < dataIn.length; i++) {
            pointMauIn.append('<div id="zoneIn' + dataIn[i].ID + '" class="zoneCon">' + htmlPhoi + '</div>');
            if (i < dataIn.length -1) $("#" + zoneMauIn).append('<p style="page-break-before: always;">&nbsp;</p>');
        }
        setTimeout(function () {
            for (var i = 0; i < dataIn.length; i++) {
                me.genData_ChiTiet("zoneIn" + dataIn[i].ID, dataIn[i], dataPhoi);
            }
        }, 1000);
        
    },
    genData_ChiTiet: function (zoneMauIn, aData, dataPhoi) {
        var me = this;
        var khoangcach = 30;
        if (dataPhoi.length > 0 && dataPhoi[0].KHOGIAY != null) khoangcach = dataPhoi[0].KHOGIAY;
        var arrCotBang = [];
        for (var i = 0; i < dataPhoi.length; i++) {
            var aPhoi_ChiTiet = dataPhoi[i];
            if (aPhoi_ChiTiet.NOIDUNG.includes("[x].")) {
                arrCotBang.push(aPhoi_ChiTiet);
                continue;
            }
            var strData = "";
            try {
                strData = eval(aPhoi_ChiTiet.NOIDUNG);
            } catch(ex) {
                strData = undefined;
            }
            if (strData !== null && strData !== undefined && strData !== "") {
                $("#" + zoneMauIn + " #" + aPhoi_ChiTiet.ID).html(strData);
            }
        }
        for (var i = 0; i < arrCotBang.length; i++) {
            var strNoiDung = arrCotBang[i].NOIDUNG;
            var tenCotBang = strNoiDung.substring(0, strNoiDung.indexOf("[x]."));
            if (tenCotBang.includes(" ") != -1) tenCotBang = tenCotBang.substring(strNoiDung.indexOf("[x].") + 1);
            var pointClone = $("#" + zoneMauIn + " #" + arrCotBang[j].ID).clone();
            var dosau = point.style.marginTop.replace("px", "");
            for (var j = 0; j < aData[tenCotBang].length; j++) {
                pointClone.css({
                    marginTop: dosau + (i * khoangcach) + "px"
                });
                try {
                    pointClone.html(eval(arrCotBang[j].NOIDUNG.replace(/[x]./g, '[' + j + '].')));
                    $("#" + zoneMauIn).append(pointClone);
                } catch (ex) {
                    console.log(ex);
                }
                
            }
        }
        //if (arrCotBang.length > 0) {
        //    for (var i = 0; i < aData[dulieu].length; i++) {
        //        for (var j = 0; j < arrCotBang.length; j++) {
        //            try {
        //                strData = eval(arrCotBang[j].NOIDUNG.replace(/[x]./g, '[' + i + '].'));
        //            } catch (ex) {
        //                strData = undefined;
        //            }
        //            if (strData !== null && strData !== undefined && strData !== "") {
        //                $("#" + zoneMauIn + " #" + arrCotBang[j].ID).html(strData);
        //            }
        //        }
        //    }
        //}
    },
    makeQRCode: function (zone, qrcode, width, height) {
        try {
            var point = $(zone);
            if (point.length > 0) {
                for (var i = 0; i < point.length; i++) {
                    var qrcodeA = new QRCode(point[i], {
                        width: width,
                        height: height
                    });
                    qrcodeA.makeCode(qrcode);
                }
            }
        } catch (ex) {
            console.log(ex);
            console.log("ERR QR:" + zone);
        }
        
    },
    makePicture: function (zone, strAnh, width, height) {
        $(zone).html('<img src="' + edu.system.getRootPathImg(strAnh) + '" style="width: ' + (width / 2.54 * 96) + 'px; height: ' + (height / 2.54 * 96) +'px">');
    },
    printHTML: function (divId) {
        ////Get the HTML of div
        //var divElements = document.getElementById(divId).innerHTML;
        ////Get the HTML of whole page
        //var oldPage = document.body.innerHTML;

        ////Reset the page's HTML with div's HTML only
        //document.body.innerHTML = "<html><head><title></title></head><body>" + divElements + "</body>";
        ////Print Page
        //window.print();

        ////Restore orignal HTML
        //document.body.innerHTML = oldPage;

        //the second print
        var content = document.getElementById(divId).innerHTML;
        var mywindow = window.open('', '', 'height=600,width=800,status=0');

        mywindow.document.write('<html><head><title>Print</title><style>@media print{@page{margin:0}body{margin:0.0cm}}</style></head><body>' + content + '</body></html>');

        mywindow.document.close();
        mywindow.focus();
        mywindow.print();
        //mywindow.close();//chrome bị lỗi phải comment lại
        setTimeout(function () {
            mywindow.close();//chrome bị lỗi phải comment lại
        }, 2000);
        return true;
    },

    /*------------------------------------------
    --Discription: [3] tes
    --ULR:  Modules
    -------------------------------------------*/
    getImage: function (strZoneUpload_Id, strId) {
        var me = this;
        var sourceFile = edu.util.getValById(strZoneUpload_Id);
        if (sourceFile.includes("unsave_")) {
            strId = me.getDimensions(sourceFile, strId);
            return me.copyFile(sourceFile, strId);
        }
        return sourceFile;
    },
    copyFile: function (sourceFile, strId) {
        var me = this;
        var result = "";
        var x = $.ajax({
            url: edu.system.rootPathUpload + '/Handler/copyfile.ashx?sourceFile=' + sourceFile + '&strId=' + strId+"&userId=" + edu.system.userId,
            method: 'post',
            async: false,
            success: function (data) {
                if (data.indexOf("Sys_error") != 0) {
                    result = data;
                }
                else {
                    console.log(data);
                    result = sourceFile;
                }
            }
        });
        return result;
    },
    getDimensions: function (sourceFile, strId) {
        var me = this;
        var result = "";
        var x = $.ajax({
            url: edu.system.rootPathUpload + '/Handler/getDimensions.ashx?strFileName=' + sourceFile,
            method: 'post',
            async: false,
            success: function (data) {
                if (data.indexOf("Sys_error") != 0) {
                    result = strId + "_" + data;
                }
                else {
                    console.log(data);
                    result = sourceFile;
                }
            }
        });
        return result;
    },

};