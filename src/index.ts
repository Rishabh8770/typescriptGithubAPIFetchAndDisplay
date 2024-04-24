const getUsername = document.querySelector('#user') as HTMLInputElement
const formSubmit = document.querySelector('#form') as HTMLFormElement
const main_container = document.querySelector('.main_container') as HTMLElement

interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

//reusable function
async function myCustomeFetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options)
    if (!response.ok) {
        throw new Error(`Network response was not ok - status: ${response.status}`)
    }

    const data = await response.json();
    console.log("data is", data)
    return data;
}

//display card UI
const showResultUI = (singleUser: UserData) => {
    const { avatar_url, login, url, location } = singleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
        <img src=${avatar_url} alt=${login}
        <hr/>
        <div class="card-footer">
            <img src="${avatar_url}" alt="${login}" />
            <a href="${url}"> Github</a>
        </div>    
        </div>
        `
    )
};

async function fetchUserData(url: string) {
    // since it's an array of an object we pass generics as UserData[]
    try {
        const allUserData = await myCustomeFetcher<UserData[]>(url, {});
        main_container.innerHTML = "";
        for (const singleUser of allUserData) {
            showResultUI(singleUser)
            console.log('login' + singleUser);
        }
    } catch (error) {
        console.log(error);
    }

}

//* initial fetch when the page loads
fetchUserData("https://api.github.com/users");

//* Search functionality
// add eventlistener to input for live search
getUsername.addEventListener('input', async () => {
    formSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();

        getUsername.addEventListener('input', async () => {
            const searchTerm = getUsername.value.toLowerCase();

            try {
                const url = "https://api.github.com/users";
                const allUserData = await myCustomeFetcher<UserData[]>(url, {})
                const matchingUsers = allUserData.filter((user) => {
                    return user.login.toLowerCase().includes(searchTerm)
                });

                //clear the previous data
                main_container.innerHTML = "";

                if (matchingUsers.length === 0) {
                    main_container?.insertAdjacentHTML(
                        "beforeend",
                        `<p class="empty-msg">No matching users found.</p>`
                    )
                } else {
                    for (const singleUser of matchingUsers) {
                        showResultUI(singleUser);
                    }
                }
            }
            catch (error) {
                console.log(error);

            }
        })
    })
})
