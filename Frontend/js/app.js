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
    empty_data();
});

close_modal.addEventListener('click', (e)=>{
    e.preventDefault();
    empty_data()
    modal.setAttribute('class', 'modale');
});

// btn_save.addEventListener('click', (e)=>{
//     e.preventDefault();
//     modal.setAttribute('class', 'modale');
// })

window.onload = ()=>{
    get_all_clients();
};

//other functions
const edit_client = (id)=>{
    selected_client = clients.find(element => element.id == id)
    modal.setAttribute('class', 'modale opened');
    modal_title.innerHTML="Actualizar Usuario";

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
        create_client();
    }else{
        update_client();
    }
}

const format_errors = (errors)=>{
    let template = '<ul>';
    errors.forEach(element => {
        template+= (element != '') ? '<li>'+element+'</li>' : ''; 
    })
    template += '</ul>';
    return template
}

//backend functions
const create_client = async () => {
    try {
        const resp = await fetch('http://127.0.0.1:3000/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.querySelector("[name='name']").value,
                last_name: document.querySelector("[name='lastName']").value,
                email: document.querySelector("[name='mail']").value,
                cellphone: document.querySelector("[name='cellphone']").value,
            })
        });
        const data = await resp.json()
        if(resp.status == 406){
            Swal.fire({
                title: data.message,
                html: format_errors(data.errors),
                icon: "error",
            });
        }else{
            modal.setAttribute('class', 'modale');
            Swal.fire({
                title: data.message,
                icon: "success",
            });
            get_all_clients();            
        }
    } catch (error) {
        console.error(error);
    }
}

const get_all_clients = async () => {
    let template = '';
    try {
        const resp = await fetch('http://127.0.0.1:3000/customers');
        const {data} = await resp.json();
        clients = data;
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
    } catch (error) {
        console.error(error);
    } finally{
        table_body.innerHTML = (template != '') ? template : '<tr><td colspan="5">No hay clientes registrados</td></tr>';
    }
}

const update_client = async () => {
    try {
        const resp = await fetch('http://127.0.0.1:3000/customers/'+selected_client.id, {
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
        });
        const data = await resp.json()
        if(resp.status == 406){
            Swal.fire({
                title: data.message,
                html: format_errors(data.errors),
                icon: "error",
            });
        }else{
            modal.setAttribute('class', 'modale');
            Swal.fire({
                title: data.message,
                icon: "success",
            });
            get_all_clients();            
        }
    } catch (error) {
        console.error(error);
    }
}

const remove_client = async (id) => {
    let client = clients.find(element => element.id == id)
    const result = await Swal.fire({
        icon: 'question',
        title: "Quieres eliminar a "+ client.name +' '+ client.last_name+'?',
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: "Cancelar"
    })
    if(!result.isConfirmed) return
    try {
        const resp = await fetch('http://127.0.0.1:3000/customers/'+id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.querySelector("[name='name']").value,
                last_name: document.querySelector("[name='lastName']").value,
                email: document.querySelector("[name='mail']").value,
                cellphone: document.querySelector("[name='cellphone']").value,
            })
        });
        const data = await resp.json()
        Swal.fire({
            title: data.message,
            icon: "success",
        });
        get_all_clients();
    } catch (error) {
        console.error(error);
    }
}