 exports.getDefaults = function( hostname ) {
   // return Object.assign({}, systemDefault, siteDefaults.find(x=>x.site==site || x.hostname == hostname) )
    // return Object.assign({}, systemDefault, siteDefaults.find(x=>x.site==site ) )
    return Object.assign({}, systemDefault, siteDefaults.find(x=>x.hostname==hostname ) )
 }

var systemDefault = 
    {
        "site": "cis",
        "lang": "en",
        "hostname":"cis.intocareers.org",
        "displayname": "The Career Information System"
    };

var siteDefaults = [
    {
        "site": "cis",
        "lang": "en",
        "hostname":"cis.intocareers.org",
        "displayname": "The Career Information System"
    },
    {
        "site": "mncis",
        "lang": "en",
        "hostname":"mncis.intocareers.org",
        "displayname": "The Minnesota Career Information System"
    },
    {
        "site": "sinocis",
        "lang": "bi",
        "hostname":"sinocis.intocareers.org",
        "displayname": "Sino CIS"
    }        
];