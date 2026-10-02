<%@ Page Language="C#" MasterPageFile="/ApisThiTracNghiem/UC/emasterpage/html/emasterpage.Master" AutoEventWireup="true" CodeBehind="ketquathi.aspx.cs" Inherits="Apis.NewLogin.ApisThiTracNghiem.Modules.ketquathi.html.ketquathi" %>
 <asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">         
   
     <div class="user-info">
         <input type="hidden" id="txtStudentExamroom_Id" value="<%=strStudentExamroom_Id %>" />
        <input type="hidden" id="txtExamRoomInfo_Id" value="<%=strExamRoomInfo_Id %>" />
        <input type="hidden" id="txtThiSinh_Id" value="<%=strThiSinh_Id %>" />                 
         <div style="margin: 20px">
                                <div id="ThongTinBaiThi"></div>
         </div>
    </div>
    
     
<script src="../script/ketquathi.js?v=<%= Guid.NewGuid().ToString() %>"></script>
<script type="text/javascript">
    var main_doc = {};
    main_doc['ketquathi'] = new ketquathi();
    $(document).ready(function () {
        main_doc.ketquathi.init();
    });
</script> 

</asp:Content>
 