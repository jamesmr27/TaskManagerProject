

*******The most up to date web app is on the UpdatedBranch********


-------------------------------------------------------------------------------------------------------------------------------------------------
AI Citation

AI was used as a tool to help develop this project.
ChatGPT and Github Copilot were used

Assistance with general boilerplate set up and idea gathering was done with
ChatGPT and help with going about authentication
was answered by Github Copilot

The components App.tsx, Login.tsx, Signup.tsx, TaskDashboard.tsx, and server.js were the files mainly affected by AI

ChatGPT link: https://chatgpt.com/share/67fa0ca7-e8dc-8011-9bc7-acdf37d6b5fd
Github Copilot (Wasn't able to find a clean way to drop a link to the entire conversation, but below is one part of it): 

GitHub Copilot
"To integrate Google Identity for user authentication in your application, you can use Google Sign-In with OAuth 2.0. This allows users to log in using their Google accounts. Below is a step-by-step guide to implement Google authentication in your React app.

Step 1: Set Up a Google Cloud Project
Go to the Google Cloud Console.
Create a new project or select an existing one.
Navigate to APIs & Services > Credentials.
Click Create Credentials > OAuth 2.0 Client IDs.
Configure the consent screen:
Add your app name, logo, and authorized domains.
Create an OAuth 2.0 Client ID:
Application type: Web application.
Add your app's URL to the Authorized redirect URIs (e.g., http://localhost:5173 for development).
Save the Client ID and Client Secret.
Step 2: Install Google Identity Library
Install the Google Identity library in your React frontend:

Step 3: Configure Google OAuth in Your React App
Update your App.tsx to include the Google OAuth provider.

Updated App.tsx
1 vulnerability
Step 4: Add Google Sign-In to the Login Page
Update the Login.tsx file to include a Google Sign-In button.

Updated Login.tsx
Step 5: Backend Integration
Add a route in your backend to verify the Google token and create a user if they don't already exist.

Updated server.js
Summary
Frontend:

Added Google Sign-In using @react-oauth/google.
Decoded the Google token and sent it to the backend for verification.
Backend:

Verified the Google token using google-auth-library.
Created a new user if they didn't already exist.
Returned a JWT token for authenticated sessions."
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
Dependencies/Packages/Ports

The backend server runs on Port 5005
Frontend runs on Port 5173

Packages to install:
// Creating the initial project
npm init

// Outside frontend and server folders (optional)
npm install --save-dev concurrently

// In frontend folder
npm create vite@latest .    // Select React and TypeScript 
npm install
npm install axios
npm install react-router-dom
npm install tailwindcss @tailwindcss/vite
npm install @react-oauth/google
npm install jwt-decode
npm install google-auth-library
npm install googleapis

// In server folder
npm install --save-dev nodemon
npm install express mongoose cors dotenv
npm install bcryptjs jsonwebtoken
