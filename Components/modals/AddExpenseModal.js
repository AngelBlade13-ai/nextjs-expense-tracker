"use client";

import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Modal from "@/Components/Modal";
import { FinanceContext } from "@/lib/store/finance-context";

function AddExpenseModal({ show, onClose }) {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const titleRef = useRef();
  const colorRef = useRef();
  const { expenses, addExpenseItem, addCategory } = useContext(FinanceContext);

  // Build the updated category object, then persist it through context.
  const addExpenseItemHandler = async () => {
    const expense = expenses.find((expenseItem) => {
      return expenseItem.id === selectedCategory;
    });

    const newExpense = {
      color: expense.color,
      title: expense.title,
      total: expense.total + +expenseAmount,
      items: [
        ...(expense.items || []),
        {
          amount: +expenseAmount,
          createdAt: new Date(),
          id: uuidv4(),
        },
      ],
    };

    try {
      await addExpenseItem(selectedCategory, newExpense);
      setExpenseAmount("");
      setSelectedCategory(null);
      setShowAddExpense(false);
      onClose(false);
      toast.success("Expense item added");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const addCategoryHandler = async () => {
    const title = titleRef.current.value;
    const color = colorRef.current.value;

    if (!title.trim()) {
      toast.error("Category title is required");
      return;
    }

    try {
      await addCategory({
        title: title.trim(),
        color,
        total: 0,
      });

      setShowAddExpense(false);
      titleRef.current.value = "";
      colorRef.current.value = "#22c55e";
      toast.success("Category created");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const closeAddExpenseModal = () => {
    setExpenseAmount("");
    setSelectedCategory(null);
    setShowAddExpense(false);
    onClose(false);
  };

  return (
    <Modal show={show} onClose={closeAddExpenseModal}>
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="expense-amount">Enter an amount</label>
          <input
            id="expense-amount"
            type="number"
            min={0.01}
            step={0.01}
            placeholder="Enter expense amount"
            value={expenseAmount}
            onChange={(event) => {
              setExpenseAmount(event.target.value);
            }}
          />
        </div>

        {expenseAmount > 0 && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl capitalize">Select Expense Category</h3>
              <button
                type="button"
                className="text-lime-400"
                onClick={() => {
                  setShowAddExpense(true);
                }}
              >
                Add New Category
              </button>
            </div>

            {showAddExpense && (
              // This inline form creates brand-new expense categories on demand.
              <div className="flex flex-wrap items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Enter title"
                  ref={titleRef}
                  required
                />
                <label htmlFor="expense-color-picker">Pick Color</label>
                <input
                  id="expense-color-picker"
                  type="color"
                  ref={colorRef}
                  defaultValue="#22c55e"
                  className="w-24 h-10"
                />
                <button
                  type="button"
                  className="btn btn-primary-outline"
                  onClick={addCategoryHandler}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowAddExpense(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {expenses.map((expense) => {
              return (
                <button
                  type="button"
                  key={expense.id}
                  onClick={() => {
                    setSelectedCategory(expense.id);
                  }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl"
                    style={{
                      boxShadow:
                        expense.id === selectedCategory
                          ? "1px 1px 4px"
                          : "",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-[25px] h-[25px] rounded-full"
                        style={{ backgroundColor: expense.color }}
                      />
                      <h4 className="capitalize">{expense.title}</h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {expenseAmount > 0 && selectedCategory !== null && (
          <div className="mt-6">
            <button
              type="button"
              className="btn btn-primary"
              onClick={addExpenseItemHandler}
            >
              Add Expense
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default AddExpenseModal;
