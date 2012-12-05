Visual Keeper
Jared Cahalan, Abel Sanchez

Visual Keeper allows you store tasks and other to-do list information, with a focus on using images to show task information. After registering an account, you can begin adding tasks and viewing them. Visual Keeper provides you with a way to combine images with short simple task descriptions to easily share the task with other people. Images and data are stored on a remote server so unfortunately at this time you need a data/web connection to view them.



///////////////////////////////////////////
// App Download
///////////////////////////////////////////
Download App through the Phonegap Build Page link listed , please remember to allow Unknown Sources in you settings to allow installation of this app.


///////////////////////////////////////////
// Login or Registration 
///////////////////////////////////////////
When the app is opened you are faced with a login screen, a register button and a reset password button. The login portion is pretty self explanation, enter your already created username and password. The register button will give the user the ability to create a personal account through Visual Keeper and save their tasks. The reset password button will allow the user to reset their passord via an emailed link that is sent to the email that the user used in the register process, so try not to use a dummy email if you would like to use the app frequently.Keep note that both the login and register page both have validation that will require a username to be at least one character long, the password to be at least two characters long and for the email to be "valid" checking for common email syntax, not a regstered working email.


///////////////////////////////////////////
// Task List Creation
///////////////////////////////////////////
To start off after a login you will be welcomed by the task view screen there are two ways to start; you can either add a task which is then added to the "default list," or by creating a personalized list then adding tasks to that. To create a list please select the "+" button in the upper right corner. You will be greated with the task name list dialog where you can peronalize your tak lists. With Visual Keeper we believe organization is key so allowing the user to have different lists coordinate to seperate tasks is a step in the right direction. After list craetion, you will be returned to the view task list with the newly created task selected.


///////////////////////////////////////////
// Task Creation
///////////////////////////////////////////
Whether you choose to create a new list for your task or to just create a task you will have to click on the "New Task" button, which is located on the bottom of the "View Task" screen. The page will change to "Add Task" Page an the user will be given a blank form for task information input. The screen is split into two main areas. The left has the Task picture icon which when tapped will bring up the camera for a quick visual representaion of the task. There must be a task picture for the user to submit a task. The right will hold the task name, task description and the set date/time dialog button. There must be a task name but the app does not require a task description. When the set date/time button is pressed a custom dialog is displayed to show an easy way to enter the frequency of the task along with the date and time the task will be occuring.
The date, time and frequency areas are all required fields. After a proper time, date and frequency are set for the task, the task can then be added to the task list by clicking the accept task button on the bottom of the "New Task" page. 


///////////////////////////////////////////
// Logout and Retrive Tasks
///////////////////////////////////////////
After a successful creation of a task has been added to the list the user can log out through the menu dropdown in the top right corner or by just exiting the app. The user can then come back to view tsks that they have to do later. The data is saved in two seperate places the data information, such as the task name, description, date, time and frequency will utilize a database through Parse.com. The task picture is saved on a webserver, where it is retrieved and displayed for the user through a custom created folder on the web server. When a new user is register a folder is created in coordination with the user the folder will coordinate with the specific user id that Parse.com assigns to them. The picture id will coordinate with the specific task id or object id that Parse.com creates with the successful creation of a task. The pic url is then a concatenation of the user id and task id attached to the webseerver url.



Link to Phase 1 Documentation:
https://docs.google.com/document/d/1X8pEdmvjmj8kmfVTz8Gr3h2krJIZSFvj_dRgZgnUCz8/edit

Link to Phase 2 Documentation:
https://docs.google.com/document/d/1BODVVbkju7dUfQJdNiLlrw0QnQmn3eacjVPnVQzBm8s/edit

PhoneGap Build Page:
https://build.phonegap.com/apps/250240/share
