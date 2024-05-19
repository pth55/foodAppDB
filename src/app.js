var clicked = false; // if div already inserted don't insert again

function insertImage() {
    clearContainer(); // Clear any existing content
    if (!clicked) {
        var newDiv = document.createElement('div');
        newDiv.classList.add('image-container'); // Add a class to the new div
        newDiv.className = "insertedImage";
        newDiv.id = "insertedImage";

        var img = document.createElement('img');
        img.src = './img/er.png';
        img.alt = 'Your Image';
    
        newDiv.appendChild(img);
        var mainTag = document.querySelector('main');
        var buttonsContainer = document.querySelector('.buttons-container');
        mainTag.insertBefore(newDiv, buttonsContainer.nextSibling);

        clicked = true; // means div already inserted 
    }
}

var formCreated = false; // Flag to track if form is already created

// Define clearContainer function globally
function clearContainer() {
    // Clear the container
    var container = document.getElementById('container');
    if (container) {
        container.remove();
        formCreated = false; // Reset formCreated if the container is removed
    }

    // Clear the result div
    var resultDiv = document.getElementById('resultDiv');
    if (resultDiv) {
        resultDiv.remove();
    }

    var image = document.getElementById('insertedImage');
    if (image) {
        image.remove();
    }

    // Clear the table options select menu
    var tableOptions = document.getElementById('tableSelect');
    if (tableOptions) {
        tableOptions.remove();
    }
    var container2 = document.getElementById('container2');
    if (container2) {
        container2.remove();
    }
    clicked = false;
    selected = false;
}


// Define createForm function
function createForm() {
    
    // Create the container div
    var container = document.createElement('div');
    container.id = "container";

    // Create the form element
    var form = document.createElement("form");
    form.id = "sqlForm";

    // Create the input field
    var input = document.createElement("input");
    input.type = "text";
    input.id = "sqlQuery";
    input.placeholder = "Enter Valid SQL Query";

    // Create the submit button
    var btn = document.createElement('button');
    btn.type = "submit";
    btn.innerText = "Submit";

    // Append the input field and submit button to the form
    form.appendChild(input);
    form.appendChild(btn);

    // Append the form to the container
    container.appendChild(form);

    // Append the container to the document body or any desired location
    var mainTag = document.querySelector('main');
    mainTag.appendChild(container);

    // Add event listener to the form to handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get the SQL query entered by the user
        var query = input.value;

        // Make an AJAX request to send the query to the server
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    // Handle the response from the server
                    var response = this.responseText;
                    
                    // Check if the response starts with '<', indicating HTML error message
                    if (response.startsWith('<')) {
                        // Display error message directly
                        console.error('Server returned HTML error message:', response);
                        displayErrorMessage(response);
                        return; // Exit the function early
                    }
                    // Try parsing the response as JSON
                    try {
                        var jsonData = JSON.parse(response);
                        displayResult(jsonData);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        displayErrorMessage('THERE IS NO OUPUT FOR YOUR QUERY, MAKE SURE TO HAVE SOME VALID DATA IN DB THAT MATCHES YOUR QUERY');
                    }
                } else {
                    // Handle HTTP errors
                    console.error('HTTP error:', this.status, this.statusText);
                    displayErrorMessage('HTTP error: ' + this.status + ' ' + this.statusText);
                }
            }
        };
        xhttp.open("POST", "./process_query.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("query=" + encodeURIComponent(query));
    });
}

function displayErrorMessage(message) {
    if(message.includes('must be of type mysqli_result, bool given in')) {
        alert("INSERT | DELETE | UPDATE Operation Success!!!");
        return;
    }
    // Remove HTML tags from the message
    var error_msg = document.getElementsByClassName("error-message");
    if (error_msg.length > 0) {
        // Remove each error message
        for (var i = 0; i < error_msg.length; i++) {
            error_msg[i].remove();
        }
    }
    var plainTextMessage = message.replace(/<[^>]+>/g, '');

    // Create a container div for the error message
    var errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = plainTextMessage;
    errorDiv.style.color = "red";
    errorDiv.style.fontWeight = 500;

    // Append the error message to the document body or any desired location
    var mainTag = document.querySelector('main');
    mainTag.appendChild(errorDiv);
}

// Define executeQuery function
function executeQuery() {
    clearContainer(); // Clear any existing content

    // Create the form if it's not already created
    if (!formCreated) {
        createForm();
        formCreated = true; // Set formCreated to true
    }
}

