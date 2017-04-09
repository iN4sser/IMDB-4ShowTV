// ==UserScript==
// @name         IMDb 4ShowTV
// @namespace    http://www.4show.tv
// @version      0.3
// @description  Find IMDb Movies and TV Shows on 4ShowTV
// @author       iN4sser
// @icon	 http://www.4show.tv/favicon.ico
// @match        http*://www.imdb.com/title/*
// @grant        none
// ==/UserScript==

var href = window.location.href.split('/');
var imdbtt = href[href.length-2];
var imdbLink = "http://www.omdbapi.com/?i=" + imdbtt + "&plot=short&r=json";
var xhr = new XMLHttpRequest();

xhr.open('GET', imdbLink);
xhr.onload = function ()
{
    var imdbJSON = window.JSON.parse(xhr.responseText);
    var urls = 
        '<br />Search on 4ShowTV: ' +
        '<a href="http://www.4show.tv/search?q=' +
        imdbJSON.Title +
        '" target="_blank">Click here</a><span class="ghost">|</span>' +
        '<a href="http://www.4show.tv/search?q=' +
        imdbJSON.Title +
        ' ' +
        imdbJSON.Year +
        '" target="_blank"></a>';

        document.getElementsByClassName("subtext")[0].innerHTML += urls;
};
xhr.send();
