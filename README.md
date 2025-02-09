# Ryft BACKEND
This project is the backend component of the Ryft platform, an educational social media project. It provides server-side functionality such as user authentication, API endpoints, and data persistence, enabling seamless integration with the **[Ryft Frontend](https://github.com/Xdellta/Ryft-Frontend)**.

<br>

## 🛠️ Tools and Technologies
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgresql](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)

<br>

## 📜 License
[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)<br>
By [Patryk Piotrowski](https://github.com/Xdellta) & [Piotr Ostrowski](https://github.com/PiotrO9)

<br>

## 🚀 Getting Started
To ensure the proper functioning of the platform, the **[Ryft Frontend](https://github.com/Xdellta/Ryft-Frontend)** must also be installed and configured.<br><br>

**1.** Clone the repository:
```sh
git clone https://github.com/Xdellta/Ryft-Backend.git  
cd ryft-backend
```

**2.** Install dependencies:
```sh
npm install
```

**3** Configure the environment
Create a .env file in the project root and configure the required environment variables. Below is an example:
```env
DB_USER=
DB_HOST=
DB_DATABASE=
DB_PASSWORD=
DB_PORT=

DATABASE_URL=""
```

**4.** Run database migrations and seed data
```sh
npx prisma migrate dev  
npm run seed  
```

**5.** Start the server
```sh
node index.js
```