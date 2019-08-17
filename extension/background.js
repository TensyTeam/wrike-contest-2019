// add info to console
console.log('%cINJECTED', 'background: #2ecc71; color: #fff; padding: 5px; margin: 2px; border-radius: 4px');

// get array blocks
let array = document.getElementsByClassName('contacts-date-wrapper has-contacts');

// start interval
let timerId = setInterval(() => {
    if (array.length !== 0) {
        // add btn on block
        addBtn();
        // stop timeout
        clearTimeout(timerId);
    }
}, 500);

setTimeout(() => {
    // if long load
    if (array.length === 0) {
        alert('ExTensy:\nThere are no assigned cards\n(This error could occur in case of bad internet connection)');
        clearTimeout(timerId);
    }
}, 40000);

function addBtn() {
    for (let i = 0; i < array.length; i++) {
        // get block
        let _block = array[i].innerHTML;
        let _block_split = _block.split('<wrike-avatar');
        let count = (_block_split.length - 1);
        if(count > 1) {
            let n = 1;
            let _user_block = '';
            let _user_link_block = '';
            while(n <= count) {
                // get user name & surname
                let _position_start_2 = _block_split[n].indexOf('alt')+5;
                let _position_end_2 = _block_split[n].indexOf('title')-2;
                _user_block += _block_split[n].substr(_position_start_2,_position_end_2-_position_start_2).replace(/\s/g, '').toLowerCase() + '*';
                n++;
            }
            // get workspace name
            let _workspace_name = document.getElementsByClassName('header-title__main')[0].innerText;
            // generate room
            let _room = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // add info
            array[i].innerHTML+=`<a class="injected_btn" href="https://tensyteam.ru/choose/`+ _room + `/request?workspace=` + _workspace_name + `&users=` + _user_block.slice(0,-1) + `">Discuss</a>`;
        } else {
            // get user name & surname
            let _position_start = _block.indexOf('alt')+5;
            let _position_end = _block.indexOf('title')-2;
            let _user_block = _block.substr(_position_start,_position_end-_position_start).replace(/\s/g, '').toLowerCase();
            // get workspace name
            let _workspace_name = document.getElementsByClassName('header-title__main')[0].innerText;
            // generate room
            let _room = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            // add info
            array[i].innerHTML+=`<a class="injected_btn" href="https://tensyteam.ru/video/`+ _room + `/request?workspace=` + _workspace_name + `&user=` + _user_block +`">Discuss</a>`;
        }

    }
}
