function loadUsers() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5000/users");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            let trHTML = '';
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += `<td>${object.id}</td>`;
                trHTML += `<td><img width="50px" src="${object.product_name}"> </td>`;
                trHTML += `<td>${object.product_price}</td>`;
                trHTML += `<td>${object.product_cost}</td>`;
                trHTML += `<td>${object.product_image}</td>`;
                trHTML += `<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox(${object.id})"> Edit </button></td>`;
                trHTML += `<td><button type="button" class="btn btn-outline-danger" onclick="deleteUser(${object.id})"> Delete </button></td>`;
                trHTML += '</tr>';
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

loadUsers();

function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5000/users/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            const object = objects[0]; // Assume only one object is returned.

            Swal.fire({
                title: "Edit User",
                html: `
                    <input id="id" type="hidden" value="${object.id}">
                    <br>product_name: <input id="product_name" type="text" class="Swal2-input" value="${object.product_name}">
                    <br>product_price: <input id="product_price" type="text" class="Swal2-input" value="${object.product_price}">
                    <br>product_cost: <input id="product_cost" type="text" class="Swal2-input" value="${object.product_cost}">
                    <br>product_image: <input id="product_image" type="text" class="Swal2-input" value="${object.product_image}">
                    
                `,
                focusConfirm: false,
                preConfirm: () => { userEdit(); }
            });
        }
    };
}

function userEdit() {
    const id = document.getElementById("id").value;
    const product_name = document.getElementById("product_name").value;
    const product_price = document.getElementById("product_price").value;
    const product_cost = document.getElementById("product_cost").value;
    const product_image = document.getElementById("product_image").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:5000/users/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.send(JSON.stringify({
        "id": id,
        "product_name": product_name,
        "product_price": product_price,
        "product_cost": product_cost,
        "product_cost": product_cost,
        "product_image": product_image
      
    }));

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(objects.message);
            loadUsers();
        }
    };
}

// ✅ ฟังก์ชันลบผู้ใช้ (แยกจาก showUserEditBox)
function deleteUser(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", "http://localhost:5000/users/delete/" + id);
            xhttp.send();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const response = JSON.parse(this.responseText);
                    Swal.fire("Deleted!", response.message, "success");
                    loadUsers();
                }
            };
        }
    });
}
