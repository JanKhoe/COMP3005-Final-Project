This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Video Tutorial: https://drive.google.com/file/d/1fgRUL5QDqZQiDr786I_oRTuIaKuK6o23/view?usp=sharing

## COMP 3005 A3 - CRUD Web Application

This is Jansen Khoe's (101260040) submission for Assignemnt 3.
A simple Web aplication that supports the creation, reading, updating and deleting of a student object that is stored in your local postgres database manager.

## How to setup

# Preliminary

1. Make sure you have node installed on your local machine.
2. download this repo as a zip file 
3. open up a cmd terminal with COMP3005-A3-main as the working directory and run 'npm install'

# Database Connection / Database Setup

1. open up pgAdmin
2. Create a new database
3. Create a .env file in the root of the project and add a variable called 'DATABASE_URL=postgresql://postgres:{userPassword}@localhost:5432/{DatabaseName}' (assuming that you have the existing user postgres otherwise change 'postgres' to an existing user and its password)
4. going back to the terminal you used in `Preliminary` run `npm run setup` which will create a table and populate it with default student data

# Running the application

1. using the same terminal you can run `npm run dev` which will launch the application at http://localhost:3000/
2. from here you can see that the student list is always displayed and has support for creating, updating or deleting students. 

## TA Information

This application was made using next.js which leverages the React framework to streamline the development process but can look a bit confusing if you are unfamiliar with the tech stack. So here are some generic places to check for code quality.

lib > db.ts: this facilitates my connection to the database and allows me to send queries to the database manager. 
app > components: stores all reuseable code snippets that i need for this assignment.

app > page.tsx: this is where the landing page is. Everything is rendered here.

app > components > AddStudentButton.tsx: this is responsible for sending the POST request to add students to the table. It uses states to store the text input values.

app > components > StudentTable.tsx: This is the component that is responsible for fetching All students and displaying it on the page. It has a dependency on a certain variable that when changed will call the fetch again. This is changed whenever i add, delete or update a student, ensuring that the display is always up to date.

app > components > DeleteStudentButton.tsx: This is a component used within the StudentTable component which is assigned to each entry on the table and uses their ID to send a DELETE request to the manager if it is clicked

app > components > UpdateStudentButton.tsx: This is a component used within the StudentTable component which is assigned to each entry ton the table and uses their ID and an additional text input to send an PUT request to the manager if it is clicked which will change the respective's students' email.
