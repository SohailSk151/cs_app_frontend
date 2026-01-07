import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary container mt-3 mb-3 border rounded hover-shadow ">
            <div class="container-fluid justify-content-center">
                <Link class="navbar-brand" to="/">CS App</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <Link class="nav-link active" aria-current="page" to="/">Home</Link>
                    <Link class="nav-link active" to="/">Sample Pages</Link>
                    <Link class="nav-link active" to="/orders">Latest</Link>
                </div>
                </div>
            </div>
        </nav>
    )
}