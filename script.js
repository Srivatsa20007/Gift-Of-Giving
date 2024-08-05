let folder = [];
// let metadata;

async function main() {
    try {
        let response = await fetch("http://127.0.0.1:3001/cards/");

        if (!response.ok) {
            console.error("HTTP error: ", response.status, response.statusText);
            return;
        }

        let cardcontainer = document.querySelector(".cardcontainer");
        let text = await response.text();

        let div = document.createElement("div");
        div.innerHTML = text;

        let anchors = div.getElementsByTagName('a');

        for (let index = 0; index < anchors.length; index++) {
            const element = anchors[index];

            if (element.href.includes("/cards/")) {
                folder = element.href.split("/").slice(-2)[0];
                let metadataresponse = await fetch(`/cards/${folder}/data.json`);
                metadata = await metadataresponse.json();

                cardcontainer.innerHTML += `<div class="card">
                    <img class="cardimg" src="http://127.0.0.1:3001/cards/${folder}/cover.png" alt="clothes">
                    <h2>${metadata.title}</h2>
                    <button class="carddonate"><a href="#contact">Donate now</a></button>
                </div>`;
            }
        }
    } catch (error) {
        console.error("Error fetching card data:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let submitButton = document.querySelector(".btn1");

    submitButton.addEventListener("click", async () => {
        const form = document.getElementById("userform");
        const formData = new FormData(form);

        const data = {
            username: formData.get("name"),
            address: formData.get("address"),
            mobileno: formData.get("mobileno"),
            message: formData.get("message"),
            donation: formData.get("donation")
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.text();
                console.log(result);
                alert("Details submitted successfully");
                window.location.href = "user.html"; // Redirect to user.html
            } else {
                console.error("Error:", response.statusText);
                alert("An error occurred while submitting the form.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting the form.");
        }
    });

    main();
});
