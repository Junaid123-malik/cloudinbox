# CloudInbox — AWS Serverless Customer Support Platform

CloudInbox is a full-stack customer support application built with React, Vite, JavaScript, and AWS services. It allows users to submit support messages through a web interface and demonstrates how a frontend application can integrate with a serverless backend and cloud database.

## Live Demo

**Website:** https://d1s9nan316s8zl.cloudfront.net/

## Project Overview

CloudInbox demonstrates the development and deployment of a web application using AWS cloud infrastructure. The frontend is deployed using Amazon S3 and distributed through Amazon CloudFront, while AWS serverless services handle message processing and storage.

## Features

- Customer support contact form
- Message submission through an API
- Serverless backend processing
- Cloud-based message storage
- Admin dashboard interface
- Admin authentication integration
- AWS-hosted frontend deployment

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### AWS Services
- **Amazon S3:** Stores and hosts frontend production assets.
- **Amazon CloudFront:** Distributes the frontend through a public URL.
- **Amazon API Gateway:** Exposes HTTP API endpoints for frontend-backend communication.
- **AWS Lambda:** Processes customer support message submissions.
- **Amazon DynamoDB:** Stores message records in the `CloudInboxMessages` table.
- **AWS IAM:** Manages permissions between AWS services.
- **Amazon Cognito:** Supports admin authentication.

## Architecture

The application follows a serverless architecture:

1. The React frontend is built using Vite.
2. Production files are uploaded to Amazon S3.
3. Amazon CloudFront delivers the frontend through a public URL.
4. The frontend sends message submissions to Amazon API Gateway.
5. AWS Lambda processes the incoming requests.
6. Amazon DynamoDB stores customer support messages.

**Request flow:**

`React Frontend → API Gateway → AWS Lambda → Amazon DynamoDB`

**Deployment flow:**

`Vite Build → Amazon S3 → Amazon CloudFront`

## Local Setup

### Prerequisites

- Node.js and npm
- AWS account for backend configuration

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd CloudInbox
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and configure the environment variables required by the application:

```env
VITE_API_BASE_URL=YOUR_API_GATEWAY_URL
VITE_USE_MOCK=false
VITE_COGNITO_USER_POOL_ID=YOUR_USER_POOL_ID
VITE_COGNITO_CLIENT_ID=YOUR_APP_CLIENT_ID
VITE_COGNITO_DOMAIN=YOUR_COGNITO_DOMAIN
```

Replace the placeholder values with the appropriate configuration. Never commit real secrets or credentials to GitHub.

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

The production files are generated in the `dist` directory.

## Deployment

The frontend production build is uploaded to Amazon S3 and distributed through Amazon CloudFront. API Gateway connects the frontend to the Lambda backend, while DynamoDB provides persistent message storage.

For a successful deployment, the API endpoint, CORS configuration, AWS permissions, and authentication settings must match the deployed environment.

## Learning Outcomes

This project provided practical experience with:

- Deploying a React application to AWS
- Configuring Amazon S3 and CloudFront
- Integrating API Gateway with Lambda
- Connecting serverless functions to DynamoDB
- Managing AWS service permissions using IAM
- Integrating Cognito authentication
- Building and deploying a full-stack cloud application

## Author

**Junaid Imtiaz**

Computer Science Student | Aspiring Full-Stack Developer and Cloud Engineer

## Project Links

- **Live Demo:** https://d1s9nan316s8zl.cloudfront.net/
- **GitHub Repository:** Add your repository URL here
