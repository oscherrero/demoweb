
const GAS_WEB_URL= "https://script.google.com/macros/s/AKfycbwFh4fhZPolS9zN0uGwCouteG9PcSjLkJqRdyABj3XZ-6A5b5LEic9QIb_BebPoUBXnPA/exec"   
const IMG_ESPERA_URL="/demoweb/SimboloEspera.gif"
const GAS_CHISTES_URL="https://script.google.com/macros/s/AKfycbxtGofgvSOkwx7T7pwzHrzXA59swnf8DAY_2xNrySYdDFaHTds_8jOVtX1HS1tiEcoM/exec"
const TEMAS=[ 
  [ "#f8f4ff", "pink", "#CC0000", "white"  ],  //  1ario, 2ario, acento, blanco
  [ "cyan", "cyan", "blue", "white"  ],
  [ "cyan", "cyan", "green", "white"  ],
]
let PATH=window.location.href 
if (PATH.endsWith("/")) {   PATH = PATH.slice(0, -1);}
const APP=PATH.substring(PATH.lastIndexOf("/")+1,99)
const NUMTEMAS=TEMAS.length

window.onload=init()

function init() {
  cargarValoresForm()
  aplicarTema()
  cargarHTML()
}

function cargarValoresForm(){
  let options =localStorage.getItem(APP+"options")
  document.getElementById("site").innerHTML = options
  //let stGranjaCod = localStorage.getItem(APP+"site") != null ? localStorage.getItem(APP+"site") : '{"site":"","cod":""}';
  let stGranjaCod = localStorage.getItem(APP+"site") || '{"site":"","cod":""}';
  let granjaCod = JSON.parse(stGranjaCod)
  document.getElementById("site").value = granjaCod.site
  document.getElementById("cod").value = granjaCod.cod
}
   
function recargarWeb (){  location.href = location.href + "?" + new Date().getTime();}

function info() {
  const anchoPantalla = window.innerWidth;
  const resPantalla = window.devicePixelRatio
  document.getElementById("nota").textContent = " width: " + anchoPantalla + ", res: " + resPantalla;
}

async function cargarHTML() {
   
  document.getElementById("elemento1").classList.remove("oculto");
  document.getElementById("logForm").classList.add("oculto");
  document.getElementById("elemento1").innerHTML = "<div class='imagenEspera'><img  src='" + IMG_ESPERA_URL + "'></div> <br><br>"
 
  try {
    
    const formData= new FormData(document.getElementById("logForm"))
    const granjaInput= document.getElementById("site").value
    const codInput= document.getElementById("cod").value

    const response = await fetch(GAS_WEB_URL, {
        method: 'POST',
        body: formData,
    })

  var resp = await response.json()
  localStorage.setItem(APP+"options", resp.optionsHtml)
  cargarValoresForm()

  if (resp.html == "NoAuth" ) {
      document.getElementById("elemento1").innerHTML = "<div style='color:red; text-align:center;'><br> INDICA UNA GRANJA Y CLAVE VALIDOS <br></div>"
      document.getElementById("tituloSite").innerHTML = "DEMO API INSIGHT";
      document.getElementById("cod").value =""
      document.getElementById("logForm").classList.remove("oculto");
    } else   if ( resp.html == "") {
      document.getElementById("tituloSite").innerHTML = "DEMO API INSIGHT";
      document.getElementById("cod").value =""
      verLogForm()
    } else {     
      document.getElementById("elemento1").innerHTML = resp.html
      document.getElementById("tituloSite").innerHTML =  granjaInput.toUpperCase() 
      document.getElementById("logForm").classList.add("oculto");
    
      var valor = JSON.stringify({ site: granjaInput, cod: codInput })
      localStorage.setItem(APP+'site', valor);
      localStorage.setItem(APP+"options",resp.optionsHtml)
    }
  } catch (error) {
    document.getElementById("elemento1").innerHTML = "<div style='color:red; text-align:center;'><br> FALLO EN LA CONSULTA DE DATOS </div>"
    document.getElementById("elemento1").innerHTML = error
    document.getElementById("tituloSite").innerHTML = "DEMO API INSIGHT";

  }  
}

function verLogForm(){
  document.getElementById("logForm").classList.remove("oculto");
  document.getElementById("elemento1").classList.add("oculto");
}

async function chiste(){ 

  document.getElementById("logForm").classList.add("oculto");
  const elem1 = document.getElementById("elemento1") 
  const elemTitulo=document.getElementById("tituloSite")

  elem1.classList.remove("oculto");
  elem1.innerHTML = "<div class='imagenEspera'><img  src='" + IMG_ESPERA_URL + "'></div> <br><br>"

  fetch(GAS_CHISTES_URL)
    .then (response=>{ return response.text()})
    .then (data=>{
      elem1.innerHTML= "<div class='marco chiste'>" + data + "</div>";
      elemTitulo.innerHTML="CHISTE MALO";
  })
}

function acercade(){ 
  const elem1 = document.getElementById("elemento1") 
  elem1.innerHTML = "<div class='marco'><h3>Demo conexión datos AVEVA INSIGHT</h3><p>Realizada por OscarHR con Google Apps Script.</p><p>04/01/2025</p></div> <br><br>"
  elem1.innerHTML += "<div> Ancho: "+ window.innerWidth +"</div>"
  elem1.innerHTML += "<div> Alto: "+ window.innerHeight; +"</div>"
  elem1.innerHTML += "<div> Resolucion: "+ window.devicePixelRatio  +"</div>"
  elem1.innerHTML += "<div> Orientacion: "+ screen.orientation.type  +"</div>"
}

function aplicarTema(incrementar) { 
  var tema=parseInt(localStorage.getItem(APP+"tema"))||0;
  if (incrementar) {
    tema=tema+1
  }
  tema = tema < TEMAS.length && tema>=0  ? tema:0;
  localStorage.setItem(APP+"tema",tema);
  const root = document.documentElement;
  root.style.setProperty('--color-primario', TEMAS[tema][0]);
  root.style.setProperty('--color-secundario', TEMAS[tema][1]);
  root.style.setProperty('--color-acento',TEMAS[tema][2]);
}

const menuButton = document.querySelector('.menu-burger');
const menu = document.querySelector('nav');
function closeMenu(){ document.querySelector('nav').classList.remove('active')     }

menuButton.addEventListener('click', () => {
  menu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('nav') && !event.target.closest('.menu-burger')) {
    menu.classList.remove('active');
  };
});

