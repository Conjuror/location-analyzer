document.getElementById("demo").innerHTML="Hello World";

app_id = '212467558922080';
app_secret = 'eacb1a82179eba9b7af92e7e6cbcf882';
my_url = '//rawgithub.com/Conjuror/location-analyzer/patch-001/facebook/location-analyzer/index.html';

//auth user
token_url = 'https://graph.facebook.com/oauth/access_token?client_id=' + app_id
            + '&redirect_url=' + encodeURI(my_url)
            + '&client_secret=' + app_secret
            + '&code=["code"]';

data  = httpGet(token_url);

console.log(data);


