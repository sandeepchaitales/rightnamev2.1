import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Smartphone } from "lucide-react";

export const VisibilityAnalysisCard = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <Card className={`playful-card border-l-4 h-full ${analysis.warning_triggered ? 'border-l-rose-500 ring-2 ring-rose-100' : 'border-l-emerald-500'}`}>
            <CardHeader className={`pb-2 ${analysis.warning_triggered ? 'bg-rose-50' : 'bg-emerald-50'}`}>
                <div className="flex items-center gap-2">
                    {analysis.warning_triggered ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                    ) : (
                        <Search className="w-5 h-5 text-emerald-600" />
                    )}
                    <CardTitle className={`text-sm font-bold uppercase tracking-widest ${analysis.warning_triggered ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Search Visibility Audit
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                
                {/* Warning Banner */}
                {analysis.warning_triggered && (
                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
                        <h4 className="text-rose-800 font-bold mb-1 flex items-center gap-2">
                            ⚠️ Visibility Warning
                        </h4>
                        <p className="text-sm text-rose-700 font-medium leading-relaxed">
                            {analysis.warning_reason}
                        </p>
                    </div>
                )}

                {/* Google Presence */}
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <Search className="w-3 h-3" /> Top Search Results
                    </h4>
                    {analysis.google_presence && analysis.google_presence.length > 0 ? (
                        <ul className="space-y-2">
                            {analysis.google_presence.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-sm bg-slate-50 p-3 rounded-lg text-slate-700 font-medium truncate">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400 italic">No significant presence found.</p>
                    )}
                </div>

                {/* App Store Presence */}
                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <Smartphone className="w-3 h-3" /> App Store Conflicts
                    </h4>
                    {analysis.app_store_presence && analysis.app_store_presence.length > 0 ? (
                        <ul className="space-y-2">
                            {analysis.app_store_presence.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-sm bg-slate-50 p-3 rounded-lg text-slate-700 font-medium truncate">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400 italic">Clean app store slate.</p>
                    )}
                </div>

            </CardContent>
        </Card>
    );
};
