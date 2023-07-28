// main object
var taskObj = {

    // local storage key
    key: "projects",

    // add project
    addProject: function () {

        // check if project is selected
        if (document.getElementById("add-project").value == "") {
            swal("Please enter project name");
            return false;
        }

        // initialize local storage if not already initialized
        var option = "";
        if (localStorage.getItem(this.key) == null) {
            localStorage.setItem(this.key, "[]");
        }

        // get stored object from local storage
        var data = JSON.parse(localStorage.getItem(this.key));

        // project object
        var project = {
            id: data.length,
            name: document.getElementById("add-project").value,
            tasks: []
        };

        // push new project in local storage
        data.push(project);
        localStorage.setItem(this.key, JSON.stringify(data));

        // re-load all projects
        this.loadAllProjects();

        // show all tasks
        this.showAllTasks();
    },

    // get all stored projects
    getAllProjects: function() {
        if (localStorage.getItem(this.key) == null) {
            localStorage.setItem(this.key, "[]");
        }
        return JSON.parse(localStorage.getItem(this.key))
    },

    // get single project using ID
    getProject: function(id) {
        var projects = this.getAllProjects();
        for (var a = 0; a < projects.length; a++) {
            if (projects[a].id == id) {
                return projects[a];
            }
        }
        return null;
    },

    // load all projects in dropdown
    loadAllProjects: function () {
        var projects = taskObj.getAllProjects();
        projects = projects.reverse();
        var html = "<option value=''>Select Project</option>";
        for (var a = 0; a < projects.length; a++) {
            html += "<option value='" + projects[a].id + "'>" + projects[a].name + "</option>";
        }
        document.getElementById("add-task-project").innerHTML = html;
        document.getElementById("form-task-hour-calculator-all-projects").innerHTML = html;
    },

    // add new task
    addTask: function (form) {

        // get selected project and entered task
        var project = form.project.value;
        var task = form.task.value;

        // add task in project's array
        var projects = this.getAllProjects();
        for (var a = 0; a < projects.length; a++) {
            if (projects[a].id == project) {
                var taskObj = {
                    id: projects[a].tasks.length,
                    name: task,
                    status: "Progress", // Progress, Completed
                    isStarted: false,
                    logs: [],
                    started: this.getCurrentTimeInTaskStartEndFormat(),
                    ended: ""
                }
                projects[a].tasks.push(taskObj);
                break;
            }
        }

        // update local storage
        localStorage.setItem(this.key, JSON.stringify(projects));

        // hide modal
        jQuery("#addTaskModal").modal("hide");
        jQuery('.modal-backdrop').remove();

        // re-load all tasks
        this.showAllTasks();

        // prevent form from submitting
        return false;
    },

    // show all tasks in table
    showAllTasks: function () {
        var html = "";

        // get all projects
        var projects = this.getAllProjects();
        for (var a = 0; a < projects.length; a++) {
            projects[a].tasks = projects[a].tasks.reverse();

            // get tasks in each project
            for (var b = 0; b < projects[a].tasks.length; b++) {
                html += "<tr>";
                    html += "<td>" + projects[a].tasks[b].name + "</td>";
                    html += "<td>" + projects[a].name + "</td>";
                    if (projects[a].tasks[b].isStarted) {
                        html += "<td><label class='started'>Started</label></td>";
                    } else {
                        if (projects[a].tasks[b].status == "Completed") {
                            html += "<td><label class='completed'>" + projects[a].tasks[b].status + "</label></td>";
                        } else {
                            html += "<td>" + projects[a].tasks[b].status + "</td>";
                        }
                    }

                    // get total duration of each task using it's logs
                    var duration = 0;
                    for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                        var log = projects[a].tasks[b].logs[c];
                        if (log.endTime > 0) {
                            duration += log.endTime - log.startTime;
                        }
                    }

                    // convert millisecond into hours, minutes and seconds
                    duration = Math.abs((duration / 1000).toFixed(0));
                    var hours = Math.floor(duration / 3600) % 24;
                    hours = (hours < 10) ? "0" + hours : hours;
                    // var days = Math.floor(diff / 86400);
                    var minutes = Math.floor(duration / 60) % 60;
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    var seconds = duration % 60;
                    seconds = (seconds < 10) ? "0" + seconds : seconds;

                    // show timer if task is already started
                    if (projects[a].tasks[b].isStarted) {
                        var dataStartedObj = {
                            "duration": duration,
                            "project": projects[a].id,
                            "task": projects[a].tasks[b].id
                        };
                        html += "<td data-started='" + JSON.stringify(dataStartedObj) + "'>" + hours + ":" + minutes + ":" + seconds + "</td>";
                    } else {
                        html += "<td>" + hours + ":" + minutes + ":" + seconds + "</td>";
                    }

                    // show task duration if completed
                    if (projects[a].tasks[b].status == "Completed") {
                        html += "<td>" + projects[a].tasks[b].started + "<br><span style='margin-left: 30px;'>to</span><br>" + projects[a].tasks[b].ended + "</td>";
                    } else {
                        html += "<td>" + projects[a].tasks[b].started + "</td>";
                    }

                    // form to change task status
                    html += "<td>";
                        html += "<form method='POST' id='form-change-task-status-" + projects[a].id + projects[a].tasks[b].id + "'>";
                            html += "<input type='hidden' name='project' value='" + projects[a].id + "'>";
                            html += "<input type='hidden' name='task' value='" + projects[a].tasks[b].id + "'>";
                            html += "<select class='form-control' name='status' onchange='taskObj.changeTaskStatus(this);' data-form-id='form-change-task-status-" + projects[a].id + projects[a].tasks[b].id + "'>";
                                html += "<option value=''>Change status</option>";
                                if (projects[a].tasks[b].isStarted) {
                                    html += "<option value='stop'>Stop</option>";
                                } else {
                                    html += "<option value='start'>Start</option>";
                                }
                                if (projects[a].tasks[b].status == "Progress") {
                                    html += "<option value='complete'>Mark as Completed</option>";
                                } else {
                                    html += "<option value='progress'>Make in Progress Again</option>";
                                }
                                html += "<option value='delete'>Delete</option>";
                            html += "</select>";
                        html += "</form>";
                    html += "</td>";
                html += "</tr>";
            }
        }
        document.getElementById("all-tasks").innerHTML = html;
    },

    // get current datetime in proper format (e.g. 2021-06-15 20:53:15)
    getCurrentTimeInTaskStartEndFormat() {
        let current_datetime = new Date();
        var date = current_datetime.getDate();
        date = (date < 10) ? "0" + date : date;
        var month = (current_datetime.getMonth() + 1);
        month = (month < 10) ? "0" + month : month;
        var hours = current_datetime.getHours();
        hours = (hours < 10) ? "0" + hours : hours;
        var minutes = current_datetime.getMinutes();
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        var seconds = current_datetime.getSeconds();
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        let formatted_date = current_datetime.getFullYear() + "-" + month + "-" + date + " " + hours + ":" + minutes;
        //let formatted_date = current_datetime.getFullYear() + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        return formatted_date;
    },

    // change task status
    changeTaskStatus: function (self) {

        // if task is not selected
        if (self.value == "") {
            return;
        }

        // loop through all projects
        var formId = self.getAttribute("data-form-id");
        var form = document.getElementById(formId);
        var projects = this.getAllProjects();
        for (var a = 0; a < projects.length; a++) {

            // if project matches
            if (projects[a].id == form.project.value) {

                // loop through all tasks of that project
                for (var b = 0; b < projects[a].tasks.length; b++) {

                    // if task matches
                    if (projects[a].tasks[b].id == form.task.value) {

                        // if the status is set to delete
                        if (self.value == "delete") {

                            // ask for confirmation
                            swal({
                                title: "Are you sure?",
                                text: "Deleting the task will delete its hours too.",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                            .then((willDelete) => {
                                if (willDelete) {

                                    // remove task from array
                                    projects[a].tasks.splice(b, 1);

                                    // update local storage
                                    localStorage.setItem(this.key, JSON.stringify(projects));

                                    // re-load all tasks
                                    this.showAllTasks();
                                } else {

                                    // reset dropdown
                                    self.value = "";
                                }
                            });
                        } else if (self.value == "complete") {
                            // mark as completed
                            projects[a].tasks[b].status = "Completed";

                            // stop the timer
                            projects[a].tasks[b].isStarted = false;

                            // log end time
                            projects[a].tasks[b].ended = this.getCurrentTimeInTaskStartEndFormat();
                            for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                                if (projects[a].tasks[b].logs[c].endTime == 0) {
                                    projects[a].tasks[b].logs[c].endTime = new Date().getTime();
                                    break;
                                }
                            }
                        } else if (self.value == "progress") {
                            // mark as in progress
                            projects[a].tasks[b].status = "Progress";

                            // stop the timer
                            projects[a].tasks[b].isStarted = false;
                        } else if (self.value == "start") {
                            // ask for confirmation
                            swal({
                                title: "Are you sure?",
                                text: "This will start the timer.",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                            .then((doStart) => {
                                if (doStart) {
                                    
                                    // mark as started
                                    projects[a].tasks[b].isStarted = true;

                                    // add in log
                                    var logObj = {
                                        id: projects[a].tasks[b].logs.length,
                                        startTime: new Date().getTime(),
                                        endTime: 0
                                    };
                                    projects[a].tasks[b].logs.push(logObj);

                                    // update local storage
                                    localStorage.setItem(this.key, JSON.stringify(projects));

                                    // re-load all tasks
                                    this.showAllTasks();
                                } else {

                                    // reset dropdown
                                    self.value = "";
                                }
                            });
                        } else if (self.value == "stop") {

                            // ask for confirmation
                            swal({
                                title: "Are you sure?",
                                text: "This will stop the timer.",
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                            .then((doStop) => {
                                if (doStop) {

                                    // mark as stopped
                                    projects[a].tasks[b].isStarted = false;

                                    // update end time in log
                                    for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                                        if (projects[a].tasks[b].logs[c].endTime == 0) {
                                            projects[a].tasks[b].logs[c].endTime = new Date().getTime();
                                            break;
                                        }
                                    }

                                    // update local storage
                                    localStorage.setItem(this.key, JSON.stringify(projects));

                                    // re-load tasks
                                    this.showAllTasks();
                                } else {

                                    // reset dropdown
                                    self.value = "";
                                }
                            });
                        }
                        break;
                    }
                }
                break;
            }
        }

        // delete, start and stop are already handled above
        if (self.value == "delete"
            || self.value == "start"
            || self.value == "stop") {
            //
        } else {
            // update local storage and re-load tasks
            localStorage.setItem(this.key, JSON.stringify(projects));
            this.showAllTasks();
        }
    },

    // delete project
    deleteProject: function (self) {

        // check if any project is selected
        if (self.project.value == "") {
            swal("Please select a project to delete");
            return false;
        }

        // ask for confirmation
        swal({
            title: "Are you sure?",
            text: "Deleting the project will delete its tasks too.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {

                // remove from array and update local storage
                var projects = this.getAllProjects();
                for (var a = 0; a < projects.length; a++) {
                    if (projects[a].id == self.project.value) {
                        projects.splice(a, 1);
                        localStorage.setItem(this.key, JSON.stringify(projects));

                        // re-load data
                        this.loadAllProjects();
                        this.showAllTasks();

                        break;
                    }
                }
            } else {

                // reset project dropdown
                self.project.value = "";
            }
        });
        return false;
    }
};

// when page loads
window.addEventListener("load", function () {

    // show all projects and tasks
    taskObj.loadAllProjects();
    taskObj.showAllTasks();

    // call this function each second
    setInterval(function () {

        // increment 1 second in all running tasks
        var dataStarted = document.querySelectorAll("td[data-started]");
        for (var i = 0; i < dataStarted.length; i++) {
            var dataStartedObj = dataStarted[i].getAttribute("data-started");
            var dataStartedObj = JSON.parse(dataStartedObj);
            dataStartedObj.duration++;

            // convert timestamp into readable format
            var hours = Math.floor(dataStartedObj.duration / 3600) % 24;
            hours = (hours < 10) ? "0" + hours : hours;
            // var days = Math.floor(diff / 86400);
            var minutes = Math.floor(dataStartedObj.duration / 60) % 60;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            var seconds = dataStartedObj.duration % 60;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            dataStarted[i].innerHTML = hours + ":" + minutes + ":" + seconds;

            // update log end time
            var projects = taskObj.getAllProjects();
            for (var a = 0; a < projects.length; a++) {
                if (projects[a].id == dataStartedObj.project) {
                    for (var b = 0; b < projects[a].tasks.length; b++) {
                        if (projects[a].tasks[b].id == dataStartedObj.task) {
                            for (var c = 0; c < projects[a].tasks[b].logs.length; c++) {
                                if (c == projects[a].tasks[b].logs.length - 1) {
                                    projects[a].tasks[b].logs[c].endTime = new Date().getTime();

                                    // update local storage
                                    window.localStorage.setItem(taskObj.key, JSON.stringify(projects));

                                    // update timer
                                    dataStarted[i].setAttribute("data-started", JSON.stringify(dataStartedObj));

                                    break;
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }, 1000);
});