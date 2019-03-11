var request = require('request');
var key = require('./secret').GITHUB_TOKEN;
var fs = require('fs');
var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (!repoOwner || !repoName) {
    console.log('Usage node download_avatars.js <owner> <repo>');
    return;
  }
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

getRepoContributors(repoOwner, repoName, function(err, result) {
  result.forEach(function(contributor){
    var avatar = contributor.avatar_url;
    var filePath = 'avatar/' + contributor.login + '.jpg';
    fs.mkdir('avatar', function(err) {
      downloadImageByURL(avatar, filePath);
    });
  });
});
