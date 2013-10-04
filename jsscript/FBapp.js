var myPic;
var markersArray = [];

var timeThreshold = 1380603600; // Oct 1st

window.fbAsyncInit = function() {
  // init the FB JS SDK
  FB.init({
    appId: '212467558922080', // App ID from the app dashboard
    channelUrl: '//rawgithub.com/Conjuror/location-analyzer/api-005/facebook/location-analyzer/channel.html', // Channel file for x-domain comms
    status: true, // Check Facebook Login status
    xfbml: true // Look for social plugins on the page
  });

  FB.login(function (response) {
    if (response.authResponse) {
      meUid = response.authResponse.userID;
      var accessToken = response.authResponse.accessToken;
      // console.log("accessToken:" + accessToken);
  
      setDefaultLocation(meUid);
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
      // FB.login();
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
    markersArray[uid] = new google.maps.Marker({
      position: latlng,
      map: map
    });
    markersArray[uid].laPositionArray = [];
    markersArray[uid].laPositionArray.push({'latlng': latlng, 'timestamp': timestamp});
    getIconFromFacebook(uid);
  }
  else {
    markersArray[uid].laPositionArray.push({'latlng': latlng, 'timestamp': timestamp});
  }
}

function getCurrentLocationFromFacebook(uid, callback) {
  FB.api({
    method: 'fql.query',
    query: 'SELECT current_location FROM user WHERE uid=me();'
  }, function (response) {
    current_location = [];
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

    // console.log("2. UID: " + uid + " Len: " + markersArray[uid].laPositionArray.length);
    setTimeout(startAnimation, 15000);
  });
}

var timeBlock;
var playTime = 1200000 // ten minute
var fps = 20;

function startAnimation() {
  var now = new Date().getTime();

  timeBlock = (now-timeThreshold) / playTime / fps;
  console.log("Start calculation... TimeBlock: " + timeBlock);

  // for (var uid in markersArray) {
  //   console.log("->" + markersArray[uid].laPositionArray.length);
  //   // console.log(markersArray);
  // }

  // setup time interval
  for (var uid in markersArray) {
    markersArray[uid].curPos = 0;
    tick = Math.ceil((markersArray[uid].laPositionArray[0].timestamp - timeThreshold) / timeBlock);
    console.log("UID: " + uid + " idles for " + tick + " ticks");
    // console.log("4. UID: " + uid + " Len: " + markersArray[uid].laPositionArray.length);
    // setTimeout(function(){getNextPoint(uid);}, (tick*1000/fps));
    doSetTimeout(uid, tick*100/fps);
  }
  console.log("Start Animation. Interval Time: " + 1000 / fps);
}

function doSetTimeout(uid, time) {
  setTimeout(function(){getNextPoint(uid);}, time)
}

function getNextPoint(uid) {
  // console.log("5. UID: " + uid + " Len: " + markersArray[uid].laPositionArray.length);
  if (markersArray[uid].laPositionArray.length > 1) {
    // moving to next position
    curLatLng = markersArray[uid].laPositionArray[markersArray[uid].curPos].latlng;
    nxtLatLng = markersArray[uid].laPositionArray[markersArray[uid].curPos+1].latlng;
    curTimestamp = markersArray[uid].laPositionArray[markersArray[uid].curPos].timestamp;
    nxtTimestamp = markersArray[uid].laPositionArray[markersArray[uid].curPos+1].timestamp;


    tick = Math.ceil((nxtTimestamp - curTimestamp) / timeBlock);
    console.log("Move from " + curLatLng + " to " + nxtLatLng + " in " + tick);
    lat = (nxtLatLng.lat - curLatLng.lat) / tick;
    if (Math.abs(nxtLatLng.lng - curLatLng.lng) > 180) {
      // pass 180
      lng = ((nxtLatLng.lng - curLatLng.lng) / Math.abs(nxtLatLng.lng - curLatLng) * (360 - Math.abs(nxtLatLng.lng - curLatLng.lng))) / tick;
    } else {
      lng = (nxtLatLng.lng - curLatLng.lng) / tick;
    }

    counter = 0;
    interval = window.setInterval(function() {
      newLng = curLatLng.lng + lng;
      if (newLng > 180)
        newLng -= 360;
      else if (newLng < -180)
        newLng += 360;
      var latlng = new google.maps.LatLng(curLatLng.lat+lat*counter, newLng);
      markersArray[uid].setPosition(latlng);
      counter++;
      if (counter >= tick) {
        window.clearInterval(interval);
        setTimeout(function(){getNextPoint(uid);}, 1000);
        markersArray[uid].curPos+1;
      }
    }, 1000/fps);
  }

}
