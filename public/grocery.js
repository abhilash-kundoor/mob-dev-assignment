import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

const $$ = Dom7;
var idList = [];

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("books/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
        $$("#groceryList").html("");
        var sCard = "";
        for(let n = 0; n < aKeys.length; n++){
            sCard = ""
            if ( oItems[aKeys[n]].imageUrl != ""){
                sCard += `<div class="card" id="${aKeys[n]}">`
                sCard += `<img class="image" src="${oItems[aKeys[n]].imageUrl}">`;
            }
            else{
                sCard += `<div class="card" id="${aKeys[n]}">`
            }
            if (oItems[aKeys[n]].datePurchased != ""){
            sCard += `
            <div class="card-content card-content-padding">Author : ${oItems[aKeys[n]].author}</div>
            <div class="card-content card-content-padding">Genre : ${oItems[aKeys[n]].genre}</div>
            <div class="card-content card-content-padding">Published : ${oItems[aKeys[n]].published}</div>
            <div class="card-content card-content-padding">Title : ${oItems[aKeys[n]].title}</div>
            <div class="card-content card-content-padding">Date Purchased : ${oItems[aKeys[n]].datePurchased}</div>
            </div>
            <a class="button button-fill bought" style="text-decoration:none" id="bought" key="?${aKeys[n]}">I bought this</a>
            <a class="button button-fill notBought" style="text-decoration:none" id="notBought" key="?${aKeys[n]}">I don't need this</a>
            `
            }
            else {
            sCard += `
            <div class="card-content card-content-padding">Author : ${oItems[aKeys[n]].author}</div>
            <div class="card-content card-content-padding">Genre : ${oItems[aKeys[n]].genre}</div>
            <div class="card-content card-content-padding">Published : ${oItems[aKeys[n]].published}</div>
            <div class="card-content card-content-padding">Title : ${oItems[aKeys[n]].title}</div>
            </div>
            <a class="button button-fill bought" style="text-decoration:none" id="bought" key="?${aKeys[n]}">I bought this</a>
            <a class="button button-fill notBought" style="text-decoration:none" id="notBought" key="?${aKeys[n]}">I don't need this</a>
            `
            }
            $$("#groceryList").append(sCard);
        }
    });

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("books/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});


$$(document).on('click', '.bought', e => {
    //e.preventDefault();
    const key = e.target.attributes.getNamedItem("key").value
    var id = key.split("?")[1];
    const sUser = firebase.auth().currentUser.uid;
    var param = sUser + "/" + id ;
    var sHtml = "";
    
    // firebase.database().ref('books/' + param).on("value", (snapshot) => {
    //     var items = snapshot.val();
    // });
    var items;
    firebase.database().ref('/books/' + param).on("value", (snapshot) => {
         items = snapshot.val();
     });
    if (items.datePurchased != ""){
        idList.push(id);
        // if ( items.imageUrl != ""){
        //     sHtml += `<img class="image" src="${items.imageUrl}">`;
        // }
        // sHtml += `<div class="card-content card-content-padding"><strike>Author : ${items.author}</strike></div>
        // <div class="card-content card-content-padding"><strike>Genre : ${items.genre}</strike></div>
        // <div class="card-content card-content-padding"><strike>Published : ${items.published}</strike></div>
        // <div class="card-content card-content-padding"><strike>Title : ${items.title}</strike></div>
        // <div class="card-content card-content-padding"><strike>Title : ${items.datePurchased}</strike></div>
        // <div class="card-content card-content-padding">
        // <a class="button button-fill bought" id="bought" key="?${id}">I bought this</a>
        // <a class="button button-fill notBought" id="notBought" key="?${id}">I don't need this</a>
        // <div>`
        // document.getElementById(id).innerHTML = sHtml;
        for (id of idList)
        {
            document.getElementById(id).setAttribute("class", "strike");
        }
        
    }
    else {
        firebase.database().ref('books/' + param).update({
            datePurchased : new Date().toLocaleDateString("en-US")
        });
    }
    app.sheet.close(".my-sheet", true);
})

$$(document).on('click', '.notBought', e => {
    e.preventDefault();
    const key = e.target.attributes.getNamedItem("key").value
    var id = key.split("?")[1];
    const sUser = firebase.auth().currentUser.uid;
    var param = sUser + "/" + id ;
    firebase.database().ref('books/' + sUser + '/').child(id).remove();
    app.sheet.close(".my-sheet", true);
})