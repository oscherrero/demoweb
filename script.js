
const webUrl= "https://script.google.com/macros/s/AKfycbyS5L58pIm7EUGNtslScWblYXTPTDKi1eu7f7CukD4rXPZZ4jBhZaQCKGIPA2Y-95HX/exec"   
const imgEsperaUrl="/demopp_2/SimboloEspera.gif"
const urlChiste="https://script.google.com/macros/s/AKfycbxtGofgvSOkwx7T7pwzHrzXA59swnf8DAY_2xNrySYdDFaHTds_8jOVtX1HS1tiEcoM/exec"
const temas=[ 
  [ "#f8f4ff", "pink", "#CC0000", "white"  ],  //  1ario, 2ario, acento, blanco
  [ "cyan", "cyan", "blue", "white"  ],
  [ "cyan", "cyan", "green", "white"  ],
]

window.onload=init()
    
function cargarListaGranjas(options){
  document.getElementById("granja").innerHTML = options
  var stGranjaCod = localStorage.getItem("granja") != null ? localStorage.getItem("granja") : '{"granja":"","cod":""}';
  var granjaCod = JSON.parse(stGranjaCod)
  document.getElementById("granja").value = granjaCod.granja
  document.getElementById("cod").value = granjaCod.cod
}
   
function init() {
  var options =localStorage.getItem("options")
  
  cargarListaGranjas(options)

  var tema=localStorage.getItem("tema")!=null?parseInt(localStorage.getItem("tema"))-1:10;
  localStorage.setItem("tema",tema)
  cambiarTema()
  cargarHTML()

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
  document.getElementById("elemento1").innerHTML = "<div class='imagenEspera'><img  src='" + imgEsperaUrl + "'></div> <br><br>"
 
  try {
    
    const formData= new FormData(document.getElementById("logForm"))
    const granjaInput= document.getElementById("granja").value
    const codInput= document.getElementById("cod").value

   url = webUrl + "?file=bloque";
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
    })

  var resp = await response.json()
  cargarListaGranjas(resp.optionsHtml)

  if (resp.html == "NoAuth" ) {
      document.getElementById("elemento1").innerHTML = "<div style='color:red; text-align:center;'><br> INDICA UNA GRANJA Y CLAVE VALIDOS <br></div>"
      document.getElementById("tituloGranja").innerHTML = "PREMIER PIGS";
      document.getElementById("cod").value =""
      document.getElementById("logForm").classList.remove("oculto");
    } else   if ( resp.html == "") {
      document.getElementById("tituloGranja").innerHTML = "PREMIER PIGS";
      document.getElementById("cod").value =""
      verLogForm()
    } else {     
      document.getElementById("elemento1").innerHTML = resp.html
      document.getElementById("tituloGranja").innerHTML =  granjaInput.toUpperCase() 
      document.getElementById("logForm").classList.add("oculto");
    
      var valor = JSON.stringify({ granja: granjaInput, cod: codInput })
      localStorage.setItem('granja', valor);
      localStorage.setItem("options",resp.optionsHtml)
    }
  } catch (error) {
    document.getElementById("elemento1").innerHTML = "<div style='color:red; text-align:center;'><br> FALLO EN LA CONSULTA DE DATOS </div>"
    document.getElementById("elemento1").innerHTML = error
    document.getElementById("tituloGranja").innerHTML = "PREMIER PIGS";

  }  
}

function recuperarListaGranjas(){
  var stGranjaCod = localStorage.getItem("granja") != null ? localStorage.getItem("granja") : '{"granja":"","cod":""}';
  var granjaCod = JSON.parse(stGranjaCod)
  document.getElementById("granja").value = granjaCod.granja
  document.getElementById("cod").value = granjaCod.cod
}

function verLogForm(){
  document.getElementById("logForm").classList.remove("oculto");
  document.getElementById("elemento1").classList.add("oculto");
}

async function chiste(){ 
  const elem1 = document.getElementById("elemento1") 
  const elemTitulo=document.getElementById("tituloGranja")

  elem1.classList.remove("oculto");
  elem1.innerHTML = "<div class='imagenEspera'><img  src='" + imgEsperaUrl + "'></div> <br><br>"

  fetch(urlChiste)
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

function cambiarTema() {
  var tema=localStorage.getItem("tema")!=null?parseInt(localStorage.getItem("tema")):10;
  tema = tema < (temas.length-1) ? tema+1:0;
  localStorage.setItem("tema",tema);
  const root = document.documentElement;
  root.style.setProperty('--color-primario', temas[tema][0]);
  root.style.setProperty('--color-secundario', temas[tema][1]);
  root.style.setProperty('--color-acento',temas[tema][2]);
}

const menuButton = document.querySelector('.menu-burger');
const menu = document.querySelector('nav');
menuButton.addEventListener('click', () => {
  menu.classList.toggle('active');
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('nav') && !event.target.closest('.menu-burger')) {
    menu.classList.remove('active');
  };
});
function closeMenu(){ document.querySelector('nav').classList.remove('active')     }


