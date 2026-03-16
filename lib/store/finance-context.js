"use client";

import { createContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const FinanceContext = createContext({
  income: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);

  const values = {
    income,
    addIncomeItem,
    removeIncomeItem,
  };

  useEffect(() => {
    const getIncomeData = async () => {
      try {
        const collectionRef = collection(db, "income");
        const docsSnap = await getDocs(collectionRef);

        const data = docsSnap.docs.map((incomeDoc) => {
          return {
            id: incomeDoc.id,
            ...incomeDoc.data(),
            createdAt: new Date(incomeDoc.data().createdAt.toMillis()),
          };
        });

        setIncome(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    getIncomeData();
  }, []);

  // Persist a new income entry and reflect it in shared state immediately.
  async function addIncomeItem(newIncome) {
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
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  // Delete the Firestore document first, then remove it from local state.
  async function removeIncomeItem(incomeId) {
    try {
      const incomeDocRef = doc(db, "income", incomeId);
      await deleteDoc(incomeDocRef);

      setIncome((prevState) => {
        return prevState.filter((incomeItem) => incomeItem.id !== incomeId);
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  return (
    <FinanceContext.Provider value={values}>{children}</FinanceContext.Provider>
  );
}
