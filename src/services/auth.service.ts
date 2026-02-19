import Axios from "./caller.service";

export const login = async (email: string, password: string) => {
    try {
        const res = await Axios.post("users/login", {
            email,
            password,
        });
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const logoutService = async () => {
    const res = await Axios.post("/users/logout");
    return res.data;
};

export const register = async ({
    name,
    email,
    password,
}: {
    name: string;
    email: string;
    password: string;
}) => {
    const res = await Axios.post("/users", {
        name,
        email,
        password,
        roles: ["customer"],
    });

    return res.data;
};

export const getMe = async () => {
    const res = await Axios.get("/users/me");
    return res.data?.user ?? null;
};
