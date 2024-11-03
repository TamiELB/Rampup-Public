import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../logic/apiService";
import { IoIosClose, IoIosCheckmark } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showToast } from "../../app/redux-reducers/contextProvider";

function Signup() {
    const [credentials, setCredentials] = useState({
        email: "",
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Create user account
    function handleSubmit(e) {
        e.preventDefault();

        if (Object.values(credentials).some((field) => field === "")) {
            dispatch(showToast({ message: "Fill in all fields.", level: 2 }));
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            dispatch(
                showToast({ message: "Passwords do not match.", level: 2 }),
            );
            return;
        }

        apiService.post("/account", credentials).then((res) => {
            if (!res.success) {
                dispatch(
                    showToast({
                        message:
                            res.message.toLowerCase().replace(/_/g, " "), // Replaces underscores with spaces and converts to lowercase
                        level: 2,
                    }),
                );
                return;
            }
            dispatch(
                showToast({
                    message: "Account created successfully.",
                    level: 1,
                }),
            );
            navigate("/feed");
        });
    }

    // Update credentials state when input changes
    function onChange(e) {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <div className="bg-dark-bg text-dark-text flex min-h-dvh flex-col items-center justify-center">
            <h1 className="pattaya my-6 text-3xl font-bold">Meer of Minder</h1>

            <form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3 flex w-full flex-col items-center justify-center gap-3">
                    <input
                        className="focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-72 rounded border p-2 outline-none"
                        name="email"
                        value={credentials.email}
                        onChange={(e) => onChange(e)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <input
                        className="focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-72 rounded border p-2 outline-none"
                        name="name"
                        value={credentials.name}
                        onChange={(e) => onChange(e)}
                        placeholder="Name"
                        required
                    />
                    <input
                        className="focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-72 rounded border p-2 outline-none"
                        name="username"
                        value={credentials.username}
                        onChange={(e) => onChange(e)}
                        placeholder="Username"
                        required
                    />
                    <div className="relative w-72">
                        <input
                            className="focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-full rounded border p-2 pr-10 outline-none"
                            name="password"
                            value={credentials.password}
                            onChange={onChange}
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                        >
                            <span className="border-dark-secondary flex items-center border-l-2 pl-2">
                                {showPassword ? (
                                    <FaEyeSlash className="text-dark-secondary" />
                                ) : (
                                    <FaEye className="text-dark-secondary" />
                                )}
                            </span>
                        </button>
                    </div>
                    <div
                        className={`grid duration-500 ease-in-out ${credentials.password !== "" ? "grid-rows-animate-height-open" : "grid-rows-animate-height-closed"}`}
                    >
                        <div className="overflow-hidden">
                            <input
                                className={`focus:border-dark-secondary bg-dark-bg border-dark-primary h-12 w-72 rounded border p-2 outline-none`}
                                name="confirmPassword"
                                value={credentials.confirmPassword}
                                onChange={(e) => onChange(e)}
                                placeholder="Confirm Password"
                                type="password"
                                required
                            />
                            <div className="mt-2 flex w-72 flex-col">
                                <div
                                    className={`grid duration-300 ease-out ${credentials.password.length >= 8 ? "grid-rows-animate-height-closed mb-0 delay-500" : "grid-rows-animate-height-open mb-1"}`}
                                >
                                    <span
                                        className={`text-dark-secondary flex flex-row items-center justify-start overflow-hidden text-sm`}
                                    >
                                        {credentials.password.length >= 8 ? (
                                            <IoIosCheckmark className="size-5 text-green-500" />
                                        ) : (
                                            <IoIosClose className="size-5 text-red-500" />
                                        )}
                                        Passwords must be at least 8 characters
                                        long.
                                    </span>
                                </div>
                                <div
                                    className={`grid duration-300 ease-out ${credentials.password.match(/[A-Z]/) ? "grid-rows-animate-height-closed mb-0 delay-500" : "grid-rows-animate-height-open mb-1"}`}
                                >
                                    <span className="text-dark-secondary flex flex-row items-center justify-start overflow-hidden text-sm">
                                        {credentials.password.match(/[A-Z]/) ? (
                                            <IoIosCheckmark className="size-5 text-green-500" />
                                        ) : (
                                            <IoIosClose className="size-5 text-red-500" />
                                        )}
                                        Passwords must contain one uppercase
                                        letter.
                                    </span>
                                </div>
                                <div
                                    className={`grid duration-300 ease-out ${credentials.password.match(/[a-z]/) ? "grid-rows-animate-height-closed mb-0 delay-500" : "grid-rows-animate-height-open mb-1"}`}
                                >
                                    <span className="text-dark-secondary flex flex-row items-center justify-start overflow-hidden text-sm">
                                        {credentials.password.match(/[a-z]/) ? (
                                            <IoIosCheckmark className="size-5 text-green-500" />
                                        ) : (
                                            <IoIosClose className="size-5 text-red-500" />
                                        )}
                                        Passwords must contain one lowercase
                                        letter.
                                    </span>
                                </div>
                                <div
                                    className={`grid duration-300 ease-out ${credentials.password.match(/[0-9]/) ? "grid-rows-animate-height-closed delay-500" : "grid-rows-animate-height-open"}`}
                                >
                                    <span className="text-dark-secondary flex flex-row items-center justify-start overflow-hidden text-sm">
                                        {credentials.password.match(/[0-9]/) ? (
                                            <IoIosCheckmark className="size-5 text-green-500" />
                                        ) : (
                                            <IoIosClose className="size-5 text-red-500" />
                                        )}
                                        Passwords must contain one number.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-72 flex-col items-center justify-center gap-3">
                    <button
                        type="submit"
                        className="bg-dark-secondary text-dark-text h-12 w-full rounded font-bold"
                    >
                        Register
                    </button>
                    <div className="flex w-full items-center justify-center">
                        <span className="bg-dark-primary h-px flex-grow" />
                        <span className="mx-4 -translate-y-px">or</span>
                        <span className="bg-dark-primary h-px flex-grow" />
                    </div>
                    <Link
                        to={"/auth/login"}
                        className="border-dark-secondary text-dark-secondary flex h-12 w-full items-center justify-center rounded border font-bold"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default Signup;
