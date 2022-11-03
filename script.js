window.addEventListener('DOMContentLoaded', () => {
    const url = 'https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7';
    let array = [];
    let loading = false;

    const getData = async (url) => {
        try {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Нельзя выполнить запрос по этому адресу, статус: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error(error.message)
        }
    }

    getData(url)
        .then(data => {
            array = data;
            if (!localStorage.getItem("loading")) {
                localStorage.setItem("loading", true);
                renderCard();
            } else {
                isSearch();
            }

        })
        .catch(err => {
            console.error(err, err.message);
        });

    class Card {
        constructor(title, body, id, parentSelector) {
            this.title = title;
            this.body = body;
            this.id = id;
            this.parent = document.querySelector(parentSelector);
            this.changeTitle();
        }

        changeTitle() {
            this.title = this.title.length > 39 ? `${this.title.slice(0, 39)}...` : this.title;
        }

        render() {
            const element = document.createElement('div');
            element.classList.add("card__item");
            element.innerHTML = `
                <h3 class="card__item-title">${this.title}</h3>
                <p class="card__item-body">${this.body}</p>
                <input type="checkbox" id=${this.id} />
            `;
            this.parent.append(element);
            element.addEventListener("change", handleChange);

        }
    }

    const input = document.querySelector(".search_text");

    function isSearch() {
        if (window.location.search) {
            const query = window.location.search.substring(1).split('=')[1];

            input.value = query || "";
            let inputValue = input.value;
            renderCard(inputValue);
        }
    }

    const button = document.querySelector(".button");
    button.addEventListener("click", handleSearch);

    function renderCard(inputValue) {
        if (!inputValue) {
            inputValue = "";
        }

        const element = document.querySelector(".cards_wrapper");
        element.innerHTML = "";

        try {
            const filterArray = array.filter(obj => obj.title.includes(inputValue));
            filterArray.forEach(({ title, body, id }) => {
                new Card(title, body, id, '.cards_wrapper').render();
            })
        } catch (error) {
            console.error('Данные с сервера не были получены', error.message);
        }
    }

    function handleSearch(e) {
        e.preventDefault();

        let inputValue = input.value;
        renderCard(inputValue);
        const seacrhParams = window.location.protocol + "//" + window.location.host + window.location.pathname + `?search=${inputValue}`;
        window.history.pushState({ path: seacrhParams }, '', seacrhParams);
    }

    function handleChange(e) {
        e.preventDefault();
        e.stopPropagation();

        const idCheck = e.target.id;
        const chbox = document.getElementById(idCheck);
        const element = chbox.parentNode;

        if (chbox.checked) {
            element.classList.add("active");
        }
        else {
            element.classList.remove("active");
        }
    }
});