const apiURL = `https://mhw-db.com/weapons`;

/**
 * TO-DO: Method to pull MHW-db and get all weapons on page loading
 */
async function getWeapons() {
    try {
        const response = await fetch(apiURL);

        if (response.ok) {
            console.log(`Received response: ${response.status}`);
        } else {
            console.log(`Error, no response. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
    }
}

// Call the function
getWeapons();

/**
 * TO-DO: Method to poll MHW-db for selected weapon only
 */

/**
 * TO-DO: Method to call weapon cards with information
 */