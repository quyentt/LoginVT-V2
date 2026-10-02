/*----------------------------------------------
--Author: 
--Phone: 
--Date of created:
----------------------------------------------*/
function testchucnang() { }
testchucnang.prototype = {
    strCauHinhChucNang_Id: '',
    dtChucNang: {},
    init: function () {
        var me = this;
        me.checkedCol_BgRow("tbldata_DMTB");
    },
    checkedCol_BgRow: function (strTable_Id) {//Check toàn bộ input theo cột dựa theo input trên thead
        var me = this;
        //Truyền vào id bảng hàm sẽ tạo sự kiện khi check input trên tiêu để bảng (th:input) sẽ lấy thự tự cột và check all toàn bộ input trong cột đó trong bảng
        $("#" + strTable_Id + " th").delegate("input", "click", function () {
            var checked_status = $(this).is(':checked');
            var child = this.parentNode;
            var parent = child.parentNode;
            var index = Array.prototype.indexOf.call(parent.children, child);
            $("#" + strTable_Id + " tbody tr").each(function () {
                var arrcheck = $(this).find("td:eq(" + index +")").find('input:checkbox');
                arrcheck.each(function () {
                    if ($(this).is(":hidden")) return;
                    $(this).attr('checked', checked_status);
                    $(this).prop('checked', checked_status);
                });
            });
        });
    },
    
    initMISAKYSOParam: function (config) {
        var param = {
            sessionId: (new Date()).setHours(0, 0, 0) + 'b7feb32b-f9f0-4e6e-9d68-8d074648efdc', // user id đăng nhập meinvoice
            productName: "MISA MEINVOICE",
            action: "SignXML",
            taxcode: "0101243150-136", // mst đăng nhập meinvoice truyền theo session
            sellerInfo: {
                sellerTaxCode: "0101243150-136", // mst đăng nhập meinvoice
                sellerLegalName: "Đỗ Thanh Nga", // người đại diện pháp luâth
                sellerAddressLine: "Tòa nhà N03 T1, Xuân Đỉnh, Hà Nội", // địa chỉ
                sellerPhoneNumber: "123456786" // sdt
            },
            files: null,
            jsObject: null,
            invoiceDatas: 1,
            jsCallBackFn: null,
            isSendEmail: false,
            isSelectFromCollection: false,
            serialNumbers: null,
            isSignTT68: false // là ký hoá đơn thông tư 68 không
        }
        for (p in config) {
            param[p] = config[p];
        }
        return param;
    },
    Base64: {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = this.Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        },

        // public method for decoding
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }

            output = this.Base64._utf8_decode(output);

            return output;
        },

        // private method for UTF-8 encoding
        _utf8_encode: function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function (utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
    },
    callback: function (data, a, b, c) {
        console.log(data);
        console.log(a);
        console.log(b);
        console.log(c);
        if (data.data) {
            var item = JSON.parse(data.data);
            if (item && item.file[0] && item.file[0].text) {
                dtHoaDon.data[0].InvoiceData = item.file[0].text;

                //
                var obj_save = dtHoaDon;
                obj_save.action = 'HDDT_HoaDon/PhatHanhHoaDon_Nhap';
                //default
                edu.system.makeRequest({
                    success: function (data) {
                        if (data.Success) {
                            saveNhap(obj_save, d.Data);
                            var strLink = edu.system.objApi["HDDT"];
                            strLink = strLink.substring(0, strLink.length - 3) + d.Data;;
                            if (strLink.indexOf('http') === -1) {
                                strLink = edu.system.strhost + strLink;
                            }
                            var win = window.open(strLink + d.Data, '_blank');
                            win.focus();
                        }
                        else {
                            edu.extend.notifyBeginLoading(data.Message);
                        }
                    },
                    error: function (er) {
                        edu.extend.notifyBeginLoading(JSON.stringify(er));
                    },
                    type: "POST",
                    action: obj_save.action,
                    versionAPI: obj_save.versionAPI,
                    contentType: true,
                    data: obj_save,
                    fakedb: [
                    ]
                }, false, false, false, null);
            }
        }
    },
};