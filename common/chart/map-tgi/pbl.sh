#!/usr/bin/expect
set pd me69JdlUwnw"
set uc huijie@datastory.com.cn
set timeout -1
spawn dsv pbl
expect "*确认组件信息*" 
send "Y\r"

expect "*账号*" 
send "$uc\r"

expect  "*密码*"
send "$pd\r"

expect "*关联组件到项目*"
send "否\r"

interact