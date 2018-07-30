require("dotenv").config();

// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

// To set up packages using require method
var fs = require('fs');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keysFile = require('./keys');
var log = require('simple-node-logger').createSimpleFileLogger('log.txt');

// Setting up process variable, query and parameters
var command = process.argv[2];
var argument = "";

performAction(command, argument);

function performAction(command, argument) {
    // console.log(argument + "23");
    argument = getArguments();
    // console.log(argument + "25");
    switch (command) {
        // Case 1: To get users tweets.
        case "my-tweets":
            showTweets();
            break;

        // Case 2: To spotify a song of users choice.
        case "spotify-this-song":
            var songTitle = argument;
            if (songTitle === "") {
                // console.log(songTitle + "36");

                // console.log(songTitle + "38");
                defaultTrack("Ace of Base The Sign");
            } else {
                spotifyThis(songTitle);
            }
            break;

        // Case 3: To search movie details of a users choice.
        case "movie-this":
            var movieTitle = argument;
            if (movieTitle === "") {
                findMovie("Mr. Nobody");
            } else {
                findMovie(movieTitle);
            }
            break;

        // Case 4: To spotify a song of users choice.
        case "do-what-it-says":
            doThis();
            break;
    }
}

function getArguments() {
    var operation = process.argv;
    operation.shift();
    operation.shift();

    for (i = 1; i < operation.length; i++) {
        if (i > 1 && i < operation.length) {
            argument = argument + "+" + operation[i];
        }
        else {
            argument += operation[i];
        }
    }
    return argument;
}


function showTweets() {
    var client = new Twitter(keysFile.twitter);
    var params = { q: '@Nasa', count: 20 };
    client.get('search/tweets', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < params.count; i++) {
                logger ("\nCreated at: " + tweets.statuses[i].created_at
                + "\nStatus: " + tweets.statuses[i].text);
            }
        }
    })
}

function spotifyThis(songTitle) {
    // logger ("spotifyThis() is what is run.")
    var spotify = new Spotify(keysFile.spotify);
    // Calls Spotify API to retrieve a track.
    spotify.search({ type: 'track', query: songTitle, limit: 1 }, function (err, data) {
        if (err) {
            return logger ("An error occurred: " + err);
        }

        // // Prints the artist(s), track name, preview url, and album name.
        logger ("\nArtist(s): " + data.tracks.items[0].album.artists[0].name
            + "\nSong: " + data.tracks.items[0].name
            + "\nSpotify Preview URL: " + data.tracks.items[0].preview_url
            + "\nAlbum Name: " + data.tracks.items[0].album.name);
    });
}

function defaultTrack(songTitle) {
    // logger ("defaultTrack() is what is run.")
    var spotify = new Spotify(keysFile.spotify);
    // Calls Spotify API to retrieve a specific track, The Sign, Ace of Base.
    spotify.search({ type: 'track', query: songTitle, limit: 1 }, function (err, data) {
        if (err) {
            return logger ("An error occurred: " + err);
        }

        logger ("\nArtist(s): " + data.tracks.items[0].album.artists[0].name
            + "\nSong: " + data.tracks.items[0].name
            + "\nSpotify Preview URL: " + data.tracks.items[0].preview_url
            + "\nAlbum Name: " + data.tracks.items[0].album.name);
    });
}

function findMovie(movieName) {
    var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            logger ("\nHere is some info about " + JSON.parse(body).Title + ": "
                + "\nTitle: " + JSON.parse(body).Title
                + "\nYear: " + JSON.parse(body).Year
                + "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value
                + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
                + "\nCountry: " + JSON.parse(body).Country
                + "\nLanguage: " + JSON.parse(body).Language
                + "\nPlot: " + JSON.parse(body).Plot
                + "\nActors: " + JSON.parse(body).Actors
            );
        }
    })
}

function doThis() {
    fs.readFile('random.txt', 'utf8', function (err, data) {

        if (err) throw err;
        var output = data.split(",");
        console.log(output);
        command = output[0];
        // console.log(command + "149");
        argument = output[1];
        // console.log(argument + "151");
        performAction(command, argument);
        // console.log(argument + "153");
    })
}

function logger (dataText) {
    log.info(dataText);
    console.log(dataText)
    log.info("--------------------->")
}