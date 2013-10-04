// var friendList = [][];

var myPic;
var current_location = [];
var markersArray = [];

var timeThreshold = 1380344400; // Oct 1st

window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId: '212467558922080', // App ID from the app dashboard
    channelUrl: '//rawgithub.com/Conjuror/location-analyzer/api-002/facebook/location-analyzer/channel.html', // Channel file for x-domain comms
    status: true, // Check Facebook Login status
    xfbml: true // Look for social plugins on the page
  });

  FB.login(function (response) {
    if (response.authResponse) {
      var meUid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      // console.log("accessToken:" + accessToken);

      setDefaultLocation(meUid);

      // Get Friends
      getAllFriendsLocation();
    }
  }, {
    scope: 'user_location, user_friends, user_status, friends_status'
  });

  // Additional initialization code such as adding Event Listeners goes here

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function (response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      FB.login();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      FB.login();
    }
  });
};

// Load the SDK asynchronously
(function(d) {
  var js, id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement('script');
  js.id = id;
  js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is successful. 
// This testAPI() function is only called in those cases. 

function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function (response) {
    console.log('Good to see you, ' + response.name + '.');
  });
}

function locationGetter() {
  console.log('Start to query location');
  FB.api({
    method: 'fql.query',
    query: 'SELECT author_uid, checkin_id, coords, timestamp FROM checkin WHERE author_uid=me();'
  }, function (response) {
    console.log(response);
  });
}

function getFriends() {
  console.log('Start to query friends');
  FB.api({
    method: 'fql.query',
    query: 'SELECT uid FROM user WHERE uid IN (SELECT uid1, uid2 FROM friend WHERE uid2=me() or uid1=me());'
  }, function (response) {
    for (var i in response) {
      friendList[friendList.length][0] = response[i].uid;
    }
    console.log(friendList.length);
  });
}

function getIconFromFacebook(uid, callback) {
  FB.api({
    method: 'fql.query',
    query: 'SELECT pic_square FROM user WHERE uid=' + uid
  }, function (response) {
    pic = response[0].pic_square;
    markersArray[uid].setIcon(pic);
  });
}

function setCurrentLocation(uid, latlng, timestamp) {
  if (!(uid in markersArray)) {
    markersArray[uid] = undefined;
    marker = new google.maps.Marker({
      position: latlng,
      map: map
    });
    marker.laPositionArray = [];
    marker.laPositionArray[0] = [];
    marker.laPositionArray[0]['latlng'] = latlng;
    marker.laPositionArray[0]['timestamp'] = timestamp;
    markersArray[uid] = marker;
    getIconFromFacebook(uid);
  }
  else {
    marker = markersArray[uid];
    len = marker.laPositionArray.length;
    marker.laPositionArray[len] = [];
    marker.laPositionArray[len]['latlng'] = latlng;
    marker.laPositionArray[len]['timestamp'] = timestamp;
  }
}

function getCurrentLocationFromFacebook(uid, callback) {
  FB.api({
    method: 'fql.query',
    query: 'SELECT current_location FROM user WHERE uid=me();'
  }, function (response) {
    current_location["latitude"] = response[0]["current_location"].latitude;
    current_location["longitude"] = response[0]["current_location"].longitude;
    latlng = new google.maps.LatLng(current_location["latitude"], current_location["longitude"]);
    callback(uid, latlng, timeThreshold);
  });
}

function setDefaultLocation(meUid) {
  getCurrentLocationFromFacebook(meUid, setCurrentLocation);
}

function getAllFriendsLocation() {
  console.log("Start to query friends' location");
  FB.api({
    method: 'fql.query',
    query: 'SELECT author_uid, coords, timestamp, tagged_uids FROM checkin WHERE author_uid IN (SELECT uid1, uid2 FROM friend WHERE uid2=me() or uid1=me()) and timestamp > ' + timeThreshold+ ' ORDER BY timestamp;'
  }, function (response) {
    for (var i in response) {
      uid = response[i].author_uid;
      latlng = new google.maps.LatLng(response[i]['coords'].latitude, response[i]['coords'].longitude);
      timestamp = response[i].timestamp;
      setCurrentLocation(uid, latlng, timestamp);

      tagged_uids = response[i].tagged_uids;
      for (var j in tagged_uids) {
        tagged_uid = tagged_uids[j];
        setCurrentLocation(tagged_uid, latlng, timestamp);
      }
    }

    setTimeout(startAnimation(), 15000);
  });
}

var timeBlock;
var playTime = 60000; // one minute
var fps = 20;

var intervalStoper = [];

function startAnimation() {
  console.log("Start calculation...");
  var now = new Date().getTime();

  timeBlock = (now - timeThreshold) / (playTime * fps);

  // setup time interval
  for (var i in markersArray) {
    marker = markersArray[i];
    marker.animation = [];
    countPos = 0;
    for (var j = 0 ; j < playTime*fps ; j++) {
      countTime = timeThreshold + timeBlock * j;
      if (marker.laPositionArray[countPos].timestamp < countTime) {
        // not start to move
        latlng = marker.laPositionArray[countPos].latlng;
        marker.animation.push(latlng);
      }
      else if (countPos + 1 == marker.laPositionArray.length) {
        // reach the end
        latlng = marker.laPositionArray[countPos].latlng;
        while (j++ < playTime*fps) {
          marker.animation.push(latlng);
        }
      }
      else {
        // moving to next position
        curLatLng = marker.laPositionArray[countPos].latlng;
        nxtLatLng = marker.laPositionArray[countPos+1].latlng;
        curTimestamp = marker.laPositionArray[countPos].timestamp;
        nxtTimestamp = marker.laPositionArray[countPos+1].timestamp;

        if ((nxtTimestamp - curTimestamp) <= timeBlock) {
          marker.animation.push(curLatLng);
          countPos += 1;
        }
        else {
          lat = 0;
          lng = 0;
          slot = Math.floor((nxtTimestamp - curTimestamp) / timeBlock);
          lat = (nxtLatLng.lat - curLatLng.lat) / slot;
          if (Math.abs(nxtLatLng.lng - curLatLng.lng) > 180) {
            // pass 180
            lng = ((nxtLatLng.lng-curLatLng.lng)/Math.abs(nxtLatLng.lng-curLatLng)*(360-Math.abs(nxtLatLng.lng-curLatLng.lng))) / slot;
          }
          else {
            lng = (nxtLatLng.lng - curLatLng.lng) / slot;
          }
          for (var k = 0 ; k < slot ; k++, j++) {
            latlng = new google.maps.LatLng(curLatLng.lat+lat*k, curLatLng.lng+lng*k);
            marker.animation.push(latlng);
          }
          countPos += 1;
        }
      }
    }
  }


  time = Math.floor(playTime/fps)
  console.log("Start Animation. Interval Time: " + time);
  for (var i in markersArray) {
    intervalStoper[i] = setTimeout(exeAnimation(i), time);
  }

  setTimeout(cleanInterval, playTime);
}

function exeAnimation(i) {
  marker = markersArray[i];
  latlng = marker.animation.shift();
  console.log("UID: " + i + " AT: " + latlng);
  marker.setPosition(latlng);
}

function cleanInterval() {
  for (var i in intervalStoper) {
    cleanInterval(intervalStoper[i]);
  }
}