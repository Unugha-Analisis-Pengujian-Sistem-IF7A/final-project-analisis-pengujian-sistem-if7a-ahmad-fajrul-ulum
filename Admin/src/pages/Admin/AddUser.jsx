const AddUser = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div>
        <div className="text-8xl mb-6">🚧</div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Fitur Belum Tersedia
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          👷 Halaman ini sedang dalam pengembangan.<br />
          📦 Silakan kembali lagi nanti.
        </p>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
        >
          ⬅️ Kembali
        </button>
      </div>
    </div>
  );
};

export default AddUser;
