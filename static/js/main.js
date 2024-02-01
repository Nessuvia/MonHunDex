// Variable for holding selected weapons
var weaponList = [];

// Variables for each weapon icon
var sword_shield = document.getElementsByClassName('sword_shield');
var greatsword = document.getElementsByClassName('greatsword');
var longsword = document.getElementsByClassName('longsword');
var dual_blades = document.getElementsByClassName('dual_blades');
var lance = document.getElementsByClassName('lance');
var gunlance = document.getElementsByClassName('gunlance');
var hammer = document.getElementsByClassName('hammer');
var hunting_horn = document.getElementsByClassName('hunting_horn');
var switch_axe = document.getElementsByClassName('switch_axe');
var charge_blade = document.getElementsByClassName('charge_blade');
var insect_glaive = document.getElementsByClassName('insect_glaive');
var light_bg = document.getElementsByClassName('light_bg');
var heavy_bg = document.getElementsByClassName('heavy_bg');
var bow = document.getElementsByClassName('bow');

// Variable to get all weapons
var icon_container = document.querySelector('.icon_container');

// Attach an event listener for select weapons
var weaponButtons = icon_container.getElementsByClassName('weapon_icons');
Array.from(weaponButtons).forEach(function(button) {
    button.addEventListener('click', selectWeapon);
});

/**
 * Method to select one or multiple weapons
 */
function selectWeapon() {
    this.classList.toggle('active');

    var weaponType = this.classList[1];

    // Check if the weapon is already in the weaponList
    var index = weaponList.indexOf(weaponType);

    if (index !== -1) {
        weaponList.splice(index, 1);
    } else {
        weaponList.push(weaponType);
    }

    // Call cards to load after each selection
    loadCards(weaponList);
}

/**
 * Method to get information from MHW-db
 */
async function getWeapons(weaponList) {
    let currentURL = `https://mhw-db.com/weapons`;

    // If weapons are selected, append them to the to query
    if (weaponList && weaponList.length > 0) {
        const typeQuery = encodeURIComponent(JSON.stringify({ "$in": weaponList }));
        currentURL = `${currentURL}?q={"type":${typeQuery}}`;
    }

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
async function loadCards(weaponList) {
    const weapon_container = document.getElementById('weapon_container');
    const now_loading = document.getElementById('now_loading');

    // Clear the content of weapon_container on each load
    weapon_container.innerHTML = '';

    // Show the loading gif and hide the weapons each time
    weapon_container.style.display = "none";
    now_loading.style.display = "flex";

    const data = await getWeapons(weaponList);

    if (!data) {
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
loadCards([]);