// Variable for holding selected weapons
var weaponList = [];

// Variables for each weapon icon
const sword_shield = document.getElementsByClassName('sword-and-shield');
const greatsword = document.getElementsByClassName('great-sword');
const longsword = document.getElementsByClassName('long-sword');
const dual_blades = document.getElementsByClassName('dual-blades');
const lance = document.getElementsByClassName('lance');
const gunlance = document.getElementsByClassName('gunlance');
const hammer = document.getElementsByClassName('hammer');
const hunting_horn = document.getElementsByClassName('hunting-horn');
const switch_axe = document.getElementsByClassName('switch-axe');
const charge_blade = document.getElementsByClassName('charge-blade');
const insect_glaive = document.getElementsByClassName('insect-glaive');
const light_bg = document.getElementsByClassName('light-bowgun');
const heavy_bg = document.getElementsByClassName('heavy-bowgun');
const bow = document.getElementsByClassName('bow');

// Variable to get all weapons
const icon_container = document.querySelector('.icon_container');

// Variable for search bar
const searchTerm = document.getElementById('search_bar');

// Attach an event listener for select weapons
const weaponButtons = icon_container.getElementsByClassName('weapon_icons');
Array.from(weaponButtons).forEach(function(button) {
    button.addEventListener('click', selectWeapon);
});

/**
 * Delay function from stackexchange
 * https://stackoverflow.com/questions/1381751/onkeyup-javascript-time-delay
 */
var delay = function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    }  
}();

/**
 * Method to select one or multiple weapons
 */
async function selectWeapon() {
    let currentURL = `https://mhw-db.com/weapons`;

    this.classList.toggle('active');

    var weaponType = this.classList[1];

    // Check if the weapon is already in the weaponList
    var index = weaponList.indexOf(weaponType);

    if (index !== -1) {
        weaponList.splice(index, 1);
    } else {
        weaponList.push(weaponType);
    }

    if (weaponList && weaponList.length > 0) {
        const typeQuery = encodeURIComponent(JSON.stringify({ "$in": weaponList }));
        currentURL = `${currentURL}?q={"type":${typeQuery}}`;
    }

    /**
     * Call search instead of loadCards to account for if a weapon is selected while there is
     * something in the search box
     */
    search();
}

/**
 * Method to search weapons by name
 * Example url:
 * https://mhw-db.com/weapons?q={%22name%22:{%22$like%22:%22Bone%%22}}
 */
async function search() {
    let currentURL = `https://mhw-db.com/weapons`;

    // First check if there's something written in the search bar, and if a weapon type is selected
    if (searchTerm.value.length > 0) {
        const searchQuery = encodeURIComponent(JSON.stringify({ "$like": `${searchTerm.value}%` }));
        let query = ''; // Initialize the query string

        // Check if weaponList is not empty, then include type query
        if (weaponList.length > 0) {
            const typeQuery = encodeURIComponent(JSON.stringify({ "$in": weaponList }));
            query = encodeURIComponent(JSON.stringify({
                "$and": [
                    { "name": { "$like": `${searchTerm.value}%` } },
                    { "type": { "$in": weaponList } }
                ]
            }));
        } else { // Otherwise, only include the name query
            query = encodeURIComponent(JSON.stringify({ "name": { "$like": `${searchTerm.value}%` } }));
        }

        currentURL = `${currentURL}?q=${query}`;
    }  

    loadCards(currentURL);
}

/**
 * Method to get information from MHW-db
 * Example url:
 * https://mhw-db.com/weapons?q={%22$and%22:[{%22name%22:{%22$like%22:%22Bone%%22}},{%22type%22:{%22$in%22:[%22great-sword%22,%22bow%22]}}]}
 */
async function getWeapons(currentURL) {
    try {
        const response = await fetch(currentURL);
        if (response.ok) {
            const data = await response.json();
            console.log(`Received response: ${response.status}`);
            return data;
        } else {
            console.log(`Error, no response. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * This simply corrects the display names of each weapon to be capitalized.
 * 
 * Credit to stackoverflow for part of this solution
 * https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
 */
function typeFix(string) {
    const specialCases = ["great-sword", "long-sword"];
    let resultString;

    if (specialCases.includes(string)) {
        resultString = string.replace(/-/g, '');
        resultString = resultString.charAt(0).toUpperCase() + resultString.slice(1);
    } else {
        resultString = string.replace(/-/g, ' ');
        resultString = resultString.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    return resultString;
};

/**
 * Method to create weapon cards with information from getWeapons
 */
async function loadCards(currentURL) {
    const weapon_container = document.getElementById('weapon_container');
    const now_loading = document.getElementById('now_loading');

    // Clear the content of weapon_container on each load
    weapon_container.innerHTML = '';

    // Show the loading gif and hide the weapons each time
    weapon_container.style.display = "none";
    now_loading.style.display = "flex";

    const data = await getWeapons(currentURL);

    // If there's no data, display that no results were found
    if (!data) {
        weapon_container.innerHTML = '';
        weapon_container.append("No results found.");
        weapon_container.style.display = "flex"; 
        now_loading.style.display = "none";
        return;
    }

    data.forEach(item => {
        const text_container = document.createElement('div');
        const img_container = document.createElement('div');

        const card = document.createElement('div');
        card.classList.add('card');
    
        const title = document.createElement('h2');
        title.textContent = item.name;
    
        const type = document.createElement('p');
        type.textContent = `Type: ${typeFix(item.type)}`;
    
        const rarity = document.createElement('p');
        rarity.textContent = `Rarity: ${item.rarity}`;
    
        const attack = document.createElement('p');
        attack.textContent = `Attack: ${item.attack.display}`;

        // Check to see if image exists, if not use placeholder
        const img = document.createElement('img');
        if (item.assets && item.assets.image) {
            img.src = item.assets.image;
        } else {
            img.src = '../static/img/placeholder.png';
        }
        img_container.appendChild(img);
    
        text_container.appendChild(title);
        text_container.appendChild(type);
        text_container.appendChild(rarity);
        text_container.appendChild(attack);

        card.appendChild(text_container);
        card.appendChild(img_container);
    
        weapon_container.appendChild(card);
    });
    weapon_container.style.display = "flex"; 
    now_loading.style.display = "none";
};

// Call the function with an empty list on page load
loadCards(`https://mhw-db.com/weapons`);