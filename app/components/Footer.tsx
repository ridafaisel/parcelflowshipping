// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-gray-800">ParcelFlow</span>
          </div>
          
          {/* Developer credit */}
          <div className="text-gray-600 text-sm">
            Developed by <span className="font-medium text-gray-800">Redah Alojayen</span>
          </div>
        </div>
      </div>
    </footer>
  );
}