function Modal({ show, onClose, children }) {
  return (
    <div
      style={{
        transform: show ? "translateX(0%)" : "translateX(-200%)",
      }}
      className="fixed top-0 left-0 z-10 flex items-start w-full h-full px-4 py-6 overflow-y-auto transition-all duration-500 bg-slate-950/70"
    >
      <div className="container max-w-2xl p-4 mx-auto border rounded-3xl bg-slate-800 border-slate-700 min-h-[80vh]">
        <button
          type="button"
          onClick={() => {
            onClose(false);
          }}
          className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
