document.getElementById("demo").innerHTML="Hello World";

// function httpGet(theUrl)
// {
//   var xmlHttp = null;
 
//   xmlHttp = new XMLHttpRequest();
//   xmlHttp.open( "GET", theUrl, false );
//   xmlHttp.send( null );
//   return xmlHttp.responseText;
// }

// app_id = '212467558922080';
// app_secret = 'eacb1a82179eba9b7af92e7e6cbcf882';
// my_url = '//rawgithub.com/Conjuror/location-analyzer/patch-001/facebook/location-analyzer/index.html';

// dialog_url = 'https://www.facebook.com/dialog/oauth?client_id=' + app_id
//              + '&redirect_uri=' + encodeURI(my_url) ;

// //auth user
// token_url = 'https://graph.facebook.com/oauth/access_token?client_id=' + app_id
//             + '&redirect_url=' + encodeURI(my_url)
//             + '&client_secret=' + app_secret
//             + '&code=';

// data  = httpGet(token_url);

// console.log(data);


// SELECT author_uid, checkin_id, coords, timestamp FROM checkin WHERE author_uid=me();
// SELECT uid FROM user WHERE uid IN (SELECT uid1, uid2 FROM friend WHERE uid2=me() or uid1=me());


// // Sample output:
// {
//   "data": [
//     {
//       "author_uid": 100000010924156, 
//       "checkin_id": 672323356111356, 
//       "coords": {
//         "latitude": 25.026431768883, 
//         "longitude": 121.5481996044
//       }, 
//       "timestamp": 1380626710
//     }, 
//     {
//       "author_uid": 1160290234, 
//       "checkin_id": "10202048424669739", 
//       "coords": {
//         "latitude": 25.0766849, 
//         "longitude": 121.2324311
//       }, 
//       "timestamp": 1380715140
//     }, 
//     {
//       "author_uid": 1259254661, 
//       "checkin_id": "10200860953587003", 
//       "coords": {
//         "latitude": 25.077949, 
//         "longitude": 121.232405
//       }, 
//       "timestamp": 1380723103
//     }, 
//     {
//       "author_uid": 100000034338910, 
//       "checkin_id": 686694638008341, 
//       "coords": {
//         "latitude": 22.36815144702, 
//         "longitude": 120.59493196186
//       }, 
//       "timestamp": 1380768762
//     }, 
//     {
//       "author_uid": 100000128328164, 
//       "checkin_id": 710519958962275, 
//       "coords": {
//         "latitude": 25.077573675501, 
//         "longitude": 121.23194012077
//       }, 
//       "timestamp": 1380770236
//     }, 
//     {
//       "author_uid": 1577281165, 
//       "checkin_id": "10201432942376966", 
//       "coords": {
//         "latitude": 25.077098974955, 
//         "longitude": 121.23197929314
//       }, 
//       "timestamp": 1380771412
//     }, 
//     {
//       "author_uid": 1160290234, 
//       "checkin_id": "10202054286136272", 
//       "coords": {
//         "latitude": 52.308420314347, 
//         "longitude": 4.7651959929001
//       }, 
//       "timestamp": 1380777020
//     }, 
//     {
//       "author_uid": 1577281165, 
//       "checkin_id": "10201433496430817", 
//       "coords": {
//         "latitude": 37.454695862065, 
//         "longitude": 126.44310094457
//       }, 
//       "timestamp": 1380786079
//     }, 
//     {
//       "author_uid": 1659674174, 
//       "checkin_id": "10201436644392260", 
//       "coords": {
//         "latitude": 37.449940366587, 
//         "longitude": 126.45039234043
//       }, 
//       "timestamp": 1380787505
//     }, 
//     {
//       "author_uid": 100000128328164, 
//       "checkin_id": 710591062288498, 
//       "coords": {
//         "latitude": 37.4493773326, 
//         "longitude": 126.45088740902
//       }, 
//       "timestamp": 1380787699
//     }, 
//     {
//       "author_uid": 1035782491, 
//       "checkin_id": "10201438519618344", 
//       "coords": {
//         "latitude": 25.076897024, 
//         "longitude": 121.232168525
//       }, 
//       "timestamp": 1380791130
//     }, 
//     {
//       "author_uid": 547725659, 
//       "checkin_id": "10151864376160660", 
//       "coords": {
//         "latitude": 50.84545641562, 
//         "longitude": 4.3521151535261
//       }, 
//       "timestamp": 1380808022
//     }, 
//     {
//       "author_uid": 627848071, 
//       "checkin_id": "10152014322898072", 
//       "coords": {
//         "latitude": 25.081441283755, 
//         "longitude": 121.23733969764
//       }, 
//       "timestamp": 1380809582
//     }
//   ]
// }