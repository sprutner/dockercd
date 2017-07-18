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

* AWS API Gateway that can post to your Nomad cluster

# Installation #

You simply zip this all up into a lambda function and then upload it to AWS,
supplying required environment variables. I advise using Terraform to automate this process.
Terraform module to come w

