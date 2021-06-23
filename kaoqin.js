/*
README：https://github.com/yichahucha/surge/tree/master
https://e.xinrenxinshi.com/attendance/ajax-get-attendance-record-list

^https:\/\/e\.xinrenxinshi\.com\/attendance\/ajax-get-attendance-record-list url script-response-body https://gitee.com/burst3166/uuuu/raw/master/kaoqin.js
^https?://api\.m\.jd\.com/client\.action\?functionId=(wareBusiness|serverConfig|basicConfig) url script-response-body jd_price.js
https://e.xinrenxinshi.com/attendance/ajax-get-attendance-record-list
 */

const consolelog = true;
const url = $request.url;
const body = $response.body;

let obj = JSON.parse(body);
// obj.data.attendance_statistics["leave_early_num"] = 1.0;
// obj.data.records[1].signTimeList[0]["clockTime"]=1512139620;
// obj.data.records[1]["date"]=30;
let records = obj.data.records;
var total = 0;
for(let i = 0; i < records.length; i++) {
    if (records[i].isWorkday == 1) {
        if (records[i].signTimeList) {
            if (records[i]?.signTimeList?.length==2){

                let inteval = records[i].signTimeList[1]["clockTime"] - records[i].signTimeList[0]["clockTime"]; 
                var holiday = 0
                if (records[i]?.statusList?.length>0) {
                    let statusList=records[i]?.statusList
                    for(let k=0;k<statusList.length;k++){
                        if (statusList[k].hours<11) {
                            holiday+=statusList[k].hours*60    
                        }
                        
                    }
                }
                if (inteval>0) {
                    let j =  parseInt(inteval/60)-720+holiday;
                    records[i]["lunarShow"] = j+'';  
                    if (j>-120) {
                      total+=j  
                    }else{
                      records[i]["lunarShow"] = `异常(${j})`;   
                    }
                }else{
                    if (records[i].signTimeList[0]["clockTime"]>0) {
                      records[i]["lunarShow"] = "(缺卡)";   
                    }
                }
            }
        }
        
    }
    
}
obj.data.attendanceStatistics["leaveEarlyNum"] = total;
$done({ body: JSON.stringify(obj) });
