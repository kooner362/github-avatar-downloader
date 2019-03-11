var request = require('request');
var key = require('./secret').GITHUB_TOKEN;
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': key
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request(url).pipe(fs.createWriteStream(filePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  result.forEach(function(contributor){
    var avatar = contributor.avatar_url;
    var filePath = 'avatar/' + contributor.login + '.jpg';
    fs.mkdir('avatar', function(err) {
      downloadImageByURL(avatar, filePath);
    });
  });
});
