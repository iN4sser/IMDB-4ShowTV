// ==UserScript==
// @author         iN4sser
// @license        GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @name           IMDb 4ShowTV
// @version        0.4.0
// @description    Find IMDb Movies and TV Shows on 4ShowTV
// @icon           https://www.4show.tv/assets/images/favicon.ico
// @updateURL      https://github.com/iN4sser/IMDB-4ShowTV/raw/master/IMDB-4ShowTV.user.js
// @downloadURL    https://github.com/iN4sser/IMDB-4ShowTV/raw/master/IMDB-4ShowTV.user.js
// @include        *://www.imdb.*/title/*
// @include        *://imdb.*/title/*
// @include        *://akas.imdb.*/title/*
// @include        *://www.akas.imdb.*/title/*
// @include        *://subscene.*/subtitles/title?q=*
// @grant          GM_setValue
// @grant	         GM_xmlhttpRequest
// @grant          GM_getValue
// @grant   	     GM_addStyle
// @run-at         document-end
// @require	       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/427315-url-based-search-for-some-websites/code/URL%20Based%20Search%20for%20Some%20Websites.js?version=936416
// @namespace *://www.4show.tv
// ==/UserScript==

(function() {
    'use strict';
 
	const crtl = {torrent: 1, anime: 1, drama: 1,}; // If you dont want a group, turn the value of it to 0.
 
//        URL Variables:         @Movie             @Series          @Episode         @Non-English
 
//        %title%         ->     Fight Club         Dexter           Dexter           Parasite
//        %year%          ->     1999               2006             ""               2019
//        %title_year%    ->     Fight Club 1999    Dexter           Dexter           Parasite 2019        // This variable calls year for only movies, not series. If you want year in both case, use this: %title%+%year%
//        %org_title%     ->     Fight Club         Dexter           ""               Gisaengchung         // Actually it returns same as %title% in episode pages. It is not possible to get orginal title from there.
//        %imdbid%        ->     0137523            0773262          0773262          6751668
//        %ttimdbid%      ->     tt0137523          tt0773262        tt0773262        tt6751668
 
	const sites = [
		{ name: "4ShowTV",             url: "https://www.4show.tv/search?q=%title%",                                         icon: "https://i.imgur.com/ThwG30A.png", },
		{ name: "OLD 4ShowTV",         url: "https://www.4show.me/search?q=%title%",                                         icon: "https://i.imgur.com/Emi695i.png", },
		{ name: 'Movs4u',              url: 'https://www.movs4u.in/tvshows/?search=%title%',                                 icon: 'https://images2.imgbox.com/a0/de/q9nkl3Ot_o.png', },
		{ name: 'Cima4u',              url: 'https://cima4u.io/?s=%title%',                                                  icon: 'https://images2.imgbox.com/e2/78/4Fejmpfi_o.png', },
		{ name: 'Shahid4u',            url: 'https://m.shahid4u.land/search?s=%title%',                                      icon: 'https://images2.imgbox.com/63/af/U8W35AyF_o.png', },
		{ name: 'FaselHD',             url: 'https://www.faselhd.pro/?s=%title%',                                            icon: 'https://i.imgur.com/e0B78T0.png', },
		{ name: 'EgyBest',             url: 'https://egy.best/explore/?q=%title%',                                           icon: 'https://i.imgur.com/bGAoAKf.png', },
		{ name: 'Akwam',               url: 'https://akwam.ws/search/%title%',                                               icon: 'https://i.imgur.com/OH7CaUN.png', },
		{ name: 'MyCima',              url: 'https://mycima.dev/search/%title%',                                             icon: 'https://i.imgur.com/1C2GuTA.jpg', },
		{ name: 'ArabSeed',            url: 'https://arabseed.onl/find/?find=%title%',                                       icon: 'https://i.imgur.com/vAxJjR7.png', },
		{ name: 'MovizLand',           url: 'https://movizland.top/search/%title%',                                          icon: 'https://images2.imgbox.com/f2/d6/fQRQ8Quz_o.png', },
		{ name: 'CimaClub',            url: 'https://www.cimaclub.cc/search?s=%title%',                                      icon: 'https://i.imgur.com/BrUjHPr.png', },
		{ name: 'Land4Movies',         url: 'https://land4movies.tv/?s=%title%',                                             icon: 'https://i.imgur.com/FWDCdMY.png', },
		{ name: 'HonaDrama',           url: 'https://honadrama.me/search/%title%',                                           icon: 'https://i.imgur.com/8ezEsQH.png', },
    { name: 'Youtube',             url: 'https://www.youtube.com/results?search_query=%title%+trailer',                  icon: 'https://i.imgur.com/6HivZfM.png', },
    { name: 'TheMovieDB',          url: 'https://www.themoviedb.org/search?query=%title%',                               icon: 'https://i.imgur.com/W0ITLjq.png', },
    { name: 'Subscene',            url: 'http://subscene.com/subtitles/title?q=%title%',                                 icon: 'https://i.imgur.com/zkJwboX.png', },
		{ name: 'OpenSubtitles',       url: 'https://www.opensubtitles.org/en/search/sublanguageid-eng,tur/imdbid-%imdbid%', icon: 'https://i.imgur.com/zY8eEYI.png', },
 
//		{name: "", url: "", icon: "",}
//		{name: "", url: "", icon: "",}
	];
 
	const torrentSites = [
		{ name: 'RARBG',               url: 'https://rarbgmirror.com/torrents.php?search=%imdbid%',                          icon: 'https://images2.imgbox.com/34/0b/bCrT9fHL_o.png', },
		{ name: '1337x',               url: 'https://www.1337x.to/sort-search/%title_year%/time/desc/1/',                    icon: 'https://images2.imgbox.com/1d/9e/mgOmJEvI_o.png', },
		{ name: 'Zooqle',              url: 'https://zooqle.com/search?q=%title_year%&s=ns&v=t&sd=d',                        icon: 'https://images2.imgbox.com/25/3b/Sd8La3js_o.png', },
		{ name: 'TorrentGalaxy',       url: 'https://torrentgalaxy.to/torrents.php?search=%ttimdbid%&sort=id&sort=id&order=desc', icon: 'https://images2.imgbox.com/c2/27/dGkG9vjT_o.png', },
		{ name: 'ETTV',                url: 'https://www.ettv.tv/torrents-search.php?search=%title%&sort=id&order=desc',     icon: 'https://images2.imgbox.com/fa/3e/zi3h52EA_o.png', },
		{ name: 'PSA',                 url: 'http://psarips.com/?s=%title_year%',                                            icon: 'https://images2.imgbox.com/26/c1/2OXmz3tN_o.png', },
		{ name: 'RuTracker',           url: 'http://rutracker.org/forum/tracker.php?nm=%title_year%',                        icon: 'https://images2.imgbox.com/24/5d/kj3YSoFr_o.png', },
		{ name: 'Zamunda',             url: 'http://zamunda.net/bananas?&search=%title_year%',                               icon: 'https://images2.imgbox.com/89/58/BcmHxuVW_o.png', },
		{ name: 'BTN',                 url: 'http://broadcasthe.net/torrents.php?searchstr=%title_year%',                    icon: 'https://images2.imgbox.com/d4/a1/PXzzpDjb_o.png', },
		{ name: 'TorrentDay',          url: 'http://www.torrentday.com/browse.php?search=%title_year%',                      icon: 'https://images2.imgbox.com/01/c0/sELs3Ft4_o.png', },
		{ name: 'CinemaGeddon',        url: 'http://cinemageddon.net/browse.php?search=%imdbid%',                            icon: 'https://images2.imgbox.com/0d/9c/rkhfaakh_o.png', },
		{ name: 'KaraGarga',           url: 'https://karagarga.in/browse.php?search=%imdbid%&search_type=imdb',              icon: 'https://images2.imgbox.com/cc/ea/EMx6RWyb_o.png', },
		{ name: 'Hd-T',                url: 'http://hd-torrents.org/torrents.php?search=%imdbid%',                           icon: 'https://images2.imgbox.com/c1/e7/LFKIWxpN_o.png', },
		{ name: 'Filelist',            url: 'http://filelist.ro/browse.php?search=%imdbid%',                                 icon: 'https://images2.imgbox.com/9e/2e/R3yGIQm7_o.png', },
		{ name: 'IPT',                 url: 'http://www.iptorrents.com/t?q=%ttimdbid%',                                      icon: 'https://images2.imgbox.com/0b/49/AwbWiNMY_o.png', },
		{ name: 'PrivateHD',           url: 'https://privatehd.to/torrents?in=1&search=%title%&order=age&sort=desc',         icon: 'https://images2.imgbox.com/64/a7/KBgM8R4y_o.png', },
		{ name: 'TurkTorrent',         url: 'https://turktorrent.us/?p=torrents&pid=10&q=%ttimdbid%',                        icon: 'https://images2.imgbox.com/79/1f/Jbd4Vu5n_o.png', },
	];
 
	var drama_sites = [
		{ name: 'MyDramaList',         url: 'https://mydramalist.com/search?q=%title%',                                      icon: 'https://images2.imgbox.com/18/9d/voQieZdD_o.png', },
		{ name: 'AsianWiki',           url: 'https://asianwiki.com/index.php?title=Special%3ASearch&search=%title%',         icon: 'https://images2.imgbox.com/73/a6/kUDT1yO9_o.png', },
		{ name: 'Hancinema',           url: 'https://www.hancinema.net/googlesearch.php?cx=partner-pub-1612871806153672%3A2t41l1-gajp&cof=FORID%3A10&ie=ISO-8859-1&hl=en&q=%title%', icon: 'https://images2.imgbox.com/46/c6/qxK0R7S4_o.png',	},
		{ name: 'Viki',                url: 'https://www.viki.com/search?q=%title%&type=series',                             icon: 'https://images2.imgbox.com/9c/46/Flf1ykIh_o.png', },
		{ name: 'Soompi',              url: 'https://www.soompi.com/search?query=%title%',                                   icon: 'https://images2.imgbox.com/d9/ab/4jDFz2WS_o.png', },
		{ name: 'DramaBeans',          url: 'https://www.dramabeans.com/?s=%title%',                                         icon: 'https://images2.imgbox.com/62/c1/2mKN3cII_o.png', },
	  ];
 
	var anime_sites = [
		{ name: 'MAL',                 url: 'https://myanimelist.net/search/all?q=%title%',                                  icon: 'https://images2.imgbox.com/bf/8b/cQ2UnZIa_o.png', },
		{ name: 'AniDB',               url: 'https://anidb.net/perl-bin/animedb.pl?adb.search=%title%&show=search&do.search=search', icon: 'https://images2.imgbox.com/3b/c9/eeUYC5n7_o.png', },
		{ name: 'ANN',                 url: 'https://www.animenewsnetwork.com/search?q=%title%',                             icon: 'https://images2.imgbox.com/64/ca/uWlLBCwp_o.png', },
		{ name: 'LiveChart',           url: 'https://www.livechart.me/search?q=%title%',                                     icon: 'https://images2.imgbox.com/85/08/C91WXD3m_o.png', },
		{ name: 'AniList',             url: 'https://anilist.co/search/anime?search=%title%',                                icon: 'https://images2.imgbox.com/98/a6/NfPnZ1Hy_o.png', },
		{ name: 'Kitsu',               url: 'https://kitsu.io/anime?&text=%title%',                                          icon: 'https://images2.imgbox.com/88/c9/Q9wsiMwc_o.png', },
		{ name: 'aniSearch',           url: 'https://www.anisearch.com/anime/index/?page=1&char=all&text=%title%&smode=2',   icon: 'https://images2.imgbox.com/9c/a3/gMmGqWe7_o.png', },
		{ name: 'Nyaa',                url: 'https://nyaa.si/?&q=%org_title%',                                               icon: 'https://images2.imgbox.com/ae/83/Wt7miqlB_o.png', },
		{ name: 'AnimeTosho',          url: 'https://animetosho.org/search?q=%org_title%',                                   icon: 'https://images2.imgbox.com/95/99/ielNsiUu_o.png', },
		{ name: 'AniDex',              url: 'https://anidex.info/?q=%org_title%',                                            icon: 'https://images2.imgbox.com/b4/e1/uCD81F45_o.png', },
		{ name: 'AnimeBytes',          url: 'https://animebytes.tv/torrents.php?searchstr=%title%&force_default=1',          icon: 'https://images2.imgbox.com/aa/58/vsP6uAXE_o.png', },
		{ name: 'BakaBT',              url: 'https://bakabt.me/browse.php?q=%title%',                                        icon: 'https://images2.imgbox.com/6a/b8/4qBbiNge_o.png', },
		{ name: 'RuTracker',           url: 'http://rutracker.org/forum/search_cse.php?q=%org_title%',                       icon: 'https://images2.imgbox.com/24/5d/kj3YSoFr_o.png', },
    { name: 'TürkAnime',           url: 'http://www.turkanime.tv/?q=%title%',                                            icon: 'https://images2.imgbox.com/48/1b/6S4bA8pN_o.png', },
	];
 
	// Styles
	GM_addStyle(`
	.quick-search {margin-left: 0; margin-right: 0;}
	.quick-search > div {justify-content: flex-start; flex-wrap: wrap; height: unset; padding: 0.6rem;}
	.quick-search button {padding: 0.2rem; opacity: 0.7;}
	.quick-search button:hover {opacity: 1;}
	.quick-search a {display: flex;}
	.quick-search img {height: 1.4rem; width: 1.4rem;}
`);
 
	// Title edit
	const titleEdit=(t) => {
		return t
			.replace(/[\/\\()~?<>{}]/g, "") //remove bad chars
			.replace("&amp;","%26") //replace & with code
			.replace("&", "%26")
			.replace('"', '%22')
			.replace("#", "%23")
			.replace("$", "%24")
			.replace("%", "%25")
			.replace("'", "%27")
			.replace("*", "%2A")
			.replace("-", "%2D")
		;
	};
 
	// Variables
    const regex = /\/title\/(tt\d+)\/?/;
    const pageUrl = window.location.href;
	var isSerial = ($('[class^="EpisodeNavigationForTVSeries"], .subnav__all-episodes-button').length > 0) ? true : false;
	var ttImdbId = regex.exec( pageUrl )[1];
	var title = titleEdit( $('[class^="TitleHeader"]').text().trim() );
	var orgTitle = titleEdit( $('[class^="OriginalTitle"]').text().replace(/Original title: /i,"").trim() );
	orgTitle = (orgTitle == "") ? title : orgTitle;
	var year = $('title').text().replace(/.+\(.*?(\d{4}).*\) - IMDb/, "$1");
	var titleYear = isSerial ? title : title + " " + year;
	var episodeCheck = $('a[class*="SeriesParentLink"]').length > 0;
	if (episodeCheck) {
		let parent = $('a[class*="SeriesParentLink"]');
		ttImdbId = regex.exec( parent.attr("href") )[1];
		title = parent.text();
		orgTitle = title;
		titleYear = title;
	}
 
	// Anime & Drama
	var isDrama, isAnime;
	var language = $('[data-testid="title-details-languages"]').text().trim();
	var genre = $('[data-testid="genres"]').text().trim();
	if (language.search( /(Korean|Japanese|Mandarin|Chinese|Tagalog|Cantonese)/i ) >= 0 && language.search( /English/i ) < 0 && genre.search( /Animation/i ) < 0) {isDrama = true;}
	if (language.search( /Japanese/i ) >= 0 && language.search( /English/i ) < 0 && genre.search( /Animation/i ) >= 0) {isAnime = true;}
 
	// Functions
	const url=(u) => {
		return u
			.replace("%ttimdbid%", ttImdbId)
			.replace("%imdbid%", ttImdbId.replace("tt",""))
			.replace("%title%", title)
			.replace("%year%", year)
			.replace("%title_year%", titleYear)
			.replace("%org_title%", orgTitle)
		;
	};
	const refPos = (p_ref) => {
		let ref = document.querySelector(p_ref).getBoundingClientRect();
		let width = ref.width;
		return {
			top: (window.scrollY + ref.top) + "px",
			left: ref.left + "px",
			width: width + "px",
		};
	};
	const putBtns=(group, id) => {
		// Create clone area
		let cloneArea = $('.watchContainerClone');
		if (cloneArea.length <= 0) {
			$('body').prepend('<div class="watchContainerClone" style="position: absolute; z-index: 100; padding-top: 1rem;"></div>');
			cloneArea = $('.watchContainerClone');
		}
		// Put bar
		let bar = $('[class^="SubNav__SubNavContainer"]:first').clone().attr("id", id).addClass("quick-search");
		bar.children().html("");
		bar.prependTo( cloneArea );
		// Put buttons
		let cls = $('[data-testid="hero-subnav-bar-all-topics-button"]').attr("class");
		group.forEach(function(s) {
			$('#' + id + ' > div').append('<button class="' + cls + '" title="' + s.name + '"><a href="' + url(s.url) + '" target="_blank"><img src="' + s.icon + '"></img></a></button>');
		});
		// Position and space for Clone
		let pos = refPos('[class^="Hero__WatchContainer"]');
		cloneArea.css("top", pos.top).css("left", pos.left).css("width", pos.width);
		let cloneHeight = document.querySelector('.watchContainerClone').getBoundingClientRect().height + "px";
		$('[class^="Hero__WatchContainer"]').css("padding-top", cloneHeight );
	};
 
	// Put Search Buttons
	if (crtl.torrent && !isAnime) {putBtns(torrentSites, "torrent_searchOn");}
	putBtns(sites, "searchOn");
	if (crtl.anime && isAnime) {putBtns(anime_sites, "anime_searchOn");}
	if (crtl.drama && isDrama) {putBtns(drama_sites, "drama_searchOn");}
})();
