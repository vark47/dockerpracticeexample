
var fs = require('fs');

var Config = module.exports = {
    envVar : "",
    getFile : function(args){
                //console.log("File system location:"+args);
                var file="";
                try{
                    file =fs.readFileSync(args+"", 'utf8');
                    Config.envVar  = require('dotenv').config({silent:false,path:args+""});
                    //console.log("file data is:"+file);
                    return Config.envVar;
                }
                catch(e){
                    try{
                        if(args=="")
                        {
                            console.log("No file passed so trying to load config file from default location.");
                        }
                        else{
                            console.log("File not found so trying to load config file from default location.");
                        }
                        file =fs.readFileSync("./.env", 'utf8');
                        Config.envVar  = require('dotenv').config({silent:false});
                        //
                        return Config.envVar;
                    }
                    catch(e){
                        console.log("logerror:"+e);
                        process.exit();
                    }
                }
            }

}

