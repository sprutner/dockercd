# dockercd
Continuous Delivery pipeline for Nomad using Docker Hub

# Continuous delivery for Docker container in Nomad, no Jenkins required #

This is a very alpha stage project, but it works.
This is a AWS Lambda function that is triggered by AWS API Gateway through a Docker Hub webhook.
It scans the PUT request in the webhook to pull out the container organization, name, and tag and then pulls a job specification out of
your specified S3 bucket, mutates it to use the container that was just pushed to Docker Hub, and then posts the job to Nomad.

This should work with any implementation of Docker Hub as a container repository, as the action is triggered by a push to Docker Hub,
not from the Continuous Integration / builder of the container.

# Prerequisites #

* AWS Lambda function with network access to your Nomad API
* API Gateway configured to trigger a Lambda function

# Installation #

First, you must upload a JSON job specification to a S3 bucket, and grant IAM permissions to the Lambda function to read from it.

Then, zip this all up into a Lambda function and then upload it to AWS,
supplying required environment variables. 

From there, you set up API Gateway to triger the Lambda function, and supply the invocation URL as a webhook under the appropriate container in Docker Hub.  

I advise using Terraform to automate this process.
In the future, a terraform module will be provided to automate the whole process besides setting the Docker Hub webhook.

