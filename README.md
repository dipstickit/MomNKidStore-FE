# Maternity and Baby Milk Store Frontend - ReactJSX + Vite

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
   - [Guest](#guest)
   - [Member](#member)
   - [Staff](#staff)
   - [Admin](#admin)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Technologies Used](#technologies-used)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)

## Introduction

This project is a comprehensive e-commerce platform tailored for mothers and babies, focusing specifically on a wide range of milk products. The platform is built using ReactJSX and Vite, offering an intuitive and user-friendly interface for guests, members, staff, and administrators. Each type of user has distinct functionalities, ensuring a personalized and efficient shopping experience.

## Features

### Guest
Guests have access to several features without needing to create an account. These include:

- **View Information & Reviews**: Guests can browse detailed product information, including ingredients, nutritional values, and customer reviews. This helps them make informed purchasing decisions.

- **Search Products**: The platform provides a robust search function, allowing guests to quickly find the milk products they are interested in.

- **Purchase Products**: Guests can directly purchase products, with options for choosing different sizes, quantities, and delivery methods.

- **Health Articles**: The platform includes a blog section with articles on health care for pregnant women and babies. Guests can gain valuable insights and buy recommended products directly from these articles.

### Member
Members enjoy additional benefits and features after registering on the platform:

- **Secure Payment Options**: Members can purchase products using various payment methods, including bank transfers and online payment gateways. The checkout process is secure, ensuring the safety of members' financial information.

- **Voucher & Points System**: Members can use discount vouchers during checkout, accumulate points with each purchase, and redeem these points for gifts or discounts on future purchases.

- **Product Reviews & Feedback**: Members can leave detailed reviews and feedback on products they've purchased, helping other users make informed decisions.

- **Online Consultation**: Members have access to an online chat function where they can consult with experts on selecting the best milk products for their needs.

- **Pre-ordering**: If a product is out of stock, members can place pre-orders and be notified when the product becomes available again.

### Staff
The platform includes a comprehensive back-office system for staff to manage operations effectively:

- **Order Confirmation**: Staff can confirm and process customer orders, ensuring they are ready for delivery.

- **Inventory Management**: Staff can manage the inventory, updating product quantities, adding new products, and removing discontinued ones.

- **User Management**: Staff can manage user accounts, including updating user information and addressing customer service inquiries.

- **Voucher Management**: Staff have the authority to create and manage discount vouchers, ensuring promotions are executed smoothly.

- **Report Handling**: Staff can handle reports related to orders, customers, and inventory, providing critical data for business analysis.

- **Order Tracking**: Staff can track orders from processing to delivery, ensuring customers receive their purchases on time.

- **Article Management**: Staff can create, edit, and manage health care articles, keeping the blog section up-to-date with the latest information.

### Admin
Administrators have access to advanced management features, ensuring the platform runs smoothly and efficiently:

- **Account Management**: Admins can manage all user accounts, including adding or removing users, and assigning roles (e.g., staff, members).

- **Revenue Statistics**: Admins have access to detailed revenue statistics, including sales reports, profit margins, and financial forecasts.

- **Product Management**: Admins can oversee the entire product catalog, ensuring all products are listed correctly with accurate information.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dipstickit/MomNKidStore-FE.git

2. **Navigate to the project directory:**

   ```bash
   cd MomNKidStore-FE

3. **Install the dependencies:**

    ```bash
    npm install

3. **Start the development server:**

   ```bash
    npm start


The application should now be running locally on http://localhost:3000/.

## Usage

After setting up the project, you can start exploring the various features by navigating through the platform as a guest, registering as a member, or using the staff/admin functionalities (if applicable).

### Running Tests

To ensure that everything is functioning as expected, you can run the automated test suite using:

```bash
npm test
```

## Technologies Used

This project leverages the following technologies:

- *ReactJSX: The core framework used for building the user interface.*
- *Vite: For fast development and HMR (Hot Module Replacement).*
- *Redux: For state management across the application.**
- **React Router: For handling navigation and routing between different pages.*
- *Axios: For making API requests to the backend server.*
- *Formik: For form handling and validation.*
- *Yup: For form validation schemas.*
- *Jest: For unit testing the application.*
- *ESLint: For maintaining code quality and consistency.*
- *Prettier: For code formatting.*
- *Bootstrap: For responsive and modern UI components.*

## Project Structure

The project follows a well-organized structure, ensuring maintainability and scalability:

```bash
/src
  /assets
  /components
    /Admin
    /Blog
      Blog.jsx
      Blog.scss
    /Cart
    /ForgotPassword
    /HomePage
    /loginPage
    /OrderPayment
    /Post
    /ProductInfo
      /Detail
        ProductInfo.jsx
        ProductInfo.scss
        DetailOfProduct
        Reviews
      ProductDetail.jsx
    /Register
    /Staff
    /Unauthorized
    /UserAccount
    /JS 
      API.js
    /RequireAuth.jsx
  /context
  /hooks
  /utils
  App.css
  App.jsx
  index.css
  index.jsx
/main.jsx
/.eslint.cjs
/db.json
/index.html
/package-lock.json
```

- */assets: Contains static assets such as images, fonts, etc.*
- */components: Contains all reusable UI components organized by features such as Admin, Blog, Cart, etc.*
    - */Blog: Contains components and styling related to the blog section.*
    - */ProductInfo: Contains components and styles specific to displaying detailed product information, including reviews.*
    - */JS: Contains JavaScript utility files such as API configurations.*
    - */RequireAuth.jsx: Ensures that only authenticated users can access specific routes.*
- */context: Contains context providers for managing global state across the application.*
- */hooks: Contains custom hooks to manage reusable logic across components.*
- */utils: Contains utility functions that are used throughout the application.*
- *App.jsx: The root component that includes routing and layout logic.*
- *index.jsx: The entry point of the application.*

## Contributing

We welcome contributions to enhance the platform's functionality and user experience. If you'd like to contribute, please follow these steps:


1. **Fork the repository.**

2. **Create a new branch (git checkout -b feature/your-feature).**

3. **Make your changes.**

4. **Commit your changes (git commit -m 'Add some feature').**

5. **Push to the branch (git push origin feature/your-feature).**

6. **Open a Pull Request.**

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

You can paste this content directly into your `README.md` file in Visual Studio Code. It covers all the sections you asked for, formatted correctly in Markdown. This will make your project README both informative and visually appealing on GitHub.

