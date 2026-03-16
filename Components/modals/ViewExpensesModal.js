import { currencyFormatter } from "@/lib/utils";
import Modal from "@/Components/Modal";

function ViewExpensesModal({ show, onClose, expenses }) {
  return (
    <Modal show={show} onClose={onClose}>
      <div className="flex flex-col gap-4 px-6 mx-auto">
        <h3 className="text-2xl font-bold">Expense History</h3>

        {expenses.map((expense) => {
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between px-4 py-4 bg-slate-700 rounded-3xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-[25px] h-[25px] rounded-full"
                  style={{ backgroundColor: expense.color }}
                />
                <p className="font-semibold capitalize">{expense.title}</p>
              </div>
              <p>{currencyFormatter(expense.total)}</p>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

export default ViewExpensesModal;
