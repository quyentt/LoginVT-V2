# . id.sh ; id <6 ký tự vai trò> <đoạn đường dẫn>  → id chức năng trên menu host (từ kết quả đọc sâu)
id() { node -e "const kq=JSON.parse(require('fs').readFileSync(process.env.TEMP+'/ums-kiem-host/ketqua-$1-sau.json','utf8'));const r=kq.find(r=>r.path.indexOf('$2')>=0);console.log(r?r.id:'')"; }
