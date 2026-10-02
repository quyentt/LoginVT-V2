#!/bin/bash
# Chạy TUẦN TỰ hai trang kiểm (kiem-dong-bo, thu-crud) cho mọi phân hệ — cần máy chủ thử đang bật (serve.ps1). Lâu (~40 phút):
# chạy nền, quá 10 phút bị ngắt thì sửa danh sách "for x in" để chạy nốt phần còn lại. Kết quả: $TEMP/claude/hq-<tiền tố>-{kdb,crud}.txt
cd /d/Projects/apis/loginVTGit
for x in "R33 TC" "R02 CCB" "R04 CSV" "R07 CC" "R44 CMS" "R19 DKH" "R09 HLTL" "R18 RL" "R17 XLHV" "R35 HB" "R13 QLD" "R36 NS" "R38 SV" "R21 KHCT" "R24 NH" "R31 TS" "R23 NCKH" "R14 TP"; do
  set -- $x
  MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/kiem-dong-bo.html?vt=$1&tien=$2&coTep=1" 9481 > "$TEMP/claude/hq-$2-kdb.txt" 2>&1
  MSYS_NO_PATHCONV=1 node _harness/chay-cdp.js "http://localhost:8787/_harness/thu-crud.html?vt=$1&tien=$2" 9482 > "$TEMP/claude/hq-$2-crud.txt" 2>&1
  echo "$2 $(grep TONG "$TEMP/claude/hq-$2-kdb.txt" | head -1) || $(grep TONG "$TEMP/claude/hq-$2-crud.txt" | head -1)" >> "$TEMP/claude/hq-tong.txt"
done
echo XONG >> "$TEMP/claude/hq-tong.txt"
