# Shopping Cart Test

Welcome to the Datarock Shopping Cart Test project! This project serves as a test implementation for the requirements outlined [here](https://github.com/DiUS/coding-tests/blob/master/dius_shopping.md).

## Getting Started

This project is built with TypeScript and runs on Node.js. Make sure you have [Yarn](https://yarnpkg.com/) installed as your package manager.

### Installation

To install project dependencies, execute the following command in your terminal:

```bash
yarn install
```

### Running the Project

To run the project with the provided scenarios, use the following command:

```bash
yarn dev
```

### Running Tests

To execute the project's tests, use the following command:

```bash
yarn test
```

## Project Structure

- **src**: Contains the source code written in TypeScript.
- **tests** are defined in the `src` folder as this is a very small test project. The tests are defined as `src/**/*.spec.ts`
- **package.json**: Specifies project metadata and dependencies.
- **tsconfig.json**: Configures TypeScript compilation options.
- **jest.config.ts**: Configures Jest options.
- **.prettierrc**: Configures Prettier options.
- **yarn.lock**: Lock file for Yarn to ensure consistent package installations.


## Models

### Project Overview

This project simulates a shopping cart, governed by a high-level architecture diagram shown below:

![Architecture Diagram](/readme/arch.drawio.png)

### Product Model

The `Product` model, defined in [Product.ts](/src/models/Product.ts), represents the various products available in the shopping cart. 

### Promotion Model

The `Promotion` model, defined in [Promotion.ts](/src/models/Promotion.ts), represents the promotional offers associated with products. Each product can have multiple promotions, and each promotion defines a pricing rule. This pricing rule is a pure function that depends on the product and other items in the cart, ultimately returning the final price of the product.

### CartItem Model

The `CartItem` model, defined in [CartItem.ts](/src/models/CartItem.ts), is implemented as a class. It encapsulates information about a product, its associated promotions, and the quantity selected. The `CartItem` class is responsible for calculating the total cost of the item, considering both the product's promotions and interactions with other items in the cart. If a product has no promotions, a simple calculation is applied. Therefore, each `CartItem` instance handles the calculation and application of its own promotions.

### Cart Model

The `Cart` model, defined in [Cart.ts](/src/models/Cart.ts), is implemented as a class. It accepts fetcher functions for products and promotions, providing an interface to add or scan a product SKU. The `Cart` class fetches the relevant product and promotion, creates a `CartItem`, and stores it in a dictionary (in a real-world scenario, this would be a table in SQL or a NoSQL database). The class then iterates over all items in the cart, calculating the total post-promotion cost of all items.

This model structure ensures a modular and organized approach to representing products, promotions, cart items, and the overall shopping cart functionality within the project.

## Data

Product and promotion data are stored as arrays, and the respective fetchers are defined in the [data directory](/src/data). It's important to note that in a real-world scenario, these would typically be managed by respective microservices with associated SQL or NoSQL database tables. However, for the purposes of this test project, the data is stored as arrays of objects within the codebase. This simplification allows for a clear demonstration of functionality without the complexity of external services.

## `src/index.ts`
This file serves as the main entry point for the code, defining a set of scenarios presented in the form of an array. When you run `yarn dev`, the console output will provide comprehensive information, including a description of the scenario, the total cost, whether the cost met expectations, and a detailed receipt breakdown for each item in the cart.

```bash
% yarn dev
yarn run v1.22.19
$ ts-node ./src/index.ts
{
  "description": "SKUs Scanned: atv, atv, atv, vga - Total expected: $249.00",
  "totalCost": 249,
  "asExpectation": true,
  "receipt": [
    {
      "product": "Apple TV",
      "quantity": 3,
      "promotions": [
        "we're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only"
      ],
      "finalCost": 219
    },
    {
      "product": "VGA adapter",
      "quantity": 1,
      "promotions": [
        "we will bundle in a free VGA adapter free of charge with every MacBook Pro sold"
      ],
      "finalCost": 30
    }
  ]
}

----

{
  "description": "SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd - Total expected: $2718.95",
  "totalCost": 2718.95,
  "asExpectation": true,
  "receipt": [
    {
      "product": "Apple TV",
      "quantity": 2,
      "promotions": [
        "we're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only"
      ],
      "finalCost": 219
    },
    {
      "product": "Super iPad",
      "quantity": 5,
      "promotions": [
        "the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4"
      ],
      "finalCost": 2499.95
    }
  ]
}

----

{
  "description": "SKUs Scanned: mbp, vga, ipd - Total expected: $1949.98",
  "totalCost": 1949.98,
  "asExpectation": true,
  "receipt": [
    {
      "product": "MacBook Pro",
      "quantity": 1,
      "promotions": [],
      "finalCost": 1399.99
    },
    {
      "product": "VGA adapter",
      "quantity": 1,
      "promotions": [
        "we will bundle in a free VGA adapter free of charge with every MacBook Pro sold"
      ],
      "finalCost": 0
    },
    {
      "product": "Super iPad",
      "quantity": 1,
      "promotions": [
        "the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4"
      ],
      "finalCost": 549.99
    }
  ]
}

----
```