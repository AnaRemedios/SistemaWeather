document.getElementById('dataForm').addEventListener('submit', function(event){
    event.preventDefault(); // Evita o envio do formulário
    handleFormSubmit();
});

async function fetchCepData(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Erro: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao buscar dados do CEP:', error);
    }
}

async function fetchWeatherData(latitude, longitude) {
    try {
        const response = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
        if (response.status === 200) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Erro: ${response.status}`);
        }
    } catch (error) {
        console.error('Erro ao buscar dados da previsão do tempo:', error);
    }
}

function handleFormSubmit() {
    const cep = document.getElementById('cep').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    if (cep) {
        fetchCepData(cep).then(data => {
            if (data) {
                document.getElementById('cep-result').innerHTML = `
                    <li>${data.logradouro}</li>
                    <li>${data.bairro}</li>
                    <li>${data.localidade}/${data.uf}</li>
                `;
            } else {
                document.getElementById('cep-result').innerHTML = `<li>Dados não encontrados.</li>`;
            }
        });
    }

    if (latitude && longitude) {
        fetchWeatherData(latitude, longitude).then(data => {
            if (data) {
                const temp = data.current_weather.temperature;
                const condition = data.current_weather.weathercode; //  talvez precise de uma tradução
                const humidity = data.hourly.humidity_2m[0]; // Assume a primeira entrada
                const windSpeed = data.current_weather.windspeed;
                document.getElementById('weather-result').innerHTML = `
                    <h1><strong>Temperatura:</strong> ${temp} °C</h1>
                    <h1><strong>Condição:</strong> ${condition}</h1>
                    <h1><strong>Umidade:</strong> ${humidity}%</h1>
                    <h1><strong>Vento:</strong> ${windSpeed} m/s</h1>
                `;
                document.getElementById('regiao').textContent = `Previsão de tempo de acordo com a região: ${temp} °C`;
            } else {
                document.getElementById('weather-result').innerHTML = `<h1>Dados não encontrados.</h1>`;
            }
        });
    }
}

// scroll

const menuLinks = document.querySelectorAll('#menu a[href^="#"]'); // seletor de atributo
const botaoAcessar = document.querySelectorAll('#cta a[href^="#"]');

function getDistanceFromTheTop(element) {
    const id = element.getAttribute("href");
    return document.querySelector(id).offsetTop;
}

// function nativeScroll(distanceFromTheTop) {
//   window.scroll({
//     top: distanceFromTheTop,
//     behavior: "smooth",
//   });
// }

function scrollToSection(event){
    event.preventDefault();
    const distanceFromTheTop = getDistanceFromTheTop(event.target) - 90;
    smoothScrollTo(0, distanceFromTheTop);
    // const element = event.target;
    // const id = element.getAtribute("href");
    // const section = document.querySelector(id);
    // console.log(section.offsetTop);
}

menuLinks.forEach((link) => {
    link.addEventListener("click", scrollToSection);
})

botaoAcessar.forEach((link) => {
    link.addEventListener("click", scrollToSection);
})

function smoothScrollTo(endX, endY, duration) {
    const startX = window.scrollX || window.pageXOffset;
    const startY = window.scrollY || window.pageYOffset;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const startTime = new Date().getTime();
  
    duration = typeof duration !== "undefined" ? duration : 400;
  
    const easeInOutQuart = (time, from, distance, duration) => {
      if ((time /= duration / 2) < 1)
        return (distance / 2) * time * time * time * time + from;
      return (-distance / 2) * ((time -= 2) * time * time * time - 2) + from;
    };
  
    const timer = setInterval(() => {
      const time = new Date().getTime() - startTime;
      const newX = easeInOutQuart(time, startX, distanceX, duration);
      const newY = easeInOutQuart(time, startY, distanceY, duration);
      if (time >= duration) {
        clearInterval(timer);
      }
      window.scroll(newX, newY);
    }, 1000 / 60);
  }

