// Получение элементов со страницы html
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

// Данные  
const citiesApi = 'dataBase/cities.json',
// const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'c23e45ad6c8f822da2516b2dccd57a7e',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 10;

let city = [];

// Функции

// Стрелочная функция для получения базы данных через XML
const getData = (url, callback, reject = console.error) => {
    
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        }
        else {
            reject(request.status);
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
            return fixItem.startsWith(input.value.toLowerCase());
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

const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();

    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;

    link += month < 10 ? '0' + month : month;

    link += data.destination;

    link += '1';

    console.log(link);


    return link;
}

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    
    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
    // console.log('cheapTicketDay: ', ticket);    
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
    // cheapTickets.sort((a, b) => {
    //     return a.value - b.value;   
    // });

    cheapTickets.sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }
        if (a.value < b.value) {
          return -1;
        }
        return 0;
    });

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }

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


// Функция для оповещения пользователя об ошибке
const createMsg = (error) => {
    const msg = document.createElement('article');
    msg.classList.add('msg');
    
    let deep = '';

    if (error) {
        deep = '<h3>В этом направлении нет рейсов!</h3>';
    } else {
        deep = '<h3>Введите корректное название города!</h3>';    
    }

    msg.insertAdjacentHTML('afterbegin', deep);

    return msg;
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
        from: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    }; 

    // console.log(formData);
    if (formData.from && formData.to) {

        // Формируем часть адресной строки как в документации API (вариант современный)
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}` + 
            `&destination=${formData.to.code}&one_way=true&token=` + API_KEY;

        // Формируем часть адресной строки как в документации API (вариант устаревший)
        // const requestData2 = '?depart_date=' + formData.when +
        //     '&origin=' + formData.from +
        //     '&destination=' + formData.to +
        //     '&one_way=true&token=' + API_KEY;
    
        // console.log(requestData);

        // Запрос по адресу и добавляем requestData - возвращается ответ в response
        getData(calendar + requestData, 
            (data) => {
            // console.log(response);
            renderCheap(data, formData.when);
            },
            (error) => {
                
                const msg = createMsg(error);
                formSearch.append(msg);

                console.error('Ошибка', error);

            });
    
    } else {

        const msg = createMsg();
        formSearch.append(msg);

    }

});


// Вызовы функций

// Функция получить данные по городам
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    
    // Сортировка городов по алфавиту
    city.sort((a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        
        return 0;
    });

    console.log(city);
});

/*

    (item) => {
        return item.name
    }

*/
