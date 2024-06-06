
// model delete 

// open modal delete
document.addEventListener('DOMContentLoaded', function() {
    const deleteModalButtons = document.querySelectorAll('.delete-modal-btn');

    deleteModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const model = document.getElementById(target)
            model.classList.remove('hidden')
        });
    });

});

// fermer modal delete 
document.addEventListener('DOMContentLoaded', function() {
    const closedeleteModalButtons = document.querySelectorAll('.btn-close-delete');

    closedeleteModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const model = document.getElementById(target)
            model.classList.add('hidden')
        });
    });

});


const  btnAdd = document.getElementById("btn-add-item").addEventListener("click" , ()=>{
    const modelAdd = document.getElementById("modalAjouter")

    modelAdd.classList.remove('hidden')
})



// formulaire add voiture 

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAddVehicule');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Créer un objet FormData avec les données du formulaire
        const formData = new FormData(form);

        // // Envoyer les données via AJAX
        // fetch(form.action, {
        //     method: form.method,
        //     body: formData
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }
        //     return response.json(); // Vous pouvez utiliser .text(), .blob(), etc., selon la réponse
        // })
        // .then(data => {
        //     // Traiter la réponse si nécessaire
        //     console.log(data);

        //     // Masquer le modal ici si besoin est
        //     const modal = document.getElementById('modalAjouter');
        //     modal.classList.add('hidden');
        // })
        // .catch(error => {
        //     console.error('There was a problem with your fetch operation:', error);
        //     // Gérer les erreurs ici
        // });
    });
});

//end model delete