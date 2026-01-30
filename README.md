- Backend
        - Allowed ec2 instance public IP on mongodb server
        - npm install pm-2 -g
        - pm2 start npm --name "codershub-backend" -- start
        - pm2 logs
        - pm2 list, pm2 flush  <name>, pm2 stop <name>, pm2 delete <name>
        - config nginx - /etc/nginx/sites-available/default
        - restart nginx - sudo systemctl restart nginx
        - Modify the BASEURL in frontned project to "/api"


    Frontend = http://16.16.76.83/
    Backend = http://16.16.76.83:3000/

    Domain name = codershub.com

    Frontend = codershub.com
    Backend = codershub.com:3000/ => codershub.com/api (proxy pass)

    nginx config:

    server_name 16.16.76.83;

    location /api/ {
                 proxy_pass http://localhost:3000/;
                 proxy_http_version 1.1;
                 proxy_set_header Upgrade $http_upgrade;
                 proxy_set_header Connection 'upgrade';
                 proxy_set_header Host $host;
                 proxy_cache_bypass $http_upgrade;
            }


# Adding a custom Domain name

        - purchased domain name from godaddy
        - signup on cludflare & add a new domain name
        - change the nameservers on godaddy and point it to cloudflare
        - wait for sometimes till your nameservers are updated
        - DNS record: A joincodershub.com 
        - Enable SSL for website [Full (strict)]


# Sending Emails via SES

        - Create a IAM user
        - Give Access to AmazonSESFullAccess
        - Amazon SES: Create an Identity
        - Verify Your domain name
        - Verify an email address identity
        - Install AWS SDK - v3
        - code Example https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js
        - Setup SesClient
        - Access Credentials should be created in IAm under SecurityCredentials Tab
        - Add the credentials to the .env file

# Scheduling cron jobs in NOdeJs
        - Installing node-cron
        - Learning about cron expressions syntax - crontab.guru
        - Schedule a job
        - date-fns
        - find all the unique email Id who have got connection Request in previous day 
        - send Email
        - we can explore queue mechanism to send bulk emails
        - Another option is Amazon SES Bulk Emails
        - Two NPM packages : bee-queue & bull

# Razorpay Payment Gateway Integration
        - Sign Up on Razorpay and complete KYC
        - Created a UI for premium page
        - Creating an API for create order in backend
        - Added key and secrets in env file
        - Initialized Razorpay in utils 
        - Creating order on razorpay
        - create schema and model
        - saved the order in payment collection
        - make the API dynamic
        - setup Razorpay webhook on live API
        - 