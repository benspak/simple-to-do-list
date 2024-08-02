# Simple To Do

## Prompts Used

### Client Side Prompt

Help me create a to-do chrome browser extension. Add, edit and delete entries. Persist all data with Chrome local storage. Also track the status of the task via JSON.

Ask the user to verify they want to delete an item.  Rather than using a popup or alert to edit text, allow it to be edited inline by clicking the icon provided "EditIcon.svg".

Add "Made by Popvia.com" in small text on the bottom right on all views.

Allow users to export active tasks to CSV. Use the CSV header "Active Tasks". Add "Export to CSV" button on the bottom left of all views.

Use the attached icons "incomplete.svg" to denote li list items. When those items are clicked on and marked as completed by the user, strike through the text and change the incomplete icon to "completed.svg".

Instead of an "edit" button use the "EditIcon.svg" place it to the right of the task.

For deleting tasks use "Delete.svg" as the delete function icon, align it with the right side of the view.

Make the body a min width and height of 400px. Make the text use these Google fonts.

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet">

Make buttons have a background color of #5941A9 and a text color of #E5E5E5. Make body text of task items and headers this font color #0B0418.

### Server Side Prompt

Help me create a node/express REST server that receives to-do items and persists them for a user with a mongoDB back-end. Todo Items can be in two states, complete or incomplete, which could be displayed as a boolean. Todo items also have text and id, date created, and date modified. Here's an example of a ToDo item in JSON.

{
    "id": 1,
    "text": "Test Text",
    "complete": False,
    "Date Created": "DATE",
    "Date Modified": "DATE"
}

Help me host this node.js server and mongo DB server on NameCheap's shared hosting.
