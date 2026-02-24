export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-1">
      <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
          <p className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
            © {currentYear} Mohammed Aman Bhuiyan
          </p>
        </div>
      </div>
    </div>
  );
}
