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
        console.error(`Error fetching data: ${error}`);
    }
}

/**
 * TO-DO: Method to create weapon cards with information from getWeapons
 */
async function loadCards(weaponType) {

    const weapon_container = document.getElementById('weapon_container');
    const data = await getWeapons(weaponType);

    if (!data) {
        return;
    }

    console.log(data[0]);

    data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        const title = document.createElement('h2');
        title.textContent = item.name;

        const type = document.createElement('p');
        type.textContent = `Type: ${item.type}`;

        const rarity = document.createElement('p');
        rarity.textContent = `Rarity: ${item.rarity}`;

        const attack = document.createElement('p');
        attack.textContent = `Attack: ${item.attack.display}`;

        card.appendChild(title);
        card.appendChild(type);
        card.appendChild(rarity);
        card.appendChild(attack);

        weapon_container.appendChild(card);
    });
}

// Call the functions (testing)
loadCards();