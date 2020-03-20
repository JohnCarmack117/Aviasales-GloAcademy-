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

let city = [];

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
        else {
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
};

const renderCheapDay = (cheapTicket) => {
    console.log('cheapTicketDay: ', cheapTicket);    
};

const renderCheapYear = (cheapTickets) => {
    cheapTickets.sort((a, b) => {
        return a.value - b.value;   
    });
    console.log('cheapTicketYear: ', cheapTickets);
};

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;

    // console.log('cheapTicketYear: ', cheapTicketYear);

    const cheapTicketDay = cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    })

    // console.log('cheapTicketDay: ', cheapTicketDay);

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);
};


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

// Событие основной формы
formSearch.addEventListener('submit', (event) => {
    // Позволяет при нажатии на кнопку не перезагружать страницу
    event.preventDefault();

    // Находим город внутри массива city и возвращаем объект
    const cityFrom = city.find((item) => {
        return inputCitiesFrom.value === item.name;
    });

    // Находим город внутри массива city и возвращаем объект
    const cityTo = city.find((item) => {
        return inputCitiesTo.value === item.name;
    });

    // Вывод данных по городам Откуда - Куда - Когда
    const formData = {
        from: cityFrom.code,
        to: cityTo.code,
        when: inputDateDepart.value,
    }; 

    // console.log(formData);

    // Формируем часть адресной строки как в документации API (вариант современный)
    const requestData = `?depart_date=${formData.when}&origin=${formData.from}` + 
        `&destination=${formData.to}&one_way=true&token=` + API_KEY;

    // Формируем часть адресной строки как в документации API (вариант устаревший)
    // const requestData2 = '?depart_date=' + formData.when +
    //     '&origin=' + formData.from +
    //     '&destination=' + formData.to +
    //     '&one_way=true&token=' + API_KEY;
    
    // console.log(requestData);

    // Запрос по адресу и добавляем requestData - возвращается ответ в response
    getData(calendar + requestData, (response) => {
        // console.log(response);
        renderCheap(response, formData.when);
    });

});


// Вызовы функций

// Функция получить данные по городам
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    console.log(city);
});

/*

    (item) => {
        return item.name
    }

*/
