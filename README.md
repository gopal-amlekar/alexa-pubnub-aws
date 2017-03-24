# Amazon Alexa and Pubnub with AWS
This repository has the source code for my blog post about **Voice controlled home automation with Amazon Alexa and Pubnub**

Steps to follow:

* Clone the repository
* Navigate to folder skill-adapter
* Install required dependencies (Pubnub SDK)
  ```shell
  npm install
  ```
* Zip the files
  ```
  zip -r alexa-lambda.zip *
  ```
* Upload the zip file on AWS Lambda service
* Add following details as environment variables on AWS Lambda
  * PUB_NUB_CHANNEL_KEY=alexa_world
  * PUB_NUB_PUBLISH_KEY=YOUR_PUBNUB_PUBLISH_KEY
  * PUB_NUB_SUBSCRIBE_KEY=YOUR_PUBNUB_SUBSCRIBE_KEY
  * AMAZON_APP_KEY=YOUR_AMAZON_SKILL_APP_KEY

* Navigate to skill-interaction folder
* Copy contents of intent_schema.json to the Intent schema in Amazon alexa skill configuration
* Copy contents of sample_utterances.txt to the Sample utterances in Amazon alexa skill configuration
* Edit slots and add LIST_OF_ITEMS with a few devices

Start testing the skill.

For more details read my blog post https://abszeroblog.wordpress.com/
