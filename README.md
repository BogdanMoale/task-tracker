# task-tracker


A web page that allows users to manage tasks and projects. It utilizes Bootstrap for styling and layout, jQuery for handling events, and SweetAlert for displaying dialog messages. The page consists of a table to display all tasks, a button to add a new task, and a modal dialog to add tasks and projects. Let's break down the components and their functionalities:

# index.html

1. Meta Tag: This meta tag sets the viewport width to the device width and ensures proper scaling for responsive design.

2. CSS and JS Dependencies: The page includes Bootstrap CSS and JavaScript from a CDN (Content Delivery Network), jQuery, and SweetAlert.

3. Script Files: The custom JavaScript logic for handling tasks and projects is contained in the "script.js" file, which is included in the page.

4. Container: The main content is wrapped in a container div, which is styled to have a top and bottom margin of 50 pixels.

5. Add Task Button: This button, when clicked, triggers the modal dialog to add a new task.

6. Delete Project Form: A form with a select dropdown and a "Delete Project" button, allowing users to delete a project. The form's submission is handled by the taskObj.deleteProject(this) function.

7. Table: A table that displays all tasks. It has several table headers: "Task," "Project," "Status," "Duration," "Date," and "Action." The task data will be populated dynamically into the "all-tasks" tbody element.

8. Add Task Modal: A modal dialog with a form to add a new task. It includes:

A dropdown to select an existing project.<br />
An input field to create a new project.<br />
An input field to enter the task name.<br />
A "Close" button to close the modal.<br />
An "Add Task" button to submit the form and add the task. The form submission is handled by the taskObj.addTask(this) function.<br />

# script.js

This JavaScript file contains the logic to manage tasks and projects on the web page. Let's go through the functionalities provided by this script:

1. Local Storage and Project Object: The script uses local storage to store project and task data. The "projects" key is used to store an array of project objects, each containing an ID, name, and an array of tasks.

2. addProject: This function adds a new project to the local storage. It checks if the project name is provided and then creates a new project object with an empty tasks array. It then pushes the new project into the projects array and updates the local storage. Afterward, it reloads all projects and displays all tasks.

3. getAllProjects: This function retrieves all stored projects from local storage.

4. getProject: This function retrieves a single project using its ID.

5. loadAllProjects: This function loads all projects into dropdowns in the web page.

6. addTask: This function adds a new task to a selected project. It retrieves the selected project and task name from the form, creates a new task object with default properties, and adds it to the tasks array of the selected project. The task start time is also logged, and the local storage is updated to reflect the changes. The function then hides the modal and reloads all tasks.

7. showAllTasks: This function displays all tasks in the table. It retrieves all projects, iterates through each project's tasks, and generates table rows displaying the task details like name, project name, status, duration, start time, and action buttons.

8. getCurrentTimeInTaskStartEndFormat: This utility function returns the current date and time in a specific format suitable for task start and end times.

9. changeTaskStatus: This function handles changes in task status. Depending on the selected status (start, stop, progress, complete, or delete), it performs appropriate actions like starting/stopping the task timer, marking a task as complete, or deleting a task. It updates the local storage accordingly and reloads tasks.

10. deleteProject: This function handles project deletion. It prompts for confirmation, removes the selected project from the projects array, and updates the local storage. Afterward, it reloads all projects and displays all tasks.

11. Window Load Event: The script adds an event listener to the window's "load" event. When the page loads, it loads all projects and tasks, and then sets an interval to update the running task timers every second.

Overall, the "script.js" file provides the necessary logic to manage tasks and projects on the web page, including adding tasks, changing task status, deleting tasks, and deleting projects. It also handles displaying task durations and updating running task timers.

# style.css

This CSS file contains the styling rules for the web page. Let's go through the styles defined in this file:

1. .started: This style is applied to elements with the "started" class. It sets the text color to white, font weight to bold, background color to green, padding to 5 pixels, and adds a border-radius of 5 pixels. This style is used to highlight tasks that are currently in progress (started).

2. .completed: This style is applied to elements with the "completed" class. It sets the text color to white, font weight to bold, background color to greenyellow, padding to 5 pixels, and adds a border-radius of 5 pixels. This style is used to highlight tasks that are marked as completed.

3. body: This style sets the background color of the whole page to "#C0C0C0," which is a light gray color.

Overall, the "style.css" file contains simple styles to visually represent the status of tasks (started or completed) using different background colors. Additionally, it sets a light gray background for the entire page. The actual appearance of the web page will depend on how these styles are applied to the HTML elements in conjunction with Bootstrap classes.





