const employeeForm =
    document.getElementById("employeeForm");

const employeeTable =
    document.getElementById("employeeTable");

const searchInput =
    document.getElementById("search");


let employees = [];

let editingId = null;


// Load employees

async function loadEmployees() {

    const response =
        await fetch("/api/employees");

    employees =
        await response.json();

    displayEmployees(employees);

    updateDashboard();
}


// Display employees

function displayEmployees(list) {

    employeeTable.innerHTML = "";

    if (list.length === 0) {

        employeeTable.innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center;padding:30px;">
                    No employees found
                </td>
            </tr>
        `;

        return;
    }


    list.forEach(employee => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${employee.id}</td>

            <td>
                <strong>
                    ${escapeHTML(employee.name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(employee.email)}
            </td>

            <td>
                ${escapeHTML(employee.phone)}
            </td>

            <td>
                ${escapeHTML(employee.department)}
            </td>

            <td>
                ${escapeHTML(employee.position)}
            </td>

            <td>
                ₹${Number(employee.salary).toLocaleString("en-IN")}
            </td>

            <td>
                ${employee.joining_date}
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editEmployee(${employee.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteEmployee(${employee.id})">
                    Delete
                </button>

            </td>
        `;


        employeeTable.appendChild(row);

    });
}


// Add / Update employee

employeeForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const employee = {

            name:
                document.getElementById("name")
                .value.trim(),

            email:
                document.getElementById("email")
                .value.trim(),

            phone:
                document.getElementById("phone")
                .value.trim(),

            department:
                document.getElementById("department")
                .value,

            position:
                document.getElementById("position")
                .value.trim(),

            salary:
                document.getElementById("salary")
                .value,

            joining_date:
                document.getElementById("joining_date")
                .value
        };


        let url = "/api/employees";

        let method = "POST";


        if (editingId !== null) {

            url =
                `/api/employees/${editingId}`;

            method = "PUT";
        }


        const response =
            await fetch(url, {

                method: method,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(employee)
            });


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.error);

            return;
        }


        employeeForm.reset();

        editingId = null;

        document.querySelector(
            "form button"
        ).textContent = "Add Employee";


        loadEmployees();

    }
);


// Edit employee

function editEmployee(id) {

    const employee =
        employees.find(e => e.id === id);


    if (!employee) return;


    document.getElementById("name")
        .value = employee.name;

    document.getElementById("email")
        .value = employee.email;

    document.getElementById("phone")
        .value = employee.phone;

    document.getElementById("department")
        .value = employee.department;

    document.getElementById("position")
        .value = employee.position;

    document.getElementById("salary")
        .value = employee.salary;

    document.getElementById("joining_date")
        .value = employee.joining_date;


    editingId = id;


    document.querySelector(
        "form button"
    ).textContent = "Update Employee";


    window.scrollTo({
        top: 350,
        behavior: "smooth"
    });
}


// Delete employee

async function deleteEmployee(id) {

    const employee =
        employees.find(e => e.id === id);


    if (!employee) return;


    const confirmed =
        confirm(
            `Delete ${employee.name}?`
        );


    if (!confirmed) return;


    await fetch(
        `/api/employees/${id}`,
        {
            method: "DELETE"
        }
    );


    loadEmployees();
}


// Search

searchInput.addEventListener(
    "input",
    function() {

        const text =
            this.value.toLowerCase();


        const filtered =
            employees.filter(employee =>

                employee.name
                    .toLowerCase()
                    .includes(text)

                ||

                employee.email
                    .toLowerCase()
                    .includes(text)

                ||

                employee.department
                    .toLowerCase()
                    .includes(text)

                ||

                employee.position
                    .toLowerCase()
                    .includes(text)
            );


        displayEmployees(filtered);

    }
);


// Dashboard

function updateDashboard() {

    const total =
        employees.length;


    const departments =
        new Set(
            employees
                .map(e => e.department)
                .filter(Boolean)
        ).size;


    const salary =
        employees.reduce(
            (total, employee) =>
                total +
                Number(employee.salary || 0),
            0
        );


    document.getElementById(
        "totalEmployees"
    ).textContent = total;


    document.getElementById(
        "totalDepartments"
    ).textContent = departments;


    document.getElementById(
        "totalSalary"
    ).textContent =
        "₹" +
        salary.toLocaleString("en-IN");
}


// Security helper

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;
}


// Start

loadEmployees();