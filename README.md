CIS-MOBILE ![version v0.0.3](https://img.shields.io/badge/version-v0.0.3-brightgreen.svg) ![License University of Oregon](https://img.shields.io/badge/license-University%20of%20Oregon-yellow.svg)
=============

Mobile-first front end to CIS with the ability to dynamically render different navigation structures for web components dynamically enabled through the backend api

#### SHORT VERSION
    copy .env.json_example to .env.json, modify
    copy .env to .env, modify
    docker run --rm -it -v "$PWD":/app schodemeiss/npm-tools npm install
    docker run -it --rm -w /opt -v $(pwd):/opt -p 4200:4200 alexsuch/angular-cli ng build --env=prod
    docker-compose up -d --build


# DEPENDENCIES
    angular-cli
        Local Option: "npm install -g @angular/cli"
        Docker Option: "docker pull alexsuch/angular-cli"
    
    package dependencies
        "npm install"
    

# DEV AND BUILD TOOLS
angular-cli (ng) is used as the main development and build tooling and can be used from a local installation or from a Docker image.  The --env= flag can be used to define the enivronment [dev | qa | prod].  Sample usage: "ng serve --env=qa".


#### CONFIGURATION
>   .env.json_example: copy this file to .env.json and modify as appropriate.
>   
>   This file contains environment variables that are passed into Angular via the --env flag and then can be used in angular via the {{environment}} import. Any variables must be availale in the ./environments folder and registered in angular-cli.json


#### DEPENDENCIES
    angular-cli
        "npm install -g @angular/cli"
        OR
        docker run --rm -it -v "$PWD":/app schodemeiss/npm-tools npm install
        
    package dependencies
        "npm install"

#### USAGE    
    Development server:
        - "ng serve [--env=dev|qa|prod]" 
        OR
        - docker run -it --rm -w /opt -v $(pwd):/opt -p 4200:4200 alexsuch/angular-cli ng serve --host 0.0.0.0

    Build Angular project: 
        - "ng build [--env=dev|qa|prod]" 
        OR
        - docker run -it --rm -w /opt -v $(pwd):/opt -p 4200:4200 alexsuch/angular-cli ng build --env=prod
    
# WEB SERVER
An express.js node webserver is included in the /server directory of the project to serve the angular build. A Dockerfile is included for a Docker deployed solution.

#### CONFIGURATION
> .env.example: copy this file to .env and modify as appropriate.  
>   
> This file contains environment variables for the node server included in this repository (server folder) used to server up a build in the ./dist folder.  Please note that is should be in the root of the project, not the server directory

#### DEPENDENCIES
    Docker - skip this stop
    OR 
    "npm install" from within the /server directory
    
#### USAGE
    "docker-compose up -d [--build]" from within the root directory
    OR 
    "node ./bin/www" from within the /server directory
    OR 
    "nodemon ./bin/www" from withing the /server directory