"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/store/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export const FinanceContext = createContext({
  income: [],
  expenses: [],
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const values = {
    income,
    expenses,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
  };

  useEffect(() => {
    if (!user) {
      setIncome([]);
      setExpenses([]);
      return;
    }

    // Hydrate both collections once so the rest of the app can read shared state.
    const getIncomeData = async () => {
      try {
        const collectionRef = collection(db, "income");
        const q = query(collectionRef, where("uid", "==", user.uid));
        const docsSnap = await getDocs(q);

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

    const getExpensesData = async () => {
      try {
        const collectionRef = collection(db, "expenses");
        const q = query(collectionRef, where("uid", "==", user.uid));
        const docsSnap = await getDocs(q);

        const data = docsSnap.docs.map((expenseDoc) => {
          return {
            id: expenseDoc.id,
            ...expenseDoc.data(),
          };
        });

        setExpenses(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    getIncomeData();
    getExpensesData();
  }, [user]);

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

  async function addExpenseItem(expenseCategoryId, newExpense) {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
        ...newExpense,
      });

      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];
        const foundIndex = updatedExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });

        // Mirror the Firestore update locally so the UI stays in sync.
        updatedExpenses[foundIndex] = {
          ...updatedExpenses[foundIndex],
          id: expenseCategoryId,
          ...newExpense,
        };

        return updatedExpenses;
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async function addCategory(category) {
    try {
      const collectionRef = collection(db, "expenses");
      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });

      setExpenses((prevState) => [
        ...prevState,
        {
          id: docSnap.id,
          uid: user.uid,
          items: [],
          ...category,
        },
      ]);
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async function deleteExpenseItem(updatedExpense, expenseCategoryId) {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
        ...updatedExpense,
      });

      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];
        const foundIndex = updatedExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });

        // Replace the edited category with its updated total and item list.
        updatedExpenses[foundIndex] = {
          ...updatedExpenses[foundIndex],
          id: expenseCategoryId,
          ...updatedExpense,
        };

        return updatedExpenses;
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  }

  async function deleteExpenseCategory(expenseCategoryId) {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);

      setExpenses((prevState) => {
        const updatedExpenses = prevState.filter((expense) => {
          return expense.id !== expenseCategoryId;
        });

        return [...updatedExpenses];
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
