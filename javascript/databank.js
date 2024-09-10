const activeuser = [];

async function saveLogInDataInFirebase() {
    await fetch(url + '.json', {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(activeuser)
    });
}