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
            console.log(`Data:`, data[0]);
        } else {
            console.log(`Error, no response. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}

/**
 * TO-DO: Method to call/create weapon cards with information
 */

// Call the functions (testing)
getWeapons("bow");