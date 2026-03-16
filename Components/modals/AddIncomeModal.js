"use client";

import { useContext, useRef } from "react";
import { currencyFormatter } from "@/lib/utils";
import { FinanceContext } from "@/lib/store/finance-context";
import { FaRegTrashAlt } from "react-icons/fa";
import Modal from "@/Components/Modal";

function AddIncomeModal({ show, onClose }) {
  const amountRef = useRef();
  const descriptionRef = useRef();
  const ctx = useContext(FinanceContext);
  const { income, addIncomeItem, removeIncomeItem } = ctx;

  // Submit a new entry through the shared finance context.
  const addIncomeHandler = async (e) => {
    e.preventDefault();

    const newIncome = {
      amount: amountRef.current.value,
      description: descriptionRef.current.value,
      createdAt: new Date(),
    };

    try {
      await addIncomeItem(newIncome);
      amountRef.current.value = "";
      descriptionRef.current.value = "";
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteIncomeHandler = async (incomeId) => {
    try {
      await removeIncomeItem(incomeId);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
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

        {income.map((incomeItem) => {
          return (
            <div
              className="flex justify-between items-center"
              key={incomeItem.id}
            >
              <div>
                <p className="font-semibold">{incomeItem.description}</p>
                <small className="text-xs">
                  {incomeItem.createdAt.toISOString()}
                </small>
              </div>
              <div className="flex items-center gap-3">
                <p className="flex items-center gap-2">
                  {currencyFormatter(incomeItem.amount)}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    deleteIncomeHandler(incomeItem.id);
                  }}
                  className="text-red-400 transition hover:text-red-300"
                  aria-label={`Delete ${incomeItem.description}`}
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default AddIncomeModal;
