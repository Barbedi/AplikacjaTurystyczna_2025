// src/components/Manager/Trail/TrailInfoSection.tsx
import React from "react";
import { ExtendedTrail } from "../../../assets/Data";

interface TrailInfoSectionProps {
  trail: ExtendedTrail;
}

const TrailInfoSection: React.FC<TrailInfoSectionProps> = ({ trail }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
      <h3 className="text-xl font-lora text-white mb-4 border-b border-white/20 pb-2">
        Informacje o trasie
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-white/70 text-sm mb-1">Opis</h4>
          <p className="text-white">{trail.description || "Brak opisu trasy."}</p>
        </div>
        <div>
          <h4 className="text-white/70 text-sm mb-3">Cechy</h4>
          {trail.features && trail.features.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {trail.features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`relative overflow-hidden rounded-full px-2 py-1.5 text-sm font-lora
                    border backdrop-blur-sm transition-all duration-300 hover:scale-105
                    ${index % 4 === 0 ? "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30" : ""}
                    ${index % 4 === 1 ? "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30" : ""}
                    ${index % 4 === 2 ? "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30" : ""}
                    ${index % 4 === 3 ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30" : ""}`}
                >
                  <span className="relative z-10">{feature.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-white/70 text-sm italic">
                Brak przypisanych cech do tej trasy
              </p>
            </div>
          )}
        </div>
        <div>
          <h4 className="text-white/70 text-sm mb-1">Region</h4>
          <p className="text-white font-medium">{trail.region}</p>
        </div>
        <div>
          <h4 className="text-white/70 text-sm mb-1">Utworzono</h4>
          <p className="text-white">
            {new Date(trail.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrailInfoSection;
