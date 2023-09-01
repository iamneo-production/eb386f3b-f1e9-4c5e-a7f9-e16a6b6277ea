import { API_URL } from "../../app/constants";

export function fetchApplicationsByUserId(userId) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        const response = await fetch(`${API_URL}/loanApplications?user=${userId}`)
        const data = await response.json()
        resolve({ data });
    });
}