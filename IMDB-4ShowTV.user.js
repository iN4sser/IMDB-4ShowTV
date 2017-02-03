// ==UserScript==
// @name         IMDb 4ShowTV
// @namespace    http://4show.tv
// @version      0.1
// @description  Find IMDb Movies and TV Shows on 4ShowTV
// @author       iN4sser
// @icon	 http://www.4show.cf/favicon.ico
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
        '<a href="http://www.4show.cf/search?q=' +
        imdbJSON.Title +
        '" target="_blank">By Title</a><span class="ghost">|</span>' +
        '<a href="http://www.4show.cf/search?q=' +
        imdbJSON.Title +
        ' ' +
        imdbJSON.Year +
        '" target="_blank"></a>';

        document.getElementsByClassName("subtext")[0].innerHTML += urls;
};
xhr.send();
