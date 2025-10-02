## Simple_User_Management_Interface

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Made with HTML](https://img.shields.io/badge/HTML-5-orange)
![Made with CSS](https://img.shields.io/badge/CSS-3-blue)
![Made with JS](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)
![jQuery](https://img.shields.io/badge/jQuery-3.6-blue)
![Datatables](https://img.shields.io/badge/DataTables-Plugin-green)

*It is a simple web interface, that allows users to log in and change their email or password. This interface also allows administrators to do the same for themselves and for other users alike, among other things.*

This project was created as part of my internship. The interface allows both users and administrators to view and update their basic account information. It also allows for administrators to change other users' basic informations as well as root status, lock status and private comments (visible only for administrator users) and allows to add new users. The interface also allows to restore users password through 2-step process. Account functionality uses browser cookies to store account login and authentication token. All of the aforementioned functionality is handled by the custom external API
> **_IMPORTANT NOTE:_**  Since the project is being used by the client, I don't have access to the API anymore. This release uses a simplified API simulation to showcase the functionality.

<ins>**For Presentation Purposes Only**</ins> 

---

## Features
- Allows for regular users to log in and view their info, as well as change the e-mail and/or password corresponding to the account.
- Allows for administrator users to change other users' e-mail, password, root status, lock status and private comments in addition to the regular features.
- Allows for users to restore their password.

---

## Tech Stack
This project is built with:
- **Language**: HTML, CSS, JavaScript
- **Major Libraries**:
  - jQuery - used to simplify JavaScript code
  - Bootstrap - used to create responsive web interface
  - Datatables - used to create responsive table to display users' data
> All of the libraries are packed localy in the project itself

---

## Getting Started

To run the project locally, simply clone the repository and open `index.html` in your browser. API simulation contains only two accounts:
- login: user | password: user
- login: root | password: root

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements
- jQuery
- Bootstrap
- Datatables

---
