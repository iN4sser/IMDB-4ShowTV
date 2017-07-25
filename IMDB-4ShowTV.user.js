// ==UserScript==
// @author         iN4sser
// @license        GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @name           IMDb 4ShowTV
// @version        0.0.5
// @description    Find IMDb Movies and TV Shows on 4ShowTV
// @icon           http://www.4show.tv/favicon.ico
// @include        http://www.imdb.*/title/*
// @include        http://imdb.*/title/*
// @include        http://akas.imdb.*/title/*
// @include        http://www.akas.imdb.*/title/*
// @grant          GM_setValue
// @grant	       GM_xmlhttpRequest
// @grant          GM_getValue
// @grant   	   GM_addStyle
//original script by r3b31 forked by julian-a-schulte, includes code from other open source scripts
// @namespace http://www.4show.tv
// ==/UserScript==

//gets the title and year of the movie
function getTitle () { 
    var metas = document.getElementsByTagName('meta'); 

    for (i=0; i<metas.length; i++) { 
        if (metas[i].getAttribute("property") == "og:title") { 
            return metas[i].getAttribute("content"); }} 
    return "";}

//gets the type of movie
function getType () { 
    var metas = document.getElementsByTagName('meta'); 

    for (i=0; i<metas.length; i++) { 
        if (metas[i].getAttribute("property") == "og:type") { 
            return metas[i].getAttribute("content"); }} 
    return "";}

//gets imdb code
var imdb_regex = /\/title\/tt(\d{7})\//;
var id = imdb_regex.exec(window.location.href)[1];

//where to display the icons
var div = document.evaluate ("//div[@class='subtext']", document, null,
                             XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//get title only
var title = document.evaluate ("//div[@class='title_wrapper']//h1", document, null,
                               XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
var year = getTitle();

if(div && title && year){

    title = title.cloneNode(true);

    var spant = document.evaluate (".//span", title, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(spant)
    {title.removeChild(spant);}

    var titlet = title.innerHTML;

    titlet = titlet.replace(/^\s+|\s+$/g, ''); //trim the title
    titlet = titlet.replace(/[\/\\#,+()$~%.'":*?<>{}]/g, ""); //remove bad chars
    titlet = titlet.replace("&nbsp;","");
    titlet = titlet.replace("&amp;","%26");//replace & with code
    titlet = titlet.replace("!","");
    year = year.replace(/[^0-9.]/g, "");//keep numbers only
    year = year.substr(year.length - 4);//only keep year

    if( getType().indexOf("video.tv_show") >= 0){var tv=1;var txt = titlet;}
    else{var tv=0;var txt = (titlet+" ");}//only use year in movies

    var tab = div.insertBefore(document.createElement("table"), div.firstChild);

    tab.id = "gm_links";
    _addStyle("@namespace url(http://www.w3.org/1999/xhtml); #gm_links td { width:50px; padding:0px } #gm_links img { margin:0 1px 0 0 } #gm_links a { vertical-align:top; font-weight:bold };");

    var tr = tab.appendChild(document.createElement("tr"));

    //4ShowTV
    img = "http://i.imgur.com/Ijb7ENt.png";

    buildCell(tr, "4ShowTV","http://www.4show.tv/search?q="+txt+" ", img);

}

function buildCell(container, title, href, image){
    var a = document.createElement("a");

    if ((title == "Subs4free")||(title == "Btscene")||(title == "Podnapisi")) {
        href = href.replace(/\s/g, "+");} //replace spaces with +'s
    a.href = href; 
    a.setAttribute("target","_blank");
    a.title=title;	
    var img = document.createElement("img");
    img.src = image;
    img.setAttribute("height","16");//needed for Chrome
    img.setAttribute("witdh","16");//needed for Chrome

    a.appendChild(img);
    var cell = container.insertCell(0);
    cell.appendChild(a);
}

function _addStyle(css){
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.innerHTML = css;
            heads[0].appendChild(node); }}}
