   //variable
const taskBtn=document.querySelector("#taskBtn")
const taskForm=document.querySelector("#taskForm")
const TacheAll=document.querySelector("#TacheAll")
const tacheFilter=document.querySelector("#tacheFilter")
const inputs = document.querySelectorAll("input[type=text]");
const taskBody=document.querySelector("#taskBody")
// const btnDel = document.getElementById("btnDel");
const remove=document.querySelector("#remove")
const inputsChecked=document.querySelectorAll("input[type=checkbox]:checked");

   // Récupérer le bouton et le body
    const toggleButton = document.getElementById("toggleButton");
    const taskTable = document.getElementById("taskTable");
    const body = document.body;

    //le Dark/Light Mode
    toggleButton.addEventListener("click", () => {
    //   // Basculer entre les classes
      body.classList.toggle("bg-blue-900");
      body.classList.toggle("bg-white");

      taskTable.classList.toggle("bg-blue-900");
      taskTable.classList.toggle("bg-white");
      
    //   if (this.checked) {
    //     HTMLElement.classList.add("dark");
    //   }else{
    //     HTMLElement.classList.remove("dark");
    //   }
    });

    // var taches=[
    //     {
    //         id: 1,
    //         nom: "UML",
    //     },
    //     {
    //         id: 2,
    //         nom: "Php",
    //     },
    //     {
    //         id: 3,
    //         nom: "Design",
    //     },
    //     {
    //         id: 4,
    //         nom: "Maths",
    //     },
    //     {
    //         id: 5,
    //         nom: "Js",
    //     }
    // ]

    //stocher les taches dans le localStorage
    if (!localStorage.getItem(taches)) {
        localStorage.setItem("taches",JSON.stringify([
            {
                id: 1,
                nom: "UML",
            },
            {
                id: 2,
                nom: "Php",
            },
            {
                id: 3,
                nom: "Design",
            },
            {
                id: 4,
                nom: "Maths",
            },
            {
                id: 5,
                nom: "Js",
            }
    ])) 
    }

var taches = getTaches()

init();


//generer des Tr
function generateTr(tache) {

    return `
    <tr class="border dark:bg-blue-950 dark:text-white ">
        <td scope="row" class="px-2 py-2 text-center ">
            <input class=" " data-id="${tache.id}" onclick="taskDone(this)"  type="checkbox">      
        </td>
        <td class="px-2 py-2 text-center ">${tache.nom}</td>
        <td class="px-2 py-2 text-center ">
            <span  style="cursor:pointer" id="" onclick="editTache(this)" class="material-symbols-outlined">
                edit
            </span>
            <span id="" onclick="RemoveTache(this)" style="color: red; cursor:pointer" class="material-symbols-outlined">
                delete
            </span>
        </td>
    </tr>
    `
}

//generer le contenu tache
function generateTBody(taches){
    let html=""
    for (const tache of taches) {
    html+=generateTr(tache)
 }
    return html
 }

//Evenement de fitre
 tacheFilter.addEventListener("input",()=>{
    const tach =findTachesBySearch(tacheFilter.value)
    taskBody.innerHTML = generateTBody(tach);
})


//fonction de filtre tache par nom
function findTachesBySearch(saisi) {
    if (saisi!="") {
        return taches.filter(function (t) {
        return t.nom.toUpperCase().includes(saisi.toUpperCase()) == true
    })
    }
    return []
}

function init() {
    // alert("ok")
    // taches=getLocalStorage()
    //ajout des tr sur le tbody du tableau
    const taches=getTaches();
    taskBody.innerHTML = generateTBody(taches)
}

//mettre tache dns le localStorage
function getTaches(){
    return JSON.parse(localStorage.getItem("taches"))
}
//MaJ des taches qui sont dans le localStorage
function updateTaches(tab){
    localStorage.setItem("taches", JSON.stringify(tab))
}

