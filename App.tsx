import React, { useState, useEffect, useRef } from 'react';
import { UserRole, AppView, Language, Crop, HealthAnalysisResult } from './types';
import { TRANSLATIONS, APP_NAME, MOCK_CROPS } from './constants';
import { Icons } from './components/Icons';
import { GovDashboard } from './components/GovDashboard';
import { analyzeCropImage, fileToBase64, getGeneralAdvice } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [lang, setLang] = useState<Language>(Language.ENGLISH);
  const [crops, setCrops] = useState<Crop[]>(MOCK_CROPS);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Analysis State
  const [analysisResult, setAnalysisResult] = useState<HealthAnalysisResult | null>(null);
  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper for Translation
  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  // Navigation Logic
  const navigateTo = (newView: AppView) => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  // Handlers
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === UserRole.FARMER) navigateTo(AppView.FARMER_DASHBOARD);
    if (selectedRole === UserRole.GOV_OFFICIAL) navigateTo(AppView.GOV_DASHBOARD);
  };

  const handleLogout = () => {
    setRole(UserRole.GUEST);
    navigateTo(AppView.LANDING);
    setAnalysisResult(null);
    setAnalysisImage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setAnalysisImage(`data:image/jpeg;base64,${base64}`);
        setAnalysisResult(null); // Reset previous result
        setIsAnalyzing(true);
        
        // Find selected crop context or default
        const cropContext = crops.find(c => c.id === selectedCropId) || {};
        
        // Mock Weather for context (in production use real API)
        const mockWeather = { temp: 28, condition: 'Humid' };

        const result = await analyzeCropImage(base64, cropContext, mockWeather);
        setAnalysisResult(result);
      } catch (err) {
        alert("Failed to analyze image. Please ensure API Key is set.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleAddCrop = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCrop: Crop = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      areaSize: Number(formData.get('area')),
      sowingDate: new Date().toISOString().split('T')[0],
      location: 'Local Farm',
      soilType: formData.get('soil') as string,
      healthStatus: 'Healthy',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/400/300`
    };
    setCrops([...crops, newCrop]);
    navigateTo(AppView.FARMER_DASHBOARD);
  };

  // --- Views ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-earth-50 to-earth-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-earth-500 p-4 rounded-full">
             <Icons.Sprout className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-earth-800 mb-2">{APP_NAME}</h1>
        <p className="text-gray-600 mb-8">{t('welcome')}</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {(Object.values(Language) as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`p-2 text-sm rounded-lg border ${lang === l ? 'bg-earth-100 border-earth-500 text-earth-700 font-bold' : 'border-gray-200 text-gray-500'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-medium text-gray-700 mb-4">{t('roleSelect')}</h2>
          
          <button
            onClick={() => handleLogin(UserRole.FARMER)}
            className="w-full flex items-center justify-center gap-3 bg-earth-600 hover:bg-earth-700 text-white p-4 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Icons.User className="w-5 h-5" />
            <span className="font-semibold text-lg">{t('farmer')}</span>
          </button>
          
          <button
            onClick={() => handleLogin(UserRole.GOV_OFFICIAL)}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-earth-200 hover:bg-earth-50 text-earth-700 p-4 rounded-xl transition-all"
          >
            <Icons.BarChart3 className="w-5 h-5" />
            <span className="font-semibold text-lg">{t('gov')}</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderFarmerDashboard = () => (
    <div className="space-y-6">
      {/* Weather Widget (Mock) */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">28°C</h2>
          <p className="opacity-90">Partly Cloudy • Humid</p>
          <div className="mt-2 text-sm bg-white/20 inline-block px-3 py-1 rounded-full">
            Local Forecast: Rain expected in 2 days
          </div>
        </div>
        <Icons.CloudSun className="w-16 h-16 opacity-80" />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-earth-900">{t('myCrops')}</h2>
        <button 
          onClick={() => navigateTo(AppView.CROP_REGISTRY)}
          className="flex items-center gap-2 bg-earth-600 text-white px-4 py-2 rounded-lg hover:bg-earth-700 transition-colors shadow-sm"
        >
          <Icons.Sprout className="w-4 h-4" />
          {t('addCrop')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {crops.map(crop => (
          <div key={crop.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-earth-100 hover:border-earth-300 transition-all group">
            <div className="h-48 overflow-hidden relative">
              <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm
                ${crop.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {crop.healthStatus}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{crop.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{crop.type} • {crop.areaSize} Acres • {crop.sowingDate}</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedCropId(crop.id);
                    navigateTo(AppView.HEALTH_CHECK);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-earth-50 text-earth-700 py-2 rounded-lg border border-earth-200 hover:bg-earth-100 font-medium text-sm"
                >
                  <Icons.Activity className="w-4 h-4" />
                  Check Health
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHealthCheck = () => (
    <div className="space-y-6">
       <button onClick={() => navigateTo(AppView.FARMER_DASHBOARD)} className="text-earth-600 flex items-center gap-1 text-sm font-medium hover:underline">
         ← Back to Dashboard
       </button>
       
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100">
         <h2 className="text-2xl font-bold text-earth-900 mb-2">{t('checkHealth')}</h2>
         <p className="text-gray-500 mb-6">Upload a photo of your crop leaf or stem. Our AI will analyze diseases, pests, and nutrient needs.</p>
         
         {!analysisImage ? (
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-earth-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-earth-50 transition-colors"
           >
             <div className="bg-earth-100 p-4 rounded-full mb-4">
               <Icons.Camera className="w-8 h-8 text-earth-600" />
             </div>
             <p className="font-medium text-earth-800">Tap to take photo or upload</p>
             <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG</p>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleImageUpload}
             />
           </div>
         ) : (
           <div className="space-y-6">
             <div className="relative h-64 rounded-xl overflow-hidden bg-black/5">
                <img src={analysisImage} alt="Analysis Target" className="w-full h-full object-contain" />
                <button 
                  onClick={() => {
                    setAnalysisImage(null);
                    setAnalysisResult(null);
                  }}
                  className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-gray-700"
                >
                  <Icons.X className="w-5 h-5" />
                </button>
             </div>

             {isAnalyzing && (
               <div className="text-center py-8">
                 <div className="animate-spin w-8 h-8 border-4 border-earth-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                 <p className="text-earth-700 font-medium">{t('analyzing')}</p>
                 <p className="text-xs text-gray-400 mt-2">Powered by Gemini 2.5 Flash</p>
               </div>
             )}

             {analysisResult && (
               <div className="animate-fade-in space-y-4">
                 <div className="bg-earth-50 border border-earth-200 p-5 rounded-xl">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-earth-900">{analysisResult.diagnosis}</h3>
                       <p className="text-sm text-earth-600">Confidence: {analysisResult.confidence}%</p>
                     </div>
                     <span className="bg-earth-200 text-earth-800 text-xs px-2 py-1 rounded font-bold">AI Diagnosis</span>
                   </div>
                   
                   <div className="grid md:grid-cols-2 gap-4">
                     <div>
                       <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                         <Icons.AlertTriangle className="w-4 h-4 text-orange-500" /> Symptoms
                       </h4>
                       <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                         {analysisResult.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                       </ul>
                     </div>
                     <div>
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                         <Icons.Activity className="w-4 h-4 text-green-500" /> Treatment
                       </h4>
                       <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                         {analysisResult.treatment.map((t, i) => <li key={i}>{t}</li>)}
                       </ul>
                     </div>
                   </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                       <Icons.Droplets className="w-4 h-4" /> Irrigation Advice
                     </h4>
                     <p className="text-sm text-blue-700">{analysisResult.irrigationAdvice}</p>
                   </div>
                   <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                     <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                       <Icons.Sprout className="w-4 h-4" /> Fertilizer
                     </h4>
                     <p className="text-sm text-amber-700">{analysisResult.fertilizerRecommendation}</p>
                   </div>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>
    </div>
  );

  const renderCropRegistry = () => (
    <div className="space-y-6">
      <button onClick={() => navigateTo(AppView.FARMER_DASHBOARD)} className="text-earth-600 flex items-center gap-1 text-sm font-medium hover:underline">
         ← Back to Dashboard
      </button>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-earth-900 mb-6">{t('addCrop')}</h2>
        <form onSubmit={handleAddCrop} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
            <input name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-earth-500 outline-none" placeholder="e.g. North Field Wheat" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white">
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Corn">Corn</option>
                <option value="Cotton">Cotton</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (Acres)</label>
              <input name="area" type="number" step="0.1" required className="w-full p-3 border border-gray-300 rounded-lg outline-none" placeholder="0.0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
            <select name="soil" className="w-full p-3 border border-gray-300 rounded-lg outline-none bg-white">
                <option value="Loamy">Loamy</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Silt">Silt</option>
              </select>
          </div>
          <button type="submit" className="w-full bg-earth-600 text-white font-bold py-3 rounded-xl hover:bg-earth-700 transition-colors shadow-md mt-4">
            Register Crop
          </button>
        </form>
      </div>
    </div>
  );

  // --- Main Render ---

  if (role === UserRole.GUEST) return renderLanding();

  return (
    <div className="min-h-screen bg-earth-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-earth-100 z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-earth-50 flex items-center gap-3">
          <div className="bg-earth-500 p-2 rounded-lg">
            <Icons.Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-earth-800">AgriGuard</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {role === UserRole.FARMER && (
            <>
              <button 
                onClick={() => navigateTo(AppView.FARMER_DASHBOARD)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === AppView.FARMER_DASHBOARD ? 'bg-earth-50 text-earth-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Icons.Activity className="w-5 h-5" /> {t('dashboard')}
              </button>
              <button 
                onClick={() => navigateTo(AppView.CROP_REGISTRY)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === AppView.CROP_REGISTRY ? 'bg-earth-50 text-earth-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Icons.Leaf className="w-5 h-5" /> Crops
              </button>
            </>
          )}
          
          {role === UserRole.GOV_OFFICIAL && (
             <button 
                onClick={() => navigateTo(AppView.GOV_DASHBOARD)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === AppView.GOV_DASHBOARD ? 'bg-earth-50 text-earth-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Icons.BarChart3 className="w-5 h-5" /> Analytics
              </button>
          )}

          <div className="pt-8 mt-8 border-t border-earth-50">
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors">
                <Icons.LogOut className="w-5 h-5" /> Logout
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="bg-white border-b border-earth-100 p-4 sticky top-0 z-10 flex items-center justify-between">
          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsSidebarOpen(true)}>
            <Icons.Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
             <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{role === UserRole.FARMER ? 'Farmer Mode' : 'Gov Dashboard'}</span>
             <div className="w-8 h-8 bg-earth-200 rounded-full flex items-center justify-center text-earth-700 font-bold">
               {role === UserRole.FARMER ? 'F' : 'G'}
             </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {view === AppView.FARMER_DASHBOARD && renderFarmerDashboard()}
          {view === AppView.HEALTH_CHECK && renderHealthCheck()}
          {view === AppView.CROP_REGISTRY && renderCropRegistry()}
          {view === AppView.GOV_DASHBOARD && <GovDashboard />}
        </div>
      </main>
    </div>
  );
};

export default App;