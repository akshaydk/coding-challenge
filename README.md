# Implementation Details:

## Architecture Diagram

![Web App Reference Architecture](https://user-images.githubusercontent.com/13963969/132289856-b6f1ec7e-278e-49d4-a0b5-7b593ec6e373.png)

## Datastream API
- `GET /v1/data` -> returns the data that has been fetch from the external API
- `POST /v1/worker` -> creates a worker for the `url` mentioned in the body for mentioned `frequency`.
  ```
  {
    url: "www.foo.bar"
    frequency: "EVERY_5_SECONDS"
  }
  ```
  Note: List of accepted `frequency` are [here](https://github.com/nestjs/schedule/blob/master/lib/enums/cron-expression.enum.ts)
- `DELETE /v1/worker` -> deletes the worker created by the post request.

## How to run
```
//For data stream API
yarn start 

//To start the worker
yarn start worker
```

## Assumptions
- DataModel of the API will be decided in the future. So, all the data fetched is just in-memory. Persistance solution can be decided once data contract is finalised.
- Every url will have only one cron scheduled at any given point in time.
- We are not performiny any checks which fetching the data from External API. Assumption is that it returns JSON and we have access to the API.
- Once a API makes a POST request, we don't want to lose the data. Hence Rabbit MQ.
- Using the nestjs default logging mechanism. We can push to ELK or Cloudwatch or Datadog. This will be decided in the future.
- Deployment strategy will be decided in the future.

## Trade Offs

- ### API Design: Env variables vs REST
   - Hardcoding the external API's didn't seem like a long term solution for me. Any small change to the URL's will need a deployment. Moreover, when the number of         external APIs increase it becomes very difficult to manage them. 
   - The current mechanism will enable us to create cron jobs without making any changes to the code.
   - Any frequency can be set to the cron. If `PUT` is exposed we can edit the frequency as well.
    

-  ### TCP vs RabbitMQ vs Kafka
    - Reliability is one of out Non functional requirements. We do not want to lost the data once an API call is made.
    - Pub/Sub gives us the necessary infra to scale in the future.
    - I believe, RabbitMQ is light weight and is go-to small projects and POC's. Moreover, Nestjs kafka tranporter is still in experimental stages.

- ### Database
  - We cannot decide on the persistance of data before finalizing the data contract. So I decided to use in-memory

- ### Exception Handling
  - Similar to what was mentioned before, we need to decide on the logging and monitoring aspects of the system. This will enable us to capture the exception in meaningful format.
  - Currently, we are just logging the exceptions.

- ### Docker
  - For the sake of assignment I didn't want to get into the containarizing the application. Ideally, I would be inclined to containarize any application that goes to production.


## Fututre Work
- Add tests
- API versioning
- Instead of hardcoding the cron name in the registry use hash to generate one.
- Delete API should call out the cron to be deleted.
- RabbitMQ acknowlegment
- Transformation to Response received from the external API
- Application Logs & Monitoring


------------
# Welcome to Welds coding-challenge

## Introduction
Here at Weld we use [NestJS](https://nestjs.com/) for our applications. So this project also reflects that. On our front-end we use NextJS and GraphQL. For simplicity we have used the monorepo structure from NestJS.

Fork this repository and create your own repository to get started.

## Challenge
One of our customers wants us to help them build a pipeline for an API (select whichever you want from [Public APIs](https://github.com/public-apis/public-apis)). And they want us to setup a new data-pipeline for them to get information out and into their current data-warehouse.

To accomplish this you will build two services:
- **Data-streams**: Our API that can receive calls and issue commands to **worker**. This service also stores any information that our customer wants to fetch.
- **Worker:** Fetches the data from external API. Makes any transformations you see fit. And sends it back to **data-streams** for storage.

### Steps in challenge
- Configure a message protocol between the two services. You can get inspiration from the [nestjs docs.](https://docs.nestjs.com/microservices/basics) Choose which ever you want but tell us why in your answer.
- Create an endpoint on **data-streams** that tells **worker** to start fetching data on an interval (every 5 minutes).
- Setup an [http module](https://docs.nestjs.com/techniques/http-module) that **worker** can use to communicate with the external API.
- Send the data and store the results on **data-streams** using internal communication protocol.
- Make an endpoint on **data-streams** that can fetch the data stored on **data-streams**. Use whatever storage you see fit but tell us why you chose it.
- Make an endpoint on **data-streams** that can stop the data fetching on **worker**.

## How we evaluate
The test is solely for you to show techniques and design patterns you normally use. Once the techniques and design patterns have been demonstrated then that is enough. No neeed for additional boilerplate. Just include a future work section in your answer and we will include questions in the technical interview.

- We understand that this can be **time consuming**. If you are short on time - then leave something out. But be sure to tell us your approach to the problem in the documentation.
- A documented answer that explains your approach, short-comings, how-to-run and future work.
- A working solution. Preferably with some tests to give us an idea of how you write tests (you don't need to put it all under test).
- Reliability is very important when dealing with data-pipelines. So any measures you can add to keep the data-flowing will be appreciated.
- We appreciate small commits with a trail of messages that shows us how you work.

## Project structure
```
├── README.md
├── apps
│   ├── data-streams
│   └── worker
├── package.json
```
### data-streams:
This is our API. We will be able to issue HTTP requests to this and have it talk to our microservice **worker**.
We also store any information that **worker** sends our way. This project has been setup as a hybrid app. It can both function as an API but also as a microservice with an internal communication layer.

You can start data-streams with:
```
yarn start
```

### worker:
This is the worker microservice that is in charge of talking to the external API. It will fetch data when issued a command from **data-streams** and then return the results. This project only functions as a microservice which means it can only receive commands from the internal communication layer.

You can start worker with:
```
yarn start worker
```
