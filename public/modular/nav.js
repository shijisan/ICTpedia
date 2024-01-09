document.addEventListener('DOMContentLoaded', function () {
    const navModular = document.querySelector(".navbar");

    // Create a div element to hold the navigation content
    const navContent = document.createElement("div");
    navContent.classList.add("container-fluid", "px-lg-5");

    // Navigation content HTML
    navContent.innerHTML = `
        <a class="navbar-brand d-flex align-items-center" href="../pages/index.html">
            <img src="../images/logo.png" alt="Logo" class="logo d-inline-block align-text-top me-2">
            <span class="logoText">ICTpedia</span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse flex-lg-row-reverse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item px-1">
                    <a class="nav-link active" aria-current="page" href="../pages/index.html"><span><i class="fa-solid fa-house"></i>&nbsp;</span>HOME</a>
                </li>
                <li class="nav-item px-1">
                    <a class="nav-link" href="#"><span><i class="fa-solid fa-book"></i>&nbsp;</span>WIKI</a>
                </li>
                <li class="nav-item px-1">
                    <a class="nav-link" href="#"><span><i class="fa-solid fa-robot"></i>&nbsp;</span>CHAT AI</a>
                </li>
                <li class="nav-item px-1">
                    <a class="nav-link" href="#"><span><i class="fa-solid fa-user"></i>&nbsp;</span>PROFILE</a>
                </li>
            </ul>
        </div>`;

    // Append the navigation content to navModular
    navModular.appendChild(navContent);

    // Add the stylesheet link to the head
    document.head.innerHTML += `<link rel="stylesheet" href="../modular/styling/nav.css">`;
});
