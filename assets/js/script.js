//se declara la variable grafico vacia
let grafico ;

//funcion que nos trae las monedas y las guarda 
async function getMonedas() {
  try {
    const endpoint = "https://mindicador.cl/api"; 
    const res = await fetch(endpoint); //con el fetch nosotros obtenemos datos
    const data = await res.json(); //formatea la respuesta en la variable data como tipo json
  return Object.values(data).slice(3); // devuelve un objeto con la respuesta quitando los tres primeros valores
  } catch (error) {
    console.error("Error al obtener monedas:", error);
}
}

async function BuscarMoneda() {
  const selector = document.getElementById('monedaDestino');
  const codigoMoneda = selector.value;
  const endpoint = `https://mindicador.cl/api/${codigoMoneda}`; 
  try {
  //verifica si el grafico existe , si existe lo borra
    if(grafico){
      grafico.destroy()
      } 
    const res = await fetch(endpoint);
    const datosMoneda = await res.json();
    const valorMoneda = datosMoneda.serie[0].valor;

    console.log(valorMoneda)

    const config = prepararConfiguracionParaLaGrafica(datosMoneda);
    const chartDOM = document.getElementById("myChart");
    grafico = new Chart(chartDOM, config);
    const valorIngresado = Number(document.getElementById('cantidad').value);
    const resultado =  Number(valorMoneda * valorIngresado);
    console.log("resultado : " ,resultado);

    document.getElementById("resultado").innerHTML = resultado;
  } catch (error) {
    console.error("Error al obtener datos de la moneda:", error);
  }
};

//esta funcion setea las variables que construyen la grafica
function prepararConfiguracionParaLaGrafica(datosMoneda) {
  const tipoDeGrafica = "line";
  const titulo = datosMoneda.nombre;
  const colorDeLinea = "red";    
  const fechas = datosMoneda.serie.map(serie => serie.fecha).reverse(); 
  
  const valores = datosMoneda.serie.map(serie => serie.valor).reverse();

    const config = {
        type: tipoDeGrafica, 
        data: {
            labels: fechas,
            datasets: [{
                label: titulo,
                backgroundColor: colorDeLinea,
                borderColor: colorDeLinea,
                data: valores,
            }]
        },
    };
    return config;
}


async function renderGrafica() {
  const monedas = await getMonedas();

  llenarSelectorDeMonedas(monedas); // Llenar el selector con las monedas
  const config = prepararConfiguracionParaLaGrafica(monedas);
  const chartDOM = document.getElementById("myChart");
    new Chart(chartDOM, config);
}

renderGrafica();

async function llenarSelectorDeMonedas(monedas) {
  const selector = document.getElementById('monedaDestino');
  await monedas.forEach(moneda => {
    let option = document.createElement('option'); 
    option.value = moneda.codigo;
    option.text = moneda.nombre;
                               
    selector.appendChild(option);
    });
}

document.getElementById('convertirBtn').addEventListener('click', convertir); 

function convertir(){
}

document.getElementById('convertirBtn').addEventListener('click', BuscarMoneda );