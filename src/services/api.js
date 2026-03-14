const API_URL = "http://localhost:4000"

export async function login(email, password) {

    const res = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        email,
        password
        })
    })

    return res.json()
}

export async function register(data) {

    const res = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return res.json()

}