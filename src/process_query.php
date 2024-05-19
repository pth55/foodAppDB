<?php
// Establish a connection to the database
$connection = mysqli_connect('localhost', 'root', '', 'online_food_app');

// Check if the connection was successful
if (!$connection) {
    die('Connection failed: ' . mysqli_connect_error());
}

// Get the SQL query from the POST request
$query = $_POST['query'];

// Execute the SQL query
$result = mysqli_query($connection, $query);

// Process the query result
if ($result) {
    // Fetch data from the result set
    $data = mysqli_fetch_all($result, MYSQLI_ASSOC);
    // Return the data as JSON
    echo json_encode($data);
} else {
    // Handle query execution error
    echo json_encode(['error' => 'Error executing query: ' . mysqli_error($connection)]);
}

// Close the database connection
mysqli_close($connection);
?>
