const apiURL = `https://mhw-db.com/weapons`;

/**
 * Method to get info. from MHW-db and get weapons
 */
async function getWeapons(weaponType) {

    let currentURL = apiURL;
    if (weaponType) {
        currentURL = `${apiURL}?q={"type":"${weaponType}"}`
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
}

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
}

/**
 * Method to create weapon cards with information from getWeapons
 */
async function loadCards(weaponType) {

    const weapon_container = document.getElementById('weapon_container');
    const now_loading = document.getElementById('now_loading');
    const data = await getWeapons(weaponType);

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
}

// Call the functions (testing)
loadCards();