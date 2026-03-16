"use client";

import { useState, useRef } from "react";

import { currencyFormatter } from "@/lib/utils";

import ExpenseCategoryItem from "@/Components/ExpenseCategoryItem";
import AddExpenseModal from "@/Components/modals/AddExpenseModal";
import AddIncomeModal from "@/Components/modals/AddIncomeModal";
import ViewExpensesModal from "@/Components/modals/ViewExpensesModal";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const INITIAL_EXPENSES = [
  {
    id: 1,
    title: "Entertainment",
    color: "#000",
    total: 500,
  },
  {
    id: 2,
    title: "Gas",
    color: "#009",
    total: 200,
  },
  {
    id: 3,
    title: "Food",
    color: "#081",
    total: 1200,
  },
  {
    id: 4,
    title: "Movies",
    color: "#007",
    total: 800,
  },
  {
    id: 5,
    title: "Holiday",
    color: "#006",
    total: 2000,
  },
];

export default function Home() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const expenseTitleRef = useRef();
  const expenseAmountRef = useRef();
  const expenseColorRef = useRef();

  // Keep expense creation local for now so the page and chart update together.
  const addExpenseHandler = (e) => {
    e.preventDefault();

    const newExpense = {
      id: crypto.randomUUID(),
      title: expenseTitleRef.current.value,
      total: Number(expenseAmountRef.current.value),
      color: expenseColorRef.current.value,
    };

    setExpenses((prevState) => [newExpense, ...prevState]);

    expenseTitleRef.current.value = "";
    expenseAmountRef.current.value = "";
    expenseColorRef.current.value = "#0f766e";
    setShowAddExpenseModal(false);
  };
  return (
    <>
      <AddExpenseModal
        show={showAddExpenseModal}
        onClose={setShowAddExpenseModal}
        onSubmit={addExpenseHandler}
        expenseTitleRef={expenseTitleRef}
        expenseAmountRef={expenseAmountRef}
        expenseColorRef={expenseColorRef}
      />

      <AddIncomeModal
        show={showAddIncomeModal}
        onClose={setShowAddIncomeModal}
      />

      <ViewExpensesModal
        show={showExpensesModal}
        onClose={setShowExpensesModal}
        expenses={expenses}
      />

      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(100000)}</h2>
          <section className=" flex items-center gap-2 py-3 ">
            <button
              onClick={() => {
                setShowAddExpenseModal(true);
              }}
              className="btn btn-primary"
            >
              + Expenses
            </button>
            <button
              onClick={() => {
                setShowAddIncomeModal(true);
              }}
              className="btn btn-primary-outline"
            >
              + Income
            </button>
          </section>
        </section>

        {/* Expenses */}
        <section className=" py-6 ">
          <div className="flex items-center justify-between">
            <h3 className=" text-2xl">My Expenses</h3>
            <button
              type="button"
              onClick={() => {
                setShowExpensesModal(true);
              }}
              className="btn btn-primary-outline"
            >
              View All
            </button>
          </div>
          <div className=" flex flex-col gap-4 mt-6 ">
            {expenses.map((expense) => {
              return (
                <ExpenseCategoryItem
                  key={expense.id}
                  color={expense.color}
                  title={expense.title}
                  total={expense.total}
                  onClick={() => {
                    setShowExpensesModal(true);
                  }}
                />
              );
            })}
          </div>
        </section>

        {/* Chart Section */}
        <section className=" py-6 ">
          <h3 className="text-2xl">Stats</h3>
          <div className="w-1/2 mx-auto">
            <Doughnut
              data={{
                labels: expenses.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: expenses.map((expense) => expense.total),
                    backgroundColor: expenses.map((expense) => expense.color),
                    borderColor: ["#18181b"],
                    borderWidth: 5,
                  },
                ],
              }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
