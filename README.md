# Discussion Platform

## Overview

The Discussion Platform is a Node.js application designed for creating, discussing, and engaging in community conversations. Users can create discussions, comment, like, and reply to comments. It includes features for uploading images and tagging discussions with hashtags.

## Features

- User Authentication (Sign up, Login)
- Create, Update, and Delete Discussions
- Add Comments and Replies to Discussions
- Like Comments and Replies
- Filter Discussions by Hashtags or Text
- Upload Images for Discussions
- Secure Password Storage

## Prerequisites

Before running this application, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v12 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud)
- [Git](https://git-scm.com/downloads)

## Setup Instructions

### Step 1: Clone the Repository

Clone the repository to your local machine using:

```bash
git clone (https://github.com/Mohsin0786/DiscussionHub.git)
cd discussion-platform
```

# Using npm
npm install


### Adding the `.env` File

1. Create a file named `.env` in the root directory of your project.
2. Add the following content to the `.env` file:

    ```plaintext
    # .env

    # MongoDB connection URI
    MONGO_URI=mongodb+srv://your-mongo-uri

    # JWT secret key for token generation
    JWT_SECRET_KEY=your-secret-key
    ```

## Run server 
# Using npm
```bash
npm start or if using nodemon than npm run app
```


##You should check whether your machine is connected to DB or not you hsould whitelist your IP using MongoBD Dashboard

#When server get started and DB is connected succesfully then Server running on port {port_number}
Connected to DB will be print on console
