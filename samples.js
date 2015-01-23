
// Example usage of google api
var oauth2promise = GoogleApiWrapper.get('oauth2', 'v2');
oauth2promise.then(function(oauth2){console.log(oauth2);});

// Example usage of cloud endpoint api
// Works on devserver and on production environments without custom domain
var myapiPromise = GoogleApiWrapper.get('myapi', 'v1', GoogleApiWrapper.apiUrl);
myapiPromise.then(function(myapi){console.log(myapi);});