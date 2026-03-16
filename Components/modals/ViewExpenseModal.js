"use client";

import { useContext } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { currencyFormatter } from "@/lib/utils";
import { FinanceContext } from "@/lib/store/finance-context";
import Modal from "@/Components/Modal";

function ViewExpenseModal({ show, onClose, expense }) {
  const { deleteExpenseItem, deleteExpenseCategory } = useContext(FinanceContext);

  // Remove one entry from the category and recalculate the total before saving.
  const deleteExpenseItemHandler = async (item) => {
    try {
      const updatedItems = expense.items.filter((expenseItem) => {
        return expenseItem.id !== item.id;
      });

      const updatedExpense = {
        ...expense,
        items: updatedItems,
        total: expense.total - item.amount,
      };

      await deleteExpenseItem(updatedExpense, expense.id);
      toast.success("Expense item removed successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const deleteExpenseHandler = async () => {
    try {
      await deleteExpenseCategory(expense.id);
      onClose(false);
      toast.success("Expense category deleted successfully");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex items-center justify-between">
        <h2 className="text-4xl">{expense.title}</h2>
        <button
          type="button"
          className="btn btn-danger"
          onClick={deleteExpenseHandler}
        >
          Delete
        </button>
      </div>

      <div className="my-4 text-2xl">Expense History</div>

      {(!expense.items || expense.items.length === 0) && (
        <p className="text-sm text-slate-400">
          No expense items in this category.
        </p>
      )}

      {expense.items?.map((item) => {
        return (
          <div key={item.id} className="flex items-center justify-between">
            <small>
              {item.createdAt?.toMillis
                ? new Date(item.createdAt.toMillis()).toISOString()
                : item.createdAt.toISOString()}
            </small>
            <p className="flex items-center gap-2">
              {currencyFormatter(item.amount)}
              <button
                type="button"
                onClick={() => {
                  deleteExpenseItemHandler(item);
                }}
              >
                <FaRegTrashAlt />
              </button>
            </p>
          </div>
        );
      })}
    </Modal>
  );
}

export default ViewExpenseModal;
