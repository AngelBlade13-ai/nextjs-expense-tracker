import Modal from "@/Components/Modal";

function AddExpenseModal({
  show,
  onClose,
  onSubmit,
  expenseTitleRef,
  expenseAmountRef,
  expenseColorRef,
}) {
  return (
    <Modal show={show} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="input-group">
          <label htmlFor="expense-title">Expense Name</label>
          <input
            id="expense-title"
            type="text"
            name="expense-title"
            ref={expenseTitleRef}
            placeholder="Enter expense category"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="expense-amount">Expense Amount</label>
          <input
            id="expense-amount"
            type="number"
            name="expense-amount"
            ref={expenseAmountRef}
            min={0.01}
            step={0.01}
            placeholder="Enter expense amount"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="expense-color">Accent Color</label>
          <input
            id="expense-color"
            type="color"
            name="expense-color"
            ref={expenseColorRef}
            defaultValue="#0f766e"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Expense
        </button>
      </form>
    </Modal>
  );
}

export default AddExpenseModal;
