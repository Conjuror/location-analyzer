document.getElementById("demo").innerHTML="Hello World";

function httpGet(theUrl)
{
  var xmlHttp = null;
 
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false );
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

app_id = '212467558922080';
app_secret = 'eacb1a82179eba9b7af92e7e6cbcf882';
my_url = '//rawgithub.com/Conjuror/location-analyzer/patch-001/facebook/location-analyzer/index.html';

dialog_url = 'https://www.facebook.com/dialog/oauth?client_id=' + app_id
             + '&redirect_uri=' + encodeURI(my_url) ;

//auth user
token_url = 'https://graph.facebook.com/oauth/access_token?client_id=' + app_id
            + '&redirect_url=' + encodeURI(my_url)
            + '&client_secret=' + app_secret
            + '&code=';

data  = httpGet(token_url);

console.log(data);


