import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Sparkles, Zap, Crown, ArrowRight, Shield, Clock, FileText, Globe, Users, Star, Gift } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from '../components/Footer';

const PricingPage = () => {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "first report",
      description: "Try RIGHTNAME risk-free",
      icon: Gift,
      color: "bg-emerald-500",
      borderColor: "border-emerald-200",
      popular: false,
      features: [
        "1 Free Brand Evaluation Report",
        "Full NameScore Analysis (0-100)",
        "Trademark Risk Matrix",
        "Domain Availability Check",
        "Social Handle Check",
        "Competitive Landscape",
        "PDF Export",
      ],
      cta: "Start Free",
      ctaLink: "/",
    },
    {
      name: "Single Report",
      price: "$29",
      period: "per report",
      description: "Perfect for one-off evaluations",
      icon: FileText,
      color: "bg-blue-600",
      borderColor: "border-blue-200",
      popular: false,
      features: [
        "Everything in Free, plus:",
        "Real-time Trademark Research",
        "Country-Specific Costs",
        "Legal Precedents Analysis",
        "Mitigation Strategies",
        "Alternative Name Suggestions",
        "Priority Processing",
      ],
      cta: "Buy Report",
      ctaLink: "/",
    },
    {
      name: "3-Report Bundle",
      price: "$49",
      period: "for 3 reports",
      description: "Best value for comparing options",
      icon: Crown,
      color: "bg-violet-600",
      borderColor: "border-violet-300",
      popular: true,
      savings: "Save $38",
      features: [
        "Everything in Single Report, plus:",
        "3 Full Brand Evaluations",
        "Compare Multiple Names",
        "Side-by-Side Analysis",
        "Bulk PDF Export",
        "90-Day Report Access",
        "Email Support",
      ],
      cta: "Get Bundle",
      ctaLink: "/",
    },
  ];

  const features = [
    { icon: Shield, title: "Trademark Protection", desc: "Real-time trademark database searches" },
    { icon: Globe, title: "Global Coverage", desc: "15+ countries with local costs" },
    { icon: Clock, title: "60-Second Reports", desc: "AI-powered instant analysis" },
    { icon: Users, title: "Trusted by 500+", desc: "Brand consultants & startups" },
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | RIGHTNAME - AI Brand Name Evaluation</title>
        <meta name="description" content="RIGHTNAME pricing: First report FREE, then $29 per report or $49 for 3 reports. Get consulting-grade brand name evaluation with trademark analysis." />
        <meta property="og:title" content="Pricing | RIGHTNAME" />
        <meta property="og:description" content="First report FREE. Single reports $29. Bundle of 3 for $49. AI-powered brand name evaluation." />
        <link rel="canonical" href="https://rightname.ai/pricing" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/20">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="https://customer-assets.emergentagent.com/job_name-radar-1/artifacts/a4ppykdi_RIGHTNAME.AI.png" 
                  alt="RIGHTNAME Logo" 
                  className="w-10 h-10 rounded-xl"
                />
                <span className="font-black text-xl text-slate-900">RIGHTNAME</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
                <Link to="/pricing" className="text-sm font-semibold text-blue-600">Pricing</Link>
                <Link to="/blog" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Blog</Link>
              </nav>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6">
                  Try Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 font-bold px-4 py-1">
              <Gift className="w-3 h-3 mr-1" /> First Report FREE
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
              Simple, Transparent{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              No subscriptions. No hidden fees. Just pay for what you need.
              <br />
              <span className="font-bold text-emerald-600">Your first report is completely free!</span>
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular ? 'border-2 border-violet-400 shadow-xl scale-105' : 'border-2 ' + plan.borderColor
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                      MOST POPULAR
                    </div>
                  )}
                  {plan.savings && (
                    <div className="absolute top-0 left-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-br-xl">
                      {plan.savings}
                    </div>
                  )}
                  <CardHeader className="text-center pt-8 pb-4">
                    <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-500">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 ml-2">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-violet-600' : 'text-emerald-500'}`} />
                          <span className="text-slate-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={plan.ctaLink}>
                      <Button 
                        className={`w-full font-bold py-6 rounded-xl text-lg ${
                          plan.popular 
                            ? 'bg-violet-600 hover:bg-violet-700 text-white' 
                            : index === 0 
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
              Every Report Includes
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Is the first report really free?",
                  a: "Yes! Your first brand evaluation report is completely free with no credit card required. Try RIGHTNAME and see the value before you pay."
                },
                {
                  q: "How long is a report valid?",
                  a: "Reports remain accessible for 90 days. Trademark landscapes can change, so we recommend re-evaluating if you delay registration by several months."
                },
                {
                  q: "Can I evaluate multiple brand names at once?",
                  a: "Yes! Each report can analyze up to 3 brand name options with side-by-side comparison and recommendations."
                },
                {
                  q: "Do you offer refunds?",
                  a: "Since the first report is free, you can evaluate the quality before purchasing. We offer refunds within 24 hours if you're not satisfied."
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-violet-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Validate Your Brand Name?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start with a free report. No credit card required.
            </p>
            <Link to="/">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6 rounded-full">
                Get Your Free Report <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PricingPage;
