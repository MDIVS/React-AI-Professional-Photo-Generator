
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import { generateProfessionalHeadshot } from './services/geminiService';
import { GenerationStatus } from './types';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{data: string, mime: string} | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('Corporate Executive');

  const handleImageSelected = (data: string, mime: string) => {
    setSelectedImage({ data, mime });
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setStatus(GenerationStatus.GENERATING);
    setError(null);

    try {
      const result = await generateProfessionalHeadshot(
        selectedImage.data,
        selectedImage.mime,
        style
      );
      
      if (result) {
        setGeneratedImage(result);
        setStatus(GenerationStatus.SUCCESS);
      } else {
        throw new Error("No image was generated. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while generating your headshot.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const loadingMessages = [
    "Analyzing facial features...",
    "Selecting premium attire...",
    "Perfecting studio lighting...",
    "Applying high-end textures...",
    "Almost ready for your LinkedIn profile..."
  ];

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  React.useEffect(() => {
    if (status === GenerationStatus.GENERATING) {
      const interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const styles = [
    "Corporate Executive",
    "Tech Entrepreneur",
    "Creative Professional",
    "Medical Professional",
    "Academic Scholar"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            AI-Powered <span className="text-blue-600">Professional</span> Headshots
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get high-quality, studio-grade LinkedIn headshots in seconds. No camera or suit required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                Upload your source photo
              </h2>
              <ImageUpload onImageSelected={handleImageSelected} />
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                Choose your style
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-4 py-3 rounded-xl text-left font-medium transition-all ${
                      style === s 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedImage || status === GenerationStatus.GENERATING}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                !selectedImage || status === GenerationStatus.GENERATING
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {status === GenerationStatus.GENERATING ? 'Generating Headshot...' : 'Generate My Headshot'}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Your AI Masterpiece</h2>
                {generatedImage && (
                  <a 
                    href={generatedImage} 
                    download="pro-headshot.png"
                    className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                )}
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50/50 min-h-[400px]">
                {status === GenerationStatus.GENERATING ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-xl font-semibold text-slate-800 animate-pulse">
                      {loadingMessages[loadingMessageIndex]}
                    </p>
                    <p className="text-slate-500 mt-2">This usually takes about 10-15 seconds</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full max-w-md mx-auto group">
                    <img 
                      src={generatedImage} 
                      alt="Generated Professional Headshot" 
                      className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                      AI Enhanced
                    </div>
                  </div>
                ) : (
                  <div className="text-center opacity-50">
                    <div className="bg-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">Your generated image will appear here</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="User" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Joined by 12,000+ professionals this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Identity Preserving</h3>
            <p className="text-slate-600">Our advanced AI models ensure that your facial features and unique identity remain intact while professionalizing your appearance.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Premium Wardrobe</h3>
            <p className="text-slate-600">Access dozens of professional outfits, from corporate suits to creative attire, without spending a dime on clothes or photography.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Instant Delivery</h3>
            <p className="text-slate-600">No more waiting weeks for proofs. Get your professional headshots in seconds and update your profiles immediately.</p>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="bg-blue-600 p-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">ProPhoto AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2024 ProPhoto AI. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 text-sm">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