//checker tous les tache
TacheAll.addEventListener("click",()=>{
    const inputsToCheck=document.querySelectorAll(".coche")
    if (checkbox.checked) {
        inputsToCheck.forEach(function(input) {
            input.checked=true
             taskDone(input)
            })
    } else {
        inputsToCheck.forEach(function(input) {
            input.checked=false
            taskDone(input)
            })
    }
})


//ajout Tache
taskForm.addEventListener("submit",function(e){
    e.preventDefault();
    let  newTache=Object.fromEntries(new FormData(taskForm)) 
   newTache["id"]=Math.floor(Math.random()*1000)
   const taches=getTaches();
   taches.push(newTache)
   updateTaches(taches)
   console.log(newTache);
   taskBody.innerHTML+=generateTr(newTache);    //ajouter la nouvelle tache dans taskBody
    document.getElementById("inputTache").value="";//vider champs du modal
    // document.getElementById("authentication-modal").classList.add("hidden");

//    init();
    //  taskForm.submit()
 })

 // Declaration fonction
 function taskDone(checkbox) {
     const all=document.querySelector("#TacheAll")
     const ligneCible = checkbox.parentElement.parentElement;
     if (checkbox.checked) {
       ligneCible.style.textDecoration = "line-through";
     } else {
       ligneCible.style.textDecoration = "none";
       all.checked=false
     }
   } 



   //fonction qui supprime une tache
   function RemoveTache(){
    const inputsChecked = Array.from(document.querySelectorAll('input[type=checkbox]:checked'))
    console.log(inputsChecked);
    // Demander confirmation à l'utilisateur
    const confirmation = confirm("Voulez-vous vraiment supprimer les tâches sélectionnées ?");
    if (confirmation) {
        // Supprimer les tâches sélectionnées
        taches = deleteTache(inputsChecked);
        updateTaches(taches);
        init(); // Recharger la liste des tâches
    } else {
        alert("Suppression annulée !");
    }
}

//Supprimer tache
function deleteTache(inputschecked) {
    const ids = inputschecked.map(function (input) {
        input.parentElement.parentElement.remove()
        return parseInt(input.dataset.id)
    })
    const updated = taches.filter(function (t) {
        return ids.indexOf(t.id) == -1
    })
    return updated
}

//fonction qui edite la tache
function editTache(span) {
    // Récupérer la cellule contenant le nom de la tâche
    const td = span.parentElement.previousElementSibling;
    const taskId = span.parentElement.parentElement.querySelector("input[type=checkbox]").dataset.id;
    
    // Sauvegarder le contenu actuel
    const currentName = td.textContent;

    // Remplacer le texte par un champ de saisie
    td.innerHTML = `<input type="text" class="edit-input" value="${currentName}" />`;

    // Sélectionner automatiquement le texte pour édition
    const input = td.querySelector("input");
    input.focus();
    input.select();

    // Événement pour valider les modifications
    input.addEventListener("blur", function () {
        // Récupérer la nouvelle valeur
        const newName = input.value.trim();

        if (newName === "") {
            alert("Le nom de la tâche ne peut pas être vide !");
            td.innerHTML = currentName; // Restaurer l'ancien texte si vide
        } else {
            td.textContent = newName; // Mettre à jour la cellule

            // Mettre à jour la liste des tâches et le localStorage
            const task = taches.find(t => t.id == taskId);
            if (task) {
                task.nom = newName;
                updateTaches(taches); // Met à jour le localStorage
            }
        }
    });

    // Permettre la validation avec la touche "Enter"
    input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            input.blur(); // Simuler la perte de focus
        }
    });
}


function getLocalStorage() {
        var storedTaches = localStorage.getItem('taches');
        if (storedTaches) {
            // taches = JSON.parse(storedTaches);
            tasks = getTaches(storedTaches);
        } else {
            // Utiliser les tâches par défaut si aucune tâche n'est stockée
            tasks = taches;
            // Sauvegarder les tâches initiales dans le localStorage
            // localStorage.setItem('taches', JSON.stringify(taches));
            updateTaches(tasks)
        }
        return tasks;
}
    






