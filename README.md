# 개인 과제) ch3-2-item-simulator
## 1. 개요
Ch3-2 게임 서버 숙련 주차 두 번째 개인 과제입니다. 이전에 만들었던 [ch3-item-simulator](https://github.com/donkim1212/ch3-item-simulator)의 연장선입니다.
<br>
<br>

#### 주요 변경점
 - 기존에 사용하던 MongoDB와 mongoose 대신 AWS RDS(MySQL)와 Prisma를 사용하도록 구성합니다.
 - JWT를 이용하여 인증/인가 middleware를 구현하고, 인증이 필요한 api 호출에 대해 해당 middleware의 실행이 선행되도록 변경합니다.
 - users api를 통한 회원 가입 및 로그인 기능을 구현합니다.
 - shops api를 통한 아이템 구매 및 판매 기능을 구현합니다.
 - 장비 아이템과 인벤토리 아이템을 저장하는 DB 테이블을 추가합니다.
 - works api를 통하여 캐릭터가 돈을 벌 수 있는 기능을 구현합니다.
 - inventories api를 통해 캐릭터가 보유한 아이템의 목록을 불러오는 기능을 추가합니다.

상세 내용은 아래의 API 명세서 링크를 참고해주세요. 
<br>
<br>
<br>

## 2. API 명세서
### API 목록

<table>
  <tr>
    <td>users</td><td>characters</td><td>items</td><td>equipments</td><td>inventories</td><td>shops</td><td>works</td>
  </tr>
</table>
<br>
<br>

### Users API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/14))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>회원 가입</td><td>/api/users</td><td>POST</td>
  </tr>
  <tr>
    <td>로그인</td><td>/api/users</td><td>POST</td>
  </tr>
</table>
<br>
<br>

### Characters API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/15))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>캐릭터 생성</td><td>/api/characters</td><td>POST</td>
  </tr>
  <tr>
    <td>캐릭터 삭제</td><td>/api/characters/:character_id</td><td>DELETE</td>
  </tr>
  <tr>
    <td>캐릭터 조회</td><td>/api/characters/:character_id</td><td>GET</td>
  </tr>
</table>
<br>
<br>

### Items API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/16))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>아이템 생성</td><td>/api/items</td><td>POST</td>
  </tr>
  <tr>
    <td>아이템 전체 조회</td><td>/api/items</td><td>GET</td>
  </tr>
  <tr>
    <td>아이템 조회</td><td>/api/items/:itemCode</td><td>GET</td>
  </tr>
  <tr>
    <td>아이템 수정</td><td>/api/items/:itemCode</td><td>PUT</td>
  </tr>
</table>
<br>
<br>

### Equipments API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/17))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>장비 조회</td><td>/api/equipments/:characterId</td><td>GET</td>
  </tr>
  <tr>
    <td>장비 장착/탈착</td><td>/api/equipments/:characterId</td><td>PUT</td>
  </tr>
</table>
<br>
<br>

### Inventories API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/18))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>인벤토리 조회</td><td>/api/inventories/:characterId</td><td>GET</td>
  </tr>
</table>
<br>
<br>

### Shops API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/19))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>아이템 구매</td><td>/api/shops/:characterId</td><td>POST</td>
  </tr>
  <tr>
    <td>아이템 판매</td><td>/api/shops/:characterId</td><td>PATCH</td>
  </tr>
</table>
<br>
<br>

### Works API ([상세 정보 보기](https://github.com/donkim1212/ch3-2-item-simulator/issues/20))

<table>
  <tr>
    <td><b>Feature</b></td><td><b>Path</b></td><td><b>Method</b></td>
  </tr>
  <tr>
    <td>돈 벌기</td><td>/api/works/:characterId</td><td>PATCH</td>
  </tr>
</table>
<br>
<br>
<br>

## 3. ER Diagram (rough)
![project erd drawio_2_150 drawio](https://github.com/donkim1212/ch3-2-item-simulator/assets/32076275/122a65c6-3c92-439a-ab2c-1fd06a589377)
