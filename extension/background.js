console.log('%cINJECTED', 'background: #2ecc71; color: #fff; padding: 5px; margin: 2px; border-radius: 4px');

// document.getElementById('news__topnews-1_tab_personal').innerHTML='<a class="injected_btn" href="https://tensyteam.ru/video">Discuss</a>';

let array = document.getElementsByClassName('contacts-date-wrapper has-contacts');
let timerId = setInterval(() => {
    if (array.length !== 0) {
        addBtn();
        clearTimeout(timerId);
    }
}, 500);

setTimeout(() => {
    if (array.length === 0) {
        alert('ExTensy:\nДобавьте пользователя хотябы к одной карточке!');
        clearTimeout(timerId);
    }
}, 15000);

function addBtn() {
    for (let i = 0; i < array.length; i++) {
        let _block = array[i].innerHTML;
        let _position_start = _block.indexOf('alt')+5;
        let _position_end = _block.indexOf('title')-2;
        let _user_block = _block.substr(_position_start,_position_end-_position_start).replace(/\s/g, '').toLowerCase();
        let _workspace_acc = window.location.search.substr(5);
        array[i].innerHTML+=`<a class="injected_btn" href="https://tensyteam.ru/video`+ _workspace_acc + `/` + _user_block +`">Discuss</a>`;
    }
}
