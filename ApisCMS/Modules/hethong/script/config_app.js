/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 24/08/2018
--API URL: 
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function ConfigModule() { };
ConfigModule.prototype = {
    node_Root: '',
    node_NghiepVu: '',
    node_UngDung: '',
    textRaw: '',
    textChanged: '',
    flag_changed: false,

    init: function () {
        var me = this;

        var custom_field = '{"strId":"","first_name":"Trần Văn","last_name":"Hiệp","mobile_number":"01234567890","email":"vanhieptn92@gmail.com","custom_field":{"NGAYSINH":"12/12/2012","NOISINH":"Đông Cao","QUOCTICH":"Việt Nam","GIOITINH":"F5D417F1E6984ECB88F55A5CC90FBBF7","NGAYCAPCMT_CCCD":"12/12/2012","NOICAPCMT_CCCD":"Thái Nguyên","FILE_ANH_3_4":"TS/unsave_2ea4a665e68e4b5eb079693ccb7c4d5a_202206271612276150_sazz.png","HOVATENPHUHUYNH":"xxx","SODIENTHOAIPHUHUYNH":"1234567890","EMAILPHUHUYNH":"hanaji@gmail.com","THUONGTRU_TINHTHANH":"2E50A270C3744CA7A6665BB1D9D1B189","THUONGTRU_QUANHUYEN":"F9466F4927B94DBCA325474B9FAF833C","THUONGTRU_PHUONGXA":"3B17CF0746F4467F98B62C71936BA895","THUONGTRU_SONHA_TO_XOM":"12/12/2012","TAMTRU_TINHTHANH":"4FC46DFD458E488D8BDB0D5DDCB7C046","TAMTRU_QUANHUYEN":"DFE1276ABDB841318BC09AA0E467C67D","TAMTRU_PHUONGXA":"201B2AD16B42410B90EDAEB5BD542C65","TAMTRU_SONHA_TOXOM":"12/12/2012","CHUNGCHITIENGANH_LOAICHUNGCHI":"A813B314D0AF45BC940F87AB68E50868","CHUNGCHITIENGANH_KETQUA":"12","CHUNGCHITIENGANH_FILE":"TS/unsave_bbf4acd60ad24d46aa42e9e75474a952_202206271613165970_sazz.png","THPT_LOP10":"12","THPT_LOP11":"12","THPT_LOP12":"23","THPT_TINHTHANH":"4FC46DFD458E488D8BDB0D5DDCB7C046","DIEMTRUNGBINHMONTOAN_LOP11_LOP12":"12","THPT_DIEMTB3HOCKYCAONHAT":"12","THPT_FILESCANHOCBACONGCHUNG":"TS/unsave_d38ee276cb744f1f900e2b61e91021b8_2022062716132410_untitled.png","LEPHIDUTUYEN_FILE":"","CACCHUNGCHIKHAC_FILE":""}}';
        custom_field = JSON.parse(custom_field);
        //for (var i = 0; i < me.dtTuNhapHoSo.length; i++) {
        //    arrCus.push({})
        //}
        me.dtTuNhapHoSo.forEach(e => {
            custom_field[e.MA] = $("#m" + e.ID).val();
        });

        var data = {
            'strId': '',
            'first_name': edu.util.getValById("txtHoDem"),
            'last_name': edu.util.getValById("txtTen"),
            'mobile_number': edu.util.getValById("txtSoDienThoai"),
            'email': edu.util.getValById("txtEmail"),
            'custom_field': custom_field
        };
        console.log(JSON.stringify(data));
        $.ajax({
            type: "POST",
            headers: {
                'Authorization': 'Token token="iEA43KOW_iR6auY_H8nreQ"',
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            url: 'https://uwebristol-edu-vn.myfreshworks.com/crm/sales/api/contacts',
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json'
        });
        return;
        var addEvent = function (obj, evt, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(evt, fn, false);
            }
            else if (obj.attachEvent) {
                obj.attachEvent("on" + evt, fn);
            }
        };

        addEvent(document, "mouseout", function (event) {
            event = event ? event : window.event;
            var x = document.
            var from = event.relatedTarget || event.toElement;
            if ((!from || from.nodeName == "HTML") && (event.clientY <= 100) {
                alert("left top bar");
            }
        });
        return;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.load_xml();
        /*------------------------------------------
		--Discription: [1] Action Module UngDung
		--Author:
		-------------------------------------------*/
        $("#txtKeyWord_UngDung_CFM").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#zone_ungdung_cf ul li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $("#btnSearch_UngDung_CFM").click(function () {
            var value = $("#txtKeyWord_UngDung_CFM").val().toLowerCase();
            $("#zone_ungdung_cf ul li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
        $("#btnReloadXML_CFM").click(function () {
            me.load_xml();
        });
        /*------------------------------------------
		--Discription: [2] Action XML
		--Author:
		-------------------------------------------*/
        $("#btnSend_XML").click(function () {
            me.edit_xml();
        });
        $("#tblThongSo_CFM").delegate(".btnEdit_CF", "click", function () {
            var strName_Id = this.id;
            strName_Id = edu.util.cutPrefixId(/edit_cf/g, strName_Id);

            if (edu.util.checkValue(strName_Id)) {
                me.textRaw_CF(strName_Id);
                me.showEdit_CF(strName_Id);
            }
        });
        $("#tblThongSo_CFM").delegate(".btnUpdate_CF", "keypress", function (e) {
            if (e.which == 13) {
                var strId = this.id;
                var strNode = edu.util.cutPrefixId(/txt/g, strId);
                var strValue = edu.util.getValById(strId);

                if (edu.util.checkValue(strNode)) {
                    me.textChanged_CF(strNode);
                    me.edit_xml(strNode, strValue);
                    me.hideEdit_CF(strNode);
                }
            }
        });
        $("#tblThongSo_CFM").delegate(".btnUpdate_CF", "blur", function () {
            var strId = this.id;
            var strNode = edu.util.cutPrefixId(/txt/g, strId);
            if (edu.util.checkValue(strNode)) {

                if (me.flag_changed) {
                    me.textUpdate_CF(strNode, me.textChanged);
                    me.flag_changed = false;
                }
                else {
                    me.textUpdate_CF(strNode, me.textRaw);
                }
                me.hideEdit_CF(strNode);
            }
        });
        /*------------------------------------------
		--Discription: [1] Action ThongSo
		--Author:
		-------------------------------------------*/
        $("#txtKeyWord_ThongSo_CFM").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tblThongSo_CFM tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $("#btnSearch_ThongSo_CFM").click(function () {
            var value = $("#txtKeyWord_ThongSo_CFM").val().toLowerCase();
            $("#tblThongSo_CFM tbody tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            }).css("color", "red");
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:
    -------------------------------------------*/
    page_load: function () {
        var me = this;

    },
    rewrite: function () {

    },
    /*------------------------------------------
    --Discription: [1] Acess DB XML
    --Author:
    -------------------------------------------*/
    edit_xml: function (strNode, strValue) {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Xml/EditNode',


            'strNode': me.node_Root + "#" + me.node_NghiepVu + "#" + me.node_UngDung + "#" + strNode,
            'strValue': strValue
        }


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    if (data.Message == "True") {
                        var obj = {
                            title: "Thông báo",
                            content: "Cập nhật thành công!",
                            time: 2000,
                        }
                        edu.system.alertTimer(obj);
                        me.textUpdate_CF(strNode, me.textChanged);
                        me.flag_changed = true;
                    }
                    else {
                        edu.system.alert("Chưa cập nhật được dữ liệu");
                        me.textUpdate_CF(strNode, me.textRaw);
                    }
                }
                else {
                    edu.system.alert("CM_System.XML_Edit: " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert("CM_System.XML_Edit (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,

            contentType: true,

            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    load_xml: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Xml/GetFile',
            'versionAPI': 'v1.0'
        };


        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    var text_xml = data.Message;
                    parser = new DOMParser();
                    var xml = parser.parseFromString(text_xml, "text/xml");
                    me.load_xml_process(xml);
                }
                else {
                    edu.system.alert("CM_System.XML_Load: " + data.Message, "w");
                }

            },
            error: function (er) {

                edu.system.alert("CM_System.XML_Load (er): " + JSON.stringify(er), "w");
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
    --Discription: [1] Gen Html XML
    --Author:
    -------------------------------------------*/
    load_xml_process: function (xml) {
        var me = this;
        var i, xmlDoc;
        var arrUngDung = [];
        var objUngDung = {
            TEN: ""
        };
        xmlDoc = xml;
        me.node_Root = xmlDoc.documentElement.nodeName; //cap 1 - root
        x = xmlDoc.documentElement.childNodes;          //cap 2 - UngDung

        //console.log("x: " + x);
        for (i = 0; i < x.length; i++) {
            if (x[i].nodeType == 1) {                   //nodeType = 1 ==> get only Element
                objUngDung = {};
                objUngDung.TEN = x[i].nodeName;
                arrUngDung.push(objUngDung);
            }
        }
        //
        me.loadToTree_CF(arrUngDung, xmlDoc);

    },
    loadToTree_CF: function (data, xmlDoc) {
        var me = this;
        //1. Gen
        var obj = {
            data: data,
            renderInfor: {
                id: "TEN",
                parentId: "",
                name: "TEN",
                code: ""
            },
            renderPlaces: ["zone_ungdung_cf"],
            style: "fa fa-hdd-o color-active"
        };
        edu.system.loadToTreejs_data(obj);
        //2. Action
        $('#zone_ungdung_cf').on("select_node.jstree", function (e, data) {
            var strNameNode = data.node.id;
            var strNameNode_full = data.node.li_attr.title;
            //
            me.node_UngDung = strNameNode;
            edu.util.viewHTMLById("lblUngDung_ThongSo_CFM", strNameNode_full);
            me.getDetail_CF(strNameNode, xmlDoc);
            //----------------------------------------------------------------------------------------------
            //1. acess data.node obj
            // get name ==> data.node.name, 
            // get id ==> data.node.id
            // get title ==> data.node.li_attr.title;
            //2. structure here
            //"id": "BA65941F4DB94384B6A8334D6540986D",
            //"text": "Giáo dục thể chất 2 (Bóng chuy...",
            //"icon": true,
            //"parent": "#",
            //"parents": ["#"],
            //"children": [],
            //"children_d": [],
            //"data": {},
            //"state": { "loaded": true, "opened": true, "selected": true, "disabled": false },
            //"li_attr": {
            //    "id": "BA65941F4DB94384B6A8334D6540986D", "class": "btnEvent ",
            //    "title": "Giáo dục thể chất 2 (Bóng chuyền)"
            //}, "a_attr": { "href": "#", "id": "BA65941F4DB94384B6A8334D6540986D_anchor" }, "original": false
            //---------------------------------------------------------------------------------------------------------
        });
    },
    getDetail_CF: function (nameNode, xmlDoc) {
        var me = this;
        var arrThongSo = [];
        var objThongSo = {
            TEN: "",
            VALUE: "",
            COMMENT: "",
            ATTRIBUTE: ""
        };
        var x, y, z, comment, attribute;
        x = xmlDoc.documentElement.childNodes;//cap2 - UngDung


        for (i = 0; i < x.length; i++) {
            if (x[i].nodeType == 1) {
                if (x[i].nodeName == nameNode) {
                    y = x[i].childNodes;//cap 3 - ThongSo
                    for (var k = 0; k < y.length; k++) {
                        objThongSo = {};
                        if (y[k].nodeType == 8) {
                            comment = y[k].textContent;
                        }
                        if (y[k].nodeType == 1) {
                            objThongSo.TEN = y[k].nodeName;
                            objThongSo.VALUE = y[k].textContent;//get text in node  
                            objThongSo.COMMENT = comment;

                            attribute = y[k].attributes;

                            objThongSo.ATTRIBUTE = attribute;
                            arrThongSo.push(objThongSo);
                            //console.log("objThongSo.ATTRIBUTE: " + objThongSo.ATTRIBUTE);
                        }
                    }
                }
            }
        }
        //end loop
        me.genTable_CF(arrThongSo);

    },
    genTable_CF: function (data) {
        var me = this;
        edu.util.viewHTMLById("lblTong_ThongSo_CFM", data.length);
        var html = "";
        var ten = "";
        var comment = "";

        var jsonForm = {
            strTable_Id: "tblThongSo_CFM",
            aaData: data,
            colPos: {
                left: [1, 2],
                center: [0],
                fix: [0, 3]
            },
            aoColumns: [
                {
                    "mRender": function (nRow, aData) {
                        html = "";
                        ten = edu.util.returnEmpty(aData.TEN);
                        comment = edu.util.returnEmpty(aData.COMMENT);

                        html += '<span class="bold opacity-7" title="' + comment + '"> ' + ten + '</span>';
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = "";
                        ten = edu.util.returnEmpty(aData.TEN);
                        value = edu.util.returnEmpty(aData.VALUE);

                        html += '<span id="text_cf' + ten + '"> ' + value + '</span>';
                        html += '<input class="form-control form-border-bottom btnUpdate_CF hide" type="text" id="txt' + ten + '" value="' + value + '" />'
                        return html;
                    }
                }
                , {
                    "mRender": function (nRow, aData) {
                        html = '';
                        ten = edu.util.returnEmpty(aData.TEN);

                        html += '<a class="btn btn-default btn-circle poiter btnEdit_CF" id="edit_cf' + ten + '">';
                        html += '<i class="fa fa-edit color-active"></i>';
                        html += '</a>';
                        return html;
                    }
                }
            ]
        };
        edu.system.loadToTable_data(jsonForm);
        //$('#zone_edit_cf').slimScroll({/*scroll treejs*/
        //    position: 'right',
        //    height: "450px",
        //    railVisible: true,
        //    alwaysVisible: false
        //});

        /*III. Callback*/
    },
    /*------------------------------------------
    --Discription: [2] hide/show input
    --Author:
    -------------------------------------------*/
    showEdit_CF: function (strname_Id) {
        //1. show input edit
        var place_Input = "#txt" + strname_Id;
        var val_input = $(place_Input).val();

        $(place_Input).removeClass('hide');
        $(place_Input).val('').focus().val(val_input);
        //2. hide input edit and show text
        var place_Text = "#text_cf" + strname_Id;
        $(place_Text).addClass('hide');
    },
    hideEdit_CF: function (strname_Id) {
        //1. show
        var place_Input = "#txt" + strname_Id;
        $(place_Input).addClass('hide');
        //2. hide
        var place_Text = "#text_cf" + strname_Id;
        $(place_Text).removeClass('hide');
    },
    /*------------------------------------------
    --Discription: [3] check text change input
    --Author:
    -------------------------------------------*/
    textRaw_CF: function (strname_Id) {
        //text ban dau
        var me = this;
        var input_val = "txt" + strname_Id;
        me.textRaw = edu.util.getValById(input_val);
    },
    textChanged_CF: function (strname_Id) {
        //
        var me = this;
        var input_val = "txt" + strname_Id;
        me.textChanged = edu.util.getValById(input_val);
        if (me.textRaw == me.textChanged) {

        }
        else {

        }
    },
    textUpdate_CF: function (strname_Id, value) {
        var me = this;
        var place_text = "text_cf" + strname_Id;
        var place_input = "txt" + strname_Id;

        edu.util.viewHTMLById(place_text, value);
        edu.util.viewValById(place_input, value);
    }
}