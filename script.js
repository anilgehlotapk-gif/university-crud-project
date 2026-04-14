let selectedRow = null;

// Range slider
let range = document.getElementById("duration");
let output = document.getElementById("durationValue");

output.innerText = range.value;

range.oninput = function () {
    output.innerText = this.value;
};

// Get Inputs
function getInputValues() {
    let type = document.querySelector('input[name="type"]:checked');

    return {
        id: document.getElementById("id").value.trim(),
        name: document.getElementById("name").value.trim(),
        dept: document.getElementById("dept").value,
        duration: document.getElementById("duration").value,
        fees: document.getElementById("fees").value.trim(),
        startDate: document.getElementById("startDate").value,
        type: type ? type.value : ""
    };
}

// Validation
function validate(data) {
    if (!data.id || !data.name || !data.dept || !data.duration || !data.fees || !data.startDate || !data.type) {
        alert("Fill all fields!");
        return false;
    }
    return true;
}

// Add Data
function addData() {
    let data = getInputValues();
    if (!validate(data)) return;

    // Duplicate check
    let rows = document.querySelectorAll("#tableBody tr");
    for (let row of rows) {
        if (row.cells[0].innerText === data.id) {
            alert("Program ID already exists!");
            return;
        }
    }

    let program = new Program(
        data.id, data.name, data.dept,
        data.duration, data.fees,
        data.startDate, data.type
    );

    let table = document.getElementById("tableBody");
    let row = table.insertRow();

    row.insertCell(0).innerText = program.id;
    row.insertCell(1).innerText = program.name;
    row.insertCell(2).innerText = program.department;
    row.insertCell(3).innerText = program.duration;
    row.insertCell(4).innerText = program.fees;
    row.insertCell(5).innerText = program.startDate;
    row.insertCell(6).innerText = program.type;

    row.onclick = function () {
        selectedRow = this;

        document.getElementById("id").value = this.cells[0].innerText;
        document.getElementById("name").value = this.cells[1].innerText;
        document.getElementById("dept").value = this.cells[2].innerText;
        document.getElementById("duration").value = this.cells[3].innerText;
        document.getElementById("fees").value = this.cells[4].innerText;
        document.getElementById("startDate").value = this.cells[5].innerText;

        let type = this.cells[6].innerText;
        document.querySelector(`input[name="type"][value="${type}"]`).checked = true;

        output.innerText = this.cells[3].innerText;
    };

    alert("Data added successfully!");
    clearForm();
}

// Update
function updateData() {
    if (selectedRow === null) {
        alert("Select a row first!");
        return;
    }

    let data = getInputValues();
    if (!validate(data)) return;

    selectedRow.cells[0].innerText = data.id;
    selectedRow.cells[1].innerText = data.name;
    selectedRow.cells[2].innerText = data.dept;
    selectedRow.cells[3].innerText = data.duration;
    selectedRow.cells[4].innerText = data.fees;
    selectedRow.cells[5].innerText = data.startDate;
    selectedRow.cells[6].innerText = data.type;

    alert("Data updated successfully!");
    selectedRow = null;
    clearForm();
}

// Delete
function deleteData() {
    if (selectedRow === null) {
        alert("Select a row first!");
        return;
    }

    if (confirm("Are you sure you want to delete?")) {
        selectedRow.remove();
        selectedRow = null;
        alert("Data deleted successfully!");
        clearForm();
    }
}

// Clear
function clearForm() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("dept").value = "";
    document.getElementById("duration").value = 3;
    document.getElementById("fees").value = "";
    document.getElementById("startDate").value = "";

    output.innerText = 3;

    let radios = document.querySelectorAll('input[name="type"]');
    radios.forEach(r => r.checked = false);
}

// 🔍 Search
function searchData() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#tableBody tr");

    rows.forEach(row => {
        let text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? "" : "none";
    });
}

// 🔃 Sort
function sortTable(colIndex) {
    let table = document.getElementById("tableBody");
    let rows = Array.from(table.rows);
    let asc = table.getAttribute("data-sort") !== "asc";

    rows.sort((a, b) => {
        let x = a.cells[colIndex].innerText.toLowerCase();
        let y = b.cells[colIndex].innerText.toLowerCase();
        return asc ? x.localeCompare(y) : y.localeCompare(x);
    });

    rows.forEach(row => table.appendChild(row));
    table.setAttribute("data-sort", asc ? "asc" : "desc");
}