function get_browser() {
    var t, n = navigator.userAgent, e = n.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    return /trident/i.test(e[1]) ? {
        name: "IE",
        version: (t = /\brv[ :]+(\d+)/g.exec(n) || [])[1] || ""
    } : "Chrome" === e[1] && null != (t = n.match(/\b(OPR|Edge)\/(\d+)/)) ? {
        name: t.slice(1)[0].replace("OPR", "Opera"),
        version: t.slice(1)[1]
    } : (e = e[2] ? [e[1], e[2]] : [navigator.appName, navigator.appVersion, "-?"],
        null != (t = n.match(/version\/(\d+)/i)) && e.splice(1, 1, t[1]),
        {
            name: e[0],
            version: e[1]
        })
}
var misa_kyso = {
    message_NoSetup_misakyso: 'Để thực hiện ký điện tử, bạn cần cài đặt công cụ MISA KYSO. Tải bộ cài <a id="download-ky-so" style="color:#2a6496" target="_blank" onclick="misa_kyso.clickDownloadKyso()">tại đây</a>.',
    isCalling_Misa_Kyso: false,
    /*
     * Range port using
     * nvdiep 30/11/2018 các cổng kết nôi với misakyso 
     */
    ports: [11984, 11985, 12680, 12681, 12683],

    /*
     * Websocket object
     */
    webSocket: null,

    /*
     * Current index port using
     */
    portIndex: 0,

    /*
     * Status
     */
    connectStatus: false,
    /**
     * security
     */
    securityError: true,
    /*
     * Action
     */
    Action: {
        GetRawVersion: 'GetRawVersion',
        GetVersionNumber: 'GetVersionNumber',
        SignXML: 'SignXML',
        GetAllCertificates: 'GetAllCertificates',
        SignPDF: 'SignPDF',
        SignOffice: 'SignOffice',
        CheckSignXML: 'CheckSignXML',
        SignXmlInvoiceUsingInfor: 'SignXmlInvoiceUsingInfor',
    },

    /*
     * Error code
     */
    ErrorCode: {
        BrowserNotSupport: 'BrowserNotSupport',
        PluginNotExist: 'PluginNotExist',
        RuntimeError: 'RuntimeError'
    },

    /*
     * Connect to plugin and send data
     * @param port {integer}  port 
     * @param data {string}   json string
     */
    connect: function (port, data) {
        //MISA.mask.show();
        var me = this,
            jsonData = JSON.stringify(data);

        if (me.webSocket == null || me.connectStatus == false) {
            // hthuyen(07/01/2018) kiểm tra có lỗi trên trình duyệt firefox để show
            try {
                me.webSocket = new WebSocket("ws://localhost:" + port + "/plugin");
            } catch (ex) {
                if (ex.code == 18) {
                    // hthuyen sửa bug 300292 sửa lại câu cảnh báo
                    MISA.CommonFn.showMessageBox(MISA.Constant.MessageBox.Warning, 'MISA meInvoice', MISA.Resource.EinvoiceResource.ErrorBrower.format("misa_kyso.showHelpBrower()"), null, { width: 500 });
                    MISA.mask.hide();
                }
            }

        } else {
            me.webSocket.send(jsonData);
            //MISA.mask.hide();

        }
        // Open the connection to the Web Socket server
        me.webSocket.onopen = function (e) {
            me.connectStatus = true;
            me.securityError = false;
            me.webSocket.send(jsonData);
            //MISA.mask.hide();
        };

        // When the connection is closed by the server
        me.webSocket.onclose = function (e) {
            me.connectStatus = false;
            me.securityError = false;
            me.isCalling_Misa_Kyso = false;
        };

        // Log messages from the server
        me.webSocket.onmessage = function (e) {
            var res,
                serviceResult = me.ServiceResult;
            me.isCalling_Misa_Kyso = false;
            if (e && e.data) {
                res = JSON.parse(e.data);

                if (res) {
                    if (res.jsObject) {
                        var jsObject = eval(res.jsObject);
                        if (res.jsCallBackFn && jsObject[res.jsCallBackFn]) {
                            jsObject[res.jsCallBackFn](res);
                        }
                    } else if (res.jsCallBackFn) {
                        window[res.jsCallBackFn](res);
                    }
                }
            }
        };

        // Log errors
        me.webSocket.onerror = function (e) {
            console.log(e);
            me.connectStatus = false;
            me.securityError = false;
            me.webSocket = null;
            me.portIndex += 1;
            if (me.portIndex < me.ports.length) {
                me.connect(me.ports[me.portIndex], {});
            } else {
                //nvdiep 29/11/2018 thực hiện show cảnh báo chưa cài đặt tool
                me.isCalling_Misa_Kyso = false;
                if (window["oConfirmMinutesInvoice"]) {
                    misa_kyso.toolRequireOld();
                }
                else {
                    misa_kyso.toolRequire();
                }
                misa_kyso.hanlderErrorConnectKySo();

                me.portIndex = 0;
                MISA.mask.hide();
                //console.log('Tool ký số chưa được cài đặt');
            }
        };


    },

    /*
     * Reconnect other port
     * Connect to plugin and send data
     * @param data {string}   json string
     */
    reconnect: function (data) {
        var me = this;
        me.connect(me.ports[me.portIndex], data);
    },

    /*
     * Get current version number
     * @param callbackFn  {funtion}  callback function
     * @param jsObject    {object}   caller
     */
    getRawVersion: function (callbackFn, jsObject) {
        var me = this,
            data = {
                action: me.Action.GetRawVersion
            };

        this.sendDataToPlugin(data, callbackFn, jsObject);
    },

    /*
     * Get current version number
     * @param callbackFn  {funtion}  callback function
     * @param jsObject    {object}   caller
     */
    getVersionNumber: function (callbackFn, jsObject) {
        var me = this,
            data = {
                action: me.Action.GetVersionNumber
            };

        me.sendDataToPlugin(data, callbackFn, jsObject);
    },

    /*
   * Get current version number
   * @param callbackFn  {funtion}  callback function
   * @param jsObject    {object}   caller
   */
    checkSignXML: function (data, callbackFn, jsObject) {
        var me = this;
        me.sendDataToPlugin(data, callbackFn, jsObject);
    },

    /*
     * hàm show thông tin chứng thư số
     * @param data       {object}   data send to plugin
     * @param callbackFn {funtion}  callback function
     * @param jsObject   {object}   caller
     */
    GetCertificateFromSignedXML: function (data, callbackFn, jsObject) {
        var me = this;
        me.sendDataToPlugin(data, callbackFn, jsObject);
    },
    /*
     * Sign XML
     * @param data       {object}   data send to plugin
     * @param callbackFn {funtion}  callback function
     * @param jsObject   {object}   caller
     */
    mask:"",
    signXML: function (data, callbackFn, jsObject, parent_mask) {
        var me = this;
        if (parent_mask) {
            this.mask = parent_mask;
        }
        me.sendDataToPlugin(data, callbackFn, jsObject);
    },

    /*
     * Send data to plugin
     * @param data        {object}   json object
     * @param callbackFn  {funtion/string}  callback function/callbackFn name
     * @param jsObject    {object/string}   caller object/ jsObject name
     */
    sendDataToPlugin: function (data, callbackFn, jsObject) {
        var me = this,
            data = data || {};

        if (callbackFn && (!data.jsCallBackFn || data.jsCallBackFn == '')) {
            data.jsCallBackFn = me.getFnName(callbackFn);
        }
        if (jsObject && (!data.jsObject || data.jsObject == '')) {
            data.jsObject = me.getInstanceName(jsObject);
        }
        if (me.ports[me.portIndex]) {
            me.connect(me.ports[me.portIndex], data);
        } else {
            me.isCalling_Misa_Kyso = false;

            // MISA.CommonFn.showMessageBox(MISA.Constant.MessageBox.Warning, 'MISA meInvoice', me.message_NoSetup_misakyso, null, { width: 500 });
            misa_kyso.toolRequire();
            misa_kyso.hanlderErrorConnectKySo();
            //misa_kyso.showMessage(me.message_NoSetup_misakyso, 210, 500);
        }
    },

    /*
     * Check browser support websocket
     */
    checkBrowserSupportWS: function () {
        var t = get_browser(),
            isSupport = false;

        switch (t.name.toLowerCase()) {
            case "chrome":
                if (t.version > 44) {
                    isSupport = true;
                }
                break;
            case "firefox":
                if (t.version > 41) {
                    isSupport = true;
                }
                break;
            case "opera":
                if (t.version > 26) {
                    isSupport = true;
                }
                break;
            case "edge":
                if (t.version > 15) {
                    isSupport = true;
                }
                break;
            case "safari":
                if (t.version > 10) {
                    isSupport = true;
                }
                break;
        }

        return isSupport;
    },

    /*
     * Get funtion string name
     * @param fn {funtion}  funtion to get name
     */
    getFnName: function (fn) {
        if (typeof fn == 'string') {
            return fn;
        }

        var f = typeof fn == 'function';
        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    },

    /*
     * Get instant name object of class
     * @param obj {object}  instancef
     */
    getInstanceName: function (obj) {
        if (typeof obj == 'string') {
            return obj;
        }

        for (var name in window) {
            if (window[name] == obj) {
                return name;
            }
        }
    },
    showMessage: function (content, height, width) {
        html = '<div class="icon-warning-lagger"></div><div class="message">{0}<div>';
        $("#dialogMsg").html(String.format(html, String.format(content, _mainconfig.MISAKYSO_URL)));
        $("#dialogMsg").dialog({
            height: height,
            width: width,
            resizable: false,
            position: { my: "center", at: "center", of: window },
            modal: true,
            buttons: {
                "Đóng": function () {
                    $(this).dialog("close");
                }
            },
            open: function () {
                $(".ui-dialog-buttonpane button").focus();
            }
        });
    },

    clickDownloadKyso: function () {
        let downloadURL = '';
        if (MISA.SystemConfig) {
            downloadURL = MISA.SystemConfig.MISAKYSO_URL;
        }
        else { 
            MISA.mask.show();
            _AjaxRequest("/other/GetLinkMISAKYSO", { async: false}, {}, function (res) {
                MISA.mask.hide();
                if (this.mask) {
                    MISA.mask.hide($(this.mask));
                }
                if (res.success == true) {
                    if (res.data) {
                        downloadURL = res.data;
                    }
                } else {
                    MISA.CommonFn.showError(MISA.Resource.SystemResource.ErrorWarning);
                }
            });
        }
        if (MISA.CommonFn.getWindowsVersion() == 3 || window["oConfirmMinutesInvoice"]) {
            window.open(downloadURL);
        }
        else {
            MISA.mask.show();
            var detailConfig = {
                jsObjectName: 'oDownloadKySoDetail',
                getUrl: '/system/DownloadKySoDetail',
            };
            var dialogConfig = {
                width: 580,
                downloadURL: downloadURL
            };
            MISA.CommonFn.showPopup(detailConfig, null, null, MISA.Enum.EditMode.Add, null, dialogConfig);
        }
        
    },
    // hthuyen sửa bug 300292 sửa lại câu cảnh báo
    // hthuyen (22.01.2019) sửa đuwòng dẫn help
    // hthuyen(18.01.2019)
    showHelpBrower: function () {
        window.open(MISA.SystemConfig.HelpUrl + 'toi_khong_ky_dien_tu_duoc_thi_lam_the_nao.htm');
    },
    hanlderErrorConnectKySo: function () {

    },

    getAllCertificates: function (data, callbackFn, jsObject) {
        var me = this;
        me.sendDataToPlugin(data, callbackFn, jsObject);
    },

    toolRequire: function (isConnected) {
        if (this.mask) {
            MISA.mask.hide($(this.mask));
        }
        var detailConfig = {
            jsObjectName: 'oKySoWarning',
            getUrl: '/system/KySoWarning',
        };
        var dialogConfig = {
            width: 545,     
            isConnected: isConnected
        };
        MISA.CommonFn.showPopup(detailConfig, null, null, MISA.Enum.EditMode.Add, null, dialogConfig);
    },

    toolRequireOld: function () {
        var $dialog = $(MISA.Resource.OtherResource.MISAKYSO_InstallRequire);
        MISA.mask.hide($(this.mask));
        $('body').append($dialog);
        var buttons = [{
            text: MISA.Resource.OtherResource.MISAKYSO_Download,
            class: 'btn blue btn-kyso btn-download-kyso icon-download-kyso icon-white',
            click: misa_kyso.clickDownloadKyso
        }, {
            text: MISA.Resource.OtherResource.MISAKYSO_Cancel,
            class: 'btn btn-kyso white',
            click: function () {
                $(this).dialog("close");
                if (typeof callback === 'function') {
                    callback('cancel');
                }
            }
        }];
        var _config = {
            closeOnEscape: true,
            dialogClass: ' m-messag-dialog usb-kyso-error',
            modal: true,
            width: 505,
            resizable: false,
            //  title: title,
            buttons: buttons
        };
        $dialog.dialog(_config).show();
    }
}
