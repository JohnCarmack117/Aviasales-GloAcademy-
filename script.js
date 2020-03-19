// Получение элементов со страницы html
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');

// Данные  
const citiesApi = 'dataBase/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'c23e45ad6c8f822da2516b2dccd57a7e',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';
    //Екатеринбург - Калининград 25 мая


let city = [];
// let ticket = [{
//     "origin": "EKB",
//     "destination": "KGD",
//     "depart_date": "2020-25-05",
//     "one_way": true,
// }];
// let ticket = [`origin=SVX&destination=KGD&depart_date=2020-05-25&one_way=true`];

// Функции

// Стрелочная функция для получения базы данных через XML
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        }
        else if (request.status === 400) {
            callback(request.response); 
        } else {
            console.error(request.status);
        }

    });

    request.send();
}; 



// Стрелочная функция для выбора поля ввода 
const showCity = (input, list) => {
    list.textContent = '';

    // Условие, чтобы исчезал список выбора городов при отсутствии символов в input-e
    if (input.value !== '') {
        const filterCity = city.filter((item) => {
            const fixItem = item.name.toLowerCase();  // каждая строчка приводится к нижнему регистру
            return fixItem.includes(input.value.toLowerCase());
        });

        // Осуществляется перебор городов из списка
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
    }

};

// Стрелочная функция для выбора города по параметрам
const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') { // каждая строчка приводится к нижнему регистру
        input.value = target.textContent; 
        list.textContent = '';       
    }
}


// Обработчики событий

// События для появления списка городов при наборе
inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo);
});

// События выбора по клику ЛКМ на город из списка
dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);    
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});


// Вызовы функций

// Функция получить данные по городам
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    console.log(JSON.parse(data));
});

// getData(calendar + ticket, (current_depart_date_prices) => {
//     // ticket = JSON.stringify(current_depart_date_prices).includes((item) => {
//     //     return item.origin;
//     // });
//     console.log(ticket);
// })

/*

    (item) => {
        return item.name
    }

*/