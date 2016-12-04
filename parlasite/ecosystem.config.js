module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : "parlasite",
      script    : "run.js",
      instances : '4',
      env: {
        COMMON_VARIABLE: "true"
      },
      env_production : {
        NODE_ENV: "production"
      }
    }
  ],
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "parladaddy",
      host : "parlameter.si",
      ref  : "origin/master",
      repo : "git@parlasite:FranciZ/parlasite.git",
      path : "/home/parladaddy/parlasite",
      "post-deploy" : "npm install ; pm2 startOrRestart ecosystem.config.js --env production",
      env  : {
        NODE_ENV: "production"
      }
    },
    localProduction:{
      user : "root",
      host : "localhost",
      ref  : "origin/master",
      repo : "git@parlasite:FranciZ/parlasite.git",
      path : "/home/parladaddy/parlasite",
      "post-deploy" : "npm install ; pm2 startOrRestart ecosystem.config.js --env production",
      env  : {
        NODE_ENV: "production"
      }
    },
    dev : {
      user : "root",
      host : "localhost",
      ref  : "origin/master",
      repo : "git@github.com:FranciZ/parlasite.git",
      path : "/Users/francizidar/projects/parlameter/deploys/parlasite",
      "post-deploy" : "npm install ; pm2 startOrRestart ecosystem.config.js --env dev",
      env  : {
        NODE_ENV: "development"
      }
    }
  }
};