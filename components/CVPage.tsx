export default function CVPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Curriculum Vitae</h2>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base text-center"
        >
          Download PDF
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <p className="text-gray-700 text-sm sm:text-base">
          Please click the button above to view or download the full version of my CV.
        </p>
      </div>
    </div>
  );
}
