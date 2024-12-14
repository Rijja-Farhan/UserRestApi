const apiUrl = 'http://localhost:3000/users';
let currentUpdateId;

async function fetchData() {
    try {
        const response = await fetch(`${apiUrl}/get`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.length === 0) {
            alert('No data available');
            return;
        }

        displayData(data);
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch data.');
    }
}

function displayData(data) {
    const $tableHead = $("#dataTable thead tr");
    const $tableBody = $("#dataTable tbody");

    $tableHead.empty();
    $tableBody.empty();

   
    const headers = Object.keys(data[0])

    headers.forEach(header => {
        $tableHead.append(`<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`);
    });

    $tableHead.append('<th>Actions</th>');

    
    data.forEach(item => {
        const $row = $('<tr></tr>');

        headers.forEach(header => {
            $row.append(`<td>${item[header]}</td>`);
        });

        const $actionCell = $('<td></td>');
        const $updateButton = $('<button>Update</button>').on('click', () => updateRow(item._id));
        const $deleteButton = $('<button>Delete</button>').on('click', () => deleteRow(item._id));

        $actionCell.append($updateButton).append($deleteButton);
        $row.append($actionCell);
        $tableBody.append($row);
    });
}


function showForm(mode, data = {}) {
    $('#entryMode').val(mode);
    $('#name').val(data.name || '');
    $('#email').val(data.email || '');
    $('#age').val(data.age || '');
    $('#formSubmitButton').text(mode === 'add' ? 'Add Entry' : 'Update Entry');
    $('#formContainer').show();
}


function closeForm() {
    $('#formContainer').hide();
}


$('#entryForm').on('submit', async function (event) {
    event.preventDefault();

    const mode = $('#entryMode').val();
    const entryData = {
        name: $('#name').val(),
        email: $('#email').val(),
        age: $('#age').val()
    };

    if (mode === 'add') {
        try {
            const response = await fetch(`${apiUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entryData)
            });

            if (!response.ok) {
                throw new Error('Failed to add data to the server.');
            }

            alert('New entry has been added successfully.');
            fetchData();  
        } catch (error) {
            console.error('Add error:', error);
            alert('Failed to add data.');
        }
    } else if (mode === 'update') {
        try {
            const response = await fetch(`${apiUrl}/update/${currentUpdateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entryData)
            });

            if (!response.ok) {
                throw new Error('Failed to update data on the server.');
            }

            alert(`Item with ID: ${currentUpdateId} has been updated successfully.`);
            fetchData();
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update data.');
        }
    }

    closeForm();
});


async function deleteRow(id) {
    const confirmDelete = confirm(`Are you sure you want to delete the item with ID: ${id}?`);
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/delete/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete data on the server.');
        }

        alert(`Item with ID: ${id} has been deleted successfully.`);
        fetchData(); 
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete data.');
    }
}


async function updateRow(id) {
    currentUpdateId = id;

    try {
        const response = await fetch(`${apiUrl}/get/${currentUpdateId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch data for update.');
        }

        const data = await response.json();
        if (data) {
            showForm('update', data);  // Prefill the form with the fetched data
        }
    } catch (error) {
        console.error('Update error:', error);
        alert('Failed to fetch data for update.');
    }
}

// Add new user button handler
$('#addNewButton').on('click', function () {
    showForm('add');
});

// Fetch data when the "Display Data" button is clicked
$('#DisplayDataButton').on('click', fetchData);

// Initialize the data fetch when the page loads
$(document).ready(function () {
    fetchData();
});
