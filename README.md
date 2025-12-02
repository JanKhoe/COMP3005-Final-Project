This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# COMP 3005 Final Project - Gym Management Application
*Group members*
- Jansen Khoe - 101260040
- Jessica Hill - 101280293
- Stanny Huang - 101272645

A simple Web aplication that supports the creation, reading, updating and deleting of a student object that is stored in your local postgres database manager.

## Link to Video: https://drive.google.com/file/d/1FgnWJp6D4xY3XzFmkq_or6m3oTiKtDFH/view?usp=sharing

## Link to Report: https://docs.google.com/document/d/1hFVWoGy1yohTQHBHiWrwalv4PlaoyM9SSngRE4BalSU/edit?usp=sharing

# Setup Tutorial

## Preliminary

1. Make sure you have node installed on your local machine.
2. Download this repo as a zip file.
3. Open up a cmd terminal with COMP3005-Final-Project as the working directory and run 'npm install' <br>
   **NOTE: DO NOT UPDATE VULNERABILITIES! This will break the database setup.**

## Database Connection / Database Setup

1. Open up pgAdmin
2. Create a new database
3. Create a .env file in the root of the project and add a variable that is a link to that database. <br>
   Ex. `DATABASE_URL=postgresql://postgres:{userPassword}@localhost:5432/{DatabaseName}` (assuming that you have the existing user postgres otherwise change 'postgres' to an existing user and its password)
4. Run `npx prisma generate` to generate the prisma client and allow for database setup
5. Go back to the terminal you used in `Preliminary` run `npx prisma migrate dev --name added init` which will create all the tables.
6. To set up the view and the trigger run `node scripts/create-view` and `node scripts/create-trigger` 
7. Since the requirements did not include creating trainers, admins, and rooms; you can load default starting information within the database using `npm run setup`
   

## Running the application

1. Using the same terminal you can run `npm run dev` which will launch the application at http://localhost:3000/
2. From here you should be greeted by the Login and Registration screen. You can populate a member account by registering, and upon login you will be greeted by a dashboard, where you can access the various features of our application.
3. If you loaded in the default information using `npm run setup`, you can **login as an Admin:** <br>
   Username: admin Password: adminpass
   <br> **Login as a Trainer:** <br>
   Username: trainer Password trainer

# TA Information

This application was made using next.js which leverages the React framework to streamline the development process but can look a bit confusing if you are unfamiliar with the tech stack. So here are some generic places to check for code quality.

lib > db.ts: this facilitates my connection to the database and allows me to send queries to the database manager. 
app > components: stores all reuseable code snippets that i need for this assignment.

app > home > page.tsx: this is where the dashboard page for Members is. All of the metrics and graphs are rendered here.

app > components > AddMetricBtn.tsx: this is responsible for sending the POST request to add a new Metric for the current Member to their Metric table. It uses states to store the text input values.

app > actions > auth.ts: This is the component that is responsible for interacting with the database directly on the server. Many different calls to Prisma functions are made here.
