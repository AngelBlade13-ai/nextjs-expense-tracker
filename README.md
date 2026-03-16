# Finance Tracker

A personal finance tracker built with Next.js, Firebase, Firestore, Firebase Authentication, and Tailwind CSS.

Users can:
- sign in with Google
- add and delete income entries
- create expense categories
- add expense items to categories
- view and delete expense items
- delete full expense categories
- view a balance calculated from income minus expenses

## Tech Stack

- Next.js
- React
- Firebase
- Firestore
- Firebase Authentication
- Tailwind CSS
- React Toastify
- React Firebase Hooks

## Features

- Google sign-in and sign-out with Firebase Authentication
- User-specific income and expense data using Firebase `uid`
- Firestore-backed expense categories and expense items
- Context-based state management with:
  - [`AuthContext`](./lib/store/auth-context.js)
  - [`FinanceContext`](./lib/store/finance-context.js)
- Toast notifications for success and error actions
- Responsive dashboard layout
- Firestore security rules file included in [`firestore.rules`](./firestore.rules)

## Project Structure

```text
app/
  globals.css
  layout.js
  page.js
Components/
  modals/
    AddExpenseModal.js
    AddIncomeModal.js
    ViewExpenseModal.js
  ExpenseCategoryItem.js
  Modal.js
  Navigation.js
  SignIn.js
lib/
  firebase/
    index.js
  store/
    auth-context.js
    finance-context.js
firestore.rules
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

This project requires a Firebase project with:

- Firestore Database
- Firebase Authentication

### Authentication

Enable Google Authentication in Firebase:

1. Open Firebase Console
2. Go to `Build > Authentication`
3. Click `Get started`
4. Enable `Google`
5. Choose a support email
6. Save

### Firestore

Create these collections:

#### `income`

Each document should contain:

- `amount` as `number`
- `description` as `string`
- `createdAt` as `timestamp`
- `uid` as `string`

#### `expenses`

Each category document should contain:

- `title` as `string`
- `color` as `string`
- `total` as `number`
- `items` as `array`
- `uid` as `string`

Each object inside `items` should contain:

- `id` as `string`
- `amount` as `number`
- `createdAt` as `timestamp`

## Firestore Rules

The rules used for this project are included in [`firestore.rules`](./firestore.rules).

To apply them:

1. Open Firebase Console
2. Go to `Firestore Database > Rules`
3. Paste the contents of `firestore.rules`
4. Publish

These rules ensure that authenticated users can only read and modify documents that belong to their own `uid`.

## Usage Guide

### Sign In

- Open the app
- Click `Sign In With Google`
- Complete the Google login popup

### Add Income

- Click `+ Income`
- Enter amount and description
- Submit the form

### Add Expense Category

- Click `+ Expenses`
- Enter an amount
- Click `Add New Category`
- Enter a title and color
- Click `Create`

### Add Expense Item

- Click `+ Expenses`
- Enter an amount
- Select a category
- Click `Add Expense`

### View and Delete Expense Items

- Click an expense category from the dashboard
- Review the item history
- Delete a single item or the entire category

### Sign Out

- Click `Sign Out` in the navigation bar

## Notes

- The app filters Firestore data by the signed-in user's `uid`
- Existing Firestore documents must include `uid` values or they will not appear
- Google Authentication and Firestore rules must be configured in Firebase for the app to work correctly

## Submission Checklist

- GitHub repository is public or shared with the instructor
- Firebase Authentication is enabled for Google login
- Firestore rules are published
- Existing Firestore documents contain `uid`
- `npm run build` passes successfully

## Author

Created as a Next.js and Firebase finance tracker project.