function displayResult(result) {
    var error_msg = document.getElementsByClassName("error-message");
    if (error_msg.length > 0) {
        // Remove each error message
        for (var i = 0; i < error_msg.length; i++) {
            error_msg[i].remove();
        }
    }
    // Check if result is undefined or null
    if (!result) {
        console.error('No result data provided');
        return; // Exit the function early
    }

    // Clear any existing result
    clearContainer();

    // Check if the result is a string
    if (typeof result === 'string') {
        // Check if the result starts with '<', indicating HTML error message
        if (result.startsWith('<')) {
            // Display error message directly
            var resultDiv = document.createElement('div');
            resultDiv.innerHTML = result; // Using innerHTML to render HTML error message
            var mainTag = document.querySelector('main');
            mainTag.appendChild(resultDiv);
            return; // Exit the function early
        } else {
            // Display the string directly
            var resultDiv = document.createElement('div');
            resultDiv.textContent = result;
            var mainTag = document.querySelector('main');
            mainTag.appendChild(resultDiv);
        }
    } else if (Array.isArray(result)) {
        // Create a table for array data
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        // Create table headers
        var headers = Object.keys(result[0]); // Assuming the result is not empty
        var headerRow = document.createElement('tr');
        headers.forEach(function(header) {
            var th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Populate table with data
        result.forEach(function(rowData) {
            var row = document.createElement('tr');
            headers.forEach(function(header) {
                var cell = document.createElement('td');
                cell.textContent = rowData[header];
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        var resultDiv = document.createElement('div');
        resultDiv.id = "resultDiv";
        resultDiv.appendChild(table);
        var mainTag = document.querySelector('main');
        mainTag.appendChild(resultDiv);
    } else {
        // Display an error message for invalid result data
        console.error('Invalid result data:', result);
        var resultDiv = document.createElement('div');
        resultDiv.textContent = 'Invalid result data';
        var mainTag = document.querySelector('main');
        mainTag.appendChild(resultDiv);
    }
}

//  3rd button  implementation
// to track the selected state
var selected = false;

// Define a combined function to fetch table data and create the table options menu
function fetchTableDataAndCreateMenu() {
    clearContainer(); // Clear any existing content

    // Create the select element for table options
    var select = document.createElement('select');
    select.id = 'tableSelect';
    select.classList.add('select-menu'); // Add the select-menu class
    
    // Add an empty option as default
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.textContent = "Select a table...";
    select.appendChild(defaultOption);

    // Array of table names
    var tableNames = [
        'address_details',
        'menu',
        'orders',
        'payment',
        'restaurant',
        'users',
        'user_address'
    ];

    // Populate select options with table names
    tableNames.forEach(function(tableName) {
        var option = document.createElement('option');
        option.value = tableName;
        option.textContent = tableName;
        select.appendChild(option);
    });

    // Add event listener to handle table selection
    select.addEventListener('change', function(event) {
        var selectedTableName = event.target.value;
        if (selectedTableName) {
            // Fetch data for the selected table
            fetchTableData(selectedTableName);
        }
    });

    // Append the select element to the container
    var mainTag = document.querySelector('main');
    mainTag.appendChild(select);
}

// Function to fetch table data and display it
function fetchTableData(tableName) {
    // Make an AJAX request to fetch data for the selected table
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // Handle the response from the server
                var responseData = JSON.parse(this.responseText);
                displayResult(responseData);
            } else {
                // Handle HTTP errors
                console.error('HTTP error:', this.status, this.statusText);
                displayErrorMessage('HTTP error: ' + this.status + ' ' + this.statusText);
            }
        }
    };
    xhttp.open("POST", "./process_query.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("query=" + encodeURIComponent("SELECT * FROM " + tableName + ";"));
}

function openInNewTab(url) {
    window.open(url, '_blank');
}


// function executeAny() {
//     var query = prompt("Enter Valid SQL Query...");
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4) {
//             if (this.status == 200) {
//                 // Handle the response from the server
//                 var response = this.responseText;
//                 // Check if the response starts with '<', indicating HTML error message
//                 if (response.startsWith('<')) {
//                     // Display error message directly
//                     console.error('Server returned HTML error message:', response);
//                     alert(response);
//                     return; // Exit the function early
//                 }
//                 // Try parsing the response as JSON
//                 try {
//                     var jsonData = JSON.parse(response);
//                     alert("success!!");
//                 } catch (error) {
//                     console.error('Error parsing JSON:', error);
//                     alert('THERE IS NO OUPUT FOR YOUR QUERY, MAKE SURE TO HAVE SOME VALID DATA IN DB THAT MATCHES YOUR QUERY');
//                 }
//             } else {
//                 // Handle HTTP errors
//                 console.error('HTTP error:', this.status, this.statusText);
//                 alert('HTTP error: ' + this.status + ' ' + this.statusText);
//             }
//         }
//     };
//     xhttp.open("POST", "./process_query.php", true);
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhttp.send("query=" + encodeURIComponent(query));   
// }