var request = require('request');
require('dotenv').config()
var fs = require('fs');
var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  //checks whether user has inputed args
  if (!repoOwner || !repoName) {
    console.log('Usage node download_avatars.js <owner> <repo>');
    return;
  }
  if (process.env.GITHUB_TOKEN === undefined || process.env.GITHUB_USERNAME === undefined) {
    console.log(".env file is either missing or doesn't contain GITHUB_TOKEN or GITHUB_USERNAME");
    return;
  }
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': process.env.GITHUB_USERNAME,
      'Authorization': process.env.GITHUB_TOKEN
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
  if (result.length === undefined) {
    console.log('The provided owner/repo does not exist.');
    return;
  }
  result.forEach(function(contributor){
    var avatar = contributor.avatar_url;
    var filePath = 'avatar/' + contributor.login + '.jpg';
    //creates dir to download images into
    fs.mkdir('avatar', function(err) {
      downloadImageByURL(avatar, filePath);
    });
  });
});
