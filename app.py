from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

employees = [
    {
        "id": 1,
        "name": "Rahul Kumar",
        "email": "rahul@gmail.com",
        "phone": "9876543210",
        "department": "IT",
        "position": "Software Developer",
        "salary": 45000,
        "joining_date": "2025-01-15"
    },
    {
        "id": 2,
        "name": "Priya Sharma",
        "email": "priya@gmail.com",
        "phone": "9876501234",
        "department": "HR",
        "position": "HR Manager",
        "salary": 50000,
        "joining_date": "2024-08-20"
    }
]


@app.route("/")
def home():
    return render_template("index.html")


# Get all employees
@app.route("/api/employees", methods=["GET"])
def get_employees():
    return jsonify(employees)


# Add employee
@app.route("/api/employees", methods=["POST"])
def add_employee():

    data = request.get_json()

    if not data.get("name") or not data.get("email"):
        return jsonify({
            "error": "Name and email are required"
        }), 400

    new_employee = {
        "id": max([e["id"] for e in employees], default=0) + 1,
        "name": data["name"],
        "email": data["email"],
        "phone": data.get("phone", ""),
        "department": data.get("department", ""),
        "position": data.get("position", ""),
        "salary": data.get("salary", 0),
        "joining_date": data.get("joining_date", "")
    }

    employees.append(new_employee)

    return jsonify(new_employee), 201


# Update employee
@app.route("/api/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):

    data = request.get_json()

    for employee in employees:

        if employee["id"] == employee_id:

            employee["name"] = data.get(
                "name", employee["name"]
            )

            employee["email"] = data.get(
                "email", employee["email"]
            )

            employee["phone"] = data.get(
                "phone", employee["phone"]
            )

            employee["department"] = data.get(
                "department", employee["department"]
            )

            employee["position"] = data.get(
                "position", employee["position"]
            )

            employee["salary"] = data.get(
                "salary", employee["salary"]
            )

            employee["joining_date"] = data.get(
                "joining_date",
                employee["joining_date"]
            )

            return jsonify(employee)

    return jsonify({
        "error": "Employee not found"
    }), 404


# Delete employee
@app.route("/api/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    global employees

    for employee in employees:

        if employee["id"] == employee_id:

            employees = [
                e for e in employees
                if e["id"] != employee_id
            ]

            return jsonify({
                "message": "Employee deleted successfully"
            })

    return jsonify({
        "error": "Employee not found"
    }), 404


if __name__ == "__main__":
    app.run(debug=True)