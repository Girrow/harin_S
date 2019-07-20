
**인공지능 비서 - Ava**
===================
졸업프로젝트 팀 99
----------
가천대학교 컴퓨터공학과 18년도 졸업프로젝트

-------------
무드등 상태 확인 API

 - URL : '/net/led/state'
 - method : Get
 - param : 없음
 - return

>     { 	
>  		   'nowColor' : '#000000',
>          'isOn' : false 	
>      }

- nowColor : 현재 색상
- isOn : 무드등 상태
		- false : 꺼져 있는 상태
		- true : 켜져 있는 상태


----------

무드등 색상 변경 API

- URL : '/net/led/change_color'
- method : post
- param : 
	- color : 16진수 색상값(hex)
- return

sucess

>      { 	
>           result : 'success',
>       	nowColor : '#000000'
>      } 


fail

>      { 	
>           result : 'fail', 
>          	why : '원인',
>           num : 'index'
>      }

- result : 성공 : success, 실패 : fail
- nowColor
	- #000000 : 꺼짐
	- #000001 ~ #FFFFFF : 켜진 상태 (사용자 설정값)
- num : 에러 인덱스
- why : 에러 원인 설명
   - 0 : ava OFF (아바가 꺼져 있습니다.)
   - 1 : led OFF (무드등이 꺼져있습니다.)


----------
테마 조회 API

- URL : ＇/net/led/theme＇
- method : get
- param : 
	- mac : 사용자 기기의 MAC 주소, 
	- theme : 테마 이름
- return

success
   
>     { 	
>          result : 'success’,
>          theme : ‘백색광’,
>      	   color : ‘#FFFFFF’
>     }

  fail
    
>     {
>       	result : 'fail',
>        	why : '원인',
>         	num : 'index'
>     }

- result : 
	- 성공 : success
	- 실패 : fail
- num : 에러 인덱스
- why : 에러 원인 설명
	- 0 : ava OFF (아바가 꺼져 있습니다.)
	- 1 : 해당되는 사용자나 테마가 없습니다.


----------

테마 저장 API

- URL : ＇/net/led/save_theme＇
- method : post
- param : 
	- mac : 사용자 기기의 MAC 주소, 
	- theme : 테마 이름, 
	- color : 16진수 색상값(hex)
- return
     
success
>     {
>         result : 'success’, 
>     } 

fail
>     {
>       	result : 'fail',
>        	why : '원인',
>        	num : 'index'
>     }

- result : 
	- 성공 : success, 
	- 실패 : fail
- num : 에러 인덱스
- why : 에러 원인 설명
	- 0 : ava OFF (아바가 꺼져 있습니다.)


----------

테마 삭제 API

- URL : ＇/net/led/del_theme＇
- method : post
- param : 
	- mac : 사용자 기기의 MAC 주소, 
	- theme : 테마 이름
- return

success
>      {
>       	result : 'success’
>      }

fail 
>      { 	
>           result : 'fail',
>           why : '원인',
>           num : 'index'
>      }

- result : 
	- 성공 : success 
	- 실패 : fail
- num : 에러 인덱스
- why : 에러 원인 설명
	- 0 : ava OFF (아바가 꺼져 있습니다.)
	- 1 : 해당되는 사용자나 테마가 없습니다.


----------

테마 갱신 API

- URL : ＇/net/led/update_theme＇
- method : post
- param : 
	- mac : 사용자 기기의 MAC 주소, 
	- theme : 테마 이름,
	- color : 갱신할 색상의 16진수 값(hex)
- return

success
>      {
>       	result : 'success’ 
>      } 

fail
>      {
>       	result : 'fail',
>        	why : '원인',
>        	num : 'index'
>      }

- result : 
	- 성공 : success 
	- 실패 : fail
- num : 에러 인덱스
- why : 에러 원인 설명
	- 0 : ava OFF (아바가 꺼져 있습니다.)
	- 1 : 해당되는 사용자나 테마가 없습니다.


----------
테마 저장 DB

Mysql Database

Themes.db

테이블 속성
<table border=1>
<tr><th>칼럼</th><th>형태</th><th>키</th><th colspan=2>속성</th></tr>
<tr><td>Num</td><td>INT</td><td>PK</td><td>Not Null</td><td>Auto_Increment</td></tr>
<tr><td>User</td><td>Text</td><td></td><td>Not Null</td><td></td></tr>
<tr><td>Theme</td><td>Text</td><td></td><td>Not Null</td><td></td></tr>
<tr><td>Color</td><td>Text</td><td></td><td>Not Null</td><td></td></tr>
</table>

데이터
<table border=1>
<tr><th>Num</th><th>User</th><th>Theme</th><th>Color</th></tr>
<tr><td>1</td><td>30-52-CB-1B-F8-97
</td><td>백색광</td><td>#FFFFFF</td></tr>
<tr><td>2</td><td>98-83-89-15-25-C6
</td><td>붉은 빛</td><td>#FF0000</td></tr>
</table>

- Num (테마 번호) : INT
- User (사용자 MAC 주소) : TEXT
- Theme (테마 hax 색상) : TEXT
- Color (테마 hax 색상) : TEXT


- Example Query
	- 조회 : Select Theme, Color From Themes Where User = ‘30-52-CB-1B-F8-97’;
	- 삽입 : Insert into Themes(User, Name, Color) Values (“30-52-CB-1B-F8-97”, “백색광”,＂#FFFFFF");
	- 삭제 : Delete From Themes Where User = ‘30-52-CB-1B-F8-97’ AND Theme = ‘백색광’;
	- 갱신 : Update Themes Set Color = ‘#F03030’ Where Theme = ‘붉은 빛’;
