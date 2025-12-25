import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ArrowRight, CheckCircle, Shield, Globe, Zap, TrendingUp, Users, Building2, Star, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { ReportCarousel } from '../components/ReportPreview';

// Animated Logo Component
const AnimatedLogo = () => (
  <div className="relative w-24 h-24 md:w-32 md:h-32">
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 rounded-3xl animate-pulse opacity-50 blur-xl" />
    <div className="relative w-full h-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30">
      <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
    </div>
  </div>
);

// Stats Component
const StatItem = ({ value, label }) => (
  <div className="text-center px-6 py-4">
    <div className="text-2xl md:text-3xl font-black text-white">{value}</div>
    <div className="text-xs md:text-sm text-slate-400 font-medium mt-1">{label}</div>
  </div>
);

// Trusted By Avatars
const TrustedByAvatars = () => (
  <div className="flex items-center gap-3">
    <div className="flex -space-x-3">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-800 flex items-center justify-center"
          style={{ zIndex: 5 - i }}
        >
          <span className="text-xs text-slate-300">👤</span>
        </div>
      ))}
    </div>
    <span className="text-sm text-slate-400">Trusted by <span className="text-white font-semibold">10,000+</span> founders</span>
  </div>
);

// Feature Pill
const FeaturePill = ({ icon: Icon, text, color }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm`}>
    <Icon className={`w-4 h-4 ${color}`} />
    <span className="text-sm font-medium text-slate-300">{text}</span>
  </div>
);

// Showcase Card (for report previews)
const ShowcaseCard = ({ gradient, title, score, verdict }) => (
  <div className={`relative w-64 h-40 rounded-2xl ${gradient} p-4 flex flex-col justify-between shadow-xl transform hover:scale-105 transition-transform cursor-pointer`}>
    <div>
      <div className="text-xs text-white/60 font-medium">Brand Analysis</div>
      <div className="text-lg font-bold text-white mt-1">{title}</div>
    </div>
    <div className="flex items-center justify-between">
      <div className="text-3xl font-black text-white">{score}</div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${verdict === 'GO' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
        {verdict}
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, openAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brand_names: '',
    industry: '',
    category: '',
    product_type: 'Digital',
    usp: '',
    brand_vibe: '',
    positioning: 'Premium',
    market_scope: 'Multi-Country',
    countries: 'USA, India, UK'
  });

  const industries = [
    "Technology & Software", "E-commerce & Retail", "Finance & Banking", "Healthcare & Pharma",
    "Food & Beverage", "Fashion & Apparel", "Beauty & Cosmetics", "Travel & Hospitality",
    "Real Estate & Property", "Education & EdTech", "Media & Entertainment", "Automotive",
    "Manufacturing", "Agriculture", "Energy & Utilities", "Logistics & Supply Chain",
    "Professional Services", "Non-Profit & NGO", "Sports & Fitness", "Home & Living",
    "Pet Care", "Kids & Baby", "Jewelry & Accessories", "Gaming", "Other"
  ];

  const productTypes = [
    { value: "Physical", label: "Physical Product" },
    { value: "Digital", label: "Digital Product/App" },
    { value: "Service", label: "Service" },
    { value: "Hybrid", label: "Hybrid (Product + Service)" }
  ];

  const uspOptions = [
    { value: "Price", label: "Best value for money" },
    { value: "Quality", label: "Superior quality" },
    { value: "Speed", label: "Fastest delivery" },
    { value: "Design", label: "Beautiful design" },
    { value: "Eco-Friendly", label: "Sustainable" },
    { value: "Innovation", label: "Most innovative" }
  ];

  const brandVibes = [
    { value: "Professional", label: "Professional" },
    { value: "Playful", label: "Playful" },
    { value: "Luxurious", label: "Luxurious" },
    { value: "Minimalist", label: "Minimalist" },
    { value: "Bold", label: "Bold" },
    { value: "Innovative", label: "Innovative" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brand_names.trim()) {
      toast.error("Please enter at least one brand name");
      return;
    }
    setLoading(true);
    try {
      const brandNames = formData.brand_names.split(',').map(n => n.trim()).filter(n => n);
      const countries = formData.countries.split(',').map(c => c.trim()).filter(c => c);
      
      const payload = {
        brand_names: brandNames,
        industry: formData.industry || 'General',
        category: formData.category || 'General',
        product_type: formData.product_type,
        usp: formData.usp || '',
        brand_vibe: formData.brand_vibe || '',
        positioning: formData.positioning,
        market_scope: formData.market_scope,
        countries: countries.length > 0 ? countries : ['USA']
      };

      const result = await api.evaluate(payload);
      navigate('/dashboard', { state: { data: result, query: payload } });
    } catch (error) {
      console.error(error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-violet-600/20 via-fuchsia-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-orange-600/10 to-transparent rounded-full blur-3xl" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              RIGHTNAME
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="w-24 h-10 bg-slate-800 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Hi, {user.name?.split(' ')[0]}</span>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => openAuthModal()}
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-6"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-32">
          
          {/* Centered Hero Content */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Animated Logo */}
            <AnimatedLogo />
            
            {/* Main Headline */}
            <h1 className="mt-10 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-white">Validate Your</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
                Brand Name
              </span>
              <span className="text-white"> in Minutes</span>
            </h1>
            
            {/* Subtitle */}
            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
              AI-powered consulting-grade analysis for trademark risk, cultural resonance, 
              domain availability, and competitive positioning across global markets.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
              <Button 
                onClick={() => setShowForm(true)}
                className="h-14 px-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-orange-400 text-white font-semibold text-lg rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all"
              >
                Start Free Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="ghost"
                className="h-14 px-8 text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-lg rounded-xl"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12">
              <TrustedByAvatars />
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-20 max-w-3xl mx-auto">
            <div className="flex items-center justify-center divide-x divide-slate-700/50 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50">
              <StatItem value="50K+" label="Names Analyzed" />
              <StatItem value="30s" label="Avg Report Time" />
              <StatItem value="180+" label="Countries" />
              <StatItem value="98%" label="Accuracy" />
            </div>
          </div>
          
          {/* Showcase Cards */}
          <div className="mt-20 flex items-center justify-center gap-6 overflow-hidden">
            <ShowcaseCard gradient="bg-gradient-to-br from-violet-600 to-indigo-700" title="LUXEVA" score="89" verdict="GO" />
            <ShowcaseCard gradient="bg-gradient-to-br from-fuchsia-600 to-pink-700" title="ZENOVA" score="85" verdict="GO" />
            <ShowcaseCard gradient="bg-gradient-to-br from-orange-500 to-red-600" title="NOVAPAY" score="72" verdict="CONDITIONAL" />
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Everything You Need to Validate Your Brand</h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
                Comprehensive analysis powered by AI, delivering insights that would take consultants weeks in just seconds.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Legal Risk Matrix", desc: "Trademark conflicts, genericness, and rebranding probability analysis", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { icon: Globe, title: "Global Culture Fit", desc: "Linguistic and cultural resonance across 180+ countries", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: TrendingUp, title: "Market Positioning", desc: "Competitor analysis with strategic positioning matrices per country", color: "text-violet-400", bg: "bg-violet-500/10" },
                { icon: Zap, title: "Domain & Social", desc: "Real-time availability check for domains and social handles", color: "text-orange-400", bg: "bg-orange-500/10" },
              ].map((feature, i) => (
                <div key={i} className={`p-6 rounded-2xl ${feature.bg} border border-slate-800/50 hover:border-slate-700/50 transition-colors`}>
                  <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Report Preview Carousel */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">See What's Inside Your Report</h2>
              <p className="mt-4 text-slate-400">Detailed, actionable insights delivered in a beautiful format</p>
            </div>
            <ReportCarousel />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-950">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Validate Your Brand?</h2>
            <p className="mt-4 text-slate-400">Join thousands of founders who trust RIGHTNAME for brand validation</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="mt-8 h-14 px-10 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-orange-400 text-white font-semibold text-lg rounded-xl shadow-lg shadow-violet-500/25"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-slate-500">© 2025 RIGHTNAME. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Analysis Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Start Your Analysis</h3>
                <p className="text-sm text-slate-400 mt-1">Enter your brand details for a comprehensive report</p>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Brand Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-300">Brand Name(s) *</Label>
                <Input 
                  name="brand_names"
                  value={formData.brand_names}
                  onChange={handleChange}
                  placeholder="e.g. LUMINA, VESTRA, ZENOVA"
                  className="h-14 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl text-lg"
                  required
                />
                <p className="text-xs text-slate-500">Separate multiple names with commas</p>
              </div>

              {/* Industry & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Industry</Label>
                  <Select onValueChange={(val) => handleSelectChange('industry', val)} value={formData.industry}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                      <SelectValue placeholder="Select industry..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind} className="text-slate-300 focus:bg-slate-800 focus:text-white">{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Category</Label>
                  <Input 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. DTC Skincare"
                    className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Product Type & USP */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Product Type</Label>
                  <Select onValueChange={(val) => handleSelectChange('product_type', val)} value={formData.product_type}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {productTypes.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value} className="text-slate-300 focus:bg-slate-800 focus:text-white">{pt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">USP</Label>
                  <Select onValueChange={(val) => handleSelectChange('usp', val)} value={formData.usp}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                      <SelectValue placeholder="Select USP..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {uspOptions.map((usp) => (
                        <SelectItem key={usp.value} value={usp.value} className="text-slate-300 focus:bg-slate-800 focus:text-white">{usp.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Brand Vibe & Positioning */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Brand Vibe</Label>
                  <Select onValueChange={(val) => handleSelectChange('brand_vibe', val)} value={formData.brand_vibe}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                      <SelectValue placeholder="Select vibe..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {brandVibes.map((vibe) => (
                        <SelectItem key={vibe.value} value={vibe.value} className="text-slate-300 focus:bg-slate-800 focus:text-white">{vibe.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Positioning</Label>
                  <Select onValueChange={(val) => handleSelectChange('positioning', val)} value={formData.positioning}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="Budget" className="text-slate-300 focus:bg-slate-800 focus:text-white">Budget</SelectItem>
                      <SelectItem value="Mid-Range" className="text-slate-300 focus:bg-slate-800 focus:text-white">Mid-Range</SelectItem>
                      <SelectItem value="Premium" className="text-slate-300 focus:bg-slate-800 focus:text-white">Premium</SelectItem>
                      <SelectItem value="Luxury" className="text-slate-300 focus:bg-slate-800 focus:text-white">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Market Scope & Countries */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Market Scope</Label>
                  <Select onValueChange={(val) => handleSelectChange('market_scope', val)} value={formData.market_scope}>
                    <SelectTrigger className="h-12 bg-slate-800/50 border-slate-700 text-white rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="Single Country" className="text-slate-300 focus:bg-slate-800 focus:text-white">Single Country</SelectItem>
                      <SelectItem value="Multi-Country" className="text-slate-300 focus:bg-slate-800 focus:text-white">Multi-Country</SelectItem>
                      <SelectItem value="Global" className="text-slate-300 focus:bg-slate-800 focus:text-white">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-300">Target Countries</Label>
                  <Input 
                    name="countries"
                    value={formData.countries}
                    onChange={handleChange}
                    placeholder="USA, India, UK, Germany"
                    className="h-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 hover:from-violet-500 hover:via-fuchsia-500 hover:to-orange-400 text-white text-lg font-semibold rounded-xl shadow-lg shadow-violet-500/25"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate Report
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-slate-500">
                Free analysis • No credit card required • Results in ~30 seconds
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
