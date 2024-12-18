const addInputBar = document.getElementById("add");
const searchBar = document.getElementById("search");

function ajaxGET(url, callback, sentData) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status == 200 && this.readyState == XMLHttpRequest.DONE) {
            callback(this.responseText);
        }
    }

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send("" + sentData);
}

function ajaxPOST(url, data, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status == 200 && this.readyState == XMLHttpRequest.DONE) {
            if (callback) callback();
        }
    }

    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(data);
}

function ajaxDELETE(url, id, callback) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status == 200 && this.readyState == XMLHttpRequest.DONE) {
            if (callback) callback();
        }
    }

    xhr.open("DELETE", url);
    xhr.setRequestHeader("Content-Type", "text/plain");
    xhr.send(id);
}

function onDelete() {
    const tr = this.parentNode.parentNode;

    ajaxDELETE("/delete", tr.querySelector(".id").innerText, function () {
        updateTable("/getData");
    });
}

function onEdit() {
    const rowID = this.parentNode.parentNode.querySelector(".id").innerText;
    const editInputBar = document.getElementById("edit");
    const clonedEditInputBar = editInputBar.cloneNode(true);

    editInputBar.remove();
    document.getElementById("mainTable").insertAdjacentElement("afterend", clonedEditInputBar);

    clonedEditInputBar.removeAttribute("hidden");
    clonedEditInputBar.addEventListener("submit", function (event) {
        event.preventDefault();
        clonedEditInputBar.setAttribute("hidden","");

        const newName = clonedEditInputBar.querySelector("[type='text']").value;
        ajaxPOST("/updateData", `{"id": ${rowID}, "newName": "${newName}"}`, function () {
            updateTable("/getData");
        });

        clonedEditInputBar.querySelector("[type='text']").value = "";
    },
    {once: true});

}

function updateTable(url, filter) {
    ajaxGET(url, function (element) {
        const tableBody = document.getElementById("mainTable").querySelector("tbody");
        const data = JSON.parse(element);

        if (data.length == 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>No Data</td></tr>";
            return;
        }

        tableBody.innerHTML = "";

        data.forEach(value => {
            const templateContent = document.getElementById("rowTemplate").content.cloneNode(true);
            const fragment = document.createDocumentFragment();

            templateContent.querySelector(".id").innerText = value.id;
            templateContent.querySelector(".name").innerText = value.name;
            templateContent.querySelector(".date").innerText = value.date;

            templateContent.querySelector("[value='Delete']").addEventListener("click", onDelete);
            templateContent.querySelector("[value='Edit']").addEventListener("click", onEdit);

            fragment.appendChild(templateContent);
            tableBody.appendChild(fragment);
        });
    },
        filter);
}
updateTable("/getData");

addInputBar.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputBar = addInputBar.querySelector("input")
    const inputValue = inputBar.value;
    inputBar.value = "";

    ajaxPOST("/add", inputValue, function () {
        updateTable("/getData");
    });
});

searchBar.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputBar = searchBar.querySelector("input")

    updateTable("/getData", inputBar.value);
})




