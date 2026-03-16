"use client";

import { useContext, useEffect, useState } from "react";

import { currencyFormatter } from "@/lib/utils";
import { FinanceContext } from "@/lib/store/finance-context";

import ExpenseCategoryItem from "@/Components/ExpenseCategoryItem";
import AddExpenseModal from "@/Components/modals/AddExpenseModal";
import AddIncomeModal from "@/Components/modals/AddIncomeModal";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
  const { income, expenses } = useContext(FinanceContext);
  const [balance, setBalance] = useState(0);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Recalculate the balance whenever either collection changes.
  useEffect(() => {
    const newBalance =
      income.reduce((total, incomeItem) => {
        return total + incomeItem.amount;
      }, 0) -
      expenses.reduce((total, expense) => {
        return total + expense.total;
      }, 0);

    setBalance(newBalance);
  }, [income, expenses]);

  return (
    <>
      <AddExpenseModal
        show={showAddExpenseModal}
        onClose={setShowAddExpenseModal}
      />

      <AddIncomeModal
        show={showAddIncomeModal}
        onClose={setShowAddIncomeModal}
      />

      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(balance)}</h2>
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
          <h3 className=" text-2xl">My Expenses</h3>
          <div className=" flex flex-col gap-4 mt-6 ">
            {expenses.map((expense) => {
              return (
                <ExpenseCategoryItem key={expense.id} expense={expense} />
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
