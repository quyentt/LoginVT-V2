/*----------------------------------------------
--Author: nnthuong
--Phone: 
--Date of created: 24/08/2018
--API URL: SYS_Crypto_AES <==> Crypto/Decryption
--Note:
--Updated by:
--Date of updated:
----------------------------------------------*/
function Crypto() { }
Crypto.prototype = {

    init: function () {
        var me = this;
        /*------------------------------------------
		--Discription: Initial system
		-------------------------------------------*/
        edu.system.page_load();
        /*------------------------------------------
        --Discription: Initial local 
        -------------------------------------------*/
        me.page_load();
        /*------------------------------------------
		--Discription: [0] Common
		--Author:
		-------------------------------------------*/
        $("#btnEncrypt").click(function () {
            var valid = [
                { "MA": "txtDecrypt_En", "THONGTIN1": "1" },
                //1-empty, 2-float, 3-int, 4-date, seperated by "#" character... 
            ];
            if (edu.util.validInputForm(valid)) {
                me.emcrypt();
            }
            else {
                edu.system.alert("Vui lòng nhập chuỗi cần mã hóa!");
            }
        });
        $("#btnDecrypt").click(function () {
            //EM-empty, FL-float, IN-int, DA-date, seperated by "#" character...
            var valid = [
                { "MA": "txtEncrypt_De", "THONGTIN1": "EM" }
            ];
            if (edu.util.validInputForm(valid)) {
                me.decrypt();
            }
            else {
                edu.system.alert("Vui lòng nhập chuỗi cần giải mã!");
            }
        });
        $("#btnRewrite").click(function () {
            me.rewrite();
        });
        $("#btnDel_Decrypt").click(function () {
            $("#txtDecrypt_En").val("");
        });
    },
    /*------------------------------------------
    --Discription: [0] Hàm chung 
    --Author:
    -------------------------------------------*/
    rewrite: function () {
        var arrId = ["txtResult_En", "txtEncrypt_De", "txtResult_De"];
        $("#txtDecrypt_En").val("Data Source=iubackupdb;Unicode=True;User ID=duandhytcc_camxoa;Password=iu;");
        edu.util.resetValByArrId(arrId);
    },
    page_load: function () {
        var me = this;
        me.showHide_Box("zone-bus-mtp", "zone_input_mtp");
    },
    showHide_Box: function (cl, id) {
        //cl - list of class to hide() and id - to show()
        $("." + cl).slideUp();
        $("#" + id).slideDown();
    },
    emcrypt: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Crypto_AES/Encrypt',
            

            'decrypt': edu.util.getValById("txtDecrypt_En"),
            'secret': edu.util.getValById("txtSecret_En")
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#txtResult_En").css("color", "red");
                    edu.util.viewValById("txtResult_En", data.Message);
                }
                else {
                    edu.system.alert("SYS_Crypto_AES.Encrypt: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("SYS_Crypto_AES.Encrypt (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    },
    decrypt: function () {
        var me = this;
        //--Edit
        var obj_list = {
            'action': 'SYS_Crypto_AES/Decrypt',
            

            'encrypt': edu.util.getValById("txtEncrypt_De"),
            'secret': edu.util.getValById("txtSecret_De")
        };

        
        edu.system.makeRequest({
            success: function (data) {
                if (data.Success) {
                    $("#txtResult_De").css("color", "green");
                    edu.util.viewValById("txtResult_De", data.Message);
                }
                else {
                    edu.system.alert("SYS_Crypto_AES.Decrypt: " + data.Message, "w");
                }
                
            },
            error: function (er) {
                
                edu.system.alert("SYS_Crypto_AES.Decrypt (er): " + JSON.stringify(er), "w");
            },
            type: "GET",
            action: obj_list.action,
            
            contentType: true,
            
            data: obj_list,
            fakedb: [

            ]
        }, false, false, false, null);
    }
};