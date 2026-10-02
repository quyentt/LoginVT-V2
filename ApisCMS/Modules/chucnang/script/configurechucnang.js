/*----------------------------------------------
--Author: 
--Phone: 
--Date of created:
----------------------------------------------*/
function ConfigureChucNang() { }
ConfigureChucNang.prototype = {
    strCauHinhChucNang_Id:'',
    pointTemp: null,
    dtFunction: [],
    dtThamSo: [],
    objDS: [],
    objSave: [],
    dtTable: {},
    dtColumnOfTable: [],
    init: function () {
        var me = this;
        //var x = "0123456789";
        //console.log(x.substring(0, 3));
        //console.log(x.substring(3));
        me.getList_SQL_Drop("dropFunction", "SELECT * FROM Chung_API_Function", "MA", function (data) {
            main_doc.ConfigureChucNang.dtFunction = data;
        });
        me.getList_SQL_Drop("", "SELECT * FROM CHUNG_API_THAMSOFORCREATE", "", function (data) {
            main_doc.ConfigureChucNang.dtThamSo = data;
        });
        me.getList_SQL_Drop("", "SELECT * FROM CHUNG_COLUMNOFTABLE", "", function (data) {
            main_doc.ConfigureChucNang.dtColumnOfTable = data;
        });
        var x = localStorage.getItem("configChucNang");
        if (edu.util.checkValue(x)) {
            console.log(x.length);
            me.objConfigure = JSON.parse(x);
            console.log(me.objConfigure);
            //me.genhtml(me.objConfigure, "code_html");
            //me.genJS(me.objConfigure, "code_script");
        }
        me.creatHtml();
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        $(document).delegate('.item-search', 'click', function (e) {
            //reset
            edu.util.viewValById("txtFunction", "");
            edu.util.viewValById("dropFunction", "");
            edu.util.viewValById("txtConnect", "");
            edu.util.viewValById("txtMimiRender", "");
            edu.util.viewValById("txtLisaRender", "");
            edu.util.viewValById("dropCotDuLieu", "");
            edu.util.viewValById("txtTenHienThi", "");
            edu.util.viewValById("txtCotSuDung", "");
            //
            if (event.ctrlKey) {
                $(".idhienthi").html(this.title);
                if ($(this).find("input").length > 0) {
                    var point = $(this).find("input")[0];
                    me.pointTemp = point;
                    $('#' + $(this).attr("name")).modal('show');
                    if (point.classList.contains("input-datepicker")) {
                        $("#bCheckDate").attr('checked', true);
                        $("#bCheckDate").prop('checked', true);
                    } else {
                        $("#bCheckDate").attr('checked', false);
                        $("#bCheckDate").prop('checked', false);
                    }
                    $("#txtPlaceholder").val(point.placeholder);
                }
                else {
                    var point = $(this).find("select")[0];
                    me.pointTemp = point;
                    $('#' + $(this).attr("name")).modal('show');
                    edu.util.viewValById("txtFunction", $(this).attr("sudung"));
                    edu.util.viewValById("txtTenHienThi", $(point).attr("placeholder"));
                }
            }
        });

        $(document).delegate('.item-save', 'click', function (e) {
            //reset
            edu.util.viewValById("txtFunction", "");
            edu.util.viewValById("dropFunction", "");
            edu.util.viewValById("txtConnect", "");
            edu.util.viewValById("txtMimiRender", "");
            edu.util.viewValById("txtLisaRender", "");
            edu.util.viewValById("dropCotDuLieu", "");
            edu.util.viewValById("txtTenHienThi", "");
            edu.util.viewValById("txtCotSuDung", "");
            //
            if (event.ctrlKey) {
                $(".idhienthi").html(this.title);
                if ($(this).find("input").length > 0) {
                    var point = $(this).find("input")[1];
                    console.log(point);
                    me.pointTemp = point;
                    $('#' + $(this).attr("name")).modal('show');
                    if (point.classList.contains("input-datepicker")) {
                        $("#bCheckDate").attr('checked', true);
                        $("#bCheckDate").prop('checked', true);
                    } else {
                        $("#bCheckDate").attr('checked', false);
                        $("#bCheckDate").prop('checked', false);
                    }
                    $("#txtPlaceholder").val(point.placeholder);
                }
                else {
                    var point = $(this).find("select")[0];
                    me.pointTemp = point;
                    $('#' + $(this).attr("name")).modal('show');
                    edu.util.viewValById("txtFunction", $(this).attr("sudung"));
                    edu.util.viewValById("txtTenHienThi", $(point).attr("placeholder"));
                }
            }
        });
        $("#btnSave_Input").click(function (e) {
            var strLoai = "INPUT";
            var strThamSo = me.pointTemp.parentNode.title;
            me.pointTemp.placeholder = $("#txtPlaceholder").val();
            if ($("#bCheckDate").is(":checked")) {
                me.pointTemp.classList.add("input-datepicker");
                strLoai = "INPUT_DATE";
            }
            var strTenHienThi = $("#txtPlaceholder").val();
            $(me.pointTemp.parentNode).attr("loai", strLoai);
            me.save_Api_ThamSo(strThamSo, "", "", strTenHienThi, strLoai);
        });
        $("#btnDelete_Input,#btnDelete_Select").click(function (e) {
            me.pointTemp.parentNode.remove();
        });
        //
        $("#dropFunction").on("select2:select", function () {
            var data = edu.util.objGetOneDataInData($(this).val(), me.dtFunction, "ID");
            $("#txtFunction").val(data.MA);
            $("#txtTenHienThi").val(data.TEN);
            $("#txtConnect").val(data.DULIEUMACDINH);
            $("#txtMimiRender").val(data.MIMIRENDER);
            $("#txtLisaRender").val(data.LISARENDER);
            edu.util.viewValById("dropFunctionType", data.LOAI);
            me.getList_CotDuLieu();
        });
        $("#dropCotDuLieu").on("select2:select", function () {
            $("#txtCotSuDung").val($("#dropCotDuLieu").val());
        });
        $("#btnSave_Select").click(function (e) {
            var strHam = $("#txtFunction").val();
            var strLoai = "";
            var strDuLieuMacDinh = "";
            if (strHam == "DATA") {
                strDuLieuMacDinh = $("#txtCotSuDung").val();
                me.save_Api_ThamSo(me.pointTemp.parentNode.title, $("#txtFunction").val(), strDuLieuMacDinh, "", "DATA");
                return;
            }
            if (strHam.substring(0, 4) === 'edu.') {
                strLoai = "FUNCTION";
            } else {
                if (strHam.includes(".")) {
                    $(me.pointTemp.parentNode).attr("sudung", strHam);
                    strLoai = "DANHMUC";
                    eval('edu.system.loadToCombo_DanhMucDuLieu("' + strHam + '", "' + me.pointTemp.id + '")');
                } else {
                    var objlist = $("#txtConnect").val();
                    var type = $("#dropFunctionType").val();
                    if (objlist == "") {
                        var data = edu.util.objGetOneDataInData($(this).val(), me.dtFunction, "ID");
                        objlist = data.DULIEUMACDINH;
                        type = data.LOAI;
                    }
                    me.callAPI(JSON.parse(objlist), type, function (data) {
                        var mRender = $("#txtMimiRender").val();
                        var Render = $("#txtLisaRender").val();
                        if (mRender != "") mRender = eval(mRender);
                        else mRender = undefined;
                        if (Render != "") Render = eval(Render);
                        else Render = undefined;
                        var obj = {
                            data: data,
                            renderInfor: {
                                id: "ID",
                                parentId: "",
                                name: $("#txtCotSuDung").val(),
                                code: "MA",
                                mRender: mRender,
                                Render: Render
                            },
                            renderPlace: [main_doc.ConfigureChucNang.pointTemp.id],
                            type: "",
                            title: $("#txtTenHienThi").val()
                        };
                        edu.system.loadToCombo_data(obj);
                    });
                    $(me.pointTemp.parentNode).attr("sudung", $("#txtFunction").val());
                    strLoai = "PROCEDURE";
                }
            }
            $(me.pointTemp.parentNode).attr("loai", strLoai);
            $(me.pointTemp).attr("placeholder", $("#txtTenHienThi").val());
            me.save_Api_ThamSo(me.pointTemp.parentNode.title, $("#txtFunction").val(), strDuLieuMacDinh, $("#txtTenHienThi").val(), strLoai);
        });
        $(".btnExtend_Search").click(function () {
            edu.util.toggle("box-sub-search");
        });

        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        $("#btnClearDiv").click(function () {
            $($("#zone_search .item-search")[$("#txtClearDiv").val() -1]).after('<div class="clear"></div>');
        });
        $("#btnClearDivMinus").click(function () {
            $("#zone_search .bss-item div[class='clear']").remove();
        });
        $("#btnViewCode").click(function () {
            me.genhtml(me.objConfigure, "code_html");
            me.genJS(me.objConfigure, "code_script");
        });

        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        $("#btnSearch").click(function () {
            me.getList_Data();
        });

        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        $("#btnSave_" + me.objConfigure.MaChucNang).click(function () {
            //me.getList_SQL_Drop("", "SELECT * FROM CHUNG_API_THAMSOFORCREATE", "", function (data) {
            //    main_doc.ConfigureChucNang.dtThamSo = data;
            //});
            var obj_list = {
                action: me.objConfigure.Controller.name + "/" + me.objSave.name
            };
            for (var i = 0; i < me.objSave.params.length; i++) {
                var strTemp = me.objSave.params[i];
                var obj = edu.util.objGetOneDataInData(strTemp, me.dtThamSo, "THAMSO");
                switch (obj.LOAI) {
                    case "DATA":
                        var datatemp = obj.DULIEUMACDINH;
                        if (datatemp !== null && datatemp.length > 4 && datatemp.substring(0, 4) == 'edu.') datatemp = eval(datatemp);
                        obj_list[strTemp] = edu.util.returnEmpty(datatemp); break;
                    case "INPUT":
                    case "INPUT_DATE": obj_list[strTemp] = edu.util.getValById("txt" + strTemp); break;
                    case "FUNCTION":
                    case "PROCEDURE":
                    case "DANHMUC": obj_list[strTemp] = edu.util.getValById("drop" + strTemp); break;
                }

            }
            me.callAPI(obj_list, me.objSave.type, function (data) {
                console.log(data);
            });
            $(".columninput").each(function (){
                var strThamSo = this.id.substring(10);
                var strColumn = $(this).val();
                if (strColumn != "") {
                    me.save_Api_ThamSoForUpdate(strThamSo, strColumn);
                }
                var pointParent = $(this.parentNode.parentNode);
                //console.log($(pointParent).attr("sudung"));
                me.save_Api_ThamSo(strThamSo, pointParent.attr("sudung"), "", $("#txtName_" + strThamSo).val(), pointParent.attr("loai"));
            });
        });
        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        $("#dsColumn").delegate(".ckbDSColumnOfTable", "click", function (e) {
            e.stopImmediatePropagation();
            me.genColumnOfTable(this.id, edu.util.objGetOneDataInData(this.id, me.dtColumnOfTable, "MA"));
        });

        $("#tblColumnOfTable").delegate(".deleteRowButton", "click", function () {
            var strRowId = this.id;
            $("#tblColumnOfTable tr[id='" + strRowId + "']").remove();
        });
        $("#btnSave_ColumnOfTable").click(function () {
            var jsonForm = {
                strTable_Id: "tbl" + me.objConfigure.MaChucNang,
                colPos: {
                    center: [0],
                    right: []
                },
                aaData: me.dtTable,
                aoColumns: []
            };
            var thead = '<tr><th class="td-center td-fixed">STT</th>';
            var x = $("#tblColumnOfTable tbody tr");
            for (var i = 0; i < x.length; i++) {
                var strStt = x[i].cells[0].getElementsByTagName('input')[0].value;
                var strTenCot = x[i].cells[1].getElementsByTagName('input')[0].value;
                var strMaCot = x[i].cells[2].innerHTML;
                var strCanLe = x[i].cells[3].getElementsByTagName('input')[0].value;
                var strMimiRender = x[i].cells[4].getElementsByTagName('input')[0].value;
                var objTable = {
                    strStt: strStt,
                    strTenCot: strTenCot,
                    strMaCot: strMaCot,
                    strCanLe: strCanLe,
                    strMimiRender: strMimiRender
                };
                me.checkConfig_Table(objTable);
                me.save_ColumnOfTable(strMaCot, strTenCot, strStt, strCanLe, strMimiRender);
                if (strCanLe != "") {
                    jsonForm.colPos[strCanLe].push(i + 1);
                }
                if (strMaCot == "XOA") {
                    thead += '<th class="td-center td-fixed">' + strTenCot + '</th>';
                    jsonForm.aoColumns.push({
                        "mRender": function (nRow, aData) {
                            return '<input type="checkbox" id="checkX' + aData.ID + '" class="CheckOne" />';
                        }
                    });
                    continue;
                }
                if (strMaCot == "SUA") {
                    thead += '<th class="td-center td-fixed">' + x[i].cells[1].getElementsByTagName('input')[0].value + '</th>';
                    jsonForm.aoColumns.push({
                        "mRender": function (nRow, aData) {
                            return '<span><a class="btn btn-default btnEdit" id="' + aData.ID + '" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>';
                        }
                    });
                    continue;
                }
                thead += '<th class="td-center">' + strTenCot + '</th>';
                if (strMimiRender == "") {
                    jsonForm.aoColumns.push({
                        "mDataProp": strMaCot
                    });
                } else {
                    jsonForm.aoColumns.push({
                        "mRender": eval(strMimiRender)
                    });
                }
            }
            thead += '</tr>';
            $("#tbl" + me.objConfigure.MaChucNang + " thead").html(thead);
            edu.util.toggle_overide("zone-bus", "zoneContent");
            
            edu.system.loadToTable_data(jsonForm);
        });
        $(".btnClose").click(function () {
            edu.util.toggle_overide("zone-bus", "zoneContent");
        });

        $("#viewConfig").click(function () {
            var x = $("#zone_search .bss-item div");
            me.objConfigure.view.SearchClearDiv = [];
            var idiscount = 0;
            for (var i = 0; i < x.length; i++) {
                if (x[i].classList.contains("clear")) {
                    me.objConfigure.view.SearchClearDiv.push(i - idiscount);
                }
                else {
                    if (x[i].style.display == "none") idiscount++;
                }
            }
            console.log(me.objConfigure);
            var config = JSON.stringify(me.objConfigure);
            edu.system.alert(config);
            localStorage.setItem("configChucNang", config);
        });

        /*------------------------------------------
        --Discription: Initial
        -------------------------------------------*/
        $("#btnSave_CauHinh").click(function () {
            var strId = me.strCauHinhChucNang_Id;
            if (strId == "") strId = edu.util.uuid();
            var strMaChucNang = $("#txtMaChucNang").val();
            var strTenChucNang = $("#txtTenChucNang").val();
            var arrConfig = [];
            var config = $("#txtConfigChucNang").val();
            console.log(config.length);
            if (config.length < 3500) {
                arrConfig = [config];
            } else {
                while (config.length > 3500) {
                    arrConfig.push(config.substring(0, 3500));
                    config = config.substring(3500);
                }
            }
            
            for (var i = 0; i < arrConfig.length; i++) {
                console.log(arrConfig[i]);
                me.save_CauHinhChucNang(strId, strMaChucNang, strTenChucNang, i, arrConfig[i]);
            }
        });
        $("#btnAddConfig").click(function () {
            $("#myModalCauHinh").modal("show");
            $("#txtMaChucNang").val("");
            $("#txtTenChucNang").val("");
            $("#txtConfigChucNang").val("");
            edu.util.viewValById("dropFileConfig", "");
            me.strCauHinhChucNang_Id = "";
        });
    },
    /*----------------------------------------------
    --Discription: [0] Common
    --API:  
    ----------------------------------------------*/
    creatHtml: function () {
        var me = this;
        var arrDanhMuc = [];
        var arrProcedure = [];
        var listDS = {};
        var listSave = {};
        var idem = 0;
        for (var i = 0; i < me.objConfigure.Controller.lApi.length; i++) {
            if (me.objConfigure.Controller.lApi[i].name == "LayDanhSach") {
                listDS = me.objConfigure.Controller.lApi[i].params;
                me.objDS = me.objConfigure.Controller.lApi[i];
                continue;
            }
            if (me.objConfigure.Controller.lApi[i].name == "ThemMoi") {
                listSave = me.objConfigure.Controller.lApi[i].params;
                me.objSave = me.objConfigure.Controller.lApi[i];
                continue;
            }
        }
        var html = '';
        html += '<div class="row">';
        html += '<!-- /.left-content -->';
        html += '<!-- /.right-content -->';
        html += '<div class="col-lg-12">';
        html += '<!--box Notify_VBSC-->';
        html += '<div class="box box-solid" id="zone_search">';
        html += '<div class="box box-solid">';
        html += '<div class="box-header with-border">';
        html += '<h3 class="box-title"><i class="fa fa-window-restore"></i> Tìm kiếm</h3>';
        html += '</div>';
        html += '<div class="box-body">';
        html += '<div class="bss-item">';
        //me.objConfigure.view.Search = [];
        //me.objConfigure.view.Save = [];
        me.objConfigure.view.Table = [];
        for (var i = 0; i < listDS.length; i++) {
            var strTemp = listDS[i];
            var title = strTemp;
            var strClass = "";
            var strSuDung = "";
            var strDuLieuMacDinh = "";
            var hidden = false;
            var obj = me.checkConfig_Search(strTemp);// edu.util.objGetOneDataInData(strTemp, me.dtThamSo, "THAMSO");
            if (obj.length != 0) {
                title = obj.TenHienThi;
                strSuDung = obj.Ham_Ma;
                strDuLieuMacDinh = obj.DuLieuMacDinh;
                switch (obj.Loai) {
                    case "INPUT_DATE": strClass = "input-datepicker"; break;
                    case "DATA": hidden = 'style="display: none"'; idem--;break;
                    case "DANHMUC": arrDanhMuc.push('edu.system.loadToCombo_DanhMucDuLieu("' + strSuDung + '", "dropSearch_' + strTemp + '")'); break;
                    case "PROCEDURE": arrProcedure.push({ strHam: strSuDung, strDrop_Id: "dropSearch_" + strTemp}); break;
                }
            }
            if ((strTemp.substring(strTemp.length - 3) === "_Id" || strTemp.substring(strTemp.length - 3) === "Ids") && !hidden) {
                html += '<div class="col-sm-3 item-search" name="myModalSelect" title="' + strTemp + '" sudung="' + strSuDung + '" loai="' + obj.Loai +'">';
                html += '<select id="dropSearch_' + strTemp + '" class="select-opt" placeholder="' + title +'"></select>';
                html += '</div>';
            } else {

                html += '<div class="col-sm-3 item-search" name="myModalInput"  title="' + strTemp + '" loai="' + obj.Loai + '" ' + hidden + ' dulieu="' + strDuLieuMacDinh +'">';
                html += '<input id="txtSearch_' + strTemp + '" class="form-control ' + strClass + '" placeholder="' + title +'" />';
                html += '</div>';
            }
            idem++;
        }
        html += '<div class="col-sm-3 item-search">';
        html += '<a class="btn btn-primary" id="btnSearch"><i class="fa fa-search"></i> <span class="lang" key="">Tìm kiếm</span></a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="box box-solid">';
        html += '<div class="box-header with-border">';
        html += '<h3 class="box-title">';
        html += '<i class="fa fa-list-alt"></i> Danh sách';
        html += '<span class="badge bg-light-blue">';
        html += '<span id="lbl' + me.objConfigure.MaChucNang + '_Tong"></span>';
        html += '</span>';
        html += '</h3>';

        html += '<div class="pull-right">';
        html += '<div>';
        html += '<a class="btn btn-primary btnAdd" href="#"><i class="fa fa-plus"></i> Thêm mới</a>';
        html += '<a id="btnXoa' + me.objConfigure.MaChucNang + '" class="btn btn-default"><i class="fa fa-trash"></i> Xóa</a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="box-body">';
        html += '<div class="row">';
        html += '<div class="col-sm-12">';
        html += '<div class="col-sm-12 scroll-table-x">';
        html += '<table id="tbl' + me.objConfigure.MaChucNang + '" class="table table-hover table-bordered">';
        html += '<thead></thead>';
        html += '<tbody></tbody>';
        html += '<tfoot></tfoot>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<div class="box box-solid">';
        html += '<divclass="box-body">';
        html += '<div class="modal-dialog" style="width: 70%">';
        html += '<div class="modal-content">';
        html += '<div class="modal-header">';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        html += '<h3 class="box-title"><span class="myModalLabel"> <i class="fa fa-pencil"></i></span> ' + me.objConfigure.TenChucNang + '</h3>';
        html += '</div>';
        html += '<div class="modal-body" id="modal_body">';
        html += '<div class="row zone-box">';
        idem = 0;
        for (var i = 0; i < listSave.length; i++) {
            if (listSave[i] == "strId") continue;
            strTemp = listSave[i];
            title = strTemp;
            strClass = "";
            strSuDung = "";
            obj = me.checkConfig_Save(strTemp); //edu.util.objGetOneDataInData(strTemp, me.dtThamSo, "THAMSO");
            if (obj.length != 0) {
                title = obj.TenHienThi;
                strSuDung = obj.Ham_Ma;
                switch (obj.Loai) {
                    case "INPUT_DATE": strClass = "input-datepicker"; break;
                    case "DATA": continue;
                    case "DANHMUC": arrDanhMuc.push('edu.system.loadToCombo_DanhMucDuLieu("' + strSuDung + '", "drop' + strTemp + '", "", function(data) { if (data.length > 0) $("#txtName_' + strTemp +'").val(data[0].CHUNG_TENDANHMUC_TEN) })'); break;
                    case "PROCEDURE": arrProcedure.push({ strHam: strSuDung, strDrop_Id: "drop" + strTemp }); break;
                }
            }
            if (strTemp.substring(strTemp.length - 3) === "_Id" || strTemp.substring(strTemp.length - 3) === "Ids") {
                html += '<!--row ' + ++idem + '-->';
                html += '<div class="row item-save" name="myModalSelect" title="' + strTemp + '" sudung="' + strSuDung + '" loai="' + obj.Loai +'">';
                html += '<div class="col-sm-3">';
                html += '<input type="text" id="txtName_' + strTemp + '" value="' + title +'" class="form-control" />';
                html += '</div>';
                html += '<div class="col-sm-5"  title="' + strTemp + '">';
                html += '<select id="drop' + strTemp +'" class="select-opt"></select>';
                html += '</div>';
                html += '<div class="col-sm-4"  title="' + strTemp + '">';
                html += '<select id="dropColumn' + strTemp + '" class="select-opt columninput"></select>';
                html += '</div>';
                html += '<div class="clear"></div>';
                html += '</div>';
            } else {
                html += '<!--row ' + ++idem + '-->';
                html += '<div class="row item-save" name="myModalInput" title="' + strTemp + '" sudung="' + strSuDung + '" loai="' + obj.Loai +'">';
                html += '<div class="col-sm-3">';
                html += '<input type="text" id="txtName_' + strTemp + '" value="' + title + '" class="form-control" />';
                html += '</div>';
                html += '<div class="col-sm-5"  title="' + strTemp + '">';
                html += '<input type="text" id="txt' + strTemp + '" class="form-control ' + strClass + '"  placeholder="' + title +'"/>';
                html += '</div>';
                html += '<div class="col-sm-4"  title="' + strTemp + '">';
                html += '<select id="dropColumn' + strTemp + '" class="select-opt columninput"></select>';
                html += '</div>';
                html += '<div class="clear"></div>';
                html += '</div>';
            }
        }
        html += '</div>';
        html += '</div>';
        html += '<div class="clear"></div>';
        html += '<div id="notify"></div>';
        html += '<div class="modal-footer">';
        html += '<a class="submit btn btn-danger btnOpenDelete" id="btnDelete_HeSoChucDanh" style="display: none"><i class="fa fa-trash"></i> <span class="lang" key="">Xóa</span></a>';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle-o"></i> <span class="lang" key="">Đóng</span></button>';
        html += '<a class="submit btn btn-primary" id="btnSave_HeSoChucDanh"><i class="fa fa-check-circle"></i><span class="lang" key=""> Lưu</span></a>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("#azzsectionhtml").html(html);
        $(".select-opt").select2();
        for (var i = 0; i < arrDanhMuc.length; i++) {
            eval(arrDanhMuc[i]);
        }
        me.getList_Data();
        for (var i = 0; i < me.objConfigure.view.SearchClearDiv.length; i++) {
            $($("#zone_search .item-search")[me.objConfigure.view.SearchClearDiv[i]]).after('<div class="clear"></div>');
        }
    },
    getList_Data: function() {
        var me = this;
        var obj_list = {
            action: me.objConfigure.Controller.name + "/" + me.objDS.name
        };
        for (var i = 0; i < me.objDS.params.length; i++) {
            var strTemp = me.objDS.params[i];
            var point = $(".item-search[title='" + strTemp + "']");
            var strLoai = point.attr("loai");
            switch (strLoai) {
                case "DATA":
                    var datatemp = point.attr("dulieu");
                    if (datatemp !== null && datatemp.length > 4 && datatemp.substring(0, 4) == 'edu.') datatemp = eval(datatemp);
                    obj_list[strTemp] = edu.util.returnEmpty(datatemp); break;
                case "INPUT":
                case "INPUT_DATE": obj_list[strTemp] = edu.util.getValById("txtSearch_" + strTemp); break;
                case "FUNCTION":
                case "PROCEDURE":
                case "DANHMUC": obj_list[strTemp] = edu.util.getValById("dropSearch_" + strTemp); break;
            }
        }
        me.callAPI(obj_list, me.objDS.type, function (data) {
            if (data.length > 0) {
                for (var x in data[0]) {
                    if (!me.objDS.dataNames.includes(x)) me.objDS.dataNames.push(x);
                }
            }
            if ($("#tbl" + me.objConfigure.MaChucNang + " thead row").length == 0) me.openEditTable();
            me.dtTable = data;
            if (data.length > 0) {
                var arrInput = [];
                var arrColumn = [];
                var checkx = $(".columninput");
                if (checkx[0].innerHTML == "") {
                    var row = '<option value=""> Chọn cột bind</option>';
                    for (var x in data[0]) {
                        arrColumn.push(x);
                        row += '<option value="' + x + '">' + x + '</option>';
                    }
                    for (var i = 0; i < checkx.length; i++) {
                        arrInput.push(checkx[i].id.substring(10));
                        checkx[i].innerHTML = row;
                    }
                }
                checkx.select2();
                me.getList_SQL_Drop("", "select * from CHUNG_API_THAMSOFOREDIT where " +
                    "THAMSO in (select COLUMN_VALUE from table(PKG_COMMON.split('" + arrInput.toString() + "', ','))) AND " +
                    "COLUMNOFTABLE in (select COLUMN_VALUE from table(PKG_COMMON.split('" + arrColumn.toString() + "', ',')))"
                    , "", function (json) {
                        for (var i = 0; i < json.length; i++) {
                            edu.util.viewValById("dropColumn" + json[i].THAMSO, json[i].COLUMNOFTABLE);
                            me.addBindSave(json[i].THAMSO, json[i].COLUMNOFTABLE, $("#txtName_" + json[i].THAMSO).val());
                        }
                    });
            }

        });
    },
    checkConfig_Search: function (strThamSo) {
        var me = this;
        var objCon = {};
        for (var i = 0; i < me.objConfigure.view.Search.length; i++) {
            if (me.objConfigure.view.Search[i].ThamSo == strThamSo) {
                return me.objConfigure.view.Search[i];
            }
        }
        var obj = edu.util.objGetOneDataInData(strThamSo, me.dtThamSo, "THAMSO");
        if (obj.length != 0) {
            if (obj.LOAI != null) objCon["Loai"] = obj.LOAI;
            if (obj.THAMSO != null) objCon["ThamSo"] = obj.THAMSO;
            if (obj.HAM_MA != null) objCon["Ham_Ma"] = obj.HAM_MA;
            if (obj.DULIEUMACDINH != null) objCon["DuLieuMacDinh"] = obj.DULIEUMACDINH;
            if (obj.TENHIENTHI != null) objCon["TenHienThi"] = obj.TENHIENTHI;
            me.objConfigure.view.Search.push(objCon);
        }
        return objCon;
    },
    checkConfig_Save: function (strThamSo) {
        var me = this;
        var objCon = {};
        for (var i = 0; i < me.objConfigure.view.Save.length; i++) {
            if (me.objConfigure.view.Save[i].ThamSo == strThamSo) {
                return me.objConfigure.view.Save[i];
            }
        }
        var obj = edu.util.objGetOneDataInData(strThamSo, me.dtThamSo, "THAMSO");
        if (obj.length != 0) {
            if (obj.LOAI != null) objCon["Loai"] = obj.LOAI;
            if (obj.THAMSO != null) objCon["ThamSo"] = obj.THAMSO;
            if (obj.HAM_MA != null) objCon["Ham_Ma"] = obj.HAM_MA;
            if (obj.DULIEUMACDINH != null) objCon["DuLieuMacDinh"] = obj.DULIEUMACDINH;
            if (obj.TENHIENTHI != null) objCon["TenHienThi"] = obj.TENHIENTHI;
            me.objConfigure.view.Save.push(objCon);
        }
        return objCon;
    },
    checkConfig_Table: function (objColumn) {
        var me = this;
        var objCon = {};
        for (var i = 0; i < me.objConfigure.view.Table.length; i++) {
            if (me.objConfigure.view.Table[i].strMaCot == objColumn.strMaCot) {
                return;
            }
        }
        me.objConfigure.view.Table.push(objColumn);
    },
    addBindSave: function (strThamSo, strDataBlind, strTenHienThi) {
        var me = this;
        for (var i = 0; i < me.objConfigure.view.Save.length; i++) {
            var check = me.objConfigure.view.Save[i];
            if (check.ThamSo == strThamSo) {
                check["DataBlind"] = strDataBlind;
                check["TenHienThi"] = strTenHienThi;
            }
        }
    },
    /*------------------------------------------
    --Discription: [Tab_1] ThongTinLyLich
    -------------------------------------------*/
    getList_SQL_Drop: function (strDrop_Id, strSQL, strColumn, callback) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_LuuCacThongTinHoatDong/LayDanhSachSQL',
            'strA': strSQL
        };
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (strDrop_Id != undefined && strDrop_Id != "") me.genComBo_SQL_Drop(data.Data, strDrop_Id, strColumn);
                    callback(data.Data);
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: 'POST',
            action: obj_list.action,
            async: false,
            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    genComBo_SQL_Drop: function (data, strDrop_Id, strColumn) {
        var obj = {
            data: data,
            renderInfor: {
                id: "ID",
                parentId: "",
                name: strColumn,
                code: "MA"
            },
            renderPlace: [strDrop_Id],
            type: "",
            title: "Chọn"
        };
        edu.system.loadToCombo_data(obj);
    },
    getList_CotDuLieu: function () {
        var me = this;
        //--Edit
        var obj_list = JSON.parse($("#txtConnect").val());
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    if (dtReRult.length > 0) {
                        var html = '';
                        for (var x in dtReRult[0]) {
                            html += '<option value="'+ x +'">'+ x +'</option>';
                        }
                        $("#dropCotDuLieu").html(html);
                        $("#dropCotDuLieu").select2();
                    }
                }
                else {
                    edu.system.alert(obj_list + " : " + data.Message, "s");
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: $("#dropFunctionType").val(),
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    callAPI: function (obj_list, type, callback) {
        var me = this;
        //

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var dtReRult = data.Data;
                    callback(dtReRult);
                }
                else {
                    edu.system.alert(data.Message);
                }

            },
            error: function (er) {

                edu.system.alert(obj_list + " (er): " + JSON.stringify(er), "w");
            },
            type: type,
            action: obj_list.action,

            contentType: true,
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    
    save_SQL: function (strSQL) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_OraDBTableName/CreatAndAlterTable',

            'strA': strSQL,
            'strB': ""
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(ex.Message);
                }

            },
            
            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Api_ThamSo: function (strThamSo, strHam_Ma, strDuLieuMacDinh, strTenHienThi, strLoai) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_OraDBTableName/Save_API_ThamSo',

            'strThamSo': strThamSo,
            'strHam_Ma': strHam_Ma,
            'strDuLieuMacDinh': strDuLieuMacDinh,
            'strTenHienThi': strTenHienThi,
            'strLoai': strLoai
        };
        //default

        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    edu.system.alert("Thực hiện thành công");
                }
                else {
                    edu.system.alert(ex.Message);
                }

            },

            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_Api_ThamSoForUpdate: function (strThamSo, ColumnOfTable) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_OraDBTableName/Save_API_ThamSoForUpdate',

            'strThamSo': strThamSo,
            'ColumnOfTable': ColumnOfTable,
        };
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

            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_ColumnOfTable: function (strMa, strTen, dStt, strCanLe, strMimiRender) {
        var me = this;
        var obj = {};
        //--Edit
        var obj_save = {
            'action': 'CMS_OraDBTableName/Save_ColumnOfTable',

            'strMa': strMa,
            'strTen': strTen,
            'dStt': dStt,
            'strCanLe': strCanLe,
            'strMimiRender': strMimiRender
        };
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

            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    save_CauHinhChucNang: function (strId, strMa, strTen, dStt, strData) {
        var me = this;
        //--Edit
        var obj_save = {
            'action': 'CMS_OraDBTableName/Save_CauHinh_ChucNang',
            'strId': strId,
            'strMa': strMa,
            'strTen': strTen,
            'dStt': dStt,
            'strData': strData
        };
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

            type: "POST",
            action: obj_save.action,

            contentType: true,

            data: obj_save,
            fakedb: [
            ]
        }, false, false, false, null);
    },
    openEditTable: function () {
        var me = this;
        edu.util.toggle_overide("zone-bus", "zoneCauHinhBang");
        var row = '';
        var arrTemp = [];
        
        for (var i = 0; i < me.objDS.dataNames.length; i++) {
            var temp = me.objDS.dataNames[i];
            arrTemp.push(temp);
            var strcheck = "";
            //if (dataKhoanThu[i].TEN.includes('ọc phí') || dataKhoanThu[i].TEN.includes('inh phí')) strcheck = 'checked="checked"'
            row += '<div class="col-lg-2 checkbox-inline user-check-print">';
            row += '<input style="float: left; margin-right: 5px" type="checkbox" id="' + temp + '" class="ckbDSColumnOfTable" ' + strcheck + '/>';
            row += '<span><p>' + temp + '</p></span>';
            row += '</div>';
        }
        //arrTemp.push("SUA");
        //arrTemp.push("XOA");
        row += '<div class="col-lg-2 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" id="SUA" class="ckbDSColumnOfTable"/>';
        row += '<span><p>Sửa</p></span>';
        row += '</div>';
        row += '<div class="col-lg-2 checkbox-inline user-check-print">';
        row += '<input style="float: left; margin-right: 5px" type="checkbox" id="XOA" class="ckbDSColumnOfTable"/>';
        row += '<span><p>Xóa</p></span>';
        row += '</div>';
        $("#dsColumn").html(row);
        me.getList_SQL_Drop("", "select * from chung_ColumnOfTable where Ma in (select COLUMN_VALUE from table( PKG_COMMON.split('" + arrTemp.toString() + "', ','))) order by stt", "", function (data) {
            for (var i = 0; i < data.length; i++) {
                me.genColumnOfTable("", data[i]);
            }
        });
        //$("#dsColumn #STT").trigger("click");
        //$("#dsColumn #SUA").trigger("click");
        //$("#dsColumn #XOA").trigger("click");
    },
    genColumnOfTable: function (strColumn, data) {
        var me = this;
        var strId = edu.util.uuid();
        var iViTri = document.getElementById("tblColumnOfTable").getElementsByTagName('tbody')[0].rows.length + 1;
        var strTen = "";
        var strMa = strColumn;
        var strCanLe = "";
        var strMimiRender = "";
        if (data != undefined && data.length != 0) {
            strTen = edu.util.returnEmpty(data.TEN);
            strMa = data.MA;
            strCanLe = edu.util.returnEmpty(data.CANLE);
            strMimiRender = edu.util.returnEmpty(data.MIMIRENDER);
            iViTri = data.STT;
        }
        if ($("#tblColumnOfTable tbody ." + strMa).length > 0) return;
        var row = '';
        row += '<tr id="' + strId + '" class="' + strMa +'">';
        row += '<td><input type="text" value="' + iViTri +'" class="form-control" /></td>';
        row += '<td><input type="text" value="' + strTen +'" class="form-control" /></td>';
        row += '<td>' + strMa +'</td>';
        row += '<td><input type="text" value="' + strCanLe +'" class="form-control" /></td>';
        row += '<td><input type="text" value="' + strMimiRender +'" class="form-control" /></td>';
        row += '<td style="text-align: center"><a title="Xóa dòng" class="deleteRowButton" id="' + strId + '" href="javascript:void(0)"><i class="fa fa-trash"></i></a></td>';
        row += '</tr>';
        $("#tblColumnOfTable tbody").append(row);
    },

    genhtml: function (objConfig, zoneHienThi, showCode) {
        var me = this;
        var html = "";
        html += '<section class="content">\n';

        html += '<div class="row">\n';
        html += '<!-- /.left-content -->\n';
        html += '<!-- /.right-content -->\n';
        html += '<div class="col-lg-12">\n';
        html += '<!-- box Notify_' + objConfig.MaChucNang + ' -->\n';
        html += '<div class="box box-solid zone-bus" id="zone_notify">\n';
        html += '<div class="box box-solid">\n';
        html += '<div class="box-header with-border">\n';
        html += '<h3 class="box-title"><i class="fa fa-window-restore"></i> Tìm kiếm</h3>\n';
        html += '</div>\n';
        html += '<div class="box-body">\n';
        html += '<div class="bss-item">\n';
        for (var i = 0; i < objConfig.view.Search.length; i++) {
            var objTemp = objConfig.view.Search[i];
            switch (objTemp.Loai) {
                case "INPUT":
                    html += '<div class="col-sm-3 item-search">\n';
                    html += '<input id="txtSearch_' + objTemp.ThamSo + '" class="form-control" placeholder="' + objTemp.TenHienThi + '" />\n';
                    html += '</div>\n';
                    break;
                case "INPUT_DATE":
                    html += '<div class="col-sm-3 item-search">\n';
                    html += '<input id="txtSearch_' + objTemp.ThamSo + '" class="form-control input-datepicker" placeholder="' + objTemp.TenHienThi + '" />\n';
                    html += '</div>\n';
                    break;
                case "DANHMUC":
                case "PROCEDURE":
                    html += '<div class="col-sm-3 item-search">\n';
                    html += '<select id="dropSearch_' + objTemp.ThamSo + '" class="select-opt"></select>\n';
                    html += '</div>\n';
                    break;
            }
        }
        html += '<div class="col-sm-3 item-search">\n';
        html += '<a class="btn btn-default" id="btnSearch"><i class="fa fa-search"></i> <span class="lang" key="">Tìm kiếm</span></a>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '<div class="box box-solid">\n';
        html += '<div class="box-header with-border">\n';
        html += '<h3 class="box-title">\n';
        html += '<i class="fa fa-list-alt"></i> Danh sách\n';
        html += '<span class="badge bg-light-blue">\n';
        html += '<span id="lbl' + objConfig.MaChucNang + '_Tong"></span>\n';
        html += '</span>\n';
        html += '</h3>\n';

        html += '<div class="pull-right">\n';
        html += '<div>\n';
        html += '<a class="btn btn-primary btnAdd" href="#"><i class="fa fa-plus"></i> Thêm mới</a>\n';
        html += '<a id="btnDelete' + objConfig.MaChucNang + '" class="btn btn-default"><i class="fa fa-trash"></i> Xóa</a>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '<div class="box-body">\n';
        html += '<div class="row">\n';
        html += '<div class="col-sm-12">\n';
        html += '<div class="col-sm-12 scroll-table-x">\n';
        html += '<table id="tbl' + objConfig.MaChucNang + '" class="table table-hover table-bordered">\n';
        html += '<thead>\n';
        html += '<tr>\n';
        html += '<th class="td-fixed td-center">Stt</th>\n';
        for (var i = 0; i < objConfig.view.Table.length; i++) {
            var objTemp = objConfig.view.Table[i];
            if (objTemp.strMaCot == "SUA") {
                html += '<th class="td-fixed td-center">' + objTemp.strTenCot + '</th>\n';
                continue;
            }
            if (objTemp.strMaCot == "XOA") {
                html += '<th class="td-center td-fixed"><input type="checkbox" id="chkSelectAll" /></th>\n';
                continue;
            }
            html += '<th class="td-center">' + objTemp.strTenCot + '</th>\n';
        }
        html += '</tr>\n';
        html += '</thead>\n';
        html += '<tbody></tbody>\n';
        html += '<tfoot></tfoot>\n';
        html += '</table>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</section>\n';
        html += '<div class="modal fade" id="myModal" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n';
        html += '<div class="modal-dialog">\n';
        html += '<div class="modal-content">\n';
        html += '<div class="modal-header">\n';
        html += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\n';
        html += '<h3 class="box-title"><span class="myModalLabel"> <i class="fa fa-pencil"></i></span> ' + objConfig.TenChucNang + '</h3>\n';
        html += '</div>\n';
        html += '<div class="modal-body" id="modal_body">\n';
        html += '<div class="row zone-box">\n';

        for (var i = 0; i < objConfig.view.Save.length; i++) {
            var objTemp = objConfig.view.Save[i];
            html += '<!--row '+ (i+1) +'-->\n';
            switch (objTemp.Loai) {
                case "INPUT":
                    html += '<div class="row">\n';
                    html += '<div class="col-sm-3">\n';
                    html += '<label style="font-weight: normal">' + objTemp.TenHienThi + '</label>\n';
                    html += '</div>\n';
                    html += '<div class="col-sm-9">\n';
                    html += '<input type="text" id="txt' + objTemp.ThamSo + '" class="form-control" />\n';
                    html += '</div>\n';
                    html += '<div class="clear"></div>\n';
                    html += '</div>\n';
                    break;
                case "INPUT_DATE":
                    html += '<div class="row">\n';
                    html += '<div class="col-sm-3">\n';
                    html += '<label style="font-weight: normal">' + objTemp.TenHienThi + '</label>\n';
                    html += '</div>\n';
                    html += '<div class="col-sm-9">\n';
                    html += '<input type="text" id="txt' + objTemp.ThamSo + '" class="form-control inputdatepicker" placeholder="dd/mm/yyyy" />\n';
                    html += '</div>\n';
                    html += '<div class="clear"></div>\n';
                    html += '</div>\n';
                    break;
                case "DANHMUC":
                case "PROCEDURE":
                    html += '<div class="row">\n';
                    html += '<div class="col-sm-3">\n';
                    html += '<label style="font-weight: normal">' + objTemp.TenHienThi + '</label>\n';
                    html += '</div>\n';
                    html += '<div class="col-sm-9">\n';
                    html += '<select id="drop' + objTemp.ThamSo + '" class="select-opt"></select>\n';
                    html += '</div>\n';
                    html += '<div class="clear"></div>\n';
                    html += '</div>\n';
                    break;
            }
        }
        html += '</div>\n';
        html += '</div>\n';
        html += '<div class="clear"></div>\n';
        html += '<div id="notify"></div>\n';
        html += '<div class="modal-footer">\n';
        html += '<a class="submit btn btn-danger btnOpenDelete" id="btnDelete_' + objConfig.MaChucNang + '" style="display: none"><i class="fa fa-trash"></i> <span class="lang" key="">Xóa</span></a>\n';
        html += '<button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times-circle-o"></i> <span class="lang" key="">Đóng</span></button>\n';
        html += '<a class="submit btn btn-primary" id="btnSave_' + objConfig.MaChucNang + '"><i class="fa fa-check-circle"></i><span class="lang" key=""> Lưu</span></a>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        html += '</div>\n';
        //if (showCode) html = '<xmp>' + html +'</xmp>';
        $("#" + zoneHienThi).val(html);
    },
    genJS: function (objConfig, zoneHienThi) {
        var me = this;
        var listDS = {};
        var listSave = {};
        for (var i = 0; i < me.objConfigure.Controller.lApi.length; i++) {
            if (me.objConfigure.Controller.lApi[i].name == "LayDanhSach") {
                listDS = me.objConfigure.Controller.lApi[i].params;
                continue;
            }
            if (me.objConfigure.Controller.lApi[i].name == "ThemMoi") {
                listSave = me.objConfigure.Controller.lApi[i].params;
                continue;
            }
        }
        var row = '';
        row += 'function ' + objConfig.MaChucNang + '() { };\n';
        row += objConfig.MaChucNang + '.prototype = {\n';
        row += 'str' + objConfig.MaChucNang + '_Id: "",\n';
        row += 'dt' + objConfig.MaChucNang + ': [],\n';

        row += 'init: function () {\n';
        row += 'var me = this;\n';
        row += '/*------------------------------------------\n';
        row += '--Discription: Initial system\n';
        row += '-------------------------------------------*/\n';

        row += 'me.getList_' + objConfig.MaChucNang + '();\n';

        for (var i = 0; i < objConfig.view.Search.length; i++) {
            if (objConfig.view.Search[i].Loai == "DANHMUC") {
                row += 'edu.system.loadToCombo_DanhMucDuLieu("' + objConfig.view.Search[i].Ham_Ma + '", "dropSearch_' + objConfig.view.Search[i].ThamSo + '");\n';
            }
        }
        for (var i = 0; i < objConfig.view.Save.length; i++) {
            if (objConfig.view.Save[i].Loai == "DANHMUC") {
                row += 'edu.system.loadToCombo_DanhMucDuLieu("' + objConfig.view.Save[i].Ham_Ma + '", "drop' + objConfig.view.Save[i].ThamSo + '");\n';
            }
        }

        row += '$("#tbl' + objConfig.MaChucNang + '").delegate(".btnEdit", "click", function () {\n';
        row += 'var strId = this.id;\n';
        row += 'if (edu.util.checkValue(strId)) {\n';
        row += 'me.viewForm_' + objConfig.MaChucNang + '(strId);\n';
        row += '}\n';
        row += 'else {\n';
        row += 'edu.system.alert(edu.constant.getting("NOTIFY", "SELECT_F"));\n';
        row += '}\n';
        row += '});\n';
        row += '$("#tbl' + objConfig.MaChucNang + '").delegate(".checkOne", "click", function () {\n';
        row += 'edu.util.checkedOne_BgRow(this, { table_id: "tbl' + objConfig.MaChucNang + '", regexp: /checkX/g });\n';
        row += '});\n';
        row += '$(".btnAdd").click(function () {\n';
        row += 'me.popup();\n';
        row += 'me.resetPopup();\n';
        row += '});\n';
        row += '$("#btnSave_' + objConfig.MaChucNang + '").click(function () {\n';
        row += 'me.save_' + objConfig.MaChucNang + '();\n';
        row += '});\n';
        row += '$("#btnDelete_' + objConfig.MaChucNang + '").click(function () {\n';
        row += '$("#myModal").modal("hide");\n';
        row += 'edu.system.confirm(edu.constant.getting("NOTIFY", "CF_DELETE"));\n';
        row += '$("#btnYes").click(function (e) {\n';
        row += 'me.delete_' + objConfig.MaChucNang + '(me.strHeSoChucDanh_Id);\n';
        row += '});\n';
        row += '});\n';
        row += '$("#btnXoa' + objConfig.MaChucNang + '").click(function () {\n';
        row += 'var arrChecked_Id = edu.util.getArrCheckedIds("tbl' + objConfig.MaChucNang + '", "checkX");\n';
        row += 'if (arrChecked_Id.length === 0) {\n';
        row += 'edu.system.alert("Vui lòng chọn đối tượng cần xóa?");\n';
        row += 'return;\n';
        row += '}\n';
        row += 'edu.system.confirm("Bạn có chắc chắn xóa dữ liệu không?");\n';
        row += '$("#btnYes").click(function (e) {\n';
        row += 'edu.system.alert(\'< div id="zoneprocess' + objConfig.MaChucNang + '"></div >\');\n';
        row += 'edu.system.genHTML_Progress("zoneprocess' + objConfig.MaChucNang + '", arrChecked_Id.length);\n';
        row += 'for (var i = 0; i < arrChecked_Id.length; i++) {\n';
        row += 'me.delete_' + objConfig.MaChucNang + '(arrChecked_Id[i]);\n';
        row += '}\n';
        row += '});\n';
        row += '});\n';

        row += '$("#btnSearch").click(function () {\n';
        row += 'me.getList_' + objConfig.MaChucNang + '();\n';
        row += '});\n';
        row += '$("#txtSearch_TuKhoa").keypress(function (e) {\n';
        row += 'if (e.which === 13) {\n';
        row += 'e.preventDefault();\n';
        row += 'me.getList_' + objConfig.MaChucNang + '();\n';
        row += '}\n';
        row += '});\n';
        row += '$("#chkSelectAll").on("click", function () {\n';
        row += 'edu.util.checkedAll_BgRow(this, { table_id: "tbl' + objConfig.MaChucNang + '" });\n';
        row += '});\n';
        row += '},\n';
        row += 'popup: function () {\n';
        row += '//show\n';
        row += '$("#myModal").modal("show");\n';
        row += '$("#btnNotifyModal").remove();\n';
        row += '},\n';
        row += 'resetPopup: function () {\n';
        row += 'var me = this;\n';
        row += 'me.str' + objConfig.MaChucNang + '_Id = "";\n';
        for (var i = 0; i < objConfig.view.Save.length; i++) {
            switch (objConfig.view.Save[i].Loai) {
                case "INPUT":
                case "INPUT_DATE":
                    row += 'edu.util.viewValById("txt' + objConfig.view.Save[i].ThamSo + '", "");\n'; break;
                case "DANHMUC":
                case "PROCEDURE":
                    row += 'edu.util.viewValById("drop' + objConfig.view.Save[i].ThamSo + '", "");\n'; break;
            }
        }
        row += '},\n';
        row += '/*------------------------------------------\n';
        row += '--Discription: [3] AccessDB HOC\n';
        row += '--ULR:  Modules\n';
        row += '-------------------------------------------*/\n';
        row += 'save_' + objConfig.MaChucNang + ': function () {\n';
        row += 'var me = this;\n';
        row += 'var obj_notify = {};\n';
        row += '//--Edit\n';
        row += 'var obj_save = {\n';
        row += '"action": "' + objConfig.Controller.name + '/ThemMoi",\n';
        row += '"strId": me.str' + objConfig.MaChucNang + '_Id,\n';
        for (var i = 0; i < objConfig.view.Save.length; i++) {
            switch (objConfig.view.Save[i].Loai) {
                case "INPUT":
                case "INPUT_DATE":
                    row += '"' + objConfig.view.Save[i].ThamSo + '": edu.util.getValById("txt' + objConfig.view.Save[i].ThamSo + '"),\n'; break;
                case "DANHMUC":
                case "PROCEDURE":
                    row += '"' + objConfig.view.Save[i].ThamSo + '": edu.util.getValById("drop' + objConfig.view.Save[i].ThamSo + '"),\n'; break;
                case "DATA":
                    row += '"' + objConfig.view.Save[i].ThamSo + '": ' + objConfig.view.Save[i].DuLieuMacDinh + ',\n';
            }
        }
        row += '};\n';
        row += 'if (edu.util.checkValue(obj_save.strId)) {\n';
        row += 'obj_save.action = "' + objConfig.Controller.name + '/CapNhat";\n';
        row += '}\n';
        row += '//default\n';
        row += 'edu.system.makeRequest({\n';
        row += 'success: function (data) {\n';
        row += 'if (data.Success) {\n';
        row += 'if (edu.util.checkValue(data.Id)) {\n';
        row += 'obj_notify = {\n';
        row += 'type: "s",\n';
        row += 'content: "Thêm mới thành công!"\n';
        row += '};\n';
        row += 'edu.system.alertOnModal(obj_notify);\n';
        row += '}\n';
        row += 'else {\n';
        row += 'obj_notify = {\n';
        row += 'type: "i",\n';
        row += 'content: "Cập nhật thành công!"\n';
        row += '};\n';
        row += 'edu.system.alertOnModal(obj_notify);\n';
        row += '}\n';
        row += 'me.getList_' + objConfig.MaChucNang + '();\n';
        row += '}\n';
        row += 'else {\n';
        row += 'obj_notify = {\n';
        row += 'type: "w",\n';
        row += 'content: obj_save.action + " (er): " + data.Message\n';
        row += '};\n';
        row += 'edu.system.alertOnModal(obj_notify);\n';
        row += '}\n';
        row += '},\n';
        row += 'error: function (er) {\n';
        row += 'edu.system.alertOnModal(obj_save.action + " (er): " + JSON.stringify(er), "w");\n';
        row += '},\n';
        row += 'type: "POST",\n';
        row += 'action: obj_save.action,\n';
        row += 'contentType: true,\n';
        row += 'data: obj_save\n';
        row += '}, false, false, false, null);\n';
        row += '},\n';
        row += 'getList_' + objConfig.MaChucNang + ': function (strDanhSach_Id) {\n';
        row += 'var me = this;\n';
        row += '//--Edit\n';
        row += 'var obj_list = {\n';
        row += '"action": "' + objConfig.Controller.name + '/LayDanhSach",\n';
        for (var i = 0; i < objConfig.view.Search.length; i++) {
            switch (objConfig.view.Search[i].Loai) {
                case "INPUT":
                case "INPUT_DATE":
                    row += '"' + objConfig.view.Search[i].ThamSo + '": edu.util.getValById("txt' + objConfig.view.Search[i].ThamSo + '"),\n'; break;
                case "DANHMUC":
                case "PROCEDURE":
                    row += '"' + objConfig.view.Search[i].ThamSo + '": edu.util.getValById("drop' + objConfig.view.Search[i].ThamSo + '"),\n'; break;
                case "DATA":
                    row += '"' + objConfig.view.Search[i].ThamSo + '": ' + objConfig.view.Search[i].DuLieuMacDinh + ',\n';
            }
        }
        row += '};\n';
        row += '//\n';

        row += 'edu.system.makeRequest({\n';
        row += 'success: function (data) {\n';
        row += 'if (data.Success) {\n';
        row += 'var dtReRult = data.Data;\n';
        row += 'me.dt' + objConfig.MaChucNang + ' = dtReRult;\n';
        row += 'me.genTable_' + objConfig.MaChucNang + '(dtReRult, data.Pager);\n';
        row += '}\n';
        row += 'else {\n';
        row += 'edu.system.alert(obj_list.action + " : " + data.Message, "s");\n';
        row += '}\n';
        row += '},\n';
        row += 'error: function (er) {\n';
        row += 'edu.system.alert(obj_list.action + " (er): " + JSON.stringify(er), "w");\n';
        row += '},\n';
        row += 'type: "GET",\n';
        row += 'action: obj_list.action,\n';
        row += 'contentType: true,\n';
        row += 'data: obj_list\n';
        row += '}, false, false, false, null);\n';
        row += '},\n';
        row += 'delete_' + objConfig.MaChucNang + ': function (Ids) {\n';
        row += 'var me = this;\n';
        row += '//--Edit\n';
        row += 'var obj_delete = {\n';
        row += '"action": "' + objConfig.Controller.name + '/Xoa",\n';
        row += '"strIds": strIds,\n';
        row += '"strChucNang_Id": edu.system.strChucNang_Id,\n';
        row += '"strNguoiThucHien_Id": edu.system.userId\n';
        row += '};\n';
        row += '//default\n';
        row += 'edu.system.makeRequest({\n';
        row += 'success: function (data) {\n';
        row += 'if (data.Success) {\n';
        row += 'edu.system.alert("Xóa dữ liệu thành công!");\n';
        row += 'me.getList_' + objConfig.MaChucNang + '();\n';
        row += '}\n';
        row += 'else {\n';
        row += 'edu.system.alert(obj_delete.action + ": " + data.Message);\n';
        row += '}\n';
        row += '},\n';
        row += 'error: function (er) {\n';
        row += 'edu.system.alert(obj_delete.action + ": " + JSON.stringify(er));\n';
        row += '},\n';
        row += 'complete: function () {\n';
        row += 'edu.system.start_Progress("zoneprocess' + objConfig.MaChucNang + '", function () {\n';
        row += 'me.getList_' + objConfig.MaChucNang + '();\n';
        row += '});\n';
        row += '},\n';
        row += 'type: "POST",\n';
        row += 'action: obj_delete.action,\n';
        row += 'contentType: true,\n';
        row += 'data: obj_delete\n';
        row += '}, false, false, false, null);\n';
        row += '},\n';
        row += '/*------------------------------------------\n';
        row += '--Discription: [4] GenHTML Tiến độ đề tài\n';
        row += '--ULR:  Modules\n';
        row += '-------------------------------------------*/\n';
        row += 'genTable_' + objConfig.MaChucNang + ': function (data, iPager) {\n';
        row += '$("#lbl' + objConfig.MaChucNang + '_Tong").html(iPager);\n';
        row += 'var jsonForm = {\n';
        row += 'strTable_Id: "tbl' + objConfig.MaChucNang + '",\n';
        row += 'aaData: data,\n';
        row += 'bPaginate: {\n';
        row += 'strFuntionName: "main_doc.' + objConfig.MaChucNang + '.getList_' + objConfig.MaChucNang + '()",\n';
        row += 'iDataRow: iPager\n';
        row += '},\n';
        row += 'colPos: \n';
        //
        var objColPos = {
            center: [0],
            right: []
        };
        for (var i = 0; i < objConfig.view.Table.length; i++) {
            if (objConfig.view.Table[i].strCanLe != "") {
                objColPos[objConfig.view.Table[i].strCanLe].push(parseInt(objConfig.view.Table[i].strStt));
            }
        }
        row += JSON.stringify(objColPos);
        row += ',\n';
        row += 'aoColumns: [\n';
        var arrAo = '';
        for (var i = 0; i < objConfig.view.Table.length; i++) {
            arrAo += ',{\n';
            if (objConfig.view.Table[i].strMaCot == "SUA") {
                arrAo += '"mRender": function (nRow, aData) {\n';
                arrAo += 'return \'<span><a class="btn btn-default btnEdit" id="\' + aData.ID + \'" title="Sửa"><i class="fa fa-edit color-active"></i></a></span>\';\n';
                arrAo += '}\n';
                arrAo += '}\n';
                continue;
            }
            if (objConfig.view.Table[i].strMaCot == "XOA") {
                arrAo += '"mRender": function (nRow, aData) {\n';
                arrAo += 'return \'<input type="checkbox" class="checkOne" id="checkX\' + aData.ID + \'"/>\'; \n';
                arrAo += '}\n';
                arrAo += '}\n';
                continue;
            }

            if (objConfig.view.Table[i].strMimiRender == "")
                arrAo += '"mDataProp": "' + objConfig.view.Table[i].strMaCot +'"\n';
            else
                arrAo += '"mRender": ' + objConfig.view.Table[i].strMimiRender;
            arrAo += '}\n';
        }
        row += arrAo.substring(1);
        row += ']\n';
        row += '};\n';
        row += 'edu.system.loadToTable_data(jsonForm);\n';
        row += '/*III. Callback*/\n';
        row += '},\n';
        row += 'viewForm_' + objConfig.MaChucNang + ': function (strId) {\n';
        row += 'var me = this;\n';
        row += '//call popup --Edit\n';
        row += 'var data = edu.util.objGetDataInData(strId, me.dt' + objConfig.MaChucNang + ', "ID")[0];\n';
        row += 'me.popup();\n';
        row += '//view data --Edit\n';
        for (var i = 0; i < objConfig.view.Save.length; i++) {
            switch (objConfig.view.Save[i].Loai) {
                case "INPUT":
                case "INPUT_DATE":
                    row += 'edu.util.viewValById("txt' + objConfig.view.Save[i].ThamSo + '", data.' + objConfig.view.Save[i].DataBlind +');\n'; break;
                case "DANHMUC":
                case "PROCEDURE":
                    row += 'edu.util.viewValById("drop' + objConfig.view.Save[i].ThamSo + '", data.' + objConfig.view.Save[i].DataBlind +');\n'; break;
            }
        }
        row += 'me.str' + objConfig.MaChucNang + '_Id = data.ID;\n';
        row += '}\n';
        row += '}\n';
        $("#" + zoneHienThi).val(row);
    },

    objConfigure: {//Chứa toàn bộ cấu hình của 1 chức năng từ giao diện đến js
        MaChucNang: "HeSoChucDanh",
        TenChucNang: "Hệ số chức danh",
        view: {
            SearchClearDiv: [],
            Search: [],
            Save: [],
            Table: []
        },
        Controller: {
            name: "NS_HeSo_ChucDanh",
            lApi: [
                {
                    name: "LayDanhSach",
                    type: "GET",
                    params: ["strNgach_Id", "strHocHam_Id", "strChucDanhNgheNghiep_Id", "strNguoiTao_Id", "strNgayApDung", "strTuKhoa", "pageIndex", "pageSize"],
                    dataNames: []
                },
                {
                    name: "ThemMoi",
                    type: "POST",
                    params: ["strId", "strChucNang_Id", "strChucDanhNgheNghiep_Id", "strNgach_Id", "strHocHam_Id", "dHeSoTapSu", "strNgayApDung", "dHeSo", "strNguoiThucHien_Id"]
                }
            ]
        }
    },
};