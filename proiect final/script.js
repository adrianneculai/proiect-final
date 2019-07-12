var pokemon = [];
var indexEdit = -1;


window.addEventListener("load", () => {
    const loader = document.querySelector(".loader")
    loader.className += " hidden"
})

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
    pokemon = JSON.parse(responseText)
    console.log(pokemon)
    console.log("proba")
    if (param == "main") {
        draw()
    } else if (param === "table") {
        drawTable()
    }
}
getObj("main")
getObj("table")



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
            <button>Cumpara</button>
            <button>Detalii</button>
        </div>
    </div>
                `
    }
    document.querySelector(".content").innerHTML = content
    console.log("aici se afla string literalul meu", content)
}

const myForm = document.querySelector("#myForm")

myForm.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log("am trimis formularul")

})



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


    console.log("merge tabelul")
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

function edit(idx) {

    console.log("ai apasat")
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
