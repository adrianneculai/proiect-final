var pokemon = [];
var indexEdit = -1;

async function ajaxPromise(url, method, body) {
    return new Promise(function (resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    resolve(this.responseText);
                } else {
                    reject(this);
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.send(body);
    });
}

async function getObj(param) {
    var responseText = await ajaxPromise("https://proiect-final-df239.firebaseio.com/.json", "GET")
    window.pokemon = JSON.parse(responseText)
    if (param == "main") {
        draw()
    } else if (param === "table") {
        drawTable()
    }
}




function draw() {
    var content = ""

    for (var i in pokemon) {
        content += `
        <div class="produseWrap">
        <div class="produse">
            <img src="${pokemon[i].scr}}" alt="">
            <h3>${pokemon[i].name} <br>
            </h3>
            <h3>${pokemon[i].price} $</h3>
            <button onclick="adaugaInCos('${i}')">Cumpara</button>
            <button>Detalii</button>
        </div>
    </div>
                `
    }
    document.querySelector(".content").innerHTML = content
    document.querySelector(".loader").classList.add("hidden")
}

const myForm = document.querySelector("#myForm")

// myForm.addEventListener("submit", (e) => {
//     e.preventDefault()
//     console.log("am trimis formularul")
// })

function drawTable() {
    var createRows = ''
    for (var i in pokemon) {
        createRows +=
            `<tr>
                          
                <td class="tableData">${pokemon[i].name}</td>
                <td  class="tableimg">   <img src= "${pokemon[i].scr}"> </td>
                <td class="tableData">${pokemon[i].price}</td>
                <td align="right">
                <div  id="${i}" class="editButton" onclick="edit('${i}')">  </div>
                <div  id="${i}" class="deleteButton" onclick="del('${i}')">  </div>
                </td>
            </tr>`
    }
    document.querySelector("table tbody").innerHTML = createRows
    document.querySelector(".loader").classList.add("hidden")
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function edit(idx) {
    showForm()
    topFunction()
    var form = document.querySelector("#myForm");
    form.querySelector("[name=\"numePokemon\"]").value = pokemon[idx].name;
    form.querySelector("[name=\"srcPokemon\"]").value = pokemon[idx].scr;
    form.querySelector("[name=\"cost\"]").value = pokemon[idx].price;
    indexEdit = idx;
}

function showForm() {
    document.querySelector(".adaugaBtn").classList.add("hidden")
    document.querySelector("#myForm").classList.remove("hidden");
    document.querySelector("#myForm").reset();
    indexEdit = -1;
}

function hideForm() {
    document.querySelector("#myForm").classList.add("hidden");
    document.querySelector(".adaugaBtn").classList.remove("hidden")
}

async function add(event, form) {
    event.preventDefault();
    var obj = {
        name: form.querySelector("[name=\"numePokemon\"]").value,
        scr: form.querySelector("[name=\"srcPokemon\"]").value,
        price: form.querySelector("[name=\"cost\"]").value
    };

    if (indexEdit === -1) {
        await ajaxPromise("https://proiect-final-df239.firebaseio.com/.json", "POST", JSON.stringify(obj))
    } else {
        await ajaxPromise(
            `https://proiect-final-df239.firebaseio.com/${indexEdit}.json`, "PUT", JSON.stringify(obj));
    }
    getObj("table")
    hideForm()
    form.reset()
}

async function del(idx) {
    if (confirm(`Are you sure you want to delete ${pokemon[idx].name} ?`)) {
        await ajaxPromise(`https://proiect-final-df239.firebaseio.com/${idx}.json`, "DELETE");
        getObj("table")
    }
}



////cosul de cumparaturi buton add

function numarProduse() {

    pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    var numar = 0
    for (var i = 0; i < pokeCart.length; i++) {
        numar += pokeCart[i].cantitate
    }
    return numar
}



function adaugaInCos(idx) {

    if (localStorage.getItem("pokemon") === null) {
        pokeCart = []
    } else {
        pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    }


    document.querySelector("#cos").classList.remove("ascunde")
    document.querySelector("#cos").innerHTML = `(${numarProduse()})`

    var gasit = false;
    for (var i = 0; i < pokeCart.length; i++) {
        if (pokeCart[i].name == pokemon[idx].name) {
            gasit = true;
            // pokeCart[i].name += "x2"
            pokeCart[i].cantitate++
        }
    }
    if (!gasit) {
        pokeCart.push(
            {
                name: pokemon[idx].name,
                price: pokemon[idx].price,
                cantitate: 1
            }
        )
    }
    localStorage.setItem("pokemon", JSON.stringify(pokeCart))
}


if (localStorage.getItem("pokemon") !== null) {

    pokeCart = JSON.parse(localStorage.getItem("pokemon"))

    document.querySelector("#cos").classList.remove("ascunde")
    document.querySelector("#cos").innerHTML = `(${numarProduse()})`
}

function drawCos() {

    if (localStorage.getItem("pokemon") === null) {
        localStorage.setItem("pokemon", "[]")
    }


    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    console.log(pokeCart)
    var createRows = ''
    for (var i in pokeCart) {
        createRows +=
            `<tr>
                          
                <td class="tableData">${pokeCart[i].name} ${(pokeCart[i].cantitate > 1) ? "x" + pokeCart[i].cantitate : ""} </td>
                <td class="tableData">${pokeCart[i].price}</td>
                <td align="right">
                <div  id="${i}" class="editButton" onclick="editCart('${i}')">  </div>
                <div  id="${i}" class="deleteButton" onclick="delCart('${i}')">  </div>
                </td>
            </tr>`
    }
    document.querySelector("#tabelCos tbody").innerHTML = createRows
}

function delCart() {
    let pokeCart = JSON.parse(localStorage.getItem("pokemon"))
    

}