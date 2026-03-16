"use client";

import { useState, useRef, useEffect } from "react";

import { currencyFormatter } from "@/lib/utils";

import ExpenseCategoryItem from "@/Components/ExpenseCategoryItem";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "@/Components/Modal";

//Firebase
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

const DUMMY_DATA = [
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
  const [income, setIncome] = useState([]);

  console.log(income);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const amountRef = useRef();
  const descriptionRef = useRef();

  // Save a new income entry to Firestore and mirror it in local state.
  const addIncomeHandler = async (e) => {
    e.preventDefault();

    const createdAt = new Date();
    const newIncome = {
      amount: amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt,
    };

    const collectionRef = collection(db, "income");

    try {
      const docSnap = await addDoc(collectionRef, newIncome);

      setIncome((prevState) => [
        {
          id: docSnap.id,
          ...newIncome,
        },
        ...prevState,
      ]);

      amountRef.current.value = "";
      descriptionRef.current.value = "";
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete the Firestore document first, then remove it from the UI state.
  const deleteIncomeHandler = async (incomeId) => {
    try {
      const incomeDocRef = doc(db, "income", incomeId);
      await deleteDoc(incomeDocRef);

      setIncome((prevState) => {
        return prevState.filter((incomeItem) => incomeItem.id !== incomeId);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    // Load existing income entries once when the page mounts.
    const getIncomeData = async () => {
      try {
        const collectionRef = collection(db, "income");
        const docsSnap = await getDocs(collectionRef);

        const data = docsSnap.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis()),
          };
        });

        setIncome(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    getIncomeData();
  }, []);
  return (
    <>
      {/* Add Income Modal */}

      <Modal show={showAddIncomeModal} onClose={setShowAddIncomeModal}>
        <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
          <div className="input-group">
            <label htmlFor="amount">Income Amount</label>
            <input
              type="number"
              name="amount"
              ref={amountRef}
              min={0.01}
              step={0.01}
              placeholder="Enter income amount"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              ref={descriptionRef}
              placeholder="Enter income description"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Entry
          </button>
        </form>

        <div className="flex flex-col px-6 mx-auto">
          <h3 className="text-2xl font-bold">Income History</h3>

          {income.map((i) => {
            return (
              <div className="flex justify-between items-center" key={i.id}>
                <div>
                  <p className="font-semibold">{i.description}</p>
                  <small className="text-xs">{i.createdAt.toISOString()}</small>
                </div>
                <div className="flex items-center gap-3">
                  <p className="flex items-center gap-2">
                    {currencyFormatter(i.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      deleteIncomeHandler(i.id);
                    }}
                    className="text-red-400 transition hover:text-red-300"
                    aria-label={`Delete ${i.description}`}
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <main className="container max-w-2xl px-6 py-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-400 text-md">My Balance</small>
          <h2 className="text-4xl font-bold">{currencyFormatter(100000)}</h2>
          <section className=" flex items-center gap-2 py-3 ">
            <button onClick={() => {}} className="btn btn-primary">
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
            {DUMMY_DATA.map((expense) => {
              return (
                <ExpenseCategoryItem
                  key={expense.id}
                  color={expense.color}
                  title={expense.title}
                  total={expense.total}
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
                labels: DUMMY_DATA.map((expense) => expense.title),
                datasets: [
                  {
                    label: "Expenses",
                    data: DUMMY_DATA.map((expense) => expense.total),
                    backgroundColor: DUMMY_DATA.map((expense) => expense.color),
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
