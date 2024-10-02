function updatemenu() {
    if (document.getElementById('responsive-menu').checked == true) {
        document.getElementById('menu').style.borderBottomRightRadius = '0';
        document.getElementById('menu').style.borderBottomLeftRadius = '0';
    }else{
        document.getElementById('menu').style.borderRadius = '10px';
    }
}

//gloabal values
let clients = [];
let selected_client = {};

//DOM objects
let btn_add = document.querySelector('#add-client');
let modal = document.querySelector('.modale');
let close_modal = document.querySelector('.closemodale');
let btn_save = document.querySelector('#btn_save');
let table_body = document.querySelector('#customers tbody');

//modal title
let modal_title = document.querySelector("#modal_title");

//functions
btn_add.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.setAttribute('class', 'modale opened');
    modal_title.innerHTML="Agregar Usuario";
});

close_modal.addEventListener('click', (e)=>{
    e.preventDefault();
    empty_data()
    modal.setAttribute('class', 'modale');
});

btn_save.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.setAttribute('class', 'modale');
})

window.onload = ()=>{
    get_all_clients();
};

//other functions
const edit_client = (id)=>{
    selected_client = clients.find(element => element.id == id)
    modal.setAttribute('class', 'modale opened');

    document.querySelector("[name='name']").value = selected_client.name;
    document.querySelector("[name='lastName']").value = selected_client.last_name;
    document.querySelector("[name='mail']").value = selected_client.email;
    document.querySelector("[name='cellphone']").value = selected_client.cellphone;
}

const empty_data = ()=>{
    selected_client = []
    document.querySelector("[name='name']").value = '';
    document.querySelector("[name='lastName']").value = '';
    document.querySelector("[name='mail']").value = '';
    document.querySelector("[name='cellphone']").value = '';
}

const save_data = ()=>{
    if(Object.keys(selected_client).length === 0){
        console.log("Save")
    }else{
        update_client();
    }
}

//backend functions
const get_all_clients = ()=>{
    fetch('http://127.0.0.1:3000/customers')
    .then(resp => resp.json())
    .then(data =>{
        clients = data;
        let template = '';
        if(data.length > 0){
            data.forEach(element => {
                template += '<tr>'
                template += '<td>'+element.name+'</td>'
                template += '<td>'+element.last_name+'</td>'
                template += '<td>'+element.email+'</td>'
                template += '<td>'+element.cellphone+'</td>'
                template += '<td>';
                template += '    <button class="btn-edit" onclick="edit_client('+element.id+')">Editar</button>';
                template += '    <button class="btn-delete" onclick="remove_client('+element.id+')">Eliminar</button>';
                template += '</td>';
                template += '</tr>';
            });
        }else{
            template = '<tr><td colspan="5">No hay clientes registrados</td></tr>'
        }
        table_body.innerHTML = template;
    })
    .catch(error => console.error(error))
}

const update_client = ()=>{
    fetch('http://127.0.0.1:3000/customers/'+selected_client.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: document.querySelector("[name='name']").value,
            last_name: document.querySelector("[name='lastName']").value,
            email: document.querySelector("[name='mail']").value,
            cellphone: document.querySelector("[name='cellphone']").value,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

